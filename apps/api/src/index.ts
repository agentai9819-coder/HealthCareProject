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

const app = express();

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

app.use(express.json());

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

// Customer Endpoints
app.use("/api/v1/customers/me/addresses", addressesRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/bookings", bookingsRouter);

// Phase 2H: Staff & Admin Endpoints
app.use("/api/v1/staff/visits", staffVisitsRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/admin/staff", adminStaffRouter);
app.use("/api/v1/admin/visits", adminVisitsRouter);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});