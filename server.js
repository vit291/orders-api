const { buildApp } = require("./app");

const port = Number(process.env.PORT || 3000);

buildApp().listen(port, () => {
  console.log(`orders-api listening on port ${port}`);
});