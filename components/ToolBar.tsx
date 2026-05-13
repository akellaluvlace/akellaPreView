"use client";

// Phase 5 / Phase B — horizontal tool toolbar that gates every canvas
// interaction in the workspace. Replaces the eighteenth-pass DiceBar
// slot (between WorkspaceHeader and PaneTabs). Four user-facing tools:
//
//   View    — read-only canvas. Clicks do nothing.
//   Edit    — (kind="vibe") click any text/image/link to edit it in
//             place. Includes Browse-library swap from inside the vibe
//             panel (icons + media), replacing the retired Swap tool.
//   Move    — drag-to-reorder / drag-to-reparent.
//   Insert  — click a container to add a child from the library.
//
// The component itself is presentational — Workspace owns the actual
// `tool` state, persists it to localStorage, and binds the V/E/M/I
// keyboard shortcuts at window level (skipping when focus is in
// Monaco / inputs / contenteditable). FocusEditor uses the same
// component but passes `omitView` so its 3-tool variant renders without
// the View button.

// Re-export the canonical Tool union from lib/iframe-bridge.ts so
// the lib-side message protocol type and the React-side toolbar
// type can never drift. The two used to be hand-mirrored to avoid
// the lib→components import cycle, but components→lib is fine
// (one-way), so the duplication added drift risk for no benefit.
export type { Tool } from "@/lib/iframe-bridge";
import type { Tool } from "@/lib/iframe-bridge";

// 'select' is intentionally hidden from the toolbar — Vibe ('Edit')
// is the no-code-friendly replacement for the click-an-element-to-
// edit flow. Select remains in the Tool union and the message
// protocol because internal callers (cancel handlers, FocusEditor
// close, persisted-localStorage migration) still emit it; the
// toolbar just doesn't surface a button for it.
export const TOOL_LIST: ReadonlyArray<Tool> = [
  "view",
  "vibe",
  "move",
  "insert",
];

interface ToolBarProps {
  tool: Tool;
  onToolChange: (next: Tool) => void;
  // Default false. When true, the View button is hidden — used by
  // FocusEditor where the user is explicitly in edit mode.
  omitView?: boolean;
  // Optional right-aligned slot. Workspace passes the action group
  // (kind toggle / Apply / viewport / Expand / Copy / Download) so the
  // entire chrome lives in one row instead of stacking.
  children?: React.ReactNode;
}

interface ToolMeta {
  id: Tool;
  label: string;
  shortcut: string;
  tooltip: string;
  icon: JSX.Element;
}

// Inline SVGs only (locked stack — no lucide-react). 24×24 stroked icons
// in currentColor so the parent button's text color drives them. Stroke
// width 1.75 reads cleanly at 24px and stays sharp on Retina.
function ViewIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SelectIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 3l6 16 2.5-7L20 10 4 3Z" />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v18M3 12h18" />
      <path d="M9 6l3-3 3 3M6 9l-3 3 3 3M15 18l-3 3-3-3M18 9l3 3-3 3" />
    </svg>
  );
}

function InsertIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function VibeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Pencil tip pointing into a circle — "click and tweak" */}
      <circle cx="12" cy="12" r="8" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const TOOL_META: Record<Tool, ToolMeta> = {
  view: {
    id: "view",
    label: "View",
    shortcut: "V",
    tooltip: "Look around. No edits. (V)",
    icon: <ViewIcon />,
  },
  select: {
    id: "select",
    label: "Select",
    shortcut: "S",
    tooltip: "Click an element to edit it. (S)",
    icon: <SelectIcon />,
  },
  move: {
    id: "move",
    label: "Move",
    shortcut: "M",
    tooltip: "Drag elements to reorder or move them. (M)",
    icon: <MoveIcon />,
  },
  insert: {
    id: "insert",
    label: "Insert",
    shortcut: "I",
    tooltip: "Click a container to add a new element from the library. (I)",
    icon: <InsertIcon />,
  },
  vibe: {
    id: "vibe",
    label: "Edit",
    shortcut: "E",
    tooltip:
      "Click any text, image, or link to edit it in place. (E)",
    icon: <VibeIcon />,
  },
};

export default function ToolBar({
  tool,
  onToolChange,
  omitView = false,
  children,
}: ToolBarProps) {
  const visible = TOOL_LIST.filter((id) => !(omitView && id === "view"));
  return (
    <div
      className="flex shrink-0 flex-wrap items-center gap-2 bg-paper px-3 py-3 md:px-6"
      role="toolbar"
      aria-label="Editor tools"
    >
      <div className="inline-flex overflow-hidden border-2 border-ink">
        {visible.map((id, i) => {
          const meta = TOOL_META[id];
          const active = tool === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToolChange(id)}
              aria-pressed={active}
              aria-keyshortcuts={meta.shortcut}
              title={meta.tooltip}
              className={
                "group relative flex h-12 min-w-[64px] cursor-pointer flex-col items-center justify-center gap-0.5 px-3 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors " +
                (active
                  ? "bg-coral text-paper"
                  : "bg-paper text-ink hover:bg-soft") +
                (i > 0 ? " border-l-2 border-ink" : "")
              }
            >
              <span aria-hidden="true" className="leading-none">
                {meta.icon}
              </span>
              <span className="hidden leading-none md:inline">
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="ml-3 hidden items-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:flex">
        <span className="opacity-70">
          {TOOL_META[tool].shortcut.toLowerCase()}·
        </span>
        <span className="ml-1">{TOOL_META[tool].tooltip.replace(/\s\([A-Z]\)$/, "")}</span>
      </div>
      {children && (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
