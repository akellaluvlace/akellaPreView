export default function T29CorporateB2c() {
  const navLinks = ["Industries", "Services", "Insights", "Advisors", "About"];

  const stats = [
    { value: "40", label: "Years of experience" },
    { value: "1200+", label: "Global experts" },
    { value: "$4.2B", label: "In value delivered" }
  ];

  const industries = [
    { num: "01", icon: "account_balance",         name: "Finance",       desc: "Tier-1 banking, capital markets, and post-IPO infrastructure for the world's largest balance sheets.",                  meta: "14 mandates · 2024" },
    { num: "02", icon: "health_and_safety",       name: "Healthcare",    desc: "EHR transformations, HIPAA & HITECH-aligned cloud migrations, and clinical-research data spines.",                    meta: "9 mandates · 2024" },
    { num: "03", icon: "account_balance_wallet",  name: "Government",    desc: "Sovereign cloud, FedRAMP-aligned platforms, and 30-year legacy refactors for federal agencies.",                       meta: "6 mandates · 2024" },
    { num: "04 · Featured", icon: "bolt",         name: "Energy",        desc: "Grid orchestration, SCADA modernisation, and the operational data fabric for renewables at gigawatt scale.",          meta: "11 mandates · 2024 · 4 sovereign clients", wide: true, cta: "View capabilities →" },
    { num: "05", icon: "precision_manufacturing", name: "Manufacturing", desc: "Industry 4.0 floors, MES + ERP convergence, and the digital twin for plants that cannot stop.",                       meta: "8 mandates · 2024" },
  ];

  const insights = [
    { tag: "Infrastructure", title: "The Future of Legacy Systems in Financial Hubs", desc: "An analysis of modernization strategies for tier-1 banking institutions.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC47njF1q1vS8ce7Y36W1Sp2fwSkR4ZDPqOjNd40y0wQjcanWeE0pWxeoBQtmken_1xi3cESIUT06KJtm0p1BJ_uRWb0zMdrwjemScE8zdMTmVm2L24PdbjH8bDJ-8qXhbYrSO5rBUnuDvHSTZQ5Cj00sv34BPqK5QVMNBm5TYBLjaSxoEX9AiLQwatPaTOCFJkWfyDfdxd-CYZ4BdDwmvgDK2VVCgVFJZ-TgzNEudkuyea19f45unpfwX-jG9AbfkVBGnN8Puzdm0" },
    { tag: "Data Governance", title: "Navigating Cross-Border Data Compliance in 2024", desc: "Strategic frameworks for managing multi-national operational risk.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDig3E7JSS3x1r4AqVZih6vlVuxOv8s5x0v9NAoltIGVY9THHRkoG-nAaHEX-RjwlqjlQMBWQDjO_AEzb7MisYuKdvvIQQgQXTvi2srARFU6FCGuZLxs9bi7f0L87Ig2Ok5hvW_DdbxRKLhRklHHMA-aEfYF6dv0S9j2Po_IIowLfztb9LYsUm7cBYakUvGcL1kZQ56YCsCkubN2IlBqQwIUZSsJLMuwMllPDZljsuNbQM4Ld8_uHLPHuBTdhdgwTU2M5nT8a8PwH0" },
    { tag: "Logistics Tech", title: "Automating Global Supply Chain Verticals", desc: "Evaluating the ROI of predictive routing technologies.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG1BrIfZk4l8F2gbcR-7fQ3eHknPAT_gTYC3c0nsTpt2XA_HFYIKjfJ6aRQTUZFXA8M6roBQ0sdiah3xGWyonIMfMXGWFxavDzixGMkPMLOkGb7fcVLyYVAP-EAiPGjROGgPptKkM5-mtGKWNsuiqaGy_-uuMBs1PhjhGPinMbPoLN9DY97Hnh5fVBO99ARSRioFxr7SlW9T0kpWXrdA0ipRn2y5Vdve0OgLe91wGiyo-JQXamY2o_XKyJ1tVYSp5YIsfRnDKIWwA" }
  ];

  const movements = [
    { num: "I",   title: "Diagnose",  body: "Six weeks of unscripted interviews across three organisational layers. We read the room before we read the org chart.", weeks: "Wks 01–06", cta: "Listen → Map →" },
    { num: "II",  title: "Architect", body: "A target-state blueprint for the system, the data, and the people. Drafted with the executive team, never imposed on it.",       weeks: "Wks 06–14", cta: "Model → Decide →" },
    { num: "III", title: "Deploy",    body: "Phased rollout against falsifiable claims. Live telemetry against the kill criteria from movement II. No \"big bang\" cutovers.",   weeks: "Wks 14–22", cta: "Pilot → Scale →" },
    { num: "IV",  title: "Sustain",   body: "A maintenance protocol and a closed-form report. We withdraw at month nine. The institution owns the system, not us.",              weeks: "Wks 22–26", cta: "Hand-off → Withdraw →" },
  ];

  const fields = [
    { col: "md:col-span-7", aspect: "aspect-[4/3] md:aspect-auto md:h-full", chip: "Q2 · 2024", showChip: true,  num: "FIELD · 46", title: "Headquarters · Frankfurt", titleSize: "text-xl",  alt: "Concrete facade of a financial-district headquarters", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1400&auto=format&fit=crop" },
    { col: "md:col-span-5", aspect: "aspect-[4/3] md:aspect-[3/4]",          chip: "",          showChip: false, num: "FIELD · 47", title: "Tower · Singapore",         titleSize: "text-xl",  alt: "High-rise tower against a stark sky",                  src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=900&auto=format&fit=crop" },
    { col: "md:col-span-4", aspect: "aspect-square",                          chip: "",          showChip: false, num: "FIELD · 48", title: "Data centre · Dublin",      titleSize: "text-base", alt: "Server-rack interior, blinking status LEDs",          src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop" },
    { col: "md:col-span-4", aspect: "aspect-square",                          chip: "",          showChip: false, num: "FIELD · 49", title: "Operations floor · Zürich", titleSize: "text-base", alt: "Wide industrial server-room shot",                     src: "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=900&auto=format&fit=crop" },
    { col: "md:col-span-4", aspect: "aspect-square",                          chip: "",          showChip: false, num: "FIELD · 50", title: "Civic block · Brussels",     titleSize: "text-base", alt: "Architectural detail of cantilever roofline",          src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop" },
  ];

  const voices = [
    { initials: "CG", role: "Group Chief Operating Officer", meta: "Logistics · 2023",     quote: "Six months in, the matrix that was paralysing our European operations had quietly disappeared. They never asked for credit.", shift: "" },
    { initials: "RA", role: "Chief Information Officer",     meta: "Tier-1 Bank · 2024",   quote: "The first consultancy we have hired that left us with fewer slides and more functioning systems. We brought them back twice.",  shift: "md:-translate-y-3" },
    { initials: "EM", role: "Director of Strategy",          meta: "Energy · 2024",        quote: "A team that took the time to understand the politics, then refused to play any. The intervention paid for itself in eleven months.", shift: "" },
  ];

  const footerCols = [
    { title: "Offices", links: ["London Office", "New York Office", "Singapore Office"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
    { title: "Connect", links: ["LinkedIn"] }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#f6f9ff", "on-background": "#0d1d28",
            "surface": "#f6f9ff", "on-surface": "#0d1d28", "on-surface-variant": "#43474d",
            "surface-bright": "#f6f9ff", "surface-dim": "#ccdceb", "surface-variant": "#d4e4f4",
            "surface-container-lowest": "#ffffff", "surface-container-low": "#ebf5ff", "surface-container": "#e0f0ff", "surface-container-high": "#daeafa", "surface-container-highest": "#d4e4f4",
            "primary": "#000f22", "on-primary": "#ffffff", "primary-container": "#0a2540", "on-primary-container": "#768dad", "primary-fixed": "#d2e4ff", "primary-fixed-dim": "#b0c8eb",
            "secondary": "#7a580f", "on-secondary": "#ffffff", "secondary-container": "#ffd07d", "on-secondary-container": "#79570d", "secondary-fixed": "#ffdea8", "secondary-fixed-dim": "#edc06e",
            "tertiary": "#00101f", "on-tertiary": "#ffffff", "tertiary-container": "#132636", "on-tertiary-container": "#7b8da1", "tertiary-fixed": "#d1e4fb", "tertiary-fixed-dim": "#b6c8de",
            "outline": "#74777e", "outline-variant": "#c4c6ce"
          },
          spacing: { "base": "8px", "container-max": "1280px", "margin-desktop": "64px", "section-padding": "120px", "gutter": "32px" },
          fontFamily: {
            "display-xl": ["Newsreader"], "headline-lg": ["Newsreader"], "headline-md": ["Newsreader"],
            "body-lg": ["Inter"], "body-md": ["Inter"], "label-caps": ["Inter"]
          },
          fontSize: {
            "display-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "headline-lg": ["48px", { lineHeight: "1.2", fontWeight: "500" }],
            "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
            "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
            "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
            "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }]
          }
        }
      }
    }
  `;

  const css = `
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24;
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="light bg-background text-on-background font-body-md selection:bg-secondary selection:text-on-secondary min-h-screen flex flex-col">
        <nav className="bg-[#0A2540] w-full sticky top-0 z-50 border-b border-white/10">
          <div className="flex justify-between items-center h-20 max-w-container-max mx-auto px-8 w-full">
            <a className="text-xl font-headline-md font-semibold tracking-tight text-white uppercase" href="#">Meridian Group</a>
            <div className="hidden md:flex space-x-8 items-center font-body-md">
              {navLinks.map((label) => (
                <a key={label} href="#" className="text-white/80 hover:text-[#B38B3F] transition-colors duration-200">{label}</a>
              ))}
            </div>
            <div className="hidden md:flex">
              <a className="text-[#B38B3F] font-label-caps text-label-caps uppercase tracking-widest hover:text-white transition-colors duration-200 border border-[#B38B3F] px-4 py-2 rounded scale-95 active:opacity-80" href="#">Contact Us</a>
            </div>
            <button className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>

        <main className="flex-grow">
          <section className="py-section-padding px-8 border-b border-outline-variant bg-surface-container-lowest">
            <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              <div className="lg:col-span-6 space-y-8">
                <h1 className="font-display-xl text-display-xl text-primary">Technology strategy for critical systems.</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">We partner with Fortune 1000 CIOs to architect resilient global infrastructure. Our approach combines rigorous data analysis with decades of institutional knowledge.</p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <a className="bg-secondary text-on-secondary font-label-caps text-label-caps uppercase px-8 py-4 rounded hover:opacity-90 transition-opacity" href="#">Explore services</a>
                  <a className="border border-primary text-primary font-label-caps text-label-caps uppercase px-8 py-4 rounded hover:bg-surface-dim transition-colors" href="#">Speak to an advisor</a>
                </div>
              </div>
              <div className="lg:col-span-6 mt-12 lg:mt-0 relative aspect-square lg:aspect-auto lg:h-[600px] bg-surface-dim rounded overflow-hidden border border-outline-variant">
                <img alt="" className="w-full h-full object-cover opacity-90 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNx9AOdX1YTo87kOg7PZtfxLtZJjAWbiMbbVmaG-f9AQDZByJxKta6Ly8gDTandHOlm9_BSHn8k8cRHsQmuZS_6LBlmp0yw6ratAhyTAdfDF_F2E9BYyOHuYp2nhB0PLqhzsm9DjP0bsk-wWpXmmbNO40kQip5_b46Uo-a_Zo5e0TxCxz2mqiqXfucX-UzEiHHDQ3S9PNxCkUrUQEtSUC16u8zfYIJsq-NIkB8FOIp99pvoTg0QkCn-rnj4bLQBP4BGjHLPLLjAfo" />
              </div>
            </div>
          </section>

          <section className="bg-primary-container text-on-primary-container py-16 px-8 border-b border-outline-variant">
            <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-outline/20">
              {stats.map((s, i) => (
                <div key={s.value} className={`text-center md:text-left flex flex-col justify-center pt-8 md:pt-0 ${i === 0 ? "md:pl-0" : "md:pl-12"}`}>
                  <span className="font-display-xl text-display-xl text-secondary-container">{s.value}</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-primary-container/70 mt-2">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="py-section-padding px-8 bg-background">
            <div className="max-w-container-max mx-auto">
              <div className="mb-16">
                <h2 className="font-headline-lg text-headline-lg text-primary">Industries we serve</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl">Specialized expertise tailored to highly regulated and complex global sectors.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
                {industries.map((ind) => ind.wide ? (
                  <a key={ind.name} href="#" className="bg-primary text-on-primary border border-primary rounded p-8 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(10,37,64,0.4)] transition-all duration-300 group lg:col-span-2 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none" />
                    <div className="relative flex justify-between items-start">
                      <div className="w-14 h-14 rounded-full border border-secondary-container/40 flex items-center justify-center text-secondary-container group-hover:bg-secondary-container/10 transition-colors">
                        <span className="material-symbols-outlined text-3xl font-light">{ind.icon}</span>
                      </div>
                      <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary-container/80 tabular-nums">— {ind.num}</span>
                    </div>
                    <div className="relative flex flex-col gap-3">
                      <h3 className="font-headline-md text-headline-md text-on-primary">{ind.name}</h3>
                      <p className="font-body-md text-body-md text-on-primary/70 leading-snug max-w-2xl">{ind.desc}</p>
                      <div className="flex justify-between items-end pt-4 border-t border-on-primary/20 text-on-primary/70">
                        <span className="font-label-caps text-label-caps uppercase">{ind.meta}</span>
                        <span className="font-label-caps text-label-caps uppercase text-secondary-container group-hover:text-on-primary transition-colors">{ind.cta}</span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <a key={ind.name} href="#" className="bg-surface-container-lowest border border-outline-variant rounded p-8 flex flex-col justify-between hover:bg-surface-container hover:border-[#B38B3F] hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(10,37,64,0.25)] transition-all duration-300 group">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center text-[#B38B3F] group-hover:border-[#B38B3F] group-hover:bg-[#B38B3F]/10 transition-colors">
                        <span className="material-symbols-outlined text-3xl font-light">{ind.icon}</span>
                      </div>
                      <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant tabular-nums">— {ind.num}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="font-headline-md text-headline-md text-primary">{ind.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-snug">{ind.desc}</p>
                      <div className="flex justify-between items-end pt-4 border-t border-outline-variant text-on-surface-variant">
                        <span className="font-label-caps text-label-caps uppercase">{ind.meta}</span>
                        <span className="font-label-caps text-label-caps uppercase text-secondary group-hover:text-primary transition-colors">View →</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="py-section-padding px-8 bg-surface border-t border-outline-variant">
            <div className="max-w-container-max mx-auto">
              <div className="flex justify-between items-end mb-16">
                <h2 className="font-headline-lg text-headline-lg text-primary">Latest Insights</h2>
                <a className="font-label-caps text-label-caps uppercase text-secondary hover:text-primary transition-colors hidden md:block" href="#">View all articles</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {insights.map((ins) => (
                  <article key={ins.title} className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden group flex flex-col h-full">
                    <div className="h-48 overflow-hidden bg-primary relative">
                      <div className="absolute inset-0 bg-primary-container/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img alt="" className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-700" src={ins.src} />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <span className="font-label-caps text-label-caps text-secondary uppercase mb-4 block">{ins.tag}</span>
                      <h3 className="font-headline-md text-headline-md text-primary mb-4">{ins.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-auto">{ins.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Approach — 4 movements */}
          <section className="py-section-padding px-8 bg-surface-container-lowest border-t border-outline-variant">
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-[#B38B3F] mb-3 inline-block">— Our Approach</span>
                  <h2 className="font-headline-lg text-headline-lg text-primary">Four movements, one engagement.</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md md:text-right">Refined across 38 institutional engagements. Every movement is iterative, evidence-led, and signed off jointly with the executive team.</p>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {movements.map(m => (
                  <li key={m.num} className="border-t-2 border-primary pt-8 flex flex-col gap-4 group">
                    <div className="flex justify-between items-baseline">
                      <span className="font-display-xl text-[56px] leading-none text-[#B38B3F] tabular-nums italic">{m.num}</span>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">{m.weeks}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary">{m.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{m.body}</p>
                    <span className="font-label-caps text-label-caps uppercase text-secondary mt-auto pt-4 border-t border-outline-variant group-hover:text-primary transition-colors">{m.cta}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Field Reports — image strip */}
          <section className="py-section-padding px-8 bg-primary text-on-primary">
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary-container mb-3 inline-block">— Field Reports · Vol. 12</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-primary">From the operating floors.</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-primary/70 max-w-md md:text-right">Selected photographs from 2024 engagements. Buildings anonymised. Captured by our research desk during diagnostic visits.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
                {fields.map(f => (
                  <figure key={f.num} className={`${f.col} ${f.aspect} relative overflow-hidden rounded border border-white/15 bg-primary-container group`}>
                    <img alt={f.alt} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" src={f.src} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
                    <figcaption className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <span className="block font-label-caps text-label-caps uppercase text-secondary-container">{f.num}</span>
                        <span className={`block font-headline-md ${f.titleSize} text-on-primary mt-1`}>{f.title}</span>
                      </div>
                      {f.showChip && <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps uppercase px-2 py-1 rounded">{f.chip}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-8 font-label-caps text-label-caps uppercase text-on-primary/50 tracking-widest text-center">— Photographs · Research Desk · Field Notes Vols. III–VII —</p>
            </div>
          </section>

          {/* Client Voices — testimonials */}
          <section className="py-section-padding px-8 bg-surface border-t border-outline-variant">
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-[#B38B3F] mb-3 inline-block">— Client Voices</span>
                  <h2 className="font-headline-lg text-headline-lg text-primary">In their own words.</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md md:text-right">Comments from senior leadership of institutions we have worked with. Names withheld by mutual NDA; titles and sectors confirmed.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {voices.map(v => (
                  <figure key={v.initials} className={`bg-surface-container-lowest border border-outline-variant rounded p-8 flex flex-col gap-6 hover:border-[#B38B3F] transition-colors ${v.shift}`}>
                    <span className="font-display-xl text-5xl leading-none text-[#B38B3F]">"</span>
                    <blockquote className="font-headline-md text-xl text-primary italic leading-snug">{v.quote}</blockquote>
                    <figcaption className="mt-auto pt-6 border-t border-outline-variant flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-semibold">{v.initials}</div>
                      <div>
                        <p className="font-headline-md text-base text-primary leading-tight">{v.role}</p>
                        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mt-1">{v.meta}</p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#F7F7F8] border-t border-[#E1E6EB] py-20 text-[#0A2540]">
          <div className="max-w-container-max mx-auto px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-1 flex flex-col justify-between">
                <div>
                  <span className="text-lg font-headline-md font-bold text-[#0A2540]">MERIDIAN GROUP</span>
                </div>
                <div className="mt-8 font-body-md text-slate-600">
                  <p>© 2024 Meridian Group.</p>
                  <p>Global Infrastructure & Strategic Consulting.</p>
                </div>
              </div>
              {footerCols.map((col) => (
                <div key={col.title}>
                  <h4 className="font-headline-md text-lg mb-6 text-[#0A2540]">{col.title}</h4>
                  <ul className="space-y-4 font-body-md text-slate-600">
                    {col.links.map((link) => (
                      <li key={link}><a className="hover:text-[#0A2540] underline underline-offset-4 transition-colors" href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
