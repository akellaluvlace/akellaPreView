// Phase E proper — Swap auto-fit transformation.
//
// After `applySwap` lands a new asset's source, the post-swap classNames
// may not fit the surrounding slot. Three conservative repair rules:
//
//   1. WIDTH OVERFLOW. If the new className has a literal `w-[Npx]` that
//      exceeds `envelope.availableWidthPx`, replace with `w-full`.
//      Most common failure: swapping a hero card (w-[800px]) into a
//      grid cell (~320px). w-full lets the asset shrink to fit.
//
//   2. HEIGHT UNDER-FILL. NO-OP by design. Vertical rhythm tolerates
//      more drift than horizontal — a card that's shorter than its slot
//      just leaves whitespace, doesn't break layout. Shrinking the asset
//      to match the slot height would distort internal font sizes and
//      padding. Documented as a non-rule for completeness.
//
//   3. ASPECT-RATIO MISMATCH. If the new className has `aspect-[X/Y]`
//      that mismatches `envelope.preferredAspectRatio` by >10%
//      (AR_DRIFT_TOLERANCE from slot-capacity.ts), replace with a
//      `aspect-[<rounded>]` value matching the slot's preferred AR.
//      Round to 2 decimals for stability across renders.
//
// Pure operation on a className string. Caller (Phase E proper Workspace
// wiring) reads the swapped element's classNames, runs `applySwapFit`,
// then writes the result via the existing `patchJsxClassByOid` byte
// patcher. No React, no DOM, no fetch.
//
// Breakpoint-prefixed classes (`md:w-[800px]`) are LEFT ALONE — they
// represent intent at a different breakpoint than the slot envelope's
// anchor (the iframe's current viewport). Coercing them would silently
// break the asset's responsive design.

import { AR_DRIFT_TOLERANCE, type SlotEnvelope } from "./slot-capacity";

export type SwapFitChange =
  | { kind: "width-overflow"; from: string; to: string }
  | { kind: "aspect-mismatch"; from: string; to: string };

export interface SwapFitResult {
  classes: string;
  changes: SwapFitChange[];
  changed: boolean;
}

// Match unprefixed `w-[Npx]` or `w-[N.Mpx]`. Capturing groups: full token,
// numeric value. Anchored on word boundaries so `lg:w-[800px]` doesn't
// match (the colon is the anchor). We tolerate decimals (`w-[800.5px]`)
// and reject other units (rem/em/% — too speculative without DPR/scale
// context).
const W_PX_LITERAL_RE = /(?:^|\s)(w-\[(\d+(?:\.\d+)?)px\])(?:$|\s)/;

// Match unprefixed `aspect-[X/Y]` for X, Y positive numbers (decimals
// allowed, slash required). Also catch named `aspect-square` (1:1) and
// `aspect-video` (16:9) — Tailwind's two built-ins.
const ASPECT_ARBITRARY_RE =
  /(?:^|\s)(aspect-\[(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\])(?:$|\s)/;
const ASPECT_NAMED_RE = /(?:^|\s)(aspect-(square|video))(?:$|\s)/;

// Replace a single token in a space-separated class list. Preserves the
// rest of the string verbatim (whitespace runs, leading/trailing space).
// Token-aware; will not match a substring (e.g. doesn't replace "w-[10px]"
// inside "lg:w-[10px]").
function replaceClassToken(classes: string, oldToken: string, newToken: string): string {
  const idx = classes.indexOf(oldToken);
  if (idx === -1) return classes;
  // Verify token boundaries — must be start/end-of-string or whitespace.
  const before = idx === 0 ? "" : classes[idx - 1];
  const afterIdx = idx + oldToken.length;
  const after = afterIdx >= classes.length ? "" : classes[afterIdx];
  if ((before !== "" && !/\s/.test(before)) || (after !== "" && !/\s/.test(after))) {
    return classes;
  }
  return classes.slice(0, idx) + newToken + classes.slice(afterIdx);
}

// Round a positive number to at most 2 decimals, dropping trailing zeros.
// "1.50" → "1.5", "1.00" → "1", "1.778" → "1.78".
function round2(n: number): string {
  return parseFloat(n.toFixed(2)).toString();
}

// Format a target aspect ratio as a Tailwind arbitrary class. Always emits
// `aspect-[X/1]` form so the X value is human-readable; 16:9 → 1.78/1.
// Tailwind's `aspect-[<expr>]` accepts any CSS-valid aspect-ratio value.
function formatAspectClass(ratio: number): string {
  return `aspect-[${round2(ratio)}/1]`;
}

export function applySwapFit(
  classes: string,
  envelope: SlotEnvelope,
): SwapFitResult {
  if (typeof classes !== "string" || classes.length === 0) {
    return { classes: classes ?? "", changes: [], changed: false };
  }

  let next = classes;
  const changes: SwapFitChange[] = [];

  // Rule 1: width overflow. Single match — multiple `w-[Npx]` tokens on
  // one element are an authoring bug (CSS specificity picks the last);
  // we don't try to repair pathological input.
  const wMatch = W_PX_LITERAL_RE.exec(next);
  if (wMatch) {
    const fullToken = wMatch[1];
    const px = parseFloat(wMatch[2]);
    if (isFinite(envelope.availableWidthPx) && px > envelope.availableWidthPx) {
      next = replaceClassToken(next, fullToken, "w-full");
      changes.push({ kind: "width-overflow", from: fullToken, to: "w-full" });
    }
  }

  // Rule 3: aspect-ratio mismatch. Only check when the slot has a
  // preferred AR; otherwise the asset's AR can stand. Single replacement
  // — multiple `aspect-*` tokens would be a class-authoring bug.
  if (envelope.preferredAspectRatio !== null && envelope.preferredAspectRatio > 0) {
    const slotAr = envelope.preferredAspectRatio;
    let match: { token: string; ratio: number } | null = null;

    const arbMatch = ASPECT_ARBITRARY_RE.exec(next);
    if (arbMatch) {
      const x = parseFloat(arbMatch[2]);
      const y = parseFloat(arbMatch[3]);
      if (y > 0) {
        match = { token: arbMatch[1], ratio: x / y };
      }
    } else {
      const namedMatch = ASPECT_NAMED_RE.exec(next);
      if (namedMatch) {
        const name = namedMatch[2];
        const r = name === "square" ? 1 : 16 / 9;
        match = { token: namedMatch[1], ratio: r };
      }
    }

    if (match !== null) {
      const drift = Math.abs(match.ratio - slotAr) / slotAr;
      if (drift > AR_DRIFT_TOLERANCE) {
        const replacement = formatAspectClass(slotAr);
        next = replaceClassToken(next, match.token, replacement);
        changes.push({
          kind: "aspect-mismatch",
          from: match.token,
          to: replacement,
        });
      }
    }
  }

  return {
    classes: next,
    changes,
    changed: changes.length > 0,
  };
}

// Compose a human-readable warning summary for the toast. Caller passes
// the changes array; the function returns null when empty so callers can
// treat null as "no warn needed". Format example:
//   "Auto-fit: w-[800px] → w-full (slot was 320px wide); aspect-square → aspect-[1.78/1]"
export function summarizeSwapFitChanges(
  changes: ReadonlyArray<SwapFitChange>,
  envelope: SlotEnvelope,
): string | null {
  if (changes.length === 0) return null;
  const parts: string[] = [];
  for (const ch of changes) {
    if (ch.kind === "width-overflow") {
      parts.push(
        `${ch.from} → ${ch.to} (slot was ${Math.round(envelope.availableWidthPx)}px wide)`,
      );
    } else {
      parts.push(`${ch.from} → ${ch.to}`);
    }
  }
  return `Auto-fit: ${parts.join("; ")}`;
}

// Constants exported for tests + future LibraryModal compatibility filter.
export const SWAP_FIT_CONSTANTS = {
  AR_DRIFT_TOLERANCE,
  W_PX_LITERAL_RE,
  ASPECT_ARBITRARY_RE,
  ASPECT_NAMED_RE,
} as const;
