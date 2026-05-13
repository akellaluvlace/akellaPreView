// Emoji insert is the simplest helper in the library: drop the unicode
// character at the cursor. Same payload for HTML and JSX modes — emoji are
// just text. Skin-tone modifier (if the user picked one) is appended via the
// FE-5 fitzpatrick scale.
//
// Skin tone modifiers (from Unicode TR51):
//   1-2 = light  → U+1F3FB
//   3   = mid    → U+1F3FC
//   4   = mid    → U+1F3FD
//   5   = mid-dk → U+1F3FE
//   6   = dark   → U+1F3FF

export type SkinTone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";

const TONE_MOD: Record<SkinTone, string> = {
  light:        "\u{1F3FB}",
  "medium-light": "\u{1F3FC}",
  medium:       "\u{1F3FD}",
  "medium-dark": "\u{1F3FE}",
  dark:         "\u{1F3FF}",
};

export function buildEmojiInsert(
  char: string,
  opts?: { tone?: SkinTone | null; supportsTone?: boolean }
): string {
  if (!opts?.tone || !opts.supportsTone) return char;
  return char + TONE_MOD[opts.tone];
}
