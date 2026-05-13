// 8th prod-import surge — direct-import tests for `lib/storage-panel.ts`.
// 2144 LOC; focuses on the pure-logic surface (summarize / filter / sort /
// parsers / split-on-match / export round-trip / sanitize filename /
// tryFormatJsonValue / partition by category collapse / filter-history
// parse+serialize). The localStorage-coupled `read*` / `write*` helpers
// are intentionally not exercised here — they're SSR-guarded thin wrappers
// over the parsers below.
//
// Companion to `tests/tree-persistence-prod.test.ts` (which covers the
// tree-state side); together they cover the post-extraction split.

import { describe, it, expect } from "vitest";
import {
  summarizeStoredEntriesByCategory,
  filterStoredEntries,
  sortStoredEntries,
  parseStoragePanelScope,
  parseStoragePanelSort,
  parseStoragePanelFilter,
  parseStoragePanelCollapsedOther,
  parseStoragePanelCollapsedTree,
  parseStoragePanelCollapsedDropin,
  parseStoragePanelPrettyPrint,
  parseStoragePanelHideValues,
  parseStoragePanelValueTruncation,
  splitOnMatchedSubstring,
  buildStoragePanelExport,
  serializeStoragePanelExport,
  parseStoragePanelExportJsonDetail,
  sanitizeStoragePanelExportFilename,
  parseStoragePanelExportFilename,
  tryFormatJsonValue,
  partitionAllEntriesByCategoryCollapse,
  parseStoragePanelFilterHistory,
  serializeStoragePanelFilterHistory,
  parseStoragePanelSnapshot,
  buildStoragePanelSnapshot,
  STORAGE_PANEL_CONSTANTS,
} from "../lib/storage-panel";

const cat = (
  key: string,
  value: string,
  bytes: number,
  category: "tree" | "dropin" | "other",
) => ({ key, value, bytes, category });

describe("§1 summarizeStoredEntriesByCategory", () => {
  it("empty input → all 3 buckets {count:0, bytes:0}", () => {
    const r = summarizeStoredEntriesByCategory([]);
    expect(r).toEqual({
      tree: { count: 0, bytes: 0 },
      dropin: { count: 0, bytes: 0 },
      other: { count: 0, bytes: 0 },
    });
  });

  it("buckets count + bytes correctly across all 3 categories", () => {
    const r = summarizeStoredEntriesByCategory([
      cat("a", "x", 10, "tree"),
      cat("b", "x", 20, "tree"),
      cat("c", "x", 5, "dropin"),
      cat("d", "x", 100, "other"),
    ]);
    expect(r.tree).toEqual({ count: 2, bytes: 30 });
    expect(r.dropin).toEqual({ count: 1, bytes: 5 });
    expect(r.other).toEqual({ count: 1, bytes: 100 });
  });

  it("always returns all 3 categories even when only one is populated", () => {
    const r = summarizeStoredEntriesByCategory([cat("x", "y", 1, "tree")]);
    expect(r.dropin).toEqual({ count: 0, bytes: 0 });
    expect(r.other).toEqual({ count: 0, bytes: 0 });
  });
});

describe("§2 filterStoredEntries — case-insensitive substring on key OR value", () => {
  const entries = [
    cat("dropin:tree:depth:v1", "0", 24, "tree"),
    cat("dropin:tree:expanded:v1", '["abc","def"]', 35, "tree"),
    cat("other:foo", "OID-XYZ", 18, "other"),
  ];

  it("empty query returns a copy of the input", () => {
    const r = filterStoredEntries(entries, "");
    expect(r).toEqual(entries);
    // Fresh copy (not same reference).
    expect(r).not.toBe(entries);
  });

  it("whitespace-only query returns a copy of the input", () => {
    expect(filterStoredEntries(entries, "   ").length).toBe(entries.length);
  });

  it("matches by key (case-insensitive)", () => {
    const r = filterStoredEntries(entries, "DEPTH");
    expect(r.length).toBe(1);
    expect(r[0]!.key).toContain("depth");
  });

  it("matches by value", () => {
    const r = filterStoredEntries(entries, "OID-XYZ");
    expect(r.length).toBe(1);
    expect(r[0]!.key).toBe("other:foo");
  });

  it("trims the query before searching", () => {
    expect(filterStoredEntries(entries, "  depth  ").length).toBe(1);
  });

  it("no matches → empty array", () => {
    expect(filterStoredEntries(entries, "nope")).toEqual([]);
  });
});

describe("§3 sortStoredEntries", () => {
  const entries = [
    cat("zeta", "x", 10, "tree"),
    cat("Alpha", "x", 30, "tree"),
    cat("beta", "x", 20, "tree"),
    cat("alpha", "x", 30, "dropin"), // same bytes as "Alpha"
  ];

  it("'bytes-desc' sorts by bytes descending, then key ascending tie-break", () => {
    const r = sortStoredEntries(entries, "bytes-desc");
    expect(r.map((e) => e.key)).toEqual(["Alpha", "alpha", "beta", "zeta"]);
  });

  it("'name-asc' sorts case-insensitive ascending, deterministic case tie-break", () => {
    const r = sortStoredEntries(entries, "name-asc");
    // "Alpha" / "alpha" tie on case-folded; case-sensitive tie-break
    // sorts uppercase ('A' = 0x41) BEFORE lowercase ('a' = 0x61).
    expect(r.map((e) => e.key)).toEqual(["Alpha", "alpha", "beta", "zeta"]);
  });

  it("returns a fresh array (does not mutate input)", () => {
    const r = sortStoredEntries(entries, "name-asc");
    expect(r).not.toBe(entries);
    expect(entries[0]!.key).toBe("zeta"); // original unchanged
  });

  it("empty input returns empty array", () => {
    expect(sortStoredEntries([], "bytes-desc")).toEqual([]);
  });

  it("single-element input is identity (slice copy)", () => {
    const single = [cat("only", "v", 5, "tree")];
    const r = sortStoredEntries(single, "name-asc");
    expect(r).toEqual(single);
  });
});

describe("§4 simple parsers — strict literal unions / boolean / number", () => {
  it("parseStoragePanelScope: 'tree' / 'all' / fallback default", () => {
    expect(parseStoragePanelScope("tree")).toBe("tree");
    expect(parseStoragePanelScope("all")).toBe("all");
    expect(parseStoragePanelScope("bogus")).toBe("tree"); // default
    expect(parseStoragePanelScope(null)).toBe("tree");
  });

  it("parseStoragePanelSort: 'bytes-desc' / 'name-asc' / fallback", () => {
    expect(parseStoragePanelSort("bytes-desc")).toBe("bytes-desc");
    expect(parseStoragePanelSort("name-asc")).toBe("name-asc");
    expect(parseStoragePanelSort("nope")).toBe("bytes-desc"); // default
    expect(parseStoragePanelSort(null)).toBe("bytes-desc");
  });

  it("parseStoragePanelFilter: null → '', otherwise capped at 256", () => {
    expect(parseStoragePanelFilter(null)).toBe("");
    expect(parseStoragePanelFilter("hello")).toBe("hello");
    expect(parseStoragePanelFilter("x".repeat(500)).length).toBe(256);
  });

  it("parseStoragePanelCollapsedOther: '1'=true, '0'=false, default true", () => {
    expect(parseStoragePanelCollapsedOther("1")).toBe(true);
    expect(parseStoragePanelCollapsedOther("0")).toBe(false);
    expect(parseStoragePanelCollapsedOther(null)).toBe(true);
    expect(parseStoragePanelCollapsedOther("nonsense")).toBe(true);
  });

  it("parseStoragePanelCollapsedTree: defaults to false", () => {
    expect(parseStoragePanelCollapsedTree(null)).toBe(false);
    expect(parseStoragePanelCollapsedTree("1")).toBe(true);
    expect(parseStoragePanelCollapsedTree("0")).toBe(false);
  });

  it("parseStoragePanelCollapsedDropin: defaults to false", () => {
    expect(parseStoragePanelCollapsedDropin(null)).toBe(false);
    expect(parseStoragePanelCollapsedDropin("1")).toBe(true);
  });

  it("parseStoragePanelPrettyPrint + HideValues default to false", () => {
    expect(parseStoragePanelPrettyPrint(null)).toBe(false);
    expect(parseStoragePanelPrettyPrint("1")).toBe(true);
    expect(parseStoragePanelHideValues(null)).toBe(false);
    expect(parseStoragePanelHideValues("1")).toBe(true);
  });
});

describe("§5 parseStoragePanelValueTruncation — number clamp [50, 5000] + floor", () => {
  it("null returns default (200)", () => {
    expect(parseStoragePanelValueTruncation(null)).toBe(200);
  });

  it("empty / whitespace returns default (NOT clamped 0→50)", () => {
    expect(parseStoragePanelValueTruncation("")).toBe(200);
    expect(parseStoragePanelValueTruncation("   ")).toBe(200);
  });

  it("non-finite (NaN, Infinity) returns default", () => {
    expect(parseStoragePanelValueTruncation("NaN")).toBe(200);
    expect(parseStoragePanelValueTruncation("Infinity")).toBe(200);
    expect(parseStoragePanelValueTruncation("not a number")).toBe(200);
  });

  it("below MIN clamps to 50", () => {
    expect(parseStoragePanelValueTruncation("10")).toBe(50);
    expect(parseStoragePanelValueTruncation("-100")).toBe(50);
  });

  it("above MAX clamps to 5000", () => {
    expect(parseStoragePanelValueTruncation("99999")).toBe(5000);
  });

  it("in-range floors to integer", () => {
    expect(parseStoragePanelValueTruncation("123.7")).toBe(123);
    expect(parseStoragePanelValueTruncation("500")).toBe(500);
  });
});

describe("§6 splitOnMatchedSubstring — alternating match/non-match segments", () => {
  it("empty query returns single non-match segment with full text", () => {
    const r = splitOnMatchedSubstring("hello world", "");
    expect(r).toEqual([{ text: "hello world", match: false }]);
  });

  it("empty text returns single non-match empty segment", () => {
    expect(splitOnMatchedSubstring("", "needle")).toEqual([
      { text: "", match: false },
    ]);
  });

  it("query at offset 0 → first segment is a match", () => {
    const r = splitOnMatchedSubstring("hello world", "hello");
    expect(r[0]).toEqual({ text: "hello", match: true });
    expect(r[1]).toEqual({ text: " world", match: false });
  });

  it("preserves original case in match segment (case-insensitive find, case-preserving slice)", () => {
    const r = splitOnMatchedSubstring("HELLO World", "hello");
    expect(r[0]!.text).toBe("HELLO"); // not 'hello'
    expect(r[0]!.match).toBe(true);
  });

  it("multiple non-overlapping matches → alternating segments", () => {
    const r = splitOnMatchedSubstring("abc XX def XX ghi", "XX");
    expect(r).toEqual([
      { text: "abc ", match: false },
      { text: "XX", match: true },
      { text: " def ", match: false },
      { text: "XX", match: true },
      { text: " ghi", match: false },
    ]);
  });

  it("no match → single non-match segment", () => {
    const r = splitOnMatchedSubstring("hello world", "missing");
    expect(r).toEqual([{ text: "hello world", match: false }]);
  });
});

describe("§7 buildStoragePanelExport + serialize + parse round-trip", () => {
  const fixtureEntries = [
    cat("dropin:tree:depth:v1", "0", 24, "tree"),
    cat("other:foo", "bar", 11, "other"),
  ];

  const fixturePanelState = {
    scope: "tree" as const,
    filter: "depth",
    sort: "bytes-desc" as const,
    collapsedOther: true,
  };

  it("buildStoragePanelExport: schemaVersion=1, exportedAt set, total summary correct", () => {
    const r = buildStoragePanelExport(
      fixtureEntries,
      fixturePanelState,
      "2026-05-06T12:00:00.000Z",
    );
    expect(r.schemaVersion).toBe(1);
    expect(r.exportedAt).toBe("2026-05-06T12:00:00.000Z");
    expect(r.summary.total).toEqual({ count: 2, bytes: 35 });
    expect(r.summary.byCategory.tree.count).toBe(1);
    expect(r.summary.byCategory.other.count).toBe(1);
    expect(r.summary.byCategory.dropin.count).toBe(0);
  });

  it("buildStoragePanelExport: panelState carried through verbatim", () => {
    const r = buildStoragePanelExport(
      [],
      fixturePanelState,
      "2026-05-06T12:00:00.000Z",
    );
    expect(r.panelState).toEqual(fixturePanelState);
  });

  it("metadata is omitted when not provided", () => {
    const r = buildStoragePanelExport(
      [],
      fixturePanelState,
      "2026-05-06T12:00:00.000Z",
    );
    expect(r.metadata).toBeUndefined();
  });

  it("metadata is shallow-copied when provided", () => {
    const md = {
      dropinSchemaVersion: 1,
      userAgent: "test-agent",
      appVersion: "0.1.0",
    };
    const r = buildStoragePanelExport(
      [],
      fixturePanelState,
      "2026-05-06T12:00:00.000Z",
      md,
    );
    expect(r.metadata).toEqual(md);
    // Mutate caller's metadata: result should not change.
    md.userAgent = "changed";
    expect(r.metadata!.userAgent).toBe("test-agent");
  });

  it("serializeStoragePanelExport emits indent=2 JSON", () => {
    const r = buildStoragePanelExport(
      [],
      fixturePanelState,
      "2026-05-06T12:00:00.000Z",
    );
    const json = serializeStoragePanelExport(r);
    expect(json).toContain('  "schemaVersion": 1');
    expect(json).toContain('  "exportedAt"');
  });

  it("round-trip: build → serialize → parseStoragePanelExportJsonDetail recovers", () => {
    const built = buildStoragePanelExport(
      fixtureEntries,
      fixturePanelState,
      "2026-05-06T12:00:00.000Z",
    );
    const json = serializeStoragePanelExport(built);
    const parsed = parseStoragePanelExportJsonDetail(json);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind === "ok") {
      expect(parsed.value.schemaVersion).toBe(1);
      expect(parsed.value.entries.length).toBe(2);
      expect(parsed.value.panelState).toEqual(fixturePanelState);
    }
  });

  it("imported summary + per-entry bytes are RE-DERIVED (not trusted from input)", () => {
    // Forge a tampered export with a wrong summary AND a tampered
    // per-entry `bytes`. Audit Domain 6 LOW-F7 — `bytes` is a derived
    // field (always `key.length + value.length`). Parser must recompute
    // both the per-entry bytes AND the summary so the imported result
    // is internally consistent with the invariant honored by every live
    // writer (`describeStoredTreeStateEntries` / `describeAllStoredEntries`).
    const tampered = JSON.stringify({
      schemaVersion: 1,
      exportedAt: "x",
      panelState: fixturePanelState,
      entries: [
        // Tampered: bytes=99 but actual derived value is 1 ("k") + 1 ("v") = 2
        { key: "k", value: "v", bytes: 99, category: "tree" },
      ],
      summary: {
        total: { count: 999, bytes: 999999 }, // also tampered
        byCategory: { tree: { count: 0, bytes: 0 }, dropin: { count: 0, bytes: 0 }, other: { count: 0, bytes: 0 } },
      },
    });
    const parsed = parseStoragePanelExportJsonDetail(tampered);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind === "ok") {
      // F7 invariant: per-entry bytes = key.length + value.length.
      expect(parsed.value.entries[0].bytes).toBe(2);
      // Summary is recomputed from the (recomputed) per-entry bytes.
      expect(parsed.value.summary.total).toEqual({ count: 1, bytes: 2 });
    }
  });

  it("F7 — multi-entry import recomputes bytes for every entry", () => {
    const exp = JSON.stringify({
      schemaVersion: 1,
      exportedAt: "x",
      panelState: fixturePanelState,
      entries: [
        { key: "abc", value: "1234", bytes: 0, category: "tree" }, // actual: 3+4=7
        { key: "x", value: "y", bytes: 9999, category: "dropin" }, // actual: 1+1=2
        { key: "kk", value: "vvvv", bytes: -1, category: "other" }, // actual: 2+4=6
      ],
    });
    const parsed = parseStoragePanelExportJsonDetail(exp);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind === "ok") {
      expect(parsed.value.entries.map((e) => e.bytes)).toEqual([7, 2, 6]);
      expect(parsed.value.summary.total).toEqual({ count: 3, bytes: 15 });
    }
  });

  it("F7 — empty key + empty value yields bytes=0 (not rejected)", () => {
    // Edge case: a "tree" entry with empty strings is unusual but legal.
    // The recomputed bytes is 0 + 0 = 0, which should pass the
    // finite-number check (0 is finite).
    const exp = JSON.stringify({
      schemaVersion: 1,
      exportedAt: "x",
      panelState: fixturePanelState,
      entries: [{ key: "", value: "", bytes: 999, category: "tree" }],
    });
    const parsed = parseStoragePanelExportJsonDetail(exp);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind === "ok") {
      expect(parsed.value.entries[0].bytes).toBe(0);
      expect(parsed.value.summary.total).toEqual({ count: 1, bytes: 0 });
    }
  });
});

describe("§8 parseStoragePanelExportJsonDetail — error reasons", () => {
  it("empty string → reason 'empty'", () => {
    const r = parseStoragePanelExportJsonDetail("");
    expect(r.kind).toBe("error");
    if (r.kind === "error") expect(r.reason).toMatch(/empty/i);
  });

  it("malformed JSON → reason 'malformed JSON'", () => {
    const r = parseStoragePanelExportJsonDetail("{not valid");
    expect(r.kind).toBe("error");
    if (r.kind === "error") expect(r.reason).toMatch(/malformed JSON/i);
  });

  it("non-object root → reason 'root must be a JSON object'", () => {
    const r = parseStoragePanelExportJsonDetail("[1,2,3]");
    expect(r.kind).toBe("error");
    if (r.kind === "error") expect(r.reason).toMatch(/root.*JSON object/i);
  });

  it("wrong schemaVersion → reason includes 'schemaVersion'", () => {
    const r = parseStoragePanelExportJsonDetail(
      JSON.stringify({ schemaVersion: 2 }),
    );
    expect(r.kind).toBe("error");
    if (r.kind === "error") expect(r.reason).toMatch(/schemaVersion/);
  });

  it("invalid panelState.scope → reason includes 'panelState.scope'", () => {
    const r = parseStoragePanelExportJsonDetail(
      JSON.stringify({
        schemaVersion: 1,
        exportedAt: "x",
        panelState: { scope: "bogus", sort: "name-asc", filter: "", collapsedOther: false },
        entries: [],
      }),
    );
    expect(r.kind).toBe("error");
    if (r.kind === "error") expect(r.reason).toMatch(/scope/);
  });
});

describe("§9 sanitizeStoragePanelExportFilename + parseStoragePanelExportFilename", () => {
  it("strips path separators and OS-rejected metachars", () => {
    expect(sanitizeStoragePanelExportFilename(`my/path\\name:test*?"<>|.json`)).toBe(
      "mypathnametest.json",
    );
  });

  it("strips control characters", () => {
    expect(sanitizeStoragePanelExportFilename(`a\x00b\x1fc`)).toBe("abc");
  });

  it("trims leading dots + leading whitespace", () => {
    expect(sanitizeStoragePanelExportFilename("...   foo")).toBe("foo");
  });

  it("trims trailing dots + trailing whitespace", () => {
    expect(sanitizeStoragePanelExportFilename("foo.bar.   ")).toBe("foo.bar");
  });

  it("caps length at 64 chars", () => {
    const long = "x".repeat(100);
    expect(sanitizeStoragePanelExportFilename(long).length).toBe(64);
  });

  it("empty result falls back to 'dropin-tree-storage' default", () => {
    expect(sanitizeStoragePanelExportFilename("////")).toBe("dropin-tree-storage");
    expect(sanitizeStoragePanelExportFilename("...")).toBe("dropin-tree-storage");
  });

  it("idempotent — sanitize(sanitize(x)) === sanitize(x)", () => {
    const s1 = sanitizeStoragePanelExportFilename("foo/bar...test");
    const s2 = sanitizeStoragePanelExportFilename(s1);
    expect(s2).toBe(s1);
  });

  it("parseStoragePanelExportFilename: null → default", () => {
    expect(parseStoragePanelExportFilename(null)).toBe("dropin-tree-storage");
  });

  it("parseStoragePanelExportFilename: defers to sanitize", () => {
    expect(parseStoragePanelExportFilename("my-name")).toBe("my-name");
    expect(parseStoragePanelExportFilename("my/name")).toBe("myname");
  });
});

describe("§10 tryFormatJsonValue — pretty-print only objects + arrays", () => {
  it("returns null on empty / whitespace", () => {
    expect(tryFormatJsonValue("")).toBeNull();
    expect(tryFormatJsonValue("   ")).toBeNull();
  });

  it("returns null on malformed JSON", () => {
    expect(tryFormatJsonValue("{not json")).toBeNull();
  });

  it("returns null on JSON primitives (strings, numbers, booleans, null)", () => {
    expect(tryFormatJsonValue('"plain string"')).toBeNull();
    expect(tryFormatJsonValue("42")).toBeNull();
    expect(tryFormatJsonValue("true")).toBeNull();
    expect(tryFormatJsonValue("null")).toBeNull();
  });

  it("pretty-prints JSON objects with indent=2", () => {
    const r = tryFormatJsonValue('{"a":1,"b":2}');
    expect(r).toContain('  "a": 1');
    expect(r).toContain('  "b": 2');
  });

  it("pretty-prints JSON arrays with indent=2", () => {
    const r = tryFormatJsonValue("[1,2,3]");
    expect(r).toBe("[\n  1,\n  2,\n  3\n]");
  });
});

describe("§11 partitionAllEntriesByCategoryCollapse", () => {
  const entries = [
    cat("k1", "v", 10, "tree"),
    cat("k2", "v", 20, "dropin"),
    cat("k3", "v", 5, "other"),
    cat("k4", "v", 30, "tree"),
  ];

  it("nothing collapsed → all visible, hidden zeroed", () => {
    const r = partitionAllEntriesByCategoryCollapse(entries, {
      tree: false,
      dropin: false,
      other: false,
    });
    expect(r.visible.length).toBe(4);
    expect(r.hidden.tree).toEqual({ count: 0, bytes: 0 });
    expect(r.hidden.dropin).toEqual({ count: 0, bytes: 0 });
    expect(r.hidden.other).toEqual({ count: 0, bytes: 0 });
  });

  it("category 'tree' collapsed → only tree entries hidden, others visible", () => {
    const r = partitionAllEntriesByCategoryCollapse(entries, {
      tree: true,
      dropin: false,
      other: false,
    });
    expect(r.visible.map((e) => e.key)).toEqual(["k2", "k3"]);
    expect(r.hidden.tree).toEqual({ count: 2, bytes: 40 });
    expect(r.hidden.dropin).toEqual({ count: 0, bytes: 0 });
  });

  it("all 3 collapsed → empty visible", () => {
    const r = partitionAllEntriesByCategoryCollapse(entries, {
      tree: true,
      dropin: true,
      other: true,
    });
    expect(r.visible.length).toBe(0);
    expect(r.hidden.tree.count).toBe(2);
    expect(r.hidden.dropin.count).toBe(1);
    expect(r.hidden.other.count).toBe(1);
  });
});

describe("§12 filter history — parse + serialize", () => {
  it("null → empty array", () => {
    expect(parseStoragePanelFilterHistory(null)).toEqual([]);
  });

  it("malformed JSON → empty array (no throw)", () => {
    expect(parseStoragePanelFilterHistory("{not json")).toEqual([]);
  });

  it("non-array root → empty", () => {
    expect(parseStoragePanelFilterHistory('{"not":"array"}')).toEqual([]);
  });

  it("strips empty strings + non-strings", () => {
    expect(
      parseStoragePanelFilterHistory(JSON.stringify(["a", "", 42, "b"])),
    ).toEqual(["a", "b"]);
  });

  it("dedupes case-insensitively (first-seen wins)", () => {
    expect(
      parseStoragePanelFilterHistory(JSON.stringify(["FOO", "foo", "Bar"])),
    ).toEqual(["FOO", "Bar"]);
  });

  it("caps to 8 entries", () => {
    const inputs = Array.from({ length: 20 }, (_, i) => `q${i}`);
    expect(
      parseStoragePanelFilterHistory(JSON.stringify(inputs)).length,
    ).toBe(8);
  });

  it("caps each entry to 256 chars (preserving the truncated prefix)", () => {
    const long = "x".repeat(500);
    const r = parseStoragePanelFilterHistory(JSON.stringify([long]));
    expect(r[0]!.length).toBe(256);
  });

  it("serialize is JSON.stringify of the array", () => {
    expect(serializeStoragePanelFilterHistory(["a", "b"])).toBe('["a","b"]');
  });

  it("round-trip: serialize → parse recovers (with case-fold dedupe)", () => {
    const history = ["foo", "bar"];
    const json = serializeStoragePanelFilterHistory(history);
    const parsed = parseStoragePanelFilterHistory(json);
    expect(parsed).toEqual(history);
  });
});

// Audit F4 follow-up — runtime invariants for the now-tightened
// schemaVersion type (literal `1` instead of `number`). The runtime
// rejection of non-1 versions was already in place; these tests
// codify that invariant so the type-tightening stays load-bearing
// (a future code change that loosens `parseStoragePanelSnapshot`
// will fail here).
describe("§13 StoragePanelSnapshot — schemaVersion invariants", () => {
  it("buildStoragePanelSnapshot stamps schemaVersion=1", () => {
    const s = buildStoragePanelSnapshot([], "2026-05-08T00:00:00Z");
    expect(s.schemaVersion).toBe(1);
  });

  it("parseStoragePanelSnapshot accepts schemaVersion=1", () => {
    const json = JSON.stringify({
      schemaVersion: 1,
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: [],
    });
    const r = parseStoragePanelSnapshot(json);
    expect(r).not.toBeNull();
    expect(r!.schemaVersion).toBe(1);
  });

  it("parseStoragePanelSnapshot returns null for schemaVersion=99", () => {
    const json = JSON.stringify({
      schemaVersion: 99,
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: [],
    });
    expect(parseStoragePanelSnapshot(json)).toBeNull();
  });

  it("parseStoragePanelSnapshot returns null for schemaVersion=0", () => {
    const json = JSON.stringify({
      schemaVersion: 0,
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: [],
    });
    expect(parseStoragePanelSnapshot(json)).toBeNull();
  });

  it("parseStoragePanelSnapshot returns null for missing schemaVersion", () => {
    const json = JSON.stringify({
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: [],
    });
    expect(parseStoragePanelSnapshot(json)).toBeNull();
  });

  it("parseStoragePanelSnapshot returns null for non-numeric schemaVersion", () => {
    const json = JSON.stringify({
      schemaVersion: "1",
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: [],
    });
    expect(parseStoragePanelSnapshot(json)).toBeNull();
  });

  it("buildStoragePanelSnapshot caps entries at MAX_ENTRIES=200", () => {
    const live = Array.from({ length: 250 }, (_, i) => ({
      key: `k${i}`,
      value: "v",
      bytes: 1,
    }));
    const s = buildStoragePanelSnapshot(live, "2026-05-08T00:00:00Z");
    expect(s.entries.length).toBe(200);
    expect(s.entries[0].key).toBe("k0");
    expect(s.entries[199].key).toBe("k199");
  });

  it("buildStoragePanelSnapshot doesn't mutate input", () => {
    const live = [
      { key: "a", value: "x", bytes: 1 },
      { key: "b", value: "y", bytes: 2 },
    ];
    const before = JSON.stringify(live);
    buildStoragePanelSnapshot(live, "2026-05-08T00:00:00Z");
    expect(JSON.stringify(live)).toBe(before);
  });

  it("parseStoragePanelSnapshot floors bytes (drops fractional)", () => {
    const json = JSON.stringify({
      schemaVersion: 1,
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: [{ key: "a", value: "x", bytes: 12.7 }],
    });
    const r = parseStoragePanelSnapshot(json);
    expect(r!.entries[0].bytes).toBe(12);
  });

  it("parseStoragePanelSnapshot skips non-finite bytes entries", () => {
    const json = JSON.stringify({
      schemaVersion: 1,
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: [
        { key: "a", value: "x", bytes: 1 },
        { key: "b", value: "y", bytes: "not a number" },
        { key: "c", value: "z", bytes: 5 },
      ],
    });
    const r = parseStoragePanelSnapshot(json);
    expect(r!.entries.length).toBe(2);
    expect(r!.entries.map((e) => e.key)).toEqual(["a", "c"]);
  });

  it("parseStoragePanelSnapshot returns null for malformed JSON", () => {
    expect(parseStoragePanelSnapshot("{ not valid json")).toBeNull();
  });

  it("parseStoragePanelSnapshot returns null for null input", () => {
    expect(parseStoragePanelSnapshot(null)).toBeNull();
  });

  it("parseStoragePanelSnapshot returns null for non-object root", () => {
    expect(parseStoragePanelSnapshot(JSON.stringify([]))).toBeNull();
    expect(parseStoragePanelSnapshot(JSON.stringify("string"))).toBeNull();
  });

  it("parseStoragePanelSnapshot returns null for missing pinnedAt", () => {
    const json = JSON.stringify({
      schemaVersion: 1,
      entries: [],
    });
    expect(parseStoragePanelSnapshot(json)).toBeNull();
  });

  it("parseStoragePanelSnapshot returns null for non-array entries", () => {
    const json = JSON.stringify({
      schemaVersion: 1,
      pinnedAt: "2026-05-08T00:00:00Z",
      entries: "not an array",
    });
    expect(parseStoragePanelSnapshot(json)).toBeNull();
  });
});

// Audit F6 — `StoragePanelStateKnobs` is the shared shape between
// `StoragePanelExport.panelState` and `StoragePanelRecentImport.panelState`.
// These tests verify that adding a field to one persisted shape forces it
// onto the other (single source of truth) by walking the export/import
// round-trip via shared knobs.
describe("§14 StoragePanelStateKnobs — shared shape between export + recent-import", () => {
  it("export round-trip preserves all 4 knob fields verbatim", () => {
    const knobs = {
      scope: "all" as const,
      filter: "needle",
      sort: "name-asc" as const,
      collapsedOther: true,
    };
    const built = buildStoragePanelExport([], knobs, "2026-05-08T00:00:00Z");
    expect(built.panelState).toEqual(knobs);
    const json = serializeStoragePanelExport(built);
    const r = parseStoragePanelExportJsonDetail(json);
    expect(r.kind).toBe("ok");
    if (r.kind === "ok") {
      expect(r.value.panelState).toEqual(knobs);
    }
  });

  it("invalid scope on import rejects the whole record (knob-strict)", () => {
    const r = parseStoragePanelExportJsonDetail(
      JSON.stringify({
        schemaVersion: 1,
        exportedAt: "2026-05-08T00:00:00Z",
        panelState: {
          scope: "invalid",
          filter: "",
          sort: "name-asc",
          collapsedOther: false,
        },
        entries: [],
      }),
    );
    expect(r.kind).toBe("error");
    if (r.kind === "error") {
      expect(r.reason).toMatch(/scope/);
    }
  });

  it("knob defaults round-trip through buildStoragePanelExport", () => {
    // Canary: the default-tolerant cases for each knob should all flow
    // through a build → serialize → parse round-trip without any field
    // being silently dropped.
    const cases = [
      { scope: "tree" as const, filter: "", sort: "bytes-desc" as const, collapsedOther: false },
      { scope: "all" as const, filter: "abc", sort: "name-asc" as const, collapsedOther: true },
    ];
    for (const knobs of cases) {
      const built = buildStoragePanelExport([], knobs, "2026-05-08T00:00:00Z");
      const r = parseStoragePanelExportJsonDetail(
        serializeStoragePanelExport(built),
      );
      expect(r.kind).toBe("ok");
      if (r.kind === "ok") {
        expect(r.value.panelState).toEqual(knobs);
      }
    }
  });
});

// Audit Domain 5 — `clearAllStoredStoragePanelPreferences` must remove
// every panel-side preference key. Pre-fix the function maintained a
// parallel hard-coded `removeItem(...)` enumeration separate from the
// constants object; new keys could be missed. Now it iterates a single
// derived tuple. These tests verify the tuple stays in sync with the
// constants surface.
describe("§15 STORAGE_PANEL_PREFERENCE_KEYS — wipe-list invariant", () => {
  it("contains every *_KEY value exposed via STORAGE_PANEL_CONSTANTS", () => {
    // Build the expected wipe set: every constant whose name ends in
    // `_KEY`. KEY_NAMESPACE is the parent prefix (not a specific key)
    // so it's excluded.
    const expectedKeys = new Set<string>();
    for (const [name, value] of Object.entries(STORAGE_PANEL_CONSTANTS)) {
      if (name === "KEY_NAMESPACE") continue;
      if (name === "STORAGE_PANEL_PREFERENCE_KEYS") continue;
      if (name.endsWith("_KEY") && typeof value === "string") {
        expectedKeys.add(value);
      }
    }
    const actualKeys = new Set<string>(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_PREFERENCE_KEYS,
    );
    // Every expected key is present in the wipe list (no missed keys).
    for (const k of expectedKeys) {
      expect(actualKeys.has(k)).toBe(true);
    }
    // No phantom keys in the wipe list (no non-existent keys).
    for (const k of actualKeys) {
      expect(expectedKeys.has(k)).toBe(true);
    }
    // Same cardinality → exact equality.
    expect(actualKeys.size).toBe(expectedKeys.size);
  });

  it("each key in the wipe list lives in the dropin:tree namespace", () => {
    // Sanity: no foreign-namespaced key snuck in.
    for (const k of STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_PREFERENCE_KEYS) {
      expect(k.startsWith(STORAGE_PANEL_CONSTANTS.KEY_NAMESPACE)).toBe(true);
    }
  });

  it("wipe list contains no duplicates", () => {
    const list = STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_PREFERENCE_KEYS;
    expect(new Set(list).size).toBe(list.length);
  });
});
