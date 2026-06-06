// Prod-import tests for the swap-payload comment stripper. Guards the
// live-demo image-swap crash: a comment-led media insert dropped into a
// single-expression JSX slot blanks the preview.

import { describe, it, expect } from "vitest";
import { stripLeadingAttributionComment } from "../lib/asset-library/strip-attribution-comment";
import { buildImageInsert } from "../lib/asset-library/insert-image";
import { buildPixabayInsert } from "../lib/asset-library/insert-pixabay";

describe("stripLeadingAttributionComment", () => {
  it("strips a leading JSX attribution comment, leaving a single <img> node", () => {
    const payload = `{/*\n  Photo by Jane on Unsplash\n*/}\n<img src="/x.jpg" alt="cat" />`;
    const out = stripLeadingAttributionComment(payload);
    expect(out).toBe(`<img src="/x.jpg" alt="cat" />`);
    expect(out.startsWith("<img")).toBe(true);
  });

  it("strips a leading HTML attribution comment", () => {
    const payload = `<!-- Photo by Jane on Pixabay -->\n<img src="/x.jpg" alt="dog" />`;
    expect(stripLeadingAttributionComment(payload)).toBe(
      `<img src="/x.jpg" alt="dog" />`,
    );
  });

  it("leaves comment-free markup (icon SVG) untouched", () => {
    const svg = `<svg viewBox="0 0 24 24"><path d="M1 1" /></svg>`;
    expect(stripLeadingAttributionComment(svg)).toBe(svg);
  });

  it("strips only ONE leading comment, never real content", () => {
    const payload = `{/* a */}\n<img src="/x.jpg" />`;
    const out = stripLeadingAttributionComment(payload);
    expect(out).toBe(`<img src="/x.jpg" />`);
    // A comment that is NOT leading is preserved.
    const mid = `<img src="/x.jpg" />{/* trailing */}`;
    expect(stripLeadingAttributionComment(mid)).toBe(mid);
  });

  it("turns the real Unsplash insert builder output into a single JSX node", () => {
    const photo: any = {
      small: "/s.jpg",
      regular: "/r.jpg",
      full: "/f.jpg",
      width: 640,
      height: 480,
      description: "a cat",
      author: { name: "Jane", profileUrl: "https://unsplash.com/@jane" },
      pageUrl: "https://unsplash.com/photos/abc",
    };
    const built = buildImageInsert(photo, "jsx");
    expect(built.trimStart().startsWith("{/*")).toBe(true);
    const stripped = stripLeadingAttributionComment(built);
    expect(stripped.startsWith("<img")).toBe(true);
    expect(stripped).not.toContain("{/*");
  });

  it("turns the real Pixabay insert builder output into a single JSX node", () => {
    const photo: any = {
      preview: "/p.jpg",
      webformat: "/w.jpg",
      large: "/l.jpg",
      width: 800,
      height: 600,
      tags: "dog, animal",
      pageUrl: "https://pixabay.com/photos/abc",
      author: { name: "Jane", profileUrl: "https://pixabay.com/users/jane-1/" },
    };
    const built = buildPixabayInsert(photo, "jsx");
    const stripped = stripLeadingAttributionComment(built);
    expect(stripped.startsWith("<img")).toBe(true);
    expect(stripped).not.toContain("{/*");
  });
});
