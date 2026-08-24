const { execSync } = require("child_process");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

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
runStep("Testing Validation Schemas (Indian PIN, Addresses, Auth Schemas, Sanitizers)", () => {
  execSync("npm test --workspace=packages/validation", { stdio: "pipe" });
});

// 2. API Security, Concurrency, Injection Defense, IDOR, Abuse Protection & Security Transport Tests
runStep("Testing Backend API Concurrency, Auth, Injection, IDOR, Abuse & Transport Suite", () => {
  execSync("npm test --workspace=apps/api", { stdio: "pipe" });
});

// 3. Indian Market Emergency Number Check
runStep("Verifying Indian Emergency Protocol (112 / 108)", () => {
  const footerContent = fs.readFileSync("apps/web/src/components/webflow/WebflowFooter.tsx", "utf8");
  assert.ok(footerContent.includes("112"), "Footer must reference 112 National Emergency");
  assert.ok(footerContent.includes("108"), "Footer must reference 108 Ambulance Services");
  assert.ok(!footerContent.includes("call 911 immediately"), "Footer must not contain 911 emergency instruction");
});

// 4. Indian Metropolitan Coverage Area Check
runStep("Verifying Indian Metropolitan Care Network Hubs", () => {
  const serviceAreasContent = fs.readFileSync("apps/web/src/app/service-areas/page.tsx", "utf8");
  assert.ok(serviceAreasContent.includes("Delhi NCR"), "Service areas must include Delhi NCR");
  assert.ok(serviceAreasContent.includes("Bengaluru"), "Service areas must include Bengaluru");
  assert.ok(serviceAreasContent.includes("Mumbai MMR"), "Service areas must include Mumbai MMR");
});

// 5. Cloud Database Connection Readiness
runStep("Verifying Cloud PostgreSQL SSL & Connection Settings", () => {
  const dbContent = fs.readFileSync("apps/api/src/lib/db.ts", "utf8");
  assert.ok(dbContent.includes("rejectUnauthorized: true"), "db.ts must enforce strict TLS peer certificate validation");
  assert.ok(dbContent.includes("neon.tech"), "db.ts must recognize Neon cloud connections");
  assert.ok(dbContent.includes("supabase.co"), "db.ts must recognize Supabase cloud connections");
});

// 6. SSL Trust & HSTS Security Headers
runStep("Verifying HSTS, CSP & SSL Trust Security Headers", () => {
  const vercelJson = fs.readFileSync("vercel.json", "utf8");
  assert.ok(vercelJson.includes("Content-Security-Policy"), "vercel.json must include CSP header");
  assert.ok(vercelJson.includes("Strict-Transport-Security"), "vercel.json must include HSTS header");
  assert.ok(vercelJson.includes("X-Content-Type-Options"), "vercel.json must include X-Content-Type-Options");
  assert.ok(vercelJson.includes("X-Frame-Options"), "vercel.json must include X-Frame-Options");
});

// 7. Project-Wide Credential & Secret Audit Scanner
runStep("Auditing Project-Wide Secrets, Private Keys & Frontend Isolation", () => {
  execSync("node scripts/secret-scanner.js", { stdio: "pipe" });
});

// 8. Multi-Tier Rate Limiting & Anti-Bot Middleware Audit
runStep("Auditing Anti-Bot, Anti-Scraping & Multi-Tier Rate Limiters", () => {
  const indexCode = fs.readFileSync("apps/api/src/index.ts", "utf8");
  assert.ok(indexCode.includes("botDetectionMiddleware"), "index.ts must mount botDetectionMiddleware");
  assert.ok(indexCode.includes("registrationRateLimiter"), "index.ts must mount registrationRateLimiter");
  assert.ok(indexCode.includes("exportScrapingLimiter"), "index.ts must mount exportScrapingLimiter");
  assert.ok(indexCode.includes("authRateLimiter"), "index.ts must mount authRateLimiter");
});

// 9. HTTPS Transport Enforcement & Security Audit Middleware
runStep("Auditing HTTPS Transport Enforcement & Request ID Correlation", () => {
  const indexCode = fs.readFileSync("apps/api/src/index.ts", "utf8");
  assert.ok(indexCode.includes("enforceHttpsMiddleware"), "index.ts must mount enforceHttpsMiddleware");
  assert.ok(indexCode.includes("requestIdMiddleware"), "index.ts must mount requestIdMiddleware");
  assert.ok(indexCode.includes("securityAuditMiddleware"), "index.ts must mount securityAuditMiddleware");
});

// 10. IDOR & Multi-Tenant Isolation Static Code Audit
runStep("Auditing Multi-Tenant Database Queries for Strict Ownership Filters", () => {
  const addressesCode = fs.readFileSync("apps/api/src/modules/addresses/addresses.routes.ts", "utf8");
  assert.ok(addressesCode.includes("customer_id = $2") || addressesCode.includes("customer_id = $1"), "Address routes must filter by session customerId");

  const bookingsCode = fs.readFileSync("apps/api/src/modules/bookings/bookings.routes.ts", "utf8");
  assert.ok(bookingsCode.includes("b.customer_id = $2") || bookingsCode.includes("booking.customer_id !== req.session.customerId"), "Booking routes must enforce customer ownership checks");

  const visitsCode = fs.readFileSync("apps/api/src/modules/visits/visits.routes.ts", "utf8");
  assert.ok(visitsCode.includes("vsa.staff_id = $2") || visitsCode.includes("vsa.staff_id = $1"), "Staff visit routes must check visit_staff_assignments");
});

// 11. SQL Parameterization & Formula Injection Audit
runStep("Auditing Parameterized SQL & Spreadsheet Formula Neutralization", () => {
  const modulesDir = "apps/api/src/modules";
  function scanRoutes(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanRoutes(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".routes.ts")) {
        const content = fs.readFileSync(fullPath, "utf8");
        const matches = content.match(/query\s*\(\s*`[^`]*\$\{/g);
        assert.strictEqual(matches, null, `Unparameterized SQL interpolation in ${entry.name}`);
      }
    }
  }
  scanRoutes(modulesDir);

  const adminRoutesContent = fs.readFileSync("apps/api/src/modules/staff/admin.routes.ts", "utf8");
  assert.ok(adminRoutesContent.includes("sanitizeFormulaCell"), "admin.routes.ts must use sanitizeFormulaCell on export rows");
});

// 12. Monorepo Typecheck
runStep("Running Full Monorepo Strict TypeScript Check", () => {
  execSync("npm run typecheck", { stdio: "pipe" });
});

console.log("\n=================================================================");
console.log(`🎉 Automated Verification Result: ${passed}/${total} Steps Passed`);
console.log("=================================================================\n");

if (passed !== total) {
  process.exit(1);
}
