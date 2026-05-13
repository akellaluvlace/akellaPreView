"use client";

interface SourceFilterProps {
  value: string; // "all" or a source key
  sources: Record<string, number>;
  onChange: (v: string) => void;
}

export default function SourceFilter({ value, sources, onChange }: SourceFilterProps) {
  const keys = ["all", ...Object.keys(sources).sort()];
  const totalAll = Object.values(sources).reduce((a, b) => a + b, 0);
  return (
    <div
      className="flex shrink-0 gap-0 border-b-2 border-ink bg-paper"
      role="group"
      aria-label="Source filter"
    >
      {keys.map((k, i) => {
        const active = k === value;
        const count = k === "all" ? totalAll : sources[k] ?? 0;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            aria-pressed={active}
            className={
              "flex-1 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors " +
              (active
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-soft") +
              (i > 0 ? " border-l-2 border-ink" : "")
            }
          >
            {k === "all" ? "All" : k} ({count.toLocaleString()})
          </button>
        );
      })}
    </div>
  );
}
