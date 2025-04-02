const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Teste automático ao iniciar
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL conectado'))
  .catch(err => console.error('❌ Erro PostgreSQL:', err.stack));

module.exports = pool;