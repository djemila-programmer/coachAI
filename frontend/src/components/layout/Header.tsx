import { Sun, Moon, Languages, User, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

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

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useUser();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-lg border-b border-border md:hidden">
      <div className="flex items-center justify-between px-4 h-14">

        {/* Hamburger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Logo */}
        <NavLink to="/chat" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Languages className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">LinguaFlow</span>
        </NavLink>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon /> : <Sun />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log('Profil utilisateur')}
          >
            <User />
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {openMenu && (
        <div className="p-4 border-t bg-card">
          <NavLink to="/chat" className="block py-2">Chat</NavLink>
          <NavLink to="/progress" className="block py-2">Progression</NavLink>
          <NavLink to="/settings" className="block py-2">Paramètres</NavLink>
        </div>
      )}
    </header>
  );
}
