// Phase 5 §5 / audit-2026-05-04 medium-fix — direct-import test for the
// pure helpers exported by `lib/tree-persistence.ts`. Sister file to
// `tests/tree-persistence.test.ts`, which goes through
// `runBench("bench-tree-persistence")` and ends up testing the bench's
// inlined ~500-LOC mirror of the lib (audit `02-tests.md` flagged this
// as the highest-impact remaining inline-mirror anti-pattern after
// resize). This file imports the functions directly so any drift between
// the inlined mirror and the actual production implementation has a
// counterweight that catches the divergence.
//
// Coverage scope: the PURE helpers only (parsers, serializers, classifiers,
// formatters, threshold/cap parsers, predict-bytes). The impure
// helpers (read*, write*, clear*, subscribeStoredTreeStateChanges) need a
// localStorage stand-in and the vitest config has `environment: "node"`
// — testing them properly is the jsdom-integration item still on the
// MEDIUM backlog. The pure surface is where the audit's "lib was
// refactored, bench wasn't" concern actually applies.

import { describe, it, expect } from "vitest";
import {
  KEY_NAMESPACE,
  STORAGE_SCHEMA_VERSION,
  classifyStorageBytes,
  formatStoredBytes,
  isStoredTreeStateAtDefaults,
  parseSchemaVersionFromKey,
  parseStorageBytesThresholdOverride,
  parseStoredDepth,
  parseStoredExpanded,
  parseStoredQuery,
  parseStoredSubtreeDepths,
  parseSubtreeDepthCapOverride,
  predictStoredTreeStateBytes,
  serializeStoredDepth,
  serializeStoredExpanded,
  serializeStoredSubtreeDepths,
  versionedKey,
} from "../lib/tree-persistence";

describe("versionedKey + namespace constants", () => {
  it("composes namespace + name + :vN suffix", () => {
    expect(versionedKey("foo")).toBe(
      `${KEY_NAMESPACE}foo:v${STORAGE_SCHEMA_VERSION}`,
    );
  });

  it("STORAGE_SCHEMA_VERSION is a positive integer", () => {
    expect(Number.isInteger(STORAGE_SCHEMA_VERSION)).toBe(true);
    expect(STORAGE_SCHEMA_VERSION).toBeGreaterThan(0);
  });

  // Audit F8 — `versionedKey` is generic over `Name extends string` and
  // returns `DropinTreeKey<Name>`. Runtime behavior is unchanged (still
  // a plain string); the brand is compile-time-only.
  it("F8 — return value coerces to string transparently for Web Storage APIs", () => {
    const k = versionedKey("audit-f8-canary");
    expect(typeof k).toBe("string");
    expect(`${k}`).toBe(k); // template-string coercion preserves identity
  });

  it("F8 — distinct names produce distinct keys (no aliasing)", () => {
    const a = versionedKey("alpha");
    const b = versionedKey("beta");
    expect(a).not.toBe(b);
    expect(a.endsWith("alpha:v" + STORAGE_SCHEMA_VERSION)).toBe(true);
    expect(b.endsWith("beta:v" + STORAGE_SCHEMA_VERSION)).toBe(true);
  });

  it("F8 — repeated calls with the same name are deterministic", () => {
    expect(versionedKey("repeat")).toBe(versionedKey("repeat"));
  });
});

describe("parseStoredDepth", () => {
  it("null raw → fallback", () => {
    expect(parseStoredDepth(null, 2)).toBe(2);
    expect(parseStoredDepth(null, null)).toBeNull();
  });

  it('"null" → null (manual mode sentinel)', () => {
    expect(parseStoredDepth("null", 2)).toBeNull();
  });

  it('"Infinity" → POSITIVE_INFINITY (expand-all sentinel)', () => {
    expect(parseStoredDepth("Infinity", 2)).toBe(Number.POSITIVE_INFINITY);
  });

  it("integer string → that integer", () => {
    expect(parseStoredDepth("3", 2)).toBe(3);
    expect(parseStoredDepth("0", 2)).toBe(0);
  });

  it("empty / whitespace → fallback (NOT 0)", () => {
    expect(parseStoredDepth("", 2)).toBe(2);
    expect(parseStoredDepth("   ", 2)).toBe(2);
  });

  it("non-numeric → fallback", () => {
    expect(parseStoredDepth("abc", 2)).toBe(2);
    expect(parseStoredDepth("NaN", 2)).toBe(2);
  });

  it("negative → fallback", () => {
    expect(parseStoredDepth("-1", 2)).toBe(2);
  });

  it("fractional → floor", () => {
    expect(parseStoredDepth("3.7", 2)).toBe(3);
  });
});

describe("serializeStoredDepth", () => {
  it("null → 'null'", () => {
    expect(serializeStoredDepth(null)).toBe("null");
  });

  it("Infinity → 'Infinity'", () => {
    expect(serializeStoredDepth(Number.POSITIVE_INFINITY)).toBe("Infinity");
  });

  it("integer → string of integer", () => {
    expect(serializeStoredDepth(3)).toBe("3");
    expect(serializeStoredDepth(0)).toBe("0");
  });

  it("fractional → floor → string", () => {
    expect(serializeStoredDepth(3.7)).toBe("3");
  });
});

describe("depth round-trip", () => {
  it("parse(serialize(x)) = x for representative values", () => {
    const cases: Array<number | null> = [null, 0, 1, 2, 5, 100, Number.POSITIVE_INFINITY];
    for (const v of cases) {
      const round = parseStoredDepth(serializeStoredDepth(v), -999);
      expect(round).toBe(v);
    }
  });
});

describe("parseStoredQuery", () => {
  it("null → empty string", () => {
    expect(parseStoredQuery(null)).toBe("");
  });

  it("normal string preserved", () => {
    expect(parseStoredQuery("hello world")).toBe("hello world");
  });

  it("over-cap (>256 chars) → clamped to 256", () => {
    const big = "x".repeat(500);
    const r = parseStoredQuery(big);
    expect(r.length).toBe(256);
  });
});

describe("parseStoredExpanded", () => {
  it("null raw → null", () => {
    expect(parseStoredExpanded(null)).toBeNull();
  });

  it("valid JSON array of strings → that array", () => {
    expect(parseStoredExpanded('["a","b","c"]')).toEqual(["a", "b", "c"]);
  });

  it("invalid JSON → null", () => {
    expect(parseStoredExpanded("not json")).toBeNull();
  });

  it("non-array JSON (object) → null", () => {
    expect(parseStoredExpanded('{"a":1}')).toBeNull();
  });

  it("array of mixed types (one non-string) → null", () => {
    expect(parseStoredExpanded('["a",42,"b"]')).toBeNull();
  });

  it("over-cap (>1000 entries) → first 1000 kept", () => {
    const big = JSON.stringify(Array.from({ length: 1500 }, (_, i) => `n${i}`));
    const r = parseStoredExpanded(big);
    expect(r?.length).toBe(1000);
    expect(r?.[0]).toBe("n0");
    expect(r?.[999]).toBe("n999");
  });
});

describe("serializeStoredExpanded", () => {
  it("array → JSON array of strings", () => {
    expect(serializeStoredExpanded(["a", "b"])).toBe('["a","b"]');
  });

  it("Set → array order preserved (Set's iteration order)", () => {
    const s = new Set(["x", "y", "z"]);
    expect(serializeStoredExpanded(s)).toBe('["x","y","z"]');
  });

  it("over-cap → trimmed to first 1000", () => {
    const big = Array.from({ length: 1500 }, (_, i) => `n${i}`);
    const r = JSON.parse(serializeStoredExpanded(big));
    expect(r.length).toBe(1000);
  });
});

describe("expanded round-trip", () => {
  it("parse(serialize(x)) preserves contents", () => {
    const original = ["alpha", "beta", "gamma"];
    expect(parseStoredExpanded(serializeStoredExpanded(original))).toEqual(
      original,
    );
  });
});

describe("parseStoredSubtreeDepths", () => {
  it("null raw → null", () => {
    expect(parseStoredSubtreeDepths(null)).toBeNull();
  });

  it("valid object → record of integers", () => {
    expect(parseStoredSubtreeDepths('{"a":2,"b":3}')).toEqual({ a: 2, b: 3 });
  });

  it("array (non-object top level) → null", () => {
    expect(parseStoredSubtreeDepths("[1,2,3]")).toBeNull();
  });

  it("null JSON value → null", () => {
    expect(parseStoredSubtreeDepths("null")).toBeNull();
  });

  it("non-numeric values silently dropped", () => {
    expect(parseStoredSubtreeDepths('{"a":2,"b":"x","c":3}')).toEqual({
      a: 2,
      c: 3,
    });
  });

  it("negative depth dropped", () => {
    expect(parseStoredSubtreeDepths('{"a":2,"b":-1}')).toEqual({ a: 2 });
  });

  it("fractional depth floored", () => {
    expect(parseStoredSubtreeDepths('{"a":2.7}')).toEqual({ a: 2 });
  });

  it("over default cap (50 entries) → trimmed to 50", () => {
    const obj: Record<string, number> = {};
    for (let i = 0; i < 80; i++) obj[`k${i}`] = i;
    const r = parseStoredSubtreeDepths(JSON.stringify(obj));
    expect(Object.keys(r ?? {}).length).toBe(50);
  });

  it("custom maxEntries override respected", () => {
    const obj: Record<string, number> = {};
    for (let i = 0; i < 30; i++) obj[`k${i}`] = i;
    const r = parseStoredSubtreeDepths(JSON.stringify(obj), 10);
    expect(Object.keys(r ?? {}).length).toBe(10);
  });
});

describe("serializeStoredSubtreeDepths", () => {
  it("under cap → JSON of full record", () => {
    const out = serializeStoredSubtreeDepths({ a: 2, b: 3 });
    expect(JSON.parse(out)).toEqual({ a: 2, b: 3 });
  });

  it("over cap → drops oldest (keeps last N by insertion order)", () => {
    const obj: Record<string, number> = {};
    for (let i = 0; i < 70; i++) obj[`k${i}`] = i;
    // Custom cap of 5 to make assertion crisp
    const out = serializeStoredSubtreeDepths(obj, 5);
    const parsed = JSON.parse(out) as Record<string, number>;
    expect(Object.keys(parsed)).toEqual(["k65", "k66", "k67", "k68", "k69"]);
  });
});

describe("subtreeDepths round-trip", () => {
  it("parse(serialize(x)) = x", () => {
    const original = { a: 2, b: 0, c: 5 };
    expect(parseStoredSubtreeDepths(serializeStoredSubtreeDepths(original))).toEqual(
      original,
    );
  });
});

describe("parseSchemaVersionFromKey", () => {
  it("extracts integer from :vN suffix", () => {
    expect(parseSchemaVersionFromKey("dropin:tree:depth:v1")).toBe(1);
    expect(parseSchemaVersionFromKey("dropin:tree:depth:v42")).toBe(42);
  });

  it("returns null on missing suffix", () => {
    expect(parseSchemaVersionFromKey("dropin:tree:depth")).toBeNull();
  });

  it("returns null on non-numeric suffix", () => {
    expect(parseSchemaVersionFromKey("dropin:tree:depth:vfoo")).toBeNull();
  });

  it(":v0 is valid (zero is a finite integer)", () => {
    expect(parseSchemaVersionFromKey("dropin:tree:depth:v0")).toBe(0);
  });
});

describe("predictStoredTreeStateBytes", () => {
  it("defaults (depth=2, no query, no expanded, no subtreeDepths) → only depth key counted", () => {
    const r = predictStoredTreeStateBytes({
      lastAppliedDepth: 2,
      query: "",
      expanded: new Set(),
      subtreeDepths: {},
    });
    expect(r.keyCount).toBe(1); // just depth
    expect(r.bytes).toBeGreaterThan(0);
  });

  it("query non-empty → counted as second key", () => {
    const r = predictStoredTreeStateBytes({
      lastAppliedDepth: 2,
      query: "hello",
      expanded: new Set(),
      subtreeDepths: {},
    });
    expect(r.keyCount).toBe(2);
  });

  it("manual mode (depth=null) + non-empty expanded set → expanded key counted", () => {
    const r = predictStoredTreeStateBytes({
      lastAppliedDepth: null,
      query: "",
      expanded: new Set(["a", "b"]),
      subtreeDepths: {},
    });
    expect(r.keyCount).toBe(2); // depth + expanded
  });

  it("depth-mode (depth=2) + non-empty expanded set → expanded NOT counted (depth re-apply rebuilds it)", () => {
    const r = predictStoredTreeStateBytes({
      lastAppliedDepth: 2,
      query: "",
      expanded: new Set(["a", "b"]),
      subtreeDepths: {},
    });
    expect(r.keyCount).toBe(1); // only depth
  });

  it("subtreeDepths non-empty → counted; subtreeDepthCap parameter respected (audit-fixed purity)", () => {
    const sd: Record<string, number> = {};
    for (let i = 0; i < 30; i++) sd[`k${i}`] = i;
    const rDefault = predictStoredTreeStateBytes({
      lastAppliedDepth: 2,
      query: "",
      expanded: new Set(),
      subtreeDepths: sd,
    });
    const rCapped = predictStoredTreeStateBytes({
      lastAppliedDepth: 2,
      query: "",
      expanded: new Set(),
      subtreeDepths: sd,
      subtreeDepthCap: 5,
    });
    // Lower cap → fewer entries serialized → fewer bytes
    expect(rCapped.bytes).toBeLessThan(rDefault.bytes);
  });

  it("all four components → keyCount 4", () => {
    const r = predictStoredTreeStateBytes({
      lastAppliedDepth: null,
      query: "x",
      expanded: new Set(["a"]),
      subtreeDepths: { x: 1 },
    });
    expect(r.keyCount).toBe(4);
  });
});

describe("classifyStorageBytes", () => {
  it("0 bytes → ok", () => {
    expect(classifyStorageBytes(0)).toBe("ok");
  });

  it("under 4KB → ok", () => {
    expect(classifyStorageBytes(2 * 1024)).toBe("ok");
  });

  it("at warn threshold (4KB) → warn", () => {
    expect(classifyStorageBytes(4 * 1024)).toBe("warn");
  });

  it("just under danger (16KB - 1) → warn", () => {
    expect(classifyStorageBytes(16 * 1024 - 1)).toBe("warn");
  });

  it("at danger threshold (16KB) → danger", () => {
    expect(classifyStorageBytes(16 * 1024)).toBe("danger");
  });

  it("way over danger → danger", () => {
    expect(classifyStorageBytes(1024 * 1024)).toBe("danger");
  });

  it("NaN → ok (defensive)", () => {
    expect(classifyStorageBytes(NaN)).toBe("ok");
  });

  it("negative → ok (defensive)", () => {
    expect(classifyStorageBytes(-100)).toBe("ok");
  });

  it("custom thresholds respected", () => {
    expect(classifyStorageBytes(500, { warnAt: 100, dangerAt: 1000 })).toBe(
      "warn",
    );
    expect(classifyStorageBytes(2000, { warnAt: 100, dangerAt: 1000 })).toBe(
      "danger",
    );
  });

  it("degenerate config (warnAt >= dangerAt) → warn unreachable", () => {
    // warnAt=1000, dangerAt=500 means anything >= 500 is danger; warn never fires.
    expect(classifyStorageBytes(700, { warnAt: 1000, dangerAt: 500 })).toBe(
      "danger",
    );
    expect(classifyStorageBytes(300, { warnAt: 1000, dangerAt: 500 })).toBe(
      "ok",
    );
  });
});

describe("formatStoredBytes", () => {
  it("0 → '0 B'", () => {
    expect(formatStoredBytes(0)).toBe("0 B");
  });

  it("under 1KB → '<N> B' floor", () => {
    expect(formatStoredBytes(500)).toBe("500 B");
    expect(formatStoredBytes(123.7)).toBe("123 B");
  });

  it("exactly 1KB → '1K'", () => {
    expect(formatStoredBytes(1024)).toBe("1K");
  });

  it("fractional KB → trimmed trailing zeros", () => {
    expect(formatStoredBytes(1536)).toBe("1.5K"); // 1.5K, not 1.50K
  });

  it("integer-K formatting strips '.00'", () => {
    expect(formatStoredBytes(12 * 1024)).toBe("12K"); // not 12.00K
  });

  it("NaN → '0 B' (defensive)", () => {
    expect(formatStoredBytes(NaN)).toBe("0 B");
  });

  it("negative → '0 B' (defensive)", () => {
    expect(formatStoredBytes(-50)).toBe("0 B");
  });
});

describe("parseSubtreeDepthCapOverride", () => {
  it("null → fallback", () => {
    expect(parseSubtreeDepthCapOverride(null, 50)).toBe(50);
  });

  it("empty / whitespace → fallback", () => {
    expect(parseSubtreeDepthCapOverride("", 50)).toBe(50);
    expect(parseSubtreeDepthCapOverride("   ", 50)).toBe(50);
  });

  it("non-numeric → fallback", () => {
    expect(parseSubtreeDepthCapOverride("abc", 50)).toBe(50);
  });

  it("negative → fallback", () => {
    expect(parseSubtreeDepthCapOverride("-5", 50)).toBe(50);
  });

  it("below min (10) → clamped up to 10", () => {
    expect(parseSubtreeDepthCapOverride("5", 50)).toBe(10);
  });

  it("above max (5000) → clamped down to 5000", () => {
    expect(parseSubtreeDepthCapOverride("9999", 50)).toBe(5000);
  });

  it("in-range integer → that integer", () => {
    expect(parseSubtreeDepthCapOverride("123", 50)).toBe(123);
  });

  it("fractional → floor", () => {
    expect(parseSubtreeDepthCapOverride("123.9", 50)).toBe(123);
  });
});

describe("parseStorageBytesThresholdOverride", () => {
  it("null → fallback", () => {
    expect(parseStorageBytesThresholdOverride(null, 4096)).toBe(4096);
  });

  it("below min (256) → clamped up to 256", () => {
    expect(parseStorageBytesThresholdOverride("100", 4096)).toBe(256);
  });

  it("above max (1MB) → clamped down to 1MB", () => {
    expect(parseStorageBytesThresholdOverride("99999999", 4096)).toBe(
      1024 * 1024,
    );
  });

  it("in-range integer → that integer", () => {
    expect(parseStorageBytesThresholdOverride("8192", 4096)).toBe(8192);
  });

  it("non-numeric → fallback", () => {
    expect(parseStorageBytesThresholdOverride("abc", 4096)).toBe(4096);
  });
});

describe("isStoredTreeStateAtDefaults", () => {
  it("everything at default → true", () => {
    expect(
      isStoredTreeStateAtDefaults({
        lastAppliedDepth: 2,
        defaultDepth: 2,
        query: "",
        subtreeDepths: {},
      }),
    ).toBe(true);
  });

  it("depth diff → false", () => {
    expect(
      isStoredTreeStateAtDefaults({
        lastAppliedDepth: 3,
        defaultDepth: 2,
        query: "",
        subtreeDepths: {},
      }),
    ).toBe(false);
  });

  it("non-empty query → false", () => {
    expect(
      isStoredTreeStateAtDefaults({
        lastAppliedDepth: 2,
        defaultDepth: 2,
        query: "x",
        subtreeDepths: {},
      }),
    ).toBe(false);
  });

  it("non-empty subtreeDepths → false", () => {
    expect(
      isStoredTreeStateAtDefaults({
        lastAppliedDepth: 2,
        defaultDepth: 2,
        query: "",
        subtreeDepths: { a: 1 },
      }),
    ).toBe(false);
  });

  it("manual mode (null) when default is integer → false", () => {
    expect(
      isStoredTreeStateAtDefaults({
        lastAppliedDepth: null,
        defaultDepth: 2,
        query: "",
        subtreeDepths: {},
      }),
    ).toBe(false);
  });
});
