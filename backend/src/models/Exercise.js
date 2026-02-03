import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  language: String,
  level: String,
  question: String,
  answer: String,
});

export default mongoose.model('Exercise', ExerciseSchema);
