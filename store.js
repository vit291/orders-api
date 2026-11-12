const { Pool } = require("pg");

// In-memory store: used for tests and when no database is configured
function memoryStore() {
  const orders = new Map();
  let nextId = 1;
  return {
    async add(order) {
      const saved = { id: nextId++, ...order };
      orders.set(saved.id, saved);
      return saved;
    },
    async get(id) {
      return orders.get(id) || null;
    },
  };
}

// PostgreSQL store: used when DATABASE_URL is set
function pgStore(url) {
  const pool = new Pool({ connectionString: url });
  const ready = pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id       SERIAL PRIMARY KEY,
      item     TEXT    NOT NULL,
      price    NUMERIC NOT NULL,
      quantity INT     NOT NULL
    )`);
  const toOrder = (r) => ({ id: r.id, item: r.item, price: Number(r.price), quantity: r.quantity });
  return {
    async add({ item, price, quantity }) {
      await ready;
      const { rows } = await pool.query(
        "INSERT INTO orders (item, price, quantity) VALUES ($1, $2, $3) RETURNING *",
        [item, price, quantity]
      );
      return toOrder(rows[0]);
    },
    async get(id) {
      await ready;
      const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
      return rows[0] ? toOrder(rows[0]) : null;
    },
  };
}

function createStore() {
  return process.env.DATABASE_URL ? pgStore(process.env.DATABASE_URL) : memoryStore();
}

module.exports = { createStore, memoryStore };