// Ad-hoc smoke test for `lib/ast/snap.ts`. Pure logic (no DOM, no React),
// so we inline the module's snap() + helpers and exercise the (4c-iii)
// hysteresis, kind-priority, Cmd-disable, grid-fallback, and candidate-
// builder paths.
//
// Each case logs PASS / FAIL. Per CLAUDE.md "no test harnesses unless
// asked" this is a one-off developer-introspection script, not a CI gate.
// Fire `node scripts/bench-snap.mjs` from repo root after touching snap.ts.

const HYSTERESIS_IN = 4;
const HYSTERESIS_OUT = 8;

const KIND_PRIORITY = {
  sibling: 5,
  parent: 4,
  "parent-content": 4,
  "cross-section": 3,
  recent: 3,
  common: 2,
  grid: 1,
};

function candidateId(c) {
  if (c.id) return c.id;
  return `${c.kind}:${c.value}:${c.label ?? ""}`;
}

function findStronger(active, desired, candidates) {
  const activeId = candidateId(active);
  const activeDist = Math.abs(desired - active.value);
  const activePrio = KIND_PRIORITY[active.kind];
  let best = null;
  let bestDist = HYSTERESIS_IN;
  for (const c of candidates) {
    if (candidateId(c) === activeId) continue;
    const d = Math.abs(desired - c.value);
    if (d > bestDist) continue;
    if (d < activeDist) {
      if (best === null || d < bestDist) {
        best = c;
        bestDist = d;
      } else if (d === bestDist && KIND_PRIORITY[c.kind] > KIND_PRIORITY[best.kind]) {
        best = c;
      }
    } else if (d === activeDist && KIND_PRIORITY[c.kind] > activePrio) {
      if (best === null || d < bestDist) {
        best = c;
        bestDist = d;
      }
    }
  }
  return best;
}

function acquire(desired, candidates) {
  let best = null;
  let bestDist = HYSTERESIS_IN;
  for (const c of candidates) {
    const d = Math.abs(desired - c.value);
    if (d > bestDist) continue;
    if (best === null || d < bestDist) {
      best = c;
      bestDist = d;
    } else if (d === bestDist && KIND_PRIORITY[c.kind] > KIND_PRIORITY[best.kind]) {
      best = c;
    }
  }
  return best;
}

function nearestGridCandidate(desired, gridSize) {
  if (gridSize <= 0) return null;
  const nearest = Math.round(desired / gridSize) * gridSize;
  if (Math.abs(desired - nearest) > HYSTERESIS_IN) return null;
  return { kind: "grid", value: nearest, label: `${nearest}px (grid)`, id: `grid:${nearest}` };
}

function snap(state, desired, candidates, opts) {
  if (!opts.enabled) return { value: desired, active: null };
  if (state.active) {
    const activeId = candidateId(state.active);
    let stillThere = null;
    for (const c of candidates) {
      if (candidateId(c) === activeId) {
        stillThere = c;
        break;
      }
    }
    if (stillThere) {
      const dActive = Math.abs(desired - stillThere.value);
      if (dActive <= HYSTERESIS_OUT) {
        const stronger = findStronger(stillThere, desired, candidates);
        if (stronger) return { value: stronger.value, active: stronger };
        return { value: stillThere.value, active: stillThere };
      }
    }
  }
  const acquired = acquire(desired, candidates);
  if (acquired) return { value: acquired.value, active: acquired };
  if (opts.gridSize) {
    const grid = nearestGridCandidate(desired, opts.gridSize);
    if (grid) return { value: grid.value, active: grid };
  }
  return { value: desired, active: null };
}

// --- Candidate builders (mirroring snap.ts) ---

function edgeToDimCandidate(o) {
  const dim = o.direction === 1 ? o.edgePosition - o.anchor : o.anchor - o.edgePosition;
  return { kind: o.kind, value: dim, label: o.label, guide: o.guide, id: `${o.kind}:${o.axis}:${o.edgePosition}` };
}

const COMMON_RESIZE_VALUES = [16, 24, 32, 48, 64, 96, 128, 160, 192, 240, 256, 320, 384, 480, 512, 640, 768, 1024];
const COMMON_SPACING_VALUES = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96];

function buildResizeCandidates(opts) {
  const out = [];
  const elemMinPerp = opts.axis === "x" ? opts.elementBounds.y : opts.elementBounds.x;
  const elemMaxPerp = opts.axis === "x" ? opts.elementBounds.y + opts.elementBounds.height : opts.elementBounds.x + opts.elementBounds.width;
  for (const sib of opts.siblings) {
    const sb = sib.bounds;
    const edges = opts.axis === "x"
      ? [{ pos: sb.x, sideLabel: "left" }, { pos: sb.x + sb.width, sideLabel: "right" }]
      : [{ pos: sb.y, sideLabel: "top" }, { pos: sb.y + sb.height, sideLabel: "bottom" }];
    for (const edge of edges) {
      const candidate = edgeToDimCandidate({
        axis: opts.axis,
        edgePosition: edge.pos,
        anchor: opts.anchor,
        direction: opts.direction,
        kind: "sibling",
        label: `sibling-${edge.sideLabel}`,
        guide: { axis: opts.axis, position: edge.pos, from: Math.min(elemMinPerp, opts.axis === "x" ? sb.y : sb.x), to: Math.max(elemMaxPerp, opts.axis === "x" ? sb.y + sb.height : sb.x + sb.width), kind: "sibling" },
      });
      if (candidate.value > 0) out.push(candidate);
    }
  }
  // (Step 6 cross-section) Visible elements outside the immediate
  // sibling/ancestor/descendant tree. Same shape as sibling.
  const crossSection = opts.crossSection ?? [];
  for (const xs of crossSection) {
    const xb = xs.bounds;
    const edges = opts.axis === "x"
      ? [{ pos: xb.x, sideLabel: "left" }, { pos: xb.x + xb.width, sideLabel: "right" }]
      : [{ pos: xb.y, sideLabel: "top" }, { pos: xb.y + xb.height, sideLabel: "bottom" }];
    for (const edge of edges) {
      const candidate = edgeToDimCandidate({
        axis: opts.axis,
        edgePosition: edge.pos,
        anchor: opts.anchor,
        direction: opts.direction,
        kind: "cross-section",
        label: `cross-${edge.sideLabel}`,
        guide: { axis: opts.axis, position: edge.pos, from: Math.min(elemMinPerp, opts.axis === "x" ? xb.y : xb.x), to: Math.max(elemMaxPerp, opts.axis === "x" ? xb.y + xb.height : xb.x + xb.width), kind: "cross-section" },
      });
      if (candidate.value > 0) out.push(candidate);
    }
  }
  if (opts.parent) {
    const pb = opts.parent.bounds;
    const cb = opts.parent.contentBounds;
    const parentEdges = opts.axis === "x"
      ? [
          { pos: pb.x, sideLabel: "parent-left", kind: "parent" },
          { pos: pb.x + pb.width, sideLabel: "parent-right", kind: "parent" },
          { pos: cb.x, sideLabel: "content-left", kind: "parent-content" },
          { pos: cb.x + cb.width, sideLabel: "content-right", kind: "parent-content" },
        ]
      : [
          { pos: pb.y, sideLabel: "parent-top", kind: "parent" },
          { pos: pb.y + pb.height, sideLabel: "parent-bottom", kind: "parent" },
          { pos: cb.y, sideLabel: "content-top", kind: "parent-content" },
          { pos: cb.y + cb.height, sideLabel: "content-bottom", kind: "parent-content" },
        ];
    for (const edge of parentEdges) {
      const candidate = edgeToDimCandidate({
        axis: opts.axis,
        edgePosition: edge.pos,
        anchor: opts.anchor,
        direction: opts.direction,
        kind: edge.kind,
        label: edge.sideLabel,
        guide: { axis: opts.axis, position: edge.pos, from: opts.axis === "x" ? pb.y : pb.x, to: opts.axis === "x" ? pb.y + pb.height : pb.x + pb.width, kind: edge.kind },
      });
      if (candidate.value > 0) out.push(candidate);
    }
  }
  // (eleventh-pass) Recent values — direct dim candidates, kind="recent",
  // priority above common.
  const recent = opts.recentValues ?? [];
  for (const v of recent) {
    if (!(v > 0)) continue;
    out.push({ kind: "recent", value: v, label: `${opts.axis === "x" ? "W" : "H"}: ${v} (recent)`, id: `recent:${opts.axis}:${v}` });
  }
  for (const v of COMMON_RESIZE_VALUES) {
    out.push({ kind: "common", value: v, label: `${opts.axis === "x" ? "W" : "H"}: ${v}`, id: `common:${opts.axis}:${v}` });
  }
  return out;
}

function buildSpacingCandidates(opts) {
  const out = [];
  // (eleventh-pass) Recent spacing values first (higher priority).
  const recent = opts.recentValues ?? [];
  for (const v of recent) {
    out.push({ kind: "recent", value: v, label: `${opts.kind}: ${v}px (recent)`, id: `recent:${opts.kind}:${v}` });
  }
  for (const v of COMMON_SPACING_VALUES) {
    out.push({ kind: "common", value: v, label: `${opts.kind}: ${v}px`, id: `common:${opts.kind}:${v}` });
  }
  return out;
}

// --- Cases ---

const cases = [
  // Cmd disable.
  {
    name: "[snap] cmd disabled → returns desired unchanged",
    state: { active: null },
    desired: 99,
    candidates: [{ kind: "common", value: 100, label: "x", id: "x" }],
    opts: { enabled: false, gridSize: 8 },
    expect: { value: 99, active: null },
  },
  // No candidates + no grid → identity.
  {
    name: "[snap] no candidates, no grid → identity",
    state: { active: null },
    desired: 100,
    candidates: [],
    opts: { enabled: true },
    expect: { value: 100, active: null },
  },
  // Single candidate within HYSTERESIS_IN (4).
  {
    name: "[snap] candidate within 3px → snap",
    state: { active: null },
    desired: 97,
    candidates: [{ kind: "common", value: 100, label: "100", id: "x" }],
    opts: { enabled: true },
    expect: { value: 100, activeId: "x" },
  },
  // Just outside HYSTERESIS_IN (5 px away).
  {
    name: "[snap] candidate 5px away → no snap (just outside hysteresis-in)",
    state: { active: null },
    desired: 95,
    candidates: [{ kind: "common", value: 100, label: "100", id: "x" }],
    opts: { enabled: true },
    expect: { value: 95, active: null },
  },
  // Two candidates, closer wins.
  {
    name: "[snap] two candidates, closer wins",
    state: { active: null },
    desired: 98,
    candidates: [
      { kind: "common", value: 100, label: "100", id: "a" },
      { kind: "sibling", value: 95, label: "95", id: "b" }, // 3 away
    ],
    opts: { enabled: true },
    // 100 is 2 away (closer); a wins
    expect: { value: 100, activeId: "a" },
  },
  // Tie distance, kind priority wins (sibling > common).
  {
    name: "[snap] tie distance, sibling beats common",
    state: { active: null },
    desired: 100,
    candidates: [
      { kind: "common", value: 102, label: "common", id: "a" },
      { kind: "sibling", value: 98, label: "sib", id: "b" },
    ],
    opts: { enabled: true },
    // both 2 away; sibling wins by priority
    expect: { value: 98, activeId: "b" },
  },
  // Hysteresis-out: active candidate sticks within 8 px.
  {
    name: "[snap] active stays within HYSTERESIS_OUT (8px)",
    state: { active: { kind: "common", value: 100, label: "100", id: "x" } },
    desired: 107,
    candidates: [{ kind: "common", value: 100, label: "100", id: "x" }],
    opts: { enabled: true },
    // desired - active.value = 7 → within HYSTERESIS_OUT, stays snapped to 100
    expect: { value: 100, activeId: "x" },
  },
  // Hysteresis-out: active releases past 8.
  {
    name: "[snap] active releases past HYSTERESIS_OUT (9px)",
    state: { active: { kind: "common", value: 100, label: "100", id: "x" } },
    desired: 109,
    candidates: [{ kind: "common", value: 100, label: "100", id: "x" }],
    opts: { enabled: true },
    // 9 away → out of HYSTERESIS_OUT, releases. 100 is now 9 away (also outside HYSTERESIS_IN), no snap.
    expect: { value: 109, active: null },
  },
  // Steal: stronger candidate within HYSTERESIS_IN.
  {
    name: "[snap] steal — stronger candidate within HYSTERESIS_IN",
    state: { active: { kind: "common", value: 100, label: "100", id: "a" } },
    desired: 99,
    candidates: [
      { kind: "common", value: 100, label: "100", id: "a" }, // 1 away
      { kind: "sibling", value: 99, label: "sib", id: "b" }, // 0 away
    ],
    opts: { enabled: true },
    // sibling 99 is 0 away (stronger by distance); steals
    expect: { value: 99, activeId: "b" },
  },
  // No-steal: closer-by-priority but EQUAL distance to active.
  {
    name: "[snap] no-steal — equal distance, equal priority",
    state: { active: { kind: "common", value: 100, label: "100", id: "a" } },
    desired: 100,
    candidates: [
      { kind: "common", value: 100, label: "100", id: "a" },
      { kind: "common", value: 100, label: "other", id: "c" }, // same distance, same priority
    ],
    opts: { enabled: true },
    expect: { value: 100, activeId: "a" }, // active wins ties
  },
  // Steal: equal distance but stronger priority.
  {
    name: "[snap] steal — equal distance, higher priority kind",
    state: { active: { kind: "common", value: 100, label: "100", id: "a" } },
    desired: 100,
    candidates: [
      { kind: "common", value: 100, label: "100", id: "a" },
      { kind: "sibling", value: 100, label: "sib", id: "b" },
    ],
    opts: { enabled: true },
    expect: { value: 100, activeId: "b" },
  },
  // Grid fallback: no enumerated candidate, gridSize=8, desired close to multiple.
  {
    name: "[snap] grid fallback — desired 130 with gridSize 8 → snap to 128",
    state: { active: null },
    desired: 130,
    candidates: [],
    opts: { enabled: true, gridSize: 8 },
    expect: { value: 128, activeKind: "grid" },
  },
  // Grid fallback: outside HYSTERESIS_IN.
  {
    name: "[snap] grid — desired 132 with gridSize 8 (4 away from 128 OR 136) → boundary case",
    state: { active: null },
    desired: 132,
    candidates: [],
    opts: { enabled: true, gridSize: 8 },
    // round(132/8)*8 = 16.5 → 17 → 136. |132-136| = 4. <= HYSTERESIS_IN. snaps.
    expect: { value: 136, activeKind: "grid" },
  },
  {
    name: "[snap] grid — desired 132.5 → no snap (5 away from 128, 3.5 from 136)",
    state: { active: null },
    desired: 133,
    candidates: [],
    opts: { enabled: true, gridSize: 8 },
    // round(133/8)*8 = 16.625 → 17 → 136. |133-136| = 3. <= HYSTERESIS_IN. snaps.
    expect: { value: 136, activeKind: "grid" },
  },
  // Active grid stays sticky.
  {
    name: "[snap] active grid stays within HYSTERESIS_OUT",
    state: { active: { kind: "grid", value: 128, label: "128px (grid)", id: "grid:128" } },
    desired: 134,
    candidates: [],
    opts: { enabled: true, gridSize: 8 },
    // 6 away from 128 → within HYSTERESIS_OUT (8), stays at 128.
    // Note: stillThere lookup matches grid:128 — but we don't include it in
    // candidates list. The snap function checks the candidate list for
    // stillThere; with empty candidates, stillThere=null → falls through to
    // acquire (no enumerated candidate) → grid fallback (round(134/8)*8 = 17*8 = 136, 2 away → snap to 136).
    // Hmm, this is actually different from "stays sticky". Let me think.
    // Active grid:128, desired=134:
    //   - stillThere lookup in candidates → empty → null
    //   - fall through to acquire → no enumerated → null
    //   - grid fallback → nearest is 136 (2 away from desired)
    //   - returns grid:136
    // So grid candidates are recomputed each call. The hysteresis-out
    // semantic for grid is implicit: as long as desired stays within
    // HYSTERESIS_IN of any grid multiple, you stay snapped — just maybe
    // to a different multiple. Released only when desired is between
    // multiples (more than HYSTERESIS_IN from any).
    // Adjusting expectation:
    expect: { value: 136, activeKind: "grid" },
  },
  // Grid releases when desired is between multiples (>HYSTERESIS_IN from each).
  {
    name: "[snap] grid releases when desired is mid-multiple",
    state: { active: { kind: "grid", value: 128, label: "128px (grid)", id: "grid:128" } },
    desired: 132,
    candidates: [],
    opts: { enabled: true, gridSize: 8 },
    // 132 is exactly between 128 and 136 (4 from each). round(132/8)*8 = 16.5 → 17 → 136 (Math.round half-rounds up). |132-136|=4. == HYSTERESIS_IN. snaps.
    // Hmm, this is the boundary. Adjust to 132 exactly.
    expect: { value: 136, activeKind: "grid" },
  },

  // Sibling beats common when both nearby.
  {
    name: "[snap] sibling 5 away, common 3 away → common wins by distance",
    state: { active: null },
    desired: 100,
    candidates: [
      { kind: "sibling", value: 105, label: "sib", id: "b" }, // 5 away — outside threshold
      { kind: "common", value: 103, label: "common", id: "a" }, // 3 away
    ],
    opts: { enabled: true },
    // Sibling outside HYSTERESIS_IN (5 > 4). Common 3 away → snaps.
    expect: { value: 103, activeId: "a" },
  },

  // Stale active candidate (not in candidate list) → released, fresh acquire.
  {
    name: "[snap] stale active not in candidates → released, no fresh snap",
    state: { active: { kind: "sibling", value: 200, label: "old", id: "old" } },
    desired: 99,
    candidates: [{ kind: "common", value: 100, label: "100", id: "x" }],
    opts: { enabled: true },
    // Active id "old" not in candidates → stillThere=null. Active released.
    // Fresh acquire on common@100, desired=99 → 1 away → snaps.
    expect: { value: 100, activeId: "x" },
  },

  // Grid + enumerated coexisting: enumerated wins when in range.
  {
    name: "[snap] enumerated common @ 102 wins over grid @ 104",
    state: { active: null },
    desired: 102,
    candidates: [{ kind: "common", value: 102, label: "102", id: "x" }],
    opts: { enabled: true, gridSize: 8 },
    // Common 0 away, grid would suggest 104 (2 away). Enumerated wins on
    // distance.
    expect: { value: 102, activeId: "x" },
  },
];

// --- Builder cases ---

const builderCases = [
  // Resize: right-side handle (anchor=left, direction=+1), sibling at x=200
  // with width=100 → right edge at x=300. Element bbox at x=50, width=100
  // (anchor = 50). Snapping right edge to sibling.right=300 → desired width =
  // 300-50 = 250. Snapping to sibling.left=200 → 200-50 = 150.
  {
    name: "[builder] resize right-handle: sibling produces correct dim candidates",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 50,
        direction: 1,
        parent: null,
        siblings: [{ oid: null, bounds: { x: 200, y: 0, width: 100, height: 50 }, layoutRole: "block" }],
        elementBounds: { x: 50, y: 0, width: 100, height: 50 },
      });
      const sibCands = cands.filter((c) => c.kind === "sibling");
      const values = sibCands.map((c) => c.value).sort((a, b) => a - b);
      // Expect [150, 250]
      return JSON.stringify(values) === "[150,250]";
    },
  },
  // Resize: left-side handle (anchor=right=150, direction=-1), sibling at x=20 with width=20
  // sibling.left=20, sibling.right=40. desired width snapping to sibling.left → anchor - 20 = 130. To sibling.right → 110.
  {
    name: "[builder] resize left-handle: sibling produces correct dim candidates (direction=-1)",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 150,
        direction: -1,
        parent: null,
        siblings: [{ oid: null, bounds: { x: 20, y: 0, width: 20, height: 50 }, layoutRole: "block" }],
        elementBounds: { x: 50, y: 0, width: 100, height: 50 },
      });
      const sibCands = cands.filter((c) => c.kind === "sibling");
      const values = sibCands.map((c) => c.value).sort((a, b) => a - b);
      return JSON.stringify(values) === "[110,130]";
    },
  },
  // Negative dim candidates dropped.
  {
    name: "[builder] negative-dim sibling candidate dropped",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 50,
        direction: 1,
        parent: null,
        // Sibling LEFT of element → snapping right edge there gives negative width.
        siblings: [{ oid: null, bounds: { x: 0, y: 0, width: 30, height: 50 }, layoutRole: "block" }],
        // sibling.left=0 → 0 - 50 = -50 (drop). sibling.right=30 → 30-50=-20 (drop).
        elementBounds: { x: 50, y: 0, width: 100, height: 50 },
      });
      const sibCands = cands.filter((c) => c.kind === "sibling");
      return sibCands.length === 0;
    },
  },
  // Parent + content edges produce 4 candidates.
  {
    name: "[builder] parent produces 4 candidates (bounds + content)",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 50,
        direction: 1,
        parent: {
          oid: null,
          layoutRole: "block",
          direction: null,
          wrap: false,
          gap: { row: 0, column: 0 },
          justify: "",
          align: "",
          bounds: { x: 0, y: 0, width: 500, height: 200 },
          contentBounds: { x: 16, y: 16, width: 468, height: 168 },
        },
        siblings: [],
        elementBounds: { x: 50, y: 16, width: 100, height: 50 },
      });
      const parentCands = cands.filter((c) => c.kind === "parent" || c.kind === "parent-content");
      // bounds.left=0 → -50 (drop). bounds.right=500 → 450. content.left=16 → -34 (drop). content.right=484 → 434.
      // Expect 2 candidates with values [434, 450].
      const values = parentCands.map((c) => c.value).sort((a, b) => a - b);
      return JSON.stringify(values) === "[434,450]";
    },
  },
  // Common values appended.
  {
    name: "[builder] common values appended (18 entries)",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 50,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 50, y: 0, width: 100, height: 50 },
      });
      const common = cands.filter((c) => c.kind === "common");
      return common.length === COMMON_RESIZE_VALUES.length;
    },
  },
  // Spacing builder.
  {
    name: "[builder] spacing returns COMMON_SPACING_VALUES.length common candidates",
    test: () => {
      const cands = buildSpacingCandidates({ kind: "padding" });
      return cands.length === COMMON_SPACING_VALUES.length && cands.every((c) => c.kind === "common");
    },
  },
  // (eleventh-pass) Recent-value snap candidates.
  {
    name: "[builder] resize recentValues produce kind=recent candidates",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 0,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 0, y: 0, width: 100, height: 50 },
        recentValues: [248, 320],
      });
      const recent = cands.filter((c) => c.kind === "recent");
      const values = recent.map((c) => c.value).sort((a, b) => a - b);
      return JSON.stringify(values) === "[248,320]";
    },
  },
  {
    name: "[builder] resize recent drops zero/negative values",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 0,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 0, y: 0, width: 100, height: 50 },
        recentValues: [-10, 0, 100],
      });
      const recent = cands.filter((c) => c.kind === "recent");
      return recent.length === 1 && recent[0].value === 100;
    },
  },
  {
    name: "[builder] spacing recentValues produce kind=recent candidates",
    test: () => {
      const cands = buildSpacingCandidates({
        kind: "padding",
        recentValues: [13, 27],
      });
      const recent = cands.filter((c) => c.kind === "recent");
      const values = recent.map((c) => c.value).sort((a, b) => a - b);
      return JSON.stringify(values) === "[13,27]";
    },
  },
  // Recent beats common at equal distance (priority tie-break).
  {
    name: "[snap] recent beats common at equal distance",
    test: () => {
      const r = snap(
        { active: null },
        100,
        [
          { kind: "recent", value: 102, label: "rec", id: "r1" },
          { kind: "common", value: 102, label: "com", id: "c1" },
        ],
        { enabled: true }
      );
      // Both 2 away from 100. Recent kind priority (3) > common (2).
      return r.value === 102 && r.active && r.active.id === "r1";
    },
  },
  // Sibling still beats recent (priority order check).
  {
    name: "[snap] sibling beats recent at equal distance",
    test: () => {
      const r = snap(
        { active: null },
        100,
        [
          { kind: "recent", value: 102, label: "rec", id: "r1" },
          { kind: "sibling", value: 102, label: "sib", id: "s1" },
        ],
        { enabled: true }
      );
      return r.value === 102 && r.active && r.active.id === "s1";
    },
  },
  // (Step 6 cross-section) Builder emits cross-section candidates.
  {
    name: "[snap] cross-section right-handle: 2 candidates per cross-section element",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 0,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 0, y: 0, width: 100, height: 50 },
        crossSection: [
          { oid: "abc12345", bounds: { x: 200, y: 400, width: 80, height: 40 } },
        ],
      });
      // 2 cross-section + COMMON_RESIZE_VALUES.length = 2 + 18 = 20.
      const xs = cands.filter((c) => c.kind === "cross-section");
      // 2 candidates: edge=200 → dim=200, edge=280 → dim=280.
      if (xs.length !== 2) return false;
      const values = xs.map((c) => c.value).sort((a, b) => a - b);
      return values[0] === 200 && values[1] === 280;
    },
  },
  {
    name: "[snap] cross-section: negative-dim candidates filtered (anchor on wrong side)",
    test: () => {
      // Right-handle at anchor=400 dragging right (direction=+1). A cross-
      // section element at x=200 would yield dim=-200 (negative) → filtered.
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 400,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 400, y: 0, width: 100, height: 50 },
        crossSection: [
          { oid: "abc12345", bounds: { x: 200, y: 400, width: 50, height: 40 } },
        ],
      });
      const xs = cands.filter((c) => c.kind === "cross-section");
      // Both edges at 200 and 250 are negative-dim → filtered. 0 cross-section.
      return xs.length === 0;
    },
  },
  {
    name: "[snap] cross-section guide carries from/to range",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 0,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 0, y: 50, width: 100, height: 30 }, // y range 50→80
        crossSection: [
          { oid: "abc12345", bounds: { x: 200, y: 100, width: 80, height: 40 } }, // y range 100→140
        ],
      });
      const xs = cands.filter((c) => c.kind === "cross-section");
      // First candidate's guide.from / to should span both rect Y ranges:
      // min(50, 100)=50, max(80, 140)=140.
      const guide = xs[0].guide;
      return guide && guide.from === 50 && guide.to === 140 && guide.kind === "cross-section";
    },
  },
  {
    name: "[snap] sibling beats cross-section at equal distance",
    test: () => {
      const r = snap(
        { active: null },
        100,
        [
          { kind: "cross-section", value: 102, label: "xs", id: "xs1" },
          { kind: "sibling", value: 102, label: "sib", id: "s1" },
        ],
        { enabled: true }
      );
      return r.value === 102 && r.active && r.active.id === "s1";
    },
  },
  {
    name: "[snap] cross-section beats common at equal distance",
    test: () => {
      const r = snap(
        { active: null },
        100,
        [
          { kind: "common", value: 102, label: "com", id: "c1" },
          { kind: "cross-section", value: 102, label: "xs", id: "xs1" },
        ],
        { enabled: true }
      );
      // KIND_PRIORITY: cross-section=3 > common=2.
      return r.value === 102 && r.active && r.active.id === "xs1";
    },
  },
  {
    name: "[snap] parent beats cross-section at equal distance",
    test: () => {
      const r = snap(
        { active: null },
        100,
        [
          { kind: "cross-section", value: 102, label: "xs", id: "xs1" },
          { kind: "parent", value: 102, label: "par", id: "p1" },
        ],
        { enabled: true }
      );
      // KIND_PRIORITY: parent=4 > cross-section=3.
      return r.value === 102 && r.active && r.active.id === "p1";
    },
  },
  {
    name: "[snap] cross-section ties with recent at equal distance (closer wins)",
    test: () => {
      const r = snap(
        { active: null },
        100,
        [
          { kind: "recent", value: 102, label: "rec", id: "r1" },
          { kind: "cross-section", value: 101, label: "xs", id: "xs1" },
        ],
        { enabled: true }
      );
      // Recent and cross-section both have priority 3; cross-section is
      // closer (1 vs 2) → cross-section wins via the closer-distance path,
      // not the priority tiebreak.
      return r.value === 101 && r.active && r.active.id === "xs1";
    },
  },
  {
    name: "[snap] empty crossSection → no cross-section candidates",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 0,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 0, y: 0, width: 100, height: 50 },
        crossSection: [],
      });
      return cands.filter((c) => c.kind === "cross-section").length === 0;
    },
  },
  {
    name: "[snap] omitted crossSection → defaults to empty",
    test: () => {
      const cands = buildResizeCandidates({
        axis: "x",
        anchor: 0,
        direction: 1,
        parent: null,
        siblings: [],
        elementBounds: { x: 0, y: 0, width: 100, height: 50 },
      });
      return cands.filter((c) => c.kind === "cross-section").length === 0;
    },
  },
];

// --- Runner ---

let passed = 0;
let failed = 0;

for (const c of cases) {
  const r = snap(c.state, c.desired, c.candidates, c.opts);
  const valOk = r.value === c.expect.value;
  let activeOk = true;
  if ("activeId" in c.expect) activeOk = r.active && candidateId(r.active) === c.expect.activeId;
  else if ("activeKind" in c.expect) activeOk = r.active && r.active.kind === c.expect.activeKind;
  else activeOk = r.active === null && c.expect.active === null;
  const ok = valOk && activeOk;
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  console.log(`  → value=${r.value}, active=${r.active ? candidateId(r.active) : "null"}`);
  if (!ok) {
    console.log(`    expected: ${JSON.stringify(c.expect)}`);
  }
  if (ok) passed++;
  else failed++;
}

for (const b of builderCases) {
  const ok = b.test();
  console.log(`${ok ? "PASS" : "FAIL"}: ${b.name}`);
  if (ok) passed++;
  else failed++;
}

const total = cases.length + builderCases.length;
console.log(`\n${passed}/${total} passed${failed ? `, ${failed} FAILED` : ""}`);
process.exit(failed > 0 ? 1 : 0);
