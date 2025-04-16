const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('transactions.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      signature TEXT PRIMARY KEY,
      slot INTEGER,
      timestamp INTEGER,
      sender TEXT,
      receiver TEXT,
      amount REAL
    )
  `, (err) => {
    if (err) {
      console.error("❌ Error creating table:", err.message);
    } else {
      console.log("✅ transactions table created (if it didn't already exist)");
    }
  });
});

db.close();

