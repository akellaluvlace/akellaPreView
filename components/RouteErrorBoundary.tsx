"use client";

// Shared UI for the App Router error boundaries (app/playground/error.tsx,
// app/t/[slug]/error.tsx). Catches render/lifecycle throws in the page subtree
// so a bug in the editor surface shows a recoverable message + keeps the user's
// browser-stored work, instead of Next's default error screen or a blank.
//
// Caveat (kept honest): React error boundaries catch render/lifecycle errors
// only — NOT event handlers, async rejections, or the iframe's user code. Those
// paths have their own guards (the preview overlay, per-handler try/catch).

import { useEffect } from "react";

export default function RouteErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dropin] route error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper px-6 text-center text-ink">
      <span className="rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
        dropin · something broke
      </span>
      <h1 className="max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
        This page hit an error.
      </h1>
      <p className="max-w-md font-mono text-sm text-ink/70">
        Your work is saved in this browser — reloading won&apos;t lose it. Try
        again, or reload the page.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="border-2 border-ink bg-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper hover:bg-paper hover:text-ink"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") window.location.reload();
          }}
          className="border-2 border-ink bg-paper px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
