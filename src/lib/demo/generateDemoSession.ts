import { z } from "zod";
import { generateGeminiText } from "@/lib/ai/gemini";
import {
  createSecurityLogEntry,
  inferOutputRiskCategories,
  logSecurityEvent,
  securePostcheck,
  securePrecheck,
} from "@/lib/security";
import { prisma } from "@/lib/prisma";

export const generateDemoRequestSchema = z.object({
  organizationName: z.string().trim().min(1).max(120),
  industry: z.string().trim().min(1).max(120),
  whatsapp: z.string().trim().min(1).max(40),
  intent: z.string().trim().min(8).max(2000),
  location: z.string().trim().min(1).max(120),
  website: z
    .string()
    .trim()
    .max(240)
    .optional()
    .transform((value) => value ?? ""),
});

const strategyStepSchema = z.object({
  action: z.string().trim().min(1).max(220),
  outcome: z.string().trim().min(1).max(260),
});

const competitorInsightSchema = z.object({
  competitor: z.string().trim().min(1).max(120),
  pressure: z.string().trim().min(1).max(260),
  asymmetricAdvantage: z.string().trim().min(1).max(260),
});

const modelPayloadSchema = z.object({
  assessment: z.string().trim().min(1).max(1600),
  spark: z.string().trim().min(1).max(600),
  steps: z.array(strategyStepSchema).min(3).max(5),
  competitorAnalysis: z.array(competitorInsightSchema).length(2),
});

export type GenerateDemoInput = z.infer<typeof generateDemoRequestSchema>;
type StrategyStep = z.infer<typeof strategyStepSchema>;
type CompetitorInsight = z.infer<typeof competitorInsightSchema>;
type StrategyPayload = z.infer<typeof modelPayloadSchema> & {
  proposed_solution: string;
};

function buildProposedSolution(payload: {
  assessment: string;
  spark: string;
  steps: StrategyStep[];
  competitorAnalysis: CompetitorInsight[];
}): string {
  const tacticalSteps = payload.steps
    .map((step, index) => `${index + 1}. ${step.action}`)
    .join("\n");
  const competitorSection = payload.competitorAnalysis
    .map(
      (entry, index) =>
        `${index + 1}. ${entry.competitor} — Pressure: ${entry.pressure} Advantage: ${entry.asymmetricAdvantage}`,
    )
    .join("\n");

  return [
    "### Strategic Assessment",
    payload.assessment,
    "",
    "### The Spark Solution",
    payload.spark,
    "",
    "### Tactical Execution",
    tacticalSteps,
    "",
    "### Competitor Analysis",
    competitorSection,
  ].join("\n");
}

function buildFallbackPayload(input: GenerateDemoInput): StrategyPayload {
  const loweredIndustry = input.industry.toLowerCase();
  const websiteLine = input.website
    ? `Current web presence: ${input.website}.`
    : "Current web presence is either absent or not yet trusted as a conversion channel.";
  const steps: StrategyStep[] = [
    {
      action: "Capture every inbound enquiry into one visible demand pipeline.",
      outcome:
        "This removes scattered follow-up and gives leadership immediate visibility over live interest.",
    },
    {
      action: "Qualify urgency and commercial fit before the team spends manual energy.",
      outcome:
        "High-intent opportunities move first while low-signal traffic is filtered without noise.",
    },
    {
      action: "Deploy a WhatsApp-led follow-up sequence tied directly to the stated business intent.",
      outcome:
        "Prospects receive faster, more consistent movement from first contact to decision.",
    },
    {
      action: "Review weekly conversion movement against a tight execution dashboard.",
      outcome:
        "The business gains measurable operating rhythm instead of relying on anecdotal sales feedback.",
    },
  ];

  const assessment = [
    `${input.organizationName} needs a controlled execution system for ${loweredIndustry} demand in ${input.location}.`,
    `Primary intent: ${input.intent}.`,
    websiteLine,
  ].join(" ");

  const spark =
    "Build a compact acquisition-to-conversion engine before adding more volume. Precision first, scale second.";
  const competitorAnalysis: CompetitorInsight[] = [
    {
      competitor: `${input.location} incumbent operator`,
      pressure:
        "Already owns baseline familiarity and can win by staying easy to recognize in the local market.",
      asymmetricAdvantage:
        "Move faster with a sharper WhatsApp-first response layer and a visibly premium conversion experience.",
    },
    {
      competitor: `${input.location} digital-first challenger`,
      pressure:
        "Competes aggressively on convenience and may capture early interest before trust is established.",
      asymmetricAdvantage:
        "Use credibility cues, clearer execution proof, and disciplined follow-up to convert higher-intent buyers.",
    },
  ];

  return {
    assessment,
    spark,
    steps,
    competitorAnalysis,
    proposed_solution: buildProposedSolution({
      assessment,
      spark,
      steps,
      competitorAnalysis,
    }),
  };
}

function stripCodeFence(value: string): string {
  return value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function generateStrategyPayload(
  input: GenerateDemoInput,
): Promise<StrategyPayload> {
  const websiteContext = input.website
    ? `Website: ${input.website}`
    : "Website: not provided";

  const prompt = [
    "Create a ShadowSpark strategic reveal payload for this business.",
    `Organization: ${input.organizationName}`,
    `Industry: ${input.industry}`,
    `Location: ${input.location}`,
    websiteContext,
    `WhatsApp: ${input.whatsapp}`,
    `Intent: ${input.intent}`,
    "",
    "Return JSON only in this shape:",
    '{ "assessment": string, "spark": string, "steps": [{ "action": string, "outcome": string }], "competitorAnalysis": [{ "competitor": string, "pressure": string, "asymmetricAdvantage": string }] }',
    "Constraints:",
    "- assessment: 2-4 sentences",
    "- spark: 1-2 sentences",
    "- steps: 3-5 items",
    "- competitorAnalysis: exactly 2 items",
    "- use local competitors if broadly recognizable; otherwise use location-specific competitor archetypes",
    "- no markdown code fences",
    "- no extra keys",
  ].join("\n");

  try {
    const precheck = securePrecheck(prompt, { profile: "demo_generation" });
    logSecurityEvent(
      createSecurityLogEntry({
        stage: "precheck",
        text: prompt,
        decision: precheck.decision,
        categories: precheck.categories,
        reasons: precheck.reasons,
        normalizedVariants: precheck.normalizedVariants,
        requiresConfirmation: precheck.requiresConfirmation,
        route: "/api/generate-demo",
        model: "gemini-3-flash-preview",
      }),
    );

    if (precheck.decision !== "allow") {
      return buildFallbackPayload(input);
    }

    const rawText = await generateGeminiText({
      prompt: [
        "Task profile: strategic reveal architect for ShadowSpark.",
        "Return only valid JSON with keys assessment, spark, steps, and competitorAnalysis.",
        "Each step must contain action and outcome.",
        "competitorAnalysis must contain exactly two entries with competitor, pressure, and asymmetricAdvantage.",
        "",
        prompt,
      ].join("\n"),
    });

    const postcheck = securePostcheck(rawText);
    if (!postcheck.allowed) {
      logSecurityEvent(
        createSecurityLogEntry({
          stage: "postcheck",
          text: rawText,
          decision: "block",
          categories: inferOutputRiskCategories(rawText),
          reasons: postcheck.reasons,
          route: "/api/generate-demo",
          model: "gemini-3-flash-preview",
        }),
      );
      return buildFallbackPayload(input);
    }

    const parsedCandidate: unknown = JSON.parse(stripCodeFence(rawText));
    const parsed = modelPayloadSchema.safeParse(parsedCandidate);

    if (!parsed.success) {
      return buildFallbackPayload(input);
    }

    return {
      ...parsed.data,
      proposed_solution: buildProposedSolution(parsed.data),
    };
  } catch {
    return buildFallbackPayload(input);
  }
}

export async function createDemoSession(
  rawInput: unknown,
): Promise<{ sessionId: string }> {
  const input = generateDemoRequestSchema.parse(rawInput);
  const payload = await generateStrategyPayload(input);

  const session = await prisma.demoSession.create({
    data: {
      organizationName: input.organizationName,
      industry: input.industry,
      whatsapp: input.whatsapp,
      intent: input.intent,
      location: input.location,
      website: input.website,
      generatedConfig: payload,
      status: "generated",
    },
  });

  return { sessionId: session.id };
}
