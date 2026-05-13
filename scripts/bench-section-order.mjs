// Pure-logic bench for `computeSectionOrder` (FocusEditor's smart
// section-order heuristic, ROADMAP §3.4). Inlines the helper so the
// bench doesn't have to ts-load the React component module.

const ALL = [
  "text",
  "background",
  "text_color",
  "typography",
  "spacing",
  "border",
  "effects",
  "layout",
  "size",
  "image",
];

const FORM_TAGS = new Set(["input", "button", "a", "select", "textarea", "label"]);
const TEXT_TAGS = new Set([
  "p",
  "span",
  "li",
  "strong",
  "em",
  "blockquote",
  "code",
  "pre",
  "small",
  "figcaption",
]);
const CONTAINER_TAGS = new Set([
  "div",
  "section",
  "main",
  "header",
  "footer",
  "nav",
  "aside",
  "article",
  "ul",
  "ol",
  "form",
]);

const INTERACTIVE_PARENTS = new Set(["button", "a", "label", "summary"]);
const LIST_OR_MEDIA_PARENTS = new Set(["li", "figure", "picture"]);

function computeSectionOrder(tag, isFlex, hasOnlyTextChildren, parentTag) {
  const t = tag.toLowerCase();
  const pt = parentTag ? String(parentTag).toLowerCase() : null;
  let promoted = [];
  // Sub-element refinements fire first (parent context wins).
  if (
    pt &&
    (t === "img" || t === "svg" || t === "picture") &&
    INTERACTIVE_PARENTS.has(pt)
  ) {
    promoted = ["size", "spacing", "image", "effects", "background", "border"];
  } else if (
    pt &&
    (t === "span" || t === "p" || t === "strong" || t === "em") &&
    INTERACTIVE_PARENTS.has(pt)
  ) {
    promoted = ["text", "typography", "text_color", "spacing", "background"];
  } else if (
    pt &&
    (t === "img" || t === "svg" || t === "picture") &&
    LIST_OR_MEDIA_PARENTS.has(pt)
  ) {
    promoted = ["image", "size", "spacing", "effects", "border"];
  }
  if (promoted.length === 0) {
    if (t === "img" || t === "picture" || t === "svg") {
      promoted = ["image", "size", "effects", "background", "border"];
    } else if (FORM_TAGS.has(t)) {
      promoted = ["typography", "text_color", "background", "border", "effects"];
    } else if (CONTAINER_TAGS.has(t) && isFlex) {
      promoted = ["layout", "size", "spacing"];
    } else if (
      hasOnlyTextChildren ||
      /^h[1-6]$/.test(t) ||
      TEXT_TAGS.has(t)
    ) {
      promoted = ["text", "typography", "text_color", "background"];
    }
  }
  if (promoted.length === 0) return ALL;
  const seen = new Set(promoted);
  const tail = ALL.filter((k) => !seen.has(k));
  return [...promoted, ...tail];
}

let passed = 0;
let failed = 0;
function assertEq(label, got, want) {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a === b) {
    passed++;
  } else {
    failed++;
    console.log(`FAIL ${label}\n  got:  ${a}\n  want: ${b}`);
  }
}

// 1. img promotes image first
assertEq("img tag", computeSectionOrder("img", false, false)[0], "image");

// 2. img full prefix
assertEq(
  "img full promoted",
  computeSectionOrder("img", false, false).slice(0, 5),
  ["image", "size", "effects", "background", "border"],
);

// 3. img - no duplicate 'background' in tail (dedup works)
{
  const order = computeSectionOrder("img", false, false);
  const seen = new Set(order);
  assertEq("img dedup count", seen.size, ALL.length);
  assertEq("img full length", order.length, ALL.length);
}

// 4. picture promotes the same as img
assertEq(
  "picture tag",
  computeSectionOrder("picture", false, false)[0],
  "image",
);

// 5. button promotes typography first
assertEq(
  "button tag",
  computeSectionOrder("button", false, false)[0],
  "typography",
);

// 6. input promotes typography first
assertEq(
  "input tag",
  computeSectionOrder("input", false, false)[0],
  "typography",
);

// 7. anchor promotes typography first
assertEq(
  "a tag",
  computeSectionOrder("a", false, false)[0],
  "typography",
);

// 8. form-tag full prefix
assertEq(
  "button full promoted",
  computeSectionOrder("button", false, false).slice(0, 5),
  ["typography", "text_color", "background", "border", "effects"],
);

// 9. div + flex promotes layout first
assertEq(
  "div+flex",
  computeSectionOrder("div", true, false)[0],
  "layout",
);

// 10. div WITHOUT flex falls to fallback (no promotion)
assertEq(
  "div no-flex",
  computeSectionOrder("div", false, false),
  ALL,
);

// 11. section with flex
assertEq(
  "section+flex",
  computeSectionOrder("section", true, false)[0],
  "layout",
);

// 12. nav with flex
assertEq(
  "nav+flex",
  computeSectionOrder("nav", true, false)[0],
  "layout",
);

// 13. h1 promotes text first
assertEq("h1 tag", computeSectionOrder("h1", false, false)[0], "text");
// 14. h6
assertEq("h6 tag", computeSectionOrder("h6", false, false)[0], "text");
// 15. p tag
assertEq("p tag", computeSectionOrder("p", false, false)[0], "text");
// 16. span tag
assertEq(
  "span tag",
  computeSectionOrder("span", false, false)[0],
  "text",
);
// 17. li tag
assertEq("li tag", computeSectionOrder("li", false, false)[0], "text");

// 18. text-children short-circuit (e.g. a div with only text)
assertEq(
  "text children",
  computeSectionOrder("div", false, true)[0],
  "text",
);

// 19. flex+text-children: container heuristic wins (flex is more
//     specific intent than "has text"). Order = layout/size/spacing first.
assertEq(
  "div+flex+text wins flex",
  computeSectionOrder("div", true, true)[0],
  "layout",
);

// 20. unknown tag, no flex, no text - default
assertEq(
  "unknown tag",
  computeSectionOrder("custom-element", false, false),
  ALL,
);

// 21. case-insensitive
assertEq(
  "uppercase tag",
  computeSectionOrder("IMG", false, false)[0],
  "image",
);

// 22. tail preserves original section order
{
  const order = computeSectionOrder("img", false, false);
  const tail = order.slice(5);
  // Unpromoted sections from ALL preserve their relative order:
  // text, text_color, typography, spacing, layout
  assertEq("img tail order", tail, [
    "text",
    "text_color",
    "typography",
    "spacing",
    "layout",
  ]);
}

// 23. all sections always present (length invariant)
const everyTag = [
  "img",
  "picture",
  "svg",
  "input",
  "button",
  "a",
  "select",
  "textarea",
  "label",
  "div",
  "section",
  "main",
  "header",
  "footer",
  "nav",
  "aside",
  "article",
  "ul",
  "ol",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "li",
  "strong",
  "em",
  "blockquote",
  "custom-element",
  "video",
];
for (const tag of everyTag) {
  for (const isFlex of [false, true]) {
    for (const text of [false, true]) {
      const order = computeSectionOrder(tag, isFlex, text);
      if (order.length !== ALL.length) {
        failed++;
        console.log(
          `FAIL length-invariant ${tag} ${isFlex} ${text}: ${order.length}`,
        );
      } else if (new Set(order).size !== ALL.length) {
        failed++;
        console.log(
          `FAIL no-dupes ${tag} ${isFlex} ${text}: ${JSON.stringify(order)}`,
        );
      }
    }
  }
}
passed++;

// 24. video, article, aside without flex fall through to default
assertEq(
  "video no-flex",
  computeSectionOrder("video", false, false),
  ALL,
);

// --- Sub-element heuristic (eighteenth pass) ---

// 25. img inside button — size/spacing/image first
assertEq(
  "img in button",
  computeSectionOrder("img", false, false, "button").slice(0, 6),
  ["size", "spacing", "image", "effects", "background", "border"],
);

// 26. svg inside a (anchor)
assertEq(
  "svg in a",
  computeSectionOrder("svg", false, false, "a")[0],
  "size",
);

// 27. img inside label
assertEq(
  "img in label",
  computeSectionOrder("img", false, false, "label").slice(0, 3),
  ["size", "spacing", "image"],
);

// 28. img inside summary
assertEq(
  "img in summary",
  computeSectionOrder("img", false, false, "summary")[0],
  "size",
);

// 29. img with NO parent context falls back to bare img rule
assertEq(
  "img no parent",
  computeSectionOrder("img", false, false)[0],
  "image",
);

// 30. img inside non-interactive parent (div) falls back to bare rule
assertEq(
  "img in div",
  computeSectionOrder("img", false, false, "div")[0],
  "image",
);

// 31. span inside button — text/typography/text_color/spacing
assertEq(
  "span in button",
  computeSectionOrder("span", false, false, "button").slice(0, 4),
  ["text", "typography", "text_color", "spacing"],
);

// 32. p inside a — same as span
assertEq(
  "p in a",
  computeSectionOrder("p", false, false, "a")[0],
  "text",
);

// 33. strong inside button
assertEq(
  "strong in button",
  computeSectionOrder("strong", false, false, "button").slice(0, 3),
  ["text", "typography", "text_color"],
);

// 34. span outside an interactive parent → bare-tag rule still fires
assertEq(
  "span in div",
  computeSectionOrder("span", false, false, "div")[0],
  "text",
);

// 35. img inside li — list/media path
assertEq(
  "img in li",
  computeSectionOrder("img", false, false, "li").slice(0, 3),
  ["image", "size", "spacing"],
);

// 36. img inside figure — same path
assertEq(
  "img in figure",
  computeSectionOrder("img", false, false, "figure")[0],
  "image",
);

// 37. svg inside li
assertEq(
  "svg in li",
  computeSectionOrder("svg", false, false, "li").slice(0, 3),
  ["image", "size", "spacing"],
);

// 38. parent context case-insensitive
assertEq(
  "img in BUTTON uppercase parent",
  computeSectionOrder("img", false, false, "BUTTON")[0],
  "size",
);

// 39. parentTag = null → identical to 3-arg call
assertEq(
  "img null parent equals 3-arg",
  computeSectionOrder("img", false, false, null),
  computeSectionOrder("img", false, false),
);

// 40. parentTag = "" empty string treated as no-parent
assertEq(
  "img empty parent",
  computeSectionOrder("img", false, false, ""),
  computeSectionOrder("img", false, false),
);

// 41. interactive-parent rule takes precedence over bare-img rule
//     (verifies the order of conditional checks)
{
  const withParent = computeSectionOrder("img", false, false, "button");
  const withoutParent = computeSectionOrder("img", false, false);
  if (JSON.stringify(withParent) === JSON.stringify(withoutParent)) {
    failed++;
    console.log("FAIL parent should change order for img+button");
  } else {
    passed++;
  }
}

// 42. parent rule preserves length invariant + dedup
{
  const order = computeSectionOrder("img", false, false, "button");
  if (order.length !== ALL.length) {
    failed++;
    console.log(`FAIL parent length: ${order.length}`);
  } else if (new Set(order).size !== ALL.length) {
    failed++;
    console.log(`FAIL parent dedup: ${JSON.stringify(order)}`);
  } else {
    passed++;
  }
}

// 43. comprehensive parent-context length invariant across all
//     bare-tag/parent combos
const parentMatrix = [
  null,
  "button",
  "a",
  "label",
  "summary",
  "li",
  "figure",
  "picture",
  "div",
  "section",
];
for (const tag of ["img", "svg", "picture", "span", "p", "strong", "em"]) {
  for (const parent of parentMatrix) {
    const order = computeSectionOrder(tag, false, false, parent);
    if (order.length !== ALL.length) {
      failed++;
      console.log(`FAIL parent matrix length ${tag} in ${parent}: ${order.length}`);
    } else if (new Set(order).size !== ALL.length) {
      failed++;
      console.log(`FAIL parent matrix dupes ${tag} in ${parent}: ${JSON.stringify(order)}`);
    }
  }
}
passed++;

console.log(`bench-section-order: ${passed}/${passed + failed} passed`);
process.exit(failed === 0 ? 0 : 1);
