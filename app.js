const express = require("express");
const { createStore } = require("./store");

const VAT = Number(process.env.VAT_RATE || 0.18);

function buildApp(store = createStore()) {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok", version: process.env.APP_VERSION || "dev" });
  });

  app.post("/orders", async (req, res) => {
    const { item, price, quantity = 1 } = req.body || {};
    if (!item || typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "item and a positive price are required" });
    }
    const order = await store.add({ item, price, quantity });
    res.status(201).json(order);
  });

  app.get("/orders/:id", async (req, res) => {
    const order = await store.get(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "order not found" });
    res.json(order);
  });

  app.get("/orders/:id/total", async (req, res) => {
    const order = await store.get(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "order not found" });
    const subtotal = order.price * order.quantity;
    const total = Math.round(subtotal * (1 + VAT) * 100) / 100;
    res.json({ subtotal, vat: VAT, total });
  });

  return app;
}

module.exports = { buildApp };