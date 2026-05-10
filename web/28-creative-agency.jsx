function CreativeAgency() {
  return (
    <>
      {/* head */}
      <title>FOUNDRY NINE - Creative Agency</title>
      <meta name="description" content="FOUNDRY NINE is a creative agency that demands attention through scale and stark contrast, merging high-end Swiss design with digital brutalism." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-tertiary-container": "#ffa597",
                        "primary-fixed": "#e0e0ff",
                        "inverse-surface": "#e3e1f1",
                        "tertiary-fixed-dim": "#ffb4a8",
                        "on-tertiary": "#690100",
                        "surface": "#12121d",
                        "on-primary": "#0001ac",
                        "tertiary-fixed": "#ffdad4",
                        "secondary-fixed": "#eaea00",
                        "surface-container-low": "#1a1b26",
                        "primary": "#bec2ff",
                        "on-tertiary-fixed-variant": "#930100",
                        "surface-container-highest": "#333440",
                        "inverse-on-surface": "#2f2f3b",
                        "surface-dim": "#12121d",
                        "surface-bright": "#383844",
                        "tertiary": "#ffb4a8",
                        "primary-fixed-dim": "#bec2ff",
                        "on-primary-container": "#b3b7ff",
                        "inverse-primary": "#343dff",
                        "on-secondary-container": "#686800",
                        "background": "#12121d",
                        "error-container": "#93000a",
                        "primary-container": "#0000ff",
                        "on-surface": "#e3e1f1",
                        "on-surface-variant": "#c5c4db",
                        "tertiary-container": "#9d0100",
                        "secondary-fixed-dim": "#cdcd00",
                        "on-primary-fixed": "#00006e",
                        "error": "#ffb4ab",
                        "on-error-container": "#ffdad6",
                        "outline": "#8f8fa4",
                        "on-secondary-fixed-variant": "#494900",
                        "on-secondary": "#323200",
                        "secondary": "#ffffff",
                        "surface-tint": "#bec2ff",
                        "surface-container-high": "#292935",
                        "on-background": "#e3e1f1",
                        "surface-container": "#1e1f2a",
                        "surface-container-lowest": "#0d0d18",
                        "on-primary-fixed-variant": "#0000ef",
                        "on-error": "#690005",
                        "on-secondary-fixed": "#1d1d00",
                        "on-tertiary-fixed": "#410000",
                        "secondary-container": "#eaea00",
                        "surface-variant": "#333440",
                        "outline-variant": "#454558"
                    },
                    spacing: {
                        "stack-lg": "clamp(3rem, 6vw, 5rem)",
                        "base": "0.5rem",
                        "stack-sm": "1rem",
                        "margin-canvas": "clamp(1.5rem, 5vw, 4rem)",
                        "stack-md": "clamp(1.5rem, 4vw, 2.5rem)",
                        "gutter": "clamp(1rem, 3vw, 2rem)",
                        "section-padding": "clamp(5rem, 12vw, 10rem)"
                    },
                    fontFamily: {
                        "body-lg": ["Inter", "sans-serif"],
                        "display-xl": ["Space Grotesk", "sans-serif"],
                        "display-2xl": ["Space Grotesk", "sans-serif"],
                        "headline-lg": ["Space Grotesk", "sans-serif"],
                        "body-md": ["Inter", "sans-serif"],
                        "headline-md": ["Space Grotesk", "sans-serif"],
                        "label-caps": ["Space Grotesk", "sans-serif"]
                    },
                    fontSize: {
                        "body-lg": ["clamp(1.125rem, 2vw + 0.5rem, 1.35rem)", { "lineHeight": "1.6", "fontWeight": "500" }],
                        "display-xl": ["clamp(3rem, 8vw + 1rem, 7.5rem)", { "lineHeight": "0.9", "letterSpacing": "-0.03em", "fontWeight": "700" }],
                        "display-2xl": ["clamp(4.5rem, 15vw + 1rem, 13rem)", { "lineHeight": "0.85", "letterSpacing": "-0.04em", "fontWeight": "700" }],
                        "headline-lg": ["clamp(2.5rem, 6vw + 1rem, 4rem)", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body-md": ["clamp(0.875rem, 1.5vw + 0.5rem, 1.125rem)", { "lineHeight": "1.5", "fontWeight": "400" }],
                        "headline-md": ["clamp(1.75rem, 4vw + 1rem, 3rem)", { "lineHeight": "1.1", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "label-caps": ["clamp(0.75rem, 1vw + 0.5rem, 0.875rem)", { "lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "700" }]
                    },
                    keyframes: {
                        marquee: {
                            "0%": { transform: "translateX(0)" },
                            "100%": { transform: "translateX(-100%)" }
                        }
                    },
                    animation: {
                        marquee: "marquee 12s linear infinite"
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .bg-grid-pattern {
            background-size: 40px 40px;
            background-image:
                linear-gradient(to right, rgba(143, 143, 164, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(143, 143, 164, 0.15) 1px, transparent 1px);
        }
        .bg-dots-pattern {
            background-image: radial-gradient(rgba(143, 143, 164, 0.3) 2px, transparent 2px);
            background-size: 24px 24px;
        }

        @media (prefers-reduced-motion: reduce) {
            html {
                scroll-behavior: auto !important;
            }
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
` }} />

      {/* The HTML had `<html class="dark scroll-smooth">` and a body with these classes — JSX mounts inside #root, so the dark/body classes go on a wrapper div. */}
      <div className="dark bg-background text-on-background font-body-md overflow-x-hidden selection:bg-secondary-container selection:text-black antialiased flex flex-col min-h-screen">

        {/* TopNavBar */}
        <nav className="bg-white dark:bg-background font-['Space_Grotesk'] font-bold uppercase tracking-tighter border-b-2 border-black dark:border-outline-variant flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-6 sticky top-0 z-50 transition-colors duration-300">
          <a href="/" className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tighter focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:ring-primary-container rounded-sm">
            FOUNDRY NINE
          </a>

          <div className="hidden lg:flex gap-gutter items-center">
            <a className="text-black dark:text-white hover:bg-primary-container hover:text-white focus-visible:bg-primary-container focus-visible:text-white focus-visible:outline-none transition-colors duration-200 px-4 py-2 rounded-sm" href="#work">Work</a>
            <a className="text-black dark:text-white hover:bg-primary-container hover:text-white focus-visible:bg-primary-container focus-visible:text-white focus-visible:outline-none transition-colors duration-200 px-4 py-2 rounded-sm" href="#services">Services</a>
            <a className="text-black dark:text-white hover:bg-primary-container hover:text-white focus-visible:bg-primary-container focus-visible:text-white focus-visible:outline-none transition-colors duration-200 px-4 py-2 rounded-sm" href="#founders">Founders</a>
            <a className="text-black dark:text-white hover:bg-primary-container hover:text-white focus-visible:bg-primary-container focus-visible:text-white focus-visible:outline-none transition-colors duration-200 px-4 py-2 rounded-sm" href="#">Approach</a>
            <a className="ml-4 border-2 border-black dark:border-white bg-primary-container text-white px-6 py-3 hover:bg-secondary-container hover:text-black hover:border-secondary-container focus-visible:bg-secondary-container focus-visible:text-black focus-visible:outline-none transition-all duration-200 shadow-[4px_4px_0_0_theme(colors.on-background)] hover:shadow-none hover:translate-y-1 hover:translate-x-1" href="mailto:hello@foundrynine.com">
              START A PROJECT
            </a>
          </div>

          <button aria-expanded="false" aria-label="Toggle navigation menu" className="lg:hidden text-black dark:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container p-2 -mr-2 rounded-sm">
            <span className="material-symbols-outlined block text-3xl" aria-hidden="true">menu</span>
          </button>
        </nav>

        {/* Hero */}
        <header className="relative min-h-[90svh] flex flex-col justify-center overflow-hidden bg-background bg-grid-pattern border-b-2 border-outline-variant pt-16 pb-40 md:pt-20 md:pb-48">

          {/* Brutalist Accent Image Right */}
          <div className="absolute top-0 right-0 w-full lg:w-[45%] h-full border-l-2 border-outline-variant opacity-20 lg:opacity-100 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 bg-primary-container mix-blend-color z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1507358522600-9f71e620c44e?q=80&w=1200&auto=format&fit=crop"
              width="1200"
              height="1600"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover grayscale contrast-150 mix-blend-luminosity"
              alt=""
            />
            <div className="absolute inset-0 bg-dots-pattern z-20 mix-blend-overlay opacity-60"></div>
          </div>

          <div className="container mx-auto px-margin-canvas relative z-10 w-full">
            <div className="max-w-5xl">
              <h1 className="font-display-2xl leading-[0.85] tracking-tighter uppercase text-on-background drop-shadow-[4px_4px_0_theme(colors.primary-container)]">
                Brands<br />
                <span className="text-transparent [-webkit-text-stroke:2px_theme(colors.on-background)] drop-shadow-none">That</span><br />
                Move.
              </h1>

              <div className="mt-10 md:mt-16 max-w-2xl bg-primary-container p-6 md:p-10 border-2 border-on-background shadow-[10px_10px_0_0_theme(colors.on-background)] lg:shadow-[16px_16px_0_0_theme(colors.on-background)] transform hover:-translate-y-1 hover:translate-x-1 lg:hover:shadow-[20px_20px_0_0_theme(colors.on-background)] transition-all duration-300">
                <p className="font-body-lg text-white max-w-[40ch] text-balance leading-relaxed">
                  We are a creative agency that demands attention through scale and stark contrast. Unapologetically confident, merging the precision of high-end Swiss design with the raw energy of digital brutalism.
                </p>
              </div>
            </div>
          </div>

          {/* Skewed Marquee */}
          <div className="absolute bottom-10 md:bottom-16 left-[-5vw] w-[110vw] transform -rotate-3 z-30 pointer-events-none" aria-hidden="true">
            <div className="bg-secondary-container border-y-4 border-black py-3 md:py-5 flex overflow-hidden shadow-[0_0_40px_rgba(234,234,0,0.15)]">
              <div className="animate-marquee flex items-center shrink-0">
                <span className="font-display-xl text-black text-[clamp(2.5rem,5vw,4rem)] leading-none uppercase px-4 whitespace-nowrap">BRANDS / THAT / MOVE /</span>
                <span className="font-display-xl text-black text-[clamp(2.5rem,5vw,4rem)] leading-none uppercase px-4 whitespace-nowrap">BRANDS / THAT / MOVE /</span>
              </div>
              <div className="animate-marquee flex items-center shrink-0">
                <span className="font-display-xl text-black text-[clamp(2.5rem,5vw,4rem)] leading-none uppercase px-4 whitespace-nowrap">BRANDS / THAT / MOVE /</span>
                <span className="font-display-xl text-black text-[clamp(2.5rem,5vw,4rem)] leading-none uppercase px-4 whitespace-nowrap">BRANDS / THAT / MOVE /</span>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* TRUSTED BY — press wall */}
          <section className="w-full px-margin-canvas py-section-padding border-b-2 border-outline-variant bg-surface-container-low">
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-stack-lg">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary-container mb-8 md:mb-10 block">// FEATURED IN · TRUSTED BY · 12 OUTLETS</span>
                <h2 className="font-headline-lg text-on-background uppercase border-b-4 border-secondary-container pb-base inline-block">Built for brands that take design seriously.</h2>
                <p className="font-body-lg text-on-surface-variant mt-stack-md">Our work has been picked up, picked apart and picked first by the editors and platforms our clients actually read.</p>
              </div>
              <div className="border-2 border-outline-variant bg-background p-stack-md md:p-stack-lg shadow-[12px_12px_0_0_theme(colors.outline-variant)]">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8 items-center justify-items-center">
                  {[
                    { slug: "medium",       name: "Medium",         caption: "Editor's pick" },
                    { slug: "theguardian",  name: "The Guardian",   caption: "Long read · 2024" },
                    { slug: "substack",     name: "Substack",       caption: "Featured studio" },
                    { slug: "behance",      name: "Behance",        caption: "Project of the day" },
                    { slug: "dribbble",     name: "Dribbble",       caption: "Top shot · 6×" },
                    { slug: "vimeo",        name: "Vimeo",          caption: "Staff pick · 3×" },
                    { slug: "framer",       name: "Framer",         caption: "Site of the week" },
                    { slug: "figma",        name: "Figma",          caption: "Community case" },
                    { slug: "webflow",      name: "Webflow",        caption: "Showcase 2024" },
                    { slug: "notion",       name: "Notion",         caption: "Design partner" },
                    { slug: "linear",       name: "Linear",         caption: "Brand client" },
                    { slug: "stripe",       name: "Stripe",         caption: "Press partner" },
                  ].map(b => (
                    <div key={b.slug} className="flex flex-col items-center gap-3 group">
                      <img src={`https://cdn.simpleicons.org/${b.slug}/64748b`} alt={`${b.name} logo`} width="56" height="56" loading="lazy" decoding="async" className="h-10 md:h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="font-label-caps text-[0.65rem] uppercase tracking-widest text-on-surface-variant">{b.caption}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-stack-md pt-stack-sm border-t-2 border-outline-variant flex flex-col md:flex-row justify-between gap-stack-sm font-label-caps text-label-caps uppercase text-on-surface-variant">
                  <span>+ 20 more partners · 4 continents</span>
                  <span className="tabular-nums">MMXVIII — present</span>
                </div>
              </div>
            </div>
          </section>

          {/* MANIFESTO — full-bleed darker grey, refusal stamps + faint industrial bg */}
          <section className="w-full px-margin-canvas py-section-padding border-b-2 border-outline-variant relative overflow-hidden" style={{ backgroundColor: "#0a0a14" }}>
            <img alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] blur-2xl mix-blend-luminosity pointer-events-none select-none" src="https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?q=80&w=1600&auto=format&fit=crop" />
            <div className="container mx-auto relative">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-stack-md mb-stack-lg">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary-container mb-8 md:mb-10 block">// MANIFESTO · 04 MANTRAS</span>
                  <h2 className="font-headline-lg text-on-background uppercase italic border-b-4 border-secondary-container pb-base inline-block">FOUR THINGS WE WILL NOT DO.</h2>
                </div>
                <p className="font-body-lg text-on-surface-variant max-w-md lg:text-right">Drafted at the founding. Pinned to the studio wall. Read aloud at every kick-off. Non-negotiable.</p>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {[
                  { num: "/01", numColor: "text-secondary-container", stampColor: "text-secondary-container", title: "SAFE WORK.",      body: "If a brief lets you sleep through it, the answer is no. We pick the projects that scare us a little.",          shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.secondary-container)]" },
                  { num: "/02", numColor: "text-primary-fixed",       stampColor: "text-primary-fixed",       title: "FOCUS GROUPS.",   body: "A brand designed to please everyone moves no one. Decisions are made by 3 people in a room, not by surveys.",        shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.primary-container)]" },
                  { num: "/03", numColor: "text-tertiary-fixed-dim",  stampColor: "text-tertiary-fixed-dim",  title: "DECK CULTURE.",   body: "We ship the work, not 80 slides about the work. The deliverable is the brand, not a Keynote rehearsal.",            shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.tertiary-container)]" },
                  { num: "/04", numColor: "text-secondary-container", stampColor: "text-secondary-container", title: "SOFT EXITS.",     body: "A brand that fades out is a brand that asked to. End where the work ends. The audience leaves the way they came in: alert.", shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.secondary-container)]" },
                ].map(m => (
                  <li key={m.num} className={`relative overflow-hidden border-2 border-outline-variant p-stack-sm bg-background flex flex-col gap-stack-sm shadow-[8px_8px_0_0_theme(colors.outline-variant)] hover:-translate-y-1 hover:translate-x-1 ${m.shadowHover} transition-all duration-300 group`}>
                    <span aria-hidden="true" className={`material-symbols-outlined absolute -top-4 -right-4 text-[8rem] leading-none ${m.stampColor} opacity-[0.08] rotate-12 pointer-events-none select-none`}>gpp_bad</span>
                    <div className="flex justify-between items-start relative z-10">
                      <span className={`font-display-xl text-[clamp(2.5rem,5vw,4rem)] ${m.numColor} leading-none italic tabular-nums`}>{m.num}</span>
                      <span className="inline-flex items-center gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant tabular-nums border border-outline-variant px-2 py-1"><span className="material-symbols-outlined text-base leading-none">block</span>REFUSE</span>
                    </div>
                    <h3 className="font-headline-md text-on-background uppercase relative z-10">{m.title}</h3>
                    <p className="font-body-md text-on-surface-variant relative z-10">{m.body}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-stack-lg pt-stack-sm border-t-2 border-outline-variant flex flex-col md:flex-row justify-between gap-stack-sm font-label-caps text-label-caps uppercase text-on-surface-variant">
                <span>SIGNED · THE FOUNDERS · 2019</span>
                <span className="tabular-nums">REISSUED // V.04 · MMXXIV</span>
              </div>
            </div>
          </section>

          {/* Selected Work */}
          <section id="work" className="py-section-padding scroll-mt-24 border-b-2 border-outline-variant">
            <div className="container mx-auto px-margin-canvas">
              <h2 className="font-headline-lg text-on-background mb-stack-lg uppercase border-b-4 border-primary-container pb-base inline-block">Selected Work</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px] border-2 border-outline-variant bg-outline-variant shadow-[12px_12px_0_0_rgba(143,143,164,0.1)]">

                {/* Project 1: Nexus Core */}
                <a href="#" className="group block relative aspect-square lg:aspect-auto lg:h-[45vw] bg-primary-container overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white" aria-label="View Project: Nexus Core">
                  <img
                    alt="Abstract brutalist 3d render with strong lighting and sharp geometric shadows in primary colors"
                    width="800"
                    height="800"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:mix-blend-normal group-focus-visible:scale-105 transition-all duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWOtV1NQXpEiT_oVY8p7587vUjYDZcqnEk0O_JclDkvOf4nlEWiyk_fpif3ZzBegBOR_wELw1--QlGkjV0PM8LVrru1aZC36_VSvon_cObRjfXWhUI1EvNVDFXl9ZurzAEJrhFGoPsbEHQcG6W2raTuWwJZqJLRix14spuAz2kIPMJf6xuVusH3wMF-xaWOCIIwfK0L-xQxRLmotxgABmXg2cRw2tZLGoXX6blYUYjoCzFtLpgkLrgMMZl1p7SaZ7na8dDIxEaH3c"
                  />
                  <div className="absolute inset-0 p-stack-md flex flex-col justify-between z-10 pointer-events-none">
                    <span className="font-label-caps tabular-nums text-white bg-black px-4 py-2 self-start border-2 border-white shadow-[4px_4px_0_0_theme(colors.white)]">01 / BRANDING</span>
                    <div className="flex justify-between items-end">
                      <h3 className="font-display-xl text-white uppercase leading-none mix-blend-difference group-hover:mix-blend-normal transition-all duration-700">NEXUS<br />CORE</h3>
                      <span className="material-symbols-outlined text-white text-5xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block">arrow_forward</span>
                    </div>
                  </div>
                </a>

                {/* Project 2: Pulse Tech */}
                <a href="#" className="group block relative aspect-square lg:aspect-auto lg:h-[45vw] bg-secondary-container overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-black" aria-label="View Project: Pulse Tech">
                  <img
                    alt="High contrast macro shot of metallic tech components with neon yellow lighting"
                    width="800"
                    height="800"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:mix-blend-normal group-focus-visible:scale-105 transition-all duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLtrHt0GEidaH3ClJnoYvknDjTi9Qi3ICJIN5N3JZ0toWbf_ztkN2IADRXxhjUq9-ptNJe2ESDWR4k2FQhYSj9GEcuafFvCsTiNdYUWpquFNsGaWiT7cGkGf7J3Zy8jkcQBmjIcjdkdLvjOpvIIXEsALVOR5rYrKhh-2cKLSu9nO6Rcqrgj13ctz34irjaSrRJQQRfyvZj5fVxxQPZuI3RiAELMnrqEDOJutdNTJaw6F7dw3rimGgBmXtZNxiHhWW64lMnJbx8u-Q"
                  />
                  <div className="absolute inset-0 p-stack-md flex flex-col justify-between z-10 pointer-events-none">
                    <span className="font-label-caps tabular-nums text-black bg-white px-4 py-2 self-start border-2 border-black shadow-[4px_4px_0_0_theme(colors.black)]">02 / DIGITAL</span>
                    <div className="flex justify-between items-end">
                      <h3 className="font-display-xl text-black uppercase leading-none mix-blend-difference group-hover:mix-blend-normal transition-all duration-700">PULSE<br />TECH</h3>
                      <span className="material-symbols-outlined text-black text-5xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block">arrow_forward</span>
                    </div>
                  </div>
                </a>

                {/* Project 3: Echo Void */}
                <a href="#" className="group block relative aspect-square lg:aspect-auto lg:h-[45vw] bg-tertiary-container overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white" aria-label="View Project: Echo Void">
                  <img
                    alt="Stark black and white architectural photography of modern concrete building"
                    width="800"
                    height="800"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:mix-blend-normal group-focus-visible:scale-105 transition-all duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWk6tZAXv0kN_wsGPJbx2JZ-1iGsWrGcQplf5KTojRYh9y2StX8vf7TN0cHpLq2XQRY6EPtqcnSQ_g6e8F9_6jOGAzQxmgxUIXGPCjtnoZ2uMqcokgLCBdyFrfmrvkBEaRu6ab9s558lxDrLanLty4FGTCFoKSUaGym4oBbGd6OIuyhUYF2ToLBTONEqZsKY9Y-BpMu8WVFBSA72frzAOH79K1Wluw1hOm0EQHG9OKPtQwq-67yJ8QY_eGb4VFDndjk7VqS7m0H0Y"
                  />
                  <div className="absolute inset-0 p-stack-md flex flex-col justify-between z-10 pointer-events-none">
                    <span className="font-label-caps tabular-nums text-white bg-black px-4 py-2 self-start border-2 border-white shadow-[4px_4px_0_0_theme(colors.white)]">03 / CAMPAIGN</span>
                    <div className="flex justify-between items-end">
                      <h3 className="font-display-xl text-white uppercase leading-none mix-blend-difference group-hover:mix-blend-normal transition-all duration-700">ECHO<br />VOID</h3>
                      <span className="material-symbols-outlined text-white text-5xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block">arrow_forward</span>
                    </div>
                  </div>
                </a>

                {/* Project 4: Aura Sync */}
                <a href="#" className="group block relative aspect-square lg:aspect-auto lg:h-[45vw] bg-inverse-primary overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white" aria-label="View Project: Aura Sync">
                  <img
                    alt="Vibrant neon lights distorted through textured glass in a dark environment"
                    width="800"
                    height="800"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:mix-blend-normal group-focus-visible:scale-105 transition-all duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtaAdbB9k2S7ehErzco9ME6YG-UfxHnUME_25a-d97Wg6JYS5Qho7TObx3TmZDbZlsPqUYnsYk5zlR6kK_roLvSTKlXuCP6Ih1W8_hmRT1-Vzc18ZrA9ToeeB-kUp14Ma7CILr9SpLEl4DoS1d_EdueVX7fy_CpvNt3G3cVZ1WyXXE4x84cylI5CLinDOFDt2No4se2xoPJ67BpTErnckUHU9-tl2Fk026llr00PIwH4C7JDf5YxSh7WcuLSOJi2u8cikeYvi765M"
                  />
                  <div className="absolute inset-0 p-stack-md flex flex-col justify-between z-10 pointer-events-none">
                    <span className="font-label-caps tabular-nums text-white bg-black px-4 py-2 self-start border-2 border-white shadow-[4px_4px_0_0_theme(colors.white)]">04 / STRATEGY</span>
                    <div className="flex justify-between items-end">
                      <h3 className="font-display-xl text-white uppercase leading-none mix-blend-difference group-hover:mix-blend-normal transition-all duration-700">AURA<br />SYNC</h3>
                      <span className="material-symbols-outlined text-white text-5xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block">arrow_forward</span>
                    </div>
                  </div>
                </a>

              </div>
            </div>
          </section>

          {/* THE OUTPUT — horizontal phase pipeline with icons + connector dots */}
          <section className="w-full px-margin-canvas py-section-padding border-b-2 border-outline-variant relative" style={{ backgroundColor: "#0a0a14" }}>
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-stack-md mb-stack-lg">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed mb-8 md:mb-10 block">// THE OUTPUT · 04 PHASES</span>
                  <h2 className="font-headline-lg text-on-background uppercase border-b-4 border-primary-fixed pb-base inline-block">FROM BRIEF TO BLAST.</h2>
                </div>
                <p className="font-body-lg text-on-surface-variant max-w-md lg:text-right">Every engagement runs the same four phases. 12 weeks, no extensions. The pipeline is the deliverable.</p>
              </div>
              <div className="relative">
                <div aria-hidden="true" className="hidden lg:block absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-fixed via-secondary-container to-tertiary-fixed-dim"></div>
                <ol className="grid grid-cols-1 md:grid-cols-2 gap-gutter lg:grid-cols-none lg:flex lg:items-stretch lg:gap-0">
                  {[
                    { num: "01", numColor: "text-primary-fixed",      icon: "hearing",       dotBg: "bg-primary-fixed",       weeks: "Wks 01–02", title: "Listen.", body: "Two-week deep-dive. Founders, ops, customer interviews, competitive teardown. We finish with a list of three uncomfortable truths.", cta: "→ Truth deck",  ctaColor: "text-primary-fixed",      isLast: false },
                    { num: "02", numColor: "text-secondary-container", icon: "draw",          dotBg: "bg-secondary-container", weeks: "Wks 03–05", title: "Sketch.", body: "Three opposing routes drawn in parallel. We refuse to converge early. Every route gets killed in the room before one survives.",       cta: "→ 3 routes",    ctaColor: "text-secondary-container", isLast: false },
                    { num: "03", numColor: "text-tertiary-fixed-dim",  icon: "construction",  dotBg: "bg-tertiary-fixed-dim",  weeks: "Wks 06–10", title: "Forge.",  body: "Brand system, voice, motion, code, and the launch site. Built in the open with the client team in our Figma all day.",                cta: "→ Live build",  ctaColor: "text-tertiary-fixed-dim",  isLast: false },
                    { num: "04", numColor: "text-primary-fixed",      icon: "rocket_launch", dotBg: "bg-primary-fixed",       weeks: "Wks 11–12", title: "Ship.",   body: "Hard launch. Press kit, asset library, governance handoff. We disappear at week 13. Your team owns the brand from day one.",            cta: "→ Hand-off",    ctaColor: "text-primary-fixed",      isLast: true  },
                  ].map(p => (
                    <li key={p.num} className="relative bg-background border-2 border-outline-variant p-stack-sm flex flex-col gap-stack-sm group lg:flex-1 lg:border-r-0 lg:last:border-r-2">
                      <span aria-hidden="true" className={`material-symbols-outlined ${p.numColor} text-5xl leading-none`}>{p.icon}</span>
                      <div className="flex items-baseline justify-between border-b-2 border-outline-variant pb-base">
                        <span className={`font-display-xl text-[clamp(3rem,5vw,5rem)] ${p.numColor} leading-none tabular-nums`}>{p.num}</span>
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tabular-nums">{p.weeks}</span>
                      </div>
                      <h3 className="font-headline-md text-on-background uppercase">{p.title}</h3>
                      <p className="font-body-md text-on-surface-variant flex-grow">{p.body}</p>
                      <span className={`font-label-caps text-label-caps uppercase ${p.ctaColor} pt-base border-t border-outline-variant`}>{p.cta}</span>
                      {!p.isLast && (
                        <span aria-hidden="true" className={`hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 ${p.dotBg} border-2 items-center justify-center`} style={{ borderColor: "#0a0a14" }}>
                          <span className="material-symbols-outlined text-base leading-none" style={{ color: "#0a0a14" }}>arrow_forward</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Services */}
          <section id="services" className="py-section-padding scroll-mt-24 border-b-2 border-outline-variant bg-surface-container-low">
            <div className="container mx-auto px-margin-canvas">
              <div className="flex flex-col gap-[2px] border-y-2 border-outline-variant bg-outline-variant shadow-[12px_12px_0_0_rgba(143,143,164,0.1)]">

                <a href="#" className="bg-surface-container-low block py-stack-md flex flex-col lg:flex-row justify-between items-start lg:items-center group hover:bg-primary-container focus-visible:bg-primary-container focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white transition-colors duration-300 px-stack-sm md:px-8" aria-label="Strategy Services">
                  <div className="flex items-center gap-6">
                    <h3 className="font-display-xl text-on-background group-hover:text-white uppercase leading-none transition-colors duration-300">STRATEGY</h3>
                    <span className="material-symbols-outlined text-white text-4xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden lg:block">arrow_forward</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant group-hover:text-white max-w-[45ch] text-left lg:text-right mt-stack-sm lg:mt-0 transition-colors duration-300">Positioning that breaks through the noise and defines market categories.</p>
                </a>

                <a href="#" className="bg-surface-container-low block py-stack-md flex flex-col lg:flex-row justify-between items-start lg:items-center group hover:bg-secondary-container focus-visible:bg-secondary-container focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-black transition-colors duration-300 px-stack-sm md:px-8" aria-label="Identity Services">
                  <div className="flex items-center gap-6">
                    <h3 className="font-display-xl text-on-background group-hover:text-black uppercase leading-none transition-colors duration-300">IDENTITY</h3>
                    <span className="material-symbols-outlined text-black text-4xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden lg:block">arrow_forward</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant group-hover:text-black max-w-[45ch] text-left lg:text-right mt-stack-sm lg:mt-0 transition-colors duration-300">Visual systems built for scale, impact, and immediate recognition.</p>
                </a>

                <a href="#" className="bg-surface-container-low block py-stack-md flex flex-col lg:flex-row justify-between items-start lg:items-center group hover:bg-tertiary-container focus-visible:bg-tertiary-container focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white transition-colors duration-300 px-stack-sm md:px-8" aria-label="Digital Services">
                  <div className="flex items-center gap-6">
                    <h3 className="font-display-xl text-on-background group-hover:text-white uppercase leading-none transition-colors duration-300">DIGITAL</h3>
                    <span className="material-symbols-outlined text-white text-4xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden lg:block">arrow_forward</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant group-hover:text-white max-w-[45ch] text-left lg:text-right mt-stack-sm lg:mt-0 transition-colors duration-300">Immersive web experiences pushing the boundaries of interaction.</p>
                </a>

                <a href="#" className="bg-surface-container-low block py-stack-md flex flex-col lg:flex-row justify-between items-start lg:items-center group hover:bg-inverse-primary focus-visible:bg-inverse-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white transition-colors duration-300 px-stack-sm md:px-8" aria-label="Content Services">
                  <div className="flex items-center gap-6">
                    <h3 className="font-display-xl text-on-background group-hover:text-white uppercase leading-none transition-colors duration-300">CONTENT</h3>
                    <span className="material-symbols-outlined text-white text-4xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden lg:block">arrow_forward</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant group-hover:text-white max-w-[45ch] text-left lg:text-right mt-stack-sm lg:mt-0 transition-colors duration-300">High-fidelity production that tells radical stories.</p>
                </a>

              </div>
            </div>
          </section>

          {/* BEDROCK — premium 2x2 differentiators */}
          <section className="py-section-padding border-b-2 border-outline-variant bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-dots-pattern opacity-30 pointer-events-none" aria-hidden="true"></div>
            <div className="container mx-auto px-margin-canvas relative">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-stack-md mb-stack-lg">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed mb-8 md:mb-10 block">// BEDROCK · 04 NON-NEGOTIABLES</span>
                  <h2 className="font-headline-lg text-on-background uppercase border-b-4 border-primary-fixed pb-base inline-block">Why brands keep coming back.</h2>
                </div>
                <p className="font-body-lg text-on-surface-variant max-w-md lg:text-right">The four things that built our reputation. Picked apart, hardened, then carved into how the studio actually runs.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
                {[
                  { num: "I",   numColor: "text-secondary-container", icon: "verified",        title: "Senior team. Full stop.",     body: "Every project is led by a partner who's shipped at least a hundred brands. No interns hidden in the org chart, no junior strategists rehearsing on your dime, no bait-and-switch after the SOW signs. The names in the kick-off deck do every line of work, every week, until launch.", meta: "Avg 12 yrs in seat",   metaColor: "text-secondary-container", arrowHover: "group-hover:text-secondary-container", shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.secondary-container)]", featured: true,  pillLabel: "Lead pillar" },
                  { num: "II",  numColor: "text-primary-fixed",       icon: "design_services", title: "In-house craft.",             body: "Strategy, design, motion, code — all under one roof in Berlin and Tokyo. Nothing brokered to a downstream studio you've never met. The hand that draws the wordmark also writes the manifesto, also names the colour, also commits the front-end. The work stays coherent because the same people stay accountable.",       meta: "Zero subcontractors", metaColor: "text-primary-fixed",       arrowHover: "group-hover:text-primary-fixed",       shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.primary-container)]",   featured: false, pillLabel: ""             },
                  { num: "III", numColor: "text-tertiary-fixed-dim",  icon: "handshake",       title: "Honest pricing.",             body: "One number, posted up-front the day we agree to engage. Not an estimate, not a range, not a ladder of optional add-ons. Twelve weeks of senior work. The price doesn't move because you said something interesting in week six. If the brief grows, we tell you the day it grows — and we tell you why.",                       meta: "No change orders",    metaColor: "text-tertiary-fixed-dim",  arrowHover: "group-hover:text-tertiary-fixed-dim",  shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.tertiary-container)]",  featured: false, pillLabel: ""             },
                  { num: "IV",  numColor: "text-secondary-container", icon: "bolt",            title: "Long-after partners.",        body: "We disappear at week 13, then we pick up the phone every quarter for the next decade. The brand belongs to your team — the institutional memory of every decision, every kill, every reason behind a glyph stays here, on tap, free, for as long as the brand lives. Most studios bill the hand-off. We bill the work.",          meta: "10-yr open line",     metaColor: "text-secondary-container", arrowHover: "group-hover:text-secondary-container", shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.secondary-container)]", featured: false, pillLabel: ""             },
                ].map(c => (
                  <article key={c.num} className={`relative p-8 md:p-10 bg-surface-container border-2 border-outline-variant shadow-[8px_8px_0_0_theme(colors.outline-variant)] flex flex-col gap-5 group hover:-translate-y-1 hover:translate-x-1 ${c.shadowHover} transition-all duration-300${c.featured ? " ring-2 ring-secondary-container/60 ring-offset-2 ring-offset-background" : ""}`}>
                    {c.featured ? (
                      <span className="absolute -top-4 left-6 bg-secondary-container text-black font-label-caps text-label-caps uppercase tracking-widest px-3 py-1 border-2 border-on-background shadow-[3px_3px_0_0_theme(colors.on-background)] tabular-nums">{c.pillLabel}</span>
                    ) : null}
                    <div className="flex items-center justify-between border-b-2 border-outline-variant pb-4">
                      <span className={`font-display-xl text-[clamp(2.5rem,4vw,3.5rem)] ${c.numColor} leading-none italic tabular-nums`}>{c.num}</span>
                      <span className={`material-symbols-outlined ${c.numColor} text-3xl`} aria-hidden="true">{c.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-on-background uppercase">{c.title}</h3>
                    <p className="font-body-md text-on-surface-variant flex-grow">{c.body}</p>
                    <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
                      <span className={`font-label-caps text-label-caps uppercase ${c.metaColor} tabular-nums`}>{c.meta}</span>
                      <span className={`material-symbols-outlined text-on-surface-variant ${c.arrowHover} group-hover:translate-x-1 transition-all duration-300`}>arrow_forward</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Founders */}
          <section id="founders" className="py-section-padding scroll-mt-24 border-b-2 border-outline-variant bg-grid-pattern">
            <div className="container mx-auto px-margin-canvas">
              <h2 className="font-headline-lg text-on-background mb-stack-lg uppercase border-b-4 border-secondary-container pb-base inline-block">The Founders</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter lg:gap-16 items-start">

                <div className="border-2 border-outline-variant p-stack-sm bg-surface-container flex flex-col group h-full shadow-[8px_8px_0_0_theme(colors.outline-variant)] hover:-translate-y-1 hover:translate-x-1 transition-transform duration-300">
                  <div className="aspect-[3/4] mb-stack-sm border-2 border-outline-variant overflow-hidden relative">
                    <img
                      alt="Black and white intense portrait of Elias Vance, Creative Director"
                      width="800"
                      height="1067"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700 ease-out"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHDAV-xIbZ2nJrGhGI8AAWjno0tvImKo9KNj-1mjeBIWF_fNN03lAoa8mTZ-pindcyohMbHyi3Zilfnale8HjZPdwpjZ6nxxmoc2cuCRVWnBCO34LVjq_o8iJisUEv7dWCvKJDLbjKRNwrE2vKYCBrCPK-jK51E5X8Bg34efl7Y1PHpcazwwJXkOigutAZntEK6hROiru6EZhEI435Sg-Xuww3PQP_C1TauFuhsVy6wXwsf0cMucGoAWrOld0PkoZqTL3IaS7Sj1A"
                    />
                  </div>
                  <h3 className="font-headline-md text-on-background uppercase mb-base">ELIAS VANCE</h3>
                  <p className="font-body-lg text-on-surface-variant mb-stack-sm">Creative Director</p>
                  <p className="font-body-md text-on-background max-w-[45ch] flex-grow">Former lead at Studio X, Elias brings a ruthless editorial eye and a background in architectural design to brand identity.</p>
                </div>

                <div className="border-2 border-outline-variant p-stack-sm bg-surface-container mt-0 md:mt-stack-lg flex flex-col group h-full shadow-[8px_8px_0_0_theme(colors.outline-variant)] hover:-translate-y-1 hover:translate-x-1 transition-transform duration-300">
                  <div className="aspect-[3/4] mb-stack-sm border-2 border-outline-variant overflow-hidden relative">
                    <img
                      alt="Black and white intense portrait of Sarah Lin, Strategy Director"
                      width="800"
                      height="1067"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700 ease-out"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjQLxy2U8gQS56hTuQreMP4mK6DutLmQ7VvbzVqntq9qs02zEOUMgopoqoo9D1OR8BmObGmiWlcZNOEjMPilqFbvZSOz0l68s5gBPMzI2pVsD8RTj9sjwV2HMM6YRumEz1B03CRCxy9WCX4OSm2Qz8T2wOsFLAYhbrMhN-mKl_LdfLAwuPhb5fiFUpOA2_diIjO6Gq4vb7MuftpkDTX97pLWocUGKxR-zFJggksYzs8LOn-L9F8WDHBF8aCXgtHS54Loy0JBH2_zA"
                    />
                  </div>
                  <h3 className="font-headline-md text-on-background uppercase mb-base">SARAH LIN</h3>
                  <p className="font-body-lg text-on-surface-variant mb-stack-sm">Strategy Director</p>
                  <p className="font-body-md text-on-background max-w-[45ch] flex-grow">With a decade scaling tech decacorns, Sarah engineers brand positioning that physically disrupts market expectations.</p>
                </div>

              </div>
            </div>
          </section>

          {/* ON RECORD — testimonials, full-bleed darker grey */}
          <section className="w-full px-margin-canvas py-section-padding border-b-2 border-outline-variant relative" style={{ backgroundColor: "#0a0a14" }}>
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-stack-md mb-stack-lg">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-tertiary-fixed-dim mb-8 md:mb-10 block">// ON RECORD · 03 CLIENTS</span>
                  <h2 className="font-headline-lg text-on-background uppercase border-b-4 border-tertiary-fixed-dim pb-base inline-block">What they said after launch.</h2>
                </div>
                <p className="font-body-lg text-on-surface-variant max-w-md lg:text-right">No NDAs. No "verified buyer" widgets. The same founders we worked with, the same week the brand went live, on the record.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                {[
                  { project: "Nexus Core · 2024", accentColor: "text-tertiary-fixed-dim", shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.tertiary-container)]", quote: "They killed two of our three favourite routes in week four. We hated it for a weekend. Then we shipped the survivor, and our category got rewritten in six months.",      photo: "1767175620484-1ed37931a0d1", alt: "Portrait of Mara Okafor, founder of Nexus Core",       name: "Mara Okafor", role: "Founder · Nexus Core" },
                  { project: "Pulse Tech · 2023", accentColor: "text-secondary-container", shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.secondary-container)]", quote: "Twelve weeks. One number. The deck was the brand, not 80 slides about the brand. I have hired studios for fifteen years — nobody else delivers like this.",                       photo: "1776275758873-31603dd06112", alt: "Portrait of Daniel Reyes, CEO of Pulse Tech",          name: "Daniel Reyes", role: "CEO · Pulse Tech" },
                  { project: "Echo Void · 2024",  accentColor: "text-primary-fixed",       shadowHover: "hover:shadow-[12px_12px_0_0_theme(colors.primary-container)]",   quote: "Foundry built us a brand that walks into the room and refuses to apologise. Press cycle quadrupled. Hiring funnel tripled. The wordmark is on the office wall in concrete.", photo: "1573497019940-1c28c88b4f3e", alt: "Portrait of Yuki Tanaka, head of brand at Echo Void", name: "Yuki Tanaka", role: "Head of Brand · Echo Void" },
                ].map(t => (
                  <figure key={t.project} className={`border-2 border-outline-variant p-stack-sm bg-background flex flex-col gap-stack-sm shadow-[8px_8px_0_0_theme(colors.outline-variant)] hover:-translate-y-1 hover:translate-x-1 ${t.shadowHover} transition-all duration-300 group`}>
                    <div className="flex items-center justify-between border-b-2 border-outline-variant pb-base">
                      <span className={`font-display-xl text-[clamp(3rem,5vw,4.5rem)] ${t.accentColor} leading-none italic tabular-nums`} aria-hidden="true">"</span>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tabular-nums">{t.project}</span>
                    </div>
                    <blockquote className="font-body-lg text-on-background flex-grow">
                      {t.quote}
                    </blockquote>
                    <figcaption className="pt-base border-t border-outline-variant flex items-center gap-4">
                      <img src={`https://images.unsplash.com/photo-${t.photo}?w=120&q=80&auto=format&fit=crop`} alt={t.alt} width="120" height="120" loading="lazy" decoding="async" className="h-12 w-12 object-cover grayscale border-2 border-outline-variant" />
                      <div className="flex flex-col">
                        <span className="font-headline-md text-on-background uppercase text-base leading-tight">{t.name}</span>
                        <span className={`font-label-caps text-label-caps uppercase ${t.accentColor}`}>{t.role}</span>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-stack-lg pt-stack-sm border-t-2 border-outline-variant flex flex-col md:flex-row justify-between gap-stack-sm font-label-caps text-label-caps uppercase text-on-surface-variant">
                <span>Quotes printed verbatim · No edits · No incentives</span>
                <span className="tabular-nums">FULL CASE STUDIES → /WORK</span>
              </div>
            </div>
          </section>

          {/* CTA — toned down, less flashy */}
          <section className="py-section-padding border-b-2 border-outline-variant text-center px-margin-canvas mt-auto relative overflow-hidden bg-grid-pattern" style={{ backgroundColor: "#1a1b26" }}>
            <div className="absolute top-0 inset-x-0 h-1 bg-secondary-container" />
            <div className="absolute bottom-0 inset-x-0 h-1 bg-primary-fixed" />

            {/* Top strip — purplish glass, drifts LEFT */}
            <div aria-hidden="true" className="absolute top-[18%] -translate-y-1/2 left-[-5vw] w-[110vw] z-0 transform -rotate-2 pointer-events-none">
              <div className="border-y border-[#a78bfa]/40 py-2 md:py-3 flex overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(124,58,237,0.18)]" style={{ backgroundColor: "rgba(124,58,237,0.20)" }}>
                <div className="animate-marquee flex items-center shrink-0">
                  <span className="font-display-xl text-[#c4b5fd]/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BRIEF / SKETCH / FORGE / SHIP</span>
                  <span className="font-display-xl text-[#c4b5fd]/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BRIEF / SKETCH / FORGE / SHIP</span>
                </div>
                <div className="animate-marquee flex items-center shrink-0">
                  <span className="font-display-xl text-[#c4b5fd]/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BRIEF / SKETCH / FORGE / SHIP</span>
                  <span className="font-display-xl text-[#c4b5fd]/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BRIEF / SKETCH / FORGE / SHIP</span>
                </div>
              </div>
            </div>

            {/* Bottom strip — yellow glass, drifts RIGHT (animation-direction:reverse), in empty space below BERLIN/EST/24H */}
            <div aria-hidden="true" className="absolute bottom-12 md:bottom-16 left-[-5vw] w-[110vw] z-0 transform rotate-2 pointer-events-none">
              <div className="bg-secondary-container/15 border-y border-secondary-container/35 py-2 md:py-3 flex overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(234,234,0,0.18)]">
                <div className="animate-marquee flex items-center shrink-0 [animation-direction:reverse]">
                  <span className="font-display-xl text-secondary-container/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BUILD / BREAK / SHIP / REPEAT</span>
                  <span className="font-display-xl text-secondary-container/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BUILD / BREAK / SHIP / REPEAT</span>
                </div>
                <div className="animate-marquee flex items-center shrink-0 [animation-direction:reverse]">
                  <span className="font-display-xl text-secondary-container/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BUILD / BREAK / SHIP / REPEAT</span>
                  <span className="font-display-xl text-secondary-container/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ BUILD / BREAK / SHIP / REPEAT</span>
                </div>
              </div>
            </div>

            {/* OPEN FOR Q1 chip — pulled out of flow, sits ABOVE the top strip */}
            <span className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 z-20 font-label-caps text-label-caps uppercase tracking-widest text-secondary-container border-2 border-secondary-container/40 px-4 py-2 inline-flex items-center gap-2 bg-background/70 backdrop-blur-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
              OPEN FOR Q1 · 2 SLOTS
            </span>

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-stack-md pt-16 md:pt-24">
              <h2 className="font-display-2xl text-on-background uppercase leading-none text-balance">
                Let's make<br /><span className="text-secondary-container italic">something.</span>
              </h2>
              <p className="font-body-lg text-on-surface-variant max-w-xl">Senior teams only. Brief us in one paragraph. We respond in 48 hours, even if the answer is no.</p>
              <div className="flex flex-col sm:flex-row gap-stack-sm mt-stack-sm">
                <a className="inline-flex items-center gap-3 bg-secondary-container text-black font-headline-md uppercase px-8 md:px-10 py-4 md:py-5 hover:bg-on-background hover:text-background focus-visible:bg-on-background focus-visible:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-secondary-container transition-colors duration-200 border-2 border-secondary-container hover:border-on-background" href="mailto:hello@foundrynine.com">
                  hello@foundrynine.com
                  <span className="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
                </a>
                <a className="inline-flex items-center gap-3 bg-transparent text-on-background font-headline-md uppercase px-8 md:px-10 py-4 md:py-5 border-2 border-outline-variant hover:border-secondary-container hover:text-secondary-container transition-colors duration-200" href="#work">
                  See the work
                </a>
              </div>
              <div className="mt-stack-sm pt-stack-sm border-t border-outline-variant w-full max-w-md grid grid-cols-3 gap-base font-label-caps text-label-caps uppercase text-on-surface-variant text-center">
                <span>Berlin · Tokyo</span>
                <span className="border-x border-outline-variant tabular-nums">EST. 2019</span>
                <span>—24h reply</span>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-black dark:bg-background font-['Space_Grotesk'] font-medium uppercase tracking-widest text-xs border-t-2 border-white dark:border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-12 py-12 md:py-20 gap-8 text-center md:text-left transition-colors duration-300">
          <div className="text-gray-400 dark:text-outline order-3 md:order-1 flex-1">
            ©2024 FOUNDRY NINE.<br className="md:hidden" /> RADICAL PERSPECTIVES ONLY.
          </div>
          <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-white tracking-tighter order-1 md:order-2 drop-shadow-[2px_2px_0_theme(colors.primary-container)]">
            FOUNDRY NINE
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 order-2 md:order-3 flex-1 md:justify-end">
            <a className="text-gray-400 dark:text-outline hover:text-primary-container focus-visible:text-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm transition-colors" href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="text-gray-400 dark:text-outline hover:text-primary-container focus-visible:text-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm transition-colors" href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="text-gray-400 dark:text-outline hover:text-primary-container focus-visible:text-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm transition-colors" href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a className="text-gray-400 dark:text-outline hover:text-primary-container focus-visible:text-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm transition-colors" href="mailto:hello@foundrynine.com">Email</a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CreativeAgency;
