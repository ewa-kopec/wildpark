import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/park.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS habitats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      image TEXT,
      icon TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS exhibits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitat_id INTEGER,
      name TEXT,
      description TEXT,
      type TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;