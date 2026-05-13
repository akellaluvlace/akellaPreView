"use client";

import { useEffect, useState } from "react";

// Recommended touch hit-area size from Apple HIG / Material guidelines.
// Spec reference: maniuplation.md line ~377 — "On touch devices, hit
// areas expand further (44x44px) per platform conventions."
export const TOUCH_HIT_AREA_PX = 44;

const COARSE_QUERY = "(pointer: coarse)";

// Returns true when the device's primary pointer is coarse (touch / pen
// without precision). SSR + first client render always return false to
// keep hydration aligned; useEffect upgrades to the real value on mount
// and subscribes to changes (hybrid devices like Surface flip when a
// stylus connects).
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(COARSE_QUERY);
    } catch {
      return;
    }
    setCoarse(mql.matches);
    const onChange = () => setCoarse(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return coarse;
}

// Visual size unchanged; hit area expands to TOUCH_HIT_AREA_PX on coarse.
export function hitAreaFor(visualPx: number, coarse: boolean): number {
  return coarse ? Math.max(visualPx, TOUCH_HIT_AREA_PX) : visualPx;
}
