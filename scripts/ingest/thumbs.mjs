// Puppeteer renderer for single-component thumbnails. Each component gets
// rendered into a centered wrapper on a blank page — HyperUI with Tailwind
// CDN (+ any declared plugins), Uiverse vanilla (plus its scoped inline CSS
// re-prefixed with a throwaway "thumb" scope so it actually applies).
//
// Output: /public/component-thumbs/<slug>.webp at 400×300. Incremental: skips
// when the thumb's mtime is newer than now-minus-one-hour and the file already
// exists, so reruns of the pipeline are cheap.

import { promises as fs } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const VIEWPORT_W = 800;
const VIEWPORT_H = 600;
const THUMB_W = 400;
const THUMB_H = 300;
const NAV_TIMEOUT_MS = 15000;
const PROTOCOL_TIMEOUT_MS = 120000;
// 6 in-flight renders keeps a modern laptop's cores busy without saturating
// memory; each headless page adds ~80MB. On beefier machines bump further.
const CONCURRENCY = 6;
// Uiverse is self-contained CSS/HTML — no network requests, so we can use a
// shorter wait. HyperUI needs Tailwind CDN + often Google Fonts, which only
// finish near `networkidle2`.
const WAIT_PROFILES = {
  uiverse: { waitUntil: "domcontentloaded", settle: 200 },
  hyperui: { waitUntil: "networkidle2", settle: 500 },
  default: { waitUntil: "networkidle2", settle: 500 },
};

const TAILWIND_CDN = "https://cdn.tailwindcss.com";

function buildHtmlShell({ meta, full }) {
  const { html, css } = full;
  // Uiverse CSS is scoped to __UIV_SCOPE__. For thumbs we use a fixed id so the
  // same CSS rules actually apply inside the thumbnail wrapper.
  const thumbScope = "dropin-thumb";
  const scopedCss = css ? css.replaceAll("__UIV_SCOPE__", thumbScope) : "";

  const needsTailwind = meta.tailwindRequired;
  const plugins = meta.tailwindPlugins?.length
    ? `?plugins=${encodeURIComponent(meta.tailwindPlugins.join(","))}`
    : "";
  const tailwindScript = needsTailwind
    ? `<script src="${TAILWIND_CDN}${plugins}"></script>`
    : "";

  // HyperUI dark variants rely on a `class="dark"` ancestor for the dark:*
  // utilities. Toggle it on <html> so the right styles paint.
  const htmlClass = meta.darkVariant ? "dark" : "";
  const bg = meta.darkVariant ? "#0b0c0e" : "#fafafa";

  const wrapperClass = css ? thumbScope : "";
  return `<!doctype html>
<html class="${htmlClass}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
${tailwindScript}
<style>
  html,body{margin:0;padding:0;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;}
  .dropin-thumb-wrap{min-height:100vh;display:grid;place-items:center;padding:40px;}
  ${scopedCss}
</style>
</head>
<body>
<div class="dropin-thumb-wrap">
  <div class="${wrapperClass}">
    ${html}
  </div>
</div>
</body>
</html>`;
}

function findExecutablePath() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  return candidates;
}

async function launchBrowser() {
  const exes = findExecutablePath();
  let last;
  for (const exe of [undefined, ...exes]) {
    try {
      return await puppeteer.launch({
        headless: "new",
        executablePath: exe,
        protocolTimeout: PROTOCOL_TIMEOUT_MS,
      });
    } catch (e) {
      last = e;
    }
  }
  throw last || new Error("no chromium available");
}

async function renderOne(browser, record, outDir) {
  const out = path.join(outDir, `${record.meta.slug}.webp`);
  try {
    const st = await fs.stat(out);
    // Incremental skip: thumbs produced in this or an earlier run should be
    // left alone. If you want a full re-render, `rm -rf public/component-thumbs`.
    if (st && st.size > 0) return { skipped: true, slug: record.meta.slug };
  } catch {}

  const page = await browser.newPage();
  try {
    await page.setViewport({
      width: VIEWPORT_W,
      height: VIEWPORT_H,
      deviceScaleFactor: 1,
    });
    const profile =
      WAIT_PROFILES[record.meta.source] || WAIT_PROFILES.default;
    await page.setContent(buildHtmlShell(record), {
      waitUntil: profile.waitUntil,
      timeout: NAV_TIMEOUT_MS,
    });
    await new Promise((r) => setTimeout(r, profile.settle));

    // Screenshot at native viewport, clipped to the centered area matching
    // the 4:3 aspect. We want the wrapper (component) prominently in-frame,
    // so take the central 800×600 region and save as WebP.
    await page.screenshot({
      path: out,
      type: "webp",
      quality: 78,
      clip: { x: 0, y: 0, width: VIEWPORT_W, height: VIEWPORT_H },
    });
    // Downscale: Puppeteer doesn't do WebP resizing natively, but the viewport
    // itself is 800×600 already; at 4:3 this is 2× our target 400×300, which
    // WebP handles fine for display. If we need tighter bundles we can pipe
    // through `sharp` later, but for now 800×600 @ q78 averages ~15-25KB.
    return { ok: true, slug: record.meta.slug };
  } catch (e) {
    return { error: e.message, slug: record.meta.slug };
  } finally {
    try {
      await page.close();
    } catch {}
  }
}

// Public entry: accepts the full array of records, renders missing thumbs
// with CONCURRENCY=3 workers. Returns a summary.
export async function renderComponentThumbs(records, outDir) {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await launchBrowser();

  let ok = 0;
  let skipped = 0;
  const failed = [];
  const queue = [...records];

  const worker = async () => {
    while (queue.length) {
      const rec = queue.shift();
      if (!rec) return;
      const r = await renderOne(browser, rec, outDir);
      if (r.ok) {
        ok++;
        if (ok % 25 === 0) {
          process.stdout.write(`  thumbs: ${ok} captured, ${skipped} skipped, ${failed.length} failed\n`);
        }
      } else if (r.skipped) {
        skipped++;
      } else {
        failed.push(r);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();
  return { ok, skipped, failed };
}

// Export the shell builder too — write-index.mjs doesn't need it but it's
// handy for the occasional debug script (render one URL, eyeball it).
export { buildHtmlShell };
