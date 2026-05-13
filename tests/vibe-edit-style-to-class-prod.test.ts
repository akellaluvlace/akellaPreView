// Pure-logic tests for the JSX style-persistence translator. The
// vibe-edit flow's idle commit feeds this helper a delta of changed
// inline-style props (color / bg / radius) plus the element's current
// classes; the helper returns a new class string with conflicting
// Tailwind classes stripped and arbitrary-value classes added. JSX
// mode then writes the new className via patchJsxClassByOid so the
// edit survives a reload (React rejects string-valued style props,
// hence the workaround).

import { describe, it, expect } from "vitest";
import { mergeStyleDeltaIntoClasses } from "../lib/vibe-edit/style-to-class";

describe("mergeStyleDeltaIntoClasses — color", () => {
  it("translates rgb(255, 0, 0) to text-[#ff0000]", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "rgb(255, 0, 0)" },
      "font-bold",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-[#ff0000]");
    expect(out.classes).toContain("font-bold");
  });

  it("accepts hex color directly", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#ABC123" },
      "p-4",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-[#abc123]");
  });

  it("strips existing palette text colors before adding arbitrary", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "rgb(0, 255, 0)" },
      "text-red-500 font-bold",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("text-red-500");
    expect(out.classes).toContain("text-[#00ff00]");
    expect(out.classes).toContain("font-bold");
  });

  it("strips existing arbitrary text colors before adding new arbitrary", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "rgb(0, 0, 255)" },
      "text-[#ff0000] p-4",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("text-[#ff0000]");
    expect(out.classes).toContain("text-[#0000ff]");
  });

  it("strips current/transparent/named text colors", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "rgb(128, 128, 128)" },
      "text-current text-transparent text-black text-white",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toMatch(/text-current/);
    expect(out.classes).not.toMatch(/text-transparent/);
    expect(out.classes).not.toMatch(/text-black/);
    expect(out.classes).not.toMatch(/text-white/);
    expect(out.classes).toContain("text-[#808080]");
  });

  it("preserves text-{size} and text-{align} classes", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#000000" },
      "text-2xl text-center text-pretty",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-2xl");
    expect(out.classes).toContain("text-center");
    expect(out.classes).toContain("text-[#000000]");
  });

  it("transparent → strips text colors, adds nothing", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "transparent" },
      "text-red-500 font-bold",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("text-red-500");
    expect(out.classes).not.toMatch(/text-\[/);
    expect(out.classes).toContain("font-bold");
  });

  it("rgba(0,0,0,0) → strips text colors, adds nothing", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "rgba(0, 0, 0, 0)" },
      "text-red-500",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("text-red-500");
    expect(out.classes).not.toMatch(/text-\[/);
  });

  it("empty string for color is a no-op (no strip, no add)", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "" },
      "text-red-500",
    );
    expect(out.changed).toBe(false);
    expect(out.classes).toBe("text-red-500");
  });
});

describe("mergeStyleDeltaIntoClasses — backgroundColor", () => {
  it("translates rgb to bg-[#hex]", () => {
    const out = mergeStyleDeltaIntoClasses(
      { backgroundColor: "rgb(255, 255, 255)" },
      "p-4",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("bg-[#ffffff]");
  });

  it("strips existing palette bg colors", () => {
    const out = mergeStyleDeltaIntoClasses(
      { backgroundColor: "rgb(255, 255, 255)" },
      "bg-red-500 p-4",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("bg-red-500");
    expect(out.classes).toContain("bg-[#ffffff]");
  });

  it("preserves bg-cover / bg-contain / bg-no-repeat (not color)", () => {
    const out = mergeStyleDeltaIntoClasses(
      { backgroundColor: "#ff00ff" },
      "bg-cover bg-no-repeat bg-center",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("bg-cover");
    expect(out.classes).toContain("bg-no-repeat");
    expect(out.classes).toContain("bg-center");
    expect(out.classes).toContain("bg-[#ff00ff]");
  });

  it("transparent → strips bg colors, adds nothing", () => {
    const out = mergeStyleDeltaIntoClasses(
      { backgroundColor: "transparent" },
      "bg-red-500 p-4",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("bg-red-500");
    expect(out.classes).not.toMatch(/bg-\[/);
    expect(out.classes).toContain("p-4");
  });
});

describe("mergeStyleDeltaIntoClasses — borderRadius", () => {
  it("translates 12px to rounded-[12px]", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "12px" },
      "bg-white",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("rounded-[12px]");
  });

  it("strips named rounded scale before adding arbitrary", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "20px" },
      "rounded-md p-4",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("rounded-md");
    expect(out.classes).toContain("rounded-[20px]");
  });

  it("strips bare `rounded` before adding arbitrary", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "8px" },
      "rounded shadow-md",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toMatch(/(?:^|\s)rounded(?:$|\s)/);
    expect(out.classes).toContain("rounded-[8px]");
    expect(out.classes).toContain("shadow-md");
  });

  it("strips directional rounded variants (rounded-tl-md etc.)", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "16px" },
      "rounded-tl-md rounded-br-2xl bg-white",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("rounded-tl-md");
    expect(out.classes).not.toContain("rounded-br-2xl");
    expect(out.classes).toContain("rounded-[16px]");
  });

  it("strips existing arbitrary radius before adding new", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "32px" },
      "rounded-[8px] bg-white",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("rounded-[8px]");
    expect(out.classes).toContain("rounded-[32px]");
  });

  it("0px → strips rounded classes, adds nothing", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "0px" },
      "rounded-md p-4",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("rounded-md");
    expect(out.classes).not.toMatch(/rounded-\[/);
  });

  it("rounds fractional pixel values", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "12.5px" },
      "",
    );
    expect(out.changed).toBe(true);
    // Rounded to nearest integer.
    expect(out.classes).toContain("rounded-[13px]");
  });

  it("falls back to no-op for unparseable radius value", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "calc(50% + 4px)" },
      "p-4",
    );
    // Don't strip / don't add — caller can handle the unknown.
    expect(out.changed).toBe(false);
    expect(out.classes).toBe("p-4");
  });
});

describe("mergeStyleDeltaIntoClasses — multi-prop deltas", () => {
  it("applies color + bg + radius in one call", () => {
    const out = mergeStyleDeltaIntoClasses(
      {
        color: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: "16px",
      },
      "text-red-500 bg-blue-500 rounded-md p-8",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-[#000000]");
    expect(out.classes).toContain("bg-[#ffffff]");
    expect(out.classes).toContain("rounded-[16px]");
    expect(out.classes).not.toContain("text-red-500");
    expect(out.classes).not.toContain("bg-blue-500");
    expect(out.classes).not.toContain("rounded-md");
    expect(out.classes).toContain("p-8");
  });

  it("changed=false when delta is empty", () => {
    const out = mergeStyleDeltaIntoClasses({}, "text-red-500 p-4");
    expect(out.changed).toBe(false);
    expect(out.classes).toBe("text-red-500 p-4");
  });

  it("changed=false when delta contains only no-op fields", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "" },
      "text-red-500",
    );
    expect(out.changed).toBe(false);
    expect(out.classes).toBe("text-red-500");
  });

  it("preserves order of unrelated classes", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#000000" },
      "flex items-center justify-between p-4 text-red-500 font-bold",
    );
    // Non-text-color tokens should appear in the same relative order.
    expect(out.classes).toMatch(
      /\bflex\b.*\bitems-center\b.*\bjustify-between\b.*\bp-4\b.*\bfont-bold\b/,
    );
  });

  it("normalizes whitespace in input (multiple spaces)", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#ff0000" },
      "text-red-500   font-bold  ",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toMatch(/\s{2,}/);
    expect(out.classes.startsWith(" ")).toBe(false);
    expect(out.classes.endsWith(" ")).toBe(false);
  });
});

// The vibecoder picker is unprefixed (no breakpoint / state UI in v1).
// When the user picks a new colour we strip ALL variant forms — base,
// responsive, state, and chained — so the new colour holds across every
// viewport and interaction. Without this strip a leftover
// `hover:text-red-500` overrides the user's pick on hover, which reads
// as the editor "ignoring" the colour change.
describe("mergeStyleDeltaIntoClasses — variant-prefixed colours", () => {
  it("strips hover: prefixed text colour when picking new colour", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#0000ff" },
      "text-base hover:text-red-500 font-bold",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("hover:text-red-500");
    expect(out.classes).toContain("text-[#0000ff]");
    expect(out.classes).toContain("text-base");
    expect(out.classes).toContain("font-bold");
  });

  it("strips responsive (md:) prefixed text colours", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#0000ff" },
      "text-red-500 md:text-blue-900 lg:text-green-700",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("md:text-blue-900");
    expect(out.classes).not.toContain("lg:text-green-700");
    expect(out.classes).not.toContain("text-red-500");
    expect(out.classes).toContain("text-[#0000ff]");
  });

  it("strips chained variant prefixes (md:hover:text-red-500)", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#000000" },
      "md:hover:text-red-500 dark:text-white text-gray-700",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("md:hover:text-red-500");
    expect(out.classes).not.toContain("dark:text-white");
    expect(out.classes).not.toContain("text-gray-700");
    expect(out.classes).toContain("text-[#000000]");
  });

  it("strips group-hover (hyphenated) prefix", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#ffffff" },
      "group-hover:text-red-500 text-base",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("group-hover:text-red-500");
    expect(out.classes).toContain("text-[#ffffff]");
  });

  it("strips prefixed bg colours when picking new bg", () => {
    const out = mergeStyleDeltaIntoClasses(
      { backgroundColor: "#ff0000" },
      "bg-white hover:bg-blue-500 md:bg-green-200 dark:bg-zinc-900",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("hover:bg-blue-500");
    expect(out.classes).not.toContain("md:bg-green-200");
    expect(out.classes).not.toContain("dark:bg-zinc-900");
    expect(out.classes).not.toContain("bg-white");
    expect(out.classes).toContain("bg-[#ff0000]");
  });

  it("strips prefixed rounded variants when picking new radius", () => {
    const out = mergeStyleDeltaIntoClasses(
      { borderRadius: "12px" },
      "rounded-md md:rounded-lg hover:rounded-2xl shadow-md",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("md:rounded-lg");
    expect(out.classes).not.toContain("hover:rounded-2xl");
    expect(out.classes).not.toContain("rounded-md");
    expect(out.classes).toContain("rounded-[12px]");
    expect(out.classes).toContain("shadow-md");
  });

  it("preserves non-color classes that share prefix (md:flex)", () => {
    // Sanity: only colour/radius tokens get stripped — layout classes
    // with the same variant prefix should pass through.
    const out = mergeStyleDeltaIntoClasses(
      { color: "#abc123" },
      "md:flex md:text-red-500 hover:underline md:items-center",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("md:flex");
    expect(out.classes).toContain("hover:underline");
    expect(out.classes).toContain("md:items-center");
    expect(out.classes).not.toContain("md:text-red-500");
    expect(out.classes).toContain("text-[#abc123]");
  });

  it("strips opacity-slashed prefixed colours (md:text-red-500/50)", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "#0a0a0a" },
      "md:text-red-500/50 text-blue-800/75 font-medium",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).not.toContain("md:text-red-500/50");
    expect(out.classes).not.toContain("text-blue-800/75");
    expect(out.classes).toContain("text-[#0a0a0a]");
    expect(out.classes).toContain("font-medium");
  });
});

describe("mergeStyleDeltaIntoClasses — opacity slash form (Phase 3 SF-M2)", () => {
  // Pre-Phase-3 the alpha byte was dropped silently: rgba(255,0,0,0.5)
  // → text-[#ff0000] with no opacity indicator. Vibecoders saw their
  // colour land at full opacity in the source even though the picker
  // showed 50%. Tailwind's arbitrary-color-with-opacity form is
  // text-[#hex]/N (or bg-[#hex]/N) where N is the integer percent.

  it("rgba(255, 0, 0, 0.5) produces text-[#ff0000]/50", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "rgba(255, 0, 0, 0.5)" },
      "",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-[#ff0000]/50");
    expect(out.classes).not.toMatch(/text-\[#ff0000\](?!\/)/);
  });

  it("#FFFFFF80 (8-digit hex) produces text-[#ffffff]/50", () => {
    // 0x80 / 0xff = 128/255 ≈ 50.196 → rounds to 50.
    const out = mergeStyleDeltaIntoClasses(
      { color: "#FFFFFF80" },
      "",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-[#ffffff]/50");
  });

  it("#80808040 produces text-[#808080]/25", () => {
    // 0x40 / 0xff = 64/255 ≈ 25.098 → rounds to 25.
    const out = mergeStyleDeltaIntoClasses(
      { color: "#80808040" },
      "",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-[#808080]/25");
  });

  it("rgba(0, 0, 0, 0.75) for background produces bg-[#000000]/75", () => {
    const out = mergeStyleDeltaIntoClasses(
      { backgroundColor: "rgba(0, 0, 0, 0.75)" },
      "",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("bg-[#000000]/75");
  });

  it("rgba(255, 255, 255, 1) at full opacity emits no slash suffix", () => {
    const out = mergeStyleDeltaIntoClasses(
      { color: "rgba(255, 255, 255, 1)" },
      "",
    );
    expect(out.changed).toBe(true);
    expect(out.classes).toContain("text-[#ffffff]");
    expect(out.classes).not.toContain("text-[#ffffff]/");
  });
});
