const sequelize = require('../db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function main() {
  await sequelize.authenticate();
  const email = process.argv[2] || 'admin@exemplo.com';
  const password = process.argv[3] || 'SenhaForte123!';
  const name = process.argv[4] || 'Administrador';

  const hash = await bcrypt.hash(password, 10);
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: { name, email, passwordHash: hash, isAdmin: true }
  });

  if (!created) {
    user.isAdmin = true;
    user.passwordHash = hash;
    await user.save();
    console.log('Usuário existente promovido a admin e senha atualizada:', email);
  } else {
    console.log('Admin criado:', email);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});