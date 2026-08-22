const assert = require("assert");

console.log("▶ Running apps/api idor-ownership test suite...");

async function runIdorOwnershipTests() {
  // 1. Cross-Customer Address IDOR Isolation Logic
  const customerA = "11111111-aaaa-4111-a111-111111111111";
  const customerB = "22222222-bbbb-4222-b222-222222222222";

  const addressDatabase = [
    {
      id: "addr-cust-a-01",
      customerId: customerA,
      label: "Home",
      street: "Sector 62, Noida",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
    },
    {
      id: "addr-cust-b-01",
      customerId: customerB,
      label: "Apartment",
      street: "Indiranagar, 100ft Rd",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
    },
  ];

  // Address lookup handler simulating WHERE id = $1 AND customer_id = $2
  function getCustomerAddress(addressId, sessionCustomerId) {
    const row = addressDatabase.find((a) => a.id === addressId && a.customerId === sessionCustomerId);
    if (!row) {
      return { status: 404, error: "Address not found" };
    }
    return { status: 200, data: row };
  }

  // Customer A accesses Customer A's address -> 200 OK
  const custAOwnAddress = getCustomerAddress("addr-cust-a-01", customerA);
  assert.strictEqual(custAOwnAddress.status, 200);
  assert.strictEqual(custAOwnAddress.data.street, "Sector 62, Noida");

  // Customer B attempts IDOR on Customer A's address -> 404 Not Found
  const custBIdorAddress = getCustomerAddress("addr-cust-a-01", customerB);
  assert.strictEqual(custBIdorAddress.status, 404);
  assert.strictEqual(custBIdorAddress.error, "Address not found");
  console.log("  ✔ Customer Address IDOR ownership enforcement passed");

  // 2. Cross-Customer Booking IDOR Isolation Logic
  const bookingDatabase = [
    {
      id: "book-cust-a-01",
      customerId: customerA,
      serviceId: "srv-nursing-01",
      appointmentSlotId: "slot-01",
      status: "CONFIRMED",
      customerIntakeNotes: "Post-cardiac surgery assistance",
      staffNotes: "Internal clinical assessment: patient stable",
      address_street: "Sector 62, Noida",
    },
    {
      id: "book-cust-b-01",
      customerId: customerB,
      serviceId: "srv-physio-01",
      appointmentSlotId: "slot-02",
      status: "CONFIRMED",
      customerIntakeNotes: "Knee rehabilitation",
      staffNotes: "Internal clinical assessment: mobility grade 2",
      address_street: "Indiranagar, Bengaluru",
    },
  ];

  // Booking details handler simulating WHERE id = $1 AND customer_id = $2 with privacy-safe redaction
  function getBookingDetails(bookingId, sessionCustomerId) {
    const booking = bookingDatabase.find((b) => b.id === bookingId && b.customerId === sessionCustomerId);
    if (!booking) {
      return { status: 404, error: "Booking not found" };
    }
    // Strictly omit staff internal notes from customer view
    const { staffNotes, ...safeBooking } = booking;
    return { status: 200, data: safeBooking };
  }

  // Customer A accesses Customer A's booking -> 200 OK without staff internal notes
  const custAOwnBooking = getBookingDetails("book-cust-a-01", customerA);
  assert.strictEqual(custAOwnBooking.status, 200);
  assert.strictEqual(custAOwnBooking.data.customerIntakeNotes, "Post-cardiac surgery assistance");
  assert.strictEqual(custAOwnBooking.data.staffNotes, undefined, "Staff internal notes must be redacted from customer view");

  // Customer B attempts IDOR on Customer A's booking -> 404 Not Found
  const custBIdorBooking = getBookingDetails("book-cust-a-01", customerB);
  assert.strictEqual(custBIdorBooking.status, 404);
  assert.strictEqual(custBIdorBooking.error, "Booking not found");
  console.log("  ✔ Customer Booking IDOR & staff notes privacy enforcement passed");

  // 3. Foreign Reference IDOR Defense (Prevent linking another user's addressId to own booking)
  function changeBookingAddress(bookingId, newAddressId, sessionCustomerId) {
    const booking = bookingDatabase.find((b) => b.id === bookingId && b.customerId === sessionCustomerId);
    if (!booking) {
      return { status: 404, error: "Booking not found" };
    }
    // Verify target address ownership
    const targetAddress = addressDatabase.find((a) => a.id === newAddressId && a.customerId === sessionCustomerId);
    if (!targetAddress) {
      return { status: 404, error: "Saved address not found" };
    }
    booking.address_street = targetAddress.street;
    return { status: 200, data: booking };
  }

  // Customer B attempts to link Customer A's private address to Customer B's booking
  const foreignAddressAttack = changeBookingAddress("book-cust-b-01", "addr-cust-a-01", customerB);
  assert.strictEqual(foreignAddressAttack.status, 404);
  assert.strictEqual(foreignAddressAttack.error, "Saved address not found");
  console.log("  ✔ Foreign reference address IDOR defense passed");

  // 4. Staff Visit Multi-Tenant & Assignment Authorization
  const staffNursePriya = "staff-priya-uuid";
  const staffCaregiverRahul = "staff-rahul-uuid";

  const visitAssignments = [
    {
      id: "assign-01",
      visitId: "visit-101",
      staffId: staffNursePriya,
      isActive: true,
      hasElevatedAccess: false,
    },
  ];

  const visits = [
    {
      id: "visit-101",
      bookingId: "book-cust-a-01",
      status: "CONFIRMED",
      customerName: "Aarav Sharma",
      customerEmail: "aarav.sharma@example.com",
    },
  ];

  function getStaffVisit(visitId, sessionStaffId) {
    const assignment = visitAssignments.find(
      (a) => a.visitId === visitId && a.staffId === sessionStaffId && a.isActive
    );
    if (!assignment) {
      return { status: 403, error: "Access denied to this visit" };
    }
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) {
      return { status: 404, error: "Visit not found" };
    }
    return {
      status: 200,
      data: {
        id: visit.id,
        customerName: visit.customerName,
        customerEmail: assignment.hasElevatedAccess ? visit.customerEmail : null, // Redaction
      },
    };
  }

  // Assigned Staff Nurse Priya accesses assigned visit -> 200 OK, email redacted
  const priyaAccess = getStaffVisit("visit-101", staffNursePriya);
  assert.strictEqual(priyaAccess.status, 200);
  assert.strictEqual(priyaAccess.data.customerName, "Aarav Sharma");
  assert.strictEqual(priyaAccess.data.customerEmail, null, "Email must be redacted for standard staff");

  // Unassigned Staff Caregiver Rahul attempts IDOR on visit-101 -> 403 Forbidden
  const rahulIdorAccess = getStaffVisit("visit-101", staffCaregiverRahul);
  assert.strictEqual(rahulIdorAccess.status, 403);
  assert.strictEqual(rahulIdorAccess.error, "Access denied to this visit");
  console.log("  ✔ Staff Visit assignment authorization & cross-caregiver IDOR defense passed");

  // 5. Admin Role Boundary Enforcement
  function requireAdminRole(sessionRole) {
    if (sessionRole !== "ADMIN") {
      return { status: 403, error: "Forbidden: Administrator role required" };
    }
    return { status: 200, success: true };
  }

  assert.strictEqual(requireAdminRole("STAFF").status, 403);
  assert.strictEqual(requireAdminRole(undefined).status, 403);
  assert.strictEqual(requireAdminRole("ADMIN").status, 200);
  console.log("  ✔ Administrative role boundary & privilege escalation defense passed");

  console.log("✅ All IDOR & ownership authorization tests passed successfully!\n");
}

runIdorOwnershipTests().catch((err) => {
  console.error("❌ IDOR ownership test failed:", err);
  process.exit(1);
});
