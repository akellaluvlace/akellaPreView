// 7th prod-import surge — direct-import tests for `lib/patterns.ts`.
// Bench-omitted module (no `bench-patterns.mjs`); the pattern registry +
// Tailwind class builders + hex/alpha helpers + gradient + pattern-class
// parsers were entirely uncovered prior to this surge.
//
// Surface tested:
//   §1 PATTERNS registry + getPattern
//   §2 each pattern's css() builder (canary regex per pattern)
//   §3 tailwindClassesForPattern (image only / +size / +baseColor)
//   §4 tailwindClassesForImage (overlay + fit + position + 9 directions)
//   §5 hexWithAlpha + parseHex8
//   §6 GRADIENT_DIRECTIONS constant
//   §7 tailwindClassesForGradient (alpha=100 inline vs <100 slash form)
//   §8 parseGradientClasses (8-digit hex, palette, /N, bails)
//   §9 parsePatternClasses (round-trip per pattern, custom→null)

import { describe, it, expect } from "vitest";
import {
  PATTERNS,
  getPattern,
  tailwindClassesForPattern,
  tailwindClassesForImage,
  hexWithAlpha,
  parseHex8,
  GRADIENT_DIRECTIONS,
  tailwindClassesForGradient,
  parseGradientClasses,
  parsePatternClasses,
} from "../lib/patterns";

describe("§1 PATTERNS registry + getPattern", () => {
  it("exports exactly 6 patterns", () => {
    expect(PATTERNS.length).toBe(6);
  });

  it("contains the expected ids in registration order", () => {
    expect(PATTERNS.map((p) => p.id)).toEqual([
      "dots",
      "grid",
      "diagonal",
      "horizontal",
      "vertical",
      "cross",
    ]);
  });

  it("ids are globally unique", () => {
    expect(new Set(PATTERNS.map((p) => p.id)).size).toBe(PATTERNS.length);
  });

  it("every pattern has a label and a css function", () => {
    for (const p of PATTERNS) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(typeof p.css).toBe("function");
    }
  });

  it("getPattern returns the matching PatternDef", () => {
    expect(getPattern("dots")?.label).toBe("Dots");
    expect(getPattern("cross")?.label).toBe("Cross");
  });

  it("getPattern returns undefined on miss", () => {
    expect(getPattern("does-not-exist")).toBeUndefined();
    expect(getPattern("")).toBeUndefined();
  });
});

describe("§2 pattern css() builders — canary shape per pattern", () => {
  const opts = { color: "#ff0000", scale: 24 };

  it("dots: radial-gradient circle at 1px 1px", () => {
    const dots = getPattern("dots")!.css(opts);
    expect(dots.image).toBe(
      "radial-gradient(circle at 1px 1px, #ff0000 1px, transparent 0)",
    );
    expect(dots.size).toBe("24px 24px");
  });

  it("grid: two perpendicular linear-gradients (combined image)", () => {
    const grid = getPattern("grid")!.css(opts);
    expect(grid.image).toContain("linear-gradient(#ff0000 1px, transparent 1px)");
    expect(grid.image).toContain(
      "linear-gradient(90deg, #ff0000 1px, transparent 1px)",
    );
    expect(grid.size).toBe("24px 24px");
  });

  it("diagonal: repeating-linear 45deg + size=auto", () => {
    const diag = getPattern("diagonal")!.css(opts);
    expect(diag.image).toBe(
      "repeating-linear-gradient(45deg, #ff0000 0, #ff0000 1px, transparent 1px, transparent 24px)",
    );
    expect(diag.size).toBe("auto");
  });

  it("horizontal: repeating-linear 0deg + size=auto", () => {
    const h = getPattern("horizontal")!.css(opts);
    expect(h.image).toContain("repeating-linear-gradient(0deg");
    expect(h.size).toBe("auto");
  });

  it("vertical: repeating-linear 90deg + size=auto", () => {
    const v = getPattern("vertical")!.css(opts);
    expect(v.image).toContain("repeating-linear-gradient(90deg");
    expect(v.size).toBe("auto");
  });

  it("cross: TWO repeating-linears (45deg + -45deg) joined", () => {
    const c = getPattern("cross")!.css(opts);
    expect(c.image).toContain("repeating-linear-gradient(45deg");
    expect(c.image).toContain("repeating-linear-gradient(-45deg");
    expect(c.size).toBe("auto");
  });
});

describe("§3 tailwindClassesForPattern", () => {
  it("returns just bg-[<image>] for size=auto patterns (diagonal/horizontal/vertical/cross)", () => {
    const diag = getPattern("diagonal")!;
    const classes = tailwindClassesForPattern(diag, {
      color: "#0F0F0F",
      scale: 16,
    });
    // Whitespace stripped → underscores
    expect(classes.length).toBe(1);
    expect(classes[0]).toMatch(/^bg-\[repeating-linear-gradient\(45deg,_/);
    expect(classes[0]).not.toContain(" ");
  });

  it("includes bg-[length:...] for non-auto patterns (dots/grid)", () => {
    const dots = getPattern("dots")!;
    const classes = tailwindClassesForPattern(dots, {
      color: "#0F0F0F",
      scale: 16,
    });
    expect(classes.length).toBe(2);
    expect(classes[0]).toMatch(/^bg-\[radial-gradient/);
    expect(classes[1]).toBe("bg-[length:16px_16px]");
  });

  it("appends bg-[color:base] when baseColor provided", () => {
    const dots = getPattern("dots")!;
    const classes = tailwindClassesForPattern(dots, {
      color: "#0F0F0F",
      scale: 16,
      baseColor: "#FFFFFF",
    });
    expect(classes.length).toBe(3);
    expect(classes[2]).toBe("bg-[color:#FFFFFF]");
  });

  it("strips ALL whitespace from image (Tailwind arbitrary-value contract)", () => {
    // grid uses spaces and commas; the arbitrary-value form should have
    // commas preserved, but every space replaced with _.
    const grid = getPattern("grid")!;
    const classes = tailwindClassesForPattern(grid, {
      color: "#000000",
      scale: 12,
    });
    expect(classes[0]).not.toMatch(/\s/);
  });
});

describe("§4 tailwindClassesForImage — url + fit + position + overlay", () => {
  const baseOpts = {
    url: "https://example.com/x.jpg",
    fit: "cover" as const,
    position: "center" as const,
  };

  it("includes bg-[url(...)] with quoted URL when no overlay", () => {
    const classes = tailwindClassesForImage(baseOpts);
    expect(classes[0]).toContain("bg-[url('https://example.com/x.jpg')]");
  });

  it("layers a linear-gradient overlay before the url when overlayHex8 set", () => {
    const classes = tailwindClassesForImage({
      ...baseOpts,
      overlayHex8: "#000000AA",
    });
    expect(classes[0]).toContain("linear-gradient(#000000AA,#000000AA)");
    expect(classes[0]).toContain("url('https://example.com/x.jpg')");
  });

  it("fit='cover' → bg-cover; fit='contain' → bg-contain; fit='auto' → bg-auto", () => {
    expect(tailwindClassesForImage({ ...baseOpts, fit: "cover" })).toContain(
      "bg-cover",
    );
    expect(tailwindClassesForImage({ ...baseOpts, fit: "contain" })).toContain(
      "bg-contain",
    );
    expect(tailwindClassesForImage({ ...baseOpts, fit: "auto" })).toContain(
      "bg-auto",
    );
  });

  it("always includes bg-no-repeat", () => {
    const classes = tailwindClassesForImage(baseOpts);
    expect(classes).toContain("bg-no-repeat");
  });

  it("position mappings — center/top/right/bottom/left", () => {
    const map = {
      center: "bg-center",
      top: "bg-top",
      right: "bg-right",
      bottom: "bg-bottom",
      left: "bg-left",
    } as const;
    for (const [pos, expected] of Object.entries(map)) {
      const classes = tailwindClassesForImage({
        ...baseOpts,
        position: pos as keyof typeof map,
      });
      expect(classes).toContain(expected);
    }
  });

  it("position mappings — corners (top-left, top-right, bottom-left, bottom-right)", () => {
    const map = {
      "top-left": "bg-left-top",
      "top-right": "bg-right-top",
      "bottom-left": "bg-left-bottom",
      "bottom-right": "bg-right-bottom",
    } as const;
    for (const [pos, expected] of Object.entries(map)) {
      const classes = tailwindClassesForImage({
        ...baseOpts,
        position: pos as keyof typeof map,
      });
      expect(classes).toContain(expected);
    }
  });
});

describe("§5 hexWithAlpha + parseHex8", () => {
  it("hexWithAlpha — 6-digit hex + alpha=1.0 → #RRGGBBFF", () => {
    expect(hexWithAlpha("#0F0F0F", 1.0)).toBe("#0F0F0FFF");
  });

  it("hexWithAlpha — 6-digit hex + alpha=0.5 → #RRGGBB80 (rounded)", () => {
    expect(hexWithAlpha("#0F0F0F", 0.5)).toBe("#0F0F0F80");
  });

  it("hexWithAlpha — 6-digit hex + alpha=0 → #RRGGBB00", () => {
    expect(hexWithAlpha("#0F0F0F", 0)).toBe("#0F0F0F00");
  });

  it("hexWithAlpha — 3-digit hex expanded to 6 (#abc → #aabbcc)", () => {
    expect(hexWithAlpha("#abc", 1.0)).toBe("#aabbccFF");
  });

  it("hexWithAlpha — accepts hex without leading #", () => {
    expect(hexWithAlpha("0F0F0F", 1.0)).toBe("#0F0F0FFF");
  });

  it("hexWithAlpha — clamps alpha to [0, 1]", () => {
    expect(hexWithAlpha("#000000", -0.5)).toBe("#00000000");
    expect(hexWithAlpha("#000000", 2.0)).toBe("#000000FF");
  });

  it("hexWithAlpha — uppercases the alpha byte", () => {
    expect(hexWithAlpha("#000000", 0.5)).toMatch(/[A-F0-9]{2}$/);
    expect(hexWithAlpha("#000000", 0.5)).not.toMatch(/[a-f]{2}$/);
  });

  it("parseHex8 — valid 8-digit returns base + 0..1 alpha", () => {
    const r = parseHex8("#0F0F0F80");
    expect(r).not.toBeNull();
    expect(r!.base).toBe("#0F0F0F");
    expect(r!.alpha).toBeCloseTo(128 / 255, 4);
  });

  it("parseHex8 — case-insensitive on input, uppercase on output", () => {
    const r = parseHex8("#0f0f0fff");
    expect(r!.base).toBe("#0F0F0F");
    expect(r!.alpha).toBe(1);
  });

  it("parseHex8 — alpha=00 → 0", () => {
    expect(parseHex8("#FFFFFF00")!.alpha).toBe(0);
  });

  it("parseHex8 — invalid returns null (6-digit, missing #, wrong length, non-hex)", () => {
    expect(parseHex8("#0F0F0F")).toBeNull();
    expect(parseHex8("0F0F0F80")).toBeNull();
    expect(parseHex8("#0F0F0F80FF")).toBeNull();
    expect(parseHex8("#GGGGGG00")).toBeNull();
    expect(parseHex8("")).toBeNull();
  });
});

describe("§6 GRADIENT_DIRECTIONS constant", () => {
  it("exports all 8 directions in compass order", () => {
    expect(GRADIENT_DIRECTIONS).toEqual([
      "t",
      "tr",
      "r",
      "br",
      "b",
      "bl",
      "l",
      "tl",
    ]);
  });
});

describe("§7 tailwindClassesForGradient", () => {
  it("alpha=100 inline form (no /N suffix)", () => {
    const classes = tailwindClassesForGradient({
      direction: "r",
      fromHex: "#000000",
      fromAlpha: 100,
      toHex: "#FFFFFF",
      toAlpha: 100,
    });
    expect(classes).toEqual([
      "bg-gradient-to-r",
      "from-[#000000]",
      "to-[#FFFFFF]",
    ]);
  });

  it("alpha<100 slash form", () => {
    const classes = tailwindClassesForGradient({
      direction: "br",
      fromHex: "#000000",
      fromAlpha: 50,
      toHex: "#FFFFFF",
      toAlpha: 80,
    });
    expect(classes).toEqual([
      "bg-gradient-to-br",
      "from-[#000000]/50",
      "to-[#FFFFFF]/80",
    ]);
  });

  it("includes via stop when viaHex set", () => {
    const classes = tailwindClassesForGradient({
      direction: "r",
      fromHex: "#000000",
      fromAlpha: 100,
      viaHex: "#777777",
      viaAlpha: 60,
      toHex: "#FFFFFF",
      toAlpha: 100,
    });
    expect(classes).toContain("via-[#777777]/60");
  });

  it("via defaults to alpha=100 when viaAlpha is undefined", () => {
    const classes = tailwindClassesForGradient({
      direction: "r",
      fromHex: "#000000",
      fromAlpha: 100,
      viaHex: "#777777",
      toHex: "#FFFFFF",
      toAlpha: 100,
    });
    expect(classes).toContain("via-[#777777]");
  });

  it("uppercases the hex in the class output", () => {
    const classes = tailwindClassesForGradient({
      direction: "r",
      fromHex: "#abcdef",
      fromAlpha: 100,
      toHex: "#fedcba",
      toAlpha: 100,
    });
    expect(classes).toContain("from-[#ABCDEF]");
    expect(classes).toContain("to-[#FEDCBA]");
  });

  it("rounds the alpha for the slash form", () => {
    const classes = tailwindClassesForGradient({
      direction: "r",
      fromHex: "#000000",
      fromAlpha: 33.7,
      toHex: "#FFFFFF",
      toAlpha: 66.3,
    });
    expect(classes).toContain("from-[#000000]/34");
    expect(classes).toContain("to-[#FFFFFF]/66");
  });
});

describe("§8 parseGradientClasses", () => {
  it("parses 6-digit arbitrary hex stops with no /N → alpha=100", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-r",
      "from-[#000000]",
      "to-[#FFFFFF]",
    ]);
    expect(r).not.toBeNull();
    expect(r!.direction).toBe("r");
    expect(r!.fromHex).toBe("#000000");
    expect(r!.fromAlpha).toBe(100);
    expect(r!.toHex).toBe("#FFFFFF");
    expect(r!.toAlpha).toBe(100);
    expect(r!.viaHex).toBeNull();
  });

  it("parses 8-digit arbitrary hex → split into base + alpha", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-r",
      "from-[#000000FF]",
      "to-[#FFFFFF80]",
    ]);
    expect(r!.fromAlpha).toBe(100);
    // 0x80/255 ≈ 50.196 → rounded to 50
    expect(r!.toAlpha).toBe(50);
  });

  it("parses 3-digit hex (#abc) by expanding to 6 digits", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-r",
      "from-[#abc]",
      "to-[#FFFFFF]",
    ]);
    expect(r!.fromHex).toBe("#AABBCC");
  });

  it("parses palette-named stops (sky-500) via tailwind-palette", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-r",
      "from-sky-500",
      "to-rose-500",
    ]);
    expect(r).not.toBeNull();
    // Tailwind 3.4 sky-500 = #0EA5E9 (locked canary).
    expect(r!.fromHex).toBe("#0EA5E9");
    expect(r!.toHex).toBe("#F43F5E");
  });

  it("explicit /N suffix overrides the 8-digit alpha byte", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-r",
      "from-[#000000FF]/30",
      "to-[#FFFFFF]",
    ]);
    expect(r!.fromAlpha).toBe(30);
  });

  it("via stop populates viaHex + viaAlpha", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-br",
      "from-[#000000]",
      "via-[#777777]/60",
      "to-[#FFFFFF]",
    ]);
    expect(r!.viaHex).toBe("#777777");
    expect(r!.viaAlpha).toBe(60);
  });

  it("returns null when bg-gradient-to-* direction class is absent", () => {
    expect(
      parseGradientClasses(["from-[#000000]", "to-[#FFFFFF]"]),
    ).toBeNull();
  });

  it("returns null when from stop is missing", () => {
    expect(
      parseGradientClasses(["bg-gradient-to-r", "to-[#FFFFFF]"]),
    ).toBeNull();
  });

  it("returns null when to stop is missing", () => {
    expect(
      parseGradientClasses(["bg-gradient-to-r", "from-[#000000]"]),
    ).toBeNull();
  });

  it("clamps /N suffix to [0, 100]", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-r",
      "from-[#000000]/150",
      "to-[#FFFFFF]/0",
    ]);
    expect(r!.fromAlpha).toBe(100);
    expect(r!.toAlpha).toBe(0);
  });

  it("malformed stop classes are ignored (skipped without bailing)", () => {
    const r = parseGradientClasses([
      "bg-gradient-to-r",
      "from-[#000000]",
      "garbage",
      "to-[#FFFFFF]",
    ]);
    expect(r).not.toBeNull();
  });
});

describe("§9 parsePatternClasses — round-trip with tailwindClassesForPattern", () => {
  it("dots round-trip restores patternId, strokeHex, strokeAlpha, scale", () => {
    const pat = getPattern("dots")!;
    const classes = tailwindClassesForPattern(pat, {
      color: "#0F0F0F33",
      scale: 16,
    });
    const r = parsePatternClasses(classes);
    expect(r).not.toBeNull();
    expect(r!.patternId).toBe("dots");
    expect(r!.strokeHex).toBe("#0F0F0F");
    // 0x33 / 255 ≈ 0.2 → rounded to 20
    expect(r!.strokeAlpha).toBe(20);
    expect(r!.scale).toBe(16);
    expect(r!.baseHex).toBeNull();
  });

  it("grid round-trip", () => {
    const pat = getPattern("grid")!;
    const classes = tailwindClassesForPattern(pat, {
      color: "#FF0000",
      scale: 24,
    });
    const r = parsePatternClasses(classes);
    expect(r!.patternId).toBe("grid");
    expect(r!.strokeHex).toBe("#FF0000");
    expect(r!.scale).toBe(24);
  });

  it("diagonal round-trip — scale parsed from inside the gradient (no length class)", () => {
    const pat = getPattern("diagonal")!;
    const classes = tailwindClassesForPattern(pat, {
      color: "#0F0F0F",
      scale: 12,
    });
    const r = parsePatternClasses(classes);
    expect(r!.patternId).toBe("diagonal");
    expect(r!.scale).toBe(12);
  });

  it("horizontal + vertical + cross round-trip", () => {
    for (const id of ["horizontal", "vertical", "cross"] as const) {
      const pat = getPattern(id)!;
      const classes = tailwindClassesForPattern(pat, {
        color: "#0F0F0F",
        scale: 8,
      });
      const r = parsePatternClasses(classes);
      expect(r!.patternId).toBe(id);
      expect(r!.scale).toBe(8);
    }
  });

  it("preserves baseHex when bg-[color:...] class is included", () => {
    const pat = getPattern("dots")!;
    const classes = tailwindClassesForPattern(pat, {
      color: "#0F0F0F",
      scale: 16,
      baseColor: "#ffffff",
    });
    const r = parsePatternClasses(classes);
    expect(r!.baseHex).toBe("#FFFFFF");
  });

  it("returns null when no bg-[<gradient>] class is present", () => {
    expect(parsePatternClasses(["text-red-500", "p-4"])).toBeNull();
  });

  it("returns null on bare bg-[#hex] (color, not gradient)", () => {
    expect(parsePatternClasses(["bg-[#0F0F0F]"])).toBeNull();
  });

  it("returns null on bg-[url(...)] (image, not gradient)", () => {
    expect(
      parsePatternClasses([`bg-[url('https://x.com/y.jpg')]`]),
    ).toBeNull();
  });

  it("returns null on a custom unrecognised gradient", () => {
    expect(
      parsePatternClasses(["bg-[conic-gradient(red,blue)]"]),
    ).toBeNull();
  });

  it("handles a bg-[length:...] with mismatched X/Y by ignoring it (sizeScale stays null)", () => {
    // dots pattern requires sizeScale; if size is "8px_12px" (mismatched
    // X/Y), the parser sets sizeScale only when a===b, so dots won't
    // match → null.
    const pat = getPattern("dots")!;
    const classes = tailwindClassesForPattern(pat, {
      color: "#0F0F0F",
      scale: 16,
    });
    // Replace the length class with a mismatched one.
    const mutated = classes.map((c) =>
      c.startsWith("bg-[length:") ? "bg-[length:8px_12px]" : c,
    );
    expect(parsePatternClasses(mutated)).toBeNull();
  });
});
