require('dotenv').config();
const pool = require('./config/db');

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão OK. Hora do DB:', res.rows[0].now);
  } catch (err) {
    console.error('FALHA NA CONEXÃO:', err.message);
  } finally {
    pool.end();
  }
}

test();