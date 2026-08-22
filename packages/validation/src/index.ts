import { z } from "zod";

/**
 * Strips HTML tags, trims whitespace, and removes dangerous control characters
 * to prevent Stored XSS and script injection attacks.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Strip script tags & content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Strip style tags & content
    .replace(/<[^>]*>?/gm, "") // Strip all remaining HTML tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // Strip dangerous control characters
    .trim();
}

/**
 * Neutralizes CSV / Spreadsheet Formula Injection (CWE-1236).
 * Prepends a single quote if the string begins with =, +, -, @, \t, or \r.
 */
export function sanitizeFormulaCell(val: string | null | undefined): string {
  if (val === null || val === undefined) return "";
  const raw = String(val);
  if (/^[=+\-@\t\r]/.test(raw)) {
    return `'${raw}`;
  }
  const trimmed = raw.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

export const customerNameSchema = z.object({
  firstName: z.string().min(1).max(50).transform(sanitizeText),
  lastName: z.string().min(1).max(50).transform(sanitizeText),
});

export const customerIdSchema = z.string().uuid();
export const uuidParamSchema = z.string().uuid("Invalid UUID parameter format");

export const addressSchema = z.object({
  street: z.string().min(1).max(100).transform(sanitizeText),
  city: z.string().min(1).max(50).transform(sanitizeText),
  state: z.string().min(2).max(50).transform(sanitizeText),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Please provide a valid 6-digit Indian PIN code"),
  country: z.string().min(1).max(50).default("India").transform(sanitizeText),
});

export const bookingAddressSchema = z.object({
  street: z.string().min(1).max(100).transform(sanitizeText),
  city: z.string().min(1).max(50).transform(sanitizeText),
  state: z.string().min(2).max(50).transform(sanitizeText),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Please provide a valid 6-digit Indian PIN code"),
});

export const indianPhoneSchema = z
  .string()
  .regex(/^(\+91[\-\s]?)?[6789]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).transform(sanitizeText),
  description: z.string().max(500).transform(sanitizeText).optional(),
  durationMinutes: z.number().int().positive(),
  price: z.number().positive(),
});

export const appointmentSlotSchema = z.object({
  id: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  isAvailable: z.boolean(),
});

export const bookingSchema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  appointmentSlotId: z.string().uuid(),
  addressId: z.string().uuid().optional(),
  customerIntakeNotes: z.string().max(1000).transform(sanitizeText).optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1).transform(sanitizeText),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: customerNameSchema,
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  name: customerNameSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Password reset token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirmation password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export const customerAddressSchema = bookingAddressSchema.extend({
  label: z.string().min(1).max(50).transform(sanitizeText).optional().default("Home"),
  isDefault: z.boolean().optional().default(false),
});

export const updateCustomerAddressSchema = customerAddressSchema.partial();

export const rescheduleBookingSchema = z.object({
  newAppointmentSlotId: z.string().uuid(),
});

export const changeBookingAddressSchema = z.object({
  addressId: z.string().uuid(),
});

export const rebookBookingSchema = z.object({
  appointmentSlotId: z.string().uuid(),
  addressId: z.string().uuid(),
  customerIntakeNotes: z.string().max(1000).transform(sanitizeText).optional(),
});

export const updateCustomerIntakeSchema = z.object({
  intakeNotes: z.string().max(1000).transform(sanitizeText),
});

// ---------------------------------------------------------------------------
// Staff & Visit Validation Schemas
// ---------------------------------------------------------------------------

export const staffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createStaffSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeText),
  email: z.string().email().max(150),
  password: z.string().min(8).max(100),
  specialty: z.string().max(100).transform(sanitizeText).optional(),
  phone: z.string().max(20).transform(sanitizeText).optional(),
});

export const updateStaffStatusSchema = z.object({
  isActive: z.boolean(),
});

export const transitionVisitStatusSchema = z.object({
  status: z.enum(["EN_ROUTE", "IN_PROGRESS"]),
});

export const completeVisitSchema = z.object({
  staffNotes: z.string().min(1).max(5000).transform(sanitizeText),
  customerSummary: z.string().min(1).max(1000).transform(sanitizeText),
  participatingStaffIds: z.array(z.string().uuid()).optional(),
});

export const assignStaffSchema = z.object({
  staffIds: z.array(z.string().uuid()).min(1),
});

export const reassignStaffSchema = z.object({
  removeStaffId: z.string().uuid(),
  addStaffId: z.string().uuid(),
  reason: z.string().min(1).max(255).transform(sanitizeText),
});

export const setElevatedAccessSchema = z.object({
  hasElevatedAccess: z.boolean(),
});

export const listVisitsQuerySchema = z.object({
  status: z
    .enum(["CONFIRMED", "EN_ROUTE", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
});