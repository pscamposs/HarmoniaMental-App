/**
 * Gemini AI Service — PLACEHOLDER
 * ───────────────────────────────────
 * Usar Google Gemini API para recomendar músicas baseadas no estado emocional
 * e perfil do usuário (histórico, humor, diagnóstico informado).
 *
 * Docs: https://ai.google.dev/gemini-api/docs
 *
 * Variáveis de ambiente necessárias:
 *   EXPO_PUBLIC_GEMINI_API_KEY
 */

export type MoodInput = {
  mood: string; // Ex: "ansioso", "triste", "agitado"
  intensity: 1 | 2 | 3; // 1 = leve, 2 = moderado, 3 = intenso
  context?: string; // Texto livre opcional do usuário
};

export type MusicRecommendation = {
  songName: string;
  artist: string;
  reason: string; // Justificativa terapêutica da IA
  therapyType: string; // "sedativa" | "estimulante" | "catártica" | "meditativa"
};

// ── Placeholder ───────────────────────────────────────────────────────────────

export async function getTherapyRecommendations(
  mood: MoodInput,
): Promise<MusicRecommendation[]> {
  // TODO: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
  // Prompt: "Com base no estado emocional '${mood.mood}' de intensidade ${mood.intensity},
  //          recomende 5 músicas terapêuticas com justificativa clínica..."
  console.log("[Gemini] getTherapyRecommendations:", mood);
  return MOCK_RECOMMENDATIONS;
}

export async function analyzeMoodFromText(text: string): Promise<MoodInput> {
  // TODO: Usar Gemini para inferir humor a partir do texto livre do usuário
  console.log("[Gemini] analyzeMoodFromText:", text);
  return { mood: "ansioso", intensity: 2 };
}

const MOCK_RECOMMENDATIONS: MusicRecommendation[] = [
  {
    songName: "Weightless",
    artist: "Marconi Union",
    reason:
      "Estrutura harmônica de 60 BPM comprovada para reduzir cortisol em 65%.",
    therapyType: "sedativa",
  },
  {
    songName: "River Flows in You",
    artist: "Yiruma",
    reason: "Piano solo com padrão repetitivo que induz estados meditativos.",
    therapyType: "meditativa",
  },
];
