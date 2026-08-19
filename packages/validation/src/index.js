import { z } from "zod";
export const customerNameSchema = z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
});
export const customerIdSchema = z.string().uuid();
export const addressSchema = z.object({
    street: z.string().min(1).max(100),
    city: z.string().min(1).max(50),
    state: z.string().length(2),
    postalCode: z.string().min(3).max(10),
    country: z.string().min(1).max(50),
});
export const bookingAddressSchema = z.object({
    street: z.string().min(1).max(100),
    city: z.string().min(1).max(50),
    state: z.string().length(2),
    postalCode: z.string().min(3).max(10),
});
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
