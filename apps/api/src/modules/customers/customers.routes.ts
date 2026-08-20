import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { env } from "home-healthcare-config";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "home-healthcare-validation";
import { query } from "../../lib/db";
import { hashPassword, verifyPassword } from "../../lib/bcrypt";
import { requireAuth } from "../../middleware/auth";

export const customersRouter = Router();

customersRouter.post("/register", async (req: Request, res: Response) => {
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

    await query(
      `INSERT INTO customers (id, name, email, password_hash, bcrypt_salt_rounds)
       VALUES ($1, $2, $3, $4, $5)`,
      [customerId, name, email, passwordHash, env.BCRYPT_SALT_ROUNDS]
    );

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
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
});

customersRouter.post("/login", async (req: Request, res: Response) => {
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
    const result = await query(
      "SELECT id, name, email, password_hash FROM customers WHERE email = $1",
      [identifier]
    );

    // Timing-attack mitigation: always compute bcrypt verification even if customer does not exist
    const DUMMY_HASH = "$2a$12$e8uqf0Jg.8m9WfJ23Lh.8eN5n5f5n5f5n5f5n5f5n5f5n5f5n5f5n";
    const customer = result.rows[0];
    const passwordHash = customer ? customer.password_hash : DUMMY_HASH;
    const isValid = await verifyPassword(password, passwordHash);

    if (!customer || !isValid) {
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
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

customersRouter.post("/logout", (req: Request, res: Response) => {
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

customersRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, email, created_at as "createdAt"
       FROM customers
       WHERE id = $1`,
      [req.session.customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Get customer profile error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch customer profile",
    });
  }
});

customersRouter.patch(
  "/me",
  requireAuth,
  async (req: Request, res: Response) => {
    const parseResult = updateProfileSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: parseResult.error.format(),
      });
    }

    const { name } = parseResult.data;

    try {
      const result = await query(
        `UPDATE customers
         SET name = $1
         WHERE id = $2
         RETURNING id, name, email, created_at as "createdAt"`,
        [name, req.session.customerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      return res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Update profile error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  }
);

customersRouter.patch(
  "/me/password",
  requireAuth,
  async (req: Request, res: Response) => {
    const parseResult = changePasswordSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: parseResult.error.format(),
      });
    }

    const { currentPassword, newPassword } = parseResult.data;

    // Check same-password identity before DB query
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: "New password must be different from current password",
      });
    }

    try {
      const result = await query(
        "SELECT id, password_hash FROM customers WHERE id = $1",
        [req.session.customerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      const customer = result.rows[0];
      const isCurrentValid = await verifyPassword(
        currentPassword,
        customer.password_hash
      );

      if (!isCurrentValid) {
        return res.status(401).json({
          success: false,
          error: "Incorrect current password",
        });
      }

      // Check if new password matches existing hash
      const isSameAsExisting = await verifyPassword(
        newPassword,
        customer.password_hash
      );

      if (isSameAsExisting) {
        return res.status(400).json({
          success: false,
          error: "New password must be different from current password",
        });
      }

      const newHash = await hashPassword(newPassword);

      await query(
        "UPDATE customers SET password_hash = $1 WHERE id = $2",
        [newHash, req.session.customerId]
      );

      // Invalidate current session and clear cookie
      req.session.destroy((err) => {
        if (err) {
          console.error("Session invalidation error:", err);
          return res.status(500).json({
            success: false,
            error:
              "Password was updated, but session invalidation failed. Please log out manually.",
          });
        }
        res.clearCookie("session_id", { path: "/" });
        return res.json({
          success: true,
          message: "Password updated successfully. Please log in again.",
        });
      });
    } catch (err) {
      console.error("Change password error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to update password",
      });
    }
  }
);
