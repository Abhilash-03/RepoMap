import { Octokit } from '@octokit/rest';
import { RepoFile } from '../types/index.js';

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface FetchResult {
  files: RepoFile[];
  totalFound: number;
  successfullyFetched: number;
  failedToFetch: number;
  warning?: string;
}

export class GitHubService {
  private octokit: Octokit;
  public rateLimit: RateLimitInfo | null = null;
  
  // File extensions to analyze
  private readonly SUPPORTED_EXTENSIONS = [
    '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'
  ];

  // Directories to skip
  private readonly SKIP_DIRS = [
    'node_modules', 'dist', 'build', '.git', 'coverage',
    'vendor', '__pycache__', '.next', '.nuxt', 'out'
  ];

  constructor(userToken?: string) {
    // Prefer user token, then env token, then unauthenticated
    const token = userToken || process.env.GITHUB_TOKEN || undefined;
    this.octokit = new Octokit({
      auth: token,
    });
    
    if (token) {
      console.log('🔐 Using authenticated GitHub API (5000 req/hr)');
    } else {
      console.log('⚠️ Using unauthenticated GitHub API (60 req/hr)');
    }
  }

  private updateRateLimit(headers: Record<string, string | number | undefined>) {
    if (headers['x-ratelimit-limit']) {
      this.rateLimit = {
        limit: Number(headers['x-ratelimit-limit']),
        remaining: Number(headers['x-ratelimit-remaining']),
        reset: new Date(Number(headers['x-ratelimit-reset']) * 1000),
      };
    }
  }

  // Fetch all JS/TS files from a repository using Git Blob API (more efficient)
  async fetchRepoFiles(owner: string, repo: string): Promise<FetchResult> {
    const files: RepoFile[] = [];
    
    // Get the repository tree recursively
    let refData;
    try {
      const response = await this.octokit.git.getRef({
        owner,
        repo,
        ref: 'heads/main',
      });
      refData = response.data;
      this.updateRateLimit(response.headers as Record<string, string | number | undefined>);
    } catch {
      // Try 'master' if 'main' doesn't exist
      const response = await this.octokit.git.getRef({
        owner,
        repo,
        ref: 'heads/master',
      });
      refData = response.data;
      this.updateRateLimit(response.headers as Record<string, string | number | undefined>);
    }

    const treeResponse = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: refData.object.sha,
      recursive: 'true',
    });
    this.updateRateLimit(treeResponse.headers as Record<string, string | number | undefined>);

    // Filter for supported files
    const supportedFiles = treeResponse.data.tree.filter(item => {
      if (item.type !== 'blob' || !item.path) return false;
      
      // Skip certain directories
      if (this.SKIP_DIRS.some(dir => item.path!.includes(`/${dir}/`) || item.path!.startsWith(`${dir}/`))) {
        return false;
      }

      // Check extension
      return this.SUPPORTED_EXTENSIONS.some(ext => item.path!.endsWith(ext));
    });

    console.log(`📂 Fetching content for ${supportedFiles.length} files...`);
    
    // Check rate limit before starting
    if (this.rateLimit && this.rateLimit.remaining < supportedFiles.length + 5) {
      const resetTime = this.rateLimit.reset.toLocaleTimeString();
      console.warn(`⚠️ Rate limit low: ${this.rateLimit.remaining} remaining, need ~${supportedFiles.length}`);
      console.warn(`⚠️ Rate limit resets at: ${resetTime}`);
      
      if (this.rateLimit.remaining < 10) {
        throw new Error(`GitHub API rate limit exceeded. Only ${this.rateLimit.remaining} requests remaining. Resets at ${resetTime}. Please add a GitHub token for 5000 requests/hour.`);
      }
    }

    // Use Git Blob API - more efficient than content API
    // Fetch in parallel batches with delay to avoid rate limiting
    const batchSize = 10; // Reduced batch size
    const batchDelay = 100; // ms delay between batches
    
    for (let i = 0; i < supportedFiles.length; i += batchSize) {
      const batch = supportedFiles.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            // Use git blob API - single call per file, more efficient
            const { data, headers } = await this.octokit.git.getBlob({
              owner,
              repo,
              file_sha: item.sha!,
            });
            this.updateRateLimit(headers as Record<string, string | number | undefined>);

            return {
              path: item.path!,
              content: Buffer.from(data.content, 'base64').toString('utf-8'),
              sha: item.sha!,
            };
          } catch (error: any) {
            // Log more detailed error info
            if (error?.status === 403) {
              console.error(`❌ Rate limit hit while fetching: ${item.path}`);
            } else if (error?.status === 404) {
              console.warn(`⚠️ File not found: ${item.path}`);
            } else {
              console.warn(`⚠️ Failed to fetch: ${item.path} (${error?.message || 'unknown error'})`);
            }
          }
          return null;
        })
      );

      files.push(...batchResults.filter((f): f is RepoFile => f !== null));
      
      // Log progress with rate limit info
      const remaining = this.rateLimit?.remaining || 'unknown';
      console.log(`📊 Progress: ${Math.min(i + batchSize, supportedFiles.length)}/${supportedFiles.length} files (API calls remaining: ${remaining})`);
      
      // Small delay between batches to be gentle on API
      if (i + batchSize < supportedFiles.length) {
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    }
    
    // Calculate stats
    const totalFound = supportedFiles.length;
    const successfullyFetched = files.length;
    const failedToFetch = totalFound - successfullyFetched;
    const successRate = ((successfullyFetched / totalFound) * 100).toFixed(1);
    
    console.log(`✅ Successfully fetched ${successfullyFetched}/${totalFound} files (${successRate}%)`);
    
    // Build warning message if many files failed
    let warning: string | undefined;
    if (failedToFetch > 0) {
      if (successfullyFetched < totalFound * 0.5) {
        warning = `Only ${successfullyFetched} of ${totalFound} files were fetched (${successRate}%). This is likely due to GitHub API rate limiting. Please add a GitHub personal access token to get 5000 requests/hour instead of 60.`;
        console.warn(`⚠️ ${warning}`);
      } else if (failedToFetch > 5) {
        warning = `${failedToFetch} files could not be fetched. Results may be incomplete.`;
        console.warn(`⚠️ ${warning}`);
      }
    }

    return {
      files,
      totalFound,
      successfullyFetched,
      failedToFetch,
      warning,
    };
  }
}
