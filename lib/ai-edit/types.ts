// 2026-05-17 — AI Edit shared types.
//
// Single source of truth for the scope state machine + the snapshot
// shape that flows iframe → host on click. Keeps the iframe runtime
// emitter and the host-side panel + payload builder type-aligned.

export type AiScope = "element" | "section";

/**
 * Raw snapshot the IFRAME runtime emits on click in AI Edit tool mode.
 * Lean shape — only what the iframe can cheaply compute. The host
 * enriches with fingerprint + token estimate via lib/ai-edit/ helpers
 * (which have access to the full Tailwind utility list without needing
 * to inline it as ES5 in the iframe runtime template literal).
 */
export interface AiSelectionPayload {
  // Selector path from <html>. Used to re-find the element for apply +
  // history restore. Same shape as VibeElementInfo.path.
  path: string;
  // Element-index chain (HTML mode only). Null in JSX mode where path
  // is the authoritative addressing key.
  htmlPath: number[] | null;
  // OID when the element has one (JSX templates after injectOids ran).
  oid: string | null;
  // Lowercased tag name (`button`, `section`, `div`).
  tag: string;
  // Raw class attribute. Host runs makeFingerprint(tag, classes) to
  // build the scope chip's display string.
  classes: string;
  // Current scope state. Default `element` on click; `section` after
  // Tab (the iframe runs aiFindSectionScope before re-emitting).
  scope: AiScope;
  // OuterHTML of the selected element. Capped at 64KB iframe-side.
  outerHtml: string;
  // Bounding box in iframe-viewport coords. Null when
  // getBoundingClientRect throws.
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

/**
 * Host-stored AI Edit selection. Same fields as the iframe payload
 * plus `fingerprint` (computed via makeFingerprint) and `tokenEstimate`
 * (computed via estimateTokens). The host enriches at the
 * `ai:selected` message handler boundary so the rest of the host code
 * works with the full shape.
 */
export interface AiSelectionInfo extends AiSelectionPayload {
  // Fingerprint for the scope chip: tag + concise class summary.
  // E.g. `section.hero`, `button.cta-primary`, `div.flex.items-center`.
  fingerprint: string;
  // Approximate token count of outerHtml (chars / 3.5 ceiling).
  tokenEstimate: number;
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
  | { type: "ai:selected"; info: AiSelectionPayload }
  | { type: "ai:cleared" };

/**
 * Host → iframe message shapes for AI Edit. Phase 1 uses `ai:set-scope`
 * (Tab / Shift+Tab transitions) and `ai:clear` (Escape, click outside).
 * Phase 4 will add `ai:apply-outer` for the post-AI-response swap.
 */
export type AiCommand =
  | { type: "ai:set-scope"; path: string; scope: AiScope }
  | { type: "ai:clear" };
