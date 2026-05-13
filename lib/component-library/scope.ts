// Runtime counterpart to scripts/ingest/scope-css.mjs. The ingested CSS has
// every selector prefixed with `.__UIV_SCOPE__`; at insert time we mint a
// short random id and substitute it in both the CSS and the wrapper <div>.
// Two inserts of the same component produce different scope ids, so their
// styles never fight.

export const SCOPE_PLACEHOLDER = "__UIV_SCOPE__";

export function mintScopeId(): string {
  // `crypto.randomUUID` is available in all modern browsers we target (and in
  // Node >= 19 via the global). 8 hex chars = 4.3B possibilities, plenty for
  // "don't collide inside one document".
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);
  return "ak-" + uuid.replace(/-/g, "").slice(0, 8);
}

export function applyScope(css: string, scope: string): string {
  if (!css) return "";
  // `replaceAll` is fine here — the placeholder is deliberately unusual and
  // won't show up in legitimate CSS text.
  return css.split(SCOPE_PLACEHOLDER).join(scope);
}
