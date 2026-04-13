import { Octokit } from '@octokit/rest';
import { RepoFile } from '../types/index.js';

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
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
  async fetchRepoFiles(owner: string, repo: string): Promise<RepoFile[]> {
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

    // Use Git Blob API - more efficient than content API
    // Fetch in parallel batches
    const batchSize = 15;
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
          } catch (error) {
            console.warn(`⚠️ Failed to fetch: ${item.path}`);
          }
          return null;
        })
      );

      files.push(...batchResults.filter((f): f is RepoFile => f !== null));
      
      // Log progress
      console.log(`📊 Progress: ${Math.min(i + batchSize, supportedFiles.length)}/${supportedFiles.length} files`);
    }

    return files;
  }
}
