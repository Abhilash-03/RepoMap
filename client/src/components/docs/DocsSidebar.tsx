import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { navigation } from './navigation';

interface DocsSidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function DocsSidebar({ activeSection, onSectionClick, isOpen, onClose }: DocsSidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 bottom-0 w-64 border-r bg-white z-40 transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:bg-slate-50/50",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <ScrollArea className="h-full py-6 px-4">
          <nav className="space-y-6">
            {navigation.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => onSectionClick(item.id)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                            activeSection === item.id
                              ? 'bg-violet-100 text-violet-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}

export default DocsSidebar;
