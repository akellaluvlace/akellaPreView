export default function T19MinimalistPortfolio() {
  const navLinks = [
    { label: "Work", href: "#work", active: true, hideClass: "" },
    { label: "Tenets", href: "#tenets", hideClass: "hidden sm:inline-block" },
    { label: "Studio", href: "#studio", hideClass: "hidden md:inline-block" },
    { label: "About", href: "#about", hideClass: "" },
    { label: "Contact", href: "#contact", hideClass: "" }
  ];

  const tenets = [
    { numeral: "I", num: "01", title: "Utility before ornament.", body: "If a detail does not serve the task, it is not earning its place on the screen." },
    { numeral: "II", num: "02", title: "Hierarchy through scale, not colour.", body: "Three sizes of type and one accent are usually enough. Decide what the eye should reach first." },
    { numeral: "III", num: "03", title: "Whitespace is a primary material.", body: "A grid that breathes lets dense data sit calmly. Pack only when the user is hunting." },
    { numeral: "IV", num: "04", title: "Components stay honest.", body: "A button looks like a button. A link looks like a link. A loading state announces itself without theatre." },
    { numeral: "V", num: "05", title: "Ship, then sand.", body: "Get the structure right, put it in front of users, polish under daylight. Studio time alone never resolves the awkward edges." }
  ];

  // Image-context cleanup 2026-05-05: alts rewritten to match what each verified §D.1 ID
  // actually depicts (architectural / brutalist subset — see playbook §Q.1). The "Now Reading"
  // strip reads as a wall of architectural reference plates rather than fake content shots.
  const reading = [
    { w: "w-72", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?auto=format&fit=crop&q=80&w=600&h=800", alt: "Concrete stair · raking afternoon shadow", title: "Concrete · Vol. II", num: "001" },
    { w: "w-80", aspect: "aspect-[16/10]", src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?auto=format&fit=crop&q=80&w=800&h=500", alt: "Brutalist corridor · perspective deep into the building", title: "Corridor · Vol. III", num: "002" },
    { w: "w-72", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600&h=800", alt: "Archival fashion plate, high-contrast monochrome", title: "Plate · Helvetica", num: "003" },
    { w: "w-96", aspect: "aspect-[16/10]", src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?auto=format&fit=crop&q=80&w=900&h=560", alt: "Interior cornice detail · raking shadow across the wall", title: "Atrium · Berlin", num: "004" },
    { w: "w-72", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?auto=format&fit=crop&q=80&w=600&h=800", alt: "Minimal architectural light study · single window, slow shadow", title: "Field Note · 12", num: "005" },
    { w: "w-80", aspect: "aspect-[16/10]", src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?auto=format&fit=crop&q=80&w=800&h=500", alt: "Building aperture · facade window in late light", title: "Aperture · South", num: "006" },
    { w: "w-72", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1618488373960-404fe668e524?auto=format&fit=crop&q=80&w=600&h=800", alt: "Brick wall study · long-form weathering", title: "Wall · Mute", num: "007" }
  ];

  // studioFrames rewritten to fit architectural source imagery — process narrative still scans.
  const studioFrames = [
    { delay: "0s", src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?auto=format&fit=crop&q=80&w=1200&h=1500", thumb: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?auto=format&fit=crop&q=80&w=200&h=200", alt: "Stage 01 — the studio's east-wall reference plate, photographed first thing", stage: "Stage 01 — Research", caption: "Field interviews, archive review, audit of the existing surface." },
    { delay: "4s", src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?auto=format&fit=crop&q=80&w=1200&h=1500", thumb: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?auto=format&fit=crop&q=80&w=200&h=200", alt: "Stage 02 — working corridor of the studio at midday, after the wireframes are pinned", stage: "Stage 02 — Wireframe", caption: "Pencil first, Figma second. Information architecture is decided here." },
    { delay: "8s", src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?auto=format&fit=crop&q=80&w=1200&h=1500", thumb: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?auto=format&fit=crop&q=80&w=200&h=200", alt: "Stage 03 — material light study, the room where the system is decided", stage: "Stage 03 — System", caption: "Tokens, primitives, and the smallest set of components that carry the work." },
    { delay: "12s", src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?auto=format&fit=crop&q=80&w=1200&h=1500", thumb: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?auto=format&fit=crop&q=80&w=200&h=200", alt: "Stage 04 — final-stage interior detail, photographed before the project ships", stage: "Stage 04 — Build", caption: "Pairing with engineering. Polishing under daylight and real data." }
  ];

  const faqs = [
    { q: "What kind of work do you take on?", a: "End-to-end product design for tools that involve density, structure, or repeated tasks. Trading interfaces, logistics dashboards, design systems, internal admin. Marketing sites only when they share a system with a product." },
    { q: "How are engagements structured?", a: "Two shapes. Either a fixed six-week sprint with a defined deliverable, or a recurring weekly retainer for embedded work. Both bill at the same effective rate; the choice is about cadence." },
    { q: "Do you collaborate with engineering?", a: "Always. Final tokens and component decisions are made beside the team that will ship them. Static Figma exports without a build conversation tend to drift inside a quarter." },
    { q: "Where are you based and which timezones?", a: "Berlin · CET. Comfortable overlapping with London, New York and Sao Paulo. Asia-Pacific clients are taken case-by-case with at least one weekly synchronous block." },
    { q: "When are you next available?", a: "The studio is currently booked into Q2. Two slots open from June onward. Early conversations welcomed for the autumn cohort." }
  ];

  const projects2024 = [
    { title: "Omni Finance", desc: "High-density trading interface", year: "2024", alt: "Minimalist dashboard interface for a financial technology application, stark black and white aesthetic", src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=800" },
    { title: "Nexus Logistics", desc: "Global supply chain tracking", year: "2024", alt: "Data visualization dashboard showing complex graphs and tables in a clean, utilitarian layout", src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=800" }
  ];

  const projects2023 = [
    { title: "Arbor Systems", desc: "Design system architecture", year: "2023", alt: "Wireframe structure of a complex enterprise software application, showing structural hierarchy", src: "https://images.unsplash.com/photo-1505682614136-0a12f9f7beea?auto=format&fit=crop&q=80&w=800&h=800" },
    { title: "Vela Health", desc: "Patient management portal", year: "2023", alt: "Abstract geometric shapes representing modular software components on a white background", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=800" }
  ];

  // Selected Clients with brand marks via simpleicons.org (free CDN, monochrome SVGs by slug).
  // Color hex 1a1c1c matches the on-surface token; loading="lazy" so they don't block hero.
  const clients = [
    { name: "Figma",   slug: "figma" },
    { name: "Linear",  slug: "linear" },
    { name: "Vercel",  slug: "vercel" },
    { name: "Stripe",  slug: "stripe" },
    { name: "Raycast", slug: "raycast" },
  ];
  const socialLinks = [
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Dribbble", href: "#" }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#f9f9f9", "on-background": "#1a1c1c", "surface": "#f9f9f9", "on-surface": "#1a1c1c", "on-surface-variant": "#444748", "surface-container": "#eeeeee", "surface-container-lowest": "#ffffff", "primary": "#000000", "on-primary": "#ffffff", "secondary": "#ae3029", "outline": "#747878", "outline-variant": "#c4c7c7"
          },
          spacing: { "margin": "64px", "gutter": "32px", "section-gap": "128px" },
          fontFamily: {
            "label-bold": ["Inter"], "display-xl": ["Inter"], "headline-md": ["Inter"], "headline-lg": ["Inter"], "body-md": ["Inter"], "label-sm": ["Inter"], "body-lg": ["Inter"]
          },
          fontSize: {
            "label-bold": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
            "display-xl": ["80px", { lineHeight: "1.0", letterSpacing: "-0.04em", fontWeight: "600" }],
            "headline-md": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }],
            "headline-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "body-md": ["16px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
            "label-sm": ["12px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "500" }],
            "body-lg": ["18px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const css = `
    html, body { overflow-x: clip; }
    body { background-color: #ffffff; }
    html { scroll-behavior: smooth; }
    :target { scroll-margin-top: 5rem; }
    ::selection { background-color: #000000; color: #ffffff; }
    .text-balance { text-wrap: balance; }
    .text-pretty { text-wrap: pretty; }

    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }

    .mk-marquee-wrap { overflow: hidden; }
    .mk-marquee-track {
      display: flex;
      gap: 24px;
      width: max-content;
      animation: mk-marquee 60s linear infinite;
    }
    .mk-marquee-track:hover { animation-play-state: paused; }
    @keyframes mk-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 12px)); }
    }

    @keyframes mk-cycle-fade {
      0%, 4%   { opacity: 0; filter: blur(14px) saturate(0.85); transform: scale(1.04); }
      8%, 22%  { opacity: 1; filter: blur(0) saturate(1); transform: scale(1); }
      26%, 100%{ opacity: 0; filter: blur(14px) saturate(0.85); transform: scale(1.04); }
    }
    .mk-cycle-img {
      animation: mk-cycle-fade 16s linear infinite;
      opacity: 0;
      filter: blur(14px) saturate(0.85);
      transform: scale(1.04);
      will-change: opacity, filter, transform;
    }
    @keyframes mk-cycle-cap {
      0%, 4%   { opacity: 0; transform: translateY(6px); }
      8%, 22%  { opacity: 1; transform: translateY(0); }
      26%, 100%{ opacity: 0; transform: translateY(-6px); }
    }
    .mk-cycle-cap {
      animation: mk-cycle-cap 16s linear infinite;
      opacity: 0;
    }
    @keyframes mk-cycle-thumb {
      0%, 4%   { opacity: 0.25; }
      8%, 22%  { opacity: 1; }
      26%, 100%{ opacity: 0.25; }
    }
    .mk-cycle-thumb {
      animation: mk-cycle-thumb 16s linear infinite;
      opacity: 0.25;
    }
    @keyframes mk-scrub {
      0%   { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }
    .mk-scrub {
      animation: mk-scrub 16s linear infinite;
      transform-origin: left;
    }

    .mk-faq summary::-webkit-details-marker { display: none; }
    .mk-faq summary { list-style: none; cursor: pointer; }
    .mk-faq .mk-chevron { transition: transform 250ms ease; display: inline-block; }
    .mk-faq[open] summary .mk-chevron { transform: rotate(45deg); }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .mk-marquee-track { animation: none; }
      .mk-cycle-img { animation: none; }
      .mk-cycle-cap { animation: none; }
      .mk-cycle-thumb { animation: none; opacity: 1; }
      .mk-scrub { animation: none; transform: scaleX(1); }
      .mk-faq .mk-chevron { transition: none; }
      .mk-cycle-img:first-child { opacity: 1; filter: none; transform: none; }
      .mk-cycle-cap:first-child { opacity: 1; transform: none; }
    }
  `;

  const Tile = ({ p }) => (
    <a href="#work" className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B0322A] focus-visible:ring-offset-4">
      <div className="aspect-square w-full border border-primary bg-surface-container overflow-hidden relative">
        <img src={p.src} alt={p.alt} width="800" height="800" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale transition-transform duration-300 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]" />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 group-focus-visible:bg-primary/5 transition-colors duration-300"></div>
      </div>
      <div className="mt-6 border-t border-primary pt-3 flex justify-between items-start">
        <div>
          <h3 className="text-balance font-label-bold text-label-bold text-primary uppercase">{p.title}</h3>
          <p className="text-pretty font-body-md text-body-md text-on-surface-variant mt-1">{p.desc}</p>
        </div>
        <span className="font-label-sm text-label-sm text-outline tabular-nums">{p.year}</span>
      </div>
    </a>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="bg-surface-container-lowest text-primary antialiased font-['Inter']">
        <header className="sticky top-0 z-50 w-full border-b border-[#B0322A] bg-white">
          <nav aria-label="Main Navigation" className="flex justify-between items-center gap-3 w-full px-4 py-4 max-w-[1440px] mx-auto sm:px-6 sm:py-6 md:px-8">
            <div className="text-base font-black tracking-tighter text-neutral-900 uppercase sm:text-xl">MAREN K.</div>
            <div className="flex gap-3 items-center sm:gap-5 md:gap-8">
              {navLinks.map((l) => {
                const activeCls = "text-[#B0322A] border-b-2 border-[#B0322A] pb-1 font-['Inter'] font-bold tracking-tighter uppercase text-xs hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors duration-200 sm:text-sm rounded-sm";
                const idleCls = "text-neutral-500 pb-1 font-['Inter'] font-bold tracking-tighter uppercase text-xs hover:bg-neutral-900 hover:text-white transition-colors duration-200 sm:text-sm rounded-sm";
                return (
                  <a key={l.label} href={l.href} className={`${l.active ? activeCls : idleCls} ${l.hideClass || ""}`}>{l.label}</a>
                );
              })}
            </div>
          </nav>
        </header>

        <main className="max-w-[1440px] mx-auto px-4 w-full sm:px-6 md:px-8">
          <section className="mt-16 mb-20 grid grid-cols-12 gap-8 sm:mt-24 sm:mb-28 md:mt-32 md:mb-section-gap">
            <div className="col-span-12 md:col-span-11">
              <h1 className="text-balance font-display-xl text-[36px] leading-[1.05] text-primary sm:text-[56px] md:text-display-xl md:leading-none">
                Product designer working on systems that feel calm to use.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-8 md:col-start-5 mt-10 sm:mt-16">
              <p className="text-pretty max-w-[65ch] font-headline-md text-[20px] leading-tight text-on-surface-variant sm:text-[26px] md:text-headline-md">
                Based in Berlin, focusing on digital architecture and high-fidelity user experiences.
              </p>
            </div>
          </section>

          <section id="work" className="mb-20 sm:mb-28 md:mb-section-gap">
            <div className="border-t border-[#B0322A] pt-4 mb-10 flex justify-between items-baseline sm:mb-16">
              <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary">Selected Projects</h2>
              <span className="font-label-bold text-label-bold text-secondary">2024</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 sm:gap-y-16">
              {projects2024.map((p) => <Tile key={p.title} p={p} />)}
            </div>
          </section>

          <section className="mb-20 sm:mb-28 md:mb-section-gap">
            <div className="border-t border-[#B0322A] pt-4 mb-10 flex justify-between items-baseline sm:mb-16">
              <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary">Archive</h2>
              <span className="font-label-bold text-label-bold text-secondary">2023</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 sm:gap-y-16">
              {projects2023.map((p) => <Tile key={p.title} p={p} />)}
            </div>
          </section>

          <section id="tenets" className="mb-20 sm:mb-28 md:mb-section-gap">
            <div className="border-t border-[#B0322A] pt-4 mb-10 flex justify-between items-baseline sm:mb-16">
              <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary">Five Tenets</h2>
              <span className="font-label-bold text-label-bold text-secondary">Doctrine</span>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-4 flex flex-col">
                <div className="aspect-[3/4] w-full border border-primary bg-surface-container overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1609530142110-7af0a038c723?auto=format&fit=crop&q=80&w=900&h=1200" alt="Hairline-paper architectural detail with strong perpendicular shadows" width="900" height="1200" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale" />
                </div>
                <p className="text-pretty mt-6 max-w-[42ch] font-body-md text-body-md text-on-surface-variant">
                  A small set of operating rules. Worked out across ten years of shipping interfaces for fintech, logistics, and health. Held loosely. Reviewed often.
                </p>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-6">
                <ol className="border-t border-b border-on-surface-variant/25 divide-y divide-on-surface-variant/25">
                  {tenets.map((t) => (
                    <li key={t.numeral} className="grid grid-cols-12 gap-4 py-6 items-baseline sm:py-8">
                      <span className="col-span-2 md:col-span-1 font-label-sm text-label-sm uppercase text-[#B0322A] tracking-widest tabular-nums">{t.numeral}</span>
                      <div className="col-span-10 md:col-span-9">
                        <h3 className="font-headline-md text-[22px] leading-tight text-primary tracking-tight sm:text-[26px] md:text-headline-md">{t.title}</h3>
                        <p className="text-pretty mt-2 max-w-[55ch] font-body-md text-body-md text-on-surface-variant">{t.body}</p>
                      </div>
                      <span className="col-span-12 md:col-span-2 md:text-right font-label-sm text-label-sm text-outline tabular-nums uppercase tracking-widest">— {t.num}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="mb-20 border-y border-[#B0322A] py-10 sm:mb-28 sm:py-16 md:mb-section-gap">
            <div className="grid grid-cols-12 gap-8 items-start md:items-center">
              <div className="col-span-12 md:col-span-3 mb-4 md:mb-0">
                <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary tracking-widest">Selected Clients</h2>
              </div>
              <div className="col-span-12 md:col-span-9 flex flex-wrap gap-x-8 gap-y-5 items-center sm:gap-x-10 sm:gap-y-6 md:gap-x-12 md:gap-y-8 md:justify-between">
                {clients.map((c) => (
                  <span key={c.slug} className="group inline-flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors cursor-default">
                    <img src={`https://cdn.simpleicons.org/${c.slug}/1a1c1c`} alt={`${c.name} logo`} width="22" height="22" loading="lazy" decoding="async" className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity sm:w-6 sm:h-6" />
                    <span className="font-headline-md text-[20px] uppercase tracking-tighter sm:text-[24px] md:text-[28px]">{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section id="reading" className="mb-20 sm:mb-28 md:mb-section-gap">
            <div className="border-t border-[#B0322A] pt-4 mb-10 flex justify-between items-baseline sm:mb-16">
              <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary">Now Reading</h2>
              <span className="font-label-bold text-label-bold text-secondary">Notebook · 04</span>
            </div>
            <p className="text-pretty max-w-[60ch] font-body-md text-body-md text-on-surface-variant mb-10 sm:mb-14">
              A rolling list of monographs, archive plates and field photographs that have been on the studio desk this season.
            </p>
            <div className="full-bleed mk-marquee-wrap py-2">
              <div className="mk-marquee-track px-4 sm:px-6 md:px-8">
                {reading.map((r, i) => (
                  <figure key={`r-${i}`} className={`relative shrink-0 ${r.w} ${r.aspect} border border-primary bg-surface-container overflow-hidden`}>
                    <img src={r.src} alt={r.alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale" />
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex justify-between items-baseline bg-white/90 border-t border-[#B0322A]">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">{r.title}</span>
                      <span className="font-label-sm text-label-sm tabular-nums text-[#B0322A]">№ {r.num}</span>
                    </div>
                  </figure>
                ))}
                {reading.map((r, i) => (
                  <figure key={`r-d-${i}`} aria-hidden="true" className={`relative shrink-0 ${r.w} ${r.aspect} border border-primary bg-surface-container overflow-hidden`}>
                    <img src={r.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale" />
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex justify-between items-baseline bg-white/90 border-t border-[#B0322A]">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">{r.title}</span>
                      <span className="font-label-sm text-label-sm tabular-nums text-[#B0322A]">№ {r.num}</span>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="mb-20 sm:mb-28 md:mb-section-gap">
            <div className="border-t border-[#B0322A] pt-4 mb-16">
              <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary">About</h2>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-4">
                <div className="aspect-[3/4] w-full border border-primary bg-surface-container overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&h=1066" alt="High contrast black and white portrait of a female designer in a minimalist studio setting" width="800" height="1066" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col justify-end pb-0 md:pb-8 mt-8 md:mt-0">
                <p className="text-pretty max-w-[65ch] font-headline-lg text-[26px] leading-tight text-primary tracking-tight sm:text-[38px] md:text-headline-lg">
                  Maren is an independent product designer dedicated to creating logical, scalable structures for complex software. Drawing heavily from International Typographic Style, she believes that utility and clarity are the highest forms of aesthetics.
                </p>
              </div>
            </div>
          </section>

          <section id="studio" className="mb-20 sm:mb-28 md:mb-section-gap">
            <div className="border-t border-[#B0322A] pt-4 mb-10 flex justify-between items-baseline sm:mb-16">
              <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary">Studio · Process</h2>
              <span className="font-label-bold text-label-bold text-secondary">04 frames · 16s</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-5 md:sticky md:top-32 md:self-start">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-[#B0322A] mb-4">— Methodology</p>
                <h3 className="font-headline-lg text-[28px] leading-tight text-primary tracking-tight sm:text-[36px] md:text-headline-lg max-w-[18ch]">
                  Four moves, repeated until the page goes quiet.
                </h3>
                <p className="text-pretty mt-6 max-w-[42ch] font-body-md text-body-md text-on-surface-variant">
                  Research is the longest stretch. Wireframes resolve in pencil before they meet a Figma frame. The system is finalised after the first build, never before.
                </p>
                <div className="grid grid-cols-4 gap-3 mt-8 max-w-sm">
                  {studioFrames.map((f, i) => (
                    <div key={`thumb-${i}`} className="aspect-square border border-primary overflow-hidden bg-surface-container">
                      <img src={f.thumb} alt="" loading="lazy" decoding="async" className="mk-cycle-thumb w-full h-full object-cover grayscale" style={{ animationDelay: f.delay }} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-6 max-w-sm">
                  <div className="flex-1 h-px bg-on-surface-variant/30 relative overflow-hidden">
                    <div className="mk-scrub absolute inset-0 origin-left bg-[#B0322A]"></div>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant tabular-nums">04 / 16s</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-7 mt-10 md:mt-0">
                <figure className="relative w-full aspect-[3/4] md:aspect-[4/5] border border-primary bg-surface-container overflow-hidden">
                  {studioFrames.map((f, i) => (
                    <img key={`img-${i}`} src={f.src} alt={f.alt} loading="lazy" decoding="async" className="mk-cycle-img absolute inset-0 w-full h-full object-cover grayscale" style={{ animationDelay: f.delay }} />
                  ))}
                  <div className="absolute bottom-0 left-0 right-0 min-h-[88px] bg-white border-t border-[#B0322A] px-5 py-4">
                    {studioFrames.map((f, i) => (
                      <span key={`cap-${i}`} className="mk-cycle-cap absolute inset-x-5 top-4" style={{ animationDelay: f.delay }}>
                        <span className="block font-label-sm text-label-sm uppercase tracking-widest text-[#B0322A] tabular-nums">{f.stage}</span>
                        <span className="block mt-1 font-body-md text-body-md text-primary">{f.caption}</span>
                      </span>
                    ))}
                  </div>
                </figure>
              </div>
            </div>
          </section>

          <section id="faq" className="mb-20 sm:mb-28 md:mb-section-gap">
            <div className="border-t border-[#B0322A] pt-4 mb-10 flex justify-between items-baseline sm:mb-16">
              <h2 className="text-balance font-label-bold text-label-bold uppercase text-primary">Common Questions</h2>
              <span className="font-label-bold text-label-bold text-secondary">FAQ</span>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-4">
                <div className="aspect-[4/5] w-full border border-primary bg-surface-container overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1685787773514-90e8e14af797?auto=format&fit=crop&q=80&w=800&h=1000" alt="Studio interior — light study, the room where most of the work happens before it reaches the screen" width="800" height="1000" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale" />
                </div>
                <p className="text-pretty mt-6 max-w-[40ch] font-body-md text-body-md text-on-surface-variant">
                  Practical answers, kept short. For anything not covered, the studio replies inside two working days.
                </p>
              </div>
              {/* Right rail: FAQ list + availability card. flex-col + flex-1 on the card so its
                  height stretches to match the left rail's bottom (image aspect-[4/5] + paragraph
                  is taller than 5 collapsed FAQ rows). */}
              <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col">
                <div className="border-t border-b border-on-surface-variant/25 divide-y divide-on-surface-variant/25">
                  {faqs.map((f, i) => (
                    <details key={`faq-${i}`} className="mk-faq group py-5 sm:py-6">
                      <summary className="flex justify-between items-baseline gap-6">
                        <h3 className="font-headline-md text-[20px] leading-tight text-primary tracking-tight sm:text-[22px]">{f.q}</h3>
                        <span className="mk-chevron font-headline-md text-[24px] leading-none text-[#B0322A] tabular-nums select-none" aria-hidden="true">+</span>
                      </summary>
                      <p className="text-pretty mt-4 max-w-[60ch] font-body-md text-body-md text-on-surface-variant">{f.a}</p>
                    </details>
                  ))}
                </div>
                <aside className="mt-8 sm:mt-10 flex-1 flex flex-col gap-5 p-6 sm:p-8 border border-primary bg-surface-container">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-label-bold text-label-bold uppercase text-[#B0322A] tracking-widest">— Next Availability</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant tabular-nums">Q3 · 2026</span>
                  </div>
                  <p className="text-pretty font-headline-md text-[20px] leading-tight text-primary tracking-tight sm:text-[22px] max-w-[40ch]">
                    The studio is currently booked into Q2. Two slots open from June onward.
                  </p>
                  <p className="text-pretty font-body-md text-body-md text-on-surface-variant max-w-[60ch]">
                    Early conversations welcomed for the autumn cohort. A short brief and a deadline are enough — no scoping document required to start the conversation.
                  </p>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 mt-auto pt-5 border-t border-on-surface-variant/25">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">hello@example.com · CET</span>
                    <a href="mailto:hello@example.com" className="font-label-bold text-label-bold uppercase text-primary border-b-2 border-[#B0322A] pb-1 hover:text-[#B0322A] transition-colors">Get in touch →</a>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>

        <footer id="contact" className="w-full border-t border-[#B0322A] bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-4 py-8 gap-6 max-w-[1440px] mx-auto sm:px-6 sm:py-12 sm:gap-8 md:px-8">
            <div className="font-['Inter'] text-xs font-medium uppercase tracking-widest text-neutral-900 tabular-nums">© 2024 MAREN K. DESIGN OFFICE</div>
            <nav aria-label="Social Links" className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-8">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} className="font-['Inter'] text-xs font-medium uppercase tracking-widest text-neutral-500 hover:text-[#B0322A] transition-colors rounded-sm">{s.label}</a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
