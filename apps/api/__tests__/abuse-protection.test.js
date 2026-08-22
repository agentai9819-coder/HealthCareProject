const assert = require("assert");
const {
  createRateLimiter,
  registrationRateLimiter,
  authRateLimiter,
  exportScrapingLimiter,
  aiGenerationRateLimiter,
  apiRateLimiter,
  botDetectionMiddleware,
} = require("../dist/middleware/rate-limiter");

console.log("▶ Running apps/api abuse-protection & anti-bot test suite...");

function createMockReqRes(ip = "192.168.1.100", userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)") {
  const req = {
    ip,
    socket: { remoteAddress: ip },
    headers: { "user-agent": userAgent },
  };

  const headers = {};
  let statusCode = 200;
  let responseData = null;

  const res = {
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
    getHeader(name) {
      return headers[name.toLowerCase()];
    },
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => headers,
  };

  return { req, res };
}

async function runAbuseProtectionTests() {
  // 1. Sliding-Window Rate Limiter Engine & 429 Throttle Verification
  const testLimiter = createRateLimiter({
    windowMs: 5000,
    max: 3,
    message: "Custom test rate limit message",
  });

  let nextCalled = 0;
  const testIp = "10.0.0.42";

  // Request 1
  const reqRes1 = createMockReqRes(testIp);
  testLimiter(reqRes1.req, reqRes1.res, () => nextCalled++);
  assert.strictEqual(nextCalled, 1, "First request must pass");
  assert.strictEqual(reqRes1.res.getHeader("x-ratelimit-remaining"), 2);

  // Request 2
  const reqRes2 = createMockReqRes(testIp);
  testLimiter(reqRes2.req, reqRes2.res, () => nextCalled++);
  assert.strictEqual(nextCalled, 2, "Second request must pass");
  assert.strictEqual(reqRes2.res.getHeader("x-ratelimit-remaining"), 1);

  // Request 3
  const reqRes3 = createMockReqRes(testIp);
  testLimiter(reqRes3.req, reqRes3.res, () => nextCalled++);
  assert.strictEqual(nextCalled, 3, "Third request must pass");
  assert.strictEqual(reqRes3.res.getHeader("x-ratelimit-remaining"), 0);

  // Request 4 (Limit Exceeded -> 429)
  const reqRes4 = createMockReqRes(testIp);
  let nextCalledOnExceeded = false;
  testLimiter(reqRes4.req, reqRes4.res, () => {
    nextCalledOnExceeded = true;
  });

  assert.strictEqual(nextCalledOnExceeded, false, "Throttled request must NOT call next()");
  assert.strictEqual(reqRes4.res.getStatusCode(), 429, "Throttled request must return 429 Too Many Requests");
  assert.strictEqual(reqRes4.res.getData().success, false);
  assert.strictEqual(reqRes4.res.getData().error, "Custom test rate limit message");
  assert.ok(reqRes4.res.getHeader("retry-after") >= 1, "Retry-After header must be >= 1");
  console.log("  ✔ Sliding-window rate limiter engine & HTTP 429 throttle response passed");

  // 2. IP Isolation in Rate Limiting
  const differentIpReqRes = createMockReqRes("10.0.0.99");
  let diffIpNextCalled = false;
  testLimiter(differentIpReqRes.req, differentIpReqRes.res, () => {
    diffIpNextCalled = true;
  });
  assert.strictEqual(diffIpNextCalled, true, "Requests from different IPs must be tracked independently");
  console.log("  ✔ Multi-tenant IP rate limit isolation passed");

  // 3. Malicious Bot & Vulnerability Scanner Interception
  const attackToolUserAgents = [
    "sqlmap/1.6#stable (https://sqlmap.org)",
    "Mozilla/5.0 (compatible; Nikto/2.1.6)",
    "masscan/1.0 (https://github.com/robertdavidgraham/masscan)",
    "WPScan v3.8.22",
    "Acunetix Web Vulnerability Scanner v14",
    "Nessus Vulnerability Scanner",
    "DirBuster-1.0-RC1",
    "Nmap Scripting Engine",
  ];

  for (const botAgent of attackToolUserAgents) {
    const botReqRes = createMockReqRes("198.51.100.2", botAgent);
    let botNextCalled = false;
    botDetectionMiddleware(botReqRes.req, botReqRes.res, () => {
      botNextCalled = true;
    });

    assert.strictEqual(botNextCalled, false, `Bot '${botAgent}' must be blocked`);
    assert.strictEqual(botReqRes.res.getStatusCode(), 403, "Blocked bot must receive 403 Forbidden");
    assert.strictEqual(botReqRes.res.getData().success, false);
  }

  // Legitimate browser user agent must pass
  const legitReqRes = createMockReqRes("198.51.100.2", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36");
  let legitNextCalled = false;
  botDetectionMiddleware(legitReqRes.req, legitReqRes.res, () => {
    legitNextCalled = true;
  });
  assert.strictEqual(legitNextCalled, true, "Legitimate browser User-Agent must pass bot detection");
  console.log("  ✔ Anti-bot & vulnerability scanner signature blocking (403 Forbidden) passed");

  // 4. Verification of Export Scraping & AI Generation Limiters
  assert.strictEqual(typeof exportScrapingLimiter, "function", "exportScrapingLimiter middleware must be a function");
  assert.strictEqual(typeof registrationRateLimiter, "function", "registrationRateLimiter middleware must be a function");
  assert.strictEqual(typeof authRateLimiter, "function", "authRateLimiter middleware must be a function");
  assert.strictEqual(typeof aiGenerationRateLimiter, "function", "aiGenerationRateLimiter middleware must be a function");
  assert.strictEqual(typeof apiRateLimiter, "function", "apiRateLimiter middleware must be a function");
  console.log("  ✔ All 5 tiered rate limiting middleware instances verified");

  console.log("✅ All abuse-protection & anti-bot tests passed successfully!\n");
}

runAbuseProtectionTests().catch((err) => {
  console.error("❌ Abuse protection test failed:", err);
  process.exit(1);
});
