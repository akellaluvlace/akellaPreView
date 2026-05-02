export default function T25ResumeCvSite() {
  const navLinks = [
    { label: "Summary", href: "#summary", active: true },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" }
  ];

  const contactBits = [
    { kind: "text", value: "Stockholm, Sweden" },
    { kind: "link", value: "jonas.lindqvist@example.com", href: "mailto:jonas.lindqvist@example.com" },
    { kind: "link", value: "+46 70 123 45 67", href: "tel:+46701234567" },
    { kind: "link", value: "linkedin.com/in/jonaslindqvist", href: "https://linkedin.com/in/jonaslindqvist", external: true }
  ];

  const experience = [
    {
      company: "Acme Corp",
      title: "Senior Product Manager",
      period: "2020 — Present",
      bullets: [
        "Led cross-functional team of 15 engineers and designers to launch the flagship enterprise analytics suite, resulting in a 40% increase in enterprise tier subscriptions.",
        "Implemented rigorous A/B testing framework that improved user onboarding completion rates by 25% within two quarters.",
        "Spearheaded the transition from a monolithic architecture to microservices, improving deployment frequency by 3x and significantly reducing system downtime."
      ]
    },
    {
      company: "Globex Inc.",
      title: "Product Manager",
      period: "2016 — 2020",
      bullets: [
        "Managed the end-to-end lifecycle of the core API product, increasing developer adoption by 150% year-over-year.",
        "Collaborated closely with marketing and sales to define go-to-market strategies for three major feature releases.",
        "Established a comprehensive customer feedback loop, integrating Zendesk tickets directly into Jira for prioritized backlog grooming."
      ]
    }
  ];

  const projects = [
    { title: "Project Phoenix", body: "A complete overhaul of the legacy billing system. Orchestrated the migration of 10k+ active accounts with zero data loss and improved invoice processing speed by 80%." },
    { title: "Data Horizon", body: "Developed a machine learning-driven recommendation engine for the e-commerce platform, leading to a 12% lift in average order value during the beta phase." },
    { title: "Unified Dashboard", body: "Designed and launched a centralized command center for B2B clients, consolidating 5 disparate tools into a single pane of glass, dramatically reducing customer support inquiries." }
  ];

  const skills = ["Product Strategy", "Agile Methodologies", "Data Analytics", "User Research", "Go-To-Market", "Stakeholder Management"];

  const education = [
    { title: "M.Sc. Human-Computer Interaction", school: "KTH Royal Institute of Technology, Stockholm", period: "2014 — 2016" },
    { title: "B.Sc. Computer Science", school: "Lund University, Lund", period: "2011 — 2014" }
  ];

  const awards = [
    "Featured in \"Top 50 Product Leaders in Nordics\" by Tech Today (2022)",
    "Acme Corp Innovation Award for \"Project Phoenix\" (2021)"
  ];

  const caseStudies = [
    {
      caseTag: "Case 01 — 2023",
      employer: "Acme Corp · Senior PM",
      title: "Rebuilding API onboarding from scratch",
      lede: "Replaced a 14-step onboarding with a contextual, key-first flow. Shipped in 9 months across web, docs and CLI.",
      bullets: [
        "Day-one activation +18%, sustained over four quarters",
        "Support tickets per signup down 31%"
      ],
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=85&auto=format&fit=crop",
      alt: "Brutalist concrete facade in raking light, representing the Notion API onboarding rebuild",
      imageLeft: true
    },
    {
      caseTag: "Case 02 — 2021",
      employer: "Globex Inc. · PM",
      title: "Pricing migration without churn",
      lede: "Moved 3,200 enterprise accounts to a usage-based plan with grandfather windows and a per-account migration brief.",
      bullets: [
        "Net revenue retention +9 points; logo churn flat",
        "Migrated in 11 weeks, two engineers, zero rollback"
      ],
      image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1200&q=85&auto=format&fit=crop",
      alt: "Architectural highway in raking light, representing the pricing migration project",
      imageLeft: false
    },
    {
      caseTag: "Case 03 — 2019",
      employer: "Globex Inc. · PM",
      title: "Five tools collapsed into one console",
      lede: "Consolidated five internal admin tools into a single console for the customer-success org. Drove the spec, the design partner cohort and the rollout plan.",
      bullets: [
        "Median resolution time down 42% across tier-1 issues",
        "CSM headcount held flat through 3x account growth"
      ],
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85&auto=format&fit=crop",
      alt: "Architectural lobby in monochrome, representing the unified dashboard rollout",
      imageLeft: true
    }
  ];

  const principles = [
    { num: "01", title: "Decision over deck", body: "A one-pager that names the call, the trade-off and the date beats a 30-slide explainer every time." },
    { num: "02", title: "Sit with the user", body: "I keep one weekly hour on the calendar for an unscripted call with a customer. The roadmap follows that hour." },
    { num: "03", title: "Write the launch first", body: "If I cannot draft the launch note before kickoff, the brief is not ready. The note is the spec, doubled." },
    { num: "04", title: "Keep the team boring", body: "Predictable cadences, owned surfaces, calm reviews. Drama is a tax on shipping." }
  ];

  const press = [
    {
      venue: "ProductCon Stockholm — 2024",
      title: "Pricing without panic",
      excerpt: "A patient, methodical talk on charging more without losing your nerve.",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&q=85&auto=format&fit=crop",
      alt: "Architectural cornicing detail"
    },
    {
      venue: "Tech Today Nordics — 2022",
      title: "Top 50 Product Leaders",
      excerpt: "Among the operators redefining what serious product work looks like in the region.",
      image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=400&q=85&auto=format&fit=crop",
      alt: "Architectural shadow play on facade"
    },
    {
      venue: "Nordic PM Summit — 2023",
      title: "Quiet roadmaps, loud results",
      excerpt: "On choosing fewer bets, naming them clearly and protecting the calendar.",
      image: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=400&h=400&q=85&auto=format&fit=crop",
      alt: "Brutalist concrete interior"
    },
    {
      venue: "Lenny's Newsletter — 2024",
      title: "Guest essay on launch reviews",
      excerpt: "A practical playbook for running launch retros that teams actually attend twice.",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=400&q=85&auto=format&fit=crop",
      alt: "Editorial portrait, low-key lighting"
    },
    {
      venue: "Acme Corp — 2021",
      title: "Innovation Award · Project Phoenix",
      excerpt: "Recognised internally for the cleanest large migration the platform org had run.",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&q=85&auto=format&fit=crop",
      alt: "Brutalist staircase under hard sun"
    },
    {
      venue: "Mind the Product — 2025",
      title: "Panel: hiring senior PMs in 2025",
      excerpt: "The strongest signal is a candidate who can name a decision they got wrong.",
      image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=400&q=85&auto=format&fit=crop",
      alt: "Editorial portrait in monochrome"
    }
  ];

  const faq = [
    { q: "Why are you looking?", a: "I am winding down a long, satisfying chapter at Acme. I want to step into an earlier-stage company where the next product call lives one room away from the customer rather than four meetings away." },
    { q: "What makes you a fit for early-stage?", a: "I have shipped without a brand to lean on, written my own pricing pages, fielded my own support DMs and turned a four-person product org into a fifteen-person one without losing the throughline. I do not need a finished playbook." },
    { q: "Will you relocate?", a: "Stockholm is home. I will travel up to a week a month and overlap deeply with EU and East-Coast US hours. Permanent relocation is off the table for the next two years." },
    { q: "What is your notice period?", a: "Three months on paper, often negotiable to eight weeks. I prefer a clean handover over a fast exit." },
    { q: "Are you taking advisory roles?", a: "Yes — at most two at any time, both seed-to-Series-A B2B SaaS, with monthly cadence. I do not take advisory roles in companies competing with current full-time employers." },
    { q: "Where can I see your writing?", a: "A short essay archive lives at jonas.lindqvist.se/notes. The latest pieces are on launch reviews, pricing windows and the social tax of cross-functional rituals." }
  ];

  const footerLinks = [
    { label: "Email", href: "mailto:jonas.lindqvist@example.com" },
    { label: "LinkedIn", href: "https://linkedin.com/in/jonaslindqvist", external: true },
    { label: "Portfolio", href: "#" }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#FCFBF7", "on-background": "#111111",
            "surface": "#fbf9f9", "on-surface": "#1b1c1c", "on-surface-variant": "#434654",
            "surface-container": "#efeded", "surface-container-low": "#f5f3f3", "surface-container-high": "#e9e8e7", "surface-container-highest": "#e3e2e2", "surface-container-lowest": "#ffffff",
            "primary": "#003d9b", "on-primary": "#ffffff", "primary-container": "#0052cc", "on-primary-container": "#c4d2ff", "primary-fixed": "#dae2ff", "primary-fixed-dim": "#b2c5ff",
            "secondary": "#5f5e5e", "on-secondary": "#ffffff", "secondary-container": "#e5e2e1", "on-secondary-container": "#656464",
            "tertiary": "#7b2600", "on-tertiary": "#ffffff", "tertiary-container": "#a33500", "on-tertiary-container": "#ffc6b2",
            "outline": "#737685", "outline-variant": "#c3c6d6"
          },
          spacing: { "section_gap": "3rem", "stack_md": "1rem", "stack_sm": "0.5rem", "max_width": "720px", "content_padding": "2rem", "entry_gap": "2rem" },
          fontFamily: {
            "h1": ["Newsreader", "ui-serif", "Georgia", "serif"],
            "h2-section": ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
            "h3-company": ["Newsreader", "ui-serif", "Georgia", "serif"],
            "body-main": ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
            "chip-label": ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
            "meta-mono": ["Space Grotesk", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
          },
          fontSize: {
            "h1": ["clamp(2rem, 1.5rem + 2.5vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "h2-section": ["clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)", { lineHeight: "1.5", letterSpacing: "0.1em", fontWeight: "700" }],
            "h3-company": ["clamp(1.125rem, 1.025rem + 0.5vw, 1.25rem)", { lineHeight: "1.4", fontWeight: "600" }],
            "body-main": ["clamp(0.9375rem, 0.8875rem + 0.25vw, 1rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "chip-label": ["clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)", { lineHeight: "1", fontWeight: "500" }],
            "meta-mono": ["clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)", { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const SectionHead = ({ children }) => (
    <>
      <h2 className="font-h2-section text-h2-section text-on-background uppercase tracking-widest mb-4">{children}</h2>
      <hr className="border-0 h-px w-full bg-primary-container mb-6" aria-hidden="true" />
    </>
  );

  const Bullet = ({ children }) => (
    <li className="flex items-start gap-3">
      <span className="text-outline shrink-0 mt-[0.3em] select-none" aria-hidden="true">—</span>
      <span className="text-pretty max-w-[75ch]">{children}</span>
    </li>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Newsreader:wght@600&family=Space+Grotesk:wght@400&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />

      <div className="light scroll-smooth bg-background text-on-background antialiased selection:bg-primary-container selection:text-white">
        <header className="bg-white/95 w-full sticky top-0 z-50 border-b border-primary-container/20 shadow-sm backdrop-blur-md">
          <div className="max-w-[720px] mx-auto flex flex-wrap gap-4 justify-between items-center py-4 sm:py-5 md:py-6 px-4 sm:px-6">
            <a className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 transition-colors" href="#">Jonas Lindqvist</a>
            <nav className="hidden sm:flex gap-4 md:gap-6 items-center" aria-label="Main Navigation">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className={l.active
                  ? "text-primary-container border-b-2 border-primary-container pb-1 uppercase text-[10px] tracking-widest font-medium opacity-90 hover:opacity-100 transition-all"
                  : "text-zinc-500 border-b-2 border-transparent hover:text-primary-container hover:border-primary-container/50 pb-1 uppercase text-[10px] tracking-widest font-medium transition-all"}>{l.label}</a>
              ))}
            </nav>
            <button type="button" className="bg-on-background text-on-secondary px-4 py-2 font-chip-label text-chip-label hover:opacity-90 active:scale-95 transition-all rounded-sm shadow-sm">
              Download PDF
            </button>
          </div>
        </header>

        <main className="max-w-[720px] w-full mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-24">
          <section className="mb-section_gap scroll-mt-24" id="contact">
            <h1 className="font-h1 text-h1 text-on-background mb-2 text-balance">Jonas Lindqvist</h1>
            <p className="font-body-main text-body-main text-on-surface-variant mb-6 text-balance">Senior Product Manager</p>
            <address className="flex flex-wrap items-center gap-x-4 gap-y-2 font-meta-mono text-meta-mono text-on-surface-variant not-italic">
              {contactBits.map((b, i) => (
                <span key={i} className="contents">
                  {b.kind === "text"
                    ? <span>{b.value}</span>
                    : <a className="hover:underline hover:text-on-background transition-colors" href={b.href} target={b.external ? "_blank" : undefined} rel={b.external ? "noopener noreferrer" : undefined}>{b.value}</a>}
                  {i < contactBits.length - 1 && <span className="text-outline/60 select-none hidden sm:inline" aria-hidden="true">|</span>}
                </span>
              ))}
            </address>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="summary">
            <SectionHead>Summary</SectionHead>
            <p className="font-body-main text-body-main text-on-background text-lg leading-relaxed max-w-[75ch] text-pretty">
              Strategic Senior Product Manager with over 8 years of experience scaling B2B SaaS platforms. Adept at bridging the gap between complex engineering capabilities and compelling user narratives to drive measurable business growth and user retention.
            </p>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="experience">
            <SectionHead>Experience</SectionHead>
            <div className="flex flex-col gap-8">
              {experience.map((role) => (
                <article key={role.company}>
                  <h3 className="font-h3-company text-h3-company text-primary-container mb-1 text-balance">{role.company}</h3>
                  <div className="font-meta-mono text-meta-mono text-on-surface-variant mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4">
                    <span className="font-medium text-on-background">{role.title}</span>
                    <span>{role.period}</span>
                  </div>
                  <ul className="font-body-main text-body-main text-on-background space-y-3">
                    {role.bullets.map((b, i) => <Bullet key={i}>{b}</Bullet>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="projects">
            <SectionHead>Selected Projects</SectionHead>
            <div className="flex flex-col gap-8">
              {projects.map((p) => (
                <article key={p.title}>
                  <h3 className="font-h3-company text-h3-company text-on-background mb-2 text-balance">{p.title}</h3>
                  <p className="font-body-main text-body-main text-on-background text-pretty max-w-[75ch]">{p.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="skills">
            <SectionHead>Skills</SectionHead>
            <div className="flex flex-wrap gap-3">
              {skills.map((s) => (
                <span key={s} className="border border-on-background px-3 py-1.5 font-chip-label text-chip-label text-on-background uppercase tracking-wider rounded-sm cursor-default hover:bg-on-background hover:text-background transition-colors">{s}</span>
              ))}
            </div>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="education">
            <SectionHead>Education</SectionHead>
            <div className="flex flex-col gap-8">
              {education.map((e) => (
                <article key={e.title}>
                  <h3 className="font-h3-company text-h3-company text-on-background mb-1 text-balance">{e.title}</h3>
                  <div className="font-meta-mono text-meta-mono text-on-surface-variant flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4 mt-1">
                    <span className="font-medium text-on-background">{e.school}</span>
                    <span>{e.period}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="awards">
            <SectionHead>Awards & Press</SectionHead>
            <ul className="font-body-main text-body-main text-on-background space-y-3">
              {awards.map((a, i) => <Bullet key={i}>{a}</Bullet>)}
            </ul>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="case-studies">
            <SectionHead>Selected Work</SectionHead>
            <p className="font-meta-mono text-meta-mono text-on-surface-variant mb-8 max-w-[60ch]">Three case studies — outcomes, scope and the role I played.</p>
            <div className="flex flex-col gap-12">
              {caseStudies.map((c) => (
                <article key={c.title} className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-start">
                  <div className={c.imageLeft ? "sm:col-span-5" : "sm:col-span-5 order-1 sm:order-2"}>
                    <div className="aspect-[4/3] overflow-hidden rounded-sm bg-surface-container-high border border-outline-variant/60">
                      <img src={c.image} alt={c.alt} width="1200" height="900" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <p className="font-meta-mono text-meta-mono text-on-surface-variant mt-2">{c.caseTag}</p>
                  </div>
                  <div className={c.imageLeft ? "sm:col-span-7" : "sm:col-span-7 order-2 sm:order-1"}>
                    <p className="font-meta-mono text-meta-mono text-primary-container uppercase tracking-widest mb-2">{c.employer}</p>
                    <h3 className="font-h3-company text-h3-company text-on-background mb-3 text-balance">{c.title}</h3>
                    <p className="font-body-main text-body-main text-on-background text-pretty max-w-[60ch] mb-4">{c.lede}</p>
                    <ul className="font-body-main text-body-main text-on-background space-y-2">
                      {c.bullets.map((b, i) => <Bullet key={i}>{b}</Bullet>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="principles">
            <SectionHead>How I Work</SectionHead>
            <div className="bg-surface-container-high rounded-sm p-6 sm:p-8 border border-outline-variant/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {principles.map((p) => (
                  <article key={p.num} className="flex flex-col">
                    <span className="font-meta-mono text-meta-mono text-primary-container tabular-nums mb-3">{p.num}</span>
                    <h3 className="font-h3-company text-h3-company text-on-background mb-2 text-balance">{p.title}</h3>
                    <p className="font-body-main text-body-main text-on-surface-variant text-pretty">{p.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="press">
            <SectionHead>Press &amp; Speaking</SectionHead>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {press.map((p) => (
                <article key={p.title} className="flex gap-4 items-start">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-sm bg-surface-container-high border border-outline-variant/60">
                    <img src={p.image} alt={p.alt} width="400" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-meta-mono text-meta-mono text-on-surface-variant uppercase tracking-widest mb-1">{p.venue}</p>
                    <h3 className="font-h3-company text-on-background mb-2 text-balance" style={{ fontSize: "1rem", fontFamily: "Newsreader, ui-serif, Georgia, serif", fontWeight: 600, lineHeight: 1.3 }}>{p.title}</h3>
                    <p className="font-body-main text-on-surface-variant italic text-pretty" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{p.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-section_gap scroll-mt-24" id="faq">
            <SectionHead>FAQ</SectionHead>
            <div className="bg-surface-container-low rounded-sm border border-outline-variant/40 divide-y divide-outline-variant/40">
              {faq.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none px-5 sm:px-6 py-4 sm:py-5 hover:bg-surface-container-high/50 transition-colors">
                    <span className="font-h3-company text-on-background pr-4" style={{ fontSize: "1.05rem", fontFamily: "Newsreader, ui-serif, Georgia, serif", fontWeight: 600, lineHeight: 1.3 }}>{item.q}</span>
                    <span className="text-primary-container shrink-0 transform transition-transform duration-200 group-open:rotate-90 font-meta-mono" aria-hidden="true">›</span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 font-body-main text-body-main text-on-surface-variant text-pretty max-w-[70ch]">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="scroll-mt-24" id="references">
            <SectionHead>References</SectionHead>
            <p className="font-body-main text-body-main text-on-surface-variant italic text-pretty">Available upon request.</p>
          </section>
        </main>

        <footer className="bg-white/95 w-full border-t border-primary-container/20 mt-12">
          <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row justify-between items-center py-6 sm:py-8 px-4 sm:px-6 gap-4">
            <p className="font-sans text-xs uppercase tracking-widest text-zinc-500 mb-2 sm:mb-0 text-center sm:text-left text-balance">© 2024 Jonas Lindqvist</p>
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6" aria-label="Footer Navigation">
              {footerLinks.map((l) => (
                <a key={l.label} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className="font-sans text-xs uppercase tracking-widest text-zinc-500 hover:text-primary-container hover:underline underline-offset-4 transition-colors duration-200 rounded-sm">{l.label}</a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
