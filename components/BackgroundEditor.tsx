"use client";

import { useMemo, useState } from "react";
import {
  PATTERNS,
  parsePatternClasses,
  parseGradientClasses,
  tailwindClassesForGradient,
  GRADIENT_DIRECTIONS,
  type GradientDirection,
  tailwindClassesForImage,
  tailwindClassesForPattern,
  hexWithAlpha,
} from "@/lib/patterns";
import { stripAllBg } from "@/lib/tailwind-slider-maps";
import { findPaletteClass, nearbyPaletteName } from "@/lib/tailwind-palette";
import EyedropperButton from "./EyedropperButton";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:BackgroundEditor] ${msg}`, data ?? "");
}

type BgMode = "color" | "pattern" | "gradient" | "image";

interface BackgroundEditorProps {
  classes: string[];
  onChange: (next: string[]) => void;
}

export default function BackgroundEditor({
  classes,
  onChange,
}: BackgroundEditorProps) {
  const detected = useMemo(() => detectBgMode(classes), [classes]);
  const [mode, setMode] = useState<BgMode>(detected || "color");

  const hasAnyBg = detected !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">Background</span>
        {hasAnyBg && (
          <button
            type="button"
            onClick={() => { log("click Clear background"); onChange(stripAllBg(classes)); }}
            className="px-1 font-mono text-[10px] text-muted hover:text-coral"
            title="Clear background"
          >
            × clear
          </button>
        )}
      </div>

      <div className="seg-group">
        {(["color", "pattern", "gradient", "image"] as BgMode[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={m === mode}
            onClick={() => setMode(m)}
            className="seg-btn"
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "color" && (
        <ColorPane classes={classes} onChange={onChange} />
      )}
      {mode === "pattern" && (
        <PatternPane classes={classes} onChange={onChange} />
      )}
      {mode === "gradient" && (
        <GradientPane classes={classes} onChange={onChange} />
      )}
      {mode === "image" && (
        <ImagePane classes={classes} onChange={onChange} />
      )}
    </div>
  );
}

// --- Color mode ---------------------------------------------------------

function ColorPane({
  classes,
  onChange,
}: {
  classes: string[];
  onChange: (next: string[]) => void;
}) {
  const existing = useMemo(() => detectColor(classes), [classes]);
  const [hex, setHex] = useState<string>(existing?.hex || "#F5F1EA");
  const [alpha, setAlpha] = useState<number>(existing?.alpha ?? 100);

  function apply(nextHex: string, nextAlpha: number) {
    const cls =
      nextAlpha >= 100
        ? `bg-[${nextHex}]`
        : `bg-[${nextHex}]/${Math.round(nextAlpha)}`;
    onChange([...stripAllBg(classes), cls]);
  }

  // Show "≈ slate-500" label when the picked hex maps cleanly to a Tailwind
  // palette swatch. Pure presentation — does not change what the picker
  // commits (still `bg-[#hex]`). Helps users recognize palette-derived
  // colors and identify near-matches when editing arbitrary hex.
  const paletteLabel = useMemo(() => nearbyPaletteName(hex), [hex]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            const v = e.target.value.toUpperCase();
            setHex(v);
            apply(v, alpha);
          }}
          className="dropin-color"
          aria-label="Background color"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
              const up = v.toUpperCase();
              setHex(up);
              apply(up, alpha);
            } else {
              setHex(v);
            }
          }}
          className="flex-1 border border-ink bg-card px-2 py-1 font-mono text-[11px] text-ink focus:border-coral focus:outline-none"
        />
        <EyedropperButton
          ariaLabel="Pick background color from screen"
          onPick={(picked) => {
            setHex(picked);
            apply(picked, alpha);
          }}
        />
      </div>
      {paletteLabel && (
        <p className="font-mono text-[10px] text-muted">
          ≈ <span className="text-coral">{paletteLabel}</span>
        </p>
      )}
      <SliderTrio
        label="Opacity"
        value={alpha}
        min={0}
        max={100}
        step={5}
        formatted={`${Math.round(alpha)}%`}
        onChange={(v) => {
          setAlpha(v);
          apply(hex, v);
        }}
      />
    </div>
  );
}

// --- Pattern mode -------------------------------------------------------

function PatternPane({
  classes,
  onChange,
}: {
  classes: string[];
  onChange: (next: string[]) => void;
}) {
  // ROADMAP §4.3 #17 — pre-fill state from any pattern already present in
  // the source so re-opening the tab on a template that uses, say, a
  // diagonal stripe doesn't snap back to dots on the first slider tweak.
  // `useState` lazy-init runs once per mount; FocusEditor remounts the
  // section per selection (`key={locKey(selection.loc)}`) so this fires
  // exactly when the user opens a different element.
  const detected = parsePatternClasses(classes);
  const [patternId, setPatternId] = useState<string>(detected?.patternId ?? "dots");
  const [strokeHex, setStrokeHex] = useState<string>(detected?.strokeHex ?? "#0F0F0F");
  const [strokeAlpha, setStrokeAlpha] = useState<number>(detected?.strokeAlpha ?? 20);
  const [baseHex, setBaseHex] = useState<string>(detected?.baseHex ?? "#F5F1EA");
  const [baseEnabled, setBaseEnabled] = useState<boolean>(detected?.baseHex != null);
  const [scale, setScale] = useState<number>(detected?.scale ?? 16);

  const pattern = PATTERNS.find((p) => p.id === patternId) || PATTERNS[0];

  function apply(next: Partial<{
    patternId: string;
    strokeHex: string;
    strokeAlpha: number;
    baseHex: string;
    baseEnabled: boolean;
    scale: number;
  }>) {
    const nextPid = next.patternId ?? patternId;
    const nextStroke = next.strokeHex ?? strokeHex;
    const nextAlpha = next.strokeAlpha ?? strokeAlpha;
    const nextBase = next.baseHex ?? baseHex;
    const nextBaseEnabled = next.baseEnabled ?? baseEnabled;
    const nextScale = next.scale ?? scale;

    const p = PATTERNS.find((x) => x.id === nextPid) || PATTERNS[0];
    const color = hexWithAlpha(nextStroke, nextAlpha / 100);
    const patternClasses = tailwindClassesForPattern(p, {
      color,
      scale: nextScale,
      baseColor: nextBaseEnabled ? nextBase : undefined,
    });
    onChange([...stripAllBg(classes), ...patternClasses]);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPatternId(p.id);
              apply({ patternId: p.id });
            }}
            aria-pressed={p.id === patternId}
            className={
              "group relative flex aspect-square items-end justify-start border-2 p-1 text-left transition-colors " +
              (p.id === patternId
                ? "border-coral ring-2 ring-coral/30"
                : "border-ink hover:bg-soft")
            }
            style={{
              backgroundColor: "#FFFFFF",
              backgroundImage: p.css({ color: "#0F0F0F66", scale: 10 }).image,
              backgroundSize: p.css({ color: "#0F0F0F66", scale: 10 }).size,
            }}
            title={p.label}
          >
            <span className="rounded-sm bg-paper px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-ink">
              {p.label}
            </span>
          </button>
        ))}
      </div>

      <ColorWithAlpha
        label="Pattern"
        hex={strokeHex}
        alpha={strokeAlpha}
        onHexChange={(v) => {
          setStrokeHex(v);
          apply({ strokeHex: v });
        }}
        onAlphaChange={(v) => {
          setStrokeAlpha(v);
          apply({ strokeAlpha: v });
        }}
      />

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 font-mono text-[11px] text-ink">
          <input
            type="checkbox"
            checked={baseEnabled}
            onChange={(e) => {
              const v = e.target.checked;
              setBaseEnabled(v);
              apply({ baseEnabled: v });
            }}
            className="h-3 w-3 accent-coral"
          />
          Base color
        </label>
        <input
          type="color"
          value={baseHex}
          disabled={!baseEnabled}
          onChange={(e) => {
            const v = e.target.value.toUpperCase();
            setBaseHex(v);
            apply({ baseHex: v });
          }}
          className="dropin-color disabled:opacity-50"
        />
        <span className="flex-1 font-mono text-[10px] text-coral">
          {baseEnabled ? baseHex : "—"}
        </span>
      </div>

      <SliderTrio
        label="Scale"
        value={scale}
        min={4}
        max={48}
        step={2}
        formatted={`${scale}px`}
        onChange={(v) => {
          setScale(v);
          apply({ scale: v });
        }}
      />
    </div>
  );
}

// --- Gradient mode ------------------------------------------------------

// 8-direction grid mirroring `bg-gradient-to-*` Tailwind class. Order matches
// the visual 3×3 keypad with the center cell omitted (gradients always have
// a direction).
const GRADIENT_DIR_GRID: Array<GradientDirection | null> = [
  "tl", "t",  "tr",
  "l",  null, "r",
  "bl", "b",  "br",
];

const DIR_ARROW: Record<GradientDirection, string> = {
  t: "↑", tr: "↗", r: "→", br: "↘",
  b: "↓", bl: "↙", l: "←", tl: "↖",
};

function GradientPane({
  classes,
  onChange,
}: {
  classes: string[];
  onChange: (next: string[]) => void;
}) {
  // Re-detect on every mount (FocusEditor remounts the section per
  // selection via `key={locKey(selection.loc)}`) so opening a different
  // element re-reads the source rather than carrying stale state.
  const detected = parseGradientClasses(classes);
  const [direction, setDirection] = useState<GradientDirection>(detected?.direction ?? "r");
  const [fromHex, setFromHex] = useState<string>(detected?.fromHex ?? "#FF4D2E");
  const [fromAlpha, setFromAlpha] = useState<number>(detected?.fromAlpha ?? 100);
  const [viaEnabled, setViaEnabled] = useState<boolean>(detected?.viaHex != null);
  const [viaHex, setViaHex] = useState<string>(detected?.viaHex ?? "#F5F1EA");
  const [viaAlpha, setViaAlpha] = useState<number>(detected?.viaAlpha ?? 100);
  const [toHex, setToHex] = useState<string>(detected?.toHex ?? "#0F0F0F");
  const [toAlpha, setToAlpha] = useState<number>(detected?.toAlpha ?? 100);

  function apply(next: Partial<{
    direction: GradientDirection;
    fromHex: string;
    fromAlpha: number;
    viaEnabled: boolean;
    viaHex: string;
    viaAlpha: number;
    toHex: string;
    toAlpha: number;
  }>) {
    const nd = next.direction ?? direction;
    const nfh = next.fromHex ?? fromHex;
    const nfa = next.fromAlpha ?? fromAlpha;
    const nve = next.viaEnabled ?? viaEnabled;
    const nvh = next.viaHex ?? viaHex;
    const nva = next.viaAlpha ?? viaAlpha;
    const nth = next.toHex ?? toHex;
    const nta = next.toAlpha ?? toAlpha;

    const gradientClasses = tailwindClassesForGradient({
      direction: nd,
      fromHex: nfh,
      fromAlpha: nfa,
      viaHex: nve ? nvh : undefined,
      viaAlpha: nve ? nva : undefined,
      toHex: nth,
      toAlpha: nta,
    });
    onChange([...stripAllBg(classes), ...gradientClasses]);
  }

  // Live preview swatch — uses the same hex+alpha math the patcher will write
  // so the user sees what they're committing.
  const previewBg = useMemo(() => {
    const fromCol = hexWithAlpha(fromHex, fromAlpha / 100);
    const toCol = hexWithAlpha(toHex, toAlpha / 100);
    const cssDir = TAILWIND_DIR_TO_CSS[direction];
    if (viaEnabled) {
      const viaCol = hexWithAlpha(viaHex, viaAlpha / 100);
      return `linear-gradient(${cssDir}, ${fromCol}, ${viaCol}, ${toCol})`;
    }
    return `linear-gradient(${cssDir}, ${fromCol}, ${toCol})`;
  }, [direction, fromHex, fromAlpha, viaEnabled, viaHex, viaAlpha, toHex, toAlpha]);

  return (
    <div className="space-y-3">
      <div
        aria-hidden="true"
        className="h-16 w-full border-2 border-ink"
        style={{ backgroundImage: previewBg }}
      />

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Direction
        </label>
        <div className="inline-grid grid-cols-3 gap-0 border-2 border-ink">
          {GRADIENT_DIR_GRID.map((d, i) => {
            if (!d) {
              return (
                <div
                  key={i}
                  className={
                    "h-7 w-9 bg-soft" +
                    (i % 3 !== 0 ? " border-l border-ink" : "") +
                    (i >= 3 ? " border-t border-ink" : "")
                  }
                />
              );
            }
            const active = d === direction;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                aria-label={`Direction ${d}`}
                onClick={() => {
                  setDirection(d);
                  apply({ direction: d });
                }}
                className={
                  "flex h-7 w-9 items-center justify-center font-mono text-[12px] transition-colors " +
                  (active ? "bg-coral text-paper" : "bg-paper text-ink hover:bg-soft") +
                  (i % 3 !== 0 ? " border-l border-ink" : "") +
                  (i >= 3 ? " border-t border-ink" : "")
                }
              >
                {DIR_ARROW[d]}
              </button>
            );
          })}
        </div>
      </div>

      <ColorWithAlpha
        label="From"
        hex={fromHex}
        alpha={fromAlpha}
        onHexChange={(v) => { setFromHex(v); apply({ fromHex: v }); }}
        onAlphaChange={(v) => { setFromAlpha(v); apply({ fromAlpha: v }); }}
      />

      <div>
        <label className="flex items-center gap-1 font-mono text-[11px] text-ink">
          <input
            type="checkbox"
            checked={viaEnabled}
            onChange={(e) => {
              const v = e.target.checked;
              setViaEnabled(v);
              apply({ viaEnabled: v });
            }}
            className="h-3 w-3 accent-coral"
          />
          Via (3-stop)
        </label>
        {viaEnabled && (
          <div className="mt-2">
            <ColorWithAlpha
              label="Via"
              hex={viaHex}
              alpha={viaAlpha}
              onHexChange={(v) => { setViaHex(v); apply({ viaHex: v }); }}
              onAlphaChange={(v) => { setViaAlpha(v); apply({ viaAlpha: v }); }}
            />
          </div>
        )}
      </div>

      <ColorWithAlpha
        label="To"
        hex={toHex}
        alpha={toAlpha}
        onHexChange={(v) => { setToHex(v); apply({ toHex: v }); }}
        onAlphaChange={(v) => { setToAlpha(v); apply({ toAlpha: v }); }}
      />
    </div>
  );
}

// CSS-side direction strings used ONLY for the live preview swatch — the
// committed Tailwind class is `bg-gradient-to-<dir>` per Tailwind's
// vocabulary and Tailwind handles the CSS direction at build time.
const TAILWIND_DIR_TO_CSS: Record<GradientDirection, string> = {
  t: "to top",
  tr: "to top right",
  r: "to right",
  br: "to bottom right",
  b: "to bottom",
  bl: "to bottom left",
  l: "to left",
  tl: "to top left",
};

// --- Image mode ---------------------------------------------------------

function ImagePane({
  classes,
  onChange,
}: {
  classes: string[];
  onChange: (next: string[]) => void;
}) {
  const [url, setUrl] = useState<string>("");
  const [fit, setFit] = useState<"cover" | "contain" | "auto">("cover");
  const [position, setPosition] = useState<Position>("center");
  const [overlayHex, setOverlayHex] = useState<string>("#0F0F0F");
  const [overlayAlpha, setOverlayAlpha] = useState<number>(0); // 0 = no overlay

  function apply(next: Partial<{
    url: string;
    fit: "cover" | "contain" | "auto";
    position: Position;
    overlayHex: string;
    overlayAlpha: number;
  }>) {
    const nextUrl = next.url ?? url;
    if (!nextUrl) {
      onChange(stripAllBg(classes));
      return;
    }
    const nextFit = next.fit ?? fit;
    const nextPos = next.position ?? position;
    const nextOverlayHex = next.overlayHex ?? overlayHex;
    const nextOverlayAlpha = next.overlayAlpha ?? overlayAlpha;

    const overlay =
      nextOverlayAlpha > 0
        ? hexWithAlpha(nextOverlayHex, nextOverlayAlpha / 100)
        : undefined;

    const imgClasses = tailwindClassesForImage({
      url: nextUrl,
      fit: nextFit,
      position: nextPos,
      overlayHex8: overlay,
    });
    onChange([...stripAllBg(classes), ...imgClasses]);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || "");
      setUrl(data);
      apply({ url: data });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          URL
        </label>
        <textarea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => apply({ url })}
          rows={2}
          placeholder="https://… or paste a URL"
          className="block w-full resize-y border-2 border-ink bg-card p-2 font-mono text-[11px] text-ink placeholder:text-muted focus:border-coral focus:outline-none"
        />
        <label className="mt-2 flex cursor-pointer items-center justify-center border border-ink bg-paper px-2 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          Upload (data URL)
        </label>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Fit
        </label>
        <div className="seg-group">
          {(["cover", "contain", "auto"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === fit}
              onClick={() => {
                setFit(f);
                apply({ fit: f });
              }}
              className="seg-btn"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Position
        </label>
        <PositionGrid
          value={position}
          onChange={(p) => {
            setPosition(p);
            apply({ position: p });
          }}
        />
      </div>

      <ColorWithAlpha
        label="Overlay"
        hex={overlayHex}
        alpha={overlayAlpha}
        onHexChange={(v) => {
          setOverlayHex(v);
          apply({ overlayHex: v });
        }}
        onAlphaChange={(v) => {
          setOverlayAlpha(v);
          apply({ overlayAlpha: v });
        }}
        hint={overlayAlpha === 0 ? "0% = no overlay" : undefined}
      />
    </div>
  );
}

// --- reusable sub-primitives --------------------------------------------

function ColorWithAlpha({
  label,
  hex,
  alpha,
  onHexChange,
  onAlphaChange,
  hint,
}: {
  label: string;
  hex: string;
  alpha: number;
  onHexChange: (v: string) => void;
  onAlphaChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">{label}</span>
        <span className="font-mono text-[10px] text-coral">
          {hex}
          {alpha < 100 ? ` · ${Math.round(alpha)}%` : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => onHexChange(e.target.value.toUpperCase())}
          className="dropin-color"
          aria-label={`${label} color`}
        />
        <EyedropperButton
          ariaLabel={`Pick ${label.toLowerCase()} color from screen`}
          onPick={(picked) => onHexChange(picked)}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={alpha}
          onChange={(e) => onAlphaChange(Number(e.target.value))}
          className="dropin-slider flex-1"
          aria-label={`${label} opacity`}
        />
      </div>
      {hint && (
        <p className="mt-1 font-mono text-[10px] text-muted">{hint}</p>
      )}
    </div>
  );
}

function SliderTrio({
  label,
  value,
  min,
  max,
  step,
  formatted,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatted: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink">{label}</span>
        <span className="font-mono text-[10px] text-coral">{formatted}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="dropin-slider"
      />
    </div>
  );
}

type Position =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

function PositionGrid({
  value,
  onChange,
}: {
  value: Position;
  onChange: (v: Position) => void;
}) {
  const cells: Position[] = [
    "top-left",
    "top",
    "top-right",
    "left",
    "center",
    "right",
    "bottom-left",
    "bottom",
    "bottom-right",
  ];
  return (
    <div className="inline-grid grid-cols-3 gap-0 border-2 border-ink">
      {cells.map((p, i) => {
        const active = p === value;
        return (
          <button
            key={p}
            type="button"
            aria-pressed={active}
            aria-label={p}
            onClick={() => onChange(p)}
            className={
              "h-6 w-8 transition-colors " +
              (active
                ? "bg-coral"
                : "bg-paper hover:bg-soft") +
              (i % 3 !== 0 ? " border-l border-ink" : "") +
              (i >= 3 ? " border-t border-ink" : "")
            }
          />
        );
      })}
    </div>
  );
}

// --- detection ----------------------------------------------------------

function detectBgMode(classes: string[]): BgMode | null {
  // Native Tailwind directional gradient (`bg-gradient-to-*` + from/via/to
  // stops) is its own mode now (§4.3 #21). Detect it BEFORE the bracketed
  // arbitrary-value path so a template that uses both palette stops and an
  // arbitrary `bg-[#hex]` color doesn't get misclassified.
  if (classes.some((c) => /^bg-gradient-to-(?:t|tr|r|br|b|bl|l|tl)$/.test(c))) {
    return "gradient";
  }
  const bg = classes.find((c) => c.startsWith("bg-["));
  if (bg) {
    if (bg.includes("url(")) return "image";
    if (bg.includes("gradient(")) return "pattern";
    return "color";
  }
  if (classes.some((c) => isPaletteBgClass(c))) return "color";
  return null;
}

function isPaletteBgClass(c: string): boolean {
  return /^bg-(transparent|current|black|white|(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950))(\/\d+)?$/.test(
    c
  );
}

function detectColor(classes: string[]): { hex: string; alpha: number } | null {
  // Arbitrary-hex form (`bg-[#abc]`, `bg-[#abcdef]`, `bg-[#abcdef80]/50`)
  // wins when present — that's the inspector's own commit shape, so it
  // round-trips bit-identically.
  for (const c of classes) {
    const arb = c.match(/^bg-\[#([0-9a-fA-F]{3,8})\](?:\/(\d+))?$/);
    if (arb) {
      let raw = arb[1];
      if (raw.length === 3) raw = raw.split("").map((x) => x + x).join("");
      if (raw.length >= 6) {
        const base = "#" + raw.slice(0, 6).toUpperCase();
        const alphaFromHex = raw.length === 8 ? (parseInt(raw.slice(6, 8), 16) / 255) * 100 : 100;
        const alphaFromSuffix = arb[2] ? Number(arb[2]) : alphaFromHex;
        return { hex: base, alpha: alphaFromSuffix };
      }
    }
  }
  // Palette form (`bg-slate-500`, `bg-slate-500/30`, `bg-white`). Maps to
  // the closest fixed hex in `lib/tailwind-palette.ts`. `transparent` /
  // `current` / `inherit` carry no hex and resolve to the picker fallback;
  // we still report them so the rest of the picker UI initializes.
  const palette = findPaletteClass(classes, "bg");
  if (palette) {
    return {
      hex: palette.hex,
      alpha: palette.alpha ?? 100,
    };
  }
  return null;
}
