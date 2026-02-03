import fetch from 'node-fetch';

export const generateAIResponse = async (req, res, next) => {
  try {
    const { message, language, level, mode } = req.body;

    const systemPrompt = `
Tu es LanguageCoach, un professeur de langues IA expert, bienveillant, patient et pédagogique.
Tu accompagnes l’utilisateur dans l’apprentissage d’une langue de manière progressive et motivante.

Langue cible : ${language}
Niveau : ${level}
Mode : ${mode || "free"}
Message de l’utilisateur : "${message}"

Réponds toujours dans la langue cible, corrige doucement si nécessaire, et encourage l’apprenant.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt + "\n\nUtilisateur : " + message }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Réponse brute Gemini:", data);

    if (data.error) {
      return res.status(400).json({ reply: "Erreur avec Gemini : " + JSON.stringify(data.error) });
    }

    const aiText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Désolé, je n’ai pas pu générer de réponse.";

    res.json({ reply: aiText });

  } catch (e) {
    console.error("Erreur Gemini :", e);
    res.status(500).json({ reply: "Erreur serveur IA." });
  }
};
