export type LogLevel = "info" | "warn" | "error" | "security";

export interface LogPayload {
  level: LogLevel;
  event: string;
  message: string;
  requestId?: string;
  ip?: string;
  userId?: string;
  role?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  timestamp?: string;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "newpassword",
  "currentpassword",
  "confirmpassword",
  "token",
  "tokenhash",
  "secret",
  "session_secret",
  "cookie",
  "authorization",
  "customerintakenotes",
  "staffnotes",
]);

/**
 * Recursively redacts sensitive healthcare and authentication fields
 * from log payloads to maintain strict privacy and data minimization.
 */
export function sanitizeLogData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Mask potential token or key strings
    if (data.length > 50 && /^[a-f0-9]+$/i.test(data)) {
      return `${data.substring(0, 4)}...[REDACTED]`;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = sanitizeLogData(value);
      }
    }
    return sanitized;
  }

  return data;
}

export const logger = {
  log(payload: LogPayload) {
    const entry: LogPayload = {
      timestamp: payload.timestamp || new Date().toISOString(),
      level: payload.level,
      event: payload.event,
      message: payload.message,
      requestId: payload.requestId,
      ip: payload.ip,
      userId: payload.userId,
      role: payload.role,
      path: payload.path,
      method: payload.method,
      statusCode: payload.statusCode,
      details: payload.details ? (sanitizeLogData(payload.details) as Record<string, unknown>) : undefined,
    };

    const formatted = JSON.stringify(entry);

    if (payload.level === "error") {
      console.error(formatted);
    } else if (payload.level === "warn" || payload.level === "security") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }

    return entry;
  },

  info(event: string, message: string, meta?: Partial<LogPayload>) {
    return this.log({ level: "info", event, message, ...meta });
  },

  warn(event: string, message: string, meta?: Partial<LogPayload>) {
    return this.log({ level: "warn", event, message, ...meta });
  },

  error(event: string, message: string, meta?: Partial<LogPayload>) {
    return this.log({ level: "error", event, message, ...meta });
  },

  security(event: string, message: string, meta?: Partial<LogPayload>) {
    return this.log({ level: "security", event, message, ...meta });
  },
};
