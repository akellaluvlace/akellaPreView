export default function T110ArcadeHardwareBrutal() {
  const navLinks = [
    { label: "Nexus", active: true },
    { label: "Alchemy" },
    { label: "Manifesto" },
    { label: "Grid" },
  ];
  const teleMarquee = [
    { kind: "icon", icon: "bolt", text: "POWER · NOMINAL — 4.7 KW" },
    { kind: "plain", text: "UPTIME · 1024 HRS" },
    { kind: "pill", text: "CALIBRATION : LOCKED" },
    { kind: "icon", icon: "memory", text: "CORE · OPERATIONAL" },
    { kind: "plain", text: "FREQ · 33.6 MHz" },
    { kind: "pill", text: "SECTOR · A07" },
  ];
  const consoleLines = [
    { time: "[14:22:08]", timeClass: "text-secondary", body: "nexus.core > module sync OK · ports A1, B2, C3 nominal" },
    { time: "[14:22:09]", timeClass: "text-secondary", body: "nexus.core > voltage stable · 4.703 KW / target 4.700" },
    { time: "[14:22:11]", timeClass: "text-secondary", body: "nexus.alchemy > transmute pipeline drained · queue 0/64" },
    { time: "[14:22:14]", timeClass: "text-tertiary", body: "nexus.warn   > channel 06 entered IDLE · supervisor notified" },
    { time: "[14:22:18]", timeClass: "text-secondary", body: "nexus.core > calibration cycle complete · drift ±0.002" },
  ];
  const footerLinks = ["Hardware", "Software", "Spirituality", "Contact"];
  const customCss = `
    .crt-scanline {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
    .wood-texture {
      background-image: repeating-linear-gradient(45deg, rgba(61, 43, 31, 0.1) 0px, rgba(61, 43, 31, 0.1) 2px, transparent 2px, transparent 4px);
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes marquee-reverse {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
  `;
  const TeleItems = () => (
    <>
      {teleMarquee.map((item, i) => (
        <React.Fragment key={i}>
          {item.kind === "icon" && (
            <span><span className="material-symbols-outlined text-[14px] align-middle mr-1">{item.icon}</span> {item.text}</span>
          )}
          {item.kind === "plain" && <span>{item.text}</span>}
          {item.kind === "pill" && <span className="bg-on-tertiary-fixed text-tertiary-fixed px-2 rounded-full py-0.5">{item.text}</span>}
          <span className="text-secondary-container">+++</span>
        </React.Fragment>
      ))}
    </>
  );
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400..700;1,400..700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#f2ca50", "on-primary": "#3c2f00",
                "primary-container": "#d4af37", "on-primary-container": "#554300",
                "primary-fixed": "#ffe088", "primary-fixed-dim": "#e9c349",
                "on-primary-fixed": "#241a00", "on-primary-fixed-variant": "#574500",
                "secondary": "#e9bacd", "on-secondary": "#462736",
                "secondary-container": "#5f3c4d", "on-secondary-container": "#d6a9bc",
                "secondary-fixed": "#ffd8e7", "secondary-fixed-dim": "#e9bacd",
                "on-secondary-fixed": "#2e1221",
                "tertiary": "#c3d0dc", "on-tertiary": "#25323b",
                "tertiary-fixed": "#d6e4f0", "tertiary-fixed-dim": "#bac8d4",
                "tertiary-container": "#a7b5c0", "on-tertiary-container": "#3a4750",
                "on-tertiary-fixed": "#101d25",
                "surface": "#131313", "on-surface": "#e5e2e1", "on-surface-variant": "#d0c5af",
                "surface-container-lowest": "#0e0e0e", "surface-container-low": "#1c1b1b",
                "surface-container": "#201f1f", "surface-container-high": "#2a2a2a",
                "surface-container-highest": "#353534",
                "surface-variant": "#353534", "surface-bright": "#3a3939", "surface-dim": "#131313",
                "outline": "#99907c", "outline-variant": "#4d4635",
                "background": "#131313", "on-background": "#e5e2e1",
                "error": "#ffb4ab", "error-container": "#93000a", "on-error": "#690005"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "unit": "4px", "gutter": "24px", "panel-padding": "16px", "margin": "48px" },
              fontFamily: {
                "headline-lg": ["Noto Serif"], "headline-display": ["Noto Serif"], "kinetic-quote": ["Noto Serif"],
                "body-md": ["Space Grotesk"], "label-mono": ["Space Grotesk"]
              },
              fontSize: {
                "headline-lg": ["48px", { lineHeight: "110%", fontWeight: "600" }],
                "headline-display": ["84px", { lineHeight: "90%", letterSpacing: "-0.04em", fontWeight: "700" }],
                "kinetic-quote": ["24px", { lineHeight: "140%", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "150%", fontWeight: "400" }],
                "label-mono": ["12px", { lineHeight: "100%", letterSpacing: "0.1em", fontWeight: "500" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-4 bg-black/90 backdrop-blur-md border-b-2 border-[#D4AF37]">
          <div className="text-2xl font-black tracking-widest text-[#D4AF37] font-headline-display">THE NEXUS</div>
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((l) => (
              <a key={l.label} href="#" className={l.active
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 font-serif tracking-tighter uppercase translate-y-0.5 transition-all"
                : "text-gray-400 font-mono text-xs hover:text-pink-300 dark:hover:text-pink-200 transition-colors font-serif tracking-tighter uppercase"
              }>{l.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-yellow-600 dark:text-[#D4AF37]">
            <button className="font-serif tracking-tighter uppercase border-2 border-primary-container px-4 py-2 hover:bg-primary-container hover:text-on-primary-container transition-colors">INITIALIZE</button>
            <span className="material-symbols-outlined hover:text-pink-300 cursor-pointer">terminal</span>
            <span className="material-symbols-outlined hover:text-pink-300 cursor-pointer">settings</span>
          </div>
        </header>
        <main className="flex-grow pt-[80px]">
          <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-gutter" style={{ backgroundColor: "#1a0f00" }}>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img alt="Hardware backdrop" src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1920&q=85&auto=format&fit=crop" className="w-full h-full object-cover opacity-35 mix-blend-luminosity grayscale contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, #1a0f00 110%)" }} />
              <div className="absolute inset-0 crt-scanline opacity-60" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-container/20 blur-[140px]" />
            </div>
            <div className="relative z-10 text-center flex flex-col items-center">
              <h1 className="font-headline-display text-headline-display text-primary-container mix-blend-difference drop-shadow-[0_4px_24px_rgba(212,175,55,0.4)] tracking-tighter uppercase z-20">TRANSCEND</h1>
              <p className="font-kinetic-quote text-kinetic-quote text-white font-bold mt-8 max-w-2xl text-center italic tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                Where heavy machinery meets ethereal silence. The alchemy of the new industrial age.
              </p>
              <div className="mt-12 flex gap-gutter">
                <button className="bg-primary text-on-primary-fixed font-label-mono text-label-mono px-8 py-4 border-2 border-primary-container shadow-[2px_2px_0px_0px_rgba(212,175,55,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all uppercase">
                  Engage Protocol
                </button>
              </div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-surface-variant font-label-mono text-label-mono flex flex-col items-center gap-2">
              <span>SCROLL TO INITIATE</span>
              <span className="material-symbols-outlined animate-bounce">arrow_downward</span>
            </div>
          </section>
          <section className="py-4 bg-tertiary overflow-hidden border-y-4 border-outline whitespace-nowrap flex items-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <div className="animate-[marquee-reverse_22s_linear_infinite] flex items-center gap-8 text-on-tertiary-fixed font-label-mono text-label-mono uppercase tracking-widest">
              <TeleItems />
              <TeleItems />
            </div>
          </section>
          <section className="py-20 md:py-28 px-gutter bg-surface-container-lowest relative border-t-2 border-outline-variant">
            <div className="max-w-[1440px] mx-auto">
              <div className="flex justify-between items-end mb-12 border-b-2 border-primary-container pb-4">
                <h2 className="font-headline-lg text-headline-lg text-primary-container uppercase">Hardware Modules</h2>
                <span className="font-label-mono text-label-mono text-surface-variant">SEC. 02 // GRD.SYS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">MOD-A1</div>
                  <div className="h-64 border-2 border-primary-container relative overflow-hidden p-4 flex flex-col justify-between" style={{ backgroundColor: "#1a0f00" }}>
                    <img alt="Circuit board" src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&q=85&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale contrast-125 pointer-events-none" />
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f00] via-[#1a0f00]/40 to-transparent pointer-events-none" style={{ zIndex: 6 }} />
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="material-symbols-outlined text-primary-container opacity-70 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">memory</span>
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80 animate-pulse">REC</span>
                    </div>
                    <div className="relative z-10 text-primary-container font-label-mono drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]">
                      <div className="text-xs mb-1">&gt; SYS.BOOT_SEQ:</div>
                      <div className="text-sm opacity-90">LOADING KERNEL...</div>
                      <div className="w-full h-1 bg-surface-variant/80 mt-2"><div className="h-full bg-primary-container w-[45%] shadow-[0_0_8px_rgba(212,175,55,0.6)]" /></div>
                    </div>
                  </div>
                </div>
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group md:translate-y-8">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">MOD-B2</div>
                  <div className="h-64 border-2 border-primary-container relative overflow-hidden p-4 flex flex-col justify-between" style={{ backgroundColor: "#1a0f00" }}>
                    <img alt="Server rack" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=85&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale contrast-125 pointer-events-none" />
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f00] via-[#1a0f00]/40 to-transparent pointer-events-none" style={{ zIndex: 6 }} />
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="material-symbols-outlined text-primary-container opacity-70 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">router</span>
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80">SYNC</span>
                    </div>
                    <div className="relative z-10 text-primary-container font-label-mono flex flex-col gap-2 drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary opacity-90 shadow-[0_0_6px_rgba(233,186,205,0.7)]" /> <span>PORT: 8080</span></div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-tertiary opacity-90 shadow-[0_0_6px_rgba(195,208,220,0.7)]" /> <span>LINK: STABLE</span></div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary-container opacity-90 shadow-[0_0_6px_rgba(212,175,55,0.8)] animate-pulse" /> <span>TX/RX: 47.2 KB/S</span></div>
                    </div>
                  </div>
                </div>
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">MOD-C3</div>
                  <div className="h-64 border-2 border-primary-container relative overflow-hidden p-4 flex flex-col justify-center items-center" style={{ backgroundColor: "#1a0f00" }}>
                    <img alt="Control panel" src="https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1000&q=85&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale contrast-125 pointer-events-none" />
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle, transparent 40%, #1a0f00 100%)", zIndex: 6 }} />
                    <span className="material-symbols-outlined text-headline-display text-primary-container opacity-25 absolute z-10 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">account_tree</span>
                    <button className="z-10 bg-surface-container-lowest/90 border-2 border-primary-container text-primary-container font-label-mono text-label-mono px-4 py-2 hover:bg-primary-container hover:text-on-primary-container transition-colors uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-sm">
                      Override
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-4 bg-secondary overflow-hidden border-y-4 border-outline whitespace-nowrap flex items-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-8 text-on-secondary-fixed font-label-mono text-label-mono uppercase tracking-widest">
              {[0, 1].map((dup) => (
                <React.Fragment key={dup}>
                  <span><span className="material-symbols-outlined text-[14px] align-middle mr-1">warning</span> HAZARD: ETHEREAL OVERFLOW</span>
                  <span className="text-tertiary-container">///</span>
                  <span>SYS.TEMP: OPTIMAL</span>
                  <span className="text-tertiary-container">///</span>
                  <span className="bg-primary text-on-primary px-2 rounded-full py-0.5">MAINTENANCE REQ.</span>
                  <span className="text-tertiary-container">///</span>
                </React.Fragment>
              ))}
            </div>
          </section>
          <section className="py-margin px-gutter bg-surface-container-lowest relative border-t-2 border-outline-variant">
            <div className="max-w-[1440px] mx-auto">
              <div className="flex justify-between items-end mb-12 border-b-2 border-primary-container pb-4">
                <h2 className="font-headline-lg text-headline-lg text-primary-container uppercase">Operational Telemetry</h2>
                <span className="font-label-mono text-label-mono text-surface-variant">SEC. 03 // DIAG.RT</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gutter">
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group md:translate-y-8">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">DIAG-01</div>
                  <div className="h-48 border-2 border-primary-container relative overflow-hidden p-3 flex flex-col" style={{ backgroundColor: "#1a0f00" }}>
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="relative z-10 flex justify-between items-start mb-2">
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80">VOLT</span>
                      <span className="material-symbols-outlined text-[16px] text-primary-container opacity-70">bolt</span>
                    </div>
                    <div className="relative z-10 flex-1 flex items-end gap-1">
                      <div className="flex flex-col-reverse gap-px h-full justify-end">
                        {[1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.3].map((opacity, i) => (
                          <div key={i} className={opacity === 1 ? "w-2 h-1.5 bg-primary-container shadow-[0_0_4px_rgba(212,175,55,0.6)]" : opacity === 0.5 ? "w-2 h-1.5 bg-primary-container/50" : "w-2 h-1.5 bg-primary-container/30"} />
                        ))}
                      </div>
                      <div className="flex-1 flex flex-col items-end justify-end">
                        <span className="font-label-mono text-2xl text-primary-container drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]">4.7</span>
                        <span className="font-label-mono text-[10px] text-primary-container opacity-60">KW</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">DIAG-02</div>
                  <div className="h-48 border-2 border-primary-container relative overflow-hidden p-3 flex flex-col" style={{ backgroundColor: "#1a0f00" }}>
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="relative z-10 flex justify-between items-start mb-2">
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80">FREQ</span>
                      <span className="material-symbols-outlined text-[16px] text-primary-container opacity-70">graphic_eq</span>
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center">
                      <div className="relative w-24 h-24 rounded-full border-2 border-primary-container/40" style={{ background: "conic-gradient(#d4af37 0deg 244deg, transparent 244deg 360deg)" }}>
                        <div className="absolute inset-2 rounded-full bg-[#1a0f00] flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-label-mono text-base text-primary-container drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]">33.6</div>
                            <div className="font-label-mono text-[8px] text-primary-container opacity-60">MHz</div>
                          </div>
                        </div>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-secondary" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">DIAG-03</div>
                  <div className="h-48 border-2 border-primary-container relative overflow-hidden p-3 flex flex-col" style={{ backgroundColor: "#1a0f00" }}>
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="relative z-10 flex justify-between items-start mb-2">
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80">TEMP</span>
                      <span className="material-symbols-outlined text-[16px] text-primary-container opacity-70">device_thermostat</span>
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center">
                      <div className="relative w-24 h-24 rounded-full" style={{ background: "conic-gradient(from 135deg, transparent 0deg 27deg, #c3d0dc 27deg 135deg, #d4af37 135deg 200deg, #e9bacd 200deg 270deg, transparent 270deg 360deg)" }}>
                        <div className="absolute inset-2 rounded-full bg-[#1a0f00] flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-label-mono text-base text-primary-container drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]">62°</div>
                            <div className="font-label-mono text-[8px] text-primary-container opacity-60">CELSIUS</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 flex justify-between font-label-mono text-[8px] text-primary-container opacity-60">
                      <span>COOL</span><span>OPT</span><span>WARN</span>
                    </div>
                  </div>
                </div>
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group md:translate-y-8">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">DIAG-04</div>
                  <div className="h-48 border-2 border-primary-container relative overflow-hidden p-3 flex flex-col" style={{ backgroundColor: "#1a0f00" }}>
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="relative z-10 flex justify-between items-start mb-2">
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80">SIGNAL</span>
                      <span className="material-symbols-outlined text-[16px] text-primary-container opacity-70 animate-pulse">cell_tower</span>
                    </div>
                    <div className="relative z-10 flex-1 flex items-end gap-px">
                      {[
                        { o: 30, h: 30 }, { o: 40, h: 55 }, { o: 50, h: 40 }, { o: 60, h: 75 },
                        { o: 70, h: 50 }, { o: 80, h: 90 }, { o: 100, h: 60 }, { o: 80, h: 85 },
                        { o: 70, h: 45 }, { o: 60, h: 70 }, { o: 50, h: 35 }, { o: 40, h: 55 },
                      ].map((b, i) => (
                        <div key={i} className={b.o === 100 ? "flex-1 bg-primary-container shadow-[0_0_4px_rgba(212,175,55,0.6)]" : `flex-1 bg-primary-container/${b.o}`} style={{ height: `${b.h}%` }} />
                      ))}
                    </div>
                    <div className="relative z-10 mt-2 flex justify-between font-label-mono text-[8px] text-primary-container opacity-60">
                      <span>-12s</span><span>NOW</span>
                    </div>
                  </div>
                </div>
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group md:translate-y-8">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">DIAG-05</div>
                  <div className="h-48 border-2 border-primary-container relative overflow-hidden p-3 flex flex-col" style={{ backgroundColor: "#1a0f00" }}>
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="relative z-10 flex justify-between items-start mb-3">
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80">CHANNELS</span>
                      <span className="material-symbols-outlined text-[16px] text-primary-container opacity-70">grid_view</span>
                    </div>
                    <div className="relative z-10 flex-1 grid grid-cols-4 gap-2 content-start">
                      {["p", "p", "s", "p", "p", "off", "p", "p", "t", "p", "p", "off"].map((kind, i) => (
                        <div key={i} className={
                          kind === "p" ? "aspect-square bg-primary-container shadow-[0_0_6px_rgba(212,175,55,0.7)]" :
                          kind === "s" ? "aspect-square bg-secondary shadow-[0_0_6px_rgba(233,186,205,0.7)]" :
                          kind === "t" ? "aspect-square bg-tertiary shadow-[0_0_6px_rgba(195,208,220,0.7)]" :
                          "aspect-square bg-primary-container/30"
                        } />
                      ))}
                    </div>
                    <div className="relative z-10 mt-2 font-label-mono text-[8px] text-primary-container opacity-60 flex justify-between">
                      <span>10/12 ACTIVE</span><span className="text-secondary">2 IDLE</span>
                    </div>
                  </div>
                </div>
                <div className="border-[3px] border-[#8B5A2B] wood-texture bg-[#2A1B12] p-2 relative group">
                  <div className="absolute top-0 right-0 p-1 font-label-mono text-[8px] text-primary-container bg-surface-container-lowest border-b-2 border-l-2 border-[#8B5A2B] z-20">DIAG-06</div>
                  <div className="h-48 border-2 border-primary-container relative overflow-hidden p-3 flex flex-col" style={{ backgroundColor: "#1a0f00" }}>
                    <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                    <div className="relative z-10 flex justify-between items-start mb-2">
                      <span className="font-label-mono text-[10px] text-primary-container opacity-80">UPTIME</span>
                      <span className="material-symbols-outlined text-[16px] text-primary-container opacity-70 animate-pulse">schedule</span>
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                      <div className="font-headline-display text-[40px] leading-none text-primary-container drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">1024</div>
                      <div className="font-label-mono text-[10px] text-primary-container opacity-70 tracking-widest mt-1">HOURS · 32 MIN</div>
                      <div className="w-full h-1 bg-surface-variant/80 mt-3"><div className="h-full bg-primary-container w-[88%] shadow-[0_0_6px_rgba(212,175,55,0.6)]" /></div>
                    </div>
                    <div className="relative z-10 font-label-mono text-[8px] text-primary-container opacity-60 mt-2 flex justify-between">
                      <span>SINCE COLD-START</span><span className="text-primary-container">88%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 border-2 border-outline bg-[#1a0f00] relative overflow-hidden p-4">
                <div className="absolute inset-0 crt-scanline pointer-events-none" style={{ zIndex: 5 }} />
                <div className="absolute top-0 left-0 px-2 py-1 bg-[#8B5A2B] font-label-mono text-[8px] text-on-primary uppercase tracking-widest z-20">Live Console — /var/log/nexus.out</div>
                <div className="relative z-10 mt-6 font-label-mono text-[10px] md:text-xs text-primary-container space-y-1 leading-relaxed">
                  {consoleLines.map((line) => (
                    <div key={line.time + line.body}><span className={line.timeClass}>{line.time}</span> {line.body}</div>
                  ))}
                  <div><span className="text-primary-container">[14:22:21]</span> nexus.echo   &gt; <span className="animate-pulse">_</span></div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-margin px-gutter bg-surface-container relative">
            <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter relative">
              <div className="absolute left-0 top-1/2 w-32 h-64 bg-error opacity-10 mix-blend-overlay -translate-y-1/2 blur-md" />
              <div className="md:col-span-8 relative z-10">
                <h2 className="font-headline-lg text-headline-lg text-primary-container mb-8 uppercase border-l-4 border-primary pl-4">The Manifesto</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-lg leading-relaxed">
                  We forge the future from the brutal remnants of the past. The cold steel of logic, softened by the unpredictable warmth of organic thought.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-lg leading-relaxed">
                  This is not mere design. It is <span className="text-secondary italic font-serif">Transcendental Alchemy</span>. The transmutation of base data into a luxurious experience.
                </p>
                <div className="bg-surface-dim border-l-2 border-tertiary p-4 mt-8">
                  <code className="font-label-mono text-[10px] text-tertiary-fixed block whitespace-pre">{`def transmute(base_matter):
    if base_matter == 'raw_data':
        return apply_gold_leaf(base_matter)
    raise EtherealException("Matter lacks soul")`}</code>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col justify-center gap-4 relative z-10 mt-8 md:mt-0">
                <div className="w-full h-48 bg-surface-container-lowest border-2 border-outline relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity mix-blend-luminosity" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDU_sur74YHIsI7Wc4Xp4VbuMgeIXBW0nydlWWgwI1Cd51PUhACkl4BOO4YrGRFPj_9ieznD4qacE8iq7Zj7iWE-HgIWpV2PyIN0B8vX2TRKvNaFgpHuPmuHCmpXxeKm_3BaMp2PnDvuB65_JWU9hIoeHcsufZkDiLvpfVLITzwPXduV8O1sZ6cFkSF9pnSCYO3cTL6hjETsH5c8e0NtxJAbX1LD30XYJ_oLw6LZIRJfhhX9dkLg8VZ8aztKRgl979GJRkvLbSFT605')" }} />
                  <div className="absolute bottom-2 left-2 font-label-mono text-[10px] text-primary-container bg-surface-container-lowest/80 px-1">FIG. 01 - GEARS</div>
                </div>
                <div className="w-full h-32 bg-secondary/10 border-2 border-secondary border-dashed flex items-center justify-center">
                  <span className="font-label-mono text-secondary text-xs tracking-widest uppercase">Organic Input Recv.</span>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full py-12 px-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#1A1A1A] border-t-4 border-double border-[#D4AF37] relative z-40">
          <div className="text-[#D4AF37] font-bold font-headline-lg text-xl tracking-widest uppercase text-center md:text-left">THE NEXUS</div>
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((l) => (
              <a key={l} href="#" className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black p-1 transition-colors">{l}</a>
            ))}
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] text-center md:text-right">
            ©2024 NEXUS HEAVY INDUSTRIES. ALL RIGHTS TRANSCENDED.
          </div>
        </footer>
      </div>
    </>
  );
}
