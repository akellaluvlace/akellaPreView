// Lightweight IndexedDB store for "recent" asset selections, per kind.
//
// Each panel calls `pushRecent(kind, id, payload)` after a successful insert
// and `getRecents(kind)` to render its "Recent" row. Capped at 12 entries
// per kind; older entries fall off automatically. Pure browser-only — no
// SSR shim, panels are all `"use client"`.
//
// Why IndexedDB and not localStorage: Lucide payloads contain SVG bodies,
// Unsplash payloads contain image URLs + metadata. localStorage would force
// us to JSON-stringify each lookup; IDB stores native objects and stays
// fast as the per-kind list grows.

import { openDB, type IDBPDatabase } from "idb";
import type { RecentKind, RecentRecord } from "./types";

const DB_NAME = "dropin-asset-library";
const DB_VERSION = 1;
const STORE = "recents";
const MAX_PER_KIND = 12;

interface Schema {
  // We don't strictly need the typed-IDB schema since we use string keys, but
  // declaring the store keeps `idb` from issuing 'as any' inside callers.
  recents: {
    key: string; // composite `${kind}:${id}`
    value: RecentRecord;
    indexes: { byKind: string };
  };
}

let dbPromise: Promise<IDBPDatabase<Schema>> | null = null;

function getDb(): Promise<IDBPDatabase<Schema>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("recent.ts only runs in the browser"));
  }
  if (!dbPromise) {
    dbPromise = openDB<Schema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE);
          store.createIndex("byKind", "kind");
        }
      },
    });
  }
  return dbPromise;
}

export async function pushRecent(
  kind: RecentKind,
  id: string,
  payload: unknown
): Promise<void> {
  try {
    const db = await getDb();
    const key = `${kind}:${id}`;
    const record: RecentRecord = { kind, id, payload, insertedAt: Date.now() };
    const tx = db.transaction(STORE, "readwrite");
    await tx.store.put(record, key);
    await tx.done;
    await trimKind(kind);
  } catch (e) {
    // Recents are a UX nicety, not load-bearing — a blocked / private-mode
    // browser shouldn't break inserts. console.debug so devs can diagnose
    // the rare "why don't my recents show" case without surfacing to users.
    debugRecent("pushRecent", kind, e);
  }
}

export async function getRecents(kind: RecentKind): Promise<RecentRecord[]> {
  try {
    const db = await getDb();
    const all = await db.getAllFromIndex(STORE, "byKind", kind);
    return all.sort((a, b) => b.insertedAt - a.insertedAt).slice(0, MAX_PER_KIND);
  } catch (e) {
    debugRecent("getRecents", kind, e);
    return [];
  }
}

export async function clearRecents(kind: RecentKind): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE, "readwrite");
    const keys = await tx.store.index("byKind").getAllKeys(kind);
    for (const k of keys) await tx.store.delete(k);
    await tx.done;
  } catch (e) {
    debugRecent("clearRecents", kind, e);
  }
}

function debugRecent(op: string, kind: RecentKind, e: unknown): void {
  if (typeof console !== "undefined" && console.debug) {
    console.debug(`[asset-library:recent] ${op}(${kind}) failed:`, e);
  }
}

async function trimKind(kind: RecentKind): Promise<void> {
  const db = await getDb();
  const records = await db.getAllFromIndex(STORE, "byKind", kind);
  if (records.length <= MAX_PER_KIND) return;
  const sorted = records.sort((a, b) => b.insertedAt - a.insertedAt);
  const toDelete = sorted.slice(MAX_PER_KIND);
  const tx = db.transaction(STORE, "readwrite");
  for (const r of toDelete) {
    await tx.store.delete(`${r.kind}:${r.id}`);
  }
  await tx.done;
}
