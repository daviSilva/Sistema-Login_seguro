# Meu Sistema Seguro

API/pequeno sistema de autenticação com páginas estáticas (login/register/dashboard), suporte a administração (campo `isAdmin`) e opção de banco SQLite (padrão) ou MySQL.

Resumo rápido
- Frontend leve: arquivos em `public/`
- Back-end: Express (rotas em `src/`), sessões com `express-session`
- Banco: SQLite por padrão (arquivo em `data/sqlite/database.sqlite`) — também possível usar MySQL
- ORM: Sequelize (para SQLite/MySQL). Existe código legado com Mongoose em versões antigas — verifique `src/db.js` ou `app.js` para qual driver está ativo.

Pré-requisitos
- Node.js v16+ / npm
- (Opcional MySQL) MySQL server + MySQL Workbench

Como baixar
PowerShell:
```powershell
git clone <URL_DO_REPO> Projeto
cd Projeto
```

Instalação
```powershell
# instalar dependências
npm install

# instalar dependências nativas caso necessário (Windows)
# npm install --global windows-build-tools  (se der erro ao instalar sqlite3)
```

Variáveis de ambiente
Crie um arquivo `.env` na raiz (use `.env.example` como base). Principais variáveis:

```env
# Para SQLite (padrão)
DB_DIALECT=sqlite
DB_STORAGE=./data/sqlite/database.sqlite

# Para MySQL (se preferir)
# DB_DIALECT=mysql
# DB_NAME=sistema_seguro
# DB_USER=root
# DB_PASS=senha
# DB_HOST=127.0.0.1
# DB_PORT=3306

SESSION_SECRET=troque_em_producao
PORT=3000
```

Inicializar banco (SQLite) e criar um admin opcional
```powershell
# cria pasta do DB, sincroniza modelos e (opcional) cria um admin
npm run init-db
# com admin
npm run init-db -- admin@exemplo.com MinhaSenhaForte "Admin"
```
(ou)
```powershell
node src/tools/init_db.js admin@exemplo.com SenhaForte! "Administrador"
```

Criar admin manualmente
```powershell
npm run create-admin -- admin@exemplo.com SenhaForte!
# ou
node src/scripts/create_admin.js admin@exemplo.com SenhaForte! "Administrador"
```

Usar MySQL (opcional)
1. Crie o banco e usuário (Workbench / console):
```sql
CREATE DATABASE IF NOT EXISTS sistema_seguro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'sistema_user'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON sistema_seguro.* TO 'sistema_user'@'localhost';
FLUSH PRIVILEGES;
```
2. Atualize `.env` para `DB_DIALECT=mysql` e preencha `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`.
3. Instale driver MySQL:
```powershell
npm install mysql2
```
4. Rode `npm run init-db` para sincronizar tabelas (ou use migrations em produção).

Scripts npm úteis
- start: `npm start` (node src/app.js)
- dev: `npm run dev` (nodemon src/app.js)
- init-db: `npm run init-db` (sincroniza DB)
- create-admin: `npm run create-admin` (cria/promove admin)

Rotas principais (páginas)
- GET / -> index
- GET /login -> página de login
- GET /register -> página de registro
- GET /dashboard -> dashboard (requer sessão)

Rotas de formulário
- POST /register -> registra usuário
- POST /login -> autentica
- POST /logout -> encerra sessão

API (JSON)
- GET /api/me -> retorna { logged, user } (sem passwordHash)
- GET /api/admin/users -> lista usuários (somente isAdmin)
- POST /api/admin/promote/:id -> promove usuário para admin (somente isAdmin)

Como testar localmente
1. Configure `.env`
2. Inicialize DB: `npm run init-db`
3. Inicie servidor: `npm run dev`
4. Abra no navegador: http://localhost:3000

Observações de segurança / produção
- Troque `SESSION_SECRET` por um valor forte.
- Em produção, use HTTPS, secure cookies e store de sessão persistente (Redis, DB).
- Evite `sequelize.sync({ alter: true })` em produção — use migrations.
- Habilite CSRF e validação de entrada onde necessário.
- Proteja endpoints de administração com lógica de autorização adicional.

Estrutura do projeto (resumo)
- src/
  - app.js
  - db.js
  - controllers/
    - authController.js
  - models/
    - User.js
  - routes/
    - authRoutes.js
  - scripts/
    - create_admin.js
  - tools/
    - init_db.js
- public/
  - index.html, login.html, register.html, dashboard.html
  - css/
- data/
  - sqlite/ (arquivo do sqlite — gitignored)

Ajuda / debugging
- Logs do servidor aparecem no terminal onde você rodar `npm run dev`.
- Erros de driver (sqlite3/mysql2) = instale driver correspondente.
- Problemas com push/git: verifique remoto, credenciais e branches.

Licença
- ISC (editar em package.json conforme necessário)

Se quiser, eu gero um `README` mais curto focado apenas em MySQL ou apenas em SQLite — qual prefere?// filepath: c:\Users\silas\Desktop\projetinhos davi\PORTIFOLIO\PROJETO1\README.md
# Meu Sistema Seguro

API/pequeno sistema de autenticação com páginas estáticas (login/register/dashboard), suporte a administração (campo `isAdmin`) e opção de banco SQLite (padrão) ou MySQL.

Resumo rápido
- Frontend leve: arquivos em `public/`
- Back-end: Express (rotas em `src/`), sessões com `express-session`
- Banco: SQLite por padrão (arquivo em `data/sqlite/database.sqlite`) — também possível usar MySQL
- ORM: Sequelize (para SQLite/MySQL). Existe código legado com Mongoose em versões antigas — verifique `src/db.js` ou `app.js` para qual driver está ativo.

Pré-requisitos
- Node.js v16+ / npm
- (Opcional MySQL) MySQL server + MySQL Workbench

Como baixar
PowerShell:
```powershell
git clone <URL_DO_REPO> Projeto
cd Projeto
```

Instalação
```powershell
# instalar dependências
npm install

# instalar dependências nativas caso necessário (Windows)
# npm install --global windows-build-tools  (se der erro ao instalar sqlite3)
```

Variáveis de ambiente
Crie um arquivo `.env` na raiz (use `.env.example` como base). Principais variáveis:

```env
# Para SQLite (padrão)
DB_DIALECT=sqlite
DB_STORAGE=./data/sqlite/database.sqlite

# Para MySQL (se preferir)
# DB_DIALECT=mysql
# DB_NAME=sistema_seguro
# DB_USER=root
# DB_PASS=senha
# DB_HOST=127.0.0.1
# DB_PORT=3306

SESSION_SECRET=troque_em_producao
PORT=3000
```

Inicializar banco (SQLite) e criar um admin opcional
```powershell
# cria pasta do DB, sincroniza modelos e (opcional) cria um admin
npm run init-db
# com admin
npm run init-db -- admin@exemplo.com MinhaSenhaForte "Admin"
```
(ou)
```powershell
node src/tools/init_db.js admin@exemplo.com SenhaForte! "Administrador"
```

Criar admin manualmente
```powershell
npm run create-admin -- admin@exemplo.com SenhaForte!
# ou
node src/scripts/create_admin.js admin@exemplo.com SenhaForte! "Administrador"
```

Usar MySQL (opcional)
1. Crie o banco e usuário (Workbench / console):
```sql
CREATE DATABASE IF NOT EXISTS sistema_seguro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'sistema_user'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON sistema_seguro.* TO 'sistema_user'@'localhost';
FLUSH PRIVILEGES;
```
2. Atualize `.env` para `DB_DIALECT=mysql` e preencha `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`.
3. Instale driver MySQL:
```powershell
npm install mysql2
```
4. Rode `npm run init-db` para sincronizar tabelas (ou use migrations em produção).

Scripts npm úteis
- start: `npm start` (node src/app.js)
- dev: `npm run dev` (nodemon src/app.js)
- init-db: `npm run init-db` (sincroniza DB)
- create-admin: `npm run create-admin` (cria/promove admin)

Rotas principais (páginas)
- GET / -> index
- GET /login -> página de login
- GET /register -> página de registro
- GET /dashboard -> dashboard (requer sessão)

Rotas de formulário
- POST /register -> registra usuário
- POST /login -> autentica
- POST /logout -> encerra sessão

API (JSON)
- GET /api/me -> retorna { logged, user } (sem passwordHash)
- GET /api/admin/users -> lista usuários (somente isAdmin)
- POST /api/admin/promote/:id -> promove usuário para admin (somente isAdmin)

Como testar localmente
1. Configure `.env`
2. Inicialize DB: `npm run init-db`
3. Inicie servidor: `npm run dev`
4. Abra no navegador: http://localhost:3000

Observações de segurança / produção
- Troque `SESSION_SECRET` por um valor forte.
- Em produção, use HTTPS, secure cookies e store de sessão persistente (Redis, DB).
- Evite `sequelize.sync({ alter: true })` em produção — use migrations.
- Habilite CSRF e validação de entrada onde necessário.
- Proteja endpoints de administração com lógica de autorização adicional.

Estrutura do projeto (resumo)
- src/
  - app.js
  - db.js
  - controllers/
    - authController.js
  - models/
    - User.js
  - routes/
    - authRoutes.js
  - scripts/
    - create_admin.js
  - tools/
    - init_db.js
- public/
  - index.html, login.html, register.html, dashboard.html
  - css/
- data/
  - sqlite/ (arquivo do sqlite — gitignored)

Ajuda / debugging
- Logs do servidor aparecem no terminal onde você rodar `npm run dev`.
- Erros de driver (sqlite3/mysql2) = instale driver correspondente.
- Problemas com push/git: verifique remoto, credenciais e branches.

Licença
- ISC
