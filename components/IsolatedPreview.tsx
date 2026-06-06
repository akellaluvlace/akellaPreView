"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildPreviewDocument, type PreviewKind } from "@/lib/preview";
import type { ElementLoc, HostToIframeMessage, Tool } from "@/lib/iframe-bridge";
import { isIframeMessage } from "@/lib/iframe-bridge";

interface IsolatedPreviewProps {
  code: string;
  kind: PreviewKind;
  loc: ElementLoc;
  mode: "isolated" | "in-page";
  // Phase 5 / Phase B — active tool. Pushed to the iframe via
  // `dropin:set-tool` on every change AND replayed on every
  // `dropin:ready` so iframe rebuilds re-receive the canonical value.
  // Optional: defaults to 'select' to preserve pre-Phase-5 behaviour
  // when callers don't provide it.
  tool?: Tool;
  // ROADMAP §3.5 polish — preset hover preview. When non-null,
  // IsolatedPreview posts `dropin:hover-preview` to the iframe so the
  // selected element repaints with the proposed Tailwind tokens. When
  // it transitions back to null, posts `dropin:hover-clear` so the
  // iframe restores the stashed original className. Owned by
  // FocusEditor — PresetTile mouseenter/leave drives the prop.
  hoverPreview?: { oid: string; classes: ReadonlyArray<string> } | null;
  // Phase 5 / Phase C / C1.4 — Insert tool target confirmation inside
  // FocusEditor. Iframe emits dropin:insert-target-confirmed on click
  // while DROPIN_TOOL === 'insert' (after hit-testing the cursor against
  // an eligible container). FocusEditor pipes this up to Workspace's
  // handleInsertTargetConfirmed via prop drilling so the LibraryModal
  // opens scoped to the picked parent. Optional — when omitted, the
  // iframe still emits and the host discards the message. The optional
  // `additive` flag (true when shift-click) lets the host accumulate
  // multi-target insert lists.
  onInsertTarget?: (oid: string, tag: string, additive?: boolean) => void;
}

// A second preview iframe used inside FocusEditor. Lifecycle:
//   1. srcDoc loads → iframe runtime posts `dropin:ready`
//   2. we post `dropin:reselect` with the current loc
//   3. the iframe finds the element (may retry for up to ~500 ms) and echoes
//      `dropin:select` back — THAT is our cue that `[data-dropin-selected]`
//      has been painted in the DOM
//   4. only then do we apply the focus CSS + hide/dim siblings
//
// Applying the chrome synchronously after posting reselect (the previous
// behaviour) queried `[data-dropin-selected]` before the iframe had a chance
// to set it — the isolation never appeared. Waiting for the echo fixes that.
// Mode changes reuse the existing selection and just re-apply the chrome.
export default function IsolatedPreview({
  code,
  kind,
  loc,
  mode,
  tool = "select",
  hoverPreview,
  onInsertTarget,
}: IsolatedPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const [debouncedCode, setDebouncedCode] = useState(code);
  const [debouncedKind, setDebouncedKind] = useState(kind);
  // Phase 5 / Phase B — keep the latest tool on a ref so the
  // dropin:ready handler (which has a stable identity wired through
  // `applyFocusChromeRef`) can replay the canonical value into a fresh
  // iframe regardless of when the prop's effect last ran.
  const toolRef = useRef<Tool>(tool);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  // Phase 5 / Phase C / C1.4 — same ref pattern Preview.tsx uses so
  // the empty-deps message handler always invokes the freshest version
  // of the prop (callers tend to re-bind the function each render).
  const onInsertTargetRef = useRef(onInsertTarget);
  useEffect(() => {
    onInsertTargetRef.current = onInsertTarget;
  }, [onInsertTarget]);

  // 250ms felt sluggish — a single class edit produced a quarter-
  // second freeze before the iframe rebuilt. 100ms still coalesces
  // a slider drag (which fires many adjacent setCode calls) into one
  // rebuild but lands fast enough that an end-of-gesture commit
  // doesn't read as a separate "glitch".
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedCode(code);
      setDebouncedKind(kind);
    }, 100);
    return () => clearTimeout(id);
  }, [code, kind]);

  const srcDoc = useMemo(
    () => buildPreviewDocument({ code: debouncedCode, kind: debouncedKind }),
    [debouncedCode, debouncedKind]
  );

  useEffect(() => {
    readyRef.current = false;
  }, [srcDoc]);

  const post = useCallback((msg: HostToIframeMessage) => {
    const frame = iframeRef.current;
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ __dropin: true, ...msg }, "*");
  }, []);

  // Paint the focus chrome in the iframe's contentDocument. Assumes the
  // target element already has `data-dropin-selected` set by the iframe
  // runtime — caller must only invoke this AFTER a `dropin:select` echo.
  const applyFocusChrome = useCallback(() => {
    const frame = iframeRef.current;
    if (!frame || !frame.contentDocument) return;
    const doc = frame.contentDocument;

    const styleId = "__dropin_focus_style";
    let style = doc.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      // doc.head can be null briefly between iframe srcDoc swap and parse-
      // complete. Fall back to documentElement (then re-bail) so we don't
      // crash on the appendChild — caller will retry on the next ready echo.
      const host = doc.head || doc.documentElement;
      if (!host) return;
      style = doc.createElement("style");
      style.id = styleId;
      host.appendChild(style);
    }
    // Phase 5 / A7: in isolated mode the iframe body becomes a flex centering
    // container so short-document targets (navbar at the top, footer with no
    // siblings below) land at viewport center even when the document is
    // shorter than the viewport — scrollIntoView alone can't push something
    // past the natural top. In in-page mode we keep the page's normal flow
    // because the dimmed siblings provide spatial context the user wants.
    const centeringRules =
      mode === "isolated"
        ? `
      body {
        min-height: 100vh !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 24px !important;
        box-sizing: border-box !important;
      }
      body > *:not([data-dropin-hidden]):not([data-dropin-dimmed]) {
        margin: auto !important;
      }
    `
        : "";
    style.textContent = `
      [data-dropin-hidden] { display: none !important; }
      [data-dropin-dimmed] { opacity: 0.22 !important; filter: saturate(0.4) !important; transition: opacity 150ms, filter 150ms; }
      [data-dropin-selected] {
        outline: 3px solid #FF4D2E !important;
        outline-offset: 4px !important;
      }
      body { background: #F5F1EA !important; }
      ${centeringRules}
    `;

    doc.querySelectorAll("[data-dropin-hidden]").forEach((e) =>
      e.removeAttribute("data-dropin-hidden")
    );
    doc.querySelectorAll("[data-dropin-dimmed]").forEach((e) =>
      e.removeAttribute("data-dropin-dimmed")
    );

    const selected = doc.querySelector(
      "[data-dropin-selected]"
    ) as HTMLElement | null;
    if (!selected) return;

    // In-page mode shows the page exactly as it renders live — no
    // dimming, no hiding. The selected element gets only the coral
    // outline from `[data-dropin-selected]`. Sibling chrome is the
    // explicit "isolated" mode's job; users can still toggle to it
    // via the view-mode switcher when they want focus context.
    if (mode === "isolated") {
      let cur: HTMLElement | null = selected;
      while (cur && cur !== doc.body && cur !== doc.documentElement) {
        const parentEl: HTMLElement | null = cur.parentElement;
        if (!parentEl) break;
        for (let i = 0; i < parentEl.children.length; i++) {
          const sib = parentEl.children[i] as HTMLElement;
          if (
            sib !== cur &&
            sib.tagName !== "SCRIPT" &&
            sib.tagName !== "STYLE" &&
            sib.id !== "__err"
          ) {
            sib.setAttribute("data-dropin-hidden", "");
          }
        }
        cur = parentEl;
      }
    }

    // Scroll the target into view (double-fire to catch late-layout templates).
    const scrollTo = () => {
      if (!frame.contentDocument) return;
      const sel = frame.contentDocument.querySelector(
        "[data-dropin-selected]"
      ) as HTMLElement | null;
      if (!sel) return;
      sel.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    };
    setTimeout(scrollTo, 80);
    setTimeout(scrollTo, 300);
  }, [mode]);

  // Single message handler — stable across renders via refs to the latest
  // loc and chrome fn so listener identity doesn't thrash.
  const locRef = useRef(loc);
  useEffect(() => {
    locRef.current = loc;
  }, [loc]);

  const applyFocusChromeRef = useRef(applyFocusChrome);
  useEffect(() => {
    applyFocusChromeRef.current = applyFocusChrome;
  }, [applyFocusChrome]);

  // Replay host state into a freshly-loaded iframe (active tool +
  // reselect). Same handshake-race fix as Preview.tsx (2026-05-25): the
  // iframe posts `dropin:ready` ONCE via setTimeout(0); if this window's
  // message listener wasn't attached yet, that message is missed,
  // readyRef stays false, set-tool never lands, DROPIN_TOOL stays 'view',
  // and focus-mode editing dies. Calling this from the iframe's onLoad
  // DOM event (fires after the runtime + its listener exist) closes the
  // race. readyRef-guarded → runs once per load epoch (reset on srcDoc
  // rebuild) regardless of which signal arrives first.
  // Runs on EVERY ready/onLoad — no de-dupe guard (see the matching note in
  // Preview.tsx: an srcDoc-identity guard starved the live document when the
  // poll elicited a ready from a transitioning one). Re-sync is idempotent.
  const markReadyAndReplay = useCallback(
    (reason: string) => {
      readyRef.current = true;
      // Tool first so DROPIN_TOOL is canonical before the reselect's
      // matching click goes through dropinSetSelected.
      post({ type: "dropin:set-tool", tool: toolRef.current });
      post({ type: "dropin:reselect", loc: locRef.current });
      void reason;
    },
    [post]
  );

  useEffect(() => {
    function handler(ev: MessageEvent) {
      // Mirror Preview's source check — the main preview iframe lives in the
      // same window and would otherwise drive our applyFocusChrome on every
      // user click out there.
      const frame = iframeRef.current;
      if (!frame || ev.source !== frame.contentWindow) return;
      if (!isIframeMessage(ev.data)) return;
      const d = ev.data;
      if (d.type === "dropin:ready") {
        // Guarded — no-op if the onLoad fallback already replayed.
        markReadyAndReplay("dropin:ready message");
      } else if (d.type === "dropin:select") {
        // Iframe confirms the element is now marked selected — paint chrome.
        applyFocusChromeRef.current();
      } else if (d.type === "dropin:insert-target-confirmed") {
        // Phase 5 / Phase C / C1.4 — Insert tool inside isolated mode.
        // Iframe hit-tested an eligible container under the cursor and
        // posted the resolved oid + tag. Forward to FocusEditor (which
        // forwards to Workspace) so the LibraryModal opens with the
        // matching insertContext. Same dispatch pattern as Preview.tsx.
        if (onInsertTargetRef.current) {
          onInsertTargetRef.current(d.oid, d.tag, d.additive);
        }
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [post, markReadyAndReplay]);

  // HANDSHAKE POLL (2026-05-25) — same reliable readiness signal as
  // Preview.tsx. The iframe's one-shot dropin:ready / onLoad both lose the
  // mount-ordering race; poll dropin:request-ready until it answers, then
  // stop. Without this, focus-mode editing dies the same way (DROPIN_TOOL
  // stuck 'view'). Bounded: stops on ready, ~3s cap, re-armed per srcDoc.
  useEffect(() => {
    let tries = 0;
    post({ type: "dropin:request-ready" });
    const id = setInterval(() => {
      if (readyRef.current || tries++ > 30) {
        clearInterval(id);
        return;
      }
      post({ type: "dropin:request-ready" });
    }, 100);
    return () => clearInterval(id);
  }, [srcDoc, post]);

  // Phase 5 / Phase B — live-push tool changes while the iframe is
  // alive. Mirrors the Preview.tsx pattern. Iframe rebuilds wipe the
  // module-level `DROPIN_TOOL` back to 'view'; the dropin:ready
  // handler above replays from `toolRef`.
  useEffect(() => {
    if (!readyRef.current) return;
    post({ type: "dropin:set-tool", tool });
  }, [tool, post]);

  // Breadcrumb navigation within focus mode changes `loc` but not srcDoc;
  // request a fresh reselect so the iframe repaints `data-dropin-selected`.
  useEffect(() => {
    if (readyRef.current) {
      post({ type: "dropin:reselect", loc });
    }
  }, [loc, post]);

  // Mode toggle (isolated ↔ in-page) doesn't need a reselect — the
  // selection hasn't changed. Just re-apply the chrome with the new marker.
  useEffect(() => {
    if (readyRef.current) applyFocusChrome();
  }, [mode, applyFocusChrome]);

  // Preset hover preview wire. Track the LAST oid we sent a preview for
  // so the unmount path can post a hover-clear with the right oid. The
  // iframe stashes the original className per-OID and restores on
  // hover-clear; without this teardown a half-frame of preview would
  // leak when hover transitions across tiles.
  const lastHoverOidRef = useRef<string | null>(null);
  useEffect(() => {
    if (!readyRef.current) return;
    const prev = lastHoverOidRef.current;
    if (hoverPreview && hoverPreview.oid) {
      // If the OID changed mid-hover (rare — would mean the user moved
      // selection while hovering a tile), clear the prior preview first
      // so the prior element doesn't keep the swapped className.
      if (prev && prev !== hoverPreview.oid) {
        post({ type: "dropin:hover-clear", id: prev });
      }
      post({
        type: "dropin:hover-preview",
        id: hoverPreview.oid,
        classes: hoverPreview.classes,
      });
      lastHoverOidRef.current = hoverPreview.oid;
    } else if (prev) {
      post({ type: "dropin:hover-clear", id: prev });
      lastHoverOidRef.current = null;
    }
  }, [hoverPreview, post]);

  // Belt-and-braces: if the iframe rebuilds (srcDoc swap) while a
  // preview is in flight, clear our local pointer. The iframe would
  // have cleared its own stash anyway (new contentDocument, fresh DOM)
  // but the host shouldn't pretend to have a live preview after that.
  useEffect(() => {
    lastHoverOidRef.current = null;
  }, [srcDoc]);

  return (
    <div className="h-full w-full overflow-hidden bg-soft">
      <iframe
        ref={iframeRef}
        title="Focused element preview"
        srcDoc={srcDoc}
        // Handshake-race fallback — see markReadyAndReplay. Guarantees the
        // tool/reselect replay even if the iframe's single dropin:ready
        // postMessage was missed by a not-yet-attached listener.
        onLoad={() => markReadyAndReplay("iframe onLoad")}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        // Don't leak the host URL as Referer — some image CDNs hotlink-block on
        // referrer, silently failing pasted/swapped images. Privacy win too.
        referrerPolicy="no-referrer"
        className="block h-full w-full bg-white"
      />
    </div>
  );
}
