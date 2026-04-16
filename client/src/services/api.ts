import axios from 'axios';
import type { AnalysisResult } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const GITHUB_TOKEN_KEY = 'repomap_github_token';

export function getStoredGitHubToken(): string | null {
  return localStorage.getItem(GITHUB_TOKEN_KEY);
}

export function setStoredGitHubToken(token: string): void {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
}

export function clearStoredGitHubToken(): void {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  used: number;
}

export async function checkRateLimit(token?: string): Promise<RateLimitInfo> {
  const authToken = token || getStoredGitHubToken();
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await axios.get('https://api.github.com/rate_limit', { headers });
  const core = response.data.resources.core;
  return {
    limit: core.limit,
    remaining: core.remaining,
    reset: core.reset,
    used: core.used,
  };
}

export async function analyzeRepository(repoUrl: string, githubToken?: string): Promise<AnalysisResult> {
  try {
    const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/api/analyze`, {
      repoUrl,
      githubToken: githubToken || getStoredGitHubToken() || undefined,
    });
    return response.data;
  } catch (err) {
    // Extract meaningful error message from axios error
    const error = err as { response?: { data?: { error?: string }; status?: number }; code?: string; message?: string };
    
    if (error.response?.data?.error) {
      // Server returned an error message
      throw new Error(error.response.data.error);
    } else if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please add a GitHub personal access token to continue.');
    } else if (error.response?.status === 404) {
      throw new Error('Repository not found. Please check the URL and make sure the repository is public.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while analyzing the repository. Please try again later.');
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('Request timed out. The repository might be too large. Try adding a GitHub token for faster access.');
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    } else {
      throw new Error(error.message || 'Failed to analyze repository. Please try again.');
    }
  }
}
