import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgStore = connectPgSimple(session);

export const pgStore = new PgStore({
  pool,
  tableName: "sessions",
  createTableIfMissing: false,
});