export default function T102NeonGlitchBrutalist() {
  const sideNav = [
    { icon: "history_edu", label: "Manifesto", active: true },
    { icon: "grid_view", label: "Protocols" },
    { icon: "security", label: "The Vault" },
    { icon: "leak_add", label: "Transmission" },
    { icon: "folder_open", label: "Archive" },
  ];
  const protocols = [
    { tag: "Protocol Alpha", icon: "data_object", title: "Data Synthesis", body: "Extraction and refinement of raw informational chaos into structured, actionable intelligence." },
    { tag: "Protocol Beta", icon: "hub", title: "Neural Routing", body: "Establishing uncompromising connections across disparate network topologies." },
    { tag: "Protocol Gamma", icon: "enhanced_encryption", title: "Cryptographic Seal", body: "Absolute security measures enforcing immutable boundaries around core assets." },
  ];
  const vaultImages = [
    { tag: "STR_01", alt: "high contrast black and white brutalist concrete architecture geometric shapes sharp shadows", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Kdg8U1zjkyr6Ef_RBlA0pFB-ydmCattUg0YGpO3anN-3_hXU60R1CuVvU9FL-Pm4a0_Aayf1VJoZ6clofJ2D105sRIrIInSAONJb3P5aYtB9xeuaQcVHQK583gzji4iLrDYQr2KIJBLSKTQtrX4HUNxnZHb3rM65Ux2QOax8sObKvbtaCLXjXOY7EXMVJ0XO_Z8A0JcJcrRSSa4w0NQ_4gVe9h3PjLc6kb7xYsuYFBL31CS8kXHTgedmExbWuREcJjX3j33kEjWH" },
    { tag: "STR_02", alt: "abstract geometric metallic structure stark lighting high contrast cyber aesthetic", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrDqmnCoRR_Bp0VsMgnZ_GwojS2BTdmfSV8Y-U0hZ5iTTC667VV-f5nx3IuWyMgx_2h9bYlUos9EWTmdICpdQBmc0yMVAdbvwqtcGNXu1pmg478I91d6eUnB4kTcH1jq0E7tG6rApulHY2YBnnCz1NZ8xHVwoOVWyKTdrqyWC7pGaW3USfiB6MDlReBrCi6g-fq5HXa0UHoqwq0eosFMcs3HKFnUYjYsaz6LKYT9vvlgSaU0JJSQ3Fz-SmL-ce4SOCQMol1hQws1It" },
    { tag: "STR_03", alt: "stark server racks stretching into darkness brutalist tech infrastructure cold lighting", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx5VzW6sidFDownythky03qygRtv8JDZNGRZlMIp3qqIfrDAfkmpLjb6GDGxk_321gDPPhpPSmLNde96-H-IDpdgUlN7iGh8r7reGRNzOdxd6HZmAcFsZsLBvhAdTIr-GMe9y0nDcf1wVzOIndGKCO3mNlDwnJ8sV2iJ9hsIyvtPQ-h7FMrYNymia4JAwiyfqXOWbMm1zhxwWX7h4fBgmw3G7JJVSdLn4Ad8ut6-SllysaPvQp4_RfydAFfSfUysfCjHwrU27eM94D" },
  ];
  const formFields = [
    { id: "ident", label: "IDENT (Name)", placeholder: "IDENT", type: "text" },
    { id: "vector", label: "VECTOR (Email)", placeholder: "VECTOR", type: "email" },
  ];
  const footerLinks = ["ENCRYPTED", "REBELLION", "SWISS_GRID"];
  const cyanFeedTiles = [
    { tag: "NODE_07", meta: "02:14 · ZRH", w: "w-72", aspect: "aspect-[3/4]", overlay: "linear-gradient(160deg, rgba(34,211,238,0.35) 0%, rgba(8,40,60,0.7) 100%)", blend: "mix-blend-multiply", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "server rack tinted cyan in dark room", shadow: true },
    { tag: "PKT · 0xA1", meta: "▲ STABLE", w: "w-96", aspect: "aspect-[16/10]", overlay: "radial-gradient(ellipse at 50% 60%, rgba(34,211,238,0.35) 0%, transparent 70%)", blend: "mix-blend-screen", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&auto=format&fit=crop", alt: "circuit board macro cyan tinted", shadow: false },
    { tag: "FAB · 19", meta: "04:48 · OSL", w: "w-80", aspect: "aspect-[16/10]", overlay: "linear-gradient(140deg, rgba(8,40,60,0.5) 0%, rgba(34,211,238,0.25) 100%)", blend: "mix-blend-multiply", src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1000&q=85&auto=format&fit=crop", alt: "industrial machinery cyan tinted", shadow: false },
    { tag: "RACK_22", meta: "06:12 · TYO", w: "w-72", aspect: "aspect-[3/4]", overlay: "linear-gradient(160deg, rgba(34,211,238,0.30) 0%, rgba(8,40,60,0.65) 100%)", blend: "mix-blend-multiply", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "server room wide shot cyan", shadow: false },
    { tag: "SITE_03", meta: "— DECODED", w: "w-80", aspect: "aspect-[16/10]", overlay: "radial-gradient(ellipse at 30% 40%, rgba(34,211,238,0.35) 0%, transparent 65%)", blend: "mix-blend-screen", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1000&q=85&auto=format&fit=crop", alt: "brutalist architecture cyan tinted", shadow: false, gray: true },
  ];
  const magentaFeedTiles = [
    { tag: "SIG_M_11", meta: "▼ ANOMALY", w: "w-80", aspect: "aspect-[16/10]", overlay: "linear-gradient(160deg, rgba(232,121,249,0.35) 0%, rgba(60,8,60,0.7) 100%)", blend: "mix-blend-multiply", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&q=85&auto=format&fit=crop", alt: "circuit board magenta tinted", shadow: true },
    { tag: "RELIC_04", meta: "— ARCHIVED", w: "w-72", aspect: "aspect-[3/4]", overlay: "radial-gradient(ellipse at 50% 60%, rgba(232,121,249,0.35) 0%, transparent 70%)", blend: "mix-blend-screen", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "server room magenta tinted", shadow: false },
    { tag: "VAULT_M", meta: "08:30 · BER", w: "w-96", aspect: "aspect-[16/10]", overlay: "linear-gradient(140deg, rgba(60,8,60,0.5) 0%, rgba(232,121,249,0.25) 100%)", blend: "mix-blend-multiply", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85&auto=format&fit=crop", alt: "server rack magenta tinted", shadow: false },
    { tag: "FORGE_M", meta: "▲ HOT", w: "w-72", aspect: "aspect-[3/4]", overlay: "linear-gradient(160deg, rgba(232,121,249,0.30) 0%, rgba(60,8,60,0.65) 100%)", blend: "mix-blend-multiply", src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", alt: "industrial machinery magenta tinted", shadow: false },
    { tag: "SITE_M", meta: "— DECRYPTED", w: "w-80", aspect: "aspect-[16/10]", overlay: "radial-gradient(ellipse at 70% 40%, rgba(232,121,249,0.40) 0%, transparent 65%)", blend: "mix-blend-screen", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1000&q=85&auto=format&fit=crop", alt: "brutalist architecture magenta tinted", shadow: false, gray: true },
  ];
  const bootSteps = [
    { num: "> 01_", color: "text-cyan-400", body: "HANDSHAKE :: SWISS_GRID" },
    { num: "> 02_", color: "text-cyan-400", body: "DECRYPT :: PAYLOAD ████" },
    { num: "> 03_", color: "text-magenta-400", body: "INJECT :: NEURAL ROUTE" },
    { num: "> 04_", color: "text-magenta-400", body: "SEAL :: CRYPTOGRAPHIC" },
    { num: "> 05_", color: "text-cyan-400", body: "MOUNT :: VAULT_03 OK" },
    { num: "> 06_", color: "text-cyan-400", body: "VERIFY :: SIG 0xA1 / 7F" },
    { num: "> 07_", color: "text-magenta-400", body: "PARSE :: GRID_LATTICE" },
    { num: "> 08_", color: "text-magenta-400", body: "ALLOC :: 2.4GB / NEURAL" },
    { num: "> 09_", color: "text-cyan-400", body: "BIND :: PORT 47 / 8443" },
    { num: "> 10_", color: "text-cyan-400", body: "ROUTE :: ZRH→OSL→TYO" },
    { num: "> 11_", color: "text-magenta-400", body: "AUDIT :: 47 NODES / 0 ERR" },
    { num: "> 12_", color: "text-magenta-400", body: "SYNC :: HEARTBEAT 60Hz" },
    { num: "> 13_", color: "text-cyan-400", body: "CACHE :: WARMING ░░░░░░" },
    { num: "> 14_", color: "text-cyan-400", body: "FLUSH :: BUFFER CLEAN" },
  ];
  const bootImages = [
    { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=85&auto=format&fit=crop", alt: "circuit board boot stage 01", delay: "0s" },
    { src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=85&auto=format&fit=crop", alt: "server rack boot stage 02", delay: "4s" },
    { src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1600&q=85&auto=format&fit=crop", alt: "industrial machinery boot stage 03", delay: "8s" },
    { src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=85&auto=format&fit=crop", alt: "server room wide boot stage 04", delay: "12s" },
  ];
  const tenets = [
    { num: "01", numColor: "text-cyan-400", borderColor: "border-cyan-400", chipBorder: "border-cyan-400/60", chipText: "text-cyan-400", plate: "PLATE · I", title: "Logic Over Comfort", body: "No round corners. No reassuring gradients. The grid is the gospel and the gospel is the grid.", overlay: "linear-gradient(135deg, rgba(34,211,238,0.30) 0%, rgba(0,0,0,0.6) 100%)", filter: "hue-rotate(170deg) saturate(1.5) contrast(1.3)", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", alt: "circuit board macro tenet 01", gray: false },
    { num: "02", numColor: "text-magenta-400", borderColor: "border-magenta-400", chipBorder: "border-magenta-400/60", chipText: "text-magenta-400", plate: "PLATE · II", title: "Glitch Is Honesty", body: "When the signal frays, we do not hide the fray. The seam is the truth of the cloth.", overlay: "linear-gradient(135deg, rgba(232,121,249,0.30) 0%, rgba(0,0,0,0.6) 100%)", filter: "hue-rotate(290deg) saturate(1.5) contrast(1.3)", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "server rack magenta tenet 02", gray: false },
    { num: "03", numColor: "text-cyan-400", borderColor: "border-cyan-400", chipBorder: "border-cyan-400/60", chipText: "text-cyan-400", plate: "PLATE · III", title: "No Apology, No Apology", body: "The architecture imposes itself. We have no need for the soft language of consent.", overlay: "linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(0,0,0,0.65) 100%)", filter: "hue-rotate(170deg) saturate(1.4) contrast(1.4)", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", alt: "brutalist architecture tenet 03", gray: true },
    { num: "04", numColor: "text-magenta-400", borderColor: "border-magenta-400", chipBorder: "border-magenta-400/60", chipText: "text-magenta-400", plate: "PLATE · IV", title: "The Machine Is The Witness", body: "It records what we forget. It forgets what we cannot stop recording. We are not in charge.", overlay: "linear-gradient(135deg, rgba(232,121,249,0.30) 0%, rgba(0,0,0,0.6) 100%)", filter: "hue-rotate(290deg) saturate(1.5) contrast(1.3)", src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", alt: "industrial machinery tenet 04", gray: false },
    { num: "05", numColor: "text-cyan-400", borderColor: "border-cyan-400", chipBorder: "border-cyan-400/60", chipText: "text-cyan-400", plate: "PLATE · V", title: "Encrypt Or Be Erased", body: "There is no neutral ground. The vault holds or it spills. We choose the vault, every time.", overlay: "linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(0,0,0,0.65) 100%)", filter: "hue-rotate(170deg) saturate(1.4) contrast(1.3)", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "server room wide tenet 05", gray: false },
  ];
  const faqItems = [
    { q: "// What is the protocol?", a: "A transmission framework for raw, unornamented systems. The protocol does not optimise for warmth — it optimises for signal.", chevColor: "text-cyan-400" },
    { q: "// Who is admitted?", a: "Architects of decrypted reality. Operators willing to read the manifesto without a translator. The handshake is the test.", chevColor: "text-magenta-400" },
    { q: "// Does the grid forget?", a: "The grid records selectively. The vault is the bias of the machine made visible. We do not pretend it is neutral.", chevColor: "text-cyan-400" },
    { q: "// Can the protocol be forked?", a: "Forks are noise. Mirrors are noise. There is one protocol; there is one signature. Anything else is a glitch we accept gracefully.", chevColor: "text-magenta-400" },
    { q: "// What happens at SYS.V.02?", a: "The next version is already corrupted in our favour. Expect heavier borders, sharper transitions, and one more colour we will not name in advance.", chevColor: "text-cyan-400" },
  ];
  const customCss = `
    .scanlines {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05));
      background-size: 100% 4px; pointer-events: none; z-index: 9999;
    }
    .brutalist-border { border: 2px solid white; }
    .brutalist-border-heavy { border: 4px solid white; }
    .neon-shadow-cyan { box-shadow: 2px 2px 0px 0px #22d3ee; }
    .neon-shadow-magenta { box-shadow: 2px 2px 0px 0px #e879f9; }
    .hover-neon-cyan:hover { box-shadow: 3px 3px 0px 0px #e879f9; background-color: #22d3ee; color: black; border-color: black; }
    @keyframes corrupt-glitch {
      0%, 100% { transform: translate(0); text-shadow: 1px 0 #d946ef, -1px 0 #22d3ee; }
      20% { transform: translate(-1px, 1px); text-shadow: 2px 0 #d946ef, -2px 0 #22d3ee; }
      40% { transform: translate(1px, -1px); clip-path: inset(20% 0 30% 0); text-shadow: -1px 0 #d946ef, 1px 0 #22d3ee; }
      55% { clip-path: inset(0 0 0 0); }
      60% { transform: translate(-1px, 0); text-shadow: 1px 0 #d946ef, -2px 0 #22d3ee; }
      80% { transform: translate(0, 1px); clip-path: inset(40% 0 10% 0); text-shadow: 2px 0 #d946ef, -2px 0 #22d3ee; }
      90% { clip-path: inset(0 0 0 0); }
    }
    .glitch-corrupt { display: inline-block; animation: corrupt-glitch 1.4s infinite steps(1); }
    @keyframes mt-grey-pulse {
      0%, 100% { background-color: #14181a; }
      50% { background-color: #232828; }
    }
    .mt-bg-pulse {
      background-image:
        repeating-radial-gradient(circle at 18% 38%, rgba(255,255,255,0.028) 0 70px, transparent 70px 140px),
        repeating-radial-gradient(circle at 82% 64%, rgba(255,255,255,0.022) 0 90px, transparent 90px 180px);
      animation: mt-grey-pulse 7s ease-in-out infinite;
    }
    html, body { overflow-x: clip; }
    .full-bleed-glitch {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }
    .feed-track { display: flex; gap: 16px; width: max-content; }
    @keyframes feed-marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 8px)); } }
    @keyframes feed-marquee-right { 0% { transform: translateX(calc(-50% - 8px)); } 100% { transform: translateX(0); } }
    .feed-track-left  { animation: feed-marquee-left 55s linear infinite; }
    .feed-track-right { animation: feed-marquee-right 65s linear infinite; }
    .feed-track:hover { animation-play-state: paused; }
    @keyframes boot-fade {
      0%, 4%   { opacity: 0; filter: hue-rotate(170deg) blur(14px) contrast(1.4); transform: scale(1.04) translateX(2px); }
      8%, 22%  { opacity: 1; filter: hue-rotate(170deg) blur(0)   contrast(1.2); transform: scale(1) translateX(0); }
      26%, 100%{ opacity: 0; filter: hue-rotate(290deg) blur(14px) contrast(1.4); transform: scale(1.04) translateX(-2px); }
    }
    .boot-cycle-img {
      animation: boot-fade 16s linear infinite;
      opacity: 0;
      filter: hue-rotate(170deg) blur(14px) contrast(1.4);
      transform: scale(1.04);
      will-change: opacity, filter, transform;
    }
    @keyframes boot-scrub { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
    .boot-scrub-bar { animation: boot-scrub 16s linear infinite; transform-origin: left; }
    @keyframes boot-cursor { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
    .boot-cursor { animation: boot-cursor 1s steps(1) infinite; }
    .glitch-faq summary::-webkit-details-marker { display: none; }
    .glitch-faq summary { list-style: none; cursor: pointer; }
    .glitch-faq summary .glitch-chevron { transition: transform 250ms ease; display: inline-block; }
    .glitch-faq[open] summary .glitch-chevron { transform: rotate(45deg); }
    .glitch-faq[open] summary .glitch-label { animation: corrupt-glitch 1.4s infinite steps(1); }
    @media (prefers-reduced-motion: reduce) {
      .glitch-corrupt { animation: none; }
      .mt-bg-pulse { animation: none; }
      .feed-track-left, .feed-track-right { animation: none; }
      .boot-cycle-img { animation: none; opacity: 1; filter: none; transform: none; }
      .boot-scrub-bar { animation: none; transform: scaleX(1); }
      .boot-cursor { animation: none; opacity: 1; }
      .glitch-faq summary .glitch-chevron { transition: none; }
      .glitch-faq[open] summary .glitch-label { animation: none; }
    }
  `;
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:ital,opsz,wght@1,6..72,400&family=Space+Grotesk:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#c6c6c6", "on-primary": "#303030",
                "surface": "#121414", "on-surface": "#e2e2e2", "on-surface-variant": "#cfc4c5",
                "surface-container-lowest": "#0c0f0f", "surface-container-low": "#1a1c1c",
                "surface-container": "#1e2020", "surface-container-high": "#282a2b",
                "surface-container-highest": "#333535",
                "background": "#121414", "outline-variant": "#4c4546",
                "cyan-400": "#22d3ee", "magenta-500": "#d946ef", "magenta-400": "#e879f9"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "unit": "8px", "gutter": "32px", "margin": "64px" },
              fontFamily: {
                "mono-label": ["Space Grotesk"], "headline-md": ["Space Grotesk"],
                "headline-lg": ["Space Grotesk"], "display-xl": ["Space Grotesk"],
                "editorial-italic": ["Newsreader"], "body-lg": ["Inter"], "body-sm": ["Inter"]
              },
              fontSize: {
                "mono-label": ["12px", { lineHeight: "16px", fontWeight: "700" }],
                "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
                "headline-md": ["32px", { lineHeight: "36px", fontWeight: "600" }],
                "editorial-italic": ["24px", { lineHeight: "32px", fontWeight: "400" }],
                "headline-lg": ["48px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
                "display-xl": ["120px", { lineHeight: "100px", letterSpacing: "-0.05em", fontWeight: "700" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-surface text-on-surface font-body-lg min-h-screen relative overflow-x-hidden pl-0 md:pl-20">
        <div className="scanlines" />
        <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm flex justify-between items-center pl-8 pr-20 md:pr-28 py-4 border-b-4 border-black dark:border-white">
          <div className="text-2xl font-black italic tracking-widest text-white dark:text-white uppercase">THE ALCHEMIST</div>
          <div className="flex gap-6 md:gap-8 items-center">
            <span className="material-symbols-outlined text-white/70 hover:text-cyan-400 transition-colors cursor-pointer p-1">terminal</span>
            <span className="material-symbols-outlined text-white/70 hover:text-cyan-400 transition-colors cursor-pointer p-1">sensors</span>
          </div>
        </header>
        <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 border-r-2 border-black dark:border-white bg-white dark:bg-black flex-col items-center py-12 gap-8 z-40 pt-24">
          {sideNav.map((n) => (
            <div key={n.label} className={n.active
              ? "group relative flex items-center justify-center w-full cursor-pointer"
              : "group relative flex items-center justify-center w-full cursor-pointer text-black dark:text-white opacity-40 hover:opacity-100 hover:bg-magenta-500/20 transition-all"
            }>
              <div className={n.active
                ? "bg-cyan-400 text-black border-2 border-black -mr-[2px] z-10 w-full flex justify-center py-4 scale-95 transition-transform"
                : "w-full flex justify-center py-4"
              }>
                <span className="material-symbols-outlined">{n.icon}</span>
              </div>
              <span className="absolute left-24 bg-black text-white px-2 py-1 font-mono-label text-mono-label uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap brutalist-border">{n.label}</span>
            </div>
          ))}
        </nav>
        <main className="relative w-full z-10 px-gutter pb-margin">
          <section className="full-bleed-glitch min-h-[819px] flex flex-col justify-center relative mb-margin border-y-4 md:border-4 border-white p-8 bg-surface-container-lowest overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity" />
            <div className="relative z-10 mt-12 mix-blend-difference flex justify-end pr-4 md:pr-8 lg:pr-12">
              <h1 className="font-display-xl text-white uppercase break-words leading-none text-right text-[60px] sm:text-[80px] md:text-[100px] lg:text-display-xl">THE<br /><span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>SINGULARITY</span></h1>
            </div>
            <div className="relative z-10 mt-12 max-w-2xl bg-white text-black p-6 border-2 border-black -ml-4 md:ml-24 neon-shadow-cyan">
              <p className="font-body-lg text-body-lg mb-6">Synthesis of raw, unyielding logic and the ethereal spark of technological evolution. Expect heavy layouts, uncompromising grid lines, and sudden glitches.</p>
              <button className="font-mono-label text-mono-label uppercase px-8 py-4 border-2 border-black bg-white text-black hover-neon-cyan transition-all">Initialize Protocol</button>
            </div>
            <div className="absolute bottom-8 right-8 font-mono-label text-mono-label uppercase text-white/50 tracking-widest text-right">
              SYS.V.01<br />
              ONLINE
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-12 gap-unit mb-margin">
            {/* FORM VS FUNCTION — brutalist background image with cyan/magenta sweep + scanlines */}
            <div className="col-span-1 md:col-span-4 relative border-2 border-white p-8 flex flex-col justify-between min-h-[400px] overflow-hidden bg-black">
              <img alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover grayscale contrast-150 opacity-30" style={{ filter: "hue-rotate(170deg) saturate(1.6) contrast(1.4)" }} src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=85&auto=format&fit=crop" />
              <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.45) 0%, rgba(232,121,249,0.25) 100%)" }} />
              <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 70%, rgba(232,121,249,0.25) 0%, transparent 60%)" }} />
              <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 4px)" }} />
              {/* Corner markers */}
              <div className="absolute top-3 right-3 font-mono-label text-[8px] uppercase tracking-widest text-cyan-400 z-10 bg-black/70 border border-cyan-400/60 px-2 py-0.5">// SECTOR_01</div>
              <div className="absolute bottom-3 right-3 font-mono-label text-[8px] uppercase tracking-widest text-magenta-400/80 z-10 tabular-nums">47.3769N · 8.5417E</div>
              <h2 className="font-headline-lg text-headline-lg text-white uppercase relative z-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">FORM<br />VS<br /><span className="glitch-corrupt">FUNCTION</span></h2>
              <span className="font-mono-label text-mono-label uppercase tracking-widest bg-cyan-400 text-black w-max px-2 relative z-10 border-2 border-black">Manifesto 01</span>
            </div>
            <div className="col-span-1 md:col-span-8 border-2 border-white p-8 md:p-16 flex items-center relative overflow-hidden bg-surface-container">
              <div className="absolute top-0 right-0 p-4 border-l-2 border-b-2 border-white font-mono-label text-mono-label text-white uppercase">Decrypted</div>
              <blockquote className="font-editorial-italic text-editorial-italic text-white max-w-3xl leading-relaxed z-10 relative">
                "The architecture of the future does not apologize. It imposes itself through raw utility, stripped of ornament, revealing the brutal truth of the machine beneath. We are the architects of the decrypted reality."
              </blockquote>
            </div>
          </section>
          <section className="mb-margin border-t-2 border-white pt-8">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <span className="font-mono-label text-mono-label uppercase tracking-widest text-cyan-400">// 02 — Live</span>
                <h2 className="font-headline-md text-headline-md uppercase mt-2 flex items-center gap-4">
                  <span className="material-symbols-outlined text-magenta-400">radio_button_checked</span>
                  WITNESSED · FEED
                </h2>
              </div>
              <div className="font-mono-label text-mono-label uppercase tracking-widest text-white/50 text-right">
                STREAM · 24/7<br />
                NODES · 47
              </div>
            </div>
            <div className="border-2 border-white bg-surface-container-lowest p-3 md:p-4 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-[2px] z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, #22d3ee 20%, #e879f9 80%, transparent 100%)" }} />
              <div className="overflow-hidden py-3">
                <div className="feed-track feed-track-left">
                  {[...cyanFeedTiles, ...cyanFeedTiles].map((t, i) => (
                    <figure key={`c-${i}`} aria-hidden={i >= cyanFeedTiles.length ? "true" : undefined} className={`relative ${t.w} ${t.aspect} border-2 border-cyan-400 overflow-hidden bg-black flex-shrink-0 ${t.shadow ? "neon-shadow-cyan" : ""}`}>
                      <img alt={i >= cyanFeedTiles.length ? "" : t.alt} className={`absolute inset-0 w-full h-full object-cover ${t.gray ? "grayscale" : ""}`} style={{ filter: "hue-rotate(170deg) saturate(1.5) contrast(1.3)" }} src={t.src} />
                      <div className={`absolute inset-0 ${t.blend} pointer-events-none`} style={{ background: t.overlay }} />
                      <figcaption className="absolute bottom-2 left-2 right-2 flex items-end justify-between text-white">
                        <span className="font-mono-label text-mono-label uppercase bg-black/80 px-2 py-1 border border-cyan-400/60">{t.tag}</span>
                        <span className="font-mono-label text-[10px] uppercase tracking-widest text-cyan-400">{t.meta}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden py-3 mt-2">
                <div className="feed-track feed-track-right">
                  {[...magentaFeedTiles, ...magentaFeedTiles].map((t, i) => (
                    <figure key={`m-${i}`} aria-hidden={i >= magentaFeedTiles.length ? "true" : undefined} className={`relative ${t.w} ${t.aspect} border-2 border-magenta-400 overflow-hidden bg-black flex-shrink-0 ${t.shadow ? "neon-shadow-magenta" : ""}`}>
                      <img alt={i >= magentaFeedTiles.length ? "" : t.alt} className={`absolute inset-0 w-full h-full object-cover ${t.gray ? "grayscale" : ""}`} style={{ filter: "hue-rotate(290deg) saturate(1.5) contrast(1.3)" }} src={t.src} />
                      <div className={`absolute inset-0 ${t.blend} pointer-events-none`} style={{ background: t.overlay }} />
                      <figcaption className="absolute bottom-2 left-2 right-2 flex items-end justify-between text-white">
                        <span className="font-mono-label text-mono-label uppercase bg-black/80 px-2 py-1 border border-magenta-400/60">{t.tag}</span>
                        <span className="font-mono-label text-[10px] uppercase tracking-widest text-magenta-400">{t.meta}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-[2px] z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, #e879f9 20%, #22d3ee 80%, transparent 100%)" }} />
            </div>
          </section>
          <section className="mb-margin border-t-2 border-white pt-8">
            <h2 className="font-headline-md text-headline-md uppercase mb-8 flex items-center gap-4">
              <span className="material-symbols-outlined text-cyan-400">memory</span>
              NEURAL ALCHEMY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-unit">
              {protocols.map((p) => (
                <div key={p.tag} className="border-2 border-white bg-surface-container-lowest p-6 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white group-hover:bg-cyan-400 transition-colors" />
                  <span className="absolute -top-3 left-4 bg-black px-2 font-mono-label text-mono-label uppercase border-x-2 border-white">{p.tag}</span>
                  <div className="mt-8 mb-12">
                    <span className="material-symbols-outlined text-4xl mb-4 group-hover:text-magenta-400 transition-colors">{p.icon}</span>
                    <h3 className="font-headline-md text-[24px] uppercase mb-4">{p.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{p.body}</p>
                  </div>
                  <button className="w-full py-3 border-2 border-white bg-black text-white font-mono-label text-mono-label uppercase group-hover:bg-white group-hover:text-black transition-colors">Execute</button>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-margin border-t-2 border-white pt-8">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <span className="font-mono-label text-mono-label uppercase tracking-widest text-magenta-400">// 04 — Process</span>
                <h2 className="font-headline-md text-headline-md uppercase mt-2 flex items-center gap-4">
                  <span className="material-symbols-outlined text-cyan-400">terminal</span>
                  BOOT SEQUENCE
                </h2>
              </div>
              <div className="font-mono-label text-mono-label uppercase tracking-widest text-white/50 text-right">
                CYCLE · 16s<br />
                STATES · 04
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-unit">
              <div className="md:col-span-5 border-2 border-white bg-black p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b-2 border-white/30 pb-3">
                  <span className="w-3 h-3 bg-magenta-400 border border-white" />
                  <span className="w-3 h-3 bg-cyan-400 border border-white" />
                  <span className="w-3 h-3 bg-white border border-white" />
                  <span className="ml-auto font-mono-label text-mono-label uppercase text-white/60">tty/alch — 80x24</span>
                </div>
                <ol className="font-mono-label text-mono-label uppercase text-white/80 space-y-3 flex-1">
                  {bootSteps.map((s) => (
                    <li key={s.body} className="flex gap-3"><span className={s.color}>{s.num}</span><span>{s.body}</span></li>
                  ))}
                  <li className="flex gap-3 text-white"><span className="text-cyan-400">&gt; OK_</span><span>PROTOCOL ONLINE<span className="boot-cursor inline-block ml-1 w-2 h-3 bg-cyan-400" /></span></li>
                </ol>
                <div className="mt-6 pt-4 border-t-2 border-white/30">
                  <div className="font-mono-label text-mono-label uppercase text-white/60 mb-2">SYNC · SCRUB</div>
                  <div className="h-1 bg-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-400 boot-scrub-bar" />
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 relative aspect-[4/3] md:aspect-[5/4] border-4 border-white bg-black overflow-hidden">
                {bootImages.map((b) => (
                  <img key={b.delay} alt={b.alt} className="boot-cycle-img absolute inset-0 w-full h-full object-cover contrast-125" style={{ animationDelay: b.delay }} src={b.src} />
                ))}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.7) 100%)" }} />
                <div className="absolute top-3 left-3 bg-black/80 border-2 border-cyan-400 px-2 py-1 font-mono-label text-mono-label uppercase text-cyan-400 z-10">REC · ●</div>
                <div className="absolute top-3 right-3 bg-black/80 border-2 border-magenta-400 px-2 py-1 font-mono-label text-mono-label uppercase text-magenta-400 z-10">FRAME 0/4</div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 z-10">
                  <span className="font-mono-label text-mono-label uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">// LIVE_DECRYPT</span>
                  <span className="font-editorial-italic text-[14px] text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">"the machine learns to forget"</span>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-margin">
            <div className="border-4 border-white mt-bg-pulse relative p-2 md:p-8">
              <h2 className="absolute -top-6 left-8 bg-black px-4 font-headline-md text-headline-md uppercase border-x-4 border-white">MATERIAL TRUTH</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8">
                {/* STR_01 cell — image on top, terminal card below to fill the row-span-2 dead space */}
                <div className="col-span-2 row-span-2 relative border-2 border-white overflow-hidden flex flex-col bg-black">
                  <div className="relative aspect-square overflow-hidden group">
                    <img alt={vaultImages[0].alt} src={vaultImages[0].src} className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 bg-white text-black p-2 font-mono-label text-mono-label uppercase">{vaultImages[0].tag}</div>
                  </div>
                  {/* Vault stream — animated terminal log filling the empty space below STR_01 */}
                  <div className="flex-1 p-3 md:p-4 flex flex-col border-t-2 border-white">
                    <div className="flex items-center gap-1 mb-2 border-b-2 border-white/20 pb-2">
                      <span className="w-2 h-2 bg-cyan-400 border border-white" />
                      <span className="w-2 h-2 bg-magenta-400 border border-white" />
                      <span className="w-2 h-2 bg-white border border-white" />
                      <span className="ml-auto font-mono-label text-[8px] uppercase text-white/50 tracking-widest">vault_stream — STR_01</span>
                    </div>
                    <ol className="font-mono-label text-[10px] md:text-[11px] uppercase text-white/70 space-y-1.5 flex-1 leading-tight">
                      <li><span className="text-cyan-400">&gt;</span> ACCESS :: GRANTED · OP_07</li>
                      <li><span className="text-magenta-400">&gt;</span> READ :: PLATE_I / 4096b</li>
                      <li><span className="text-cyan-400">&gt;</span> HASH :: 0xB7A2 · 4F1E</li>
                      <li><span className="text-magenta-400">&gt;</span> WRITE :: NULL</li>
                      <li><span className="text-cyan-400">&gt;</span> WITNESS :: 03 OPERATORS</li>
                      <li><span className="text-magenta-400">&gt;</span> SEAL :: REASSERTED</li>
                      <li className="text-white"><span className="text-cyan-400">&gt;</span> IDLE<span className="boot-cursor inline-block ml-0.5 w-1.5 h-2 bg-cyan-400 align-middle" /></li>
                    </ol>
                    <div className="mt-2 pt-2 border-t-2 border-white/20 flex items-center gap-2">
                      <span className="font-mono-label text-[8px] uppercase text-white/50 tracking-widest">heartbeat</span>
                      <div className="flex-1 h-1 bg-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-400 boot-scrub-bar" />
                      </div>
                      <span className="font-mono-label text-[8px] uppercase text-cyan-400 tabular-nums">60Hz</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 row-span-1 relative group border-2 border-white overflow-hidden aspect-square">
                  <img alt={vaultImages[1].alt} src={vaultImages[1].src} className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 bg-white text-black p-2 font-mono-label text-mono-label uppercase text-[10px]">{vaultImages[1].tag}</div>
                </div>
                {/* Animated terminal card — replaces the static "Data Corrupted" placeholder, fills the empty grid cell with live transmission log */}
                <div className="col-span-1 row-span-1 relative border-2 border-white overflow-hidden aspect-square bg-black p-3 flex flex-col">
                  <div className="flex items-center gap-1 mb-2 border-b-2 border-white/20 pb-2">
                    <span className="w-2 h-2 bg-magenta-400 border border-white" />
                    <span className="w-2 h-2 bg-cyan-400 border border-white" />
                    <span className="w-2 h-2 bg-white border border-white" />
                    <span className="ml-auto font-mono-label text-[8px] uppercase text-white/50 tracking-widest">tx_log</span>
                  </div>
                  <ol className="font-mono-label text-[10px] uppercase text-white/70 space-y-1.5 flex-1 leading-tight">
                    <li><span className="text-cyan-400">&gt;</span> NODE_47 :: SYNC_OK</li>
                    <li><span className="text-magenta-400">&gt;</span> PKT 0xA1 :: SENT</li>
                    <li><span className="text-cyan-400">&gt;</span> ECHO :: 12ms</li>
                    <li><span className="text-magenta-400">&gt;</span> SEAL :: HOLDS</li>
                    <li><span className="text-cyan-400">&gt;</span> AUDIT :: 0 ERR</li>
                    <li className="text-white"><span className="text-cyan-400">&gt;</span> READY<span className="boot-cursor inline-block ml-0.5 w-1.5 h-2 bg-cyan-400 align-middle" /></li>
                  </ol>
                  <div className="mt-2 pt-2 border-t-2 border-white/20 h-1 bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-magenta-400 boot-scrub-bar" />
                  </div>
                </div>
                <div className="col-span-2 row-span-1 relative group border-2 border-white overflow-hidden h-full">
                  <img alt={vaultImages[2].alt} src={vaultImages[2].src} className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 bg-white text-black p-2 font-mono-label text-mono-label uppercase">{vaultImages[2].tag}</div>
                </div>
              </div>
            </div>
          </section>
          <section className="full-bleed-glitch bg-black border-y-4 border-white mb-margin py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 4px)" }} />
            <div className="max-w-[1280px] mx-auto px-gutter relative z-10">
              <div className="flex items-end justify-between mb-10 md:mb-12 gap-4 flex-wrap">
                <div>
                  <span className="font-mono-label text-mono-label uppercase tracking-widest text-cyan-400">// 06 — Doctrine</span>
                  <h2 className="font-headline-lg text-headline-lg uppercase mt-2 text-white">FIVE TENETS<br /><span className="glitch-corrupt text-magenta-400">// DECRYPTED</span></h2>
                </div>
                <p className="font-editorial-italic text-editorial-italic text-white/70 max-w-md">Each tenet is non-negotiable. The protocol does not bargain with ornament.</p>
              </div>
              <ol className="divide-y-2 divide-white/30 border-y-2 border-white">
                {tenets.map((t) => (
                  <li key={t.num} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 md:py-8 items-center">
                    <span className={`md:col-span-1 font-display-xl text-[60px] md:text-[80px] leading-none ${t.numColor}`} style={{ WebkitTextStroke: "2px white" }}>{t.num}</span>
                    <div className="md:col-span-7">
                      <h3 className="font-headline-md text-[24px] uppercase text-white mb-2">{t.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">{t.body}</p>
                    </div>
                    <figure className={`md:col-span-4 relative aspect-[16/10] border-2 ${t.borderColor} overflow-hidden bg-black`}>
                      <img alt={t.alt} className={`absolute inset-0 w-full h-full object-cover ${t.gray ? "grayscale" : ""}`} style={{ filter: t.filter }} src={t.src} />
                      <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: t.overlay }} />
                      <span className={`absolute bottom-2 left-2 font-mono-label text-mono-label uppercase bg-black/80 px-2 py-1 border ${t.chipBorder} ${t.chipText}`}>{t.plate}</span>
                    </figure>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section className="mb-margin grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-white">
            <div className="p-8 md:p-16 border-b-4 md:border-b-0 md:border-r-4 border-white bg-surface-container flex flex-col justify-center">
              <h2 className="font-headline-lg text-headline-lg uppercase mb-4 text-cyan-400">TRANSMISSION</h2>
              <p className="font-editorial-italic text-editorial-italic mb-8 text-on-surface-variant">Initiate a secure handshake. The grid is listening.</p>
              <form className="space-y-8">
                {formFields.map((f) => (
                  <div key={f.id} className="relative">
                    <input id={f.id} type={f.type} placeholder={f.placeholder} className="w-full bg-transparent border-0 border-b-2 border-white text-white font-body-lg focus:ring-0 focus:border-cyan-400 focus:bg-surface-container-high transition-colors peer placeholder-transparent" />
                    <label htmlFor={f.id} className="absolute left-0 -top-6 text-sm font-mono-label text-mono-label uppercase text-white/50 peer-focus:text-cyan-400 transition-colors">{f.label}</label>
                  </div>
                ))}
                <div className="relative">
                  <textarea id="payload" rows={4} placeholder="PAYLOAD" className="w-full bg-transparent border-0 border-b-2 border-white text-white font-body-lg focus:ring-0 focus:border-cyan-400 focus:bg-surface-container-high transition-colors peer placeholder-transparent resize-none" />
                  <label htmlFor="payload" className="absolute left-0 -top-6 text-sm font-mono-label text-mono-label uppercase text-white/50 peer-focus:text-cyan-400 transition-colors">PAYLOAD (Message)</label>
                </div>
                <button type="button" className="font-mono-label text-mono-label uppercase px-8 py-4 border-2 border-white bg-black text-white hover:bg-white hover:text-black w-full text-left flex justify-between items-center transition-colors">
                  <span>Transmit</span>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
            <div className="p-8 md:p-16 flex flex-col justify-between bg-black relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-screen" />
              <div className="relative z-10">
                <div className="font-mono-label text-mono-label uppercase text-white/50 mb-2">Location Lock</div>
                <div className="font-body-lg text-[24px] uppercase border-l-2 border-cyan-400 pl-4 mb-8">
                  SWISS_GRID_NODE_01<br />
                  47.3769° N, 8.5417° E
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <div className="w-16 h-16 border-4 border-white flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-white">fingerprint</span>
                </div>
                <div className="font-editorial-italic text-editorial-italic text-white/70">
                  Authorized Signature:<br />
                  <span className="text-white">Digital Alchemist</span>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-margin border-t-2 border-white pt-8">
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <div>
                <span className="font-mono-label text-mono-label uppercase tracking-widest text-magenta-400">// 08 — Queries</span>
                <h2 className="font-headline-md text-headline-md uppercase mt-2 flex items-center gap-4">
                  <span className="material-symbols-outlined text-cyan-400">bug_report</span>
                  FAQ · DECRYPTED
                </h2>
              </div>
              <div className="font-mono-label text-mono-label uppercase tracking-widest text-white/50 text-right">
                THREADS · 05<br />
                SEAL · INTACT
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-unit">
              <div className="md:col-span-4 relative border-2 border-white overflow-hidden bg-black aspect-square md:aspect-auto md:min-h-[420px]">
                <img alt="brutalist architecture tinted cyan FAQ side panel" className="absolute inset-0 w-full h-full object-cover grayscale" style={{ filter: "hue-rotate(170deg) saturate(1.5) contrast(1.4)" }} src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(34,211,238,0.30) 0%, rgba(0,0,0,0.7) 100%)" }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)" }} />
                <div className="absolute top-3 left-3 bg-black/80 border-2 border-cyan-400 px-2 py-1 font-mono-label text-mono-label uppercase text-cyan-400">PROBE · LIVE</div>
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="font-mono-label text-mono-label uppercase text-white/60 mb-1">Threadwalker · 09</div>
                  <p className="font-editorial-italic text-[18px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-snug">"All questions arrive encrypted. We answer in plain text only when the seal permits."</p>
                </div>
              </div>
              <div className="md:col-span-8 border-2 border-white bg-surface-container-lowest divide-y-2 divide-white/30">
                {faqItems.map((f) => (
                  <details key={f.q} className="glitch-faq group p-5 md:p-6">
                    <summary className="flex items-start justify-between gap-6">
                      <h3 className="font-headline-md text-[20px] uppercase text-white glitch-label">{f.q}</h3>
                      <span className={`glitch-chevron font-display-xl text-[28px] leading-none ${f.chevColor} shrink-0`}>+</span>
                    </summary>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-4 max-w-2xl">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t-4 border-black dark:border-white bg-black dark:bg-black flex flex-col md:flex-row justify-between items-center px-16 md:pl-28 py-12 relative z-20">
          <div className="text-[10px] tracking-widest uppercase text-white font-bold mb-4 md:mb-0">
            ©2024_ALCHEMIST_STAKE_PROTOCOL_V.01
          </div>
          <div className="flex gap-8 text-[10px] tracking-widest uppercase">
            {footerLinks.map((l) => (
              <a key={l} href="#" className="text-white/50 hover:text-magenta-400 transition-colors">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
