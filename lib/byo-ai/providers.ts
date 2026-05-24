// 2026-05-21 — BYO-AI provider registry. Each entry describes one
// destination the user can send the swap prompt to. The contract is
// minimal: a button label, an "open URL" (or null for "just copy"),
// and a primary color for visual distinction in the modal.
//
// Research-validated decisions (see plan §"Key research findings"):
//   - URL prefill is dropped entirely. Full-page payloads exceed
//     ChatGPT's `?q=` cap (~1800 chars); Claude removed `?q=` Oct
//     2025 for security; Gemini never natively supported it.
//   - Every button does the SAME thing on the Dropin side: clipboard
//     copy + new tab to the homepage. Provider URL is the only
//     difference.
//
// Open URLs were picked to land the user on the most useful default
// page for each provider:
//   - ChatGPT: chatgpt.com (the new canonical domain; chat.openai.com
//     auto-redirects but adds a hop)
//   - Claude: claude.ai/new (jumps straight to a fresh chat)
//   - Gemini: gemini.google.com/app (the chat surface, not the
//     marketing page)

export interface ByoAiProvider {
  // localStorage key — stable across UI refactors.
  id: "chatgpt" | "claude" | "gemini" | "copy";
  // Button label shown in the modal.
  label: string;
  // Tooltip shown on hover.
  title: string;
  // URL to open in a new tab. null = "just copy" (no tab opens).
  openUrl: string | null;
  // 2026-05-24 — optional prompt-prefill URL builder. When present AND
  // the encoded URL stays under the browser-safe limit, we open this
  // (prompt lands in the AI's box automatically) instead of openUrl.
  // ChatGPT supports `?q=`; Claude.ai REMOVED it Oct 2025 (security —
  // prompt-injection via URL); Gemini never had it natively. So only
  // ChatGPT gets a builder. Clipboard copy still happens regardless, as
  // a fallback for over-length prompts + the no-prefill providers.
  buildPrefillUrl?: (prompt: string) => string;
}

// Conservative cap on the prefill URL length. Chrome handles ~32KB but
// intermediate proxies + the provider's own server can truncate; 8KB is
// the widely-cited safe ceiling. Above it we open the plain URL + rely
// on the clipboard copy. Element-only prompts are ~2-7KB raw → usually
// fit once encoded; reference-heavy ones may not, hence the guard.
export const PREFILL_URL_MAX = 8000;

export const BYO_AI_PROVIDERS: ReadonlyArray<ByoAiProvider> = [
  {
    id: "chatgpt",
    label: "Open ChatGPT",
    title:
      "Opens ChatGPT with the prompt pre-filled in the box (short prompts) " +
      "— just press Enter. Also copied to your clipboard as a fallback.",
    openUrl: "https://chatgpt.com/",
    buildPrefillUrl: (prompt) =>
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "claude",
    label: "Open Claude",
    title:
      "Copies the prompt to your clipboard + opens Claude.ai in a new tab. " +
      "Paste in the chat, copy the reply, then come back here to paste below.",
    openUrl: "https://claude.ai/new",
  },
  {
    id: "gemini",
    label: "Open Gemini",
    title:
      "Copies the prompt to your clipboard + opens Gemini in a new tab. " +
      "Paste in the chat, copy the reply, then come back here to paste below.",
    openUrl: "https://gemini.google.com/app",
  },
  {
    id: "copy",
    label: "Just copy",
    title:
      "Copies the prompt to your clipboard. Use whichever AI you like, " +
      "then come back here to paste the reply.",
    openUrl: null,
  },
];

export const BYO_AI_PROVIDER_STORAGE_KEY = "dropin:byo-ai:preferred-provider";

export function getProviderById(id: string): ByoAiProvider | null {
  for (const p of BYO_AI_PROVIDERS) {
    if (p.id === id) return p;
  }
  return null;
}

// Float the preferred provider to the left of the array so its button
// is the leftmost (primary) one on next open. Stable order otherwise.
// Returns a new array; original is not mutated.
export function orderProvidersByPreference(
  preferredId: string | null,
): ReadonlyArray<ByoAiProvider> {
  if (!preferredId) return BYO_AI_PROVIDERS;
  const preferred = getProviderById(preferredId);
  if (!preferred) return BYO_AI_PROVIDERS;
  const rest = BYO_AI_PROVIDERS.filter((p) => p.id !== preferredId);
  return [preferred, ...rest];
}
