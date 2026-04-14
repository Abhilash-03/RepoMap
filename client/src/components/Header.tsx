import { Link } from 'react-router-dom';
import { GitBranch, Network, BookOpen } from 'lucide-react';
import TokenSettings from '@/components/TokenSettings';

function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-slate-900">RepoMap</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Dependency Analyzer</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/docs"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-violet-600 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
            <TokenSettings />
            <a 
              href="https://github.com/Abhilash-03/RepoMap" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 sm:p-2"
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
