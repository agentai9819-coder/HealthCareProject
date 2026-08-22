import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  customerAddressSchema,
  updateCustomerAddressSchema,
} from "home-healthcare-validation";
import { pool, query } from "../../lib/db";
import { requireAuth } from "../../middleware/auth";
import { validateUuidParam } from "../../middleware/validate";
import { logger } from "../../lib/logger";

export const addressesRouter = Router();

// GET /api/v1/customers/me/addresses
addressesRouter.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, customer_id as "customerId", label, street, city, state,
              postal_code as "postalCode", is_default as "isDefault",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM customer_addresses
       WHERE customer_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [req.session.customerId]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    logger.error("GET_ADDRESSES_ERROR", "Failed to retrieve customer addresses", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch saved addresses",
    });
  }
});

// GET /api/v1/customers/me/addresses/:id
addressesRouter.get("/:id", requireAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT id, customer_id as "customerId", label, street, city, state,
              postal_code as "postalCode", is_default as "isDefault",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM customer_addresses
       WHERE id = $1 AND customer_id = $2`,
      [id, req.session.customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    logger.error("GET_ADDRESS_ERROR", "Failed to retrieve address", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch address",
    });
  }
});

// POST /api/v1/customers/me/addresses
addressesRouter.post("/", requireAuth, async (req: Request, res: Response) => {
  const parse = customerAddressSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parse.error.format(),
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock customer parent row to serialize default toggles across concurrent requests
    await client.query(
      `SELECT id FROM customers WHERE id = $1 FOR UPDATE`,
      [req.session.customerId]
    );

    // 2. Check existing address count for customer
    const countRes = await client.query(
      `SELECT COUNT(*) FROM customer_addresses WHERE customer_id = $1`,
      [req.session.customerId]
    );

    const count = parseInt(countRes.rows[0].count, 10);
    let isDefault = parse.data.isDefault;

    // First saved address automatically becomes default
    if (count === 0) {
      isDefault = true;
    }

    // If new address is default, unset previous default
    if (isDefault) {
      await client.query(
        `UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = $1`,
        [req.session.customerId]
      );
    }

    const addressId = uuidv4();
    const { label, street, city, state, postalCode } = parse.data;

    const insertResult = await client.query(
      `INSERT INTO customer_addresses (id, customer_id, label, street, city, state, postal_code, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, customer_id as "customerId", label, street, city, state, postal_code as "postalCode", is_default as "isDefault", created_at as "createdAt", updated_at as "updatedAt"`,
      [
        addressId,
        req.session.customerId,
        label,
        street,
        city,
        state,
        postalCode,
        isDefault,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      data: insertResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("CREATE_ADDRESS_ERROR", "Failed to create address", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to create address",
    });
  } finally {
    client.release();
  }
});

// PATCH /api/v1/customers/me/addresses/:id
addressesRouter.patch("/:id", requireAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const { id } = req.params;
  const parse = updateCustomerAddressSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parse.error.format(),
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock customer parent row to serialize concurrent default operations
    await client.query(
      `SELECT id FROM customers WHERE id = $1 FOR UPDATE`,
      [req.session.customerId]
    );

    // 2. Lock & verify target address ownership
    const targetResult = await client.query(
      `SELECT * FROM customer_addresses WHERE id = $1 AND customer_id = $2 FOR UPDATE`,
      [id, req.session.customerId]
    );

    if (targetResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    const target = targetResult.rows[0];

    // 3. Resolve effective isDefault value deterministically
    let effectiveIsDefault: boolean;
    if (parse.data.isDefault === false && target.is_default === true) {
      // Unconditionally reject setting isDefault: false on active default address
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Cannot unset default address directly. Mark another address as default instead.",
      });
    } else if (parse.data.isDefault === undefined) {
      // Omitted: preserve existing default status
      effectiveIsDefault = target.is_default;
    } else {
      effectiveIsDefault = parse.data.isDefault;
    }

    // 4. If target is becoming default, unset previous default
    if (effectiveIsDefault && !target.is_default) {
      await client.query(
        `UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = $1`,
        [req.session.customerId]
      );
    }

    // 5. Construct effective values using fallback to target row
    const label = parse.data.label !== undefined ? parse.data.label : target.label;
    const street = parse.data.street !== undefined ? parse.data.street : target.street;
    const city = parse.data.city !== undefined ? parse.data.city : target.city;
    const state = parse.data.state !== undefined ? parse.data.state : target.state;
    const postalCode = parse.data.postalCode !== undefined ? parse.data.postalCode : target.postal_code;

    // 6. Execute atomic UPDATE
    const updateResult = await client.query(
      `UPDATE customer_addresses
       SET label = $1, street = $2, city = $3, state = $4, postal_code = $5, is_default = $6, updated_at = NOW()
       WHERE id = $7 AND customer_id = $8
       RETURNING id, customer_id as "customerId", label, street, city, state, postal_code as "postalCode", is_default as "isDefault", created_at as "createdAt", updated_at as "updatedAt"`,
      [label, street, city, state, postalCode, effectiveIsDefault, id, req.session.customerId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: updateResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("UPDATE_ADDRESS_ERROR", "Failed to update address", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to update address",
    });
  } finally {
    client.release();
  }
});

// DELETE /api/v1/customers/me/addresses/:id
addressesRouter.delete("/:id", requireAuth, validateUuidParam("id"), async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock customer parent row to serialize concurrent default operations
    await client.query(
      `SELECT id FROM customers WHERE id = $1 FOR UPDATE`,
      [req.session.customerId]
    );

    // 2. Lock & verify target address ownership
    const targetResult = await client.query(
      `SELECT * FROM customer_addresses WHERE id = $1 AND customer_id = $2 FOR UPDATE`,
      [id, req.session.customerId]
    );

    if (targetResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    const wasDefault = targetResult.rows[0].is_default;

    // 3. Delete target row
    await client.query(
      `DELETE FROM customer_addresses WHERE id = $1 AND customer_id = $2`,
      [id, req.session.customerId]
    );

    // 4. Auto-promote most recently created remaining address if default was deleted
    if (wasDefault) {
      const remainingResult = await client.query(
        `SELECT id FROM customer_addresses WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [req.session.customerId]
      );

      if (remainingResult.rows.length > 0) {
        const nextDefaultId = remainingResult.rows[0].id;
        await client.query(
          `UPDATE customer_addresses SET is_default = TRUE WHERE id = $1`,
          [nextDefaultId]
        );
      }
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("DELETE_ADDRESS_ERROR", "Failed to delete address", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to delete address",
    });
  } finally {
    client.release();
  }
});
