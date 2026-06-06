// Page-level inserts (palette / gradient <style> blocks) must land as the
// FIRST CHILD of the component's outermost returned JSX root — right after that
// root's opening tag's `>`. The previous regex (`return\s*\(\s*<Tag>`) only
// matched the parenthesised `return (` form, so arrow-implicit returns
// (`const App = () => <div>…`), un-parenthesised `return <div>…`, and fragment
// roots fell through to a raw cursor insert that could drop the <style> mid-
// expression → parse error → blank preview.
//
// This finds the JSX root via a real parse (handles every return shape) and
// returns the byte offset just after its opening tag. Returns null when there
// is no usable JSX root (no JSX, or the root is a self-closing element that
// can't take children) — the caller then refuses/falls back rather than
// corrupting the source.

import { parse } from "@babel/parser";

interface MinNode {
  type?: string;
  start?: number;
  end?: number;
  openingElement?: { end?: number; selfClosing?: boolean };
  openingFragment?: { end?: number };
}

export function findJsxRootInsertOffset(source: string): number | null {
  let ast: { program?: unknown };
  try {
    ast = parse(source, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
      errorRecovery: true,
    }) as { program?: unknown };
  } catch {
    return null;
  }

  let best: MinNode | null = null;
  const SKIP = new Set(["loc", "start", "end", "leadingComments", "trailingComments", "comments", "tokens", "extra"]);

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return;
    const n = node as MinNode & Record<string, unknown>;
    if (n.type === "JSXElement" || n.type === "JSXFragment") {
      // Outermost/first JSX root = smallest start offset. Don't descend into
      // a root's children — they are not themselves roots.
      if (best === null || (typeof n.start === "number" && typeof best.start === "number" && n.start < best.start)) {
        best = n;
      }
      return;
    }
    for (const k in n) {
      if (SKIP.has(k)) continue;
      const child = n[k];
      if (Array.isArray(child)) {
        for (const c of child) walk(c);
      } else if (child && typeof child === "object" && (child as { type?: string }).type) {
        walk(child);
      }
    }
  }

  walk(ast.program);
  if (!best) return null;

  const b = best as MinNode;
  if (b.type === "JSXElement") {
    const open = b.openingElement;
    if (!open || typeof open.end !== "number" || open.selfClosing) return null;
    return open.end;
  }
  // JSXFragment
  const of = b.openingFragment;
  return of && typeof of.end === "number" ? of.end : null;
}
