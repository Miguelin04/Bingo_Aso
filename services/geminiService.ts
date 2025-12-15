import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBingoCall = async (number: number): Promise<string> => {
  if (!ai) return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Eres un locutor de Bingo divertido y carismático en una fiesta.
      Genera una frase corta, ingeniosa, o una rima cultural (en Español) para cantar el número "${number}".
      Ejemplo para 22: "¡Los dos patitos!"
      Ejemplo para 15: "¡La niña bonita!"
      Solo devuelve la frase, sin explicaciones ni comillas. Máximo 10 palabras.`,
      config: {
        maxOutputTokens: 30,
        temperature: 0.9,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating bingo call:", error);
    return "";
  }
};