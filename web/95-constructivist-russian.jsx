export default function T95ConstructivistRussian() {
  const navLinks = ["PRODUCTIONS", "MANIFESTO", "ENSEMBLE", "SEASON PASS"];
  const footerLinks = ["ARCHIVE", "CONTACT", "COLLECTIVE", "TERMS"];

  const programme = [
    { num: "I",   actChip: "bg-on-surface text-surface-bright",    cardCls: "bg-surface-container-lowest text-on-surface",    numColor: "text-primary-container", titleCls: "text-on-surface mix-blend-difference", bodyCls: "text-on-surface-variant", borderCls: "border-on-surface",   title: "THE FACTORY OF SLEEP",        body: "An assembly-line oratorio for nine workers, three machines, and one alarm clock that refuses to ring.", dates: "11.07.26 — 12.18.26", status: "PREMIERE", statusCls: "bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface" },
    { num: "II",  actChip: "bg-on-surface text-primary-container",  cardCls: "bg-primary-container text-on-primary",           numColor: "text-on-primary",         titleCls: "",                                     bodyCls: "opacity-90",              borderCls: "border-on-primary",   title: "RED SQUARE / NIGHT MARCH",    body: "A choral procession for 24 voices, lit only by the headlights of a 1958 ZIL truck idling stage-left.",   dates: "01.09.27 — 02.20.27", status: "SOLD OUT", statusCls: "bg-on-primary text-primary-container border-2 border-on-primary" },
    { num: "III", actChip: "bg-on-surface text-tertiary-fixed",     cardCls: "bg-tertiary-fixed text-on-surface",              numColor: "text-on-surface",         titleCls: "text-on-surface",                      bodyCls: "text-on-surface-variant", borderCls: "border-on-surface",   title: "THE COLLECTIVE / ACT 7",      body: "Devised work in seven movements. Rehearsed across four warehouses. Designed to be partly inaudible.",     dates: "03.04.27 — 04.18.27", status: "4 LEFT",   statusCls: "bg-primary-container text-on-primary border-2 border-on-surface" },
    { num: "IV",  actChip: "bg-tertiary-fixed text-on-surface",     cardCls: "bg-on-surface text-surface-bright",              numColor: "text-primary-container",  titleCls: "",                                     bodyCls: "opacity-90",              borderCls: "border-surface-bright", title: "SHRAPNEL / A CONFESSION",     body: "One actor. One spotlight. 78 minutes of monologue translated from a 1923 anarchist pamphlet, never staged before.", dates: "05.10.27 — 05.31.27", status: "WAITLIST", statusCls: "bg-surface-bright text-on-surface border-2 border-surface-bright" },
  ];

  const manifesto = [
    { num: "I",   title: "REFUSE THE LOBBY.",         body: "No champagne, no plaque, no donor wall. The room you walk into is the work.",                          color: "text-tertiary-fixed-dim", wide: false },
    { num: "II",  title: "BUILD WITH STEEL.",          body: "Sets are welded, not painted. Costumes outlive the run. Posters survive the building.",                color: "text-tertiary-fixed-dim", wide: false },
    { num: "III", title: "PAY THE ENSEMBLE.",          body: "Equity scale, every act. Profit-share if there's profit. The collective is the asset.",                color: "text-tertiary-fixed-dim", wide: false },
    { num: "IV",  title: "PROVOKE / DON'T COMFORT.",  body: "If everyone leaves agreeing, we have failed. The seat exists to be uncomfortable.",                    color: "text-tertiary-fixed-dim", wide: false },
    { num: "V",   title: "THE STAGE IS A WEAPON. THE AUDIENCE IS THE TARGET.", body: "Every show is loaded before the doors open. We will not apologise for the recoil.", color: "text-primary-container", wide: true },
  ];

  const ensemble = [
    { id: "PORT_01", chip: "bg-primary-container text-on-primary",                                                      rot: "-rotate-1", name: "M. Volkov",      role: "Lead · Act II",   alt: "Black-and-white actor portrait, intense gaze",          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC59Q-I6Ili_dZfJd8oOhIZmUq06wRmTEVAvEWU8iH0XRA3NBn6aAmYkDj7E2ayRZu54R4GN_XhRcd_xC_TNo-fVDxFfh6ZjvVoY7AiBfly-6WeGVHV2wgux2a5RPNWDzXi68m-LwwjjcFmtkaoPsbFnETPR6i1lZzSFZ62TDJIkPREzmY3jAylRpI3tbN8lw5L3DBWljb4AkS0Am2QvsAbYzpADAUS3m35f1qQt2KWVN1KXv-qsKUvZMjJb0cIhWjkgSB5BPoIzIs" },
    { id: "PORT_02", chip: "bg-tertiary-fixed text-on-surface border-r-2 border-b-2 border-on-surface",                  rot: "rotate-1",  name: "A. Petrova",     role: "Lead · Act I",    alt: "Stark editorial portrait, theatrical lighting",          src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop" },
    { id: "PORT_03", chip: "bg-primary-container text-on-primary",                                                      rot: "-rotate-2", name: "D. Sokolov",     role: "Lead · Act III",  alt: "High-contrast b&w portrait of a stage performer",        src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=900&auto=format&fit=crop" },
    { id: "PORT_04", chip: "bg-tertiary-fixed text-on-surface border-r-2 border-b-2 border-on-surface",                  rot: "rotate-1",  name: "I. Romanenko",   role: "Solo · Act IV",   alt: "Stark portrait, editorial chiaroscuro",                  src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?q=80&w=900&auto=format&fit=crop" },
    { id: "PORT_05", chip: "bg-primary-container text-on-primary",                                                      rot: "-rotate-1", name: "L. Mironova",    role: "Director · Mvt 7", alt: "High-contrast monochrome editorial portrait",            src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=900&auto=format&fit=crop" },
  ];

  const trustedLogos = [
    { alt: "Stripe",        src: "https://cdn.simpleicons.org/stripe/000000" },
    { alt: "Mailchimp",     src: "https://cdn.simpleicons.org/mailchimp/d2232a" },
    { alt: "Intercom",      src: "https://cdn.simpleicons.org/intercom/000000" },
    { alt: "Notion",        src: "https://cdn.simpleicons.org/notion/000000" },
    { alt: "The Guardian",  src: "https://cdn.simpleicons.org/theguardian/d2232a" },
    { alt: "Vimeo",         src: "https://cdn.simpleicons.org/vimeo/000000" },
    { alt: "Substack",      src: "https://cdn.simpleicons.org/substack/d2232a" },
    { alt: "Medium",        src: "https://cdn.simpleicons.org/medium/000000" },
  ];

  const doctrines = [
    { num: "I",   icon: "precision_manufacturing", iconColor: "text-on-surface",     title: "PRAGMATISM / NO POETRY ABOUT BUDGET.",      body: "A scene that demands a thousand candles gets thirty. A scene that demands one truck gets the truck. Means dictate metaphor; metaphor never dictates means. We name our fixed costs out loud, on stage, in the prologue, before any actor speaks.", cardCls: "bg-surface-container-lowest text-on-surface", numColor: "text-primary-container", borderCls: "border-on-surface",     dividerCls: "border-on-surface",     bodyCls: "text-on-surface-variant", chipCls: "bg-on-surface text-tertiary-fixed border-2 border-on-surface", arrowColor: "text-primary-container", chipLabel: "DOCTRINE_I",   shadowCls: "hover:shadow-[8px_8px_0_0_#d2232a]", featured: false },
    { num: "II",  icon: "shield",                   iconColor: "text-on-primary",     title: "DISCIPLINE / THE CALL IS 17:00.",            body: "Late is absent. Absent is replaced. Replaced is recorded. The collective survives because the schedule survives — there is no actor whose name protects them from the iron rule of the call sheet. We have built nothing that we are not prepared to lose.",                cardCls: "bg-primary-container text-on-primary",        numColor: "text-on-primary",        borderCls: "border-on-surface",     dividerCls: "border-on-primary",     bodyCls: "opacity-90",              chipCls: "bg-on-primary text-primary-container border-2 border-on-primary", arrowColor: "text-on-primary",         chipLabel: "DOCTRINE_II",  shadowCls: "hover:shadow-[8px_8px_0_0_#1e1b13]", featured: true },
    { num: "III", icon: "psychology",               iconColor: "text-on-surface",     title: "REFUSAL / WE TURN DOWN MORE THAN WE TAKE.",  body: "Three commissions a season, on average, are declined. Banks, party machines, weapons firms, novelty branding tie-ups. The work that survives is the work we wanted to make; the work we refused is the proof that the survivors are not for sale.",                                  cardCls: "bg-tertiary-fixed text-on-surface",          numColor: "text-primary-container", borderCls: "border-on-surface",     dividerCls: "border-on-surface",     bodyCls: "text-on-surface-variant", chipCls: "bg-primary-container text-on-primary border-2 border-on-surface", arrowColor: "text-primary-container", chipLabel: "DOCTRINE_III", shadowCls: "hover:shadow-[8px_8px_0_0_#d2232a]", featured: false },
    { num: "IV",  icon: "verified",                 iconColor: "text-surface-bright", title: "CONTINUITY / EVERY ACT IS A SEQUEL.",        body: "No production is invented from nothing. Every show inherits a prop, a costume, a line, a wound from the show before it. The continuity is not nostalgia — it is the receipt that proves the collective existed before today and intends to exist after.",                              cardCls: "bg-on-surface text-surface-bright",          numColor: "text-primary-container", borderCls: "border-on-surface",     dividerCls: "border-surface-bright", bodyCls: "opacity-90",              chipCls: "bg-surface-bright text-on-surface border-2 border-surface-bright", arrowColor: "text-primary-container", chipLabel: "DOCTRINE_IV",  shadowCls: "hover:shadow-[8px_8px_0_0_#d2232a]", featured: false },
  ];

  const workshopPlates = [
    { id: "01", alt: "Industrial machinery, pipes, factory floor",     src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=600&q=80&auto=format&fit=crop", treatment: "redtint" },
    { id: "02", alt: "Circuit-board macro, modernist tech",             src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop", treatment: "bw-triangle" },
    { id: "03", alt: "Server room wide, industrial corridor",           src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80&auto=format&fit=crop", treatment: "redtint" },
    { id: "04", alt: "Server rack with blue LEDs, propaganda mood",     src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80&auto=format&fit=crop", treatment: "bw-circle" },
    { id: "05", alt: "Industrial architecture exterior",                src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80&auto=format&fit=crop", treatment: "redtint" },
    { id: "06", alt: "Concrete corridor brutalist",                     src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=600&q=80&auto=format&fit=crop", treatment: "bw-triangle" },
    { id: "07", alt: "Stark man profile B&W, Rodchenko-style",          src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=600&q=80&auto=format&fit=crop", treatment: "redtint" },
    { id: "08", alt: "Intimate B&W portrait",                            src: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=600&q=80&auto=format&fit=crop", treatment: "bw-circle" },
  ];

  const calendar = [
    { mo: "NOV", day: "07", yr: "2026", moColor: "text-primary-container",  moOpac: "text-on-primary-fixed-variant", actLabel: "ACT_I · OPENING", actLabelColor: "text-primary-container", cardCls: "bg-primary-fixed text-on-surface",                    divider: "border-on-surface",     dayColor: "text-on-surface",     bodyCls: "text-on-primary-fixed-variant", title: "THE FACTORY OF SLEEP", body: "Hall A · Werkhaus 12 · Berlin · 19:30 doors / 20:00 curtain.",         status: "PREMIERE NIGHT", statusCls: "bg-on-surface text-tertiary-fixed border-2 border-on-surface" },
    { mo: "JAN", day: "09", yr: "2027", moColor: "text-tertiary-fixed-dim", moOpac: "opacity-80",             actLabel: "ACT_II · 22 NIGHTS",  actLabelColor: "text-tertiary-fixed-dim", cardCls: "bg-primary-container text-on-primary",                divider: "border-on-primary",     dayColor: "",                    bodyCls: "opacity-90",              title: "RED SQUARE / NIGHT MARCH",    body: "Hangar 06 · Tempelhof · 21:00 procession from Loading Dock 3. Outdoor.", status: "SOLD OUT",       statusCls: "bg-on-primary text-primary-container border-2 border-on-primary" },
    { mo: "MAR", day: "04", yr: "2027", moColor: "text-primary-container",  moOpac: "text-secondary",         actLabel: "ACT_III · 33 NIGHTS", actLabelColor: "text-primary-container",  cardCls: "bg-tertiary-fixed text-on-surface",                  divider: "border-on-surface",     dayColor: "",                    bodyCls: "text-on-surface-variant", title: "THE COLLECTIVE / ACT 7",      body: "Roving · Warehouses 03–07 · Wedding district · 20:00. Bring boots.",     status: "4 NIGHTS LEFT",  statusCls: "bg-primary-container text-on-primary border-2 border-on-surface" },
    { mo: "MAY", day: "10", yr: "2027", moColor: "text-tertiary-fixed-dim", moOpac: "text-tertiary-fixed-dim/80", actLabel: "ACT_IV · 21 NIGHTS", actLabelColor: "text-tertiary-fixed-dim", cardCls: "bg-on-surface text-surface-bright",                   divider: "border-surface-bright", dayColor: "text-primary-container", bodyCls: "opacity-90",          title: "SHRAPNEL / A CONFESSION",     body: "Studio Theatre · 78-seat black box · 22:00. One actor. No interval.",    status: "JOIN WAITLIST",  statusCls: "bg-surface-bright text-on-surface border-2 border-surface-bright" },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-primary-fixed": "#410003", "surface-bright": "#fff9ee", "secondary": "#5f5e5e",
            "on-secondary-fixed": "#1c1b1b", "background": "#fff9ee", "on-surface-variant": "#5c403d",
            "surface-container-highest": "#e9e2d4", "secondary-fixed": "#e5e2e1", "inverse-primary": "#ffb3ad",
            "outline": "#906f6c", "on-tertiary-fixed-variant": "#5c4300", "tertiary-fixed": "#ffdea0",
            "on-error": "#ffffff", "tertiary-container": "#8b6600", "inverse-on-surface": "#f7f0e2",
            "on-tertiary-container": "#ffeccd", "primary-fixed-dim": "#ffb3ad", "error": "#ba1a1a",
            "surface-tint": "#bd0e1e", "primary": "#ac0017", "primary-fixed": "#ffdad6",
            "secondary-fixed-dim": "#c8c6c5", "on-surface": "#1e1b13", "surface-container-high": "#eee7d9",
            "on-primary": "#ffffff", "on-primary-fixed-variant": "#930012", "surface-container-lowest": "#ffffff",
            "on-tertiary": "#ffffff", "primary-container": "#d2232a", "surface": "#fff9ee",
            "on-tertiary-fixed": "#261a00", "surface-container-low": "#faf3e5", "on-primary-container": "#ffebe8",
            "on-secondary-container": "#656464", "inverse-surface": "#333027", "on-secondary": "#ffffff",
            "tertiary": "#6c4f00", "surface-container": "#f4eddf", "on-error-container": "#93000a",
            "on-secondary-fixed-variant": "#474646", "surface-variant": "#e9e2d4", "on-background": "#1e1b13",
            "secondary-container": "#e5e2e1", "surface-dim": "#e0d9cc", "error-container": "#ffdad6",
            "outline-variant": "#e5bdba", "tertiary-fixed-dim": "#f4be43"
          },
          borderRadius: { DEFAULT: "0px", lg: "0px", xl: "0px", full: "0px" },
          spacing: { "margin-page": "40px", "gutter": "0px", "unit": "4px", "thickness-thin": "2px", "thickness-heavy": "12px" },
          fontFamily: {
            "body-lg": ["Epilogue"], "headline-lg": ["Epilogue"], "headline-md": ["Epilogue"],
            "caption-mono": ["Space Grotesk"], "display-xl": ["Epilogue"], "body-sm": ["Epilogue"]
          },
          fontSize: {
            "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0em", fontWeight: "500" }],
            "headline-lg": ["64px", { lineHeight: "60px", letterSpacing: "-0.02em", fontWeight: "800" }],
            "headline-md": ["32px", { lineHeight: "32px", letterSpacing: "0em", fontWeight: "800" }],
            "caption-mono": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
            "display-xl": ["120px", { lineHeight: "100px", letterSpacing: "-0.04em", fontWeight: "900" }],
            "body-sm": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const styles = `
    .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .clip-diagonal { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
    .bg-red-stripes { background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #d2232a 10px, #d2232a 20px); }
    .filter-duotone { filter: grayscale(100%) contrast(200%); mix-blend-mode: multiply; }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;800;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="bg-background text-on-background font-body-lg min-h-screen flex flex-col antialiased overflow-x-hidden selection:bg-primary-container selection:text-white">
        <header className="bg-[#F5F5F5] dark:bg-[#F5F5F5] font-['Epilogue'] font-black uppercase tracking-tighter top-0 w-full border-b-4 border-black flex justify-between items-center px-0 h-24 z-50 relative">
          <div className="text-4xl font-black text-black dark:text-black border-r-4 border-[#D2232A] pr-4 pl-4 md:pl-margin-page h-full flex items-center bg-white">
            AGITPROP 24
          </div>
          <nav className="hidden md:flex h-full border-l-4 border-black">
            {navLinks.map((label, i) => (
              <a key={label} href="#" className={`text-black hover:text-[#D2232A] px-8 ${i < navLinks.length - 1 ? "border-r-4 border-black" : ""} flex items-center h-full hover:bg-black hover:text-white transition-none`}>
                {label}
              </a>
            ))}
          </nav>
          <button className="bg-[#D2232A] text-white px-8 py-2 h-full font-black text-xl hover:bg-black transition-none scale-100 active:translate-x-1 active:translate-y-1 flex items-center justify-center">
            JOIN THE FRONT
          </button>
        </header>

        <main className="flex-grow">
          <section className="relative min-h-[921px] border-b-thickness-heavy border-on-surface overflow-hidden bg-surface-bright flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-margin-page relative z-10 border-r-thickness-heavy border-on-surface lg:border-none">
              <div className="absolute top-0 left-0 w-full h-full bg-red-stripes opacity-10 pointer-events-none"></div>
              <div className="transform -rotate-6 transform-origin-top-left mb-12">
                <h1 className="font-display-xl text-on-surface leading-[0.85] uppercase tracking-tighter mix-blend-difference">
                  <span className="block">SEASON</span>
                  <span className="block text-primary-container">2026</span>
                  <span className="block">NOW</span>
                </h1>
              </div>
              <div className="mt-8 flex items-start gap-6">
                <div className="w-thickness-heavy h-32 bg-on-surface"></div>
                <p className="font-body-lg max-w-md uppercase font-bold tracking-widest text-secondary">
                  A brutal collision of flesh, steel, and ideology. The stage is a weapon. The audience is the target.
                </p>
              </div>
              <div className="mt-16 transform rotate-3">
                <a href="#" className="inline-block bg-primary-container text-white font-headline-md px-12 py-6 uppercase hover:bg-on-surface hover:text-white transition-none border-4 border-on-surface hover:translate-x-2 hover:translate-y-2 group">
                  BUY TICKETS
                  <span className="material-symbols-outlined ml-4 align-middle group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </a>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative bg-secondary-fixed min-h-[614px] lg:min-h-full flex items-center justify-center border-t-thickness-heavy lg:border-t-0 lg:border-l-thickness-heavy border-on-surface overflow-hidden">
              <div className="absolute w-[150%] h-[150%] bg-primary-container transform -rotate-45 origin-bottom-left -translate-x-1/4 translate-y-1/4 mix-blend-multiply z-0"></div>
              <img alt="Actor portrait" className="relative z-10 w-4/5 h-auto filter-duotone grayscale contrast-200 border-thickness-heavy border-on-surface transform rotate-2 object-cover aspect-[3/4]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC59Q-I6Ili_dZfJd8oOhIZmUq06wRmTEVAvEWU8iH0XRA3NBn6aAmYkDj7E2ayRZu54R4GN_XhRcd_xC_TNo-fVDxFfh6ZjvVoY7AiBfly-6WeGVHV2wgux2a5RPNWDzXi68m-LwwjjcFmtkaoPsbFnETPR6i1lZzSFZ62TDJIkPREzmY3jAylRpI3tbN8lw5L3DBWljb4AkS0Am2QvsAbYzpADAUS3m35f1qQt2KWVN1KXv-qsKUvZMjJb0cIhWjkgSB5BPoIzIs" />
              <div className="absolute top-10 right-10 w-24 h-24 bg-tertiary-fixed transform rotate-45 border-4 border-on-surface z-20 mix-blend-exclusion"></div>
              <div className="absolute bottom-10 left-10 w-64 h-thickness-heavy bg-on-surface z-20 transform -rotate-12"></div>
            </div>
          </section>

          {/* PROGRAMME — 4 productions in heavy-bordered grid */}
          <section className="border-b-thickness-heavy border-on-surface bg-surface-bright px-8 lg:px-margin-page py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-stripes opacity-[0.06] pointer-events-none -translate-y-1/4 translate-x-1/4" />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 relative">
              <div>
                <span className="font-caption-mono text-caption-mono uppercase text-primary-container mb-3 block">// PROGRAMME · IV ACTS</span>
                <h2 className="font-headline-lg text-headline-lg uppercase text-on-surface">FOUR ACTS / ONE BLADE.</h2>
              </div>
              <p className="font-body-lg max-w-md uppercase font-bold tracking-widest text-secondary lg:text-right">The 2026 season runs across 84 nights. Heavy boots required. No latecomers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-thickness-heavy">
              {programme.map(p => (
                <article key={p.num} className={`border-thickness-heavy border-on-surface ${p.cardCls} p-8 relative group hover:translate-x-1 hover:-translate-y-1 transition-transform duration-75`}>
                  <div className={`absolute top-0 right-0 ${p.actChip} px-3 py-1 font-caption-mono text-caption-mono uppercase`}>ACT_{p.num}</div>
                  <div className={`font-display-xl text-[80px] leading-none ${p.numColor} italic mb-6`}>{p.num}</div>
                  <h3 className={`font-headline-md text-headline-md uppercase mb-3 ${p.titleCls}`}>{p.title}</h3>
                  <p className={`font-body-lg ${p.bodyCls} mb-6`}>{p.body}</p>
                  <div className={`flex justify-between items-end pt-4 border-t-thickness-thin ${p.borderCls}`}>
                    <span className="font-caption-mono text-caption-mono uppercase tabular-nums">{p.dates}</span>
                    <span className={`${p.statusCls} px-2 py-1 font-caption-mono text-caption-mono uppercase`}>{p.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* MANIFESTO — full-bleed red-stripes */}
          <section className="border-b-thickness-heavy border-on-surface bg-on-surface text-surface-bright px-8 lg:px-margin-page py-20 lg:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-stripes opacity-[0.18] pointer-events-none" />
            <div className="absolute top-12 right-12 w-32 h-32 bg-tertiary-fixed transform rotate-12 border-thickness-heavy border-surface-bright z-10" />
            <div className="absolute bottom-12 left-8 w-48 h-thickness-heavy bg-primary-container z-10 transform -rotate-6" />
            <div className="relative max-w-5xl mx-auto">
              <span className="font-caption-mono text-caption-mono uppercase text-tertiary-fixed-dim mb-6 block">// MANIFESTO · V TENETS · 1924–2026</span>
              <h2 className="font-display-xl text-[clamp(56px,_9vw,_120px)] leading-[0.9] uppercase text-surface-bright mb-12 italic transform -rotate-1">
                ART<br /><span className="text-primary-container">IS NOT</span><br />A SERVICE.
              </h2>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 border-t-thickness-heavy border-surface-bright/30 pt-12">
                {manifesto.map(m => (
                  <li key={m.num} className={`flex gap-6${m.wide ? " md:col-span-2 border-t-thickness-thin border-surface-bright/30 pt-8" : ""}`}>
                    <span className={`font-display-xl text-[64px] leading-none ${m.color} italic tabular-nums`}>{m.num}</span>
                    <div>
                      <h3 className="font-headline-md text-headline-md uppercase mb-2">{m.title}</h3>
                      <p className="font-body-lg text-surface-bright/80">{m.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-12 pt-8 border-t-thickness-thin border-surface-bright/30 flex flex-col sm:flex-row justify-between gap-3 font-caption-mono text-caption-mono uppercase text-tertiary-fixed-dim">
                <span>SIGNED · THE COLLECTIVE · 1924/2026</span>
                <span className="tabular-nums">REISSUED · MMXXVI</span>
              </div>
            </div>
          </section>

          {/* ENSEMBLE image strip */}
          <section className="border-b-thickness-heavy border-on-surface bg-surface-bright px-8 lg:px-margin-page py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-full bg-red-stripes opacity-[0.04] pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 relative">
              <div>
                <span className="font-caption-mono text-caption-mono uppercase text-primary-container mb-3 block">// ENSEMBLE · N=05</span>
                <h2 className="font-headline-lg text-headline-lg uppercase text-on-surface">FACES OF THE FRONT.</h2>
              </div>
              <p className="font-body-lg max-w-md uppercase font-bold tracking-widest text-secondary lg:text-right">Permanent ensemble of 18. Featured here, the five who carry Acts I–IV. Photographs by Y. Volkov, May 2026.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-thickness-heavy relative">
              {ensemble.map(e => (
                <figure key={e.id} className={`border-thickness-heavy border-on-surface bg-secondary-fixed aspect-[3/4] relative overflow-hidden transform ${e.rot} hover:rotate-0 transition-transform`}>
                  <img alt={e.alt} className="w-full h-full object-cover filter-duotone grayscale contrast-200" src={e.src} />
                  <div className={`absolute top-0 left-0 ${e.chip} px-2 py-1 font-caption-mono text-caption-mono uppercase`}>{e.id}</div>
                  <figcaption className="absolute bottom-0 inset-x-0 bg-on-surface text-surface-bright px-3 py-2 border-t-thickness-thin border-tertiary-fixed">
                    <p className="font-headline-md text-base uppercase leading-tight">{e.name}</p>
                    <p className="font-caption-mono text-caption-mono text-tertiary-fixed-dim">{e.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-8 font-caption-mono text-caption-mono uppercase text-secondary text-center tracking-widest">— PHOTOGRAPHS · BERLIN STUDIO · MMXXVI · NEGATIVES IN COLLECTIVE ARCHIVE —</p>
          </section>

          {/* TRUSTED-BY — press / commissioners in constructivist register */}
          <section className="border-b-thickness-heavy border-on-surface bg-surface-bright px-8 lg:px-margin-page py-16 lg:py-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-thickness-heavy bg-primary-container z-0" />
            <div className="absolute top-0 right-0 w-thickness-heavy h-32 bg-on-surface z-0" />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-12 relative">
              <div>
                <span className="font-caption-mono text-caption-mono uppercase text-primary-container mb-8 md:mb-10 block">— ПЕЧАТЬ · COMMISSIONED BY ·</span>
                <h2 className="font-headline-lg text-headline-lg uppercase text-on-surface">DELIVERED FOR / TWELVE PROVINCES.</h2>
              </div>
              <p className="font-body-lg max-w-md uppercase font-bold tracking-widest text-secondary lg:text-right">No paid placements. No press kit. The list below printed plain ink, set in lead, since MMXIV.</p>
            </div>
            <div className="border-thickness-heavy border-on-surface bg-surface-container-lowest p-8 md:p-10 transform -rotate-[0.5deg] relative">
              <div className="absolute -top-3 left-8 bg-primary-container text-on-primary px-3 py-1 font-caption-mono text-caption-mono uppercase border-2 border-on-surface">DOSSIER · 08</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8 items-center justify-items-center">
                {trustedLogos.map(logo => (
                  <img key={logo.alt} alt={logo.alt} className="h-8 w-auto" src={logo.src} />
                ))}
              </div>
              <div className="mt-10 pt-6 border-t-thickness-thin border-on-surface flex flex-col sm:flex-row justify-between gap-3 font-caption-mono text-caption-mono uppercase">
                <span className="text-on-surface">+ 14 ATELIERS · 8 PROVINCES · MMXIV</span>
                <span className="text-primary-container tabular-nums">PRINTED ON STOCK · 240 GSM</span>
              </div>
            </div>
          </section>

          {/* DOCTRINES — premium 2×2 with chunky red offset shadow */}
          <section className="border-b-thickness-heavy border-on-surface bg-surface-bright px-8 lg:px-margin-page py-20 md:py-28 relative overflow-hidden">
            <div className="absolute top-12 right-16 w-32 h-32 bg-primary-container transform rotate-45 border-thickness-heavy border-on-surface z-0 opacity-90" />
            <div className="absolute bottom-16 left-12 w-24 h-24 bg-on-surface rounded-full z-0" />
            <div className="absolute bottom-8 right-1/3 w-48 h-thickness-heavy bg-tertiary-fixed-dim z-0 transform -rotate-3" />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-12 relative">
              <div>
                <span className="font-caption-mono text-caption-mono uppercase text-primary-container mb-8 md:mb-10 block">— ДОКТРИНЫ · IV PROMISES ·</span>
                <h2 className="font-headline-lg text-headline-lg uppercase text-on-surface">FOUR DOCTRINES / NO ALTERNATIVES.</h2>
              </div>
              <p className="font-body-lg max-w-md uppercase font-bold tracking-widest text-secondary lg:text-right">Drawn up in 1924, redrawn this season. Each doctrine is enforced by the collective, not the box office.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
              {doctrines.map(d => (
                <article key={d.num} className={`border-thickness-heavy ${d.borderCls} ${d.cardCls} p-8 md:p-10 flex flex-col gap-5 group hover:-translate-y-1 ${d.shadowCls} transition-all duration-300 relative`}>
                  {d.featured ? (
                    <div className="absolute top-0 right-0 bg-on-surface text-tertiary-fixed px-3 py-1 font-caption-mono text-caption-mono uppercase border-l-2 border-b-2 border-on-surface">ZERO ALTERNATIVE</div>
                  ) : null}
                  <div className={`flex items-center justify-between${d.featured ? " mt-3" : ""}`}>
                    <span className={`font-display-xl text-[64px] leading-none ${d.numColor} italic`}>{d.num}</span>
                    <span className={`material-symbols-outlined ${d.iconColor}`} style={{ fontSize: 28 }}>{d.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md uppercase">{d.title}</h3>
                  <p className={`font-body-lg ${d.bodyCls}`}>{d.body}</p>
                  <div className={`flex justify-between items-center pt-4 border-t-2 ${d.dividerCls} mt-auto`}>
                    <span className={`${d.chipCls} px-3 py-1 font-caption-mono text-caption-mono uppercase`}>{d.chipLabel}</span>
                    <span className={`material-symbols-outlined ${d.arrowColor} group-hover:translate-x-1 transition-transform`}>arrow_forward</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* WORKSHOP STRIP — alternating red-tint / B&W with geometric overlays */}
          <section className="border-b-thickness-heavy border-on-surface bg-on-surface text-surface-bright px-8 lg:px-margin-page py-16 md:py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-stripes opacity-[0.06] pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-12 relative">
              <div>
                <span className="font-caption-mono text-caption-mono uppercase text-tertiary-fixed-dim mb-8 md:mb-10 block">— ПЛАНТА · WORKSHOP · VIII PLATES ·</span>
                <h2 className="font-headline-lg text-headline-lg uppercase text-surface-bright">FROM THE FACTORY FLOOR.</h2>
              </div>
              <p className="font-body-lg max-w-md uppercase font-bold tracking-widest text-tertiary-fixed-dim lg:text-right">Eight plates from the welding shop, the press room, and the loading dock. Photographed during the III Act build, March 2026.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 relative">
              {workshopPlates.map(plate => (
                <figure key={plate.id} className="aspect-square overflow-hidden border-thickness-heavy border-surface-bright relative group">
                  <img alt={plate.alt} className={`w-full h-full object-cover${plate.treatment === "redtint" ? "" : " filter grayscale contrast-200"}`} src={plate.src} />
                  {plate.treatment === "redtint" ? (
                    <>
                      <div className="absolute inset-0 bg-primary-container mix-blend-multiply opacity-60" />
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.25)_3px,rgba(0,0,0,0.25)_4px)] pointer-events-none" />
                    </>
                  ) : null}
                  {plate.treatment === "bw-triangle" ? (
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-primary-container" />
                  ) : null}
                  {plate.treatment === "bw-circle" ? (
                    <div className="absolute top-3 right-3 w-12 h-12 bg-tertiary-fixed-dim rounded-full border-2 border-on-surface" />
                  ) : null}
                  <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest bg-on-surface text-surface-bright px-2 py-1 font-caption-mono">ПЛАНТА · {plate.id}</span>
                </figure>
              ))}
            </div>
            <p className="mt-8 font-caption-mono text-caption-mono uppercase text-tertiary-fixed-dim text-center tracking-widest">— PLATES · WORKSHOP CAMERA · MMXXVI · COLLECTIVE ARCHIVE NEGATIVE BOOK 14 —</p>
          </section>

          {/* SEASON CALENDAR */}
          <section className="bg-surface-bright px-8 lg:px-margin-page py-16 lg:py-24 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <span className="font-caption-mono text-caption-mono uppercase text-primary-container mb-3 block">// SEASON · 84 NIGHTS</span>
                <h2 className="font-headline-lg text-headline-lg uppercase text-on-surface">CALENDAR / NOV 26 – MAY 27.</h2>
              </div>
              <p className="font-body-lg max-w-md uppercase font-bold tracking-widest text-secondary lg:text-right">Single-night and full-pass tickets release on rolling Mondays. The ZIL truck stays parked between dates.</p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-thickness-heavy">
              {calendar.map(c => (
                <li key={c.title} className={`border-thickness-heavy border-on-surface ${c.cardCls} p-6 flex gap-6 items-stretch`}>
                  <div className={`border-r-thickness-heavy ${c.divider} pr-6 flex flex-col items-center justify-center min-w-[110px]`}>
                    <span className={`font-caption-mono text-caption-mono uppercase ${c.moColor}`}>{c.mo}</span>
                    <span className={`font-display-xl text-[64px] leading-none tabular-nums italic ${c.dayColor}`}>{c.day}</span>
                    <span className={`font-caption-mono text-caption-mono uppercase ${c.moOpac}`}>{c.yr}</span>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className={`font-caption-mono text-caption-mono uppercase ${c.actLabelColor}`}>{c.actLabel}</span>
                    <h3 className="font-headline-md text-headline-md uppercase mb-2">{c.title}</h3>
                    <p className={`font-body-lg ${c.bodyCls} flex-grow`}>{c.body}</p>
                    <span className={`${c.statusCls} px-3 py-1 font-caption-mono text-caption-mono uppercase w-max mt-3`}>{c.status}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <footer className="bg-black dark:bg-black font-['Space_Grotesk'] font-bold uppercase text-sm w-full border-t-8 border-[#D2232A] flex flex-col md:flex-row justify-between items-center p-12 relative z-10">
          <div className="text-[#D2232A] font-black text-2xl mb-8 md:mb-0">
            ©1924-2024 AGITPROP 24. ART IS A WEAPON.
          </div>
          <nav className="flex flex-wrap justify-center gap-8 md:gap-12">
            {footerLinks.map(label => (
              <a key={label} href="#" className="text-[#F5F5F5] hover:text-[#D2232A] transition-none border-b-2 border-transparent hover:border-[#D2232A]">
                {label}
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
}
