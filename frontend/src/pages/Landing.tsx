import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';

// Typage pour les settings
interface SettingsUpdate {
  languageToLearn?: string;
  userLevel?: string;
  learningGoals?: string[];
  isOnboarded?: boolean;
}

// Toutes les langues disponibles
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

const levels = [
  { id: 'A1', name: 'Débutant', description: 'Je débute complètement' },
  { id: 'A2', name: 'Élémentaire', description: 'Je connais les bases' },
  { id: 'B1', name: 'Intermédiaire', description: 'Je me débrouille' },
  { id: 'B2', name: 'Avancé', description: 'Je suis à l\'aise' },
  { id: 'C1', name: 'Expert', description: 'Je maîtrise bien' },
  { id: 'C2', name: 'Maîtrise', description: 'Quasi bilingue' },
];

const goals = [
  { id: 'travel', name: 'Voyage', icon: '✈️', description: 'Voyager et explorer' },
  { id: 'professional', name: 'Professionnel', icon: '💼', description: 'Carrière et business' },
  { id: 'academic', name: 'Études', icon: '🎓', description: 'Examens et diplômes' },
  { id: 'conversation', name: 'Conversation', icon: '💬', description: 'Parler au quotidien' },
  { id: 'culture', name: 'Culture', icon: '📚', description: 'Littérature et cinéma' },
];

// === LOGIN MODAL ===
function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, loginWithGoogle } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion Google');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Connectez-vous pour continuer</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="bg-blue-500 text-white rounded-lg py-2 mt-2">
            Connexion
          </Button>
        </form>
        <Button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white rounded-lg py-2 mt-2 w-full"
        >
          Continuer avec Google
        </Button>
        <Button variant="outline" onClick={onClose} className="mt-2 w-full">
          Annuler
        </Button>
      </div>
    </div>
  );
}

// === LANDING ===
export default function Landing() {
  const navigate = useNavigate();
  const { settings, updateSettings, token } = useUser();
  const [step, setStep] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [otherGoal, setOtherGoal] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    if (!token && step > 0) setLoginOpen(true);
  }, [token, step]);

  const handleStart = () => {
    if (!token) {
      setLoginOpen(true);
    } else {
      setStep(1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(g => g !== goalId) : [...prev, goalId]
    );
  };

  const handleComplete = () => {
    const finalGoals = showOtherInput && otherGoal.trim()
      ? [...selectedGoals, `other:${otherGoal.trim()}`]
      : selectedGoals;

    updateSettings({
      languageToLearn: selectedLanguage,
      userLevel: selectedLevel,
      learningGoals: finalGoals,
      isOnboarded: true,
    } as SettingsUpdate);

    navigate('/chat');
  };

  const canProceed = () => {
    if (step === 1) return selectedLanguage !== '';
    if (step === 2) return selectedLevel !== '';
    if (step === 3) return selectedGoals.length > 0 || (showOtherInput && otherGoal.trim());
    return false;
  };

  // === PAGE AVANT COMMENCER ===
  if (step === 0) {
    return (
      <>
        <LoginModal isOpen={loginOpen} onClose={() => { setLoginOpen(false); setStep(1); }} />
        <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Languages className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">LinguaFlow</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Maîtrise une nouvelle langue <span className="text-gradient">naturellement</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Conversations réalistes, exercices personnalisés et feedback instantané.
              Ton tuteur IA s'adapte à ton rythme pour t'aider à progresser chaque jour.
            </p>

            <div className="flex justify-center mt-6">
  <Button
    onClick={handleStart}
    className="bg-blue-500 text-white px-8 py-4 rounded-2xl shadow-glow flex items-center gap-2"
  >
    Commencer gratuitement <ChevronRight className="w-5 h-5" />
  </Button>
</div>

            <div className="mt-16 text-left w-full max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start gap-2">
                <h3 className="font-semibold text-lg text-foreground">✔️ Suivi personnalisé</h3>
                <p className="text-muted-foreground text-sm">
                  Ton apprentissage est adapté à ton niveau et à ton rythme grâce à notre IA.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <h3 className="font-semibold text-lg text-foreground">✔️ Exercices interactifs</h3>
                <p className="text-muted-foreground text-sm">
                  Des exercices pratiques pour améliorer ton vocabulaire, ta grammaire et la compréhension orale.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <h3 className="font-semibold text-lg text-foreground">✔️ Feedback instantané</h3>
                <p className="text-muted-foreground text-sm">
                  Notre tuteur IA fournit des corrections et conseils immédiats pour progresser efficacement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // === ONBOARDING STEPS 1-3 ===
  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      <div className="w-full h-1 bg-secondary">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl animate-fade-in flex flex-col gap-6">

          {/* STEP 1 : Langue */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold mb-4">Choisis la langue à apprendre</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
                      ${selectedLanguage === lang.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 hover:border-blue-500'}
                    `}
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="font-semibold">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 : Niveau */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold mb-4">Ton niveau</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {levels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`flex flex-col p-4 rounded-xl border transition-all text-left
                      ${selectedLevel === level.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 hover:border-blue-500'}
                    `}
                  >
                    <span className="font-bold">{level.name}</span>
                    <span className="text-sm text-muted-foreground">{level.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 : Objectifs */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold mb-4">Tes objectifs</h2>
              <div className="flex flex-wrap gap-3">
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all
                      ${selectedGoals.includes(goal.id) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 hover:border-blue-500'}
                    `}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <span className="font-semibold">{goal.name}</span>
                  </button>
                ))}
                {showOtherInput ? (
                  <Input
                    placeholder="Autre objectif..."
                    value={otherGoal}
                    onChange={(e) => setOtherGoal(e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <button
                    onClick={() => setShowOtherInput(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-gray-400 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all"
                  >
                    + Autre
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between gap-4 mt-8">
            {step === 1 ? (
              <Button variant="outline" onClick={() => setStep(0)}>
    Retour à l'accueil
  </Button>
            ) : step > 1 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Retour
              </Button>
            ) : null}

            <Button
              onClick={() => (step === 3 ? handleComplete() : setStep((s) => s + 1))}
              disabled={!canProceed()}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl flex items-center justify-center"
            >
              {step === 3 ? 'Commencer' : 'Continuer'} <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
