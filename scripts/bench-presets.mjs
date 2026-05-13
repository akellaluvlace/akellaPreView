// Pure-logic bench for `lib/style-presets.ts`. Inlines the helpers so
// the bench doesn't need a TS loader.

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium";

const CATEGORIES = [
  {
    label: "Button",
    matchTags: ["button", "a"],
    presets: [
      {
        id: "btn-primary",
        name: "Primary",
        classes: `${BUTTON_BASE} rounded-md bg-slate-900 text-white shadow-sm`,
      },
      {
        id: "btn-link",
        name: "Link",
        classes:
          "inline-flex items-center gap-1 text-blue-600 font-medium underline underline-offset-2",
      },
    ],
  },
  {
    label: "Card",
    matchTags: ["div", "section", "article", "header", "footer", "main", "aside"],
    presets: [
      {
        id: "card-flat",
        name: "Flat",
        classes: "bg-white p-6 rounded-md",
      },
      {
        id: "card-raised",
        name: "Raised",
        classes: "bg-white p-6 rounded-md shadow-md",
      },
    ],
  },
  {
    label: "Heading",
    matchTags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    presets: [
      {
        id: "heading-hero",
        name: "Hero",
        classes: "text-5xl font-bold tracking-tight",
      },
    ],
  },
  {
    label: "Input",
    matchTags: ["input", "textarea", "select"],
    presets: [
      {
        id: "input-boxed",
        name: "Boxed",
        classes:
          "bg-white border-2 border-slate-900 rounded-md px-3 py-2 text-slate-900 shadow-sm",
      },
    ],
  },
];

function getPresetCategoriesForTag(tag) {
  const t = tag.toLowerCase();
  return CATEGORIES.filter((cat) => cat.matchTags.includes(t));
}

function isPresetStripClass(c) {
  if (/^bg-/.test(c)) return true;
  if (c === "border" || /^border-/.test(c)) return true;
  if (c === "rounded" || /^rounded-/.test(c)) return true;
  if (c === "shadow" || /^shadow-/.test(c)) return true;
  if (/^p[trblxy]?(-|$)/.test(c)) return true;
  if (/^text-/.test(c)) {
    return !/^text-(center|left|right|justify|start|end)$/.test(c);
  }
  if (/^font-/.test(c)) return true;
  if (/^(tracking|leading|decoration)-/.test(c)) return true;
  if (
    c === "underline" ||
    c === "no-underline" ||
    c === "italic" ||
    c === "not-italic"
  )
    return true;
  if (
    c === "block" ||
    c === "inline-block" ||
    c === "inline" ||
    c === "flex" ||
    c === "inline-flex" ||
    c === "grid" ||
    c === "inline-grid" ||
    c === "hidden"
  )
    return true;
  if (/^(items|justify|content|place|gap)-/.test(c)) return true;
  return false;
}

function applyPreset(currentClasses, preset) {
  return applyPresetVariant(currentClasses, preset, 0);
}

function presetVariantCount(preset) {
  return 1 + (preset.variants ? preset.variants.length : 0);
}

function presetVariantClasses(preset, idx) {
  if (idx <= 0) return preset.classes;
  const v = preset.variants;
  if (!v || idx > v.length) return preset.classes;
  return v[idx - 1];
}

function applyPresetVariant(currentClasses, preset, idx) {
  const tokens = presetVariantClasses(preset, idx)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const tokenSet = new Set(tokens);
  const kept = currentClasses.filter(
    (c) => !isPresetStripClass(c) && !tokenSet.has(c),
  );
  return [...kept, ...tokens];
}

function extractPresetClasses(current) {
  return current.filter((c) => isPresetStripClass(c)).join(" ");
}

let passed = 0;
let failed = 0;
function check(label, cond, detail) {
  if (cond) passed++;
  else {
    failed++;
    console.log(`FAIL ${label}${detail ? ` :: ${detail}` : ""}`);
  }
}
function eq(label, got, want) {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  check(label, a === b, `\n  got:  ${a}\n  want: ${b}`);
}

// 1. button -> Button category
{
  const cats = getPresetCategoriesForTag("button");
  eq("button category count", cats.length, 1);
  eq("button category label", cats[0].label, "Button");
}
// 2. anchor -> Button category (presets cross-tag)
eq(
  "a -> Button",
  getPresetCategoriesForTag("a")[0].label,
  "Button",
);
// 3. div -> Card category
eq("div -> Card", getPresetCategoriesForTag("div")[0].label, "Card");
// 4. section -> Card
eq(
  "section -> Card",
  getPresetCategoriesForTag("section")[0].label,
  "Card",
);
// 5. h1..h6 -> Heading
for (const h of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
  eq(
    `${h} -> Heading`,
    getPresetCategoriesForTag(h)[0].label,
    "Heading",
  );
}
// 6. input -> Input
eq("input -> Input", getPresetCategoriesForTag("input")[0].label, "Input");
// 7. unknown tag -> empty list
eq(
  "unknown tag -> empty",
  getPresetCategoriesForTag("custom-element"),
  [],
);
// 8. case-insensitive
eq(
  "uppercase tag",
  getPresetCategoriesForTag("BUTTON")[0].label,
  "Button",
);

// --- isPresetStripClass ---
// 9. bg-* stripped
check("strips bg-blue-500", isPresetStripClass("bg-blue-500"));
// 10. text color stripped
check("strips text-red-500", isPresetStripClass("text-red-500"));
// 11. text-size stripped
check("strips text-3xl", isPresetStripClass("text-3xl"));
// 12. text alignment NOT stripped
check("keeps text-center", !isPresetStripClass("text-center"));
check("keeps text-left", !isPresetStripClass("text-left"));
check("keeps text-right", !isPresetStripClass("text-right"));
check("keeps text-justify", !isPresetStripClass("text-justify"));
// 13. padding all variants
check("strips p-4", isPresetStripClass("p-4"));
check("strips px-3", isPresetStripClass("px-3"));
check("strips py-2", isPresetStripClass("py-2"));
check("strips pt-4", isPresetStripClass("pt-4"));
// 14. margin NOT stripped (positioning, not style)
check("keeps m-4", !isPresetStripClass("m-4"));
check("keeps mx-auto", !isPresetStripClass("mx-auto"));
check("keeps mt-8", !isPresetStripClass("mt-8"));
// 15. border + variants
check("strips border", isPresetStripClass("border"));
check("strips border-2", isPresetStripClass("border-2"));
check("strips border-blue-500", isPresetStripClass("border-blue-500"));
// 16. rounded
check("strips rounded", isPresetStripClass("rounded"));
check("strips rounded-md", isPresetStripClass("rounded-md"));
// 17. shadow
check("strips shadow", isPresetStripClass("shadow"));
check("strips shadow-lg", isPresetStripClass("shadow-lg"));
// 18. font (weight, family-arbitrary)
check("strips font-bold", isPresetStripClass("font-bold"));
check("strips font-medium", isPresetStripClass("font-medium"));
// 19. typography polish
check("strips tracking-tight", isPresetStripClass("tracking-tight"));
check("strips leading-loose", isPresetStripClass("leading-loose"));
check("strips underline", isPresetStripClass("underline"));
check("strips italic", isPresetStripClass("italic"));
// 20. display
check("strips flex", isPresetStripClass("flex"));
check("strips inline-flex", isPresetStripClass("inline-flex"));
check("strips block", isPresetStripClass("block"));
// 21. items/justify/gap
check("strips items-center", isPresetStripClass("items-center"));
check("strips justify-center", isPresetStripClass("justify-center"));
check("strips gap-2", isPresetStripClass("gap-2"));
// 22. width / height NOT stripped (size is not in preset domain v1)
check("keeps w-full", !isPresetStripClass("w-full"));
check("keeps h-screen", !isPresetStripClass("h-screen"));
// 23. position NOT stripped
check("keeps absolute", !isPresetStripClass("absolute"));
check("keeps relative", !isPresetStripClass("relative"));

// --- applyPreset ---
const primary = CATEGORIES[0].presets[0];
// 24. empty input -> just preset classes
{
  const out = applyPreset([], primary);
  eq("apply on empty", out, primary.classes.split(/\s+/));
}
// 25. preserves margin (non-stripped)
{
  const out = applyPreset(["mx-auto", "mt-8"], primary);
  check(
    "preserves margin",
    out.includes("mx-auto") && out.includes("mt-8"),
  );
}
// 26. strips bg-blue-500
{
  const out = applyPreset(["bg-blue-500", "p-2"], primary);
  check("strips old bg", !out.includes("bg-blue-500"));
  check("strips old padding", !out.includes("p-2"));
}
// 27. dedup: applying twice produces same result
{
  const once = applyPreset(["mx-auto"], primary);
  const twice = applyPreset(once, primary);
  eq("idempotent", twice, once);
}
// 28. preset re-applied on existing preset = clean
{
  const primaryClasses = primary.classes.split(/\s+/);
  const out = applyPreset(primaryClasses, primary);
  eq(
    "re-apply same preset = identical",
    out.sort().join(" "),
    primaryClasses.sort().join(" "),
  );
}
// 29. preserves text-center (alignment) after applying button preset
{
  const out = applyPreset(["text-center", "bg-blue-500"], primary);
  check(
    "preserves text-center",
    out.includes("text-center"),
  );
}
// 30. preserves width
{
  const out = applyPreset(["w-full", "bg-red-500"], primary);
  check("preserves w-full", out.includes("w-full"));
}
// 31. card preset doesn't strip margin or position
{
  const cardFlat = CATEGORIES[1].presets[0];
  const out = applyPreset(
    ["mx-auto", "mt-12", "max-w-md", "bg-red-500"],
    cardFlat,
  );
  check(
    "card preserves layout helpers",
    out.includes("mx-auto") &&
      out.includes("mt-12") &&
      out.includes("max-w-md"),
  );
  check("card strips bg", !out.includes("bg-red-500"));
}
// 32. switching from one preset to another doesn't accumulate cruft
{
  const primaryClasses = primary.classes.split(/\s+/);
  const link = CATEGORIES[0].presets[1];
  const switched = applyPreset(primaryClasses, link);
  const expected = link.classes.split(/\s+/);
  eq(
    "preset->preset switch = clean",
    switched.sort().join(" "),
    expected.sort().join(" "),
  );
}
// 33. heading preset strips font + tracking + text-* but keeps text-center
{
  const hero = CATEGORIES[2].presets[0];
  const out = applyPreset(
    ["text-2xl", "font-light", "tracking-wide", "text-center"],
    hero,
  );
  check("hero strips text-2xl", !out.includes("text-2xl"));
  check("hero strips font-light", !out.includes("font-light"));
  check("hero strips tracking-wide", !out.includes("tracking-wide"));
  check("hero adds tracking-tight", out.includes("tracking-tight"));
  check("hero keeps text-center", out.includes("text-center"));
}
// 34. input preset
{
  const boxed = CATEGORIES[3].presets[0];
  const out = applyPreset(["bg-yellow-100", "border", "rounded-full"], boxed);
  check("input strips old bg", !out.includes("bg-yellow-100"));
  check("input strips old border", !out.includes("border"));
  check("input strips old rounded-full", !out.includes("rounded-full"));
  check("input adds rounded-md", out.includes("rounded-md"));
}
// 35. preset preserves order: kept-classes first, preset-classes appended
{
  const out = applyPreset(["mx-auto", "mt-8"], primary);
  const presetTokens = primary.classes.split(/\s+/);
  // After ['mx-auto','mt-8'] (preserved), preset tokens at end:
  const idxMargin = out.indexOf("mt-8");
  const idxFirstPreset = out.indexOf(presetTokens[0]);
  check(
    "kept before preset",
    idxMargin >= 0 && idxFirstPreset > idxMargin,
  );
}
// 36. order independence within stripped: primary preset always lands the same way
{
  const a = applyPreset(["bg-red-500", "rounded-full", "p-2"], primary);
  const b = applyPreset(["p-2", "rounded-full", "bg-red-500"], primary);
  eq("order independence (all stripped)", a, b);
}
// 37. preset with no class list (defensive)
{
  const empty = { id: "x", name: "x", classes: "  " };
  const out = applyPreset(["text-2xl"], empty);
  check("empty preset strips text-2xl", !out.includes("text-2xl"));
  check("empty preset doesn't add anything", out.length === 0);
}
// 38. preset with extra whitespace
{
  const noisy = {
    id: "x",
    name: "x",
    classes: "   bg-rose-500   text-white   ",
  };
  const out = applyPreset([], noisy);
  eq("normalises whitespace", out, ["bg-rose-500", "text-white"]);
}
// 39. all 12 presets are reachable through getPresetCategoriesForTag (registry sanity)
{
  const tagCheck = ["button", "div", "h1", "input"];
  let totalReachable = 0;
  for (const t of tagCheck) {
    for (const cat of getPresetCategoriesForTag(t)) {
      totalReachable += cat.presets.length;
    }
  }
  // bench inlines a subset of the real registry; just assert the inlined
  // set is reachable end-to-end (all inlined presets covered).
  let totalInlined = 0;
  for (const cat of CATEGORIES) totalInlined += cat.presets.length;
  eq("registry sanity", totalReachable, totalInlined);
}

// --- Variants (eighteenth pass) ---

// 40. presetVariantCount with no variants = 1
{
  const p = { id: "x", name: "x", classes: "bg-blue-500" };
  eq("variant count no variants", presetVariantCount(p), 1);
}

// 41. presetVariantCount with 3 variants = 4
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500",
    variants: ["bg-red-500", "bg-green-500", "bg-yellow-500"],
  };
  eq("variant count with 3", presetVariantCount(p), 4);
}

// 42. presetVariantClasses idx=0 returns base
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500",
    variants: ["bg-red-500"],
  };
  eq("variant idx 0", presetVariantClasses(p, 0), "bg-blue-500");
}

// 43. presetVariantClasses idx=1 returns first variant
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500",
    variants: ["bg-red-500", "bg-green-500"],
  };
  eq("variant idx 1", presetVariantClasses(p, 1), "bg-red-500");
}

// 44. presetVariantClasses idx beyond array clamps to base
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500",
    variants: ["bg-red-500"],
  };
  eq("variant out of range clamps", presetVariantClasses(p, 5), "bg-blue-500");
}

// 45. presetVariantClasses negative idx clamps to base
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500",
    variants: ["bg-red-500"],
  };
  eq("variant negative idx clamps", presetVariantClasses(p, -1), "bg-blue-500");
}

// 46. applyPresetVariant idx=0 == applyPreset
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500 text-white",
    variants: ["bg-red-500"],
  };
  eq(
    "variant 0 = applyPreset",
    applyPresetVariant(["w-full"], p, 0),
    applyPreset(["w-full"], p),
  );
}

// 47. applyPresetVariant idx=1 uses variant
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500 text-white",
    variants: ["bg-red-500 text-black"],
  };
  const out = applyPresetVariant(["w-full"], p, 1);
  eq("variant 1 applies variant", out, ["w-full", "bg-red-500", "text-black"]);
}

// 48. applyPresetVariant strips conflicting classes from variant tokens too
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-blue-500",
    variants: ["bg-red-500"],
  };
  // Old bg should be stripped regardless of which variant
  const out = applyPresetVariant(["w-full", "bg-green-500"], p, 1);
  eq("variant strips old bg", out, ["w-full", "bg-red-500"]);
}

// 49. applyPresetVariant cycle through variants without state confusion
{
  const p = {
    id: "x",
    name: "x",
    classes: "bg-slate-900",
    variants: ["bg-blue-600", "bg-emerald-600"],
  };
  const v0 = applyPresetVariant(["w-full"], p, 0);
  const v1 = applyPresetVariant(v0, p, 1); // simulate "click again"
  const v2 = applyPresetVariant(v1, p, 2);
  const v0b = applyPresetVariant(v2, p, 0); // wrap back
  eq("cycle v0", v0, ["w-full", "bg-slate-900"]);
  eq("cycle v1", v1, ["w-full", "bg-blue-600"]);
  eq("cycle v2", v2, ["w-full", "bg-emerald-600"]);
  eq("cycle wrap", v0b, ["w-full", "bg-slate-900"]);
}

// 50. variant with multiple tokens including layout keeps non-strip tokens
{
  const p = {
    id: "btn",
    name: "x",
    classes:
      "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium rounded-md bg-slate-900 text-white shadow-sm",
    variants: [
      "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium rounded-full bg-blue-600 text-white shadow-md",
    ],
  };
  const out = applyPresetVariant(["mt-4"], p, 1);
  // mt-4 stays (margin not stripped); rounded-full and bg-blue-600 land
  check("variant retains margin", out.includes("mt-4"));
  check("variant has bg-blue-600", out.includes("bg-blue-600"));
  check("variant has rounded-full", out.includes("rounded-full"));
  check(
    "variant has no rounded-md",
    !out.includes("rounded-md"),
    JSON.stringify(out),
  );
}

// --- extractPresetClasses ---

// 51. extracts only preset-domain tokens
{
  const out = extractPresetClasses([
    "w-full",
    "h-12",
    "bg-blue-500",
    "text-white",
    "px-4",
    "rounded-md",
    "flex",
    "items-center",
    "mt-4", // margin NOT stripped (not preset domain)
  ]);
  // Visual tokens: bg-blue-500, text-white, px-4, rounded-md, flex, items-center
  const tokens = out.split(/\s+/).filter(Boolean);
  check("extract has bg", tokens.includes("bg-blue-500"));
  check("extract has text", tokens.includes("text-white"));
  check("extract has px", tokens.includes("px-4"));
  check("extract has rounded", tokens.includes("rounded-md"));
  check("extract has flex", tokens.includes("flex"));
  check("extract has items", tokens.includes("items-center"));
  check("extract no width", !tokens.includes("w-full"));
  check("extract no height", !tokens.includes("h-12"));
  check("extract no margin", !tokens.includes("mt-4"));
}

// 52. extract empty input -> empty output
{
  eq("extract empty", extractPresetClasses([]), "");
}

// 53. extract pure-layout input -> empty output
{
  eq(
    "extract layout-only",
    extractPresetClasses(["w-full", "h-12", "mt-4"]),
    "",
  );
}

// 54. extract preserves text-align (NOT a preset visual token)
{
  const out = extractPresetClasses(["text-center", "bg-blue-500"]);
  const tokens = out.split(/\s+/).filter(Boolean);
  check(
    "extract drops text-center",
    !tokens.includes("text-center"),
    `tokens=${JSON.stringify(tokens)}`,
  );
  check("extract keeps bg", tokens.includes("bg-blue-500"));
}

console.log(`bench-presets: ${passed}/${passed + failed} passed`);
process.exit(failed === 0 ? 0 : 1);
