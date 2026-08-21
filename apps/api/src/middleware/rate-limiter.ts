import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, message = "Too many requests, please try again later." } = options;
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
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = hits.get(ip);

    if (!record || now > record.resetTime) {
      hits.set(ip, { count: 1, resetTime: now + windowMs });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    if (record.count >= max) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retryAfterSec,
      });
    }

    record.count += 1;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", max - record.count);
    return next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 auth attempts per minute
  message: "Too many authentication attempts. Please try again after 60 seconds.",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 150, // max 150 requests per minute
  message: "Rate limit exceeded. Please slow down your requests.",
});
