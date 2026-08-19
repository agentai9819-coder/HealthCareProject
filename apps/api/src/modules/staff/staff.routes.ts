import { Router, Request, Response } from "express";
import { staffLoginSchema } from "home-healthcare-validation";
import { Role } from "home-healthcare-types";
import { query } from "../../lib/db";
import { verifyPassword } from "../../lib/bcrypt";
import { requireStaffAuth } from "../../middleware/auth";

export const staffRouter = Router();

staffRouter.post("/login", async (req: Request, res: Response) => {
  const parseResult = staffLoginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { email, password } = parseResult.data;

  try {
    const result = await query(
      `SELECT id, name, email, password_hash, role, specialty, phone, is_active 
       FROM staff 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const staff = result.rows[0];

    if (!staff.is_active) {
      return res.status(401).json({
        success: false,
        error: "Staff account is deactivated",
      });
    }

    const isValid = await verifyPassword(password, staff.password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    req.session.staffId = staff.id;
    req.session.staffRole = staff.role as Role;

    return res.json({
      success: true,
      data: {
        staff: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          specialty: staff.specialty,
          phone: staff.phone,
        },
      },
    });
  } catch (err) {
    console.error("Staff login error:", err);
    return res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

staffRouter.post("/logout", (req: Request, res: Response) => {
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

staffRouter.get("/me", requireStaffAuth, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, email, role, specialty, phone, is_active as "isActive", created_at as "createdAt"
       FROM staff
       WHERE id = $1`,
      [req.session.staffId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Staff profile not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Get staff profile error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch staff profile",
    });
  }
});
