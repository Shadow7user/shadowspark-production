import { generateWithGemini } from "./gemini";
import { generateWithOpenAI } from "./openai";

export type MessageHistory = Array<{
  role: "user" | "assistant";
  content: string;
}>;

export async function generateAIResponse(
  systemPrompt: string,
  userMessage: string,
  history: MessageHistory = [],
): Promise<string> {
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateWithGemini(systemPrompt, userMessage, history);
    } catch (error) {
      console.warn(
        "[AI] Gemini failed, falling back to OpenAI:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      return await generateWithOpenAI(systemPrompt, userMessage, history);
    } catch (error) {
      console.error(
        "[AI] OpenAI also failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  return (
    "I'm having trouble connecting right now. " +
    "Please WhatsApp us directly at +2348107677660 " +
    "and Reginald will assist you immediately."
  );
}
