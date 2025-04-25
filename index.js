// index.js
const { createChronoFuzz } = require("./lib/core");
const expressAdapter = require("./lib/express-adapter");
const honoAdapter = require("./lib/hono-adapter");

module.exports = {
  createChronoFuzz,
  express: expressAdapter,
  hono: honoAdapter,
};
