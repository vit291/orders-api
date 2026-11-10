const express = require("express");
const app = express();

const VAT = Number(process.env.VAT_RATE || 0.17);

app.get("/health", (req, res) => res.send("ok"));

app.get("/orders/:id/total", (req, res) => {
  const subtotal = 100;
  res.json({ total: subtotal * (1 + VAT) });
});
function applyDiscount(total, percent) {
  return total * (1 - percent / 100);
}
app.listen(3000);