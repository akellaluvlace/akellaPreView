export default function T22PhotographerPortfolio() {
  const navLinks = [
    { label: "Archive", href: "#archive" },
    { label: "About", href: "#about", active: true },
    { label: "Contact", href: "#contact" }
  ];

  const sideBySide = [
    { alt: "Abstract geometric shadows on architecture", src: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=800&auto=format&fit=crop&sat=-100", border: "" },
    { alt: "Close up textured concrete elements", src: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?q=80&w=800&auto=format&fit=crop&sat=-100", border: "border-l border-neutral-900" },
    { alt: "Dark silhouettes in an underpass", src: "https://images.unsplash.com/photo-1460500063983-994d4c27756c?q=80&w=800&auto=format&fit=crop&sat=-100", border: "border-l border-neutral-900" }
  ];

  const seriesRows = [
    {
      number: "I", status: "In progress", title: "Boundaries", plate: "Plate 04 · Brasília · 2024",
      img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?q=80&w=1600&auto=format&fit=crop&sat=-100",
      alt: "Wide modernist plaza in Brasília, long shadows raking across raw concrete.",
      body: "Three years tracing the seam where coastline meets concrete — from the breakwaters of Mar del Plata to the unfinished towers of Recife. Each frame holds a quiet argument with progress.",
      meta: "36 plates · Silver gelatin · Edition of 7"
    },
    {
      number: "II", status: "Closed", title: "Slow Cities", plate: "Plate 11 · Quito · 2023",
      img: "https://images.unsplash.com/photo-1618488373960-404fe668e524?q=80&w=1600&auto=format&fit=crop&sat=-100",
      alt: "Empty colonial street in Quito at dawn, soft mist softening crumbling stucco.",
      body: "A study of South American capitals at the hour they cease to perform — the brief grey window before the streets fill. Photographed entirely on Tri-X, hand-printed.",
      meta: "42 plates · Silver gelatin · Edition of 9",
      reverse: true
    },
    {
      number: "III", status: "Closed", title: "Mothers of the Inland", plate: "Plate 02 · Tucumán · 2022",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1600&auto=format&fit=crop&sat=-100",
      alt: "Quiet portrait of a woman in profile against a textured plaster wall.",
      body: "Eighteen months in the dry interior — portraits and interiors that refuse spectacle. The book that came from this series sold out twice and was acquired by the MoMA library.",
      meta: "28 plates · Pigment print · Edition of 12"
    },
    {
      number: "IV", status: "Closed", title: "Static Ground", plate: "Plate 19 · Salta · 2021",
      img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?q=80&w=1600&auto=format&fit=crop&sat=-100",
      alt: "High-contrast architectural detail, light raking across a coffered ceiling.",
      body: "Interiors of houses that have stood empty for more than a decade. Inheritance disputes, pending probate, the slow geometry of dust. A study of suspension.",
      meta: "24 plates · Silver gelatin · Edition of 7",
      reverse: true
    }
  ];

  const polaroids = [
    { rot: "rotate-[-3deg]", alt: "Silhouette in a doorway, harsh midday light.", src: "https://images.unsplash.com/photo-1775283511185-508da6831bfe?q=80&w=600&auto=format&fit=crop&sat=-100", caption: "Buenos Aires, 2023" },
    { rot: "rotate-[2deg]", alt: "A woman's hand on a balcony rail, evening light.", src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?q=80&w=600&auto=format&fit=crop&sat=-100", caption: "Quito, Field" },
    { rot: "rotate-[-1deg]", alt: "Concrete stairwell descending into shadow.", src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?q=80&w=600&auto=format&fit=crop&sat=-100", caption: "Salta, 2021" },
    { rot: "rotate-[4deg]", alt: "Editorial portrait, jaw-line and cheekbone.", src: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?q=80&w=600&auto=format&fit=crop&sat=-100", caption: "Tucumán, 2022" },
    { rot: "rotate-[-2deg]", alt: "Open window onto a textured plaster wall.", src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?q=80&w=600&auto=format&fit=crop&sat=-100", caption: "Recife, 2024" }
  ];

  const cycleImgs = [
    { delay: "0s",  alt: "Long-exposure architectural facade, slow erosion of light.", src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?q=80&w=2000&auto=format&fit=crop&sat=-100" },
    { delay: "4s",  alt: "Quiet interior of an empty house, tall window, long shadow.",   src: "https://images.unsplash.com/photo-1618488373960-404fe668e524?q=80&w=2000&auto=format&fit=crop&sat=-100" },
    { delay: "8s",  alt: "Portrait, hand resting on a worn wooden surface.",              src: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=2000&auto=format&fit=crop&sat=-100" },
    { delay: "12s", alt: "Coastal concrete breakwater, fog softening the horizon.",       src: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=2000&auto=format&fit=crop&sat=-100" }
  ];

  const press = [
    { year: "2024", body: <><em>Mothers of the Inland</em> &mdash; reviewed in <span className="text-neutral-100">Aperture, Issue 256</span></>, tag: "Print" },
    { year: "2024", body: <>Acquisition &mdash; <span className="text-neutral-100">MoMA Library, New York</span></>, tag: "Acquisition" },
    { year: "2023", body: <>Selected for the <span className="text-neutral-100">Bienal de Fotografía</span>, Santiago</>, tag: "Biennale" },
    { year: "2022", body: <>Long interview &mdash; <span className="text-neutral-100">The British Journal of Photography</span></>, tag: "Interview" },
    { year: "2021", body: <>Lo Müller Prize for documentary photography &mdash; finalist</>, tag: "Award" }
  ];

  const editions = [
    { alt: "Print 01 — wide architectural plate.",  src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?q=80&w=600&auto=format&fit=crop&sat=-100", title: "Plate 04 / Boundaries",     spec: "11 × 14 in · ed. of 7",  price: "USD 480" },
    { alt: "Print 02 — quiet street, Quito.",        src: "https://images.unsplash.com/photo-1618488373960-404fe668e524?q=80&w=600&auto=format&fit=crop&sat=-100", title: "Plate 11 / Slow Cities",     spec: "11 × 14 in · ed. of 9",  price: "USD 420" },
    { alt: "Print 03 — portrait study.",             src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop&sat=-100", title: "Plate 02 / Mothers",         spec: "16 × 20 in · ed. of 12", price: "USD 740" },
    { alt: "Print 04 — coffered ceiling detail.",    src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?q=80&w=600&auto=format&fit=crop&sat=-100", title: "Plate 19 / Static Ground",   spec: "11 × 14 in · ed. of 7",  price: "USD 480" },
    { alt: "Print 05 — concrete stairwell.",         src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?q=80&w=600&auto=format&fit=crop&sat=-100", title: "Plate 06 / Boundaries",      spec: "16 × 20 in · ed. of 5",  price: "USD 820" },
    { alt: "Print 06 — coastal breakwater.",         src: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=600&auto=format&fit=crop&sat=-100", title: "Plate 22 / Boundaries",      spec: "11 × 14 in · ed. of 7",  price: "USD 480" }
  ];

  const faqs = [
    { q: "Where can I see prints in person?", a: "Currently at the Galería de Arte Contemporáneo in Santiago through 14 September. The studio in Buenos Aires shows by appointment most Fridays." },
    { q: "Are editions signed?", a: "Yes. Every edition print is signed and numbered verso, with a blind-stamp embossing in the lower-right margin. Open prints carry the embossing only." },
    { q: "Do you take commissions?", a: "Selectively. I take one editorial and one long-form commission per year. Briefs that allow at least three weeks on location are the only ones I'll consider." },
    { q: "What gear do you use?", a: "A Mamiya 7 with a 65 mm and a 150 mm. Tri-X, occasionally HP5+. The darkroom is a converted laundry room behind the studio." },
    { q: "How do you choose a project?", a: "A subject becomes a project the third time it refuses to leave the notebook. After that I make a single trip and decide whether the work needs me — not whether I want it." }
  ];

  const archive = [
    { caption: "Mercado, 2021", href: "#mercado", alt: "Chaotic market scene with sharp focus on suspended elements, heavy contrast.", src: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop&sat=-100" },
    { caption: "Salinas, 2022", href: "#salinas", alt: "Vast, empty salt flat merging seamlessly with the horizon in monochrome.", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop&sat=-100" },
    { caption: "Ruina, 2020", href: "#ruina", alt: "Abandoned interior showing crumbling walls and distinct shafts of natural light.", src: "https://images.unsplash.com/photo-1530569673472-307dc017a82d?q=80&w=800&auto=format&fit=crop&sat=-100" },
    { caption: "Costa, 2019", href: "#costa", alt: "Close up abstract of rugged textures and tangled lines near the coastline.", src: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=800&auto=format&fit=crop&sat=-100" }
  ];

  const exhibitions = [
    { year: "2023", title: "Shadows of the Port", venue: "Galería de Arte Contemporáneo, Santiago" },
    { year: "2021", title: "Silent Concrete", venue: "Museo de Bellas Artes, Buenos Aires" },
    { year: "2019", title: "Edges", venue: "The Photographer's Gallery, London" }
  ];

  const footerLinks = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "Journal", href: "#journal" }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: { "background": "#141313", "surface": "#141313", "on-surface": "#e5e2e1" },
          spacing: { "margin-safe": "64px", "stack-sm": "16px", "stack-md": "40px", "stack-lg": "80px", "gutter": "24px", "unit": "8px" },
          fontFamily: {
            "headline-xl": ["Newsreader", "serif"], "headline-lg": ["Newsreader", "serif"], "body-lg": ["Newsreader", "serif"], "body-md": ["Newsreader", "serif"], "label": ["Newsreader", "serif"], "caption": ["Newsreader", "serif"]
          },
          fontSize: {
            "headline-xl": ["clamp(2.5rem, 5vw + 1rem, 48px)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
            "headline-lg": ["clamp(1.75rem, 3vw + 0.5rem, 32px)", { lineHeight: "1.2", fontWeight: "400" }],
            "body-lg": ["clamp(1.125rem, 1.5vw + 0.5rem, 20px)", { lineHeight: "1.6", fontWeight: "400" }],
            "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
            "label": ["12px", { lineHeight: "1.0", fontWeight: "500", letterSpacing: "0.1em" }],
            "caption": ["13px", { lineHeight: "1.4", letterSpacing: "0.03em", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const css = `
    body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #141313; }
    ::-webkit-scrollbar-thumb { background: #353434; }
    .polaroid::before {
      content: "";
      position: absolute;
      top: -10px;
      left: 50%;
      width: 64px;
      height: 18px;
      background: rgba(245, 240, 220, 0.85);
      transform: translateX(-50%) rotate(-3deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      z-index: 2;
    }
    .diagonal-strip {
      clip-path: polygon(0 12%, 100% 0, 100% 88%, 0 100%);
    }
    @keyframes ines-fade {
      0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
      8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);   transform: scale(1); }
      26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
    }
    .ines-cycle-img {
      animation: ines-fade 16s linear infinite;
      opacity: 0;
      filter: blur(18px) saturate(0.8);
      transform: scale(1.04);
      will-change: opacity, filter, transform;
    }
    .ines-faq summary::-webkit-details-marker { display: none; }
    .ines-faq summary { list-style: none; cursor: pointer; }
    .ines-faq summary .ines-chevron { transition: transform 250ms ease; }
    .ines-faq[open] summary .ines-chevron { transform: rotate(180deg); }
    @media (prefers-reduced-motion: reduce) {
      * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
      .ines-cycle-img:nth-child(1) { opacity: 1 !important; filter: none !important; transform: none !important; }
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="dark scroll-smooth snap-y snap-proximity bg-[#141313] selection:bg-neutral-800 selection:text-white text-on-surface antialiased overflow-x-hidden">
        <header className="group fixed top-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 md:px-16 h-16 md:h-24 bg-black/60 md:bg-black/0 md:hover:bg-black/95 md:focus-within:bg-black/95 transition-colors duration-700 ease-in-out">
          <h1 className="m-0 flex items-center">
            <a className="text-sm font-normal tracking-[0.2em] text-neutral-100 uppercase opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-500 sm:text-base md:text-xl rounded-sm" href="#" aria-label="Inés Moreno Home">Inés Moreno</a>
          </h1>
          <nav aria-label="Main Navigation" className="hidden md:block">
            <ul className="flex gap-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 font-serif font-light text-neutral-100 tracking-tight m-0 p-0">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a className={l.active ? "text-neutral-100 underline decoration-1 underline-offset-4 hover:text-neutral-100 rounded-sm transition-all duration-300" : "text-neutral-100/40 hover:text-neutral-100 rounded-sm transition-all duration-300"} href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main>
          {/* Hero — full viewport image 1 */}
          <section className="h-[100dvh] w-full relative snap-start snap-always">
            <img alt="Striking high-contrast black and white portrait of a woman looking off-camera, dramatic shadows defining her facial structure." className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2500&auto=format&fit=crop&sat=-100" width="2500" height="1667" fetchPriority="high" loading="eager" decoding="sync" />
          </section>

          {/* Full viewport image 2 */}
          <section className="h-[100dvh] w-full relative snap-start snap-always bg-black">
            <img alt="Desolate urban landscape featuring striking modernist architecture intersecting with nature, shot in moody monochrome." className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2500&auto=format&fit=crop&sat=-100" width="2500" height="1667" loading="lazy" decoding="async" />
          </section>

          {/* 3 Side-by-Side */}
          <section className="h-[100dvh] w-full relative snap-start snap-always bg-black flex flex-row">
            {sideBySide.map((s) => (
              <div key={s.alt} className={`flex-1 h-full relative overflow-hidden ${s.border}`}>
                <img alt={s.alt} className="w-full h-full object-cover grayscale" src={s.src} loading="lazy" decoding="async" />
              </div>
            ))}
          </section>

          {/* Wide Cinema Strip 21:9 (NOVEL #11) */}
          <section className="w-full relative snap-start bg-black overflow-hidden" aria-label="Current series — Boundaries">
            <div className="relative w-full aspect-[21/9]">
              <img alt="Wide brutalist concrete facade catching directional light, deep shadow gradient." className="absolute inset-0 w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?q=80&w=2400&auto=format&fit=crop&sat=-100" width="2400" height="1029" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute left-4 sm:left-8 md:left-16 bottom-6 md:bottom-10 max-w-xl">
                <p className="font-label text-label uppercase tracking-[0.2em] text-neutral-400 mb-stack-sm">Current Series &middot; 04</p>
                <h2 className="font-headline-xl text-headline-xl text-[#EDEDED] [text-wrap:balance]">Boundaries</h2>
                <p className="font-caption text-caption text-neutral-400 mt-stack-sm">Coastline, concrete, and the slow erosion of intent. Buenos Aires &middot; 2024.</p>
              </div>
            </div>
            <div className="w-full px-4 sm:px-8 md:px-16 py-stack-md flex flex-col sm:flex-row gap-4 sm:gap-12 border-t border-neutral-900 bg-[#141313]">
              <p className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-500">21:9 &middot; Silver gelatin scan</p>
              <p className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-500">36 plates &middot; Edition of 7</p>
              <p className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-500">Selected for the Bienal de Fotografía, 2025</p>
            </div>
          </section>

          {/* Text Interstitial */}
          <section className="py-20 px-4 max-w-4xl mx-auto flex flex-col gap-stack-md snap-start sm:py-24 sm:px-8 md:py-32 md:px-16">
            <hr className="border-t border-neutral-800 w-full" aria-hidden="true" />
            <h2 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">Valparaíso, 2023</h2>
            <p className="font-body-lg text-body-lg text-[#EDEDED] opacity-80 leading-relaxed max-w-[65ch] [text-wrap:pretty]">
              The port city breathes through its rusted funiculars and stray dogs. Over three weeks, the focus remained not on the vibrant murals that attract tourists, but on the skeletal infrastructure left behind by a forgotten economic boom. The shadows here stretch longer, holding memories of a time when the sea was a lifeline rather than a boundary.
            </p>
          </section>

          {/* Full viewport image 4 */}
          <section className="h-[100dvh] w-full relative snap-start snap-always bg-black">
            <img alt="Solitary figure walking down a steep, narrow cobblestone alleyway in Valparaiso, harsh sunlight creating geometric shadows." className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2500&auto=format&fit=crop&sat=-100" width="2500" height="1667" loading="lazy" decoding="async" />
          </section>

          {/* Series Index — alternating 7/5 rows */}
          <section id="series" className="py-20 px-4 max-w-screen-2xl mx-auto snap-start sm:py-24 sm:px-8 md:py-32 md:px-16 scroll-mt-16">
            <div className="flex items-end justify-between border-b border-neutral-900 pb-stack-md mb-stack-lg">
              <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">Series &amp; Long-form Work</h3>
              <p className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">Index &middot; 2019 — 2024</p>
            </div>
            <ol className="flex flex-col gap-16 sm:gap-20 md:gap-stack-lg list-none p-0 m-0">
              {seriesRows.map((row) => (
                <li key={row.title} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-margin-safe items-center">
                  <figure className={`m-0 md:col-span-7 ${row.reverse ? "md:order-2" : ""}`}>
                    <img alt={row.alt} className="w-full aspect-[16/10] object-cover grayscale bg-neutral-900" src={row.img} width="1600" height="1000" loading="lazy" decoding="async" />
                    <figcaption className="font-caption text-caption text-neutral-500 mt-unit uppercase tracking-[0.15em]">{row.plate}</figcaption>
                  </figure>
                  <div className={`md:col-span-5 ${row.reverse ? "md:order-1" : ""} flex flex-col gap-stack-sm`}>
                    <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Series {row.number} &middot; {row.status}</p>
                    <h4 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">{row.title}</h4>
                    <p className="font-body-md text-body-md text-[#EDEDED] opacity-80 max-w-[55ch] [text-wrap:pretty]">{row.body}</p>
                    <p className="font-caption text-caption text-neutral-500 uppercase tracking-[0.15em] mt-stack-sm">{row.meta}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Diagonal Photo Strip (NOVEL #10) */}
          <section aria-hidden="true" className="w-full relative bg-[#141313] overflow-hidden snap-start py-stack-md">
            <div className="diagonal-strip w-full aspect-[21/6] relative bg-black">
              <img alt="" className="w-full h-full object-cover grayscale opacity-90" src="https://images.unsplash.com/photo-1618488373960-404fe668e524?q=80&w=2400&auto=format&fit=crop&sat=-100" width="2400" height="686" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-headline-lg text-headline-lg text-[#EDEDED] italic tracking-tight whitespace-nowrap">&mdash; Field, not stage. &mdash;</p>
            </div>
          </section>

          {/* Polaroid Stack (NOVEL #3) */}
          <section className="py-20 px-4 max-w-screen-xl mx-auto snap-start sm:py-24 sm:px-8 md:py-32 md:px-16">
            <div className="flex flex-col gap-stack-md mb-stack-lg max-w-2xl">
              <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Field Notes &middot; 06</p>
              <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">From the contact sheets</h3>
              <p className="font-body-md text-body-md text-[#EDEDED] opacity-80 max-w-[55ch] [text-wrap:pretty]">Frames that didn't survive the edit but kept the shoot honest &mdash; pinned to the studio wall as small, rotating evidence.</p>
            </div>
            <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12 pt-stack-md">
              {polaroids.map((p) => (
                <figure key={p.caption} className={`polaroid relative bg-neutral-100 p-3 pb-12 ${p.rot} hover:rotate-0 transition-transform duration-500 shadow-2xl`}>
                  <img alt={p.alt} className="w-full aspect-[3/4] object-cover grayscale" src={p.src} loading="lazy" decoding="async" />
                  <figcaption className="font-caption text-caption text-neutral-700 absolute bottom-3 left-3 right-3 text-center uppercase tracking-[0.15em]">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Layered Photo Composition (NOVEL #5) */}
          <section className="py-20 px-4 max-w-screen-xl mx-auto snap-start sm:py-24 sm:px-8 md:py-32 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-margin-safe items-end">
              <div className="md:col-span-5 flex flex-col gap-stack-sm">
                <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Process &middot; 07</p>
                <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">A frame held against another frame</h3>
                <p className="font-body-md text-body-md text-[#EDEDED] opacity-80 max-w-[50ch] [text-wrap:pretty]">Most of the studio practice happens at the contact-sheet stage &mdash; placing one image alongside another and seeing whether either survives the comparison. The work that endures is what stays after that argument.</p>
                <p className="font-caption text-caption text-neutral-500 uppercase tracking-[0.15em] mt-stack-sm">Reference plate &middot; Boundaries 18</p>
              </div>
              <div className="md:col-span-7 relative">
                <img alt="Wide architectural elevation, solitary figure crossing through the frame." className="w-full aspect-[4/3] object-cover grayscale bg-neutral-900" src="https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?q=80&w=1600&auto=format&fit=crop&sat=-100" width="1600" height="1200" loading="lazy" decoding="async" />
                <img alt="Detail study, plaster detail." className="hidden sm:block absolute -bottom-8 -right-6 sm:-right-8 w-32 h-40 sm:w-44 sm:h-56 object-cover grayscale rotate-3 border-4 border-[#141313] shadow-2xl" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?q=80&w=400&auto=format&fit=crop&sat=-100" loading="lazy" decoding="async" />
                <img alt="Close-up portrait, eyes lowered." className="hidden md:block absolute -top-8 -left-6 w-32 h-44 lg:w-40 lg:h-56 object-cover grayscale -rotate-2 border-4 border-[#141313] shadow-2xl" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop&sat=-100" loading="lazy" decoding="async" />
              </div>
            </div>
          </section>

          {/* Archive (existing grid) */}
          <section id="archive" className="py-20 px-4 max-w-screen-2xl mx-auto snap-start sm:py-24 sm:px-8 md:py-32 md:px-16 scroll-mt-16">
            <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] mb-10 sm:mb-16 md:mb-stack-lg [text-wrap:balance]">Archive</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-gutter">
              {archive.map((a) => (
                <a key={a.caption} href={a.href} className="group block cursor-pointer rounded-sm">
                  <figure className="m-0">
                    <img alt={a.alt} className="w-full aspect-square object-cover grayscale opacity-60 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 bg-neutral-900" src={a.src} width="800" height="800" loading="lazy" decoding="async" />
                    <figcaption className="font-caption text-caption text-[#EDEDED] mt-unit opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">{a.caption}</figcaption>
                  </figure>
                </a>
              ))}
            </div>
          </section>

          {/* About */}
          <section id="about" className="py-20 px-4 max-w-screen-xl mx-auto flex flex-col md:flex-row gap-10 snap-start sm:py-24 sm:px-8 sm:gap-12 md:py-32 md:px-16 md:gap-margin-safe scroll-mt-16">
            <div className="w-full md:w-1/2">
              <img alt="Portrait of photographer holding a vintage analog camera." className="w-full h-auto object-cover grayscale bg-neutral-900 rounded-sm" src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?q=80&w=1200&auto=format&fit=crop&sat=-100" width="1200" height="800" loading="lazy" decoding="async" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-stack-md justify-center">
              <div className="font-body-md text-body-md text-[#EDEDED] space-y-stack-sm opacity-80 max-w-[65ch]">
                <p className="[text-wrap:pretty]">Inés Moreno is a documentary photographer based in Buenos Aires. Her work focuses on the intersection of memory, architecture, and marginal communities across South America. By strictly adhering to analog, black-and-white processes, she strips away the distraction of color to emphasize form, texture, and the raw emotional resonance of her subjects.</p>
                <p className="[text-wrap:pretty]">Her visual language is characterized by quiet observation, rejecting sensationalism in favor of slow, deliberate storytelling.</p>
              </div>
              <div className="mt-stack-md">
                <h4 className="font-label text-label text-neutral-500 uppercase tracking-widest mb-stack-sm">Selected Exhibitions</h4>
                <ul className="font-body-md text-body-md text-[#EDEDED] space-y-unit opacity-80 list-none p-0 m-0">
                  {exhibitions.map((e) => (
                    <li key={e.title}><span className="text-neutral-500 mr-2 tabular-nums">{e.year}</span> <em>{e.title}</em>, {e.venue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Half-Full-Bleed Artist Statement (NOVEL #7) */}
          <section className="py-20 sm:py-24 md:py-32 snap-start">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-margin-safe items-stretch">
              <div className="md:col-span-7 relative md:mr-[calc(50%-50vw)]">
                <img alt="Editorial b&w portrait of the photographer in profile, soft window light." className="w-full h-full min-h-[60vh] md:min-h-[80vh] object-cover grayscale bg-neutral-900" src="https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?q=80&w=2000&auto=format&fit=crop&sat=-100" width="2000" height="1500" loading="lazy" decoding="async" />
              </div>
              <div className="md:col-span-5 flex flex-col justify-center gap-stack-md">
                <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Statement &middot; 08</p>
                <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">A practice of staying long enough</h3>
                <div className="font-body-lg text-body-lg text-[#EDEDED] opacity-80 leading-relaxed max-w-[55ch] [text-wrap:pretty] space-y-stack-sm">
                  <p>Documentary photography, for me, is a refusal of the picture-taking economy. I work slowly, almost stupidly so &mdash; weeks in a single neighbourhood, months in a single house. I am not a witness. I am a guest who eventually stops being one.</p>
                  <p>The black-and-white is not a stylistic choice. It is what is left when colour stops doing the work for you. Form, weight, gesture, distance &mdash; the camera has to earn each of them.</p>
                </div>
                <p className="font-caption text-caption text-neutral-500 uppercase tracking-[0.15em] mt-stack-md">&mdash; Inés Moreno, Buenos Aires, 2024</p>
              </div>
            </div>
          </section>

          {/* Cycling Cross-fade — Currently Exhibiting */}
          <section className="py-20 px-4 max-w-screen-2xl mx-auto snap-start sm:py-24 sm:px-8 md:py-32 md:px-16">
            <div className="flex items-end justify-between border-b border-neutral-900 pb-stack-md mb-stack-lg">
              <div className="flex flex-col gap-stack-sm">
                <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Currently Exhibiting &middot; 09</p>
                <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">Boundaries &mdash; Galería de Arte Contemporáneo</h3>
              </div>
              <p className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">Santiago &middot; Until 14 Sept</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-margin-safe items-center">
              <div className="md:col-span-7 relative w-full aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-black">
                {cycleImgs.map((c) => (
                  <img key={c.delay} className="ines-cycle-img absolute inset-0 w-full h-full object-cover grayscale" style={{ animationDelay: c.delay }} alt={c.alt} src={c.src} loading="lazy" decoding="async" />
                ))}
              </div>
              <div className="md:col-span-5 flex flex-col gap-stack-md">
                <p className="font-body-md text-body-md text-[#EDEDED] opacity-80 max-w-[50ch] [text-wrap:pretty]">Twenty-eight plates from the <em>Boundaries</em> series, hand-printed in the Buenos Aires darkroom over the winter of 2024. Sequenced as a single uninterrupted walk &mdash; coastline, estuary, city, room.</p>
                <dl className="font-body-md text-body-md text-[#EDEDED] opacity-80 grid grid-cols-2 gap-y-stack-sm gap-x-4 max-w-md">
                  <dt className="text-neutral-500 uppercase tracking-[0.15em] font-caption text-caption">Venue</dt>
                  <dd>Galería de Arte Contemporáneo</dd>
                  <dt className="text-neutral-500 uppercase tracking-[0.15em] font-caption text-caption">City</dt>
                  <dd>Santiago, CL</dd>
                  <dt className="text-neutral-500 uppercase tracking-[0.15em] font-caption text-caption">Dates</dt>
                  <dd className="tabular-nums">04 May &mdash; 14 Sept 2025</dd>
                  <dt className="text-neutral-500 uppercase tracking-[0.15em] font-caption text-caption">Plates</dt>
                  <dd className="tabular-nums">28 silver gelatin</dd>
                </dl>
                <a className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-300 underline decoration-1 underline-offset-4 hover:text-neutral-100 transition-colors" href="#contact">Request press materials &rarr;</a>
              </div>
            </div>
          </section>

          {/* Bookended Press / Recognition (NOVEL #9) */}
          <section className="snap-start py-stack-md md:py-stack-lg">
            <img alt="Top bookend image — soft documentary photograph, urban dusk." className="w-full h-40 sm:h-56 md:h-72 object-cover grayscale bg-neutral-900" src="https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?q=80&w=2400&auto=format&fit=crop&sat=-100" width="2400" height="600" loading="lazy" decoding="async" />
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 py-16 md:py-24 flex flex-col gap-stack-lg">
              <div className="flex items-end justify-between border-b border-neutral-900 pb-stack-md">
                <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">Press &amp; Recognition</h3>
                <p className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">10</p>
              </div>
              <ol className="list-none m-0 p-0 divide-y divide-neutral-900">
                {press.map((p, i) => (
                  <li key={i} className="grid grid-cols-12 gap-4 py-stack-md items-baseline">
                    <span className="col-span-2 font-caption text-caption text-neutral-500 tabular-nums uppercase tracking-[0.15em]">{p.year}</span>
                    <span className="col-span-7 font-body-md text-body-md text-[#EDEDED] opacity-90">{p.body}</span>
                    <span className="col-span-3 font-caption text-caption text-neutral-500 uppercase tracking-[0.15em] text-right hidden sm:block">{p.tag}</span>
                  </li>
                ))}
              </ol>
            </div>
            <img alt="Bottom bookend image — soft documentary photograph, interior detail." className="w-full h-40 sm:h-56 md:h-72 object-cover grayscale bg-neutral-900" src="https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?q=80&w=2400&auto=format&fit=crop&sat=-100" width="2400" height="600" loading="lazy" decoding="async" />
          </section>

          {/* Editions / Prints Store Strip */}
          <section id="editions" className="py-20 px-4 snap-start sm:py-24 sm:px-8 md:py-32 md:px-16 bg-neutral-950 scroll-mt-16">
            <div className="max-w-screen-2xl mx-auto">
              <div className="flex items-end justify-between border-b border-neutral-900 pb-stack-md mb-stack-lg">
                <div className="flex flex-col gap-stack-sm">
                  <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Editions &middot; 11</p>
                  <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">Open prints &amp; signed editions</h3>
                </div>
                <p className="font-caption text-caption uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">Hand-printed &middot; Buenos Aires</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-gutter">
                {editions.map((e) => (
                  <article key={e.title} className="flex flex-col gap-stack-sm">
                    <img alt={e.alt} className="w-full aspect-[3/4] object-cover grayscale bg-neutral-900" src={e.src} loading="lazy" decoding="async" />
                    <p className="font-caption text-caption text-neutral-300 uppercase tracking-[0.15em]">{e.title}</p>
                    <p className="font-caption text-caption text-neutral-500">{e.spec}</p>
                    <p className="font-caption text-caption text-neutral-100 tabular-nums">{e.price}</p>
                  </article>
                ))}
              </div>
              <p className="font-caption text-caption text-neutral-500 uppercase tracking-[0.15em] mt-stack-lg">All prints hand-finished, embossed, and signed verso. Shipped flat from Buenos Aires.</p>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section id="faq" className="py-20 px-4 max-w-screen-xl mx-auto snap-start sm:py-24 sm:px-8 md:py-32 md:px-16 scroll-mt-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-lg">
              <div className="md:col-span-4 flex flex-col gap-stack-sm">
                <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Studio &middot; 12</p>
                <h3 className="font-headline-lg text-headline-lg text-[#EDEDED] [text-wrap:balance]">Frequently asked</h3>
                <p className="font-body-md text-body-md text-[#EDEDED] opacity-80 max-w-[40ch] [text-wrap:pretty]">For everything else, a quiet email is the fastest route.</p>
              </div>
              <div className="md:col-span-8 flex flex-col divide-y divide-neutral-900 border-t border-b border-neutral-900">
                {faqs.map((f) => (
                  <details key={f.q} className="ines-faq group p-5 sm:p-6">
                    <summary className="flex items-start justify-between gap-4">
                      <h4 className="font-headline-lg text-headline-lg text-[#EDEDED] text-xl sm:text-2xl m-0">{f.q}</h4>
                      <span className="ines-chevron text-neutral-500 select-none mt-1">&darr;</span>
                    </summary>
                    <p className="font-body-md text-body-md text-[#EDEDED] opacity-80 max-w-[60ch] mt-stack-sm [text-wrap:pretty]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Closer / Contact Panel */}
          <section className="py-20 px-4 max-w-screen-xl mx-auto snap-start sm:py-24 sm:px-8 md:py-32 md:px-16">
            <div className="border-t border-neutral-900 pt-stack-lg flex flex-col gap-stack-md max-w-3xl">
              <p className="font-label text-label text-neutral-500 uppercase tracking-[0.2em]">Closing &middot; 13</p>
              <h3 className="font-headline-xl text-headline-xl text-[#EDEDED] [text-wrap:balance]">If you've come this far, we should probably speak.</h3>
              <p className="font-body-lg text-body-lg text-[#EDEDED] opacity-80 max-w-[55ch] [text-wrap:pretty]">For commissions, press, or simply to say a quiet hello.</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-stack-md">
                <a className="font-body-md text-body-md text-[#EDEDED] underline decoration-1 underline-offset-4 hover:text-neutral-100 transition-colors" href="mailto:hello@example.com">hello@inesmoreno.studio</a>
                <span className="font-caption text-caption text-neutral-500 uppercase tracking-[0.2em] hidden sm:inline">Buenos Aires &middot; replies within a week</span>
              </div>
            </div>
          </section>
        </main>

        <footer id="contact" className="w-full max-w-screen-2xl mx-auto py-10 px-4 mt-16 border-t border-neutral-900 bg-[#141313] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:py-14 sm:px-8 sm:mt-20 sm:gap-8 md:py-20 md:px-16 md:mt-32 snap-start scroll-mt-16">
          <p className="font-serif text-sm italic text-neutral-400 m-0">© <span className="tabular-nums">2024</span> Inés Moreno</p>
          <nav aria-label="Footer Links" className="flex gap-8 font-serif text-sm italic text-neutral-500">
            {footerLinks.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-neutral-100 rounded-sm transition-colors duration-300">{l.label}</a>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
}
