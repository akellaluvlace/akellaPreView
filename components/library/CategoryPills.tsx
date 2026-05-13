"use client";

interface CategoryPillsProps {
  active: string | null;
  categories: string[];
  onSelect: (c: string | null) => void;
}

export default function CategoryPills({
  active,
  categories,
  onSelect,
}: CategoryPillsProps) {
  if (categories.length === 0) return null;
  return (
    <div className="flex shrink-0 gap-2 overflow-x-auto border-b-2 border-ink bg-soft px-3 py-2">
      <Pill label="All" selected={active === null} onClick={() => onSelect(null)} />
      {categories.map((c) => (
        <Pill
          key={c}
          label={c}
          selected={active === c}
          onClick={() => onSelect(c)}
        />
      ))}
    </div>
  );
}

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        "shrink-0 whitespace-nowrap border-2 border-ink px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors " +
        (selected
          ? "bg-ink text-paper"
          : "bg-paper text-ink hover:bg-paper hover:shadow-[2px_2px_0_0_#0F0F0F]")
      }
    >
      {label}
    </button>
  );
}
