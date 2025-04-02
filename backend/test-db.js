const pool = require('./config/db');

async function testDB() {
  try {
    const res = await pool.query('SELECT * FROM users');
    console.log('✅ Teste de consulta bem-sucedido!');
    console.log('Resultado:', res.rows);
  } catch (err) {
    console.error('❌ Erro no teste:', err);
  } finally {
    await pool.end();
  }
}

testDB();