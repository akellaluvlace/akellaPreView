// Phase 2 Layer 4 — Operation engine for resize. Per `maniuplation.md` §"Layer
// 4" and `phase2-manipulation.md` Step 3 + Step 5 (serialization). Takes a
// resolved Intent + the current JSX source and produces a magic-string source
// rewrite that adds or updates the target element's `style` attribute.
//
// Eleventh-pass refactor: this module is now a THIN WRAPPER over
// `applyStyleProps` (the generic single-element style-prop rewrite). The
// duplicated byte-overwrite + bail-on-expression logic that used to live
// here moved into `style.ts` as the Properties Panel landed (Step 9). The
// wrapper preserves the public API (`ResizeOperation` / `ResizeResult`)
// so the gesture path (Workspace.handleResize → SelectionOverlay) doesn't
// have to change. Callers that want "remove a prop" (the panel) reach for
// `applyStyleProps` directly with `null` values; callers that want pure
// width/height writes (gestures) keep using `applyResize`.
//
// Bail rules inherited from `applyStyleProps`:
//   - `style={cn(...)}` / `style={someExpr}` (non-ObjectExpression) → bail.
//   - `style="..."` (string literal) → bail.
//   - Source that doesn't parse → bail.
//   - The OID isn't present in source → bail.
//
// Lossless on no-op: re-running this with the same dimensions on already-
// updated source produces byte-identical output. Empty `op.width` AND
// `op.height` is a no-op (returns `unchanged: true`, no reason).

import { applyStyleProps } from "./style";

export interface ResizeOperation {
  oid: string;
  // CSS values as full strings (e.g. "248px", "12rem", "auto"). The intent
  // resolver picks the unit; the operation engine doesn't second-guess. Pass
  // `undefined` to leave the dimension untouched.
  width?: string;
  height?: string;
}

export interface ResizeResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
}

export function applyResize(
  source: string,
  op: ResizeOperation
): ResizeResult {
  const result = applyStyleProps(source, {
    oid: op.oid,
    declarations: { width: op.width, height: op.height },
  });
  return {
    source: result.source,
    unchanged: result.unchanged,
    reason: result.reason,
  };
}
