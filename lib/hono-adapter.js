const { createChronoFuzz } = require("./core");

function chronofuzzHono(options = {}) {
  const chronofuzz = createChronoFuzz(options);

  return async function chronofuzzMiddleware(c, next) {
    const startTime = process.hrtime();

    await next();

    const delayMs = chronofuzz.calculateDelay(startTime);

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  };
}

module.exports = chronofuzzHono;
