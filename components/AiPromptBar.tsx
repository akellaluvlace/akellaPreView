"use client";

// 2026-05-17 — AI Edit prompt bar (Phase 2).
//
// Floating single-line prompt anchored to the bottom-center of the
// viewport. Phase 3 will reposition this to be bbox-anchored under the
// active selection; for Phase 2 we keep it simple + discoverable.
//
// Renders only when there's an active AI selection. While a request
// is in-flight, the textarea is read-only + a shimmer label shows the
// active model. Enter submits; Shift+Enter inserts a newline; Escape
// cancels (and parent clears the selection).

import { useEffect, useRef, useState } from "react";
import type { AiSelectionInfo } from "@/lib/ai-edit/types";

interface AiPromptBarProps {
  info: AiSelectionInfo | null;
  busy: boolean;
  // Model name to render while busy (e.g. "minimax/minimax-m2").
  busyModel: string | null;
  // User pressed Enter.
  onSubmit: (prompt: string) => void;
  // User pressed Escape inside the textarea — parent should clear
  // selection (which unmounts this bar) AND abort an in-flight request.
  onEscape: () => void;
}

export default function AiPromptBar({
  info,
  busy,
  busyModel,
  onSubmit,
  onEscape,
}: AiPromptBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the textarea when the bar mounts OR when selection
  // changes (each new click should land the cursor in the prompt).
  // Skip when busy — focus stealing while the request is firing is
  // annoying.
  useEffect(() => {
    if (info && !busy && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [info, busy]);

  // Clear the prompt when the selection changes to a different
  // element/scope. Keeping the old text would suggest it applies to
  // the new selection too, which it doesn't.
  // Effect-driven so the controlled value tracks selection identity.
  // We key on path + scope, which uniquely identifies a selection.
  const selectionKey = info ? `${info.path}::${info.scope}` : null;
  const lastKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (selectionKey !== lastKeyRef.current) {
      setValue("");
      lastKeyRef.current = selectionKey;
    }
  }, [selectionKey]);

  if (!info) return null;

  const placeholder =
    info.scope === "section"
      ? "Redesign this section as…"
      : "Change this element to…";

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || busy) return;
      onSubmit(trimmed);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onEscape();
      return;
    }
  }

  return (
    <div
      role="form"
      aria-label="AI Edit prompt"
      className="pointer-events-auto fixed bottom-20 left-1/2 z-[81] flex w-[min(640px,calc(100vw-32px))] -translate-x-1/2 items-center gap-2 border-2 border-ink bg-paper px-3 py-2 shadow-[6px_6px_0_0_#FF4D2E]"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
        ✨ AI
      </span>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={busy}
        className="flex-1 resize-none border-none bg-transparent font-sans text-[14px] text-ink placeholder:text-muted focus:outline-none disabled:opacity-50"
        style={{ minHeight: 22, maxHeight: 120 }}
      />
      {busy ? (
        <span className="animate-pulse font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          {busyModel ? busyModel.split("/").pop() : "thinking…"}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => {
            const trimmed = value.trim();
            if (trimmed && !busy) onSubmit(trimmed);
          }}
          disabled={!value.trim()}
          className="border border-ink bg-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors hover:bg-coral hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
        >
          Apply
        </button>
      )}
    </div>
  );
}
