"use client";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="relative block shrink-0 border-b-2 border-ink">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
      >
        /
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search components…"
        aria-label="Search components"
        className="w-full bg-paper px-8 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-coral"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 border border-ink bg-paper px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:bg-ink hover:text-paper"
        >
          ×
        </button>
      )}
    </label>
  );
}
