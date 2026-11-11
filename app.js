const express = require("express");
const app = express();
const VAT = 0.18;

app.get("/health", (req, res) => res.send("ok"));

app.get("/orders/:id/total", (req, res) => {
  const subtotal = 100;
  res.json({ total: subtotal * (1 + VAT) });
});

app.listen(3000);