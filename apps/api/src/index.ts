import express from "express";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import { env } from "home-healthcare-config";
import { pgStore } from "./lib/session";
import { customersRouter } from "./modules/customers/customers.routes";
import { servicesRouter } from "./modules/services/services.routes";
import { bookingsRouter } from "./modules/bookings/bookings.routes";
import { addressesRouter } from "./modules/addresses/addresses.routes";
import { staffRouter } from "./modules/staff/staff.routes";
import { adminStaffRouter } from "./modules/staff/admin.routes";
import { staffVisitsRouter, adminVisitsRouter } from "./modules/visits/visits.routes";
import { apiRateLimiter, authRateLimiter } from "./middleware/rate-limiter";

const app = express();

app.disable("x-powered-by");

// Global Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(
  compression({
    threshold: 1024,
  }) as unknown as express.RequestHandler
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === env.CORS_ORIGIN ||
        (env.NODE_ENV === "development" && /^http:\/\/localhost:(3000|3001|3002|3003)$/.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    maxAge: 86400,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.use(
  session({
    secret: env.SESSION_SECRET,
    store: pgStore,
    resave: false,
    saveUninitialized: false,
    name: "session_id",
    cookie: {
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
      secure: env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    },
  }) as unknown as express.RequestHandler
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rate limiting & Bot Protection
app.use("/api/v1", apiRateLimiter);
app.use("/api/v1/customers/register", authRateLimiter);
app.use("/api/v1/customers/login", authRateLimiter);
app.use("/api/v1/staff/login", authRateLimiter);

// Customer Endpoints
app.use("/api/v1/customers/me/addresses", addressesRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/bookings", bookingsRouter);

// Staff & Admin Endpoints
app.use("/api/v1/staff/visits", staffVisitsRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/admin/staff", adminStaffRouter);
app.use("/api/v1/admin/visits", adminVisitsRouter);

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

export default app;
export { app };