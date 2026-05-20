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

// 'select', 'insert', and 'move' are intentionally hidden from the
// toolbar. Vibe ('Edit') is the no-code-friendly replacement for select
// + insert; the canvas Move tool was retired 2026-05-15 because (a) it
// only worked in JSX (no OIDs in HTML), (b) the live-translate visual
// distorted the layout for viewport-sized elements + lost original CSS
// transforms on the source, and (c) the engine bailed on parents with
// non-whitespace text children (separator characters between elements).
// The full canvas-drag rebuild is a Plasmic-grade undertaking deferred
// indefinitely. Tree-side DnD still works via the Tree panel for users
// who need to reorder. All names stay in the Tool union + message
// protocol because internal callers + persisted-localStorage migration
// still emit them; the toolbar just doesn't surface a button.
// 2026-05-20 — AI tool retired from UI per user direction. Quality
// wasn't reliable enough (interpretation drift on ambiguous prompts,
// occasional JSX-expression hallucinations, root-tag changes).
// Phases 1-9 of code left on disk (Workspace handlers, AiPromptBar,
// AiScopeChip, AiSwapBusyOverlay, /api/ai-edit, lib/ai-edit/*,
// lib/ast/operations/detach-from-map.ts). Recoverable if the model
// landscape improves. Persisted localStorage value "ai" migrates to
// "view" via the existing migration path in Workspace.
// Same retirement pattern as Move tool, Try Variations, Insert,
// component-library swap. All on disk, none in the toolbar.
export const TOOL_LIST: ReadonlyArray<Tool> = ["view", "vibe"];

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

// 2026-05-17 — AI Edit icon: four-pointed sparkle. The "magic" visual
// language vibecoders associate with AI features (matches Cursor /
// GitHub Copilot conventions). Same stroke style as other tool icons
// for visual consistency in the toolbar row.
function AiIcon() {
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
      {/* Main sparkle */}
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      {/* Small accent sparkle */}
      <path d="M19 17l.7 1.8L21 19.5l-1.3.7L19 22l-.7-1.8L17 19.5l1.3-.7z" />
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
  ai: {
    id: "ai",
    label: "AI",
    shortcut: "A",
    tooltip:
      "Click any element and describe a change in plain language. (A)",
    icon: <AiIcon />,
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
