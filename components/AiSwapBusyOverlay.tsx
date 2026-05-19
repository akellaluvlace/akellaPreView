"use client";

// 2026-05-19 — Busy overlay rendered on top of the AI swap modal's
// component grid while the AI request is in flight. Provides:
//   - Animated sparkle + indeterminate progress bar (signals activity)
//   - Active model name (so user knows minimax-m2 vs qwen3-coder)
//   - Live elapsed-time counter (sets expectation that long calls are
//     normal, and signals when something's clearly hung)
//   - Cancel button (abort the in-flight call + close modal)
//
// Extracted from Workspace.tsx because the elapsed-time counter needs
// its own useState + useEffect for the interval — inlining was bloating
// the Workspace render.

import { useEffect, useState } from "react";

interface Props {
  // Active model name (e.g. "minimax/minimax-m2"). Shown in the
  // overlay so the user knows which model is running. Null when
  // unknown (defensive — should never be null in practice while
  // overlay is visible).
  model: string | null;
  // Hard timeout configured server-side (defaults to 45s). Used to
  // color the elapsed-time counter red when nearing the wall.
  timeoutMs?: number;
  // Cancel handler — aborts the in-flight call + closes modal.
  onCancel: () => void;
}

export default function AiSwapBusyOverlay({
  model,
  timeoutMs = 45_000,
  onCancel,
}: Props) {
  const [elapsedMs, setElapsedMs] = useState(0);
  // Per-mount interval. Resets on every overlay open since the
  // component remounts (overlay only renders when busy).
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => setElapsedMs(Date.now() - start), 250);
    return () => clearInterval(t);
  }, []);

  const elapsedSec = (elapsedMs / 1000).toFixed(1);
  const ratio = Math.min(elapsedMs / timeoutMs, 1);
  const isStretched = ratio > 0.66;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-paper/85 backdrop-blur-sm">
      <div className="text-3xl">
        <span className="inline-block animate-pulse">✨</span>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
        AI is restyling…
      </div>
      <div className="font-mono text-[10px] text-muted">
        {model ? model.split("/").pop() : "thinking…"}
      </div>
      <div className="mt-2 h-1 w-40 overflow-hidden border border-ink/30 bg-paper">
        <div className="h-full w-1/3 animate-pulse bg-coral" />
      </div>
      <div
        className={
          "font-mono text-[10px] tabular-nums " +
          (isStretched ? "text-coral font-bold" : "text-muted")
        }
        aria-live="polite"
      >
        {elapsedSec}s / {(timeoutMs / 1000).toFixed(0)}s
        {isStretched && " · taking longer than usual"}
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="mt-1 border border-ink bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        Cancel
      </button>
    </div>
  );
}
