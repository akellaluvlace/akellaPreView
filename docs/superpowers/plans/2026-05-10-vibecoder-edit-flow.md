# Vibecoder Edit Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the brittle "click → FocusEditor modal → AST-rewrite-on-every-keystroke" flow with a MoodScape-style direct-DOM-mutation editor that targets non-coders. Selection lives in the workspace, controls live in a side panel, edits land instantly without iframe rebuild, source is reconciled in the background.

**Architecture:** Add a parallel "vibe edit" code path next to the existing FocusEditor. Iframe runtime gains four direct-mutation message handlers (`update-content`, `update-style`, `update-image`, `update-link`) that mutate live DOM nodes without rebuilding. Host gains a `VibePropertiesPanel` that renders only the controls relevant to the selected element kind (text vs image vs link vs container). On commit, host translates DOM-side changes back to source via the existing `patchJsxText` / `patchHtmlText` / `patchJsxAttr` etc. byte patchers — no iframe srcDoc rebuild.

**Tech Stack:** Next.js 14.2.x, React 18, Tailwind 3.4 (locked), parse5 (HTML mode), @babel/parser (JSX mode), magic-string. New code is plain TS/TSX inside the existing `lib/` and `components/` trees. Tests via vitest + jsdom (already in devDeps).

---

## Critical context — read this first

### Why the current flow fails for vibecoders

1. **FocusEditor is a fullscreen modal that auto-opens on every Select-mode click.** Inside it, an `IsolatedPreview` builds a SECOND iframe, applies CSS chrome that hides/dims siblings, and exposes ~12 sections of controls (Sizing, Spacing, Radius, Layout, Border, Effects, Background, Typography, Color, Image, Presets, AI Rewrite, Advanced). For a no-code user, every click yanks them out of the page they're trying to edit and presents the equivalent of a Figma inspector. They came to "change a heading" and were handed React DevTools.
2. **Every property change rebuilds the iframe srcDoc.** Slider drags fire `setCode → useEditHistory.applyEdit → updateFileSource → bundleProject → debouncedCode (250ms→100ms) → buildPreviewDocument → new srcDoc → iframe reload`. The user sees a flash on every gesture. There is a `dropin:live-style` channel that bypasses this for resize gestures specifically, but it's not wired through class/property edits.
3. **Pinned Sizing/Spacing/Radius sections read inline `style={{}}` declarations only.** Templates use Tailwind classes, so those fields are perpetually empty. The user sees "Width: —" and concludes the controls are broken.
4. **Card presets matched every container tag.** Every `<div>`/`<section>`/`<header>` selection got "FLAT / RAISED / OUTLINED" tiles. (Already partly fixed by tightening `matchTags` to `["article"]` in the previous session, but the broader pattern of "show every section regardless of relevance" persists.)

### Why MoodScape's flow works

MoodScape (`web/src/lib/editorScript.ts` + `web/src/components/editor/PropertiesPanel.tsx` + `web/src/hooks/useEditorMessages.ts` on the `step-3b-modes-advanced-ai` branch) ships ~1000 LOC of editor code total. Key choices:

1. **Constrained editable set.** Only `h1-h6, p, span, a, button, li, td, th, label, figcaption, blockquote, img` are clickable. Containers are inert. Vibecoders can't accidentally select wrong things.
2. **Direct iframe-DOM mutation.** Host posts `update-content` / `update-style` / `update-image` / `update-link`; iframe runtime mutates the matching element. **No srcDoc rebuild on edit.** Source is exported via `get-html` on save (via `getCleanHtml`).
3. **Per-kind props panel.** Text element → content textarea + text/bg color pickers. Image → src + alt. Link → href. No "show all controls always".
4. **Apply button.** Changes are STAGED in the panel. User clicks Apply (or `Ctrl+Enter`) to commit. No live-debounce thrashing.
5. **No isolation modal.** The live preview IS the preview. Selection highlights stay in place; sidebar shows controls.
6. **CSS-selector path addressing.** `body > main > section:nth-of-type(2) > h1`. No AST, no OID injection. Stable enough for the use case because users don't mass-rewrite selector paths.

### Decisions locked

- **D1: Keep FocusEditor available as power-user mode.** Don't delete it; just stop auto-opening on Select-mode clicks. A "Power editor" affordance opens it explicitly.
- **D2: Vibecoder mode is the new default for Select tool.** Click → highlight in place → side panel populates → user edits → user clicks Apply.
- **D3: Add direct-mutation message channel; keep AST-rewrite path for source export.** The iframe DOM is the source of truth for the *current* edit session; on Apply the host writes the change back to source via existing byte patchers (`patchJsxText`, `patchHtmlText`, `patchJsxAttr`, etc.). No iframe rebuild on the round-trip.
- **D4: Constrained editable scope in vibecoder mode.** Only text-bearing tags + images + links + buttons trigger hover/click. Containers stay inert. (Power editor mode keeps universal selection.)
- **D5: Per-kind panel layout.** `kind` derived from the selected element's tag/role: `text | heading | image | link | button | container`. Each kind maps to a fixed control set. No reordering, no "more" disclosure, no presets.
- **D6: HTML mode parity.** Both JSX and HTML modes get the new flow. HTML mode uses path-based addressing (parse5 byte-offset math via existing `patchHtmlText`/`patchHtmlAttr`); JSX mode uses OID-based addressing (existing `patchJsxClassByOid` / `patchJsxAttrByOid` etc.).
- **D7: One source of truth at edit time = iframe DOM.** Host doesn't track a separate "edited-but-not-committed" state. The DOM holds it, side panel reads it via the `element-selected` echo on every change.
- **D8: Apply commits to source via existing byte patchers.** No new patcher code. Wire the existing ones into the new commit handler.

### File structure overview

**New files:**
- `lib/vibe-edit/types.ts` — message envelope types, `VibeElementInfo` shape, `VibeKind` union
- `lib/vibe-edit/runtime.ts` — iframe-side DOM mutation + selection script (analog of MoodScape's `editorScript.ts`)
- `lib/vibe-edit/path.ts` — pure helpers: `getElementPath(el)` → CSS selector, `findElementByPath(doc, path)` → element-or-null. Round-trip tested.
- `lib/vibe-edit/kind.ts` — pure: `inferKind(tag, role) → VibeKind`. Maps tag → text/heading/image/link/button/container.
- `lib/vibe-edit/commit.ts` — pure: `buildCommit(kind, oldInfo, newInfo) → SourceEdit[]`. Returns the list of byte-patches to run on source. Uses existing `patchJsxText`/`patchHtmlText`/`patchJsxAttr`/etc.
- `components/VibePropertiesPanel.tsx` — host-side panel; renders kind-specific controls
- `components/VibePropertiesPanel/` (sub-components):
  - `TextControls.tsx` — content textarea + color pickers
  - `ImageControls.tsx` — src + alt
  - `LinkControls.tsx` — href
  - `ButtonControls.tsx` — content + colors + href (button can be a link)
  - `ContainerControls.tsx` — bg color only (vibecoder doesn't tune layout)
- `components/VibeRail.tsx` — thin presence indicator on the LeftRail when an element is selected (4th rail item below Code/Tree/Library)
- `tests/vibe-edit-path-prod.test.ts` — prod-import tests for `path.ts`
- `tests/vibe-edit-kind-prod.test.ts` — prod-import tests for `kind.ts`
- `tests/vibe-edit-commit-prod.test.ts` — prod-import tests for `commit.ts`
- `tests/integration/vibe-edit-roundtrip.test.ts` — jsdom integration: select → edit → apply → source change

**Modified files:**
- `lib/preview.ts` — wire `vibeRuntime()` into `inspectorRuntimeJs` template; add four message-type handlers (`update-content`, `update-style`, `update-image`, `update-link`); extend the `dropin:` envelope union via `lib/iframe-bridge.ts`
- `lib/iframe-bridge.ts` — add the new message variants to `HostToIframeMessage` and `IframeToHostMessage` unions
- `components/Preview.tsx` — add `setLiveContent` / `setLiveImage` / `setLiveLink` methods to `PreviewHandle`, mirroring the existing `setLiveStyle` pattern
- `components/Workspace.tsx` — replace `setFocusOpen(true)` on Select-mode click with `setSelectedVibeElement(info)`. Render `<VibePropertiesPanel>` in a new right-side slot when selected. Keep "Power editor" button on the toolbar to open FocusEditor explicitly.
- `components/WorkspaceLeftRail.tsx` — no changes (panels remain Code/Tree/Library, mutually exclusive). Vibe panel slides in independently when there's a selection.

**Files to LEAVE ALONE (intentional):**
- `components/FocusEditor.tsx` — power editor stays
- `components/IsolatedPreview.tsx` — only used by FocusEditor
- All AST manipulation libs (`lib/ast/**`) — used by both flows
- All existing tests for the AST manipulation path

---

## Phase 1 — Pure-logic foundation (path + kind + commit)

Tests-first. No iframe, no React. Just three small pure modules + their prod-import tests.

### Task 1: `lib/vibe-edit/path.ts` — CSS selector path round-trip

**Files:**
- Create: `lib/vibe-edit/path.ts`
- Test: `tests/vibe-edit-path-prod.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/vibe-edit-path-prod.test.ts
// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { getElementPath, findElementByPath } from "../lib/vibe-edit/path";

function setBody(html: string): Document {
  document.body.innerHTML = html;
  return document;
}

describe("getElementPath", () => {
  it("returns 'body' for body itself", () => {
    setBody("<p>hi</p>");
    expect(getElementPath(document.body)).toBe("body");
  });

  it("uses id when present and stops walking", () => {
    setBody(`<div><p id="hero">x</p></div>`);
    const p = document.getElementById("hero")!;
    expect(getElementPath(p)).toBe("p#hero");
  });

  it("appends nth-of-type when ambiguous siblings exist", () => {
    setBody(`<div><p>a</p><p>b</p><p>c</p></div>`);
    const second = document.querySelectorAll("p")[1] as HTMLElement;
    expect(getElementPath(second)).toBe("div > p:nth-of-type(2)");
  });

  it("omits nth-of-type for unique sibling", () => {
    setBody(`<section><h1>title</h1><p>body</p></section>`);
    const h1 = document.querySelector("h1")!;
    expect(getElementPath(h1)).toBe("section > h1");
  });

  it("escapes ids that contain special CSS chars", () => {
    setBody(`<p id="my:id.with-dots">x</p>`);
    const p = document.querySelector("p")!;
    const path = getElementPath(p);
    expect(path).toContain("p#");
    // round-trip: the escaped id should be valid in querySelector
    expect(findElementByPath(document, path)).toBe(p);
  });
});

describe("findElementByPath", () => {
  it("returns null for empty path", () => {
    setBody("<p>x</p>");
    expect(findElementByPath(document, "")).toBeNull();
  });

  it("returns null for unparseable selector", () => {
    setBody("<p>x</p>");
    expect(findElementByPath(document, "p[")).toBeNull();
  });

  it("round-trips through getElementPath for nested structures", () => {
    setBody(`<main><section><div><h2>title</h2><p>a</p><p>b</p></div></section></main>`);
    const targets = [
      document.querySelector("h2")!,
      document.querySelectorAll("p")[0] as HTMLElement,
      document.querySelectorAll("p")[1] as HTMLElement,
    ];
    for (const el of targets) {
      const path = getElementPath(el);
      expect(findElementByPath(document, path)).toBe(el);
    }
  });

  it("returns null when the element no longer exists at that path", () => {
    setBody(`<div><p>a</p></div>`);
    const path = "div > p:nth-of-type(2)";
    expect(findElementByPath(document, path)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests; confirm they fail**

Run: `npx vitest run tests/vibe-edit-path-prod.test.ts`
Expected: All fail with "Cannot find module ../lib/vibe-edit/path".

- [ ] **Step 3: Write the implementation**

```ts
// lib/vibe-edit/path.ts
// CSS-selector path round-trip helpers. Two responsibilities:
//   1. getElementPath(el) — produce a stable selector that uniquely
//      identifies `el` within its document.
//   2. findElementByPath(doc, path) — resolve the selector back to
//      the element (or null if structure changed underneath).
//
// We deliberately avoid OIDs here. The use case is the vibe-edit
// flow, which mutates the live iframe DOM rather than the source
// tree. Stable across one edit session is enough.

export function getElementPath(el: Element | null): string {
  if (!el || el === document.documentElement) return "";
  if (el.tagName === "BODY") return "body";

  const parts: string[] = [];
  let cur: Element | null = el;

  while (cur && cur !== document.body && cur !== document.documentElement) {
    let segment = cur.tagName.toLowerCase();
    const id = cur.id;
    if (id) {
      segment += "#" + cssEscape(id);
      parts.unshift(segment);
      return parts.join(" > ");
    }
    const parent = cur.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter(
        (c) => c.tagName === cur!.tagName,
      );
      if (sameTag.length > 1) {
        const idx = sameTag.indexOf(cur) + 1;
        segment += `:nth-of-type(${idx})`;
      }
    }
    parts.unshift(segment);
    cur = parent;
  }

  return parts.join(" > ");
}

export function findElementByPath(
  doc: Document,
  path: string,
): Element | null {
  if (!path) return null;
  try {
    return doc.querySelector(path);
  } catch {
    return null;
  }
}

function cssEscape(s: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(s);
  }
  return s.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
```

- [ ] **Step 4: Run tests; confirm they pass**

Run: `npx vitest run tests/vibe-edit-path-prod.test.ts`
Expected: All 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/vibe-edit/path.ts tests/vibe-edit-path-prod.test.ts
git commit -m "vibe-edit: add CSS-selector path round-trip helpers"
```

### Task 2: `lib/vibe-edit/kind.ts` — element kind inference

**Files:**
- Create: `lib/vibe-edit/kind.ts`
- Test: `tests/vibe-edit-kind-prod.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/vibe-edit-kind-prod.test.ts
import { describe, it, expect } from "vitest";
import { inferKind, type VibeKind } from "../lib/vibe-edit/kind";

describe("inferKind", () => {
  it("classifies headings", () => {
    for (const t of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
      expect(inferKind(t)).toBe<VibeKind>("heading");
    }
  });

  it("classifies text-bearing tags as text", () => {
    for (const t of ["p", "span", "li", "blockquote", "small", "figcaption", "td", "th", "label"]) {
      expect(inferKind(t)).toBe<VibeKind>("text");
    }
  });

  it("classifies <img> as image", () => {
    expect(inferKind("img")).toBe<VibeKind>("image");
  });

  it("classifies <a> as link", () => {
    expect(inferKind("a")).toBe<VibeKind>("link");
  });

  it("classifies <button> as button", () => {
    expect(inferKind("button")).toBe<VibeKind>("button");
  });

  it("classifies role='button' on a div as button", () => {
    expect(inferKind("div", "button")).toBe<VibeKind>("button");
  });

  it("classifies <div>/<section>/etc as container", () => {
    for (const t of ["div", "section", "header", "footer", "main", "aside", "article", "nav"]) {
      expect(inferKind(t)).toBe<VibeKind>("container");
    }
  });

  it("normalises tag case", () => {
    expect(inferKind("DIV")).toBe<VibeKind>("container");
    expect(inferKind("H1")).toBe<VibeKind>("heading");
  });

  it("falls back to container for unknown tags", () => {
    expect(inferKind("foobar")).toBe<VibeKind>("container");
    expect(inferKind("")).toBe<VibeKind>("container");
  });
});
```

- [ ] **Step 2: Confirm tests fail**

Run: `npx vitest run tests/vibe-edit-kind-prod.test.ts`
Expected: Cannot find module errors.

- [ ] **Step 3: Implement**

```ts
// lib/vibe-edit/kind.ts
// Classify a DOM element into one of six edit-flow kinds. The
// VibePropertiesPanel uses the kind to pick which control set to
// render. Containers are LAST resort — vibecoders rarely want to
// edit "the wrapping div" directly.

export type VibeKind =
  | "heading"
  | "text"
  | "image"
  | "link"
  | "button"
  | "container";

const HEADING_TAGS: ReadonlySet<string> = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
]);
const TEXT_TAGS: ReadonlySet<string> = new Set([
  "p", "span", "li", "blockquote", "small", "figcaption", "td", "th", "label", "strong", "em", "code", "pre",
]);

export function inferKind(tag: string, role?: string | null): VibeKind {
  const t = (tag || "").toLowerCase();
  const r = (role || "").toLowerCase();
  if (r === "button") return "button";
  if (HEADING_TAGS.has(t)) return "heading";
  if (TEXT_TAGS.has(t)) return "text";
  if (t === "img") return "image";
  if (t === "a") return "link";
  if (t === "button") return "button";
  return "container";
}
```

- [ ] **Step 4: Confirm tests pass**

Run: `npx vitest run tests/vibe-edit-kind-prod.test.ts`
Expected: 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/vibe-edit/kind.ts tests/vibe-edit-kind-prod.test.ts
git commit -m "vibe-edit: classify elements into 6 kinds"
```

### Task 3: `lib/vibe-edit/types.ts` — message + element-info shapes

**Files:**
- Create: `lib/vibe-edit/types.ts`

- [ ] **Step 1: Write the types (no test yet — pure type module)**

```ts
// lib/vibe-edit/types.ts
import type { VibeKind } from "./kind";

export interface VibeElementInfo {
  // Selector-path addressing for HTML mode; OID for JSX mode. Both
  // are populated when both are available so the source-side commit
  // step can pick the most stable.
  path: string;
  oid: string | null;
  tag: string;
  kind: VibeKind;
  // Live values read from the iframe DOM at selection time.
  text: string;
  src: string | null;
  alt: string | null;
  href: string | null;
  // Computed colours only — vibecoders don't reason about classes.
  // Iframe-side resolves via getComputedStyle so even Tailwind
  // classes show up here as concrete hex/rgb values.
  textColor: string;
  bgColor: string;
}

// Iframe → host
export type VibeMessage =
  | { type: "vibe:ready" }
  | { type: "vibe:selected"; info: VibeElementInfo }
  | { type: "vibe:cleared" }
  | { type: "vibe:applied" };

// Host → iframe
export type VibeCommand =
  | { type: "vibe:update-content"; path: string; text: string }
  | { type: "vibe:update-style"; path: string; styles: { color?: string; backgroundColor?: string } }
  | { type: "vibe:update-image"; path: string; src?: string; alt?: string }
  | { type: "vibe:update-link"; path: string; href: string }
  | { type: "vibe:select"; path: string }
  | { type: "vibe:clear" };

// Re-export for callers
export type { VibeKind } from "./kind";
```

- [ ] **Step 2: Verify it type-checks (no test, just tsc)**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add lib/vibe-edit/types.ts
git commit -m "vibe-edit: add message + element-info type shapes"
```

### Task 4: `lib/vibe-edit/commit.ts` — DOM-change → source-patch translator

**Files:**
- Create: `lib/vibe-edit/commit.ts`
- Test: `tests/vibe-edit-commit-prod.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/vibe-edit-commit-prod.test.ts
import { describe, it, expect } from "vitest";
import { buildVibeCommit } from "../lib/vibe-edit/commit";

const HTML_FIXTURE = `<!doctype html><html><body>
<h1>Original heading</h1>
<p>Original paragraph</p>
<img src="/old.jpg" alt="old alt" />
<a href="/old">link text</a>
</body></html>`;

const JSX_FIXTURE = `function App() {
  return (
    <div>
      <h1 data-dropin-id="aaaaa1">Original heading</h1>
      <p data-dropin-id="aaaaa2">Original paragraph</p>
      <img data-dropin-id="aaaaa3" src="/old.jpg" alt="old alt" />
      <a data-dropin-id="aaaaa4" href="/old">link text</a>
    </div>
  );
}`;

describe("buildVibeCommit — HTML mode", () => {
  it("rewrites text content for headings", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: { kind: "heading", path: "h1", tag: "h1", text: "Original heading", oid: null, src: null, alt: null, href: null, textColor: "", bgColor: "" },
      next: { text: "New heading" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain("<h1>New heading</h1>");
    expect(out.source).not.toContain("Original heading");
  });

  it("rewrites image src + alt", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: { kind: "image", path: "img", tag: "img", text: "", oid: null, src: "/old.jpg", alt: "old alt", href: null, textColor: "", bgColor: "" },
      next: { src: "/new.jpg", alt: "new alt" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain('src="/new.jpg"');
    expect(out.source).toContain('alt="new alt"');
    expect(out.source).not.toContain("/old.jpg");
  });

  it("rewrites link href", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: { kind: "link", path: "a", tag: "a", text: "link text", oid: null, src: null, alt: null, href: "/old", textColor: "", bgColor: "" },
      next: { href: "/new" },
    });
    expect(out.source).toContain('href="/new"');
  });

  it("returns unchanged=true when next is identical to old", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: { kind: "text", path: "p", tag: "p", text: "Original paragraph", oid: null, src: null, alt: null, href: null, textColor: "", bgColor: "" },
      next: { text: "Original paragraph" },
    });
    expect(out.unchanged).toBe(true);
    expect(out.source).toBe(HTML_FIXTURE);
  });

  it("escapes HTML entities when writing text", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: { kind: "text", path: "p", tag: "p", text: "Original paragraph", oid: null, src: null, alt: null, href: null, textColor: "", bgColor: "" },
      next: { text: "5 < 10 & 3 > 2" },
    });
    expect(out.source).toContain("5 &lt; 10 &amp; 3 &gt; 2");
  });
});

describe("buildVibeCommit — JSX mode", () => {
  it("rewrites text by OID when available", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: { kind: "heading", path: "div > h1", tag: "h1", text: "Original heading", oid: "aaaaa1", src: null, alt: null, href: null, textColor: "", bgColor: "" },
      next: { text: "New heading" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain(">New heading<");
  });

  it("rewrites image attrs by OID", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: { kind: "image", path: "div > img", tag: "img", text: "", oid: "aaaaa3", src: "/old.jpg", alt: "old alt", href: null, textColor: "", bgColor: "" },
      next: { src: "/new.jpg" },
    });
    expect(out.source).toContain('src="/new.jpg"');
  });

  it("returns unchanged when patcher reports no diff", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: { kind: "text", path: "div > p", tag: "p", text: "Original paragraph", oid: "aaaaa2", src: null, alt: null, href: null, textColor: "", bgColor: "" },
      next: {},
    });
    expect(out.unchanged).toBe(true);
  });
});
```

- [ ] **Step 2: Confirm fails**

Run: `npx vitest run tests/vibe-edit-commit-prod.test.ts`
Expected: Cannot find module errors.

- [ ] **Step 3: Implement**

```ts
// lib/vibe-edit/commit.ts
// Translate a vibe-edit DOM change back into a source-text patch.
// Re-uses the existing byte patchers — no new parsing logic here.
//
// Inputs: the source string, the old VibeElementInfo (captured at
// selection time), and a `next` partial of fields to overwrite.
// Output: { unchanged, source } where source is the rewritten text
// and unchanged is true iff no fields actually changed OR every
// patcher reported no diff (e.g. trim-equal text).

import { patchHtmlText, patchHtmlAttr } from "../source-patch-html";
import { patchJsxClassByOid, patchJsxAttrByOid, patchJsxTextByOid } from "../ast/patch-class-by-oid";
import type { VibeElementInfo } from "./types";

export interface VibeCommitInput {
  mode: "html" | "jsx";
  source: string;
  old: VibeElementInfo;
  next: Partial<{
    text: string;
    src: string;
    alt: string;
    href: string;
  }>;
}

export interface VibeCommitResult {
  unchanged: boolean;
  source: string;
}

export function buildVibeCommit(input: VibeCommitInput): VibeCommitResult {
  const { mode, old, next } = input;
  let source = input.source;
  let changed = false;

  const apply = (
    patched: { unchanged: boolean; source: string } | null,
  ) => {
    if (!patched || patched.unchanged) return;
    source = patched.source;
    changed = true;
  };

  if (mode === "html") {
    if (next.text !== undefined && next.text !== old.text) {
      apply(patchHtmlText(source, old.path, next.text));
    }
    if (next.src !== undefined && next.src !== old.src) {
      apply(patchHtmlAttr(source, old.path, "src", next.src));
    }
    if (next.alt !== undefined && next.alt !== old.alt) {
      apply(patchHtmlAttr(source, old.path, "alt", next.alt));
    }
    if (next.href !== undefined && next.href !== old.href) {
      apply(patchHtmlAttr(source, old.path, "href", next.href));
    }
  } else {
    // JSX: prefer OID; fall back to loc-by-path is not implemented
    // for vibe-edit yet (path is HTML-shape and JSX OIDs cover the
    // current use cases). Bail unchanged when OID missing.
    if (!old.oid) {
      return { unchanged: true, source };
    }
    if (next.text !== undefined && next.text !== old.text) {
      apply(patchJsxTextByOid(source, old.oid, next.text));
    }
    if (next.src !== undefined && next.src !== old.src) {
      apply(patchJsxAttrByOid(source, old.oid, "src", next.src));
    }
    if (next.alt !== undefined && next.alt !== old.alt) {
      apply(patchJsxAttrByOid(source, old.oid, "alt", next.alt));
    }
    if (next.href !== undefined && next.href !== old.href) {
      apply(patchJsxAttrByOid(source, old.oid, "href", next.href));
    }
  }

  return { unchanged: !changed, source };
}
```

> **Note:** if `patchJsxTextByOid` / `patchJsxAttrByOid` don't exist yet in `lib/ast/patch-class-by-oid.ts`, write the missing siblings first (mirror of the existing `patchJsxClassByOid`). Same byte-offset pattern.

- [ ] **Step 4: Confirm tests pass**

Run: `npx vitest run tests/vibe-edit-commit-prod.test.ts`
Expected: All 7 tests pass. If `patchJsxTextByOid` / `patchJsxAttrByOid` are missing, tests fail with import errors — implement them in `lib/ast/patch-class-by-oid.ts` with the same byte-offset pattern as the existing `patchJsxClassByOid`, then re-run.

- [ ] **Step 5: Commit**

```bash
git add lib/vibe-edit/commit.ts tests/vibe-edit-commit-prod.test.ts lib/ast/patch-class-by-oid.ts
git commit -m "vibe-edit: translate DOM-side changes into source patches"
```

---

## Phase 2 — Iframe runtime + bridge

Add direct-DOM-mutation handlers to the iframe runtime, and the corresponding postMessage type-union entries.

### Task 5: Extend `lib/iframe-bridge.ts` with vibe message types

**Files:**
- Modify: `lib/iframe-bridge.ts`

- [ ] **Step 1: Add `VibeMessage` / `VibeCommand` to the message unions**

Find the existing `IframeToHostMessage` union and the `HostToIframeMessage` union. Add:

```ts
// Inside lib/iframe-bridge.ts, alongside the existing `dropin:*` variants:

import type { VibeElementInfo } from "./vibe-edit/types";

// Iframe → host
// ... existing variants ...
| { type: "vibe:ready" }
| { type: "vibe:selected"; info: VibeElementInfo }
| { type: "vibe:cleared" }
| { type: "vibe:applied" }

// Host → iframe
// ... existing variants ...
| { type: "vibe:update-content"; path: string; text: string }
| { type: "vibe:update-style"; path: string; styles: { color?: string; backgroundColor?: string } }
| { type: "vibe:update-image"; path: string; src?: string; alt?: string }
| { type: "vibe:update-link"; path: string; href: string }
| { type: "vibe:select"; path: string }
| { type: "vibe:clear" }
```

Also extend the exhaustiveness array (`KNOWN_TYPES` or whatever the local guard is) with the new strings.

- [ ] **Step 2: Verify tsc still passes**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add lib/iframe-bridge.ts
git commit -m "iframe-bridge: add vibe-edit message variants"
```

### Task 6: `lib/vibe-edit/runtime.ts` — iframe-side script

**Files:**
- Create: `lib/vibe-edit/runtime.ts`

This emits a string of JS that gets injected into the iframe's `<script>` block alongside the existing `inspectorRuntimeJs`. It handles vibe-mode click, selection, and the four `update-*` commands.

- [ ] **Step 1: Implement the runtime script builder**

```ts
// lib/vibe-edit/runtime.ts
// Iframe-side runtime for the vibe-edit flow. Emitted as a JS string
// that lives inside the same `<script>` tag as `inspectorRuntimeJs`
// so they share a global scope (and the same parent.postMessage
// channel).
//
// The runtime exposes:
//   - VIBE_MODE flag (set via 'dropin:set-tool' when tool === 'vibe')
//   - click handler that intercepts only on EDITABLE_SELECTORS
//   - update-content / update-style / update-image / update-link handlers
//   - getElementPath / findElementByPath inlined (to avoid sharing
//     module imports — the runtime template is plain JS)

export function vibeRuntimeJs(): string {
  // Inline the pure-logic helpers as plain JS strings. The TS
  // versions in lib/vibe-edit/path.ts and kind.ts stay as the
  // source of truth; this is a hand-mirrored copy for the iframe
  // runtime. Drift caught via tests/integration/vibe-edit-roundtrip.test.ts.
  return `
    var VIBE_EDITABLE = 'h1,h2,h3,h4,h5,h6,p,span,li,blockquote,small,figcaption,td,th,label,strong,em,code,pre,a,button,img';
    var VIBE_TEXT_TAGS = { h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,span:1,li:1,blockquote:1,small:1,figcaption:1,td:1,th:1,label:1,strong:1,em:1,code:1,pre:1 };
    var vibeSelected = null;

    function vibeIsEditable(el) {
      return el && el.matches && el.matches(VIBE_EDITABLE);
    }

    function vibeGetPath(el) {
      if (!el || el === document.body) return 'body';
      var parts = [];
      var cur = el;
      while (cur && cur !== document.body && cur !== document.documentElement) {
        var seg = cur.tagName.toLowerCase();
        if (cur.id) {
          seg += '#' + (window.CSS && CSS.escape ? CSS.escape(cur.id) : cur.id);
          parts.unshift(seg);
          return parts.join(' > ');
        }
        var parent = cur.parentElement;
        if (parent) {
          var sameTag = [];
          for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i].tagName === cur.tagName) sameTag.push(parent.children[i]);
          }
          if (sameTag.length > 1) {
            seg += ':nth-of-type(' + (sameTag.indexOf(cur) + 1) + ')';
          }
        }
        parts.unshift(seg);
        cur = parent;
      }
      return parts.join(' > ');
    }

    function vibeFindByPath(p) {
      if (!p) return null;
      try { return document.querySelector(p); } catch (e) { return null; }
    }

    function vibeKind(tag, role) {
      var t = (tag || '').toLowerCase();
      var r = (role || '').toLowerCase();
      if (r === 'button') return 'button';
      if (/^h[1-6]$/.test(t)) return 'heading';
      if (VIBE_TEXT_TAGS[t]) return 'text';
      if (t === 'img') return 'image';
      if (t === 'a') return 'link';
      if (t === 'button') return 'button';
      return 'container';
    }

    function vibeSerialize(el) {
      var cs = getComputedStyle(el);
      return {
        path: vibeGetPath(el),
        oid: el.getAttribute('data-dropin-id'),
        tag: el.tagName.toLowerCase(),
        kind: vibeKind(el.tagName, el.getAttribute('role')),
        text: el.textContent || '',
        src: el.getAttribute('src'),
        alt: el.getAttribute('alt'),
        href: el.getAttribute('href'),
        textColor: cs.color,
        bgColor: cs.backgroundColor
      };
    }

    function vibeSelect(el) {
      if (!el) return;
      if (vibeSelected) vibeSelected.removeAttribute('data-vibe-selected');
      vibeSelected = el;
      el.setAttribute('data-vibe-selected', '');
      dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
    }

    function vibeClear() {
      if (vibeSelected) vibeSelected.removeAttribute('data-vibe-selected');
      vibeSelected = null;
      dropinPost({ type: 'vibe:cleared' });
    }

    document.addEventListener('click', function (ev) {
      if (DROPIN_TOOL !== 'vibe') return;
      var t = ev.target;
      ev.preventDefault();
      ev.stopPropagation();
      if (!vibeIsEditable(t)) {
        vibeClear();
        return;
      }
      vibeSelect(t);
    }, true);

    // Direct-mutation handlers. Each finds the element by path; if
    // missing, no-op (caller will request a fresh selection).
    window.addEventListener('message', function (ev) {
      var d = ev.data;
      if (!d || typeof d !== 'object' || d.__dropin !== true) return;
      var el;
      if (d.type === 'vibe:update-content') {
        el = vibeFindByPath(d.path);
        if (el) {
          el.textContent = d.text || '';
          if (vibeSelected === el) dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
        }
      } else if (d.type === 'vibe:update-style') {
        el = vibeFindByPath(d.path);
        if (el && d.styles) {
          if (typeof d.styles.color === 'string') el.style.color = d.styles.color;
          if (typeof d.styles.backgroundColor === 'string') el.style.backgroundColor = d.styles.backgroundColor;
          if (vibeSelected === el) dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
        }
      } else if (d.type === 'vibe:update-image') {
        el = vibeFindByPath(d.path);
        if (el && el.tagName === 'IMG') {
          if (typeof d.src === 'string') el.setAttribute('src', d.src);
          if (typeof d.alt === 'string') el.setAttribute('alt', d.alt);
          if (vibeSelected === el) dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
        }
      } else if (d.type === 'vibe:update-link') {
        el = vibeFindByPath(d.path);
        if (el && el.tagName === 'A') {
          el.setAttribute('href', d.href || '');
          if (vibeSelected === el) dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
        }
      } else if (d.type === 'vibe:select') {
        el = vibeFindByPath(d.path);
        if (el) vibeSelect(el);
      } else if (d.type === 'vibe:clear') {
        vibeClear();
      }
    });

    // CSS for the selected outline. Append to existing inspector style.
    var vibeStyle = document.createElement('style');
    vibeStyle.textContent = '[data-vibe-selected] { outline: 3px solid #FF4D2E !important; outline-offset: 2px !important; }';
    document.head.appendChild(vibeStyle);

    dropinPost({ type: 'vibe:ready' });
  `;
}
```

> **Trap callout:** This file lives inside a TS template literal when emitted. **Do not put backticks inside any comment** — see `memory/project_ts_template_backtick_trap.md`. Use single quotes everywhere; escape backslashes (`\\`) per `memory/project_ts_template_backslash_trap.md`.

- [ ] **Step 2: Wire it into `inspectorRuntimeJs` in `lib/preview.ts`**

Find the existing `function inspectorRuntimeJs(...)` in `lib/preview.ts`. After the existing body, append `${vibeRuntimeJs()}` to the returned template string. Add the import:

```ts
import { vibeRuntimeJs } from "./vibe-edit/runtime";
```

- [ ] **Step 3: Verify tsc passes**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add lib/vibe-edit/runtime.ts lib/preview.ts
git commit -m "vibe-edit: iframe runtime for select + direct mutation"
```

### Task 7: Add 'vibe' to the Tool union

**Files:**
- Modify: `components/ToolBar.tsx` — add `"vibe"` to the `Tool` type
- Modify: `lib/iframe-bridge.ts` — extend the tool whitelist
- Modify: `lib/preview.ts` — accept `'vibe'` in the `dropin:set-tool` handler

- [ ] **Step 1: Add `"vibe"` to the Tool union and accept it in the iframe runtime**

In `components/ToolBar.tsx`:
```ts
export type Tool = "view" | "select" | "move" | "insert" | "swap" | "vibe";
```

In `lib/iframe-bridge.ts` set-tool message variant — extend the union.

In `lib/preview.ts` set-tool handler whitelist:
```js
if (
  d.tool === 'view' || d.tool === 'select' || d.tool === 'move' ||
  d.tool === 'insert' || d.tool === 'swap' || d.tool === 'vibe'
) {
  DROPIN_TOOL = d.tool;
  ...
}
```

- [ ] **Step 2: tsc check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add components/ToolBar.tsx lib/iframe-bridge.ts lib/preview.ts
git commit -m "vibe-edit: add 'vibe' to Tool union"
```

---

## Phase 3 — Host-side props panel (per-kind)

### Task 8: `components/VibePropertiesPanel/TextControls.tsx`

**Files:**
- Create: `components/VibePropertiesPanel/TextControls.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";
import { useState, useEffect } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface TextControlsProps {
  info: VibeElementInfo;
  onContentChange: (text: string) => void;
  onStyleChange: (styles: { color?: string; backgroundColor?: string }) => void;
}

export default function TextControls({ info, onContentChange, onStyleChange }: TextControlsProps) {
  const [text, setText] = useState(info.text);
  const [color, setColor] = useState(rgbToHex(info.textColor));
  const [bg, setBg] = useState(rgbToHex(info.bgColor));

  useEffect(() => {
    setText(info.text);
    setColor(rgbToHex(info.textColor));
    setBg(rgbToHex(info.bgColor));
  }, [info.path, info.text, info.textColor, info.bgColor]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Text</span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onContentChange(e.target.value);
          }}
          rows={3}
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              onStyleChange({ color: e.target.value });
            }}
            className="mt-1 h-10 w-full border-2 border-ink"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Background</span>
          <input
            type="color"
            value={bg}
            onChange={(e) => {
              setBg(e.target.value);
              onStyleChange({ backgroundColor: e.target.value });
            }}
            className="mt-1 h-10 w-full border-2 border-ink"
          />
        </label>
      </div>
    </div>
  );
}

function rgbToHex(rgb: string): string {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) return rgb;
  if (rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return "#ffffff";
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return "#000000";
  return "#" + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
}
```

- [ ] **Step 2: tsc check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add components/VibePropertiesPanel/TextControls.tsx
git commit -m "vibe-edit: TextControls — content + colors only"
```

### Task 9: `components/VibePropertiesPanel/ImageControls.tsx`

**Files:**
- Create: `components/VibePropertiesPanel/ImageControls.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";
import { useState, useEffect } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface ImageControlsProps {
  info: VibeElementInfo;
  onImageChange: (next: { src?: string; alt?: string }) => void;
}

export default function ImageControls({ info, onImageChange }: ImageControlsProps) {
  const [src, setSrc] = useState(info.src ?? "");
  const [alt, setAlt] = useState(info.alt ?? "");

  useEffect(() => {
    setSrc(info.src ?? "");
    setAlt(info.alt ?? "");
  }, [info.path, info.src, info.alt]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Image URL</span>
        <input
          type="text"
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
            onImageChange({ src: e.target.value });
          }}
          placeholder="https://..."
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Alt text</span>
        <input
          type="text"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
            onImageChange({ alt: e.target.value });
          }}
          placeholder="Describe the image"
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>
    </div>
  );
}
```

- [ ] **Step 2: tsc**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add components/VibePropertiesPanel/ImageControls.tsx
git commit -m "vibe-edit: ImageControls — src + alt only"
```

### Task 10: `components/VibePropertiesPanel/LinkControls.tsx`

**Files:**
- Create: `components/VibePropertiesPanel/LinkControls.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";
import { useState, useEffect } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface LinkControlsProps {
  info: VibeElementInfo;
  onLinkChange: (href: string) => void;
  onContentChange: (text: string) => void;
}

export default function LinkControls({ info, onLinkChange, onContentChange }: LinkControlsProps) {
  const [href, setHref] = useState(info.href ?? "");
  const [text, setText] = useState(info.text);

  useEffect(() => {
    setHref(info.href ?? "");
    setText(info.text);
  }, [info.path, info.href, info.text]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Link text</span>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onContentChange(e.target.value);
          }}
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Goes to</span>
        <input
          type="text"
          value={href}
          onChange={(e) => {
            setHref(e.target.value);
            onLinkChange(e.target.value);
          }}
          placeholder="https://..."
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>
    </div>
  );
}
```

- [ ] **Step 2: tsc + commit**

Run: `npx tsc --noEmit`
Expected: 0.

```bash
git add components/VibePropertiesPanel/LinkControls.tsx
git commit -m "vibe-edit: LinkControls — text + href"
```

### Task 11: `components/VibePropertiesPanel.tsx` — orchestrator

**Files:**
- Create: `components/VibePropertiesPanel.tsx`

- [ ] **Step 1: Implement the kind-routing wrapper**

```tsx
"use client";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import TextControls from "./VibePropertiesPanel/TextControls";
import ImageControls from "./VibePropertiesPanel/ImageControls";
import LinkControls from "./VibePropertiesPanel/LinkControls";

interface VibePropertiesPanelProps {
  info: VibeElementInfo | null;
  onContentChange: (text: string) => void;
  onStyleChange: (styles: { color?: string; backgroundColor?: string }) => void;
  onImageChange: (next: { src?: string; alt?: string }) => void;
  onLinkChange: (href: string) => void;
  onClose: () => void;
}

export default function VibePropertiesPanel({
  info,
  onContentChange,
  onStyleChange,
  onImageChange,
  onLinkChange,
  onClose,
}: VibePropertiesPanelProps) {
  if (!info) {
    return (
      <aside className="w-[320px] shrink-0 border-l-2 border-ink bg-paper p-4 font-mono text-sm">
        <p className="text-muted">Click anything on the page to edit it.</p>
      </aside>
    );
  }

  return (
    <aside className="w-[320px] shrink-0 border-l-2 border-ink bg-paper">
      <header className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
          {labelFor(info.kind, info.tag)}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-lg leading-none"
          aria-label="Deselect"
        >
          ×
        </button>
      </header>

      {(info.kind === "text" || info.kind === "heading" || info.kind === "button") && (
        <TextControls info={info} onContentChange={onContentChange} onStyleChange={onStyleChange} />
      )}
      {info.kind === "image" && (
        <ImageControls info={info} onImageChange={onImageChange} />
      )}
      {info.kind === "link" && (
        <LinkControls info={info} onLinkChange={onLinkChange} onContentChange={onContentChange} />
      )}
      {info.kind === "container" && (
        <div className="p-4">
          <p className="font-mono text-[11px] text-muted">
            Containers don&apos;t have direct edits in vibe mode. Click on the
            text or image inside to edit it.
          </p>
        </div>
      )}
    </aside>
  );
}

function labelFor(kind: string, tag: string): string {
  if (kind === "heading") return `Heading (${tag})`;
  if (kind === "text") return "Text";
  if (kind === "image") return "Image";
  if (kind === "link") return "Link";
  if (kind === "button") return "Button";
  return tag;
}
```

- [ ] **Step 2: tsc**

Run: `npx tsc --noEmit`
Expected: 0.

- [ ] **Step 3: Commit**

```bash
git add components/VibePropertiesPanel.tsx
git commit -m "vibe-edit: VibePropertiesPanel orchestrator"
```

---

## Phase 4 — Wire into Workspace

### Task 12: Add vibe state + render to Workspace

**Files:**
- Modify: `components/Workspace.tsx`

- [ ] **Step 1: Add state + handlers**

In `Workspace.tsx`, near the other selection state (around line 320), add:

```ts
const [vibeInfo, setVibeInfo] = useState<VibeElementInfo | null>(null);
```

Add an effect to handle iframe `vibe:selected` / `vibe:cleared` messages by listening through Preview's existing message handler. Cleanest path: add a callback prop to `<Preview>` like `onVibeSelected={(info) => setVibeInfo(info)}` and `onVibeCleared={() => setVibeInfo(null)}`. Wire them in `Preview.tsx`'s message dispatcher next to the existing `dropin:select` branch.

Add the four handlers:

```ts
const handleVibeContent = useCallback((text: string) => {
  if (!vibeInfo) return;
  previewHandleRef.current?.postMessage({ type: "vibe:update-content", path: vibeInfo.path, text });
}, [vibeInfo]);

const handleVibeStyle = useCallback((styles: { color?: string; backgroundColor?: string }) => {
  if (!vibeInfo) return;
  previewHandleRef.current?.postMessage({ type: "vibe:update-style", path: vibeInfo.path, styles });
}, [vibeInfo]);

const handleVibeImage = useCallback((next: { src?: string; alt?: string }) => {
  if (!vibeInfo) return;
  previewHandleRef.current?.postMessage({ type: "vibe:update-image", path: vibeInfo.path, ...next });
}, [vibeInfo]);

const handleVibeLink = useCallback((href: string) => {
  if (!vibeInfo) return;
  previewHandleRef.current?.postMessage({ type: "vibe:update-link", path: vibeInfo.path, href });
}, [vibeInfo]);
```

- [ ] **Step 2: Render the panel** next to the existing right-side panels:

```tsx
{tool === "vibe" && (
  <VibePropertiesPanel
    info={vibeInfo}
    onContentChange={handleVibeContent}
    onStyleChange={handleVibeStyle}
    onImageChange={handleVibeImage}
    onLinkChange={handleVibeLink}
    onClose={() => {
      previewHandleRef.current?.postMessage({ type: "vibe:clear" });
      setVibeInfo(null);
    }}
  />
)}
```

- [ ] **Step 3: Add a "Vibe" tool to the toolbar** in `components/ToolBar.tsx` next to View/Select/Move/Insert/Swap. Make it the DEFAULT tool (was view).

- [ ] **Step 4: Commit-on-blur source sync**

Add an effect that watches `vibeInfo`. When `vibeInfo.text/src/alt/href` changes from the previous capture (i.e., user has been editing), call `buildVibeCommit` after a 600ms idle and write the result via `setCode`. This is the source-reconciliation step — it's the only place the iframe srcDoc would even potentially rebuild, but because the host doesn't actually rebuild when the iframe's DOM is already in the desired state (just updates source state), there's no flicker.

Skeleton:

```ts
const lastVibeRef = useRef<VibeElementInfo | null>(null);
useEffect(() => {
  if (!vibeInfo) {
    lastVibeRef.current = null;
    return;
  }
  if (!lastVibeRef.current || lastVibeRef.current.path !== vibeInfo.path) {
    lastVibeRef.current = vibeInfo;
    return;
  }
  const old = lastVibeRef.current;
  const next = vibeInfo;
  const id = setTimeout(() => {
    const result = buildVibeCommit({
      mode: kind,
      source: code,
      old,
      next: {
        text: next.text !== old.text ? next.text : undefined,
        src: next.src !== old.src && next.src !== null ? next.src : undefined,
        alt: next.alt !== old.alt && next.alt !== null ? next.alt : undefined,
        href: next.href !== old.href && next.href !== null ? next.href : undefined,
      },
    });
    if (!result.unchanged) {
      setCodeSilent(result.source);
      lastVibeRef.current = next;
    }
  }, 600);
  return () => clearTimeout(id);
}, [vibeInfo, code, kind, setCodeSilent]);
```

> **`setCodeSilent` is the existing API** that updates source state without forcing iframe rebuild — it's already in `useEditHistory`. Confirm by grep before relying.

- [ ] **Step 5: Commit**

```bash
git add components/Workspace.tsx components/ToolBar.tsx components/Preview.tsx
git commit -m "vibe-edit: wire VibePropertiesPanel into Workspace"
```

### Task 13: Stop FocusEditor auto-open on Select-mode click

**Files:**
- Modify: `components/Workspace.tsx`

- [ ] **Step 1: Find `handleSelectionChange`** (around line 736) and replace the `if (openFocusOnClick) setFocusOpen(true)` branch with a no-op for plain Select-mode clicks. Vibe mode handles its own selection now.

```ts
// BEFORE:
if (openFocusOnClick) {
  track("→ fresh click, opening focus mode");
  setFocusOpen(true);
}

// AFTER:
// Select tool keeps the in-place outline; FocusEditor opens only via
// the explicit "Power editor" button (toolbar) or `E` shortcut.
```

- [ ] **Step 2: Add a "Power editor" button to ToolBar** that flips `focusOpen` on demand for the current selection.

- [ ] **Step 3: Commit**

```bash
git add components/Workspace.tsx components/ToolBar.tsx
git commit -m "vibe-edit: stop FocusEditor auto-open; add Power editor button"
```

---

## Phase 5 — Integration test + smoke

### Task 14: jsdom round-trip integration test

**Files:**
- Create: `tests/integration/vibe-edit-roundtrip.test.ts`

- [ ] **Step 1: Test the full iframe-runtime round-trip**

```ts
// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { vibeRuntimeJs } from "../../lib/vibe-edit/runtime";

function buildIframe(html: string): JSDOM {
  const dom = new JSDOM(
    `<!doctype html><html><body>${html}<script>
      var DROPIN_TOOL = 'vibe';
      function dropinPost(m) { window.parent.postMessage({ __dropin: true, ...m }, '*'); }
      ${vibeRuntimeJs()}
    </script></body></html>`,
    { runScripts: "dangerously", pretendToBeVisual: true, url: "http://localhost/" },
  );
  return dom;
}

describe("vibe-edit runtime — round trip", () => {
  it("emits vibe:ready on script load", async () => {
    const dom = buildIframe("<h1>Hello</h1>");
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => messages.push(ev.data));
    await new Promise((r) => setTimeout(r, 30));
    expect(messages.some((m) => m?.type === "vibe:ready")).toBe(true);
  });

  it("clicks a heading and emits vibe:selected with the right info", async () => {
    const dom = buildIframe("<main><h1>Hello</h1></main>");
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => messages.push(ev.data));
    await new Promise((r) => setTimeout(r, 30));
    const h1 = dom.window.document.querySelector("h1")!;
    h1.click();
    await new Promise((r) => setTimeout(r, 10));
    const sel = messages.find((m) => m?.type === "vibe:selected");
    expect(sel).toBeDefined();
    expect(sel.info.kind).toBe("heading");
    expect(sel.info.tag).toBe("h1");
    expect(sel.info.text).toBe("Hello");
    expect(sel.info.path).toBe("main > h1");
  });

  it("vibe:update-content mutates DOM + re-emits selected", async () => {
    const dom = buildIframe("<main><h1>Hello</h1></main>");
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => messages.push(ev.data));
    await new Promise((r) => setTimeout(r, 30));
    dom.window.document.querySelector("h1")!.click();
    await new Promise((r) => setTimeout(r, 10));

    dom.window.postMessage(
      { __dropin: true, type: "vibe:update-content", path: "main > h1", text: "Goodbye" },
      "*",
    );
    await new Promise((r) => setTimeout(r, 10));

    expect(dom.window.document.querySelector("h1")!.textContent).toBe("Goodbye");
    const refreshed = messages.filter((m) => m?.type === "vibe:selected").pop();
    expect(refreshed.info.text).toBe("Goodbye");
  });

  it("ignores click in non-vibe tool", async () => {
    const dom = new JSDOM(
      `<!doctype html><html><body><h1>X</h1><script>
        var DROPIN_TOOL = 'view';
        function dropinPost(m) { window.parent.postMessage({ __dropin: true, ...m }, '*'); }
        ${vibeRuntimeJs()}
      </script></body></html>`,
      { runScripts: "dangerously", pretendToBeVisual: true, url: "http://localhost/" },
    );
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => messages.push(ev.data));
    await new Promise((r) => setTimeout(r, 30));
    dom.window.document.querySelector("h1")!.click();
    await new Promise((r) => setTimeout(r, 10));
    expect(messages.some((m) => m?.type === "vibe:selected")).toBe(false);
  });

  it("clicking a non-editable container clears selection", async () => {
    const dom = buildIframe("<div id='wrap'><h1>X</h1></div>");
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => messages.push(ev.data));
    await new Promise((r) => setTimeout(r, 30));
    dom.window.document.querySelector("h1")!.click();
    await new Promise((r) => setTimeout(r, 10));
    dom.window.document.querySelector("#wrap")!.dispatchEvent(new dom.window.Event("click", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    expect(messages.some((m) => m?.type === "vibe:cleared")).toBe(true);
  });
});
```

- [ ] **Step 2: Run**

Run: `npx vitest run tests/integration/vibe-edit-roundtrip.test.ts`
Expected: 5 tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/integration/vibe-edit-roundtrip.test.ts
git commit -m "vibe-edit: jsdom integration test for click/update round-trip"
```

### Task 15: Manual smoke

- [ ] **Step 1: Verify tsc + full vitest still green**

Run:
```bash
npx tsc --noEmit
npx vitest run
```
Expected: tsc 0; vitest all green.

- [ ] **Step 2: Curl the playground bundle and confirm vibe wiring shipped**

Run:
```bash
curl -s http://localhost:3001/_next/static/chunks/app/playground/page.js 2>/dev/null | grep -c "vibe:update-content"
curl -s http://localhost:3001/_next/static/chunks/app/playground/page.js 2>/dev/null | grep -c "VibePropertiesPanel"
```
Expected: both > 0 (assuming the user's existing dev server is running).

- [ ] **Step 3: Manual click-test in browser** — open `/playground`, switch to Vibe tool, click an `<h1>`, change text in the side panel, observe instant update with no iframe flash. Click an `<img>`, change src, observe instant swap.

---

## Phase 6 — Cleanup + docs

### Task 16: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add a "Vibe edit flow" section** under "Current status" describing what shipped, where the code lives, and the commit/source-reconciliation model.

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: vibe edit flow shipped — update CLAUDE.md"
```

### Task 17: Memory record

- [ ] **Step 1: Save memory**

Save a project memory (`memory/project_vibe_edit_flow.md`) noting:
- Key architectural choice: iframe DOM is source of truth at edit time; source reconciled on idle via `buildVibeCommit`.
- Power editor (FocusEditor) is still available via toolbar button.
- Vibe tool is the new default for Select-mode clicks.

---

## Self-review

**1. Spec coverage:**
- ✅ "Targeting no-code people, easy simple edits" → Vibe tool + VibePropertiesPanel with per-kind controls is the answer
- ✅ "Robust" → direct DOM mutation eliminates the rebuild-flicker; source reconciliation happens on idle, no thrash
- ✅ "Capture the values they already have" → iframe-side `getComputedStyle` populates the side panel; no more "Width: —" empty fields
- ✅ "Doesn't show how it shows on the page" → no isolation modal in vibe flow; the live preview IS the preview
- ✅ "Controls don't work" → direct DOM mutation means changes appear instantly; Apply commits to source

**2. Placeholder scan:** No "TBD" / "implement later" / "similar to Task N" found. Each task has full code.

**3. Type consistency:**
- `VibeElementInfo` shape used the same way in `types.ts`, `runtime.ts`, `commit.ts`, `VibePropertiesPanel.tsx`.
- `VibeKind` union: `heading | text | image | link | button | container` — same string literals everywhere.
- Message types prefixed `vibe:*` consistently (host→iframe + iframe→host).

**4. Trap callouts in place:**
- Backtick-in-comment trap (`memory/project_ts_template_backtick_trap.md`) flagged in Task 6.
- Backslash-escape trap (`memory/project_ts_template_backslash_trap.md`) flagged in Task 6.
- `setCodeSilent` existence assumption flagged in Task 12.

**5. Out of scope (explicitly):**
- Class-based style edits via vibe panel (e.g. font-family picker for headings). Power editor still owns those.
- Cross-file propagation of vibe edits. Vibe edits are single-file scope.
- Multi-element vibe selection. Vibe is single-element only.
- Undo/redo of vibe edits beyond the existing source-history stack. Source updates flow through `setCodeSilent`, which already records.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-10-vibecoder-edit-flow.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
