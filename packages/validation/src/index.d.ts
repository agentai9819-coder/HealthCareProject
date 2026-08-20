import { z } from "zod";
export declare const customerNameSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
}, {
    firstName: string;
    lastName: string;
}>;
export declare const customerIdSchema: z.ZodString;
export declare const addressSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string | undefined;
}>;
export declare const bookingAddressSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
}, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
}>;
export declare const indianPhoneSchema: z.ZodString;
export declare const serviceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    durationMinutes: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
    description?: string | undefined;
}, {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
    description?: string | undefined;
}>;
export declare const appointmentSlotSchema: z.ZodObject<{
    id: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    isAvailable: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}, {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}>;
export declare const bookingSchema: z.ZodObject<{
    customerId: z.ZodString;
    serviceId: z.ZodString;
    appointmentSlotId: z.ZodString;
    addressId: z.ZodOptional<z.ZodString>;
    customerIntakeNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    serviceId: string;
    appointmentSlotId: string;
    addressId?: string | undefined;
    customerIntakeNotes?: string | undefined;
}, {
    customerId: string;
    serviceId: string;
    appointmentSlotId: string;
    addressId?: string | undefined;
    customerIntakeNotes?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    identifier: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    identifier: string;
    password: string;
}, {
    identifier: string;
    password: string;
}>;
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        firstName: string;
        lastName: string;
    }, {
        firstName: string;
        lastName: string;
    }>;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: {
        firstName: string;
        lastName: string;
    };
    password: string;
    email: string;
    confirmPassword: string;
}, {
    name: {
        firstName: string;
        lastName: string;
    };
    password: string;
    email: string;
    confirmPassword: string;
}>, {
    name: {
        firstName: string;
        lastName: string;
    };
    password: string;
    email: string;
    confirmPassword: string;
}, {
    name: {
        firstName: string;
        lastName: string;
    };
    password: string;
    email: string;
    confirmPassword: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        firstName: string;
        lastName: string;
    }, {
        firstName: string;
        lastName: string;
    }>;
}, "strip", z.ZodTypeAny, {
    name: {
        firstName: string;
        lastName: string;
    };
}, {
    name: {
        firstName: string;
        lastName: string;
    };
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const customerAddressSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
} & {
    label: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isDefault: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    label: string;
    isDefault: boolean;
}, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    label?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const updateCustomerAddressSchema: z.ZodObject<{
    street: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    isDefault: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, "strip", z.ZodTypeAny, {
    street?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    label?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    street?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    label?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const rescheduleBookingSchema: z.ZodObject<{
    newAppointmentSlotId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newAppointmentSlotId: string;
}, {
    newAppointmentSlotId: string;
}>;
export declare const changeBookingAddressSchema: z.ZodObject<{
    addressId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    addressId: string;
}, {
    addressId: string;
}>;
export declare const rebookBookingSchema: z.ZodObject<{
    appointmentSlotId: z.ZodString;
    addressId: z.ZodString;
    customerIntakeNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    appointmentSlotId: string;
    addressId: string;
    customerIntakeNotes?: string | undefined;
}, {
    appointmentSlotId: string;
    addressId: string;
    customerIntakeNotes?: string | undefined;
}>;
export declare const updateCustomerIntakeSchema: z.ZodObject<{
    intakeNotes: z.ZodString;
}, "strip", z.ZodTypeAny, {
    intakeNotes: string;
}, {
    intakeNotes: string;
}>;
export declare const staffLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export declare const createStaffSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    specialty: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    password: string;
    email: string;
    specialty?: string | undefined;
    phone?: string | undefined;
}, {
    name: string;
    password: string;
    email: string;
    specialty?: string | undefined;
    phone?: string | undefined;
}>;
export declare const updateStaffStatusSchema: z.ZodObject<{
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
}, {
    isActive: boolean;
}>;
export declare const transitionVisitStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["EN_ROUTE", "IN_PROGRESS"]>;
}, "strip", z.ZodTypeAny, {
    status: "EN_ROUTE" | "IN_PROGRESS";
}, {
    status: "EN_ROUTE" | "IN_PROGRESS";
}>;
export declare const completeVisitSchema: z.ZodObject<{
    staffNotes: z.ZodString;
    customerSummary: z.ZodString;
    participatingStaffIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    staffNotes: string;
    customerSummary: string;
    participatingStaffIds?: string[] | undefined;
}, {
    staffNotes: string;
    customerSummary: string;
    participatingStaffIds?: string[] | undefined;
}>;
export declare const assignStaffSchema: z.ZodObject<{
    staffIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    staffIds: string[];
}, {
    staffIds: string[];
}>;
export declare const reassignStaffSchema: z.ZodObject<{
    removeStaffId: z.ZodString;
    addStaffId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    removeStaffId: string;
    addStaffId: string;
    reason: string;
}, {
    removeStaffId: string;
    addStaffId: string;
    reason: string;
}>;
export declare const setElevatedAccessSchema: z.ZodObject<{
    hasElevatedAccess: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    hasElevatedAccess: boolean;
}, {
    hasElevatedAccess: boolean;
}>;
//# sourceMappingURL=index.d.ts.map