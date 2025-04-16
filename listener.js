const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");

const PROGRAM_ID = new PublicKey("CooKTkMQ4V1zfr3faLVxgRwSYM86AWXsEbUC3aeDvXTe");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const db = require('./db');

async function listen() {
  console.log("📡 Listening for transactions on program:", PROGRAM_ID.toBase58());

  connection.onLogs(PROGRAM_ID, (logInfo) => {
    console.log("🔔 New Transaction Detected:");
    db.run(`INSERT OR IGNORE INTO transactions (signature, slot, timestamp, sender, receiver, amount) VALUES (?, ?, ?, ?, ?, ?)`, 
  [signature, slot, timestamp, sender, receiver, amount]);
    console.log(JSON.stringify(logInfo, null, 2));
  }, "confirmed");
}

listen();

