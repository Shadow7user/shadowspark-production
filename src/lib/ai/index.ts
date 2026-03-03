import { env } from "@/lib/env";
import { generateWithGemini } from "./gemini";
import { generateWithOpenAI } from "./openai";
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

  const fallbackNumber =
    env.whatsappEscalationNumber || "+2348107677660";
  const fallbackName = env.whatsappEscalationName || "Reginald";

  return (
    "I'm having trouble connecting right now. " +
    `Please WhatsApp us directly at ${fallbackNumber} ` +
    `and ${fallbackName} will assist you immediately.`
  );
}
