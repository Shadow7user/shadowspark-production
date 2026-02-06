/**
 * Seed script for Phase C: Lead Outreach
 * Run: npx ts-node prisma/seed-leads.ts
 * Or add to existing seed.js
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tier 1 Leads - Emmanuel, Reginald, Stephen
const tier1Leads = [
  {
    name: "Emmanuel Okonkwo",
    email: "emmanuel@fashionhub.ng",
    phone: "+234 802 345 6789",
    company: "FashionHub Nigeria",
    industry: "E-commerce (Fashion)",
    painPoint:
      "WhatsApp support overwhelmed - team answers same questions 50+ times daily. Losing sales to slow responses. Need 24/7 automated responses.",
    status: "contacted",
    estimatedValue: 450000, // ₦450K
    closeProbability: 60,
    nextFollowUp: new Date("2026-02-09"),
    notes:
      "Met at Lagos Tech Meetup. Very interested in chatbot. Has 3 staff on WhatsApp support. Competitors responding faster.",
  },
  {
    name: "Reginald Adekunle",
    email: "reginald@swiftlogistics.com.ng",
    phone: "+234 805 678 9012",
    company: "Swift Logistics",
    industry: "Logistics & Delivery",
    painPoint:
      "Manual order tracking killing productivity. Copy-pasting tracking numbers into Excel. Customers calling non-stop asking 'where is my package?'",
    status: "contacted",
    estimatedValue: 950000, // ₦950K
    closeProbability: 45,
    nextFollowUp: new Date("2026-02-10"),
    notes:
      "Referral from Tunde. Handles 200+ deliveries/day across Lagos-Ibadan. Needs real-time dashboard + auto SMS to customers.",
  },
  {
    name: "Stephen Adeyemi",
    email: "stephen@primeproperties.ng",
    phone: "+234 803 901 2345",
    company: "Prime Properties Lagos",
    industry: "Real Estate",
    painPoint:
      "Zero web presence. Competitors ranking on Google getting all the leads. Still relying on referrals and agents bringing clients.",
    status: "contacted",
    estimatedValue: 1200000, // ₦1.2M
    closeProbability: 50,
    nextFollowUp: new Date("2026-02-08"),
    notes:
      "LinkedIn connection. Has 15+ Lekki/VI properties but no website. Competitors dominating 'Lekki apartments' searches.",
  },
];

// Additional Tier 2 leads for pipeline
const tier2Leads = [
  {
    name: "Chioma Nwachukwu",
    email: "chioma@bellabeauty.ng",
    phone: "+234 806 234 5678",
    company: "Bella Beauty Lounge",
    industry: "Beauty & Wellness",
    painPoint:
      "Appointment booking chaos. No-shows costing ₦200K/month. Phone lines always busy.",
    status: "new",
    estimatedValue: 650000,
    closeProbability: 30,
    nextFollowUp: new Date("2026-02-12"),
    notes: "Found via Instagram. 3 locations in Lagos. Needs booking system.",
  },
  {
    name: "Dr. Emeka Obi",
    email: "emeka@medicareplus.ng",
    phone: "+234 807 345 6789",
    company: "MediCare Plus Clinic",
    industry: "Healthcare",
    painPoint:
      "Receptionist overwhelmed with appointment calls. 40% no-show rate. Patients want online booking.",
    status: "new",
    estimatedValue: 750000,
    closeProbability: 35,
    nextFollowUp: new Date("2026-02-14"),
    notes:
      "Cold email response. Private clinic in Ikeja. Interested in patient portal.",
  },
  {
    name: "Kelechi Eze",
    email: "kelechi@spicykitchen.ng",
    phone: "+234 808 456 7890",
    company: "Spicy Kitchen",
    industry: "Food & Restaurant",
    painPoint:
      "Phone orders causing kitchen errors. No delivery system. Losing 'lazy night' customers to competitors with apps.",
    status: "qualified",
    estimatedValue: 1500000,
    closeProbability: 55,
    nextFollowUp: new Date("2026-02-07"),
    notes:
      "Warm intro from mutual friend. 3 restaurant locations. Ready to invest in ordering system.",
  },
];

async function seedLeads() {
  console.log("🚀 Seeding Tier 1 and Tier 2 leads...\n");

  // Find admin user to associate leads with
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminUser) {
    console.error("❌ No admin user found. Please create an admin user first.");
    process.exit(1);
  }

  console.log(`📧 Using admin user: ${adminUser.email}\n`);

  // Seed Tier 1 leads
  console.log("--- TIER 1 LEADS (Priority) ---");
  for (const lead of tier1Leads) {
    const existing = await prisma.prospect.findFirst({
      where: { email: lead.email },
    });

    if (existing) {
      console.log(`⏭️  ${lead.name} already exists`);
      continue;
    }

    await prisma.prospect.create({
      data: {
        ...lead,
        userId: adminUser.id,
      },
    });
    console.log(
      `✅ Created: ${lead.name} (${lead.company}) - ₦${lead.estimatedValue.toLocaleString()}`,
    );
  }

  // Seed Tier 2 leads
  console.log("\n--- TIER 2 LEADS (Pipeline) ---");
  for (const lead of tier2Leads) {
    const existing = await prisma.prospect.findFirst({
      where: { email: lead.email },
    });

    if (existing) {
      console.log(`⏭️  ${lead.name} already exists`);
      continue;
    }

    await prisma.prospect.create({
      data: {
        ...lead,
        userId: adminUser.id,
      },
    });
    console.log(
      `✅ Created: ${lead.name} (${lead.company}) - ₦${lead.estimatedValue.toLocaleString()}`,
    );
  }

  // Summary
  const totalLeads = await prisma.prospect.count();
  const totalPipeline = await prisma.prospect.aggregate({
    _sum: { estimatedValue: true },
  });

  console.log("\n📊 PIPELINE SUMMARY:");
  console.log(`   Total Leads: ${totalLeads}`);
  console.log(
    `   Total Pipeline: ₦${totalPipeline._sum.estimatedValue?.toLocaleString() || 0}`,
  );
  console.log("\n✅ Lead seeding complete!");
}

seedLeads()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
