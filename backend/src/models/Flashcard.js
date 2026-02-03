import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  front: String,
  back: String,
});

export default mongoose.model('Flashcard', FlashcardSchema);
