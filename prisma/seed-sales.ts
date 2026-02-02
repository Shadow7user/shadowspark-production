import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding sales data...");

  // Get the first admin/user from database
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error("❌ No user found. Please create a user first.");
    return;
  }

  console.log(`✓ Using user: ${user.email}`);

  // Create 3 test prospects (Tier 1 leads)
  const prospects = await Promise.all([
    prisma.prospect.create({
      data: {
        name: "Emmanuel Okafor",
        email: "emmanuel@techhublagos.com",
        phone: "+234 803 456 7890",
        company: "TechHub Lagos",
        industry: "Technology",
        painPoint: "Manual customer support eating 40% of team time",
        estimatedValue: 500000,
        status: "contacted",
        userId: user.id,
      },
    }),
    prisma.prospect.create({
      data: {
        name: "Reginald Eze",
        email: "reginald@naijamart.ng",
        phone: "+234 805 123 4567",
        company: "NaijaMart",
        industry: "E-commerce",
        painPoint: "Lost sales due to slow website & no live chat",
        estimatedValue: 800000,
        status: "qualified",
        userId: user.id,
      },
    }),
    prisma.prospect.create({
      data: {
        name: "Stephen Adebayo",
        email: "stephen@logitrack.ng",
        phone: "+234 807 987 6543",
        company: "LogiTrack",
        industry: "Logistics",
        painPoint: "Manual order tracking & no automation",
        estimatedValue: 1200000,
        status: "proposed",
        userId: user.id,
      },
    }),
  ]);

  console.log("✓ Created 3 test prospects");

  // Create proposal for Stephen (LogiTrack)
  const proposal = await prisma.proposal.create({
    data: {
      title: "AI Chatbot + Order Tracking System for LogiTrack",
      description:
        "WhatsApp chatbot for order tracking + automated SMS notifications",
      amount: 1200000,
      timeline: "3-4 weeks",
      deliverables: [
        "WhatsApp Business API integration",
        "Real-time order tracking dashboard",
        "Automated SMS notifications",
        "2 months free support",
      ],
      status: "sent",
      prospectId: prospects[2].id,
      userId: user.id,
    },
  });

  console.log("✓ Created proposal for Stephen (LogiTrack)");

  // Create invoice (40% deposit)
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-001",
      amount: 480000,
      description: "40% Deposit - AI Chatbot + Order Tracking System",
      paymentStatus: "pending",
      paymentUrl: "https://paystack.com/pay/test-invoice-001",
      prospectId: prospects[2].id,
      proposalId: proposal.id,
      userId: user.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✓ Created invoice for Stephen (₦480,000 deposit)");

  console.log("\n=== Test Data Summary ===");
  console.log("Prospects: 3");
  console.log("  - Emmanuel (TechHub Lagos): Contacted, ₦500K");
  console.log("  - Reginald (NaijaMart): Qualified, ₦800K");
  console.log("  - Stephen (LogiTrack): Proposed, ₦1.2M");
  console.log("Proposals: 1");
  console.log("Invoices: 1");
  console.log("Total Pipeline: ₦2.5M");
  console.log("\n✅ Sales seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
