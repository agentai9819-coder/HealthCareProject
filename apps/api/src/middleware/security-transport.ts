import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../lib/logger";

/**
 * Attaches a unique Correlation / Request ID to every incoming HTTP request.
 * Sets the 'X-Request-ID' header on both request and response for end-to-end tracing.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const existingId = req.headers["x-request-id"] as string | undefined;
  const requestId = existingId || uuidv4();

  (req as unknown as { id: string }).id = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
}

/**
 * Enforces HTTPS in production environments by redirecting unencrypted HTTP requests
 * with a 301 Permanent Redirect, respecting TLS termination proxies (e.g. Vercel, AWS ALB).
 */
export function enforceHttpsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === "production") {
    const isHttps =
      req.secure ||
      req.headers["x-forwarded-proto"] === "https" ||
      req.headers["x-forwarded-ssl"] === "on";

    if (!isHttps) {
      const host = req.headers.host;
      if (host) {
        return res.redirect(301, `https://${host}${req.url}`);
      }
    }
  }

  next();
}

/**
 * Observability middleware that automatically detects and logs suspicious traffic patterns:
 * - 429 Rate Limit Throttling
 * - 403 Forbidden / Access Denied & Bot Blocks
 * - 401 Unauthorized Authentication Failures
 * - 500 Internal Server Errors
 */
export function securityAuditMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = (req as unknown as { id?: string }).id || (req.headers["x-request-id"] as string);
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  res.on("finish", () => {
    const statusCode = res.statusCode;
    const durationMs = Date.now() - startTime;
    const userId = req.session?.customerId || req.session?.staffId;
    const role = req.session?.staffRole || (req.session?.customerId ? "CUSTOMER" : undefined);

    const logMeta = {
      requestId,
      ip,
      userId,
      role,
      path: req.originalUrl || req.url,
      method: req.method,
      statusCode,
      details: {
        durationMs,
        userAgent: req.headers["user-agent"],
      },
    };

    if (statusCode === 429) {
      logger.security(
        "SUSPICIOUS_RATE_LIMIT_EXCEEDED",
        `Rate limit exceeded on ${req.method} ${req.originalUrl || req.url} from IP ${ip}`,
        logMeta
      );
    } else if (statusCode === 403) {
      logger.security(
        "SUSPICIOUS_ACCESS_FORBIDDEN",
        `Forbidden access attempt on ${req.method} ${req.originalUrl || req.url} from IP ${ip}`,
        logMeta
      );
    } else if (statusCode === 401 && req.url.includes("/login")) {
      logger.security(
        "AUTH_LOGIN_FAILED",
        `Failed login attempt on ${req.originalUrl || req.url} from IP ${ip}`,
        logMeta
      );
    } else if (statusCode >= 500) {
      logger.error(
        "API_SERVER_ERROR",
        `HTTP ${statusCode} Server Error on ${req.method} ${req.originalUrl || req.url}`,
        logMeta
      );
    }
  });

  next();
}
