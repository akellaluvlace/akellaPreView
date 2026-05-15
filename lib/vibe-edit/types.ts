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
  // Resolved background-image URL parsed out of the computed style's
  // `background-image` property. The runtime reads `cs.backgroundImage`
  // (raw form `url("…")` / `none` / `linear-gradient(…)`) and strips
  // to either the URL string or null. Used by the BG-image picker in
  // CardControls to seed the "current value" state + by the idle-
  // commit drift detector. Non-`url(…)` backgrounds (gradients,
  // patterns) come back as null so the picker doesn't pretend to
  // own them. Optional for backwards-compatibility with test fixtures
  // and pre-2026-05-14 message shapes; absent ↔ null at the type
  // boundary (callers should `info.bgImage ?? null`).
  bgImage?: string | null;
  // Number of DOM elements sharing this element's source OID. >1
  // means the user clicked an instance rendered by a `.map()`-style
  // loop (or any duplicated-OID source). Edits to a single instance
  // in the iframe cascade to all instances on the next source rebuild
  // because they all read from the same source location — this field
  // exists so the panel can surface the cascade up front ("Editing
  // all N copies") rather than letting the user discover it after
  // reload. Matches Plasmic Studio's `repeatedElement()` UX pattern:
  // edits land on "the first replica" and propagate to siblings,
  // signalled clearly in the chrome. Optional for backwards-compat;
  // absent / 0 / 1 all mean "single instance".
  instanceCount?: number;
  // Pre-swap visual footprint, captured at selection time via
  // getBoundingClientRect + getComputedStyle. The component-swap path
  // uses this to wrap the swapped asset in a same-dimension container
  // so the surrounding layout doesn't shift when a larger / smaller
  // Uiverse tile takes the slot. Width/height are CSS pixels;
  // `display` is the resolved CSS display value (block / inline-block
  // / flex / inline / etc.) so the wrapper preserves flow semantics.
  // Optional for backwards-compat with test fixtures.
  bbox?: {
    width: number;
    height: number;
    display: string;
    // Computed margin (per-side, integer px). The wrapper applies
    // these so the swapped element keeps the same offset from
    // neighbors that the original had baked in via Tailwind classes
    // or inline styles (e.g. `mb-4` on a button → 16px bottom margin).
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
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
  // Icon swap. Replaces the SVG element's outerHTML wholesale with a
  // new asset string from the library. `oid` is the source-side
  // identifier (JSX mode) so the iframe runtime can re-inject it
  // before the swap and source reconciliation can find the element
  // post-swap. Null in HTML mode where addressing is by `path`.
  | {
      type: "vibe:update-outer";
      path: string;
      oid: string | null;
      newOuter: string;
    }
  // Class-list mutation. Drives typography sliders (font-size /
  // weight / leading / tracking / text-align). The runtime overwrites
  // the element's class attribute and re-emits vibe:selected so the
  // host's vibeInfo.classes stays in sync. Source reconciles via the
  // existing patchJsxClassByOid / patchHtmlClass on idle.
  | { type: "vibe:update-classes"; path: string; classes: string }
  | { type: "vibe:select"; path: string }
  | { type: "vibe:clear" };

// Re-export for callers that only need the kind type from here.
export type { VibeKind } from "./kind";
