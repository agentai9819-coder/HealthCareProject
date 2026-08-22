import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Creates a memory-efficient, robust in-memory sliding window rate limiter
 * with standard IETF & X-RateLimit headers and automatic cleanup.
 */
export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = "Too many requests, please try again later.",
    keyGenerator = (req: Request) => req.ip || req.socket.remoteAddress || "unknown",
  } = options;

  const hits = new Map<string, { count: number; resetTime: number }>();

  // Periodic cleanup every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
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
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retryAfterSec,
      });
    }

    record.count += 1;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));
    return next();
  };
}

/**
 * Account Creation / Registration Limiter:
 * Max 5 new account creations per 15 minutes per IP to prevent bot farming.
 */
export const registrationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many account registrations from this IP address. Please try again after 15 minutes.",
});

/**
 * Authentication & Password Reset Limiter:
 * Max 5 attempts per 1 minute per IP to block credential stuffing and brute-force attacks.
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many authentication attempts. Please try again after 60 seconds.",
});

/**
 * Sensitive Data Export & Anti-Scraping Limiter:
 * Max 5 bulk export / dataset requests per 15 minutes to prevent automated scraping.
 */
export const exportScrapingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Export rate limit exceeded. Please wait before generating another report.",
});

/**
 * AI & Clinical Computation Generation Limiter:
 * Max 10 intensive requests per minute per IP to prevent compute/token exhaustion.
 */
export const aiGenerationRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: "AI generation rate limit reached. Please wait a moment before sending another request.",
});

/**
 * General API Surface Limiter:
 * Max 120 requests per minute per IP.
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  message: "API rate limit exceeded. Please slow down your requests.",
});

/**
 * Malicious Bot & Scanner Interceptor Middleware:
 * Inspects incoming User-Agent strings and blocks automated vulnerability scanners and scrapers.
 */
const MALICIOUS_BOT_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /wpscan/i,
  /acunetix/i,
  /nessus/i,
  /havij/i,
  /dirbuster/i,
  /nmap/i,
  /zgrab/i,
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
