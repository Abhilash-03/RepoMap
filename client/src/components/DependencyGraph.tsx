import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { GraphNode, GraphEdge } from '@/types';
import { getLayoutedElements } from '@/lib/elk-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Layers,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import CustomNode from './CustomNode';

interface DependencyGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onNodeClick?: (nodeId: string) => void;
}

const nodeTypes = {
  custom: CustomNode,
};

export default function DependencyGraph({ 
  nodes: initialNodes, 
  edges: initialEdges, 
  isFullScreen = false,
  onToggleFullScreen,
  onNodeClick 
}: DependencyGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLayouting, setIsLayouting] = useState(true);
  const [direction, setDirection] = useState<'DOWN' | 'RIGHT'>('DOWN');

  // Apply ELK layout
  const applyLayout = useCallback(async (dir: 'DOWN' | 'RIGHT') => {
    setIsLayouting(true);
    try {
      const { nodes: layoutedNodes } = await getLayoutedElements(
        initialNodes,
        initialEdges,
        { direction: dir, nodeSpacing: 60, layerSpacing: 100 }
      );

      const flowNodes: Node[] = layoutedNodes.map(node => ({
        id: node.id,
        type: 'custom',
        position: node.position,
        data: node.data,
      }));

      const flowEdges: Edge[] = initialEdges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
        type: 'smoothstep',
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error('Layout error:', error);
      // Fallback to original positions
      const flowNodes: Node[] = initialNodes.map(node => ({
        id: node.id,
        type: 'custom',
        position: node.position,
        data: node.data,
      }));
      setNodes(flowNodes);
      setEdges(initialEdges.map(e => ({ ...e, type: 'smoothstep' })));
    }
    setIsLayouting(false);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  useEffect(() => {
    applyLayout(direction);
  }, [initialNodes, initialEdges, direction, applyLayout]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    onNodeClick?.(node.id);
  }, [onNodeClick]);

  const toggleDirection = () => {
    setDirection(d => d === 'DOWN' ? 'RIGHT' : 'DOWN');
  };

  const orphanCount = initialNodes.filter(n => n.data.isOrphan).length;
  const entryCount = initialNodes.filter(n => n.data.isEntryPoint).length;

  return (
    <div className={`relative ${isFullScreen ? 'h-screen' : 'h-[600px]'} w-full bg-slate-50 rounded-lg overflow-hidden`}>
      {isLayouting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
            <span className="text-sm text-slate-600">Calculating layout...</span>
          </div>
        </div>
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        {/* Top toolbar */}
        <Panel position="top-left" className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-slate-200">
            <Badge variant="secondary" className="gap-1">
              <Layers className="h-3 w-3" />
              {initialNodes.length} files
            </Badge>
            <Badge variant="success" className="gap-1">
              {entryCount} entry
            </Badge>
            {orphanCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                {orphanCount} orphan
              </Badge>
            )}
          </div>
        </Panel>

        <Panel position="top-right" className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-slate-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDirection}
              title={direction === 'DOWN' ? 'Switch to horizontal' : 'Switch to vertical'}
            >
              {direction === 'DOWN' ? <ArrowDown className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => applyLayout(direction)}
              title="Reset layout"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            {onToggleFullScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFullScreen}
                title={isFullScreen ? 'Exit full screen' : 'Full screen'}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </Panel>

        <Controls 
          showZoom={false}
          showFitView={true}
          showInteractive={false}
          className="!bg-white/90 !backdrop-blur-sm !shadow-lg !border !border-slate-200 !rounded-lg overflow-hidden"
        />
        
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(n) => {
            if (n.data?.isOrphan) return '#ef4444';
            if (n.data?.isEntryPoint) return '#22c55e';
            return '#64748b';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="!bg-white/90 !backdrop-blur-sm !shadow-lg !border !border-slate-200 !rounded-lg"
        />
        
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#cbd5e1"
        />
      </ReactFlow>
    </div>
  );
}
