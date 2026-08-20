"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setElevatedAccessSchema = exports.reassignStaffSchema = exports.assignStaffSchema = exports.completeVisitSchema = exports.transitionVisitStatusSchema = exports.updateStaffStatusSchema = exports.createStaffSchema = exports.staffLoginSchema = exports.updateCustomerIntakeSchema = exports.rebookBookingSchema = exports.changeBookingAddressSchema = exports.rescheduleBookingSchema = exports.updateCustomerAddressSchema = exports.customerAddressSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.registerSchema = exports.loginSchema = exports.bookingSchema = exports.appointmentSlotSchema = exports.serviceSchema = exports.indianPhoneSchema = exports.bookingAddressSchema = exports.addressSchema = exports.customerIdSchema = exports.customerNameSchema = void 0;
const zod_1 = require("zod");
exports.customerNameSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50),
    lastName: zod_1.z.string().min(1).max(50),
});
exports.customerIdSchema = zod_1.z.string().uuid();
exports.addressSchema = zod_1.z.object({
    street: zod_1.z.string().min(1).max(100),
    city: zod_1.z.string().min(1).max(50),
    state: zod_1.z.string().min(2).max(50),
    postalCode: zod_1.z.string().regex(/^[1-9][0-9]{5}$/, "Please provide a valid 6-digit Indian PIN code"),
    country: zod_1.z.string().min(1).max(50).default("India"),
});
exports.bookingAddressSchema = zod_1.z.object({
    street: zod_1.z.string().min(1).max(100),
    city: zod_1.z.string().min(1).max(50),
    state: zod_1.z.string().min(2).max(50),
    postalCode: zod_1.z.string().regex(/^[1-9][0-9]{5}$/, "Please provide a valid 6-digit Indian PIN code"),
});
exports.indianPhoneSchema = zod_1.z
    .string()
    .regex(/^(\+91[\-\s]?)?[6789]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");
exports.serviceSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
    durationMinutes: zod_1.z.number().int().positive(),
    price: zod_1.z.number().positive(),
});
exports.appointmentSlotSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    isAvailable: zod_1.z.boolean(),
});
exports.bookingSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid(),
    serviceId: zod_1.z.string().uuid(),
    appointmentSlotId: zod_1.z.string().uuid(),
    addressId: zod_1.z.string().uuid().optional(),
    customerIntakeNotes: zod_1.z.string().max(1000).optional(),
});
exports.loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
});
exports.registerSchema = zod_1.z.object({
    name: exports.customerNameSchema,
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
exports.updateProfileSchema = zod_1.z.object({
    name: exports.customerNameSchema,
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8),
});
exports.customerAddressSchema = exports.bookingAddressSchema.extend({
    label: zod_1.z.string().min(1).max(50).optional().default("Home"),
    isDefault: zod_1.z.boolean().optional().default(false),
});
exports.updateCustomerAddressSchema = exports.customerAddressSchema.partial();
exports.rescheduleBookingSchema = zod_1.z.object({
    newAppointmentSlotId: zod_1.z.string().uuid(),
});
exports.changeBookingAddressSchema = zod_1.z.object({
    addressId: zod_1.z.string().uuid(),
});
exports.rebookBookingSchema = zod_1.z.object({
    appointmentSlotId: zod_1.z.string().uuid(),
    addressId: zod_1.z.string().uuid(),
    customerIntakeNotes: zod_1.z.string().max(1000).optional(),
});
exports.updateCustomerIntakeSchema = zod_1.z.object({
    intakeNotes: zod_1.z.string().max(1000),
});
// ---------------------------------------------------------------------------
// Phase 2H: Staff & Visit Validation Schemas
// ---------------------------------------------------------------------------
exports.staffLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.createStaffSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email().max(150),
    password: zod_1.z.string().min(8).max(100),
    specialty: zod_1.z.string().max(100).optional(),
    phone: zod_1.z.string().max(20).optional(),
});
exports.updateStaffStatusSchema = zod_1.z.object({
    isActive: zod_1.z.boolean(),
});
exports.transitionVisitStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["EN_ROUTE", "IN_PROGRESS"]),
});
exports.completeVisitSchema = zod_1.z.object({
    staffNotes: zod_1.z.string().min(1).max(5000),
    customerSummary: zod_1.z.string().min(1).max(1000),
    participatingStaffIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
exports.assignStaffSchema = zod_1.z.object({
    staffIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
});
exports.reassignStaffSchema = zod_1.z.object({
    removeStaffId: zod_1.z.string().uuid(),
    addStaffId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().min(1).max(255),
});
exports.setElevatedAccessSchema = zod_1.z.object({
    hasElevatedAccess: zod_1.z.boolean(),
});
