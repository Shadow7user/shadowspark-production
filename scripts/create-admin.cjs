// CommonJS script to create admin user
const bcrypt = require("bcryptjs");

async function createAdmin() {
  // Dynamic import of the project's prisma instance
  const { prisma } = await import("../src/lib/prisma.js");

  try {
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
  } catch (e) {
    console.error("❌ Error:", e.message);
  }
}

createAdmin();
