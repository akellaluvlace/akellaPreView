"use client";

// Vertical rail on the left edge of the Workspace body. Three brutalist
// buttons toggle the three panels that used to each have their own
// collapsed strip:
//
//   Code     — Monaco editor pane
//   Tree     — ElementTree DOM-outline pane
//   Library  — ComponentLibrarySidebar (assets / styles / components)
//
// Every entry into the workspace lands on the bare rendered preview with
// all three closed; the panels are mutually exclusive — opening one
// closes whichever was open. Clicking the active button closes it again
// and returns to the preview-only layout.

import type { ReactNode } from "react";

interface WorkspaceLeftRailProps {
  codeOpen: boolean;
  onToggleCode: () => void;
  treeOpen: boolean;
  onToggleTree: () => void;
  libraryOpen: boolean;
  onToggleLibrary: () => void;
}

export default function WorkspaceLeftRail({
  codeOpen,
  onToggleCode,
  treeOpen,
  onToggleTree,
  libraryOpen,
  onToggleLibrary,
}: WorkspaceLeftRailProps) {
  return (
    <aside
      aria-label="Workspace panels"
      // Top + right borders match the preview card's frame (border-t-2
      // border-r-2) so the workspace body reads as a single bordered
      // surface with the rail/preview boundary as the only vertical
      // divider. No bottom border — viewport ends in void below.
      className="hidden shrink-0 flex-col items-stretch border-t-2 border-r-2 border-ink bg-paper lg:flex"
      style={{ width: 64 }}
    >
      <RailButton
        label="Code"
        active={codeOpen}
        onClick={onToggleCode}
        icon={<CodeIcon />}
      />
      <RailButton
        label="Tree"
        active={treeOpen}
        onClick={onToggleTree}
        icon={<TreeIcon />}
      />
      <RailButton
        label="Library"
        active={libraryOpen}
        onClick={onToggleLibrary}
        icon={<LibraryIcon />}
      />
    </aside>
  );
}

function RailButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={`${active ? "Close" : "Open"} ${label}`}
      className={
        "flex h-16 w-full flex-col items-center justify-center gap-1 border-b-2 border-ink font-mono text-[9px] uppercase tracking-[0.2em] transition-colors " +
        (active
          ? "bg-coral text-paper"
          : "bg-paper text-ink hover:bg-soft")
      }
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function CodeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="8 6 3 12 8 18" />
      <polyline points="16 6 21 12 16 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="6" height="4" rx="0.5" />
      <rect x="14" y="10" width="6" height="4" rx="0.5" />
      <rect x="14" y="17" width="6" height="4" rx="0.5" />
      <path d="M7 7v6h7M7 13v6h7" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="0.5" />
      <rect x="14" y="3" width="7" height="7" rx="0.5" />
      <rect x="3" y="14" width="7" height="7" rx="0.5" />
      <rect x="14" y="14" width="7" height="7" rx="0.5" />
    </svg>
  );
}
