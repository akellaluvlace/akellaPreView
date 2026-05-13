// Shared types for the asset library (sidebar Media / Icons / Style tabs).
//
// The big invariant: every panel calls a tiny insert helper that returns a
// pure `string` to drop at the editor cursor (matching the existing component
// library contract). Mode awareness (html vs jsx) is the helpers' job — the
// panels only know about the asset they picked.

export type Mode = "html" | "jsx";

// The single recurring shape our IndexedDB recents store keeps. Keyed by
// (kind, id) so e.g. the same Lucide icon is one entry no matter how many
// times the user inserts it.
export interface RecentRecord {
  kind: RecentKind;
  id: string; // stable per kind: lucide icon name, emoji char, palette id, etc.
  payload: unknown; // panel-specific cached blob; rendered by the panel
  insertedAt: number; // Date.now()
}

export type RecentKind =
  | "lucide"
  | "heroicons"
  | "phosphor"
  | "tabler"
  | "simple-icons"
  | "emoji"
  | "palette"
  | "font"
  | "unsplash"
  | "pexels-photo"
  | "pexels-video"
  | "pixabay"
  | "undraw"
  | "gradient"
  | "shadow"
  | "pattern"
  | "mockup";

// Palettes & fonts are shipped as static JSON in /public/data/assets/.
export interface PaletteToken {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
}

export interface Palette {
  id: string;
  name: string;
  mood: "vibrant" | "muted" | "dark" | "pastel";
  tags: string[];
  colors: PaletteToken;
}

export interface FontDescriptor {
  family: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
  weights: string[];
}

export interface LucideIcon {
  name: string;
  tags: string[];
  body: string; // inner SVG body (no outer <svg> wrapper)
}

export interface EmojiRecord {
  char: string;
  name: string;
  slug: string;
  group: string;
  groupName: string;
  skinTone: boolean;
}

// Slim Unsplash photo as the panel sees it (mirrors `app/api/assets/unsplash`).
export interface UnsplashPhoto {
  id: string;
  description: string;
  width: number;
  height: number;
  thumb: string;
  small: string;
  regular: string;
  full: string;
  pageUrl: string;
  downloadLocation: string;
  author: { name: string; username: string; profileUrl: string };
}

export interface UnsplashSearchResponse {
  configured: boolean;
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

// Slim Pixabay photo as the panel sees it. Pixabay's free tier exposes
// previewURL (150w), webformatURL (~640w), largeImageURL (~1280w). The
// full-resolution `imageURL` requires premium. We only carry the three
// publicly-available URLs; `Resolution` maps to them.
export interface PixabayPhoto {
  id: string;
  tags: string;
  width: number;
  height: number;
  preview: string;
  webformat: string;
  large: string;
  pageUrl: string;
  author: { name: string; profileUrl: string };
}

export interface PixabaySearchResponse {
  configured: boolean;
  total: number;
  totalHits: number;
  hits: PixabayPhoto[];
}

// Returned by an API route when the relevant env var is missing. The panel
// renders a setup card from this; nothing else differs.
export interface NotConfigured {
  configured: false;
  provider: string;
  setupNote: string;
  signupUrl: string;
  docsUrl?: string;
}
