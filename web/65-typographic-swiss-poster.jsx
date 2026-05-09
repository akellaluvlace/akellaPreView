export default function T65TypographicSwissPoster() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;600&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                'swiss-orange': '#FF4500',
                'swiss-black': '#111111',
                'swiss-offwhite': '#F4F4F4',
              },
              fontFamily: {
                'display': ['"Archivo Black"', 'sans-serif'],
                'serif': ['"DM Serif Display"', 'serif'],
                'body': ['"Inter"', 'sans-serif'],
              },
              spacing: { '128': '32rem' }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #FFFFFF; color: #111111; overflow-x: hidden; }
        .type-clamp { font-size: clamp(3rem, 24vw, 24rem); line-height: 0.8; }
        .type-clamp-lg { font-size: clamp(2.5rem, 8vw, 10rem); line-height: 0.9; }
        .vertical-rl { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
        .marquee-track { display: flex; width: max-content; animation: scroll 25s linear infinite; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .blend-multiply { mix-blend-mode: multiply; }
        ::selection { background-color: #FF4500; color: #FFFFFF; }
        .swiss-border-b { border-bottom: 2px solid #111111; }
        .swiss-border-t { border-top: 2px solid #111111; }
        .swiss-border-r { border-right: 2px solid #111111; }
        html { scroll-padding-top: 50px; }
      ` }} />

      <div className="antialiased">

        <nav className="fixed top-0 w-full z-50 bg-white border-b-4 border-swiss-black flex justify-between items-center px-4 py-2 md:px-6">
          <div className="font-display uppercase text-sm md:text-lg tracking-widest">
            <span className="text-swiss-orange">●</span> Live Status
          </div>
          <div className="font-display uppercase text-sm md:text-lg tracking-widest hidden md:block">
            Berlin / Oct 12-14
          </div>
          <a href="#tickets" className="bg-swiss-black text-white px-6 py-2 font-display uppercase text-xs md:text-sm hover:bg-swiss-orange transition-colors duration-300">
            Secure Entry
          </a>
        </nav>

        <header className="relative min-h-screen flex flex-col pt-16 md:pt-0">
          <div className="flex-grow flex flex-col justify-center items-center relative overflow-hidden px-4">
            <div className="absolute inset-0 z-0 opacity-10 md:opacity-100 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[150%] h-2 bg-swiss-orange transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 w-[150%] h-1 bg-black transform -translate-x-1/2 -translate-y-1/2 -rotate-45 mt-4"></div>
            </div>
            <div className="relative z-10 w-full max-w-[95%] mx-auto text-center mix-blend-multiply">
              <h1 className="font-display type-clamp tracking-tighter text-swiss-black uppercase">
                TYPE
              </h1>
              <div className="flex flex-col md:flex-row justify-between items-end w-full border-t-8 border-swiss-black mt-4 md:-mt-8 pt-4">
                <div className="text-left">
                  <span className="block font-display text-4xl md:text-8xl text-swiss-orange leading-none">_2024</span>
                  <span className="block font-serif italic text-xl md:text-3xl">Intl. Symposium</span>
                </div>
                <div className="text-right mt-8 md:mt-0">
                  <div className="font-display text-xl md:text-4xl uppercase leading-none">
                    Oct 12 — 14
                  </div>
                  <div className="font-body text-sm md:text-lg font-bold uppercase tracking-widest mt-2">
                    Kraftwerk Berlin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-swiss-orange text-white border-y-4 border-swiss-black py-3 overflow-hidden">
          <div className="marquee-track font-display text-2xl md:text-4xl uppercase tracking-widest">
            <span className="mx-8">Systematic Chaos</span> ///
            <span className="mx-8">Variable Fonts</span> ///
            <span className="mx-8">Swiss International Style</span> ///
            <span className="mx-8">The Grid Is God</span> ///
            <span className="mx-8">Kerning Matters</span> ///
            <span className="mx-8">Analog Print</span> ///
            <span className="mx-8">Systematic Chaos</span> ///
            <span className="mx-8">Variable Fonts</span> ///
            <span className="mx-8">Swiss International Style</span> ///
            <span className="mx-8">The Grid Is God</span> ///
            <span className="mx-8">Kerning Matters</span> ///
            <span className="mx-8">Analog Print</span> ///
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-12 min-h-[70vh]">
          <div className="hidden md:flex col-span-1 bg-swiss-black text-white items-center justify-center border-r-4 border-white py-12">
            <h2 className="vertical-rl font-display text-5xl tracking-widest uppercase">Manifesto</h2>
          </div>
          <div className="md:hidden bg-swiss-black text-white p-6">
            <h2 className="font-display text-4xl uppercase">Manifesto</h2>
          </div>
          <div className="col-span-1 md:col-span-11 p-6 md:p-20 flex flex-col justify-center bg-white relative">
            <hr className="border-t-8 border-swiss-orange w-32 mb-12" />
            <p className="font-serif text-3xl md:text-6xl/tight text-swiss-black max-w-6xl">
              We reject the ornamental. We embrace the <span className="bg-swiss-black text-white px-2 decoration-clone box-decoration-clone">structural</span>. Typography is the voice of the machine and the soul of the message.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
              <div>
                <h3 className="font-display text-xl uppercase mb-4">The Objective</h3>
                <p className="font-body text-lg leading-relaxed text-gray-700">
                  TYPE_2024 returns to the fundamentals of the International Typographic Style. We explore how the strict constraints of the grid system liberate creativity rather than stifle it.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl uppercase mb-4">The Method</h3>
                <p className="font-body text-lg leading-relaxed text-gray-700">
                  Three days of workshops, lectures, and brutal critique. No images. No fluff. Just form, counter-form, weight, and hierarchy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t-8 border-swiss-black">
          <div className="bg-swiss-offwhite px-4 py-8 md:px-12 md:py-12 flex justify-between items-end border-b-4 border-swiss-black">
            <h2 className="font-display type-clamp-lg uppercase leading-none">Voices</h2>
            <span className="hidden md:block font-body font-bold text-xl">(06)</span>
          </div>
          <div className="flex flex-col">
            <article className="group relative grid grid-cols-1 md:grid-cols-12 border-b-2 border-swiss-black bg-white transition-colors duration-300 hover:bg-swiss-black hover:text-white cursor-pointer">
              <div className="col-span-1 md:col-span-1 p-4 md:p-8 font-mono text-swiss-orange group-hover:text-swiss-orange border-b md:border-b-0 md:border-r border-swiss-black group-hover:border-white/20">
                01
              </div>
              <div className="col-span-1 md:col-span-8 p-4 md:p-8 relative overflow-hidden">
                <h3 className="font-display text-5xl md:text-8xl uppercase tracking-tighter relative z-10 translate-x-0 group-hover:translate-x-4 transition-transform duration-500">
                  Adrian <br className="md:hidden" />Frutiger
                </h3>
                <span className="font-serif italic text-xl md:text-2xl mt-2 block opacity-60 group-hover:opacity-100">"The Universal Grid"</span>
              </div>
              <div className="col-span-1 md:col-span-3 p-4 md:p-8 flex flex-col justify-end border-t md:border-t-0 md:border-l border-swiss-black group-hover:border-white/20">
                <p className="font-body text-sm md:text-base leading-snug">
                  Zurich, CH<br />
                  Chief Typographer
                </p>
                <div className="mt-4 w-full h-1 bg-swiss-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </article>

            <article className="group relative grid grid-cols-1 md:grid-cols-12 border-b-2 border-swiss-black bg-white transition-colors duration-300 hover:bg-swiss-orange hover:text-white cursor-pointer">
              <div className="col-span-1 md:col-span-1 p-4 md:p-8 font-mono text-swiss-black group-hover:text-white border-b md:border-b-0 md:border-r border-swiss-black group-hover:border-white/20">
                02
              </div>
              <div className="col-span-1 md:col-span-8 p-4 md:p-8 relative overflow-hidden">
                <h3 className="font-display text-5xl md:text-8xl uppercase tracking-tighter relative z-10 translate-x-0 group-hover:translate-x-4 transition-transform duration-500">
                  Paula <br className="md:hidden" />Scher
                </h3>
                <span className="font-serif italic text-xl md:text-2xl mt-2 block opacity-60 group-hover:opacity-100">"Type as Image"</span>
              </div>
              <div className="col-span-1 md:col-span-3 p-4 md:p-8 flex flex-col justify-end border-t md:border-t-0 md:border-l border-swiss-black group-hover:border-white/20">
                <p className="font-body text-sm md:text-base leading-snug">
                  New York, USA<br />
                  Pentagram Partner
                </p>
                <div className="mt-4 w-full h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </article>

            <article className="group relative grid grid-cols-1 md:grid-cols-12 border-b-2 border-swiss-black bg-white transition-colors duration-300 hover:bg-swiss-black hover:text-white cursor-pointer">
              <div className="col-span-1 md:col-span-1 p-4 md:p-8 font-mono text-swiss-orange group-hover:text-swiss-orange border-b md:border-b-0 md:border-r border-swiss-black group-hover:border-white/20">
                03
              </div>
              <div className="col-span-1 md:col-span-8 p-4 md:p-8 relative overflow-hidden">
                <h3 className="font-display text-5xl md:text-8xl uppercase tracking-tighter relative z-10 translate-x-0 group-hover:translate-x-4 transition-transform duration-500">
                  Wim <br className="md:hidden" />Crouwel
                </h3>
                <span className="font-serif italic text-xl md:text-2xl mt-2 block opacity-60 group-hover:opacity-100">"Gridnik"</span>
              </div>
              <div className="col-span-1 md:col-span-3 p-4 md:p-8 flex flex-col justify-end border-t md:border-t-0 md:border-l border-swiss-black group-hover:border-white/20">
                <p className="font-body text-sm md:text-base leading-snug">
                  Amsterdam, NL<br />
                  Total Design
                </p>
                <div className="mt-4 w-full h-1 bg-swiss-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </article>
          </div>
        </section>

        <section className="py-20 px-4 md:px-12 max-w-screen-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl uppercase mb-12 border-l-8 border-swiss-orange pl-6">
            Program_Seq
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-swiss-black">
            <div className="lg:border-r-2 border-swiss-black">
              <div className="bg-swiss-black text-white p-6 font-display uppercase tracking-widest text-xl">
                Day 01 <span className="text-swiss-orange">/</span> Oct 12
              </div>
              <ul className="divide-y-2 divide-swiss-black">
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">09:00</span>
                  <span className="font-display text-xl uppercase">Registration</span>
                </li>
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">10:30</span>
                  <span className="font-display text-xl uppercase">Keynote: The Void</span>
                  <p className="font-serif italic text-gray-600 mt-1">Speaker TBD</p>
                </li>
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">13:00</span>
                  <span className="font-display text-xl uppercase">Workshop A: InDesign Hell</span>
                  <p className="font-serif italic text-gray-600 mt-1">Bring your own laptop</p>
                </li>
              </ul>
            </div>
            <div className="border-t-2 lg:border-t-0 lg:border-r-2 border-swiss-black">
              <div className="bg-swiss-black text-white p-6 font-display uppercase tracking-widest text-xl">
                Day 02 <span className="text-swiss-orange">/</span> Oct 13
              </div>
              <ul className="divide-y-2 divide-swiss-black">
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">09:00</span>
                  <span className="font-display text-xl uppercase">Variable Fonts</span>
                </li>
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">11:00</span>
                  <span className="font-display text-xl uppercase">Panel: Serif Dead?</span>
                  <p className="font-serif italic text-gray-600 mt-1">Debate Arena</p>
                </li>
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">15:00</span>
                  <span className="font-display text-xl uppercase">Portfolio Review</span>
                  <p className="font-serif italic text-gray-600 mt-1">Brutal Honesty Only</p>
                </li>
              </ul>
            </div>
            <div className="border-t-2 lg:border-t-0">
              <div className="bg-swiss-black text-white p-6 font-display uppercase tracking-widest text-xl">
                Day 03 <span className="text-swiss-orange">/</span> Oct 14
              </div>
              <ul className="divide-y-2 divide-swiss-black">
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">10:00</span>
                  <span className="font-display text-xl uppercase">Masterclass</span>
                </li>
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">13:00</span>
                  <span className="font-display text-xl uppercase">Future Type</span>
                  <p className="font-serif italic text-gray-600 mt-1">Generative AI & Glyphs</p>
                </li>
                <li className="p-6 hover:bg-gray-50">
                  <span className="font-mono text-sm text-swiss-orange block mb-1">18:00</span>
                  <span className="font-display text-xl uppercase">Closing Party</span>
                  <p className="font-serif italic text-gray-600 mt-1">Roof Deck</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SPEAKERS STRIP — static side-by-side image strip (8 portraits) */}
        <section className="border-t-8 border-swiss-black bg-white">
          <div className="px-4 py-8 md:px-12 md:py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-4 border-swiss-black">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-2">— Section · 05</span>
              <h2 className="font-display text-4xl md:text-7xl uppercase leading-none tracking-tighter">Speakers · 8 Keynotes</h2>
            </div>
            <div className="font-body text-sm md:text-base text-gray-700 max-w-md">
              <span className="font-display uppercase block">Index_Faces</span>
              Eight rooms. Eight voices. One unbroken Helvetica grid.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 p-4 md:p-6">
            {[
              { n: "01", id: "1490481651871-ab68de25d43d", name: "Anya Reuter", role: "Director, Edition.werk · DE", dot: true },
              { n: "02", id: "1488161628813-04466f872be2", name: "Lior Mensch", role: "Variable Type Lead · IL" },
              { n: "03", id: "1776275758873-31603dd06112", name: "Marisol Cano", role: "Editorial Critic · ES" },
              { n: "04", id: "1517677208171-0bc6725a3e60", name: "Theo Vance", role: "Foundry Programmer · UK" },
              { n: "05", id: "1539109136881-3be0616acf4b", name: "Hana Sato", role: "Kanji System Design · JP" },
              { n: "06", id: "1502716119720-b23a93e5fe1b", name: "Daniel Okafor", role: "Brand Systems · NG" },
              { n: "07", id: "1483985988355-763728e1935b", name: "Iris Halberg", role: "Newspaper Type · SE" },
              { n: "08", id: "1485231183945-fffde7cc051e", name: "Marco Pellegrini", role: "Lead Type Engineer · IT" },
            ].map((s) => (
              <figure key={s.n} className="flex flex-col">
                <span className="font-display text-xs md:text-sm uppercase mb-1">
                  {s.dot ? <span className="text-swiss-orange">●</span> : null}
                  {s.dot ? " " : ""}{s.n}
                </span>
                <div className="aspect-square overflow-hidden border border-swiss-black/15 bg-swiss-offwhite">
                  <img src={`https://images.unsplash.com/photo-${s.id}?w=600&q=85&auto=format&fit=crop`} alt={`Speaker ${s.n}`} className="w-full h-full object-cover grayscale" />
                </div>
                <figcaption className="pt-2">
                  <span className="block font-display text-[13px] uppercase leading-tight">{s.name}</span>
                  <span className="block font-body text-[11px] text-gray-600">{s.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* PROGRAMME · DAY-BY-DAY — alternating rows with image + content */}
        <section className="border-t-8 border-swiss-black bg-white">
          <div className="px-4 py-8 md:px-12 md:py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-4 border-swiss-black">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-2">— Section · 06</span>
              <h2 className="font-display text-4xl md:text-7xl uppercase leading-none tracking-tighter">Programme · Day-by-Day</h2>
            </div>
            <div className="font-body text-sm md:text-base text-gray-700 max-w-md">
              Three days. Three rooms. A staggered grid of keynotes, panels, and evening events.
            </div>
          </div>

          {/* Day 01 — image left, copy right */}
          <article className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-swiss-black">
            <div className="lg:col-span-7 border-b-2 lg:border-b-0 lg:border-r-2 border-swiss-black bg-swiss-offwhite">
              <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=85&auto=format&fit=crop" alt="Bauakademie facade — Day 01" className="w-full h-full object-cover aspect-[4/3] grayscale" />
            </div>
            <div className="lg:col-span-5 p-6 md:p-12 flex flex-col justify-between gap-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[12vw] md:text-[8vw] leading-none text-swiss-black tracking-tighter">01</span>
                <span className="font-serif italic text-2xl md:text-3xl text-swiss-orange">Oct 12</span>
              </div>
              <p className="font-body text-base md:text-lg leading-relaxed text-gray-700">
                Day one opens slow on purpose. After registration the floor is given over to three keynotes that frame the next seventy-two hours: a long-form lecture on the genealogy of the Swiss grid from Karl Gerstner forward, a programmer's tour through variable-axis OpenType, and a closing fireside on the politics of public-facing wayfinding type. Two panels — one on print revivalism and one on diacritics across non-Latin scripts — sit either side of lunch. The evening event is a quiet one: a reception inside the Hauptsaal with letterpress proofs pinned across every available wall.
              </p>
              <ul className="font-mono text-xs uppercase text-swiss-black space-y-1 border-t border-swiss-black/15 pt-4">
                <li><span className="text-swiss-orange">09:00</span> &nbsp; Registration · Foyer</li>
                <li>10:30 &nbsp; Keynote · The Genealogy of the Grid</li>
                <li>12:00 &nbsp; Panel · Print Revivalism</li>
                <li>14:00 &nbsp; Keynote · Variable Axes Explained</li>
                <li>16:00 &nbsp; Panel · Diacritics, Non-Latin</li>
                <li>19:00 &nbsp; Reception · Hauptsaal</li>
              </ul>
            </div>
          </article>

          {/* Day 02 — copy left, image right */}
          <article className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-swiss-black">
            <div className="lg:col-span-5 p-6 md:p-12 flex flex-col justify-between gap-6 lg:order-1 order-2 border-t-2 lg:border-t-0 lg:border-r-2 border-swiss-black">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[12vw] md:text-[8vw] leading-none text-swiss-black tracking-tighter">02</span>
                <span className="font-serif italic text-2xl md:text-3xl">Oct 13</span>
              </div>
              <p className="font-body text-base md:text-lg leading-relaxed text-gray-700">
                The middle day is the working day. Three keynotes fold directly into hands-on workshops: a morning session on hinting and rasterisation that breaks for an hour-long panel on whether the serif is genuinely dead or just resting, then an afternoon stretch on portfolio review where every attendee receives twenty minutes of brutal honesty from a rotating jury. Two panels frame the day — one on archive practice with the Swiss National Library and one on the economics of running an independent foundry. The evening is a screening of unreleased specimen films in the Studio.
              </p>
              <ul className="font-mono text-xs uppercase text-swiss-black space-y-1 border-t border-swiss-black/15 pt-4">
                <li>09:00 &nbsp; Keynote · Hinting & Rasterisation</li>
                <li>11:00 &nbsp; Panel · Is the Serif Dead?</li>
                <li>13:00 &nbsp; Keynote · Foundry Economics</li>
                <li>15:00 &nbsp; Workshop · Portfolio Review</li>
                <li>17:00 &nbsp; Panel · Archive Practice</li>
                <li><span className="text-swiss-orange">20:00</span> &nbsp; Screening · Studio</li>
              </ul>
            </div>
            <div className="lg:col-span-7 lg:order-2 order-1 bg-swiss-offwhite">
              <img src="https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1600&q=85&auto=format&fit=crop" alt="Studio interior — Day 02" className="w-full h-full object-cover aspect-[4/3] grayscale" />
            </div>
          </article>

          {/* Day 03 — image left, copy right */}
          <article className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 border-b-2 lg:border-b-0 lg:border-r-2 border-swiss-black bg-swiss-offwhite">
              <img src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1600&q=85&auto=format&fit=crop" alt="Stage interior — Day 03" className="w-full h-full object-cover aspect-[4/3] grayscale" />
            </div>
            <div className="lg:col-span-5 p-6 md:p-12 flex flex-col justify-between gap-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[12vw] md:text-[8vw] leading-none text-swiss-black tracking-tighter">03</span>
                <span className="font-serif italic text-2xl md:text-3xl">Oct 14</span>
              </div>
              <p className="font-body text-base md:text-lg leading-relaxed text-gray-700">
                The closing day is unapologetically forward-facing. A morning masterclass in counter-form construction is followed by two keynotes on machine-learning approaches to glyph generation and on the legal status of generated typefaces under European copyright frameworks. Two panels — student showcase and a publishers' roundtable — take the afternoon. The evening is the closing party on the Kraftwerk roof deck, scored entirely by readings from the conference programme set in twenty-four-point Inter, projected at twelve metres against the cooling tower.
              </p>
              <ul className="font-mono text-xs uppercase text-swiss-black space-y-1 border-t border-swiss-black/15 pt-4">
                <li>10:00 &nbsp; Masterclass · Counter-Form</li>
                <li>12:00 &nbsp; Keynote · ML & Glyph Generation</li>
                <li>14:00 &nbsp; Panel · Student Showcase</li>
                <li>15:30 &nbsp; Keynote · Generated Type & Copyright</li>
                <li>17:00 &nbsp; Panel · Publishers' Roundtable</li>
                <li>21:00 &nbsp; Closing Party · Roof Deck</li>
              </ul>
            </div>
          </article>
        </section>

        {/* VENUE · BAUAKADEMIE — sticky photo + scrolling content (NOVEL #8) */}
        <section className="border-t-8 border-swiss-black bg-white">
          <div className="px-4 py-8 md:px-12 md:py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-4 border-swiss-black">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-2">— Section · 07</span>
              <h2 className="font-display text-4xl md:text-7xl uppercase leading-none tracking-tighter">Venue · The Bauakademie</h2>
            </div>
            <div className="font-body text-sm md:text-base text-gray-700 max-w-md">
              Schinkel's 1832 brick block reborn. Two stages, one foyer, one roof.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:border-r-2 border-swiss-black bg-swiss-offwhite">
              <div className="lg:sticky lg:top-0 lg:h-screen flex items-stretch">
                <img src="https://images.unsplash.com/photo-1618488373960-404fe668e524?w=1200&q=85&auto=format&fit=crop" alt="Bauakademie portrait — venue" className="w-full h-full object-cover aspect-[3/4] lg:aspect-auto grayscale" />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col">
              <article className="p-6 md:p-12 border-b-2 border-swiss-black">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-3">Fact · 01</span>
                <h3 className="font-serif italic text-3xl md:text-5xl text-swiss-black mb-4 leading-tight">The site · 1832 Schinkel original</h3>
                <p className="font-body text-base md:text-lg leading-relaxed text-gray-700">
                  Karl Friedrich Schinkel finished the original Bauakademie in 1836 as a four-story red-brick block on the Spree, opposite the Berliner Schloss. It housed the Prussian school of building until the war, was damaged in 1945, and demolished by the GDR in 1962 to make room for the Foreign Ministry. For sixty-two years the corner of Werderscher Markt held nothing but a painted-canvas mock-up of the missing facade. The reconstruction we now occupy returns the original footprint to the city, brick for brick, with new floor plates engineered for assembly use.
                </p>
              </article>

              <article className="p-6 md:p-12 border-b-2 border-swiss-black">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-3">Fact · 02</span>
                <h3 className="font-serif italic text-3xl md:text-5xl text-swiss-black mb-4 leading-tight">The reconstruction · 2024 finished</h3>
                <p className="font-body text-base md:text-lg leading-relaxed text-gray-700">
                  The 2024 reconstruction was completed in late September, just three weeks before TYPE_2024 takes possession of the building. The exterior follows Schinkel's drawings to the millimetre, including the terracotta panels above the ground-floor arches. Inside, the building is wholly modern — column-free spans across the Hauptsaal, motorized acoustic baffles in the Studio, twelve-metre projection clearances in the foyer. The conference is the venue's first public-facing programme; everything you experience this week is, technically, a soft launch.
                </p>
              </article>

              <article className="p-6 md:p-12 border-b-2 border-swiss-black">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-3">Fact · 03</span>
                <h3 className="font-serif italic text-3xl md:text-5xl text-swiss-black mb-4 leading-tight">Two stages · Hauptsaal + Studio</h3>
                <p className="font-body text-base md:text-lg leading-relaxed text-gray-700">
                  Programming runs concurrently across two rooms. The Hauptsaal is a 480-seat auditorium with a single-rake floor and a six-metre stage; this is where the keynotes and the major panels run. The Studio, on the second floor, holds 120 seated and is configured in the round for workshops, portfolio reviews, and the late-evening screening programme. A standing-only foyer between the two carries the trade tables, the foundry pop-ups, and the espresso bar. The two rooms are routinely scheduled fifteen minutes apart so attendees can switch tracks.
                </p>
              </article>

              <article className="p-6 md:p-12">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-3">Fact · 04</span>
                <h3 className="font-serif italic text-3xl md:text-5xl text-swiss-black mb-4 leading-tight">Getting there · Spittelmarkt U2</h3>
                <p className="font-body text-base md:text-lg leading-relaxed text-gray-700">
                  The closest station is Spittelmarkt on the U2, four minutes' walk along Werderscher Markt. From Hauptbahnhof the trip is twelve minutes via the U55 with one change at Brandenburger Tor. From Tegel the city express bus runs every nine minutes during conference hours and stops directly outside the Auswärtiges Amt. There is no on-site parking, but the building sits inside Berlin's environmental zone and a Green-Sticker rental is required if you do drive. Bicycle racks are provided for two hundred and seventy bikes along the Spree-side promenade.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* MANIFESTO · WHY TYPE — content only */}
        <section className="border-t-8 border-swiss-black bg-white">
          <div className="px-4 py-8 md:px-12 md:py-12 border-b-4 border-swiss-black">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-2">— Section · 08</span>
            <h2 className="font-display type-clamp uppercase leading-none tracking-tighter text-swiss-black">Why<br />Type</h2>
            <p className="font-serif italic text-2xl md:text-4xl text-swiss-black max-w-4xl mt-6">
              Three doctrines on why typography is not neutral, and why the practitioner cannot be either.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-swiss-black">
            <article className="p-6 md:p-10">
              <span className="block font-display text-7xl md:text-9xl text-swiss-black leading-none mb-6">I</span>
              <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-4">Type is policy</h3>
              <p className="font-body text-base leading-relaxed text-gray-700">
                Every passport, ballot, road sign, vaccine card, and tax form is a typographic decision before it is a legal one. The choice of typeface, leading, and column measure determines who can read the form at all. When a government commissions a body face for its statutes, that face becomes the texture of the law. Conferences like this one are where those choices are debated in public; if the practitioners do not show up, the policy is set by procurement officers picking from a drop-down list of system fonts.
              </p>
            </article>

            <article className="p-6 md:p-10">
              <span className="block font-display text-7xl md:text-9xl text-swiss-orange leading-none mb-6">II</span>
              <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-4">Type is memory</h3>
              <p className="font-body text-base leading-relaxed text-gray-700">
                Letterforms outlive the empires that minted them. Trajan's column carries Roman capitals nineteen centuries after the emperor was buried. The Plantin specimen survives the Spanish occupation of Antwerp. Every revival of Caslon, Bembo, or Garamond is a deliberate civic act — a refusal to let a written tradition lapse. We treat a typeface as a piece of furniture; it is closer to a piece of inherited architecture. The doctrine of TYPE_2024 is that you do not get to design with one without learning what it remembers.
              </p>
            </article>

            <article className="p-6 md:p-10">
              <span className="block font-display text-7xl md:text-9xl text-swiss-black leading-none mb-6">III</span>
              <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-4">Type is power</h3>
              <p className="font-body text-base leading-relaxed text-gray-700">
                The typesetter sets the tempo of the reading. A tighter measure compresses the breath, a heavier weight raises the voice, a wider tracking stretches the silence. To set a paragraph is to conduct it. This is power, and like all power it can be abused — propaganda is set in type, not in plain language. The practitioner's responsibility is to know which lever they are pulling and at what cost. The conference exists because that responsibility is, at present, undertheorised in the discipline.
              </p>
            </article>
          </div>
        </section>

        <section id="tickets" className="bg-swiss-orange text-white py-20 px-4 md:px-12 border-t-8 border-swiss-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-swiss-black text-center text-5xl md:text-9xl mb-12 uppercase tracking-tighter mix-blend-color-burn">
              Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white text-black p-8 border-4 border-black hover:-translate-y-4 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4">Student</div>
                <div className="font-display text-6xl mb-2">€99</div>
                <hr className="border-2 border-black my-6" />
                <ul className="font-body space-y-3 mb-8">
                  <li>● Full Lectures</li>
                  <li>● Digital Swag</li>
                  <li>● Standing Room</li>
                </ul>
                <button className="w-full bg-black text-white py-4 font-display uppercase tracking-widest hover:bg-swiss-orange transition-colors">Select</button>
              </div>
              <div className="bg-black text-white p-8 border-4 border-white hover:-translate-y-4 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] transform md:scale-105 z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-mono text-sm uppercase tracking-widest text-swiss-orange">Professional</div>
                  <div className="bg-swiss-orange text-white text-xs px-2 py-1 uppercase font-bold">Popular</div>
                </div>
                <div className="font-display text-6xl mb-2">€299</div>
                <hr className="border-2 border-white my-6" />
                <ul className="font-body space-y-3 mb-8">
                  <li>● All Access</li>
                  <li>● Workshop Priority</li>
                  <li>● Opening Party</li>
                </ul>
                <button className="w-full bg-white text-black py-4 font-display uppercase tracking-widest hover:bg-swiss-orange hover:text-white transition-colors">Select</button>
              </div>
              <div className="bg-white text-black p-8 border-4 border-black hover:-translate-y-4 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4">Studio (5+)</div>
                <div className="font-display text-6xl mb-2">€999</div>
                <hr className="border-2 border-black my-6" />
                <ul className="font-body space-y-3 mb-8">
                  <li>● Group Seating</li>
                  <li>● Private Mentor</li>
                  <li>● Studio Feature</li>
                </ul>
                <button className="w-full bg-black text-white py-4 font-display uppercase tracking-widest hover:bg-swiss-orange transition-colors">Select</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative bg-white text-swiss-black pt-20 overflow-hidden border-t-8 border-black">
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 pointer-events-none select-none opacity-5">
            <span className="font-serif text-[50vw] leading-none">&</span>
          </div>
          <div className="max-w-screen-2xl mx-auto px-4 md:px-12 pb-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
              <div className="flex flex-col space-y-6">
                <h5 className="font-display text-2xl uppercase">Type_2024</h5>
                <p className="font-serif text-xl italic max-w-xs">
                  "Typography is to literature as musical performance is to composition."
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <h5 className="font-mono text-sm uppercase text-gray-500 tracking-widest border-b-2 border-swiss-orange inline-block w-max pb-1">Venue</h5>
                <address className="font-body not-italic text-lg">
                  Kraftwerk Berlin<br />
                  Köpenicker Str. 70<br />
                  10179 Berlin, DE
                </address>
              </div>
              <div className="flex flex-col space-y-4">
                <h5 className="font-mono text-sm uppercase text-gray-500 tracking-widest border-b-2 border-swiss-orange inline-block w-max pb-1">Social</h5>
                <nav className="flex flex-col space-y-2 font-display uppercase text-lg">
                  <a href="#" className="hover:text-swiss-orange hover:translate-x-2 transition-all">Instagram ↗</a>
                  <a href="#" className="hover:text-swiss-orange hover:translate-x-2 transition-all">Twitter ↗</a>
                  <a href="#" className="hover:text-swiss-orange hover:translate-x-2 transition-all">LinkedIn ↗</a>
                </nav>
              </div>
              <div className="flex flex-col justify-end">
                <form className="space-y-4">
                  <label className="font-mono text-sm uppercase text-gray-500 tracking-widest">Newsletter</label>
                  <div className="flex border-b-4 border-black pb-2">
                    <input type="email" placeholder="ENTER EMAIL" className="bg-transparent w-full font-display uppercase placeholder-gray-400 focus:outline-none text-xl" />
                    <button className="text-swiss-orange text-2xl font-bold hover:scale-110 transition-transform">{">"}</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="border-t-4 border-black pt-6 flex flex-col md:flex-row justify-between items-end md:items-center">
              <div className="font-display uppercase text-[10vw] md:text-[5vw] leading-none tracking-tighter">
                Berlin
              </div>
              <div className="flex gap-8 font-mono text-xs uppercase text-gray-500 mt-4 md:mt-0">
                <span>© 2024 Type Conf</span>
                <a href="#" className="hover:text-black">Privacy</a>
                <a href="#" className="hover:text-black">Imprint</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
