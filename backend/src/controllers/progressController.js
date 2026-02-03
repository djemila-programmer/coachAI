import Progress from '../models/Progress.js';

/* ================= GET PROGRESS ================= */

export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });

    if (!progress || progress.totalExercisesCompleted === 0) {
      return res.json({
        message: "Commence un premier exercice pour voir ta progression 🚀",
        progress: null,
      });
    }

    res.json({
      message: "Continue comme ça 💪",
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

/* ================= UPDATE PROGRESS ================= */

export const updateProgress = async (req, res) => {
  try {
    const updatedProgress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          ...req.body,
          lastSession: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Progression mise à jour avec succès ✅",
      progress: updatedProgress,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
