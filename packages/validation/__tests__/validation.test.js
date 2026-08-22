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
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  sanitizeText,
  sanitizeFormulaCell,
  uuidParamSchema,
  listVisitsQuerySchema,
} = require("../dist/index");

console.log("▶ Running packages/validation test suite...");

// 1. Indian Address Validation & Sanitization
{
  const validIndianAddress = {
    street: "Flat 402, Lotus Greens, Sector 78 <script>alert(1)</script>",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
    country: "India",
  };
  const result = addressSchema.safeParse(validIndianAddress);
  assert.strictEqual(result.success, true, "Valid Indian address should pass validation");
  assert.strictEqual(result.data.street, "Flat 402, Lotus Greens, Sector 78", "Street must be sanitized of HTML tags");

  const invalidPinAddress = {
    street: "123 Main St",
    city: "Delhi",
    state: "Delhi",
    postalCode: "12345", // Invalid 5-digit PIN
    country: "India",
  };
  const failResult = addressSchema.safeParse(invalidPinAddress);
  assert.strictEqual(failResult.success, false, "Invalid PIN code should fail validation");
  console.log("  ✔ Indian Address & PIN code validation and sanitization passed");
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

// 3. Customer Registration, Password Match & Name Sanitization
{
  const validRegistration = {
    name: { firstName: "Aarav<b>", lastName: "Sharma" },
    email: "aarav.sharma@example.com",
    password: "SecurePassword123!",
    confirmPassword: "SecurePassword123!",
  };
  const regResult = registerSchema.safeParse(validRegistration);
  assert.strictEqual(regResult.success, true, "Matching passwords should pass");
  assert.strictEqual(regResult.data.name.firstName, "Aarav", "First name must have tags stripped");

  const mismatchRegistration = {
    name: { firstName: "Aarav", lastName: "Sharma" },
    email: "aarav.sharma@example.com",
    password: "SecurePassword123!",
    confirmPassword: "DifferentPassword123!",
  };
  const mismatchResult = registerSchema.safeParse(mismatchRegistration);
  assert.strictEqual(mismatchResult.success, false, "Mismatched passwords must fail");
  console.log("  ✔ Registration, password verification & name sanitization passed");
}

// 4. Booking Schema Validation & Intake Sanitization
{
  const validBooking = {
    customerId: "11111111-1111-4111-a111-111111111111",
    serviceId: "22222222-2222-4222-a222-222222222222",
    appointmentSlotId: "33333333-3333-4333-a333-333333333333",
    customerIntakeNotes: "Post-surgery recovery <script>evil()</script>assistance needed.",
  };
  const bookingResult = bookingSchema.safeParse(validBooking);
  assert.strictEqual(bookingResult.success, true, "Valid booking payload should pass");
  assert.strictEqual(
    bookingResult.data.customerIntakeNotes,
    "Post-surgery recovery assistance needed.",
    "Intake notes must be sanitized"
  );
  console.log("  ✔ Booking payload schema and sanitization passed");
}

// 5. Forgot Password & Reset Password Validation
{
  assert.strictEqual(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success, true);
  assert.strictEqual(forgotPasswordSchema.safeParse({ email: "invalid-email" }).success, false);

  const validReset = {
    token: "sample-32-byte-hex-crypto-token",
    newPassword: "NewSecurePassword123!",
    confirmPassword: "NewSecurePassword123!",
  };
  assert.strictEqual(resetPasswordSchema.safeParse(validReset).success, true);

  const mismatchReset = {
    token: "sample-32-byte-hex-crypto-token",
    newPassword: "NewSecurePassword123!",
    confirmPassword: "WrongConfirmation123!",
  };
  assert.strictEqual(resetPasswordSchema.safeParse(mismatchReset).success, false);

  const shortPasswordReset = {
    token: "sample-token",
    newPassword: "short",
    confirmPassword: "short",
  };
  assert.strictEqual(resetPasswordSchema.safeParse(shortPasswordReset).success, false);
  console.log("  ✔ Forgot & Reset password schema validation passed");
}

// 6. Email Verification Validation
{
  assert.strictEqual(verifyEmailSchema.safeParse({ token: "valid-token-string" }).success, true);
  assert.strictEqual(verifyEmailSchema.safeParse({ token: "" }).success, false);

  assert.strictEqual(resendVerificationSchema.safeParse({ email: "patient@example.com" }).success, true);
  assert.strictEqual(resendVerificationSchema.safeParse({ email: "not-an-email" }).success, false);
  console.log("  ✔ Email verification & resend schemas passed");
}

// 7. Sanitization & Formula Escaping Helpers
{
  assert.strictEqual(sanitizeText("<img src=x onerror=alert(1)>Dr. Priya"), "Dr. Priya");
  assert.strictEqual(sanitizeFormulaCell("=cmd|' /C calc'!A0"), "'=cmd|' /C calc'!A0");
  assert.strictEqual(sanitizeFormulaCell("+12345"), "'+12345");
  assert.strictEqual(sanitizeFormulaCell("Normal Text"), "Normal Text");
  console.log("  ✔ Sanitization and formula escaping helpers passed");
}

// 8. UUID and Query Schemas
{
  assert.strictEqual(uuidParamSchema.safeParse("11111111-1111-4111-a111-111111111111").success, true);
  assert.strictEqual(uuidParamSchema.safeParse("invalid-id").success, false);

  assert.strictEqual(listVisitsQuerySchema.safeParse({ status: "CONFIRMED", date: "2026-08-25" }).success, true);
  assert.strictEqual(listVisitsQuerySchema.safeParse({ status: "INVALID_STATUS" }).success, false);
  assert.strictEqual(listVisitsQuerySchema.safeParse({ date: "2026/08/25" }).success, false);
  console.log("  ✔ UUID param and Query schema validation passed");
}

console.log("✅ All validation tests passed successfully!\n");
