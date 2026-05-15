# Cascade Detach — split `.map()` at index K so one instance edits independently

**Status**: DESIGN ONLY. Not implemented. Greenlight needed before code work starts.
**Effort**: ~1-2 days of focused work.
**Source memory**: `~/.claude/projects/.../memory/project_visual_kind_disambiguation.md` for the related Layer 3 swap-category problem; this plan is the orthogonal cascade-editing problem.

## Problem

The 2026-05-14 morning "Editing all N copies" coral chip documents the cascade limitation: edits to one `.map()`-rendered instance propagate to every rendered copy because they all share one source OID. Industry baseline: Plasmic ships this exact limitation. Onlook too.

User flagged 2026-05-15: "that cascade bug really pissing me off". Wants an escape hatch.

## Why full auto-loop-expansion is NOT this plan

Genuinely-hard cases that NO mature visual editor handles:
- `item.foo` references in callback (data-bound — auto-expand would need to thread the literal value through)
- Nested maps (`outer.map(o => o.children.map(c => <X/>))`)
- Conditional rendering (`x.visible ? <Card/> : null` — DOM index ≠ array index)
- Dynamic data (`useEffect → setItems`)
- Filter chains (`items.filter(x => x.live).map(...)` — visible-index ≠ source-index)

Auto-expand handling ALL of these is multi-day AST surgery with edge cases that probably never fully close. Not this plan.

## What this plan IS

User-triggered **"Detach this instance"** button on the cascade chip. One instance at a time. Bounded scope.

Same pattern Plasmic ships ("detach instance" / "eject from loop"). Acknowledges the cascade for the common path; gives an escape hatch for the user-flagged path.

## Algorithm

Given a `.map()`-rendered instance the user clicked:
- `vibeInfo.oid` — the JSXElement OID inside the callback (shared across all rendered copies)
- DOM-index K — the position of THIS clicked instance among its OID-siblings

Source rewrite:
```jsx
// Before
{items.map((x, i) => <Card key={i} {...x} />)}

// After (K = the clicked index, here K = 2)
{items.slice(0, 2).map((x, i) => <Card key={i} {...x} />)}
{((x) => <Card {...x} />)(items[2])}                       // ← detached: fresh OIDs
{items.slice(3).map((x, i) => <Card key={i + 3} {...x} />)}
```

The middle expression is an IIFE that:
- Invokes the same callback shape (preserves closure over outer scope variables like handlers)
- Passes `items[K]` directly
- The JSX inside gets **fresh OIDs** via `injectOids` so it's distinct from the cascade

The split maps still cascade among themselves (any future edit there ripples to K-1 + K+1+ instances) — that's fine, the user only wanted to detach ONE.

### Key handling

The original callback's `key={i}` references the param's local `i`. After split:
- Left slice: `items.slice(0, K).map((x, i) => ...)` — `i` is 0..K-1, no change needed.
- Right slice: `items.slice(K+1).map((x, i) => ...)` — `i` is 0..N-K-2 locally but React keys need to be globally unique across the three rendered groups. Rewrite `key={i}` → `key={i + K + 1}` in the right slice. **Bail** if the callback uses `i` for anything OTHER than `key` (we'd be re-binding a variable the user's code depends on).
- Middle IIFE: no key needed (single element, not in a list).

If the callback doesn't take a second param (`items.map(x => ...)`), no `i` rewriting needed.

### Param substitution

Most callback bodies reference the first param (`x` / `item` / etc.). The IIFE form `((x) => bodyExpr)(items[K])` preserves the binding without source-substituting. **Don't** try to inline-substitute `items[K]` for `x` in bodyExpr — too many edge cases (member access, destructuring, spread). The IIFE form sidesteps all of them.

### OID regeneration on the detached copy

The detached JSX inherits the callback body's OIDs verbatim — which are the SAME OIDs the remaining cascade instances still use. To make the detached copy editable independently:

1. After byte-level rewrite, run `injectOids` again on the source. But this won't help — `injectOids` is idempotent and won't touch elements that already have OIDs.

2. **Strip OIDs from the detached middle expression FIRST**, then call `injectOids`:
   - Find the middle expression's source range in the rewritten output
   - Apply `stripOids` to that range only
   - Apply `injectOids` to the whole source — fresh OIDs land on the now-OIDless detached copy
   - Existing OIDs everywhere else stay (idempotent)

   This uses both existing functions in `lib/ast/oids.ts` without modification.

### How K is determined

Iframe-side: `document.querySelectorAll('[data-dropin-id="<oid>"]')` returns a NodeList of N rendered instances. The clicked element's position in that NodeList is K.

Already partly available — `vibeInstanceCount(oid)` in `lib/vibe-edit/runtime.ts` does the `querySelectorAll().length` query. Extending to also report the clicked instance's index:

```js
function vibeInstanceIndex(el, oid) {
  if (!oid) return -1;
  var nodes = document.querySelectorAll('[data-dropin-id="' + oid + '"]');
  for (var i = 0; i < nodes.length; i++) if (nodes[i] === el) return i;
  return -1;
}
```

Add `instanceIndex` field to `VibeElementInfo`, populate in `vibeSerialize`. Cost: ~5 LOC.

## AST surgery — step by step

```ts
// lib/ast/operations/detach-from-map.ts (NEW)
interface DetachFromMapOp { oid: string; index: number; }
interface DetachFromMapResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
}

export function applyDetachFromMap(
  source: string,
  op: DetachFromMapOp,
): DetachFromMapResult {
  // 1. Parse source with @babel/parser (existing PARSE_OPTS pattern).
  // 2. Find the JSXOpeningElement carrying op.oid via walkJsxOpenings.
  //    Capture its enclosing JSXElement.
  // 3. Walk UP the AST from that JSXElement to find the nearest
  //    enclosing CallExpression where:
  //      - callee is MemberExpression with property.name === "map"
  //      - the JSXElement lives inside the arrow callback's body
  //    Bail if not found ("element isn't rendered by a .map()").
  // 4. Extract from the CallExpression:
  //      - arrayExpr = callee.object  (source.slice(start, end) verbatim)
  //      - param0 = first arrow param (Identifier or Pattern — both OK)
  //      - param1 = second arrow param if present
  //      - bodyExpr = the JSX root (arrow's body, or the return JSX
  //        inside a BlockStatement body)
  // 5. Bail conditions:
  //      - callback isn't an ArrowFunctionExpression (skip
  //        items.map(renderItem) — named function refs add complexity)
  //      - bodyExpr is NOT a single JSXElement (handles only the
  //        return; skips conditional returns, Fragment with N
  //        children, null returns)
  //      - param1 is referenced anywhere OTHER than as `key={param1}`
  //        (would break the right-slice index rewrite)
  //      - arrayExpr is non-trivial (call chain like
  //        .filter().sort().map() — index K from DOM is filtered-
  //        index, slicing the raw array misaligns)
  //        Concrete detector: arrayExpr is anything other than
  //        Identifier / MemberExpression with no calls.
  // 6. Build replacement source via MagicString. Replace the entire
  //    JSXExpressionContainer (or just the CallExpression if it lives
  //    in a fragment) with three sibling expression containers:
  //      {<arrayExpr>.slice(0, K).map(<callback-with-key-untouched>)}
  //      {((<param0>) => <bodyExpr>)(<arrayExpr>[K])}
  //      {<arrayExpr>.slice(K + 1).map(<callback-with-key-rewritten>)}
  //    The key rewrite is a byte-level swap of `key={<param1>}` →
  //    `key={(<param1>) + (K + 1)}` inside the right-slice's
  //    callback source. Skip when param1 absent.
  // 7. Run stripOids on the middle expression's source range, then
  //    injectOids on the whole rewritten source.
  // 8. Return { source: out, unchanged: false, reason: null }.
}
```

## Wiring

1. **`lib/vibe-edit/runtime.ts`** — add `vibeInstanceIndex(el, oid)` helper; extend `vibeSerialize` to include `instanceIndex` field.
2. **`lib/vibe-edit/types.ts`** — add `instanceIndex?: number` to `VibeElementInfo`.
3. **`components/VibePropertiesPanel.tsx`** — extend the cascade chip's text with a "Make this one different" button when `instanceCount > 1 && instanceIndex >= 0`. Wire to a new `onDetach()` callback prop.
4. **`components/Workspace.tsx`** — `handleVibeDetach`: calls `applyDetachFromMap(codeRef.current, { oid, index })`; on `ok`, `setCode(result.source)` (forces rebuild — fresh OIDs need a fresh parse). On bail, `showWarn(reason)` so the user knows the trade-off (e.g., "Can't detach from filtered lists").

## Tests

Pure-logic prod-import tests at `tests/detach-from-map-prod.test.ts`:

- Happy paths (12): index 0 / middle / last / N=2 / N=10 / `(x) =>` / `(x, i) =>` / arrow-block-body / spread `{...x}` / destructured `({title})` / index-0-with-second-param key rewrite / last-index key rewrite.
- Bails (8): non-`.map()` call / non-arrow callback / body returns null / body returns Fragment with 2 children / `param1` referenced outside `key=` / arrayExpr is filter chain / OID not found / index out of bounds.
- OID regen (3): middle expression has fresh OIDs after detach / left + right slices retain original OIDs / no duplicate OIDs in output.
- Integration (2): detach then re-detach the same slot (idempotent on the FIRST detached index, second detach hits the new middle); detach + reload → source still valid + iframe renders.

Target: ~25 cases. Bench? No — pure-logic ops use prod-import test style only.

## Failure modes the user will see

| Scenario | Outcome |
|---|---|
| `items.map(x => <Card {...x} />)` | Detach succeeds. |
| `items.filter(...).map(x => ...)` | Bail with toast: "Can't detach from filtered/sorted lists yet — edit source directly." |
| `items.map(({title, body}) => ...)` | Detach succeeds (IIFE preserves destructure). |
| `items.map((x, i) => <Card key={i} {...x} />)` | Detach succeeds; right-slice key rewritten to `key={i + K + 1}`. |
| `items.map((x, i) => <div onClick={() => fn(i)} />)` | Bail: `i` referenced outside `key=`. |
| `items.map(renderItem)` (named ref) | Bail: callback isn't an arrow. |
| Nested `.map()` | Find INNERMOST enclosing `.map()` for the OID. Works for the click target. |
| Bare HTML mode (no JSX) | No detach button shown. Cascade chip stays. |

## Deferred (not this plan, possible future work)

- Detach handling for filter/sort chains — needs source-index resolution from DOM-index, which requires runtime instrumentation of the filter callback. Out of scope.
- "Re-attach" / "merge back into the loop" UX — once detached, going back requires the user to delete the middle expression and adjust slice ranges. Plasmic doesn't ship this either; user just deletes the detached element manually if they regret it.
- Multi-instance detach in one op (detach 3 of 5) — composes via N single-detach calls; UX gets messy. Defer until requested.

## Done when

- `applyDetachFromMap` lands with ~25 prod-import tests, all green.
- Cascade chip shows "Make this one different" button when `instanceCount > 1` AND the heuristic-detectable case applies.
- Manual test: open a `.map()`-heavy template (per the 2026-05-14 list — 05/07/10/12/13/14/16/18/19/20/100/101), click one card, hit "Make this one different", confirm:
  - That card stays visually (no flicker beyond the rebuild)
  - Other cards still cascade among themselves
  - Editing the detached card with vibe-edit no longer propagates
- tsc 0; vitest baseline + ~25 new cases.

## Pre-flight signal (next session)

Confirm the algorithm against actual source by running this trace mentally for a real template:
- Open `web/05-startup.jsx` (or similar `.map()` template)
- Find the `.map()` call in source
- Confirm the JSX shape matches the assumptions (single JSXElement root, arrow callback, no filter chain)
- If 80% of templates pass the heuristic, plan is greenlit
- If <50% pass, expand bail-toast scope and reduce ambition (only detach in the most-common shape)

## Sample-template findings (2026-05-15 audit)

Spot-checked `web/05-mobile-app-landing.jsx` to validate assumptions. Findings:

- **Inline ArrayExpression data source** is common: `["bg-primary-container/60", ...].map((cls, i) => <span .../>)`. My initial bail rule "arrayExpr is non-trivial" is too strict — ArrayExpression IS supported by the IIFE form: `["a","b","c"][1]` evaluates fine at runtime. **Relax the rule** to allow Identifier, MemberExpression, AND ArrayExpression. Bail on CallExpression chains (filter/sort/map nesting).
- **Custom key shapes** are common: `key={"img-" + f.tag}` instead of `key={i}`. When key doesn't reference param1, no rewrite needed — keys are already globally unique. Adjust the key-rewrite rule: only rewrite when `key={<param1>}` (bare param-name JSXExpressionContainer). Anything else passes through unchanged.
- **No-second-param callbacks** are common: `SCREEN_FRAMES.map(f => ...)`. No `i`, no rewrite at all. Detach is straightforward.
- **Inline-array-of-objects** is common: `[{cls: "...", h: "95%"}].map(...)`. Same support as plain ArrayExpression.

Net: the plan's algorithm covers ~80% of real templates without further work. The harder ~20% (filter chains, computed callbacks, non-arrow refs) all fall cleanly into bail paths with clear toast messages. Greenlit for build when user wants.
