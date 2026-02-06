import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkData() {
  console.log(
    "Connecting to:",
    process.env.DATABASE_URL?.substring(0, 50) + "...",
  );

  const courses = await prisma.course.findMany({
    select: { id: true, title: true, price: true, published: true },
  });
  console.log("Courses:", courses);

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true },
  });
  console.log("\nUsers:", users);

  await prisma.$disconnect();
  await pool.end();
}

checkData();
