const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Fallback para usuário padrão
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'digital_cards',
  password: process.env.DB_PASSWORD || '123', // Substitua pela senha real
  port: process.env.DB_PORT || 5432,
});

async function testTables() {
  try {
    // Testar consulta nas tabelas
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const profiles = await pool.query('SELECT COUNT(*) FROM profiles');
    
    console.log('✅ Conexão OK!');
    console.log(`👤 Users: ${users.rows[0].count} registros`);
    console.log(`📇 Profiles: ${profiles.rows[0].count} registros`);
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await pool.end();
  }
}

testTables();