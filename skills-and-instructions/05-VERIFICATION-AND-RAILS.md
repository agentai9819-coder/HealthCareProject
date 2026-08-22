# 05. Automated Verification & Engineering Rails

This guide encapsulates the quality assurance and development philosophy derived from **Andrej Karpathy's Engineering Principles** and the full 12-step automated verification runner used in production.

---

## 1. Andrej Karpathy Engineering Rules

1. **Think Before Coding**: Don't rush into making edits. First locate all dependencies, data flows, and callers across the codebase.
2. **Simplicity First (KISS & YAGNI)**: Make the smallest, most direct change that solves the problem. Avoid premature abstractions or multi-layered wrapper chains.
3. **No Patch-on-Patch**: If something is architecturally broken, refactor cleanly rather than adding repetitive messy workarounds.
4. **Goal-Driven Verification**: Never consider a task done because code "looks okay". Always run deterministic CLI tests (`npm test`, `npm run typecheck`).

---

## 2. Full 12-Step Automated Verification Script (`scripts/verify-all.js`)

This is the complete, battle-tested monorepo verification runner. Add it to any project and extend the steps as needed.

```javascript
const { execSync } = require("child_process");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("=================================================================");
console.log("🚀 AUTOMATED MONOREPO VERIFICATION SUITE");
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

// 1. Validation Package Tests
runStep("Testing Zod Validation Schemas & Input Sanitizers", () => {
  execSync("npm test --workspace=packages/validation", { stdio: "pipe" });
});

// 2. Full API Security Test Suite
runStep("Testing Backend API (Auth, Injection, IDOR, Abuse, Logging)", () => {
  execSync("npm test --workspace=apps/api", { stdio: "pipe" });
});

// 3. Market-Specific Content Check (customize per project)
// runStep("Verifying Emergency Numbers / Market Content", () => { ... });

// 4. Cloud Database SSL Check
runStep("Verifying Cloud PostgreSQL SSL & TLS Settings", () => {
  const dbContent = fs.readFileSync("apps/api/src/lib/db.ts", "utf8");
  assert.ok(dbContent.includes("rejectUnauthorized: true"), "db.ts must enforce TLS verification");
});

// 5. Security Headers Audit
runStep("Verifying HSTS, CSP & Security Headers in vercel.json", () => {
  const vercelJson = fs.readFileSync("vercel.json", "utf8");
  assert.ok(vercelJson.includes("Content-Security-Policy"), "CSP header required");
  assert.ok(vercelJson.includes("Strict-Transport-Security"), "HSTS header required");
  assert.ok(vercelJson.includes("X-Content-Type-Options"), "X-Content-Type-Options required");
  assert.ok(vercelJson.includes("X-Frame-Options"), "X-Frame-Options required");
});

// 6. Secret Scanner
runStep("Auditing Project-Wide Secrets, Private Keys & Frontend Leaks", () => {
  execSync("node scripts/secret-scanner.js", { stdio: "pipe" });
});

// 7. Anti-Bot & Multi-Tier Rate Limiter Audit
runStep("Auditing Anti-Bot, Anti-Scraping & Rate Limiters in index.ts", () => {
  const indexCode = fs.readFileSync("apps/api/src/index.ts", "utf8");
  assert.ok(indexCode.includes("botDetectionMiddleware"), "botDetectionMiddleware must be mounted");
  assert.ok(indexCode.includes("registrationRateLimiter"), "registrationRateLimiter must be mounted");
  assert.ok(indexCode.includes("authRateLimiter"), "authRateLimiter must be mounted");
});

// 8. HTTPS Transport & Request ID Audit
runStep("Auditing HTTPS Enforcement & Request ID Correlation", () => {
  const indexCode = fs.readFileSync("apps/api/src/index.ts", "utf8");
  assert.ok(indexCode.includes("enforceHttpsMiddleware"), "enforceHttpsMiddleware must be mounted");
  assert.ok(indexCode.includes("requestIdMiddleware"), "requestIdMiddleware must be mounted");
  assert.ok(indexCode.includes("securityAuditMiddleware"), "securityAuditMiddleware must be mounted");
});

// 9. IDOR Ownership Filter Audit
runStep("Auditing Multi-Tenant DB Queries for Strict Ownership Filters", () => {
  // Customize these assertions per project resource structure
  const addressesCode = fs.readFileSync("apps/api/src/modules/addresses/addresses.routes.ts", "utf8");
  assert.ok(
    addressesCode.includes("customer_id = $2") || addressesCode.includes("customer_id = $1"),
    "Address routes must filter by session customer ID"
  );
});

// 10. SQL Parameterization & Formula Injection Audit
runStep("Auditing Parameterized SQL & Formula Cell Neutralization", () => {
  const modulesDir = "apps/api/src/modules";
  function scanRoutes(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) scanRoutes(fullPath);
      else if (entry.isFile() && entry.name.endsWith(".routes.ts")) {
        const content = fs.readFileSync(fullPath, "utf8");
        const matches = content.match(/query\s*\(\s*`[^`]*\$\{/g);
        assert.strictEqual(matches, null, `Unparameterized SQL interpolation found in ${entry.name}`);
      }
    }
  }
  scanRoutes(modulesDir);
});

// 11. OPTIONAL: Market-specific or Feature Checks
// runStep("Verifying Feature X", () => { ... });

// 12. Full Monorepo TypeScript Typecheck
runStep("Running Full Monorepo Strict TypeScript Check", () => {
  execSync("npm run typecheck", { stdio: "pipe" });
});

console.log("\n=================================================================");
console.log(`🎉 Verification Result: ${passed}/${total} Steps Passed`);
console.log("=================================================================\n");

if (passed !== total) process.exit(1);
```

---

## 3. Individual Test Suite Templates

### Auth Security Test (`__tests__/auth-security.test.js`)
```javascript
const assert = require("assert");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Test 1: Bcrypt 12-round hashing
const hash = await bcrypt.hash("TestPassword123!", await bcrypt.genSalt(12));
assert.ok(await bcrypt.compare("TestPassword123!", hash));
assert.ok(!(await bcrypt.compare("WrongPassword", hash)));

// Test 2: SHA-256 token hashing
const rawToken = crypto.randomBytes(32).toString("hex");
const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
assert.strictEqual(rawToken.length, 64);
assert.notStrictEqual(rawToken, tokenHash);

// Test 3: Token expiration
function isTokenValid(record) {
  if (!record) return false;
  if (record.used_at !== null) return false;
  if (new Date(record.expires_at).getTime() <= Date.now()) return false;
  return true;
}
assert.ok(isTokenValid({ used_at: null, expires_at: new Date(Date.now() + 900_000) }));
assert.ok(!isTokenValid({ used_at: null, expires_at: new Date(Date.now() - 1000) }));
assert.ok(!isTokenValid({ used_at: new Date(), expires_at: new Date(Date.now() + 900_000) }));
```

### IDOR Ownership Test (`__tests__/idor-ownership.test.js`)
```javascript
// Simulate DB query with ownership filter
function getResource(resourceId, ownerId) {
  const row = database.find((r) => r.id === resourceId && r.ownerId === ownerId);
  if (!row) return { status: 404, error: "Not found" };
  return { status: 200, data: row };
}

// Owner accesses own resource → 200 OK
assert.strictEqual(getResource("res-A", "user-A").status, 200);
// Another user attempts IDOR → 404 Not Found
assert.strictEqual(getResource("res-A", "user-B").status, 404);
```

### Abuse Protection Test (`__tests__/abuse-protection.test.js`)
```javascript
// Sliding-window limiter engine
const testLimiter = createRateLimiter({ windowMs: 5000, max: 3 });
// 3 requests pass, 4th returns 429
for (let i = 0; i < 3; i++) testLimiter(req, res, () => {});
testLimiter(req, res, () => { assert.fail("Should have been blocked"); });
assert.strictEqual(res.getStatusCode(), 429);

// Bot detection
botDetectionMiddleware({ ...req, headers: { "user-agent": "sqlmap/1.6" } }, res, () => {
  assert.fail("Bot should have been blocked");
});
assert.strictEqual(res.getStatusCode(), 403);
```

---

## 4. Git Standards

- **One concern per commit**: Don't mix feature, refactor, and unrelated fixes
- **Never commit**: secrets, `.env`, `*.key`, debug dumps, generated junk
- **Verify before committing**: `npm test && npm run typecheck && npm run build`
- **Branch naming**: `feat/`, `fix/`, `security/`, `refactor/`
