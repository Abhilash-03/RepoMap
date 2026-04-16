import { Router } from 'express';
import { Octokit } from '@octokit/rest';

const router = Router();

// GET /api/rate-limit - Check GitHub API rate limit
router.get('/rate-limit', async (req, res) => {
  try {
    const token = req.headers['x-github-token'] as string | undefined;
    
    const octokit = new Octokit({
      auth: token || undefined,
    });
    
    const { data } = await octokit.rateLimit.get();
    const core = data.resources.core;
    
    res.json({
      limit: core.limit,
      remaining: core.remaining,
      reset: core.reset,
      used: core.used,
    });
  } catch (error) {
    console.error('Rate limit check error:', error);
    res.status(500).json({ 
      error: 'Failed to check rate limit',
      limit: 60,
      remaining: 0,
      reset: Math.floor(Date.now() / 1000) + 3600,
      used: 60,
    });
  }
});

export const rateLimitRoute = router;
