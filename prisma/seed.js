// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

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
    where: { email: { in: ["test@shadowspark.com", "admin@shadowspark-technologies.com"] } },
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

  console.log("\n🎉 Done! Login: test@shadowspark.com / test123");
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });