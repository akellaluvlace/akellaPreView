// Prod-import tests for the icon-fill-class helper (UI2 FULL Step 1).
// The picker fires per-tick during a drag, so the strip+add cycle has
// to be idempotent — otherwise the class attribute balloons on every
// tick.

import { describe, it, expect } from "vitest";
import { applyIconFillClass } from "../lib/vibe-edit/icon-fill-class";

describe("applyIconFillClass — pure-logic", () => {
  it("empty input → just the new token", () => {
    expect(applyIconFillClass("", "#ff0000")).toBe(
      "[&_*]:fill-[#ff0000]",
    );
  });

  it("preserves unrelated classes (size, position, base color)", () => {
    const out = applyIconFillClass(
      "w-6 h-6 text-red-500 absolute top-2",
      "#00ff00",
    );
    expect(out).toContain("w-6");
    expect(out).toContain("h-6");
    expect(out).toContain("text-red-500");
    expect(out).toContain("absolute");
    expect(out).toContain("top-2");
    expect(out).toContain("[&_*]:fill-[#00ff00]");
  });

  it("strips existing [&_*]:fill-[#hex] before adding new", () => {
    // The whole point of the strip pass — drag the picker, every tick
    // emits a new class; we must not stack them.
    const out = applyIconFillClass(
      "w-6 [&_*]:fill-[#ff0000] h-6",
      "#0000ff",
    );
    expect(out).not.toContain("[&_*]:fill-[#ff0000]");
    expect(out).toContain("[&_*]:fill-[#0000ff]");
    // Surrounding tokens intact.
    expect(out).toContain("w-6");
    expect(out).toContain("h-6");
  });

  it("lowercases the new hex", () => {
    expect(applyIconFillClass("", "#ABCDEF")).toBe(
      "[&_*]:fill-[#abcdef]",
    );
  });

  it("strips variant-prefixed forms too (md:[&_*]:fill-[#hex])", () => {
    const out = applyIconFillClass(
      "md:[&_*]:fill-[#ff0000] hover:[&_*]:fill-[#00ff00] w-6",
      "#cccccc",
    );
    expect(out).not.toContain("md:[&_*]:fill-[#ff0000]");
    expect(out).not.toContain("hover:[&_*]:fill-[#00ff00]");
    expect(out).toContain("[&_*]:fill-[#cccccc]");
    expect(out).toContain("w-6");
  });

  it("does NOT strip plain fill-[#hex] (root-only fill utility)", () => {
    // fill-[#hex] without the [&_*]: variant targets the root SVG only.
    // That's a different intent (matching the inline fill on root) and
    // we leave it alone.
    const out = applyIconFillClass(
      "fill-[#aaaaaa] w-6",
      "#bbbbbb",
    );
    expect(out).toContain("fill-[#aaaaaa]");
    expect(out).toContain("[&_*]:fill-[#bbbbbb]");
  });

  it("does NOT strip fill-current / fill-red-500 (palette / keyword fills)", () => {
    const out = applyIconFillClass(
      "fill-current fill-red-500 w-6",
      "#000000",
    );
    expect(out).toContain("fill-current");
    expect(out).toContain("fill-red-500");
    expect(out).toContain("[&_*]:fill-[#000000]");
  });

  it("strip+add is idempotent across multiple picker ticks", () => {
    // Drag-the-picker simulation: 3 successive applies should leave
    // exactly ONE arbitrary-variant token, matching the latest hex.
    let cls = "w-6 h-6 absolute";
    cls = applyIconFillClass(cls, "#ff0000");
    cls = applyIconFillClass(cls, "#00ff00");
    cls = applyIconFillClass(cls, "#0000ff");
    const matches = cls.match(/\[&_\*\]:fill-\[#[0-9a-fA-F]+\]/g);
    expect(matches).toHaveLength(1);
    expect(cls).toContain("[&_*]:fill-[#0000ff]");
    expect(cls).toContain("w-6");
  });

  it("collapses extra whitespace from input", () => {
    // Real-world className strings often have multiple-space runs from
    // hand-edits / concatenation. The split+filter handles them.
    const out = applyIconFillClass(
      "  w-6   h-6   ",
      "#aabbcc",
    );
    const tokens = out.split(/\s+/).filter((t) => t.length > 0);
    expect(tokens).toContain("w-6");
    expect(tokens).toContain("h-6");
    expect(tokens).toContain("[&_*]:fill-[#aabbcc]");
    // No double-space runs in output.
    expect(out).not.toMatch(/ {2}/);
  });

  it("handles null/undefined input gracefully", () => {
    expect(applyIconFillClass(null as unknown as string, "#ff0000")).toBe(
      "[&_*]:fill-[#ff0000]",
    );
    expect(
      applyIconFillClass(undefined as unknown as string, "#ff0000"),
    ).toBe("[&_*]:fill-[#ff0000]");
  });
});
