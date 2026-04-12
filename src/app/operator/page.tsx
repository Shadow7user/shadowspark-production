export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatsRow from "./StatsRow";
import OperatorLeadTable, { type OperatorLead } from "./OperatorLeadTable";

function normalizeStatus(lead: {
  status: string;
  paymentRef: string | null;
  demoApproved: boolean;
  demo: { approved: boolean; slug: string } | null;
}) {
  if (lead.status === "REJECTED") return "Rejected" as const;
  if (lead.demo?.approved || lead.demoApproved) return "Approved" as const;
  if (lead.demo) return "Demo Generated" as const;
  if (lead.status === "PAID" || lead.paymentRef) return "Paid" as const;
  return "New" as const;
}

export default async function OperatorDashboard() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const [leads, recentDemos] = await Promise.all([
    prisma.lead.findMany({
      include: { demo: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.demo.findMany({
      include: { lead: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const tableData: OperatorLead[] = leads.map((lead) => {
    const audit = (lead.miniAuditData ?? {}) as Record<string, unknown>;
    const name =
      typeof audit.companyName === "string" && audit.companyName
        ? audit.companyName
        : lead.phoneNumber;
    const business =
      typeof audit.businessType === "string" && audit.businessType
        ? audit.businessType
        : lead.intent ?? "Uncategorized";

    return {
      id: lead.id,
      name,
      business,
      status: normalizeStatus(lead),
      demoSlug: lead.demo?.slug ?? null,
    };
  });

  const recentActivity = recentDemos.map((demo) => ({
    id: demo.id,
    label: `${demo.approved ? "Approved" : "Pending"} demo for ${demo.lead.phoneNumber}`,
    timestamp: demo.updatedAt.toLocaleString(),
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <nav className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center">
              <span className="text-black font-black text-xl">S</span>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">Operator Command Center</p>
              <h1 className="text-xl font-bold tracking-tighter uppercase">ShadowSpark Control Plane</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-2 text-xs font-mono uppercase tracking-[0.16em] text-green-300 md:inline-flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              System Health
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Live Site</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6 lg:p-10">
        <StatsRow />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/80 p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">Lead Operations</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Pipeline command grid</h2>
                </div>
              </div>
              <OperatorLeadTable data={tableData} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">Quick Actions</p>
              <div className="mt-5 space-y-3">
                <Link href="/" className="block rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-zinc-200 transition hover:border-cyan-400/40 hover:text-cyan-300">
                  View Demo Surface
                </Link>
                <Link href="/operator" className="block rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-zinc-200 transition hover:border-cyan-400/40 hover:text-cyan-300">
                  Review Pending Leads
                </Link>
                <Link href="/dashboard" className="block rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-zinc-200 transition hover:border-cyan-400/40 hover:text-cyan-300">
                  Open Main Dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/80 p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">Recent Activity</p>
                <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-green-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  Healthy
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {recentActivity.length ? recentActivity.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-zinc-500">{item.timestamp}</p>
                  </div>
                )) : (
                  <p className="text-sm text-zinc-500">No recent activity recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
