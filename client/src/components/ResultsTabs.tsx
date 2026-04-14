import { GitBranch, Network, FileWarning } from 'lucide-react';
import DependencyGraph from '@/components/DependencyGraph';
import OrphanFiles from '@/components/OrphanFiles';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnalysisResult } from '@/types';

interface ResultsTabsProps {
  result: AnalysisResult;
  onToggleFullScreen: () => void;
}

function ResultsTabs({ result, onToggleFullScreen }: ResultsTabsProps) {
  return (
    <Tabs defaultValue="graph" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
          <TabsTrigger value="graph" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Network className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Dependency</span> Graph
          </TabsTrigger>
          <TabsTrigger value="orphans" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <FileWarning className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Orphans
            {result.orphanFiles.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                {result.orphanFiles.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <Badge variant="outline" className="flex gap-1 w-fit text-xs sm:text-sm truncate max-w-full">
          <GitBranch className="h-3 w-3 shrink-0" />
          <span className="truncate">{result.repoInfo.owner}/{result.repoInfo.repo}</span>
        </Badge>
      </div>

      <TabsContent value="graph" className="mt-4">
        <Card className="overflow-hidden">
          <DependencyGraph
            nodes={result.nodes}
            edges={result.edges}
            isFullScreen={false}
            onToggleFullScreen={onToggleFullScreen}
          />
        </Card>
      </TabsContent>

      <TabsContent value="orphans" className="mt-4">
        <Card>
          <OrphanFiles orphanFiles={result.dependencies.filter(dep => dep.isOrphan)} />
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default ResultsTabs;
