// Pure-logic detection for the vibe-edit text-typography panel. The
// panel only renders sliders for props the element ALREADY has, so the
// detection runs once per selection and decides which controls to show.

import { describe, it, expect } from "vitest";
import { detectTypographyProps } from "../lib/vibe-edit/typography";

describe("detectTypographyProps", () => {
  it("returns all-false for empty class string", () => {
    const out = detectTypographyProps("");
    expect(out.fontSize).toBe(false);
    expect(out.fontWeight).toBe(false);
    expect(out.lineHeight).toBe(false);
    expect(out.tracking).toBe(false);
    expect(out.textAlign).toBe(false);
  });

  it("detects font-size from text-2xl", () => {
    expect(detectTypographyProps("text-2xl").fontSize).toBe(true);
  });

  it("detects font-size from text-base", () => {
    expect(detectTypographyProps("text-base").fontSize).toBe(true);
  });

  it("rejects text-* color tokens (not size)", () => {
    expect(detectTypographyProps("text-red-500").fontSize).toBe(false);
    expect(detectTypographyProps("text-white").fontSize).toBe(false);
    expect(detectTypographyProps("text-current").fontSize).toBe(false);
  });

  it("does NOT confuse text-align with font-size", () => {
    // text-left / text-center / text-right / text-justify are
    // alignment tokens — they should trip textAlign, not fontSize.
    const out = detectTypographyProps("text-center");
    expect(out.fontSize).toBe(false);
    expect(out.textAlign).toBe(true);
  });

  it("detects font-weight from font-bold", () => {
    expect(detectTypographyProps("font-bold").fontWeight).toBe(true);
  });

  it("detects font-weight from font-extrabold", () => {
    expect(detectTypographyProps("font-extrabold").fontWeight).toBe(true);
  });

  it("rejects font-* family tokens (not weight)", () => {
    // font-sans / font-serif / font-mono are family tokens — Tailwind
    // also ships them; they should NOT show up as font weight.
    expect(detectTypographyProps("font-sans").fontWeight).toBe(false);
    expect(detectTypographyProps("font-serif").fontWeight).toBe(false);
    expect(detectTypographyProps("font-mono").fontWeight).toBe(false);
  });

  it("detects line-height from leading-tight", () => {
    expect(detectTypographyProps("leading-tight").lineHeight).toBe(true);
  });

  it("detects line-height from leading-loose", () => {
    expect(detectTypographyProps("leading-loose").lineHeight).toBe(true);
  });

  it("detects tracking from tracking-wider", () => {
    expect(detectTypographyProps("tracking-wider").tracking).toBe(true);
  });

  it("detects all four text-align values", () => {
    expect(detectTypographyProps("text-left").textAlign).toBe(true);
    expect(detectTypographyProps("text-center").textAlign).toBe(true);
    expect(detectTypographyProps("text-right").textAlign).toBe(true);
    expect(detectTypographyProps("text-justify").textAlign).toBe(true);
  });

  it("returns multiple flags when multiple props present", () => {
    const out = detectTypographyProps(
      "text-2xl font-bold leading-tight tracking-wide text-center",
    );
    expect(out.fontSize).toBe(true);
    expect(out.fontWeight).toBe(true);
    expect(out.lineHeight).toBe(true);
    expect(out.tracking).toBe(true);
    expect(out.textAlign).toBe(true);
  });

  it("ignores breakpoint-prefixed classes (only unprefixed counts)", () => {
    // A class like md:text-2xl shouldn't trip fontSize because the
    // vibe panel operates on the unprefixed cascade only. If the
    // element only has prefixed sizes, the slider won't render.
    const out = detectTypographyProps("md:text-2xl lg:font-bold");
    expect(out.fontSize).toBe(false);
    expect(out.fontWeight).toBe(false);
  });

  it("handles whitespace-tolerant input (multi-space, leading/trailing)", () => {
    const out = detectTypographyProps("  text-xl   font-bold  ");
    expect(out.fontSize).toBe(true);
    expect(out.fontWeight).toBe(true);
  });

  it("works alongside non-typography classes (bg, padding, layout)", () => {
    const out = detectTypographyProps(
      "bg-white p-4 flex items-center text-2xl font-bold",
    );
    expect(out.fontSize).toBe(true);
    expect(out.fontWeight).toBe(true);
    expect(out.lineHeight).toBe(false);
  });

  it("treats arbitrary-value text size as not-detected (panel doesn't expose them)", () => {
    // text-[20px] is arbitrary; the slider scale doesn't include it,
    // so we don't surface a slider that would show "—" perpetually.
    expect(detectTypographyProps("text-[20px]").fontSize).toBe(false);
  });
});
