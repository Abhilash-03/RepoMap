import { Router, Request, Response } from 'express';
import { GitHubService } from '../services/github.js';
import { DependencyAnalyzer } from '../services/analyzer.js';
import { GraphBuilder } from '../services/graphBuilder.js';

const router = Router();

// Parse GitHub URL to extract owner and repo
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,
    /github\.com:([^\/]+)\/([^\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
      };
    }
  }
  return null;
}

// POST /api/analyze
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { repoUrl, githubToken } = req.body;

    if (!repoUrl) {
      res.status(400).json({ error: 'Repository URL is required' });
      return;
    }

    // Parse the GitHub URL
    const repoInfo = parseGitHubUrl(repoUrl);
    if (!repoInfo) {
      res.status(400).json({ error: 'Invalid GitHub repository URL' });
      return;
    }

    console.log(`📦 Analyzing repository: ${repoInfo.owner}/${repoInfo.repo}`);

    // Fetch files from GitHub (with optional user token)
    const githubService = new GitHubService(githubToken);
    const fetchResult = await githubService.fetchRepoFiles(repoInfo.owner, repoInfo.repo);
    const files = fetchResult.files;

    console.log(`📁 Found ${fetchResult.totalFound} JS/TS files, fetched ${fetchResult.successfullyFetched}`);

    // Analyze dependencies
    const analyzer = new DependencyAnalyzer();
    const dependencies = analyzer.analyze(files);

    // Find orphan files and entry points
    const orphanFiles = dependencies
      .filter(d => d.isOrphan)
      .map(d => d.path);
    
    const entryPoints = dependencies
      .filter(d => d.isEntryPoint)
      .map(d => d.path);

    // Build graph for visualization
    const graphBuilder = new GraphBuilder();
    const { nodes, edges } = graphBuilder.build(dependencies);

    const result = {
      repoInfo,
      totalFiles: fetchResult.totalFound,
      fetchedFiles: fetchResult.successfullyFetched,
      failedFiles: fetchResult.failedToFetch,
      analyzedFiles: dependencies.length,
      dependencies,
      orphanFiles,
      entryPoints,
      nodes,
      edges,
      rateLimit: githubService.rateLimit,
      warning: fetchResult.warning,
    };

    console.log(`✅ Analysis complete: ${orphanFiles.length} orphan files found`);
    if (githubService.rateLimit) {
      console.log(`📊 Rate limit: ${githubService.rateLimit.remaining}/${githubService.rateLimit.limit} remaining`);
    }
    if (fetchResult.warning) {
      console.warn(`⚠️ Warning: ${fetchResult.warning}`);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    
    // Provide better error messages based on error type
    let errorMessage = 'Failed to analyze repository';
    let statusCode = 500;
    
    if (error?.status === 403 || error?.message?.includes('rate limit')) {
      statusCode = 403;
      errorMessage = 'GitHub API rate limit exceeded. Please add a GitHub personal access token in the settings to get 5,000 requests/hour instead of 60.';
    } else if (error?.status === 404 || error?.message?.includes('Not Found')) {
      statusCode = 404;
      errorMessage = 'Repository not found. Please check the URL and make sure the repository exists and is public.';
    } else if (error?.status === 401) {
      statusCode = 401;
      errorMessage = 'GitHub authentication failed. Please check your personal access token.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
});

export { router as analyzeRoute };
