// Writes the three tiers of JSON artifacts the client reads:
//   /public/data/components/index.json      <- meta only, loaded on first open
//   /public/data/components/search.json     <- serialized MiniSearch index
//   /public/data/components/<slug>.json     <- full record, lazy-loaded
// MiniSearch: fields = title/tags/category. storeFields = id so search results
// can be joined back to the index in-memory. Weights are applied at search
// time from the client, not here — keeps this file dumb.

import { promises as fs } from "node:fs";
import path from "node:path";
import MiniSearch from "minisearch";

export async function writeArtifacts({ outRoot, records }) {
  await fs.mkdir(outRoot, { recursive: true });

  const index = {
    generatedAt: new Date().toISOString(),
    components: records.map((r) => r.meta),
    sources: {},
    categories: [],
    tailwindPlugins: [],
  };

  const categorySet = new Set();
  const pluginSet = new Set();
  for (const r of records) {
    index.sources[r.meta.source] = (index.sources[r.meta.source] || 0) + 1;
    categorySet.add(r.meta.category);
    for (const p of r.meta.tailwindPlugins || []) pluginSet.add(p);
  }
  index.categories = [...categorySet].sort();
  index.tailwindPlugins = [...pluginSet].sort();

  // Write index.json (pretty-printed for diffability in git; it's small).
  await fs.writeFile(
    path.join(outRoot, "index.json"),
    JSON.stringify(index, null, 2),
    "utf-8"
  );

  // Build MiniSearch.
  const ms = new MiniSearch({
    idField: "id",
    fields: ["title", "tags", "category"],
    storeFields: ["id"], // we only need the id; the rest is in index.json
    extractField: (doc, field) => {
      const v = doc[field];
      if (Array.isArray(v)) return v.join(" ");
      return v ?? "";
    },
  });
  ms.addAll(records.map((r) => r.meta));
  // MiniSearch v7 prefers the JSON.stringify path over .toJSON directly; using
  // stringify lets the built-in serialiser run and is what `loadJSON` expects.
  await fs.writeFile(
    path.join(outRoot, "search.json"),
    JSON.stringify(ms),
    "utf-8"
  );

  // Per-slug full records. Flat directory; file count is ~4000-5000 which is
  // fine on modern filesystems and fine for git (git stores blobs, not
  // file-per-file inodes in the pack).
  let written = 0;
  const batch = 50;
  for (let i = 0; i < records.length; i += batch) {
    const chunk = records.slice(i, i + batch);
    await Promise.all(
      chunk.map(async (r) => {
        await fs.writeFile(
          path.join(outRoot, `${r.meta.slug}.json`),
          JSON.stringify(r.full),
          "utf-8"
        );
        written++;
      })
    );
    if (written % 500 === 0) {
      process.stdout.write(`  slug json: ${written}/${records.length}\n`);
    }
  }

  return {
    total: records.length,
    categories: index.categories.length,
    sources: index.sources,
    plugins: index.tailwindPlugins.length,
  };
}
