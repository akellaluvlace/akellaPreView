// Thin wrapper around MiniSearch: loads the pre-built index from search.json,
// exposes a `search(query)` that returns the matching ids. The caller joins
// back to ComponentMeta by id (cheaper than shipping every field inside the
// serialized index).

import MiniSearch from "minisearch";
import type { SearchResult } from "minisearch";

let engine: MiniSearch | null = null;

export function loadSearchEngine(json: string): MiniSearch {
  if (engine) return engine;
  engine = MiniSearch.loadJSON(json, {
    idField: "id",
    fields: ["title", "tags", "category"],
    storeFields: ["id"],
    extractField: (doc, field) => {
      const v = (doc as Record<string, unknown>)[field];
      if (Array.isArray(v)) return v.join(" ");
      return (v as string | undefined) ?? "";
    },
  });
  return engine;
}

export function searchIds(query: string, limit = 200): string[] {
  if (!engine) return [];
  if (!query.trim()) return [];
  const results: SearchResult[] = engine.search(query, {
    prefix: true,
    fuzzy: 0.2,
    combineWith: "AND",
    boost: { title: 10, tags: 5, category: 2 },
  });
  const out: string[] = [];
  for (const r of results) {
    out.push(r.id as string);
    if (out.length >= limit) break;
  }
  return out;
}

export function resetSearchEngine(): void {
  engine = null;
}
