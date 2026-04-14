import { useState, useEffect } from 'react';
import { DocsHeader, DocsSidebar, DocsContent, navigation } from '@/components/docs';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Track scroll position to highlight active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    navigation.forEach((group) => {
      group.items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DocsHeader />

      <div className="flex pt-16">
        <DocsSidebar 
          activeSection={activeSection} 
          onSectionClick={scrollToSection} 
        />
        <DocsContent />
      </div>
    </div>
  );
}
