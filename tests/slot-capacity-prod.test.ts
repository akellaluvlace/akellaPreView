// Phase E foundation — slot-capacity prod-import test suite.
//
// Pure-logic only. Covers `slotCapacityFits` against synthetic envelope
// + capacity pairs hitting every comparison branch + every reason path.

import { describe, it, expect } from "vitest";
import {
  AR_DRIFT_TOLERANCE,
  slotCapacityFits,
  unconstrainedCapacity,
  unconstrainedEnvelope,
  type FitVerdict,
  type SlotCapacity,
  type SlotEnvelope,
} from "../lib/swap/slot-capacity";

// ─── helpers ────────────────────────────────────────────────────────────────

const FILL: SlotCapacity = {
  category: "components",
  intrinsic: {
    minWidthPx: null,
    minHeightPx: null,
    maxWidthPx: null,
    maxHeightPx: null,
    aspectRatio: null,
  },
  flexBehavior: "fill",
  source: "library",
};

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

function withIntrinsic(
  base: SlotCapacity,
  patch: Partial<SlotCapacity["intrinsic"]>,
): SlotCapacity {
  return {
    ...base,
    intrinsic: { ...base.intrinsic, ...patch },
  };
}

function expectFit(v: FitVerdict): asserts v is { ok: true } {
  if (!v.ok) {
    throw new Error(`expected fit but got reasons: ${v.reasons.join("; ")}`);
  }
}

function expectFail(v: FitVerdict): { reasons: string[] } {
  if (v.ok) throw new Error("expected fail but got ok");
  return { reasons: v.reasons };
}

// ─── happy paths ────────────────────────────────────────────────────────────

describe("slotCapacityFits — happy paths", () => {
  it("fully unconstrained capacity fits any envelope", () => {
    expectFit(slotCapacityFits(envelope(100, 100), FILL));
    expectFit(slotCapacityFits(envelope(0, 0), FILL));
    expectFit(slotCapacityFits(envelope(99999, 99999), FILL));
  });

  it("min-width met by envelope width", () => {
    const cap = withIntrinsic(FILL, { minWidthPx: 320 });
    expectFit(slotCapacityFits(envelope(320, 100), cap));
    expectFit(slotCapacityFits(envelope(640, 100), cap));
  });

  it("min-height met by envelope height", () => {
    const cap = withIntrinsic(FILL, { minHeightPx: 200 });
    expectFit(slotCapacityFits(envelope(100, 200), cap));
    expectFit(slotCapacityFits(envelope(100, 1000), cap));
  });

  it("fixed flex with maxWidth ≤ envelope width fits", () => {
    const cap: SlotCapacity = {
      ...FILL,
      flexBehavior: "fixed",
      intrinsic: { ...FILL.intrinsic, maxWidthPx: 480 },
    };
    expectFit(slotCapacityFits(envelope(480, 100), cap));
    expectFit(slotCapacityFits(envelope(800, 100), cap));
  });

  it("matching aspect ratios fit (same exact)", () => {
    const cap = withIntrinsic(FILL, { aspectRatio: 16 / 9 });
    expectFit(slotCapacityFits(envelope(640, 360, 16 / 9), cap));
  });

  it("aspect ratios within tolerance fit", () => {
    const cap = withIntrinsic(FILL, { aspectRatio: 1.78 });
    // 5% drift below AR_DRIFT_TOLERANCE (10%) — still ok.
    const slotAr = 1.78 * 1.05;
    expectFit(slotCapacityFits(envelope(800, 450, slotAr), cap));
  });

  it("AR set on capacity but slot is reflowing (preferredAspectRatio: null) → ok", () => {
    const cap = withIntrinsic(FILL, { aspectRatio: 16 / 9 });
    expectFit(slotCapacityFits(envelope(640, 360, null), cap));
  });

  it("AR set on slot but capacity is reflowing → ok", () => {
    expectFit(slotCapacityFits(envelope(640, 360, 16 / 9), FILL));
  });
});

// ─── failure paths ──────────────────────────────────────────────────────────

describe("slotCapacityFits — width violation", () => {
  it("fails when minWidthPx > envelope width", () => {
    const cap = withIntrinsic(FILL, { minWidthPx: 320 });
    const v = expectFail(slotCapacityFits(envelope(200, 200), cap));
    expect(v.reasons[0]).toContain("≥ 320px width");
    expect(v.reasons[0]).toContain("slot has 200px");
  });

  it("fails on width when minWidth exceeds by 1px (boundary)", () => {
    const cap = withIntrinsic(FILL, { minWidthPx: 321 });
    expectFail(slotCapacityFits(envelope(320, 200), cap));
  });

  it("passes when minWidth equals envelope width (exact match)", () => {
    const cap = withIntrinsic(FILL, { minWidthPx: 320 });
    expectFit(slotCapacityFits(envelope(320, 200), cap));
  });
});

describe("slotCapacityFits — height violation", () => {
  it("fails when minHeightPx > envelope height", () => {
    const cap = withIntrinsic(FILL, { minHeightPx: 200 });
    const v = expectFail(slotCapacityFits(envelope(800, 100), cap));
    expect(v.reasons[0]).toContain("≥ 200px height");
    expect(v.reasons[0]).toContain("slot has 100px");
  });

  it("passes when minHeight equals envelope height", () => {
    const cap = withIntrinsic(FILL, { minHeightPx: 200 });
    expectFit(slotCapacityFits(envelope(800, 200), cap));
  });
});

describe("slotCapacityFits — fixed-flex maxWidth violation", () => {
  it("fails when fixed asset's maxWidth > envelope width", () => {
    const cap: SlotCapacity = {
      ...FILL,
      flexBehavior: "fixed",
      intrinsic: { ...FILL.intrinsic, maxWidthPx: 800 },
    };
    const v = expectFail(slotCapacityFits(envelope(400, 200), cap));
    expect(v.reasons[0]).toContain("fixed-width 800px");
    expect(v.reasons[0]).toContain("400px");
  });

  it("does NOT trigger maxWidth check when flex is `fill` or `fit-content`", () => {
    // A reflowing asset with a large maxWidth doesn't fail in a small
    // slot — it shrinks. Only `fixed` is a hard fail.
    const cap = withIntrinsic(FILL, { maxWidthPx: 800 });
    expectFit(slotCapacityFits(envelope(400, 200), cap));
    const fitContent: SlotCapacity = {
      ...cap,
      flexBehavior: "fit-content",
    };
    expectFit(slotCapacityFits(envelope(400, 200), fitContent));
  });
});

describe("slotCapacityFits — aspect-ratio drift", () => {
  it("fails when AR drift exceeds AR_DRIFT_TOLERANCE", () => {
    const cap = withIntrinsic(FILL, { aspectRatio: 16 / 9 });
    // 16:9 = 1.78. Drift to 4:3 (1.33) is ~25% — well past 10%.
    const v = expectFail(slotCapacityFits(envelope(640, 480, 4 / 3), cap));
    expect(v.reasons[0]).toMatch(/aspect ratio/i);
    expect(v.reasons[0]).toMatch(/drift/);
  });

  it("does NOT fail just under the tolerance boundary", () => {
    // The check is `> AR_DRIFT_TOLERANCE` strictly. Stay slightly under
    // tolerance to avoid floating-point flakiness at the exact boundary
    // (1 * 1.1 - 1 doesn't reproduce 0.1 exactly in IEEE 754).
    const slotAr = 1.0;
    const capAr = slotAr * (1 + AR_DRIFT_TOLERANCE - 0.001);
    const cap = withIntrinsic(FILL, { aspectRatio: capAr });
    expectFit(slotCapacityFits(envelope(100, 100, slotAr), cap));
  });

  it("fails at tolerance + 0.01 (just past boundary)", () => {
    const slotAr = 1.0;
    const capAr = slotAr * (1 + AR_DRIFT_TOLERANCE + 0.01);
    const cap = withIntrinsic(FILL, { aspectRatio: capAr });
    expectFail(slotCapacityFits(envelope(100, 100, slotAr), cap));
  });
});

// ─── multi-reason paths ─────────────────────────────────────────────────────

describe("slotCapacityFits — multi-reason", () => {
  it("collects multiple reasons when several constraints violate", () => {
    const cap: SlotCapacity = {
      ...FILL,
      flexBehavior: "fixed",
      intrinsic: {
        minWidthPx: 800,
        minHeightPx: 400,
        maxWidthPx: 1200,
        maxHeightPx: null,
        aspectRatio: 2.0,
      },
    };
    const v = expectFail(slotCapacityFits(envelope(200, 100, 1.0), cap));
    // All four checks should fire: minWidth, minHeight, fixed maxWidth,
    // AR drift. (1200 > 200 too, so fixed-maxWidth fires.)
    expect(v.reasons.length).toBe(4);
    const all = v.reasons.join("\n");
    expect(all).toMatch(/width/);
    expect(all).toMatch(/height/);
    expect(all).toMatch(/fixed-width/);
    expect(all).toMatch(/aspect ratio/i);
  });

  it("preserves reason order (width, height, fixed-width, AR)", () => {
    const cap: SlotCapacity = {
      ...FILL,
      flexBehavior: "fixed",
      intrinsic: {
        minWidthPx: 800,
        minHeightPx: 400,
        maxWidthPx: 1200,
        maxHeightPx: null,
        aspectRatio: 2.0,
      },
    };
    const v = expectFail(slotCapacityFits(envelope(200, 100, 1.0), cap));
    expect(v.reasons[0]).toContain("width");
    expect(v.reasons[1]).toContain("height");
    expect(v.reasons[2]).toContain("fixed-width");
    expect(v.reasons[3]).toContain("aspect ratio");
  });
});

// ─── unconstrained helpers ──────────────────────────────────────────────────

describe("unconstrainedEnvelope", () => {
  it("any capacity fits an unconstrained envelope", () => {
    const env = unconstrainedEnvelope();
    expectFit(slotCapacityFits(env, FILL));
    const fixedHeavy: SlotCapacity = {
      ...FILL,
      flexBehavior: "fixed",
      intrinsic: {
        minWidthPx: 9999,
        minHeightPx: 9999,
        maxWidthPx: 9999,
        maxHeightPx: 9999,
        aspectRatio: 0.5,
      },
    };
    expectFit(slotCapacityFits(env, fixedHeavy));
  });

  it("emits Infinity as the available* fields", () => {
    const env = unconstrainedEnvelope();
    expect(env.availableWidthPx).toBe(Number.POSITIVE_INFINITY);
    expect(env.availableHeightPx).toBe(Number.POSITIVE_INFINITY);
    expect(env.preferredAspectRatio).toBe(null);
  });
});

describe("unconstrainedCapacity", () => {
  it("fits an unconstrained envelope by default", () => {
    expectFit(slotCapacityFits(unconstrainedEnvelope(), unconstrainedCapacity()));
  });

  it("defaults category to 'unknown'", () => {
    const cap = unconstrainedCapacity();
    expect(cap.category).toBe("unknown");
  });

  it("accepts an explicit category override", () => {
    const cap = unconstrainedCapacity("components");
    expect(cap.category).toBe("components");
  });

  it("source is 'user-extracted' (capacity isn't from the ingest pipeline)", () => {
    const cap = unconstrainedCapacity();
    expect(cap.source).toBe("user-extracted");
  });

  it("flexBehavior is 'fill' so it adapts to any slot size", () => {
    const cap = unconstrainedCapacity();
    expect(cap.flexBehavior).toBe("fill");
  });

  it("fits even a tiny tight slot", () => {
    expectFit(slotCapacityFits(envelope(1, 1, 0.1), unconstrainedCapacity()));
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("slotCapacityFits — invariants", () => {
  it("AR_DRIFT_TOLERANCE is exposed and locked at 0.1 (10%)", () => {
    expect(AR_DRIFT_TOLERANCE).toBe(0.1);
  });

  it("does not mutate input (envelope or capacity)", () => {
    const env = envelope(640, 480, 1.0);
    const cap = withIntrinsic(FILL, { minWidthPx: 320, aspectRatio: 1.0 });
    const beforeEnv = JSON.stringify(env);
    const beforeCap = JSON.stringify(cap);
    slotCapacityFits(env, cap);
    expect(JSON.stringify(env)).toBe(beforeEnv);
    expect(JSON.stringify(cap)).toBe(beforeCap);
  });

  it("is deterministic (same inputs → same verdict)", () => {
    const env = envelope(640, 480, 1.5);
    const cap = withIntrinsic(FILL, { aspectRatio: 1.0 });
    const a = slotCapacityFits(env, cap);
    const b = slotCapacityFits(env, cap);
    expect(a).toEqual(b);
  });

  it("ok:true verdict has no `reasons` property (discriminated union shape)", () => {
    const v = slotCapacityFits(unconstrainedEnvelope(), FILL);
    if (!v.ok) throw new Error("expected ok");
    expect((v as any).reasons).toBeUndefined();
  });
});
