const test = require("node:test");
const assert = require("node:assert");
const { buildApp } = require("./app");
const { memoryStore } = require("./store");

async function start() {
  const server = buildApp(memoryStore()).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  return { server, url: `http://localhost:${server.address().port}` };
}

async function createOrder(url, body) {
  const res = await fetch(`${url}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

test("GET /health returns ok", async () => {
  const { server, url } = await start();
  const res = await fetch(`${url}/health`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).status, "ok");
  server.close();
});

test("order total includes 18% VAT", async () => {
  const { server, url } = await start();
  const created = await createOrder(url, { item: "keyboard", price: 100, quantity: 2 });
  assert.strictEqual(created.status, 201);
  const total = await fetch(`${url}/orders/${created.body.id}/total`).then((r) => r.json());
  assert.strictEqual(total.total, 236);
  server.close();
});

test("order without price returns 400", async () => {
  const { server, url } = await start();
  const created = await createOrder(url, { item: "mouse" });
  assert.strictEqual(created.status, 400);
  server.close();
});

test("unknown order returns 404", async () => {
  const { server, url } = await start();
  const res = await fetch(`${url}/orders/999`);
  assert.strictEqual(res.status, 404);
  server.close();
});