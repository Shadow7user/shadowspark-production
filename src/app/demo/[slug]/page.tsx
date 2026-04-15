import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import AssistantBubble from "@/components/ui/AssistantBubble";
import { Spotlight } from "@/components/ui/Spotlight";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Vortex } from "@/components/ui/vortex-background";
import { fetchLatestAuditMarkdown, fetchVaultInsights } from "@/lib/gcs/fetch-audit";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function pickFirstString(
  source: Record<string, unknown> | null,
  keys: string[],
  fallback: string
) {
  if (!source) return fallback;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return fallback;
}

function normalizeTier(tier: string): "launch" | "growth" | "automation" {
  const normalized = tier.toLowerCase();
  if (normalized.includes("auto")) return "automation";
  if (normalized.includes("growth")) return "growth";
  return "launch";
}

function displayTier(tier: "launch" | "growth" | "automation") {
  if (tier === "automation") return "Autonomous";
  if (tier === "growth") return "Growth";
  return "Launch";
}

function prettifySlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getRecommendation(
  config: Record<string, unknown> | null,
  audit: Record<string, unknown> | null
) {
  return normalizeTier(
    pickFirstString(
      config ?? audit,
      ["packageRecommendation", "recommendedPackage", "tier", "plan"],
      "automation"
    )
  );
}

function MarkdownShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.84)_0%,rgba(2,6,23,0.92)_100%)] shadow-[0_0_50px_rgba(14,165,233,0.1)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300/70" />
        <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
          Intelligence Stream
        </span>
      </div>
      <div className="px-6 py-8 sm:px-8 sm:py-10">{children}</div>
    </div>
  );
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 border-t border-white/10 pt-10 text-2xl font-black tracking-tight text-cyan-100 sm:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-bold tracking-tight text-white">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 text-base leading-8 text-slate-300 sm:text-[1.05rem]">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-r-2xl border-l-2 border-cyan-300/50 bg-cyan-300/[0.06] px-5 py-4 text-sm leading-7 text-cyan-50">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="mt-5 space-y-3 text-slate-300">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 list-decimal space-y-3 pl-6 text-slate-300">{children}</ol>,
  li: ({ children }) => <li className="ml-5 list-disc pl-2 leading-7 marker:text-cyan-300">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-cyan-300 underline decoration-cyan-300/40 underline-offset-4"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  code: ({
    inline,
    children,
    className,
  }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
    if (inline) {
      return (
        <code className="rounded-md border border-white/10 bg-slate-900/80 px-1.5 py-1 font-mono text-[0.9em] text-cyan-200">
          {children}
        </code>
      );
    }

    return (
      <code
        className={[
          "block overflow-x-auto rounded-[1.4rem] border border-slate-700/60 bg-[#161b22] px-5 py-4 font-mono text-sm leading-7 text-slate-100",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_60px_rgba(2,6,23,0.35)]",
          className ?? "",
        ].join(" ")}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mt-6 overflow-x-auto">{children}</pre>,
};

export default async function DemoPreviewPage({ params }: DemoPageProps) {
  const { slug } = await params;

  const demo = await prisma.demo.findUnique({
    where: { slug },
    include: { lead: true },
  });

  const miniAuditData = asRecord(demo?.lead.miniAuditData);
  const config = asRecord(demo?.config);
  const recommendedTier = getRecommendation(config, miniAuditData);
  const businessName = pickFirstString(
    miniAuditData,
    ["companyName", "businessName", "name", "businessType"],
    prettifySlug(slug) || "ShadowSpark Prospect"
  );
  const niche = pickFirstString(
    miniAuditData,
    ["niche", "businessType", "goals"],
    "Revenue intelligence and conversion infrastructure"
  );
  const createdAt = demo?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(demo.createdAt)
    : "Awaiting first live session";
  const [auditMarkdown, indexedInsights] = await Promise.all([
    fetchLatestAuditMarkdown(slug),
    fetchVaultInsights({
      slug,
      businessName,
      niche,
      k: 4,
    }),
  ]);

  return (
    <Vortex className="min-h-screen selection:bg-cyan-500/30">
      <main className="relative mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <Spotlight
          className="-top-36 left-0 md:left-60 md:-top-20"
          fill="rgba(34,211,238,0.16)"
        />

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 px-6 py-8 shadow-[0_0_80px_rgba(14,165,233,0.08)] backdrop-blur-xl sm:px-8 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.26em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
                Live GCS Intelligence Feed
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                {businessName}
                <span className="mt-3 block text-balance text-cyan-200/85">
                  Revenue audit rendered from the latest cloud markdown snapshot.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                The crawl worker writes markdown into the Genesis vault. This page reads the most
                recent report for <span className="text-white">{slug}</span> and streams it into a
                guided intelligence surface instead of a flat file dump.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: "Recommended Tier", value: displayTier(recommendedTier) },
                { label: "Active Niche", value: niche },
                { label: "Latest Session", value: createdAt },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold leading-7 text-white">{item.value}</p>
                </div>
              ))}
              <Link
                href={`/checkout/new?tier=${encodeURIComponent(recommendedTier)}`}
                className="inline-flex items-center justify-center rounded-[1.5rem] bg-cyan-300 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
              >
                Deploy Recommended Stack
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <TracingBeam className="lg:pr-8">
            <MarkdownShell>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {auditMarkdown}
              </ReactMarkdown>
            </MarkdownShell>
          </TracingBeam>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_0_50px_rgba(15,23,42,0.4)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                Beam Interpretation
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                Guided through infrastructure, leaks, and AI proposals.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                The beam emphasizes the sequence of the audit so the client reads it as an
                escalation path: what is broken, what it costs, and what ShadowSpark deploys next.
              </p>
            </div>

            <div className="rounded-[2rem] border border-cyan-300/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(8,145,178,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                    Indexed Signals
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                    Vault-ranked excerpts for this demo.
                  </h2>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                  {indexedInsights.length > 0 ? `${indexedInsights.length} hits` : "awaiting index"}
                </div>
              </div>

              {indexedInsights.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {indexedInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-white">{insight.title}</p>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">
                          score {insight.score}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{insight.excerpt}</p>
                      {insight.url ? (
                        <a
                          href={insight.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-xs font-medium uppercase tracking-[0.16em] text-cyan-300"
                        >
                          Source URL
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm leading-7 text-slate-300">
                  The demo page is ready to read `indexes/latest.json` from the vault as soon as the
                  crawl pipeline publishes one. Until then, the markdown stream remains the source of truth.
                </p>
              )}
            </div>

            <div className="rounded-[2rem] border border-cyan-300/10 bg-cyan-300/[0.05] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                GCS Bridge
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                <li className="list-inside list-disc marker:text-cyan-300">
                  Reads from <code>shadowspark-genesis-backups-2026</code> by slug-aware prefix.
                </li>
                <li className="list-inside list-disc marker:text-cyan-300">
                  Falls back to a structured markdown shell if a fresh audit has not landed yet.
                </li>
                <li className="list-inside list-disc marker:text-cyan-300">
                  Keeps the assistant bubble available for live follow-up questions while reviewing.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <AssistantBubble />
    </Vortex>
  );
}
