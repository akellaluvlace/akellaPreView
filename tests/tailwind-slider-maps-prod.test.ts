// 7th prod-import surge — direct-import tests for `lib/tailwind-slider-maps.ts`.
// Bench-omitted module (no `bench-tailwind-slider-maps.mjs`); the slider-
// based inspector's full scale registry + ScaleProp helpers + breakpoint
// helpers + color match/strip/set helpers were entirely uncovered.
//
// Surface tested:
//   §1 scale constants (SPACING, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS,
//      TRACKINGS, RADII, BORDER_WIDTHS, SHADOWS, OPACITIES, DISPLAYS,
//      FLEX_DIRECTIONS, JUSTIFY, ALIGN, WIDTH_PRESETS, HEIGHT_PRESETS)
//   §2 ScaleProp objects' regex match + toClass round-trips
//   §3 spacingProp factory (prefix-{0,px,0.5,1,...,[12px]})
//   §4 breakpointPrefix
//   §5 colorMatch
//   §6 currentIndex / setScale / unsetScale
//   §7 setToken (segmented-control replacement)
//   §8 pickArbitraryHex (extract from bg-[#abc])
//   §9 stripAllBg + setColorClass + unsetColorClass

import { describe, it, expect } from "vitest";
import {
  SPACING,
  FONT_SIZES,
  FONT_SIZE,
  FONT_WEIGHTS,
  FONT_WEIGHT,
  LINE_HEIGHTS,
  LINE_HEIGHT,
  TRACKINGS,
  TRACKING,
  TEXT_ALIGNS,
  TEXT_ALIGN_MATCH,
  textAlignClass,
  RADII,
  RADIUS,
  BORDER_WIDTHS,
  BORDER_WIDTH,
  SHADOWS,
  SHADOW,
  OPACITIES,
  OPACITY,
  DISPLAYS,
  DISPLAY_MATCH,
  FLEX_DIRECTIONS,
  FLEX_DIRECTION_MATCH,
  flexDirectionClass,
  JUSTIFY,
  JUSTIFY_MATCH,
  justifyClass,
  ALIGN,
  ALIGN_MATCH,
  alignClass,
  WIDTH_PRESETS,
  WIDTH_MATCH,
  widthClass,
  HEIGHT_PRESETS,
  HEIGHT_MATCH,
  heightClass,
  spacingProp,
  breakpointPrefix,
  colorMatch,
  currentIndex,
  setScale,
  unsetScale,
  setToken,
  pickArbitraryHex,
  stripAllBg,
  setColorClass,
  unsetColorClass,
} from "../lib/tailwind-slider-maps";

describe("§1 scale constants — content + length canaries", () => {
  it("SPACING starts at '0' and includes 'px' as the second entry", () => {
    expect(SPACING[0]).toBe("0");
    expect(SPACING[1]).toBe("px");
    expect(SPACING).toContain("0.5");
    expect(SPACING).toContain("96");
  });

  it("FONT_SIZES has the 13 Tailwind sizes in order (xs..9xl)", () => {
    expect(FONT_SIZES).toEqual([
      "xs",
      "sm",
      "base",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
      "5xl",
      "6xl",
      "7xl",
      "8xl",
      "9xl",
    ]);
  });

  it("FONT_WEIGHTS has the 9 Tailwind named weights (thin..black)", () => {
    expect(FONT_WEIGHTS).toEqual([
      "thin",
      "extralight",
      "light",
      "normal",
      "medium",
      "semibold",
      "bold",
      "extrabold",
      "black",
    ]);
  });

  it("LINE_HEIGHTS has 6 named line-heights", () => {
    expect(LINE_HEIGHTS.length).toBe(6);
  });

  it("TRACKINGS has 6 named tracking values", () => {
    expect(TRACKINGS).toEqual([
      "tighter",
      "tight",
      "normal",
      "wide",
      "wider",
      "widest",
    ]);
  });

  it("TEXT_ALIGNS has 4 entries (left/center/right/justify)", () => {
    expect(TEXT_ALIGNS).toEqual(["left", "center", "right", "justify"]);
  });

  it("RADII has the '' placeholder in slot 2 ('rounded' shorthand)", () => {
    expect(RADII[2]).toBe("");
    expect(RADII[0]).toBe("none");
    expect(RADII[RADII.length - 1]).toBe("full");
  });

  it("BORDER_WIDTHS has '' placeholder ('border' shorthand) at slot 1", () => {
    expect(BORDER_WIDTHS).toEqual(["0", "", "2", "4", "8"]);
  });

  it("SHADOWS has '' placeholder ('shadow' shorthand) at slot 2", () => {
    expect(SHADOWS[2]).toBe("");
    expect(SHADOWS[0]).toBe("none");
    expect(SHADOWS).toContain("inner");
  });

  it("OPACITIES contains 15 commonly-used values (no granular 1/2/3/...)", () => {
    expect(OPACITIES.length).toBe(15);
    expect(OPACITIES[0]).toBe("0");
    expect(OPACITIES[OPACITIES.length - 1]).toBe("100");
  });

  it("DISPLAYS includes the 8 main display values", () => {
    expect(DISPLAYS).toEqual([
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      "hidden",
    ]);
  });

  it("FLEX_DIRECTIONS / JUSTIFY / ALIGN have the expected named values", () => {
    expect(FLEX_DIRECTIONS).toEqual([
      "row",
      "row-reverse",
      "col",
      "col-reverse",
    ]);
    expect(JUSTIFY).toEqual([
      "start",
      "center",
      "end",
      "between",
      "around",
      "evenly",
    ]);
    expect(ALIGN).toEqual(["start", "center", "end", "baseline", "stretch"]);
  });

  it("WIDTH_PRESETS / HEIGHT_PRESETS share the same 9-entry shape", () => {
    expect(WIDTH_PRESETS.length).toBe(9);
    expect(HEIGHT_PRESETS.length).toBe(9);
    expect(WIDTH_PRESETS[0]).toBe("auto");
    expect(HEIGHT_PRESETS[0]).toBe("auto");
  });
});

describe("§2 ScaleProp regex match + toClass round-trips", () => {
  it("FONT_SIZE matches 'text-xs' / 'text-9xl'; rejects 'text-md'", () => {
    expect(FONT_SIZE.match.test("text-xs")).toBe(true);
    expect(FONT_SIZE.match.test("text-9xl")).toBe(true);
    expect(FONT_SIZE.match.test("text-md")).toBe(false);
    expect(FONT_SIZE.toClass("base")).toBe("text-base");
  });

  it("FONT_WEIGHT matches 'font-thin'..'font-black'", () => {
    for (const w of FONT_WEIGHTS) {
      expect(FONT_WEIGHT.match.test(`font-${w}`)).toBe(true);
      expect(FONT_WEIGHT.toClass(w)).toBe(`font-${w}`);
    }
    expect(FONT_WEIGHT.match.test("font-700")).toBe(false);
  });

  it("LINE_HEIGHT match accepts 'leading-loose' AND numeric 'leading-6' / 'leading-1.5'", () => {
    expect(LINE_HEIGHT.match.test("leading-loose")).toBe(true);
    expect(LINE_HEIGHT.match.test("leading-6")).toBe(true);
    expect(LINE_HEIGHT.match.test("leading-1.5")).toBe(true);
    expect(LINE_HEIGHT.match.test("leading-bogus")).toBe(false);
  });

  it("TRACKING match accepts 6 named values, rejects unknown", () => {
    for (const t of TRACKINGS) {
      expect(TRACKING.match.test(`tracking-${t}`)).toBe(true);
    }
    expect(TRACKING.match.test("tracking-loose")).toBe(false);
  });

  it("RADIUS — '' value emits 'rounded' (shorthand), other values emit 'rounded-X'", () => {
    expect(RADIUS.toClass("")).toBe("rounded");
    expect(RADIUS.toClass("md")).toBe("rounded-md");
    expect(RADIUS.match.test("rounded")).toBe(true);
    expect(RADIUS.match.test("rounded-md")).toBe(true);
    expect(RADIUS.match.test("rounded-extra")).toBe(false);
  });

  it("BORDER_WIDTH — '' value emits 'border' (shorthand)", () => {
    expect(BORDER_WIDTH.toClass("")).toBe("border");
    expect(BORDER_WIDTH.toClass("4")).toBe("border-4");
    expect(BORDER_WIDTH.match.test("border")).toBe(true);
    expect(BORDER_WIDTH.match.test("border-4")).toBe(true);
    expect(BORDER_WIDTH.match.test("border-3")).toBe(false);
  });

  it("SHADOW — '' value emits 'shadow' (shorthand)", () => {
    expect(SHADOW.toClass("")).toBe("shadow");
    expect(SHADOW.toClass("lg")).toBe("shadow-lg");
    expect(SHADOW.match.test("shadow-inner")).toBe(true);
    expect(SHADOW.match.test("shadow-3xl")).toBe(false);
  });

  it("OPACITY matches all 14 valid steps", () => {
    expect(OPACITY.match.test("opacity-0")).toBe(true);
    expect(OPACITY.match.test("opacity-100")).toBe(true);
    expect(OPACITY.match.test("opacity-50")).toBe(true);
    expect(OPACITY.match.test("opacity-15")).toBe(true);
    expect(OPACITY.match.test("opacity-99")).toBe(false);
  });

  it("TEXT_ALIGN_MATCH + textAlignClass round-trip", () => {
    expect(TEXT_ALIGN_MATCH.test("text-center")).toBe(true);
    expect(TEXT_ALIGN_MATCH.test("text-bogus")).toBe(false);
    expect(textAlignClass("center")).toBe("text-center");
  });

  it("DISPLAY_MATCH + flex/justify/align matchers + class builders", () => {
    expect(DISPLAY_MATCH.test("flex")).toBe(true);
    expect(DISPLAY_MATCH.test("inline-block")).toBe(true);
    expect(DISPLAY_MATCH.test("table")).toBe(false);
    expect(FLEX_DIRECTION_MATCH.test("flex-row")).toBe(true);
    expect(flexDirectionClass("col")).toBe("flex-col");
    expect(JUSTIFY_MATCH.test("justify-between")).toBe(true);
    expect(justifyClass("center")).toBe("justify-center");
    expect(ALIGN_MATCH.test("items-baseline")).toBe(true);
    expect(alignClass("stretch")).toBe("items-stretch");
  });

  it("WIDTH_MATCH / HEIGHT_MATCH accept fractions, full, fit, screen, arbitrary", () => {
    expect(WIDTH_MATCH.test("w-full")).toBe(true);
    expect(WIDTH_MATCH.test("w-1/2")).toBe(true);
    expect(WIDTH_MATCH.test("w-[200px]")).toBe(true);
    expect(WIDTH_MATCH.test("w-screen")).toBe(true);
    expect(HEIGHT_MATCH.test("h-fit")).toBe(true);
    expect(HEIGHT_MATCH.test("h-100vh")).toBe(false);
    expect(widthClass("1/2")).toBe("w-1/2");
    expect(heightClass("auto")).toBe("h-auto");
  });
});

describe("§3 spacingProp factory", () => {
  it("matches plain number, px, fraction, and arbitrary value", () => {
    const p = spacingProp("p");
    expect(p.match.test("p-0")).toBe(true);
    expect(p.match.test("p-px")).toBe(true);
    expect(p.match.test("p-0.5")).toBe(true);
    expect(p.match.test("p-12")).toBe(true);
    expect(p.match.test("p-[12px]")).toBe(true);
    expect(p.match.test("p-[12.5rem]")).toBe(true);
  });

  it("rejects classes that don't match the prefix exactly", () => {
    const p = spacingProp("p");
    expect(p.match.test("px-2")).toBe(false);
    expect(p.match.test("padding-2")).toBe(false);
    expect(p.match.test("m-2")).toBe(false);
  });

  it("escapes regex-special chars in the prefix", () => {
    // Negative-margin prefix uses literal '-m'
    const p = spacingProp("-m");
    expect(p.match.test("-m-2")).toBe(true);
    expect(p.match.test("-m-[3rem]")).toBe(true);
    expect(p.match.test("m-2")).toBe(false);
  });

  it("toClass concatenates prefix + value", () => {
    expect(spacingProp("p").toClass("4")).toBe("p-4");
    expect(spacingProp("mx").toClass("auto")).toBe("mx-auto");
  });

  it("uses the shared SPACING scale", () => {
    expect(spacingProp("p").scale).toBe(SPACING);
  });
});

describe("§4 breakpointPrefix", () => {
  it("'mobile' → 'sm:'", () => {
    expect(breakpointPrefix("mobile")).toBe("sm:");
  });

  it("'tablet' → 'md:'", () => {
    expect(breakpointPrefix("tablet")).toBe("md:");
  });

  it("'desktop' → '' (Tailwind base cascade)", () => {
    expect(breakpointPrefix("desktop")).toBe("");
  });
});

describe("§5 colorMatch", () => {
  it("matches palette colors at every shade (50..950)", () => {
    const re = colorMatch("bg");
    expect(re.test("bg-red-500")).toBe(true);
    expect(re.test("bg-slate-50")).toBe(true);
    expect(re.test("bg-rose-950")).toBe(true);
  });

  it("matches keyword colors transparent / current / black / white", () => {
    const re = colorMatch("text");
    expect(re.test("text-transparent")).toBe(true);
    expect(re.test("text-current")).toBe(true);
    expect(re.test("text-black")).toBe(true);
    expect(re.test("text-white")).toBe(true);
  });

  it("matches arbitrary-hex form (bg-[#abc])", () => {
    const re = colorMatch("bg");
    expect(re.test("bg-[#abc]")).toBe(true);
    expect(re.test("bg-[#abcdef]")).toBe(true);
    expect(re.test("bg-[#abcdef80]")).toBe(true);
  });

  it("rejects unknown family / unknown shade / wrong prefix", () => {
    const re = colorMatch("bg");
    expect(re.test("bg-coral-500")).toBe(false);
    expect(re.test("bg-red-1000")).toBe(false);
    expect(re.test("text-red-500")).toBe(false);
  });

  it("with bp prefix, matches only prefixed variants", () => {
    const re = colorMatch("bg", "sm:");
    expect(re.test("sm:bg-red-500")).toBe(true);
    expect(re.test("bg-red-500")).toBe(false);
  });
});

describe("§6 currentIndex / setScale / unsetScale", () => {
  it("currentIndex returns the matched scale index", () => {
    expect(currentIndex(["text-base", "p-4"], FONT_SIZE)).toBe(2);
  });

  it("currentIndex returns -1 when no class matches", () => {
    expect(currentIndex(["p-4", "rounded-md"], FONT_SIZE)).toBe(-1);
  });

  it("currentIndex with bp checks prefixed variant first, falls back to unprefixed", () => {
    // Prefer prefixed
    expect(
      currentIndex(["text-xs", "sm:text-lg"], FONT_SIZE, "sm:"),
    ).toBe(3); // lg = idx 3
    // Fallback when no prefixed present
    expect(currentIndex(["text-xs"], FONT_SIZE, "sm:")).toBe(0);
  });

  it("setScale appends the new class and removes the old", () => {
    const r = setScale(["text-base", "p-4"], FONT_SIZE, 4); // idx 4 = xl
    expect(r).not.toContain("text-base");
    expect(r).toContain("text-xl");
    expect(r).toContain("p-4");
  });

  it("setScale with idx out-of-range unsets (no add)", () => {
    const r = setScale(["text-base", "p-4"], FONT_SIZE, 99);
    expect(r).not.toContain("text-base");
    expect(r).toContain("p-4");
  });

  it("setScale with bp suppresses redundant prefix when value already cascades", () => {
    // Unprefixed text-xl already there; sm:text-xl would be redundant.
    const r = setScale(["text-xl", "p-4"], FONT_SIZE, 4, "sm:");
    expect(r).toContain("text-xl");
    expect(r).not.toContain("sm:text-xl");
  });

  it("unsetScale removes ALL matching classes (no-op if none)", () => {
    expect(unsetScale(["text-base", "p-4"], FONT_SIZE)).toEqual(["p-4"]);
    expect(unsetScale(["p-4"], FONT_SIZE)).toEqual(["p-4"]);
  });

  it("unsetScale with bp leaves unprefixed cascade alone", () => {
    expect(
      unsetScale(["text-xs", "sm:text-lg"], FONT_SIZE, "sm:"),
    ).toEqual(["text-xs"]);
  });
});

describe("§7 setToken — segmented-control replacement", () => {
  it("replaces all classes matching the regex with the new class", () => {
    const r = setToken(
      ["justify-start", "p-4"],
      JUSTIFY_MATCH,
      "justify-center",
    );
    expect(r).not.toContain("justify-start");
    expect(r).toContain("justify-center");
    expect(r).toContain("p-4");
  });

  it("removes matching classes when newClass is null (unset path)", () => {
    const r = setToken(
      ["justify-start", "p-4"],
      JUSTIFY_MATCH,
      null,
    );
    expect(r).toEqual(["p-4"]);
  });

  it("with bp, prepends prefix when adding the new class", () => {
    const r = setToken([], JUSTIFY_MATCH, "justify-end", "sm:");
    expect(r).toContain("sm:justify-end");
  });

  it("with bp, suppresses redundant write when unprefixed already encodes value", () => {
    const r = setToken(
      ["justify-end"],
      JUSTIFY_MATCH,
      "justify-end",
      "sm:",
    );
    expect(r).toEqual(["justify-end"]); // no sm: variant added
  });
});

describe("§8 pickArbitraryHex", () => {
  it("returns hex from bg-[#abc] (3-digit)", () => {
    expect(pickArbitraryHex(["bg-[#abc]"], "bg")).toBe("#abc");
  });

  it("returns hex from bg-[#abcdef] (6-digit)", () => {
    expect(pickArbitraryHex(["bg-[#abcdef]"], "bg")).toBe("#abcdef");
  });

  it("returns null when only palette classes present", () => {
    expect(pickArbitraryHex(["bg-red-500"], "bg")).toBeNull();
  });

  it("returns null when no class matches the prefix", () => {
    expect(pickArbitraryHex(["text-[#abc]"], "bg")).toBeNull();
  });

  it("with bp, prefers prefixed match first", () => {
    expect(
      pickArbitraryHex(
        ["bg-[#aaa]", "sm:bg-[#bbb]"],
        "bg",
        "sm:",
      ),
    ).toBe("#bbb");
  });

  it("with bp, falls back to unprefixed when no prefixed match", () => {
    expect(
      pickArbitraryHex(["bg-[#aaa]"], "bg", "sm:"),
    ).toBe("#aaa");
  });
});

describe("§9 stripAllBg + setColorClass + unsetColorClass", () => {
  it("stripAllBg removes bg-* / from-* / via-* / to-* classes", () => {
    const r = stripAllBg([
      "bg-red-500",
      "bg-[length:8px_8px]",
      "from-[#abc]",
      "via-sky-500",
      "to-[#fff]",
      "p-4",
    ]);
    expect(r).toEqual(["p-4"]);
  });

  it("stripAllBg PRESERVES bg-blend-* / bg-clip-* / bg-origin-*", () => {
    const r = stripAllBg([
      "bg-red-500",
      "bg-blend-multiply",
      "bg-clip-content",
      "bg-origin-border",
    ]);
    expect(r).toEqual([
      "bg-blend-multiply",
      "bg-clip-content",
      "bg-origin-border",
    ]);
  });

  it("setColorClass strips old + appends new arbitrary-hex", () => {
    const r = setColorClass(["bg-red-500", "p-4"], "bg", "#0F0F0F");
    expect(r).not.toContain("bg-red-500");
    expect(r).toContain("bg-[#0F0F0F]");
    expect(r).toContain("p-4");
  });

  it("setColorClass with bp prepends prefix on new class", () => {
    const r = setColorClass(["bg-red-500"], "bg", "#000", "sm:");
    expect(r).toContain("sm:bg-[#000]");
  });

  it("setColorClass for non-bg prefix (text/border/ring) uses palette colorMatch", () => {
    const r = setColorClass(["text-red-500", "p-4"], "text", "#FFF");
    expect(r).not.toContain("text-red-500");
    expect(r).toContain("text-[#FFF]");
  });

  it("unsetColorClass strips colors at the prefix without touching others", () => {
    const r = unsetColorClass(["bg-red-500", "text-blue-500", "p-4"], "bg");
    expect(r).not.toContain("bg-red-500");
    expect(r).toContain("text-blue-500");
    expect(r).toContain("p-4");
  });
});
