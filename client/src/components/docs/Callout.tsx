import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success';
  title: string;
  children: React.ReactNode;
}

function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
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
