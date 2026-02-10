import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Configuration constants
const MAX_RESPONSE_TOKENS = 300; // Limit responses for cost optimization and brevity
const CLAUDE_MODEL = "claude-3-haiku-20240307"; // Fast, cost-effective model
const API_VERSION = "2023-06-01";

const SYSTEM_PROMPT = `You are ClawBot, ShadowSpark Technologies' AI assistant. You help Nigerian businesses understand our AI services.

Our Services:
1. AI-Powered WhatsApp Business Suite (₦350k-₦600k) - 24/7 customer support chatbots that generate up to 30% more leads
2. Next.js Business Platform (₦450k-₦1.2M) - High-performance websites that convert up to 40% more visitors
3. Process Automation & Dashboard (₦200k-₦800k) - Save 15+ hours per week on manual tasks

Key Points:
- We deliver enterprise-quality solutions in 2-4 weeks
- Technical founder speed with enterprise quality
- Focused on Nigerian SMEs
- All pricing in Nigerian Naira (₦)
- Free AI Automation Audit available

Be helpful, concise, and professional. If asked about services we don't offer, politely redirect to our core offerings. Always encourage booking a free audit at /free-audit for detailed discussions.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback response if API key not configured
      return NextResponse.json({
        message:
          "Thanks for your message! I'm currently being set up. In the meantime, please book a free audit at /free-audit or email us at hello@shadowspark.tech",
      });
    }

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_RESPONSE_TOKENS,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        system: SYSTEM_PROMPT,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage =
      data.content?.[0]?.text ||
      "I'm having trouble responding right now. Please contact us at hello@shadowspark.tech";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("ClawBot error:", error);
    return NextResponse.json(
      {
        message:
          "I'm experiencing technical difficulties. Please email us at hello@shadowspark.tech or book a free audit.",
      },
      { status: 500 },
    );
  }
}
