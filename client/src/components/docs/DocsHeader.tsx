import { Link } from 'react-router-dom';
import { Network, Home, GitBranch, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocsHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

function DocsHeader({ isSidebarOpen, onToggleSidebar }: DocsHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Network className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900">RepoMap</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Documentation</p>
            </div>
          </Link>
          <Badge variant="outline" className="hidden sm:flex">v1.0.0</Badge>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Back to App</span>
          </Link>
          <a
            href="https://github.com/Abhilash-03/RepoMap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
          >
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default DocsHeader;
