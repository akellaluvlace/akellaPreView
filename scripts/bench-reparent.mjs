// Ad-hoc smoke test for `lib/ast/operations/reparent.ts applyReparent`.
// Inlines the module so the script runs without a TS build step.
// Mirrors the layout of `bench-reorder.mjs` / `bench-style.mjs`.
//
// Run from repo root: `node scripts/bench-reparent.mjs`. A regression
// here would silently break Phase 3's reparent gesture (drag element
// across parent boundary → drop → applyReparent commit).

import { parse } from "@babel/parser";
import MagicString from "magic-string";

const OID_ATTR = "data-dropin-id";
const PARSE_OPTS = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

const SKIP_KEYS = new Set([
  "loc",
  "tokens",
  "comments",
  "extra",
  "start",
  "end",
  "leadingComments",
  "trailingComments",
]);

function getOidFromAttrs(attrs) {
  for (const a of attrs || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === OID_ATTR &&
      a.value?.type === "StringLiteral"
    ) {
      return a.value.value;
    }
  }
  return null;
}

function buildParentMap(ast) {
  const map = new Map();
  function walk(node, parentJsx) {
    if (!node || typeof node !== "object") return;
    if (node.type === "JSXElement") {
      map.set(node, parentJsx);
      parentJsx = node;
    }
    for (const key in node) {
      if (SKIP_KEYS.has(key)) continue;
      const child = node[key];
      if (Array.isArray(child)) for (const c of child) walk(c, parentJsx);
      else if (child && typeof child === "object" && child.type) walk(child, parentJsx);
    }
  }
  walk(ast, null);
  return map;
}

function findJsxElementByOid(node, oid) {
  if (!node || typeof node !== "object") return null;
  if (node.type === "JSXElement") {
    const got = getOidFromAttrs(node.openingElement?.attributes || []);
    if (got === oid) return node;
  }
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        const r = findJsxElementByOid(c, oid);
        if (r) return r;
      }
    } else if (child && typeof child === "object" && child.type) {
      const r = findJsxElementByOid(child, oid);
      if (r) return r;
    }
  }
  return null;
}

function isWithin(target, candidate) {
  if (!target || !candidate) return false;
  if (target === candidate) return true;
  if (typeof target.start !== "number" || typeof target.end !== "number") return false;
  if (typeof candidate.start !== "number" || typeof candidate.end !== "number") return false;
  return candidate.start >= target.start && candidate.end <= target.end;
}

function classifyChildren(parent) {
  const children = parent.children || [];
  const real = [];
  for (const c of children) {
    if (c.type === "JSXText") {
      if (typeof c.value === "string" && c.value.trim() === "") continue;
      return { ok: false, reason: "parent has non-whitespace text content — reparent not supported" };
    }
    if (c.type !== "JSXElement") {
      return { ok: false, reason: `parent has non-element child (${c.type}) — reparent not supported in v1` };
    }
    if (typeof c.start !== "number" || typeof c.end !== "number") {
      return { ok: false, reason: "child element missing position info" };
    }
    const oid = getOidFromAttrs(c.openingElement?.attributes || []);
    real.push({ oid, start: c.start, end: c.end });
  }
  return { ok: true, real };
}

function applyStyleProps(source, op) {
  // Minimal duplicate of `lib/ast/operations/style.ts` for the cleanup
  // pass in reparent. We only support write/remove on existing or
  // missing style attribute. Bail rules match the real engine.
  const decls = Object.entries(op.declarations).filter(([, v]) => v !== undefined);
  if (decls.length === 0) return { source, unchanged: true, reason: null };
  let ast;
  try { ast = parse(source, PARSE_OPTS); } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }
  let target = null;
  function walkOpenings(n) {
    if (!n || typeof n !== "object" || target) return;
    if (n.type === "JSXOpeningElement") {
      for (const a of n.attributes || []) {
        if (a?.type === "JSXAttribute" && a.name?.name === OID_ATTR && a.value?.value === op.oid) {
          target = n;
          return;
        }
      }
    }
    for (const k in n) {
      if (SKIP_KEYS.has(k)) continue;
      const c = n[k];
      if (Array.isArray(c)) for (const cc of c) walkOpenings(cc);
      else if (c && typeof c === "object" && c.type) walkOpenings(c);
    }
  }
  walkOpenings(ast);
  if (!target) return { source, unchanged: true, reason: `oid "${op.oid}" not found` };

  const s = new MagicString(source);
  const styleAttr = (target.attributes || []).find(
    (a) => a?.type === "JSXAttribute" && a.name?.name === "style"
  );
  const writes = [];
  const removes = [];
  for (const [k, v] of decls) {
    if (v === null) removes.push(k);
    else writes.push([k, v]);
  }
  if (!styleAttr) {
    if (writes.length === 0) return { source, unchanged: true, reason: null };
    const attrs = target.attributes || [];
    const insertPos = attrs.length > 0 ? attrs[attrs.length - 1].end : target.name?.end;
    const props = writes.map(([k, v]) => `${k}: '${v}'`);
    s.appendLeft(insertPos, ` style={{ ${props.join(", ")} }}`);
    return { source: s.toString(), unchanged: false, reason: null };
  }
  const value = styleAttr.value;
  if (!value || value.type !== "JSXExpressionContainer") {
    return { source, unchanged: true, reason: "non-object style" };
  }
  const expr = value.expression;
  if (!expr || expr.type !== "ObjectExpression") {
    return { source, unchanged: true, reason: "non-object expr" };
  }
  const wantedNames = new Set([...writes.map(([n]) => n), ...removes]);
  const existingMap = new Map();
  for (const p of expr.properties || []) {
    if (p?.type !== "ObjectProperty") continue;
    let name = null;
    if (p.key?.type === "Identifier") name = p.key.name;
    else if (p.key?.type === "StringLiteral") name = p.key.value;
    if (!name || !wantedNames.has(name)) continue;
    existingMap.set(name, { start: p.start, end: p.end, valueStart: p.value.start, valueEnd: p.value.end });
  }
  const toAppend = [];
  for (const [k, v] of writes) {
    const ex = existingMap.get(k);
    if (ex) s.overwrite(ex.valueStart, ex.valueEnd, `'${v}'`);
    else toAppend.push([k, v]);
  }
  const propsArr = expr.properties || [];
  const removedStarts = new Set();
  for (const k of removes) {
    const ex = existingMap.get(k);
    if (ex) removedStarts.add(ex.start);
  }
  const remaining = propsArr.filter((p) => !removedStarts.has(p?.start));
  if (remaining.length === 0 && propsArr.length > 0) {
    const inner = toAppend.length > 0 ? " " + toAppend.map(([k,v]) => `${k}: '${v}'`).join(", ") + " " : "";
    s.overwrite(expr.start + 1, expr.end - 1, inner);
    return { source: s.toString(), unchanged: false, reason: null };
  }
  const sorted = [];
  for (const k of removes) {
    const ex = existingMap.get(k);
    if (ex) sorted.push(ex);
  }
  sorted.sort((a, b) => b.start - a.start);
  for (const ep of sorted) {
    const idx = propsArr.findIndex((p) => p?.start === ep.start);
    let rs = ep.start, re = ep.end;
    if (idx !== -1 && idx < propsArr.length - 1) re = propsArr[idx + 1].start;
    else if (idx > 0) rs = propsArr[idx - 1].end;
    s.remove(rs, re);
  }
  if (toAppend.length > 0) {
    if (remaining.length > 0) {
      const last = remaining[remaining.length - 1];
      const text = toAppend.map(([k,v]) => `, ${k}: '${v}'`).join("");
      s.appendLeft(last.end, text);
    } else {
      const text = " " + toAppend.map(([k,v]) => `${k}: '${v}'`).join(", ") + " ";
      s.appendLeft(expr.start + 1, text);
    }
  }
  return { source: s.toString(), unchanged: false, reason: null };
}

function applyReparent(source, op) {
  let ast;
  try { ast = parse(source, PARSE_OPTS); } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }
  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) return { source, unchanged: true, reason: `oid "${op.oid}" not found` };
  const newParent = findJsxElementByOid(ast, op.newParentOid);
  if (!newParent) return { source, unchanged: true, reason: `newParent oid "${op.newParentOid}" not found` };
  if (newParent.openingElement?.selfClosing || !newParent.closingElement) {
    return { source, unchanged: true, reason: "newParent is self-closing — cannot accept children" };
  }
  if (isWithin(srcEl, newParent)) {
    return { source, unchanged: true, reason: "newParent is the moved element or its descendant — cycle" };
  }
  const parentMap = buildParentMap(ast);
  const oldParent = parentMap.get(srcEl) ?? null;
  if (!oldParent) return { source, unchanged: true, reason: "moved element has no JSX parent (top-level)" };
  if (oldParent === newParent) {
    return { source, unchanged: true, reason: "newParent === oldParent — use reorder, not reparent" };
  }
  const oldClass = classifyChildren(oldParent);
  if (!oldClass.ok) return { source, unchanged: true, reason: `old parent: ${oldClass.reason}` };
  const newClass = classifyChildren(newParent);
  if (!newClass.ok) return { source, unchanged: true, reason: `new parent: ${newClass.reason}` };
  if (op.insertIndex < 0 || op.insertIndex > newClass.real.length) {
    return { source, unchanged: true, reason: `insertIndex ${op.insertIndex} out of range [0, ${newClass.real.length}]` };
  }
  const srcIdx = oldClass.real.findIndex((rc) => rc.oid === op.oid);
  if (srcIdx === -1) {
    return { source, unchanged: true, reason: "moved element not found among old parent's real children" };
  }

  const oldOpeningEnd = oldParent.openingElement.end;
  const newOpeningEnd = newParent.openingElement.end;
  const elText = source.slice(srcEl.start, srcEl.end);

  const detachStart = srcIdx === 0 ? oldOpeningEnd : oldClass.real[srcIdx - 1].end;
  const detachEnd = srcEl.end;

  let insertPos, indent;
  if (newClass.real.length === 0) {
    insertPos = newOpeningEnd;
    indent = "\n  ";
  } else if (op.insertIndex === 0) {
    insertPos = newOpeningEnd;
    indent = source.slice(newOpeningEnd, newClass.real[0].start);
  } else if (op.insertIndex === newClass.real.length) {
    insertPos = newClass.real[newClass.real.length - 1].end;
    const lastIdx = newClass.real.length - 1;
    const before = lastIdx === 0 ? newOpeningEnd : newClass.real[lastIdx - 1].end;
    indent = source.slice(before, newClass.real[lastIdx].start);
  } else {
    insertPos = newClass.real[op.insertIndex - 1].end;
    indent = source.slice(newClass.real[op.insertIndex - 1].end, newClass.real[op.insertIndex].start);
  }
  const insertText = indent + elText;

  const s = new MagicString(source);
  s.remove(detachStart, detachEnd);
  s.appendLeft(insertPos, insertText);
  let out = s.toString();

  const removes = op.propsToRemove ?? [];
  const sets = op.propsToSet ?? {};
  if (removes.length > 0 || Object.keys(sets).length > 0) {
    const decls = {};
    for (const k of removes) decls[k] = null;
    for (const [k, v] of Object.entries(sets)) decls[k] = v;
    const cleaned = applyStyleProps(out, { oid: op.oid, declarations: decls });
    if (!cleaned.unchanged) out = cleaned.source;
  }

  return { source: out, unchanged: false, reason: null };
}

// ---------- harness ----------
let pass = 0, fail = 0;
function test(name, source, op, expected) {
  const r = applyReparent(source, op);
  const got = r.unchanged ? `unchanged${r.reason ? `(${r.reason})` : ""}` : r.source;
  let ok;
  if (typeof expected === "string") ok = !r.unchanged && r.source === expected;
  else ok = r.unchanged === expected.unchanged;
  if (ok) {
    pass++;
    console.log(`PASS: ${name}`);
    if (!r.unchanged) console.log(`  → ${JSON.stringify(r.source)}`);
    else if (r.reason) console.log(`  → unchanged (${r.reason})`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  got:      ${JSON.stringify(got)}`);
  }
}

const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";
const D = "dddddddd";
const X = "xxxxxxxx";
const Y = "yyyyyyyy";
const ROOT = "rrrrrrrr";

// 1. Move A from X to Y at index 0 (Y empty)
test(
  "move A from X to empty Y",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
  <a data-dropin-id="${A}"/></section>
</div>`
);

// 2. Move A from X to Y where Y has children, insert at index 0 (front)
test(
  "move A to Y at front",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
  </section>
  <section data-dropin-id="${Y}">
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
</div>`
);

// 3. Move and append (insertIndex = N)
test(
  "move A to Y at end",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
  </section>
  <section data-dropin-id="${Y}">
    <b data-dropin-id="${B}"/>
  </section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 1 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
    <b data-dropin-id="${B}"/>
    <a data-dropin-id="${A}"/>
  </section>
</div>`
);

// 4. Move into the middle (insertIndex = 1)
test(
  "move A to Y at middle",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
  </section>
  <section data-dropin-id="${Y}">
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 1 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
    <b data-dropin-id="${B}"/>
    <a data-dropin-id="${A}"/>
    <c data-dropin-id="${C}"/>
  </section>
</div>`
);

// 5. Bail: newParent is descendant of source
test(
  "bail when newParent is descendant of source",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${A}">
    <article data-dropin-id="${B}">
      <p data-dropin-id="${C}"/>
    </article>
  </section>
</div>`,
  { oid: A, newParentOid: B, insertIndex: 0 },
  { unchanged: true }
);

// 6. Bail: newParent === oldParent
test(
  "bail when newParent === oldParent (use reorder)",
  `<div data-dropin-id="${X}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A, newParentOid: X, insertIndex: 1 },
  { unchanged: true }
);

// 7. Bail: newParent self-closing
test(
  "bail when newParent self-closing",
  `<div data-dropin-id="${ROOT}">
  <a data-dropin-id="${A}"/>
  <img data-dropin-id="${Y}"/>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0 },
  { unchanged: true }
);

// 8. Bail: source not found
test(
  "bail when source oid not found",
  `<div data-dropin-id="${X}"><b data-dropin-id="${B}"/></div>`,
  { oid: "zzzzzzzz", newParentOid: X, insertIndex: 0 },
  { unchanged: true }
);

// 9. Bail: newParent not found
test(
  "bail when newParent oid not found",
  `<div data-dropin-id="${X}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, newParentOid: "zzzzzzzz", insertIndex: 0 },
  { unchanged: true }
);

// 10. Bail: insertIndex out of range (too high)
test(
  "bail when insertIndex too high",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}"><a data-dropin-id="${A}"/></section>
  <section data-dropin-id="${Y}"><b data-dropin-id="${B}"/></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 5 },
  { unchanged: true }
);

// 11. Bail: insertIndex negative
test(
  "bail when insertIndex negative",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}"><a data-dropin-id="${A}"/></section>
  <section data-dropin-id="${Y}"><b data-dropin-id="${B}"/></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: -1 },
  { unchanged: true }
);

// 12. Property cleanup: remove flexBasis on move out of flex parent
test(
  "cleanup removes flexBasis after move",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}" style={{ flexBasis: '200px', color: 'red' }}/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0, propsToRemove: ["flexBasis"] },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
  <a data-dropin-id="${A}" style={{ color: 'red' }}/></section>
</div>`
);

// 13. Property cleanup: set new prop on move
test(
  "cleanup sets a new prop after move",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0, propsToSet: { width: '100px' } },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
  <a data-dropin-id="${A}" style={{ width: '100px' }}/></section>
</div>`
);

// 14. Move element with nested children (preserves descendants)
test(
  "preserve nested children on reparent",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <article data-dropin-id="${A}">
      <h1>Title</h1>
      <p>Body</p>
    </article>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
  <article data-dropin-id="${A}">
      <h1>Title</h1>
      <p>Body</p>
    </article></section>
</div>`
);

// 15. Round trip: reparent then reparent back
{
  const initial = `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`;
  const r1 = applyReparent(initial, { oid: A, newParentOid: Y, insertIndex: 0 });
  if (!r1.unchanged) {
    const r2 = applyReparent(r1.source, { oid: A, newParentOid: X, insertIndex: 0 });
    if (!r2.unchanged) {
      pass++;
      console.log("PASS: round-trip reparent succeeds");
    } else {
      fail++;
      console.log(`FAIL: round-trip reparent (r2 unchanged: ${r2.reason})`);
    }
  } else {
    fail++;
    console.log(`FAIL: round-trip reparent (r1 unchanged: ${r1.reason})`);
  }
}

// 16. Move into deeply-nested target
test(
  "move into deeply nested newParent",
  `<main data-dropin-id="${ROOT}">
  <a data-dropin-id="${A}"/>
  <section>
    <header>
      <nav data-dropin-id="${Y}">
        <b data-dropin-id="${B}"/>
      </nav>
    </header>
  </section>
</main>`,
  { oid: A, newParentOid: Y, insertIndex: 1 },
  `<main data-dropin-id="${ROOT}">
  <section>
    <header>
      <nav data-dropin-id="${Y}">
        <b data-dropin-id="${B}"/>
        <a data-dropin-id="${A}"/>
      </nav>
    </header>
  </section>
</main>`
);

// 17. tsx-wrapped reparent
// Note: empty newParent uses default `\n  ` indent regardless of surrounding
// nesting depth. Vibecoders rarely care; a formatter would re-indent if so.
test(
  "tsx-wrapped reparent",
  `export default function T() { return (
  <div data-dropin-id="${ROOT}">
    <section data-dropin-id="${X}">
      <a data-dropin-id="${A}"/>
    </section>
    <section data-dropin-id="${Y}"></section>
  </div>
); }`,
  { oid: A, newParentOid: Y, insertIndex: 0 },
  `export default function T() { return (
  <div data-dropin-id="${ROOT}">
    <section data-dropin-id="${X}">
    </section>
    <section data-dropin-id="${Y}">
  <a data-dropin-id="${A}"/></section>
  </div>
); }`
);

// 18. Bail: source has no JSX parent (top-level)
test(
  "bail when source is the top-level element",
  `<div data-dropin-id="${A}"><b data-dropin-id="${B}"/></div>`,
  { oid: A, newParentOid: B, insertIndex: 0 },
  { unchanged: true }
);

// 19. Combined cleanup: remove + set
test(
  "cleanup: remove flexBasis AND set width on move",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}" style={{ flexBasis: '200px' }}/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0, propsToRemove: ["flexBasis"], propsToSet: { width: "150px" } },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
  </section>
  <section data-dropin-id="${Y}">
  <a data-dropin-id="${A}" style={{ width: '150px' }}/></section>
</div>`
);

// 20. Move first sibling out leaves remaining siblings intact
test(
  "move first sibling — remaining siblings keep position",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: A, newParentOid: Y, insertIndex: 0 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
  <section data-dropin-id="${Y}">
  <a data-dropin-id="${A}"/></section>
</div>`
);

// 21. Move middle sibling out
test(
  "move middle sibling out",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: B, newParentOid: Y, insertIndex: 0 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
    <c data-dropin-id="${C}"/>
  </section>
  <section data-dropin-id="${Y}">
  <b data-dropin-id="${B}"/></section>
</div>`
);

// 22. Move last sibling out
test(
  "move last sibling out",
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
  <section data-dropin-id="${Y}"></section>
</div>`,
  { oid: C, newParentOid: Y, insertIndex: 0 },
  `<div data-dropin-id="${ROOT}">
  <section data-dropin-id="${X}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
  </section>
  <section data-dropin-id="${Y}">
  <c data-dropin-id="${C}"/></section>
</div>`
);

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);
