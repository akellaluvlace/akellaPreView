"use client";

// Style tab. Sub-tabs: Fonts, Palettes, Gradients, Patterns, Shadows.

import { useEffect, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import FontsPanel from "./sub-panels/FontsPanel";
import PalettesPanel from "./sub-panels/PalettesPanel";
import GradientsPanel from "./sub-panels/GradientsPanel";
import PatternsPanel from "./sub-panels/PatternsPanel";
import ShadowsPanel from "./sub-panels/ShadowsPanel";

interface Props {
  mode: Mode;
  onInsert: (text: string, opts?: { position?: "cursor" | "top" }) => void;
}

type SubTab = "fonts" | "palettes" | "gradients" | "patterns" | "shadows";
const SUB_KEY = "dropin:style:subtab";
const SUBS: Array<{ id: SubTab; label: string }> = [
  { id: "fonts",     label: "Fonts" },
  { id: "palettes",  label: "Palettes" },
  { id: "gradients", label: "Grads" },
  { id: "patterns",  label: "Patterns" },
  { id: "shadows",   label: "Shadows" },
];

export default function StylePanel({ mode, onInsert }: Props) {
  const [sub, setSub] = useState<SubTab>(() => {
    if (typeof window === "undefined") return "fonts";
    const v = window.localStorage.getItem(SUB_KEY);
    return SUBS.some((s) => s.id === v) ? (v as SubTab) : "fonts";
  });
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(SUB_KEY, sub);
  }, [sub]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-ink bg-paper px-2 py-1.5">
        {SUBS.map((s) => {
          const active = s.id === sub;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSub(s.id)}
              className={
                "shrink-0 border-2 border-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
              aria-pressed={active}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <div className="min-h-0 flex-1">
        {sub === "fonts"     && <FontsPanel     mode={mode} onInsert={onInsert} />}
        {sub === "palettes"  && <PalettesPanel  mode={mode} onInsert={onInsert} />}
        {sub === "gradients" && <GradientsPanel mode={mode} onInsert={onInsert} />}
        {sub === "patterns"  && <PatternsPanel  mode={mode} onInsert={onInsert} />}
        {sub === "shadows"   && <ShadowsPanel   mode={mode} onInsert={onInsert} />}
      </div>
    </div>
  );
}
