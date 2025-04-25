function createChronoFuzz(options = {}) {
  const baseTime = options.baseTime || 200;
  const jitterRange = options.jitterRange || 200;

  return {
    calculateDelay(startTime) {
      const elapsedTime = process.hrtime(startTime);
      const elapsedMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1000000;

      const minProcessingTime =
        baseTime + Math.floor(Math.random() * jitterRange);

      return Math.max(0, minProcessingTime - elapsedMs);
    },
  };
}

module.exports = { createChronoFuzz };
