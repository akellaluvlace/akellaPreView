"use client";

// Vibe-edit link controls: link text + href + colors + typography +
// Browse components. Mirrors TextControls' surface but ADDS the href
// field at the top.
//
// 2026-05-17 — Enriched from a bare text+href panel after user reported
// that button-styled <a> tags (Tailwind utility-composed buttons like
// `<a class="bg-coral rounded-lg px-4 py-2">`) lost color/typography
// controls compared to <button>. Survey across templates: 222 of 910
// <a> tags (~24%) have `bg-*` classes → button-styled. Decision: don't
// predicate on visual-role detection (too brittle); just give every
// link the full TextControls surface. Plain text links get extra
// controls they can ignore; button-styled links get the controls
// they need. Same shape as <button> → kind:"button" → TextControls.

import { useCallback, useEffect, useRef, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import { rgbToHex } from "@/lib/vibe-edit/rgb-to-hex";
import { isLinkStyledAsButton } from "@/lib/vibe-edit/detect";
import TextTypographyExtras from "./TextTypographyExtras";
import { SwapComponentButton } from "../VibePropertiesPanel";

// 2026-05-17 — Default button chrome applied by "Style as button". Uses
// Tailwind palette utilities everyone has (no custom theme tokens) so
// the action lands cleanly regardless of the template's design. After
// application, the existing color pickers + Browse components are
// immediately useful for further customization.
//   inline-block: <a> defaults to inline; padding doesn't render
//                 vertically on pure inline. inline-block makes the
//                 padding take.
//   bg-blue-600 + text-white: high-contrast default — vibecoder
//                 can override with the color pickers in seconds.
//   px-4 py-2: comfortable button padding.
//   rounded: subtle corner that reads as "button" not "card".
//   font-medium: visual weight match to most button design systems.
//   no-underline: <a> defaults to underlined; buttons don't.
const BUTTON_CHROME_CLASSES =
  "inline-block bg-blue-600 text-white px-4 py-2 rounded font-medium no-underline";

// TextControls owns the background colour picker, so transparent bg
// should NOT render as a black square (indistinguishable from a black
// text-colour swatch). White is the readable fallback.
const RGB_OPTS = { transparentFallback: "#ffffff" } as const;

// 80ms debounce on content posts — same as TextControls. Coalesces
// rapid keystrokes without adding perceptible lag.
const CONTENT_DEBOUNCE_MS = 80;

interface LinkControlsProps {
  info: VibeElementInfo;
  onLinkChange: (href: string) => void;
  onContentChange: (text: string) => void;
  onStyleChange: (styles: { color?: string; backgroundColor?: string }) => void;
  // Optional class-list mutation. Wired through Workspace's
  // handleVibeClasses → vibe:update-classes postMessage. Drives the
  // typography sliders.
  onClassesChange?: (newClasses: string) => void;
  // Opens the Components library modal so the user can swap the link
  // for a different block (e.g. a button-styled CTA). Optional.
  onComponentSwap?: () => void;
}

export default function LinkControls({
  info,
  onLinkChange,
  onContentChange,
  onStyleChange,
  onClassesChange,
  onComponentSwap,
}: LinkControlsProps) {
  const [href, setHref] = useState(info.href ?? "");
  const [text, setText] = useState(info.text);
  const [color, setColor] = useState(rgbToHex(info.textColor, RGB_OPTS));
  const [bg, setBg] = useState(rgbToHex(info.bgColor, RGB_OPTS));

  useEffect(() => {
    setHref(info.href ?? "");
    setText(info.text);
    setColor(rgbToHex(info.textColor, RGB_OPTS));
    setBg(rgbToHex(info.bgColor, RGB_OPTS));
  }, [info.path, info.href, info.text, info.textColor, info.bgColor]);

  // Debounced post of onContentChange. Without this every keystroke
  // would post vibe:update-content → forced reflow → vibe:selected
  // re-emit → panel rerender. At 80wpm that's ~10 msgs/sec each forcing
  // reflow — laggy without obvious cause.
  const debouncedPostRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postText = useCallback(
    (v: string) => {
      if (debouncedPostRef.current !== null) {
        clearTimeout(debouncedPostRef.current);
      }
      debouncedPostRef.current = setTimeout(() => {
        onContentChange(v);
        debouncedPostRef.current = null;
      }, CONTENT_DEBOUNCE_MS);
    },
    [onContentChange],
  );

  // Cleanup pending timer on path change + unmount. Without this a
  // fast-typing vibecoder who clicks a different element gets one
  // stale post arriving after the new element is selected, mutating
  // the WRONG path.
  useEffect(() => {
    return () => {
      if (debouncedPostRef.current !== null) {
        clearTimeout(debouncedPostRef.current);
        debouncedPostRef.current = null;
      }
    };
  }, [info.path]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Link text
        </span>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            postText(e.target.value);
          }}
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Goes to
        </span>
        <input
          type="text"
          value={href}
          onChange={(e) => {
            setHref(e.target.value);
            onLinkChange(e.target.value);
          }}
          placeholder="https://... or /relative/path"
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>

      {/* 2026-05-17 — Color + background pickers ported from TextControls.
          Critical for button-styled <a> (Tailwind utility buttons) where
          the vibecoder wants to change the button color. Harmless on
          plain text links — user can ignore the bg picker if their link
          has no visible bg. */}
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Color
          </span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                onStyleChange({ color: e.target.value });
              }}
              className="h-10 w-10 cursor-pointer border-2 border-ink"
              aria-label="Text color"
            />
            <span className="font-mono text-[11px] text-ink">{color}</span>
          </div>
        </label>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Background
          </span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={bg}
              onChange={(e) => {
                setBg(e.target.value);
                onStyleChange({ backgroundColor: e.target.value });
              }}
              className="h-10 w-10 cursor-pointer border-2 border-ink"
              aria-label="Background color"
            />
            <span className="font-mono text-[11px] text-ink">{bg}</span>
          </div>
        </label>
      </div>

      {onClassesChange && (
        <TextTypographyExtras
          classes={info.classes ?? ""}
          onClassesChange={onClassesChange}
        />
      )}

      {/* 2026-05-17 — "Style as button" action. Only shown when this
          link doesn't already have button chrome (per isLinkStyledAsButton).
          One-click conversion: appends Tailwind utility chrome to the
          class list. After application, the iframe re-emits vibe:selected
          with the new classes → isLinkStyledAsButton flips true → this
          chip hides, header flips to "Button", swap-category flips to
          "buttons". Vibecoder can immediately tweak color via the picker
          above. Undo (or Save now's history entry) reverts cleanly. */}
      {onClassesChange && !isLinkStyledAsButton(info) && (
        <button
          type="button"
          onClick={() => {
            const current = (info.classes || "").trim();
            // Naive append — Tailwind tolerates duplicate utility classes
            // (last-wins at the cascade level for declarations; class
            // tokens themselves dedupe in the class attribute parser).
            // If a vibecoder clicks twice somehow, we get a harmless
            // double token.
            const next = current
              ? `${current} ${BUTTON_CHROME_CLASSES}`
              : BUTTON_CHROME_CLASSES;
            onClassesChange(next);
          }}
          title="Make this link look like a button — adds bg color, rounded corners, padding. Customize with the color pickers above."
          className="w-full border-2 border-coral bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-coral hover:bg-coral hover:text-paper"
        >
          ✨ Style as button
        </button>
      )}

      <SwapComponentButton onClick={onComponentSwap} />
    </div>
  );
}
