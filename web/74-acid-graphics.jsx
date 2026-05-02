export default function T74AcidGraphics() {
  const artists = [
    { name: "DJ_ERROR_404", marker: "solid" },
    { name: "NEURAL_NET_ROT", marker: "border" },
    { name: "CYBER_PUNK_X", marker: "faded" },
    { name: "ACID_RAIN_DANCE", marker: "border" },
  ];

  const marqueeItems = [
    "/// LOCATION: WAREHOUSE 7G, INDUSTRIAL SECTOR",
    "/// SOUND: 50KW FUNKTION-ONE",
    "/// DRESS: CYBER / TRASH / RAVE",
    "/// START: 23:00 - END: ???",
    "/// ACID_WAVE 2026",
  ];

  const timeline = [
    { slot: "23:00", artist: "DJ_ERROR_404",       phase: "// OPENING_INIT",     bpm: "160", stat: "[OK]",    tone: "default" },
    { slot: "00:30", artist: "NEURAL_NET_ROT",     phase: "// FIRST_BREACH",     bpm: "175", stat: "[OK]",    tone: "default" },
    { slot: "02:00", artist: "CYBER_PUNK_X",       phase: "// PEAK_DISSOLUTION", bpm: "200", stat: "●LIVE",   tone: "live"    },
    { slot: "04:00", artist: "ACID_RAIN_DANCE",    phase: "// HYPER_PHASE",      bpm: "220", stat: "[QUEUE]", tone: "default" },
    { slot: "05:30", artist: "[ ?? CLASSIFIED ?? ]", phase: "// SPECIAL_GUEST",  bpm: "???", stat: "[LOCK]",  tone: "lock"    },
    { slot: "06:30", artist: "SUNRISE_PROTOCOL",   phase: "// GRID_DISSOLVE",    bpm: "— —", stat: "[END]",   tone: "muted"   },
  ];

  const rules = [
    { code: "00_LENS.RULE", title: "NO_LENS", body: "All cameras sealed at the door. The body remembers. The screen does not. PHOTO_DEPRECATED.", trigger: "VIOLATION →",   tag: "[EVICT]"     },
    { code: "01_VIP.RULE",  title: "NO_VIP",  body: "No guestlist. No table service. No champagne. Hierarchy_purged. ALL_FLAT_NETWORK.",        trigger: "DOOR_POLICY →", tag: "[SOVEREIGN]" },
    { code: "02_AGRO.RULE", title: "NO_AGRO", body: "Aggression is a compatibility error. Resolve at the door. The dancefloor is consensual_protocol.", trigger: "ESCALATION →",  tag: "[TERMINATE]" },
  ];

  const footerLinks = [
    { heading: "> SIGNAL",  items: ["MANIFESTO.DOC", "ARCHIVE.ZIP", "DROP_LIST.SUB", "TRANSMISSION_LOG"] },
    { heading: "> CREW",    items: ["COLLECTIVE.HEX", "DOOR_OPS", "SOUND_CTRL", "HARM_REDUCT"] },
    { heading: "> ARCHIVE", items: ["2024 / FREQ_001", "2024 / FREQ_002", "2025 / FREQ_003", "2025 / FREQ_004"] },
    { heading: "> CONTACT", items: ["TRANSMIT@ACID.WAVE", "PRESS@ACID.WAVE", "SAFE@ACID.WAVE", { text: "EMERGENCY: ?", accent: true }] },
  ];

  const markerClass = (m) =>
    m === "solid" ? "inline-block w-4 h-4 bg-acid-green mr-2 group-hover:animate-spin"
      : m === "faded" ? "inline-block w-4 h-4 bg-acid-green mr-2 opacity-50"
      : "inline-block w-4 h-4 border border-acid-green mr-2";

  const slotClass = (tone) => {
    if (tone === "live")  return "grid grid-cols-12 gap-2 px-4 py-3 group cursor-pointer border-b border-acid-green/10 bg-acid-green/5";
    return "grid grid-cols-12 gap-2 px-4 py-3 hover:bg-acid-green/10 group cursor-pointer border-b border-acid-green/10";
  };

  return (
    <>
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Rubik+Glitch&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                'acid-green': '#ccff00',
                'hot-pink': '#ff0099',
                'cyber-black': '#050505',
                'chrome-light': '#f0f0f0',
                'chrome-dark': '#555555'
              },
              fontFamily: {
                'glitch': ['"Rubik Glitch"', 'system-ui'],
                'archivo': ['"Archivo Black"', 'sans-serif'],
                'mono': ['"Space Mono"', 'monospace'],
              },
              backgroundImage: {
                'chrome': 'linear-gradient(to bottom, #ffffff 0%, #dcdcdc 45%, #555555 50%, #ffffff 55%, #b6b6b6 100%)',
              }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body { cursor: crosshair; background-color: #050505; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #000; border-left: 1px solid #333; }
        ::-webkit-scrollbar-thumb { background: #ccff00; border: 2px solid #000; }
        ::-webkit-scrollbar-thumb:hover { background: #ff0099; }
        .perspective-container { perspective: 1000px; overflow: hidden; position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .grid-floor {
          position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background-image: linear-gradient(rgba(204, 255, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(204, 255, 0, 0.3) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: rotateX(70deg);
          animation: grid-scroll 2s linear infinite;
          mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
        }
        @keyframes grid-scroll { 0% { background-position: 0 0; } 100% { background-position: 0 60px; } }
        .text-chrome { background: linear-gradient(to bottom, #fff 0%, #ccc 45%, #444 50%, #fff 55%, #aaa 100%); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0px 2px 4px rgba(0,0,0,0.5); }
        .text-outline { -webkit-text-stroke: 1px rgba(255,255,255,0.5); color: transparent; }
        .acid-window { box-shadow: 10px 10px 0px rgba(0,0,0,0.5); transition: transform 0.2s, filter 0.2s, box-shadow 0.2s; }
        .acid-window:hover { transform: translate(-2px, -2px); box-shadow: 12px 12px 0px #ccff00; z-index: 40 !important; }
        .hover-glitch:hover { animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; color: #ccff00; }
        @keyframes glitch-anim {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        .floaty { animation: float 6s ease-in-out infinite; }
        .floaty-delayed { animation: float 7s ease-in-out infinite 1s; }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } }
        .scanlines { background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2)); background-size: 100% 4px; animation: scanline 0.2s linear infinite; }
        .marquee-track { display: flex; white-space: nowrap; will-change: transform; animation: marquee 15s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      ` }} />

      <div className="relative text-white selection:bg-hot-pink selection:text-white">

        <div className="fixed inset-0 opacity-10 pointer-events-none z-50 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMDAlJyBoZWlnaHQ9JzIwMCUnPjxmaWx0ZXIgaWQ9J24nPjxmZVR1cmJ1bGVuY2UgdHlwZT0nZnJhY3RhbE5vaXNlJyBiYXNlRnJlcXVlbmN5PScwLjcnIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSd0cmFuc3BhcmVudCcvPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')" }}></div>
        <div className="fixed inset-0 scanlines opacity-30 pointer-events-none z-50"></div>
        <div className="perspective-container bg-gradient-to-b from-black via-cyber-black to-[#111]">
          <div className="grid-floor"></div>
        </div>

        <main className="relative z-10 w-full min-h-screen p-4 md:p-8 flex flex-col md:block gap-8 overflow-x-hidden md:overflow-visible">

          <header className="relative md:absolute md:top-8 md:left-8 z-50 mb-8 md:mb-0 text-center md:text-left">
            <div className="inline-block border border-hot-pink bg-black/80 backdrop-blur-sm p-1">
              <p className="font-mono text-xs text-hot-pink animate-pulse">&gt;&gt;&gt; SYSTEM_BREACH_DETECTED</p>
            </div>
            <h1 className="font-glitch text-7xl md:text-[9rem] leading-[0.85] mt-2 mix-blend-difference">
              ACID<br />
              <span className="text-chrome">WAVE</span>
            </h1>
            <p className="font-archivo text-xl md:text-2xl text-acid-green uppercase tracking-widest mt-2 bg-black inline-block px-2 transform -skew-x-12 border-l-4 border-acid-green">
              Jan 23 // 2026
            </p>
          </header>

          <div className="order-first md:absolute md:top-[10%] md:right-[15%] w-48 h-48 md:w-64 md:h-64 mx-auto md:mx-0 floaty pointer-events-none opacity-80 mix-blend-hard-light">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_10s_linear_infinite]">
              <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" style={{ stopColor: "rgb(204,255,0)", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "rgb(0,0,0)", stopOpacity: 0 }} />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="80" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10,5" />
              <path d="M100 20 L100 180 M20 100 L180 100 M45 45 L155 155 M155 45 L45 155" stroke="#ff0099" strokeWidth="2" />
              <circle cx="100" cy="100" r="30" fill="url(#grad1)" />
            </svg>
          </div>

          <div className="acid-window relative md:absolute md:top-[40%] md:left-[10%] w-full md:w-80 bg-black border-2 border-acid-green z-20 md:rotate-[-2deg]">
            <div className="bg-acid-green text-black font-archivo text-xs px-2 py-1 flex justify-between items-center select-none">
              <span>C:\ARTISTS.TXT</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-black border border-white"></div>
                <div className="w-3 h-3 bg-black border border-white"></div>
              </div>
            </div>
            <div className="p-6 font-mono text-sm text-acid-green bg-black/90">
              <ul className="space-y-3">
                {artists.map((a) => (
                  <li key={a.name} className="group cursor-pointer">
                    <span className={markerClass(a.marker)}></span>
                    <span className="group-hover:text-white group-hover:bg-hot-pink">{a.name}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-dashed border-acid-green text-xs opacity-70">
                STATUS: CONFIRMED<br />
                BPM_RANGE: 160-220
              </div>
            </div>
          </div>

          <div className="acid-window relative md:absolute md:top-[25%] md:left-[40%] w-full md:w-96 bg-gray-900 border-2 border-white z-10 md:rotate-[1deg]">
            <div className="bg-white text-black font-archivo text-xs px-2 py-1 flex justify-between items-center select-none">
              <span>MANIFESTO.DOC</span>
              <span className="font-bold">_ [] X</span>
            </div>
            <div className="p-4 font-mono text-xs md:text-sm text-gray-300 leading-relaxed">
              <p className="mb-2">We reject the high-definition reality.</p>
              <p className="mb-2"><span className="bg-white text-black">ACID_WAVE</span> is not just a party. It is a system reset. A temporary autonomous zone where the grid dissolves.</p>
              <p className="text-hot-pink mt-2">NO PHOTOS. NO VIPS. PURE NOISE.</p>
            </div>
          </div>

          <div className="acid-window relative md:absolute md:bottom-[20%] md:right-[10%] w-full md:w-80 bg-black border-2 border-hot-pink z-30 md:rotate-3 shadow-[8px_8px_0px_#ffffff]">
            <div className="bg-hot-pink text-white font-archivo text-xs px-2 py-1 flex justify-between items-center select-none">
              <span>BUY_TICKETS.EXE</span>
              <span className="animate-pulse">&bull; REC</span>
            </div>
            <div className="p-5 flex flex-col gap-3 font-mono text-sm">
              <div className="text-center mb-2">
                <span className="text-3xl font-glitch text-white">€25.00</span>
                <br />
                <span className="text-hot-pink text-xs uppercase">Early Bird Phase 2</span>
              </div>
              <input type="email" placeholder="ENTER_EMAIL" className="bg-black border border-white p-2 text-white focus:outline-none focus:border-acid-green placeholder-gray-600" />
              <div className="flex gap-2">
                <input type="text" placeholder="CODE" className="w-1/3 bg-black border border-white p-2 text-white focus:outline-none focus:border-acid-green" />
                <button className="w-2/3 bg-white text-black font-bold hover:bg-acid-green hover:text-black transition-colors border-2 border-transparent">INITIATE</button>
              </div>
              <div className="text-[10px] text-gray-500 text-center mt-1">* By clicking you agree to melt your brain.</div>
            </div>
          </div>

          <div className="hidden md:block absolute bottom-10 left-10 w-40 z-10">
            <div className="relative">
              <svg className="w-32 h-32 absolute bottom-0 left-0 hover:scale-110 transition-transform cursor-help" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="#ccff00" stroke="black" strokeWidth="2" />
                <path d="M25 35 Q35 20 45 35" stroke="black" strokeWidth="3" fill="none" />
                <path d="M55 35 Q65 20 75 35" stroke="black" strokeWidth="3" fill="none" />
                <path d="M20 65 Q50 90 80 65" stroke="black" strokeWidth="3" fill="none" />
                <path d="M60 40 L70 50 L60 60" stroke="black" strokeWidth="2" fill="black" />
              </svg>
              <div className="absolute -top-10 -right-10 bg-hot-pink text-white font-archivo text-xs p-1 rotate-12 border border-white">BIOHAZARD</div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0 mix-blend-overlay opacity-30">
            <span className="font-archivo text-[20vw] text-outline leading-none">ACID</span>
          </div>

        </main>

        {/* SECTION 02 :: TIMELINE.SYS */}
        <section className="relative z-10 w-full py-24 md:py-32 px-4 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <div className="inline-block border border-hot-pink bg-black px-2 py-0.5 mb-4">
                  <p className="font-mono text-[10px] text-hot-pink tracking-[0.3em]">// 02_TIMELINE.SYS</p>
                </div>
                <h2 className="font-glitch text-5xl md:text-7xl leading-[0.9]">
                  <span className="text-acid-green">SET</span><span className="text-chrome">_TIMES</span>
                </h2>
              </div>
              <div className="font-mono text-[10px] text-acid-green/70 border-l-2 border-acid-green pl-3 py-1 bg-black/50 leading-relaxed">
                TRANSMISSION_DURATION ::: 07h 30m<br />
                BPM_DELTA ::: 160 → 220<br />
                FORMAT ::: 4×4 / EXPERIMENTAL / NO_REQUESTS
              </div>
            </div>

            <div className="acid-window bg-black border-2 border-acid-green relative">
              <div className="bg-acid-green text-black font-archivo text-xs px-3 py-1.5 flex justify-between items-center select-none">
                <span>{"C:\\TIMELINE\\NIGHT_PROTOCOL.LOG"}</span>
                <span className="flex gap-2 items-center">
                  <span className="w-2 h-2 bg-hot-pink animate-pulse"></span>
                  LIVE_FEED // <span className="font-mono">23:07:42</span>
                </span>
              </div>
              <div className="font-mono text-xs md:text-sm">
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-acid-green/40 border-b border-acid-green/20 uppercase text-[10px] tracking-widest">
                  <span className="col-span-2">[ slot ]</span>
                  <span className="col-span-4">[ artist ]</span>
                  <span className="col-span-3">[ phase ]</span>
                  <span className="col-span-2">[ bpm ]</span>
                  <span className="col-span-1 text-right">[ stat ]</span>
                </div>
                {timeline.map((row, i) => {
                  const isLast = i === timeline.length - 1;
                  const baseRow = slotClass(row.tone) + (isLast ? " !border-b-0" : "");
                  const slotCol = row.tone === "live" ? "col-span-2 text-white" : "col-span-2 text-acid-green/60";
                  const artistCol =
                    row.tone === "live" ? "col-span-4 text-acid-green font-bold group-hover:bg-hot-pink group-hover:text-white"
                      : row.tone === "lock" ? "col-span-4 text-white/40 group-hover:text-acid-green italic"
                      : row.tone === "muted" ? "col-span-4 text-acid-green/60"
                      : "col-span-4 text-hot-pink group-hover:text-white";
                  const phaseCol = row.tone === "lock" ? "col-span-3 text-white/40 italic" : "col-span-3 text-white/80";
                  const bpmCol = row.tone === "live" ? "col-span-2 text-white"
                    : row.tone === "lock" ? "col-span-2 text-acid-green/30"
                    : "col-span-2 text-acid-green/60";
                  const statCol = row.tone === "live" ? "col-span-1 text-right text-hot-pink animate-pulse"
                    : row.tone === "lock" ? "col-span-1 text-right text-white/40"
                    : row.tone === "muted" ? "col-span-1 text-right text-acid-green/60"
                    : "col-span-1 text-right text-acid-green";
                  return (
                    <div key={row.slot} className={baseRow}>
                      <span className={slotCol}>{row.slot}</span>
                      <span className={artistCol}>{row.artist}</span>
                      <span className={phaseCol}>{row.phase}</span>
                      <span className={bpmCol}>{row.bpm}</span>
                      <span className={statCol}>{row.stat}</span>
                    </div>
                  );
                })}
              </div>
              <div className="bg-black border-t-2 border-dashed border-acid-green/30 px-4 py-3 font-mono text-[10px] text-acid-green flex justify-between items-center">
                <span>{">> END_OF_LOG // SCROLL_LOCK_ENGAGED // PRESS_ENTER_TO_DECRYPT"}</span>
                <span className="text-hot-pink animate-pulse">█</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03 :: PROTOCOL.CFG */}
        <section className="relative z-10 w-full py-24 md:py-32 px-4 md:px-12 border-t border-acid-green/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <div className="inline-block border border-hot-pink bg-black px-2 py-0.5 mb-4">
                  <p className="font-mono text-[10px] text-hot-pink tracking-[0.3em]">// 03_PROTOCOL.CFG</p>
                </div>
                <h2 className="font-glitch text-5xl md:text-7xl leading-[0.9]">
                  <span className="text-chrome">ACCESS</span><span className="text-acid-green">_RULES</span>
                </h2>
              </div>
              <p className="font-mono text-xs text-acid-green/70 max-w-sm leading-relaxed">
                // Compliance is non-optional. Violation triggers immediate eviction from the temporary autonomous zone. NO_EXCEPTIONS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rules.map((r) => (
                <div key={r.code} className="acid-window bg-black border-2 border-white">
                  <div className="bg-white text-black font-archivo text-[10px] px-2 py-1 flex justify-between items-center">
                    <span>{r.code}</span>
                    <span className="font-bold text-hot-pink">!</span>
                  </div>
                  <div className="p-5">
                    <div className="font-glitch text-2xl md:text-3xl text-acid-green mb-3 leading-none">{r.title}</div>
                    <p className="font-mono text-xs text-white/70 leading-relaxed">{r.body}</p>
                    <div className="mt-4 pt-3 border-t border-dashed border-white/30 font-mono text-[10px] text-white/40 flex justify-between">
                      <span>{r.trigger}</span><span className="text-hot-pink">{r.tag}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="acid-window bg-black border-2 border-hot-pink md:col-span-2 shadow-[8px_8px_0px_#ffffff]">
                <div className="bg-hot-pink text-white font-archivo text-[10px] px-2 py-1 flex justify-between items-center">
                  <span>COORDINATES.DECODE</span>
                  <span className="flex gap-2 items-center"><span className="w-1.5 h-1.5 bg-white animate-pulse"></span>TRACKING</span>
                </div>
                <div className="p-6 font-mono text-xs space-y-3 text-white">
                  <p><span className="text-hot-pink mr-2">▶</span>VENUE :: <span className="text-acid-green">WAREHOUSE_7G</span> :: INDUSTRIAL_SECTOR_NORTH</p>
                  <p><span className="text-hot-pink mr-2">▶</span>VECTOR :: <span className="text-acid-green">52.4084° N // 13.0473° E</span></p>
                  <p><span className="text-hot-pink mr-2">▶</span>ENTRY :: <span className="bg-acid-green text-black px-1">unmarked steel door · blue tape · knock 3-2-1</span></p>
                  <p><span className="text-hot-pink mr-2">▶</span>PASSPHRASE :: <span className="bg-acid-green text-black px-1">DISSOLVE_THE_GRID</span></p>
                  <p><span className="text-hot-pink mr-2">▶</span>CAPACITY :: <span className="text-acid-green">[████████░░] 80% PRE-RESERVED</span></p>
                  <div className="border-t border-dashed border-hot-pink/40 pt-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-acid-green/40 text-[10px] uppercase tracking-widest mb-1">{"> NEAREST_NODE"}</p>
                      <p className="text-white">U-BAHN :: WARSCHAUER STR. (8 MIN)</p>
                    </div>
                    <div>
                      <p className="text-acid-green/40 text-[10px] uppercase tracking-widest mb-1">{"> EGRESS_OPS"}</p>
                      <p className="text-white">NIGHT_BUS_N1 :: 04:13–06:42</p>
                    </div>
                  </div>
                  <p className="text-acid-green/60 text-[10px] uppercase tracking-widest pt-2">// final coordinates resolve T-24h. subscribe to drop list.</p>
                </div>
              </div>

              <div className="acid-window bg-black border-2 border-acid-green">
                <div className="bg-acid-green text-black font-archivo text-[10px] px-2 py-1 flex justify-between items-center">
                  <span>SIGNAL.SUB</span>
                  <span>[ ∞ / 0 ]</span>
                </div>
                <div className="p-5">
                  <div className="font-glitch text-2xl text-white mb-2 leading-none">DROP_LIST</div>
                  <p className="font-mono text-[11px] text-acid-green/70 mb-4 leading-relaxed">Final coords + phase password unlock T-24h before transmission.</p>
                  <input type="email" placeholder="ROUTE_ADDRESS" className="w-full bg-black border border-acid-green/50 p-2 text-acid-green text-xs placeholder-acid-green/30 focus:outline-none focus:border-hot-pink mb-2 font-mono" />
                  <button className="w-full bg-acid-green text-black font-archivo text-xs py-2 hover:bg-hot-pink hover:text-white transition-colors uppercase tracking-widest">
                    {"SUBSCRIBE_>>"}
                  </button>
                  <p className="font-mono text-[10px] text-acid-green/40 mt-3 text-center">// no spam // unsub = ghost protocol</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP (was fixed-bottom; now inline above footer) */}
        <div className="relative z-10 w-full bg-acid-green border-y-4 border-black h-12 flex items-center overflow-hidden">
          <div className="marquee-track font-archivo text-black text-lg md:text-xl uppercase tracking-widest">
            {[...marqueeItems, ...marqueeItems].map((m, i) => (
              <span key={i} className="mx-8">{m}</span>
            ))}
          </div>
        </div>

        {/* FOOTER :: END_OF_TRANSMISSION */}
        <footer className="relative z-10 bg-black border-t-2 border-acid-green/30 pt-16 md:pt-24 pb-8 px-4 md:px-12 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none mix-blend-overlay opacity-20">
            <span className="font-archivo text-[18vw] text-outline leading-none">2026</span>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="border-b border-acid-green/20 pb-12 mb-12">
              <div className="flex items-end justify-between flex-wrap gap-6">
                <div>
                  <p className="font-mono text-[10px] text-hot-pink uppercase tracking-[0.4em] mb-3">// END_OF_TRANSMISSION</p>
                  <h3 className="font-glitch text-6xl md:text-9xl leading-[0.85]">
                    <span className="text-chrome">ACID</span>_<span className="text-outline">WAVE</span>
                  </h3>
                </div>
                <div className="font-mono text-[10px] text-acid-green/70 border-l-2 border-acid-green pl-3 py-1 leading-relaxed">
                  SIGNAL_LOCK ::: STABLE<br />
                  LAST_SYNC ::: 23:07:42<br />
                  UPLINK ::: ENCRYPTED
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {footerLinks.map((col) => (
                <div key={col.heading}>
                  <h4 className="font-archivo text-xs text-acid-green uppercase tracking-widest mb-4 border-b border-acid-green/30 pb-2">{col.heading}</h4>
                  <ul className="space-y-2 font-mono text-xs text-white/60">
                    {col.items.map((it, idx) => {
                      const text = typeof it === "string" ? it : it.text;
                      const accent = typeof it === "object" && it.accent;
                      return (
                        <li key={idx} className={accent ? "hover-glitch cursor-pointer text-hot-pink" : "hover-glitch cursor-pointer"}>→ {text}</li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="font-mono text-[10px] text-acid-green/30 text-center mb-6 select-none overflow-hidden whitespace-nowrap">
              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[10px] text-acid-green/50 uppercase tracking-widest">
              <span>BUILD :: 2026.01.0023.acid</span>
              <span className="md:text-center">© ACID_WAVE COLLECTIVE :: ALL RIGHTS DISSOLVED</span>
              <span className="md:text-right">PHASE_2 :: 23:00 → 06:30</span>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const windows = document.querySelectorAll('.acid-window');
          let maxZ = 40;
          windows.forEach(win => {
            win.addEventListener('mousedown', () => { maxZ++; win.style.zIndex = maxZ; });
          });
          const title = document.querySelector('h1 span');
          if (!title) return;
          const originalText = "WAVE";
          const chars = "!@#$%^&*()_+-=[]{}|;':,./<>?";
          setInterval(() => {
            if (Math.random() > 0.9) {
              const randomChar = chars[Math.floor(Math.random() * chars.length)];
              const split = originalText.split('');
              split[Math.floor(Math.random() * split.length)] = randomChar;
              title.innerText = split.join('');
              setTimeout(() => { title.innerText = originalText; }, 100);
            }
          }, 1000);
        })();
      ` }} />
    </>
  );
}
