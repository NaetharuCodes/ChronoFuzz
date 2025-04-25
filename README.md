# ChronoFuzz

A lightweight Node.js middleware for adding time jitter to API responses to help mask timing attacks.

[![npm version](https://img.shields.io/npm/v/chronofuzz.svg)](https://www.npmjs.com/package/chronofuzz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Why ChronoFuzz?

Timing attacks are a type of side-channel attack where an attacker analyzes the time taken by an operation to infer sensitive information. By adding random delays (jitter) to your API responses, you can make it more difficult for attackers to extract meaningful information from response timing patterns.

ChronoFuzz helps you normalize response times by ensuring that all responses take at least a minimum amount of time, with random variation added to mask actual processing times.

## Installation

```bash
npm install chronofuzz
```

or

```bash
yarn add chronofuzz
```

## Usage

ChronoFuzz provides middleware adapters for both Express and Hono frameworks.

### Express

```javascript
const express = require("express");
const { express: chronofuzz } = require("chronofuzz");

const app = express();

// Apply to specific routes
app.get(
  "/api/sensitive-data",
  chronofuzz({ baseTime: 200, jitterRange: 200 }),
  (req, res) => {
    res.json({ data: "sensitive information" });
  }
);

// Or apply globally to all routes
app.use(chronofuzz({ baseTime: 200, jitterRange: 200 }));
```

### Hono

```javascript
const { Hono } = require("hono");
const { hono: chronofuzz } = require("chronofuzz");

const app = new Hono();

// Apply to specific routes
app.get(
  "/api/sensitive-data",
  chronofuzz({ baseTime: 200, jitterRange: 200 }),
  (c) => c.json({ data: "sensitive information" })
);

// Or apply globally to all routes
app.use("*", chronofuzz({ baseTime: 200, jitterRange: 200 }));
```

## Configuration Options

ChronoFuzz accepts the following options:

| Option        | Type   | Default | Description                                                                   |
| ------------- | ------ | ------- | ----------------------------------------------------------------------------- |
| `baseTime`    | number | 200     | The minimum base time (in milliseconds) for all responses                     |
| `jitterRange` | number | 200     | The maximum amount of random jitter (in milliseconds) to add to the base time |

## How It Works

1. When a request is received, ChronoFuzz starts a timer
2. Your route handler processes the request normally
3. Before the response is sent, ChronoFuzz:
   - Calculates how much time has elapsed since the request started
   - Determines a minimum processing time (baseTime + random jitter)
   - If necessary, delays the response to meet the minimum time
   - Sends the response after the delay

This ensures that all responses take at least a minimum amount of time, making timing attacks more difficult.

## TypeScript Support

ChronoFuzz includes TypeScript definitions and works seamlessly in TypeScript projects:

```typescript
import chronofuzz from "chronofuzz";

// Express
import express from "express";
const app = express();
app.use(chronofuzz.express({ baseTime: 200, jitterRange: 100 }));

// Hono
import { Hono } from "hono";
const app = new Hono();
app.use("*", chronofuzz.hono({ baseTime: 200, jitterRange: 100 }));
```

## Advanced Usage

### Custom Core Usage

If you need more control, you can use the core ChronoFuzz functionality directly:

```javascript
const { createChronoFuzz } = require("chronofuzz");

function myCustomMiddleware(options) {
  const chronofuzz = createChronoFuzz(options);

  // Implement your custom middleware using chronofuzz.calculateDelay()
  // ...
}
```

### Conditional Jitter

You can apply jitter conditionally based on the request:

```javascript
app.use((req, res, next) => {
  if (req.path.startsWith("/api/sensitive")) {
    return chronofuzz({ baseTime: 300, jitterRange: 300 })(req, res, next);
  }
  next();
});
```

## Best Practices

- Set `baseTime` to a value that's higher than your typical response time
- Use a reasonable `jitterRange` to add unpredictability without excessive delays
- Apply jitter selectively to sensitive endpoints rather than all routes when possible
- Consider the trade-off between security and performance for your specific use case

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
