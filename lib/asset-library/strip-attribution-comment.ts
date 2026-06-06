// Library media inserts (Unsplash / Pexels / Pixabay) prepend an attribution
// comment to the <img> payload — `{/* ... */}` in JSX, `<!-- ... -->` in HTML
// (see insert-image.ts / insert-pixabay.ts / insert-pexels-photo.ts). That is
// correct for an INSERT-at-cursor: the comment lands in a multi-child context
// as courtesy attribution.
//
// On a SWAP (outerHTML replacement) it is a problem. The payload replaces ONE
// element, so a comment + <img> is TWO nodes. If the target sits in a single-
// expression JSX slot (`return <img/>`, a ternary arm, a `.map(x => <img/>)`
// body) those two adjacent nodes have no enclosing tag → Babel throws
// "Adjacent JSX elements must be wrapped in an enclosing tag" → the whole
// preview blanks. The leading `{` also makes the OID re-stamp regex no-op
// (the swapped image loses its data-dropin-id) and the JSX comment renders as
// literal text via the iframe's `el.outerHTML` fast path.
//
// Stripping the single leading comment keeps the swap payload a single node,
// which sidesteps all three. We drop only the attribution comment, not content
// — the live image hotlink (and, for Unsplash, the download-trigger ping) are
// the mechanisms providers actually audit; a hidden source comment is courtesy
// only and its loss on a swap is acceptable.
//
// Safe on inputs with no leading comment (icon SVGs, plain markup): returns the
// string unchanged. Strips exactly ONE leading comment so it can never eat real
// content.
export function stripLeadingAttributionComment(markup: string): string {
  return markup.replace(/^\s*(?:\{\/\*[\s\S]*?\*\/\}|<!--[\s\S]*?-->)\s*/, "");
}
