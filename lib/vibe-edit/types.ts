// Message + element-info shapes for the vibe-edit flow. Pure types,
// no runtime. Imported by both the iframe runtime emitter (which
// consumes them via type narrowing in TS) and the host-side panel
// + commit translator.

import type { VibeKind } from "./kind";

// Snapshot of the iframe DOM element at selection time — what the
// host panel renders, what `buildVibeCommit` reads as `old`.
export interface VibeElementInfo {
  // Selector-path addressing — populated for both modes. Resolves
  // through document.querySelector inside the iframe; round-trip
  // verified by lib/vibe-edit/path.ts. Used by the iframe runtime
  // to find the element on `vibe:update-*` commands.
  path: string;
  // Element-index chain from <html> (HTML mode only). Used by the
  // commit translator to drive parse5-based HTML source patchers,
  // which take number[] not selector strings. Null in JSX mode.
  htmlPath: number[] | null;
  // OID addressing — present in JSX mode after injectOids has run,
  // null in HTML mode. The commit translator prefers OID over path
  // when patching JSX source because it survives source edits that
  // shift line/column positions.
  oid: string | null;
  tag: string;
  kind: VibeKind;
  // Live values pulled from the DOM at selection time. text reads
  // textContent (so child markup collapses); src/alt/href read
  // attributes verbatim. Colors come from getComputedStyle so
  // Tailwind-class-styled elements show up here as resolved values
  // (no more "blank field, looks broken" complaints).
  text: string;
  src: string | null;
  alt: string | null;
  href: string | null;
  textColor: string;
  bgColor: string;
  // Computed border-radius (top-left corner, parsed as the slider's
  // baseline value). For symmetric radii browsers report "8px"; for
  // asymmetric "8px 12px 16px 4px". The panel shows the first
  // numeric only — vibe-edit doesn't expose per-corner control.
  borderRadius: string;
  // Verbatim el.style.cssText from the iframe DOM at selection time.
  // The source-writeback path uses this as the canonical inline-style
  // value when any style-affecting field changes (bg colour, corner
  // radius, text colour). Lets us write a single style="..." attr
  // covering all the user's tweaks rather than tracking per-prop
  // diffs in commit.ts.
  inlineStyle: string;
  // Verbatim className attribute (HTML) / className prop (JSX). The
  // panel uses this for "what knobs does this element already have"
  // detection — e.g. a div with `bg-white rounded-lg shadow-md` is
  // card-like and gets corner / bg controls; a plain wrapper div
  // gets the inert-container hint. Empty string when no class attr.
  classes: string;
}

// Iframe → host. Sent via parent.postMessage with the existing
// __dropin: true brand so isIframeMessage accepts it. The host
// listens on the same window message bus.
export type VibeMessage =
  | { type: "vibe:ready" }
  | { type: "vibe:selected"; info: VibeElementInfo }
  | { type: "vibe:cleared" }
  | { type: "vibe:applied" };

// Host → iframe. Sent via iframe.contentWindow.postMessage. All
// commands carry the __dropin: true brand on send (added by
// dropinPost on the iframe-side and by Preview's postToIframe on
// the host-side).
export type VibeCommand =
  | { type: "vibe:update-content"; path: string; text: string }
  | {
      type: "vibe:update-style";
      path: string;
      // camelCase CSS property names (matches CSSStyleDeclaration's
      // setter API). Empty-string value clears the property; absent
      // keys leave the existing value alone. Caller-supplied subset:
      // color, backgroundColor, borderRadius are the v1 controls;
      // future panels can add boxShadow / borderColor / borderWidth
      // without a protocol change.
      styles: Record<string, string>;
    }
  | { type: "vibe:update-image"; path: string; src?: string; alt?: string }
  | { type: "vibe:update-link"; path: string; href: string }
  | { type: "vibe:select"; path: string }
  | { type: "vibe:clear" };

// Re-export for callers that only need the kind type from here.
export type { VibeKind } from "./kind";
