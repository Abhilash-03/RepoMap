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

export async function analyzeRepository(repoUrl: string, githubToken?: string): Promise<AnalysisResult> {
  const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/api/analyze`, {
    repoUrl,
    githubToken: githubToken || getStoredGitHubToken() || undefined,
  });
  return response.data;
}
