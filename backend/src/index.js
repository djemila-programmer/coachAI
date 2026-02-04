import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import conversationRoutes from './routes/conversation.js';
import exerciseRoutes from './routes/exercise.js';
import flashcardRoutes from './routes/flashcard.js';
import progressRoutes from './routes/progress.js';

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173","http://localhost:8080", "http://localhost:8081","https://languagecoach-rfjy.onrender.com","https://coach-ai-rwet.vercel.api" ],
  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ✅ ROUTE RACINE (très importante pour Render)
app.get('/', (req, res) => {
  res.send("🚀 API LanguageCoach fonctionne !");
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/progress', progressRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 10000;

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB erreur', err));

// Démarrage serveur (OBLIGATOIRE pour Render)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
