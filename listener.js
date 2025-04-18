const express = require("express");
const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy HTTP endpoint to keep Render Web Service alive
app.get("/", (req, res) => {
  res.send("🟢 Solana transaction listener is running.");
});

app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});

// Solana program ID to listen to
const PROGRAM_ID = new PublicKey("CooKTkMQ4V1zfr3faLVxgRwSYM86AWXsEbUC3aeDvXTe");

// Create connection to Solana Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function listen() {
  console.log("📡 Listening for transactions on program:", PROGRAM_ID.toBase58());

  connection.onLogs(PROGRAM_ID, async (logInfo) => {
    try {
      console.log("🔔 New Transaction Detected:");

      // Extract info from logInfo
      const signature = logInfo.signature;
      const slot = logInfo.slot;
      const timestamp = Math.floor(Date.now() / 1000);

      // Example of parsing sender/receiver/amount from logs (you can improve this)
      const logs = logInfo.logs.join("\n");
      const sender = extractFromLogs(logs, "sender");
      const receiver = extractFromLogs(logs, "receiver");
      const amount = extractFromLogs(logs, "amount");

      // Insert into DB
      db.run(
        `INSERT OR IGNORE INTO transactions (signature, slot, timestamp, sender, receiver, amount) VALUES (?, ?, ?, ?, ?, ?)`,
        [signature, slot, timestamp, sender, receiver, amount]
      );

      console.log(JSON.stringify({ signature, slot, timestamp, sender, receiver, amount }, null, 2));
    } catch (err) {
      console.error("❌ Error handling log:", err);
    }
  }, "confirmed");
}

// Dummy log parser (customize to your program's log format)
function extractFromLogs(logs, key) {
  const match = new RegExp(`${key}:\\s*(\\S+)`).exec(logs);
  return match ? match[1] : null;
}

listen();

