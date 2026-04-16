// Shared types (also defined in backend)

export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface FileDependency {
  path: string;
  imports: string[];
  importedBy: string[];
  isOrphan: boolean;
  isEntryPoint: boolean;
  statusReason?: string;  // Explanation of why file has its current orphan status
}

export interface GraphNode {
  id: string;
  type: 'default' | 'input' | 'output';
  data: {
    label: string;
    fullPath: string;
    isOrphan: boolean;
    isEntryPoint: boolean;
    importCount: number;
    importedByCount: number;
    statusReason?: string;
  };
  position: { x: number; y: number };
  style?: Record<string, string | number>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, string | number>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface AnalysisResult {
  repoInfo: RepoInfo;
  totalFiles: number;
  fetchedFiles?: number;
  failedFiles?: number;
  analyzedFiles: number;
  dependencies: FileDependency[];
  orphanFiles: string[];
  entryPoints: string[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  rateLimit: RateLimitInfo | null;
  warning?: string;
}
