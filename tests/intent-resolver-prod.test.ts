import { describe, it, expect } from "vitest";
import {
  basisToStyleProp,
  oppositeSpacingSide,
  resizeAxesFor,
  resolveResizeIntent,
  resolveSpacingIntent,
  spacingHandleKind,
  spacingHandleSide,
  type DragModifiers,
  type ResizeBasis,
  type SpacingHandle,
} from "../lib/ast/intent-resolver";
import type { LayoutContext } from "../lib/layout-context";

// Prod-import test for lib/ast/intent-resolver.ts. Counterweight to the
// bench inline-mirror anti-pattern (scripts/bench-resolver.mjs inlines its
// own copy). All exports are pure functions.

const NO_MODS: DragModifiers = { alt: false, shift: false, cmd: false };
const SHIFT: DragModifiers = { alt: false, shift: true, cmd: false };
const ALT: DragModifiers = { alt: true, shift: false, cmd: false };
const ALT_SHIFT: DragModifiers = { alt: true, shift: true, cmd: false };

const zeroBounds = { x: 0, y: 0, width: 0, height: 0 };
const zeroBoxOffsets = { top: 0, right: 0, bottom: 0, left: 0 };

function buildLayoutContext(opts: {
  isFlexGrowing?: boolean;
  parentDirection?: "row" | "column" | null;
}): LayoutContext {
  const { isFlexGrowing = false, parentDirection = null } = opts;
  return {
    oid: "test-oid",
    bounds: zeroBounds,
    padding: zeroBoxOffsets,
    margin: zeroBoxOffsets,
    layoutRole: "block",
    parent: parentDirection !== undefined
      ? {
          oid: null,
          layoutRole: "block",
          direction: parentDirection,
          wrap: false,
          gap: { row: 0, column: 0 },
          justify: "",
          align: "",
          bounds: zeroBounds,
          contentBounds: zeroBounds,
        }
      : null,
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
    crossSection: [],
  };
}

describe("intent-resolver — spacingHandleSide", () => {
  it("maps padding handles to side names", () => {
    expect(spacingHandleSide("pt")).toBe("top");
    expect(spacingHandleSide("pr")).toBe("right");
    expect(spacingHandleSide("pb")).toBe("bottom");
    expect(spacingHandleSide("pl")).toBe("left");
  });
  it("maps margin handles to side names", () => {
    expect(spacingHandleSide("mt")).toBe("top");
    expect(spacingHandleSide("mr")).toBe("right");
    expect(spacingHandleSide("mb")).toBe("bottom");
    expect(spacingHandleSide("ml")).toBe("left");
  });
});

describe("intent-resolver — spacingHandleKind", () => {
  it("classifies p* as padding", () => {
    expect(spacingHandleKind("pt")).toBe("padding");
    expect(spacingHandleKind("pr")).toBe("padding");
    expect(spacingHandleKind("pb")).toBe("padding");
    expect(spacingHandleKind("pl")).toBe("padding");
  });
  it("classifies m* as margin", () => {
    expect(spacingHandleKind("mt")).toBe("margin");
    expect(spacingHandleKind("mr")).toBe("margin");
    expect(spacingHandleKind("mb")).toBe("margin");
    expect(spacingHandleKind("ml")).toBe("margin");
  });
});

describe("intent-resolver — oppositeSpacingSide", () => {
  it("pairs sides correctly (involution)", () => {
    expect(oppositeSpacingSide("top")).toBe("bottom");
    expect(oppositeSpacingSide("bottom")).toBe("top");
    expect(oppositeSpacingSide("left")).toBe("right");
    expect(oppositeSpacingSide("right")).toBe("left");
  });
  it("is its own inverse", () => {
    const sides = ["top", "right", "bottom", "left"] as const;
    for (const s of sides) {
      expect(oppositeSpacingSide(oppositeSpacingSide(s))).toBe(s);
    }
  });
});

describe("intent-resolver — resizeAxesFor", () => {
  it("l/r are width-only", () => {
    expect(resizeAxesFor("l")).toEqual({ width: true, height: false });
    expect(resizeAxesFor("r")).toEqual({ width: true, height: false });
  });
  it("t/b are height-only", () => {
    expect(resizeAxesFor("t")).toEqual({ width: false, height: true });
    expect(resizeAxesFor("b")).toEqual({ width: false, height: true });
  });
  it("corners are both", () => {
    expect(resizeAxesFor("tl")).toEqual({ width: true, height: true });
    expect(resizeAxesFor("br")).toEqual({ width: true, height: true });
  });
});

describe("intent-resolver — resolveResizeIntent (4b baseline)", () => {
  it("br corner emits both width + height with basis=width/height", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    expect(intents).toHaveLength(2);
    expect(intents[0].kind).toBe("resize-width");
    expect(intents[0].basis).toBe("width");
    expect(intents[1].kind).toBe("resize-height");
    expect(intents[1].basis).toBe("height");
  });

  it("r edge emits width only", () => {
    const intents = resolveResizeIntent({
      handle: "r",
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    expect(intents).toHaveLength(1);
    expect(intents[0].kind).toBe("resize-width");
    expect(intents[0].basis).toBe("width");
  });

  it("t edge emits height only", () => {
    const intents = resolveResizeIntent({
      handle: "t",
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    expect(intents).toHaveLength(1);
    expect(intents[0].kind).toBe("resize-height");
    expect(intents[0].basis).toBe("height");
  });

  it("always emits unit=px in v1", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    for (const i of intents) expect(i.unit).toBe("px");
  });
});

describe("intent-resolver — resolveResizeIntent (Shift aspect lock)", () => {
  it("shift sets preserveAspect=true", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({}),
      modifiers: SHIFT,
    });
    for (const i of intents) expect(i.preserveAspect).toBe(true);
  });
  it("no shift = preserveAspect=false", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    for (const i of intents) expect(i.preserveAspect).toBe(false);
  });
});

describe("intent-resolver — resolveResizeIntent (Alt center-resize)", () => {
  it("alt sets from='center'", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({}),
      modifiers: ALT,
    });
    for (const i of intents) expect(i.from).toBe("center");
  });
  it("no alt = from='opposite-edge'", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    for (const i of intents) expect(i.from).toBe("opposite-edge");
  });
  it("alt + shift combine (preserveAspect=true, from=center)", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({}),
      modifiers: ALT_SHIFT,
    });
    for (const i of intents) {
      expect(i.from).toBe("center");
      expect(i.preserveAspect).toBe(true);
    }
  });
});

describe("intent-resolver — resolveResizeIntent (flex-basis)", () => {
  it("flex-row child: width intent uses flex-basis", () => {
    const intents = resolveResizeIntent({
      handle: "r",
      context: buildLayoutContext({
        isFlexGrowing: true,
        parentDirection: "row",
      }),
      modifiers: NO_MODS,
    });
    expect(intents).toHaveLength(1);
    expect(intents[0].basis).toBe("flex-basis");
  });

  it("flex-row child: height intent stays plain height (axis mismatch)", () => {
    const intents = resolveResizeIntent({
      handle: "b",
      context: buildLayoutContext({
        isFlexGrowing: true,
        parentDirection: "row",
      }),
      modifiers: NO_MODS,
    });
    expect(intents[0].basis).toBe("height");
  });

  it("flex-column child: height intent uses flex-basis", () => {
    const intents = resolveResizeIntent({
      handle: "b",
      context: buildLayoutContext({
        isFlexGrowing: true,
        parentDirection: "column",
      }),
      modifiers: NO_MODS,
    });
    expect(intents[0].basis).toBe("flex-basis");
  });

  it("flex-column child: width intent stays plain width", () => {
    const intents = resolveResizeIntent({
      handle: "r",
      context: buildLayoutContext({
        isFlexGrowing: true,
        parentDirection: "column",
      }),
      modifiers: NO_MODS,
    });
    expect(intents[0].basis).toBe("width");
  });

  it("non-flex-growing: never returns flex-basis even in row parent", () => {
    const intents = resolveResizeIntent({
      handle: "r",
      context: buildLayoutContext({
        isFlexGrowing: false,
        parentDirection: "row",
      }),
      modifiers: NO_MODS,
    });
    expect(intents[0].basis).toBe("width");
  });

  it("br corner in flex-row: width=flex-basis, height=height", () => {
    const intents = resolveResizeIntent({
      handle: "br",
      context: buildLayoutContext({
        isFlexGrowing: true,
        parentDirection: "row",
      }),
      modifiers: NO_MODS,
    });
    expect(intents[0].basis).toBe("flex-basis");
    expect(intents[1].basis).toBe("height");
  });
});

describe("intent-resolver — basisToStyleProp", () => {
  it("maps standard basis values to camelCase style props", () => {
    expect(basisToStyleProp("width")).toBe("width");
    expect(basisToStyleProp("height")).toBe("height");
    expect(basisToStyleProp("flex-basis")).toBe("flexBasis");
    expect(basisToStyleProp("min-width")).toBe("minWidth");
    expect(basisToStyleProp("min-height")).toBe("minHeight");
    expect(basisToStyleProp("max-width")).toBe("maxWidth");
    expect(basisToStyleProp("max-height")).toBe("maxHeight");
  });
  it("returns null for unsupported bases", () => {
    expect(basisToStyleProp("grid-span")).toBeNull();
    expect(basisToStyleProp("aspect-ratio")).toBeNull();
  });
  it("covers all enum members", () => {
    const allBases: ResizeBasis[] = [
      "width",
      "height",
      "flex-basis",
      "grid-span",
      "min-width",
      "min-height",
      "max-width",
      "max-height",
      "aspect-ratio",
    ];
    for (const b of allBases) {
      // Should never throw — exhaustive switch.
      basisToStyleProp(b);
    }
  });
});

describe("intent-resolver — resolveSpacingIntent", () => {
  it("returns adjust-padding for p* handles", () => {
    const intent = resolveSpacingIntent({
      handle: "pt" as SpacingHandle,
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    expect(intent.kind).toBe("adjust-padding");
    expect(intent.unit).toBe("px");
    expect(intent.symmetric).toBe(false);
    expect(intent.sides).toEqual(["top"]);
  });

  it("returns adjust-margin for m* handles", () => {
    const intent = resolveSpacingIntent({
      handle: "mr",
      context: buildLayoutContext({}),
      modifiers: NO_MODS,
    });
    expect(intent.kind).toBe("adjust-margin");
    expect(intent.sides).toEqual(["right"]);
  });

  it("alt = symmetric, includes opposite side", () => {
    const intent = resolveSpacingIntent({
      handle: "pt",
      context: buildLayoutContext({}),
      modifiers: ALT,
    });
    expect(intent.symmetric).toBe(true);
    expect(intent.sides).toEqual(["top", "bottom"]);
  });

  it("alt on margin: symmetric + opposite side", () => {
    const intent = resolveSpacingIntent({
      handle: "ml",
      context: buildLayoutContext({}),
      modifiers: ALT,
    });
    expect(intent.kind).toBe("adjust-margin");
    expect(intent.sides).toEqual(["left", "right"]);
    expect(intent.symmetric).toBe(true);
  });
});
