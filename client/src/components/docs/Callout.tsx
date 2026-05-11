import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success';
  title: string;
  children: React.ReactNode;
}

function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300',
    warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300',
    success: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300',
  };
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
  };
  const Icon = icons[type];

  return (
    <div className={cn('rounded-lg border p-4 my-4', styles[type])}>
      <div className="flex items-center gap-2 font-semibold mb-2">
        <Icon className="h-5 w-5" />
        {title}
      </div>
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
}

export default Callout;
