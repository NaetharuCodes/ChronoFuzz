const { createChronoFuzz } = require("../lib/core");

describe("ChronoFuzz Core", () => {
  let originalHrtime;
  let originalRandom;

  beforeEach(() => {
    originalHrtime = process.hrtime;
    originalRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0);
  });

  afterEach(() => {
    process.hrtime = originalHrtime;
    Math.random = originalRandom;
    jest.resetAllMocks();
  });

  test("calculates delay correctly when elapsed time is less than base time", () => {
    const mockStartTime = [0, 0];
    process.hrtime = jest.fn(() => [0, 100000000]);

    const chronofuzz = createChronoFuzz({
      baseTime: 200,
      jitterRange: 0,
    });

    const delay = chronofuzz.calculateDelay(mockStartTime);
    expect(delay).toBe(100);
  });

  test("calculates zero delay when elapsed time exceeds base time", () => {
    const mockStartTime = [0, 0];
    process.hrtime = jest.fn(() => [0, 500000000]);

    const chronofuzz = createChronoFuzz({
      baseTime: 200,
      jitterRange: 0,
    });

    const delay = chronofuzz.calculateDelay(mockStartTime);
    expect(delay).toBe(0);
  });

  test("adds random jitter within the specified range", () => {
    const mockStartTime = [0, 0];
    process.hrtime = jest.fn(() => [0, 100000000]);
    Math.random = jest.fn().mockReturnValue(0.5);

    const chronofuzz = createChronoFuzz({
      baseTime: 200,
      jitterRange: 100,
    });

    const delay = chronofuzz.calculateDelay(mockStartTime);
    expect(delay).toBe(150);
  });

  test("uses default options when none provided", () => {
    const mockStartTime = [0, 0];
    process.hrtime = jest.fn(() => [0, 0]);
    Math.random = jest.fn().mockReturnValue(0);

    const chronofuzz = createChronoFuzz();

    const delay = chronofuzz.calculateDelay(mockStartTime);
    expect(delay).toBe(200);
  });
});
