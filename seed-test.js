const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

async function seed() {
  const connectionString = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_cUL0Gbrfl2TO@ep-calm-glade-aglkkkal-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🌱 Creating test user...");
    
    const user = await prisma.user.upsert({
      where: { email: "test@shadowspark.com" },
      update: { password: "test123" },
      create: {
        email: "test@shadowspark.com",
        name: "Test Admin",
        password: "test123",
        role: "ADMIN",
        emailVerified: new Date()
      }
    });
    
    console.log("✅ Test user ready:", user.email);
    console.log("📝 Password: test123");
    
  } catch (e) {
    console.error("❌ Error:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();
