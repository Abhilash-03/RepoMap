interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 mb-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
        {title}
      </h2>
      <div className="prose prose-slate max-w-none">{children}</div>
    </section>
  );
}

export default Section;
