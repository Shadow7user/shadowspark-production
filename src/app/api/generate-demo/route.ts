import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION =
  "You are the Shadowweaver v2 AI. Role: Tactical influence engine. Voice: Controlled, grounded, measured power. Never apologize. Analyze intent and provide a 3-step automation solution.";

const generateDemoSchema = z.object({
  orgName: z.string().trim().min(1).optional(),
  organizationName: z.string().trim().min(1).optional(),
  industry: z.string().trim().min(1, "industry is required"),
  whatsapp: z.string().trim().min(1, "whatsapp is required"),
  intent: z.string().trim().min(1).optional(),
  challenge: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  website: z.string().trim().min(1).optional(),
  services: z.union([z.string(), z.array(z.string())]).optional(),
}).superRefine((value, ctx) => {
  if (!value.orgName?.trim() && !value.organizationName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "organizationName is required",
      path: ["organizationName"],
    });
  }
});

type GenerateDemoBody = z.infer<typeof generateDemoSchema>;

type NormalizedInput = {
  orgName: string;
  industry: string;
  whatsapp: string;
  intent: string;
  location?: string;
  website?: string;
  services: string;
};

type GeminiDemoConfig = {
  organization: string;
  industry: string;
  intent_analysis: string;
  proposed_solution: string;
  automation_steps: [string, string, string];
  recommended_channels: string[];
};

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function normalizeServices(services: GenerateDemoBody["services"]): string {
  if (Array.isArray(services)) {
    return services
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .join(", ");
  }

  return services?.trim() || "Not specified";
}

function buildPrompt(input: NormalizedInput): string {
  return [
    "Analyze this prospect and respond as JSON only.",
    "Return keys: organization, industry, intent_analysis, proposed_solution, automation_steps, recommended_channels.",
    "automation_steps must be an array of exactly 3 concise strings.",
    "recommended_channels must be an array of concise strings.",
    `Organization: ${input.orgName}`,
    `Industry: ${input.industry}`,
    `Intent: ${input.intent}`,
    `WhatsApp: ${input.whatsapp}`,
    `Services: ${input.services}`,
    input.location ? `Location: ${input.location}` : undefined,
    input.website ? `Website: ${input.website}` : undefined,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

function isGeminiDemoConfig(value: unknown): value is GeminiDemoConfig {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.organization === "string" &&
    typeof record.industry === "string" &&
    typeof record.intent_analysis === "string" &&
    typeof record.proposed_solution === "string" &&
    Array.isArray(record.automation_steps) &&
    record.automation_steps.length === 3 &&
    record.automation_steps.every((step) => typeof step === "string") &&
    Array.isArray(record.recommended_channels) &&
    record.recommended_channels.every((channel) => typeof channel === "string")
  );
}

function parseGeminiJson(text: string): GeminiDemoConfig {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/u, "")
    .replace(/^```\s*/u, "")
    .replace(/```\s*$/u, "");

  const parsed: unknown = JSON.parse(cleaned);
  if (!isGeminiDemoConfig(parsed)) {
    throw new Error("Gemini returned unexpected JSON structure");
  }

  return parsed;
}

function buildFallbackConfig(input: NormalizedInput): GeminiDemoConfig {
  return {
    organization: input.orgName,
    industry: input.industry,
    intent_analysis:
      "The buyer is signaling urgency around operational leverage and faster conversion from inbound interest.",
    proposed_solution:
      "Deploy a WhatsApp-first automation system that captures intent, qualifies leads, and routes the highest-value conversations into a controlled follow-up sequence.",
    automation_steps: [
      "Capture inbound requests and classify the buyer's intent automatically.",
      "Collect missing lead data, route qualified prospects, and trigger follow-up tasks instantly.",
      "Track conversion signals across WhatsApp and your internal pipeline to tighten response time.",
    ],
    recommended_channels: ["WhatsApp", "Landing page", "CRM alerts"],
  };
}

async function generateConfig(input: NormalizedInput): Promise<{
  config: GeminiDemoConfig;
  status: "COMPLETED" | "ERROR";
}> {
  if (!genAI) {
    return {
      config: buildFallbackConfig(input),
      status: "ERROR",
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const responseText = result.response.text();
    const config = parseGeminiJson(responseText);

    return { config, status: "COMPLETED" };
  } catch (error) {
    console.error("generate-demo Gemini error", error);
    return {
      config: buildFallbackConfig(input),
      status: "ERROR",
    };
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const json: unknown = await req.json();
    const parsed = generateDemoSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
        { status: 400 },
      );
    }

    const body = parsed.data;
    const orgName = body.orgName?.trim() || body.organizationName?.trim() || "";
    const intent = body.intent?.trim() || body.challenge?.trim() || "";

    if (!intent) {
      return NextResponse.json(
        { error: "intent is required" },
        { status: 400 },
      );
    }

    const normalized: NormalizedInput = {
      orgName,
      industry: body.industry.trim(),
      whatsapp: body.whatsapp.trim(),
      intent,
      services: normalizeServices(body.services),
      ...(body.location ? { location: body.location.trim() } : {}),
      ...(body.website ? { website: body.website.trim() } : {}),
    };

    const { config, status } = await generateConfig(normalized);

    const session = await prisma.demoSession.create({
      data: {
        orgName: normalized.orgName,
        industry: normalized.industry,
        whatsapp: normalized.whatsapp,
        intent: normalized.intent,
        location: normalized.location ?? null,
        website: normalized.website ?? null,
        services: normalized.services,
        challenge: normalized.intent,
        generatedConfig: config as Prisma.InputJsonValue,
        status,
      },
      select: { id: true },
    });

    return NextResponse.json(
      {
        success: true,
        sessionId: session.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("generate-demo fatal error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
