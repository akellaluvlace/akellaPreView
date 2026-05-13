// Prod-import tests for buildPixabayInsert. Mirrors the Unsplash
// builder tests' shape — verify attribution comment, alt-text fallback
// chain, resolution → URL mapping, HTML vs JSX delimiters.

import { describe, it, expect } from "vitest";
import { buildPixabayInsert } from "../lib/asset-library/insert-pixabay";
import type { PixabayPhoto } from "../lib/asset-library/types";

const SAMPLE: PixabayPhoto = {
  id: "12345",
  tags: "flower, blossom, garden",
  width: 4000,
  height: 2250,
  preview: "https://cdn.pixabay.com/photo/x_150.jpg",
  webformat: "https://cdn.pixabay.com/photo/x_640.jpg",
  large: "https://cdn.pixabay.com/photo/x_1280.jpg",
  pageUrl: "https://pixabay.com/photos/flower-12345/",
  author: { name: "Josch13", profileUrl: "https://pixabay.com/users/Josch13-48777/" },
};

describe("buildPixabayInsert — HTML mode", () => {
  it("emits attribution comment + img tag with medium resolution by default", () => {
    const out = buildPixabayInsert(SAMPLE, "html");
    expect(out).toContain("<!--");
    expect(out).toContain("Photo by Josch13");
    expect(out).toContain("Pixabay");
    expect(out).toContain("https://pixabay.com/users/Josch13-48777/");
    expect(out).toContain("https://pixabay.com/photos/flower-12345/");
    expect(out).toContain("-->");
    // Default resolution = medium → webformat URL.
    expect(out).toContain('src="https://cdn.pixabay.com/photo/x_640.jpg"');
    expect(out).toContain('width="4000"');
    expect(out).toContain('height="2250"');
    expect(out).toContain('loading="lazy"');
  });

  it("uses tag string as alt text, comma-trimmed", () => {
    const out = buildPixabayInsert(SAMPLE, "html");
    expect(out).toContain('alt="flower, blossom, garden"');
  });

  it("falls back to 'Photo by X on Pixabay' alt when tags missing", () => {
    const out = buildPixabayInsert(
      { ...SAMPLE, tags: "" },
      "html",
    );
    expect(out).toContain('alt="Photo by Josch13 on Pixabay"');
  });

  it("small resolution maps to previewURL (150w)", () => {
    const out = buildPixabayInsert(SAMPLE, "html", { resolution: "small" });
    expect(out).toContain('src="https://cdn.pixabay.com/photo/x_150.jpg"');
  });

  it("small resolution falls back to webformat when preview missing", () => {
    const out = buildPixabayInsert(
      { ...SAMPLE, preview: "" },
      "html",
      { resolution: "small" },
    );
    expect(out).toContain('src="https://cdn.pixabay.com/photo/x_640.jpg"');
  });

  it("large resolution maps to largeImageURL", () => {
    const out = buildPixabayInsert(SAMPLE, "html", { resolution: "large" });
    expect(out).toContain('src="https://cdn.pixabay.com/photo/x_1280.jpg"');
  });

  it("original resolution falls back to largeImageURL (free tier ceiling)", () => {
    const out = buildPixabayInsert(SAMPLE, "html", { resolution: "original" });
    expect(out).toContain('src="https://cdn.pixabay.com/photo/x_1280.jpg"');
  });
});

describe("buildPixabayInsert — JSX mode", () => {
  it("emits JSX comment delimiters + numeric width/height", () => {
    const out = buildPixabayInsert(SAMPLE, "jsx");
    expect(out).toContain("{/*");
    expect(out).toContain("*/}");
    expect(out).toContain(`width={4000}`);
    expect(out).toContain(`height={2250}`);
    expect(out).toContain(`loading="lazy"`);
  });

  it("preserves attribution comment content in JSX form", () => {
    const out = buildPixabayInsert(SAMPLE, "jsx");
    expect(out).toContain("Photo by Josch13");
    expect(out).toContain("Pixabay");
  });
});

describe("buildPixabayInsert — alt text safety", () => {
  it("escapes double quotes inside tags to single quotes", () => {
    const out = buildPixabayInsert(
      { ...SAMPLE, tags: `mountain "view" sunrise` },
      "html",
    );
    expect(out).toContain(`alt="mountain 'view' sunrise"`);
  });

  it("truncates very long tag strings to 200 chars", () => {
    const longTags = "a".repeat(500);
    const out = buildPixabayInsert(
      { ...SAMPLE, tags: longTags },
      "html",
    );
    const altMatch = out.match(/alt="(a+)"/);
    expect(altMatch).not.toBeNull();
    expect(altMatch![1].length).toBe(200);
  });

  it("escapes double quotes in author-name alt fallback", () => {
    // Pixabay user with a quote in their display name (rare but valid).
    // Without escaping, alt="..." breaks open + injects attributes.
    // Only the alt attribute matters here — the user name also lands
    // in the HTML comment but `"` inside a comment is inert until the
    // comment is closed (which is handled by the sanitizeForComment
    // path, tested separately).
    const out = buildPixabayInsert(
      {
        ...SAMPLE,
        tags: "",
        author: { name: `Foo" onerror="alert(1)`, profileUrl: "https://x" },
      },
      "html",
    );
    const altMatch = out.match(/alt="([^"]*)"/);
    expect(altMatch).not.toBeNull();
    const altValue = altMatch![1];
    expect(altValue).not.toContain(`"`);
    expect(altValue).toContain(`Foo' onerror='alert(1)`);
  });
});

describe("buildPixabayInsert — comment injection defence", () => {
  it("strips `-->` from photographer name in HTML comment", () => {
    const out = buildPixabayInsert(
      {
        ...SAMPLE,
        author: {
          name: `evil --><script>alert(1)</script><!--`,
          profileUrl: "https://pixabay.com/users/evil/",
        },
      },
      "html",
    );
    // Only look at the user-input lines (between the `<!--` opener
    // and the `-->` closer) — those are the bytes the attacker
    // controls. The natural delimiters are expected to survive.
    const userLines = out.split("\n").slice(1, 3).join("\n");
    expect(userLines).not.toContain(`-->`);
    expect(userLines).not.toContain(`<!--`);
    expect(userLines).not.toContain(`<script>`);
  });

  it("strips `*/` from photographer name in JSX comment", () => {
    const out = buildPixabayInsert(
      {
        ...SAMPLE,
        author: {
          name: `evil */} <script>alert(1)</script> {/*`,
          profileUrl: "https://pixabay.com/users/evil/",
        },
      },
      "jsx",
    );
    // Same approach as HTML — assert against the user-input lines only.
    const userLines = out.split("\n").slice(1, 3).join("\n");
    expect(userLines).not.toContain(`*/`);
    expect(userLines).not.toContain(`/*`);
    expect(userLines).not.toContain(`<script>`);
  });

  it("strips `<` and `>` from photographer name and URL", () => {
    const out = buildPixabayInsert(
      {
        ...SAMPLE,
        author: {
          name: `<b>fake bold</b>`,
          profileUrl: `https://evil.com/<x>`,
        },
        pageUrl: `https://pixabay.com/<inject>`,
      },
      "html",
    );
    // Assertions target the user-input lines + alt text — the natural
    // `<img>`, `<!--`, `-->` delimiters are expected to survive.
    const userLines = out.split("\n").slice(1, 3).join("\n");
    expect(userLines).not.toContain("<b>");
    expect(userLines).not.toContain("</b>");
    expect(userLines).not.toContain("<x>");
    expect(userLines).not.toContain("<inject>");
    // The `alt` attribute fallback path also needs to be free of
    // angle-bracket bytes if name leaks through tags-empty fallback.
  });

  it("collapses stray `--` runs in comment to single `-`", () => {
    // HTML5 quirks: `--` inside a comment is invalid. Browsers tolerate
    // it but spec compliance + paranoia → collapse. Test only the user-
    // input lines (the comment delimiters themselves are expected).
    const out = buildPixabayInsert(
      {
        ...SAMPLE,
        author: { name: "foo -- bar", profileUrl: "https://x" },
      },
      "html",
    );
    const userLines = out.split("\n").slice(1, 3).join("\n");
    expect(userLines).not.toContain("--");
    expect(userLines).toContain("foo - bar");
  });

  it("bounds photographer-name length to keep source from bloating", () => {
    const huge = "a".repeat(10000);
    const out = buildPixabayInsert(
      { ...SAMPLE, author: { name: huge, profileUrl: "https://x" } },
      "html",
    );
    // sanitizeForComment caps at 200 chars
    const nameLine = out.split("\n")[1];
    const aMatch = nameLine.match(/Photo by (a+)/);
    expect(aMatch).not.toBeNull();
    expect(aMatch![1].length).toBeLessThanOrEqual(200);
  });

  it("falls back to 'Photo on Pixabay' alt when both tags and name are empty", () => {
    const out = buildPixabayInsert(
      {
        ...SAMPLE,
        tags: "",
        author: { name: "", profileUrl: "" },
      },
      "html",
    );
    expect(out).toContain('alt="Photo on Pixabay"');
  });
});
