export default function T93CasetteFuturism() {
  const navLinks = [
    { label: "COMM-LINK", active: true },
    { label: "MODULES" },
    { label: "SCHEMATICS" },
    { label: "LOGS" },
  ];

  const statusItems = [
    "> COMM_LINK_ESTABLISHED",
    "> DATA_STREAM_ACTIVE",
    "> SECTOR_4_CLEAR",
    "> REACTOR_TEMP_NOMINAL",
    "> AWAITING_INPUT_",
  ];

  const modules = [
    { code: "MOD-01 // CTRL.A", title: "CONTROL DECK A", price: "CR.4,200",  stock: "IN STOCK", stockCls: "bg-[#5B4226] text-[#FFB947]", led: "#7FC774", img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=900&auto=format&fit=crop", alt: "Industrial machinery control panel close-up", specs: [["CHASSIS","STEEL / 12U"],["KEYS","104 / TACTILE"],["RATING","IP-54 / MIL-STD"]] },
    { code: "MOD-02 // SCAN.B", title: "RACK SCANNER B", price: "CR.9,800",  stock: "IN STOCK", stockCls: "bg-[#5B4226] text-[#FFB947]", led: "#7FC774", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop", alt: "Server rack with status lights",          specs: [["PORTS","32 / RS-232"],["DRAW","4.7 KW / 220V"],["RATING","USCSS / GR-1"]] },
    { code: "MOD-03 // CRT.C",  title: "CRT TERMINAL C", price: "CR.2,150",  stock: "2 LEFT",   stockCls: "bg-[#FFB947] text-[#5B4226]", led: "#FFB947", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop", alt: "Macro view of circuit board traces",      specs: [["TUBE","14\" / AMBER"],["REFRESH","60 HZ / NTSC"],["RATING","FCC-A / 1979"]] },
    { code: "MOD-04 // PWR.D",  title: "POWER UNIT D",   price: "CR.14,400", stock: "IN STOCK", stockCls: "bg-[#5B4226] text-[#FFB947]", led: "#7FC774", img: "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=900&auto=format&fit=crop", alt: "Wide industrial server room shot",         specs: [["OUTPUT","12 KW / TRI-Φ"],["FUEL","DIESEL / 90L"],["RATING","EN-60204 / B"]] }
  ];

  const plates = [
    { code: "CAT-46", size: "36×48", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=700&auto=format&fit=crop", alt: "Macro circuit board traces" },
    { code: "CAT-47", size: "28×40", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=700&auto=format&fit=crop", alt: "Server rack lights" },
    { code: "CAT-48", size: "36×40", src: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=700&auto=format&fit=crop", alt: "Industrial machinery panel" },
    { code: "CAT-49", size: "40×54", src: "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=700&auto=format&fit=crop", alt: "Server room wide shot" },
    { code: "CAT-50", size: "32×42", src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=700&auto=format&fit=crop", alt: "Brass apothecary objects on dark surface" }
  ];

  const schematics = [
    { code: "SCH.07.A", rev: "REV.B", revCls: "text-[#7FC774]", title: "CTRL.A FASCIA",      sheet: "SHEET 01/03", sig: "SIG: T.MIYAMOTO", art: `+----[KEYBED 104K]----+
|  [ALT][CTRL][CMD]   |
|  [F1..F12]          |
|  [NUMPAD]   [LEDS]  |
+----[BUS / RJ-45]----+
        |
   [CHASSIS GND]` },
    { code: "SCH.07.B", rev: "REV.C", revCls: "text-[#7FC774]", title: "CRT.C TUBE WIRING",  sheet: "SHEET 02/03", sig: "SIG: H.WEAVER",  art: `   +---[H.V FLYBACK]---+
   |     |        |    |
 [G1] [G2] [G3] [CATH]
   |   YOKE / DEFLECT
   +-----[ANODE 14kV]
        |
   [HEATER 6.3V AC]` },
    { code: "SCH.07.C", rev: "REV.A", revCls: "text-[#FFB947]", title: "PWR.D BUS DIAGRAM",  sheet: "SHEET 03/03", sig: "SIG: R.SCOTT",   art: `[GENSET]==[BREAKER]
   |          |
   +--[ATS]---+
        |
  +-----+------+
[RACK A] [RACK B]
  |        |
[12V]    [48V]` }
  ];

  const ledMatrix = [
    "#7FC774","#7FC774","#FFB947","#7FC774",
    "#7FC774","#5B4226","#7FC774","#7FC774",
    "#7FC774","#7FC774","#5B4226","#FFB947"
  ];

  const footerLinks = [
    { label: "MANUALS", active: true },
    { label: "WARRANTY" },
    { label: "VOID-IF-REMOVED" },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-secondary": "#ffffff", "on-secondary-fixed": "#341100", "on-primary-container": "#5f543a",
            "on-surface-variant": "#4b463d", "inverse-primary": "#d5c5a4", "secondary-container": "#ff8846",
            "primary-container": "#d9c9a8", "on-tertiary-fixed": "#291800", "error-container": "#ffdad6",
            "secondary": "#9f4200", "on-primary-fixed-variant": "#50462d", "surface-variant": "#ffddbb",
            "background": "#fff8f4", "tertiary-container": "#ffbf5c", "surface-container": "#ffead8",
            "surface-container-high": "#ffe3ca", "on-primary-fixed": "#231b06", "on-tertiary": "#ffffff",
            "surface-container-low": "#fff1e6", "on-secondary-container": "#6a2a00", "on-error-container": "#93000a",
            "inverse-on-surface": "#ffeedf", "on-surface": "#2a1702", "primary": "#695d42",
            "on-tertiary-container": "#744d00", "error": "#ba1a1a", "secondary-fixed": "#ffdbcb",
            "outline-variant": "#cec5b9", "tertiary-fixed": "#ffddb1", "on-tertiary-fixed-variant": "#624000",
            "on-primary": "#ffffff", "surface": "#fff8f4", "surface-container-lowest": "#ffffff",
            "surface-container-highest": "#ffddbb", "inverse-surface": "#422c12", "primary-fixed-dim": "#d5c5a4",
            "secondary-fixed-dim": "#ffb692", "tertiary-fixed-dim": "#ffba49", "surface-dim": "#f9d3ae",
            "on-secondary-fixed-variant": "#793100", "outline": "#7d766b", "on-background": "#2a1702",
            "primary-fixed": "#f2e1bf", "on-error": "#ffffff", "tertiary": "#815600",
            "surface-tint": "#695d42", "surface-bright": "#fff8f4"
          },
          borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
          spacing: { "margin": "32px", "panel-padding": "16px", "unit": "4px", "component-gap": "12px", "gutter": "24px" },
          fontFamily: {
            "body-mono": ["IBM Plex Mono"], "headline-md": ["Space Grotesk"], "display-lg": ["Space Grotesk"],
            "status-code": ["VT323"], "label-caps": ["Space Grotesk"]
          },
          fontSize: {
            "body-mono": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
            "headline-md": ["24px", { lineHeight: "1.2", fontWeight: "600" }],
            "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
            "status-code": ["20px", { lineHeight: "1", fontWeight: "400" }],
            "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "700" }]
          }
        }
      }
    }
  `;

  const styles = `
    body {
      background-color: #D9C9A8;
      background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
    }
    .crt-screen {
      background-color: #5B4226; color: #FFB947;
      text-shadow: 0 0 4px rgba(255, 185, 71, 0.5);
      box-shadow: inset 0 8px 16px rgba(0,0,0,0.6);
      position: relative; overflow: hidden;
    }
    .crt-screen::after {
      content: " "; display: block; position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 2; background-size: 100% 2px, 3px 100%; pointer-events: none;
    }
    .bevel-out { box-shadow: inset 2px 2px 0px rgba(255,255,255,0.4), inset -2px -2px 0px rgba(91,66,38,0.6); }
    .bevel-in { box-shadow: inset 2px 2px 0px rgba(91,66,38,0.6), inset -2px -2px 0px rgba(255,255,255,0.4); }
    .hardware-panel { background-color: #D9C9A8; border: 4px solid #5B4226; box-shadow: 4px 4px 0px rgba(91,66,38,0.3); }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;
    }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Space+Grotesk:wght@400;600;700;900&family=VT323&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="text-on-background font-body-mono antialiased min-h-screen flex flex-col">
        <header className="flex justify-between items-center w-full px-6 py-4 max-w-full top-0 h-20 border-b-4 border-[#5B4226] shadow-[0_4px_0_0_rgba(91,66,38,0.2)] bg-[#D9C9A8] dark:bg-stone-300 relative z-50">
          <div className="flex items-center gap-6">
            <div className="text-2xl font-black tracking-tighter text-[#5B4226] border-2 border-[#5B4226] px-2 py-1 bg-[#D9C9A8] shadow-[inset_2px_2px_0px_#ffffff,2px_2px_0px_#5B4226]">
              PANEL 7
            </div>
            <nav className="hidden md:flex gap-2">
              {navLinks.map(l => (
                <a key={l.label} href="#" className={l.active
                  ? "px-4 py-2 font-['Space_Grotesk'] uppercase tracking-wider font-bold text-sm bg-[#FFB947] text-[#5B4226] shadow-[inset_3px_3px_0px_#5B4226] ring-2 ring-[#5B4226] flex items-center gap-2"
                  : "px-4 py-2 font-['Space_Grotesk'] uppercase tracking-wider font-bold text-sm bg-[#D9C9A8] text-[#5B4226] border-2 border-[#5B4226] shadow-[2px_2px_0px_#5B4226] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#5B4226] transition-all hover:bg-[#C9B998] hover:text-[#000000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2"}>
                  <span className={l.active ? "w-2 h-2 rounded-full bg-[#5B4226]" : "w-2 h-2 rounded-full bg-[#5B4226]/30"}></span>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center bg-[#D9C9A8] text-[#5B4226] border-2 border-[#5B4226] shadow-[2px_2px_0px_#5B4226] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#5B4226] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
              <span className="material-symbols-outlined">settings_input_component</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-[#D9C9A8] text-[#5B4226] border-2 border-[#5B4226] shadow-[2px_2px_0px_#5B4226] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#5B4226] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
              <span className="material-symbols-outlined">terminal</span>
            </button>
          </div>
        </header>

        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-12">
          <section className="hardware-panel p-6 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="bg-[#5B4226] text-[#FFB947] font-status-code text-status-code px-3 py-1 inline-block w-max bevel-in">
                SYS.INIT // STATUS: NOMINAL
              </div>
              <h1 className="font-display-lg text-display-lg text-[#5B4226] uppercase">CONTROL SURFACES FOR OPERATORS</h1>
              <p className="font-body-mono text-body-mono text-[#5B4226]">
                Heavy-duty tactile interfaces. Industrial-grade components. Designed for zero-gravity and high-stress environments. USCSS certified.
              </p>
              <button className="bg-[#D96B2B] text-white font-label-caps text-label-caps px-8 py-4 uppercase tracking-widest border-2 border-[#5B4226] bevel-out hover:bg-[#c05a20] active:bevel-in w-max shadow-[4px_4px_0px_#5B4226] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FFB947] shadow-[0_0_8px_#FFB947]"></span>
                VIEW CATALOG
              </button>
            </div>
            <div className="w-full md:w-1/2 hardware-panel p-2 bg-[#1A1A1A]">
              <img alt="Retro computer terminal setup" className="w-full h-auto border-2 border-[#333] opacity-80 mix-blend-luminosity sepia-[0.3]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDULUTChLsQF_aknSvNOEOCcchUH9k2iYh2iq5QXa49j_c9CIWAlsgFl_YTZI_apJmAtxioJ5W2TdSczDuInY_BC6WxoEY-sD7rxO2O3hIWrsGIMz4LB80yDyrkLXCpt4LfkJecuIjidCfESoVf52kEVjHGMeZjDE-mWlVw8-2buAPc_jzQTp1neJJyzZ2d7sWx0wCxMbLkrmLEtuwltMctlR3QpAx5WM3W_cHgN1rGucgnQ1-W10usiCno9OORkrVevOeQqgr1hew" />
            </div>
          </section>

          <div className="bg-[#1A1A1A] border-y-4 border-[#5B4226] p-4 overflow-hidden relative crt-screen">
            <div className="font-status-code text-status-code text-[#7FC774] flex gap-8 whitespace-nowrap animate-[pulse_4s_ease-in-out_infinite]">
              {statusItems.map(s => <span key={s}>{s}</span>)}
            </div>
          </div>

          {/* Modules grid */}
          <section className="hardware-panel p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 mb-6 border-b-2 border-[#5B4226]">
              <div>
                <p className="font-status-code text-status-code text-[#5B4226] uppercase mb-2">// MODULES — CATALOG.04</p>
                <h2 className="font-display-lg text-display-lg text-[#5B4226] uppercase">HARDWARE LINE</h2>
              </div>
              <p className="font-body-mono text-body-mono text-[#5B4226] max-w-sm md:text-right">Four operator-grade modules. Riveted steel, replaceable fascia, field-serviceable. Spec sheets in each unit.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {modules.map(m => (
                <article key={m.code} className="bg-[#D9C9A8] border-2 border-[#5B4226] bevel-out flex flex-col">
                  <div className="bg-[#5B4226] text-[#FFB947] font-status-code text-status-code px-3 py-1 flex justify-between"><span>{m.code}</span><span style={{ color: m.led }}>●</span></div>
                  <div className="bg-[#1A1A1A] p-2 border-b-2 border-[#5B4226]">
                    <img alt={m.alt} className="w-full aspect-[4/3] object-cover border border-[#333] opacity-80 mix-blend-luminosity sepia-[0.3]" src={m.img} />
                  </div>
                  <div className="p-4 flex flex-col gap-3 flex-grow">
                    <h3 className="font-display-lg text-xl text-[#5B4226] uppercase tracking-tight">{m.title}</h3>
                    <dl className="font-body-mono text-xs text-[#5B4226] space-y-1">
                      {m.specs.map(([k, v], i) => (
                        <div key={k} className={`flex justify-between ${i < m.specs.length - 1 ? "border-b border-[#5B4226]/20 pb-1" : ""}`}>
                          <dt className="opacity-60">{k}</dt><dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-auto pt-3 flex justify-between items-center">
                      <span className="font-status-code text-status-code text-[#5B4226]">{m.price}</span>
                      <span className={`${m.stockCls} font-label-caps text-label-caps px-3 py-1 uppercase`}>{m.stock}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Catalog Plates — image strip */}
          <section className="hardware-panel p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 mb-6 border-b-2 border-[#5B4226]">
              <div>
                <p className="font-status-code text-status-code text-[#5B4226] uppercase mb-2">// CATALOG_PLATES — N=05</p>
                <h2 className="font-display-lg text-display-lg text-[#5B4226] uppercase">REFERENCE FRAMES</h2>
              </div>
              <p className="font-body-mono text-body-mono text-[#5B4226] max-w-sm md:text-right">Field photographs from operator stations. Glued into the back of every catalog as proof-of-installation.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {plates.map(p => (
                <figure key={p.code} className="border-2 border-[#5B4226] bevel-in bg-[#1A1A1A] p-2 flex flex-col">
                  <div className="aspect-[3/4] overflow-hidden border border-[#333]">
                    <img alt={p.alt} className="w-full h-full object-cover opacity-85 sepia-[0.5] contrast-110" src={p.src} />
                  </div>
                  <figcaption className="font-status-code text-base text-[#FFB947] uppercase mt-2 flex justify-between"><span>{p.code}</span><span className="opacity-60 tabular-nums">{p.size}</span></figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-4 flex flex-col md:flex-row justify-between gap-2 font-body-mono text-xs text-[#5B4226] uppercase tracking-widest">
              <span>PHOTOS / OPERATOR DEPT. — DECK 14</span>
              <span className="tabular-nums opacity-60">REF / 0046–0050 // PRINTED ON KODAK GOLD</span>
            </div>
          </section>

          {/* Schematics — 3-col blueprint cards */}
          <section className="hardware-panel p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 mb-6 border-b-2 border-[#5B4226]">
              <div>
                <p className="font-status-code text-status-code text-[#5B4226] uppercase mb-2">// SCHEMATICS — REV.07</p>
                <h2 className="font-display-lg text-display-lg text-[#5B4226] uppercase">FIELD-SERVICEABLE</h2>
              </div>
              <p className="font-body-mono text-body-mono text-[#5B4226] max-w-sm md:text-right">Every component is a serviceable component. Pull the panel, swap the board, run diagnostics. Three pages here. The full set ships with each unit.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {schematics.map(s => (
                <article key={s.code} className="crt-screen border-2 border-[#5B4226] p-5 flex flex-col gap-3">
                  <div className="flex justify-between font-status-code text-status-code text-[#FFB947] relative z-10"><span>{s.code}</span><span className={s.revCls}>{s.rev}</span></div>
                  <h3 className="font-display-lg text-xl text-[#FFB947] uppercase tracking-tight relative z-10">{s.title}</h3>
                  <pre className="font-mono text-xs text-[#FFB947]/90 leading-relaxed relative z-10">{s.art}</pre>
                  <div className="font-body-mono text-xs text-[#FFB947]/70 mt-auto pt-2 border-t border-[#FFB947]/20 relative z-10 flex justify-between"><span>{s.sheet}</span><span className="tabular-nums">{s.sig}</span></div>
                </article>
              ))}
            </div>
          </section>

          {/* Telemetry — 6 instrument tiles */}
          <section className="hardware-panel p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 mb-6 border-b-2 border-[#5B4226]">
              <div>
                <p className="font-status-code text-status-code text-[#5B4226] uppercase mb-2">// TELEMETRY — REAL-TIME</p>
                <h2 className="font-display-lg text-display-lg text-[#5B4226] uppercase">OPERATOR DASHBOARD</h2>
              </div>
              <p className="font-body-mono text-body-mono text-[#5B4226] max-w-sm md:text-right">Six channels of live telemetry from the demo bench. Refresh on the second. Tap a tile for the full reading.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border-2 border-[#5B4226] bevel-in bg-[#1A1A1A] p-4 flex flex-col gap-3 min-h-[180px]">
                <div className="flex justify-between font-status-code text-base text-[#FFB947] uppercase"><span>VOLTAGE</span><span className="text-[#7FC774]">●</span></div>
                <div className="relative h-3 border border-[#FFB947]/40 bg-[#5B4226]/40 mt-auto">
                  <div className="absolute inset-y-0 left-0 bg-[#FFB947]" style={{ width: "78%", boxShadow: "0 0 8px #FFB947" }} />
                </div>
                <div className="font-status-code text-2xl text-[#FFB947] tabular-nums">220.4 <span className="text-base opacity-60">V_AC</span></div>
                <div className="font-body-mono text-[10px] text-[#FFB947]/60 uppercase tracking-widest flex justify-between"><span>L1·L2·L3</span><span>NOMINAL</span></div>
              </div>

              <div className="border-2 border-[#5B4226] bevel-in bg-[#1A1A1A] p-4 flex flex-col items-center gap-2 min-h-[180px]">
                <div className="flex justify-between w-full font-status-code text-base text-[#FFB947] uppercase"><span>REACTOR</span><span className="text-[#FFB947]">●</span></div>
                <div className="relative w-20 h-20 rounded-full" style={{ background: "conic-gradient(#FFB947 0% 64%, #5B4226 64% 100%)" }}>
                  <div className="absolute inset-2 rounded-full bg-[#1A1A1A] flex items-center justify-center font-status-code text-lg text-[#FFB947] tabular-nums">64°</div>
                </div>
                <div className="font-body-mono text-[10px] text-[#FFB947]/60 uppercase tracking-widest mt-auto">CORE / WATCH</div>
              </div>

              <div className="border-2 border-[#5B4226] bevel-in bg-[#1A1A1A] p-4 flex flex-col gap-3 min-h-[180px]">
                <div className="flex justify-between font-status-code text-base text-[#FFB947] uppercase"><span>SECTORS</span><span className="text-[#7FC774]">●</span></div>
                <div className="grid grid-cols-4 gap-1 mt-auto">
                  {ledMatrix.map((c, i) => (
                    <span key={i} className="aspect-square" style={{ backgroundColor: c, boxShadow: c === "#5B4226" ? "none" : `0 0 6px ${c}` }} />
                  ))}
                </div>
                <div className="font-body-mono text-[10px] text-[#FFB947]/60 uppercase tracking-widest flex justify-between"><span>10/12 ACTIVE</span><span>S04 STBY</span></div>
              </div>

              <div className="border-2 border-[#5B4226] bevel-in bg-[#1A1A1A] p-4 flex flex-col gap-3 min-h-[180px] crt-screen">
                <div className="flex justify-between font-status-code text-base text-[#FFB947] uppercase relative z-10"><span>SIGNAL</span><span className="text-[#7FC774]">●</span></div>
                <pre className="font-mono text-[10px] text-[#7FC774] leading-tight relative z-10 mt-auto">{`   _    _      _    _
  / \\  / \\    / \\  / \\
_/   \\/   \\__/   \\/   \\_`}</pre>
                <div className="font-status-code text-lg text-[#FFB947] tabular-nums relative z-10">2.4 <span className="text-sm opacity-60">KHZ</span></div>
                <div className="font-body-mono text-[10px] text-[#FFB947]/60 uppercase tracking-widest relative z-10">CARRIER LOCK</div>
              </div>

              <div className="border-2 border-[#5B4226] bevel-in bg-[#1A1A1A] p-4 flex flex-col gap-3 min-h-[180px]">
                <div className="flex justify-between font-status-code text-base text-[#FFB947] uppercase"><span>UPTIME</span><span className="text-[#7FC774]">●</span></div>
                <div className="font-status-code text-4xl md:text-5xl text-[#FFB947] tabular-nums mt-auto" style={{ textShadow: "0 0 8px rgba(255,185,71,0.6)" }}>1024:47:12</div>
                <div className="font-body-mono text-[10px] text-[#FFB947]/60 uppercase tracking-widest flex justify-between"><span>HRS:MIN:SEC</span><span>UNBROKEN</span></div>
              </div>

              <div className="border-2 border-[#5B4226] bevel-in bg-[#1A1A1A] p-4 flex flex-col gap-2 min-h-[180px] crt-screen">
                <div className="flex justify-between font-status-code text-base text-[#FFB947] uppercase relative z-10"><span>LOG</span><span className="text-[#7FC774]">●</span></div>
                <pre className="font-mono text-[11px] text-[#7FC774] leading-snug relative z-10 mt-auto whitespace-pre-wrap">{`[06:14] OK  CTRL.A boot
[06:14] OK  CRT.C lit
[06:15] OK  PWR.D online
[06:18] STA WATCH start
> _`}</pre>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#1A1A1A] dark:bg-[#0A0A0A] w-full border-t-8 border-[#5B4226] p-12 shadow-[inset_0_20px_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto px-8 relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] after:bg-[length:100%_2px,3px_100%] mt-auto">
          <div className="text-[#FFB947] font-bold font-mono uppercase text-xs tracking-[0.2em] relative z-10">
            ©1979 PANEL-7 INDUSTRIAL SYSTEMS | USCSS NOSTROMO COMPLIANT
          </div>
          <nav className="flex gap-6 relative z-10 font-mono uppercase text-xs tracking-[0.2em]">
            {footerLinks.map(l => (
              <a key={l.label} href="#" className={l.active
                ? "text-[#FFB947] underline underline-offset-4 transition-opacity duration-300 hover:text-[#FFB947]"
                : "text-[#FFB947]/60 transition-opacity duration-300 hover:text-[#FFB947]"}>
                {l.label}
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
}
