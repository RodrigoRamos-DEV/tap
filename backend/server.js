require('dotenv').config();
const express = require('express');
const pool = require('./config/db');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Digital Cards está rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});