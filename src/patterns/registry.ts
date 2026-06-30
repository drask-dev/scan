import type { PiiPattern } from "../types.js";

/**
 * Central registry for all PII detection patterns.
 * Patterns are registered by region/category and merged at detection time.
 */
const patterns: PiiPattern[] = [];
let builtinSnapshot: PiiPattern[] = [];

/** Register built-in patterns and snapshot them so resetToDefaultPatterns can restore them. */
export function registerDefaultPatterns(newPatterns: PiiPattern[]): void {
  builtinSnapshot = [...newPatterns];
  patterns.push(...newPatterns);
}

/** Register additional patterns on top of whatever is currently loaded. */
export function registerPatterns(newPatterns: PiiPattern[]): void {
  patterns.push(...newPatterns);
}

export function getPatterns(): readonly PiiPattern[] {
  return patterns;
}

/** Remove all patterns, including built-ins. Use resetToDefaultPatterns() to restore. */
export function clearPatterns(): void {
  patterns.length = 0;
}

/** Restore the 26 built-in patterns, discarding any custom patterns added via registerPatterns(). */
export function resetToDefaultPatterns(): void {
  patterns.length = 0;
  patterns.push(...builtinSnapshot);
}
