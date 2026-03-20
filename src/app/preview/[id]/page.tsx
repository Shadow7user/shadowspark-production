import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import TypingProposedSolution from "./TypingProposedSolution";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    id: string;
  };
};

function asObject(value: Prisma.JsonValue | null | undefined): Record<string, Prisma.JsonValue> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, Prisma.JsonValue>;
  }
  return null;
}

function asString(value: Prisma.JsonValue | null | undefined): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function formatJsonValue(value: Prisma.JsonValue | null | undefined): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function formatServices(value: Prisma.JsonValue | null | undefined, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
    if (items.length > 0) return items.join(", ");
  }
  return fallback;
}

const BG_OBSIDIAN = "#0A0A0C";
const SOFT_WHITE = "#E0E0E0";
const ACCENT_CYAN = "#00F2FF";
const ACCENT_PURPLE = "#BD00FF";

function DataFlowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-70 blur-[0.5px]">
        <svg
          viewBox="0 0 1200 720"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0.0" />
              <stop offset="35%" stopColor={ACCENT_CYAN} stopOpacity="0.55" />
              <stop offset="65%" stopColor={ACCENT_PURPLE} stopOpacity="0.55" />
              <stop offset="100%" stopColor={ACCENT_PURPLE} stopOpacity="0.0" />
            </linearGradient>
            <filter id="flow-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M-120,520 C120,420 220,630 420,520 C610,414 680,520 840,440 C1010,350 1080,520 1320,420"
            fill="none"
            stroke="url(#flow-gradient)"
            strokeWidth="2"
            filter="url(#flow-glow)"
            className="preview-flow"
          />
          <path
            d="M-120,260 C140,140 260,360 460,240 C650,128 700,330 900,210 C1040,130 1140,300 1320,160"
            fill="none"
            stroke="url(#flow-gradient)"
            strokeWidth="1.5"
            filter="url(#flow-glow)"
            className="preview-flow preview-flow--slow"
          />
        </svg>
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(800px 420px at 12% 12%, rgba(0, 242, 255, 0.12), transparent 60%), radial-gradient(720px 380px at 88% 18%, rgba(189, 0, 255, 0.12), transparent 55%)",
        }}
      />

      <style>{`
        @keyframes preview-flow {
          0% { stroke-dashoffset: 0; opacity: 0.35; }
          45% { opacity: 0.9; }
          100% { stroke-dashoffset: -900; opacity: 0.35; }
        }
        .preview-flow {
          stroke-dasharray: 12 16;
          animation: preview-flow 6s linear infinite;
        }
        .preview-flow--slow {
          stroke-dasharray: 10 22;
          animation-duration: 9.5s;
          opacity: 0.45;
        }
        @media (prefers-reduced-motion: reduce) {
          .preview-flow, .preview-flow--slow { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default async function PreviewPage({ params }: PageProps) {
  const id = params.id;

  const session = await prisma.demoSession.findUnique({
    where: { id },
    select: {
      id: true,
      orgName: true,
      industry: true,
      services: true,
      intent: true,
      challenge: true,
      location: true,
      website: true,
      generatedConfig: true,
      status: true,
      createdAt: true,
    },
  });

  if (!session) notFound();

  const configObj = asObject(session.generatedConfig);

  const organization =
    asString(configObj?.organization) ??
    asString(configObj?.orgName) ??
    asString(configObj?.organizationName) ??
    session.orgName;

  const services = formatServices(configObj?.services, session.services);

  const proposedSolutionValue = configObj?.proposed_solution ?? configObj?.proposedSolution ?? null;

  const proposedSolutionText =
    formatJsonValue(proposedSolutionValue) ||
    "No `proposed_solution` found in generated config. Claim the setup and we will finalize the deployment plan.";

  const claimHref = `/demo/claim?sessionId=${encodeURIComponent(
    session.id,
  )}&organizationName=${encodeURIComponent(session.orgName)}`;

  return (
    <main
      className="min-h-screen px-6 py-14"
      style={{
        backgroundColor: BG_OBSIDIAN,
        color: SOFT_WHITE,
        backgroundImage:
          "radial-gradient(900px 520px at 18% 10%, rgba(0, 242, 255, 0.10), transparent 60%), radial-gradient(820px 480px at 85% 18%, rgba(189, 0, 255, 0.10), transparent 55%), radial-gradient(760px 460px at 60% 90%, rgba(0, 242, 255, 0.06), transparent 60%)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT_CYAN }}>
                Glass Preview Dashboard
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {organization}
              </h1>
              <p className="mt-3 text-sm text-[#E0E0E0]/70">
                Industry: <span className="text-[#E0E0E0]/90">{session.industry}</span>{" "}
                <span className="text-[#E0E0E0]/35">·</span>{" "}
                Status:{" "}
                <span
                  className="font-semibold"
                  style={{ color: session.status === "COMPLETED" ? ACCENT_CYAN : ACCENT_PURPLE }}
                >
                  {session.status}
                </span>
              </p>
            </div>

            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"
              style={{
                borderColor: "rgba(0, 242, 255, 0.30)",
                background: "rgba(255, 255, 255, 0.03)",
                boxShadow: "0 18px 60px rgba(0,0,0,0.65)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT_CYAN }} />
              Privacy-First AI: Your Business Data Stays Yours.
            </span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div
              className="rounded-3xl border bg-white/[0.04] p-6 backdrop-blur-md"
              style={{
                borderColor: "rgba(224, 224, 224, 0.12)",
                boxShadow:
                  "0 26px 80px rgba(0,0,0,0.70), 0 0 0 1px rgba(0,242,255,0.10)",
              }}
            >
              <h2 className="text-sm font-semibold" style={{ color: ACCENT_CYAN }}>
                Snapshot
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.22em] text-[#E0E0E0]/50">Services</dt>
                  <dd className="mt-1 text-[#E0E0E0]/80">{services || "Not provided."}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.22em] text-[#E0E0E0]/50">Goal / Challenge</dt>
                  <dd className="mt-1 text-[#E0E0E0]/75">{session.intent || session.challenge || "Not provided."}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.22em] text-[#E0E0E0]/50">Location</dt>
                  <dd className="mt-1 text-[#E0E0E0]/75">{session.location ?? "Not provided."}</dd>
                </div>
              </dl>

              <div className="mt-7 border-t border-white/10 pt-6">
                <Link
                  href={claimHref}
                  className="inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-extrabold tracking-[0.14em] transition hover:opacity-95"
                  style={{
                    color: BG_OBSIDIAN,
                    backgroundColor: ACCENT_CYAN,
                    boxShadow:
                      "0 24px 70px rgba(0,0,0,0.65), 0 0 0 1px rgba(0, 242, 255, 0.28), 0 0 40px rgba(0, 242, 255, 0.16)",
                  }}
                >
                  CLAIM YOUR SETUP ON WHATSAPP
                </Link>
                <p className="mt-3 text-center text-xs text-[#E0E0E0]/55">
                  We deploy the website, chatbot, and automations for you.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div
              className="relative overflow-hidden rounded-3xl border bg-white/[0.04] backdrop-blur-md"
              style={{
                borderColor: "rgba(0, 242, 255, 0.22)",
                boxShadow:
                  "0 30px 90px rgba(0,0,0,0.72), 0 0 0 1px rgba(0,242,255,0.10)",
              }}
            >
              <DataFlowBackdrop />
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold" style={{ color: ACCENT_CYAN }}>
                      Proposed Solution
                    </h2>
                    <p className="mt-2 text-xs text-[#E0E0E0]/55">
                      Live-rendered to feel like the AI is thinking in real time.
                    </p>
                  </div>
                  <span className="text-xs text-[#E0E0E0]/45">
                    Session ID: <span className="text-[#E0E0E0]/70">{session.id}</span>
                  </span>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0A0A0C]/70 p-5">
                  <TypingProposedSolution key={session.id} text={proposedSolutionText} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
