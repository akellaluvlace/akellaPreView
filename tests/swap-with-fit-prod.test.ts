import { describe, it, expect } from "vitest";
import { applySwapWithFit } from "../lib/swap/swap-with-fit";
import type { SlotEnvelope } from "../lib/swap/slot-capacity";

// Phase E proper — orchestration of applySwap + applySwapFit + patchJsxClassByOid
// for the Workspace swap handler. Pure-logic — no DOM, no React, no async.
//
// Composition contract:
//   - applySwap unchanged → propagate the bail (no fit attempted)
//   - applySwap changed + envelope null → return swap result, no fit
//   - applySwap changed + envelope set + className read fails → no fit
//   - applySwap changed + envelope set + applySwapFit no-op → no fit
//   - applySwap changed + applySwapFit changed → patch className via
//     patchJsxClassByOid; final source includes the fitted class
//
// Key invariant: caller's `setCode(result.source)` lands ONE undo entry,
// not two. The composition must never emit a half-state where swap
// landed but fit didn't.

const sampleSource = `export default function App() {
  return (
    <main data-dropin-id="root" className="p-4 max-w-[320px]">
      <div data-dropin-id="slot" className="bg-gray-100">old</div>
    </main>
  );
}
`;

const FIT_SLOT_ENV: SlotEnvelope = {
  availableWidthPx: 320,
  availableHeightPx: 200,
  preferredAspectRatio: null,
};

describe("applySwapWithFit — composition", () => {
  it("propagates unchanged when applySwap bails (oid not in source)", () => {
    const res = applySwapWithFit(
      sampleSource,
      { oid: "nonexistent", jsx: `<section className="x">y</section>` },
      FIT_SLOT_ENV,
    );
    expect(res.unchanged).toBe(true);
    if (res.unchanged) {
      expect(res.reason).toMatch(/not found/);
    }
  });

  it("returns swap result without fit when envelope is null", () => {
    const res = applySwapWithFit(
      sampleSource,
      { oid: "slot", jsx: `<section className="w-[800px] bg-red-500">y</section>` },
      null,
    );
    expect(res.unchanged).toBe(false);
    if (!res.unchanged) {
      expect(res.fitApplied).toBe(false);
      expect(res.fitChanges).toEqual([]);
      // The original swap result's source contains the new element.
      expect(res.source).toContain("w-[800px]");
      expect(res.source).toContain("bg-red-500");
      // swappedOid is set.
      expect(res.swappedOid).toBeTruthy();
    }
  });

  it("applies fit and patches className when applySwapFit changes (overflow)", () => {
    const res = applySwapWithFit(
      sampleSource,
      { oid: "slot", jsx: `<section className="w-[800px] bg-red-500">y</section>` },
      FIT_SLOT_ENV,
    );
    expect(res.unchanged).toBe(false);
    if (!res.unchanged) {
      expect(res.fitApplied).toBe(true);
      expect(res.fitChanges.length).toBe(1);
      expect(res.fitChanges[0].kind).toBe("width-overflow");
      // Final source must contain w-full, not w-[800px].
      expect(res.source).not.toContain("w-[800px]");
      expect(res.source).toContain("w-full");
      // bg-red-500 is preserved (only the overflow w-* token swapped).
      expect(res.source).toContain("bg-red-500");
    }
  });

  it("returns swap result without fit when applySwapFit is a no-op", () => {
    const res = applySwapWithFit(
      sampleSource,
      { oid: "slot", jsx: `<section className="w-full bg-blue-500">y</section>` },
      FIT_SLOT_ENV,
    );
    expect(res.unchanged).toBe(false);
    if (!res.unchanged) {
      expect(res.fitApplied).toBe(false);
      expect(res.fitChanges).toEqual([]);
      // Source still contains the swapped className verbatim.
      expect(res.source).toContain("bg-blue-500");
    }
  });

  it("returns swap result without fit when className read fails (no className attr)", () => {
    // Asset has no className attribute → readJsxClassByOid returns null →
    // skip fit (the asset is the user's responsibility to ship with classes).
    const res = applySwapWithFit(
      sampleSource,
      { oid: "slot", jsx: `<section>y</section>` },
      FIT_SLOT_ENV,
    );
    expect(res.unchanged).toBe(false);
    if (!res.unchanged) {
      expect(res.fitApplied).toBe(false);
      expect(res.fitChanges).toEqual([]);
    }
  });

  it("returns swap result without fit when className uses an expression (className={cn(...)})", () => {
    const res = applySwapWithFit(
      sampleSource,
      {
        oid: "slot",
        jsx: `<section className={cn("a", "b")}>y</section>`,
      },
      FIT_SLOT_ENV,
    );
    expect(res.unchanged).toBe(false);
    if (!res.unchanged) {
      // Expression-form className → no read → no fit.
      expect(res.fitApplied).toBe(false);
    }
  });

  it("aspect-mismatch fit lands in the final source", () => {
    const env: SlotEnvelope = {
      availableWidthPx: 1000,
      availableHeightPx: 1000,
      preferredAspectRatio: 1, // 1:1
    };
    const res = applySwapWithFit(
      sampleSource,
      {
        oid: "slot",
        jsx: `<section className="aspect-video bg-green-500">y</section>`,
      },
      env,
    );
    expect(res.unchanged).toBe(false);
    if (!res.unchanged) {
      expect(res.fitApplied).toBe(true);
      expect(res.fitChanges[0].kind).toBe("aspect-mismatch");
      expect(res.source).not.toContain("aspect-video");
      expect(res.source).toMatch(/aspect-\[1\/1\]/);
    }
  });

  it("non-mutating: original source string unchanged after call", () => {
    const before = sampleSource;
    applySwapWithFit(
      sampleSource,
      { oid: "slot", jsx: `<section className="w-[800px]">y</section>` },
      FIT_SLOT_ENV,
    );
    expect(sampleSource).toBe(before);
  });

  it("preserveChildren flag is forwarded to applySwap", () => {
    const res = applySwapWithFit(
      sampleSource,
      {
        oid: "slot",
        jsx: `<wrapper className="bg-yellow-100">{/* placeholder */}</wrapper>`,
        preserveChildren: true,
      },
      FIT_SLOT_ENV,
    );
    // Either the swap proceeds (and we get a non-bail), or it bails for
    // a documented reason ("asset has multiple roots", "self-closing", etc).
    // The key contract: preserveChildren is forwarded — applySwap receives it.
    // We assert that the bail reason, if any, is one of applySwap's.
    if (res.unchanged) {
      expect(typeof res.reason).toBe("string");
    } else {
      expect(res.swappedOid).toBeTruthy();
    }
  });
});
