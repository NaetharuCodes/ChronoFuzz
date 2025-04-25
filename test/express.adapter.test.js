const express = require("express");
const request = require("supertest");
const chronofuzzExpress = require("../lib/express-adapter");

describe("Express Adapter", () => {
  let app;
  let originalHrtime;
  let originalRandom;
  let originalSetTimeout;

  beforeEach(() => {
    app = express();

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

    app.get(
      "/test",
      chronofuzzExpress({ baseTime: 200, jitterRange: 0 }),
      (req, res) => res.send("test")
    );

    await request(app).get("/test");

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 150);
  });

  test("middleware does not add delay when response is slower than base time", async () => {
    process.hrtime = jest.fn(() => [0, 300000000]);
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    app.get(
      "/test",
      chronofuzzExpress({ baseTime: 200, jitterRange: 0 }),
      (req, res) => res.send("test")
    );

    await request(app).get("/test");

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  test("middleware uses default options when none provided", async () => {
    app.get("/test", chronofuzzExpress(), (req, res) => res.send("test"));

    const response = await request(app).get("/test");
    expect(response.status).toBe(200);
  });

  test("applies jitter within specified range", async () => {
    Math.random = jest.fn().mockReturnValue(0.5);
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    app.get(
      "/test",
      chronofuzzExpress({ baseTime: 200, jitterRange: 100 }),
      (req, res) => res.send("test")
    );

    await request(app).get("/test");

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 200);
  });
});
