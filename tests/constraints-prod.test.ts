import { describe, it, expect } from "vitest";
import {
  ASPECT_DISTORTION_TOLERANCE,
  compositeRgba,
  contrastRatio,
  evaluateSoftConstraints,
  OVERFLOW_TOLERANCE_PX,
  parseRgbColor,
  relativeLuminance,
  TEXT_SIZE_MIN_PX,
  TOUCH_TARGET_MIN_PX,
  WCAG_AA_LARGE,
  WCAG_AA_NORMAL,
  WCAG_BOLD_WEIGHT,
  WCAG_LARGE_BOLD_FONT_PX,
  WCAG_LARGE_FONT_PX,
  wcagThreshold,
  type Rgba,
  type SoftConstraintInput,
} from "../lib/ast/constraints";

// Prod-import test for lib/ast/constraints.ts. Counterweight to scripts/
// bench-constraints.mjs and bench-contrast.mjs inline-mirrors. Powers the
// soft-constraint warning chips (touch-target, text-size, aspect, WCAG
// contrast, parent-overflow) the user sees during gestures.

const black: Rgba = { r: 0, g: 0, b: 0, a: 1 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 1 };
const red: Rgba = { r: 255, g: 0, b: 0, a: 1 };
const transparent: Rgba = { r: 255, g: 255, b: 255, a: 0 };

const buildInput = (
  overrides: Partial<SoftConstraintInput> = {}
): SoftConstraintInput => ({
  bounds: { x: 0, y: 0, width: 100, height: 100 },
  parentBounds: { x: 0, y: 0, width: 200, height: 200 },
  fontSizePx: 16,
  fontWeight: 400,
  isInteractive: false,
  hasDirectText: false,
  isImage: false,
  naturalAspect: null,
  fgColor: null,
  bgColor: null,
  ...overrides,
});

describe("constraints — thresholds", () => {
  it("TOUCH_TARGET_MIN_PX = 32", () => {
    expect(TOUCH_TARGET_MIN_PX).toBe(32);
  });
  it("TEXT_SIZE_MIN_PX = 12", () => {
    expect(TEXT_SIZE_MIN_PX).toBe(12);
  });
  it("ASPECT_DISTORTION_TOLERANCE = 0.05 (5%)", () => {
    expect(ASPECT_DISTORTION_TOLERANCE).toBe(0.05);
  });
  it("WCAG_AA_NORMAL = 4.5 (per WCAG 2.1)", () => {
    expect(WCAG_AA_NORMAL).toBe(4.5);
  });
  it("WCAG_AA_LARGE = 3.0", () => {
    expect(WCAG_AA_LARGE).toBe(3.0);
  });
  it("WCAG_LARGE_FONT_PX = 18", () => {
    expect(WCAG_LARGE_FONT_PX).toBe(18);
  });
  it("WCAG_LARGE_BOLD_FONT_PX = 14, WCAG_BOLD_WEIGHT = 700", () => {
    expect(WCAG_LARGE_BOLD_FONT_PX).toBe(14);
    expect(WCAG_BOLD_WEIGHT).toBe(700);
  });
  it("OVERFLOW_TOLERANCE_PX = 1", () => {
    expect(OVERFLOW_TOLERANCE_PX).toBe(1);
  });
});

describe("constraints — relativeLuminance", () => {
  it("black = 0", () => {
    expect(relativeLuminance(black)).toBe(0);
  });
  it("white = 1", () => {
    expect(relativeLuminance(white)).toBe(1);
  });
  it("mid gray (#808080) ~ 0.21586", () => {
    const gray: Rgba = { r: 128, g: 128, b: 128, a: 1 };
    expect(relativeLuminance(gray)).toBeCloseTo(0.21586, 4);
  });
  it("red contributes ~0.2126 to white", () => {
    expect(relativeLuminance(red)).toBeCloseTo(0.2126, 4);
  });
});

describe("constraints — contrastRatio", () => {
  it("black on white = 21:1 (max)", () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
  });
  it("white on black = 21:1 (symmetric)", () => {
    expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
  });
  it("white on white = 1:1 (no contrast)", () => {
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5);
  });
  it("#767676 on white passes AA normal (≥4.5)", () => {
    const gray: Rgba = { r: 0x76, g: 0x76, b: 0x76, a: 1 };
    expect(contrastRatio(gray, white)).toBeGreaterThanOrEqual(4.5);
  });
  it("#777 on white fails AA normal (boundary)", () => {
    const gray: Rgba = { r: 0x77, g: 0x77, b: 0x77, a: 1 };
    // #777 is just under the 4.5:1 line.
    expect(contrastRatio(gray, white)).toBeLessThan(4.5);
  });
});

describe("constraints — compositeRgba", () => {
  it("opaque top returns top-as-is (kinda)", () => {
    // Spec: top.a=1 → output a=1, output rgb = top's rgb.
    const result = compositeRgba(black, white);
    expect(result.r).toBe(0);
    expect(result.g).toBe(0);
    expect(result.b).toBe(0);
    expect(result.a).toBe(1);
  });
  it("fully transparent top returns bg", () => {
    const result = compositeRgba(transparent, black);
    expect(result.r).toBe(0);
    expect(result.g).toBe(0);
    expect(result.b).toBe(0);
    expect(result.a).toBe(1);
  });
  it("50% top blends to gray over black", () => {
    const halfWhite: Rgba = { r: 255, g: 255, b: 255, a: 0.5 };
    const result = compositeRgba(halfWhite, black);
    expect(result.r).toBeCloseTo(127.5, 1);
    expect(result.a).toBe(1);
  });
  it("two transparent layers stay transparent (a=0 → all zeros)", () => {
    const allZero: Rgba = { r: 0, g: 0, b: 0, a: 0 };
    const result = compositeRgba(allZero, allZero);
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });
});

describe("constraints — parseRgbColor", () => {
  it("parses rgb(r, g, b)", () => {
    expect(parseRgbColor("rgb(255, 100, 50)")).toEqual({
      r: 255,
      g: 100,
      b: 50,
      a: 1,
    });
  });
  it("parses rgba(r, g, b, a)", () => {
    expect(parseRgbColor("rgba(255, 100, 50, 0.5)")).toEqual({
      r: 255,
      g: 100,
      b: 50,
      a: 0.5,
    });
  });
  it("tolerates whitespace variations", () => {
    expect(parseRgbColor("rgb(0,0,0)")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(parseRgbColor("rgba( 1 , 2 , 3 , 0.4 )")).toEqual({
      r: 1,
      g: 2,
      b: 3,
      a: 0.4,
    });
  });
  it("returns null for unparsable strings", () => {
    expect(parseRgbColor("hsl(0, 0%, 0%)")).toBeNull();
    expect(parseRgbColor("not-a-color")).toBeNull();
    expect(parseRgbColor("")).toBeNull();
  });
  it("returns null for non-string input", () => {
    expect(parseRgbColor(undefined as unknown as string)).toBeNull();
    expect(parseRgbColor(null as unknown as string)).toBeNull();
  });
});

describe("constraints — wcagThreshold", () => {
  it("font ≥ 18px → large (3.0)", () => {
    expect(wcagThreshold(18, 400)).toBe(WCAG_AA_LARGE);
    expect(wcagThreshold(24, 400)).toBe(WCAG_AA_LARGE);
  });
  it("font ≥ 14px AND bold ≥ 700 → large (3.0)", () => {
    expect(wcagThreshold(14, 700)).toBe(WCAG_AA_LARGE);
    expect(wcagThreshold(16, 800)).toBe(WCAG_AA_LARGE);
  });
  it("font ≥ 14px but not bold → normal (4.5)", () => {
    expect(wcagThreshold(14, 400)).toBe(WCAG_AA_NORMAL);
    expect(wcagThreshold(16, 600)).toBe(WCAG_AA_NORMAL);
  });
  it("font < 14px → normal regardless of weight", () => {
    expect(wcagThreshold(12, 400)).toBe(WCAG_AA_NORMAL);
    expect(wcagThreshold(12, 900)).toBe(WCAG_AA_NORMAL);
  });
});

describe("constraints — evaluateSoftConstraints: touch-target", () => {
  it("does not warn for non-interactive elements (any size)", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isInteractive: false,
        bounds: { x: 0, y: 0, width: 10, height: 10 },
      })
    );
    expect(result.find((w) => w.kind === "touch-target")).toBeUndefined();
  });

  it("warns when interactive element below 32px on x", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isInteractive: true,
        bounds: { x: 0, y: 0, width: 20, height: 40 },
      })
    );
    const warn = result.find((w) => w.kind === "touch-target");
    expect(warn).toBeDefined();
    expect(warn!.axis).toBe("x");
  });

  it("warns when interactive element below 32px on y", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isInteractive: true,
        bounds: { x: 0, y: 0, width: 40, height: 20 },
      })
    );
    expect(result.find((w) => w.kind === "touch-target")?.axis).toBe("y");
  });

  it("warns 'both' when below threshold on both axes", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isInteractive: true,
        bounds: { x: 0, y: 0, width: 16, height: 16 },
      })
    );
    expect(result.find((w) => w.kind === "touch-target")?.axis).toBe("both");
  });

  it("does not warn for zero-size element (probably hidden)", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isInteractive: true,
        bounds: { x: 0, y: 0, width: 0, height: 0 },
      })
    );
    expect(result.find((w) => w.kind === "touch-target")).toBeUndefined();
  });

  it("does not warn at exactly 32px (boundary)", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isInteractive: true,
        bounds: { x: 0, y: 0, width: 32, height: 32 },
      })
    );
    expect(result.find((w) => w.kind === "touch-target")).toBeUndefined();
  });
});

describe("constraints — evaluateSoftConstraints: text-size", () => {
  it("warns when hasDirectText AND fontSize < 12", () => {
    const result = evaluateSoftConstraints(
      buildInput({ hasDirectText: true, fontSizePx: 10 })
    );
    expect(result.find((w) => w.kind === "text-size")).toBeDefined();
  });
  it("does not warn when fontSize >= 12", () => {
    const result = evaluateSoftConstraints(
      buildInput({ hasDirectText: true, fontSizePx: 12 })
    );
    expect(result.find((w) => w.kind === "text-size")).toBeUndefined();
  });
  it("does not warn when hasDirectText is false", () => {
    const result = evaluateSoftConstraints(
      buildInput({ hasDirectText: false, fontSizePx: 8 })
    );
    expect(result.find((w) => w.kind === "text-size")).toBeUndefined();
  });
  it("does not warn when fontSize is 0 (unloaded / display:none)", () => {
    const result = evaluateSoftConstraints(
      buildInput({ hasDirectText: true, fontSizePx: 0 })
    );
    expect(result.find((w) => w.kind === "text-size")).toBeUndefined();
  });
});

describe("constraints — evaluateSoftConstraints: aspect", () => {
  it("warns when image rendered at distorted aspect", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isImage: true,
        naturalAspect: 1.0, // 1:1
        bounds: { x: 0, y: 0, width: 200, height: 100 }, // 2:1
      })
    );
    expect(result.find((w) => w.kind === "aspect-distorted")).toBeDefined();
  });

  it("does not warn within 5% tolerance", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isImage: true,
        naturalAspect: 1.0,
        bounds: { x: 0, y: 0, width: 102, height: 100 }, // 1.02:1, within 5%
      })
    );
    expect(result.find((w) => w.kind === "aspect-distorted")).toBeUndefined();
  });

  it("does not warn when natural is null (loading / unknown)", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isImage: true,
        naturalAspect: null,
        bounds: { x: 0, y: 0, width: 100, height: 50 },
      })
    );
    expect(result.find((w) => w.kind === "aspect-distorted")).toBeUndefined();
  });

  it("does not warn for non-image elements", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        isImage: false,
        naturalAspect: 1.0,
        bounds: { x: 0, y: 0, width: 200, height: 50 },
      })
    );
    expect(result.find((w) => w.kind === "aspect-distorted")).toBeUndefined();
  });
});

describe("constraints — evaluateSoftConstraints: contrast", () => {
  it("warns when ratio below WCAG AA normal", () => {
    const lightGray: Rgba = { r: 200, g: 200, b: 200, a: 1 };
    const result = evaluateSoftConstraints(
      buildInput({
        hasDirectText: true,
        fgColor: lightGray,
        bgColor: white,
        fontSizePx: 14,
        fontWeight: 400,
      })
    );
    expect(result.find((w) => w.kind === "contrast")).toBeDefined();
  });

  it("does not warn at high contrast (black on white)", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        hasDirectText: true,
        fgColor: black,
        bgColor: white,
      })
    );
    expect(result.find((w) => w.kind === "contrast")).toBeUndefined();
  });

  it("uses relaxed 3:1 threshold for large text", () => {
    // mid gray on white: ~3.95:1 — fails 4.5 but passes 3.0
    const midGray: Rgba = { r: 0x88, g: 0x88, b: 0x88, a: 1 };
    const small = evaluateSoftConstraints(
      buildInput({
        hasDirectText: true,
        fgColor: midGray,
        bgColor: white,
        fontSizePx: 14,
        fontWeight: 400,
      })
    );
    const large = evaluateSoftConstraints(
      buildInput({
        hasDirectText: true,
        fgColor: midGray,
        bgColor: white,
        fontSizePx: 18, // large
        fontWeight: 400,
      })
    );
    expect(small.find((w) => w.kind === "contrast")).toBeDefined();
    expect(large.find((w) => w.kind === "contrast")).toBeUndefined();
  });

  it("composites translucent fg over bg before evaluating", () => {
    // Translucent black over white should resolve to mid-gray, then check
    // contrast on the composed value.
    const halfBlack: Rgba = { r: 0, g: 0, b: 0, a: 0.3 };
    const result = evaluateSoftConstraints(
      buildInput({
        hasDirectText: true,
        fgColor: halfBlack,
        bgColor: white,
        fontSizePx: 12,
        fontWeight: 400,
      })
    );
    // 30% black on white = ~70% white. Low contrast → should warn.
    expect(result.find((w) => w.kind === "contrast")).toBeDefined();
  });

  it("skips when fg or bg is null", () => {
    const result1 = evaluateSoftConstraints(
      buildInput({ hasDirectText: true, fgColor: null, bgColor: white })
    );
    const result2 = evaluateSoftConstraints(
      buildInput({ hasDirectText: true, fgColor: black, bgColor: null })
    );
    expect(result1.find((w) => w.kind === "contrast")).toBeUndefined();
    expect(result2.find((w) => w.kind === "contrast")).toBeUndefined();
  });
});

describe("constraints — evaluateSoftConstraints: overflow", () => {
  it("warns when element extends past parent right edge", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        bounds: { x: 0, y: 0, width: 250, height: 100 }, // wider than parent (200)
        parentBounds: { x: 0, y: 0, width: 200, height: 200 },
      })
    );
    const warn = result.find((w) => w.kind === "overflow");
    expect(warn).toBeDefined();
    expect(warn!.axis).toBe("x");
  });

  it("warns when element extends past parent bottom edge", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        bounds: { x: 0, y: 0, width: 100, height: 250 },
        parentBounds: { x: 0, y: 0, width: 200, height: 200 },
      })
    );
    expect(result.find((w) => w.kind === "overflow")?.axis).toBe("y");
  });

  it("warns 'both' when overflow on both axes", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        bounds: { x: 0, y: 0, width: 250, height: 250 },
        parentBounds: { x: 0, y: 0, width: 200, height: 200 },
      })
    );
    expect(result.find((w) => w.kind === "overflow")?.axis).toBe("both");
  });

  it("does not warn within 1px tolerance", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        bounds: { x: 0, y: 0, width: 200, height: 200 }, // exactly fits
        parentBounds: { x: 0, y: 0, width: 200, height: 200 },
      })
    );
    expect(result.find((w) => w.kind === "overflow")).toBeUndefined();
  });

  it("does not warn when parentBounds is null", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        bounds: { x: 0, y: 0, width: 9999, height: 9999 },
        parentBounds: null,
      })
    );
    expect(result.find((w) => w.kind === "overflow")).toBeUndefined();
  });

  it("warns when element starts before parent left edge", () => {
    const result = evaluateSoftConstraints(
      buildInput({
        bounds: { x: -10, y: 0, width: 100, height: 100 },
        parentBounds: { x: 0, y: 0, width: 200, height: 200 },
      })
    );
    expect(result.find((w) => w.kind === "overflow")?.axis).toBe("x");
  });
});

describe("constraints — evaluateSoftConstraints: ordering + composability", () => {
  it("returns warnings in canonical order", () => {
    // Multiple violations on one element.
    const result = evaluateSoftConstraints(
      buildInput({
        isInteractive: true,
        bounds: { x: 0, y: 0, width: 250, height: 20 }, // overflow x + tiny y
        parentBounds: { x: 0, y: 0, width: 200, height: 200 },
        hasDirectText: true,
        fontSizePx: 8,
        fontWeight: 400,
        fgColor: { r: 220, g: 220, b: 220, a: 1 },
        bgColor: white,
      })
    );
    const kinds = result.map((w) => w.kind);
    // canonical order: touch-target, text-size, aspect, contrast, overflow
    expect(kinds[0]).toBe("touch-target");
    expect(kinds.indexOf("text-size")).toBeLessThan(
      kinds.indexOf("contrast")
    );
    expect(kinds.indexOf("contrast")).toBeLessThan(kinds.indexOf("overflow"));
  });

  it("clean element returns empty array", () => {
    const result = evaluateSoftConstraints(buildInput({}));
    expect(result).toEqual([]);
  });
});
