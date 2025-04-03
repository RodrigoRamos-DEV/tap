require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./model'); // Importação corrigida
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use(errorHandler);

// Sincronizar banco de dados e iniciar servidor
const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Banco de dados conectado e sincronizado');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 Documentação Swagger em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  });