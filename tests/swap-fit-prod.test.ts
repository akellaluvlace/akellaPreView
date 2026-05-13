// Phase E proper — swap-fit prod-import test suite.
//
// Pure-logic only. Covers `applySwapFit` width-overflow + aspect-mismatch
// rules + all bail paths + the breakpoint-prefix safety + the
// summarizeSwapFitChanges formatter + constants canary.

import { describe, it, expect } from "vitest";
import {
  applySwapFit,
  summarizeSwapFitChanges,
  SWAP_FIT_CONSTANTS,
  type SwapFitChange,
  type SwapFitResult,
} from "../lib/swap/swap-fit";
import {
  AR_DRIFT_TOLERANCE,
  type SlotEnvelope,
} from "../lib/swap/slot-capacity";

function envelope(
  w: number,
  h: number,
  ar: number | null = null,
): SlotEnvelope {
  return {
    availableWidthPx: w,
    availableHeightPx: h,
    preferredAspectRatio: ar,
  };
}

// ─── empty / no-op paths ────────────────────────────────────────────────────

describe("applySwapFit — empty / no-op", () => {
  it("empty string passes through", () => {
    const r = applySwapFit("", envelope(320, 320));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe("");
    expect(r.changes).toEqual([]);
  });

  it("non-string input returns empty without throwing", () => {
    // Defensive: callers might pass null when className attribute is absent.
    const r = applySwapFit(null as unknown as string, envelope(320, 320));
    expect(r.changed).toBe(false);
    expect(r.changes).toEqual([]);
  });

  it("classes without w-[…] or aspect-[…] are unchanged", () => {
    const cls = "flex flex-col gap-4 bg-slate-100 rounded-2xl p-6";
    const r = applySwapFit(cls, envelope(320, 320));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
    expect(r.changes).toEqual([]);
  });

  it("identity-preserves classes string when no rule fires", () => {
    const cls = "w-full h-full p-4";
    const r = applySwapFit(cls, envelope(320, 320, 1));
    expect(r.classes).toBe(cls);
  });
});

// ─── width overflow rule ────────────────────────────────────────────────────

describe("applySwapFit — width overflow", () => {
  it("replaces w-[800px] with w-full when slot is 320px", () => {
    const r = applySwapFit("rounded-xl w-[800px] bg-white", envelope(320, 600));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("rounded-xl w-full bg-white");
    expect(r.changes).toEqual([
      { kind: "width-overflow", from: "w-[800px]", to: "w-full" },
    ]);
  });

  it("at-boundary width fits exactly (no transform)", () => {
    const r = applySwapFit("w-[320px]", envelope(320, 600));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe("w-[320px]");
  });

  it("just-under width fits (no transform)", () => {
    const r = applySwapFit("w-[319px]", envelope(320, 600));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe("w-[319px]");
  });

  it("just-over width transforms", () => {
    const r = applySwapFit("w-[321px]", envelope(320, 600));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("w-full");
  });

  it("decimal width (w-[800.5px]) transforms when overflowing", () => {
    const r = applySwapFit("p-4 w-[800.5px]", envelope(320, 600));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("p-4 w-full");
  });

  it("breakpoint-prefixed width (lg:w-[800px]) is LEFT ALONE", () => {
    const cls = "rounded-xl lg:w-[800px] bg-white";
    const r = applySwapFit(cls, envelope(320, 600));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("hover-prefixed width (hover:w-[800px]) is LEFT ALONE", () => {
    const cls = "transition hover:w-[800px]";
    const r = applySwapFit(cls, envelope(320, 600));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("rem-unit width (w-[40rem]) is LEFT ALONE — only px is handled", () => {
    const cls = "w-[40rem]";
    const r = applySwapFit(cls, envelope(320, 600));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("Infinity envelope width never overflows", () => {
    const cls = "w-[9999px]";
    const r = applySwapFit(cls, envelope(Number.POSITIVE_INFINITY, 600));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("preserves other classes around the replaced token", () => {
    const r = applySwapFit(
      "flex flex-col gap-4 w-[800px] rounded-2xl shadow-md p-6",
      envelope(320, 600),
    );
    expect(r.classes).toBe(
      "flex flex-col gap-4 w-full rounded-2xl shadow-md p-6",
    );
  });

  it("replaces w-[800px] at start of class string", () => {
    const r = applySwapFit("w-[800px] rounded-xl", envelope(320, 600));
    expect(r.classes).toBe("w-full rounded-xl");
  });

  it("replaces w-[800px] at end of class string", () => {
    const r = applySwapFit("rounded-xl w-[800px]", envelope(320, 600));
    expect(r.classes).toBe("rounded-xl w-full");
  });

  it("only matches token-bounded widths (not substrings)", () => {
    // `xw-[800px]` is gibberish — not Tailwind. Should NOT match.
    const cls = "xw-[800px] rounded-xl";
    const r = applySwapFit(cls, envelope(320, 600));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });
});

// ─── aspect-ratio mismatch rule ─────────────────────────────────────────────

describe("applySwapFit — aspect-ratio mismatch", () => {
  it("aspect-[16/9] in 1:1 slot replaces with aspect-[1/1]", () => {
    const r = applySwapFit("aspect-[16/9] rounded-xl", envelope(320, 320, 1));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("aspect-[1/1] rounded-xl");
    expect(r.changes).toEqual([
      { kind: "aspect-mismatch", from: "aspect-[16/9]", to: "aspect-[1/1]" },
    ]);
  });

  it("aspect-square (1:1) in 16:9 slot replaces with aspect-[1.78/1]", () => {
    const r = applySwapFit("aspect-square", envelope(640, 360, 16 / 9));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("aspect-[1.78/1]");
    expect(r.changes).toEqual([
      {
        kind: "aspect-mismatch",
        from: "aspect-square",
        to: "aspect-[1.78/1]",
      },
    ]);
  });

  it("aspect-video (16:9) in 1:1 slot replaces with aspect-[1/1]", () => {
    const r = applySwapFit("aspect-video", envelope(320, 320, 1));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("aspect-[1/1]");
  });

  it("AR within tolerance does NOT transform (5% drift < 10%)", () => {
    // Slot AR 1.0; capacity AR 1.05 → drift 5%. Below threshold.
    const cls = "aspect-[1.05/1] rounded-xl";
    const r = applySwapFit(cls, envelope(320, 320, 1));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("AR just-over tolerance (11% drift) DOES transform", () => {
    // Slot 1.0; capacity 1.11 → drift 11%. Above 10% threshold.
    const r = applySwapFit("aspect-[1.11/1]", envelope(320, 320, 1));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("aspect-[1/1]");
  });

  it("slot has no preferred AR (null) — no transform", () => {
    const cls = "aspect-[16/9]";
    const r = applySwapFit(cls, envelope(320, 320, null));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("slot AR=0 is treated as absent (no transform)", () => {
    const cls = "aspect-[16/9]";
    const r = applySwapFit(cls, envelope(320, 320, 0));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("breakpoint-prefixed aspect (lg:aspect-square) is LEFT ALONE", () => {
    const cls = "lg:aspect-square rounded-xl";
    const r = applySwapFit(cls, envelope(320, 320, 16 / 9));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("aspect-[X/0] (zero divisor) is skipped safely", () => {
    const cls = "aspect-[16/0] rounded-xl";
    const r = applySwapFit(cls, envelope(320, 320, 1));
    expect(r.changed).toBe(false);
    expect(r.classes).toBe(cls);
  });

  it("rounds to 2 decimals dropping trailing zeros (1.5 stays 1.5)", () => {
    // 3:2 ratio = 1.5. Slot AR = 1.5; capacity AR = 1.0 → drift 50%.
    const r = applySwapFit("aspect-square", envelope(300, 200, 3 / 2));
    expect(r.classes).toBe("aspect-[1.5/1]");
  });

  it("rounds 1.0 → '1' (no decimal)", () => {
    const r = applySwapFit("aspect-video", envelope(300, 300, 1));
    expect(r.classes).toBe("aspect-[1/1]");
  });

  it("rounds 1.7777... → 1.78", () => {
    const r = applySwapFit("aspect-square", envelope(640, 360, 16 / 9));
    expect(r.classes).toBe("aspect-[1.78/1]");
  });

  it("preserves other classes around the replaced aspect token", () => {
    const r = applySwapFit(
      "rounded-2xl aspect-[16/9] shadow-md p-6",
      envelope(320, 320, 1),
    );
    expect(r.classes).toBe("rounded-2xl aspect-[1/1] shadow-md p-6");
  });

  it("decimal X/Y in arbitrary aspect (aspect-[1.5/2]) is parsed", () => {
    // 1.5/2 = 0.75. Slot 1.0 → drift 25%. Replaces.
    const r = applySwapFit("aspect-[1.5/2]", envelope(320, 320, 1));
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("aspect-[1/1]");
  });
});

// ─── combined rules ─────────────────────────────────────────────────────────

describe("applySwapFit — combined rules", () => {
  it("applies both width-overflow AND aspect-mismatch in one call", () => {
    const r = applySwapFit(
      "w-[800px] aspect-[16/9] rounded-xl",
      envelope(320, 320, 1),
    );
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("w-full aspect-[1/1] rounded-xl");
    expect(r.changes).toHaveLength(2);
    expect(r.changes[0].kind).toBe("width-overflow");
    expect(r.changes[1].kind).toBe("aspect-mismatch");
  });

  it("only width fires when AR is within tolerance", () => {
    const r = applySwapFit(
      "w-[800px] aspect-[1.05/1]",
      envelope(320, 320, 1),
    );
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("w-full aspect-[1.05/1]");
    expect(r.changes).toHaveLength(1);
    expect(r.changes[0].kind).toBe("width-overflow");
  });

  it("only AR fires when width fits", () => {
    const r = applySwapFit(
      "w-[300px] aspect-[16/9]",
      envelope(320, 320, 1),
    );
    expect(r.changed).toBe(true);
    expect(r.classes).toBe("w-[300px] aspect-[1/1]");
    expect(r.changes).toHaveLength(1);
    expect(r.changes[0].kind).toBe("aspect-mismatch");
  });
});

// ─── summarizeSwapFitChanges ────────────────────────────────────────────────

describe("summarizeSwapFitChanges", () => {
  it("empty changes returns null", () => {
    expect(summarizeSwapFitChanges([], envelope(320, 600))).toBe(null);
  });

  it("formats a single width-overflow change with slot width", () => {
    const changes: SwapFitChange[] = [
      { kind: "width-overflow", from: "w-[800px]", to: "w-full" },
    ];
    const msg = summarizeSwapFitChanges(changes, envelope(320, 600));
    expect(msg).toBe("Auto-fit: w-[800px] → w-full (slot was 320px wide)");
  });

  it("formats a single aspect-mismatch change", () => {
    const changes: SwapFitChange[] = [
      { kind: "aspect-mismatch", from: "aspect-[16/9]", to: "aspect-[1/1]" },
    ];
    const msg = summarizeSwapFitChanges(changes, envelope(320, 320, 1));
    expect(msg).toBe("Auto-fit: aspect-[16/9] → aspect-[1/1]");
  });

  it("joins multiple changes with semicolons", () => {
    const changes: SwapFitChange[] = [
      { kind: "width-overflow", from: "w-[800px]", to: "w-full" },
      { kind: "aspect-mismatch", from: "aspect-[16/9]", to: "aspect-[1/1]" },
    ];
    const msg = summarizeSwapFitChanges(changes, envelope(320, 320, 1));
    expect(msg).toBe(
      "Auto-fit: w-[800px] → w-full (slot was 320px wide); aspect-[16/9] → aspect-[1/1]",
    );
  });

  it("rounds slot width to integer in message", () => {
    const changes: SwapFitChange[] = [
      { kind: "width-overflow", from: "w-[800px]", to: "w-full" },
    ];
    const msg = summarizeSwapFitChanges(changes, envelope(319.7, 600));
    expect(msg).toBe("Auto-fit: w-[800px] → w-full (slot was 320px wide)");
  });
});

// ─── constants + invariants ─────────────────────────────────────────────────

describe("applySwapFit — invariants", () => {
  it("AR_DRIFT_TOLERANCE re-exported via SWAP_FIT_CONSTANTS matches lib", () => {
    expect(SWAP_FIT_CONSTANTS.AR_DRIFT_TOLERANCE).toBe(AR_DRIFT_TOLERANCE);
    expect(AR_DRIFT_TOLERANCE).toBe(0.1);
  });

  it("regex patterns are exported as constants for tests + future filter", () => {
    expect(SWAP_FIT_CONSTANTS.W_PX_LITERAL_RE).toBeInstanceOf(RegExp);
    expect(SWAP_FIT_CONSTANTS.ASPECT_ARBITRARY_RE).toBeInstanceOf(RegExp);
    expect(SWAP_FIT_CONSTANTS.ASPECT_NAMED_RE).toBeInstanceOf(RegExp);
  });

  it("does not mutate the input string (returns new string)", () => {
    const cls = "w-[800px] aspect-[16/9]";
    const r = applySwapFit(cls, envelope(320, 320, 1));
    expect(cls).toBe("w-[800px] aspect-[16/9]"); // unchanged
    expect(r.classes).not.toBe(cls);
  });

  it("is deterministic across repeated calls", () => {
    const cls = "w-[800px] aspect-[16/9] rounded-xl";
    const env = envelope(320, 320, 1);
    const a = applySwapFit(cls, env);
    const b = applySwapFit(cls, env);
    const c = applySwapFit(cls, env);
    expect(a.classes).toBe(b.classes);
    expect(b.classes).toBe(c.classes);
    expect(a.changes).toEqual(b.changes);
  });

  it("idempotent: applying twice yields same result on second call", () => {
    const env = envelope(320, 320, 1);
    const a = applySwapFit("w-[800px] aspect-[16/9]", env);
    const b = applySwapFit(a.classes, env);
    expect(b.changed).toBe(false);
    expect(b.classes).toBe(a.classes);
  });

  it("SwapFitResult shape is the documented contract", () => {
    const r: SwapFitResult = applySwapFit("w-[800px]", envelope(320, 320));
    expect(typeof r.classes).toBe("string");
    expect(Array.isArray(r.changes)).toBe(true);
    expect(typeof r.changed).toBe("boolean");
    expect(r.changed).toBe(r.changes.length > 0);
  });
});
