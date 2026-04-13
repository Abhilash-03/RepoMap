import { useState, useEffect } from 'react';
import { Settings, Key, ExternalLink, Check, Trash2, AlertTriangle } from 'lucide-react';
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
  clearStoredGitHubToken 
} from '@/services/api';

interface TokenSettingsProps {
  onTokenChange?: () => void;
}

export default function TokenSettings({ onTokenChange }: TokenSettingsProps) {
  const [token, setToken] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredGitHubToken();
    setHasToken(!!stored);
    if (stored) {
      setToken('•'.repeat(20)); // Mask the token
    }
  }, [isOpen]);

  const handleSave = () => {
    if (token && !token.includes('•')) {
      setStoredGitHubToken(token);
      setHasToken(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onTokenChange?.();
    }
  };

  const handleClear = () => {
    clearStoredGitHubToken();
    setToken('');
    setHasToken(false);
    onTokenChange?.();
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
