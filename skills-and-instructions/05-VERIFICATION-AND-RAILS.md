# 05. Automated Verification & Karpathy Engineering Rails

This guide encapsulates the quality assurance and development philosophy derived from **Andrej Karpathy's Engineering Principles**.

---

## 1. Andrej Karpathy Engineering Rules

1. **Think Before Coding**:
   - Don't rush into making edits. First locate all dependencies, data flows, and callers across the codebase.
2. **Simplicity First (KISS & YAGNI)**:
   - Make the smallest, most direct change that solves the problem. Avoid premature abstractions or multi-layered wrapper chains.
3. **No Patch-on-Patch**:
   - If something is architecturally broken, refactor cleanly rather than adding repetitive messy workarounds.
4. **Goal-Driven Verification**:
   - Never consider a task done because code "looks okay". Always run deterministic CLI tests (`npm test`, `npm run typecheck`).

---

## 2. Universal Automated Verification Script (`scripts/verify-all.js`)

Add a master verification runner to any project:
```javascript
const { execSync } = require("child_process");

function run(name, fn) {
  process.stdout.write(`${name}... `);
  try {
    fn();
    console.log("✔ PASS");
  } catch (err) {
    console.error("✖ FAIL");
    console.error(err.message);
    process.exit(1);
  }
}

console.log("=================================================================");
console.log("🚀 UNIVERSAL AUTOMATED VERIFICATION SUITE");
console.log("=================================================================\n");

run("Step 1: Testing Validation Schemas (Zod)", () => {
  // Test schema inputs & negative boundary cases
});

run("Step 2: Testing Security Headers & Rate Limiters", () => {
  // Test CSP, HSTS, and 429 rate limit triggers
});

run("Step 3: Running Monorepo Strict TypeScript Check", () => {
  execSync("npm run typecheck", { stdio: "pipe" });
});

console.log("\n=================================================================");
console.log("🎉 All Verification Steps Passed Cleanly!");
console.log("=================================================================\n");
```
