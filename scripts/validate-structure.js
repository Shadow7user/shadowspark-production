// ShadowSpark Technologies - Project Structure Validator
// Run as: node scripts/validate-structure.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_STRUCTURE = {
  "Phase 1 - Foundation": {
    critical: [
      "prisma/schema.prisma",
      ".env.local",
      "package.json",
      "next.config.js",
      "tailwind.config.ts",
      "tsconfig.json",
    ],
    optional: ["src/lib/db.ts", "src/lib/auth.ts"],
  },
  "Phase 2 - Marketing": {
    critical: [
      "src/app/(marketing)/page.tsx",
      "src/app/(marketing)/layout.tsx",
    ],
    optional: [
      "src/components/ui/button.tsx",
      "src/components/marketing/hero.tsx",
    ],
  },
};

console.log("🔍 ShadowSpark Project Structure Validation\n" + "=".repeat(60));

let totalChecks = 0;
let passedChecks = 0;

for (const [phase, files] of Object.entries(REQUIRED_STRUCTURE)) {
  console.log(`\n📁 ${phase}:`);

  // Check critical files
  files.critical.forEach((file) => {
    totalChecks++;
    const exists = fs.existsSync(file);
    if (exists) {
      console.log(`  ✅ ${file}`);
      passedChecks++;
    } else {
      console.log(`  ❌ MISSING: ${file}`);
    }
  });

  // Check optional files
  if (files.optional) {
    files.optional.forEach((file) => {
      const exists = fs.existsSync(file);
      const status = exists ? "✅" : "⏳";
      console.log(`  ${status} ${file} (optional)`);
    });
  }
}

const percentage =
  totalChecks === 0 ? 0 : Math.round((passedChecks / totalChecks) * 100);
console.log(
  `\n📊 Structure Validation: ${percentage}% (${passedChecks}/${totalChecks} critical files)`,
);

if (percentage < 100) {
  console.log(
    "\n⚠️  Missing critical files detected. Run QUICK_START.md setup.",
  );
  process.exit(1);
} else {
  console.log("\n✅ All critical files present. Project structure valid.");
  process.exit(0);
}
