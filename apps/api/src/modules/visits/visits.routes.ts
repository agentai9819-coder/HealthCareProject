import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  transitionVisitStatusSchema,
  completeVisitSchema,
  assignStaffSchema,
  reassignStaffSchema,
  setElevatedAccessSchema,
  listVisitsQuerySchema,
} from "home-healthcare-validation";
import { VisitStatus, Role } from "home-healthcare-types";
import { pool, query } from "../../lib/db";
import { requireStaffAuth, requireAdminAuth } from "../../middleware/auth";
import { validateUuidParam, validateQuery } from "../../middleware/validate";
import { logger } from "../../lib/logger";

export const staffVisitsRouter = Router();
export const adminVisitsRouter = Router();

// ===========================================================================
// STAFF VISIT OPERATIONS
// ===========================================================================

// 1. List assigned visits for authenticated staff
staffVisitsRouter.get("/", requireStaffAuth, validateQuery(listVisitsQuerySchema), async (req: Request, res: Response) => {
  const staffId = req.session.staffId;
  const statusFilter = req.query.status as string | undefined;
  const dateFilter = req.query.date as string | undefined;

  try {
    let sql = `
      SELECT DISTINCT
        v.id,
        v.booking_id as "bookingId",
        v.status,
        c.name as "customerName",
        s.name as "serviceName",
        s.duration_minutes as "serviceDuration",
        slot.start_time as "startTime",
        slot.end_time as "endTime",
        b.address_street as "addressStreet",
        b.address_city as "addressCity",
        b.address_state as "addressState",
        b.address_postal_code as "addressPostalCode",
        b.customer_intake_notes as "customerIntakeNotes",
        vsa.has_elevated_access as "hasElevatedAccess",
        v.en_route_at as "enRouteAt",
        v.in_progress_at as "inProgressAt",
        v.completed_at as "completedAt",
        v.customer_summary as "customerSummary",
        CASE WHEN vsa.has_elevated_access THEN c.email ELSE NULL END as "customerEmail"
      FROM visits v
      JOIN bookings b ON v.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      JOIN services s ON b.service_id = s.id
      JOIN appointment_slots slot ON b.appointment_slot_id = slot.id
      JOIN visit_staff_assignments vsa ON v.id = vsa.visit_id
      WHERE vsa.staff_id = $1 
        AND (
          vsa.is_active = TRUE 
          OR (v.status = 'COMPLETED' AND (v.completed_by_staff_id = $1 OR vsa.is_participating = TRUE))
        )
    `;

    const params: unknown[] = [staffId];
    let paramIndex = 2;

    if (statusFilter) {
      sql += ` AND v.status = $${paramIndex}`;
      params.push(statusFilter);
      paramIndex++;
    }

    if (dateFilter) {
      sql += ` AND DATE(slot.start_time) = DATE($${paramIndex})`;
      params.push(dateFilter);
      paramIndex++;
    }

    sql += ` ORDER BY slot.start_time ASC`;

    const result = await query(sql, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    logger.error("LIST_STAFF_VISITS_ERROR", "Failed to list staff visits", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch assigned visits",
    });
  }
});

// 2. Get specific visit details for authenticated staff
staffVisitsRouter.get("/:id", requireStaffAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const visitId = req.params.id;
  const staffId = req.session.staffId;

  try {
    // Check authorization: caller must be actively assigned or participated in completed visit
    const authCheck = await query(
      `SELECT vsa.is_active as "isActive", vsa.is_participating as "isParticipating", 
              vsa.has_elevated_access as "hasElevatedAccess", v.status, v.completed_by_staff_id as "completedByStaffId"
       FROM visit_staff_assignments vsa
       JOIN visits v ON vsa.visit_id = v.id
       WHERE vsa.visit_id = $1 AND vsa.staff_id = $2`,
      [visitId, staffId]
    );

    if (authCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "Access denied to this visit",
      });
    }

    const assignment = authCheck.rows[0];
    const isCompleted = assignment.status === "COMPLETED";
    const isAssigned = assignment.isActive;
    const isCompletedParticipant = isCompleted && (assignment.completedByStaffId === staffId || assignment.isParticipating);

    if (!isAssigned && !isCompletedParticipant) {
      return res.status(403).json({
        success: false,
        error: "Access revoked for this visit",
      });
    }

    const visitDetails = await query(
      `SELECT 
        v.id,
        v.booking_id as "bookingId",
        v.status,
        c.name as "customerName",
        CASE WHEN $2 = TRUE THEN c.email ELSE NULL END as "customerEmail",
        s.name as "serviceName",
        s.duration_minutes as "serviceDuration",
        slot.start_time as "startTime",
        slot.end_time as "endTime",
        b.address_street as "addressStreet",
        b.address_city as "addressCity",
        b.address_state as "addressState",
        b.address_postal_code as "addressPostalCode",
        b.customer_intake_notes as "customerIntakeNotes",
        $2 as "hasElevatedAccess",
        v.en_route_at as "enRouteAt",
        v.in_progress_at as "inProgressAt",
        v.completed_at as "completedAt",
        v.staff_notes as "staffNotes",
        v.customer_summary as "customerSummary"
       FROM visits v
       JOIN bookings b ON v.booking_id = b.id
       JOIN customers c ON b.customer_id = c.id
       JOIN services s ON b.service_id = s.id
       JOIN appointment_slots slot ON b.appointment_slot_id = slot.id
       WHERE v.id = $1`,
      [visitId, assignment.hasElevatedAccess]
    );

    if (visitDetails.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Visit not found",
      });
    }

    // Fetch assigned staff members for this visit
    const staffList = await query(
      `SELECT vsa.staff_id as "staffId", s.name, s.specialty, vsa.is_active as "isActive", vsa.is_participating as "isParticipating"
       FROM visit_staff_assignments vsa
       JOIN staff s ON vsa.staff_id = s.id
       WHERE vsa.visit_id = $1
       ORDER BY vsa.assigned_at ASC`,
      [visitId]
    );

    return res.json({
      success: true,
      data: {
        ...visitDetails.rows[0],
        assignedStaff: staffList.rows,
      },
    });
  } catch (err) {
    logger.error("GET_VISIT_DETAILS_ERROR", "Failed to get visit details", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch visit details",
    });
  }
});

// 3. Transition visit status (EN_ROUTE, IN_PROGRESS) by staff caregiver
staffVisitsRouter.patch("/:id/status", requireStaffAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const visitId = req.params.id;
  const staffId = req.session.staffId;
  const parseResult = transitionVisitStatusSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid target status. Allowed: EN_ROUTE, IN_PROGRESS",
      details: parseResult.error.format(),
    });
  }

  const { status: targetStatus } = parseResult.data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock visit row
    const visitRes = await client.query(
      "SELECT id, status, booking_id FROM visits WHERE id = $1 FOR UPDATE",
      [visitId]
    );

    if (visitRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Visit not found",
      });
    }

    const currentVisit = visitRes.rows[0];

    // Verify caller has active assignment
    const assignCheck = await client.query(
      "SELECT id FROM visit_staff_assignments WHERE visit_id = $1 AND staff_id = $2 AND is_active = TRUE",
      [visitId, staffId]
    );

    if (assignCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "You are not an active assigned caregiver for this visit",
      });
    }

    // State machine verification
    if (targetStatus === "EN_ROUTE") {
      if (currentVisit.status !== "CONFIRMED") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: `Cannot transition to EN_ROUTE from status ${currentVisit.status}`,
        });
      }

      await client.query(
        "UPDATE visits SET status = 'EN_ROUTE', en_route_at = NOW(), updated_at = NOW() WHERE id = $1",
        [visitId]
      );
    } else if (targetStatus === "IN_PROGRESS") {
      if (currentVisit.status !== "EN_ROUTE") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: `Cannot transition to IN_PROGRESS from status ${currentVisit.status}`,
        });
      }

      await client.query(
        "UPDATE visits SET status = 'IN_PROGRESS', in_progress_at = NOW(), updated_at = NOW() WHERE id = $1",
        [visitId]
      );
    }

    // Record in visit_status_history
    await client.query(
      `INSERT INTO visit_status_history (id, visit_id, from_status, to_status, actor_type, actor_id)
       VALUES ($1, $2, $3, $4, 'STAFF', $5)`,
      [uuidv4(), visitId, currentVisit.status, targetStatus, staffId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: {
        id: visitId,
        status: targetStatus,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("TRANSITION_VISIT_STATUS_ERROR", "Failed to transition visit status", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to transition visit status",
    });
  } finally {
    client.release();
  }
});

// 4. Complete visit by staff caregiver
staffVisitsRouter.post("/:id/complete", requireStaffAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const visitId = req.params.id;
  const staffId = req.session.staffId;
  const parseResult = completeVisitSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid completion payload",
      details: parseResult.error.format(),
    });
  }

  const { staffNotes, customerSummary, participatingStaffIds } = parseResult.data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock booking and visit rows
    const visitRes = await client.query(
      `SELECT v.id, v.status, v.booking_id, b.status as "bookingStatus"
       FROM visits v
       JOIN bookings b ON v.booking_id = b.id
       WHERE v.id = $1 FOR UPDATE`,
      [visitId]
    );

    if (visitRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Visit not found",
      });
    }

    const currentVisit = visitRes.rows[0];

    // Check visit status
    if (currentVisit.status !== "IN_PROGRESS") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: `Cannot complete visit from status ${currentVisit.status}. Visit must be IN_PROGRESS.`,
      });
    }

    // 2. Lock active assignments
    const activeAssignments = await client.query(
      `SELECT id, staff_id FROM visit_staff_assignments 
       WHERE visit_id = $1 AND is_active = TRUE 
       ORDER BY id ASC FOR UPDATE`,
      [visitId]
    );

    const activeStaffIds = new Set(activeAssignments.rows.map((r) => r.staff_id));

    // Verify caller is an active assigned staff member
    if (!activeStaffIds.has(staffId)) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "You are not an active assigned caregiver for this visit",
      });
    }

    // Verify participating staff IDs
    const finalParticipatingIds = new Set<string>([staffId!]);

    if (participatingStaffIds && participatingStaffIds.length > 0) {
      for (const pId of participatingStaffIds) {
        if (!activeStaffIds.has(pId)) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            error: `Staff member ${pId} is not actively assigned to this visit and cannot be marked as participating`,
          });
        }
        finalParticipatingIds.add(pId);
      }
    }

    // Update participation flags
    for (const pId of Array.from(finalParticipatingIds)) {
      await client.query(
        "UPDATE visit_staff_assignments SET is_participating = TRUE WHERE visit_id = $1 AND staff_id = $2 AND is_active = TRUE",
        [visitId, pId]
      );
    }

    // 3. Update visit record
    await client.query(
      `UPDATE visits 
       SET status = 'COMPLETED', completed_at = NOW(), completed_by_staff_id = $1, 
           staff_notes = $2, customer_summary = $3, updated_at = NOW() 
       WHERE id = $4`,
      [staffId, staffNotes, customerSummary, visitId]
    );

    // 4. Sync booking status to COMPLETED
    await client.query(
      "UPDATE bookings SET status = 'COMPLETED' WHERE id = $1",
      [currentVisit.booking_id]
    );

    // 5. Audit history
    await client.query(
      `INSERT INTO visit_status_history (id, visit_id, from_status, to_status, actor_type, actor_id)
       VALUES ($1, $2, 'IN_PROGRESS', 'COMPLETED', 'STAFF', $3)`,
      [uuidv4(), visitId, staffId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: {
        id: visitId,
        status: VisitStatus.Completed,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("COMPLETE_VISIT_ERROR", "Failed to complete visit", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to complete visit",
    });
  } finally {
    client.release();
  }
});

// ===========================================================================
// ADMIN DISPATCH & VISIT OPERATIONS
// ===========================================================================

adminVisitsRouter.use(requireAdminAuth);

// 1. List all platform visits with dispatch overview
adminVisitsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const visitsQuery = `
      SELECT 
        v.id,
        v.booking_id as "bookingId",
        v.status,
        c.name as "customerName",
        c.email as "customerEmail",
        s.name as "serviceName",
        slot.start_time as "startTime",
        slot.end_time as "endTime",
        b.address_street as "addressStreet",
        b.address_city as "addressCity",
        b.address_state as "addressState",
        b.address_postal_code as "addressPostalCode",
        b.customer_intake_notes as "customerIntakeNotes",
        v.en_route_at as "enRouteAt",
        v.in_progress_at as "inProgressAt",
        v.completed_at as "completedAt",
        v.completed_by_staff_id as "completedByStaffId",
        comp_s.name as "completedByName",
        v.staff_notes as "staffNotes",
        v.customer_summary as "customerSummary"
      FROM visits v
      JOIN bookings b ON v.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      JOIN services s ON b.service_id = s.id
      JOIN appointment_slots slot ON b.appointment_slot_id = slot.id
      LEFT JOIN staff comp_s ON v.completed_by_staff_id = comp_s.id
      ORDER BY slot.start_time DESC
    `;

    const assignmentsQuery = `
      SELECT 
        vsa.id as "assignmentId",
        vsa.visit_id as "visitId",
        vsa.staff_id as "staffId",
        s.name,
        s.role,
        s.specialty,
        vsa.is_active as "isActive",
        vsa.is_participating as "isParticipating",
        vsa.has_elevated_access as "hasElevatedAccess",
        vsa.assigned_at as "assignedAt",
        vsa.unassigned_at as "unassignedAt",
        vsa.reassignment_reason as "reassignmentReason"
      FROM visit_staff_assignments vsa
      JOIN staff s ON vsa.staff_id = s.id
      ORDER BY vsa.assigned_at ASC
    `;

    const [visitsRes, assignRes] = await Promise.all([
      query(visitsQuery),
      query(assignmentsQuery),
    ]);

    const assignmentsByVisit = new Map<string, unknown[]>();
    for (const a of assignRes.rows) {
      if (!assignmentsByVisit.has(a.visitId)) {
        assignmentsByVisit.set(a.visitId, []);
      }
      assignmentsByVisit.get(a.visitId)!.push(a);
    }

    const data = visitsRes.rows.map((v) => ({
      ...v,
      assignedStaff: assignmentsByVisit.get(v.id) || [],
    }));

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    logger.error("ADMIN_LIST_VISITS_ERROR", "Failed to list admin visits", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch visits overview",
    });
  }
});

// 2. Assign staff to visit (Add active staff)
adminVisitsRouter.post("/:id/assign", validateUuidParam("id"), async (req: Request, res: Response) => {
  const visitId = req.params.id;
  const adminId = req.session.staffId;
  const parseResult = assignStaffSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { staffIds } = parseResult.data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock all target staff rows deterministically
    const staffCheck = await client.query(
      `SELECT id, name, is_active FROM staff 
       WHERE id = ANY($1) 
       ORDER BY id ASC FOR UPDATE`,
      [staffIds]
    );

    if (staffCheck.rows.length !== staffIds.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "One or more specified staff members do not exist",
      });
    }

    for (const s of staffCheck.rows) {
      if (!s.is_active) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: `Cannot assign inactive staff member: ${s.name}`,
        });
      }
    }

    // 2. Lock visit row
    const visitRes = await client.query(
      "SELECT id, status FROM visits WHERE id = $1 FOR UPDATE",
      [visitId]
    );

    if (visitRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Visit not found",
      });
    }

    const currentVisit = visitRes.rows[0];

    if (currentVisit.status === "COMPLETED" || currentVisit.status === "CANCELLED") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: `Cannot assign staff to a visit in terminal status ${currentVisit.status}`,
      });
    }

    // 3. Lock existing assignments
    const existingAssignments = await client.query(
      `SELECT staff_id FROM visit_staff_assignments 
       WHERE visit_id = $1 AND is_active = TRUE 
       ORDER BY id ASC FOR UPDATE`,
      [visitId]
    );

    const activeStaffSet = new Set(existingAssignments.rows.map((r) => r.staff_id));

    for (const sid of staffIds) {
      if (activeStaffSet.has(sid)) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: `Staff member ${sid} is already actively assigned to this visit`,
        });
      }
    }

    // 4. Insert new assignments
    for (const sid of staffIds) {
      await client.query(
        `INSERT INTO visit_staff_assignments (id, visit_id, staff_id, assigned_by_id, is_active, is_participating, has_elevated_access)
         VALUES ($1, $2, $3, $4, TRUE, FALSE, FALSE)`,
        [uuidv4(), visitId, sid, adminId]
      );
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Staff assigned successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("ASSIGN_STAFF_ERROR", "Failed to assign staff to visit", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to assign staff to visit",
    });
  } finally {
    client.release();
  }
});

// 3. Reassign staff on visit (Replace staff with audit trail)
adminVisitsRouter.post("/:id/reassign", validateUuidParam("id"), async (req: Request, res: Response) => {
  const visitId = req.params.id;
  const adminId = req.session.staffId;
  const parseResult = reassignStaffSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { removeStaffId, addStaffId, reason } = parseResult.data;

  if (removeStaffId === addStaffId) {
    return res.status(400).json({
      success: false,
      error: "Replacement staff cannot be the same as the staff being removed",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock affected staff rows deterministically
    const staffCheck = await client.query(
      `SELECT id, name, is_active FROM staff 
       WHERE id IN ($1, $2) 
       ORDER BY id ASC FOR UPDATE`,
      [removeStaffId, addStaffId]
    );

    const replacementStaff = staffCheck.rows.find((s) => s.id === addStaffId);
    if (!replacementStaff) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Replacement staff member not found",
      });
    }

    if (!replacementStaff.is_active) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: `Cannot assign inactive staff member: ${replacementStaff.name}`,
      });
    }

    // 2. Lock visit row
    const visitRes = await client.query(
      "SELECT id, status FROM visits WHERE id = $1 FOR UPDATE",
      [visitId]
    );

    if (visitRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Visit not found",
      });
    }

    const currentVisit = visitRes.rows[0];

    // IN_PROGRESS reassignment rule
    if (currentVisit.status === "IN_PROGRESS") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Cannot remove or replace staff on a visit that is currently in progress",
      });
    }

    if (currentVisit.status === "COMPLETED" || currentVisit.status === "CANCELLED") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: `Cannot reassign staff on a visit in terminal status ${currentVisit.status}`,
      });
    }

    // 3. Lock assignments
    const assignmentsRes = await client.query(
      `SELECT id, staff_id, is_active FROM visit_staff_assignments 
       WHERE visit_id = $1 
       ORDER BY id ASC FOR UPDATE`,
      [visitId]
    );

    const activeRemoveAssignment = assignmentsRes.rows.find(
      (a) => a.staff_id === removeStaffId && a.is_active
    );

    if (!activeRemoveAssignment) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Staff member to remove is not actively assigned to this visit",
      });
    }

    const activeAddAssignment = assignmentsRes.rows.find(
      (a) => a.staff_id === addStaffId && a.is_active
    );

    if (activeAddAssignment) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Replacement staff member is already actively assigned to this visit",
      });
    }

    // 4. Mark old assignment inactive with reason
    await client.query(
      `UPDATE visit_staff_assignments 
       SET is_active = FALSE, unassigned_at = NOW(), reassignment_reason = $1 
       WHERE id = $2`,
      [reason, activeRemoveAssignment.id]
    );

    // 5. Insert new assignment row (has_elevated_access = FALSE)
    await client.query(
      `INSERT INTO visit_staff_assignments (id, visit_id, staff_id, assigned_by_id, is_active, is_participating, has_elevated_access)
       VALUES ($1, $2, $3, $4, TRUE, FALSE, FALSE)`,
      [uuidv4(), visitId, addStaffId, adminId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Staff reassigned successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("REASSIGN_STAFF_ERROR", "Failed to reassign staff", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to reassign visit staff",
    });
  } finally {
    client.release();
  }
});

// 4. Update elevated sensitive-information access on an active assignment
adminVisitsRouter.patch("/:id/assignments/:staffId/access", validateUuidParam("id", "staffId"), async (req: Request, res: Response) => {
  const visitId = req.params.id;
  const staffId = req.params.staffId;
  const parseResult = setElevatedAccessSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { hasElevatedAccess } = parseResult.data;

  try {
    const result = await query(
      `UPDATE visit_staff_assignments 
       SET has_elevated_access = $1 
       WHERE visit_id = $2 AND staff_id = $3 AND is_active = TRUE 
       RETURNING id, visit_id as "visitId", staff_id as "staffId", has_elevated_access as "hasElevatedAccess"`,
      [hasElevatedAccess, visitId, staffId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Active staff assignment not found for this visit",
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    logger.error("UPDATE_ELEVATED_ACCESS_ERROR", "Failed to update elevated access", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to update elevated access",
    });
  }
});

// 5. Admin visit completion override
adminVisitsRouter.post("/:id/complete", validateUuidParam("id"), async (req: Request, res: Response) => {
  const visitId = req.params.id;
  const adminId = req.session.staffId;
  const parseResult = completeVisitSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid completion payload",
      details: parseResult.error.format(),
    });
  }

  const { staffNotes, customerSummary, participatingStaffIds } = parseResult.data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock booking and visit
    const visitRes = await client.query(
      `SELECT v.id, v.status, v.booking_id, b.status as "bookingStatus"
       FROM visits v
       JOIN bookings b ON v.booking_id = b.id
       WHERE v.id = $1 FOR UPDATE`,
      [visitId]
    );

    if (visitRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Visit not found",
      });
    }

    const currentVisit = visitRes.rows[0];

    if (currentVisit.status === "COMPLETED" || currentVisit.status === "CANCELLED") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: `Cannot complete visit in status ${currentVisit.status}`,
      });
    }

    // 2. Lock active assignments
    const activeAssignments = await client.query(
      `SELECT id, staff_id FROM visit_staff_assignments 
       WHERE visit_id = $1 AND is_active = TRUE 
       ORDER BY id ASC FOR UPDATE`,
      [visitId]
    );

    const activeStaffIds = new Set(activeAssignments.rows.map((r) => r.staff_id));

    if (participatingStaffIds && participatingStaffIds.length > 0) {
      for (const pId of participatingStaffIds) {
        if (!activeStaffIds.has(pId)) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            error: `Staff member ${pId} is not actively assigned to this visit`,
          });
        }
        await client.query(
          "UPDATE visit_staff_assignments SET is_participating = TRUE WHERE visit_id = $1 AND staff_id = $2 AND is_active = TRUE",
          [visitId, pId]
        );
      }
    }

    // 3. Update visit record
    await client.query(
      `UPDATE visits 
       SET status = 'COMPLETED', completed_at = NOW(), completed_by_staff_id = $1, 
           staff_notes = $2, customer_summary = $3, updated_at = NOW() 
       WHERE id = $4`,
      [adminId, staffNotes, customerSummary, visitId]
    );

    // 4. Sync booking status to COMPLETED
    await client.query(
      "UPDATE bookings SET status = 'COMPLETED' WHERE id = $1",
      [currentVisit.booking_id]
    );

    // 5. Audit history
    await client.query(
      `INSERT INTO visit_status_history (id, visit_id, from_status, to_status, actor_type, actor_id)
       VALUES ($1, $2, $3, 'COMPLETED', 'ADMIN', $4)`,
      [uuidv4(), visitId, currentVisit.status, adminId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: {
        id: visitId,
        status: VisitStatus.Completed,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("ADMIN_COMPLETE_VISIT_ERROR", "Failed to admin-complete visit", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to complete visit",
    });
  } finally {
    client.release();
  }
});
