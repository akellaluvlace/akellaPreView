"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dlog } from "@/lib/debug";
import { buildPreviewDocument, type PreviewKind } from "@/lib/preview";
import {
  encodeJsxLoc,
  isIframeMessage,
  type ElementLoc,
  type ElementSelection,
  type EnvelopeReadback,
  type HostToIframeMessage,
  type Tool,
  type TreeNode,
} from "@/lib/iframe-bridge";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import type {
  Bounds,
  DropTarget,
  IneligibleDropTarget,
  LayoutContext,
} from "@/lib/layout-context";
import type { SoftConstraintWarning } from "@/lib/ast/constraints";
import SelectionOverlay from "./SelectionOverlay";

// Verbose tracing was useful while building the iframe bridge but is
// now console noise on every preview rebuild. Flip DEBUG_LOGS to true
// to bring back the per-message trail; selection / error events stay
// on through `track` so the console still shows what matters when you
// click an element or hit a real failure.
const DEBUG_LOGS = false;
function log(msg: string, data?: unknown) {
  if (DEBUG_LOGS) dlog(`[dropin:Preview] ${msg}`, data ?? "");
}
function track(msg: string, data?: unknown) {
  dlog(`[dropin:Preview] ${msg}`, data ?? "");
}

export type Viewport = "desktop" | "tablet" | "mobile";

// Imperative handle exposed to consumers via `onReady`. Mirrors the
// `EditorHandle` pattern in `components/Editor.tsx` — callback prop avoids
// the forwardRef-through-next/dynamic flakiness in Next 14. Phase 2 drag
// handles + the future Layer 3 intent resolver consume this.
export interface PreviewHandle {
  // Layer 2 query: ask the iframe for the rendered layout context for an OID.
  // Resolves null when the OID isn't currently rendered (conditionally
  // hidden, not yet mounted) or when the iframe fails to respond within
  // `LAYOUT_CTX_TIMEOUT_MS`. Caller doesn't need to dedupe — concurrent
  // queries to different OIDs are independent (correlated by requestId).
  requestLayoutContext: (oid: string) => Promise<LayoutContext | null>;
  // Subscribe to live bbox updates for an OID. Iframe pushes a
  // dropin:bbox per frame whenever the rect changes (rAF-coalesced over
  // ResizeObserver / MutationObserver / scroll events). `rect: null`
  // means the element isn't currently in the DOM — either conditionally
  // unmounted or not yet rendered. The subscription survives iframe
  // rebuilds: the host re-sends the watch with the same subscriptionId
  // after dropin:ready and the iframe creates a fresh sub. Returned
  // unsubscriber posts dropin:unwatch-bbox and removes the local entry.
  watchBbox: (
    oid: string,
    callback: (rect: Bounds | null) => void
  ) => () => void;
  // Phase 2 (4b) Track A. During a drag the consumer (drag controller in
  // SelectionOverlay or a future DragOverlay component) calls these per
  // frame to push optimistic style declarations into the iframe's
  // `<style id="dropin-live">` element. `setLiveStyle` upserts — passing
  // the full declaration set each call is intentional (host owns the
  // snapshot; iframe replace-not-merge per maniuplation.md Layer 5).
  // `clearLiveStyle` removes the rule entirely on `pointerup` (after the
  // canonical Track B source rewrite has rendered) and on cancel
  // (`pointercancel`/Esc/`window.blur`). Fire-and-forget — no
  // correlation, no promise. Iframe rebuilds nuke the live stylesheet
  // automatically (it's part of the iframe DOM); the host doesn't need
  // to replay live styles after `dropin:ready` because by definition the
  // gesture is over before a rebuild happens.
  setLiveStyle: (oid: string, declarations: Record<string, string>) => void;
  clearLiveStyle: (oid: string) => void;
  // Phase 2 (4c-i) min-content pre-measurement. Called once at pointerdown
  // to fetch the element's intrinsic min-content dimensions; resolves null
  // when the OID isn't currently rendered or the iframe didn't respond
  // within `MIN_CONTENT_TIMEOUT_MS`. Caller doesn't need to dedupe —
  // concurrent queries are independent (correlated by requestId), but in
  // practice only one gesture fires at a time so concurrency doesn't matter.
  // (Twelfth-pass-plus refactor) Result now carries `hasTextChildren` so
  // the constraint chip can add a "(text wrap)" qualifier on text-bearing
  // elements (acceptance criterion #7).
  requestMinContent: (
    oid: string
  ) => Promise<{
    minWidth: number;
    minHeight: number;
    hasTextChildren: boolean;
  } | null>;
  // Phase 2 Step 7 — soft constraints query. Returns the warning list
  // for the OID's current canonical render (touch-target / text-size /
  // aspect-distorted / contrast / overflow). Resolves null on timeout
  // or when the OID isn't currently rendered. Host calls this on
  // selection change + after every commit; gesture handlers don't call
  // it (warnings during a drag would be wrong because the live
  // stylesheet is overriding the canonical styles).
  requestSoftConstraints: (
    oid: string
  ) => Promise<SoftConstraintWarning[] | null>;
  // Phase 2 Step 5 (Track B FLIP). Host arms a flip with the element's
  // last-seen optimistic rect; the iframe runtime computes the inverse
  // transform from its current canonical position back to `fromRect` and
  // animates over 150 ms ease-out. Fire-and-forget — no correlation, no
  // promise. Caller (drift detector in SelectionOverlay) must gate on the
  // 1 px / 1% threshold (`detectDrift` in `lib/ast/flip.ts`) before
  // sending; the iframe will still no-op on near-zero deltas as belt-and-
  // braces, but doing the gate host-side avoids a postMessage trip.
  // Coordinate frame: iframe-VIEWPORT coords (same frame as `Bounds`
  // returned by watchBbox).
  requestFlip: (oid: string, fromRect: Bounds) => void;
  // Phase 3 — drop targets query. Returns every visible OID-bearing
  // container that can accept children (excluding every OID in
  // `excludeOids` and their descendants). Resolves null when the iframe
  // didn't respond within `LAYOUT_CTX_TIMEOUT_MS` (or returned an
  // explicit null on a defensive failure). Used by the reparent gesture
  // at pointerdown to populate its target cache; the host hit-tests
  // cursor against the cached array without further RPC traffic during
  // the drag.
  //
  // (Phase 3 polish) Returns BOTH eligible (`targets`) and ineligible
  // (`ineligible`) lists. Ineligible entries get red-outline feedback
  // when the cursor hovers them — no commit, but the user sees why
  // their drop fails over an <img> / <input> / a descendant of the
  // moved element. `targets: null` still means "iframe didn't respond";
  // the gesture treats both as no-op. Multi-element selections pass
  // every participant; single-element gestures pass a one-element array.
  requestDropTargets: (
    excludeOids: string[]
  ) => Promise<{
    targets: DropTarget[];
    ineligible: IneligibleDropTarget[];
  } | null>;
  // Phase E proper — slot envelope readback for the LibraryModal swap
  // compatibility filter + post-swap drift assessment. Resolves null when
  // the OID isn't rendered, the element has no parent, or the iframe didn't
  // respond within `LAYOUT_CTX_TIMEOUT_MS`. Caller turns the raw payload
  // into a typed SlotEnvelope via `parentBoxFromRect` +
  // `composeEnvelopeFromBbox` (see `lib/swap/envelope-from-bbox.ts`).
  requestEnvelope: (oid: string) => Promise<EnvelopeReadback | null>;
  // Vibe-edit direct-mutation channel. The handle accepts the full
  // VibeCommand union (vibe:update-content / -style / -image / -link
  // / -select / -clear); callers don't need helper wrappers because
  // every command shape is self-describing.
  postVibe: (
    cmd:
      | Extract<HostToIframeMessage, { type: `vibe:${string}` }>,
  ) => void;
  // 2026-05-20 — Publish flow: capture the iframe's current rendered
  // HTML so the host can sanitize + zip it for Netlify Drop. Returns
  // null when the iframe ref is unmounted or the contentDocument is
  // cross-origin (shouldn't happen — srcdoc + same-origin sandbox).
  snapshotHtml: () => string | null;
}

interface PreviewProps {
  code: string;
  kind: PreviewKind;
  viewport: Viewport;
  // Phase 5 / Phase B — active tool. Drives:
  //   · SelectionOverlay mounts only when select / move (read-only-by-
  //     default for view; insert / swap render their own affordances
  //     in Phase C).
  //   · Iframe-side click + hover gating via the dropin:set-tool
  //     message — fired whenever this prop changes AND replayed on
  //     every dropin:ready so iframe rebuilds re-receive the value.
  // Optional: when omitted (legacy callers), defaults to 'select' to
  // preserve the pre-Phase-5 always-on behaviour.
  tool?: Tool;
  selectedLoc: ElementLoc | null;
  // Phase 1 OID-keyed reselect: when present, the iframe tries OID match
  // first and falls back to loc. More robust against source edits that
  // shift the element's startLine:startCol (which the loc-only matcher
  // can't survive). Always null in HTML mode (no OIDs) and for elements
  // pasted into Monaco mid-session before a re-inject pass.
  selectedOid?: string | null;
  // Selected element's tag name. Surfaced in the host overlay's label badge
  // (e.g. "div 320×48"). Optional because HTML mode and pre-OID JSX selections
  // never reach the host overlay anyway — passing or omitting is harmless.
  selectedTag?: string | null;
  // Phase 2 acceptance #13 — additional OIDs in the multi-select set.
  // The primary OID is `selectedOid`; these are the rest. SelectionOverlay
  // subscribes to a bbox per additional OID, renders a thin secondary
  // outline, and broadcasts gesture deltas to all participants. Empty
  // (or undefined) means single-select — gesture takes the existing
  // single-element commit path through `onResize`/`onSpacing`. With one
  // or more entries, gesture commits route through
  // `onResizeMulti`/`onSpacingMulti` instead.
  additionalOids?: string[];
  // Host-driven group-root OIDs: capitalized JSX tag names (React component
  // boundaries) collected from `buildIndex(code)` upstream. Replace-not-merge
  // semantics — the iframe wipes its host-driven set on every push. Iframe
  // also resets on srcDoc rebuild, so we re-post on `dropin:ready` to repopulate
  // the new iframe instance. Empty / undefined = clear the host-driven set
  // (template-author `data-dropin-group` attributes still take effect).
  groupRootOids?: string[];
  // Phase 2 acceptance #13 — callback now carries an `additive` flag.
  // The iframe sets it true on shift-click; host appends to the multi-
  // select set instead of replacing.
  onSelectionChange: (
    selection: ElementSelection | null,
    fromReselect: boolean,
    additive: boolean
  ) => void;
  onTextCommit: (loc: ElementLoc, text: string, tag: string) => void;
  onIframeError?: (message: string) => void;
  onReady?: (handle: PreviewHandle) => void;
  // Vibe-edit selection callbacks. Fire only when DROPIN_TOOL ===
  // 'vibe' (the iframe runtime gates emission). Optional so existing
  // callers that don't use vibe mode don't have to thread through
  // empty stubs.
  onVibeSelected?: (info: VibeElementInfo) => void;
  onVibeCleared?: () => void;
  // Phase 2 (4b) resize commit. Workspace routes the declarations through
  // `applyStyleProps` against the current source and pushes the result via
  // `setCode` (history-aware via `useEditHistory`). Returns `true` iff the
  // operation produced a real source change — `false` means the engine
  // bailed (e.g. style attribute is `cn(...)`-flavored). The host overlay
  // uses the return value to decide whether to clear the optimistic Track A
  // stylesheet (clear on bail; let the iframe rebuild flush it on commit).
  // Optional: when undefined, the corner/edge handles render but stay
  // render-only (Phase 2 4a behavior).
  //
  // (Twelfth-pass refactor) Signature is now a flat declaration map. The
  // gesture path runs `resolveResizeIntent` and packs the resolved CSS
  // props (e.g. `width` for block children, `flexBasis` for flex-row
  // growing children — acceptance criterion #11) into the map. `null`
  // values remove the prop; the gesture path doesn't currently emit
  // null but `applyStyleProps` accepts it.
  onResize?: (
    oid: string,
    declarations: Record<string, string | null>
  ) => boolean;
  // Phase 2 (4d) spacing commit. Same shape as `onResize` but with the
  // padding/margin side bag. When provided, the 4 padding + 4 margin
  // dashed handles in SelectionOverlay become interactive. Independent
  // of `onResize` — passing one without the other is supported.
  onSpacing?: (
    oid: string,
    kind: "padding" | "margin",
    sides: { top?: string; right?: string; bottom?: string; left?: string }
  ) => boolean;
  // Phase 2 acceptance #13 — multi-element coordinated commit. Called by
  // SelectionOverlay's gesture handlers when `additionalOids.length > 0`.
  // Single-element flow stays on `onResize`/`onSpacing` so existing benches
  // and acceptance criteria don't regress. Workspace iterates each op
  // through `applyStyleProps` / `applySpacing` against a running source
  // and pushes a single setCode → one undo entry covers all elements.
  onResizeMulti?: (
    ops: Array<{
      oid: string;
      declarations: Record<string, string | null>;
    }>
  ) => boolean;
  onSpacingMulti?: (
    ops: Array<{
      oid: string;
      kind: "padding" | "margin";
      sides: { top?: string; right?: string; bottom?: string; left?: string };
    }>
  ) => boolean;
  // Phase 3 — reorder commit. Workspace routes through `applyReorder`
  // and returns true iff source changed. Together with `onReparent`,
  // wires up the position-handle drag gesture in SelectionOverlay.
  onReorder?: (oid: string, parentOid: string, toIndex: number) => boolean;
  // Phase 3 — reparent commit. `propsToRemove` is computed by the gesture
  // based on flex / non-flex destination direction; Workspace passes
  // straight through to `applyReparent`. `newParentTag` is the lowercased
  // tag name of the destination (e.g. "main", "section") — Workspace
  // uses it in the success toast: "Moved to <main>. Removed: flex-grow."
  // per `phase2-manipulation.md` line 555. Optional for forward compat
  // with non-gesture callers.
  onReparent?: (
    oid: string,
    newParentOid: string,
    insertIndex: number,
    propsToRemove?: string[],
    newParentTag?: string
  ) => boolean;
  // Phase 3 polish — multi-element reorder + reparent commits. Called
  // when the gesture's `additionalOids` is non-empty. Workspace
  // iterate-and-batches each op against a running source string and
  // pushes a single setCode → one undo entry across the multi-select.
  // Optional: when omitted, the gesture falls back to single-element
  // commit on the primary only (additionals snap back to origin).
  onReorderMulti?: (
    ops: Array<{ oid: string; parentOid: string; toIndex: number }>
  ) => boolean;
  onReparentMulti?: (
    ops: Array<{
      oid: string;
      newParentOid: string;
      insertIndex: number;
      propsToRemove?: string[];
    }>,
    newParentTag?: string
  ) => boolean;
  // Phase 3 polish (seventeenth pass) — duplicate / delete commits.
  // Single-element + multi-element variants. When wired, the overlay
  // renders a small two-button toolbar above the bbox top-right so
  // trackpad-only users have an affordance alongside the Cmd+D /
  // Backspace keyboard shortcuts in Workspace.
  onDuplicate?: (oid: string) => boolean;
  onDelete?: (oid: string) => boolean;
  onDuplicateMulti?: (oids: ReadonlyArray<string>) => boolean;
  onDeleteMulti?: (oids: ReadonlyArray<string>) => boolean;
  // Notifies the caller after a successful delete so the parent can
  // drop the now-stale selection state. Optional.
  onDeleteCompleted?: () => void;
  // ROADMAP §3.3 — element-tree push. Iframe emits one tree per
  // `dropin:ready`. Host caches the most recent payload + propagates
  // to the ElementTree sidebar. Empty array = page hadn't rendered any
  // addressable elements yet (rare; typically a parse / runtime error).
  // Optional — when omitted, the iframe still emits but the host
  // discards.
  onTreeUpdate?: (tree: TreeNode[]) => void;
  // Eighteenth-pass — tree-row hover highlight. When non-null, Preview
  // pushes a coral dashed outline live-style for that OID so the user
  // can locate the corresponding element in the canvas without
  // clicking. When it transitions back to null (or to a different
  // OID), the previous OID's live-style clears. Driven by Workspace
  // state, set by ElementTree row mouseenter/leave callbacks.
  hoverHighlightOid?: string | null;
  // Phase 5 / Phase C — Insert tool target confirmation. Iframe emits
  // dropin:insert-target-confirmed on click while in insert mode (after
  // hit-testing the cursor against an eligible container). Workspace
  // routes this to applyInsertChild via its handleInsertInto handler.
  // Optional — when omitted, the iframe still emits and the host
  // discards. The optional `additive` flag (true when shift-click in
  // Insert mode) lets the host accumulate multi-target insert lists.
  onInsertTarget?: (oid: string, tag: string, additive?: boolean) => void;
}

const LAYOUT_CTX_TIMEOUT_MS = 1000;
const MIN_CONTENT_TIMEOUT_MS = 1000;

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export default function Preview({
  code,
  kind,
  viewport,
  tool = "select",
  selectedLoc,
  selectedOid = null,
  selectedTag = null,
  additionalOids,
  groupRootOids,
  onSelectionChange,
  onTextCommit,
  onIframeError,
  onReady,
  onResize,
  onSpacing,
  onResizeMulti,
  onSpacingMulti,
  onReorder,
  onReparent,
  onReorderMulti,
  onReparentMulti,
  onDuplicate,
  onDelete,
  onDuplicateMulti,
  onDeleteMulti,
  onDeleteCompleted,
  onTreeUpdate,
  hoverHighlightOid = null,
  onInsertTarget,
  onVibeSelected,
  onVibeCleared,
}: PreviewProps) {
  const [debouncedCode, setDebouncedCode] = useState(code);
  const [debouncedKind, setDebouncedKind] = useState(kind);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const selectedLocRef = useRef<ElementLoc | null>(selectedLoc);
  const selectedOidRef = useRef<string | null>(selectedOid);
  // ROADMAP §3.3 — keep latest tree consumer on a ref so the message
  // handler (which has empty deps) can call the freshest callback after
  // a render that swapped the prop value.
  const onTreeUpdateRef = useRef(onTreeUpdate);
  useEffect(() => {
    onTreeUpdateRef.current = onTreeUpdate;
  }, [onTreeUpdate]);
  // Phase 5 / Phase C — same ref pattern for the insert-target callback
  // so the empty-deps message handler always calls the freshest version.
  const onInsertTargetRef = useRef(onInsertTarget);
  useEffect(() => {
    onInsertTargetRef.current = onInsertTarget;
  }, [onInsertTarget]);
  // Vibe-edit selection callbacks via the same ref pattern.
  const onVibeSelectedRef = useRef(onVibeSelected);
  const onVibeClearedRef = useRef(onVibeCleared);
  useEffect(() => {
    onVibeSelectedRef.current = onVibeSelected;
  }, [onVibeSelected]);
  useEffect(() => {
    onVibeClearedRef.current = onVibeCleared;
  }, [onVibeCleared]);
  // Latest group-root OIDs, kept on a ref so the dropin:ready handler can
  // re-post the freshest set without taking a stale closure over an older
  // prop value. Empty default keeps the postMessage cheap when the consumer
  // doesn't pass anything.
  const groupRootOidsRef = useRef<string[]>(groupRootOids ?? []);
  // Phase 5 / Phase B — same pattern for the active tool. The
  // dropin:ready handler reads from here so iframe rebuilds get the
  // canonical value regardless of timing relative to the tool prop's
  // useEffect push.
  const toolRef = useRef<Tool>(tool);
  const scrollYRef = useRef(0);
  // Layer 2 layout-context request correlation: { requestId → resolveFn }.
  // Each `requestLayoutContext` call mints a fresh id and parks its resolver
  // here; the dropin:layout-context message handler picks it up by id.
  // A 1s timeout sweeper ensures a missing iframe response (because the
  // iframe got blown away mid-flight by a srcDoc rebuild, say) doesn't
  // strand the promise indefinitely — caller resolves null.
  const pendingLayoutCtxRef = useRef<
    Map<number, (ctx: LayoutContext | null) => void>
  >(new Map());
  const nextLayoutCtxIdRef = useRef(1);
  // (4c-i) Min-content request correlation. Same shape as the layout-ctx
  // ref above — separate map so timeouts and rebuild-flushes don't have to
  // discriminate by message kind.
  const pendingMinContentRef = useRef<
    Map<
      number,
      (
        r: {
          minWidth: number;
          minHeight: number;
          hasTextChildren: boolean;
        } | null
      ) => void
    >
  >(new Map());
  const nextMinContentIdRef = useRef(1);
  // Step 7 soft-constraints request correlation. Same shape as the layout-
  // ctx / min-content refs.
  const pendingSoftConstraintsRef = useRef<
    Map<number, (warnings: SoftConstraintWarning[] | null) => void>
  >(new Map());
  const nextSoftConstraintsIdRef = useRef(1);
  // Phase 3 drop-targets request correlation. Same shape as the others.
  // Resolves with `{ targets, ineligible }` so the gesture renders both
  // green (eligible) and red (ineligible) feedback without a second RPC.
  const pendingDropTargetsRef = useRef<
    Map<
      number,
      (
        result: {
          targets: DropTarget[];
          ineligible: IneligibleDropTarget[];
        } | null
      ) => void
    >
  >(new Map());
  const nextDropTargetsIdRef = useRef(1);
  // Phase E proper — envelope request correlation. Same shape as the others.
  const pendingEnvelopeRef = useRef<
    Map<number, (result: EnvelopeReadback | null) => void>
  >(new Map());
  const nextEnvelopeIdRef = useRef(1);
  // Live bbox subscriptions: keyed by host-allocated subscriptionId. Map
  // value carries both the original `oid` (so we can replay the watch
  // after iframe rebuild) and the consumer callback (so dropin:bbox
  // dispatch is O(1)). Subscriptions persist across iframe rebuilds —
  // the dropin:ready handler re-pushes every entry's watch-bbox.
  const bboxSubsRef = useRef<
    Map<number, { oid: string; callback: (rect: Bounds | null) => void }>
  >(new Map());
  const nextBboxIdRef = useRef(1);
  // Nonce protocol: every outbound `dropin:reselect` gets a fresh nonce,
  // which the iframe echoes back on the matching `dropin:select`. An
  // incoming select with a matching nonce is a programmatic sync; anything
  // without a nonce (or a stale one) is a fresh user click and must open
  // focus mode. This fixes the race where a user click during the iframe's
  // 12×40ms retry window was wrongly tagged as a reselect echo.
  const nextNonceRef = useRef(1);
  const pendingNonceRef = useRef<number | null>(null);
  // The dedupe key for the last reselect we POSTED. Phase 1 OID-primary:
  // when a selection has an OID, the key is `oid:<id>`; otherwise it's a
  // loc-derived fallback (HTML mode + JSX elements pasted mid-session
  // without an OID re-inject pass). Without this dedupe, the effect would
  // loop: post reselect → iframe echoes select → Workspace setSelection
  // produces a new ref → effect fires → post reselect → ...
  //
  // OID-primary matters when source edits shift the element's loc but not
  // its identity: the key stays `oid:<id>` and the effect correctly skips
  // the redundant reselect (loc-primary would re-fire for the new loc).
  const lastReselectKeyRef = useRef<string | null>(null);

  function selectionKey(oid: string | null, loc: ElementLoc | null): string | null {
    if (oid) return `oid:${oid}`;
    if (!loc) return null;
    if (loc.kind === "jsx") return `jloc:${encodeJsxLoc(loc)}`;
    return `hloc:${loc.path.join(".")}`;
  }

  useEffect(() => {
    selectedLocRef.current = selectedLoc;
  }, [selectedLoc]);

  useEffect(() => {
    selectedOidRef.current = selectedOid;
  }, [selectedOid]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedCode(code);
      setDebouncedKind(kind);
    }, 250);
    return () => clearTimeout(id);
  }, [code, kind]);

  const srcDoc = useMemo(
    () =>
      buildPreviewDocument({
        code: debouncedCode,
        kind: debouncedKind,
        restoreScrollY: scrollYRef.current,
      }),
    [debouncedCode, debouncedKind]
  );

  useEffect(() => {
    log("code prop changed → scheduling debounced srcDoc rebuild in 250ms", { codeLen: code.length });
  }, [code]);

  // When srcDoc changes, the iframe reloads and must re-announce ready.
  // The iframe also lost its [data-dropin-selected] state, so clear our
  // dedupe ref — the dropin:ready handler must be allowed to re-send the
  // reselect for the same loc to repaint selection in the fresh DOM.
  // Pending layout-context requests are also stranded by the rebuild —
  // resolve them as null now rather than letting them dangle until the
  // 1s timeout fires.
  useEffect(() => {
    log("srcDoc rebuilt → iframe will reload", { srcDocLen: srcDoc.length });
    dlog(
      `[dropin:lifecycle] srcDoc changed → readyRef=false (len=${srcDoc.length})`,
    );
    readyRef.current = false;
    lastReselectKeyRef.current = null;
    const pending = pendingLayoutCtxRef.current;
    if (pending.size > 0) {
      log(`flushing ${pending.size} pending layout-context request(s) on rebuild`);
      pending.forEach((fn) => fn(null));
      pending.clear();
    }
    const pendingMc = pendingMinContentRef.current;
    if (pendingMc.size > 0) {
      log(`flushing ${pendingMc.size} pending min-content request(s) on rebuild`);
      pendingMc.forEach((fn) => fn(null));
      pendingMc.clear();
    }
    const pendingSc = pendingSoftConstraintsRef.current;
    if (pendingSc.size > 0) {
      log(`flushing ${pendingSc.size} pending soft-constraints request(s) on rebuild`);
      pendingSc.forEach((fn) => fn(null));
      pendingSc.clear();
    }
    const pendingDt = pendingDropTargetsRef.current;
    if (pendingDt.size > 0) {
      log(`flushing ${pendingDt.size} pending drop-targets request(s) on rebuild`);
      pendingDt.forEach((fn) => fn(null));
      pendingDt.clear();
    }
    const pendingEnv = pendingEnvelopeRef.current;
    if (pendingEnv.size > 0) {
      log(`flushing ${pendingEnv.size} pending envelope request(s) on rebuild`);
      pendingEnv.forEach((fn) => fn(null));
      pendingEnv.clear();
    }
  }, [srcDoc]);

  const postToIframe = useCallback((msg: HostToIframeMessage) => {
    const frame = iframeRef.current;
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ __dropin: true, ...msg }, "*");
  }, []);

  // Replay all host-side state into a freshly-loaded iframe: the active
  // tool (THE critical one — without it DROPIN_TOOL stays 'view' and all
  // edit clicks are ignored), group roots, live bbox subscriptions, the
  // current selection, and a fresh tree push.
  //
  // Runs on EVERY ready/onLoad signal — NO de-dupe guard. An earlier
  // srcDoc-identity guard caused a regression (2026-05-25): the handshake
  // poll can elicit a `ready` from the OLD/transitioning document, which
  // synced first; when the REAL new iframe then loaded and re-announced, the
  // guard SKIPPED it, so the live document never got `set-tool` → DROPIN_TOOL
  // reverted to 'view' → editing died after an apply/rebuild. Because the
  // re-sync is fully idempotent (set-tool + group-roots are replace-not-merge,
  // watch-bbox is keyed by subscriptionId, request-tree is last-write, and a
  // duplicate reselect is de-duped by nonce), running it on every signal is
  // safe AND guarantees whichever document is actually live ends up synced.
  const markReadyAndReplay = useCallback((reason: string) => {
    readyRef.current = true;
    dlog(
      `[dropin:lifecycle] markReadyAndReplay RUN via ${reason} → set-tool=${toolRef.current}`,
    );
    log(`iframe ready via ${reason} → replaying tool=${toolRef.current} + state`);
    // Tool first — canonical gating value before any pointer event lands.
    postToIframe({ type: "dropin:set-tool", tool: toolRef.current });
    if (groupRootOidsRef.current.length) {
      postToIframe({
        type: "dropin:set-group-roots",
        oids: groupRootOidsRef.current,
      });
    }
    if (bboxSubsRef.current.size > 0) {
      log(`replaying ${bboxSubsRef.current.size} bbox subscription(s) on ready`);
      bboxSubsRef.current.forEach((sub, subscriptionId) => {
        postToIframe({
          type: "dropin:watch-bbox",
          oid: sub.oid,
          subscriptionId,
        });
      });
    }
    // Re-request the structure tree. The iframe pushes it once unprompted on
    // its own ready; if that push was missed in the same race that drops the
    // ready message, the Tree panel would stay stale until the next rebuild.
    postToIframe({ type: "dropin:request-tree" });
    if (selectedLocRef.current) {
      const nonce = nextNonceRef.current++;
      pendingNonceRef.current = nonce;
      lastReselectKeyRef.current = selectionKey(
        selectedOidRef.current,
        selectedLocRef.current
      );
      track("re-selecting after iframe reload", {
        loc: selectedLocRef.current,
        oid: selectedOidRef.current,
      });
      postToIframe({
        type: "dropin:reselect",
        loc: selectedLocRef.current,
        oid: selectedOidRef.current,
        nonce,
      });
    }
  }, [postToIframe]);

  // HANDSHAKE POLL (2026-05-25) — THE reliable readiness signal.
  //
  // Diagnosed from live lifecycle logs: the iframe's one-shot `dropin:ready`
  // (setTimeout(0)) fires BEFORE React attaches the window 'message' listener,
  // so it's dropped; and the iframe's `onLoad` DOM event never fired for the
  // srcDoc iframe. Result: `markReadyAndReplay` never ran, `readyRef` stayed
  // false, the set-tool effect bailed on every render, `DROPIN_TOOL` stayed
  // 'view', and clicks did nothing after a refresh/navigation.
  //
  // Fix: actively POLL the iframe with `dropin:request-ready` until it answers
  // (it re-posts `dropin:ready`, which runs markReadyAndReplay). Bounded —
  // stops the instant readyRef flips true, hard cap ~3s. Keyed on srcDoc so a
  // rebuild re-arms it. This is immune to mount/attach ordering; the onLoad +
  // direct ready paths remain as faster best-effort signals.
  useEffect(() => {
    let tries = 0;
    // Fire one immediately, then retry until the iframe answers.
    postToIframe({ type: "dropin:request-ready" });
    const id = setInterval(() => {
      if (readyRef.current || tries++ > 30) {
        clearInterval(id);
        return;
      }
      postToIframe({ type: "dropin:request-ready" });
    }, 100);
    return () => clearInterval(id);
  }, [srcDoc, postToIframe]);

  // Live-push group roots while the iframe is alive. When srcDoc rebuilds,
  // the iframe loses its set and re-asks via dropin:ready (handled below).
  // Identity-compare on the array reference is fine: Workspace memoizes via
  // useMemo([code, kind]), so a no-op render passes the same reference and
  // this effect doesn't re-fire. A real change always produces a new array.
  useEffect(() => {
    groupRootOidsRef.current = groupRootOids ?? [];
    if (!readyRef.current) return;
    postToIframe({
      type: "dropin:set-group-roots",
      oids: groupRootOidsRef.current,
    });
  }, [groupRootOids, postToIframe]);

  // Phase 5 / Phase B — live-push the tool whenever it changes. Iframe
  // rebuilds (srcDoc swaps) wipe `DROPIN_TOOL` back to its module
  // default ('view'); the dropin:ready handler below replays from
  // toolRef so a fresh iframe instance starts with the right value
  // before the first user pointer event reaches it.
  useEffect(() => {
    toolRef.current = tool;
    if (!readyRef.current) {
      dlog(
        `[dropin:lifecycle] set-tool effect BAIL (iframe not ready) tool=${tool}`,
      );
      return;
    }
    dlog(`[dropin:lifecycle] set-tool effect POST tool=${tool}`);
    postToIframe({ type: "dropin:set-tool", tool });
  }, [tool, postToIframe]);

  const requestLayoutContext = useCallback(
    (oid: string): Promise<LayoutContext | null> => {
      return new Promise((resolve) => {
        const requestId = nextLayoutCtxIdRef.current++;
        const pending = pendingLayoutCtxRef.current;
        pending.set(requestId, resolve);
        postToIframe({ type: "dropin:get-layout-context", oid, requestId });
        setTimeout(() => {
          const fn = pending.get(requestId);
          if (fn) {
            pending.delete(requestId);
            log("layout-context request timed out", { oid, requestId });
            fn(null);
          }
        }, LAYOUT_CTX_TIMEOUT_MS);
      });
    },
    [postToIframe]
  );

  const requestMinContent = useCallback(
    (
      oid: string
    ): Promise<{
      minWidth: number;
      minHeight: number;
      hasTextChildren: boolean;
    } | null> => {
      return new Promise((resolve) => {
        const requestId = nextMinContentIdRef.current++;
        const pending = pendingMinContentRef.current;
        pending.set(requestId, resolve);
        postToIframe({ type: "dropin:get-min-content", oid, requestId });
        setTimeout(() => {
          const fn = pending.get(requestId);
          if (fn) {
            pending.delete(requestId);
            log("min-content request timed out", { oid, requestId });
            fn(null);
          }
        }, MIN_CONTENT_TIMEOUT_MS);
      });
    },
    [postToIframe]
  );

  const requestSoftConstraints = useCallback(
    (oid: string): Promise<SoftConstraintWarning[] | null> => {
      return new Promise((resolve) => {
        const requestId = nextSoftConstraintsIdRef.current++;
        const pending = pendingSoftConstraintsRef.current;
        pending.set(requestId, resolve);
        postToIframe({ type: "dropin:get-soft-constraints", oid, requestId });
        setTimeout(() => {
          const fn = pending.get(requestId);
          if (fn) {
            pending.delete(requestId);
            log("soft-constraints request timed out", { oid, requestId });
            fn(null);
          }
        }, LAYOUT_CTX_TIMEOUT_MS);
      });
    },
    [postToIframe]
  );

  const requestDropTargets = useCallback(
    (
      excludeOids: string[]
    ): Promise<{
      targets: DropTarget[];
      ineligible: IneligibleDropTarget[];
    } | null> => {
      return new Promise((resolve) => {
        const requestId = nextDropTargetsIdRef.current++;
        const pending = pendingDropTargetsRef.current;
        pending.set(requestId, resolve);
        postToIframe({
          type: "dropin:get-drop-targets",
          excludeOids,
          requestId,
        });
        setTimeout(() => {
          const fn = pending.get(requestId);
          if (fn) {
            pending.delete(requestId);
            log("drop-targets request timed out", {
              excludeOids,
              requestId,
            });
            fn(null);
          }
        }, LAYOUT_CTX_TIMEOUT_MS);
      });
    },
    [postToIframe]
  );

  const requestEnvelope = useCallback(
    (oid: string): Promise<EnvelopeReadback | null> => {
      return new Promise((resolve) => {
        const requestId = nextEnvelopeIdRef.current++;
        const pending = pendingEnvelopeRef.current;
        pending.set(requestId, resolve);
        postToIframe({ type: "dropin:get-envelope", oid, requestId });
        setTimeout(() => {
          const fn = pending.get(requestId);
          if (fn) {
            pending.delete(requestId);
            log("envelope request timed out", { oid, requestId });
            fn(null);
          }
        }, LAYOUT_CTX_TIMEOUT_MS);
      });
    },
    [postToIframe]
  );

  const watchBbox = useCallback(
    (
      oid: string,
      callback: (rect: Bounds | null) => void
    ): (() => void) => {
      const subscriptionId = nextBboxIdRef.current++;
      bboxSubsRef.current.set(subscriptionId, { oid, callback });
      // Only post if iframe is ready; otherwise dropin:ready handler will
      // replay all entries. This avoids dropping watches that get registered
      // before the first iframe load (e.g., a host overlay hooking up
      // immediately on mount).
      if (readyRef.current) {
        postToIframe({ type: "dropin:watch-bbox", oid, subscriptionId });
      }
      return () => {
        bboxSubsRef.current.delete(subscriptionId);
        if (readyRef.current) {
          postToIframe({ type: "dropin:unwatch-bbox", subscriptionId });
        }
      };
    },
    [postToIframe]
  );

  const setLiveStyle = useCallback(
    (oid: string, declarations: Record<string, string>) => {
      // Fire-and-forget. Don't gate on `readyRef.current` — the iframe
      // either has the runtime listener installed (live messages get
      // buffered? no, actually they'd be dropped since no listener yet)
      // OR the gesture got interrupted by an iframe rebuild and the
      // pointermove that produced this call is already stale. Both cases
      // resolve themselves: the next frame's setLiveStyle call lands once
      // the iframe is back; if the gesture is canceled the host wipes its
      // intent. The cost of an early-fired postMessage that gets dropped
      // is zero.
      postToIframe({ type: "dropin:live-style", id: oid, declarations });
    },
    [postToIframe]
  );

  const clearLiveStyle = useCallback(
    (oid: string) => {
      postToIframe({ type: "dropin:live-clear", id: oid });
    },
    [postToIframe]
  );

  const requestFlip = useCallback(
    (oid: string, fromRect: Bounds) => {
      // Strip down to the four numeric fields the message protocol carries
      // — `Bounds` may include other fields in future revisions but the
      // FLIP math only needs x/y/width/height. postMessage structured-clones
      // either way; the explicit shape keeps the wire schema stable.
      postToIframe({
        type: "dropin:flip",
        id: oid,
        fromRect: {
          x: fromRect.x,
          y: fromRect.y,
          width: fromRect.width,
          height: fromRect.height,
        },
      });
    },
    [postToIframe]
  );

  // Re-fire `onReady` whenever the consumer prop swaps — same imperative-
  // handle exposure pattern Editor.tsx uses. The consumer-side handle ref
  // updates without remounting Preview.
  // Vibe-edit direct-mutation channel. Wraps postToIframe so the
  // handle's API is self-documenting about the message family it
  // accepts (typed via the Extract<HostToIframeMessage, ...> in the
  // PreviewHandle interface).
  const postVibe = useCallback(
    (
      cmd: Extract<HostToIframeMessage, { type: `vibe:${string}` }>,
    ) => {
      postToIframe(cmd);
    },
    [postToIframe],
  );

  // 2026-05-20 — Publish flow snapshot. Reads the iframe's current
  // contentDocument and returns the full document HTML (doctype +
  // documentElement.outerHTML) for the host to sanitize and zip. Cross-
  // origin contentDocument access throws — we catch and return null so
  // the caller falls back to the source-only publish path.
  //
  // Returns null when:
  //   - iframe ref hasn't mounted yet
  //   - contentDocument is cross-origin / inaccessible (shouldn't happen
  //     with our srcdoc + allow-same-origin sandbox, but defensive)
  //   - the iframe is mid-rebuild (readyState !== "complete" OR <body>
  //     has no children — both indicate the user's code hasn't rendered
  //     into the new srcdoc yet). The caller falls back to source-only
  //     publish, which the toast will explain.
  const snapshotHtml = useCallback((): string | null => {
    const frame = iframeRef.current;
    if (!frame) return null;
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.documentElement) return null;
      // Rebuild race guard. setCode (called by vibe-edit / palette /
      // AI patches) swaps srcdoc which kicks off a fresh load. Until
      // the new document fully parses + the user's React/Babel tree
      // has rendered, contentDocument might be either the empty
      // about:blank skeleton OR a partially-parsed page. Either way
      // we'd snapshot garbage. readyState "complete" + non-empty body
      // is the safe signal; the host should retry or fall back.
      if (doc.readyState !== "complete") return null;
      if (!doc.body || doc.body.children.length === 0) return null;
      const doctype = doc.doctype
        ? `<!DOCTYPE ${doc.doctype.name}>\n`
        : "<!DOCTYPE html>\n";
      return doctype + doc.documentElement.outerHTML;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!onReady) return;
    onReady({
      requestLayoutContext,
      watchBbox,
      setLiveStyle,
      clearLiveStyle,
      requestMinContent,
      requestFlip,
      requestSoftConstraints,
      requestDropTargets,
      requestEnvelope,
      postVibe,
      snapshotHtml,
    });
  }, [
    onReady,
    requestLayoutContext,
    watchBbox,
    setLiveStyle,
    clearLiveStyle,
    requestMinContent,
    requestFlip,
    requestSoftConstraints,
    requestDropTargets,
    requestEnvelope,
    postVibe,
    snapshotHtml,
  ]);

  // Tree-row hover highlight. Pushes a coral dashed outline via the
  // existing live stylesheet when hoverHighlightOid is non-null;
  // clears the previously-painted OID on every transition (including
  // the null→null no-op which is a noop ref read). Tracks the last
  // emitted OID on a ref so the cleanup path can post a clear without
  // racing against the next state update.
  const lastHoverHighlightOidRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = lastHoverHighlightOidRef.current;
    const next = hoverHighlightOid;
    if (prev === next) return;
    if (prev) clearLiveStyle(prev);
    if (next) {
      // Coral dashed outline for visual parity with selection but
      // visually distinct (dashed instead of solid). 2px-offset so
      // the outline doesn't overlap the element's own borders.
      setLiveStyle(next, {
        outline: "2px dashed #FF4D2E",
        "outline-offset": "2px",
      });
    }
    lastHoverHighlightOidRef.current = next;
  }, [hoverHighlightOid, setLiveStyle, clearLiveStyle]);

  // Iframe rebuilds wipe the live stylesheet — keep our last-known
  // pointer in sync so a rebuilt iframe doesn't get a stale clear.
  useEffect(() => {
    lastHoverHighlightOidRef.current = null;
  }, [debouncedCode, debouncedKind]);

  useEffect(() => {
    function handler(ev: MessageEvent) {
      // FocusEditor mounts an IsolatedPreview that runs the same dropin:
      // protocol in a sibling iframe. Both iframes postMessage to this window,
      // so without a source check we'd treat IsolatedPreview's no-nonce
      // select echoes as fresh user clicks and re-open focus mode in a loop.
      const frame = iframeRef.current;
      if (!frame || ev.source !== frame.contentWindow) return;
      if (!isIframeMessage(ev.data)) return;
      const d = ev.data;
      // Skip per-message logs for high-frequency types (scroll fires on
      // every wheel tick, bbox up to once per frame per subscription).
      if (d.type !== "dropin:scroll" && d.type !== "dropin:bbox") {
        log(`← iframe: ${d.type}`, d);
      }
      if (d.type === "dropin:ready") {
        dlog("[dropin:lifecycle] RECEIVED dropin:ready message");
        // Canonical "iframe announced itself" path. markReadyAndReplay is
        // guarded by readyRef, so if the onLoad fallback already replayed
        // (race where this postMessage was missed), this is a no-op.
        markReadyAndReplay("dropin:ready message");
      } else if (d.type === "dropin:layout-context") {
        const fn = pendingLayoutCtxRef.current.get(d.requestId);
        if (fn) {
          pendingLayoutCtxRef.current.delete(d.requestId);
          fn(d.context);
        } else {
          log("orphan layout-context response (already timed out?)", { requestId: d.requestId });
        }
      } else if (d.type === "dropin:min-content-result") {
        const fn = pendingMinContentRef.current.get(d.requestId);
        if (fn) {
          pendingMinContentRef.current.delete(d.requestId);
          fn(d.result);
        } else {
          log("orphan min-content response (already timed out?)", { requestId: d.requestId });
        }
      } else if (d.type === "dropin:soft-constraints-result") {
        const fn = pendingSoftConstraintsRef.current.get(d.requestId);
        if (fn) {
          pendingSoftConstraintsRef.current.delete(d.requestId);
          fn(d.warnings);
        } else {
          log("orphan soft-constraints response (already timed out?)", { requestId: d.requestId });
        }
      } else if (d.type === "dropin:drop-targets-result") {
        const fn = pendingDropTargetsRef.current.get(d.requestId);
        if (fn) {
          pendingDropTargetsRef.current.delete(d.requestId);
          // Walker returns null on iframe-side bail; otherwise both arrays
          // are present (ineligible may be empty). Collapse to null when
          // targets is null so callers can degrade gracefully without
          // separate ineligible-only handling.
          fn(
            d.targets === null
              ? null
              : { targets: d.targets, ineligible: d.ineligible ?? [] }
          );
        } else {
          log("orphan drop-targets response (already timed out?)", { requestId: d.requestId });
        }
      } else if (d.type === "dropin:envelope-result") {
        const fn = pendingEnvelopeRef.current.get(d.requestId);
        if (fn) {
          pendingEnvelopeRef.current.delete(d.requestId);
          fn(d.result);
        } else {
          log("orphan envelope response (already timed out?)", { requestId: d.requestId });
        }
      } else if (d.type === "dropin:bbox") {
        const sub = bboxSubsRef.current.get(d.subscriptionId);
        if (sub) sub.callback(d.rect);
        // No log on bbox — happens up to once per frame per sub. Console
        // floods otherwise. Filter at the consumer if you need it.
      } else if (d.type === "dropin:select") {
        const incoming = typeof d.nonce === "number" ? d.nonce : null;
        const fromReselect =
          incoming !== null && incoming === pendingNonceRef.current;
        if (fromReselect) pendingNonceRef.current = null;
        // Phase 2 acceptance #13 — `additive` is set by the iframe on
        // shift-click (no Alt). Programmatic reselects never carry it
        // (they're loc/oid-driven, not user-driven), so we ignore the
        // flag when fromReselect is true. Default false when omitted.
        const additive =
          !fromReselect && d.additive === true;
        track("select", { tag: d.selection?.tag, oid: d.selection?.oid, fromReselect, additive });
        onSelectionChange(d.selection, fromReselect, additive);
      } else if (d.type === "dropin:text-commit") {
        onTextCommit(d.loc, d.text, d.tag);
      } else if (d.type === "dropin:clear-selection") {
        const reason = d.reason ?? "user";
        track(`clear-selection reason=${reason}`);
        // Treat iframe-initiated loss (stale loc) as a programmatic event
        // so Workspace doesn't interpret it as a user action.
        pendingNonceRef.current = null;
        onSelectionChange(null, reason === "reselect-failed", false);
      } else if (d.type === "dropin:scroll") {
        scrollYRef.current = d.y;
      } else if (d.type === "dropin:tree") {
        // ROADMAP §3.3 — tree push from iframe. One per `dropin:ready`.
        // No correlation: payload is the full snapshot, last-write-wins.
        if (onTreeUpdateRef.current) onTreeUpdateRef.current(d.tree);
      } else if (d.type === "dropin:insert-target-confirmed") {
        // Phase 5 / Phase C — iframe-side hit-test result for the
        // Insert tool. Host stores the parent OID + opens the library
        // sidebar scoped to "Insert into <tag>".
        if (onInsertTargetRef.current) {
          onInsertTargetRef.current(d.oid, d.tag, d.additive);
        }
      } else if (d.type === "dropin:error") {
        track("iframe reported error", d.message);
        if (onIframeError) onIframeError(d.message);
      } else if (d.type === "vibe:selected") {
        track("vibe:selected", { tag: d.info.tag, kind: d.info.kind, path: d.info.path });
        if (onVibeSelectedRef.current) onVibeSelectedRef.current(d.info);
      } else if (d.type === "vibe:cleared") {
        track("vibe:cleared");
        if (onVibeClearedRef.current) onVibeClearedRef.current();
      } else if (d.type === "vibe:ready") {
        // No-op host-side. The runtime emits this once per iframe load
        // so an integration test or future health-check can pick it up.
      }
    }
    window.addEventListener("message", handler);
    dlog("[dropin:lifecycle] message listener attached");
    return () => {
      dlog("[dropin:lifecycle] message listener detached");
      window.removeEventListener("message", handler);
    };
  }, [onSelectionChange, onTextCommit, onIframeError, postToIframe, markReadyAndReplay]);

  useEffect(() => {
    if (!readyRef.current) return;
    if (selectedLoc) {
      const key = selectionKey(selectedOid ?? null, selectedLoc);
      if (key && key === lastReselectKeyRef.current) return;
      lastReselectKeyRef.current = key;
      const nonce = nextNonceRef.current++;
      pendingNonceRef.current = nonce;
      track("selection changed → posting reselect", { selectedLoc, selectedOid });
      postToIframe({ type: "dropin:reselect", loc: selectedLoc, oid: selectedOid ?? null, nonce });
    } else {
      if (lastReselectKeyRef.current === null) return;
      lastReselectKeyRef.current = null;
      track("selection cleared → posting clear");
      pendingNonceRef.current = null;
      postToIframe({ type: "dropin:clear" });
    }
  }, [selectedLoc, selectedOid, postToIframe]);

  const width = VIEWPORT_WIDTHS[viewport];

  // (4b/4d) Compose the gesture bindings for SelectionOverlay only when
  // the matching commit handler is wired. Skipping the object entirely
  // (rather than passing a no-op) keeps the overlay's `resize ?` / `spacing ?`
  // ternaries clean and disables `pointer-events: auto` on handles when the
  // upstream commit path isn't wired. Both bindings share `setLiveStyle` /
  // `clearLiveStyle` / `setIframePointerEventsDisabled`; resize-specific is
  // `requestMinContent`, spacing-specific is `requestLayoutContext`.
  const setIframePointerEventsDisabled = useCallback((disabled: boolean) => {
    const frame = iframeRef.current;
    if (!frame) return;
    frame.style.pointerEvents = disabled ? "none" : "";
  }, []);
  const resizeBindings = onResize
    ? {
        setLiveStyle,
        clearLiveStyle,
        setIframePointerEventsDisabled,
        onResizeCommit: onResize,
        requestMinContent,
        // (4c-iii) Snap candidate sourcing. The resize gesture calls this
        // at pointerdown to capture the parent + sibling rects for snap-
        // candidate construction. Same call shape used by the spacing
        // gesture for per-side baselines — reused intentionally.
        requestLayoutContext,
        // Track B FLIP — gesture arms a pending flip on commit; the
        // overlay's bbox watcher fires it when the canonical rect lands.
        requestFlip,
        // Phase 2 acceptance #13 — multi-element commit path. Optional;
        // gesture falls back to single-element `onResizeCommit` when
        // additionalOids is empty.
        onResizeMultiCommit: onResizeMulti,
      }
    : undefined;
  const spacingBindings = onSpacing
    ? {
        setLiveStyle,
        clearLiveStyle,
        setIframePointerEventsDisabled,
        onSpacingCommit: onSpacing,
        requestLayoutContext,
        requestFlip,
        onSpacingMultiCommit: onSpacingMulti,
      }
    : undefined;
  // Step 7 — passive inspection bindings. Always wired (no gesture
  // dependency), but the SelectionOverlay only triggers warning queries
  // when the prop is provided. Keeps the wire shape extensible for
  // future passive queries (computed-css panel, accessibility tree
  // dump, etc.).
  const inspectBindings = { requestSoftConstraints };
  // Phase 3 — move (reorder + reparent) bindings. Wired only when both
  // commit handlers are present; the position handle stays render-disabled
  // otherwise. Reuses setLiveStyle / clearLiveStyle / setIframePointerEvents
  // from the resize/spacing path (same Track A optimistic-paint stylesheet).
  const moveBindings =
    onReorder && onReparent
      ? {
          setLiveStyle,
          clearLiveStyle,
          setIframePointerEventsDisabled,
          onReorderCommit: onReorder,
          onReparentCommit: onReparent,
          requestDropTargets,
          requestLayoutContext,
          // Track B FLIP — same plumbing as resize/spacing. Move arms
          // a pending flip on successful reorder/reparent commit; the
          // overlay's bbox watcher fires it once the canonical rect
          // lands (typically the post-rebuild reflow ~250 ms later).
          requestFlip,
          // Phase 3 polish — multi-element commit paths. Optional;
          // gesture falls back to single-element flow when undefined.
          onReorderMultiCommit: onReorderMulti,
          onReparentMultiCommit: onReparentMulti,
        }
      : undefined;
  // 2026-05-15 move-tool tracer — moveBindings shape every render. Only
  // logs WHEN tool === "move" so non-move renders stay quiet. Throttled
  // by a ref so identical-state renders don't spam.
  if (tool === "move" && typeof window !== "undefined") {
    const w = window as unknown as { __dropinMoveBindingsLog?: string };
    const sig = `${!!moveBindings}|${!!onReorder}|${!!onReparent}|${!!onReorderMulti}|${!!onReparentMulti}|${!!selectedOid}`;
    if (w.__dropinMoveBindingsLog !== sig) {
      w.__dropinMoveBindingsLog = sig;
      dlog("[dropin:Preview] moveBindings status (tool=move)", {
        hasMoveBindings: !!moveBindings,
        hasOnReorder: !!onReorder,
        hasOnReparent: !!onReparent,
        hasOnReorderMulti: !!onReorderMulti,
        hasOnReparentMulti: !!onReparentMulti,
        hasSelectedOid: !!selectedOid,
      });
    }
  }

  // Phase 3 polish (seventeenth pass) — duplicate / delete toolbar
  // bindings. Wired only when both single-element handlers are
  // present; multi variants + completion callback are optional.
  const actionBindings =
    onDuplicate && onDelete
      ? {
          onDuplicate,
          onDelete,
          onDuplicateMulti,
          onDeleteMulti,
          onDeleteCompleted,
        }
      : undefined;

  return (
    <div className="relative h-full w-full overflow-auto bg-soft">
      <div className="mx-auto flex h-full justify-center">
        <div
          // border-l/border-b removed: rail's right border already supplies
          // the visible left edge (collapsing what would otherwise be a 4px
          // double-line where rail meets preview), and the bottom of the
          // workspace ends at the viewport — a bottom border there reads as
          // redundant against the empty void below.
          className="bg-card border-t-2 border-r-2 border-ink h-full transition-[width] duration-300 ease-out"
          style={{ width, maxWidth: "100%" }}
        >
          {/* Positioning wrapper. Owns the (0,0) origin shared by the iframe
              and the host SelectionOverlay so the overlay's translate3d coords
              (which are iframe-VIEWPORT relative) land directly on the rendered
              element without needing to subtract the card's 2px ink border.
              `overflow-hidden` clips the overlay to the iframe boundary when
              the selected element scrolls partially out of view. */}
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              ref={iframeRef}
              title="Preview"
              srcDoc={srcDoc}
              // Best-effort fast readiness signal. The guaranteed path is the
              // dropin:request-ready poll (see the effect above); onLoad +
              // the direct dropin:ready message just sync sooner when they do
              // fire. markReadyAndReplay re-syncs on every signal (idempotent),
              // so whichever document is actually live ends up with set-tool.
              onLoad={() => {
                dlog("[dropin:lifecycle] iframe onLoad fired", {
                  hasContentWindow: !!iframeRef.current?.contentWindow,
                });
                markReadyAndReplay("iframe onLoad");
              }}
              // SECURITY NOTE (2026-05-26): `allow-scripts` + `allow-same-origin`
              // together let iframe JS reach `window.parent` (the browser warns
              // about this). It is REQUIRED here — the editor reads the iframe's
              // contentDocument (selection, bbox, vibe-edit) and bridges via
              // postMessage, which a cross-origin sandbox would block. The
              // accepted trade-off: preview content is first-party templates +
              // the user's own pasted output, and we keep secrets OUT of
              // window.parent.localStorage (see FocusEditor's BYO-key handling)
              // so there's nothing worth exfiltrating even if a script escapes.
              // The "proper" hardening (serve the preview from a separate
              // origin) is incompatible with same-origin contentDocument access.
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              className="block h-full w-full bg-white"
              // touchAction:auto + overscroll-y-contain: explicit native
              // touch-pan support inside the iframe content (iOS Safari
              // + Chrome DevTools mobile emulation occasionally lose this
              // implicit default when the iframe is nested inside a
              // height-bounded flex chain). overscroll prevents the
              // page-level pull-to-refresh from triggering when the user
              // hits the top of the iframe content.
              style={{ touchAction: "auto", overscrollBehaviorY: "contain" }}
            />
            {/* Phase 5 / Phase B — overlay mounts only when the user has
                a gesture-bearing tool active. View / Insert / Swap don't
                want chrome on the canvas (View is read-only; Insert /
                Swap render their own affordances in Phase C). The
                in-iframe `[data-dropin-selected]` outline still draws
                for HTML mode + pre-OID JSX paste even when this is
                hidden (its CSS rule is scoped via :not([data-dropin-id])
                so it never double-stacks with the host overlay). */}
            {(tool === "select" || tool === "move") && (
              <SelectionOverlay
                tool={tool}
                selectedOid={selectedOid}
                additionalOids={additionalOids ?? []}
                watchBbox={watchBbox}
                tag={selectedTag}
                resize={resizeBindings}
                spacing={spacingBindings}
                inspect={inspectBindings}
                move={moveBindings}
                actions={actionBindings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
