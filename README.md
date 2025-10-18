# Sistema-Seguro

API simples de autenticação com painel (dashboard) e telas estáticas. Projeto organizado com Sequelize + SQLite (padrão). Inclui páginas: index, login, register e dashboard com subpáginas (perfil, usuários, configurações, relatórios).

---

## Sumário rápido
- Backend: Node.js + Express
- ORM: Sequelize (SQLite por padrão; MySQL opcional)
- Frontend: arquivos estáticos em `public/`
- DB local: `data/sqlite/database.sqlite` (gitignored)
- Scripts npm: `start`, `dev`, `init-db`, `create-admin`

---

## Requisitos
- Node.js v16+ e npm
- (Opcional MySQL) servidor MySQL + `mysql2` npm package

---

## Instalação (Windows PowerShell)
1. Abrir pasta do projeto:
```powershell
cd "C:\Users\silas\Desktop\projetinhos davi\PORTIFOLIO\PROJETO1\Sistema-Seguro"
```
2. Instalar dependências:
```powershell
npm install
# se faltar o driver sqlite:
npm install sqlite3
# se usar MySQL:
# npm install mysql2
```

3. Criar `.env` (copiar de `.env.example` e ajustar):
```
DB_DIALECT=sqlite
DB_STORAGE=./data/sqlite/database.sqlite
SESSION_SECRET=troque_em_producao
PORT=3000
```

---

## Inicializar banco e criar admin
- Sincronizar modelos / criar arquivo SQLite:
```powershell
npm run init-db
```
- Criar/promover admin:
```powershell
npm run create-admin -- admin@exemplo.com SenhaForte! "Administrador"
# ou
node src/scripts/create_admin.js admin@exemplo.com SenhaForte! "Administrador"
```

Para MySQL: ajustar `.env` (DB_DIALECT=mysql, DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT) e instalar `mysql2`, depois `npm run init-db`.

---

## Executar (desenvolvimento)
```powershell
npm run dev   # nodemon src/app.js
# ou
npm start
```
Abrir: http://localhost:3000

---

## Rotas principais (páginas)
- GET / → public/index.html  
- GET /login → public/login.html  
- GET /register → public/register.html  
- GET /dashboard → public/dashboard.html (requer sessão)  
- GET /dashboard/profile, /dashboard/settings, /dashboard/reports, /dashboard/users

APIs JSON:
- GET /api/me — { logged, user }  
- GET /api/reports — KPIs e usuários recentes (requer autenticação)  
- GET /api/admin/users — lista usuários (admin)  
- POST /api/admin/promote/:id — promove usuário para admin (admin)

Exemplo curl:
```bash
# ver usuário logado (cookies da sessão não são transmitidos aqui; apenas exemplo)
curl -i http://localhost:3000/api/reports
```

---

## Estrutura do projeto
- src/
  - app.js
  - db.js
  - controllers/
  - models/
  - scripts/ (create_admin.js)
  - tools/ (init_db.js)
- public/ (html, css, dashboard/*)
- data/sqlite/ (database.sqlite) — geralmente gerado em runtime
- package.json, .env.example, README.md

---

## Troubleshooting
- ENOENT public/index.html  
  - Verifique se `public/index.html` existe:
    ```powershell
    Test-Path .\public\index.html
    dir .\public
    ```
  - Se estiver em `src/public`, mova:
    ```powershell
    if (-not (Test-Path .\public)) { New-Item -ItemType Directory -Path .\public }
    Move-Item -Force .\src\public\* .\public\
    ```
- Erro `Please install sqlite3 package manually` → `npm install sqlite3`
- Erro de push Git (403) → usar PAT ou configurar SSH. Remova credenciais antigas no Credential Manager se necessário.

---

## Segurança e produção (resumo)
- Troque `SESSION_SECRET` por valor forte.
- Em produção usar HTTPS, cookie secure e store de sessão persistente (Redis/DB).
- Evitar `sequelize.sync({ alter: true })` em produção — usar migrations.
- Validar/escapar entrada do usuário e ativar CSRF onde aplicável.

---

## Comandos úteis
```powershell
# sincronizar DB e criar admin
npm run init-db -- admin@exemplo.com SenhaForte! "Admin"

# criar só admin
npm run create-admin -- admin@exemplo.com SenhaForte!

# development
npm run dev
```

