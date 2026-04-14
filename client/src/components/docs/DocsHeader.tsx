import { Link } from 'react-router-dom';
import { Network, Home, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function DocsHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">RepoMap</h1>
              <p className="text-xs text-slate-500">Documentation</p>
            </div>
          </Link>
          <Badge variant="outline" className="hidden sm:flex">v1.0.0</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Back to App</span>
          </Link>
          <a
            href="https://github.com/Abhilash-03/RepoMap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 transition-colors"
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
