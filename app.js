const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const csrf = require('csurf');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

// --- Configurações ---
app.use(helmet()); // Segurança básica
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Sessões ---
app.use(session({
    secret: 'seuSegredoSuperSeguro',
    resave: false,
    saveUninitialized: false
}));

// --- CSRF Protection ---
app.use(csrf());

// --- Conexão com MongoDB ---
mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

//Segurança para as rotas
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // máximo de 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente em 10 minutos.'
});

app.use('/login', loginLimiter);

// --- Rotas ---
app.use('/', authRoutes);

// --- Servidor ---
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
