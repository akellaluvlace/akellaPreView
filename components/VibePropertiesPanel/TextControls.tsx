"use client";

// Vibe-edit text controls: content + text/bg color pickers. Used
// for kind in {text, heading, button} — buttons are styled text
// from a vibecoder's POV (the underlying <button> tag's behaviour
// stays).
//
// onContentChange / onStyleChange fire on every keystroke / colour
// pick. Workspace pipes them through to the iframe via direct
// vibe:update-* postMessages so the user sees changes instantly
// without any source rebuild. Source reconciliation happens lazily
// in Workspace via buildVibeCommit on idle.

import { useCallback, useEffect, useRef, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import { rgbToHex } from "@/lib/vibe-edit/rgb-to-hex";
import TextTypographyExtras from "./TextTypographyExtras";
import { SwapComponentButton } from "../VibePropertiesPanel";

// TextControls owns the background colour picker, so transparent bg
// should NOT render as a black square (indistinguishable from a black
// text-colour swatch). White is the readable fallback.
const RGB_OPTS = { transparentFallback: "#ffffff" } as const;

// 80ms is the sweet spot: typing at 80wpm is ~6.7 chars/sec, one char
// every ~150ms. An 80ms debounce coalesces back-to-back fast keystrokes
// (the kind that fire when the user holds a key or does an autocomplete
// paste) without adding perceptible lag for normal typing rhythms.
// Lower than 80ms isn't useful — keystroke timing IS the bound. Higher
// feels laggy on the preview.
const CONTENT_DEBOUNCE_MS = 80;

interface TextControlsProps {
  info: VibeElementInfo;
  onContentChange: (text: string) => void;
  onStyleChange: (styles: { color?: string; backgroundColor?: string }) => void;
  // Optional class-list mutation. Wired through Workspace's
  // handleVibeClasses → vibe:update-classes postMessage. Absent in
  // contexts that haven't enabled typography sliders (the panel
  // section just doesn't render).
  onClassesChange?: (newClasses: string) => void;
  // Opens the Components library modal so the user can swap this
  // text / heading / button for a different component. Optional so
  // contexts without library access just don't render the button.
  onComponentSwap?: () => void;
}

export default function TextControls({
  info,
  onContentChange,
  onStyleChange,
  onClassesChange,
  onComponentSwap,
}: TextControlsProps) {
  const [text, setText] = useState(info.text);
  const [color, setColor] = useState(rgbToHex(info.textColor, RGB_OPTS));
  const [bg, setBg] = useState(rgbToHex(info.bgColor, RGB_OPTS));

  // Sync local input state with whatever the iframe last reported.
  // Keyed on path so switching to a different element reseeds; text
  // / colour deps reseed when an external edit changes the element.
  useEffect(() => {
    setText(info.text);
    setColor(rgbToHex(info.textColor, RGB_OPTS));
    setBg(rgbToHex(info.bgColor, RGB_OPTS));
  }, [info.path, info.text, info.textColor, info.bgColor]);

  // Debounced post of onContentChange. Without this every keystroke
  // posts vibe:update-content to the iframe → runtime does a
  // querySelector → textContent write → vibeSerialize (forces reflow
  // via getComputedStyle) → re-emits vibe:selected to host → Workspace
  // re-renders the panel. At 80wpm that's ~10 messages/sec each doing
  // a forced reflow — the kind of thing that makes editors feel laggy
  // without an obvious cause.
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
  // the WRONG path (the runtime resolves d.path at fire-time, not at
  // queue-time). Path is the selection key, so this fires on selection
  // change as well as full unmount.
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
          Text
        </span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);  // instant local state — no input lag
            postText(e.target.value); // debounced iframe post
          }}
          rows={3}
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
        {/* 2026-05-15 — text-case transforms. Vibecoders frequently get
            text from AI in an unwanted case (everything lowercase, or
            ALL CAPS for emphasis where they want title). Pure JS string
            transforms, no API, no risk. Each button mutates local state
            + posts through the same debounced path so the iframe sees
            the change instantly. */}
        <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label="Text case">
          {(
            [
              { id: "upper", label: "ALL CAPS", fn: (s: string) => s.toUpperCase() },
              { id: "title", label: "Title", fn: titleCase },
              { id: "sentence", label: "Sentence", fn: sentenceCase },
              { id: "lower", label: "lowercase", fn: (s: string) => s.toLowerCase() },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                const next = t.fn(text);
                if (next === text) return;
                setText(next);
                postText(next);
              }}
              title={`Transform text to ${t.label}`}
              className="border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper"
            >
              {t.label}
            </button>
          ))}
        </div>
      </label>

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

      <SwapComponentButton onClick={onComponentSwap} />
    </div>
  );
}

// 2026-05-15 — Title Case: uppercase first letter of every word.
// Doesn't try to be smart about minor words ("the", "of") — keep it
// predictable so the vibecoder gets exactly what they see.
function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

// 2026-05-15 — Sentence case: lowercase everything, then uppercase the
// first letter of each sentence. Sentence boundary = start-of-string OR
// `.!?` followed by whitespace. Tolerates multi-line input.
function sentenceCase(s: string): string {
  const lower = s.toLowerCase();
  return lower.replace(/(^|[.!?]\s+)(\p{L})/gu, (_, prefix, letter) =>
    prefix + (letter as string).toUpperCase(),
  );
}

