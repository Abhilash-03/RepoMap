import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { GraphNode, GraphEdge } from '../types';
import CustomNode from './CustomNode';

interface DependencyGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (nodeId: string) => void;
}

export default function DependencyGraph({ nodes, edges, onNodeClick }: DependencyGraphProps) {
  // Convert our types to React Flow types
  const initialNodes: Node[] = useMemo(() => 
    nodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: node.data,
    })), [nodes]
  );

  const initialEdges: Edge[] = useMemo(() => 
    edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated,
      style: edge.style,
    })), [edges]
  );

  const [flowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);

  // Update nodes when props change
  useMemo(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useMemo(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  return (
    <div className="dependency-graph">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.data?.isOrphan) return '#ef4444';
            if (n.data?.isEntryPoint) return '#22c55e';
            return '#64748b';
          }}
          nodeColor={(n) => {
            if (n.data?.isOrphan) return '#fee2e2';
            if (n.data?.isEntryPoint) return '#dcfce7';
            return '#f1f5f9';
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
