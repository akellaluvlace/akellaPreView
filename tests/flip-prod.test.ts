import { describe, it, expect } from "vitest";
import { detectDrift, FLIP_THRESHOLD_PX } from "../lib/ast/flip";

// Prod-import test for lib/ast/flip.ts. Counterweight to the bench inline-
// mirror anti-pattern (scripts/bench-flip.mjs inlines its own copy of the
// algorithm). detectDrift is pure: given from/last rects, returns FLIP
// deltas or null when stable. We assert null vs deltas, and that deltas
// match the spec's translate(dx, dy) scale(sx, sy) shape.

const id = (x: number, y: number, w: number, h: number) => ({
  x,
  y,
  width: w,
  height: h,
});

describe("lib/ast/flip — FLIP_THRESHOLD_PX", () => {
  it("equals 1 px per spec line 128", () => {
    expect(FLIP_THRESHOLD_PX).toBe(1);
  });
});

describe("lib/ast/flip — detectDrift", () => {
  it("returns null when from and last are identical (no drift)", () => {
    const r = id(10, 20, 100, 50);
    expect(detectDrift(r, r)).toBeNull();
  });

  it("returns null when all sides drift by <= threshold", () => {
    const from = id(10, 20, 100, 50);
    const last = id(10.5, 20.5, 100, 50); // 0.5 px on left/top
    expect(detectDrift(from, last)).toBeNull();
  });

  it("returns null at exactly threshold (<=, not <)", () => {
    const from = id(10, 20, 100, 50);
    const last = id(11, 21, 100, 50); // 1 px on left/top
    expect(detectDrift(from, last)).toBeNull();
  });

  it("returns deltas when any side exceeds threshold", () => {
    const from = id(10, 20, 100, 50);
    const last = id(11.5, 20, 100, 50); // 1.5 px left drift
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
    expect(deltas!.dx).toBeCloseTo(-1.5, 5);
    expect(deltas!.dy).toBe(0);
    expect(deltas!.sx).toBe(1);
    expect(deltas!.sy).toBe(1);
  });

  it("computes pure translation correctly", () => {
    // from at (10,20), last at (50,80) — element moved right + down.
    // FLIP inverse: translate from last back to from.
    const from = id(10, 20, 100, 50);
    const last = id(50, 80, 100, 50);
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
    expect(deltas!.dx).toBe(-40); // 10 - 50
    expect(deltas!.dy).toBe(-60); // 20 - 80
    expect(deltas!.sx).toBe(1);
    expect(deltas!.sy).toBe(1);
  });

  it("computes pure scale correctly", () => {
    // from at 100x50, last at 200x100 — element grew 2x both dims.
    // FLIP inverse: scale by 0.5 to shrink last back to from's size.
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, 200, 100);
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
    expect(deltas!.dx).toBe(0);
    expect(deltas!.dy).toBe(0);
    expect(deltas!.sx).toBe(0.5);
    expect(deltas!.sy).toBe(0.5);
  });

  it("computes mixed translation + scale correctly", () => {
    const from = id(10, 20, 100, 50);
    const last = id(30, 40, 200, 100);
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
    expect(deltas!.dx).toBe(-20);
    expect(deltas!.dy).toBe(-20);
    expect(deltas!.sx).toBe(0.5);
    expect(deltas!.sy).toBe(0.5);
  });

  it("returns null when canonical width is zero (can't animate 0×0)", () => {
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, 0, 50);
    expect(detectDrift(from, last)).toBeNull();
  });

  it("returns null when canonical height is zero", () => {
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, 100, 0);
    expect(detectDrift(from, last)).toBeNull();
  });

  it("returns null when canonical width is negative", () => {
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, -10, 50);
    expect(detectDrift(from, last)).toBeNull();
  });

  it("triggers on right-edge drift only (left + top stable)", () => {
    // Element kept its top-left, but its right edge moved 5 px.
    // last.width changed from 100 → 95.
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, 95, 50);
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
    expect(deltas!.dx).toBe(0);
    expect(deltas!.dy).toBe(0);
    expect(deltas!.sx).toBeCloseTo(100 / 95, 5);
    expect(deltas!.sy).toBe(1);
  });

  it("triggers on bottom-edge drift only", () => {
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, 100, 45);
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
    expect(deltas!.dx).toBe(0);
    expect(deltas!.dy).toBe(0);
    expect(deltas!.sx).toBe(1);
    expect(deltas!.sy).toBeCloseTo(50 / 45, 5);
  });

  it("triggers when right edge above threshold even if left stable", () => {
    // Spec contract: "trigger only when at least one side differs by more
    // than FLIP_THRESHOLD_PX". A pure scale that nudges only the right
    // edge by 2 px is real motion the user perceives.
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, 102, 50);
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
  });

  it("does NOT trigger when right edge exactly at threshold", () => {
    const from = id(0, 0, 100, 50);
    const last = id(0, 0, 101, 50); // right edge: from(100) - last(101) = -1
    expect(detectDrift(from, last)).toBeNull();
  });

  it("returns sx/sy as positive ratios even when last shrunk past from", () => {
    // Width decreased: from 200 → 100. Sx = 200/100 = 2 (last needs to scale 2x to match from).
    const from = id(0, 0, 200, 100);
    const last = id(0, 0, 100, 50);
    const deltas = detectDrift(from, last);
    expect(deltas).not.toBeNull();
    expect(deltas!.sx).toBe(2);
    expect(deltas!.sy).toBe(2);
  });
});
