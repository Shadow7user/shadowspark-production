import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeLeadWithGemini } from "@/lib/ai/gemini";
import {
  buildErrorResponse,
  classifyError,
  logger,
} from "@/lib/observability";
import {
  createSecurityLogEntry,
  inferOutputRiskCategories,
  logSecurityEvent,
  securePostcheck,
  securePrecheck,
} from "@/lib/security";

const analyzeLeadSchema = z.object({
  leadName: z.string().trim().min(1).max(120),
  source: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(4_000).optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = analyzeLeadSchema.parse(await req.json());
    const { leadName, source, notes } = parsed;

    const prompt = `System: ShadowSpark Sales Intelligence.
    Lead: ${leadName} from ${source}.
    Context: ${notes || "No notes yet."}
    Task: Rank this lead 1-10 on 'Close Probability' for a NGN 150k Chatbot.
    Provide a killer opening line for the ShadowSpark team to send on WhatsApp.`;

    const precheck = securePrecheck(prompt, { profile: "lead_analysis" });
    logSecurityEvent(
      createSecurityLogEntry({
        stage: "precheck",
        text: prompt,
        decision: precheck.decision,
        categories: precheck.categories,
        reasons: precheck.reasons,
        normalizedVariants: precheck.normalizedVariants,
        requiresConfirmation: precheck.requiresConfirmation,
        route: "/api/ai/analyze-lead",
        model: "gemini-2.0-flash",
      }),
    );

    if (precheck.decision !== "allow" && precheck.safeReply) {
      return NextResponse.json({ analysis: precheck.safeReply });
    }

    const analysis = await analyzeLeadWithGemini(prompt);
    const postcheck = securePostcheck(analysis);
    if (!postcheck.allowed) {
      logSecurityEvent(
        createSecurityLogEntry({
          stage: "postcheck",
          text: analysis,
          decision: "block",
          categories: inferOutputRiskCategories(analysis),
          reasons: postcheck.reasons,
          route: "/api/ai/analyze-lead",
          model: "gemini-2.0-flash",
        }),
      );
      return NextResponse.json({ analysis: postcheck.safeReply });
    }

    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    const classified = classifyError(error);
    logger.classifiedError("ai.analyze_lead_failed", {
      type: classified.type,
      severity: classified.severity,
      error,
    });
    return NextResponse.json(buildErrorResponse(classified), { status: classified.httpStatus });
  }
}
