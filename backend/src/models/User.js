import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isGuest: { type: Boolean, default: true },
  isOnboarded: { type: Boolean, default: false },
  languageToLearn: String,
  userLevel: String,
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
