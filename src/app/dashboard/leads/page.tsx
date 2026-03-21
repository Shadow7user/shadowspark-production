import type { ReactElement } from "react";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import LeadDashboard, {
  type ActivityFeedItem,
  type DashboardDemoSession,
  type DashboardLead,
} from "@/components/dashboard/LeadDashboard";
import { parseLeadMetadata } from "@/lib/leads/metadata";
import { getMarketingMessagesOnboardingStatus } from "@/lib/meta";
import { logger } from "@/lib/observability";
import { prisma } from "@/lib/prisma";
import { isTwilioConfigured } from "@/lib/twilio";

const generatedConfigSchema = z.object({
  assessment: z.string().trim().min(1).optional(),
  spark: z.string().trim().min(1).optional(),
  proposed_solution: z.string().trim().min(1).optional(),
});

function extractAssessment(generatedConfig: unknown): string {
  const parsed = generatedConfigSchema.safeParse(generatedConfig);

  if (!parsed.success) {
    return "No strategic assessment is available for this session yet.";
  }

  if (parsed.data.assessment) {
    return parsed.data.assessment;
  }

  if (parsed.data.proposed_solution) {
    const match = parsed.data.proposed_solution.match(
      /(?:^|\n)###\s+Strategic Assessment\s*\n([\s\S]*?)(?=\n###\s+|$)/i,
    );

    if (match?.[1]?.trim()) {
      return match[1].trim();
    }

    return parsed.data.proposed_solution;
  }

  return "No strategic assessment is available for this session yet.";
}

function extractSpark(generatedConfig: unknown): string {
  const parsed = generatedConfigSchema.safeParse(generatedConfig);

  if (!parsed.success) {
    return "Awaiting a sharper execution directive.";
  }

  if (parsed.data.spark) {
    return parsed.data.spark;
  }

  return "Awaiting a sharper execution directive.";
}

function isFintechIndustry(industry: string): boolean {
  const normalized = industry.toLowerCase();
  return normalized.includes("fintech") || normalized.includes("bank");
}

function calculateHeatScore(input: {
  status: string;
  website: string;
  industry: string;
}): number {
  return (
    (input.status === "ENGAGED" ? 100 : 0) +
    (input.website.trim().length > 0 ? 20 : 0) +
    (isFintechIndustry(input.industry) ? 30 : 0)
  );
}

async function LeadsPageContent(): Promise<ReactElement> {
  await connection();
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/overview");
  }

  if (!process.env.ADMIN_SECRET?.trim()) {
    return (
      <div className="min-h-screen bg-[#050508] p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.18)] backdrop-blur-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.38em] text-white/42">
            Admin Guard
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-white">
            Configure `ADMIN_SECRET` to unlock Lead Pulse.
          </h1>
          <p className="mt-5 text-base leading-7 text-white/62">
            This dashboard is intentionally disabled until the environment-level
            admin secret is present. Add `ADMIN_SECRET` to the deployment
            environment, then reload this page.
          </p>
        </div>
      </div>
    );
  }

  let leads: Awaited<ReturnType<typeof prisma.lead.findMany>> = [];
  let demoSessions: Awaited<ReturnType<typeof prisma.demoSession.findMany>> = [];
  const marketingMessages = await getMarketingMessagesOnboardingStatus();

  try {
    [leads, demoSessions] = await Promise.all([
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.demoSession.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);
  } catch (error) {
    logger.error("dashboard.leads_query_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });

    return (
      <div className="min-h-screen bg-[#050508] p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-8 shadow-[0_0_50px_-12px_rgba(244,63,94,0.2)] backdrop-blur-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.38em] text-rose-100/60">
            Lead Pulse Offline
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-white">
            The dashboard could not load the latest lead intelligence.
          </h1>
          <p className="mt-5 text-base leading-7 text-white/68">
            A data-layer request failed while loading Prisma records. Retry the
            dashboard once the connection settles.
          </p>
        </div>
      </div>
    );
  }

  const twilioReady = isTwilioConfigured();

  const dashboardLeads: DashboardLead[] = leads.map((lead) => {
    const metadata = parseLeadMetadata(lead.metadata);

    return {
      id: lead.id,
      deliveryId:
        metadata.deliveryId ??
        metadata.marketingMessageId ??
        metadata.metaMessageId ??
        metadata.twilioMessageSid ??
        null,
      deliveryProvider:
        metadata.deliveryProvider ??
        (metadata.marketingMessageId || metadata.metaMessageId
          ? "meta"
          : metadata.twilioMessageSid
            ? "twilio"
            : null),
      deliveryStatus:
        metadata.deliveryStatus ??
        metadata.marketingMessageStatus ??
        metadata.metaMessageStatus ??
        metadata.twilioMessageStatus ??
        null,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      createdAtLabel: lead.createdAt.toISOString(),
      twilioReady,
      twilioMessageSid: metadata.twilioMessageSid ?? null,
      twilioMessageStatus: metadata.twilioMessageStatus ?? null,
    };
  });

  const primaryLeadBySessionId = new Map<
    string,
    {
      id: string;
      name: string | null;
      phone: string | null;
    }
  >();

  for (const lead of leads) {
    if (!lead.businessId || primaryLeadBySessionId.has(lead.businessId)) {
      continue;
    }

    primaryLeadBySessionId.set(lead.businessId, {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
    });
  }

  const dashboardDemoSessions: DashboardDemoSession[] = demoSessions
    .map((demoSession) => {
      const primaryLead = primaryLeadBySessionId.get(demoSession.id);

      return {
        id: demoSession.id,
        organizationName: demoSession.organizationName,
        industry: demoSession.industry,
        intent: demoSession.intent,
        status: demoSession.status,
        createdAtLabel: demoSession.createdAt.toISOString(),
        viewedAtLabel: demoSession.viewedAt?.toISOString() ?? null,
        shatteredAtLabel: demoSession.shatteredAt?.toISOString() ?? null,
        assessment: extractAssessment(demoSession.generatedConfig),
        spark: extractSpark(demoSession.generatedConfig),
        whatsapp: demoSession.whatsapp,
        location: demoSession.location,
        website: demoSession.website,
        previewHref: `/preview/${demoSession.id}`,
        landHref: `/land/${demoSession.id}`,
        viewAsLeadHref: `/land/${demoSession.id}?readOnly=1`,
        linkedLeadId: primaryLead?.id ?? null,
        linkedLeadName: primaryLead?.name ?? null,
        linkedLeadPhone: primaryLead?.phone ?? null,
        heatScore: calculateHeatScore({
          status: demoSession.status,
          website: demoSession.website,
          industry: demoSession.industry,
        }),
      };
    })
    .sort((left, right) => {
      if (right.heatScore !== left.heatScore) {
        return right.heatScore - left.heatScore;
      }

      return (
        new Date(right.createdAtLabel).getTime() -
        new Date(left.createdAtLabel).getTime()
      );
    });

  const activityFeed: ActivityFeedItem[] = [
    ...leads.map((lead) => {
      const metadata = parseLeadMetadata(lead.metadata);
      const locationLabel = metadata.location ?? "the reveal flow";
      const organizationLabel =
        metadata.organizationName ?? lead.name ?? "unnamed account";

      return {
        id: `lead-${lead.id}`,
        timestampLabel: lead.createdAt.toISOString(),
        tone: "lead" as const,
        message: `New lead from ${locationLabel} for ${organizationLabel}`,
      };
    }),
    ...demoSessions.map((demoSession) => ({
      id: `generated-${demoSession.id}`,
      timestampLabel: demoSession.createdAt.toISOString(),
      tone: "generated" as const,
      message: `Strategy generated for ${demoSession.organizationName}`,
    })),
    ...demoSessions
      .filter((demoSession) => Boolean(demoSession.viewedAt))
      .map((demoSession) => ({
        id: `viewed-${demoSession.id}`,
        timestampLabel: demoSession.viewedAt?.toISOString() ?? demoSession.createdAt.toISOString(),
        tone: "viewed" as const,
        message: `Reveal viewed by ${demoSession.organizationName}`,
      })),
    ...demoSessions
      .filter((demoSession) => Boolean(demoSession.shatteredAt))
      .map((demoSession) => ({
        id: `engaged-${demoSession.id}`,
        timestampLabel:
          demoSession.shatteredAt?.toISOString() ?? demoSession.createdAt.toISOString(),
        tone: "engaged" as const,
        message: `Strategy shattered by ${demoSession.organizationName}`,
      })),
  ]
    .sort(
      (left, right) =>
        new Date(right.timestampLabel).getTime() -
        new Date(left.timestampLabel).getTime(),
    )
    .slice(0, 10);

  const totalStrategies = dashboardDemoSessions.length;
  const viewedStrategies = dashboardDemoSessions.filter(
    (demoSession) =>
      Boolean(demoSession.viewedAtLabel) ||
      Boolean(demoSession.shatteredAtLabel) ||
      demoSession.status === "ENGAGED" ||
      demoSession.status === "claimed",
  ).length;
  const conversionRate =
    totalStrategies > 0
      ? Math.round((viewedStrategies / totalStrategies) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#050508] p-4 sm:p-6 lg:p-8">
      <LeadDashboard
        activityFeed={activityFeed}
        totalStrategies={totalStrategies}
        viewedStrategies={viewedStrategies}
        conversionRate={conversionRate}
        demoSessions={dashboardDemoSessions}
        leads={dashboardLeads}
        marketingMessagesEnabled={marketingMessages.enabled}
        marketingMessagesOnboardingStatus={marketingMessages.status}
      />
    </div>
  );
}

export default function LeadsPage(): ReactElement {
  return (
    <Suspense fallback={null}>
      <LeadsPageContent />
    </Suspense>
  );
}
