"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildPreviewDocument, type PreviewKind } from "@/lib/preview";
import type { Viewport } from "./Preview";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:PreviewModal] ${msg}`, data ?? "");
}

interface PreviewModalProps {
  code: string;
  kind: PreviewKind;
  initialViewport?: Viewport;
  filename?: string;
  onClose: () => void;
  // When true, lock body scroll + restore focus on unmount. Useful when the
  // modal is opened on top of a scrollable page (Workspace's Expand). When
  // the modal IS the page (the /preview/[slug] route), leave it false so
  // closing doesn't fight with the route transition.
  lockBodyScroll?: boolean;
  closeLabel?: string;
}

const VIEWPORTS: { id: Viewport; label: string; width: string | null }[] = [
  { id: "desktop", label: "Desktop", width: null },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "Mobile", width: "390px" },
];

export default function PreviewModal({
  code,
  kind,
  initialViewport = "desktop",
  filename,
  onClose,
  lockBodyScroll = true,
  closeLabel = "Close · Esc",
}: PreviewModalProps) {
  const [viewport, setViewport] = useState<Viewport>(initialViewport);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Build the iframe doc once per (code, kind) pair. Modal is launched from
  // a snapshot of the workspace state, so live re-rendering on keystrokes is
  // not needed here — the user opens it to *view*, not to edit.
  const srcDoc = useMemo(
    () => buildPreviewDocument({ code, kind }),
    [code, kind]
  );

  const handleClose = useCallback(() => {
    log("close");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (lockBodyScroll) {
      lastFocusRef.current = document.activeElement as HTMLElement | null;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    let prevOverflow: string | null = null;
    if (lockBodyScroll) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lockBodyScroll && prevOverflow !== null) {
        document.body.style.overflow = prevOverflow;
        lastFocusRef.current?.focus?.();
      }
    };
  }, [handleClose, lockBodyScroll]);

  const widthForViewport =
    VIEWPORTS.find((v) => v.id === viewport)?.width ?? null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen preview"
    >
      {/* Top bar lives in its own flex row — iframe content below cannot
          peek through it, and the bar sits cleanly above any navbar that
          the rendered template happens to render at its own y=0. */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-ink/15 bg-paper/90 px-4 py-2 shadow-[0_2px_12px_rgba(15,15,15,0.08)] backdrop-blur-md backdrop-saturate-150 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70">
            Fullscreen preview
          </span>
          <span className={`chip ${kind === "jsx" ? "chip-accent" : ""}`}>
            {kind.toUpperCase()}
          </span>
          {filename && (
            <span className="truncate font-mono text-[11px] text-ink/60">
              {filename}.{kind === "html" ? "html" : "jsx"}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex overflow-hidden rounded-sm border border-ink/30 bg-paper/70"
            role="group"
            aria-label="Viewport"
          >
            {VIEWPORTS.map((v, i) => {
              const active = v.id === viewport;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setViewport(v.id)}
                  aria-pressed={active}
                  className={
                    "px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors " +
                    (active
                      ? "bg-ink text-paper"
                      : "text-ink hover:bg-ink/10") +
                    (i > 0 ? " border-l border-ink/30" : "")
                  }
                >
                  {v.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleClose}
            autoFocus
            className="rounded-sm border border-ink bg-coral px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink hover:text-coral"
          >
            {closeLabel}
          </button>
        </div>
      </header>

      {/* Iframe fills everything below the bar. min-h-0 + flex-1 lets the
          iframe shrink to the remaining height instead of overflowing. On
          tablet / mobile the iframe is constrained in width and centered;
          the surrounding dark area (bg-ink) reads as a device frame. */}
      <div className="flex min-h-0 flex-1 justify-center overflow-auto">
        <iframe
          title="Fullscreen preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="block h-full w-full border-0 bg-white"
          style={
            widthForViewport
              ? { width: widthForViewport, maxWidth: "100%" }
              : undefined
          }
        />
      </div>
    </div>
  );
}
