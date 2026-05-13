// Curated Google Fonts pair list + iframe preload URL builder.
//
// Phase 5 / Phase A8 extracted these out of `lib/dice/fonts.ts`. The dice
// roller mechanic is gone (font-roll dropped per Phase 5 §1.13); FocusEditor's
// per-element FontFamilyPicker and `lib/preview.ts`'s iframe head injection
// only ever needed the data — `FONTS[].display`/`.body` for the picker,
// `buildFontPreloadUrl()` for the <link> tag.

export interface FontPair {
  id: string;
  name: string;
  display: string; // e.g. "Playfair Display"
  body: string; // e.g. "Inter"
  weights?: string; // e.g. "400;500;700"
  vibe: string;
}

export const FONTS: FontPair[] = [
  { id: "editorial", name: "Editorial", display: "Fraunces", body: "Inter", weights: "400;500;600;700", vibe: "confident serif + clean sans" },
  { id: "classic", name: "Classic", display: "Playfair Display", body: "Source Sans 3", weights: "400;500;700", vibe: "literary" },
  { id: "modern", name: "Modern", display: "Space Grotesk", body: "Inter", weights: "400;500;700", vibe: "tech / saas" },
  { id: "warm", name: "Warm", display: "DM Serif Display", body: "DM Sans", weights: "400;500;700", vibe: "warm serif" },
  { id: "soft", name: "Soft", display: "Manrope", body: "Manrope", weights: "400;500;600;700", vibe: "friendly single family" },
  { id: "editorial-bold", name: "Editorial bold", display: "Bricolage Grotesque", body: "Inter", weights: "400;500;700", vibe: "magazine" },
  { id: "retro", name: "Retro", display: "Rubik", body: "Rubik", weights: "400;500;700", vibe: "chunky retro" },
  { id: "serif-pair", name: "Twin serifs", display: "Lora", body: "Lora", weights: "400;500;700", vibe: "long-form reading" },
  { id: "geometric", name: "Geometric", display: "Urbanist", body: "Urbanist", weights: "400;500;600;800", vibe: "architectural" },
  { id: "playful", name: "Playful", display: "Fraunces", body: "DM Sans", weights: "400;500;700;900", vibe: "tasteful fun" },
  { id: "mono-stack", name: "Mono stack", display: "JetBrains Mono", body: "Inter", weights: "400;500;700", vibe: "dev / docs" },
  { id: "display", name: "Display", display: "Abril Fatface", body: "Poppins", weights: "400;500;700", vibe: "statement headlines" },
  { id: "humanist", name: "Humanist", display: "Lora", body: "Figtree", weights: "400;500;600;700", vibe: "human, approachable" },
  { id: "technical", name: "Technical", display: "IBM Plex Sans", body: "IBM Plex Sans", weights: "400;500;600;700", vibe: "serious, technical" },
  { id: "artisan", name: "Artisan", display: "Cormorant Garamond", body: "Work Sans", weights: "400;500;600;700", vibe: "couture" },
];

export function fontById(id: string): FontPair | undefined {
  return FONTS.find((f) => f.id === id);
}

// Build the Google Fonts CSS URL covering every family used by FONTS so
// switching family inside the iframe is instant — no <link> swap.
export function buildFontPreloadUrl(): string {
  const families = Array.from(
    new Set(FONTS.flatMap((f) => [f.display, f.body])),
  );
  const spec = families
    .map((name) => {
      const pair = FONTS.find((f) => f.display === name || f.body === name);
      const weights = pair?.weights || "400;500;700";
      return `family=${encodeURIComponent(name)}:wght@${weights}`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${spec}&display=swap`;
}
