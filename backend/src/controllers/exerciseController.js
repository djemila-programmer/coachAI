import axios from "axios";

export const getExercises = async (req, res) => {
  try {
    const { language, level } = req.query;

    console.log("🎯 Génération exercices pour :", language, level);

    const prompt = `
Tu es un professeur de langue.

Génère 5 exercices de type QCM pour apprendre ${language} au niveau ${level}.

Retourne UNIQUEMENT du JSON strict sous ce format (rien d’autre) :

{
  "exercises": [
    {
      "type": "multiple_choice",
      "question": "question ici",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 1,
      "explanation": "explication ici",
      "difficulty": "${level}"
    }
  ]
}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const aiText = response.data.candidates[0].content.parts[0].text;

    console.log("Réponse brute Gemini :", aiText);

    // Nettoyage au cas où Gemini met du texte avant/après
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Réponse Gemini invalide (pas de JSON)");

    const parsed = JSON.parse(jsonMatch[0]);

    res.json(parsed.exercises);
  } catch (error) {
    console.error("Erreur Gemini :", error.response?.data || error.message);
    res.status(500).json({ message: "Erreur génération exercices", error: error.message });
  }
};
