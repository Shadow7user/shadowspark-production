import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { leadName, source, notes } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `System: ShadowSpark Sales Intelligence.
    Lead: ${leadName} from ${source}.
    Context: ${notes || "No notes yet."}
    Task: Rank this lead 1-10 on 'Close Probability' for a NGN 150k Chatbot.
    Provide a killer opening line for Reginald to send on WhatsApp.`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ analysis: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Agent Offline" }, { status: 500 });
  }
}
