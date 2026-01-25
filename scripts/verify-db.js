require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

async function verify() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  console.log("🔍 ShadowSpark Database Verification");
  console.log("=".repeat(50));

  try {
    await client.connect();

    // 1. Connection + time
    const now = await client.query("SELECT NOW() as time, current_database() as db");
    console.log("✅ Connected to:", now.rows[0].db);
    console.log("🕒 Server time:", now.rows[0].time);

    // 2. Tables in public
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log("📊 Tables:", tables.rows.length);

    const critical = ["users", "courses", "projects", "payments", "enrollments"];
    console.log("🎯 Critical tables:");
    critical.forEach((t) => {
      const ok = tables.rows.some((r) => r.table_name === t);
      console.log(ok ? "  ✅" : "  ❌", t);
    });

    // 3. Write test: insert + delete (id: cuid-like string)
    const email = `verify-${Date.now()}@shadowspark.test`;
    const id = "c" + require("crypto").randomBytes(12).toString("hex").slice(0, 24);
    await client.query(
      `INSERT INTO users (id, email, name, role, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, 'Verify', 'ADMIN', NOW(), NOW(), NOW())`,
      [id, email]
    );
    console.log("✅ Write test: inserted", email);
    await client.query('DELETE FROM users WHERE email = $1', [email]);
    console.log("✅ Write test: cleanup ok");

    console.log("=".repeat(50));
    console.log("🎉 Phase 1A verification complete.");
  } catch (e) {
    console.error("❌", e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verify();
