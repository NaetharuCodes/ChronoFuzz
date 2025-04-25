const { createChronoFuzz } = require("./core");

function jitterbugExpress(options = {}) {
  const jitterbug = createJitterbug(options);

  return function jitterbugMiddleware(req, res, next) {
    const startTime = process.hrtime();

    const originalEnd = res.end;

    res.end = function (...args) {
      const delayMs = jitterbug.calculateDelay(startTime);

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

module.exports = jitterbugExpress;
