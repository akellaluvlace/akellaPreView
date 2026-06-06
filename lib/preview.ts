import { buildFontPreloadUrl } from "./fonts";
import { vibeRuntimeJs } from "./vibe-edit/runtime";

export type PreviewKind = "jsx" | "html";

const REACT_URL = "https://unpkg.com/react@18.3.1/umd/react.production.min.js";
const REACT_DOM_URL =
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js";
const BABEL_URL = "https://unpkg.com/@babel/standalone@7.24.7/babel.min.js";
const TAILWIND_CDN = "https://cdn.tailwindcss.com";
const FONTS_PRELOAD_URL = buildFontPreloadUrl();

// Curated allowlist of npm packages exposed inside the preview iframe.
// User imports of these names get rewritten to `var X = window.__pkgs[name]`
// before Babel transforms the JSX. Imports of any other package raise a
// clear "unsupported" error rather than silently leaving the binding
// undefined (the previous behaviour, which produced cryptic runtime
// `undefined is not a function` crashes downstream).
//
// This is the "Approach A" curated UMD path from `maniuplation.md` gap #5.
// The "Approach B" esm.sh fallback for arbitrary npm packages is deferred.
//
// To add a package:
//   1. Verify it ships a UMD build (check `unpkg.com/<pkg>/dist/...`).
//   2. Add an entry below with the unpkg URL and a `setup` snippet that
//      reads the global the UMD exposes and assigns it to `window.__pkgs`.
//      Use `if (typeof X !== 'undefined')` so a missing UMD doesn't blow up
//      the whole preview — the user just gets the same "unsupported" error
//      they'd get without the entry.
//   3. Update CLAUDE.md → "Locked stack" so users know what's available.
//
// Packages without a usable UMD build (lucide-react ESM-only since 0.300+,
// framer-motion ESM-only, all of @radix-ui/*, @heroicons/react, sonner,
// react-hot-toast, date-fns) are NOT in v1. They need the esm.sh `<script
// type="module">` async loading path (Approach B) which adds 100-500ms to
// first paint and is deferred per the spec. Document the user-facing list
// at the bottom of the playground UI so people know what works.
type SupportedPkg = {
  name: string;
  // null = pre-loaded UMD (React/ReactDOM) or derived from another global.
  // Otherwise this URL gets emitted as a `<script src=...>` in the iframe head.
  umd: string | null;
  // JS expression that runs after all UMDs are loaded. Must read the global
  // the UMD exposes and assign to `window.__pkgs[name]`. Wrap external lookups
  // in `typeof X !== 'undefined'` so a missing/failed UMD load gracefully
  // skips the package rather than throwing inside the setup script.
  setup: string;
};

const SUPPORTED_PKGS: SupportedPkg[] = [
  // --- pre-loaded UMDs (already in head as react/react-dom scripts) ---
  {
    name: "react",
    umd: null,
    setup: "window.__pkgs['react'] = React;",
  },
  {
    name: "react-dom",
    umd: null,
    setup: "window.__pkgs['react-dom'] = ReactDOM;",
  },
  {
    name: "react-dom/client",
    umd: null,
    setup:
      "window.__pkgs['react-dom/client'] = { createRoot: ReactDOM.createRoot, hydrateRoot: ReactDOM.hydrateRoot };",
  },
  // --- external UMDs (added in head, sync) ---
  {
    name: "clsx",
    umd: "https://unpkg.com/clsx@2.1.1/dist/clsx.min.js",
    setup:
      "if (typeof clsx !== 'undefined') window.__pkgs['clsx'] = { default: clsx, clsx: clsx };",
  },
  {
    name: "recharts",
    umd: "https://unpkg.com/recharts@2.13.3/umd/Recharts.min.js",
    setup: "if (typeof Recharts !== 'undefined') window.__pkgs['recharts'] = Recharts;",
  },
  {
    name: "chart.js",
    umd: "https://unpkg.com/chart.js@4.4.6/dist/chart.umd.js",
    setup:
      "if (typeof Chart !== 'undefined') window.__pkgs['chart.js'] = { Chart: Chart, default: Chart };",
  },
  {
    // The `lucide-react` UMD exposes itself as the `lucide` global (NOT
    // `LucideReact`). Each icon is a property on that object. Tested against
    // unpkg.com/lucide-react@0.468.0/dist/umd/lucide-react.js — if the URL
    // 404s in the future (lucide ships ESM-only at some point), the typeof
    // guard will skip the entry and the user gets a clear "unsupported"
    // error rather than a broken preview.
    name: "lucide-react",
    umd: "https://unpkg.com/lucide-react@0.468.0/dist/umd/lucide-react.js",
    setup:
      "if (typeof lucide !== 'undefined') window.__pkgs['lucide-react'] = lucide; else if (typeof lucideReact !== 'undefined') window.__pkgs['lucide-react'] = lucideReact;",
  },
];

const SUPPORTED_PKG_NAMES_JSON = JSON.stringify(SUPPORTED_PKGS.map((p) => p.name));

// Lazy package loading. Eagerly emitting every UMD <script> in the
// iframe head paid the cost (network round-trip + JS parse + UMD's
// own initialisation) for every preview rebuild even when the template
// imported none of them. Worse, broken UMDs (lucide-react@0.468.0's
// dist/umd/ path no longer ships a working browser bundle, recharts'
// unpkg copy intermittently misses CORS headers) fired runtime errors
// inside the iframe even though nothing referenced them. We now scan
// the source for import / require references to each curated name and
// only inject the UMDs we need. React / ReactDOM stay pre-loaded
// unconditionally — they're the runtime, not optional deps.
function packagesReferencedInSource(code: string): ReadonlySet<string> {
  const found = new Set<string>();
  for (const pkg of SUPPORTED_PKGS) {
    if (pkg.umd === null) continue;
    const escaped = pkg.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`['"\`]${escaped}['"\`]`);
    if (re.test(code)) found.add(pkg.name);
  }
  return found;
}

function buildPackageScriptTags(referenced: ReadonlySet<string>): string {
  return SUPPORTED_PKGS.filter(
    (p) => p.umd !== null && referenced.has(p.name),
  )
    .map((p) => `<script src="${p.umd}"></script>`)
    .join("\n");
}

function buildPackageSetupScript(referenced: ReadonlySet<string>): string {
  // pre-loaded entries (umd === null) always run their setup so React /
  // ReactDOM / react-dom/client bindings exist for templates that import
  // them. External UMDs only run setup when their <script> tag was
  // actually injected; otherwise the typeof guard would silently skip
  // them anyway, but emitting the setup line for an absent UMD is dead
  // weight and clutters dev-tools network listings.
  const lines = SUPPORTED_PKGS.filter(
    (p) => p.umd === null || referenced.has(p.name),
  )
    .map((p) => p.setup)
    .join("\n");
  return `<script>
window.__pkgs = window.__pkgs || {};
${lines}
</script>`;
}

// Content-Security-Policy meta — `frame-ancestors 'self'` prevents the
// preview iframe from being framed by external sites (clickjacking + XSS-
// in-playground exfiltration mitigation). XSS *inside* the playground is
// accepted risk: vibecoders paste arbitrary code, the iframe runs it, that
// is the entire product. The CSP isolates the preview from third parties,
// not from the user's own pasted code. See `maniuplation.md` gap #4.
const CSP_META = `<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self'" />`;

const INSPECTOR_CSS = `
  html, body { margin: 0; }
  body { background: #ffffff; }
  /* React mounts the user's content inside #root. Make #root itself
     transparent + full-height so:
       1. The body bg propagates to the visible viewport (without this,
          a body { background: ... } rule from a palette swap or gradient
          insert would be hidden behind #root's default white bg).
       2. The body gradient's background-attachment: fixed has a viewport
          to attach to.
     See lib/asset-library/insert-palette.ts and insert-decorative.ts
     for the rules this enables. */
  #root { background: transparent; min-height: 100vh; }
  #__err {
    position: fixed; left: 0; right: 0; bottom: 0;
    background: #0F0F0F; color: #FF4D2E;
    font-family: 'JetBrains Mono', Menlo, monospace;
    font-size: 12px; line-height: 1.55;
    padding: 14px 18px; white-space: pre-wrap;
    border-top: 3px solid #FF4D2E; max-height: 40vh; overflow: auto;
    display: none; z-index: 99999;
  }
  #__err.visible { display: block; }
  [data-dropin-hover] { outline: 2px dashed rgba(255,77,46,0.55) !important; outline-offset: 1px !important; cursor: pointer !important; }
  /* Phase 5 / Phase C — insert tool hover. Green dashed outline + tint
     so the user sees which container will receive the asset. Same outline
     width as data-dropin-hover so visual hierarchy is consistent. */
  [data-dropin-insert-hover] { outline: 2px dashed rgba(34,197,94,0.78) !important; outline-offset: 1px !important; background-color: rgba(34,197,94,0.06) !important; cursor: copy !important; }
  /* Phase 2 (4a): the host SelectionOverlay (components/SelectionOverlay.tsx)
     now draws the visible selection outline + 8 size handles for OID-having
     elements. To avoid double-stacking (~4-6 px of coral noise around every
     selection), this in-iframe rule fires ONLY for elements without a
     data-dropin-id — i.e. HTML mode (no OIDs ever) and the brief pre-OID
     window for JSX pasted mid-session before lib/ast/oids.ts re-injects.
     Both cases the host overlay can't subscribe to (its bbox feed is OID-
     keyed), so leaving the in-iframe outline as a fallback keeps a visible
     selection indicator everywhere. */
  [data-dropin-selected]:not([data-dropin-id]) { outline: 2px solid #FF4D2E !important; outline-offset: 1px !important; }
  [data-dropin-editing] {
    outline: 2px solid #FF4D2E !important; outline-offset: 2px !important;
    background-color: rgba(255,77,46,0.06) !important;
    caret-color: #FF4D2E;
  }
`;

// U+2028 / U+2029 are valid inside JSON string literals but illegal as raw
// chars in JS source. Escape them before embedding the user code as a JS
// string literal. `<` is also escaped so `</script>` in user code can't break
// out of the host script block.
const LINE_SEP_RE = new RegExp(String.fromCharCode(0x2028), "g");
const PARA_SEP_RE = new RegExp(String.fromCharCode(0x2029), "g");

function escapeUserCode(code: string): string {
  return JSON.stringify(code)
    .replace(/</g, "\\u003c")
    .replace(LINE_SEP_RE, "\\u2028")
    .replace(PARA_SEP_RE, "\\u2029");
}

function inspectorRuntimeJs(mode: PreviewKind, restoreScrollY: number): string {
  return `
var DROPIN_MODE = ${JSON.stringify(mode)};
var DROPIN_RESTORE_SCROLL = ${Number(restoreScrollY) || 0};

// Debug-log gate (2026-05-26). All [dropin:iframe*] tracers route through
// dropinDbg, which is OFF unless the user opts in via localStorage
// 'dropin:debug' === '1'. Keeps the iframe console clean in normal use;
// the full diagnostic trail returns on demand (set it in DevTools + reload).
// Same-origin srcdoc, so this reads the parent app's localStorage.
var DROPIN_DEBUG = false;
try { DROPIN_DEBUG = window.localStorage.getItem('dropin:debug') === '1'; } catch (e) {}
function dropinDbg() { if (DROPIN_DEBUG) { try { console.log.apply(console, arguments); } catch (e) {} } }

function dropinPost(msg) {
  try {
    var payload = Object.assign({ __dropin: true }, msg);
    parent.postMessage(payload, '*');
  } catch (e) {}
}

// Restore the previous scroll position so editing a class doesn't throw the
// user back to the top on every re-render. We retry at several async phases
// because layout isn't guaranteed to be ready immediately (React renders after
// DOMContentLoaded, Tailwind CDN may also paint late).
function dropinRestoreScroll() {
  if (!DROPIN_RESTORE_SCROLL) return;
  try { window.scrollTo(0, DROPIN_RESTORE_SCROLL); } catch (e) {}
}
dropinRestoreScroll();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', dropinRestoreScroll);
}
try { requestAnimationFrame(dropinRestoreScroll); } catch (e) {}
setTimeout(dropinRestoreScroll, 40);
setTimeout(dropinRestoreScroll, 120);
setTimeout(dropinRestoreScroll, 300);

// Report scroll position back so we can re-embed it on the next rebuild.
var __dropinScrollPending = false;
window.addEventListener('scroll', function () {
  if (__dropinScrollPending) return;
  __dropinScrollPending = true;
  setTimeout(function () {
    __dropinScrollPending = false;
    dropinPost({ type: 'dropin:scroll', y: window.scrollY || 0 });
  }, 80);
}, { passive: true });

function dropinClassesOf(el) {
  var cls = el.getAttribute ? (el.getAttribute('class') || '') : '';
  var s = cls.trim();
  return s.length ? s.split(/\\s+/) : [];
}

function dropinAttrsOf(el) {
  var out = [];
  if (!el.attributes) return out;
  for (var i = 0; i < el.attributes.length; i++) {
    var a = el.attributes[i];
    var n = a.name;
    if (n === 'data-dropin-loc' || n === 'data-dropin-hover' ||
        n === 'data-dropin-selected' || n === 'data-dropin-editing' ||
        n === 'data-dropin-insert-hover' ||
        n === 'contenteditable' || n === 'class') continue;
    out.push({ key: n, value: a.value });
  }
  return out;
}

function dropinHasOnlyTextChildren(el) {
  if (!el.childNodes || el.childNodes.length === 0) return false;
  for (var i = 0; i < el.childNodes.length; i++) {
    if (el.childNodes[i].nodeType !== 3) return false;
  }
  return true;
}

var DROPIN_VOID_TAGS = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
function dropinIsVoid(tag) { return DROPIN_VOID_TAGS.indexOf(tag.toLowerCase()) !== -1; }

function dropinElementPath(el) {
  var path = [];
  var cur = el;
  while (cur && cur !== document.documentElement) {
    var p = cur.parentElement;
    if (!p) break;
    var idx = Array.prototype.indexOf.call(p.children, cur);
    if (idx < 0) break;
    path.unshift(idx);
    cur = p;
  }
  return path;
}

function dropinReadOid(el) {
  if (!el || !el.getAttribute) return null;
  var v = el.getAttribute('data-dropin-id');
  return v && /^[A-Za-z0-9]{8,}$/.test(v) ? v : null;
}

function dropinElementLoc(el) {
  if (DROPIN_MODE === 'jsx') {
    var raw = el.getAttribute && el.getAttribute('data-dropin-loc');
    if (!raw) return null;
    var parts = raw.split(':').map(Number);
    if (parts.length !== 6) return null;
    for (var i = 0; i < 6; i++) if (!isFinite(parts[i])) return null;
    return {
      kind: 'jsx',
      startLine: parts[0], startCol: parts[1],
      endLine: parts[2], endCol: parts[3],
      openEndLine: parts[4], openEndCol: parts[5]
    };
  }
  return { kind: 'html', path: dropinElementPath(el) };
}

// CSS escape for attribute selector — guards against OIDs that contain
// CSS-special chars even though the minted alphabet is alnum-only. Cheap
// belt-and-braces; future widening of the alphabet (or a paste-time clash
// regen) wouldn't break the lookup.
function dropinCssEscape(s) {
  if (typeof CSS !== 'undefined' && CSS && typeof CSS.escape === 'function') {
    return CSS.escape(s);
  }
  return String(s).replace(/[^A-Za-z0-9_-]/g, '\\\\$&');
}

function dropinFindByOid(oid) {
  if (!oid) return null;
  try {
    return document.querySelector('[data-dropin-id="' + dropinCssEscape(oid) + '"]');
  } catch (e) {
    return null;
  }
}

function dropinFindByLoc(loc) {
  if (!loc) return null;
  if (loc.kind === 'jsx' && DROPIN_MODE === 'jsx') {
    // Match only on (startLine, startCol) so that text edits which shift the
    // element's end position still reselect successfully.
    var all = document.querySelectorAll('[data-dropin-loc]');
    var prefix = loc.startLine + ':' + loc.startCol + ':';
    for (var i = 0; i < all.length; i++) {
      var v = all[i].getAttribute('data-dropin-loc');
      if (v && v.indexOf(prefix) === 0) return all[i];
    }
    return null;
  }
  if (loc.kind === 'html' && DROPIN_MODE === 'html') {
    var cur = document.documentElement;
    for (var j = 0; j < loc.path.length; j++) {
      if (!cur || !cur.children || !cur.children[loc.path[j]]) return null;
      cur = cur.children[loc.path[j]];
    }
    return cur;
  }
  return null;
}

function dropinIsAddressable(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el === document.documentElement || el === document.head) return false;
  if (DROPIN_MODE === 'jsx') {
    return !!(el.getAttribute && el.getAttribute('data-dropin-loc'));
  }
  return true;
}

function dropinResolveTarget(t) {
  while (t && t !== document.documentElement) {
    if (dropinIsAddressable(t)) return t;
    t = t.parentElement || (t.parentNode && t.parentNode.nodeType === 1 ? t.parentNode : null);
  }
  return null;
}

// Walk up one addressable ancestor. Used by Alt-click to reach the
// containing section/div when a child element (e.g. a background overlay,
// an icon, or a text node) caught the click first.
function dropinNextAddressableAncestor(el) {
  var cur = el && el.parentElement;
  while (cur) {
    if (dropinIsAddressable(cur)) return cur;
    cur = cur.parentElement;
  }
  return null;
}

// Hit testing with selectable groups (Phase 1 spec line 313). Two opt-in
// channels:
//   1. Template-author opt-in via \`data-dropin-group\` attribute on any
//      element (raw HTML or JSX). Closer ancestor wins.
//   2. Host-driven OID set, populated by the host walking the parsed AST for
//      capitalized JSX tag names (React component boundaries) and posting
//      \`dropin:set-group-roots\`. Reset on every iframe rebuild — host re-
//      pushes after \`dropin:ready\`. Templates pre-OID-injection have no
//      OIDs so the auto-detect is a no-op for them.
//
// First plain click anywhere inside a group selects the root; subsequent
// clicks inside (with the root or any descendant already selected) drill in.
// Alt-click bypasses entirely — power users keep ancestor walking as the
// explicit escape hatch.
var dropinGroupRootOids = Object.create(null);

// Phase 5 / Phase B — active tool. Host pushes the canonical value via
// dropin:set-tool whenever it changes AND on every dropin:ready so a
// fresh iframe instance starts with the right value. Default 'view'
// matches the workspace default. Click handler bails when 'view';
// hover painter only fires in 'select' / 'move'. Insert / Swap will
// gate their own hover behaviours in Phase C.
var DROPIN_TOOL = 'view';

function dropinFindGroupRoot(el) {
  var cur = el;
  while (cur && cur.nodeType === 1 && cur !== document.body && cur !== document.documentElement) {
    if (cur.getAttribute) {
      if (cur.getAttribute('data-dropin-group') !== null) return cur;
      var oid = cur.getAttribute('data-dropin-id');
      if (oid && dropinGroupRootOids[oid]) return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}

function dropinResolveGroupSelection(target) {
  var groupRoot = dropinFindGroupRoot(target);
  if (!groupRoot) return target;
  if (groupRoot === target) return target;
  if (dropinSelected && (dropinSelected === groupRoot || groupRoot.contains(dropinSelected))) {
    // User has already entered the group → drill in to actual click target.
    return target;
  }
  // Fresh entry into a new group → select the root.
  return groupRoot;
}

// Build a compact description of an element for logs.
function dropinDesc(el) {
  if (!el || el.nodeType !== 1) return String(el);
  var tag = el.tagName ? el.tagName.toLowerCase() : '?';
  var id = el.id ? '#' + el.id : '';
  var cls = (el.getAttribute && el.getAttribute('class')) || '';
  var firstClass = cls ? '.' + cls.split(/\s+/).slice(0, 2).join('.') : '';
  return tag + id + firstClass;
}

// Collect the full ancestor chain from el up to body, for debugging
// "why did this element get selected" questions. Returns a list of short
// descriptors, innermost first.
function dropinAncestorChain(el) {
  var chain = [];
  var cur = el;
  var depth = 0;
  while (cur && cur !== document.body && cur !== document.documentElement && depth < 30) {
    chain.push(dropinDesc(cur) + (dropinIsAddressable(cur) ? '' : ' (skip)'));
    cur = cur.parentElement;
    depth++;
  }
  if (cur === document.body) chain.push('body');
  return chain;
}

function dropinSerialize(el) {
  var loc = dropinElementLoc(el);
  if (!loc) return null;
  var tag = el.tagName ? el.tagName.toLowerCase() : 'div';
  var classes = dropinClassesOf(el);
  var oid = dropinReadOid(el);
  var breadcrumb = [];
  var cur = el;
  var depth = 0;
  while (cur && cur.nodeType === 1 && cur !== document.documentElement && depth < 40) {
    var cloc = dropinElementLoc(cur);
    if (cloc) {
      breadcrumb.unshift({
        tag: cur.tagName.toLowerCase(),
        loc: cloc,
        classes: dropinClassesOf(cur),
        oid: dropinReadOid(cur)
      });
    }
    cur = cur.parentElement;
    depth++;
  }
  return {
    loc: loc,
    oid: oid,
    tag: tag,
    classes: classes,
    attrs: dropinAttrsOf(el),
    text: dropinHasOnlyTextChildren(el) ? (el.textContent || '') : null,
    hasOnlyTextChildren: dropinHasOnlyTextChildren(el),
    isVoid: dropinIsVoid(tag),
    breadcrumb: breadcrumb
  };
}

// ROADMAP §3.3 — element-tree snapshot. Walks the DOM under <body> and
// builds a parent→child hierarchy of every addressable element. Non-
// addressable wrappers (raw HTML in JSX mode, document fragments, etc.)
// are transparent — their addressable descendants land under the nearest
// addressable ancestor up the call stack. Cap at DROPIN_MAX_TREE_NODES
// to keep payload bounded on huge product grids; when reached, traversal
// short-circuits and the host renders the partial tree.
var DROPIN_MAX_TREE_NODES = 500;
function dropinSerializeTree() {
  var roots = [];
  var stack = [];
  var visited = 0;
  function visit(el) {
    if (!el || el.nodeType !== 1) return;
    if (visited >= DROPIN_MAX_TREE_NODES) return;
    var addressable = dropinIsAddressable(el);
    var pushed = false;
    if (addressable) {
      var loc = dropinElementLoc(el);
      if (loc) {
        var node = {
          tag: el.tagName ? el.tagName.toLowerCase() : 'div',
          loc: loc,
          oid: dropinReadOid(el),
          classes: dropinClassesOf(el).slice(0, 3),
          children: []
        };
        var parent = stack.length > 0 ? stack[stack.length - 1] : null;
        if (parent) parent.children.push(node);
        else roots.push(node);
        stack.push(node);
        pushed = true;
        visited++;
      }
    }
    var kids = el.children;
    if (kids) {
      for (var i = 0; i < kids.length; i++) {
        if (visited >= DROPIN_MAX_TREE_NODES) break;
        visit(kids[i]);
      }
    }
    if (pushed) stack.pop();
  }
  try {
    visit(document.body || document.documentElement);
  } catch (e) {
    // Non-fatal — return whatever we have.
  }
  return roots;
}

function dropinPostTree() {
  try {
    var tree = dropinSerializeTree();
    dropinPost({ type: 'dropin:tree', tree: tree });
  } catch (e) {
    // Tree is advisory; never block ready/select/etc on a tree failure.
  }
}

// --- Layer 2: Layout Inspector (iframe side) ----------------------------
// Spec contract: lib/layout-context.ts → LayoutContext. Runs only in JSX
// mode (HTML mode has no OIDs and Layer 2 keys by OID). Returns null if no
// element with that OID is currently rendered (conditionally hidden, in a
// not-yet-mounted React subtree, etc.).
//
// Coordinate system: bounds are iframe-viewport coords (getBoundingClientRect
// semantics). Host adds iframe.getBoundingClientRect() offsets to project to
// host viewport coords.
//
// Costs: 1 querySelector + 1-2 getBoundingClientRect + 2 getComputedStyle +
// up to MAX_SIBLINGS_REPORTED bounding rects. ~0.2-0.5 ms typical, <2 ms on
// pages with many siblings. Caller is expected to call ad-hoc, not in a
// rAF loop — for live-bbox tracking, use a separate subscription protocol
// (deferred to Phase 2 when drag handles need it).
var DROPIN_MAX_SIBLINGS = 50;
// Phase 2 (Step 6 cross-section snap). Iframe enumerates all OID-bearing
// elements on the page minus the selected element + its ancestor chain
// + its descendants + its direct siblings (already in \`siblings\`). Cap
// at 100 so a 200-row product grid doesn't blow the candidate space; if
// real templates ever need more we can index by viewport quadrant.
var DROPIN_MAX_CROSS_SECTION = 100;

function dropinPx(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }

function dropinReadGridSpan(value) {
  // grid-column / grid-row computed values look like:
  //   "auto"
  //   "1 / 3"           → span 2
  //   "span 2 / auto"   → span 2
  //   "1 / span 2"      → span 2
  //   "1 / 4"           → span 3
  if (!value || value === 'auto') return 1;
  var parts = String(value).split('/').map(function (s) { return s.trim(); });
  if (parts.length === 1) {
    var spanMatch = parts[0].match(/^span\\s+(\\d+)/i);
    return spanMatch ? parseInt(spanMatch[1], 10) : 1;
  }
  // Two-part. If either side is "span N", take that as the span.
  for (var i = 0; i < 2; i++) {
    var sm = parts[i].match(/^span\\s+(\\d+)/i);
    if (sm) return parseInt(sm[1], 10);
  }
  // Numeric line / numeric line — span is the absolute difference.
  var a = parseInt(parts[0], 10);
  var b = parseInt(parts[1], 10);
  if (isFinite(a) && isFinite(b)) return Math.max(1, Math.abs(b - a));
  return 1;
}

function dropinComputeLayoutRole(cs, parentCs) {
  if (!cs) return 'block';
  if (cs.position === 'absolute') return 'absolute';
  if (cs.position === 'fixed') return 'fixed';
  if (parentCs) {
    if (/(^|\\b)flex(\\b|$)/.test(parentCs.display)) return 'flex-item';
    if (/(^|\\b)grid(\\b|$)/.test(parentCs.display)) return 'grid-cell';
  }
  if (cs.display === 'inline-block') return 'inline-block';
  if (/^inline/.test(cs.display)) return 'inline';
  return 'block';
}

function dropinComputeParentRole(parentCs) {
  if (!parentCs) return 'block';
  if (/(^|\\b)flex(\\b|$)/.test(parentCs.display)) return 'flex-container';
  if (/(^|\\b)grid(\\b|$)/.test(parentCs.display)) return 'grid-container';
  if (/^inline/.test(parentCs.display)) return 'inline-container';
  return 'block';
}

function dropinRectToBounds(r) {
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}

function dropinComputeLayoutContext(oid) {
  if (DROPIN_MODE !== 'jsx') return null;
  var el = dropinFindByOid(oid);
  if (!el) return null;

  var rect = el.getBoundingClientRect();
  var cs = getComputedStyle(el);
  var parentEl = el.parentElement;
  var parentCs = parentEl ? getComputedStyle(parentEl) : null;

  var bounds = dropinRectToBounds(rect);
  var padding = {
    top: dropinPx(cs.paddingTop), right: dropinPx(cs.paddingRight),
    bottom: dropinPx(cs.paddingBottom), left: dropinPx(cs.paddingLeft)
  };
  var margin = {
    top: dropinPx(cs.marginTop), right: dropinPx(cs.marginRight),
    bottom: dropinPx(cs.marginBottom), left: dropinPx(cs.marginLeft)
  };
  var layoutRole = dropinComputeLayoutRole(cs, parentCs);

  var parent = null;
  if (parentEl && parentEl !== document.documentElement && parentCs) {
    var parentRole = dropinComputeParentRole(parentCs);
    var direction = null;
    if (parentRole === 'flex-container') {
      direction = /column/.test(parentCs.flexDirection) ? 'column' : 'row';
    } else if (parentRole === 'grid-container') {
      // Grid's main axis is column-by-default; flip when grid-auto-flow names column.
      direction = /column/.test(parentCs.gridAutoFlow) ? 'column' : 'row';
    }
    var wrap = parentRole === 'flex-container' && parentCs.flexWrap !== 'nowrap';
    // CSS gap: row-gap | column-gap. column-gap and row-gap are first-class
    // properties; the shorthand "gap" is reflected back into them.
    var gapColumn = dropinPx(parentCs.columnGap);
    var gapRow = dropinPx(parentCs.rowGap);
    var pRect = parentEl.getBoundingClientRect();
    var pBounds = dropinRectToBounds(pRect);
    var pPad = {
      top: dropinPx(parentCs.paddingTop), right: dropinPx(parentCs.paddingRight),
      bottom: dropinPx(parentCs.paddingBottom), left: dropinPx(parentCs.paddingLeft)
    };
    var pBor = {
      top: dropinPx(parentCs.borderTopWidth), right: dropinPx(parentCs.borderRightWidth),
      bottom: dropinPx(parentCs.borderBottomWidth), left: dropinPx(parentCs.borderLeftWidth)
    };
    var contentBounds = {
      x: pBounds.x + pBor.left + pPad.left,
      y: pBounds.y + pBor.top + pPad.top,
      width: Math.max(0, pBounds.width - pBor.left - pBor.right - pPad.left - pPad.right),
      height: Math.max(0, pBounds.height - pBor.top - pBor.bottom - pPad.top - pPad.bottom)
    };
    parent = {
      oid: dropinReadOid(parentEl),
      layoutRole: parentRole,
      direction: direction,
      wrap: wrap,
      gap: { row: gapRow, column: gapColumn },
      justify: parentCs.justifyContent || '',
      align: parentCs.alignItems || '',
      bounds: pBounds,
      contentBounds: contentBounds
    };
  }

  // Constraints
  var flexGrow = dropinPx(cs.flexGrow);
  var flexShrink = dropinPx(cs.flexShrink);
  var aspectRatio = null;
  if (cs.aspectRatio && cs.aspectRatio !== 'auto') {
    var ar = String(cs.aspectRatio).split('/');
    if (ar.length === 2) {
      var an = parseFloat(ar[0]); var ad = parseFloat(ar[1]);
      if (isFinite(an) && isFinite(ad) && ad !== 0) aspectRatio = an / ad;
    } else if (ar.length === 1) {
      var n1 = parseFloat(ar[0]);
      if (isFinite(n1) && n1 > 0) aspectRatio = n1;
    }
  }
  var gColSpan = dropinReadGridSpan(cs.gridColumn);
  var gRowSpan = dropinReadGridSpan(cs.gridRow);
  var tagU = el.tagName ? el.tagName.toUpperCase() : '';
  var constraints = {
    isFlexGrowing: flexGrow > 0 && parent !== null && parent.layoutRole === 'flex-container',
    flexGrow: flexGrow,
    flexShrink: flexShrink,
    flexBasis: cs.flexBasis || 'auto',
    isGridSpanning: gColSpan > 1 || gRowSpan > 1,
    gridColumnSpan: gColSpan,
    gridRowSpan: gRowSpan,
    aspectRatio: aspectRatio,
    isImage: tagU === 'IMG' || tagU === 'VIDEO' || tagU === 'PICTURE' || tagU === 'CANVAS' || tagU === 'SVG',
    isText: dropinHasOnlyTextChildren(el),
    isLeafNode: el.children.length === 0
  };

  // Siblings (excluding self), in source order, capped.
  var siblings = [];
  if (parentEl && parentCs) {
    var sibs = parentEl.children;
    for (var i = 0; i < sibs.length && siblings.length < DROPIN_MAX_SIBLINGS; i++) {
      var s = sibs[i];
      if (s === el) continue;
      var sRect = s.getBoundingClientRect();
      var sCs = getComputedStyle(s);
      siblings.push({
        oid: dropinReadOid(s),
        bounds: dropinRectToBounds(sRect),
        layoutRole: dropinComputeLayoutRole(sCs, parentCs)
      });
    }
  }

  // (Step 6 cross-section snap) Enumerate OID-bearing elements
  // ELSEWHERE on the page. Excluded:
  //   - self
  //   - ancestors (any walked node === el or contains el = el's ancestor)
  //   - descendants of self
  //   - direct siblings (already counted above)
  //   - off-screen elements (right < 0, bottom < 0, etc — clipped to
  //     a generous bounding viewport so just-scrolled-off elements
  //     still qualify)
  // Bounded to DROPIN_MAX_CROSS_SECTION. Cheap: querySelectorAll is
  // O(n) over the OID set; getBoundingClientRect per match.
  var crossSection = [];
  try {
    var allOidEls = document.querySelectorAll('[data-dropin-id]');
    var vw = (window.innerWidth || document.documentElement.clientWidth || 1024) + 200;
    var vh = (window.innerHeight || document.documentElement.clientHeight || 768) + 200;
    // Build a Set of direct sibling DOM refs for O(1) skip.
    var siblingSet = parentEl ? new Set(Array.prototype.slice.call(parentEl.children)) : new Set();
    for (var ci = 0; ci < allOidEls.length && crossSection.length < DROPIN_MAX_CROSS_SECTION; ci++) {
      var cs2 = allOidEls[ci];
      if (cs2 === el) continue;
      // Skip ancestors (cs2 contains el → cs2 is an ancestor of el).
      if (cs2.contains && cs2.contains(el) && cs2 !== el) continue;
      // Skip descendants (el contains cs2 → cs2 is a descendant of el).
      if (el.contains && el.contains(cs2) && cs2 !== el) continue;
      // Skip direct siblings (already in \`siblings\`).
      if (siblingSet.has(cs2)) continue;
      var csRect = cs2.getBoundingClientRect();
      // Off-screen filter — element must intersect the (slightly padded)
      // viewport on both axes to be a useful snap target. Avoids
      // candidate explosion in very tall pages.
      if (csRect.width <= 0 || csRect.height <= 0) continue;
      if (csRect.right < -200 || csRect.bottom < -200) continue;
      if (csRect.left > vw || csRect.top > vh) continue;
      crossSection.push({
        oid: dropinReadOid(cs2),
        bounds: dropinRectToBounds(csRect)
      });
    }
  } catch (csErr) {
    // Defensive — querySelectorAll can throw on detached docs but won't
    // here. Empty crossSection on failure means snap falls back to
    // sibling/parent/common candidates only.
  }

  return {
    oid: oid,
    bounds: bounds,
    padding: padding,
    margin: margin,
    layoutRole: layoutRole,
    parent: parent,
    constraints: constraints,
    siblings: siblings,
    crossSection: crossSection
  };
}

// Phase 3 — drop-target enumeration. Walks every visible OID-bearing
// element on the page; filters out the moved element + its descendants
// + leaf-tag containers (img / input / br / etc.); returns one entry
// per eligible candidate. Used by the reparent gesture at pointerdown
// to populate its target cache. Bounded by DROPIN_MAX_DROP_TARGETS so
// a 1000-element page doesn't blow the postMessage budget.
//
// Eligibility:
//   - Has an OID (covered by querySelector('[data-dropin-id]')).
//   - Is not the moved element itself.
//   - Is not a descendant of the moved element (would create a cycle
//     once we route through applyReparent — caught at engine level too,
//     but cheaper to filter here so the gesture's hit-test never needs
//     to reject hits).
//   - Tag accepts children (not in the void-element list, not <select>
//     / <textarea> / media leafs).
//   - Has non-zero size (skip display: none or detached elements).
//
// Output direction:
//   - flex with column/row → "row" / "column"
//   - grid → "grid"
//   - everything else → "block" (children flow vertically by default)
var DROPIN_MAX_DROP_TARGETS = 200;

// HTML void elements + media leaves + form controls that own their own
// rendering. Also include SVG which has its own tree semantics our
// reparent engine doesn't model.
var DROPIN_LEAF_TAGS = {
  IMG: 1, INPUT: 1, BR: 1, HR: 1, AREA: 1, BASE: 1, COL: 1, EMBED: 1,
  LINK: 1, META: 1, PARAM: 1, SOURCE: 1, TRACK: 1, WBR: 1,
  IFRAME: 1, OBJECT: 1, SCRIPT: 1, STYLE: 1, NOSCRIPT: 1,
  TEXTAREA: 1, SELECT: 1, OPTION: 1, OPTGROUP: 1, PROGRESS: 1, METER: 1,
  CANVAS: 1, VIDEO: 1, AUDIO: 1, PICTURE: 1, SVG: 1,
  // <a>, <button>, <label> CAN have children but typically shouldn't
  // accept arbitrary block reparents — leave permissive for v1.
};

function dropinComputeDropTargets(excludeOids) {
  if (DROPIN_MODE !== 'jsx') return null;
  // (Phase 3 polish — multi-element) Accept an array of OIDs to exclude
  // (primary + multi-select additionals). Resolve each to its DOM
  // element; non-resolvable entries are silently dropped (gesture handles
  // the no-op gracefully). Backward-compat: a single string is wrapped
  // into a one-element array so older callers still work.
  var excludeList;
  if (typeof excludeOids === 'string') {
    excludeList = excludeOids ? [excludeOids] : [];
  } else if (excludeOids && excludeOids.length) {
    excludeList = excludeOids;
  } else {
    excludeList = [];
  }
  var excludeEls = [];
  for (var ei = 0; ei < excludeList.length; ei++) {
    var resolved = dropinFindByOid(excludeList[ei]);
    if (resolved) excludeEls.push(resolved);
  }
  function dropinIsExcludedSelf(node) {
    for (var x = 0; x < excludeEls.length; x++) {
      if (node === excludeEls[x]) return true;
    }
    return false;
  }
  function dropinExcludedAncestor(node) {
    for (var x = 0; x < excludeEls.length; x++) {
      var ex = excludeEls[x];
      if (ex && ex.contains && ex.contains(node)) return ex;
    }
    return null;
  }

  var targets = [];
  // (Phase 3 polish) Parallel ineligible list for visual feedback —
  // user gets a red outline + reason tooltip when hovering. Capped at
  // the same 200 cap so a 1000-element page can't blow up the postMessage
  // size with red overlays.
  var ineligible = [];
  try {
    var allOidEls = document.querySelectorAll('[data-dropin-id]');
    for (var i = 0; i < allOidEls.length && (targets.length + ineligible.length) < DROPIN_MAX_DROP_TARGETS; i++) {
      var el = allOidEls[i];
      // Self — never appears as eligible OR ineligible (the moved element
      // itself isn't a drop target; the user is dragging it). Multi-element
      // gestures pass each participant through excludeList, so any
      // member of the moving set is silently filtered here.
      if (dropinIsExcludedSelf(el)) continue;

      var rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;

      var oid = dropinReadOid(el);
      if (!oid) continue; // shouldn't happen since selector matches data-dropin-id

      var tagU = el.tagName ? el.tagName.toUpperCase() : '';
      var tagL = el.tagName ? el.tagName.toLowerCase() : '';
      var bounds = dropinRectToBounds(rect);

      // Descendant of any moving element — surface as ineligible with
      // reason "descendant" so the gesture can paint red feedback if the
      // cursor wanders inside. (After the live-translate, descendants
      // visually move with the parent, so the user might mouse over them
      // expecting it to be a drop target.)
      if (dropinExcludedAncestor(el)) {
        ineligible.push({ oid: oid, tag: tagL, bounds: bounds, reason: 'descendant' });
        continue;
      }

      // Leaf tag — element class that can't accept arbitrary children
      // (void / media / form-control). Surface as ineligible with reason
      // "leaf" so the user sees why their drop fails over an <img> /
      // <input> / etc.
      if (DROPIN_LEAF_TAGS[tagU]) {
        ineligible.push({ oid: oid, tag: tagL, bounds: bounds, reason: 'leaf' });
        continue;
      }

      var cs = getComputedStyle(el);
      var role = dropinComputeParentRole(cs);
      var direction;
      if (role === 'flex-container') {
        direction = /column/.test(cs.flexDirection) ? 'column' : 'row';
      } else if (role === 'grid-container') {
        direction = 'grid';
      } else {
        direction = 'block';
      }

      var pad = {
        top: dropinPx(cs.paddingTop), right: dropinPx(cs.paddingRight),
        bottom: dropinPx(cs.paddingBottom), left: dropinPx(cs.paddingLeft)
      };
      var bor = {
        top: dropinPx(cs.borderTopWidth), right: dropinPx(cs.borderRightWidth),
        bottom: dropinPx(cs.borderBottomWidth), left: dropinPx(cs.borderLeftWidth)
      };
      var contentBounds = {
        x: bounds.x + bor.left + pad.left,
        y: bounds.y + bor.top + pad.top,
        width: Math.max(0, bounds.width - bor.left - bor.right - pad.left - pad.right),
        height: Math.max(0, bounds.height - bor.top - bor.bottom - pad.top - pad.bottom)
      };

      // Enumerate direct children (not OID-only — anything that occupies
      // the parent's flow). The gesture uses these midpoints to resolve
      // insertIndex. Descendants of any moving element are filtered out
      // here too (so the moved-element's siblings remain — those are
      // valid drop neighbours). Also skip any child that CONTAINS a
      // moving element (those are ancestors-of-moving inside this
      // candidate, which would expose the moving subtree as a "regular"
      // child slot).
      var kids = [];
      var domKids = el.children;
      for (var k = 0; k < domKids.length; k++) {
        var ch = domKids[k];
        var skipChild = false;
        for (var ek = 0; ek < excludeEls.length; ek++) {
          var exK = excludeEls[ek];
          if (!exK) continue;
          if (ch === exK) { skipChild = true; break; }
          if (exK.contains && exK.contains(ch)) { skipChild = true; break; }
          if (ch.contains && ch.contains(exK)) { skipChild = true; break; }
        }
        if (skipChild) continue;
        var chRect = ch.getBoundingClientRect();
        if (chRect.width <= 0 && chRect.height <= 0) continue;
        kids.push({
          oid: dropinReadOid(ch),
          bounds: dropinRectToBounds(chRect)
        });
      }

      targets.push({
        oid: oid,
        tag: tagL,
        bounds: bounds,
        contentBounds: contentBounds,
        direction: direction,
        children: kids
      });
    }
  } catch (dtErr) {
    // Defensive — querySelectorAll won't throw, but getBoundingClientRect
    // can fail on detached nodes during fast iframe rebuilds. Returning
    // partial targets is fine — the gesture treats an empty/short array
    // as "no drop targets here, abort reparent on this drag."
    return { targets: targets, ineligible: ineligible };
  }
  return { targets: targets, ineligible: ineligible };
}

// --- Live bbox subscriptions ---------------------------------------------
// Spec contract: lib/iframe-bridge.ts dropin:watch-bbox / dropin:bbox.
// FloatingUI autoUpdate pattern (https://floating-ui.com/docs/autoUpdate):
// ResizeObserver(body) catches size changes anywhere in the tree;
// MutationObserver(body, {childList, attributes, subtree, characterData})
// catches React re-renders / class swaps / text edits; window scroll +
// resize listeners (capture: true on scroll to catch internal overflow
// containers) cover viewport shifts. All three feed a single rAF-coalesced
// flush so a busy frame doesn't fan out to N postMessages — at most one
// dropin:bbox per subscription per frame.
//
// Invariant: observers are attached lazily on the first watch and torn
// down when the last watch is removed. Iframe rebuild resets the map
// implicitly (the IIFE re-runs); host re-sends the same subscriptionIds
// after dropin:ready and the iframe creates fresh subs.
var dropinWatchSubs = Object.create(null); // { [subscriptionId]: { oid, lastRect } }
var dropinNextWatchFlush = null;           // rAF id, null = none scheduled
var dropinResizeObserver = null;
var dropinMutationObserver = null;
var dropinWatchScrollListener = null;
var dropinWatchResizeListener = null;

function dropinScheduleWatchFlush() {
  if (dropinNextWatchFlush !== null) return;
  dropinNextWatchFlush = requestAnimationFrame(function () {
    dropinNextWatchFlush = null;
    dropinFlushAllWatches();
  });
}

function dropinFlushAllWatches() {
  for (var id in dropinWatchSubs) {
    var sub = dropinWatchSubs[id];
    if (!sub) continue;
    // Re-resolve by OID every flush — React may have replaced the DOM
    // node with a fresh instance during a re-render. Cheaper than caching
    // and verifying isConnected each time.
    var el = dropinFindByOid(sub.oid);
    if (!el) {
      if (sub.lastRect !== null) {
        sub.lastRect = null;
        dropinPost({ type: 'dropin:bbox', subscriptionId: Number(id), oid: sub.oid, rect: null });
      }
      continue;
    }
    var r = el.getBoundingClientRect();
    var rect = { x: r.left, y: r.top, width: r.width, height: r.height };
    var prev = sub.lastRect;
    if (prev &&
        prev.x === rect.x && prev.y === rect.y &&
        prev.width === rect.width && prev.height === rect.height) {
      continue;
    }
    sub.lastRect = rect;
    dropinPost({ type: 'dropin:bbox', subscriptionId: Number(id), oid: sub.oid, rect: rect });
  }
}

function dropinAttachWatchObservers() {
  if (dropinResizeObserver || dropinMutationObserver) return;
  if (typeof ResizeObserver === 'function' && document.body) {
    dropinResizeObserver = new ResizeObserver(dropinScheduleWatchFlush);
    dropinResizeObserver.observe(document.body);
  }
  if (typeof MutationObserver === 'function' && document.body) {
    dropinMutationObserver = new MutationObserver(dropinScheduleWatchFlush);
    dropinMutationObserver.observe(document.body, {
      childList: true, attributes: true, subtree: true, characterData: true
    });
  }
  dropinWatchScrollListener = function () { dropinScheduleWatchFlush(); };
  dropinWatchResizeListener = function () { dropinScheduleWatchFlush(); };
  // capture: true so scroll inside any overflow container fires (window
  // scroll alone misses internal scroll). FloatingUI autoUpdate caveat.
  window.addEventListener('scroll', dropinWatchScrollListener, { passive: true, capture: true });
  window.addEventListener('resize', dropinWatchResizeListener, { passive: true });
}

function dropinDetachWatchObservers() {
  if (dropinResizeObserver) { dropinResizeObserver.disconnect(); dropinResizeObserver = null; }
  if (dropinMutationObserver) { dropinMutationObserver.disconnect(); dropinMutationObserver = null; }
  if (dropinWatchScrollListener) {
    window.removeEventListener('scroll', dropinWatchScrollListener, { capture: true });
    dropinWatchScrollListener = null;
  }
  if (dropinWatchResizeListener) {
    window.removeEventListener('resize', dropinWatchResizeListener);
    dropinWatchResizeListener = null;
  }
  if (dropinNextWatchFlush !== null) {
    cancelAnimationFrame(dropinNextWatchFlush);
    dropinNextWatchFlush = null;
  }
}

function dropinHasAnyWatch() {
  for (var k in dropinWatchSubs) return true;
  return false;
}

function dropinAddWatch(subscriptionId, oid) {
  // Replace-not-merge if the same id is sent twice — the second overrides
  // (host should not re-send the same id with a different oid; if it does,
  // last write wins).
  dropinWatchSubs[subscriptionId] = { oid: oid, lastRect: null };
  dropinAttachWatchObservers();
  dropinScheduleWatchFlush();
}

function dropinRemoveWatch(subscriptionId) {
  delete dropinWatchSubs[subscriptionId];
  if (!dropinHasAnyWatch()) dropinDetachWatchObservers();
}

// --- Phase 2 (4c-i) min-content measurement ------------------------------
// Spec contract: phase2-manipulation.md Step 7 (constraint system) line 153-
// 161. The resize gesture pre-computes the element's intrinsic min-content
// at \`pointerdown\` so \`pointermove\` can apply elastic resistance below the
// bound (rubberband formula: \`displacement * 0.15\` past the limit) instead
// of silently allowing w/h = 0. Pre-compute (not per-frame) because reading
// \`offsetWidth\` after setting \`width: min-content\` forces a synchronous
// reflow — too expensive every 16 ms.
//
// Implementation: clone the element off-screen (position:absolute, far
// negative offsets, visibility:hidden), apply \`width: min-content;
// height: min-content\`, read \`offsetWidth\`/\`offsetHeight\`, discard. Off-
// screen avoids visible flicker; the clone's layout cost is bounded by the
// element subtree the user is dragging (which they already deemed OK to
// render at full size). Detaching parent context is intentional — we want
// the INHERENT min-content (longest unbreakable text run, image native
// width, etc.), not the parent-flex-constrained one.
//
// No iframe-side cache. The host calls once per gesture (at pointerdown)
// and holds the result for the drag's duration; cross-gesture caching
// would need invalidation on every MutationObserver fire which costs more
// than just re-measuring on a fresh drag.
// Phase E proper — slot envelope readback. Returns the parent's raw CSSOM-
// shaped fields (rect dims + padding/border/aspect-ratio) plus the child's
// own bbox for drift-baseline math. Host turns this into a typed
// SlotEnvelope via parentBoxFromRect + composeEnvelopeFromBbox; the same
// child rect is captured pre-swap and compared against post-swap via
// assessBboxDrift. Mode-agnostic: HTML mode also benefits from envelope
// queries when the source uses data-dropin-id attributes (manual stamping
// + future swap-fit work in HTML mode).
function dropinComputeEnvelope(oid) {
  var el = dropinFindByOid(oid);
  if (!el) return null;
  var parentEl = el.parentElement;
  if (!parentEl) return null;
  var pRect = parentEl.getBoundingClientRect();
  var pCs = getComputedStyle(parentEl);
  var cRect = el.getBoundingClientRect();
  return {
    parent: {
      rectWidthPx: pRect.width,
      rectHeightPx: pRect.height,
      paddingLeftPx: dropinPx(pCs.paddingLeft),
      paddingRightPx: dropinPx(pCs.paddingRight),
      paddingTopPx: dropinPx(pCs.paddingTop),
      paddingBottomPx: dropinPx(pCs.paddingBottom),
      borderLeftPx: dropinPx(pCs.borderLeftWidth),
      borderRightPx: dropinPx(pCs.borderRightWidth),
      borderTopPx: dropinPx(pCs.borderTopWidth),
      borderBottomPx: dropinPx(pCs.borderBottomWidth),
      aspectRatioCss: pCs.aspectRatio || null
    },
    childRect: { widthPx: cRect.width, heightPx: cRect.height }
  };
}

function dropinComputeMinContent(oid) {
  if (DROPIN_MODE !== 'jsx') return null;
  if (!document.body) return null;
  var el = dropinFindByOid(oid);
  if (!el) return null;
  var clone = null;
  try {
    clone = el.cloneNode(true);
    // Strip OID + dropin-loc so the clone can't be selected/queried by
    // accident — querySelector('[data-dropin-id="..."]') always lands on
    // the live element, never on a stranded clone if the cleanup ever
    // failed.
    clone.removeAttribute && clone.removeAttribute('data-dropin-id');
    clone.removeAttribute && clone.removeAttribute('data-dropin-loc');
    clone.removeAttribute && clone.removeAttribute('data-dropin-selected');
    clone.removeAttribute && clone.removeAttribute('data-dropin-hover');
    var s = clone.style;
    s.position = 'absolute';
    s.left = '-99999px';
    s.top = '-99999px';
    s.width = 'min-content';
    s.height = 'min-content';
    // visibility:hidden (not display:none) — display:none would skip
    // layout entirely and offsetWidth would return 0.
    s.visibility = 'hidden';
    s.pointerEvents = 'none';
    document.body.appendChild(clone);
    var minWidth = clone.offsetWidth;
    var minHeight = clone.offsetHeight;
    // Whether this element wraps text content directly (or via descendants).
    // Used by the gesture's constraint chip to add a "(text wrap)" qualifier
    // when the user is about to push width below the longest unbreakable
    // text run (acceptance criterion #7 from phase2-manipulation.md). We
    // walk descendants because the heuristic should fire for both
    // <p>Hello</p> and <button><span>Hello</span></button>. Image / video /
    // canvas / svg elements never qualify even when they contain a text
    // node (alt text doesn't actually wrap).
    var tagU = el.tagName ? el.tagName.toUpperCase() : '';
    var isMedia = tagU === 'IMG' || tagU === 'VIDEO' || tagU === 'PICTURE' || tagU === 'CANVAS' || tagU === 'SVG';
    var hasTextChildren = false;
    if (!isMedia) {
      var txt = el.textContent;
      if (typeof txt === 'string' && /\\S/.test(txt)) hasTextChildren = true;
    }
    return { minWidth: minWidth, minHeight: minHeight, hasTextChildren: hasTextChildren };
  } catch (e) {
    return null;
  } finally {
    if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
  }
}

// --- Phase 2 Step 7 soft constraints -------------------------------------
// Spec contract: phase2-manipulation.md Step 7 line 163-170 +
// maniuplation.md "Constraints → Soft constraints". Spec table lives in
// lib/ast/constraints.ts (host-side pure module). This iframe-side
// function inlines the same evaluation rules so we don't have to
// postMessage the raw measurement struct (rgba, fontWeight, parentBounds,
// etc.) and re-evaluate host-side — gather + evaluate runs in one pass
// here and ships the warning list.
//
// Cheap to run: 1 querySelector + 1-3 getBoundingClientRect (element +
// parent + ancestors during bg color resolution) + 1-N getComputedStyle
// during the bg walk. Bg walk usually halts within 2-3 hops because
// most templates have an opaque ancestor near the top. Mode-gated to JSX
// (HTML mode has no OIDs).
//
// Per the spec's "soft constraints don't bound anything" rule, this
// function never modifies state — it only reads.
function dropinParseRgba(s) {
  if (typeof s !== 'string') return null;
  var m = /rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)(?:\\s*,\\s*([\\d.]+))?\\s*\\)/.exec(s);
  if (!m) return null;
  var r = Number(m[1]); var g = Number(m[2]); var b = Number(m[3]);
  var a = m[4] === undefined ? 1 : Number(m[4]);
  if (!isFinite(r) || !isFinite(g) || !isFinite(b) || !isFinite(a)) return null;
  return { r: r, g: g, b: b, a: a };
}

function dropinResolveBgColor(el) {
  // Walk up from \`el\` looking for an opaque-enough background color.
  // Returns null when the chain hits an ancestor with a non-trivial
  // backgroundImage (gradient / url) — too complex to reason about for
  // v1 contrast computation. Returns the white default when the chain
  // reaches the body without finding any opaque rule.
  var node = el;
  for (var hops = 0; node && node !== document.documentElement && hops < 16; hops++) {
    var cs = getComputedStyle(node);
    if (cs.backgroundImage && cs.backgroundImage !== 'none') {
      // Ambiguous bg — bail. Skipping the contrast check is the right
      // call here; warning on a wrong-color basis is worse than no
      // warning.
      return null;
    }
    var color = dropinParseRgba(cs.backgroundColor);
    if (color && color.a > 0.5) {
      // Composite over white if not fully opaque so we have a deterministic
      // resolved color for the contrast pair.
      if (color.a < 1) {
        // Audit Domain 1 LOW — alpha of "color over opaque white" is
        // exactly 1 by definition (alpha-over-opaque always yields
        // opaque output). The previous \`color.a + (1 - color.a)\`
        // computation was an algebraic identity, just verbosely.
        return {
          r: color.r * color.a + 255 * (1 - color.a),
          g: color.g * color.a + 255 * (1 - color.a),
          b: color.b * color.a + 255 * (1 - color.a),
          a: 1
        };
      }
      return color;
    }
    node = node.parentElement;
  }
  // Reached body without finding an opaque rule — default to white.
  return { r: 255, g: 255, b: 255, a: 1 };
}

function dropinRelativeLuminance(c) {
  function ch(v) {
    var x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

function dropinContrastRatio(a, b) {
  var la = dropinRelativeLuminance(a);
  var lb = dropinRelativeLuminance(b);
  var lighter = Math.max(la, lb);
  var darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function dropinCompositeRgba(top, bg) {
  var a = top.a + bg.a * (1 - top.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (top.r * top.a + bg.r * bg.a * (1 - top.a)) / a,
    g: (top.g * top.a + bg.g * bg.a * (1 - top.a)) / a,
    b: (top.b * top.a + bg.b * bg.a * (1 - top.a)) / a,
    a: a
  };
}

function dropinHasDirectText(el) {
  if (!el || !el.childNodes) return false;
  for (var i = 0; i < el.childNodes.length; i++) {
    var c = el.childNodes[i];
    if (c.nodeType === 3 && c.nodeValue && /\\S/.test(c.nodeValue)) return true;
  }
  return false;
}

function dropinIsInteractiveElement(el) {
  var tagU = el.tagName ? el.tagName.toUpperCase() : '';
  if (tagU === 'A' || tagU === 'BUTTON' || tagU === 'INPUT' ||
      tagU === 'SELECT' || tagU === 'TEXTAREA' || tagU === 'LABEL') {
    return true;
  }
  var role = el.getAttribute && el.getAttribute('role');
  if (role === 'button' || role === 'link' || role === 'menuitem' ||
      role === 'tab' || role === 'checkbox' || role === 'radio') {
    return true;
  }
  // \`tabindex\` on an otherwise-non-interactive element typically signals
  // intent to make it interactive (custom button-like div, etc.).
  if (el.getAttribute && el.getAttribute('tabindex') !== null) {
    var ti = Number(el.getAttribute('tabindex'));
    if (isFinite(ti) && ti >= 0) return true;
  }
  return false;
}

// Soft-constraint thresholds. Mirror lib/ast/constraints.ts — keep these
// in sync when changing one. Bench in scripts/bench-constraints.mjs
// covers the host-side pure module; the iframe inline copy is only
// reachable in a real browser, so visual smoke testing is the verifier.
var DROPIN_SC_TOUCH_MIN = 32;
var DROPIN_SC_TEXT_MIN = 12;
var DROPIN_SC_ASPECT_TOL = 0.05;
var DROPIN_SC_LARGE_FONT = 18;
var DROPIN_SC_LARGE_BOLD_FONT = 14;
var DROPIN_SC_BOLD_WEIGHT = 700;
var DROPIN_SC_AA_NORMAL = 4.5;
var DROPIN_SC_AA_LARGE = 3.0;
var DROPIN_SC_OVERFLOW_TOL = 1;

function dropinComputeSoftConstraints(oid) {
  if (DROPIN_MODE !== 'jsx') return null;
  var el = dropinFindByOid(oid);
  if (!el) return null;
  var rect = el.getBoundingClientRect();
  var cs = getComputedStyle(el);
  var warnings = [];

  // 1. Touch target
  var isInteractive = dropinIsInteractiveElement(el);
  var w = rect.width; var h = rect.height;
  if (isInteractive && (w > 0 || h > 0)) {
    var tooSmallW = w < DROPIN_SC_TOUCH_MIN;
    var tooSmallH = h < DROPIN_SC_TOUCH_MIN;
    if (tooSmallW || tooSmallH) {
      warnings.push({
        kind: 'touch-target',
        severity: 'warning',
        axis: tooSmallW && tooSmallH ? 'both' : tooSmallW ? 'x' : 'y',
        message: 'Touch target ' + Math.round(w) + '×' + Math.round(h) + 'px (min ' + DROPIN_SC_TOUCH_MIN + 'px)'
      });
    }
  }

  // 2. Text size
  var fontSizePx = parseFloat(cs.fontSize);
  if (!isFinite(fontSizePx)) fontSizePx = 0;
  var hasText = dropinHasDirectText(el);
  if (hasText && fontSizePx > 0 && fontSizePx < DROPIN_SC_TEXT_MIN) {
    warnings.push({
      kind: 'text-size',
      severity: 'warning',
      message: 'Font size ' + fontSizePx.toFixed(1) + 'px (min ' + DROPIN_SC_TEXT_MIN + 'px)'
    });
  }

  // 3. Image aspect distortion
  var tagU = el.tagName ? el.tagName.toUpperCase() : '';
  var isMedia = tagU === 'IMG' || tagU === 'VIDEO' || tagU === 'PICTURE' || tagU === 'CANVAS' || tagU === 'SVG';
  var naturalAspect = null;
  if (tagU === 'IMG' && el.naturalWidth > 0 && el.naturalHeight > 0) {
    naturalAspect = el.naturalWidth / el.naturalHeight;
  } else if (tagU === 'VIDEO' && el.videoWidth > 0 && el.videoHeight > 0) {
    naturalAspect = el.videoWidth / el.videoHeight;
  }
  if (isMedia && naturalAspect !== null && w > 0 && h > 0) {
    var current = w / h;
    var ratio = current / naturalAspect;
    if (ratio < 1 - DROPIN_SC_ASPECT_TOL || ratio > 1 + DROPIN_SC_ASPECT_TOL) {
      warnings.push({
        kind: 'aspect-distorted',
        severity: 'warning',
        message: 'Aspect ' + current.toFixed(2) + ':1 (natural ' + naturalAspect.toFixed(2) + ':1)'
      });
    }
  }

  // 4. WCAG AA contrast (text only)
  if (hasText) {
    var fg = dropinParseRgba(cs.color);
    var bg = dropinResolveBgColor(el);
    if (fg && bg) {
      var composedFg = fg.a < 1 ? dropinCompositeRgba(fg, bg) : fg;
      var contrast = dropinContrastRatio(composedFg, bg);
      var fontWeight = parseInt(cs.fontWeight, 10);
      if (!isFinite(fontWeight)) fontWeight = 400;
      var threshold;
      if (fontSizePx >= DROPIN_SC_LARGE_FONT) threshold = DROPIN_SC_AA_LARGE;
      else if (fontSizePx >= DROPIN_SC_LARGE_BOLD_FONT && fontWeight >= DROPIN_SC_BOLD_WEIGHT) threshold = DROPIN_SC_AA_LARGE;
      else threshold = DROPIN_SC_AA_NORMAL;
      if (contrast + 0.001 < threshold) {
        warnings.push({
          kind: 'contrast',
          severity: 'warning',
          message: 'Contrast ' + contrast.toFixed(1) + ':1 (WCAG AA ' + threshold.toFixed(1) + ':1)'
        });
      }
    }
  }

  // 5. Overflow vs parent (skip body — overflowing the body is normal page scroll)
  var parentEl = el.parentElement;
  if (parentEl && parentEl !== document.documentElement && parentEl !== document.body) {
    var pRect = parentEl.getBoundingClientRect();
    var tol = DROPIN_SC_OVERFLOW_TOL;
    var overflowX = rect.left < pRect.left - tol || rect.right > pRect.right + tol;
    var overflowY = rect.top < pRect.top - tol || rect.bottom > pRect.bottom + tol;
    if (overflowX || overflowY) {
      warnings.push({
        kind: 'overflow',
        severity: 'warning',
        axis: overflowX && overflowY ? 'both' : overflowX ? 'x' : 'y',
        message: 'Overflows parent'
      });
    }
  }

  return warnings;
}

// --- Track A managed live stylesheet -------------------------------------
// Spec contract: phase2-manipulation.md Step 4 + maniuplation.md Layer 5.
// During a drag the host pushes per-rAF style declarations via
// \`dropin:live-style { id, declarations }\` and we upsert a CSS rule keyed
// by \`[data-dropin-id="\${id}"]\` inside a foreign \`<style id="dropin-live">\`
// element. React doesn't touch foreign stylesheets so the cascade wins and
// optimistic paint stays stable across reconciles. Phase 2 (4b) is the
// first consumer; Phase 2 (4c+) padding/margin gestures use the same
// channel.
//
// Implementation: rule store is a plain object keyed by oid; on each write
// we rebuild the entire \`<style>\` textContent. Re-parse cost is negligible
// at 1-3 simultaneous live styles (single-element resize, multi-select
// later). If the channel ever sees >50 concurrent rules we'd switch to
// CSSStyleSheet.replaceSync() or insertRule/deleteRule with an index map —
// but that's a Phase 2 (4c+) worry, not a (4b) one.
//
// Each declaration emits with \`!important\` so it wins over user inline
// styles, Tailwind utilities, and template-author CSS. Track A is supposed
// to be authoritative during a drag; the host commits the canonical value
// at pointerup via Track B (AST diff → magic-string source rewrite) and
// then clears the live rule so the cascade returns to normal.
var dropinLiveStyleEl = null;
var dropinLiveRules = Object.create(null); // { [oid]: { kebab-case-prop: value } }

function dropinEnsureLiveStyleEl() {
  if (dropinLiveStyleEl && dropinLiveStyleEl.isConnected) return dropinLiveStyleEl;
  var el = document.getElementById('dropin-live');
  if (!el) {
    el = document.createElement('style');
    el.id = 'dropin-live';
    if (document.head) document.head.appendChild(el);
    else if (document.documentElement) document.documentElement.appendChild(el);
  }
  dropinLiveStyleEl = el;
  return el;
}

function dropinRebuildLiveStylesheet() {
  var el = dropinEnsureLiveStyleEl();
  if (!el) return;
  var rules = [];
  for (var id in dropinLiveRules) {
    var decl = dropinLiveRules[id];
    if (!decl) continue;
    var props = [];
    for (var p in decl) {
      var v = decl[p];
      if (typeof v !== 'string' && typeof v !== 'number') continue;
      props.push(p + ': ' + v + ' !important');
    }
    if (props.length === 0) continue;
    // Defense-in-depth — current OIDs are 8 alnum chars per makeOid in
    // lib/ast/oids.ts so they can't contain quotes today, but a future
    // change to the ID space shouldn't break this stylesheet.
    var safeId = String(id).replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\"');
    rules.push('[data-dropin-id="' + safeId + '"] { ' + props.join('; ') + ' }');
  }
  el.textContent = rules.join('\\n');
}

function dropinSetLiveStyle(id, declarations) {
  if (typeof id !== 'string' || !id) return;
  // Replace-not-merge per call. The host pushes a complete declaration
  // snapshot each frame; intermediate merges would let stale properties
  // leak across gestures (e.g., set width then later send padding without
  // width — width would persist).
  if (!declarations || typeof declarations !== 'object') {
    delete dropinLiveRules[id];
  } else {
    dropinLiveRules[id] = declarations;
  }
  dropinRebuildLiveStylesheet();
}

function dropinClearLiveStyle(id) {
  if (typeof id !== 'string' || !id) return;
  if (!(id in dropinLiveRules)) return;
  delete dropinLiveRules[id];
  dropinRebuildLiveStylesheet();
}

// --- Preset hover preview (ROADMAP §3.5 polish) -------------------------
// While the user hovers a preset tile in FocusEditor, we want them to see
// the proposed look on the actual element without committing source. The
// live stylesheet channel only carries CSS declarations, but presets are
// Tailwind class swaps — the only way to make Tailwind's atomic utility
// rules paint is to put the right tokens in the element's className.
// So this is a direct className swap with a per-OID stash so we can
// restore on hover-leave. The stash is keyed by OID; nested hovers (host
// guarantees one preset hover at a time, but defensively re-stashing the
// SAME oid would lose the original) skip on second push.
var dropinHoverStash = Object.create(null); // { [oid]: originalClassName }

function dropinHoverPreview(id, classes) {
  if (typeof id !== 'string' || !id) return;
  var el = document.querySelector('[data-dropin-id="' + dropinCssEscape(id) + '"]');
  if (!el) return;
  if (!(id in dropinHoverStash)) {
    dropinHoverStash[id] = el.getAttribute('class') || '';
  }
  var tokens = Array.isArray(classes) ? classes.filter(function (c) {
    return typeof c === 'string' && c.length > 0;
  }) : [];
  el.setAttribute('class', tokens.join(' '));
}

function dropinHoverClear(id) {
  if (typeof id !== 'string' || !id) return;
  if (!(id in dropinHoverStash)) return;
  var el = document.querySelector('[data-dropin-id="' + dropinCssEscape(id) + '"]');
  var orig = dropinHoverStash[id];
  if (el) {
    if (orig) el.setAttribute('class', orig);
    else el.removeAttribute('class');
  }
  delete dropinHoverStash[id];
}

// --- Track B FLIP (Phase 2 Step 5, phase2-manipulation.md line 124-130) ---
// The host arms a flip at gesture commit by capturing the element's last
// optimistic rect (Track A live-stylesheet rect). After iframe rebuild,
// when the canonical render settles, the host computes drift; if non-trivial,
// it posts \`dropin:flip { id, fromRect }\`. We:
//   1. Find the element by OID. (Element survives the rebuild because its
//      OID is in the source — the new iframe re-renders it.)
//   2. Compute the inverse transform that places the element's CURRENT
//      canonical rect back at \`fromRect\` (where the user last saw it).
//   3. Apply transform with no transition. Reflow.
//   4. Re-enable transition + transform = none → element animates from
//      fromRect to canonical over 150 ms ease-out.
//   5. On transitionend (filtered to property === 'transform'), restore
//      the original inline transform/transition/transformOrigin so the
//      element doesn't carry our temp styles forward.
// Safety timer (250 ms = 150 transition + 100 slack) catches the case where
// transitionend doesn't fire (element removed mid-animation, browser bug).
// Re-entrancy: a second flip on the same element pre-empts the first via the
// element's _dropinFlipCleanup hook.
function dropinFlipFromRect(oid, fromRect) {
  if (!oid || !fromRect) return;
  var el = dropinFindByOid(oid);
  if (!el) return;
  if (typeof fromRect.x !== 'number' || typeof fromRect.y !== 'number' ||
      typeof fromRect.width !== 'number' || typeof fromRect.height !== 'number') {
    return;
  }
  var last = el.getBoundingClientRect();
  var dx = fromRect.x - last.x;
  var dy = fromRect.y - last.y;
  var sx = last.width > 0 ? (fromRect.width / last.width) : 1;
  var sy = last.height > 0 ? (fromRect.height / last.height) : 1;
  // Belt-and-braces no-op skip. Host already gates on detectDrift's
  // threshold (1 px / 1%) — this catches stale flips that became
  // no-ops between arm and dispatch (e.g., layout settled on its own).
  // Tighter threshold here so anything the host bothered to send
  // through gets rendered.
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 &&
      Math.abs(sx - 1) < 0.005 && Math.abs(sy - 1) < 0.005) {
    return;
  }
  // Cancel any in-progress flip on this same element so a rapid second
  // commit doesn't leave the element with frozen mid-transition state.
  if (el._dropinFlipCleanup) {
    try { el._dropinFlipCleanup(); } catch (_) {}
  }
  // Snapshot original inline transform-related styles so cleanup can
  // restore them. We only touch inline; CSS-class transforms remain in
  // the cascade and the inline override is removed on cleanup.
  var origTransform = el.style.transform;
  var origTransition = el.style.transition;
  var origTransformOrigin = el.style.transformOrigin;
  var cleanupTimer = 0;
  function cleanup() {
    try { el.removeEventListener('transitionend', onEnd); } catch (_) {}
    if (cleanupTimer) {
      clearTimeout(cleanupTimer);
      cleanupTimer = 0;
    }
    el.style.transform = origTransform;
    el.style.transition = origTransition;
    el.style.transformOrigin = origTransformOrigin;
    el._dropinFlipCleanup = null;
  }
  function onEnd(ev) {
    if (ev && ev.propertyName !== 'transform') return;
    cleanup();
  }
  // Apply inverse transform with NO transition — element snaps to
  // fromRect's position relative to its current layout.
  el.style.transformOrigin = 'top left';
  el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + sx + ', ' + sy + ')';
  el.style.transition = 'none';
  // Force sync layout so the browser commits the inverse transform
  // BEFORE we re-enable transition. Without this, the browser batches
  // both writes and no transition fires.
  void el.offsetWidth;
  el.style.transition = 'transform 150ms ease-out';
  el.style.transform = origTransform || 'none';
  el.addEventListener('transitionend', onEnd);
  cleanupTimer = setTimeout(cleanup, 250);
  el._dropinFlipCleanup = cleanup;
}

var dropinHover = null;
var dropinSelected = null;
var dropinEditing = null;
// Phase 5 / Phase C — insert-mode hover painter. Tracks the element
// currently receiving the green outline so we can clear it cleanly on
// move-out, click commit, or tool switch. Independent from dropinHover
// so the two states don't fight each other when the user toggles tools.
var dropinInsertHover = null;

function dropinSetHover(el) {
  if (dropinHover === el) return;
  if (dropinHover) dropinHover.removeAttribute('data-dropin-hover');
  var prev = dropinHover;
  dropinHover = el;
  if (dropinHover && dropinHover !== dropinSelected) {
    dropinHover.setAttribute('data-dropin-hover', '');
  }
  // Hover paint fires on every pointermove; logging it floods the
  // console. Re-enable by flipping DROPIN_DEBUG below if needed.
}

function dropinSetInsertHover(el) {
  if (dropinInsertHover === el) return;
  if (dropinInsertHover) dropinInsertHover.removeAttribute('data-dropin-insert-hover');
  dropinInsertHover = el;
  if (dropinInsertHover) dropinInsertHover.setAttribute('data-dropin-insert-hover', '');
}

// Phase 5 / Phase C — true if el is a viable insert target. Mirrors
// applyInsertChild's pre-conditions: must have an OID, must not be a
// leaf-tag (img / input / etc.), must not be a self-closing form
// control. Used by the mousemove painter so the user sees a green
// outline only over containers that will actually accept the insert.
function dropinIsInsertEligible(el) {
  if (!el || el.nodeType !== 1) return false;
  if (!el.getAttribute) return false;
  var oid = el.getAttribute('data-dropin-id');
  if (!oid) return false;
  var tagU = el.tagName ? el.tagName.toUpperCase() : '';
  if (DROPIN_LEAF_TAGS[tagU]) return false;
  return true;
}

function dropinSetSelected(el) {
  var prev = dropinSelected;
  if (dropinSelected && dropinSelected !== el) {
    dropinSelected.removeAttribute('data-dropin-selected');
  }
  dropinSelected = el;
  if (dropinSelected) {
    dropinSelected.setAttribute('data-dropin-selected', '');
    if (dropinHover === dropinSelected) {
      dropinHover.removeAttribute('data-dropin-hover');
      dropinHover = null;
    }
  }
  if (prev !== el) {
    dropinDbg('[dropin:iframe] selection outline moved', { from: prev ? dropinDesc(prev) : null, to: el ? dropinDesc(el) : null });
  }
}

// Try OID match first (stable across any source edit that doesn't delete the
// element). Fall back to loc match (line:col prefix — only survives edits
// that don't shift startLine:startCol). HTML mode has no OID; oid arg is
// always null there. JSX mode pre-OID-injection (or pasted-in elements that
// haven't gone through injectOids yet) also lack an oid — loc fallback
// keeps them addressable.
function dropinApplyReselect(loc, oid, attempt, nonce) {
  var el = oid ? dropinFindByOid(oid) : null;
  var via = el ? 'oid' : null;
  if (!el) {
    el = dropinFindByLoc(loc);
    if (el) via = 'loc';
  }
  if (el) {
    dropinDbg('[dropin:iframe] reselect matched element', { via: via, oid: oid, loc: loc, element: dropinDesc(el), attempt: attempt || 0, nonce: nonce });
    dropinSetSelected(el);
    var payload = dropinSerialize(el);
    if (payload) {
      var msg = { type: 'dropin:select', selection: payload };
      if (typeof nonce === 'number') msg.nonce = nonce;
      dropinPost(msg);
    }
    // ROADMAP §4.2 #15 — scroll the reselected element into view if a
    // structural source edit moved it offscreen. Deferred to 320 ms so
    // it lands after the last dropinRestoreScroll() phase (300 ms);
    // otherwise the restore pass would yank the iframe right back. The
    // post-restore rect is then re-measured so on-screen elements don't
    // jitter unnecessarily, and dropinSelected !== el bails when the
    // user clicked another element while we were waiting.
    var elRef = el;
    setTimeout(function () {
      if (dropinSelected !== elRef) return;
      try {
        var r = elRef.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        if (r.bottom < 16 || r.top > vh - 16) {
          elRef.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
          dropinDbg('[dropin:iframe] reselect: scrolled element into view', { oid: oid });
        }
      } catch (e) {}
    }, 320);
    return;
  }
  var n = attempt || 0;
  if (n < 12) {
    if (n === 0) {
      dropinDbg('[dropin:iframe] reselect: no match yet, will retry', { oid: oid, loc: loc, nonce: nonce });
    }
    setTimeout(function () { dropinApplyReselect(loc, oid, n + 1, nonce); }, 40);
  } else {
    dropinDbg('[dropin:iframe] reselect: gave up after 12 retries (oid+loc both stale)', { oid: oid, loc: loc, nonce: nonce });
    dropinPost({ type: 'dropin:clear-selection', reason: 'reselect-failed' });
  }
}

// pointermove (not mousemove) so touch + pen devices fire natively.
// During a touch slide, pointermove updates hover/insert-hover continuously,
// letting touch users preview targets before lifting to commit. A single
// tap fires one pointermove + click — same single-target behaviour as a
// desktop click.
document.addEventListener('pointermove', function (ev) {
  if (dropinEditing) return;
  if (DROPIN_TOOL === 'insert') {
    // Walk to nearest OID-bearing eligible container. Reuses the same
    // ancestor walk select / move use, then re-checks eligibility (a
    // resolved target might still be a leaf-tag like <img>).
    var t = dropinResolveTarget(ev.target);
    if (!t || !dropinIsInsertEligible(t)) {
      dropinSetInsertHover(null);
      return;
    }
    if (dropinHover) dropinSetHover(null);
    dropinSetInsertHover(t);
    return;
  }
  // Hover paint only fires in select / move. View is read-only; Swap
  // requires a pre-existing selection so doesn't paint hover.
  if (DROPIN_TOOL !== 'select' && DROPIN_TOOL !== 'move') {
    if (dropinHover) dropinSetHover(null);
    if (dropinInsertHover) dropinSetInsertHover(null);
    return;
  }
  if (dropinInsertHover) dropinSetInsertHover(null);
  dropinSetHover(dropinResolveTarget(ev.target));
}, true);

// pointerleave (not mouseleave) — fires when the active pointer leaves
// the document. On touch, this fires after pointerup which is correct
// for clearing the hover paint; the click handler below has already
// captured the selection before this clears.
document.addEventListener('pointerleave', function () {
  dropinSetHover(null);
  dropinSetInsertHover(null);
}, true);

// SINGLE CAPTURE-PHASE CLICK HANDLER for the inspector runtime. Tool
// coordination is via the DROPIN_TOOL global; vibe-edit's runtime.ts
// adds its own DROPIN_TOOL === 'vibe' handler that lives alongside
// this one (registered later, but only one of them ever does work per
// click because of the tool gate). A future inspector tool MUST hook
// into one of these two handlers via a DROPIN_TOOL === 'mytool'
// branch — do NOT register a third addEventListener('click', …, true)
// on document. Capture-phase stopPropagation kills bubble listeners
// and there's no clean way to multiplex multiple capture handlers
// without an explicit dispatcher. WU2 lock-the-design (2026-05-12).
document.addEventListener('click', function (ev) {
  if (dropinEditing) {
    // clicks inside the editing element are for text editing; don't intercept
    if (ev.target === dropinEditing || (dropinEditing && dropinEditing.contains && dropinEditing.contains(ev.target))) return;
    dropinCommitEdit();
    return;
  }

  // Phase 5 / Phase C — Insert tool click. Hit-test for an eligible
  // container; emit dropin:insert-target-confirmed so the host can
  // route through applyInsertChild + open the library scoped to the
  // chosen parent. Iframe cannot run the engine itself (engine lives
  // host-side). Same alt-walk semantics as Select so the user can
  // reach a containing section if a child caught the click.
  if (DROPIN_TOOL === 'insert') {
    var insertRaw = ev.target;
    var insertT = dropinResolveTarget(insertRaw);
    if (!insertT || !dropinIsInsertEligible(insertT)) return;
    if (ev.altKey) {
      var insertSteps = ev.shiftKey ? 2 : 1;
      for (var ii = 0; ii < insertSteps; ii++) {
        var insertParent = dropinNextAddressableAncestor(insertT);
        if (!insertParent) break;
        insertT = insertParent;
      }
      if (!dropinIsInsertEligible(insertT)) return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    var insertOid = insertT.getAttribute('data-dropin-id');
    var insertTag = insertT.tagName ? insertT.tagName.toLowerCase() : '';
    dropinSetInsertHover(null);
    // Shift without Alt = additive target. Mirrors Select-mode's
    // shift-click semantics. The host accumulates targets in
    // additionalInsertTargetOids so a single asset pick batches into
    // applyInsertChildMulti.
    var insertAdditive = ev.shiftKey && !ev.altKey;
    var insertMsg = { type: 'dropin:insert-target-confirmed', oid: insertOid, tag: insertTag };
    if (insertAdditive) insertMsg.additive = true;
    dropinDbg('[dropin:iframe] insert click', { oid: insertOid, tag: insertTag, additive: insertAdditive });
    dropinPost(insertMsg);
    return;
  }

  // Phase 5 / Phase B — tool gating. View tool: clicks pass through
  // verbatim to the rendered page (so buttons / form controls behave
  // like the live site). Swap requires a selection and fires from the
  // toolbar button, not iframe clicks.
  //
  // Anchor exception: an unintercepted <a href="/foo"> click navigates
  // the srcdoc iframe to localhost:3001/foo, which renders our own
  // workspace/gallery chrome inside the preview — looks like "another
  // workspace opened up underneath". Block link-driven navigation in
  // every non-edit tool. Buttons + forms keep working because they
  // don't traverse <a> ancestors.
  if (DROPIN_TOOL !== 'select' && DROPIN_TOOL !== 'move') {
    var navTarget = ev.target;
    var anchorAncestor =
      navTarget && navTarget.closest ? navTarget.closest('a[href]') : null;
    if (anchorAncestor) {
      ev.preventDefault();
      dropinDbg('[dropin:iframe] view-mode anchor click blocked', {
        href: anchorAncestor.getAttribute('href'),
      });
    }
    return;
  }

  var raw = ev.target;
  var rawDesc = dropinDesc(raw);
  var chain = dropinAncestorChain(raw);
  dropinDbg('[dropin:iframe] click raw target', { rawTarget: rawDesc, altKey: ev.altKey, shiftKey: ev.shiftKey, ancestorChain: chain, tool: DROPIN_TOOL });

  var t = dropinResolveTarget(raw);
  if (!t) {
    dropinDbg('[dropin:iframe] click ignored (no addressable target up the chain)', { rawTarget: rawDesc });
    return;
  }

  // Alt-click walks up one addressable ancestor per click. Shift+Alt walks
  // up two. This lets the user reach a containing section when a child
  // overlay catches the click. Alt-click bypasses group-root resolution —
  // it's the explicit "ignore groups, walk ancestors" escape hatch.
  if (ev.altKey) {
    var steps = ev.shiftKey ? 2 : 1;
    var original = dropinDesc(t);
    for (var i = 0; i < steps; i++) {
      var parent = dropinNextAddressableAncestor(t);
      if (!parent) break;
      t = parent;
    }
    dropinDbg('[dropin:iframe] alt-click → walked up', { from: original, steps: steps, landedOn: dropinDesc(t) });
  } else {
    // Plain click: apply group-root resolution. No-op when no ancestor has
    // data-dropin-group; with one, first click selects root, subsequent
    // clicks while already-inside drill in.
    var beforeGroup = t;
    t = dropinResolveGroupSelection(t);
    if (t !== beforeGroup) {
      dropinDbg('[dropin:iframe] group resolution → selected group root', { rawTarget: dropinDesc(beforeGroup), groupRoot: dropinDesc(t) });
    }
  }

  ev.preventDefault();
  ev.stopPropagation();
  dropinDbg('[dropin:iframe] resolved selection', { resolved: dropinDesc(t), wasDirectTarget: t === raw });

  dropinSetSelected(t);
  var payload = dropinSerialize(t);
  if (payload) {
    // Phase 2 acceptance #13 — multi-element coordinated drag. Plain shift-
    // click (no Alt) marks the click as additive: host appends the OID to
    // the multi-select set and the prior primary becomes one of the
    // additional members. Shift+Alt-click stays the existing "walk up two
    // ancestors" behaviour (alt-click branch above already consumed the
    // shift modifier). Pure clicks omit the flag — host resets the set.
    var additive = ev.shiftKey && !ev.altKey;
    var msg = { type: 'dropin:select', selection: payload };
    if (additive) msg.additive = true;
    dropinDbg('[dropin:iframe] → posting dropin:select to host', { tag: payload.tag, loc: payload.loc, breadcrumbDepth: payload.breadcrumb.length, additive: additive });
    dropinPost(msg);
  }
  // Centre the freshly-selected element in the iframe viewport. Skips
  // additive (shift-click) so building a multi-selection doesn't yank
  // scroll on every member. Re-selecting the already-selected element
  // is a no-op visually but harmless. block + inline center honours
  // the user-facing "always bring to middle of view" requirement;
  // dropinFitToViewport scales the iframe document down with CSS zoom
  // when the element overflows the viewport so the user sees the whole
  // thing at once.
  if (!(ev.shiftKey && !ev.altKey)) {
    dropinFitToViewport(t);
    dropinCenterInView(t);
  }
}, true);

function dropinCenterInView(el) {
  if (!el || typeof el.scrollIntoView !== 'function') return;
  try {
    el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
  } catch (e) {
    try { el.scrollIntoView(); } catch (e2) {}
  }
}

// Scale the iframe documentElement via CSS zoom so the selected element
// fits inside the viewport. Reset before measuring so a previous fit
// doesnt confuse the bbox read. zoom is layout-aware (children
// re-layout at the scaled size, click coords + getBoundingClientRect
// auto-compensate) which keeps SelectionOverlay math correct without
// any host-side compensation. Chromium + Safari support; Firefox
// renders at 1.0 (selected element falls back to scroll-only centering,
// same as before this change).
function dropinFitToViewport(el) {
  if (!el || !el.getBoundingClientRect) return;
  var docEl = document.documentElement;
  if (!docEl) return;
  try { docEl.style.zoom = ''; } catch (e) {}
  try {
    var r = el.getBoundingClientRect();
    var vw = window.innerWidth || docEl.clientWidth || 0;
    var vh = window.innerHeight || docEl.clientHeight || 0;
    if (!vw || !vh || !r.width || !r.height) return;
    if (r.width <= vw && r.height <= vh) return;
    var sx = vw / r.width;
    var sy = vh / r.height;
    var scale = Math.min(sx, sy) * 0.92;
    if (scale > 0 && scale < 1) {
      docEl.style.zoom = String(scale);
      dropinDbg('[dropin:iframe] fit-to-viewport', { scale: scale, elW: r.width, elH: r.height, vw: vw, vh: vh });
    }
  } catch (e) {}
}

function dropinResetViewportFit() {
  try {
    if (document.documentElement) document.documentElement.style.zoom = '';
  } catch (e) {}
}

function dropinCommitEdit() {
  if (!dropinEditing) return;
  var el = dropinEditing;
  dropinEditing = null;
  el.removeAttribute('data-dropin-editing');
  el.removeAttribute('contenteditable');
  var loc = dropinElementLoc(el);
  if (loc) {
    dropinPost({
      type: 'dropin:text-commit',
      loc: loc,
      text: el.textContent || '',
      tag: el.tagName.toLowerCase()
    });
  }
}

document.addEventListener('dblclick', function (ev) {
  // Only the select tool owns inline text editing. In view mode the dblclick
  // should pass through to the user's template (link follow, button action).
  // In move/insert modes it has no defined behavior — pass through too.
  if (DROPIN_TOOL !== 'select') return;
  var t = dropinResolveTarget(ev.target);
  if (!t) return;
  if (!dropinHasOnlyTextChildren(t)) return;
  ev.preventDefault();
  ev.stopPropagation();
  dropinEditing = t;
  dropinSetSelected(t);
  t.setAttribute('data-dropin-editing', '');
  t.setAttribute('contenteditable', 'true');
  t.focus();
  try {
    var range = document.createRange();
    range.selectNodeContents(t);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (e) {}
}, true);

document.addEventListener('blur', function (ev) {
  if (ev.target === dropinEditing) dropinCommitEdit();
}, true);

document.addEventListener('keydown', function (ev) {
  if (dropinEditing) {
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); dropinCommitEdit(); return; }
    if (ev.key === 'Escape') { ev.preventDefault(); dropinCommitEdit(); return; }
    return;
  }
  if (ev.key === 'Escape') {
    dropinSetSelected(null);
    dropinResetViewportFit();
    dropinPost({ type: 'dropin:clear-selection' });
  }
}, true);

// Suppress page navigation when clicking links while editing
document.addEventListener('submit', function (ev) { ev.preventDefault(); }, true);

window.addEventListener('message', function (ev) {
  var d = ev.data;
  if (!d || typeof d !== 'object' || d.__dropin !== true) return;
  // High-frequency or low-value message types: the host pings the
  // iframe constantly with bbox subscriptions, soft-constraint queries,
  // scroll restores, etc. Logging each one buries the events the user
  // actually wants to see (set-tool, reselect, clear, hover-preview).
  if (
    d.type !== 'dropin:watch-bbox' &&
    d.type !== 'dropin:unwatch-bbox' &&
    d.type !== 'dropin:get-soft-constraints' &&
    d.type !== 'dropin:get-layout-context' &&
    d.type !== 'dropin:get-min-content' &&
    d.type !== 'dropin:get-drop-targets' &&
    d.type !== 'dropin:get-envelope' &&
    d.type !== 'dropin:scroll-restore' &&
    d.type !== 'dropin:hover-preview' &&
    d.type !== 'dropin:hover-clear' &&
    d.type !== 'dropin:live-style' &&
    d.type !== 'dropin:set-group-roots'
  ) {
    dropinDbg('[dropin:iframe] ← host: ' + d.type, d);
  }
  if (d.type === 'dropin:reselect') dropinApplyReselect(d.loc, d.oid || null, 0, d.nonce);
  else if (d.type === 'dropin:clear') {
    dropinSetSelected(null);
    dropinResetViewportFit();
  }
  else if (d.type === 'dropin:get-layout-context') {
    var ctx = null;
    try {
      ctx = dropinComputeLayoutContext(d.oid);
    } catch (lcErr) {
      console.warn('[dropin:iframe] layout-context query failed', { oid: d.oid, err: String(lcErr) });
    }
    dropinPost({ type: 'dropin:layout-context', requestId: d.requestId, context: ctx });
  }
  else if (d.type === 'dropin:request-tree') {
    // Host missed our unprompted on-ready tree push (handshake race) and is
    // asking for a fresh snapshot. Cheap — re-walk + post.
    dropinPostTree();
  }
  else if (d.type === 'dropin:request-ready') {
    // Handshake poll. The host keeps asking until we answer (our one-shot
    // on-load dropin:ready can land before the host's listener exists). Re-
    // announce ready + push the tree. Idempotent — host de-dupes via its
    // srcDoc-identity guard, and stops polling once it hears back.
    dropinPost({ type: 'dropin:ready', kind: DROPIN_MODE });
    dropinPostTree();
  }
  else if (d.type === 'dropin:set-group-roots') {
    // Replace-not-merge: host owns the entire host-driven set on each push.
    // Template-author opt-in via \`data-dropin-group\` attribute is unaffected
    // (different code path in dropinFindGroupRoot).
    dropinGroupRootOids = Object.create(null);
    var grIn = Array.isArray(d.oids) ? d.oids : [];
    for (var grI = 0; grI < grIn.length; grI++) {
      if (typeof grIn[grI] === 'string') dropinGroupRootOids[grIn[grI]] = true;
    }
    // Group roots get pushed on every dropin:ready and on every Workspace
    // group-state change. Silenced — the count is in the ← host log if you
    // re-enable that path, and it isn't a user-actionable event.
  }
  else if (d.type === 'dropin:set-tool') {
    // Phase 5 / Phase B — replace-not-merge. Host pushes whenever the
    // workspace tool changes AND on every dropin:ready so iframe
    // rebuilds re-receive the canonical value. Whitelist guards
    // against malformed payloads (the union is closed but a stale
    // host shouldn't be able to push 'undefined' and break gating).
    if (
      d.tool === 'view' || d.tool === 'select' || d.tool === 'move' ||
      d.tool === 'insert' || d.tool === 'swap' || d.tool === 'vibe' ||
      d.tool === 'ai'
    ) {
      DROPIN_TOOL = d.tool;
      // Drop any lingering hover paint when a non-painting tool
      // takes over. The mousemove gate suppresses NEW paint but a
      // paint applied just before the switch would otherwise stick
      // until the next mouseleave. Insert hover is its own state
      // and clears whenever we leave insert mode.
      if (DROPIN_TOOL !== 'select' && DROPIN_TOOL !== 'move' && dropinHover) {
        dropinSetHover(null);
      }
      if (DROPIN_TOOL !== 'insert' && dropinInsertHover) {
        dropinSetInsertHover(null);
      }
      // Leaving select/move drops the fit-to-viewport zoom so the
      // user reads the rest of the page at native size.
      if (DROPIN_TOOL !== 'select' && DROPIN_TOOL !== 'move') {
        dropinResetViewportFit();
      }
      dropinDbg('[dropin:iframe] tool updated', { tool: DROPIN_TOOL });
    }
  }
  else if (d.type === 'dropin:watch-bbox') {
    if (typeof d.subscriptionId === 'number' && typeof d.oid === 'string') {
      dropinAddWatch(d.subscriptionId, d.oid);
    }
  }
  else if (d.type === 'dropin:unwatch-bbox') {
    if (typeof d.subscriptionId === 'number') dropinRemoveWatch(d.subscriptionId);
  }
  else if (d.type === 'dropin:live-style') {
    if (typeof d.id === 'string') dropinSetLiveStyle(d.id, d.declarations);
  }
  else if (d.type === 'dropin:live-clear') {
    if (typeof d.id === 'string') dropinClearLiveStyle(d.id);
  }
  else if (d.type === 'dropin:hover-preview') {
    if (typeof d.id === 'string') dropinHoverPreview(d.id, d.classes);
  }
  else if (d.type === 'dropin:hover-clear') {
    if (typeof d.id === 'string') dropinHoverClear(d.id);
  }
  else if (d.type === 'dropin:flip') {
    if (typeof d.id === 'string' && d.fromRect && typeof d.fromRect === 'object') {
      dropinFlipFromRect(d.id, d.fromRect);
    }
  }
  else if (d.type === 'dropin:get-min-content') {
    var mcResult = null;
    try {
      mcResult = dropinComputeMinContent(d.oid);
    } catch (mcErr) {
      console.warn('[dropin:iframe] min-content query failed', { oid: d.oid, err: String(mcErr) });
    }
    dropinPost({ type: 'dropin:min-content-result', requestId: d.requestId, result: mcResult });
  }
  else if (d.type === 'dropin:get-envelope') {
    var envResult = null;
    try {
      envResult = dropinComputeEnvelope(d.oid);
    } catch (envErr) {
      console.warn('[dropin:iframe] envelope query failed', { oid: d.oid, err: String(envErr) });
    }
    dropinPost({ type: 'dropin:envelope-result', requestId: d.requestId, result: envResult });
  }
  else if (d.type === 'dropin:get-soft-constraints') {
    var scWarnings = null;
    try {
      scWarnings = dropinComputeSoftConstraints(d.oid);
    } catch (scErr) {
      console.warn('[dropin:iframe] soft-constraints query failed', { oid: d.oid, err: String(scErr) });
    }
    dropinPost({ type: 'dropin:soft-constraints-result', requestId: d.requestId, warnings: scWarnings });
  }
  else if (d.type === 'dropin:get-drop-targets') {
    var dtResult = null;
    try {
      // Backward compat: accept both excludeOids (string[], current) and
      // excludeOid (string, older callers / tests). Walker normalises.
      var dtExclude = d.excludeOids || d.excludeOid || [];
      dtResult = dropinComputeDropTargets(dtExclude);
    } catch (dtErr) {
      console.warn('[dropin:iframe] drop-targets query failed', { excludeOids: d.excludeOids, err: String(dtErr) });
    }
    // Walker now returns { targets, ineligible } struct (or null on early
    // bail). Forward both fields; null collapses both arrays at the host.
    var dtTargets = dtResult ? dtResult.targets : null;
    var dtIneligible = dtResult ? dtResult.ineligible : [];
    dropinPost({
      type: 'dropin:drop-targets-result',
      requestId: d.requestId,
      targets: dtTargets,
      ineligible: dtIneligible,
    });
  }
});

// Surface any uncaught error inside the iframe to the host so the main
// Workspace toast can flag it. Without this, runtime errors in HTML-mode
// templates (e.g. bad inline script) are invisible outside devtools.
//
// Audit MED (Domain 1) — JSX mode has its OWN window.error handler in
// buildJsxDoc's outer IIFE that calls showError (which also posts
// dropin:error). Without the mode gate below, every uncaught error
// in JSX mode fired dropin:error TWICE, surfacing as a duplicate
// host toast. HTML mode has no such handler so it stays wired here.
// (Backticks omitted from this docblock per the iframe-runtime
// template-literal trap — see memory: project_ts_template_backtick_trap.)
if (DROPIN_MODE === 'html') {
  window.addEventListener('error', function (ev) {
    try {
      var m = (ev.error && (ev.error.stack || ev.error.message)) || ev.message || 'Runtime error';
      dropinPost({ type: 'dropin:error', message: String(m) });
    } catch (_) {}
  });
  window.addEventListener('unhandledrejection', function (ev) {
    try {
      var reason = ev && ev.reason;
      var m = (reason && (reason.stack || reason.message)) || String(reason || 'Unhandled promise rejection');
      dropinPost({ type: 'dropin:error', message: String(m) });
    } catch (_) {}
  });
}

setTimeout(function () {
  dropinDbg('[dropin:iframe] ready · mode=' + DROPIN_MODE + ' · restoreScroll=' + DROPIN_RESTORE_SCROLL);
  dropinPost({ type: 'dropin:ready', kind: DROPIN_MODE });
  dropinPostTree();
}, 0);
${vibeRuntimeJs()}
`;
}

export function buildPreviewDocument(opts: {
  code: string;
  kind: PreviewKind;
  withTailwind?: boolean;
  restoreScrollY?: number;
}): string {
  const { code, kind, withTailwind = true, restoreScrollY = 0 } = opts;
  return kind === "html"
    ? buildHtmlDoc(code, withTailwind, restoreScrollY)
    : buildJsxDoc(code, withTailwind, restoreScrollY);
}

function buildHtmlDoc(code: string, withTailwind: boolean, restoreScrollY: number): string {
  const alreadyHasTailwind = code.includes("cdn.tailwindcss.com");
  const tailwindTag =
    withTailwind && !alreadyHasTailwind
      ? `<script src="${TAILWIND_CDN}"></script>`
      : "";

  const inspectorStyle = `<style>${INSPECTOR_CSS}</style>`;
  const inspectorScript = `<script>(function(){${inspectorRuntimeJs("html", restoreScrollY)}})();</script>`;
  const fontsLink = `<link rel="stylesheet" href="${FONTS_PRELOAD_URL}" />`;

  // If the user's HTML has a full document structure, inject into it.
  const hasBody = /<\/body>/i.test(code);
  const hasHead = /<head[^>]*>/i.test(code);

  if (hasBody) {
    let result = code;
    if (hasHead) {
      result = result.replace(
        /<head[^>]*>/i,
        (match) => `${match}\n    ${CSP_META}\n    ${tailwindTag}\n    ${fontsLink}\n    ${inspectorStyle}`
      );
    } else {
      // Stick a head before <body>
      result = result.replace(
        /<body[^>]*>/i,
        (match) => `<head>${CSP_META}${tailwindTag}${fontsLink}${inspectorStyle}</head>\n${match}`
      );
    }
    result = result.replace(/<\/body>/i, `${inspectorScript}\n</body>`);
    return result;
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${CSP_META}
${tailwindTag}
${fontsLink}
${inspectorStyle}
</head>
<body>
${code}
${inspectorScript}
</body>
</html>`;
}

// Locate `tailwind.config = { ... }` anywhere in the user code (raw JS or
// inside a template-literal / dangerouslySetInnerHTML string), brace-balance
// to find the end, and return a real <script> tag that runs in the host doc
// before the Tailwind CDN loads. Returns empty string if no config present.
function extractTailwindConfig(code: string): string {
  const idx = code.indexOf("tailwind.config");
  if (idx < 0) return "";
  // Skip past `tailwind.config` and find the `=` then the opening `{`.
  let i = idx + "tailwind.config".length;
  while (i < code.length && /\s/.test(code[i])) i++;
  if (code[i] !== "=") return "";
  i++;
  while (i < code.length && /\s/.test(code[i])) i++;
  if (code[i] !== "{") return "";
  // Balance braces, ignoring those inside strings.
  const start = i;
  let depth = 0;
  let inStr: string | null = null;
  for (; i < code.length; i++) {
    const c = code[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }
  if (depth !== 0) return "";
  let body = code.slice(start, i);
  // If the config came out of a JSX string literal it'll have JS escapes
  // (\n, \", \\). Unescape so the resulting <script> is valid JS.
  if (/\\n|\\"|\\\\/.test(body)) {
    body = body
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\");
  }
  // Set `window.tailwind` PRE-CDN so the play-CDN script reads our extended
  // theme on initial init (rather than after, when @apply directives in
  // <style type="text/tailwindcss"> would already have been processed against
  // the default palette and produced nothing for tokens like text-on-surface).
  // Must run AFTER the CDN script has defined `tailwind` but BEFORE the CDN
  // processes any `<style type="text/tailwindcss">`. Synchronous script tag
  // ordering takes care of that — see buildJsxDoc head ordering.
  //
  // `body` may contain user-controlled string literals (e.g. theme tokens). A
  // literal `</script>` anywhere inside would terminate the host <script> tag
  // mid-config and corrupt every subsequent head node (Tailwind CDN tag,
  // React/ReactDOM, Babel) into raw text. Escape via `<\/script>`: the HTML
  // parser doesn't see `<\` as a tag-end, JS sees `\/` as a literal `/`, so
  // string semantics survive.
  const safeBody = body.replace(/<\/script>/gi, "<\\/script>");
  return `<script>tailwind.config = ${safeBody};</script>`;
}

// Find every `<style type="text/tailwindcss">…</style>` (raw) or
// `<style type="text/tailwindcss" dangerouslySetInnerHTML={{ __html: '…' }} />`
// (JSX) block in the user code, unescape the body, and return them as
// host-side <style type="text/tailwindcss"> tags so Tailwind CDN can process
// the @layer / @apply directives at startup.
function extractTailwindCssStyles(code: string): string {
  const out: string[] = [];
  // JSX form: dangerouslySetInnerHTML on a style with type="text/tailwindcss"
  const jsxRe =
    /<style[^>]*type=["']text\/tailwindcss["'][^>]*dangerouslySetInnerHTML=\{\{\s*__html:\s*(["'`])([\s\S]*?)\1\s*\}\}\s*\/?>/g;
  let m: RegExpExecArray | null;
  while ((m = jsxRe.exec(code))) {
    const quote = m[1];
    let body = m[2];
    if (quote !== "`") {
      body = body
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\n/g, "\n")
        .replace(/\\\\/g, "\\");
    }
    // Same closing-tag-injection guard as extractTailwindConfig: a literal
    // `</style>` inside a CSS string literal would close the host <style>
    // tag prematurely. CSS treats `\/` as an escaped `/` (string semantics
    // unchanged), HTML doesn't see `<\` as a tag-end.
    const safeBody = body.replace(/<\/style>/gi, "<\\/style>");
    out.push(`<style type="text/tailwindcss">${safeBody}</style>`);
  }
  // Raw form (HTML templates embed it directly).
  const rawRe = /<style[^>]*type=["']text\/tailwindcss["'][^>]*>([\s\S]*?)<\/style>/g;
  while ((m = rawRe.exec(code))) {
    out.push(`<style type="text/tailwindcss">${m[1]}</style>`);
  }
  return out.join("\n");
}

function buildJsxDoc(code: string, withTailwind: boolean, restoreScrollY: number): string {
  const safeSrc = escapeUserCode(code);
  // If the user's JSX references the Tailwind CDN with `?plugins=…`, surface
  // those plugins on the host script tag — React renders <script> children
  // but doesn't execute them, so an in-body Tailwind tag with plugins never
  // runs. Without this, templates that lean on `forms`, `container-queries`,
  // `typography`, etc. lose half their utility classes (e.g. aether reads as
  // unstyled because `bg-surface-dim` resolves but layout primitives don't).
  let tailwindUrl = TAILWIND_CDN;
  const pluginsMatch = code.match(/cdn\.tailwindcss\.com\?plugins=([\w,-]+)/);
  if (pluginsMatch) tailwindUrl = `${TAILWIND_CDN}?plugins=${pluginsMatch[1]}`;
  const tailwindTag = withTailwind
    ? `<script src="${tailwindUrl}"></script>`
    : "";
  // Tailwind CDN reads `window.tailwind.config` BEFORE generating utilities,
  // and processes `<style type="text/tailwindcss">` (with @layer / @apply
  // directives) only when they're in the head at CDN-script-load time. Both
  // routinely live inside JSX bodies in HTML-ported templates — but React
  // renders <script> and <style type="text/tailwindcss"> as inert children,
  // so neither runs. Pull both back out of user code and put them in the
  // host head ahead of the CDN tag.
  const tailwindConfigScript = extractTailwindConfig(code);
  const tailwindCssBlocks = extractTailwindCssStyles(code);
  const fontsLink = `<link rel="stylesheet" href="${FONTS_PRELOAD_URL}" />`;
  const referencedPkgs = packagesReferencedInSource(code);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${CSP_META}
${tailwindTag}
${tailwindConfigScript}
${tailwindCssBlocks}
${fontsLink}
<script src="${REACT_URL}"></script>
<script src="${REACT_DOM_URL}"></script>
${buildPackageScriptTags(referencedPkgs)}
<script src="${BABEL_URL}"></script>
${buildPackageSetupScript(referencedPkgs)}
<style>${INSPECTOR_CSS}</style>
</head>
<body>
<div id="root"></div>
<div id="__err"></div>
<script>
(function () {
  var errEl = document.getElementById('__err');
  function showError(e) {
    var msg = (e && (e.stack || e.message)) || String(e) || 'Unknown error';
    errEl.textContent = msg;
    errEl.classList.add('visible');
    // Also tell the host so it can surface a toast / clear selection / etc.
    // The visible console in the iframe covers devtools-open users; the
    // postMessage covers everyone else. parent may not be reachable on very
    // early errors, so we guard the call.
    try {
      if (typeof parent !== 'undefined' && parent !== window) {
        parent.postMessage({ __dropin: true, type: 'dropin:error', message: msg }, '*');
      }
    } catch (_) {}
  }
  window.addEventListener('error', function (ev) { showError(ev.error || ev.message); });
  window.addEventListener('unhandledrejection', function (ev) { showError(ev.reason); });

  // List of npm package names whose imports we'll rewrite to
  // \`var X = window.__pkgs[name]\` instead of stripping. Anything not on this
  // list raises a clear "unsupported import" error rather than producing a
  // silent \`X is undefined\` crash later. Source of truth: SUPPORTED_PKGS in
  // lib/preview.ts. Keep this in sync (it's just the names array).
  var SUPPORTED_PKGS_LIST = ${SUPPORTED_PKG_NAMES_JSON};
  var SUPPORTED_PKGS_SET = {};
  for (var __i = 0; __i < SUPPORTED_PKGS_LIST.length; __i++) {
    SUPPORTED_PKGS_SET[SUPPORTED_PKGS_LIST[__i]] = true;
  }

  // Walk the AST once, classify imports/exports, build a destructure
  // preamble for known imports, accumulate unknown ones for error
  // reporting, and replace the original import/export ranges with
  // length-and-newline-preserving whitespace so the dropin-loc plugin's
  // \`(line - 1)\` offset stays correct.
  //
  // Why Babel parser instead of regex: multi-line imports
  // (\`import {\\n  useState,\\n} from 'react';\`) are common in AI-generated
  // JSX, and the previous single-line regex broke them. Per maniuplation.md
  // gap #1 + gap #5.
  // Legacy regex-based stripper, used as a fallback when Babel.parse isn't
  // exposed (older builds of @babel/standalone, network shenanigans). Only
  // handles imports up to the first semicolon, including multi-line ones
  // (ROADMAP 4.2 #14). Whitespace replacement preserves newlines so the
  // dropin-loc plugin's line numbers stay correct. Keeps the preview alive
  // in degraded mode rather than crashing.
  function legacyStrip(src) {
    return src
      .replace(/^[ \\t]*import[ \\t][\\s\\S]*?;[ \\t]*$/gm, function (m) { return m.replace(/[^\\n]/g, ' '); })
      // Mirror the AST-walker behaviour: replace 'export default ' (15
      // chars) with '__dropinExport=' (15 chars) — length-preserving so
      // line numbers stay aligned. The IIFE wrapper hoists the var at
      // the top and returns it at the bottom, so the assignment is a
      // module-level statement and any \`const styles = ...\` declared
      // AFTER the default export still runs before the component is
      // called. Without this, AI-generated JSX that appends helper
      // consts below the component hits TDZ when rendered.
      .replace(/export[ \\t]+default[ \\t]+/, function (m) { var t = '__dropinExport='; return t + new Array(Math.max(0, m.length - t.length) + 1).join(' '); })
      .replace(/^([ \\t]*)(export[ \\t]+)(?!default\\b)/gm, function (_m, pre, kw) { return pre + new Array(kw.length + 1).join(' '); });
  }

  // Scan source for shadcn/ui imports and build a stub preamble. Used
  // by the legacy regex path so AI-generated JSX that uses <Button>,
  // <Card>, etc. still renders even when Babel.parse isn't available.
  // Matches both single-line and multi-line import statements.
  function buildShadcnStubsFromRegex(src) {
    var parts = [];
    var re = /import\\s*\\{([^}]+)\\}\\s*from\\s*["'](@\\/components\\/ui\\/[^"']+)["']/g;
    var m;
    while ((m = re.exec(src)) !== null) {
      var names = m[1].split(',');
      for (var i = 0; i < names.length; i++) {
        var raw = names[i].trim();
        if (!raw) continue;
        // Handle \`Foo as Bar\` — bind to the local alias.
        var localMatch = raw.match(/(?:\\w+)\\s+as\\s+(\\w+)$/);
        var local = localMatch ? localMatch[1] : raw.replace(/[^\\w].*$/, '');
        if (!local) continue;
        var nameLower = local.toLowerCase();
        var element = 'div';
        if (nameLower === 'button') element = 'button';
        else if (nameLower === 'input') element = 'input';
        else if (nameLower === 'textarea') element = 'textarea';
        else if (nameLower === 'label') element = 'label';
        else if (nameLower === 'select') element = 'select';
        else if (nameLower === 'form') element = 'form';
        parts.push(
          'var ' + local + '=function(p){' +
            'p=p||{};var q={};for(var k in p){' +
              'if(k!=="variant"&&k!=="size"&&k!=="asChild")q[k]=p[k];' +
            '}' +
            'return React.createElement("' + element + '",q,p.children);' +
          '};'
        );
      }
    }
    // \`@/lib/utils\` — cn() className joiner stub.
    var utilsRe = /import\\s*\\{([^}]+)\\}\\s*from\\s*["']@\\/lib\\/utils["']/g;
    while ((m = utilsRe.exec(src)) !== null) {
      var ns = m[1].split(',');
      for (var j = 0; j < ns.length; j++) {
        var nm = ns[j].trim();
        var lm = nm.match(/(?:\\w+)\\s+as\\s+(\\w+)$/);
        var lcl = lm ? lm[1] : nm.replace(/[^\\w].*$/, '');
        if (!lcl) continue;
        parts.push(
          'var ' + lcl + '=function(){var a=[];for(var i=0;i<arguments.length;i++){var v=arguments[i];if(v)a.push(typeof v==="string"?v:Array.isArray(v)?v.filter(Boolean).join(" "):"");}return a.join(" ");};'
        );
      }
    }
    return parts.join('');
  }

  function processModuleSyntax(src) {
    // @babel/standalone exposes its parser at Babel.packages.parser.parse;
    // the top-level Babel.parse alias is NOT part of the documented API and
    // is undefined on the shipped 7.24.x UMD build — so this gate used to be
    // ALWAYS true and every JSX preview silently ran the degraded regex
    // stripper (per-import bindings, multi-line imports, friendly relative/
    // unsupported import errors and exact export math were all dead code).
    // Resolve whichever parser the loaded bundle actually exposes; both
    // accept the same { sourceType, plugins:['jsx'], errorRecovery } options
    // and return nodes with numeric start/end (the edit loop below reads
    // node.start / node.end).
    var babelParse =
      (typeof Babel.parse === 'function') ? Babel.parse :
      (Babel.packages && Babel.packages.parser && typeof Babel.packages.parser.parse === 'function') ? Babel.packages.parser.parse :
      null;
    if (!babelParse) {
      try { console.warn('[dropin:dbg] Babel parser missing — legacy regex fallback active. typeof Babel:', typeof Babel, '· keys:', Object.keys(Babel || {}).join(',')); } catch (e) {}
      return { preamble: buildShadcnStubsFromRegex(src), stripped: legacyStrip(src), unsupported: [], relativeImports: [] };
    }
    var ast;
    try {
      ast = babelParse(src, {
        sourceType: 'module',
        plugins: ['jsx'],
        errorRecovery: true
      });
    } catch (parseErr) {
      // If the source doesn't even parse as a module, return unchanged
      // and let the downstream Babel.transform throw the real syntax
      // error (which is what the user actually wants to see). Every
      // field on the return shape MUST be present — the caller reads
      // .length on each list, so missing fields cascade into the
      // recurring "Cannot read properties of undefined (reading 'length')"
      // trap that masks the real parse error.
      return { preamble: '', stripped: src, unsupported: [], relativeImports: [] };
    }

    var edits = [];           // { start, end, kind: 'whitespace' | 'replace', replacement? }
    var preambleParts = [];
    var unsupported = [];
    var relativeImports = [];
    var seenPkg = {};

    var body = (ast && ast.program && ast.program.body) || [];
    for (var i = 0; i < body.length; i++) {
      var node = body[i];

      if (node.type === 'ImportDeclaration') {
        edits.push({ start: node.start, end: node.end, kind: 'whitespace' });
        var pkg = node.source.value;
        // Side-effect-only import (\`import 'pkg';\`): nothing to bind, skip.
        if (!node.specifiers || node.specifiers.length === 0) continue;

        // Shadcn/ui stub mode — any \`@/components/ui/<name>\` import gets
        // stubbed as HTML-element passthroughs. AI-generated JSX uses
        // shadcn primitives + Tailwind utility classes for all the
        // styling, so the wrapper just needs to render the right HTML
        // element with className/children/onClick etc. passed through.
        // Strips shadcn-only props (variant/size/asChild) so they don't
        // leak into DOM as invalid attributes.
        if (pkg.indexOf('@/components/ui/') === 0) {
          for (var sci = 0; sci < node.specifiers.length; sci++) {
            var ssc = node.specifiers[sci];
            if (ssc.type !== 'ImportSpecifier' && ssc.type !== 'ImportDefaultSpecifier') continue;
            var localName = ssc.local.name;
            var nameLower = (localName || '').toLowerCase();
            var element = 'div';
            if (nameLower === 'button') element = 'button';
            else if (nameLower === 'input') element = 'input';
            else if (nameLower === 'textarea') element = 'textarea';
            else if (nameLower === 'label') element = 'label';
            else if (nameLower === 'select') element = 'select';
            else if (nameLower === 'form') element = 'form';
            preambleParts.push(
              'var ' + localName + '=function(p){' +
                'p=p||{};var q={};for(var k in p){' +
                  'if(k!=="variant"&&k!=="size"&&k!=="asChild")q[k]=p[k];' +
                '}' +
                'return React.createElement("' + element + '",q,p.children);' +
              '};'
            );
          }
          continue;
        }
        // \`@/lib/utils\` — shadcn's \`cn()\` className-merge helper.
        // Minimal stub: filter truthy args and space-join. Doesn't
        // implement tailwind-merge conflict resolution; templates that
        // depend on conflict-resolution semantics will still look right
        // 95% of the time because the LAST class wins via cascade.
        if (pkg === '@/lib/utils') {
          for (var sli = 0; sli < node.specifiers.length; sli++) {
            var sls = node.specifiers[sli];
            if (sls.type !== 'ImportSpecifier' && sls.type !== 'ImportDefaultSpecifier') continue;
            preambleParts.push(
              'var ' + sls.local.name + '=function(){var a=[];for(var i=0;i<arguments.length;i++){var v=arguments[i];if(v)a.push(typeof v==="string"?v:Array.isArray(v)?v.filter(Boolean).join(" "):"");}return a.join(" ");};'
            );
          }
          continue;
        }

        // Relative or absolute path — collect, surface alongside unsupported
        // packages. Earlier behaviour silently stripped these, leading to
        // confusing "Foo is not defined" runtime errors with no hint that
        // the import was eaten. Dropin runs templates as a single self-
        // contained file, so multi-file imports can't be resolved.
        var first = pkg.charAt(0);
        if (first === '.' || first === '/') {
          if (!seenPkg[pkg]) { seenPkg[pkg] = true; relativeImports.push(pkg); }
          continue;
        }
        if (!SUPPORTED_PKGS_SET[pkg]) {
          if (!seenPkg[pkg]) { seenPkg[pkg] = true; unsupported.push(pkg); }
          continue;
        }
        var pkgRef = "window.__pkgs[" + JSON.stringify(pkg) + "]";
        for (var j = 0; j < node.specifiers.length; j++) {
          var s = node.specifiers[j];
          if (s.type === 'ImportDefaultSpecifier') {
            // \`import X from 'pkg'\` → prefer .default (ESM-shaped UMD), else
            // the namespace itself (React UMD pattern: React global IS the
            // module). \`(.default || self)\` works for both shapes.
            preambleParts.push("var " + s.local.name + "=(" + pkgRef + ".default||" + pkgRef + ");");
          } else if (s.type === 'ImportNamespaceSpecifier') {
            // \`import * as X from 'pkg'\` → bind the whole namespace.
            preambleParts.push("var " + s.local.name + "=" + pkgRef + ";");
          } else if (s.type === 'ImportSpecifier') {
            // \`import { foo, bar as baz } from 'pkg'\` → individual named bindings.
            // \`imported\` is an Identifier (foo) or StringLiteral ('foo').
            var imp = (s.imported && (s.imported.name || s.imported.value)) || s.local.name;
            preambleParts.push("var " + s.local.name + "=" + pkgRef + "[" + JSON.stringify(imp) + "];");
          }
        }
        continue;
      }

      if (node.type === 'ExportDefaultDeclaration') {
        // Replace \`export default \` (15 chars) with \`__dropinExport=\`
        // (also 15 chars — length-preserving so loc-plugin line numbers
        // stay correct). The IIFE wrapper hoists \`var __dropinExport;\`
        // at the top and runs \`return __dropinExport;\` at the bottom,
        // so the assignment is a regular module-level statement and the
        // rest of the file (e.g. \`const styles = ...\` declared AFTER
        // the default export) keeps executing instead of being skipped
        // by an early \`return\`. Without this, AI-generated code that
        // appends helper consts below the component hits TDZ when the
        // component renders.
        var keywordEnd = node.declaration.start;
        var keywordLen = keywordEnd - node.start;
        var target = '__dropinExport='; // 15 chars
        var pad = Math.max(0, keywordLen - target.length);
        var replacement = target + new Array(pad + 1).join(' ');
        edits.push({ start: node.start, end: keywordEnd, kind: 'replace', replacement: replacement });
        continue;
      }

      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration) {
          // 'export const X = ...' / 'export function X() {}' — strip just
          // the 'export ' keyword; the declaration itself stays.
          edits.push({ start: node.start, end: node.declaration.start, kind: 'whitespace' });
        } else {
          // 'export { foo, bar }' (no declaration) — strip the whole thing.
          edits.push({ start: node.start, end: node.end, kind: 'whitespace' });
        }
        continue;
      }

      if (node.type === 'ExportAllDeclaration') {
        // 'export * from 'pkg'' — strip whole thing (we don't re-export).
        edits.push({ start: node.start, end: node.end, kind: 'whitespace' });
        continue;
      }
    }

    // Apply edits in reverse so earlier indices stay valid.
    edits.sort(function (a, b) { return b.start - a.start; });
    var out = src;
    for (var k = 0; k < edits.length; k++) {
      var e = edits[k];
      var slice = out.slice(e.start, e.end);
      var rep;
      if (e.kind === 'whitespace') {
        // Replace every non-newline char with space — preserves both byte
        // length and line count, so the dropin-loc plugin's loc → user-source
        // line mapping ('line - 1') keeps working.
        rep = slice.replace(/[^\\n]/g, ' ');
      } else {
        rep = e.replacement;
      }
      out = out.slice(0, e.start) + rep + out.slice(e.end);
    }

    return {
      preamble: preambleParts.join(''),
      stripped: out,
      unsupported: unsupported,
      relativeImports: relativeImports
    };
  }

  try {
    // Register the loc-injecting Babel plugin. Babel reports 1-based lines
    // against the wrapped source ("(function(){PREAMBLE\\n" + userSrc + "\\n})()"),
    // so subtract 1 to get user-source line numbers. The preamble lives on
    // the SAME line as "(function(){" so it doesn't shift line numbers.
    Babel.registerPlugin('dropin-loc', function (api) {
      var t = api.types;
      return {
        visitor: {
          JSXElement: function (path) {
            var el = path.node;
            if (!el.loc) return;
            var opening = el.openingElement;
            if (!opening || !opening.loc) return;
            for (var i = 0; i < opening.attributes.length; i++) {
              var a = opening.attributes[i];
              if (a.type === 'JSXAttribute' && a.name && a.name.type === 'JSXIdentifier' && a.name.name === 'data-dropin-loc') return;
            }
            var value =
              (el.loc.start.line - 1) + ':' + el.loc.start.column + ':' +
              (el.loc.end.line - 1) + ':' + el.loc.end.column + ':' +
              (opening.loc.end.line - 1) + ':' + opening.loc.end.column;
            opening.attributes.push(
              t.jSXAttribute(
                t.jSXIdentifier('data-dropin-loc'),
                t.stringLiteral(value)
              )
            );
          }
        }
      };
    });

    var src = ${safeSrc};
    var processed;
    try {
      processed = processModuleSyntax(src);
    } catch (walkErr) {
      // Safety net for the now-live import-walker (its Babel parser resolved
      // to undefined for a long time, so this AST path is freshly activated):
      // any unexpected node shape degrades to the proven regex stripper
      // instead of throwing a cryptic error into the user's preview.
      try { console.warn('[dropin:dbg] processModuleSyntax threw — legacy regex fallback:', walkErr && walkErr.message); } catch (e2) {}
      processed = { preamble: buildShadcnStubsFromRegex(src), stripped: legacyStrip(src), unsupported: [], relativeImports: [] };
    }

    if (processed.unsupported.length) {
      // Detect shadcn/ui (\`@/components/ui/*\`) and other project-local
      // aliases up front — those crash with the same "X is not defined"
      // pattern AI-generated code is famous for, and the generic
      // "Unsupported imports" message buries the real fix (replace
      // <Button> with a styled <button>, etc.). Surface a targeted hint.
      var aliased = [];
      var others = [];
      for (var u = 0; u < processed.unsupported.length; u++) {
        var name = processed.unsupported[u];
        if (name.charAt(0) === '@' && name.indexOf('/') > 0) aliased.push(name);
        else others.push(name);
      }
      var msg = 'Unsupported imports in playground:\\n  ' + processed.unsupported.join(', ');
      if (aliased.length) {
        msg += '\\n\\nThese look like project-local aliases (\`@/components/ui/*\` is shadcn/ui, \`@/lib/...\` is your own code). Drop In runs the file as a single self-contained preview, so it cannot resolve them.\\n\\nQuick fix: replace shadcn components (<Button>, <Card>, etc.) with styled native HTML elements (<button className="...">), or inline the helper from your project.';
      }
      msg += '\\n\\nSupported packages: ' + SUPPORTED_PKGS_LIST.join(', ');
      msg += '\\n\\nESM-only packages (lucide-react ESM build, framer-motion, @radix-ui/*, @heroicons/react, etc.) are deferred to a v2 esm.sh fallback. To request a UMD-shippable package be added, see maniuplation.md gap #5.';
      throw new Error(msg);
    }

    if (processed.relativeImports.length) {
      throw new Error(
        'Relative imports not supported in playground:\\n  ' + processed.relativeImports.join(', ') +
        '\\n\\nDropin runs templates as a single self-contained file. Inline the imported module(s) into the same file, or merge their exports into the main component.'
      );
    }

    // Defensive React hook bindings — every JSX preview gets these
    // unconditionally, BEFORE the import-walker's per-import preamble.
    // Belt-and-braces for two situations:
    //   1. AI-generated code that uses \`useRef()\` directly without
    //      importing it (rare but happens with some prompts).
    //   2. The import walker missing a binding because Babel.parse hit
    //      a recoverable error on an aliased path (e.g. @/components/ui/*)
    //      and didn't fully populate the import node.
    // Re-declaring \`var useRef = ...\` after a per-import \`var useRef = ...\`
    // is legal (same scope, same binding target) so this doesn't conflict
    // with the existing path.
    var DEFAULT_HOOKS_PREAMBLE =
      'var useState=React.useState,useEffect=React.useEffect,' +
      'useRef=React.useRef,useCallback=React.useCallback,' +
      'useMemo=React.useMemo,useReducer=React.useReducer,' +
      'useContext=React.useContext,useLayoutEffect=React.useLayoutEffect,' +
      'useImperativeHandle=React.useImperativeHandle,useDebugValue=React.useDebugValue,' +
      'useId=React.useId,useTransition=React.useTransition,' +
      'useDeferredValue=React.useDeferredValue,useSyncExternalStore=React.useSyncExternalStore,' +
      'useInsertionEffect=React.useInsertionEffect,Fragment=React.Fragment,' +
      'createContext=React.createContext,createRef=React.createRef,' +
      'forwardRef=React.forwardRef,memo=React.memo,Suspense=React.Suspense,lazy=React.lazy;';

    // Preamble lives inline with "(function(){" so user-source line offsets
    // are unchanged — the loc plugin's "(line - 1)" offset still maps Babel
    // line N+1 → user-source line N regardless of preamble length.
    //
    // \`var __dropinExport;\` is hoisted at the top so the export-default
    // walker can assign into it as a regular statement (instead of
    // emitting an early \`return\`). The trailing \`return __dropinExport;\`
    // runs AFTER all module-level code (including helper \`const\`s
    // declared below the component, which would otherwise hit TDZ when
    // the component renders).
    var EXPORT_HOIST = 'var __dropinExport;';
    var EXPORT_RETURN = '\\nreturn __dropinExport;';
    var wrapped =
      '(function(){' +
      EXPORT_HOIST +
      DEFAULT_HOOKS_PREAMBLE +
      processed.preamble +
      '\\n' + processed.stripped +
      EXPORT_RETURN +
      '\\n})()';

    var compiled = Babel.transform(wrapped, {
      presets: ['react'],
      plugins: ['dropin-loc'],
      filename: 'preview.jsx',
      sourceType: 'script'
    }).code;

    var Component = new Function('React', 'ReactDOM', 'return ' + compiled)(React, ReactDOM);
    if (typeof Component !== 'function') {
      throw new Error('Template must export default a React component (function).');
    }
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Component));

    // React renders <script> tags as inert DOM nodes — the browser only runs
    // scripts parsed from the original HTML. Templates ship Lucide/Alpine UMDs
    // and inline init blocks (e.g. 'lucide.createIcons()') that the icons
    // depend on. After mount, walk the rendered tree and re-emit each <script>
    // as a real one: externals first (sequentially, so dependents see them
    // loaded), inlines after. Skip <script type="text/plain"> — those are the
    // tailwind-config / config-style markers we already pulled into the head.
    setTimeout(function () {
      try {
        var found = document.querySelectorAll('#root script');
        if (!found.length) return;
        var externals = [];
        var inlines = [];
        for (var i = 0; i < found.length; i++) {
          var s = found[i];
          var t = (s.getAttribute('type') || '').toLowerCase();
          if (t === 'text/plain' || t === 'text/tailwindcss') continue;
          if (s.getAttribute('src')) externals.push(s); else inlines.push(s);
        }
        function clone(s) {
          var n = document.createElement('script');
          for (var j = 0; j < s.attributes.length; j++) n.setAttribute(s.attributes[j].name, s.attributes[j].value);
          if (!s.getAttribute('src')) n.text = s.textContent || '';
          return n;
        }
        function runInlines() {
          for (var k = 0; k < inlines.length; k++) document.body.appendChild(clone(inlines[k]));
        }
        if (!externals.length) { runInlines(); return; }
        var remaining = externals.length;
        function next() { if (--remaining === 0) runInlines(); }
        for (var m = 0; m < externals.length; m++) {
          var n = clone(externals[m]);
          n.onload = next;
          n.onerror = next;
          document.body.appendChild(n);
        }
      } catch (re) {
        // Init failure shouldn't blank the preview.
        try { console.warn('[dropin] re-run scripts failed', re); } catch (_) {}
      }
    }, 0);
  } catch (e) {
    showError(e);
  }

  ${inspectorRuntimeJs("jsx", restoreScrollY)}
})();
</script>
</body>
</html>`;
}
