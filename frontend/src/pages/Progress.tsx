import { useEffect, useState } from 'react';
import { Flame, BookOpen, Clock, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useUser } from '@/context/UserContext';
import axios from 'axios';

interface Session {
  _id: string;
  type: string; // Chat | Exercices | Révision
  duration: number; // en minutes
  score: number; // en %
  createdAt: string;
}

export default function Progress() {
  const user = useUser();
  const token = user.token;

  // ⚡️ Défaut progress si le contexte est vide
  const progress = user.progress ?? {
    currentStreak: 0,
    totalWordsLearned: 0,
    totalTimeMinutes: 0,
    totalExercisesCompleted: 0,
    totalFlashcardsReviewed: 0,
  };

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get<Session[]>('/api/sessions?limit=5', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur récupération sessions :', err);
        setSessions([]);
        setLoading(false);
      });
  }, [token]);

  // 💬 Message dynamique selon la progression
  let progressMessage = '';
  if (progress.totalWordsLearned === 0) {
    progressMessage = "Commence ton apprentissage pour voir ta progression !";
  } else if (progress.currentStreak < 3) {
    progressMessage = "Petit début, continue comme ça !";
  } else if (progress.currentStreak < 7) {
    progressMessage = "Super, tu as commencé à prendre de l'élan !";
  } else {
    progressMessage = "Félicitations, tu es en super progression !";
  }

  return (
    <AppLayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <p className="text-muted-foreground">Chargement de ta progression…</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Ta progression 📊
            </h1>
            <p className="text-muted-foreground">{progressMessage}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { icon: Flame, label: 'Série actuelle', value: progress.currentStreak, suffix: 'jours', color: 'text-warning', bgColor: 'bg-warning/10' },
              { icon: BookOpen, label: 'Mots appris', value: progress.totalWordsLearned, suffix: '', color: 'text-primary', bgColor: 'bg-primary/10' },
              { icon: Clock, label: 'Temps total', value: progress.totalTimeMinutes, suffix: 'min', color: 'text-accent', bgColor: 'bg-accent/10' },
              { icon: Trophy, label: 'Exercices', value: progress.totalExercisesCompleted, suffix: '', color: 'text-success', bgColor: 'bg-success/10' },
              { icon: BookOpen, label: 'Révisions', value: progress.totalFlashcardsReviewed ?? 0, suffix: '', color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-100' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {stat.value}
                  <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly Activity */}
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Activité hebdomadaire</h3>
                <p className="text-sm text-muted-foreground">Minutes d'apprentissage par jour</p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-40">
              {sessions.length === 0
                ? Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-medium text-foreground">0m</span>
                      <div className="w-full rounded-t-lg gradient-primary h-0 transition-all duration-500" />
                      <span className="text-xs text-muted-foreground">—</span>
                    </div>
                  ))
                : (() => {
                    const weeklyActivity = sessions.map((s) => ({
                      day: new Date(s.createdAt).toLocaleDateString('fr-FR', { weekday: 'short' }),
                      minutes: s.duration,
                    }));
                    const maxMinutes = Math.max(...weeklyActivity.map((d) => d.minutes), 1);
                    return weeklyActivity.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{day.minutes}m</span>
                        <div
                          className="w-full rounded-t-lg gradient-primary transition-all duration-500"
                          style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                      </div>
                    ));
                  })()}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Historique récent</h3>
                <p className="text-sm text-muted-foreground">Tes dernières sessions</p>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune session pour l'instant.</p>
              ) : (
                sessions.map((session) => (
                  <div key={session._id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{session.type[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{session.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.createdAt).toLocaleDateString()} • {session.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-foreground">{session.score}%</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
