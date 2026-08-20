const { execSync } = require("child_process");
const assert = require("assert");

console.log("=================================================================");
console.log("🏥 VERIDIAN CARE (INDIA) — AUTOMATED VERIFICATION SUITE");
console.log("=================================================================\n");

let passed = 0;
let total = 0;

function runStep(name, fn) {
  total++;
  process.stdout.write(`Step ${total}: ${name}... `);
  try {
    fn();
    console.log("✔ PASS");
    passed++;
  } catch (err) {
    console.log("❌ FAIL");
    console.error("  Error Details:", err.message);
  }
}

// 1. Packages Validation Tests
runStep("Testing Validation Schemas (Indian PIN, Addresses, Registration)", () => {
  execSync("npm test --workspace=packages/validation", { stdio: "pipe" });
});

// 2. API Security & Concurrency Tests
runStep("Testing Backend API Concurrency & Auth Security", () => {
  execSync("npm test --workspace=apps/api", { stdio: "pipe" });
});

// 3. Indian Market Emergency Number Check
runStep("Verifying Indian Emergency Protocol (112 / 108)", () => {
  const fs = require("fs");
  const footerContent = fs.readFileSync("apps/web/src/components/MarketingFooter.tsx", "utf8");
  assert.ok(footerContent.includes("112"), "Footer must reference 112 National Emergency");
  assert.ok(footerContent.includes("108"), "Footer must reference 108 Ambulance Services");
  assert.ok(!footerContent.includes("call 911 immediately"), "Footer must not contain 911 emergency instruction");
});

// 4. Indian Metropolitan Coverage Area Check
runStep("Verifying Indian Metropolitan Care Network Hubs", () => {
  const fs = require("fs");
  const serviceAreasContent = fs.readFileSync("apps/web/src/app/service-areas/page.tsx", "utf8");
  assert.ok(serviceAreasContent.includes("Delhi NCR"), "Service areas must include Delhi NCR");
  assert.ok(serviceAreasContent.includes("Bengaluru"), "Service areas must include Bengaluru");
  assert.ok(serviceAreasContent.includes("Mumbai MMR"), "Service areas must include Mumbai MMR");
});

// 5. Cloud Database Connection Readiness
runStep("Verifying Cloud PostgreSQL SSL & Connection Settings", () => {
  const fs = require("fs");
  const dbContent = fs.readFileSync("apps/api/src/lib/db.ts", "utf8");
  assert.ok(dbContent.includes("rejectUnauthorized: false"), "db.ts must support Cloud SSL pooling");
  assert.ok(dbContent.includes("neon.tech"), "db.ts must recognize Neon cloud connections");
  assert.ok(dbContent.includes("supabase.co"), "db.ts must recognize Supabase cloud connections");
});

// 6. SSL Trust & HSTS Security Headers
runStep("Verifying HSTS & SSL Trust Security Headers", () => {
  const fs = require("fs");
  const vercelJson = fs.readFileSync("vercel.json", "utf8");
  assert.ok(vercelJson.includes("Strict-Transport-Security"), "vercel.json must include HSTS header");
  assert.ok(vercelJson.includes("X-Content-Type-Options"), "vercel.json must include X-Content-Type-Options");
  assert.ok(vercelJson.includes("X-Frame-Options"), "vercel.json must include X-Frame-Options");
});

// 7. Monorepo Typecheck
runStep("Running Full Monorepo Strict TypeScript Check", () => {
  execSync("npm run typecheck", { stdio: "pipe" });
});

console.log("\n=================================================================");
console.log(`🎉 Automated Verification Result: ${passed}/${total} Steps Passed`);
console.log("=================================================================\n");

if (passed !== total) {
  process.exit(1);
}
