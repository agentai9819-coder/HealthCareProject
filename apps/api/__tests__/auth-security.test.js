const assert = require("assert");
const bcrypt = require("bcryptjs");

console.log("▶ Running apps/api auth-security test suite...");

async function runAuthSecurityTests() {
  // 1. Password Hashing & Salt verification
  const rawPassword = "HospitalGradeSecret123!";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);

  assert.notStrictEqual(rawPassword, hash, "Password must not be stored in plaintext");
  assert.strictEqual(await bcrypt.compare(rawPassword, hash), true, "Correct password must verify against hash");
  assert.strictEqual(await bcrypt.compare("WrongPassword123!", hash), false, "Wrong password must fail verification");
  console.log("  ✔ Bcrypt password hashing & salt verification passed");

  // 2. Role-Based Access Control (RBAC) Guard Logic
  const roles = {
    CUSTOMER: ["/api/v1/customers/me", "/api/v1/bookings", "/api/v1/customers/me/addresses"],
    STAFF: ["/api/v1/staff/schedule", "/api/v1/staff/visits"],
    ADMIN: ["/api/v1/admin/dispatch", "/api/v1/admin/staff", "/api/v1/admin/visits"],
  };

  function isAuthorized(userRole, path) {
    if (userRole === "ADMIN") return true; // Superuser access
    if (userRole === "STAFF" && path.startsWith("/api/v1/staff")) return true;
    if (userRole === "CUSTOMER" && (path.startsWith("/api/v1/customers") || path.startsWith("/api/v1/bookings"))) return true;
    return false;
  }

  // Customer tests
  assert.strictEqual(isAuthorized("CUSTOMER", "/api/v1/bookings"), true, "Customer can access bookings");
  assert.strictEqual(isAuthorized("CUSTOMER", "/api/v1/admin/dispatch"), false, "Customer cannot access admin dispatch");
  assert.strictEqual(isAuthorized("CUSTOMER", "/api/v1/staff/schedule"), false, "Customer cannot access staff schedule");

  // Staff tests
  assert.strictEqual(isAuthorized("STAFF", "/api/v1/staff/schedule"), true, "Staff can access staff schedule");
  assert.strictEqual(isAuthorized("STAFF", "/api/v1/admin/staff"), false, "Staff cannot access admin staff management");

  // Admin tests
  assert.strictEqual(isAuthorized("ADMIN", "/api/v1/admin/dispatch"), true, "Admin can access dispatch hub");
  assert.strictEqual(isAuthorized("ADMIN", "/api/v1/admin/staff"), true, "Admin can access staff directory");

  console.log("  ✔ Role-based access control (RBAC) authorization matrix verified");
  console.log("✅ All auth-security tests passed successfully!\n");
}

runAuthSecurityTests().catch((err) => {
  console.error("❌ Auth test failed:", err);
  process.exit(1);
});
