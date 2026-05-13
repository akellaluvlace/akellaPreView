// Phase E proper — library-filter prod-import test suite.
//
// Pure-logic only. Verifies classify/sort/filterAndSort across the
// 3-tier resolution (records hit, fallback static, neither).

import { describe, it, expect } from "vitest";
import {
  classifyAssets,
  sortClassifiedAssets,
  filterAndSortLibrary,
  fitReasonsTooltip,
  type AssetCompat,
  type SortStrategy,
} from "../lib/swap/library-filter";
import type { SlotCapacity, SlotCategory, SlotEnvelope } from "../lib/swap/slot-capacity";

// ─── helpers ────────────────────────────────────────────────────────────────

function envelope(
  w: number,
  h: number,
  ar: number | null = null,
): SlotEnvelope {
  return { availableWidthPx: w, availableHeightPx: h, preferredAspectRatio: ar };
}

function record(
  patch: Partial<Omit<SlotCapacity, "intrinsic">> & {
    intrinsic?: Partial<SlotCapacity["intrinsic"]>;
  } = {},
): SlotCapacity {
  return {
    category: patch.category ?? "components",
    flexBehavior: patch.flexBehavior ?? "fit-content",
    source: patch.source ?? "library",
    intrinsic: {
      minWidthPx: null,
      minHeightPx: null,
      maxWidthPx: null,
      maxHeightPx: null,
      aspectRatio: null,
      ...(patch.intrinsic ?? {}),
    },
  };
}

// ─── classifyAssets ─────────────────────────────────────────────────────────

describe("classifyAssets", () => {
  it("compatible asset (records hit, envelope fits)", () => {
    const records = new Map([["a", record({ intrinsic: { minWidthPx: 100 } })]]);
    const r = classifyAssets(["a"], records, envelope(320, 320));
    expect(r).toHaveLength(1);
    expect(r[0].status).toBe("compatible");
    expect(r[0].verdict.ok).toBe(true);
  });

  it("incompatible asset (records hit, envelope too small)", () => {
    const records = new Map([["a", record({ intrinsic: { minWidthPx: 500 } })]]);
    const r = classifyAssets(["a"], records, envelope(320, 320));
    expect(r[0].status).toBe("incompatible");
    expect(r[0].verdict.ok).toBe(false);
  });

  it("unknown asset (no records, no fallback) treated as unknown", () => {
    const r = classifyAssets(["a"], null, envelope(320, 320));
    expect(r[0].status).toBe("unknown");
  });

  it("unknown asset with fallback classes uses static analysis", () => {
    const fallback = new Map([["a", "w-[800px] aspect-[16/9]"]]);
    const r = classifyAssets(["a"], null, envelope(320, 320, 1), {
      fallbackClasses: fallback,
    });
    // w-[800px] in 320 envelope → fixed-flex maxWidth violation.
    // aspect-[16/9] in AR-1 envelope → AR drift violation.
    expect(r[0].status).toBe("incompatible");
  });

  it("records hit takes precedence over fallback (more accurate data)", () => {
    const records = new Map([["a", record({ intrinsic: { minWidthPx: 100 } })]]);
    const fallback = new Map([["a", "w-[1000px]"]]); // would suggest incompatible
    const r = classifyAssets(["a"], records, envelope(320, 320), {
      fallbackClasses: fallback,
    });
    expect(r[0].status).toBe("compatible");
  });

  it("preserves input id order", () => {
    const records = new Map([
      ["c", record()],
      ["b", record()],
      ["a", record()],
    ]);
    const r = classifyAssets(["c", "a", "b"], records, envelope(320, 320));
    expect(r.map((c) => c.assetId)).toEqual(["c", "a", "b"]);
  });

  it("multiple assets, mixed statuses", () => {
    const records = new Map([
      ["a", record({ intrinsic: { minWidthPx: 100 } })], // compatible
      ["b", record({ intrinsic: { minWidthPx: 500 } })], // incompatible
    ]);
    const r = classifyAssets(["a", "b", "c"], records, envelope(320, 320));
    expect(r[0].status).toBe("compatible");
    expect(r[1].status).toBe("incompatible");
    expect(r[2].status).toBe("unknown");
  });

  it("uses provided category for fallback static analysis", () => {
    const fallback = new Map([["a", "w-full"]]);
    const cats = new Map<string, SlotCategory>([["a", "media"]]);
    const r = classifyAssets(["a"], null, envelope(320, 320), {
      fallbackClasses: fallback,
      assetCategories: cats,
    });
    expect(r[0].capacity.category).toBe("media");
  });

  it("empty asset list returns []", () => {
    const r = classifyAssets([], null, envelope(320, 320));
    expect(r).toEqual([]);
  });
});

// ─── sortClassifiedAssets ──────────────────────────────────────────────────

describe("sortClassifiedAssets", () => {
  function mkCompat(id: string, status: "compatible" | "incompatible" | "unknown"): AssetCompat {
    return {
      assetId: id,
      status,
      verdict: status === "incompatible" ? { ok: false, reasons: ["x"] } : { ok: true },
      capacity: record(),
    };
  }

  it("'as-given' preserves input order", () => {
    const arr = [mkCompat("a", "incompatible"), mkCompat("b", "compatible")];
    const sorted = sortClassifiedAssets(arr, "as-given");
    expect(sorted.map((c) => c.assetId)).toEqual(["a", "b"]);
    // Returns copy, not same reference
    expect(sorted).not.toBe(arr);
  });

  it("'compatible-first' bucket order: compatible → unknown → incompatible", () => {
    const arr = [
      mkCompat("i1", "incompatible"),
      mkCompat("c1", "compatible"),
      mkCompat("u1", "unknown"),
      mkCompat("i2", "incompatible"),
      mkCompat("c2", "compatible"),
    ];
    const sorted = sortClassifiedAssets(arr, "compatible-first");
    expect(sorted.map((c) => c.assetId)).toEqual(["c1", "c2", "u1", "i1", "i2"]);
  });

  it("stable within each bucket", () => {
    const arr = [
      mkCompat("c1", "compatible"),
      mkCompat("c2", "compatible"),
      mkCompat("c3", "compatible"),
    ];
    const sorted = sortClassifiedAssets(arr, "compatible-first");
    expect(sorted.map((c) => c.assetId)).toEqual(["c1", "c2", "c3"]);
  });

  it("empty input returns []", () => {
    expect(sortClassifiedAssets([], "compatible-first")).toEqual([]);
  });
});

// ─── filterAndSortLibrary ──────────────────────────────────────────────────

describe("filterAndSortLibrary", () => {
  it("returns sorted array + counts", () => {
    const records = new Map([
      ["a", record({ intrinsic: { minWidthPx: 100 } })], // compatible
      ["b", record({ intrinsic: { minWidthPx: 500 } })], // incompatible
      ["c", record({ intrinsic: { minWidthPx: 100 } })], // compatible
    ]);
    const r = filterAndSortLibrary(["a", "b", "c"], records, envelope(320, 320));
    expect(r.counts.compatible).toBe(2);
    expect(r.counts.incompatible).toBe(1);
    expect(r.counts.unknown).toBe(0);
    // First two are compatible (a, c), then b (incompatible).
    expect(r.ordered[0].status).toBe("compatible");
    expect(r.ordered[1].status).toBe("compatible");
    expect(r.ordered[2].status).toBe("incompatible");
  });

  it("default strategy is 'compatible-first'", () => {
    const records = new Map([
      ["a", record({ intrinsic: { minWidthPx: 500 } })], // incompatible
      ["b", record({ intrinsic: { minWidthPx: 100 } })], // compatible
    ]);
    const r = filterAndSortLibrary(["a", "b"], records, envelope(320, 320));
    expect(r.ordered[0].assetId).toBe("b");
    expect(r.ordered[1].assetId).toBe("a");
  });

  it("explicit 'as-given' preserves order", () => {
    const records = new Map([
      ["a", record({ intrinsic: { minWidthPx: 500 } })],
      ["b", record({ intrinsic: { minWidthPx: 100 } })],
    ]);
    const r = filterAndSortLibrary(["a", "b"], records, envelope(320, 320), {
      strategy: "as-given",
    });
    expect(r.ordered[0].assetId).toBe("a");
    expect(r.ordered[1].assetId).toBe("b");
  });

  it("counts unknown correctly", () => {
    const r = filterAndSortLibrary(["a", "b", "c"], null, envelope(320, 320));
    expect(r.counts.unknown).toBe(3);
    expect(r.counts.compatible).toBe(0);
  });

  it("aggregate counts over realistic mix", () => {
    const records = new Map<string, SlotCapacity>();
    const ids: string[] = [];
    for (let i = 0; i < 10; i++) {
      const id = `a${i}`;
      ids.push(id);
      // Half compatible (minWidth 100), half incompatible (minWidth 500).
      records.set(id, record({ intrinsic: { minWidthPx: i % 2 === 0 ? 100 : 500 } }));
    }
    // Add 3 unknown ids (not in records, no fallback).
    ids.push("u1", "u2", "u3");
    const r = filterAndSortLibrary(ids, records, envelope(320, 320));
    expect(r.counts.compatible).toBe(5);
    expect(r.counts.incompatible).toBe(5);
    expect(r.counts.unknown).toBe(3);
  });
});

// ─── fitReasonsTooltip ─────────────────────────────────────────────────────

describe("fitReasonsTooltip", () => {
  it("compatible asset returns null", () => {
    const c: AssetCompat = {
      assetId: "a",
      status: "compatible",
      verdict: { ok: true },
      capacity: record(),
    };
    expect(fitReasonsTooltip(c)).toBe(null);
  });

  it("unknown asset returns 'Fit unknown'", () => {
    const c: AssetCompat = {
      assetId: "a",
      status: "unknown",
      verdict: { ok: true },
      capacity: record(),
    };
    expect(fitReasonsTooltip(c)).toContain("unknown");
  });

  it("incompatible asset returns 'Won't fit:' + joined reasons", () => {
    const c: AssetCompat = {
      assetId: "a",
      status: "incompatible",
      verdict: { ok: false, reasons: ["needs ≥ 320px width", "AR drift"] },
      capacity: record(),
    };
    const t = fitReasonsTooltip(c);
    expect(t).toContain("Won't fit");
    expect(t).toContain("≥ 320px");
    expect(t).toContain("AR drift");
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("library-filter — invariants", () => {
  it("does not mutate input asset list", () => {
    const ids = ["a", "b", "c"];
    const before = [...ids];
    classifyAssets(ids, null, envelope(320, 320));
    expect(ids).toEqual(before);
  });

  it("classifyAssets is deterministic", () => {
    const records = new Map([
      ["a", record({ intrinsic: { minWidthPx: 100 } })],
    ]);
    const e = envelope(320, 320);
    const r1 = classifyAssets(["a"], records, e);
    const r2 = classifyAssets(["a"], records, e);
    expect(r1).toEqual(r2);
  });

  it("sortClassifiedAssets returns a NEW array, not the input", () => {
    const arr: AssetCompat[] = [];
    const out = sortClassifiedAssets(arr, "as-given");
    expect(out).not.toBe(arr);
  });

  it("filterAndSortLibrary counts sum equals input length", () => {
    const records = new Map([
      ["a", record({ intrinsic: { minWidthPx: 100 } })],
      ["b", record({ intrinsic: { minWidthPx: 500 } })],
    ]);
    const r = filterAndSortLibrary(["a", "b", "c"], records, envelope(320, 320));
    expect(r.counts.compatible + r.counts.unknown + r.counts.incompatible).toBe(3);
  });
});
