// 2026-05-17 — Element fingerprint for the AI Edit scope chip.
//
// Plan §3.1 + §3.2: the floating chip in the top-left of the bounding
// box shows the element's tag and a concise class summary
// (e.g. `section.hero`, `button.cta-primary`, `div.flex.items-center`).
//
// "Concise" means: keep CLASSY tokens (anything that identifies the
// element's role), drop UTILITY noise (most Tailwind utilities are not
// identity, they're styling). Without this filter, a typical Tailwind
// CTA button would render as
// `button.bg-blue-600.text-white.px-4.py-2.rounded.font-medium.no-underline.hover:bg-blue-700.transition`
// which is unreadable.
//
// Heuristic:
//   1. Tag name comes first, lowercased (`section`, `button`).
//   2. Append up to N "identity-ish" classes:
//      - id-like names (kebab-case with role words: `hero`, `cta-primary`,
//        `navbar-main`).
//      - Drop pure Tailwind utilities (bg-/text-/p-/m-/rounded/flex/
//        items-/justify-/grid-/gap-/w-/h-/etc.).
//      - Drop responsive/state variants entirely (sm:/md:/hover:/focus:).
//      - Drop arbitrary-value classes (bg-[#hex], grid-cols-[...]).
//   3. Cap total chip length at ~40 chars so it doesn't overflow.

const TAILWIND_UTILITY_PREFIXES = [
  // Layout
  "block",
  "inline",
  "flex",
  "grid",
  "hidden",
  "absolute",
  "relative",
  "fixed",
  "sticky",
  "static",
  "container",
  "isolate",
  "z-",
  // Box
  "p-",
  "px-",
  "py-",
  "pt-",
  "pr-",
  "pb-",
  "pl-",
  "m-",
  "mx-",
  "my-",
  "mt-",
  "mr-",
  "mb-",
  "ml-",
  "w-",
  "h-",
  "min-w-",
  "min-h-",
  "max-w-",
  "max-h-",
  "gap-",
  "space-",
  // Typography
  "text-",
  "font-",
  "leading-",
  "tracking-",
  "decoration-",
  "uppercase",
  "lowercase",
  "capitalize",
  "italic",
  "underline",
  "no-underline",
  "antialiased",
  "whitespace-",
  "break-",
  "truncate",
  // Color / chrome
  "bg-",
  "border",
  "border-",
  "rounded",
  "rounded-",
  "shadow",
  "shadow-",
  "opacity-",
  "ring-",
  "outline-",
  "from-",
  "via-",
  "to-",
  // Flex / grid items
  "items-",
  "justify-",
  "self-",
  "content-",
  "place-",
  "col-",
  "row-",
  "grow",
  "shrink",
  "basis-",
  "order-",
  // Transforms / effects
  "translate-",
  "rotate-",
  "scale-",
  "transform",
  "transition",
  "duration-",
  "ease-",
  "delay-",
  "animate-",
  "blur-",
  "brightness-",
  // Other utility noise
  "cursor-",
  "select-",
  "pointer-events-",
  "overflow-",
  "object-",
  "aspect-",
  "fill-",
  "stroke-",
  "list-",
  "appearance-",
  "resize-",
  "scroll-",
  "snap-",
  "touch-",
];

function isUtilityClass(token: string): boolean {
  // Variant chains (`md:hover:bg-blue-500`) — strip the variant prefix
  // and re-evaluate. Variants by themselves are utilities.
  const bare = token.replace(/^(?:[a-z-]+:)+/, "");
  // Arbitrary-value classes like `bg-[#hex]` or `text-[14px]` —
  // utility chrome, not identity.
  if (/\[[^\]]+\]/.test(bare)) return true;
  // Negative-margin / negative-position prefixes
  if (bare.startsWith("-")) return true;
  for (const prefix of TAILWIND_UTILITY_PREFIXES) {
    if (prefix.endsWith("-")) {
      if (bare.startsWith(prefix)) return true;
    } else if (bare === prefix) {
      return true;
    }
  }
  return false;
}

const MAX_CHIP_LEN = 40;

/**
 * Build the scope chip's display string for an element.
 *
 * Examples:
 *   <section class="hero py-24 bg-white"> → "section.hero"
 *   <button class="cta-primary px-4 py-2 bg-blue-600 text-white"> → "button.cta-primary"
 *   <div class="flex items-center gap-4"> → "div"
 *   <a class="text-blue-600 hover:underline"> → "a"
 *   <header class="navbar-main"> → "header.navbar-main"
 */
export function makeFingerprint(tag: string, classes: string): string {
  const tagLower = (tag || "").toLowerCase();
  if (!classes) return tagLower;
  const tokens = classes.split(/\s+/).filter(Boolean);
  const identityClasses: string[] = [];
  for (const t of tokens) {
    if (isUtilityClass(t)) continue;
    // Skip the data-* / aria-like patterns (rare but possible in
    // className via JSX bleed) — they're not identity-class-shaped.
    if (t.startsWith("data-") || t.startsWith("aria-")) continue;
    identityClasses.push(t);
    // Stop at 3 identity classes to keep the chip short. The user
    // doesn't need more than this to recognize the element.
    if (identityClasses.length >= 3) break;
  }
  if (identityClasses.length === 0) return tagLower;
  let chip = tagLower + "." + identityClasses.join(".");
  if (chip.length > MAX_CHIP_LEN) {
    chip = chip.slice(0, MAX_CHIP_LEN - 1) + "…";
  }
  return chip;
}
