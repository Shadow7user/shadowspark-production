import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT =
  "You are an AI systems architect for Nigerian businesses. Generate a structured demo config as JSON only. No markdown.";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const dynamic = "force-dynamic";

interface GenerateDemoBody {
  organizationName?: string;
  industry?: string;
  services?: string | string[];
  challenge?: string;
  location?: string;
  whatsapp?: string;
  website?: string;
}

type NormalizedInput = {
  organizationName: string;
  industry: string;
  services: string;
  challenge: string;
  location?: string;
  whatsapp?: string;
  website?: string;
};

function normalizeServices(services: string | string[] | undefined): string {
  if (Array.isArray(services)) {
    return services.map((item) => item?.trim()).filter(Boolean).join(", ");
  }
  return (services ?? "").trim();
}

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z]*\s*/u, "").replace(/```\s*$/u, "");
  }
  return trimmed;
}

function buildMockConfig(input: NormalizedInput) {
  return {
    version: "mock-1",
    organizationName: input.organizationName,
    industry: input.industry,
    services: input.services,
    challenge: input.challenge,
    architecture: {
      channels: ["WhatsApp", "Web chat"],
      integrations: ["Knowledge base", "CRM", "Payment links"],
      latencyBudgetMs: 1200,
    },
    automations: [
      {
        name: "High-intent lead capture",
        trigger: "Inbound WhatsApp message",
        steps: [
          "Detect intent and classify lead tier",
          "Collect name, company, and budget",
          "Sync to CRM and alert sales",
        ],
      },
      {
        name: "Service routing",
        trigger: "Customer asks for specific service",
        steps: [
          "Confirm requirements",
          "Fetch SLA/pricing from config",
          "Book follow-up or generate payment link",
        ],
      },
    ],
    metrics: {
      targetFRTSeconds: 1.5,
      deflectionRate: 0.42,
      csatTarget: 4.7,
    },
  };
}

async function getAiConfig(input: NormalizedInput) {
  const userPrompt = [
    `Organization: ${input.organizationName}`,
    `Industry: ${input.industry}`,
    `Services: ${input.services}`,
    `Primary Challenge: ${input.challenge}`,
    input.location ? `Location: ${input.location}` : undefined,
    input.website ? `Website: ${input.website}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://shadowspark-tech.org",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("OpenRouter response missing content");
  }

  const parsed = JSON.parse(stripJsonFence(content));
  return parsed;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateDemoBody;

    const organizationName = (body.organizationName ?? "").trim();
    const industry = (body.industry ?? "").trim();
    const services = normalizeServices(body.services);
    const challenge = (body.challenge ?? "").trim();

    if (!organizationName || !industry || !services || !challenge) {
      return NextResponse.json(
        { success: false, error: "organizationName, industry, services, and challenge are required" },
        { status: 400 },
      );
    }

    const normalized: NormalizedInput = {
      organizationName,
      industry,
      services,
      challenge,
      ...(body.location?.trim() ? { location: body.location.trim() } : {}),
      ...(body.whatsapp?.trim() ? { whatsapp: body.whatsapp.trim() } : {}),
      ...(body.website?.trim() ? { website: body.website.trim() } : {}),
    };

    let generatedConfig: Prisma.InputJsonValue;
    let status: "COMPLETED" | "ERROR" = "COMPLETED";

    try {
      generatedConfig = (await getAiConfig(normalized)) as Prisma.InputJsonValue;
    } catch (error) {
      console.error("generate-demo OpenRouter error", error);
      generatedConfig = buildMockConfig(normalized) as Prisma.InputJsonValue;
      status = "ERROR";
    }

    const session = await prisma.demoSession.create({
      data: {
        organizationName,
        industry,
        location: normalized.location ?? null,
        services,
        whatsapp: normalized.whatsapp ?? "not-provided",
        challenge,
        website: normalized.website ?? null,
        generatedConfig,
        status,
      },
      select: { id: true, status: true, generatedConfig: true },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      status: session.status,
      generatedConfig: session.generatedConfig,
    });
  } catch (error) {
    console.error("generate-demo fatal error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
