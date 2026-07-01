import { describe, it, expect } from "vitest";
import { PiiDetector } from "../index.js";
import type { PiiPattern } from "../types.js";

describe("instance-scoped custom patterns", () => {
  it("detects a custom pattern passed to the constructor", () => {
    const customPattern: PiiPattern = {
      type: "api_key",
      regex: /PROJ-[A-Z]{2,4}-\d{4,6}/g,
      confidence: 0.95,
    };
    const detector = new PiiDetector({ sensitivity: "high", patterns: [customPattern] });
    const result = detector.scan("Working on PROJ-ABC-12345 today");
    const match = result.entities.find((e) => e.value === "PROJ-ABC-12345");
    expect(match).toBeDefined();
    expect(match!.confidence).toBe(0.95);
  });

  it("does not leak custom patterns between separate PiiDetector instances", () => {
    const patternA: PiiPattern = {
      type: "api_key",
      regex: /ALPHA-\d{4}/g,
      confidence: 0.95,
    };
    const patternB: PiiPattern = {
      type: "api_key",
      regex: /BETA-\d{4}/g,
      confidence: 0.95,
    };

    const detectorA = new PiiDetector({ sensitivity: "high", patterns: [patternA] });
    const detectorB = new PiiDetector({ sensitivity: "high", patterns: [patternB] });

    const resultA = detectorA.scan("ALPHA-1234 and BETA-5678");
    expect(resultA.entities.some((e) => e.value === "ALPHA-1234")).toBe(true);
    expect(resultA.entities.some((e) => e.value === "BETA-5678")).toBe(false);

    const resultB = detectorB.scan("ALPHA-1234 and BETA-5678");
    expect(resultB.entities.some((e) => e.value === "BETA-5678")).toBe(true);
    expect(resultB.entities.some((e) => e.value === "ALPHA-1234")).toBe(false);
  });

  it("a detector created without custom patterns is unaffected by one created with them", () => {
    const customPattern: PiiPattern = {
      type: "api_key",
      regex: /ZETA-\d{4}/g,
      confidence: 0.95,
    };
    const withCustom = new PiiDetector({ sensitivity: "high", patterns: [customPattern] });
    const plain = new PiiDetector({ sensitivity: "high" });

    withCustom.scan("ZETA-1234"); // exercised first — must not affect the plain detector below

    const result = plain.scan("ZETA-1234");
    expect(result.entities.some((e) => e.value === "ZETA-1234")).toBe(false);
  });

  it("still detects all built-in patterns alongside custom ones", () => {
    const customPattern: PiiPattern = {
      type: "api_key",
      regex: /CUSTOM-\d{4}/g,
      confidence: 0.95,
    };
    const detector = new PiiDetector({ sensitivity: "high", patterns: [customPattern] });
    const result = detector.scan("Email me at john@example.com re CUSTOM-9999");
    expect(result.entities.some((e) => e.type === "email")).toBe(true);
    expect(result.entities.some((e) => e.value === "CUSTOM-9999")).toBe(true);
  });
});
