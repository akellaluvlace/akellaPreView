const navLinks = [
  { label: "ARSENAL", href: "#arsenal", active: true },
  { label: "ARCHIVE", href: "#archive" },
  { label: "PROCESS", href: "#process" },
  { label: "PORTAL", href: "#portal" },
];

const arsenalCards = [
  {
    num: "01",
    numClass: "bg-white text-black",
    borderAccent: "border-l-4 border-on-tertiary-container",
    hoverShadow: "hover:shadow-[12px_12px_0px_0px_#ffffff]",
    title: "Identity",
    body: "Raw conceptual extraction.",
    colSpan: "",
    alt: "Abstract fluid 3d shapes in monochrome metallic finish with harsh directional lighting",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzKOLR0AuyY1Twf_38H90bMuz4qb3ld29iLuHUHm1ZAs1F5c0JAym3jx7eoOTc2gQ_RFNFLMy88OBYl3z8soEeSTTeHvriZHVOJ3IWe9XUw7UDIJvlrRs4fwFkoDMn0wVr6-aoNe4QTgo0TyXF81CEwbhIyJ_WPxKKYbC7pDiVoUhz0mfH1b2zOZS8pym-wvq3dwO7P_dh0UO663ueT0OFVi_QLdTvQo1PGYE-NKNW3hAAyYtyHzew_3gkyzL9aLgq8kj4mJ4lv5M",
  },
  {
    num: "02",
    numClass: "bg-on-tertiary-container text-white",
    borderAccent: "border-t-4 border-white",
    hoverShadow: "hover:shadow-[12px_12px_0px_0px_#745cff]",
    title: "Interface",
    body: "Tactile friction systems.",
    colSpan: "md:col-span-2",
    alt: "Close up of heavily textured concrete brutalist architecture with deep angular shadows",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4aR-XtVZr1TPLBi-wZcVGaYDuYtMbwbvSXTnYh57hLudUY7zJE3nR0nC-NPvJ04oURg9akH-pAC1gGs4wScLnlmp5j9XVUnP-MrsY2j71bTZJ-NUYkOy6rrE-EOwNmH6rKDRkHAmWIC8hJ55gc4P9eH63j8KY2u09EEcpUrq2-X-PyjddWMa2Z3aOS8e7qOGJCXrSslpLc8lZZ4X1Dww8P892zP0Vhtim7Dq28UFiO-yQ-Z4ZQ2SznynpfbvpyLteFqnrWYeLCTU",
  },
  {
    num: "03",
    numClass: "bg-error text-error-container",
    borderAccent: "border-r-4 border-error",
    hoverShadow: "hover:shadow-[12px_12px_0px_0px_#ffb4ab]",
    title: "Innovation",
    body: "Algorithmic destruction.",
    colSpan: "md:col-span-2",
    alt: "Macro shot of intricate circuit board routing with stark high contrast lighting",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNJAL0lZJWy-kiwzaXequXh-L3Kr9LGFMoefCn4zHSeD9MH5IDUXu0yUX8NFdaMUgUtEN5a51NTD2qp7dco1WaKRc0Sf6-Hu0DjuRLBs3mh_HNoqYs-snyn-NreYSYx8KiZEnWfxqLMKG2DZNjrCXZrvaGl5UfNKera7ntlVBi5V_Ijklttl_bka2eFLzqfHCVxZBe9dzXVq72T9dimBRnkPRBYKNN2R6LmkQkh1pwiwLTIXSUdgTQ42gpaDqkt6FcOBpnNVHZGMQ",
  },
];

// Archive marquee figures — 8 plates. Pre-computed Tailwind class strings per §K.11/M.14.
const archiveTiles = [
  {
    alt: "Archive 01",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-72 md:w-80 h-96 relative bg-surface-container border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-70",
    overlayCls: "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent",
    badgeLeftCls: "bg-white text-black px-2 py-0.5",
    badgeLeftText: "ITEM_01",
    badgeRightCls: "bg-on-tertiary-container text-white px-2 py-0.5",
    badgeRightText: "LIVE",
    title: "Trace · Δ-22",
    metaCls: "font-label-mono text-[10px] tracking-widest text-secondary block mt-2",
    meta: "CIRCUIT · 41 NODES · BERLIN",
  },
  {
    alt: "Archive 02",
    src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1100&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-80 md:w-96 h-96 relative bg-on-tertiary-container border-2 border-white shadow-[6px_6px_0px_0px_rgba(116,92,255,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-50 mix-blend-multiply",
    overlayCls: "absolute inset-0 bg-gradient-to-bl from-on-tertiary-container/70 via-transparent to-black/60",
    badgeLeftCls: "bg-white text-on-tertiary-container px-2 py-0.5",
    badgeLeftText: "ITEM_02",
    badgeRightCls: "bg-black text-tertiary-fixed-dim px-2 py-0.5",
    badgeRightText: "FACADE",
    title: "Pillar Run B",
    metaCls: "font-label-mono text-[10px] tracking-widest text-tertiary-fixed-dim block mt-2",
    meta: "BRUTALIST · WEST WING · MMXXIV",
  },
  {
    alt: "Archive 03",
    src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-72 md:w-80 h-96 relative bg-error border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,180,171,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale contrast-150 mix-blend-multiply opacity-90",
    overlayCls: "absolute inset-0 bg-gradient-to-t from-error/70 via-transparent to-black/40",
    badgeLeftCls: "bg-white text-error px-2 py-0.5",
    badgeLeftText: "ITEM_03",
    badgeRightCls: "bg-black text-error px-2 py-0.5",
    badgeRightText: "FORGE",
    title: "Heavy Press 11",
    metaCls: "font-label-mono text-[10px] tracking-widest block mt-2",
    meta: "FOUNDRY · 9.2 TONNE · DETROIT",
  },
  {
    alt: "Archive 04",
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1100&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-80 md:w-96 h-96 relative bg-surface-container border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-65",
    overlayCls: "absolute inset-0 bg-gradient-to-tr from-black via-transparent to-on-tertiary-container/40",
    badgeLeftCls: "bg-white text-black px-2 py-0.5",
    badgeLeftText: "ITEM_04",
    badgeRightCls: "bg-on-tertiary-container text-white px-2 py-0.5",
    badgeRightText: "RACK",
    title: "Server Stack 04",
    metaCls: "font-label-mono text-[10px] tracking-widest text-tertiary-fixed-dim block mt-2",
    meta: "LAB-B · 14:22 · DUBLIN",
  },
  {
    alt: "Archive 05",
    src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-72 md:w-80 h-96 relative bg-surface-container border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-65",
    overlayCls: "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent",
    badgeLeftCls: "bg-white text-black px-2 py-0.5",
    badgeLeftText: "ITEM_05",
    badgeRightCls: "bg-error text-error-container px-2 py-0.5",
    badgeRightText: "DRAFT",
    title: "Atelier Light",
    metaCls: "font-label-mono text-[10px] tracking-widest text-tertiary-fixed-dim block mt-2",
    meta: "PLATE IX · COPENHAGEN",
  },
  {
    alt: "Archive 06",
    src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1100&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-80 md:w-96 h-96 relative bg-black border-2 border-on-tertiary-container shadow-[6px_6px_0px_0px_rgba(116,92,255,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-55",
    overlayCls: "absolute inset-0 bg-gradient-to-bl from-on-tertiary-container/40 via-transparent to-black/80",
    badgeLeftCls: "bg-on-tertiary-container text-white px-2 py-0.5",
    badgeLeftText: "ITEM_06",
    badgeRightCls: "bg-white text-black px-2 py-0.5",
    badgeRightText: "VAULT",
    title: "Marble Run 02",
    metaCls: "font-label-mono text-[10px] tracking-widest text-tertiary-fixed-dim block mt-2",
    meta: "VESTIBULE · 9 STEPS · OSLO",
  },
  {
    alt: "Archive 07",
    src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-72 md:w-80 h-96 relative bg-surface-container border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-65",
    overlayCls: "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-on-tertiary-container/15",
    badgeLeftCls: "bg-white text-black px-2 py-0.5",
    badgeLeftText: "ITEM_07",
    badgeRightCls: "bg-on-tertiary-container text-white px-2 py-0.5",
    badgeRightText: "CORNICE",
    title: "Heritage 33",
    metaCls: "font-label-mono text-[10px] tracking-widest text-tertiary-fixed-dim block mt-2",
    meta: "DETAIL · GILT · LISBON",
  },
  {
    alt: "Archive 08",
    src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=1100&q=85&auto=format&fit=crop",
    figCls: "shrink-0 w-80 md:w-96 h-96 relative bg-surface-container border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-65",
    overlayCls: "absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-error/20",
    badgeLeftCls: "bg-white text-black px-2 py-0.5",
    badgeLeftText: "ITEM_08",
    badgeRightCls: "bg-error text-error-container px-2 py-0.5",
    badgeRightText: "HALL",
    title: "Vault MMXXIV",
    metaCls: "font-label-mono text-[10px] tracking-widest text-tertiary-fixed-dim block mt-2",
    meta: "CENTENNIAL · ROME",
  },
];

// Process steps — 3 alternating rows.
const processKnobs = [
  { value: "8.4", valueCls: "text-on-tertiary-container", borderCls: "border-2 border-white", label: "Creativity" },
  { value: "4.0", valueCls: "text-tertiary-fixed-dim", borderCls: "border-2 border-white", label: "Logic" },
  { value: "7.7", valueCls: "text-error", borderCls: "border-2 border-on-tertiary-container", label: "Spirit" },
];

const processSteps = [
  {
    reverse: false,
    figCornerA: "absolute -top-4 -left-4 w-12 h-12 bg-on-tertiary-container -z-10",
    figCornerB: "absolute -bottom-4 -right-4 w-12 h-12 border-4 border-white -z-10",
    frameShadow: "shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]",
    alt: "Phase I",
    src: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1400&q=85&auto=format&fit=crop",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-75",
    overlayCls: "absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-on-tertiary-container/30",
    phaseBadgeCls: "absolute top-5 left-5 bg-white text-black font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5",
    phaseBadgeText: "PHASE · I",
    timeBadgeCls: "absolute bottom-5 right-5 bg-on-tertiary-container text-white font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white",
    timeBadgeText: "11:42:00",
    extraBadge: null,
    stepLabel: "STEP 01",
    heading: "Charge the matrix.",
    body: "Drop a raw fragment — a half-formed feed, a typo'd headline, a forgotten draft. The matrix grips it, drops a 41-track halftone, and runs it through the calibration wheel.",
    bullets: [
      "// VOLTAGE_LOCK · ARMED",
      "// HALFTONE_GRADE · MEDIUM",
      "// FRAGMENT_INTEGRITY · 87%",
    ],
    knobs: null,
    footer: null,
  },
  {
    reverse: true,
    figCornerA: "absolute -top-4 -right-4 w-12 h-12 bg-error -z-10",
    figCornerB: "absolute -bottom-4 -left-4 w-12 h-12 border-4 border-white -z-10",
    frameShadow: "shadow-[10px_10px_0px_0px_rgba(116,92,255,1)]",
    alt: "Phase II",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=85&auto=format&fit=crop",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-70",
    overlayCls: "absolute inset-0 bg-gradient-to-bl from-on-tertiary-container/40 via-transparent to-black/70",
    phaseBadgeCls: "absolute top-5 right-5 bg-white text-black font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5",
    phaseBadgeText: "PHASE · II",
    timeBadgeCls: "absolute bottom-5 left-5 bg-black text-tertiary-fixed-dim font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-tertiary-fixed-dim",
    timeBadgeText: "14:08:00",
    extraBadge: null,
    stepLabel: "STEP 02",
    heading: "Crank the knobs.",
    body: "Twist Creativity past 8. Logic to 4. Spirit somewhere between mischief and belief. The console screams; the operator sips coffee. The dials lock when you're warm.",
    bullets: null,
    knobs: processKnobs,
    footer: null,
  },
  {
    reverse: false,
    figCornerA: "absolute -top-4 -left-4 w-12 h-12 bg-tertiary-fixed-dim -z-10",
    figCornerB: "absolute -bottom-4 -right-4 w-12 h-12 border-4 border-error -z-10",
    frameShadow: "shadow-[10px_10px_0px_0px_rgba(255,180,171,1)]",
    alt: "Phase III",
    src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1400&q=85&auto=format&fit=crop",
    imgCls: "absolute inset-0 w-full h-full object-cover grayscale opacity-70",
    overlayCls: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-error/15",
    phaseBadgeCls: "absolute top-5 left-5 bg-error text-error-container font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5",
    phaseBadgeText: "PHASE · III",
    timeBadgeCls: "absolute bottom-5 right-5 bg-tertiary-fixed-dim text-black font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5",
    timeBadgeText: "21:00:00",
    extraBadge: {
      cls: "absolute bottom-5 left-5 bg-on-tertiary-container text-white font-label-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-tertiary-fixed-dim animate-pulse",
      text: "GOLD · LIVE",
    },
    stepLabel: "STEP 03",
    heading: "Pour the gold.",
    bodyHtml:
      'When the bench hums B-flat the bath is ready. Tip the matrix. Let the warm metal find its mould. Stamp it: <span class="bg-white text-black px-2 font-bold">FOLIO · OK</span>. Close the lab.',
    bullets: null,
    knobs: null,
    footer: {
      yield: "Yield · 0.41 oz / fragment",
      linkText: "Read the log →",
      linkHref: "#portal",
    },
  },
];

// Manifesto axioms (5 doctrines).
const manifestoAxioms = [
  {
    roman: "I",
    numCls: "text-on-tertiary-container",
    title: "Begin where the dust collects.",
    body: "A spotless bench yields nothing. Find the corner the apprentice forgot to sweep. That is the substrate.",
    code: "[ LEX_01 ]",
    last: false,
  },
  {
    roman: "II",
    numCls: "text-tertiary-fixed-dim",
    title: "Halftone is honesty.",
    body: "The pixel hides nothing. The dot lies less. When in doubt, scale up the screen and let the audience read the texture.",
    code: "[ LEX_02 ]",
    last: false,
  },
  {
    roman: "III",
    numCls: "text-error",
    title: "A red shadow is a promise.",
    body: "Drop the eight-pixel offset and the page reads as flat. Keep it; the page reads as sworn. Pop is a covenant.",
    code: "[ LEX_03 ]",
    last: false,
  },
  {
    roman: "IV",
    numCls: "text-on-tertiary-container",
    title: "The knob remembers.",
    body: "Whatever you set yesterday is still set today. Re-zero before you crank. The bench rewards memory, punishes optimism.",
    code: "[ LEX_04 ]",
    last: false,
  },
  {
    roman: "V",
    numCls: "text-tertiary-fixed-dim",
    title: "Stamp the work, leave the room.",
    body: "Every folio gets one stamp and one signature. Don't return to retouch. The page closes when the press closes.",
    code: "[ LEX_05 ]",
    last: true,
  },
];

// Portal FAQ accordion.
const portalFaqs = [
  {
    num: "01",
    numCls: "text-on-tertiary-container",
    q: "Does the matrix actually transmute, or is it just a printer?",
    aHtml:
      "It transmutes. The print head is decorative. Every fragment in returns at 0.41 oz of usable yield, plus or minus what you forget to clean off the rollers.",
    open: true,
  },
  {
    num: "02",
    numCls: "text-tertiary-fixed-dim",
    q: "Can I run two fragments in parallel?",
    aHtml:
      "Yes, if your bench is grade-B or higher. The kettle holds three; the calibration wheel holds two. The third one waits in the rack and gets a halftone tan.",
    open: false,
  },
  {
    num: "03",
    numCls: "text-error",
    q: "What if my fragment is corrupted?",
    aHtml:
      'Corruption is a feature. The terminal logs the breach as <span class="bg-white text-black px-1 font-label-mono">[ANOMALY · KEEP]</span> and routes it to the gallery wall. Critics call this our most honest output.',
    open: false,
  },
  {
    num: "04",
    numCls: "text-on-tertiary-container",
    q: "Why are there four screws on every panel?",
    aHtml:
      "Three would suggest hesitation. Five would suggest neurosis. Four screws says: this panel was meant to be opened, but rarely.",
    open: false,
  },
  {
    num: "05",
    numCls: "text-tertiary-fixed-dim",
    q: "Is the warning at the bottom serious?",
    aHtml:
      "Catastrophically. Once the big red button is hit the matrix consumes the source fragment, the operator's previous lunch, and any unsaved drafts opened on the same network. Print twice. Save once.",
    open: false,
  },
];

const footerLinks = ["MANIFESTO", "ENCRYPT", "TERMINAL"];

// Trusted-by collective — design/publishing/dev brands. simpleicons slugs verified before commit.
const COLLECTIVE_NODES = [
  { name: "BEHANCE",  slug: "behance" },
  { name: "DRIBBBLE", slug: "dribbble" },
  { name: "VIMEO",    slug: "vimeo" },
  { name: "GITHUB",   slug: "github" },
  { name: "SUBSTACK", slug: "substack" },
];

// Lab Stack — 4 premium cards explaining the operator's standing equipment.
const LAB_STACK = [
  {
    roman: "I",
    tag: "STACK · 01",
    title: "Halftone matrix.",
    body: "41-track screening grid. Calibration wheel runs 30 nodes per pass. Every fragment leaves with a coordinate stamp on the back panel.",
    foot: "// 41 · TRACKS",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
  },
  {
    roman: "II",
    tag: "STACK · 02",
    title: "Voltage lock.",
    body: "Dual-bench power conditioning. Three-phase isolation. The matrix never reads dirty current — folio integrity holds at 87% even on bad-grid days.",
    foot: "// 87% · INTEGRITY",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />,
  },
  {
    roman: "III",
    tag: "STACK · 03",
    title: "Knob memory.",
    body: "Re-zero before crank. The bench remembers what was set yesterday — drag the operator back to today, then push past 8 on Creativity, lock at 4 on Logic, leave Spirit alone.",
    foot: "// 8.4 · 4.0 · 7.7",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />,
  },
  {
    roman: "IV",
    tag: "STACK · 04",
    title: "Folio stamp.",
    body: "One stamp per folio. One signature per page. The press closes when the lab closes — no retouches, no auto-saves over a stamped output. The work walks out signed.",
    foot: "// 0.41 OZ · STAMPED",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
];

const customCss = `
  .noise-bg {
    background-image:
      repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px),
      radial-gradient(circle at 25% 35%, rgba(255,255,255,0.06) 0 1px, transparent 2px),
      radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05) 0 1px, transparent 2px);
    background-size: 5px 5px, 5px 5px, 11px 11px, 13px 13px;
    opacity: 0.5;
    pointer-events: none;
  }
  .isometric-grid {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: rotateX(60deg) rotateZ(-45deg);
    transform-style: preserve-3d;
  }
  .glitch-text { position: relative; }
  .glitch-text::before, .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: #141313;
  }
  .glitch-text::before {
    left: 2px;
    text-shadow: -2px 0 red;
    clip: rect(24px, 550px, 90px, 0);
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
  }
  .glitch-text::after {
    left: -2px;
    text-shadow: -2px 0 blue;
    clip: rect(85px, 550px, 140px, 0);
    animation: glitch-anim 2.5s infinite linear alternate-reverse;
  }
  html, body { overflow-x: clip; }
  .full-bleed-grunge {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    max-width: none;
  }
  .grunge-track {
    display: flex; gap: 22px; width: max-content;
    animation: grunge-x 70s linear infinite;
    padding: 8px 0;
  }
  .grunge-track:hover { animation-play-state: paused; }
  @keyframes grunge-x {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 11px)); }
  }
  .grunge-faq summary { list-style: none; cursor: pointer; }
  .grunge-faq summary::-webkit-details-marker { display: none; }
  .grunge-faq summary .grunge-glyph { transition: transform 250ms ease; }
  .grunge-faq[open] summary .grunge-glyph { transform: rotate(45deg); }
  .grunge-pulse { animation: grunge-ring 2.6s ease-out infinite; }
  @keyframes grunge-ring {
    0% { box-shadow: 0 0 0 0 rgba(116,92,255,0.55); }
    70% { box-shadow: 0 0 0 12px rgba(116,92,255,0); }
  }
  @keyframes glitch-anim {
    0% { clip: rect(12px, 9999px, 78px, 0); }
    20% { clip: rect(45px, 9999px, 32px, 0); }
    40% { clip: rect(70px, 9999px, 100px, 0); }
    60% { clip: rect(20px, 9999px, 52px, 0); }
    80% { clip: rect(85px, 9999px, 14px, 0); }
    100% { clip: rect(38px, 9999px, 96px, 0); }
  }
  @keyframes glitch-anim-2 {
    0% { clip: rect(64px, 9999px, 12px, 0); }
    20% { clip: rect(20px, 9999px, 88px, 0); }
    40% { clip: rect(8px, 9999px, 60px, 0); }
    60% { clip: rect(72px, 9999px, 30px, 0); }
    80% { clip: rect(40px, 9999px, 95px, 0); }
    100% { clip: rect(15px, 9999px, 50px, 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .grunge-track { animation: none; }
    .grunge-pulse { animation: none; }
    .grunge-faq summary .grunge-glyph { transition: none; }
    .glitch-text::before, .glitch-text::after { animation: none; }
  }
`;

export default function T111IsometricGrungeBrutal() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@800;900&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#c9c6c5", "on-primary": "#313030",
                "primary-container": "#050505", "on-primary-container": "#797777",
                "primary-fixed": "#e5e2e1", "primary-fixed-dim": "#c9c6c5",
                "on-primary-fixed": "#1c1b1b", "on-primary-fixed-variant": "#474646",
                "secondary": "#c6c6c7", "on-secondary": "#2f3131",
                "secondary-container": "#454747", "on-secondary-container": "#b4b5b5",
                "secondary-fixed": "#e2e2e2", "secondary-fixed-dim": "#c6c6c7",
                "on-secondary-fixed": "#1a1c1c", "on-secondary-fixed-variant": "#454747",
                "tertiary": "#c8bfff", "on-tertiary": "#2c009e",
                "tertiary-container": "#040024", "on-tertiary-container": "#745cff",
                "tertiary-fixed": "#e5deff", "tertiary-fixed-dim": "#c8bfff",
                "on-tertiary-fixed": "#190064", "on-tertiary-fixed-variant": "#4100db",
                "surface": "#141313", "on-surface": "#e5e2e1", "on-surface-variant": "#c4c7c7",
                "surface-tint": "#c9c6c5",
                "surface-container-lowest": "#0e0e0e", "surface-container-low": "#1c1b1b",
                "surface-container": "#201f1f", "surface-container-high": "#2b2a2a",
                "surface-container-highest": "#353434",
                "surface-variant": "#353434", "surface-bright": "#3a3939", "surface-dim": "#141313",
                "outline": "#8e9192", "outline-variant": "#444748",
                "background": "#141313", "on-background": "#e5e2e1",
                "inverse-surface": "#e5e2e1", "inverse-on-surface": "#313030", "inverse-primary": "#5f5e5e",
                "error": "#ffb4ab", "on-error": "#690005",
                "error-container": "#93000a", "on-error-container": "#ffdad6"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "gutter": "24px", "margin": "40px", "iso_offset": "32px", "unit": "4px" },
              fontFamily: {
                "body-fixed": ["Space Grotesk"], "label-mono": ["Space Grotesk"],
                "headline-md": ["Space Grotesk"],
                "display-xl": ["Epilogue"], "headline-lg": ["Epilogue"]
              },
              fontSize: {
                "body-fixed": ["16px", { lineHeight: "150%", fontWeight: "400" }],
                "label-mono": ["12px", { lineHeight: "100%", letterSpacing: "0.1em", fontWeight: "500" }],
                "display-xl": ["120px", { lineHeight: "100%", letterSpacing: "-0.05em", fontWeight: "900" }],
                "headline-lg": ["64px", { lineHeight: "110%", fontWeight: "800" }],
                "headline-md": ["32px", { lineHeight: "120%", fontWeight: "700" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-background text-on-background font-body-fixed text-body-fixed antialiased overflow-x-hidden relative">
        {/* Global Noise Floor */}
        <div className="fixed inset-0 z-0 noise-bg" />

        {/* TopNavBar */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] bg-neutral-950/90 backdrop-blur-md flex justify-between items-center px-6 py-4 z-50">
          <div className="text-3xl font-black italic tracking-tighter text-white font-display-xl">ALCHMY</div>
          <div className="hidden md:flex gap-8 items-center font-black tracking-tighter uppercase text-white">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={
                  l.active
                    ? "text-white border-b-4 border-white hover:bg-white hover:text-black transition-all duration-75 px-2 py-1"
                    : "text-neutral-500 hover:bg-white hover:text-black transition-all duration-75 px-2 py-1"
                }
              >
                {l.label}
              </a>
            ))}
          </div>
          <button className="border-2 border-white px-4 py-2 font-black tracking-tighter uppercase text-white shadow-[4px_4px_0px_0px_#ffffff] hover:bg-white hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75">
            TRANSMUTE
          </button>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden z-10 border-b-4 border-white/20">
          <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center opacity-30">
            <div className="w-[200vw] h-[2048px] isometric-grid absolute" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-on-tertiary-container rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-error rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
          <div className="relative z-20 text-center px-4 w-full max-w-7xl mx-auto flex flex-col items-center">
            <div className="bg-surface-container-low/60 backdrop-blur-3xl border border-white/10 p-12 md:p-24 w-full shadow-[20px_20px_0px_0px_rgba(255,255,255,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-on-tertiary-container via-white to-error" />
              <h1 className="font-display-xl text-[36px] sm:text-[52px] md:text-[64px] lg:text-display-xl text-white mb-6 uppercase glitch-text" data-text="TRANSMUTATION">TRANSMUTATION</h1>
              <p className="font-headline-md text-headline-md text-secondary max-w-3xl mx-auto uppercase tracking-widest border-l-4 border-on-tertiary-container pl-6 text-left">
                Ordered Anarchy. <br />
                Tactile Digitalism.
              </p>
            </div>
          </div>
        </section>

        {/* Arsenal */}
        <section id="arsenal" className="relative py-32 px-gutter z-10 border-b-4 border-dashed border-surface-variant">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-white mb-16 uppercase tracking-tighter border-l-8 border-white pl-6">ARSENAL</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-iso_offset">
              {arsenalCards.map((c) => (
                <div
                  key={c.num}
                  className={`${c.colSpan} bg-surface-container border-2 border-outline p-8 shadow-[8px_8px_0px_0px_#8e9192] hover:translate-x-1 hover:-translate-y-1 ${c.hoverShadow} transition-all duration-200 group relative overflow-hidden h-[400px] flex flex-col justify-end`}
                >
                  <div className={`absolute top-4 right-4 ${c.numClass} font-label-mono text-label-mono px-3 py-1`}>{c.num}</div>
                  <img
                    alt={c.title}
                    src={c.src}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity grayscale group-hover:grayscale-0 z-0"
                  />
                  <div className={`relative z-10 bg-black/80 p-6 ${c.borderAccent} backdrop-blur-sm`}>
                    <h3 className="font-headline-md text-headline-md text-white uppercase mb-2">{c.title}</h3>
                    <p className="font-body-fixed text-body-fixed text-secondary">{c.body}</p>
                  </div>
                </div>
              ))}
              <div className="bg-on-tertiary-container border-2 border-white p-8 shadow-[8px_8px_0px_0px_#ffffff] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000000] transition-all duration-200 group relative overflow-hidden h-[400px] flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-6xl text-white mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
                <h3 className="font-headline-md text-headline-md text-white uppercase">Execute</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Archive marquee */}
        <section id="archive" className="full-bleed-grunge bg-black border-y-4 border-white/20 py-20 md:py-28 overflow-hidden relative z-10">
          <div className="absolute inset-0 noise-bg pointer-events-none" />
          <div className="max-w-7xl mx-auto px-gutter mb-12 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim block mb-3">// ARCHIVE_04</span>
              <h2 className="font-headline-lg text-headline-lg text-white uppercase tracking-tighter border-l-8 border-white pl-6">
                Eight artefacts.<br />Live now.
              </h2>
            </div>
            <p className="text-secondary max-w-md md:text-right text-sm border-l-4 border-on-tertiary-container pl-4 md:border-l-0 md:border-r-4 md:pl-0 md:pr-4">
              Each tile is a real production. Hover to halt the procession.{" "}
              <span className="bg-white text-black px-1 font-bold">SCROLL DOES NOT REWIND.</span>
            </p>
          </div>
          <div className="overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 bottom-0 right-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
            <div className="grunge-track">
              {archiveTiles.map((t, i) => (
                <figure key={`a-${i}`} className={t.figCls}>
                  <img alt={t.alt} src={t.src} className={t.imgCls} />
                  <div className={t.overlayCls} />
                  <div className="absolute top-3 left-3 right-3 flex justify-between font-label-mono text-[10px] uppercase tracking-widest">
                    <span className={t.badgeLeftCls}>{t.badgeLeftText}</span>
                    <span className={t.badgeRightCls}>{t.badgeRightText}</span>
                  </div>
                  <figcaption className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="font-headline-md text-2xl uppercase tracking-tighter block">{t.title}</span>
                    <span className={t.metaCls}>{t.meta}</span>
                  </figcaption>
                </figure>
              ))}
              {archiveTiles.map((t, i) => (
                <figure key={`b-${i}`} aria-hidden="true" className={t.figCls}>
                  <img alt="" src={t.src} className={t.imgCls} />
                  <div className={t.overlayCls} />
                  <div className="absolute top-3 left-3 right-3 flex justify-between font-label-mono text-[10px] uppercase tracking-widest">
                    <span className={t.badgeLeftCls}>{t.badgeLeftText}</span>
                    <span className={t.badgeRightCls}>{t.badgeRightText}</span>
                  </div>
                  <figcaption className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="font-headline-md text-2xl uppercase tracking-tighter block">{t.title}</span>
                    <span className={t.metaCls}>{t.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="relative py-32 px-gutter z-10 border-b-4 border-dashed border-surface-variant">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16 border-b-4 border-white pb-6">
              <div>
                <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim block mb-3">// PROCESS_05</span>
                <h2 className="font-headline-lg text-headline-lg text-white uppercase tracking-tighter">The transmutation rite.</h2>
              </div>
              <span className="font-label-mono text-label-mono text-secondary hidden md:block">3 STEPS · 11 DAYS · IRREVERSIBLE</span>
            </div>
            <div className="flex flex-col gap-24 md:gap-32">
              {processSteps.map((s, i) => {
                const figureBlock = (
                  <figure className={`md:col-span-7 relative ${s.reverse ? "md:order-2 order-1" : ""}`}>
                    <div className={s.figCornerA} />
                    <div className={s.figCornerB} />
                    <div className={`relative aspect-[16/10] overflow-hidden border-2 border-white ${s.frameShadow}`}>
                      <img alt={s.alt} src={s.src} className={s.imgCls} />
                      <div className={s.overlayCls} />
                      <span className={s.phaseBadgeCls}>{s.phaseBadgeText}</span>
                      <span className={s.timeBadgeCls}>{s.timeBadgeText}</span>
                      {s.extraBadge && <div className={s.extraBadge.cls}>{s.extraBadge.text}</div>}
                    </div>
                  </figure>
                );
                const textBlock = (
                  <div className={`md:col-span-5 ${s.reverse ? "md:order-1 order-2" : ""}`}>
                    <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim block mb-3">{s.stepLabel}</span>
                    <h3 className="font-headline-md text-headline-md text-white uppercase mb-5">{s.heading}</h3>
                    {s.bodyHtml ? (
                      <p className="text-secondary mb-6" dangerouslySetInnerHTML={{ __html: s.bodyHtml }} />
                    ) : (
                      <p className="text-secondary mb-6">{s.body}</p>
                    )}
                    {s.bullets && (
                      <ul className="font-label-mono text-label-mono text-white space-y-2 border-l-4 border-on-tertiary-container pl-4">
                        {s.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {s.knobs && (
                      <div className="grid grid-cols-3 gap-3">
                        {s.knobs.map((k, j) => (
                          <div key={j} className={`${k.borderCls} bg-surface-container p-3 text-center`}>
                            <span className={`font-display-xl text-3xl ${k.valueCls} block`}>{k.value}</span>
                            <span className="font-label-mono text-[10px] uppercase tracking-widest text-secondary">{k.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {s.footer && (
                      <div className="border-t-4 border-white pt-4 flex items-center justify-between">
                        <span className="font-label-mono text-[10px] uppercase tracking-[0.3em] text-secondary">{s.footer.yield}</span>
                        <a
                          href={s.footer.linkHref}
                          className="font-label-mono text-sm uppercase tracking-widest text-on-tertiary-container border-b-4 border-on-tertiary-container hover:text-white hover:border-white transition-colors"
                        >
                          {s.footer.linkText}
                        </a>
                      </div>
                    )}
                  </div>
                );
                return (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                    {s.reverse ? (
                      <>
                        {textBlock}
                        {figureBlock}
                      </>
                    ) : (
                      <>
                        {figureBlock}
                        {textBlock}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section id="manifesto-grunge" className="full-bleed-grunge py-32 px-gutter bg-surface-container-lowest border-y-4 border-white relative z-10">
          <div className="absolute inset-0 noise-bg pointer-events-none" />
          <div className="max-w-7xl mx-auto px-gutter relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <aside className="lg:col-span-4">
              <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim block mb-4">// MANIFEST_06</span>
              <h2 className="font-headline-lg text-headline-lg text-white uppercase tracking-tighter leading-[0.95]">
                Five doctrines<br />
                <span className="text-on-tertiary-container">of ordered anarchy.</span>
              </h2>
              <p className="text-secondary mt-6 max-w-md">
                Spray-stenciled in the lab in 2014. Every fragment passes them on the way out. Print, fold, mount above the matrix.
              </p>
              <div className="mt-8 border-2 border-white p-6 bg-on-tertiary-container relative shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <span className="material-symbols-outlined absolute -top-5 -left-3 text-error text-5xl bg-surface-container-lowest px-2">format_quote</span>
                <blockquote className="font-headline-md text-xl italic text-white">
                  "The matrix takes what it is given. The operator takes the blame."
                </blockquote>
                <cite className="font-label-mono text-label-mono not-italic uppercase tracking-[0.3em] text-tertiary-fixed-dim block mt-4">
                  &mdash; BENCH NOTE 014
                </cite>
              </div>
            </aside>
            <ol className="lg:col-span-8 border-t-4 border-white">
              {manifestoAxioms.map((a, i) => (
                <li
                  key={i}
                  className={`grid grid-cols-12 gap-4 py-7 ${a.last ? "" : "border-b-4 border-white"} hover:bg-white/[0.03] transition-colors`}
                >
                  <span className={`col-span-2 lg:col-span-1 font-display-xl text-5xl ${a.numCls} tabular-nums leading-none`}>{a.roman}</span>
                  <div className="col-span-10 lg:col-span-9">
                    <h3 className="font-headline-md text-2xl text-white uppercase mb-2">{a.title}</h3>
                    <p className="text-secondary text-sm">{a.body}</p>
                  </div>
                  <span className="col-span-12 lg:col-span-2 font-label-mono text-[10px] uppercase tracking-widest text-tertiary-fixed-dim self-center lg:text-right">{a.code}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Collective Nodes — trusted-by row with brand marks via simpleicons.org. */}
        <section className="relative py-20 px-gutter z-10 border-b-4 border-dashed border-surface-variant">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between border-b-4 border-white pb-6 mb-12">
              <div>
                <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim block mb-3">// COLLECTIVE_06B</span>
                <h2 className="font-headline-lg text-headline-lg text-white uppercase tracking-tighter">Nodes on the wire.</h2>
              </div>
              <span className="font-label-mono text-label-mono text-secondary hidden md:block">5 NODES · LIVE · MMXXIV</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/15">
              {COLLECTIVE_NODES.map((n) => (
                <a key={n.slug} href="#" className="group bg-black hover:bg-on-tertiary-container transition-colors p-6 md:p-8 flex flex-col items-center justify-center gap-4 border-2 border-transparent hover:border-white">
                  <img src={`https://cdn.simpleicons.org/${n.slug}/c8bfff`} alt={`${n.name} logo`} width="32" height="32" loading="lazy" decoding="async" className="w-8 h-8 md:w-10 md:h-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim group-hover:text-white">{n.name}</span>
                </a>
              ))}
            </div>
            <p className="text-center mt-8 font-label-mono text-[10px] uppercase tracking-[0.3em] text-secondary">// FRAGMENTS POURED FOR THE FOLLOWING NODES THIS QUARTER. SCROLL TO TRANSMUTE.</p>
          </div>
        </section>

        {/* Lab Stack — 4 premium cards explaining the operator's standing equipment. */}
        <section className="full-bleed-grunge py-32 px-gutter bg-surface-container-low border-y-4 border-white relative z-10">
          <div className="absolute inset-0 noise-bg pointer-events-none" />
          <div className="max-w-7xl mx-auto px-gutter relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 pb-6 border-b-4 border-white">
              <div className="max-w-xl">
                <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim block mb-3">// LAB_STACK_06C</span>
                <h2 className="font-headline-lg text-headline-lg text-white uppercase tracking-tighter">Standing equipment.</h2>
              </div>
              <p className="font-body-fixed text-body-fixed text-secondary max-w-md">Four panels bolted to the wall above the matrix. Re-painted every six years; never re-arranged. Print, fold, mount.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white">
              {LAB_STACK.map((s) => (
                <article key={s.roman} className="bg-surface-container p-8 md:p-10 flex flex-col gap-4 border-2 border-transparent hover:border-error hover:bg-black transition-colors min-h-[300px] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="w-14 h-14 border-2 border-white flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(255,180,171,0.6)]">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">{s.icon}</svg>
                    </span>
                    <span className="font-display-xl text-6xl text-white tabular-nums leading-none">{s.roman}</span>
                  </div>
                  <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim">{s.tag}</span>
                  <h3 className="font-headline-md text-2xl text-white uppercase tracking-tighter">{s.title}</h3>
                  <p className="font-body-fixed text-body-fixed text-secondary leading-relaxed">{s.body}</p>
                  <div className="mt-auto pt-4 border-t-4 border-white flex items-center justify-between">
                    <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-error">{s.foot}</span>
                    <span className="font-label-mono text-[10px] uppercase tracking-widest text-tertiary-fixed-dim">[ ARMED ]</span>
                  </div>
                </article>
              ))}
            </div>
            <p className="text-center mt-12 font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim">// PANEL CHECK · DAILY · 06:00 · 14:00 · 21:00</p>
          </div>
        </section>

        {/* Portal FAQ */}
        <section id="portal" className="relative py-32 px-gutter z-10 border-b-4 border-dashed border-surface-variant">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-label-mono text-label-mono uppercase tracking-[0.3em] text-tertiary-fixed-dim block mb-3">// PORTAL_07</span>
              <h2 className="font-headline-lg text-headline-lg text-white uppercase tracking-tighter">Pre-flight checks.</h2>
              <p className="text-secondary mt-4">Five mutters from the queue. Answered by the operator.</p>
            </div>
            <div className="divide-y-4 divide-white border-y-4 border-white bg-surface-container">
              {portalFaqs.map((f, i) =>
                f.open ? (
                  <details key={i} open className="grunge-faq group p-6 md:p-8">
                    <summary className="flex items-center gap-6 list-none">
                      <span className={`font-display-xl text-3xl ${f.numCls} tabular-nums shrink-0 w-12 leading-none`}>{f.num}</span>
                      <h3 className="font-headline-md text-xl md:text-2xl text-white uppercase flex-1">{f.q}</h3>
                      <span className="grunge-glyph text-on-tertiary-container text-3xl shrink-0 leading-none font-thin">+</span>
                    </summary>
                    <div className="pl-16 mt-4 text-secondary" dangerouslySetInnerHTML={{ __html: f.aHtml }} />
                  </details>
                ) : (
                  <details key={i} className="grunge-faq group p-6 md:p-8">
                    <summary className="flex items-center gap-6 list-none">
                      <span className={`font-display-xl text-3xl ${f.numCls} tabular-nums shrink-0 w-12 leading-none`}>{f.num}</span>
                      <h3 className="font-headline-md text-xl md:text-2xl text-white uppercase flex-1">{f.q}</h3>
                      <span className="grunge-glyph text-on-tertiary-container text-3xl shrink-0 leading-none font-thin">+</span>
                    </summary>
                    <div className="pl-16 mt-4 text-secondary" dangerouslySetInnerHTML={{ __html: f.aHtml }} />
                  </details>
                )
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t-4 border-dashed border-neutral-800 py-16 px-10 flex flex-col md:flex-row justify-between items-center gap-12 bg-black z-10 relative mt-32">
          <div className="text-xl font-black text-white font-display-xl italic">ALCHMY</div>
          <div className="flex gap-8 text-[10px] tracking-[0.3em] font-bold uppercase">
            {footerLinks.map((l) => (
              <a key={l} href="#" className="text-neutral-600 hover:text-white hover:line-through transition-all">
                {l}
              </a>
            ))}
          </div>
          <div className="text-[10px] tracking-[0.3em] font-bold uppercase text-neutral-500">
            ALCHMY COLLECTIVE // ORDERED ANARCHY &copy; MMXXIV
          </div>
        </footer>
      </div>
    </>
  );
}
