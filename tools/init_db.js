const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sequelize = require('../db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function init({ adminEmail, adminPass, adminName } = {}) {
  try {
    await sequelize.authenticate();

    const storagePath = process.env.DB_STORAGE
      ? path.resolve(process.env.DB_STORAGE)
      : path.join(process.cwd(), 'data', 'sqlite', 'database.sqlite');
    const storageDir = path.dirname(storagePath);
    if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

    await sequelize.sync({ alter: true });
    console.log('Banco inicializado em:', storagePath);

    if (adminEmail && adminPass) {
      const hash = await bcrypt.hash(adminPass, 10);
      const [user, created] = await User.findOrCreate({
        where: { email: adminEmail },
        defaults: { name: adminName || 'Administrador', email: adminEmail, passwordHash: hash, isAdmin: true }
      });

      if (!created) {
        user.isAdmin = true;
        user.passwordHash = hash;
        await user.save();
        console.log(`Usuário existente promovido a admin e senha atualizada: ${adminEmail}`);
      } else {
        console.log(`Admin criado: ${adminEmail}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Erro ao inicializar o DB:', err);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const adminEmail = args[0];
const adminPass = args[1];
const adminName = args[2];

init({ adminEmail, adminPass, adminName });