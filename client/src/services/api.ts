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
  const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/api/analyze`, {
    repoUrl,
    githubToken: githubToken || getStoredGitHubToken() || undefined,
  });
  return response.data;
}
