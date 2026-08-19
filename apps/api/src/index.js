import express from "express";
import cors from "cors";
import session from "express-session";
import { env } from "home-healthcare-config";
import { pgStore } from "./lib/session";
import { hashPassword, verifyPassword } from "./lib/bcrypt";
import { pool, query } from "./lib/db";
import { registerSchema, loginSchema, bookingAddressSchema, } from "home-healthcare-validation";
import { v4 as uuidv4 } from "uuid";
const app = express();
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    maxAge: 86400,
}));
app.use(express.json());
app.use(session({
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
}));
const requireAuth = (req, res, next) => {
    if (!req.session.customerId) {
        return res.status(401).json({
            success: false,
            error: "Authentication required",
        });
    }
    next();
};
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.post("/api/v1/customers/register", async (req, res) => {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            success: false,
            error: "Invalid request body",
            details: parseResult.error.format(),
        });
    }
    const { name, email, password } = parseResult.data;
    try {
        const existing = await query("SELECT id FROM customers WHERE email = $1", [
            email,
        ]);
        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: "Email already registered",
            });
        }
        const passwordHash = await hashPassword(password);
        const customerId = uuidv4();
        await query(`INSERT INTO customers (id, name, email, password_hash, bcrypt_salt_rounds)
       VALUES ($1, $2, $3, $4, $5)`, [customerId, name, email, passwordHash, env.BCRYPT_SALT_ROUNDS]);
        req.session.customerId = customerId;
        return res.status(201).json({
            success: true,
            data: {
                customer: {
                    id: customerId,
                    name,
                    email,
                    created_at: new Date().toISOString(),
                },
            },
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            success: false,
            error: "Registration failed",
        });
    }
});
app.post("/api/v1/customers/login", async (req, res) => {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            success: false,
            error: "Invalid request body",
            details: parseResult.error.format(),
        });
    }
    const { identifier, password } = parseResult.data;
    try {
        const result = await query("SELECT id, name, email, password_hash FROM customers WHERE email = $1", [identifier]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }
        const customer = result.rows[0];
        const isValid = await verifyPassword(password, customer.password_hash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }
        req.session.customerId = customer.id;
        return res.json({
            success: true,
            data: {
                customer: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    created_at: new Date().toISOString(),
                },
            },
        });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            error: "Login failed",
        });
    }
});
app.post("/api/v1/customers/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: "Logout failed",
            });
        }
        res.clearCookie("session_id", { path: "/" });
        res.json({ success: true });
    });
});
app.get("/api/v1/services", async (_req, res) => {
    try {
        const result = await query(`SELECT id, name, description, duration_minutes as "durationMinutes", price, created_at as "createdAt"
       FROM services
       ORDER BY created_at ASC`);
        res.json({
            success: true,
            data: result.rows,
        });
    }
    catch (err) {
        console.error("Get services error:", err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch services",
        });
    }
});
app.get("/api/v1/services/:id/slots", async (req, res) => {
    const { id } = req.params;
    try {
        const serviceResult = await query("SELECT id FROM services WHERE id = $1", [
            id,
        ]);
        if (serviceResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Service not found",
            });
        }
        const slotsResult = await query(`SELECT id, start_time as "startTime", end_time as "endTime", is_available as "isAvailable", created_at as "createdAt"
       FROM appointment_slots
       WHERE service_id = $1 AND is_available = TRUE
       ORDER BY start_time ASC`, [id]);
        res.json({
            success: true,
            data: slotsResult.rows,
        });
    }
    catch (err) {
        console.error("Get slots error:", err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch appointment slots",
        });
    }
});
app.post("/api/v1/bookings", requireAuth, async (req, res) => {
    const { serviceId, appointmentSlotId, address } = req.body;
    const addressParse = bookingAddressSchema.safeParse(address);
    if (!serviceId || !appointmentSlotId || !addressParse.success) {
        return res.status(400).json({
            success: false,
            error: "Invalid request body",
            details: addressParse.error?.format(),
        });
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const slotResult = await client.query(`SELECT * FROM appointment_slots WHERE id = $1 FOR UPDATE`, [appointmentSlotId]);
        if (slotResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                error: "Appointment slot not found",
            });
        }
        const slot = slotResult.rows[0];
        if (slot.service_id !== serviceId) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                error: "Slot does not belong to requested service",
            });
        }
        if (!slot.is_available) {
            await client.query("ROLLBACK");
            return res.status(409).json({
                success: false,
                error: "Slot already booked",
            });
        }
        await client.query(`UPDATE appointment_slots SET is_available = FALSE WHERE id = $1`, [appointmentSlotId]);
        const bookingId = uuidv4();
        const { street, city, state, postalCode } = addressParse.data;
        const bookingResult = await client.query(`INSERT INTO bookings (id, customer_id, service_id, appointment_slot_id, status, address_street, address_city, address_state, address_postal_code)
       VALUES ($1, $2, $3, $4, 'CONFIRMED', $5, $6, $7, $8)
       RETURNING *`, [
            bookingId,
            req.session.customerId,
            serviceId,
            appointmentSlotId,
            street,
            city,
            state,
            postalCode,
        ]);
        await client.query("COMMIT");
        const booking = bookingResult.rows[0];
        return res.status(201).json({
            success: true,
            data: {
                id: booking.id,
                customerId: booking.customer_id,
                serviceId: booking.service_id,
                appointmentSlotId: booking.appointment_slot_id,
                status: booking.status,
                address_street: booking.address_street,
                address_city: booking.address_city,
                address_state: booking.address_state,
                address_postal_code: booking.address_postal_code,
                created_at: booking.created_at,
            },
        });
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error("Booking error:", err);
        return res.status(500).json({
            success: false,
            error: "Booking failed",
        });
    }
    finally {
        client.release();
    }
});
app.get("/api/v1/bookings/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(`SELECT id, customer_id as "customerId", service_id as "serviceId", appointment_slot_id as "appointmentSlotId", status, address_street, address_city, address_state, address_postal_code, created_at
       FROM bookings
       WHERE id = $1 AND customer_id = $2`, [id, req.session.customerId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Booking not found",
            });
        }
        const booking = result.rows[0];
        res.json({
            success: true,
            data: booking,
        });
    }
    catch (err) {
        console.error("Get booking error:", err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch booking",
        });
    }
});
app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});
