import { Pool } from "pg";
import { env } from "home-healthcare-config";
export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
pool.on("error", (err) => {
    console.error("Unexpected database pool error:", err);
});
export const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text: text.substring(0, 100), duration, rows: res.rowCount });
    return res;
};
