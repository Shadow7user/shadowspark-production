import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function createAdmin() {
  try {
    console.log("Connecting to database...");
    const hash = bcrypt.hashSync("Admin@2026!Secure", 10);
    const user = await prisma.user.upsert({
      where: { email: "admin@shadowspark-technologies.com" },
      update: { role: "ADMIN", password: hash },
      create: {
        name: "Admin",
        email: "admin@shadowspark-technologies.com",
        password: hash,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin created:", user.id, user.email, user.role);
  } catch (e: unknown) {
    console.error("❌ Full Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
