import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/http/request";
import { logger } from "@/lib/observability";

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

type Bucket = { count: number; reset: number };
const rateBuckets = new Map<string, Bucket>();

const openai = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;
const encoder = new TextEncoder();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.reset < now) {
    rateBuckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }

  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return bucket.count <= RATE_LIMIT;
}

async function saveMessage(sessionId: string, role: "user" | "assistant", content: string) {
  await prisma.message.create({
    data: {
      sessionId,
      role,
      content,
    },
  });
}

export async function POST(req: NextRequest) {
  if (!openai) {
    return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const message = body?.message;
  const sessionId = body?.sessionId ?? "anon";

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  await saveMessage(sessionId, "user", message);

  const systemPrompt =
    "You are ShadowSpark website assistant. Port Harcourt, Nigeria based. Services: WhatsApp chatbots (₦350K-600K setup), web dev, AI automation, AI Academy. Direct sales to Reginald +2348107677660, support to Emmanuel +2349040014125, technical to Twilio line. Founder: Okoronkwo Stephen Chijioke (The Architect). Warm, professional, <150 words.";

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        controller.enqueue(encoder.encode(content));
      }
    }
        const existingCount = await prisma.message.count({
          where: { sessionId },
        });
        let finalText = fullResponse;
        if (existingCount + 1 >= 3) {
          const cta = "\n\n💬 Continue on WhatsApp? wa.me/2348107677660 (Sales)";
          finalText += cta;
          controller.enqueue(encoder.encode(cta));
        }
        await saveMessage(sessionId, "assistant", finalText);
      } catch (error) {
        logger.error("chat.stream_failed", { error });
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
