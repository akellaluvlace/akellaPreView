export default function T61BrutalismRaw() {
  const navItems = [
    "[00_Index]",
    "[01_Install]",
    "[02_Structure]",
    "[03_Modules]",
    "[04_Legacy]",
    "[05_Help]",
  ];

  const sysInfo = [
    { k: "BUILD:", v: "#492A", bold: true },
    { k: "SIZE:", v: "402KB" },
    { k: "LICENSE:", v: "MIT" },
    { k: "AUTHOR:", v: "@ROOT" },
  ];

  const docs = [
    { n: "01", title: "Getting Started", desc: "Essential setup instructions for Linux and BSD environments. Includes dependency mapping and compilation flags." },
    { n: "02", title: "Core Concepts", desc: 'Understanding the directory structure, immutable data patterns, and the "Raw Text" philosophy.' },
    { n: "03", title: "API Reference", desc: "Complete list of endpoints, response codes, and error handling protocols." },
    { n: "04", title: "CLI Tools", desc: "Command line arguments for batch processing and automated documentation generation." },
    { n: "05", title: "Plugins", desc: "Community extensions for syntax highlighting, PDF export, and LaTeX conversion." },
    { n: "06", title: "Troubleshoot", desc: "Common segmentation faults, memory leaks, and how to report bugs to the maintainers." },
  ];

  const sysReqRows = [
    { component: "Processor", min: "x86 300MHz", rec: "x64 1GHz" },
    { component: "Memory", min: "64MB RAM", rec: "512MB RAM" },
    { component: "Storage", min: "10MB HDD", rec: "SSD" },
    { component: "OS", min: "Linux 2.4+", rec: "Linux 5.0+" },
  ];

  const changelog = [
    { date: "[10-22]", entry: "Refactored grid logic for mobile viewports." },
    { date: "[10-20]", entry: "Removed decorative CSS. Added Times New Roman." },
    { date: "[10-15]", entry: "Fixed memory leak in parser.c" },
    { date: "[10-01]", entry: "Initial stable release." },
  ];

  const mirrors = ["US_East (Virginia)", "EU_West (Dublin)", "Asia_Pacific (Tokyo)", "FTP Archive (Slow)"];

  const footerCols = [
    { title: "PROJECT", links: ["About", "Manifesto", "Sponsors"] },
    { title: "LEGAL", links: ["Privacy", "Terms", "License"] },
  ];

  const headlineStats = [
    { label: "DOWNLOADS", value: "128,442", sub: "+1.4k · 24h", accent: true },
    { label: "CONTRIBUTORS", value: "47", sub: "across 11 nations" },
    { label: "LAST_BUILD", value: "04:18:22", sub: "UTC · today" },
    { label: "STARS", value: "★ 12.4k", sub: "forks · 892" }
  ];

  const plates = [
    { id: "PLATE_001", file: "circuit.jpg", desc: "[ TRACES // 320×320 ]", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop", alt: "Macro photograph of a green circuit board", filter: "grayscale contrast-125 brightness-90" },
    { id: "PLATE_002", file: "form.jpg", desc: "[ CONCRETE // FACADE ]", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=85&auto=format&fit=crop", alt: "Brutalist concrete architectural facade", filter: "grayscale contrast-125 brightness-95" },
    { id: "PLATE_003", file: "rack_42u.jpg", desc: "[ MIRROR // EU_WEST ]", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=85&auto=format&fit=crop", alt: "Server rack with status LEDs", filter: "grayscale contrast-125 brightness-90" },
    { id: "PLATE_004", file: "spec.jpg", desc: "[ ANNOTATED // V1.0 ]", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=85&auto=format&fit=crop", alt: "Technical drafting drawings on graph paper", filter: "grayscale contrast-125 brightness-95" }
  ];

  const tenets = [
    { n: "01", title: "No JavaScript.", body: "If a feature requires JS to be readable, it is not a feature. It is a regression." },
    { n: "02", title: "No Cookies.", body: "Reading should not require an exchange of identity. The reader is anonymous, by default." },
    { n: "03", title: "No Tracking.", body: "We do not measure what we do not need to know. The server log records 200s and 404s. Nothing more." },
    { n: "04", title: "Print Tested.", body: "Every page renders cleanly on A4 / Letter. The web should also live on paper." },
    { n: "05", title: "Public Domain by Default.", body: "Documentation belongs to the people who read and write it. Not to a vendor." }
  ];

  const contributors = [
    { initials: "@R", bg: "bg-web-blue", color: "text-white", name: "@ROOT", role: "Maintainer · since 1999", count: "1,284" },
    { initials: "MK", bg: "bg-web-purple", color: "text-white", name: "Maya K.", role: "Core · parser.c lead", count: "412" },
    { initials: "HN", bg: "bg-black", color: "text-white", name: "Hiroshi N.", role: "i18n · 7 locales", count: "298" },
    { initials: "EB", bg: "bg-alert-yellow", color: "text-black", name: "Eimear B.", role: "CLI tools", count: "187" }
  ];

  const configJson = `{
  "site_name": "MANUAL_v1",
  "render_engine": "raw_html",
  "cache_duration": 3600,
  "features": {
    "javascript": false,
    "images": false
  }
}`;

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    colors: {
      'win-gray': '#C0C0C0',
      'web-blue': '#0000EE',
      'web-purple': '#551A8B',
      'alert-yellow': '#FFFF00',
    },
    fontFamily: {
      serif: ['"Times New Roman"','Times','serif'],
      mono: ['"Courier New"','Courier','monospace'],
      sans: ['Arial','Helvetica','sans-serif'],
    }
  } }
};`;

  const customCss = `body { background-color: #555555; color: #000000; }
a { text-decoration: underline; color: #0000EE; cursor: pointer; }
a:visited { color: #551A8B; }
a:hover { background-color: #0000EE; color: #FFFFFF; text-decoration: none; }
a:active { color: #FF0000; }
.win95-border { border: 2px solid; border-color: #FFFFFF #808080 #808080 #FFFFFF; background-color: #C0C0C0; }
.btn-brutal {
  background-color: #C0C0C0;
  border-top: 2px solid #FFFFFF;
  border-left: 2px solid #FFFFFF;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  display: inline-block;
  text-decoration: none;
  color: black !important;
  cursor: pointer;
}
.btn-brutal:active {
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  border-right: 2px solid #FFFFFF;
  border-bottom: 2px solid #FFFFFF;
  transform: translateY(1px);
}
hr { border: 0; border-top: 2px solid #000000; margin: 0; height: 0; }
::-webkit-scrollbar { width: 14px; height: 14px; }
::-webkit-scrollbar-track { background: #e0e0e0; border: 1px solid black; }
::-webkit-scrollbar-thumb { background: #C0C0C0; border: 1px solid black; box-shadow: inset 1px 1px white, inset -1px -1px gray; }
.hatch-pattern {
  background-image: linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000);
  background-size: 4px 4px;
  background-position: 0 0, 2px 2px;
  opacity: 0.1;
}
.list-square { list-style-type: square; }
.manifesto-frame { view-timeline-name: --manifesto; view-timeline-axis: block; }
.scroll-invert-container {
  animation: container-negative linear both;
  animation-timeline: --manifesto;
  animation-range: cover 15% cover 95%;
  will-change: filter;
}
@keyframes container-negative {
  0%   { filter: none; }
  45%  { filter: none; }
  55%  { filter: invert(1) hue-rotate(180deg); }
  100% { filter: invert(1) hue-rotate(180deg); }
}
@media (prefers-reduced-motion: reduce) {
  .scroll-invert-container { animation: none; }
}
.file-header-img { filter: grayscale(1) contrast(1.4) brightness(1.05); }`;

  const initScript = `function updateTime(){
  var now = new Date();
  var timeString = now.toLocaleTimeString('en-US', { hour12: false });
  var dateString = now.toISOString().split('T')[0];
  var el = document.getElementById('clock');
  if (el) el.innerText = dateString + ' ' + timeString;
}
setInterval(updateTime, 1000);
updateTime();`;

  return (
    <>
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="font-serif text-base leading-snug antialiased min-h-screen flex flex-col items-center py-0 md:py-8">
        <div className="w-full max-w-[1024px] bg-white border-x-0 md:border-x-2 border-black min-h-screen shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">

          <header>
            <div className="bg-win-gray border-b-2 border-black p-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-web-blue flex items-center justify-center text-white font-bold border-2 border-black">M</div>
                <div>
                  <h1 className="font-sans font-black text-3xl md:text-4xl tracking-tighter uppercase leading-none">MANUAL_v1</h1>
                  <span className="font-mono text-xs uppercase text-gray-600">Documentation Standard 1.0.4</span>
                </div>
              </div>
              <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-4 font-mono text-xs">
                <span className="hidden md:inline">SERVER_TIME:</span>
                <div id="clock" className="border-2 border-black bg-white px-2 py-1">Loading...</div>
              </div>
            </div>

            <hr />

            <nav className="bg-white p-2 border-b-2 border-black">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm font-bold uppercase list-none">
                {navItems.map(n => (
                  <li key={n}><a href="#">{n}</a></li>
                ))}
              </ul>
            </nav>
          </header>

          <div className="bg-alert-yellow border-b-2 border-black p-2 flex items-start gap-3">
            <span className="font-bold font-mono text-xl select-none">(!)</span>
            <p className="font-sans text-sm font-bold">
              NOTICE: API v0.9 is deprecated as of 2023-11-01. Please migrate all endpoints to v1.0 immediately to avoid data loss.
            </p>
          </div>

          <section className="border-b-2 border-black grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-9 p-4 md:p-8 flex flex-col justify-center">
              <h2 className="font-serif text-5xl md:text-7xl font-bold uppercase leading-[0.9] mb-6">
                Read the<br />Manual.
              </h2>
              <p className="font-serif text-lg md:text-xl max-w-2xl mb-6">
                A raw, anti-fragile documentation framework for the post-aesthetic web.
                No JavaScript required. No cookies. No tracking. Just data in its purest form.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <a href="#" className="btn-brutal px-6 py-2 font-mono text-sm uppercase font-bold">Download .TAR.GZ</a>
                <a href="#" className="font-mono text-sm self-center hover:bg-black hover:text-white px-1">{"> View Source Code"}</a>
              </div>
            </div>

            <div className="lg:col-span-3 border-t-2 lg:border-t-0 lg:border-l-2 border-black bg-gray-100 flex flex-col">
              <div className="p-2 bg-black text-white font-mono text-xs font-bold uppercase">/SYS/INFO</div>
              <div className="p-3 font-mono text-xs flex-grow">
                <ul className="space-y-2">
                  {sysInfo.map(i => (
                    <li key={i.k} className="flex justify-between">
                      <span>{i.k}</span>
                      <span className={i.bold ? "font-bold" : ""}>{i.v}</span>
                    </li>
                  ))}
                </ul>
                <hr className="border-gray-400 my-3" />
                <div className="text-[10px] leading-tight text-gray-600">HASH: e4d909c290d0fb1ca068ffaddf22cbd0</div>
              </div>
              <div className="h-24 border-t-2 border-black hatch-pattern relative">
                <span className="absolute bottom-1 right-1 font-mono text-[10px] bg-white px-1 border border-black">NO_IMG</span>
              </div>
            </div>
          </section>

          {/* STATS STRIP */}
          <section className="bg-black text-white border-b-2 border-black grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-gray-700">
            {headlineStats.map(s => (
              <div key={s.label} className="p-4 md:p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">{s.label}</div>
                <div className={`font-sans font-black text-2xl md:text-4xl tabular-nums leading-none ${s.accent ? "text-alert-yellow" : ""}`}>{s.value}</div>
                <div className="font-mono text-[10px] text-gray-500 mt-2">{s.sub}</div>
              </div>
            ))}
          </section>

          <main className="flex-grow bg-gray-100">
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_A</span>
                Documentation Library
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-black border-b-2 border-black">
              {docs.map(d => (
                <div key={d.n} className="bg-white p-4 h-full flex flex-col relative group">
                  <div className="absolute top-2 right-2 font-mono text-xs text-gray-400">{d.n}</div>
                  <h4 className="font-bold text-lg mb-2 underline decoration-2">{d.title}</h4>
                  <p className="text-sm font-serif mb-4 flex-grow">{d.desc}</p>
                  <a href="#" className="font-mono text-xs uppercase block bg-gray-100 p-1 border border-black text-center hover:bg-black hover:text-white">{"Open File ->"}</a>
                </div>
              ))}
            </div>

            {/* SEC_B Visual Reference / Plates */}
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_B</span>
                Visual Reference
              </h3>
            </div>
            <div className="bg-win-gray border-b-2 border-black p-4 md:p-6">
              <p className="font-mono text-xs mb-4 text-gray-700">/REF/PLATES/ — image manifest, 4 of 24. ASCII alt-text below each frame.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {plates.map(p => (
                  <figure key={p.id} className="win95-border p-2">
                    <div className="aspect-square overflow-hidden border-2 border-black bg-black relative">
                      <img src={p.img} alt={p.alt} className={`w-full h-full object-cover ${p.filter}`} />
                      <span className="absolute top-1 left-1 bg-alert-yellow text-black font-mono font-bold text-[9px] px-1 border border-black">{p.id}</span>
                    </div>
                    <figcaption className="font-mono text-[10px] mt-2 leading-tight">
                      <span className="font-bold">{p.file}</span><br />
                      <span className="text-gray-600">{p.desc}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-black flex flex-col md:flex-row justify-between gap-2 font-mono text-[10px]">
                <span>// IMG_FORMAT=JPG · COMPRESSED · GRAYSCALE_BIAS=true</span>
                <a href="#" className="font-bold">[ VIEW ALL 24 PLATES → ]</a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 border-b-2 border-black">
              <div className="lg:col-span-2 bg-white p-4 md:p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-black">
                <h5 className="font-sans font-black text-2xl mb-4 uppercase">System Requirements</h5>

                <div className="overflow-x-auto border-2 border-black mb-6">
                  <table className="w-full text-left font-mono text-sm border-collapse">
                    <thead>
                      <tr className="bg-win-gray border-b-2 border-black">
                        <th className="p-2 border-r-2 border-black">Component</th>
                        <th className="p-2 border-r-2 border-black">Minimum</th>
                        <th className="p-2">Recommended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sysReqRows.map((r, i) => (
                        <tr key={r.component} className={i < sysReqRows.length - 1 ? "border-b border-black" : ""}>
                          <td className="p-2 border-r border-black font-bold">{r.component}</td>
                          <td className="p-2 border-r border-black">{r.min}</td>
                          <td className="p-2">{r.rec}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h5 className="font-sans font-black text-2xl mb-2 uppercase">Configuration</h5>
                <p className="mb-2 font-serif">Edit the <code className="bg-gray-200 px-1 border border-gray-400 font-mono text-sm">config.json</code> file to set your global variables.</p>

                <div className="bg-black text-white p-3 font-mono text-xs md:text-sm overflow-x-auto shadow-[4px_4px_0px_0px_#C0C0C0]">
                  <pre>{configJson}</pre>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 flex flex-col justify-between">
                <div>
                  <h5 className="font-sans font-bold text-lg underline mb-4">LATEST_CHANGELOG</h5>
                  <ul className="font-mono text-xs space-y-3">
                    {changelog.map(c => (
                      <li key={c.date} className="flex gap-2">
                        <span className="font-bold shrink-0">{c.date}</span>
                        <span>{c.entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h5 className="font-sans font-bold text-lg underline mb-2">Mirrors</h5>
                  <ul className="list-square pl-4 font-serif text-sm space-y-1">
                    {mirrors.map(m => (
                      <li key={m}><a href="#">{m}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-win-gray border-b-2 border-black p-4 text-center">
              <div className="inline-block border-2 border-white border-r-black border-b-black p-1 bg-win-gray">
                <div className="border border-gray-500 p-2">
                  <span className="font-bold font-sans text-sm">PRO TIP:</span>{" "}
                  <span className="font-serif italic text-sm">Use key combination <span className="font-mono font-bold not-italic">CTRL+P</span> to print this manual on paper.</span>
                </div>
              </div>
            </div>

            {/* SEC_C The Manifesto */}
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_C</span>
                The Manifesto
              </h3>
            </div>
            <div className="manifesto-frame bg-white border-b-2 border-black p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <aside className="scroll-invert-container relative lg:col-span-3 border-r-0 lg:border-r-2 border-black lg:pr-6">
                {/* Background image layer — fills the entire left rail vertically */}
                <div className="absolute inset-0 lg:right-6 overflow-hidden pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop"
                       alt="" aria-hidden="true"
                       className="w-full h-full object-cover file-header-img select-none" />
                  <div className="absolute inset-0"
                       style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 6px)", mixBlendMode: "multiply" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10"></div>
                </div>

                {/* FILE_HEADER box on top, sticky */}
                <div className="relative z-10 border-2 border-black bg-gray-100 p-3 font-mono text-[11px] mb-4 sticky top-0">
                  <p className="font-bold mb-2 underline">FILE_HEADER</p>
                  <ul className="space-y-1.5">
                    <li className="flex justify-between"><span>NAME:</span><span className="font-bold">manifesto.txt</span></li>
                    <li className="flex justify-between"><span>SIZE:</span><span>2.4 KB</span></li>
                    <li className="flex justify-between"><span>VERSION:</span><span>1.0.4</span></li>
                    <li className="flex justify-between"><span>DRAFTED:</span><span>1999-08-12</span></li>
                    <li className="flex justify-between"><span>SIGNED:</span><span>@ROOT</span></li>
                  </ul>
                  <hr className="border-gray-400 my-3" />
                  <p className="text-[9px] text-gray-600 leading-relaxed">VERIFIED BY GPG. <br />Hash matches origin commit.</p>
                </div>
              </aside>

              <article className="lg:col-span-9 max-w-3xl">
                <h4 className="font-serif text-3xl md:text-5xl font-bold leading-[0.95] mb-6 uppercase">
                  Build for the<br />reader, not the<br />algorithm.
                </h4>
                <p className="font-serif text-base md:text-lg leading-relaxed mb-4">
                  <span className="float-left font-sans font-black text-7xl leading-none mr-2 mt-1">T</span>he web does not require ornament. It requires legibility. It requires durability. It requires that data, once written, remains both readable and trustworthy a decade from now — without a runtime, without a CDN, without an account.
                </p>
                <p className="font-serif text-base md:text-lg leading-relaxed mb-6">
                  We have spent twenty-five years adding chrome to a medium that was complete in 1995. MANUAL_v1 is a return to the principles that worked: hyperlinks. Plain text. Headings, paragraphs, tables. The browser as document reader. Anything more is an error introduced by us, not corrected by us.
                </p>

                <h5 className="font-sans font-black text-lg uppercase mb-3 underline decoration-2">Five Tenets</h5>
                <ol className="space-y-3 list-none mb-6 border-2 border-black bg-gray-50">
                  {tenets.map((t, i) => (
                    <li key={t.n} className={`${i < tenets.length - 1 ? "border-b border-black" : ""} p-3 flex gap-4 items-baseline`}>
                      <span className="font-mono font-bold text-2xl shrink-0 w-8">{t.n}</span>
                      <div>
                        <p className="font-bold mb-1">{t.title}</p>
                        <p className="font-serif text-sm text-gray-700">{t.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="font-serif italic text-sm border-l-4 border-black pl-3">
                  &quot;If you cannot view this in <code className="font-mono not-italic font-bold">lynx</code>, we have failed.&quot;
                  <br /><span className="font-mono not-italic text-xs">— @ROOT, commit 1a2b3c4 · 2018-04-21</span>
                </p>
              </article>
            </div>

            {/* SEC_D Maintainers */}
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_D</span>
                Maintainers
              </h3>
            </div>
            <div className="bg-gray-100 border-b-2 border-black grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 bg-black text-green-400 font-mono text-xs md:text-sm p-4 md:p-6 border-r-0 lg:border-r-2 border-black overflow-x-auto">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-green-700/40 text-green-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-alert-yellow rounded-full"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="ml-3 text-[10px] uppercase tracking-widest opacity-70">// terminal — git log --format=%h%an%ad%s</span>
                </div>
                <div className="space-y-2 leading-relaxed">
                  <div><span className="text-green-300">$ git shortlog -sn --no-merges</span></div>
                  <div className="text-gray-300">  <span className="text-alert-yellow font-bold">1,284</span>  <span className="text-white">@ROOT</span> &lt;root@manual.txt&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">412</span>  <span className="text-white">Maya K.</span> &lt;maya@kessler.io&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">298</span>  <span className="text-white">Hiroshi N.</span> &lt;hiro@chiba.jp&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">187</span>  <span className="text-white">Eimear B.</span> &lt;eb@dublin.ie&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">142</span>  <span className="text-white">Sasha P.</span> &lt;sash@warsaw.pl&gt;</div>
                  <div className="text-gray-300">    &nbsp;<span className="text-alert-yellow font-bold">+ 42 others</span></div>
                  <div className="pt-3"><span className="text-green-300">$ git log --since=&quot;3 days ago&quot; --oneline</span></div>
                  <div className="text-gray-300"><span className="text-alert-yellow">a4b2e1c</span> <span className="text-white">@ROOT</span> docs: clarify cache_duration default to 3600s</div>
                  <div className="text-gray-300"><span className="text-alert-yellow">9d3f817</span> <span className="text-white">Maya K.</span> fix: parser.c segfault on UTF-16 input</div>
                  <div className="text-gray-300"><span className="text-alert-yellow">2e5c4a0</span> <span className="text-white">Hiroshi N.</span> i18n: japanese localisation for /02_Structure</div>
                  <div className="text-gray-300"><span className="text-alert-yellow">f17b9d3</span> <span className="text-white">Eimear B.</span> chore: remove deprecated v0.9 endpoints</div>
                  <div className="pt-2"><span className="text-green-300">$ <span className="bg-green-400 text-black animate-pulse w-2 h-4 inline-block">_</span></span></div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 flex flex-col">
                <h5 className="font-sans font-bold text-lg underline mb-4 uppercase">Top Contributors</h5>
                <ul className="flex flex-col gap-3">
                  {contributors.map(c => (
                    <li key={c.name} className="border-2 border-black p-3 flex items-center gap-3 bg-gray-50 hover:bg-alert-yellow transition-colors">
                      <div className={`w-10 h-10 ${c.bg} ${c.color} font-mono font-bold flex items-center justify-center border-2 border-black shrink-0 text-sm`}>{c.initials}</div>
                      <div className="flex-1 min-w-0 font-mono text-xs">
                        <p className="font-bold truncate">{c.name}</p>
                        <p className="text-gray-600">{c.role}</p>
                      </div>
                      <span className="font-mono font-bold text-sm tabular-nums shrink-0">{c.count}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" className="mt-4 btn-brutal px-3 py-2 font-mono text-xs uppercase font-bold text-center">[ JOIN AS CONTRIBUTOR → ]</a>
              </div>
            </div>
          </main>

          <footer className="bg-white p-4 md:p-6 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              {footerCols.map(col => (
                <div key={col.title}>
                  <h6 className="font-bold mb-2 underline">{col.title}</h6>
                  <ul className="space-y-1">
                    {col.links.map(l => (
                      <li key={l}><a href="#" className="no-underline hover:underline">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-2 md:col-span-2">
                <h6 className="font-bold mb-2 underline">NEWSLETTER</h6>
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert("SUBSCRIBED TO DB."); }}>
                  <input type="email" placeholder="email@address.com" className="bg-gray-100 border-2 border-black p-1 w-full max-w-[200px] font-mono focus:bg-white outline-none rounded-none" />
                  <button type="submit" className="btn-brutal px-3 py-1 font-bold">OK</button>
                </form>
              </div>
            </div>

            <hr className="border-t-2 border-gray-300" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-mono text-xs text-gray-500">
                © 1999-2023 MANUAL_v1 OPEN SOURCE PROJECT. <br className="hidden md:block" />
                RENDERED IN 0.002s. NO TRACKERS.
              </p>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-mono text-xs border-2 border-black px-2 py-1 bg-white hover:bg-black hover:text-white uppercase">
                [▲ Return to Top]
              </button>
            </div>
          </footer>

        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
