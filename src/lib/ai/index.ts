import { generateWithGemini } from "./gemini";
import { generateWithOpenAI } from "./openai";
import { getEscalationContact } from "./config";
import type { MessageHistory } from "./types";
export type { MessageHistory } from "./types";

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

  const { number, name } = getEscalationContact();

  return (
    "I'm having trouble connecting right now. " +
    `Please WhatsApp us directly at ${number} ` +
    `and ${name} will assist you immediately.`
  );
}
