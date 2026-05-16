"use client";

import { useEffect, useRef, useState } from "react";

// First-open tooltip tour for vibecoders. Auto-fires on first workspace
// mount; dismissed permanently in `localStorage` so returning users
// never see it.
//
// 2026-05-16 v3 — Storage key bumped to v3. Earlier v1/v2 steps described
// the Select / Move / Insert / Swap tool model. Move retired 2026-05-15;
// Try Variations retired 2026-05-16; Select + Insert hidden long before
// that. Tour content now reflects the current "Edit tool + per-element
// vibe panel" model with Shuffle / Save Now / What's Next callouts.
// Existing v2-completed users see this refreshed tour exactly once
// (v1/v2 dismissals stay in localStorage but no longer satisfy the v3 gate).
//
// Design:
// - Bottom-right floating card; doesn't block iframe interaction.
// - Single Next/Done button + a small Skip link (closes & marks complete).

const STORAGE_KEY = "dropin:tour-completed-v3";

interface Step {
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    title: "Click anything to edit it",
    body: "Press E (or click Edit in the toolbar). Then click any text, image, icon, or card. The right rail shows what you can change for that element.",
  },
  {
    title: "Shuffle for fresh images",
    body: "Click any image → hit Shuffle ↻ in the right rail. We'll fetch a new photo from Pixabay matching your alt text. Works on background images on cards too.",
  },
  {
    title: "Edits auto-save · Undo walks back",
    body: "Your tweaks auto-save every second. The Save now ✓ button locks in immediately. ⌘Z (or the Undo button) walks back through every save point.",
  },
  {
    title: "What's next?",
    body: "Hit the coral What's next? button up top — copy your code, get AI prompts for further iteration in ChatGPT/Claude, and walk-throughs for hosting your page online.",
  },
];

interface FirstOpenTourProps {
  // Kept for API compat with v1 — Workspace passes `selection !== null`.
  // v2 doesn't gate on this; tour fires on first mount. (Removing the
  // prop would churn Workspace; the cost of the unread arg is zero.)
  hasSelection: boolean;
}

export default function FirstOpenTour(_props: FirstOpenTourProps) {
  const [step, setStep] = useState<number | null>(null);
  // Once the tour fires within a session, the dismissed-forever flag is
  // written. The ref guards against double-fire across StrictMode's
  // dev-mode useEffect re-run.
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (v === "1") return;
    } catch {
      // Private mode etc — fail open, show the tour, but skip persistence.
    }
    firedRef.current = true;
    setStep(0);
  }, []);

  function dismiss(reason: "skip" | "complete") {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setStep(null);
    if (reason === "skip") {
      // No-op: kept distinct from "complete" so future analytics can split.
    }
  }

  function next() {
    if (step === null) return;
    if (step >= STEPS.length - 1) {
      dismiss("complete");
      return;
    }
    setStep(step + 1);
  }

  if (step === null) return null;
  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-label="Welcome tour"
      className="pointer-events-auto fixed bottom-4 right-4 z-[80] w-[300px] border-2 border-ink bg-paper p-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span>Tour · {step + 1}/{STEPS.length}</span>
        <button
          type="button"
          onClick={() => dismiss("skip")}
          className="text-muted hover:text-coral"
        >
          skip
        </button>
      </div>
      <h4 className="mb-1 font-mono text-[12px] text-ink">{cur.title}</h4>
      <p className="mb-3 font-mono text-[11px] leading-snug text-ink">{cur.body}</p>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={
                "h-1 flex-1 " + (i <= step ? "bg-coral" : "bg-soft")
              }
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="border-2 border-ink bg-coral px-2 py-1 font-mono text-[11px] text-paper hover:bg-ink"
        >
          {isLast ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
