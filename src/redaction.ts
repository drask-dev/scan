import type { PiiEntity } from "./types.js";

/**
 * Replace detected PII entities with redaction tokens.
 * Numbers tokens left-to-right ([EMAIL_1] before [EMAIL_2]),
 * then applies replacements right-to-left to preserve string indices.
 */
export function redact(text: string, entities: PiiEntity[]): string {
  const counters = new Map<string, number>();

  // Assign token numbers left-to-right
  const forward = [...entities].sort((a, b) => a.start - b.start);
  const tokenMap = new Map<PiiEntity, string>();
  for (const entity of forward) {
    const count = (counters.get(entity.type) ?? 0) + 1;
    counters.set(entity.type, count);
    tokenMap.set(entity, `[${entity.type.toUpperCase()}_${count}]`);
  }

  // Apply replacements right-to-left so indices stay valid
  const backward = [...entities].sort((a, b) => b.start - a.start);
  let result = text;
  for (const entity of backward) {
    result = result.slice(0, entity.start) + tokenMap.get(entity)! + result.slice(entity.end);
  }

  return result;
}
