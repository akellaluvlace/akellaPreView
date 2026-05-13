// Phase E proper — Post-swap bbox drift assertion.
//
// After a swap lands, the iframe's `dropin:bbox` watch reports the new
// element's rect. This module compares pre-swap to post-swap dimensions
// and surfaces a warn message when either axis drifts beyond a
// configurable threshold (default 10%, picked to match
// `slot-capacity.ts`'s AR_DRIFT_TOLERANCE).
//
// The threshold is symmetric (works for both grow and shrink): a swap
// from a 200px-wide card to a 100px-wide card drifts -50%, which the
// `Math.abs` makes 50% > 10% → warn. A swap from 200px to 215px drifts
// 7.5% → no warn.
//
// Pure-logic only. The caller (Phase E proper Workspace wiring) reads
// pre/post rects from the iframe via existing channels and feeds them
// to `assessBboxDrift`. No DOM, no React, no fetch.

export interface BboxRect {
  readonly widthPx: number;
  readonly heightPx: number;
}

export type BboxDriftAxis = "width" | "height";

export interface BboxDriftAssessment {
  readonly ok: boolean;
  // Per-axis drift fractions (0 = no change, 0.5 = 50% drift). Always
  // populated even when `ok: true` — useful for telemetry / debug.
  readonly widthDrift: number;
  readonly heightDrift: number;
  // Axes that exceeded the threshold (`ok` is false iff non-empty).
  readonly drifted: BboxDriftAxis[];
  // Human-readable summary for the warn toast. Null when ok.
  readonly message: string | null;
}

// Match Figma's published instance-swap behaviour (their AR-lock issue
// also fires past ~10% drift). Tunable via the threshold parameter when
// the caller wants stricter or looser assessment.
export const BBOX_DRIFT_DEFAULT_THRESHOLD = 0.1;

export interface AssessBboxDriftOpts {
  // Override the per-axis threshold (default 0.1 = 10%).
  readonly threshold?: number;
  // When the pre-swap dimension is 0 (degenerate), drift is undefined
  // mathematically. Default behaviour: skip the axis (no warn). Set to
  // true to fail-loud (treat 0 → N as 100% drift, +Infinity → "drifted").
  readonly failOnZeroDimension?: boolean;
}

function pctRound(d: number): number {
  return Math.round(d * 100);
}

export function assessBboxDrift(
  pre: BboxRect | null,
  post: BboxRect | null,
  opts: AssessBboxDriftOpts = {},
): BboxDriftAssessment {
  const threshold = opts.threshold ?? BBOX_DRIFT_DEFAULT_THRESHOLD;
  const failOnZero = opts.failOnZeroDimension ?? false;

  // Defensive: any nullish input means we couldn't measure. Default to
  // ok=true (no false-positive warn). Caller can pre-filter null pairs
  // when stricter behaviour is wanted.
  if (pre === null || post === null) {
    return {
      ok: true,
      widthDrift: 0,
      heightDrift: 0,
      drifted: [],
      message: null,
    };
  }

  const computeDrift = (preDim: number, postDim: number): number => {
    if (!isFinite(preDim) || !isFinite(postDim)) return 0;
    if (preDim === 0) {
      return failOnZero ? Number.POSITIVE_INFINITY : 0;
    }
    return Math.abs(postDim - preDim) / preDim;
  };

  const widthDrift = computeDrift(pre.widthPx, post.widthPx);
  const heightDrift = computeDrift(pre.heightPx, post.heightPx);

  const drifted: BboxDriftAxis[] = [];
  if (widthDrift > threshold) drifted.push("width");
  if (heightDrift > threshold) drifted.push("height");

  if (drifted.length === 0) {
    return {
      ok: true,
      widthDrift,
      heightDrift,
      drifted: [],
      message: null,
    };
  }

  // Compose human-readable warn.
  const parts: string[] = [];
  for (const axis of drifted) {
    const d = axis === "width" ? widthDrift : heightDrift;
    const preDim = axis === "width" ? pre.widthPx : pre.heightPx;
    const postDim = axis === "width" ? post.widthPx : post.heightPx;
    parts.push(
      `${axis} ${Math.round(preDim)}px → ${Math.round(postDim)}px (${pctRound(d)}% drift)`,
    );
  }
  const message = `Layout shifted: ${parts.join("; ")}`;

  return {
    ok: false,
    widthDrift,
    heightDrift,
    drifted,
    message,
  };
}

export const BBOX_DRIFT_CONSTANTS = {
  BBOX_DRIFT_DEFAULT_THRESHOLD,
} as const;
