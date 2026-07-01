import type { PiiPattern } from "../types.js";

/**
 * Read-only store for the built-in default patterns. Populated once at
 * module import time by patterns/index.ts. Custom patterns are NOT stored
 * here — they are passed to PiiDetector's constructor and scoped to that
 * instance only (see DetectorConfig.patterns in types.ts). This avoids the
 * cross-instance pattern leakage that a mutable global registry caused.
 */
let defaultPatterns: readonly PiiPattern[] = [];

/** Called once at import time by patterns/index.ts to register the built-in set. */
export function setDefaultPatterns(patterns: PiiPattern[]): void {
  defaultPatterns = Object.freeze([...patterns]);
}

/** The 26 built-in patterns. Always the same set — never mutated at runtime. */
export function getPatterns(): readonly PiiPattern[] {
  return defaultPatterns;
}
