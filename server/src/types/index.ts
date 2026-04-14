// Repository information parsed from URL
export interface RepoInfo {
  owner: string;
  repo: string;
}

// A file in the repository
export interface RepoFile {
  path: string;
  content: string;
  sha: string;
}

// Import found in a file
export interface ImportInfo {
  source: string;        // The import source (e.g., './utils', 'react')
  resolved: string | null; // Resolved file path within repo
  type: 'import' | 'require' | 'dynamic';
}

// Dependency information for a single file
export interface FileDependency {
  path: string;
  imports: string[];      // Files this file imports
  importedBy: string[];   // Files that import this file
  isOrphan: boolean;
  isEntryPoint: boolean;
  statusReason?: string;  // Explanation of why file has its current orphan status
}

// Node for React Flow visualization
export interface GraphNode {
  id: string;
  type: 'default' | 'input' | 'output';
  data: {
    label: string;
    isOrphan: boolean;
    isEntryPoint: boolean;
    importCount: number;
    importedByCount: number;
    statusReason?: string;
  };
  position: { x: number; y: number };
  style?: Record<string, string | number>;
}

// Edge for React Flow visualization
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, string | number>;
}

// Complete analysis result
export interface AnalysisResult {
  repoInfo: RepoInfo;
  totalFiles: number;
  analyzedFiles: number;
  dependencies: FileDependency[];
  orphanFiles: string[];
  entryPoints: string[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}
