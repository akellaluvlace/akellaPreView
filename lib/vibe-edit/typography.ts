// Per-element typography prop detection for the vibe-edit text panel.
// "Show only the knobs the element actually has" — the panel reads
// detectTypographyProps once per selection and renders sliders /
// segmented controls for the props that returned true.
//
// All checks operate on the UNPREFIXED class set (no `sm:`, `md:`,
// `lg:` prefix). Vibe v1 doesn't surface a breakpoint selector, so
// editing prefixed responsive classes is a power-user concern that
// stays in the FocusEditor. An element that has ONLY prefixed
// typography classes (e.g. `md:text-2xl` with no unprefixed token)
// won't trigger the slider — the panel falls back to the existing
// content textarea + colour pickers.

import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  TRACKING,
  TEXT_ALIGN_MATCH,
} from "../tailwind-slider-maps";

export interface TypographyProps {
  fontSize: boolean;
  fontWeight: boolean;
  lineHeight: boolean;
  tracking: boolean;
  textAlign: boolean;
}

const ALL_FALSE: TypographyProps = {
  fontSize: false,
  fontWeight: false,
  lineHeight: false,
  tracking: false,
  textAlign: false,
};

export function detectTypographyProps(classes: string): TypographyProps {
  if (!classes || typeof classes !== "string") return { ...ALL_FALSE };
  const tokens = classes.split(/\s+/).filter((t) => t.length > 0);
  // Skip any class with a breakpoint prefix (one or more `xx:` segments).
  // Hover / focus / responsive variants all live behind a `:` prefix in
  // Tailwind; the unprefixed token is the cascading base we operate on.
  const unprefixed = tokens.filter((t) => t.indexOf(":") < 0);
  const out: TypographyProps = { ...ALL_FALSE };
  for (const t of unprefixed) {
    if (FONT_SIZE.match.test(t)) out.fontSize = true;
    else if (FONT_WEIGHT.match.test(t)) out.fontWeight = true;
    else if (LINE_HEIGHT.match.test(t)) out.lineHeight = true;
    else if (TRACKING.match.test(t)) out.tracking = true;
    else if (TEXT_ALIGN_MATCH.test(t)) out.textAlign = true;
  }
  return out;
}
