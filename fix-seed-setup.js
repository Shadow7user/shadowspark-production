// fix-seed-setup.js
// Run with: node fix-seed-setup.js
// This script fixes the Prisma 7.x seeding issue

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectPath = 'C:\\Users\\Administrator\\Documents\\shadowspark-app';

console.log('🔧 Fixing Prisma 7.x Seed Setup...\n');

// Step 1: Update package.json with correct seed script
const packageJsonPath = path.join(projectPath, 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Ensure prisma seed config
  if (!packageJson.prisma) {
    packageJson.prisma = {};
  }
  packageJson.prisma.seed = "node prisma/seed.js";
  
  // Update scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "seed": "node prisma/seed.js",
    "db:seed": "npx prisma db seed",
    "db:push": "npx prisma db push",
    "db:generate": "npx prisma generate",
    "db:studio": "npx prisma studio",
    "db:reset": "npx prisma migrate reset --force"
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with seed scripts');
} else {
  console.log('❌ package.json not found!');
  process.exit(1);
}

// Step 2: Create the new seed.js file
const seedContent = `// prisma/seed.js
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
  console.log("🌱 Starting database seed...\\n");

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
      console.log(\`🗑️  Cleaned up \${deleted.count} existing test users\`);
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
    console.log("\\n========================================");
    console.log("🎉 Database seeded successfully!");
    console.log("========================================\\n");
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
`;

const seedPath = path.join(projectPath, 'prisma', 'seed.js');
fs.writeFileSync(seedPath, seedContent);
console.log('✅ Created prisma/seed.js');

// Step 3: Instructions
console.log('\n========================================');
console.log('🎉 Setup complete!');
console.log('========================================\n');
console.log('Now run these commands in order:\n');
console.log('  1. npm install pg @prisma/adapter-pg dotenv');
console.log('  2. npx prisma generate');
console.log('  3. npm run seed');
console.log('\nOr run all at once:');
console.log('  npm install pg @prisma/adapter-pg dotenv && npx prisma generate && npm run seed\n');
