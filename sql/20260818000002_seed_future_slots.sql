-- Seed default service if not already present
INSERT INTO services (id, name, description, duration_minutes, price)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Home Health Assessment',
  'Comprehensive in-home health evaluation by a licensed nurse',
  60,
  150.00
)
ON CONFLICT (id) DO NOTHING;

-- Seed future appointment slots for 2026
INSERT INTO appointment_slots (id, service_id, start_time, end_time, is_available)
VALUES
  ('c3d4e5f6-a7b8-9012-cdef-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2026-09-01 09:00:00', '2026-09-01 10:00:00', TRUE),
  ('d4e5f6a7-b8c9-0123-defa-456789012345', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2026-09-01 11:00:00', '2026-09-01 12:00:00', TRUE),
  ('e5f6a7b8-c9d0-1234-efab-567890123456', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2026-09-01 14:00:00', '2026-09-01 15:00:00', TRUE),
  ('f6a7b8c9-d0e1-2345-fabc-678901234567', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2026-09-02 09:00:00', '2026-09-02 10:00:00', TRUE),
  ('a7b8c9d0-e1f2-3456-abcd-789012345678', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2026-09-02 11:00:00', '2026-09-02 12:00:00', TRUE)
ON CONFLICT (id) DO NOTHING;
