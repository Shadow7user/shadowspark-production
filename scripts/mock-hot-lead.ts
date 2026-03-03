#!/usr/bin/env npx ts-node
/**
 * Neural Lead Capture Validation Script
 *
 * Mocks a ₦5,000,000 school debt lead and asserts it is tagged HOT.
 *
 * Run with:
 *   DATABASE_URL="postgres://..." pnpm exec ts-node scripts/mock-hot-lead.ts
 */

import { BusinessLeadStatus, PrismaClient } from "@prisma/client";
import { computeLeadScore, deriveLeadStatus } from "../src/lib/scoring";

const prisma = new PrismaClient();

async function main() {
  const leadInput = {
    name: "Mock School Debt Lead",
    email: `bursar+${Date.now()}@school.edu`,
    industry: "Private Education",
    painPoint: "Outstanding school debt",
    calculatedRoi: 5_000_000,
  };

  const leadScore = computeLeadScore({
    calculatedRoi: leadInput.calculatedRoi,
    industry: leadInput.industry,
    email: leadInput.email,
  });
  const derivedStatus = deriveLeadStatus(leadScore);

  if (derivedStatus !== BusinessLeadStatus.HOT) {
    throw new Error(
      `Expected HOT status before persistence, got ${derivedStatus}`,
    );
  }

  const created = await prisma.businessLead.create({
    data: {
      ...leadInput,
      leadScore,
      status: derivedStatus,
    },
  });

  const persisted = await prisma.businessLead.findUnique({
    where: { id: created.id },
  });

  if (!persisted) {
    throw new Error("Lead not found after creation.");
  }

  if (persisted.status !== BusinessLeadStatus.HOT) {
    throw new Error(
      `Lead persisted with status ${persisted.status}, expected HOT.`,
    );
  }

  console.log("✅ Lead captured and tagged HOT");
  console.log({
    id: persisted.id,
    name: persisted.name,
    email: persisted.email,
    industry: persisted.industry,
    leadScore: persisted.leadScore,
    status: persisted.status,
  });
}

main()
  .catch((error) => {
    console.error("❌ Lead capture validation failed");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
