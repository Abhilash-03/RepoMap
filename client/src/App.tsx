import { useState } from 'react';
import { AlertCircle, Info, Key, RefreshCw, ExternalLink } from 'lucide-react';
import DependencyGraph from '@/components/DependencyGraph';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import StatsGrid from '@/components/StatsGrid';
import ResultsTabs from '@/components/ResultsTabs';
import FeatureCards from '@/components/FeatureCards';
import ApiInfoSection from '@/components/ApiInfoSection';
import Footer from '@/components/Footer';
import { analyzeRepository, getStoredGitHubToken } from '@/services/api';
import type { AnalysisResult } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
        <div className="absolute bottom-4 right-1 md:left-12 z-10">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs sm:text-sm max-w-full truncate">
            {result.repoInfo.owner}/{result.repoInfo.repo}
          </Badge>
        </div>
        <DependencyGraph
          nodes={result.nodes}
          edges={result.edges}
          dependencies={result.dependencies}
          isFullScreen={true}
          onToggleFullScreen={() => setIsFullScreen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!result && <HeroSection />}

          <SearchForm
            repoUrl={repoUrl}
            setRepoUrl={setRepoUrl}
            isLoading={isLoading}
            onSubmit={handleAnalyze}
            hasResult={!!result}
          />

          {/* Token Warning */}
          {!getStoredGitHubToken() && !result && (
            <Card className="mb-8 max-w-2xl mx-auto border-amber-200 bg-amber-50">
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <Info className="h-5 w-5 text-amber-500 shrink-0" />
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
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-700">Analysis Failed</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    
                    {/* Helpful suggestions based on error type */}
                    {error.toLowerCase().includes('rate limit') && (
                      <div className="mt-4 p-3 bg-white/60 rounded-lg border border-red-100">
                        <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          How to fix this:
                        </p>
                        <ol className="mt-2 text-sm text-red-700 list-decimal list-inside space-y-1">
                          <li>Go to GitHub → Settings → Developer settings → Personal access tokens</li>
                          <li>Generate a new token (classic) - no scopes needed for public repos</li>
                          <li>Click the key icon in the header to add your token</li>
                        </ol>
                        <a 
                          href="https://github.com/settings/tokens/new" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 text-sm text-violet-600 hover:text-violet-700 font-medium"
                        >
                          Create token on GitHub <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    
                    {error.toLowerCase().includes('not found') && (
                      <div className="mt-4 p-3 bg-white/60 rounded-lg border border-red-100">
                        <p className="text-sm font-medium text-red-800">Please check:</p>
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                          <li>The repository URL is correct</li>
                          <li>The repository is public (private repos need authentication)</li>
                          <li>The repository exists and hasn't been deleted</li>
                        </ul>
                      </div>
                    )}
                    
                    {error.toLowerCase().includes('connect') && (
                      <div className="mt-4 p-3 bg-white/60 rounded-lg border border-red-100">
                        <p className="text-sm font-medium text-red-800">Connection issue:</p>
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                          <li>Check your internet connection</li>
                          <li>The server might be temporarily unavailable</li>
                          <li>Try again in a few moments</li>
                        </ul>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 text-red-600 border-red-200 hover:bg-red-100"
                      onClick={() => setError(null)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Dismiss & Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <>
              <StatsGrid result={result} />
              <ResultsTabs result={result} onToggleFullScreen={() => setIsFullScreen(true)} />
            </>
          )}

          {/* Feature Cards & API Info */}
          {!result && !isLoading && !error && (
            <>
              <FeatureCards />
              <ApiInfoSection />
            </>
          )}
        </main>

      <Footer />
    </div>
  );
}

export default App;
