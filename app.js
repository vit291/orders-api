const express = require("express");
const app = express();

const VAT = Number(process.env.VAT_RATE || 0.17);

app.get("/health", (req, res) => res.send("ok"));

app.get("/version", (req, res) => res.json({ version: "1.0.0" }));
  res.json({ total: subtotal * (1 + VAT) });
});
function applyDiscount(total, percent) {
  return total * (1 - percent / 100);
}
app.listen(3000);