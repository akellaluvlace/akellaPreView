"use client";

import { useEffect, useRef, useState } from "react";

interface ResizablePanelProps {
  storageKey: string;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  children: React.ReactNode;
  // Class for the panel container; callers control the inside chrome.
  className?: string;
  // Position of the drag handle. Default "right" — handle on the right
  // edge of the panel (panel grows by dragging right). "left" puts the
  // handle on the left edge (panel grows by dragging left, useful for
  // panels anchored to the right viewport edge).
  handle?: "left" | "right";
  ariaLabel?: string;
}

// Brutalist drag-to-resize panel. Width persists per `storageKey` so a
// refresh keeps the user's layout. Pointer events handle mouse + touch +
// pen via setPointerCapture so a fast drag doesn't escape the handle.
export default function ResizablePanel({
  storageKey,
  defaultWidth,
  minWidth,
  maxWidth,
  children,
  className,
  handle = "right",
  ariaLabel,
}: ResizablePanelProps) {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === "undefined") return defaultWidth;
    try {
      const stored = window.localStorage.getItem(storageKey);
      const n = stored ? Number(stored) : NaN;
      if (!Number.isFinite(n)) return defaultWidth;
      return Math.max(minWidth, Math.min(maxWidth, n));
    } catch {
      return defaultWidth;
    }
  });

  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(width);

  // Persist on every width change. Cheap localStorage write, debounced by
  // React's render cadence.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, String(width));
    } catch {
      // private mode — state-only persistence is fine.
    }
  }, [storageKey, width]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const delta = handle === "right" ? dx : -dx;
    const next = Math.max(
      minWidth,
      Math.min(maxWidth, startWidthRef.current + delta),
    );
    setWidth(next);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // already released — no-op.
    }
  };

  const handleEdge =
    handle === "right"
      ? "right-0 border-r-2 border-r-transparent"
      : "left-0 border-l-2 border-l-transparent";

  return (
    <div
      className={"relative shrink-0 " + (className ?? "")}
      style={{ width }}
      aria-label={ariaLabel}
    >
      {children}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={
          ariaLabel ? `${ariaLabel} — resize handle` : "Resize handle"
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={
          "absolute top-0 z-10 h-full w-2 cursor-ew-resize hover:bg-coral/40 active:bg-coral/60 " +
          handleEdge
        }
      />
    </div>
  );
}
