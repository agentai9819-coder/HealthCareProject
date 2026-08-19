-- Phase 2H Migration: Staff, Visits, Multi-Staff Assignments, and Audit History

-- 1. Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'STAFF' CHECK (role IN ('STAFF', 'ADMIN')),
  specialty VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "IDX_staff_email" ON staff(email);
CREATE INDEX IF NOT EXISTS "IDX_staff_is_active" ON staff(is_active);

-- 2. Add customer_intake_notes to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_intake_notes VARCHAR(1000) DEFAULT NULL;

-- 3. Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  en_route_at TIMESTAMP DEFAULT NULL,
  in_progress_at TIMESTAMP DEFAULT NULL,
  completed_at TIMESTAMP DEFAULT NULL,
  completed_by_staff_id UUID DEFAULT NULL REFERENCES staff(id) ON DELETE RESTRICT,
  staff_notes TEXT DEFAULT NULL,
  customer_summary VARCHAR(1000) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "IDX_visits_booking_id" ON visits(booking_id);
CREATE INDEX IF NOT EXISTS "IDX_visits_status" ON visits(status);

-- 4. Create visit_staff_assignments junction table
CREATE TABLE IF NOT EXISTS visit_staff_assignments (
  id UUID PRIMARY KEY,
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE RESTRICT,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
  assigned_by_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_participating BOOLEAN NOT NULL DEFAULT FALSE,
  has_elevated_access BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  unassigned_at TIMESTAMP DEFAULT NULL,
  reassignment_reason VARCHAR(255) DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_vsa_visit_id" ON visit_staff_assignments(visit_id);
CREATE INDEX IF NOT EXISTS "IDX_vsa_staff_id" ON visit_staff_assignments(staff_id);

-- Enforce maximum 1 active assignment per staff member per visit
CREATE UNIQUE INDEX IF NOT EXISTS "UNIQ_active_staff_visit" 
ON visit_staff_assignments (visit_id, staff_id) 
WHERE is_active = TRUE;

-- 5. Create visit_status_history audit table
CREATE TABLE IF NOT EXISTS visit_status_history (
  id UUID PRIMARY KEY,
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE RESTRICT,
  from_status VARCHAR(20) NOT NULL,
  to_status VARCHAR(20) NOT NULL,
  actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('STAFF', 'ADMIN', 'CUSTOMER', 'SYSTEM')),
  actor_id UUID DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "IDX_vsh_visit_id" ON visit_status_history(visit_id);
