// Phase E proper — capacity-from-source prod-import test suite.
//
// Pure-logic only. Covers `inferCapacityFromClasses`'s flex-behavior
// detection + min/max px extraction + rem→px fallback + aspect-ratio
// + category default + identity invariants.

import { describe, it, expect } from "vitest";
import {
  inferCapacityFromClasses,
  CAPACITY_FROM_SOURCE_CONSTANTS,
} from "../lib/swap/capacity-from-source";
import type { SlotCapacity } from "../lib/swap/slot-capacity";

// ─── empty / null input ─────────────────────────────────────────────────────

describe("inferCapacityFromClasses — empty / null input", () => {
  it("null returns fully-null intrinsic with fit-content flex", () => {
    const c = inferCapacityFromClasses(null);
    expect(c.intrinsic.minWidthPx).toBe(null);
    expect(c.intrinsic.minHeightPx).toBe(null);
    expect(c.intrinsic.maxWidthPx).toBe(null);
    expect(c.intrinsic.maxHeightPx).toBe(null);
    expect(c.intrinsic.aspectRatio).toBe(null);
    expect(c.flexBehavior).toBe("fit-content");
    expect(c.category).toBe("unknown");
    expect(c.source).toBe("user-extracted");
  });

  it("undefined returns same as null", () => {
    const c = inferCapacityFromClasses(undefined);
    expect(c.flexBehavior).toBe("fit-content");
    expect(c.category).toBe("unknown");
  });

  it("empty string returns same as null", () => {
    const c = inferCapacityFromClasses("");
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("whitespace-only string treated as no tokens", () => {
    const c = inferCapacityFromClasses("   ");
    expect(c.flexBehavior).toBe("fit-content");
    expect(c.intrinsic.maxWidthPx).toBe(null);
  });

  it("non-string defensive: numeric input returns default capacity", () => {
    const c = inferCapacityFromClasses(42 as unknown as string);
    expect(c.flexBehavior).toBe("fit-content");
  });
});

// ─── flex behavior detection ────────────────────────────────────────────────

describe("inferCapacityFromClasses — flex behavior", () => {
  it("w-full → fill", () => {
    const c = inferCapacityFromClasses("rounded-xl w-full p-6");
    expect(c.flexBehavior).toBe("fill");
  });

  it("w-screen → fill", () => {
    const c = inferCapacityFromClasses("w-screen");
    expect(c.flexBehavior).toBe("fill");
  });

  it("flex-1 → fill", () => {
    const c = inferCapacityFromClasses("flex-1 p-2");
    expect(c.flexBehavior).toBe("fill");
  });

  it("flex-auto → fill", () => {
    const c = inferCapacityFromClasses("flex-auto");
    expect(c.flexBehavior).toBe("fill");
  });

  it("grow → fill", () => {
    const c = inferCapacityFromClasses("flex grow");
    expect(c.flexBehavior).toBe("fill");
  });

  it("flex-grow → fill", () => {
    const c = inferCapacityFromClasses("flex-grow");
    expect(c.flexBehavior).toBe("fill");
  });

  it("grow-0 cancels grow → no fill from that token", () => {
    // Only `grow-0` is present (no w-full / flex-1) — should NOT be fill.
    const c = inferCapacityFromClasses("flex grow-0 p-2");
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("grow + grow-0 cancels → fit-content (grow is dominated)", () => {
    const c = inferCapacityFromClasses("grow grow-0");
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("w-[800px] without fill marker → fixed", () => {
    const c = inferCapacityFromClasses("w-[800px] p-6");
    expect(c.flexBehavior).toBe("fixed");
  });

  it("w-[800px] AND w-full → fill wins (FILL_TOKENS scanned first)", () => {
    // Authoring would never do this in practice but defensive.
    const c = inferCapacityFromClasses("w-[800px] w-full p-6");
    expect(c.flexBehavior).toBe("fill");
  });

  it("no width tokens → fit-content", () => {
    const c = inferCapacityFromClasses("flex flex-col gap-4 bg-slate-100");
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("breakpoint-prefixed w-full does NOT trigger fill", () => {
    // `lg:w-full` only fires at large breakpoint; can't claim "fills any slot".
    const c = inferCapacityFromClasses("lg:w-full");
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("w-[800px] at start of string still detects fixed", () => {
    const c = inferCapacityFromClasses("w-[800px]");
    expect(c.flexBehavior).toBe("fixed");
  });
});

// ─── min/max width / height ─────────────────────────────────────────────────

describe("inferCapacityFromClasses — min/max bounds", () => {
  it("min-w-[320px] → minWidthPx = 320", () => {
    const c = inferCapacityFromClasses("min-w-[320px] p-4");
    expect(c.intrinsic.minWidthPx).toBe(320);
  });

  it("min-w-[20rem] → minWidthPx = 320 (16px base)", () => {
    const c = inferCapacityFromClasses("min-w-[20rem]");
    expect(c.intrinsic.minWidthPx).toBe(320);
  });

  it("min-w-full → minWidthPx stays null (fill semantic)", () => {
    const c = inferCapacityFromClasses("min-w-full");
    expect(c.intrinsic.minWidthPx).toBe(null);
  });

  it("min-w-screen → minWidthPx stays null", () => {
    const c = inferCapacityFromClasses("min-w-screen");
    expect(c.intrinsic.minWidthPx).toBe(null);
  });

  it("min-h-[200px] → minHeightPx = 200", () => {
    const c = inferCapacityFromClasses("min-h-[200px]");
    expect(c.intrinsic.minHeightPx).toBe(200);
  });

  it("min-h-[10rem] → minHeightPx = 160", () => {
    const c = inferCapacityFromClasses("min-h-[10rem]");
    expect(c.intrinsic.minHeightPx).toBe(160);
  });

  it("max-w-[800px] → maxWidthPx = 800", () => {
    const c = inferCapacityFromClasses("max-w-[800px]");
    expect(c.intrinsic.maxWidthPx).toBe(800);
  });

  it("w-[800px] sets maxWidthPx = 800 by default (inferMaxFromLiteralW=true)", () => {
    const c = inferCapacityFromClasses("w-[800px]");
    expect(c.intrinsic.maxWidthPx).toBe(800);
  });

  it("h-[400px] sets maxHeightPx = 400 by default", () => {
    const c = inferCapacityFromClasses("h-[400px]");
    expect(c.intrinsic.maxHeightPx).toBe(400);
  });

  it("max-w-[X] takes precedence over w-[X] when both present", () => {
    const c = inferCapacityFromClasses("w-[400px] max-w-[800px]");
    expect(c.intrinsic.maxWidthPx).toBe(800);
  });

  it("inferMaxFromLiteralW=false: w-[800px] does NOT set maxWidthPx", () => {
    const c = inferCapacityFromClasses("w-[800px]", {
      inferMaxFromLiteralW: false,
    });
    expect(c.intrinsic.maxWidthPx).toBe(null);
    // flexBehavior detection still uses w-[…] presence:
    expect(c.flexBehavior).toBe("fixed");
  });

  it("breakpoint-prefixed bounds do not match", () => {
    const c = inferCapacityFromClasses("lg:min-w-[320px] xl:max-w-[800px]");
    expect(c.intrinsic.minWidthPx).toBe(null);
    expect(c.intrinsic.maxWidthPx).toBe(null);
  });

  it("decimal pixel value preserved", () => {
    const c = inferCapacityFromClasses("min-w-[320.5px]");
    expect(c.intrinsic.minWidthPx).toBe(320.5);
  });

  it("zero pixel value preserved", () => {
    const c = inferCapacityFromClasses("min-w-[0px]");
    expect(c.intrinsic.minWidthPx).toBe(0);
  });

  it("only matches token-bounded patterns (not substrings)", () => {
    const c = inferCapacityFromClasses("xmin-w-[320px]");
    expect(c.intrinsic.minWidthPx).toBe(null);
  });
});

// ─── aspect ratio ───────────────────────────────────────────────────────────

describe("inferCapacityFromClasses — aspect ratio", () => {
  it("aspect-square → 1", () => {
    const c = inferCapacityFromClasses("aspect-square rounded-xl");
    expect(c.intrinsic.aspectRatio).toBe(1);
  });

  it("aspect-video → 16/9", () => {
    const c = inferCapacityFromClasses("aspect-video");
    expect(c.intrinsic.aspectRatio).toBe(16 / 9);
  });

  it("aspect-[16/9] → 16/9", () => {
    const c = inferCapacityFromClasses("aspect-[16/9]");
    expect(c.intrinsic.aspectRatio).toBe(16 / 9);
  });

  it("aspect-[4/3] → 4/3", () => {
    const c = inferCapacityFromClasses("aspect-[4/3]");
    expect(c.intrinsic.aspectRatio).toBe(4 / 3);
  });

  it("aspect-[1.5/1] → 1.5", () => {
    const c = inferCapacityFromClasses("aspect-[1.5/1]");
    expect(c.intrinsic.aspectRatio).toBe(1.5);
  });

  it("arbitrary AR takes precedence over named", () => {
    // Authoring won't do this but if arbitrary is FIRST in the regex
    // alternation, the named regex won't run.
    const c = inferCapacityFromClasses("aspect-[3/2] aspect-square");
    expect(c.intrinsic.aspectRatio).toBe(3 / 2);
  });

  it("invalid aspect (zero divisor) → null", () => {
    const c = inferCapacityFromClasses("aspect-[16/0]");
    expect(c.intrinsic.aspectRatio).toBe(null);
  });

  it("invalid aspect (zero numerator) → null", () => {
    const c = inferCapacityFromClasses("aspect-[0/9]");
    expect(c.intrinsic.aspectRatio).toBe(null);
  });

  it("breakpoint-prefixed aspect does NOT match", () => {
    const c = inferCapacityFromClasses("lg:aspect-square");
    expect(c.intrinsic.aspectRatio).toBe(null);
  });

  it("no aspect token → null", () => {
    const c = inferCapacityFromClasses("rounded-xl shadow-md");
    expect(c.intrinsic.aspectRatio).toBe(null);
  });
});

// ─── category override ──────────────────────────────────────────────────────

describe("inferCapacityFromClasses — category", () => {
  it("default category is 'unknown'", () => {
    const c = inferCapacityFromClasses("w-full");
    expect(c.category).toBe("unknown");
  });

  it("explicit category passed through", () => {
    const c = inferCapacityFromClasses("w-full", { category: "components" });
    expect(c.category).toBe("components");
  });

  it("explicit category 'media'", () => {
    const c = inferCapacityFromClasses("aspect-video", { category: "media" });
    expect(c.category).toBe("media");
  });
});

// ─── full-shape compositions ────────────────────────────────────────────────

describe("inferCapacityFromClasses — composed scenarios", () => {
  it("typical card: rounded-2xl bg-white p-6 → fit-content / no bounds", () => {
    const c = inferCapacityFromClasses("rounded-2xl bg-white p-6 shadow-md");
    expect(c.flexBehavior).toBe("fit-content");
    expect(c.intrinsic.minWidthPx).toBe(null);
    expect(c.intrinsic.maxWidthPx).toBe(null);
    expect(c.intrinsic.aspectRatio).toBe(null);
  });

  it("hero card with literal w-[800px] → fixed / maxWidthPx=800", () => {
    const c = inferCapacityFromClasses(
      "w-[800px] aspect-[16/9] rounded-2xl bg-white p-6",
    );
    expect(c.flexBehavior).toBe("fixed");
    expect(c.intrinsic.maxWidthPx).toBe(800);
    expect(c.intrinsic.aspectRatio).toBe(16 / 9);
  });

  it("button: px-4 py-2 rounded-lg → fit-content / no bounds", () => {
    const c = inferCapacityFromClasses("px-4 py-2 rounded-lg bg-blue-500");
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("flex-grow input: flex-1 px-4 py-2 → fill", () => {
    const c = inferCapacityFromClasses("flex-1 px-4 py-2 border");
    expect(c.flexBehavior).toBe("fill");
  });

  it("min-w + max-w + aspect together", () => {
    const c = inferCapacityFromClasses(
      "min-w-[320px] max-w-[640px] aspect-[4/3] rounded-xl",
    );
    expect(c.intrinsic.minWidthPx).toBe(320);
    expect(c.intrinsic.maxWidthPx).toBe(640);
    expect(c.intrinsic.aspectRatio).toBe(4 / 3);
  });

  it("constants are exported for tests + filter", () => {
    expect(CAPACITY_FROM_SOURCE_CONSTANTS.FILL_TOKENS).toBeInstanceOf(Set);
    expect(CAPACITY_FROM_SOURCE_CONSTANTS.MIN_W_FILL_TOKENS).toBeInstanceOf(Set);
    expect(CAPACITY_FROM_SOURCE_CONSTANTS.REM_PX_BASE).toBe(16);
    expect(CAPACITY_FROM_SOURCE_CONSTANTS.SPACING_PX["80"]).toBe(320);
    expect(CAPACITY_FROM_SOURCE_CONSTANTS.SPACING_PX["96"]).toBe(384);
    expect(CAPACITY_FROM_SOURCE_CONSTANTS.MAX_WIDTH_NAMED_PX["md"]).toBe(448);
    expect(CAPACITY_FROM_SOURCE_CONSTANTS.MAX_WIDTH_NAMED_PX["full"]).toBe(null);
  });
});

// ─── Tailwind named-scale (w-80, max-w-md, etc.) ────────────────────────────

describe("inferCapacityFromClasses — Tailwind named width scale", () => {
  it("w-80 = 320px (Tailwind spacing × 4)", () => {
    const c = inferCapacityFromClasses("w-80 rounded-xl");
    expect(c.flexBehavior).toBe("fixed");
    expect(c.intrinsic.maxWidthPx).toBe(320);
  });

  it("w-96 = 384px", () => {
    const c = inferCapacityFromClasses("w-96 p-6");
    expect(c.flexBehavior).toBe("fixed");
    expect(c.intrinsic.maxWidthPx).toBe(384);
  });

  it("w-64 = 256px", () => {
    const c = inferCapacityFromClasses("w-64");
    expect(c.intrinsic.maxWidthPx).toBe(256);
  });

  it("w-px = 1px (edge of scale)", () => {
    const c = inferCapacityFromClasses("w-px");
    expect(c.intrinsic.maxWidthPx).toBe(1);
  });

  it("w-0.5 = 2px (decimal scale value)", () => {
    const c = inferCapacityFromClasses("w-0.5");
    expect(c.intrinsic.maxWidthPx).toBe(2);
  });

  it("w-0 = 0px (allowed boundary)", () => {
    const c = inferCapacityFromClasses("w-0");
    expect(c.intrinsic.maxWidthPx).toBe(0);
  });

  it("inferMaxFromLiteralW=false skips named widths too", () => {
    const c = inferCapacityFromClasses("w-80", { inferMaxFromLiteralW: false });
    expect(c.intrinsic.maxWidthPx).toBe(null);
    // flexBehavior still detects fixed via the named scale.
    expect(c.flexBehavior).toBe("fixed");
  });

  it("w-1/2 (fraction) is NOT picked up — fractions are not in spacing scale", () => {
    const c = inferCapacityFromClasses("w-1/2");
    expect(c.intrinsic.maxWidthPx).toBe(null);
  });

  it("w-auto / w-fit etc. don't trigger fixed behavior", () => {
    const c = inferCapacityFromClasses("w-auto");
    // w-auto is not in spacing table; flexBehavior falls back to fit-content.
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("breakpoint-prefixed w-80 does NOT match", () => {
    const c = inferCapacityFromClasses("md:w-80");
    expect(c.intrinsic.maxWidthPx).toBe(null);
    expect(c.flexBehavior).toBe("fit-content");
  });
});

describe("inferCapacityFromClasses — Tailwind named max-width scale", () => {
  it("max-w-xs = 320px", () => {
    expect(inferCapacityFromClasses("max-w-xs").intrinsic.maxWidthPx).toBe(320);
  });

  it("max-w-md = 448px", () => {
    expect(inferCapacityFromClasses("max-w-md").intrinsic.maxWidthPx).toBe(448);
  });

  it("max-w-lg = 512px", () => {
    expect(inferCapacityFromClasses("max-w-lg").intrinsic.maxWidthPx).toBe(512);
  });

  it("max-w-7xl = 1280px", () => {
    expect(inferCapacityFromClasses("max-w-7xl").intrinsic.maxWidthPx).toBe(1280);
  });

  it("max-w-prose = 520px (~65ch rounded)", () => {
    expect(inferCapacityFromClasses("max-w-prose").intrinsic.maxWidthPx).toBe(520);
  });

  it("max-w-full → null (no pixel cap)", () => {
    expect(inferCapacityFromClasses("max-w-full").intrinsic.maxWidthPx).toBe(null);
  });

  it("max-w-none → null", () => {
    expect(inferCapacityFromClasses("max-w-none").intrinsic.maxWidthPx).toBe(null);
  });

  it("max-w-fit → null", () => {
    expect(inferCapacityFromClasses("max-w-fit").intrinsic.maxWidthPx).toBe(null);
  });

  it("max-w-screen-lg = 1024px", () => {
    expect(inferCapacityFromClasses("max-w-screen-lg").intrinsic.maxWidthPx).toBe(1024);
  });

  it("max-w spacing fallback (max-w-80 = 320px)", () => {
    expect(inferCapacityFromClasses("max-w-80").intrinsic.maxWidthPx).toBe(320);
  });

  it("named max-w wins over literal w-[Npx] when both present", () => {
    // max-w-md=448 > w-[800px]=800 — but max-w wins because we resolve
    // max-w first.
    const c = inferCapacityFromClasses("max-w-md w-[800px]");
    expect(c.intrinsic.maxWidthPx).toBe(448);
  });
});

describe("inferCapacityFromClasses — Tailwind named min-width / heights", () => {
  it("min-w-80 = 320px", () => {
    expect(inferCapacityFromClasses("min-w-80").intrinsic.minWidthPx).toBe(320);
  });

  it("min-w-full → null (fill semantic)", () => {
    expect(inferCapacityFromClasses("min-w-full").intrinsic.minWidthPx).toBe(null);
  });

  it("min-h-32 = 128px", () => {
    expect(inferCapacityFromClasses("min-h-32").intrinsic.minHeightPx).toBe(128);
  });

  it("h-80 sets maxHeightPx = 320", () => {
    expect(inferCapacityFromClasses("h-80").intrinsic.maxHeightPx).toBe(320);
  });

  it("max-h-96 = 384px", () => {
    expect(inferCapacityFromClasses("max-h-96").intrinsic.maxHeightPx).toBe(384);
  });
});

describe("inferCapacityFromClasses — common library asset patterns", () => {
  it("max-w-md card with inner content", () => {
    const c = inferCapacityFromClasses(
      "max-w-md mx-auto rounded-2xl bg-white p-6 shadow-md",
    );
    expect(c.intrinsic.maxWidthPx).toBe(448);
    expect(c.flexBehavior).toBe("fit-content");
  });

  it("HyperUI base card body (max-w-md p-6)", () => {
    const c = inferCapacityFromClasses("mx-auto max-w-md p-6");
    expect(c.intrinsic.maxWidthPx).toBe(448);
  });

  it("Uiverse fixed-width card (w-80)", () => {
    const c = inferCapacityFromClasses("w-80 bg-slate-100 rounded-xl");
    expect(c.flexBehavior).toBe("fixed");
    expect(c.intrinsic.maxWidthPx).toBe(320);
  });

  it("button fragment: px-4 py-2 rounded → fit-content / no bounds", () => {
    const c = inferCapacityFromClasses("px-4 py-2 rounded text-white bg-blue-500");
    expect(c.flexBehavior).toBe("fit-content");
    expect(c.intrinsic.maxWidthPx).toBe(null);
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("inferCapacityFromClasses — invariants", () => {
  it("does not mutate input string", () => {
    const cls = "w-[800px] aspect-[16/9] rounded-xl";
    const original = cls;
    inferCapacityFromClasses(cls);
    expect(cls).toBe(original);
  });

  it("deterministic across repeated calls", () => {
    const cls = "w-full flex-1 min-w-[320px] aspect-square";
    const a = inferCapacityFromClasses(cls);
    const b = inferCapacityFromClasses(cls);
    const c = inferCapacityFromClasses(cls);
    expect(a).toEqual(b);
    expect(b).toEqual(c);
  });

  it("returned SlotCapacity shape is the documented contract", () => {
    const c: SlotCapacity = inferCapacityFromClasses("w-full");
    expect(typeof c.category).toBe("string");
    expect(typeof c.flexBehavior).toBe("string");
    expect(typeof c.source).toBe("string");
    expect(c.intrinsic).toBeTypeOf("object");
    expect(["fill", "fit-content", "fixed"]).toContain(c.flexBehavior);
  });

  it("source field is always 'user-extracted' (heuristic data marker)", () => {
    const cases = [
      "",
      "w-full",
      "w-[800px]",
      "min-w-[320px] max-w-[640px] aspect-[16/9]",
    ];
    for (const cls of cases) {
      const c = inferCapacityFromClasses(cls);
      expect(c.source).toBe("user-extracted");
    }
  });
});
