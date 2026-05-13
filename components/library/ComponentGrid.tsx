"use client";

import ComponentCard from "./ComponentCard";
import type { ComponentMeta } from "@/lib/component-library/types";
import type { AssetCompat } from "@/lib/swap/library-filter";

interface ComponentGridProps {
  components: ComponentMeta[];
  onSelect: (slug: string) => void;
  onInsert: (slug: string) => void;
  // Phase E proper — per-asset compatibility classification. When set,
  // each ComponentCard receives `compat={compatById.get(c.id)}` so the
  // card can dim incompatibles + render fit-reasons tooltip. Null when
  // no swap envelope is available (browse mode).
  compatById?: ReadonlyMap<string, AssetCompat> | null;
}

export default function ComponentGrid({
  components,
  onSelect,
  onInsert,
  compatById,
}: ComponentGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 p-3" role="list">
      {components.map((c) => (
        <li key={c.id}>
          <ComponentCard
            meta={c}
            onSelect={onSelect}
            onInsert={onInsert}
            compat={compatById?.get(c.id) ?? null}
          />
        </li>
      ))}
    </ul>
  );
}
