// prisma/seed.js
// Compatible with Prisma 7.x + ESM + prisma.config.ts setup
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables (same as prisma.config.ts)
dotenv.config({ path: ".env.local" });
dotenv.config();

// Get the database URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL not found in environment variables!");
  console.error("   Make sure .env.local exists with DATABASE_URL set.");
  process.exit(1);
}

// Create connection pool and adapter (required for Neon with Prisma 7.x)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Clean up existing test users (optional)
    const deleted = await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            "test@shadowspark.com",
            "admin@shadowspark-technologies.com",
            "architect@shadowspark-technologies.com",
          ],
        },
      },
    });

    if (deleted.count > 0) {
      console.log(`🗑️  Cleaned up ${deleted.count} existing test users`);
    }

    // Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
      data: {
        email: "admin@shadowspark-technologies.com",
        name: "ShadowSpark Admin",
        password: adminPassword,
        role: "ADMIN",
        emailVerified: new Date(),
        company: "ShadowSpark Technologies",
        location: "Port Harcourt, Nigeria",
      },
    });
    console.log("✅ Created admin user:", admin.email);

    // Create Test User (for login testing)
    const testPassword = await bcrypt.hash("test123", 10);
    const testUser = await prisma.user.create({
      data: {
        email: "test@shadowspark.com",
        name: "Test User",
        password: testPassword,
        role: "STUDENT",
        emailVerified: new Date(),
      },
    });
    console.log("✅ Created test user:", testUser.email);

    // Create Architect User (your main account)
    const architectPassword = await bcrypt.hash("architect123", 10);
    const architect = await prisma.user.create({
      data: {
        email: "architect@shadowspark-technologies.com",
        name: "The Architect",
        password: architectPassword,
        role: "ADMIN",
        emailVerified: new Date(),
        company: "ShadowSpark Technologies",
        location: "Port Harcourt, Nigeria",
      },
    });
    console.log("✅ Created architect user:", architect.email);

    // Summary
    console.log("\n========================================");
    console.log("🎉 Database seeded successfully!");
    console.log("========================================\n");
    console.log("Test Credentials:");
    console.log("─────────────────");
    console.log("📧 Admin:     admin@shadowspark-technologies.com / admin123");
    console.log("📧 Test:      test@shadowspark.com / test123");
    console.log("📧 Architect: architect@shadowspark-technologies.com / architect123");
    console.log("");

  } catch (error) {
    if (error.code === "P2002") {
      console.log("⚠️  Some users already exist (unique constraint)");
      console.log("   This is fine - your users are already in the database.");
    } else {
      console.error("❌ Seed failed:", error.message);
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("🔌 Database connections closed.");
  });
