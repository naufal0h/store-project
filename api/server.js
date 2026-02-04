// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const SELLER_USERNAME = process.env.SELLER_USERNAME || "seller";
const SELLER_PASSWORD = process.env.SELLER_PASSWORD || "password";

const app = express();
app.use(cors());
app.use(express.json());

let db;

// init DB connection + create tables + seed minimal data
async function initDb() {
  db = await open({
    filename: path.join(__dirname, "kstore.db"),
    driver: sqlite3.Database,
  });

  // create tables
  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      nominal TEXT NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice TEXT UNIQUE NOT NULL,
      product_id INTEGER NOT NULL,
      buyer_name TEXT,
      buyer_phone TEXT,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);

  // seed sample data if categories empty
  const row = await db.get(`SELECT COUNT(*) AS cnt FROM categories`);
  if (row.cnt === 0) {
    // sample categories (games) and products
    await db.run(`INSERT INTO categories (name, icon) VALUES (?, ?)`, [
      "Mobile Legends",
      "ml_icon",
    ]);
    await db.run(`INSERT INTO categories (name, icon) VALUES (?, ?)`, [
      "Free Fire",
      "ff_icon",
    ]);

    const mlId = (await db.get(`SELECT id FROM categories WHERE name = ?`, [
      "Mobile Legends",
    ])).id;
    const ffId = (await db.get(`SELECT id FROM categories WHERE name = ?`, [
      "Free Fire",
    ])).id;

    await db.run(
      `INSERT INTO products (category_id, nominal, price) VALUES (?, ?, ?)`,
      [mlId, "Diamond 50", 12000]
    );
    await db.run(
      `INSERT INTO products (category_id, nominal, price) VALUES (?, ?, ?)`,
      [mlId, "Diamond 140", 32000]
    );
    await db.run(
      `INSERT INTO products (category_id, nominal, price) VALUES (?, ?, ?)`,
      [ffId, "Diamond 60", 15000]
    );
  }
}

// helper: generate invoice
function generateInvoice() {
  const t = Date.now();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `KSTORE-${t}-${rand}`;
}

// auth route (hidden seller login)
app.post("/api/auth/seller-login", (req, res) => {
  const { username, password } = req.body;
  if (username === SELLER_USERNAME && password === SELLER_PASSWORD) {
    const token = jwt.sign({ role: "seller", username }, JWT_SECRET, {
      expiresIn: "6h",
    });
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

// middleware: verify seller JWT
function verifySeller(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok: false, message: "No token" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ ok: false, message: "Bad token" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "seller")
      return res.status(403).json({ ok: false, message: "Unauthorized role" });
    req.seller = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

// GET /api/games => categories + their products
app.get("/api/games", async (req, res) => {
  try {
    const categories = await db.all(`SELECT * FROM categories ORDER BY id`);
    const result = [];
    for (const c of categories) {
      const products = await db.all(
        `SELECT id, nominal, price FROM products WHERE category_id = ?`,
        [c.id]
      );
      result.push({ ...c, products });
    }
    res.json({ ok: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// POST /api/checkout => create transaction (status Pending) + return dummy payment data
app.post("/api/checkout", async (req, res) => {
  try {
    const { product_id, buyer_name, buyer_phone } = req.body;
    if (!product_id) {
      return res.status(400).json({ ok: false, message: "product_id required" });
    }
    const product = await db.get(`SELECT * FROM products WHERE id = ?`, [
      product_id,
    ]);
    if (!product)
      return res.status(404).json({ ok: false, message: "Product not found" });

    const invoice = generateInvoice();
    const amount = product.price;

    await db.run(
      `INSERT INTO transactions (invoice, product_id, buyer_name, buyer_phone, amount, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [invoice, product_id, buyer_name || null, buyer_phone || null, amount, "Pending"]
    );

    // dummy payment response (simulate 3rd party)
    const paymentData = {
      invoice,
      amount,
      payment_provider: "DummyPay",
      payment_url: `https://dummy-pay.example/pay/${invoice}`,
      expires_at: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    };

    res.json({ ok: true, transaction: { invoice, amount, status: "Pending" }, payment: paymentData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// GET /api/orders/:invoice => check order status
app.get("/api/orders/:invoice", async (req, res) => {
  try {
    const { invoice } = req.params;
    const tx = await db.get(
      `SELECT t.invoice, t.status, t.amount, t.buyer_name, t.buyer_phone, t.created_at,
              p.nominal, p.price, c.name as game_name
       FROM transactions t
       JOIN products p ON p.id = t.product_id
       JOIN categories c ON c.id = p.category_id
       WHERE t.invoice = ?`,
      [invoice]
    );
    if (!tx) return res.status(404).json({ ok: false, message: "Invoice not found" });
    res.json({ ok: true, data: tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// PATCH /api/orders/:invoice/status => protected; update status
app.patch("/api/orders/:invoice/status", verifySeller, async (req, res) => {
  try {
    const { invoice } = req.params;
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ ok: false, message: "status required" });

    const allowed = ["Pending", "Paid", "Delivered", "Cancelled"];
    if (!allowed.includes(status))
      return res.status(400).json({ ok: false, message: "invalid status" });

    const tx = await db.get(`SELECT * FROM transactions WHERE invoice = ?`, [invoice]);
    if (!tx) return res.status(404).json({ ok: false, message: "Invoice not found" });

    await db.run(`UPDATE transactions SET status = ? WHERE invoice = ?`, [status, invoice]);

    res.json({ ok: true, invoice, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// health
app.get("/", (req, res) => res.send("Kstore API running"));

// start
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Kstore API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB init error", err);
  });