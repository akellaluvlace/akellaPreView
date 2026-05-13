// Phase E proper — envelope-from-bbox prod-import test suite.
//
// Pure-logic only. Covers parseCssAspectRatio's CSS parsing edge cases +
// composeEnvelopeFromBbox's clamping + parentBoxFromRect's chrome math.

import { describe, it, expect } from "vitest";
import {
  parseCssAspectRatio,
  composeEnvelopeFromBbox,
  parentBoxFromRect,
  type ParentBox,
  type ParentBoxFromRectInput,
} from "../lib/swap/envelope-from-bbox";

// ─── parseCssAspectRatio ────────────────────────────────────────────────────

describe("parseCssAspectRatio", () => {
  it("auto → null", () => {
    expect(parseCssAspectRatio("auto")).toBe(null);
  });

  it("empty → null", () => {
    expect(parseCssAspectRatio("")).toBe(null);
  });

  it("whitespace-only → null", () => {
    expect(parseCssAspectRatio("   ")).toBe(null);
  });

  it("null/undefined → null", () => {
    expect(parseCssAspectRatio(null)).toBe(null);
    expect(parseCssAspectRatio(undefined)).toBe(null);
  });

  it("'16 / 9' → 16/9", () => {
    expect(parseCssAspectRatio("16 / 9")).toBe(16 / 9);
  });

  it("'16/9' (no spaces) → 16/9", () => {
    expect(parseCssAspectRatio("16/9")).toBe(16 / 9);
  });

  it("'1 / 1' → 1", () => {
    expect(parseCssAspectRatio("1 / 1")).toBe(1);
  });

  it("'1.5' (single number) → 1.5", () => {
    expect(parseCssAspectRatio("1.5")).toBe(1.5);
  });

  it("'2' (single number) → 2", () => {
    expect(parseCssAspectRatio("2")).toBe(2);
  });

  it("' 4 / 3 ' (extra whitespace) → 4/3", () => {
    expect(parseCssAspectRatio(" 4 / 3 ")).toBe(4 / 3);
  });

  it("'X / 0' rejected (zero divisor)", () => {
    expect(parseCssAspectRatio("16 / 0")).toBe(null);
  });

  it("'0 / Y' rejected (zero numerator)", () => {
    expect(parseCssAspectRatio("0 / 9")).toBe(null);
  });

  it("'-2 / 1' rejected (negative)", () => {
    expect(parseCssAspectRatio("-2 / 1")).toBe(null);
  });

  it("'foo' rejected (non-numeric)", () => {
    expect(parseCssAspectRatio("foo")).toBe(null);
  });

  it("'16 / 9 / 5' rejected (3 parts)", () => {
    expect(parseCssAspectRatio("16 / 9 / 5")).toBe(null);
  });

  it("non-string input rejected", () => {
    expect(parseCssAspectRatio(42 as unknown as string)).toBe(null);
  });
});

// ─── composeEnvelopeFromBbox ───────────────────────────────────────────────

describe("composeEnvelopeFromBbox", () => {
  it("happy path: passes through dimensions and parses AR", () => {
    const env = composeEnvelopeFromBbox({
      contentWidthPx: 320,
      contentHeightPx: 200,
      aspectRatioCss: "16 / 9",
    });
    expect(env.availableWidthPx).toBe(320);
    expect(env.availableHeightPx).toBe(200);
    expect(env.preferredAspectRatio).toBe(16 / 9);
  });

  it("aspect-ratio 'auto' yields null preferredAR", () => {
    const env = composeEnvelopeFromBbox({
      contentWidthPx: 320,
      contentHeightPx: 200,
      aspectRatioCss: "auto",
    });
    expect(env.preferredAspectRatio).toBe(null);
  });

  it("null aspect-ratio yields null preferredAR", () => {
    const env = composeEnvelopeFromBbox({
      contentWidthPx: 320,
      contentHeightPx: 200,
      aspectRatioCss: null,
    });
    expect(env.preferredAspectRatio).toBe(null);
  });

  it("clamps negative width to 0", () => {
    const env = composeEnvelopeFromBbox({
      contentWidthPx: -50,
      contentHeightPx: 200,
      aspectRatioCss: null,
    });
    expect(env.availableWidthPx).toBe(0);
  });

  it("clamps negative height to 0", () => {
    const env = composeEnvelopeFromBbox({
      contentWidthPx: 320,
      contentHeightPx: -10,
      aspectRatioCss: null,
    });
    expect(env.availableHeightPx).toBe(0);
  });

  it("zero dimensions pass through unchanged", () => {
    const env = composeEnvelopeFromBbox({
      contentWidthPx: 0,
      contentHeightPx: 0,
      aspectRatioCss: null,
    });
    expect(env.availableWidthPx).toBe(0);
    expect(env.availableHeightPx).toBe(0);
  });

  it("subpixel widths preserved (no rounding)", () => {
    const env = composeEnvelopeFromBbox({
      contentWidthPx: 320.7,
      contentHeightPx: 200.3,
      aspectRatioCss: null,
    });
    expect(env.availableWidthPx).toBe(320.7);
    expect(env.availableHeightPx).toBe(200.3);
  });
});

// ─── parentBoxFromRect ──────────────────────────────────────────────────────

describe("parentBoxFromRect", () => {
  function input(patch: Partial<ParentBoxFromRectInput> = {}): ParentBoxFromRectInput {
    return {
      rectWidthPx: 400,
      rectHeightPx: 300,
      paddingLeftPx: 0,
      paddingRightPx: 0,
      paddingTopPx: 0,
      paddingBottomPx: 0,
      borderLeftPx: 0,
      borderRightPx: 0,
      borderTopPx: 0,
      borderBottomPx: 0,
      aspectRatioCss: null,
      ...patch,
    };
  }

  it("zero chrome: rect = content", () => {
    const box = parentBoxFromRect(input());
    expect(box.contentWidthPx).toBe(400);
    expect(box.contentHeightPx).toBe(300);
  });

  it("subtracts horizontal padding", () => {
    const box = parentBoxFromRect(
      input({ paddingLeftPx: 16, paddingRightPx: 24 }),
    );
    expect(box.contentWidthPx).toBe(360);
  });

  it("subtracts vertical padding", () => {
    const box = parentBoxFromRect(
      input({ paddingTopPx: 12, paddingBottomPx: 16 }),
    );
    expect(box.contentHeightPx).toBe(272);
  });

  it("subtracts border on both axes", () => {
    const box = parentBoxFromRect(
      input({
        borderLeftPx: 2,
        borderRightPx: 2,
        borderTopPx: 1,
        borderBottomPx: 1,
      }),
    );
    expect(box.contentWidthPx).toBe(396);
    expect(box.contentHeightPx).toBe(298);
  });

  it("subtracts BOTH padding and border", () => {
    const box = parentBoxFromRect(
      input({
        paddingLeftPx: 16,
        paddingRightPx: 16,
        paddingTopPx: 8,
        paddingBottomPx: 8,
        borderLeftPx: 2,
        borderRightPx: 2,
        borderTopPx: 1,
        borderBottomPx: 1,
      }),
    );
    expect(box.contentWidthPx).toBe(400 - 16 - 16 - 2 - 2);
    expect(box.contentHeightPx).toBe(300 - 8 - 8 - 1 - 1);
  });

  it("threads aspectRatioCss through", () => {
    const box = parentBoxFromRect(input({ aspectRatioCss: "16 / 9" }));
    expect(box.aspectRatioCss).toBe("16 / 9");
  });

  it("composes through composeEnvelopeFromBbox end-to-end", () => {
    const box = parentBoxFromRect(
      input({
        rectWidthPx: 400,
        paddingLeftPx: 24,
        paddingRightPx: 24,
        rectHeightPx: 300,
        paddingTopPx: 16,
        paddingBottomPx: 16,
        aspectRatioCss: "16 / 9",
      }),
    );
    const env = composeEnvelopeFromBbox(box);
    expect(env.availableWidthPx).toBe(352);
    expect(env.availableHeightPx).toBe(268);
    expect(env.preferredAspectRatio).toBe(16 / 9);
  });

  it("under-sized rect (smaller than chrome) yields negative content; clamp via envelope", () => {
    const box = parentBoxFromRect(
      input({
        rectWidthPx: 30,
        paddingLeftPx: 16,
        paddingRightPx: 16,
      }),
    );
    expect(box.contentWidthPx).toBe(-2);
    // Envelope clamps to 0.
    const env = composeEnvelopeFromBbox(box);
    expect(env.availableWidthPx).toBe(0);
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("envelope-from-bbox — invariants", () => {
  it("composeEnvelopeFromBbox does not mutate input", () => {
    const box: ParentBox = {
      contentWidthPx: 320,
      contentHeightPx: 200,
      aspectRatioCss: "16 / 9",
    };
    const before = { ...box };
    composeEnvelopeFromBbox(box);
    expect(box).toEqual(before);
  });

  it("parentBoxFromRect does not mutate input", () => {
    const inp: ParentBoxFromRectInput = {
      rectWidthPx: 400,
      rectHeightPx: 300,
      paddingLeftPx: 16,
      paddingRightPx: 16,
      paddingTopPx: 8,
      paddingBottomPx: 8,
      borderLeftPx: 0,
      borderRightPx: 0,
      borderTopPx: 0,
      borderBottomPx: 0,
      aspectRatioCss: null,
    };
    const before = { ...inp };
    parentBoxFromRect(inp);
    expect(inp).toEqual(before);
  });

  it("deterministic", () => {
    const box: ParentBox = {
      contentWidthPx: 320,
      contentHeightPx: 200,
      aspectRatioCss: "16 / 9",
    };
    const a = composeEnvelopeFromBbox(box);
    const b = composeEnvelopeFromBbox(box);
    expect(a).toEqual(b);
  });
});
