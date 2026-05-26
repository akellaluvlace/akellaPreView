"use client";

import dynamic from "next/dynamic";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ElementLoc, ElementSelection, Tool } from "@/lib/iframe-bridge";
import type { PreviewKind } from "@/lib/preview";
import ToolBar from "./ToolBar";
import LibraryModal from "./library/LibraryModal";
import type {
  SidebarInsertContext,
  SidebarSwapContext,
} from "./library/Sidebar";
import { readSourceStyle } from "@/lib/ast/style-source-read";
import { extractJsxElement, isClassNameDynamic } from "@/lib/source-patch-jsx";
import {
  parseSseFrame,
  parseServerStreamPayload,
  splitSseFrames,
} from "@/lib/sse";
import {
  RadiusSection,
  SizingSection,
  SpacingSection,
} from "./ast/PropertiesPanel";
import BackgroundEditor from "./BackgroundEditor";
import {
  ALIGN,
  ALIGN_MATCH,
  BORDER_WIDTH,
  DISPLAYS,
  DISPLAY_MATCH,
  FLEX_DIRECTIONS,
  FLEX_DIRECTION_MATCH,
  FONT_SIZE,
  FONT_WEIGHT,
  HEIGHT_MATCH,
  HEIGHT_PRESETS,
  JUSTIFY,
  JUSTIFY_MATCH,
  LINE_HEIGHT,
  OPACITY,
  RADIUS,
  SHADOW,
  TEXT_ALIGNS,
  TEXT_ALIGN_MATCH,
  TRACKING,
  WIDTH_MATCH,
  WIDTH_PRESETS,
  alignClass,
  breakpointPrefix,
  colorMatch,
  currentIndex,
  displayClass,
  flexDirectionClass,
  heightClass,
  justifyClass,
  pickArbitraryHex,
  setColorClass,
  setScale,
  setToken,
  spacingProp,
  textAlignClass,
  unsetColorClass,
  unsetScale,
  widthClass,
  type Breakpoint,
  type ScaleProp,
} from "@/lib/tailwind-slider-maps";
import { findPaletteClass, nearbyPaletteName } from "@/lib/tailwind-palette";
import { wcagSummary, type WcagTier } from "@/lib/contrast";
import { FONTS } from "@/lib/fonts";
import {
  applyPresetVariant,
  customToStylePreset,
  extractPresetClasses,
  getCustomPresetsForTag,
  getPresetCategoriesForTag,
  inferShapeForTag,
  loadCustomPresets,
  presetVariantCount,
  saveCustomPresets,
  type CustomPreset,
  type StylePreset,
} from "@/lib/style-presets";
import EyedropperButton from "./EyedropperButton";

const IsolatedPreview = dynamic(() => import("./IsolatedPreview"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-soft text-xs font-mono uppercase tracking-[0.2em] text-muted">
      Loading focused preview…
    </div>
  ),
});

// Same gate pattern as Workspace / Preview. Mount + close are the only
// always-on tracks (they bracket a select interaction); everything else
// is debug-only.
const DEBUG_LOGS = false;
function log(msg: string, data?: unknown) {
  if (DEBUG_LOGS) console.log(`[dropin:FocusEditor] ${msg}`, data ?? "");
}
function track(msg: string, data?: unknown) {
  console.log(`[dropin:FocusEditor] ${msg}`, data ?? "");
}

interface FocusEditorProps {
  selection: ElementSelection;
  code: string;
  kind: PreviewKind;
  // Phase 5 / A6: active breakpoint. Inspector reads strip the prefix; writes
  // prepend it. "desktop" = no prefix (Tailwind's mobile-first base cascade).
  breakpoint: Breakpoint;
  // Phase 5 / Phase B / B4: active tool. Shared with the workspace via
  // a single source of truth in Workspace.tsx — switching tools inside
  // FocusEditor updates Workspace's `tool` state. The 4-tool toolbar
  // here omits View (the user is explicitly in edit mode); pressing
  // Done / Esc / Back returns to the workspace + resets to View
  // (handled in Workspace's `handleCloseFocus`).
  tool: Tool;
  onToolChange: (next: Tool) => void;
  onClassChange: (loc: ElementLoc, newClassString: string) => void;
  onAttrSet: (loc: ElementLoc, key: string, value: string) => void;
  onAttrRemove: (loc: ElementLoc, key: string) => void;
  onTextChange: (loc: ElementLoc, newText: string) => void;
  // Phase 1 OID-primary handle: callers must pass the breadcrumb entry's
  // own OID (not just the loc) so Workspace can update both fields on the
  // selection. Prior to this, Workspace stamped the new loc onto the
  // existing selection's oid → stale-OID mismatch when the iframe's
  // reselect tried OID lookup first and found the previous element.
  onBreadcrumbSelect: (loc: ElementLoc, oid: string | null) => void;
  onDuplicate: (loc: ElementLoc) => void;
  onDelete: (loc: ElementLoc) => void;
  onCopyElement: (loc: ElementLoc) => void;
  // Phase 2 Step 9 (Properties Panel) commit. Routes through
  // `applyStyleProps` in Workspace. `null` value REMOVES a prop,
  // `undefined` is reserved as "leave alone". Optional so the
  // existing FocusEditor consumers (just Workspace today) don't
  // have to be updated all at once if a future caller appears.
  // When omitted, the new sections render but commits no-op.
  onSetStyleProps?: (
    oid: string,
    declarations: Record<string, string | null | undefined>
  ) => boolean;
  onClose: () => void;
  // Phase 5 / Phase C / C1.4 + C2.3 — Insert / Swap inside isolated mode.
  // Workspace owns the structural-edit state machine (insertTargetOid,
  // tool, selection.oid) and renders the canvas-side library sidebar; in
  // isolated mode there is no rail, so the same context flows through
  // here and FocusEditor mounts `<LibraryModal>` instead. The Workspace
  // builds the SidebarInsertContext / SidebarSwapContext objects from
  // its own state — FocusEditor is a passthrough.
  insertContext?: SidebarInsertContext | null;
  swapContext?: SidebarSwapContext | null;
  // Iframe → host: insert hit-test result. The IsolatedPreview iframe
  // emits `dropin:insert-target-confirmed` on click while in insert
  // mode; FocusEditor pipes it up so Workspace can stash the parent OID
  // and the LibraryModal opens with the right insertContext on the next
  // render.
  onInsertTarget?: (oid: string, tag: string) => void;
  // Library tile clicks (Insert / Swap / Palette) route through these.
  // Same handlers Workspace passes to its canvas-side Sidebar — the
  // modal is just a different host for the same underlying flows.
  // Twenty-third pass — `onSwapWith` accepts an optional preserve-
  // children flag from the Sidebar's "Keep children" toggle.
  onInsertInto?: (parentOid: string, assetText: string) => void;
  // Phase 6 ramp — multi-target Insert dispatch. Pipes through to
  // LibraryModal → Sidebar when `insertContext.additionalParentOids`
  // is non-empty.
  onInsertIntoMulti?: (parentOids: string[], assetText: string) => void;
  onSwapWith?: (
    targetOid: string,
    assetText: string,
    preserveChildren?: boolean
  ) => void;
  onApplyPalette?: (paletteId: string) => void;
  // Cancel handlers — close the modal by clearing Workspace state.
  // They don't touch FocusEditor itself; the modal unmounts when its
  // parent context props transition back to null.
  onCancelInsert?: () => void;
  onCancelSwap?: () => void;
  // Toast bridge for the LibraryModal's onWarn passthrough so library
  // bails surface in the same Workspace toast stack as everything else.
  onWarn?: (message: string) => void;
}

type ViewMode = "isolated" | "in-page";

// ROADMAP §3.4 — smart section order. The right pane has ~10 reorderable
// sections; vibe coders shouldn't see Typography first when they clicked
// an image, or Image first when they clicked a flex container. The
// heuristic returns a "promoted" prefix; remaining sections fall in
// after in their original order. Properties Panel (sizing/spacing_panel/
// radius), the warning banner / tip / contrast chip, and Advanced are
// pinned (panel always after fixed bits, Advanced always last).
const ALL_REORDERABLE_SECTIONS = [
  "text",
  "background",
  "text_color",
  "typography",
  "spacing",
  "border",
  "effects",
  "layout",
  "size",
  "image",
] as const;
type ReorderableSection = (typeof ALL_REORDERABLE_SECTIONS)[number];

const FORM_TAGS: ReadonlySet<string> = new Set([
  "input",
  "button",
  "a",
  "select",
  "textarea",
  "label",
]);
const TEXT_TAGS: ReadonlySet<string> = new Set([
  "p",
  "span",
  "li",
  "strong",
  "em",
  "blockquote",
  "code",
  "pre",
  "small",
  "figcaption",
]);
const CONTAINER_TAGS: ReadonlySet<string> = new Set([
  "div",
  "section",
  "main",
  "header",
  "footer",
  "nav",
  "aside",
  "article",
  "ul",
  "ol",
  "form",
]);

// Tags whose CHILDREN are commonly icons/badges/avatars (where the
// surrounding container's context matters more than the child's own
// shape). Used by the sub-element heuristic to refine the order when
// a container's child is a leaf-ish tag like img / svg / span.
const INTERACTIVE_PARENTS: ReadonlySet<string> = new Set([
  "button",
  "a",
  "label",
  "summary",
]);
const LIST_OR_MEDIA_PARENTS: ReadonlySet<string> = new Set([
  "li",
  "figure",
  "picture",
]);

export function computeSectionOrder(
  tag: string,
  isFlex: boolean,
  hasOnlyTextChildren: boolean,
  // Eighteenth-pass — sub-element heuristic. When provided, the parent
  // context refines the child's order. The two motivating cases:
  //  · An `<img>` / `<svg>` inside a `<button>` / `<a>` is almost always
  //    an icon — the user typically wants spacing (margin between icon
  //    and label) and size (icon size) before image attrs.
  //  · A `<span>` / `<p>` inside an interactive parent is button label
  //    text — text + typography + text-color win, spacing second.
  // Optional so the existing 3-arg call sites keep working unchanged.
  parentTag?: string | null,
): ReadonlyArray<ReorderableSection> {
  const t = tag.toLowerCase();
  const pt = parentTag ? parentTag.toLowerCase() : null;
  let promoted: ReorderableSection[] = [];

  // Sub-element refinements — fire BEFORE the bare-tag rules so the
  // parent context wins when both could apply (e.g. img with no parent
  // context still hits the image rule below; img inside button hits
  // here first).
  if (
    pt &&
    (t === "img" || t === "svg" || t === "picture") &&
    INTERACTIVE_PARENTS.has(pt)
  ) {
    // Icon inside a button-shaped parent. User wants size / spacing
    // first (icon size + icon-text gap), then the image attrs.
    promoted = ["size", "spacing", "image", "effects", "background", "border"];
  } else if (
    pt &&
    (t === "span" || t === "p" || t === "strong" || t === "em") &&
    INTERACTIVE_PARENTS.has(pt)
  ) {
    // Label text inside an interactive parent. Text + typography +
    // color first (button label visuals), spacing for icon gaps.
    promoted = ["text", "typography", "text_color", "spacing", "background"];
  } else if (
    pt &&
    (t === "img" || t === "svg" || t === "picture") &&
    LIST_OR_MEDIA_PARENTS.has(pt)
  ) {
    // Image inside a list item / figure / picture. The image IS the
    // content of the parent, so image attrs win — but spacing creeps
    // up because list item icons commonly need margin tweaks.
    promoted = ["image", "size", "spacing", "effects", "border"];
  }

  // Bare-tag rules (existing behaviour) — fire only if the
  // sub-element refinements above didn't match.
  if (promoted.length === 0) {
    if (t === "img" || t === "picture" || t === "svg") {
      promoted = ["image", "size", "effects", "background", "border"];
    } else if (FORM_TAGS.has(t)) {
      promoted = [
        "typography",
        "text_color",
        "background",
        "border",
        "effects",
      ];
    } else if (CONTAINER_TAGS.has(t) && isFlex) {
      promoted = ["layout", "size", "spacing"];
    } else if (
      hasOnlyTextChildren ||
      /^h[1-6]$/.test(t) ||
      TEXT_TAGS.has(t)
    ) {
      promoted = ["text", "typography", "text_color", "background"];
    }
  }

  if (promoted.length === 0) return ALL_REORDERABLE_SECTIONS;
  const seen = new Set<string>(promoted);
  const tail = ALL_REORDERABLE_SECTIONS.filter((k) => !seen.has(k));
  return [...promoted, ...tail];
}

// Relevance filter — drop sections that don't apply to the element's
// kind. Companion to computeSectionOrder: order picks which sections
// rank highest, relevance picks which sections render at all. The
// pinned* flags gate the pixel-precise SizingSection / SpacingSection /
// RadiusSection above the reorderable region.
//
// Rule of thumb: text-only elements have no border, radius, layout, or
// image semantics — those controls are noise. Images don't have text /
// typography / text-color. Flex containers shape children, not their
// own type.
export interface SectionRelevance {
  reorderable: ReadonlySet<ReorderableSection>;
  pinnedSizing: boolean;
  pinnedSpacing: boolean;
  pinnedRadius: boolean;
}

const ALL_REORDERABLE_SET: ReadonlySet<ReorderableSection> = new Set(
  ALL_REORDERABLE_SECTIONS,
);

const RELEVANT_DEFAULT: SectionRelevance = {
  reorderable: ALL_REORDERABLE_SET,
  pinnedSizing: true,
  pinnedSpacing: true,
  pinnedRadius: true,
};

const RELEVANT_TEXT: SectionRelevance = {
  reorderable: new Set<ReorderableSection>([
    "text",
    "typography",
    "text_color",
    "background",
    "spacing",
    "effects",
    "size",
  ]),
  pinnedSizing: true,
  pinnedSpacing: true,
  // border-radius doesn't apply to text — that was the user's specific
  // example of "controls that have nothing to do with the selection".
  // Keep it off for text-only elements.
  pinnedRadius: false,
};

const RELEVANT_IMAGE: SectionRelevance = {
  reorderable: new Set<ReorderableSection>([
    "image",
    "size",
    "spacing",
    "effects",
    "border",
    "background",
  ]),
  pinnedSizing: true,
  pinnedSpacing: true,
  pinnedRadius: true,
};

const RELEVANT_FORM: SectionRelevance = {
  reorderable: new Set<ReorderableSection>([
    "typography",
    "text_color",
    "background",
    "border",
    "effects",
    "spacing",
    "size",
  ]),
  pinnedSizing: true,
  pinnedSpacing: true,
  pinnedRadius: true,
};

const RELEVANT_FLEX_CONTAINER: SectionRelevance = {
  reorderable: new Set<ReorderableSection>([
    "layout",
    "size",
    "spacing",
    "background",
    "border",
    "effects",
  ]),
  pinnedSizing: true,
  pinnedSpacing: true,
  pinnedRadius: true,
};

const RELEVANT_ICON_IN_INTERACTIVE: SectionRelevance = {
  reorderable: new Set<ReorderableSection>([
    "size",
    "spacing",
    "image",
    "effects",
  ]),
  pinnedSizing: true,
  pinnedSpacing: true,
  pinnedRadius: false,
};

const RELEVANT_TEXT_IN_INTERACTIVE: SectionRelevance = {
  reorderable: new Set<ReorderableSection>([
    "text",
    "typography",
    "text_color",
    "spacing",
    "background",
  ]),
  pinnedSizing: false,
  pinnedSpacing: true,
  pinnedRadius: false,
};

export function computeSectionRelevance(
  tag: string,
  isFlex: boolean,
  hasOnlyTextChildren: boolean,
  parentTag?: string | null,
): SectionRelevance {
  const t = tag.toLowerCase();
  const pt = parentTag ? parentTag.toLowerCase() : null;

  if (
    pt &&
    (t === "img" || t === "svg" || t === "picture") &&
    INTERACTIVE_PARENTS.has(pt)
  ) {
    return RELEVANT_ICON_IN_INTERACTIVE;
  }
  if (
    pt &&
    (t === "span" || t === "p" || t === "strong" || t === "em") &&
    INTERACTIVE_PARENTS.has(pt)
  ) {
    return RELEVANT_TEXT_IN_INTERACTIVE;
  }
  if (t === "img" || t === "picture" || t === "svg") {
    return RELEVANT_IMAGE;
  }
  if (FORM_TAGS.has(t)) {
    return RELEVANT_FORM;
  }
  if (CONTAINER_TAGS.has(t) && isFlex) {
    return RELEVANT_FLEX_CONTAINER;
  }
  if (hasOnlyTextChildren || /^h[1-6]$/.test(t) || TEXT_TAGS.has(t)) {
    return RELEVANT_TEXT;
  }
  return RELEVANT_DEFAULT;
}

export default function FocusEditor(props: FocusEditorProps) {
  const {
    selection,
    code,
    kind,
    breakpoint,
    tool,
    onToolChange,
    insertContext,
    swapContext,
    onInsertTarget,
    onInsertInto,
    onInsertIntoMulti,
    onSwapWith,
    onApplyPalette,
    onCancelInsert,
    onCancelSwap,
    onWarn,
  } = props;
  // Default to "in-page" so the user sees the element in the same
  // layout / cascade context they clicked it in. Isolated mode hid
  // siblings to focus the selection but it made the preview look
  // unlike the rendered page, which was the user-facing complaint.
  // The toggle is still here for explicit isolation when wanted.
  const [viewMode, setViewMode] = useState<ViewMode>("in-page");
  // Twenty-third pass — palette-only LibraryModal entry from
  // FocusEditor's isolated mode. Spec §C4.3 expects palette access
  // here, but Phase C / C4.3 only opened the modal on Insert/Swap
  // context. Cmd+J + the right-pane button toggle this local state;
  // LibraryModal's `paletteOnly` prop drives the open. Insert/Swap
  // context still wins (closing the modal first when either is set
  // is handled by the existing Esc gate below). JSX mode only —
  // applyPalette only supports JSX.
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);

  const classes = selection.classes;
  const bp = breakpointPrefix(breakpoint);
  const applyClasses = (next: string[]) =>
    props.onClassChange(selection.loc, next.join(" "));

  // ROADMAP §3.5 polish — preset hover preview state. PresetTile
  // mouseenter/leave updates this; IsolatedPreview reactively posts
  // hover-preview / hover-clear messages. Cleared on selection change
  // because the prior selection's element no longer matches the OID
  // we'd be addressing. Only useful in jsx mode (no OIDs in HTML).
  const [hoverPreview, setHoverPreview] = useState<{
    oid: string;
    classes: ReadonlyArray<string>;
  } | null>(null);
  useEffect(() => {
    setHoverPreview(null);
  }, [selection.oid, selection.loc]);
  const presetHoverEnter = useCallback(
    (proposed: ReadonlyArray<string>) => {
      if (kind !== "jsx") return;
      const oid = selection.oid;
      if (!oid) return;
      setHoverPreview({ oid, classes: proposed });
    },
    [kind, selection.oid],
  );
  const presetHoverLeave = useCallback(() => {
    setHoverPreview(null);
  }, []);

  const display = classes.find((c) => DISPLAY_MATCH.test(c)) || null;
  const isFlex = display === "flex" || display === "inline-flex";

  // Sub-element heuristic uses the breadcrumb's penultimate entry as
  // the immediate parent. Last entry is the selected element itself.
  const parentTagForRelevance =
    selection.breadcrumb.length >= 2
      ? selection.breadcrumb[selection.breadcrumb.length - 2].tag
      : null;
  const relevance = computeSectionRelevance(
    selection.tag,
    isFlex,
    selection.hasOnlyTextChildren,
    parentTagForRelevance,
  );

  // Phase 2 Step 9 — Properties Panel context. The panel reads CURRENT
  // inline-style declarations from source via `readSourceStyle` keyed
  // by the selection's OID. Memoized on `[code, selection.oid]` so the
  // parse only re-runs when source changes or the selection moves to
  // a different element. Empty record for HTML mode (no OIDs) and for
  // JSX selections that pre-date OID injection.
  const panelOid = selection.oid;
  const panelWritable =
    kind === "jsx" && panelOid !== null && Boolean(props.onSetStyleProps);
  const panelCurrent = useMemo(() => {
    if (kind !== "jsx" || !panelOid) return {};
    return readSourceStyle(code, panelOid);
  }, [code, kind, panelOid]);

  // Gate the pinned pixel-precise sections on actually having something
  // to edit. The sections read inline `style={{...}}` declarations only
  // (their docblock makes this explicit: "no fallback to computed style
  // — Tailwind classes don't show up here"), so on a Tailwind-class-
  // styled element they render empty Width / Height / padding fields
  // that look broken to vibecoders. The reorderable Size / Spacing /
  // Border sections (which read classes via SliderRow) still cover
  // those cases. Adding inline width via the segmented presets brings
  // the pinned section back automatically.
  const hasInlineSizing = Boolean(
    panelCurrent.width ||
      panelCurrent.height ||
      panelCurrent.minWidth ||
      panelCurrent.minHeight ||
      panelCurrent.maxWidth ||
      panelCurrent.maxHeight,
  );
  const hasInlineSpacing = Boolean(
    panelCurrent.padding ||
      panelCurrent.paddingTop ||
      panelCurrent.paddingRight ||
      panelCurrent.paddingBottom ||
      panelCurrent.paddingLeft ||
      panelCurrent.margin ||
      panelCurrent.marginTop ||
      panelCurrent.marginRight ||
      panelCurrent.marginBottom ||
      panelCurrent.marginLeft,
  );
  const hasInlineRadius = Boolean(
    panelCurrent.borderRadius ||
      panelCurrent.borderTopLeftRadius ||
      panelCurrent.borderTopRightRadius ||
      panelCurrent.borderBottomLeftRadius ||
      panelCurrent.borderBottomRightRadius,
  );

  // ROADMAP §4.2 #13. When the source carries a dynamic className expression
  // (`className={cn(...)}`, template literal, prop forward), every patch via
  // `patchJsxClass` refuses — so we surface a banner upfront so the user
  // doesn't drag five sliders before realising nothing's saving. HTML mode
  // never has dynamic class — always false there. Memo on `[code, loc]`
  // because the source-patch parse runs a small attr tokenizer.
  const dynamicClassName = useMemo(() => {
    if (kind !== "jsx" || selection.loc.kind !== "jsx") return false;
    return isClassNameDynamic(code, selection.loc);
  }, [code, kind, selection.loc]);
  const panelCommit = (decls: Record<string, string | null>) => {
    if (!panelOid || !props.onSetStyleProps) return;
    props.onSetStyleProps(panelOid, decls);
  };

  // Empty deps so the open / close pair only logs once per actual
  // FocusEditor lifecycle. The earlier dep list ([selection.tag,
  // selection.loc]) re-fired on every selection change because
  // selection.loc is a fresh object reference every dropin:select
  // round-trip — looked like FocusEditor was remounting on each
  // click but the component instance persists.
  useEffect(() => {
    track("focus mode opened", { tag: selection.tag, oid: selection.oid });
    return () => track("focus mode closed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refs so the Esc handler reads the freshest props without forcing
  // listener re-attachment on every parent rerender. Without this the
  // useEffect's dep list would have to enumerate every cancel handler
  // and context object, every one of which is a fresh reference per
  // Workspace render.
  const insertContextRef = useRef<SidebarInsertContext | null>(insertContext ?? null);
  const swapContextRef = useRef<SidebarSwapContext | null>(swapContext ?? null);
  const cancelInsertRef = useRef(onCancelInsert);
  const cancelSwapRef = useRef(onCancelSwap);
  // Twenty-third pass — paletteModalOpen ref mirrors the state so the
  // Esc handler (empty-deps, attached once) can read the freshest
  // value without re-binding the listener every render.
  const paletteModalOpenRef = useRef(paletteModalOpen);
  useEffect(() => {
    insertContextRef.current = insertContext ?? null;
  }, [insertContext]);
  useEffect(() => {
    swapContextRef.current = swapContext ?? null;
  }, [swapContext]);
  useEffect(() => {
    cancelInsertRef.current = onCancelInsert;
  }, [onCancelInsert]);
  useEffect(() => {
    cancelSwapRef.current = onCancelSwap;
  }, [onCancelSwap]);
  useEffect(() => {
    paletteModalOpenRef.current = paletteModalOpen;
  }, [paletteModalOpen]);

  // Twenty-third pass — Cmd/Ctrl+J inside FocusEditor toggles the
  // palette-only LibraryModal. Mirrors the Workspace shortcut so the
  // user's muscle memory carries over. Skips when a text-edit field
  // owns focus so Monaco / inputs / textareas can still receive the
  // keypress (Monaco doesn't claim Cmd+J anyway, but inputs might).
  // JSX-only — applyPalette only supports JSX, so toggling in HTML
  // mode would just open a modal that bails on every click. Insert/
  // Swap context wins: when either is active, Cmd+J is a no-op so
  // the user doesn't accidentally yank themselves out of a structural
  // edit they're mid-flight on. preventDefault to override Firefox's
  // Cmd+J → downloads binding.
  useEffect(() => {
    function isTextEditField(el: Element | null): boolean {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return true;
      if ((el as HTMLElement).isContentEditable) return true;
      if (el.closest(".monaco-editor")) return true;
      return false;
    }
    function onKey(e: KeyboardEvent) {
      const cmd = e.metaKey || e.ctrlKey;
      if (!cmd) return;
      if (e.shiftKey || e.altKey) return;
      if (e.key.toLowerCase() !== "j") return;
      if (isTextEditField(document.activeElement)) return;
      if (kind !== "jsx") return;
      if (insertContextRef.current || swapContextRef.current) return;
      e.preventDefault();
      setPaletteModalOpen((o) => {
        log("Cmd+J → toggle palette modal", { next: !o });
        return !o;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const editable =
        target?.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select";
      if (editable) return;
      // Phase 5 / Phase C / C1.4 + C2.3 — Esc dismisses the
      // LibraryModal first when it's open inside isolated mode. The
      // modal sits z-[80] over the focus shell; closing the focus
      // editor wholesale on Esc would discard the user's selection
      // alongside the structural-edit flow they just abandoned. Cancel
      // handlers route through Workspace which clears tool back to
      // Select, dropping the modal naturally.
      if (insertContextRef.current && cancelInsertRef.current) {
        log("Esc pressed → cancel insert (modal open)");
        cancelInsertRef.current();
        return;
      }
      if (swapContextRef.current && cancelSwapRef.current) {
        log("Esc pressed → cancel swap (modal open)");
        cancelSwapRef.current();
        return;
      }
      // Twenty-third pass — palette-only LibraryModal is local to
      // FocusEditor (no Workspace state to clear). Same precedence
      // pattern: Esc closes the modal first, leaving FocusEditor +
      // its selection intact. Second Esc closes the focus editor.
      if (paletteModalOpenRef.current) {
        log("Esc pressed → close palette modal");
        setPaletteModalOpen(false);
        return;
      }
      log("Esc pressed → closing focus");
      props.onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props.onClose, selection.tag, selection.loc]);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-paper"
      role="dialog"
      aria-modal="true"
      aria-label={`Editing ${selection.tag}`}
    >
      <FocusHeader
        selection={selection}
        onBreadcrumbSelect={props.onBreadcrumbSelect}
        onClose={props.onClose}
      />

      {/* Phase 5 / Phase B / B4 — 4-tool toolbar inside FocusEditor.
          Omits View (the user is explicitly in edit mode here; Done /
          Esc / Back returns to workspace and resets the tool to View
          via Workspace.handleCloseFocus). Tool state is shared with
          Workspace via the prop pair — switching tools here drives
          the canvas behind the focus modal too, so when the user
          dismisses focus the iframe-side state is already correct. */}
      <ToolBar
        tool={tool}
        onToolChange={onToolChange}
        omitView
      />

      <main
        key={locKey(selection.loc)}
        className="flex min-h-0 flex-1 flex-col lg:flex-row"
      >
        <section className="flex min-h-[320px] flex-col border-b-2 border-ink lg:min-h-0 lg:w-[60%] lg:border-b-0 lg:border-r-2 lg:border-ink">
          <div className="flex shrink-0 items-center gap-2 border-b border-ink/20 bg-paper px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              View
            </span>
            <div className="seg-group w-auto">
              {(["isolated", "in-page"] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={m === viewMode}
                  onClick={() => setViewMode(m)}
                  className="seg-btn"
                >
                  {m === "isolated" ? "Isolated" : "In-page"}
                </button>
              ))}
            </div>
            {/* Twenty-third pass — palette-only LibraryModal entry. JSX
                only (applyPalette doesn't support HTML). Disabled while
                Insert/Swap is active because the modal is already
                committed to the structural-edit flow; enabling the
                button would either no-op or hijack the user's flow.
                Active state mirrors the modal's open state so users
                see the toggle work both ways. Cmd+J shortcut hint in
                the title attribute. */}
            {kind === "jsx" && (
              <button
                type="button"
                aria-pressed={paletteModalOpen}
                onClick={() => setPaletteModalOpen((o) => !o)}
                disabled={!!(insertContext || swapContext)}
                className={
                  "ml-auto inline-flex h-7 items-center gap-1.5 border-2 border-ink px-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 " +
                  (paletteModalOpen
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink hover:bg-ink hover:text-paper")
                }
                title={
                  insertContext || swapContext
                    ? "Cancel insert / swap to use palettes"
                    : paletteModalOpen
                    ? "Close palettes (Esc)"
                    : "Open palettes (⌘J)"
                }
                aria-label="Toggle palette library"
              >
                <span aria-hidden>◐</span>
                <span>Palettes</span>
              </button>
            )}
          </div>
          <div className="min-h-0 flex-1">
            <IsolatedPreview
              code={code}
              kind={kind}
              loc={selection.loc}
              mode={viewMode}
              tool={tool}
              hoverPreview={hoverPreview}
              onInsertTarget={onInsertTarget}
            />
          </div>
        </section>

        <section className="min-h-0 flex-1 overflow-y-auto lg:w-[40%]">
          {dynamicClassName && (
            <div
              role="alert"
              className="border-b-2 border-amber-600 bg-amber-50 px-4 py-2 md:px-6"
            >
              <p className="font-mono text-[11px] leading-snug text-ink">
                <span className="font-semibold">Dynamic className.</span>{" "}
                This element uses <code className="rounded-sm bg-paper px-1">{"{...}"}</code>{" "}
                for its class — slider / picker edits won't save. Edit the source
                directly in the code pane, or paste the current classes from the
                Advanced → Raw class string field below.
              </p>
            </div>
          )}
          <div className="border-b border-ink/15 bg-soft/40 px-4 py-1.5 font-mono text-[10px] text-muted md:px-6">
            tip: <kbd className="rounded-sm border border-ink/30 bg-paper px-1">↑↓</kbd> tweaks · <kbd className="rounded-sm border border-ink/30 bg-paper px-1">⇧↑↓</kbd> jumps · <kbd className="rounded-sm border border-ink/30 bg-paper px-1">⌘C</kbd>/<kbd className="rounded-sm border border-ink/30 bg-paper px-1">⌘V</kbd> copies styles
          </div>
          <ContrastChip classes={classes} />
          <PresetsSection
            tag={selection.tag}
            classes={classes}
            selectionKey={selection.oid ?? locKey(selection.loc)}
            onChange={applyClasses}
            onHoverEnter={presetHoverEnter}
            onHoverLeave={presetHoverLeave}
          />
          {/* Phase 2 Step 9 — pixel-precise sizing/spacing/radius
              sections. Render in JSX mode only (HTML elements have no
              OIDs and `applyStyleProps` is JSX-only). For pre-OID JSX
              selections (rare paste-without-reinject window) the
              `writable` flag flips false and the inputs render
              read-only. Pinned at the top — pixel-precise inputs
              outrank the heuristic-driven slider section order below.
              */}
          {kind === "jsx" && panelOid && (
            <>
              {relevance.pinnedSizing && hasInlineSizing && (
                <SizingSection
                  current={panelCurrent}
                  onCommit={panelCommit}
                  writable={panelWritable}
                />
              )}
              {relevance.pinnedSpacing && hasInlineSpacing && (
                <SpacingSection
                  current={panelCurrent}
                  onCommit={panelCommit}
                  writable={panelWritable}
                />
              )}
              {relevance.pinnedRadius && hasInlineRadius && (
                <RadiusSection
                  current={panelCurrent}
                  onCommit={panelCommit}
                  writable={panelWritable}
                />
              )}
            </>
          )}

          {(() => {
            const sectionMap: Record<ReorderableSection, JSX.Element | null> = {
              text: selection.hasOnlyTextChildren ? (
                <Section label="Text">
                  <TextEditor
                    value={selection.text || ""}
                    onCommit={(v) => props.onTextChange(selection.loc, v)}
                  />
                </Section>
              ) : null,
              background: (
                <Section label="Background">
                  <BackgroundEditor classes={classes} onChange={applyClasses} />
                </Section>
              ),
              text_color: (
                <Section label="Text color">
                  <ColorRow
                    label="Color"
                    kind="text"
                    classes={classes}
                    onChange={applyClasses}
                    bp={bp}
                  />
                </Section>
              ),
              typography: (
                <Section label="Typography">
                  <FontFamilyPicker classes={classes} onChange={applyClasses} />
                  <SliderRow label="Font size" classes={classes} prop={FONT_SIZE} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Font weight" classes={classes} prop={FONT_WEIGHT} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Line height" classes={classes} prop={LINE_HEIGHT} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Letter spacing" classes={classes} prop={TRACKING} onChange={applyClasses} bp={bp} />
                  <SegmentedRow
                    label="Align"
                    options={TEXT_ALIGNS}
                    classes={classes}
                    match={TEXT_ALIGN_MATCH}
                    toClass={textAlignClass}
                    onChange={applyClasses}
                    bp={bp}
                  />
                </Section>
              ),
              spacing: (
                <Section label="Spacing">
                  <BoxModelControl classes={classes} onChange={applyClasses} bp={bp} />
                  <Divider />
                  <SliderRow label="Padding" classes={classes} prop={spacingProp("p")} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Padding X" classes={classes} prop={spacingProp("px")} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Padding Y" classes={classes} prop={spacingProp("py")} onChange={applyClasses} bp={bp} />
                  <Divider />
                  <SliderRow label="Margin" classes={classes} prop={spacingProp("m")} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Margin X" classes={classes} prop={spacingProp("mx")} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Margin Y" classes={classes} prop={spacingProp("my")} onChange={applyClasses} bp={bp} />
                  <Divider />
                  <SliderRow label="Gap" classes={classes} prop={spacingProp("gap")} onChange={applyClasses} bp={bp} />
                </Section>
              ),
              border: (
                <Section label="Border">
                  <SliderRow label="Radius" classes={classes} prop={RADIUS} onChange={applyClasses} bp={bp} />
                  <SliderRow label="Width" classes={classes} prop={BORDER_WIDTH} onChange={applyClasses} bp={bp} />
                  <ColorRow label="Color" kind="border" classes={classes} onChange={applyClasses} bp={bp} />
                </Section>
              ),
              effects: (
                <Section label="Effects">
                  <SliderRow label="Opacity" classes={classes} prop={OPACITY} onChange={applyClasses} bp={bp} />
                  <ShadowPicker classes={classes} onChange={applyClasses} bp={bp} />
                </Section>
              ),
              layout: (
                <Section label="Layout">
                  <SegmentedRow
                    label="Display"
                    options={DISPLAYS}
                    classes={classes}
                    match={DISPLAY_MATCH}
                    toClass={displayClass}
                    onChange={applyClasses}
                    bp={bp}
                  />
                  {isFlex && (
                    <>
                      <SegmentedRow
                        label="Direction"
                        options={FLEX_DIRECTIONS}
                        classes={classes}
                        match={FLEX_DIRECTION_MATCH}
                        toClass={flexDirectionClass}
                        onChange={applyClasses}
                        bp={bp}
                      />
                      <SegmentedRow
                        label="Justify"
                        options={JUSTIFY}
                        classes={classes}
                        match={JUSTIFY_MATCH}
                        toClass={justifyClass}
                        onChange={applyClasses}
                        bp={bp}
                      />
                      <SegmentedRow
                        label="Align items"
                        options={ALIGN}
                        classes={classes}
                        match={ALIGN_MATCH}
                        toClass={alignClass}
                        onChange={applyClasses}
                        bp={bp}
                      />
                    </>
                  )}
                </Section>
              ),
              size: (
                <Section label="Size">
                  <SegmentedRow
                    label="Width"
                    options={WIDTH_PRESETS}
                    classes={classes}
                    match={WIDTH_MATCH}
                    toClass={widthClass}
                    onChange={applyClasses}
                    bp={bp}
                  />
                  <SegmentedRow
                    label="Height"
                    options={HEIGHT_PRESETS}
                    classes={classes}
                    match={HEIGHT_MATCH}
                    toClass={heightClass}
                    onChange={applyClasses}
                    bp={bp}
                  />
                </Section>
              ),
              image:
                selection.tag === "img" ? (
                  <Section label="Image">
                    <ImageSrcEditor
                      src={selection.attrs.find((a) => a.key === "src")?.value || ""}
                      onCommit={(v) => props.onAttrSet(selection.loc, "src", v)}
                    />
                    <AttrRow
                      label="Alt"
                      value={selection.attrs.find((a) => a.key === "alt")?.value || ""}
                      onCommit={(v) => props.onAttrSet(selection.loc, "alt", v)}
                    />
                  </Section>
                ) : null,
            };
            const order = computeSectionOrder(
              selection.tag,
              isFlex,
              selection.hasOnlyTextChildren,
              parentTagForRelevance,
            );
            return order.map((key) => {
              if (!relevance.reorderable.has(key)) return null;
              const node = sectionMap[key];
              return node ? <Fragment key={key}>{node}</Fragment> : null;
            });
          })()}

          {kind === "jsx" && selection.loc.kind === "jsx" && (
            <AIRewriteSection
              classes={classes}
              elementSource={
                extractJsxElement(code, selection.loc) ?? ""
              }
              onApply={applyClasses}
            />
          )}

          <AdvancedSection
            classString={selection.classes.join(" ")}
            onClassCommit={(v) => props.onClassChange(selection.loc, v)}
            attrs={selection.attrs}
            onAttrSet={(k, v) => props.onAttrSet(selection.loc, k, v)}
            onAttrRemove={(k) => props.onAttrRemove(selection.loc, k)}
          />
        </section>
      </main>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t-2 border-ink bg-paper px-4 py-3 md:px-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => props.onCopyElement(selection.loc)}
          >
            Copy element
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => props.onDuplicate(selection.loc)}
          >
            Duplicate
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (confirm(`Delete this <${selection.tag}>?`)) {
                props.onDelete(selection.loc);
                props.onClose();
              }
            }}
          >
            Delete
          </button>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Esc to exit · Done saves selection
        </p>
      </footer>

      {/* Phase 5 / Phase C / C1.4 + C2.3 — Library overlay for isolated
          mode. Mounted as the last child inside the focus modal so its
          z-index sits above the focus chrome (it's `z-[80]` vs the modal
          shell's `z-[60]`). Open is driven by insertContext / swapContext
          (Workspace-owned) OR by paletteOnly (FocusEditor-local; Cmd+J
          + the right-pane button). Insert/Swap context still wins —
          LibraryModal forces the modal layer to "structural" when
          either is set even if paletteModalOpen happens to be true. */}
      <LibraryModal
        mode={kind}
        insertContext={insertContext ?? null}
        swapContext={swapContext ?? null}
        onInsertInto={onInsertInto}
        onInsertIntoMulti={onInsertIntoMulti}
        onSwapWith={onSwapWith}
        onApplyPalette={onApplyPalette}
        onCancelInsert={onCancelInsert}
        onCancelSwap={onCancelSwap}
        onWarn={onWarn}
        paletteOnly={paletteModalOpen}
        onClosePaletteOnly={() => setPaletteModalOpen(false)}
      />
    </div>
  );
}

// --- Header ---

function FocusHeader({
  selection,
  onBreadcrumbSelect,
  onClose,
}: {
  selection: ElementSelection;
  onBreadcrumbSelect: (loc: ElementLoc, oid: string | null) => void;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-ink bg-paper px-4 py-3 md:px-6">
      <button
        type="button"
        onClick={() => { log("Back button clicked"); onClose(); }}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:text-coral"
        aria-label="Back to workspace"
      >
        ← Back
      </button>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto font-mono text-[11px]">
        {selection.breadcrumb.map((b, i) => {
          const isActive =
            i === selection.breadcrumb.length - 1 &&
            locKey(b.loc) === locKey(selection.loc);
          return (
            <span
              key={`${locKey(b.loc)}-${i}`}
              className="flex shrink-0 items-center gap-1"
            >
              <button
                type="button"
                onClick={() => onBreadcrumbSelect(b.loc, b.oid ?? null)}
                className={
                  "px-1.5 py-0.5 " +
                  (isActive
                    ? "bg-ink text-paper"
                    : "text-ink hover:bg-soft")
                }
              >
                {b.tag}
              </button>
              {i < selection.breadcrumb.length - 1 && (
                <span className="text-muted">›</span>
              )}
            </span>
          );
        })}
      </div>
      <button type="button" className="btn btn-accent" onClick={() => { log("Done button clicked"); onClose(); }}>
        Done
      </button>
    </header>
  );
}

// --- Reusable sections & primitives ---

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b-2 border-ink px-4 py-4 md:px-6">
      <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        {label}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Divider() {
  return <div className="-mx-4 border-t border-ink/15 md:-mx-6" />;
}

// Phase 5 / A5.2 — BYO-key AI rewrite. Collapsed by default; first open
// shows provider toggle + key input. Once saved, flips to a textarea +
// Rewrite button. The route at /api/llm-rewrite relays one request at a
// time and never persists the key server-side.
//
// SECURITY (2026-05-26): the key is held in component state (memory) for
// the session ONLY — it is NOT written to localStorage. The preview iframe
// runs with `allow-same-origin` (the editor needs contentDocument access),
// which means iframe JS can read `window.parent.localStorage`. Persisting a
// BYO API key there would expose it to any script running in the preview
// (a malicious template or pasted AI output). In-memory state lives in a
// closure the iframe cannot reach. Re-entering the key per session is the
// accepted trade-off. (Provider preference is not a secret and still
// persists.)
//
// Phase 5 §5 backlog (b) — request now opts into the route's SSE
// streaming variant. The model's JSON output appears in a live preview
// pane as it arrives, and the new full class list is committed to
// Monaco only when the route emits the terminal `complete` envelope.
// Mid-stream cancel (Stop button or component unmount) aborts the
// in-flight fetch so the provider call doesn't keep billing the user
// after they walked away. SSE primitives shared with the route live in
// `lib/sse.ts`.
type AIProvider = "openai" | "anthropic";
// NB: no AI_KEY_STORE — the key is intentionally NOT persisted (see the
// SECURITY note above). Only the non-secret provider preference persists.
const AI_PROVIDER_STORE = "dropin:ai-provider";

function AIRewriteSection({
  classes,
  elementSource,
  onApply,
}: {
  classes: string[];
  elementSource: string;
  onApply: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [keyDraft, setKeyDraft] = useState("");
  const [editingKey, setEditingKey] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partialText, setPartialText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Provider preference only — the API key is never read from storage
    // (it isn't written there). See the SECURITY note above.
    const p = window.localStorage.getItem(AI_PROVIDER_STORE);
    if (p === "openai" || p === "anthropic") setProvider(p);
  }, []);

  // Abort any in-flight stream when the section unmounts (FocusEditor
  // closes, parent route navigates, etc.) so the provider call stops
  // billing immediately. AbortController is also re-used by the user's
  // Stop button mid-stream — see runRewrite.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const hasKey = apiKey.length > 0;

  function saveKey() {
    const k = keyDraft.trim();
    if (k.length < 8) {
      setError("API key looks too short.");
      return;
    }
    if (typeof window !== "undefined") {
      // Persist provider preference only — NOT the key (see SECURITY note).
      window.localStorage.setItem(AI_PROVIDER_STORE, provider);
    }
    setApiKey(k);
    setKeyDraft("");
    setEditingKey(false);
    setError(null);
  }

  function stopRewrite() {
    // Audit Domain 2 MED — single source of cleanup. Aborting the
    // controller propagates to fetch + the reader inside `runRewrite`'s
    // try/catch/finally; the catch returns silently when
    // `ac.signal.aborted` is true and the finally block clears
    // `abortRef.current` + flips `setLoading(false)` for us.
    //
    // Pre-fix this also called `setLoading(false)` + `abortRef.current = null`
    // directly, which created a sub-millisecond window where loading
    // was already false but the reader was still mid-teardown — and
    // duplicated the lifecycle ownership across stopRewrite + finally.
    // Now stop / network-error / completion all funnel through the same
    // finally cleanup.
    abortRef.current?.abort();
  }

  // Audit F3 — exhaustive-switch helper. Adding a future variant to
  // `ServerStreamPayload` (e.g. "warning" / "progress") will fail tsc
  // here instead of silently dropping the new case the way an
  // open-ended `if/else if` chain would. Local-only since it's the
  // single consumer of the union.
  function assertNeverServerPayload(p: never): never {
    throw new Error(
      `Unhandled ServerStreamPayload variant: ${JSON.stringify(p)}`,
    );
  }

  async function runRewrite() {
    if (!hasKey) {
      setError("Set your API key first.");
      return;
    }
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    setPartialText("");

    let receivedComplete = false;
    let res: Response;
    try {
      res = await fetch("/api/llm-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          prompt,
          elementSource,
          classes,
          stream: true,
        }),
        signal: ac.signal,
      });
    } catch (e) {
      if ((e as { name?: string } | null)?.name === "AbortError") {
        // User clicked Stop / component unmounted — silent.
        return;
      }
      setError("Network error reaching the rewrite route.");
      setLoading(false);
      return;
    }

    if (!res.body) {
      setError("Stream connection had no body.");
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const split = splitSseFrames(buffer);
        buffer = split.remaining;
        for (const raw of split.frames) {
          const evt = parseSseFrame(raw);
          if (!evt) continue;
          const result = parseServerStreamPayload(evt.data);
          // Audit Domain 4 MED — discriminated union splits the legit
          // forward-compat skip (unknown envelope type) from a genuine
          // shape error. The latter gets a warn so contract drift is
          // visible in the dev console; the former is silent.
          if (result.kind === "skip") continue;
          if (result.kind === "malformed") {
            console.warn("[llm-rewrite] malformed SSE payload:", result.reason);
            continue;
          }
          const payload = result.value;
          // Audit F3 — switch + assertNever forces exhaustiveness at
          // compile time. A future variant added to
          // `ServerStreamPayload` will fail tsc here.
          switch (payload.type) {
            case "chunk":
              setPartialText((p) => p + payload.text);
              break;
            case "complete":
              receivedComplete = true;
              onApply(payload.classes);
              // Audit MED (Domain 2) — close the loop the moment we
              // get the complete envelope. Without this the user sees
              // classes applied to the canvas while the spinner stays
              // active for the few hundred ms it takes for the TCP
              // FIN to land. `ac.abort()` ALSO propagates to the
              // server's `cancel()` callback (route.ts streamProvider)
              // which aborts the upstream provider's billing — same
              // disconnect path as the Stop button. Finally runs
              // setLoading(false) + abortRef cleanup automatically.
              ac.abort();
              return;
            case "error":
              setError(payload.error);
              break;
            default:
              assertNeverServerPayload(payload);
          }
        }
      }
      // Drain the final decode — any tail bytes left in the decoder
      // when the body closes mid-codepoint.
      const tail = decoder.decode();
      if (tail) buffer += tail;
      if (buffer.length > 0) {
        const evt = parseSseFrame(buffer);
        if (evt) {
          const result = parseServerStreamPayload(evt.data);
          // Audit F3 — same exhaustive switch; chunk in the tail is a
          // legitimate payload (mid-codepoint flush) but doesn't change
          // receivedComplete / setError state, so we no-op it.
          // Audit Domain 4 MED — same discriminated-union handling as
          // the main loop; skip is silent, malformed gets a warn.
          if (result.kind === "ok") {
            const payload = result.value;
            switch (payload.type) {
              case "chunk":
                // Tail chunk — surface to the partial display.
                setPartialText((p) => p + payload.text);
                break;
              case "complete":
                receivedComplete = true;
                onApply(payload.classes);
                break;
              case "error":
                setError(payload.error);
                break;
              default:
                assertNeverServerPayload(payload);
            }
          } else if (result.kind === "malformed") {
            console.warn(
              "[llm-rewrite] malformed SSE payload (tail):",
              result.reason,
            );
          }
        }
      }
      if (!receivedComplete && !ac.signal.aborted) {
        setError((cur) => cur ?? "Stream closed without a complete event.");
      }
    } catch (e) {
      if (ac.signal.aborted) return;
      setError("Stream interrupted.");
    } finally {
      try {
        reader.releaseLock();
      } catch {
        // releaseLock throws if a read is still pending on the reader.
        // We swallow because the controller has already aborted (catch
        // path) or the loop ended cleanly (success path); either way
        // the reader's lock isn't load-bearing once we're in finally.
      }
      if (abortRef.current === ac) abortRef.current = null;
      setLoading(false);
    }
  }

  return (
    <section className="border-b-2 border-ink px-4 py-4 md:px-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted hover:text-ink"
        aria-expanded={open}
      >
        <span>AI Rewrite</span>
        <span aria-hidden>{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {!hasKey || editingKey ? (
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-muted">
                Bring your own OpenAI or Anthropic key. Stored in your browser
                only — we never see it on the server.
              </p>
              <div
                className="inline-flex overflow-hidden border-2 border-ink"
                role="group"
                aria-label="Provider"
              >
                {(["openai", "anthropic"] as AIProvider[]).map((p, i) => {
                  const active = p === provider;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProvider(p)}
                      className={
                        "h-8 px-3 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors " +
                        (active
                          ? "bg-ink text-paper"
                          : "bg-paper text-ink hover:bg-soft") +
                        (i > 0 ? " border-l-2 border-ink" : "")
                      }
                      aria-pressed={active}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <input
                type="password"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder={
                  provider === "openai" ? "sk-..." : "sk-ant-..."
                }
                className="block w-full border-2 border-ink bg-paper px-2 py-1 font-mono text-[11px] text-ink focus:outline-none focus:ring-2 focus:ring-coral"
                aria-label="API key"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveKey}
                  className="btn btn-accent"
                >
                  Save key
                </button>
                {hasKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingKey(false);
                      setKeyDraft("");
                      setError(null);
                    }}
                    className="btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to change?"
                rows={3}
                className="block w-full resize-y border-2 border-ink bg-paper px-2 py-1 font-mono text-[11px] text-ink focus:outline-none focus:ring-2 focus:ring-coral"
                disabled={loading}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                {loading ? (
                  <button
                    type="button"
                    onClick={stopRewrite}
                    className="btn"
                    aria-label="Stop streaming"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={runRewrite}
                    disabled={prompt.trim().length === 0}
                    className="btn btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {`Rewrite (${provider})`}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditingKey(true);
                    setKeyDraft("");
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:text-coral"
                >
                  Change my key
                </button>
              </div>
              {(loading || partialText.length > 0) && (
                <div
                  className="border-2 border-ink/40 bg-soft/40 px-2 py-1 font-mono text-[10px] leading-snug text-ink/80"
                  aria-live="polite"
                  aria-label="Streaming model output"
                >
                  <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-muted">
                    <span>{loading ? "Streaming…" : "Final output"}</span>
                    <span>{partialText.length} chars</span>
                  </div>
                  <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all">
                    {partialText || (loading ? "(waiting for first token…)" : "")}
                  </pre>
                </div>
              )}
            </div>
          )}
          {error && (
            <p className="font-mono text-[10px] text-coral" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// ROADMAP §3.5 — style presets section. Renders 0..N category groups,
// each with its preset thumbs as clickable tiles. Hidden when the
// element's tag has no matching presets (no thumbs to show ≠ valuable
// noise to render). Apply = `applyPreset` strips conflicting classes
// + appends the preset's class tokens; one undo entry covers the swap.
function PresetsSection({
  tag,
  classes,
  selectionKey,
  onChange,
  onHoverEnter,
  onHoverLeave,
}: {
  tag: string;
  classes: ReadonlyArray<string>;
  // Stable per-element key — used to scope variant-cycle state +
  // hover preview. Resets cycling when the user selects a different
  // element so each element starts at variant 0.
  selectionKey: string;
  onChange: (next: string[]) => void;
  // Eighteenth-pass polish — hover preview. Hovering a tile sends a
  // proposed Tailwind token list to the iframe via FocusEditor →
  // IsolatedPreview → `dropin:hover-preview`; leave clears. Optional:
  // when omitted (no consumer wires them) the tiles still apply on
  // click but skip the preview side-effect.
  onHoverEnter?: (proposed: ReadonlyArray<string>) => void;
  onHoverLeave?: () => void;
}) {
  const categories = useMemo(
    () => getPresetCategoriesForTag(tag),
    [tag],
  );

  // Custom presets — load once, refresh on selection change so a
  // sibling tab adding a custom preset doesn't get missed.
  const [customPresets, setCustomPresets] = useState<ReadonlyArray<CustomPreset>>(
    () => loadCustomPresets(),
  );
  // Re-load on every selection change to catch cross-tab/cross-window
  // edits. Cheap (single localStorage read) and keeps the UI honest.
  useEffect(() => {
    setCustomPresets(loadCustomPresets());
  }, [selectionKey]);
  const customForTag = useMemo(
    () => getCustomPresetsForTag(tag, customPresets),
    [tag, customPresets],
  );

  // Variant cycle counter per (selection, presetId). Reset on
  // selection change — every element starts at variant 0.
  const [variantIdx, setVariantIdx] = useState<Record<string, number>>({});
  useEffect(() => {
    setVariantIdx({});
  }, [selectionKey]);

  // Hide the whole section when neither built-in nor custom presets
  // match. Vibecoders don't recognise the "Save current as preset"
  // affordance — leaving it as the only thing in an otherwise empty
  // section was pure noise on every container element. Power users
  // who want to save can re-enable by re-introducing the fallback.
  if (categories.length === 0 && customForTag.length === 0) {
    return null;
  }

  const applyByIndex = (preset: StylePreset, idx: number) =>
    applyPresetVariant(classes, preset, idx);

  const handleApply = (preset: StylePreset) => {
    const total = presetVariantCount(preset);
    const cur = variantIdx[preset.id] ?? 0;
    const next = (cur + 1) % total;
    onHoverLeave?.();
    onChange(applyByIndex(preset, cur));
    if (total > 1) {
      // Advance for next click on the same tile. We update post-apply
      // so the FIRST click of any tile applies variant 0 (the base
      // preset, the obvious default). The second click reaches
      // variant 1, etc., wrapping at total.
      setVariantIdx((s) => ({ ...s, [preset.id]: next }));
    }
  };

  const proposedFor = (preset: StylePreset) => {
    const cur = variantIdx[preset.id] ?? 0;
    return applyByIndex(preset, cur);
  };

  const renderTile = (preset: StylePreset, removable?: () => void) => (
    <PresetTile
      key={preset.id}
      preset={preset}
      variantCount={presetVariantCount(preset)}
      currentVariant={variantIdx[preset.id] ?? 0}
      onApply={() => handleApply(preset)}
      onHoverEnter={
        onHoverEnter ? () => onHoverEnter(proposedFor(preset)) : undefined
      }
      onHoverLeave={onHoverLeave}
      onRemove={removable}
    />
  );

  return (
    <Section label="Presets">
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.label}>
            {(categories.length > 1 || customForTag.length > 0) && (
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {cat.label}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {cat.presets.map((preset) => renderTile(preset))}
            </div>
          </div>
        ))}
        {customForTag.length > 0 && (
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Custom
            </p>
            <div className="grid grid-cols-2 gap-2">
              {customForTag.map((c) => {
                const styled = customToStylePreset(c);
                return renderTile(styled, () => {
                  const next = customPresets.filter((it) => it.id !== c.id);
                  setCustomPresets(next);
                  saveCustomPresets(next);
                });
              })}
            </div>
          </div>
        )}
        <SaveCustomPresetButton
          classes={classes}
          tag={tag}
          customPresets={customPresets}
          onSaved={(next) => setCustomPresets(next)}
        />
      </div>
    </Section>
  );
}

function PresetTile({
  preset,
  variantCount,
  currentVariant,
  onApply,
  onHoverEnter,
  onHoverLeave,
  onRemove,
}: {
  preset: StylePreset;
  variantCount: number;
  currentVariant: number;
  onApply: () => void;
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
  // When provided (custom presets), shows a × button on hover.
  onRemove?: () => void;
}) {
  const showCycle = variantCount > 1;
  const dotIndex = currentVariant % variantCount;
  return (
    <div
      className="group relative"
      onMouseLeave={onHoverLeave}
    >
      <button
        type="button"
        onClick={onApply}
        onMouseEnter={onHoverEnter}
        onFocus={onHoverEnter}
        onBlur={onHoverLeave}
        className="flex w-full flex-col gap-1 overflow-hidden rounded-sm border border-ink/20 bg-paper px-2 py-2 text-left transition hover:border-ink hover:bg-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        aria-label={
          showCycle
            ? `Apply ${preset.name} preset (variant ${dotIndex + 1} of ${variantCount}) — click again to cycle`
            : `Apply ${preset.name} preset`
        }
      >
        <PresetSwatch preset={preset} />
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink">
            {preset.name}
          </span>
          {showCycle && (
            <span
              className="flex shrink-0 items-center gap-0.5"
              aria-hidden
              title={`${variantCount} looks · click to cycle`}
            >
              {Array.from({ length: variantCount }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: i === dotIndex ? "#0F0F0F" : "rgba(15,15,15,0.25)",
                  }}
                />
              ))}
            </span>
          )}
        </div>
      </button>
      {onRemove && (
        <PresetDeleteButton
          presetName={preset.name}
          onConfirmed={onRemove}
        />
      )}
    </div>
  );
}

// Phase 5 / A4: two-step inline delete confirm. First click on × swaps the
// button to a "Delete?" label and starts a 4-second auto-revert timer.
// Second click within the window calls onConfirmed (which removes the
// preset). Click anywhere else, or Esc, cancels — no toast, no modal.
function PresetDeleteButton({
  presetName,
  onConfirmed,
}: {
  presetName: string;
  onConfirmed: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 4000);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirming(false);
    }
    function onDocPointer(e: MouseEvent) {
      if (ref.current && ref.current.contains(e.target as Node)) return;
      setConfirming(false);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocPointer);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocPointer);
    };
  }, [confirming]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!confirming) {
          setConfirming(true);
          return;
        }
        setConfirming(false);
        onConfirmed();
      }}
      aria-label={
        confirming
          ? `Confirm delete ${presetName} preset`
          : `Delete ${presetName} preset`
      }
      className={
        confirming
          ? "absolute right-1 top-1 flex h-4 items-center justify-center rounded-sm border border-coral bg-coral px-1 font-mono text-[8px] uppercase leading-none tracking-[0.15em] text-paper"
          : "absolute right-1 top-1 hidden h-4 w-4 items-center justify-center rounded-sm border border-ink/30 bg-paper text-[10px] leading-none text-ink hover:bg-coral hover:text-paper group-hover:flex"
      }
    >
      {confirming ? "Delete?" : "×"}
    </button>
  );
}

function SaveCustomPresetButton({
  classes,
  tag,
  customPresets,
  onSaved,
}: {
  classes: ReadonlyArray<string>;
  tag: string;
  customPresets: ReadonlyArray<CustomPreset>;
  onSaved: (next: CustomPreset[]) => void;
}) {
  const t = tag.toLowerCase();
  const handleSave = () => {
    const visualTokens = extractPresetClasses(classes);
    if (!visualTokens.trim()) {
      // Silent - element has no visual classes worth saving. The
      // button stays clickable so the user can drop classes onto an
      // element first, then save.
      window.alert(
        "This element doesn't have any preset-shaped classes (background, padding, border, etc.) yet. Add some style first.",
      );
      return;
    }
    const name = window.prompt(
      "Name this preset (will appear in the Custom group)",
      `${t.charAt(0).toUpperCase()}${t.slice(1)} preset`,
    );
    if (!name || !name.trim()) return;
    const id = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
    const entry: CustomPreset = {
      id,
      name: name.trim(),
      classes: visualTokens,
      matchTags: [t],
      shape: inferShapeForTag(t),
      createdAt: Date.now(),
    };
    const next = [...customPresets, entry];
    saveCustomPresets(next);
    onSaved(next);
  };
  return (
    <button
      type="button"
      onClick={handleSave}
      className="w-full rounded-sm border border-dashed border-ink/30 bg-transparent px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted hover:border-ink hover:text-ink"
    >
      + Save current as preset
    </button>
  );
}

function PresetSwatch({ preset }: { preset: StylePreset }) {
  const p = preset.preview;
  // Inline-style preview — stays inside the host's tailwind content scan
  // wouldn't pick up arbitrary preview classes. Standard CSS only.
  switch (p.shape) {
    case "button": {
      const style: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: p.bg,
        color: p.fg,
        border: p.border,
        boxShadow: p.shadow,
        borderRadius: p.radius,
        fontWeight: p.fontWeight,
        textDecoration: p.underline ? "underline" : undefined,
        textUnderlineOffset: p.underline ? "2px" : undefined,
        height: 28,
        paddingInline: 10,
        fontSize: 11,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
      };
      return (
        <span style={style}>
          {p.label}
        </span>
      );
    }
    case "card": {
      const style: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: p.bg,
        color: p.fg,
        border: p.border,
        boxShadow: p.shadow,
        borderRadius: p.radius,
        height: 36,
        fontSize: 10,
        fontFamily: "ui-monospace, monospace",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      };
      return <div style={style}>{p.label}</div>;
    }
    case "heading": {
      const style: React.CSSProperties = {
        backgroundColor: p.bg,
        color: p.fg,
        fontWeight: p.fontWeight,
        fontSize: p.fontSize,
        letterSpacing: p.letterSpacing,
        height: 36,
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      };
      return <span style={style}>{p.label}</span>;
    }
    case "input": {
      // Input swatch: render a faux text-input.
      const isMinimal = !p.radius && p.border && p.border.includes("/");
      const style: React.CSSProperties = isMinimal
        ? {
            display: "flex",
            alignItems: "center",
            backgroundColor: p.bg,
            color: p.fg,
            borderBottom: "2px solid #0F172A",
            paddingInline: 6,
            paddingBlock: 4,
            fontSize: 11,
            fontFamily: "ui-monospace, monospace",
            height: 28,
          }
        : {
            display: "flex",
            alignItems: "center",
            backgroundColor: p.bg,
            color: p.fg,
            border: p.border,
            borderRadius: p.radius,
            boxShadow: p.shadow,
            paddingInline: 8,
            paddingBlock: 4,
            fontSize: 11,
            fontFamily: "ui-monospace, monospace",
            height: 28,
          };
      return <span style={style}>{p.label}</span>;
    }
    default:
      return null;
  }
}

// Shadow swatches — replaces the generic SliderRow for shadow because
// shadow scale is non-linear (none → sm → soft → md → lg → xl → 2xl →
// inner) and a slider doesn't convey "what does this look like" the way
// 8 visual previews do (ROADMAP §4.3 #18). Storage stays on the SHADOW
// scale so currentIndex / setScale work unchanged — the picker is purely
// a presentation swap.
//
// Each swatch lists its shadow class as a literal string so Tailwind's
// JIT content scan picks them up at build. Don't refactor to dynamic
// `shadow-${value}` — JIT can't resolve template literal class names.
const SHADOW_OPTIONS: ReadonlyArray<{
  index: number;
  cls: string;
  label: string;
}> = [
  { index: 0, cls: "shadow-none", label: "None" },
  { index: 1, cls: "shadow-sm", label: "Sm" },
  { index: 2, cls: "shadow", label: "Soft" },
  { index: 3, cls: "shadow-md", label: "Md" },
  { index: 4, cls: "shadow-lg", label: "Lg" },
  { index: 5, cls: "shadow-xl", label: "Xl" },
  { index: 6, cls: "shadow-2xl", label: "2xl" },
  { index: 7, cls: "shadow-inner", label: "Inner" },
];

function ShadowPicker({
  classes,
  onChange,
  bp = "",
}: {
  classes: string[];
  onChange: (next: string[]) => void;
  bp?: string;
}) {
  const idx = currentIndex(classes, SHADOW, bp);
  const display = idx >= 0 ? SHADOW.toClass(SHADOW.scale[idx]) : "—";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">Shadow</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-coral">{display}</span>
          {idx >= 0 && (
            <button
              type="button"
              onClick={() => onChange(unsetScale(classes, SHADOW, bp))}
              className="px-1 font-mono text-[10px] text-muted hover:text-coral"
              title="Remove"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {SHADOW_OPTIONS.map((opt) => {
          const active = idx === opt.index;
          return (
            <button
              key={opt.index}
              type="button"
              onClick={() => onChange(setScale(classes, SHADOW, opt.index, bp))}
              aria-pressed={active}
              title={opt.label}
              className={
                "group relative flex aspect-square items-end justify-end p-1.5 transition-colors " +
                (active
                  ? "border-2 border-coral ring-2 ring-coral/30"
                  : "border-2 border-ink/15 hover:border-ink/40")
              }
            >
              <span
                aria-hidden="true"
                className={"absolute inset-2 rounded-sm bg-card " + opt.cls}
              />
              <span className="relative z-10 rounded-sm bg-paper/90 px-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// WCAG contrast chip (ROADMAP §4.1 #6). Reads the selection's bg + text
// colour from `classes` and renders a coloured chip with the WCAG tier
// (AAA / AA / AA Large / Fail) and the computed ratio. Falls back to the
// editor's paper neutral when one side is missing (e.g. headings with
// no explicit text colour) so the chip stays useful for the common
// "white card on coral page" case.
//
// Alpha handling: we read the picker's commit shape (`bg-[#hex]` /
// `text-[#hex]`) and palette names. The /alpha suffix on Tailwind classes
// is intentionally ignored — the chip is a quick guidance number, not a
// pixel-perfect emulation. Translucent stops still get a sensible chip
// because `parseHexFlexible` composites 8-digit hex over white.
const PAPER_HEX = "#F5F1EA";
const INK_HEX = "#0F0F0F";

const TIER_STYLES: Record<WcagTier, { bg: string; fg: string }> = {
  "AAA":      { bg: "#15803D", fg: "#FFFFFF" },
  "AA":       { bg: "#166534", fg: "#FFFFFF" },
  "AA Large": { bg: "#CA8A04", fg: "#0F0F0F" },
  "Fail":     { bg: "#DC2626", fg: "#FFFFFF" },
};

function deriveColor(classes: string[], kind: "bg" | "text"): string | null {
  // 1) arbitrary `<prefix>-[#hex]`
  for (const c of classes) {
    const m = c.match(new RegExp(`^${kind}-\\[#([0-9a-fA-F]{3,8})\\](?:/\\d+)?$`));
    if (m) return `#${m[1]}`;
  }
  // 2) palette token
  const palette = findPaletteClass(classes, kind);
  if (palette) return palette.hex;
  return null;
}

function ContrastChip({ classes }: { classes: string[] }) {
  const bg = deriveColor(classes, "bg") || PAPER_HEX;
  const fg = deriveColor(classes, "text") || INK_HEX;
  const summary = wcagSummary(fg, bg);
  if (!summary) return null;
  const style = TIER_STYLES[summary.tier];
  return (
    <div
      className="flex items-center justify-between gap-2 border-b border-ink/15 px-4 py-1.5 md:px-6"
      title={`Foreground ${fg} on background ${bg}`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        Contrast
      </span>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-4 w-4 border border-ink/40"
          style={{ background: bg }}
        />
        <span
          aria-hidden="true"
          className="-ml-3 inline-flex h-4 w-4 border border-ink/40"
          style={{ background: fg }}
        />
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[10px]"
          style={{ background: style.bg, color: style.fg }}
        >
          {summary.label}
        </span>
      </div>
    </div>
  );
}

// Font family picker (ROADMAP §4.3 #19). Uses the same family list as the
// Font dice (`lib/dice/fonts.ts`) so every option is already pre-loaded
// into the iframe head via `buildFontPreloadUrl` — switching is instant.
//
// Commit shape: Tailwind arbitrary `font-[Family_Name]` (spaces → underscore).
// Match regex must NOT collide with `font-bold` / `font-medium` etc, so the
// bracketed form `^font-\[...\]$` is the only thing this row reads or writes.
const FONT_FAMILY_MATCH = /^font-\[[^\]]+\]$/;

const FONT_FAMILIES: ReadonlyArray<string> = (() => {
  // Unique alphabetised list of every family used by FONTS — display + body
  // dedupe so single-family pairs (Manrope, Rubik, Lora, …) show once.
  const set = new Set<string>();
  for (const pair of FONTS) {
    set.add(pair.display);
    set.add(pair.body);
  }
  return Array.from(set).sort();
})();

function quoteFamily(name: string): string {
  return name.replace(/\s+/g, "_");
}

function unquoteFamily(token: string): string {
  return token.replace(/_/g, " ");
}

function FontFamilyPicker({
  classes,
  onChange,
}: {
  classes: string[];
  onChange: (next: string[]) => void;
}) {
  // Read the first `font-[Family]` arbitrary class — multiple shouldn't
  // exist in normal use; if they do, the first wins on read but commit
  // strips ALL via the match regex so writes converge to a single class.
  const current = classes.find((c) => FONT_FAMILY_MATCH.test(c)) || null;
  const currentFamily = current
    ? unquoteFamily(current.slice("font-[".length, -1))
    : null;

  function commit(family: string | null) {
    const filtered = classes.filter((c) => !FONT_FAMILY_MATCH.test(c));
    if (family) filtered.push(`font-[${quoteFamily(family)}]`);
    onChange(filtered);
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">Font family</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-coral">
            {currentFamily ?? "—"}
          </span>
          {currentFamily && (
            <button
              type="button"
              onClick={() => commit(null)}
              className="px-1 font-mono text-[10px] text-muted hover:text-coral"
              title="Remove"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <select
        value={currentFamily ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          commit(v === "" ? null : v);
        }}
        className="block w-full border-2 border-ink bg-card px-2 py-1 font-mono text-[11px] text-ink focus:border-coral focus:outline-none"
        style={{ fontFamily: currentFamily ? `'${currentFamily}', system-ui, sans-serif` : undefined }}
      >
        <option value="">— Default —</option>
        {FONT_FAMILIES.map((name) => (
          <option key={name} value={name} style={{ fontFamily: `'${name}', system-ui, sans-serif` }}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

// Visual box-model SVG control (ROADMAP §4.1 #7). 4 padding edges (pt/pr/pb/pl)
// + 4 margin edges (mt/mr/mb/ml). Each edge label shows the current Tailwind
// scale value; click an edge to focus it, then ◀ ▶ buttons step through the
// `SPACING` scale. Underlying storage is the same `spacingProp(prefix)` ScaleProp
// used by the sliders below — this is purely presentational.
//
// Reading the current edge value: prefer the side-specific class (`pt-4`)
// over the per-axis (`py-4`) over the all-sides (`p-4`). When neither
// side- nor axis- is present but the all-sides shorthand is, we DISPLAY
// the shorthand value but commit on a side-specific edit will leave the
// shorthand intact and add the side-specific (Tailwind cascade resolves
// to the more specific). The user gets the visual feedback they expect.

type BoxEdgeKey = "pt" | "pr" | "pb" | "pl" | "mt" | "mr" | "mb" | "ml";

const BOX_EDGES: BoxEdgeKey[] = ["pt", "pr", "pb", "pl", "mt", "mr", "mb", "ml"];

const BOX_AXIS_FALLBACK: Record<BoxEdgeKey, ReadonlyArray<string>> = {
  pt: ["py", "p"],
  pr: ["px", "p"],
  pb: ["py", "p"],
  pl: ["px", "p"],
  mt: ["my", "m"],
  mr: ["mx", "m"],
  mb: ["my", "m"],
  ml: ["mx", "m"],
};

function readEdgeIndex(
  classes: string[],
  edge: BoxEdgeKey,
  bp: string = "",
): {
  index: number;
  source: "side" | "axis" | "all" | null;
} {
  const sideIdx = currentIndex(classes, spacingProp(edge), bp);
  if (sideIdx >= 0) return { index: sideIdx, source: "side" };
  for (const fallback of BOX_AXIS_FALLBACK[edge]) {
    const idx = currentIndex(classes, spacingProp(fallback), bp);
    if (idx >= 0) {
      const source = fallback.length === 2 ? "axis" : "all";
      return { index: idx, source };
    }
  }
  return { index: -1, source: null };
}

function BoxModelControl({
  classes,
  onChange,
  bp = "",
}: {
  classes: string[];
  onChange: (next: string[]) => void;
  bp?: string;
}) {
  const [focused, setFocused] = useState<BoxEdgeKey | null>(null);

  const edgeStates = useMemo(() => {
    const out: Record<BoxEdgeKey, ReturnType<typeof readEdgeIndex>> = {} as Record<BoxEdgeKey, ReturnType<typeof readEdgeIndex>>;
    for (const e of BOX_EDGES) out[e] = readEdgeIndex(classes, e, bp);
    return out;
  }, [classes, bp]);

  function step(edge: BoxEdgeKey, delta: number) {
    const cur = edgeStates[edge];
    const SPACING_LEN = 35; // matches lib/tailwind-slider-maps.SPACING
    const next = Math.max(0, Math.min(SPACING_LEN - 1, (cur.index < 0 ? 0 : cur.index) + delta));
    onChange(setScale(classes, spacingProp(edge), next, bp));
    setFocused(edge);
  }

  function clearEdge(edge: BoxEdgeKey) {
    onChange(unsetScale(classes, spacingProp(edge), bp));
  }

  // Arrow keys on the focused edge step through the SPACING scale just
  // like the slider rows below. Shift+arrow jumps 5. Listener attached
  // to the parent div with tabIndex so the SVG is keyboard-reachable.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!focused) return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      step(focused, e.shiftKey ? 5 : 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      step(focused, e.shiftKey ? -5 : -1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setFocused(null);
    }
  }

  function label(edge: BoxEdgeKey): string {
    const st = edgeStates[edge];
    if (st.index < 0) return "—";
    return spacingProp(edge).scale[st.index];
  }

  function inheritIndicator(edge: BoxEdgeKey): string | null {
    const st = edgeStates[edge];
    if (st.source === "axis" || st.source === "all") return st.source === "axis" ? "↳ axis" : "↳ all";
    return null;
  }

  return (
    <div tabIndex={0} onKeyDown={onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-coral/40">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">Box model</span>
        <span className="font-mono text-[10px] text-muted">click an edge → ◀ ▶ or ↑↓ to bump</span>
      </div>
      <svg
        viewBox="0 0 240 160"
        role="img"
        aria-label="Padding and margin box model"
        className="block w-full max-w-[280px] select-none"
        style={{ touchAction: "manipulation" }}
      >
        {/* Margin frame */}
        <rect x="2" y="2" width="236" height="156" fill="#FFF7DA" stroke="#0F0F0F" strokeWidth="1.2" />
        {/* Padding frame */}
        <rect x="40" y="28" width="160" height="104" fill="#F5F1EA" stroke="#0F0F0F" strokeWidth="1.2" />
        {/* Content */}
        <rect x="76" y="56" width="88" height="48" fill="#FFFFFF" stroke="#0F0F0F" strokeWidth="1.2" />
        <text x="120" y="84" textAnchor="middle" dominantBaseline="middle" className="text-[10px]" fill="#0F0F0F" style={{ fontFamily: "monospace", fontSize: 10 }}>
          content
        </text>

        {/* Edge hit zones + labels — ordered so labels render after hit zones for clickability priority */}
        {(() => {
          // Each edge: a clickable strip + a small text label centered in it.
          // Coords reflect the box geometry above.
          const edges: Array<{
            key: BoxEdgeKey;
            x: number; y: number; w: number; h: number;
            tx: number; ty: number;
          }> = [
            // Margin band (between outer & padding frames)
            { key: "mt", x: 40, y: 4, w: 160, h: 22, tx: 120, ty: 16 },
            { key: "mb", x: 40, y: 134, w: 160, h: 22, tx: 120, ty: 146 },
            { key: "ml", x: 4, y: 28, w: 34, h: 104, tx: 21, ty: 80 },
            { key: "mr", x: 202, y: 28, w: 34, h: 104, tx: 219, ty: 80 },
            // Padding band (between padding & content frames)
            { key: "pt", x: 76, y: 30, w: 88, h: 24, tx: 120, ty: 42 },
            { key: "pb", x: 76, y: 106, w: 88, h: 24, tx: 120, ty: 118 },
            { key: "pl", x: 42, y: 56, w: 32, h: 48, tx: 58, ty: 80 },
            { key: "pr", x: 166, y: 56, w: 32, h: 48, tx: 182, ty: 80 },
          ];
          return edges.map((e) => {
            const isFocused = focused === e.key;
            const st = edgeStates[e.key];
            const isInherited = st.source === "axis" || st.source === "all";
            return (
              <g key={e.key}>
                <rect
                  x={e.x}
                  y={e.y}
                  width={e.w}
                  height={e.h}
                  fill={isFocused ? "#FF4D2E22" : "transparent"}
                  stroke={isFocused ? "#FF4D2E" : "transparent"}
                  strokeWidth="1"
                  style={{ cursor: "pointer", pointerEvents: "all" }}
                  onClick={() => setFocused(e.key)}
                />
                <text
                  x={e.tx}
                  y={e.ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isInherited ? "#7A746A" : "#0F0F0F"}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    fontWeight: isFocused ? 700 : 400,
                    pointerEvents: "none",
                  }}
                >
                  {label(e.key)}
                </text>
              </g>
            );
          });
        })()}
      </svg>
      <div className="mt-2 flex items-center gap-2">
        {focused ? (
          <>
            <span className="font-mono text-[10px] text-coral">
              {focused}-{label(focused)}
              {inheritIndicator(focused) && (
                <span className="ml-1 text-muted">{inheritIndicator(focused)}</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => step(focused, -1)}
              className="border border-ink bg-paper px-1.5 py-0.5 font-mono text-[10px] hover:bg-ink hover:text-paper"
              aria-label={`${focused} smaller`}
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => step(focused, +1)}
              className="border border-ink bg-paper px-1.5 py-0.5 font-mono text-[10px] hover:bg-ink hover:text-paper"
              aria-label={`${focused} larger`}
            >
              ▶
            </button>
            {edgeStates[focused].source === "side" && (
              <button
                type="button"
                onClick={() => clearEdge(focused)}
                className="px-1 font-mono text-[10px] text-muted hover:text-coral"
                title="Clear edge override"
              >
                ×
              </button>
            )}
            <button
              type="button"
              onClick={() => setFocused(null)}
              className="ml-auto px-1 font-mono text-[10px] text-muted hover:text-coral"
            >
              done
            </button>
          </>
        ) : (
          <span className="font-mono text-[10px] text-muted">
            Click an edge above to edit it.
          </span>
        )}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  classes,
  prop,
  onChange,
  bp = "",
}: {
  label: string;
  classes: string[];
  prop: ScaleProp;
  onChange: (next: string[]) => void;
  bp?: string;
}) {
  const idx = currentIndex(classes, prop, bp);
  const sliderValue = idx >= 0 ? idx : 0;
  const display = idx >= 0 ? prop.toClass(prop.scale[idx]) : "—";

  // Shift+↑/↓ jumps 5 steps (ROADMAP §4.1 #12). Native ↑/↓ steps by 1 — that
  // works without any handler. We only intercept the shift-modified key so
  // we don't accidentally double-step on plain ↑/↓.
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!e.shiftKey) return;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const delta = e.key === "ArrowUp" ? 5 : -5;
    const cur = idx < 0 ? 0 : idx;
    const next = Math.max(0, Math.min(prop.scale.length - 1, cur + delta));
    onChange(setScale(classes, prop, next, bp));
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">{label}</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-coral">{display}</span>
          {idx >= 0 && (
            <button
              type="button"
              onClick={() => onChange(unsetScale(classes, prop, bp))}
              className="px-1 font-mono text-[10px] text-muted hover:text-coral"
              title="Remove"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={prop.scale.length - 1}
        value={sliderValue}
        onChange={(e) => onChange(setScale(classes, prop, Number(e.target.value), bp))}
        onKeyDown={onKeyDown}
        className="dropin-slider"
      />
    </div>
  );
}

function SegmentedRow<Opt extends string>({
  label,
  options,
  classes,
  match,
  toClass,
  onChange,
  bp = "",
}: {
  label: string;
  options: readonly Opt[];
  classes: string[];
  match: RegExp;
  toClass: (v: Opt) => string;
  onChange: (next: string[]) => void;
  bp?: string;
}) {
  // Read: prefer a class matching the active breakpoint variant; fall back
  // to the unprefixed cascade. Same fallback logic the slider helpers use.
  const current = (() => {
    if (bp) {
      const fromBp = options.find((o) => classes.includes(bp + toClass(o)));
      if (fromBp) return fromBp;
    }
    return options.find((o) => classes.includes(toClass(o))) || null;
  })();
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">{label}</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-coral">
            {current ? toClass(current) : "—"}
          </span>
          {current && (
            <button
              type="button"
              onClick={() => onChange(setToken(classes, match, null, bp))}
              className="px-1 font-mono text-[10px] text-muted hover:text-coral"
              title="Remove"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="seg-group">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            aria-pressed={opt === current}
            onClick={() => onChange(setToken(classes, match, toClass(opt), bp))}
            className="seg-btn"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorRow({
  label,
  kind,
  classes,
  onChange,
  bp = "",
}: {
  label: string;
  kind: "bg" | "text" | "border" | "ring";
  classes: string[];
  onChange: (next: string[]) => void;
  bp?: string;
}) {
  const hex = pickArbitraryHex(classes, kind, bp);
  // Read: prefer a palette class scoped to the active breakpoint variant;
  // fall back to the unprefixed cascade (mirror of currentIndex's logic).
  const paletteClass = (() => {
    if (bp) {
      const bpMatch = colorMatch(kind, bp);
      const fromBp = classes.find((c) => bpMatch.test(c) && !c.includes("["));
      if (fromBp) return fromBp.slice(bp.length);
    }
    const baseMatch = colorMatch(kind);
    return classes.find((c) => baseMatch.test(c) && !c.includes("[")) || null;
  })();
  // Resolve `border-slate-500` → `#64748B` via the palette map so the
  // picker pre-fills with the correct color instead of stale `#000000`.
  // `pickArbitraryHex` already handles `border-[#hex]`, so palette is the
  // remaining unresolved case. (ROADMAP §2.5 / §4.3 #16.)
  const palettePrefill = paletteClass ? findPaletteClass([paletteClass], kind) : null;
  const display = hex || paletteClass || "—";
  const pickerValue = hex || palettePrefill?.hex || "#000000";
  const hasValue = Boolean(hex || paletteClass);
  // Surface the closest palette name when the user is editing an arbitrary
  // hex (`text-[#EF4444]` reads as "≈ red-500"). Skip when the source is
  // already a palette class — `display` already shows the name.
  const nearLabel = hex && !paletteClass ? nearbyPaletteName(hex) : null;
  return (
    <div className="flex items-center gap-2">
      <label className="min-w-0 flex-1 font-mono text-[11px] text-ink">
        {label}
      </label>
      <input
        type="color"
        value={pickerValue}
        onChange={(e) =>
          onChange(setColorClass(classes, kind, e.target.value.toUpperCase(), bp))
        }
        className="dropin-color"
        aria-label={`${label} color`}
      />
      <EyedropperButton
        ariaLabel={`Pick ${label.toLowerCase()} color from screen`}
        onPick={(picked) => onChange(setColorClass(classes, kind, picked, bp))}
      />
      <span
        className="w-24 truncate text-right font-mono text-[10px] text-coral"
        title={nearLabel ? `${display} ≈ ${nearLabel}` : display}
      >
        {nearLabel ? (
          <>
            {display}
            <span className="ml-1 text-muted">≈{nearLabel}</span>
          </>
        ) : (
          display
        )}
      </span>
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange(unsetColorClass(classes, kind, bp))}
          className="px-1 font-mono text-[10px] text-muted hover:text-coral"
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}

function TextEditor({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  const dirty = local !== value;
  return (
    <div className="space-y-2">
      <textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (dirty) onCommit(local);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (dirty) onCommit(local);
          }
        }}
        rows={3}
        className="block w-full resize-y border-2 border-ink bg-card p-2 font-mono text-xs text-ink focus:border-coral focus:outline-none"
      />
      {dirty && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Blur or ⌘↵ to commit
        </p>
      )}
    </div>
  );
}

function ImageSrcEditor({
  src,
  onCommit,
}: {
  src: string;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = useState(src);
  useEffect(() => setLocal(src), [src]);
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      setLocal(url);
      onCommit(url);
    };
    reader.readAsDataURL(file);
  }
  return (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Source
      </label>
      <textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (local !== src) onCommit(local);
        }}
        rows={2}
        className="block w-full resize-y border-2 border-ink bg-card p-2 font-mono text-[11px] text-ink focus:border-coral focus:outline-none"
      />
      <label className="flex cursor-pointer items-center justify-center border border-ink bg-paper px-2 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        Upload local file (data URL)
      </label>
    </div>
  );
}

function AttrRow({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: string;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <div className="space-y-1">
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (local !== value) onCommit(local);
        }}
        className="block w-full border-2 border-ink bg-card px-2 py-1 font-mono text-[11px] text-ink focus:border-coral focus:outline-none"
      />
    </div>
  );
}

function AdvancedSection({
  classString,
  onClassCommit,
  attrs,
  onAttrSet,
  onAttrRemove,
}: {
  classString: string;
  onClassCommit: (v: string) => void;
  attrs: Array<{ key: string; value: string }>;
  onAttrSet: (key: string, value: string) => void;
  onAttrRemove: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="border-b-2 border-ink">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted hover:bg-soft md:px-6"
      >
        <span>Advanced</span>
        <span className="text-ink">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-4 md:px-6">
          <RawClassEditor classString={classString} onCommit={onClassCommit} />
          <AttributesEditor
            attrs={attrs}
            onSet={onAttrSet}
            onRemove={onAttrRemove}
          />
        </div>
      )}
    </section>
  );
}

function RawClassEditor({
  classString,
  onCommit,
}: {
  classString: string;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = useState(classString);
  useEffect(() => setLocal(classString), [classString]);
  const dirty = local !== classString;
  return (
    <div>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Raw class string
      </label>
      <textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (dirty) onCommit(local);
        }}
        rows={3}
        className="block w-full resize-y border-2 border-ink bg-card p-2 font-mono text-[11px] text-ink focus:border-coral focus:outline-none"
      />
    </div>
  );
}

function AttributesEditor({
  attrs,
  onSet,
  onRemove,
}: {
  attrs: Array<{ key: string; value: string }>;
  onSet: (key: string, value: string) => void;
  onRemove: (key: string) => void;
}) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const sorted = useMemo(
    () => [...attrs].sort((a, b) => a.key.localeCompare(b.key)),
    [attrs]
  );
  return (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Attributes
      </label>
      {sorted.length === 0 && (
        <p className="font-mono text-[11px] text-muted">(none)</p>
      )}
      {sorted.map((a) => (
        <AttrTableRow key={a.key} attr={a} onSet={onSet} onRemove={onRemove} />
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const k = newKey.trim();
          if (!k) return;
          onSet(k, newValue);
          setNewKey("");
          setNewValue("");
        }}
        className="flex gap-1 pt-1"
      >
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="key"
          className="w-24 border border-ink bg-card px-2 py-1 font-mono text-[11px] text-ink placeholder:text-muted focus:border-coral focus:outline-none"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="value"
          className="flex-1 border border-ink bg-card px-2 py-1 font-mono text-[11px] text-ink placeholder:text-muted focus:border-coral focus:outline-none"
        />
        <button
          type="submit"
          className="border border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper"
        >
          +
        </button>
      </form>
    </div>
  );
}

function AttrTableRow({
  attr,
  onSet,
  onRemove,
}: {
  attr: { key: string; value: string };
  onSet: (key: string, value: string) => void;
  onRemove: (key: string) => void;
}) {
  const [local, setLocal] = useState(attr.value);
  useEffect(() => setLocal(attr.value), [attr.value]);
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-20 shrink-0 truncate font-mono text-[11px] text-ink"
        title={attr.key}
      >
        {attr.key}
      </span>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (local !== attr.value) onSet(attr.key, local);
        }}
        className="flex-1 border border-ink bg-card px-2 py-1 font-mono text-[11px] text-ink focus:border-coral focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onRemove(attr.key)}
        className="border border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:border-coral hover:text-coral"
        aria-label={`Remove ${attr.key}`}
      >
        ×
      </button>
    </div>
  );
}

function locKey(loc: ElementLoc): string {
  if (loc.kind === "jsx") {
    return `jsx:${loc.startLine}:${loc.startCol}:${loc.endLine}:${loc.endCol}`;
  }
  return `html:${loc.path.join(",")}`;
}
