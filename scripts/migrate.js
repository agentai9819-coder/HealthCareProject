const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const envPaths = [
    path.join(__dirname, '..', 'apps', 'api', '.env'),
    path.join(__dirname, '..', '.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('DATABASE_URL=')) {
          return trimmed.substring('DATABASE_URL='.length).trim();
        }
      }
    }
  }

  return 'postgresql://postgres:postgres@localhost:5432/healthcare';
}

async function runMigrations() {
  const connectionString = getDatabaseUrl();
  const pool = new Pool({ connectionString });

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      const appliedRes = await client.query('SELECT name FROM schema_migrations ORDER BY id ASC');
      const appliedSet = new Set(appliedRes.rows.map((r) => r.name));

      const sqlDir = path.join(__dirname, '..', 'sql');
      if (!fs.existsSync(sqlDir)) {
        console.log('[db:migrate] No sql directory found.');
        return;
      }

      const files = fs
        .readdirSync(sqlDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      let appliedCount = 0;
      for (const file of files) {
        if (!appliedSet.has(file)) {
          console.log(`[db:migrate] Applying migration: ${file}...`);
          const filePath = path.join(sqlDir, file);
          const sql = fs.readFileSync(filePath, 'utf8');

          await client.query('BEGIN');
          try {
            await client.query(sql);
            await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
            await client.query('COMMIT');
            console.log(`[db:migrate] Successfully applied: ${file}`);
            appliedCount++;
          } catch (err) {
            await client.query('ROLLBACK');
            console.error(`[db:migrate] Error executing ${file}:`, err);
            throw err;
          }
        }
      }

      if (appliedCount === 0) {
        console.log('[db:migrate] No pending migrations. Database is up to date.');
      } else {
        console.log(`[db:migrate] Migration complete. Applied ${appliedCount} migration(s).`);
      }
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('[db:migrate] Migration failed:', err.message);
  process.exit(1);
});
