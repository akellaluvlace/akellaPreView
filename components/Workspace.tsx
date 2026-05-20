"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PreviewKind } from "@/lib/preview";
import Preview, { type PreviewHandle, type Viewport } from "./Preview";
import FocusEditor from "./FocusEditor";
import VibePropertiesPanel from "./VibePropertiesPanel";
import { buildVibeCommit } from "@/lib/vibe-edit/commit";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import type { AiSelectionInfo, AiSelectionPayload } from "@/lib/ai-edit/types";
import { makeFingerprint } from "@/lib/ai-edit/fingerprint";
import { estimateTokens } from "@/lib/ai-edit/scope";
import { inferSwapCategory } from "@/lib/swap-category-hint";
import { isCardLike, isLinkStyledAsButton } from "@/lib/vibe-edit/detect";
import FirstOpenTour from "./FirstOpenTour";
import KindToggle from "./KindToggle";
import ComponentLibrarySidebar from "./library/Sidebar";
import LibraryModal from "./library/LibraryModal";
import WorkspaceLeftRail from "./WorkspaceLeftRail";
import ResizablePanel from "./ResizablePanel";
import ElementTree from "./ElementTree";
import PreviewModal from "./PreviewModal";
import WhatsNextModal from "./WhatsNextModal";
import AiScopeChip from "./AiScopeChip";
import AiPromptBar from "./AiPromptBar";
import { callAiEdit } from "@/lib/ai-edit/client";
import { buildApiRequestBody } from "@/lib/ai-edit/payload";
import InlineComponentBrowser from "./VibePropertiesPanel/InlineComponentBrowser";
import AiSwapBusyOverlay from "./AiSwapBusyOverlay";
import type { ComponentMeta } from "@/lib/component-library/types";
// 2026-05-16 — Try Variations retired per user direction: "we remove
// entirely swaps on whole page - only surgical ones." Per-image
// Shuffle (in ImageControls.tsx) is the surgical alternative + maps
// to the industry pattern (Plasmic / Onlook / Webflow all do
// per-element image swap, not site-wide). VariationsModal.tsx +
// lib/template-remix/shuffle-images.ts left on disk with retirement
// comments — recoverable if a future Plasmic-grade implementation
// surfaces. See docs/research/2026-05-16-shuffle-features-research.md
// section 3.1 for the viability discussion.
import { getJsxElementSource } from "@/lib/vibe-edit/get-element-source";
import ToolBar, { type Tool } from "./ToolBar";
import type { EditorHandle } from "./Editor";

// Same gate as Preview.tsx — `log` is muted by default so the console
// stays useful. Selection / tool / error events go through `track`
// which is always on. Flip DEBUG_LOGS to true to bring back the full
// trail when diagnosing.
const DEBUG_LOGS = false;
function log(msg: string, data?: unknown) {
  if (DEBUG_LOGS) console.log(`[dropin:Workspace] ${msg}`, data ?? "");
}
function track(msg: string, data?: unknown) {
  console.log(`[dropin:Workspace] ${msg}`, data ?? "");
}
import {
  deleteJsxElement,
  duplicateJsxElement,
  extractJsxElement,
  patchJsxAttr,
  patchJsxClass,
  patchJsxRemoveAttr,
  patchJsxText,
} from "@/lib/source-patch-jsx";
import { buildIndex, injectOids, stripOids } from "@/lib/ast";
import { applySpacing } from "@/lib/ast/operations/spacing";
import { applyStyleProps } from "@/lib/ast/operations/style";
import { applyReorder } from "@/lib/ast/operations/reorder";
import { applyReorderMulti } from "@/lib/ast/operations/reorder-multi";
import { applyReparent } from "@/lib/ast/operations/reparent";
import type { ReparentMultiOp } from "@/lib/ast/tree-dnd";
import { applyDuplicate } from "@/lib/ast/operations/duplicate";
import { applyDelete } from "@/lib/ast/operations/delete";
import { applyInsertChild } from "@/lib/ast/operations/insert";
import { applySwapWithFit } from "@/lib/swap/swap-with-fit";
import { summarizeSwapFitChanges } from "@/lib/swap/swap-fit";
import {
  composeEnvelopeFromBbox,
  parentBoxFromRect,
} from "@/lib/swap/envelope-from-bbox";
import { assessBboxDrift } from "@/lib/swap/bbox-drift";
import type { SlotEnvelope } from "@/lib/swap/slot-capacity";
import { applyPalette } from "@/lib/ast/operations/palette";
import { applyPaletteToConfigColors } from "@/lib/ast/operations/palette-config";
import { collectDescendantOids } from "@/lib/ast/scope";
import { getPaletteById } from "@/lib/palettes";
import { readSourceStyle } from "@/lib/ast/style-source-read";
import { useEditHistory } from "@/lib/use-edit-history";
import {
  addFile,
  createProject,
  getFile,
  listFiles,
  normalizePath,
  removeFile,
} from "@/lib/files/operations";
import type { FileId } from "@/lib/files/types";
import { bundleProject } from "@/lib/preview-bundler";
import {
  deleteHtmlElement,
  duplicateHtmlElement,
  extractHtmlElement,
  patchHtmlAttr,
  patchHtmlClass,
  patchHtmlOuter,
  patchHtmlRemoveAttr,
  patchHtmlText,
} from "@/lib/source-patch-html";
import {
  jsxElementHasExpressions,
  patchJsxOuterByOid,
} from "@/lib/ast/patch-class-by-oid";
import { htmlToJsx } from "@/lib/component-library/html-to-jsx";
import { applyDetachFromMap } from "@/lib/ast/operations/detach-from-map";
import type {
  ElementLoc,
  ElementSelection,
  TreeNode,
} from "@/lib/iframe-bridge";
import { collectCanvasShiftClickRangeOids } from "@/lib/canvas-range";
import type { Breakpoint } from "@/lib/tailwind-slider-maps";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => <EditorLoadingFallback />,
});

// Extracted so the same loading visual renders both during dynamic import
// resolution AND during the post-hydration mount gate (see `editorMounted`
// state in Workspace). Keeping them visually identical guarantees zero
// structural-mismatch risk if React's hydration ever bridges between them.
function EditorLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-paper text-xs font-mono uppercase tracking-[0.2em] text-muted">
      Loading editor…
    </div>
  );
}

interface WorkspaceProps {
  initialCode: string;
  initialKind: PreviewKind;
  filename?: string;
  // Playground-style local toggle: flips the preview language without changing
  // the source file. Cheap because both kinds share the same buffer.
  allowKindToggle?: boolean;
  // Template-page toggle: navigates to the same slug under the other `?kind=`
  // so the server loads the sibling source file. Use when there really are two
  // distinct files (web/<slug>.jsx + web/<slug>.html).
  urlKindToggle?: boolean;
  title?: string;
  subtitle?: string;
  // When false (default), edits are ephemeral — they live in React state for
  // the current window, survive Copy/Download, but vanish on refresh /
  // navigation. The template page passes false so revisiting a template
  // always lands on its pristine source. Pass true for the playground if
  // you want work-in-progress to survive a reload.
  persistEdits?: boolean;
}

type Pane = "editor" | "preview";

export default function Workspace({
  initialCode,
  initialKind,
  filename,
  allowKindToggle = false,
  urlKindToggle = false,
  title,
  subtitle,
  persistEdits = false,
}: WorkspaceProps) {
  // Phase 1 source-load OID injection (`maniuplation.md` Layer 1).
  //
  // Tenth-pass: `injectOids` runs in this lazy initializer again (it had been
  // moved to a post-hydration useEffect during the ninth pass). Why it's safe
  // now: `lib/ast/oids.ts makeOid()` was rewritten to encode the parse offset
  // as a base-62 string instead of using `Math.random()`. Server and client
  // process the same source through the same deterministic encoding and
  // produce IDENTICAL OIDs — the iframe's `srcDoc` attribute matches between
  // SSR and hydration, no hydration mismatch.
  //
  // Why the ninth-pass useEffect dance is gone: the post-hydration injection
  // produced a SECOND iframe rebuild ~300 ms after mount (the OID injection's
  // `setCodeSilent` updated code state → Preview's debounced srcDoc effect
  // fired → iframe reloaded). The double-rebuild flake'd unpkg.com's CORS
  // preflight cache (browser cache state confusion when scripts re-fetch
  // back-to-back), which surfaced as "Recharts.min.js blocked by CORS" + a
  // cascading lucide-react `forwardRef` error and templates blanking on
  // Ctrl+R. With OIDs present from the lazy initializer, there's only ONE
  // iframe rebuild ever, no double-fetch, no CORS confusion.
  //
  // Phase C / B.2 — Project state + history stack + IDB persistence are all
  // owned by useEditHistory. v1 single-file projects keep the existing UX
  // exactly: `code` is the active file's source, `setCode` builds a 1-diff
  // Edit on the active file and pushes onto the host-side undo stack with
  // 300 ms time-coalescing, `undo`/`redo` revert/re-apply. The hook exposes
  // a backwards-compat surface (code/setCode/setCodeSilent/undo/redo/canUndo/
  // canRedo) so the 50+ existing call sites in this file need no rewrite.
  //
  // The hook owns:
  //   - the Project state (formerly a Workspace useState<Project>)
  //   - the History stack (formerly the legacy useSourceHistory ring buffer)
  //   - the mirror / hydration / persistence effects (formerly 3 ad-hoc
  //     useEffects in Workspace; merged into the hook so race-window between
  //     mount-and-hydration is gated correctly).
  //
  // SSR-safe: createProject is pure (no DOM, no IDB). IDB hydration happens
  // in a useEffect inside the hook, after mount. The deterministic
  // `idOverride` makes a given template/playground always land at the same
  // IDB key — reloads hydrate the user's last save instead of reverting to
  // the server's `initialCode`.
  //
  // onError reaches showWarn through a ref because showWarn isn't defined
  // yet at this point in the component (it depends on setRollToast, declared
  // later as useState). The ref is assigned during render after showWarn lands;
  // the hook's effects + setCode/setCodeSilent error paths read .current at
  // call time, by which point the ref points at the live showWarn.
  const errorHandlerRef = useRef<((msg: string) => void) | null>(null);
  const onErrorStable = useCallback((msg: string) => {
    if (errorHandlerRef.current) errorHandlerRef.current(msg);
    else console.warn("[dropin:Workspace] onError before showWarn defined:", msg);
  }, []);
  const {
    project,
    setProject,
    activeFileId,
    setActiveFileId,
    code,
    setCode,
    setCodeSilent,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditHistory({
    initialProject: () => {
      const entrySource =
        initialKind === "jsx" ? injectOids(initialCode).source : initialCode;
      const r = createProject({
        name: filename ?? "untitled",
        entryPath: initialKind === "jsx" ? "App.jsx" : "index.html",
        entrySource,
        idOverride: `dropin:project:${filename ?? "playground"}:${initialKind}`,
      });
      // createProject can only fail on a bad path; our defaults are valid.
      // The throw is defensive against future refactors that might tighten
      // path validation — surfacing immediately beats silent corruption.
      if (!r.ok) throw new Error(`createProject failed: ${r.error}`);
      return r.project;
    },
    onError: onErrorStable,
    // Templates default to ephemeral — edits live in React state, survive
    // Copy/Download, but vanish on refresh so revisiting always shows the
    // pristine source. Playground can opt back in via persistEdits=true.
    disablePersistence: !persistEdits,
  });

  // Set to `true` immediately before the OID re-inject calls
  // `applyEditsByOffset`. Monaco fires its onChange synchronously inside
  // `executeEdits`, so the next Editor onChange we receive is the re-inject's
  // own bookkeeping — we route THAT one through `setCodeSilent` instead of
  // `setCode` so the user's undo stack only contains user-meaningful edits.
  // The flag flips back to false after one onChange cycle.
  const suppressHistoryRef = useRef(false);

  // Mirror code → codeRef on every render. The ref reads inside vibe-
  // edit handlers + the idle-commit setTimeout pick up the latest
  // source without forcing those closures to list `code` as a dep,
  // which would otherwise reset the 600ms debounce on every Monaco
  // keystroke and rebuild the swap callbacks on every render.
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const handleEditorChange = useCallback(
    (value: string) => {
      if (suppressHistoryRef.current) {
        suppressHistoryRef.current = false;
        setCodeSilent(value);
      } else {
        setCode(value);
      }
    },
    [setCode, setCodeSilent],
  );
  const [kind, setKind] = useState<PreviewKind>(initialKind);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  // Phase 5 / A6: active breakpoint for inspector reads/writes. "desktop" is
  // the implicit no-prefix cascade in mobile-first Tailwind; "tablet"
  // prepends `md:`; "mobile" prepends `sm:`. Persists per-tab in
  // localStorage under `dropin:breakpoint`. Toggling drives the viewport
  // segmented in tandem (one-way coupling — viewport changes do NOT drive
  // breakpoint, so a user testing layout at a different size keeps their
  // edit target intact).
  const [breakpoint, setBreakpointState] = useState<Breakpoint>("desktop");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("dropin:breakpoint");
    if (stored === "mobile" || stored === "tablet" || stored === "desktop") {
      setBreakpointState(stored);
      setViewport(stored);
    }
  }, []);
  const setBreakpoint = useCallback((bp: Breakpoint) => {
    setBreakpointState(bp);
    setViewport(bp);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dropin:breakpoint", bp);
    }
  }, []);
  // Phase 5 / Phase B — active tool. Default View; persists per-tab in
  // localStorage. Switching tools clears in-flight gesture state in the
  // SelectionOverlay (a useEffect there watches the prop). Selecting
  // View also closes any open FocusEditor — view tool is the explicit
  // "step out" state. Insert / Swap mid-flow with no completed action
  // bail when the user switches away (insertTargetOid clears below).
  // Default to 'view' so first-time visitors land on the rendered
  // preview with no chrome — they can tap into vibe / select / etc.
  // when they want to edit. Their persisted choice (vibe, move, etc.)
  // wins on return.
  const [tool, setToolState] = useState<Tool>("view");
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Mobile lockdown (2026-05-12): edit chrome is hidden via Tailwind
    // `hidden lg:*` at <lg viewports, but the persisted tool can still
    // restore to vibe/insert/move and produce ghost iframe-side state
    // (clicks land on hidden panels). Force the view-only default on
    // mobile so the iframe runtime stays inert. Desktop sessions still
    // restore from localStorage normally. lg breakpoint = 1024px per
    // tailwind default; the check matches the `lg:` gate on the chrome.
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;
    try {
      const stored = window.localStorage.getItem("dropin:tool");
      // Migrate returning users persisted on tools that no longer
      // surface in the toolbar — Select (hidden in favour of vibe),
      // Swap (retired 2026-05-11 PM, lives in vibe panel), Insert
      // (retired 2026-05-14, library swap covers the use case), Move
      // (retired 2026-05-15, see TOOL_LIST comment in ToolBar.tsx).
      // All route to View so users don't land in a state with no
      // toolbar button matching their persisted choice.
      if (
        stored === "select" ||
        stored === "swap" ||
        stored === "insert" ||
        stored === "move" ||
        // 2026-05-20 — AI tool retired. Migrate persisted "ai" → "view".
        stored === "ai"
      ) {
        setToolState("view");
        try {
          window.localStorage.setItem("dropin:tool", "view");
        } catch {
          // ignore
        }
        return;
      }
      if (stored === "view" || stored === "vibe") {
        setToolState(stored);
      }
    } catch {
      // localStorage unavailable; stick with the default.
    }
  }, []);
  const setTool = useCallback((next: Tool) => {
    track("setTool", { next });
    setToolState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("dropin:tool", next);
      } catch {
        // ignore
      }
    }
  }, []);
  const [selection, setSelection] = useState<ElementSelection | null>(null);
  // Phase 2 acceptance #13 — multi-element coordinated drag. `selection`
  // remains the PRIMARY (drives FocusEditor + breadcrumb + single-element
  // ops); `additionalOids` carries the rest of the multi-select set. Empty
  // by default. Shift-click on a new oid demotes the prior primary's oid
  // into this array; plain click resets it to []; Esc clears it (alongside
  // selection). v1 doesn't toggle off via shift-click on already-selected
  // elements — that path is no-op (Esc + re-shift is the v1 escape hatch).
  const [additionalOids, setAdditionalOids] = useState<string[]>([]);
  const [focusOpen, setFocusOpen] = useState(false);
  const [activePane, setActivePane] = useState<Pane>("preview");
  // Bottom-of-workspace toast slot — shared by dice rolls, warn messages
  // (`showWarn`), and Phase 3 reparent commit notifications. Structured as
  // `{ icon, text }` so the rendered glyph matches the source kind: dice
  // rolls show 🎲, warns show ⚠, move commits show ↪. Pre-fifteenth-pass
  // this was a flat `string | null` and the render hardcoded "🎲 {msg}",
  // which made warns render as "🎲 ⚠ msg" — the structured shape ends
  // that bug as a side benefit.
  const [rollToast, setRollToast] = useState<{
    icon: string;
    text: string;
    // Phase 3a — optional inline action button rendered to the right of
    // the toast text. AI Edit success uses this for "Undo". Click fires
    // onAction + dismisses the toast.
    action?: { label: string; onAction: () => void };
  } | null>(null);
  // Sidebar plumbing: Monaco hands us an `insertAtCursor` via onReady (see
  // Editor.tsx — callback prop avoids the forwardRef-through-next/dynamic
  // hole). Sidebar open/close is React state here so Cmd+J / the toolbar
  // button / the sidebar's own collapse chevron all drive the same toggle.
  const editorHandleRef = useRef<EditorHandle | null>(null);
  // Phase E proper — Preview imperative handle. Captured via Preview's
  // onReady callback. Used by the swap handler to fetch slot envelope
  // (parent's content-box + AR) for the LibraryModal compatibility filter
  // and the post-swap drift assessment. Stays null when Preview hasn't
  // mounted yet (initial render before iframe load).
  const previewHandleRef = useRef<PreviewHandle | null>(null);
  // Mirror `code` into a ref so vibe-edit handlers + the idle-commit
  // setTimeout can read the latest source without listing `code` in
  // their dep arrays. Without this, every Monaco keystroke while a
  // vibe element is selected re-creates the swap callbacks AND
  // cancels-then-restarts the 600ms idle-commit timer — the timer
  // never fires until typing stops, and the callbacks lose referential
  // stability. Synced from a single useEffect below, so the ref leads
  // the React state by at most one paint frame.
  const codeRef = useRef<string>("");
  // Vibe-edit selection. Owned by Workspace because the panel (right
  // side) and the source-reconciliation effect both need it. The
  // info object IS the snapshot — Workspace doesn't track a separate
  // "edited but not committed" version; the iframe DOM holds that
  // (mutations land via postVibe), and `info` is the most recent
  // echo of the live element's values.
  const [vibeInfo, setVibeInfo] = useState<VibeElementInfo | null>(null);
  // 2026-05-17 — AI Edit selection state. Distinct from vibeInfo because
  // the iframe runtime gates on DROPIN_TOOL (vibe vs ai) — only one is
  // active at a time. Host-enriched: fingerprint + tokenEstimate are
  // computed from the iframe payload's tag/classes/outerHtml via the
  // lib/ai-edit/ helpers before storing.
  const [aiInfo, setAiInfo] = useState<AiSelectionInfo | null>(null);
  // Phase 2 — AI Edit request lifecycle. `aiBusy` gates the prompt bar
  // shimmer + disables submit during in-flight requests. `aiBusyModel`
  // shows the active model name in the shimmer. `aiAborterRef` holds
  // the AbortController so a tool change / escape / re-submit can
  // cancel an in-flight fetch (plan §6.3: 1 in-flight request per
  // session). `aiLastEdit` holds the pre-swap snapshot for the undo
  // toast — null while idle, populated for a few seconds post-apply.
  const [aiBusy, setAiBusy] = useState(false);
  const [aiBusyModel, setAiBusyModel] = useState<string | null>(null);
  const aiAborterRef = useRef<AbortController | null>(null);
  // Pre-swap snapshot needed by the undo toast button. Kept on a ref
  // (not state) because the toast's onClick reads it once at click
  // time; we don't want toast re-renders on every snapshot update.
  const aiLastEditRef = useRef<{
    path: string;
    originalHtml: string;
  } | null>(null);
  // Snapshot of the last vibeInfo we successfully reconciled to
  // source. When vibeInfo's mutable fields drift away from this
  // snapshot, the idle-debounce effect runs buildVibeCommit. Reset
  // when the user picks a different element (path changes).
  const lastVibeCommitRef = useRef<VibeElementInfo | null>(null);
  // Rate-limit the idle-commit bail toast — that effect fires invisibly
  // on field drift, so without throttling a vibecoder editing a JSX
  // element with a missing OID would see a toast every 600ms while
  // colour-picking. console.warn always fires for diagnosis.
  const lastVibeBailToastRef = useRef<number>(0);
  // Vibe icon swap modal state. Opened by the Swap button inside
  // IconControls (vibe panel); closed on pick / cancel / tool change /
  // selection clear. Mounts the existing LibraryModal in icons-tab
  // swap mode; the picked SVG routes through buildVibeCommit's
  // outer-replacement path so the source reconciles without an iframe
  // rebuild.
  const [vibeIconSwapOpen, setVibeIconSwapOpen] = useState(false);
  // Vibe image swap modal state. Same shape as icon swap — opened by
  // the Browse button in ImageControls, mounts LibraryModal in media
  // mode, picks route through the same outer-replacement patcher.
  const [vibeImageSwapOpen, setVibeImageSwapOpen] = useState(false);
  // Vibe component-swap modal state. Mounted in addition to icon / image
  // for kinds that have no kind-specific library (text/heading/button/
  // link/card/plain container). Opens LibraryModal with suggestedPanel
  // "components" so users land on Uiverse / HyperUI tiles. Same outer-
  // replacement flow as icon + image.
  const [vibeComponentSwapOpen, setVibeComponentSwapOpen] = useState(false);
  // Vibe background-image modal state. Opened from CardControls' "Pick
  // background image" button. Mounts LibraryModal with suggestedPanel
  // "media" but the pick handler routes URL → styleDelta.bgImageUrl
  // (Tailwind arbitrary class), NOT an outerHTML swap. Card / section
  // stays intact; only its bg gets a new image.
  const [vibeBgImageOpen, setVibeBgImageOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  // Phase 5 / Phase C — Insert / Swap structural-edit context.
  //   · `insertTargetOid` is set when the user clicks a target in
  //     Insert tool mode (iframe sends dropin:insert-target-confirmed).
  //     The Sidebar opens with insertContext = { parentOid, targetTag }
  //     and the next tile click runs applyInsertChild against that
  //     parent. Cleared on commit / cancel / tool change.
  //   · `insertTargetTag` is the lowercased tag string for the
  //     "Insert into <tag>" header label. Stored alongside the OID so
  //     the sidebar doesn't need to query the iframe to render the
  //     label.
  //   · Swap context (legacy — Swap tool retired in Phase 6, 2026-05-11
  //     PM). Asset swap from library now lives inside vibe mode via
  //     vibeIconSwapOpen / vibeImageSwapOpen. The LibraryModal /
  //     FocusEditor swapContext props remain on those components for
  //     internal addressability but always pass null from this surface.
  const [insertTargetOid, setInsertTargetOid] = useState<string | null>(null);
  const [insertTargetTag, setInsertTargetTag] = useState<string>("");
  // Phase 6 ramp — accumulated additional insert targets. When the user
  // shift-clicks a second container in Insert mode, the iframe posts
  // `additive: true` and the host appends the OID here. The library's
  // header reads "Insert into N elements" and the asset pick dispatches
  // `applyInsertChildMulti([insertTargetOid, ...additionalInsertTargetOids], jsx)`
  // for one undo entry covering the whole batch. Resets on tool exit /
  // cancel / commit / non-additive click.
  const [additionalInsertTargetOids, setAdditionalInsertTargetOids] = useState<
    string[]
  >([]);
  // Code/Tree/Library panels are mutually exclusive (only one open at a
  // time, see the rail-button handlers below) and never persist — every
  // entry into the workspace lands on the bare rendered preview.
  const [editorHidden, setEditorHidden] = useState<boolean>(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  // 2026-05-15 — "What's next?" helper modal. Wraps three sections:
  // copy code, AI iteration prompts, hosting walkthroughs. State lives
  // here so the button in WorkspaceActions can toggle it.
  const [whatsNextOpen, setWhatsNextOpen] = useState(false);
  // ROADMAP §3.3 — element tree sidebar. Tree comes from the iframe on
  // `dropin:ready`; open state persists across sessions so the user
  // returns to the layout they preferred. Default: closed (most pages
  // are flat enough that the tree's value is for deeply-nested cases;
  // those users can open it on demand).
  const [tree, setTree] = useState<TreeNode[]>([]);
  // Eighteenth-pass — tree-row hover highlight. ElementTree pushes the
  // hovered row's OID; Preview consumes via the `hoverHighlightOid`
  // prop and writes a coral dashed outline live-style for that OID.
  // Cleared on tree-rail close + on selection change.
  const [hoverHighlightOid, setHoverHighlightOid] = useState<string | null>(
    null,
  );
  const [treeOpen, setTreeOpen] = useState<boolean>(false);
  // Client-only mount gate for the dynamic Editor (hydration-safety, ninth-pass
  // fix). `dynamic({ ssr: false })` tells Next to render the loading fallback
  // on the server. On the client, if the Monaco chunk happens to already be in
  // the bundler cache (HMR reload, second navigation, or a fast machine), the
  // dynamic loader can resolve the import synchronously and render the actual
  // Monaco DOM on first client render — which differs structurally from the
  // server's loading fallback and produces a hard hydration error
  // ("Expected server HTML to contain a matching <div> in <div>"). Gating the
  // render through this state forces SSR + initial client render to BOTH
  // produce the same loading visual. After hydration the useEffect flips it
  // and the dynamic loader can safely resolve.
  const [editorMounted, setEditorMounted] = useState(false);
  useEffect(() => {
    setEditorMounted(true);
  }, []);
  // Surfaces a patcher's "nothing changed" reason so users aren't left
  // wondering why Delete / Duplicate / class change did nothing. Falls through
  // the same bottom-of-workspace toast slot as dice rolls, just with a ⚠.
  const showWarn = useCallback((msg: string) => {
    const entry = { icon: "⚠", text: msg };
    setRollToast(entry);
    setTimeout(
      () => setRollToast((s) => (s === entry ? null : s)),
      3200
    );
  }, []);
  // Wire the hook's onError → showWarn. Direct ref assignment during render
  // is safe (refs are mutable containers React doesn't track) and lands
  // before any effect fires — by the time useEditHistory's hydration /
  // persistence effects run, the ref points at the live showWarn.
  errorHandlerRef.current = showWarn;

  // Phase 3 — positive commit notification. Currently used by
  // `handleReparent` to surface "Moved to <main>. Removed: flex-grow." per
  // `phase2-manipulation.md` line 555. Same toast slot as dice rolls /
  // warns; icon ↪ distinguishes the kind. Resolves on a 2.6 s timer
  // (slightly shorter than warns since users don't need to read it
  // carefully — the visual landed where they dropped it).
  const showInfo = useCallback((msg: string) => {
    const entry = { icon: "↪", text: msg };
    setRollToast(entry);
    setTimeout(
      () => setRollToast((s) => (s === entry ? null : s)),
      2600
    );
  }, []);

  // (Phase C / B.2: the 3 ad-hoc Workspace effects — mirror, hydration,
  // persistence — collapsed into useEditHistory above. The hook owns project
  // state, history stack, IDB hydration, and debounced persistence in one
  // place; no inline effects in Workspace anymore.)

  // Prove the code state actually updated after a dice roll / Monaco edit
  // and trace iframe-reload propagation.
  useEffect(() => {
    log("code state updated", {
      len: code.length,
      first80: code.slice(0, 80).replace(/\n/g, " ⏎ "),
    });
  }, [code]);

  // Active file accessors. v1 single-file: activeFile === entry file.
  // Multi-file (Phase B.2 tabs): activeFile is whichever tab is currently
  // open in Monaco. listFiles is sorted bytewise by path so the tab strip
  // renders deterministically.
  const files = useMemo(() => listFiles(project), [project]);
  const activeFile = useMemo(
    () => getFile(project, activeFileId),
    [project, activeFileId],
  );

  // Phase C — multi-file iframe bundling.
  //
  // For single-file projects, `bundleProject` short-circuits to entry source
  // verbatim (zero overhead, identical to the pre-Phase-C path). For multi-
  // file projects with relative imports, the bundler walks the import graph,
  // wraps each non-entry file in a module IIFE, hoists curated-npm imports,
  // and rewrites relative imports to closure-scoped var bindings. Output is
  // a single source string the existing `buildPreviewDocument` consumes.
  //
  // Bundle failures (cycle / unresolved import / re-export / parse error)
  // fall back to the entry source unchanged so the iframe's existing error
  // path takes over (the user sees "Relative imports not supported" or the
  // raw parse error in the preview), AND a toast surfaces via showWarn so
  // the bundle reason isn't hidden behind the iframe's generic message.
  const bundleResult = useMemo(() => bundleProject(project), [project]);

  const entryCode = useMemo(() => {
    if (bundleResult.ok) return bundleResult.source;
    const f = getFile(project, project.entryFileId);
    return f?.source ?? code;
  }, [bundleResult, project, code]);

  // Throttle bundle-error toasts by the error string itself so a sticky cycle
  // (`A → B → A`) doesn't fire one toast per render. Identity-based throttle
  // because the bundler is deterministic — same project shape produces the
  // same error string. Resets when the error clears, so a recovery edit
  // surfaces no toast and a future regression DOES re-fire the toast.
  const lastBundleErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (bundleResult.ok) {
      lastBundleErrorRef.current = null;
      return;
    }
    if (lastBundleErrorRef.current === bundleResult.error) return;
    lastBundleErrorRef.current = bundleResult.error;
    if (errorHandlerRef.current) {
      errorHandlerRef.current(`Bundle error: ${bundleResult.error}`);
    }
  }, [bundleResult]);

  // Per-file Monaco viewState cache (cursor + selection + scroll + folding).
  // @monaco-editor/react preserves the model itself across tab swaps (path
  // prop reuses the model) but Monaco's editor viewState is a property of
  // the editor instance, not the model — switching path resets it. We save
  // viewState BEFORE setActiveFileId fires (so the editor still has the
  // outgoing model + outgoing state), then restore in a useEffect AFTER
  // Monaco's own path-swap effect runs (children-before-parents commit order
  // means Workspace's effect lands after MonacoEditor's). Keyed by path
  // rather than fileId so it survives a rename without losing position.
  const viewStatesRef = useRef<Map<string, unknown>>(new Map());

  const handleTabSwitch = useCallback(
    (nextFileId: FileId) => {
      const handle = editorHandleRef.current;
      // Save outgoing file's viewState before the React state update fires.
      // At this point Monaco's editor still has the outgoing model bound.
      if (handle && activeFile) {
        const state = handle.getViewState();
        if (state) viewStatesRef.current.set(activeFile.path, state);
      }
      setActiveFileId(nextFileId);
    },
    [activeFile, setActiveFileId],
  );

  // Restore the incoming file's viewState (if cached) after Monaco swaps
  // the model. Workspace's useEffect runs after MonacoEditor's path-change
  // useEffect (children commit first), so the restore lands on the freshly
  // swapped model. Cache miss → no restore → editor stays at line 1 col 1
  // (Monaco's default for a newly-bound model).
  useEffect(() => {
    if (!activeFile) return;
    const handle = editorHandleRef.current;
    if (!handle) return;
    const cached = viewStatesRef.current.get(activeFile.path);
    if (cached) handle.restoreViewState(cached);
  }, [activeFile]);

  // Editor language follows the active file's kind so switching from a JSX
  // tab to an HTML tab updates Monaco's tokenizer/syntax-highlighting in
  // place. Falls back to the workspace `kind` for the brief render before
  // hydration if the active file id ever points at a missing record (which
  // shouldn't happen — the hook normalises activeFileId against the latest
  // project — but we want the editor to show *something* in that case).
  const language = useMemo(() => {
    const fileKind = activeFile?.kind;
    if (fileKind === "html") return "html";
    if (fileKind === "ts" || fileKind === "tsx") return "typescript";
    if (fileKind === "js" || fileKind === "jsx") return "javascript";
    return kind === "html" ? "html" : "javascript";
  }, [activeFile, kind]);

  // Add a new file to the project. Uses prompt() for v1 — a real modal would
  // be nicer but prompt() is enough to ship the multi-file UX. normalizePath
  // validates the input (extension, no escape-root, etc.) so we surface the
  // exact error string from the validator, no double-validation here.
  const handleAddFile = useCallback(() => {
    if (typeof window === "undefined") return;
    const raw = window.prompt(
      "New file path (e.g. components/Card.jsx):",
      "components/Card.jsx",
    );
    if (raw === null) return; // user hit cancel
    const trimmed = raw.trim();
    if (!trimmed) return;
    const norm = normalizePath(trimmed);
    if (!norm.ok) {
      showWarn(`Invalid path: ${norm.error}`);
      return;
    }
    let createdId: FileId | null = null;
    setProject((prev) => {
      const r = addFile(prev, { path: norm.path, source: "" });
      if (!r.ok) {
        showWarn(r.error);
        return prev;
      }
      // Pluck the new file's id so we can switch to it after the state lands.
      for (const [id, f] of r.project.files) {
        if (f.path === norm.path) {
          createdId = id;
          break;
        }
      }
      return r.project;
    });
    if (createdId !== null) {
      setActiveFileId(createdId);
      showInfo(`Created ${norm.path}`);
    }
  }, [setProject, setActiveFileId, showWarn, showInfo]);

  // Remove a non-entry file. The op layer rejects entry-file removal so the
  // confirm step is purely UX hygiene. If the removed file was the active
  // tab, fall back to the entry file as the new active.
  const handleRemoveFile = useCallback(
    (fileId: FileId) => {
      if (typeof window === "undefined") return;
      const file = getFile(project, fileId);
      if (!file) return;
      if (fileId === project.entryFileId) {
        showWarn("Can't delete the entry file");
        return;
      }
      const ok = window.confirm(`Delete ${file.path}?`);
      if (!ok) return;
      setProject((prev) => {
        const r = removeFile(prev, fileId);
        if (!r.ok) {
          showWarn(r.error);
          return prev;
        }
        return r.project;
      });
      // If the deleted file was active, fall back to the entry file. Safe
      // even when the deletion failed — activeFileId either stays the same
      // (file still exists) or shifts (file gone, entry takes over).
      if (activeFileId === fileId) {
        setActiveFileId(project.entryFileId);
      }
    },
    [project, activeFileId, setProject, setActiveFileId, showWarn],
  );

  // Ref-mirrored selection state so handleSelectionChange's empty-deps
  // callback can read CURRENT primary / additionals without retriggering
  // Preview's message-listener effect on every selection change.
  const selectionRef = useRef<ElementSelection | null>(null);
  const additionalOidsRef = useRef<string[]>([]);
  // Thirty-first-pass — same pattern for the iframe-emitted tree so the
  // canvas shift-click range-select dispatcher can read the freshest
  // tree shape without re-binding the listener (which would force
  // Preview to re-attach its postMessage handler each tree push).
  const treeRef = useRef<ReadonlyArray<TreeNode>>([]);
  // Phase 5 / Phase B — same pattern for the active tool. The
  // selection-change callback runs with empty deps (so the iframe
  // message listener isn't torn down per render); it reads the
  // freshest tool through this ref to decide whether a click should
  // open the FocusEditor (Select → yes; Move → select-only; View /
  // Insert / Swap → iframe gating already suppressed the POST, but
  // defense-in-depth here too).
  const toolRef = useRef<Tool>("view");
  // ROADMAP §4.1 #4 — Cmd+C / Cmd+V on the canvas selection stashes /
  // applies the full class string. `null` means "nothing copied yet";
  // empty string means "explicitly copied an element with no classes"
  // (paste then clears the target's classes — useful for resetting).
  const clipboardClassesRef = useRef<string | null>(null);
  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);
  useEffect(() => {
    additionalOidsRef.current = additionalOids;
  }, [additionalOids]);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  const handleSelectionChange = useCallback(
    (
      s: ElementSelection | null,
      fromReselect: boolean,
      additive: boolean
    ) => {
      track(`selection change (fromReselect=${fromReselect}, additive=${additive})`,
        s ? { tag: s.tag, oid: s.oid } : null);
      // Phase 2 acceptance #13 — multi-select state machine.
      //
      //   plain click (additive=false, fromReselect=false):
      //     primary = s, additionals = []
      //     → reset to single
      //
      //   shift-click on new oid (additive=true, fromReselect=false):
      //     If clicked oid !== current primary AND not already in additionals:
      //       primary = s, additionals = [...additionals, prevPrimaryOid]
      //     If clicked oid === current primary or already in additionals:
      //       no-op (v1: shift-click on already-selected doesn't toggle off)
      //
      //   programmatic reselect (fromReselect=true): primary = s, additionals
      //     UNCHANGED. We don't want a code edit to clear the multi-select.
      //
      //   clear (s=null): primary = null, additionals = [].
      if (!s) {
        setSelection(null);
        setAdditionalOids([]);
        return;
      }
      if (fromReselect) {
        // Programmatic sync — don't disturb additionals; primary refreshes
        // from the iframe's freshly-resolved payload.
        setSelection(s);
        return;
      }
      // Phase 5 / Phase B — gate focus auto-open by tool. Select opens
      // focus on a fresh click (current behaviour). Move only updates
      // the selection so the position-handle drag has something to
      // grab; it does NOT open focus on click. View / Insert / Swap
      // never reach this branch on a user click — the iframe runtime
      // already suppresses the dropin:select POST in those tools — but
      // defense-in-depth: if a click ever sneaks through (e.g. mid-
      // tool-switch race), don't pop focus open in those modes either.
      const t = toolRef.current;
      const openFocusOnClick = t === "select";
      if (additive) {
        const newOid = s.oid ?? null;
        if (newOid === null) {
          // No OID — fall back to single-select. Multi-select keys on OIDs
          // (live stylesheet rules + bbox subscriptions are OID-keyed),
          // so a non-OID payload (HTML mode, pre-OID JSX paste) can't
          // participate. Treat as plain click.
          setSelection(s);
          setAdditionalOids([]);
          if (openFocusOnClick) setFocusOpen(true);
          return;
        }
        const prevPrimary = selectionRef.current;
        const prevPrimaryOid = prevPrimary?.oid ?? null;
        const prevAdditionals = additionalOidsRef.current;
        // Already-primary or already-additional → no-op (v1 doesn't
        // support toggle-off via shift-click; Esc is the escape hatch).
        if (prevPrimaryOid === newOid) return;
        if (prevAdditionals.includes(newOid)) return;
        // Thirty-first-pass — canvas shift-click range-select. Symmetric
        // with the tree's 30th-pass shift-click range. Compute the
        // inclusive DFS-ordered slice between prevPrimaryOid (anchor)
        // and newOid (clicked) over the iframe-emitted tree. When the
        // range succeeds (length >= 2 i.e. anchor + clicked at minimum),
        // promote clicked to primary + the in-between range members
        // (excluding clicked) become additionalOids. The PRIOR primary
        // is already inside the range (it's the anchor), so it doesn't
        // need separate appending. When range fails (no anchor in tree,
        // missing oids), fall through to the legacy additive single-add
        // below — which appends prevPrimaryOid to additionals.
        if (prevPrimaryOid !== null) {
          const range = collectCanvasShiftClickRangeOids(
            treeRef.current,
            prevPrimaryOid,
            newOid,
          );
          if (range.length >= 2) {
            setSelection(s);
            // range[0] === newOid (clicked, becomes primary). The rest
            // are the slice members in DFS order. Filter out any oid
            // that's somehow already in newOid's spot (defensive — the
            // helper guarantees uniqueness via the for-loop skip).
            setAdditionalOids(range.slice(1));
            return;
          }
        }
        setSelection(s);
        // The prior primary moves into additionals (append unless
        // already there). Skip when no prior primary exists.
        if (prevPrimaryOid !== null && !prevAdditionals.includes(prevPrimaryOid)) {
          setAdditionalOids([...prevAdditionals, prevPrimaryOid]);
        }
        // Don't open focus mode on shift-click — multi-select is a canvas
        // gesture, not an inspector affordance. Focus stays in its
        // current state (open if it already was).
        return;
      }
      // Plain click on a fresh oid — reset to single-select.
      setSelection(s);
      setAdditionalOids([]);
      if (openFocusOnClick) {
        track("→ fresh click, opening focus mode");
        setFocusOpen(true);
      } else {
        track(`→ fresh click in ${t} tool — selection-only, focus stays`);
      }
    },
    []
  );

  const handleTextCommit = useCallback(
    (loc: ElementLoc, text: string, tag?: string) => {
      // `<input>` / `<textarea>` / `<option>` don't have a real text slot —
      // their displayed value lives in attributes, not between open/close tags.
      // Double-click-to-edit on those elements would rewrite nothing useful
      // and would hit `unchanged` in the patcher anyway; we bail early with a
      // clearer toast so the user knows why.
      if (tag === "input" || tag === "textarea" || tag === "option") {
        showWarn(
          `<${tag}> content lives in attributes (value / defaultValue) — edit via the inspector's Attributes section.`,
        );
        return;
      }
      const result =
        loc.kind === "jsx"
          ? patchJsxText(code, loc, text)
          : patchHtmlText(code, loc.path, text);
      if (!result.changed) {
        showWarn(result.reason || "text not updated");
        return;
      }
      setCode(result.source);
    },
    [code, showWarn]
  );

  const handleClassChange = useCallback(
    (loc: ElementLoc, newClass: string) => {
      const result =
        loc.kind === "jsx"
          ? patchJsxClass(code, loc, newClass)
          : patchHtmlClass(code, loc.path, newClass);
      if (!result.changed) {
        showWarn(result.reason || "className not writable");
        return;
      }
      setCode(result.source);
      setSelection((s) => {
        if (!s) return s;
        const trimmed = newClass.trim();
        return {
          ...s,
          classes: trimmed.length ? trimmed.split(/\s+/) : [],
        };
      });
    },
    [code, setCode, showWarn],
  );

  const handleAttrSet = useCallback(
    (loc: ElementLoc, key: string, value: string) => {
      const result =
        loc.kind === "jsx"
          ? patchJsxAttr(code, loc, key, value)
          : patchHtmlAttr(code, loc.path, key, value);
      if (!result.changed) {
        showWarn(result.reason || `could not set ${key}`);
        return;
      }
      setCode(result.source);
      setSelection((s) => {
        if (!s) return s;
        const attrs = s.attrs.filter((a) => a.key !== key);
        attrs.push({ key, value });
        return { ...s, attrs };
      });
    },
    [code, showWarn]
  );

  const handleAttrRemove = useCallback(
    (loc: ElementLoc, key: string) => {
      const result =
        loc.kind === "jsx"
          ? patchJsxRemoveAttr(code, loc, key)
          : patchHtmlRemoveAttr(code, loc.path, key);
      if (!result.changed) {
        showWarn(result.reason || `could not remove ${key}`);
        return;
      }
      setCode(result.source);
      setSelection((s) =>
        s ? { ...s, attrs: s.attrs.filter((a) => a.key !== key) } : s
      );
    },
    [code, showWarn]
  );

  const handleBreadcrumbSelect = useCallback(
    (loc: ElementLoc, oid: string | null) => {
      // Update BOTH loc and oid — passing only loc would let the previous
      // element's oid leak through, and the iframe's OID-first reselect
      // lookup would then jump back to the prior element. Pre-Phase-1
      // selection (no OIDs anywhere) passed oid=null, so behaviour was
      // loc-only and this bug didn't surface.
      setSelection((s) => (s ? { ...s, loc, oid } : s));
    },
    []
  );

  // ROADMAP §3.3 — tree-driven selection. Builds a stub ElementSelection
  // sufficient for Preview's `dropin:reselect` effect to fire; iframe
  // echoes back the full payload via dropin:select with `fromReselect=
  // true`, which `handleSelectionChange` then merges into selection.
  // Doesn't open focus mode — tree click is for navigation, not for
  // diving into edit mode (canvas click stays the way to do that).
  //
  // Eighteenth-pass polish: shift-click in the tree mirrors the canvas's
  // additive-multi-select. With `additive=true` AND a clicked OID, the
  // prior primary's OID gets demoted into `additionalOids` and the
  // clicked node becomes the new primary — same shape as
  // `handleSelectionChange` for canvas shift-click. No-OID nodes (HTML
  // mode) skip the additive branch since multi-select keys on OIDs.
  const handleTreeSelect = useCallback(
    (node: TreeNode, additive: boolean) => {
      const stub: ElementSelection = {
        tag: node.tag,
        loc: node.loc,
        oid: node.oid,
        classes: [...node.classes],
        attrs: [],
        text: null,
        hasOnlyTextChildren: false,
        isVoid: false,
        breadcrumb: [],
      };
      if (additive && node.oid) {
        const prevPrimary = selectionRef.current;
        const prevPrimaryOid = prevPrimary?.oid ?? null;
        const prevAdditionals = additionalOidsRef.current;
        // Already-primary or already-additional → no-op (mirrors canvas
        // shift-click behaviour; Esc is the v1 escape hatch).
        if (prevPrimaryOid === node.oid) return;
        if (prevAdditionals.includes(node.oid)) return;
        setSelection(stub);
        if (
          prevPrimaryOid !== null &&
          !prevAdditionals.includes(prevPrimaryOid)
        ) {
          setAdditionalOids([...prevAdditionals, prevPrimaryOid]);
        }
        return;
      }
      setSelection(stub);
      setAdditionalOids([]);
    },
    [],
  );

  const selectedTreeKey = useMemo<string | null>(() => {
    if (!selection) return null;
    if (selection.oid) return `oid:${selection.oid}`;
    if (selection.loc.kind === "jsx") {
      return `jsx:${selection.loc.startLine}:${selection.loc.startCol}`;
    }
    return `html:${selection.loc.path.join(".")}`;
  }, [selection]);

  const handleDuplicate = useCallback(
    (loc: ElementLoc) => {
      // Phase 3 polish (seventeenth pass) — when the FocusEditor
      // footer's "Duplicate" button fires in jsx mode AND the
      // selection has an OID, route through `applyDuplicate` so the
      // duplicate gets fresh OIDs across the entire subtree. The
      // legacy `duplicateJsxElement` copies source bytes verbatim
      // including `data-dropin-id` attrs, which would yield two
      // elements sharing the same OID — breaks the manipulation
      // system's unique-OID invariant. Falls through to the legacy
      // path on bail (top-level, parse failure) so the user still
      // gets a duplicate with the OID-collision caveat.
      const sel = selectionRef.current;
      if (loc.kind === "jsx" && sel?.oid && kind === "jsx") {
        const r = applyDuplicate(code, { oid: sel.oid });
        if (!r.unchanged) {
          setCode(r.source);
          if (r.newRootOid) {
            const newOid = r.newRootOid;
            setSelection((s) => (s ? { ...s, oid: newOid } : s));
            setAdditionalOids([]);
          }
          return;
        }
      }
      const result =
        loc.kind === "jsx"
          ? duplicateJsxElement(code, loc)
          : duplicateHtmlElement(code, loc.path);
      if (!result.changed) {
        showWarn(result.reason || "could not duplicate element");
        return;
      }
      setCode(result.source);
    },
    [code, kind, setCode, showWarn]
  );

  const handleDelete = useCallback(
    (loc: ElementLoc) => {
      // Same OID-first routing as `handleDuplicate` above. Delete
      // doesn't need the OID-collision avoidance argument (deletes
      // can't introduce collisions), but using `applyDelete` keeps
      // whitespace handling consistent with the Cmd+Backspace path
      // (leading-WS consumed with the element; no orphan indent).
      const sel = selectionRef.current;
      if (loc.kind === "jsx" && sel?.oid && kind === "jsx") {
        const r = applyDelete(code, { oid: sel.oid });
        if (!r.unchanged) {
          setCode(r.source);
          return;
        }
      }
      const result =
        loc.kind === "jsx"
          ? deleteJsxElement(code, loc)
          : deleteHtmlElement(code, loc.path);
      if (!result.changed) {
        showWarn(result.reason || "could not delete element");
        return;
      }
      setCode(result.source);
    },
    [code, kind, setCode, showWarn]
  );

  const handleCopyElement = useCallback(
    (loc: ElementLoc) => {
      const src =
        loc.kind === "jsx"
          ? extractJsxElement(code, loc)
          : extractHtmlElement(code, loc.path);
      if (src) {
        // Strip OIDs on export — same rationale as `exportSource()` in the
        // header. Bare JSX fragments parse as ExpressionStatement under
        // `sourceType: "module"`, so `stripOids` works on the slice. If the
        // parse fails for any reason, stripOids returns the source unchanged
        // and we silently leak the OID — minor, fixable later.
        const cleaned = loc.kind === "jsx" ? stripOids(src).source : src;
        navigator.clipboard.writeText(cleaned).catch((e) => {
          showWarn(
            e instanceof Error
              ? `Copy failed: ${e.message}`
              : "Copy failed: clipboard unavailable",
          );
        });
      }
    },
    [code, showWarn]
  );

  const handleCloseFocus = useCallback(() => {
    track("closing focus mode (back to workspace)");
    setFocusOpen(false);
    // Phase 6 ramp — tool stickiness. Earlier behavior force-reset to
    // View on exit so the next canvas click wouldn't re-open focus;
    // users preferred staying in their last tool (typically Select)
    // to keep editing without a manual toggle. Tool persists as the
    // user left it; if they want View, the V shortcut or the toolbar
    // is right there. Multi-select state is still cleared — it's a
    // per-edit-session concept that shouldn't leak back to the canvas.
    setAdditionalOids([]);
    // Phase 5 / Phase C / C1.4 — clear any in-flight Insert target
    // stash + close the canvas Sidebar that handleInsertTargetConfirmed
    // may have opened mid-flow. Without this, exiting FocusEditor via
    // Done / Back while the LibraryModal was open leaves the canvas
    // Sidebar visible with no context, and a stale insertTargetOid
    // could resurrect an empty insertContext on the next Insert tool
    // entry. Idempotent — no-op when these were already null.
    setInsertTargetOid(null);
    setInsertTargetTag("");
    setAdditionalInsertTargetOids([]);
    setLibraryOpen(false);
  }, []);

  const handleIframeError = useCallback((message: string) => {
    track("iframe error", message);
    const short = message.length > 160 ? message.slice(0, 157) + "…" : message;
    showWarn(`Preview error — ${short}`);
  }, [showWarn]);

  // Phase 2 (4b + twelfth-pass) resize commit. SelectionOverlay calls this on
  // `pointerup` with a declaration map — the gesture has already run the
  // intent resolver to pick CSS prop names per axis (`width` for block
  // children, `flexBasis` for flex-row growing children, etc.). We route
  // through `applyStyleProps` (the generic per-element style-prop
  // rewrite) and push the result via `setCode`. Returning `true` tells
  // the overlay the source change is in flight (the iframe rebuild ~250 ms
  // later wipes the live stylesheet); `false` signals the engine bailed
  // (e.g. `style={cn(...)}`) so the overlay clears its optimistic Track A
  // rule and the visual snaps back to the canonical pre-gesture state.
  // JSX-mode-only: HTML mode lacks OIDs, so SelectionOverlay never reaches
  // this path (its `selectedOid` stays null in HTML mode and `resize`
  // bindings short-circuit on the missing OID).
  const handleResize = useCallback(
    (
      oid: string,
      declarations: Record<string, string | null>
    ): boolean => {
      if (kind !== "jsx") return false;
      const result = applyStyleProps(code, { oid, declarations });
      if (result.unchanged) {
        if (result.reason) {
          log("resize bailed — overlay will snap back", { oid, reason: result.reason });
          showWarn(`Resize: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      return true;
    },
    [code, kind, setCode, showWarn]
  );

  // Phase 2 (4d) spacing commit. Mirrors `handleResize` — runs `applySpacing`
  // which produces a magic-string byte-overwrite that adds or updates per-side
  // longhand props (`paddingTop` / `marginTop` / etc.) on the matched
  // JSXOpeningElement. v1 only ever sends one or two opposite sides per call
  // (one without Alt, two with Alt symmetric); the operation engine accepts
  // any subset of {top, right, bottom, left}. Returning `true` tells the
  // overlay the source change is in flight; `false` means the engine bailed
  // (style is `cn(...)`-flavored / parse failure) so the overlay clears the
  // optimistic Track A rule. Local var named `spacingKind` to avoid shadowing
  // the outer `kind` PreviewKind state.
  const handleSpacing = useCallback(
    (
      oid: string,
      spacingKind: "padding" | "margin",
      sides: { top?: string; right?: string; bottom?: string; left?: string }
    ): boolean => {
      if (kind !== "jsx") return false;
      // (Twelfth-pass) "auto" guard. If the existing source has the affected
      // side set to the literal string "auto" (most common case:
      // `style={{ marginLeft: 'auto', marginRight: 'auto' }}` on a centred
      // block), our numeric source rewrite would silently destroy that
      // semantic. Bail with a toast directing the user to edit it via the
      // Properties Panel instead. Padding can't be `auto` per CSS spec, so
      // the check is margin-only — but we run it for either kind so a future
      // CSS spec change doesn't bite. Sides are passed in lowercase JSX prop
      // suffixes (`top`/`right`/`bottom`/`left`); existing source is read in
      // camelCase via `readSourceStyle`.
      const existingStyle = readSourceStyle(code, oid);
      for (const side of ["top", "right", "bottom", "left"] as const) {
        if (sides[side] === undefined) continue;
        const propName =
          spacingKind === "padding"
            ? `padding${side[0].toUpperCase()}${side.slice(1)}`
            : `margin${side[0].toUpperCase()}${side.slice(1)}`;
        if (existingStyle[propName] === "auto") {
          log("spacing bailed — existing 'auto' value", { oid, propName });
          showWarn(
            `Can't drag — ${propName} is currently 'auto'. Edit it in the Properties Panel.`
          );
          return false;
        }
      }
      const result = applySpacing(code, { oid, kind: spacingKind, ...sides });
      if (result.unchanged) {
        if (result.reason) {
          log("spacing bailed — overlay will snap back", {
            oid,
            kind: spacingKind,
            reason: result.reason,
          });
          showWarn(`Spacing: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      return true;
    },
    [code, kind, setCode, showWarn]
  );

  // Phase 2 acceptance #13 — multi-element coordinated resize commit. The
  // gesture handler in SelectionOverlay calls this on `pointerup` with one
  // declaration map per participating element. We iterate `applyStyleProps`
  // sequentially over a SHARED running source string so the per-element
  // edits land in a SINGLE setCode push (one undo entry, atomic Cmd+Z).
  // If an individual op bails (cn() style attr, missing OID), we log a
  // warn but keep going for the rest — partial success is better than
  // canceling the gesture entirely. Returns the union "any-op-committed"
  // boolean to the gesture handler so it can decide whether to clear the
  // optimistic Track A live stylesheet on bail.
  const handleResizeMulti = useCallback(
    (
      ops: Array<{
        oid: string;
        declarations: Record<string, string | null>;
      }>
    ): boolean => {
      if (kind !== "jsx" || ops.length === 0) return false;
      let next = code;
      let anyCommitted = false;
      let firstBailReason: string | null = null;
      let bailCount = 0;
      for (const op of ops) {
        const result = applyStyleProps(next, op);
        if (result.unchanged) {
          if (result.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = result.reason;
            log("multi-resize: one op bailed (continuing)", {
              oid: op.oid,
              reason: result.reason,
            });
          }
          continue;
        }
        next = result.source;
        anyCommitted = true;
      }
      if (anyCommitted) {
        setCode(next);
      }
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Resize: ${bailCount} of ${ops.length} bailed (${firstBailReason})`,
        );
      }
      return anyCommitted;
    },
    [code, kind, setCode, showWarn]
  );

  // Phase 2 acceptance #13 — multi-element coordinated spacing commit.
  // Same iterate-and-batch pattern as handleResizeMulti but consumes the
  // padding/margin side bag shape. The "auto" guard from handleSpacing is
  // applied per-OID; an OID with an "auto" side is skipped (the rest
  // commit). Single setCode push at the end if any op succeeded.
  const handleSpacingMulti = useCallback(
    (
      ops: Array<{
        oid: string;
        kind: "padding" | "margin";
        sides: { top?: string; right?: string; bottom?: string; left?: string };
      }>
    ): boolean => {
      if (kind !== "jsx" || ops.length === 0) return false;
      let next = code;
      let anyCommitted = false;
      let firstBailReason: string | null = null;
      let bailCount = 0;
      for (const op of ops) {
        const existingStyle = readSourceStyle(next, op.oid);
        let bailedAuto = false;
        for (const side of ["top", "right", "bottom", "left"] as const) {
          if (op.sides[side] === undefined) continue;
          const propName =
            op.kind === "padding"
              ? `padding${side[0].toUpperCase()}${side.slice(1)}`
              : `margin${side[0].toUpperCase()}${side.slice(1)}`;
          if (existingStyle[propName] === "auto") {
            log("multi-spacing: skipping op due to 'auto' side", {
              oid: op.oid,
              propName,
            });
            bailedAuto = true;
            break;
          }
        }
        if (bailedAuto) continue;
        const result = applySpacing(next, {
          oid: op.oid,
          kind: op.kind,
          ...op.sides,
        });
        if (result.unchanged) {
          if (result.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = result.reason;
            log("multi-spacing: one op bailed (continuing)", {
              oid: op.oid,
              reason: result.reason,
            });
          }
          continue;
        }
        next = result.source;
        anyCommitted = true;
      }
      if (anyCommitted) {
        setCode(next);
      }
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Spacing: ${bailCount} of ${ops.length} bailed (${firstBailReason})`,
        );
      }
      return anyCommitted;
    },
    [code, kind, setCode, showWarn]
  );

  // Phase 2 Step 9 (Properties Panel) commit. The panel calls this
  // with a `Record<string, string | null>` declaration map: string
  // values write the prop, `null` values remove the prop, and
  // `undefined` is reserved as "leave alone" (the panel never sends
  // it from the section commit handlers). Routes to `applyStyleProps`
  // — the generic operation that backs all per-prop edits the panel
  // can produce (radius corners, sizing including min/max, padding/
  // margin per side). Same `unchanged + reason` bail pattern as the
  // resize / spacing handlers; warn toast surfaces the reason for
  // expression-flavored style attrs (`style={cn(...)}` etc.).
  const handleSetStyleProps = useCallback(
    (
      oid: string,
      declarations: Record<string, string | null | undefined>
    ): boolean => {
      if (kind !== "jsx") return false;
      const result = applyStyleProps(code, { oid, declarations });
      if (result.unchanged) {
        if (result.reason) {
          log("setStyleProps bailed", { oid, reason: result.reason });
          showWarn(`Style: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      return true;
    },
    [code, kind, setCode, showWarn]
  );

  // 2026-05-15 — "Copy this section" handler. Pulls the selected
  // vibe element's source bytes (OIDs stripped, dedented) and writes
  // them to the clipboard. JSX mode only — HTML mode users get a
  // friendly redirect to the chrome-level Copy button. Errors all
  // route through showWarn; success surfaces a one-line confirmation
  // that names the AI-iteration use case so the vibecoder knows what
  // to do with the clipboard contents.
  const handleCopySection = useCallback(async () => {
    const info = vibeInfo;
    if (!info) return;
    if (kind !== "jsx") {
      showWarn(
        "Per-section copy needs JSX mode. Use the top Copy button to grab the whole template.",
      );
      return;
    }
    if (!info.oid) {
      showWarn(
        "Couldn't find this element in the source. Reload the template and try again.",
      );
      return;
    }
    const result = getJsxElementSource(code, info.oid);
    if (!result.ok || !result.source) {
      showWarn(`Couldn't extract section: ${result.reason ?? "unknown error"}`);
      return;
    }
    try {
      await navigator.clipboard.writeText(result.source);
      showInfo(
        "Section copied. Paste into ChatGPT/Claude to iterate on just this part.",
      );
    } catch (e) {
      showWarn(
        e instanceof Error
          ? `Clipboard failed: ${e.message}`
          : "Clipboard unavailable in this browser",
      );
    }
  }, [vibeInfo, kind, code, showWarn, showInfo]);

  // 2026-05-15 — Reset template. Walks the undo stack to the start
  // via a bounded loop. Works because `useEditHistory.undo()` reads
  // `historyRef.current` (synchronous) and `commitState` updates that
  // ref synchronously — so a tight loop unwinds the entire stack in
  // one render. Past the actual depth, `popUndo` returns null and
  // each call is a microsecond no-op. 1000 is a generous cap; real
  // sessions rarely exceed ~50 edits.
  //
  // The window.confirm prompt is intentionally explicit: this is the
  // ONE flow in the app that can wipe a lot of work without an undo
  // path back. Wording calls that out so the user can't blame the
  // chrome for an accidental click.
  const handleResetTemplate = useCallback(() => {
    if (!canUndo) return;
    const ok = window.confirm(
      "Reset this template?\n\nThis discards every change you've made and restores the original template. Once you click OK there's no undo path back.",
    );
    if (!ok) return;
    for (let i = 0; i < 1000; i += 1) undo();
    showInfo("Template restored to original.");
  }, [canUndo, undo, showInfo]);

  // Phase 3 — reorder commit. Routes the position-handle drag's
  // same-parent drop through `applyReorder`. Returns true iff source
  // changed; gesture overlay reads the boolean to decide whether to
  // clear the optimistic Track A live-stylesheet rule (clear on bail).
  const handleReorder = useCallback(
    (oid: string, parentOid: string, toIndex: number): boolean => {
      // 2026-05-15 move-tool tracer — every entry, even the kind-bail.
      console.log("[dropin:Workspace] handleReorder called", { oid, parentOid, toIndex, kind });
      if (kind !== "jsx") {
        console.log("[dropin:Workspace] handleReorder → bailed (kind !== jsx)", { kind });
        return false;
      }
      const result = applyReorder(code, { oid, parentOid, toIndex });
      console.log("[dropin:Workspace] handleReorder → applyReorder result", {
        unchanged: result.unchanged,
        reason: result.reason,
        sourceChanged: result.source !== code,
      });
      if (result.unchanged) {
        if (result.reason) {
          log("reorder bailed", { oid, parentOid, toIndex, reason: result.reason });
          showWarn(`Reorder: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      console.log("[dropin:Workspace] handleReorder → setCode applied, returning true");
      return true;
    },
    [code, kind, setCode, showWarn]
  );

  // Twenty-seventh-pass — batched same-parent multi-reorder commit for
  // tree DnD. Where `handleReorderMulti` (per-op iterate) covers the
  // SelectionOverlay's "drag N selected bboxes → each commits its own
  // reorder", `handleTreeReorderMulti` covers the tree's "drag N tree
  // rows → coordinated batch where the moved block lands in DFS order
  // at one collapsed-list slot". The per-op approach reverses adjacent-
  // sibling drops because each detach + insert against the running
  // source rewrites the parent's child list out from under the next op;
  // the batched engine `applyReorderMulti` detaches the entire dragged
  // set first, then re-inserts the block at one slot, which avoids the
  // reversal. Bails as a single warn toast (the entire batch fails or
  // succeeds — no partial commit since the engine is atomic).
  const handleTreeReorderMulti = useCallback(
    (parentOid: string, oids: string[], toIndex: number): boolean => {
      if (kind !== "jsx" || oids.length === 0) return false;
      const result = applyReorderMulti(code, { parentOid, oids, toIndex });
      if (result.unchanged) {
        if (result.reason) {
          log("tree-reorder-multi bailed", {
            parentOid,
            oids,
            toIndex,
            reason: result.reason,
          });
          showWarn(`Reorder: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      const count = oids.length;
      showInfo(count > 1 ? `Reordered ${count} elements` : "Reordered");
      return true;
    },
    [code, kind, setCode, showInfo, showWarn]
  );

  // Twenty-eighth pass — mixed-bucket multi-DnD commit. The resolver
  // returns this kind when dragged oids include BOTH same-parent (need
  // reorder) AND cross-parent (need reparent) items relative to the
  // drop target. Strategy: run reorder-multi first against the original
  // source so the same-parent block lands at the drop slot; then
  // sequentially reparent each cross item against the running source
  // with insertIndex bumped by `i` so all dragged items end up
  // contiguous and DFS-ordered at the drop slot. Single setCode → one
  // undo entry covers the entire batch. Reorder bail aborts (the cross
  // ops would land at the wrong slot without it). Cross bails are
  // logged but not toasted (partial success > full failure) — bench
  // case #29 covers the mid-batch bail invariant.
  const handleTreeDndMixed = useCallback(
    (
      parentOid: string,
      sameParentOids: string[],
      sameParentToIndex: number,
      crossParentOps: ReparentMultiOp[],
      newParentTag?: string,
    ): boolean => {
      if (kind !== "jsx") return false;
      if (sameParentOids.length === 0 && crossParentOps.length === 0) {
        return false;
      }
      let next = code;
      let committed = 0;
      // Step 1: same-parent batch via applyReorderMulti.
      if (sameParentOids.length > 0) {
        const reorderResult = applyReorderMulti(next, {
          parentOid,
          oids: sameParentOids,
          toIndex: sameParentToIndex,
        });
        if (reorderResult.unchanged) {
          if (reorderResult.reason) {
            // Hard bail (parse failure, cycle, oid-not-child, etc.) —
            // abort the whole batch so cross items don't land at a slot
            // computed against a stale parent.
            log("mixed-dnd reorder bailed (aborting)", {
              parentOid,
              oids: sameParentOids,
              toIndex: sameParentToIndex,
              reason: reorderResult.reason,
            });
            showWarn(`Move: ${reorderResult.reason}`);
            return false;
          }
          // Twenty-ninth-pass — intentional no-op (block already at the
          // target slot; common in inside-mixed where same-parent items
          // are already direct children of target). Skip step 1's
          // mutation but continue to step 2 — cross-parent items still
          // need their reparent ops applied. The committed counter only
          // reflects items that moved; same-parent items count as
          // "already there", which matches the toast's intent.
          log("mixed-dnd reorder no-op (continuing)", {
            parentOid,
            oids: sameParentOids,
            toIndex: sameParentToIndex,
          });
        } else {
          next = reorderResult.source;
          committed += sameParentOids.length;
        }
      }
      // Step 2: cross-parent batch via per-op applyReparent against
      // the running source. Track bailCount + firstBailReason so the
      // user gets a partial-bail warning toast — same pattern as
      // handleReorderMulti / handleReparentMulti / etc. (audit-2026-05-04
      // §3 fix). Without this, a 5-op mixed drag where 2 ops bail (e.g.
      // cycle, destination changed) shows only "Moved 3 elements" and
      // the user has no idea 2 ops silently dropped.
      let bailCount = 0;
      let firstBailReason: string | null = null;
      for (const op of crossParentOps) {
        const result = applyReparent(next, op);
        if (result.unchanged) {
          if (result.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = result.reason;
            log("mixed-dnd reparent bailed (continuing)", {
              oid: op.oid,
              insertIndex: op.insertIndex,
              reason: result.reason,
            });
          }
          continue;
        }
        next = result.source;
        committed++;
      }
      if (committed === 0) return false;
      setCode(next);
      const where = newParentTag ? ` to <${newParentTag}>` : "";
      showInfo(
        committed === 1 ? `Moved${where}` : `Moved ${committed} elements${where}`,
      );
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Reparent: ${bailCount} of ${crossParentOps.length} bailed (${firstBailReason})`,
        );
      }
      return true;
    },
    [code, kind, setCode, showInfo, showWarn],
  );

  // Twenty-ninth-pass — Cmd/Ctrl+A in tree. ElementTree's pure helper
  // returns the oid list (primary first); this handler turns it into a
  // canvas-shape selection: oids[0] becomes selection.oid via a stub
  // ElementSelection (the iframe's reselect echo replaces with the full
  // payload), and oids.slice(1) becomes additionalOids. Reads `tree`
  // directly to pull the primary's tag/loc/classes — handleTreeSelect
  // does the same shape.
  const handleSelectAllInTree = useCallback(
    (oids: string[]) => {
      if (oids.length === 0) return;
      if (kind !== "jsx") return;
      const primaryOid = oids[0];
      let primaryNode: TreeNode | null = null;
      const walk = (arr: ReadonlyArray<TreeNode>) => {
        for (const n of arr) {
          if (primaryNode) return;
          if (n.oid === primaryOid) {
            primaryNode = n;
            return;
          }
          if (n.children.length > 0) walk(n.children);
        }
      };
      walk(tree);
      if (!primaryNode) return;
      const node = primaryNode as TreeNode;
      const stub: ElementSelection = {
        tag: node.tag,
        loc: node.loc,
        oid: node.oid,
        classes: [...node.classes],
        attrs: [],
        text: null,
        hasOnlyTextChildren: false,
        isVoid: false,
        breadcrumb: [],
      };
      setSelection(stub);
      setAdditionalOids(oids.slice(1));
      log("Cmd+A → tree select-all", {
        primary: primaryOid,
        total: oids.length,
      });
      showInfo(
        oids.length === 1
          ? "Selected 1 element"
          : `Selected ${oids.length} elements`,
      );
    },
    [kind, tree, showInfo],
  );

  // Phase 3 polish — multi-element reorder commit. Iterate-and-batch
  // pattern matching `handleResizeMulti` / `handleSpacingMulti`: walk
  // ops over a running source string, accumulate per-op bails, push a
  // single setCode at the end so one undo entry covers the entire
  // multi-element reorder. Bails on individual ops are logged but not
  // toasted — partial success ("3 of 5 reordered") is still better than
  // failing the whole gesture. Returns true iff at least one op landed.
  const handleReorderMulti = useCallback(
    (
      ops: Array<{ oid: string; parentOid: string; toIndex: number }>
    ): boolean => {
      if (kind !== "jsx" || ops.length === 0) return false;
      let next = code;
      let anyCommitted = false;
      let firstBailReason: string | null = null;
      let bailCount = 0;
      for (const op of ops) {
        const result = applyReorder(next, op);
        if (result.unchanged) {
          if (result.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = result.reason;
            log("multi-reorder: one op bailed (continuing)", {
              oid: op.oid,
              reason: result.reason,
            });
          }
          continue;
        }
        next = result.source;
        anyCommitted = true;
      }
      if (anyCommitted) setCode(next);
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Reorder: ${bailCount} of ${ops.length} bailed (${firstBailReason})`,
        );
      }
      return anyCommitted;
    },
    [code, kind, setCode, showWarn]
  );

  // Phase 3 — reparent commit. Routes the position-handle drag's
  // cross-parent drop through `applyReparent`. `propsToRemove` is
  // computed by the gesture (e.g. drop `flexBasis` when the new parent
  // isn't flex). `newParentTag` is the destination's lowercased tag name
  // — used in the success toast per `phase2-manipulation.md` line 555.
  // The engine bails (and we return false) if the drop would create a
  // cycle, the new parent is self-closing, etc. — those are gesture-time
  // issues but the engine guards as belt-and-braces.
  const handleReparent = useCallback(
    (
      oid: string,
      newParentOid: string,
      insertIndex: number,
      propsToRemove?: string[],
      newParentTag?: string
    ): boolean => {
      // 2026-05-15 move-tool tracer — every entry, even the kind-bail.
      console.log("[dropin:Workspace] handleReparent called", {
        oid,
        newParentOid,
        insertIndex,
        propsToRemove,
        newParentTag,
        kind,
      });
      if (kind !== "jsx") {
        console.log("[dropin:Workspace] handleReparent → bailed (kind !== jsx)", { kind });
        return false;
      }
      const result = applyReparent(code, {
        oid,
        newParentOid,
        insertIndex,
        propsToRemove,
      });
      console.log("[dropin:Workspace] handleReparent → applyReparent result", {
        unchanged: result.unchanged,
        reason: result.reason,
        sourceChanged: result.source !== code,
      });
      if (result.unchanged) {
        if (result.reason) {
          log("reparent bailed", {
            oid,
            newParentOid,
            insertIndex,
            reason: result.reason,
          });
          showWarn(`Reparent: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      // Spec line 555: "Moved to <main>. Removed: flex-grow." Toast
      // describes the move in human terms; the precise CSS prop names
      // get hyphenated for the message (`flexGrow` → `flex-grow`) since
      // that's how vibecoders see them in editor & devtools. Skip the
      // tag fragment when we don't know the destination's tag (engine-
      // direct callers, e.g. tests).
      const where = newParentTag ? ` to <${newParentTag}>` : "";
      const removed = (propsToRemove ?? []).filter((p) => p && p.length);
      const removedFragment =
        removed.length > 0
          ? `. Removed: ${removed
              .map((p) => p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()))
              .join(", ")}`
          : "";
      showInfo(`Moved${where}${removedFragment}`);
      return true;
    },
    [code, kind, setCode, showWarn, showInfo]
  );

  // Phase 3 polish — multi-element reparent commit. Same iterate-and-
  // batch pattern as handleReorderMulti. Each op carries its own
  // propsToRemove (gesture computes them identically per-op based on
  // destination direction; passing per-op keeps the engine API uniform).
  // Toast surfaces the destination tag + the union of removed props
  // across all ops (deduplicated). Single setCode → one undo entry
  // atomic across the multi-select.
  const handleReparentMulti = useCallback(
    (
      ops: Array<{
        oid: string;
        newParentOid: string;
        insertIndex: number;
        propsToRemove?: string[];
      }>,
      newParentTag?: string
    ): boolean => {
      if (kind !== "jsx" || ops.length === 0) return false;
      let next = code;
      let anyCommitted = false;
      let firstBailReason: string | null = null;
      let bailCount = 0;
      const removedUnion = new Set<string>();
      for (const op of ops) {
        const result = applyReparent(next, op);
        if (result.unchanged) {
          if (result.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = result.reason;
            log("multi-reparent: one op bailed (continuing)", {
              oid: op.oid,
              reason: result.reason,
            });
          }
          continue;
        }
        next = result.source;
        anyCommitted = true;
        for (const p of op.propsToRemove ?? []) removedUnion.add(p);
      }
      if (!anyCommitted) {
        if (bailCount > 0 && firstBailReason !== null) {
          showWarn(
            `Reparent: all ${ops.length} bailed (${firstBailReason})`,
          );
        }
        return false;
      }
      setCode(next);
      const where = newParentTag ? ` to <${newParentTag}>` : "";
      const removed = Array.from(removedUnion).filter((p) => p && p.length);
      const removedFragment =
        removed.length > 0
          ? `. Removed: ${removed
              .map((p) => p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()))
              .join(", ")}`
          : "";
      const count = ops.length;
      showInfo(`Moved ${count} elements${where}${removedFragment}`);
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Reparent: ${bailCount} of ${ops.length} bailed (${firstBailReason})`,
        );
      }
      return true;
    },
    [code, kind, setCode, showInfo, showWarn]
  );

  // Phase 3 polish (seventeenth pass) — duplicate-by-OID. Mints fresh
  // OIDs across the duplicated subtree so the unique-OID invariant
  // holds (the legacy `handleDuplicate` above is loc-based and copies
  // OIDs verbatim — that path is kept for the FocusEditor footer
  // button which still works in OID-less HTML mode). Returns true on
  // success, surfaces bail reasons via `showWarn`. On success, re-
  // selects the new copy via OID so the user can act on it
  // immediately — the old loc carried by `selection` is stale but
  // iframe's reselect tries OID first and re-emits the fresh loc via
  // `dropin:select` after the rebuild.
  const handleDuplicateByOid = useCallback(
    (oid: string): boolean => {
      if (kind !== "jsx") return false;
      const result = applyDuplicate(code, { oid });
      if (result.unchanged) {
        if (result.reason) {
          log("duplicate bailed", { oid, reason: result.reason });
          showWarn(`Duplicate: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      showInfo("Duplicated");
      if (result.newRootOid) {
        const newOid = result.newRootOid;
        setSelection((s) => (s ? { ...s, oid: newOid } : s));
        setAdditionalOids([]);
      }
      return true;
    },
    [code, kind, setCode, showWarn, showInfo]
  );

  // Multi-element duplicate. Iterate-and-batch over a running source so
  // a single setCode produces one undo entry across the whole multi-
  // select. Each duplicate runs through `applyDuplicate` independently,
  // so each gets its own freshly-minted OIDs. Bails on individual ops
  // are logged but not toasted (partial success > full failure). The
  // toast reflects the count of ops that actually committed.
  // Post-commit, re-selects the new duplicates: the first new OID
  // becomes the primary selection, the rest become `additionalOids`,
  // mirroring the multi-select shape the user just acted on.
  const handleDuplicateMulti = useCallback(
    (oids: ReadonlyArray<string>): boolean => {
      if (kind !== "jsx" || oids.length === 0) return false;
      let next = code;
      let committed = 0;
      let firstBailReason: string | null = null;
      let bailCount = 0;
      const newOids: string[] = [];
      for (const oid of oids) {
        const result = applyDuplicate(next, { oid });
        if (result.unchanged) {
          if (result.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = result.reason;
            log("multi-duplicate: one op bailed (continuing)", {
              oid,
              reason: result.reason,
            });
          }
          continue;
        }
        next = result.source;
        committed++;
        if (result.newRootOid) newOids.push(result.newRootOid);
      }
      if (committed === 0) {
        if (bailCount > 0 && firstBailReason !== null) {
          showWarn(
            `Duplicate: all ${oids.length} bailed (${firstBailReason})`,
          );
        }
        return false;
      }
      setCode(next);
      showInfo(committed === 1 ? "Duplicated" : `Duplicated ${committed} elements`);
      if (newOids.length > 0) {
        const [primary, ...rest] = newOids;
        setSelection((s) => (s ? { ...s, oid: primary } : s));
        setAdditionalOids(rest);
      }
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Duplicate: ${bailCount} of ${oids.length} bailed (${firstBailReason})`,
        );
      }
      return true;
    },
    [code, kind, setCode, showInfo, showWarn]
  );

  // Phase 3 polish (seventeenth pass) — delete-by-OID. Same shape as
  // handleDuplicateByOid; routes through `applyDelete` which removes
  // the element + its leading whitespace separator.
  const handleDeleteByOid = useCallback(
    (oid: string): boolean => {
      if (kind !== "jsx") return false;
      const result = applyDelete(code, { oid });
      if (result.unchanged) {
        if (result.reason) {
          log("delete bailed", { oid, reason: result.reason });
          showWarn(`Delete: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
      showInfo("Deleted");
      return true;
    },
    [code, kind, setCode, showWarn, showInfo]
  );

  // Multi-element delete. Same iterate-and-batch pattern. Note: the
  // gesture path doesn't need to consider order — applyDelete uses
  // OIDs which are stable across siblings, so deletes commute. Single
  // setCode → one undo entry.
  const handleDeleteMulti = useCallback(
    (oids: ReadonlyArray<string>): boolean => {
      if (kind !== "jsx" || oids.length === 0) return false;
      let next = code;
      let committed = 0;
      let firstBailReason: string | null = null;
      let bailCount = 0;
      for (const oid of oids) {
        const result = applyDelete(next, { oid });
        if (result.unchanged) {
          if (result.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = result.reason;
            log("multi-delete: one op bailed (continuing)", {
              oid,
              reason: result.reason,
            });
          }
          continue;
        }
        next = result.source;
        committed++;
      }
      if (committed === 0) {
        if (bailCount > 0 && firstBailReason !== null) {
          showWarn(
            `Delete: all ${oids.length} bailed (${firstBailReason})`,
          );
        }
        return false;
      }
      setCode(next);
      showInfo(committed === 1 ? "Deleted" : `Deleted ${committed} elements`);
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Delete: ${bailCount} of ${oids.length} bailed (${firstBailReason})`,
        );
      }
      return true;
    },
    [code, kind, setCode, showInfo, showWarn]
  );

  // Phase 5 / Phase C / C1 — Insert tool target confirmation. Iframe
  // sends `dropin:insert-target-confirmed` after hit-testing a click in
  // insert mode. Workspace stashes the OID + tag and opens the library
  // sidebar; the next tile click runs `applyInsertChild` against that
  // parent. Defensive: only acts when tool === "insert" (a stale
  // message arriving after a tool switch would be ignored).
  const handleInsertTargetConfirmed = useCallback(
    (oid: string, tag: string, additive?: boolean) => {
      if (toolRef.current !== "insert") {
        log("ignored insert-target-confirmed (not in insert tool)", { tool: toolRef.current });
        return;
      }
      log("insert target confirmed", { oid, tag, additive: !!additive });
      // Phase 6 ramp — shift-click accumulates additional targets.
      // Plain click replaces the primary AND clears any prior additions.
      // The first click in a session always lands as the primary
      // (additive flag has no effect when no primary exists yet).
      if (additive && insertTargetOid) {
        if (oid === insertTargetOid) {
          // Re-clicking the primary: no-op (it's already in the set).
          setLibraryOpen(true);
          return;
        }
        setAdditionalInsertTargetOids((cur) =>
          cur.includes(oid) ? cur : [...cur, oid],
        );
        setLibraryOpen(true);
        return;
      }
      // Plain click (or shift-click before any primary exists) → set the
      // primary fresh and reset accumulated additions.
      setInsertTargetOid(oid);
      setInsertTargetTag(tag);
      setAdditionalInsertTargetOids([]);
      setLibraryOpen(true);
    },
    [insertTargetOid]
  );

  // Phase 5 / Phase C / C1 — Insert tool commit. Routes the library's
  // selected asset through `applyInsertChild`. On success: re-select
  // the new element (the iframe's reselect resolves the OID after the
  // rebuild) and revert tool to Select so the user can immediately
  // act on the inserted node.
  const handleInsertInto = useCallback(
    (parentOid: string, jsx: string) => {
      if (kind !== "jsx") {
        showWarn("Insert: only JSX mode supports structural inserts");
        return;
      }
      const result = applyInsertChild(code, { parentOid, jsx });
      if (result.unchanged) {
        if (result.reason) {
          log("insert bailed", { parentOid, reason: result.reason });
          showWarn(`Insert: ${result.reason}`);
        }
        return;
      }
      setCode(result.source);
      showInfo("Inserted");
      if (result.insertedOid) {
        const newOid = result.insertedOid;
        setSelection((s) => (s ? { ...s, oid: newOid } : s));
        setAdditionalOids([]);
      }
      setInsertTargetOid(null);
      setInsertTargetTag("");
      setAdditionalInsertTargetOids([]);
      setTool("select");
    },
    [code, kind, setCode, showWarn, showInfo, setTool]
  );

  // Phase 6 ramp from `phase5-tools-isolation.md` §5 ("Multi-element
  // insert" — Insert tool currently single-target). Iterate-and-batch
  // composition over `applyInsertChild` against a running source so a
  // single setCode at the end gives one undo entry covering the whole
  // batch. Per-op bail reasons are logged but not toasted (partial
  // success is still better than failing the whole batch); aggregate
  // success/failure surfaces via a count-aware toast. The freshly-
  // minted root OID of the FIRST committed insert becomes the next
  // selection so the user has somewhere to start (Select tool reverts
  // automatically). The multi-bench locks fresh-OID uniqueness across
  // batches: each per-op call rebuilds its `seen` set from the running
  // source so previously-minted OIDs are visible and avoided.
  const handleInsertIntoMulti = useCallback(
    (parentOids: string[], jsx: string) => {
      if (kind !== "jsx") {
        showWarn("Insert: only JSX mode supports structural inserts");
        return;
      }
      if (parentOids.length === 0) return;
      let next = code;
      let committed = 0;
      let firstNewOid: string | null = null;
      let firstBailReason: string | null = null;
      let bailCount = 0;
      for (const parentOid of parentOids) {
        const r = applyInsertChild(next, { parentOid, jsx });
        if (r.unchanged) {
          if (r.reason) {
            bailCount++;
            if (firstBailReason === null) firstBailReason = r.reason;
            log("multi-insert: one op bailed (continuing)", {
              parentOid,
              reason: r.reason,
            });
          }
          continue;
        }
        next = r.source;
        committed++;
        if (firstNewOid === null && r.insertedOid) {
          firstNewOid = r.insertedOid;
        }
      }
      if (committed === 0) {
        if (bailCount > 0 && firstBailReason !== null) {
          showWarn(
            `Insert: all ${parentOids.length} bailed (${firstBailReason})`,
          );
        } else {
          showWarn("Insert: no targets accepted the asset");
        }
        return;
      }
      setCode(next);
      showInfo(
        committed === 1 ? "Inserted" : `Inserted into ${committed} elements`
      );
      if (firstNewOid) {
        const newOid = firstNewOid;
        setSelection((s) => (s ? { ...s, oid: newOid } : s));
        setAdditionalOids([]);
      }
      setInsertTargetOid(null);
      setInsertTargetTag("");
      setAdditionalInsertTargetOids([]);
      setTool("select");
      if (bailCount > 0 && firstBailReason !== null) {
        showWarn(
          `Insert: ${bailCount} of ${parentOids.length} bailed (${firstBailReason})`,
        );
      }
    },
    [code, kind, setCode, showWarn, showInfo, setTool]
  );

  // Phase 5 / Phase C / C2 — Swap tool commit. Replaces the currently
  // selected element with the picked library asset.
  //
  // Twenty-third pass — Phase 6 ramp from `phase5-tools-isolation.md`
  // §5 ("Swap with preserve-children"). The optional third arg comes
  // from the Sidebar's "Keep children" toggle; when true, the engine
  // splices the source element's children into the asset's root
  // instead of discarding them. Default false → unchanged v1
  // behaviour.
  //
  // Phase E proper — auto-fit + post-swap drift assessment. Before the
  // structural swap lands, we ask the iframe for the slot envelope of
  // the target's parent (parent's content-box + AR via the new
  // `dropin:get-envelope` channel). `applySwapWithFit` composes the
  // structural swap + className auto-fit (overflow → w-full, AR drift
  // > 10% → aspect-[X/1]) so both edits land as ONE undo entry.
  // After the iframe rebuilds, we re-fetch the envelope to compare
  // pre/post bbox; if drift exceeds 10% the user gets a warn toast so
  // they can keep the swap or undo.
  const handleSwap = useCallback(
    async (targetOid: string, jsx: string, preserveChildren?: boolean) => {
      if (kind !== "jsx") {
        showWarn("Swap: only JSX mode supports swap");
        return;
      }
      // Pre-swap envelope read. Best-effort: when the Preview handle
      // isn't ready, the iframe didn't measure the parent, or the read
      // times out, we skip the fit step and fall through to a raw swap.
      const handle = previewHandleRef.current;
      let envelope: SlotEnvelope | null = null;
      let preChildRect: { widthPx: number; heightPx: number } | null = null;
      if (handle) {
        try {
          const readback = await handle.requestEnvelope(targetOid);
          if (readback) {
            envelope = composeEnvelopeFromBbox(parentBoxFromRect(readback.parent));
            preChildRect = readback.childRect;
          }
        } catch (e) {
          log("swap envelope read failed (continuing without fit)", {
            targetOid,
            err: String(e),
          });
        }
      }

      const result = applySwapWithFit(
        code,
        {
          oid: targetOid,
          jsx,
          preserveChildren: !!preserveChildren,
        },
        envelope,
      );
      if (result.unchanged) {
        if (result.reason) {
          log("swap bailed", {
            targetOid,
            reason: result.reason,
            preserveChildren: !!preserveChildren,
          });
          showWarn(`Swap: ${result.reason}`);
        }
        return;
      }
      setCode(result.source);
      const baseToast = preserveChildren ? "Swapped (kept children)" : "Swapped";
      if (result.fitApplied && envelope) {
        const fitMessage = summarizeSwapFitChanges(result.fitChanges, envelope);
        showInfo(fitMessage ? `${baseToast} · ${fitMessage}` : baseToast);
      } else {
        showInfo(baseToast);
      }
      if (result.swappedOid) {
        const newOid = result.swappedOid;
        setSelection((s) => (s ? { ...s, oid: newOid } : s));
        setAdditionalOids([]);
        // Post-swap drift assessment — fire after the iframe has had a
        // chance to rebuild + re-render. setCode → 250ms srcDoc debounce
        // + iframe reload + first paint runs ~400-600ms in practice;
        // 700ms gives a safe margin without holding the user's eye too
        // long. Best-effort: null readback (iframe still rebuilding,
        // element conditionally not rendered, etc.) skips the check.
        if (preChildRect && handle) {
          window.setTimeout(() => {
            const h = previewHandleRef.current;
            if (!h) return;
            h.requestEnvelope(newOid)
              .then((post) => {
                if (!post || !post.childRect) return;
                const verdict = assessBboxDrift(preChildRect, post.childRect);
                if (!verdict.ok && verdict.message) {
                  showWarn(verdict.message);
                }
              })
              .catch((e) => {
                log("post-swap drift read failed", { newOid, err: String(e) });
              });
          }, 700);
        }
      }
      setTool("select");
    },
    [code, kind, setCode, showWarn, showInfo, setTool]
  );

  // Phase 5 / Phase C / C4 — Library palette swap. Scope respects mode:
  //   · FocusEditor open + JSX mode → scope is the focused subtree
  //     (collected from the current source via collectDescendantOids).
  //   · Workspace mode (or HTML) → scope is "all".
  // Bails on no-source-change with a friendly toast so the user knows
  // why nothing happened.
  const handleApplyPalette = useCallback(
    (paletteId: string) => {
      if (kind !== "jsx") {
        showWarn("Palette: only JSX mode supports palette swap");
        return;
      }
      const palette = getPaletteById(paletteId);
      if (!palette) {
        showWarn(`Palette "${paletteId}" not found`);
        return;
      }
      let scope: "all" | { oids: string[] } = "all";
      const focusedOid = focusOpen ? selectionRef.current?.oid ?? null : null;
      if (focusedOid) {
        const oids = collectDescendantOids(code, focusedOid);
        if (oids.length === 0) {
          showWarn(`Palette: focused subtree resolved 0 elements — applying to page`);
        } else {
          scope = { oids };
        }
      }
      // 2026-05-20 — Two-pass palette swap:
      //   (1) applyPalette rewrites class tokens (bg-blue-500,
      //       bg-[#hex]).
      //   (2) applyPaletteToConfigColors rewrites the embedded
      //       tailwind.config.theme.extend.colors block (Material 3
      //       design tokens like "primary-container", "surface-
      //       container-low", "on-surface-variant").
      // Templates use either or both; we run both passes and combine.
      const classResult = applyPalette(code, { palette, scope });
      const passOneSource = classResult.unchanged ? code : classResult.source;
      const configResult = applyPaletteToConfigColors(passOneSource, palette);

      const finalSource = configResult.unchanged
        ? passOneSource
        : configResult.source;
      const anyChange = !classResult.unchanged || !configResult.unchanged;

      if (!anyChange) {
        log("palette bailed", {
          paletteId,
          classReason: classResult.reason,
          configTokens: configResult.tokensRewritten,
        });
        showWarn(
          classResult.reason
            ? `Palette: ${classResult.reason}`
            : "Palette: this template uses colors that can't be auto-remapped",
        );
        return;
      }
      setCode(finalSource);
      const parts: string[] = [];
      if (!classResult.unchanged) parts.push("classes");
      if (!classResult.unchanged && classResult.reason)
        log("palette class-pass reason", classResult.reason);
      if (configResult.tokensRewritten > 0)
        parts.push(`${configResult.tokensRewritten} design tokens`);
      showInfo(`Applied ${palette.name} — ${parts.join(" + ")}`);
    },
    [code, kind, focusOpen, setCode, showWarn, showInfo]
  );

  // Phase 5 / Phase C — cancel handlers route through tool change so
  // the Insert / Swap state machine stays consistent with the
  // toolbar. Cancelling drops the user back to the Select tool — a
  // sensible neutral after a structural edit was abandoned.
  const handleCancelInsert = useCallback(() => {
    log("cancel insert");
    setInsertTargetOid(null);
    setInsertTargetTag("");
    setAdditionalInsertTargetOids([]);
    setTool("select");
  }, [setTool]);
  const handleCancelSwap = useCallback(() => {
    log("cancel swap");
    setTool("select");
  }, [setTool]);

  const handleKindChange = useCallback((k: PreviewKind) => {
    setKind(k);
    setSelection(null);
    setAdditionalOids([]);
    setFocusOpen(false);
  }, []);

  const handleEditorReady = useCallback((h: EditorHandle) => {
    editorHandleRef.current = h;
  }, []);

  // Vibe-edit selection callbacks. The iframe runtime emits
  // vibe:selected with a fresh VibeElementInfo on every click and
  // every direct-mutation re-emit; the panel reads from the latest
  // info to populate its fields.
  //
  // Closing swap modals when the user clicks a DIFFERENT element
  // prevents the stale-target swap bug: user opens the icon library
  // for element A, clicks element B (different icon) on the canvas,
  // then picks from the library → without this guard, the pick would
  // mutate element B because the modal stays open and reads vibeInfo
  // from closure. The vibe:selected re-emits that follow our OWN
  // direct mutations carry the same path, so this only closes on a
  // genuine user-driven selection change.
  const handleVibeSelected = useCallback((info: VibeElementInfo) => {
    track("vibe:selected", {
      tag: info.tag,
      kind: info.kind,
      oid: info.oid,
      path: info.path,
      classes: info.classes,
      hasInstanceCount: typeof info.instanceCount === "number" ? info.instanceCount : null,
    });
    setVibeInfo((prev) => {
      if (prev && prev.path !== info.path) {
        setVibeIconSwapOpen(false);
        setVibeImageSwapOpen(false);
        setVibeComponentSwapOpen(false);
        setVibeBgImageOpen(false);
      }
      return info;
    });
  }, []);

  const handleVibeCleared = useCallback(() => {
    setVibeInfo(null);
    lastVibeCommitRef.current = null;
    setVibeIconSwapOpen(false);
    setVibeImageSwapOpen(false);
    setVibeComponentSwapOpen(false);
    setVibeBgImageOpen(false);
  }, []);

  // 2026-05-17 — AI Edit selection handler. Enriches the iframe-emitted
  // payload with fingerprint (via makeFingerprint, which filters
  // Tailwind utility chrome out so the scope chip stays readable) and
  // tokenEstimate (chars/3.5 for the §6.1 large-section warning).
  const handleAiSelected = useCallback((payload: AiSelectionPayload) => {
    track("ai:selected", {
      tag: payload.tag,
      path: payload.path,
      scope: payload.scope,
      outerHtmlLen: payload.outerHtml.length,
    });
    // Bug #1 fix — abort any in-flight AI request when the user clicks
    // a new element. Otherwise the stale request lands and swaps the
    // PREVIOUSLY selected element while the user is staring at a
    // different one. Only abort when the path actually changed (the
    // iframe re-emits ai:selected after every apply with the same
    // path, which is NOT a user-initiated selection change).
    setAiInfo((prev) => {
      if (prev && prev.path === payload.path) {
        // Same node, possibly different scope after Tab — keep
        // in-flight request alive. Refresh fingerprint + tokens for
        // the updated outerHtml.
        return {
          ...payload,
          fingerprint: makeFingerprint(payload.tag, payload.classes),
          tokenEstimate: estimateTokens(payload.outerHtml),
        };
      }
      // Different node — invalidate any pending request.
      if (aiAborterRef.current) {
        aiAborterRef.current.abort();
        aiAborterRef.current = null;
      }
      setAiBusy(false);
      setAiBusyModel(null);
      return {
        ...payload,
        fingerprint: makeFingerprint(payload.tag, payload.classes),
        tokenEstimate: estimateTokens(payload.outerHtml),
      };
    });
  }, []);

  const handleAiCleared = useCallback(() => {
    track("ai:cleared");
    setAiInfo(null);
  }, []);

  // 2026-05-17 — Tab / Shift+Tab handler from AiScopeChip. Re-resolves
  // the current selection at the new scope by posting ai:set-scope to
  // the iframe (the iframe walks up via aiFindSectionScope when scope
  // === "section", then re-emits ai:selected with the new outerHtml +
  // bbox + scope). No-op when no selection or path is missing.
  const handleAiSetScope = useCallback(
    (scope: "element" | "section") => {
      if (!aiInfo || !aiInfo.path) return;
      previewHandleRef.current?.postVibe({
        type: "ai:set-scope",
        path: aiInfo.path,
        scope,
      });
    },
    [aiInfo],
  );

  // Escape from AiScopeChip. Clears host state immediately AND posts
  // ai:clear to iframe so the data-ai-selected outline + iframe-side
  // selection state both drop.
  const handleAiClearFromChip = useCallback(() => {
    setAiInfo(null);
    previewHandleRef.current?.postVibe({ type: "ai:clear" });
    if (aiAborterRef.current) {
      aiAborterRef.current.abort();
      aiAborterRef.current = null;
    }
    setAiBusy(false);
    setAiBusyModel(null);
  }, []);

  // Phase 5 — JSX-expression pre-detection. Parses the source once per
  // (code, oid) change, walks the JSX subtree under the OID, returns
  // true when any expression child exists. Drives the upfront "Saves
  // will bake in {expression}" warning in AiScopeChip. Memo prevents
  // re-parsing on every Workspace render — only re-runs when the user
  // selects a new element OR types into Monaco (changing code).
  const aiHasJsxExpressions = useMemo(() => {
    if (kind !== "jsx") return false;
    if (!aiInfo?.oid) return false;
    return jsxElementHasExpressions(code, aiInfo.oid);
  }, [code, kind, aiInfo?.oid]);

  // Phase 6 — AI swap modal state. Opened from "Swap with AI" button
  // on the vibe panel. The modal renders InlineComponentBrowser in
  // reference-pick mode; pick fires handleAiSwapPick which routes
  // through /api/ai-edit with mode:"swap" + referenceHtml.
  const [aiSwapOpen, setAiSwapOpen] = useState(false);
  const [aiSwapCategory, setAiSwapCategory] = useState<string | null>(null);
  // Frozen vibeInfo snapshot at swap-open time. Prevents racing: if the
  // user clicks a different element while the modal is open, the swap
  // still targets the originally-selected element.
  const aiSwapTargetRef = useRef<VibeElementInfo | null>(null);

  const handleAiSwapOpen = useCallback(() => {
    const info = vibeInfo;
    if (!info) return;
    console.log("[dropin:swap] open", {
      tag: info.tag,
      kind: info.kind,
      oid: info.oid,
      classesPreview: (info.classes ?? "").slice(0, 80),
      outerHtmlLen: info.outerHtml?.length ?? 0,
    });
    track("ai:swap-open", { tag: info.tag, kind: info.kind });
    // inferSwapCategory takes a ReadonlyArray<string>; vibe carries
    // classes as a space-separated string. Split + filter empties.
    const classList = (info.classes ?? "")
      .split(/\s+/)
      .filter((c) => c.length > 0);
    const hint = inferSwapCategory(info.tag, classList);
    // inferSwapCategory may return null when the kind is unknown or
    // routes to media/icons (which have their own dedicated swap
    // flows). For AI swap we fall back to null = "all components".
    const category =
      hint && hint.panel === "components" ? hint.category ?? null : null;
    aiSwapTargetRef.current = info;
    setAiSwapCategory(category);
    setAiSwapOpen(true);
  }, [vibeInfo]);

  const handleAiSwapClose = useCallback(() => {
    setAiSwapOpen(false);
    setAiSwapCategory(null);
    aiSwapTargetRef.current = null;
  }, []);

  const handleAiSwapPick = useCallback(
    async (component: ComponentMeta, rawHtml: string) => {
      const target = aiSwapTargetRef.current;
      console.log("[dropin:swap] picked", {
        slug: component.slug,
        title: component.title,
        category: component.category,
        referenceHtmlLen: rawHtml.length,
        target: target
          ? {
              tag: target.tag,
              oid: target.oid,
              outerHtmlLen: target.outerHtml?.length ?? 0,
            }
          : null,
      });
      // Phase 7 bug hunt — ignore picks while a swap is already in
       // flight. The modal's busy overlay should be blocking clicks
       // (absolute inset-0 z-10), but defensive guard for the case where
       // pick fires before overlay paints OR for keyboard-driven picks
       // that bypass the overlay's pointer-events.
      if (aiBusy) {
        console.warn("[dropin:swap] pick-while-busy — ignored", {
          slug: component.slug,
        });
        return;
      }
      if (!target) {
        showWarn("Swap target lost — re-open the swap dialog");
        handleAiSwapClose();
        return;
      }
      if (!rawHtml || rawHtml.length === 0) {
        showWarn("Reference component has no HTML");
        return;
      }
      // Phase 6 hotfix #2 — reject useless references. The library has
      // some entries with ~30 char HTML (e.g. tiny icon-only buttons
      // with no class chrome). Qwen-coder looks at 30 chars of HTML and
      // concludes there's no design pattern to adopt → returns target
      // unchanged. Surface this BEFORE the API call so the user can
      // pick a different reference.
      if (rawHtml.length < 80) {
        console.warn("[dropin:swap] reference-too-small", {
          slug: component.slug,
          length: rawHtml.length,
        });
        showWarn(
          `${component.title} is too small to be a useful design reference. Pick a more elaborate one.`,
        );
        return;
      }
      // 2026-05-18 hotfix — KEEP MODAL OPEN during the AI call so the
      // user has a clear visual indicator that something's happening.
      // The modal's busy overlay (rendered when aiBusy is true)
      // explains what's running. We close only AFTER the swap lands
      // (success or failure).

      // Abort any in-flight AI request (defensive).
      if (aiAborterRef.current) aiAborterRef.current.abort();
      const aborter = new AbortController();
      aiAborterRef.current = aborter;

      // Build a synthetic AiSelectionInfo from the vibe selection so
      // buildApiRequestBody works the same way as the AI Edit flow.
      // path/htmlPath/oid/outerHtml come from vibeInfo; parentContext
      // is null for swap (the prompt's framing already conveys what
      // to do without surrounding context).
      const swapInfo: AiSelectionInfo = {
        path: target.path,
        htmlPath: target.htmlPath ?? null,
        oid: target.oid ?? null,
        tag: target.tag,
        classes: target.classes ?? "",
        scope: "element",
        outerHtml: target.outerHtml ?? "",
        parentContext: null,
        // VibeElementInfo's bbox shape is layout-style
        // (width/height/display/margin*); AiSelectionInfo's bbox is
        // iframe-viewport coords (x/y/width/height). Set to null for
        // swap — the AI prompt doesn't use bbox + we don't need it
        // for the apply path.
        bbox: null,
        fingerprint: target.tag,
        tokenEstimate: estimateTokens(target.outerHtml ?? ""),
      };
      const body = buildApiRequestBody(swapInfo, "", {
        mode: "swap",
        referenceHtml: rawHtml,
      });

      setAiBusy(true);
      setAiBusyModel(
        process.env.NEXT_PUBLIC_TENSORIX_DEFAULT_MODEL ??
          "qwen/qwen3-coder-30b-a3b-instruct",
      );
      track("ai:swap-submit", {
        tag: target.tag,
        kind: target.kind,
        referenceSlug: component.slug,
        referenceTitle: component.title,
      });
      console.log("[dropin:swap] api-fire", {
        slug: component.slug,
        targetHtmlLen: body.targetHtml.length,
        referenceHtmlLen: body.referenceHtml?.length ?? 0,
      });
      const apiStart = Date.now();

      let result;
      try {
        result = await callAiEdit(body, aborter.signal);
      } finally {
        if (aiAborterRef.current === aborter) aiAborterRef.current = null;
      }
      console.log("[dropin:swap] api-return", {
        ok: result.ok,
        latencyMs: Date.now() - apiStart,
        error: result.ok ? null : result.error,
        htmlLen: result.ok ? result.html.length : 0,
        model: result.ok ? result.model : null,
      });

      if (aborter.signal.aborted) {
        setAiBusy(false);
        setAiBusyModel(null);
        setAiSwapOpen(false);
        setAiSwapCategory(null);
        console.log("[dropin:swap] aborted-after-return");
        return;
      }
      if (!result.ok) {
        setAiBusy(false);
        setAiBusyModel(null);
        setAiSwapOpen(false);
        setAiSwapCategory(null);
        if (result.error === "aborted") return;
        console.error("[dropin:swap] fail", {
          error: result.error,
          status: result.status,
        });
        showWarn(`AI swap failed: ${result.error}`);
        track("ai:swap-fail", { error: result.error });
        return;
      }

      // Same apply + persist path as handleAiSubmit. Snapshot original
      // for undo, post iframe swap, patch source, toast with undo.
      const originalHtml = target.outerHtml ?? "";
      aiLastEditRef.current = { path: target.path, originalHtml };
      console.log("[dropin:swap] iframe-post", {
        path: target.path,
        newOuterHtmlLen: result.html.length,
      });
      previewHandleRef.current?.postVibe({
        type: "ai:apply-outer",
        path: target.path,
        newOuterHtml: result.html,
      });
      // Close the swap modal NOW that the iframe has the new HTML.
      // The toast (with undo) takes over as the affordance.
      setAiSwapOpen(false);
      setAiSwapCategory(null);

      let persisted = false;
      let persistReason: string | null = null;
      // 2026-05-20 — Phase 9 cascade detach for swap. Same logic as
      // handleAiSubmit: if the target is one of N cascade instances,
      // detach FIRST, then patch the result onto the detached copy's
      // new OID so other cascade siblings stay untouched.
      let swapWorkingCode = code;
      let swapWorkingOid: string | null = target.oid ?? null;
      const swapIsCascade =
        kind !== "html" &&
        target.oid &&
        typeof target.instanceCount === "number" &&
        target.instanceCount > 1 &&
        typeof target.instanceIndex === "number" &&
        target.instanceIndex >= 0;
      if (swapIsCascade && target.oid) {
        const detach = applyDetachFromMap(code, {
          oid: target.oid,
          index: target.instanceIndex!,
        });
        if (detach.unchanged) {
          console.warn("[dropin:swap] cascade-detach bailed", {
            reason: detach.reason,
            oid: target.oid,
            index: target.instanceIndex,
          });
          showWarn(
            `Swap will apply to all ${target.instanceCount} copies — couldn't isolate this one: ${detach.reason}`,
          );
        } else {
          console.log("[dropin:swap] cascade-detach applied", {
            oid: target.oid,
            index: target.instanceIndex,
            newOid: detach.newOid,
          });
          swapWorkingCode = detach.source;
          swapWorkingOid = detach.newOid ?? null;
        }
      }

      if (kind === "html") {
        if (target.htmlPath) {
          const patch = patchHtmlOuter(swapWorkingCode, target.htmlPath, result.html);
          if (patch.changed) {
            setCode(patch.source);
            persisted = true;
          } else {
            persistReason =
              ("reason" in patch && patch.reason) || "html patch unchanged";
          }
        } else {
          persistReason = "html element has no path";
        }
      } else {
        if (swapWorkingOid) {
          let jsx: string | null = null;
          try {
            jsx = htmlToJsx(result.html);
          } catch (e) {
            persistReason = `html→jsx failed: ${String(e)}`;
          }
          if (jsx) {
            const patch = patchJsxOuterByOid(swapWorkingCode, swapWorkingOid, jsx);
            if (patch.changed) {
              setCode(patch.source);
              persisted = true;
            } else {
              persistReason = patch.reason || "jsx patch unchanged";
            }
          }
        } else {
          persistReason = "jsx element has no OID — can't persist";
        }
      }

      console.log("[dropin:swap] persist", {
        kind,
        persisted,
        reason: persistReason,
        codeLenAfter: persisted ? code.length : null,
      });
      // 2026-05-20 — Diff tracer. Print before/after for swaps too.
      try {
        const before = target.outerHtml ?? "";
        const after = result.html;
        const headLen = 240;
        console.log("[dropin:swap] BEFORE", {
          len: before.length,
          head: before.slice(0, headLen),
          tail: before.slice(-headLen),
        });
        console.log("[dropin:swap] AFTER", {
          len: after.length,
          head: after.slice(0, headLen),
          tail: after.slice(-headLen),
        });
        const beforeRoot = (before.match(/^<(\w+)/) ?? [])[1] ?? "?";
        const afterRoot = (after.match(/^<(\w+)/) ?? [])[1] ?? "?";
        const beforeClasses = before.match(/class="([^"]*)"/)?.[1] ?? "";
        const afterClasses = after.match(/class="([^"]*)"/)?.[1] ?? "";
        console.log("[dropin:swap] DIFF", {
          lenDelta: after.length - before.length,
          rootTagChanged: beforeRoot !== afterRoot,
          rootTag: `<${beforeRoot}> -> <${afterRoot}>`,
          beforeClassesPreview: beforeClasses.slice(0, 120),
          afterClassesPreview: afterClasses.slice(0, 120),
          referenceUsed: {
            slug: component.slug,
            len: rawHtml.length,
          },
        });
      } catch (e) {
        console.warn("[dropin:swap] diff trace failed", e);
      }

      const persistTag = persisted ? "" : " · session only";
      const notes = result.notes ? ` · ${result.notes}` : "";
      setRollToast({
        icon: "✨",
        text: `Restyled to match ${component.title}${persistTag}${notes}`,
        action: {
          label: "Undo",
          onAction: () => {
            if (persisted) {
              if (kind === "html" && target.htmlPath) {
                const p = patchHtmlOuter(code, target.htmlPath, originalHtml);
                if (p.changed) setCode(p.source);
              } else if (kind !== "html" && target.oid) {
                try {
                  const j = htmlToJsx(originalHtml);
                  const p = patchJsxOuterByOid(code, target.oid, j);
                  if (p.changed) setCode(p.source);
                } catch {
                  /* fall through */
                }
              }
            }
            previewHandleRef.current?.postVibe({
              type: "ai:apply-outer",
              path: target.path,
              newOuterHtml: originalHtml,
            });
            aiLastEditRef.current = null;
            track("ai:swap-undo", { persisted });
          },
        },
      });
      if (persistReason) {
        console.warn("[dropin:Workspace] ai-swap persist skipped", {
          reason: persistReason,
          kind,
          oid: target.oid,
        });
      }
      track("ai:swap-success", {
        persisted,
        kind,
        referenceSlug: component.slug,
        model: result.model,
      });
    },
    [aiBusy, vibeInfo, code, kind, setCode, showInfo, showWarn, handleAiSwapClose],
  );

  // Phase 2 — Submit handler. Fires the API request, swaps outerHTML
  // in the iframe on success, surfaces toasts on error. Plan §3.4.
  // The iframe re-emits ai:applied after the swap → handleAiApplied
  // updates state. We capture aiInfo at submit time (closed over the
  // current selection) so a fast tool change can still process the
  // pending response without panicking.
  const handleAiSubmit = useCallback(
    async (userPrompt: string) => {
      const info = aiInfo;
      if (!info) return;
      if (aiBusy) return;
      // Abort any prior in-flight request (defensive; UI gates submit
      // when busy, but a stale aborter could exist from a tool change
      // mid-request).
      if (aiAborterRef.current) {
        aiAborterRef.current.abort();
      }
      const aborter = new AbortController();
      aiAborterRef.current = aborter;

      const body = buildApiRequestBody(info, userPrompt);
      // Optimistic UI: show shimmer with the default model name. If the
      // server falls back to a different model we update on the response.
      // Bug #4 fix — scope-aware shimmer label. Server routes section to
      // minimax-m2 (reasoning helps composition); element to qwen-coder
      // (fast surgical edits). Shimmer should reflect what's actually
      // being called.
      const optimisticModel =
        info.scope === "section"
          ? process.env.NEXT_PUBLIC_TENSORIX_SECTION_MODEL ?? "minimax/minimax-m2"
          : process.env.NEXT_PUBLIC_TENSORIX_DEFAULT_MODEL ??
            "qwen/qwen3-coder-30b-a3b-instruct";
      setAiBusy(true);
      setAiBusyModel(optimisticModel);
      track("ai:submit", { scope: info.scope, promptLen: userPrompt.length });

      let result;
      try {
        result = await callAiEdit(body, aborter.signal);
      } finally {
        if (aiAborterRef.current === aborter) {
          aiAborterRef.current = null;
        }
      }

      // The user aborted (Escape, tool change) — drop silently.
      if (aborter.signal.aborted) {
        setAiBusy(false);
        setAiBusyModel(null);
        return;
      }

      if (!result.ok) {
        setAiBusy(false);
        setAiBusyModel(null);
        if (result.error === "aborted") return;
        showWarn(`AI Edit failed: ${result.error}`);
        track("ai:fail", { error: result.error, status: result.status });
        return;
      }

      // Snapshot the pre-swap outerHTML for the undo toast.
      aiLastEditRef.current = {
        path: info.path,
        originalHtml: info.outerHtml,
      };
      track("ai:success", {
        model: result.model,
        promptTokens: result.usage?.prompt ?? 0,
        completionTokens: result.usage?.completion ?? 0,
      });

      // Push the swap to the iframe FIRST for instant visual feedback —
      // ai:apply-outer mutates DOM in ~5ms; the rebuild from setCode that
      // follows is closer to 50-100ms and would flicker without this
      // optimistic step. Iframe will re-emit ai:applied → handleAiApplied
      // flips aiBusy off.
      previewHandleRef.current?.postVibe({
        type: "ai:apply-outer",
        path: info.path,
        newOuterHtml: result.html,
      });

      // Phase 4 — Source persistence. Route through setCode so the edit
      // survives iframe rebuild, Monaco edits, undo via Ctrl+Z, page
      // reload. HTML mode uses path-based patch. JSX mode uses OID-based
      // patch + html-to-jsx conversion. Either failure mode keeps the
      // iframe mutation alive (session-only) + surfaces a warn so the
      // user knows it's not persisted.
      let persisted = false;
      let persistReason: string | null = null;
      // 2026-05-20 — Phase 9 cascade detach. If the clicked element is
      // part of a .map()-rendered cascade (instanceCount > 1 + index),
      // detach THAT instance first so the edit only changes the clicked
      // copy. Builds a new source via applyDetachFromMap, then patches
      // the AI result onto the detached element's NEW OID.
      let workingCode = code;
      let workingOid: string | null = info.oid;
      const isCascade =
        kind !== "html" &&
        info.oid &&
        typeof info.instanceCount === "number" &&
        info.instanceCount > 1 &&
        typeof info.instanceIndex === "number" &&
        info.instanceIndex >= 0;
      if (isCascade && info.oid) {
        const detach = applyDetachFromMap(code, {
          oid: info.oid,
          index: info.instanceIndex!,
        });
        if (detach.unchanged) {
          console.warn("[dropin:edit] cascade-detach bailed", {
            reason: detach.reason,
            oid: info.oid,
            index: info.instanceIndex,
          });
          showWarn(
            `Edit will apply to all ${info.instanceCount} copies — couldn't isolate this one: ${detach.reason}`,
          );
          // Continue with the original code — edit will cascade.
        } else {
          console.log("[dropin:edit] cascade-detach applied", {
            oid: info.oid,
            index: info.instanceIndex,
            newOid: detach.newOid,
          });
          workingCode = detach.source;
          workingOid = detach.newOid ?? null;
        }
      }

      if (kind === "html") {
        if (info.htmlPath) {
          const patch = patchHtmlOuter(workingCode, info.htmlPath, result.html);
          if (patch.changed) {
            setCode(patch.source);
            persisted = true;
          } else {
            persistReason =
              ("reason" in patch && patch.reason) || "html patch unchanged";
          }
        } else {
          persistReason = "html element has no path";
        }
      } else {
        // JSX mode. Convert rendered HTML to JSX first (className, void
        // self-closing, camelCase attrs). Then patch by OID.
        if (workingOid) {
          let jsx: string | null = null;
          try {
            jsx = htmlToJsx(result.html);
          } catch (e) {
            persistReason = `html→jsx failed: ${String(e)}`;
          }
          if (jsx) {
            const patch = patchJsxOuterByOid(workingCode, workingOid, jsx);
            if (patch.changed) {
              setCode(patch.source);
              persisted = true;
            } else {
              persistReason = patch.reason || "jsx patch unchanged";
            }
          }
        } else {
          persistReason = "jsx element has no OID — can't persist";
        }
      }

      // 2026-05-20 — Diff tracer. Print the actual before/after HTML
      // so you can SEE what the AI changed, even when the toast text
      // is opaque or the iframe rebuild flicker hides the change.
      // Logs head + tail of each side + char-length delta. Look at
      // this in the browser console when "edit applied but nothing
      // visibly happened."
      try {
        const before = info.outerHtml;
        const after = result.html;
        const headLen = 240;
        console.log("[dropin:edit] BEFORE", {
          len: before.length,
          head: before.slice(0, headLen),
          tail: before.slice(-headLen),
        });
        console.log("[dropin:edit] AFTER", {
          len: after.length,
          head: after.slice(0, headLen),
          tail: after.slice(-headLen),
        });
        const beforeClasses = before.match(/class="([^"]*)"/)?.[1] ?? "";
        const afterClasses = after.match(/class="([^"]*)"/)?.[1] ?? "";
        const beforeSet = new Set(
          beforeClasses.split(/\s+/).filter(Boolean),
        );
        const afterSet = new Set(afterClasses.split(/\s+/).filter(Boolean));
        const added = [...afterSet].filter((c) => !beforeSet.has(c));
        const removed = [...beforeSet].filter((c) => !afterSet.has(c));
        console.log("[dropin:edit] DIFF", {
          lenDelta: after.length - before.length,
          classesAdded: added,
          classesRemoved: removed,
          rootTagChanged:
            (before.match(/^<(\w+)/) ?? [])[1] !==
            (after.match(/^<(\w+)/) ?? [])[1],
        });
      } catch (e) {
        console.warn("[dropin:edit] diff trace failed", e);
      }

      // Toast surfaces immediately on success — the iframe swap is
      // synchronous + we'd rather give feedback now than wait the
      // round-trip. handleAiApplied will reconcile state.
      const notes = result.notes ? ` · ${result.notes}` : "";
      const persistTag = persisted ? "" : " · session only";
      const snapshot = aiLastEditRef.current;
      const undoEntry = {
        icon: "✨",
        text: `Edit applied${persistTag}${notes}`,
        action: snapshot
          ? {
              label: "Undo",
              onAction: () => {
                // Phase 4 — Undo routes through source patch when the
                // edit was persisted, so Ctrl+Z + history-redo lines up.
                // For session-only edits, falls back to direct iframe
                // mutation.
                if (persisted) {
                  if (kind === "html" && snapshot && info.htmlPath) {
                    const p = patchHtmlOuter(
                      code,
                      info.htmlPath,
                      snapshot.originalHtml,
                    );
                    if (p.changed) setCode(p.source);
                  } else if (kind !== "html" && snapshot && info.oid) {
                    try {
                      const j = htmlToJsx(snapshot.originalHtml);
                      const p = patchJsxOuterByOid(code, info.oid, j);
                      if (p.changed) setCode(p.source);
                    } catch {
                      // Ignore — fall through to iframe-only undo below
                    }
                  }
                }
                // Iframe-DOM revert in either path: when persisted, the
                // setCode above already triggered a rebuild that will
                // overwrite the iframe DOM anyway, so this is a no-op for
                // those cases. When session-only it's the actual undo.
                previewHandleRef.current?.postVibe({
                  type: "ai:apply-outer",
                  path: snapshot.path,
                  newOuterHtml: snapshot.originalHtml,
                });
                aiLastEditRef.current = null;
                track("ai:undo", { persisted });
              },
            }
          : undefined,
      };
      if (!persisted && persistReason) {
        console.warn("[dropin:Workspace] ai-edit persist skipped", {
          reason: persistReason,
          kind,
          path: info.path,
          oid: info.oid,
        });
      }
      track("ai:persisted", { persisted, kind, reason: persistReason });
      setRollToast(undoEntry);
      setTimeout(
        () => setRollToast((s) => (s === undoEntry ? null : s)),
        // Longer than the default 2.6s — undo is the whole point of the
        // toast and the user needs a beat to register the change before
        // deciding to revert.
        6000,
      );
    },
    [aiInfo, aiBusy, code, kind, setCode, showWarn],
  );

  // Phase 2 — Iframe confirmed the swap. Re-emitted ai:selected has
  // already updated aiInfo via handleAiSelected; we just flip the busy
  // flag off.
  const handleAiApplied = useCallback(() => {
    setAiBusy(false);
    setAiBusyModel(null);
  }, []);

  const handleAiApplyFailed = useCallback(
    (data: { path: string; reason: string }) => {
      setAiBusy(false);
      setAiBusyModel(null);
      // Bug #2 fix — the optimistic toast may have already populated
      // aiLastEditRef expecting the swap to land. If the iframe rejected
      // the swap, undo would target an un-changed element. Clear the
      // snapshot AND the undo-bearing toast so the user doesn't see a
      // false "Edit applied · Undo" button.
      aiLastEditRef.current = null;
      setRollToast(null);
      showWarn(`Apply failed: ${data.reason}`);
      track("ai:apply-failed", data);
    },
    [showWarn],
  );

  // Escape inside the prompt bar — clear selection + abort.
  const handleAiPromptEscape = useCallback(() => {
    handleAiClearFromChip();
  }, [handleAiClearFromChip]);

  // Direct-mutation handlers. Each posts to the iframe via
  // previewHandleRef.current.postVibe; the runtime mutates the live
  // DOM and re-emits vibe:selected so handleVibeSelected updates the
  // panel state with the new value. No iframe rebuild on edit.
  const handleVibeContent = useCallback(
    (text: string) => {
      const info = vibeInfo;
      if (!info) return;
      previewHandleRef.current?.postVibe({
        type: "vibe:update-content",
        path: info.path,
        text,
      });
    },
    [vibeInfo],
  );

  const handleVibeStyle = useCallback(
    (styles: Record<string, string>) => {
      const info = vibeInfo;
      if (!info) return;
      previewHandleRef.current?.postVibe({
        type: "vibe:update-style",
        path: info.path,
        styles,
      });
    },
    [vibeInfo],
  );

  const handleVibeImage = useCallback(
    (next: { src?: string; alt?: string }) => {
      const info = vibeInfo;
      if (!info) return;
      previewHandleRef.current?.postVibe({
        type: "vibe:update-image",
        path: info.path,
        ...next,
      });
    },
    [vibeInfo],
  );

  const handleVibeLink = useCallback(
    (href: string) => {
      const info = vibeInfo;
      if (!info) return;
      previewHandleRef.current?.postVibe({
        type: "vibe:update-link",
        path: info.path,
        href,
      });
    },
    [vibeInfo],
  );

  // Class-list mutation. Drives the typography sliders in vibe mode.
  // Posts the full new class string to the iframe (instant DOM
  // update, runtime re-emits vibe:selected with new info.classes);
  // source reconciles via the existing class-only patcher on idle.
  const handleVibeClasses = useCallback(
    (newClasses: string) => {
      const info = vibeInfo;
      if (!info) return;
      previewHandleRef.current?.postVibe({
        type: "vibe:update-classes",
        path: info.path,
        classes: newClasses,
      });
    },
    [vibeInfo],
  );

  const handleVibeClose = useCallback(() => {
    previewHandleRef.current?.postVibe({ type: "vibe:clear" });
    setVibeInfo(null);
    lastVibeCommitRef.current = null;
    setVibeIconSwapOpen(false);
    setVibeImageSwapOpen(false);
  }, []);

  // Icon-swap modal lifecycle. The IconControls "Browse icon library"
  // button calls this; the modal closes on pick / cancel / tool exit /
  // selection clear.
  const handleVibeIconSwapOpen = useCallback(() => {
    setVibeIconSwapOpen(true);
  }, []);

  const handleVibeIconSwapClose = useCallback(() => {
    setVibeIconSwapOpen(false);
  }, []);

  // Image-swap modal lifecycle. Same contract as icon swap — opened
  // by ImageControls' Browse button; closed on pick / cancel / tool
  // exit / selection clear.
  const handleVibeImageSwapOpen = useCallback(() => {
    setVibeImageSwapOpen(true);
  }, []);

  const handleVibeImageSwapClose = useCallback(() => {
    setVibeImageSwapOpen(false);
  }, []);

  // Component-swap modal lifecycle. Opened by the Browse-components
  // button in TextControls / LinkControls / CardControls + the plain-
  // container hint area. Same contract as icon / image — modal closes
  // on pick / cancel / tool exit / selection clear.
  const handleVibeComponentSwapOpen = useCallback(() => {
    track("vibe:component-swap-toggle", {
      vibeInfoPresent: !!vibeInfo,
      tag: vibeInfo?.tag,
      oid: vibeInfo?.oid,
      classes: vibeInfo?.classes,
    });
    setVibeComponentSwapOpen((prev) => !prev);
  }, [vibeInfo]);

  const handleVibeComponentSwapClose = useCallback(() => {
    setVibeComponentSwapOpen(false);
  }, []);

  // Computed swapContext for the Components LibraryModal. Memoized off
  // vibeInfo so we don't recreate it every render (LibraryModal +
  // ComponentsPanel ride on the targetOid as the override key — a fresh
  // object identity each render with same .targetOid is fine, but
  // keeping it stable keeps logs clean and makes the heuristic-derived
  // category visible in one place.
  const vibeComponentSwapContext = useMemo(() => {
    if (!vibeInfo) return null;
    const classList = vibeInfo.classes
      ? vibeInfo.classes.split(/\s+/).filter(Boolean)
      : [];
    // Layer 1: tag + class-token heuristic. Hits when the element is
    // a semantic <button>/<nav>/<footer>, OR has a literal `btn` /
    // `card` / `modal` / etc. class token. Modern Tailwind designs
    // typically use utility chrome (bg-white rounded-lg shadow-md)
    // with no semantic token, so this layer often misses.
    const hint = inferSwapCategory(vibeInfo.tag, classList);
    let suggestedCategory: string | null =
      hint?.panel === "components" ? hint.category ?? null : null;
    let categorySource = suggestedCategory ? "hint" : "none";

    // Layer 2: kind-based fallback. The iframe runtime already
    // classified the element into kind = heading/text/button/link/
    // icon/image/container. Use it to back-fill when the token
    // heuristic missed.
    if (!suggestedCategory) {
      if (vibeInfo.kind === "button") {
        suggestedCategory = "buttons";
        categorySource = "kind:button";
      } else if (vibeInfo.kind === "container" && isCardLike(vibeInfo)) {
        // Card-like containers without an explicit `card` class token
        // (the common "Tailwind utility card" pattern: bg-white +
        // rounded + shadow). isCardLike() is the same check the
        // properties panel uses to decide CardControls rendering, so
        // anything with the Card panel ALSO filters to cards here.
        suggestedCategory = "cards";
        categorySource = "kind:container+cardLike";
      }
    }

    // 2026-05-17 Layer 3: visual-role disambiguator for the most
    // common tag-vs-role mismatch — an <a> styled with Tailwind utility
    // chrome that visually IS a button. Layer 1 misses (no `btn` token),
    // Layer 2 misses (kind="link" not "button"). Without this, Browse-
    // components opens to the full mixed library on a CTA link and the
    // vibecoder can't actually swap it for another button. Predicate
    // lives in detect.ts alongside isCardLike.
    if (!suggestedCategory && isLinkStyledAsButton(vibeInfo)) {
      suggestedCategory = "buttons";
      categorySource = "visual:button-link";
    }

    const ctx = {
      targetOid: vibeInfo.oid ?? "",
      targetTag: vibeInfo.tag,
      suggestedPanel: "components" as const,
      suggestedCategory,
      slotEnvelope: null,
    };
    track("vibe:component-swap-context", {
      tag: vibeInfo.tag,
      kind: vibeInfo.kind,
      classList,
      hint,
      suggestedCategory,
      categorySource,
      targetOid: ctx.targetOid,
    });
    return ctx;
  }, [vibeInfo]);

  // BG-image modal lifecycle. Opened from CardControls' "Pick
  // background image" button on card / section elements. Picks
  // route through handleVibeBgImagePick (URL → styleDelta), NOT
  // the outerHTML-swap path.
  const handleVibeBgImageOpen = useCallback(() => {
    setVibeBgImageOpen(true);
  }, []);

  const handleVibeBgImageClose = useCallback(() => {
    setVibeBgImageOpen(false);
  }, []);

  // Extract the `src` URL from an `<img …>` asset block emitted by the
  // media panels (Unsplash / Pexels / Pixabay). All three builders
  // emit the same shape: `<img src="…" alt="…" …loading=…/>`. We only
  // need the URL — the alt / width / loading fields aren't relevant
  // for a CSS background.
  const extractImageSrc = useCallback((assetText: string): string | null => {
    const m = assetText.match(/\bsrc\s*=\s*("([^"]+)"|'([^']+)')/);
    if (!m) return null;
    return m[2] || m[3] || null;
  }, []);

  // 2026-05-15 — Apply a resolved image URL as a CSS background on the
  // currently-selected vibe element. Shared by both the pick handler
  // (media library → src extraction → here) and the new shuffle handler
  // (Pixabay → url → here). Bails silently when no vibe selection so
  // the caller doesn't have to re-check.
  const applyVibeBgImageUrl = useCallback(
    (url: string) => {
      const info = vibeInfo;
      if (!info) return;
      previewHandleRef.current?.postVibe({
        type: "vibe:update-style",
        path: info.path,
        styles: {
          backgroundImage: `url("${url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        },
      });
    },
    [vibeInfo],
  );

  // 2026-05-15 — BG-image shuffle. Mirrors the Image-vibe-panel
  // Shuffle button: derive a query from the element's text content
  // (since bg-images don't have an alt), fetch a fresh Pixabay image,
  // apply via applyVibeBgImageUrl.
  //
  // 2026-05-16 — Query falls through a chain instead of a single
  // attempt, after user hit "no photos found for 'witnessed // 004a
  // reading-room of borrowed'" on a poetic card title. Pixabay
  // doesn't have results for hyper-specific phrases. Chain:
  //   1. First 3 words of the card's text content
  //   2. First word only (often the most conceptual)
  //   3. "background"
  //   4. "abstract texture"
  // Stop at the first query that returns hits. Toast only on final
  // failure (all 4 returned 0 results — would be remarkable).
  const handleVibeBgImageShuffle = useCallback(async () => {
    const info = vibeInfo;
    if (!info) return;
    const trimmed = (info.text || "").trim();
    const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
    // Keep only alphabetic tokens for the query — strip leading
    // section labels like "004A", "//", "PLATE", numerals, etc.
    const alphaWords = words.filter((w) => /[a-zA-Z]/.test(w));
    const queries: string[] = [];
    if (alphaWords.length >= 3) {
      queries.push(alphaWords.slice(0, 3).join(" "));
    }
    if (alphaWords.length >= 1) {
      queries.push(alphaWords[0]!);
    }
    queries.push("background");
    queries.push("abstract texture");
    // Dedup (e.g. text is just one word "Witnessed" → "Witnessed" gets
    // pushed once into queries, no duplicate retry).
    const uniqueQueries = Array.from(new Set(queries));
    console.log("[dropin:BGShuffle] query chain", {
      trimmedText: trimmed,
      alphaWords,
      queries: uniqueQueries,
    });
    for (const query of uniqueQueries) {
      try {
        const params = new URLSearchParams({
          q: query,
          per_page: "20",
          page: String(1 + Math.floor(Math.random() * 5)),
          orientation: "horizontal",
        });
        const res = await fetch(`/api/assets/pixabay?${params.toString()}`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const detail =
            body && typeof body.detail === "string"
              ? body.detail
              : `${res.status}`;
          console.log("[dropin:BGShuffle] non-OK response, aborting chain", {
            query,
            detail,
          });
          showWarn(`Background shuffle: ${detail}`);
          return;
        }
        // 2026-05-16 — Proxy at `app/api/assets/pixabay/route.ts` slims
        // upstream Pixabay fields: `webformatURL → webformat`,
        // `largeImageURL → large`. Earlier code used the upstream names
        // and silently never matched, then fell through to "no usable
        // URL." That's the bug user reported as "background shuffle
        // does nothing." Both bg + per-image shuffle had the same miss.
        const body = (await res.json()) as {
          hits?: Array<{ webformat?: string; large?: string }>;
        };
        const hits = body?.hits ?? [];
        console.log("[dropin:BGShuffle] hits", {
          query,
          hitCount: hits.length,
        });
        if (hits.length === 0) continue; // try next query in chain
        const pick = hits[Math.floor(Math.random() * hits.length)]!;
        const nextSrc = pick.webformat || pick.large;
        if (!nextSrc) continue;
        console.log("[dropin:BGShuffle] applying", { query, nextSrc });
        applyVibeBgImageUrl(nextSrc);
        // 2026-05-16 — positive-path toast paired with the per-image
        // Shuffle success toast in ImageControls. Bg-image change is
        // visible but the cover-positioned background can be subtle
        // on the first photo load — toast confirms the intent landed.
        showInfo("Background updated · Undo to revert");
        return;
      } catch (e) {
        console.log("[dropin:BGShuffle] caught error", {
          query,
          message: e instanceof Error ? e.message : String(e),
        });
        showWarn(
          e instanceof Error
            ? `Background shuffle: ${e.message}`
            : "Background shuffle: network error",
        );
        return;
      }
    }
    // All queries returned 0 hits — extraordinary, but report honestly.
    showWarn(
      "Background shuffle: nothing matched. Try different alt text on the card.",
    );
  }, [vibeInfo, applyVibeBgImageUrl, showWarn]);

  // BG-image pick. The Media panel emits a full `<img>` block; we pull
  // its src, post vibe:update-style for instant iframe visual feedback,
  // and let the idle-commit drift detector write the styleDelta to
  // source (the runtime's re-emit after vibe:update-style includes the
  // new `bgImage` field — drift fires → 600ms idle → styleDelta lands
  // in className as a Tailwind arbitrary background-image + cover/center/no-repeat).
  const handleVibeBgImagePick = useCallback(
    (_targetOid: string, assetText: string) => {
      const info = vibeInfo;
      if (!info) {
        setVibeBgImageOpen(false);
        return;
      }
      const url = extractImageSrc(assetText);
      if (!url) {
        showWarn("Couldn't read the picked image URL.");
        setVibeBgImageOpen(false);
        return;
      }
      previewHandleRef.current?.postVibe({
        type: "vibe:update-style",
        path: info.path,
        styles: {
          backgroundImage: `url("${url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        },
      });
      setVibeBgImageOpen(false);
    },
    [vibeInfo, extractImageSrc, showWarn],
  );

  // BG-image remove. Same shape as pick but clears the props back to
  // their unset state. The iframe runtime's idle re-emit then reports
  // bgImage=null → drift → styleDelta.bgImageUrl=null → merger strips
  // the arbitrary background-image + cover/center classes back out of the className.
  const handleVibeBgImageRemove = useCallback(() => {
    const info = vibeInfo;
    if (!info) return;
    previewHandleRef.current?.postVibe({
      type: "vibe:update-style",
      path: info.path,
      styles: {
        backgroundImage: "",
        backgroundSize: "",
        backgroundPosition: "",
        backgroundRepeat: "",
      },
    });
  }, [vibeInfo]);

  // Shared pick callback used by BOTH the icon and image swap modals.
  // The library's icon / media panels emit a self-contained <svg> /
  // <img> string; we replace the existing element's outerHTML
  // wholesale via the same patchJsxOuterByOid / patchHtmlOuter path.
  // The targetOid arg from LibraryModal is shape-only — the routing
  // reads vibeInfo from closure since the modal isn't selection-aware.
  //
  // Flow:
  //   1. Post vibe:update-outer to the iframe → instant DOM mutation,
  //      runtime re-injects the OID into the new outer + re-emits
  //      vibe:selected so the panel stays in sync.
  //   2. Reconcile source synchronously through buildVibeCommit's
  //      outer-replacement path. JSX requires oid; HTML requires
  //      htmlPath; both are checked inside buildVibeCommit.
  //   3. Reset lastVibeCommitRef so the iframe's post-swap re-emit
  //      establishes a fresh baseline (otherwise the idle commit
  //      would interpret normal post-swap field shifts as drift).
  //   4. Close BOTH modals (caller may have opened either).
  const handleVibeOuterSwap = useCallback(
    (assetText: string, opts?: { forceRebuild?: boolean }) => {
      const info = vibeInfo;
      if (!info) return;
      previewHandleRef.current?.postVibe({
        type: "vibe:update-outer",
        path: info.path,
        oid: info.oid,
        newOuter: assetText,
      });
      // Read source from the ref so a stale-closure typing race doesn't
      // patch against pre-keystroke bytes — the codeRef effect above
      // keeps this in sync with the latest setCode / setCodeSilent.
      const result = buildVibeCommit({
        mode: kind,
        source: codeRef.current,
        old: info,
        next: { outer: assetText },
      });
      if (result.kind === "ok") {
        // Component-library assets in JSX mode carry JSX-specific syntax
        // ({/* comments */}, `<style>{`...`}</style>` template literals,
        // multi-root Fragment wraps) that the iframe's outerHTML write
        // can't render natively — the DOM ends up with literal text where
        // the JSX should evaluate. Caller passes forceRebuild:true to
        // route through setCode (rebuilds iframe with real React/Babel),
        // wiping the broken-DOM intermediate state. Icon / image swaps
        // emit plain HTML/SVG that outerHTML handles fine — those keep
        // the no-rebuild fast path via setCodeSilent.
        if (opts?.forceRebuild) {
          setCode(result.source);
        } else {
          setCodeSilent(result.source);
        }
      } else if (result.kind === "bail") {
        // Silent-failure surface: outer-swap landed in the iframe DOM
        // but couldn't reach source. Without this toast the vibecoder
        // sees the swap apparently "succeed" then reload-reverts —
        // classic trust killer (SF-M6).
        showWarn(
          result.reason === "missing-oid"
            ? "Couldn't save the swap — element has no ID. Reselect and try again."
            : "Couldn't save the swap — element location isn't tracked. Reselect and try again.",
        );
      }
      lastVibeCommitRef.current = null;
      setVibeIconSwapOpen(false);
      setVibeImageSwapOpen(false);
      setVibeComponentSwapOpen(false);
    },
    [vibeInfo, kind, setCode, setCodeSilent, showWarn],
  );

  // Per-kind pick wrappers. The LibraryModal's onSwapWith signature is
  // (targetOid, assetText, preserveChildren?) — we ignore the first
  // and third args here.
  const handleVibeIconPick = useCallback(
    (_targetOid: string, assetText: string) => {
      const info = vibeInfo;
      if (!info || info.kind !== "icon") return;
      handleVibeOuterSwap(assetText);
    },
    [vibeInfo, handleVibeOuterSwap],
  );

  const handleVibeImagePick = useCallback(
    (_targetOid: string, assetText: string) => {
      const info = vibeInfo;
      if (!info || info.kind !== "image") return;
      handleVibeOuterSwap(assetText);
    },
    [vibeInfo, handleVibeOuterSwap],
  );

  // Component-swap pick. Unlike icon / image picks, this isn't kind-
  // gated — it fires for whatever element is currently selected
  // (text / heading / button / link / card / plain container). The
  // library's Components panel emits a full Uiverse / HyperUI block
  // and we replace the selected element's outerHTML wholesale.
  const handleVibeComponentPick = useCallback(
    (_targetOid: string, assetText: string) => {
      const info = vibeInfo;
      if (!info) return;
      handleVibeOuterSwap(assetText);
    },
    [vibeInfo, handleVibeOuterSwap],
  );

  // Tool-change cleanup: leaving vibe mode wipes vibe state and
  // tells the iframe to drop the [data-vibe-selected] outline. Also
  // closes the icon-swap modal if it was open (the modal mount is
  // gated on vibeInfo + tool, but explicit reset prevents a stale
  // modal showing if React batches state updates oddly).
  useEffect(() => {
    if (tool !== "vibe" && vibeInfo) {
      previewHandleRef.current?.postVibe({ type: "vibe:clear" });
      setVibeInfo(null);
      lastVibeCommitRef.current = null;
      setVibeIconSwapOpen(false);
      setVibeImageSwapOpen(false);
      setVibeComponentSwapOpen(false);
      setVibeBgImageOpen(false);
    }
  }, [tool, vibeInfo]);

  // Source reconciliation. The iframe DOM is the source of truth at
  // edit time (mutations land via direct postVibe and don't rebuild
  // the iframe). After 600ms idle on a single element, translate any
  // delta from the last-committed snapshot to a source patch via
  // buildVibeCommit and write through setCodeSilent (no history
  // entry, no iframe rebuild). Switching elements resets the
  // baseline so the next edits diff against the new element's
  // captured values.
  useEffect(() => {
    if (!vibeInfo) {
      lastVibeCommitRef.current = null;
      return;
    }
    const last = lastVibeCommitRef.current;
    if (!last || last.path !== vibeInfo.path) {
      // First selection on this path — record baseline, no commit yet.
      lastVibeCommitRef.current = vibeInfo;
      return;
    }
    // Check if any committable field has actually drifted.
    const drifted =
      vibeInfo.text !== last.text ||
      (vibeInfo.src ?? "") !== (last.src ?? "") ||
      (vibeInfo.alt ?? "") !== (last.alt ?? "") ||
      (vibeInfo.href ?? "") !== (last.href ?? "") ||
      (vibeInfo.inlineStyle ?? "") !== (last.inlineStyle ?? "") ||
      (vibeInfo.classes ?? "") !== (last.classes ?? "") ||
      (vibeInfo.textColor ?? "") !== (last.textColor ?? "") ||
      (vibeInfo.bgColor ?? "") !== (last.bgColor ?? "") ||
      (vibeInfo.borderRadius ?? "") !== (last.borderRadius ?? "") ||
      (vibeInfo.bgImage ?? null) !== (last.bgImage ?? null);
    if (!drifted) return;

    const id = setTimeout(() => {
      // Build the per-property style delta. JSX mode uses this to
      // translate inline-style writes into Tailwind arbitrary-value
      // class writes (since React rejects string-valued style props,
      // class-based writeback is the only reload-survival path).
      // HTML mode ignores styleDelta and uses next.style instead —
      // see commit.ts. Only emit fields that actually changed.
      const styleDelta: {
        color?: string;
        backgroundColor?: string;
        borderRadius?: string;
        bgImageUrl?: string | null;
      } = {};
      if ((vibeInfo.textColor ?? "") !== (last.textColor ?? "")) {
        styleDelta.color = vibeInfo.textColor ?? "";
      }
      if ((vibeInfo.bgColor ?? "") !== (last.bgColor ?? "")) {
        styleDelta.backgroundColor = vibeInfo.bgColor ?? "";
      }
      if ((vibeInfo.borderRadius ?? "") !== (last.borderRadius ?? "")) {
        styleDelta.borderRadius = vibeInfo.borderRadius ?? "";
      }
      if ((vibeInfo.bgImage ?? null) !== (last.bgImage ?? null)) {
        styleDelta.bgImageUrl = vibeInfo.bgImage ?? null;
      }
      const hasStyleDelta =
        styleDelta.color !== undefined ||
        styleDelta.backgroundColor !== undefined ||
        styleDelta.borderRadius !== undefined ||
        styleDelta.bgImageUrl !== undefined;

      // Read source from codeRef at fire time — without this, every
      // Monaco keystroke would re-run this effect (via `code` in deps),
      // cancel the existing timer, and start a new 600ms wait. Result:
      // the vibe commit never fires until the user stops typing in
      // Monaco — meaning vibe edits made WHILE typing get lost.
      const result = buildVibeCommit({
        mode: kind,
        source: codeRef.current,
        old: last,
        next: {
          text: vibeInfo.text !== last.text ? vibeInfo.text : undefined,
          src:
            (vibeInfo.src ?? "") !== (last.src ?? "")
              ? vibeInfo.src ?? ""
              : undefined,
          alt:
            (vibeInfo.alt ?? "") !== (last.alt ?? "")
              ? vibeInfo.alt ?? ""
              : undefined,
          href:
            (vibeInfo.href ?? "") !== (last.href ?? "")
              ? vibeInfo.href ?? ""
              : undefined,
          style:
            (vibeInfo.inlineStyle ?? "") !== (last.inlineStyle ?? "")
              ? vibeInfo.inlineStyle ?? ""
              : undefined,
          classes:
            (vibeInfo.classes ?? "") !== (last.classes ?? "")
              ? vibeInfo.classes ?? ""
              : undefined,
          styleDelta: hasStyleDelta ? styleDelta : undefined,
        },
      });
      if (result.kind === "ok") {
        // 2026-05-16 — Route through setCode (history-aware) instead
        // of setCodeSilent. Per user feedback: "undo redo doesnt work.
        // we need to add button to when something is changed, to
        // apply button below it so it registered as changed."
        //
        // The silent path leaves vibe edits invisible to history, so
        // even the new Apply button has nothing to commit after this
        // useEffect fires. By routing every 600ms idle batch through
        // setCode, each "session of typing" becomes one undo step —
        // the natural cadence for keystroke-driven edits.
        //
        // Trade-off: setCode triggers an iframe rebuild, so the
        // preview briefly flickers ~600ms after each stable edit.
        // Acceptable cost for working undo. The vibe edits remain
        // INSTANT in the iframe (via postVibe live updates) before
        // the rebuild; what flickers is the source-driven re-render,
        // which lands the same visual result.
        setCode(result.source);
        lastVibeCommitRef.current = vibeInfo;
      } else if (result.kind === "bail") {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(
            "[vibe-edit] idle-commit bail",
            result.reason,
            "for path",
            last.path,
          );
        }
        const now = Date.now();
        if (now - lastVibeBailToastRef.current > 60_000) {
          lastVibeBailToastRef.current = now;
          showWarn(
            result.reason === "missing-oid"
              ? "Your edits aren't saving — element has no ID. Reselect and try again."
              : "Your edits aren't saving — element location isn't tracked. Reselect and try again.",
          );
        }
      }
    }, 600);
    return () => clearTimeout(id);
  }, [vibeInfo, kind, setCode, showWarn]);

  // 2026-05-16 — Explicit Apply for vibe edits. The idle-commit above
  // writes through `setCodeSilent` (no history entry) so undo can't
  // revert vibe-edited fields. Per user direction ("undo redo doesnt
  // work. we need to add button to when something is changed, to
  // apply button below it so it registered as changed"), this
  // callback runs the SAME buildVibeCommit logic but routes through
  // `setCode` instead → history entry created → undo works on the
  // committed batch.
  //
  // Trade-off: setCode triggers an iframe rebuild, so applying causes
  // a momentary blink + selection re-establish. Acceptable for a
  // deliberate user gesture; would be annoying for the 600ms idle
  // path (kept silent).
  //
  // Duplicates the field-diff and styleDelta logic from the idle-
  // commit useEffect above. Refactoring to a shared helper is
  // deferred — the risk of regressing the idle path right now is
  // higher than the cost of two copies.
  const handleVibeApply = useCallback(() => {
    console.log("[dropin:Workspace] handleVibeApply entry", {
      hasVibeInfo: !!vibeInfo,
      hasBaseline: !!lastVibeCommitRef.current,
    });
    const info = vibeInfo;
    if (!info) {
      console.log("[dropin:Workspace] Apply bailed — no vibeInfo");
      return;
    }
    const last = lastVibeCommitRef.current;
    if (!last) {
      // 2026-05-16 — Reframed from "Nothing to apply yet" to a
      // positive confirmation. Now that idle-commit routes through
      // setCode (creating history entries automatically), the user
      // hitting Apply with no baseline yet just means they haven't
      // made changes since selecting — those changes that ARE there
      // got auto-saved already. Tell them everything is saved.
      console.log("[dropin:Workspace] Apply: no baseline yet — auto-saves are working");
      showInfo("All saved ✓");
      return;
    }
    const drifted =
      info.text !== last.text ||
      (info.src ?? "") !== (last.src ?? "") ||
      (info.alt ?? "") !== (last.alt ?? "") ||
      (info.href ?? "") !== (last.href ?? "") ||
      (info.inlineStyle ?? "") !== (last.inlineStyle ?? "") ||
      (info.classes ?? "") !== (last.classes ?? "") ||
      (info.textColor ?? "") !== (last.textColor ?? "") ||
      (info.bgColor ?? "") !== (last.bgColor ?? "") ||
      (info.borderRadius ?? "") !== (last.borderRadius ?? "") ||
      (info.bgImage ?? null) !== (last.bgImage ?? null);
    console.log("[dropin:Workspace] Apply drift check", { drifted });
    if (!drifted) {
      // 2026-05-16 — Same reframe. No drift means idle-commit already
      // wrote everything to source via setCode (which DOES create a
      // history entry). Apply was effectively a no-op because the
      // user beat the system to it — but their work IS saved.
      showInfo("All saved ✓ — Undo to revert.");
      return;
    }
    const styleDelta: {
      color?: string;
      backgroundColor?: string;
      borderRadius?: string;
      bgImageUrl?: string | null;
    } = {};
    if ((info.textColor ?? "") !== (last.textColor ?? "")) {
      styleDelta.color = info.textColor ?? "";
    }
    if ((info.bgColor ?? "") !== (last.bgColor ?? "")) {
      styleDelta.backgroundColor = info.bgColor ?? "";
    }
    if ((info.borderRadius ?? "") !== (last.borderRadius ?? "")) {
      styleDelta.borderRadius = info.borderRadius ?? "";
    }
    if ((info.bgImage ?? null) !== (last.bgImage ?? null)) {
      styleDelta.bgImageUrl = info.bgImage ?? null;
    }
    const hasStyleDelta =
      styleDelta.color !== undefined ||
      styleDelta.backgroundColor !== undefined ||
      styleDelta.borderRadius !== undefined ||
      styleDelta.bgImageUrl !== undefined;
    const result = buildVibeCommit({
      mode: kind,
      source: codeRef.current,
      old: last,
      next: {
        text: info.text !== last.text ? info.text : undefined,
        src:
          (info.src ?? "") !== (last.src ?? "")
            ? info.src ?? ""
            : undefined,
        alt:
          (info.alt ?? "") !== (last.alt ?? "")
            ? info.alt ?? ""
            : undefined,
        href:
          (info.href ?? "") !== (last.href ?? "")
            ? info.href ?? ""
            : undefined,
        style:
          (info.inlineStyle ?? "") !== (last.inlineStyle ?? "")
            ? info.inlineStyle ?? ""
            : undefined,
        classes:
          (info.classes ?? "") !== (last.classes ?? "")
            ? info.classes ?? ""
            : undefined,
        styleDelta: hasStyleDelta ? styleDelta : undefined,
      },
    });
    console.log("[dropin:Workspace] Apply buildVibeCommit result", {
      kind: result.kind,
      reason: result.kind === "bail" ? result.reason : null,
    });
    if (result.kind === "ok") {
      setCode(result.source);
      lastVibeCommitRef.current = info;
      showInfo("Changes saved. Undo to revert.");
    } else if (result.kind === "bail") {
      showWarn(
        result.reason === "missing-oid"
          ? "Couldn't save — element has no ID. Reselect and try again."
          : "Couldn't save — element location isn't tracked. Reselect and try again.",
      );
    }
  }, [vibeInfo, kind, setCode, showInfo, showWarn]);

  const handlePreviewReady = useCallback((h: PreviewHandle) => {
    previewHandleRef.current = h;
  }, []);

  const handleLibraryInsert = useCallback(
    (text: string, opts?: { position?: "cursor" | "top" }) => {
      const h = editorHandleRef.current;
      const pos = opts?.position ?? "cursor";
      if (h) {
        if (pos === "top") {
          // Page-level inserts (palette / gradient) need to land somewhere
          // syntactically valid AND in a cascade position late enough to
          // win against existing utilities. For HTML that's right before
          // </head> — last in head, no quirks-mode trigger from the
          // <style> appearing before the doctype. For JSX it's inside the
          // JSX return wrapper (a stray <style /> outside any JSX
          // expression is a syntax error since it isn't a valid statement).
          if (kind === "jsx") h.insertAtJsxRoot(text);
          else h.insertInHtmlHead(text);
        } else {
          h.insertAtCursor(text);
        }
      } else {
        // Editor not mounted yet (e.g. library opened before Monaco
        // finished loading). For "top" inserts prepend; otherwise append.
        // Either way the user's action isn't lost. The JSX-wrapper
        // insertion path requires Monaco to be live, so we just prepend.
        setCode((prev) => (pos === "top" ? text + "\n\n" + prev : prev + "\n\n" + text));
      }
      setActivePane("preview");
    },
    [kind]
  );

  // (Tenth pass) The post-hydration `initialOidStampedRef`-gated useEffect
  // that lived here was retired. With deterministic OIDs (offset-seeded
  // makeOid), the lazy initializer above stamps OIDs at SSR time, server
  // and client produce identical output, and the post-hydration stamp is
  // both unnecessary AND harmful — it triggered a second iframe rebuild
  // that confused unpkg.com's CORS preflight cache. The mid-session
  // debounced re-inject below still handles paste-without-OIDs and any
  // kind-toggle (HTML → JSX) — those paths legitimately need to inject
  // OIDs after mount, but they're rare and aren't on the hot path.

  // Phase 1 polish: mid-session paste re-inject. Catches:
  //   - JSX pasted into Monaco mid-session (paste arrives without OIDs).
  //   - Kind-toggle from HTML to JSX (HTML never has OIDs, so the lazy
  //     initializer didn't run injectOids).
  // The debounce keeps it cheap during typing — 300ms after the user stops
  // editing, we re-parse + inject any new untagged elements.
  //
  // This effect debounces 300 ms after `code` settles, reparses with
  // `injectOids`, and grafts the new attributes through Monaco via
  // `applyEditsByOffset` (one `executeEdits` call → one undo entry on Monaco's
  // own stack, cursor preserved). The host's undo stack does NOT see the
  // re-inject — `suppressHistoryRef` flips Monaco's resulting onChange into
  // `setCodeSilent`, so a single Cmd-Z still rolls all the way back past the
  // paste rather than first having to undo "OIDs got stamped" before getting
  // to "paste happened". The path is idempotent — when no new untagged
  // elements are present, `injectOids` returns `unchanged: true` and we bail.
  // After the silent edit fires, this effect re-enters; the next pass finds
  // OIDs everywhere, returns unchanged, and the cycle stabilizes in two ticks.
  //
  // Skipped for HTML mode (no JSX → no OIDs). Falls back to `setCodeSilent`
  // when the editor handle isn't available yet (paste happened before Monaco
  // mounted) — same intent of skipping the host undo stack.
  useEffect(() => {
    if (kind !== "jsx") return;
    const id = setTimeout(() => {
      const result = injectOids(code);
      if (result.unchanged || result.insertions.length === 0) return;
      const handle = editorHandleRef.current;
      log("mid-session OID re-inject", {
        injected: result.injected,
        viaMonaco: !!handle,
      });
      if (handle) {
        suppressHistoryRef.current = true;
        handle.applyEditsByOffset(result.insertions, "dropin:oid-reinject");
      } else {
        // Pre-mount fallback: no Monaco yet, so no undo to preserve. Silent
        // update keeps the same intent — user shouldn't see this in their
        // undo stack regardless of which path stamped the OIDs.
        setCodeSilent(result.source);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [code, kind, setCodeSilent]);

  // Cmd/Ctrl+J toggles the library sidebar. Monaco doesn't claim Cmd+J by
  // default so this is safe; we still `preventDefault` so the browser doesn't
  // steal focus (Firefox binds Cmd+J to downloads).
  //
  // Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z (or Cmd+Y) drive the host-side undo stack
  // managed by `useSourceHistory`. Two paths reach it:
  //   - Window-level handler (this useEffect): fires when focus is anywhere
  //     OUTSIDE Monaco — preview pane, viewport chrome, library sidebar,
  //     document body. Gated via `isTextEditField` so a focused `<input>` /
  //     `<textarea>` (e.g. inspector class field) handles its own Cmd-Z.
  //   - Monaco-internal command (registered in `Editor.tsx handleMount`):
  //     fires when Monaco is focused. Calls `undo` / `redo` here directly.
  // Single source of truth is the host stack — Monaco's own internal stack
  // is ignored because it's reset every time the host pushes a state update
  // (dice roll, patcher, library insert) via `setValue`. Without the Monaco
  // command override, a Cmd-Z while Monaco was focused would hit Monaco's
  // (now-empty) stack and silently no-op.
  useEffect(() => {
    function isTextEditField(el: Element | null): boolean {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return true;
      // Monaco renders an internal <textarea class="inputarea"> for keystroke
      // capture. activeElement inside any .monaco-editor descendant means
      // Monaco owns the keypress. Also matches contentEditable surfaces (the
      // double-click-to-edit path in the iframe is in-iframe so won't appear
      // as host activeElement, but a host contentEditable would match here).
      if ((el as HTMLElement).isContentEditable) return true;
      if (el.closest(".monaco-editor")) return true;
      return false;
    }

    const onKey = (e: KeyboardEvent) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (!cmd) return;

      const key = e.key.toLowerCase();

      if (key === "j" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setLibraryOpen((o) => !o);
        return;
      }

      // Undo / redo. Skip when a text editor owns the keypress.
      if ((key === "z" || key === "y") && isTextEditField(document.activeElement)) return;

      if (key === "z" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        log("Cmd+Z → undo");
        undo();
        return;
      }
      if ((key === "z" && e.shiftKey && !e.altKey) || (key === "y" && !e.shiftKey && !e.altKey)) {
        e.preventDefault();
        log("Cmd+Shift+Z / Cmd+Y → redo");
        redo();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // Phase 3 polish (seventeenth pass) — Cmd+D / Backspace / Delete
  // shortcuts when an OID-bearing element is selected. Skips when a
  // text edit field (Monaco / inputs / contentEditable) owns the
  // keypress so the user can still type "d" inside class names, etc.
  // Only fires for jsx kind (the OID-based engines bail on html
  // anyway, so this is purely an early-out for cleanliness).
  useEffect(() => {
    function isTextEditField(el: Element | null): boolean {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return true;
      if ((el as HTMLElement).isContentEditable) return true;
      if (el.closest(".monaco-editor")) return true;
      return false;
    }

    const onKey = (e: KeyboardEvent) => {
      if (kind !== "jsx") return;
      if (isTextEditField(document.activeElement)) return;
      const oid = selection?.oid ?? null;
      if (!oid) return;

      const cmd = e.metaKey || e.ctrlKey;
      const key = e.key;
      const klow = key.toLowerCase();

      if (cmd && klow === "d" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const all = additionalOids.length > 0 ? [oid, ...additionalOids] : null;
        log("Cmd+D → duplicate", { oid, additionals: additionalOids.length });
        if (all) handleDuplicateMulti(all);
        else handleDuplicateByOid(oid);
        return;
      }

      if ((key === "Backspace" || key === "Delete") && !e.altKey) {
        // Bare Backspace / Delete (no cmd) is the convention everywhere
        // else (Figma, Framer, Sketch). Cmd+Backspace also works (some
        // users hit Cmd-anything muscle memory) — both shapes commit.
        e.preventDefault();
        const all = additionalOids.length > 0 ? [oid, ...additionalOids] : null;
        log("Backspace/Delete → delete element", {
          oid,
          additionals: additionalOids.length,
        });
        const ok = all
          ? handleDeleteMulti(all)
          : handleDeleteByOid(oid);
        if (ok) {
          // The selection's element no longer exists in source — clear
          // it so the next click in the iframe registers cleanly.
          setSelection(null);
          setAdditionalOids([]);
        }
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    kind,
    selection,
    additionalOids,
    handleDuplicateByOid,
    handleDuplicateMulti,
    handleDeleteByOid,
    handleDeleteMulti,
  ]);

  // Phase 5 / Phase B — tool switch wrapper. Centralizes side effects:
  //   · Switching to View closes any open FocusEditor (the user is
  //     stepping out of edit mode).
  //   · Switching FROM Select/Move to View also clears multi-select
  //     state — multi-select is gesture state and shouldn't survive
  //     a return to read-only.
  //   · Insert / Swap target stash (Phase C) is cleared whenever the
  //     destination is anything OTHER than Insert / Swap respectively
  //     (mid-flow bail). For Phase B these refs don't exist yet; the
  //     hook is shape-stable so Phase C only adds the clear lines.
  const handleToolChange = useCallback(
    (next: Tool) => {
      const prev = tool;
      if (next === prev) return;
      setTool(next);
      if (next === "view") {
        // Stepping back to View — close any in-flight edit context.
        setFocusOpen(false);
        setAdditionalOids([]);
      }
      // Phase 5 / Phase C — Insert tool flow. Entering Insert clears
      // any prior target stash + closes the library (the user picks a
      // target on the canvas first; library opens on
      // dropin:insert-target-confirmed). Leaving Insert clears the
      // target stash so a stale OID can't open the library after the
      // user has moved on.
      if (prev === "insert" || next === "insert") {
        setInsertTargetOid(null);
        setInsertTargetTag("");
        setAdditionalInsertTargetOids([]);
        if (next === "insert") setLibraryOpen(false);
      }
      // 2026-05-17 — Clear AI selection when leaving AI tool. The
      // iframe runtime won't emit fresh ai:* events when DROPIN_TOOL
      // changes, so the host state would otherwise persist a stale
      // selection through tool switches.
      if (prev === "ai" && next !== "ai") {
        setAiInfo(null);
        previewHandleRef.current?.postVibe({ type: "ai:clear" });
        // Phase 2 — abort any in-flight AI request when leaving the tool.
        // Otherwise a slow Tensorix response could land seconds after the
        // user switched away + try to swap an element they no longer have
        // selected.
        if (aiAborterRef.current) {
          aiAborterRef.current.abort();
          aiAborterRef.current = null;
        }
        setAiBusy(false);
        setAiBusyModel(null);
        aiLastEditRef.current = null;
        // Bug #3 fix — clear any AI success toast on tool exit. The toast
        // has an Undo action that's only meaningful while AI tool is active
        // + the prompt bar context is visible. A lingering toast in View
        // mode would be confusing.
        setRollToast(null);
      }
      // Phase 6 (2026-05-11 PM) — standalone Swap tool retired. Asset
      // swap-from-library lives inside vibe mode via the per-kind
      // Browse buttons (vibeIconSwapOpen / vibeImageSwapOpen handlers).
    },
    [tool, setTool],
  );

  // Phase 5 / Phase B / B7 — V/S/M/I/W keyboard shortcuts. Skip when
  // a text-edit field owns focus (Monaco, inputs, contentEditable) so
  // the user can still type "v" inside a class name without flipping
  // the tool. Bound at window level — works whether the user's
  // pointer is over the canvas, the editor, the library, or the tree.
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
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTextEditField(document.activeElement)) return;
      const k = e.key.toLowerCase();
      let next: Tool | null = null;
      if (k === "v") next = "view";
      else if (k === "s") next = "select";
      else if (k === "e") next = "vibe";
      // 'a' (AI) retired 2026-05-20 — feature dropped per user direction.
      // Quality wasn't reliable enough; code left on disk for future
      // recovery. localStorage migration in the persist effect below
      // remaps any persisted "ai" → "view".
      // 'i' (Insert) retired 2026-05-14 — insertion now happens via the
      // Swap-from-library affordance inside vibe-edit mode (every element
      // gets a "Browse library" button in its properties panel).
      // 'm' (Move) retired 2026-05-15 — canvas-drag move tool removed
      // (see TOOL_LIST comment in ToolBar.tsx). Tree-side DnD still
      // works for the legitimate reorder/reparent use case.
      // 'w' (Swap) retired in Phase 6 (2026-05-11 PM). Swap-from-
      // library lives inside vibe mode now — press E to enter Edit
      // and use the Browse buttons in the per-kind panel.
      if (!next) return;
      e.preventDefault();
      handleToolChange(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleToolChange, selection]);

  // Cmd/Ctrl+C copy + Cmd/Ctrl+V paste of the selected element's full
  // class string (ROADMAP §4.1 #4). Empty-deps useEffect — the handler
  // reads `selectionRef.current` so re-attaching on every selection
  // change is unnecessary. `clipboardClassesRef` is module-local: persists
  // across selections within a session, drops on full reload.
  //
  // Skip when a TEXT input owns focus (textarea, text/email/url/password
  // inputs, contentEditable, Monaco) so the user can still copy/paste text
  // inside class fields and the editor without us hijacking the keypress.
  // Sliders / colour pickers / checkboxes are NOT skipped — those don't
  // have meaningful Cmd+C/V semantics for the browser to override. Without
  // that distinction, the inspector's inline opacity slider would block
  // copy of the surrounding selection.
  useEffect(() => {
    function isTypingTarget(el: Element | null): boolean {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "TEXTAREA") return true;
      if (tag === "INPUT") {
        const type = (el as HTMLInputElement).type;
        return (
          type === "text" ||
          type === "search" ||
          type === "email" ||
          type === "url" ||
          type === "tel" ||
          type === "password" ||
          type === "number"
        );
      }
      if ((el as HTMLElement).isContentEditable) return true;
      if (el.closest(".monaco-editor")) return true;
      return false;
    }
    function onKey(e: KeyboardEvent) {
      const cmd = e.metaKey || e.ctrlKey;
      if (!cmd) return;
      if (e.shiftKey || e.altKey) return;
      if (isTypingTarget(document.activeElement)) return;
      const sel = selectionRef.current;
      if (!sel) return;
      const key = e.key.toLowerCase();
      if (key === "c") {
        const cls = sel.classes.join(" ");
        e.preventDefault();
        clipboardClassesRef.current = cls;
        const n = sel.classes.length;
        log("Cmd+C → copied classes", { count: n, head: sel.classes.slice(0, 6) });
        showInfo(n === 0 ? "Copied (no classes)" : `Copied ${n} class${n === 1 ? "" : "es"}`);
        return;
      }
      if (key === "v") {
        const stash = clipboardClassesRef.current;
        if (stash === null) {
          showWarn("Nothing to paste — copy a style first with Cmd+C");
          e.preventDefault();
          return;
        }
        e.preventDefault();
        const trimmed = stash.trim();
        const n = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
        log("Cmd+V → applying classes", { count: n });
        handleClassChange(sel.loc, stash);
        showInfo(n === 0 ? "Cleared classes" : `Pasted ${n} class${n === 1 ? "" : "es"}`);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClassChange, showInfo, showWarn]);

  const selectedLoc = selection?.loc ?? null;
  const selectedOid = selection?.oid ?? null;
  const selectedTag = selection?.tag ?? null;

  // Phase 1 group-roots host-side auto-detect (`maniuplation.md` Layer 1).
  // Walk the parsed AST and collect OIDs whose `tagName` starts with an
  // uppercase letter — i.e. React component boundaries. `<Foo>`, `<Foo.Bar>`,
  // and `<MotionDiv>` qualify; intrinsics like `<div>` / `<svg>` / `<svg:circle>`
  // don't. Iframe receives the list via `dropin:set-group-roots` and uses it
  // to make the first click on any element inside `<Foo>` select Foo as a
  // unit (subsequent clicks drill in). Empty for HTML mode (no JSX → no
  // component boundaries → no auto-detect). Memoized on `code` so the
  // @babel/parser parse only runs when the source actually changes; rerunning
  // this on every render of Workspace would be ~1-5 ms of wasted CPU per
  // keystroke.
  const groupRootOids = useMemo(() => {
    if (kind !== "jsx") return [];
    try {
      return buildIndex(code)
        .all()
        .filter((n) => /^[A-Z]/.test(n.tagName))
        .map((n) => n.oid);
    } catch {
      // buildIndex already swallows parse errors and returns an empty index;
      // this catch is belt-and-braces for any future refactor that lets the
      // throw escape. A failed parse mid-typing shouldn't break click hit-
      // testing — just degrade to "no auto-detected group roots".
      return [];
    }
  }, [code, kind]);

  // Viewport doubles as the inspector's breakpoint context — clicking
  // "Mobile" both shrinks the iframe AND tells class-edits to prepend `sm:`.
  // Keeps the chrome to one segmented control instead of two near-identical
  // ones (the old "DESKTOP TABLET MOBILE" + "DESKTOP·- TABLET·MD MOBILE·SM"
  // pair confused users into thinking they were duplicates).
  const setViewportSynced = useCallback(
    (v: Viewport) => {
      setViewport(v);
      setBreakpoint(v);
    },
    [setBreakpoint],
  );

  return (
    // h-dvh (dynamic viewport height) on mobile so iOS Safari's URL-bar
    // collapse/expand doesn't leave the iframe extending past the visible
    // viewport (h-screen = 100vh includes the URL bar area). On desktop
    // dvh and vh resolve to the same value.
    <div className="flex h-dvh flex-col bg-paper">
      <WorkspaceHeader title={title} subtitle={subtitle} />

      {/* Edit chrome — desktop only (lg+). Mobile gets a view-only
          experience: just the WorkspaceHeader nav + the Preview iframe.
          The tool persistence effect above also bails to "view" on
          mobile so the iframe runtime stays inert. */}
      <div className="hidden lg:contents">
        <ToolBar
          tool={tool}
          onToolChange={handleToolChange}
        >
          <WorkspaceActions
            allowKindToggle={allowKindToggle}
            urlKindToggle={urlKindToggle}
            kind={kind}
            onKindChange={handleKindChange}
            code={code}
            filename={filename}
            viewport={viewport}
            onViewportChange={setViewportSynced}
            onExpand={() => setPreviewExpanded(true)}
            showWarn={showWarn}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onReset={handleResetTemplate}
            onOpenWhatsNext={() => setWhatsNextOpen(true)}
          />
        </ToolBar>

        <PaneTabs activePane={activePane} onSelect={setActivePane} />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* LeftRail (Code/Tree/Library icon column) — desktop only. */}
        <div className="hidden lg:contents">
          <WorkspaceLeftRail
            codeOpen={!editorHidden}
            onToggleCode={() => {
              if (editorHidden) {
                setEditorHidden(false);
                setTreeOpen(false);
                setLibraryOpen(false);
              } else {
                setEditorHidden(true);
              }
            }}
            treeOpen={treeOpen}
            onToggleTree={() => {
              if (!treeOpen) {
                setTreeOpen(true);
                setEditorHidden(true);
                setLibraryOpen(false);
              } else {
                setTreeOpen(false);
              }
            }}
            libraryOpen={libraryOpen}
            onToggleLibrary={() => {
              if (!libraryOpen) {
                setLibraryOpen(true);
                setEditorHidden(true);
                setTreeOpen(false);
              } else {
                setLibraryOpen(false);
              }
            }}
          />
        </div>

        <div className="min-h-0 flex-1">
          <Preview
            code={entryCode}
            kind={kind}
            viewport={viewport}
            tool={tool}
            selectedLoc={selectedLoc}
            selectedOid={selectedOid}
            selectedTag={selectedTag}
            additionalOids={additionalOids}
            groupRootOids={groupRootOids}
            onSelectionChange={handleSelectionChange}
            onTextCommit={handleTextCommit}
            onIframeError={handleIframeError}
            onResize={handleResize}
            onSpacing={handleSpacing}
            onResizeMulti={handleResizeMulti}
            onSpacingMulti={handleSpacingMulti}
            onReorder={handleReorder}
            onReparent={handleReparent}
            onReorderMulti={handleReorderMulti}
            onReparentMulti={handleReparentMulti}
            onDuplicate={handleDuplicateByOid}
            onDelete={handleDeleteByOid}
            onDuplicateMulti={handleDuplicateMulti}
            onDeleteMulti={handleDeleteMulti}
            onDeleteCompleted={() => {
              setSelection(null);
              setAdditionalOids([]);
            }}
            onTreeUpdate={setTree}
            hoverHighlightOid={hoverHighlightOid}
            onInsertTarget={handleInsertTargetConfirmed}
            onReady={handlePreviewReady}
            onVibeSelected={handleVibeSelected}
            onVibeCleared={handleVibeCleared}
            onAiSelected={handleAiSelected}
            onAiCleared={handleAiCleared}
            onAiApplied={handleAiApplied}
            onAiApplyFailed={handleAiApplyFailed}
          />
        </div>

        {!editorHidden && (
          <ResizablePanel
            storageKey="dropin:panel:code:width"
            defaultWidth={420}
            minWidth={300}
            maxWidth={900}
            handle="left"
            ariaLabel="Code editor"
            className="hidden lg:block"
          >
            <div className="flex h-full min-h-0 flex-col border-l-2 border-ink bg-paper">
              <header className="flex shrink-0 items-stretch border-b-2 border-ink bg-paper">
                <div className="flex shrink-0 items-center gap-2 border-r-2 border-ink px-3 py-2">
                  <span className="font-display text-base leading-none">Code</span>
                </div>
                <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto">
                  {files.map((f) => {
                    const isActive = f.id === activeFileId;
                    const isEntry = f.id === project.entryFileId;
                    return (
                      <div
                        key={f.id}
                        className={
                          "flex shrink-0 items-stretch border-r-2 border-ink " +
                          (isActive ? "bg-ink text-paper" : "")
                        }
                      >
                        <button
                          type="button"
                          onClick={() => { log("click tab", { path: f.path }); handleTabSwitch(f.id); }}
                          title={f.path + (isEntry ? " (entry file)" : "")}
                          className={
                            "px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] " +
                            (isActive ? "" : "text-muted hover:bg-ink/10 hover:text-ink")
                          }
                        >
                          {f.path}
                          {isEntry ? " ★" : ""}
                        </button>
                        {!isEntry && (
                          <button
                            type="button"
                            onClick={() => { log("click delete tab", { path: f.path }); handleRemoveFile(f.id); }}
                            aria-label={`Delete ${f.path}`}
                            title={`Delete ${f.path}`}
                            className={
                              "shrink-0 px-1.5 py-2 font-mono text-[10px] " +
                              (isActive
                                ? "hover:bg-red-500 hover:text-paper"
                                : "text-muted hover:bg-red-500 hover:text-paper")
                            }
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => { log("click + new file"); handleAddFile(); }}
                    aria-label="New file"
                    title="New file"
                    className="shrink-0 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:bg-ink hover:text-paper"
                  >
                    + file
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { log("click Close (editor pane)"); setEditorHidden(true); }}
                  aria-label="Hide code editor"
                  title="Hide code editor (full-bleed preview)"
                  className="inline-flex shrink-0 items-center border-l-2 border-ink bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper"
                >
                  ×
                </button>
              </header>
              <div className="min-h-0 flex-1">
                {editorMounted ? (
                  <Editor
                    value={code}
                    onChange={handleEditorChange}
                    language={language}
                    path={activeFile?.path}
                    onReady={handleEditorReady}
                    onUndoRequest={undo}
                    onRedoRequest={redo}
                  />
                ) : (
                  <EditorLoadingFallback />
                )}
              </div>
            </div>
          </ResizablePanel>
        )}

        {treeOpen && <div className="hidden lg:contents"><ElementTree
          tree={tree}
          selectedKey={selectedTreeKey}
          onSelect={handleTreeSelect}
          open={treeOpen}
          onToggleOpen={() => setTreeOpen((v) => !v)}
          onDuplicate={kind === "jsx" ? handleDuplicateByOid : undefined}
          onDelete={kind === "jsx" ? handleDeleteByOid : undefined}
          onRowHover={setHoverHighlightOid}
          onTreeReorder={kind === "jsx" ? handleReorder : undefined}
          onTreeReparent={kind === "jsx" ? handleReparent : undefined}
          onTreeDropBail={
            kind === "jsx"
              ? (reason) => showWarn(`Move: ${reason}`)
              : undefined
          }
          selectedOidsForDrag={
            kind === "jsx" && selection?.oid
              ? [selection.oid, ...additionalOids]
              : undefined
          }
          onTreeReparentMulti={kind === "jsx" ? handleReparentMulti : undefined}
          onTreeReorderMulti={
            kind === "jsx" ? handleTreeReorderMulti : undefined
          }
          onDuplicateMulti={kind === "jsx" ? handleDuplicateMulti : undefined}
          onDeleteMulti={kind === "jsx" ? handleDeleteMulti : undefined}
          onTreeDndMixed={kind === "jsx" ? handleTreeDndMixed : undefined}
          onSelectAllInTree={
            kind === "jsx" ? handleSelectAllInTree : undefined
          }
          onSelectRangeInTree={
            // Thirtieth-pass — shift-click range-select. Same handler as
            // Cmd+A since both produce a list of oids that should
            // become [primary, ...additionals]; the only difference is
            // which gesture computed the list (Cmd+A: siblings; shift-
            // click: DFS slice between primary and clicked row).
            kind === "jsx" ? handleSelectAllInTree : undefined
          }
          onWarn={showWarn}
        /></div>}

        {libraryOpen && (
          <ResizablePanel
            storageKey="dropin:panel:library:width"
            defaultWidth={380}
            minWidth={300}
            maxWidth={640}
            handle="left"
            ariaLabel="Asset library"
            className="hidden lg:block"
          >
            <ComponentLibrarySidebar
              mode={kind}
              onInsert={handleLibraryInsert}
              open={libraryOpen}
              onToggle={setLibraryOpen}
              onWarn={showWarn}
              insertContext={
                tool === "insert" && insertTargetOid
                  ? {
                      parentOid: insertTargetOid,
                      targetTag: insertTargetTag,
                      additionalParentOids: additionalInsertTargetOids,
                    }
                  : null
              }
              onInsertInto={handleInsertInto}
              onInsertIntoMulti={handleInsertIntoMulti}
              onCancelInsert={handleCancelInsert}
              // Phase 6 — standalone Swap tool retired; vibe-mode
              // owns swap-from-library via vibeIconSwapOpen /
              // vibeImageSwapOpen + their own modal mounts below.
              swapContext={null}
              onSwapWith={handleSwap}
              onCancelSwap={handleCancelSwap}
              onApplyPalette={handleApplyPalette}
            />
          </ResizablePanel>
        )}

        {tool === "vibe" && (
          <div className="hidden lg:contents">
            <VibePropertiesPanel
              info={vibeInfo}
              onContentChange={handleVibeContent}
              onStyleChange={handleVibeStyle}
              onImageChange={handleVibeImage}
              onLinkChange={handleVibeLink}
              onClose={handleVibeClose}
              onIconSwap={handleVibeIconSwapOpen}
              onImageSwap={handleVibeImageSwapOpen}
              onBgImagePick={handleVibeBgImageOpen}
              onBgImageRemove={handleVibeBgImageRemove}
              onBgImageShuffle={handleVibeBgImageShuffle}
              onCopySection={kind === "jsx" ? handleCopySection : undefined}
              onComponentSwap={handleAiSwapOpen}
              onApply={handleVibeApply}
              onClassesChange={handleVibeClasses}
              onWarn={showWarn}
              onInfo={showInfo}
              mode={kind}
            />
          </div>
        )}
      </div>

      {tool === "vibe" && vibeIconSwapOpen && vibeInfo && vibeInfo.kind === "icon" && (
        <LibraryModal
          mode={kind}
          swapContext={{
            // The icon-swap pick handler reads vibeInfo from closure;
            // targetOid here is shape-only (LibraryModal/Sidebar use it
            // for the header label, never to address back into source).
            targetOid: vibeInfo.oid ?? "",
            targetTag: vibeInfo.tag,
            // Land on the Icons tab with no category filter — the
            // user wants to browse the full icon library.
            suggestedPanel: "icons",
            suggestedCategory: null,
            slotEnvelope: null,
          }}
          onSwapWith={handleVibeIconPick}
          onCancelSwap={handleVibeIconSwapClose}
          onWarn={showWarn}
        />
      )}

      {tool === "vibe" && vibeImageSwapOpen && vibeInfo && vibeInfo.kind === "image" && (
        <LibraryModal
          mode={kind}
          swapContext={{
            targetOid: vibeInfo.oid ?? "",
            targetTag: vibeInfo.tag,
            // Land on the Media tab — Unsplash + Pexels.
            suggestedPanel: "media",
            suggestedCategory: null,
            slotEnvelope: null,
          }}
          onSwapWith={handleVibeImagePick}
          onCancelSwap={handleVibeImageSwapClose}
          onWarn={showWarn}
        />
      )}

      {/* Components swap landed inline in VibePropertiesPanel (2026-05-14).
          The grid renders below the Browse-components button with hover-
          popover preview. Old LibraryModal mount retired here. */}

      {/* Phase 6 (2026-05-18) — AI swap modal. Mounted when tool is vibe,
          a selection exists, and the user clicked "Swap with AI" on the
          panel. InlineComponentBrowser in onPickReference mode hands the
          raw component HTML to handleAiSwapPick which routes through
          /api/ai-edit with mode:"swap" + referenceHtml. */}
      {tool === "vibe" && aiSwapOpen && vibeInfo && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 p-4"
          role="dialog"
          aria-label="Swap with AI"
          onClick={(e) => {
            // Click-outside dismiss. Only when the click hit the backdrop
            // directly, not bubbled from the content. Blocked while AI
            // is busy — the overlay's Cancel button is the affordance.
            if (e.target === e.currentTarget && !aiBusy) handleAiSwapClose();
          }}
        >
          <div className="flex h-[80vh] w-[min(900px,calc(100vw-32px))] flex-col border-2 border-ink bg-paper shadow-[8px_8px_0_0_#FF4D2E]">
            <div className="flex items-center justify-between border-b-2 border-ink bg-soft px-4 py-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral">
                  ✨ Swap with AI
                </span>
                <p className="mt-0.5 font-mono text-[10px] text-muted">
                  Pick a design — AI restyles your{" "}
                  <span className="font-bold">{vibeInfo.tag}</span> to match
                  while keeping your content + size.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAiSwapClose}
                disabled={aiBusy}
                aria-label="Close AI swap dialog"
                className="border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
              >
                Close (Esc)
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-auto">
              <InlineComponentBrowser
                mode={kind}
                category={aiSwapCategory}
                onPickReference={handleAiSwapPick}
                onWarn={showWarn}
              />
              {/* 2026-05-18 hotfix — Busy overlay. Renders ON TOP of the
                  grid when an AI swap request is in flight. Blocks
                  further picks + gives the user a clear visual that
                  something is happening during the 3-15s Tensorix call.
                  Without this the user sees the modal stay open and
                  thinks the pick didn't register. */}
              {aiBusy && (
                <AiSwapBusyOverlay
                  model={aiBusyModel}
                  onCancel={() => {
                    console.log("[dropin:swap] user-cancel");
                    if (aiAborterRef.current) {
                      aiAborterRef.current.abort();
                      aiAborterRef.current = null;
                    }
                    setAiBusy(false);
                    setAiBusyModel(null);
                    setAiSwapOpen(false);
                    setAiSwapCategory(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {tool === "vibe" && vibeBgImageOpen && vibeInfo && (
        <LibraryModal
          mode={kind}
          swapContext={{
            targetOid: vibeInfo.oid ?? "",
            targetTag: vibeInfo.tag,
            // Land on the Media tab — Unsplash + Pexels + Pixabay.
            // The pick handler intercepts the asset block and writes
            // the URL into the element's background via styleDelta
            // (NOT an outerHTML swap).
            suggestedPanel: "media",
            suggestedCategory: null,
            slotEnvelope: null,
          }}
          onSwapWith={handleVibeBgImagePick}
          onCancelSwap={handleVibeBgImageClose}
          onWarn={showWarn}
        />
      )}

      {previewExpanded && (
        <PreviewModal
          code={entryCode}
          kind={kind}
          initialViewport={viewport}
          filename={filename}
          onClose={() => setPreviewExpanded(false)}
        />
      )}

      {/* 2026-05-15 — "What's next?" helper. exportSource strips OIDs in JSX
          mode (same path as WorkspaceActions.handleCopy / handleDownload) so
          the copy-to-clipboard inside the modal yields clean code. */}
      {whatsNextOpen && (
        <WhatsNextModal
          onClose={() => setWhatsNextOpen(false)}
          exportSource={kind === "jsx" ? stripOids(code).source : code}
        />
      )}


      {focusOpen && selection && (
        <FocusEditor
          selection={selection}
          code={code}
          kind={kind}
          breakpoint={breakpoint}
          tool={tool}
          onToolChange={handleToolChange}
          onClassChange={handleClassChange}
          onAttrSet={handleAttrSet}
          onAttrRemove={handleAttrRemove}
          onTextChange={handleTextCommit}
          onBreadcrumbSelect={handleBreadcrumbSelect}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onCopyElement={handleCopyElement}
          onSetStyleProps={handleSetStyleProps}
          onClose={handleCloseFocus}
          insertContext={
            tool === "insert" && insertTargetOid
              ? {
                  parentOid: insertTargetOid,
                  targetTag: insertTargetTag,
                  additionalParentOids: additionalInsertTargetOids,
                }
              : null
          }
          // Phase 6 — standalone Swap tool retired; FocusEditor no
          // longer surfaces a Swap entry. Prop stays for interface
          // compat but is always null from this surface.
          swapContext={null}
          onInsertTarget={handleInsertTargetConfirmed}
          onInsertInto={handleInsertInto}
          onInsertIntoMulti={handleInsertIntoMulti}
          onSwapWith={handleSwap}
          onApplyPalette={handleApplyPalette}
          onCancelInsert={handleCancelInsert}
          onCancelSwap={handleCancelSwap}
          onWarn={showWarn}
        />
      )}

      {rollToast && (
        <div
          // Action toasts need pointer events for the button; status-only
          // toasts stay pointer-events-none so they don't intercept clicks
          // on the iframe behind them.
          // When AI tool is active the prompt bar lives at bottom-20 +
          // scope chip at bottom-6, so the toast bumps up to bottom-36 to
          // stack above both. Other tools keep the original bottom-6.
          className={
            "fixed left-1/2 z-[70] -translate-x-1/2 flex items-center gap-3 border-2 border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper shadow-[4px_4px_0_0_#FF4D2E] " +
            (tool === "ai" ? "bottom-36 " : "bottom-6 ") +
            (rollToast.action ? "pointer-events-auto" : "pointer-events-none")
          }
          role="status"
        >
          <span>
            {rollToast.icon} {rollToast.text}
          </span>
          {rollToast.action && (
            <button
              type="button"
              onClick={() => {
                const a = rollToast.action;
                setRollToast(null);
                if (a) a.onAction();
              }}
              className="border border-paper bg-paper px-2 py-0.5 text-[10px] text-ink transition-colors hover:bg-coral hover:text-paper"
            >
              {rollToast.action.label}
            </button>
          )}
        </div>
      )}

      {/* 2026-05-16 — Empty-state hint for view mode. When the user is in
          View (read-only) tool with no selection, surface the "Press E
          to start editing" prompt so first-time vibecoders don't bounce
          off a non-responsive canvas. Bottom-right placement avoids
          conflict with the bottom-center toast slot and the bottom-right
          FirstOpenTour card (which only fires once-per-user). pointer-
          events: none keeps iframe clicks pass-through. Hides on any
          non-view tool to avoid clutter during active editing. */}
      {tool === "view" && (
        <div
          className="pointer-events-none fixed bottom-6 right-6 z-[60] hidden lg:block border-2 border-ink bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink shadow-[4px_4px_0_0_#FF4D2E]"
          role="status"
          aria-label="View mode hint"
        >
          Press <span className="bg-ink px-1.5 text-paper">E</span> to start editing
        </div>
      )}

      {/* 2026-05-17 — AI Edit Phase 1 scope chip. Visible only when
          tool === "ai" AND a selection is active. Hosts the Tab /
          Shift+Tab / Escape keybindings. Prompt bar (Phase 2) will
          render alongside this when Tensorix wiring lands. */}
      {tool === "ai" && (
        <>
          <AiScopeChip
            info={aiInfo}
            onSetScope={handleAiSetScope}
            onClear={handleAiClearFromChip}
            hasJsxExpressions={aiHasJsxExpressions}
          />
          <AiPromptBar
            info={aiInfo}
            busy={aiBusy}
            busyModel={aiBusyModel}
            onSubmit={handleAiSubmit}
            onEscape={handleAiPromptEscape}
          />
        </>
      )}

      <FirstOpenTour hasSelection={selection !== null} />
    </div>
  );
}

// All chrome action buttons share the same brutalist shape — h-9, font-mono
// micro-caps, full border-2 ink frame, min-w to keep segmented widths even.
const HEADER_BTN =
  "inline-flex h-9 min-w-[5.5rem] items-center justify-center px-3 font-mono text-[10px] uppercase tracking-[0.15em] border-2 border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper";
const HEADER_BTN_ACTIVE =
  "inline-flex h-9 min-w-[5.5rem] items-center justify-center px-3 font-mono text-[10px] uppercase tracking-[0.15em] border-2 border-ink bg-ink text-paper";
const SEG_BTN =
  "inline-flex h-9 min-w-[5.5rem] items-center justify-center px-3 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors";

// Inline-SVG glyphs sized 14×14 to sit beside h-9 button text without
// pushing the row taller. stroke-width 1.75 matches the ToolBar tool icons
// for visual consistency. Pure presentational — currentColor follows the
// parent button's text color so active/hover swaps land for free.
function MonitorGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="3.5" width="19" height="13" rx="1.5" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16.5" x2="12" y2="20" />
    </svg>
  );
}
function TabletGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="1.5" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
function MobileGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7.5" y="2.5" width="9" height="19" rx="1.5" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </svg>
  );
}
function ExpandGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
    </svg>
  );
}
function CopyGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="1.5" />
      <path d="M16 8V4.5a1 1 0 0 0-1-1H4.5a1 1 0 0 0-1 1V15a1 1 0 0 0 1 1H8" />
    </svg>
  );
}
function DownloadGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 11l5 5 5-5M4 21h16" />
    </svg>
  );
}
function UndoGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7v6h6" />
      <path d="M3 13a9 9 0 1 0 3-7L3 13" />
    </svg>
  );
}
function RedoGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 7v6h-6" />
      <path d="M21 13a9 9 0 1 1-3-7L21 13" />
    </svg>
  );
}
function WhatsNextGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 4l8 8-8 8" />
      <path d="M3 12h13" />
    </svg>
  );
}
function ResetGlyph() {
  // Counter-clockwise rotation arrow with a center dot — communicates
  // "go all the way back to start" rather than the Undo glyph's "step
  // back one." Avoids visual confusion with Undo since they're sibling
  // buttons.
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4v6h6" />
      <path d="M20 12a8 8 0 0 1-15.5 2.5L4 10" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
function VariationsGlyph() {
  // Two-arrow shuffle/rotate glyph — communicates "try alternatives".
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 3l4 4-4 4" />
      <path d="M20 7H10a6 6 0 0 0-6 6" />
      <path d="M8 21l-4-4 4-4" />
      <path d="M4 17h10a6 6 0 0 0 6-6" />
    </svg>
  );
}

const VIEWPORTS_LIST: { id: Viewport; label: string; icon: React.ReactNode }[] = [
  { id: "desktop", label: "Desktop", icon: <MonitorGlyph /> },
  { id: "tablet", label: "Tablet", icon: <TabletGlyph /> },
  { id: "mobile", label: "Mobile", icon: <MobileGlyph /> },
];

// Minimal navbar — brand link + page title only. Action buttons (kind
// toggle, viewport, expand, copy, download) moved down to WorkspaceActionBar
// so the navbar stays calm and consistent across template / playground /
// future routes.
function WorkspaceHeader({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-4 border-b-2 border-ink bg-white/70 px-4 py-3 md:px-6">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:text-coral"
      >
        ← AiM Dropin
      </Link>
      {(title || subtitle) && (
        <div className="flex flex-col">
          {title && (
            <h1 className="font-display text-xl leading-tight md:text-2xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </header>
  );
}

// Action group rendered inside ToolBar's right slot. All controls share the
// same h-9 footprint and equal min-width so nothing reads as the "primary"
// or "afterthought" button. The breakpoint chooser is gone (Viewport now
// drives both the iframe size AND the inspector breakpoint at once).
function WorkspaceActions({
  allowKindToggle,
  urlKindToggle,
  kind,
  onKindChange,
  code,
  filename,
  viewport,
  onViewportChange,
  onExpand,
  showWarn,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
  onOpenWhatsNext,
}: {
  allowKindToggle: boolean;
  urlKindToggle: boolean;
  kind: PreviewKind;
  onKindChange: (k: PreviewKind) => void;
  code: string;
  filename?: string;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  onExpand: () => void;
  showWarn: (msg: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
  onOpenWhatsNext: () => void;
}) {
  const [copied, setCopied] = useState(false);

  // Strip `data-dropin-id` on the way out: OIDs are an internal editor
  // primitive, the user shouldn't see them in copied / downloaded source. JSX
  // only — HTML mode never has OIDs to strip.
  function exportSource(): string {
    return kind === "jsx" ? stripOids(code).source : code;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(exportSource());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      showWarn(
        e instanceof Error
          ? `Copy failed: ${e.message}`
          : "Copy failed: clipboard unavailable",
      );
    }
  }

  function handleDownload() {
    const ext = kind === "html" ? "html" : "jsx";
    const name = `${filename || "dropin"}.${ext}`;
    const mime = kind === "html" ? "text/html" : "text/jsx";
    const blob = new Blob([exportSource()], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    // Renders inside ToolBar's right slot — no wrapper styling needed; just
    // a fragment-like flex container so the segmented groups + buttons sit
    // side by side. gap-4 gives the four groups (Language / Apply / Viewport
    // / Expand+Copy+Download) noticeable breathing room. The outer ToolBar
    // already supplies bg-paper + padding.
    <div className="flex flex-wrap items-center gap-4">
      {urlKindToggle ? (
        <KindToggle current={kind} size="small" />
      ) : allowKindToggle ? (
        <div
          className="inline-flex overflow-hidden border-2 border-ink"
          role="group"
          aria-label="Language"
        >
          {(["jsx", "html"] as PreviewKind[]).map((k, i) => {
            const active = k === kind;
            return (
              <button
                key={k}
                type="button"
                onClick={() => onKindChange(k)}
                className={
                  SEG_BTN +
                  " " +
                  (active
                    ? "bg-coral text-paper"
                    : "bg-paper text-ink hover:bg-soft") +
                  (i > 0 ? " border-l-2 border-ink" : "")
                }
                aria-pressed={active}
              >
                {k.toUpperCase()}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        className="inline-flex overflow-hidden border-2 border-ink"
        role="group"
        aria-label="Viewport — also drives the inspector's class breakpoint prefix"
        title="Viewport — drives both the preview width and the inspector's class prefix (mobile = sm:, tablet = md:, desktop = none)"
      >
        {VIEWPORTS_LIST.map((v, i) => {
          const active = v.id === viewport;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onViewportChange(v.id)}
              className={
                SEG_BTN +
                " gap-1.5 " +
                (active
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-soft") +
                (i > 0 ? " border-l-2 border-ink" : "")
              }
              aria-pressed={active}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {/* 2026-05-15 — Undo / Redo surfaced as visible buttons. The
            Cmd+Z / Cmd+Y keybindings still work (and the discoverable-
            shortcut is part of the tooltip); the buttons exist for
            vibecoders who don't know the keyboard pattern. Segmented
            into one inline-flex shell so they sit as a single visual
            unit, matching the rest of the action row. */}
        <div
          className="inline-flex overflow-hidden border-2 border-ink"
          role="group"
          aria-label="History"
        >
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (⌘Z) — step back one change"
            aria-label="Undo"
            className={
              SEG_BTN +
              " gap-1.5 " +
              (canUndo
                ? "bg-paper text-ink hover:bg-ink hover:text-paper"
                : "bg-paper text-muted opacity-40 cursor-not-allowed")
            }
          >
            <UndoGlyph />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (⇧⌘Z) — step forward one change"
            aria-label="Redo"
            className={
              SEG_BTN +
              " gap-1.5 border-l-2 border-ink " +
              (canRedo
                ? "bg-paper text-ink hover:bg-ink hover:text-paper"
                : "bg-paper text-muted opacity-40 cursor-not-allowed")
            }
          >
            <RedoGlyph />
            <span>Redo</span>
          </button>
          {/* 2026-05-15 — Reset: wipe all changes back to the original
              template. Sits third in the History group, only enabled
              when there's something to wipe. Confirmation prompt at
              the handler level — no accidental nukes. */}
          <button
            type="button"
            onClick={onReset}
            disabled={!canUndo}
            title="Reset — discard ALL changes, restore the original template (confirmed)"
            aria-label="Reset template"
            className={
              SEG_BTN +
              " gap-1.5 border-l-2 border-ink " +
              (canUndo
                ? "bg-paper text-ink hover:bg-ink hover:text-paper"
                : "bg-paper text-muted opacity-40 cursor-not-allowed")
            }
          >
            <ResetGlyph />
            <span>Reset</span>
          </button>
        </div>
        {/* Each standalone button wrapped in the same `inline-flex border-2`
            shell as the segmented groups so the outer box matches exactly
            (h-9 button + wrapper's 4px borders = same outer height across
            every action group on the row). */}
        <div className="inline-flex overflow-hidden border-2 border-ink">
          <button
            type="button"
            onClick={onExpand}
            title="Open fullscreen preview"
            className={
              SEG_BTN + " gap-1.5 bg-paper text-ink hover:bg-ink hover:text-paper"
            }
          >
            <ExpandGlyph />
            <span>Expand</span>
          </button>
        </div>
        <div className="inline-flex overflow-hidden border-2 border-ink">
          <button
            type="button"
            onClick={handleCopy}
            className={
              SEG_BTN +
              " gap-1.5 " +
              (copied
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-ink hover:text-paper")
            }
          >
            <CopyGlyph />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <div className="inline-flex overflow-hidden border-2 border-ink">
          <button
            type="button"
            onClick={handleDownload}
            className={
              SEG_BTN + " gap-1.5 bg-paper text-ink hover:bg-ink hover:text-paper"
            }
          >
            <DownloadGlyph />
            <span>Download</span>
          </button>
        </div>
        {/* 2026-05-15 — "What's next?" — vibecoder helper. Coral background
            so it reads as the "next thing to try" instead of a peer of
            the chrome buttons. Sits at the end of the action row where
            the eye lands after Download. */}
        <div className="inline-flex overflow-hidden border-2 border-ink">
          <button
            type="button"
            onClick={onOpenWhatsNext}
            title="What can you do with this template? Copy, iterate with AI, host it online."
            className={
              SEG_BTN +
              " gap-1.5 bg-coral text-paper hover:bg-ink"
            }
          >
            <WhatsNextGlyph />
            <span>What's next?</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PaneTabs({
  activePane,
  onSelect,
}: {
  activePane: Pane;
  onSelect: (p: Pane) => void;
}) {
  const tabs: { id: Pane; label: string }[] = [
    { id: "editor", label: "Editor" },
    { id: "preview", label: "Preview" },
  ];
  return (
    <div
      className="flex shrink-0 overflow-x-auto border-b-2 border-ink bg-paper lg:hidden"
      role="tablist"
      aria-label="Pane"
    >
      {tabs.map((t, i) => {
        const active = t.id === activePane;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(t.id)}
            className={
              "flex-1 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors " +
              (active
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-soft") +
              (i > 0 ? " border-l-2 border-ink" : "")
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
