# 01. Pre-Launch Security & Hardening Playbook

This document contains copy-paste ready implementations of the **complete 36-Point Vibe-Coded App Security Checklist** and **20 Essential Pre-Launch Guardrails** — covering OWASP Top 10, input validation, IDOR, anti-bot abuse protection, HTTPS transport enforcement, structured logging, safe file uploads, webhook verification, and AI cost/injection caps.

---

## 1. Express Security Headers & Helmet

Install: `npm install helmet --workspace=apps/api`

In `apps/api/src/index.ts`:
```typescript
import express from "express";
import helmet from "helmet";

const app = express();

app.disable("x-powered-by");

// Express Security Headers via Helmet & Strict Custom Policies
app.use(helmet());
app.use((_req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// JSON body limits preventing Denial-of-Service / large payload attacks
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
```

---

## 2. Multi-Tier Rate Limiter & Anti-Bot / Anti-Scraping Defense

Create `apps/api/src/middleware/rate-limiter.ts`:
```typescript
import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = "Too many requests, please try again later.",
    keyGenerator = (req) => req.ip || req.socket.remoteAddress || "unknown",
  } = options;

  const hits = new Map<string, { count: number; resetTime: number }>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) hits.delete(key);
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const record = hits.get(key);

    if (!record || now > record.resetTime) {
      hits.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000));
      return next();
    }

    if (record.count >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      res.setHeader("Retry-After", retryAfterSec);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));
      return res.status(429).json({ success: false, error: message, retryAfter: retryAfterSec });
    }

    record.count += 1;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));
    return next();
  };
}

// --- Specialized Limiters ---
export const registrationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, max: 5,
  message: "Too many registrations from this IP. Try again after 15 minutes.",
});
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, max: 5,
  message: "Too many authentication attempts. Try again in 60 seconds.",
});
export const exportScrapingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, max: 5,
  message: "Export rate limit exceeded. Wait before generating another report.",
});
export const aiGenerationRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, max: 10,
  message: "AI generation rate limit reached. Please wait before sending another request.",
});
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, max: 120,
  message: "API rate limit exceeded. Please slow down your requests.",
});

// --- Malicious Bot & Scanner Interceptor ---
const MALICIOUS_BOT_PATTERNS = [
  /sqlmap/i, /nikto/i, /masscan/i, /wpscan/i, /acunetix/i,
  /nessus/i, /havij/i, /dirbuster/i, /nmap/i, /zgrab/i,
];

export function botDetectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers["user-agent"] || "";
  for (const pattern of MALICIOUS_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Automated security scanner or malicious script signature detected.",
      });
    }
  }
  next();
}
```

---

## 3. HTTPS Transport Enforcement & Request ID Correlation

Create `apps/api/src/middleware/security-transport.ts`:
```typescript
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../lib/logger";

// Attach unique X-Request-ID to every request for end-to-end tracing
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers["x-request-id"] as string) || uuidv4();
  (req as any).id = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
}

// Redirect HTTP → HTTPS in production with 301 Permanent Redirect
export function enforceHttpsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === "production") {
    const isHttps = req.secure
      || req.headers["x-forwarded-proto"] === "https"
      || req.headers["x-forwarded-ssl"] === "on";
    if (!isHttps && req.headers.host) {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  }
  next();
}

// Detect & log suspicious traffic patterns automatically on response finish
export function securityAuditMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  res.on("finish", () => {
    const { statusCode } = res;
    const meta = {
      ip, path: req.originalUrl || req.url, method: req.method,
      statusCode, details: { durationMs: Date.now() - startTime },
    };
    if (statusCode === 429) logger.security("RATE_LIMIT_EXCEEDED", `Rate limit hit on ${req.method} ${req.originalUrl}`, meta);
    else if (statusCode === 403) logger.security("ACCESS_FORBIDDEN", `Forbidden attempt on ${req.method} ${req.originalUrl}`, meta);
    else if (statusCode === 401 && req.url.includes("login")) logger.security("AUTH_LOGIN_FAILED", `Failed login on ${req.originalUrl} from ${ip}`, meta);
    else if (statusCode >= 500) logger.error("API_SERVER_ERROR", `HTTP ${statusCode} on ${req.method} ${req.originalUrl}`, meta);
  });
  next();
}
```

---

## 4. Structured JSON Security Logger with PII / Healthcare Redaction

Create `apps/api/src/lib/logger.ts`:
```typescript
export type LogLevel = "info" | "warn" | "error" | "security";

const SENSITIVE_KEYS = new Set([
  "password", "newpassword", "currentpassword", "confirmpassword", "token", "tokenhash",
  "secret", "session_secret", "cookie", "authorization", "customerintakenotes", "staffnotes",
]);

export function sanitizeLogData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") {
    if (data.length > 50 && /^[a-f0-9]+$/i.test(data)) return `${data.substring(0, 4)}...[REDACTED]`;
    return data;
  }
  if (Array.isArray(data)) return data.map(sanitizeLogData);
  if (typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "[REDACTED]" : sanitizeLogData(v);
    }
    return out;
  }
  return data;
}

export const logger = {
  log(payload: Record<string, unknown>) {
    const entry = {
      timestamp: new Date().toISOString(),
      ...payload,
      details: payload.details ? sanitizeLogData(payload.details) : undefined,
    };
    const str = JSON.stringify(entry);
    if (payload.level === "error") console.error(str);
    else if (payload.level === "warn" || payload.level === "security") console.warn(str);
    else console.log(str);
    return entry;
  },
  info:     (event: string, message: string, meta?: object) => logger.log({ level: "info",     event, message, ...meta }),
  warn:     (event: string, message: string, meta?: object) => logger.log({ level: "warn",     event, message, ...meta }),
  error:    (event: string, message: string, meta?: object) => logger.log({ level: "error",    event, message, ...meta }),
  security: (event: string, message: string, meta?: object) => logger.log({ level: "security", event, message, ...meta }),
};
```

---

## 5. Input Validation, XSS Sanitization & Formula Injection Defense

In `packages/validation/src/index.ts`:
```typescript
import { z } from "zod";

// XSS: Strip script tags, HTML tags, and control characters
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

// CWE-1236: Prefix formula-trigger characters for Excel/CSV export safety
export function sanitizeFormulaCell(val: string): string {
  const triggers = ["=", "+", "-", "@", "\t", "\r"];
  return triggers.some((t) => val.startsWith(t)) ? `'${val}` : val;
}

// UUID path parameter validator middleware
import { Request, Response, NextFunction } from "express";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validateUuidParam(...params: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const param of params) {
      if (!UUID_REGEX.test(req.params[param] || "")) {
        return res.status(400).json({ success: false, error: `Invalid ${param} parameter` });
      }
    }
    next();
  };
}

// Apply sanitization transforms to all user-facing string schemas:
export const nameSchema = z.string().min(1).max(100).transform(sanitizeText);
```

---

## 6. IDOR / Multi-Tenant Ownership & Server-Side Pricing Invariants

**Rule 1: IDOR Protection**
Every database query on a user-owned resource MUST include the session owner's ID in the SQL query:
```typescript
// ✅ CORRECT: Enforces ownership at DB level
const result = await query(
  "SELECT * FROM addresses WHERE id = $1 AND customer_id = $2",
  [req.params.id, req.session.customerId]
);
if (result.rows.length === 0) return res.status(404).json({ success: false, error: "Not found" });
```

**Rule 2: Server-Side Pricing & Entitlements**
Never accept pricing, discounts, or subscription tiers from client request bodies:
```typescript
// ❌ INSECURE: Trusting price from frontend
const { serviceId, price } = req.body;
await createBooking({ serviceId, amountCharged: price });

// ✅ SECURE: Fetch true price from authoritative database table inside transaction
const service = await query("SELECT price FROM services WHERE id = $1", [serviceId]);
await createBooking({ serviceId, amountCharged: service.rows[0].price });
```

---

## 7. Account Lockout & Brute-Force Defense Pattern

Mitigate credential stuffing and password brute forcing using database attempt counters:
```typescript
// Migration columns: failed_login_attempts INT DEFAULT 0, locked_until TIMESTAMP NULL

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
  const remainingMin = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 60000);
  return res.status(423).json({
    success: false,
    error: `Account is temporarily locked. Try again in ${remainingMin} minutes.`,
  });
}

const isValid = await verifyPassword(password, user.password_hash);
if (!isValid) {
  const attempts = (user.failed_login_attempts || 0) + 1;
  const lockedUntil = attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;
  await query(
    "UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3",
    [attempts, lockedUntil, user.id]
  );
  return res.status(401).json({ success: false, error: "Invalid email or password" });
}

// On successful login: reset counter
await query("UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1", [user.id]);
```

---

## 8. Webhook Signature Verification (Stripe / Razorpay / HMAC)

Never trust incoming webhooks without cryptographic signature validation:
```typescript
import crypto from "crypto";

// Generic HMAC Webhook Validator
export function verifyWebhookSignature(
  rawPayload: string | Buffer,
  signatureHeader: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawPayload)
    .digest("hex");

  const sigBuffer = Buffer.from(signatureHeader, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (sigBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

// In Express: Mount raw-body parser specifically for webhook routes BEFORE json middleware
// app.post("/api/v1/webhooks/stripe", express.raw({ type: "application/json" }), handleWebhook);
```

---

## 9. Safe File Uploads & MIME Whitelisting (Anti-Malware & Path Traversal)

For apps handling file/avatar uploads:
```typescript
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateUploadFile(file: { mimetype: string; size: number; originalname: string }) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WEBP, and PDF files are permitted.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum allowed limit of 5MB.");
  }

  // Prevent path traversal by generating random filename & discarding client filename
  const extension = path.extname(file.originalname).toLowerCase();
  const safeFilename = `${crypto.randomBytes(16).toString("hex")}${extension}`;
  return { safeFilename };
}
```

---

## 10. AI / LLM Guardrails, Cost Caps & Prompt Injection Defense

For apps integrating OpenAI / Anthropic / Gemini:
```typescript
import { aiGenerationRateLimiter } from "./middleware/rate-limiter";

// 1. Input Sanitization for LLM Prompts (Neutralize delimiter hijacking)
export function sanitizePromptInput(userInput: string, maxChars = 2000): string {
  return userInput
    .slice(0, maxChars)
    .replace(/```/g, "")
    .replace(/<\|im_start\|>/gi, "")
    .replace(/<\|im_end\|>/gi, "")
    .replace(/\[INST\]/gi, "")
    .replace(/\[\/INST\]/gi, "")
    .trim();
}

// 2. Strict Token & Cost Caps in API parameters
export const SAFE_AI_COMPLETION_PARAMS = {
  max_tokens: 500,        // Cap maximum response length
  temperature: 0.2,       // Low randomness for structured outputs
  timeout: 10_000,        // 10 second circuit breaker
};
```

---

## 11. Production Source Maps & Debug Disabling

In `apps/web/next.config.ts`:
```typescript
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Explicitly disable source maps in production to prevent source code exposure
  productionBrowserSourceMaps: false,
  compiler: {
    // Strip client console logs in production builds
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};
```

---

## 12. Complete 40-Point Pre-Launch Security Checklist (Copy & Tick)

```
Secrets & Environments
  [ ] No secrets in NEXT_PUBLIC_* env vars
  [ ] SESSION_SECRET placeholder rejected in production
  [ ] .gitignore excludes *.pem, *.key, *.cert, *.secret, .env.local, .env.production
  [ ] productionBrowserSourceMaps: false in next.config.ts
  [ ] Staging environments password-protected or restricted to private VPN

Authentication & Sessions
  [ ] Bcrypt 12+ salt rounds
  [ ] Session regenerated on login (session fixation defense)
  [ ] Session destroyed & cookie cleared on password change & password reset
  [ ] Constant-time DUMMY_HASH comparison (timing attack defense)
  [ ] Identical error message for wrong email & wrong password (enumeration defense)
  [ ] Password reset tokens: SHA-256 hashed in DB, 15-minute expiry, single-use
  [ ] Session cookies: httpOnly: true, sameSite: strict, secure: true (in production)

Transport & Security Headers
  [ ] Helmet.js mounted & x-powered-by disabled
  [ ] HSTS: max-age=63072000; includeSubDomains; preload
  [ ] CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy set
  [ ] HTTP → HTTPS redirect (enforceHttpsMiddleware) in production
  [ ] X-Request-ID correlation header on all responses

Input Validation & Injection Prevention
  [ ] express.json({ limit: "100kb" }) DoS protection
  [ ] validateUuidParam middleware on all :id routes
  [ ] Zod schemas validate all request bodies and query parameters
  [ ] sanitizeText applied to all user-facing string inputs (XSS defense)
  [ ] sanitizeFormulaCell applied to all CSV/Excel exports (CWE-1236)
  [ ] Parameterized SQL queries only (zero template-literal interpolations)

Authorization & Data Integrity
  [ ] Every user-owned query filters by session owner ID (IDOR defense)
  [ ] Admin routes re-verify role in DB (never trust request body/header)
  [ ] Prices & entitlements calculated strictly server-side from database
  [ ] Sensitive fields (staff notes, PII) redacted from customer responses

Abuse, Bots & Cost Protection
  [ ] botDetectionMiddleware blocks known scanners (sqlmap, nikto, masscan)
  [ ] Multi-tier rate limiters (auth, register, export, api, ai)
  [ ] AI prompts sanitized and max_tokens hard-capped
  [ ] File uploads validate MIME types and randomize filenames

Logging & Observability
  [ ] Structured JSON logger (no raw console.error/console.log in routes)
  [ ] sanitizeLogData auto-redacts passwords, tokens, clinical notes
  [ ] Security audit middleware logs 401, 403, 429, 500 events
  [ ] Error responses return generic messages (no stack traces leaked)
```
