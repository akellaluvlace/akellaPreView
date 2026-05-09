// Hoisted image URLs reused across sections (per §M.9 — recycle existing aida-public).
const KETTLE_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuChWhipqYxHTfWPFHSnpgGB-42L-Uz4jnMF0wB0mWfjCl-TpQt-wTE7EX9Dm_5xeT4n3w3pi2LzDU3ICTtuS-sqp2Rv1Ye9qFyo8h11vr7BXVe_ecqkoW4Dk8ZDE3GeIKOp5qKQrCgs18APi-vCdqaQ3HnwjNcbqqalVjFyfd5lb17Q9cQNdCDy0vp3Zk1-4EQNO2WJnrKPXIsH2K-N_3rML18OlzIaJMHQv4EjczCY7iQG7m40ZpQI-GYtfADAyaqggVE6ctKWGA4";
const KNIFE_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuApw5u0R2ve0n84DnYERUin6bsv7afid7DMkcK7YM3x_Na6tE7EhJcniwivZCThd9CZZsM4Me9A0EfRRyq_RhIeHwvFrlRAVs05hUGmhUM_k2sFrdrmab3vRG1RPYdgMh02IZesb4HHGelo0QmusL22jY9faLuTGeVXyxs_90tIcTa_MuWhDXB_8AqRQ-jOMi7i28Q0dhNeiZyYxK-V2S5-kQh0K2BjLHMOkeI35cw80_Ycon7S5ZLqYOFa8ZxHKrYxpGCHMGSUaqg";
const LAMP_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuD9Pe8mLUARltj21qOVWd3OKRZ4-H5ymgGBQ4KgqTpElYWtA8yXiCtrtTZd705PiV2Iz36USiN9q-lK_v6etqX2DbclEwhQI6xMNq2KQ81wHczzhDZTM99y2QPyhNK3TlhbfalcqlrHXci8zBt3nEQKtJVAlp8A6Je33_kfiBK6jhjtQyplHjr8kEUdElJWcpCXS9hINQjATvl11mzy8Dn9a7kNPN1LVH64l2zaZcbS6nxSd-t7i9tfG5LuljjX0NxJMoSLQ3zjWSY";
const CHAIR_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDnlRQS88e6hBDdNJiDPHOId_HFKXNlzqGgUOVhu7HVF2w9bJwgYNueQefrlD0JNz37q1DyHxsaaQLSn0jx6uf_5ik74M39Ke-w-IE0_zX8IlLoqG1HTNnnGDBnc8I7tkFt4OY1zxAJUwHpYw_qfAYVvr9Jib_fOOdm2gscq8B-OHj--ol2rnU_BZMawQOehwW64uvzLNWIfAlKt41HMwns4Ze_EJ7tyDG089pJazIC7BAbCHzJOGPhhStyZxuE0rkAEbBN2H70OSU";
const BOWL_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBVMkgUFVKpEkCRr2aLgOmw3EZ2ofFSk--MttCGaXyVaX7yv1f-JirqdObIEXvHyYpebHtzTQ7I4w5bGm7Kt_0NZLY1wBc8ZcWyjGthmku_Yp889-Sg2oPxFofDF6uFDESWB60HBminKDZujEVG1ZQLfVk47pDKnA3zTgq-rZXC7bdGTRfU7O5aqp9oX8OvHx40ookbbJaa9A_KMODPgic1HjLcoQFkU2rDSv7TK7a30myp4qPic4h6dTyb0-HjWV5F4YB9VFRgIFs";
const ATELIER_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFIaLSyr-bW-9SjSjBqhM6b-IhEvFp8v6no2y71y43Y_KC6GU8CFu7EBXE3M1KJiPioCdgRbHXaabvocFNQOyfTvJ-l4Wblvk1USOGSDkdnyjtBqc3Gm6wsQeC1SHPKw-1AYRJZdO4i5gl-xQke40q0tiD8ilCo41xU95k0HfksUfVf_z_y_1E97LZl7Cv_YnhQaiH3Aetsz4W60trVUm1BugdKkrQWYFSmDMn-gfFUQiRT0vJk9b2VcVOtUrf-YGea6bJ17VNNiM";

// Verified Unsplash IDs (§D.1 architecture / heritage subset).
// Image-context cleanup 2026-05-05: removed UNSPLASH_ATELIER / UNSPLASH_KILN / UNSPLASH_PACKING
// per playbook §Q.1 — those IDs depict concrete stair / brutalist corridor / outdoor desert,
// not the alts the template claimed. Process Frame I now uses KNIFE_IMG, Frame III uses
// BOWL_IMG, FAQ left rail uses ATELIER_IMG. UNSPLASH_DAWN kept (architectural perspective).
const UNSPLASH_INTERIOR = "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1400&q=85&auto=format&fit=crop";
const UNSPLASH_WINDOW = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1100&q=85&auto=format&fit=crop";
const UNSPLASH_WINDOW_SM = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop";
const UNSPLASH_DAWN = "https://images.unsplash.com/photo-1618488373960-404fe668e524?w=1920&q=85&auto=format&fit=crop";

const products = [
  { name: "Steel Knife", alt: "Japanese steel chef knife with a dark wooden handle on a pristine off-white background with sharp shadows", src: KNIFE_IMG },
  { name: "Task Lamp", alt: "Architectural black metal desk lamp emitting a warm glow against a stark minimalist white wall", src: LAMP_IMG },
  { name: "Oak Chair", alt: "Sculptural bentwood dining chair with natural oak finish standing alone in a bright gallery-like space", src: CHAIR_IMG },
  { name: "Ceramic Bowl", alt: "Hand-thrown ceramic bowl with matte black glaze resting on a beige plinth under harsh directional light", src: BOWL_IMG },
];

// Lookbook plates — 5 plates + cinema strip; each carries plate roman + title.
const lookbookPlates = [
  { roman: "I",   title: "Morning Room",         span: "md:col-span-7", aspect: "aspect-[4/3]",  src: UNSPLASH_INTERIOR, alt: "A north-facing reading nook with the matte white kettle on a sand-toned linen runner beside a clay mug" },
  { roman: "II",  title: "Long Afternoon",       span: "md:col-span-5", aspect: "aspect-[4/3]",  src: UNSPLASH_WINDOW,   alt: "A bentwood oak chair beside a single tall window casting a long winter afternoon shadow on a sanded floor" },
  { roman: "III", title: "On the Plinth",        span: "md:col-span-4", aspect: "aspect-square", src: BOWL_IMG,          alt: "Hand-thrown ceramic bowl filled with sea salt resting on a sun-warmed plinth" },
  { roman: "IV",  title: "Working Light",        span: "md:col-span-4", aspect: "aspect-square", src: LAMP_IMG,          alt: "Architectural black metal task lamp on a desk with stacked notebooks and a brass paperweight" },
  { roman: "V",   title: "On the Board",         span: "md:col-span-4", aspect: "aspect-square", src: KNIFE_IMG,         alt: "Single Japanese chef knife resting on a folded raw linen napkin on a chestnut chopping board" },
  { roman: "VI",  title: "Long Light, South Wall",   span: "md:col-span-12", aspect: "aspect-[21/9]", src: UNSPLASH_DAWN, alt: "Wide-format architectural perspective — the warm-rust south wall of the atelier washed by long morning light", wide: true },
];

// Selected Pieces — 3 alternating image+content rows. reverse=true flips order at md+.
const selectedPieces = [
  {
    tag: "Piece · 01 — The Kettle",
    headline: "A 1.2 litre vessel for the slow morning.",
    body: "Bone-white enamel over carbon steel, hand-spun in Faenza. Thirty-second pour, no whistle, a base that warms gently to the touch. Designed to live on the counter, not in a cupboard.",
    spec: [
      { dt: "Material", dd: "Enamelled steel · brass" },
      { dt: "Atelier",  dd: "Bottega Vetro, IT" },
      { dt: "Edition",  dd: "200 / yr" },
      { dt: "Lead Time",dd: "3–4 weeks" },
    ],
    price: "$145",
    cta: "Add to Bag",
    src: KETTLE_IMG,
    alt: "The matte white kettle photographed in raking morning light beside a folded raw linen towel",
    reverse: false,
  },
  {
    tag: "Piece · 02 — Oak Chair",
    headline: "Eight steamed staves, one quiet line.",
    body: "European white oak, soaked, bent and cured for ninety days before glue-up. The seat is a single saddled plank. It will out-sit the room you put it in.",
    spec: [
      { dt: "Material", dd: "White oak · oil finish" },
      { dt: "Atelier",  dd: "Studio Holm, DK" },
      { dt: "Edition",  dd: "75 / yr" },
      { dt: "Lead Time",dd: "10 weeks" },
    ],
    price: "$1,420",
    cta: "Reserve",
    src: CHAIR_IMG,
    alt: "The bentwood oak chair photographed three-quarter view against a sun-warmed stone wall",
    reverse: true,
  },
  {
    tag: "Piece · 03 — Task Lamp",
    headline: "Eighty centimetres of architects' light.",
    body: "Sand-cast iron base, brass-pivoted arm, dimmable warm LED. The shade is hand-folded from a single sheet of carbon steel. Designed to disappear into the desk.",
    spec: [
      { dt: "Material", dd: "Iron · brass · steel" },
      { dt: "Atelier",  dd: "Officina Nera, IT" },
      { dt: "Edition",  dd: "120 / yr" },
      { dt: "Lead Time",dd: "5 weeks" },
    ],
    price: "$385",
    cta: "Add to Bag",
    src: LAMP_IMG,
    alt: "The architect task lamp photographed in side elevation, casting a soft pool of light on a paper-covered desk",
    reverse: false,
  },
];

// From the Studio — marquee tiles. Mixed aspect (§N.2 — w-72 portrait + w-80/96 landscape).
const studioTiles = [
  { name: "Bottega Vetro", meta: "Enamelled Steel · IT", ed: "Ed. 200", w: "w-72", aspect: "aspect-[3/4]",   src: KETTLE_IMG, alt: "Bottega Vetro enamelled steel kettle on a sand-toned plinth" },
  { name: "Studio Holm",   meta: "White Oak · DK",       ed: "Ed. 75",  w: "w-80", aspect: "aspect-[16/10]", src: CHAIR_IMG,  alt: "Studio Holm bentwood oak chair, three-quarter view" },
  { name: "Officina Nera", meta: "Cast Iron · IT",       ed: "Ed. 120", w: "w-72", aspect: "aspect-[3/4]",   src: LAMP_IMG,   alt: "Officina Nera task lamp, side elevation" },
  { name: "Atelier Møller", meta: "Steamed Beech · NO",  ed: "Ed. 60",  w: "w-96", aspect: "aspect-[16/10]", src: ATELIER_IMG,alt: "Atelier hands sanding a wood blank" },
  { name: "Casa Terra",    meta: "Stoneware · PT",       ed: "Ed. 240", w: "w-72", aspect: "aspect-[3/4]",   src: BOWL_IMG,   alt: "Hand-thrown ceramic bowl with a matte black glaze" },
  { name: "Hayashi-Ko",    meta: "Layered Steel · JP",   ed: "Ed. 90",  w: "w-80", aspect: "aspect-[16/10]", src: KNIFE_IMG,  alt: "Single Japanese chef knife on a chestnut chopping board" },
  { name: "Maison Lior",   meta: "Linen · FR",           ed: "Ed. 180", w: "w-72", aspect: "aspect-[3/4]",   src: UNSPLASH_WINDOW_SM, alt: "Quiet interior with a single oak chair against a long shadow" },
];

// Process — 4 frames cross-fading. Captions auto-rotate via shared keyframe.
const processFrames = [
  { delay: "0s",  roman: "I",   tag: "Frame I · Matter",    headline: "Forged steel, raw, weighed and stamped.",       img: KNIFE_IMG,    thumb: KNIFE_IMG,    alt: "Frame I — a single forged steel blank resting on the chestnut weighing block at first light" },
  { delay: "4s",  roman: "II",  tag: "Frame II · Cut",      headline: "Sheet pressed, drawn, planished by hand.",      img: ATELIER_IMG,  thumb: ATELIER_IMG,  alt: "Frame II — hands pressing and drawing the sheet at the bench" },
  { delay: "8s",  roman: "III", tag: "Frame III · Finish",  headline: "Bone-white enamel, three slow firings.",        img: BOWL_IMG,     thumb: BOWL_IMG,     alt: "Frame III — a bone-white ceramic body cooling on the plinth between the second and third firings" },
  { delay: "12s", roman: "IV",  tag: "Frame IV · Ship",     headline: "Wrapped in raw linen, packed in cedar.",        img: KETTLE_IMG,   thumb: KETTLE_IMG,   alt: "Frame IV — the finished kettle wrapped in raw linen on a cedar bench" },
];

// FAQ entries — chevron rotates 0→180 (§M.7).
const faqs = [
  { q: "When will my order ship?",            a: "Most pieces are in our atelier and leave within three working days. Made-to-order furniture (the Oak Chair, the Reading Bench) ships in eight to twelve weeks, with a personal note from the maker as the work progresses." },
  { q: "Do you ship internationally?",        a: "Yes — to forty-three countries. Duties are calculated at checkout; we never surprise you at the door. For a country not listed, write to us; we will quote a courier on request." },
  { q: "What is your return policy?",         a: "Thirty days from delivery, free of charge, on every catalogue piece. Made-to-order work is non-returnable but always repairable — for the lifetime of the object, by the maker who built it." },
  { q: "How should I care for these objects?",a: "Each piece arrives with a single folded card from its atelier — written in the maker's hand — describing how to clean, oil and store it. Nothing is delicate, but everything responds to a little attention." },
  { q: "Do you take commissions?",            a: "Occasionally. We take on six private commissions a year — usually furniture or lighting for a single room. Write to commissions@plain.studio with a sentence about the room and we'll reply with a slot." },
];

const footerLinks = ["Privacy", "Archive", "Shipping", "Contact"];

// Custom CSS — keyframes for marquee, cycling image cross-fade, FAQ chevron.
// Per §A: keep custom CSS to non-utility properties only; declare prefers-reduced-motion overrides.
const customCss = `
  html, body { overflow-x: clip; }

  @keyframes plain-marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 12px)); }
  }
  .plain-marquee-track {
    display: flex;
    gap: 24px;
    width: max-content;
    animation: plain-marquee 70s linear infinite;
    will-change: transform;
  }
  .plain-marquee-wrapper:hover .plain-marquee-track { animation-play-state: paused; }

  @keyframes plain-cycle-fade {
    0%, 4%   { opacity: 0; filter: blur(16px) saturate(0.85); transform: scale(1.04); }
    8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);    transform: scale(1); }
    26%, 100%{ opacity: 0; filter: blur(16px) saturate(0.85); transform: scale(1.04); }
  }
  .plain-cycle-img {
    animation: plain-cycle-fade 16s linear infinite;
    opacity: 0;
    filter: blur(16px) saturate(0.85);
    transform: scale(1.04);
    will-change: opacity, filter, transform;
  }
  @keyframes plain-cycle-caption {
    0%, 4%   { opacity: 0; transform: translateY(6px); }
    8%, 22%  { opacity: 1; transform: translateY(0); }
    26%, 100%{ opacity: 0; transform: translateY(-6px); }
  }
  .plain-cycle-caption {
    animation: plain-cycle-caption 16s linear infinite;
    opacity: 0;
    will-change: opacity, transform;
  }
  @keyframes plain-cycle-scrub {
    0%   { transform: scaleX(0); }
    100% { transform: scaleX(1); }
  }
  .plain-cycle-scrub {
    animation: plain-cycle-scrub 16s linear infinite;
    transform-origin: left;
    will-change: transform;
  }
  @keyframes plain-cycle-indicator {
    0%, 4%, 26%, 100% { opacity: 0.25; }
    8%, 22%           { opacity: 1; }
  }
  .plain-cycle-indicator {
    animation: plain-cycle-indicator 16s linear infinite;
    will-change: opacity;
  }

  .plain-faq summary::-webkit-details-marker { display: none; }
  .plain-faq summary { list-style: none; }
  .plain-faq summary .plain-chevron { transition: transform 280ms ease; }
  .plain-faq[open] summary .plain-chevron { transform: rotate(180deg); }

  @media (prefers-reduced-motion: reduce) {
    .plain-marquee-track { animation: none; }
    .plain-cycle-img,
    .plain-cycle-caption,
    .plain-cycle-scrub,
    .plain-cycle-indicator { animation: none; }
    .plain-cycle-img.plain-cycle-rest,
    .plain-cycle-caption.plain-cycle-rest { opacity: 1; filter: none; transform: none; }
    .plain-cycle-indicator.plain-cycle-rest { opacity: 1; }
    .plain-cycle-scrub.plain-cycle-rest { transform: scaleX(1); }
    .plain-faq summary .plain-chevron { transition: none; }
  }
`;

export default function T12MinimalistProductStore() {
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "on-background": "#1c1b1b", "on-tertiary": "#ffffff",
                "secondary-container": "#e6e2da", "tertiary": "#000000",
                "surface-container": "#f1edec", "primary": "#000000",
                "outline": "#747878", "error": "#ba1a1a", "on-secondary": "#ffffff",
                "tertiary-container": "#1c1b1a", "surface-container-low": "#f7f3f2",
                "primary-container": "#1c1b1b", "background": "#fdf8f8",
                "secondary": "#605e58", "surface": "#fdf8f8",
                "on-surface-variant": "#444748", "on-primary": "#ffffff",
                "outline-variant": "#c4c7c7", "on-surface": "#1c1b1b"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "margin-edge": "40px", "section-gap": "160px", "gutter": "20px", "container-max": "1280px", "unit": "4px" },
              fontFamily: {
                "body-md": ["Noto Serif", "serif"], "label": ["Noto Serif", "serif"],
                "h1": ["Noto Serif", "serif"], "h2": ["Noto Serif", "serif"],
                "body-lg": ["Noto Serif", "serif"], "display": ["Noto Serif", "serif"],
                "caption": ["Noto Serif", "serif"]
              },
              fontSize: {
                "body-md": ["12px", { lineHeight: "1.5", fontWeight: "400" }],
                "label": ["10px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "400" }],
                "h2": ["18px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
                "body-lg": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
                "h1": ["24px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
                "display": ["32px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
                "caption": ["9px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "400" }]
              }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="bg-[#F4F0E8] text-[#141414] font-body-md antialiased min-h-screen flex flex-col selection:bg-[#141414] selection:text-[#F4F0E8]">
        <header className="fixed top-0 z-50 w-full bg-[#F4F0E8] border-b border-[#141414]/10">
          <nav className="flex justify-between items-center w-full gap-3 px-4 py-4 max-w-[1920px] mx-auto sm:px-6 sm:py-6 md:px-10 md:py-8">
            <div className="flex gap-4 font-serif tracking-[0.1em] text-[10px] uppercase sm:gap-8">
              <a className="text-[#141414] border-b border-[#141414] pb-1 hover:opacity-70 transition-opacity duration-300 cursor-pointer" href="#">Shop</a>
              <a className="text-[#141414]/60 hover:opacity-70 transition-opacity duration-300 cursor-pointer" href="#">Story</a>
            </div>
            <a className="text-lg font-light tracking-[0.25em] text-[#141414] uppercase absolute left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-500 sm:text-2xl md:text-3xl" href="#">PLAIN</a>
            <div className="flex gap-4 text-[#141414] sm:gap-8">
              {["person", "shopping_bag"].map(icon => (
                <button key={icon} type="button" className="cursor-pointer transition-all duration-500 hover:opacity-70">
                  <span className="material-symbols-outlined">{icon}</span>
                </button>
              ))}
            </div>
          </nav>
        </header>

        <main className="flex-grow pt-[48px] sm:pt-[64px] md:pt-[80px]">
          {/* Hero — full-bleed, taller, editorial. No horizontal padding so the image scales to screen width. */}
          <section className="w-full mb-20 sm:mb-28 md:mb-section-gap">
            <div className="w-full aspect-[3/4] md:aspect-auto md:h-[calc(100vh-80px)] md:min-h-[700px] md:max-h-[1080px] relative overflow-hidden group bg-[#141414]/5">
              <img alt="The matte white Kettle, photographed full-frame on smooth cream Tuscan stone in raking morning light" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" src={KETTLE_IMG} />
              {/* Top-left edition tag */}
              <div className="absolute top-4 left-4 flex items-center gap-3 sm:top-6 sm:left-6 md:top-10 md:left-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#141414]"></span>
                <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]">Edition 02 · Spring 2026</span>
              </div>
              {/* Top-right atelier meta — desktop only */}
              <div className="hidden md:flex absolute top-10 right-10 flex-col items-end gap-1">
                <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">Bottega Vetro</span>
                <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">Faenza, IT</span>
              </div>
              {/* Bottom rail: title + price (left); read CTA (right) */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-4 pb-6 sm:px-6 sm:pb-8 md:flex-row md:items-end md:justify-between md:gap-12 md:px-10 md:pb-10">
                <div className="flex flex-col gap-2">
                  <h2 className="font-display tracking-[-0.025em] leading-[0.95] text-[#141414] text-[48px] sm:text-[72px] md:text-[104px] uppercase">The Kettle.</h2>
                  <p className="font-body-md text-body-md text-[#141414]/70 tracking-widest">$145 · 200 / year · 3–4 weeks</p>
                </div>
                <a className="self-start md:self-end inline-flex items-center gap-2 font-label text-label uppercase tracking-[0.25em] text-[#141414] border-b border-[#141414] pb-1 hover:opacity-70 transition-opacity duration-300" href="#">Read the Object <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
              </div>
            </div>
          </section>

          {/* II — Lookbook (mixed-aspect editorial grid, §I.13) */}
          <section className="w-full max-w-container-max mx-auto px-4 mb-20 sm:px-6 sm:mb-28 md:px-margin-edge md:mb-section-gap">
            <div className="flex items-baseline justify-between mb-10 md:mb-14 gap-6">
              <div className="flex flex-col gap-3">
                <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">— Lookbook · No. 02</span>
                <h2 className="font-display text-display tracking-[-0.02em] text-[#141414]">Quiet rooms, in use.</h2>
              </div>
              <a className="hidden md:inline-flex items-center gap-2 font-label text-label uppercase tracking-[0.25em] text-[#141414] border-b border-[#141414] pb-1 hover:opacity-70 transition-opacity duration-300" href="#">View Full Archive
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              {/* Row 1 — Plate I (col-7) + a column with Plate II (col-5) on top of a Field Note card.
                  The flex-col wrapper auto-stretches to row height (matches Plate I's aspect-[4/3]
                  height); aspect-[4/3] keeps Plate II at its original size and the card uses flex-1
                  to fill the height delta — so no empty white slab below Plate II. */}
              {(() => {
                const p1 = lookbookPlates[0];
                const p2 = lookbookPlates[1];
                return (
                  <>
                    <figure className={`md:col-span-7 relative aspect-[4/3] overflow-hidden bg-[#141414]/5 group`}>
                      <img alt={p1.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" src={p1.src} />
                      <figcaption className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 bg-[#F4F0E8]/90 backdrop-blur-sm px-3 py-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="font-label text-label uppercase tracking-widest text-[#141414]/60">Plate · {p1.roman}</span>
                        <span className="font-body-md text-body-md text-[#141414] tracking-wide">{p1.title}</span>
                      </figcaption>
                    </figure>
                    <div className="md:col-span-5 flex flex-col gap-3 md:gap-4">
                      <figure className="relative aspect-[4/3] overflow-hidden bg-[#141414]/5 group">
                        <img alt={p2.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" src={p2.src} />
                        <figcaption className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 bg-[#F4F0E8]/90 backdrop-blur-sm px-3 py-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <span className="font-label text-label uppercase tracking-widest text-[#141414]/60">Plate · {p2.roman}</span>
                          <span className="font-body-md text-body-md text-[#141414] tracking-wide">{p2.title}</span>
                        </figcaption>
                      </figure>
                      {/* Field Note card — fills the empty space below Plate II so the row reads square. */}
                      <aside className="relative flex-1 min-h-[120px] flex flex-col justify-between gap-4 p-5 md:p-6 border border-[#141414]/15 bg-[#F4F0E8]">
                        <div className="flex flex-col gap-2">
                          <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">— Field Note · No. 02</span>
                          <h3 className="font-h2 text-h2 text-[#141414] leading-snug">Each room is one edition.</h3>
                        </div>
                        <p className="font-body-md text-body-md text-[#141414]/70 leading-relaxed">Photographed in the season the room was finished — never staged, never relit, never re-shot for the catalogue.</p>
                        <a className="inline-flex items-center gap-2 font-label text-label uppercase tracking-[0.25em] text-[#141414] border-b border-[#141414] pb-1 self-start hover:opacity-70 transition-opacity duration-300" href="#">The Field Notes <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
                      </aside>
                    </div>
                  </>
                );
              })()}
              {/* Remaining plates: III, IV, V (squares) + VI (cinema strip) */}
              {lookbookPlates.slice(2).map(p => (
                <figure key={p.roman} className={`${p.span} relative ${p.aspect} overflow-hidden bg-[#141414]/5 group`}>
                  <img alt={p.alt} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${p.wide ? "group-hover:scale-[1.02]" : "group-hover:scale-[1.03]"}`} src={p.src} />
                  <figcaption className={`absolute ${p.wide ? "left-6 bottom-6 sm:left-10 sm:bottom-10" : "left-4 bottom-4 sm:left-6 sm:bottom-6"} bg-[#F4F0E8]/90 backdrop-blur-sm px-3 py-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                    <span className="font-label text-label uppercase tracking-widest text-[#141414]/60">Plate · {p.roman}</span>
                    <span className="font-body-md text-body-md text-[#141414] tracking-wide">{p.title}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* III — Product Grid (existing 2x2) */}
          <section className="w-full max-w-container-max mx-auto px-4 mb-20 sm:px-6 sm:mb-28 md:px-margin-edge md:mb-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141414]/10 border-y border-[#141414]/10">
              {products.map(p => (
                <div key={p.name} className="bg-[#F4F0E8] aspect-[4/5] relative group cursor-pointer overflow-hidden">
                  <img alt={p.alt} className="w-full h-full object-cover p-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" src={p.src} />
                  <div className="absolute inset-0 bg-[#F4F0E8]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="font-label text-label uppercase tracking-widest text-[#141414]">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* IV — Selected Pieces (3 alternating image+content rows, §M.1.2 / §H.1) */}
          <section className="w-full max-w-container-max mx-auto px-4 mb-20 sm:px-6 sm:mb-28 md:px-margin-edge md:mb-section-gap">
            <div className="flex flex-col gap-2 mb-12 md:mb-16">
              <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">— Selected Pieces · No. 03</span>
              <h2 className="font-display text-display tracking-[-0.02em] text-[#141414] max-w-2xl">Three objects, three rooms.</h2>
              <p className="font-body-lg text-body-lg text-[#141414]/70 leading-relaxed max-w-xl mt-3">A close look at the pieces we keep returning to. Each one made by a single atelier we trust, in editions small enough to count by hand.</p>
            </div>
            <div className="flex flex-col gap-20 md:gap-28">
              {selectedPieces.map(piece => {
                const figureOrder = piece.reverse ? "md:order-2" : "";
                const textOrder   = piece.reverse ? "md:order-1" : "";
                return (
                  <article key={piece.tag} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <figure className={`md:col-span-7 ${figureOrder} relative aspect-[5/4] overflow-hidden bg-[#141414]/5`}>
                      <img alt={piece.alt} className="absolute inset-0 w-full h-full object-cover" src={piece.src} />
                    </figure>
                    <div className={`md:col-span-5 ${textOrder} flex flex-col gap-5`}>
                      <span className="font-label text-label uppercase tracking-[0.25em] text-[#141414]/60">{piece.tag}</span>
                      <h3 className="font-h1 text-h1 tracking-[-0.01em] text-[#141414]">{piece.headline}</h3>
                      <p className="font-body-md text-body-md text-[#141414]/75 leading-relaxed">{piece.body}</p>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[#141414]/10 pt-5 text-[#141414]">
                        {piece.spec.map(s => (
                          <div key={s.dt} className="flex flex-col gap-1">
                            <dt className="font-label text-label uppercase tracking-widest text-[#141414]/50">{s.dt}</dt>
                            <dd className="font-body-md text-body-md">{s.dd}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="flex items-center justify-between mt-2">
                        <span className="inline-flex items-center px-3 py-1.5 border border-[#141414]/30 font-label text-label uppercase tracking-widest text-[#141414]">{piece.price}</span>
                        <a className="inline-flex items-center gap-2 font-label text-label uppercase tracking-[0.25em] text-[#141414] border-b border-[#141414] pb-1 hover:opacity-70 transition-opacity duration-300" href="#">{piece.cta} <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* V — Editorial (existing) */}
          <section className="w-full mb-20 sm:mb-28 md:mb-section-gap">
            <div className="w-full aspect-[4/5] md:h-[614px] md:aspect-auto md:min-h-[500px]">
              <img alt="Close up of artisan hands sanding a wooden furniture piece in a dust-filled workshop lit by natural window light" className="w-full h-full object-cover grayscale opacity-80" src={ATELIER_IMG} />
            </div>
            <div className="max-w-[600px] mx-auto px-4 mt-12 text-center sm:px-6 sm:mt-16 md:px-margin-edge md:mt-20">
              <p className="font-body-lg text-body-lg text-[#141414] leading-relaxed">
                We believe in the enduring quality of essential forms. Every object we offer is stripped of unnecessary ornamentation, designed to serve its purpose quietly and beautifully for generations.
              </p>
            </div>
          </section>

          {/* VI — From the Studio — paused-on-hover marquee strip (§I.5 / §K.6 / §M.8) */}
          <section className="w-full mb-20 sm:mb-28 md:mb-section-gap">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-edge mb-10 md:mb-14">
              <div className="flex items-baseline justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">— From the Studio · No. 05</span>
                  <h2 className="font-display text-display tracking-[-0.02em] text-[#141414] max-w-xl">Recent ateliers, in passing.</h2>
                </div>
                <span className="hidden md:inline-flex items-center gap-2 font-label text-label uppercase tracking-widest text-[#141414]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141414]/40"></span>
                  Pause on hover
                </span>
              </div>
            </div>
            <div className="plain-marquee-wrapper relative w-full overflow-hidden py-3">
              <div className="plain-marquee-track">
                {[...studioTiles, ...studioTiles].map((t, i) => {
                  const dup = i >= studioTiles.length;
                  return (
                    <figure
                      key={`tile-${i}`}
                      aria-hidden={dup ? "true" : undefined}
                      className={`shrink-0 ${t.w} ${t.aspect} relative overflow-hidden bg-[#141414]/5 border border-[#141414]/10`}
                    >
                      <img alt={dup ? "" : t.alt} className="absolute inset-0 w-full h-full object-cover grayscale" src={t.src} />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-[#F4F0E8]/95 backdrop-blur-sm px-4 py-3 flex items-baseline justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-body-md text-body-md text-[#141414] tracking-wide">{t.name}</span>
                          <span className="font-label text-label uppercase tracking-widest text-[#141414]/50">{t.meta}</span>
                        </div>
                        <span className="font-label text-label uppercase tracking-widest text-[#141414]/70">{t.ed}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </section>

          {/* VII — Process — auto-cycling cross-fade with sticky rail (§M.2 + §M.15) */}
          <section className="w-full max-w-container-max mx-auto px-4 mb-20 sm:px-6 sm:mb-28 md:px-margin-edge md:mb-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
              {/* Sticky rail */}
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start flex flex-col gap-6">
                <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">— Process · No. 06</span>
                <h2 className="font-display text-display tracking-[-0.02em] text-[#141414]">From the matter to the room.</h2>
                <p className="font-body-md text-body-md text-[#141414]/75 leading-relaxed">Every PLAIN object passes through four ateliers before it reaches you. We photograph the work as it travels — these are four frames from the kettle's last edition.</p>
                {/* Auto-rotating caption stack */}
                <div className="relative min-h-[88px]">
                  {processFrames.map((f, i) => (
                    <div
                      key={f.delay}
                      className={`plain-cycle-caption ${i === 0 ? "plain-cycle-rest" : ""} absolute inset-0 flex flex-col gap-1`}
                      style={{ animationDelay: f.delay }}
                    >
                      <span className="font-label text-label uppercase tracking-widest text-[#141414]/50">{f.tag}</span>
                      <span className="font-h2 text-h2 text-[#141414]">{f.headline}</span>
                    </div>
                  ))}
                </div>
                {/* Scrubber */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1 h-px bg-[#141414]/15 relative overflow-hidden">
                    <div className="plain-cycle-scrub plain-cycle-rest absolute inset-0 origin-left bg-[#141414]"></div>
                  </div>
                  <span className="font-label text-label uppercase tracking-widest text-[#141414]/50 tabular-nums">04 frames · 16s</span>
                </div>
                <a className="inline-flex items-center gap-2 font-label text-label uppercase tracking-[0.25em] text-[#141414] border-b border-[#141414] pb-1 hover:opacity-70 transition-opacity duration-300 self-start mt-2" href="#">Read the Whole Process <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
              </div>
              {/* Cycling image */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[#141414]/5">
                  {processFrames.map((f, i) => (
                    <img
                      key={f.delay}
                      alt={f.alt}
                      className={`plain-cycle-img ${i === 0 ? "plain-cycle-rest" : ""} absolute inset-0 w-full h-full object-cover grayscale`}
                      src={f.img}
                      style={{ animationDelay: f.delay }}
                    />
                  ))}
                  <span className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#F4F0E8]/90 backdrop-blur-sm px-3 py-1.5 font-label text-label uppercase tracking-widest text-[#141414]/70">Frame · I — IV</span>
                </div>
                {/* Synced indicator strip — 4 mini thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  {processFrames.map((f, i) => (
                    <div
                      key={f.delay}
                      className={`plain-cycle-indicator ${i === 0 ? "plain-cycle-rest" : ""} relative aspect-[4/3] overflow-hidden bg-[#141414]/5`}
                      style={{ animationDelay: f.delay }}
                    >
                      <img alt="" className="absolute inset-0 w-full h-full object-cover grayscale" src={f.thumb} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* VIII — FAQ — native <details> accordion (§M.7), chevron rotates 0→180 */}
          <section className="w-full max-w-container-max mx-auto px-4 mb-20 sm:px-6 sm:mb-28 md:px-margin-edge md:mb-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
              {/* Left rail */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">— Notes · No. 07</span>
                <h2 className="font-display text-display tracking-[-0.02em] text-[#141414]">Common questions, answered plainly.</h2>
                <p className="font-body-md text-body-md text-[#141414]/70 leading-relaxed">If your question isn't here, our small team replies in person within one working day.</p>
                <figure className="relative aspect-[4/5] overflow-hidden bg-[#141414]/5 mt-2">
                  <img alt="Hands at the Faenza atelier bench — every piece that leaves the studio passes through this workshop first" className="absolute inset-0 w-full h-full object-cover grayscale" src={ATELIER_IMG} />
                  <figcaption className="absolute left-4 bottom-4 bg-[#F4F0E8]/90 backdrop-blur-sm px-3 py-2 font-label text-label uppercase tracking-widest text-[#141414]/70">Workshop · Faenza</figcaption>
                </figure>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#141414]/10 pt-5">
                  {[
                    { dt: "Reply",   dd: "≤ 24 hrs" },
                    { dt: "Returns", dd: "30 days, free" },
                    { dt: "Ships",   dd: "Worldwide" },
                    { dt: "Care",    dd: "By hand, lifetime" },
                  ].map(s => (
                    <div key={s.dt} className="flex flex-col gap-1">
                      <dt className="font-label text-label uppercase tracking-widest text-[#141414]/50">{s.dt}</dt>
                      <dd className="font-body-md text-body-md text-[#141414]">{s.dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {/* Right rail: FAQ list + disclaimer card. flex-col + flex-1 on the disclaimer so its
                  height stretches to match the left rail's bottom (image + meta dl is much taller
                  than 5 collapsed FAQ rows). */}
              <div className="md:col-span-8 flex flex-col">
                <div className="divide-y divide-[#141414]/15 border-y border-[#141414]/15">
                  {faqs.map(item => (
                    <details key={item.q} className="plain-faq group py-6 px-1">
                      <summary className="flex items-baseline justify-between gap-6 cursor-pointer">
                        <h3 className="font-h2 text-h2 text-[#141414]">{item.q}</h3>
                        <span className="plain-chevron material-symbols-outlined text-[#141414]/70 text-[20px] shrink-0">expand_more</span>
                      </summary>
                      <p className="font-body-md text-body-md text-[#141414]/75 leading-relaxed mt-4 max-w-2xl">{item.a}</p>
                    </details>
                  ))}
                </div>
                <aside className="mt-8 md:mt-10 flex-1 flex flex-col gap-5 p-6 md:p-8 border border-[#141414]/15 bg-[#141414]/[0.025]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#141414]/60 text-[20px]">info</span>
                    <span className="font-label text-label uppercase tracking-[0.3em] text-[#141414]/60">— A note on plainness</span>
                  </div>
                  <p className="font-body-md text-body-md text-[#141414]/75 leading-relaxed max-w-2xl">
                    We do not run sales. We do not stock anything we wouldn't keep ourselves. Every piece is photographed where it was made — never on a white seamless, never with a stock background. If a piece you'd like is sold out, write to us; the next edition is always being planned.
                  </p>
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 border-t border-[#141414]/10 pt-5 mt-auto">
                    <div className="flex flex-col gap-1">
                      <dt className="font-label text-label uppercase tracking-widest text-[#141414]/50">Studio</dt>
                      <dd className="font-body-md text-body-md text-[#141414]">studio@plain.studio</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-label text-label uppercase tracking-widest text-[#141414]/50">Phone</dt>
                      <dd className="font-body-md text-body-md text-[#141414]">+39 0546 21 04</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-label text-label uppercase tracking-widest text-[#141414]/50">Hours</dt>
                      <dd className="font-body-md text-body-md text-[#141414]">Mon–Fri · 09–17 CET</dd>
                    </div>
                  </dl>
                </aside>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#F4F0E8] border-t border-[#141414]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-4 py-12 gap-10 max-w-[1920px] mx-auto sm:px-6 sm:py-16 sm:gap-12 md:px-10 md:py-20 md:gap-16">
            <div className="flex flex-col gap-8 max-w-sm">
              <div className="text-xl font-light tracking-widest text-[#141414] uppercase">PLAIN</div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-label text-label text-[#141414]/60 uppercase tracking-widest absolute -top-6" htmlFor="email">Newsletter</label>
                <input className="bg-transparent border-0 border-b border-[#141414]/20 focus:border-[#141414] focus:ring-0 px-0 py-2 font-body-md text-body-md text-[#141414] placeholder:text-[#141414]/30 transition-colors w-full rounded-none" id="email" placeholder="Email Address" type="email" />
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-12">
              <div className="flex flex-wrap gap-8 font-serif tracking-widest text-[9px] uppercase leading-relaxed text-[#141414]/40">
                {footerLinks.map(l => (
                  <a key={l} className="hover:text-[#141414] transition-colors duration-300" href="#">{l}</a>
                ))}
              </div>
              <p className="font-serif tracking-widest text-[9px] uppercase leading-relaxed text-[#141414]/40 max-w-xs md:text-right">
                © PLAIN. NO SALES, NO PROMOTIONS, JUST NEW OBJECTS.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
