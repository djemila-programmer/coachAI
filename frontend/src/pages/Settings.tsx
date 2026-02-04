import { useState } from 'react';
import { User, Globe, Palette, Database, Info, Sun, Moon, Check, AlertTriangle, LogIn, LogOut, Square, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const languages = [
  { id: 'english', name: 'English', flag: '🇬🇧' },
  { id: 'french', name: 'Français', flag: '🇫🇷' },
  { id: 'spanish', name: 'Español', flag: '🇪🇸' },
  { id: 'german', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'italian', name: 'Italiano', flag: '🇮🇹' },
  { id: 'arabic', name: 'العربية', flag: '🇸🇦' },
  { id: 'chinese', name: '中文', flag: '🇨🇳' },
  { id: 'japanese', name: '日本語', flag: '🇯🇵' },
];

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const goals = [
  { id: 'travel', name: 'Voyage', icon: '✈️' },
  { id: 'professional', name: 'Professionnel', icon: '💼' },
  { id: 'academic', name: 'Études', icon: '🎓' },
  { id: 'conversation', name: 'Conversation', icon: '💬' },
  { id: 'culture', name: 'Culture', icon: '📚' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetProgress } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [confirmReset, setConfirmReset] = useState('');

  const handleResetProgress = () => {
    if (confirmReset === 'RESET') {
      resetProgress();
      setConfirmReset('');
    }
  };

  const toggleGoal = (goalId: string) => {
    const currentGoals = settings.learningGoals || [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(g => g !== goalId)
      : [...currentGoals, goalId];
    updateSettings({ learningGoals: newGoals });
  };

  const handleLogout = () => {
    updateSettings({ isOnboarded: false, isGuest: false });
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Paramètres ⚙️
          </h1>
          <p className="text-muted-foreground">
            Personnalise ton expérience d'apprentissage.
          </p>
        </div>

        {/* Guest Warning */}
        {settings.isGuest && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Mode invité actif</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ta progression est sauvegardée localement. Crée un compte pour synchroniser tes données.
                </p>
                <Button
                  onClick={() => navigate('/auth')}
                  className="mt-3 gradient-primary text-primary-foreground rounded-xl"
                  size="sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Créer un compte
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <section className="bg-card rounded-2xl p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display font-semibold text-foreground">Profil</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Nom d'utilisateur</label>
              <Input
                value={settings.name}
                onChange={(e) => updateSettings({ name: e.target.value })}
                placeholder="Ton prénom"
                className="rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Learning Preferences */}
        <section className="bg-card rounded-2xl p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-semibold text-foreground">Préférences d'apprentissage</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-3 block">Langue cible</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => updateSettings({ languageToLearn: lang.id })}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl border-2 transition-all',
                      settings.languageToLearn === lang.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium text-foreground">{lang.name}</span>
                    {settings.languageToLearn === lang.id && (
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-3 block">Niveau CECRL</label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSettings({ userLevel: level })}
                    className={cn(
                      'px-4 py-2 rounded-xl font-medium transition-all',
                      settings.userLevel === level
                        ? 'gradient-primary text-primary-foreground shadow-glow'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-3 block">Objectifs</label>
              <div className="grid grid-cols-2 gap-2">
                {goals.map((goal) => {
                  const isSelected = settings.learningGoals?.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-lg">{goal.icon}</span>
                      <span className="text-sm font-medium text-foreground">{goal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="bg-card rounded-2xl p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-warning" />
            </div>
            <h2 className="font-display font-semibold text-foreground">Apparence</h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              className={cn(
                'flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all',
                theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Sun className="w-5 h-5" />
              <span className="font-medium">Clair</span>
              {theme === 'light' && <Check className="w-4 h-4 text-primary" />}
            </button>
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={cn(
                'flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all',
                theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Moon className="w-5 h-5" />
              <span className="font-medium">Sombre</span>
              {theme === 'dark' && <Check className="w-4 h-4 text-primary" />}
            </button>
          </div>
        </section>

        {/* Data */}
        <section className="bg-card rounded-2xl p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="font-display font-semibold text-foreground">Données</h2>
          </div>

          <div className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Réinitialiser ma progression
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Es-tu sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes tes statistiques et ta progression seront supprimées.
                    <div className="mt-4">
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Tape <span className="font-mono font-bold">RESET</span> pour confirmer
                      </label>
                      <Input
                        value={confirmReset}
                        onChange={(e) => setConfirmReset(e.target.value)}
                        placeholder="RESET"
                        className="rounded-xl"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetProgress}
                    disabled={confirmReset !== 'RESET'}
                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Réinitialiser
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </section>

        {/* About */}
        <section className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Info className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="font-display font-semibold text-foreground">À propos</h2>
          </div>

          <p className="text-sm text-muted-foreground">
            LinguaFlow v1.0.0 — Apprends une langue avec l'IA
          </p>
        </section>
      </div>
    </AppLayout>
  );
}
