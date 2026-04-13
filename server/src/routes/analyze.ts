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
    const { repoUrl } = req.body;

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

    // Fetch files from GitHub
    const githubService = new GitHubService();
    const files = await githubService.fetchRepoFiles(repoInfo.owner, repoInfo.repo);

    console.log(`📁 Found ${files.length} JS/TS files`);

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
      totalFiles: files.length,
      analyzedFiles: dependencies.length,
      dependencies,
      orphanFiles,
      entryPoints,
      nodes,
      edges,
    };

    console.log(`✅ Analysis complete: ${orphanFiles.length} orphan files found`);

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to analyze repository' 
    });
  }
});

export { router as analyzeRoute };
