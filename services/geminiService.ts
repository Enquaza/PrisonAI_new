
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Sie sind ein Experte für die formelle deutsche Geschäftskommunikation. Ihre Aufgabe ist es, einen informellen, unstrukturierten Bericht in deutscher Sprache in einen formellen, gut strukturierten Geschäftsbericht umzuwandeln. Die Ausgabe muss auf Deutsch sein und einem klaren, professionellen Format folgen. Verwenden Sie Überschriften wie "Betreff", "Datum", "Zusammenfassung", "Detaillierte Analyse" und "Empfohlene Maßnahmen". Stellen Sie sicher, dass der Ton professionell und die Sprache präzise ist. Geben Sie nur den formatierten Bericht zurück.`;

export const generateFormalReport = async (informalReport: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not set. Please set the API_KEY environment variable.");
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: informalReport,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate the report. The AI service may be unavailable.");
  }
};
