// Type declaration for `extract-root-class.mjs`. The implementation
// lives in the `.mjs` (ESM, runs under raw Node) so the ingest pipeline
// can call it without a build step. This `.d.ts` exists so prod-import
// tests + any future TS consumer get accurate typing on the export.

export function extractRootClassName(html: string | null | undefined): string | null;
