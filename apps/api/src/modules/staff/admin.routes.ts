import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Workbook } from "exceljs";
import {
  createStaffSchema,
  updateStaffStatusSchema,
} from "home-healthcare-validation";
import { Role } from "home-healthcare-types";
import { pool, query } from "../../lib/db";
import { hashPassword } from "../../lib/bcrypt";
import { requireAdminAuth } from "../../middleware/auth";

export const adminStaffRouter = Router();

// All routes in this router require Admin authorization
adminStaffRouter.use(requireAdminAuth);

// 1. List all staff
adminStaffRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, email, role, specialty, phone, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
       FROM staff
       ORDER BY name ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("List staff error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch staff list",
    });
  }
});

// 2. Create staff account (Admin-controlled onboarding)
adminStaffRouter.post("/", async (req: Request, res: Response) => {
  const parseResult = createStaffSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { name, email, password, specialty, phone } = parseResult.data;

  try {
    const existing = await query("SELECT id FROM staff WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Staff email already registered",
      });
    }

    const passwordHash = await hashPassword(password);
    const staffId = uuidv4();

    const insertResult = await query(
      `INSERT INTO staff (id, name, email, password_hash, role, specialty, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
       RETURNING id, name, email, role, specialty, phone, is_active as "isActive", created_at as "createdAt"`,
      [staffId, name, email, passwordHash, Role.Staff, specialty || null, phone || null]
    );

    return res.status(201).json({
      success: true,
      data: insertResult.rows[0],
    });
  } catch (err) {
    console.error("Create staff error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to create staff account",
    });
  }
});

// 3. Activate or deactivate staff account (with atomic assignment deactivation)
adminStaffRouter.patch("/:id/status", async (req: Request, res: Response) => {
  const staffId = req.params.id;
  const parseResult = updateStaffStatusSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { isActive } = parseResult.data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock target staff row
    const staffCheck = await client.query(
      "SELECT id, role, is_active FROM staff WHERE id = $1 FOR UPDATE",
      [staffId]
    );

    if (staffCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Staff account not found",
      });
    }

    // Update staff status
    const updateResult = await client.query(
      `UPDATE staff 
       SET is_active = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, name, email, role, specialty, phone, is_active as "isActive", updated_at as "updatedAt"`,
      [isActive, staffId]
    );

    // If deactivating, atomically mark all active visit assignments inactive
    if (!isActive) {
      await client.query(
        `UPDATE visit_staff_assignments 
         SET is_active = FALSE, unassigned_at = NOW(), reassignment_reason = 'Staff account deactivated' 
         WHERE staff_id = $1 AND is_active = TRUE`,
        [staffId]
      );
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: updateResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Update staff status error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update staff status",
    });
  } finally {
    client.release();
  }
});

// 4. Native XLSX Export for Staff History
adminStaffRouter.get("/export/history", async (req: Request, res: Response) => {
  try {
    const staffQuery = `
      SELECT 
        s.id,
        s.name,
        s.email,
        s.role,
        s.specialty,
        s.phone,
        s.is_active as "isActive",
        s.created_at as "createdAt",
        COUNT(DISTINCT vsa.id) as "totalAssignments",
        COUNT(DISTINCT CASE WHEN v.status = 'COMPLETED' AND vsa.is_participating = TRUE THEN v.id END) as "completedVisits"
      FROM staff s
      LEFT JOIN visit_staff_assignments vsa ON s.id = vsa.staff_id
      LEFT JOIN visits v ON vsa.visit_id = v.id
      GROUP BY s.id, s.name, s.email, s.role, s.specialty, s.phone, s.is_active, s.created_at
      ORDER BY s.name ASC
    `;

    const assignmentQuery = `
      SELECT 
        vsa.id as "assignmentId",
        vsa.staff_id as "staffId",
        s.name as "staffName",
        vsa.visit_id as "visitId",
        v.booking_id as "bookingId",
        v.status as "visitStatus",
        vsa.is_active as "isActive",
        vsa.is_participating as "isParticipating",
        vsa.has_elevated_access as "hasElevatedAccess",
        vsa.assigned_at as "assignedAt",
        vsa.unassigned_at as "unassignedAt",
        vsa.reassignment_reason as "reassignmentReason"
      FROM visit_staff_assignments vsa
      JOIN staff s ON vsa.staff_id = s.id
      JOIN visits v ON vsa.visit_id = v.id
      ORDER BY vsa.assigned_at DESC
    `;

    const [staffRes, assignmentRes] = await Promise.all([
      query(staffQuery),
      query(assignmentQuery),
    ]);

    const workbook = new Workbook();

    // Sheet 1: Staff Directory & Metrics
    const staffSheet = workbook.addWorksheet("Staff Directory");
    staffSheet.columns = [
      { header: "Staff ID", key: "id", width: 36 },
      { header: "Name", key: "name", width: 24 },
      { header: "Email", key: "email", width: 28 },
      { header: "Role", key: "role", width: 14 },
      { header: "Specialty", key: "specialty", width: 20 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Status", key: "status", width: 12 },
      { header: "Total Assignments", key: "totalAssignments", width: 18 },
      { header: "Completed Visits", key: "completedVisits", width: 18 },
      { header: "Created At", key: "createdAt", width: 22 },
    ];

    for (const row of staffRes.rows) {
      staffSheet.addRow({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        specialty: row.specialty || "General",
        phone: row.phone || "N/A",
        status: row.isActive ? "Active" : "Inactive",
        totalAssignments: Number(row.totalAssignments || 0),
        completedVisits: Number(row.completedVisits || 0),
        createdAt: new Date(row.createdAt).toISOString(),
      });
    }

    // Sheet 2: Assignment Audit History
    const assignmentSheet = workbook.addWorksheet("Assignment History");
    assignmentSheet.columns = [
      { header: "Assignment ID", key: "assignmentId", width: 36 },
      { header: "Staff ID", key: "staffId", width: 36 },
      { header: "Staff Name", key: "staffName", width: 24 },
      { header: "Visit ID", key: "visitId", width: 36 },
      { header: "Booking ID", key: "bookingId", width: 36 },
      { header: "Visit Status", key: "visitStatus", width: 16 },
      { header: "Assignment Active", key: "isActive", width: 18 },
      { header: "Participated", key: "isParticipating", width: 14 },
      { header: "Elevated Access", key: "hasElevatedAccess", width: 16 },
      { header: "Assigned At", key: "assignedAt", width: 22 },
      { header: "Unassigned At", key: "unassignedAt", width: 22 },
      { header: "Reassignment Reason", key: "reassignmentReason", width: 32 },
    ];

    for (const row of assignmentRes.rows) {
      assignmentSheet.addRow({
        assignmentId: row.assignmentId,
        staffId: row.staffId,
        staffName: row.staffName,
        visitId: row.visitId,
        bookingId: row.bookingId,
        visitStatus: row.visitStatus,
        isActive: row.isActive ? "Active" : "Inactive",
        isParticipating: row.isParticipating ? "Yes" : "No",
        hasElevatedAccess: row.hasElevatedAccess ? "Yes" : "No",
        assignedAt: new Date(row.assignedAt).toISOString(),
        unassignedAt: row.unassignedAt ? new Date(row.unassignedAt).toISOString() : "N/A",
        reassignmentReason: row.reassignmentReason || "N/A",
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="staff-history.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export staff history error:", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate staff history export",
      });
    }
  }
});
