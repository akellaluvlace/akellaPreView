// Prod-import coverage for the shared rgbToHex util (Phase 5).
// Extracted from TextControls + IconControls inline copies; the
// extraction preserved the divergent transparent-fallback behaviour
// via opts.transparentFallback. Tests pin both the common decode
// paths AND the fallback-divergence invariant so a future "let's
// DRY this" refactor can't accidentally collapse the two.

import { describe, it, expect } from "vitest";
import { rgbToHex } from "../lib/vibe-edit/rgb-to-hex";

describe("rgbToHex — pure-logic", () => {
  it("empty string returns #000000", () => {
    expect(rgbToHex("")).toBe("#000000");
  });

  it("3-digit hex expands to 6-digit lowercase", () => {
    expect(rgbToHex("#abc")).toBe("#aabbcc");
  });

  it("6-digit hex returned lowercased verbatim", () => {
    expect(rgbToHex("#aabbcc")).toBe("#aabbcc");
  });

  it("uppercase 6-digit hex lowercased", () => {
    expect(rgbToHex("#AABBCC")).toBe("#aabbcc");
  });

  it("'transparent' with default opts returns #000000 (icon fallback)", () => {
    expect(rgbToHex("transparent")).toBe("#000000");
  });

  it("'transparent' with white-fallback opt returns #ffffff (text-bg fallback)", () => {
    expect(rgbToHex("transparent", { transparentFallback: "#ffffff" })).toBe(
      "#ffffff",
    );
  });

  it("'rgba(0, 0, 0, 0)' with white-fallback opt returns #ffffff", () => {
    expect(
      rgbToHex("rgba(0, 0, 0, 0)", { transparentFallback: "#ffffff" }),
    ).toBe("#ffffff");
  });

  it("rgb(255, 128, 0) → #ff8000", () => {
    expect(rgbToHex("rgb(255, 128, 0)")).toBe("#ff8000");
  });

  it("rgba(255, 128, 0, 0.5) drops alpha → #ff8000", () => {
    // Picker is hex-only; opacity-aware emission lives in
    // style-to-class.ts's normalizeToHex for source persistence.
    expect(rgbToHex("rgba(255, 128, 0, 0.5)")).toBe("#ff8000");
  });

  it("rgb(300, 400, 500) clamps each component to 255", () => {
    expect(rgbToHex("rgb(300, 400, 500)")).toBe("#ffffff");
  });
});
