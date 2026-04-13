import { Handle, Position } from '@xyflow/react';

interface NodeData {
  label: string;
  isOrphan: boolean;
  isEntryPoint: boolean;
  importCount: number;
  importedByCount: number;
}

interface CustomNodeProps {
  data: NodeData;
}

export default function CustomNode({ data }: CustomNodeProps) {
  const baseClasses = 'p-3 rounded-lg min-w-[150px] text-xs shadow-sm border-2';
  const stateClasses = data.isOrphan 
    ? 'bg-red-50 border-red-400' 
    : data.isEntryPoint 
      ? 'bg-green-50 border-green-500' 
      : 'bg-white border-slate-200';

  return (
    <div className={`${baseClasses} ${stateClasses}`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-slate-800 truncate max-w-[180px]" title={data.label}>
          {data.label}
        </div>
        <div className="flex gap-3 text-[11px] text-slate-500">
          <span title="Imports">↓ {data.importCount}</span>
          <span title="Imported by">↑ {data.importedByCount}</span>
        </div>
        {data.isOrphan && (
          <div className="text-[9px] px-2 py-0.5 rounded bg-red-200 text-red-700 uppercase font-semibold mt-1 w-fit">
            Orphan
          </div>
        )}
        {data.isEntryPoint && (
          <div className="text-[9px] px-2 py-0.5 rounded bg-green-200 text-green-700 uppercase font-semibold mt-1 w-fit">
            Entry
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
