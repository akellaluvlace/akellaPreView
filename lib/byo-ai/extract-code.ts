// 2026-05-21 — Extract code from a BYO-AI response.
//
// Frontier models (Claude / GPT-5 / Gemini) wrap code in fenced
// blocks with chatty preamble:
//
//   Sure! Here's your updated file:
//
//   ```jsx
//   ...code...
//   ```
//
//   Let me know if you want adjustments!
//
// We pull the first fenced block. If no fence is present (user
// pasted just the raw code — frontier models sometimes do that
// when explicitly asked), fall back to the whole input.

export interface ExtractCodeResult {
  // The extracted source code, trimmed.
  code: string;
  // True if a code fence was found and stripped. False = returned
  // the raw input. Used by the UI to surface "we detected a code
  // fence" when present.
  hadFence: boolean;
}

// Match the first ```lang\n...\n``` block. Language tag is optional
// (some models omit it). Multi-line non-greedy match captures content
// between the opening fence's newline and the closing fence.
//
// Pattern notes:
//   - `\\s*\\n` after the opening fence allows any whitespace + a
//     newline before the body (handles `````jsx\n` and `````\n` shapes)
//   - `[\\s\\S]*?` non-greedy so we stop at the FIRST closing fence,
//     not the last (some replies have multiple code blocks)
//   - We don't require a specific language; any alphanumeric tag is
//     allowed (jsx, tsx, html, javascript, js, react, etc.)
const FENCE_RE = /```[a-zA-Z]*\s*\n([\s\S]*?)```/;

export function extractCodeFence(input: string): ExtractCodeResult {
  if (!input) return { code: "", hadFence: false };
  const match = input.match(FENCE_RE);
  if (match && match[1]) {
    return { code: match[1].trim(), hadFence: true };
  }
  // No fence — return raw input trimmed. User probably pasted just
  // the code OR the AI responded in plain text (some configs do this).
  return { code: input.trim(), hadFence: false };
}
