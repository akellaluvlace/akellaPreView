import { describe, it, expect } from "vitest";
import { hitAreaFor, TOUCH_HIT_AREA_PX } from "../lib/touch";

// Prod-import test for lib/touch.ts. Counterweight to the bench-inline
// anti-pattern. The hook (useCoarsePointer) needs jsdom + matchMedia
// mocking and lives outside this suite's node env; only the pure helper
// + constant are covered here.

describe("lib/touch — TOUCH_HIT_AREA_PX", () => {
  it("equals 44 per platform conventions (Apple HIG / Material)", () => {
    expect(TOUCH_HIT_AREA_PX).toBe(44);
  });
});

describe("lib/touch — hitAreaFor", () => {
  it("returns visual size unchanged when pointer is not coarse", () => {
    expect(hitAreaFor(16, false)).toBe(16);
    expect(hitAreaFor(28, false)).toBe(28);
    expect(hitAreaFor(8, false)).toBe(8);
    expect(hitAreaFor(0, false)).toBe(0);
  });

  it("expands to 44 when coarse and visual is smaller", () => {
    expect(hitAreaFor(16, true)).toBe(44);
    expect(hitAreaFor(28, true)).toBe(44);
    expect(hitAreaFor(8, true)).toBe(44);
    expect(hitAreaFor(1, true)).toBe(44);
    expect(hitAreaFor(0, true)).toBe(44);
  });

  it("preserves visual size when coarse and visual is already >= 44", () => {
    expect(hitAreaFor(44, true)).toBe(44);
    expect(hitAreaFor(60, true)).toBe(60);
    expect(hitAreaFor(100, true)).toBe(100);
  });

  it("uses Math.max — never shrinks visual size", () => {
    // Sanity: an already-large visual on coarse stays large.
    expect(hitAreaFor(64, true)).toBe(64);
    expect(hitAreaFor(48, true)).toBe(48);
  });

  it("handles non-integer inputs without coercion", () => {
    expect(hitAreaFor(15.5, false)).toBe(15.5);
    expect(hitAreaFor(15.5, true)).toBe(44);
    expect(hitAreaFor(44.5, true)).toBe(44.5);
  });
});
