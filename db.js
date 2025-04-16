const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('transactions.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signature TEXT UNIQUE,
    slot INTEGER,
    timestamp TEXT,
    sender TEXT,
    receiver TEXT,
    amount TEXT
  )`);
});

module.exports = db;

