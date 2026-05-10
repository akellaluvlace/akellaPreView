const NAV_LINKS = [
  { id: "section-01", label: "01/08", icon: "person", filled: true, name: "01 Introduction", active: true },
  { id: "section-02", label: "02/08", icon: "visibility", filled: false, name: "02 Status Quo", active: false },
  { id: "section-03", label: "03/08", icon: "bolt", filled: false, name: "03 Services", active: false },
  { id: "section-04", label: "04/08", icon: "architecture", filled: false, name: "04 Methodology", active: false },
  { id: "section-05", label: "05/08", icon: "trending_up", filled: false, name: "05 Traction", active: false },
  { id: "section-06", label: "06/08", icon: "format_quote", filled: false, name: "06 Praise", active: false },
  { id: "section-07", label: "07/08", icon: "help_outline", filled: false, name: "07 Studio Notes", active: false },
  { id: "section-08", label: "08/08", icon: "calendar_today", filled: false, name: "08 Contact", active: false },
];

const SERVICES = [
  { title: "Brand Identity", body: "Foundational positioning, naming, and core messaging frameworks designed for market differentiation.", tag: "Core Foundation" },
  { title: "Narrative Strategy", body: "Crafting compelling pitch decks, investor stories, and public-facing narratives that resonate with high-net-worth audiences.", tag: "Story Architecture" },
  { title: "Visual Systems", body: "Developing rigorous, scalable design languages that communicate intellectual authority and quiet luxury.", tag: "Aesthetic Execution" },
];

const STATUS_STATS = [
  { label: "Decks reviewed", value: "412", suffix: "" },
  { label: "Indistinct", value: "73", suffix: "%", accent: true },
  { label: "Worth keeping", value: "9", suffix: "%" },
];

const METHOD_STEPS = [
  { num: "I.", title: "Diagnose", body: "Six weeks of interviews, audit, and competitor cartography. The objective is one sentence the founder believes in.", meta: "Q1 · 6 weeks" },
  { num: "II.", title: "Architect", body: "Narrative spine, naming, taglines, voice register. Every sentence in your future deck traces back to this document.", meta: "Q2 · 8 weeks" },
  { num: "III.", title: "Render", body: "Visual system, type stack, colour discipline, motion principles. We finish with a 60-page brand bible and a working pitch deck.", meta: "Q3 · 10 weeks" },
  { num: "IV.", title: "Steward", body: "Quarterly reviews for twelve months. We sit beside the founder while the brand meets its first investors, hires, and customers.", meta: "Q4+ · 12 months" },
];

const TRACTION_STATS = [
  { value: "42", suffix: "", label: "Founders advised" },
  { value: "$1.4", suffix: "B", label: "Capital raised post-engagement" },
  { value: "11", suffix: "", label: "Series-B graduates" },
  { value: "96", suffix: "%", label: "Repeat retainer rate" },
];

const POLAROIDS = [
  { rotClass: "polaroid-1", pos: "top-2 left-4 md:left-12", z: "", name: "Maya H. · Atrium", alt: "Maya Hartwell, founder of Atrium", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=85&auto=format&fit=crop" },
  { rotClass: "polaroid-2", pos: "top-12 left-32 md:left-56", z: "z-10", name: "Jonas V. · Vellum", alt: "Jonas Verheyden, founder of Vellum", src: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=600&q=85&auto=format&fit=crop" },
  { rotClass: "polaroid-3", pos: "top-48 left-16 md:left-32", z: "z-20", name: "Inez C. · Forester", alt: "Inez Caro, founder of Forester", src: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=600&q=85&auto=format&fit=crop" },
  { rotClass: "polaroid-4", pos: "top-44 right-4 md:right-32", z: "z-10", name: "Alec R. · Northbridge", alt: "Alec Roselund, founder of Northbridge", src: "https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=600&q=85&auto=format&fit=crop" },
  { rotClass: "polaroid-5", pos: "bottom-2 left-48 md:left-64", z: "z-30", name: "Petra L. · Quietest", alt: "Petra Linde, founder of Quietest", src: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=600&q=85&auto=format&fit=crop" },
];

const FAQS = [
  { q: "What is the typical engagement length?", a: "Twenty-four to thirty weeks across the four quarters. Stewardship continues for twelve months. We do not accept engagements shorter than the full diagnostic phase." },
  { q: "Do you take equity in lieu of fee?", a: "For pre-seed engagements, we will accept up to forty percent of fee in advisor warrants. Series A and beyond are cash retainer only." },
  { q: "Who actually does the work?", a: "Oren leads every diagnostic interview personally. The architect and visual phases are co-authored with two senior collaborators — never juniors, never outsourced." },
  { q: "How many engagements run concurrently?", a: "No more than four. Two new, two in stewardship. Anything beyond that is a different studio." },
  { q: "Sectors you decline?", a: "Surveillance, gambling, attention-economy social products. We are politely indifferent toward the metaverse." },
  { q: "Will you sign an NDA before the discovery call?", a: "No. The discovery call is conceptual. NDAs are signed at the start of the diagnostic phase, before any specifics change hands." },
];

function OnePagePitch() {
  return (
    <>
      {/* head */}
      <title>Oren Blythe - Brand Strategy Advisor</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-container": "#b7e9c3",
                        "on-tertiary": "#ffffff",
                        "surface-container-high": "#e9e8e7",
                        "outline-variant": "#c4c7c7",
                        "surface-bright": "#fbf9f9",
                        "on-secondary-container": "#3d6a4c",
                        "outline": "#747878",
                        "primary-container": "#1f1f1f",
                        "inverse-surface": "#303031",
                        "surface-container-lowest": "#ffffff",
                        "on-surface": "#1b1c1c",
                        "surface-variant": "#e3e2e2",
                        "secondary-fixed-dim": "#a1d2ad",
                        "tertiary-fixed": "#e6e2d8",
                        "tertiary-container": "#201f19",
                        "on-error-container": "#93000a",
                        "on-primary": "#ffffff",
                        "on-primary-fixed-variant": "#474746",
                        "on-tertiary-fixed": "#1c1c16",
                        "secondary-fixed": "#bceec8",
                        "error-container": "#ffdad6",
                        "tertiary": "#060603",
                        "surface": "#fbf9f9",
                        "surface-container": "#efeded",
                        "primary": "#060607",
                        "tertiary-fixed-dim": "#cac6bd",
                        "on-primary-fixed": "#1b1b1c",
                        "background": "#FAF6EC",
                        "on-secondary": "#ffffff",
                        "surface-dim": "#dbdad9",
                        "on-tertiary-container": "#89877e",
                        "on-background": "#1F1F1F",
                        "surface-container-low": "#f5f3f3",
                        "error": "#ba1a1a",
                        "on-primary-container": "#888686",
                        "on-error": "#ffffff",
                        "inverse-on-surface": "#f2f0f0",
                        "on-secondary-fixed": "#00210f",
                        "on-surface-variant": "#444748",
                        "on-secondary-fixed-variant": "#224f33",
                        "primary-fixed-dim": "#c8c6c5",
                        "inverse-primary": "#c8c6c5",
                        "primary-fixed": "#e5e2e1",
                        "secondary": "#2D5A3D",
                        "on-tertiary-fixed-variant": "#484740",
                        "surface-tint": "#5f5e5e",
                        "surface-container-highest": "#e3e2e2"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "section-height": "100vh",
                        "stack-lg": "6rem",
                        "stack-sm": "1rem",
                        "gutter": "2rem",
                        "stack-md": "3rem",
                        "rule-weight": "1px",
                        "safe-margin": "5vw"
                    },
                    "fontFamily": {
                        "headline-display": ["newsreader"],
                        "label-caps": ["inter"],
                        "section-number": ["newsreader"],
                        "body-lg": ["inter"],
                        "headline-md": ["newsreader"],
                        "body-md": ["inter"],
                        "headline-lg": ["newsreader"]
                    },
                    "fontSize": {
                        "headline-display": ["4.5rem", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "400"}],
                        "label-caps": ["0.75rem", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
                        "section-number": ["1rem", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "400"}],
                        "body-lg": ["1.25rem", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "headline-md": ["2rem", {"lineHeight": "1.3", "fontWeight": "400"}],
                        "body-md": ["1rem", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "headline-lg": ["3rem", {"lineHeight": "1.2", "fontWeight": "400"}]
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body {
            background-color: #FAF6EC;
            color: #1F1F1F;
        }
        .rule-line {
            height: 1px;
            background-color: #1F1F1F;
            opacity: 0.2;
            width: 100%;
        }
        .snap-y-container {
            scroll-snap-type: y mandatory;
            height: 100vh;
            overflow-y: scroll;
        }
        .snap-section {
            scroll-snap-align: start;
            min-height: 100vh;
        }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        .polaroid {
            background: #FAF6EC;
            padding: 14px 14px 44px 14px;
            box-shadow: 0 24px 50px -18px rgba(31, 31, 31, 0.45), 0 8px 18px -10px rgba(31, 31, 31, 0.25);
            transition: transform 600ms ease, box-shadow 600ms ease;
        }
        .polaroid:hover {
            transform: rotate(0deg) translateY(-6px) scale(1.03) !important;
            box-shadow: 0 36px 70px -22px rgba(31, 31, 31, 0.55);
            z-index: 30;
        }
        .polaroid-1 { transform: rotate(-6deg); }
        .polaroid-2 { transform: rotate(3deg); }
        .polaroid-3 { transform: rotate(-2deg); }
        .polaroid-4 { transform: rotate(5deg); }
        .polaroid-5 { transform: rotate(-4deg); }
        .ob-faq summary::-webkit-details-marker { display: none; }
        .ob-faq summary { list-style: none; cursor: pointer; }
        .ob-faq summary .ob-chevron { transition: transform 250ms ease; }
        .ob-faq[open] summary .ob-chevron { transform: rotate(90deg); }
        @media (prefers-reduced-motion: reduce) {
            .ob-faq summary .ob-chevron { transition: none; }
        }
        .half-bleed-img {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
        }
` }} />

      {/* body wrapper */}
      <div className="bg-[#FAF6EC] text-[#1F1F1F] font-body-md antialiased snap-y-container">

        {/* TopAppBar */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 h-20 bg-transparent mix-blend-difference text-white">
          <div className="text-xl font-bold tracking-tighter text-[#1F1F1F]">Oren Blythe</div>
          <nav className="hidden md:flex space-x-6">
            {NAV_LINKS.map((n) => (
              <a key={n.id} className="font-serif text-base tracking-tight text-gray-400 hover:text-secondary transition-colors duration-300" href={`#${n.id}`}>{n.label}</a>
            ))}
          </nav>
          <button className="bg-[#1F1F1F] text-[#FAF6EC] px-6 py-2 text-sm font-label-caps uppercase tracking-widest hover:bg-secondary transition-colors">Inquire</button>
        </header>

        {/* SideNavBar (Desktop) */}
        <nav className="fixed left-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col space-y-12">
          <div className="font-serif text-xs uppercase tracking-widest text-[#1F1F1F] opacity-50 font-black mb-8">OB/DECK<br />MMXXIV</div>
          {NAV_LINKS.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`flex items-center space-x-4 transition-all group ${n.active ? "text-secondary font-bold scale-110 origin-left hover:text-[#1F1F1F]" : "text-gray-400 hover:text-[#1F1F1F]"}`}
            >
              <span className="material-symbols-outlined text-sm" style={n.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>{n.icon}</span>
              <span className="font-serif text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute left-8">{n.name}</span>
            </a>
          ))}
        </nav>

        <main className="w-full">

          {/* Section 01 — Introduction */}
          <section id="section-01" className="snap-section relative w-full flex flex-col justify-between px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8">
              <div className="md:col-span-1 flex flex-col">
                <span className="font-section-number text-section-number">01</span>
              </div>
              <div className="md:col-span-5 flex flex-col justify-center h-full">
                <h1 className="font-headline-display text-headline-display mb-stack-md leading-tight">Oren Blythe.<br />Helping founders build brands that last.</h1>
                <p className="font-body-lg text-body-lg max-w-md text-[#1F1F1F] opacity-80">
                  Brand strategy advisor specializing in narrative architecture and visual systems for visionary leadership.
                </p>
              </div>
              <div className="md:col-span-6 h-full flex items-center justify-end">
                <div className="w-full max-w-lg aspect-[3/4] overflow-hidden filter grayscale hover:grayscale-0 transition-all duration-700">
                  <img alt="Professional portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKojrJ8aING4Qf2Ok-Qqprrf12UW8OKrWs2nT8TzRxv-TfC9ag9JhiBu5jbMrStnbdMmDg1U_I1vxXEuRPBGghkuLBtVDrU-1FeTX2bpBADuip5dDGvZRp0AYEyAciQWMzjTvgYa1rtVTCMygUNZWJFhHyqVH0k_58vw9okxrT-wFRFhoSyVt1loDVEA8pegJnsZR2-xdAM6gB6JpihpNobWk3KVuV2aS6dRGv5Uj_uhzsL_9DzS8hov_UOqoEMioUUTpTs6yNVLw" />
                </div>
              </div>
            </div>
            <div className="rule-line mt-auto"></div>
            <div className="flex justify-between items-center mt-4 text-sm font-label-caps opacity-50 uppercase tracking-widest">
              <span>Introduction</span>
              <span>Slide 01/08</span>
            </div>
          </section>

          {/* Section 02 — Status Quo (NOVEL Pattern 7: half-full-bleed image) */}
          <section id="section-02" className="snap-section relative w-full flex flex-col justify-between px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8 items-stretch">
              <div className="md:col-span-1 flex flex-col">
                <span className="font-section-number text-section-number">02</span>
              </div>
              <div className="md:col-span-5 flex flex-col justify-center pr-0 md:pr-8">
                <span className="font-label-caps uppercase tracking-widest text-xs text-secondary mb-stack-sm">— The Status Quo</span>
                <h2 className="font-headline-lg text-headline-lg mb-stack-md leading-tight">Most founders inherit<br /><em className="not-italic text-secondary">borrowed language.</em></h2>
                <p className="font-body-lg text-body-lg max-w-md text-[#1F1F1F] opacity-80 mb-stack-md">
                  They pitch with the same vocabulary as the last cohort, the same templates, the same promises. The market hears noise — investors discount on sight, customers churn on confusion.
                </p>
                <dl className="grid grid-cols-3 gap-gutter pt-stack-md border-t border-[#1F1F1F] border-opacity-20">
                  {STATUS_STATS.map((s) => (
                    <div key={s.label}>
                      <dt className="font-label-caps text-xs uppercase tracking-widest opacity-60 mb-1">{s.label}</dt>
                      <dd className={`font-headline-md text-headline-md tabular-nums ${s.accent ? "text-secondary" : ""}`}>{s.value}{s.suffix && <span className="text-base align-top opacity-60">{s.suffix}</span>}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="md:col-span-6 relative h-full min-h-[420px] md:min-h-0">
                <div className="absolute inset-0 half-bleed-img overflow-hidden filter grayscale">
                  <img alt="Architectural facade detail" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1600&q=85&auto=format&fit=crop" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1F1F1F]/50 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-6 left-12 right-6 flex items-end justify-between gap-3">
                    <p className="font-label-caps text-white uppercase tracking-[0.3em] text-xs drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">Plate · I — Sameness</p>
                    <span className="font-label-caps text-white/80 uppercase tracking-widest text-xs drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">OB · 02</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rule-line mt-auto"></div>
            <div className="flex justify-between items-center mt-4 text-sm font-label-caps opacity-50 uppercase tracking-widest">
              <span>Status Quo</span>
              <span>Slide 02/08</span>
            </div>
          </section>

          {/* Section 03 — Services */}
          <section id="section-03" className="snap-section relative w-full flex flex-col justify-between px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow flex flex-col mt-8">
              <div className="flex items-start mb-stack-lg">
                <span className="font-section-number text-section-number mr-gutter">03</span>
                <h2 className="font-headline-lg text-headline-lg">Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-grow border-t border-l border-[#1F1F1F] border-opacity-20">
                {SERVICES.map((s) => (
                  <div key={s.title} className="border-b border-r border-[#1F1F1F] border-opacity-20 p-8 flex flex-col justify-between group hover:bg-[#1F1F1F] hover:text-[#FAF6EC] transition-colors duration-500">
                    <h3 className="font-headline-md text-headline-md mb-4">{s.title}</h3>
                    <p className="font-body-md text-body-md opacity-80 group-hover:opacity-100">{s.body}</p>
                    <div className="mt-8 flex items-center text-secondary group-hover:text-secondary-container">
                      <span className="w-2 h-2 bg-current mr-3"></span>
                      <span className="font-label-caps uppercase tracking-widest text-xs">{s.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rule-line mt-auto hidden"></div>
            <div className="flex justify-between items-center mt-4 text-sm font-label-caps opacity-50 uppercase tracking-widest">
              <span>Services</span>
              <span>Slide 03/08</span>
            </div>
          </section>

          {/* Section 04 — Methodology (NOVEL Pattern 8: sticky-rail portrait + scrolling story) */}
          <section id="section-04" className="snap-section relative w-full flex flex-col px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8">
              <div className="md:col-span-1 flex flex-col">
                <span className="font-section-number text-section-number">04</span>
              </div>
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start mb-12 md:mb-0">
                <div className="aspect-[3/4] overflow-hidden filter grayscale max-w-md">
                  <img alt="Founder at desk, in dialogue" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1200&q=85&auto=format&fit=crop" />
                </div>
                <div className="mt-stack-sm flex items-center justify-between max-w-md">
                  <span className="font-label-caps uppercase tracking-widest text-xs opacity-60">— Method · Plate II</span>
                  <span className="font-serif text-sm italic">est. MMXVIII</span>
                </div>
              </div>
              <div className="md:col-span-6 flex flex-col">
                <span className="font-label-caps uppercase tracking-widest text-xs text-secondary mb-stack-sm">— The Methodology</span>
                <h2 className="font-headline-lg text-headline-lg mb-stack-md leading-tight">A four-quarter<br />cadence.</h2>
                <ol className="flex flex-col">
                  {METHOD_STEPS.map((m, i) => (
                    <li key={m.num} className={`border-t ${i === METHOD_STEPS.length - 1 ? "border-b" : ""} border-[#1F1F1F] border-opacity-20 py-stack-sm grid grid-cols-12 gap-gutter`}>
                      <span className="col-span-2 font-section-number text-section-number text-secondary tabular-nums">{m.num}</span>
                      <div className="col-span-10">
                        <h3 className="font-headline-md text-headline-md mb-1">{m.title}</h3>
                        <p className="font-body-md text-body-md opacity-80 max-w-lg">{m.body}</p>
                        <span className="font-label-caps uppercase tracking-widest text-xs opacity-50 block mt-2">{m.meta}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="rule-line mt-stack-md"></div>
            <div className="flex justify-between items-center mt-4 text-sm font-label-caps opacity-50 uppercase tracking-widest">
              <span>Methodology</span>
              <span>Slide 04/08</span>
            </div>
          </section>

          {/* Section 05 — Traction (NOVEL Pattern 6: image-as-bg under stat strip) */}
          <section id="section-05" className="snap-section relative w-full flex flex-col justify-between px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow flex flex-col mt-8">
              <div className="flex items-start mb-stack-md">
                <span className="font-section-number text-section-number mr-gutter">05</span>
                <div>
                  <span className="font-label-caps uppercase tracking-widest text-xs text-secondary block mb-2">— Traction</span>
                  <h2 className="font-headline-lg text-headline-lg">Six years, quietly compounding.</h2>
                </div>
              </div>
              <div className="relative flex-grow rounded overflow-hidden min-h-[480px]">
                <img alt="Industrial machinery — discipline as backdrop" className="absolute inset-0 w-full h-full object-cover filter grayscale" src="https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1920&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1F1F1F]/85 via-[#1F1F1F]/70 to-[#1F1F1F]/55"></div>
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between text-[#FAF6EC]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-md flex-grow content-center max-w-5xl">
                    {TRACTION_STATS.map((t) => (
                      <div key={t.label} className="border-l border-[#FAF6EC]/40 pl-4">
                        <span className="font-headline-display text-headline-display tabular-nums leading-none">{t.value}{t.suffix && <span className="text-2xl align-top">{t.suffix}</span>}</span>
                        <span className="block font-label-caps uppercase tracking-widest text-xs mt-2 opacity-70">{t.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#FAF6EC]/30 pt-4 flex items-end justify-between gap-3 flex-wrap">
                    <p className="font-serif italic text-base md:text-lg max-w-2xl opacity-90">"Categories don't get won by louder voices — they get owned by the firm that names them first."</p>
                    <span className="font-label-caps uppercase tracking-widest text-xs opacity-60">Plate · III · MMXXIV</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rule-line mt-auto"></div>
            <div className="flex justify-between items-center mt-4 text-sm font-label-caps opacity-50 uppercase tracking-widest">
              <span>Traction</span>
              <span>Slide 05/08</span>
            </div>
          </section>

          {/* Section 06 — Praise (NOVEL Pattern 3: polaroid stack at varying rotations) */}
          <section id="section-06" className="snap-section relative w-full flex flex-col justify-between px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8 items-center">
              <div className="md:col-span-1 flex flex-col">
                <span className="font-section-number text-section-number">06</span>
              </div>
              <div className="md:col-span-4 flex flex-col justify-center">
                <span className="font-label-caps uppercase tracking-widest text-xs text-secondary mb-stack-sm">— Praise</span>
                <h2 className="font-headline-lg text-headline-lg mb-stack-md leading-tight">Founders<br />on record.</h2>
                <p className="font-body-lg text-body-lg max-w-md text-[#1F1F1F] opacity-80 mb-stack-md">
                  Five testimonials from the desks of the people who lived through the engagement. Hover any plate to surface it.
                </p>
                <div className="font-serif italic text-sm opacity-60">— Plates IV through VIII</div>
              </div>
              <div className="md:col-span-7 relative h-[520px] md:h-[600px]">
                {POLAROIDS.map((p) => (
                  <figure key={p.name} className={`polaroid ${p.rotClass} absolute ${p.pos} w-48 md:w-60 ${p.z}`}>
                    <div className="aspect-square overflow-hidden filter grayscale">
                      <img alt={p.alt} className="w-full h-full object-cover" src={p.src} />
                    </div>
                    <figcaption className="font-serif italic text-xs text-center mt-3 text-[#1F1F1F]">{p.name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="rule-line mt-auto"></div>
            <div className="flex justify-between items-center mt-4 text-sm font-label-caps opacity-50 uppercase tracking-widest">
              <span>Praise</span>
              <span>Slide 06/08</span>
            </div>
          </section>

          {/* Section 07 — Studio Notes / FAQ (M.7 details accordion) */}
          <section id="section-07" className="snap-section relative w-full flex flex-col justify-between px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8">
              <div className="md:col-span-1 flex flex-col">
                <span className="font-section-number text-section-number">07</span>
              </div>
              <div className="md:col-span-4 flex flex-col justify-start">
                <span className="font-label-caps uppercase tracking-widest text-xs text-secondary mb-stack-sm">— Studio Notes</span>
                <h2 className="font-headline-lg text-headline-lg mb-stack-md leading-tight">Frequently<br />considered.</h2>
                <p className="font-body-md text-body-md max-w-md text-[#1F1F1F] opacity-80">
                  Six recurring questions, plainly answered. Anything outside this list is best discussed in person.
                </p>
              </div>
              <div className="md:col-span-7 flex flex-col divide-y divide-[#1F1F1F]/20 border-t border-b border-[#1F1F1F]/20">
                {FAQS.map((f) => (
                  <details key={f.q} className="ob-faq group p-5">
                    <summary className="flex items-center justify-between gap-4">
                      <h3 className="font-headline-md text-headline-md">{f.q}</h3>
                      <span className="ob-chevron material-symbols-outlined text-[#1F1F1F]">chevron_right</span>
                    </summary>
                    <p className="font-body-md text-body-md opacity-80 mt-3 max-w-2xl">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
            <div className="rule-line mt-auto"></div>
            <div className="flex justify-between items-center mt-4 text-sm font-label-caps opacity-50 uppercase tracking-widest">
              <span>Studio Notes</span>
              <span>Slide 07/08</span>
            </div>
          </section>

          {/* Section 08 — Contact */}
          <section id="section-08" className="snap-section relative w-full flex flex-col justify-between px-safe-margin pt-24 pb-12">
            <div className="rule-line absolute top-24 left-0"></div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8">
              <div className="md:col-span-1 flex flex-col">
                <span className="font-section-number text-section-number">08</span>
              </div>
              <div className="md:col-span-5 flex flex-col justify-center">
                <h2 className="font-headline-lg text-headline-lg mb-stack-md">Initiate a Conversation.</h2>
                <p className="font-body-lg text-body-lg mb-stack-lg max-w-md opacity-80">
                  Currently accepting select engagements for Q3. Please provide preliminary details to schedule a discovery call.
                </p>
                <div className="flex flex-col space-y-4 font-body-md">
                  <a className="hover:text-secondary transition-colors inline-flex items-center" href="mailto:inquiries@orenblythe.com">
                    <span className="material-symbols-outlined mr-2 text-sm">mail</span>
                    inquiries@orenblythe.com
                  </a>
                  <span className="inline-flex items-center opacity-60">
                    <span className="material-symbols-outlined mr-2 text-sm">location_on</span>
                    New York / London
                  </span>
                </div>
              </div>
              <div className="md:col-span-6 flex flex-col justify-center border-l border-[#1F1F1F] border-opacity-20 pl-gutter">
                <form className="space-y-8 max-w-lg w-full">
                  <div className="relative">
                    <input id="name" placeholder=" " type="text" className="block w-full border-0 border-b border-[#1F1F1F] bg-transparent py-3 px-0 text-[#1F1F1F] focus:ring-0 focus:border-secondary transition-colors font-body-md peer" />
                    <label htmlFor="name" className="absolute top-3 left-0 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-[#1F1F1F] opacity-60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 uppercase tracking-widest font-label-caps">Full Name</label>
                  </div>
                  <div className="relative">
                    <input id="email" placeholder=" " type="email" className="block w-full border-0 border-b border-[#1F1F1F] bg-transparent py-3 px-0 text-[#1F1F1F] focus:ring-0 focus:border-secondary transition-colors font-body-md peer" />
                    <label htmlFor="email" className="absolute top-3 left-0 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-[#1F1F1F] opacity-60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 uppercase tracking-widest font-label-caps">Email Address</label>
                  </div>
                  <div className="relative">
                    <textarea id="message" placeholder=" " rows={3} className="block w-full border-0 border-b border-[#1F1F1F] bg-transparent py-3 px-0 text-[#1F1F1F] focus:ring-0 focus:border-secondary transition-colors font-body-md resize-none peer"></textarea>
                    <label htmlFor="message" className="absolute top-3 left-0 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-[#1F1F1F] opacity-60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 uppercase tracking-widest font-label-caps">Message Context</label>
                  </div>
                  <button type="submit" className="w-full bg-[#1F1F1F] text-[#FAF6EC] py-4 px-8 font-label-caps uppercase tracking-widest hover:bg-secondary transition-colors">
                    Book a Discovery Call
                  </button>
                </form>
              </div>
            </div>
            <div className="w-full pt-8 flex justify-between items-center bg-transparent mt-auto border-t border-[#1F1F1F] border-opacity-10">
              <p className="font-serif text-sm tracking-wide italic text-[#1F1F1F]">© Oren Blythe. All rights reserved.</p>
              <div className="flex space-x-6">
                <a className="text-gray-400 hover:text-secondary transition-colors font-serif text-sm tracking-wide italic" href="#">LinkedIn</a>
                <a className="text-gray-400 hover:text-secondary transition-colors font-serif text-sm tracking-wide italic" href="#">Calendly</a>
                <a className="text-gray-400 hover:text-secondary transition-colors font-serif text-sm tracking-wide italic" href="#">Privacy</a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default OnePagePitch;
