export const getFlashcards = async (req, res) => {
  try {
    const { userLevel, languageToLearn } = req.body;

    console.log("🎯 Génération flashcards pour :", languageToLearn, userLevel);

    const prompt = `
Tu es un professeur de langue.

Génère 8 flashcards pour apprendre ${languageToLearn} au niveau ${userLevel}.

Retourne UNIQUEMENT du JSON strict sous ce format (rien d’autre) :

{
  "flashcards": [
    {
      "word": "mot",
      "translation": "traduction",
      "example": "exemple dans une phrase",
      "pronunciation": "prononciation approximative",
      "topic": "thème"
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

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Réponse Gemini invalide (pas de JSON)");

    const parsed = JSON.parse(jsonMatch[0]);

    res.json(parsed.flashcards);
  } catch (error) {
    console.error("Erreur Gemini :", error.response?.data || error.message);
    res.status(500).json({ message: "Erreur génération flashcards", error: error.message });
  }
};

// ✅ AJOUTE CECI 👇
export const createFlashcard = async (req, res) => {
  return getFlashcards(req, res);
};
