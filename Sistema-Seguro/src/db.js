const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const storageDir = process.env.DB_STORAGE_DIR
  ? path.resolve(process.env.DB_STORAGE_DIR)
  : path.join(__dirname, '..', 'data', 'sqlite');

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storagePath = process.env.DB_STORAGE
  ? path.resolve(process.env.DB_STORAGE)
  : path.join(storageDir, 'database.sqlite');

const dialect = process.env.DB_DIALECT || 'sqlite';

const sequelize = process.env.DB_DIALECT === 'mysql' || dialect === 'mysql'
  ? new Sequelize(process.env.DB_NAME || 'sistema_seguro', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      dialect: 'mysql',
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    });

module.exports = sequelize;