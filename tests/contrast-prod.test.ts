import { describe, it, expect } from "vitest";
import {
  parseHexFlexible,
  relativeLuminance,
  contrastRatio,
  wcagBucket,
  wcagSummary,
} from "../lib/contrast";

// Prod-import test for lib/contrast.ts. Counterweight to the bench
// inline-mirror anti-pattern (scripts/bench-contrast.mjs inlines its
// own copies of parseHexFlexible/relativeLuminance/contrastRatio/
// wcagBucket). The bench notably omits `wcagSummary` entirely — for
// that export this suite is the only signal.

describe("lib/contrast — parseHexFlexible (3-digit)", () => {
  it("expands 3-digit hex per CSS rule (each char doubled)", () => {
    expect(parseHexFlexible("#abc")).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc });
    expect(parseHexFlexible("#000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHexFlexible("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("accepts hex with or without leading '#'", () => {
    expect(parseHexFlexible("abc")).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc });
    expect(parseHexFlexible("#abc")).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc });
  });

  it("is case-insensitive", () => {
    expect(parseHexFlexible("ABC")).toEqual(parseHexFlexible("abc"));
    expect(parseHexFlexible("#FFF")).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe("lib/contrast — parseHexFlexible (6-digit)", () => {
  it("parses pairs as r/g/b bytes", () => {
    expect(parseHexFlexible("#123456")).toEqual({ r: 0x12, g: 0x34, b: 0x56 });
    expect(parseHexFlexible("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHexFlexible("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseHexFlexible("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("matches the 3-digit short form when expanded", () => {
    expect(parseHexFlexible("#abc")).toEqual(parseHexFlexible("#aabbcc"));
  });
});

describe("lib/contrast — parseHexFlexible (8-digit alpha)", () => {
  it("composites over white at fully-opaque alpha (no-op)", () => {
    expect(parseHexFlexible("#000000ff")).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHexFlexible("#123456ff")).toEqual({ r: 0x12, g: 0x34, b: 0x56 });
  });

  it("composites over white at zero alpha (fully transparent → white)", () => {
    expect(parseHexFlexible("#00000000")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHexFlexible("#ff000000")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("blends mid-alpha towards white", () => {
    // 50% black over white → mid-gray ≈ {128, 128, 128}.
    // alpha = 0x80 = 128/255 ≈ 0.5019607843...
    // r = round(0 * 0.5019... + 255 * 0.4980...) = round(127.0) = 127
    const got = parseHexFlexible("#00000080");
    expect(got).not.toBeNull();
    expect(got!.r).toBeGreaterThanOrEqual(126);
    expect(got!.r).toBeLessThanOrEqual(128);
    expect(got!.g).toBe(got!.r);
    expect(got!.b).toBe(got!.r);
  });

  it("blends towards source at high alpha", () => {
    // 80% red over white at alpha 0xCC ≈ 0.8.
    const got = parseHexFlexible("#ff0000cc");
    expect(got).not.toBeNull();
    // r = round(255 * 0.8 + 255 * 0.2) = 255 (red channel maxes out)
    expect(got!.r).toBe(255);
    // g = round(0 * 0.8 + 255 * 0.2) ≈ 51
    expect(got!.g).toBeGreaterThanOrEqual(50);
    expect(got!.g).toBeLessThanOrEqual(52);
    expect(got!.b).toBe(got!.g);
  });
});

describe("lib/contrast — parseHexFlexible (rejects invalid)", () => {
  it("returns null for empty string", () => {
    expect(parseHexFlexible("")).toBeNull();
  });

  it("returns null for non-hex characters", () => {
    expect(parseHexFlexible("#xyz")).toBeNull();
    expect(parseHexFlexible("#12345g")).toBeNull();
    expect(parseHexFlexible("hello")).toBeNull();
  });

  it("returns null for invalid lengths (1, 2, 4, 5, 7)", () => {
    expect(parseHexFlexible("#a")).toBeNull();
    expect(parseHexFlexible("#ab")).toBeNull();
    expect(parseHexFlexible("#abcd")).toBeNull();
    expect(parseHexFlexible("#abcde")).toBeNull();
    expect(parseHexFlexible("#1234567")).toBeNull();
  });

  it("returns null for stripped invalid lengths without #", () => {
    expect(parseHexFlexible("a")).toBeNull();
    expect(parseHexFlexible("ab")).toBeNull();
    expect(parseHexFlexible("1234567")).toBeNull();
  });
});

describe("lib/contrast — relativeLuminance", () => {
  it("returns 0 for pure black", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
  });

  it("returns 1 for pure white", () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 9);
  });

  it("weights green channel highest per WCAG sRGB coefficients", () => {
    // 0.2126R + 0.7152G + 0.0722B — pure green should outweigh pure red and blue.
    const red = relativeLuminance({ r: 255, g: 0, b: 0 });
    const green = relativeLuminance({ r: 0, g: 255, b: 0 });
    const blue = relativeLuminance({ r: 0, g: 0, b: 255 });
    expect(green).toBeGreaterThan(red);
    expect(red).toBeGreaterThan(blue);
    expect(red).toBeCloseTo(0.2126, 4);
    expect(green).toBeCloseTo(0.7152, 4);
    expect(blue).toBeCloseTo(0.0722, 4);
  });

  it("matches WCAG-published mid-gray luminance ~0.21586 for #808080", () => {
    expect(relativeLuminance({ r: 0x80, g: 0x80, b: 0x80 })).toBeCloseTo(
      0.21586,
      3,
    );
  });

  it("monotonically increases with channel value (low-end linear branch)", () => {
    // Below the 0.03928 sRGB knee, luminance is linear in input.
    const a = relativeLuminance({ r: 1, g: 1, b: 1 });
    const b = relativeLuminance({ r: 5, g: 5, b: 5 });
    expect(b).toBeGreaterThan(a);
  });
});

describe("lib/contrast — contrastRatio", () => {
  it("returns max ratio (21:1) for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("returns 1:1 for identical colors", () => {
    expect(contrastRatio("#000000", "#000000")).toBe(1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
    expect(contrastRatio("#777777", "#777777")).toBe(1);
  });

  it("is symmetric in fg/bg argument order", () => {
    const a = contrastRatio("#123456", "#abcdef");
    const b = contrastRatio("#abcdef", "#123456");
    expect(a).toBeCloseTo(b!, 9);
  });

  it("returns null when either input is invalid", () => {
    expect(contrastRatio("#xyz", "#ffffff")).toBeNull();
    expect(contrastRatio("#000000", "#zzz")).toBeNull();
    expect(contrastRatio("", "#ffffff")).toBeNull();
    expect(contrastRatio("#000000", "")).toBeNull();
  });

  it("uses (lighter + 0.05) / (darker + 0.05) per WCAG formula", () => {
    // Black L=0, White L=1 → (1 + 0.05) / (0 + 0.05) = 21.
    const r = contrastRatio("#000000", "#ffffff")!;
    expect(r).toBeCloseTo(1.05 / 0.05, 9);
  });

  it("works through 3-digit shorthand", () => {
    const r6 = contrastRatio("#000000", "#ffffff");
    const r3 = contrastRatio("#000", "#fff");
    expect(r6).toBeCloseTo(r3!, 9);
  });

  it("composites alpha foreground over white before computing", () => {
    // 50%-transparent black over white ≈ mid-gray. Ratio against white
    // should be far less than 21 — close to a mid-gray-on-white value.
    const opaque = contrastRatio("#000000", "#ffffff")!;
    const half = contrastRatio("#00000080", "#ffffff")!;
    expect(half).toBeLessThan(opaque);
    expect(half).toBeGreaterThan(1);
    // Should approximately match #808080 on #ffffff. The composite
    // rounds to {127,127,127}, one byte darker than 0x80 mid-gray, so
    // a small offset is expected. ~0.06 ratio units is within the
    // rounding error, well below the AA Large vs AA tier boundary.
    const gray = contrastRatio("#808080", "#ffffff")!;
    expect(Math.abs(half - gray)).toBeLessThan(0.1);
  });
});

describe("lib/contrast — wcagBucket", () => {
  it("returns 'AAA' at and above ratio 7", () => {
    expect(wcagBucket(7)).toBe("AAA");
    expect(wcagBucket(7.01)).toBe("AAA");
    expect(wcagBucket(21)).toBe("AAA");
    expect(wcagBucket(100)).toBe("AAA");
  });

  it("returns 'AA' on [4.5, 7)", () => {
    expect(wcagBucket(4.5)).toBe("AA");
    expect(wcagBucket(5)).toBe("AA");
    expect(wcagBucket(6.99)).toBe("AA");
  });

  it("returns 'AA Large' on [3, 4.5)", () => {
    expect(wcagBucket(3)).toBe("AA Large");
    expect(wcagBucket(3.5)).toBe("AA Large");
    expect(wcagBucket(4.49)).toBe("AA Large");
  });

  it("returns 'Fail' below 3", () => {
    expect(wcagBucket(2.99)).toBe("Fail");
    expect(wcagBucket(1)).toBe("Fail");
    expect(wcagBucket(0)).toBe("Fail");
  });

  it("uses inclusive lower bounds (>=) at every tier boundary", () => {
    // The boundary cases from the AAA/AA/AA Large groups confirm `>=`
    // semantics — locking the contract one more time so a future ` > `
    // refactor flags here.
    expect(wcagBucket(7)).toBe("AAA");
    expect(wcagBucket(4.5)).toBe("AA");
    expect(wcagBucket(3)).toBe("AA Large");
  });
});

describe("lib/contrast — wcagSummary (only signal in suite)", () => {
  it("returns null when input is invalid", () => {
    expect(wcagSummary("#xyz", "#ffffff")).toBeNull();
    expect(wcagSummary("", "")).toBeNull();
  });

  it("returns ratio + tier + label for black on white", () => {
    const got = wcagSummary("#000000", "#ffffff");
    expect(got).not.toBeNull();
    expect(got!.ratio).toBeCloseTo(21, 5);
    expect(got!.tier).toBe("AAA");
    expect(got!.label).toBe("AAA · 21.00:1");
  });

  it("rounds the label ratio to 2 decimal places", () => {
    // Pick a pair that yields a non-round ratio. #767676 on #ffffff
    // is a known WCAG boundary case ≈ 4.54:1.
    const got = wcagSummary("#767676", "#ffffff");
    expect(got).not.toBeNull();
    // Label must contain exactly one period followed by 2 digits
    // before the ":1" suffix.
    expect(got!.label).toMatch(/^\S.* · \d+\.\d{2}:1$/);
  });

  it("composes tier · ratio in the label format ('TIER · X.XX:1')", () => {
    // Smoke the canonical separator + suffix shape.
    const got = wcagSummary("#000000", "#ffffff")!;
    expect(got.label).toContain(" · ");
    expect(got.label).toContain(":1");
    expect(got.label.startsWith(got.tier)).toBe(true);
  });

  it("returns 'AA Large' tier for boundary ratio ≥3 <4.5", () => {
    // #949494 on #ffffff is around 3.04:1.
    const got = wcagSummary("#949494", "#ffffff");
    expect(got).not.toBeNull();
    expect(got!.tier).toBe("AA Large");
    expect(got!.ratio).toBeGreaterThanOrEqual(3);
    expect(got!.ratio).toBeLessThan(4.5);
  });

  it("returns 'Fail' tier when contrast is too low", () => {
    // Light gray on white — should fail every threshold.
    const got = wcagSummary("#dddddd", "#ffffff");
    expect(got).not.toBeNull();
    expect(got!.tier).toBe("Fail");
    expect(got!.ratio).toBeLessThan(3);
  });

  it("matches contrastRatio + wcagBucket when both succeed", () => {
    // Cross-check: wcagSummary should equal the composition of the
    // primitives. If the body refactors to bypass them, this catches it.
    const fg = "#3366cc";
    const bg = "#ffffff";
    const direct = contrastRatio(fg, bg)!;
    const tier = wcagBucket(direct);
    const summary = wcagSummary(fg, bg);
    expect(summary).not.toBeNull();
    expect(summary!.ratio).toBe(direct);
    expect(summary!.tier).toBe(tier);
  });
});
