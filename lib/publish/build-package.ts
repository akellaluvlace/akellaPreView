// Orchestrator for the Publish flow. Takes a Dropin workspace's current
// source + (for JSX mode) the captured iframe HTML, and produces a zip
// Blob the user can drag onto Netlify Drop.
//
// HTML mode: the source IS the publishable page — Dropin's HTML
// templates are full <!DOCTYPE html> documents with a Tailwind CDN link
// embedded. Strip OIDs (defensive — HTML mode shouldn't have any but
// the helper is idempotent) and zip.
//
// JSX mode: the source compiles to React inside the iframe via Babel-
// standalone + React UMD. Shipping the source as-is would not load
// without the same runtime. Instead, the caller captures the iframe's
// post-render outerHTML and passes it as `iframeHtml`; we sanitize out
// every Dropin-internal marker (OIDs, selection chrome, runtime <script>)
// and zip the result.
//
// A short README.md ships alongside index.html with the one-line
// instruction for what to do with the file. Vibecoders don't have a
// developer-mental-model of "extract zip then open index.html" — the
// README is the bridge.

import { buildZip, type ZipEntry } from "./zip";
import { sanitizeIframeHtml } from "./sanitize-html";
import { stripOids } from "../ast/oids";

export type PublishKind = "html" | "jsx";

export interface PublishOptions {
  code: string;
  kind: PublishKind;
  filename: string;
  // Required for JSX mode (iframe outerHTML snapshot). For HTML mode
  // ignored.
  iframeHtml?: string;
}

export interface PublishResult {
  blob: Blob;
  zipFilename: string;
  // Tell the caller which path produced the file so the toast can
  // mention the relevant caveat (JSX snapshots bake dynamic content;
  // HTML mode ships the source verbatim).
  mode: "source" | "snapshot";
  // Optional warnings — e.g. "iframeHtml missing for JSX mode, falling
  // back to source which won't render standalone."
  warnings: string[];
}

function slugify(name: string): string {
  // Keep the filename URL-safe + filesystem-safe. Vibecoders may pick
  // weird template names; drop everything that isn't alphanumeric / -
  // / _. Empty-after-slugify falls back to "dropin-site".
  const trimmed = (name || "").trim().toLowerCase();
  const slug = trimmed.replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "dropin-site";
}

const README_TEMPLATE = `# Your Dropin site

This zip contains your site, ready to host.

## Quick host on Netlify Drop (free, no signup)

Two ways — pick whichever is easier:

**A) Drag the unzipped folder (recommended by Netlify):**
1. Unzip this file. You'll get a folder with index.html in it.
2. Go to https://app.netlify.com/drop
3. Drag the folder onto the drop zone.

**B) Drag the zip directly (works too, just slower):**
1. Go to https://app.netlify.com/drop
2. Drag this .zip file straight onto the drop zone.

Either way, Netlify gives you a live URL within seconds.

## Quick host on Vercel (free)

1. Unzip this folder.
2. Go to https://vercel.com/new
3. Drag the unzipped folder into the import panel.

## Quick host anywhere else

The only file you need is index.html. Drop it on any static host
(GitHub Pages, Cloudflare Pages, S3, your own server) and you're live.

## What's inside

- index.html  — your site
- README.md   — this file
`;

export function buildPublishPackage(opts: PublishOptions): PublishResult {
  const slug = slugify(opts.filename);
  const warnings: string[] = [];
  let indexHtml: string;
  let mode: PublishResult["mode"];

  if (opts.kind === "html") {
    // HTML templates already hold a full document. stripOids is a no-op
    // on HTML mode (it only walks JSX ASTs) but we call it defensively
    // for the rare case a caller hands us a hybrid blob.
    indexHtml = stripOids(opts.code).source;
    mode = "source";
  } else {
    // JSX mode requires the iframe snapshot. The threshold catches
    // "iframe rebuild in progress" / cross-origin throw / about:blank
    // states where snapshotHtml returned a near-empty doctype-only
    // string. A real rendered template — even the most minimal one —
    // is well over 200 chars after Tailwind CDN + React UMD bootstrap.
    if (!opts.iframeHtml || opts.iframeHtml.length < 200) {
      // Defensive fallback — ship the raw JSX with a clear warning.
      // This won't render standalone, but the user gets SOMETHING
      // back rather than a silent failure. Toast surfaces the warning.
      warnings.push(
        "Couldn't capture the rendered page from the preview — published " +
          "zip contains the JSX source instead, which needs a build step " +
          "to host. Try clicking Publish again, or switch to a hosting " +
          "platform that builds React (Vercel + Next.js).",
      );
      indexHtml = stripOids(opts.code).source;
      mode = "source";
    } else {
      const sanitized = sanitizeIframeHtml(opts.iframeHtml);
      indexHtml = sanitized.html;
      mode = "snapshot";
    }
  }

  const entries: ZipEntry[] = [
    { path: "index.html", content: indexHtml },
    { path: "README.md", content: README_TEMPLATE },
  ];
  const blob = buildZip(entries);
  return {
    blob,
    zipFilename: `${slug}.zip`,
    mode,
    warnings,
  };
}
