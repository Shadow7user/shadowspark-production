
import { Suspense } from "react";
import { connection } from "next/server";

export default function OperatorDashboard() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <OperatorDashboardContent  />
    </Suspense>
  );
}
import { prisma } from "@/lib/prisma";
import { parseLeadMetadata } from "@/lib/leads/metadata";
import { LeadListClient } from "./LeadListClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operator Dashboard | ShadowSpark",
};



async function OperatorDashboardContent() {
  await connection();
  const leads = await prisma.lead.findMany({
    where: {
      intent: { notIn: ["junk", "unknown"] },
      status: { notIn: ["LOST"] },
    },
    take: 100,
  });

  const parsedLeads = leads.map(lead => ({
    ...lead,
    metadataParsed: parseLeadMetadata(lead.metadata)
  }));

  const sortedLeads = parsedLeads.sort((a, b) => {
    // 1. Escalated (QUALIFIED) vs not
    if (a.status === "QUALIFIED" && b.status !== "QUALIFIED") return -1;
    if (b.status === "QUALIFIED" && a.status !== "QUALIFIED") return 1;
    // 2. Score
    const scoreA = a.leadScore ?? 0;
    const scoreB = b.leadScore ?? 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    // 3. Date
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Operator Dashboard</h1>
      <LeadListClient leads={sortedLeads} />
    </div>
  );
}
