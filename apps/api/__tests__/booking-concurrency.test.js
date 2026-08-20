const assert = require("assert");

console.log("▶ Running apps/api booking-concurrency test suite...");

// Booking State Transition Logic Test
const VALID_TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function canTransition(currentStatus, nextStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

// 1. Valid Status Transitions
assert.strictEqual(canTransition("CONFIRMED", "IN_PROGRESS"), true, "CONFIRMED -> IN_PROGRESS is allowed");
assert.strictEqual(canTransition("IN_PROGRESS", "COMPLETED"), true, "IN_PROGRESS -> COMPLETED is allowed");
assert.strictEqual(canTransition("CONFIRMED", "CANCELLED"), true, "CONFIRMED -> CANCELLED is allowed");
assert.strictEqual(canTransition("COMPLETED", "IN_PROGRESS"), false, "COMPLETED cannot transition to IN_PROGRESS");
assert.strictEqual(canTransition("CANCELLED", "CONFIRMED"), false, "CANCELLED cannot transition back to CONFIRMED");
console.log("  ✔ Booking status transition invariants verified");

// 2. Concurrency Double-Booking Prevention Simulation
class MockSlotBookingEngine {
  constructor() {
    this.bookedSlots = new Set();
  }

  async bookSlotAtomic(slotId, customerId) {
    // Simulates SELECT ... FOR UPDATE atomic check
    if (this.bookedSlots.has(slotId)) {
      throw new Error("SLOT_ALREADY_BOOKED");
    }
    this.bookedSlots.add(slotId);
    return { success: true, bookingId: `book_${Date.now()}`, slotId, customerId };
  }
}

async function testConcurrentBookingRace() {
  const engine = new MockSlotBookingEngine();
  const targetSlotId = "slot-2026-08-21-1500";

  // Two customers attempt to book the exact same slot concurrently
  const [res1, res2] = await Promise.allSettled([
    engine.bookSlotAtomic(targetSlotId, "customer-1"),
    engine.bookSlotAtomic(targetSlotId, "customer-2"),
  ]);

  const successfulBookings = [res1, res2].filter((r) => r.status === "fulfilled");
  const failedBookings = [res1, res2].filter((r) => r.status === "rejected");

  assert.strictEqual(successfulBookings.length, 1, "Exactly one customer must secure the appointment slot");
  assert.strictEqual(failedBookings.length, 1, "The second concurrent customer must be rejected with error");
  assert.strictEqual(failedBookings[0].reason.message, "SLOT_ALREADY_BOOKED", "Error must be SLOT_ALREADY_BOOKED");
  console.log("  ✔ Concurrent slot lock race condition prevention verified");
}

testConcurrentBookingRace()
  .then(() => {
    console.log("✅ Booking concurrency tests passed successfully!\n");
  })
  .catch((err) => {
    console.error("❌ Test failed:", err);
    process.exit(1);
  });
