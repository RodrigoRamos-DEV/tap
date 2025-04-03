const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const path = require('path');

// Model imports
const User = require('./User');
const Profile = require('./Profile');

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão com o banco:', error);
    return false;
  }
};

// Setup relationships
const setupRelations = () => {
  User.hasMany(Profile, {
    foreignKey: 'userId',
    onDelete: 'CASCADE' // Remove profiles when user is deleted
  });
  
  Profile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

// Initialize all models
const initializeModels = async () => {
  await testConnection();
  setupRelations();
  
  try {
    await sequelize.sync({ alter: true }); // Safe schema updates
    console.log('✅ Modelos sincronizados com o banco');
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  User,
  Profile,
  initializeModels,
  testConnection
};