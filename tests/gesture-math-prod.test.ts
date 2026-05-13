import { describe, it, expect } from "vitest";
import {
  applyElasticDim,
  captureAspect,
  computeDims,
  computeSpacing,
  ELASTIC_COEFFICIENT,
  handleAxes,
  isCornerHandle,
  type ComputeDimsInput,
  type ComputeSpacingInput,
} from "../lib/ast/gesture-math";
import type { DragModifiers, SizeHandle } from "../lib/ast/intent-resolver";

// Prod-import test for lib/ast/gesture-math.ts. Counterweight to the
// bench inline-mirror anti-pattern (scripts/bench-gesture.mjs inlines its
// own copy). All exports are pure functions — no DOM, no React, no refs.

const NO_MODS: DragModifiers = { alt: false, shift: false, cmd: false };
const ALT: DragModifiers = { alt: true, shift: false, cmd: false };
const SHIFT: DragModifiers = { alt: false, shift: true, cmd: false };
const ALT_SHIFT: DragModifiers = { alt: true, shift: true, cmd: false };

const baseDims = (handle: SizeHandle): ComputeDimsInput => ({
  handle,
  startX: 100,
  startY: 100,
  startW: 200,
  startH: 100,
  aspect: 2, // 200/100
});

describe("gesture-math — ELASTIC_COEFFICIENT", () => {
  it("equals 0.15 (tldraw / @use-gesture / iOS scrollViews convention)", () => {
    expect(ELASTIC_COEFFICIENT).toBe(0.15);
  });
});

describe("gesture-math — applyElasticDim", () => {
  it("returns desired unchanged when at min", () => {
    expect(applyElasticDim(50, 50)).toBe(50);
  });
  it("returns desired unchanged when above min", () => {
    expect(applyElasticDim(75, 50)).toBe(75);
    expect(applyElasticDim(1000, 50)).toBe(1000);
  });
  it("rubberbands when below min", () => {
    // 1px below: dampen by 0.15 → returns min - 1*0.15 = 49.85
    expect(applyElasticDim(49, 50)).toBeCloseTo(49.85, 5);
    // 10px below: returns min - 10*0.15 = 48.5
    expect(applyElasticDim(40, 50)).toBeCloseTo(48.5, 5);
  });
  it("never returns NaN even far below min", () => {
    const result = applyElasticDim(-1000, 50);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe("gesture-math — isCornerHandle", () => {
  it("returns true for the 4 corners", () => {
    expect(isCornerHandle("tl")).toBe(true);
    expect(isCornerHandle("tr")).toBe(true);
    expect(isCornerHandle("bl")).toBe(true);
    expect(isCornerHandle("br")).toBe(true);
  });
  it("returns false for the 4 edges", () => {
    expect(isCornerHandle("t")).toBe(false);
    expect(isCornerHandle("r")).toBe(false);
    expect(isCornerHandle("b")).toBe(false);
    expect(isCornerHandle("l")).toBe(false);
  });
});

describe("gesture-math — handleAxes", () => {
  it("l/r are width-only", () => {
    expect(handleAxes("l")).toEqual({ width: true, height: false });
    expect(handleAxes("r")).toEqual({ width: true, height: false });
  });
  it("t/b are height-only", () => {
    expect(handleAxes("t")).toEqual({ width: false, height: true });
    expect(handleAxes("b")).toEqual({ width: false, height: true });
  });
  it("corners are both axes", () => {
    expect(handleAxes("tl")).toEqual({ width: true, height: true });
    expect(handleAxes("tr")).toEqual({ width: true, height: true });
    expect(handleAxes("bl")).toEqual({ width: true, height: true });
    expect(handleAxes("br")).toEqual({ width: true, height: true });
  });
});

describe("gesture-math — captureAspect", () => {
  it("returns startW/startH for valid dims", () => {
    expect(captureAspect(200, 100)).toBe(2);
    expect(captureAspect(50, 100)).toBe(0.5);
    expect(captureAspect(100, 100)).toBe(1);
  });
  it("returns null for zero width", () => {
    expect(captureAspect(0, 100)).toBeNull();
  });
  it("returns null for zero height", () => {
    expect(captureAspect(100, 0)).toBeNull();
  });
  it("returns null for negative dims (degenerate)", () => {
    expect(captureAspect(-10, 100)).toBeNull();
    expect(captureAspect(100, -10)).toBeNull();
  });
});

describe("gesture-math — computeDims (4b baseline)", () => {
  it("br corner: drag right+down grows both", () => {
    const r = computeDims(baseDims("br"), 130, 120, NO_MODS);
    expect(r.w).toBe(230);
    expect(r.h).toBe(120);
  });
  it("tl corner: drag right+down shrinks both", () => {
    const r = computeDims(baseDims("tl"), 130, 120, NO_MODS);
    expect(r.w).toBe(170);
    expect(r.h).toBe(80);
  });
  it("tr corner: drag right+down grows w shrinks h", () => {
    const r = computeDims(baseDims("tr"), 130, 120, NO_MODS);
    expect(r.w).toBe(230);
    expect(r.h).toBe(80);
  });
  it("bl corner: drag right+down shrinks w grows h", () => {
    const r = computeDims(baseDims("bl"), 130, 120, NO_MODS);
    expect(r.w).toBe(170);
    expect(r.h).toBe(120);
  });

  it("r edge: emits width only", () => {
    const r = computeDims(baseDims("r"), 130, 130, NO_MODS);
    expect(r.w).toBe(230);
    expect(r.h).toBeNull();
  });
  it("l edge: emits width only (inverted dx)", () => {
    const r = computeDims(baseDims("l"), 130, 130, NO_MODS);
    expect(r.w).toBe(170);
    expect(r.h).toBeNull();
  });
  it("t edge: emits height only (inverted dy)", () => {
    const r = computeDims(baseDims("t"), 130, 130, NO_MODS);
    expect(r.w).toBeNull();
    expect(r.h).toBe(70);
  });
  it("b edge: emits height only", () => {
    const r = computeDims(baseDims("b"), 130, 130, NO_MODS);
    expect(r.w).toBeNull();
    expect(r.h).toBe(130);
  });

  it("clamps negative width at 0", () => {
    const r = computeDims(baseDims("r"), -200, 100, NO_MODS); // dx = -300
    expect(r.w).toBe(0);
  });
  it("clamps negative height at 0", () => {
    const r = computeDims(baseDims("b"), 100, -200, NO_MODS); // dy = -300
    expect(r.h).toBe(0);
  });

  it("rounds output to integers", () => {
    const r = computeDims(baseDims("br"), 100.7, 100.4, NO_MODS);
    expect(Number.isInteger(r.w)).toBe(true);
    expect(Number.isInteger(r.h)).toBe(true);
  });
});

describe("gesture-math — computeDims (4c-ii Alt mirror)", () => {
  it("alt doubles delta on br corner (both axes)", () => {
    const r = computeDims(baseDims("br"), 130, 120, ALT);
    expect(r.w).toBe(260); // 200 + 30*2
    expect(r.h).toBe(140); // 100 + 20*2
  });
  it("alt doubles delta on r edge (single axis only)", () => {
    const r = computeDims(baseDims("r"), 130, 130, ALT);
    expect(r.w).toBe(260); // 200 + 30*2
    expect(r.h).toBeNull();
  });
});

describe("gesture-math — computeDims (4c-ii Shift aspect lock)", () => {
  it("br + shift: width-dominant drag locks h to w/aspect", () => {
    // dx=30, dy=20: width dominant. w = 230, h = 230/2 = 115
    const r = computeDims(baseDims("br"), 130, 120, SHIFT);
    expect(r.w).toBe(230);
    expect(r.h).toBe(115);
  });
  it("br + shift: height-dominant drag locks w to h*aspect", () => {
    // dx=10, dy=50: height dominant. h = 150, w = 150*2 = 300
    const r = computeDims(baseDims("br"), 110, 150, SHIFT);
    expect(r.w).toBe(300);
    expect(r.h).toBe(150);
  });
  it("r edge + shift: derives h from aspect", () => {
    // r emits width only. With shift, h = w/aspect.
    const r = computeDims(baseDims("r"), 130, 130, SHIFT);
    expect(r.w).toBe(230);
    expect(r.h).toBe(115);
  });
  it("t edge + shift: derives w from aspect", () => {
    // t emits height only. With shift, w = h*aspect.
    // dy = 30, h = 100 - 30 = 70, w = 70*2 = 140
    const r = computeDims(baseDims("t"), 130, 130, SHIFT);
    expect(r.h).toBe(70);
    expect(r.w).toBe(140);
  });
  it("shift no-ops when aspect is null (degenerate start)", () => {
    const input: ComputeDimsInput = {
      ...baseDims("br"),
      aspect: null,
    };
    const r = computeDims(input, 130, 130, SHIFT);
    // Behaves like 4b baseline.
    expect(r.w).toBe(230);
    expect(r.h).toBe(130);
  });
});

describe("gesture-math — computeDims (Alt + Shift combined)", () => {
  it("alt mirrors then shift locks", () => {
    // dx=30 (alt → 60), dy=20 (alt → 40). w=260, h=140 raw.
    // dw=60, dh=40 → width dominant. h = 260/2 = 130.
    const r = computeDims(baseDims("br"), 130, 120, ALT_SHIFT);
    expect(r.w).toBe(260);
    expect(r.h).toBe(130);
  });
});

const baseSpacing = (
  axis: "x" | "y",
  signMul: 1 | -1,
  kind: "padding" | "margin"
): ComputeSpacingInput => ({
  axis,
  signMul,
  kind,
  startX: 100,
  startY: 100,
  startValue: 16,
  startOppositeValue: 16,
});

describe("gesture-math — computeSpacing (padding)", () => {
  it("pt: drag down increases (signMul=+1, axis=y)", () => {
    const r = computeSpacing(baseSpacing("y", 1, "padding"), 100, 130, NO_MODS);
    expect(r.active).toBe(46); // 16 + 30
    expect(r.opposite).toBeNull();
  });
  it("pb: drag up increases (signMul=-1, axis=y)", () => {
    const r = computeSpacing(
      baseSpacing("y", -1, "padding"),
      100,
      70,
      NO_MODS
    );
    expect(r.active).toBe(46); // 16 + (100-70)*(-(-1))=...
    // Actually dy = -30, signMul = -1, valueDelta = (-30)*(-1) = 30
    // active = 16 + 30 = 46
    expect(r.opposite).toBeNull();
  });
  it("pl: drag right increases (signMul=+1, axis=x)", () => {
    const r = computeSpacing(baseSpacing("x", 1, "padding"), 130, 100, NO_MODS);
    expect(r.active).toBe(46);
  });
  it("pr: drag left increases (signMul=-1, axis=x)", () => {
    const r = computeSpacing(
      baseSpacing("x", -1, "padding"),
      70,
      100,
      NO_MODS
    );
    expect(r.active).toBe(46);
  });

  it("padding clamps active at 0 (CSS rule)", () => {
    const r = computeSpacing(baseSpacing("y", 1, "padding"), 100, 50, NO_MODS);
    // dy=-50, signMul=+1, valueDelta=-50, active=16-50=-34 → clamp 0
    expect(r.active).toBe(0);
  });
});

describe("gesture-math — computeSpacing (margin)", () => {
  it("margin allows negative values (overlap is valid CSS)", () => {
    const r = computeSpacing(baseSpacing("y", 1, "margin"), 100, 50, NO_MODS);
    // dy=-50, valueDelta=-50, active=16-50=-34, NO clamp for margin
    expect(r.active).toBe(-34);
  });
  it("mt: drag up increases (signMul=-1, axis=y)", () => {
    const r = computeSpacing(baseSpacing("y", -1, "margin"), 100, 70, NO_MODS);
    // dy=-30, signMul=-1, valueDelta=30, active=16+30=46
    expect(r.active).toBe(46);
  });
});

describe("gesture-math — computeSpacing (Alt mirror)", () => {
  it("alt sets opposite to startOppositeValue + valueDelta", () => {
    const r = computeSpacing(baseSpacing("y", 1, "padding"), 100, 130, ALT);
    expect(r.active).toBe(46);
    expect(r.opposite).toBe(46); // both sides started at 16, both grow 30
  });

  it("alt clamps opposite at 0 for padding", () => {
    const input = baseSpacing("y", 1, "padding");
    input.startOppositeValue = 5;
    const r = computeSpacing(input, 100, 50, ALT);
    // dy=-50, valueDelta=-50. active=16-50=-34 → 0. opp=5-50=-45 → 0.
    expect(r.active).toBe(0);
    expect(r.opposite).toBe(0);
  });

  it("alt does NOT clamp opposite for margin (negative ok)", () => {
    const input = baseSpacing("y", 1, "margin");
    input.startOppositeValue = 5;
    const r = computeSpacing(input, 100, 50, ALT);
    expect(r.active).toBe(-34);
    expect(r.opposite).toBe(-45);
  });

  it("rounds output to integers", () => {
    const r = computeSpacing(
      baseSpacing("y", 1, "padding"),
      100,
      130.6,
      NO_MODS
    );
    expect(Number.isInteger(r.active)).toBe(true);
  });
});
