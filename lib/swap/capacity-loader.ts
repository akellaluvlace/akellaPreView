// Phase E proper — Capacity-record loader.
//
// Phase E proper's ingest pipeline writes a JSON file
// `data/component-capacities.json` keyed by component id with each
// asset's measured `SlotCapacity`. This module is the PURE PARSER:
// validates the JSON shape, normalises into a typed Map, and provides
// the lookup function the LibraryModal filter uses.
//
// Schema is versioned via a phantom-typed `schemaVersion: 1` literal so
// future format bumps require an explicit discriminated-union arm
// (audit F4 lesson — `lib/files/storage.ts` shipped this pattern;
// reapplying here at v1 keeps the same bug class out of the new
// pipeline).
//
// Pure-logic only. No fetch — caller hands the parsed JSON in.

import type {
  SlotCapacity,
  SlotCategory,
  SlotFlexBehavior,
  SlotIntrinsic,
  SlotCapacitySource,
} from "./slot-capacity";
import { inferCapacityFromClasses } from "./capacity-from-source";

// Versioned wire shape. The exported parser only accepts schemaVersion=1
// today; future v2 must add an arm to the discriminated union AND a
// branch in `parseCapacityFile`.
export interface CapacityFileV1 {
  readonly schemaVersion: 1;
  readonly generatedAt: string;
  readonly records: ReadonlyArray<CapacityRecordV1>;
}

export interface CapacityRecordV1 {
  readonly assetId: string;
  readonly category: SlotCategory;
  readonly intrinsic: SlotIntrinsic;
  readonly flexBehavior: SlotFlexBehavior;
  readonly source: SlotCapacitySource;
}

export type CapacityFile = CapacityFileV1;

export type ParseCapacityResult =
  | {
      ok: true;
      records: Map<string, SlotCapacity>;
      generatedAt: string;
      schemaVersion: 1;
    }
  | { ok: false; error: string };

const VALID_FLEX = new Set<SlotFlexBehavior>(["fill", "fit-content", "fixed"]);
const VALID_SOURCE = new Set<SlotCapacitySource>(["library", "user-extracted"]);
const VALID_CATEGORY = new Set<SlotCategory>([
  "components",
  "media",
  "icons",
  "unknown",
]);

function isStringNonEmpty(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isNullOrFiniteNumber(v: unknown): v is number | null {
  if (v === null) return true;
  return typeof v === "number" && isFinite(v);
}

function validateIntrinsic(raw: unknown): SlotIntrinsic | string {
  if (!raw || typeof raw !== "object") {
    return "intrinsic must be an object";
  }
  const r = raw as Record<string, unknown>;
  for (const key of [
    "minWidthPx",
    "minHeightPx",
    "maxWidthPx",
    "maxHeightPx",
    "aspectRatio",
  ]) {
    if (!isNullOrFiniteNumber(r[key])) {
      return `intrinsic.${key} must be a finite number or null`;
    }
  }
  return {
    minWidthPx: r.minWidthPx as number | null,
    minHeightPx: r.minHeightPx as number | null,
    maxWidthPx: r.maxWidthPx as number | null,
    maxHeightPx: r.maxHeightPx as number | null,
    aspectRatio: r.aspectRatio as number | null,
  };
}

function validateRecord(raw: unknown): SlotCapacity & { assetId: string } | string {
  if (!raw || typeof raw !== "object") return "record must be an object";
  const r = raw as Record<string, unknown>;

  if (!isStringNonEmpty(r.assetId)) return "record.assetId must be a non-empty string";
  if (!VALID_CATEGORY.has(r.category as SlotCategory)) {
    return `record.category invalid (got ${JSON.stringify(r.category)})`;
  }
  if (!VALID_FLEX.has(r.flexBehavior as SlotFlexBehavior)) {
    return `record.flexBehavior invalid (got ${JSON.stringify(r.flexBehavior)})`;
  }
  if (!VALID_SOURCE.has(r.source as SlotCapacitySource)) {
    return `record.source invalid (got ${JSON.stringify(r.source)})`;
  }

  const intrinsic = validateIntrinsic(r.intrinsic);
  if (typeof intrinsic === "string") return `record.${intrinsic}`;

  return {
    assetId: r.assetId,
    category: r.category as SlotCategory,
    flexBehavior: r.flexBehavior as SlotFlexBehavior,
    source: r.source as SlotCapacitySource,
    intrinsic,
  };
}

export function parseCapacityFile(raw: unknown): ParseCapacityResult {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "root must be a JSON object" };
  }
  const file = raw as Record<string, unknown>;

  if (file.schemaVersion !== 1) {
    return {
      ok: false,
      error: `unsupported schemaVersion: ${JSON.stringify(file.schemaVersion)} (expected 1)`,
    };
  }
  if (!isStringNonEmpty(file.generatedAt)) {
    return { ok: false, error: "generatedAt must be a non-empty string" };
  }
  if (!Array.isArray(file.records)) {
    return { ok: false, error: "records must be an array" };
  }

  const map = new Map<string, SlotCapacity>();
  for (let i = 0; i < file.records.length; i++) {
    const validated = validateRecord(file.records[i]);
    if (typeof validated === "string") {
      return { ok: false, error: `records[${i}]: ${validated}` };
    }
    const { assetId, ...capacity } = validated;
    if (map.has(assetId)) {
      return {
        ok: false,
        error: `records[${i}]: duplicate assetId "${assetId}"`,
      };
    }
    map.set(assetId, capacity);
  }

  return {
    ok: true,
    records: map,
    generatedAt: file.generatedAt,
    schemaVersion: 1,
  };
}

// Look up an asset's capacity. Three-tier resolution:
//   1. Records map (from ingest-time measurement) — most accurate
//   2. Static analysis from `fallbackClasses` (heuristic, source="user-extracted")
//   3. Null when neither is available (caller uses `unconstrainedCapacity`)
//
// The `category` argument lets the LibraryModal pass the asset's own
// category (it knows from its sidebar tabs) so the static-analysis
// fallback gets a meaningful category instead of "unknown".
export function lookupCapacity(
  records: ReadonlyMap<string, SlotCapacity> | null,
  assetId: string | null | undefined,
  fallbackClasses: string | null | undefined = null,
  category: SlotCategory = "unknown",
): SlotCapacity | null {
  if (records && typeof assetId === "string" && assetId.length > 0) {
    const hit = records.get(assetId);
    if (hit) return hit;
  }
  if (typeof fallbackClasses === "string" && fallbackClasses.length > 0) {
    return inferCapacityFromClasses(fallbackClasses, { category });
  }
  return null;
}

// Serialize a Map<assetId, SlotCapacity> back into the V1 wire shape.
// Useful for the ingest pipeline (writes the produced map) and for tests
// (round-trip verification: parse → serialize → parse identical-shape).
export function serializeCapacityFile(
  records: ReadonlyMap<string, SlotCapacity>,
  generatedAt: string,
): CapacityFileV1 {
  const out: CapacityRecordV1[] = [];
  // Stable order: bytewise sort by assetId. Same convention as
  // `lib/files/operations.ts`'s `listFiles` — deterministic across runs
  // so the JSON file in git doesn't diff-noise on regeneration.
  const ids = Array.from(records.keys()).sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
  for (const assetId of ids) {
    const cap = records.get(assetId)!;
    out.push({
      assetId,
      category: cap.category,
      intrinsic: cap.intrinsic,
      flexBehavior: cap.flexBehavior,
      source: cap.source,
    });
  }
  return {
    schemaVersion: 1,
    generatedAt,
    records: out,
  };
}

// Constants exported for tests + consumer validation. The validator sets
// are the single source of truth for "what values are accepted."
export const CAPACITY_LOADER_CONSTANTS = {
  VALID_FLEX,
  VALID_SOURCE,
  VALID_CATEGORY,
  CURRENT_SCHEMA_VERSION: 1 as const,
} as const;
