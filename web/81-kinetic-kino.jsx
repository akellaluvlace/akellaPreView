export default function T81KineticKino() {
  const navLinks = ["Typefaces", "Variable", "Licensing", "About"];

  const heroLetters = [
    { ch: "L", v: 2 }, { ch: "I", v: 4 }, { ch: "V", v: 1 },
    { ch: "I", v: 5 }, { ch: "N", v: 3 }, { ch: "G", v: 2 },
    { ch: "T", v: 1, gap: true }, { ch: "Y", v: 5 }, { ch: "P", v: 3 }, { ch: "E", v: 4 },
  ];

  const typefaces = [
    { name: "GROTESK NEUE", meta: "Kinetica Foundry / 3 Axes / Variable", v: 5 },
    { name: "MONO-X", meta: "Kinetica Foundry / 2 Axes / Variable Mono", v: 1 },
    { name: "SLANT PRO", meta: "Kinetica Foundry / Slant Axis Only / Display", v: 3, last: true },
  ];

  const blocks = [
    {
      idx: "01 / Concept",
      title: "Axis Variation",
      v: 5,
      body: "A single file containing infinite stylistic points. Seamlessly animate between weight, width, and optical size without loading multiple font weights.",
    },
    {
      idx: "02 / Tech",
      title: "Performance",
      v: 1,
      body: "Drastically reduce web payload. One 80kb file replaces a dozen static woff2 files, improving load times while expanding typographic capabilities.",
    },
    {
      idx: "03 / Design",
      title: "Expression",
      v: 3,
      body: "Fine-tune typography to fit exact container widths. Respond to user input, viewport size, or scroll depth with dynamic typographic adjustments.",
      last: true,
    },
  ];

  const footerLinks = ["Technical Docs", "End User License", "Specimen PDF", "Contact"];

  const specimens = [
    { id: "SP_01", title: "Aa", v: 2, meta: "GROTESK NEUE · 240pt", w: "w-72", bg: "bg-tertiary-container", textColor: "text-background", chip1: "PRESS", chip1Cls: "bg-magenta text-background", tagCls: "bg-background text-primary", grad: "from-primary via-primary/50 to-transparent", dir: "t", italic: false, extraImg: "opacity-65" },
    { id: "SP_02", title: "Mm", v: 1, meta: "MONO-X · 144pt · OFFSET", w: "w-80", bg: "bg-magenta", textColor: "text-background", chip1: "FACADE", chip1Cls: "bg-primary text-background", tagCls: "bg-background text-magenta", grad: "from-magenta/40 via-transparent to-primary/70", dir: "bl", italic: false, extraImg: "mix-blend-multiply opacity-90", srcOverride: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1000&q=85&auto=format&fit=crop" },
    { id: "SP_03", title: "Ss", v: 3, meta: "SLANT PRO · 96pt · 14°", w: "w-72", bg: "bg-background", textColor: "text-primary", chip1: "SLANT", chip1Cls: "bg-magenta text-background", tagCls: "bg-primary text-background", grad: "from-background via-background/40 to-transparent", dir: "t", italic: true, extraImg: "opacity-90", srcOverride: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop" },
    { id: "SP_04", title: "XX", v: 5, meta: "GROTESK NEUE · 380pt · POSTER", w: "w-96", bg: "bg-tertiary-container", textColor: "text-background", chip1: "TRACE", chip1Cls: "bg-background text-primary", tagCls: "bg-magenta text-background", grad: "from-primary via-transparent to-magenta/30", dir: "tr", italic: false, extraImg: "opacity-50", srcOverride: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1100&q=85&auto=format&fit=crop" },
    { id: "SP_05", title: "Th", v: 4, meta: "SLANT PRO · 60pt · LIGHT", w: "w-72", bg: "bg-background", textColor: "text-primary", chip1: "CORNICE", chip1Cls: "bg-magenta text-background", tagCls: "bg-primary text-background", grad: "from-background/85 via-background/30 to-transparent", dir: "t", italic: true, extraImg: "opacity-85", srcOverride: "https://images.unsplash.com/photo-1638294621924-be97f5f92413?w=900&q=85&auto=format&fit=crop" },
    { id: "SP_06", title: "Gg", v: 2, meta: "GROTESK NEUE · 180pt", w: "w-80", bg: "bg-magenta", textColor: "text-background", chip1: "DRAFT", chip1Cls: "bg-primary text-background", tagCls: "bg-background text-magenta", grad: "from-magenta/30 via-transparent to-primary/60", dir: "r", italic: false, extraImg: "mix-blend-multiply opacity-85", srcOverride: "https://images.unsplash.com/photo-1638294621924-be97f5f92413?w=1000&q=85&auto=format&fit=crop" },
  ];

  const inUseRows = [
    { side: "left", num: "USE 01 — EDITORIAL", title: "A weekly tabloid in two weights.", titleV: 2, body: "Sundown Gazette runs Grotesk Neue at axis 200 for body and axis 900 for sirens. The same file. The whole specimen on a 96-page issue: 80 KB.", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1400&q=85&auto=format&fit=crop", alt: "Industrial press machinery — Sundown Gazette running Grotesk Neue across the weekly print run", chip: "USE · 01", pill: "SUNDOWN GAZETTE", grad: "from-primary/55 via-transparent to-transparent", dir: "t", stats: [{ v: "52", l: "Issues/yr" }, { v: "2", l: "Axes used" }, { v: "80kb", l: "Payload" }] },
    { side: "right", num: "USE 02 — STAGE", title: "Festival signage at 380pt.", titleV: 1, body: "The Berlin biennial set MONO-X across 240 m² of vinyl. The plotter ran Mono-X axis 200 → 700 between cuts; the line never deviated.", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=85&auto=format&fit=crop", chip: "USE · 02", pill: "BERLIN BIENNIAL", grad: "from-primary/65 via-transparent to-magenta/15", dir: "bl", bullets: ["240 m² · 14 panels", "Cut at 380pt · MONO-X", "12 nights · zero re-set"] },
    { side: "left", num: "USE 03 — INSTITUTION", title: "Wayfinding in the Vault.", titleV: 3, italic: true, body: "Slant Pro at axis 1, weight 200, runs every door label and exhibit caption in the Vault Museum's seven floors. Italics that don't bend the eye.", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=85&auto=format&fit=crop", chip: "USE · 03", pill: "VAULT MUSEUM", grad: "from-primary/55 via-transparent to-transparent", dir: "r", caseLink: "Read the case study →" },
  ];

  const tenets = [
    { i: "I", color: "text-magenta", title: "A typeface is software, not jewellery.", body: "Ship the variable file, not the licence call. The stylist comes second; the engineer comes first.", tag: "TENET_01" },
    { i: "II", color: "text-tertiary-fixed-dim", title: "Draw the axis before the alphabet.", body: "Decide what changes — width, slant, contrast — before you draw the A. The whole family follows the axis, not the other way around.", tag: "TENET_02" },
    { i: "III", color: "text-magenta", title: "Italics earn their slant.", body: "Auto-italics are an insult. Each italic glyph gets drawn from scratch — or you don't ship the italic.", tag: "TENET_03" },
    { i: "IV", color: "text-tertiary-fixed-dim", title: "If it doesn't load fast, it doesn't ship.", body: "The file is opened more often than it is read. Strip everything that doesn't serve the eye on a 3G connection.", tag: "TENET_04" },
    { i: "V", color: "text-magenta", title: "License once. Update forever.", body: "A buyer pays once for a font. The foundry repays them with five years of bug fixes and the next axis on the house.", tag: "TENET_05" },
  ];

  // Trusted-by foundry partners — design/publishing tool brands via simpleicons.org CDN.
  // Slugs verified via HEAD before commit (figma/webflow/framer/medium/notion all 200).
  const FOUNDRY_PARTNERS = [
    { name: "Figma",    slug: "figma" },
    { name: "Webflow",  slug: "webflow" },
    { name: "Framer",   slug: "framer" },
    { name: "Medium",   slug: "medium" },
    { name: "Notion",   slug: "notion" },
  ];

  // Foundry Compact — 4 premium cards explaining what every Kinetica licence ships with.
  const FOUNDRY_COMPACT = [
    {
      roman: "I",
      tag: "Compact · 01",
      title: "One file, every axis.",
      body: "A single .woff2 contains weight, width, optical-size and slant — no per-weight licence calls, no fallback fonts. The studio panel slices static cuts on demand, free.",
      foot: "≤ 80 KB · all axes",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 18.375c0 .621.504 1.125 1.125 1.125" />,
    },
    {
      roman: "II",
      tag: "Compact · 02",
      title: "Italics drawn, not slanted.",
      body: "Each italic glyph is hand-drawn from scratch — no auto-skew, no fake oblique. If a face doesn't earn its italic, we don't ship one until the next axis cuts.",
      foot: "0% auto-italic",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 4.5 6 15m6-2.063L18.75 21l-2.25-3.563M3.75 6.563 6 3l2.25 3.563" />,
    },
    {
      roman: "III",
      tag: "Compact · 03",
      title: "Source files included.",
      body: "Every commercial licence ships with the .glyphs source plus the variable .woff2. Print desks slice the cuts they want; the foundry signs the slice as part of the licence.",
      foot: ".glyphs · .woff2 · signed",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />,
    },
    {
      roman: "IV",
      tag: "Compact · 04",
      title: "Five-year update guarantee.",
      body: "A buyer pays once. The foundry repays them with five years of bug fixes plus the next axis on the house — no re-licence fee, no surprise migration. Buy once, run for the cycle.",
      foot: "5 yrs · update · gratis",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />,
    },
  ];

  const kinoFaq = [
    { i: "01", color: "text-magenta", q: "Is the variable file the only file you ship?", a: "Yes. One .woff2, every axis. The static cuts are sliced from the variable on demand if a buyer needs them — but the licence covers the whole space.", open: true },
    { i: "02", color: "text-primary", q: "Can I license for a single project?", a: "Always. One-shot licences live in the studio panel; perpetual licences live in the foundry. Both ship within the hour, both come with the five-year update guarantee." },
    { i: "03", color: "text-magenta", q: "What about variable in print?", a: "Adobe and Affinity both speak the variable axis as of 2024. We ship a `.glyphs` source plus the `.woff2`; print desks pick the slice they want, foundry signs the slice." },
    { i: "04", color: "text-primary", q: "Do you do bespoke?", a: "Three commissions a year, six months minimum. Conversations begin with a single page of brief; the first axis cuts in week six." },
    { i: "05", color: "text-magenta", q: "Why no decoration on the page?", a: "The typography is the decoration. Anything else competes with the specimen." },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-tertiary": "#ffffff", "surface-container-highest": "#e2e2e2",
            "inverse-surface": "#303030", "on-tertiary-container": "#848484",
            "on-background": "#1b1b1b", "on-secondary-fixed-variant": "#92001c",
            "on-error": "#ffffff", "primary": "#000000", "surface-container-high": "#e8e8e8",
            "primary-fixed-dim": "#c6c6c6", "secondary-fixed-dim": "#ffb3b1",
            "on-primary-fixed-variant": "#474747", "surface-variant": "#e2e2e2",
            "secondary-fixed": "#ffdad8", "on-secondary-container": "#fffbff",
            "surface-bright": "#f9f9f9", "on-primary-container": "#848484",
            "secondary-container": "#db313f", "on-error-container": "#93000a",
            "surface": "#f9f9f9", "tertiary-fixed-dim": "#c6c6c6",
            "on-surface": "#1b1b1b", "primary-fixed": "#e2e2e2",
            "tertiary-container": "#1b1b1b", "on-surface-variant": "#4c4546",
            "on-tertiary-fixed": "#1b1b1b", "on-secondary": "#ffffff",
            "surface-tint": "#5e5e5e", "outline-variant": "#cfc4c5",
            "inverse-primary": "#c6c6c6", "surface-container-low": "#f3f3f3",
            "on-primary": "#ffffff", "error-container": "#ffdad6",
            "surface-container": "#eeeeee", "surface-container-lowest": "#ffffff",
            "on-secondary-fixed": "#410007", "background": "#f4f3ee",
            "on-primary-fixed": "#1b1b1b", "secondary": "#e63946",
            "primary-container": "#1b1b1b", "outline": "#7e7576",
            "error": "#ba1a1a", "tertiary-fixed": "#e2e2e2",
            "surface-dim": "#dadada", "on-tertiary-fixed-variant": "#474747",
            "inverse-on-surface": "#f1f1f1", "tertiary": "#000000"
          },
          borderRadius: { DEFAULT: "0px", lg: "0px", xl: "0px", full: "0px" },
          spacing: {
            unit: "8px", "stack-xl": "96px", "stack-lg": "48px",
            "stack-sm": "8px", "margin-side": "64px", "stack-md": "24px",
            gutter: "24px", "container-max": "1440px"
          },
          fontFamily: {
            "body-md": ["Epilogue"], "headline-lg": ["Epilogue"],
            "label-mono": ["Space Grotesk"], "body-lg": ["Epilogue"],
            "headline-md": ["Epilogue"], "display-xl": ["Epilogue"]
          },
          fontSize: {
            "body-md": ["16px", { lineHeight: "24px", letterSpacing: "0", fontWeight: "400" }],
            "headline-lg": ["64px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "700" }],
            "label-mono": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" }],
            "body-lg": ["20px", { lineHeight: "30px", letterSpacing: "0", fontWeight: "400" }],
            "headline-md": ["48px", { lineHeight: "56px", letterSpacing: "-0.01em", fontWeight: "600" }],
            "display-xl": ["clamp(60px, 12vw, 120px)", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "800" }]
          }
        }
      }
    };
  `;

  const customCss = `
    body { background-color: #F4F3EE; color: #000000; }
    .bg-magenta { background-color: #E63946; }
    .text-magenta { color: #E63946; }
    .border-magenta { border-color: #E63946; }
    .hover-bg-magenta:hover { background-color: #E63946; color: white; }
    .font-var-1 { font-variation-settings: 'wght' 200, 'ital' 0; }
    .font-var-2 { font-variation-settings: 'wght' 900, 'ital' 0; }
    .font-var-3 { font-variation-settings: 'wght' 500, 'ital' 1; }
    .font-var-4 { font-variation-settings: 'wght' 100, 'ital' 1; }
    .font-var-5 { font-variation-settings: 'wght' 800, 'ital' 0; }
    html, body { overflow-x: clip; }
    .full-bleed-kino { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }
    .specimen-track { display: flex; gap: 24px; width: max-content; animation: spec-x 65s linear infinite; padding: 8px 0; }
    .specimen-track:hover { animation-play-state: paused; }
    @keyframes spec-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
    .kino-faq summary { list-style: none; cursor: pointer; }
    .kino-faq summary::-webkit-details-marker { display: none; }
    .kino-faq summary .kino-glyph { transition: transform 250ms ease; }
    .kino-faq[open] summary .kino-glyph { transform: rotate(45deg); }
    @media (prefers-reduced-motion: reduce) {
      .specimen-track { animation: none; }
      .kino-faq summary .kino-glyph { transition: none; }
    }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="light antialiased min-h-screen flex flex-col font-body-md text-body-md overflow-x-hidden">
        <nav className="bg-[#F4F3EE] text-black font-['Epilogue'] font-medium tracking-tight uppercase top-0 border-b-2 border-black sticky z-50">
          <div className="flex justify-between items-center w-full px-16 h-20 max-w-[1440px] mx-auto">
            <div className="text-2xl font-black tracking-tighter text-black">KINETICA</div>
            <div className="hidden md:flex space-x-8">
              {navLinks.map((l) => (
                <a key={l} href="#" className="text-black font-mono text-xs hover:bg-[#E63946] hover:text-white transition-colors duration-150 py-2 px-3">
                  {l}
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-black hover:text-[#E63946] transition-colors">
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <section className="min-h-[921px] flex flex-col justify-center px-margin-side max-w-container-max mx-auto border-b-2 border-primary">
            <div className="flex flex-col items-start gap-stack-lg w-full py-stack-xl">
              <div className="w-full">
                <h1 className="font-display-xl text-display-xl tracking-tighter leading-none break-words uppercase flex flex-wrap gap-2">
                  {heroLetters.map((l, i) => (
                    <span key={i} className={`font-var-${l.v}${l.gap ? " ml-4" : ""}`}>{l.ch}</span>
                  ))}
                </h1>
              </div>
              <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-stack-md mt-stack-lg border-t-2 border-primary pt-stack-md">
                <p className="max-w-md font-body-lg text-body-lg">
                  High-performance variable fonts for digital brutalism. Precision engineering meets expressive typographic scale.
                </p>
                <a href="#" className="font-label-mono text-label-mono text-magenta border-2 border-magenta px-6 py-3 uppercase hover:bg-magenta hover:text-white transition-colors">
                  Browse fonts
                </a>
              </div>
            </div>
          </section>

          <section className="w-full border-b-2 border-primary">
            {typefaces.map((t) => (
              <div key={t.name} className={`${t.last ? "" : "border-b-2 border-primary "}group relative overflow-hidden bg-background hover:bg-primary transition-colors duration-300`}>
                <div className="px-margin-side py-stack-lg max-w-container-max mx-auto flex flex-col justify-center min-h-[300px]">
                  <h2 className={`font-headline-lg text-[8vw] leading-none tracking-tighter uppercase group-hover:text-background transition-colors font-var-${t.v}`}>
                    {t.name}
                  </h2>
                  <div className="flex justify-between items-center mt-stack-sm w-full group-hover:text-background transition-colors">
                    <span className="font-label-mono text-label-mono uppercase">{t.meta}</span>
                    <a href="#" className="font-label-mono text-label-mono text-magenta underline uppercase decoration-2 hover:text-white">Try it -&gt;</a>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="max-w-container-max mx-auto border-b-2 border-primary">
            {blocks.map((b) => (
              <div key={b.idx} className={`grid grid-cols-1 md:grid-cols-3${b.last ? "" : " border-b-2 border-primary"}`}>
                <div className="col-span-1 p-margin-side border-b-2 md:border-b-0 md:border-r-2 border-primary flex items-start">
                  <span className="font-label-mono text-label-mono bg-primary text-on-primary px-2 py-1 uppercase">{b.idx}</span>
                </div>
                <div className="col-span-2 p-margin-side">
                  <h3 className={`font-headline-lg text-headline-lg uppercase mb-stack-md font-var-${b.v}`}>{b.title}</h3>
                  <p className="font-body-lg text-body-lg max-w-xl">{b.body}</p>
                </div>
              </div>
            ))}
          </section>
          {/* Specimen marquee */}
          <section className="full-bleed-kino bg-primary text-background border-b-2 border-primary py-20 md:py-28 overflow-hidden relative">
            <div className="max-w-[1440px] mx-auto px-margin-side mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <span className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-magenta block mb-3">04 / SPECIMEN</span>
                <h2 className="font-headline-lg text-[8vw] md:text-[6vw] uppercase leading-none tracking-tighter font-var-2">In the wild.</h2>
              </div>
              <p className="text-tertiary-fixed-dim font-body-md max-w-md md:text-right">Eight specimens shot on press this quarter. Hover to halt the procession; pull a frame off the strip and reset the wheel.</p>
            </div>
            <div className="overflow-hidden relative">
              <div className="specimen-track">
                {[...specimens, ...specimens].map((s, i) => {
                  const dirCls = { t: "bg-gradient-to-t", bl: "bg-gradient-to-bl", tr: "bg-gradient-to-tr", r: "bg-gradient-to-r" }[s.dir];
                  return (
                    <figure key={`sp-${i}`} aria-hidden={i >= specimens.length ? "true" : undefined} className={`shrink-0 ${s.w} h-96 relative ${s.bg} border-2 border-background overflow-hidden`}>
                      <img alt={i < specimens.length ? `Specimen ${s.id}` : ""} className={`absolute inset-0 w-full h-full object-cover grayscale ${s.extraImg}`} src={s.srcOverride || "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop"} />
                      <div className={`absolute inset-0 ${dirCls} ${s.grad}`}></div>
                      <div className="absolute top-3 left-3 right-3 flex justify-between font-label-mono text-[10px] uppercase tracking-widest">
                        <span className={`${s.tagCls} px-2 py-0.5`}>{s.id}</span>
                        <span className={`${s.chip1Cls} px-2 py-0.5`}>{s.chip1}</span>
                      </div>
                      <figcaption className={`absolute bottom-5 left-5 right-5 ${s.textColor}`}>
                        <span className={`font-headline-md text-3xl uppercase tracking-tighter font-var-${s.v} block${s.italic ? " italic" : ""}`}>{s.title}</span>
                        <span className="font-label-mono text-[10px] tracking-widest text-tertiary-fixed-dim block mt-2">{s.meta}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </section>

          {/* In Use rows */}
          <section className="max-w-container-max mx-auto border-b-2 border-primary">
            <div className="px-margin-side py-stack-xl">
              <div className="flex justify-between items-end mb-12 border-b-2 border-primary pb-stack-md">
                <div>
                  <span className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-magenta block mb-2">05 / IN USE</span>
                  <h2 className="font-headline-lg text-[6vw] uppercase tracking-tighter font-var-2">Set on the page.</h2>
                </div>
                <span className="font-label-mono text-label-mono uppercase hidden md:block">3 STUDIES · LICENSED · MMXXIV</span>
              </div>
              <div className="flex flex-col gap-stack-xl">
                {inUseRows.map((r, i) => {
                  const dirCls = { t: "bg-gradient-to-t", bl: "bg-gradient-to-bl", r: "bg-gradient-to-r" }[r.dir];
                  const figure = (
                    <figure className={`md:col-span-7 relative${r.side === "right" ? " md:order-2 order-1" : ""}`}>
                      <div className={`absolute -top-2 ${r.side === "right" ? "-right-2" : "-left-2"} w-8 h-8 bg-magenta -z-10`}></div>
                      <div className={`absolute -bottom-2 ${r.side === "right" ? "-left-2" : "-right-2"} w-8 h-8 border-2 border-primary -z-10`}></div>
                      <div className="relative aspect-[16/10] overflow-hidden border-2 border-primary">
                        <img alt={r.alt || `In Use 0${i + 1}`} className="absolute inset-0 w-full h-full object-cover grayscale" src={r.img} />
                        <div className={`absolute inset-0 ${dirCls} ${r.grad}`}></div>
                        <span className={`absolute top-5 ${r.side === "right" ? "right-5" : "left-5"} bg-background text-primary font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border-2 border-primary`}>{r.chip}</span>
                        <span className={`absolute bottom-5 ${r.side === "right" ? "left-5 bg-primary" : "right-5 bg-magenta"} text-background font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5`}>{r.pill}</span>
                      </div>
                    </figure>
                  );
                  const content = (
                    <div className={`md:col-span-5${r.side === "right" ? " md:order-1 order-2" : ""}`}>
                      <span className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-magenta block mb-3">{r.num}</span>
                      <h3 className={`font-headline-md text-headline-md uppercase mb-stack-sm font-var-${r.titleV}${r.italic ? " italic" : ""}`}>{r.title}</h3>
                      <p className="font-body-md text-body-md mb-stack-md">{r.body}</p>
                      {r.stats && (
                        <dl className="grid grid-cols-3 gap-3 border-t-2 border-primary pt-stack-sm">
                          {r.stats.map((s) => (
                            <div key={s.l}>
                              <dt className="font-label-mono text-[10px] uppercase tracking-widest text-on-tertiary-container">{s.l}</dt>
                              <dd className={`font-display-xl text-3xl ${s.l === "Issues/yr" ? "text-magenta" : "text-primary"} mt-1 font-var-2`}>{s.v}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {r.bullets && (
                        <ul className="space-y-2 border-l-2 border-magenta pl-4">
                          {r.bullets.map((b) => <li key={b} className="font-label-mono text-label-mono uppercase">{b}</li>)}
                        </ul>
                      )}
                      {r.caseLink && (
                        <a className="font-label-mono text-label-mono text-magenta border-b-2 border-magenta uppercase pb-1 hover:text-primary hover:border-primary transition-colors" href="#">{r.caseLink}</a>
                      )}
                    </div>
                  );
                  return (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-stack-md md:gap-stack-lg items-center">
                      {r.side === "right" ? <>{content}{figure}</> : <>{figure}{content}</>}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Manifesto tenets */}
          <section className="full-bleed-kino bg-primary text-background py-stack-xl border-b-2 border-primary">
            <div className="max-w-[1440px] mx-auto px-margin-side grid grid-cols-1 lg:grid-cols-12 gap-stack-lg lg:gap-stack-xl">
              <aside className="lg:col-span-4">
                <span className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-magenta block mb-4">06 / DOCTRINE</span>
                <h2 className="font-headline-lg text-[5vw] uppercase tracking-tighter leading-[0.95] font-var-2">Five rules<br />the foundry runs on.</h2>
                <p className="text-tertiary-fixed-dim mt-stack-md max-w-md">Etched on the studio door in 2014. Bent twice. Broken thrice. Re-stencilled every ten years.</p>
                <a className="mt-stack-md inline-flex items-center gap-2 font-label-mono text-label-mono uppercase border-2 border-background px-5 py-3 hover:bg-magenta hover:border-magenta transition-colors" href="#">Read the manual →</a>
              </aside>
              <ol className="lg:col-span-8 border-t-2 border-background">
                {tenets.map((t, i) => (
                  <li key={t.tag} className={`grid grid-cols-12 gap-4 py-stack-md ${i < tenets.length - 1 ? "border-b-2 border-background " : ""}hover:bg-background/[0.05] transition-colors`}>
                    <span className={`col-span-2 lg:col-span-1 font-display-xl text-5xl ${t.color} tabular-nums leading-none font-var-2`}>{t.i}</span>
                    <div className="col-span-10 lg:col-span-9">
                      <h3 className="font-headline-md text-2xl uppercase mb-2 font-var-5">{t.title}</h3>
                      <p className="text-tertiary-fixed-dim text-sm">{t.body}</p>
                    </div>
                    <span className="col-span-12 lg:col-span-2 font-label-mono text-[10px] uppercase tracking-widest text-tertiary-fixed-dim self-center lg:text-right">[ {t.tag} ]</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Foundry Partners — paired tools that ship with Kinetica licences. simpleicons. */}
          <section className="max-w-container-max mx-auto border-b-2 border-primary px-margin-side py-stack-lg">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md mb-stack-md pb-stack-sm border-b-2 border-primary">
              <div>
                <span className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-magenta block mb-2">07A / FOUNDRY · PARTNERS</span>
                <h2 className="font-headline-md text-headline-md uppercase tracking-tighter font-var-2">Lives in these tools.</h2>
              </div>
              <p className="font-label-mono text-label-mono uppercase max-w-md md:text-right">The variable file ships native to design and publishing tools. No fallback, no foundry-server pings.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6 md:justify-between">
              {FOUNDRY_PARTNERS.map((p) => (
                <span key={p.slug} className="group inline-flex items-center gap-3 text-primary hover:text-magenta transition-colors">
                  <img src={`https://cdn.simpleicons.org/${p.slug}/000000`} alt={`${p.name} logo`} width="22" height="22" loading="lazy" decoding="async" className="w-6 h-6 md:w-7 md:h-7 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-display-xl text-xl md:text-2xl uppercase tracking-tighter font-var-2">{p.name}</span>
                </span>
              ))}
            </div>
          </section>

          {/* Foundry Compact — 4 premium cards explaining what every Kinetica licence ships with. */}
          <section className="full-bleed-kino bg-magenta text-background border-b-2 border-primary py-stack-xl">
            <div className="max-w-[1440px] mx-auto px-margin-side">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md mb-stack-lg pb-stack-md border-b-2 border-background">
                <div className="max-w-xl">
                  <span className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-background/80 block mb-2">07B / COMPACT</span>
                  <h2 className="font-headline-lg text-[5vw] uppercase leading-[0.95] tracking-tighter font-var-2">Four standing terms.</h2>
                </div>
                <p className="font-body-md text-body-md text-background/80 max-w-md">Every Kinetica licence is signed against these. Etched on the engagement panel. Re-stencilled every cohort.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-background">
                {FOUNDRY_COMPACT.map((c) => (
                  <article key={c.roman} className="bg-magenta p-stack-md md:p-stack-lg flex flex-col gap-stack-sm hover:bg-primary transition-colors min-h-[280px]">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 border-2 border-background flex items-center justify-center text-background">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{c.icon}</svg>
                      </span>
                      <span className="font-display-xl text-5xl text-background tabular-nums leading-none font-var-2">{c.roman}</span>
                    </div>
                    <span className="font-label-mono text-label-mono text-background/70 uppercase tracking-widest">{c.tag}</span>
                    <h3 className="font-headline-md text-2xl text-background uppercase tracking-tighter font-var-5">{c.title}</h3>
                    <p className="font-body-md text-body-md text-background/85 leading-relaxed">{c.body}</p>
                    <div className="mt-auto pt-stack-sm border-t-2 border-background/30 flex items-center justify-between">
                      <span className="font-label-mono text-label-mono text-background uppercase tracking-widest tabular-nums">{c.foot}</span>
                      <span className="font-label-mono text-[10px] uppercase tracking-widest text-background/60">[ ARMED ]</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-container-max mx-auto border-b-2 border-primary px-margin-side py-stack-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
              <aside className="lg:col-span-4">
                <span className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-magenta block mb-3">07 / SUPPORT</span>
                <h2 className="font-headline-lg text-[5vw] uppercase tracking-tighter leading-[0.95] font-var-2">Pre-licence questions.</h2>
                <p className="font-body-md text-body-md mt-stack-md">Asked by sixty-three studios this quarter. Answered by the foundry, in five lines or fewer.</p>
              </aside>
              <div className="lg:col-span-8 divide-y-2 divide-primary border-y-2 border-primary">
                {kinoFaq.map((f) => (
                  <details key={f.i} className="kino-faq group p-6" open={f.open}>
                    <summary className="flex items-center gap-6 list-none">
                      <span className={`font-display-xl text-3xl ${f.color} tabular-nums shrink-0 w-12 leading-none font-var-2`}>{f.i}</span>
                      <h3 className="font-headline-md text-xl uppercase flex-1 font-var-5">{f.q}</h3>
                      <span className="kino-glyph text-magenta text-3xl shrink-0 leading-none font-thin">+</span>
                    </summary>
                    <p className="pl-16 mt-stack-sm font-body-md">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#F4F3EE] text-black font-mono text-xs tracking-widest uppercase border-t-2 border-black">
          <div className="flex flex-col w-full px-16 py-24 max-w-[1440px] mx-auto">
            <span className="text-[12vw] font-black leading-none tracking-tighter text-black block mb-12">KINETICA</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg border-t-2 border-primary pt-stack-md">
              <div><p>© 2024 KINETICA TYPE FOUNDRY. ALL RIGHTS RESERVED.</p></div>
              <div className="flex flex-col md:flex-row md:justify-end gap-stack-md md:gap-8">
                {footerLinks.map((l) => (
                  <a key={l} href="#" className="text-black opacity-80 hover:text-[#E63946] underline decoration-2 transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
