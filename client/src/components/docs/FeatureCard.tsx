interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md dark:hover:shadow-violet-900/20 transition-all bg-white dark:bg-slate-800">
      <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
      </div>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

export default FeatureCard;
