// Pre-scope CSS at ingest time so the browser never has to run PostCSS. Every
// selector gets wrapped in `.__UIV_SCOPE__ <selector>`; at insert time the
// runtime replaces the placeholder with a random 8-char id so two inserts of
// the same Uiverse component never collide.
//
// PostCSS handles the awkward cases correctly (:has, :is, :where, &-nesting,
// @media blocks, keyframes). Regex approaches we tried all broke on one or
// more of those, hence the PostCSS dependency.

import postcss from "postcss";
import prefixer from "postcss-prefix-selector";

const PLACEHOLDER = "__UIV_SCOPE__";
const PLACEHOLDER_SELECTOR = "." + PLACEHOLDER;

// `:root`, `html`, `body` should also become scoped — a Uiverse animation
// often sets `body { background: … }`, which would otherwise leak into the
// whole user page. We coerce those into `.__UIV_SCOPE__` so they only apply
// within the insert's own wrapper.
const ROOT_RE = /^(:root|html|body)$/i;

export async function scopeCss(css) {
  if (!css || !css.trim()) return "";
  const out = await postcss([
    prefixer({
      prefix: PLACEHOLDER_SELECTOR,
      transform(prefix, selector, prefixedSelector) {
        const trimmed = selector.trim();
        if (ROOT_RE.test(trimmed)) return prefix;
        // Keyframe steps (`from`, `to`, `0%`, `100%`) must NOT be prefixed —
        // they're not element selectors. postcss-prefix-selector walks into
        // @keyframes by default, so we have to guard.
        if (/^(\d+%|from|to)$/i.test(trimmed)) return selector;
        return prefixedSelector;
      },
    }),
  ]).process(css, { from: undefined });
  return out.css;
}

export const SCOPE_PLACEHOLDER = PLACEHOLDER;
