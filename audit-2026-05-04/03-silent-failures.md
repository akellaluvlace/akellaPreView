# Silent Failures Audit — Dropin (Next.js + TypeScript)

Scope: lib/tree-persistence.ts, components/ElementTree.tsx, lib/preview.ts,
components/Workspace.tsx, lib/ast/operations/*, plus selected library/iframe
helpers.

Date: 2026-05-04. Audit basis: existing codebase — NOT a PR review.

---

## 1. Catch-block census

| File                                     | `} catch` count | Empty / `=> {}` |
| ---------------------------------------- | --------------: | --------------: |
| lib/tree-persistence.ts                  |              71 |               4 |
| lib/preview.ts (host-side + iframe IIFE) |              26 |              ~9 |
| components/ElementTree.tsx               |               4 |               1 |
| components/Workspace.tsx                 |              10 |               2 |
| components/SelectionOverlay.tsx          |               3 |               0 |
| lib/ast/operations/*                     |              13 |               0 |
| lib/ast/{query,oids,scope,style-source-read,component-def,patch-class-by-oid}.ts |  6  |               0 |
| Asset-library / library-panel sub-panels |             ~12 |              ~3 |

Plus six fire-and-forget `.catch(() => {})` patterns in
ElementTree.tsx, Workspace.tsx, and UnsplashPanel.tsx.

The audit treats each catch as one of three kinds:

1. **Legitimate graceful degradation**: SSR guards, no-storage browsers
   (private mode / quota), `setPointerCapture` on already-released pointer,
   detached-DOM `getBoundingClientRect`. These are correctly silent.
2. **Hidden but recoverable**: catches where the failure is genuinely
   un-actionable for the end user, but a `console.warn` would help a
   developer debug a regression. Fixable cheap.
3. **Silent real bugs**: catches where the user is actively trying to do
   something and the action fails with no user-visible signal. These are
   the dangerous ones.

### lib/tree-persistence.ts breakdown (71 catches)

Of the 71, **~67 are legitimate** localStorage-unavailable handlers. The
pattern is uniform:

```ts
export function readStoredFoo(): Foo {
  if (typeof window === "undefined") return DEFAULT;
  try {
    return parseFoo(window.localStorage.getItem(KEY_FOO));
  } catch {
    return DEFAULT;
  }
}
```

A throw from `localStorage.getItem` only happens on (a) private mode in
some Safari versions, (b) `SecurityError` when `dom.storage.enabled = false`,
or (c) quota errors on `setItem`. Falling back to in-memory state is the
correct UX. The 67 catches here legitimately stay silent.

The 4 outliers worth noting:

- **lib/tree-persistence.ts:1778** — `JSON.parse` catch in
  `parseStoragePanelExportJsonDetail` correctly captures the error and
  surfaces a verbatim reason via the discriminated-union return. Good.
- **lib/tree-persistence.ts:3141** — `new RegExp` catch in
  `tryCompileFilterRegexDetail` returns the SyntaxError message verbatim.
  Good.
- **lib/tree-persistence.ts:1859** — `parseStoragePanelExportJson` (legacy
  shape) returns null on JSON.parse failure with no logging. The detailed
  variant exists, so the call sites that don't use it lose the failure
  reason. Acceptable but worth adding a `console.debug` for dev parity.
- **lib/tree-persistence.ts:3200** — `splitOnMatchedRegex` catches
  `new RegExp(regex.source, flags)` failure. The original regex had
  already compiled (the helper is only called with a valid regex), so this
  catch is dead in practice. Either remove or `console.warn` since hitting
  it would indicate a programming error in the caller, not user input.

### components/ElementTree.tsx (4 catches)

All four are reasonable graceful degradation: rail-width localStorage
read, `setPointerCapture` on stray pointer, history.replaceState in a
locked-down iframe, and one storage write. The component has bigger
silent-failure risks in its `.then(_, () => {})` patterns than in its
catches (see top-10 list).

### lib/ast/operations/* (13 catches)

**All 13 are correctly handled.** Every operation file follows the same
pattern:

```ts
let ast: any;
try { ast = parse(source, PARSE_OPTS); }
catch (e) {
  return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
}
```

Workspace.tsx then surfaces every `result.reason` via `showWarn` toast
(see lines 572, 587, 652, 673, 784, 812, 891, 952, 1083, 1104, 1138,
1195, 1224, 1316, 1360, 1413, 1455, 1492, 1524, 1551, 1620). The toast
is bottom-of-workspace, 3.2s timer, ⚠ icon. This part of the codebase is
exemplary.

The exception is **multi-element handlers** — see #4 in the top-10.

### components/Preview.tsx (no try/catch, but quiet failures)

`postToIframe` (line 521) silently no-ops when `frame.contentWindow` is
null. This happens during iframe rebuild — legitimate. But the iframe
message handler at line 875 logs "orphan layout-context response" etc.
when a request times out, which is the right pattern; the no-op
postMessage is the only silent path here.

---

## 2. Top 10 silent-failure sites

Severity legend: CRITICAL = silent action loss; HIGH = poor user
feedback; MEDIUM = developer debugging pain only.

### #1 — components/Workspace.tsx:833 — clipboard copy element

**Severity**: HIGH

```ts
navigator.clipboard.writeText(cleaned).catch(() => {});
```

**Pattern**: Fire-and-forget promise with empty catch. User clicks "Copy
element"; if Firefox / strict permissions / non-focused tab denies
clipboard, the user sees a successful click and an empty clipboard.

**Hidden errors**: `NotAllowedError` (permission denied / non-focused
tab), `SecurityError` (insecure context), DOMException (browser hard
denial). All are user-actionable — they could refocus, grant
permission, or use download instead.

**User impact**: Pastes nothing into chat / next file. No way to know
why. Most disorienting on Safari where clipboard requires direct
user-gesture chain.

**Fix**: surface via the existing `showWarn` toast.

```ts
navigator.clipboard.writeText(cleaned).catch((e) => {
  showWarn(`Copy failed: ${e instanceof Error ? e.message : "clipboard unavailable"}`);
});
```

---

### #2 — components/Workspace.tsx:2596 — header copy button (FocusEditor / preview header)

**Severity**: HIGH

```ts
async function handleCopy() {
  try {
    await navigator.clipboard.writeText(exportSource());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  } catch {
    // Clipboard may be unavailable in some contexts; swallow silently.
  }
}
```

**Pattern**: Identical to #1 — silent failure on clipboard denial. The
user sees no "Copied!" feedback flash because `setCopied(true)` is
inside the try, but they also get no error feedback.

**Hidden errors**: same as #1 — NotAllowedError, SecurityError, missing
clipboard API on older browsers.

**User impact**: The "Copy" button visually no-ops. No way to know
their snapshot wasn't actually copied. A user clicks "Copy", switches
to chat, pastes, and gets the previous clipboard contents — silently
bad.

**Fix**: 

```ts
} catch (e) {
  showWarn(e instanceof Error ? `Copy failed: ${e.message}` : "Copy failed");
}
```

---

### #3 — lib/preview.ts:2335 — relative imports silently stripped

**Severity**: CRITICAL

```ts
// Relative or absolute path: silently strip (we can't resolve them).
var first = pkg.charAt(0);
if (first === '.' || first === '/') continue;
```

**Pattern**: User's JSX template `import Foo from "./Foo"` gets the
import removed by the preamble walker. The identifier `Foo` is now
unbound; the next line that uses `Foo` throws `ReferenceError: Foo is
not defined` at iframe runtime, caught by `showError(e)` (line 2522-3),
which displays a generic "Foo is not defined" without explaining that
the cause was a stripped relative import.

The unsupported-package branch right below DOES surface a clear error
(line 2455-60); the relative-import branch silently drops them.

**Hidden errors**: any user-pasted JSX with relative imports — common
in AI-generated multi-file output.

**User impact**: A vibecoder pastes `import {Header} from "./Header"; ...
<Header />` and sees "Header is not defined" with no hint that their
import was eaten. Hours of debugging frustration.

**Fix**: Track relative imports in a separate array and throw the same
"unsupported imports" message:

```ts
if (first === '.' || first === '/') {
  if (!seenPkg[pkg]) { seenPkg[pkg] = true; relativeImports.push(pkg); }
  continue;
}
// ...later, alongside the unsupported-throw:
if (relativeImports.length) {
  throw new Error(
    'Relative imports not supported in playground:\n  ' + relativeImports.join(', ') +
    '\n\nDropin runs templates as a single self-contained file.'
  );
}
```

---

### #4 — components/Workspace.tsx:1665, 1490, 1548, 1313, 1410, 986, 1046, 1205, 1221 — multi-op silent partial failures

**Severity**: HIGH

```ts
// multi-insert / multi-delete / multi-duplicate / multi-reorder /
// multi-reparent / multi-resize / multi-spacing / mixed-DnD all share:
for (const oid of oids) {
  const r = applyX(next, op);
  if (r.unchanged) {
    if (r.reason) {
      log("multi-X: one op bailed (continuing)", { oid, reason: r.reason });
    }
    continue;
  }
  next = r.source;
  committed++;
}
// Only an aggregate count toast at the end.
```

**Pattern**: Multi-element batch ops log per-op bail reasons via `log()`
(which is `console.debug`-level, gated by a localStorage flag) and
swallow them at the toast layer. The user gets a single "Inserted into
3 elements" with no indication that 2 of 5 silently bailed.

**Hidden errors**: per-element parse failures, oid-not-found
(ghost-row clicks), tag-restriction bails, structural rejections
(reparent into self / descendant). All are actionable but go straight
to the dev console.

**User impact**: User shift-selects 5 elements, runs an action, sees "3
of 5 succeeded" feel from the count diff but doesn't know which 2
failed or why. If they had typo'd a class on one element pre-select,
they have no feedback that it caused the bail.

**Fix**: when `committed < oids.length`, surface a count + first reason
via `showWarn`:

```ts
const failed = oids.length - committed;
if (failed > 0) {
  const firstReason = bailReasons[0] ?? "unknown";
  showWarn(`${committed} of ${oids.length} succeeded. ${failed} bailed (${firstReason})`);
}
```

---

### #5 — components/library/asset-panels/sub-panels/UnsplashPanel.tsx:156 — Unsplash track-download fire-and-forget

**Severity**: MEDIUM

```ts
// Track download per Unsplash ToS (fire-and-forget).
fetch("/api/assets/unsplash/track-download", { ... }).catch(() => {});
```

**Pattern**: Tracking call required by Unsplash ToS, swallowed silently
on failure.

**Hidden errors**: `/api/assets/unsplash/track-download` route 5xx,
network offline, rate-limit (429), CORS. None are user-actionable, but
silent ToS-violation is a legal liability.

**User impact**: User pastes Unsplash photos all day; tracking quietly
fails server-side; Dropin has no visibility that it's stopped tracking.
Unsplash could revoke API access without warning.

**Fix**: at minimum log to `console.warn` so devtools surfaces the
issue. Better: bump a counter in a Sentry-equivalent so post-mortem can
spot the regression.

```ts
fetch("/api/assets/unsplash/track-download", { ... }).catch((e) => {
  console.warn("[unsplash] track-download failed", e);
});
```

---

### #6 — components/ElementTree.tsx:3183-87 + 3372-75 + 3481-83 — clipboard rejection paths swallowed

**Severity**: MEDIUM

```ts
navigator.clipboard.writeText(json).then(
  () => { /* show "copied" badge */ },
  () => {
    // Permission denied / blocked / older browsers without the
    // async clipboard API. Silently no-op — the export-json
    // button is the supported path, and the user can retry.
  },
);
```

**Pattern**: Storage panel's copy-JSON / share-preset / copy-URL all
silently swallow rejection. The comment claims the user can "retry" but
gives no signal that the click did anything.

**Hidden errors**: NotAllowedError, browser without async clipboard API
(now rare).

**User impact**: User clicks Copy, no badge appears, paste somewhere
else gets the previous clipboard. Worse: with no error indicator, they
can't distinguish "copy not yet implemented" from "copy denied".

**Fix**: show a "Copy denied — use Export instead" inline status, same
slot as the existing "copied" badge:

```ts
() => {
  setStoragePanelCopiedAt(0); // clear any stale "copied"
  setStoragePanelCopyError("denied — try Export");
  setTimeout(() => setStoragePanelCopyError(null), 2500);
},
```

---

### #7 — lib/preview.ts:2316 — JSX preamble parse failure returns source unchanged

**Severity**: HIGH

```ts
try {
  ast = Babel.parse(src, { sourceType: 'module', plugins: ['jsx'], errorRecovery: true });
} catch (parseErr) {
  // If the source doesn't even parse as a module, return unchanged
  // and let the downstream Babel.transform throw the real syntax
  // error (which is what the user actually wants to see).
  return { preamble: '', stripped: src, unsupported: [] };
}
```

**Pattern**: Module-shape parse failure falls through with no preamble
generated. The downstream Babel.transform will throw, and `showError`
catches that — but with a confusing message because the user's `import`
statements are still in the source, and `Babel.transform` with
`sourceType: 'script'` chokes on `import` with a "import declarations
may only appear at top level of a module" error that buries the actual
JSX syntax error.

**Hidden errors**: any parse failure that involves both a module-level
issue (rare) and a JSX issue. The thrown error misleads the user about
the real cause.

**User impact**: error message points at "import declarations" instead
of the actual JSX bug.

**Fix**: when fall-through happens, retry the legacy regex strip so at
least imports are removed:

```ts
} catch (parseErr) {
  console.warn('[dropin] preamble parse failed, falling back to legacy strip', parseErr);
  return { preamble: '', stripped: legacyStrip(src), unsupported: [] };
}
```

---

### #8 — lib/preview.ts:2517-20 — re-run scripts catch-all

**Severity**: MEDIUM

```ts
} catch (re) {
  // Init failure shouldn't blank the preview.
  try { console.warn('[dropin] re-run scripts failed', re); } catch (_) {}
}
```

**Pattern**: Re-running `<script>` tags after React mount catches every
error — including malformed external scripts, blocked CDN requests,
inline-script syntax errors. Console.warn is fine for devs; users see
no symptom (icons silently don't render, Alpine Components silently
don't initialize).

**Hidden errors**: Lucide / Alpine load failures, inline-script
ReferenceError, CDN 404, CSP block.

**User impact**: A template using `lucide.createIcons()` paints
empty `<svg>` elements with no error. The user thinks Dropin is
broken.

**Fix**: post a `dropin:error` to the host so the toast surfaces the
warning, since the host already wires `onIframeError` to a toast:

```ts
} catch (re) {
  console.warn('[dropin] re-run scripts failed', re);
  dropinPost({ type: 'dropin:error', message: 're-run scripts failed: ' + (re && re.message) });
}
```

---

### #9 — lib/preview.ts:1991, 2000, 2012 — layout-context / min-content / soft-constraints / drop-targets failures land in `console.warn` only

**Severity**: MEDIUM

```ts
} catch (mcErr) {
  console.warn('[dropin:iframe] min-content query failed', { oid: d.oid, err: String(mcErr) });
}
dropinPost({ type: 'dropin:min-content-result', requestId: d.requestId, result: mcResult });
```

**Pattern**: Iframe-side query failures are warned to the iframe's
console (separate from the host devtools console). Host gets a
`null` result and degrades silently. The user runs into "snap
candidates didn't appear" or "spacing handle won't drag" with no
feedback.

**Hidden errors**: `getComputedStyle` on detached node, querySelector
on a malformed selector (impossible from CSS.escape but defensive),
overflow during rect math.

**User impact**: Resize / spacing / drag gestures degrade to "primitive"
mode with no explanation. The user assumes the feature is broken.

**Fix**: pipe the error through the existing `dropin:error` channel
when the failure prevents user-visible action; keep the warn-only path
for advisory queries:

```ts
} catch (mcErr) {
  console.warn(...);
  dropinPost({ type: 'dropin:error', message: 'min-content query failed: ' + String(mcErr) });
}
```

---

### #10 — components/IsolatedPreview.tsx + components/Preview.tsx postMessage no-op when contentWindow null

**Severity**: MEDIUM (developer debugging only)

```ts
const postToIframe = useCallback((msg: HostToIframeMessage) => {
  const frame = iframeRef.current;
  if (!frame || !frame.contentWindow) return;
  frame.contentWindow.postMessage({ __dropin: true, ...msg }, "*");
}, []);
```

**Pattern**: Silent no-op when frame is unmounted or mid-rebuild. This
is correct behavior for the rebuild race, but a developer debugging
"why didn't my reselect / set-tool / set-group-roots fire" has no
console signal.

**Hidden errors**: race between effect and iframe rebuild, host post
before `dropin:ready`, messages dropped during navigation.

**User impact**: usually none — the next ready event replays state. But
when there's a regression (e.g. ready event misses replay), the host
appears to have sent the message and the iframe never received it.

**Fix**: add a one-line debug log gated by the existing log helper:

```ts
if (!frame || !frame.contentWindow) {
  log("postToIframe dropped (no contentWindow)", { type: msg.type });
  return;
}
```

---

## 3. Patterns that legitimately stay silent

These are correct. Don't change them:

1. **All 67 localStorage `try { window.localStorage.x } catch { return DEFAULT }` patterns in tree-persistence.ts.** Quota / private-mode is unactionable; degrading to in-memory is the right UX. No user toast needed.
2. **`if (typeof window === "undefined") return null`** SSR guards across the codebase. Required for Next.js App Router compatibility.
3. **`setPointerCapture` catch in SelectionOverlay.tsx (1396, 1830, 2242) and ElementTree.tsx (2390).** Throws when the pointer is no longer active; no user-visible consequence.
4. **`getBoundingClientRect` / detached-DOM catches in lib/preview.ts (961, 1151).** Iframe rebuild races; partial results are usable.
5. **`navigator.share` AbortError check in ElementTree.tsx:3398.** User dismissed the OS share sheet — that's a user gesture, not a failure.
6. **`releasePointerCapture` cleanup catch in ElementTree.tsx:2390.** Cleanup-only; throwing during cleanup is meaningless.
7. **EyedropperButton.tsx:54.** `EyeDropper.open()` throws on user-Esc; that's a user action, silent is correct.
8. **Asset-library `recent.ts` IndexedDB catches.** Recents are pure UX nicety; silent degrade is fine.
9. **lib/ast/oids.ts:213, lib/ast/query.ts:61, lib/ast/scope.ts:95, lib/ast/style-source-read.ts:38, lib/ast/component-def.ts:151.** Mid-typing parse failures fall through to "no oids / empty index"; the iframe-side Babel.transform surfaces the real syntax error to the user. Defensive only.
10. **lib/preview.ts iframe `dropinPost` `try { parent.postMessage } catch (e) {}`.** Cross-origin restrictions; can't reach parent in some sandbox configs.

---

## 4. Patterns that should be loud

1. **All clipboard rejection callbacks** (#1, #2, #6) — surface via existing `showWarn` toast. User doesn't know their copy didn't take.
2. **Multi-op partial failures in Workspace** (#4) — surface count of bails alongside count of successes.
3. **JSX preamble's relative-import strip + parse-fallthrough** (#3, #7) — these mislead users into hours of debugging the wrong line.
4. **Iframe-side script re-run failures** (#8) — break Lucide / Alpine templates silently.
5. **Iframe layout-context / min-content / drop-targets query failures** (#9) — degrade gestures with no hint.
6. **Unsplash track-download** (#5) — at least `console.warn` so a regression is grep-able.

---

## 5. Per-site one-line fixes (top-10 summary)

| #   | File:Line                                | Fix                                                                          |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | components/Workspace.tsx:833             | Replace `.catch(() => {})` with `.catch(e => showWarn("Copy failed: " + e))` |
| 2   | components/Workspace.tsx:2596            | Same as #1 — surface via showWarn                                            |
| 3   | lib/preview.ts:2335                      | Track relative imports separately, throw same "unsupported" error            |
| 4   | components/Workspace.tsx multi-handlers  | When committed<oids.length, showWarn with first reason + count               |
| 5   | UnsplashPanel.tsx:156                    | Add `console.warn("[unsplash] track-download failed", e)`                    |
| 6   | ElementTree.tsx:3183/3372/3481           | Set inline error state ("denied — use Export") for 2.5s                      |
| 7   | lib/preview.ts:2316                      | Fall through to `legacyStrip(src)` instead of returning src unchanged        |
| 8   | lib/preview.ts:2517                      | Replace empty fallthrough with `dropinPost({ type: 'dropin:error', ... })`   |
| 9   | lib/preview.ts:1991/2000/2012            | Pipe error through `dropin:error` channel to surface in host toast           |
| 10  | Preview.tsx:521 / IsolatedPreview.tsx    | Add `log("postToIframe dropped", { type })` for debug visibility             |

---

## 6. What's done well (rare positive callout)

- **AST operations consistently surface bail reasons via `unchanged: true; reason: string`**, threaded through Workspace's `showWarn` toast at every consumer site (~20 toast calls). This is the right pattern and the codebase applies it uniformly. Anyone fighting "why didn't delete work" sees a precise reason.
- **Iframe `window.error` and `unhandledrejection` listeners (lib/preview.ts:2031-2043)** forward to host via `dropin:error`. Host wires this to `handleIframeError` → toast. End-to-end coverage of runtime errors.
- **`showWarn` / `showInfo` toast slot is plumbed everywhere** — the infrastructure for surfacing failures exists. The silent failures listed above are mostly missed integrations, not missing infrastructure.
- **`tryCompileFilterRegexDetail` returns the engine's verbatim SyntaxError message.** Power-user friendly.

---

## 7. Methodology notes

- File reads were complete for tree-persistence.ts, lib/preview.ts iframe IIFE region, ElementTree.tsx (catch sites + drag/drop + panel state), Workspace.tsx (catches + toast plumbing + multi-op handlers), and a representative selection of AST operation files. Asset-panel sub-panels were sampled (3 of 13).
- The bench file `scripts/bench-tree-persistence.mjs` was not read per the task's caveat about null bytes.
- No runtime verification was attempted (per CLAUDE.md "debug by reading").
