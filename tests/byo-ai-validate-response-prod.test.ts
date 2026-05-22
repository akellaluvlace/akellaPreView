import { describe, it, expect } from "vitest";
import { validateResponse } from "../lib/byo-ai/validate-response";

// Helper — build a "reasonable" input/output pair for length checks.
// 500 chars is comfortably above the 50-char floor and gives the
// length-ratio test a meaningful range to play with.
function pad(s: string, len: number): string {
  while (s.length < len) s += " ";
  return s;
}

describe("validateResponse — length sanity", () => {
  it("accepts response within [0.5×, 1.5×] of input length", () => {
    const input = pad("<html><body><button>x</button></body></html>", 500);
    const output = pad("<html><body><button>y</button></body></html>", 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>x</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("rejects empty response", () => {
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: "",
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("empty");
  });

  it("rejects response under 50 chars", () => {
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: "<html></html>",
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects response under 0.5× input length (suspected truncation)", () => {
    const input = pad("<html></html>", 1000);
    const output = pad("<html></html>", 200);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("short");
  });

  it("rejects response over 1.5× input length (runaway expansion)", () => {
    // 6000 chars vs 4000 source: ratio 1.5+, additive floor (+2000)
    // ALSO blown (6000 > 4000 + 2000 = 6000 is the boundary, so go +1)
    const input = pad("<html></html>", 4000);
    const output = pad("<html></html>", 6001);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("long");
  });

  it("accepts small-file expansion past 1.5× via the +2000 additive floor (H4)", () => {
    // 800 chars → 2200 chars (2.75× ratio) — would have been
    // rejected before the additive floor. Now: max(1.5×, +2000)
    // → max(1200, 2800) = 2800 → 2200 < 2800 → accepts.
    const input = pad("<html><body><button>x</button></body></html>", 800);
    const output = pad(
      "<html><body><button>x</button></body></html>",
      2200,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>x</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — no-op detection", () => {
  it("rejects when the target's outerHtml is still verbatim in response", () => {
    const target =
      '<button class="bg-stone-200 px-4 py-2">Get Started</button>';
    const input = pad(`<html><body>${target}</body></html>`, 500);
    const output = pad(`<html><body>${target}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toMatch(/still in the response|swap|ignored/);
  });

  it("ignores data-dropin-id attributes when comparing (OIDs shift legitimately)", () => {
    // Frontier models may regenerate OIDs even on a real swap. We
    // strip those before comparing so a TRUE no-op is the only thing
    // that trips this check.
    const target =
      '<button data-dropin-id="abc123" class="bg-stone-200">Get Started</button>';
    const input = pad(`<html><body>${target}</body></html>`, 500);
    const newTarget =
      '<button data-dropin-id="def456" class="bg-fuchsia-500">Get Started</button>';
    const output = pad(`<html><body>${newTarget}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("skips no-op check when target snippet is too short to be useful", () => {
    // A 15-char target like `<a>x</a>` is too generic to use for
    // change detection — many real swaps would still contain it
    // (e.g. some other anchor in the file). Skip the check at <20.
    const target = "<a>x</a>";
    const input = pad(`<html><body>${target}<a>y</a></body></html>`, 500);
    const output = pad(
      `<html><body><button>new</button><a>y</a></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("accepts cascade swap: input has 3 copies, output has 2 (H1 fix)", () => {
    // Cascade case: .map() renders 3 buttons; user picks one; AI
    // detaches and swaps one. Input has 3 instances of the target's
    // outerHtml; output has 2 (the detached one became something
    // else). Pre-H1 fix: binary `includes` check rejected this as
    // no-op. Post-fix: count occurrences and accept when count
    // dropped.
    const target =
      '<button class="bg-stone-200 px-4 py-2 text-base">Card Title</button>';
    const input = pad(
      `<html><body>${target}${target}${target}</body></html>`,
      500,
    );
    const newButton =
      '<button class="rounded-full bg-fuchsia-500">Card Title</button>';
    const output = pad(
      `<html><body>${target}${target}${newButton}</body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("rejects when input had 3 copies and output STILL has 3 (real no-op)", () => {
    // Confirms the new count-based check still rejects the actual
    // no-op case for cascade elements.
    const target =
      '<button class="bg-stone-200 px-4 py-2 text-base">Card Title</button>';
    const input = pad(
      `<html><body>${target}${target}${target}</body></html>`,
      500,
    );
    const output = pad(
      `<html><body>${target}${target}${target}</body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });
});

describe("validateResponse — security checks", () => {
  it("rejects onclick= event handler", () => {
    const input = pad("<html><body></body></html>", 500);
    const output = pad(
      `<html><body><button onclick="alert(1)">x</button></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });

  it("rejects onerror= event handler", () => {
    const output = pad(
      `<html><body><img src="x" onerror="alert(1)"></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });

  it("rejects onmouseover= event handler (case-insensitive)", () => {
    const output = pad(
      `<html><body><div onMouseOver="x()">hi</div></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects javascript: URI in href", () => {
    const output = pad(
      `<html><body><a href="javascript:alert(1)">x</a></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("javascript:");
  });

  it("allows legitimate href URLs (http, https, mailto, #anchor)", () => {
    const output = pad(
      `<html><body>
        <a href="https://example.com">a</a>
        <a href="mailto:x@y.com">b</a>
        <a href="#hero">c</a>
        <a href="/about">d</a>
      </body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("ignores onclick-like substring inside text content (whole-word boundary)", () => {
    // "I clicked the button" or "the on-click handler" in a code
    // sample as text content shouldn't trip — only ACTUAL on*= attrs.
    const output = pad(
      `<html><body><p>This site uses on-click animations</p></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("ACCEPTS JSX expression event handlers (onClick={fn}) — L1 fix", () => {
    // The critical L1 bug: the old regex rejected every JSX onClick.
    // Interactive templates legitimately carry onClick / onChange /
    // onSubmit with {expression} values. Only STRING-valued handlers
    // (the XSS vector) should be rejected.
    const oldTarget = '<button className="old">Submit</button>';
    const newTarget = '<button className="new">Submit</button>';
    const input = pad(
      `export default function X() {
        const [n, setN] = React.useState(0);
        return <div onClick={() => setN(n + 1)}>${oldTarget}</div>;
      }`,
      500,
    );
    const output = pad(
      `export default function X() {
        const [n, setN] = React.useState(0);
        return <div onClick={() => setN(n + 1)}>${newTarget}</div>;
      }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });

  it("still rejects STRING-valued event handlers (onerror=\"...\")", () => {
    const output = pad(
      `<html><body><img src="x" onerror="alert(1)"></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });
});

describe("validateResponse — placeholder truncation (C1)", () => {
  function bigInput(): string {
    return pad(
      `const A = [1,2,3];\nconst B = {x:1};\nexport default function App() { return <div><button>old</button></div>; }`,
      4000,
    );
  }

  it("rejects // ... rest of the code unchanged", () => {
    const output =
      `const A = [1,2,3];\n// ... rest of the code unchanged ...\n<button>new</button>`;
    const r = validateResponse({
      inputSource: bigInput(),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("truncat");
  });

  it("rejects {/* ... unchanged ... */} JSX placeholder", () => {
    const output =
      `export default function App() {\n  {/* ... unchanged ... */}\n  return <button>new</button>;\n}`;
    const r = validateResponse({
      inputSource: bigInput(),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects 'rest of the component remains the same'", () => {
    const output =
      `export default function App() {\n  // rest of the component remains the same\n  return <button>new</button>;\n}`;
    const r = validateResponse({
      inputSource: bigInput(),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects <!-- remaining markup unchanged --> in HTML mode", () => {
    const output =
      `<html><body><button>new</button>\n<!-- ... remaining markup unchanged --></body></html>`;
    const r = validateResponse({
      inputSource: pad("<html><body><button>old</button><div>lots more</div></body></html>", 4000),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("does NOT false-reject legitimate spread operators ({...props})", () => {
    // The spread operator is `...identifier` with NO space — distinct
    // from placeholder `... rest` (with space).
    const oldTarget = '<button className="old">Submit</button>';
    const newTarget = '<button className="new">Submit</button>';
    const input = pad(
      `function Btn({ className, ...rest }) { return <button {...rest}>x</button>; }\nexport default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `function Btn({ className, ...rest }) { return <button {...rest}>x</button>; }\nexport default function App() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });

  it("does NOT false-reject https:// URLs in comments", () => {
    const oldTarget = '<a class="old">Link</a>';
    const newTarget = '<a class="new">Link</a>';
    const input = pad(
      `<html><body>\n<!-- see https://example.com/docs -->\n${oldTarget}</body></html>`,
      500,
    );
    const output = pad(
      `<html><body>\n<!-- see https://example.com/docs -->\n${newTarget}</body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — top-level decl survival (C1 companion)", () => {
  it("rejects when 2+ top-level decls vanish (silent truncation)", () => {
    const input = pad(
      `const SCREEN_FRAMES = [1,2,3];\nconst VOICES = [4,5,6];\nconst FAQ = [7,8];\nexport default function App() { return <button>old</button>; }`,
      4000,
    );
    // Output dropped SCREEN_FRAMES + VOICES + FAQ (no placeholder
    // comment — pure silent drop)
    const output = pad(
      `export default function App() { return <button>new</button>; }`,
      2100,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("missing");
  });

  it("tolerates a single legitimately-removed decl", () => {
    const input = pad(
      `const A = [1];\nconst B = [2];\nconst DEAD = [3];\nexport default function App() { return <button>old</button>; }`,
      500,
    );
    // Output kept A + B + App, dropped only DEAD (1 missing → tolerated)
    const output = pad(
      `const A = [1];\nconst B = [2];\nexport default function App() { return <button class="new">new</button>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — TypeScript detection (C2, JSX mode only)", () => {
  function tsInput(): string {
    const oldTarget = '<button className="old">Go</button>';
    return pad(
      `export default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
  }

  it("rejects type annotations (: string)", () => {
    const output = pad(
      `export default function App() { const label: string = "Go"; return <div><button className="new">{label}</button></div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: tsInput(),
      outputSource: output,
      targetOuterHtml: '<button className="old">Go</button>',
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("typescript");
  });

  it("rejects interface declarations", () => {
    const output = pad(
      `interface Props { x: number }\nexport default function App() { return <button className="new">Go</button>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: tsInput(),
      outputSource: output,
      targetOuterHtml: '<button className="old">Go</button>',
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects 'as const'", () => {
    const output = pad(
      `export default function App() { const x = [1,2] as const; return <button className="new">Go</button>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: tsInput(),
      outputSource: output,
      targetOuterHtml: '<button className="old">Go</button>',
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("does NOT run TS detection in HTML mode", () => {
    // HTML can legitimately contain `: string` in text content or CSS.
    const output = pad(
      `<html><body><style>.x::after { content: string }</style><button class="new">Go</button></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad(
        `<html><body><button class="old">Go</button></body></html>`,
        500,
      ),
      outputSource: output,
      targetOuterHtml: '<button class="old">Go</button>',
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("does NOT false-reject CSS-in-JS object literals (string VALUES)", () => {
    // `color: '#fff'` is a string VALUE, not the bare type word.
    const oldTarget = '<button className="old">Go</button>';
    const newTarget = '<button className="new" style={{ color: "#fff" }}>Go</button>';
    const input = pad(
      `export default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `export default function App() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — happy path", () => {
  it("accepts a clean restyled element response", () => {
    const oldTarget = '<button class="bg-stone-200 px-4 py-2">Submit</button>';
    const newTarget =
      '<button class="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 text-white">Submit</button>';
    const input = pad(`<html><body>${oldTarget}</body></html>`, 500);
    const output = pad(`<html><body>${newTarget}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("accepts a JSX-mode swap response", () => {
    const oldTarget = '<button className="bg-stone-200">Hi</button>';
    const newTarget = '<button className="bg-fuchsia-500">Hi</button>';
    const input = pad(
      `export default function X() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `export default function X() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });
});
