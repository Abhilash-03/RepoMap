import { useState } from 'react';
import RepoInput from './components/RepoInput';
import DependencyGraph from './components/DependencyGraph';
import OrphanFiles from './components/OrphanFiles';
import Stats from './components/Stats';
import { analyzeRepository } from './services/api';
import type { AnalysisResult } from './types';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'graph' | 'orphans'>('graph');

  const handleAnalyze = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeRepository(repoUrl);
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

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  const handleFileClick = (filePath: string) => {
    const nodeId = filePath.replace(/[^a-zA-Z0-9]/g, '_');
    console.log('File clicked:', filePath, 'Node ID:', nodeId);
    setActiveTab('graph');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl">🗺️</span>
          <h1 className="text-4xl font-bold m-0">RepoMap</h1>
        </div>
        <p className="mt-2 text-slate-400 text-lg">GitHub Repository File Dependency Analyzer</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {/* Input Section */}
        <section className="mb-8">
          <RepoInput onSubmit={handleAnalyze} isLoading={isLoading} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Analysis Results for{' '}
                <span className="text-blue-500">{result.repoInfo.owner}/{result.repoInfo.repo}</span>
              </h2>
              <Stats result={result} />
            </section>

            <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button 
                  className={`px-6 py-4 font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === 'graph' 
                      ? 'text-blue-500 border-blue-500' 
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('graph')}
                >
                  Dependency Graph
                </button>
                <button 
                  className={`px-6 py-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === 'orphans' 
                      ? 'text-blue-500 border-blue-500' 
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('orphans')}
                >
                  Orphan Files
                  {result.orphanFiles.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {result.orphanFiles.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[500px]">
                {activeTab === 'graph' && (
                  <DependencyGraph 
                    nodes={result.nodes} 
                    edges={result.edges}
                    onNodeClick={handleNodeClick}
                  />
                )}
                {activeTab === 'orphans' && (
                  <OrphanFiles 
                    orphanFiles={result.orphanFiles}
                    onFileClick={handleFileClick}
                  />
                )}
              </div>
            </section>
          </>
        )}

        {/* Welcome Section */}
        {!result && !isLoading && !error && (
          <section className="text-center py-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Welcome to RepoMap</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
              Visualize your repository's file dependencies and discover orphan files
              in seconds. Just paste a GitHub repository URL above to get started.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <span className="text-3xl block mb-3">📊</span>
                <h3 className="font-semibold text-slate-800 mb-2">Interactive Graph</h3>
                <p className="text-slate-500 text-sm">Zoom, pan, and explore your file dependencies visually</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <span className="text-3xl block mb-3">🔴</span>
                <h3 className="font-semibold text-slate-800 mb-2">Orphan Detection</h3>
                <p className="text-slate-500 text-sm">Find files that are never imported anywhere</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <span className="text-3xl block mb-3">⚡</span>
                <h3 className="font-semibold text-slate-800 mb-2">Zero Setup</h3>
                <p className="text-slate-500 text-sm">No installation needed - just paste a URL and go</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 border-t border-slate-200">
        <p>Built with React, React Flow, and Express</p>
      </footer>
    </div>
  );
}

export default App;
