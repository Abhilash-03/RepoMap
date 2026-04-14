import { FileCode, GitBranch, Network, FileWarning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/types';

interface StatsGridProps {
  result: AnalysisResult;
}

function StatsGrid({ result }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileCode className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{result.totalFiles}</p>
              <p className="text-sm text-slate-500">Total Files</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{result.entryPoints.length}</p>
              <p className="text-sm text-slate-500">Entry Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Network className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{result.edges.length}</p>
              <p className="text-sm text-slate-500">Dependencies</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={result.orphanFiles.length > 0 ? "border-red-200 bg-red-50/50" : ""}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              result.orphanFiles.length > 0 ? "bg-red-100" : "bg-slate-100"
            )}>
              <FileWarning className={cn(
                "h-5 w-5",
                result.orphanFiles.length > 0 ? "text-red-600" : "text-slate-600"
              )} />
            </div>
            <div>
              <p className={cn(
                "text-2xl font-bold",
                result.orphanFiles.length > 0 ? "text-red-600" : "text-slate-900"
              )}>
                {result.orphanFiles.length}
              </p>
              <p className="text-sm text-slate-500">Orphan Files</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsGrid;
