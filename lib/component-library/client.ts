// Client-side data fetching + caching for component-library artifacts. Two
// tiers of caching:
//   - Session-memory cache for the two big files (index.json, search.json)
//     so re-opening the sidebar is instant.
//   - Per-slug Map for full records — a re-opened detail view or re-insert
//     of the same component doesn't re-fetch.

import type { ComponentFull, ComponentIndex } from "./types";

const DATA_ROOT = "/data/components";

let indexPromise: Promise<ComponentIndex> | null = null;
let searchJsonPromise: Promise<string> | null = null;
const fullCache = new Map<string, Promise<ComponentFull>>();

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

export function getComponentIndex(): Promise<ComponentIndex> {
  if (!indexPromise) {
    indexPromise = fetchJson<ComponentIndex>(`${DATA_ROOT}/index.json`).catch(
      (e) => {
        // Clear the cached failure so the next open can retry (e.g. if the
        // ingest finished mid-session on the dev server).
        indexPromise = null;
        throw e;
      }
    );
  }
  return indexPromise;
}

// Raw search.json string — consumed by `search.ts`'s MiniSearch.loadJSON.
// We keep it as text so we don't double-parse it (minisearch.loadJSON expects
// the string, not a parsed object).
export function getSearchJson(): Promise<string> {
  if (!searchJsonPromise) {
    searchJsonPromise = fetch(`${DATA_ROOT}/search.json`, {
      cache: "force-cache",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status} search.json`);
        return res.text();
      })
      .catch((e) => {
        searchJsonPromise = null;
        throw e;
      });
  }
  return searchJsonPromise;
}

export function getComponentFull(slug: string): Promise<ComponentFull> {
  const cached = fullCache.get(slug);
  if (cached) return cached;
  const p = fetchJson<ComponentFull>(`${DATA_ROOT}/${slug}.json`).catch((e) => {
    fullCache.delete(slug);
    throw e;
  });
  fullCache.set(slug, p);
  return p;
}

// Test-only / dev hook — useful when the ingest finishes and we want to pick
// up the new artifacts without a page reload.
export function resetComponentCache(): void {
  indexPromise = null;
  searchJsonPromise = null;
  fullCache.clear();
}
