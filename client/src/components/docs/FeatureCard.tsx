interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 hover:border-violet-300 hover:shadow-md transition-all">
      <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-violet-600" />
      </div>
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

export default FeatureCard;
