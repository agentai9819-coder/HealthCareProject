const assert = require("assert");
const {
  addressSchema,
  bookingAddressSchema,
  indianPhoneSchema,
  customerNameSchema,
  registerSchema,
  loginSchema,
  bookingSchema,
  serviceSchema,
} = require("../dist/index");

console.log("▶ Running packages/validation test suite...");

// 1. Indian Address Validation
{
  const validIndianAddress = {
    street: "Flat 402, Lotus Greens, Sector 78",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
    country: "India",
  };
  const result = addressSchema.safeParse(validIndianAddress);
  assert.strictEqual(result.success, true, "Valid Indian address should pass validation");

  const invalidPinAddress = {
    street: "123 Main St",
    city: "Delhi",
    state: "Delhi",
    postalCode: "12345", // Invalid 5-digit PIN
    country: "India",
  };
  const failResult = addressSchema.safeParse(invalidPinAddress);
  assert.strictEqual(failResult.success, false, "Invalid PIN code should fail validation");
  console.log("  ✔ Indian Address & PIN code validation passed");
}

// 2. Indian Phone Number Validation
{
  const validPhone1 = "+919876543210";
  const validPhone2 = "9876543210";
  const invalidPhone = "123456";

  assert.strictEqual(indianPhoneSchema.safeParse(validPhone1).success, true, "+91 format phone should pass");
  assert.strictEqual(indianPhoneSchema.safeParse(validPhone2).success, true, "10-digit mobile should pass");
  assert.strictEqual(indianPhoneSchema.safeParse(invalidPhone).success, false, "Short phone number should fail");
  console.log("  ✔ Indian Phone number validation (+91 / 10-digit) passed");
}

// 3. Customer Registration & Password Match Validation
{
  const validRegistration = {
    name: { firstName: "Aarav", lastName: "Sharma" },
    email: "aarav.sharma@example.com",
    password: "SecurePassword123!",
    confirmPassword: "SecurePassword123!",
  };
  assert.strictEqual(registerSchema.safeParse(validRegistration).success, true, "Matching passwords should pass");

  const mismatchRegistration = {
    name: { firstName: "Aarav", lastName: "Sharma" },
    email: "aarav.sharma@example.com",
    password: "SecurePassword123!",
    confirmPassword: "DifferentPassword123!",
  };
  const mismatchResult = registerSchema.safeParse(mismatchRegistration);
  assert.strictEqual(mismatchResult.success, false, "Mismatched passwords must fail");
  console.log("  ✔ Registration & password verification passed");
}

// 4. Booking Schema Validation
{
  const validBooking = {
    customerId: "11111111-1111-4111-a111-111111111111",
    serviceId: "22222222-2222-4222-a222-222222222222",
    appointmentSlotId: "33333333-3333-4333-a333-333333333333",
    customerIntakeNotes: "Post-surgery recovery assistance needed.",
  };
  assert.strictEqual(bookingSchema.safeParse(validBooking).success, true, "Valid booking payload should pass");
  console.log("  ✔ Booking payload schema passed");
}

console.log("✅ All validation tests passed successfully!\n");
