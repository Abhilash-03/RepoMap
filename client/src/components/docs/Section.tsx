interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 pb-2 border-b border-slate-200 dark:border-slate-700">
        {title}
      </h2>
      <div className="prose prose-slate dark:prose-invert max-w-none">{children}</div>
    </section>
  );
}

export default Section;
