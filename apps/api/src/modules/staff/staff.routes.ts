import { Router, Request, Response } from "express";
import { staffLoginSchema } from "home-healthcare-validation";
import { Role } from "home-healthcare-types";
import { query } from "../../lib/db";
import { verifyPassword } from "../../lib/bcrypt";
import { requireStaffAuth } from "../../middleware/auth";
import { logger } from "../../lib/logger";

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

    // Timing-attack mitigation: always compute bcrypt verification even if staff does not exist
    const DUMMY_HASH = "$2a$12$e8uqf0Jg.8m9WfJ23Lh.8eN5n5f5n5f5n5f5n5f5n5f5n5f5n5f5n";
    const staff = result.rows[0];
    const passwordHash = staff ? staff.password_hash : DUMMY_HASH;
    const isValid = await verifyPassword(password, passwordHash);

    if (!staff || !isValid) {
      logger.security("AUTH_STAFF_LOGIN_FAILED", `Failed staff login attempt for email: ${email}`, {
        ip: req.ip || req.socket.remoteAddress,
      });
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    if (!staff.is_active) {
      return res.status(401).json({
        success: false,
        error: "Staff account is deactivated",
      });
    }

    // Regenerate session upon authentication to prevent Session Fixation attacks
    req.session.regenerate((regenErr) => {
      if (regenErr) {
        logger.error("STAFF_SESSION_REGEN_ERROR", "Session regeneration failed after staff login", { details: { err: String(regenErr) } });
        return res.status(500).json({
          success: false,
          error: "Session initialization failed",
        });
      }

      req.session.staffId = staff.id;
      req.session.staffRole = staff.role as Role;

      req.session.save((saveErr) => {
        if (saveErr) {
          logger.error("STAFF_SESSION_SAVE_ERROR", "Session save failed after staff login", { details: { err: String(saveErr) } });
          return res.status(500).json({
            success: false,
            error: "Session persistence failed",
          });
        }

        logger.info("AUTH_STAFF_LOGIN_SUCCESS", `Staff logged in successfully: ${staff.id} (${staff.role})`, {
          userId: staff.id,
          role: staff.role,
          ip: req.ip || req.socket.remoteAddress,
        });

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
      });
    });
  } catch (err) {
    logger.error("STAFF_LOGIN_ERROR", "Staff login route failed", { details: { err: String(err) } });
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
    logger.error("GET_STAFF_PROFILE_ERROR", "Failed to retrieve staff profile", { details: { err: String(err) } });
    res.status(500).json({
      success: false,
      error: "Failed to fetch staff profile",
    });
  }
});
