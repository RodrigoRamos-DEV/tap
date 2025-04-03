const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 1. Buscar usuário no banco
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );

    // 2. Verificar se existe
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 3. Verificar senha (exemplo com bcrypt)
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 4. Retornar token/sucesso
    res.json({ 
      success: true,
      user: {
        id: user.rows[5].id,
        email: user.rows[5].email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT id, email FROM users');
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Servidor rodando na porta 5000'));