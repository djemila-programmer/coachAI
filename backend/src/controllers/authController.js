import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import fetch from 'node-fetch';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(401).json({ message: 'Identifiants invalides' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    // 🔥 Connexion API Google Studio (Gemini)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    res.json({ aiResponse: data });
  } catch (e) {
    next(e);
  }
};
