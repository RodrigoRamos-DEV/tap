// backend/scripts/create-admin.js
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function createAdmin() {
  const email = 'admin@email.com';
  const password = '123456'; // Substitua pela senha desejada
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    
    await pool.query(`
      INSERT INTO users (email, password_hash, is_admin, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
    `, [email, hash, true]);

    console.log('✅ Admin criado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar admin:', err.message);
  } finally {
    pool.end();
  }
}

createAdmin();