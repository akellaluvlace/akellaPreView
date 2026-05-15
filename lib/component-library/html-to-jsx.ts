// Browser-safe HTML → JSX converter. The Node-side `scripts/html-to-jsx.mjs`
// uses Babel; this one is a tiny DOM walker so we don't have to ship
// `@babel/standalone` to the client just to transform a 100-line snippet on
// insert. The corner cases we handle:
//
//   class       → className
//   for         → htmlFor
//   tabindex    → tabIndex (+ camelCase for all hyphenated attrs on SVG/etc.)
//   style="…"   → style={{ … }} object literal
//   <br>, <img> → self-closing
//   event attrs → stripped (onClick="foo()" is a string, not a handler, and
//                 injecting a JSX onClick would reference an unbound fn;
//                 safer to drop and let the user wire it up themselves)
//
// Not handled (by design): expression interpolation, control flow, multi-root
// fragments. This is a snippet-to-snippet converter, not a full parser.

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

// Attribute names that must stay lowercase (aria-*, data-*) vs. those React
// expects camelCase for. We camelCase everything except those prefixes.
const PRESERVE_PREFIXES = ["aria-", "data-"];

// SVG element names that React requires in camelCase. The HTML parser
// lowercases everything (`<linearGradient>` → `lineargradient` tagName),
// so we recase on the way out. Without this, React renders the element
// as unknown HTML (not SVG) and the visual breaks silently. Names below
// are React's canonical SVG element list (per react-dom/src/shared/
// DOMProperty + the React SVG docs). Lowercase key → camelCase value.
const SVG_TAG_MAP: Record<string, string> = {
  animatemotion: "animateMotion",
  animatetransform: "animateTransform",
  clippath: "clipPath",
  feblend: "feBlend",
  fecolormatrix: "feColorMatrix",
  fecomponenttransfer: "feComponentTransfer",
  fecomposite: "feComposite",
  feconvolvematrix: "feConvolveMatrix",
  fediffuselighting: "feDiffuseLighting",
  fedisplacementmap: "feDisplacementMap",
  fedistantlight: "feDistantLight",
  fedropshadow: "feDropShadow",
  feflood: "feFlood",
  fefunca: "feFuncA",
  fefuncb: "feFuncB",
  fefuncg: "feFuncG",
  fefuncr: "feFuncR",
  fegaussianblur: "feGaussianBlur",
  feimage: "feImage",
  femerge: "feMerge",
  femergenode: "feMergeNode",
  femorphology: "feMorphology",
  feoffset: "feOffset",
  fepointlight: "fePointLight",
  fespecularlighting: "feSpecularLighting",
  fespotlight: "feSpotLight",
  fetile: "feTile",
  feturbulence: "feTurbulence",
  foreignobject: "foreignObject",
  lineargradient: "linearGradient",
  radialgradient: "radialGradient",
  textpath: "textPath",
};

// SVG attributes React requires in camelCase. `viewbox` → `viewBox`,
// `preserveaspectratio` → `preserveAspectRatio`, etc. Without these,
// React passes them through as DOM attributes and the SVG renders
// without the constraint (e.g. wrong aspect, wrong gradient stops).
// Lowercase key → React canonical name.
const SVG_ATTR_MAP: Record<string, string> = {
  viewbox: "viewBox",
  preserveaspectratio: "preserveAspectRatio",
  gradientunits: "gradientUnits",
  gradienttransform: "gradientTransform",
  patternunits: "patternUnits",
  patterntransform: "patternTransform",
  patterncontentunits: "patternContentUnits",
  spreadmethod: "spreadMethod",
  pathlength: "pathLength",
  clippath: "clipPath",
  clippathunits: "clipPathUnits",
  clipruleerror: "clipRule",
  maskunits: "maskUnits",
  maskcontentunits: "maskContentUnits",
  markerend: "markerEnd",
  markermid: "markerMid",
  markerstart: "markerStart",
  markerheight: "markerHeight",
  markerwidth: "markerWidth",
  markerunits: "markerUnits",
  refx: "refX",
  refy: "refY",
  textlength: "textLength",
  lengthadjust: "lengthAdjust",
  filterunits: "filterUnits",
  primitiveunits: "primitiveUnits",
  basefrequency: "baseFrequency",
  baseprofile: "baseProfile",
  numoctaves: "numOctaves",
  stitchtiles: "stitchTiles",
  surfacescale: "surfaceScale",
  edgemode: "edgeMode",
  kernelmatrix: "kernelMatrix",
  kernelunitlength: "kernelUnitLength",
  diffuseconstant: "diffuseConstant",
  specularconstant: "specularConstant",
  specularexponent: "specularExponent",
  limitingconeangle: "limitingConeAngle",
  pointsatx: "pointsAtX",
  pointsaty: "pointsAtY",
  pointsatz: "pointsAtZ",
  startoffset: "startOffset",
  attributename: "attributeName",
  attributetype: "attributeType",
  begin: "begin",
  calcmode: "calcMode",
  keytimes: "keyTimes",
  keysplines: "keySplines",
  keypoints: "keyPoints",
  repeatcount: "repeatCount",
  repeatdur: "repeatDur",
  fillrule: "fillRule",
  strokewidth: "strokeWidth",
  strokelinecap: "strokeLinecap",
  strokelinejoin: "strokeLinejoin",
  strokemiterlimit: "strokeMiterlimit",
  strokeopacity: "strokeOpacity",
  strokedasharray: "strokeDasharray",
  strokedashoffset: "strokeDashoffset",
  stopcolor: "stopColor",
  stopopacity: "stopOpacity",
  floodcolor: "floodColor",
  floodopacity: "floodOpacity",
  textanchor: "textAnchor",
  dominantbaseline: "dominantBaseline",
  fontfamily: "fontFamily",
  fontsize: "fontSize",
  fontweight: "fontWeight",
};

// React's canonical name map. If an attribute isn't in here, we fall back to
// hyphen-to-camelCase conversion which covers the bulk of SVG attributes.
const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  srcset: "srcSet",
  crossorigin: "crossOrigin",
  usemap: "useMap",
  colspan: "colSpan",
  rowspan: "rowSpan",
  enctype: "encType",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  novalidate: "noValidate",
  hreflang: "hrefLang",
  accesskey: "accessKey",
  allowfullscreen: "allowFullScreen",
};

function camelize(s: string): string {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function mapAttrName(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.startsWith("on")) return null; // strip event handlers
  if (PRESERVE_PREFIXES.some((p) => lower.startsWith(p))) return lower;
  if (ATTR_MAP[lower]) return ATTR_MAP[lower];
  // SVG attrs needing specific camelCase (viewBox, preserveAspectRatio,
  // stopColor, etc.). React doesn't auto-recase these — passes the lower
  // form to the DOM where SVG ignores it. Check the map BEFORE the
  // hyphen fallback so a hypothetical `stop-color` source still hits
  // the SVG canonical name via the lowercased `stopcolor` lookup.
  if (SVG_ATTR_MAP[lower]) return SVG_ATTR_MAP[lower];
  // Colon-namespaced SVG/XML attrs: `xmlns:xlink`, `xml:space`,
  // `xlink:href`. JSX disallows colons in attribute names — convert
  // `ns:name` → `nsName` (camelCase). React maps a fixed set of these
  // to the DOM-correct namespaced attr at render (xmlnsXlink, xmlSpace,
  // xlinkHref are all recognized).
  if (lower.includes(":")) {
    return lower.replace(/:([a-z])/g, (_, c: string) => c.toUpperCase());
  }
  if (lower.includes("-")) return camelize(lower);
  return lower;
}

function parseInlineStyle(style: string): string {
  // Parse CSS declarations into a style object literal. Values stay as
  // string literals (except numeric pixel values React accepts as numbers —
  // we leave that up to the user). Comments and malformed decls are dropped.
  const out: string[] = [];
  for (const decl of style.split(";")) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx <= 0) continue;
    const propRaw = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!value) continue;
    // `--custom-prop` stays hyphenated as a string key (React supports this).
    const prop = propRaw.startsWith("--") ? `"${propRaw}"` : camelize(propRaw);
    // Escape the value for a JS string literal.
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
    out.push(`${prop}: "${escaped}"`);
  }
  return `{ ${out.join(", ")} }`;
}

function attrsToJsx(attrs: NamedNodeMap): string {
  const parts: string[] = [];
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    const jsxName = mapAttrName(attr.name);
    if (!jsxName) continue;
    const value = attr.value;
    if (attr.name.toLowerCase() === "style") {
      parts.push(`style={${parseInlineStyle(value)}}`);
      continue;
    }
    // Boolean attributes (checked="" / disabled="") render as `prop` (implicit
    // true) in HTML but React wants `prop={true}` or a string value.
    if (value === "" && /^(checked|disabled|readonly|required|hidden|multiple|selected|open|autofocus)$/i.test(attr.name)) {
      parts.push(jsxName);
      continue;
    }
    const escaped = value.replace(/"/g, "&quot;");
    parts.push(`${jsxName}="${escaped}"`);
  }
  return parts.length ? " " + parts.join(" ") : "";
}

function escapeText(text: string): string {
  // JSX text mostly passes through, but curly braces must be escaped since
  // they start expression syntax. `>` is a convenience.
  return text.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}

function nodeToJsx(node: Node, indent: number): string {
  const pad = " ".repeat(indent);

  if (node.nodeType === 3 /* text */) {
    const text = (node as Text).data;
    if (!text.trim()) return text.includes("\n") ? "" : text;
    return escapeText(text);
  }

  if (node.nodeType === 8 /* comment */) {
    const data = (node as Comment).data.replace(/\*\//g, "*​/");
    return `${pad}{/*${data}*/}`;
  }

  if (node.nodeType !== 1) return "";
  const el = node as Element;
  const lowerTag = el.tagName.toLowerCase();
  // SVG element names that React requires in camelCase. HTML parsers
  // lowercase all tags, so `<linearGradient>` arrives as tagName
  // "LINEARGRADIENT". Without this recase React renders the element
  // as an unknown HTML tag instead of an SVG element — gradients
  // disappear, masks no-op, animations silently fail.
  const tag = SVG_TAG_MAP[lowerTag] ?? lowerTag;
  const attrStr = attrsToJsx(el.attributes);

  if (VOID_ELEMENTS.has(lowerTag)) {
    return `${pad}<${tag}${attrStr} />`;
  }

  const children: string[] = [];
  for (const child of Array.from(el.childNodes)) {
    const rendered = nodeToJsx(child, indent + 2);
    if (rendered === "") continue;
    children.push(rendered);
  }

  if (!children.length) {
    return `${pad}<${tag}${attrStr}></${tag}>`;
  }

  // Inline single text child — cleaner output.
  if (children.length === 1 && el.childNodes.length === 1 && el.firstChild?.nodeType === 3) {
    return `${pad}<${tag}${attrStr}>${children[0].trimStart()}</${tag}>`;
  }

  return `${pad}<${tag}${attrStr}>\n${children.join("\n")}\n${pad}</${tag}>`;
}

// Public: convert a fragment of HTML into JSX. Single-root output. If the
// input has multiple top-level elements we wrap in a fragment `<>…</>`.
export function htmlToJsx(html: string): string {
  if (typeof DOMParser === "undefined") {
    throw new Error("htmlToJsx must run in a browser — DOMParser required");
  }
  const doc = new DOMParser().parseFromString(
    `<body>${html}</body>`,
    "text/html"
  );
  const roots = Array.from(doc.body.childNodes).filter(
    (n) => n.nodeType !== 3 || (n as Text).data.trim().length > 0
  );
  if (roots.length === 0) return "";
  if (roots.length === 1) return nodeToJsx(roots[0], 0).trimStart();
  const inner = roots.map((n) => nodeToJsx(n, 2)).join("\n");
  return `<>\n${inner}\n</>`;
}
