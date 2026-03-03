import OpenAI from "openai";
import type { MessageHistory } from "./types";

const getOpenAIClient = (): OpenAI | null => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
};

export async function generateWithOpenAI(
  systemPrompt: string,
  userMessage: string,
  history: MessageHistory,
): Promise<string> {
  const client = getOpenAIClient();
  if (!client) throw new Error("OPENAI_API_KEY not configured");

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 280,
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error("Empty response from OpenAI");
  return response;
}
