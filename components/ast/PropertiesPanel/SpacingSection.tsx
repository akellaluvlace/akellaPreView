"use client";

// Phase 2 Step 9 — Spacing section. Two visual 4-side controls
// (padding + margin) with independent link toggles. Each padding/margin
// commit writes per-side longhand props (`paddingTop` /
// `paddingRight` / etc.) — same shape Phase 2 (4d) gesture commits
// produce. When the link toggle is active, typing in any one side
// fans out to all 4. Coexists with `padding: '12px'` / `margin: 'auto'`
// shorthand the user has typed in source: longhand wins in the CSS
// cascade so per-side writes mask shorthand without removing it.
//
// Initial link state is seeded from "do all 4 sides hold the same
// value?" — mirrors what users expect (an element with uniform
// padding shows up linked, a mixed one shows up unlinked). The
// toggle persists for the section's lifetime; flipping it doesn't
// retroactively rewrite source.

import { useEffect, useState } from "react";
import {
  FourSideBox,
  SectionHeader,
  allSidesEqual,
  type FourSideValues,
  type SideKey,
} from "./shared";

export interface SpacingSectionProps {
  // Source-derived style values; same shape as `SizingSection.current`.
  // The section reads `paddingTop` / `paddingRight` / ... and
  // `marginTop` / `marginRight` / ... from this map.
  current: Record<string, string>;
  onCommit: (declarations: Record<string, string | null>) => void;
  writable: boolean;
}

export default function SpacingSection({
  current,
  onCommit,
  writable,
}: SpacingSectionProps) {
  // Snapshot current per-side values for both kinds. The 4-side box
  // gets these as initial input values; the box internally uses
  // `useEffect` to sync if `current` changes (e.g. Cmd-Z, gesture
  // commit). No defensive memoization — `current` is a fresh object
  // from `readSourceStyle` each render, which is fine at the panel's
  // typical update rate.
  const padValues: FourSideValues = {
    top: current.paddingTop || "",
    right: current.paddingRight || "",
    bottom: current.paddingBottom || "",
    left: current.paddingLeft || "",
  };
  const marValues: FourSideValues = {
    top: current.marginTop || "",
    right: current.marginRight || "",
    bottom: current.marginBottom || "",
    left: current.marginLeft || "",
  };

  // Link state: each kind has its own. Seeded from the source values
  // and left for the user to flip. We deliberately don't auto-re-link
  // on every `current` change — once the user has unlinked, typing
  // padding-top shouldn't yank padding-right back to match.
  const [paddingLinked, setPaddingLinked] = useState(() =>
    allSidesEqual(padValues)
  );
  const [marginLinked, setMarginLinked] = useState(() =>
    allSidesEqual(marValues)
  );

  // When the selection changes (different OID under the cursor) we
  // get a brand-new `current` snapshot. Re-seed the link state so the
  // new element starts with whichever default fits its source. Passing
  // `current` as the dep is sufficient — `padValues`/`marValues` are
  // derived from it.
  useEffect(() => {
    setPaddingLinked(allSidesEqual(padValues));
    setMarginLinked(allSidesEqual(marValues));
    // We intentionally re-seed on `current` reference change. The
    // dependency lint would prefer the derived values, but those are
    // recreated every render — same effect, double the wakeups.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function sideKeyFor(kind: "padding" | "margin", side: SideKey): string {
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

  function commitSide(
    kind: "padding" | "margin",
    side: SideKey,
    next: string | null,
    linked: boolean
  ) {
    if (!writable) return;
    if (linked) {
      // Fan-out: write the same value to all 4 sides in a single
      // declaration map. `applyStyleProps` then performs one source
      // rewrite covering all 4 props — single Cmd-Z reverts all of
      // them together.
      const decls: Record<string, string | null> = {};
      for (const s of ["top", "right", "bottom", "left"] as SideKey[]) {
        decls[sideKeyFor(kind, s)] = next;
      }
      onCommit(decls);
    } else {
      onCommit({ [sideKeyFor(kind, side)]: next });
    }
  }

  return (
    <section className="border-b-2 border-ink px-4 py-4 md:px-6">
      <SectionHeader label="Spacing" hint={writable ? undefined : "read-only"} />

      <div className="space-y-4">
        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            Padding
          </p>
          <FourSideBox
            values={padValues}
            linked={paddingLinked}
            onLinkedChange={setPaddingLinked}
            onSideCommit={(side, next) =>
              commitSide("padding", side, next, paddingLinked)
            }
            label="PAD"
          />
        </div>
        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            Margin
          </p>
          <FourSideBox
            values={marValues}
            linked={marginLinked}
            onLinkedChange={setMarginLinked}
            onSideCommit={(side, next) =>
              commitSide("margin", side, next, marginLinked)
            }
            label="MAR"
          />
        </div>
      </div>
    </section>
  );
}
