/**
 * Run this script ONCE to create all tables in the Neon database.
 * Usage: node create-tables.js
 */
require('dotenv').config();
const { Client } = require('pg');

const sql = `
-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  "id"               TEXT NOT NULL PRIMARY KEY,
  "name"             TEXT NOT NULL,
  "email"            TEXT NOT NULL UNIQUE,
  "password"         TEXT NOT NULL,
  "role"             TEXT NOT NULL DEFAULT 'patient',
  "phone"            TEXT,
  "address"          TEXT,
  "birthDate"        TEXT,
  "bloodType"        TEXT,
  "allergies"        TEXT,
  "antecedents"      TEXT,
  "medications"      TEXT,
  "emergencyContact" TEXT,
  "emergencyPhone"   TEXT,
  "isActive"         BOOLEAN NOT NULL DEFAULT true,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS "Patient" (
  "id"               TEXT NOT NULL PRIMARY KEY,
  "name"             TEXT NOT NULL,
  "email"            TEXT NOT NULL UNIQUE,
  "phone"            TEXT NOT NULL,
  "birthDate"        TEXT,
  "address"          TEXT,
  "emergencyContact" TEXT,
  "emergencyPhone"   TEXT,
  "allergies"        TEXT,
  "antecedents"      TEXT,
  "medications"      TEXT,
  "bloodType"        TEXT,
  "createdBy"        TEXT,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL
);

-- Appointments table
CREATE TABLE IF NOT EXISTS "Appointment" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "patientId"   TEXT NOT NULL,
  "patientName" TEXT NOT NULL,
  "date"        TEXT NOT NULL,
  "time"        TEXT NOT NULL,
  "service"     TEXT NOT NULL,
  "status"      TEXT NOT NULL DEFAULT 'pending',
  "notes"       TEXT,
  "createdBy"   TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("patientId")  REFERENCES "Patient"("id") ON DELETE CASCADE,
  FOREIGN KEY ("createdBy")  REFERENCES "User"("id")    ON DELETE SET NULL
);

-- Documents table
CREATE TABLE IF NOT EXISTS "Document" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "patientId"  TEXT NOT NULL,
  "name"       TEXT NOT NULL,
  "type"       TEXT NOT NULL DEFAULT 'upload',
  "fileUrl"    TEXT,
  "uploadedBy" TEXT NOT NULL DEFAULT 'doctor',
  "date"       TEXT NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS "Message" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "patientId" TEXT NOT NULL,
  "sender"    TEXT NOT NULL,
  "text"      TEXT NOT NULL,
  "read"      BOOLEAN NOT NULL DEFAULT false,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS "Prescription" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "patientId"   TEXT NOT NULL,
  "patientName" TEXT NOT NULL,
  "notes"       TEXT NOT NULL,
  "date"        TEXT NOT NULL,
  "createdBy"   TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE,
  FOREIGN KEY ("createdBy") REFERENCES "User"("id")   ON DELETE SET NULL
);

-- Schedule table
CREATE TABLE IF NOT EXISTS "Schedule" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "day"       TEXT NOT NULL UNIQUE,
  "enabled"   BOOLEAN NOT NULL DEFAULT true,
  "slots"     TEXT[] NOT NULL DEFAULT '{}',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed default schedule days
INSERT INTO "Schedule" ("id", "day", "enabled", "slots", "updatedAt")
VALUES
  ('sched_mon', 'monday',    true, ARRAY['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'], CURRENT_TIMESTAMP),
  ('sched_tue', 'tuesday',   true, ARRAY['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'], CURRENT_TIMESTAMP),
  ('sched_wed', 'wednesday', true, ARRAY['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'], CURRENT_TIMESTAMP),
  ('sched_thu', 'thursday',  true, ARRAY['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'], CURRENT_TIMESTAMP),
  ('sched_fri', 'friday',    true, ARRAY['09:00','09:30','10:00','10:30','11:00'],                         CURRENT_TIMESTAMP),
  ('sched_sat', 'saturday',  false, ARRAY[]::TEXT[],                                                       CURRENT_TIMESTAMP),
  ('sched_sun', 'sunday',    false, ARRAY[]::TEXT[],                                                       CURRENT_TIMESTAMP)
ON CONFLICT ("day") DO NOTHING;
`;

async function createTables() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('🔌 Connecting to Neon PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('📋 Creating tables...');
    await client.query(sql);
    console.log('✅ All tables created successfully!');

    // Verify
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('\n📊 Tables in database:');
    result.rows.forEach(r => console.log('  •', r.table_name));
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected.');
  }
}

createTables();
