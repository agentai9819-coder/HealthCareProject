import { Request, Response, NextFunction } from "express";
import { query } from "../lib/db";
import { Role } from "home-healthcare-types";
import { logger } from "../lib/logger";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.customerId) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }
  next();
};

export const requireStaffAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.staffId) {
    return res.status(401).json({
      success: false,
      error: "Staff authentication required",
    });
  }

  try {
    const result = await query(
      "SELECT id, role, is_active FROM staff WHERE id = $1",
      [req.session.staffId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        error: "Staff account is inactive or not found",
      });
    }

    req.session.staffRole = result.rows[0].role as Role;
    next();
  } catch (err) {
    logger.error("REQUIRE_STAFF_AUTH_ERROR", "Error during staff auth verification", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Internal server error during authorization",
    });
  }
};

export const requireAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.staffId) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  try {
    const result = await query(
      "SELECT id, role, is_active FROM staff WHERE id = $1",
      [req.session.staffId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        error: "Account is inactive or not found",
      });
    }

    if (result.rows[0].role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Administrator access required",
      });
    }

    req.session.staffRole = Role.Admin;
    next();
  } catch (err) {
    logger.error("REQUIRE_ADMIN_AUTH_ERROR", "Error during admin auth verification", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Internal server error during authorization",
    });
  }
};
