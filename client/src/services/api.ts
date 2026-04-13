import axios from 'axios';
import type { AnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function analyzeRepository(repoUrl: string): Promise<AnalysisResult> {
  const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/api/analyze`, {
    repoUrl,
  });
  return response.data;
}
