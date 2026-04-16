import { FileCode, GitBranch, Network, FileWarning, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/types';

interface StatsGridProps {
  result: AnalysisResult;
}

function StatsGrid({ result }: StatsGridProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Warning banner for incomplete fetch */}
      {result.warning && (
        <div className="mb-4 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Incomplete Analysis</p>
            <p className="text-sm text-amber-700 mt-1">{result.warning}</p>
            {result.failedFiles && result.failedFiles > 0 && (
              <p className="text-xs text-amber-600 mt-2">
                Fetched: {result.fetchedFiles}/{result.totalFiles} files ({((result.fetchedFiles || 0) / result.totalFiles * 100).toFixed(0)}%)
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:pt-6 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {result.fetchedFiles ?? result.totalFiles}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  {result.failedFiles ? `of ${result.totalFiles} ` : ''}Files Analyzed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      <Card>
        <CardContent className="p-3 sm:pt-6 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <GitBranch className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{result.entryPoints.length}</p>
              <p className="text-xs sm:text-sm text-slate-500 truncate">Entry Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:pt-6 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
              <Network className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{result.edges.length}</p>
              <p className="text-xs sm:text-sm text-slate-500 truncate">Dependencies</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={result.orphanFiles.length > 0 ? "border-red-200 bg-red-50/50" : ""}>
        <CardContent className="p-3 sm:pt-6 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={cn(
              "h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0",
              result.orphanFiles.length > 0 ? "bg-red-100" : "bg-slate-100"
            )}>
              <FileWarning className={cn(
                "h-4 w-4 sm:h-5 sm:w-5",
                result.orphanFiles.length > 0 ? "text-red-600" : "text-slate-600"
              )} />
            </div>
            <div className="min-w-0">
              <p className={cn(
                "text-xl sm:text-2xl font-bold",
                result.orphanFiles.length > 0 ? "text-red-600" : "text-slate-900"
              )}>
                {result.orphanFiles.length}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 truncate">Orphan Files</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default StatsGrid;
