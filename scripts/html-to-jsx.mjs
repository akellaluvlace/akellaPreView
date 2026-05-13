#!/usr/bin/env node
// Convert every `web/*.html` into a `web/*.jsx` Dropin template. JSX is the
// preferred format because the in-iframe Babel plugin gives every element a
// precise `data-dropin-loc` attribute, which makes click-to-select 100 %
// reliable. HTML mode falls back to fragile DOM-path indexing.
//
// The converter:
//   - strips the <html>/<head>/<body> wrappers, keeps the useful head bits
//     (<title>, <link>, <style>, <script>) as JSX children so the template
//     self-contains its own assets when rendered in the preview iframe
//   - rewrites HTML attributes to their JSX equivalents (class → className,
//     for → htmlFor, tabindex → tabIndex, etc.)
//   - converts inline `style="…"` strings into `style={{…}}` object literals
//     with camelCased property names
//   - converts inline event handlers like `onclick="alert(1)"` into arrow
//     functions wrapped with try/catch so a single bad handler doesn't crash
//     the whole component
//   - embeds inline <style> and inline (non-src) <script> via
//     `dangerouslySetInnerHTML` so their CSS/JS survives verbatim
//   - self-closes void elements, escapes `{`/`}`/`<`/`>` in text nodes, and
//     preserves HTML comments as `{/* … */}` JSX comments
//
// Existing `.html` files are left in place so the `templates.ts` reader can
// fall back to them for any file whose JSX generation failed.

import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "parse5";

const WEB_DIR = path.resolve(process.cwd(), "web");

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr",
]);

// Non-event HTML attribute → JSX attribute name mapping.
const ATTR_MAP = {
  "class": "className",
  "for": "htmlFor",
  "tabindex": "tabIndex",
  "autofocus": "autoFocus",
  "readonly": "readOnly",
  "maxlength": "maxLength",
  "minlength": "minLength",
  "rowspan": "rowSpan",
  "colspan": "colSpan",
  "contenteditable": "contentEditable",
  "spellcheck": "spellCheck",
  "autocomplete": "autoComplete",
  "autocorrect": "autoCorrect",
  "autocapitalize": "autoCapitalize",
  "accept-charset": "acceptCharset",
  "crossorigin": "crossOrigin",
  "enctype": "encType",
  "formaction": "formAction",
  "formmethod": "formMethod",
  "formenctype": "formEncType",
  "formtarget": "formTarget",
  "formnovalidate": "formNoValidate",
  "fetchpriority": "fetchPriority",
  "referrerpolicy": "referrerPolicy",
  "srcset": "srcSet",
  "usemap": "useMap",
  "novalidate": "noValidate",
  "playsinline": "playsInline",
};

// HTML event handler → JSX (camelCased) mapping. Anything `on*` not listed
// falls back to `on` + CamelCase of the rest.
const EVENT_MAP = {
  "onclick": "onClick",
  "onchange": "onChange",
  "oninput": "onInput",
  "onsubmit": "onSubmit",
  "onload": "onLoad",
  "onerror": "onError",
  "onfocus": "onFocus",
  "onblur": "onBlur",
  "onkeydown": "onKeyDown",
  "onkeyup": "onKeyUp",
  "onkeypress": "onKeyPress",
  "onmouseover": "onMouseOver",
  "onmouseout": "onMouseOut",
  "onmousedown": "onMouseDown",
  "onmouseup": "onMouseUp",
  "onmousemove": "onMouseMove",
  "onmouseenter": "onMouseEnter",
  "onmouseleave": "onMouseLeave",
  "onscroll": "onScroll",
  "oncontextmenu": "onContextMenu",
  "ondblclick": "onDoubleClick",
  "oninvalid": "onInvalid",
  "onreset": "onReset",
  "onwheel": "onWheel",
  "onanimationend": "onAnimationEnd",
  "ontransitionend": "onTransitionEnd",
};

const BOOLEAN_ATTRS = new Set([
  "disabled", "readOnly", "required", "checked", "autoFocus", "hidden",
  "open", "multiple", "selected", "contentEditable", "noValidate",
  "playsInline", "loop", "muted", "autoPlay", "controls", "default",
  "defer", "async", "reversed",
]);

const INTEGER_ATTRS = new Set([
  "tabIndex", "maxLength", "minLength", "rowSpan", "colSpan",
  "cols", "rows", "span", "width", "height", "size", "start",
]);

function mapAttrName(name) {
  if (EVENT_MAP[name]) return EVENT_MAP[name];
  if (ATTR_MAP[name]) return ATTR_MAP[name];
  if (name.startsWith("data-") || name.startsWith("aria-") || name.startsWith("xmlns:") || name.includes(":")) return name;
  if (name.startsWith("on") && /^on[a-z]+$/.test(name)) return "on" + name.charAt(2).toUpperCase() + name.slice(3);
  if (name.includes("-")) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

function escapeTextContent(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

function cssToObject(css) {
  // "background: red; color: #0f0" → "{ background: 'red', color: '#0f0' }"
  const decls = css.split(";").map((s) => s.trim()).filter(Boolean);
  const entries = decls.map((decl) => {
    const idx = decl.indexOf(":");
    if (idx < 0) return null;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    const jsProp = prop.startsWith("--")
      ? JSON.stringify(prop)
      : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `${jsProp}: ${JSON.stringify(val)}`;
  }).filter(Boolean);
  return `{ ${entries.join(", ")} }`;
}

function renderAttr(a) {
  const name = mapAttrName(a.name);
  const value = a.value;

  if (/^on[A-Z]/.test(name)) {
    // Inline DOM handler text → JSX arrow function. `event` is the React
    // SyntheticEvent. try/catch keeps a broken handler from nuking the whole
    // component render.
    const safeBody = value.replace(/\*\//g, "*\\/");
    return `${name}={(event) => { try { ${safeBody} } catch (e) { console.error("[dropin:template] handler threw", e); } }}`;
  }

  if (name === "style") {
    return `style={${cssToObject(value)}}`;
  }

  if (value === "" && BOOLEAN_ATTRS.has(name)) {
    return name;
  }

  if (INTEGER_ATTRS.has(name) && /^-?\d+$/.test(value)) {
    return `${name}={${value}}`;
  }

  return `${name}=${JSON.stringify(value)}`;
}

function renderAttrs(attrs) {
  return attrs.map(renderAttr).join(" ");
}

// Detect `<script id="tailwind-config">tailwind.config = {...}</script>` (or any
// other inline script that assigns `tailwind.config`) and turn its config into
// a compensating CSS block. Returns the CSS string, or null if it isn't that
// kind of script (so the caller falls back to `dangerouslySetInnerHTML`).
function tryCompensateTailwindConfig(attrs, content) {
  // Heuristic: any inline script that assigns `tailwind.config = {...}`, even
  // without the id="tailwind-config" tag — some templates drop the id.
  const match = content.match(/tailwind\.config\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!match) return null;
  let config;
  try {
    // The template authors write plain JS object literals; evaluate them in an
    // isolated function so we can read colors/fontFamily/etc. out.
    // eslint-disable-next-line no-new-func
    config = new Function(`"use strict"; return (${match[1]});`)();
  } catch {
    return null;
  }
  return configToCss(config);
}

// Build a compensating CSS block from a Tailwind config's `theme.extend`.
// Covers the utility prefixes we see most often in the HTML gallery: colors,
// fonts, sizes, spacing, borderRadius, boxShadow, lineHeight, letterSpacing.
function configToCss(config) {
  const extend = config?.theme?.extend || config?.theme || {};
  const rules = [];
  const add = (sel, decls) => rules.push(`${sel} { ${decls} }`);

  // --- colors ---
  const colors = flattenColors(extend.colors || {});
  for (const [name, value] of Object.entries(colors)) {
    const esc = cssName(name);
    add(`.bg-${esc}`, `background-color: ${value};`);
    add(`.text-${esc}`, `color: ${value};`);
    add(`.border-${esc}`, `border-color: ${value};`);
    add(`.ring-${esc}`, `--tw-ring-color: ${value}; box-shadow: 0 0 0 var(--tw-ring-offset-width, 0) var(--tw-ring-offset-color, #fff), 0 0 0 calc(var(--tw-ring-offset-width, 0) + 3px) ${value};`);
    add(`.from-${esc}`, `--tw-gradient-from: ${value}; --tw-gradient-to: transparent; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);`);
    add(`.via-${esc}`, `--tw-gradient-to: transparent; --tw-gradient-stops: var(--tw-gradient-from), ${value}, var(--tw-gradient-to);`);
    add(`.to-${esc}`, `--tw-gradient-to: ${value};`);
    add(`.fill-${esc}`, `fill: ${value};`);
    add(`.stroke-${esc}`, `stroke: ${value};`);
    add(`.placeholder-${esc}::placeholder`, `color: ${value};`);
    add(`.accent-${esc}`, `accent-color: ${value};`);
    add(`.caret-${esc}`, `caret-color: ${value};`);
    add(`.decoration-${esc}`, `text-decoration-color: ${value};`);
    add(`.divide-${esc} > :not([hidden]) ~ :not([hidden])`, `border-color: ${value};`);
    add(`.shadow-${esc}`, `--tw-shadow-color: ${value};`);
    // Opacity modifier support: /50 /75 etc. — the most common values.
    for (const alpha of [5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95]) {
      const rgba = hexWithAlphaToRgba(value, alpha / 100);
      if (rgba) {
        add(`.bg-${esc}\\/${alpha}`, `background-color: ${rgba};`);
        add(`.text-${esc}\\/${alpha}`, `color: ${rgba};`);
        add(`.border-${esc}\\/${alpha}`, `border-color: ${rgba};`);
      }
    }
  }

  // --- fontFamily ---
  const fontFamily = extend.fontFamily || {};
  for (const [name, value] of Object.entries(fontFamily)) {
    const families = Array.isArray(value)
      ? value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")
      : String(value);
    add(`.font-${cssName(name)}`, `font-family: ${families};`);
  }

  // --- fontSize ---
  // Entries: "h1": "2rem" OR "h1": ["2rem", { lineHeight, letterSpacing, fontWeight }]
  const fontSize = extend.fontSize || {};
  for (const [name, spec] of Object.entries(fontSize)) {
    let size;
    let extras = {};
    if (Array.isArray(spec)) {
      size = spec[0];
      extras = spec[1] || {};
    } else {
      size = spec;
    }
    const decls = [`font-size: ${size};`];
    if (extras.lineHeight) decls.push(`line-height: ${extras.lineHeight};`);
    if (extras.letterSpacing) decls.push(`letter-spacing: ${extras.letterSpacing};`);
    if (extras.fontWeight) decls.push(`font-weight: ${extras.fontWeight};`);
    add(`.text-${cssName(name)}`, decls.join(" "));
  }

  // --- spacing (p-, m-, gap-, w-, h-, top-, etc.) ---
  const spacing = extend.spacing || {};
  for (const [name, value] of Object.entries(spacing)) {
    const esc = cssName(name);
    add(`.p-${esc}`, `padding: ${value};`);
    add(`.px-${esc}`, `padding-left: ${value}; padding-right: ${value};`);
    add(`.py-${esc}`, `padding-top: ${value}; padding-bottom: ${value};`);
    add(`.pt-${esc}`, `padding-top: ${value};`);
    add(`.pr-${esc}`, `padding-right: ${value};`);
    add(`.pb-${esc}`, `padding-bottom: ${value};`);
    add(`.pl-${esc}`, `padding-left: ${value};`);
    add(`.m-${esc}`, `margin: ${value};`);
    add(`.mx-${esc}`, `margin-left: ${value}; margin-right: ${value};`);
    add(`.my-${esc}`, `margin-top: ${value}; margin-bottom: ${value};`);
    add(`.mt-${esc}`, `margin-top: ${value};`);
    add(`.mr-${esc}`, `margin-right: ${value};`);
    add(`.mb-${esc}`, `margin-bottom: ${value};`);
    add(`.ml-${esc}`, `margin-left: ${value};`);
    add(`.gap-${esc}`, `gap: ${value};`);
    add(`.gap-x-${esc}`, `column-gap: ${value};`);
    add(`.gap-y-${esc}`, `row-gap: ${value};`);
    add(`.w-${esc}`, `width: ${value};`);
    add(`.h-${esc}`, `height: ${value};`);
    add(`.min-w-${esc}`, `min-width: ${value};`);
    add(`.min-h-${esc}`, `min-height: ${value};`);
    add(`.max-w-${esc}`, `max-width: ${value};`);
    add(`.max-h-${esc}`, `max-height: ${value};`);
    add(`.top-${esc}`, `top: ${value};`);
    add(`.right-${esc}`, `right: ${value};`);
    add(`.bottom-${esc}`, `bottom: ${value};`);
    add(`.left-${esc}`, `left: ${value};`);
    add(`.inset-${esc}`, `inset: ${value};`);
    add(`.space-x-${esc} > :not([hidden]) ~ :not([hidden])`, `margin-left: ${value};`);
    add(`.space-y-${esc} > :not([hidden]) ~ :not([hidden])`, `margin-top: ${value};`);
  }

  // --- borderRadius ---
  const radius = extend.borderRadius || {};
  for (const [name, value] of Object.entries(radius)) {
    add(`.rounded-${cssName(name)}`, `border-radius: ${value};`);
  }

  // --- boxShadow ---
  const shadow = extend.boxShadow || {};
  for (const [name, value] of Object.entries(shadow)) {
    add(`.shadow-${cssName(name)}`, `box-shadow: ${value};`);
  }

  // --- lineHeight / letterSpacing ---
  for (const [name, value] of Object.entries(extend.lineHeight || {})) {
    add(`.leading-${cssName(name)}`, `line-height: ${value};`);
  }
  for (const [name, value] of Object.entries(extend.letterSpacing || {})) {
    add(`.tracking-${cssName(name)}`, `letter-spacing: ${value};`);
  }

  return rules.join("\n");
}

// Tailwind allows nested color objects: { slate: { 100: "#...", 200: "#..." } }
// → flatten to { "slate-100": "#...", "slate-200": "#..." }.
function flattenColors(obj, prefix = "") {
  const out = {};
  for (const [key, val] of Object.entries(obj || {})) {
    const full = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(out, flattenColors(val, full));
    } else if (typeof val === "string") {
      out[full] = val;
    }
  }
  return out;
}

// Turn a class-name token into a safely-escaped CSS selector fragment.
// (Numeric keys / dots would otherwise break; `.` in a Tailwind class name
// must be escaped as `\.`.)
function cssName(name) {
  return String(name).replace(/([.:/])/g, "\\$1");
}

// Best-effort hex → rgba for the /opacity modifier support. Returns null if
// the value isn't a recognised hex form so the caller can skip that rule.
function hexWithAlphaToRgba(hex, alpha) {
  if (typeof hex !== "string") return null;
  let h = hex.trim();
  if (!h.startsWith("#")) return null;
  h = h.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderNode(node) {
  if (node.nodeName === "#text") {
    return escapeTextContent(node.value || "");
  }
  if (node.nodeName === "#comment") {
    const safe = (node.data || "").replace(/\*\//g, "*\\/");
    return `{/* ${safe} */}`;
  }
  if (node.nodeName === "#documentType" || node.nodeName === "#document" || node.nodeName === "#document-fragment") {
    return (node.childNodes || []).map(renderNode).join("");
  }

  const tag = node.tagName;
  if (!tag) return "";
  const attrs = node.attrs || [];
  const attrStr = renderAttrs(attrs);
  const space = attrStr ? " " : "";

  if (VOID.has(tag)) {
    return `<${tag}${space}${attrStr} />`;
  }

  if (tag === "script" || tag === "style") {
    const hasSrc = attrs.some((a) => a.name === "src");
    if (hasSrc) {
      return `<${tag}${space}${attrStr}></${tag}>`;
    }
    const content = (node.childNodes || []).map((c) => c.value || "").join("");
    if (!content.trim()) return `<${tag}${space}${attrStr}></${tag}>`;

    // Special case: <script id="tailwind-config">tailwind.config = {...}</script>
    // React won't execute inline <script> content we inject via dangerouslySetInnerHTML,
    // so the template's custom theme would silently do nothing. Instead, parse the
    // config object and emit a compensating <style> block that defines the same
    // utility classes as regular CSS — then the template's existing class names
    // (bg-primary, text-on-surface-variant, font-serif, …) keep working.
    if (tag === "script") {
      const compensated = tryCompensateTailwindConfig(attrs, content);
      if (compensated) {
        return `<style dangerouslySetInnerHTML={{ __html: ${JSON.stringify(compensated)} }} />`;
      }
    }

    return `<${tag}${space}${attrStr} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(content)} }} />`;
  }

  if (tag === "textarea") {
    const content = (node.childNodes || []).map((c) => c.value || "").join("");
    if (content) {
      const extra = `${attrStr ? " " : ""}defaultValue={${JSON.stringify(content)}}`;
      return `<textarea${space}${attrStr}${extra}></textarea>`;
    }
  }

  const children = (node.childNodes || []).map(renderNode).join("");
  return `<${tag}${space}${attrStr}>${children}</${tag}>`;
}

function makeComponentName(slug) {
  const words = slug
    .replace(/^\d+-/, "") // strip leading NN-
    .split(/[-_]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  const candidate = words.join("");
  if (!candidate) return "Template";
  if (/^\d/.test(candidate)) return `T${candidate}`;
  return candidate;
}

async function convertOne(htmlPath) {
  const html = await fs.readFile(htmlPath, "utf-8");
  const doc = parse(html);

  const htmlEl = (doc.childNodes || []).find((n) => n.tagName === "html");
  const slug = path.basename(htmlPath, path.extname(htmlPath));
  const componentName = makeComponentName(slug);

  let headJsx = "";
  let bodyJsx = "";

  if (htmlEl) {
    const head = (htmlEl.childNodes || []).find((n) => n.tagName === "head");
    const body = (htmlEl.childNodes || []).find((n) => n.tagName === "body");
    const keepable = new Set(["style", "script", "link", "title"]);
    const headChildren = (head?.childNodes || []).filter(
      (n) => n.tagName && keepable.has(n.tagName),
    );
    headJsx = headChildren.map(renderNode).join("\n      ");
    bodyJsx = (body?.childNodes || []).map(renderNode).join("");
  } else {
    // No <html> wrapper — treat as a fragment.
    bodyJsx = (doc.childNodes || []).map(renderNode).join("");
  }

  const headBlock = headJsx.trim()
    ? `{/* head: preserved styles/scripts/links/titles */}\n      ${headJsx}\n      `
    : "";

  return `function ${componentName}() {
  return (
    <>
      ${headBlock}${bodyJsx}
    </>
  );
}

export default ${componentName};
`;
}

async function main() {
  const entries = await fs.readdir(WEB_DIR);
  const htmls = entries.filter((n) => n.toLowerCase().endsWith(".html"));
  console.log(`Converting ${htmls.length} HTML files in ${WEB_DIR} → JSX…`);

  let ok = 0;
  const failed = [];
  for (const file of htmls) {
    const htmlPath = path.join(WEB_DIR, file);
    const jsxPath = path.join(WEB_DIR, file.replace(/\.html$/i, ".jsx"));
    try {
      const jsx = await convertOne(htmlPath);
      await fs.writeFile(jsxPath, jsx, "utf-8");
      ok++;
    } catch (e) {
      failed.push({ file, error: e.message });
    }
  }

  console.log(`✓ ${ok} converted`);
  if (failed.length) {
    console.log(`✗ ${failed.length} failed:`);
    for (const f of failed) console.log(`  - ${f.file}: ${f.error}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
