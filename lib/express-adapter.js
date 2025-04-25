const { createChronoFuzz } = require("./core");

function chronofuzzExpress(options = {}) {
  const chronofuzz = createChronoFuzz(options);

  return function chronofuzzMiddleware(req, res, next) {
    const startTime = process.hrtime();

    const originalEnd = res.end;

    res.end = function (...args) {
      const delayMs = chronofuzz.calculateDelay(startTime);

      if (delayMs > 0) {
        setTimeout(() => {
          originalEnd.apply(this, args);
        }, delayMs);
      } else {
        originalEnd.apply(this, args);
      }
    };

    next();
  };
}

module.exports = chronofuzzExpress;
