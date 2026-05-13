// Composes the final text that lands in the editor when a user hits Insert.
// Layout:
//   1. Attribution comment (HTML comment for HTML mode, {/* … */} for JSX)
//   2. <style> block with the scoped CSS (Uiverse only; HyperUI skips)
//   3. Wrapped HTML — <div class="{scope}">…</div> for Uiverse, raw HTML for
//      HyperUI (tailwind handles scoping via utility classes already).
//
// JSX mode additionally runs the body through `htmlToJsx` (DOM-based walker,
// see ./html-to-jsx.ts) so inserted snippets compile.

import type { ComponentFull } from "./types";
import { applyScope, mintScopeId } from "./scope";
import { htmlToJsx } from "./html-to-jsx";

type Mode = "html" | "jsx";

function attributionHtml(c: ComponentFull): string {
  const author = c.author ? `${c.author} (${c.license})` : c.license;
  return `<!--
  Component: ${c.title}
  Source:    ${c.sourceUrl}
  Author:    ${author}
-->`;
}

function attributionJsx(c: ComponentFull): string {
  const author = c.author ? `${c.author} (${c.license})` : c.license;
  return `{/*
  Component: ${c.title}
  Source:    ${c.sourceUrl}
  Author:    ${author}
*/}`;
}

export interface InsertPayload {
  text: string;
  scopeId: string | null;
  requiredPlugins: string[];
}

export function buildInsertPayload(
  component: ComponentFull,
  mode: Mode
): InsertPayload {
  const needsScope = !!component.css;
  const scopeId = needsScope ? mintScopeId() : null;
  const scopedCss = scopeId ? applyScope(component.css!, scopeId) : null;

  let body = component.html;
  if (mode === "jsx") {
    body = htmlToJsx(body);
  }

  const parts: string[] = [];
  if (mode === "jsx") {
    parts.push(attributionJsx(component));
  } else {
    parts.push(attributionHtml(component));
  }

  if (scopedCss) {
    // In JSX mode we still use a plain <style> tag — React renders it into the
    // document head via the virtual DOM. The string is JSX-safe because we've
    // escaped curly braces in the HTML walker, and CSS curly braces inside a
    // template literal are fine.
    if (mode === "jsx") {
      parts.push(`<style>{\`\n${scopedCss}\n\`}</style>`);
    } else {
      parts.push(`<style>\n${scopedCss}\n</style>`);
    }
  }

  if (scopeId) {
    const attr = mode === "jsx" ? `className="${scopeId}"` : `class="${scopeId}"`;
    parts.push(`<div ${attr}>\n${body}\n</div>`);
  } else {
    parts.push(body);
  }

  return {
    text: parts.join("\n\n") + "\n",
    scopeId,
    requiredPlugins: component.tailwindPlugins ?? [],
  };
}
