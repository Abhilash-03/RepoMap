import { Key, Clock, Zap, HelpCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function ApiInfoSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-8 sm:mt-12 max-w-3xl mx-auto">
      <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-4 sm:pt-6 sm:px-6">
          {/* Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-left gap-3"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Understanding GitHub API Rate Limits</h3>
                <p className="text-xs sm:text-sm text-slate-500 hidden xs:block">Learn how API requests work and why you might need a token</p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
            )}
          </button>

          {/* Expanded Content */}
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[1000px] mt-4 sm:mt-6" : "max-h-0"
          )}>
            {/* Rate Limit Comparison */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="border rounded-lg p-3 sm:p-4 bg-white">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                  <span className="font-medium text-slate-900 text-xs sm:text-base">Without Token</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">60</div>
                <div className="text-xs sm:text-sm text-slate-500">requests per hour</div>
                <Badge variant="outline" className="mt-2 sm:mt-3 text-amber-600 border-amber-200 text-xs">
                  Limited
                </Badge>
              </div>

              <div className="border rounded-lg p-3 sm:p-4 bg-white border-emerald-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                  <span className="font-medium text-slate-900 text-xs sm:text-base">With Token</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">5,000</div>
                <div className="text-xs sm:text-sm text-slate-500">requests per hour</div>
                <Badge variant="outline" className="mt-2 sm:mt-3 text-emerald-600 border-emerald-200 text-xs">
                  Recommended
                </Badge>
              </div>
            </div>

            {/* What is a Request */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">?</span>
                What counts as a request?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mb-3">
                When you analyze a repository, RepoMap makes multiple API calls to GitHub:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 ml-2 sm:ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5 sm:mt-1">•</span>
                  <span><strong>1 request</strong> to get the repository branch info</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5 sm:mt-1">•</span>
                  <span><strong>1 request</strong> to fetch the file tree (list of all files)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5 sm:mt-1">•</span>
                  <span><strong>1 request per file</strong> to fetch each file's content</span>
                </li>
              </ul>
              <div className="mt-3 p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs sm:text-sm text-amber-700">
                  <strong>Example:</strong> A repo with 50 JS/TS files uses ~52 requests. Without a token, you could only analyze ~1 medium repo per hour!
                </p>
              </div>
            </div>

            {/* How to Get Token */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <Key className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
                How to get a GitHub Token
              </h4>
              <ol className="text-xs sm:text-sm text-slate-600 space-y-1.5 sm:space-y-2 ml-2 sm:ml-4 list-decimal list-inside">
                <li>Go to GitHub → Settings → Developer Settings → Personal Access Tokens</li>
                <li>Click "Generate new token (classic)"</li>
                <li>Give it a name like "RepoMap"</li>
                <li>Select the <code className="bg-slate-100 px-1 rounded text-xs">public_repo</code> scope (for public repos only)</li>
                <li>Click "Generate token" and copy it</li>
                <li>Paste it in RepoMap's Settings (gear icon in header)</li>
              </ol>
              <a
                href="https://github.com/settings/tokens/new?scopes=public_repo&description=RepoMap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Create token on GitHub
                <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </a>
            </div>

            {/* Security Note */}
            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>🔒 Security:</strong> Your token is stored only in your browser's local storage and is sent directly to GitHub's API. We never store or see your token on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApiInfoSection;
