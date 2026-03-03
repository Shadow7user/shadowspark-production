import { GoogleGenerativeAI } from "@google/generative-ai";

export type MessageHistory = Array<{
  role: "user" | "assistant";
  content: string;
}>;

const getGeminiClient = (): GoogleGenerativeAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

export async function generateWithGemini(
  systemPrompt: string,
  userMessage: string,
  history: MessageHistory,
): Promise<string> {
  const client = getGeminiClient();
  if (!client) throw new Error("GEMINI_API_KEY not configured");

  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash-exp",
    systemInstruction: systemPrompt,
  });

  const geminiHistory = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: geminiHistory,
    generationConfig: {
      maxOutputTokens: 280,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response.text();

  if (!response) throw new Error("Empty response from Gemini");
  return response;
}
