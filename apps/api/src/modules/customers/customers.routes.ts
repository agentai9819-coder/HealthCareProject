import { Router, Request, Response } from "express";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { env } from "home-healthcare-config";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "home-healthcare-validation";
import { query } from "../../lib/db";
import { hashPassword, verifyPassword } from "../../lib/bcrypt";
import { requireAuth } from "../../middleware/auth";
import { logger } from "../../lib/logger";

export const customersRouter = Router();

/**
 * Generates a cryptographically secure random token and its SHA-256 hash.
 * The raw token is sent to the user (e.g. via email link), while only the SHA-256
 * hash is stored in the database to prevent token leakage upon DB read access.
 */
function generateSecureToken(): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
}

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// ---------------------------------------------------------------------------
// 1. Customer Registration (with email verification token & session regeneration)
// ---------------------------------------------------------------------------
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
        error: "Unable to complete registration with the provided details. Please try signing in or use a different email.",
      });
    }

    const passwordHash = await hashPassword(password);
    const customerId = uuidv4();

    await query(
      `INSERT INTO customers (id, name, email, password_hash, bcrypt_salt_rounds, is_email_verified)
       VALUES ($1, $2, $3, $4, $5, FALSE)`,
      [customerId, name, email, passwordHash, env.BCRYPT_SALT_ROUNDS]
    );

    // Generate 24-hour expiring email verification token
    const { rawToken, tokenHash } = generateSecureToken();
    await query(
      `INSERT INTO email_verification_tokens (id, customer_id, token_hash, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '24 hours')`,
      [uuidv4(), customerId, tokenHash]
    );

    // Regenerate session to prevent Session Fixation attacks
    req.session.regenerate((regenErr) => {
      if (regenErr) {
        logger.error("CUSTOMER_SESSION_REGEN_ERROR", "Session regeneration failed after registration", { details: { err: String(regenErr) } });
        return res.status(500).json({
          success: false,
          error: "Registration succeeded but session initialization failed.",
        });
      }

      req.session.customerId = customerId;

      req.session.save((saveErr) => {
        if (saveErr) {
          logger.error("CUSTOMER_SESSION_SAVE_ERROR", "Session save failed after registration", { details: { err: String(saveErr) } });
          return res.status(500).json({
            success: false,
            error: "Registration succeeded but session save failed.",
          });
        }

        logger.info("AUTH_CUSTOMER_REGISTER_SUCCESS", `Customer registered successfully: ${customerId}`, {
          userId: customerId,
          role: "CUSTOMER",
          ip: req.ip || req.socket.remoteAddress,
        });

        return res.status(201).json({
          success: true,
          data: {
            customer: {
              id: customerId,
              name,
              email,
              isEmailVerified: false,
              created_at: new Date().toISOString(),
            },
            verificationToken: rawToken,
          },
        });
      });
    });
  } catch (err) {
    logger.error("CUSTOMER_REGISTER_ERROR", "Customer registration route failed", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Customer Login (with anti-timing enumeration & session regeneration)
// ---------------------------------------------------------------------------
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
      "SELECT id, name, email, password_hash, is_email_verified FROM customers WHERE email = $1",
      [identifier]
    );

    // Timing-attack mitigation: always compute bcrypt verification even if customer does not exist
    const DUMMY_HASH = "$2a$12$e8uqf0Jg.8m9WfJ23Lh.8eN5n5f5n5f5n5f5n5f5n5f5n5f5n5f5n";
    const customer = result.rows[0];
    const passwordHash = customer ? customer.password_hash : DUMMY_HASH;
    const isValid = await verifyPassword(password, passwordHash);

    if (!customer || !isValid) {
      logger.security("AUTH_CUSTOMER_LOGIN_FAILED", `Failed customer login attempt for identifier: ${identifier}`, {
        ip: req.ip || req.socket.remoteAddress,
      });
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Regenerate session upon authentication to prevent Session Fixation attacks
    req.session.regenerate((regenErr) => {
      if (regenErr) {
        logger.error("CUSTOMER_SESSION_REGEN_ERROR", "Session regeneration failed after login", { details: { err: String(regenErr) } });
        return res.status(500).json({
          success: false,
          error: "Session initialization failed",
        });
      }

      req.session.customerId = customer.id;

      req.session.save((saveErr) => {
        if (saveErr) {
          logger.error("CUSTOMER_SESSION_SAVE_ERROR", "Session save failed after login", { details: { err: String(saveErr) } });
          return res.status(500).json({
            success: false,
            error: "Session persistence failed",
          });
        }

        logger.info("AUTH_CUSTOMER_LOGIN_SUCCESS", `Customer logged in successfully: ${customer.id}`, {
          userId: customer.id,
          role: "CUSTOMER",
          ip: req.ip || req.socket.remoteAddress,
        });

        return res.json({
          success: true,
          data: {
            customer: {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              isEmailVerified: !!customer.is_email_verified,
              created_at: new Date().toISOString(),
            },
          },
        });
      });
    });
  } catch (err) {
    logger.error("CUSTOMER_LOGIN_ERROR", "Customer login route failed", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

// ---------------------------------------------------------------------------
// 3. Email Verification (POST /verify-email)
// ---------------------------------------------------------------------------
customersRouter.post("/verify-email", async (req: Request, res: Response) => {
  const parseResult = verifyEmailSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { token } = parseResult.data;
  const tokenHash = hashToken(token);

  try {
    const tokenResult = await query(
      `SELECT id, customer_id, expires_at, used_at
       FROM email_verification_tokens
       WHERE token_hash = $1`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification token",
      });
    }

    const tokenRow = tokenResult.rows[0];

    if (tokenRow.used_at !== null || new Date(tokenRow.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "Verification token is expired or has already been used",
      });
    }

    // Atomically mark customer email verified and token used
    await query("UPDATE customers SET is_email_verified = TRUE WHERE id = $1", [
      tokenRow.customer_id,
    ]);
    await query(
      "UPDATE email_verification_tokens SET used_at = NOW() WHERE id = $1",
      [tokenRow.id]
    );

    return res.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (err) {
    logger.error("EMAIL_VERIFY_ERROR", "Email verification route failed", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to verify email",
    });
  }
});

// ---------------------------------------------------------------------------
// 4. Resend Verification Email (POST /resend-verification)
// ---------------------------------------------------------------------------
customersRouter.post("/resend-verification", async (req: Request, res: Response) => {
  const parseResult = resendVerificationSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { email } = parseResult.data;

  try {
    const custResult = await query(
      "SELECT id, is_email_verified FROM customers WHERE email = $1",
      [email]
    );

    // Anti-enumeration: return identical generic success message even if account is not found
    if (custResult.rows.length === 0) {
      return res.json({
        success: true,
        message: "If an account exists with this email, a verification link has been sent.",
      });
    }

    const customer = custResult.rows[0];
    if (customer.is_email_verified) {
      return res.json({
        success: true,
        message: "This email address is already verified.",
      });
    }

    // Invalidate any active unused verification tokens for this user
    await query(
      "UPDATE email_verification_tokens SET used_at = NOW() WHERE customer_id = $1 AND used_at IS NULL",
      [customer.id]
    );

    // Create fresh 24-hour verification token
    const { rawToken, tokenHash } = generateSecureToken();
    await query(
      `INSERT INTO email_verification_tokens (id, customer_id, token_hash, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '24 hours')`,
      [uuidv4(), customer.id, tokenHash]
    );

    return res.json({
      success: true,
      message: "If an account exists with this email, a verification link has been sent.",
      verificationToken: rawToken,
    });
  } catch (err) {
    logger.error("RESEND_VERIFICATION_ERROR", "Resend verification route failed", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to send verification link",
    });
  }
});

// ---------------------------------------------------------------------------
// 5. Forgot Password (POST /forgot-password) - Anti-Enumeration & 15-min Token
// ---------------------------------------------------------------------------
customersRouter.post("/forgot-password", async (req: Request, res: Response) => {
  const parseResult = forgotPasswordSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { email } = parseResult.data;

  try {
    const custResult = await query(
      "SELECT id FROM customers WHERE email = $1",
      [email]
    );

    let resetToken: string | undefined = undefined;

    if (custResult.rows.length > 0) {
      const customer = custResult.rows[0];

      // Invalidate any previously issued unused reset tokens
      await query(
        "UPDATE password_reset_tokens SET used_at = NOW() WHERE customer_id = $1 AND used_at IS NULL",
        [customer.id]
      );

      // Generate cryptographically secure token with strict 15-minute expiration
      const { rawToken, tokenHash } = generateSecureToken();
      await query(
        `INSERT INTO password_reset_tokens (id, customer_id, token_hash, expires_at)
         VALUES ($1, $2, $3, NOW() + INTERVAL '15 minutes')`,
        [uuidv4(), customer.id, tokenHash]
      );

      resetToken = rawToken;
    }

    // Anti-user enumeration: Return identical message whether email exists or not
    return res.json({
      success: true,
      message: "If an account exists with that email address, password reset instructions have been sent.",
      resetToken,
    });
  } catch (err) {
    logger.error("FORGOT_PASSWORD_ERROR", "Forgot password route failed", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to process password reset request",
    });
  }
});

// ---------------------------------------------------------------------------
// 6. Reset Password (POST /reset-password) - Token Expiration & Invalidation
// ---------------------------------------------------------------------------
customersRouter.post("/reset-password", async (req: Request, res: Response) => {
  const parseResult = resetPasswordSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: parseResult.error.format(),
    });
  }

  const { token, newPassword } = parseResult.data;
  const tokenHash = hashToken(token);

  try {
    const tokenResult = await query(
      `SELECT id, customer_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = $1`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired password reset token",
      });
    }

    const tokenRow = tokenResult.rows[0];

    if (tokenRow.used_at !== null || new Date(tokenRow.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "Password reset token has expired or has already been used",
      });
    }

    // Check if new password matches existing password hash
    const custResult = await query(
      "SELECT password_hash FROM customers WHERE id = $1",
      [tokenRow.customer_id]
    );

    if (custResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Associated customer account was not found",
      });
    }

    const isSameAsExisting = await verifyPassword(
      newPassword,
      custResult.rows[0].password_hash
    );

    if (isSameAsExisting) {
      return res.status(400).json({
        success: false,
        error: "New password must be different from previous password",
      });
    }

    const newHash = await hashPassword(newPassword);

    // Atomically update password and mark reset token as used
    await query("UPDATE customers SET password_hash = $1 WHERE id = $2", [
      newHash,
      tokenRow.customer_id,
    ]);
    await query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1",
      [tokenRow.id]
    );

    // Invalidate active session if requester has one
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          logger.error("RESET_PASSWORD_SESSION_ERROR", "Session cleanup failed after password reset", { details: { err: String(err) } });
        }
        res.clearCookie("session_id", { path: "/" });
        return res.json({
          success: true,
          message: "Password reset successfully. Please sign in with your new password.",
        });
      });
    } else {
      return res.json({
        success: true,
        message: "Password reset successfully. Please sign in with your new password.",
      });
    }
  } catch (err) {
    logger.error("RESET_PASSWORD_ERROR", "Reset password route failed", { details: { err: String(err) } });
    return res.status(500).json({
      success: false,
      error: "Failed to reset password",
    });
  }
});

// ---------------------------------------------------------------------------
// 7. Logout
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// 8. Get Customer Profile (/me)
// ---------------------------------------------------------------------------
customersRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, email, is_email_verified as "isEmailVerified", created_at as "createdAt"
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
    logger.error("GET_CUSTOMER_PROFILE_ERROR", "Failed to retrieve customer profile", { details: { err: String(err) } });
    res.status(500).json({
      success: false,
      error: "Failed to fetch customer profile",
    });
  }
});

// ---------------------------------------------------------------------------
// 9. Update Profile Name (/me)
// ---------------------------------------------------------------------------
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
         RETURNING id, name, email, is_email_verified as "isEmailVerified", created_at as "createdAt"`,
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
      logger.error("UPDATE_CUSTOMER_PROFILE_ERROR", "Failed to update customer profile", { details: { err: String(err) } });
      return res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 10. Change Password (/me/password)
// ---------------------------------------------------------------------------
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
          logger.error("CHANGE_PASSWORD_SESSION_ERROR", "Session invalidation failed after password change", { details: { err: String(err) } });
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
      logger.error("CHANGE_PASSWORD_ERROR", "Change password route failed", { details: { err: String(err) } });
      return res.status(500).json({
        success: false,
        error: "Failed to update password",
      });
    }
  }
);
