export default function T20BrutalistCreativePortfolio() {
  const navLinks = ["ARCHIVE", "LABS", "BIOGRAPHY", "SAY_HELLO"];
  const capabilities = ["BRUTALIST UI", "CREATIVE CODING", "TYPOGRAPHIC SYSTEMS", "DIGITAL DESTRUCTION"];

  const trustedBrands = [
    { name: "Behance",  slug: "behance"  },
    { name: "Dribbble", slug: "dribbble" },
    { name: "Vimeo",    slug: "vimeo"    },
    { name: "Medium",   slug: "medium"   },
    { name: "Framer",   slug: "framer"   },
    { name: "Figma",    slug: "figma"    },
    { name: "Webflow",  slug: "webflow"  },
    { name: "Notion",   slug: "notion"   }
  ];

  const lanes = [
    {
      roman: "I",
      chip: "▸ FLAGSHIP",
      chipCls: "bg-[#C6FF3F] text-primary",
      featured: true,
      hoverShadow: "hover:shadow-[8px_8px_0_0_#C6FF3F]",
      icon: "architecture",
      title: "RAW INTERFACES",
      body: "Brutalist UI for products that refuse to look like everyone else. Naked grids, exposed seams, type that bites. Built native, hand-tuned, no design-system templates.",
      meta: "// 28 SHIPPED · 7 SOTD",
      img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1200&q=80&auto=format&fit=crop"
    },
    {
      roman: "II",
      chip: "/CC",
      chipCls: "bg-surface-container-lowest text-primary",
      featured: false,
      hoverShadow: "hover:shadow-[8px_8px_0_0_#FF2BA0]",
      icon: "bolt",
      title: "CREATIVE CODING",
      body: "WebGL, shaders, audio-reactive canvas rigs. Loops that run for thirty seconds and ruin a board meeting. Performance-budgeted, mobile-tested, deliberately broken on purpose.",
      meta: "// 41 BUILDS · 12 LIVE",
      img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80&auto=format&fit=crop"
    },
    {
      roman: "III",
      chip: "/TY",
      chipCls: "bg-[#F4FF1A] text-primary",
      featured: false,
      hoverShadow: "hover:shadow-[8px_8px_0_0_#F4FF1A]",
      icon: "format_quote",
      title: "TYPE SYSTEMS",
      body: "Variable-font scales, narrow-grotesk vs serif clashes, wordmarks that hold a room. Letterforms as architecture. Print-press logic ported into the variable-font era.",
      meta: "// 19 WORDMARKS · 4 LICENCED",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop"
    },
    {
      roman: "IV",
      chip: "/DD",
      chipCls: "bg-[#FF2BA0] text-surface-container-lowest",
      featured: false,
      hoverShadow: "hover:shadow-[8px_8px_0_0_white]",
      icon: "gesture",
      title: "DIGITAL DECAY",
      body: "Glitch, datamosh, deliberate corruption. Builds that wear their bytecount on the outside. Where the bug is a design feature and the artefact is the whole point.",
      meta: "// 11 ARTEFACTS · 03 ARCHIVED",
      img: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1200&q=80&auto=format&fit=crop"
    }
  ];

  const manifesto = [
    { num: "01", shadow: "chunky-shadow-lime",   dark: false, title: "BRIEFS ARE A SKETCH, NOT A SPEC",   body: "If the brief solves the problem already, you didn't need me. Every project starts with a fight, ends with a thing that nobody could have written down up front." },
    { num: "02", shadow: "chunky-shadow-yellow", dark: false, title: "SHIP THE UGLY VERSION FIRST",        body: "Day-one demos are HTML and pure CSS. No Figma comp, no design system, no \"let's prototype it.\" If it doesn't survive a 256-colour render, it isn't going in." },
    { num: "03", shadow: "chunky-shadow-pink",   dark: false, title: "NO ANIMATIONS WITHOUT A REASON",    body: "Motion costs money — yours, the user's, the planet's. Every transition either teaches the interface or pays its own rent. The rest get cut." },
    { num: "04", shadow: "chunky-shadow-lime",   dark: false, title: "NEVER TWO ROUNDS OF \"POLISH\"",     body: "Polish-passes are where good work goes to die a polite death. One pass to fix the brief, one pass to break it on purpose. The third pass is bikeshedding wearing a costume." },
    { num: "05", shadow: "chunky-shadow-yellow", dark: true,  title: "THE WORK OUTLASTS THE BRIEF",        body: "If you can't print it on a poster five years from now, it isn't worth shipping today. Build for the archive, not the algorithm." }
  ];

  const plates = [
    { col: "md:col-span-3", mt: "",          rot: "rotate-[-1deg]",   shadow: "chunky-shadow-pink",   alt: "Stripped concrete interior with shadow grid", src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?q=80&w=900&auto=format&fit=crop", caption: "[plate_01_concrete]", date: "04.24" },
    { col: "md:col-span-3", mt: "mt-4 md:mt-12", rot: "rotate-[1.5deg]",  shadow: "chunky-shadow-yellow", alt: "Macro circuit board traces",                  src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop", caption: "[plate_02_traces]",   date: "04.24" },
    { col: "md:col-span-3", mt: "",          rot: "rotate-[-2deg]",   shadow: "chunky-shadow-lime",   alt: "Brutalist tower against stark sky",           src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?q=80&w=900&auto=format&fit=crop", caption: "[plate_03_tower]",    date: "05.24" },
    { col: "md:col-span-3", mt: "mt-4 md:mt-16", rot: "rotate-[1deg]",    shadow: "chunky-shadow-pink",   alt: "Industrial machinery detail",                 src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?q=80&w=900&auto=format&fit=crop", caption: "[plate_04_machine]",  date: "05.24" }
  ];

  const disciplines = [
    { num: "01", chip: "/UI", chipCls: "bg-[#F4FF1A]",                        shadow: "chunky-shadow-pink",   rot: "rotate-[-1deg]",   title: "brutalist ui",         body: "Raw layout, exposed grid, no rounded-corner amnesia. Native HTML, no framework dependencies." },
    { num: "02", chip: "/CC", chipCls: "bg-[#C6FF3F]",                        shadow: "chunky-shadow-yellow", rot: "rotate-[1.5deg]",  title: "creative coding",      body: "Canvas, WebGL, audio-reactive shaders. Built to break in interesting ways during a 30-second loop." },
    { num: "03", chip: "/TY", chipCls: "bg-[#FF2BA0] text-surface-container-lowest", shadow: "chunky-shadow-lime",   rot: "rotate-[-1.5deg]", title: "typographic systems",  body: "Variable-font scales, unhinged display rigs, narrow-grotesk + serif clashes. Letterforms as architecture." },
    { num: "04", chip: "/DD", chipCls: "bg-primary text-surface-container-lowest",   shadow: "chunky-shadow-pink",   rot: "rotate-[1deg]",    title: "digital destruction",  body: "Glitch, datamosh, deliberate decay. Builds that wear their bytecount on the outside." }
  ];

  const stats = [
    { value: "07",  label: "YEARS / FREELANCE",  sub: "since 20XX // unbroken streak",       color: "text-[#C6FF3F]" },
    { value: "142", label: "SHIPPED / PROJECTS", sub: "live in the wild // many on fire",    color: "text-[#FF2BA0]" },
    { value: "19",  label: "AWWWARDS / SOTD",    sub: "+ 04 honors // refusing the rest",    color: "text-[#F4FF1A]" },
    { value: "38",  label: "REPEAT / CLIENTS",   sub: "round-the-table // long-haul only",   color: "text-[#C6FF3F]" }
  ];

  const press = [
    { quoteCls: "text-[#C6FF3F]", quoteWrap: "",                       shadow: "chunky-shadow-lime",   rot: "rotate-[-1deg]",   text: "A portfolio that physically refuses to scroll politely. Glorious.",                                  source: "— SITE INSPIRE",        date: "03.24" },
    { quoteCls: "text-[#FF2BA0]", quoteWrap: "",                       shadow: "chunky-shadow-pink",   rot: "rotate-[1deg]",    text: "Daniel V. is what happens when a print designer learns JavaScript and refuses to apologise.",       source: "— TYPE/CODE QUARTERLY", date: "11.23" },
    { quoteCls: "text-primary",   quoteWrap: "bg-[#F4FF1A] px-2",      shadow: "chunky-shadow-yellow", rot: "rotate-[-1.5deg]", text: "A site that loads like a jump scare and lingers like a cigarette burn. Hire on sight.",             source: "— BRAND.NEW WEEKLY",    date: "07.23" }
  ];

  const projects = [
    { wrap: "md:col-span-7 relative z-20 rotate-[1deg] hover:rotate-0 transition-transform md:-ml-8 mt-6 md:mt-12", inner: "border-2 border-primary bg-surface-container-lowest chunky-shadow-pink p-3 sm:p-4", img: "w-full aspect-[4/3] md:h-[400px] md:aspect-auto object-cover grayscale contrast-150 border-2 border-primary", caption: "[project_01_void_protocol]", capCls: "font-body-mono text-body-mono mt-4", alt: "abstract glitch art with heavy distortion and high contrast black and white", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv0oj1wxKrPKxutSb91axltSaMBuyDlbwtvx8JjvlkyuPY8E5p2RgQDXYJkeLJoQlt5w3RqtfiC0wbBkN67PemqkV6g5MX5xWOrgc6xUmh5W49dpGwuD8qYZeBLhE1o2tGVahA63ewnSuRaMZjMKiKhKtCKjoh3zwlxXT7yGcsZmHNR76G9YWLLy2jaOt3KeGYnHOBVdONkXvIABEa6-p96xoMXMiZVEPKANu-hYS5K1BpdhviF9lkQfmq1rX-JKgqb_8Q4AAsR8JD" },
    { wrap: "md:col-span-5 relative z-30 mt-6 md:-mt-12 lg:mt-32 md:-ml-16 rotate-[-2deg] hover:rotate-0 transition-transform", inner: "border-2 border-primary bg-surface-container-lowest chunky-shadow-lime p-3 sm:p-4", img: "w-full aspect-[4/3] md:h-[300px] md:aspect-auto object-cover grayscale contrast-150 border-2 border-primary", caption: "[experimental_type]", capCls: "font-utility-bold text-utility-bold lowercase mt-4 tracking-widest", alt: "harsh geometric concrete structures against a stark white background", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDopn8dbK1V1Cl9CzhRK8zb1WhEwy9xMNQYGs81G4h95vdtSY3Lz5pHGDA1dsfhaHXNif8F1xYdU5nNmbqqm1xjr2g9Ime6sc4vjRfgMFUS2xdZlpeX0naQNF0a1clTWkUg2V3YYrwz6ZxLcuRl5Tju25Apbkcn5NGXcrgjPGy3rSTcPF3AL76PYHuRNtHrh0StSnzJRS9Y4T_k92M2iRBAdbXmhRYsocK5fOglOymK6xcrD0wf9DE7G-VwQl50e3OY4pJZfwtS5g73" },
    { wrap: "md:col-span-12 relative z-10 mt-10 md:mt-8 flex justify-center rotate-[0.5deg]", inner: "border-2 border-primary bg-surface-container-lowest chunky-shadow-yellow p-3 sm:p-4 w-full md:w-3/4", img: "w-full aspect-[4/3] md:h-[500px] md:aspect-auto object-cover grayscale contrast-200 border-2 border-primary", caption: "[archive_system_failure]", capCls: "font-wordmark-italic text-xl lowercase mt-4 sm:text-2xl", alt: "close up of obsolete technology circuit boards high contrast", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAeK2WtTXEyeui0l3nuQHFp7KneJ1ueBh4wNBrthjsi5OaP2qv-ANqtk4F8Ms2gIYVPTHl2D3n_Ov3HUNSnwCBgVhlwkfIVKQoP5q1ZqxyTPQ4WY--OgSECpA1xIgUIqg-NMX1Nc435pic-VWTTlQsQfhAgVbXORalMlbKxSA_NNlyAyutRBbMQg-8xmdzIvk9BTN_rJ-A_V5OvzJUW7WBS8RL_XV1o4PmybbpjSHfkrhr8F9T8OQetEL1yczfC1LkhX5NZeT8BU6u" }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#f9f9f9", "on-background": "#1b1b1b", "surface": "#f9f9f9", "on-surface": "#1b1b1b", "on-surface-variant": "#4c4546", "surface-container": "#eeeeee", "surface-container-lowest": "#ffffff", "surface-container-highest": "#e2e2e2", "primary": "#000000", "on-primary": "#ffffff", "secondary-fixed": "#e2ec00", "outline": "#7e7576"
          },
          spacing: { "margin-edge": "32px" },
          fontFamily: {
            "display-lg": ["Arial"], "wordmark-italic": ["Times New Roman"], "utility-bold": ["Arial"], "body-mono": ["Courier New"]
          },
          fontSize: {
            "display-lg": ["96px", { lineHeight: "0.9", letterSpacing: "-0.05em", fontWeight: "900" }],
            "wordmark-italic": ["48px", { lineHeight: "1", fontWeight: "400" }],
            "utility-bold": ["12px", { lineHeight: "1", fontWeight: "700" }],
            "body-mono": ["16px", { lineHeight: "1.5", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const css = `
    .chunky-shadow-lime { box-shadow: 8px 8px 0px 0px #C6FF3F; }
    .chunky-shadow-pink { box-shadow: 8px 8px 0px 0px #FF2BA0; }
    .chunky-shadow-yellow { box-shadow: 8px 8px 0px 0px #F4FF1A; }
  `;

  const noiseStyle = { backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')" };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="bg-surface-container-lowest text-primary min-h-screen overflow-x-hidden relative" style={noiseStyle}>
        <header className="p-4 w-full flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 z-50 relative border-b-2 border-primary bg-primary text-surface-container-lowest sm:p-6 md:p-margin-edge">
          <a className="font-utility-bold text-2xl md:text-3xl font-black uppercase tracking-tight text-surface-container-lowest leading-none" href="#">DANIEL<span className="text-[#F4FF1A]">.</span>V</a>
          <nav className="flex flex-row flex-wrap justify-center gap-x-5 gap-y-2 font-body-mono text-utility-bold uppercase tracking-widest font-bold">
            {navLinks.map((l) => (
              <a key={l} href="#" className="text-surface-container-lowest hover:text-[#F4FF1A] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#F4FF1A]">{l}</a>
            ))}
          </nav>
          <a href="#" className="font-utility-bold text-utility-bold uppercase tracking-widest border-2 border-surface-container-lowest px-3 py-2 bg-[#F4FF1A] text-primary chunky-shadow-pink rotate-[-2deg] hover:rotate-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">▸ AVAILABLE FOR WORK</a>
        </header>

        <main className="relative z-10 w-full overflow-hidden border-b-2 border-primary pb-8 sm:pb-16 md:pb-margin-edge">
          <h1 className="font-wordmark-italic text-[18vw] leading-[0.8] italic text-primary w-full text-center tracking-tighter mt-8 mb-8 sm:text-[15vw] sm:mt-12 sm:mb-12 md:-ml-4">DANIEL V.</h1>
          <div className="px-4 max-w-3xl font-body-mono text-body-mono leading-relaxed mt-8 sm:px-6 md:px-margin-edge">
            I build <span className="bg-[#F4FF1A] text-primary px-1 font-bold">digital artifacts</span> that reject the sanitized web. Specializing in <span className="bg-[#F4FF1A] text-primary px-1 font-bold">raw interfaces</span>, brutalist layouts, and experiences that demand attention. Not for the faint of heart.
          </div>
        </main>

        {/* Trusted-by — chunky-shadow panel with 8 black-on-white logos */}
        <section className="w-full relative z-10 border-b-2 border-primary bg-surface-container-highest p-4 sm:p-6 md:p-margin-edge md:py-20">
          <div className="max-w-6xl mx-auto">
            <p className="font-utility-bold text-utility-bold uppercase tracking-widest mb-8 md:mb-10 block">// TRUSTED_BY — N=08 // ROSTER_LIVE</p>
            <div className="border-2 border-primary bg-surface-container-lowest chunky-shadow-yellow p-6 sm:p-8 md:p-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-px bg-primary border-2 border-primary">
                {trustedBrands.map((b) => (
                  <div key={b.name} className="bg-surface-container-lowest h-20 flex items-center justify-center p-4">
                    <img alt={b.name} className="max-h-7 w-auto opacity-90 grayscale" src={`https://cdn.simpleicons.org/${b.slug}/000000`} />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t-2 border-primary flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-utility-bold text-utility-bold uppercase tracking-widest">
                <span>STUDIOS / FOUNDERS / PRESS</span>
                <span className="bg-primary text-surface-container-lowest px-2 py-1">▸ 142 SHIPPED // 19 SOTD</span>
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 w-full relative z-10 border-b-2 border-primary bg-surface pb-20 sm:p-6 sm:pb-24 md:p-margin-edge md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative md:gap-8">
            {projects.map((p) => (
              <div key={p.caption} className={p.wrap}>
                <div className={p.inner}>
                  <img className={p.img} alt={p.alt} src={p.src} />
                  <p className={p.capCls}>{p.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Plates — image strip */}
        <section className="w-full relative z-10 border-b-2 border-primary bg-surface-container-lowest p-4 sm:p-6 md:p-margin-edge md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
            <div>
              <p className="font-utility-bold text-utility-bold uppercase mb-3 tracking-widest">// PROCESS_PLATES — N=05</p>
              <h2 className="font-display-lg text-[44px] sm:text-[64px] md:text-[80px] leading-[0.9] uppercase">FROM THE STUDIO FLOOR</h2>
            </div>
            <p className="font-body-mono text-body-mono max-w-sm md:text-right">Selected reference plates. Print-room scans, off-cuts, half-broken builds. The work behind the work.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8 relative">
            {plates.map((p) => (
              <div key={p.caption} className={`${p.col} ${p.mt} ${p.rot} hover:rotate-0 transition-transform`}>
                <div className={`border-2 border-primary bg-surface-container-lowest ${p.shadow} p-2 sm:p-3`}>
                  <img className="w-full aspect-[3/4] object-cover grayscale contrast-150 border-2 border-primary" alt={p.alt} src={p.src} />
                  <p className="font-body-mono text-xs lowercase mt-3 flex justify-between"><span>{p.caption}</span><span className="opacity-50 tabular-nums">{p.date}</span></p>
                </div>
              </div>
            ))}
            <div className="col-span-2 md:col-span-12 mt-4 flex justify-center rotate-[-0.5deg] hover:rotate-0 transition-transform">
              <div className="border-2 border-primary bg-surface-container-lowest chunky-shadow-yellow p-2 sm:p-3 w-full md:w-2/3">
                <img className="w-full aspect-[16/9] object-cover grayscale contrast-150 border-2 border-primary" alt="Server room wide shot" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop" />
                <p className="font-body-mono text-xs lowercase mt-3 flex justify-between"><span>[plate_05_rack_wide]</span><span className="opacity-50 tabular-nums">06.24 — wall-installed reference</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities matrix — 4 chunky cards */}
        <section className="w-full relative z-10 border-b-2 border-primary bg-surface p-4 sm:p-6 md:p-margin-edge md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
            <div>
              <p className="font-utility-bold text-utility-bold uppercase mb-3 tracking-widest">// CAPABILITIES — V.04</p>
              <h2 className="font-display-lg text-[44px] sm:text-[64px] md:text-[80px] leading-[0.9] uppercase">FOUR DISCIPLINES</h2>
            </div>
            <p className="font-body-mono text-body-mono max-w-sm md:text-right">Hand-built every time. No design system in a bottle, no AI-bloat. Brief → sketch → break → ship.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {disciplines.map((d) => (
              <div key={d.num} className={`border-2 border-primary bg-surface-container-lowest ${d.shadow} p-5 ${d.rot} hover:rotate-0 transition-transform flex flex-col gap-4 min-h-[280px]`}>
                <div className="flex justify-between items-start">
                  <span className="font-display-lg text-[64px] leading-none">{d.num}</span>
                  <span className={`font-utility-bold text-utility-bold uppercase border-2 border-primary px-2 py-1 ${d.chipCls}`}>{d.chip}</span>
                </div>
                <h3 className="font-wordmark-italic text-3xl lowercase italic mt-auto">{d.title}</h3>
                <p className="font-body-mono text-sm">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Premium 2x2 — image-bg cards with icon + title + body + meta */}
        <section className="w-full relative z-10 border-b-2 border-primary bg-primary text-surface-container-lowest p-4 sm:p-6 md:p-margin-edge md:py-28 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
            <div>
              <p className="font-utility-bold text-utility-bold uppercase tracking-widest text-[#C6FF3F] mb-8 md:mb-10 block">// SIGNATURE_LANES — N=04 // FLAGSHIP</p>
              <h2 className="font-display-lg text-[44px] sm:text-[64px] md:text-[80px] leading-[0.9] uppercase">WHERE I OPERATE</h2>
            </div>
            <p className="font-body-mono text-body-mono max-w-sm md:text-right text-surface-container-lowest/80">Four lanes I refuse to compromise on. Each one a decade-deep rabbit hole. Pick the lane, I'll run it raw.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto items-stretch">
            {lanes.map((lane) => (
              <article key={lane.title} className={`relative aspect-[4/3] md:aspect-[5/4] border-2 border-surface-container-lowest overflow-hidden flex flex-col justify-between p-6 md:p-8 group hover:-translate-y-1 ${lane.hoverShadow} transition-all duration-300${lane.featured ? " ring-2 ring-[#C6FF3F]/60 ring-offset-4 ring-offset-primary" : ""}`}>
                <img alt="" aria-hidden="true" src={lane.img} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/50 pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <span className="font-wordmark-italic text-5xl text-surface-container-lowest italic leading-none">{lane.roman}</span>
                  <span className={`font-utility-bold text-utility-bold uppercase tracking-widest border-2 border-surface-container-lowest px-2 py-1 ${lane.chipCls}`}>{lane.chip}</span>
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="material-symbols-outlined text-surface-container-lowest text-3xl mb-2">{lane.icon}</span>
                  <h3 className="font-display-lg text-surface-container-lowest uppercase text-2xl md:text-3xl leading-none">{lane.title}</h3>
                  <p className="text-surface-container-lowest/90 font-body-mono text-sm leading-relaxed">{lane.body}</p>
                  <div className="mt-3 pt-3 border-t-2 border-surface-container-lowest/30 flex items-center justify-between text-[10px] uppercase tracking-widest text-surface-container-lowest/80 font-utility-bold">
                    <span>{lane.meta}</span>
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* By the numbers — 4-stat ribbon */}
        <section className="w-full relative z-10 border-b-2 border-primary bg-primary text-surface-container-lowest p-4 sm:p-6 md:p-margin-edge md:py-20 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
            <div>
              <p className="font-utility-bold text-utility-bold uppercase mb-3 tracking-widest text-[#F4FF1A]">// BY THE NUMBERS — Q2.24</p>
              <h2 className="font-display-lg text-[44px] sm:text-[64px] md:text-[80px] leading-[0.9] uppercase">VOLUME / OUTPUT</h2>
            </div>
            <p className="font-body-mono text-body-mono max-w-sm md:text-right text-surface-container-lowest/80">Counted. Indexed. Survived. Numbers refresh quarterly.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface-container-lowest/20 border-2 border-surface-container-lowest/40">
            {stats.map((s) => (
              <div key={s.label} className="bg-primary p-6 md:p-8 flex flex-col gap-3">
                <p className={`font-display-lg text-[60px] md:text-[96px] leading-none tabular-nums ${s.color}`}>{s.value}</p>
                <p className="font-utility-bold text-utility-bold uppercase tracking-widest">{s.label}</p>
                <p className="font-body-mono text-xs opacity-60">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Manifesto / How I work — content+image row, 5 numbered tenets */}
        <section className="w-full relative z-10 border-b-2 border-primary bg-surface-container-lowest p-4 sm:p-6 md:p-margin-edge md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
            <div>
              <p className="font-utility-bold text-utility-bold uppercase tracking-widest mb-8 md:mb-10 block">// DOCTRINE — V.05 // NON_NEGOTIABLE</p>
              <h2 className="font-display-lg text-[44px] sm:text-[64px] md:text-[80px] leading-[0.9] uppercase">HOW I WORK</h2>
            </div>
            <p className="font-body-mono text-body-mono max-w-sm md:text-right">Five rules I've broken every other one to keep. Print these. Pin them above the keyboard. Argue with them later.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch">
            <div className="md:col-span-5 relative rotate-[-1deg]">
              <div className="border-2 border-primary chunky-shadow-pink p-3">
                <img className="w-full aspect-[4/5] object-cover grayscale contrast-150 border-2 border-primary" alt="Designer's hands working on a sketch in a brutalist studio" src="https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=1100&q=80&auto=format&fit=crop" />
                <div className="mt-3 flex justify-between font-body-mono text-xs lowercase">
                  <span>[studio_floor / 06.24]</span>
                  <span className="opacity-50 tabular-nums">DOC.05</span>
                </div>
              </div>
              <div className="hidden md:block absolute -top-4 -left-4 bg-[#F4FF1A] border-2 border-primary px-3 py-1 font-utility-bold text-utility-bold uppercase tracking-widest rotate-[-4deg]">▸ MANIFESTO</div>
            </div>
            <div className="md:col-span-7 flex flex-col h-full md:justify-between gap-6">
              <ol className="flex flex-col gap-4">
                {manifesto.map((m) => (
                  <li key={m.num} className={`border-2 border-primary p-5 sm:p-6 ${m.shadow} flex gap-5 items-start ${m.dark ? "bg-primary text-surface-container-lowest" : "bg-surface-container-lowest"}`}>
                    <span className={`font-display-lg text-[48px] leading-none tabular-nums shrink-0${m.dark ? " text-[#F4FF1A]" : ""}`}>{m.num}</span>
                    <div className="flex flex-col gap-2 min-w-0">
                      <h3 className={`font-utility-bold text-utility-bold uppercase tracking-widest${m.dark ? " text-[#F4FF1A]" : ""}`}>{m.title}</h3>
                      <p className="font-body-mono text-sm leading-relaxed">{m.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {/* Bottom-pinned signed disclaimer — bottoms-must-align with image on the left */}
              <div className="border-2 border-primary bg-[#F4FF1A] p-5 sm:p-6 chunky-shadow-pink flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-[32px] leading-none shrink-0">verified</span>
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-utility-bold text-utility-bold uppercase tracking-widest text-primary">// SIGNED · D.V · MMXXIV</span>
                    <span className="font-body-mono text-xs lowercase text-primary opacity-60 tabular-nums">DOCTRINE.V.05</span>
                  </div>
                  <p className="font-body-mono text-sm leading-relaxed text-primary">These five rules are not opinions — they are scars. Adopted V.01 (2018), revised through five projects that almost killed each other. Reissued V.05.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Press — 3 chunky quote cards */}
        <section className="w-full relative z-10 border-b-2 border-primary bg-surface-container-lowest p-4 sm:p-6 md:p-margin-edge md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
            <div>
              <p className="font-utility-bold text-utility-bold uppercase mb-3 tracking-widest">// SELECTED PRESS — N=03</p>
              <h2 className="font-display-lg text-[44px] sm:text-[64px] md:text-[80px] leading-[0.9] uppercase">WHAT THEY SAID</h2>
            </div>
            <p className="font-body-mono text-body-mono max-w-sm md:text-right">Filed under fan mail. Printed and pinned to the studio wall.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {press.map((q) => (
              <figure key={q.source} className={`border-2 border-primary bg-surface-container-lowest ${q.shadow} p-6 sm:p-8 ${q.rot} hover:rotate-0 transition-transform flex flex-col gap-6 min-h-[320px]`}>
                <span className={`font-display-lg text-6xl leading-none ${q.quoteCls} ${q.quoteWrap}`}>"</span>
                <blockquote className="font-wordmark-italic italic text-2xl leading-snug">{q.text}</blockquote>
                <figcaption className="font-utility-bold text-utility-bold uppercase tracking-widest mt-auto pt-4 border-t-2 border-primary flex justify-between"><span>{q.source}</span><span className="tabular-nums">{q.date}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <footer className="w-full flex flex-col md:flex-row relative z-10 bg-surface-container-lowest">
          <div className="w-full md:w-1/2 p-4 border-b-2 md:border-b-0 md:border-r-2 border-primary bg-surface-container-lowest relative overflow-hidden sm:p-6 md:p-margin-edge">
            <h2 className="font-display-lg text-[52px] leading-[0.9] uppercase mb-6 sm:text-[72px] sm:mb-8 md:text-display-lg">INFO</h2>
            <div className="font-body-mono text-body-mono space-y-4 relative z-10 max-w-md">
              <p>---</p>
              <p>DANIEL V.<br />CREATIVE DEVELOPER<br />EST. 20XX</p>
              <p>---</p>
              <p>CAPABILITIES:</p>
              <ul className="space-y-1">
                {capabilities.map((c) => <li key={c}>- {c}</li>)}
              </ul>
              <p>---</p>
            </div>
            <div className="hidden md:block absolute -bottom-20 -right-20 opacity-10 text-[300px] font-display-lg text-primary pointer-events-none">D.V</div>
          </div>
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-center bg-surface-container-highest sm:p-6 md:p-margin-edge">
            <h2 className="font-body-mono text-body-mono uppercase mb-4 font-bold border-b-2 border-primary pb-2 w-max inline-block">INITIATE_CONTACT</h2>
            <a className="font-display-lg text-[11vw] leading-none uppercase break-words hover:text-[#FF2BA0] transition-colors mt-6 sm:text-[8vw] sm:mt-8 md:text-[6vw]" href="mailto:HELLO@DANIEL-V.COM">HELLO@<br />DANIEL-V.COM</a>
            <div className="mt-10 flex justify-between items-center font-utility-bold text-utility-bold border-t-2 border-primary pt-4 sm:mt-16">
              <span>© 2024</span>
              <span className="bg-primary text-surface-container-lowest px-2 py-1">SYSTEM_ONLINE</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
