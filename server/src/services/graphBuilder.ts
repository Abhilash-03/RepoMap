import { FileDependency, GraphNode, GraphEdge } from '../types/index.js';

export class GraphBuilder {
  // Build React Flow compatible graph data
  build(dependencies: FileDependency[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    
    // Create a layout for nodes using a simple force-directed-like algorithm
    const positions = this.calculateLayout(dependencies);

    // Create nodes
    for (const dep of dependencies) {
      const nodeId = this.pathToId(dep.path);
      const pos = positions.get(dep.path) || { x: 0, y: 0 };

      nodes.push({
        id: nodeId,
        type: dep.isEntryPoint ? 'input' : (dep.imports.length === 0 ? 'output' : 'default'),
        data: {
          label: this.getShortLabel(dep.path),
          fullPath: dep.path,
          isOrphan: dep.isOrphan,
          isEntryPoint: dep.isEntryPoint,
          importCount: dep.imports.length,
          importedByCount: dep.importedBy.length,
          statusReason: dep.statusReason,
        },
        position: pos,
        style: dep.isOrphan ? {
          background: '#fee2e2',
          borderColor: '#ef4444',
          borderWidth: 2,
        } : dep.isEntryPoint ? {
          background: '#dcfce7',
          borderColor: '#22c55e',
          borderWidth: 2,
        } : undefined,
      });
    }

    // Create edges
    let edgeIndex = 0;
    for (const dep of dependencies) {
      const sourceId = this.pathToId(dep.path);
      
      for (const importPath of dep.imports) {
        const targetId = this.pathToId(importPath);
        edges.push({
          id: `e${edgeIndex++}`,
          source: sourceId,
          target: targetId,
          animated: false,
          style: { stroke: '#94a3b8' },
        });
      }
    }

    return { nodes, edges };
  }

  // Calculate node positions using a hierarchical layout
  private calculateLayout(dependencies: FileDependency[]): Map<string, { x: number; y: number }> {
    const positions = new Map<string, { x: number; y: number }>();
    
    // Group files by directory
    const dirGroups = new Map<string, FileDependency[]>();
    for (const dep of dependencies) {
      const dir = this.getDirectory(dep.path);
      if (!dirGroups.has(dir)) {
        dirGroups.set(dir, []);
      }
      dirGroups.get(dir)!.push(dep);
    }

    // Calculate levels based on import depth
    const levels = this.calculateLevels(dependencies);
    
    // Position nodes
    const levelWidths = new Map<number, number>();
    const nodeWidth = 200;
    const nodeHeight = 80;
    const horizontalGap = 50;
    const verticalGap = 100;

    // First pass: count nodes per level
    for (const dep of dependencies) {
      const level = levels.get(dep.path) || 0;
      levelWidths.set(level, (levelWidths.get(level) || 0) + 1);
    }

    // Second pass: position nodes
    const levelCurrentX = new Map<number, number>();
    for (const dep of dependencies) {
      const level = levels.get(dep.path) || 0;
      const nodesInLevel = levelWidths.get(level) || 1;
      const currentX = levelCurrentX.get(level) || 0;
      
      const totalWidth = nodesInLevel * (nodeWidth + horizontalGap);
      const startX = -totalWidth / 2;
      
      positions.set(dep.path, {
        x: startX + currentX * (nodeWidth + horizontalGap),
        y: level * (nodeHeight + verticalGap),
      });
      
      levelCurrentX.set(level, currentX + 1);
    }

    return positions;
  }

  // Calculate the depth level of each file
  private calculateLevels(dependencies: FileDependency[]): Map<string, number> {
    const levels = new Map<string, number>();
    const depMap = new Map<string, FileDependency>();
    
    for (const dep of dependencies) {
      depMap.set(dep.path, dep);
    }

    // Entry points and files with no imports are level 0
    const queue: string[] = [];
    for (const dep of dependencies) {
      if (dep.isEntryPoint || dep.importedBy.length === 0) {
        levels.set(dep.path, 0);
        queue.push(dep.path);
      }
    }

    // BFS to assign levels
    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentLevel = levels.get(current) || 0;
      const dep = depMap.get(current);
      
      if (dep) {
        for (const importPath of dep.imports) {
          if (!levels.has(importPath)) {
            levels.set(importPath, currentLevel + 1);
            queue.push(importPath);
          }
        }
      }
    }

    // Assign remaining files (orphans, etc.) to level 0
    for (const dep of dependencies) {
      if (!levels.has(dep.path)) {
        levels.set(dep.path, 0);
      }
    }

    return levels;
  }

  // Convert file path to valid node ID
  private pathToId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, '_');
  }

  // Get a short display label from path
  private getShortLabel(filePath: string): string {
    const parts = filePath.split('/');
    if (parts.length <= 2) {
      return filePath;
    }
    return `.../${parts.slice(-2).join('/')}`;
  }

  // Get directory from path
  private getDirectory(filePath: string): string {
    const parts = filePath.split('/');
    return parts.slice(0, -1).join('/') || '/';
  }
}
