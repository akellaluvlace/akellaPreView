"use client";

// 2026-05-15 — "Try variations" modal. v1 ships images-only shuffle.
// Palette and Font-pair toggles render as disabled "coming soon" rows
// so the eventual scope is visible to vibecoders + the UI shape is
// stable when those land.
//
// Wires to the host's `onShuffle(scope)` which returns a promise so we
// can stream progress through `onProgress(done, total)`. Closes itself
// on successful commit; stays open on bail (caller surfaces error via
// onWarn so the user sees what went wrong before retrying).

import { useEffect, useRef, useState } from "react";

export interface VariationsScope {
  images: boolean;
  palette: boolean;
  fonts: boolean;
}

interface VariationsModalProps {
  onClose: () => void;
  // Returns true iff the shuffle committed (some image was actually
  // changed). Caller does the setCode + toast; this modal just drives
  // the gesture.
  onShuffle: (
    scope: VariationsScope,
    onProgress: (done: number, total: number) => void,
  ) => Promise<boolean>;
}

export default function VariationsModal({
  onClose,
  onShuffle,
}: VariationsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [scope, setScope] = useState<VariationsScope>({
    images: true,
    palette: false,
    fonts: false,
  });
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );

  useEffect(() => {
    previouslyFocused.current = (document.activeElement as HTMLElement) || null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !running) {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose, running]);

  async function handleShuffle() {
    if (running) return;
    if (!scope.images && !scope.palette && !scope.fonts) return;
    setRunning(true);
    setProgress(null);
    try {
      const committed = await onShuffle(scope, (done, total) => {
        setProgress({ done, total });
      });
      if (committed) {
        // Close so the user sees the result. Caller already toasted.
        onClose();
      }
    } finally {
      setRunning(false);
      setProgress(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !running) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="variations-title"
        tabIndex={-1}
        className="w-full max-w-md border-2 border-ink bg-paper shadow-2xl focus:outline-none"
      >
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <div>
            <h2
              id="variations-title"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted"
            >
              Remix
            </h2>
            <p className="mt-1 font-serif text-xl leading-tight text-ink">
              Try variations
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={running}
            aria-label="Close"
            className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            Close
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <p className="text-sm leading-relaxed text-ink/80">
            Pick what to randomize. We'll apply everything as one change —
            hit Undo if you don't like it.
          </p>
          <ToggleRow
            checked={scope.images}
            disabled={running}
            label="Images"
            blurb="Swap every photo for a fresh Pixabay pick matching its alt text."
            onChange={(v) =>
              setScope((s) => ({ ...s, images: v }))
            }
          />
          <ToggleRow
            checked={false}
            disabled
            comingSoon
            label="Palette"
            blurb="Swap accent colors across the template. (Coming soon — the cascade needs more guardrails to land safely.)"
            onChange={() => {
              /* disabled */
            }}
          />
          <ToggleRow
            checked={false}
            disabled
            comingSoon
            label="Font pair"
            blurb="Pair a new heading + body font from a curated set. (Coming soon.)"
            onChange={() => {
              /* disabled */
            }}
          />
          <div className="border-t-2 border-ink/15 pt-4">
            <button
              type="button"
              onClick={handleShuffle}
              disabled={
                running || (!scope.images && !scope.palette && !scope.fonts)
              }
              className={
                "w-full border-2 border-ink px-4 py-3 font-mono text-[12px] uppercase tracking-[0.15em] transition-colors " +
                (running
                  ? "bg-ink text-paper"
                  : "bg-coral text-paper hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40")
              }
            >
              {running
                ? progress
                  ? `Shuffling ${progress.done} of ${progress.total}…`
                  : "Looking up photos…"
                : "Shuffle ↻"}
            </button>
            <p className="mt-2 font-mono text-[10px] text-muted">
              The change goes through Undo / Redo — one click reverts it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  checked,
  disabled,
  comingSoon,
  label,
  blurb,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  label: string;
  blurb: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <label
      className={
        "flex cursor-pointer items-start gap-3 border-2 p-3 transition-colors " +
        (disabled
          ? "border-ink/15 bg-soft/30 opacity-60 cursor-not-allowed"
          : checked
          ? "border-ink bg-soft/60"
          : "border-ink/30 bg-paper hover:border-ink hover:bg-soft/30")
      }
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-coral"
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink">
            {label}
          </span>
          {comingSoon && (
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
              · Coming soon
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-snug text-ink/70">{blurb}</p>
      </div>
    </label>
  );
}
