const WORLD_TILES = [
  { id: "T-014", caption: "PALE_CITY", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", alt: "Architecture facade" },
  { id: "T-022", caption: "CONCRETE_HUM", img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop", alt: "Brutalist hall" },
  { id: "T-031", caption: "SPIRAL_AXIS", img: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85&auto=format&fit=crop", alt: "Tower stair" },
  { id: "T-047", caption: "GLASS_LATTICE", img: "https://images.unsplash.com/photo-1618488373960-404fe668e524?w=900&q=85&auto=format&fit=crop", alt: "Geometric facade" },
  { id: "T-058", caption: "VAULT_NULL", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", alt: "Modern interior" },
  { id: "T-066", caption: "SERVER_HYMN", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "Server rack" },
  { id: "T-073", caption: "TRACE_FIELD", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", alt: "Circuit macro" },
  { id: "T-089", caption: "METAL_DRIFT", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", alt: "Industrial machinery" },
];

const MANIFESTO_BLOCKS = [
  {
    title: "WE BELIEVE",
    color: "primary-fixed",
    rgb: "0,251,251",
    body: "We believe in the persistence of the unbuilt timeline. Every decision shipped to production carries with it the ghosts of every decision that almost was — the rejected mock, the unspoken syntax, the variant that nearly survived peer review. The void does not delete; it archives. What you see on the surface of any product is a single sliver of a much larger lattice, and every collaborator who has ever opened the same file in the same week has briefly co-authored the version that you are about to ship. The manifest is what makes that legible. It does not predict; it remembers forward. We hold this remembering as our first organising principle.",
  },
  {
    title: "IN THE BRANCH",
    color: "secondary-container",
    rgb: "254,0,254",
    body: "In the branch we trust the side-effect more than the headline. A timeline forks not at the moment a decision is made but at the moment a decision is observed by a second collaborator and silently negotiated. The fork is rarely dramatic. Most often it is a renamed variable, a comment that lands wrong, a meeting that ran four minutes long. These are the seams where the multiverse splits into two coherent presents. Our tools are built to honour that ordinary granularity — every keystroke gets a phase tag, every cursor movement is a possible doorway. You do not need permission to branch. You need only attention.",
  },
  {
    title: "IN THE PARALLEL",
    color: "primary-fixed",
    rgb: "0,251,251",
    body: "In the parallel we recognise that the version of the product running on a colleague's screen, three timezones away, is a parallel object. It shares your schema and rejects your assumptions. The parallel is what makes async meaningful — it is the substrate that lets two people work on the same idea without merge conflict, because the merge happens at a layer above the file. We have spent four years learning to surface that parallel without breaking the spell of focus. Phase drift is the technical name; flow is the felt name. Both descriptions are correct, and neither is sufficient.",
  },
  {
    title: "IN THE MIRROR",
    color: "secondary-container",
    rgb: "254,0,254",
    body: "In the mirror we accept that the artefact is also a portrait of the person who made it. A button placement is a small autobiography; an empty state is a confession. The mirror is the moment when the maker recognises themselves in the made thing and feels the weight of that recognition without flinching. Our manifests are designed to be mirror-readable. Every ship event carries a reflection vector — a structured note about who you were when you shipped it. Five years from now you will read the reflection and recognise a former self, and the timeline will contract back into a single line.",
  },
];

const MANIFESTO_BORDERS = {
  "primary-fixed": "border-primary-fixed/20",
  "secondary-container": "border-secondary-container/20",
};
const MANIFESTO_TEXT = {
  "primary-fixed": "text-primary-fixed",
  "secondary-container": "text-secondary-container",
};
const MANIFESTO_GLOW = {
  "primary-fixed": "drop-shadow-[0_0_8px_rgba(0,251,251,0.5)]",
  "secondary-container": "drop-shadow-[0_0_8px_rgba(254,0,254,0.5)]",
};

const PROTOCOLS = [
  {
    numeral: "I",
    code: "PROTO_ID · 0xMS-01",
    title: "MIRROR SYNC",
    accent: "primary-fixed",
    img: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=1200&q=85&auto=format&fit=crop",
    alt: "Mirrored facade",
    body: "Mirror Sync is the canonical handshake between two collaborators editing the same manifest in different timezones. The protocol is symmetric — neither party is treated as the source of truth, and merge resolution is deferred until both parties have voluntarily flagged a session as resolved. Cursor presence, selection, and clipboard history travel together as a single triplet, encrypted with a session key that rotates every twelve seconds. The result is a working surface that feels less like a document and more like a shared room with two windows. We use Mirror Sync as the default for any manifest opened by more than one collaborator inside a single calendar week.",
    tags: [
      { label: "CHAN · 12HZ", color: "primary-fixed" },
      { label: "CRYPT · X25519", color: "secondary-container" },
      { label: "LATENCY · 84MS", color: "outline" },
    ],
    reverse: false,
    overlay: "from-secondary-container/35 via-transparent to-primary-fixed/35",
    border: "border-primary-fixed/40",
    shadow: "shadow-[0_0_30px_rgba(0,251,251,0.25)]",
  },
  {
    numeral: "II",
    code: "PROTO_ID · 0xPD-02",
    title: "PHASE DRIFT",
    accent: "secondary-container",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85&auto=format&fit=crop",
    alt: "Server room interior",
    body: "Phase Drift handles the harder case — when two collaborators are nominally working on the same manifest but their attention has drifted out of phase. Rather than force a merge, Phase Drift builds a temporary parallel pocket of the timeline and reconciles only the portions that pass a structural similarity check. Drift is detected at the keystroke level, not the file level, which means a single sentence rewritten by both parties resolves cleanly while a wholesale section rewrite forks into two manifests with a conjoined ancestor. Drift sessions decay after seventy-two hours unless reactivated by either party. We treat drift as the healthier default.",
    tags: [
      { label: "DECAY · 72H", color: "secondary-container" },
      { label: "FORK · STRUCTURAL", color: "primary-fixed" },
      { label: "RES · KEYSTROKE", color: "outline" },
    ],
    reverse: true,
    overlay: "from-primary-fixed/35 via-transparent to-secondary-container/35",
    border: "border-secondary-container/40",
    shadow: "shadow-[0_0_30px_rgba(254,0,254,0.25)]",
  },
  {
    numeral: "III",
    code: "PROTO_ID · 0xEB-03",
    title: "ECHO BIND",
    accent: "primary-fixed",
    img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1200&q=85&auto=format&fit=crop",
    alt: "Industrial machinery",
    body: "Echo Bind is the closing protocol — the part of the system responsible for stitching a finished manifest back into the canonical timeline so that downstream consumers see a coherent revision. Bindings are append-only and cryptographically chained; once an echo is bound, it can be superseded but never silently rewritten. The protocol introduces a deliberate twelve-minute settle window during which any party with read access can flag a bind as suspicious, after which the bind either commits or returns to the drift pool. Echo Bind is what makes the multiverse legible to outsiders. Without it, every manifest would be private folklore.",
    tags: [
      { label: "SETTLE · 12M", color: "primary-fixed" },
      { label: "CHAIN · APPEND", color: "secondary-container" },
      { label: "REV · IMMUTABLE", color: "outline" },
    ],
    reverse: false,
    overlay: "from-secondary-container/35 via-transparent to-primary-fixed/35",
    border: "border-primary-fixed/40",
    shadow: "shadow-[0_0_30px_rgba(0,251,251,0.25)]",
  },
];

const PROTO_NUM_TEXT = {
  "primary-fixed": "text-primary-fixed",
  "secondary-container": "text-secondary-container",
};

const TAG_CLASSES = {
  "primary-fixed": "text-primary-fixed border-primary-fixed/30",
  "secondary-container": "text-secondary-container border-secondary-container/30",
  "outline": "text-outline border-outline/30",
};

const TESTIMONIALS = [
  {
    quote: "\"Mirror Sync changed the geometry of how my partner and I co-write specs. We no longer email diffs back and forth. We sit inside the same room and watch each other's cursor like a second metronome — corrections happen before sentences finish forming. It feels less like collaboration and more like duet singing at a frequency neither of us could reach alone.\"",
    name: "Marisol Quint",
    stamp: "STAMP · T-014 · 02:14 UTC",
    accent: "border-primary-fixed",
  },
  {
    quote: "\"I dropped Phase Drift into our editorial team three months ago and watched the merge-conflict count fall to zero by the second week. It is not a tool for big launches. It is a tool for the quiet weeks between launches when nobody is sure who owns what. The drift pool became our shared subconscious. We started writing better, and we started arguing less, in the same Tuesday.\"",
    name: "Hideo Voss",
    stamp: "STAMP · T-031 · 19:48 UTC",
    accent: "border-secondary-container",
  },
  {
    quote: "\"What I needed was permission to fork without guilt. Echo Bind gave me that. The settle window means I can ship a half-finished manifest and a colleague three hours behind me can still pull it into the trunk before I wake up. The whole team moved closer to the work and farther from the politics. It reads like a piece of poetry as much as it works like a piece of software.\"",
    name: "Anya Klein-Park",
    stamp: "STAMP · T-058 · 06:32 UTC",
    accent: "border-primary-fixed",
  },
];

const FAQS = [
  {
    q: "WHAT IS A \"MANIFEST\"?",
    a: "A manifest is the working surface — part document, part session, part shared room. Each manifest holds a single project's lattice of decisions, plus the ghost-history of every collaborator who ever touched it. Manifests are append-only at the binding layer and freely editable at the drafting layer, which means you can experiment without fear and ship without ambiguity. Most teams start with one manifest per quarter. Mature teams settle into a rhythm of one per active project.",
  },
  {
    q: "ARE THESE TIMELINES REAL?",
    a: "Real enough that the people working inside them treat them as real, which is the only definition that matters here. Each timeline is a coherent presentation of a manifest at a particular phase, viewable from a particular collaborator's seat. They are not predictions and they are not simulations. They are working contexts, and they are what your colleagues see when they open the project at their own desk three timezones away. Treat them as legitimate; they will return the favour.",
  },
  {
    q: "HOW DO I SYNC BETWEEN MANIFESTS?",
    a: "Sync runs on the Mirror protocol by default. Open the second manifest in a side panel, place your cursor where you want the sync handshake to begin, and trigger the bind from the command palette. The system rotates session keys every twelve seconds, so the handshake is essentially instantaneous on local networks and tolerable on transcontinental ones. If you want a softer connection that does not auto-resolve, use Phase Drift instead — drift sessions reconcile structurally and decay after seventy-two hours.",
  },
  {
    q: "WHAT'S THE DIFFERENCE BETWEEN MIRROR AND ECHO?",
    a: "Mirror is for working; Echo is for shipping. Mirror Sync keeps two collaborators inside the same drafting layer with full cursor-presence and clipboard symmetry. Echo Bind is the protocol that takes a finished manifest and stitches it back into the canonical timeline as an immutable revision. You can absolutely use both inside the same hour — most teams do — but the mental model is that you mirror until the work feels done, then you bind. The settle window between bind and commit is twelve minutes.",
  },
  {
    q: "CAN I EXPORT MY MANIFESTS?",
    a: "Yes. Export ships in three flavours: a frozen JSON snapshot of the current binding state, a markdown rendering with every reflection vector inlined, and a zip archive that includes the full keystroke-level history if you have the storage budget for it. The frozen snapshot is portable and re-importable into any compatible runtime. The markdown rendering is for human archives. The zip archive is for forensic replay, which we recommend for any project that ships to regulated environments.",
  },
  {
    q: "IS THIS A GAME?",
    a: "No. The aesthetic borrows from late-nineties operating-system design because that era understood the relationship between play and seriousness in a way modern productivity software has largely forgotten. There is no win condition and there is no scoreboard. There is, however, a sound design pass that runs on every state transition, because we believe that a tool that feels good to use is a tool that gets used. Treat the whole experience as a serious instrument with a sense of humour about being looked at.",
  },
  {
    q: "WHO RUNS MULTIVERSE?",
    a: "A nine-person team distributed across four timezones. We share a public manifest of our own decisions, which we update on the same cadence we expect from our customers. Funding is a mix of customer revenue and a single early-stage cheque from a fund that signed our principles document before the term sheet. We are not for sale and we are not optimising for an exit. The roadmap is set on a quarterly retreat in person, and every collaborator in the company holds a phase-veto over any feature that compromises the principles.",
  },
];

export default function T107Y2kVaporwaveGrid() {
  const navLinks = [
    { label: "CORE", active: true },
    { label: "TECH" },
    { label: "DATA" },
    { label: "PATH" },
  ];
  const sunLines = [1, 2, 3, 4, 6];
  const telemetry = [
    { label: "PACKETS_RX:", value: "99,842,104" },
    { label: "UPTIME_CYCLES:", value: "4.2e9" },
    { label: "CORE_TEMP:", value: "CRITICAL (89°C)", valueClass: "text-error" },
    { label: "VOID_RESONANCE:", value: "104.2 MHz", valueClass: "text-secondary-container" },
  ];
  const bars = [
    { h: "30%", color: "primary-container", glow: "0,251,251,0.5" },
    { h: "70%", color: "primary-container", glow: "0,251,251,0.5" },
    { h: "50%", color: "secondary-container", glow: "254,0,254,0.5" },
    { h: "90%", color: "primary-container", glow: "0,251,251,0.5" },
    { h: "20%", color: "error", glow: "255,180,171,0.5" },
  ];
  const footerLinks = [
    { label: "TERMINAL" },
    { label: "UPLINK", active: true },
    { label: "MIRRORS" },
    { label: "SECURITY" },
  ];
  const customCss = `
    .y2k-bevel {
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      border-left: 1px solid rgba(255, 255, 255, 0.3);
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      border-right: 1px solid rgba(0, 0, 0, 0.5);
    }
    .neumorphic-inset {
      box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.1);
    }
    .neumorphic-outset {
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5), -2px -2px 5px rgba(0, 251, 251, 0.1);
    }
    .scanlines {
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
      background-size: 100% 4px;
    }
    .perspective-grid {
      background-image:
        linear-gradient(rgba(0, 251, 251, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 251, 251, 0.2) 1px, transparent 1px);
      background-size: 40px 40px;
      transform: perspective(500px) rotateX(60deg);
      transform-origin: bottom;
    }
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .vaporwave-aberration {
      mix-blend-mode: color-dodge;
    }
    .vw-faq summary::-webkit-details-marker { display: none; }
    .vw-faq summary { list-style: none; cursor: pointer; }
    .vw-faq summary .vw-glyph { transition: transform 250ms ease; display: inline-block; }
    .vw-faq[open] summary .vw-glyph { transform: rotate(45deg); }
    @media (prefers-reduced-motion: reduce) {
      .vw-faq summary .vw-glyph { transition: none; }
    }
  `;
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Press+Start+2P&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#ffffff", "on-primary": "#003737",
                "primary-container": "#00fbfb", "on-primary-container": "#007070",
                "primary-fixed": "#00fbfb", "primary-fixed-dim": "#00dddd",
                "secondary": "#ffabf3", "secondary-container": "#fe00fe",
                "secondary-fixed-dim": "#ffabf3",
                "tertiary": "#ffffff", "on-tertiary": "#313030",
                "surface": "#0e1419", "on-surface": "#dee3ea", "on-surface-variant": "#b9cac9",
                "surface-container-lowest": "#090f14", "surface-container-low": "#171c21",
                "surface-container": "#1b2025", "surface-container-high": "#252b30",
                "surface-variant": "#30353b", "surface-bright": "#343a3f",
                "surface-dim": "#0e1419",
                "outline": "#839493", "outline-variant": "#3a4a49",
                "background": "#0e1419", "on-background": "#dee3ea",
                "error": "#ffb4ab", "error-container": "#93000a", "on-error": "#690005"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "unit": "4px", "xs": "4px", "sm": "8px", "md": "16px", "lg": "32px", "xl": "64px", "gutter": "24px", "margin": "40px" },
              fontFamily: {
                "body-md": ["Manrope"], "body-lg": ["Manrope"],
                "nav-label": ["Orbitron"], "h1": ["Orbitron"], "h2": ["Orbitron"],
                "accent-pixel": ["Press Start 2P"]
              },
              fontSize: {
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "nav-label": ["12px", { letterSpacing: "0.2em", fontWeight: "500" }],
                "accent-pixel": ["10px", { lineHeight: "1", fontWeight: "400" }],
                "h1": ["48px", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "700" }],
                "h2": ["32px", { lineHeight: "1.3", fontWeight: "600" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark bg-background text-on-background min-h-screen overflow-x-hidden font-body-md selection:bg-primary-container selection:text-on-primary-container relative">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container blur-[150px]" />
        </div>
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-3 max-w-[1920px] mx-auto bg-slate-950/70 backdrop-blur-2xl border-b border-cyan-500/30 border-white/20 shadow-[0_1px_0_0_rgba(0,0,0,0.5)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]">
          <div className="hidden md:flex gap-2 items-center mr-4">
            <div className="w-3 h-3 rounded-none bg-surface-variant border border-outline shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]" />
            <div className="w-3 h-3 rounded-none bg-surface-variant border border-outline shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]" />
            <div className="w-3 h-3 rounded-none bg-surface-variant border border-outline shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] flex items-center justify-center">
              <span className="block w-1.5 h-0.5 bg-on-surface" />
            </div>
          </div>
          <div className="text-2xl font-black italic tracking-tighter text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] mr-auto">VOID_OS</div>
          <div className="hidden md:flex items-center gap-8 font-mono uppercase tracking-[0.2em] text-[10px] md:text-xs">
            {navLinks.map((l) => (
              <a key={l.label} href="#" className={l.active
                ? "text-cyan-300 font-bold border-b-2 border-cyan-400 pb-1"
                : "text-slate-400 hover:text-fuchsia-400 transition-all duration-300 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] px-2 py-1"
              }>{l.label}</a>
            ))}
          </div>
          <button className="ml-8 font-mono uppercase tracking-[0.2em] text-[10px] md:text-xs text-cyan-400 y2k-bevel bg-surface-variant px-4 py-2 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] active:scale-95 active:skew-x-2 transition-transform neumorphic-outset">
            INITIALIZE
          </button>
        </nav>
        <main className="relative z-10 pt-32 pb-24 px-4 md:px-margin max-w-[1920px] mx-auto">
          <section className="relative min-h-[716px] flex flex-col items-center justify-center mb-xl rounded-xl overflow-hidden border border-primary-container/30 y2k-bevel backdrop-blur-[30px] bg-surface/40 p-8">
            <div className="absolute inset-0 z-[-1] overflow-hidden">
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-b from-secondary-container to-surface-container opacity-80 blur-[2px] y2k-bevel">
                <div className="absolute bottom-0 w-full h-1/2 flex flex-col justify-end gap-2 pb-4">
                  {sunLines.map((h, i) => (
                    <div key={i} className={`w-full bg-surface-dim h-${h}`} />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 w-full h-[40%] perspective-grid" />
            </div>
            <div className="absolute top-4 left-4 font-accent-pixel text-accent-pixel text-primary-container tracking-widest opacity-70">
              SYS_BOOT // SEC_01
            </div>
            <h1 className="font-h1 text-h1 text-center text-primary drop-shadow-[0_0_10px_rgba(0,251,251,0.8)] relative z-10 mb-6 group">
              <span className="block relative">
                <span className="absolute -left-[2px] text-secondary-container opacity-70 mix-blend-screen group-hover:translate-x-[-2px] transition-transform">VOID_MANIFESTO</span>
                <span className="absolute -right-[2px] text-primary-container opacity-70 mix-blend-screen group-hover:translate-x-[2px] transition-transform">VOID_MANIFESTO</span>
                <span className="relative">VOID_MANIFESTO</span>
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-center mb-8 relative z-10 bg-surface-container/50 p-4 rounded y2k-bevel backdrop-blur-sm">
              Transcend the digital plane. A collision of raw hardware metatags and ethereal subroutines. Welcome to the final iteration.
            </p>
            <button className="relative z-10 bg-surface-variant y2k-bevel px-8 py-4 font-nav-label text-nav-label text-primary-container neumorphic-outset hover:shadow-[0_0_20px_rgba(0,251,251,0.5)] active:translate-y-[2px] transition-all group overflow-hidden">
              <span className="relative z-10 group-hover:text-tertiary transition-colors">INITIALIZE_SEQUENCE</span>
              <div className="absolute inset-0 bg-primary-container/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-xl relative z-10">
            <div className="bg-surface/60 backdrop-blur-[20px] y2k-bevel p-6 rounded-lg neumorphic-outset flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-primary-container" style={{ fontVariationSettings: "'FILL' 0" }}>memory</span>
              </div>
              <div className="font-accent-pixel text-accent-pixel text-outline mb-4">MOD_01</div>
              <h2 className="font-h2 text-h2 text-tertiary mb-2 text-[20px]">Quantum Compute</h2>
              <div className="bg-surface-container-lowest neumorphic-inset p-4 rounded flex-grow mt-2 border border-outline/20">
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  Neural matrix linking protocol established. Allocating dynamic resources across the void subnet.
                </p>
              </div>
              <div className="mt-4 bg-error-container/20 border border-error/30 y2k-bevel p-1 overflow-hidden">
                <div className="whitespace-nowrap animate-[marquee_10s_linear_infinite] font-accent-pixel text-[8px] text-error">
                  *** SYS_WARNING: UNSTABLE LOAD *** SYS_WARNING: UNSTABLE LOAD ***
                </div>
              </div>
            </div>
            <div className="bg-surface/60 backdrop-blur-[20px] y2k-bevel p-6 rounded-lg neumorphic-outset flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-secondary-container" style={{ fontVariationSettings: "'FILL' 0" }}>waves</span>
              </div>
              <div className="font-accent-pixel text-accent-pixel text-outline mb-4">MOD_02</div>
              <h2 className="font-h2 text-h2 text-tertiary mb-2 text-[20px]">Synth Frequencies</h2>
              <div className="bg-surface-container-lowest neumorphic-inset p-4 rounded flex-grow mt-2 border border-outline/20 flex flex-col gap-2">
                {[75, 45, 90].map((w, i) => (
                  <div key={i} className="h-2 bg-secondary-container/20 rounded-full overflow-hidden y2k-bevel">
                    <div className="h-full bg-secondary-container shadow-[0_0_10px_rgba(254,0,254,0.8)]" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-secondary-container/10 border border-secondary/30 y2k-bevel p-1 overflow-hidden">
                <div className="whitespace-nowrap animate-[marquee_8s_linear_infinite] font-accent-pixel text-[8px] text-secondary">
                  &gt;&gt;&gt; AUDIO_UPLINK_ESTABLISHED &gt;&gt;&gt; AUDIO_UPLINK_ESTABLISHED &gt;&gt;&gt;
                </div>
              </div>
            </div>
            <div className="bg-surface/60 backdrop-blur-[20px] y2k-bevel p-6 rounded-lg neumorphic-outset flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-primary-container" style={{ fontVariationSettings: "'FILL' 0" }}>album</span>
              </div>
              <div className="font-accent-pixel text-accent-pixel text-outline mb-4">MOD_03</div>
              <h2 className="font-h2 text-h2 text-tertiary mb-2 text-[20px]">Data Archives</h2>
              <div className="bg-surface-container-lowest neumorphic-inset p-4 rounded flex-grow mt-2 border border-outline/20 grid grid-cols-2 gap-2">
                <div className="bg-surface-variant y2k-bevel aspect-square flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container opacity-50">folder</span>
                </div>
                <div className="bg-surface-variant y2k-bevel aspect-square flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container opacity-50">description</span>
                </div>
              </div>
              <div className="mt-4 bg-primary-container/10 border border-primary-fixed-dim/30 y2k-bevel p-1 overflow-hidden">
                <div className="whitespace-nowrap animate-[marquee_12s_linear_infinite] font-accent-pixel text-[8px] text-primary-fixed">
                  --- INDEXING_SECTOR_7G --- INDEXING_SECTOR_7G ---
                </div>
              </div>
            </div>
          </section>
          <section className="mb-xl relative z-10">
            <div className="bg-surface-variant rounded-t-lg y2k-bevel flex justify-between items-center px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-sm">terminal</span>
                <span className="font-nav-label text-nav-label text-tertiary tracking-normal">Multiverse_Statistics.exe</span>
              </div>
              <div className="flex gap-1">
                <button className="w-5 h-5 bg-surface y2k-bevel flex items-center justify-center text-xs pb-1 hover:bg-surface-bright active:scale-95">_</button>
                <button className="w-5 h-5 bg-surface y2k-bevel flex items-center justify-center text-xs pb-1 hover:bg-surface-bright active:scale-95">□</button>
                <button className="w-5 h-5 bg-surface y2k-bevel flex items-center justify-center text-xs hover:bg-error hover:text-on-error active:scale-95">x</button>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 y2k-bevel rounded-b-lg border-t-0 neumorphic-inset relative overflow-hidden min-h-[300px] flex flex-col md:flex-row gap-8 items-center">
              <div className="absolute inset-0 scanlines pointer-events-none opacity-50" />
              <div className="flex-1 font-mono text-sm text-primary-container w-full z-10 h-full">
                <div className="mb-2 text-secondary">&gt; INITIATING QUERY...</div>
                <div className="mb-2">&gt; CONNECTING TO NODE 0x8F9A... [OK]</div>
                <div className="mb-4">&gt; FETCHING TELEMETRY...</div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  {telemetry.map((t) => (
                    <React.Fragment key={t.label}>
                      <div className="text-outline">{t.label}</div>
                      <div className={t.valueClass}>{t.value}</div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-4 animate-pulse">&gt; _</div>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-surface-container y2k-bevel relative z-10 flex items-end justify-between p-4 gap-2">
                {bars.map((b, i) => (
                  <div key={i} className={`w-full bg-${b.color}/20 y2k-bevel relative`} style={{ height: b.h }}>
                    <div className={`absolute bottom-0 w-full bg-${b.color} h-full shadow-[0_0_10px_rgba(${b.glow})]`} />
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Section 4: Worlds — Static Image Strip */}
          <section className="mb-xl relative z-10">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <div className="font-accent-pixel text-accent-pixel text-secondary-container mb-2 tracking-widest">SEC_04 // WORLDS</div>
                <h2 className="font-h1 text-[36px] md:text-[44px] leading-[1.1] tracking-[0.08em] text-primary drop-shadow-[0_0_10px_rgba(0,251,251,0.6)]">8 SIMULTANEOUS TIMELINES</h2>
              </div>
              <div className="font-accent-pixel text-[8px] text-outline tracking-widest border border-outline/40 y2k-bevel bg-surface-variant/40 px-3 py-2">STATIC_GRID · NO_LOOP</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {WORLD_TILES.map((t) => (
                <div key={t.id} className="relative aspect-square overflow-hidden y2k-bevel border border-primary-fixed/40 bg-surface-container shadow-[0_0_24px_rgba(254,0,254,0.25)]">
                  <img alt={t.alt} className="absolute inset-0 w-full h-full object-cover opacity-90" src={t.img} />
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/40 via-transparent to-primary-fixed/40 vaporwave-aberration pointer-events-none" />
                  <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
                  <div className="absolute top-2 left-2 font-h1 text-[12px] tracking-widest text-primary-container drop-shadow-[0_0_6px_rgba(0,251,251,0.9)]">{t.id}</div>
                  <div className="absolute bottom-2 left-2 right-2 font-accent-pixel text-[7px] text-primary leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{t.caption}</div>
                </div>
              ))}
            </div>
          </section>
          {/* Section 5: Manifest #001 — Sticky-photo + scrolling text */}
          <section className="mb-xl relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 md:sticky md:top-32 md:self-start flex flex-col gap-4">
              <div className="relative aspect-[3/4] overflow-hidden y2k-bevel border border-secondary-container/40 bg-surface-container shadow-[0_0_40px_rgba(254,0,254,0.3)]">
                <img alt="Brutalist concrete facade" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/35 via-transparent to-primary-fixed/35 vaporwave-aberration pointer-events-none" />
                <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
                <div className="absolute top-3 left-3 font-accent-pixel text-accent-pixel text-primary-container tracking-widest bg-surface/60 px-2 py-1 y2k-bevel">MANIFEST_001</div>
                <div className="absolute bottom-3 right-3 font-accent-pixel text-[7px] text-secondary-fixed tracking-widest bg-surface/60 px-2 py-1 y2k-bevel">PLATE · I</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-accent-pixel text-[8px] text-outline tracking-widest border border-outline/30 y2k-bevel bg-surface-variant/40 px-2 py-2 text-center">VECTOR · 0xA1</div>
                <div className="font-accent-pixel text-[8px] text-secondary-container tracking-widest border border-secondary-container/30 y2k-bevel bg-surface-variant/40 px-2 py-2 text-center">PHASE · 014</div>
                <div className="font-accent-pixel text-[8px] text-primary-fixed tracking-widest border border-primary-fixed/30 y2k-bevel bg-surface-variant/40 px-2 py-2 text-center">DRIFT · 04</div>
              </div>
              <div className="relative aspect-video overflow-hidden y2k-bevel border border-primary-fixed/40 bg-surface-container shadow-[0_0_30px_rgba(0,251,251,0.25)]">
                <img alt="Architectural detail" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-fixed/40 via-transparent to-secondary-container/35 vaporwave-aberration pointer-events-none" />
                <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
                <div className="absolute top-2 left-2 font-accent-pixel text-[7px] text-primary tracking-widest bg-surface/60 px-2 py-1 y2k-bevel">PLATE · II</div>
                <div className="absolute bottom-2 right-2 font-accent-pixel text-[7px] text-secondary-fixed tracking-widest bg-surface/60 px-2 py-1 y2k-bevel">SUB-PHASE · 014.b</div>
              </div>
              <div className="bg-surface-container/60 backdrop-blur-sm y2k-bevel neumorphic-inset border border-primary-fixed/20 p-4">
                <div className="font-accent-pixel text-[8px] text-secondary-container tracking-widest mb-3">SIGNAL · TELEMETRY</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-primary-fixed/20 y2k-bevel bg-surface-container-lowest/60 px-2 py-2">
                    <div className="font-accent-pixel text-[7px] text-outline tracking-widest mb-1">CONTRIB</div>
                    <div className="font-h1 text-[20px] text-primary-fixed drop-shadow-[0_0_6px_rgba(0,251,251,0.6)] tracking-widest">07</div>
                  </div>
                  <div className="border border-secondary-container/20 y2k-bevel bg-surface-container-lowest/60 px-2 py-2">
                    <div className="font-accent-pixel text-[7px] text-outline tracking-widest mb-1">FORKS</div>
                    <div className="font-h1 text-[20px] text-secondary-container drop-shadow-[0_0_6px_rgba(254,0,254,0.6)] tracking-widest">23</div>
                  </div>
                  <div className="border border-secondary-container/20 y2k-bevel bg-surface-container-lowest/60 px-2 py-2">
                    <div className="font-accent-pixel text-[7px] text-outline tracking-widest mb-1">BINDINGS</div>
                    <div className="font-h1 text-[20px] text-secondary-container drop-shadow-[0_0_6px_rgba(254,0,254,0.6)] tracking-widest">112</div>
                  </div>
                  <div className="border border-primary-fixed/20 y2k-bevel bg-surface-container-lowest/60 px-2 py-2">
                    <div className="font-accent-pixel text-[7px] text-outline tracking-widest mb-1">UPTIME</div>
                    <div className="font-h1 text-[20px] text-primary-fixed drop-shadow-[0_0_6px_rgba(0,251,251,0.6)] tracking-widest">04Q</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-primary-fixed/20 font-accent-pixel text-[7px] text-outline tracking-widest text-center">LAST_BIND · T-014 · 02:14 UTC</div>
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-8">
              <div className="font-accent-pixel text-accent-pixel text-secondary-container tracking-widest mb-2">SEC_05 // WHY WE BELIEVE IN WORLDS</div>
              <h2 className="font-h1 text-[36px] md:text-[44px] leading-[1.1] tracking-[0.08em] text-primary drop-shadow-[0_0_10px_rgba(0,251,251,0.6)]">MANIFEST #001</h2>
              <div className="space-y-6">
                {MANIFESTO_BLOCKS.map((b) => (
                  <article key={b.title} className={`bg-surface-container/50 backdrop-blur-sm y2k-bevel neumorphic-outset p-6 border ${MANIFESTO_BORDERS[b.color]}`}>
                    <div className={`font-h1 text-[22px] md:text-[26px] tracking-[0.12em] mb-3 ${MANIFESTO_TEXT[b.color]} ${MANIFESTO_GLOW[b.color]}`}>{b.title}</div>
                    <p className="font-body-md text-body-md text-on-surface-variant">{b.body}</p>
                  </article>
                ))}
                <div className="relative aspect-[5/1] overflow-hidden y2k-bevel border border-secondary-container/40 bg-surface-container shadow-[0_0_30px_rgba(254,0,254,0.25)]">
                  <img alt="Closing transmission" className="absolute inset-0 w-full h-full object-cover object-[center_30%]" src="https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=1600&q=85&auto=format&fit=crop" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-fixed/35 via-transparent to-secondary-container/40 vaporwave-aberration pointer-events-none" />
                  <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface/85 via-surface/30 to-surface/50 pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-between px-5 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="font-accent-pixel text-accent-pixel text-primary-container tracking-widest">CLOSING_TRANSMISSION</div>
                      <div className="font-h1 text-[18px] md:text-[22px] tracking-[0.1em] text-primary drop-shadow-[0_0_6px_rgba(0,251,251,0.6)]">END_OF_MANIFEST</div>
                    </div>
                    <div className="font-accent-pixel text-[7px] text-secondary-fixed tracking-widest bg-surface/60 px-2 py-1 y2k-bevel shrink-0">PLATE · III</div>
                  </div>
                </div>
                <div className="bg-surface-container/60 backdrop-blur-sm y2k-bevel neumorphic-inset border border-secondary-container/20 p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <div className="font-accent-pixel text-accent-pixel text-primary-container tracking-widest">REFLECTION · VECTOR</div>
                    <div className="font-accent-pixel text-[7px] text-outline tracking-widest border border-outline/30 y2k-bevel bg-surface-variant/40 px-2 py-1">BOUND · T-014 · 02:14 UTC</div>
                  </div>
                  <blockquote className="font-h1 italic text-[15px] md:text-[16px] leading-[1.6] text-on-surface tracking-[0.02em] border-l-2 border-secondary-container/60 pl-4">"The manifest does not conclude — it commits, settles, and waits. Five years from now you will read it and recognise yourself in the version you shipped, and the timeline will contract back into a single line."</blockquote>
                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-secondary-container/20">
                    <div className="font-accent-pixel text-[8px] text-primary-fixed tracking-widest border border-primary-fixed/30 y2k-bevel bg-surface-variant/40 px-2 py-2 text-center">SIGNED · 0xE7</div>
                    <div className="font-accent-pixel text-[8px] text-secondary-container tracking-widest border border-secondary-container/30 y2k-bevel bg-surface-variant/40 px-2 py-2 text-center">RES · IMMUTABLE</div>
                    <div className="font-accent-pixel text-[8px] text-outline tracking-widest border border-outline/30 y2k-bevel bg-surface-variant/40 px-2 py-2 text-center">REV · 0.06.x</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Section 6: The Grid · 6 Protocols — Alternating rows */}
          <section className="mb-xl relative z-10">
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <div>
                <div className="font-accent-pixel text-accent-pixel text-secondary-container mb-2 tracking-widest">SEC_06 // THE GRID</div>
                <h2 className="font-h1 text-[36px] md:text-[44px] leading-[1.1] tracking-[0.08em] text-primary drop-shadow-[0_0_10px_rgba(0,251,251,0.6)]">6 PROTOCOLS</h2>
              </div>
              <div className="font-accent-pixel text-[8px] text-outline tracking-widest border border-outline/40 y2k-bevel bg-surface-variant/40 px-3 py-2">REV · 0.06.x</div>
            </div>
            <div className="flex flex-col gap-12">
              {PROTOCOLS.map((p) => (
                <div key={p.numeral} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className={`md:col-span-6 ${p.reverse ? "md:order-2" : ""} relative aspect-[4/3] overflow-hidden y2k-bevel border ${p.border} bg-surface-container ${p.shadow}`}>
                    <img alt={p.alt} className="absolute inset-0 w-full h-full object-cover" src={p.img} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.overlay} vaporwave-aberration pointer-events-none`} />
                    <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
                    <div className="absolute top-3 left-3 font-accent-pixel text-[8px] text-primary tracking-widest bg-surface/60 px-2 py-1 y2k-bevel">{p.code}</div>
                  </div>
                  <div className={`md:col-span-6 ${p.reverse ? "md:order-1" : ""} flex flex-col gap-3`}>
                    <div className={`font-accent-pixel text-accent-pixel ${PROTO_NUM_TEXT[p.accent]} tracking-widest`}>PROTOCOL · {p.numeral}</div>
                    <h3 className="font-h1 text-[28px] md:text-[32px] leading-[1.15] tracking-[0.08em] text-primary">{p.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{p.body}</p>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {p.tags.map((tg) => (
                        <span key={tg.label} className={`font-accent-pixel text-[7px] tracking-widest border y2k-bevel bg-surface-variant/40 px-2 py-1 ${TAG_CLASSES[tg.color]}`}>{tg.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Section 7: Field Reports — Half-full-bleed */}
          <section className="mb-xl relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch overflow-hidden">
            <div className="md:col-span-6 flex flex-col gap-5 justify-center bg-surface-container-low/70 y2k-bevel border border-secondary-container/30 neumorphic-outset p-6 md:p-8">
              <div className="font-accent-pixel text-accent-pixel text-secondary-container tracking-widest">SEC_07 // FIELD_REPORTS</div>
              <h2 className="font-h1 text-[32px] md:text-[40px] leading-[1.1] tracking-[0.08em] text-primary drop-shadow-[0_0_10px_rgba(0,251,251,0.6)]">VOICES FROM THE BRANCHES</h2>
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className={`bg-surface-container/60 y2k-bevel neumorphic-inset p-5 border-l-4 ${t.accent}`}>
                  <blockquote className="font-h1 italic text-[15px] md:text-[16px] leading-[1.6] text-on-surface tracking-[0.02em]">{t.quote}</blockquote>
                  <figcaption className="mt-3 flex items-center justify-between flex-wrap gap-2">
                    <span className="font-body-md text-[14px] font-semibold text-primary">{t.name}</span>
                    <span className="font-accent-pixel text-[8px] text-secondary-fixed tracking-widest">{t.stamp}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="md:col-span-6 relative min-h-[420px] md:min-h-full md:mr-[calc(50%-50vw)] overflow-hidden y2k-bevel border border-primary-fixed/40 shadow-[0_0_40px_rgba(254,0,254,0.25)]">
              <img alt="Editorial portrait" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=85&auto=format&fit=crop" />
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/40 via-transparent to-primary-fixed/40 vaporwave-aberration pointer-events-none" />
              <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-surface/40 pointer-events-none" />
              <div className="absolute top-4 right-4 font-accent-pixel text-accent-pixel text-primary tracking-widest bg-surface/60 px-2 py-1 y2k-bevel">PORTRAIT · 0x7F</div>
              <div className="absolute bottom-4 left-4 font-accent-pixel text-[8px] text-secondary-fixed tracking-widest bg-surface/60 px-2 py-1 y2k-bevel">ARCHIVE · FIELD/QUINT-VOSS-PARK</div>
            </div>
          </section>
          {/* Section 8: FAQ accordion */}
          <section className="mb-xl relative z-10">
            <div className="bg-surface-container y2k-bevel neumorphic-outset border border-primary-fixed/20 p-6 md:p-10">
              <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
                <div>
                  <div className="font-accent-pixel text-accent-pixel text-secondary-container mb-2 tracking-widest">SEC_08 // FAQ</div>
                  <h2 className="font-h1 text-[32px] md:text-[40px] leading-[1.1] tracking-[0.08em] text-primary drop-shadow-[0_0_10px_rgba(0,251,251,0.6)]">FREQUENTLY ASKED QUERIES</h2>
                </div>
                <div className="font-accent-pixel text-[8px] text-outline tracking-widest border border-outline/40 y2k-bevel bg-surface-variant/40 px-3 py-2">7 · ENTRIES</div>
              </div>
              <div className="divide-y divide-primary-fixed/20 border-t border-b border-primary-fixed/20">
                {FAQS.map((f) => (
                  <details key={f.q} className="vw-faq group p-5">
                    <summary className="flex items-center justify-between gap-4">
                      <h3 className="font-h1 text-[16px] md:text-[18px] tracking-[0.08em] text-primary">{f.q}</h3>
                      <span className="vw-glyph font-h1 text-[24px] text-secondary-container drop-shadow-[0_0_6px_rgba(254,0,254,0.6)]">+</span>
                    </summary>
                    <p className="mt-4 font-body-md text-body-md text-on-surface-variant">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full py-10 px-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-950/90 backdrop-blur-3xl border-t border-cyan-900/50 border-cyan-500/20 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] relative z-50">
          <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
          <div className="relative z-10 flex flex-col items-center md:items-start gap-4">
            <div className="text-lg font-bold text-cyan-400/50">VOID_OS</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
              © 20XX NEURAL_VOID_DYNAMICS. ALL_SYSTEMS_GO.
            </div>
            <div className="flex gap-2 mt-2">
              <div className="border border-outline bg-surface-variant px-2 py-1 flex items-center gap-1 font-accent-pixel text-[6px] text-tertiary y2k-bevel">
                <span className="w-2 h-2 bg-primary-container inline-block rounded-full" /> BEST VIEWED IN TERMINAL
              </div>
              <div className="border border-outline bg-surface-variant px-2 py-1 flex items-center gap-1 font-accent-pixel text-[6px] text-tertiary y2k-bevel">
                100% GLITCH FREE
              </div>
            </div>
          </div>
          <div className="relative z-10 flex gap-6 font-mono text-[9px] uppercase tracking-widest text-slate-500">
            {footerLinks.map((l) => (
              <a key={l.label} href="#" className={l.active
                ? "text-cyan-400 hover:translate-y-[-2px] transition-transform duration-500"
                : "text-slate-600 hover:text-fuchsia-500 hover:translate-y-[-2px] transition-transform duration-500"
              }>{l.label}</a>
            ))}
          </div>
          <div className="relative z-10 flex items-center gap-2 bg-surface-container-lowest border border-primary-container/30 px-3 py-2 y2k-bevel">
            <span className="text-secondary-container font-mono text-xs">&gt;</span>
            <input type="text" placeholder="ENTER_UPLINK_CODE" className="bg-transparent border-none text-primary-container font-mono text-xs focus:ring-0 p-0 w-32 placeholder-outline/50 outline-none" />
            <div className="w-2 h-3 bg-primary-container animate-pulse" />
          </div>
        </footer>
      </div>
    </>
  );
}
