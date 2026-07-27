const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

console.log('⏳ Connecting...');
client.connect()
    .then(() => {
        console.log('✅ Connected successfully!');
        return client.query('SELECT NOW() as time, version() as version');
    })
    .then(res => {
        console.log('📅 Server time:', res.rows[0].time);
        console.log('🐘 PostgreSQL version:', res.rows[0].version);
        return client.query('SELECT current_database() as db');
    })
    .then(res => {
        console.log('📊 Database name:', res.rows[0].db);
        client.end();
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        console.error('📋 Stack:', err.stack);
        client.end();
    });