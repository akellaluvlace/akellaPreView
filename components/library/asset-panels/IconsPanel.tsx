"use client";

// Icons tab. Sprint 1+2 sub-tabs: Lucide, Heroicons, Phosphor, Tabler,
// Simple Icons (brand logos), Emoji.

import { useEffect, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import LucidePanel from "./sub-panels/LucidePanel";
import HeroiconsPanel from "./sub-panels/HeroiconsPanel";
import PhosphorPanel from "./sub-panels/PhosphorPanel";
import TablerPanel from "./sub-panels/TablerPanel";
import SimpleIconsPanel from "./sub-panels/SimpleIconsPanel";
import EmojiPanel from "./sub-panels/EmojiPanel";

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

type SubTab = "lucide" | "heroicons" | "phosphor" | "tabler" | "simple" | "emoji";
const SUB_KEY = "dropin:icons:subtab";
const SUBS: Array<{ id: SubTab; label: string }> = [
  { id: "lucide",    label: "Lucide" },
  { id: "heroicons", label: "Hero" },
  { id: "phosphor",  label: "Phosphor" },
  { id: "tabler",    label: "Tabler" },
  { id: "simple",    label: "Brands" },
  { id: "emoji",     label: "Emoji" },
];

export default function IconsPanel({ mode, onInsert }: Props) {
  const [sub, setSub] = useState<SubTab>(() => {
    if (typeof window === "undefined") return "lucide";
    const v = window.localStorage.getItem(SUB_KEY);
    return SUBS.some((s) => s.id === v) ? (v as SubTab) : "lucide";
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
        {sub === "lucide"    && <LucidePanel    mode={mode} onInsert={onInsert} />}
        {sub === "heroicons" && <HeroiconsPanel mode={mode} onInsert={onInsert} />}
        {sub === "phosphor"  && <PhosphorPanel  mode={mode} onInsert={onInsert} />}
        {sub === "tabler"    && <TablerPanel    mode={mode} onInsert={onInsert} />}
        {sub === "simple"    && <SimpleIconsPanel mode={mode} onInsert={onInsert} />}
        {sub === "emoji"     && <EmojiPanel     mode={mode} onInsert={onInsert} />}
      </div>
    </div>
  );
}
