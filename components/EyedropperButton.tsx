"use client";

// Tiny shared button that pops the native EyeDropper picker
// (Chromium-only) and forwards the hex back. ROADMAP §4.1 #9.
//
// Firefox + Safari don't implement `window.EyeDropper`; we render nothing
// rather than a dead button. Promise rejects when the user hits Esc — we
// swallow that as a no-op (it's not an error worth surfacing).
//
// Inline SVG icon so we don't pull lucide-react into the host bundle for
// one icon. Sized to match `dropin-color` swatches (~28 px square).

interface EyedropperButtonProps {
  onPick: (hex: string) => void;
  /** Accessible label used by screen readers. */
  ariaLabel?: string;
  /** Optional Tailwind class override (defaults to a coral-on-paper square). */
  className?: string;
}

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropperLike {
  open: () => Promise<EyeDropperResult>;
}

interface EyeDropperGlobal {
  EyeDropper?: new () => EyeDropperLike;
}

export default function EyedropperButton({
  onPick,
  ariaLabel = "Pick color from screen",
  className,
}: EyedropperButtonProps) {
  // SSR safety: window is undefined on the server. The `"use client"`
  // directive ensures we hydrate on the client, but the comparison still
  // needs to be guarded so the initial render doesn't reference window.
  const w = typeof window === "undefined" ? null : (window as unknown as EyeDropperGlobal);
  const supported = Boolean(w && w.EyeDropper);
  if (!supported) return null;

  async function pick() {
    try {
      const Ctor = (w as EyeDropperGlobal).EyeDropper;
      if (!Ctor) return;
      const ed = new Ctor();
      const result = await ed.open();
      if (result?.sRGBHex) {
        onPick(String(result.sRGBHex).toUpperCase());
      }
    } catch {
      // user cancelled with Esc, or browser denied the prompt — silent no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={pick}
      title="Eyedropper"
      aria-label={ariaLabel}
      className={
        className ??
        "flex h-7 w-7 shrink-0 items-center justify-center border border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper"
      }
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.4 2.4 0 1 1 3.4 3.4L18.4 9.4a1 1 0 0 1-1.4 0L14.6 7a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  );
}
