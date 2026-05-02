export default function T49ThreeJs() {
  const navLinks = [
    { href: "#assets", label: "Assets" },
    { href: "#artists", label: "Artists" },
    { href: "#collections", label: "Collections" },
    { href: "#studio", label: "Studio" },
  ];

  const categories = [
    { id: "abstract", label: "Abstract", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800", alt: "Abstract flowing 3D geometric liquid shapes in deep metallic tones.", w: 600, h: 600, span: "col-span-1", overlay: "via-surface-container-lowest/20" },
    { id: "characters", label: "Characters", img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800", alt: "High detail 3D cyberpunk character helmet render with neon accents on dark background.", w: 600, h: 600, span: "col-span-1", overlay: "via-surface-container-lowest/20" },
    { id: "environments", label: "Environments", img: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&q=80&w=800", alt: "Vast sci-fi interior environment 3D render with massive scale, atmospheric fog and dramatic cinematic lighting.", w: 600, h: 1200, span: "lg:col-span-1 lg:row-span-2", overlay: "via-surface-container-lowest/40" },
    { id: "vehicles", label: "Vehicles", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800", alt: "Futuristic hovering vehicle 3D model with intricate mechanical details and glowing engine parts.", w: 600, h: 600, span: "col-span-1", overlay: "via-surface-container-lowest/20" },
    { id: "props", label: "Props", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800", alt: "Close up of stylized 3D vintage camera prop with highly detailed textures and depth of field.", w: 600, h: 600, span: "col-span-1", overlay: "via-surface-container-lowest/20" },
  ];

  const trending = [
    { id: 1, title: "Aether Core", artist: "SYNTHTECH", price: "$45", tag: ".OBJ", tagColor: "bg-secondary/10 border-secondary/30 text-secondary", img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=600", alt: "Abstract 3D rendering of a glowing geometric sphere resembling a futuristic energy core." },
    { id: 2, title: "Mecha Organism 01", artist: "NXO", price: "$120", tag: ".BLEND", tagColor: "bg-primary-container/10 border-primary-container/30 text-primary-fixed", img: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=600", alt: "Detailed 3D render of a futuristic mechanical heart with glowing red elements." },
    { id: 3, title: "Data Silo Asset Pack", artist: "Environmentals", price: "$89", tag: ".FBX", tagColor: "bg-secondary/10 border-secondary/30 text-secondary", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600", alt: "Row of high-tech server racks with glowing blue lights in a data center." },
    { id: 4, title: "Iridescent Scales", artist: "Materialize", price: "$15", tag: "MAT", tagColor: "bg-tertiary/10 border-tertiary/30 text-tertiary", img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=600", alt: "Iridescent and holographic 3D wave texture showing smooth, colorful gradient surfaces." },
  ];

  const stripAssets = [
    { id: "01", code: "VOL-014 · MATERIAL", img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=400", alt: "Iridescent chromatic surface — material study volume one." },
    { id: "02", code: "VOL-022 · ENV PACK", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400", alt: "Circuit-board macro photograph used as PCB micro-detail reference." },
    { id: "03", code: "VOL-031 · INTERIOR", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400", alt: "High-tech server racks bathed in cyan LED — referenced for data-silo asset pack." },
    { id: "04", code: "VOL-046 · HARDSURFACE", img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=400", alt: "Industrial mechanical cluster — dense pipe geometry reference." },
    { id: "05", code: "VOL-058 · SCUFF KIT", img: "https://images.unsplash.com/photo-1551808525-51a94da548ce?auto=format&fit=crop&q=80&w=400", alt: "Macro detail of polished metal manifold — surface scuff library." },
    { id: "06", code: "VOL-067 · LIGHTRIG", img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400", alt: "Glowing geometric sphere render — referenced for energy-core preset." },
    { id: "07", code: "VOL-073 · SHADER", img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=400", alt: "Iridescent chromatic wave texture — used as default look-dev shader." },
    { id: "08", code: "VOL-088 · CHROME", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=400", alt: "Abstract chrome liquid 3D forms — flagship abstract preset." },
  ];

  const doctrineNotes = [
    { num: "01", kicker: "Topology", title: "N-gons rejected", body: "Quads on deformers, triangles on hard-surface only. Forty-minute audit per submission with a screen-recorded report sent back to the author either way.", accent: "primary" },
    { num: "02", kicker: "Material", title: "ACES color space", body: "Every PBR set rebuilt in ACEScg against an 18% grey card. Identical look in Octane, Redshift, Cycles, and Karma — no re-keying.", accent: "secondary" },
    { num: "03", kicker: "LOD ladder", title: "4 tiers, 2k → 64-vert", body: "Hero, beauty, mid, billboard. Pre-baked transitions in JSON. Silhouette breakage held under three percent between tiers.", accent: "primary" },
    { num: "04", kicker: "Documentation", title: "USD-validated metadata", body: "Real-world scale, renderer, license, deterministic build hash. Human-readable PDF with shading networks ships in every pack.", accent: "secondary" },
  ];
  const doctrineNumColor = { primary: "text-primary-container", secondary: "text-secondary" };
  const doctrineBorderColor = { primary: "border-primary-container/40", secondary: "border-secondary/40" };

  const pipelineNodes = [
    { label: "Submitted", icon: "cloud_upload", time: "T+0", cls: "pipeline-node-1", border: "border-secondary/30", iconColor: "text-secondary", timeColor: "text-secondary/80", labelColor: "text-on-surface-variant" },
    { label: "Topology", icon: "polyline", time: "T+40m", cls: "pipeline-node-2", border: "border-secondary/30", iconColor: "text-secondary", timeColor: "text-secondary/80", labelColor: "text-on-surface-variant" },
    { label: "Material", icon: "palette", time: "T+2h", cls: "pipeline-node-3", border: "border-secondary/30", iconColor: "text-secondary", timeColor: "text-secondary/80", labelColor: "text-on-surface-variant" },
    { label: "LOD · Docs", icon: "stacked_line_chart", time: "T+3h", cls: "pipeline-node-4", border: "border-secondary/30", iconColor: "text-secondary", timeColor: "text-secondary/80", labelColor: "text-on-surface-variant" },
    { label: "Shipped", icon: "rocket_launch", time: "T+5h", cls: "pipeline-node-5", border: "border-primary-container/40", iconColor: "text-primary-container", timeColor: "text-primary-container/80", labelColor: "text-secondary" },
  ];

  const audienceTiers = [
    {
      tier: "Tier 01", icon: "corporate_fare", accent: "secondary",
      title: "Studios", kicker: "Agency-grade rights",
      bullets: [
        "Single contract covers all staff and freelancers",
        "Broadcast, cinema, OOH — no per-spot fees",
        "Exclusivity windows on hero assets"
      ]
    },
    {
      tier: "Tier 02", icon: "person", accent: "primary",
      title: "Solo creators", kicker: "Per-asset licenses",
      bullets: [
        "Predictable per-unit pricing — no subscription",
        "Commercial use up to revenue ceiling",
        "Free monthly drop for verified portfolios"
      ]
    },
    {
      tier: "Tier 03", icon: "school", accent: "secondary",
      title: "Educators", kicker: "Classroom packs",
      bullets: [
        "Unlimited student seats",
        "Annual flat institutional rate",
        "Coursework license stays perpetual"
      ]
    },
  ];
  const audienceBorderColor = { primary: "border-primary-container/40", secondary: "border-secondary/40" };
  const audienceTextColor = { primary: "text-primary-container", secondary: "text-secondary" };
  const audienceTierTextColor = { primary: "text-primary-container/80", secondary: "text-secondary/80" };

  const faqs = [
    { q: "What’s included in a license?", a: "Every purchase includes the source mesh in its native authoring format, the complete PBR texture set at full resolution, the four-tier LOD ladder, the USD payload with validated metadata, and a human-readable PDF that documents shading networks, scale, and intended camera setup. Licenses cover commercial use up to the revenue ceiling listed on the asset page, derivative work in your own portfolio in perpetuity, and version pinning so a project shipped today can be rebuilt unchanged five years from now." },
    { q: "Can I use assets in commercial work?", a: "Yes, every asset on the marketplace ships with a commercial license by default. Solo and indie creators are covered up to a generous annual revenue ceiling, agencies and production studios upgrade to a studio bundle that removes the ceiling entirely, and broadcast or theatrical placements are covered automatically without per-spot fees. Re-selling the asset itself or redistributing it as part of another asset pack is the only carve-out, and the boundary is documented in plain language inside every download." },
    { q: "Are textures 8K?", a: "Hero assets ship with 8K texture sets at full sixteen-bit-per-channel precision for albedo, normal, roughness, metallic, and displacement, plus 2K downsampled variants pre-baked for the lower LOD tiers. Background and set-dressing assets default to 4K at the hero tier because the silhouette never carries close-up detail, but every artist can opt into 8K delivery during submission and the marketplace flags the resolution clearly on every product page so you never download more pixels than the shot needs." },
    { q: "Do you support Cinema 4D, Blender, and Houdini?", a: "Cinema 4D, Blender, and Houdini are first-class targets, and every hero asset is opened, validated, and shading-network-rebuilt in all three before it ships. Maya and 3ds Max scenes are produced from the same USD payload via our internal converter and are functionally identical at render time. We also publish a small command-line tool that re-bakes shading networks for Octane, Redshift, Cycles, Karma, and Arnold so a single license never requires you to re-author look-dev when you change renderer halfway through a project." },
    { q: "Is there a free trial?", a: "A free monthly drop ships to anyone with a verified motion-design portfolio — one curated hero asset every thirty days, the same asset that paying members receive, with an identical commercial license attached. Studios and educators can request an extended evaluation that unlocks a full classroom-grade pack for thirty days inside a sandboxed account, and our team will run a private walkthrough on a video call so the right people on your pipeline see the asset perform before any contract is signed." },
    { q: "How are assets versioned?", a: "Every asset carries a deterministic hash and a semantic version number that increments on any change to topology, materials, or the LOD ladder. Older revisions remain available forever from the same product page, never silently overwritten, and a changelog explains exactly what moved between versions so a producer can decide whether to rebuild a project. Studios that need to pin a specific revision through a multi-year campaign can do so with a single line in the included USD payload, and our pipeline tooling will warn before any in-place upgrade." },
    { q: "Refund policy?", a: "Every individual asset and every studio bundle is refundable in full within fourteen days of purchase, no questions asked — you keep the QA report we ran during curation, you delete the source files, and the refund posts to the original payment method inside three business days. After fourteen days we still review case-by-case for technical defects discovered in production, and on the rare occasion we ship something that doesn’t match its product page we always issue a credit toward a replacement asset of equal or greater hero tier on top of the refund." },
  ];

  const footerLinks = [
    { href: "#docs", label: "Documentation" },
    { href: "#discord", label: "Discord" },
    { href: "#twitter", label: "Twitter" },
    { href: "#license", label: "License" },
    { href: "#privacy", label: "Privacy" },
  ];

  const tailwindConfig = `tailwind.config = {
  darkMode: "class",
  theme: { extend: {
    colors: {
      "surface-container": "#1e1f24", "surface-dim": "#121317", "surface-container-lowest": "#0d0e12",
      "error-container": "#93000a", "tertiary": "#c6c6c8", "primary-container": "#a078ff",
      "surface-container-highest": "#343439", "on-secondary-fixed": "#001f26", "surface": "#121317",
      "on-error": "#690005", "outline-variant": "#494454", "tertiary-fixed": "#e2e2e4",
      "secondary-fixed": "#acedff", "outline": "#958ea0", "on-background": "#e3e2e8",
      "background": "#121317", "on-secondary-fixed-variant": "#004e5c", "on-primary-fixed-variant": "#5516be",
      "on-secondary": "#003640", "primary-fixed-dim": "#d0bcff", "primary-fixed": "#e9ddff",
      "on-tertiary-container": "#282a2c", "on-tertiary": "#2f3132", "surface-container-low": "#1a1b20",
      "on-surface-variant": "#cbc3d7", "surface-bright": "#38393e", "tertiary-container": "#909193",
      "on-primary": "#3c0091", "surface-container-high": "#292a2e", "error": "#ffb4ab",
      "secondary-container": "#03b5d3", "on-tertiary-fixed": "#1a1c1d", "primary": "#d0bcff",
      "inverse-surface": "#e3e2e8", "surface-variant": "#343439", "on-secondary-container": "#00424e",
      "inverse-on-surface": "#2f3035", "secondary": "#4cd7f6", "secondary-fixed-dim": "#4cd7f6",
      "on-primary-fixed": "#23005c", "inverse-primary": "#6d3bd7", "on-primary-container": "#340080",
      "on-tertiary-fixed-variant": "#454749", "on-surface": "#e3e2e8", "on-error-container": "#ffdad6",
      "tertiary-fixed-dim": "#c6c6c8", "surface-tint": "#d0bcff"
    },
    spacing: {
      "gutter": "clamp(1rem, 4vw, 1.5rem)", "unit": "8px",
      "container-max": "1440px", "margin": "clamp(1.5rem, 5vw, 4rem)"
    },
    fontFamily: {
      "display-xl": ["Inter", "sans-serif"], "headline-lg": ["Inter", "sans-serif"],
      "body-md": ["Inter", "sans-serif"], "price-lg": ["Space Grotesk", "sans-serif"],
      "label-mono": ["Space Grotesk", "monospace"], "headline-md": ["Inter", "sans-serif"]
    },
    fontSize: {
      "display-xl": ["clamp(3rem, 5vw + 1rem, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
      "headline-lg": ["clamp(2rem, 3vw + 0.5rem, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
      "body-md": ["clamp(1rem, 1vw + 0.5rem, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
      "price-lg": ["1.25rem", { lineHeight: "1.0", fontWeight: "700" }],
      "label-mono": ["0.875rem", { lineHeight: "1.0", letterSpacing: "0.05em", fontWeight: "500" }],
      "headline-md": ["clamp(1.25rem, 2vw + 0.5rem, 1.5rem)", { lineHeight: "1.4", fontWeight: "500" }]
    }
  } }
};`;

  const customCss = `.glass-panel {
  background: linear-gradient(135deg, rgba(30, 31, 36, 0.4) 0%, rgba(18, 19, 23, 0.2) 100%);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid transparent; background-clip: padding-box; position: relative;
}
.glass-panel::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
}
.chromatic-glow:hover {
  box-shadow: 0 0 40px rgba(76, 215, 246, 0.15), inset 0 0 20px rgba(160, 120, 255, 0.05);
  border-color: rgba(76, 215, 246, 0.3);
}
::selection { background-color: #4cd7f6; color: #003640; }
.text-balance { text-wrap: balance; }
.text-pretty { text-wrap: pretty; }
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  display: inline-block; vertical-align: middle;
}
@keyframes pipeline-pulse {
  0% { transform: translateX(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(400%); opacity: 0; }
}
@keyframes pipeline-node-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(76, 215, 246, 0.4), inset 0 0 0 0 rgba(76, 215, 246, 0.2); }
  50% { box-shadow: 0 0 24px 4px rgba(76, 215, 246, 0.5), inset 0 0 18px 0 rgba(76, 215, 246, 0.3); }
}
.pipeline-pulse-bar { animation: pipeline-pulse 4.5s linear infinite; }
.pipeline-node-1 { animation: pipeline-node-pulse 4.5s ease-in-out infinite; animation-delay: 0s; }
.pipeline-node-2 { animation: pipeline-node-pulse 4.5s ease-in-out infinite; animation-delay: 0.9s; }
.pipeline-node-3 { animation: pipeline-node-pulse 4.5s ease-in-out infinite; animation-delay: 1.8s; }
.pipeline-node-4 { animation: pipeline-node-pulse 4.5s ease-in-out infinite; animation-delay: 2.7s; }
.pipeline-node-5 { animation: pipeline-node-pulse 4.5s ease-in-out infinite; animation-delay: 3.6s; }
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@300,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="dark scroll-smooth bg-surface-container-lowest text-on-surface antialiased overflow-x-hidden flex flex-col min-h-screen">
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#08090D]/80 backdrop-blur-[20px] transition-all">
          <div className="flex items-center justify-between px-6 md:px-16 h-20 w-full max-w-[1600px] mx-auto">
            <div className="flex items-center gap-12">
              <a href="#" className="text-2xl font-black tracking-[0.2em] text-white uppercase font-label-mono antialiased focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm">VOLUME</a>
              <div className="hidden md:flex items-center gap-8 font-label-mono antialiased" aria-label="Primary Navigation">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} className="text-slate-400 font-medium hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090D] rounded-sm">{l.label}</a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <button aria-label="Search assets" className="text-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-full p-1">
                <span className="material-symbols-outlined" aria-hidden="true">search</span>
              </button>
              <button aria-label="View cart" className="text-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-full p-1">
                <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
              </button>
              <a href="#browse" className="hidden sm:inline-flex relative overflow-hidden bg-gradient-to-r from-primary-container to-secondary text-on-primary-container px-6 py-2.5 rounded-full font-label-mono text-label-mono uppercase hover:scale-[0.98] transform transition-transform shadow-[0_0_20px_rgba(160,120,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090D]">
                <span className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></span>
                Browse
              </a>
              <button aria-label="Open mobile menu" aria-expanded="false" className="md:hidden text-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-full p-1">
                <span className="material-symbols-outlined" aria-hidden="true">menu</span>
              </button>
            </div>
          </div>
        </nav>

        <header className="relative w-full min-h-screen flex items-center md:items-end pb-20 md:pb-32 pt-32 px-margin max-w-container-max mx-auto overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20" aria-hidden="true" style={{ backgroundImage: "linear-gradient(to right, #343439 1px, transparent 1px), linear-gradient(to bottom, #343439 1px, transparent 1px)", backgroundSize: "64px 64px", transform: "perspective(1000px) rotateX(60deg) scale(2)", transformOrigin: "bottom" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 md:-translate-x-1/3 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] z-0 pointer-events-none" aria-hidden="true">
            <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1920&q=90&auto=format&fit=crop" alt="" width="800" height="800" className="w-full h-full object-cover mix-blend-screen opacity-90 md:opacity-100 rounded-full blur-[2px]" loading="eager" decoding="async" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-container/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-secondary/20 rounded-full blur-[60px] md:blur-[100px] mix-blend-screen"></div>
          </div>
          <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-gutter text-center md:text-left mt-20 md:mt-0">
            <div className="col-span-1 md:col-span-8 lg:col-span-7 flex flex-col items-center md:items-start gap-6 md:gap-8">
              <h1 className="font-display-xl text-display-xl text-on-surface text-balance">The 3D asset marketplace, for motion designers</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[55ch] text-pretty">Discover high-fidelity, production-ready 3D models, materials, and environments curated exclusively for elite digital artists.</p>
              <div className="pt-4">
                <a href="#browse" className="inline-block relative overflow-hidden bg-gradient-to-r from-primary-container to-secondary text-on-primary-container px-8 py-4 rounded-full font-label-mono text-label-mono uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_30px_rgba(160,120,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-surface-container-lowest">
                  <span className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></span>
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-container-max mx-auto w-full px-margin flex flex-col gap-24 lg:gap-[120px] pb-24 lg:pb-[120px]">
          <section id="browse" className="flex flex-col gap-10 scroll-mt-32">
            <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">Browse by category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
              {categories.map(c => (
                <a key={c.id} href={`#category-${c.id}`} className={`group glass-panel rounded-xl overflow-hidden relative flex items-end p-8 chromatic-glow transition-all duration-500 ${c.span} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-surface-container-lowest`}>
                  <img src={c.img} alt={c.alt} width={c.w} height={c.h} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" loading="lazy" decoding="async" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-surface-container-lowest ${c.overlay} to-transparent pointer-events-none`}></div>
                  <span className="relative z-10 font-headline-md text-headline-md text-on-surface group-hover:text-secondary transition-colors">{c.label}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-10">
            <div className="flex items-end justify-between border-b border-outline-variant/30 pb-4">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Trending this week</h2>
              <a href="#trending" className="font-label-mono text-label-mono text-secondary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm">
                View All <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {trending.map(t => (
                <article key={t.id} className="group relative rounded-xl transition-all duration-500 border border-transparent hover:border-outline-variant/50 hover:bg-surface-container/20 p-4 -m-4">
                  <a href={`#item-${t.id}`} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset rounded-xl" aria-label={`View ${t.title} details`}></a>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low mb-6">
                    <img src={t.img} alt={t.alt} width="400" height="400" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                    <div className={`absolute top-4 left-4 ${t.tagColor} backdrop-blur-md border px-2 py-1 rounded font-label-mono text-[11px] uppercase tracking-wider z-20`}>{t.tag}</div>
                  </div>
                  <div className="flex flex-col gap-1 relative z-20 pointer-events-none">
                    <h3 className="font-body-md text-body-md text-on-surface font-medium truncate group-hover:text-secondary transition-colors">{t.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant truncate">by {t.artist}</p>
                    <span className="absolute bottom-0 right-0 font-price-lg text-price-lg text-on-surface">{t.price}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden border border-white/5">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
            <div className="flex items-end justify-between gap-6 relative z-10">
              <div className="flex flex-col gap-2">
                <span className="font-label-mono text-label-mono uppercase tracking-[0.25em] text-secondary">VOL · LEDGER 04</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">Trending assets &middot; this week</h2>
              </div>
              <a href="#ledger" className="hidden md:inline-flex font-label-mono text-label-mono text-secondary hover:text-white transition-colors uppercase tracking-widest items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm">
                Open ledger <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
              {stripAssets.map(s => (
                <a key={s.id} href={`#strip-${s.id}`} className="group relative aspect-square rounded-lg overflow-hidden chromatic-glow border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
                  <img src={s.img} alt={s.alt} width="400" height="400" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 to-secondary/30 mix-blend-overlay pointer-events-none"></div>
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-surface-container-lowest/95 via-surface-container-lowest/40 to-transparent">
                    <span className="font-label-mono text-[10px] uppercase tracking-[0.18em] text-on-surface block leading-tight">{s.code}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* VOL · DOCTRINE — pipeline diagram + trimmed stage notes (merged) */}
          <section className="rounded-2xl p-10 md:p-16 flex flex-col gap-12 relative overflow-hidden border border-white/10 bg-surface-container-low/85">
            <div className="absolute -top-32 right-1/3 w-[28rem] h-[28rem] bg-secondary/8 rounded-full blur-[140px] pointer-events-none" aria-hidden="true"></div>
            <div className="absolute -bottom-32 left-1/4 w-[24rem] h-[24rem] bg-primary-container/8 rounded-full blur-[140px] pointer-events-none" aria-hidden="true"></div>
            <div className="flex flex-col gap-4 max-w-[60ch] relative z-10">
              <span className="font-label-mono text-label-mono uppercase tracking-[0.25em] text-secondary">VOL · DOCTRINE</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">Five-pass QA, every submission</h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-pretty">Submitted at the left, shipped at the right. Topology, materials, LODs, and metadata each measured against published specifications — not vibes.</p>
            </div>
            <div className="relative w-full pt-4 pb-2 z-10">
              <div className="absolute left-[6%] right-[6%] top-[3.25rem] md:top-[3.75rem] h-px bg-gradient-to-r from-transparent via-on-surface-variant/25 to-transparent pointer-events-none"></div>
              <div className="absolute left-[6%] right-[6%] top-[3.25rem] md:top-[3.75rem] h-[2px] overflow-hidden pointer-events-none">
                <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_24px_rgba(76,215,246,0.9)] pipeline-pulse-bar"></div>
              </div>
              <div className="relative grid grid-cols-5 gap-2 sm:gap-4 md:gap-8">
                {pipelineNodes.map(n => (
                  <div key={n.label} className="flex flex-col items-center gap-3">
                    <span className={`font-label-mono text-[10px] uppercase tracking-[0.2em] ${n.labelColor} text-center`}>{n.label}</span>
                    <div className={`${n.cls} relative w-16 h-16 md:w-24 md:h-24 rounded-full border ${n.border} bg-surface-container-lowest/80 flex items-center justify-center backdrop-blur`}>
                      <span className={`material-symbols-outlined ${n.iconColor} text-[28px] md:text-[36px]`} aria-hidden="true">{n.icon}</span>
                    </div>
                    <span className={`font-label-mono text-[10px] tabular-nums ${n.timeColor}`}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 relative z-10">
              {doctrineNotes.map(d => (
                <div key={d.num} className={`flex flex-col gap-3 border-t pt-5 ${doctrineBorderColor[d.accent]}`}>
                  <div className="flex items-baseline justify-between">
                    <span className={`font-price-lg text-[1.25rem] leading-none tabular-nums ${doctrineNumColor[d.accent]}`}>{d.num}</span>
                    <span className="font-label-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">{d.kicker}</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] text-on-surface leading-snug">{d.title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant text-pretty">{d.body}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10 pt-6 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <span className="font-label-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Avg. cycle</span>
                <span className="font-price-lg text-[1.5rem] text-on-surface tabular-nums">5h 12m</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Pass rate</span>
                <span className="font-price-lg text-[1.5rem] text-secondary tabular-nums">42%</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Reviewers</span>
                <span className="font-price-lg text-[1.5rem] text-on-surface tabular-nums">7</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Q3 throughput</span>
                <span className="font-price-lg text-[1.5rem] text-primary-container tabular-nums">312</span>
              </div>
            </div>
          </section>

          {/* VOL · AUDIENCE — three tiers, no nested cards */}
          <section className="flex flex-col gap-12 relative">
            <div className="flex items-end justify-between gap-6 flex-wrap relative z-10">
              <div className="flex flex-col gap-3 max-w-[50ch]">
                <span className="font-label-mono text-label-mono uppercase tracking-[0.25em] text-secondary">VOL &middot; AUDIENCE</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">For motion designers, by motion designers</h2>
              </div>
              <span className="font-label-mono text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/60">Three tiers · one library</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-14 relative z-10">
              {audienceTiers.map(t => (
                <div key={t.tier} className={`flex flex-col gap-6 border-t pt-6 ${audienceBorderColor[t.accent]}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-label-mono text-[10px] uppercase tracking-[0.25em] ${audienceTierTextColor[t.accent]}`}>{t.tier}</span>
                    <span className={`material-symbols-outlined ${audienceTextColor[t.accent]} text-[44px] md:text-[52px]`} aria-hidden="true">{t.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-[22px] text-on-surface leading-tight">{t.title}</h3>
                    <p className={`font-label-mono text-[11px] uppercase tracking-[0.18em] ${audienceTierTextColor[t.accent]}`}>{t.kicker}</p>
                  </div>
                  <ul className="flex flex-col gap-3 font-body-md text-sm text-on-surface-variant">
                    {t.bullets.map(b => (
                      <li key={b} className="flex gap-3"><span className={`${audienceTextColor[t.accent]} mt-[2px]`}>→</span><span>{b}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* VOL · ETHOS — separated editorial */}
          <section className="flex flex-col gap-10 relative">
            <div className="flex flex-col gap-3 max-w-[60ch] relative z-10">
              <span className="font-label-mono text-label-mono uppercase tracking-[0.25em] text-secondary">VOL &middot; ETHOS</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">Two lines we won&rsquo;t cross</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-10">
              <div className="flex flex-col gap-4">
                <span className="font-label-mono text-[11px] uppercase tracking-[0.25em] text-secondary">01 · Curation</span>
                <h3 className="font-headline-md text-[22px] text-on-surface leading-tight">The moat is the editorial pass.</h3>
                <p className="font-body-md text-sm text-on-surface-variant text-pretty">Every drop is sequenced by working motion designers — does it solve a real production problem, or is it another high-poly demo? Assets that don&rsquo;t earn the front page get shelved into the craft archive, never quietly slipped into search to pad inventory.</p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-label-mono text-[11px] uppercase tracking-[0.25em] text-primary-container">02 · Pricing</span>
                <h3 className="font-headline-md text-[22px] text-on-surface leading-tight">Hero assets cost what they cost.</h3>
                <p className="font-body-md text-sm text-on-surface-variant text-pretty">The artist who spent the days takes home <span className="text-primary-container font-semibold">70%</span> of every sale. No vanity discounts, no subscription holding your library hostage. Buy the asset, own the asset, ship the project.</p>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-10 md:p-16 flex flex-col gap-10 relative overflow-hidden border border-white/5">
            <div className="absolute -top-32 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>
            <div className="flex flex-col gap-4 max-w-[60ch] relative z-10">
              <span className="font-label-mono text-label-mono uppercase tracking-[0.25em] text-secondary">VOL &middot; SUPPORT</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">Frequently asked questions</h2>
            </div>
            <div className="flex flex-col gap-3 relative z-10 max-w-5xl">
              {faqs.map((f, i) => (
                <details key={i} className="group rounded-xl border border-outline-variant/30 bg-surface-container/30 overflow-hidden transition-all">
                  <summary className="flex items-center justify-between gap-6 p-6 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-xl">
                    <span className="font-headline-md text-headline-md text-on-surface">{f.q}</span>
                    <span className="material-symbols-outlined text-primary-container transition-transform duration-300 group-open:rotate-90" aria-hidden="true">chevron_right</span>
                  </summary>
                  <p className="font-body-md text-sm text-on-surface-variant text-pretty px-6 pb-6 -mt-1">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-10 md:p-16 lg:p-24 flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden mt-8 border border-white/5 shadow-2xl">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
            <h2 className="font-display-xl text-display-xl text-on-surface leading-tight relative z-10 text-balance">Join the marketplace</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[60ch] text-pretty relative z-10">Are you a top-tier 3D artist? Open a studio on Volume and sell your high-fidelity assets to the world's best motion designers and studios.</p>
            <div className="pt-6 relative z-10">
              <a href="#apply" className="inline-block relative overflow-hidden bg-surface-container-highest border border-outline-variant text-on-surface px-8 py-4 rounded-full font-label-mono text-label-mono uppercase tracking-widest hover:bg-surface-bright transition-all chromatic-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-surface-container-highest">Apply as Creator</a>
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-white/5 py-10 bg-[#08090D] shadow-none mt-auto">
          <div className="max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
              <a href="#" className="text-xl font-bold text-white font-label-mono tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm">VOLUME</a>
              <span className="font-label-mono text-xs tracking-widest uppercase text-slate-500">&copy; 2024 VOLUME. PRECISION DIGITAL ASSETS.</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-label-mono text-xs tracking-widest uppercase" aria-label="Footer Navigation">
              {footerLinks.map(l => (
                <a key={l.href} href={l.href} className="text-slate-500 hover:text-secondary transition-colors opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm">{l.label}</a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
