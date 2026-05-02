export default function T80HorizontalScroll() {
  const navItems = [
    { href: "#intro", label: "Intro", short: "Intro", active: true },
    { href: "#project-1", label: "Project 1", short: "01" },
    { href: "#project-2", label: "Project 2", short: "02" },
    { href: "#services", label: "Services", short: "Services" },
    { href: "#manifesto", label: "Manifesto", short: "M" },
    { href: "#plates", label: "Plates", short: "P" },
    { href: "#atelier", label: "Atelier", short: "A" },
    { href: "#contact", label: "Contact", short: "Contact" },
  ];

  const tenets = [
    { i: "I", title: "Begin in plan.", body: "Section first. Renderings second. The plan tells you whether it deserves the photograph.", tag: "tenet_01" },
    { i: "II", title: "Negative space is structure.", body: "The walls you choose not to draw carry the building. Every project gets at least one carved-out room.", tag: "tenet_02" },
    { i: "III", title: "Choose a single material.", body: "Concrete or oak or limestone. Pick one, repeat it through the volume; the second material is the lighting.", tag: "tenet_03" },
    { i: "IV", title: "Photograph at four o'clock.", body: "North-light projects in the morning, south-light projects in the late afternoon. The hour decides the silhouette.", tag: "tenet_04" },
    { i: "V", title: "Hand-fold the spec book.", body: "Print the bind. Cut the paper. The client meets the studio in the binding before they meet the building.", tag: "tenet_05" },
  ];

  const plates = [
    { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", n: "I", title: "Concrete bay.", meta: "Berlin · 11/24", w: "w-72", grad: "from-inverse-surface via-inverse-surface/30 to-transparent", dir: "t", extra: "opacity-90" },
    { src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1000&q=85&auto=format&fit=crop", n: "II", title: "North light.", meta: "Lisbon · 12/24", w: "w-80", grad: "from-inverse-surface/60 via-transparent to-tertiary-fixed-dim/15", dir: "bl", extra: "" },
    { src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85&auto=format&fit=crop", n: "III", title: "Stair, mid-day.", meta: "Madrid · 02/25", w: "w-64", grad: "from-inverse-surface via-transparent to-transparent", dir: "t", extra: "" },
    { src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=1000&q=85&auto=format&fit=crop", n: "IV", title: "Vault & fold.", meta: "Paris · 03/25", w: "w-80", grad: "from-inverse-surface via-transparent to-tertiary-fixed-dim/10", dir: "tr", extra: "" },
    { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", n: "V", title: "Cornice study.", meta: "Rome · 04/25", w: "w-72", grad: "from-inverse-surface/80 via-transparent to-transparent", dir: "t", extra: "" },
    { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1000&q=85&auto=format&fit=crop", n: "VI", title: "Studio interior.", meta: "Geneva · 05/25", w: "w-80", grad: "from-inverse-surface via-transparent to-tertiary-fixed-dim/15", dir: "r", extra: "" },
  ];

  const services = [
    { name: "Identity" },
    { name: "Digital" },
    { name: "Editorial", italic: true },
    { name: "Spatial" },
  ];

  const socials = [
    { label: "Instagram", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "inverse-on-surface": "#f8f0de", "error": "#ba1a1a", "on-background": "#1e1c11",
            "on-secondary-container": "#686456", "on-primary-fixed": "#1c1b1b", "outline": "#747878",
            "primary": "#000000", "surface-container-highest": "#e9e2d0", "tertiary-fixed-dim": "#ffb693",
            "surface-bright": "#fff9ed", "on-tertiary-container": "#c86a39", "secondary-fixed-dim": "#ccc6b5",
            "surface-dim": "#e0dac8", "surface-container-low": "#faf3e1", "primary-fixed-dim": "#c8c6c5",
            "surface-tint": "#5f5e5e", "primary-fixed": "#e5e2e1", "error-container": "#ffdad6",
            "background": "#fff9ed", "surface-container-lowest": "#ffffff", "secondary-fixed": "#e9e2d0",
            "on-tertiary-fixed": "#351000", "on-surface": "#1e1c11", "secondary-container": "#e9e2d0",
            "on-error-container": "#93000a", "on-primary-container": "#858383",
            "on-secondary-fixed-variant": "#4a473a", "secondary": "#625e50", "on-secondary": "#ffffff",
            "inverse-primary": "#c8c6c5", "on-tertiary": "#ffffff", "surface-variant": "#e9e2d0",
            "on-primary": "#ffffff", "tertiary": "#000000", "on-error": "#ffffff",
            "tertiary-container": "#351000", "primary-container": "#1c1b1b", "surface-container": "#f5eddb",
            "inverse-surface": "#343024", "surface-container-high": "#efe8d6",
            "on-surface-variant": "#444748", "on-tertiary-fixed-variant": "#7a3000",
            "tertiary-fixed": "#ffdbcc", "outline-variant": "#c4c7c7",
            "on-primary-fixed-variant": "#474746", "surface": "#fff9ed",
            "on-secondary-fixed": "#1e1c11"
          },
          spacing: { unit: "8px", "section-gap": "160px", gutter: "32px", "margin-edge": "64px" },
          fontFamily: {
            sans: ["Inter", "sans-serif"], serif: ["Newsreader", "serif"],
            "headline-md": ["Newsreader", "serif"], "display-xl": ["Newsreader", "serif"],
            "display-lg": ["Newsreader", "serif"], "label-sm": ["Inter", "sans-serif"],
            "body-md": ["Inter", "sans-serif"], "body-lg": ["Inter", "sans-serif"]
          },
          fontSize: {
            "headline-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "120%", letterSpacing: "-0.01em", fontWeight: "400" }],
            "display-xl": ["clamp(3.5rem, 8vw, 7.5rem)", { lineHeight: "110%", letterSpacing: "-0.04em", fontWeight: "300" }],
            "display-lg": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "115%", letterSpacing: "-0.02em", fontWeight: "400" }],
            "label-sm": ["0.75rem", { lineHeight: "100%", letterSpacing: "0.1em", fontWeight: "600" }],
            "body-md": ["1rem", { lineHeight: "160%", letterSpacing: "0", fontWeight: "400" }],
            "body-lg": ["clamp(1rem, 1.5vw, 1.125rem)", { lineHeight: "160%", letterSpacing: "0", fontWeight: "400" }]
          }
        }
      }
    };
  `;

  const customCss = `
    .horizontal-scroll-container {
      display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden;
      scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
      width: 100dvw; height: 100dvh;
      scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth;
    }
    .horizontal-scroll-container::-webkit-scrollbar { display: none; }
    .scene {
      flex: 0 0 100dvw; width: 100dvw; height: 100dvh;
      scroll-snap-align: start; position: relative;
      overflow-y: auto; overflow-x: hidden;
    }
    .plate-track {
      display: flex; gap: 18px; width: max-content;
      animation: plate-x 70s linear infinite; padding: 6px 24px;
    }
    .plate-track:hover { animation-play-state: paused; }
    @keyframes plate-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 9px)); } }
    @media (prefers-reduced-motion: reduce) { .plate-track { animation: none; } }
  `;

  // preview iframe re-emits inline scripts after React mounts, so wrapping
  // in `document.addEventListener('DOMContentLoaded', ...)` would silently
  // never fire (DOMContentLoaded already happened). Use an IIFE that runs
  // immediately — DOM is already complete when this script runs.
  const initScript = `
    (function () {
      const scrollContainer = document.querySelector('.horizontal-scroll-container');
      const sections = document.querySelectorAll('.scene');
      const navItems = document.querySelectorAll('.nav-item');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(item => {
              if (item.getAttribute('href') === '#' + id) {
                item.classList.add('text-on-background', 'border-on-tertiary-container');
                item.classList.remove('text-on-surface-variant', 'border-transparent');
              } else {
                item.classList.remove('text-on-background', 'border-on-tertiary-container');
                item.classList.add('text-on-surface-variant', 'border-transparent');
              }
            });
          }
        });
      }, { root: scrollContainer, threshold: 0.5 });
      sections.forEach(sec => observer.observe(sec));
      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(item.getAttribute('href'));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
      });
      scrollContainer.addEventListener('wheel', (evt) => {
        if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) return;
        if (evt.deltaY !== 0) {
          evt.preventDefault();
          scrollContainer.scrollBy({ left: evt.deltaY, behavior: 'auto' });
        }
      }, { passive: false });
      document.querySelectorAll('.scroll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const dir = parseInt(btn.getAttribute('data-dir'));
          scrollContainer.scrollBy({ left: dir * window.innerWidth, behavior: 'smooth' });
        });
      });
    })();
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="light bg-background text-on-background overflow-hidden selection:bg-on-tertiary-container selection:text-surface antialiased">
        <header className="fixed top-0 left-0 w-full z-50 flex flex-col md:flex-row justify-between items-center px-4 md:px-margin-edge py-6 md:py-8 pointer-events-none gap-4 md:gap-0 transition-all duration-300">
          <div className="pointer-events-auto text-xl md:text-2xl font-serif font-medium tracking-tight text-on-background">
            Format Studio
          </div>
          <div className="pointer-events-auto flex items-center bg-background/90 backdrop-blur-md px-2 py-1.5 rounded-full border border-outline-variant/30 shadow-sm" role="group" aria-label="Horizontal scroll controls">
            <button aria-label="Scroll Left" className="scroll-btn p-1.5 flex items-center justify-center text-on-surface-variant hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-all hover:-translate-x-0.5" data-dir="-1">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_left_alt</span>
            </button>
            <span className="font-label-sm text-label-sm text-on-background uppercase tracking-[0.2em] px-3 select-none">Scroll</span>
            <button aria-label="Scroll Right" className="scroll-btn p-1.5 flex items-center justify-center text-on-surface-variant hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-all hover:translate-x-0.5" data-dir="1">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_right_alt</span>
            </button>
          </div>
        </header>

        <main className="horizontal-scroll-container" tabIndex={-1}>
          <section id="intro" className="scene flex flex-col justify-center items-center px-6 md:px-margin-edge">
            <h1 className="font-display-xl text-display-xl text-primary text-center italic mb-8 md:mb-gutter text-balance">
              Format Studio
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[65ch] text-center text-pretty">
              We craft structural narratives and spatial identities for the built environment.
              Our approach merges architectural minimalism with digital editorial precision.
            </p>
          </section>

          <section id="project-1" className="scene relative bg-surface-container-highest">
            <img
              alt="Modern minimalist concrete architecture with expansive glass windows and warm interior lighting at dusk"
              className="w-full h-full object-cover opacity-90 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU2D_aIS2okNkP2ONPOQjwUSBw0DH4euLQnDBZObmoc7DA8xJrYVAYovksVz6wFZFLhia5rlQAXr0KQJ7-w50SGhCQYima0KHsRbtyXigYX1p2H7v_ZrCWt22CDKFce_mBNoIl9yQOO0MCnEUfoqORnJ5LGcQlpCN1Ol5liIq8u_YRP0sdMOChhbLUlgQmhKgwlh8scK_MXvWWD4EdargTH-vdh4Edq6O1NDxrwHoYGsXcoHISFGIJt1K4h96WVqo8HHfN50hgn7Fl"
              width="1920" height="1080" loading="lazy" decoding="async"
            />
            <div className="absolute inset-0 flex items-end p-6 md:p-margin-edge pb-32 md:pb-section-gap">
              <div>
                <span className="inline-block px-3 py-1 border border-on-background text-on-background font-label-sm text-label-sm uppercase mb-4 bg-background/90 backdrop-blur-sm rounded">Spatial</span>
                <h2 className="font-display-lg text-display-lg text-background drop-shadow-md text-balance">Project Alpha</h2>
              </div>
            </div>
          </section>

          <section id="project-2" className="scene relative flex flex-col md:flex-row items-center justify-center p-6 md:p-margin-edge bg-surface-container">
            <div className="w-full max-w-5xl h-auto md:h-[716px] relative flex flex-col md:block">
              <img
                alt="Abstract interior detail showing light reflecting off curved white plaster walls creating soft shadows"
                className="w-full md:w-3/4 h-[50vh] md:h-full object-cover md:ml-auto rounded-lg md:rounded-none shadow-lg md:shadow-none"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6DjKoPvm1uBNQyPbW0C1CLP4bNs43TrTPH7mhmXfZG3B_IlvUJwyDVL4dqzIU0HTqle0csBUWZcsJgMDP_7F6-RFJWOTPv_2zMEwmdpRkJylaS9JPOFEa8EDX9_RlUkAZf-sbLYk_veAAAmn2BBZOT3m1nO34Jy6te9WJGdUm1KeWSDZF7m8wuAqC_xqzhb-ac_zuT1v7eSmhuoz162aakc58oWslOTzVixSmq4ImfenSCKZemIpu6WuXuiNFsNDM4DL3zWHJ5eem"
                width="1200" height="1600" loading="lazy" decoding="async"
              />
              <div className="relative md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 bg-background p-6 md:p-8 border border-primary/20 md:max-w-md shadow-xl -mt-12 md:mt-0 mx-4 md:mx-0 z-10 rounded">
                <span className="inline-block px-3 py-1 border border-primary font-label-sm text-label-sm uppercase mb-4 rounded">Editorial</span>
                <h2 className="font-headline-md text-headline-md text-primary mb-4 italic text-balance">Project Beta</h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-pretty">
                  A study in light and negative space, redefining the digital gallery experience.
                </p>
              </div>
            </div>
          </section>

          <section id="services" className="scene flex flex-col justify-center px-6 md:px-margin-edge bg-inverse-on-surface">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="font-label-sm text-label-sm uppercase tracking-[0.2em] mb-8 md:mb-gutter text-on-surface-variant">Capabilities</h2>
              <div className="flex flex-col gap-4">
                {services.map((s) => (
                  <h3
                    key={s.name}
                    tabIndex={0}
                    className={`font-display-lg text-display-lg text-primary hover:text-on-tertiary-container focus-visible:text-on-tertiary-container focus-visible:outline-none focus-visible:pl-4 transition-all duration-300 cursor-default border-b border-primary/20 pb-2${s.italic ? " italic" : ""}`}
                  >
                    {s.name}
                  </h3>
                ))}
              </div>
            </div>
          </section>

          {/* Manifesto */}
          <section id="manifesto" className="scene flex flex-col justify-center px-6 md:px-margin-edge bg-surface-container">
            <div className="max-w-5xl mx-auto w-full">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-tertiary-container block mb-6">— Manifesto · 04</span>
              <h2 className="font-headline-md text-headline-md text-primary mb-12 italic max-w-2xl text-balance">Five working notes pinned above the table.</h2>
              <ol className="divide-y divide-primary/15 border-y border-primary/15">
                {tenets.map((t) => (
                  <li key={t.tag} className="grid grid-cols-12 gap-4 py-6 hover:bg-background/40 transition-colors">
                    <span className="col-span-2 lg:col-span-1 font-serif text-3xl text-on-tertiary-container italic tabular-nums leading-none">{t.i}</span>
                    <div className="col-span-10 lg:col-span-9">
                      <h3 className="font-serif text-xl md:text-2xl italic text-primary">{t.title}</h3>
                      <p className="text-on-surface-variant text-sm mt-1">{t.body}</p>
                    </div>
                    <span className="col-span-12 lg:col-span-2 text-[10px] uppercase tracking-widest text-on-surface-variant self-center lg:text-right">[ {t.tag} ]</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Plates marquee */}
          <section id="plates" className="scene relative bg-inverse-surface text-inverse-on-surface flex flex-col justify-center overflow-hidden">
            <div className="absolute top-1/4 -translate-y-1/2 px-6 md:px-margin-edge max-w-3xl">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-tertiary-fixed-dim block mb-4">— Plates · 05</span>
              <h2 className="font-display-lg text-display-lg text-inverse-on-surface italic mb-4 text-balance">The studio table.</h2>
              <p className="text-inverse-on-surface/70 max-w-md text-sm md:text-base">Six structural studies pinned to the wall this month. Hover to halt the procession.</p>
            </div>
            <div className="mt-auto pb-16 md:pb-24 overflow-hidden relative">
              <div className="plate-track">
                {[...plates, ...plates].map((p, i) => {
                  const dirCls = { t: "bg-gradient-to-t", bl: "bg-gradient-to-bl", tr: "bg-gradient-to-tr", r: "bg-gradient-to-r" }[p.dir];
                  return (
                    <figure key={`pl-${i}`} aria-hidden={i >= plates.length ? "true" : undefined} className={`shrink-0 ${p.w} h-96 relative bg-surface-container-highest border border-tertiary-fixed-dim/40 overflow-hidden`}>
                      <img alt={i < plates.length ? `Plate ${p.n}` : ""} className={`absolute inset-0 w-full h-full object-cover grayscale ${p.extra}`} src={p.src} />
                      <div className={`absolute inset-0 ${dirCls} ${p.grad}`}></div>
                      <figcaption className="absolute bottom-5 left-5 right-5">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-tertiary-fixed-dim block">Plate · {p.n}</span>
                        <span className="font-serif italic text-2xl block mt-1">{p.title}</span>
                        <span className="text-xs text-inverse-on-surface/70 block mt-1">{p.meta}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Atelier image+content row */}
          <section id="atelier" className="scene flex items-center bg-surface-bright">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-margin-edge grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
              <figure className="md:col-span-7 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t border-l border-on-tertiary-container"></div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b border-r border-on-tertiary-container"></div>
                <img alt="Atelier interior" className="w-full aspect-[16/10] object-cover grayscale" src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85&auto=format&fit=crop" />
                <span className="absolute top-5 left-5 inline-block px-3 py-1 border border-on-background bg-background/90 backdrop-blur-sm font-label-sm text-label-sm uppercase tracking-widest text-on-background">Studio · 06</span>
              </figure>
              <div className="md:col-span-5">
                <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-tertiary-container block mb-3">— Atelier · 06</span>
                <h2 className="font-headline-md text-headline-md text-primary italic mb-6 text-balance">A working room, fourteen years.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8 text-pretty">Format Studio occupies the second floor of a 1928 print works in central Geneva. The drafting table is older than the studio. The plotter is a plotter, not an inkjet. Visitors are admitted by appointment.</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-primary/15 pt-5 text-sm">
                  <div><dt className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">Founded</dt><dd className="font-serif italic text-primary mt-1">2010 · Geneva</dd></div>
                  <div><dt className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">Practice</dt><dd className="font-serif italic text-primary mt-1">Spatial · Editorial · Digital</dd></div>
                  <div><dt className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">Press</dt><dd className="font-serif italic text-primary mt-1">PIN-UP · Apartamento · Wallpaper*</dd></div>
                  <div><dt className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">Studio</dt><dd className="font-serif italic text-on-tertiary-container mt-1">Open · Mon–Thu · by appointment</dd></div>
                </dl>
              </div>
            </div>
          </section>

          <section id="contact" className="scene flex flex-col justify-center items-center px-6 md:px-margin-edge bg-surface relative">
            <div className="text-center w-full max-w-3xl">
              <h2 className="font-display-xl text-display-xl text-primary mb-8 md:mb-gutter leading-none text-balance">Let's Build</h2>
              <div className="flex flex-col items-center gap-8 mt-16 md:mt-section-gap">
                <a className="font-headline-md text-headline-md text-on-surface-variant hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors border-b border-transparent hover:border-primary pb-1" href="mailto:hello@formatstudio.com">
                  hello@formatstudio.com
                </a>
                <div className="flex gap-6 md:gap-8 font-label-sm text-label-sm uppercase tracking-[0.1em] flex-wrap justify-center">
                  {socials.map((s) => (
                    <a key={s.label} className="text-on-surface-variant hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1 transition-colors" href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <nav aria-label="Section navigation" className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 md:px-16 pb-6 md:pb-12 bg-background/90 backdrop-blur-md border-t border-outline-variant/30 font-label-sm text-label-sm uppercase transition-colors duration-300">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`nav-item flex flex-col items-center gap-2 group ${n.active ? "text-on-background border-on-tertiary-container" : "text-on-surface-variant border-transparent hover:text-on-background"} border-t-2 -mt-[1px] pt-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm`}
            >
              {n.short !== n.label ? (
                <>
                  <span className="hidden sm:inline">{n.label}</span>
                  <span className="sm:hidden">{n.short}</span>
                </>
              ) : (
                <span>{n.label}</span>
              )}
            </a>
          ))}
        </nav>

        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </div>
    </>
  );
}
