import { GoogleGenAI } from "@google/genai";

// @ts-ignore
import FINAL_REPORT_TEMPLATE from './reportTemplate.txt?raw';

const GEMINI_MODEL = "gemini-flash-latest";

const promptSteps = [
    {
        name: "Schritt 1/5: Stammdaten extrahieren",
        prompt: (report: string) =>
            `Extrahiere aus dem folgenden Bericht die Kerninformationen: Beteiligte Personen (Häftlinge, Beamte), 
            Ort des Vorfalls, Datum und Uhrzeit. Gib nur diese Informationen kurz und prägnant wieder. Bericht: "${report}"`
    },
    {
        name: "Schritt 2/5: Ereignisse chronologisch ordnen",
        prompt: (report: string, context: string) =>
            `Basierend auf dem Bericht, erstelle eine neutrale, chronologische Beschreibung der Ereignisse in der 
            Vergangenheitsform. Bisherige Erkenntnisse:\n${context}\n\nOriginalbericht: "${report}"`
    },
    {
        name: "Schritt 3/5: Maßnahmen und Konsequenzen analysieren",
        prompt: (report: string, context: string) =>
            `Identifiziere die ergriffenen Maßnahmen der Beamten, sowie eventuelle Verletzungen oder Sachschäden. 
            Bisherige Erkenntnisse:\n${context}\n\nOriginalbericht: "${report}"`
    },
    {
        name: "Schritt 4/5: Folgemaßnahmen festlegen",
        prompt: (report: string, context: string) =>
            `Bestimme auf Basis der bisherigen Informationen die notwendigen Folgemaßnahmen (z.B. Disziplinarverfahren, 
            ärztliche Versorgung). Bisherige Erkenntnisse:\n${context}\n\nOriginalbericht: "${report}"`
    },
    {
        name: "Schritt 5/5: Endgültigen Bericht erstellen",
        prompt: (_report: string, context: string) =>
            `Sie sind ein Experte für das Verfassen von formellen Vorfallberichten im deutschen Justizvollzug. 
            Füllen Sie die folgende Vorlage exakt aus. Nutzen Sie dafür AUSSCHLIESSLICH die zusammengefassten Informationen. 
            Erfinden Sie keine Details. Kennzeichnen Sie fehlende Angaben mit Platzhaltern wie "[Angabe fehlt]". 
            Unterschrift Feld soll wie im Final report template angegeben belassen werden. 

        ZUSAMMENGEFASSTE INFORMATIONEN:
        ${context}
        
        VORLAGE:
        ${FINAL_REPORT_TEMPLATE}`
    }
];

export const generateFormalReport = async (
    informalReport: string,
    onProgress: (message: string) => void
): Promise<string> => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("API key is not set. Please set the GEMINI_API_KEY environment variable.");
    }

    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    let accumulatedContext = "";

    try {
        for (const step of promptSteps) {
            onProgress(step.name);
            const currentPrompt = step.prompt(informalReport, accumulatedContext);

            const response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: currentPrompt,
            });

            if (promptSteps.at(-1) !== step) {
                const stepNameForContext = step.name.split(':')[1].trim();
                accumulatedContext += `**${stepNameForContext}**:\n${response.text}\n\n`;
                continue;
            }

            return response.text;
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error?.toString().includes('503') || error?.toString().includes('overloaded')) {
            throw new Error("The AI model is currently busy. Please try again in a few moments.");
        }
        if (error?.toString().includes('API key not valid')) {
            throw new Error("Your API key is not valid. Please check it and try again.");
        }
        throw new Error("Failed to generate the report. The AI service may be unavailable or there's a network issue.");
    }
};