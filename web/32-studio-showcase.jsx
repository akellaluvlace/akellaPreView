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
    { name: "Forge.io",       meta: "DE / industrial · 2022",   img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?auto=format&fit=crop&q=85&w=600", alt: "Industrial machinery detail" },
    { name: "Verba Press",    meta: "FR / publishing · 2022",   img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?auto=format&fit=crop&q=85&w=600", alt: "Editorial portrait in monochrome" },
    { name: "Anvil Capital",  meta: "IE / fintech · 2021",      img: "https://images.unsplash.com/photo-1618488373960-404fe668e524?auto=format&fit=crop&q=85&w=600", alt: "Architectural shadow play on facade" },
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
      img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?auto=format&fit=crop&q=85&w=1200",
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
      n: "01", icon: "gavel", accent: "charcoal",
      title: "Decisions, not deliverables", kicker: "We sell judgment, not artefacts",
      bullets: ["Hardest open question, as many hours as it takes", "Coherent answer signed in our name", "Argue the spec until it is right"]
    },
    {
      n: "02", icon: "layers", accent: "tertiary-container",
      title: "Ten years of compounding", kicker: "Reads well in 2034",
      bullets: ["Modest dependencies, plain functions", "Migrations as code, not as Notion narratives", "Slower week one for maintainable year three"]
    },
    {
      n: "03", icon: "groups", accent: "charcoal",
      title: "Two-deep, no contractors", kicker: "Every commit by a partner",
      bullets: ["Six of us, six of us next year", "Second-deep picks up, never a contractor", "No senior name on junior execution"]
    },
    {
      n: "04", icon: "edit_note", accent: "tertiary-container",
      title: "Public mistakes", kicker: "Postmortems quarterly · CC0",
      bullets: ["Four worst calls of the quarter, written up", "Names redacted, root causes intact", "The most expensive learning loop we use"]
    }
  ];
  const principleBorderColor = { charcoal: "border-charcoal", "tertiary-container": "border-tertiary-container" };
  const principleTextColor = { charcoal: "text-charcoal", "tertiary-container": "text-tertiary-container" };

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
              <div className="md:col-span-5 md:sticky md:top-28 md:self-start flex flex-col gap-6">
                <div className="aspect-[3/4] overflow-hidden bg-surface-variant border border-charcoal relative">
                  <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=900" alt="Tall brutalist concrete facade catching warm raking light — evoking sustained build cadence" width="900" height="1200" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-surface-variant/40 mix-blend-overlay pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent">
                    <span className="font-technical-label uppercase tracking-widest text-[10px] text-offwhite block mb-2">[ figure 01 ]</span>
                    <span className="font-h2 text-base font-bold text-offwhite leading-snug">Sustained build cadence — fourteen weeks of weekly deliverables, no sprint theatre.</span>
                  </div>
                </div>
                <div className="border border-charcoal p-5 bg-offwhite">
                  <span className="font-technical-label uppercase tracking-widest text-[10px] text-on-tertiary-fixed-variant block mb-4">[ cadence ]</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-stat-value text-stat-value text-charcoal tabular-nums">14 wk</span>
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-secondary">total run</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-stat-value text-stat-value text-charcoal tabular-nums">5</span>
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-secondary">stages</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-stat-value text-stat-value text-charcoal tabular-nums">Fri 16:00</span>
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-secondary">ship window</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-stat-value text-stat-value text-charcoal tabular-nums">2/yr</span>
                      <span className="font-technical-label uppercase tracking-widest text-[10px] text-secondary">engagements</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-charcoal/20 flex items-center justify-between gap-3">
                    <span className="font-technical-label uppercase tracking-widest text-[10px] text-on-tertiary-fixed-variant">[ next cohort ]</span>
                    <span className="font-technical-label uppercase tracking-widest text-[10px] text-charcoal">Q3 · 2026</span>
                  </div>
                </div>
                <div className="aspect-[5/4] overflow-hidden bg-surface-variant border border-charcoal relative">
                  <img src="https://images.unsplash.com/photo-1776275758873-31603dd06112?auto=format&fit=crop&q=85&w=900" alt="Engagement-lead reviewing the weekly Friday changelog with a client counterpart" width="900" height="720" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-surface-variant/30 mix-blend-overlay pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent">
                    <span className="font-technical-label uppercase tracking-widest text-[10px] text-offwhite block mb-1">[ figure 02 ]</span>
                    <span className="font-h2 text-sm font-bold text-offwhite leading-snug">Friday changelog · the only status report we ship</span>
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

          <section id="doctrine" className="w-full py-xl scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-margin">
              <div className="flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
                <div className="flex flex-col gap-3 max-w-xl">
                  <span className="font-technical-label text-technical-label uppercase tracking-widest text-on-tertiary-fixed-variant">[ doctrine ]</span>
                  <h2 className="font-h2 text-h2 text-charcoal text-balance">Operating principles</h2>
                </div>
                <span className="font-technical-label uppercase tracking-widest text-[10px] text-on-tertiary-fixed-variant">Four sentences · on the wall</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
                {principles.map(p => (
                  <div key={p.n} className={`flex flex-col gap-6 border-t-2 pt-6 ${principleBorderColor[p.accent]}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-stat-value text-stat-value tabular-nums leading-none ${principleTextColor[p.accent]}`}>{p.n}</span>
                      <span className={`material-symbols-outlined text-[44px] md:text-[52px] ${principleTextColor[p.accent]}`} aria-hidden="true">{p.icon}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-h2 text-[22px] text-charcoal leading-tight">{p.title}</h3>
                      <p className="font-technical-label text-[11px] uppercase tracking-[0.18em] text-on-tertiary-fixed-variant">{p.kicker}</p>
                    </div>
                    <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
                      {p.bullets.map(b => (
                        <li key={b} className="flex gap-3"><span className={`mt-[2px] font-bold ${principleTextColor[p.accent]}`}>→</span><span>{b}</span></li>
                      ))}
                    </ul>
                  </div>
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
