import { useState, useEffect } from 'react';
import { Settings, Key, ExternalLink, Check, Trash2, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  getStoredGitHubToken, 
  setStoredGitHubToken, 
  clearStoredGitHubToken,
  checkRateLimit,
  type RateLimitInfo,
} from '@/services/api';
import { cn } from '@/lib/utils';

interface TokenSettingsProps {
  onTokenChange?: () => void;
}

export default function TokenSettings({ onTokenChange }: TokenSettingsProps) {
  const [token, setToken] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  const fetchRateLimit = async () => {
    setIsLoadingRate(true);
    setRateError(null);
    try {
      const info = await checkRateLimit();
      setRateLimit(info);
    } catch {
      setRateError('Failed to fetch');
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    const stored = getStoredGitHubToken();
    setHasToken(!!stored);
    if (stored) {
      setToken('•'.repeat(20)); // Mask the token
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchRateLimit();
    }
  }, [isOpen, hasToken]);

  const handleSave = async () => {
    if (token && !token.includes('•')) {
      setStoredGitHubToken(token);
      setHasToken(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onTokenChange?.();
      // Refresh rate limit after saving new token
      await fetchRateLimit();
    }
  };

  const handleClear = async () => {
    clearStoredGitHubToken();
    setToken('');
    setHasToken(false);
    onTokenChange?.();
    // Refresh rate limit after clearing token
    await fetchRateLimit();
  };

  const handleTokenChange = (value: string) => {
    // If user starts typing on a masked token, clear it
    if (token.includes('•') && value.length > token.length) {
      setToken(value.slice(-1));
    } else {
      setToken(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="h-5 w-5" />
          {hasToken && (
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            GitHub Token Settings
          </DialogTitle>
          <DialogDescription>
            Add your GitHub Personal Access Token to increase API rate limits from 60 to 5,000 requests/hour.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Status:</span>
            {hasToken ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Check className="h-3 w-3 mr-1" />
                Token configured
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                No token (60 req/hr)
              </Badge>
            )}
          </div>

          {/* Rate Limit Display */}
          <div className="border rounded-lg p-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium text-slate-700">API Rate Limit</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchRateLimit}
                disabled={isLoadingRate}
                className="h-7 px-2"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isLoadingRate && "animate-spin")} />
              </Button>
            </div>
            
            {rateError ? (
              <p className="text-xs text-red-500">{rateError}</p>
            ) : rateLimit ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Remaining</span>
                  <span className={cn(
                    "font-semibold",
                    rateLimit.remaining < 10 ? "text-red-600" :
                    rateLimit.remaining < 100 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {rateLimit.remaining.toLocaleString()} / {rateLimit.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      rateLimit.remaining / rateLimit.limit > 0.5 ? "bg-emerald-500" :
                      rateLimit.remaining / rateLimit.limit > 0.1 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${(rateLimit.remaining / rateLimit.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Resets at {new Date(rateLimit.reset * 1000).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Loading...</p>
            )}
          </div>

          {/* Token Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Personal Access Token</label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={token}
                onChange={(e) => handleTokenChange(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="flex-1"
              />
              {hasToken && (
                <Button variant="outline" size="icon" onClick={handleClear}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>

          {/* How to get token */}
          <div className="text-sm text-slate-500 space-y-2">
            <p>To create a token:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
              <li>Click "Generate new token (classic)"</li>
              <li>Select "public_repo" scope only</li>
              <li>Generate and copy the token</li>
            </ol>
            <a 
              href="https://github.com/settings/tokens/new?scopes=public_repo&description=RepoMap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-violet-600 hover:underline text-xs"
            >
              Create token on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={!token || token.includes('•')}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              'Save Token'
            )}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-slate-400 text-center">
            Your token is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
