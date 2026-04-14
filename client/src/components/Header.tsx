import { GitBranch, Network } from 'lucide-react';
import TokenSettings from '@/components/TokenSettings';

function Header() {
  return (
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
  );
}

export default Header;
