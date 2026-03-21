import { z } from "zod";
import { generateGeminiText } from "@/lib/ai/gemini";
import { prisma } from "@/lib/prisma";
import {
  createSecurityLogEntry,
  inferOutputRiskCategories,
  logSecurityEvent,
  securePostcheck,
  securePrecheck,
} from "@/lib/security";
import { normaliseTwilioBody } from "@/lib/twilio";

const competitorInsightSchema = z.object({
  competitor: z.string().trim().min(1).optional(),
  pressure: z.string().trim().min(1).optional(),
  asymmetricAdvantage: z.string().trim().min(1).optional(),
});

const generatedConfigSchema = z.object({
  assessment: z.string().trim().min(1).optional(),
  spark: z.string().trim().min(1).optional(),
  proposed_solution: z.string().trim().min(1).optional(),
  competitorAnalysis: z.array(competitorInsightSchema).optional(),
});

const followUpVariantSchema = z.object({
  label: z.string().trim().min(1).max(40),
  tone: z.enum(["tactical", "insight", "urgent"]),
  message: z.string().trim().min(20).max(800),
});

const followUpDraftSchema = z.object({
  variations: z
    .array(followUpVariantSchema)
    .length(3)
    .refine(
      (variations) =>
        JSON.stringify(variations.map((variation) => variation.tone).sort()) ===
        JSON.stringify(["insight", "tactical", "urgent"]),
      {
        message: "All required follow-up tones must be present.",
      },
    ),
});

const leadIdSchema = z.string().cuid();

export type FollowUpVariation = z.infer<typeof followUpVariantSchema>;

function extractAssessment(generatedConfig: unknown): string {
  const parsed = generatedConfigSchema.safeParse(generatedConfig);

  if (!parsed.success) {
    return "A premium execution path is already prepared.";
  }

  if (parsed.data.assessment) {
    return parsed.data.assessment;
  }

  return parsed.data.proposed_solution || "A premium execution path is already prepared.";
}

function extractSpark(generatedConfig: unknown): string {
  const parsed = generatedConfigSchema.safeParse(generatedConfig);

  if (!parsed.success) {
    return "Move quickly while the reveal is still fresh.";
  }

  return parsed.data.spark || "Move quickly while the reveal is still fresh.";
}

function extractCompetitorAnalysis(generatedConfig: unknown): string {
  const parsed = generatedConfigSchema.safeParse(generatedConfig);

  if (!parsed.success || !parsed.data.competitorAnalysis?.length) {
    return "Local incumbent operators and digital-first challengers are competing for the same attention.";
  }

  return parsed.data.competitorAnalysis
    .map((entry) => {
      const competitor = entry.competitor || "Local competitor";
      const pressure = entry.pressure || "Competes for the same demand window.";
      const asymmetricAdvantage =
        entry.asymmetricAdvantage ||
        "Win with stronger execution proof and tighter follow-through.";

      return `${competitor}: ${pressure} Advantage: ${asymmetricAdvantage}`;
    })
    .join(" | ");
}

function getHoursSinceShatter(shatteredAt: Date | null): number | null {
  if (!shatteredAt) {
    return null;
  }

  return Math.max(1, Math.round((Date.now() - shatteredAt.getTime()) / 3_600_000));
}

function buildFallbackFollowUps(input: {
  recipientName: string;
  organizationName: string;
  industry: string;
  landingUrl: string;
  sessionId: string;
  spark: string;
  hoursSinceShatter: number | null;
}): FollowUpVariation[] {
  const greeting = `Hello ${input.recipientName},`;
  const timeSignal = input.hoursSinceShatter
    ? `You engaged with the strategy ${input.hoursSinceShatter} hour${input.hoursSinceShatter === 1 ? "" : "s"} ago.`
    : "You recently opened the strategy reveal.";

  const variations: FollowUpVariation[] = [
    {
      label: "Tactical / Direct",
      tone: "tactical",
      message: [
        greeting,
        `${timeSignal} The immediate move is to decide whether ${input.spark.toLowerCase()}`,
        `Review the strategy here: ${input.landingUrl}`,
        `If useful, I can outline the fastest deployment path for Strategy ID ${input.sessionId}.`,
      ].join("\n\n"),
    },
    {
      label: "Insight-Driven",
      tone: "insight",
      message: [
        greeting,
        `${input.organizationName} sits in a ${input.industry.toLowerCase()} market where response speed and trust signals shape who captures the next buyer first.`,
        `That is the core leverage behind this reveal: ${input.spark}`,
        `You can review it again here: ${input.landingUrl}`,
      ].join("\n\n"),
    },
    {
      label: "Urgent Window",
      tone: "urgent",
      message: [
        greeting,
        "The current Vantage window is strongest while the reveal is still fresh and the operational gaps are visible.",
        `If you want to move on ${input.organizationName}, here is the strategy link again: ${input.landingUrl}`,
        `I can help you lock the first execution step before momentum cools.`,
      ].join("\n\n"),
    },
  ];

  return variations.map((variation) => ({
    ...variation,
    message: normaliseTwilioBody(variation.message),
  }));
}

export async function buildFollowUpDrafts(leadId: string): Promise<FollowUpVariation[]> {
  const id = leadIdSchema.parse(leadId);

  let lead: {
    businessId: string | null;
    id: string;
    name: string | null;
  } | null = null;

  try {
    lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        businessId: true,
      },
    });
  } catch {
    throw new Error("Unable to load the lead for ghost-writing.");
  }

  if (!lead?.businessId) {
    throw new Error("Lead is missing a linked strategy session.");
  }

  let session: {
    generatedConfig: unknown;
    id: string;
    industry: string;
    location: string;
    organizationName: string;
    shatteredAt: Date | null;
  } | null = null;

  try {
    session = await prisma.demoSession.findUnique({
      where: { id: lead.businessId },
      select: {
        id: true,
        organizationName: true,
        industry: true,
        location: true,
        shatteredAt: true,
        generatedConfig: true,
      },
    });
  } catch {
    throw new Error("Unable to load the linked strategy session.");
  }

  if (!session) {
    throw new Error("Linked strategy session was not found.");
  }

  const recipientName = lead.name?.trim() || "there";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://shadowspark-tech.org";
  const landingUrl = new URL(`/land/${session.id}`, appUrl).toString();
  const assessment = extractAssessment(session.generatedConfig);
  const spark = extractSpark(session.generatedConfig);
  const competitorAnalysis = extractCompetitorAnalysis(session.generatedConfig);
  const hoursSinceShatter = getHoursSinceShatter(session.shatteredAt);

  const prompt = [
    "Draft 3 WhatsApp hooks for a lead who engaged with a ShadowSpark strategy reveal.",
    `Recipient name: ${recipientName}`,
    `Organization: ${session.organizationName}`,
    `Industry: ${session.industry}`,
    `Location: ${session.location}`,
    `Strategy ID: ${session.id}`,
    `Landing URL: ${landingUrl}`,
    `Strategy JSON: ${JSON.stringify(session.generatedConfig)}`,
    `Strategic assessment: ${assessment}`,
    `Spark directive: ${spark}`,
    `Competitor analysis: ${competitorAnalysis}`,
    `Hours since shatter: ${hoursSinceShatter ?? "unknown"}`,
    "",
    "Return JSON only in this shape:",
    '{ "variations": [{ "label": string, "tone": "tactical" | "insight" | "urgent", "message": string }] }',
    "Constraints:",
    "- exactly 3 variations",
    '- tones must be tactical, insight, urgent',
    "- each message must be WhatsApp-ready and 55-110 words",
    "- plain text only, no markdown, no bullets, no emojis",
    "- use at most two short paragraphs",
    "- tactical: direct and execution-focused",
    "- insight: mention the specific industry context",
    "- urgent: reference a limited Vantage window without sounding desperate",
    "- if exact competitors are uncertain, stay at the industry/location level",
    "- no markdown code fences",
    "- each message must be safe for direct Twilio API body payloads",
  ].join("\n");

  try {
    const precheck = securePrecheck(prompt, { profile: "follow_up_writer" });
    logSecurityEvent(
      createSecurityLogEntry({
        stage: "precheck",
        text: prompt,
        decision: precheck.decision,
        categories: precheck.categories,
        reasons: precheck.reasons,
        normalizedVariants: precheck.normalizedVariants,
        requiresConfirmation: precheck.requiresConfirmation,
        route: "follow_up_generation",
        model: "gemini-3-flash-preview",
      }),
    );

    if (precheck.decision !== "allow") {
      throw new Error("Follow-up prompt blocked by security policy.");
    }

    const rawText = (
      await generateGeminiText({
        prompt: [
          "Task profile: Shadowweaver Ghost-Writer for premium B2B WhatsApp follow-up.",
          "Draft concise, credible messages and never invent facts.",
          "Use only the provided business context.",
          "Return only valid JSON.",
          "",
          prompt,
        ].join("\n"),
      })
    )
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const postcheck = securePostcheck(rawText);
    if (!postcheck.allowed) {
      logSecurityEvent(
        createSecurityLogEntry({
          stage: "postcheck",
          text: rawText,
          decision: "block",
          categories: inferOutputRiskCategories(rawText),
          reasons: postcheck.reasons,
          route: "follow_up_generation",
          model: "gemini-3-flash-preview",
        }),
      );
      throw new Error("Follow-up output blocked by security policy.");
    }

    const parsed = followUpDraftSchema.parse(JSON.parse(rawText));
    return parsed.variations
      .map((variation) => ({
        ...variation,
        message: normaliseTwilioBody(variation.message),
      }))
      .sort((left, right) => left.tone.localeCompare(right.tone));
  } catch {
    return buildFallbackFollowUps({
      recipientName,
      organizationName: session.organizationName,
      industry: session.industry,
      landingUrl,
      sessionId: session.id,
      spark,
      hoursSinceShatter,
    });
  }
}
