// Seed data pour initialiser la base de données
// Utilisation: node scripts/seed.js

import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Exercise from '../src/models/Exercise.js';
import Flashcard from '../src/models/Flashcard.js';
import Progress from '../src/models/Progress.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Créer des exercices
    const exercises = await Exercise.insertMany([
      {
        type: 'multiple_choice',
        question: "Comment dit-on 'apple' en français ?",
        options: ['Pomme', 'Poire', 'Orange', 'Banane'],
        correctAnswer: 0,
        explanation: "🍎 'Pomme' est le mot français pour 'apple'.",
        difficulty: 'A1',
        topic: 'Fruits',
      },
      {
        type: 'multiple_choice',
        question: "Quel est le pluriel de 'un œuf' ?",
        options: ['des œufs', 'des œuf', 'des œuves', 'un œufs'],
        correctAnswer: 0,
        explanation: "Le pluriel de 'œuf' est 'œufs'.",
        difficulty: 'A2',
        topic: 'Grammaire',
      },
      {
        type: 'multiple_choice',
        question: "Complétez : 'Je ___ au cinéma hier soir.'",
        options: ['suis allé', 'ai allé', 'étais allé', 'allais'],
        correctAnswer: 0,
        explanation: "Le verbe 'aller' utilise l'auxiliaire 'être' au passé composé.",
        difficulty: 'B1',
        topic: 'Verbes',
      },
    ]);

    console.log(`${exercises.length} exercises créés`);

    // Créer des flashcards
    const flashcards = await Flashcard.insertMany([
      {
        word: 'Bonjour',
        translation: 'Hello / Good morning',
        example: 'Bonjour, comment allez-vous ?',
        pronunciation: '/bɔ̃.ʒuʁ/',
        topic: 'Greetings',
        difficulty: 'A1',
      },
      {
        word: 'Merci beaucoup',
        translation: 'Thank you very much',
        example: 'Merci beaucoup pour votre aide !',
        pronunciation: '/mɛʁ.si bo.ku/',
        topic: 'Politeness',
        difficulty: 'A1',
      },
      {
        word: 'S\'il vous plaît',
        translation: 'Please (formal)',
        example: 'Un café, s\'il vous plaît.',
        pronunciation: '/sil vu plɛ/',
        topic: 'Politeness',
        difficulty: 'A1',
      },
    ]);

    console.log(`${flashcards.length} flashcards créées`);

    await mongoose.connection.close();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
