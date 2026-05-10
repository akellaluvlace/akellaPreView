export default function T104HalftonePopArt() {
  const navLinks = [
    { label: "The Mechanism" },
    { label: "The Log" },
    { label: "The Gallery" },
    { label: "Transmute", active: true },
  ];
  const knobs = [
    { code: "KNOB_01: CREATIVITY", rotate: "hover:rotate-45" },
    { code: "KNOB_02: LOGIC", rotate: "hover:-rotate-12" },
    { code: "KNOB_03: SPIRIT", rotate: "hover:rotate-90" },
  ];
  const terminalLines = [
    { text: "> CALIBRATING AESTHETIC ENGINES..." },
    { text: "> LOADING HISTORICAL ARTIFACTS... [OK]" },
    { text: "> INJECTING POP-ART CHAOS... [OK]" },
    { text: "> TRANSMUTING PIXELS..." },
    { text: "> ALCHEMY COMPLETE_", pulse: true },
  ];
  const galleryCards = [
    {
      fig: "FIG. 1 // FLUIDITY",
      icon: "gesture",
      alt: "Abstract fluid organic blob shape with bright colors on a minimal background",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHANwRnMsOhYyGLCSLOqsaIQiKOl6cKdUHgntMIBpkPe9ChgmY7TrxH1zeP7PbF53nkF6t_fokJrqPIMn8q_tcg-DKFdPQxQN9SLRyBp6JmSCYhw_XGbOJfl4vAqB12TQbSq0LKIcXyQh9Qqk2uNuwcy7xymYTCAFNSPOwxD6O0OXxz_Rsg0MbJ7RlBfVGl7lz-4toKUBh0HIShX7bgqVWzXQXaCsvokd4O3EO6Ew4BMgAsZz6WduraLx_VXTeCPwjVnMr9HM5NZ64",
      tapeClass: "left-1/2 -translate-x-1/2 -rotate-2",
      offsetClass: "",
      overlay: "bg-gradient-to-tr from-tertiary-fixed to-transparent",
      grayscale: false,
    },
    {
      fig: "FIG. 2 // TENSION",
      icon: "polyline",
      alt: "Abstract chaotic paint splatters and geometric shapes layered together",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-8S4E_R1OZDKl1TnyEmgtEQNHXYxeNGtUUOmJk-iS4r_v6-Q1xJe-rt76j2lVjK46Q7PSiUGUFWlxEFjhDmuqy8zCCbCG-7bLEOPI6mLv9lPOSMz53WoucCKByDSk3qW_5CkQXGP3-qbMFlPeKwHqVrc9aCVTFNDyjJi9x42vmU64kR-I0JvKy4iSRVnX8y88sjKxq2wMKTPW_p-KcWw5sbsgOCOd0mxZj_1I1keYdJoyS5lhivcRt5fN5-X_HzfofcuzPNbW2TUA",
      tapeClass: "right-8 rotate-3",
      offsetClass: "transform translate-y-8",
      overlay: "bg-gradient-to-bl from-error-container to-transparent",
      grayscale: true,
    },
  ];
  const footerLinks = ["Terms of Flux", "Lab Safety", "Archive"];

  const specimens = [
    { id: "001", tag: "Server Stack 04", meta: "RACK · LAB-B · 14:22", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", w: "w-72", bg: "bg-surface-bright", rot: "stamp-rotate-1", figBg: "bg-on-surface", figText: "text-surface-bright", border: "border-error", tagBg: "bg-error", tagText: "text-surface-bright", chipBg: "bg-on-surface", chipText: "text-surface-bright", topRight: "LIVE", topRightBg: "bg-error", topRightText: "text-surface-bright", grad: "bg-gradient-to-t from-error/40 via-transparent to-transparent", extraImg: "grayscale contrast-125" },
    { id: "002", tag: "Trace · Δ-22", meta: "CIRCUIT · 41 NODES", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", w: "w-80", bg: "bg-error", rot: "stamp-rotate-2", figBg: "bg-surface-bright", figText: "text-on-surface", border: "border-on-surface", tagBg: "bg-surface-bright", tagText: "text-on-surface", chipBg: "bg-on-surface", chipText: "text-tertiary-fixed-dim", topRight: "PINNED", topRightBg: "bg-on-surface", topRightText: "text-tertiary-fixed-dim", grad: "", extraImg: "grayscale contrast-150 mix-blend-multiply opacity-90", metaColor: "text-error" },
    { id: "003", tag: "Apothecary 07", meta: "BRASS · DUSTED", src: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=900&q=85&auto=format&fit=crop", w: "w-72", bg: "bg-tertiary-container", rot: "stamp-rotate-1", figBg: "bg-tertiary", figText: "text-surface-bright", border: "border-on-surface", tagBg: "bg-on-surface", tagText: "text-tertiary-fixed-dim", chipBg: "bg-tertiary", chipText: "text-surface-bright", topRight: "GOLD", topRightBg: "bg-tertiary", topRightText: "text-surface-bright", grad: "bg-gradient-to-tr from-tertiary-fixed/60 via-transparent to-transparent", extraImg: "" },
    { id: "004", tag: "Heavy Press 11", meta: "FOUNDRY · 9.2 TONNE", src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1100&q=85&auto=format&fit=crop", w: "w-96", bg: "bg-on-surface", rot: "stamp-rotate-2", figBg: "bg-error", figText: "text-surface-bright", border: "border-tertiary-fixed-dim", tagBg: "bg-error", tagText: "text-surface-bright", chipBg: "bg-tertiary-fixed-dim", chipText: "text-on-surface", topRight: "FEATURED", topRightBg: "bg-tertiary-fixed-dim", topRightText: "text-on-surface", grad: "bg-gradient-to-b from-transparent via-error/20 to-on-surface/80", extraImg: "grayscale contrast-110 opacity-80", featured: true },
    { id: "005", tag: "Pillar Run B", meta: "BRUTALIST · WEST WING", src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=900&q=85&auto=format&fit=crop", w: "w-72", bg: "bg-surface-bright", rot: "stamp-rotate-1", figBg: "bg-on-surface", figText: "text-surface-bright", border: "border-error", tagBg: "bg-on-surface", tagText: "text-surface-bright", chipBg: "bg-on-surface", chipText: "text-surface-bright", topRight: "FACADE", topRightBg: "bg-error", topRightText: "text-surface-bright", grad: "bg-gradient-to-t from-tertiary/40 via-transparent to-error/15", extraImg: "grayscale contrast-125", metaColor: "text-tertiary-fixed-dim" },
    { id: "006", tag: "Heritage 33", meta: "DETAIL · GILT", src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop", w: "w-80", bg: "bg-tertiary-fixed", rot: "stamp-rotate-2", figBg: "bg-tertiary-container", figText: "text-on-surface", border: "border-on-surface", tagBg: "bg-on-surface", tagText: "text-surface-bright", chipBg: "bg-tertiary-container", chipText: "text-on-surface", topRight: "CORNICE", topRightBg: "bg-tertiary", topRightText: "text-surface-bright", grad: "bg-gradient-to-bl from-tertiary-fixed-dim/40 via-transparent to-error/20", extraImg: "", metaColor: "text-tertiary" },
    { id: "007", tag: "Atelier Light", meta: "PLATE · IX", src: "https://images.unsplash.com/photo-1638294621924-be97f5f92413?w=900&q=85&auto=format&fit=crop", w: "w-72", bg: "bg-error", rot: "stamp-rotate-1", figBg: "bg-surface-bright", figText: "text-on-surface", border: "border-on-surface", tagBg: "bg-surface-bright", tagText: "text-on-surface", chipBg: "bg-on-surface", chipText: "text-tertiary-fixed-dim", topRight: "DRAFT", topRightBg: "bg-on-surface", topRightText: "text-tertiary-fixed-dim", grad: "", extraImg: "grayscale contrast-150 mix-blend-multiply opacity-90", metaColor: "text-error" },
    { id: "008", tag: "Marble Run 02", meta: "VESTIBULE · 9 STEPS", src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop", w: "w-80", bg: "bg-on-surface", rot: "stamp-rotate-2", figBg: "bg-error", figText: "text-surface-bright", border: "border-tertiary-fixed-dim", tagBg: "bg-tertiary-fixed-dim", tagText: "text-on-surface", chipBg: "bg-error", chipText: "text-surface-bright", topRight: "VAULT", topRightBg: "bg-error", topRightText: "text-surface-bright", grad: "bg-gradient-to-t from-on-surface via-error/25 to-transparent", extraImg: "grayscale contrast-125 opacity-85" },
  ];

  const lawList = [
    { i: "I", color: "text-error", title: "Begin where the dust collects.", body: "A spotless bench yields nothing. Find the corner the apprentice forgot to sweep. That is the substrate.", tag: "LEX_01" },
    { i: "II", color: "text-tertiary-fixed-dim", title: "Halftone is honesty.", body: "The pixel hides nothing. The dot lies less. When in doubt, scale up the screen and let the audience read the texture.", tag: "LEX_02" },
    { i: "III", color: "text-error", title: "A red shadow is a promise.", body: "Drop the eight-pixel offset and the page reads as flat. Keep it; the page reads as sworn. Pop is a covenant.", tag: "LEX_03" },
    { i: "IV", color: "text-tertiary-fixed-dim", title: "The knob remembers.", body: "Whatever you set yesterday is still set today. Re-zero before you crank. The bench rewards memory and punishes the optimistic.", tag: "LEX_04" },
    { i: "V", color: "text-error", title: "Stamp the work, leave the room.", body: "Every folio gets one stamp and one signature. Don't return to retouch. The page closes when the press closes.", tag: "LEX_05" },
  ];

  const popFaq = [
    { i: "01", color: "text-error", q: "Does the matrix actually transmute, or is it just a printer?", a: "It transmutes. The print head is decorative. Every fragment in returns at 0.41 oz of usable yield, plus or minus what you forget to clean off the rollers.", open: true, plain: true },
    { i: "02", color: "text-tertiary", q: "Can I run two fragments in parallel?", a: "Yes, if your bench is grade-B or higher. The kettle holds three; the calibration wheel holds two. The third one waits in the rack and gets a halftone tan.", plain: true },
    { i: "03", color: "text-error", q: "What if my fragment is corrupted?", a: null, plain: false },
    { i: "04", color: "text-tertiary", q: "Why are there four screws on every panel?", a: "Three would suggest hesitation. Five would suggest neurosis. Four screws says: this panel was meant to be opened, but rarely.", plain: true },
    { i: "05", color: "text-error", q: "Is the warning at the bottom serious?", a: null, plain: false },
  ];

  const processSteps = [
    { n: "01", color: "text-error", title: "Charge the matrix.", second: null, body: "Drop a raw fragment — a half-formed feed, a typo'd headline, a forgotten draft. The matrix grips it, drops a 41-track halftone, and runs it through the calibration wheel.", phase: "PHASE · I", clock: "11:42:00", img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1400&q=85&auto=format&fit=crop", side: "left", tilt: "-rotate-1", figBg: "bg-tertiary-fixed", grad: "bg-gradient-to-tr from-error/35 via-transparent to-tertiary-fixed/30", phaseChip: "bg-on-surface text-surface-bright", clockChip: "bg-error text-surface-bright border-on-surface", arrow: { side: "-left-16", color: "text-error", rot: "rotate-180" }, list: ["// VOLTAGE LOCK · ARMED", "// HALFTONE GRADE · MEDIUM", "// FRAGMENT INTEGRITY · 87%"] },
    { n: "02", color: "text-tertiary", title: "Crank the", italic: "knobs", second: "", body: "Twist Creativity past 8. Logic to 4. Spirit somewhere between mischief and belief. The console screams; the operator sips coffee. The dials lock when you're warm.", phase: "PHASE · II", clock: "14:08:00", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=85&auto=format&fit=crop", side: "right", tilt: "rotate-1", figBg: "bg-error", grad: "bg-gradient-to-bl from-tertiary/40 via-transparent to-error/40", phaseChip: "bg-surface-bright text-on-surface", clockChip: "bg-on-surface text-tertiary-fixed-dim border-tertiary-fixed-dim", arrow: { side: "-right-16", color: "text-tertiary", rot: "rotate-12" }, dials: [{ v: "8.4", l: "Creativity", c: "text-error", b: "bg-surface-bright" }, { v: "4.0", l: "Logic", c: "text-tertiary", b: "bg-surface-bright" }, { v: "7.7", l: "Spirit", c: "text-on-surface", b: "bg-tertiary-fixed" }], extraImg: "grayscale contrast-125 mix-blend-multiply opacity-90" },
    { n: "03", color: "text-error", title: "Pour the", italic: "gold", italicColor: "text-tertiary", body: 'When the bench hums B-flat the bath is ready. Tip the matrix. Let the warm metal find its mould. Stamp it: <span class="bg-on-surface text-surface-bright px-2 font-metadata-mono">FOLIO · OK</span>. Close the lab.', phase: "PHASE · III", clock: "21:00:00", img: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=1400&q=85&auto=format&fit=crop", side: "left", tilt: "-rotate-1", figBg: "bg-on-surface", grad: "bg-gradient-to-t from-on-surface/70 via-transparent to-tertiary-fixed/25", phaseChip: "bg-tertiary text-surface-bright", clockChip: "bg-tertiary-fixed-dim text-on-surface border-on-surface", livePill: true, footer: { caption: "Yield · 0.41 oz / fragment", linkText: "Read the log →" } },
  ];
  const customCss = `
    .halftone-bg {
      background-image: radial-gradient(circle, #c9c6bd 1px, transparent 1px);
      background-size: 16px 16px;
    }
    .paper-texture { position: relative; }
    .crt-overlay {
      background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px);
      position: relative;
    }
    .crt-overlay::after {
      content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
      background: rgba(18, 16, 16, 0.1); opacity: 0; z-index: 2; pointer-events: none;
    }
    .btn-skeuo { border-bottom: 4px solid #1c1b1b; transition: all 0.1s ease; }
    .btn-skeuo:active { transform: translateY(2px); border-bottom-width: 2px; margin-bottom: 2px; }
    .pop-art-shadow { box-shadow: 8px 8px 0px 0px #ba1a1a; }
    .scribble-underline { position: relative; }
    .scribble-underline::after {
      content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 3px;
      background: #ba1a1a; border-radius: 50% / 10px; transform: rotate(-1deg);
    }
    html, body { overflow-x: clip; }
    .full-bleed { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }
    .specimen-track { display: flex; gap: 28px; width: max-content; animation: specimen-scroll 60s linear infinite; }
    .specimen-track:hover { animation-play-state: paused; }
    @keyframes specimen-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 14px)); }
    }
    .halftone-overlay {
      background-image: radial-gradient(rgba(28,27,27,0.55) 1.5px, transparent 1.7px);
      background-size: 7px 7px;
      mix-blend-mode: multiply;
    }
    .speech-bubble {
      position: relative;
      background: #fdf8f7;
      border: 4px solid #1c1b1b;
    }
    .speech-bubble::after {
      content: ''; position: absolute; left: 56px; bottom: -22px;
      width: 0; height: 0;
      border-left: 18px solid transparent; border-right: 6px solid transparent;
      border-top: 22px solid #1c1b1b;
    }
    .speech-bubble::before {
      content: ''; position: absolute; left: 60px; bottom: -14px;
      width: 0; height: 0;
      border-left: 12px solid transparent; border-right: 4px solid transparent;
      border-top: 14px solid #fdf8f7;
      z-index: 1;
    }
    .pop-faq summary { list-style: none; cursor: pointer; }
    .pop-faq summary::-webkit-details-marker { display: none; }
    .pop-faq summary .pop-plus { transition: transform 250ms ease; }
    .pop-faq[open] summary .pop-plus { transform: rotate(45deg); }
    .pop-faq[open] summary .pop-headline { color: #ba1a1a; }
    .stamp-rotate-1 { transform: rotate(-3deg); }
    .stamp-rotate-2 { transform: rotate(2deg); }
    /* Terminal palette — high-contrast classic green-on-black for the log; pure black bg replaces the muddier grey so the output reads sharply. */
    .term-screen { background: #050505; }
    .term-text { color: #6CFF7E; }
    .term-text-dim { color: #3FA84D; }
    .term-text-error { color: #FF4136; }
    .term-text-amber { color: #FFB020; }
    /* Left pane lines — bottom-up stagger reveal. */
    .term-line { opacity: 0; transform: translateY(4px); animation: term-reveal 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: var(--d, 0s); }
    @keyframes term-reveal { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    /* Right pane lines — top-down stagger reveal so it reads as a feed dropping in from above. */
    .feed-line { opacity: 0; transform: translateY(-6px); animation: feed-reveal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: var(--d, 0s); }
    @keyframes feed-reveal { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    .term-caret { display: inline-block; width: 8px; height: 1em; vertical-align: -2px; background: currentColor; margin-left: 2px; animation: term-blink 1.05s steps(2) infinite; }
    @keyframes term-blink { 50% { opacity: 0; } }
    .term-glow { text-shadow: 0 0 6px rgba(108, 255, 126, 0.45), 0 0 14px rgba(108, 255, 126, 0.25); }
    .term-prompt-bar { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: #0a0a0a; border-bottom: 2px solid #1c1b1b; }
    .term-dot { width: 10px; height: 10px; border-radius: 50%; }
    /* Pulse dot for live feed status. */
    .feed-pulse { box-shadow: 0 0 0 0 rgba(108, 255, 126, 0.6); animation: feed-pulse-ring 1.6s ease-out infinite; }
    @keyframes feed-pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(108, 255, 126, 0.55); }
      70% { box-shadow: 0 0 0 8px rgba(108, 255, 126, 0); }
      100% { box-shadow: 0 0 0 0 rgba(108, 255, 126, 0); }
    }
    /* Recipe section — pages-style entry on the side panes within each recipe row. */
    .recipe-pane-l, .recipe-pane-r { opacity: 0; transform-origin: center center; animation-fill-mode: forwards; animation-duration: 0.95s; animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1); animation-delay: var(--d, 0s); }
    .recipe-pane-l { animation-name: page-flip-l; transform-origin: right center; }
    .recipe-pane-r { animation-name: page-flip-r; transform-origin: left center; }
    @keyframes page-flip-l { from { opacity: 0; transform: perspective(1200px) rotateY(18deg) translateX(-30px); } to { opacity: 1; transform: perspective(1200px) rotateY(0) translateX(0); } }
    @keyframes page-flip-r { from { opacity: 0; transform: perspective(1200px) rotateY(-18deg) translateX(30px); } to { opacity: 1; transform: perspective(1200px) rotateY(0) translateX(0); } }
    @media (prefers-reduced-motion: reduce) {
      .specimen-track { animation: none; }
      .pop-faq summary .pop-plus { transition: none; }
      .term-line, .feed-line, .term-caret, .feed-pulse, .recipe-pane-l, .recipe-pane-r { animation: none; opacity: 1; transform: none; }
    }
  `;
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;900&family=Newsreader:ital,wght@0,400;0,600;0,700;1,400&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#5f5f58", "on-primary": "#ffffff", "primary-fixed": "#e5e2da",
                "primary-container": "#f5f2e9",
                "secondary": "#5f5e5f",
                "tertiary": "#7c5800", "on-tertiary": "#ffffff",
                "tertiary-fixed": "#ffdea8", "tertiary-fixed-dim": "#ffba20", "tertiary-container": "#fff0dc",
                "surface": "#fdf8f7", "surface-bright": "#fdf8f7",
                "surface-container": "#f1edeb", "surface-container-low": "#f7f3f1",
                "surface-container-high": "#ebe7e6", "surface-container-highest": "#e5e2e0",
                "on-surface": "#1c1b1b", "on-surface-variant": "#474740",
                "outline": "#78776f", "outline-variant": "#c9c6bd",
                "inverse-surface": "#31302f", "inverse-on-surface": "#f4f0ee",
                "surface-tint": "#5f5f58",
                "background": "#fdf8f7", "on-background": "#1c1b1b",
                "error": "#ba1a1a", "error-container": "#ffdad6"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "unit": "4px", "gutter": "24px", "margin-edge": "48px", "panel-gap": "32px" },
              fontFamily: {
                "cta-bold": ["Epilogue"], "headline-lg": ["Newsreader"], "headline-display": ["Newsreader"],
                "metadata-mono": ["Space Grotesk"], "body-md": ["Epilogue"]
              },
              fontSize: {
                "cta-bold": ["24px", { lineHeight: "1", fontWeight: "900" }],
                "headline-lg": ["40px", { lineHeight: "1.2", fontWeight: "600" }],
                "headline-display": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
                "metadata-mono": ["12px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="light bg-background text-on-background paper-texture min-h-screen flex flex-col">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')" }} />
        <header className="bg-[#F5F2E9] dark:bg-stone-900 text-stone-900 dark:text-[#F5F2E9] border-b-4 border-stone-950 dark:border-stone-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-0 w-full z-50">
          <div className="flex justify-between items-center w-full px-12 py-6 max-w-[1440px] mx-auto">
            <div className="font-['Newsreader'] font-black text-3xl uppercase tracking-tighter text-stone-950 dark:text-white">
              The Alchemist's Folio
            </div>
            <nav className="hidden md:flex gap-8">
              {navLinks.map((l) => (
                <a key={l.label} href="#" className={l.active
                  ? "font-['Newsreader'] italic text-2xl tracking-tight text-orange-600 dark:text-orange-400 underline decoration-2 underline-offset-4 hover:skew-x-2 transition-transform hover:text-orange-600 translate-y-1 transition-all"
                  : "font-['Newsreader'] italic text-2xl tracking-tight text-stone-700 dark:text-stone-300 hover:skew-x-2 transition-transform hover:text-orange-600"
                }>{l.label}</a>
              ))}
            </nav>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-stone-700 dark:text-stone-300 hover:skew-x-2 transition-transform hover:text-orange-600 cursor-pointer">settings_input_component</span>
              <span className="material-symbols-outlined text-stone-700 dark:text-stone-300 hover:skew-x-2 transition-transform hover:text-orange-600 cursor-pointer">terminal</span>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {/* Hero — full-bleed so the halftone-bg dot pattern spans the entire viewport edge-to-edge; inner div re-applies the 1440 max-width for the content. */}
          <section className="full-bleed py-24 min-h-[819px] flex items-center justify-center relative overflow-hidden halftone-bg">
            <div className="absolute inset-0 pointer-events-none">
              <svg className="absolute top-10 right-[6%] w-24 h-24 text-outline opacity-50" fill="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeDasharray="4 4" strokeWidth="2" />
                <path d="M50 10 L 50 90 M 10 50 L 90 50" stroke="currentColor" strokeWidth="2" />
              </svg>
              <svg className="absolute bottom-12 left-[5%] w-32 h-32 text-error opacity-20 -rotate-12" fill="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeDasharray="3 6" strokeWidth="2" />
              </svg>
            </div>
            <div className="relative z-10 max-w-4xl w-full px-margin-edge mx-auto">
              <div className="bg-tertiary-fixed border-4 border-on-surface p-12 -rotate-2 pop-art-shadow transform hover:-rotate-1 transition-transform duration-300">
                <h1 className="font-headline-display text-headline-display text-on-surface uppercase mb-8">
                  TRANSFORM DATA INTO <span className="text-tertiary">DIVINE GOLD</span>
                </h1>
                <div className="flex items-center gap-6 mt-12 relative">
                  <button className="bg-surface-bright border-4 border-on-surface px-8 py-4 flex items-center gap-3 btn-skeuo hover:bg-surface-container group">
                    <span className="material-symbols-outlined text-[32px] group-hover:text-error transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    <span className="font-cta-bold text-cta-bold uppercase tracking-widest">Ignite Process</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section id="the-mechanism" className="py-24 bg-inverse-surface text-inverse-on-surface border-y-8 border-double border-on-surface">
            <div className="max-w-[1440px] mx-auto px-margin-edge">
              <div className="flex justify-between items-end mb-12 border-b-2 border-outline pb-4">
                <h2 className="font-headline-lg text-headline-lg">THE MECHANISM</h2>
                <span className="font-metadata-mono text-metadata-mono text-outline">SYS.CTRL.V.01</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-panel-gap">
                {knobs.map((k) => (
                  <div key={k.code} className="bg-surface-tint border-4 border-on-surface p-8 relative shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-on-surface bg-outline" />
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-on-surface bg-outline" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full border-2 border-on-surface bg-outline" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-on-surface bg-outline" />
                    <div className="text-center">
                      <span className="font-metadata-mono text-metadata-mono block mb-8 text-primary-fixed">{k.code}</span>
                      <div className={`w-32 h-32 mx-auto rounded-full bg-surface-container border-8 border-on-surface shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative cursor-pointer transform ${k.rotate} transition-transform duration-500`}>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-6 bg-error rounded-full" />
                        <div className="absolute inset-2 rounded-full border-2 border-outline opacity-30" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* OUTPUT LOG // TERMINAL — split-pane CRT scope. Left: STDOUT (bottom-up stagger reveal in green-on-black). Right: PIPELINE FEED (top-down stagger reveal). Colors swapped from gold-on-grey (low contrast) to phosphor-green-on-black for max readability. */}
          <section id="the-log" className="py-24 px-margin-edge max-w-[1440px] mx-auto">
            <div className="border-4 border-on-surface p-4 bg-surface-container-highest shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
              <div className="absolute -inset-1 border-2 border-on-surface transform rotate-1 opacity-20 pointer-events-none" />
              <div className="absolute -inset-2 border border-on-surface transform -rotate-1 opacity-10 pointer-events-none" />
              <div className="flex items-center justify-between mb-2 pl-2">
                <h3 className="font-metadata-mono text-metadata-mono text-on-surface">OUTPUT LOG // TERMINAL</h3>
                <span className="font-metadata-mono text-[10px] uppercase tracking-[0.4em] text-on-surface-variant">SESSION · 04 · STREAMING</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-on-surface border-4 border-on-surface rounded-lg overflow-hidden">
                {/* LEFT pane — STDOUT log */}
                <div className="term-screen crt-overlay relative shadow-[inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden">
                  <div className="term-prompt-bar">
                    <span className="term-dot bg-error border border-on-surface" aria-hidden="true"></span>
                    <span className="term-dot bg-tertiary-fixed-dim border border-on-surface" aria-hidden="true"></span>
                    <span className="term-dot" style={{ background: "#6CFF7E", border: "1px solid #1c1b1b" }} aria-hidden="true"></span>
                    <span className="ml-3 font-metadata-mono text-[10px] uppercase tracking-widest term-text">/folio · transmute --watch</span>
                    <span className="ml-auto font-metadata-mono text-[10px] uppercase tracking-widest term-text-dim">stdout</span>
                  </div>
                  <div className="p-6 md:p-8 h-72 overflow-hidden relative">
                    <div className="font-metadata-mono text-metadata-mono space-y-2.5 leading-relaxed">
                      {terminalLines.map((line, i) => {
                        const isLast = i === terminalLines.length - 1;
                        return (
                          <p key={line.text} className={`term-line ${isLast ? "term-glow term-text font-bold" : "term-text-dim"}`} style={{ "--d": `${0.25 + i * 0.6}s` }}>
                            {line.text}
                            {isLast && <span className="term-caret term-text" aria-hidden="true"></span>}
                          </p>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-3 right-4 flex items-center gap-3 font-metadata-mono text-[10px] uppercase tracking-[0.3em]">
                      <span className="inline-flex items-center gap-1.5 term-text">
                        <span className="w-1.5 h-1.5 rounded-full feed-pulse" style={{ background: "#6CFF7E" }}></span>
                        LIVE
                      </span>
                      <span className="term-text-dim">· YIELD 0.41 oz</span>
                    </div>
                  </div>
                </div>
                {/* RIGHT pane — PIPELINE FEED, top-down stagger */}
                <div className="term-screen crt-overlay relative shadow-[inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden border-l-2 border-on-surface">
                  <div className="term-prompt-bar">
                    <span className="term-dot bg-error border border-on-surface feed-pulse" aria-hidden="true"></span>
                    <span className="ml-3 font-metadata-mono text-[10px] uppercase tracking-widest term-text-amber">PIPELINE · /var/folio/queue.feed</span>
                    <span className="ml-auto font-metadata-mono text-[10px] uppercase tracking-widest term-text-dim">stream</span>
                  </div>
                  <div className="p-6 md:p-8 h-72 overflow-hidden relative">
                    <div className="font-metadata-mono text-[11px] space-y-2 leading-relaxed">
                      {[
                        { t: "11:42:01", lbl: "CHARGE", val: "ARMED", cls: "term-text", chip: "OK" },
                        { t: "11:42:14", lbl: "MATRIX", val: "0.41 oz", cls: "term-text-amber", chip: "FLOW" },
                        { t: "11:42:27", lbl: "HALFTONE", val: "GRADE M", cls: "term-text", chip: "OK" },
                        { t: "11:42:33", lbl: "INTEGRITY", val: "87%", cls: "term-text-amber", chip: "WARN" },
                        { t: "11:42:48", lbl: "CALIBRATE", val: "LOCK", cls: "term-text", chip: "OK" },
                        { t: "11:42:55", lbl: "FRAGMENT", val: "QUEUED · 03", cls: "term-text-amber", chip: "WAIT" },
                        { t: "11:43:02", lbl: "ALCHEMY", val: "COMPLETE_", cls: "term-text term-glow", chip: "DONE" },
                      ].map((row, i) => (
                        <div key={row.t} className="feed-line flex items-center gap-3" style={{ "--d": `${0.4 + i * 0.45}s` }}>
                          <span className="term-text-dim shrink-0">{row.t}</span>
                          <span className={`${row.cls} font-bold uppercase tracking-wider w-24 shrink-0`}>{row.lbl}</span>
                          <span className={`${row.cls} flex-1 truncate`}>{row.val}</span>
                          <span className={`shrink-0 px-1.5 py-0.5 border ${row.chip === "WARN" ? "border-current term-text-error" : row.chip === "WAIT" ? "border-current term-text-amber" : row.chip === "FLOW" ? "border-current term-text-amber" : "border-current term-text"} text-[9px] tracking-widest`}>{row.chip}</span>
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-3 right-4 flex items-center gap-3 font-metadata-mono text-[10px] uppercase tracking-[0.3em]">
                      <span className="term-text-dim">FEED · ↓</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 mt-3 border-t-2 border-on-surface text-center font-metadata-mono text-[10px] uppercase tracking-[0.3em]">
                <div className="border-r-2 border-on-surface py-2 px-2 text-on-surface-variant">CPU · 41% NOMINAL</div>
                <div className="border-r-2 border-on-surface py-2 px-2 text-error">FRAGMENTS · 3 IN-FLIGHT</div>
                <div className="py-2 px-2 text-tertiary">YIELD · 0.41 OZ / RUN</div>
              </div>
            </div>
          </section>
          <section id="the-gallery" className="py-24 px-margin-edge max-w-[1440px] mx-auto bg-surface-container-low border-t-4 border-on-surface">
            <div className="mb-16">
              <h2 className="font-headline-lg text-headline-lg inline-block scribble-underline">THE GALLERY</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-xl">Curated organic anomalies and structured chaos. Sketches pinned to the board of progress.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {galleryCards.map((c) => (
                <div key={c.fig} className={`relative bg-surface p-8 border-2 border-outline-variant shadow-md ${c.offsetClass}`}>
                  <div className={`absolute -top-3 w-16 h-6 bg-white/50 border border-outline-variant/30 backdrop-blur-sm transform ${c.tapeClass}`} />
                  <div className="aspect-square bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant relative overflow-hidden halftone-bg">
                    <div className={`absolute inset-0 opacity-20 ${c.overlay}`} />
                    <img alt={c.alt} src={c.src} className={`w-full h-full object-cover mix-blend-multiply opacity-80${c.grayscale ? " grayscale" : ""}`} />
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-metadata-mono text-metadata-mono text-on-surface">{c.fig}</span>
                    <span className="material-symbols-outlined text-outline">{c.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Field Specimens — slanted comic-panel marquee */}
          <section id="field-specimens" className="full-bleed bg-tertiary-fixed border-y-4 border-on-surface relative overflow-hidden py-20">
            <div className="absolute inset-0 halftone-bg opacity-40 pointer-events-none"></div>
            <div className="max-w-[1440px] mx-auto px-margin-edge relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <span className="font-metadata-mono text-metadata-mono uppercase tracking-[0.4em] text-error block mb-3">// VOL. 03 — FIELD ARCHIVE</span>
                  <h2 className="font-headline-display text-headline-display text-on-surface uppercase leading-[0.95]">Specimens<br /><span className="italic text-tertiary">from the bench.</span></h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface max-w-md md:text-right">Eleven artefacts pulled from the workshop floor. Hover the strip to halt the conveyor. <span className="bg-on-surface text-surface-bright px-1">DRAG NOT REQUIRED.</span></p>
              </div>
            </div>
            <div className="relative overflow-hidden py-6">
              <div className="specimen-track">
                {[...specimens, ...specimens].map((s, i) => {
                  const hidden = i >= specimens.length;
                  return (
                    <figure key={`sp-${i}`} aria-hidden={hidden ? "true" : undefined} className={`shrink-0 ${s.w} h-80 ${s.bg} border-4 border-on-surface relative pop-art-shadow ${s.rot} overflow-hidden`}>
                      <img alt={hidden ? "" : `Specimen ${s.id}`} className={`absolute inset-0 w-full h-full object-cover ${s.extraImg}`} src={s.src} />
                      <div className="absolute inset-0 halftone-overlay opacity-70"></div>
                      {s.grad && <div className={`absolute inset-0 ${s.grad}`}></div>}
                      <div className="absolute top-3 left-3 right-3 flex justify-between font-metadata-mono text-[10px] uppercase tracking-widest">
                        <span className={`${s.tagBg} ${s.tagText} px-2 py-0.5`}>SPEC · {s.id}</span>
                        <span className={`${s.topRightBg} ${s.topRightText} px-2 py-0.5`}>{s.topRight}</span>
                      </div>
                      <figcaption className={`absolute bottom-0 inset-x-0 ${s.figBg} ${s.figText} px-4 py-${s.featured ? "4" : "3"} font-cta-bold ${s.featured ? "text-lg" : "text-base"} uppercase tracking-tight border-t-4 ${s.border}`}>
                        {s.featured ? <span className="block">{s.tag}</span> : s.tag}
                        <span className={`block font-metadata-mono text-[10px] tracking-widest ${s.metaColor || "text-tertiary-fixed-dim"} mt-${s.featured ? "1" : "0.5"}`}>{s.meta}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Transmutation Process — alternating image+content rows */}
          <section id="process" className="py-24 px-margin-edge max-w-[1440px] mx-auto">
            <div className="flex justify-between items-end mb-16 border-b-2 border-on-surface pb-4">
              <div>
                <span className="font-metadata-mono text-metadata-mono uppercase tracking-[0.4em] text-error block mb-3">// PROC.04</span>
                <h2 className="font-headline-display text-headline-display text-on-surface uppercase leading-[0.95]">The <span className="italic text-error">Transmutation</span> Recipe</h2>
              </div>
              <span className="font-metadata-mono text-metadata-mono text-outline hidden md:block">3 STEPS · 11 MINUTES · IRREVERSIBLE</span>
            </div>
            <div className="flex flex-col gap-20 md:gap-28">
              {processSteps.map((p, idx) => {
                /* Pages-style flip-in: figure pane flips from its outer edge, content pane flips from the gutter — looks like opening a book/folio. */
                const figureSide = p.side === "right" ? "r" : "l";
                const contentSide = p.side === "right" ? "l" : "r";
                const baseDelay = idx * 0.18;
                const figure = (
                  <figure className={`md:col-span-7 relative ${p.figBg} border-4 border-on-surface aspect-[4/3] overflow-hidden ${p.tilt} pop-art-shadow recipe-pane-${figureSide}${p.side === "right" ? " md:order-2 order-1" : ""}`} style={{ "--d": `${baseDelay}s` }}>
                    <img alt={`Step ${p.n}`} className={`absolute inset-0 w-full h-full object-cover ${p.extraImg || ""}`} src={p.img} />
                    <div className="absolute inset-0 halftone-overlay opacity-55"></div>
                    <div className={`absolute inset-0 ${p.grad}`}></div>
                    <span className={`absolute top-6 left-6 ${p.phaseChip} font-metadata-mono text-[11px] uppercase tracking-[0.3em] px-3 py-1.5`}>{p.phase}</span>
                    <span className={`absolute bottom-6 right-6 ${p.clockChip} font-cta-bold uppercase tracking-tight px-4 py-2 border-2`}>{p.clock}</span>
                    {p.livePill && <div className="absolute bottom-6 left-6 bg-error text-surface-bright font-cta-bold uppercase tracking-tight px-4 py-2 border-2 border-tertiary-fixed-dim animate-pulse">GOLD · LIVE</div>}
                  </figure>
                );
                const content = (
                  <div className={`md:col-span-5 relative recipe-pane-${contentSide}${p.side === "right" ? " md:order-1 order-2" : ""}`} style={{ "--d": `${baseDelay + 0.12}s` }}>
                    <span className={`font-metadata-mono text-metadata-mono uppercase tracking-[0.4em] ${p.color} block mb-4`}>STEP {p.n}</span>
                    <h3 className="font-headline-lg text-[44px] leading-[1.05] text-on-surface uppercase mb-4">
                      {p.italic ? <>{p.title} <span className={`italic${p.italicColor ? " " + p.italicColor : ""}`}>{p.italic}</span>{p.second !== null ? "." : ""}</> : `${p.title}`}
                    </h3>
                    {p.body && (typeof p.body === "string" && p.body.includes("<span") ? (
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6" dangerouslySetInnerHTML={{ __html: p.body }} />
                    ) : (
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6">{p.body}</p>
                    ))}
                    {p.list && (
                      <ul className="font-metadata-mono text-metadata-mono text-on-surface space-y-2 border-l-4 border-error pl-4">
                        {p.list.map((li) => <li key={li}>{li}</li>)}
                      </ul>
                    )}
                    {p.dials && (
                      <div className="grid grid-cols-3 gap-3">
                        {p.dials.map((d) => (
                          <div key={d.l} className={`border-4 border-on-surface ${d.b} p-3 text-center`}>
                            <span className={`font-headline-display text-3xl ${d.c} block`}>{d.v}</span>
                            <span className="font-metadata-mono text-[10px] uppercase tracking-widest text-on-surface-variant">{d.l}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {p.footer && (
                      <div className="border-t-4 border-on-surface pt-4 flex items-center justify-between">
                        <span className="font-metadata-mono text-[11px] uppercase tracking-[0.3em] text-on-surface-variant">{p.footer.caption}</span>
                        <a className="font-cta-bold text-base uppercase tracking-widest text-error border-b-4 border-error hover:text-tertiary hover:border-tertiary transition-colors" href="#cta">{p.footer.linkText}</a>
                      </div>
                    )}
                  </div>
                );
                return (
                  <div key={p.n} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    {p.side === "right" ? <>{content}{figure}</> : <>{figure}{content}</>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Five Laws of Alchemy — numbered doctrine list */}
          <section id="laws" className="full-bleed py-24 bg-inverse-surface text-inverse-on-surface border-y-8 border-double border-on-surface">
            <div className="max-w-[1440px] mx-auto px-margin-edge">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
                {/* Aside is a flex column so the bench-note figure can be pushed (mt-auto) to the floor of the column, bottoms-aligned with the right column's 5-item ordered list. */}
                <aside className="lg:col-span-4 flex flex-col">
                  <span className="font-metadata-mono text-metadata-mono uppercase tracking-[0.4em] text-tertiary-fixed-dim block mb-6">// CODICIL · ROMANUS</span>
                  <h2 className="font-headline-display text-[64px] leading-[0.95] uppercase mb-6">Five laws<br />of <span className="italic text-tertiary-fixed-dim">alchemy.</span></h2>
                  <p className="font-body-md text-body-md text-primary-fixed-dim mb-10">Pinned above the kettle since 1954. Bent twice, broken thrice, restated for the new bench. Memorise them or laminate them, but don't ignore them.</p>
                  <figure className="mt-auto border-4 border-tertiary-fixed-dim p-6 bg-on-surface relative">
                    <span className="material-symbols-outlined absolute -top-5 -left-3 text-error text-5xl bg-inverse-surface px-2">format_quote</span>
                    <blockquote className="font-headline-lg text-2xl leading-snug italic text-tertiary-fixed-dim">"The matrix takes what it is given. The operator takes the blame."</blockquote>
                    <cite className="font-metadata-mono text-[11px] not-italic uppercase tracking-[0.3em] text-primary-fixed-dim block mt-4">— BENCH NOTE 014 · 2024</cite>
                  </figure>
                </aside>
                <ol className="lg:col-span-8 border-t-2 border-tertiary-fixed-dim/40">
                  {lawList.map((l, i) => (
                    <li key={l.tag} className={`grid grid-cols-12 gap-4 py-8 ${i < lawList.length - 1 ? "border-b-2 border-tertiary-fixed-dim/40 " : ""}hover:bg-on-surface/30 transition-colors`}>
                      <span className={`col-span-2 lg:col-span-1 font-headline-display text-5xl ${l.color} tabular-nums leading-none`}>{l.i}</span>
                      <div className="col-span-10 lg:col-span-9">
                        <h3 className="font-headline-lg text-2xl uppercase mb-2">{l.title}</h3>
                        <p className="font-body-md text-body-md text-primary-fixed-dim">{l.body}</p>
                      </div>
                      <span className="col-span-12 lg:col-span-2 font-metadata-mono text-[10px] uppercase tracking-widest text-tertiary-fixed-dim self-center lg:text-right">[ {l.tag} ]</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* FAQ — speech-bubble accordion */}
          <section id="muttered" className="py-24 px-margin-edge max-w-[1440px] mx-auto relative">
            <div className="absolute inset-0 halftone-bg opacity-30 pointer-events-none -z-10"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <aside className="lg:col-span-4">
                <span className="font-metadata-mono text-metadata-mono uppercase tracking-[0.4em] text-error block mb-3">// VOL. 09</span>
                <h2 className="font-headline-display text-[56px] leading-[0.95] uppercase mb-6">Frequently <span className="italic text-error">muttered</span> questions.</h2>
                <div className="speech-bubble inline-block px-6 py-4 mb-12 -rotate-2">
                  <p className="font-cta-bold uppercase tracking-tight text-on-surface text-lg">"Will it work on Tuesdays?"</p>
                  <span className="font-metadata-mono text-[10px] uppercase tracking-widest text-on-surface-variant">— ANON, BENCH 04</span>
                </div>
                <a className="bg-on-surface text-surface-bright font-cta-bold text-base uppercase tracking-widest px-6 py-3 inline-flex items-center gap-2 btn-skeuo border-4 border-on-surface" href="#cta">
                  <span className="material-symbols-outlined text-xl">forum</span>
                  Mutter your own
                </a>
              </aside>
              <div className="lg:col-span-8 divide-y-4 divide-on-surface border-y-4 border-on-surface bg-surface-bright">
                {popFaq.map((f) => (
                  <details key={f.i} className="pop-faq group p-6 md:p-8" open={f.open}>
                    <summary className="flex items-center gap-6 list-none">
                      <span className={`font-headline-display text-3xl ${f.color} tabular-nums shrink-0 w-10`}>{f.i}</span>
                      <h3 className="pop-headline font-headline-lg text-xl md:text-2xl uppercase flex-1 transition-colors">{f.q}</h3>
                      <span className="pop-plus material-symbols-outlined text-4xl text-on-surface shrink-0">add</span>
                    </summary>
                    {f.i === "01" && <div className="pl-16 mt-4 font-body-md text-body-md text-on-surface-variant">It transmutes. The print head is decorative. Every fragment in returns at 0.41 oz of usable yield, plus or minus what you forget to clean off the rollers.</div>}
                    {f.i === "02" && <div className="pl-16 mt-4 font-body-md text-body-md text-on-surface-variant">Yes, if your bench is grade-B or higher. The kettle holds three; the calibration wheel holds two. The third one waits in the rack and gets a halftone tan.</div>}
                    {f.i === "03" && <div className="pl-16 mt-4 font-body-md text-body-md text-on-surface-variant">Corruption is a feature. The terminal logs the breach as <span className="bg-on-surface text-tertiary-fixed-dim px-1 font-metadata-mono">[ANOMALY · KEEP]</span> and routes it to the gallery wall. Critics call this our most honest output.</div>}
                    {f.i === "04" && <div className="pl-16 mt-4 font-body-md text-body-md text-on-surface-variant">Three would suggest hesitation. Five would suggest neurosis. Four screws says: this panel was meant to be opened, but rarely.</div>}
                    {f.i === "05" && <div className="pl-16 mt-4 font-body-md text-body-md text-on-surface-variant">Catastrophically. Once the big red button is hit the matrix consumes the source fragment, the operator's previous lunch, and any unsaved drafts opened on the same network. Print twice. Save once.</div>}
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Trusted by — pop-art press wall via simpleicons.org. All slugs curl-verified 200. */}
          <section className="full-bleed bg-tertiary-fixed border-y-4 border-on-surface py-20 relative">
            <div className="absolute inset-0 halftone-bg opacity-40 pointer-events-none"></div>
            <div className="relative max-w-[1440px] mx-auto px-margin-edge">
              <div className="text-center mb-12">
                <span className="font-metadata-mono text-metadata-mono uppercase tracking-[0.4em] text-error block mb-3">// VOL. 11 — BENCH NOTES IN PRESS</span>
                <h2 className="font-headline-display text-[56px] leading-[0.95] uppercase">Stamped onto the pages of<br /><span className="italic text-tertiary">titles that print on Mondays.</span></h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {[
                  { slug: "theguardian", name: "Guardian", date: "Q3 · 25" },
                  { slug: "telegraph", name: "Telegraph", date: "Q4 · 25" },
                  { slug: "substack", name: "Substack", date: "Q1 · 26" },
                  { slug: "medium", name: "Medium", date: "Q1 · 26" },
                  { slug: "behance", name: "Behance", date: "Q2 · 26" },
                  { slug: "dribbble", name: "Dribbble", date: "Q2 · 26" },
                ].map((b) => (
                  <article key={b.slug} className="bg-surface-bright border-4 border-on-surface p-5 pop-art-shadow flex flex-col items-center text-center transform hover:-translate-y-1 hover:rotate-1 transition-transform">
                    <img src={`https://cdn.simpleicons.org/${b.slug}/1c1b1b`} alt={`${b.name} logo`} width="32" height="32" loading="lazy" decoding="async" className="w-8 h-8 mb-3" />
                    <span className="font-headline-lg text-lg uppercase tracking-tight text-on-surface block">{b.name}</span>
                    <span className="font-metadata-mono text-[10px] tracking-widest uppercase text-on-surface-variant mt-1">{b.date}</span>
                  </article>
                ))}
              </div>
              <p className="text-center mt-12 font-metadata-mono text-[11px] uppercase tracking-[0.4em] text-on-surface-variant">+ 14 mentions in trade press · syndication via the wire · cuttings on file</p>
            </div>
          </section>

          {/* Premium — four-card lab-stand specs, inline material symbols + halftone accents */}
          <section className="full-bleed py-24 bg-surface-container-low border-b-4 border-on-surface">
            <div className="max-w-[1440px] mx-auto px-margin-edge">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 border-b-2 border-on-surface pb-6">
                <div className="max-w-2xl">
                  <span className="font-metadata-mono text-metadata-mono uppercase tracking-[0.4em] text-error block mb-3">// LAB SPECS · IV</span>
                  <h2 className="font-headline-display text-headline-display text-on-surface uppercase leading-[0.95]">What ships with<br /><span className="italic text-tertiary">every folio.</span></h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:text-right">Four standing inclusions, packed in the same wax-paper sleeve since 1954. The dust on the seals is the warranty.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { i: "I", icon: "science", title: "Calibration sheet.", body: "A four-quadrant chart, halftone-printed, signed by whichever apprentice closed the bench. Replaces the warranty card; costs nothing to ignore.", chip: "DOC · 12 PP", chipBg: "bg-error", chipText: "text-surface-bright" },
                  { i: "II", icon: "approval", title: "Lead-foil stamp.", body: "Numbered to the folio. Press it on the back cover; press it again on the apprentice's notebook. Stamps run dry at 400 impressions.", chip: "FOLIO · 001-400", chipBg: "bg-on-surface", chipText: "text-tertiary-fixed-dim" },
                  { i: "III", icon: "settings_input_component", title: "Bench-knob set.", body: "Three brass knobs in a velvet-lined wallet. Re-zero before every transmutation; the knobs remember even when you don't.", chip: "BRASS · TRIO", chipBg: "bg-tertiary", chipText: "text-surface-bright" },
                  { i: "IV", icon: "auto_stories", title: "Wax-sealed log.", body: "A leather-bound notebook with the year's first 41 pages tinted halftone-yellow. Open it when the matrix hums; close it when it stops.", chip: "LOG · 240 PP", chipBg: "bg-tertiary-fixed-dim", chipText: "text-on-surface" },
                ].map((c) => (
                  <article key={c.i} className="bg-surface-bright border-4 border-on-surface p-6 pop-art-shadow relative flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <div className="bg-on-surface text-tertiary-fixed-dim w-14 h-14 flex items-center justify-center border-2 border-on-surface">
                        <span className="material-symbols-outlined text-3xl" aria-hidden="true">{c.icon}</span>
                      </div>
                      <span className="font-headline-display text-3xl text-error tabular-nums leading-none">{c.i}</span>
                    </div>
                    <h3 className="font-headline-lg text-xl text-on-surface uppercase mb-2 leading-tight">{c.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed flex-1">{c.body}</p>
                    <span className={`mt-5 self-start font-metadata-mono text-[10px] uppercase tracking-[0.3em] ${c.chipBg} ${c.chipText} px-2 py-1 border-2 border-on-surface`}>{c.chip}</span>
                  </article>
                ))}
              </div>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px border-4 border-on-surface bg-on-surface">
                {[
                  { v: "1954", l: "First press" },
                  { v: "240", l: "Folios per yr" },
                  { v: "0.41", l: "Oz · yield" },
                  { v: "41", l: "Halftone tracks" },
                ].map((s) => (
                  <div key={s.l} className="bg-surface-bright p-5 text-center">
                    <span className="font-headline-display text-3xl md:text-4xl text-error tabular-nums block">{s.v}</span>
                    <span className="font-metadata-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-32 px-margin-edge max-w-[1440px] mx-auto text-center relative halftone-bg">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg className="opacity-20 text-on-surface" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <line stroke="currentColor" strokeDasharray="10 10" strokeWidth="2" x1="0" x2="100%" y1="0" y2="100%" />
                <line stroke="currentColor" strokeDasharray="10 10" strokeWidth="2" x1="100%" x2="0" y1="0" y2="100%" />
              </svg>
            </div>
            <div className="relative z-10">
              <button className="bg-error border-8 border-on-surface p-12 rounded-full shadow-[0_16px_0_0_rgba(28,27,27,1)] active:shadow-[0_4px_0_0_rgba(28,27,27,1)] active:translate-y-3 transition-all duration-150 group">
                <div className="bg-surface-bright border-4 border-on-surface px-12 py-6 rounded-full group-hover:bg-tertiary-fixed transition-colors">
                  <span className="font-headline-display text-headline-display text-on-surface uppercase tracking-tight block">BEGIN TRANSMUTATION</span>
                </div>
              </button>
              <div className="mt-12 font-metadata-mono text-metadata-mono text-outline uppercase tracking-widest">
                WARNING: PROCESS CANNOT BE REVERSED once initiated.
              </div>
            </div>
          </section>
        </main>
        <footer className="bg-stone-950 dark:bg-black text-[#F5F2E9] p-12 border-t-8 border-double border-stone-800">
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-16 gap-8">
            <div className="font-black text-lg text-white">THE ALCHEMIST'S FOLIO</div>
            <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest text-stone-500">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="hover:text-white hover:line-through transition-colors">{l}</a>
              ))}
            </nav>
            <div className="font-mono text-xs uppercase tracking-widest text-stone-500">
              ©1954 ALCHEMIST CORP // TRANSMUTATION PENDING
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
