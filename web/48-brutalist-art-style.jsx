export default function T48BrutalistArtStyle() {
  const navItems = [
    { label: "EXHIBITIONS", href: "#exhibitions", current: true, prefix: ">" },
    { label: "PROGRAMS", href: "#programs" },
    { label: "COLLECTION", href: "#collection" },
    { label: "RESEARCH", href: "#research" }
  ];

  const photoIndex = [
    { fig: "FIG.02", title: "FACADE_03", size: "94×120", filled: false, src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=900&auto=format&fit=crop", alt: "Brutalist concrete facade with shadow grid" },
    { fig: "FIG.03", title: "TOWER_M",   size: "88×120", filled: false, src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=900&auto=format&fit=crop", alt: "High-rise concrete tower in stark light" },
    { fig: "FIG.04", title: "INT_RAW",   size: "72×96",  filled: true,  src: "https://images.unsplash.com/photo-1618488373960-404fe668e524?q=80&w=900&auto=format&fit=crop", alt: "Stripped industrial interior with raw concrete" },
    { fig: "FIG.05", title: "CANTILEVER",size: "96×72",  filled: false, src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop", alt: "Geometric concrete cantilever roofline" },
    { fig: "FIG.06", title: "COL_DET",   size: "120×80", filled: false, src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?q=80&w=900&auto=format&fit=crop", alt: "Architectural detail of columns and shadow" }
  ];

  const programs = [
    { tag: "LECTURE",    tagCls: "bg-primary text-surface",                  num: "01", title: "CONCRETE / DECAY",      when: "11.04.94 / 19:30" },
    { tag: "SCREENING",  tagCls: "bg-secondary text-on-secondary",           num: "02", title: "SIGNAL / NOISE / VIDEO",when: "11.18.94 / 21:00" },
    { tag: "WORKSHOP",   tagCls: "bg-surface border-2 border-primary text-primary", num: "03", title: "RISO / TYPESETTING",    when: "12.06.94 / 14:00" },
    { tag: "SYMPOSIUM",  tagCls: "bg-surface border-2 border-primary text-primary", num: "04", title: "SYSTEMIC FORM 1995",    when: "01.21.95 / 10:00" }
  ];

  const tenets = [
    { numeral: "I",   title: "RAWNESS OVER POLISH", body: "Material is not a metaphor. Concrete is concrete. A circuit board is a circuit board. The work is not allowed to forget what it is made of.", chip: "[ TENET_01 ]" },
    { numeral: "II",  title: "SYSTEM BEFORE STYLE", body: "Every exhibition begins as a constraint, not a moodboard. Style is what is left after the system has been satisfied.", chip: "[ TENET_02 ]" },
    { numeral: "III", title: "DOCUMENT EVERYTHING", body: "If it was not photographed, measured, and indexed, it did not happen. The archive outlives the exhibition.", chip: "[ TENET_03 ]" },
    { numeral: "IV",  title: "DECAY IS A MEDIUM",   body: "Things that fall apart in public are more honest than things that do not. We refuse to seal what was meant to weather.", chip: "[ TENET_04 ]" },
    { numeral: "V",   title: "REFUSE THE SOFT EXIT",body: "No fade. No swell. End where the work ends. The viewer leaves the building with the same nervous system they arrived in.", chip: "[ TENET_05 ]" }
  ];

  const exhibitions = [
    {
      tag: "CURRENT",
      tagFilled: true,
      title: "DECAY VECTORS",
      datetime: "1994-10-12",
      dates: ["10.12.94", "01.15.95"],
      artist: "MARIA KOZLOV",
      img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
      alt: "High contrast geometric concrete structure against a stark sky",
      details: [
        { label: "// VENUE",   value: "HALL_03 · FLR_02"    },
        { label: "// HOURS",   value: "11:00 — 19:00"       },
        { label: "// OPEN",    value: "TUE — SUN"           },
        { label: "// ADM.",    value: "FREE / DONATION"     },
      ]
    },
    {
      tag: "UPCOMING",
      tagFilled: false,
      title: "SYSTEMIC FAILURE",
      datetime: "1995-02-01",
      dates: ["02.01.95", "04.10.95"],
      artist: "J.T. BARKER & THE COLLECTIVE",
      img: "https://images.unsplash.com/photo-1448318440207-ef1893eb8ac0?q=80&w=1000&auto=format&fit=crop",
      alt: "Tangled wires and industrial metallic debris in high contrast",
      details: [
        { label: "// VENUE",   value: "HALL_05 · FLR_03"    },
        { label: "// PREVIEW", value: "01.31.95 · 18:00"    },
        { label: "// TICKETS", value: "REQ / RSVP"          },
        { label: "// CURATOR", value: "N. RIVERA"           },
      ]
    }
  ];

  // Inlined-component to share markup between the desktop sidebar and the
  // mobile nav. NOTE: we do NOT use a conditional JSX spread for aria-current
  // here — `{...(cond ? {"aria-current":"page"} : {})}` was triggering a
  // runaway `_extends` recursion in Babel-standalone's helper inside the
  // preview iframe (call-stack overflow). React skips an attribute when the
  // prop value is `undefined`, so a plain conditional attribute is
  // equivalent and avoids the spread path entirely.
  // Premium contrasted navbar: pure black bg + white text. Mobile mirrors
  // the same block with a row-divider variant and chunky offset shadow.
  const NavLink = ({ item, isMobile, isLast }) => {
    const baseColor = item.current
      ? "text-secondary hover:bg-surface hover:text-primary"
      : "text-surface hover:bg-surface hover:text-primary";
    const labelClasses = [
      isMobile ? "" : "font-h3",
      "uppercase tracking-wide",
      isMobile ? "" : "pl-2",
      item.prefix && !isMobile ? " before:content-['>'] before:-ml-4 before:absolute relative" : "",
      item.prefix && isMobile ? " before:content-['>'] before:mr-2" : "",
    ].join(" ");
    const mobileClasses = isMobile
      ? `flex items-center justify-between py-3 px-3 ${baseColor} transition-none font-h3 tracking-wide${isLast ? "" : " border-b-2 border-surface/30"}`
      : `group flex items-center justify-between py-2 ${baseColor} transition-none`;
    return (
      <a
        href={item.href}
        aria-current={item.current ? "page" : undefined}
        className={mobileClasses}
      >
        <span className={labelClasses}>{item.label}</span>
        <span
          className={`material-symbols-outlined ${isMobile ? "" : "pr-2 group-hover:translate-x-1 transition-transform"}`}
          aria-hidden="true"
        >
          arrow_right_alt
        </span>
      </a>
    );
  };

  const disciplines = [
    {
      numeral: "I",
      icon: "apartment",
      title: "EXHIBITION ARCHITECTURE",
      body: "Permanent occupation of an unfinished concrete wing. Every wall is load-bearing; every constraint is the curatorial brief.",
      chip: "HALL_03",
      featured: true,
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop",
      alt: "Brutalist concrete cantilever exhibition wing"
    },
    {
      numeral: "II",
      icon: "photo_camera",
      title: "PHOTOGRAPHIC RECORD",
      body: "Silver-gelatin documentation of every installation, every dismantling. The negative is the canonical artefact.",
      chip: "REF_0046",
      axisLabel: "AXIS_02",
      img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=1400&auto=format&fit=crop",
      alt: "Concrete tower block in stark light"
    },
    {
      numeral: "III",
      icon: "menu_book",
      title: "PUBLISHED RESEARCH",
      body: "Risograph monographs printed in-house each season. Distribution is institutional, not commercial.",
      chip: "VOL_07",
      axisLabel: "AXIS_03",
      img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1400&auto=format&fit=crop",
      alt: "Brutalist facade with shadow grid"
    },
    {
      numeral: "IV",
      icon: "groups",
      title: "PUBLIC INSTRUCTION",
      body: "Open lectures, screenings and symposia. Free entry. The audience is part of the constraint.",
      chip: "SCREENING_02",
      axisLabel: "AXIS_04",
      img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?q=80&w=1400&auto=format&fit=crop",
      alt: "Architectural columns and shadow detail"
    }
  ];

  // Pre-computed per-card border classes — no template-string interpolation
  // inside .map() (avoids Tailwind purge gotcha + keeps strings static).
  const disciplineBorderCls = [
    "border-b-2 md:border-b-2 md:border-r-2 border-primary",
    "border-b-2 md:border-b-2 border-primary",
    "border-b-2 md:border-b-0 md:border-r-2 border-primary",
    ""
  ];

  const reviews = [
    { quote: "UNIT 07 refuses the gallery's politeness. What you walk into is closer to a structural autopsy than an exhibition.", source: "FRIEZE · 11.94", id: "REV_01" },
    { quote: "The most rigorous editorial position to come out of Berlin in a decade. Read the wall labels — they are the work.", source: "THE GUARDIAN · 02.95", id: "REV_02" },
    { quote: "There is no merchandise. There is no soft exit. UNIT 07 is the rare institution that means what it printed.", source: "MONOPOL · 04.95", id: "REV_03" }
  ];

  const partnerSlugs = [
    { slug: "behance", name: "Behance" },
    { slug: "dribbble", name: "Dribbble" },
    { slug: "vimeo", name: "Vimeo" },
    { slug: "medium", name: "Medium" },
    { slug: "issuu", name: "Issuu" },
    { slug: "wetransfer", name: "WeTransfer" },
    { slug: "theguardian", name: "The Guardian" },
    { slug: "substack", name: "Substack" }
  ];

  // Pre-computed border classes for the 8-cell partners grid (mirrors HTML).
  const partnerBorderCls = [
    "border-r-0 sm:border-r-2 lg:border-r-2 last:border-r-0 border-b-2 lg:border-b-0 border-primary",
    "border-r-0 sm:border-r-2 lg:border-r-2 last:border-r-0 border-b-2 lg:border-b-0 border-primary",
    "border-r-0 sm:border-r-0 lg:border-r-2 border-b-2 lg:border-b-0 border-primary",
    "border-r-0 sm:border-r-2 lg:border-r-2 border-b-2 lg:border-b-0 border-primary",
    "border-r-0 sm:border-r-2 lg:border-r-2 border-b-2 lg:border-b-0 border-primary",
    "border-r-0 sm:border-r-2 lg:border-r-2 border-b-2 lg:border-b-0 border-primary",
    "border-r-0 sm:border-r-0 lg:border-r-2 border-b-2 sm:border-b-2 lg:border-b-0 border-primary",
    "border-primary"
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#000000", "secondary": "#0000e1",
                "surface": "#ffffff", "surface-dim": "#dadada", "surface-container": "#eeeeee", "surface-container-highest": "#e2e2e2",
                "on-primary": "#ffffff", "on-secondary": "#ffffff",
                "outline": "#7e7576", "outline-variant": "#cfc4c5"
              },
              borderWidth: { "1": "1px", "2": "2px", "3": "3px", "4": "4px" },
              spacing: { unit: "4px", "p-base": "24px", "p-lg": "40px" },
              fontFamily: {
                h1: ["Times New Roman", "Times", "serif"],
                h2: ["Times New Roman", "Times", "serif"],
                h3: ["Times New Roman", "Times", "serif"],
                body: ["Times New Roman", "Times", "serif"],
                "data-sm": ["Courier New", "Courier", "monospace"],
                "data-lg": ["Courier New", "Courier", "monospace"],
                label: ["Courier New", "Courier", "monospace"]
              },
              fontSize: {
                h1: ["clamp(4rem, 12vw, 10rem)", { lineHeight: "0.85", letterSpacing: "-0.04em", fontWeight: "900" }],
                h2: ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
                h3: ["24px", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" }],
                body: ["20px", { lineHeight: "1.4", fontWeight: "400" }],
                "data-lg": ["16px", { lineHeight: "1.4", fontWeight: "400" }],
                "data-sm": ["13px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.05em" }]
              }
            }
          }
        };
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        ::selection { background-color: #0000e1; color: #ffffff; }
        body { background-color: #ffffff; color: #000000; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        *:focus-visible { outline: 2px solid #0000e1; outline-offset: 2px; }
        .img-brutalist { filter: grayscale(100%) contrast(120%) brightness(95%); transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .group:hover .img-brutalist { filter: grayscale(0%) contrast(105%) brightness(100%); }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }
        .hover-bold-fix::before { display: block; content: attr(data-text); font-weight: 900; height: 0; overflow: hidden; visibility: hidden; }
      ` }} />

      <div className="scroll-smooth bg-surface text-primary font-body flex flex-col md:flex-row min-h-screen">
        {/* Sidebar Navigation — PREMIUM CONTRASTED */}
        <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 border-r-4 border-primary bg-primary text-surface z-40 flex-col justify-between shadow-[6px_0_0_0_#0000e1]" aria-label="Main Navigation">
          <div className="flex flex-col p-p-base pb-0">
            <div className="mb-16">
              <h2 className="font-h3 text-surface uppercase mb-2 tracking-wide">INDEX</h2>
              <div className="font-data-sm text-surface border-b-2 border-surface pb-2">V.07 / DE</div>
            </div>
            <ul className="flex flex-col gap-1 w-full" role="list">
              {navItems.map(item => (
                <li key={item.label}>
                  <NavLink item={item} isMobile={false} />
                </li>
              ))}
            </ul>
            <a href="#inquiry" className="mt-8 inline-flex items-center justify-between py-3 px-3 bg-secondary text-on-secondary border-2 border-surface font-data-sm uppercase tracking-wider shadow-[4px_4px_0_0_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#ffffff] transition-transform">
              <span>INQUIRE</span>
              <span className="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
            </a>
          </div>
          <div className="p-p-base border-t-2 border-surface">
            <div className="font-data-sm text-surface uppercase leading-tight">
              EST. 1994<br />BERLIN, DE
            </div>
          </div>
        </nav>

        {/* Main Canvas */}
        <main className="w-full md:ml-64 flex flex-col relative z-10">
          {/* Hero */}
          <section className="min-h-[85vh] flex flex-col md:flex-row border-b-2 border-primary bg-surface relative">
            <div className="w-full md:w-1/2 p-p-base md:p-p-lg flex flex-col justify-between z-10">
              <h1 className="font-h1 text-primary break-words max-w-full text-balance">UNIT 07</h1>
              <div className="mt-12 flex flex-col gap-6">
                <p className="font-body text-primary uppercase max-w-[40ch] text-pretty">
                  Berlin's premier experimental art space. Documenting the intersection of brutalist architecture, digital decay, and systemic structures.
                </p>
                <nav className="md:hidden flex flex-col gap-0 border-2 border-primary bg-primary text-surface shadow-[6px_6px_0_0_#0000e1]" aria-label="Mobile Navigation">
                  {navItems.map((item, i) => (
                    <NavLink key={item.label} item={item} isMobile isLast={i === navItems.length - 1} />
                  ))}
                </nav>
              </div>
            </div>

            <div className="hidden md:block w-1/2 border-l-2 border-primary bg-surface-dim relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2000&auto=format&fit=crop"
                alt="Stark brutalist concrete architecture with sharp geometric shadows"
                className="absolute inset-0 w-full h-full object-cover img-brutalist"
                width="1000"
                height="1200"
                loading="eager"
                decoding="async"
              />
              <div className="absolute bottom-0 right-0 bg-surface border-t-2 border-l-2 border-primary px-4 py-2 font-data-sm text-primary uppercase">
                FIG. 01 — ARCHITECTURE
              </div>
            </div>
          </section>

          {/* Trusted-By / Press Ledger */}
          <section className="w-full border-b-2 border-primary bg-surface" aria-label="Press and Institutional Partners">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-p-base md:px-p-lg md:py-6 border-b-2 border-primary gap-4">
              <div className="font-data-sm text-primary uppercase tracking-wide">// PRESS &amp; PARTNERS · N=08</div>
              <div className="font-data-sm text-primary/70 uppercase tabular-nums">REF / 0052 // PUBLIC RECORD</div>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 w-full" role="list">
              {partnerSlugs.map((p, i) => (
                <li key={p.slug} className={`aspect-[3/2] flex items-center justify-center px-6 ${partnerBorderCls[i]}`}>
                  <img src={`https://cdn.simpleicons.org/${p.slug}`} alt={p.name} className="h-6 w-auto opacity-80 grayscale brightness-0" loading="lazy" decoding="async" width="80" height="24" />
                </li>
              ))}
            </ul>
          </section>

          {/* Exhibitions */}
          <section id="exhibitions" className="flex flex-col w-full" aria-label="Current and Upcoming Exhibitions">
            {exhibitions.map(ex => (
              <article key={ex.title} className="group relative flex flex-col md:flex-row border-b-2 border-primary w-full bg-surface hover:bg-surface-container transition-colors duration-0">
                <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square border-b-2 md:border-b-0 md:border-r-2 border-primary overflow-hidden relative">
                  <img
                    src={ex.img}
                    alt={ex.alt}
                    className="w-full h-full object-cover img-brutalist"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="800"
                  />
                  <div className={`absolute top-0 left-0 ${ex.tagFilled ? "bg-primary text-surface" : "bg-surface border-2 border-primary"} px-3 py-1 font-data-sm m-4 z-10 pointer-events-none`}>
                    {ex.tag}
                  </div>
                </div>
                <div className="w-full md:w-2/3 p-p-base md:p-p-lg flex flex-col justify-between min-h-[300px]">
                  <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4 md:gap-8">
                    <h2 className="font-h2 text-primary w-full md:w-3/4 text-balance group-hover:underline decoration-4 underline-offset-4">
                      <a href="#" className="before:absolute before:inset-0 focus-visible:outline-none focus:underline">
                        {ex.title}
                      </a>
                    </h2>
                    <time dateTime={ex.datetime} className="font-data-lg text-primary md:text-right w-full md:w-1/4 tabular-nums block">
                      {ex.dates[0]}<br />{ex.dates[1]}
                    </time>
                  </div>
                  {/* Centered sidebar-style info card (fills empty space) */}
                  <div className="my-6 max-w-md md:max-w-sm md:mx-auto w-full relative z-10">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-2 border-primary bg-surface p-4 md:p-5 font-data-sm text-primary uppercase tracking-wide">
                      {ex.details.map(d => (
                        <React.Fragment key={d.label}>
                          <dt className="opacity-50">{d.label}</dt>
                          <dd className="text-right tabular-nums">{d.value}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </div>
                  <div className="pt-4 border-t-2 border-primary/20 font-body text-primary uppercase tracking-wide flex justify-between items-end">
                    <span>{ex.artist}</span>
                    <span className="material-symbols-outlined text-4xl text-secondary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">arrow_outward</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Photographic Index — image strip */}
          <section className="w-full border-b-2 border-primary bg-surface" aria-label="Photographic Index">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end p-p-base md:p-p-lg border-b-2 border-primary gap-4">
              <div>
                <div className="font-data-sm text-primary uppercase mb-2">// PHOTOGRAPHIC INDEX</div>
                <h2 className="font-h2 text-primary text-balance">VOL.07 / N=05</h2>
              </div>
              <div className="font-data-sm text-primary uppercase tabular-nums text-left md:text-right">
                DEPT. ARCHIVE<br />HALL_03, FLR_02
              </div>
            </div>
            <ol className="grid grid-cols-2 md:grid-cols-5 w-full" role="list">
              {photoIndex.map((p, i) => (
                <li key={p.fig} className={`group relative aspect-square ${i < photoIndex.length - 1 ? "md:border-r-2" : ""} ${i < photoIndex.length - 1 ? "border-b-2 md:border-b-0" : ""} border-primary overflow-hidden`}>
                  <img src={p.src} alt={p.alt} className="w-full h-full object-cover img-brutalist" loading="lazy" decoding="async" width="900" height="900" />
                  <div className={`absolute top-0 left-0 ${p.filled ? "bg-secondary text-on-secondary" : "bg-surface text-primary"} border-r-2 border-b-2 border-primary px-2 py-1 font-data-sm uppercase`}>{p.fig}</div>
                  <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-surface border-t-2 border-primary font-data-sm text-primary uppercase flex justify-between"><span>{p.title}</span><span className="tabular-nums opacity-60">{p.size}</span></div>
                </li>
              ))}
            </ol>
            <div className="border-t-2 border-primary px-p-base md:px-p-lg py-3 flex flex-col md:flex-row justify-between gap-2 font-data-sm text-primary uppercase">
              <span>PHOTOGRAPHS · UNIT 07 ARCHIVE · 1994–1995</span>
              <span className="tabular-nums opacity-60">REF / 0046–0051 // SILVER GELATIN</span>
            </div>
          </section>

          {/* Programs */}
          <section id="programs" className="flex flex-col w-full border-b-2 border-primary" aria-label="Public Programs">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end p-p-base md:p-p-lg border-b-2 border-primary gap-4">
              <div>
                <div className="font-data-sm text-primary uppercase mb-2">// PROGRAMS</div>
                <h2 className="font-h2 text-primary text-balance">PUBLIC INSTRUCTION</h2>
              </div>
              <div className="font-data-sm text-primary uppercase tabular-nums text-left md:text-right">
                Q4.1994 — Q1.1995<br />HALL_01 / SCREENING_02
              </div>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-4 w-full" role="list">
              {programs.map((p, i) => (
                <li key={p.title} className={`group relative flex flex-col p-p-base md:p-p-lg ${i < programs.length - 1 ? "border-b-2 md:border-b-0 md:border-r-2" : ""} border-primary hover:bg-surface-container transition-colors duration-0 min-h-[280px]`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`${p.tagCls} px-2 py-1 font-data-sm uppercase`}>{p.tag}</span>
                    <span className="font-data-sm text-primary uppercase tabular-nums">{p.num}</span>
                  </div>
                  <h3 className="font-h3 text-primary uppercase mt-auto group-hover:underline decoration-2 underline-offset-4">{p.title}</h3>
                  <div className="mt-4 pt-4 border-t-2 border-primary/20 font-data-sm text-primary uppercase flex justify-between items-end">
                    <span>{p.when}</span>
                    <span className="material-symbols-outlined text-3xl text-secondary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">arrow_outward</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Five Tenets / Doctrine */}
          <section id="research" className="w-full p-p-base md:p-p-lg border-b-2 border-primary bg-surface" aria-label="Five Tenets of the Programme">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4 flex flex-col">
                <div className="font-data-sm text-primary uppercase mb-4">// DOCTRINE</div>
                <h2 className="font-h2 text-primary text-balance mb-8">FIVE TENETS OF THE PROGRAMME</h2>
                <p className="font-body text-primary uppercase max-w-[40ch] mb-8">
                  Editorial position drafted at the founding of UNIT 07. Reissued annually. Read aloud at the opening of each season.
                </p>
                <blockquote className="border-l-4 border-secondary pl-4 mt-auto font-body text-primary italic">
                  "FORM IS A SYMPTOM OF THE STRUCTURE BEHIND IT. WE STUDY THE SYMPTOM."
                  <cite className="block mt-3 font-data-sm not-italic uppercase text-primary/70">— FOUNDING NOTE · 09.1994</cite>
                </blockquote>
              </div>
              <ol className="md:col-span-7 md:col-start-6 border-t-2 border-b-2 border-primary divide-y-2 divide-primary" role="list">
                {tenets.map(t => (
                  <li key={t.numeral} className="grid grid-cols-12 gap-4 py-6">
                    <span className="col-span-2 md:col-span-1 font-h2 text-secondary tabular-nums leading-none">{t.numeral}</span>
                    <div className="col-span-10 md:col-span-9">
                      <h3 className="font-h3 text-primary uppercase mb-2">{t.title}</h3>
                      <p className="font-body text-primary">{t.body}</p>
                    </div>
                    <span className="col-span-12 md:col-span-2 font-data-sm text-primary uppercase md:text-right tabular-nums self-start">{t.chip}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Four Disciplines — Premium 2x2 Image-BG Cards */}
          <section className="w-full border-b-2 border-primary bg-surface" aria-label="Four Disciplines">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end p-p-base md:p-p-lg border-b-2 border-primary gap-4">
              <div>
                <span className="block font-data-sm text-primary uppercase mb-2 tracking-wide">// FOUR DISCIPLINES</span>
                <h2 className="font-h2 text-primary text-balance">PROGRAMME AXES</h2>
              </div>
              <div className="font-data-sm text-primary uppercase tabular-nums text-left md:text-right">
                AXES I — IV<br />UNIT 07 / 1995
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              {disciplines.map((d, i) => (
                <article key={d.numeral} className={`group relative min-h-[420px] md:min-h-[480px] overflow-hidden ${disciplineBorderCls[i]} ${d.featured ? "ring-4 ring-secondary ring-inset" : ""}`}>
                  <img src={d.img} alt={d.alt} className="absolute inset-0 w-full h-full object-cover img-brutalist" loading="lazy" decoding="async" width="1400" height="1050" />
                  <div className="absolute inset-0 bg-primary/70" />
                  <div className="relative z-10 flex flex-col h-full min-h-[420px] md:min-h-[480px] p-p-base md:p-p-lg text-surface">
                    <div className="flex items-start justify-between">
                      <span className="font-h2 italic text-secondary leading-none">{d.numeral}</span>
                      {d.featured ? (
                        <span className="bg-secondary text-on-secondary px-2 py-1 font-data-sm uppercase tracking-wide">PRIMARY</span>
                      ) : (
                        <span className="border-2 border-surface px-2 py-1 font-data-sm uppercase tracking-wide">{d.axisLabel}</span>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-5xl mt-8 text-surface" aria-hidden="true">{d.icon}</span>
                    <h3 className="font-h3 uppercase mt-4 tracking-wide">{d.title}</h3>
                    <p className="font-body mt-3 max-w-[48ch] text-surface/90">{d.body}</p>
                    <div className="mt-auto pt-6 border-t-2 border-surface/30 font-data-sm uppercase flex justify-between items-end">
                      <span className="bg-surface text-primary px-2 py-1 tracking-wide">{d.chip}</span>
                      <span className="material-symbols-outlined text-3xl translate-x-0 group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_outward</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Press / Reviews — Quote Ledger */}
          <section id="press" className="w-full border-b-2 border-primary bg-surface-container" aria-label="Press and Reviews">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end p-p-base md:p-p-lg border-b-2 border-primary gap-4">
              <div>
                <span className="block font-data-sm text-primary uppercase mb-2 tracking-wide">// PRESS LEDGER</span>
                <h2 className="font-h2 text-primary text-balance">CRITICAL RECEPTION</h2>
              </div>
              <div className="font-data-sm text-primary uppercase tabular-nums text-left md:text-right">
                REVIEWS · N=03<br />1994 — 1995
              </div>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-3 w-full" role="list">
              {reviews.map((r, i) => (
                <li key={r.id} className={`group flex flex-col p-p-base md:p-p-lg bg-surface min-h-[300px] ${i < reviews.length - 1 ? "border-b-2 md:border-b-0 md:border-r-2 border-primary" : ""}`}>
                  <span className="material-symbols-outlined text-4xl text-secondary leading-none" aria-hidden="true">format_quote</span>
                  <blockquote className="font-h3 text-primary mt-4 normal-case leading-tight">"{r.quote}"</blockquote>
                  <div className="mt-auto pt-6 border-t-2 border-primary/20 font-data-sm uppercase flex justify-between items-end">
                    <span>{r.source}</span>
                    <span className="bg-primary text-surface px-2 py-1 tracking-wide">{r.id}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Archive — premium initial state w/ layered patterns + corner brackets + status caps; popping image fill preserved */}
          <section className="w-full p-p-base md:p-p-lg border-b-2 border-primary bg-surface-container min-h-[40vh] flex flex-col justify-center items-center overflow-hidden relative group">
            {/* Background pattern layer 1: dot grid */}
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            {/* Background pattern layer 2: diagonal stripes (cross-hatch with the dots) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, black 0 1px, transparent 1px 14px)" }} />
            {/* Edge vignette for depth */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)" }} />
            {/* 4 corner brackets (technical-readout chrome) */}
            <div aria-hidden="true" className="absolute top-4 left-4 w-10 h-10 md:w-12 md:h-12 border-l-2 border-t-2 border-primary pointer-events-none z-10" />
            <div aria-hidden="true" className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 border-r-2 border-t-2 border-primary pointer-events-none z-10" />
            <div aria-hidden="true" className="absolute bottom-4 left-4 w-10 h-10 md:w-12 md:h-12 border-l-2 border-b-2 border-primary pointer-events-none z-10" />
            <div aria-hidden="true" className="absolute bottom-4 right-4 w-10 h-10 md:w-12 md:h-12 border-r-2 border-b-2 border-primary pointer-events-none z-10" />
            {/* Top status caption (centred) */}
            <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 font-data-sm text-primary uppercase tracking-widest pointer-events-none whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-secondary animate-pulse" aria-hidden="true" />
              // ARCHIVE · 1994 — PRESENT · N=247
            </div>
            <a href="#" className="font-h1 text-primary hover:text-surface relative z-10 flex items-center justify-center w-full h-full focus-visible:outline-none" aria-label="View complete archive">
              <span className="absolute inset-x-0 inset-y-[-20px] scale-y-0 group-hover:scale-y-100 group-focus-within:scale-y-100 transition-transform origin-bottom duration-300 ease-out z-[-1] overflow-hidden" aria-hidden="true">
                <img src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?q=80&w=1600&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90" />
                <span className="absolute inset-0 bg-secondary mix-blend-multiply" />
                <span className="absolute inset-0 bg-secondary/40" />
              </span>
              ARCHIVE
            </a>
            {/* Bottom mono caption (centred) */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-3 font-data-sm text-primary uppercase tracking-widest opacity-70 pointer-events-none whitespace-nowrap">
              <span className="tabular-nums">// HOVER_TO_ACCESS</span>
              <span className="w-px h-3 bg-primary/40" />
              <span className="tabular-nums">SILVER_GELATIN</span>
              <span className="w-px h-3 bg-primary/40" />
              <span className="tabular-nums">UPDATED MMXXIV</span>
            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col md:flex-row justify-between items-start md:items-center w-full p-p-base md:p-6 bg-surface border-t-2 border-primary font-data-sm text-primary uppercase gap-4 z-20">
            <div className="tabular-nums whitespace-nowrap">©UNIT 07. ALL DATA PERSISTS.</div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 tabular-nums w-full md:w-auto md:justify-end">
              <a href="mailto:INFO@UNIT07.ORG" className="hover:bg-primary hover:text-surface px-1 -ml-1 transition-none">INFO@UNIT07.ORG</a>
              <span>LOC: 52.5200° N, 13.4050° E</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
                STATUS: ACTIVE
              </span>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
