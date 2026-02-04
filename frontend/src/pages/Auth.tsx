import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Languages,
  Mail,
  Lock,
  User,
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

// Typage pour les settings qu'on met à jour
interface SettingsUpdate {
  name?: string;
  isGuest?: boolean;
  isOnboarded?: boolean;
}

export default function Auth() {
  const navigate = useNavigate();
  const { updateSettings, login } = useUser(); // useUser typé correctement

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password); // login typé avec 2 arguments
      } else {
        // Simulation signup => juste créer token et settings
        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateSettings({
          name,
          isGuest: false,
          isOnboarded: true,
        } as SettingsUpdate);
        localStorage.setItem('token', 'dummy-token');
      }

      navigate('/chat');
    } catch (err) {
      setError('Erreur de connexion. Réessaie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    updateSettings({
      name: 'Invité',
      isGuest: false, // pour permettre l'accès
      isOnboarded: true,
    } as SettingsUpdate);
    localStorage.setItem('token', 'dummy-token');
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <Languages className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-2xl text-foreground">LinguaFlow</span>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-soft animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'login'
              ? 'Connecte-toi pour continuer ton apprentissage'
              : 'Rejoins LinguaFlow et commence à apprendre'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-secondary rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              mode === 'login'
                ? 'bg-card shadow-soft text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Connexion
          </button>
          <button
            onClick={() => setMode('signup')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              mode === 'signup'
                ? 'bg-card shadow-soft text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Inscription
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ton prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-12 rounded-xl"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-12 rounded-xl"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-12 rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 gradient-primary text-primary-foreground rounded-xl shadow-glow hover:shadow-xl transition-all"
          >
            {isLoading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        {/* Guest Mode */}
        <div className="mt-6">
          <Button variant="outline" onClick={handleGuestMode} className="w-full h-12 rounded-xl">
            Continuer en tant qu'invité
          </Button>
        </div>
      </div>
    </div>
  );
}
