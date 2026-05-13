"use client";

// Per-element typography sliders for the vibe-edit text panel. Renders
// ONLY the controls whose corresponding Tailwind class is already
// present on the element (per the user's "show what knobs exist"
// framing). Reuses tailwind-slider-maps' currentIndex / setScale /
// unsetScale on a string[] of classes; the parent provides the live
// classes via VibeElementInfo and receives newClasses via
// onClassesChange.

import { useId } from "react";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  TRACKING,
  TEXT_ALIGN_MATCH,
  TEXT_ALIGNS,
  textAlignClass,
  currentIndex,
  setScale,
  unsetScale,
  setToken,
  type ScaleProp,
  type TextAlign,
} from "@/lib/tailwind-slider-maps";
import {
  detectTypographyProps,
  type TypographyProps,
} from "@/lib/vibe-edit/typography";

interface TextTypographyExtrasProps {
  classes: string;
  onClassesChange: (newClasses: string) => void;
}

export default function TextTypographyExtras({
  classes,
  onClassesChange,
}: TextTypographyExtrasProps) {
  const present: TypographyProps = detectTypographyProps(classes);
  if (
    !present.fontSize &&
    !present.fontWeight &&
    !present.lineHeight &&
    !present.tracking &&
    !present.textAlign
  ) {
    return null;
  }

  const tokens = (classes || "").split(/\s+/).filter((t) => t.length > 0);

  function commit(next: string[]) {
    onClassesChange(next.join(" "));
  }

  return (
    <div className="space-y-3 border-t-2 border-ink/15 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Typography
      </p>

      {present.fontSize && (
        <SliderRow
          label="Size"
          tokens={tokens}
          prop={FONT_SIZE}
          onChange={commit}
        />
      )}
      {present.fontWeight && (
        <SliderRow
          label="Weight"
          tokens={tokens}
          prop={FONT_WEIGHT}
          onChange={commit}
        />
      )}
      {present.lineHeight && (
        <SliderRow
          label="Line height"
          tokens={tokens}
          prop={LINE_HEIGHT}
          onChange={commit}
        />
      )}
      {present.tracking && (
        <SliderRow
          label="Letter spacing"
          tokens={tokens}
          prop={TRACKING}
          onChange={commit}
        />
      )}
      {present.textAlign && (
        <AlignSegmented tokens={tokens} onChange={commit} />
      )}
    </div>
  );
}

interface SliderRowProps {
  label: string;
  tokens: string[];
  prop: ScaleProp;
  onChange: (next: string[]) => void;
}

function SliderRow({ label, tokens, prop, onChange }: SliderRowProps) {
  // useId gives a unique, hydration-safe ID per slider instance. Lets us
  // pair a real <label htmlFor> with the <input type="range"> — clicking
  // the visible "Size" / "Weight" / etc. label now focuses the slider
  // and (on assistive tech) reads the label as the slider's name.
  const sliderId = useId();
  const idx = currentIndex(tokens, prop);
  // When detectTypographyProps matched a prop but currentIndex returns
  // -1, the element has the prop set via an arbitrary value class
  // (e.g. `text-[12px]`, `tracking-[0.18em]`) that's outside the fixed
  // Tailwind scale. Dragging the slider in that state would silently
  // overwrite the arbitrary value with the smallest scale step — the
  // user would think their custom value got "rounded" with no way to
  // recover. Show the slider disabled with a "custom" indicator and
  // leave the unset (×) button as the only escape.
  const isCustom = idx < 0;
  const sliderValue = idx >= 0 ? idx : 0;
  const display = idx >= 0 ? prop.toClass(prop.scale[idx]) : "custom";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label
          htmlFor={sliderId}
          className="font-mono text-[11px] text-ink cursor-pointer"
        >
          {label}
        </label>
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[10px] text-coral"
            title={isCustom ? "Arbitrary value — slider disabled" : undefined}
          >
            {display}
          </span>
          <button
            type="button"
            onClick={() => onChange(unsetScale(tokens, prop))}
            className="px-1 font-mono text-[10px] text-muted hover:text-coral"
            aria-label={`Remove ${label.toLowerCase()}`}
            title="Remove"
          >
            ×
          </button>
        </div>
      </div>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={prop.scale.length - 1}
        value={sliderValue}
        onChange={(e) => onChange(setScale(tokens, prop, Number(e.target.value)))}
        disabled={isCustom}
        aria-disabled={isCustom || undefined}
        className={`dropin-slider${isCustom ? " cursor-not-allowed opacity-40" : ""}`}
        title={
          isCustom
            ? "Remove the custom value (×) to use the scale slider"
            : undefined
        }
      />
    </div>
  );
}

interface AlignSegmentedProps {
  tokens: string[];
  onChange: (next: string[]) => void;
}

function AlignSegmented({ tokens, onChange }: AlignSegmentedProps) {
  const current = (TEXT_ALIGNS as readonly TextAlign[]).find((a) =>
    tokens.includes(`text-${a}`),
  );
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">Align</span>
        <span className="font-mono text-[10px] text-coral">
          {current ?? "—"}
        </span>
      </div>
      <div className="flex border-2 border-ink">
        {(TEXT_ALIGNS as readonly TextAlign[]).map((a) => {
          const active = a === current;
          return (
            <button
              key={a}
              type="button"
              onClick={() => onChange(setToken(tokens, TEXT_ALIGN_MATCH, textAlignClass(a)))}
              className={
                "flex-1 border-r-2 border-ink/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] last:border-r-0 " +
                (active
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-soft")
              }
              aria-pressed={active}
            >
              {a}
            </button>
          );
        })}
      </div>
    </div>
  );
}
