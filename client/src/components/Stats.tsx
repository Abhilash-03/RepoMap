import type { AnalysisResult } from '../types';

interface StatsProps {
  result: AnalysisResult;
}

export default function Stats({ result }: StatsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="bg-white px-5 py-4 rounded-lg border border-slate-200 flex flex-col min-w-[120px]">
        <span className="text-2xl font-bold text-slate-800">{result.totalFiles}</span>
        <span className="text-sm text-slate-500">Total Files</span>
      </div>
      <div className="bg-white px-5 py-4 rounded-lg border border-slate-200 flex flex-col min-w-[120px]">
        <span className="text-2xl font-bold text-slate-800">{result.entryPoints.length}</span>
        <span className="text-sm text-slate-500">Entry Points</span>
      </div>
      <div className="bg-red-50 px-5 py-4 rounded-lg border border-red-200 flex flex-col min-w-[120px]">
        <span className="text-2xl font-bold text-red-600">{result.orphanFiles.length}</span>
        <span className="text-sm text-slate-500">Orphan Files</span>
      </div>
      <div className="bg-white px-5 py-4 rounded-lg border border-slate-200 flex flex-col min-w-[120px]">
        <span className="text-2xl font-bold text-slate-800">{result.edges.length}</span>
        <span className="text-sm text-slate-500">Dependencies</span>
      </div>
    </div>
  );
}
