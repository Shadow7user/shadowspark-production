const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    console.log("Seeding database...");
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const admin = await prisma.user.upsert({
      where: { email: "admin@shadowspark.test" },
      update: {},
      create: {
        email: "admin@shadowspark.test",
        name: "ShadowSpark Admin",
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date()
      }
    });
    
    console.log("Admin created:", admin.email);
    console.log("Password: admin123");
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();
