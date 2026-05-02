export default function T26AboutMeCard() {
  const navLinks = [
    { label: "Work", href: "#" },
    { label: "About", href: "#", active: true },
    { label: "Archive", href: "#" },
    { label: "Contact", href: "#" }
  ];

  const externalLinks = [
    { label: "Twitter", href: "https://twitter.com", icon: "arrow_outward", external: true },
    { label: "Read.cv", href: "https://read.cv", icon: "description", external: true },
    { label: "Email", href: "mailto:hello@example.com", icon: "mail" },
    { label: "Currently at Acme Corp", href: "#", icon: "work" }
  ];

  const footerLinks = ["Email", "LinkedIn", "Read.cv"];

  const selectedWork = [
    { year: "2024", title: "Lumen — A daylight-aware reading app", role: "Lead Product Designer · Foldspace" },
    { year: "2023", title: "Mercer Studio booking platform", role: "Senior Product Designer" },
    { year: "2022", title: "Atlas — field-research data tool", role: "Product & Brand" },
    { year: "2021", title: "Common Pulse — community health tracker", role: "UX & Visual Design" },
    { year: "2019", title: "Foldspace identity & marketing site", role: "Founding Designer" },
  ];

  const speakingWriting = [
    { year: "2024", title: "Designing for Decay", venue: "Layers Conf · Berlin" },
    { year: "2023", title: "Quiet Software", venue: "A List Apart · Essay 514" },
    { year: "2022", title: "Tactile by Default", venue: "Smashing Conf · Freiburg" },
    { year: "2021", title: "On Patience", venue: "Offscreen Magazine · Issue 25" },
    { year: "2019", title: "Notes from the Editing Room", venue: "Self-published essay series" },
  ];

  const recognition = [
    { quote: "A masterclass in restraint — Sami's interface feels less like a screen and more like a well-loved object.", source: "It's Nice That", year: "2024" },
    { quote: "Among the few designers who treat motion the way printmakers treat ink.", source: "Sidebar.io · Editor's Pick", year: "2023" },
    { quote: "The kind of digital craft that ages well.", source: "Awwwards · Site of the Month", year: "2022" },
  ];

  const awards = [
    { year: "2024", title: "Brand Identity of the Year, shortlist", source: "Brand New · UnderConsideration" },
    { year: "2023", title: "Webby Honoree · Visual Design", source: "The Webby Awards" },
    { year: "2022", title: "FWA of the Day · Foldspace.studio", source: "FWA · Favourite Website Awards" },
    { year: "2021", title: "Communication Arts Webpick", source: "Communication Arts" },
    { year: "2020", title: "CSS Design Awards · Special Kudos", source: "CSSDA" },
  ];

  const reading = [
    { title: "Devotions", author: "Mary Oliver" },
    { title: "The Anthropology of Turquoise", author: "Ellen Meloy" },
    { title: "A Pattern Language", author: "Christopher Alexander" },
  ];

  const listening = [
    { title: "Tiny Desk · Arooj Aftab", artist: "NPR Music" },
    { title: "On Being · Pádraig Ó Tuama", artist: "Krista Tippett" },
    { title: "The Slowdown", artist: "Major Jackson" },
  ];

  const verticalGallery = [
    { cut: "cut-v1", src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80&auto=format&fit=crop", alt: "Brass apothecary objects on a warm dark surface — studio craft tools" },
    { cut: "cut-v2", src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80&auto=format&fit=crop", alt: "Minimal interior bathed in natural light, soft shadow study" },
    { cut: "cut-v3", src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=600&q=80&auto=format&fit=crop", alt: "Quiet architectural composition with a soft palette" },
    { cut: "cut-v4", src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600&q=80&auto=format&fit=crop", alt: "Editorial architecture frame in soft daylight" },
    { cut: "cut-v5", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80&auto=format&fit=crop", alt: "Studio detail — concrete and texture in mid-tone" },
    { cut: "cut-v6", src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=600&q=80&auto=format&fit=crop", alt: "Architectural fragment, hand-tactile reference" },
  ];

  const horizontalGallery = [
    { cut: "cut-h1", src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=480&q=80&auto=format&fit=crop", alt: "Soft architectural plane in low light" },
    { cut: "cut-h2", src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=480&q=80&auto=format&fit=crop", alt: "Minimal interior corner with warm wash" },
    { cut: "cut-h3", src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=480&q=80&auto=format&fit=crop&crop=entropy", alt: "Brass studio objects, side detail" },
    { cut: "cut-h4", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=480&q=80&auto=format&fit=crop&crop=edges", alt: "Concrete shelf and texture study" },
    { cut: "cut-h5", src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=800&h=480&q=80&auto=format&fit=crop&crop=top", alt: "Soft daylight on architectural fragment" },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fff8f3", "on-background": "#201b14",
            "surface": "#fff8f3", "surface-bright": "#fff8f3", "surface-dim": "#e3d8cd", "surface-variant": "#ece1d5",
            "surface-container-lowest": "#ffffff", "surface-container-low": "#fdf2e6", "surface-container": "#f7ece1", "surface-container-high": "#f1e6db", "surface-container-highest": "#ece1d5",
            "on-surface": "#201b14", "on-surface-variant": "#4f453f",
            "primary": "#26170c", "on-primary": "#ffffff", "primary-container": "#3d2b1f", "on-primary-container": "#ac9181", "primary-fixed": "#fbddca", "primary-fixed-dim": "#dec1af", "on-primary-fixed": "#28180d", "on-primary-fixed-variant": "#574335",
            "secondary": "#a7363d", "on-secondary": "#ffffff", "secondary-container": "#fd767a", "on-secondary-container": "#710b1a", "secondary-fixed": "#ffdad9", "secondary-fixed-dim": "#ffb3b2",
            "tertiary": "#0c1d1f", "on-tertiary": "#ffffff", "tertiary-container": "#213234", "on-tertiary-container": "#889a9c", "tertiary-fixed": "#d3e6e8", "tertiary-fixed-dim": "#b7cacc",
            "outline": "#81756e", "outline-variant": "#d2c4bc"
          },
          spacing: {
            "section-gap": "clamp(2.5rem, 6vw, 4rem)",
            "unit": "0.5rem",
            "gutter": "clamp(1rem, 4vw, 1.5rem)",
            "container-max": "600px",
            "element-gap": "1rem"
          },
          fontFamily: {
            "headline-lg": ["Newsreader", "serif"], "headline-md": ["Newsreader", "serif"], "headline-sm": ["Newsreader", "serif"],
            "body-lg": ["Newsreader", "serif"], "body-md": ["Newsreader", "serif"], "label-sm": ["Newsreader", "serif"]
          },
          fontSize: {
            "headline-lg": ["clamp(2.25rem, 5vw + 1rem, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "headline-md": ["clamp(1.5rem, 3vw + 0.5rem, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }],
            "headline-sm": ["clamp(1.25rem, 2.5vw + 0.5rem, 1.5rem)", { lineHeight: "1.3", fontWeight: "500" }],
            "body-lg": ["clamp(1rem, 2vw + 0.5rem, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "body-md": ["clamp(0.875rem, 1.5vw + 0.5rem, 1rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "label-sm": ["0.875rem", { lineHeight: "1.4", fontWeight: "500" }]
          }
        }
      }
    }
  `;

  const css = `
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    body {
      background-image: radial-gradient(#d2c4bc 0.5px, transparent 0.5px), radial-gradient(#d2c4bc 0.5px, #fff8f3 0.5px);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
      background-blend-mode: overlay;
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="light scroll-smooth min-h-screen flex flex-col text-on-surface antialiased overflow-x-hidden">
        <header className="bg-[#FDFCFB]/95 backdrop-blur-sm font-serif text-lg tracking-tight sticky top-0 border-b border-stone-200 text-[#3D2B1F] w-full z-50 transition-colors duration-300">
          <div className="flex justify-between items-center py-5 px-6 md:px-8 max-w-4xl mx-auto">
            <a className="text-2xl font-serif font-semibold text-red-900 hover:text-red-800 transition-colors duration-300" href="#">Sami Ortega</a>
            <nav className="hidden md:flex gap-8 items-center" aria-label="Primary Navigation">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className={l.active
                  ? "text-red-900 border-b-2 border-red-900/40 pb-0.5 hover:text-red-800 px-1 transition-colors duration-300"
                  : "text-stone-600 hover:text-red-900 px-1 transition-colors duration-300"}>{l.label}</a>
              ))}
            </nav>
            <button aria-label="Toggle navigation menu" className="md:hidden text-[#3D2B1F] hover:text-red-900 p-1 -mr-1 transition-colors duration-300 flex items-center">
              <span className="material-symbols-outlined" aria-hidden="true">menu</span>
            </button>
          </div>
        </header>

        <main className="flex-grow w-full pb-0 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_clamp(280px,28vw,360px)]">
            <div className="pt-section-gap lg:flex lg:flex-col">
            <div className="w-full max-w-[600px] mx-auto lg:mx-0 lg:max-w-none lg:self-start pl-8 lg:pl-16 pr-4 lg:pr-8">
              <article className="flex flex-col w-full">

            <div className="w-full mb-section-gap lg:flex lg:flex-row lg:gap-8 lg:items-stretch">

              <div className="lg:w-[65ch] lg:flex-none flex flex-col gap-section-gap">

                <div className="w-full mx-auto lg:mx-0 flex flex-col items-center justify-center">
                  <div className="relative mb-gutter group">
                    <img alt="Portrait of Sami Ortega" width="128" height="128" className="w-32 h-32 rounded-full object-cover border border-outline-variant p-1 shadow-sm bg-surface-container-low transition-transform duration-500 group-hover:scale-[1.02]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADj3z5_vxbOaMv95KVhNWtxeOm4wFJa9YBgUmo9o5pQ596t1IguFck2CDCW6Wp-sXh8pgw7Hz0AK4rT8NQ6fT9UxKy4nky9q_CBnRuF4pDNjSSUGx2Qf232POQ4cSnjF05tT8zE2a1xOpSUqv-xHkEso7RmWKTuXuJ4jBnsrtD1aiy8kUz35I64iw_HgESu0U8aGiSM4-AWrDPPAtPL2mXFVBRnVahA3XBjo8EDugf5b4BdSDnhUsj3wMmjyI2qcqKJIha9qGZYVM" />
                  </div>

                  <div className="text-center w-full relative">
                    <h1 className="font-headline-lg text-headline-lg text-primary mb-unit relative inline-block text-balance">
                      Sami Ortega
                      <span className="absolute -bottom-2 left-0 w-full h-2 text-secondary opacity-40 pointer-events-none" aria-hidden="true">
                        <svg fill="none" height="100%" preserveAspectRatio="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 10" width="100%">
                          <path d="M 0 5 Q 50 8 100 2"></path>
                        </svg>
                      </span>
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant italic mt-1 text-balance">Product Designer | Based in Brooklyn</p>
                  </div>
                </div>

                <div className="w-full text-left relative">
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed border-l-2 border-outline-variant pl-5 md:pl-6 py-2 text-pretty max-w-[65ch]">
                    I'm a product designer obsessed with the intersection of digital craft and physical textures. Currently, I'm exploring how we can make software feel more tactile and human. Over the past six years, I've collaborated with early-stage startups and established brands to build cohesive, user-centered experiences from zero to one. When I'm not at my desk pushing pixels or refining design systems, you'll find me at the local pottery studio, reading speculative fiction, or hunting for the perfect espresso roast.
                  </p>
                </div>

              </div>

              <div className="hidden lg:flex lg:flex-1 lg:min-w-0 lg:items-center lg:justify-center lg:px-6">
                <div className="lg:relative lg:aspect-square lg:h-full lg:max-w-full">
                  <img
                    className="lg:absolute lg:inset-0 w-full h-full object-cover rounded-2xl shadow-sm border border-outline-variant bg-surface-container-low"
                    src="https://res.cloudinary.com/dsa31toc5/image/upload/v1777539573/Generated_image_1_f3wfap.png"
                    alt="Studio portrait — Sami Ortega in workspace"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

            </div>

            <div className="w-full max-w-[65ch] mb-section-gap flex flex-col gap-section-gap lg:flex-row lg:gap-8 lg:items-stretch">
              <div className="text-left w-full lg:flex-1">
                <ul className="flex flex-col gap-element-gap items-start lg:h-full lg:justify-between lg:gap-0">
                  {externalLinks.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 font-body-md text-body-md text-secondary hover:text-on-secondary-container rounded-sm transition-colors group">
                        <span className="underline underline-offset-4 decoration-secondary/30 group-hover:decoration-secondary transition-all">{l.label}</span>
                        <span className="material-symbols-outlined text-[1.125em] translate-y-[1px] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">{l.icon}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left bg-surface-container-low p-6 md:p-gutter rounded-xl shadow-sm border border-outline-variant/30 relative w-full lg:w-[280px] lg:flex-none flex flex-col justify-center">
                <h2 className="font-headline-sm text-headline-sm text-primary mb-2 text-balance">Currently</h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-pretty">
                  building a tea brand, reading Mary Oliver's essays, walking a lot around Prospect Park, experimenting with film photography, and slowly redesigning this website.
                </p>
              </div>
            </div>

            <div className="w-full mb-section-gap flex flex-col gap-section-gap lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-section-gap">

              <div className="text-left">
                <div className="flex items-baseline justify-between gap-3 mb-gutter border-b border-outline-variant pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-primary">Selected Work</h2>
                  <span className="font-body-md text-xs uppercase tracking-[0.2em] text-on-surface-variant">2019 — Now</span>
                </div>
                <ul className="flex flex-col">
                  {selectedWork.map((p, i) => (
                    <li key={p.title} className={`py-3 flex items-baseline gap-5 group ${i < selectedWork.length - 1 ? "border-b border-outline-variant/40" : ""}`}>
                      <span className="font-body-md text-body-md text-on-surface-variant tabular-nums shrink-0 w-12">{p.year}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-body-md text-body-md text-primary group-hover:text-secondary transition-colors text-balance">{p.title}</div>
                        <div className="font-body-md text-body-md text-on-surface-variant italic text-sm mt-0.5">{p.role}</div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">arrow_outward</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left">
                <div className="flex items-baseline justify-between gap-3 mb-gutter border-b border-outline-variant pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-primary">Speaking &amp; Writing</h2>
                  <span className="font-body-md text-xs uppercase tracking-[0.2em] text-on-surface-variant">Talks &amp; Essays</span>
                </div>
                <ul className="flex flex-col">
                  {speakingWriting.map((p, i) => (
                    <li key={p.title} className={`py-3 flex items-baseline gap-5 group ${i < speakingWriting.length - 1 ? "border-b border-outline-variant/40" : ""}`}>
                      <span className="font-body-md text-body-md text-on-surface-variant tabular-nums shrink-0 w-12">{p.year}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-body-md text-body-md text-primary group-hover:text-secondary transition-colors text-balance">{p.title}</div>
                        <div className="font-body-md text-body-md text-on-surface-variant italic text-sm mt-0.5">{p.venue}</div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">arrow_outward</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left">
                <div className="flex items-baseline justify-between gap-3 mb-gutter border-b border-outline-variant pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-primary">Kind Words</h2>
                  <span className="font-body-md text-xs uppercase tracking-[0.2em] text-on-surface-variant">Press</span>
                </div>
                <div className="flex flex-col gap-element-gap">
                  {recognition.map((r) => (
                    <blockquote key={r.source} className="border-l-2 border-secondary/40 pl-5 md:pl-6 py-2 relative">
                      <span aria-hidden="true" className="absolute -left-1 -top-2 font-headline-lg text-3xl leading-none text-secondary/30 select-none">&ldquo;</span>
                      <p className="font-body-md text-body-md text-on-surface text-pretty leading-relaxed">{r.quote}</p>
                      <cite className="font-body-md text-on-surface-variant text-sm not-italic mt-2 inline-block">— {r.source}, {r.year}</cite>
                    </blockquote>
                  ))}
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-baseline justify-between gap-3 mb-gutter border-b border-outline-variant pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-primary">Recognized</h2>
                  <span className="font-body-md text-xs uppercase tracking-[0.2em] text-on-surface-variant">Awards</span>
                </div>
                <ul className="flex flex-col">
                  {awards.map((a, i) => (
                    <li key={a.title} className={`py-3 flex items-baseline gap-5 ${i < awards.length - 1 ? "border-b border-outline-variant/40" : ""}`}>
                      <span className="font-body-md text-body-md text-on-surface-variant tabular-nums shrink-0 w-12">{a.year}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-body-md text-body-md text-primary text-balance">{a.title}</div>
                        <div className="font-body-md text-body-md text-on-surface-variant italic text-sm mt-0.5">{a.source}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left">
                <div className="flex items-baseline justify-between gap-3 mb-gutter border-b border-outline-variant pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-primary">Reading</h2>
                  <span className="font-body-md text-xs uppercase tracking-[0.2em] text-on-surface-variant">This Spring</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {reading.map((b) => (
                    <li key={b.title} className="font-body-md text-body-md text-on-surface text-pretty">
                      <em className="not-italic text-primary">{b.title}</em><span className="text-on-surface-variant"> — {b.author}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left">
                <div className="flex items-baseline justify-between gap-3 mb-gutter border-b border-outline-variant pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-primary">Listening</h2>
                  <span className="font-body-md text-xs uppercase tracking-[0.2em] text-on-surface-variant">This Spring</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {listening.map((s) => (
                    <li key={s.title} className="font-body-md text-body-md text-on-surface text-pretty">
                      <em className="not-italic text-primary">{s.title}</em><span className="text-on-surface-variant"> — {s.artist}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

              </article>
            </div>

            <section className="hidden lg:grid lg:grid-cols-5 lg:mt-auto" aria-label="Editorial gallery strip">
              {horizontalGallery.map((g) => (
                <img key={g.src} className="w-full aspect-[5/3] object-cover bg-surface-container-low" loading="lazy" decoding="async" alt={g.alt} src={g.src} />
              ))}
            </section>
            </div>

            <aside className="hidden lg:flex lg:flex-col" aria-label="Studio gallery">
              {verticalGallery.map((g) => (
                <img key={g.src} className="w-full flex-1 object-cover bg-surface-container-low" loading="lazy" decoding="async" alt={g.alt} src={g.src} />
              ))}
            </aside>
          </div>
        </main>

        <footer className="bg-transparent font-serif text-sm italic w-full py-10 mt-auto border-t border-stone-200 text-[#3D2B1F]">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 max-w-4xl mx-auto gap-6">
            <span className="text-stone-600 text-center md:text-left">© 2024 Sami Ortega — Built with Digital Tactility</span>
            <nav className="flex gap-6 items-center flex-wrap justify-center" aria-label="Footer Navigation">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="text-stone-600 hover:text-red-900 rounded-sm underline underline-offset-4 decoration-stone-300 hover:decoration-red-900 transition-all duration-300">{l}</a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
