// 8th prod-import surge — direct-import tests for `lib/asset-library/*` build
// helpers. All bench-omitted modules. Each `build*Insert(asset, mode, opts?)`
// returns a pure string (no DOM/IDB) — these assert the string composition
// + mode-aware comment delimiters + JSX kebab→camelCase conversion + URL
// builders + attribution-comment correctness.
//
// Sections:
//   §1  buildEmojiInsert (lib/asset-library/insert-emoji.ts)
//   §2  buildImageInsert (Unsplash, lib/asset-library/insert-image.ts)
//   §3  buildIconInsert (Lucide, lib/asset-library/insert-icon.ts)
//   §4  buildIllustrationInsert (unDraw)
//   §5  buildSvgIconInsert (Heroicons/Phosphor/Tabler/Simple)
//   §6  buildPexelsPhotoInsert
//   §7  buildPexelsVideoInsert (file picker + autoplay attrs)
//   §8  buildFontInsert (Google Fonts CSS link + font-stack)
//   §9  buildPaletteInsert (CSS vars + @layer dropin-palette)
//   §10 buildGradientInsert + buildShadowInsert + buildDecorativeInsert + buildMockupInsert

import { describe, it, expect } from "vitest";
import { buildEmojiInsert } from "../lib/asset-library/insert-emoji";
import { buildImageInsert } from "../lib/asset-library/insert-image";
import { buildIconInsert } from "../lib/asset-library/insert-icon";
import { buildIllustrationInsert } from "../lib/asset-library/insert-illustration";
import { buildSvgIconInsert } from "../lib/asset-library/insert-svg-icon";
import { buildPexelsPhotoInsert } from "../lib/asset-library/insert-pexels-photo";
import { buildPexelsVideoInsert } from "../lib/asset-library/insert-pexels-video";
import { buildFontInsert } from "../lib/asset-library/insert-font";
import { buildPaletteInsert } from "../lib/asset-library/insert-palette";
import {
  buildGradientInsert,
  buildShadowInsert,
  buildDecorativeInsert,
  buildMockupInsert,
} from "../lib/asset-library/insert-decorative";

describe("§1 buildEmojiInsert", () => {
  it("returns the bare char when no tone provided", () => {
    expect(buildEmojiInsert("👍")).toBe("👍");
  });

  it("ignores tone when supportsTone is false", () => {
    expect(buildEmojiInsert("👍", { tone: "dark", supportsTone: false })).toBe(
      "👍",
    );
  });

  it("appends light skin tone modifier (U+1F3FB)", () => {
    expect(
      buildEmojiInsert("👍", { tone: "light", supportsTone: true }),
    ).toBe("👍\u{1F3FB}");
  });

  it("appends all 5 fitzpatrick modifiers correctly", () => {
    const tones = [
      ["light", "\u{1F3FB}"],
      ["medium-light", "\u{1F3FC}"],
      ["medium", "\u{1F3FD}"],
      ["medium-dark", "\u{1F3FE}"],
      ["dark", "\u{1F3FF}"],
    ] as const;
    for (const [tone, mod] of tones) {
      expect(
        buildEmojiInsert("✋", { tone, supportsTone: true }),
      ).toBe(`✋${mod}`);
    }
  });

  it("ignores null tone even when supportsTone is true", () => {
    expect(
      buildEmojiInsert("👍", { tone: null, supportsTone: true }),
    ).toBe("👍");
  });
});

const unsplashFixture = () => ({
  id: "abc123",
  description: "A scenic mountain",
  width: 1920,
  height: 1080,
  thumb: "https://images.unsplash.com/photo-thumb",
  small: "https://images.unsplash.com/photo-small",
  regular: "https://images.unsplash.com/photo-regular",
  full: "https://images.unsplash.com/photo-full",
  pageUrl: "https://unsplash.com/photos/abc123",
  downloadLocation: "https://api.unsplash.com/photos/abc123/download",
  author: {
    name: "Jane Doe",
    username: "janedoe",
    profileUrl: "https://unsplash.com/@janedoe",
  },
});

describe("§2 buildImageInsert (Unsplash)", () => {
  it("HTML mode: emits <!-- attribution --> comment + <img>", () => {
    const r = buildImageInsert(unsplashFixture(), "html");
    expect(r).toContain("<!--");
    expect(r).toContain("Photo by Jane Doe");
    expect(r).toContain("https://unsplash.com/@janedoe");
    expect(r).toContain("https://unsplash.com/photos/abc123");
    expect(r).toContain("-->");
    expect(r).toContain('<img src="https://images.unsplash.com/photo-regular"');
    expect(r).toContain('width="1920"');
    expect(r).toContain('height="1080"');
    expect(r).toContain('loading="lazy"');
  });

  it("JSX mode: emits {/* */} comment + numeric width/height curly", () => {
    const r = buildImageInsert(unsplashFixture(), "jsx");
    expect(r).toContain("{/*");
    expect(r).toContain("*/}");
    expect(r).toContain("width={1920}");
    expect(r).toContain("height={1080}");
  });

  it("resolution=small → uses .small URL", () => {
    const r = buildImageInsert(unsplashFixture(), "html", {
      resolution: "small",
    });
    expect(r).toContain("photo-small");
    expect(r).not.toContain("photo-regular");
  });

  it("resolution=large + original both → .full URL", () => {
    expect(
      buildImageInsert(unsplashFixture(), "html", { resolution: "large" }),
    ).toContain("photo-full");
    expect(
      buildImageInsert(unsplashFixture(), "html", { resolution: "original" }),
    ).toContain("photo-full");
  });

  it("default resolution = 'medium' (.regular URL)", () => {
    const r = buildImageInsert(unsplashFixture(), "html");
    expect(r).toContain("photo-regular");
  });

  it("alt text uses description when present", () => {
    const r = buildImageInsert(unsplashFixture(), "html");
    expect(r).toContain('alt="A scenic mountain"');
  });

  it("alt text falls back to 'Photo by <name> on Unsplash' when description empty", () => {
    const photo = { ...unsplashFixture(), description: "" };
    const r = buildImageInsert(photo, "html");
    expect(r).toContain('alt="Photo by Jane Doe on Unsplash"');
  });

  it("alt text replaces double-quotes with single (no JSX/HTML attribute escape clash)", () => {
    const photo = {
      ...unsplashFixture(),
      description: 'A "quoted" caption',
    };
    const r = buildImageInsert(photo, "html");
    expect(r).toContain("'quoted'");
    expect(r).not.toContain('"quoted"');
  });

  it("alt text truncates to 200 chars", () => {
    const photo = {
      ...unsplashFixture(),
      description: "x".repeat(500),
    };
    const r = buildImageInsert(photo, "html");
    const altMatch = r.match(/alt="(x+)"/);
    expect(altMatch).not.toBeNull();
    expect(altMatch![1]!.length).toBe(200);
  });
});

const lucideFixture = () => ({
  name: "arrow-right",
  tags: ["right", "next"],
  body: '<line x1="5" y1="12" x2="19" y2="12"/><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="12 5 19 12 12 19"/>',
});

describe("§3 buildIconInsert (Lucide)", () => {
  it("HTML mode: kebab-case attrs (stroke-width, stroke-linecap)", () => {
    const r = buildIconInsert(lucideFixture(), "html");
    expect(r).toContain('stroke-width="2"');
    expect(r).toContain('stroke-linecap="round"');
    expect(r).toContain('stroke-linejoin="round"');
    expect(r).toContain('class="lucide lucide-arrow-right"');
  });

  it("JSX mode: camelCase attrs + className (body kebab→camel converted)", () => {
    const r = buildIconInsert(lucideFixture(), "jsx");
    expect(r).toContain("strokeWidth={2}");
    expect(r).toContain('strokeLinecap="round"');
    expect(r).toContain("className=");
    // The body's kebab-case attrs should be converted too.
    expect(r).not.toContain("stroke-linecap=");
    expect(r).not.toContain("stroke-width=");
  });

  it("default size=24, strokeWidth=2, color=currentColor", () => {
    const r = buildIconInsert(lucideFixture(), "html");
    expect(r).toContain('width="24"');
    expect(r).toContain('height="24"');
    expect(r).toContain('stroke="currentColor"');
  });

  it("custom opts override defaults", () => {
    const r = buildIconInsert(lucideFixture(), "html", {
      size: 32,
      strokeWidth: 1.5,
      color: "#ff0000",
    });
    expect(r).toContain('width="32"');
    expect(r).toContain('height="32"');
    expect(r).toContain('stroke="#ff0000"');
    expect(r).toContain('stroke-width="1.5"');
  });

  it("partial opts merge with defaults (only size override)", () => {
    const r = buildIconInsert(lucideFixture(), "html", { size: 48 });
    expect(r).toContain('width="48"');
    expect(r).toContain('stroke="currentColor"'); // default
    expect(r).toContain('stroke-width="2"'); // default
  });

  it("includes the icon body verbatim", () => {
    const r = buildIconInsert(lucideFixture(), "html");
    expect(r).toContain("<line");
    expect(r).toContain("<polyline");
  });
});

const undrawFixture = () => ({
  slug: "happy-news",
  title: "Happy news",
  tags: ["celebration"],
  viewBox: "0 0 800 600",
  body: '<path fill="#6c63ff" d="M0 0h10v10H0z" stroke-linecap="round"/>',
});

describe("§4 buildIllustrationInsert (unDraw)", () => {
  it("default color = var(--primary, #6c63ff) — palette-aware", () => {
    const r = buildIllustrationInsert(undrawFixture(), "html");
    expect(r).toContain("var(--primary, #6c63ff)");
    expect(r).not.toContain("fill=\"#6c63ff\"");
  });

  it("custom color replaces #6c63ff in the body", () => {
    const r = buildIllustrationInsert(undrawFixture(), "html", {
      color: "#ff0000",
    });
    expect(r).toContain('fill="#ff0000"');
    expect(r).not.toContain("#6c63ff");
  });

  it("HTML mode: comment, viewBox attr, role, aria-label preserved", () => {
    const r = buildIllustrationInsert(undrawFixture(), "html");
    expect(r).toContain("<!-- unDraw illustration: Happy news -->");
    expect(r).toContain('viewBox="0 0 800 600"');
    expect(r).toContain('role="img"');
    expect(r).toContain('aria-label="Happy news"');
  });

  it("JSX mode: kebab→camel attr conversion (stroke-linecap → strokeLinecap)", () => {
    const r = buildIllustrationInsert(undrawFixture(), "jsx");
    expect(r).toContain("strokeLinecap=");
    expect(r).not.toContain("stroke-linecap=");
  });

  it("default width = '100%'", () => {
    const r = buildIllustrationInsert(undrawFixture(), "html");
    expect(r).toContain('width="100%"');
  });

  it("custom width override", () => {
    const r = buildIllustrationInsert(undrawFixture(), "html", {
      width: "320px",
    });
    expect(r).toContain('width="320px"');
  });
});

describe("§5 buildSvgIconInsert (generic SVG icons)", () => {
  const heroOutline = () => ({
    name: "arrow",
    body: '<path stroke-linecap="round" d="M5 12h14"/>',
  });

  it("stroke mode emits stroke-width + stroke-linecap (HTML)", () => {
    const r = buildSvgIconInsert(heroOutline(), "html", {
      size: 24,
      viewBox: "0 0 24 24",
      mode: "stroke",
      strokeWidth: 1.5,
    });
    expect(r).toContain('stroke-width="1.5"');
    expect(r).toContain('fill="none"');
    expect(r).toContain('stroke="currentColor"');
  });

  it("stroke mode (JSX): camelCase + className + numeric strokeWidth in {}", () => {
    const r = buildSvgIconInsert(heroOutline(), "jsx", {
      size: 24,
      viewBox: "0 0 24 24",
      mode: "stroke",
      strokeWidth: 2,
    });
    expect(r).toContain("strokeWidth={2}");
    expect(r).toContain("strokeLinecap=");
    expect(r).toContain("className=");
  });

  it("fill mode (HTML): no stroke, fills with the color", () => {
    const r = buildSvgIconInsert(
      { name: "star", body: '<path d="M12 2l3 7"/>' },
      "html",
      { size: 24, viewBox: "0 0 24 24", mode: "fill" },
    );
    expect(r).toContain('fill="currentColor"');
    expect(r).not.toContain("stroke=");
  });

  it("classPrefix yields '<prefix> <prefix>-<name>' (e.g. 'hi hi-arrow')", () => {
    const r = buildSvgIconInsert(heroOutline(), "html", {
      size: 24,
      viewBox: "0 0 24 24",
      mode: "stroke",
      classPrefix: "hi",
    });
    expect(r).toContain('class="hi hi-arrow"');
  });

  it("no classPrefix → just the name", () => {
    const r = buildSvgIconInsert(heroOutline(), "html", {
      size: 24,
      viewBox: "0 0 24 24",
      mode: "stroke",
    });
    expect(r).toContain('class="arrow"');
  });

  it("default strokeWidth=2 when not specified", () => {
    const r = buildSvgIconInsert(heroOutline(), "html", {
      size: 24,
      viewBox: "0 0 24 24",
      mode: "stroke",
    });
    expect(r).toContain('stroke-width="2"');
  });

  it("custom color override", () => {
    const r = buildSvgIconInsert(heroOutline(), "html", {
      size: 24,
      viewBox: "0 0 24 24",
      mode: "fill",
      color: "#0000ff",
    });
    expect(r).toContain('fill="#0000ff"');
  });
});

const pexelsPhoto = () => ({
  id: 12345,
  width: 1920,
  height: 1280,
  url: "https://www.pexels.com/photo/12345/",
  photographer: "John Smith",
  photographerUrl: "https://www.pexels.com/@john-smith",
  alt: "City skyline",
  src: {
    original: "https://images.pexels.com/12345/orig.jpg",
    large2x: "https://images.pexels.com/12345/large2x.jpg",
    large: "https://images.pexels.com/12345/large.jpg",
    medium: "https://images.pexels.com/12345/medium.jpg",
    small: "https://images.pexels.com/12345/small.jpg",
    portrait: "",
    landscape: "",
    tiny: "",
  },
});

describe("§6 buildPexelsPhotoInsert", () => {
  it("HTML mode emits attribution comment + <img>", () => {
    const r = buildPexelsPhotoInsert(pexelsPhoto(), "html");
    expect(r).toContain("Photo by John Smith");
    expect(r).toContain("on Pexels");
    expect(r).toContain('<img src="https://images.pexels.com/12345/medium.jpg"');
  });

  it("default resolution = 'medium'", () => {
    const r = buildPexelsPhotoInsert(pexelsPhoto(), "html");
    expect(r).toContain("medium.jpg");
  });

  it("resolution=small/large/original use the matching .src.* URL", () => {
    expect(
      buildPexelsPhotoInsert(pexelsPhoto(), "html", { resolution: "small" }),
    ).toContain("small.jpg");
    expect(
      buildPexelsPhotoInsert(pexelsPhoto(), "html", { resolution: "large" }),
    ).toContain("large.jpg");
    expect(
      buildPexelsPhotoInsert(pexelsPhoto(), "html", { resolution: "original" }),
    ).toContain("orig.jpg");
  });

  it("alt fallback to 'Photo by <name> on Pexels' when alt empty", () => {
    const photo = { ...pexelsPhoto(), alt: "" };
    const r = buildPexelsPhotoInsert(photo, "html");
    expect(r).toContain('alt="Photo by John Smith on Pexels"');
  });

  it("JSX mode: numeric width/height in curly braces", () => {
    const r = buildPexelsPhotoInsert(pexelsPhoto(), "jsx");
    expect(r).toContain("width={1920}");
    expect(r).toContain("height={1280}");
  });
});

const pexelsVideo = () => ({
  id: 999,
  width: 1920,
  height: 1080,
  url: "https://www.pexels.com/video/999/",
  user: { name: "Vid Maker", url: "https://www.pexels.com/@vidmaker" },
  image: "https://images.pexels.com/video/999/poster.jpg",
  duration: 12,
  video_files: [
    {
      id: 1,
      quality: "sd",
      file_type: "video/mp4",
      width: 960,
      height: 540,
      link: "https://videos.pexels.com/999-540p.mp4",
    },
    {
      id: 2,
      quality: "hd",
      file_type: "video/mp4",
      width: 1920,
      height: 1080,
      link: "https://videos.pexels.com/999-1080p.mp4",
    },
    {
      id: 3,
      quality: "uhd",
      file_type: "video/mp4",
      width: 3840,
      height: 2160,
      link: "https://videos.pexels.com/999-2160p.mp4",
    },
  ],
});

describe("§7 buildPexelsVideoInsert", () => {
  it("default resolution=hd → 1080p file picked", () => {
    const r = buildPexelsVideoInsert(pexelsVideo(), "html");
    expect(r).toContain("999-1080p.mp4");
  });

  it("resolution=sd → 540p file picked", () => {
    const r = buildPexelsVideoInsert(pexelsVideo(), "html", {
      resolution: "sd",
    });
    expect(r).toContain("999-540p.mp4");
  });

  it("resolution=uhd → 2160p file picked", () => {
    const r = buildPexelsVideoInsert(pexelsVideo(), "html", {
      resolution: "uhd",
    });
    expect(r).toContain("999-2160p.mp4");
  });

  it("HTML mode: autoplay + loop + muted + playsinline + poster", () => {
    const r = buildPexelsVideoInsert(pexelsVideo(), "html");
    expect(r).toContain("autoplay");
    expect(r).toContain("loop");
    expect(r).toContain("muted");
    expect(r).toContain("playsinline");
    expect(r).toContain('poster="https://images.pexels.com/video/999/poster.jpg"');
    expect(r).toContain('class="w-full h-full object-cover"');
    expect(r).toContain('<source src="');
    expect(r).toContain('type="video/mp4"');
  });

  it("JSX mode: autoPlay + playsInline + className", () => {
    const r = buildPexelsVideoInsert(pexelsVideo(), "jsx");
    expect(r).toContain("autoPlay");
    expect(r).toContain("playsInline");
    expect(r).toContain("className=");
  });

  it("falls back to nearest height when exact-quality match missing", () => {
    const noHd = {
      ...pexelsVideo(),
      video_files: [
        // Only sd present — request hd; should pick by nearest height.
        pexelsVideo().video_files[0]!,
      ],
    };
    const r = buildPexelsVideoInsert(noHd, "html", { resolution: "hd" });
    expect(r).toContain("540p.mp4");
  });

  it("emits attribution comment with author + video page url", () => {
    const r = buildPexelsVideoInsert(pexelsVideo(), "html");
    expect(r).toContain("Video by Vid Maker");
    expect(r).toContain("https://www.pexels.com/@vidmaker");
    expect(r).toContain("https://www.pexels.com/video/999/");
  });
});

const fontFixture = () => ({
  family: "Source Code Pro",
  category: "monospace" as const,
  weights: ["400", "500", "700"],
});

describe("§8 buildFontInsert", () => {
  it("global mode: emits <link> + <style> with body { font-family: ... }", () => {
    const r = buildFontInsert(fontFixture(), "html", { applyMode: "global" });
    expect(r).toContain("Google Font: Source Code Pro");
    expect(r).toContain("https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;700&display=swap");
    expect(r).toContain("<style>body { font-family:");
    expect(r).toContain("ui-monospace");
    expect(r).toContain("monospace");
  });

  it("var mode: emits :root { --font-custom: ... }", () => {
    const r = buildFontInsert(fontFixture(), "html", { applyMode: "var" });
    expect(r).toContain(":root { --font-custom:");
  });

  it("var mode with custom cssVarName", () => {
    const r = buildFontInsert(fontFixture(), "html", {
      applyMode: "var",
      cssVarName: "--my-mono",
    });
    expect(r).toContain("--my-mono");
  });

  it("font-stack varies by category (serif → 'Georgia, serif')", () => {
    const serif = { ...fontFixture(), category: "serif" as const };
    const r = buildFontInsert(serif, "html", { applyMode: "global" });
    expect(r).toContain("Georgia, serif");
  });

  it("font-stack — sans-serif → 'system-ui, sans-serif'", () => {
    const sans = { ...fontFixture(), category: "sans-serif" as const };
    const r = buildFontInsert(sans, "html", { applyMode: "global" });
    expect(r).toContain("system-ui, sans-serif");
  });

  it("subset weights applied via opts.weights", () => {
    const r = buildFontInsert(fontFixture(), "html", {
      applyMode: "global",
      weights: ["400", "700"],
    });
    expect(r).toContain(":wght@400;700");
  });

  it("URL space encoding uses '+' (Google Fonts convention)", () => {
    const r = buildFontInsert(fontFixture(), "html", { applyMode: "global" });
    expect(r).toContain("Source+Code+Pro");
  });

  it("JSX mode wraps style in dangerouslySetInnerHTML", () => {
    const r = buildFontInsert(fontFixture(), "jsx", { applyMode: "global" });
    expect(r).toContain("dangerouslySetInnerHTML");
  });
});

const paletteFixture = () => ({
  id: "ocean",
  name: "Ocean",
  mood: "muted" as const,
  tags: [],
  colors: {
    background: "#F5F1EA",
    foreground: "#18141C",
    primary: "#0EA5E9",
    secondary: "#64748B",
    accent: "#14B8A6",
    muted: "#94A3B8",
    border: "#CBD5E1",
  },
});

describe("§9 buildPaletteInsert", () => {
  it("emits @layer dropin-palette CSS block", () => {
    const r = buildPaletteInsert(paletteFixture(), "html");
    expect(r).toContain("@layer dropin-palette");
  });

  it("emits all 7 palette tokens as CSS custom properties on :root", () => {
    const r = buildPaletteInsert(paletteFixture(), "html");
    expect(r).toContain("--background: #F5F1EA");
    expect(r).toContain("--foreground: #18141C");
    expect(r).toContain("--primary: #0EA5E9");
    expect(r).toContain("--secondary: #64748B");
    expect(r).toContain("--accent: #14B8A6");
    expect(r).toContain("--muted: #94A3B8");
    expect(r).toContain("--border: #CBD5E1");
  });

  it("emits html, body override with !important", () => {
    const r = buildPaletteInsert(paletteFixture(), "html");
    expect(r).toContain("html, body");
    expect(r).toContain("!important");
  });

  it("targets #root > * (NOT > * > * — anti-carpet-bomb)", () => {
    const r = buildPaletteInsert(paletteFixture(), "html");
    expect(r).toContain("#root > *");
    expect(r).not.toContain("#root > * > *");
  });

  it("HTML mode wraps in <style>, JSX wraps in <style dangerouslySetInnerHTML={{ __html: ... }}>", () => {
    expect(buildPaletteInsert(paletteFixture(), "html")).toContain("<style>");
    expect(buildPaletteInsert(paletteFixture(), "jsx")).toContain(
      "dangerouslySetInnerHTML",
    );
  });

  it("comment header includes palette name", () => {
    expect(buildPaletteInsert(paletteFixture(), "html")).toContain(
      "<!-- Palette: Ocean -->",
    );
    expect(buildPaletteInsert(paletteFixture(), "jsx")).toContain(
      "{/* Palette: Ocean */}",
    );
  });
});

describe("§10 decorative inserts", () => {
  describe("buildGradientInsert", () => {
    const gradientFixture = () => ({
      id: "ocean",
      name: "Ocean Breeze",
      css: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
      tags: [],
      kind: "linear" as const,
    });

    it("emits @layer dropin-palette + html, body override + #root > * override", () => {
      const r = buildGradientInsert(gradientFixture(), "html");
      expect(r).toContain("@layer dropin-palette");
      expect(r).toContain("html, body");
      expect(r).toContain("#root > *");
    });

    it("includes the gradient CSS verbatim with !important", () => {
      const r = buildGradientInsert(gradientFixture(), "html");
      expect(r).toContain("linear-gradient(135deg, #56ab2f 0%, #a8e063 100%) !important");
    });

    it("background-attachment: fixed for both selectors", () => {
      const r = buildGradientInsert(gradientFixture(), "html");
      expect(r.match(/background-attachment: fixed/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    });

    it("comment header includes gradient name", () => {
      expect(buildGradientInsert(gradientFixture(), "html")).toContain(
        "Gradient: Ocean Breeze",
      );
    });
  });

  describe("buildShadowInsert", () => {
    const shadowFixture = () => ({
      id: "soft",
      name: "Soft shadow",
      css: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      tags: [],
    });

    it("emits scoped class .dropin-shadow-<id> + sample <div>", () => {
      const r = buildShadowInsert(shadowFixture(), "html");
      expect(r).toContain(".dropin-shadow-soft");
      expect(r).toContain('<div class="dropin-shadow-soft">');
    });

    it("includes the box-shadow CSS verbatim", () => {
      const r = buildShadowInsert(shadowFixture(), "html");
      expect(r).toContain("box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)");
    });

    it("JSX mode uses className", () => {
      const r = buildShadowInsert(shadowFixture(), "jsx");
      expect(r).toContain('className="dropin-shadow-soft"');
    });
  });

  describe("buildDecorativeInsert (pattern/wave/blob)", () => {
    const patternSvg = () => ({
      id: "dots",
      name: "Dots pattern",
      kind: "pattern" as const,
      viewBox: "0 0 40 40",
      body: '<circle cx="2" cy="2" r="2" fill="#6c63ff"/>',
    });

    it("default pattern emits inline SVG (NOT background)", () => {
      const r = buildDecorativeInsert(patternSvg(), "html");
      expect(r).toContain("<svg xmlns=");
      expect(r).toContain("viewBox=\"0 0 40 40\"");
      expect(r).not.toContain("background-image:");
    });

    it("pattern with asBackground=true emits .dropin-pattern-<id> CSS class + data URI", () => {
      const r = buildDecorativeInsert(patternSvg(), "html", {
        asBackground: true,
      });
      expect(r).toContain(".dropin-pattern-dots");
      expect(r).toContain("background-image: url(\"data:image/svg+xml;utf8,");
      expect(r).toContain("background-repeat: repeat");
    });

    it("pattern color swap: replaces #6c63ff in body", () => {
      const r = buildDecorativeInsert(patternSvg(), "html", {
        color: "#ff0000",
      });
      expect(r).toContain("#ff0000");
      expect(r).not.toContain("#6c63ff");
    });

    it("default color = var(--primary, #6c63ff)", () => {
      const r = buildDecorativeInsert(patternSvg(), "html");
      expect(r).toContain("var(--primary, #6c63ff)");
    });

    it("wave kind: full-width svg block", () => {
      const wave = { ...patternSvg(), kind: "wave" as const };
      const r = buildDecorativeInsert(wave, "html");
      expect(r).toContain('class="w-full h-auto block"');
    });

    it("blob kind: absolutely positioned bg svg", () => {
      const blob = { ...patternSvg(), kind: "blob" as const };
      const r = buildDecorativeInsert(blob, "html");
      expect(r).toContain("absolute inset-0");
      expect(r).toContain("-z-10");
      expect(r).toContain("pointer-events-none");
    });

    it("preserveAspectRatio attr threaded through", () => {
      const wave = {
        ...patternSvg(),
        kind: "wave" as const,
        preserveAspectRatio: "none",
      };
      const r = buildDecorativeInsert(wave, "html");
      expect(r).toContain('preserveAspectRatio="none"');
    });

    it("JSX mode: kebab→camel attr conversion in body", () => {
      const svg = {
        ...patternSvg(),
        body: '<path stroke-linecap="round" fill="#6c63ff"/>',
      };
      const r = buildDecorativeInsert(svg, "jsx");
      expect(r).toContain("strokeLinecap=");
      expect(r).not.toContain("stroke-linecap=");
    });
  });

  describe("buildMockupInsert", () => {
    const mockupFixture = () => ({
      id: "browser",
      name: "Browser frame",
      kind: "browser" as const,
      template:
        '<div class="rounded-xl overflow-hidden"><img src="{{IMAGE_SRC}}"></div>',
    });

    it("substitutes {{IMAGE_SRC}} with provided URL", () => {
      const r = buildMockupInsert(mockupFixture(), "html", {
        imageUrl: "https://example.com/x.jpg",
      });
      expect(r).toContain("https://example.com/x.jpg");
      expect(r).not.toContain("{{IMAGE_SRC}}");
    });

    it("falls back to placeholder Unsplash URL when no imageUrl provided", () => {
      const r = buildMockupInsert(mockupFixture(), "html");
      expect(r).toContain("images.unsplash.com");
    });

    it("JSX mode: class= → className= AND <img...> → <img.../> self-closing", () => {
      const r = buildMockupInsert(mockupFixture(), "jsx");
      expect(r).toContain('className="rounded-xl');
      expect(r).not.toContain('class="rounded-xl');
      expect(r).toMatch(/<img[^>]+\/>/);
    });

    it("HTML mode preserves class= and non-self-closing imgs", () => {
      const r = buildMockupInsert(mockupFixture(), "html");
      expect(r).toContain('class="rounded-xl');
      expect(r).not.toContain("className=");
    });

    it("comment header includes mockup name", () => {
      expect(buildMockupInsert(mockupFixture(), "html")).toContain(
        "Mockup: Browser frame",
      );
    });
  });
});
