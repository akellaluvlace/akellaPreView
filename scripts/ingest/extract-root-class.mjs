// Phase E proper — root className extractor for ingest pipeline.
//
// Reads body-level HTML (Uiverse / HyperUI fragments) and returns the
// class attribute of the first top-level Element node, or null if no
// element is found / has no class.
//
// Used by the ingest pipeline to populate `ComponentMeta.rootClassName`
// at index-build time. The runtime LibraryModal feeds this into
// `lookupCapacity(records=null, assetId, rootClassName, category)` so
// the pure-logic static analyzer can compute capacity without needing
// the puppeteer-driven `data/component-capacities.json` file.
//
// Pure-logic, deterministic, no I/O.

import { parseFragment } from "parse5";

// parse5 represents elements as nodes with `tagName` + `attrs` arrays.
// Text / comment / DOCTYPE nodes have different `nodeName` values
// (`#text`, `#comment`, `#documentType` respectively) and lack `attrs`.
function isElementNode(node) {
  return (
    node &&
    typeof node.tagName === "string" &&
    Array.isArray(node.attrs)
  );
}

function readClassAttr(node) {
  for (const a of node.attrs) {
    if (a.name === "class") {
      return typeof a.value === "string" ? a.value : "";
    }
  }
  return "";
}

// Extract the class string of the first top-level Element child of
// the fragment. Skips leading whitespace text nodes / comments. Returns
// null when:
//   - input is not a string
//   - parse fails (parse5 doesn't throw on malformed; fragment.childNodes
//     is empty in that case)
//   - no element child is found
//   - the element has no class attribute (returns "" — caller decides
//     how to treat empty-but-present)
//
// We return null vs "" to distinguish "no class signal at all" (null)
// from "explicit empty class" (""). Both mean the same thing for
// `inferCapacityFromClasses` (an empty class string yields all-null
// capacity intrinsics with default flexBehavior), but null lets the
// downstream consumer fall through to category-only inference cleanly
// without an extra branch.
export function extractRootClassName(html) {
  if (typeof html !== "string" || html.length === 0) return null;

  let fragment;
  try {
    fragment = parseFragment(html);
  } catch {
    return null;
  }

  const children = Array.isArray(fragment.childNodes) ? fragment.childNodes : [];
  for (const child of children) {
    if (!isElementNode(child)) continue;
    const value = readClassAttr(child);
    return value === "" ? null : value;
  }
  return null;
}
