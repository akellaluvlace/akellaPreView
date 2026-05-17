// Per-element prop detection helpers for the vibe-edit panel.
//
// The panel asks "what knobs does THIS element actually have?"
// rather than dumping every possible control on every selection.
// These helpers read VibeElementInfo (classes + computed styles)
// and return small flags the orchestrator routes off.
//
// Pure logic. Tested via lib/vibe-edit/__tests__ in a future pass.

import type { VibeElementInfo } from "./types";

// Card-like = container element with visible card styling: a
// background colour, rounded corners, a shadow, or a border. The
// vibecoder mental model: "I clicked something that LOOKS like a
// box → I want to tweak the box". Plain wrapper divs (no styling)
// fall through to the inert hint.
// Semantic section tags always qualify as card-like in the panel
// router (matches the iframe-side vibeIsCardLike branch). Without
// this, plain `<section>` / `<header>` blocks with no visible chrome
// fall through to the inert hint and the BG-image picker becomes
// unreachable from those elements.
const SECTION_TAGS = new Set([
  "section",
  "header",
  "footer",
  "main",
  "aside",
  "article",
  "nav",
]);

export function isCardLike(info: VibeElementInfo): boolean {
  if (info.kind !== "container") return false;
  if (SECTION_TAGS.has((info.tag || "").toLowerCase())) return true;
  return hasBackground(info) || hasRounding(info) || hasShadow(info) || hasBorder(info);
}

export function hasBackground(info: VibeElementInfo): boolean {
  // Inline style trumps class. Computed bg is the safety net for
  // Tailwind classes / inherited styles.
  if (/background(-color)?:/i.test(info.inlineStyle)) return true;
  if (/\bbg-[a-z0-9-/[\]#]+\b/i.test(info.classes)) return true;
  // Computed bgColor reports rgba(0,0,0,0) for "no bg" — treat as
  // false. Anything else is a real bg.
  const bg = info.bgColor || "";
  if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") return false;
  return true;
}

export function hasRounding(info: VibeElementInfo): boolean {
  if (/border-radius:/i.test(info.inlineStyle)) return true;
  if (/\brounded(-[a-z0-9-/[\]]+)?\b/i.test(info.classes)) return true;
  // Computed borderRadius reports "0px" when none is set. Anything
  // larger means there's a rounding to tweak.
  const r = (info.borderRadius || "").trim();
  if (!r) return false;
  // Parse the first numeric value; treat 0 as no-rounding.
  const m = r.match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) > 0 : false;
}

export function hasShadow(info: VibeElementInfo): boolean {
  if (/box-shadow:/i.test(info.inlineStyle)) return true;
  if (/\bshadow(-[a-z0-9-/[\]]+)?\b/i.test(info.classes)) return true;
  return false;
}

export function hasBorder(info: VibeElementInfo): boolean {
  if (/border(-(?:width|color|style|left|right|top|bottom))?:/i.test(info.inlineStyle)) {
    return true;
  }
  if (/\bborder(-[a-z0-9-/[\]]+)?\b/i.test(info.classes)) return true;
  return false;
}

// 2026-05-17 — Visual-role disambiguator for the most common
// HTML-tag-vs-visual-role mismatch: an <a> styled with Tailwind utility
// chrome (bg + rounded + small height) that looks and acts like a
// button but classifies as kind:"link". Survey: 222 of 910 <a> tags in
// templates (~24%) carry `bg-*` classes → button-shaped.
//
// Used in two places:
//   1. Workspace.vibeComponentSwapContext — Layer 3 fallback: when
//      Layer 1 (token) + Layer 2 (kind+isCardLike) miss, this routes
//      Browse-components to the "buttons" category instead of leaving
//      it null (which would show the full mixed library).
//   2. VibePropertiesPanel.labelFor — header label flips from "Link"
//      to "Button" so the vibecoder's mental model matches what they
//      clicked.
//
// Cheap heuristic — no iframe-runtime extensions needed. Reads the
// existing VibeElementInfo fields (tag, bgColor, classes, borderRadius,
// bbox.height) computed during vibeSerialize.
//
// Predicate: <a> tag AND has a real background AND has rounded corners
// AND bbox height < 80px. Height gate prevents card-wrapping <a>
// (clickable cards) from being mis-detected as buttons — those are
// taller. Cards-as-links are a separate visual role (deferred).
export function isLinkStyledAsButton(info: VibeElementInfo): boolean {
  if ((info.tag || "").toLowerCase() !== "a") return false;
  if (!hasBackground(info)) return false;
  if (!hasRounding(info)) return false;
  // bbox is optional in older test fixtures; treat absent as "no
  // height gate" (still requires bg + rounding, which together are a
  // strong signal even without height info).
  if (info.bbox && info.bbox.height > 80) return false;
  return true;
}

// Parse the first numeric pixel value from a borderRadius string.
// "8px" → 8; "8px 12px 16px 4px" → 8; "" → 0; "1rem" → 0 (we only
// parse px in v1; rem/em conversions add UI complexity vibecoders
// don't want).
export function parseRadiusPx(borderRadius: string): number {
  if (!borderRadius) return 0;
  const m = borderRadius.match(/(\d+(?:\.\d+)?)px/);
  if (!m) return 0;
  return Math.max(0, Math.round(Number(m[1])));
}
