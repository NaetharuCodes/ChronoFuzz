const { Hono } = require("hono");
const chronofuzzHono = require("../lib/hono-adapter");

describe("Hono Adapter", () => {
  let app;
  let originalHrtime;
  let originalRandom;
  let originalSetTimeout;

  beforeEach(() => {
    app = new Hono();

    originalHrtime = process.hrtime;
    originalRandom = Math.random;
    originalSetTimeout = global.setTimeout;

    Math.random = jest.fn().mockReturnValue(0);
    global.setTimeout = jest.fn((callback) => callback());
    process.hrtime = jest.fn(() => [0, 50000000]);
  });

  afterEach(() => {
    process.hrtime = originalHrtime;
    Math.random = originalRandom;
    global.setTimeout = originalSetTimeout;
    jest.resetAllMocks();
  });

  test("middleware adds delay when response is faster than base time", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    const c = { req: {}, res: {} };
    const next = jest.fn();

    await chronofuzzHono({ baseTime: 200, jitterRange: 0 })(c, next);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 150);
    expect(next).toHaveBeenCalled();
  });

  test("middleware does not add delay when response is slower than base time", async () => {
    process.hrtime = jest.fn(() => [0, 300000000]);
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    const c = { req: {}, res: {} };
    const next = jest.fn();

    await chronofuzzHono({ baseTime: 200, jitterRange: 0 })(c, next);

    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test("middleware uses default options when none provided", async () => {
    const c = { req: {}, res: {} };
    const next = jest.fn();

    await chronofuzzHono()(c, next);

    expect(next).toHaveBeenCalled();
  });

  test("applies jitter within specified range", async () => {
    Math.random = jest.fn().mockReturnValue(0.5);
    process.hrtime = jest.fn(() => [0, 50000000]);
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    const c = { req: {}, res: {} };
    const next = jest.fn();

    await chronofuzzHono({ baseTime: 200, jitterRange: 100 })(c, next);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 200);
    expect(next).toHaveBeenCalled();
  });
});
