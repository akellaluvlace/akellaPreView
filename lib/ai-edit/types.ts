// 2026-05-17 — AI Edit shared types.
//
// Single source of truth for the scope state machine + the snapshot
// shape that flows iframe → host on click. Keeps the iframe runtime
// emitter and the host-side panel + payload builder type-aligned.

export type AiScope = "element" | "section";

/**
 * Snapshot the iframe runtime posts to the host when the user clicks
 * something in AI Edit tool mode. Mirrors VibeElementInfo's selector-
 * addressing fields so the host can resolve back to the element later
 * (for apply / history-restore paths in later phases).
 *
 * Phase 1 (this scaffold) populates the selection-related fields and
 * leaves payload fields (parent_context, design_system_hints) empty.
 * Phase 2 will extend the emitter to compute those on click.
 */
export interface AiSelectionInfo {
  // Selector path from <html>. Used to re-find the element for apply +
  // history restore. Same shape as VibeElementInfo.path.
  path: string;
  // Element-index chain (HTML mode only). Null in JSX mode where path
  // is the authoritative addressing key.
  htmlPath: number[] | null;
  // OID when the element has one (JSX templates after injectOids ran).
  // Null when no OID is present (HTML mode, or pre-injection).
  oid: string | null;
  // Lowercased tag name (`button`, `section`, `div`).
  tag: string;
  // Fingerprint for the scope chip: tag + concise class summary.
  // E.g. `section.hero`, `button.cta-primary`, `div.flex.items-center`.
  // The host renders this in the floating chip during hover + selection.
  fingerprint: string;
  // Current scope state. Default `element` on click; `section` after
  // the user presses Tab (and the section walker finds a qualifying
  // ancestor). Collapses back to `element` on Shift+Tab.
  scope: AiScope;
  // OuterHTML of the selected element. Used for the AI Edit payload
  // (target_html in plan §4.2) and for history before/after diffing.
  // Capped in size by the iframe emitter; the host re-fetches if it
  // needs the live current value (e.g. between Tab presses).
  outerHtml: string;
  // Approximate token count of outerHtml. Computed iframe-side via
  // `estimateTokens` so the host can render the chip + decide whether
  // to surface the §6.1 large-section warning.
  tokenEstimate: number;
  // Bounding box of the selected element in iframe-viewport coords.
  // Used to position the floating prompt bar (plan §3.3) below the
  // selection. Null when getBoundingClientRect throws (detached node
  // edge case).
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

/**
 * Per-edit history entry. Plan §3.5: per-session stack of up to 50
 * actions. Stored host-side; not persisted across reloads in v1.
 */
export interface AiEditEntry {
  // Snapshot of the selection at the moment of edit. Includes the
  // path / OID so undo can re-find the element.
  before: AiSelectionInfo;
  // The user's prompt text.
  prompt: string;
  // Model used for this edit (default minimax/minimax-m2, falls back
  // to qwen3-coder on rate limit per plan §5.1).
  model: string;
  // Token usage reported by the provider. Optional because some
  // failures abort before usage is known.
  usage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  // The original outerHTML so undo restores the pre-edit state
  // verbatim.
  originalHtml: string;
  // The applied outerHTML. Same as `before.outerHtml` post-swap; kept
  // distinct so a retry that re-fires the same prompt with a tweaked
  // model can replace `appliedHtml` while preserving `originalHtml`.
  appliedHtml: string;
  // Wall-clock timestamp at the moment the edit committed
  // (post-validation). Used for the History side panel ordering.
  timestamp: number;
  // Optional model-emitted summary of what changed. Surfaced in the
  // History side panel as the human-readable description.
  notes?: string;
}

/**
 * Iframe → host message shapes specific to AI Edit. Adds onto the
 * existing `dropin:*` envelope used by selection + vibe-edit. Phase 1
 * uses `ai:selected` and `ai:cleared`; later phases add `ai:applied`
 * (after successful swap) and `ai:apply-failed` for telemetry.
 */
export type AiMessage =
  | { type: "ai:selected"; info: AiSelectionInfo }
  | { type: "ai:cleared" };

/**
 * Host → iframe message shapes for AI Edit. Phase 1 uses `ai:set-scope`
 * (Tab / Shift+Tab transitions) and `ai:clear` (Escape, click outside).
 * Phase 4 will add `ai:apply-outer` for the post-AI-response swap.
 */
export type AiCommand =
  | { type: "ai:set-scope"; path: string; scope: AiScope }
  | { type: "ai:clear" };
