# 🔁 Solana Transaction Listener (Devnet)

This project listens to transactions for a specific Solana program deployed on **Devnet**, logs them into a database, and will eventually power a dashboard for analytics.

## 📦 Features

- Listens to program transactions on Solana Devnet
- Logs relevant data to a database (SQLite/PostgreSQL)
- Future: Web dashboard to display metrics
- Future: Hosted on Render for continuous access
- Real-time transaction detection with timestamp, sender, receiver, and amount (when available)
- Provides a simple web interface to display recent transactions

## 🧰 Tech Stack

- **Node.js**: For running the server
- **Solana Web3.js**: To interact with the Solana blockchain
- **SQLite / PostgreSQL**: For storing transaction data
- **Express.js**: For serving the web interface
- **Render**: For hosting the application (optional)

## 🚀 Getting Started

### 1. Install Dependencies

Make sure you have Node.js installed, then run:

```bash
npm install
