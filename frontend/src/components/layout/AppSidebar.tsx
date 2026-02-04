import { MessageCircle, BookOpen, RotateCcw, BarChart3, Settings, Flame, Languages } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';


const navItems = [
  { title: 'Chat', path: '/chat', icon: MessageCircle },
  { title: 'Exercices', path: '/exercises', icon: BookOpen },
  { title: 'Révision', path: '/review', icon: RotateCcw },
  { title: 'Progression', path: '/progress', icon: BarChart3 },
  { title: 'Paramètres', path: '/settings', icon: Settings },
];

const languageFlags: Record<string, string> = {
  english: '🇬🇧',
  french: '🇫🇷',
  spanish: '🇪🇸',
  german: '🇩🇪',
  italian: '🇮🇹',
  arabic: '🇸🇦',
  chinese: '🇨🇳',
  japanese: '🇯🇵',
};

export function AppSidebar() {
  const location = useLocation();
  const { settings, progress } = useUser();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <NavLink to="/chat" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Languages className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
            LinguaFlow
          </span>
        </NavLink>
      </div>

      {/* User Info */}
      {settings.isOnboarded && (
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3 px-2">
            <span className="text-2xl">{languageFlags[settings.languageToLearn] || '🌍'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate capitalize">
                {settings.languageToLearn || 'Langue'}
              </p>
              <p className="text-xs text-muted-foreground">
                Niveau {settings.userLevel || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Streak Counter */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-warning/10 to-destructive/10">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{progress.currentStreak}</p>
            <p className="text-xs text-muted-foreground">jours de série</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
