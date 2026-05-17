// 2026-05-17 — AI Edit scope detection + token estimation.
//
// Per plan §4.1: walk up from the clicked element to find the nearest
// semantic section boundary. Returns the section element when found,
// or the original element when no section ancestor is reachable
// before <body>.
//
// Predicates:
//   1. Semantic tags: section / header / footer / nav / aside / main / article
//   2. role="region" / role="banner" / role="contentinfo"
//   3. Class fingerprints matching common landing-page section names
//      (hero / features / pricing / cta / testimonial / bento / etc.)
//   4. Direct child of <body> (so "the entire page section" is editable
//      even when authors skip semantic tags)
//
// Pure DOM logic — runs in the iframe runtime context. The selection
// layer (selector.ts) calls this when the user presses Tab on an
// element-mode selection to expand to section mode.

const SECTION_TAGS = new Set([
  "SECTION",
  "HEADER",
  "FOOTER",
  "NAV",
  "ASIDE",
  "MAIN",
  "ARTICLE",
]);

const SECTION_ROLES = new Set(["region", "banner", "contentinfo"]);

// Tailwind-friendly section name patterns. Matches whole-token (`hero` as
// a class, not `hero-` as a prefix of something else) so we don't catch
// `heroku-deploy-button` or similar false positives. The pattern intentionally
// covers both singular + plural forms (`feature` / `features`, `stat` / `stats`,
// `logo` / `logos`) since template authors are inconsistent.
const SECTION_CLASS_RX =
  /\b(hero|features?|pricing|cta|testimonials?|bento|footer|navbar|nav-|faq|stats?|logos?|gallery|about|contact|newsletter)\b/i;

/**
 * Walk up from `el` to find the nearest semantic section ancestor.
 *
 * Returns the original element if no qualifying ancestor exists
 * (which collapses section mode back to element mode silently — the
 * UI surfaces this as the scope chip not changing).
 */
export function findSectionScope(el: Element): Element {
  let node: Element | null = el;
  const root = el.ownerDocument?.body ?? null;
  while (node && node !== root) {
    if (SECTION_TAGS.has(node.tagName)) return node;
    const role = node.getAttribute("role");
    if (role && SECTION_ROLES.has(role)) return node;
    const cls = node.getAttribute("class") || "";
    if (cls && SECTION_CLASS_RX.test(cls)) return node;
    // Direct child of <body> — fallback for templates with no semantic
    // tag at the top level. Without this, a hero-without-`<section>`
    // would never expand to section mode.
    if (node.parentElement === root) return node;
    node = node.parentElement;
  }
  return el;
}

/**
 * Rough token estimator. AI Edit uses this for the scope chip's
 * "~2.3k tokens" hint + the §6.1 token-budget warning at 8k input
 * tokens for section mode.
 *
 * Heuristic: HTML markup runs ~3.5 chars per token on the BPE
 * tokenizers used by GPT/Claude/MiniMax. Don't over-engineer this
 * — the user-facing precision is "this might take 10+ seconds",
 * not a billing dispute.
 *
 * Returns: integer token estimate, never negative, ceil-rounded.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 3.5);
}

/**
 * Human-readable token count for the scope chip ("2.3k").
 *
 * < 1000: returns the exact integer ("847").
 * >= 1000: returns one decimal place with "k" suffix ("2.3k").
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return String(tokens);
  return `${(tokens / 1000).toFixed(1)}k`;
}
