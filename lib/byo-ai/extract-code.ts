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

// Match the FIRST ```lang...``` block. Language tag is optional;
// the body separator may be `\n`, whitespace, or nothing at all
// (Claude fast-mode occasionally emits ```jsx<code>``` with no
// newline). Non-greedy so we stop at the first closing fence — for
// the rare case where the file content itself contains a nested
// fence, we'd false-truncate; that's an accepted trade-off vs the
// greedy alternative which would cross-capture multiple separate
// code blocks (worse).
//
// L3 fix (2026-05-21): removed required `\n` after the lang tag so
// compact fences match.
//
// Pattern notes:
//   - `\\s*` (no \\n required) handles compact frontier-model replies
//   - `[\\s\\S]*?` non-greedy — first closing fence wins
//   - Language tag is `[a-zA-Z]*` (lowercase + uppercase letters)
const FENCE_RE = /```[a-zA-Z]*\s*([\s\S]*?)```/;

export function extractCodeFence(input: string): ExtractCodeResult {
  if (!input) return { code: "", hadFence: false };
  // Normalize Windows / classic-Mac line endings → \n. Pasting from a
  // browser textarea on Windows often yields \r\n; the downstream
  // Babel parse + OID injection are newline-sensitive in a few edge
  // cases, and \r\n in JSX template-literal style blocks can confuse
  // the iframe runtime.
  const normalized = input.replace(/\r\n?/g, "\n");
  const match = normalized.match(FENCE_RE);
  if (match && match[1]) {
    return { code: match[1].trim(), hadFence: true };
  }
  // No fence — return raw input trimmed. User probably pasted just
  // the code OR the AI responded in plain text (some configs do this).
  return { code: normalized.trim(), hadFence: false };
}
