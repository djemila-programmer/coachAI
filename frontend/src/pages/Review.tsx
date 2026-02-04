import { useState, useEffect } from 'react';
import { RotateCcw, Check, X, BookOpen } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

interface FlashCard {
  id: string;
  word: string;
  translation: string;
  example: string;
  pronunciation: string;
  topic: string;
}

export default function Review() {
  const { settings, progress, updateProgress } = useUser();
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  const currentCard = flashcards[currentIndex];
  if (!currentCard) {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Aucune carte trouvée pour ce niveau / langue.</p>
      </div>
    </AppLayout>
  );
}

  const progressPercentage = flashcards.length ? (reviewed.size / flashcards.length) * 100 : 0;

  // ✅ Récupération des flashcards depuis le backend
  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userLevel: settings.userLevel,
    languageToLearn: settings.languageToLearn,
  }),
});

        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
setFlashcards(data);
      } catch (err: any) {
        console.error(err);
        setError('Impossible de récupérer les cartes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [settings]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleResponse = (knew: boolean) => {
    setReviewed((prev) => new Set(prev).add(currentCard.id));

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      // Mettre à jour la progression utilisateur
      updateProgress({
  totalFlashcardsReviewed:
  (progress?.totalFlashcardsReviewed || 0) + flashcards.length,
});
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewed(new Set());
  };

  if (loading)
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <p className="text-muted-foreground text-lg">Chargement des cartes...</p>
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

  if (reviewed.size === flashcards.length) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
          <div className="bg-card rounded-3xl p-8 max-w-md w-full text-center shadow-soft animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Session terminée ! 📚
            </h2>
            <p className="text-muted-foreground mb-6">
              Tu as révisé {flashcards.length} cartes.
            </p>
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
      <div className="max-w-lg mx-auto p-4 md:p-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            Carte {currentIndex + 1}/{flashcards.length}
          </span>
          <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div
          className={cn(
            'relative bg-card rounded-3xl shadow-soft cursor-pointer',
            'transition-all duration-500 transform-gpu',
            'min-h-[300px] flex items-center justify-center p-8',
            isFlipped && 'bg-gradient-to-br from-primary/5 to-accent/5'
          )}
          onClick={handleFlip}
          style={{ perspective: '1000px' }}
        >
          {!isFlipped ? (
            <div className="text-center animate-fade-in">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-4">
                {currentCard.topic}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {currentCard.word}
              </h2>
              <p className="text-sm text-muted-foreground">Clique pour retourner</p>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <p className="text-lg text-primary font-semibold mb-2">{currentCard.translation}</p>
              <p className="text-sm text-muted-foreground font-mono mb-4">{currentCard.pronunciation}</p>
              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <p className="text-sm italic text-foreground">"{currentCard.example}"</p>
              </div>
              <p className="text-xs text-muted-foreground">Comment t'en es-tu sorti ?</p>
            </div>
          )}
        </div>

        {/* Response Buttons */}
        {isFlipped && (
          <div className="flex gap-4 mt-6 animate-slide-up">
            <Button
              onClick={() => handleResponse(false)}
              variant="outline"
              className="flex-1 rounded-xl py-6 border-destructive/50 hover:bg-destructive/10 text-destructive"
            >
              <X className="w-5 h-5 mr-2" />
              À revoir
            </Button>
            <Button
              onClick={() => handleResponse(true)}
              className="flex-1 rounded-xl py-6 gradient-success text-success-foreground"
            >
              <Check className="w-5 h-5 mr-2" />
              Maîtrisé
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-display font-bold text-foreground">{flashcards.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-display font-bold text-success">{reviewed.size}</p>
            <p className="text-xs text-muted-foreground">Révisées</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-display font-bold text-primary">{flashcards.length - reviewed.size}</p>
            <p className="text-xs text-muted-foreground">Restantes</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
