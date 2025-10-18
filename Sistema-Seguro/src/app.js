const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const authController = require('./controllers/authController');
const sequelize = require('./db');
const User = require('./models/User'); // garante registro do modelo

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Resolve dinamicamente a pasta "public" (tenta vários caminhos comuns)
const candidates = [
  path.join(__dirname, '..', 'public'),       // src/../public
  path.join(__dirname, 'public'),             // src/public
  path.join(process.cwd(), 'public'),         // cwd/public
  path.join(process.cwd(), 'src', 'public')   // cwd/src/public
];
let PUBLIC_DIR = null;
for (const c of candidates) {
  try {
    const stat = require('fs').statSync(c);
    if (stat && stat.isDirectory()) { PUBLIC_DIR = c; break; }
  } catch (e) { /* não existe */ }
}
if (!PUBLIC_DIR) {
  console.error('Pasta public não encontrada. Verifique a estrutura do projeto. Candidatos testados:', candidates);
  process.exit(1);
}
console.log('Servindo arquivos estáticos de:', PUBLIC_DIR);
app.use(express.static(PUBLIC_DIR));


app.use(session({
  secret: process.env.SESSION_SECRET || 'seuSegredoSuperSeguro_troque_em_producao',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5, message: 'Muitas tentativas. Tente novamente mais tarde.' });
app.use('/login', loginLimiter);
app.use('/api/login', loginLimiter);

// rotas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../src/public', 'index.html')));
app.get('/login', authController.getLogin);
app.get('/register', authController.getRegister);
app.get('/dashboard', authController.getDashboard);
app.get('/dashboard/profile', authController.getDashboardProfile);
app.get('/dashboard/settings', authController.getDashboardSettings);
app.get('/dashboard/reports', authController.getDashboardReports);
app.get('/dashboard/users', authController.getDashboardUsers);

app.post('/register', authController.postRegister);
app.post('/login', authController.postLogin);
app.post('/logout', authController.postLogout);

// API endpoints
app.get('/api/me', authController.apiMe);
app.get('/api/admin/users', authController.getAdminUsers);
app.post('/api/admin/promote/:id', authController.promoteUser);

// start after DB ready
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // em produção use migrations
    console.log('DB conectado e modelos sincronizados');
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  } catch (err) {
    console.error('Erro ao iniciar:', err);
    process.exit(1);
  }
})();
