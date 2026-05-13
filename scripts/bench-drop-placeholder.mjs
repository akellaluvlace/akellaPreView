// Thirty-second-pass — pure-logic bench for `buildDropPlaceholderCaption`
// exported from `components/ElementTree.tsx`. The helper takes a
// drag-ghost label (from buildDragGhostLabel — formats are `<tag>`,
// `<tag> · N`, `1 element`, or `N elements`) plus a DropPosition
// ("before" | "after" | "inside") and produces a verb-prefixed caption
// for the translucent drop-placeholder row.
//
// Mirrors the exported helper's logic exactly so the bench is hermetic.

function buildDropPlaceholderCaption(dragGhostLabel, position) {
  const verb =
    position === "before"
      ? "before"
      : position === "after"
        ? "after"
        : "into";
  return `↳ drop ${verb} ${dragGhostLabel}`;
}

let passed = 0;
let failed = 0;
function assertEq(label, got, want) {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a === b) {
    passed++;
    console.log(`PASS: ${label}`);
  } else {
    failed++;
    console.log(`FAIL: ${label}\n  got:  ${a}\n  want: ${b}`);
  }
}

// ---- Single-drag labels (`<tag>` form from buildDragGhostLabel) -------

assertEq("1: single + before", buildDropPlaceholderCaption("<div>", "before"), "↳ drop before <div>");
assertEq("2: single + after", buildDropPlaceholderCaption("<div>", "after"), "↳ drop after <div>");
assertEq("3: single + inside", buildDropPlaceholderCaption("<div>", "inside"), "↳ drop into <div>");

// ---- Multi-drag labels (`<tag> · N` form) -----------------------------

assertEq("4: multi-2 + before", buildDropPlaceholderCaption("<div> · 2", "before"), "↳ drop before <div> · 2");
assertEq("5: multi-3 + after", buildDropPlaceholderCaption("<div> · 3", "after"), "↳ drop after <div> · 3");
assertEq("6: multi-7 + inside", buildDropPlaceholderCaption("<section> · 7", "inside"), "↳ drop into <section> · 7");

// ---- Tag-resolution-failure fallbacks (no <tag>, just a count) -------

assertEq("7: count-only (no primary tag) + before", buildDropPlaceholderCaption("3 elements", "before"), "↳ drop before 3 elements");
assertEq("8: count-only + after", buildDropPlaceholderCaption("3 elements", "after"), "↳ drop after 3 elements");
assertEq("9: '1 element' fallback + inside", buildDropPlaceholderCaption("1 element", "inside"), "↳ drop into 1 element");

// ---- Verb mapping locks (one explicit case per position) -------------

assertEq("10: 'before' position uses 'before' verb", buildDropPlaceholderCaption("X", "before"), "↳ drop before X");
assertEq("11: 'after' position uses 'after' verb", buildDropPlaceholderCaption("X", "after"), "↳ drop after X");
assertEq("12: 'inside' position uses 'into' verb (NOT 'inside')", buildDropPlaceholderCaption("X", "inside"), "↳ drop into X");

// ---- Caption shape locks ----------------------------------------------

// Arrow prefix is always "↳ drop " followed by verb + space + label.
{
  const r = buildDropPlaceholderCaption("<div>", "before");
  assertEq("13: caption starts with '↳ drop '", r.startsWith("↳ drop "), true);
  assertEq("14: caption contains the dragGhostLabel verbatim", r.endsWith("<div>"), true);
}

// Verb appears between '↳ drop ' and the label.
{
  const r = buildDropPlaceholderCaption("X", "after");
  const verbPart = r.slice("↳ drop ".length, r.length - " X".length);
  assertEq("15: verb portion is 'after' for after-drop", verbPart, "after");
}

// ---- Edge cases: degenerate labels -----------------------------------

// Empty-string label — shouldn't happen in practice (caller never
// passes empty), but the helper doesn't guard so the caption renders
// with a trailing space + nothing. Documenting current behavior.
assertEq("16: empty label produces trailing space (caller never sends empty)", buildDropPlaceholderCaption("", "before"), "↳ drop before ");

// Special characters in label preserved (no escaping needed since this
// renders into JSX text node, not innerHTML).
assertEq("17: label with angle brackets preserved", buildDropPlaceholderCaption("<my-component>", "after"), "↳ drop after <my-component>");
assertEq("18: label with HTML-entity-looking chars preserved", buildDropPlaceholderCaption("<a&b>", "inside"), "↳ drop into <a&b>");

// Long tag (e.g. `<MaterialUIComponent>`).
assertEq("19: long tag preserved", buildDropPlaceholderCaption("<MaterialUIComponent>", "before"), "↳ drop before <MaterialUIComponent>");

// Unicode tag (component name with non-ASCII).
assertEq("20: unicode tag preserved", buildDropPlaceholderCaption("<тест>", "after"), "↳ drop after <тест>");

// ---- Pure (no input mutation) ----------------------------------------

{
  const labels = ["<div>", "<span>", "<a>"];
  const before = JSON.stringify(labels);
  for (const l of labels) {
    buildDropPlaceholderCaption(l, "before");
    buildDropPlaceholderCaption(l, "after");
    buildDropPlaceholderCaption(l, "inside");
  }
  const after = JSON.stringify(labels);
  assertEq("21: helper doesn't mutate label inputs", before, after);
}

// ---- Idempotent (same inputs → same outputs) -------------------------

{
  const r1 = buildDropPlaceholderCaption("<div>", "before");
  const r2 = buildDropPlaceholderCaption("<div>", "before");
  assertEq("22: repeated call produces equal string", r1, r2);
}

// ---- All-position symmetry ------------------------------------------

// All three position outputs are distinct for the same label.
{
  const b = buildDropPlaceholderCaption("X", "before");
  const a = buildDropPlaceholderCaption("X", "after");
  const i = buildDropPlaceholderCaption("X", "inside");
  assertEq("23: before !== after", b !== a, true);
  assertEq("24: before !== inside", b !== i, true);
  assertEq("25: after !== inside", a !== i, true);
}

// ---- Roundtrip with buildDragGhostLabel-shaped inputs ----------------

// Reproduce buildDragGhostLabel logic to confirm the placeholder reads
// as expected against every shape it could receive.
function buildDragGhostLabel(primaryTag, setSize) {
  if (setSize <= 1) return primaryTag ? `<${primaryTag}>` : "1 element";
  if (primaryTag) return `<${primaryTag}> · ${setSize}`;
  return `${setSize} elements`;
}

{
  // Compose: ghost label → placeholder caption.
  const cases = [
    { tag: "div", n: 1, pos: "before", want: "↳ drop before <div>" },
    { tag: "div", n: 3, pos: "after", want: "↳ drop after <div> · 3" },
    { tag: undefined, n: 1, pos: "inside", want: "↳ drop into 1 element" },
    { tag: undefined, n: 5, pos: "before", want: "↳ drop before 5 elements" },
    { tag: "section", n: 2, pos: "inside", want: "↳ drop into <section> · 2" },
  ];
  for (const c of cases) {
    const label = buildDragGhostLabel(c.tag, c.n);
    const caption = buildDropPlaceholderCaption(label, c.pos);
    assertEq(`26.${c.tag ?? "anon"}-${c.n}-${c.pos}: composed roundtrip`, caption, c.want);
  }
}

console.log(`\nbench-drop-placeholder: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
