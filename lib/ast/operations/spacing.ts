// Phase 2 Layer 4 — Operation engine for padding / margin. Per
// `maniuplation.md` §"Layer 4" and `phase2-manipulation.md` Step 3 +
// Step 9 (Properties Panel spacing/sizing). Sibling to `resize.ts`.
//
// Eleventh-pass refactor: like `resize.ts`, this is now a thin wrapper
// over `applyStyleProps`. The duplicated byte-overwrite + bail-on-
// expression logic moved to `style.ts` when the Properties Panel
// landed. Public API stays identical so the gesture path
// (Workspace.handleSpacing → SelectionOverlay) continues to work
// unchanged.
//
// Writes camelCase per-side props (`paddingTop` / `paddingRight` /
// `paddingBottom` / `paddingLeft` for kind="padding"; same shape for
// margin). Per-side longhand coexists with any `padding: '10px'` /
// `margin: 'auto'` shorthand the user has in source — longhand wins
// in the CSS cascade so writing `paddingTop: '20px'` on top of
// `padding: '10px'` produces (top=20, others=10).
//
// Bails for the same cases `applyStyleProps` bails on
// (non-ObjectExpression style, string literal, parse failure, missing
// OID). Lossless on no-op. All-undefined input is an intentional
// no-op (`unchanged: true`, no reason).

import { applyStyleProps } from "./style";

export type SpacingKind = "padding" | "margin";
export type SpacingSide = "top" | "right" | "bottom" | "left";

export interface SpacingOperation {
  oid: string;
  kind: SpacingKind;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface SpacingResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
}

// Maps a (kind, side) pair to the camelCase JSX style key. e.g.
// ("padding", "top") → "paddingTop".
function styleKeyFor(kind: SpacingKind, side: SpacingSide): string {
  switch (side) {
    case "top":
      return `${kind}Top`;
    case "right":
      return `${kind}Right`;
    case "bottom":
      return `${kind}Bottom`;
    case "left":
      return `${kind}Left`;
  }
}

export function applySpacing(
  source: string,
  op: SpacingOperation
): SpacingResult {
  const declarations: Record<string, string | undefined> = {};
  const sides: SpacingSide[] = ["top", "right", "bottom", "left"];
  for (const side of sides) {
    const v = op[side];
    if (v !== undefined) declarations[styleKeyFor(op.kind, side)] = v;
  }
  const result = applyStyleProps(source, { oid: op.oid, declarations });
  return {
    source: result.source,
    unchanged: result.unchanged,
    reason: result.reason,
  };
}
