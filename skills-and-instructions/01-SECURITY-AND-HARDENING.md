# 01. Pre-Launch Security & Hardening Playbook

This document contains copy-paste ready implementations of the **20-Point Pre-Launch Security Checklist** and **Aikido / OWASP Top 10 Defenses**.

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

// JSON body limits preventing denial-of-service
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
```

---

## 2. In-Memory Sliding-Window Rate Limiter (Zero Dependency)

Create `apps/api/src/middleware/rate-limiter.ts`:
```typescript
import { Request, Response, NextFunction } from "express";

interface RateLimitRecord {
  timestamps: number[];
}

export function createSlidingWindowRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) {
  const store = new Map<string, RateLimitRecord>();

  // Periodically clean up stale IP entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);
      if (record.timestamps.length === 0) store.delete(key);
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
    const now = Date.now();

    let record = store.get(ip);
    if (!record) {
      record = { timestamps: [] };
      store.set(ip, record);
    }

    record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);

    if (record.timestamps.length >= options.maxRequests) {
      const oldest = record.timestamps[0];
      const retryAfterSec = Math.ceil((oldest + options.windowMs - now) / 1000);
      res.setHeader("Retry-After", Math.max(1, retryAfterSec));
      return res.status(429).json({
        success: false,
        error: options.message || "Too many requests. Please try again later.",
      });
    }

    record.timestamps.push(now);
    next();
  };
}

export const authRateLimiter = createSlidingWindowRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: "Too many login attempts. Please wait 1 minute before trying again.",
});

export const apiRateLimiter = createSlidingWindowRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 150,
  message: "API rate limit exceeded. Please slow down.",
});
```

---

## 3. Login Timing Attack & Account Enumeration Defense

In your login route (e.g. `customers.routes.ts`):
```typescript
import { hashPassword, verifyPassword } from "../../lib/bcrypt";

// Constant-time dummy hash: Prevents attackers measuring response time to guess valid user emails
const DUMMY_HASH = "$2a$10$e8w6lqQ9yWvX6a4N7uGZMeYqUu7oW2e8w6lqQ9yWvX6a4N7uGZMe";

router.post("/login", authRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);

  if (!user) {
    // Perform constant-time dummy verification
    await verifyPassword(password, DUMMY_HASH);
    return res.status(401).json({ success: false, error: "Invalid email or password" });
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ success: false, error: "Invalid email or password" });
  }

  req.session.userId = user.id;
  return res.json({ success: true, data: { user } });
});
```

---

## 4. Package CVE Overrides (`package.json`)

Always add these overrides in the root `package.json` to prevent Aikido / Snyk / Dependabot CVE warnings:
```json
{
  "overrides": {
    "zod": "^3.24.2",
    "uuid": "^11.1.1",
    "postcss": "^8.5.26",
    "sharp": "^0.35.3",
    "raw-body": "^2.5.2",
    "body-parser": "^1.20.3",
    "exceljs": {
      "uuid": "^11.1.1"
    }
  }
}
```

---

## 5. PostgreSQL Strict TLS Peer Verification & Circuit Breaker

In `apps/api/src/lib/db.ts`:
```typescript
import { Pool, PoolConfig } from "pg";

const isCloudOrProduction =
  process.env.NODE_ENV === "production" ||
  (Boolean(process.env.DATABASE_URL) &&
    (process.env.DATABASE_URL.includes("neon.tech") ||
      process.env.DATABASE_URL.includes("supabase.co") ||
      process.env.DATABASE_URL.includes("aws.com") ||
      process.env.DATABASE_URL.includes("render.com") ||
      process.env.DATABASE_URL.includes("railway.app")));

function getDatabaseSslConfig(): PoolConfig["ssl"] {
  if (!isCloudOrProduction) {
    return undefined;
  }

  // If a custom CA certificate is provided, verify against that certificate authority
  if (process.env.DB_CA_CERT) {
    return {
      ca: process.env.DB_CA_CERT,
      rejectUnauthorized: true,
    };
  }

  // Development bypass strictly for local self-signed dev proxies if explicitly requested
  if (process.env.NODE_ENV !== "production" && process.env.DB_ALLOW_SELF_SIGNED === "true") {
    return { rejectUnauthorized: false };
  }

  // Production and Cloud default: Strict TLS Peer Certificate Verification against system trust store
  return {
    rejectUnauthorized: true,
  };
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
  statement_timeout: 10000,
  ssl: getDatabaseSslConfig(),
});
```
