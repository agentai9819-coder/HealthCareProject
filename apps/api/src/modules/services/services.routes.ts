import { Router, Request, Response } from "express";
import { query } from "../../lib/db";

export const servicesRouter = Router();

servicesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, description, duration_minutes as "durationMinutes", price, created_at as "createdAt"
       FROM services
       ORDER BY created_at ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch services",
    });
  }
});

servicesRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT id, name, description, duration_minutes as "durationMinutes", price, created_at as "createdAt"
       FROM services
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Get service error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch service",
    });
  }
});

servicesRouter.get("/:id/slots", async (req: Request, res: Response) => {
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

    const slotsResult = await query(
      `SELECT id, start_time as "startTime", end_time as "endTime", is_available as "isAvailable", created_at as "createdAt"
       FROM appointment_slots
       WHERE service_id = $1 AND is_available = TRUE AND start_time > NOW()
       ORDER BY start_time ASC`,
      [id]
    );

    res.json({
      success: true,
      data: slotsResult.rows,
    });
  } catch (err) {
    console.error("Get slots error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointment slots",
    });
  }
});
