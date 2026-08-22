import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  bookingAddressSchema,
  rescheduleBookingSchema,
  changeBookingAddressSchema,
  rebookBookingSchema,
  updateCustomerIntakeSchema,
} from "home-healthcare-validation";
import { pool, query } from "../../lib/db";
import { requireAuth } from "../../middleware/auth";
import { validateUuidParam } from "../../middleware/validate";
import { logger } from "../../lib/logger";

export const bookingsRouter = Router();

// 1. Create Booking (with atomic Visit creation - Seam 1)
bookingsRouter.post("/", requireAuth, async (req: Request, res: Response) => {
  const { serviceId, appointmentSlotId, address, customerIntakeNotes } = req.body;

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

    const slotResult = await client.query(
      `SELECT * FROM appointment_slots WHERE id = $1 FOR UPDATE`,
      [appointmentSlotId]
    );

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

    if (new Date(slot.start_time) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Cannot book an appointment slot in the past",
      });
    }

    await client.query(
      `UPDATE appointment_slots SET is_available = FALSE WHERE id = $1`,
      [appointmentSlotId]
    );

    const bookingId = uuidv4();
    const { street, city, state, postalCode } = addressParse.data;

    const bookingResult = await client.query(
      `INSERT INTO bookings (id, customer_id, service_id, appointment_slot_id, status, customer_intake_notes, address_street, address_city, address_state, address_postal_code)
       VALUES ($1, $2, $3, $4, 'CONFIRMED', $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        bookingId,
        req.session.customerId,
        serviceId,
        appointmentSlotId,
        customerIntakeNotes || null,
        street,
        city,
        state,
        postalCode,
      ]
    );

    // Seam 1: Atomically initialize 1:1 Visit row in CONFIRMED status
    const visitId = uuidv4();
    await client.query(
      `INSERT INTO visits (id, booking_id, status)
       VALUES ($1, $2, 'CONFIRMED')`,
      [visitId, bookingId]
    );

    await client.query(
      `INSERT INTO visit_status_history (id, visit_id, from_status, to_status, actor_type, actor_id)
       VALUES ($1, $2, 'NONE', 'CONFIRMED', 'CUSTOMER', $3)`,
      [uuidv4(), visitId, req.session.customerId]
    );

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
        customer_intake_notes: booking.customer_intake_notes,
        address_street: booking.address_street,
        address_city: booking.address_city,
        address_state: booking.address_state,
        address_postal_code: booking.address_postal_code,
        created_at: booking.created_at,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("CREATE_BOOKING_ERROR", "Failed to create booking", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Booking failed",
    });
  } finally {
    client.release();
  }
});

// 2. List Customer Bookings (Privacy-safe: omits staff internal notes)
bookingsRouter.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT 
         b.id,
         b.customer_id as "customerId",
         b.service_id as "serviceId",
         s.name as "serviceName",
         b.appointment_slot_id as "appointmentSlotId",
         a.start_time as "startTime",
         a.end_time as "endTime",
         b.status,
         b.customer_intake_notes as "customerIntakeNotes",
         v.customer_summary as "customerSummary",
         v.completed_at as "completedAt",
         v.status as "visitStatus",
         b.address_street,
         b.address_city,
         b.address_state,
         b.address_postal_code,
         b.created_at
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN appointment_slots a ON b.appointment_slot_id = a.id
       LEFT JOIN visits v ON b.id = v.booking_id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [req.session.customerId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    logger.error("GET_CUSTOMER_BOOKINGS_ERROR", "Failed to retrieve customer bookings", { details: { err: String(err) } });
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
    });
  }
});

// 3. Get Booking Details (Privacy-safe: returns sanitized customerSummary, strictly omits staff_notes)
bookingsRouter.get("/:id", requireAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT 
         b.id,
         b.customer_id as "customerId",
         b.service_id as "serviceId",
         s.name as "serviceName",
         s.duration_minutes as "serviceDurationMinutes",
         b.appointment_slot_id as "appointmentSlotId",
         a.start_time as "startTime",
         a.end_time as "endTime",
         b.status,
         b.customer_intake_notes as "customerIntakeNotes",
         v.customer_summary as "customerSummary",
         v.completed_at as "completedAt",
         v.status as "visitStatus",
         b.address_street,
         b.address_city,
         b.address_state,
         b.address_postal_code,
         b.created_at
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN appointment_slots a ON b.appointment_slot_id = a.id
       LEFT JOIN visits v ON b.id = v.booking_id
       WHERE b.id = $1 AND b.customer_id = $2`,
      [id, req.session.customerId]
    );

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
  } catch (err) {
    logger.error("GET_BOOKING_ERROR", "Failed to retrieve booking", { details: { err: String(err) } });
    res.status(500).json({
      success: false,
      error: "Failed to fetch booking",
    });
  }
});

// 4. Update Customer Pre-Visit Intake Notes
bookingsRouter.patch("/:id/intake", requireAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseResult = updateCustomerIntakeSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { intakeNotes } = parseResult.data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock booking row
    const bookingRes = await client.query(
      `SELECT id, customer_id, status FROM bookings WHERE id = $1 FOR UPDATE`,
      [id]
    );

    if (bookingRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingRes.rows[0];

    if (booking.customer_id !== req.session.customerId) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    if (booking.status === "CANCELLED") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Cannot modify intake notes on a cancelled booking",
      });
    }

    // 2. Lock and check associated visit (if exists)
    const visitRes = await client.query(
      `SELECT id, status FROM visits WHERE booking_id = $1 FOR UPDATE`,
      [id]
    );

    if (visitRes.rows.length > 0) {
      const vStatus = visitRes.rows[0].status;
      if (vStatus === "IN_PROGRESS" || vStatus === "COMPLETED") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: `Cannot modify intake notes once visit is in progress or completed`,
        });
      }
    }

    const updateRes = await client.query(
      `UPDATE bookings 
       SET customer_intake_notes = $1 
       WHERE id = $2 
       RETURNING id, customer_intake_notes as "customerIntakeNotes"`,
      [intakeNotes, id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: updateRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("UPDATE_INTAKE_NOTES_ERROR", "Failed to update intake notes", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to update customer intake notes",
    });
  } finally {
    client.release();
  }
});

// 5. Cancel Booking (with atomic Visit cancellation - Seam 3)
bookingsRouter.patch(
  "/:id/cancel",
  requireAuth,
  validateUuidParam("id"),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Lock the booking row
      const bookingResult = await client.query(
        `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
        [id]
      );

      if (bookingResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      const booking = bookingResult.rows[0];

      // 2. Verify booking ownership
      if (booking.customer_id !== req.session.customerId) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      // 3. Verify booking status is cancellable (only CONFIRMED or PENDING)
      if (booking.status !== "CONFIRMED" && booking.status !== "PENDING") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Only CONFIRMED or PENDING bookings can be cancelled",
        });
      }

      // 4. Lock and check associated visit (if exists)
      const visitRes = await client.query(
        `SELECT id, status FROM visits WHERE booking_id = $1 FOR UPDATE`,
        [id]
      );

      if (visitRes.rows.length > 0) {
        const visit = visitRes.rows[0];
        if (visit.status === "IN_PROGRESS" || visit.status === "COMPLETED") {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            error: "Cannot cancel a booking for a visit that is currently in progress or completed",
          });
        }
      }

      // 5. Lock the appointment slot
      const slotResult = await client.query(
        `SELECT * FROM appointment_slots WHERE id = $1 FOR UPDATE`,
        [booking.appointment_slot_id]
      );

      if (slotResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Associated appointment slot not found",
        });
      }

      const slot = slotResult.rows[0];

      // 6. Verify the appointment start_time is still in the future
      if (new Date(slot.start_time) <= new Date()) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Cannot cancel past appointments",
        });
      }

      // 7. Update booking status to CANCELLED
      await client.query(
        `UPDATE bookings SET status = 'CANCELLED' WHERE id = $1`,
        [id]
      );

      // 8. Seam 3: Update linked visit to CANCELLED if exists
      if (visitRes.rows.length > 0) {
        const visit = visitRes.rows[0];
        await client.query(
          `UPDATE visits SET status = 'CANCELLED', updated_at = NOW() WHERE id = $1`,
          [visit.id]
        );
        await client.query(
          `INSERT INTO visit_status_history (id, visit_id, from_status, to_status, actor_type, actor_id)
           VALUES ($1, $2, $3, 'CANCELLED', 'CUSTOMER', $4)`,
          [uuidv4(), visit.id, visit.status, req.session.customerId]
        );
      }

      // 9. Restore appointment slot availability to TRUE
      await client.query(
        `UPDATE appointment_slots SET is_available = TRUE WHERE id = $1`,
        [booking.appointment_slot_id]
      );

      // 10. Commit transaction atomically
      await client.query("COMMIT");

      return res.json({
        success: true,
        data: {
          id: booking.id,
          status: "CANCELLED",
        },
      });
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("CANCEL_BOOKING_ERROR", "Failed to cancel booking", { details: { err: String(err) } });
      return res.status(500).json({
        success: false,
        error: "Failed to cancel booking",
      });
    } finally {
      client.release();
    }
  }
);

// 6. Reschedule Booking
bookingsRouter.patch(
  "/:id/reschedule",
  requireAuth,
  validateUuidParam("id"),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseResult = rescheduleBookingSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
      });
    }

    const { newAppointmentSlotId } = parseResult.data;
    const now = new Date();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Lock and validate Booking
      const bookingResult = await client.query(
        `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
        [id]
      );

      if (bookingResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      const booking = bookingResult.rows[0];

      if (booking.customer_id !== req.session.customerId) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      if (booking.status !== "CONFIRMED" && booking.status !== "PENDING") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Only CONFIRMED or PENDING bookings can be rescheduled",
        });
      }

      if (newAppointmentSlotId === booking.appointment_slot_id) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Target appointment slot must differ from currently assigned slot",
        });
      }

      // 2. Lock both Slots in deterministic UUID order
      const slotsResult = await client.query(
        `SELECT * FROM appointment_slots WHERE id IN ($1, $2) ORDER BY id FOR UPDATE`,
        [booking.appointment_slot_id, newAppointmentSlotId]
      );

      const oldSlot = slotsResult.rows.find(
        (s) => s.id === booking.appointment_slot_id
      );
      const targetSlot = slotsResult.rows.find(
        (s) => s.id === newAppointmentSlotId
      );

      if (!oldSlot) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Current appointment slot not found",
        });
      }

      if (!targetSlot) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Target appointment slot not found",
        });
      }

      if (new Date(oldSlot.start_time) <= now) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Cannot reschedule past appointments",
        });
      }

      if (new Date(targetSlot.start_time) <= now) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Cannot book an appointment slot in the past",
        });
      }

      if (targetSlot.service_id !== booking.service_id) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Slot does not belong to requested service",
        });
      }

      if (!targetSlot.is_available) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          error: "Slot already booked",
        });
      }

      // 3. Atomic state updates
      await client.query(
        `UPDATE appointment_slots SET is_available = TRUE WHERE id = $1`,
        [oldSlot.id]
      );

      await client.query(
        `UPDATE appointment_slots SET is_available = FALSE WHERE id = $1`,
        [targetSlot.id]
      );

      const updatedBookingResult = await client.query(
        `UPDATE bookings SET appointment_slot_id = $1 WHERE id = $2 RETURNING *`,
        [targetSlot.id, booking.id]
      );

      await client.query("COMMIT");

      const updated = updatedBookingResult.rows[0];
      return res.json({
        success: true,
        data: {
          id: updated.id,
          customerId: updated.customer_id,
          serviceId: updated.service_id,
          appointmentSlotId: updated.appointment_slot_id,
          status: updated.status,
          address_street: updated.address_street,
          address_city: updated.address_city,
          address_state: updated.address_state,
          address_postal_code: updated.address_postal_code,
          created_at: updated.created_at,
        },
      });
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("RESCHEDULE_BOOKING_ERROR", "Failed to reschedule booking", { details: { err: String(err) } });
      return res.status(500).json({
        success: false,
        error: "Failed to reschedule booking",
      });
    } finally {
      client.release();
    }
  }
);

// 7. Change Booking Address
bookingsRouter.patch(
  "/:id/address",
  requireAuth,
  validateUuidParam("id"),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseResult = changeBookingAddressSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: parseResult.error.format(),
      });
    }

    const { addressId } = parseResult.data;
    const now = new Date();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Lock the booking row
      const bookingResult = await client.query(
        `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
        [id]
      );

      if (bookingResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      const booking = bookingResult.rows[0];

      // 2. Verify booking ownership
      if (booking.customer_id !== req.session.customerId) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      // 3. Verify booking status (only CONFIRMED or PENDING can be updated)
      if (booking.status !== "CONFIRMED" && booking.status !== "PENDING") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Only CONFIRMED or PENDING bookings can have their address changed",
        });
      }

      // 4. Verify temporal rule (future appointment only)
      const slotResult = await client.query(
        `SELECT start_time FROM appointment_slots WHERE id = $1`,
        [booking.appointment_slot_id]
      );

      if (slotResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Associated appointment slot not found",
        });
      }

      const slot = slotResult.rows[0];
      if (new Date(slot.start_time) <= now) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Cannot change address for past appointments",
        });
      }

      // 5. Validate saved address ownership
      const addressResult = await client.query(
        `SELECT street, city, state, postal_code FROM customer_addresses WHERE id = $1 AND customer_id = $2`,
        [addressId, req.session.customerId]
      );

      if (addressResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Saved address not found",
        });
      }

      const addr = addressResult.rows[0];

      // 6. Update booking snapshot columns
      const updatedBookingResult = await client.query(
        `UPDATE bookings 
         SET address_street = $1, address_city = $2, address_state = $3, address_postal_code = $4 
         WHERE id = $5 RETURNING *`,
        [addr.street, addr.city, addr.state, addr.postal_code, id]
      );

      await client.query("COMMIT");

      const updated = updatedBookingResult.rows[0];
      return res.json({
        success: true,
        data: {
          id: updated.id,
          customerId: updated.customer_id,
          serviceId: updated.service_id,
          appointmentSlotId: updated.appointment_slot_id,
          status: updated.status,
          address_street: updated.address_street,
          address_city: updated.address_city,
          address_state: updated.address_state,
          address_postal_code: updated.address_postal_code,
          created_at: updated.created_at,
        },
      });
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("CHANGE_BOOKING_ADDRESS_ERROR", "Failed to change booking address", { details: { err: String(err) } });
      return res.status(500).json({
        success: false,
        error: "Failed to change booking address",
      });
    } finally {
      client.release();
    }
  }
);

// 8. Rebook Booking (with atomic Visit creation - Seam 2)
bookingsRouter.post(
  "/:id/rebook",
  requireAuth,
  validateUuidParam("id"),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseResult = rebookBookingSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: parseResult.error.format(),
      });
    }

    const { appointmentSlotId, addressId, customerIntakeNotes } = parseResult.data;
    const now = new Date();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Read & validate Source Booking (Immutable / Terminal State)
      const sourceResult = await client.query(
        `SELECT id, customer_id, service_id, status FROM bookings WHERE id = $1`,
        [id]
      );

      if (sourceResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      const sourceBooking = sourceResult.rows[0];

      if (sourceBooking.customer_id !== req.session.customerId) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      if (sourceBooking.status !== "COMPLETED" && sourceBooking.status !== "CANCELLED") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Only COMPLETED or CANCELLED bookings can be rebooked",
        });
      }

      // 2. Lock Target Slot
      const slotResult = await client.query(
        `SELECT * FROM appointment_slots WHERE id = $1 FOR UPDATE`,
        [appointmentSlotId]
      );

      if (slotResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Appointment slot not found",
        });
      }

      const slot = slotResult.rows[0];

      if (slot.service_id !== sourceBooking.service_id) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Slot does not belong to the rebooked service",
        });
      }

      if (!slot.is_available) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          error: "Slot already booked",
        });
      }

      if (new Date(slot.start_time) <= now) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "Cannot book an appointment slot in the past",
        });
      }

      // 3. Validate Saved Address Ownership
      const addressResult = await client.query(
        `SELECT street, city, state, postal_code FROM customer_addresses WHERE id = $1 AND customer_id = $2`,
        [addressId, req.session.customerId]
      );

      if (addressResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Saved address not found",
        });
      }

      const addr = addressResult.rows[0];

      // 4. Atomically claim Target Slot
      await client.query(
        `UPDATE appointment_slots SET is_available = FALSE WHERE id = $1`,
        [appointmentSlotId]
      );

      // 5. Insert NEW Booking (Source Booking remains untouched)
      const newBookingId = uuidv4();
      const newBookingResult = await client.query(
        `INSERT INTO bookings (id, customer_id, service_id, appointment_slot_id, status, customer_intake_notes, address_street, address_city, address_state, address_postal_code)
         VALUES ($1, $2, $3, $4, 'CONFIRMED', $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          newBookingId,
          req.session.customerId,
          sourceBooking.service_id,
          appointmentSlotId,
          customerIntakeNotes || null,
          addr.street,
          addr.city,
          addr.state,
          addr.postal_code,
        ]
      );

      // 6. Seam 2: Atomically initialize 1:1 Visit row for new rebooked booking
      const newVisitId = uuidv4();
      await client.query(
        `INSERT INTO visits (id, booking_id, status)
         VALUES ($1, $2, 'CONFIRMED')`,
        [newVisitId, newBookingId]
      );

      await client.query(
        `INSERT INTO visit_status_history (id, visit_id, from_status, to_status, actor_type, actor_id)
         VALUES ($1, $2, 'NONE', 'CONFIRMED', 'CUSTOMER', $3)`,
        [uuidv4(), newVisitId, req.session.customerId]
      );

      await client.query("COMMIT");

      const newBooking = newBookingResult.rows[0];

      return res.status(201).json({
        success: true,
        data: {
          id: newBooking.id,
          customerId: newBooking.customer_id,
          serviceId: newBooking.service_id,
          appointmentSlotId: newBooking.appointment_slot_id,
          status: newBooking.status,
          customer_intake_notes: newBooking.customer_intake_notes,
          address_street: newBooking.address_street,
          address_city: newBooking.address_city,
          address_state: newBooking.address_state,
          address_postal_code: newBooking.address_postal_code,
          created_at: newBooking.created_at,
        },
      });
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("REBOOK_ERROR", "Failed to rebook", { details: { err: String(err) } });
      return res.status(500).json({
        success: false,
        error: "Rebooking failed",
      });
    } finally {
      client.release();
    }
  }
);
