import { Handle, Position } from '@xyflow/react';
import { FileCode, FileWarning, Play, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn(
      'relative px-3 py-2.5 rounded-lg min-w-[160px] max-w-[200px] text-xs transition-all duration-200',
      'bg-white border shadow-md hover:shadow-lg',
      data.isOrphan && 'border-red-300 bg-red-50/50 ring-2 ring-red-100',
      data.isEntryPoint && 'border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-100',
      !data.isOrphan && !data.isEntryPoint && 'border-slate-200 hover:border-slate-300'
    )}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-slate-400 !w-2 !h-2 !border-2 !border-white"
      />
      
      <div className="flex items-start gap-2">
        <div className={cn(
          'mt-0.5 p-1 rounded',
          data.isOrphan && 'bg-red-100 text-red-600',
          data.isEntryPoint && 'bg-emerald-100 text-emerald-600',
          !data.isOrphan && !data.isEntryPoint && 'bg-slate-100 text-slate-500'
        )}>
          {data.isOrphan ? (
            <FileWarning className="h-3.5 w-3.5" />
          ) : data.isEntryPoint ? (
            <Play className="h-3.5 w-3.5" />
          ) : (
            <FileCode className="h-3.5 w-3.5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div 
            className="font-medium text-slate-800 truncate leading-tight" 
            title={data.label}
          >
            {data.label}
          </div>
          
          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-0.5" title="Imports">
              <ArrowDownToLine className="h-2.5 w-2.5" />
              {data.importCount}
            </span>
            <span className="flex items-center gap-0.5" title="Imported by">
              <ArrowUpFromLine className="h-2.5 w-2.5" />
              {data.importedByCount}
            </span>
          </div>
        </div>
      </div>

      {(data.isOrphan || data.isEntryPoint) && (
        <div className={cn(
          'absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide shadow-sm',
          data.isOrphan && 'bg-red-500 text-white',
          data.isEntryPoint && 'bg-emerald-500 text-white'
        )}>
          {data.isOrphan ? 'Orphan' : 'Entry'}
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="!bg-slate-400 !w-2 !h-2 !border-2 !border-white"
      />
    </div>
  );
}
