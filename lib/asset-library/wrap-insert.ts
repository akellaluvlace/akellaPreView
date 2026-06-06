// Library asset inserts (fonts, patterns, shadows, illustrations, mockups)
// emit an attribution comment plus one or more sibling nodes — e.g.
// buildFontInsert emits comment + <link> + <style> (three top-level nodes).
// In JSX mode, inserting 2+ top-level nodes at the cursor (which usually lands
// INSIDE the JSX return) produces Babel's "Adjacent JSX elements must be
// wrapped in an enclosing tag" → the whole preview blanks.
//
// Wrap genuine multi-node JSX payloads in a Fragment (`<>...</>`) so they are a
// single node. The fragment collapses at render time (no DOM bloat). HTML mode
// tolerates sibling Comment+Element nodes natively, so it is left untouched.
// Single-node payloads (one icon / image / element) are returned unchanged.

import { parse } from "@babel/parser";

function countTopLevelNodes(text: string): number {
  try {
    const ast = parse(text, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
      errorRecovery: true,
    }) as { program?: { body?: unknown[] } };
    const body = ast?.program?.body;
    return Array.isArray(body) ? body.length : 1;
  } catch {
    // Unparseable as-is — wrapping in a Fragment can only help, never hurt.
    return 2;
  }
}

export function wrapMultiRootJsxInsert(
  text: string,
  mode: "html" | "jsx",
): string {
  if (mode !== "jsx") return text;
  if (countTopLevelNodes(text) <= 1) return text;
  return `<>\n${text}\n</>`;
}
