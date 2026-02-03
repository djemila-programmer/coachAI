import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalExercisesCompleted: Number,
  currentStreak: Number,
  totalWordsLearned: Number,
  totalTimeMinutes: Number,
  totalFlashcardsReviewed: Number,
  lastSession: String,
});

export default mongoose.model('Progress', ProgressSchema);
