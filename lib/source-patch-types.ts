// Shared result type for every source-level patcher (JSX and HTML). Callers
// can tell the difference between "nothing needed to change" and "we tried
// but couldn't find the target", so the UI can surface silent no-ops instead
// of pretending every click succeeded.

export interface PatchResult {
  /** Updated source (equal to input when `changed` is false). */
  source: string;
  /** True iff the patch actually produced a different string. */
  changed: boolean;
  /** Short human message when `changed` is false. Absent when successful. */
  reason?: string;
}
