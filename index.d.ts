// Type definitions for chronofuzz
// Project: https://github.com/yourusername/chronofuzz
// TypeScript Version: 4.5

import { NextFunction, Request, Response } from "express";
import { Context, Next } from "hono";

/**
 * Configuration options for ChronoFuzz
 */
export interface ChronoFuzzOptions {
  /**
   * The base processing time in milliseconds (minimum time each response will take)
   * @default 200
   */
  baseTime?: number;

  /**
   * The maximum random jitter to add to the base time in milliseconds
   * @default 200
   */
  jitterRange?: number;
}

/**
 * Core ChronoFuzz functionality
 */
export interface ChronoFuzzCore {
  /**
   * Calculates the delay needed to normalize response time
   * @param startTime - The hrtime tuple from when the request started
   * @returns The delay in milliseconds to wait before responding
   */
  calculateDelay(startTime: [number, number]): number;
}

/**
 * Creates a ChronoFuzz instance with the core functionality
 * @param options - Configuration options
 * @returns A ChronoFuzz core instance
 */
export function createChronoFuzz(options?: ChronoFuzzOptions): ChronoFuzzCore;

/**
 * Express middleware for adding time jitter to responses
 * @param options - Configuration options
 * @returns Express middleware function
 */
export function express(
  options?: ChronoFuzzOptions
): (req: Request, res: Response, next: NextFunction) => void;

/**
 * Hono middleware for adding time jitter to responses
 * @param options - Configuration options
 * @returns Hono middleware function
 */
export function hono(
  options?: ChronoFuzzOptions
): (c: Context, next: Next) => Promise<void>;

// Default export
declare const chronofuzz: {
  createChronoFuzz: typeof createChronoFuzz;
  express: typeof express;
  hono: typeof hono;
};

export default chronofuzz;
