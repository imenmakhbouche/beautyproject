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

// Test connection immediately
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Connection error:', err.message);
        console.error('📋 Full error:', err);
    } else {
        console.log('✅ Connected to Neon!');
        console.log('📅 Server time:', res.rows[0].now);
    }
});

module.exports = pool;