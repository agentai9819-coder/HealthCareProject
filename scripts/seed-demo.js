const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/healthcare',
});

async function seedDemoData() {
  console.log('--- SEEDING DEMO ACCOUNTS AND APPOINTMENT SLOTS FOR HUMAN UI TESTING ---');
  const password = process.env.DEMO_SEED_PASSWORD || 'DevDemoPass_2026!';
  const passwordHash = await bcrypt.hash(password, 10);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Seed Demo Admin Account
    await client.query(
      `INSERT INTO staff (id, email, password_hash, name, role, phone, specialty, is_active)
       VALUES (gen_random_uuid(), 'admin@homecare.local', $1, 'Admin Sarah (Ops Director)', 'ADMIN', '555-0100', 'Operations & Dispatch', TRUE)
       ON CONFLICT (email) DO UPDATE SET password_hash = $1, is_active = TRUE, role = 'ADMIN'`,
      [passwordHash]
    );
    console.log('✓ Demo Admin seeded: admin@homecare.local (Password: configured via DEMO_SEED_PASSWORD)');

    // 2. Seed Demo Staff Clinicians
    await client.query(
      `INSERT INTO staff (id, email, password_hash, name, role, phone, specialty, is_active)
       VALUES (gen_random_uuid(), 'nurse.david@homecare.local', $1, 'Nurse David (RN)', 'STAFF', '555-0101', 'Wound Care & Vitals', TRUE)
       ON CONFLICT (email) DO UPDATE SET password_hash = $1, is_active = TRUE, role = 'STAFF'`,
      [passwordHash]
    );
    console.log('✓ Demo Staff seeded: nurse.david@homecare.local');

    await client.query(
      `INSERT INTO staff (id, email, password_hash, name, role, phone, specialty, is_active)
       VALUES (gen_random_uuid(), 'pt.elena@homecare.local', $1, 'Elena Rostova (PT)', 'STAFF', '555-0102', 'Physical Therapy & Rehab', TRUE)
       ON CONFLICT (email) DO UPDATE SET password_hash = $1, is_active = TRUE, role = 'STAFF'`,
      [passwordHash]
    );
    console.log('✓ Demo Staff seeded: pt.elena@homecare.local');

    // 3. Seed Demo Customer Account
    const custRes = await client.query(
      `INSERT INTO customers (id, email, password_hash, name)
       VALUES (gen_random_uuid(), 'patient.alice@example.com', $1, 'Alice Walker')
       ON CONFLICT (email) DO UPDATE SET password_hash = $1, name = 'Alice Walker'
       RETURNING id`,
      [passwordHash]
    );
    const customerId = custRes.rows[0].id;
    console.log('✓ Demo Customer seeded: patient.alice@example.com');

    // 4. Seed Saved Default Address for Alice
    await client.query(
      `INSERT INTO customer_addresses (id, customer_id, label, street, city, state, postal_code, is_default)
       VALUES (gen_random_uuid(), $1, 'Home', '742 Evergreen Terrace Apt 2B', 'Springfield', 'OR', '97477', TRUE)
       ON CONFLICT DO NOTHING`,
      [customerId]
    );
    console.log('✓ Demo Customer default address seeded: 742 Evergreen Terrace Apt 2B, Springfield, OR');

    // 5. Seed Generous Future Appointment Slots for all services in high-speed Batches
    const servicesRes = await client.query(`SELECT id, name FROM services`);
    const slotItems = [];

    for (const service of servicesRes.rows) {
      // Create slots for today and next 5 days
      for (let dayOffset = 0; dayOffset <= 5; dayOffset++) {
        for (const hour of [9, 11, 14, 16]) {
          const startTime = new Date();
          startTime.setDate(startTime.getDate() + dayOffset);
          startTime.setHours(hour, 0, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 60);

          // Only insert if startTime is in the future
          if (startTime > new Date()) {
            slotItems.push({
              serviceId: service.id,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            });
          }
        }
      }
    }

    let slotsAdded = 0;
    if (slotItems.length > 0) {
      // Chunk batches by 100 to avoid oversized param lists
      const chunkSize = 100;
      for (let i = 0; i < slotItems.length; i += chunkSize) {
        const chunk = slotItems.slice(i, i + chunkSize);
        const valueClauses = [];
        const params = [];
        let paramIdx = 1;

        for (const item of chunk) {
          valueClauses.push(`(gen_random_uuid(), $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, TRUE)`);
          params.push(item.serviceId, item.startTime, item.endTime);
        }

        const batchRes = await client.query(
          `INSERT INTO appointment_slots (id, service_id, start_time, end_time, is_available)
           VALUES ${valueClauses.join(', ')}
           ON CONFLICT DO NOTHING`,
          params
        );
        slotsAdded += batchRes.rowCount;
      }
    }
    console.log(`✓ Batched and inserted ${slotsAdded} fresh future appointment slots across active clinical services`);

    await client.query('COMMIT');
    console.log('\nDEMO SEEDING COMPLETED SUCCESSFULLY!\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Demo seeding failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDemoData().catch(() => process.exit(1));
