export default function T112CrtGlitchCyber() {
  const navLinks = [
    { label: "TRANSMUTATIONS", active: true },
    { label: "ARSENAL" },
    { label: "LOGS" },
    { label: "PORTAL" },
  ];
  const logs = [
    { text: "INITIALIZING VOID PROTOCOL...", status: "[OK]", statusClass: "text-tertiary-fixed" },
    { text: "CALIBRATING AETHER MATRIX...", status: "[OK]", statusClass: "text-tertiary-fixed" },
    { text: "WARNING: REALITY TEAR DETECTED IN SECTOR 7G.", warning: true },
    { text: "COMPENSATING WITH BRUTALIST STRUCTURAL ANCHORS...", status: "[OK]", statusClass: "text-tertiary-fixed" },
    { text: "INJECTING NEON BLEED OVERLAYS...", status: "[OK]", statusClass: "text-tertiary-fixed" },
  ];
  const footerLinks = ["MANIFESTO", "ENCRYPTED PROTOCOL", "TERMS OF TRANSMUTATION"];
  const customCss = `
    .glitch-text {
      position: relative;
      display: inline-block;
    }
    .glitch-text::before, .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      opacity: 0.8;
    }
    .glitch-text::before {
      left: 2px;
      text-shadow: -1px 0 #00f0ff;
      clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
      animation: glitch-anim-1 2s infinite linear alternate-reverse;
    }
    .glitch-text::after {
      left: -2px;
      text-shadow: -1px 0 #fe00fe;
      clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
    }
    @keyframes glitch-anim-1 {
      0% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); }
      100% { clip-path: polygon(0 80%, 100% 80%, 100% 90%, 0 90%); }
    }
    @keyframes glitch-anim-2 {
      0% { clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%); }
      100% { clip-path: polygon(0 30%, 100% 30%, 100% 40%, 0 40%); }
    }
    .scanline { overflow: hidden; }
    .scanline::after {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 2;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
    .bento-card {
      border: 1px solid #3b494b;
      background-color: #131313;
      position: relative;
    }
    .bento-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(#3b494b 1px, transparent 1px);
      background-size: 10px 10px;
      opacity: 0.1;
      pointer-events: none;
    }
    .tactile-button {
      border-top: 2px solid #5b005b;
      border-left: 2px solid #5b005b;
      border-bottom: 2px solid #380038;
      border-right: 2px solid #380038;
      transition: all 0.1s;
    }
    .tactile-button:active {
      border-top: 2px solid #380038;
      border-left: 2px solid #380038;
      border-bottom: 2px solid #5b005b;
      border-right: 2px solid #5b005b;
      transform: translate(1px, 1px);
    }
    .crt-flicker { animation: flicker 0.15s infinite; }
    @keyframes flicker {
      0% { opacity: 0.95; }
      50% { opacity: 1; }
      100% { opacity: 0.98; }
    }
    html, body { overflow-x: clip; }
    .full-bleed { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }
    .marquee-track { display: flex; gap: 16px; width: max-content; }
    @keyframes marquee-left  { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 8px)); } }
    @keyframes marquee-right { 0% { transform: translateX(calc(-50% - 8px)); } 100% { transform: translateX(0); } }
    .marquee-left  { animation: marquee-left 70s linear infinite; }
    .marquee-right { animation: marquee-right 80s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }
  `;

  const relicsTop = [
    { id: "RELIC_001", label: "B/W",    treatment: "bw",   src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVQOitxJX2QrKHImWRruVX5wff9U6k-qS1ZM9QqHOSnBFJQTtQniC05gRdK0hgz35LJAhqndctFWNPQKXQnUH_2RoNBu5tMkPBl1Tl01q2tFMvcEt3i8lgJycDEM0RwPxk0tsSH-RDnaHScvuy4OSKtshjjWwyu9MF6zOlPy1OxGiL2_vKunaoiOdRvVlsnCzDS0tstd-vVK3jXpNDpCRMNG7LhyoFv6HtcJo3dVrK55XJu8Sb-a9HkvsCvnB94Dp3H3VI8IPwPv66", alt: "Macro shot of intricate watch movement" },
    { id: "RELIC_002", label: "CYAN",   treatment: "cyan", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop", alt: "Macro circuit-board traces, colour" },
    { id: "RELIC_003", label: "B/W",    treatment: "bw",   src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZqFks93NPyJmpwAeu4s9oSt900nf1Z3O4ImVCBllSObJ3wa958mzpJDlCZ3tVK6Dg6h-3vWOpTsE2jL4KARB19aXP7gvm9_n0WKRdEAFwiHohqfs885WvdUKxqMAxYX75yFWLxErQn2LuTIJAR4538MZ_73CsGIDy1TTFbWDwPwKgpZ2qeGXJPGNzfOs3MJp90EedxkMscBCHh1cXuhGbCiJ2nKqRy5h_2WaVcGRp4yj2BaNHie67E8ybQRB1LoRicdZ_2bY1A2rm", alt: "Silicon chip macro, B&W" },
    { id: "RELIC_004", label: "CYAN",   treatment: "cyan", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop", alt: "Server-room rack with cyan tint" },
  ];

  const relicsBottom = [
    { id: "RELIC_005", label: "MAGENTA", treatment: "magenta", src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?q=80&w=900&auto=format&fit=crop", alt: "Industrial machinery, magenta tint" },
    { id: "RELIC_006", label: "B/W",     treatment: "bw",      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuPfpJ1hNe3BZz8lHOisAiMV5TroON6ghz_E-QX_JBd3xvpbjGydaMkIZbDhEjcQcvJhKI3KC6loolGeoqrrjuTaPvrwk1Mi2gr3NbRHDgMih2HKZD7-XxFe1NLDk-H8ETYL4hM5jAt6WyncePKAy8sd7fhR68ldcB1pBJJUUCUWEjgBFNeUuAyKMyuAXk20o92PKjZS6qT8DEv0KA_5SgrcyJpEMWXJmXwy0dsd_UBNcfFE4ZE3hyjNyT8tTyiIfZJ1QnxeLQe0TI", alt: "Concrete brutalist surface, B&W" },
    { id: "RELIC_007", label: "MAGENTA", treatment: "magenta", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop", alt: "Wide server-room shot, magenta tint" },
    { id: "RELIC_008", label: "B/W",     treatment: "bw",      src: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=900&auto=format&fit=crop", alt: "Server uplink hardware, B&W" },
  ];

  const protocols = [
    { id: "P_001 // VOID",  title: "Cipher",         body: "AES-256-GCM at the gateway. Symmetric encryption pipeline, stream-friendly, signed payloads only.",                       footL: "UPTIME",      footR: "99.97%",   ledColor: "bg-tertiary-fixed-dim", ledShadow: "shadow-[0_0_6px_#e9c349]" },
    { id: "P_002 // FORGE", title: "Glyph Synth",    body: "256 base glyphs, infinite remixes. Every export carries the SHA-3 trace of its parent. Deterministic builds.",            footL: "SIGNED",      footR: "#7C0F19",  ledColor: "bg-tertiary-fixed-dim", ledShadow: "shadow-[0_0_6px_#e9c349]" },
    { id: "P_003 // BLEED", title: "Neon Overlay",   body: "Compositing layer. Cyan/magenta phosphor bleed, scanline injection, CRT-flicker. Render-time, zero post.",                 footL: "FRAME RATE",  footR: "144 Hz",   ledColor: "bg-secondary",          ledShadow: "shadow-[0_0_6px_#fe00fe]" },
    { id: "P_004 // ANCHOR",title: "Brutalist Core", body: "Structural anchor — concrete textures, raw weight, the gravitational counter to all neon bleed. Ships first.",            footL: "CORE LOADED", footR: "[OK]",     ledColor: "bg-tertiary-fixed-dim", ledShadow: "shadow-[0_0_6px_#e9c349]" },
  ];

  const acolytes = [
    { handle: "@OPERATOR_07", sigil: "SIGIL ✓", sigilCls: "text-tertiary-fixed-dim", quote: "Replaced our entire build pipeline. The output now ships with its own trace. We have not opened a 'real' editor in nine months.", sector: "SECTOR.04 // FORGE",  date: "2024.11.14", shift: "" },
    { handle: "@VOID_DRIFT",  sigil: "SIGIL ✓", sigilCls: "text-tertiary-fixed-dim", quote: "The brutalist anchor is the part nobody warns you about. It saves the run, every time. Without it, the neon eats the work.",     sector: "SECTOR.07 // ANCHOR", date: "2024.10.22", shift: "md:-translate-y-3" },
    { handle: "@SIG_HALBERG", sigil: "SIGIL ◆", sigilCls: "text-secondary",          quote: "I shipped a cyber-occult zine in three nights. The cipher signed every page. The audience is paranoid in the best possible way.", sector: "SECTOR.02 // CIPHER", date: "2024.09.30", shift: "" },
  ];

  const meshNodes = [
    { name: "Vercel",     slug: "vercel" },
    { name: "Cloudflare", slug: "cloudflare" },
    { name: "GitHub",     slug: "github" },
    { name: "Docker",     slug: "docker" },
    { name: "Kubernetes", slug: "kubernetes" },
    { name: "Node.js",    slug: "nodedotjs" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Next.js",    slug: "nextdotjs" },
  ];

  const engines = [
    {
      numeral: "I", sector: "// SECTOR_01", title: "EDGE_SHIELD", icon: "shield",
      body: "First wall at the gateway. Stateless inspection, signed payload validation, mTLS handshake on every relay. No request enters the kernel without a sigil. Built on AES-256-GCM with stream-friendly framing for live broadcasts.",
      stat: "// uptime :: 99.97%",
      tone: "primary",
      featured: true,
    },
    {
      numeral: "II", sector: "// SECTOR_02", title: "ROUTING_MESH", icon: "lan",
      body: "Forty-seven nodes, twelve zones, one routing table. Adaptive failover swaps a downed relay in under 40ms. Magenta phosphor traces every hop on the operator console; nothing dark, nothing silent. Cipher-aware routing keeps signed payloads on signed paths.",
      stat: "// hops :: 47",
      tone: "secondary",
      featured: false,
    },
    {
      numeral: "III", sector: "// SECTOR_03", title: "TELEMETRY", icon: "monitoring",
      body: "144 Hz scan rate piped straight into the void. Every render-frame, every cipher swap, every brutalist anchor logged to the SHA-3 ledger. Operators read the phosphor; auditors read the trace; nobody reads it cold. Retention is encrypted at rest by default.",
      stat: "// scan :: 144 Hz",
      tone: "tertiary",
      featured: false,
    },
    {
      numeral: "IV", sector: "// SECTOR_04", title: "FAILOVER_CORE", icon: "bolt",
      body: "Brutalist anchor under the neon. When a zone drops, the core hot-swaps the kernel inside one cycle and replays the last 30 seconds of signed traffic. No request lost, no operator paged. Concrete weight under all the bleed — exactly the part nobody warns you about.",
      stat: "// rto :: 1 cycle",
      tone: "primary",
      featured: false,
    },
  ];

  const engineTone = {
    primary:   { ring: "ring-primary-fixed/40",         pillBd: "border-primary-fixed/40",         pillTx: "text-primary-fixed",         border: "border-primary-fixed/30 hover:border-primary-fixed",         numeralTx: "text-primary-fixed",         iconTx: "text-primary-fixed",         iconShadow: "drop-shadow-[0_0_8px_rgba(0,219,233,0.5)]",  hairline: "border-primary-fixed/30",         statTx: "text-primary-fixed" },
    secondary: { ring: "ring-secondary/40",             pillBd: "border-secondary/40",             pillTx: "text-secondary",             border: "border-secondary/30 hover:border-secondary",                 numeralTx: "text-secondary",             iconTx: "text-secondary",             iconShadow: "drop-shadow-[0_0_8px_rgba(254,0,254,0.5)]",  hairline: "border-secondary/30",             statTx: "text-secondary" },
    tertiary:  { ring: "ring-tertiary-fixed-dim/40",    pillBd: "border-tertiary-fixed-dim/40",    pillTx: "text-tertiary-fixed-dim",    border: "border-tertiary-fixed-dim/30 hover:border-tertiary-fixed-dim", numeralTx: "text-tertiary-fixed-dim",    iconTx: "text-tertiary-fixed-dim",    iconShadow: "drop-shadow-[0_0_8px_rgba(233,195,73,0.5)]", hairline: "border-tertiary-fixed-dim/30",    statTx: "text-tertiary-fixed-dim" },
  };

  const cyanCard    = "border-primary-fixed/30 hover:border-primary-fixed";
  const cyanImg     = "border-primary-fixed/40";
  const magentaCard = "border-secondary/30 hover:border-secondary";
  const magentaImg  = "border-secondary/40";
  const amberCard   = "border-tertiary-fixed-dim/30 hover:border-tertiary-fixed-dim";
  const amberImg    = "border-tertiary-fixed-dim/40";

  const transmissions = [
    { label: "> SIGIL_07 LIT",      date: "2024.11.22 · 04:17", cardCls: cyanCard,    imgBorder: cyanImg,    textColor: "text-primary-fixed",     scan: true,  imgClass: "saturate-150 hue-rotate-[170deg]", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop", alt: "Circuit board macro" },
    { label: "> RELAY_142 OPEN",    date: "2024.11.21 · 22:08", cardCls: magentaCard, imgBorder: magentaImg, textColor: "text-secondary",          scan: false, imgClass: "saturate-150 hue-rotate-[290deg]", src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?q=80&w=200&auto=format&fit=crop", alt: "Industrial machinery" },
    { label: "> CIPHER REKEYED",    date: "2024.11.20 · 14:42", cardCls: amberCard,   imgBorder: amberImg,   textColor: "text-tertiary-fixed-dim", scan: true,  imgClass: "grayscale opacity-80",             src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=200&auto=format&fit=crop", alt: "Server rack" },
    { label: "> FORGE COMPILED",    date: "2024.11.19 · 09:33", cardCls: cyanCard,    imgBorder: cyanImg,    textColor: "text-primary-fixed",     scan: false, imgClass: "saturate-150 hue-rotate-[170deg]", src: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=200&auto=format&fit=crop", alt: "Server uplink hardware" },
    { label: "> ANCHOR DEPLOYED",   date: "2024.11.18 · 18:55", cardCls: magentaCard, imgBorder: magentaImg, textColor: "text-secondary",          scan: true,  imgClass: "grayscale opacity-80",             src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVQOitxJX2QrKHImWRruVX5wff9U6k-qS1ZM9QqHOSnBFJQTtQniC05gRdK0hgz35LJAhqndctFWNPQKXQnUH_2RoNBu5tMkPBl1Tl01q2tFMvcEt3i8lgJycDEM0RwPxk0tsSH-RDnaHScvuy4OSKtshjjWwyu9MF6zOlPy1OxGiL2_vKunaoiOdRvVlsnCzDS0tstd-vVK3jXpNDpCRMNG7LhyoFv6HtcJo3dVrK55XJu8Sb-a9HkvsCvnB94Dp3H3VI8IPwPv66", alt: "Watch movement macro" },
    { label: "> UPLINK STABLE",     date: "2024.11.17 · 11:03", cardCls: amberCard,   imgBorder: amberImg,   textColor: "text-tertiary-fixed-dim", scan: false, imgClass: "saturate-150 hue-rotate-[290deg]", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=200&auto=format&fit=crop", alt: "Wide server room" },
    { label: "> KERNEL HOT-SWAP",   date: "2024.11.16 · 03:21", cardCls: cyanCard,    imgBorder: cyanImg,    textColor: "text-primary-fixed",     scan: true,  imgClass: "grayscale opacity-80",             src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZqFks93NPyJmpwAeu4s9oSt900nf1Z3O4ImVCBllSObJ3wa958mzpJDlCZ3tVK6Dg6h-3vWOpTsE2jL4KARB19aXP7gvm9_n0WKRdEAFwiHohqfs885WvdUKxqMAxYX75yFWLxErQn2LuTIJAR4538MZ_73CsGIDy1TTFbWDwPwKgpZ2qeGXJPGNzfOs3MJp90EedxkMscBCHh1cXuhGbCiJ2nKqRy5h_2WaVcGRp4yj2BaNHie67E8ybQRB1LoRicdZ_2bY1A2rm", alt: "Silicon chip macro" },
    { label: "> RITUAL CLOSED",     date: "2024.11.15 · 23:11", cardCls: magentaCard, imgBorder: magentaImg, textColor: "text-secondary",          scan: false, imgClass: "saturate-150 hue-rotate-[290deg]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuPfpJ1hNe3BZz8lHOisAiMV5TroON6ghz_E-QX_JBd3xvpbjGydaMkIZbDhEjcQcvJhKI3KC6loolGeoqrrjuTaPvrwk1Mi2gr3NbRHDgMih2HKZD7-XxFe1NLDk-H8ETYL4hM5jAt6WyncePKAy8sd7fhR68ldcB1pBJJUUCUWEjgBFNeUuAyKMyuAXk20o92PKjZS6qT8DEv0KA_5SgrcyJpEMWXJmXwy0dsd_UBNcfFE4ZE3hyjNyT8tTyiIfZJ1QnxeLQe0TI", alt: "Brutalist concrete texture" },
  ];

  const treatmentClass = (t) =>
    t === "bw"     ? "w-full h-full object-cover grayscale opacity-70 mix-blend-luminosity group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500"
    : t === "cyan" ? "w-full h-full object-cover saturate-150 hue-rotate-[170deg] contrast-110 group-hover:hue-rotate-0 group-hover:saturate-100 transition-all duration-500"
    :                "w-full h-full object-cover saturate-150 hue-rotate-[290deg] contrast-110 group-hover:hue-rotate-0 group-hover:saturate-100 transition-all duration-500";
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#dbfcff", "on-primary": "#00363a",
                "primary-container": "#00f0ff", "on-primary-container": "#006970",
                "primary-fixed": "#7df4ff", "primary-fixed-dim": "#00dbe9",
                "on-primary-fixed": "#002022",
                "secondary": "#ffabf3", "on-secondary": "#5b005b",
                "secondary-container": "#fe00fe", "on-secondary-container": "#500050",
                "secondary-fixed": "#ffd7f5", "secondary-fixed-dim": "#ffabf3",
                "tertiary": "#fff5e1", "on-tertiary": "#3c2f00",
                "tertiary-container": "#fdd55a", "on-tertiary-container": "#745c00",
                "tertiary-fixed": "#ffe088", "tertiary-fixed-dim": "#e9c349",
                "on-tertiary-fixed": "#241a00", "on-tertiary-fixed-variant": "#574500",
                "surface": "#131313", "on-surface": "#e5e2e1", "on-surface-variant": "#b9cacb",
                "surface-container-lowest": "#0e0e0e", "surface-container-low": "#1c1b1b",
                "surface-container": "#201f1f", "surface-container-high": "#2a2a2a",
                "surface-container-highest": "#353534",
                "surface-variant": "#353534", "surface-bright": "#3a3939", "surface-dim": "#131313",
                "outline": "#849495", "outline-variant": "#3b494b",
                "background": "#131313", "on-background": "#e5e2e1",
                "error": "#ffb4ab", "error-container": "#93000a", "on-error": "#690005"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "gutter": "16px", "unit": "4px", "bento-gap": "1px", "margin": "32px" },
              fontFamily: {
                "headline-md": ["Newsreader"], "headline-lg": ["Newsreader"], "display-xl": ["Newsreader"],
                "body-md": ["Space Grotesk"], "body-lg": ["Space Grotesk"],
                "code-sm": ["Space Grotesk"], "label-caps": ["Space Grotesk"]
              },
              fontSize: {
                "headline-md": ["32px", { lineHeight: "40px", fontWeight: "400" }],
                "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "500" }],
                "display-xl": ["72px", { lineHeight: "80px", letterSpacing: "-0.04em", fontWeight: "700" }],
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "code-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "500" }],
                "label-caps": ["11px", { lineHeight: "12px", letterSpacing: "0.2em", fontWeight: "700" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-background text-on-background min-h-screen font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <nav className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-[100] bg-stone-950/90 dark:bg-black/95 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border-b-2 border-cyan-900/40 dark:border-cyan-500/20">
          <div className="text-2xl font-headline-md italic text-primary-fixed hover:animate-pulse tracking-tighter">DIGITAL ALCHEMY</div>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((l) => (
              <a key={l.label} href="#" className={l.active
                ? "text-primary-fixed border-b-2 border-primary-fixed pb-1 font-label-caps uppercase tracking-widest text-xs skew-x-12 transition-transform"
                : "text-outline uppercase tracking-widest font-label-caps hover:text-primary transition-all duration-75"
              }>{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-outline font-code-sm hidden lg:block">UPTIME: 99.98%</span>
            <button className="tactile-button bg-surface-container px-6 py-2 text-primary-fixed font-label-caps hover:text-primary transition-colors">INITIATE</button>
          </div>
        </nav>
        <header className="relative min-h-[921px] flex items-center justify-center overflow-hidden border-b border-outline-variant p-margin">
          <div className="absolute inset-0 z-0 opacity-40 scanline">
            <img alt="High contrast macro shot of intricate mechanical watch movement gears and springs with cyan and magenta lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVQOitxJX2QrKHImWRruVX5wff9U6k-qS1ZM9QqHOSnBFJQTtQniC05gRdK0hgz35LJAhqndctFWNPQKXQnUH_2RoNBu5tMkPBl1Tl01q2tFMvcEt3i8lgJycDEM0RwPxk0tsSH-RDnaHScvuy4OSKtshjjWwyu9MF6zOlPy1OxGiL2_vKunaoiOdRvVlsnCzDS0tstd-vVK3jXpNDpCRMNG7LhyoFv6HtcJo3dVrK55XJu8Sb-a9HkvsCvnB94Dp3H3VI8IPwPv66" className="w-full h-full object-cover mix-blend-luminosity" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <div className="relative z-20 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
            <div className="inline-block px-4 py-1 border border-primary-fixed/30 bg-primary-fixed/5 font-code-sm text-primary-fixed mb-4 backdrop-blur-sm">
              &gt; SYSTEM_INITIALIZED // SEQUENCE_BETA
            </div>
            <h1 className="font-display-xl text-on-surface uppercase tracking-tighter glitch-text leading-none" data-text="DIVINE DATA. TRANSMUTED GOLD.">
              DIVINE DATA.<br /><span className="text-secondary-container">TRANSMUTED GOLD.</span>
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mt-4">
              Enter the crucible where raw computation meets ancient mastery. Ordered anarchy forged into hyper-refined digital glitch.
            </p>
          </div>
        </header>
        <section className="p-margin max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap bg-outline-variant/30 p-[1px]">
            <div className="md:col-span-8 bento-card p-8 min-h-[400px] flex flex-col justify-between overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/old-wall.png')] mix-blend-overlay" />
              <div className="relative z-10">
                <h2 className="font-headline-lg text-tertiary-fixed mb-4">The Vision</h2>
                <p className="font-body-md text-on-surface-variant max-w-md">
                  Codifying magic into software through brute force structural integrity and ethereal luminous overlays.
                </p>
              </div>
              <div className="relative z-10 flex items-end justify-between mt-12">
                <div className="font-code-sm text-outline uppercase">[SECTOR_ALPHA]</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 rounded-full border-4 border-surface-container bg-surface-bright shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_4px_15px_rgba(0,0,0,0.8)] relative flex items-center justify-center group-hover:rotate-45 transition-transform duration-1000 ease-out cursor-pointer">
                    <div className="w-2 h-8 bg-tertiary-fixed rounded-full absolute top-2" />
                    <div className="w-16 h-16 rounded-full border border-outline-variant bg-gradient-to-br from-surface to-surface-container-high" />
                  </div>
                  <span className="font-label-caps text-tertiary-fixed tracking-widest mt-2">RESONANCE</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 bento-card p-0 min-h-[400px] relative scanline flex flex-col">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center z-10">
                <span className="font-code-sm text-primary-fixed">LIVE_FEED.EXE</span>
                <div className="flex gap-1"><div className="w-2 h-2 bg-error rounded-full animate-pulse" /></div>
              </div>
              <div className="flex-grow relative overflow-hidden bg-black">
                <img alt="Gritty black and white macro of a silicon chip processor with heavy film grain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZqFks93NPyJmpwAeu4s9oSt900nf1Z3O4ImVCBllSObJ3wa958mzpJDlCZ3tVK6Dg6h-3vWOpTsE2jL4KARB19aXP7gvm9_n0WKRdEAFwiHohqfs885WvdUKxqMAxYX75yFWLxErQn2LuTIJAR4538MZ_73CsGIDy1TTFbWDwPwKgpZ2qeGXJPGNzfOs3MJp90EedxkMscBCHh1cXuhGbCiJ2nKqRy5h_2WaVcGRp4yj2BaNHie67E8ybQRB1LoRicdZ_2bY1A2rm" className="w-full h-full object-cover mix-blend-luminosity opacity-70 crt-flicker grayscale" />
              </div>
            </div>
            <div className="md:col-span-6 bento-card p-6 min-h-[300px] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#00dbe9 1px, transparent 1px), linear-gradient(90deg, #00dbe9 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <h2 className="font-headline-md text-primary-fixed z-10 relative bg-background/50 inline-block px-2 border-l-2 border-primary-fixed">Blueprint</h2>
              <div className="relative z-10 mt-auto">
                <div className="w-full h-32 border border-primary-fixed/50 relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full text-primary-fixed opacity-70" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path className="drop-shadow-[0_0_5px_rgba(0,219,233,0.8)]" d="M0,100 C20,80 40,90 50,50 C60,10 80,40 100,0" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M0,100 L0,50 L20,50 L20,30 L40,30 L40,70 L60,70 L60,20 L80,20 L80,80 L100,80 L100,100 Z" fill="none" stroke="currentColor" strokeDasharray="2,2" strokeWidth="0.5" />
                  </svg>
                </div>
                <div className="flex justify-between mt-2 font-code-sm text-primary-fixed/70">
                  <span>X: 45.221</span><span>Y: 89.004</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-6 bento-card min-h-[300px] relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img alt="Highly textured raw dark concrete surface with brutalist industrial aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuPfpJ1hNe3BZz8lHOisAiMV5TroON6ghz_E-QX_JBd3xvpbjGydaMkIZbDhEjcQcvJhKI3KC6loolGeoqrrjuTaPvrwk1Mi2gr3NbRHDgMih2HKZD7-XxFe1NLDk-H8ETYL4hM5jAt6WyncePKAy8sd7fhR68ldcB1pBJJUUCUWEjgBFNeUuAyKMyuAXk20o92PKjZS6qT8DEv0KA_5SgrcyJpEMWXJmXwy0dsd_UBNcfFE4ZE3hyjNyT8tTyiIfZJ1QnxeLQe0TI" className="w-full h-full object-cover opacity-50 mix-blend-multiply" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iIzAwMCIvPgo8Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMSIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4=')]" />
              </div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-end bg-gradient-to-t from-background to-transparent">
                <h2 className="font-headline-md text-on-surface mb-2">Material</h2>
                <p className="font-code-sm text-outline-variant max-w-sm">
                  EXTRACTING TEXTURE DATA // BRUTALIST_CORE_LOADED
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="border-y border-outline-variant bg-surface-container-lowest p-margin my-margin relative overflow-hidden">
          <div className="max-w-4xl mx-auto font-code-sm text-primary-fixed opacity-80 leading-relaxed crt-flicker">
            <div className="mb-4 text-outline">&gt; TAIL_LOGS -F /VAR/ALCHEMY/TRANSMUTE.LOG</div>
            <div className="pl-4 border-l border-primary-fixed/30 space-y-2">
              {logs.map((l) => (
                <p key={l.text} className={l.warning ? "text-secondary-container" : undefined}>
                  &gt; {l.text} {l.status && <span className={l.statusClass}>{l.status}</span>}
                </p>
              ))}
              <p className="animate-pulse">&gt; AWAITING OPERATOR INPUT_ <span className="inline-block w-2 h-4 bg-primary-fixed align-middle" /></p>
            </div>
          </div>
        </section>
        {/* MESHED OPERATORS — trusted-by logo grid, cyan tint */}
        <section className="full-bleed py-margin border-y border-outline-variant relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(#00dbe9 1px, transparent 1px), linear-gradient(90deg, #00dbe9 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-6xl mx-auto px-margin">
            <div className="text-center flex flex-col items-center gap-3 mb-10">
              <span className="font-code-sm text-primary-fixed border border-primary-fixed/30 bg-primary-fixed/5 px-3 py-1">// MESHED · OPERATORS</span>
              <h2 className="font-headline-lg text-on-surface uppercase tracking-tight">// Routed through the meshnet.</h2>
              <p className="font-body-md text-on-surface-variant max-w-xl">Eight backbones piped into the same encrypted relay. Hover any node to wake its phosphor.</p>
            </div>
            <div className="border-2 border-primary-fixed/30 bg-black/60 backdrop-blur-sm relative">
              <div className="absolute -top-px left-4 px-2 py-0.5 bg-black border border-primary-fixed/40 font-code-sm text-primary-fixed text-[10px] -translate-y-1/2">// NODES.LIVE</div>
              <div className="absolute -top-px right-4 px-2 py-0.5 bg-black border border-primary-fixed/40 font-code-sm text-primary-fixed text-[10px] -translate-y-1/2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse shadow-[0_0_6px_#00dbe9]" />SYNC</div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 divide-x divide-y md:divide-y-0 divide-primary-fixed/15 border-t border-primary-fixed/20 md:border-t-0">
                {meshNodes.map((n) => (
                  <div key={n.slug} className="aspect-[4/3] flex items-center justify-center p-6 group relative scanline overflow-hidden">
                    <img alt={n.name} className="max-h-8 w-auto opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 relative z-10" src={`https://cdn.simpleicons.org/${n.slug}/00DBE9`} />
                  </div>
                ))}
              </div>
              <div className="border-t border-primary-fixed/20 px-4 py-3 flex flex-col md:flex-row md:justify-between gap-2 font-code-sm text-primary-fixed/70 bg-black/40">
                <span>// 47 nodes · 12 zones · uptime 99.97%</span>
                <span className="text-outline">// LAST_HEARTBEAT 04:17:22Z</span>
              </div>
            </div>
          </div>
        </section>

        {/* ARTIFACTS image strip — two scrolling marquee rows */}
        <section className="full-bleed py-margin border-y border-outline-variant relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(#00dbe9 1px, transparent 1px), linear-gradient(90deg, #00dbe9 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative max-w-7xl mx-auto px-margin mb-8 text-center flex flex-col items-center gap-3">
            <span className="font-code-sm text-primary-fixed border border-primary-fixed/30 bg-primary-fixed/5 px-3 py-1">&gt; ARTIFACTS // VOL.07 // SCAN_LIVE</span>
            <h2 className="font-headline-lg text-on-surface uppercase tracking-tight">Eight relics from the void.</h2>
            <p className="font-body-md text-on-surface-variant max-w-xl">Top strip drifts west, bottom strip drifts east. Hover any tile to pin the loop.</p>
          </div>

          <div className="overflow-hidden py-3 mb-2">
            <div className="marquee-track marquee-left">
              {[...relicsTop, ...relicsTop].map((r, i) => (
                <figure key={i} className={`bento-card w-72 aspect-[4/3] relative overflow-hidden shrink-0 group${r.treatment === "bw" ? " scanline" : ""}`} aria-hidden={i >= relicsTop.length}>
                  <img alt={r.alt} className={treatmentClass(r.treatment)} src={r.src} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                  <figcaption className="absolute bottom-2 left-2 right-2 flex justify-between font-code-sm text-primary-fixed uppercase z-10">
                    <span>{r.id}</span><span className="opacity-60">{r.label}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="overflow-hidden py-3">
            <div className="marquee-track marquee-right">
              {[...relicsBottom, ...relicsBottom].map((r, i) => (
                <figure key={i} className={`bento-card w-72 aspect-[4/3] relative overflow-hidden shrink-0 group${r.treatment === "bw" ? " scanline" : ""}`} aria-hidden={i >= relicsBottom.length}>
                  <img alt={r.alt} className={treatmentClass(r.treatment)} src={r.src} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                  <figcaption className="absolute bottom-2 left-2 right-2 flex justify-between font-code-sm text-secondary uppercase z-10">
                    <span>{r.id}</span><span className="opacity-60">{r.label}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* PROTOCOLS — full-bleed surface-container-lowest band */}
        <section className="full-bleed py-margin px-margin border-y border-outline-variant" style={{ backgroundColor: "#0e0e0e" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <span className="font-code-sm text-tertiary-fixed-dim uppercase tracking-widest mb-2 inline-block">// PROTOCOLS · IV ACTIVE</span>
                <h2 className="font-headline-lg text-on-surface">Four protocols, always running.</h2>
              </div>
              <p className="font-body-md text-on-surface-variant max-w-md md:text-right">Hot-loaded into the kernel. Each one signed by an operator and traced back to the source ritual.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-bento-gap bg-outline-variant/30 p-[1px]">
              {protocols.map(p => (
                <article key={p.id} className="bento-card p-6 flex flex-col gap-3 relative">
                  <div className="flex justify-between items-start relative z-10">
                    <span className="font-code-sm text-primary-fixed">{p.id}</span>
                    <span className={`w-2 h-2 rounded-full ${p.ledColor} animate-pulse ${p.ledShadow}`} />
                  </div>
                  <h3 className="font-headline-md text-on-surface uppercase relative z-10">{p.title}</h3>
                  <p className="font-body-md text-on-surface-variant relative z-10 flex-grow">{p.body}</p>
                  <div className="pt-3 border-t border-outline-variant flex justify-between font-code-sm relative z-10">
                    <span className="text-outline">{p.footL}</span>
                    <span className="text-tertiary-fixed-dim tabular-nums">{p.footR}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACOLYTES — full-bleed surface-container-low band */}
        <section className="full-bleed py-margin px-margin border-b border-outline-variant" style={{ backgroundColor: "#1c1b1b" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <span className="font-code-sm text-secondary uppercase tracking-widest mb-2 inline-block">// ACOLYTES · 1,247 ACTIVE</span>
                <h2 className="font-headline-lg text-on-surface">Voices from the void.</h2>
              </div>
              <p className="font-body-md text-on-surface-variant max-w-md md:text-right">Scrubbed from the encrypted relay. Operators, drifters, and a few ghosts. Verified by sigil only.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {acolytes.map(a => (
                <figure key={a.handle} className={`bento-card p-6 flex flex-col gap-4 relative scanline ${a.shift}`}>
                  <div className="flex justify-between items-start relative z-10">
                    <span className="font-code-sm text-primary-fixed">{a.handle}</span>
                    <span className={`font-code-sm ${a.sigilCls}`}>{a.sigil}</span>
                  </div>
                  <blockquote className="font-headline-md text-xl text-on-surface italic leading-snug relative z-10">"{a.quote}"</blockquote>
                  <figcaption className="mt-auto pt-4 border-t border-outline-variant flex justify-between font-code-sm relative z-10">
                    <span className="text-outline">{a.sector}</span>
                    <span className="text-tertiary-fixed-dim tabular-nums">{a.date}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CORE ENGINES — premium 2x2 with icons, ringed featured card */}
        <section className="full-bleed relative border-y-2 border-primary-fixed/40 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "linear-gradient(#00dbe9 1px, transparent 1px), linear-gradient(90deg, #00dbe9 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-fixed/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          <div className="relative max-w-5xl mx-auto px-margin">
            <div className="text-center flex flex-col items-center gap-3 mb-14 md:mb-16">
              <span className="font-code-sm text-tertiary-fixed-dim tracking-[0.5em] uppercase">// MODULE · 04</span>
              <h2 className="font-display-xl text-on-surface uppercase tracking-tighter leading-none text-[48px] md:text-[64px]">// FOUR · <span className="italic text-primary-fixed">ENGINES</span></h2>
              <p className="font-body-md text-on-surface-variant max-w-xl">Hardware-signed, kernel-loaded, scanline-flickered. Each engine ships with its own SHA-3 trace and a 99.97% uptime contract.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-stretch">
              {engines.map((e) => {
                const t = engineTone[e.tone];
                return (
                  <article key={e.title} className={`relative${e.featured ? ` ring-2 ${t.ring} ring-offset-4 ring-offset-[#0a0a0a]` : ""}`}>
                    {e.featured ? (
                      <div className={`absolute -top-3 right-6 z-20 px-2 py-0.5 bg-black border ${t.pillBd} font-code-sm ${t.pillTx} text-[10px] flex items-center gap-1.5`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse shadow-[0_0_6px_#00dbe9]" />ACTIVE
                      </div>
                    ) : (
                      <div className={`absolute -top-3 right-6 z-20 px-2 py-0.5 bg-black border ${t.pillBd} font-code-sm ${t.pillTx} text-[10px]`}>{e.sector}</div>
                    )}
                    <div className={`border-2 ${t.border} bg-black/85 backdrop-blur p-8 md:p-10 flex flex-col gap-5 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full`}>
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0 1px, transparent 1px 4px)" }} />
                      {e.featured && <div className="absolute top-3 left-4 font-code-sm text-primary-fixed/40 text-[10px] tracking-widest">{e.sector}</div>}
                      <div className="flex justify-between items-start relative z-10 mt-3">
                        <span className={`font-headline-md italic ${t.numeralTx} text-3xl`}>{e.numeral}</span>
                        <span className={`material-symbols-outlined ${t.iconTx} text-[32px] ${t.iconShadow}`}>{e.icon}</span>
                      </div>
                      <h3 className="font-headline-md text-on-surface uppercase relative z-10 text-2xl tracking-tight">{e.title}</h3>
                      <p className="font-body-md text-on-surface-variant relative z-10">{e.body}</p>
                      <div className={`border-t ${t.hairline} pt-4 mt-auto flex justify-between items-center relative z-10`}>
                        <span className={`font-code-sm ${t.statTx}`}>{e.stat}</span>
                        <span className={`material-symbols-outlined ${t.iconTx} text-xl group-hover:translate-x-1 transition-transform`}>arrow_forward</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* The Ritual (CTA) — premium: image overlay + diagonal pattern + corner brackets + halo + scanlines */}
        <section className="p-margin relative min-h-[640px] flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          {/* 1. Image bg (server-rack relic, hue-shifted to magenta cyber) */}
          <img alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 saturate-150 hue-rotate-[290deg] mix-blend-luminosity pointer-events-none" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop" />
          {/* 2. Original diagonal pattern (kept) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(30deg, #5b005b 12%, transparent 12.5%, transparent 87%, #5b005b 87.5%, #5b005b), linear-gradient(150deg, #5b005b 12%, transparent 12.5%, transparent 87%, #5b005b 87.5%, #5b005b), linear-gradient(30deg, #5b005b 12%, transparent 12.5%, transparent 87%, #5b005b 87.5%, #5b005b), linear-gradient(150deg, #5b005b 12%, transparent 12.5%, transparent 87%, #5b005b 87.5%, #5b005b), linear-gradient(60deg, #380038 25%, transparent 25.5%, transparent 75%, #380038 75%, #380038), linear-gradient(60deg, #380038 25%, transparent 25.5%, transparent 75%, #380038 75%, #380038)", backgroundSize: "40px 70px", backgroundPosition: "0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px" }} />
          {/* 3. Dark vertical gradient + radial vignette so headline + button read clean */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80 pointer-events-none"></div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)" }}></div>
          {/* 4. Magenta halo behind the IGNITE button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-secondary/20 blur-[140px] pointer-events-none"></div>
          {/* 5. Scanline veneer */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 4px)" }}></div>
          {/* Corner brackets (cyan top, magenta bottom) */}
          <div aria-hidden="true" className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-primary-fixed/60 pointer-events-none"></div>
          <div aria-hidden="true" className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-primary-fixed/60 pointer-events-none"></div>
          <div aria-hidden="true" className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-secondary/60 pointer-events-none"></div>
          <div aria-hidden="true" className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-secondary/60 pointer-events-none"></div>
          {/* Top status caption (centred) */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 font-code-sm text-tertiary-fixed-dim text-[10px] tracking-[0.5em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse shadow-[0_0_6px_#00dbe9]"></span>
            // PROTOCOL :: READY
          </div>
          <div className="relative z-10 text-center flex flex-col items-center gap-6 max-w-xl px-4">
            <span className="font-code-sm text-secondary tracking-[0.4em] uppercase text-[11px]">// SECTOR_FINAL</span>
            <h2 className="font-headline-lg text-on-surface bg-background/80 px-6 py-3 border-2 border-outline-variant inline-block tracking-tight">COMMENCE THE RITUAL</h2>
            <p className="font-body-md text-on-surface-variant italic max-w-md">Press to ignite the relay. The kernel will hum, the sigil will burn, and the broadcast will run for ninety-nine hours.</p>
            <button className="w-48 h-48 rounded-full bg-error-container border-8 border-surface-container relative shadow-[0_20px_50px_rgba(255,0,0,0.45),inset_0_5px_15px_rgba(255,255,255,0.2)] flex items-center justify-center group active:transform active:translate-y-2 active:shadow-[0_5px_10px_rgba(255,0,0,0.3),inset_0_2px_5px_rgba(0,0,0,0.5)] transition-all duration-150 mt-2">
              <span className="font-headline-md text-on-error font-bold uppercase tracking-widest group-hover:scale-110 transition-transform">IGNITE</span>
            </button>
            {/* Bottom mono meta strip */}
            <div className="mt-4 flex items-center gap-5 font-code-sm text-outline text-[10px] tracking-widest uppercase">
              <span>// SAFETY_INTERLOCK :: ARMED</span>
              <span className="w-px h-3 bg-outline/40"></span>
              <span>// CHANNEL :: 144 Hz</span>
            </div>
          </div>
        </section>
        {/* TRANSMISSION FEED — sliding strip with mini rounded image cards */}
        <section className="full-bleed relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="absolute top-0 inset-x-0 h-[3px] z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, #00dbe9 20%, #fe00fe 80%, transparent 100%)" }} />
          <div className="relative max-w-7xl mx-auto px-margin pt-12 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <span className="font-code-sm text-tertiary-fixed-dim uppercase tracking-widest mb-1 inline-block">// TRANSMISSION FEED</span>
              <h3 className="font-headline-md text-on-surface">Last 8 broadcasts from the void.</h3>
            </div>
            <span className="font-code-sm text-outline">SCAN_RATE: 144 Hz · PINNED ON HOVER</span>
          </div>
          <div className="overflow-hidden py-4 mb-4">
            <div className="marquee-track marquee-left">
              {[...transmissions, ...transmissions].map((t, i) => (
                <a key={i} href="#" aria-hidden={i >= transmissions.length} className={`rounded-2xl border ${t.cardCls} bg-surface-container/60 backdrop-blur-sm px-3 py-2 flex items-center gap-3 shrink-0 hover:bg-surface-container transition-colors w-72`}>
                  <div className={`w-12 h-12 rounded-xl overflow-hidden border ${t.imgBorder} shrink-0${t.scan ? " relative scanline" : ""}`}>
                    <img alt={i < transmissions.length ? t.alt : ""} className={`w-full h-full object-cover ${t.imgClass}`} src={t.src} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-code-sm ${t.textColor} truncate`}>{t.label}</p>
                    <p className="font-code-sm text-outline truncate text-[10px]">{t.date}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[3px] z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, #fe00fe 20%, #00dbe9 80%, transparent 100%)" }} />
        </section>

        <footer className="block w-full border-t-4 border-stone-900 bg-black dark:bg-black p-12 lg:p-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 hover:bg-stone-900 transition-colors duration-300 relative group">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
          <div className="relative z-10">
            <div className="text-6xl font-headline-md font-black text-stone-900 dark:text-stone-800 uppercase mb-4">THE ALCHEMY VOID</div>
            <p className="font-body-md text-stone-400 dark:text-stone-500 font-serif">
              © 2142 THE ALCHEMY VOID. ALL RITES RESERVED. [GLITCH-FREE CERTIFIED]
            </p>
          </div>
          <div className="flex flex-col gap-2 relative z-10 font-code-sm">
            {footerLinks.map((l) => (
              <a key={l} href="#" className="text-stone-600 dark:text-stone-700 hover:text-primary-fixed transition-colors">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
