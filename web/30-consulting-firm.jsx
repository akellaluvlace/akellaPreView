export default function T30ConsultingFirm() {
  const navLinks = ["Insights", "Case Studies", "Partners"];

  const grid = [
    { tag: "Monograph", title: "Post-Consensus Leadership", desc: "When alignment becomes a liability in fast-moving markets, and the tactical advantages of engineered friction.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYUGGLsaQakEkJOzwtEboVvm81A34W3ZL6RmHfTYXndcmyQxWm1Wra_GynKf2yz1xnjJJ2qp1rJR_UNueJv9E2U3CFkU_HkHR4bn4ELcAAQ_0y1KDEYtzoWkBvVcG79_EwdyisQCjfVViF5B4Doe5T7Pu2R_X2SZNW-JspGKwj3d5ibn6Wteh5pkuTWkSj6ulPgA0rGL2ymSOLfiic02pQFa5k78DOtSOLMUuIsHmpHGtmmvfrYhMCdbR-gPRgScQLa_lc4-WFtmoV" },
    { tag: "Field Note", title: "The Illusion of Scale", desc: "Why adding headcount linearly decreases velocity exponentially past the Dunbar number equivalent in modern software teams.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_i_nXT6j9THgPfdxSNV8wmkHDv2Gdx_4AtuUndcQa2B4HxiG9Fp5M2pySw9ohKtBl3GvVSeTIabS3sy734MVPmqdjpPOutgEV2CPeUM1sy43RSBba-hQa5aY1Fywi6iznv9k3rkp3OwkZwprfy86jz8o7QQiayDokTTqPO910LZJeQTPlhuJFV6cMvMNfVWNHl6gz0Za7KnGoildIAx5R9RIk8l2Kht65mf1EJqQNqo2iGeAo7mwAYIprG_94RskoAyWtauednhq8" }
  ];

  const partners = [
    { name: "Elias Thorne", role: "Managing Partner", bio: "Former institutional theorist; specializes in crisis restructuring.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs8YLP6kv5Zz2A4dx5IjgKEHfa9qP32z4JIO1b4Wd2fdxTRRLuk6H7yUuE1KQXWYBMoH2c57jh7qc9CUboX65VnZPHoGqDFRjsa3aMZa2LNTJzJxeXnOgsuRpCBN7HhDX0FnGvdhjYxjK2p3aekEWnxjDAXzIWyXfbQ0w0I93lW1iFX_EfAWEE4Nu-T3ejxI0EYmh2HYPqxoGiJ2JrqOZWgrbVOckrer9oZgV2lBe2emk-vy276AJ-jsxhzEfLhsShi7Gc25AripOZ" },
    { name: "Dr. S. Vane", role: "Head of Research", bio: "Behavioral economist focused on incentive misalignment.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWrJruMnsAl7h-BttjgIRCKg7yz52XoXSO3RFOJjH56A6Bgfz9861OMJ8RhS3iEg2Y2CSDYf9kXaRkjGPQc13WvV4Q8_xWIzVxC8TruYRDlHPjlkpBKl9XRTXodYPOhTa_iXiKgTrGdugYqbJTOQYALJ-iqzxuGENpD2HLQ4dQO3vI-9P7CuE4yZka_48gu1RMwAIEqRJX-k_atb_ZRGjhQ7d-dpA_cRRvN3OUGfGwmRTJ7_JZv9UThNIcSMV3c71YxNSuGSjnvK2L" },
    { name: "M. Laurent", role: "Partner, Strategy", bio: "Architect of the post-consensus framework.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuGedZuIREkk4lXXvXaaAXLQG4jEDIhqPfGkjsVWAIu_MoaHG9pa8IP0WKALQkXIkd1vzb0ScSuBT_wlMTZbXK4K-CcZTSsac-JhLTGM8xY44tUaJzCxgMxygq06FIZMgaFbgrYkqe16JXGKoRLXui8d3Kvk3Z7bmEajDSdrT6YTEd-0ek7b-QU2kWgY2GP1jSSCz-1DO0Ds4PAAUH-IzYP_RRE5ZyO1IAECyMQLCIbKJxiqk085dI4LLvUDVZxktkAQZXZORdRuyZ", lgOnly: true }
  ];

  const movements = [
    { num: "I",   title: "Diagnostic Listening",       body: "Six weeks of unscripted interviews across three organisational layers. We refuse to read the org chart until we have read the room.", weeks: "Wks 01–06" },
    { num: "II",  title: "Network Mapping",            body: "We graph the informal communication topology against the formal hierarchy. The delta — almost always large — is where attrition lives.", weeks: "Wks 04–10" },
    { num: "III", title: "Hypothesis Drafting",        body: "We commit to three falsifiable claims about the organisation. Each one carries its own measurement protocol and its own kill criteria.", weeks: "Wks 09–14" },
    { num: "IV",  title: "Structural Intervention",    body: "A single, surgical change. Drafted with the executive team, executed by the executive team, monitored against the kill criteria from movement III.", weeks: "Wks 14–22" },
    { num: "V",   title: "Withdrawal & Documentation", body: "We leave a closed-form report and a maintenance protocol. We do not retain the engagement past month nine. The institution is not a client of ours indefinitely.", weeks: "Wks 22–26" },
  ];

  const plates = [
    { col: "md:col-span-7", aspect: "aspect-[4/3] md:aspect-auto md:h-full",            src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1400&auto=format&fit=crop", alt: "Stripped concrete interior with grid of shadows", caption: "Plate · No.46 — Headquarters, Frankfurt" },
    { col: "md:col-span-5", aspect: "aspect-[4/3] md:aspect-[3/4]",                     src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=900&auto=format&fit=crop",  alt: "High-rise tower against stark sky",                caption: "Plate · No.47 — Tower, Singapore" },
    { col: "md:col-span-4", aspect: "aspect-square",                                    src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=900&auto=format&fit=crop",  alt: "Stripped industrial interior with raw concrete",   caption: "Plate · No.48 — Floor 14, Logistics" },
    { col: "md:col-span-4", aspect: "aspect-square",                                    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop",  alt: "Geometric concrete cantilever roofline",            caption: "Plate · No.49 — Civic Hall, Brussels" },
    { col: "md:col-span-4", aspect: "aspect-square",                                    src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop",  alt: "Architectural detail of interior columns",         caption: "Plate · No.50 — Lobby, Zurich" },
  ];

  const trustedRoman = ["Lyceum & Co.", "Zurich Mercantile", "Brandt Logistik", "Vanbrugh Trust"];
  const trustedItalic = ["Mercator Group", "Halleck Maritime", "Pareto Holdings", "Kepler Industries"];

  const footerLinks = ["Archive", "Methodology", "Contact", "Legal"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fbf9f8", "on-background": "#1b1c1c",
            "surface": "#fbf9f8", "on-surface": "#1b1c1c", "on-surface-variant": "#444748",
            "primary": "#000000", "on-primary": "#ffffff",
            "secondary": "#9c4049", "on-secondary": "#ffffff",
            "outline": "#747878", "outline-variant": "#c4c7c7"
          },
          spacing: { "gutter": "32px", "stack-md": "32px", "margin-edge": "64px", "stack-lg": "80px", "stack-sm": "16px" },
          fontFamily: {
            "body-prose": ["Noto Serif", "serif"], "body-italic": ["Noto Serif", "serif"], "caption": ["Noto Serif", "serif"],
            "display-xl": ["Newsreader", "serif"], "headline-lg": ["Newsreader", "serif"], "headline-md": ["Newsreader", "serif"],
            "label-caps": ["Public Sans", "sans-serif"]
          },
          fontSize: {
            "display-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "headline-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }],
            "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
            "body-prose": ["20px", { lineHeight: "1.6", fontWeight: "400" }],
            "body-italic": ["20px", { lineHeight: "1.6", fontWeight: "400" }],
            "caption": ["15px", { lineHeight: "1.4", fontWeight: "400" }],
            "label-caps": ["12px", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "600" }]
          }
        }
      }
    }
  `;

  const css = `
    html, body { overflow-x: clip; }
    body { background-color: #F3EDE0; color: #1A1A1A; }
    .text-ink { color: #1A1A1A; }
    .text-oxblood { color: #7A2630; }
    .border-ink { border-color: #1A1A1A; }
    .bg-ink { background-color: #1A1A1A; }
    .bg-paper { background-color: #F3EDE0; }
    .border-oxblood { border-color: #7A2630; }
    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="light antialiased min-h-screen flex flex-col font-body-prose text-body-prose text-ink selection:bg-oxblood selection:text-paper">
        <header className="w-full border-b border-ink">
          <div className="max-w-[1280px] mx-auto px-16 h-24 flex justify-between items-center w-full">
            <div className="text-2xl font-semibold tracking-tighter text-ink uppercase font-display-xl">Aperture Partners</div>
            <nav className="hidden md:flex gap-8 items-center">
              {navLinks.map(l => (
                <a key={l} className="text-ink/60 font-medium uppercase text-xs tracking-widest hover:text-oxblood transition-colors duration-200 font-label-caps text-label-caps" href="#">{l}</a>
              ))}
              <a className="ml-4 font-label-caps text-label-caps uppercase text-ink hover:text-oxblood transition-colors duration-200 underline decoration-1 underline-offset-4" href="#">Index</a>
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-[1280px] mx-auto w-full px-margin-edge">
          {/* Hero — full-bleed full-screen, two-col */}
          <section className="full-bleed min-h-screen flex items-center pt-28 pb-16 px-6 md:px-margin-edge">
            <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-x-32 items-stretch">
              <div className="lg:col-span-6 flex flex-col">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-oxblood mb-6 inline-block">[ Aperture · Vol. XII · 2024 ]</span>
                <h1 className="font-display-xl text-[clamp(48px,_6vw,_72px)] leading-[1.05] mb-8 text-ink">On the work of organizing people.</h1>
                <p className="font-body-prose text-body-prose max-w-xl text-ink/80 leading-relaxed">
                  We study the structures, incentives, and unseen architectures that dictate how human endeavor scales. Our research isolates the variables that distinguish enduring institutions from those merely surviving their eras, providing empirical clarity to those tasked with steering complex enterprises.
                </p>
                <div className="mt-10 flex items-center gap-3 font-label-caps text-label-caps uppercase tracking-widest text-ink/60">
                  <span className="block w-8 h-px bg-ink/40" />
                  <span>Partners since 2014 · Zurich · Frankfurt · Singapore</span>
                </div>
              </div>
              <figure className="lg:col-span-6 relative lg:h-full">
                <div className="relative overflow-hidden rounded-2xl border border-ink bg-white/40 h-full aspect-[4/5] lg:aspect-auto">
                  <img alt="Formal black-and-white portrait of a senior partner in a dark suit" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs8YLP6kv5Zz2A4dx5IjgKEHfa9qP32z4JIO1b4Wd2fdxTRRLuk6H7yUuE1KQXWYBMoH2c57jh7qc9CUboX65VnZPHoGqDFRjsa3aMZa2LNTJzJxeXnOgsuRpCBN7HhDX0FnGvdhjYxjK2p3aekEWnxjDAXzIWyXfbQ0w0I93lW1iFX_EfAWEE4Nu-T3ejxI0EYmh2HYPqxoGiJ2JrqOZWgrbVOckrer9oZgV2lBe2emk-vy276AJ-jsxhzEfLhsShi7Gc25AripOZ" />
                  <div className="absolute top-4 left-4 bg-paper border border-ink px-3 py-1 font-label-caps text-label-caps uppercase text-ink z-10">Plate · No.01</div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-label-caps text-label-caps uppercase tracking-widest z-10">
                    <span className="bg-paper border border-ink px-3 py-1 text-ink">— Partner, anonymised</span>
                    <span className="bg-ink text-paper px-3 py-1">2024</span>
                  </div>
                </div>
              </figure>
            </div>
          </section>

          <section className="mb-stack-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-grow bg-ink/20"></div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-ink/60">Featured Inquiry</span>
              <div className="h-[1px] flex-grow bg-ink/20"></div>
            </div>
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              <div className="lg:col-span-7 aspect-[4/3] w-full border border-ink relative bg-white/50 overflow-hidden flex items-center justify-center">
                <img alt="Editorial illustration" className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcNbLxw-zsr7SrjOolxeAmEvSUpaZWeK7byxB4C-198maPoR0PFUFBsZ4QUYb1pWbvXezUZCZfqN8PLRBGKLmsdH07GL7ewAyLBQhu4k1edntQawkFnIjoaO8zAIen3dUh0c8tg70g7KAGHpSia6ifn53h6o_DGbjVyu6QsWR8bXvsKPUlN_HsTgEAy4vgoqbQbZ6qfB6VsTUmIuYuCk7jiWOr0i-mGKJk-KsyrniNu11l4MXMA4z3kZeUohNN29MefdyE9V9v9C1H" />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center h-full py-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-label-caps text-label-caps uppercase bg-ink text-white px-2 py-1">Theory</span>
                  <span className="font-caption text-caption text-ink/60">October 2024</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg mb-6 hover:text-oxblood cursor-pointer transition-colors">The Architecture of Attrition</h2>
                <p className="font-body-prose text-body-prose text-ink/80 mb-8 line-clamp-4">
                  An examination of systemic failure cascades within mid-market technology firms. We map the specific organizational geometries that accelerate talent departure when capital becomes constrained, revealing that retention is rarely an HR function, but fundamentally a design problem.
                </p>
                <div className="mt-auto">
                  <span className="font-label-caps text-label-caps uppercase text-ink tracking-widest border-b border-ink pb-1 inline-block hover:text-oxblood hover:border-oxblood transition-colors cursor-pointer">Read Full Study →</span>
                </div>
              </div>
            </article>
          </section>

          <section className="mb-stack-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-16">
              {grid.map(g => (
                <article key={g.title} className="flex flex-col border-t border-ink pt-6">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-label-caps text-label-caps uppercase text-ink/60">{g.tag}</span>
                    <div className="w-16 h-16 border border-ink rounded-full flex items-center justify-center bg-white/30 overflow-hidden">
                      <img alt="Spot illustration" className="w-full h-full object-cover grayscale mix-blend-multiply" src={g.src} />
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-4 hover:text-oxblood cursor-pointer transition-colors">{g.title}</h3>
                  <p className="font-body-prose text-body-prose text-ink/70 mb-6">{g.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Selected Case Studies — full-bleed tinted band */}
          <section className="full-bleed mb-stack-lg py-20 lg:py-28" style={{ backgroundColor: "#ECE2CE" }}>
            <div className="max-w-[1280px] mx-auto px-margin-edge">
              <div className="border-l-2 border-oxblood pl-8 ml-4">
                <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-oxblood mb-8">Selected Case Studies</h2>
                <div className="flex flex-col gap-12">
                  <article className="border border-ink p-8 bg-paper hover:bg-white/40 transition-colors relative">
                    <div className="absolute top-0 right-0 p-4 font-caption text-caption text-ink/40">01</div>
                    <h3 className="font-headline-md text-headline-md mb-4 w-3/4">Restructuring the Logistics Vanguard</h3>
                    <p className="font-body-prose text-body-prose text-ink/80 mb-6 max-w-3xl">
                      A European supply chain conglomerate faced paralysis from matrixed reporting lines. Over six months, we mapped informal communication networks against formal hierarchies, identifying bottlenecks that delayed critical decisions by weeks. The resulting structural intervention eliminated middle-management layers while establishing lateral 'hubs', restoring operational velocity without sacrificing oversight.
                    </p>
                    <span className="font-label-caps text-label-caps uppercase border-b border-ink/40 pb-1 cursor-pointer hover:border-ink">Review Engagement</span>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-stack-lg">
            <div className="text-center mb-16">
              <h2 className="font-display-xl text-display-xl">The Partners</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {partners.map(p => (
                <div key={p.name} className={`flex flex-col items-center group${p.lgOnly ? " hidden lg:flex" : ""}`}>
                  <div className="w-48 h-64 border border-ink mb-6 overflow-hidden bg-white/20">
                    <img alt="Partner Portrait" className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500" src={p.src} />
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-1">{p.name}</h3>
                  <p className="font-label-caps text-label-caps uppercase text-ink/60 mb-4 tracking-widest">{p.role}</p>
                  <p className="font-caption text-caption text-center text-ink/80 max-w-[200px]">{p.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Methodology — editorial doctrine list (full-bleed tinted band) */}
          <section className="full-bleed mb-stack-lg py-20 lg:py-28" style={{ backgroundColor: "#ECE2CE" }}>
            <div className="max-w-[1280px] mx-auto px-margin-edge">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] flex-grow bg-ink/20" />
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-ink/60">The Method</span>
              <div className="h-[1px] flex-grow bg-ink/20" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-x-32">
              <div className="lg:col-span-5 flex flex-col">
                <h2 className="font-headline-lg text-headline-lg text-ink mb-6">Five movements that constitute every engagement.</h2>
                <p className="font-body-prose text-body-prose text-ink/80">The method has been refined across thirty-eight engagements. Each movement is iterative, evidence-led, and unsigned — we do not ship a slide deck and a handshake. We ship a structural intervention you can audit.</p>
                <figure className="border border-ink overflow-hidden bg-white/40 my-auto relative group">
                  <img alt="Editorial photograph of a stairwell in brutalist concrete" className="w-full h-auto aspect-[5/4] object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1100&auto=format&fit=crop" />
                  <figcaption className="absolute bottom-3 left-3 bg-paper border border-ink px-3 py-1 font-label-caps text-label-caps uppercase text-ink">Plate · No.45 — Method, in section</figcaption>
                </figure>
                <blockquote className="border-l-2 border-oxblood pl-6 font-body-italic italic text-ink/80">
                  "The instinct to act precedes the obligation to understand. We invert that order, on principle."
                  <cite className="block mt-3 font-label-caps text-label-caps not-italic uppercase tracking-widest text-ink/60">— E. Thorne, Founding Note · 2014</cite>
                </blockquote>
              </div>
              <ol className="lg:col-span-7 lg:col-start-6 border-t border-b border-ink divide-y divide-ink">
                {movements.map(m => (
                  <li key={m.num} className="grid grid-cols-12 gap-4 py-6">
                    <span className="col-span-2 lg:col-span-1 font-display-xl text-[40px] leading-none text-oxblood tabular-nums italic">{m.num}</span>
                    <div className="col-span-10 lg:col-span-9">
                      <h3 className="font-headline-md text-headline-md text-ink mb-2">{m.title}</h3>
                      <p className="font-body-prose text-body-prose text-ink/80">{m.body}</p>
                    </div>
                    <span className="col-span-12 lg:col-span-2 font-label-caps text-label-caps text-ink/60 uppercase lg:text-right tracking-widest self-start">{m.weeks}</span>
                  </li>
                ))}
              </ol>
            </div>
            </div>
          </section>

          {/* Field Photographs — image strip */}
          <section className="mb-stack-lg">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] flex-grow bg-ink/20" />
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-ink/60">Field Photographs</span>
              <div className="h-[1px] flex-grow bg-ink/20" />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <h2 className="font-headline-lg text-headline-lg text-ink max-w-2xl">From the buildings we have studied.</h2>
              <p className="font-body-prose text-body-prose text-ink/70 max-w-md lg:text-right">A small atlas of the institutions, headquarters, and operating floors that have hosted our research between 2018 and 2024.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4">
              {plates.map(p => (
                <figure key={p.caption} className={`${p.col} ${p.aspect} border border-ink relative overflow-hidden bg-white/40 group`}>
                  <img alt={p.alt} className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700" src={p.src} />
                  <figcaption className="absolute bottom-3 left-3 bg-paper border border-ink px-3 py-1 font-label-caps text-label-caps uppercase text-ink">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-6 font-caption text-caption italic text-ink/60 text-center">Photographs · A. Thorne, Field Notes vols. III–VII, 2018–2024.</p>
          </section>

          {/* Trusted by — institutions strip */}
          <section className="mb-stack-lg border border-ink p-10 lg:p-16 bg-white/40 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-paper px-4 border border-ink text-ink font-label-caps text-label-caps uppercase">Trusted Counsel</div>
            <div className="text-center mb-10 mt-4">
              <h2 className="font-headline-lg text-headline-lg text-ink mb-3">Selected institutions, 2014–2024.</h2>
              <p className="font-body-prose text-body-prose text-ink/70 max-w-2xl mx-auto">A partial list of organisations whose senior leadership has retained us. Engagements remain confidential; the institutions have approved their inclusion below.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-ink/30 divide-x divide-ink/20">
              {trustedRoman.map(name => (
                <div key={name} className="py-6 px-4 flex items-center justify-center text-center font-display-xl text-2xl text-ink hover:text-oxblood transition-colors tracking-tight">{name}</div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-ink/30 divide-x divide-ink/20">
              {trustedItalic.map(name => (
                <div key={name} className="py-6 px-4 flex items-center justify-center text-center font-display-xl text-2xl text-ink hover:text-oxblood transition-colors tracking-tight italic">{name}</div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 font-label-caps text-label-caps uppercase text-ink/60 tracking-widest">
              <span>38 engagements · 14 sectors · Avg. retention 26 weeks</span>
              <span className="italic font-caption text-caption normal-case tracking-normal text-ink/50">— remainder of client list available on signed request.</span>
            </div>
          </section>

          {/* Friction Report — full-bleed tinted band, runs from above the card to the footer */}
          <section className="full-bleed mt-32 pt-20 pb-32 lg:pt-28 lg:pb-40 flex justify-center" style={{ backgroundColor: "#ECE2CE" }}>
            <div className="max-w-[1280px] mx-auto w-full px-6 md:px-margin-edge flex justify-center">
              <div className="border border-ink bg-paper p-12 max-w-2xl text-center w-full relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ECE2CE] px-4 border border-ink text-oxblood font-label-caps text-label-caps uppercase">New Publication</div>
                <h2 className="font-headline-lg text-headline-lg mb-6 mt-4">The Friction Report: Q3</h2>
                <p className="font-body-prose text-body-prose text-ink/70 mb-8 mx-auto max-w-md">Our quarterly synthesis of empirical findings on organizational drag and operational decay.</p>
                <button className="bg-ink text-white font-label-caps text-label-caps uppercase px-8 py-4 hover:bg-oxblood transition-colors w-full sm:w-auto tracking-widest">
                  Request Digital Copy
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-ink bg-[#F3EDE0] text-[#1A1A1A]">
          <div className="max-w-[1280px] mx-auto px-16 py-12 flex flex-col md:flex-row justify-between items-baseline gap-8">
            <div className="text-xl font-bold text-ink tracking-tighter uppercase font-display-xl">Aperture Partners</div>
            <nav className="flex gap-6 flex-wrap">
              {footerLinks.map(l => (
                <a key={l} className="text-ink/50 uppercase tracking-widest text-[10px] hover:text-ink transition-opacity font-label-caps" href="#">{l}</a>
              ))}
            </nav>
            <div className="font-caption text-sm italic text-ink/60">© 2024 Aperture Partners. Strategic Intelligence for the Global Vanguard.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
