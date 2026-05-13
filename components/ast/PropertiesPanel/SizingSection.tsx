"use client";

// Phase 2 Step 9 — Sizing section. Numeric+unit inputs for width and
// height (always visible), plus min/max width/height under a "More"
// disclosure. Each input commits independently through the panel's
// `onCommit` (which routes to `applyStyleProps` in Workspace). Reads
// current source values via `readSourceStyle` keyed by the selection's
// OID — no fallback to computed style in v1, so values from Tailwind
// classes / parent cascade don't show up here. That's intentional: the
// inputs reflect "what changing this rewrites in the source file".
//
// Phase 2 (4b) gestures already write `width` and `height` for the
// drag pipeline; this section is the keyboard / numeric peer for
// users who prefer to type a value rather than drag a handle.

import { useState } from "react";
import {
  SectionHeader,
  ValueInput,
} from "./shared";

export interface SizingSectionProps {
  // Source-derived values keyed by camelCase JSX style prop name.
  // `readSourceStyle(code, oid)` → `Record<string, string>`. The
  // section reads `width` / `height` / `minWidth` / etc. from this
  // map; missing keys render as empty inputs.
  current: Record<string, string>;
  // Commit handler. The section calls this with a single-prop
  // declaration map; Workspace fans it out to `applyStyleProps`.
  // `null` value = remove the prop. `undefined` is reserved as
  // "leave alone" (callers shouldn't send it from here).
  onCommit: (declarations: Record<string, string | null>) => void;
  // Whether the panel can write to source for the current selection.
  // False for `style={cn(...)}`-flavored attrs and HTML-mode elements
  // (no OIDs). Section dims its inputs but stays visible so the user
  // sees what would commit if it were writable.
  writable: boolean;
}

export default function SizingSection({
  current,
  onCommit,
  writable,
}: SizingSectionProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  function commitOne(name: string, next: string | null) {
    if (!writable) return;
    onCommit({ [name]: next });
  }

  return (
    <section className="border-b-2 border-ink px-4 py-4 md:px-6">
      <SectionHeader label="Sizing" hint={writable ? undefined : "read-only"} />

      <div className="space-y-2">
        <Row label="Width">
          <ValueInput
            value={current.width || ""}
            onCommit={(v) => commitOne("width", v)}
            disabled={!writable}
          />
        </Row>
        <Row label="Height">
          <ValueInput
            value={current.height || ""}
            onCommit={(v) => commitOne("height", v)}
            disabled={!writable}
          />
        </Row>

        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          className="flex w-full items-center justify-between border-t border-ink/15 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ink"
          aria-expanded={moreOpen}
        >
          <span>More</span>
          <span className="text-ink">{moreOpen ? "−" : "+"}</span>
        </button>

        {moreOpen && (
          <div className="space-y-2 pt-1">
            <Row label="Min W">
              <ValueInput
                value={current.minWidth || ""}
                onCommit={(v) => commitOne("minWidth", v)}
                disabled={!writable}
              />
            </Row>
            <Row label="Min H">
              <ValueInput
                value={current.minHeight || ""}
                onCommit={(v) => commitOne("minHeight", v)}
                disabled={!writable}
              />
            </Row>
            <Row label="Max W">
              <ValueInput
                value={current.maxWidth || ""}
                onCommit={(v) => commitOne("maxWidth", v)}
                disabled={!writable}
              />
            </Row>
            <Row label="Max H">
              <ValueInput
                value={current.maxHeight || ""}
                onCommit={(v) => commitOne("maxHeight", v)}
                disabled={!writable}
              />
            </Row>
          </div>
        )}
      </div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="w-14 shrink-0 font-mono text-[11px] text-ink">
        {label}
      </span>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );
}
