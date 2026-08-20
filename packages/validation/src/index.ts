import { z } from "zod";

export const customerNameSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

export const customerIdSchema = z.string().uuid();

export const addressSchema = z.object({
  street: z.string().min(1).max(100),
  city: z.string().min(1).max(50),
  state: z.string().min(2).max(50),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Please provide a valid 6-digit Indian PIN code"),
  country: z.string().min(1).max(50).default("India"),
});

export const bookingAddressSchema = z.object({
  street: z.string().min(1).max(100),
  city: z.string().min(1).max(50),
  state: z.string().min(2).max(50),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Please provide a valid 6-digit Indian PIN code"),
});

export const indianPhoneSchema = z
  .string()
  .regex(/^(\+91[\-\s]?)?[6789]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
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
  customerIntakeNotes: z.string().max(1000).optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1),
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

export const customerAddressSchema = bookingAddressSchema.extend({
  label: z.string().min(1).max(50).optional().default("Home"),
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
  customerIntakeNotes: z.string().max(1000).optional(),
});

export const updateCustomerIntakeSchema = z.object({
  intakeNotes: z.string().max(1000),
});

// ---------------------------------------------------------------------------
// Phase 2H: Staff & Visit Validation Schemas
// ---------------------------------------------------------------------------

export const staffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createStaffSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  password: z.string().min(8).max(100),
  specialty: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

export const updateStaffStatusSchema = z.object({
  isActive: z.boolean(),
});

export const transitionVisitStatusSchema = z.object({
  status: z.enum(["EN_ROUTE", "IN_PROGRESS"]),
});

export const completeVisitSchema = z.object({
  staffNotes: z.string().min(1).max(5000),
  customerSummary: z.string().min(1).max(1000),
  participatingStaffIds: z.array(z.string().uuid()).optional(),
});

export const assignStaffSchema = z.object({
  staffIds: z.array(z.string().uuid()).min(1),
});

export const reassignStaffSchema = z.object({
  removeStaffId: z.string().uuid(),
  addStaffId: z.string().uuid(),
  reason: z.string().min(1).max(255),
});

export const setElevatedAccessSchema = z.object({
  hasElevatedAccess: z.boolean(),
});