"use client";

// 2026-05-15 — "What's next?" helper modal. Surfaces the three things
// vibecoders need after picking + tweaking a template:
//   1. Copy their code out (existing Copy button covers the mechanics)
//   2. Iterate with AI — four ready-made prompt templates with copy
//      buttons. The most distinctly vibecoder-y feature: AI got them
//      here, AI gets them further.
//   3. Put it online — three hosting paths ranked by friction (Netlify
//      Drop = easiest, Vercel = best long-term, CodeSandbox = preview
//      without deploy).
//
// Pure content + copy-to-clipboard wiring. No state mutation in the
// editor; closes cleanly on Esc / backdrop click / X button. Mirrors
// PreviewModal's structural pattern (fixed inset-0 overlay + body
// scroll lock + focus restore).

import { useCallback, useEffect, useRef, useState } from "react";

interface WhatsNextModalProps {
  onClose: () => void;
  // The current template's source, ready to copy. Caller strips OIDs
  // before passing in. Used by the "Copy this code" button in the AI
  // section so users don't have to bounce out to the chrome's Copy.
  exportSource: string;
}

interface PromptTemplate {
  id: string;
  title: string;
  blurb: string;
  prompt: string;
}

const PROMPTS: ReadonlyArray<PromptTemplate> = [
  {
    id: "style-direction",
    title: "Change the vibe",
    blurb:
      "Pivot the design toward a different feel without losing the structure.",
    prompt: `I have this React landing-page component. Make it more [minimal / bold / playful / professional / luxurious / brutalist], but keep the existing color palette and layout structure. Return the full updated component code.

[paste your code below]`,
  },
  {
    id: "add-section",
    title: "Add a new section",
    blurb: "Grow the page with a section that matches the existing style.",
    prompt: `I have this React landing-page component. Add a [testimonials / FAQ / pricing / features / contact / footer / hero variant] section that matches the visual style of the existing sections (same typography, color palette, spacing patterns). Insert it in a sensible place. Return the full updated component code.

[paste your code below]`,
  },
  {
    id: "rewrite-content",
    title: "Make it about your project",
    blurb:
      "Replace placeholder copy with text that fits what you're actually building.",
    prompt: `I have this React landing-page component for [describe your project — e.g. "a SaaS productivity app", "an artist portfolio", "a local bakery"]. Rewrite ALL the placeholder text to match the project. Keep the layout, components, and styling exactly the same — just change the copy. Return the full updated component code.

[paste your code below]`,
  },
  {
    id: "fix-polish",
    title: "Polish what's off",
    blurb:
      "Targeted fixes for whatever isn't quite landing — point at specifics.",
    prompt: `I have this React landing-page component. There are a few things that feel off:
- [describe what's not right — e.g. "the hero feels too quiet", "the buttons don't pop", "the spacing between sections is uneven", "the third card looks misaligned"]

Fix these issues without changing the overall design direction. Return the full updated component code.

[paste your code below]`,
  },
];

interface HostOption {
  id: string;
  label: string;
  badge: string;
  steps: ReadonlyArray<string>;
  url: string;
  urlLabel: string;
}

const HOSTS: ReadonlyArray<HostOption> = [
  {
    id: "netlify-drop",
    label: "Netlify Drop",
    badge: "Easiest · no signup",
    steps: [
      "Toggle the kind switch up top to HTML, then hit Download.",
      "Go to app.netlify.com/drop in a new tab.",
      "Drag-drop your downloaded .html file onto the page.",
      "You get an instant free URL — share it.",
    ],
    url: "https://app.netlify.com/drop",
    urlLabel: "Open Netlify Drop",
  },
  {
    id: "vercel",
    label: "Vercel",
    badge: "Best for ongoing projects · free",
    steps: [
      "Go to vercel.com/new in a new tab.",
      "Sign up (GitHub login is fastest).",
      "Pick the Next.js template — it gives you a working starter.",
      "Open app/page.tsx, paste your JSX in (download it from here first).",
      "Click Deploy. You get a free yourname.vercel.app URL.",
    ],
    url: "https://vercel.com/new",
    urlLabel: "Open Vercel",
  },
  {
    id: "codesandbox",
    label: "CodeSandbox / StackBlitz",
    badge: "Preview-only · no deploy needed",
    steps: [
      "Go to codesandbox.io or stackblitz.com in a new tab.",
      "Create a new React project (Vite + React template works well).",
      "Open App.jsx in the editor, paste your JSX in.",
      "The preview URL on the right is shareable.",
    ],
    url: "https://codesandbox.io/",
    urlLabel: "Open CodeSandbox",
  },
];

export default function WhatsNextModal({
  onClose,
  exportSource,
}: WhatsNextModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Per-button copied-flash state. Map keyed by id-or-"source"; value
  // is the timeout handle so we can cancel + restart cleanly when the
  // user mashes the same button repeatedly.
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Esc to close + body scroll lock + focus restore. Same pattern as
  // PreviewModal — closing the modal returns focus to whichever button
  // opened it.
  useEffect(() => {
    previouslyFocused.current = (document.activeElement as HTMLElement) || null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    // Focus the dialog so screen-readers announce it + tab targets stay inside.
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
        copyTimer.current = null;
      }
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  const handleCopy = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      setCopiedId(id);
      copyTimer.current = setTimeout(() => {
        setCopiedId(null);
        copyTimer.current = null;
      }, 1800);
    } catch {
      // Clipboard can fail in unsandboxed iframes / older browsers.
      // Fail silently — user can select + copy by hand from the
      // visible textarea.
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsnext-title"
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border-2 border-ink bg-paper shadow-2xl focus:outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-ink bg-paper px-6 py-4">
          <div>
            <h2
              id="whatsnext-title"
              className="font-mono text-xs uppercase tracking-[0.25em] text-muted"
            >
              Helper
            </h2>
            <p className="mt-1 font-serif text-2xl leading-tight text-ink">
              What's next?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper"
          >
            Close · Esc
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          {/* Section 1 — Copy your code */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-coral">
              Step 1
            </p>
            <h3 className="mt-1 font-serif text-xl text-ink">Copy your code</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Grab the full source — clean JSX/HTML with no editor marks.
              You'll paste this into AI chats or hosting tools below.
            </p>
            <button
              type="button"
              onClick={() => handleCopy("source", exportSource)}
              className={
                "mt-3 border-2 border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors " +
                (copiedId === "source"
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-ink hover:text-paper")
              }
            >
              {copiedId === "source"
                ? "Copied — paste anywhere"
                : "Copy this template's code"}
            </button>
          </section>

          {/* Section 2 — Iterate with AI */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-coral">
              Step 2
            </p>
            <h3 className="mt-1 font-serif text-xl text-ink">
              Iterate with AI
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Paste your code into ChatGPT, Claude, Gemini, or any AI chat,
              then send one of these prompts. Replace the bracketed
              placeholders with your specifics. When the AI returns code,
              paste it back here to see the result live.
            </p>
            <div className="mt-4 space-y-4">
              {PROMPTS.map((p) => (
                <div
                  key={p.id}
                  className="border-2 border-ink/15 bg-soft/40 p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink">
                      {p.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleCopy(p.id, p.prompt)}
                      className={
                        "border-2 border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors " +
                        (copiedId === p.id
                          ? "bg-ink text-paper"
                          : "bg-paper text-ink hover:bg-ink hover:text-paper")
                      }
                    >
                      {copiedId === p.id ? "Copied" : "Copy prompt"}
                    </button>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink/70">
                    {p.blurb}
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap rounded-none bg-paper p-3 font-mono text-[11px] leading-relaxed text-ink/90">
                    {p.prompt}
                  </pre>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 — Put it online */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-coral">
              Step 3
            </p>
            <h3 className="mt-1 font-serif text-xl text-ink">Put it online</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Three ways to get a public URL. Pick the one that matches your
              comfort level.
            </p>
            <div className="mt-4 space-y-4">
              {HOSTS.map((h) => (
                <div
                  key={h.id}
                  className="border-2 border-ink/15 bg-soft/40 p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h4 className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink">
                        {h.label}
                      </h4>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                        {h.badge}
                      </p>
                    </div>
                    <a
                      href={h.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-ink bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper"
                    >
                      {h.urlLabel} ↗
                    </a>
                  </div>
                  <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-ink/85">
                    {h.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <p className="mt-4 border-l-2 border-coral bg-soft/50 p-3 text-sm text-ink/80">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-coral">
                Not sure?
              </span>
              <br />
              Start with <strong>Netlify Drop</strong>. No signup, no setup —
              drag, drop, done.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
