const { Pool } = require('pg');
require('dotenv').config();

console.log('🚀 Connecting to Neon database...');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,  // Neon requires this
        // Some Neon setups need these additional SSL options:
        sslmode: 'require'
    },
    // Add connection timeouts
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    // Keep connection alive
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
});

// Test connection immediately and check/run database migration
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Connection error:', err.message);
        console.error('📋 Full error:', err);
    } else {
        console.log('✅ Connected to Neon!');
        console.log('📅 Server time:', res.rows[0].now);
        
        // Add content column if it doesn't exist
        pool.query('ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "content" TEXT;', (migrationErr, migrationRes) => {
            if (migrationErr) {
                console.error('❌ Migration failed to add "content" column to "Document":', migrationErr.message);
            } else {
                console.log('✅ Checked database schema: "content" column verified/added on "Document" table.');
            }
        });
    }
});

module.exports = pool;