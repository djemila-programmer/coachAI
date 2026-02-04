import { MessageCircle, BookOpen, RotateCcw, BarChart3, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Chat', path: '/chat', icon: MessageCircle },
  { title: 'Exercices', path: '/exercises', icon: BookOpen },
  { title: 'Révision', path: '/review', icon: RotateCcw },
  { title: 'Stats', path: '/progress', icon: BarChart3 },
  { title: 'Config', path: '/settings', icon: Settings },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
