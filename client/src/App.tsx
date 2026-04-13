import { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  Loader2, 
  AlertCircle, 
  FileCode, 
  Network, 
  FileWarning,
  Sparkles,
  X,
  Info
} from 'lucide-react';
import DependencyGraph from '@/components/DependencyGraph';
import OrphanFiles from '@/components/OrphanFiles';
import TokenSettings from '@/components/TokenSettings';
import { analyzeRepository, getStoredGitHubToken } from '@/services/api';
import type { AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeRepository(repoUrl.trim());
      setResult(analysisResult);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to analyze repository. Please check the URL and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Full screen graph view
  if (isFullScreen && result) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900">
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFullScreen(false)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Exit Full Screen
          </Button>
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {result.repoInfo.owner}/{result.repoInfo.repo}
          </Badge>
        </div>
        <DependencyGraph
          nodes={result.nodes}
          edges={result.edges}
          isFullScreen={true}
          onToggleFullScreen={() => setIsFullScreen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Network className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">RepoMap</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Dependency Analyzer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TokenSettings />
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-900 transition-colors p-2"
              >
                <GitBranch className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!result && (
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-200/50 text-sm font-medium mb-6 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                Zero-setup dependency analysis
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Visualize Your Code<br />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Dependencies
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Paste a GitHub repository URL and instantly see an interactive map of file 
              dependencies and discover orphan files.
            </p>
          </div>
        )}

        {/* Search Form */}
        <Card className={cn("mb-8", !result && "max-w-2xl mx-auto")}>
          <CardContent className="pt-6">
            <form onSubmit={handleAnalyze} className="flex gap-3">
              <div className="relative flex-1">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="pl-10 h-11"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !repoUrl.trim()}
                className="h-11 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Token Warning */}
        {!getStoredGitHubToken() && !result && (
          <Card className="mb-8 max-w-2xl mx-auto border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Limited to 60 requests/hour.</span>
                  {' '}Add your GitHub token in Settings for 5,000 req/hr.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rate Limit Info */}
        {result?.rateLimit && (
          <div className="mb-4 flex justify-end">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                result.rateLimit.remaining < 10 
                  ? "border-red-300 text-red-600" 
                  : result.rateLimit.remaining < 100 
                    ? "border-amber-300 text-amber-600"
                    : "border-slate-300 text-slate-600"
              )}
            >
              API: {result.rateLimit.remaining}/{result.rateLimit.limit} requests remaining
            </Badge>
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Analysis Failed</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Stats Grid */}
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

            {/* Tabs */}
            <Tabs defaultValue="graph" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <TabsList>
                  <TabsTrigger value="graph" className="gap-2">
                    <Network className="h-4 w-4" />
                    Dependency Graph
                  </TabsTrigger>
                  <TabsTrigger value="orphans" className="gap-2">
                    <FileWarning className="h-4 w-4" />
                    Orphan Files
                    {result.orphanFiles.length > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                        {result.orphanFiles.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <Badge variant="outline" className="flex gap-1 w-fit">
                  <GitBranch className="h-3 w-3" />
                  {result.repoInfo.owner}/{result.repoInfo.repo}
                </Badge>
              </div>

              <TabsContent value="graph" className="mt-4">
                <Card className="overflow-hidden">
                  <DependencyGraph
                    nodes={result.nodes}
                    edges={result.edges}
                    isFullScreen={false}
                    onToggleFullScreen={() => setIsFullScreen(true)}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="orphans" className="mt-4">
                <Card>
                  <OrphanFiles orphanFiles={result.orphanFiles} />
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Feature Cards - Show only when no results */}
        {!result && !isLoading && !error && (
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
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-500">
            Made with ❤️ for developers who love clean code
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
