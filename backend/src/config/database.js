const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    schema: process.env.SCHEMA,
  }
);

// Função de teste de conexão
const testConnection = async () => {
  try {
    await db.authenticate();
    console.log('✅ Conexão com o banco estabelecida!');
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão:', error);
    return false;
  }
};

module.exports = {
  db,
  testConnection
};