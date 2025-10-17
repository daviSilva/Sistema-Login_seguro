const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLogin = (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
exports.getRegister = (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
exports.getDashboard = (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  return res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).send('Campos faltando');
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).send('Email já cadastrado');
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    req.session.userId = user.id;
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro ao registrar');
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Campos faltando');
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).send('Credenciais inválidas');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).send('Credenciais inválidas');
    req.session.userId = user.id;
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro ao logar');
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

exports.apiMe = async (req, res) => {
  if (!req.session.userId) return res.json({ logged: false });
  const user = await User.findByPk(req.session.userId, { attributes: ['id', 'name', 'email', 'isAdmin'] });
  if (!user) return res.json({ logged: false });
  return res.json({ logged: true, user });
};

exports.getAdminUsers = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  const me = await User.findByPk(req.session.userId);
  if (!me || !me.isAdmin) return res.status(403).json({ error: 'Forbidden' });
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'isAdmin', 'createdAt'] });
  return res.json({ users });
};

exports.promoteUser = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const me = await User.findByPk(req.session.userId);
    if (!me || !me.isAdmin) return res.status(403).json({ error: 'Forbidden' });
    const targetId = parseInt(req.params.id, 10);
    if (!targetId) return res.status(400).json({ error: 'Invalid id' });
    const user = await User.findByPk(targetId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isAdmin = true;
    await user.save();
    return res.json({ ok: true, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};