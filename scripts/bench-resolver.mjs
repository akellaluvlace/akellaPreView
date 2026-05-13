// Ad-hoc smoke test for `lib/ast/intent-resolver.ts` resolveResizeIntent
// + basisToStyleProp. Pure logic (no DOM, no React). Inlined here so the
// script runs without a TS build step.
//
// Per CLAUDE.md "no test harnesses unless asked" this is a one-off
// developer-introspection script, not a CI gate. Fire
// `node scripts/bench-resolver.mjs` from repo root after touching the
// resolver. Acceptance criterion #11 from phase2-manipulation.md line
// 273 (flex children resize via flex-basis, not width) lives here as a
// regression check.

function resizeAxesFor(handle) {
  if (handle === "l" || handle === "r") return { width: true, height: false };
  if (handle === "t" || handle === "b") return { width: false, height: true };
  return { width: true, height: true };
}

function aspectLockApplies(handle) {
  return resizeAxesFor(handle).width || resizeAxesFor(handle).height;
}

function resolveResizeIntent(input) {
  const axes = resizeAxesFor(input.handle);
  const preserveAspect =
    input.modifiers.shift && aspectLockApplies(input.handle);
  const from = input.modifiers.alt ? "center" : "opposite-edge";

  const flexAxis =
    input.context.constraints.isFlexGrowing &&
    input.context.parent &&
    input.context.parent.direction !== null
      ? input.context.parent.direction
      : null;

  const intents = [];
  if (axes.width) {
    intents.push({
      kind: "resize-width",
      basis: flexAxis === "row" ? "flex-basis" : "width",
      unit: "px",
      preserveAspect,
      from,
    });
  }
  if (axes.height) {
    intents.push({
      kind: "resize-height",
      basis: flexAxis === "column" ? "flex-basis" : "height",
      unit: "px",
      preserveAspect,
      from,
    });
  }
  return intents;
}

function basisToStyleProp(basis) {
  switch (basis) {
    case "width":
      return "width";
    case "height":
      return "height";
    case "flex-basis":
      return "flexBasis";
    case "min-width":
      return "minWidth";
    case "min-height":
      return "minHeight";
    case "max-width":
      return "maxWidth";
    case "max-height":
      return "maxHeight";
    case "grid-span":
    case "aspect-ratio":
      return null;
  }
}

const NO_MODS = { shift: false, alt: false, cmd: false };

function ctx({ parentRole = "block", direction = null, isFlexGrowing = false } = {}) {
  return {
    oid: "test",
    bounds: { x: 0, y: 0, width: 200, height: 100 },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    layoutRole: "block",
    parent: parentRole === null
      ? null
      : {
          oid: null,
          layoutRole: parentRole,
          direction,
          wrap: false,
          gap: { row: 0, column: 0 },
          justify: "flex-start",
          align: "stretch",
          bounds: { x: 0, y: 0, width: 800, height: 400 },
          contentBounds: { x: 0, y: 0, width: 800, height: 400 },
        },
    constraints: {
      isFlexGrowing,
      flexGrow: isFlexGrowing ? 1 : 0,
      flexShrink: 1,
      flexBasis: "auto",
      isGridSpanning: false,
      gridColumnSpan: 1,
      gridRowSpan: 1,
      aspectRatio: null,
      isImage: false,
      isText: false,
      isLeafNode: false,
    },
    siblings: [],
  };
}

const cases = [
  // --- Plain block child: width/height path. ----
  {
    name: "[resolver] block child + r-handle → basis=width",
    handle: "r",
    context: ctx({ parentRole: "block" }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-width", basis: "width" }],
  },
  {
    name: "[resolver] block child + b-handle → basis=height",
    handle: "b",
    context: ctx({ parentRole: "block" }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-height", basis: "height" }],
  },
  {
    name: "[resolver] block child + br-corner → both width+height",
    handle: "br",
    context: ctx({ parentRole: "block" }),
    modifiers: NO_MODS,
    expect: [
      { kind: "resize-width", basis: "width" },
      { kind: "resize-height", basis: "height" },
    ],
  },
  // --- Flex-row child with flex-grow: width axis routes to flex-basis. ----
  {
    name: "[resolver] flex-row + flex-grow + r-handle → basis=flex-basis (acceptance #11)",
    handle: "r",
    context: ctx({ parentRole: "flex-container", direction: "row", isFlexGrowing: true }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-width", basis: "flex-basis" }],
  },
  {
    name: "[resolver] flex-row + flex-grow + l-handle → basis=flex-basis",
    handle: "l",
    context: ctx({ parentRole: "flex-container", direction: "row", isFlexGrowing: true }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-width", basis: "flex-basis" }],
  },
  {
    name: "[resolver] flex-row + flex-grow + b-handle → basis=height (perpendicular axis stays plain)",
    handle: "b",
    context: ctx({ parentRole: "flex-container", direction: "row", isFlexGrowing: true }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-height", basis: "height" }],
  },
  {
    name: "[resolver] flex-row + flex-grow + br-corner → flex-basis+height",
    handle: "br",
    context: ctx({ parentRole: "flex-container", direction: "row", isFlexGrowing: true }),
    modifiers: NO_MODS,
    expect: [
      { kind: "resize-width", basis: "flex-basis" },
      { kind: "resize-height", basis: "height" },
    ],
  },
  // --- Flex-column child: height axis routes to flex-basis. ----
  {
    name: "[resolver] flex-column + flex-grow + b-handle → basis=flex-basis",
    handle: "b",
    context: ctx({ parentRole: "flex-container", direction: "column", isFlexGrowing: true }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-height", basis: "flex-basis" }],
  },
  {
    name: "[resolver] flex-column + flex-grow + r-handle → basis=width (perpendicular axis stays plain)",
    handle: "r",
    context: ctx({ parentRole: "flex-container", direction: "column", isFlexGrowing: true }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-width", basis: "width" }],
  },
  // --- Flex-row child WITHOUT flex-grow: stays width/height. ----
  {
    name: "[resolver] flex-row + flex-grow=0 + r-handle → basis=width (no flex-basis when not growing)",
    handle: "r",
    context: ctx({ parentRole: "flex-container", direction: "row", isFlexGrowing: false }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-width", basis: "width" }],
  },
  // --- Modifier propagation. ----
  {
    name: "[resolver] flex-row + flex-grow + Shift → preserveAspect=true on flex-basis intent",
    handle: "br",
    context: ctx({ parentRole: "flex-container", direction: "row", isFlexGrowing: true }),
    modifiers: { shift: true, alt: false, cmd: false },
    expect: [
      { kind: "resize-width", basis: "flex-basis", preserveAspect: true, from: "opposite-edge" },
      { kind: "resize-height", basis: "height", preserveAspect: true, from: "opposite-edge" },
    ],
  },
  {
    name: "[resolver] block child + Alt → from=center",
    handle: "br",
    context: ctx({ parentRole: "block" }),
    modifiers: { shift: false, alt: true, cmd: false },
    expect: [
      { kind: "resize-width", basis: "width", preserveAspect: false, from: "center" },
      { kind: "resize-height", basis: "height", preserveAspect: false, from: "center" },
    ],
  },
  // --- Edge cases: missing parent context. ----
  {
    name: "[resolver] no parent context (orphan) + r-handle → basis=width (graceful default)",
    handle: "r",
    context: ctx({ parentRole: null }),
    modifiers: NO_MODS,
    expect: [{ kind: "resize-width", basis: "width" }],
  },
  // --- basisToStyleProp mapping. ----
  {
    name: "[basisToStyleProp] width → 'width'",
    test: () => basisToStyleProp("width") === "width",
  },
  {
    name: "[basisToStyleProp] flex-basis → 'flexBasis'",
    test: () => basisToStyleProp("flex-basis") === "flexBasis",
  },
  {
    name: "[basisToStyleProp] min-width → 'minWidth'",
    test: () => basisToStyleProp("min-width") === "minWidth",
  },
  {
    name: "[basisToStyleProp] grid-span → null (operation engine missing)",
    test: () => basisToStyleProp("grid-span") === null,
  },
  {
    name: "[basisToStyleProp] aspect-ratio → null (operation engine missing)",
    test: () => basisToStyleProp("aspect-ratio") === null,
  },
];

let passed = 0;
let failed = 0;

for (const c of cases) {
  if (typeof c.test === "function") {
    const ok = !!c.test();
    console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
    if (ok) passed++;
    else failed++;
    continue;
  }
  const got = resolveResizeIntent({
    handle: c.handle,
    context: c.context,
    modifiers: c.modifiers,
  });
  let ok = got.length === c.expect.length;
  if (ok) {
    for (let i = 0; i < c.expect.length; i++) {
      const e = c.expect[i];
      const g = got[i];
      if (g.kind !== e.kind) ok = false;
      if (g.basis !== e.basis) ok = false;
      if ("preserveAspect" in e && g.preserveAspect !== e.preserveAspect) ok = false;
      if ("from" in e && g.from !== e.from) ok = false;
    }
  }
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  if (!ok) {
    console.log(`    got     : ${JSON.stringify(got)}`);
    console.log(`    expected: ${JSON.stringify(c.expect)}`);
    failed++;
  } else {
    passed++;
  }
}

console.log(`\n${passed}/${cases.length} passed${failed ? `, ${failed} FAILED` : ""}`);
process.exit(failed > 0 ? 1 : 0);
