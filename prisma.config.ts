import dotenv from "dotenv";

// Load .env.local first (Next.js convention), then .env if it exists
dotenv.config({ path: ".env.local" });
dotenv.config();

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
