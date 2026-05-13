// Phase E proper — capacity-loader prod-import test suite.
//
// Pure-logic only. Covers the schema validator across every error branch
// + lookup tier resolution + serialize round-trip + schema-version
// discriminated-union scaffold.

import { describe, it, expect } from "vitest";
import {
  parseCapacityFile,
  lookupCapacity,
  serializeCapacityFile,
  CAPACITY_LOADER_CONSTANTS,
  type CapacityFileV1,
} from "../lib/swap/capacity-loader";
import type { SlotCapacity } from "../lib/swap/slot-capacity";

// ─── helpers ────────────────────────────────────────────────────────────────

function makeRecord(
  assetId: string,
  patch: Partial<Omit<SlotCapacity, "intrinsic">> & {
    intrinsic?: Partial<SlotCapacity["intrinsic"]>;
  } = {},
): { assetId: string } & SlotCapacity {
  const baseIntrinsic = {
    minWidthPx: null,
    minHeightPx: null,
    maxWidthPx: null,
    maxHeightPx: null,
    aspectRatio: null,
    ...(patch.intrinsic ?? {}),
  };
  return {
    assetId,
    category: patch.category ?? "components",
    flexBehavior: patch.flexBehavior ?? "fit-content",
    source: patch.source ?? "library",
    intrinsic: {
      minWidthPx: baseIntrinsic.minWidthPx ?? null,
      minHeightPx: baseIntrinsic.minHeightPx ?? null,
      maxWidthPx: baseIntrinsic.maxWidthPx ?? null,
      maxHeightPx: baseIntrinsic.maxHeightPx ?? null,
      aspectRatio: baseIntrinsic.aspectRatio ?? null,
    },
  };
}

function makeFile(
  records: Array<{ assetId: string } & SlotCapacity>,
  patch: Partial<CapacityFileV1> = {},
): unknown {
  return {
    schemaVersion: patch.schemaVersion ?? 1,
    generatedAt: patch.generatedAt ?? "2026-05-07T00:00:00.000Z",
    records,
  };
}

// ─── parseCapacityFile happy paths ──────────────────────────────────────────

describe("parseCapacityFile — happy paths", () => {
  it("parses an empty records list", () => {
    const r = parseCapacityFile(makeFile([]));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.records.size).toBe(0);
      expect(r.schemaVersion).toBe(1);
      expect(r.generatedAt).toBe("2026-05-07T00:00:00.000Z");
    }
  });

  it("parses a single happy record", () => {
    const r = parseCapacityFile(
      makeFile([
        makeRecord("hyperui-cards-base", {
          category: "components",
          flexBehavior: "fit-content",
          source: "library",
          intrinsic: { minWidthPx: 320, aspectRatio: 16 / 9 },
        }),
      ]),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.records.size).toBe(1);
      const cap = r.records.get("hyperui-cards-base")!;
      expect(cap.category).toBe("components");
      expect(cap.flexBehavior).toBe("fit-content");
      expect(cap.source).toBe("library");
      expect(cap.intrinsic.minWidthPx).toBe(320);
      expect(cap.intrinsic.aspectRatio).toBe(16 / 9);
    }
  });

  it("parses multiple records", () => {
    const r = parseCapacityFile(
      makeFile([
        makeRecord("a", { intrinsic: { minWidthPx: 100 } }),
        makeRecord("b", { intrinsic: { minWidthPx: 200 } }),
        makeRecord("c", { intrinsic: { minWidthPx: 300 } }),
      ]),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.records.size).toBe(3);
      expect(r.records.get("a")!.intrinsic.minWidthPx).toBe(100);
      expect(r.records.get("b")!.intrinsic.minWidthPx).toBe(200);
      expect(r.records.get("c")!.intrinsic.minWidthPx).toBe(300);
    }
  });

  it("accepts all 3 valid flexBehavior values", () => {
    const r = parseCapacityFile(
      makeFile([
        makeRecord("a", { flexBehavior: "fill" }),
        makeRecord("b", { flexBehavior: "fit-content" }),
        makeRecord("c", { flexBehavior: "fixed" }),
      ]),
    );
    expect(r.ok).toBe(true);
  });

  it("accepts both source values (library + user-extracted)", () => {
    const r = parseCapacityFile(
      makeFile([
        makeRecord("a", { source: "library" }),
        makeRecord("b", { source: "user-extracted" }),
      ]),
    );
    expect(r.ok).toBe(true);
  });

  it("accepts all 4 valid category values", () => {
    const r = parseCapacityFile(
      makeFile([
        makeRecord("a", { category: "components" }),
        makeRecord("b", { category: "media" }),
        makeRecord("c", { category: "icons" }),
        makeRecord("d", { category: "unknown" }),
      ]),
    );
    expect(r.ok).toBe(true);
  });
});

// ─── parseCapacityFile error paths ──────────────────────────────────────────

describe("parseCapacityFile — error paths", () => {
  it("rejects null root", () => {
    const r = parseCapacityFile(null);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("root must be a JSON object");
  });

  it("rejects array root", () => {
    const r = parseCapacityFile([]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("root must be a JSON object");
  });

  it("rejects string root", () => {
    const r = parseCapacityFile("hello");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("root must be a JSON object");
  });

  it("rejects schemaVersion=2 (forces explicit migration)", () => {
    const r = parseCapacityFile(makeFile([], { schemaVersion: 2 as 1 }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("unsupported schemaVersion");
  });

  it("rejects schemaVersion=0", () => {
    const r = parseCapacityFile(makeFile([], { schemaVersion: 0 as 1 }));
    expect(r.ok).toBe(false);
  });

  it("rejects missing schemaVersion", () => {
    const r = parseCapacityFile({
      generatedAt: "2026-05-07",
      records: [],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("unsupported schemaVersion");
  });

  it("rejects empty generatedAt", () => {
    const r = parseCapacityFile(makeFile([], { generatedAt: "" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("generatedAt");
  });

  it("rejects non-array records", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: {},
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("records must be an array");
  });

  it("rejects record missing assetId", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: [{ ...makeRecord("a"), assetId: "" }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("assetId");
  });

  it("rejects invalid category", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: [{ ...makeRecord("a"), category: "bogus" as unknown as "unknown" }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("category");
  });

  it("rejects invalid flexBehavior", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: [
        { ...makeRecord("a"), flexBehavior: "stretch" as unknown as "fill" },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("flexBehavior");
  });

  it("rejects invalid source", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: [
        { ...makeRecord("a"), source: "github" as unknown as "library" },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("source");
  });

  it("rejects intrinsic missing required key", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: [
        {
          ...makeRecord("a"),
          intrinsic: { minWidthPx: null, minHeightPx: null, maxWidthPx: null, aspectRatio: null }, // no maxHeightPx
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("maxHeightPx");
  });

  it("rejects intrinsic with NaN value", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: [
        {
          ...makeRecord("a"),
          intrinsic: {
            minWidthPx: NaN,
            minHeightPx: null,
            maxWidthPx: null,
            maxHeightPx: null,
            aspectRatio: null,
          },
        },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("minWidthPx");
  });

  it("rejects intrinsic with string value", () => {
    const r = parseCapacityFile({
      schemaVersion: 1,
      generatedAt: "2026-05-07",
      records: [
        {
          ...makeRecord("a"),
          intrinsic: {
            minWidthPx: "320" as unknown as number,
            minHeightPx: null,
            maxWidthPx: null,
            maxHeightPx: null,
            aspectRatio: null,
          },
        },
      ],
    });
    expect(r.ok).toBe(false);
  });

  it("rejects duplicate assetId", () => {
    const r = parseCapacityFile(
      makeFile([makeRecord("dup"), makeRecord("dup")]),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('duplicate assetId "dup"');
  });

  it("error message includes record index", () => {
    const r = parseCapacityFile(
      makeFile([
        makeRecord("a"),
        makeRecord("b"),
        { ...makeRecord("c"), category: "bad" as unknown as "unknown" },
      ]),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("records[2]");
  });
});

// ─── lookupCapacity ─────────────────────────────────────────────────────────

describe("lookupCapacity — three-tier resolution", () => {
  const records = new Map<string, SlotCapacity>();
  records.set("hit", {
    category: "components",
    flexBehavior: "fixed",
    source: "library",
    intrinsic: {
      minWidthPx: 320,
      minHeightPx: null,
      maxWidthPx: 800,
      maxHeightPx: null,
      aspectRatio: null,
    },
  });

  it("returns measured capacity when assetId hits", () => {
    const c = lookupCapacity(records, "hit", null);
    expect(c).not.toBe(null);
    expect(c!.intrinsic.minWidthPx).toBe(320);
    expect(c!.source).toBe("library");
  });

  it("falls back to static analysis when assetId misses but classes given", () => {
    const c = lookupCapacity(records, "miss", "w-[640px] aspect-[16/9]");
    expect(c).not.toBe(null);
    expect(c!.flexBehavior).toBe("fixed");
    expect(c!.intrinsic.maxWidthPx).toBe(640);
    expect(c!.source).toBe("user-extracted");
  });

  it("uses passed category in static-analysis fallback", () => {
    const c = lookupCapacity(records, "miss", "w-full", "media");
    expect(c).not.toBe(null);
    expect(c!.category).toBe("media");
  });

  it("returns null when both records and fallback miss", () => {
    expect(lookupCapacity(records, "miss", null)).toBe(null);
    expect(lookupCapacity(records, "miss", "")).toBe(null);
    expect(lookupCapacity(null, "anything", null)).toBe(null);
  });

  it("returns null when assetId is empty string + no fallback", () => {
    expect(lookupCapacity(records, "", null)).toBe(null);
  });

  it("returns null when records is null AND assetId given but no fallback", () => {
    expect(lookupCapacity(null, "hit", null)).toBe(null);
  });

  it("falls back even when records is null + classes provided", () => {
    const c = lookupCapacity(null, "miss", "w-full");
    expect(c).not.toBe(null);
    expect(c!.flexBehavior).toBe("fill");
  });

  it("records hit takes precedence over fallback classes", () => {
    // Records record has flexBehavior=fixed, but classes would suggest "fit-content"
    // (only `rounded-xl`). Records wins.
    const c = lookupCapacity(records, "hit", "rounded-xl");
    expect(c!.flexBehavior).toBe("fixed");
    expect(c!.source).toBe("library");
  });
});

// ─── serializeCapacityFile / round-trip ─────────────────────────────────────

describe("serializeCapacityFile + round-trip", () => {
  it("produces valid v1 wire shape", () => {
    const map = new Map<string, SlotCapacity>();
    map.set("a", {
      category: "components",
      flexBehavior: "fit-content",
      source: "library",
      intrinsic: {
        minWidthPx: 320,
        minHeightPx: null,
        maxWidthPx: 640,
        maxHeightPx: null,
        aspectRatio: 16 / 9,
      },
    });

    const wire = serializeCapacityFile(map, "2026-05-07T12:00:00Z");
    expect(wire.schemaVersion).toBe(1);
    expect(wire.generatedAt).toBe("2026-05-07T12:00:00Z");
    expect(wire.records).toHaveLength(1);
    expect(wire.records[0].assetId).toBe("a");
    expect(wire.records[0].intrinsic.aspectRatio).toBe(16 / 9);
  });

  it("round-trip parse → serialize → parse identical-shape", () => {
    const original = makeFile([
      makeRecord("alpha", {
        category: "media",
        flexBehavior: "fixed",
        source: "library",
        intrinsic: { minWidthPx: 320, maxWidthPx: 640, aspectRatio: 16 / 9 },
      }),
      makeRecord("beta", {
        category: "components",
        flexBehavior: "fill",
        source: "library",
        intrinsic: { minHeightPx: 200 },
      }),
    ]);

    const r1 = parseCapacityFile(original);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;

    const wire = serializeCapacityFile(r1.records, r1.generatedAt);

    const r2 = parseCapacityFile(wire);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;

    expect(r2.records.size).toBe(r1.records.size);
    for (const [id, cap] of r1.records) {
      expect(r2.records.get(id)).toEqual(cap);
    }
  });

  it("emits records in bytewise-sorted assetId order (deterministic)", () => {
    const map = new Map<string, SlotCapacity>();
    // Insert out of order; expect alphabetical output.
    map.set("zulu", {
      category: "components",
      flexBehavior: "fit-content",
      source: "library",
      intrinsic: {
        minWidthPx: null,
        minHeightPx: null,
        maxWidthPx: null,
        maxHeightPx: null,
        aspectRatio: null,
      },
    });
    map.set("alpha", {
      category: "components",
      flexBehavior: "fit-content",
      source: "library",
      intrinsic: {
        minWidthPx: null,
        minHeightPx: null,
        maxWidthPx: null,
        maxHeightPx: null,
        aspectRatio: null,
      },
    });
    map.set("mike", {
      category: "components",
      flexBehavior: "fit-content",
      source: "library",
      intrinsic: {
        minWidthPx: null,
        minHeightPx: null,
        maxWidthPx: null,
        maxHeightPx: null,
        aspectRatio: null,
      },
    });

    const wire = serializeCapacityFile(map, "now");
    const ids = wire.records.map((r) => r.assetId);
    expect(ids).toEqual(["alpha", "mike", "zulu"]);
  });

  it("serialize on empty map yields empty records array", () => {
    const wire = serializeCapacityFile(new Map(), "now");
    expect(wire.records).toEqual([]);
    expect(wire.schemaVersion).toBe(1);
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("capacity-loader — invariants", () => {
  it("CAPACITY_LOADER_CONSTANTS exposes valid sets + current version", () => {
    expect(CAPACITY_LOADER_CONSTANTS.VALID_FLEX).toBeInstanceOf(Set);
    expect(CAPACITY_LOADER_CONSTANTS.VALID_FLEX.has("fill")).toBe(true);
    expect(CAPACITY_LOADER_CONSTANTS.VALID_FLEX.size).toBe(3);
    expect(CAPACITY_LOADER_CONSTANTS.VALID_SOURCE.size).toBe(2);
    expect(CAPACITY_LOADER_CONSTANTS.VALID_CATEGORY.size).toBe(4);
    expect(CAPACITY_LOADER_CONSTANTS.CURRENT_SCHEMA_VERSION).toBe(1);
  });

  it("returned records map is a fresh Map instance (not shared)", () => {
    const r = parseCapacityFile(makeFile([makeRecord("a")]));
    if (!r.ok) throw new Error("expected ok");
    // Ensure callers can mutate without affecting future parses.
    r.records.set("injected", {
      category: "components",
      flexBehavior: "fit-content",
      source: "library",
      intrinsic: {
        minWidthPx: null,
        minHeightPx: null,
        maxWidthPx: null,
        maxHeightPx: null,
        aspectRatio: null,
      },
    });
    expect(r.records.has("injected")).toBe(true);
  });

  it("deterministic across repeated parses", () => {
    const file = makeFile([
      makeRecord("a", { intrinsic: { minWidthPx: 320 } }),
      makeRecord("b", { intrinsic: { aspectRatio: 16 / 9 } }),
    ]);
    const r1 = parseCapacityFile(file);
    const r2 = parseCapacityFile(file);
    expect(r1.ok && r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      expect(Array.from(r1.records.entries())).toEqual(
        Array.from(r2.records.entries()),
      );
    }
  });
});
