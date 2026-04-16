import { useEffect, useState } from 'react';
import { Loader2, GitBranch, FolderTree, Search, Network, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  label: string;
  icon: React.ElementType;
  duration: number; // estimated duration in ms
}

const steps: ProgressStep[] = [
  { id: 'connect', label: 'Connecting to GitHub...', icon: GitBranch, duration: 1000 },
  { id: 'fetch', label: 'Fetching repository structure...', icon: FolderTree, duration: 2000 },
  { id: 'analyze', label: 'Analyzing file dependencies...', icon: Search, duration: 3000 },
  { id: 'build', label: 'Building dependency graph...', icon: Network, duration: 2000 },
];

interface AnalysisProgressProps {
  repoUrl: string;
}

function AnalysisProgress({ repoUrl }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Extract repo name from URL for display
  const repoName = repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');

  useEffect(() => {
    // Simulate progress through steps
    let totalTime = 0;
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    
    const interval = setInterval(() => {
      totalTime += 100;
      const newProgress = Math.min((totalTime / totalDuration) * 100, 95);
      setProgress(newProgress);

      // Update current step based on elapsed time
      let elapsed = 0;
      for (let i = 0; i < steps.length; i++) {
        elapsed += steps[i].duration;
        if (totalTime < elapsed) {
          setCurrentStep(i);
          break;
        }
        if (i === steps.length - 1) {
          setCurrentStep(steps.length - 1);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-8 max-w-2xl mx-auto border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 overflow-hidden">
      <CardContent className="pt-6 pb-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 mb-4">
            <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Analyzing Repository</h3>
          <p className="text-sm text-slate-500 mt-1 truncate max-w-xs mx-auto">{repoName}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-right mt-1">{Math.round(progress)}%</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                  isActive && "bg-white shadow-sm border border-violet-100",
                  isCompleted && "opacity-60",
                  !isActive && !isCompleted && "opacity-40"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                  isActive && "bg-violet-100",
                  isCompleted && "bg-green-100",
                  !isActive && !isCompleted && "bg-slate-100"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : isActive ? (
                    <Icon className="h-4 w-4 text-violet-600 animate-pulse" />
                  ) : (
                    <Icon className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isActive && "text-violet-700",
                  isCompleted && "text-green-700",
                  !isActive && !isCompleted && "text-slate-500"
                )}>
                  {step.label}
                </span>
                {isActive && (
                  <Loader2 className="h-4 w-4 text-violet-500 animate-spin ml-auto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-6 pt-4 border-t border-violet-100">
          <p className="text-xs text-slate-500 text-center">
            💡 Large repositories may take longer to analyze
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AnalysisProgress;
