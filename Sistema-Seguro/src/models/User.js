const { DataTypes } = require('sequelize');
const sequelize = require('../../src/db') || require('../db'); // tries both when moved

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;