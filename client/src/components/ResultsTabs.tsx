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
        <TabsList>
          <TabsTrigger value="graph" className="gap-2">
            <Network className="h-4 w-4" />
            Dependency Graph
          </TabsTrigger>
          <TabsTrigger value="orphans" className="gap-2">
            <FileWarning className="h-4 w-4" />
            Orphan Files
            {result.orphanFiles.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                {result.orphanFiles.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <Badge variant="outline" className="flex gap-1 w-fit">
          <GitBranch className="h-3 w-3" />
          {result.repoInfo.owner}/{result.repoInfo.repo}
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
