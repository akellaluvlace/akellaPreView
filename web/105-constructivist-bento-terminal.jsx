export default function T105ConstructivistBentoTerminal() {
  const navLinks = [
    { label: "MANIFESTO", active: true },
    { label: "MODULES" },
    { label: "TRANSMUTATIONS" },
    { label: "TERMINAL" },
  ];
  const footerLinks = [
    { label: "ENCRYPT_DATA", highlight: true },
    { label: "NEURAL_LINK" },
    { label: "VOID_RESOURCES" },
  ];
  const terminalContent = `   /\\ \\ \\/\\ \\ \\ \\/\\  \\  \\ \\ \\ \\ \\
  / /\\ \\ \\ \\ \\ \\ \\  \\  \\ \\ \\ \\ \\
 / /__\\ \\ \\ \\ \\ \\ \\  \\  \\ \\ \\ \\ \\
/ /____\\ \\ \\ \\_\\ \\ \\ \\__\\  \\ \\_\\ \\ \\
\\/______/ \\/____/ \\/____/   \\/____/

DIGITAL_ALCHEMY v0.7.4-alpha
> NODE.SECTOR.04 // TERM_42
=========================================
[INIT] sequence running.......... OK
[LOAD] primary modules........... OK
[LOAD] cipher.module............. OK
[LOAD] forge.daemon.............. OK
[LOAD] glyph.tables.............. OK
[BOOT] kernel/transmute.......... OK
[SYNC] uplink @ swiss_grid_03.... OK
[WARN] neural divergence detected
[SCAN] mem blocks: 0xFF03A2..FF1B
[SYNC] tx 24.7 MB  /  rx 18.2 MB
[STAT] cpu 78.4%   mem 4.2/8.0 GB
[NOTE] efficiency rating: 78.4%
[OK]   uplink stable @ 144 Hz
[QRY]  awaiting operator input...
> ALCHM > cast --transmute raw
[OK]   payload signed #7C0F19
> _`;
  const modules = [
    { code: "MOD_01 // CIPHER", stat: "v0.7.4",  title: "cipher.module", body: "Symmetric encryption pipeline. Stream-friendly. AES-256-GCM at 1.2 GB/s on commodity hardware.",          footL: "STATUS",     footR: "RUNNING", cardCls: "bg-surface-container-low text-on-surface", titleCls: "text-on-surface", bodyCls: "text-on-surface-variant", borderCls: "border-outline-variant", footRCls: "text-tertiary-fixed-dim", led: "bg-error" },
    { code: "MOD_02 // FORGE",  stat: "14.2k",   title: "forge.daemon",  body: "Code-synthesis worker. Reads spec, emits tested artefact, signs with payload. Runs deterministic.",       footL: "BUILDS / WK",footR: "+38%",    cardCls: "bg-surface-container-low text-on-surface", titleCls: "text-on-surface", bodyCls: "text-on-surface-variant", borderCls: "border-outline-variant", footRCls: "text-tertiary-fixed-dim", led: "bg-error" },
    { code: "MOD_03 // GLYPH",  stat: "∞ / 256", title: "glyph.tables",  body: "Symbol library. 256 base glyphs, infinite remixes, every export carries the SHA-3 trace of its parent.", footL: "SIGNED",     footR: "#7C0F19", cardCls: "bg-tertiary-container text-tertiary-fixed-dim", titleCls: "", bodyCls: "opacity-80", borderCls: "border-tertiary-fixed-dim/30", footRCls: "text-tertiary-fixed-dim", led: "bg-tertiary-fixed-dim" },
    { code: "MOD_04 // UPLINK", stat: "144 Hz",  title: "uplink.kernel", body: "Mesh networking with the swiss_grid. Latency budget: 7ms. Refuses to connect over plain HTTP.",            footL: "UPTIME",     footR: "99.97%",  cardCls: "bg-surface-container-low text-on-surface", titleCls: "text-on-surface", bodyCls: "text-on-surface-variant", borderCls: "border-outline-variant", footRCls: "text-tertiary-fixed-dim", led: "bg-error" },
  ];

  const feeds = [
    { id: "FEED_046", chip: "bg-tertiary-container text-tertiary-fixed-dim", title: "CIPHER_TRACE",  size: "36×48", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop", alt: "Macro circuit board traces in red light" },
    { id: "FEED_047", chip: "bg-error text-on-error",                        title: "UPLINK_RACK",   size: "28×40", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop", alt: "Server rack with blinking status LEDs" },
    { id: "FEED_048", chip: "bg-primary-fixed text-on-primary-fixed",        title: "FORGE_HEAD",    size: "36×40", src: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=900&auto=format&fit=crop", alt: "Industrial machinery in deep shadow" },
    { id: "FEED_049", chip: "bg-tertiary-container text-tertiary-fixed-dim", title: "SWISS_GRID_03", size: "40×54", src: "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=900&auto=format&fit=crop", alt: "Wide industrial server room" },
  ];

  const tenets = [
    { num: "I",   title: "SHIP THE TRACE.",     body: "Every artefact carries the SHA-3 of its parent. If you can't see the trace, you don't have the artefact." },
    { num: "II",  title: "REFUSE THE FEED.",    body: "No vendor telemetry, no algorithmic surfaces. The work is for the operator, not for the metric." },
    { num: "III", title: "ARM THE OPERATOR.",   body: "A tool that hides its own internals is hostile. Pull the panel, swap the board, run diagnostics." },
    { num: "IV",  title: "DECAY IS HONEST.",    body: "A daemon that wears its byte-count on the outside is a daemon you can trust to fail in public." },
  ];

  const ledMatrix = ["a","a","a","a","b","a","a","a","c"];

  const customCss = `
    .crt-scanlines {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
    .riso-grain { position: relative; }
    .riso-grain::before {
      content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E');
      pointer-events: none; mix-blend-mode: overlay; z-index: 10;
    }
    .bento-card { border: 2px solid #e5e2e1; position: relative; overflow: hidden; }
    .bento-card-red { border: 2px solid #e82f16; background-color: #1f0100; }
    .glowing-text { text-shadow: 0 0 10px rgba(255, 180, 166, 0.8), 0 0 20px rgba(255, 180, 166, 0.4); }
  `;
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#c9c6c5", "on-primary": "#313030",
                "primary-fixed": "#e5e2e1", "on-primary-fixed": "#1c1b1b",
                "primary-container": "#0a0a0a", "on-primary-container": "#7b7979",
                "tertiary": "#ffb4a6", "on-tertiary": "#660700",
                "tertiary-fixed-dim": "#ffb4a6", "tertiary-container": "#1f0100",
                "on-tertiary-container": "#e82f16",
                "surface": "#141313", "on-surface": "#e5e2e1", "on-surface-variant": "#c4c7c7",
                "surface-container-lowest": "#0e0e0e", "surface-container-low": "#1c1b1b",
                "surface-container": "#201f1f", "surface-container-high": "#2b2a2a",
                "surface-container-highest": "#353434",
                "outline": "#8e9192", "outline-variant": "#444748",
                "background": "#141313", "on-background": "#e5e2e1",
                "error": "#ffb4ab", "on-error": "#690005"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "unit": "4px", "panel-padding": "20px", "bento-gap": "12px", "margin": "24px", "gutter": "16px" },
              fontFamily: {
                "status-code": ["Space Grotesk"], "headline-heavy": ["Space Grotesk"],
                "terminal-body": ["Space Grotesk"], "display-hero": ["Space Grotesk"]
              },
              fontSize: {
                "status-code": ["12px", { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "500" }],
                "headline-heavy": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
                "terminal-body": ["14px", { lineHeight: "1.6", letterSpacing: "0.02em", fontWeight: "400" }],
                "display-hero": ["72px", { lineHeight: "1.0", letterSpacing: "-0.04em", fontWeight: "700" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-background text-on-background antialiased min-h-screen flex flex-col relative riso-grain">
        <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none" />
        <nav className="bg-[#0A0A0A] text-stone-200 font-mono uppercase tracking-tighter text-xs border-b-2 border-stone-200 fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 py-3">
          <div className="text-2xl font-black italic tracking-tighter text-red-600">DIGITAL_ALCHEMY</div>
          <div className="hidden md:flex gap-6">
            {navLinks.map((l) => (
              <a key={l.label} href="#" className={l.active
                ? "text-amber-400 font-bold border-b-2 border-amber-400 pb-1"
                : "text-stone-500 font-mono hover:bg-red-600 hover:text-stone-200 transition-colors duration-75"
              }>{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary-container text-on-primary-container border-2 border-stone-200 px-4 py-1 hover:bg-red-600 hover:text-stone-200 transition-colors duration-75 active:scale-95 active:translate-y-1">INITIATE_CONTACT</button>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-stone-200 hover:text-amber-400 cursor-pointer">settings_input_component</span>
              <span className="material-symbols-outlined text-stone-200 hover:text-amber-400 cursor-pointer">terminal</span>
            </div>
          </div>
        </nav>
        <main className="flex-grow pt-24 pb-16 px-6 max-w-[1600px] mx-auto w-full flex flex-col gap-bento-gap">
          <section className="grid grid-cols-1 md:grid-cols-12 grid-rows-none md:grid-rows-[minmax(300px,_auto)_minmax(200px,_auto)] gap-bento-gap">
            <div className="bento-card-red md:col-span-8 md:row-span-1 p-8 flex flex-col justify-end bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center bg-blend-multiply bg-[#e82f16] group hover:translate-x-[2px] hover:-translate-y-[2px] transition-transform duration-75 cursor-crosshair relative">
              <div className="absolute top-4 left-4 bg-surface px-2 py-1 border border-outline">
                <span className="font-status-code text-status-code text-on-surface">SYS_ERR_001</span>
              </div>
              <h1 className="font-display-hero text-display-hero text-background leading-none mix-blend-color-burn z-10 italic">WE<br />TRANSMUTE<br />CODE.</h1>
            </div>
            <div className="bento-card md:col-span-4 md:row-span-2 p-6 bg-surface-container-lowest flex flex-col font-terminal-body text-terminal-body text-tertiary-fixed-dim">
              <div className="flex justify-between items-center border-b-2 border-outline pb-2 mb-4">
                <span className="font-status-code text-status-code uppercase">TERM_42</span>
                <span className="material-symbols-outlined text-[16px]">terminal</span>
              </div>
              <pre className="glowing-text whitespace-pre-wrap overflow-hidden leading-tight text-[10px] md:text-[12px]">{terminalContent}</pre>
              {/* SCAN_LIVE — phosphor-green tinted live feed filling the rest of TERM_42 */}
              <figure className="mt-4 flex-grow border-2 border-outline-variant bg-black relative overflow-hidden min-h-[180px]">
                <img alt="Macro circuit-board traces, signal-feed ghost" className="absolute inset-0 w-full h-full object-cover grayscale contrast-150 opacity-60" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop" />
                <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(11,28,16,0.55) 0%, rgba(8,40,22,0.85) 60%, rgba(31,1,0,0.7) 100%)" }} />
                <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(127,199,116,0.35) 0%, transparent 70%)" }} />
                <div className="absolute inset-0 crt-scanlines pointer-events-none" />
                <div className="absolute top-2 left-2 bg-[#0b1c10] border border-[#7FC774] px-2 py-1 z-10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FC774] animate-pulse shadow-[0_0_6px_#7FC774]" />
                  <span className="font-status-code text-status-code text-[#7FC774] uppercase">SCAN_LIVE</span>
                </div>
                <figcaption className="absolute bottom-0 inset-x-0 bg-[#0b1c10]/90 border-t border-[#7FC774]/40 px-2 py-1 z-10 flex justify-between font-status-code text-status-code text-[#7FC774] uppercase">
                  <span>uplink @ swiss_grid_03</span>
                  <span className="tabular-nums opacity-80">144Hz · #7C0F19</span>
                </figcaption>
              </figure>
            </div>
            <div className="bento-card md:col-span-4 md:row-span-1 bg-surface-container h-[300px] md:h-auto overflow-hidden group">
              <div className="absolute top-4 right-4 bg-error px-2 py-1 z-20 mix-blend-exclusion">
                <span className="font-status-code text-status-code text-on-error">DATA_FEED_RAW</span>
              </div>
              <img alt="mechanical cpu components resembling a metallic heart with red lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdNCh2YQfSZktUoFqP7HcesTb4-mqkUW4V_pnkvV9pDC2bK2JdOcLK2QC45uX_kpqVC59-9TxIqugy8ecFe2P2rUq8Ww24GSg8ph-cuaTmx88DPcUe1qBQnDKG4DxlkODtjOo_lfCyidbUoPy3jrLjhPPzVdV3LpXHyTqJNk3ykBsFkkXnhrcZeE6hIv2yP_KWzE6vDtrJLfLVws2yvwPQ5eQyjY2uPIZoQz1TSfcmlzyF6sddnXMnvijPFWjnWepAdSQR260iWs4" className="w-full h-full object-cover filter grayscale contrast-150 group-hover:scale-105 transition-transform duration-500 mix-blend-luminosity opacity-80" />
            </div>
            <div className="bento-card md:col-span-4 md:row-span-1 p-6 bg-primary-fixed text-on-primary-fixed flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-status-code text-status-code">OPERATIONAL_STATUS</span>
                <div className="w-3 h-3 bg-error rounded-full animate-pulse shadow-[0_0_8px_#ffb4ab]" />
              </div>
              <div>
                <div className="font-headline-heavy text-headline-heavy">78.4%</div>
                <div className="font-terminal-body text-terminal-body uppercase">Efficiency Rating</div>
              </div>
              <button className="mt-4 border-2 border-on-primary-fixed px-4 py-2 font-status-code text-status-code uppercase hover:bg-on-primary-fixed hover:text-primary-fixed transition-colors">Run Diagnostics</button>
            </div>
          </section>

          {/* MODULES bento */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
            <div className="bento-card md:col-span-12 p-6 bg-surface-container flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="font-status-code text-status-code text-tertiary-fixed-dim uppercase">// SECTOR.04 // MODULES</span>
                <h2 className="font-headline-heavy text-headline-heavy text-on-surface mt-2">FOUR DAEMONS / IN ORBIT.</h2>
              </div>
              <p className="font-terminal-body text-terminal-body text-on-surface-variant max-w-md md:text-right">Each module ships as a self-contained kernel. Hot-swap, sign with your own key, run in your own grid. No phone-home.</p>
            </div>
            {modules.map(m => (
              <article key={m.code} className={`bento-card md:col-span-3 p-6 ${m.cardCls} flex flex-col gap-3 hover:bg-surface-container transition-colors`}>
                <div className="flex justify-between items-start">
                  <span className="font-status-code text-status-code text-tertiary-fixed-dim">{m.code}</span>
                  <div className={`w-2 h-2 ${m.led} rounded-full animate-pulse shadow-[0_0_6px_#ffb4ab]`} />
                </div>
                <div className={`font-display-hero text-[44px] leading-none tabular-nums mt-auto glowing-text ${m.titleCls}`}>{m.stat}</div>
                <h3 className={`font-headline-heavy text-[20px] uppercase ${m.titleCls}`}>{m.title}</h3>
                <p className={`font-terminal-body text-terminal-body ${m.bodyCls}`}>{m.body}</p>
                <div className={`mt-2 pt-3 border-t-2 ${m.borderCls} flex justify-between font-status-code text-status-code uppercase ${m.bodyCls}`}>
                  <span>{m.footL}</span><span className={m.footRCls}>{m.footR}</span>
                </div>
              </article>
            ))}
          </section>

          {/* TRANSMUTATIONS image strip */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
            <div className="bento-card md:col-span-12 p-6 bg-surface-container-lowest flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="font-status-code text-status-code text-tertiary-fixed-dim uppercase">// SECTOR.07 // TRANSMUTATIONS</span>
                <h2 className="font-headline-heavy text-headline-heavy text-on-surface mt-2">RAW FEED / N=05.</h2>
              </div>
              <p className="font-terminal-body text-terminal-body text-on-surface-variant max-w-md md:text-right">Field captures from the kiln rooms, swiss_grid, and cipher orbit. Auto-flushed every cycle.</p>
            </div>
            {feeds.map(f => (
              <figure key={f.id} className="bento-card md:col-span-3 aspect-[4/5] bg-surface-container-lowest overflow-hidden group">
                <div className={`absolute top-2 left-2 ${f.chip} px-2 py-1 z-20 font-status-code text-status-code`}>{f.id}</div>
                <img alt={f.alt} className="w-full h-full object-cover filter grayscale contrast-150 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" src={f.src} />
                <div className="absolute bottom-0 inset-x-0 bg-surface-container-lowest border-t-2 border-outline-variant px-3 py-2 font-status-code text-status-code text-on-surface-variant uppercase flex justify-between">
                  <span>{f.title}</span><span className="text-tertiary-fixed-dim tabular-nums">{f.size}</span>
                </div>
              </figure>
            ))}
            <figure className="bento-card md:col-span-12 aspect-[16/5] bg-surface-container-lowest overflow-hidden group">
              <div className="absolute top-2 left-2 bg-error text-on-error px-2 py-1 z-20 font-status-code text-status-code">FEED_050 // WIDE</div>
              <img alt="Brass apothecary objects on a dark surface" className="w-full h-full object-cover filter grayscale contrast-150 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600&auto=format&fit=crop" />
              <div className="absolute bottom-0 inset-x-0 bg-surface-container-lowest border-t-2 border-outline-variant px-4 py-2 font-status-code text-status-code text-on-surface-variant uppercase flex justify-between">
                <span>GLYPH_CABINET // BRASS_03</span><span className="text-tertiary-fixed-dim tabular-nums">120×38 // SIGNED #7C0F19</span>
              </div>
            </figure>
          </section>

          {/* MANIFESTO bento */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
            <div className="bento-card-red md:col-span-8 p-8 md:p-12 flex flex-col justify-between min-h-[420px] relative cursor-crosshair overflow-hidden">
              <img alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover grayscale contrast-150 opacity-50" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" />
              <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(7,30,16,0.92) 0%, rgba(11,40,22,0.88) 45%, rgba(31,1,0,0.75) 100%)" }} />
              <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(127,199,116,0.3) 0%, transparent 65%)" }} />
              <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-70" />
              <div className="absolute top-0 inset-x-0 h-px bg-[#7FC774]/40 z-10" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-[#7FC774]/40 z-10" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="bg-[#0b1c10] px-2 py-1 border border-[#7FC774] font-status-code text-status-code text-[#7FC774] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FC774] animate-pulse shadow-[0_0_6px_#7FC774]" />
                  // MANIFESTO_v4.2
                </span>
                <span className="bg-[#1f0100] px-2 py-1 border border-tertiary-fixed-dim font-status-code text-status-code text-tertiary-fixed-dim">SIG: #7C0F19</span>
              </div>
              <h2 className="relative z-10 font-display-hero text-[clamp(36px,_5vw,_64px)] leading-[0.95] italic uppercase text-tertiary-fixed-dim drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)]">CODE&nbsp;IS&nbsp;A<br />MATERIAL.<br /><span className="text-[#7FC774] glowing-text" style={{ textShadow: "0 0 14px rgba(127,199,116,0.8), 0 0 28px rgba(127,199,116,0.45)" }}>WE&nbsp;TREAT&nbsp;IT</span><br />LIKE&nbsp;ONE.</h2>
              <div className="relative z-10 flex flex-wrap gap-3 pt-6 border-t-2 border-[#7FC774]/40">
                <span className="font-status-code text-status-code text-[#7FC774] uppercase">— OPERATIONAL_URGENCY_v4.2</span>
                <span className="font-status-code text-status-code text-tertiary-fixed-dim uppercase ml-auto tabular-nums">DRAFTED // 04.MMXXIV</span>
              </div>
            </div>
            <div className="md:col-span-4 grid grid-cols-1 gap-bento-gap">
              <div className="bento-card p-5 bg-surface-container-lowest text-tertiary-fixed-dim flex flex-col font-terminal-body text-terminal-body relative">
                <div className="flex justify-between items-center border-b-2 border-outline pb-2 mb-3">
                  <span className="font-status-code text-status-code uppercase">UPTIME</span>
                  <span className="material-symbols-outlined text-[14px]">monitoring</span>
                </div>
                <div className="font-display-hero text-[36px] leading-none tabular-nums glowing-text">1024:47</div>
                <div className="font-terminal-body text-terminal-body uppercase opacity-70 mt-1">HRS:MIN // UNBROKEN</div>
                <div className="mt-auto pt-3 grid grid-cols-3 gap-1">
                  {ledMatrix.map((cell, i) => (
                    <span key={i} className={`aspect-square ${cell === "a" ? "bg-tertiary-fixed-dim shadow-[0_0_4px_#ffb4a6]" : cell === "b" ? "bg-error shadow-[0_0_4px_#ffb4ab]" : "bg-surface-container"}`} />
                  ))}
                </div>
              </div>
              <div className="bento-card p-5 bg-primary-fixed text-on-primary-fixed flex flex-col gap-2">
                <span className="font-status-code text-status-code uppercase">CONTACT_PROTOCOL</span>
                <p className="font-terminal-body text-terminal-body">SIGNED PGP ONLY. NO MEETINGS. CIPHER + UPLINK ONLY. INITIATE ON THE TERMINAL.</p>
                <button className="mt-2 border-2 border-on-primary-fixed px-3 py-2 font-status-code text-status-code uppercase hover:bg-on-primary-fixed hover:text-primary-fixed transition-colors">OPEN /dev/cipher</button>
              </div>
            </div>
            {tenets.map(t => (
              <article key={t.num} className="bento-card md:col-span-3 p-5 bg-surface-container-low flex flex-col gap-2">
                <span className="font-status-code text-status-code text-tertiary-fixed-dim">TENET / {t.num}</span>
                <h3 className="font-headline-heavy text-[20px] text-on-surface uppercase">{t.title}</h3>
                <p className="font-terminal-body text-terminal-body text-on-surface-variant">{t.body}</p>
              </article>
            ))}
          </section>
        </main>
        <footer className="bg-stone-200 text-zinc-950 font-mono font-black uppercase text-sm w-full py-16 px-10 flex flex-col items-start border-t-8 border-zinc-950 mt-auto cursor-crosshair relative z-40">
          <div className="text-5xl font-black text-red-600 italic tracking-tighter mb-4">DIGITAL_ALCHEMY</div>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {footerLinks.map((l) => (
              <a key={l.label} href="#" className={l.highlight
                ? "text-red-600 underline decoration-4 hover:bg-zinc-950 hover:text-stone-200 transition-all duration-100 p-1"
                : "text-zinc-900 hover:bg-zinc-950 hover:text-stone-200 transition-all duration-100 p-1"
              }>{l.label}</a>
            ))}
          </div>
          <div className="mt-auto text-zinc-900 border-t-2 border-zinc-950 pt-4 w-full text-xs">
            ©2024 DIGITAL_ALCHEMY // OPERATIONAL_URGENCY_v4.2
          </div>
        </footer>
      </div>
    </>
  );
}
