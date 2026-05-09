const IMG_BUST = "https://images.unsplash.com/photo-1644508047668-9210042f8eaa?w=900&q=85&auto=format&fit=crop";
const IMG_BRUTAL = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop";
const IMG_CIRCUIT = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop";
const IMG_HALL = "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop";
const IMG_RACK = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop";
const IMG_BRASS = "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop";
const IMG_CORNICE = "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1200&q=85&auto=format&fit=crop";
const IMG_RACK_WIDE = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85&auto=format&fit=crop";
const IMG_LEVER = "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop";
const IMG_BRUTAL_WIDE = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=85&auto=format&fit=crop";

export default function T106NeoClassicalEditorial() {
  const navLinks = [
    { label: "Archive" },
    { label: "Terminal", active: true },
    { label: "Clearance" },
    { label: "Uplink" },
  ];
  const atmosphereTiles = [
    { roman: "I", plate: "PLATE · I", title: "The Form", caption: "Bust · MMXXIV", img: IMG_BUST, alt: "monochrome classical marble bust" },
    { roman: "II", plate: "PLATE · II", title: "The Wall", caption: "Concrete · Lattice", img: IMG_BRUTAL, alt: "brutalist architectural concrete detail" },
    { roman: "III", plate: "PLATE · III", title: "The Trace", caption: "Silicon · Vein", img: IMG_CIRCUIT, alt: "circuit board macro photography" },
    { roman: "IV", plate: "PLATE · IV", title: "The Hall", caption: "Cornice · Light", img: IMG_HALL, alt: "minimal interior architecture" },
    { roman: "V", plate: "PLATE · V", title: "The Engine", caption: "Rack · No. 09", img: IMG_RACK, alt: "server rack interior", lastWide: true },
  ];
  const vaultCards = [
    { sec: "SEC-01", icon: "deployed_code", title: "Ontological Framing", body: "Structuring disparate data into cohesive semantic architecture. Utilizing advanced typographical hierarchies to forge immediate cognitive resonance." },
    { sec: "SEC-02", icon: "view_in_ar", title: "Isometric Construct", body: "Projecting flat interfaces into multi-dimensional workspaces. Establishing z-axis depth through tactical glassmorphic layering." },
    { sec: "SEC-03", icon: "memory", title: "Neuromorphic UX", body: "Designing interaction patterns that anticipate user intent. Bridging the gap between conscious action and subconscious systemic response." },
  ];
  const platesTiles = [
    { folio: "FOLIO_07", title: "The Form", meta: "Marble · 02:14", img: IMG_BUST, w: "w-72", aspect: "aspect-[3/4]", plate: null, alt: "classical marble bust" },
    { folio: "FOLIO_12", title: "The Wall", meta: "Concrete · Lattice", img: IMG_BRUTAL_WIDE, w: "w-96", aspect: "aspect-[16/10]", plate: "PLATE · II", alt: "brutalist concrete facade" },
    { folio: "FOLIO_19", title: "The Trace", meta: "Silicon · 50µm", img: IMG_CIRCUIT, w: "w-72", aspect: "aspect-[3/4]", plate: null, alt: "circuit board macro" },
    { folio: "FOLIO_24", title: "The Hall", meta: "Cornice · Light", img: IMG_CORNICE, w: "w-80", aspect: "aspect-[16/10]", plate: "PLATE · IV", alt: "minimal architecture interior hall" },
    { folio: "FOLIO_31", title: "The Vessel", meta: "Brass · Apothecary", img: IMG_BRASS, w: "w-72", aspect: "aspect-[3/4]", plate: null, alt: "brass apothecary still life" },
    { folio: "FOLIO_42", title: "The Engine", meta: "Rack · No. 09", img: IMG_RACK_WIDE, w: "w-96", aspect: "aspect-[16/10]", plate: "PLATE · VI", alt: "server rack interior" },
    { folio: "FOLIO_55", title: "The Lever", meta: "Steel · Geared", img: IMG_LEVER, w: "w-72", aspect: "aspect-[3/4]", plate: null, alt: "industrial machinery detail" },
  ];
  const tenets = [
    { roman: "I", num: "01", title: "Reduction precedes refinement.", body: "Subtract before you sculpt. Every flourish carved into a structure that hasn't earned it is a wound on the form beneath." },
    { roman: "II", num: "02", title: "The grid is sacred.", body: "No element exists outside the lattice. Alignment is the lowest form of devotion — and the first one demanded." },
    { roman: "III", num: "03", title: "Typography is structure.", body: "Letterforms are the load-bearing architecture of meaning. Choose them as you would a column — for what they hold, not how they decorate." },
    { roman: "IV", num: "04", title: "Color is consequence.", body: "A palette is earned, not chosen. Each hue must justify its presence against the void, or be returned to it." },
    { roman: "V", num: "05", title: "Motion is purpose.", body: "Transitions reveal hierarchy. Decorative motion is a lie told to distract from a structure that doesn't hold." },
  ];
  const atelierPlates = [
    { roman: "I", img: "https://images.unsplash.com/photo-1644508047668-9210042f8eaa?w=1600&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1644508047668-9210042f8eaa?w=300&q=85&auto=format&fit=crop", delay: "0s", alt: "marble texture monochrome" },
    { roman: "II", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&q=85&auto=format&fit=crop", delay: "4s", alt: "brutalist concrete facade" },
    { roman: "III", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=85&auto=format&fit=crop", delay: "8s", alt: "circuit board macro" },
    { roman: "IV", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1600&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=300&q=85&auto=format&fit=crop", delay: "12s", alt: "industrial instrument detail" },
  ];
  const faqItems = [
    { roman: "I", q: "What does “silent architecture” actually describe?", a: "Silent architecture is the deliberate refusal of decorative noise. We work through reduction first, then refinement. The interface earns each gesture; nothing is granted by default." },
    { roman: "II", q: "Do you take on commissions outside the archive?", a: "Selectively. The atelier admits two private commissions per quarter — typically heritage interfaces, museum work, or bespoke editorial systems. Submissions are reviewed via the uplink page." },
    { roman: "III", q: "Why the cyberpunk register on a classical foundation?", a: "The two languages share a discipline: load-bearing typography, ruthless structure, ornament that must justify itself. Cyan against marble is not a costume — it’s the most honest reading we have of contemporary digital craft." },
    { roman: "IV", q: "How is the archive maintained?", a: "In quiet revisions. New plates are added on the first of each month, indexed against the doctrine, and signed under archive-fragment notation. Older fragments are never deleted — only marked redacted." },
    { roman: "V", q: "Is there a tariff?", a: "Quoted privately, by the work. The atelier publishes ranges only after a brief is in hand. Tier I commissions begin at 36k; tier II archive-grade interfaces at 120k. Heritage-rate clauses are honoured in writing." },
    { roman: "VI", q: "May I visit the floor in person?", a: "The silent floor is not open to public visit. Approved correspondents are received on the second Thursday of each month, by appointment, between fifteen and seventeen hundred hours. The hall is unheated; bring a coat." },
  ];
  const footerLinks = [
    { label: "System Logs" },
    { label: "Privacy Shield" },
    { label: "Terminal Access", highlight: true },
  ];
  const customCss = `
    html, body { overflow-x: clip; }
    .scanline {
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
      background-size: 100% 4px;
      pointer-events: none;
      opacity: 0.05;
    }
    .glass-card {
      background: rgba(32, 31, 31, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(229, 226, 225, 0.1);
    }
    .isometric-tilt {
      transform: rotateX(20deg) rotateY(15deg) rotateZ(-5deg);
      transform-style: preserve-3d;
    }
    .isometric-grid-bg {
      background-image:
        linear-gradient(rgba(0, 219, 233, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 219, 233, 0.05) 1px, transparent 1px);
      background-size: 48px 48px;
      transform: perspective(1000px) rotateX(60deg) scale(2);
      transform-origin: top center;
    }

    .nc-frame {
      border: 1px solid rgba(0, 219, 233, 0.18);
      box-shadow: inset 0 0 0 1px rgba(229, 226, 225, 0.04);
    }
    .nc-frame img { transition: filter 900ms ease, opacity 900ms ease, transform 1200ms ease; }
    .nc-frame:hover img { filter: grayscale(0); opacity: 1; transform: scale(1.03); }

    .plates-track {
      display: flex;
      gap: 24px;
      width: max-content;
      animation: plates-x 65s linear infinite;
      padding: 12px 0;
    }
    .plates-track:hover { animation-play-state: paused; }
    @keyframes plates-x {
      0%   { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 12px)); }
    }

    @keyframes atelier-fade {
      0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
      8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);   transform: scale(1); }
      26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
    }
    .atelier-cycle {
      animation: atelier-fade 16s linear infinite;
      opacity: 0;
      filter: blur(18px) saturate(0.8);
      transform: scale(1.04);
      will-change: opacity, filter, transform;
    }
    @keyframes atelier-indicator {
      0%, 4%   { opacity: 0.25; }
      8%, 22%  { opacity: 1; }
      26%, 100%{ opacity: 0.25; }
    }
    .atelier-indicator { animation: atelier-indicator 16s linear infinite; }
    @keyframes atelier-scrub {
      0%   { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }
    .atelier-scrub { animation: atelier-scrub 16s linear infinite; transform-origin: left; }

    .nc-faq summary::-webkit-details-marker { display: none; }
    .nc-faq summary { list-style: none; cursor: pointer; }
    .nc-faq summary .nc-chevron { transition: transform 250ms ease; }
    .nc-faq[open] summary .nc-chevron { transform: rotate(90deg); }

    @media (prefers-reduced-motion: reduce) {
      .plates-track { animation: none; }
      .atelier-cycle { animation: none; opacity: 1; filter: none; transform: none; }
      .atelier-cycle:not(:first-of-type) { display: none; }
      .atelier-indicator { animation: none; opacity: 1; }
      .atelier-scrub { animation: none; transform: scaleX(1); }
      .nc-faq summary .nc-chevron { transition: none; }
      .nc-frame img { transition: none; }
    }
  `;
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;500;600&family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#c8c6c7", "on-primary": "#313031",
                "primary-container": "#0a0a0b", "on-primary-container": "#7a797a",
                "tertiary": "#00dbe9", "on-tertiary": "#00363a",
                "tertiary-fixed": "#7df4ff", "tertiary-fixed-dim": "#00dbe9",
                "tertiary-container": "#000c0e", "on-tertiary-container": "#00868f",
                "on-tertiary-fixed": "#002022",
                "surface": "#141313", "on-surface": "#e5e2e1", "on-surface-variant": "#c7c6ca",
                "surface-container-lowest": "#0e0e0e", "surface-container-low": "#1c1b1b",
                "surface-container": "#201f1f", "surface-container-high": "#2b2a2a",
                "surface-container-highest": "#353434",
                "surface-variant": "#353434",
                "outline": "#919094", "outline-variant": "#46464a",
                "background": "#141313", "on-background": "#e5e2e1",
                "error": "#ffb4ab"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "gutter": "24px", "margin": "48px", "unit": "4px" },
              fontFamily: {
                "body-classic": ["Noto Serif"], "label-caps": ["Space Grotesk"],
                "meta-code": ["Space Grotesk"], "h1-editorial": ["Newsreader"], "h2-heading": ["Newsreader"]
              },
              fontSize: {
                "body-classic": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
                "label-caps": ["0.75rem", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "700" }],
                "meta-code": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "500" }],
                "h1-editorial": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
                "h2-heading": ["2.5rem", { lineHeight: "1.2", fontWeight: "500" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-background text-on-background font-body-classic antialiased min-h-screen relative overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary-fixed">
        <div className="fixed inset-0 z-50 scanline mix-blend-overlay" />
        <nav className="fixed top-0 w-full z-40 bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl shadow-cyan-900/10">
          <div className="flex justify-between items-center h-20 px-12 w-full mx-auto max-w-7xl">
            <div className="text-2xl font-serif font-bold tracking-widest text-zinc-50 uppercase">DESIGN ALCHEMY</div>
            <div className="hidden md:flex items-center space-x-8 font-serif italic tracking-wide text-zinc-100">
              {navLinks.map((l) => (
                <a key={l.label} href="#" className={l.active
                  ? "text-cyan-400 border-b-2 border-cyan-400 pb-1 px-3 py-2 opacity-80 scale-95 transition-transform"
                  : "text-zinc-400 hover:text-zinc-100 transition-all duration-300 hover:bg-zinc-800/50 hover:text-cyan-300 px-3 py-2 rounded"
                }>{l.label}</a>
              ))}
            </div>
            <button className="bg-surface-container-high border border-outline-variant text-on-surface font-label-caps text-label-caps px-6 py-3 hover:shadow-[0_0_15px_rgba(0,219,233,0.3)] hover:border-tertiary transition-all duration-300 flex items-center gap-2">
              Initialize
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </nav>
        <main className="relative pt-20">
          <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden border-b border-surface-container-high">
            <div className="absolute inset-0 z-0 bg-surface-container-lowest">
              <img alt="Background Texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqReGIWuaPONeGZQ-Ky5GpfNU8N_xPp2bJc4tVjV5pk8Y3xcaPxhKWpq1iXz1s2znctLDuKcuuD1xck95-jpWcFHvMA_7dXzQlK4WjFomeXhl1Kbt1Hl5CEHA6VRmwrIcjEPEmkVV0J7QSrK9XHNKqjNKMOudzHPp0ALdq8Dl6xC3Hn-WFCtahUtuhmTQyuQd0lgnYQ9uaDCEzlKWlvs4riPZhXGV4dg0Lw71SBXwrK17Clotu0NYvl0BbIOVKR8OTqZG_i5fNvNc" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-[#ff00ff]/10 to-transparent mix-blend-color-dodge pointer-events-none" />
            <div className="relative z-10 text-center max-w-4xl px-gutter mx-auto">
              <div className="font-meta-code text-meta-code text-tertiary mb-6 tracking-[0.2em] uppercase">Manifesto // 001</div>
              <h1 className="font-h1-editorial text-h1-editorial text-on-surface mb-8 drop-shadow-lg">
                THE ARCHITECTS OF SILENCE
              </h1>
              <p className="font-body-classic text-body-classic text-on-surface-variant max-w-2xl mx-auto mb-12">
                Forging digital heritage from the void. A neo-antique synthesis of classical erudition and cyberpunk precision. We do not design; we architect silence.
              </p>
              <button className="bg-primary-container text-on-primary-container border border-outline font-label-caps text-label-caps px-8 py-4 hover:border-tertiary hover:shadow-[0_0_20px_rgba(0,219,233,0.4)] transition-all duration-500 relative overflow-hidden group">
                <span className="relative z-10">COMMENCE SEQUENCE</span>
                <div className="absolute inset-0 bg-tertiary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
            <div className="absolute left-margin top-1/2 -translate-y-1/2 rotate-180 font-meta-code text-meta-code text-surface-variant hidden lg:block tracking-widest">
              SYS.CORE.V.9.4.2 // ALCHEMY
            </div>
          </section>
          <section className="py-32 relative px-gutter max-w-7xl mx-auto z-10 border-t border-surface-container-high">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <div className="font-meta-code text-meta-code text-tertiary mb-4 tracking-[0.2em] uppercase">Atmosphere // 002</div>
                <h2 className="font-h2-heading text-h2-heading text-on-surface leading-tight max-w-xl">
                  Five plates from the <span className="italic text-tertiary">silent floor</span>.
                </h2>
              </div>
              <p className="font-body-classic text-body-classic text-on-surface-variant max-w-md italic leading-relaxed">
                Photographic record of the chambers, fragments and figures we work amongst. Captured in monochrome; rendered in their true register on hover.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
              {atmosphereTiles.map((t) => (
                <figure key={t.roman} className={`group ${t.lastWide ? "col-span-2 md:col-span-1" : ""}`}>
                  <div className="nc-frame relative aspect-[3/4] overflow-hidden bg-surface-container-lowest">
                    <img alt={t.alt} src={t.img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <span className="font-label-caps text-label-caps text-on-surface uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">{t.title}</span>
                      <span className="font-meta-code text-meta-code text-tertiary/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">{t.plate}</span>
                    </div>
                  </div>
                  <figcaption className="mt-3 flex items-baseline gap-2 font-meta-code text-meta-code text-on-surface-variant">
                    <span className="text-tertiary tabular-nums">{t.roman}</span>
                    <span className="flex-1 border-b border-dotted border-outline-variant/60 mb-1" />
                    <span className="italic">{t.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 font-meta-code text-meta-code text-on-surface-variant tracking-[0.15em] uppercase opacity-70">
              Photographs by House &nbsp;//&nbsp;  Floor No. 02 &nbsp;//&nbsp;  MMXXIV
            </div>
          </section>
          <section className="py-32 relative px-gutter max-w-7xl mx-auto z-10">
            <div className="text-center mb-20">
              <h2 className="font-h2-heading text-h2-heading text-on-surface mb-4">The Vault</h2>
              <div className="h-px w-24 bg-tertiary mx-auto opacity-50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vaultCards.map((c) => (
                <div key={c.sec} className="glass-card p-8 relative group hover:-translate-y-2 transition-transform duration-500">
                  <div className="absolute top-4 right-4 font-meta-code text-meta-code text-tertiary/50">{c.sec}</div>
                  <div className="mb-6 h-16 w-16 flex items-center justify-center border border-surface-container-highest rounded-lg bg-surface-container shadow-[0_0_15px_rgba(0,219,233,0.1)] group-hover:shadow-[0_0_25px_rgba(0,219,233,0.3)] transition-shadow">
                    <span className="material-symbols-outlined text-tertiary text-3xl">{c.icon}</span>
                  </div>
                  <h3 className="font-h2-heading text-2xl text-on-surface mb-4">{c.title}</h3>
                  <p className="font-meta-code text-meta-code text-on-surface-variant leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </section>
          {/* NEW SECTION 1 — "Specimens" — 6 study cards with material-symbols icons + meta */}
          <section className="py-32 relative px-gutter max-w-7xl mx-auto z-10 border-t border-surface-container-high">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <div className="font-meta-code text-meta-code text-tertiary mb-4 tracking-[0.2em] uppercase">Specimens // 003</div>
                <h2 className="font-h2-heading text-h2-heading text-on-surface leading-tight max-w-xl">
                  Six studies in <span className="italic text-tertiary">applied silence</span>.
                </h2>
              </div>
              <p className="font-body-classic text-body-classic text-on-surface-variant max-w-md italic leading-relaxed">
                Working files from the archive — interface forensics, typographic post-mortems, and the occasional note left in the margin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[
                { icon: "format_align_left", code: "SPEC-01", title: "Marginalia", body: "A study of footnote density across six issues — what the body refused to say, recorded in 8pt." },
                { icon: "grid_3x3", code: "SPEC-02", title: "Lattice forensics", body: "Reverse-engineering the Swiss grid behind a 1968 catalogue raisonné. Twelve columns, two gutters, no apologies." },
                { icon: "auto_stories", code: "SPEC-03", title: "Folio breath", body: "Whitespace as load-bearing architecture. Measured against three reference editions; documented in millimetres." },
                { icon: "tune", code: "SPEC-04", title: "Hue restraint", body: "An audit of every colour the atelier has ever shipped. The palette is a confession; the swatch is the receipt." },
                { icon: "schema", code: "SPEC-05", title: "Hierarchy report", body: "Twelve interfaces stripped to their headers. The skeleton tells more than the skin ever did." },
                { icon: "draft", code: "SPEC-06", title: "Redacted draft", body: "Cuts from the doctrine. Returned to the archive, indexed and signed under archive-fragment notation." },
              ].map((s) => (
                <article key={s.code} className="border border-surface-container-high bg-surface-container-low p-6 flex flex-col gap-4 hover:border-tertiary/60 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 border border-surface-container-high bg-surface-container flex items-center justify-center text-tertiary group-hover:shadow-[0_0_20px_rgba(0,219,233,0.25)] transition-shadow">
                      <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
                    </div>
                    <span className="font-meta-code text-meta-code text-tertiary/60 tabular-nums">{s.code}</span>
                  </div>
                  <h3 className="font-h2-heading italic text-on-surface text-2xl leading-tight">{s.title}</h3>
                  <p className="font-meta-code text-meta-code text-on-surface-variant leading-relaxed flex-1">{s.body}</p>
                  <div className="flex items-center justify-between border-t border-surface-container-high pt-3 mt-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Open file</span>
                    <span className="material-symbols-outlined text-tertiary text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="py-24 relative z-10 border-t border-surface-container-high overflow-hidden">
            <div className="px-gutter max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="font-meta-code text-meta-code text-tertiary mb-4 tracking-[0.2em] uppercase">Witnessed // 004</div>
                <h2 className="font-h2-heading text-h2-heading text-on-surface leading-tight max-w-xl">
                  A reading-room of <span className="italic text-tertiary">borrowed plates</span>.
                </h2>
              </div>
              <p className="font-body-classic text-body-classic text-on-surface-variant max-w-md italic leading-relaxed">
                Hover to pause. Each plate is a fragment from the open archive — material studies, architectural witnesses, instruments at rest.
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 z-20 pointer-events-none bg-gradient-to-r from-background to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-24 z-20 pointer-events-none bg-gradient-to-l from-background to-transparent" />
              <div className="plates-track">
                {[...platesTiles, ...platesTiles].map((p, i) => {
                  const dup = i >= platesTiles.length;
                  return (
                    <figure key={`p-${i}`} aria-hidden={dup ? "true" : undefined} className={`relative ${p.w} ${p.aspect} shrink-0 overflow-hidden nc-frame bg-surface-container-lowest`}>
                      <img alt={dup ? "" : p.alt} src={p.img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/5 to-transparent" />
                      {p.plate ? (
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                          <div>
                            <div className="font-meta-code text-meta-code text-tertiary mb-1">[ {p.folio} ]</div>
                            <div className="font-h2-heading italic text-on-surface text-xl leading-tight">{p.title}</div>
                            <div className="font-meta-code text-meta-code text-on-surface-variant mt-1">{p.meta}</div>
                          </div>
                          <span className="font-label-caps text-label-caps text-tertiary/80">{p.plate}</span>
                        </div>
                      ) : (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="font-meta-code text-meta-code text-tertiary mb-1">[ {p.folio} ]</div>
                          <div className="font-h2-heading italic text-on-surface text-xl leading-tight">{p.title}</div>
                          <div className="font-meta-code text-meta-code text-on-surface-variant mt-1">{p.meta}</div>
                        </div>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          </section>
          <section className="py-32 relative px-gutter max-w-7xl mx-auto z-10 border-t border-surface-container-high">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-stretch">
              <div className="md:col-span-5 flex flex-col md:h-full md:justify-between gap-10">
                <div>
                  <div className="font-meta-code text-meta-code text-tertiary mb-6 tracking-[0.2em] uppercase">Doctrine // 002</div>
                  <h2 className="font-h2-heading text-h2-heading text-on-surface mb-8 leading-tight">
                    Five tenets of <span className="italic text-tertiary">silent architecture</span>.
                  </h2>
                  <p className="font-body-classic text-body-classic text-on-surface-variant mb-10">
                    These principles are not negotiable. They form the substrate upon which every interface, every transmission, every artifact is built. Departure from them is heresy against the void.
                  </p>
                  <blockquote className="font-meta-code text-meta-code text-tertiary/80 border-l-2 border-tertiary/40 pl-6 italic leading-relaxed">
                    "Silence is not absence. It is the deliberate refusal of noise — the loudest statement an interface can make."
                    <cite className="block not-italic font-label-caps text-label-caps text-on-surface-variant mt-3 tracking-widest">— ARCHIVE FRAGMENT &nbsp;//&nbsp;  REDACTED</cite>
                  </blockquote>
                </div>
                {/* Bottom-aligned card — three principle markers, fills empty space, aligns with the 5 tenets on the right */}
                <div className="border border-surface-container-high bg-surface-container-low p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                    <span className="font-label-caps text-label-caps text-tertiary tracking-widest">— Discipline Index</span>
                    <span className="font-meta-code text-meta-code text-on-surface-variant tabular-nums">SEC-002</span>
                  </div>
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-baseline gap-3">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">grid_view</span>
                      <span className="flex-1 font-meta-code text-meta-code text-on-surface">Lattice precedes ornament.</span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">format_letter_spacing</span>
                      <span className="flex-1 font-meta-code text-meta-code text-on-surface">Typography is structure, not surface.</span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">palette</span>
                      <span className="flex-1 font-meta-code text-meta-code text-on-surface">Every hue earns its position.</span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">schedule</span>
                      <span className="flex-1 font-meta-code text-meta-code text-on-surface">Motion serves hierarchy alone.</span>
                    </li>
                  </ul>
                  <div className="flex items-center justify-between border-t border-surface-container-high pt-3">
                    <span className="font-meta-code text-meta-code text-on-surface-variant italic">Recorded · MMXXIV</span>
                    <span className="font-label-caps text-label-caps text-tertiary">SEAL · INTACT</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col gap-px bg-surface-container-high border border-surface-container-high">
                {tenets.map((t) => (
                  <div key={t.roman} className="bg-surface-container-low p-8 flex gap-6 group hover:bg-surface-container transition-colors duration-500">
                    <div className="font-h2-heading text-tertiary text-3xl font-medium opacity-50 group-hover:opacity-100 transition-opacity w-12 shrink-0">{t.roman}</div>
                    <div className="flex-1">
                      <h3 className="font-h2-heading text-xl text-on-surface mb-2">{t.title}</h3>
                      <p className="font-meta-code text-meta-code text-on-surface-variant leading-relaxed">{t.body}</p>
                    </div>
                    <div className="font-meta-code text-meta-code text-tertiary/30 self-start hidden lg:block">{t.num}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-surface-container-high">
              <div className="font-meta-code text-meta-code text-on-surface-variant tracking-[0.15em] uppercase">
                END OF DOCTRINE // FIVE TENETS RECORDED
              </div>
              <a href="#" className="group inline-flex items-center gap-3 font-label-caps text-label-caps text-tertiary hover:text-on-surface transition-colors">
                Read the full archive
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </section>
          <section className="py-32 relative px-gutter max-w-7xl mx-auto z-10 border-t border-surface-container-high">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-stretch">
              <div className="md:col-span-5 flex flex-col md:h-full md:justify-between gap-10">
                <div>
                  <div className="font-meta-code text-meta-code text-tertiary mb-6 tracking-[0.2em] uppercase">Atelier // 005</div>
                  <h2 className="font-h2-heading text-h2-heading text-on-surface mb-8 leading-tight">
                    Inside the <span className="italic text-tertiary">silent floor</span>.
                  </h2>
                  <p className="font-body-classic text-body-classic text-on-surface-variant mb-8 italic">
                    Four passes through the studio, captured at sixteen-second intervals. A meditation on stillness, fragment, instrument and circuit.
                  </p>
                  <div className="flex items-center gap-4 max-w-sm mb-8">
                    <div className="flex-1 h-px bg-tertiary/30 relative overflow-hidden">
                      <div className="absolute inset-0 origin-left bg-tertiary atelier-scrub" />
                    </div>
                    <span className="font-meta-code text-meta-code text-on-surface-variant tabular-nums">04 plates · 16s</span>
                  </div>
                  <a href="#" className="inline-flex items-center gap-3 border border-outline-variant px-5 py-3 font-label-caps text-label-caps text-on-surface hover:border-tertiary hover:text-tertiary transition-colors">
                    View full atelier
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                </div>
                {/* Bottom block — two cards stacked, both aligned to the bottom of the column */}
                <div className="flex flex-col gap-4">
                  {/* New Operators card — sits above Studio Index */}
                  <div className="border border-surface-container-high bg-surface-container-low p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                      <span className="font-label-caps text-label-caps text-tertiary tracking-widest">— Operators on the Floor</span>
                      <span className="font-meta-code text-meta-code text-on-surface-variant tabular-nums">CREW · 04</span>
                    </div>
                    <ul className="flex flex-col">
                      {[
                        { roman: "I",   name: "M. Vasseur",   role: "Director · prints" },
                        { roman: "II",  name: "L. Roche",     role: "Studio · binding" },
                        { roman: "III", name: "K. Otsuka",    role: "Photography" },
                        { roman: "IV",  name: "S. Mendel",    role: "Archive · index" },
                      ].map((c) => (
                        <li key={c.roman} className="flex items-baseline gap-3 py-2 border-b border-dotted border-outline-variant/40 last:border-b-0">
                          <span className="font-h2-heading text-tertiary text-base tabular-nums opacity-60 w-6 shrink-0">{c.roman}</span>
                          <span className="flex-1 font-meta-code text-meta-code text-on-surface">{c.name}</span>
                          <span className="font-meta-code text-meta-code text-on-surface-variant italic">{c.role}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-surface-container-high pt-3">
                      <span className="font-meta-code text-meta-code text-on-surface-variant italic">Crew rotates seasonally</span>
                      <span className="font-label-caps text-label-caps text-tertiary">SIGNED</span>
                    </div>
                  </div>

                  {/* Bottom-aligned card — atelier specs, fills empty left col so its bottom aligns with the 4-thumb strip on the right */}
                  <div className="border border-surface-container-high bg-surface-container-low p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                      <span className="font-label-caps text-label-caps text-tertiary tracking-widest">— Studio Index</span>
                      <span className="font-meta-code text-meta-code text-on-surface-variant tabular-nums">FLOOR · 02</span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div className="flex flex-col gap-1">
                        <dt className="font-meta-code text-[10px] uppercase tracking-widest text-on-surface-variant">Plates</dt>
                        <dd className="font-h2-heading text-tertiary text-2xl tabular-nums">04</dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="font-meta-code text-[10px] uppercase tracking-widest text-on-surface-variant">Cycle</dt>
                        <dd className="font-h2-heading text-tertiary text-2xl tabular-nums">16<span className="text-base text-on-surface-variant">s</span></dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="font-meta-code text-[10px] uppercase tracking-widest text-on-surface-variant">Recorded</dt>
                        <dd className="font-h2-heading text-on-surface text-base">MMXXIV</dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="font-meta-code text-[10px] uppercase tracking-widest text-on-surface-variant">Aperture</dt>
                        <dd className="font-h2-heading text-on-surface text-base tabular-nums">f/2.8</dd>
                      </div>
                    </dl>
                    <div className="flex items-center justify-between border-t border-surface-container-high pt-3">
                      <span className="font-meta-code text-meta-code text-on-surface-variant italic">Silver gelatin · scanned</span>
                      <span className="font-label-caps text-label-caps text-tertiary">ARCHIVED</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-surface-container-lowest border border-surface-container-high">
                  {atelierPlates.map((p) => (
                    <img key={`big-${p.roman}`} alt={p.alt} src={p.img} className="atelier-cycle absolute inset-0 w-full h-full object-cover grayscale" style={{ animationDelay: p.delay }} />
                  ))}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-surface/70 via-transparent to-surface/20" />
                  <div className="absolute top-6 left-6 font-meta-code text-meta-code text-tertiary tracking-[0.2em] uppercase">Atelier · No. 02</div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                    <span className="font-h2-heading italic text-on-surface text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">A meditation in four plates</span>
                    <span className="font-label-caps text-label-caps text-tertiary drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">MMXXIV</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-6">
                  {atelierPlates.map((p) => (
                    <button key={`thumb-${p.roman}`} type="button" className="atelier-indicator relative aspect-square overflow-hidden border border-outline-variant hover:border-tertiary transition-colors" style={{ animationDelay: p.delay }}>
                      <img alt="" src={p.thumb} className="absolute inset-0 w-full h-full object-cover grayscale" />
                      <span className="absolute bottom-1 left-1 font-meta-code text-[10px] text-on-surface drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">{p.roman}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="py-32 relative px-gutter max-w-7xl mx-auto z-10 border-t border-surface-container-high">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-stretch">
              {/* Left col — flex with image pinned to bottom so its bottom aligns with the disclaimer on the right */}
              <div className="md:col-span-4 flex flex-col md:h-full md:justify-between gap-10">
                <div>
                  <div className="font-meta-code text-meta-code text-tertiary mb-6 tracking-[0.2em] uppercase">Inquiry // 006</div>
                  <h2 className="font-h2-heading text-h2-heading text-on-surface mb-6 leading-tight">
                    Questions, <span className="italic text-tertiary">answered quietly</span>.
                  </h2>
                  <p className="font-body-classic text-body-classic text-on-surface-variant italic">
                    What follows is a brief catechism — six recurring inquiries the archive receives, recorded for the visitor before the gates close.
                  </p>
                </div>
                <div className="hidden md:block relative aspect-[4/5] overflow-hidden border border-surface-container-high">
                  <img alt="archive figure" src={IMG_HALL} className="absolute inset-0 w-full h-full object-cover grayscale opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 font-meta-code text-meta-code text-tertiary tracking-widest uppercase">Catechism · MMXXIV</div>
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col gap-6">
                <div className="flex flex-col divide-y divide-surface-container-high border-y border-surface-container-high">
                  {faqItems.map((f) => (
                    <details key={f.roman} className="nc-faq group p-6 md:p-8">
                      <summary className="flex items-center justify-between gap-6 cursor-pointer">
                        <div className="flex items-baseline gap-5">
                          <span className="font-h2-heading text-tertiary text-2xl font-medium opacity-50 group-hover:opacity-100 group-open:opacity-100 transition-opacity tabular-nums w-10 shrink-0">{f.roman}</span>
                          <h3 className="font-h2-heading text-xl md:text-2xl text-on-surface">{f.q}</h3>
                        </div>
                        <span className="material-symbols-outlined nc-chevron text-tertiary text-[28px]">chevron_right</span>
                      </summary>
                      <div className="pl-[60px] pr-2 mt-4 font-body-classic text-body-classic text-on-surface-variant leading-relaxed">
                        {f.a}
                      </div>
                    </details>
                  ))}
                </div>
                {/* Disclaimer card — sits BELOW the FAQ list on the right column */}
                <div className="border border-surface-container-high bg-surface-container-low p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                    <span className="font-label-caps text-label-caps text-tertiary tracking-widest">— Disclaimer</span>
                    <span className="material-symbols-outlined text-tertiary text-[18px]">info</span>
                  </div>
                  <p className="font-meta-code text-meta-code text-on-surface-variant italic leading-relaxed">
                    Replies are recorded under archive-fragment notation. The atelier reserves the right to redact, but never to delete. Anything not addressed in this catechism is met privately by uplink — usually within seventy-two hours, often the same evening.
                  </p>
                  <div className="flex items-center justify-between border-t border-surface-container-high pt-3 gap-4">
                    <span className="font-meta-code text-[10px] uppercase tracking-widest text-on-surface-variant">Reply window</span>
                    <span className="font-meta-code text-meta-code text-tertiary tabular-nums">≤ 72h</span>
                    <span className="hidden md:inline-block flex-1 border-b border-dotted border-outline-variant/40" />
                    <span className="font-meta-code text-[10px] uppercase tracking-widest text-on-surface-variant">Channel</span>
                    <span className="font-label-caps text-label-caps text-tertiary">UPLINK · NO. 47</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* NEW SECTION 2 — "Visiting Hours" — schedule + tariff card with image */}
          <section className="py-32 relative px-gutter max-w-7xl mx-auto z-10 border-t border-surface-container-high">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <div className="font-meta-code text-meta-code text-tertiary mb-4 tracking-[0.2em] uppercase">Schedule // 007</div>
                <h2 className="font-h2-heading text-h2-heading text-on-surface leading-tight max-w-xl">
                  Visiting hours, <span className="italic text-tertiary">if invited</span>.
                </h2>
              </div>
              <p className="font-body-classic text-body-classic text-on-surface-variant max-w-md italic leading-relaxed">
                The silent floor receives correspondents on the second Thursday of each month. The hall is unheated. Bring a coat, a quiet question, and a sealed reference if you carry one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-stretch">
              {/* Left: schedule grid */}
              <div className="md:col-span-7 border border-surface-container-high bg-surface-container-low flex flex-col">
                <div className="flex items-center justify-between border-b border-surface-container-high px-6 py-4">
                  <span className="font-label-caps text-label-caps text-tertiary tracking-widest">— Open dates · MMXXIV</span>
                  <span className="font-meta-code text-meta-code text-on-surface-variant">15:00 — 17:00 CET</span>
                </div>
                <ol className="divide-y divide-surface-container-high flex-1">
                  {[
                    { roman: "I",   date: "Feb 08",  status: "Closed",   note: "by appointment only" },
                    { roman: "II",  date: "Mar 14",  status: "Open",     note: "two seats remain" },
                    { roman: "III", date: "Apr 11",  status: "Open",     note: "uplink in advance" },
                    { roman: "IV",  date: "May 09",  status: "Reserved", note: "private commission" },
                    { roman: "V",   date: "Jun 13",  status: "Open",     note: "summer programme" },
                    { roman: "VI",  date: "Sep 12",  status: "Open",     note: "after the closure" },
                  ].map((d) => (
                    <li key={d.roman} className="grid grid-cols-12 gap-4 items-center px-6 py-4">
                      <span className="col-span-1 font-h2-heading text-tertiary text-2xl tabular-nums opacity-50">{d.roman}</span>
                      <span className="col-span-3 font-meta-code text-meta-code text-on-surface tabular-nums">{d.date}</span>
                      <span className={`col-span-3 font-label-caps text-label-caps tracking-widest ${d.status === "Open" ? "text-tertiary" : d.status === "Closed" ? "text-error" : "text-on-surface-variant"}`}>{d.status}</span>
                      <span className="col-span-5 font-meta-code text-meta-code text-on-surface-variant italic text-right">{d.note}</span>
                    </li>
                  ))}
                </ol>
                <div className="flex items-center justify-between border-t border-surface-container-high px-6 py-4">
                  <span className="font-meta-code text-meta-code text-on-surface-variant italic">Submissions reviewed weekly</span>
                  <a href="#" className="inline-flex items-center gap-2 font-label-caps text-label-caps text-tertiary hover:text-on-surface transition-colors">Request a slot<span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
                </div>
              </div>

              {/* Right: tariff card with image */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="relative aspect-[4/3] overflow-hidden border border-surface-container-high">
                  <img alt="Approach to the silent floor" src={IMG_BRUTAL} className="absolute inset-0 w-full h-full object-cover grayscale opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  <div className="absolute top-4 left-4 font-meta-code text-meta-code text-tertiary tracking-widest uppercase">Approach</div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <span className="font-h2-heading italic text-on-surface text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">No. 47, Quai du Vault</span>
                    <span className="font-label-caps text-label-caps text-tertiary drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">ZRH</span>
                  </div>
                </div>
                <div className="border border-surface-container-high bg-surface-container-low p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                    <span className="font-label-caps text-label-caps text-tertiary tracking-widest">— Tariff</span>
                    <span className="material-symbols-outlined text-tertiary text-[18px]">request_quote</span>
                  </div>
                  <dl className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between border-b border-dotted border-outline-variant/40 pb-2">
                      <dt className="font-meta-code text-meta-code text-on-surface">Tier I — Heritage commission</dt>
                      <dd className="font-h2-heading text-tertiary text-base tabular-nums">36k</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-dotted border-outline-variant/40 pb-2">
                      <dt className="font-meta-code text-meta-code text-on-surface">Tier II — Archive-grade</dt>
                      <dd className="font-h2-heading text-tertiary text-base tabular-nums">120k</dd>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <dt className="font-meta-code text-meta-code text-on-surface">Tier III — Bespoke editorial</dt>
                      <dd className="font-h2-heading text-tertiary text-base">Quoted</dd>
                    </div>
                  </dl>
                  <p className="font-meta-code text-meta-code text-on-surface-variant italic mt-1">Heritage-rate clauses honoured in writing.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t-2 border-double border-zinc-900 mt-20 relative z-20">
          <div className="border-t border-zinc-800/50 py-16 bg-zinc-950">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-12 space-y-4 md:space-y-0">
              <div className="font-serif text-lg text-zinc-200">DESIGN ALCHEMY</div>
              <div className="flex space-x-6">
                {footerLinks.map((l) => (
                  <a key={l.label} href="#" className={l.highlight
                    ? "font-mono text-[10px] tracking-tighter uppercase text-cyan-500 underline transition-colors hover:tracking-widest duration-500"
                    : "font-mono text-[10px] tracking-tighter uppercase text-zinc-600 hover:text-cyan-400 transition-colors hover:tracking-widest duration-500"
                  }>{l.label}</a>
                ))}
              </div>
              <div className="font-mono text-[10px] tracking-tighter uppercase text-zinc-500">
                © 2024 DESIGN ALCHEMY // DIGITAL HERITAGE PROTOCOL
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
