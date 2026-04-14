import { Network, FileWarning, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function FeatureCards() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16">
      <Card className="border-slate-200 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
        <CardHeader className="p-4 sm:p-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-violet-100 flex items-center justify-center mb-2">
            <Network className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
          </div>
          <CardTitle className="text-base sm:text-lg">Interactive Graph</CardTitle>
          <CardDescription className="text-sm">
            Full-screen, zoomable dependency visualization with ELK layout algorithm for clean, organized views.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 hover:border-red-200 hover:shadow-lg transition-all duration-300">
        <CardHeader className="p-4 sm:p-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-red-100 flex items-center justify-center mb-2">
            <FileWarning className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          </div>
          <CardTitle className="text-base sm:text-lg">Orphan Detection</CardTitle>
          <CardDescription className="text-sm">
            Instantly identify dead code - files that exist but are never imported anywhere in your codebase.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 sm:col-span-2 md:col-span-1">
        <CardHeader className="p-4 sm:p-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-base sm:text-lg">Zero Setup</CardTitle>
          <CardDescription className="text-sm">
            No installation, no configuration. Just paste a GitHub URL and get instant insights about your repository.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default FeatureCards;
