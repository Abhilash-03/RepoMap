import { FileWarning, CheckCircle2, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { FileDependency } from '@/types';

interface OrphanFilesProps {
  orphanFiles: FileDependency[];
  onFileClick?: (filePath: string) => void;
}

export default function OrphanFiles({ orphanFiles, onFileClick }: OrphanFilesProps) {
  if (orphanFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Orphan Files!</h3>
        <p className="text-slate-500 text-center max-w-md">
          All files in this repository are properly connected through imports. Your codebase is clean!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Orphan Files Detected
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            These files exist but are never imported by any other file in the codebase. 
            Consider removing them or adding imports.
          </p>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <ul className="space-y-2">
          {orphanFiles.map((dep, index) => {
            const fileName = dep.path.split('/').pop() || dep.path;
            const directory = dep.path.split('/').slice(0, -1).join('/');
            
            return (
              <li 
                key={dep.path}
                className="group flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg cursor-pointer transition-all"
                onClick={() => onFileClick?.(dep.path)}
              >
                <div className="h-8 w-8 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FileWarning className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{fileName}</p>
                  {directory && (
                    <p className="text-xs text-slate-500 truncate">{directory}/</p>
                  )}
                  {dep.statusReason && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {dep.statusReason}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs hidden sm:flex">
                  #{index + 1}
                </Badge>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
