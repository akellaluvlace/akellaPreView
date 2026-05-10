// Module-level data arrays (hoisted, no render-time non-determinism)
const SWISS_INDEX_TILES = [
  { n: "01", name: "Haus am See",    yr: "2025", typ: "RESIDENTIAL · LU", img: "1609924480239-ed5cf2b4b672" },
  { n: "02", name: "Vertex Tower",   yr: "2024", typ: "COMMERCIAL · BS",  img: "1609530142110-7af0a038c723" },
  { n: "03", name: "Gallery X",      yr: "2024", typ: "CULTURAL · GE",    img: "1777661274241-2f636e3534b2" },
  { n: "04", name: "Atelier Nord",   yr: "2024", typ: "STUDIO · ZH",      img: "1618488373960-404fe668e524" },
  { n: "05", name: "Maison Rive",    yr: "2023", typ: "RESIDENTIAL · GE", img: "1502672260266-1c1ef2d93688" },
  { n: "06", name: "Stadtbibliothek",yr: "2023", typ: "CIVIC · BE",       img: "1762215781547-2ac20ed42cd1" },
  { n: "07", name: "Werkhof",        yr: "2023", typ: "INDUSTRIAL · ZH",  img: "1766604106308-58b6d0d676bf" },
  { n: "08", name: "Pavillon Léman", yr: "2022", typ: "PAVILION · VD",    img: "1609924480239-ed5cf2b4b672" },
  { n: "09", name: "Lager 12",       yr: "2022", typ: "ADAPTIVE · ZH",    img: "1609530142110-7af0a038c723" },
  { n: "10", name: "Schule Aspen",   yr: "2021", typ: "EDUCATION · GR",   img: "1777661274241-2f636e3534b2" },
  { n: "11", name: "Höhenweg",       yr: "2021", typ: "RESIDENTIAL · VS", img: "1618488373960-404fe668e524" },
  { n: "12", name: "Kontor Nord",    yr: "2020", typ: "OFFICE · SG",      img: "1502672260266-1c1ef2d93688" },
];

const SWISS_METHOD_STEPS = [
  {
    n: "01",
    title: "Site reading",
    body: "Before any line is drawn we walk the site at three different hours of the day. We measure the angles of incoming light, the prevailing wind, the acoustic footprint of neighbouring buildings, and the manner in which the surrounding street grid concedes to topography. This phase is documented exhaustively in a single bound volume of photographs, hand drawings, weather logs, and verbatim conversations with the eventual user. No design language is committed at this stage. The reading must precede the writing, or the building will simply repeat what was already there.",
  },
  {
    n: "02",
    title: "Programmatic brief",
    body: "From the site reading we draft a programmatic brief in plain prose, never in adjectives. Square metres, sequence of rooms, daily rhythm of the occupants, ratio of public to private hours, plumbing routes, and the maximum distance any inhabitant should ever walk from kitchen to threshold. The brief is reviewed by the client across two long sessions and revised until both parties can recite it from memory. A brief that needs marketing language to defend itself is a brief that has not yet been written. Clarity here erases ninety percent of the later disputes.",
  },
  {
    n: "03",
    title: "Scheme",
    body: "The scheme phase produces three competing parti diagrams, each fitted to the brief without ornament. We prototype them at one-to-two-hundred in basswood and at one-to-fifty in chipboard, and we live with the models for a fortnight. The scheme that survives is rarely the most beautiful at first sight — it is the one whose plan and section can be drawn from memory after a week. From this scheme we generate the structural grid, the envelope, and the principal openings. Materials are not yet specified; only proportion, mass, and circulation.",
  },
  {
    n: "04",
    title: "Construction",
    body: "Construction documentation runs to roughly four hundred sheets for a residential commission and twice that for a public building. Every detail is drawn at one-to-five, every junction is annotated, every fastener is named. We sit on site three days a week through the entire build, in steel-toed boots, and we revise the drawings in pencil when the conditions of the soil, the supplier, or the season require it. A drawing is a hypothesis; the building tests it. Our role is to listen to the test and to remain present until the last bolt is torqued.",
  },
  {
    n: "05",
    title: "Reception",
    body: "After handover we return to the building four times in the first year — once at each season — to measure how the occupants have arranged it, what has worn, what has been repainted, and which corners have been quietly amended by use. These visits inform the next commission far more than any award jury ever will. A building is finished only when the people who live in it stop noticing it, when its presence has dissolved into routine. We document this dissolution with the same care we gave the first site reading. The cycle then repeats.",
  },
];

const SWISS_DOCTRINE = [
  {
    rom: "I",
    red: false,
    a: "Form follows function",
    b: "No idea is exempt",
    body: "The phrase is older than the studio that coined it, but the obligation it places on the practitioner has not aged a day. Every massing, every fenestration, every acoustic decision, every routing of a service must be traceable to a function the building has agreed to perform. Aesthetic preference is not exempt; nostalgia is not exempt; the silhouette of the previous commission is not exempt. We hold every gesture against the brief and we cut what cannot defend itself. The result is rarely surprising and almost never decorative, but it is always honest about what it is.",
  },
  {
    rom: "II",
    red: true,
    a: "The grid is moral",
    b: "Discipline reveals truth",
    body: "A grid is not a stylistic choice. It is a contract between the architect, the builder, the client, and the eventual occupant that promises every dimension on the page can be located, measured, and reasoned about by anyone holding the drawing. Departures from the grid are permitted only when the program demands them and only after the departure has been argued in writing. The discipline appears austere from outside the studio, but inside it produces a continuous accumulation of clarity. The grid does not constrain creativity; it removes the noise against which creativity has to be heard.",
  },
  {
    rom: "III",
    red: false,
    a: "Quiet is loud",
    b: "Restraint is its own language",
    body: "A building that whispers is heard for longer than a building that shouts. We avoid the heroic gesture, the cantilever performed for its own photograph, the material chosen for its press release rather than its weather. The decisions that read as restraint from across the street are usually the decisions that took the longest in the studio: which window to omit, which corner to soften by one millimetre, which threshold to drop by half a step. Restraint is a craft and a vocabulary, not an absence. It is the language we have chosen to speak fluently.",
  },
  {
    rom: "IV",
    red: false,
    a: "Detail is doctrine",
    b: "1:5 and 1:5000 answer to the same logic",
    body: "There is no scale at which the discipline relaxes. The masterplan and the door pull are governed by the same rules of proportion, of material honesty, of programmatic answerability. When a project drifts at the small scale, the large scale will drift later; when the large scale is allowed to swagger, the small scale will be punished by it. We draw at five different scales simultaneously through every phase of every project, and we expect any one drawing, in any one scale, to survive being judged against the others. Coherence is not garnish; it is structure.",
  },
];

export default function T52SwissMinimalist() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />

      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                'swiss-bg': '#F2F2F2',
                'swiss-red': '#DC2626',
                'swiss-black': '#111111',
                'swiss-gray': '#e5e5e5',
              },
              fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Courier New', 'Courier', 'monospace'],
              },
              spacing: { '128': '32rem' },
              transitionDuration: { '400': '400ms' }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body { font-feature-settings: "ss01", "ss02", "case"; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: #DC2626; color: #F2F2F2; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #F2F2F2; }
        ::-webkit-scrollbar-thumb { background: #111111; }
        .text-fluid-h1 { font-size: clamp(3rem, 14vw, 16rem); }
        .text-fluid-h2 { font-size: clamp(2rem, 6vw, 5rem); }
        .img-reveal { filter: grayscale(100%) contrast(110%); transition: filter 0.5s ease-out; }
        .group:hover .img-reveal { filter: grayscale(0%) contrast(100%); }

        /* Index marquee — paused on hover */
        .swiss-marquee-track {
          display: flex;
          gap: 32px;
          width: max-content;
          animation: swiss-marquee-x 80s linear infinite;
        }
        .swiss-marquee-track:hover { animation-play-state: paused; }
        @keyframes swiss-marquee-x {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 16px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .swiss-marquee-track { animation: none; }
        }
      ` }} />

      <div className="bg-swiss-bg text-swiss-black font-sans leading-none">

        <nav className="fixed top-0 left-0 w-full z-50 bg-swiss-bg border-b border-swiss-black/10">
          <div className="grid grid-cols-12 h-16 md:h-20">
            <div className="col-span-6 md:col-span-3 border-r border-swiss-black/10 flex items-center pl-4 md:pl-8">
              <a href="#" className="text-xl md:text-2xl font-black tracking-tighter uppercase hover:text-swiss-red transition-colors duration-400">
                MODUL<span className="text-swiss-red">.</span>
              </a>
            </div>
            <div className="hidden md:flex col-span-6 justify-between items-center px-8 border-r border-swiss-black/10 text-xs font-bold uppercase tracking-widest">
              <div className="flex gap-8">
                <a href="#work" className="hover:text-swiss-red transition-colors">Projects</a>
                <a href="#process" className="hover:text-swiss-red transition-colors">Process</a>
                <a href="#studio" className="hover:text-swiss-red transition-colors">Studio</a>
                <a href="#news" className="hover:text-swiss-red transition-colors">Journal</a>
              </div>
            </div>
            <div className="col-span-6 md:col-span-3 flex items-center justify-end pr-4 md:pr-8">
              <a href="#contact" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-swiss-red transition-colors">
                <span className="hidden md:inline">Get in touch</span>
                <i data-lucide="plus" className="w-4 h-4 text-swiss-red"></i>
              </a>
            </div>
          </div>
        </nav>

        <header className="relative pt-20 md:pt-32 min-h-screen flex flex-col justify-between border-b border-swiss-black/10 overflow-hidden">
          <div className="grid grid-cols-12 px-4 md:px-0 h-full">
            <div className="col-span-12 md:col-span-10 md:col-start-2 md:border-x border-swiss-black/10 md:p-8 flex flex-col justify-center">
              <h1 className="text-fluid-h1 font-black tracking-tighter leading-[0.85] uppercase mb-8">
                Form<br />
                <span className="pl-[10vw] md:pl-[12vw]">Follows</span><br />
                <span className="text-swiss-red">Function</span>
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-12 border-t border-swiss-black/10">
            <div className="col-span-6 md:col-span-3 border-r border-swiss-black/10 p-4 md:p-6">
              <span className="block text-xs font-mono text-gray-500 mb-1">LOCATION</span>
              <span className="text-sm font-bold uppercase">Zurich, CH</span>
            </div>
            <div className="col-span-6 md:col-span-3 md:border-r border-swiss-black/10 p-4 md:p-6">
              <span className="block text-xs font-mono text-gray-500 mb-1">ESTABLISHED</span>
              <span className="text-sm font-bold uppercase">2018</span>
            </div>
            <div className="hidden md:block col-span-3 border-r border-swiss-black/10 p-4 md:p-6">
              <span className="block text-xs font-mono text-gray-500 mb-1">SPECIALTY</span>
              <span className="text-sm font-bold uppercase">Brutalist / Minimal</span>
            </div>
            <div className="col-span-12 md:col-span-3 bg-swiss-black text-white flex items-center justify-between p-4 md:p-6 cursor-pointer hover:bg-swiss-red transition-colors duration-400 group">
              <span className="text-sm font-bold uppercase">View Showreel</span>
              <i data-lucide="play" className="w-4 h-4 fill-white group-hover:fill-white"></i>
            </div>
          </div>
        </header>

        <main>
          <section id="work" className="border-b border-swiss-black/10">
            <div className="grid grid-cols-12 border-b border-swiss-black/10">
              <div className="col-span-12 md:col-span-2 p-4 md:p-6 border-r border-swiss-black/10">
                <span className="font-mono text-xs text-swiss-red">01 / PROJECTS</span>
              </div>
              <div className="col-span-12 md:col-span-10 p-4 md:p-6">
                <h2 className="text-xl md:text-3xl font-medium tracking-tight">Selected Works 2020—2025</h2>
              </div>
            </div>

            <article className="group grid grid-cols-12 border-b border-swiss-black/10">
              <div className="col-span-12 md:col-span-5 p-6 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-swiss-black/10 bg-swiss-bg relative overflow-hidden">
                <div className="z-10">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-xs font-mono px-2 py-1 border border-swiss-black rounded-full">RESIDENTIAL</span>
                    <span className="text-xs font-mono text-gray-500">LUCERNE</span>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6 group-hover:translate-x-2 transition-transform duration-500">
                    Haus <br />Am See
                  </h3>
                  <p className="text-sm md:text-base max-w-sm leading-relaxed text-gray-700">
                    A raw concrete volume embedded into the lakeside slope. The facade features expansive glazing to capture the Alpine panorama, while the interior maintains a monochromatic palette.
                  </p>
                </div>
                <div className="mt-12 md:mt-0 z-10">
                  <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase border-b border-swiss-black pb-1 hover:text-swiss-red hover:border-swiss-red transition-colors">
                    Case Study <i data-lucide="arrow-right" className="w-4 h-4"></i>
                  </a>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 h-[60vh] md:h-[90vh] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2574&auto=format&fit=crop" alt="Concrete House" className="w-full h-full object-cover img-reveal transform group-hover:scale-105 transition-transform duration-700" />
              </div>
            </article>

            <article className="group grid grid-cols-12 border-b border-swiss-black/10">
              <div className="order-2 md:order-1 col-span-12 md:col-span-7 h-[60vh] md:h-[90vh] overflow-hidden border-r border-swiss-black/10">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop" alt="Office Tower" className="w-full h-full object-cover img-reveal transform group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="order-1 md:order-2 col-span-12 md:col-span-5 p-6 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-xs font-mono px-2 py-1 border border-swiss-black rounded-full">COMMERCIAL</span>
                    <span className="text-xs font-mono text-gray-500">BASEL</span>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6 group-hover:translate-x-2 transition-transform duration-500">
                    Vertex<br />Tower
                  </h3>
                  <p className="text-sm md:text-base max-w-sm leading-relaxed text-gray-700">
                    Redefining the corporate vertical. A structural exoskeleton allows for column-free interior floorplates. The building acts as a mirror to the surrounding industrial district.
                  </p>
                </div>
                <div className="mt-12 md:mt-0">
                  <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase border-b border-swiss-black pb-1 hover:text-swiss-red hover:border-swiss-red transition-colors">
                    Case Study <i data-lucide="arrow-right" className="w-4 h-4"></i>
                  </a>
                </div>
              </div>
            </article>

            <article className="group grid grid-cols-12">
              <div className="col-span-12 md:col-span-5 p-6 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-swiss-black/10">
                <div>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-xs font-mono px-2 py-1 border border-swiss-black rounded-full">CULTURAL</span>
                    <span className="text-xs font-mono text-gray-500">GENEVA</span>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6 group-hover:translate-x-2 transition-transform duration-500">
                    Gallery <br />X
                  </h3>
                  <p className="text-sm md:text-base max-w-sm leading-relaxed text-gray-700">
                    A minimalist exhibition space designed to disappear. Indirect top-lighting systems provide shadowless illumination for sculptures.
                  </p>
                </div>
                <div className="mt-12 md:mt-0">
                  <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase border-b border-swiss-black pb-1 hover:text-swiss-red hover:border-swiss-red transition-colors">
                    Case Study <i data-lucide="arrow-right" className="w-4 h-4"></i>
                  </a>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 h-[60vh] md:h-[90vh] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=2670&auto=format&fit=crop" alt="Museum Interior" className="w-full h-full object-cover img-reveal transform group-hover:scale-105 transition-transform duration-700" />
              </div>
            </article>
          </section>

          <section id="process" className="bg-swiss-bg border-b border-swiss-black/10">
            <div className="grid grid-cols-12 border-b border-swiss-black/10">
              <div className="col-span-12 md:col-span-2 p-4 md:p-6 border-r border-swiss-black/10">
                <span className="font-mono text-xs text-swiss-red">02 / PROCESS</span>
              </div>
              <div className="col-span-12 md:col-span-10 p-4 md:p-6">
                <h2 className="text-xl md:text-3xl font-medium tracking-tight">Capabilities</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="p-8 border-b md:border-b-0 border-r border-swiss-black/10 hover:bg-white transition-colors duration-300 min-h-[300px] flex flex-col justify-between">
                <i data-lucide="pen-tool" className="w-8 h-8 text-swiss-red mb-4"></i>
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2">Architecture</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Full scale architectural planning from concept to execution. We focus on structural honesty.</p>
                </div>
              </div>
              <div className="p-8 border-b md:border-b-0 border-r border-swiss-black/10 hover:bg-white transition-colors duration-300 min-h-[300px] flex flex-col justify-between">
                <i data-lucide="layers" className="w-8 h-8 text-swiss-red mb-4"></i>
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2">Interior</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Spatial design that complements the architectural shell. Bespoke furniture and lighting.</p>
                </div>
              </div>
              <div className="p-8 border-b md:border-b-0 border-r border-swiss-black/10 hover:bg-white transition-colors duration-300 min-h-[300px] flex flex-col justify-between">
                <i data-lucide="map" className="w-8 h-8 text-swiss-red mb-4"></i>
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2">Urbanism</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Master planning for complex environments. Integrating buildings into the city fabric.</p>
                </div>
              </div>
              <div className="p-8 hover:bg-white transition-colors duration-300 min-h-[300px] flex flex-col justify-between">
                <i data-lucide="box" className="w-8 h-8 text-swiss-red mb-4"></i>
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2">Research</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Material studies and sustainable technology integration. Forward thinking.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="studio" className="bg-swiss-red text-white selection:bg-white selection:text-swiss-red">
            <div className="grid grid-cols-12">
              <div className="col-span-1 md:col-span-1 border-r border-white/20 hidden md:block"></div>
              <div className="col-span-12 md:col-span-10 p-8 md:p-24 md:border-r border-white/20">
                <span className="block text-sm font-mono uppercase mb-12 border-b border-white/40 pb-2 w-max">The Manifesto</span>
                <p className="text-3xl md:text-5xl lg:text-7xl font-bold leading-[0.9] tracking-tighter uppercase mb-16">
                  We reject ornamentation.<br />
                  <span className="opacity-70">We believe space is defined by light, proportion, and materiality.</span><br />
                  Architecture is not art;<br />
                  it is a strict discipline of solving problems through geometry.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-sm font-mono border-t border-white/40 pt-12">
                  <div>
                    <h4 className="font-bold border-b border-white/40 mb-2 pb-1">01. SIMPLICITY</h4>
                    <p className="opacity-80">Reduction to the absolute essential.</p>
                  </div>
                  <div>
                    <h4 className="font-bold border-b border-white/40 mb-2 pb-1">02. GEOMETRY</h4>
                    <p className="opacity-80">Mathematical purity in every line.</p>
                  </div>
                  <div>
                    <h4 className="font-bold border-b border-white/40 mb-2 pb-1">03. UTILITY</h4>
                    <p className="opacity-80">Function always dictates form.</p>
                  </div>
                  <div>
                    <h4 className="font-bold border-b border-white/40 mb-2 pb-1">04. TRUTH</h4>
                    <p className="opacity-80">Honesty in materials and structure.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-swiss-black/10">
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-2 p-4 md:p-6 border-r border-swiss-black/10 border-b md:border-b-0">
                <span className="font-mono text-xs text-swiss-red">03 / TEAM</span>
              </div>
              <div className="col-span-12 md:col-span-10 grid grid-cols-2 md:grid-cols-4">
                <div className="border-r border-b md:border-b-0 border-swiss-black/10 p-6 group hover:bg-white transition-colors">
                  <div className="w-full aspect-square bg-gray-200 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Portrait" />
                  </div>
                  <h4 className="font-bold uppercase text-sm">J. Meier</h4>
                  <span className="text-xs font-mono text-gray-500">Principal</span>
                </div>
                <div className="border-r border-b md:border-b-0 border-swiss-black/10 p-6 group hover:bg-white transition-colors">
                  <div className="w-full aspect-square bg-gray-200 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Portrait" />
                  </div>
                  <h4 className="font-bold uppercase text-sm">E. Rossi</h4>
                  <span className="text-xs font-mono text-gray-500">Partner</span>
                </div>
                <div className="border-r border-b md:border-b-0 border-swiss-black/10 p-6 group hover:bg-white transition-colors">
                  <div className="w-full aspect-square bg-gray-200 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Portrait" />
                  </div>
                  <h4 className="font-bold uppercase text-sm">L. Weber</h4>
                  <span className="text-xs font-mono text-gray-500">Senior Architect</span>
                </div>
                <div className="p-6 flex flex-col justify-center items-center text-center hover:bg-swiss-black hover:text-white transition-colors cursor-pointer group">
                  <div className="w-12 h-12 border border-current rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="plus" className="w-6 h-6"></i>
                  </div>
                  <h4 className="font-bold uppercase text-sm">Join the Team</h4>
                  <span className="text-xs font-mono opacity-60">Zurich Office</span>
                </div>
              </div>
            </div>
          </section>

          {/* Project Index Marquee (04) — Selected projects, 12 commissions */}
          <section id="index" className="border-b border-swiss-black/10 bg-swiss-bg">
            <div className="grid grid-cols-12 border-b border-swiss-black/10">
              <div className="col-span-12 md:col-span-2 p-4 md:p-6 border-r border-swiss-black/10">
                <span className="font-mono text-xs text-swiss-red">04 / INDEX</span>
              </div>
              <div className="col-span-12 md:col-span-8 p-4 md:p-6 md:border-r border-swiss-black/10">
                <h2 className="text-xl md:text-3xl font-medium tracking-tight">Selected projects — 12 commissions</h2>
              </div>
              <div className="hidden md:flex col-span-2 p-4 md:p-6 items-center justify-end">
                <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">Hover to pause</span>
              </div>
            </div>

            <div className="overflow-hidden border-b border-swiss-black/10 py-12 md:py-16">
              <div className="swiss-marquee-track">
                {SWISS_INDEX_TILES.map((t, i) => (
                  <article key={`a-${i}`} className="w-56 md:w-64 shrink-0">
                    <div className="aspect-[4/5] overflow-hidden border border-swiss-black/10">
                      <img src={`https://images.unsplash.com/photo-${t.img}?w=900&q=85&auto=format&fit=crop`} alt={`Project ${t.n}`} loading="lazy" className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="pt-4 flex items-baseline gap-3">
                      <span className="text-3xl font-black tracking-tighter">{t.n}</span>
                      <span className="text-sm font-medium tracking-tight">{t.name}</span>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-gray-500">
                      <span>{t.yr}</span>
                      <span className="w-1 h-1 rounded-full bg-swiss-red"></span>
                      <span>{t.typ}</span>
                    </div>
                  </article>
                ))}
                {SWISS_INDEX_TILES.map((t, i) => (
                  <article key={`b-${i}`} aria-hidden="true" className="w-56 md:w-64 shrink-0">
                    <div className="aspect-[4/5] overflow-hidden border border-swiss-black/10">
                      <img src={`https://images.unsplash.com/photo-${t.img}?w=900&q=85&auto=format&fit=crop`} alt="" loading="lazy" className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="pt-4 flex items-baseline gap-3">
                      <span className="text-3xl font-black tracking-tighter">{t.n}</span>
                      <span className="text-sm font-medium tracking-tight">{t.name}</span>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-gray-500">
                      <span>{t.yr}</span>
                      <span className="w-1 h-1 rounded-full bg-swiss-red"></span>
                      <span>{t.typ}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Method (05) — sticky-photo + scrolling text (NOVEL #8) */}
          <section id="method" className="border-b border-swiss-black/10">
            <div className="grid grid-cols-12 border-b border-swiss-black/10">
              <div className="col-span-12 md:col-span-2 p-4 md:p-6 border-r border-swiss-black/10">
                <span className="font-mono text-xs text-swiss-red">05 / METHOD</span>
              </div>
              <div className="col-span-12 md:col-span-10 p-4 md:p-6">
                <h2 className="text-xl md:text-3xl font-medium tracking-tight">Process — five movements from site to reception</h2>
              </div>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-6 md:border-r border-swiss-black/10 relative">
                <div className="md:sticky md:top-20 md:self-start">
                  <div className="aspect-[4/5] md:aspect-auto md:h-[calc(100vh-5rem)] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1600&q=85&auto=format&fit=crop"
                         alt="Architectural facade detail"
                         loading="lazy"
                         className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="hidden md:flex items-center justify-between p-6 border-t border-swiss-black/10">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">Plate · I — Stadtbibliothek, BE</span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">1:50</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                {SWISS_METHOD_STEPS.map((s, i) => (
                  <article key={i} className={`grid grid-cols-12 ${i < SWISS_METHOD_STEPS.length - 1 ? "border-b border-swiss-black/10" : ""}`}>
                    <div className="col-span-12 md:col-span-3 p-6 md:p-8 md:border-r border-swiss-black/10">
                      <span className="block text-[11px] font-mono uppercase tracking-widest text-gray-500 mb-2">Movement</span>
                      <span className="text-2xl font-bold tracking-tighter">{s.n}</span>
                    </div>
                    <div className="col-span-12 md:col-span-9 p-6 md:p-8 border-t md:border-t-0 border-swiss-black/10">
                      <h3 className="text-xl md:text-2xl font-semibold tracking-tight uppercase mb-4">{s.title}</h3>
                      <p className="text-sm md:text-base leading-relaxed text-gray-700">{s.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Doctrine (06) — 4-column manifesto principles, no image */}
          <section id="doctrine" className="bg-swiss-gray border-b border-swiss-black/10">
            <div className="grid grid-cols-12 border-b border-swiss-black/40">
              <div className="col-span-12 md:col-span-2 p-4 md:p-6 border-r border-swiss-black/40">
                <span className="font-mono text-xs text-swiss-red">06 / DOCTRINE</span>
              </div>
              <div className="col-span-12 md:col-span-10 p-4 md:p-6">
                <h2 className="text-xl md:text-3xl font-medium tracking-tight">Four principles that govern the studio</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4">
              {SWISS_DOCTRINE.map((p, i) => (
                <article key={i} className={`p-8 md:p-10 flex flex-col ${i < SWISS_DOCTRINE.length - 1 ? "border-b md:border-b-0 md:border-r border-swiss-black/40" : ""}`}>
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-gray-600 mb-6">Principle</span>
                  <span className={`text-7xl md:text-8xl font-black tracking-tighter leading-none mb-8 ${p.red ? "text-swiss-red" : ""}`}>{p.rom}</span>
                  <h3 className="text-base md:text-lg font-bold uppercase tracking-tight mb-4 leading-tight">
                    {p.a}<br />
                    <span className="text-gray-700 font-medium normal-case">{p.b}</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700">{p.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="news" className="bg-swiss-bg">
            <div className="grid grid-cols-12 border-b border-swiss-black/10">
              <div className="col-span-12 md:col-span-2 p-4 md:p-6 border-r border-swiss-black/10">
                <span className="font-mono text-xs text-swiss-red">07 / JOURNAL</span>
              </div>
              <div className="col-span-12 md:col-span-10">
                <div className="group grid grid-cols-1 md:grid-cols-12 border-b border-swiss-black/10 hover:bg-white transition-colors cursor-pointer">
                  <div className="md:col-span-2 p-4 md:p-6 border-b md:border-b-0 md:border-r border-swiss-black/10">
                    <span className="text-xs font-mono text-gray-500">22.10.2025</span>
                  </div>
                  <div className="md:col-span-8 p-4 md:p-6 border-b md:border-b-0 md:border-r border-swiss-black/10">
                    <h4 className="text-xl font-bold uppercase mb-2 group-hover:text-swiss-red transition-colors">Architecture Prize 2025</h4>
                    <p className="text-sm text-gray-600">MODUL awarded for the Zurich Kunsthaus extension proposal.</p>
                  </div>
                  <div className="md:col-span-2 p-4 md:p-6 flex items-center justify-end">
                    <i data-lucide="arrow-up-right" className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                </div>
                <div className="group grid grid-cols-1 md:grid-cols-12 border-b border-swiss-black/10 hover:bg-white transition-colors cursor-pointer">
                  <div className="md:col-span-2 p-4 md:p-6 border-b md:border-b-0 md:border-r border-swiss-black/10">
                    <span className="text-xs font-mono text-gray-500">14.09.2025</span>
                  </div>
                  <div className="md:col-span-8 p-4 md:p-6 border-b md:border-b-0 md:border-r border-swiss-black/10">
                    <h4 className="text-xl font-bold uppercase mb-2 group-hover:text-swiss-red transition-colors">Lecture at ETH</h4>
                    <p className="text-sm text-gray-600">Principal Meier discusses 'The Death of Ornament' at ETH Zurich.</p>
                  </div>
                  <div className="md:col-span-2 p-4 md:p-6 flex items-center justify-end">
                    <i data-lucide="arrow-up-right" className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                </div>
                <div className="group grid grid-cols-1 md:grid-cols-12 hover:bg-white transition-colors cursor-pointer">
                  <div className="md:col-span-2 p-4 md:p-6 border-b md:border-b-0 md:border-r border-swiss-black/10">
                    <span className="text-xs font-mono text-gray-500">01.08.2025</span>
                  </div>
                  <div className="md:col-span-8 p-4 md:p-6 border-b md:border-b-0 md:border-r border-swiss-black/10">
                    <h4 className="text-xl font-bold uppercase mb-2 group-hover:text-swiss-red transition-colors">Monograph Release</h4>
                    <p className="text-sm text-gray-600">Our first 5 years of practice documented in a new hardcover book.</p>
                  </div>
                  <div className="md:col-span-2 p-4 md:p-6 flex items-center justify-end">
                    <i data-lucide="arrow-up-right" className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer id="contact" className="bg-swiss-black text-swiss-bg pt-16 border-t border-swiss-black">
          <div className="grid grid-cols-12 border-b border-swiss-bg/20 pb-16">
            <div className="col-span-12 md:col-span-4 p-8 border-r border-swiss-bg/20">
              <h5 className="text-xs font-mono uppercase text-gray-500 mb-8">Office</h5>
              <address className="not-italic text-lg md:text-xl font-medium leading-tight">
                MODUL Architekten<br />
                Langstrasse 200<br />
                8005 Zürich<br />
                Switzerland
              </address>
            </div>
            <div className="col-span-12 md:col-span-4 p-8 border-r border-swiss-bg/20">
              <h5 className="text-xs font-mono uppercase text-gray-500 mb-8">Contact</h5>
              <ul className="text-lg md:text-xl font-medium leading-tight space-y-2">
                <li><a href="mailto:hello@modul.ch" className="hover:text-swiss-red transition-colors">hello@modul.ch</a></li>
                <li><a href="tel:+41440000000" className="hover:text-swiss-red transition-colors">+41 44 000 00 00</a></li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-4 p-8">
              <h5 className="text-xs font-mono uppercase text-gray-500 mb-8">Connect</h5>
              <ul className="text-lg md:text-xl font-medium leading-tight space-y-2">
                <li><a href="#" className="hover:text-swiss-red transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-swiss-red transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-swiss-red transition-colors">ArchDaily</a></li>
              </ul>
            </div>
          </div>
          <div className="px-4 md:px-8 pt-4 flex flex-col md:flex-row justify-between items-end pb-4">
            <p className="text-xs font-mono text-gray-500 mb-4 md:mb-2">© 2025 MODUL Architekten. All rights reserved.</p>
            <h2 className="text-[18vw] leading-[0.75] font-black tracking-tighter text-swiss-bg select-none -mb-[1vw]">MODUL</h2>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function init(){
          if (typeof lucide !== 'undefined' && lucide.createIcons) { lucide.createIcons(); return; }
          setTimeout(init, 50);
        })();
      ` }} />
    </>
  );
}
