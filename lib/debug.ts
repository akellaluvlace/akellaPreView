// 2026-05-26 — single gate for all `[dropin:*]` diagnostic console logging.
//
// The project leans on "tracer-first" debugging (see
// memory/feedback_tracer_first_on_broken_features.md): verbose console.log
// tracers are added at every decision point of a flaky feature and LEFT in
// so they pay rent on the next mystery bug. The problem: left ungated they
// also ship to every production browser console (and some, like the BYO-AI
// APPLY-TRACE, logged a slice of the AI's output).
//
// `dlog` keeps the tracers available where they're useful and silent where
// they're not. Enabled when:
//   - NODE_ENV !== "production" (local `next dev`), OR
//   - localStorage["dropin:debug"] === "1" (opt-in in ANY build, incl. a
//     deployed prod build — set it in DevTools, reload, and the full trail
//     comes back).
// Computed once at module load (a per-call localStorage read on hot paths
// like per-render `track()` would be wasteful); flip + reload to toggle.

function computeEnabled(): boolean {
  try {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV !== "production"
    ) {
      return true;
    }
  } catch {
    /* process may be undefined in some browser contexts */
  }
  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      window.localStorage.getItem("dropin:debug") === "1"
    ) {
      return true;
    }
  } catch {
    /* localStorage can throw in sandboxed/blocked contexts */
  }
  return false;
}

export const DROPIN_DEBUG = computeEnabled();

// Drop-in replacement for `console.log(...)` that no-ops unless DROPIN_DEBUG.
export function dlog(...args: unknown[]): void {
  if (DROPIN_DEBUG) console.log(...args);
}
