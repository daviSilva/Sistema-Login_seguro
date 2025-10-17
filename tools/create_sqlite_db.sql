-- Script SQL para criar a tabela 'users' em SQLite (arquivo database.sqlite será usado pelo db.js)
-- Execute com sqlite3: sqlite3 path\to\database.sqlite < create_sqlite_db.sql

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT '',
  email TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  isAdmin INTEGER NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT (datetime('now')),
  updatedAt DATETIME NOT NULL DEFAULT (datetime('now'))
);

-- Exemplo: inserir um admin (substitua o hash pela senha hasheada com bcrypt)
-- Não insira senhas em plain text. Use o script create_admin.js para criar um admin com hash seguro.
INSERT OR IGNORE INTO users (name, email, passwordHash, isAdmin, createdAt, updatedAt)
VALUES ('Admin', 'admin@example.com', 'REPLACE_WITH_BCRYPT_HASH', 1, datetime('now'), datetime('now'));