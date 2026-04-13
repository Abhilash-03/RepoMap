import { Octokit } from '@octokit/rest';
import { RepoFile } from '../types/index.js';

export class GitHubService {
  private octokit: Octokit;
  
  // File extensions to analyze
  private readonly SUPPORTED_EXTENSIONS = [
    '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'
  ];

  // Directories to skip
  private readonly SKIP_DIRS = [
    'node_modules', 'dist', 'build', '.git', 'coverage',
    'vendor', '__pycache__', '.next', '.nuxt', 'out'
  ];

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || undefined,
    });
  }

  // Fetch all JS/TS files from a repository
  async fetchRepoFiles(owner: string, repo: string): Promise<RepoFile[]> {
    const files: RepoFile[] = [];
    
    // Get the repository tree recursively
    const { data: refData } = await this.octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main',
    }).catch(() => 
      // Try 'master' if 'main' doesn't exist
      this.octokit.git.getRef({
        owner,
        repo,
        ref: 'heads/master',
      })
    );

    const { data: treeData } = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: refData.object.sha,
      recursive: 'true',
    });

    // Filter for supported files
    const supportedFiles = treeData.tree.filter(item => {
      if (item.type !== 'blob' || !item.path) return false;
      
      // Skip certain directories
      if (this.SKIP_DIRS.some(dir => item.path!.includes(`/${dir}/`) || item.path!.startsWith(`${dir}/`))) {
        return false;
      }

      // Check extension
      return this.SUPPORTED_EXTENSIONS.some(ext => item.path!.endsWith(ext));
    });

    console.log(`📂 Fetching content for ${supportedFiles.length} files...`);

    // Fetch content for each file (in batches to avoid rate limits)
    const batchSize = 10;
    for (let i = 0; i < supportedFiles.length; i += batchSize) {
      const batch = supportedFiles.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            const { data } = await this.octokit.repos.getContent({
              owner,
              repo,
              path: item.path!,
            });

            if ('content' in data && data.type === 'file') {
              return {
                path: item.path!,
                content: Buffer.from(data.content, 'base64').toString('utf-8'),
                sha: item.sha!,
              };
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch: ${item.path}`);
          }
          return null;
        })
      );

      files.push(...batchResults.filter((f): f is RepoFile => f !== null));
    }

    return files;
  }
}
