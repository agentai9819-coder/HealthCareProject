const assert = require("assert");
const {
  sanitizeText,
  sanitizeFormulaCell,
  uuidParamSchema,
  listVisitsQuerySchema,
  customerNameSchema,
  updateCustomerIntakeSchema,
} = require("home-healthcare-validation");

console.log("▶ Running apps/api injection-defense test suite...");

async function runInjectionDefenseTests() {
  // 1. Stored XSS & Script Tag Injection Sanitization
  const maliciousScript = "<script>alert('XSS-Attempt')</script>John";
  const sanitizedName = sanitizeText(maliciousScript);
  assert.strictEqual(sanitizedName, "John", "HTML script tags must be completely stripped");

  const maliciousIframe = "Need post-op care <iframe src='https://malicious.example.com'></iframe> immediately";
  const sanitizedIntake = sanitizeText(maliciousIframe);
  assert.strictEqual(sanitizedIntake, "Need post-op care  immediately", "iFrame injection must be neutralized");

  const controlCharPayload = "Nurse\u0000Notes\u001FEntry";
  const sanitizedControlChars = sanitizeText(controlCharPayload);
  assert.strictEqual(sanitizedControlChars, "NurseNotesEntry", "Dangerous ASCII control characters must be stripped");
  console.log("  ✔ Cross-Site Scripting (XSS) & Script tag sanitization passed");

  // 2. Schema-Level Auto-Sanitization on User Intake Notes
  const intakePayload = { intakeNotes: "<script>document.cookie</script>Patient has diabetes & hypertension." };
  const intakeParse = updateCustomerIntakeSchema.safeParse(intakePayload);
  assert.strictEqual(intakeParse.success, true);
  assert.strictEqual(
    intakeParse.data.intakeNotes,
    "Patient has diabetes & hypertension.",
    "Intake notes must be automatically sanitized during Zod parsing"
  );
  console.log("  ✔ Schema auto-sanitization on intake notes passed");

  // 3. Formula Injection (CWE-1236) Neutralization for Excel / CSV Exports
  assert.strictEqual(sanitizeFormulaCell("=SUM(A1:A10)"), "'=SUM(A1:A10)", "Formula starting with = must be escaped with single quote");
  assert.strictEqual(sanitizeFormulaCell("+cmd|' /C calc'!A0"), "'+cmd|' /C calc'!A0", "Formula starting with + must be escaped");
  assert.strictEqual(sanitizeFormulaCell("-2+3+cmd|' /C calc'!A0"), "'-2+3+cmd|' /C calc'!A0", "Formula starting with - must be escaped");
  assert.strictEqual(sanitizeFormulaCell("@SUM(1,2)"), "'@SUM(1,2)", "Formula starting with @ must be escaped");
  assert.strictEqual(sanitizeFormulaCell("\tcalc"), "'\tcalc", "Formula starting with tab character must be escaped");
  assert.strictEqual(sanitizeFormulaCell("Dr. Sunita Rao"), "Dr. Sunita Rao", "Safe names must remain unchanged");
  console.log("  ✔ Formula Injection / CSV Injection (CWE-1236) neutralization passed");

  // 4. Route Parameter UUID Format Enforcement (prevents PostgreSQL 22P02 crashes)
  const validUuid = "11111111-1111-4111-a111-111111111111";
  const invalidUuid1 = "123-malformed-id";
  const invalidUuid2 = "../../etc/passwd";
  const sqlInjectionParam = "1' OR '1'='1";

  assert.strictEqual(uuidParamSchema.safeParse(validUuid).success, true, "Valid UUID must pass");
  assert.strictEqual(uuidParamSchema.safeParse(invalidUuid1).success, false, "Malformed string must fail UUID validation");
  assert.strictEqual(uuidParamSchema.safeParse(invalidUuid2).success, false, "Path traversal pattern must fail UUID validation");
  assert.strictEqual(uuidParamSchema.safeParse(sqlInjectionParam).success, false, "SQL injection string must fail UUID validation");
  console.log("  ✔ UUID route parameter format enforcement passed");

  // 5. Query Parameter Schema Validation & SQL Injection in Query Strings
  const validQuery = { status: "CONFIRMED", date: "2026-08-25" };
  assert.strictEqual(listVisitsQuerySchema.safeParse(validQuery).success, true, "Valid status & date must pass");

  const sqlInjectionInStatus = { status: "CONFIRMED' OR 1=1--" };
  assert.strictEqual(
    listVisitsQuerySchema.safeParse(sqlInjectionInStatus).success,
    false,
    "SQL injection payload in status enum must be rejected by validation schema"
  );

  const invalidDateFormat = { date: "25-08-2026; DROP TABLE visits;" };
  assert.strictEqual(
    listVisitsQuerySchema.safeParse(invalidDateFormat).success,
    false,
    "Malformed date query parameter must be rejected by validation schema"
  );
  console.log("  ✔ Query parameter schema validation & SQL injection prevention in filters passed");

  // 6. Source-code Parameterized Query Audit Check
  const fs = require("fs");
  const path = require("path");

  function scanRoutesForSqlConcatenation(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        scanRoutesForSqlConcatenation(fullPath);
      } else if (file.isFile() && file.name.endsWith(".routes.ts")) {
        const content = fs.readFileSync(fullPath, "utf8");
        // Ensure no template literal interpolation inside query("... ${...} ...")
        const dangerousQueryPattern = /query\s*\(\s*`[^`]*\$\{/g;
        const matches = content.match(dangerousQueryPattern);
        assert.strictEqual(
          matches,
          null,
          `Dangerous SQL string interpolation detected in ${file.name}: ${matches}`
        );
      }
    }
  }

  scanRoutesForSqlConcatenation(path.join(__dirname, "..", "src", "modules"));
  console.log("  ✔ Static analysis audit: Zero dynamic SQL string interpolations found across all routes");

  console.log("✅ All injection-defense tests passed successfully!\n");
}

runInjectionDefenseTests().catch((err) => {
  console.error("❌ Injection defense test failed:", err);
  process.exit(1);
});
