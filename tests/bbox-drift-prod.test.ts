// Phase E proper — bbox-drift prod-import test suite.
//
// Pure-logic only. Covers `assessBboxDrift`'s threshold checks + zero-
// dimension handling + null inputs + multi-axis composition + message
// formatting + symmetry (grow vs shrink).

import { describe, it, expect } from "vitest";
import {
  assessBboxDrift,
  BBOX_DRIFT_CONSTANTS,
  BBOX_DRIFT_DEFAULT_THRESHOLD,
  type BboxRect,
} from "../lib/swap/bbox-drift";

const r = (w: number, h: number): BboxRect => ({ widthPx: w, heightPx: h });

// ─── happy paths ────────────────────────────────────────────────────────────

describe("assessBboxDrift — happy paths", () => {
  it("identical rects: ok, no drift", () => {
    const a = assessBboxDrift(r(320, 200), r(320, 200));
    expect(a.ok).toBe(true);
    expect(a.widthDrift).toBe(0);
    expect(a.heightDrift).toBe(0);
    expect(a.drifted).toEqual([]);
    expect(a.message).toBe(null);
  });

  it("under-threshold drift on both axes is ok", () => {
    const a = assessBboxDrift(r(320, 200), r(335, 210));
    expect(a.ok).toBe(true);
    expect(a.widthDrift).toBeLessThan(0.1);
    expect(a.heightDrift).toBeLessThan(0.1);
    expect(a.drifted).toEqual([]);
  });

  it("at exactly the threshold, fits (strict-greater check)", () => {
    // 320 → 352 = 10% drift exactly. threshold = 0.1; strict `>` doesn't fire.
    const a = assessBboxDrift(r(320, 200), r(352, 200));
    expect(a.ok).toBe(true);
    expect(a.widthDrift).toBeCloseTo(0.1, 10);
  });
});

// ─── width drift ────────────────────────────────────────────────────────────

describe("assessBboxDrift — width drift", () => {
  it("just-over threshold on width fails", () => {
    const a = assessBboxDrift(r(320, 200), r(360, 200));
    expect(a.ok).toBe(false);
    expect(a.drifted).toEqual(["width"]);
    expect(a.message).toContain("width");
    expect(a.message).toContain("320px");
    expect(a.message).toContain("360px");
  });

  it("symmetric: shrink also fails (320 → 280 = 12.5%)", () => {
    const a = assessBboxDrift(r(320, 200), r(280, 200));
    expect(a.ok).toBe(false);
    expect(a.drifted).toEqual(["width"]);
  });

  it("massive grow (320 → 800 = 150% drift) fails", () => {
    const a = assessBboxDrift(r(320, 200), r(800, 200));
    expect(a.ok).toBe(false);
    expect(a.widthDrift).toBeCloseTo(1.5, 10);
    expect(a.message).toContain("150% drift");
  });

  it("massive shrink (320 → 80 = 75% drift) fails", () => {
    const a = assessBboxDrift(r(320, 200), r(80, 200));
    expect(a.ok).toBe(false);
    expect(a.message).toContain("75% drift");
  });
});

// ─── height drift ───────────────────────────────────────────────────────────

describe("assessBboxDrift — height drift", () => {
  it("just-over threshold on height fails", () => {
    const a = assessBboxDrift(r(320, 200), r(320, 240));
    expect(a.ok).toBe(false);
    expect(a.drifted).toEqual(["height"]);
    expect(a.message).toContain("height");
  });

  it("shrink height past threshold", () => {
    const a = assessBboxDrift(r(320, 200), r(320, 100));
    expect(a.ok).toBe(false);
    expect(a.drifted).toEqual(["height"]);
    expect(a.heightDrift).toBeCloseTo(0.5, 10);
  });
});

// ─── multi-axis ─────────────────────────────────────────────────────────────

describe("assessBboxDrift — multi-axis", () => {
  it("both axes drift past threshold: both flagged", () => {
    const a = assessBboxDrift(r(320, 200), r(800, 600));
    expect(a.ok).toBe(false);
    expect(a.drifted).toContain("width");
    expect(a.drifted).toContain("height");
    expect(a.drifted).toHaveLength(2);
  });

  it("composes message with both drifts in canonical order (width first)", () => {
    const a = assessBboxDrift(r(320, 200), r(800, 600));
    expect(a.message!.indexOf("width")).toBeLessThan(
      a.message!.indexOf("height"),
    );
  });

  it("only one axis drifts: only that axis appears in message", () => {
    const a = assessBboxDrift(r(320, 200), r(360, 205));
    expect(a.ok).toBe(false);
    expect(a.message).toContain("width");
    expect(a.message).not.toContain("height");
  });
});

// ─── threshold override ─────────────────────────────────────────────────────

describe("assessBboxDrift — threshold override", () => {
  it("looser threshold (0.5 = 50%) allows 30% drift", () => {
    const a = assessBboxDrift(r(320, 200), r(416, 200), { threshold: 0.5 });
    expect(a.ok).toBe(true);
    expect(a.widthDrift).toBeCloseTo(0.3, 10);
  });

  it("stricter threshold (0.05 = 5%) flags 7% drift", () => {
    const a = assessBboxDrift(r(320, 200), r(343, 200), { threshold: 0.05 });
    expect(a.ok).toBe(false);
    expect(a.widthDrift).toBeGreaterThan(0.05);
  });

  it("threshold 0 means any non-zero drift fails", () => {
    const a = assessBboxDrift(r(320, 200), r(321, 200), { threshold: 0 });
    expect(a.ok).toBe(false);
  });

  it("threshold Infinity passes everything", () => {
    const a = assessBboxDrift(r(320, 200), r(99999, 99999), {
      threshold: Number.POSITIVE_INFINITY,
    });
    expect(a.ok).toBe(true);
  });
});

// ─── zero-dimension / degenerate ────────────────────────────────────────────

describe("assessBboxDrift — zero / degenerate inputs", () => {
  it("0 → 100 width with default failOnZero=false → no warn (axis skipped)", () => {
    const a = assessBboxDrift(r(0, 200), r(100, 200));
    expect(a.ok).toBe(true);
    expect(a.widthDrift).toBe(0);
  });

  it("0 → 100 width with failOnZeroDimension=true → fails (Infinity drift)", () => {
    const a = assessBboxDrift(r(0, 200), r(100, 200), {
      failOnZeroDimension: true,
    });
    expect(a.ok).toBe(false);
    expect(a.widthDrift).toBe(Number.POSITIVE_INFINITY);
    expect(a.drifted).toContain("width");
  });

  it("both pre and post 0: ok (no drift to assess)", () => {
    const a = assessBboxDrift(r(0, 0), r(0, 0));
    expect(a.ok).toBe(true);
  });

  it("Infinity / NaN dimension treated as drift=0 (no false-positive)", () => {
    const a = assessBboxDrift(r(Number.POSITIVE_INFINITY, 200), r(320, 200));
    expect(a.widthDrift).toBe(0);
    const b = assessBboxDrift(r(NaN, 200), r(320, 200));
    expect(b.widthDrift).toBe(0);
  });
});

// ─── null / undefined inputs ────────────────────────────────────────────────

describe("assessBboxDrift — null inputs", () => {
  it("null pre returns ok with zero drift", () => {
    const a = assessBboxDrift(null, r(100, 100));
    expect(a.ok).toBe(true);
    expect(a.widthDrift).toBe(0);
    expect(a.heightDrift).toBe(0);
  });

  it("null post returns ok", () => {
    const a = assessBboxDrift(r(100, 100), null);
    expect(a.ok).toBe(true);
  });

  it("both null returns ok", () => {
    const a = assessBboxDrift(null, null);
    expect(a.ok).toBe(true);
    expect(a.message).toBe(null);
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("assessBboxDrift — invariants", () => {
  it("BBOX_DRIFT_DEFAULT_THRESHOLD locked at 0.1", () => {
    expect(BBOX_DRIFT_DEFAULT_THRESHOLD).toBe(0.1);
    expect(BBOX_DRIFT_CONSTANTS.BBOX_DRIFT_DEFAULT_THRESHOLD).toBe(0.1);
  });

  it("does not mutate inputs", () => {
    const pre = r(320, 200);
    const post = r(800, 600);
    assessBboxDrift(pre, post);
    expect(pre).toEqual({ widthPx: 320, heightPx: 200 });
    expect(post).toEqual({ widthPx: 800, heightPx: 600 });
  });

  it("deterministic across repeated calls", () => {
    const pre = r(320, 200);
    const post = r(360, 220);
    const a = assessBboxDrift(pre, post);
    const b = assessBboxDrift(pre, post);
    expect(a.ok).toBe(b.ok);
    expect(a.widthDrift).toBe(b.widthDrift);
    expect(a.heightDrift).toBe(b.heightDrift);
    expect(a.drifted).toEqual(b.drifted);
    expect(a.message).toBe(b.message);
  });

  it("symmetry: identical magnitude grow vs shrink yield same drift fraction", () => {
    // 320 → 360 = 12.5% grow. 320 → 280 = 12.5% shrink. Both same fraction.
    const grow = assessBboxDrift(r(320, 200), r(360, 200));
    const shrink = assessBboxDrift(r(320, 200), r(280, 200));
    expect(grow.widthDrift).toBeCloseTo(shrink.widthDrift, 10);
    expect(grow.ok).toBe(shrink.ok);
  });

  it("message format includes both pre and post dimensions in px", () => {
    const a = assessBboxDrift(r(320, 200), r(640, 200));
    expect(a.message).toMatch(/320px.*640px/);
  });

  it("rounds dimensions to integers in message (320.7px → 321px)", () => {
    const a = assessBboxDrift(r(320.7, 200), r(640.4, 200));
    expect(a.message).toContain("321px");
    expect(a.message).toContain("640px");
  });
});
