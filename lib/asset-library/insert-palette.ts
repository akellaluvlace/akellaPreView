// Build the insert payload for a palette. Emits a `<style>` block that:
//   1. Defines the seven palette tokens as CSS custom properties on `:root`
//      so any user code referencing `var(--primary)` etc. picks them up.
//   2. Re-paints the page bg/fg via `html, body` with `!important` so the
//      change is visible *immediately* even when the existing template is
//      hard-coded with Tailwind utilities like `bg-luxury-black text-white`.
//      Without `!important` our body-level rule loses the cascade fight to
//      Tailwind utilities (which Tailwind's CDN injects later in <head>)
//      and the palette appears to do nothing.
//   3. Targets `#root > *` (NOT `#root > * > *` — see "carpet-bombing
//      bug" below) to catch the JSX template's wrapper div, which sits
//      INSIDE the preview iframe's `<div id="root">` and may carry its
//      own `bg-luxury-black`-style utility that would otherwise cover
//      the body bg.
//
// Whole thing is wrapped in `@layer dropin-palette` so the override is
// architecturally honest (named layer in DevTools' Computed tab) and so
// future per-section escape hatches can be declared in a higher-priority
// layer without an `!important` arms race.
//
// IMPORTANT — what we deliberately do NOT do:
//   - We do NOT target `#root > * > *` (the wrapper's children). That
//     would carpet-bomb every header, hero, section, card inside the
//     wrapper with the palette bg, breaking templates that mix dark
//     sections inside a light page (or vice-versa). The previous version
//     of this file had that selector; it was a regression from the
//     stated intent.
//   - We do NOT use `body > *[class*="bg-"]` — substring matching on
//     Tailwind utilities is over-broad (`bg-clip-text`, `bg-blend-multiply`,
//     `bg-gradient-to-r`, `bg-fixed`, `bg-no-repeat` all match and have
//     nothing to do with background color).
//
// Pre-condition for visibility: `lib/preview.ts INSPECTOR_CSS` should
// declare `#root { background: transparent; min-height: 100vh; }` so
// the body bg propagates through `#root` to the visible viewport.

import type { Mode, Palette } from "./types";

function styleBlock(mode: Mode, css: string): string {
  if (mode === "jsx") {
    const escaped = css.replace(/`/g, "\\`");
    return `<style dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
  }
  return `<style>${css}</style>`;
}

function comment(mode: Mode, text: string): string {
  return mode === "jsx" ? `{/* ${text} */}` : `<!-- ${text} -->`;
}

export function buildPaletteInsert(palette: Palette, mode: Mode): string {
  const c = palette.colors;
  // Single source of truth: declare the seven tokens on `:root`, then use
  // `var(--background)` / `var(--foreground)` in the override rules. Lets
  // the user (or a future palette-tweak panel) swap one variable to retint
  // the whole document.
  //
  // HTML mode: the user's <body class="..."> may carry a Tailwind bg
  //   utility — `body { background: var(--background) !important }` wins.
  // JSX mode: the user's wrapper div lives inside `#root` (owned by
  //   lib/preview.ts). `#root > *` overrides the wrapper bg without
  //   touching deeper sections.
  // `background` shorthand (not `background-color`) clears any background-
  //   image utilities the wrapper might have (`bg-gradient-to-b`, etc.).
  const css = [
    `@layer dropin-palette {`,
    `  :root {`,
    `    --background: ${c.background}; --foreground: ${c.foreground};`,
    `    --primary: ${c.primary}; --secondary: ${c.secondary};`,
    `    --accent: ${c.accent}; --muted: ${c.muted}; --border: ${c.border};`,
    `  }`,
    `  /* Page-level paint — covers the iframe canvas regardless of mode. */`,
    `  html, body {`,
    `    background: var(--background) !important;`,
    `    color: var(--foreground) !important;`,
    `  }`,
    `  /* JSX wrapper div override (only direct children of #root, NOT`,
    `     grandchildren — grandchildren are sections/cards with their own bgs). */`,
    `  #root > * {`,
    `    background-color: var(--background) !important;`,
    `    color: var(--foreground) !important;`,
    `  }`,
    `}`,
  ].join("\n");
  return [comment(mode, `Palette: ${palette.name}`), styleBlock(mode, css)].join("\n");
}
