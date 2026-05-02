export default function T32StudioShowcase() {
  const navLinks = [
    { href: "#work", label: "Work", active: true },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" }
  ];

  const stats = [
    { value: "14", label: "Shipped products" },
    { value: "8", label: "Active clients" },
    { value: "100%", label: "Client retention" }
  ];

  const projects = [
    {
      slug: "nexus-analytics", year: "2023 / Fintech", title: "Nexus Analytics",
      desc: "Complete rebuild of a legacy financial dashboard, improving query performance by 400% and introducing a new design system.",
      tags: ["React", "Node.js", "PostgreSQL"],
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
      alt: "A sleek, high-contrast dashboard interface showing data charts and analytical graphs."
    },
    {
      slug: "aura-intelligence", year: "2024 / AI Platform", title: "Aura Intelligence",
      desc: "Integration of LLM capabilities into enterprise workflows with a custom secure wrapper and real-time interface.",
      tags: ["Python", "Next.js", "OpenAI API"],
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
      alt: "A minimalist AI chat interface with a dark theme and typography-focused design."
    }
  ];

  const services = [
    { num: "01", slug: "service-web", title: "Web development", desc: "Full-stack engineering for robust, scalable web applications. We build resilient architectures that perform under pressure." },
    { num: "02", slug: "service-ai", title: "AI integration", desc: "Practical implementation of machine learning and LLMs into your existing products to automate workflows and enhance capabilities." },
    { num: "03", slug: "service-landing", title: "Landing pages", desc: "High-conversion, technically flawless marketing surfaces designed to communicate complex value propositions clearly." },
    { num: "04", slug: "service-product", title: "Product builds", desc: "Zero-to-one engineering for startups. We take concepts and turn them into market-ready MVPs with solid technical foundations." }
  ];

  const footerLinks = [
    { href: "#work", label: "Work" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
    { href: "mailto:hello@example.com", label: "Email" },
    { href: "#", label: "LinkedIn", external: true }
  ];

  const stripCards = [
    { name: "Riverpath",      meta: "€ / mobility · 2024",      img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=600", alt: "Brutalist concrete facade in raking light" },
    { name: "Solon",          meta: "NL / health · 2023",       img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=600", alt: "Editorial portrait, dramatic side-light" },
    { name: "Meridian Cargo", meta: "UK / logistics · 2023",    img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&q=85&w=600", alt: "Brutalist tower against stark sky" },
    { name: "Norah & Sons",   meta: "IE / commerce · 2022",     img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=85&w=600", alt: "Portrait of a thoughtful subject in soft window light" },
    { name: "Forge.io",       meta: "DE / industrial · 2022",   img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=85&w=600", alt: "Industrial machinery detail" },
    { name: "Verba Press",    meta: "FR / publishing · 2022",   img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=85&w=600", alt: "Editorial portrait in monochrome" },
    { name: "Anvil Capital",  meta: "IE / fintech · 2021",      img: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&q=85&w=600", alt: "Architectural shadow play on facade" },
    { name: "Hexall",         meta: "US / SaaS · 2021",         img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=85&w=600", alt: "Black and white editorial figure with deep shadow" },
    { name: "Lumen Hotel Co.",meta: "PT / hospitality · 2020",  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=85&w=600", alt: "Architectural lobby" },
    { name: "Garda Bureau",   meta: "IE / public · 2020",       img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=85&w=600", alt: "Editorial portrait with drape lighting" },
    { name: "Tollwise",       meta: "UK / mobility · 2019",     img: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=85&w=600", alt: "Highway in raking light" },
    { name: "Ostro Atelier",  meta: "IT / fashion · 2019",      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=600", alt: "Editorial figure with strong contrast" }
  ];

  const commissions = [
    {
      n: "01", client: "Riverpath · 2024", reverse: false,
      title: "Operations console for a 14-route ferry network",
      img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&q=85&w=1200",
      alt: "Brutalist tower against stark sky, evoking the Riverpath operations interior",
      body: "Riverpath operates passenger and freight crossings along the Liffey corridor and across to Holyhead. They came to us with a brief to replace a creaking dispatcher screen — eight years of accumulated half-features, ten dispatchers all using it differently. Our deliverable was an opinionated console: one route view, one delay queue, one manifest editor. We rewrote the booking ingestion pipeline, redesigned the dispatcher loop around what the senior crew actually did at 06:00, and shipped to all terminals over a six-week phased rollout. Mean time to acknowledge a delay dropped from 12 minutes to under 90 seconds in the first month."
    },
    {
      n: "02", client: "Solon Health · 2023", reverse: true,
      title: "Clinician-facing triage AI with end-to-end audit",
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=85&w=1200",
      alt: "Architectural lobby in soft natural light, evoking the Solon clinical reception space",
      body: "Solon runs nine GP practices in the Randstad. The clinical lead wanted an LLM-powered triage assistant for the front desk, but every previous vendor had stumbled on the same wall: GDPR-grade audit on every model call. We built the assistant on a regional inference endpoint, wrote a token-level audit log that fed straight into their DPIA dashboard, and gave clinicians a one-click revert that quarantined any flagged interaction. The system now handles roughly 1,400 triages per week. Solon's clinical board ships its postmortem template — refined from ours — to two adjacent networks under a permissive licence."
    },
    {
      n: "03", client: "Forge.io · 2022–24", reverse: false,
      title: "A 26-month build for a precision-machining cooperative",
      img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=85&w=1200",
      alt: "Industrial machinery detail in tungsten light, evoking the Forge.io shop floor",
      body: "Forge.io is a Munich cooperative of seventeen machine shops sharing capacity and quoting jobs together. We engaged in 2022 to design the shared quoting layer; what started as a four-month engagement turned into a 26-month partnership covering the quoting engine, the floor-side scheduling tool, and a customer portal that publishes live capacity. Two of our partners spent extended residencies on the shop floor in Augsburg and Rosenheim — there's no remote-only path to a control loop that respects how a CNC operator actually thinks. Today the cooperative quotes 41% more jobs per week with the same headcount."
    }
  ];

  const processSteps = [
    {
      n: "01", week: "week 0–2", label: "Discovery",
      title: "Decide what we're actually building",
      body: "Two weeks of structured listening. We sit with the people who will use the thing every day — dispatchers, clinicians, shop-floor leads, whoever they are — and watch them work for at least six hours without proposing anything. We then write a one-page brief and a list of explicit non-goals. If we can't agree the non-goals, we don't move forward; this is the exit ramp where projects die cheaply if they're going to die."
    },
    {
      n: "02", week: "week 2–4", label: "Architecture",
      title: "Pick the boring parts deliberately",
      body: "Two weeks where one partner writes a request-for-comments document — usually 3,000 to 5,000 words — covering data model, runtime, deployment topology, failure modes, and three explicit alternatives we considered and rejected. The client engineering counterpart annotates it. We expect at least one round of pushback. The output is a signed-off architecture spec that becomes the contract for the build phase. No code is written until this exists."
    },
    {
      n: "03", week: "week 4–12", label: "Build",
      title: "Eight weeks of weekly deliverables",
      body: "The build phase runs in week-long deliverables, not two-week sprints. Every Friday at 16:00 Dublin we ship something visible — a working flow, a failing test we just fixed, a migration that ran successfully against staging — and write a public changelog entry inside the client's own Slack or Linear. There is no separate status report. The changelog is the status. Clients consistently tell us this is the first engagement in years where they could actually feel velocity rather than read about it."
    },
    {
      n: "04", week: "week 12–14", label: "Hardening",
      title: "Run the thing under pressure",
      body: "Two weeks dedicated to nothing but resilience. We write the load profile we believe represents the worst realistic Tuesday morning, run it against staging, watch the dashboards, and fix what breaks. We rehearse the runbook with the client's on-call rotation — actual paging, actual escalations, actual handoff. By the end of week 14 the system has survived something close to its expected peak load with the people who'll own it watching. Anything that surprises us here gets a postmortem."
    },
    {
      n: "05", week: "week 14+", label: "Handoff",
      title: "Make ourselves replaceable on purpose",
      body: "Handoff is a written process, not a meeting. We deliver a 40-to-60-page operations manual, a recorded code tour for every major subsystem, and a 90-day retainer where we answer questions and pair-program with the in-house team but write no new features. Our success metric for handoff is the day the in-house team merges a non-trivial pull request without consulting us. If that day doesn't arrive within 90 days, we treat it as a failure of our documentation and rewrite it on our own time."
    }
  ];

  const principles = [
    {
      n: "01", title: "Decisions, not deliverables",
      body: "We sell judgment, not artefacts. A wireframe deck or a Figma file is a side-effect of thinking — it is not the thing we charge for. What clients are paying us to do is sit with their hardest open question for as many hours as it takes, propose a coherent answer, and stand behind it when it ships. If you want a vendor to execute someone else's spec, you should hire someone cheaper. If you want someone to argue with you about the spec until it is right, that is the thing we do."
    },
    {
      n: "02", title: "Ten years of compounding",
      body: "Code we ship today should still read well in 2034. We optimise for the team that will inherit the codebase three years from now — not for the velocity demo at the end of week six. That means modest dependencies, plain functions over clever abstractions, and migrations checked in as code rather than narrated in Notion. We are willing to take a slower week one in exchange for a maintainable year three. Most of our long-tenured clients describe this trade as the single biggest quiet contributor to their engineering culture."
    },
    {
      n: "03", title: "Two-deep, no contractors",
      body: "Every commit is by a Akella inMotion partner. We do not sub-contract, we do not staff-augment, and we do not put a senior name on a brief that a junior is going to execute. There are six of us and there will be six of us next year — when a partner goes on holiday, the work pauses or the second-deep partner picks it up, and the client knows that on day one. This is the unfashionable answer to scale. It is also the only one we have found that does not quietly degrade quality over a four-year horizon."
    },
    {
      n: "04", title: "Public mistakes",
      body: "Postmortems published quarterly under CC0. Every quarter we sit down for an afternoon, list the four worst calls we made on live engagements, write each one up with names redacted but root causes intact, and publish them on the studio site under a Creative Commons zero licence. Anyone is free to lift them, attribute them, or anonymously borrow the lessons. The discipline of writing a mistake down for strangers is the most expensive and most useful learning loop we have found in twelve years of running studios."
    }
  ];

  const faqs = [
    {
      q: "What's a typical engagement?",
      a: "A 14-week build is the modal shape — discovery, architecture, eight weeks of build, two of hardening, then a 90-day handoff. Engagements run from €110k for a focused console rebuild up to €420k for a full zero-to-one product. Long-form retainers exist after handoff, but we cap them at one day per partner per month, deliberately, to protect bandwidth for net-new builds."
    },
    {
      q: "Which technologies do you specialise in?",
      a: "Server-rendered TypeScript on the frontend, Postgres for almost everything underneath, Python for the AI surfaces, and a strong preference for boring, well-documented infrastructure. We will happily argue against a stack choice we think is wrong; we will not pretend to be neutral. If your existing platform is on something different and well-supported, we'll meet it where it is rather than rewrite for fashion."
    },
    {
      q: "Will you sign an NDA before disclosure?",
      a: "Yes, on a standard mutual NDA we can countersign within an afternoon. We do not sign one-way NDAs that prevent us from disclosing the existence of the engagement, because that interferes with our ability to ship the quarterly postmortems we publish under CC0. If your legal team needs a redlined version, send it directly and one of the partners will reply on the same thread."
    },
    {
      q: "Can you work with our existing engineering team?",
      a: "Most of our engagements are exactly that. We embed two partners into the client's existing repos, code review, and on-call rotation for the duration of the build, and we treat your in-house engineers as the long-term owners — not as resources we direct. Where there is no in-house team yet, we'll build the first version and help you hire its first two stewards before we leave."
    },
    {
      q: "Where are you based?",
      a: "A small studio on Aungier Street, central Dublin. Six partners, no remote-first staff, no satellite offices. We travel to clients across UK, Ireland, the Netherlands, Germany, and occasionally further when the engagement justifies extended residency. If you'd like to meet in person before signing, the espresso machine is on from 09:00 and we generally have a free chair before lunch."
    },
    {
      q: "Do you take equity?",
      a: "Rarely. We've taken minority equity in three engagements over twelve years, in each case where the founding team explicitly preferred a discounted cash rate plus a small position to a market cash rate alone. We will not accept equity in lieu of cash on a brief that we'd otherwise decline; that is the path to building the wrong thing because we can't afford to walk away."
    },
    {
      q: "Are you hiring?",
      a: "Not in 2024. We open partner roles roughly every three to four years and only when a sitting partner is ready to step back. There is no application form and no public role spec. If you've worked alongside one of us in the past and you're curious, write directly — every partner reads their own inbox and replies within the week, even when the answer is a kindly framed no."
    }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "charcoal": "#1C1C1C", "offwhite": "#F8F8F6",
            "background": "#fff8f6", "surface": "#fff8f6", "on-surface": "#271813", "on-surface-variant": "#5b4038",
            "primary": "#ae3200", "on-primary": "#ffffff", "primary-container": "#ff5a1f",
            "secondary": "#5f5e5e", "on-secondary": "#ffffff", "secondary-container": "#e2dfde",
            "tertiary": "#006494", "on-tertiary": "#ffffff",
            "outline": "#8f7067", "outline-variant": "#e4beb3"
          },
          spacing: { "unit": "4px", "margin": "clamp(1.5rem, 5vw, 2.5rem)", "xs": "8px", "sm": "16px", "md": "24px", "lg": "48px", "xl": "clamp(3rem, 8vw, 5rem)", "gutter": "24px" },
          fontFamily: {
            "display-xl": ["Inter", "sans-serif"], "h1": ["Inter", "sans-serif"], "h2": ["Inter", "sans-serif"],
            "body-md": ["Inter", "sans-serif"], "body-lg": ["Inter", "sans-serif"],
            "stat-value": ["Space Grotesk", "sans-serif"], "technical-label": ["Space Grotesk", "sans-serif"]
          },
          fontSize: {
            "display-xl": ["clamp(3rem, 6vw, 5rem)", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
            "h1": ["clamp(2.25rem, 4vw, 3rem)", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
            "h2": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
            "stat-value": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "technical-label": ["0.875rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
            "body-md": ["clamp(0.9375rem, 1.5vw, 1rem)", { lineHeight: "1.5", fontWeight: "400" }],
            "body-lg": ["clamp(1rem, 2vw, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const css = `
    body { background-color: #F8F8F6; color: #1C1C1C; }
    ::selection { background-color: #ae3200; color: #ffffff; }
    .text-balance { text-wrap: balance; }
    .text-pretty { text-wrap: pretty; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
    @keyframes strip-scroll { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
    .anim-strip-scroll { animation: strip-scroll 60s linear infinite; }
    .strip-pause:hover .anim-strip-scroll { animation-play-state: paused; }
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@300,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="light scroll-smooth font-body-md text-body-md antialiased pt-20 flex flex-col min-h-screen">
        <nav className="fixed top-0 w-full border-b border-charcoal z-50 bg-offwhite flex justify-between items-center px-6 py-4 mx-auto transition-colors duration-300">
          <a href="#" className="text-xl font-black tracking-tighter text-charcoal">Akella inMotion</a>
          <div className="hidden md:flex gap-8 items-center" aria-label="Primary Navigation">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className={`font-technical-label uppercase tracking-wider text-xs font-bold ${l.active ? "text-primary border-b-2 border-primary pb-1" : "text-secondary hover:text-primary"} transition-colors cursor-crosshair active:scale-[0.99]`}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="#contact" className="hidden md:inline-flex bg-charcoal text-offwhite font-technical-label text-technical-label px-6 py-3 uppercase hover:bg-primary transition-colors cursor-crosshair active:scale-[0.99]">Start a project</a>
            <button aria-label="Open mobile menu" aria-expanded="false" className="md:hidden flex items-center justify-center p-2 text-charcoal hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">menu</span>
            </button>
          </div>
        </nav>

        <main className="flex-grow">
          <header className="w-full px-6 md:px-margin pt-12 md:pt-20 pb-xl max-w-7xl mx-auto">
            <div className="max-w-4xl">
              <h1 className="font-display-xl text-display-xl text-charcoal mb-6 md:mb-8 text-balance">Web and AI products, built in Dublin.</h1>
              <p className="font-body-lg text-body-lg text-secondary mb-10 md:mb-12 max-w-2xl text-pretty">We engineer high-performance digital platforms for forward-thinking companies, combining rigorous technical architecture with uncompromising design.</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-16">
                <a href="#work" className="inline-flex justify-center items-center bg-charcoal text-offwhite font-technical-label text-technical-label px-8 py-4 uppercase hover:bg-primary transition-colors border border-charcoal cursor-crosshair active:scale-[0.99]">See case studies</a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border-y border-charcoal divide-y md:divide-y-0 md:divide-x divide-charcoal mt-12">
              {stats.map(s => (
                <div key={s.label} className="flex flex-col px-4 md:px-8 py-6 md:py-8">
                  <span className="font-stat-value text-stat-value text-charcoal mb-2 tabular-nums">{s.value}</span>
                  <span className="font-technical-label text-technical-label text-secondary uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </header>

          <section id="work" className="w-full max-w-7xl mx-auto px-6 md:px-margin py-xl scroll-mt-24">
            <h2 className="font-h2 text-h2 text-charcoal mb-8 md:mb-12 text-balance">Selected work</h2>
            <div className="flex flex-col gap-8 md:gap-12">
              {projects.map(p => (
                <article key={p.slug} className="bg-white border border-charcoal flex flex-col md:flex-row group transition-all relative hover:ring-1 hover:ring-inset hover:ring-charcoal">
                  <a href={`#${p.slug}`} className="absolute inset-0 z-10" aria-label={`View ${p.title} case study`}></a>
                  <div className="w-full md:w-3/5 aspect-[4/3] md:aspect-auto md:min-h-[400px] bg-secondary-container border-b md:border-b-0 md:border-r border-charcoal overflow-hidden relative">
                    <img src={p.img} alt={p.alt} width="800" height="600" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" loading="lazy" decoding="async" />
                  </div>
                  <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between relative z-20 pointer-events-none">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="font-technical-label text-technical-label uppercase text-secondary tracking-widest">{p.year}</span>
                      </div>
                      <h3 className="font-h2 text-h2 text-charcoal mb-4 group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className="font-body-md text-body-md text-secondary mb-8 text-pretty">{p.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-8 pointer-events-auto">
                        {p.tags.map(t => (
                          <span key={t} className="px-3 py-1.5 bg-offwhite border border-charcoal font-technical-label uppercase text-[10px] text-charcoal">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-charcoal flex justify-between items-center group-hover:text-primary transition-colors">
                      <span className="font-technical-label text-technical-label uppercase">View case study</span>
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="services" className="w-full max-w-7xl mx-auto px-6 md:px-margin py-xl scroll-mt-24">
            <h2 className="font-h2 text-h2 text-charcoal mb-8 md:mb-12 border-b border-charcoal pb-4 text-balance">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-charcoal">
              {services.map(s => (
                <article key={s.num} className="relative border-r border-b border-charcoal p-8 md:p-12 bg-white transition-colors duration-300 group hover:bg-white focus-within:bg-white">
                  <a href={`#${s.slug}`} className="absolute inset-0 z-10" aria-label={`Learn more about ${s.title}`}></a>
                  <span className="font-stat-value text-stat-value text-secondary group-hover:text-primary transition-colors duration-300 block mb-6 md:mb-8 tabular-nums">{s.num}</span>
                  <h3 className="font-h2 text-h2 mb-4 text-charcoal group-hover:text-primary transition-colors duration-300">{s.title}</h3>
                  <p className="font-body-md text-body-md text-secondary group-hover:text-charcoal transition-colors duration-300 text-pretty">{s.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="selected-strip" className="w-full overflow-hidden border-y border-charcoal bg-surface-container-low py-xl scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-margin mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="font-technical-label text-technical-label uppercase tracking-widest text-on-tertiary-fixed-variant block mb-3">[ archive · 2019–2024 ]</span>
                <h2 className="font-h2 text-h2 text-charcoal text-balance max-w-xl">Selected work — 12 projects</h2>
              </div>
              <p className="font-body-md text-body-md text-secondary max-w-md text-pretty">Hover the strip to pause. Each card pairs a portrait of the build environment with the client mark, sector, and shipping year. Older entries are intentionally surfaced — we don't believe in burying provenance.</p>
            </div>
            <div className="strip-pause relative w-full">
              <div className="flex gap-6 md:gap-8 px-6 md:px-margin will-change-transform anim-strip-scroll motion-reduce:!animate-none" style={{ width: "max-content" }}>
                {[...stripCards, ...stripCards].map((c, i) => (
                  <article key={`${c.name}-${i}`} className="shrink-0 w-[220px] md:w-[260px] bg-offwhite border border-charcoal flex flex-col">
                    <div className="aspect-square overflow-hidden relative bg-surface-variant">
                      <img src={c.img} alt={c.alt} width="600" height="600" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale-[50%] mix-blend-luminosity" />
                      <div className="absolute inset-0 bg-surface-variant/30 mix-blend-overlay pointer-events-none"></div>
                    </div>
                    <div className="p-4 border-t border-charcoal flex flex-col gap-1">
                      <span className="font-h2 text-base font-bold text-charcoal leading-tight">{c.name}</span>
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-on-tertiary-fixed-variant">{c.meta}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="commissions" className="w-full max-w-7xl mx-auto px-6 md:px-margin py-xl scroll-mt-24">
            <div className="border-b border-charcoal pb-6 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-h2 text-h2 text-charcoal text-balance max-w-xl">Recent commissions</h2>
              <span className="font-technical-label uppercase tracking-widest text-[11px] text-on-tertiary-fixed-variant">three case studies · last 18 months</span>
            </div>

            <div className="flex flex-col gap-16 md:gap-24">
              {commissions.map(c => (
                <article key={c.n} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                  <div className={c.reverse ? "md:col-span-7 md:order-2 order-1" : "md:col-span-7"}>
                    <div className="aspect-[4/3] overflow-hidden bg-surface-variant border border-charcoal relative">
                      <img src={c.img} alt={c.alt} width="1200" height="900" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale-[60%]" />
                    </div>
                  </div>
                  <div className={c.reverse ? "md:col-span-5 md:pt-6 md:order-1 order-2" : "md:col-span-5 md:pt-6"}>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-tertiary-container">Commission {c.n}</span>
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-on-tertiary-fixed-variant">{c.client}</span>
                    </div>
                    <h3 className="font-h2 text-h2 text-charcoal mb-5 text-balance">{c.title}</h3>
                    <p className="font-body-md text-body-md text-secondary text-pretty">{c.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="process" className="w-full max-w-7xl mx-auto px-6 md:px-margin py-xl scroll-mt-24">
            <div className="border-b border-charcoal pb-6 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="font-technical-label text-technical-label uppercase tracking-widest text-on-tertiary-fixed-variant block mb-3">[ method ]</span>
                <h2 className="font-h2 text-h2 text-charcoal text-balance max-w-xl">How a project unfolds</h2>
              </div>
              <p className="font-body-md text-body-md text-secondary max-w-md text-pretty">A typical engagement runs fourteen weeks from kickoff to handoff. Heavier programmes hold the same shape, just with longer build and hardening windows. We don't run sprints; we run weeks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
              <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
                <div className="aspect-[3/4] overflow-hidden bg-surface-variant border border-charcoal relative">
                  <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=900" alt="Tall brutalist concrete facade catching warm raking light — evoking sustained build cadence" width="900" height="1200" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-surface-variant/40 mix-blend-overlay pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent">
                    <span className="font-technical-label uppercase tracking-widest text-[10px] text-offwhite block mb-2">[ figure 01 ]</span>
                    <span className="font-h2 text-base font-bold text-offwhite leading-snug">Sustained build cadence — fourteen weeks of weekly deliverables, no sprint theatre.</span>
                  </div>
                </div>
              </div>

              <ol className="md:col-span-7 flex flex-col gap-10 md:gap-14 list-none">
                {processSteps.map(s => (
                  <li key={s.n} className="border-l-2 border-charcoal pl-6 md:pl-8">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-stat-value text-stat-value text-charcoal tabular-nums">{s.n}</span>
                      <em className="font-body-md italic text-on-tertiary-fixed-variant text-sm">{s.week}</em>
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-tertiary-container">{s.label}</span>
                    </div>
                    <h3 className="font-h2 text-xl text-charcoal mb-3 leading-tight">{s.title}</h3>
                    <p className="font-body-md text-body-md text-secondary text-pretty">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="doctrine" className="w-full bg-surface-container-high border-y border-charcoal py-xl scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-margin">
              <div className="border-b border-charcoal pb-6 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <span className="font-technical-label text-technical-label uppercase tracking-widest text-on-tertiary-fixed-variant block mb-3">[ doctrine ]</span>
                  <h2 className="font-h2 text-h2 text-charcoal text-balance max-w-xl">Operating principles</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md text-pretty">Four sentences we use to decide. They show up on the wall in the studio, in the first slide of every kickoff, and at the top of every retrospective.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-charcoal border border-charcoal">
                {principles.map(p => (
                  <article key={p.n} className="bg-surface-container-high p-8 md:p-10 flex flex-col gap-5">
                    <span className="font-stat-value text-stat-value text-tertiary-container tabular-nums leading-none">{p.n}</span>
                    <h3 className="font-h2 text-xl font-bold text-charcoal leading-tight">{p.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-pretty">{p.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="w-full max-w-5xl mx-auto px-6 md:px-margin py-xl scroll-mt-24">
            <div className="border-b border-charcoal pb-6 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="font-technical-label text-technical-label uppercase tracking-widest text-on-tertiary-fixed-variant block mb-3">[ frequently asked ]</span>
                <h2 className="font-h2 text-h2 text-charcoal text-balance">Direct answers, no marketing voice</h2>
              </div>
              <p className="font-body-md text-body-md text-secondary max-w-sm text-pretty">If your question isn't here, write to us. The first reply will come from one of the partners, usually within a working day.</p>
            </div>

            <div className="border-t border-charcoal">
              {faqs.map(f => (
                <details key={f.q} className="group border-b border-charcoal py-6 md:py-8">
                  <summary className="flex justify-between items-start gap-6 cursor-pointer list-none">
                    <h3 className="font-h2 text-xl md:text-2xl text-charcoal text-balance flex-1">{f.q}</h3>
                    <span className="material-symbols-outlined text-charcoal text-3xl shrink-0 transition-transform group-open:rotate-45" aria-hidden="true">add</span>
                  </summary>
                  <p className="font-body-md text-body-md text-secondary text-pretty mt-4 max-w-3xl">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-charcoal text-offwhite font-technical-label uppercase text-[10px] tracking-widest w-full border-t border-charcoal flex flex-col md:flex-row justify-between items-center px-6 md:px-margin py-12 gap-8 mt-auto">
          <div className="text-lg font-stat-value font-bold text-offwhite normal-case tracking-tighter">Akella inMotion</div>
          <nav className="flex flex-wrap gap-6 justify-center" aria-label="Footer Navigation">
            {footerLinks.map(l => (
              <a key={l.label} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className="text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline px-1">{l.label}</a>
            ))}
          </nav>
          <div className="text-secondary tabular-nums text-center md:text-right">© 2024 Akella inMotion.<br className="md:hidden" /> Built in Dublin.</div>
        </footer>
      </div>
    </>
  );
}
