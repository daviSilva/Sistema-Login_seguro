const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');

const router = express.Router();

// index estático
router.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// páginas e ações de auth
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/dashboard', authController.getDashboard);

router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router;