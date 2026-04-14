import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { GraphNode, GraphEdge } from "@/types";
import { getLayoutedElements } from "@/lib/elk-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  ArrowDown,
  ArrowRight,
  X,
  FileCode,
  FileWarning,
  Play,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import CustomNode from "./CustomNode";
import { cn } from "@/lib/utils";

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
  onNodeClick,
}: DependencyGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLayouting, setIsLayouting] = useState(true);
  const [direction, setDirection] = useState<"DOWN" | "RIGHT">("DOWN");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Apply ELK layout
  const applyLayout = useCallback(
    async (dir: "DOWN" | "RIGHT") => {
      setIsLayouting(true);
      try {
        const { nodes: layoutedNodes } = await getLayoutedElements(
          initialNodes,
          initialEdges,
          { direction: dir, nodeSpacing: 60, layerSpacing: 100 },
        );

        const flowNodes: Node[] = layoutedNodes.map((node) => ({
          id: node.id,
          type: "custom",
          position: node.position,
          data: node.data,
        }));

        const flowEdges: Edge[] = initialEdges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: false,
          style: { stroke: "#94a3b8", strokeWidth: 1.5 },
          type: "smoothstep",
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (error) {
        console.error("Layout error:", error);
        // Fallback to original positions
        const flowNodes: Node[] = initialNodes.map((node) => ({
          id: node.id,
          type: "custom",
          position: node.position,
          data: node.data,
        }));
        setNodes(flowNodes);
        setEdges(initialEdges.map((e) => ({ ...e, type: "smoothstep" })));
      }
      setIsLayouting(false);
    },
    [initialNodes, initialEdges, setNodes, setEdges],
  );

  useEffect(() => {
    // Use queueMicrotask to avoid synchronous setState in effect
    queueMicrotask(() => {
      applyLayout(direction);
    });
  }, [initialNodes, initialEdges, direction, applyLayout]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // Find the original node data for the detail panel
      const originalNode = initialNodes.find((n) => n.id === node.id);
      if (originalNode) {
        setSelectedNode(originalNode);
      }
      onNodeClick?.(node.id);
    },
    [onNodeClick, initialNodes],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const toggleDirection = () => {
    setDirection((d) => (d === "DOWN" ? "RIGHT" : "DOWN"));
  };

  const orphanCount = initialNodes.filter((n) => n.data.isOrphan).length;
  const entryCount = initialNodes.filter((n) => n.data.isEntryPoint).length;

  return (
    <div
      className={`relative ${isFullScreen ? "h-screen" : "h-[400px] sm:h-[600px]"} w-full bg-slate-50 rounded-lg overflow-hidden touch-none`}
    >
      {isLayouting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
            <span className="text-sm text-slate-600">
              Calculating layout...
            </span>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        panOnScroll={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        preventScrolling={true}
      >
        {/* Top toolbar - simplified on mobile */}
        <Panel position="top-left" className="flex items-center gap-2">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 shadow-lg border border-slate-200">
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Layers className="h-3 w-3" />
              <span className="hidden xs:inline">
                {initialNodes.length} files
              </span>
              <span className="xs:hidden">{initialNodes.length}</span>
            </Badge>
            <Badge
              variant="success"
              className="gap-1 text-xs sm:text-sm hidden sm:flex"
            >
              {entryCount} entry
            </Badge>
            {orphanCount > 0 && (
              <Badge variant="destructive" className="gap-1 text-xs sm:text-sm">
                {orphanCount} <span className="hidden sm:inline">orphan</span>
              </Badge>
            )}
          </div>
        </Panel>

        <Panel position="top-right" className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-0.5 sm:p-1 shadow-lg border border-slate-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={toggleDirection}
              title={
                direction === "DOWN"
                  ? "Switch to horizontal"
                  : "Switch to vertical"
              }
            >
              {direction === "DOWN" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => applyLayout(direction)}
              title="Reset layout"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            {onToggleFullScreen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={onToggleFullScreen}
                title={isFullScreen ? "Exit full screen" : "Full screen"}
              >
                {isFullScreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </Panel>

        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          className="!bg-white/90 !backdrop-blur-sm !shadow-lg !border !border-slate-200 !rounded-lg overflow-hidden"
        />

        {/* Hide MiniMap on mobile to save space and avoid touch conflicts */}
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(n) => {
            if (n.data?.isOrphan) return "#ef4444";
            if (n.data?.isEntryPoint) return "#22c55e";
            return "#64748b";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="!bg-white/90 !backdrop-blur-sm !shadow-lg !border !border-slate-200 !rounded-lg !hidden sm:!block"
        />

        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#cbd5e1"
        />
      </ReactFlow>

      {/* Mobile detail panel - shows on tap */}
      {selectedNode && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 shadow-lg animate-in slide-in-from-bottom duration-200">
          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  className={cn(
                    "p-2 rounded-lg shrink-0",
                    selectedNode.data.isOrphan && "bg-red-100 text-red-600",
                    selectedNode.data.isEntryPoint &&
                      "bg-emerald-100 text-emerald-600",
                    !selectedNode.data.isOrphan &&
                      !selectedNode.data.isEntryPoint &&
                      "bg-slate-100 text-slate-600",
                  )}
                >
                  {selectedNode.data.isOrphan ? (
                    <FileWarning className="h-5 w-5" />
                  ) : selectedNode.data.isEntryPoint ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    <FileCode className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
                    {selectedNode.data.label}
                  </h3>

                  {/* Status badge */}
                  <div className="mt-1">
                    {selectedNode.data.isOrphan && (
                      <Badge variant="destructive" className="text-xs">
                        Orphan File
                      </Badge>
                    )}
                    {selectedNode.data.isEntryPoint &&
                      !selectedNode.data.isOrphan && (
                        <Badge className="bg-emerald-500 text-xs">
                          Entry Point
                        </Badge>
                      )}
                    {!selectedNode.data.isOrphan &&
                      !selectedNode.data.isEntryPoint && (
                        <Badge variant="secondary" className="text-xs">
                          Regular File
                        </Badge>
                      )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                      <strong>{selectedNode.data.importCount}</strong> imports
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowUpFromLine className="h-3.5 w-3.5" />
                      <strong>{selectedNode.data.importedByCount}</strong>{" "}
                      imported by
                    </span>
                  </div>

                  {/* Status reason */}
                  {selectedNode.data.statusReason && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 bg-slate-50 rounded px-2 py-1">
                      {selectedNode.data.statusReason}
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8"
                onClick={() => setSelectedNode(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
