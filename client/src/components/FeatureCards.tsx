import { Network, FileWarning, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function FeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-16">
      <Card className="border-slate-200 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="h-12 w-12 rounded-xl bg-violet-100 flex items-center justify-center mb-2">
            <Network className="h-6 w-6 text-violet-600" />
          </div>
          <CardTitle className="text-lg">Interactive Graph</CardTitle>
          <CardDescription>
            Full-screen, zoomable dependency visualization with ELK layout algorithm for clean, organized views.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 hover:border-red-200 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-2">
            <FileWarning className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg">Orphan Detection</CardTitle>
          <CardDescription>
            Instantly identify dead code - files that exist but are never imported anywhere in your codebase.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-lg">Zero Setup</CardTitle>
          <CardDescription>
            No installation, no configuration. Just paste a GitHub URL and get instant insights about your repository.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default FeatureCards;
