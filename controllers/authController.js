const User = require('../models/User');

// --- Tela de cadastro ---
exports.getSignup = (req, res) => {
    res.render('signup', { csrfToken: req.csrfToken() });
};

// --- Cadastro ---
exports.postSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.send('Erro ao cadastrar usuário: ' + err.message);
    }
};

// --- Tela de login ---
exports.getLogin = (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
};

// --- Login ---
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send('Usuário não encontrado');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.send('Senha incorreta');

    req.session.userId = user._id;
    res.redirect('/dashboard');
};

// --- Dashboard protegido ---
exports.getDashboard = (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    res.render('dashboard');
};

// --- Logout ---
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
