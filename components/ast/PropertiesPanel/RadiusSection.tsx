"use client";

// Phase 2 Step 9 — Border-radius section. Visual 4-corner control
// with an independent link toggle (mirrors the Spacing section's
// shape, but corners instead of edges). When linked, typing in any
// one corner fans out to all 4 — written as the four corner
// longhand props (`borderTopLeftRadius` / etc.) so a per-corner
// `border-radius: 12px` user typed in source coexists in cascade
// (longhand wins). Future polish could detect "all 4 equal" on
// commit and collapse to a single `borderRadius` shorthand to keep
// the source compact, but that's a Phase 4-ish refinement.

import { useEffect, useState } from "react";
import {
  FourCornerBox,
  SectionHeader,
  allCornersEqual,
  type CornerKey,
  type FourCornerValues,
} from "./shared";

export interface RadiusSectionProps {
  current: Record<string, string>;
  onCommit: (declarations: Record<string, string | null>) => void;
  writable: boolean;
}

const CORNER_TO_PROP: Record<CornerKey, string> = {
  tl: "borderTopLeftRadius",
  tr: "borderTopRightRadius",
  br: "borderBottomRightRadius",
  bl: "borderBottomLeftRadius",
};

export default function RadiusSection({
  current,
  onCommit,
  writable,
}: RadiusSectionProps) {
  const cornerValues: FourCornerValues = {
    tl: current.borderTopLeftRadius || "",
    tr: current.borderTopRightRadius || "",
    br: current.borderBottomRightRadius || "",
    bl: current.borderBottomLeftRadius || "",
  };

  const [linked, setLinked] = useState(() => allCornersEqual(cornerValues));

  useEffect(() => {
    setLinked(allCornersEqual(cornerValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function commitCorner(corner: CornerKey, next: string | null) {
    if (!writable) return;
    if (linked) {
      const decls: Record<string, string | null> = {};
      for (const c of ["tl", "tr", "br", "bl"] as CornerKey[]) {
        decls[CORNER_TO_PROP[c]] = next;
      }
      onCommit(decls);
    } else {
      onCommit({ [CORNER_TO_PROP[corner]]: next });
    }
  }

  return (
    <section className="border-b-2 border-ink px-4 py-4 md:px-6">
      <SectionHeader label="Radius" hint={writable ? undefined : "read-only"} />

      <FourCornerBox
        values={cornerValues}
        linked={linked}
        onLinkedChange={setLinked}
        onCornerCommit={commitCorner}
        label="RAD"
      />
    </section>
  );
}
