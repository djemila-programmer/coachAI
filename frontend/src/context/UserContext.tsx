import { createContext, useContext, useState, ReactNode } from 'react';

/* ================= TYPES ================= */

export interface UserProgress {
  totalExercisesCompleted: number;
  currentStreak: number;
  totalWordsLearned: number;
  totalTimeMinutes: number;
  totalFlashcardsReviewed: number;
  lastSession?: string;
}

export interface UserSettings {
  name?: string;
  languageToLearn: string;
  userLevel: string;
  isGuest: boolean;
  isOnboarded: boolean;
  learningGoals?: string[];
}

export interface UserContextType {
  token: string | null;
  isAuthenticated: boolean;
  settings: UserSettings;
  progress: UserProgress;
  

  // 🔑 CONTRAT EXACT UTILISÉ DANS Auth.tsx
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  updateProgress: (progress: Partial<UserProgress>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetProgress: () => void;

  loginWithGoogle: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [progress, setProgress] = useState<UserProgress>({
    totalExercisesCompleted: 0,
    currentStreak: 0,
    totalWordsLearned: 0,
    totalTimeMinutes: 0,
    totalFlashcardsReviewed: 0,
  });

  const [settings, setSettings] = useState<UserSettings>({
    name: 'Utilisateur',
    languageToLearn: 'french',
    userLevel: 'débutant',
    isGuest: !token,
    isOnboarded: false,
  });

  /* ================= AUTH ================= */

  const login = async (email: string, password: string) => {
    // 🔥 PLUS TARD : appel backend avec axios
    // const res = await api.post('/auth/login', { email, password });
    // const token = res.data.token;

    const dummyToken = 'dummy-token';

    localStorage.setItem('token', dummyToken);
    setToken(dummyToken);
    setSettings(prev => ({ ...prev, isGuest: false }));
  };

  const loginWithGoogle = async () => {
    const dummyToken = 'google-token';

    localStorage.setItem('token', dummyToken);
    setToken(dummyToken);
    setSettings(prev => ({ ...prev, isGuest: false }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setSettings(prev => ({ ...prev, isGuest: true }));
  };

  /* ================= PROGRESS ================= */

  const updateProgress = (newProgress: Partial<UserProgress>) => {
    setProgress(prev => ({
      ...prev,
      ...newProgress,
      lastSession: new Date().toISOString(),
    }));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetProgress = () => {
    setProgress({
      totalExercisesCompleted: 0,
      currentStreak: 0,
      totalWordsLearned: 0,
      totalTimeMinutes: 0,
      totalFlashcardsReviewed: 0,
    });
  };

  return (
    <UserContext.Provider
      value={{
        token,
        isAuthenticated: !!true,
        settings,
        progress,
        login,
        loginWithGoogle,
        logout,
        updateProgress,
        updateSettings,
        resetProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return ctx;
}
