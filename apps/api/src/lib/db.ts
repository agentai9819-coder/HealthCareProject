import { Pool, PoolConfig } from "pg";
import { env } from "home-healthcare-config";

const isCloudOrProduction =
  env.NODE_ENV === "production" ||
  (Boolean(env.DATABASE_URL) &&
    (env.DATABASE_URL.includes("sslmode=require") ||
      env.DATABASE_URL.includes("neon.tech") ||
      env.DATABASE_URL.includes("supabase.co") ||
      env.DATABASE_URL.includes("aws.com") ||
      env.DATABASE_URL.includes("render.com") ||
      env.DATABASE_URL.includes("railway.app")));

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
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
  statement_timeout: 10000, // 10s timeout accommodating cloud network hops
  ssl: getDatabaseSslConfig(),
});

pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
});

// Circuit Breaker State Machine
class DatabaseCircuitBreaker {
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private failureCount = 0;
  private readonly failureThreshold = 5;
  private readonly resetTimeoutMs = 10000;
  private lastFailureTime = 0;

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.state === "OPEN") {
      if (now - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = "HALF_OPEN";
        console.warn("[CircuitBreaker] DB Circuit transitioning to HALF_OPEN (probing)");
      } else {
        throw new Error("DATABASE_CIRCUIT_OPEN: Database service is temporarily unavailable. Fast-failing.");
      }
    }

    try {
      const result = await fn();
      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED";
        this.failureCount = 0;
        console.log("[CircuitBreaker] DB Circuit recovered: CLOSED");
      } else if (this.failureCount > 0) {
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold || this.state === "HALF_OPEN") {
        this.state = "OPEN";
        console.error(`[CircuitBreaker] DB Circuit TRIPPED to OPEN (${this.failureCount} consecutive failures)`);
      }
      throw err;
    }
  }

  public getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

export const dbCircuitBreaker = new DatabaseCircuitBreaker();

export const query = async (text: string, params?: unknown[]) => {
  return dbCircuitBreaker.execute(async () => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === "development") {
      console.log("Executed query", { text: text.substring(0, 100), duration, rows: res.rowCount });
    }
    return res;
  });
};