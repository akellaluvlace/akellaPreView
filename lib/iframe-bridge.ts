import type { PreviewKind } from "./preview";
import type {
  Bounds,
  LayoutContext,
  DropTarget,
  IneligibleDropTarget,
} from "./layout-context";
import type { SoftConstraintWarning } from "./ast/constraints";
import type { VibeElementInfo } from "./vibe-edit/types";

// Phase 5 / Phase B — active tool. Host owns the canonical state
// (Workspace `tool`); iframe receives the value via `dropin:set-tool`
// and gates its click handler + hover painter. Re-exported from
// components/ToolBar.tsx (the visible-to-react name) and mirrored here
// so the message protocol carries a typed tool field without import
// cycles between lib/ and components/.
// 'vibe' was added late (post-Phase-5) for the no-code edit flow.
// In vibe mode the iframe runtime emits selection / mutation events
// against a constrained element set (text/heading/image/link/button)
// and bypasses the FocusEditor modal entirely. See lib/vibe-edit/.
//
// 'swap' was retired in Phase 6 (2026-05-11 PM) — asset swap-from-
// library now lives INSIDE vibe mode (the per-kind Browse buttons
// drive vibe:update-outer + buildVibeCommit's outer-replacement
// path). The standalone tool was redundant. Persisted localStorage
// values of "swap" are migrated to "view" on next mount.
// 'ai' added 2026-05-17 for the AI Edit element + section flow. The
// iframe runtime gates a NEW click handler on DROPIN_TOOL === 'ai'
// (parallel to the vibe handler) that emits `ai:selected` events with
// AiSelectionInfo (fingerprint + bbox + outerHtml + token estimate).
// Plan: `docs/superpowers/plans/2026-05-17-ai-edit-element-section.md`.
export type Tool =
  | "view"
  | "select"
  | "move"
  | "insert"
  | "vibe"
  | "ai";

export interface JsxLoc {
  kind: "jsx";
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  openEndLine: number;
  openEndCol: number;
}

export interface HtmlLoc {
  kind: "html";
  path: number[];
}

export type ElementLoc = JsxLoc | HtmlLoc;

// The minimum an ancestor breadcrumb entry needs to render + select.
// `ElementSelection` extends this so the two types can't drift — adding a new
// required field on the selection flows straight to breadcrumb entries.
export interface ElementDescriptor {
  tag: string;
  loc: ElementLoc;
  classes: string[];
  // Phase 1 OID — present when the source had `data-dropin-id` injected
  // (host-side via `lib/ast/oids.ts`). Absent for HTML mode and for elements
  // the user pasted into Monaco mid-session before a re-inject pass.
  oid?: string | null;
}

export interface ElementSelection extends ElementDescriptor {
  attrs: Array<{ key: string; value: string }>;
  text: string | null;
  hasOnlyTextChildren: boolean;
  isVoid: boolean;
  breadcrumb: ElementDescriptor[];
}

export type IframeToHostMessage =
  | { type: "dropin:ready"; kind: PreviewKind }
  // `nonce` is echoed from a `dropin:reselect` request — its presence is what
  // tells the host "this select is a programmatic sync, not a fresh click".
  // `additive: true` is set by the iframe when the user shift-clicked the
  // element. Host treats it as "add this OID to the multi-select set"; the
  // existing `additionalOids` array gets the prior primary appended and the
  // new payload becomes the primary. Plain clicks omit the field (or send
  // `false`); host then resets the multi-select set. Phase 2 acceptance #13
  // — multi-element coordinated drag — drives the additive path. Always
  // `false` on programmatic reselect (those carry a `nonce` instead).
  | {
      type: "dropin:select";
      selection: ElementSelection;
      nonce?: number;
      additive?: boolean;
    }
  | { type: "dropin:text-commit"; loc: ElementLoc; text: string; tag: string }
  // `reason === "reselect-failed"` means the iframe gave up trying to locate
  // the stored loc after a source edit; default (no reason) = user pressed Esc.
  | { type: "dropin:clear-selection"; reason?: "user" | "reselect-failed" }
  | { type: "dropin:scroll"; y: number }
  | { type: "dropin:error"; message: string }
  // Layer 2 layout-context response. `requestId` echoes the originating
  // request so concurrent in-flight queries don't collide. `context: null`
  // means the iframe couldn't find an element with that OID — typically
  // because the source has the OID but React hasn't rendered the element
  // (conditionally hidden, in a not-yet-loaded portion of the tree, etc.).
  | {
      type: "dropin:layout-context";
      requestId: number;
      context: LayoutContext | null;
    }
  // Live bbox push: iframe runs ResizeObserver / MutationObserver / scroll
  // listeners (rAF-coalesced, FloatingUI autoUpdate pattern). Pushes one
  // message per subscription per frame when the rect actually changes.
  // `rect: null` means the element is no longer in the rendered DOM — the
  // sub stays alive in case the element returns (e.g., conditional
  // rendering); the host should treat null as "hide overlay for now."
  | {
      type: "dropin:bbox";
      subscriptionId: number;
      oid: string;
      rect: Bounds | null;
    }
  // Phase 2 (4c-i) min-content measurement response. `result: null` means
  // the iframe couldn't find an element with that OID, OR the measurement
  // crashed (defensive — the off-screen clone path doesn't read user JS
  // but a hostile MutationObserver could still throw). Same `requestId`
  // correlation as `dropin:layout-context` for concurrent in-flight queries.
  | {
      type: "dropin:min-content-result";
      requestId: number;
      // `hasTextChildren` is the iframe's heuristic answer to "does this
      // element wrap text content directly?" — used by the gesture's
      // constraint chip to add a "(text wrap)" qualifier when the user
      // is about to push width below the longest unbreakable text run
      // (acceptance criterion #7). Non-text elements report `false`.
      result: {
        minWidth: number;
        minHeight: number;
        hasTextChildren: boolean;
      } | null;
    }
  // Phase 2 Step 7 — Soft constraints query response. `warnings: null`
  // when the OID isn't currently rendered or the iframe-side computation
  // crashed (defensive — getComputedStyle / getBoundingClientRect rarely
  // throw but a hostile MutationObserver could still bite). Same
  // requestId correlation as the other request/response pairs.
  | {
      type: "dropin:soft-constraints-result";
      requestId: number;
      warnings: SoftConstraintWarning[] | null;
    }
  // Phase 3 — drop targets query response. `targets: null` when the
  // iframe wasn't ready (e.g. JSX template still booting) or the walk
  // crashed defensively. Empty array when no eligible drop targets
  // exist (rare: the moved element is the only OID-bearing thing on
  // the page). Caller correlates by `requestId`. Cached by gesture
  // for its lifetime — re-fetched only on the next pointerdown.
  // `ineligible` carries OID-bearing elements the walker rejected for
  // gesture feedback (phase 3 polish — leaf-tag containers, descendants
  // of the moved element, etc.). Optional for backward compat with stale
  // iframes; absent or empty array means "no ineligible feedback".
  | {
      type: "dropin:drop-targets-result";
      requestId: number;
      targets: DropTarget[] | null;
      ineligible?: IneligibleDropTarget[];
    }
  // ROADMAP §3.3 — element-tree snapshot. Iframe walks every addressable
  // element under <body>, builds a parent→child hierarchy, and sends one
  // payload per `dropin:ready` (and after host-driven structural commits
  // when the iframe rebuilds). Capped at DROPIN_MAX_TREE_NODES so a
  // 1000-row product grid doesn't blow the message channel; the cap is
  // soft — when it's hit, traversal stops and the host renders what it
  // has + a "tree truncated" hint. Non-addressable wrapper elements are
  // transparent: their children are hoisted under the nearest addressable
  // ancestor.
  | { type: "dropin:tree"; tree: TreeNode[] }
  // Phase 5 / Phase C — Insert tool target confirmation. Sent on click
  // when `DROPIN_TOOL === 'insert'`. The iframe hit-tests the cursor
  // against an eligible container (has OID, not a leaf-tag), then
  // emits the resolved target. Host stores it as `insertTargetOid`
  // and opens the library sidebar scoped to "Insert into <tag>".
  | {
      type: "dropin:insert-target-confirmed";
      oid: string;
      tag: string;
      // Phase 6 ramp — shift-click adds a target instead of replacing.
      // Mirrors the existing select-mode `additive` flag.
      additive?: boolean;
    }
  // Phase E proper — slot envelope readback. Iframe answers a host's
  // `dropin:get-envelope` with raw CSSOM-shaped inputs ready for
  // `parentBoxFromRect` + the child's bbox for drift-baseline math.
  // `result: null` means the OID isn't in the rendered DOM, has no
  // parentElement, or the read crashed defensively. Same `requestId`
  // correlation as the other request/response pairs.
  | {
      type: "dropin:envelope-result";
      requestId: number;
      result: EnvelopeReadback | null;
    }
  // Vibe-edit flow. Emitted only when DROPIN_TOOL === 'vibe'. The
  // runtime gates click/hover on a constrained editable set and
  // sends `vibe:selected` carrying VibeElementInfo (path + htmlPath
  // + oid + tag + kind + text + src/alt/href + computed colours).
  // `vibe:cleared` fires when the user clicks an inert region.
  // `vibe:ready` fires once on script load so the host knows the
  // runtime is wired even before the first selection.
  | { type: "vibe:ready" }
  | { type: "vibe:selected"; info: VibeElementInfo }
  | { type: "vibe:cleared" };

// Phase E proper — Composite payload for `dropin:envelope-result`. Carries
// the parent's raw CSSOM-shaped fields (host calls `parentBoxFromRect` then
// `composeEnvelopeFromBbox`) plus the child's bbox for the drift-baseline
// (post-swap drift compares pre-swap to post-swap on the same element).
export interface EnvelopeReadback {
  parent: {
    rectWidthPx: number;
    rectHeightPx: number;
    paddingLeftPx: number;
    paddingRightPx: number;
    paddingTopPx: number;
    paddingBottomPx: number;
    borderLeftPx: number;
    borderRightPx: number;
    borderTopPx: number;
    borderBottomPx: number;
    aspectRatioCss: string | null;
  };
  childRect: { widthPx: number; heightPx: number } | null;
}

export interface TreeNode {
  tag: string;
  loc: ElementLoc;
  oid: string | null;
  /** First few classes for label hint — full class list lives on the actual selection. */
  classes: ReadonlyArray<string>;
  children: TreeNode[];
}

export type HostToIframeMessage =
  // `oid`, when provided, is the preferred lookup key — the iframe tries
  // `querySelector('[data-dropin-id="..."]')` before falling back to loc.
  // OID match is robust against any source edit that doesn't delete the
  // element; loc match only survives edits that don't shift `startLine:
  // startCol`. Loc is still required for HTML mode (no OIDs) and as a
  // fallback for JSX elements that pre-date OID injection.
  | {
      type: "dropin:reselect";
      loc: ElementLoc;
      oid?: string | null;
      nonce?: number;
    }
  | { type: "dropin:clear" }
  // Layer 2 layout-context request. Iframe responds with a matching
  // `dropin:layout-context` keyed by the same `requestId`.
  | { type: "dropin:get-layout-context"; oid: string; requestId: number }
  // Host-side group-roots auto-detect: the host walks `buildIndex(code)`
  // for capitalized JSX tag names (React component boundaries) and pushes
  // their OIDs as group roots. Iframe replaces its current set on each
  // message — last write wins. Empty array clears the host-driven set;
  // template-author opt-in via `data-dropin-group` attribute is unaffected.
  | { type: "dropin:set-group-roots"; oids: string[] }
  // Live bbox subscription start. SubscriptionId is host-allocated so the
  // host can drive idempotent re-watches across iframe rebuilds (re-sending
  // the same id after dropin:ready creates a fresh sub on the new iframe).
  | { type: "dropin:watch-bbox"; oid: string; subscriptionId: number }
  | { type: "dropin:unwatch-bbox"; subscriptionId: number }
  // Phase 2 (4b) Track A — optimistic in-iframe paint via the managed
  // `<style id="dropin-live">` stylesheet. Per `phase2-manipulation.md`
  // Step 4 + `maniuplation.md` Layer 5 rewrite, host pushes per-rAF style
  // declarations during a drag; iframe upserts a CSS rule keyed by
  // `[data-dropin-id="${id}"]` inside the live stylesheet. React doesn't
  // touch foreign stylesheets so the cascade wins and the optimistic paint
  // survives reconciles. `declarations` is a flat object of CSS property →
  // value pairs in **kebab-case** (matches `CSSStyleDeclaration.setProperty`
  // semantics). Empty `declarations: {}` clears the rule but preserves the
  // sub; `dropin:live-clear` removes the rule entirely (used on
  // `pointercancel` / Esc / commit). Fire-and-forget — no requestId, no
  // response. Track A is per-frame and inherently lossy.
  | {
      type: "dropin:live-style";
      id: string;
      declarations: Record<string, string>;
    }
  | { type: "dropin:live-clear"; id: string }
  // Phase 2 (4c-i) min-content measurement request. Iframe responds with
  // `dropin:min-content-result` keyed by the same `requestId`. Used by the
  // resize gesture at pointerdown to pre-compute the elastic-resistance
  // bound; the gesture starts immediately and constraint kicks in when
  // the response lands (sub-50ms typically).
  | { type: "dropin:get-min-content"; oid: string; requestId: number }
  // Phase 2 Step 5 — Track B FLIP. Host arms a flip at gesture commit by
  // capturing the element's last optimistic rect (`fromRect`, in iframe-
  // viewport coords). After the iframe rebuilds and the canonical render
  // settles, the host computes drift; if the canonical rect differs from
  // `fromRect` by > 1 px positional or > 1% scale, it sends this message
  // to animate the element from its current canonical position back to
  // `fromRect` and then forward over 150 ms ease-out (FLIP — First, Last,
  // Invert, Play). The iframe handles the inverse-transform application,
  // reflow, transition, and cleanup. Fire-and-forget — no requestId, no
  // response. Stale (post-rebuild-but-element-gone) flips are silently
  // dropped on the iframe side. The `id` is the element's stable
  // `data-dropin-id` (NOT loc — loc shifts under text edits).
  | {
      type: "dropin:flip";
      id: string;
      fromRect: { x: number; y: number; width: number; height: number };
    }
  // Phase 2 Step 7 — Soft constraints query. Iframe responds with
  // `dropin:soft-constraints-result` keyed by the same `requestId`.
  // Triggered host-side on selection change + after every commit (resize /
  // spacing / properties panel) so the warning chips stay in sync with
  // the canonical render. Cheap on the iframe (one querySelector + a few
  // computed-style reads + one tree walk for bg resolution); fire-and-
  // forget on the host (no caching beyond the most recent response).
  | { type: "dropin:get-soft-constraints"; oid: string; requestId: number }
  // Phase 3 — drop targets query. Iframe returns every visible OID-
  // bearing container that can accept children, EXCLUDING `excludeOids`
  // (each member's subtree is filtered too, so the moved set can't be
  // dropped into itself). Iframe responds with `dropin:drop-targets-result`
  // keyed by the same `requestId`. Used by the reparent gesture at
  // pointerdown to populate its target cache; the host hit-tests cursor
  // against the cached targets per pointermove without further RPC
  // traffic. Multi-element selections pass an array; single-element
  // gestures pass a one-element array.
  | {
      type: "dropin:get-drop-targets";
      excludeOids: string[];
      requestId: number;
    }
  // ROADMAP §3.5 polish — preset hover preview. Iframe stashes the
  // element's current `class` attribute in a per-OID Map and replaces
  // it with the supplied tokens; on `dropin:hover-clear` it restores
  // the stashed value. Pure DOM mutation (className=), not the live
  // stylesheet (the live stylesheet routes CSS declarations, but
  // presets are class-name swaps and Tailwind utilities only paint
  // when their selectors match). React doesn't re-render the iframe
  // during a hover (no source change), so the swap survives until the
  // host posts hover-clear. On commit (PresetTile click) the host
  // does its own setCode which rebuilds the iframe; no manual clear
  // required, but the host should still post hover-clear in the
  // mouseleave handler before the click lands so a not-clicked hover
  // doesn't leak into post-rebuild paint.
  | {
      type: "dropin:hover-preview";
      id: string;
      classes: ReadonlyArray<string>;
    }
  | { type: "dropin:hover-clear"; id: string }
  // Phase 5 / Phase B — tool sync. Host pushes the current tool whenever
  // it changes AND on every `dropin:ready` so iframe rebuilds (srcDoc
  // swaps) re-receive the canonical value. Iframe stores it in a
  // module-level `DROPIN_TOOL` var. Click handler bails when
  // `DROPIN_TOOL === "view"`; hover-target outline only paints in
  // `select` / `move`. Insert / Swap have their own iframe-side hover
  // behaviours wired in Phase C.
  | { type: "dropin:set-tool"; tool: Tool }
  // Phase E proper — slot envelope query. Iframe answers with
  // `dropin:envelope-result` keyed by the same `requestId`. Used by
  // Workspace's swap-handler at swap-invoke time to feed
  // `composeEnvelopeFromBbox` → `slotCapacityFits` for the LibraryModal
  // compatibility filter, and again post-swap as the drift-baseline pre.
  | { type: "dropin:get-envelope"; oid: string; requestId: number }
  // Vibe-edit direct-mutation commands. The runtime mutates the live
  // iframe DOM (textContent / element.style.color / setAttribute) so
  // changes appear instantly without an iframe srcDoc rebuild. Source
  // is reconciled lazily by the host after a debounce via buildVibeCommit
  // (see lib/vibe-edit/commit.ts). `path` is a CSS selector for in-iframe
  // addressing — the iframe uses document.querySelector(path) to find the
  // element each time. If the element no longer matches (rare; structural
  // edits via the Library would invalidate paths), the command is a
  // silent no-op and the host's next selection will reconcile.
  | { type: "vibe:update-content"; path: string; text: string }
  | {
      type: "vibe:update-style";
      path: string;
      // camelCase CSS property names — see lib/vibe-edit/types.ts
      // VibeCommand for the rationale on the open-shape choice.
      styles: Record<string, string>;
    }
  | {
      type: "vibe:update-image";
      path: string;
      src?: string;
      alt?: string;
    }
  | { type: "vibe:update-link"; path: string; href: string }
  // Icon swap. Replaces the SVG element's outerHTML wholesale with the
  // selected library asset. The runtime injects `oid` into the new
  // outer's first opening tag (when non-null) so post-swap selections
  // still resolve via OID. After the swap the runtime re-finds the
  // element at the same `path` and re-emits vibe:selected so the host
  // panel stays in sync without an iframe rebuild.
  | {
      type: "vibe:update-outer";
      path: string;
      oid: string | null;
      newOuter: string;
    }
  // Full class-list overwrite. Drives the typography sliders in vibe
  // mode. Iframe sets the element's class attribute and re-emits
  // vibe:selected so info.classes propagates back. Source patches
  // through patchJsxClassByOid / patchHtmlClass on idle.
  | { type: "vibe:update-classes"; path: string; classes: string }
  | { type: "vibe:select"; path: string }
  | { type: "vibe:clear" };

export const DROPIN_SOURCE = "dropin-preview";

// Single source of truth for which iframe→host message types are recognised.
// `satisfies readonly IframeToHostMessage["type"][]` only checks members are
// valid types — it does NOT verify exhaustiveness, so a new union variant
// can silently fall off this list. The `Exhaustive` check below catches that.
const IFRAME_MESSAGE_TYPES = [
  "dropin:ready",
  "dropin:select",
  "dropin:text-commit",
  "dropin:clear-selection",
  "dropin:scroll",
  "dropin:error",
  "dropin:layout-context",
  "dropin:bbox",
  "dropin:min-content-result",
  "dropin:soft-constraints-result",
  "dropin:drop-targets-result",
  "dropin:tree",
  "dropin:insert-target-confirmed",
  "dropin:envelope-result",
  "vibe:ready",
  "vibe:selected",
  "vibe:cleared",
] as const satisfies readonly IframeToHostMessage["type"][];

// Compile-time exhaustiveness guard: makes TS error if a new variant is added
// to `IframeToHostMessage` without being listed above. Works by asserting that
// every union member is assignable to the listed-tuple's element type.
type _IframeMessageTypesExhaustive =
  IframeToHostMessage["type"] extends (typeof IFRAME_MESSAGE_TYPES)[number]
    ? true
    : never;
const _iframeMessageTypesExhaustive: _IframeMessageTypesExhaustive = true;
void _iframeMessageTypesExhaustive;

const IFRAME_MESSAGE_TYPE_SET: ReadonlySet<string> = new Set(IFRAME_MESSAGE_TYPES);

export function isIframeMessage(
  data: unknown
): data is IframeToHostMessage & { __dropin: true } {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (d.__dropin !== true) return false;
  if (typeof d.type !== "string") return false;
  return IFRAME_MESSAGE_TYPE_SET.has(d.type);
}

export function locsEqual(a: ElementLoc | null, b: ElementLoc | null): boolean {
  if (!a || !b) return a === b;
  if (a.kind !== b.kind) return false;
  if (a.kind === "jsx" && b.kind === "jsx") {
    return (
      a.startLine === b.startLine &&
      a.startCol === b.startCol &&
      a.endLine === b.endLine &&
      a.endCol === b.endCol
    );
  }
  if (a.kind === "html" && b.kind === "html") {
    return (
      a.path.length === b.path.length &&
      a.path.every((v, i) => v === b.path[i])
    );
  }
  return false;
}

export function encodeJsxLoc(loc: JsxLoc): string {
  return `${loc.startLine}:${loc.startCol}:${loc.endLine}:${loc.endCol}:${loc.openEndLine}:${loc.openEndCol}`;
}

export function decodeJsxLoc(s: string): JsxLoc | null {
  const parts = s.split(":").map((n) => Number(n));
  if (parts.length !== 6 || parts.some((n) => !Number.isFinite(n))) return null;
  const [startLine, startCol, endLine, endCol, openEndLine, openEndCol] = parts;
  return {
    kind: "jsx",
    startLine,
    startCol,
    endLine,
    endCol,
    openEndLine,
    openEndCol,
  };
}
