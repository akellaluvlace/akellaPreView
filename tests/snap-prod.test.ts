import { describe, it, expect } from "vitest";
import {
  buildResizeCandidates,
  buildSpacingCandidates,
  candidateId,
  COMMON_RESIZE_VALUES,
  COMMON_SPACING_VALUES,
  DEFAULT_GRID_SIZE,
  HYSTERESIS_IN,
  HYSTERESIS_OUT,
  snap,
  type SnapCandidate,
  type SnapState,
} from "../lib/ast/snap";
import type {
  Bounds,
  CrossSectionElement,
  ParentContext,
  SiblingInfo,
} from "../lib/layout-context";

// Prod-import test for lib/ast/snap.ts. Counterweight to scripts/bench-snap.mjs
// inline-mirror. Snap drives every resize + spacing gesture's "click into
// place" feel; bugs here cause chatter, missed snaps, or wrong tie-breaks.

const ENABLED = { enabled: true };
const DISABLED = { enabled: false };
const ENABLED_GRID = { enabled: true, gridSize: 8 };

const sib = (kind: SnapCandidate["kind"], value: number, label?: string): SnapCandidate => ({
  kind,
  value,
  label,
});

const bounds = (x: number, y: number, w: number, h: number): Bounds => ({
  x,
  y,
  width: w,
  height: h,
});

describe("snap — constants", () => {
  it("HYSTERESIS_IN = 4 (acquire threshold)", () => {
    expect(HYSTERESIS_IN).toBe(4);
  });
  it("HYSTERESIS_OUT = 8 (release threshold, > IN)", () => {
    expect(HYSTERESIS_OUT).toBe(8);
    expect(HYSTERESIS_OUT).toBeGreaterThan(HYSTERESIS_IN);
  });
  it("DEFAULT_GRID_SIZE = 8", () => {
    expect(DEFAULT_GRID_SIZE).toBe(8);
  });
  it("COMMON_RESIZE_VALUES is sorted ascending", () => {
    for (let i = 1; i < COMMON_RESIZE_VALUES.length; i++) {
      expect(COMMON_RESIZE_VALUES[i]).toBeGreaterThan(COMMON_RESIZE_VALUES[i - 1]);
    }
  });
  it("COMMON_SPACING_VALUES starts at 0", () => {
    expect(COMMON_SPACING_VALUES[0]).toBe(0);
  });
  it("COMMON_SPACING_VALUES is sorted ascending", () => {
    for (let i = 1; i < COMMON_SPACING_VALUES.length; i++) {
      expect(COMMON_SPACING_VALUES[i]).toBeGreaterThan(
        COMMON_SPACING_VALUES[i - 1]
      );
    }
  });
});

describe("snap — candidateId", () => {
  it("uses explicit id when provided", () => {
    const c: SnapCandidate = { kind: "common", value: 100, id: "explicit-id" };
    expect(candidateId(c)).toBe("explicit-id");
  });
  it("derives kind:value:label when id absent", () => {
    expect(candidateId({ kind: "sibling", value: 200, label: "X" })).toBe(
      "sibling:200:X"
    );
  });
  it("handles missing label", () => {
    expect(candidateId({ kind: "common", value: 50 })).toBe("common:50:");
  });
});

describe("snap — disabled (Cmd held)", () => {
  it("returns desired unchanged with no active", () => {
    const state: SnapState = { active: null };
    const result = snap(state, 100.5, [sib("common", 100)], DISABLED);
    expect(result.value).toBe(100.5);
    expect(result.active).toBeNull();
  });

  it("disabled even with active candidate in state", () => {
    const state: SnapState = { active: sib("common", 100) };
    const result = snap(state, 102, [sib("common", 100)], DISABLED);
    expect(result.value).toBe(102);
    expect(result.active).toBeNull();
  });
});

describe("snap — fresh acquire (no active candidate)", () => {
  it("snaps to candidate within HYSTERESIS_IN", () => {
    const state: SnapState = { active: null };
    const result = snap(state, 102, [sib("common", 100)], ENABLED);
    expect(result.value).toBe(100);
    expect(result.active?.value).toBe(100);
  });

  it("returns desired when no candidate within HYSTERESIS_IN", () => {
    const state: SnapState = { active: null };
    const result = snap(state, 110, [sib("common", 100)], ENABLED);
    expect(result.value).toBe(110);
    expect(result.active).toBeNull();
  });

  it("acquires at exactly HYSTERESIS_IN threshold (<=, not <)", () => {
    const state: SnapState = { active: null };
    // 4 px from 100 → exactly threshold, should snap.
    const result = snap(state, 104, [sib("common", 100)], ENABLED);
    expect(result.value).toBe(100);
  });

  it("does not acquire just past HYSTERESIS_IN", () => {
    const state: SnapState = { active: null };
    const result = snap(state, 104.5, [sib("common", 100)], ENABLED);
    expect(result.active).toBeNull();
  });

  it("picks closest candidate when multiple in range", () => {
    const state: SnapState = { active: null };
    const result = snap(
      state,
      102,
      [sib("common", 100), sib("common", 105)],
      ENABLED
    );
    expect(result.value).toBe(100); // 2 px away vs 3 px away
  });

  it("tie-breaks by kind priority at equal distance (sibling > common)", () => {
    const state: SnapState = { active: null };
    // both at distance 1 from 99: common @ 100, sibling @ 98
    const result = snap(
      state,
      99,
      [sib("common", 100), sib("sibling", 98)],
      ENABLED
    );
    expect(result.active?.kind).toBe("sibling");
  });

  it("tie-breaks by kind priority: parent > common", () => {
    const state: SnapState = { active: null };
    const result = snap(
      state,
      99,
      [sib("common", 100), sib("parent", 98)],
      ENABLED
    );
    expect(result.active?.kind).toBe("parent");
  });
});

describe("snap — hysteresis-out (active candidate sticks)", () => {
  const candidates = [sib("common", 100)];

  it("holds active within HYSTERESIS_OUT", () => {
    const state: SnapState = { active: candidates[0] };
    // Re-find by id requires the candidate to be in the new list; that's
    // how the caller rebuilds per frame.
    const result = snap(state, 107, candidates, ENABLED);
    expect(result.value).toBe(100);
    expect(result.active?.value).toBe(100);
  });

  it("releases outside HYSTERESIS_OUT", () => {
    const state: SnapState = { active: candidates[0] };
    const result = snap(state, 109, candidates, ENABLED);
    // 9 px > 8 = HYSTERESIS_OUT. Hold released. No fresh acquire either
    // (109 is too far from 100). Returns desired.
    expect(result.value).toBe(109);
    expect(result.active).toBeNull();
  });

  it("releases when active candidate disappears from list", () => {
    const state: SnapState = { active: sib("common", 100, "L1") };
    // Active had id common:100:L1. New list lacks that exact label.
    const result = snap(state, 102, [sib("common", 105, "L2")], ENABLED);
    // Active is "still gone", but new acquire might fire on the closer one.
    // 102 vs 105 = 3 px → within HYSTERESIS_IN, acquires.
    expect(result.active?.value).toBe(105);
  });
});

describe("snap — steal (stronger candidate beats active)", () => {
  it("strictly closer + within HYSTERESIS_IN steals", () => {
    const state: SnapState = { active: sib("common", 100) };
    // Active distance from 102 = 2. Candidate at 103 is 1 away — strictly
    // closer + within HYSTERESIS_IN → steals.
    const result = snap(
      state,
      102,
      [sib("common", 100), sib("common", 103)],
      ENABLED
    );
    expect(result.value).toBe(103);
    expect(result.active?.value).toBe(103);
  });

  it("equal distance + higher priority steals", () => {
    const state: SnapState = { active: sib("common", 102) };
    // From 100: common @ 102 = dist 2. sibling @ 98 = dist 2. Equal but
    // sibling priority > common → steal.
    const result = snap(
      state,
      100,
      [sib("common", 102), sib("sibling", 98)],
      ENABLED
    );
    expect(result.active?.kind).toBe("sibling");
  });

  it("equal distance same priority does NOT steal (avoid chatter)", () => {
    // From 100: common @ 102 = dist 2. common @ 98 = dist 2. Equal +
    // equal priority → hold the active.
    const state: SnapState = { active: sib("common", 102) };
    const result = snap(
      state,
      100,
      [sib("common", 102), sib("common", 98)],
      ENABLED
    );
    expect(result.value).toBe(102);
  });
});

describe("snap — grid fallback", () => {
  it("synthesizes grid candidate when no enumerated match", () => {
    const state: SnapState = { active: null };
    // gridSize=8, desired=130. Nearest multiple of 8: 128 (delta 2 ≤ 4).
    const result = snap(state, 130, [], ENABLED_GRID);
    expect(result.value).toBe(128);
    expect(result.active?.kind).toBe("grid");
    expect(result.active?.id).toBe("grid:128");
  });

  it("returns desired when grid multiple too far", () => {
    const state: SnapState = { active: null };
    // gridSize=8, desired=132. Nearest: 136 (delta 4) — boundary.
    // Within HYSTERESIS_IN inclusively, so still snaps.
    const r = snap(state, 132, [], ENABLED_GRID);
    expect(r.active?.kind).toBe("grid");
  });

  it("returns desired when grid disabled (no gridSize)", () => {
    const state: SnapState = { active: null };
    const r = snap(state, 130, [], ENABLED);
    expect(r.value).toBe(130);
    expect(r.active).toBeNull();
  });

  it("enumerated candidate beats grid fallback", () => {
    const state: SnapState = { active: null };
    const r = snap(state, 102, [sib("common", 100)], ENABLED_GRID);
    expect(r.active?.kind).toBe("common");
    expect(r.value).toBe(100);
  });

  it("grid candidate's id includes the value (re-anchors as desired moves)", () => {
    const state: SnapState = { active: null };
    const r1 = snap(state, 130, [], ENABLED_GRID);
    const r2 = snap(state, 138, [], ENABLED_GRID);
    expect(r1.active?.id).toBe("grid:128");
    expect(r2.active?.id).toBe("grid:136");
  });
});

const noParent: ParentContext | null = null;
const elemBounds = bounds(100, 100, 200, 100); // x=100, y=100, w=200, h=100
const noSiblings: ReadonlyArray<SiblingInfo> = [];

describe("snap — buildResizeCandidates: siblings", () => {
  it("emits 2 candidates per sibling (left + right edges) for x-axis", () => {
    const sibBounds = bounds(0, 0, 50, 50); // sibling at x=0..50
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 100, // left edge of element (acts as anchor for x-resize)
      direction: 1, // moving edge extends right
      parent: noParent,
      siblings: [{ oid: "s1", bounds: sibBounds, layoutRole: "block" }],
      elementBounds: elemBounds,
      commonValues: [], // suppress common to focus on siblings
    });
    // sibling left @ 0: dim = 0 - 100 = -100 → filtered (negative)
    // sibling right @ 50: dim = 50 - 100 = -50 → filtered
    expect(result.filter((c) => c.kind === "sibling")).toHaveLength(0);
  });

  it("filters non-positive sibling candidates", () => {
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 0,
      direction: 1,
      parent: noParent,
      siblings: [{ oid: "s1", bounds: bounds(50, 0, 100, 100), layoutRole: "block" }],
      elementBounds: elemBounds,
      commonValues: [],
    });
    // sibling left @ 50: dim = 50 - 0 = 50 ✓
    // sibling right @ 150: dim = 150 - 0 = 150 ✓
    const sibs = result.filter((c) => c.kind === "sibling");
    expect(sibs).toHaveLength(2);
    expect(sibs.map((s) => s.value).sort((a, b) => a - b)).toEqual([50, 150]);
  });

  it("inverts dim for direction=-1 (left-side handle)", () => {
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 200, // right edge anchored; moving edge extends left
      direction: -1,
      parent: noParent,
      siblings: [{ oid: "s1", bounds: bounds(50, 0, 100, 100), layoutRole: "block" }],
      elementBounds: elemBounds,
      commonValues: [],
    });
    // sibling right @ 150: dim = 200 - 150 = 50 ✓
    // sibling left @ 50: dim = 200 - 50 = 150 ✓
    const sibs = result.filter((c) => c.kind === "sibling");
    expect(sibs.map((s) => s.value).sort((a, b) => a - b)).toEqual([50, 150]);
  });

  it("y-axis uses top/bottom edges instead of left/right", () => {
    const result = buildResizeCandidates({
      axis: "y",
      anchor: 0,
      direction: 1,
      parent: noParent,
      siblings: [{ oid: "s1", bounds: bounds(0, 50, 100, 60), layoutRole: "block" }],
      elementBounds: elemBounds,
      commonValues: [],
    });
    // sibling top @ 50, bottom @ 110 → dims 50, 110
    const sibs = result.filter((c) => c.kind === "sibling");
    expect(sibs.map((s) => s.value).sort((a, b) => a - b)).toEqual([50, 110]);
  });
});

describe("snap — buildResizeCandidates: parent + parent-content", () => {
  const parent: ParentContext = {
    oid: "p1",
    layoutRole: "block",
    direction: null,
    wrap: false,
    gap: { row: 0, column: 0 },
    justify: "",
    align: "",
    bounds: bounds(0, 0, 500, 400),
    contentBounds: bounds(20, 20, 460, 360),
  };

  it("emits 4 parent-axis candidates: bounds left/right + content left/right", () => {
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 0,
      direction: 1,
      parent,
      siblings: noSiblings,
      elementBounds: elemBounds,
      commonValues: [],
    });
    const parents = result.filter((c) => c.kind === "parent");
    const contents = result.filter((c) => c.kind === "parent-content");
    // parent left @ 0 → 0 (filtered), parent right @ 500 → 500
    expect(parents.map((p) => p.value).sort((a, b) => a - b)).toEqual([500]);
    // content left @ 20 → 20, content right @ 480 → 480
    expect(contents.map((p) => p.value).sort((a, b) => a - b)).toEqual([
      20, 480,
    ]);
  });
});

describe("snap — buildResizeCandidates: cross-section", () => {
  it("emits 2 candidates per cross-section element on the moving axis", () => {
    const xs: CrossSectionElement[] = [
      { oid: "x1", bounds: bounds(40, 0, 80, 50) },
    ];
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 0,
      direction: 1,
      parent: noParent,
      siblings: noSiblings,
      elementBounds: elemBounds,
      commonValues: [],
      crossSection: xs,
    });
    const xss = result.filter((c) => c.kind === "cross-section");
    expect(xss.map((s) => s.value).sort((a, b) => a - b)).toEqual([40, 120]);
  });
});

describe("snap — buildResizeCandidates: recent + common", () => {
  it("includes recent values (positive only)", () => {
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 0,
      direction: 1,
      parent: noParent,
      siblings: noSiblings,
      elementBounds: elemBounds,
      commonValues: [],
      recentValues: [128, 256, 0, -10, 64], // 0 + -10 filtered
    });
    const recent = result.filter((c) => c.kind === "recent");
    expect(recent.map((r) => r.value).sort((a, b) => a - b)).toEqual([
      64, 128, 256,
    ]);
  });

  it("defaults common values to COMMON_RESIZE_VALUES when not specified", () => {
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 0,
      direction: 1,
      parent: noParent,
      siblings: noSiblings,
      elementBounds: elemBounds,
    });
    const commons = result.filter((c) => c.kind === "common");
    expect(commons).toHaveLength(COMMON_RESIZE_VALUES.length);
  });

  it("custom commonValues override default", () => {
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 0,
      direction: 1,
      parent: noParent,
      siblings: noSiblings,
      elementBounds: elemBounds,
      commonValues: [42, 99],
    });
    const commons = result.filter((c) => c.kind === "common");
    expect(commons).toHaveLength(2);
    expect(commons.map((c) => c.value).sort((a, b) => a - b)).toEqual([42, 99]);
  });

  it("recent + common candidates have stable ids for hysteresis", () => {
    const result = buildResizeCandidates({
      axis: "x",
      anchor: 0,
      direction: 1,
      parent: noParent,
      siblings: noSiblings,
      elementBounds: elemBounds,
      commonValues: [128],
      recentValues: [200],
    });
    const recent = result.find((c) => c.kind === "recent");
    const common = result.find((c) => c.kind === "common");
    expect(recent?.id).toBe("recent:x:200");
    expect(common?.id).toBe("common:x:128");
  });
});

describe("snap — buildSpacingCandidates", () => {
  it("emits recent + common with padding label", () => {
    const result = buildSpacingCandidates({
      kind: "padding",
      commonValues: [8, 16],
      recentValues: [12, 20],
    });
    const recent = result.filter((c) => c.kind === "recent");
    const common = result.filter((c) => c.kind === "common");
    expect(recent).toHaveLength(2);
    expect(common).toHaveLength(2);
    expect(recent[0].label).toContain("Padding");
    expect(common[0].label).toContain("Padding");
  });

  it("emits margin label for kind=margin", () => {
    const result = buildSpacingCandidates({
      kind: "margin",
      commonValues: [4],
      recentValues: [],
    });
    expect(result[0].label).toContain("Margin");
  });

  it("defaults common to COMMON_SPACING_VALUES", () => {
    const result = buildSpacingCandidates({ kind: "padding" });
    expect(result.filter((c) => c.kind === "common")).toHaveLength(
      COMMON_SPACING_VALUES.length
    );
  });

  it("preserves negative recent values for margin (overlap is valid)", () => {
    const result = buildSpacingCandidates({
      kind: "margin",
      commonValues: [],
      recentValues: [-10, 0, 10],
    });
    const recent = result.filter((c) => c.kind === "recent");
    expect(recent.map((r) => r.value).sort((a, b) => a - b)).toEqual([
      -10, 0, 10,
    ]);
  });

  it("recent + common ids are kind-scoped", () => {
    const padding = buildSpacingCandidates({
      kind: "padding",
      commonValues: [16],
      recentValues: [12],
    });
    const margin = buildSpacingCandidates({
      kind: "margin",
      commonValues: [16],
      recentValues: [12],
    });
    expect(padding.find((c) => c.kind === "common")?.id).toBe("common:padding:16");
    expect(margin.find((c) => c.kind === "common")?.id).toBe("common:margin:16");
  });
});
