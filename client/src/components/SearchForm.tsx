import { GitBranch, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  hasResult: boolean;
}

function SearchForm({ repoUrl, setRepoUrl, isLoading, onSubmit, hasResult }: SearchFormProps) {
  return (
    <Card className={cn("mb-8", !hasResult && "max-w-2xl mx-auto")}>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="flex gap-3">
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
  );
}

export default SearchForm;
