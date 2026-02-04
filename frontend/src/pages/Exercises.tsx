import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, Zap } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

interface Exercise {
  id: string;
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

export default function Exercises() {
  const { settings, progress, updateProgress } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentExercise = exercises[currentIndex];
  if (!currentExercise) {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Aucun exercice trouvé pour ce niveau / langue.</p>
      </div>
    </AppLayout>
  );
}

  const isCorrect = selectedAnswer === currentExercise?.correctAnswer;

  // ✅ Récupération exercices depuis le backend
  useEffect(() => {
    const fetchExercises = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(
      `/api/exercises?language=${settings.languageToLearn}&level=${settings.userLevel}`,
      {
        method: "GET",   // 👉 IMPORTANT
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!res.ok) throw new Error(`Erreur ${res.status}`);

    const data = await res.json();
    setExercises(data);
  } catch (err: any) {
    console.error(err);
    setError("Impossible de récupérer les exercices.");
  } finally {
    setLoading(false);
  }
};

    fetchExercises();
  }, [settings]);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleValidate = () => {
    if (selectedAnswer === null) return;
    setShowFeedback(true);

    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
      updateProgress({
  totalExercisesCompleted:
  (progress?.totalExercisesCompleted || 0) + exercises.length,
});
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
  };

  if (loading)
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <p className="text-muted-foreground text-lg">Chargement des exercices...</p>
        </div>
      </AppLayout>
    );

  if (error)
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <Button onClick={handleRestart}>Réessayer</Button>
        </div>
      </AppLayout>
    );

  if (isComplete) {
    const percentage = Math.round((score / (exercises.length * 12)) * 100);
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
          <div className="bg-card rounded-3xl p-8 max-w-md w-full text-center shadow-soft animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-success flex items-center justify-center">
              <Trophy className="w-10 h-10 text-success-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Session terminée ! 🎉
            </h2>
            <p className="text-muted-foreground mb-6">Tu as fait du super travail aujourd'hui.</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-secondary rounded-2xl p-4">
                <p className="text-3xl font-display font-bold text-foreground">{score}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
              <div className="bg-secondary rounded-2xl p-4">
                <p className="text-3xl font-display font-bold text-foreground">{percentage}%</p>
                <p className="text-sm text-muted-foreground">Réussite</p>
              </div>
            </div>

            <Button
              onClick={handleRestart}
              className="w-full gradient-primary text-primary-foreground rounded-xl py-6 shadow-glow"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Recommencer
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Question {currentIndex + 1}/{exercises.length}
            </span>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {streak > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning animate-bounce-subtle">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">{streak}x</span>
              </div>
            )}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">{score}</span>
            </div>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-soft animate-fade-in">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-4">
            Niveau {currentExercise.difficulty}
          </span>

          <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-8">
            {currentExercise.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentExercise.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentExercise.correctAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={cn(
                    'w-full p-4 rounded-2xl text-left font-medium transition-all duration-200',
                    'border-2 flex items-center justify-between',
                    showFeedback && isCorrectOption
                      ? 'border-success bg-success/10 text-success'
                      : showFeedback && isSelected && !isCorrectOption
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-background'
                  )}
                >
                  <span>{option}</span>
                  {showFeedback && isCorrectOption && <CheckCircle className="w-5 h-5" />}
                  {showFeedback && isSelected && !isCorrectOption && <XCircle className="w-5 h-5" />}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div
              className={cn(
                'p-4 rounded-2xl mb-6 animate-slide-up',
                isCorrect ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
              )}
            >
              <p className={cn('font-medium mb-2', isCorrect ? 'text-success' : 'text-destructive')}>
                {isCorrect ? '✨ Excellent !' : '💪 Pas tout à fait...'}
              </p>
              <p className="text-sm text-foreground">{currentExercise.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {!showFeedback ? (
              <Button
                onClick={handleValidate}
                disabled={selectedAnswer === null}
                className="flex-1 gradient-primary text-primary-foreground rounded-xl py-6 shadow-glow disabled:opacity-50 disabled:shadow-none"
              >
                Valider
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 gradient-primary text-primary-foreground rounded-xl py-6 shadow-glow"
              >
                {currentIndex < exercises.length - 1 ? 'Suivant' : 'Voir les résultats'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
