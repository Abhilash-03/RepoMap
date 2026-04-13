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
}

export interface GraphNode {
  id: string;
  type: 'default' | 'input' | 'output';
  data: {
    label: string;
    isOrphan: boolean;
    isEntryPoint: boolean;
    importCount: number;
    importedByCount: number;
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
