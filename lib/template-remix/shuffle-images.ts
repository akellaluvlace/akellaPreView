// 2026-05-15 — Template remix v1: image shuffle.
//
// Walks a JSX/HTML source string, finds every <img> tag with a LITERAL
// src + alt attribute (both quoted strings — JSX-expression src/alt
// gets skipped because we have no static query to send), fetches a
// fresh Pixabay photo per alt text in parallel, and rewrites the src
// values atomically. The caller commits the returned source via the
// existing setCode path so undo restores everything in a single step.
//
// Why regex over Babel AST: this is a string-level transform that
// preserves the entire source byte-for-byte except for the src values.
// Babel + magic-string would parse, walk, edit, serialize — same
// outcome, more risk (parse failures on in-progress edits, JSX text
// formatting changes, etc.). Regex is the right tool here.
//
// Failure modes:
//   - No imgs found → returns { source, count: 0, skipped: 0 }
//   - Pixabay 503 (no key) → bail with error message; source unchanged
//   - Network failure on any image → that image stays, others swap
//   - Empty result for a query → that image stays
//   - <img src={expr}> (JSX expression) → skipped, counted in `skipped`
//   - <img> with no alt → skipped, counted in `skipped`

export interface ShuffleImagesResult {
  source: string;
  shuffled: number;
  skipped: number;
  // Set when the whole operation couldn't proceed (e.g. Pixabay not
  // configured). Per-image failures don't populate this; they just
  // leave that img unchanged.
  fatalError: string | null;
}

interface ImgMatch {
  // Full source span of the matched quoted URL, used for slicing.
  fullStart: number;
  fullEnd: number;
  // The URL VALUE span (inside the quotes), so we can splice in a new
  // URL while preserving surrounding quote chars.
  srcValueStart: number;
  srcValueEnd: number;
  // Derived Pixabay query for this image (priority: adjacent context
  // keyword's literal value > filename slug > "abstract texture").
  altText: string;
  // Reserved for future use (image favorites — task #14). Stays null
  // for now since the v2 scanner doesn't extract OIDs from photo-URL-
  // anywhere matches.
  oid: string | null;
}

interface PixabayHit {
  webformatURL: string;
  largeImageURL: string;
}

// 2026-05-15 v3 — Universal photo-URL scanner. Match ANY quoted http(s)
// URL in source, then post-filter to keep only ones that look like
// photos. Two heuristics:
//   1. URL hostname contains a known photo-service substring (Unsplash,
//      Pexels, Pixabay, Cloudinary, Imgix, Imagekit, AWS S3/CloudFront,
//      Google AI Studio exports).
//   2. URL path/query indicates an image — ends with .jpg / .jpeg /
//      .png / .webp / .gif / .avif (optionally followed by ?query),
//      OR contains `/photo`, `/image`, `/photos`, `/images` in the
//      path.
// Either heuristic qualifies; we err on the side of MORE shufflable
// (the worst case for a false positive is "we replaced a non-photo
// URL with a Pixabay photo", which Undo restores in one click).
//
// v1 + v2 used a strict CDN allowlist which left real templates with
// "no photos found" toasts. Per user 2026-05-15: "it should work for
// any template" — fair point, the allowlist was the wrong design.
const ANY_URL_REGEX = /(["'`])(https?:\/\/[^"'`\s]+?)\1/gs;
const PHOTO_HOST_HINTS = [
  "unsplash.com",
  "pexels.com",
  "pixabay.com",
  "cloudinary.com",
  "imgix.net",
  "imagekit.io",
  "amazonaws.com",
  "cloudfront.net",
  "googleusercontent.com/aida-public",
];
// Path/query hints that strongly indicate an image even when the
// hostname isn't recognized. Lowercased before comparison.
const PHOTO_PATH_HINTS = [
  "/photo",
  "/photos",
  "/image",
  "/images",
];
const PHOTO_EXT_REGEX = /\.(?:jpe?g|png|webp|gif|avif)(?:[?#]|$)/i;
function looksLikePhotoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  for (const host of PHOTO_HOST_HINTS) {
    if (lower.includes(host)) return true;
  }
  if (PHOTO_EXT_REGEX.test(lower)) return true;
  // Strip query string for path-hint matching so `/photos/?id=1` still
  // hits `/photos`.
  const pathOnly = lower.split(/[?#]/)[0]!;
  for (const hint of PHOTO_PATH_HINTS) {
    if (pathOnly.includes(hint)) return true;
  }
  return false;
}
// Context keys we'll scan for in the ~250 chars before the URL. Each
// captures a literal string value via the same quote-style as the URL.
const CONTEXT_LOOKBEHIND_CHARS = 250;
const CONTEXT_KEY_REGEX =
  /\b(alt|title|body|caption|name|chip|description|label|heading)\s*[:=]\s*(["'`])([^"'`]{3,120})\2/g;

// 2026-05-15 — Derive a Pixabay query from a literal src URL when the
// img has no usable alt text. Photo URLs typically contain descriptive
// slugs (`abstract-texture-3.jpg`, `mountain_sunrise.jpg`). Strip the
// host, extension, and trailing digits/uuids; convert dashes /
// underscores to spaces; cap at first 4 meaningful words so we don't
// hand Pixabay a noisy filename like "photo-1576091160550-2173dba999ef".
//
// Returns null when nothing recognizable remains (purely numeric /
// uuid-style filenames like Unsplash's `photo-<id>.jpg`). Caller falls
// back to a generic query when this returns null.
function queryFromFilename(srcUrl: string): string | null {
  // Strip query / fragment + protocol + host so we're working with the
  // path only.
  let path: string;
  try {
    const parsed = new URL(srcUrl, "https://example.com");
    path = parsed.pathname;
  } catch {
    path = srcUrl;
  }
  // Last segment, strip extension.
  const lastSlash = path.lastIndexOf("/");
  let leaf = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;
  leaf = leaf.replace(/\.[a-z0-9]{1,5}$/i, "");
  // Replace separators with spaces. Collapse runs.
  let words = leaf
    .replace(/[-_.+%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Drop tokens that are purely numeric / hex-ish (image IDs). Keep
  // alpha-starting tokens of length ≥ 3.
  const cleaned = words
    .split(" ")
    .filter((w) => /^[a-zA-Z][a-zA-Z]{2,}/.test(w))
    .slice(0, 4)
    .join(" ");
  return cleaned.length >= 3 ? cleaned : null;
}

// 2026-05-15 v2 — Find every photo URL in source. Walks the source for
// any quoted string matching a known photo CDN pattern. For each match,
// looks back up to CONTEXT_LOOKBEHIND_CHARS for an adjacent context
// keyword (alt/title/body/caption/name/chip/description/label/heading)
// and uses its value as the Pixabay query. Falls back to the
// filename-derived slug, then "abstract texture".
//
// Skipped count is now ~always 0 (any literal URL matching a known CDN
// is shufflable). The "variable src" warning surfaces only when the
// template has NO literal photo URLs at all — which would be unusual.
function findShufflableImgs(source: string): {
  matches: ImgMatch[];
  skipped: number;
} {
  const matches: ImgMatch[] = [];
  ANY_URL_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ANY_URL_REGEX.exec(source)) !== null) {
    const url = m[2]!;
    if (!looksLikePhotoUrl(url)) continue;
    // The opening-quote position (m.index) anchors the whole match.
    // The URL value sits AFTER the opening quote, ENDS at the closing
    // quote. Splice positions exclude the surrounding quote chars so
    // we preserve quote style (and don't accidentally swap a double-
    // for a single-quoted string).
    const matchStart = m.index;
    const matchEnd = matchStart + m[0].length;
    const urlStart = matchStart + 1; // skip opening quote
    const urlEnd = urlStart + url.length;
    // Derive query: priority is (1) nearby context keyword's literal
    // value, (2) filename slug, (3) generic fallback.
    const ctxQuery = nearestContextValue(source, matchStart);
    const filenameQuery = ctxQuery ? null : queryFromFilename(url);
    let queryText = ctxQuery || filenameQuery || "abstract texture";
    if (queryText.length < 3) queryText = "abstract texture";
    matches.push({
      fullStart: matchStart,
      fullEnd: matchEnd,
      srcValueStart: urlStart,
      srcValueEnd: urlEnd,
      altText: queryText,
      oid: null,
    });
  }
  return { matches, skipped: 0 };
}

// 2026-05-15 — Walk back from `pos` looking for a context keyword
// (`title:`, `alt="…"`, etc.) within CONTEXT_LOOKBEHIND_CHARS. Returns
// the LAST matched keyword's value (closest to the URL) so the query
// reflects the URL's nearest semantic neighbor in source order.
// Returns null when nothing matches.
function nearestContextValue(source: string, pos: number): string | null {
  const start = Math.max(0, pos - CONTEXT_LOOKBEHIND_CHARS);
  const window = source.slice(start, pos);
  CONTEXT_KEY_REGEX.lastIndex = 0;
  let best: { offset: number; value: string } | null = null;
  let cm: RegExpExecArray | null;
  while ((cm = CONTEXT_KEY_REGEX.exec(window)) !== null) {
    const value = cm[3]!.trim();
    if (value.length < 3) continue;
    // Pick the LATEST (highest-offset) match — closest to the URL.
    if (!best || cm.index > best.offset) {
      best = { offset: cm.index, value };
    }
  }
  if (!best) return null;
  // Cap query to first ~8 words so Pixabay's title-match scoring stays
  // focused on the conceptual hook rather than a full sentence.
  return best.value.split(/\s+/).slice(0, 8).join(" ");
}

async function fetchPixabayPick(
  query: string,
  recent: ReadonlySet<string>,
): Promise<string | null> {
  // Random page 1..5 — matches the per-image Shuffle button strategy
  // in ImageControls so the picks feel consistent across both surfaces.
  const page = 1 + Math.floor(Math.random() * 5);
  const params = new URLSearchParams({
    q: query,
    per_page: "20",
    page: String(page),
    orientation: "horizontal",
  });
  let res: Response;
  try {
    res = await fetch(`/api/assets/pixabay?${params.toString()}`);
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const body = (await res.json().catch(() => null)) as
    | { hits?: PixabayHit[] }
    | null;
  const hits = body?.hits ?? [];
  if (hits.length === 0) return null;
  const fresh = hits.filter((h) => !recent.has(h.webformatURL));
  const pool = fresh.length > 0 ? fresh : hits;
  const pick = pool[Math.floor(Math.random() * pool.length)]!;
  return pick.webformatURL || pick.largeImageURL || null;
}

export async function shuffleImages(
  source: string,
  // Optional progress callback. Called once per image as it resolves
  // (regardless of success / failure) so the UI can update an
  // "Shuffling 3 of 8…" counter without polling.
  onProgress?: (done: number, total: number) => void,
): Promise<ShuffleImagesResult> {
  const { matches, skipped } = findShufflableImgs(source);
  if (matches.length === 0) {
    return { source, shuffled: 0, skipped, fatalError: null };
  }
  // Probe Pixabay availability before kicking off the parallel fetch.
  // If the proxy is unconfigured we want a single clean error message
  // instead of N identical per-image failures.
  try {
    const probe = await fetch(`/api/assets/pixabay?q=__probe__`);
    if (probe.status === 503) {
      return {
        source,
        shuffled: 0,
        skipped,
        fatalError:
          "Pixabay isn't configured — add PIXABAY_API_KEY to .env.local + restart the dev server.",
      };
    }
  } catch {
    return {
      source,
      shuffled: 0,
      skipped,
      fatalError: "Couldn't reach the image service — check your network.",
    };
  }
  // Dedup recent picks across the same source so back-to-back
  // shuffles don't repeat photos within ONE template.
  const recent = new Set<string>();
  let done = 0;
  const picks = await Promise.all(
    matches.map(async (m) => {
      const next = await fetchPixabayPick(m.altText, recent);
      if (next) recent.add(next);
      done += 1;
      onProgress?.(done, matches.length);
      return next;
    }),
  );
  // Splice from the END so earlier indices stay valid as we rewrite.
  let out = source;
  let shuffled = 0;
  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const m = matches[i]!;
    const newSrc = picks[i];
    if (!newSrc) continue; // per-image failure — leave it alone
    out =
      out.slice(0, m.srcValueStart) + newSrc + out.slice(m.srcValueEnd);
    shuffled += 1;
  }
  return { source: out, shuffled, skipped, fatalError: null };
}
