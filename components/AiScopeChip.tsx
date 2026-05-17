"use client";

// 2026-05-17 — Floating scope chip for AI Edit Phase 1.
//
// Plan §3.1 + §3.2: when the user clicks an element in AI tool, render
// a small floating chip in the TOP-LEFT of the bounding box showing
// the element's tag + class fingerprint (e.g. `section.hero`) plus
// the active scope (Element | Section) and a token-count hint.
//
// Tab expands element → section (host posts ai:set-scope to iframe).
// Shift+Tab collapses section → element.
// Escape clears the selection.
//
// Phase 1 ships JUST the chip + keybindings. The floating prompt bar
// (plan §3.3) lands in Phase 2 once the Tensorix client + API path is
// wired.

import { useEffect } from "react";
import type { AiSelectionInfo } from "@/lib/ai-edit/types";
import { formatTokenCount } from "@/lib/ai-edit/scope";

interface AiScopeChipProps {
  // Current AI selection. Chip + keybindings render only when truthy.
  info: AiSelectionInfo | null;
  // Re-emit selection at the OPPOSITE scope. Wraps the
  // `previewHandleRef.current.postVibe({ type: "ai:set-scope", ... })`
  // call so this component doesn't need a Preview handle directly.
  onSetScope: (scope: "element" | "section") => void;
  // Clear the current selection (Escape). Posts ai:clear to iframe
  // AND clears local host state.
  onClear: () => void;
}

export default function AiScopeChip({
  info,
  onSetScope,
  onClear,
}: AiScopeChipProps) {
  // Tab / Shift+Tab / Escape keybindings. Window-level so the user
  // doesn't need to focus a specific element. Skipped when no
  // selection is active — falls through to default browser behavior
  // (Tab moves focus, Escape does nothing visible).
  useEffect(() => {
    if (!info) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClear();
        return;
      }
      if (e.key === "Tab") {
        // Skip when focus is in a text-edit field (vibecoder typing
        // in a panel input; Tab should still move focus through
        // form elements there). The AI scope chip is read-only; we
        // intercept Tab only when no input owns focus.
        const active = document.activeElement;
        if (active) {
          const tag = active.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA") return;
          if ((active as HTMLElement).isContentEditable) return;
          if (active.closest && active.closest(".monaco-editor")) return;
        }
        e.preventDefault();
        const nextScope = e.shiftKey ? "element" : "section";
        // No-op when already at the target scope. Prevents a redundant
        // iframe round-trip if the user mashes Tab.
        if (info && info.scope === nextScope) return;
        onSetScope(nextScope);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [info, onSetScope, onClear]);

  if (!info || !info.bbox) return null;

  // Position the chip at the top-left of the bbox. bbox is in iframe-
  // viewport coords — the chip renders in the HOST overlay layer
  // (which is positioned over the iframe), so we need to translate
  // those iframe coords into host coords. For Phase 1 we render the
  // chip in a fixed-bottom-left HUD instead of overlay-anchored —
  // simpler, no coord conversion, still discoverable. Overlay-anchored
  // floating chip lands in Phase 3 when the prompt bar joins.
  const fingerprint = info.fingerprint;
  const scopeLabel = info.scope === "section" ? "Section" : "Element";
  const tokens = formatTokenCount(info.tokenEstimate);

  return (
    <div
      role="status"
      aria-label="AI Edit selection"
      className="pointer-events-auto fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 flex items-center gap-3 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink shadow-[4px_4px_0_0_#FF4D2E]"
    >
      <span className="text-coral">✨</span>
      <span className="font-bold">{scopeLabel}</span>
      <span className="text-muted">·</span>
      <span>{fingerprint}</span>
      <span className="text-muted">·</span>
      <span className="text-muted">~{tokens} tokens</span>
      <span className="text-muted">·</span>
      <span className="text-[10px] text-muted">
        {info.scope === "element" ? "Tab to expand" : "Shift+Tab to collapse"}
        {" · "}
        Esc to clear
      </span>
    </div>
  );
}
