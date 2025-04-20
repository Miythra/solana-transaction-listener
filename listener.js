const express = require("express");
const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy HTTP endpoint to keep Render Web Service alive
app.get("/", (req, res) => {
  db.all("SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 20", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la récupération des transactions.");
    }

    let html = `
      <html>
        <head>
          <title>Solana Listener</title>
          <style>
            body {
              font-family: sans-serif;
              background: #f5f5f5;
              padding: 2rem;
            }
            h1 {
              color: #2c3e50;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            th, td {
              padding: 12px 16px;
              text-align: left;
              border-bottom: 1px solid #eee;
            }
            th {
              background: #3498db;
              color: white;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
            .null {
              color: #aaa;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h1>🟢 Solana Transaction Listener</h1>
          <table>
            <tr>
              <th>Signature</th>
              <th>Slot</th>
              <th>Timestamp</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
            </tr>`;

    rows.forEach(tx => {
      const format = val => val === null ? '<span class="null">null</span>' : val;
      const date = new Date(tx.timestamp * 1000).toLocaleString();
      html += `
        <tr>
          <td>${tx.signature}</td>
          <td>${format(tx.slot)}</td>
          <td>${date}</td>
          <td>${format(tx.sender)}</td>
          <td>${format(tx.receiver)}</td>
          <td>${format(tx.amount)}</td>
        </tr>`;
    });

    html += `</table></body></html>`;
    res.send(html);
  });
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

