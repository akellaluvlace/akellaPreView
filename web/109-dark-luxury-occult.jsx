export default function T109DarkLuxuryOccult() {
  const navLinks = ["Philosophy", "Laboratory", "Manifesto", "Circle"];
  const disciplines = [
    { roman: "I", icon: "science", title: "Synthesis", body: "Extraction of essential vibration from disparate, incoherent material. The first ritual: listening.", phase: "01", offset: "" },
    { roman: "II", icon: "auto_awesome", title: "Transmutation", body: "Alchemical change of form. Code into atmosphere. Atmosphere into experience. Experience into memory.", phase: "02", offset: "md:translate-y-12" },
    { roman: "III", icon: "filter_drama", title: "Distillation", body: "Refinement until only what is essential remains. The decoration is burned away. What is true endures.", phase: "03", offset: "" },
    { roman: "IV", icon: "graphic_eq", title: "Resonance", body: "Attuning the interface to the soul of the one who meets it. The final, invisible binding.", phase: "04", offset: "md:translate-y-12" },
  ];
  const atelier = [
    { span: "lg:col-span-7", aspect: "aspect-[4/3]", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1400&q=85&auto=format&fit=crop", chip: "PLATE · I", title: "Brass & Bone, c. 1730", body: "The apothecary's apparatus, kept in its first arrangement.", roman: "I" },
    { span: "lg:col-span-5", aspect: "aspect-[4/3]", stretch: true, img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1100&q=85&auto=format&fit=crop", chip: "PLATE · II", title: "The Reading Vault", body: "Floor 2 · By appointment · Dusk only", roman: "II" },
    { span: "lg:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85&auto=format&fit=crop", chip: "PLATE · III", title: "Antechamber", body: "Stone · Brass · Hush", roman: "III" },
    { span: "lg:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", chip: "PLATE · IV", title: "The West Stair", body: "Heritage facade · MMXXIV", roman: "IV" },
    { span: "lg:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", chip: "PLATE · V", title: "Cathedral, North", body: "Light · Stone · Time", roman: "V" },
  ];

  const manifesto = [
    { roman: "I", title: "Of the Material", body: "Matter resists. The grain refuses, the colour drifts, the seam splits. We treat resistance as instruction, not failure." },
    { roman: "II", title: "Of the Hour", body: "The hour at which a piece is begun is encoded in its body. We work between the wolf hour and the second cock — the time the world has stopped speaking." },
    { roman: "III", title: "Of Concealment", body: "What is most precious is buried. Visibility is a tax we charge sparingly, and never to the loudest bidder." },
    { roman: "IV", title: "Of the Witness", body: "Craft endures by indifference to its audience. We make for the eye that arrives after the speaker has gone silent." },
    { roman: "V", title: "Of Transmutation", body: "Each piece is a small refusal of decay — a vessel made to hold what time, otherwise, would erase." },
  ];

  const cases = [
    {
      num: "I", year: "MMXXVI", tags: "IDENTITY · PRINT · WEB",
      title: "The Obsidian Vault",
      body: "A whole identity for a private members' library — bookplate, letterhead, and a digital reading room cast in candlelight.",
      offset: "",
      alt: "The Obsidian Vault",
      src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1000&q=85&auto=format&fit=crop",
    },
    {
      num: "II", year: "MMXXV", tags: "PACKAGING · ART DIRECTION",
      title: "Brass & Bone",
      body: "Apothecary brand for a small batch of distilled tinctures — labels embossed, drawn from a 1730 herbarium.",
      offset: "md:translate-y-16",
      alt: "Brass & Bone",
      src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1000&q=85&auto=format&fit=crop",
    },
    {
      num: "III", year: "MMXXV", tags: "SPATIAL · DIGITAL",
      title: "Hour of the Wolf",
      body: "A nocturnal hotel concept — wayfinding, ambient sound, and a reservation ritual that begins at dusk.",
      offset: "",
      alt: "Hour of the Wolf",
      src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1000&q=85&auto=format&fit=crop",
    },
  ];
  const footerLinks = ["Journal", "Privacy", "Archive", "Terms"];
  const customCss = `
    .noise-bg { position: relative; }
    .noise-bg::before {
      content: ""; position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.03; pointer-events: none; z-index: 10;
    }
    .clay-card {
      background: rgba(42, 42, 42, 0.4);
      backdrop-filter: blur(40px);
      border: 1px solid rgba(212, 175, 55, 0.2);
      box-shadow: inset 0 1px 1px rgba(212, 175, 55, 0.1), 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    .clay-btn-primary {
      background: linear-gradient(145deg, #fbb3c1, #e8a2b0);
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 10px 20px rgba(0, 0, 0, 0.4);
    }
    .clay-btn-ghost {
      background: transparent;
      border: 1px solid rgba(212, 175, 55, 0.5);
      box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.05), 0 10px 20px rgba(0, 0, 0, 0.3);
    }
    .vignette { background: radial-gradient(circle, transparent 50%, #131313 150%); }
    .text-cinzel { font-family: 'Cinzel', serif; }
    .text-playfair { font-family: 'Playfair Display', serif; }
  `;
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Noto+Serif:wght@300;400;700;900&family=Public+Sans:wght@400;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#f2ca50", "on-primary": "#3c2f00",
                "primary-container": "#d4af37", "on-primary-container": "#554300",
                "primary-fixed": "#ffe088", "primary-fixed-dim": "#e9c349",
                "secondary": "#fbb3c1", "on-secondary": "#50212d",
                "secondary-container": "#6b3743", "on-secondary-container": "#e8a2b0",
                "secondary-fixed": "#ffd9df", "secondary-fixed-dim": "#fbb3c1",
                "tertiary": "#c6cee8", "on-tertiary": "#283044",
                "tertiary-container": "#abb2cc", "on-tertiary-container": "#3d455a",
                "tertiary-fixed": "#dae2fd", "tertiary-fixed-dim": "#bec6e0",
                "surface": "#131313", "on-surface": "#e5e2e1", "on-surface-variant": "#d0c5af",
                "surface-container-lowest": "#0e0e0e", "surface-container-low": "#1c1b1b",
                "surface-container": "#201f1f", "surface-container-high": "#2a2a2a",
                "surface-container-highest": "#353534",
                "surface-variant": "#353534", "surface-bright": "#393939", "surface-dim": "#131313",
                "outline": "#99907c", "outline-variant": "#4d4635",
                "background": "#131313", "on-background": "#e5e2e1",
                "error": "#ffb4ab"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "margin-page": "64px", "unit": "8px", "section-gap": "128px", "gutter": "24px" },
              fontFamily: {
                "body-md": ["Public Sans"], "body-lg": ["Public Sans"], "label-caps": ["Public Sans"],
                "headline-md": ["Noto Serif"], "headline-xl": ["Noto Serif"], "display-lg": ["Noto Serif"]
              },
              fontSize: {
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "32px", letterSpacing: "0.01em", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.2em", fontWeight: "700" }],
                "headline-md": ["32px", { lineHeight: "40px", letterSpacing: "0.05em", fontWeight: "400" }],
                "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "0.1em", fontWeight: "400" }],
                "display-lg": ["72px", { lineHeight: "80px", letterSpacing: "0.15em", fontWeight: "300" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-background text-on-background min-h-screen noise-bg overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <nav className="fixed top-0 w-full z-50 bg-zinc-950/40 backdrop-blur-[40px] border-b border-[#D4AF37]/20 shadow-[inset_0_1px_1px_rgba(212,175,55,0.1)] transition-all duration-500">
          <div className="flex justify-between items-center px-16 py-8 w-full max-w-screen-2xl mx-auto">
            <div className="text-xl tracking-[0.3em] font-bold text-[#D4AF37] uppercase font-headline-md">Design Alchemy</div>
            <div className="hidden md:flex gap-12">
              {navLinks.map((l) => (
                <a key={l} href="#" className="font-['Noto_Serif'] tracking-[0.2em] uppercase text-[10px] font-light text-zinc-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-500 px-4 py-2 rounded-full">{l}</a>
              ))}
            </div>
            <button className="clay-btn-ghost text-primary-container px-8 py-3 rounded-full font-label-caps uppercase text-label-caps hover:scale-95 duration-300 ease-out">
              Inquire
            </button>
          </div>
        </nav>
        <section className="relative min-h-screen flex items-center justify-center px-margin-page pt-32 pb-section-gap overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="abstract dark textured background with subtle liquid or grainy qualities" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnbIasbhmYwO2FhrV0kylO84_0U4xwzySd0N33JsBMNEyqt5LRLdDblJu6uu-U1P8X-fer3MKlMtomfJCspZsV5oKHNkEFf-x287TyANdLZDUpSXWGOFfUIPttZHHeVnvaxag34J8pyh9kLLJR646Y0IrU93lliuqGOZGiif0RoBxkp5Ehx7qwStk0CZIR7sHtY2TKlfVclV6nDT4pcfS1oXj7QF5XY0J7V2omJQ8qnNLZiua4NTBe-iRpdxKItGSS4q7tQbO1_5m4" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
            <div className="absolute inset-0 vignette" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="mb-12 relative w-64 h-64 md:w-96 md:h-96 rounded-full clay-card flex items-center justify-center overflow-hidden border border-primary-container/30 shadow-[0_0_80px_rgba(212,175,55,0.15)]">
              <img alt="abstract 3d metallic geometric shape" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGPyKSuRQLHw-TTxHSt_HEavRzDVo3LiUapXfhtsNvQNtiQuxJlXYUHyqHNNnJvH6T3ZRiBfg8EQ1I2GBHwl4hTuL4qD1Ww36yoHCL9YjKyLgspFApmUUukBrzEMK0ddIpqOTgrUw4Q3akI7PeF0PpE8AZm1wtJFq6WVlenZSqNz4jmkI0SoVKVahR_56PS5KQ9TpQ-Obit3ElDes-BUdMFNOHt1R7xZ_A8gcvJHMEyBSrzEXJCRC7hkX8B48Uxsm7P13r6Nv1alQb" className="w-full h-full object-cover opacity-80 mix-blend-screen scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            <h1 className="text-display-lg text-cinzel text-on-surface mb-8 tracking-[0.3em] font-light uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              Transmuting Code<br /><span className="text-primary-container italic text-playfair lowercase tracking-normal">into</span> Art
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-16 opacity-80">
              A transcendental fusion of tactile craft and ethereal atmosphere. We exist in the void between logic and magic.
            </p>
            <button className="clay-btn-primary text-on-primary-container px-12 py-4 rounded-full font-label-caps uppercase text-label-caps hover:scale-105 transition-transform duration-500 tracking-widest font-bold">
              Enter the Portal
            </button>
          </div>
        </section>
        <section className="relative px-margin-page py-section-gap overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary-container/[0.04] rounded-full blur-[160px] z-0 pointer-events-none" />
          <div className="max-w-screen-2xl mx-auto relative z-10">
            <div className="text-center mb-24 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="w-10 h-px bg-primary-container/40" />
                <span className="font-label-caps text-label-caps text-primary-container tracking-[0.5em]">II / THE LABORATORY</span>
                <span className="w-10 h-px bg-primary-container/40" />
              </div>
              <h2 className="text-cinzel text-headline-xl text-on-surface mb-8 uppercase tracking-[0.2em]">
                Disciplines of the<br /><span className="italic text-playfair lowercase tracking-normal text-primary-container normal-case">craft</span>
              </h2>
              <div className="w-px h-16 bg-primary-container/50 mx-auto mb-8" />
              <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto opacity-80">
                Four disciplines, each a thread in the same garment. Pull one and the whole reveals itself.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {disciplines.map((d) => (
                <div key={d.roman} className={`clay-card rounded-lg p-10 flex flex-col group transition-all duration-700 hover:border-primary-container/60 relative ${d.offset}`}>
                  <div className="text-cinzel text-6xl text-primary-container/30 mb-8 group-hover:text-primary-container/80 transition-colors duration-700">{d.roman}</div>
                  <span className="material-symbols-outlined text-3xl text-primary-container/70 mb-6" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>{d.icon}</span>
                  <h3 className="text-cinzel text-2xl text-on-surface uppercase tracking-[0.15em] mb-4">{d.title}</h3>
                  <div className="w-12 h-px bg-primary-container/30 mb-6" />
                  <p className="font-body-md text-on-surface-variant opacity-80 leading-relaxed mb-8">{d.body}</p>
                  <span className="font-label-caps text-label-caps text-primary-container/40 mt-auto tracking-[0.3em]">— PHASE · {d.phase}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="relative px-margin-page py-section-gap overflow-hidden border-t border-primary-container/10">
          <div className="absolute left-margin-page top-1/2 -translate-y-1/2 -rotate-90 origin-left font-label-caps text-label-caps text-primary-container/30 hidden lg:block tracking-[0.5em]">
            — ARCHIVE · MMXXVI —
          </div>
          <div className="max-w-screen-2xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 pb-12 border-b border-primary-container/15">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-10 h-px bg-primary-container/40" />
                  <span className="font-label-caps text-label-caps text-primary-container tracking-[0.5em]">III / THE ARCHIVE</span>
                </div>
                <h2 className="text-cinzel text-headline-xl text-on-surface uppercase tracking-[0.2em] mb-4">
                  Recent<br /><span className="italic text-playfair lowercase tracking-normal text-primary-container normal-case">transmutations</span>
                </h2>
                <p className="font-body-lg text-on-surface-variant opacity-80 max-w-md mt-4">
                  Selected works from the recent crucible. Each piece a partial proof of a larger doctrine.
                </p>
              </div>
              <a href="#" className="font-label-caps text-label-caps text-primary-container hover:text-on-surface transition-colors duration-500 uppercase tracking-[0.3em] flex items-center gap-3 group whitespace-nowrap">
                View Full Archive
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_outward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {cases.map((c) => (
                <a key={c.num} href="#" className={`group block ${c.offset}`}>
                  <div className="aspect-[3/4] overflow-hidden rounded-lg border border-primary-container/20 mb-8 relative bg-surface-container">
                    <img alt={c.alt} src={c.src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                    <div className="absolute top-5 left-5 font-label-caps text-label-caps text-primary-container bg-background/60 backdrop-blur-sm border border-primary-container/30 px-3 py-1.5 tracking-[0.3em]">CASE · {c.num}</div>
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                      <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.3em]">{c.year}</span>
                      <span className="material-symbols-outlined text-primary-container/70 group-hover:text-primary-container group-hover:translate-x-1 transition-all">arrow_outward</span>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-primary-container/70 tracking-[0.3em]">{c.tags}</span>
                  <h3 className="text-cinzel text-2xl text-on-surface uppercase tracking-[0.15em] mt-3 mb-3 group-hover:text-primary-container transition-colors duration-500">{c.title}</h3>
                  <p className="font-body-md text-on-surface-variant opacity-70 leading-relaxed">{c.body}</p>
                </a>
              ))}
            </div>
            <div className="mt-32 flex flex-col md:flex-row items-center justify-center gap-8 text-center">
              <span className="font-label-caps text-label-caps text-primary-container/50 tracking-[0.5em]">— FOURTEEN MORE WORKS HELD IN THE ARCHIVE —</span>
            </div>
          </div>
        </section>
        {/* Section IV — The Atelier (image plates), full-bleed slight shade */}
        <section className="relative w-full overflow-hidden py-section-gap border-t border-primary-container/10" style={{ backgroundColor: "#0e0e0e" }}>
          <div className="absolute top-1/2 left-0 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-primary-container/[0.04] rounded-full blur-[160px] z-0 pointer-events-none"></div>
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] translate-x-1/3 bg-secondary/[0.03] rounded-full blur-[140px] z-0 pointer-events-none"></div>

          <div className="absolute right-margin-page top-1/2 -translate-y-1/2 rotate-90 origin-right font-label-caps text-label-caps text-primary-container/30 hidden lg:block tracking-[0.5em]">
            — ATELIER · MMXXVI —
          </div>

          <div className="max-w-screen-2xl mx-auto px-margin-page relative z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="w-10 h-px bg-primary-container/40" />
                <span className="font-label-caps text-label-caps text-primary-container tracking-[0.5em]">IV / THE ATELIER</span>
                <span className="w-10 h-px bg-primary-container/40" />
              </div>
              <h2 className="text-cinzel text-headline-xl text-on-surface mb-8 uppercase tracking-[0.2em]">
                Plates from the<br /><span className="italic text-playfair lowercase tracking-normal text-primary-container normal-case">vault</span>
              </h2>
              <div className="w-px h-16 bg-primary-container/50 mx-auto mb-8"></div>
              <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto opacity-80">
                Photographs from the working spaces. Each plate names the room, the artefact, or the hour at which it was kept.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              {atelier.map(p => (
                <figure key={p.chip} className={`${p.span} group relative overflow-hidden rounded-lg border border-primary-container/20 bg-surface-container hover:border-primary-container/50 transition-colors duration-700 ${p.stretch ? "lg:h-full" : ""}`}>
                  <div className={`${p.aspect} relative overflow-hidden ${p.stretch ? "lg:h-full lg:aspect-auto" : ""}`}>
                    <img src={p.img} alt={p.title} className={`${p.stretch ? "absolute inset-0 " : ""}w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent"></div>
                    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 60% at 50% 50%, transparent 40%, rgba(19,19,19,0.5) 100%)" }}></div>
                    <div className="absolute top-5 left-5 font-label-caps text-label-caps text-primary-container bg-background/60 backdrop-blur-sm border border-primary-container/30 px-3 py-1.5 tracking-[0.3em]">{p.chip}</div>
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-cinzel text-base md:text-lg text-on-surface uppercase tracking-[0.15em] leading-snug">{p.title}</h3>
                        <p className="font-label-caps text-label-caps text-on-surface-variant mt-2 tracking-[0.3em] opacity-80">{p.body}</p>
                      </div>
                      <span className="text-cinzel text-3xl md:text-4xl text-primary-container/50 leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">{p.roman}</span>
                    </div>
                  </div>
                </figure>
              ))}
            </div>

            <div className="mt-24 flex items-center justify-center gap-4 font-label-caps text-label-caps tracking-[0.5em] text-primary-container/50">
              <span className="w-12 h-px bg-primary-container/40"></span>
              FIVE PLATES KEPT IN THE VAULT
              <span className="w-12 h-px bg-primary-container/40"></span>
            </div>
          </div>
        </section>

        {/* Section V — The Manifesto (content tenets), full-bleed slight shade */}
        <section className="relative w-full overflow-hidden py-section-gap border-t border-primary-container/10" style={{ backgroundColor: "#1a1310" }}>
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-secondary/[0.04] rounded-full blur-[160px] z-0 pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container/[0.05] rounded-full blur-[140px] z-0 pointer-events-none"></div>

          <div className="max-w-screen-2xl mx-auto px-margin-page relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

              {/* Left — header + sub-line + image + pull quote */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-10 h-px bg-primary-container/40"></span>
                  <span className="font-label-caps text-label-caps text-primary-container tracking-[0.5em]">V / THE MANIFESTO</span>
                </div>
                <h2 className="text-cinzel text-headline-xl text-on-surface mb-6 uppercase tracking-[0.2em] leading-tight">
                  Five articles<br/><span className="italic text-playfair lowercase tracking-normal text-primary-container normal-case">of the</span> craft
                </h2>
                <p className="font-playfair text-xl md:text-2xl italic text-primary-container/90 leading-snug mb-6">— A small ledger, written by the lamp.</p>
                <div className="w-px h-16 bg-primary-container/50 mb-8"></div>
                <p className="font-body-lg text-on-surface-variant opacity-80 leading-relaxed mb-10">
                  These articles are kept in the front of every contract we sign. They are old measures, written by hands now stilled, and they hold.
                </p>
                {/* Editorial plate image */}
                <figure className="group relative overflow-hidden rounded-lg border border-primary-container/20 bg-surface-container mb-10">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1100&q=85&auto=format&fit=crop" alt="Lamp & Pen" className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent"></div>
                    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 60% at 50% 50%, transparent 40%, rgba(19,19,19,0.5) 100%)" }}></div>
                    <div className="absolute top-5 left-5 font-label-caps text-label-caps text-primary-container bg-background/60 backdrop-blur-sm border border-primary-container/30 px-3 py-1.5 tracking-[0.3em]">PLATE · 06</div>
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                      <div>
                        <h4 className="text-cinzel text-base text-on-surface uppercase tracking-[0.15em] leading-snug">Lamp &amp; Pen</h4>
                        <p className="font-label-caps text-label-caps text-on-surface-variant mt-2 tracking-[0.3em] opacity-80">The desk where these articles were drawn</p>
                      </div>
                      <span className="text-cinzel text-3xl text-primary-container/50 leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">VI</span>
                    </div>
                  </div>
                </figure>
                <div className="clay-card rounded-lg p-8 mt-auto">
                  <span className="material-symbols-outlined text-primary-container/70 text-3xl block mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>format_quote</span>
                  <blockquote className="text-cinzel text-lg italic text-on-surface leading-relaxed mb-5">
                    "A craft kept by indifference to applause is the only craft that survives the applause."
                  </blockquote>
                  <cite className="font-label-caps text-label-caps text-primary-container tracking-[0.3em] not-italic">— Studio Note · 014</cite>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-1"></div>

              {/* Right — numbered articles */}
              <ol className="lg:col-span-6 divide-y divide-primary-container/15 border-t border-b border-primary-container/15">
                {manifesto.map(m => (
                  <li key={m.roman} className="grid grid-cols-12 gap-4 md:gap-6 py-8 group">
                    <span className="col-span-2 md:col-span-1 text-cinzel text-3xl md:text-5xl text-primary-container/40 group-hover:text-primary-container/80 leading-none transition-colors duration-700 tabular-nums">{m.roman}</span>
                    <div className="col-span-10 md:col-span-9">
                      <h3 className="text-cinzel text-xl md:text-2xl text-on-surface uppercase tracking-[0.15em] mb-3 group-hover:text-primary-container transition-colors duration-500">{m.title}</h3>
                      <div className="w-12 h-px bg-primary-container/30 mb-4"></div>
                      <p className="font-body-md text-on-surface-variant opacity-85 leading-relaxed">{m.body}</p>
                    </div>
                    <span className="hidden md:flex md:col-span-2 font-label-caps text-label-caps tracking-[0.3em] text-primary-container/40 items-start justify-end pt-3">— ARTICLE · {m.roman}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-24 text-center">
              <span className="font-label-caps text-label-caps text-primary-container/50 tracking-[0.5em]">— SO WRITTEN · SO HELD · MMXXVI —</span>
            </div>
          </div>
        </section>

        <footer className="bg-zinc-950 w-full border-t border-[#D4AF37]/20 shadow-[0_-10px_50px_rgba(0,0,0,0.5)] relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-center px-16 py-20 w-full max-w-screen-2xl mx-auto">
            <div className="text-[#D4AF37] font-black tracking-tighter text-2xl mb-8 md:mb-0">ALCHMY.</div>
            <div className="flex gap-12 mb-8 md:mb-0">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="font-['Noto_Serif'] tracking-[0.15em] uppercase text-[9px] text-zinc-600 hover:text-[#D4AF37] transition-colors duration-700 hover:tracking-[0.25em]">{l}</a>
              ))}
            </div>
            <div className="font-['Noto_Serif'] tracking-[0.15em] uppercase text-[9px] text-zinc-600 text-center md:text-right opacity-50">
              © 2024 DESIGN ALCHEMY. CRAFTED IN THE VOID.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
