// prisma/seed.js
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL not found!");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...\n");

  const deleted = await prisma.user.deleteMany({
    where: {
      email: {
        in: ["test@shadowspark.com", "admin@shadowspark-technologies.com"],
      },
    },
  });
  if (deleted.count > 0) console.log(`🗑️  Cleaned ${deleted.count} users`);

  const admin = await prisma.user.create({
    data: {
      email: "admin@shadowspark-technologies.com",
      name: "Admin",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created:", admin.email);

  const test = await prisma.user.create({
    data: {
      email: "test@shadowspark.com",
      name: "Test User",
      password: await bcrypt.hash("test123", 10),
      role: "STUDENT",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created:", test.email);

  // Seed Tier 1 Leads (Phase C: Lead Outreach)
  console.log("\n📊 Seeding leads...");

  const tier1Leads = [
    {
      name: "Emmanuel Okonkwo",
      email: "emmanuel@fashionhub.ng",
      phone: "+234 802 345 6789",
      company: "FashionHub Nigeria",
      industry: "E-commerce (Fashion)",
      painPoint:
        "WhatsApp support overwhelmed - team answers same questions 50+ times daily. Losing sales to slow responses.",
      status: "contacted",
      estimatedValue: 450000,
      closeProbability: 60,
      nextFollowUp: new Date("2026-02-09"),
      notes:
        "Met at Lagos Tech Meetup. Very interested in chatbot. Has 3 staff on WhatsApp support.",
      userId: admin.id,
    },
    {
      name: "Reginald Adekunle",
      email: "reginald@swiftlogistics.com.ng",
      phone: "+234 805 678 9012",
      company: "Swift Logistics",
      industry: "Logistics & Delivery",
      painPoint:
        "Manual order tracking killing productivity. Copy-pasting tracking numbers into Excel. Customers calling non-stop.",
      status: "contacted",
      estimatedValue: 950000,
      closeProbability: 45,
      nextFollowUp: new Date("2026-02-10"),
      notes:
        "Referral from Tunde. Handles 200+ deliveries/day across Lagos-Ibadan.",
      userId: admin.id,
    },
    {
      name: "Stephen Adeyemi",
      email: "stephen@primeproperties.ng",
      phone: "+234 803 901 2345",
      company: "Prime Properties Lagos",
      industry: "Real Estate",
      painPoint:
        "Zero web presence. Competitors ranking on Google getting all the leads. Still relying on referrals only.",
      status: "contacted",
      estimatedValue: 1200000,
      closeProbability: 50,
      nextFollowUp: new Date("2026-02-08"),
      notes: "LinkedIn connection. Has 15+ Lekki/VI properties but no website.",
      userId: admin.id,
    },
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
      userId: admin.id,
    },
    {
      name: "Kelechi Eze",
      email: "kelechi@spicykitchen.ng",
      phone: "+234 808 456 7890",
      company: "Spicy Kitchen",
      industry: "Food & Restaurant",
      painPoint:
        "Phone orders causing kitchen errors. No delivery system. Losing customers to competitors with apps.",
      status: "qualified",
      estimatedValue: 1500000,
      closeProbability: 55,
      nextFollowUp: new Date("2026-02-07"),
      notes:
        "Warm intro from mutual friend. 3 restaurant locations. Ready to invest in ordering system.",
      userId: admin.id,
    },
  ];

  for (const lead of tier1Leads) {
    const existing = await prisma.prospect.findFirst({
      where: { email: lead.email },
    });
    if (!existing) {
      await prisma.prospect.create({ data: lead });
      console.log(
        `✅ Lead: ${lead.name} (${lead.company}) - ₦${lead.estimatedValue.toLocaleString()}`,
      );
    }
  }

  const totalPipeline = tier1Leads.reduce(
    (sum, l) => sum + l.estimatedValue,
    0,
  );
  console.log(`📈 Total Pipeline: ₦${totalPipeline.toLocaleString()}`);

  console.log("\n🎉 Done! Login: test@shadowspark.com / test123");
}

main()
  .catch((e) => {
    console.error("❌", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
