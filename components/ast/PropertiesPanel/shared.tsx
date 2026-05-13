"use client";

// Phase 2 Step 9 (Properties Panel) shared primitives. Used by the
// Sizing / Spacing / Radius sections to render numeric+unit inputs and
// the visual 4-side / 4-corner controls. Source-driven: the canonical
// value for each input lives in `code` (the Workspace source buffer)
// and is read via `lib/ast/style-source-read.ts readSourceStyle`. On
// commit (blur / Enter) the panel calls `applyStyleProps` to rewrite
// source. No live preview during typing — the canonical iframe rebuild
// at ~250ms after commit is fast enough for v1; spec-aspirational
// <50ms latency target is deferred to a Phase 4 polish.
//
// Editorial/brutalist styling matches the rest of FocusEditor — heavy
// 2px ink borders, mono labels, coral hover/active states. No coral
// fills inside form fields (would clash with the focus glow).

import { useEffect, useState } from "react";

// ---------- value parsing ----------

// Common CSS units the panel offers via UnitSelect. Matches the
// `ResizeUnit` shape in `lib/ast/intent-resolver.ts` so a future
// resolver-routed commit path picks up the same unit names.
export type Unit = "px" | "rem" | "em" | "%" | "auto";
export const UNIT_OPTIONS: readonly Unit[] = ["px", "rem", "em", "%", "auto"];

// Parse "12px" → { num: 12, unit: "px" }. Recovers gracefully on
// malformed input: "" → { num: null, unit: "px" }, "auto" →
// { num: null, unit: "auto" }, "abc" → { num: null, unit: "px" }.
// "0" with no unit → { num: 0, unit: "px" } (numeric literal in JSX
// style auto-suffixed with px by React; we surface it as px).
export function parseValue(s: string | undefined): {
  num: number | null;
  unit: Unit;
} {
  if (!s) return { num: null, unit: "px" };
  const trimmed = s.trim();
  if (trimmed === "" || trimmed.toLowerCase() === "auto") {
    return { num: null, unit: trimmed.toLowerCase() === "auto" ? "auto" : "px" };
  }
  // Match: optional sign + digits + optional fraction + optional unit
  const m = /^(-?\d*\.?\d+)\s*(px|rem|em|%|)?$/i.exec(trimmed);
  if (!m) return { num: null, unit: "px" };
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return { num: null, unit: "px" };
  const u = (m[2] || "px").toLowerCase() as Unit;
  if (!UNIT_OPTIONS.includes(u)) return { num: n, unit: "px" };
  return { num: n, unit: u };
}

// Inverse: turn a num+unit pair into a CSS string. Returns `null` when
// the result would be meaningless (no number AND not `auto`) — caller
// passes `null` to `applyStyleProps` to REMOVE the prop entirely.
export function formatValue(
  num: number | null,
  unit: Unit
): string | null {
  if (unit === "auto") return "auto";
  if (num === null) return null;
  // Whole numbers stay integer; fractional ones keep up to 4 decimals
  // (user-typed precision usually doesn't exceed that — and JSX style
  // doesn't gain anything from `12.0000` over `12`).
  const out = Number.isInteger(num)
    ? String(num)
    : Number(num.toFixed(4)).toString();
  return `${out}${unit}`;
}

// ---------- input primitives ----------

export interface ValueInputProps {
  // Current value (e.g. "12px", "0.5rem", "auto", or "" for empty).
  // Passed from the caller after `readSourceStyle` lookup. Updates from
  // outside (e.g. Cmd-Z, dice roll, gesture commit) propagate via a
  // `useEffect` that rehydrates `local` whenever this changes.
  value: string;
  // Commit handler. Receives the new CSS string ("16px" / "auto") OR
  // `null` to signal "remove this prop entirely". Caller routes through
  // `applyStyleProps`.
  onCommit: (next: string | null) => void;
  // Optional placeholder. Used for the spacing 4-side inputs ("0").
  placeholder?: string;
  // Optional override for the numeric input width. Defaults match
  // typical 2-3 digit numbers in the brutalist mono font.
  className?: string;
  // Disable the input + unit select. Used by Min/Max under "More"
  // when the parent container is hidden, but kept around for any
  // other consumer that needs it.
  disabled?: boolean;
}

// Single value editor: numeric input + unit dropdown side-by-side.
// Commits on blur OR Enter. Esc reverts to the prop value (matching
// FocusEditor's inline-text-editor convention).
export function ValueInput({
  value,
  onCommit,
  placeholder,
  className,
  disabled = false,
}: ValueInputProps) {
  const parsed = parseValue(value);
  // Local mirror: lets the user type freely without each keystroke
  // round-tripping through source. The initial state derives from
  // `value`; changes from outside re-sync via `useEffect` below.
  const [localNum, setLocalNum] = useState<string>(
    parsed.num !== null ? String(parsed.num) : ""
  );
  const [localUnit, setLocalUnit] = useState<Unit>(parsed.unit);

  useEffect(() => {
    const p = parseValue(value);
    setLocalNum(p.num !== null ? String(p.num) : "");
    setLocalUnit(p.unit);
  }, [value]);

  // Build the commit value from current local state. Returns `null`
  // when the user has cleared the input AND the unit isn't `auto` —
  // matches the "remove this prop" semantic.
  function commit() {
    if (localUnit === "auto") {
      onCommit("auto");
      return;
    }
    const n = localNum.trim() === "" ? null : parseFloat(localNum);
    if (n === null || !Number.isFinite(n)) {
      onCommit(null);
      return;
    }
    onCommit(formatValue(n, localUnit));
  }

  const numericDisabled = disabled || localUnit === "auto";

  return (
    <div className={"flex items-center gap-1 " + (className ?? "")}>
      <input
        type="text"
        inputMode="decimal"
        value={localNum}
        placeholder={placeholder ?? "—"}
        onChange={(e) => setLocalNum(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "Escape") {
            const p = parseValue(value);
            setLocalNum(p.num !== null ? String(p.num) : "");
            setLocalUnit(p.unit);
            (e.target as HTMLInputElement).blur();
          }
        }}
        disabled={numericDisabled}
        className="w-14 border-2 border-ink bg-card px-1.5 py-1 text-right font-mono text-[11px] text-ink focus:border-coral focus:outline-none disabled:bg-soft disabled:text-muted"
      />
      <select
        value={localUnit}
        onChange={(e) => {
          const u = e.target.value as Unit;
          setLocalUnit(u);
          // Commit immediately on unit change — saves a second click on
          // the input. If unit went to "auto" we don't need a number;
          // otherwise we use whatever's already typed (or null if empty).
          if (u === "auto") {
            onCommit("auto");
          } else {
            const n = localNum.trim() === "" ? null : parseFloat(localNum);
            if (n === null || !Number.isFinite(n)) onCommit(null);
            else onCommit(formatValue(n, u));
          }
        }}
        disabled={disabled}
        className="border-2 border-ink bg-paper px-1 py-1 font-mono text-[10px] uppercase tracking-[0.05em] text-ink focus:border-coral focus:outline-none disabled:bg-soft disabled:text-muted"
      >
        {UNIT_OPTIONS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------- link toggle ----------

export function LinkToggle({
  linked,
  onToggle,
  title,
}: {
  linked: boolean;
  onToggle: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={title ?? (linked ? "Unlink sides" : "Link sides")}
      aria-pressed={linked}
      aria-label={linked ? "Unlink sides" : "Link sides"}
      className={
        "flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink font-mono text-xs transition-colors " +
        (linked ? "bg-coral text-paper" : "bg-paper text-ink hover:bg-soft")
      }
    >
      {/* Simple chain glyph — keeps the bundle dep-free vs. pulling
          a lucide icon. Coral fill when active to mirror the seg-btn
          active state used elsewhere in FocusEditor. */}
      <span aria-hidden>{linked ? "⚭" : "⚯"}</span>
    </button>
  );
}

// ---------- 4-side visual control (padding / margin) ----------

export interface FourSideValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export type SideKey = "top" | "right" | "bottom" | "left";

export interface FourSideBoxProps {
  values: FourSideValues;
  // Caller-controlled link state. The parent owns it so a "Link all"
  // toggle can persist across re-renders even when the underlying
  // values change. Initial value is up to the parent (default: linked
  // when all 4 sides are equal, unlinked otherwise).
  linked: boolean;
  onLinkedChange: (next: boolean) => void;
  // Commit a single side. When `linked === true`, the section maps
  // any side commit to all 4 sides — that logic lives in the parent
  // (Spacing/Radius section), NOT here, so this primitive stays pure.
  onSideCommit: (side: SideKey, next: string | null) => void;
  // Optional label shown in the centre cell (e.g. "PAD", "MAR").
  // Helps users tell two FourSideBoxes apart when they're stacked.
  label?: string;
}

// Visual 4-side input arranged in a +-cross. Centre cell holds the
// link toggle and the optional label. Used by Spacing for both
// padding and margin; user can switch between linked-all and
// independent-per-side without losing typed values.
export function FourSideBox({
  values,
  linked,
  onLinkedChange,
  onSideCommit,
  label,
}: FourSideBoxProps) {
  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto auto",
      }}
    >
      {/* Row 1: top input centred. */}
      <div />
      <div className="flex justify-center">
        <ValueInput
          value={values.top}
          onCommit={(v) => onSideCommit("top", v)}
          placeholder="0"
        />
      </div>
      <div />

      {/* Row 2: left, center (link + label), right. */}
      <div className="flex items-center">
        <ValueInput
          value={values.left}
          onCommit={(v) => onSideCommit("left", v)}
          placeholder="0"
        />
      </div>
      <div className="flex items-center justify-center gap-1">
        <LinkToggle
          linked={linked}
          onToggle={() => onLinkedChange(!linked)}
        />
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            {label}
          </span>
        )}
      </div>
      <div className="flex items-center justify-end">
        <ValueInput
          value={values.right}
          onCommit={(v) => onSideCommit("right", v)}
          placeholder="0"
        />
      </div>

      {/* Row 3: bottom input centred. */}
      <div />
      <div className="flex justify-center">
        <ValueInput
          value={values.bottom}
          onCommit={(v) => onSideCommit("bottom", v)}
          placeholder="0"
        />
      </div>
      <div />
    </div>
  );
}

// ---------- 4-corner visual control (border-radius) ----------

export interface FourCornerValues {
  tl: string;
  tr: string;
  br: string;
  bl: string;
}

export type CornerKey = "tl" | "tr" | "br" | "bl";

export interface FourCornerBoxProps {
  values: FourCornerValues;
  linked: boolean;
  onLinkedChange: (next: boolean) => void;
  onCornerCommit: (corner: CornerKey, next: string | null) => void;
  label?: string;
}

// Visual 4-corner input. TL / TR at top row, BL / BR at bottom row,
// link toggle in the centre. Used by Radius.
export function FourCornerBox({
  values,
  linked,
  onLinkedChange,
  onCornerCommit,
  label,
}: FourCornerBoxProps) {
  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto auto",
      }}
    >
      {/* Row 1: TL  ·  TR */}
      <div className="flex justify-start">
        <ValueInput
          value={values.tl}
          onCommit={(v) => onCornerCommit("tl", v)}
          placeholder="0"
        />
      </div>
      <div />
      <div className="flex justify-end">
        <ValueInput
          value={values.tr}
          onCommit={(v) => onCornerCommit("tr", v)}
          placeholder="0"
        />
      </div>

      {/* Row 2: spacer  ·  link  ·  spacer */}
      <div />
      <div className="flex items-center justify-center gap-1">
        <LinkToggle
          linked={linked}
          onToggle={() => onLinkedChange(!linked)}
        />
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            {label}
          </span>
        )}
      </div>
      <div />

      {/* Row 3: BL  ·  BR */}
      <div className="flex justify-start">
        <ValueInput
          value={values.bl}
          onCommit={(v) => onCornerCommit("bl", v)}
          placeholder="0"
        />
      </div>
      <div />
      <div className="flex justify-end">
        <ValueInput
          value={values.br}
          onCommit={(v) => onCornerCommit("br", v)}
          placeholder="0"
        />
      </div>
    </div>
  );
}

// ---------- shared section header ----------

export function SectionHeader({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink">
        {label}
      </span>
      {hint && (
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
          {hint}
        </span>
      )}
    </div>
  );
}

// Seed for the `linked` initial state when the section first mounts.
// Returns `true` when all 4 sides hold the same value — including the
// "all empty" case (no per-side longhand in source). The empty case
// matches the user's mental model: an element with `padding: 12px`
// shorthand (or no padding at all) presents as ONE knob; typing a
// value should fan out to all 4 sides. Returns `false` only for
// mixed source values, where the user has explicitly different
// per-side longhand and the section should preserve that.
export function allSidesEqual(v: FourSideValues): boolean {
  return v.top === v.right && v.right === v.bottom && v.bottom === v.left;
}

export function allCornersEqual(v: FourCornerValues): boolean {
  return v.tl === v.tr && v.tr === v.br && v.br === v.bl;
}
