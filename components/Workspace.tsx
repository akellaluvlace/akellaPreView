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
import FirstOpenTour from "./FirstOpenTour";
import KindToggle from "./KindToggle";
import ComponentLibrarySidebar from "./library/Sidebar";
import WorkspaceLeftRail from "./WorkspaceLeftRail";
import ResizablePanel from "./ResizablePanel";
import ElementTree from "./ElementTree";
import PreviewModal from "./PreviewModal";
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
import { planEverywhereSwap } from "@/lib/swap/plan-everywhere-swap";
import { findAllInstancesOfDefinition } from "@/lib/ast/instance-graph";
import type { SlotEnvelope } from "@/lib/swap/slot-capacity";
import { inferSwapCategory } from "@/lib/swap-category-hint";
import { applyPalette } from "@/lib/ast/operations/palette";
import { collectDescendantOids } from "@/lib/ast/scope";
import { findInlineComponentDefRootOid } from "@/lib/ast/component-def";
import { findCrossFileDefinition } from "@/lib/ast/cross-file-query";
import { createEdit } from "@/lib/edits/operations";
import { patchJsxClassByOid } from "@/lib/ast/patch-class-by-oid";
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
  patchHtmlRemoveAttr,
  patchHtmlText,
} from "@/lib/source-patch-html";
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
    applyEditDirect,
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
  // Default to 'vibe' (the new no-code edit mode) so vibecoders land
  // on the click-to-edit flow without needing to know what the other
  // tools do. Power users can switch to select/move/insert/swap and
  // their choice persists. Pre-vibe sessions had View as the default.
  const [tool, setToolState] = useState<Tool>("vibe");
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("dropin:tool");
      // Migrate returning users persisted on the now-hidden Select
      // tool to Vibe so they don't end up in a state with no toolbar
      // button matching their persisted choice.
      if (stored === "select") {
        setToolState("vibe");
        try {
          window.localStorage.setItem("dropin:tool", "vibe");
        } catch {
          // ignore
        }
        return;
      }
      if (
        stored === "view" ||
        stored === "move" ||
        stored === "insert" ||
        stored === "swap" ||
        stored === "vibe"
      ) {
        setToolState(stored);
      }
    } catch {
      // localStorage unavailable; stick with the default.
    }
  }, []);
  const setTool = useCallback((next: Tool) => {
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
  // Phase E proper — swap-time slot envelope cache. When the user enters
  // Swap mode with a live selection, an effect below fetches the parent
  // envelope via the iframe channel and caches it here so the LibraryModal
  // compatibility filter can classify each asset against the slot before
  // the user picks one. Cleared on tool exit / selection change /
  // selection clear. Null when the iframe hasn't measured yet (modal
  // falls back to "all unknown" = default-allow).
  const [swapEnvelope, setSwapEnvelope] = useState<SlotEnvelope | null>(null);
  // Vibe-edit selection. Owned by Workspace because the panel (right
  // side) and the source-reconciliation effect both need it. The
  // info object IS the snapshot — Workspace doesn't track a separate
  // "edited but not committed" version; the iframe DOM holds that
  // (mutations land via postVibe), and `info` is the most recent
  // echo of the live element's values.
  const [vibeInfo, setVibeInfo] = useState<VibeElementInfo | null>(null);
  // Snapshot of the last vibeInfo we successfully reconciled to
  // source. When vibeInfo's mutable fields drift away from this
  // snapshot, the idle-debounce effect runs buildVibeCommit. Reset
  // when the user picks a different element (path changes).
  const lastVibeCommitRef = useRef<VibeElementInfo | null>(null);
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
  //   · Swap context is derived from `selection.oid` when tool === "swap"
  //     — no separate stash; the toolbar disables Swap when no
  //     selection, and switching to Swap with a live selection opens
  //     the library scoped to that element.
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
  // Phase 5 / Phase C / C3 — propagation toggle. When "instance",
  // edits affect only the clicked element (current behaviour). When
  // "everywhere", edits also propagate to the inline component
  // definition for capitalized JSX tags within the same source file.
  // Persists per-tab in localStorage. Default "instance".
  const [propagationMode, setPropagationModeState] = useState<
    "instance" | "everywhere"
  >("instance");
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("dropin:propagation");
      if (stored === "instance" || stored === "everywhere") {
        setPropagationModeState(stored);
      }
    } catch {
      // localStorage unavailable; stick with the default.
    }
  }, []);
  const setPropagationMode = useCallback(
    (next: "instance" | "everywhere") => {
      setPropagationModeState(next);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("dropin:propagation", next);
        } catch {
          // ignore
        }
      }
    },
    []
  );
  // Code/Tree/Library panels are mutually exclusive (only one open at a
  // time, see the rail-button handlers below) and never persist — every
  // entry into the workspace lands on the bare rendered preview.
  const [editorHidden, setEditorHidden] = useState<boolean>(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);
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
  // Phase E proper — fetch the slot envelope whenever the user enters
  // Swap mode with a live selection. The cached envelope feeds the
  // LibraryModal compatibility filter so each asset's static-analysis
  // capacity can be checked against the slot. Best-effort: if the iframe
  // hasn't booted, the read times out, or the parent has no measurable
  // box, the cache stays null and the filter degrades to "unknown for
  // everything" (which is default-allow per `classifyAssets`).
  //
  // Re-runs whenever `tool` or `selection.oid` changes — exiting swap
  // clears it, picking a different element re-fetches.
  useEffect(() => {
    const targetOid = selection?.oid ?? null;
    if (tool !== "swap" || !targetOid) {
      setSwapEnvelope(null);
      return;
    }
    const handle = previewHandleRef.current;
    if (!handle) {
      setSwapEnvelope(null);
      return;
    }
    let cancelled = false;
    handle
      .requestEnvelope(targetOid)
      .then((readback) => {
        if (cancelled) return;
        if (!readback) {
          setSwapEnvelope(null);
          return;
        }
        setSwapEnvelope(
          composeEnvelopeFromBbox(parentBoxFromRect(readback.parent)),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setSwapEnvelope(null);
      });
    return () => {
      cancelled = true;
    };
  }, [tool, selection?.oid]);

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
      let nextSource = result.source;
      // Phase 5 / Phase C / C3 — single-file inline propagation.
      // Phase D — cross-file propagation when no inline def exists.
      //
      // When `propagationMode === "everywhere"` AND the edit lands on a
      // capitalized JSX tag (component instance), try to also patch the
      // component's definition. Two paths:
      //
      //   1. **Inline def** (single-file, today's behavior): the
      //      definition lives in the same file as the call site — fire a
      //      second `patchJsxClassByOid` on the same source, both edits
      //      land in one setCode below. One Cmd-Z reverts both.
      //
      //   2. **Cross-file def** (Phase D): the definition lives in a
      //      different file (`import Card from './Card'`). Resolve via
      //      `findCrossFileDefinition`, build a multi-file Edit with two
      //      FileDiffs (call-site + def file), commit via
      //      `applyEditDirect`. One atomic undo/redo entry spans both
      //      files. Bails (with toast) on HOC / class component /
      //      re-export / non-relative import / unresolvable spec.
      //
      // Whichever path matches, we apply EXACTLY ONE write (setCode for
      // single-file path, applyEditDirect for cross-file path). The
      // cross-file path returns early so the trailing setCode doesn't
      // double-fire.
      let crossFileApplied = false;
      if (
        propagationMode === "everywhere" &&
        loc.kind === "jsx" &&
        kind === "jsx"
      ) {
        const sel = selectionRef.current;
        const tag = sel?.tag ?? "";
        if (tag && /^[A-Z]/.test(tag)) {
          const inlineDefOid = findInlineComponentDefRootOid(nextSource, tag);
          if (inlineDefOid) {
            // Single-file inline definition. Skip when instance and
            // definition share an OID (means we're editing the def itself).
            if (inlineDefOid !== sel?.oid) {
              const defPatch = patchJsxClassByOid(
                nextSource,
                inlineDefOid,
                newClass
              );
              if (defPatch.changed) {
                nextSource = defPatch.source;
                showInfo(`Applied to <${tag}> definition`);
              } else if (defPatch.reason && defPatch.reason !== "no change") {
                log("propagation: definition patch bailed", {
                  tag,
                  defRootOid: inlineDefOid,
                  reason: defPatch.reason,
                });
              }
            }
          } else {
            // No inline definition — try cross-file.
            const crossDef = findCrossFileDefinition(project, activeFileId, tag);
            if (crossDef.ok) {
              const defFile = getFile(project, crossDef.def.fileId);
              if (defFile) {
                const defPatch = patchJsxClassByOid(
                  defFile.source,
                  crossDef.def.rootOid,
                  newClass
                );
                if (defPatch.changed) {
                  // Build multi-file Edit. The call-site diff carries the
                  // post-`patchJsxClass` source; the def diff carries the
                  // post-`patchJsxClassByOid` source. before/after pairs
                  // are validated by applyEdit's two-phase atomicity check.
                  const editResult = createEdit({
                    diffs: [
                      {
                        fileId: activeFileId,
                        before: code,
                        after: nextSource,
                      },
                      {
                        fileId: crossDef.def.fileId,
                        before: defFile.source,
                        after: defPatch.source,
                      },
                    ],
                    reason: `everywhere-cross-file:<${tag}>`,
                  });
                  if (editResult.ok && applyEditDirect(editResult.edit)) {
                    showInfo(
                      `Applied to <${tag}> across ${defFile.path}`,
                    );
                    crossFileApplied = true;
                  } else if (!editResult.ok) {
                    log("propagation: createEdit failed", {
                      tag,
                      reason: editResult.error,
                    });
                  }
                  // applyEditDirect's failure already surfaces via onError.
                } else if (defPatch.reason && defPatch.reason !== "no change") {
                  log("propagation: cross-file def patch bailed", {
                    tag,
                    defFileId: crossDef.def.fileId,
                    reason: defPatch.reason,
                  });
                }
              }
            } else if (
              crossDef.reason &&
              !crossDef.reason.includes("not imported")
            ) {
              // "not imported" is the common case for top-level elements
              // (the user is editing a tag that has no cross-file def).
              // Surface the OTHER reasons (HOC / re-export / non-relative /
              // unresolvable) so the user knows why everywhere mode bailed.
              showWarn(`Everywhere mode: ${crossDef.reason}`);
            }
          }
        }
      }
      if (!crossFileApplied) {
        setCode(nextSource);
      }
      setSelection((s) => {
        if (!s) return s;
        const trimmed = newClass.trim();
        return {
          ...s,
          classes: trimmed.length ? trimmed.split(/\s+/) : [],
        };
      });
    },
    [
      code,
      kind,
      propagationMode,
      project,
      activeFileId,
      setCode,
      applyEditDirect,
      showInfo,
      showWarn,
    ],
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

  // Phase 3 — reorder commit. Routes the position-handle drag's
  // same-parent drop through `applyReorder`. Returns true iff source
  // changed; gesture overlay reads the boolean to decide whether to
  // clear the optimistic Track A live-stylesheet rule (clear on bail).
  const handleReorder = useCallback(
    (oid: string, parentOid: string, toIndex: number): boolean => {
      if (kind !== "jsx") return false;
      const result = applyReorder(code, { oid, parentOid, toIndex });
      if (result.unchanged) {
        if (result.reason) {
          log("reorder bailed", { oid, parentOid, toIndex, reason: result.reason });
          showWarn(`Reorder: ${result.reason}`);
        }
        return false;
      }
      setCode(result.source);
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
      if (kind !== "jsx") return false;
      const result = applyReparent(code, {
        oid,
        newParentOid,
        insertIndex,
        propsToRemove,
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

      // Phase F — everywhere-mode swap. When propagationMode is
      // "everywhere" AND the selection is a component instance
      // (capitalized tag), pre-flight every call site's envelope
      // against the new asset's capacity and replace the def's body
      // atomically. Q10 locked: any envelope failure aborts the swap
      // (no partial commit). Falls through to single-instance flow on
      // skip / no def resolution.
      const sel = selectionRef.current;
      const selTag = sel?.tag ?? "";
      if (
        propagationMode === "everywhere" &&
        selTag &&
        /^[A-Z]/.test(selTag)
      ) {
        // Find all instances first so we know which OIDs need envelopes.
        // We only fetch envelopes for instances in the entry file (the
        // currently-rendered iframe). Cross-file instances stay
        // unmeasured → preflight reports them in `missingEnvelope` and
        // aborts atomically.
        const inlineDefOid = findInlineComponentDefRootOid(code, selTag);
        let defFileIdF = activeFileId;
        let defRootOidF: string | null = null;
        if (inlineDefOid) {
          defRootOidF = inlineDefOid;
        } else {
          const cross = findCrossFileDefinition(project, activeFileId, selTag);
          if (cross.ok) {
            defFileIdF = cross.def.fileId;
            defRootOidF = cross.def.rootOid;
          }
        }
        if (defRootOidF) {
          const instGraph = findAllInstancesOfDefinition(
            project,
            defFileIdF,
            defRootOidF,
          );
          if (instGraph.ok) {
            const envMap = new Map<string, SlotEnvelope | null>();
            const entryFileIdLocal = project.entryFileId;
            if (handle) {
              const measurable = instGraph.instances.filter(
                (i) => i.fileId === entryFileIdLocal,
              );
              await Promise.all(
                measurable.map(async (inst) => {
                  try {
                    const r = await handle.requestEnvelope(inst.oid);
                    if (r) {
                      envMap.set(
                        inst.oid,
                        composeEnvelopeFromBbox(parentBoxFromRect(r.parent)),
                      );
                    } else {
                      envMap.set(inst.oid, null);
                    }
                  } catch {
                    envMap.set(inst.oid, null);
                  }
                }),
              );
            }
            const plan = planEverywhereSwap(
              project,
              activeFileId,
              code,
              targetOid,
              selTag,
              jsx,
              !!preserveChildren,
              {
                envelopeForInstance: (inst) => envMap.get(inst.oid) ?? null,
              },
            );
            if (plan.kind === "abort-preflight") {
              log("swap everywhere aborted by preflight", {
                summary: plan.summary,
              });
              showWarn(`Swap (everywhere): ${plan.summary}`);
              setTool("select");
              return;
            }
            if (plan.kind === "abort-bail") {
              log("swap everywhere aborted by applySwap", {
                reason: plan.reason,
              });
              showWarn(`Swap (everywhere): ${plan.reason}`);
              setTool("select");
              return;
            }
            if (plan.kind === "ok") {
              if (applyEditDirect(plan.edit)) {
                showInfo(
                  `Swapped <${plan.tag}> across ${plan.affectedCount} instance${
                    plan.affectedCount === 1 ? "" : "s"
                  }`,
                );
              }
              setTool("select");
              return;
            }
            // plan.kind === "skip" → fall through to single-instance.
            log("swap everywhere skipped", { reason: plan.reason });
          }
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
      const result = applyPalette(code, { palette, scope });
      if (result.unchanged) {
        if (result.reason) {
          log("palette bailed", { paletteId, reason: result.reason });
          showWarn(`Palette: ${result.reason}`);
        }
        return;
      }
      setCode(result.source);
      showInfo(`Applied ${palette.name}`);
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
  const handleVibeSelected = useCallback((info: VibeElementInfo) => {
    setVibeInfo(info);
  }, []);

  const handleVibeCleared = useCallback(() => {
    setVibeInfo(null);
    lastVibeCommitRef.current = null;
  }, []);

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

  const handleVibeClose = useCallback(() => {
    previewHandleRef.current?.postVibe({ type: "vibe:clear" });
    setVibeInfo(null);
    lastVibeCommitRef.current = null;
  }, []);

  // Tool-change cleanup: leaving vibe mode wipes vibe state and
  // tells the iframe to drop the [data-vibe-selected] outline.
  useEffect(() => {
    if (tool !== "vibe" && vibeInfo) {
      previewHandleRef.current?.postVibe({ type: "vibe:clear" });
      setVibeInfo(null);
      lastVibeCommitRef.current = null;
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
      (vibeInfo.inlineStyle ?? "") !== (last.inlineStyle ?? "");
    if (!drifted) return;

    const id = setTimeout(() => {
      const result = buildVibeCommit({
        mode: kind,
        source: code,
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
        },
      });
      if (!result.unchanged) {
        setCodeSilent(result.source);
        lastVibeCommitRef.current = vibeInfo;
      }
    }, 600);
    return () => clearTimeout(id);
  }, [vibeInfo, code, kind, setCodeSilent]);

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
      // Phase 5 / Phase C — Swap tool flow. Entering Swap with a live
      // selection opens the library with swapContext (built JIT from
      // selectionRef in the JSX below). The toolbar already disables
      // Swap when no selection so this branch is a safe one-liner.
      if (next === "swap") {
        if (selectionRef.current?.oid) {
          setLibraryOpen(true);
        }
      } else if (prev === "swap") {
        // Leaving Swap — close the library if it was opened by the
        // swap entry. Cheap to always close on swap exit; user can
        // Cmd+J to reopen for a free-form library browse.
        // No-op for now; library stays as the user left it. If users
        // complain about the library hanging open after a swap commit,
        // flip this to setLibraryOpen(false).
      }
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
      else if (k === "m") next = "move";
      else if (k === "i") next = "insert";
      else if (k === "w") next = "swap";
      if (!next) return;
      // Swap requires a selection — fall through to no-op (don't
      // preventDefault) so the user's "w" tap doesn't feel
      // unresponsive when they haven't selected an element yet.
      if (next === "swap" && !selection?.oid) return;
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
    <div className="flex h-screen flex-col bg-paper">
      <WorkspaceHeader title={title} subtitle={subtitle} />

      <ToolBar
        tool={tool}
        onToolChange={handleToolChange}
        hasSelection={Boolean(selection?.oid)}
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
          propagationMode={propagationMode}
          onPropagationModeChange={setPropagationMode}
          onExpand={() => setPreviewExpanded(true)}
          showWarn={showWarn}
        />
      </ToolBar>

      <PaneTabs activePane={activePane} onSelect={setActivePane} />

      <div className="flex min-h-0 flex-1">
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

        {treeOpen && <ElementTree
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
        />}

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
              swapContext={
                tool === "swap" && selection?.oid
                  ? (() => {
                      const hint = inferSwapCategory(
                        selection.tag,
                        selection.classes,
                      );
                      return {
                        targetOid: selection.oid,
                        targetTag: selection.tag,
                        suggestedPanel: hint?.panel ?? null,
                        suggestedCategory: hint?.category ?? null,
                        slotEnvelope: swapEnvelope,
                      };
                    })()
                  : null
              }
              onSwapWith={handleSwap}
              onCancelSwap={handleCancelSwap}
              onApplyPalette={handleApplyPalette}
            />
          </ResizablePanel>
        )}

        {tool === "vibe" && (
          <VibePropertiesPanel
            info={vibeInfo}
            onContentChange={handleVibeContent}
            onStyleChange={handleVibeStyle}
            onImageChange={handleVibeImage}
            onLinkChange={handleVibeLink}
            onClose={handleVibeClose}
          />
        )}
      </div>

      {previewExpanded && (
        <PreviewModal
          code={entryCode}
          kind={kind}
          initialViewport={viewport}
          filename={filename}
          onClose={() => setPreviewExpanded(false)}
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
          swapContext={
            tool === "swap" && selection?.oid
              ? (() => {
                  // Thirty-third-pass — auto-category routing. Compute
                  // the hint from tag + classes; null when no confident
                  // mapping exists. Sidebar reads suggestedPanel +
                  // suggestedCategory and routes to the matching tab +
                  // pre-fills the filter for this swap session.
                  const hint = inferSwapCategory(
                    selection.tag,
                    selection.classes,
                  );
                  return {
                    targetOid: selection.oid,
                    targetTag: selection.tag,
                    suggestedPanel: hint?.panel ?? null,
                    suggestedCategory: hint?.category ?? null,
                    // Phase E proper — slot envelope cached by the
                    // tool/selection effect. Drives the LibraryModal
                    // compatibility filter (dim + sort + counts) so the
                    // user sees which assets fit before they pick one.
                    slotEnvelope: swapEnvelope,
                  };
                })()
              : null
          }
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
          className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 border-2 border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper shadow-[4px_4px_0_0_#FF4D2E]"
          role="status"
        >
          {rollToast.icon} {rollToast.text}
        </div>
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
    <header className="flex shrink-0 flex-wrap items-center gap-4 border-b-2 border-ink px-4 py-3 md:px-6">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:text-coral"
      >
        ← Dropin
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
  propagationMode,
  onPropagationModeChange,
  onExpand,
  showWarn,
}: {
  allowKindToggle: boolean;
  urlKindToggle: boolean;
  kind: PreviewKind;
  onKindChange: (k: PreviewKind) => void;
  code: string;
  filename?: string;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  propagationMode: "instance" | "everywhere";
  onPropagationModeChange: (m: "instance" | "everywhere") => void;
  onExpand: () => void;
  showWarn: (msg: string) => void;
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
        aria-label="Apply scope — instance or component-wide"
        title={
          kind === "jsx"
            ? "Apply: edits affect only this element (instance) or every instance via the component definition (everywhere)"
            : "Apply scope only applies to JSX templates — HTML pages have no component definitions to ripple changes through."
        }
      >
        {(["instance", "everywhere"] as const).map((m, i) => {
          const active = m === propagationMode;
          const disabled = kind !== "jsx";
          return (
            <button
              key={m}
              type="button"
              onClick={() => {
                if (disabled) return;
                onPropagationModeChange(m);
              }}
              disabled={disabled}
              aria-disabled={disabled}
              className={
                SEG_BTN +
                " " +
                (disabled
                  ? "cursor-not-allowed bg-paper text-ink opacity-40"
                  : active
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink hover:bg-soft") +
                (i > 0 ? " border-l-2 border-ink" : "")
              }
              aria-pressed={!disabled && active}
            >
              {m}
            </button>
          );
        })}
      </div>

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
