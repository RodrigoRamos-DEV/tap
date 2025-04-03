// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuração robusta com tratamento de erros
const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Fallback padrão
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'digital_cards',
  password: String(process.env.DB_PASSWORD), // Garante que a senha seja string
  port: Number(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_SSL === 'true',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Configurações específicas para SCRAM-SHA-256
  application_name: 'tapconecte-backend',
  options: '-c search_path=public',
});

// Teste de conexão automático
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL conectado com sucesso!');
    client.release();
  } catch (err) {
    console.error('❌ ERRO DE CONEXÃO:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    process.exit(1); // Encerra o processo se não conectar
  }
})();

// Exportação correta do pool
module.exports = {
  query: (text, params) => pool.query(text, params), // Interface consistente
  getClient: () => pool.connect(), // Para transações
  end: () => pool.end()
};