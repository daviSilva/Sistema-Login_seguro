# 🧱 Sistema Seguro — Node.js + MySQL + EJS

Um sistema completo de autenticação segura desenvolvido com **Node.js**, **Express**, **MySQL** e **EJS**, focado em **boas práticas de segurança**, **proteção contra ataques comuns** e **rastreabilidade de tentativas de login**.

Este projeto implementa:
- ✅ Cadastro e login de usuários com senha criptografada (bcrypt)
- ✅ Sessões seguras com MySQL (express-mysql-session)
- ✅ Proteção CSRF e Helmet
- ✅ Registro detalhado de tentativas de login (sucesso, erro, bloqueio)
- ✅ Detecção de ataques (brute force / IP bloqueado)
- ✅ Interface moderna com EJS + Bootstrap
- ✅ Painel de logs de segurança (auditoria)

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologia |
|------------|-------------|
| **Backend** | Node.js (v22+) |
| **Framework Web** | Express.js |
| **Banco de Dados** | MySQL / MariaDB |
| **Template Engine** | EJS + express-ejs-layouts |
| **Autenticação** | express-session + bcrypt |
| **Segurança** | helmet, csurf, rate-limit |
| **Logs e Auditoria** | MySQL + arquivo `.log` local |
| **Gerenciamento de dependências** | npm |

---

## ⚙️ Funcionalidades

### 👤 **Autenticação**
- Registro e login de usuários com criptografia segura (`bcrypt`).
- Sessão armazenada no MySQL para persistência.
- Logout seguro com limpeza de sessão e cookies.

### 🔐 **Camadas de Segurança**
- Proteção **CSRF** em todos os formulários.
- **Helmet** para reforçar cabeçalhos HTTP.
- **Rate limiting**: bloqueia excesso de tentativas de login.
- **Bloqueio automático de IPs** após várias falhas.

### 📊 **Logs de Tentativas**
- Cada tentativa de login (sucesso, falha ou bloqueio) é registrada no banco:
  - E-mail
  - IP
  - User-Agent
  - Status (SUCCESS / FAIL / BLOCKED)
  - Data/hora
- Logs também podem ser gravados em `logs/login.log`.

### 🧠 **Painel Administrativo**
- Tela `/logs` protegida, mostrando as últimas tentativas de login, com cores por tipo:
  - 🟩 `SUCCESS`
  - 🟥 `FAIL`
  - 🟨 `BLOCKED`

---

## 🧩 Estrutura do Projeto

```
SISTEMA---SEGURO/
├── app.js
├── .env
├── package.json
├── /controllers
│   └── authController.js
├── /models
│   └── User.js
├── /routes
│   └── authRoutes.js
├── /views
│   ├── layout.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── dashboard.ejs
│   └── logs.ejs
├── /public
│   └── (CSS, imagens, scripts estáticos)
└── /logs
    └── login.log
```

---

## 🛠️ Configuração do Ambiente

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seuusuario/sistema-seguro.git
cd sistema-seguro
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Criar o banco de dados
Entre no seu MySQL e execute:

```sql
CREATE DATABASE sistemaTeste;
USE sistemaTeste;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  ip_address VARCHAR(50),
  user_agent TEXT,
  status ENUM('SUCCESS','FAIL','BLOCKED','ERROR') DEFAULT 'FAIL',
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> ⚙️ A tabela `sessions` será criada automaticamente pelo `express-mysql-session`.

---

### 4️⃣ Configurar o `.env`

Crie um arquivo `.env` na raiz do projeto:

```
DB_HOST=127.0.0.1
DB_PORT=3308
DB_USER=root
DB_PASS=1234
DB_NAME=sistemaTeste
SESSION_SECRET=segredo123
NODE_ENV=development
```

---

### 5️⃣ Executar o servidor

```bash
npm run dev
# ou
node app.js
```

💡 Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🔍 Testes de Segurança

O sistema foi desenvolvido para resistir a ataques comuns de OWASP:

| Tipo de Ataque | Proteção Implementada |
|----------------|-----------------------|
| **SQL Injection** | Uso de `prepared statements` (`?` placeholders) |
| **XSS** | Escapamento automático do EJS |
| **CSRF** | Middleware `csurf` + tokens em todos os formulários |
| **Brute Force** | `express-rate-limit` + bloqueio de IP |
| **Session Hijacking** | Cookies `httpOnly`, `sameSite`, `secure` em produção |
| **Password Cracking** | Criptografia `bcrypt` com salt |

---

## 🧾 Logs de Tentativas

Os logs ficam armazenados:
- No banco MySQL (`login_attempts`);
- Localmente em: `/logs/login.log`.

Exemplo de entrada no arquivo:
```
[2025-10-16T12:25:47Z] [FAIL] user@example.com - 127.0.0.1 - Senha incorreta
[2025-10-16T12:26:03Z] [SUCCESS] user@example.com - 127.0.0.1 - Login bem-sucedido
[2025-10-16T12:29:12Z] [BLOCKED] user@example.com - 127.0.0.1 - IP bloqueado por excesso de falhas
```

---

## 🧑‍💼 Perfis de Usuário

| Tipo | Descrição |
|------|------------|
| **Usuário comum** | Pode se cadastrar, fazer login e acessar o dashboard. |
| **Administrador (futuro)** | Pode acessar `/logs` e visualizar tentativas de login. |

---

## 📈 Melhorias futuras

- [ ] Recuperação de senha via e-mail  
- [ ] Two-Factor Authentication (2FA)  
- [ ] Painel administrativo completo com filtros e paginação  
- [ ] Dashboard com estatísticas de segurança  
- [ ] Integração com Redis para performance de sessões  

---

## 🧰 Ferramentas de Teste Sugeridas

Você pode testar a segurança localmente com:

```bash
# Testar injeções SQL
sqlmap -u "http://localhost:3000/login" --data "email=test&password=123&_csrf=token" -p email

# Testar força bruta / rate limit
for i in {1..10}; do curl -X POST -d "email=a@b.com&password=errado" http://localhost:3000/login; done
```

---

## Autor

**Desenvolvido por:**  
> Davi Silva — Desenvolvedor Em Aprendizagem  
> 💼 Foco em segurança, back-end e integração com banco de dados  
> 🌐 [GitHub](https://github.com/seuusuario) • [LinkedIn](https://linkedin.com/in/seuusuario)

---

## 📜 Licença
ainda precisa arrumar uma.
---

## 🛡️ Conclusão

O **Sistema Seguro** foi desenvolvido para ser um exemplo sólido de **boas práticas de segurança em aplicações web Node.js**.  
Ele serve como base para projetos profissionais, portfólios ou aplicações reais que exigem autenticação confiável, auditoria e rastreamento de tentativas suspeitas.
