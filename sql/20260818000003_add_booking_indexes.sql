-- Phase 2C Migration: Performance indexes for customer bookings and slot availability
CREATE INDEX IF NOT EXISTS "IDX_bookings_customer_id" ON bookings (customer_id);
CREATE INDEX IF NOT EXISTS "IDX_appointment_slots_service_avail" ON appointment_slots (service_id, is_available, start_time);
