import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{ role: String, content: String }],
  type: String,
}, { timestamps: true });

export default mongoose.model('Conversation', ConversationSchema);
