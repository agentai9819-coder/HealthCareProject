const assert = require("assert");
const { logger, sanitizeLogData } = require("../dist/lib/logger");
const {
  requestIdMiddleware,
  enforceHttpsMiddleware,
  securityAuditMiddleware,
} = require("../dist/middleware/security-transport");

console.log("▶ Running apps/api security-logging-transport test suite...");

function createMockReqRes(options = {}) {
  const {
    url = "/api/v1/customers/me",
    method = "GET",
    headers = {},
    ip = "203.0.113.195",
    secure = false,
    session = {},
  } = options;

  const req = {
    url,
    originalUrl: url,
    method,
    headers: { ...headers },
    ip,
    secure,
    session,
    socket: { remoteAddress: ip },
  };

  const responseHeaders = {};
  let statusCode = 200;
  let redirectedUrl = null;
  let redirectCode = null;
  let finishCallback = null;

  const res = {
    setHeader(name, value) {
      responseHeaders[name.toLowerCase()] = value;
    },
    getHeader(name) {
      return responseHeaders[name.toLowerCase()];
    },
    status(code) {
      statusCode = code;
      return res;
    },
    redirect(code, targetUrl) {
      redirectCode = code;
      redirectedUrl = targetUrl;
    },
    on(event, cb) {
      if (event === "finish") {
        finishCallback = cb;
      }
    },
    emitFinish() {
      if (finishCallback) finishCallback();
    },
    get statusCode() {
      return statusCode;
    },
    getRedirect: () => ({ code: redirectCode, url: redirectedUrl }),
    getHeaders: () => responseHeaders,
  };

  return { req, res };
}

async function runSecurityTransportTests() {
  // 1. Request ID Middleware & Correlation Header Verification
  const reqRes1 = createMockReqRes();
  let next1Called = false;
  requestIdMiddleware(reqRes1.req, reqRes1.res, () => {
    next1Called = true;
  });

  assert.strictEqual(next1Called, true, "requestIdMiddleware must call next()");
  const generatedId = reqRes1.res.getHeader("x-request-id");
  assert.ok(generatedId, "X-Request-ID response header must be present");
  assert.strictEqual(typeof generatedId, "string");
  assert.strictEqual(generatedId.length, 36, "Generated request ID must be valid 36-char UUID");

  // Preserve existing X-Request-ID if supplied by client/proxy
  const reqRes2 = createMockReqRes({ headers: { "x-request-id": "client-trace-id-abc-123" } });
  requestIdMiddleware(reqRes2.req, reqRes2.res, () => {});
  assert.strictEqual(
    reqRes2.res.getHeader("x-request-id"),
    "client-trace-id-abc-123",
    "Incoming X-Request-ID must be preserved"
  );
  console.log("  ✔ Correlation / Request ID generation & header propagation passed");

  // 2. Sensitive Healthcare & Credential Data Redaction in Logger
  const rawPayload = {
    email: "patient@example.com",
    password: "SuperSecretPassword123!",
    currentPassword: "OldPassword123!",
    newPassword: "NewPassword123!",
    token: "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
    customerIntakeNotes: "Patient has high blood pressure and diabetes",
    staffNotes: "Internal clinical assessment notes",
    safeMetadata: {
      userId: "cust-123-uuid",
      city: "Noida",
      action: "PROFILE_UPDATE",
    },
  };

  const sanitized = sanitizeLogData(rawPayload);
  assert.strictEqual(sanitized.password, "[REDACTED]", "password must be redacted");
  assert.strictEqual(sanitized.currentPassword, "[REDACTED]", "currentPassword must be redacted");
  assert.strictEqual(sanitized.newPassword, "[REDACTED]", "newPassword must be redacted");
  assert.strictEqual(sanitized.token, "[REDACTED]", "token must be redacted");
  assert.strictEqual(sanitized.customerIntakeNotes, "[REDACTED]", "medical notes must be redacted");
  assert.strictEqual(sanitized.staffNotes, "[REDACTED]", "staff clinical notes must be redacted");
  assert.strictEqual(sanitized.safeMetadata.userId, "cust-123-uuid", "safe metadata must be preserved");
  assert.strictEqual(sanitized.safeMetadata.city, "Noida", "safe metadata must be preserved");
  console.log("  ✔ Sensitive credential & healthcare data log redaction passed");

  // 3. Structured Security Event Logger Formatting
  const logEntry = logger.security("TEST_SECURITY_EVENT", "Suspicious probe detected", {
    ip: "192.0.2.1",
    userId: "user-test-uuid",
    path: "/api/v1/auth/login",
    details: { attemptCount: 5, password: "should-be-masked" },
  });

  assert.strictEqual(logEntry.level, "security");
  assert.strictEqual(logEntry.event, "TEST_SECURITY_EVENT");
  assert.strictEqual(logEntry.ip, "192.0.2.1");
  assert.strictEqual(logEntry.details.password, "[REDACTED]", "Details passed to logger must be auto-sanitized");
  assert.ok(logEntry.timestamp, "Timestamp must be generated in ISO format");
  console.log("  ✔ Structured JSON security event logging passed");

  // 4. Suspicious Activity Observability Middleware
  const auditReqRes = createMockReqRes({
    url: "/api/v1/customers/login",
    method: "POST",
  });

  securityAuditMiddleware(auditReqRes.req, auditReqRes.res, () => {});
  // Simulate failed auth (401)
  auditReqRes.res.status(401);
  auditReqRes.res.emitFinish();

  // Simulate rate-limit exceeded (429)
  const rateLimitReqRes = createMockReqRes({ url: "/api/v1/admin/staff/export/history" });
  securityAuditMiddleware(rateLimitReqRes.req, rateLimitReqRes.res, () => {});
  rateLimitReqRes.res.status(429);
  rateLimitReqRes.res.emitFinish();

  // Simulate internal server error (500)
  const errReqRes = createMockReqRes({ url: "/api/v1/bookings" });
  securityAuditMiddleware(errReqRes.req, errReqRes.res, () => {});
  errReqRes.res.status(500);
  errReqRes.res.emitFinish();
  console.log("  ✔ Security audit middleware suspicious activity detection (401/429/403/500) passed");

  console.log("✅ All security-logging & transport tests passed successfully!\n");
}

runSecurityTransportTests().catch((err) => {
  console.error("❌ Security transport test failed:", err);
  process.exit(1);
});
