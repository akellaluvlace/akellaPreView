export default function T50CyberpunkHighTech() {
  const navLinks = [
    { href: "#services", label: "SERVICES" },
    { href: "#pricing", label: "CLEARANCE" },
    { href: "#logs", label: "LOGS" },
    { href: "#contact", label: "UPLINK" },
  ];

  const mobileNavLinks = [
    { href: "#services", label: "01 // SERVICES" },
    { href: "#pricing", label: "02 // CLEARANCE" },
    { href: "#logs", label: "03 // LOGS" },
    { href: "#contact", label: "04 // UPLINK" },
  ];

  const stats = [
    { target: "99.9", initial: "0%", label: "UPTIME_GUARANTEE", color: "text-cyan" },
    { target: "8420", initial: "0", label: "THREATS_NEUTRALIZED", color: "text-magenta" },
    { target: "156", initial: "0", label: "ACTIVE_NODES", color: "text-cyan" },
    { target: null, initial: "0ms", label: "LATENCY", color: "text-magenta" },
  ];

  const services = [
    { icon: "shield-alert", color: "cyan", title: "NEURAL FIREWALL", desc: "AI-driven traffic filtering that adapts to polymorphic threats in real-time." },
    { icon: "lock", color: "magenta", title: "QUANTUM ENCRYPTION", desc: "256-bit entropy keys generated via atmospheric noise for unbreakable data seals." },
    { icon: "scan-eye", color: "cyan", title: "IDENTITY MASKING", desc: "Complete digital footprint erasure and phantom node generation." },
  ];

  const tiers = [
    { tag: "TIER_1 // GHOST", tagColor: "text-gray-400", price: "500", outerBg: "bg-gray-600", padThickness: "p-[1px]", features: ["Basic Firewall", "Daily Scans", "Email Encryption"], iconColor: "text-gray-500", btn: "border border-gray-600 text-gray-300 hover:bg-gray-800", btnText: "SELECT_TIER", glow: "" },
    { tag: "TIER_2 // PHANTOM", tagColor: "text-cyan", price: "1200", outerBg: "bg-cyan", padThickness: "p-[2px]", features: ["Neural AI Defense", "Real-time Monitoring", "Identity Masking", "24/7 Support Uplink"], iconColor: "text-cyan", btn: "bg-cyan text-black font-bold hover:bg-white btn-glitch", btnText: "ACQUIRE_ACCESS", glow: "transform md:-translate-y-4 shadow-[0_0_20px_rgba(0,255,255,0.1)]", popular: true, priceClass: "glow-cyan", textClass: "text-white" },
    { tag: "TIER_3 // GOD_MODE", tagColor: "text-magenta", price: "2500", outerBg: "bg-magenta/60", padThickness: "p-[1px]", features: ["Zero-Trust Architecture", "Dedicated Netrunner Team", "Offensive Counter-Strikes", "Quantum Key Dist."], iconColor: "text-magenta", btn: "border border-magenta text-magenta hover:bg-magenta hover:text-white", btnText: "CONTACT_SALES", glow: "" },
  ];

  const logs = [
    { from: "CORP_ARASAKA_PROXY", time: "03:42", body: '"NET_RUNNER neutralized a localized DDoS swarm in under 14 seconds. Efficiency within acceptable parameters. Contract renewed."', status: "[STATUS: VERIFIED]", border: "border-green-500", statusColor: "text-green-500" },
    { from: "USER_X7", time: "09:15", body: '"They didn\'t just stop the breach; they traced the signal back to the source. My data is ghosted now. Invisible."', status: "[STATUS: ENCRYPTED]", border: "border-magenta", statusColor: "text-magenta" },
  ];

  const dossiers = [
    { id: "DOSSIER_007", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", color: "cyan", colorRgb: "0,255,255", offColor: "magenta", classification: "OFFENSIVE", title: "OP: BLACKOUT_VEIL", body: "Counter-strike on a polymorphic ransomware swarm. Trace-back successful in 11 seconds; payload neutralized at source node.", date: "2077.03.14", outcome: "[OUTCOME: NEUTRALIZED]", offset: "" },
    { id: "DOSSIER_014", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", color: "magenta", colorRgb: "255,0,255", offColor: "cyan", classification: "DEFENSIVE", title: "OP: GHOST_PROTOCOL", body: "Identity-erasure for a high-value asset under nation-state surveillance. Full digital exfiltration; phantom node persistence achieved.", date: "2076.11.02", outcome: "[OUTCOME: PHANTOM]", offset: "md:translate-y-6" },
    { id: "DOSSIER_021", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", color: "cyan", colorRgb: "0,255,255", offColor: "magenta", classification: "INFILTRATION", title: "OP: VOID_CIPHER", body: "Penetration test of a corporate ICE-stack. Twelve zero-days harvested; full mainframe access obtained without leaving an artifact.", date: "2076.07.28", outcome: "[OUTCOME: SILENT]", offset: "" },
  ];

  const streamCyan = [
    { label: "NODE_TKY_42", meta: "PING_OK · 03:42:17", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80&auto=format&fit=crop" },
    { label: "RELAY_NRT_07", meta: "SYNC_OK · 03:43:01", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80&auto=format&fit=crop" },
    { label: "UPLINK_OSAKA_19", meta: "TX_GHOST · 03:43:48", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=200&q=80&auto=format&fit=crop" },
    { label: "NODE_HKG_91", meta: "TRACE_LOST · 03:44:22", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80&auto=format&fit=crop" },
    { label: "SECTOR_7G_MAIN", meta: "SCAN_CLR · 03:44:55", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80&auto=format&fit=crop" },
    { label: "NODE_SEA_03", meta: "HEARTBEAT · 03:45:11", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80&auto=format&fit=crop" },
  ];
  const streamMagenta = [
    { label: "ICE_NETWATCH", meta: "BREACH_WALL · 03:45:48", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80&auto=format&fit=crop" },
    { label: "RELAY_BNK_44", meta: "ENCR_KEY · 03:46:14", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80&auto=format&fit=crop" },
    { label: "NODE_BERLIN_21", meta: "GHOSTED · 03:46:45", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=200&q=80&auto=format&fit=crop" },
    { label: "UPLINK_OSL_06", meta: "SHADOW_WALK · 03:47:02", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80&auto=format&fit=crop" },
    { label: "NODE_DUB_18", meta: "REROUTE · 03:47:28", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80&auto=format&fit=crop" },
    { label: "SECTOR_DELTA-9", meta: "VOID_ENTRY · 03:48:01", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=200&q=80&auto=format&fit=crop" },
  ];

  const ghostGrid = [
    { span: "md:col-span-7 aspect-[16/9]", color: "cyan", colorRgb: "0,255,255", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=85&auto=format&fit=crop", chip: "CHANNEL_07 // PRIMARY", title: "Sector 7G — Mainframe", status: "[ACTIVE]", titleSize: "text-xs" },
    { span: "md:col-span-5 aspect-[16/9]", color: "magenta", colorRgb: "255,0,255", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1100&q=85&auto=format&fit=crop", chip: "CHANNEL_12 // RELAY", title: "Node Δ-22 — Encrypted", status: "[GHOSTED]", titleSize: "text-xs" },
    { span: "md:col-span-4 aspect-[4/3]", color: "cyan", colorRgb: "0,255,255", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", chip: "CH_02", title: "CIRCUIT_TRACE", status: "SCAN", small: true },
    { span: "md:col-span-4 aspect-[4/3]", color: "magenta", colorRgb: "255,0,255", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", chip: "CH_15", title: "NODE_DELTA", status: "RELAY", small: true },
    { span: "md:col-span-4 aspect-[4/3]", color: "cyan", colorRgb: "0,255,255", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", chip: "CH_28", title: "SECTOR_7G", status: "MAIN", small: true },
  ];

  const coreOps = [
    { hex: "0x01", roman: "I", icon: "radar", color: "cyan", colorRgb: "0,255,255", title: "PASSIVE_RECON", body: "Continuous trace-monitoring across all uplink channels. Anomaly thresholds set at 2σ.", phase: "α", status: "→ ACTIVE" },
    { hex: "0x02", roman: "II", icon: "key-round", color: "magenta", colorRgb: "255,0,255", title: "KEY_ROTATION", body: "Quantum-derived entropy refreshes session keys every 90 seconds. Replay attacks neutralized.", phase: "β", status: "→ NOMINAL" },
    { hex: "0x03", roman: "III", icon: "zap", color: "cyan", colorRgb: "0,255,255", title: "COUNTER_STRIKE", body: "Reactive payload deployment. Trace-back and de-escalate inside the hostile timeframe.", phase: "γ", status: "→ ARMED" },
    { hex: "0x04", roman: "IV", icon: "ghost", color: "magenta", colorRgb: "255,0,255", title: "PHANTOM_FORK", body: "Distributed identity scattering. The asset is everywhere and nowhere; trace lost in noise floor.", phase: "δ", status: "→ STEALTH" },
  ];

  const trustLogos = [
    { slug: "vercel", label: "Vercel" },
    { slug: "cloudflare", label: "Cloudflare" },
    { slug: "github", label: "GitHub" },
    { slug: "docker", label: "Docker" },
    { slug: "kubernetes", label: "Kubernetes" },
    { slug: "nodedotjs", label: "Node.js" },
    { slug: "bun", label: "Bun" },
    { slug: "typescript", label: "TypeScript" },
  ];

  const termCyanLines = [
    { d: "0s",   dot: "cyan",    text: "NODE_07 :: SYNC_OK",    tag: "[OK]",  tagColor: "text-green-400" },
    { d: "0.3s", dot: "magenta", text: "PKT 0xA1 :: SENT",      tag: "[OK]",  tagColor: "text-green-400" },
    { d: "0.6s", dot: "cyan",    text: "HANDSHAKE :: ECHO 22ms", tag: "",     tagColor: "" },
    { d: "0.9s", dot: "cyan",    text: "PKT 0xA2 :: SENT",      tag: "[OK]",  tagColor: "text-green-400" },
    { d: "1.2s", dot: "magenta", text: "KEY_ROTATE :: NEW",     tag: "[OK]",  tagColor: "text-green-400" },
    { d: "1.5s", dot: "cyan",    text: "PKT 0xA3 :: SENT",      tag: "[OK]",  tagColor: "text-green-400" },
    { d: "1.8s", dot: "cyan",    text: "HEARTBEAT :: 18ms",     tag: "",      tagColor: "" },
    { d: "2.1s", dot: "magenta", text: "RELAY_NRT_07 :: BOUND", tag: "",      tagColor: "" },
    { d: "2.4s", dot: "cyan",    text: "PIPE :: STABLE",        tag: "",      tagColor: "" },
  ];
  const termMagentaLines = [
    { d: "0s",   dot: "magenta", text: "SCAN :: SECTOR_7G",     tag: "[WARN]", tagColor: "text-yellow-400" },
    { d: "0.3s", dot: "magenta", text: "ICE_PROBE :: 0xC4 traced", tag: "",   tagColor: "" },
    { d: "0.6s", dot: "cyan",    text: "COUNTER :: ARMED",      tag: "[OK]",  tagColor: "text-green-400" },
    { d: "0.9s", dot: "magenta", text: "PKT 0xC5 :: BLOCKED",   tag: "[OK]",  tagColor: "text-green-400" },
    { d: "1.2s", dot: "magenta", text: "SOURCE :: ASN 5xxxx",   tag: "",      tagColor: "" },
    { d: "1.5s", dot: "magenta", text: "NEUTRALIZE :: 11s",     tag: "[OK]",  tagColor: "text-green-400" },
    { d: "1.8s", dot: "cyan",    text: "ARTIFACT :: NONE",      tag: "",      tagColor: "" },
    { d: "2.1s", dot: "magenta", text: "LOG :: SEALED 0xFE",    tag: "",      tagColor: "" },
    { d: "2.4s", dot: "magenta", text: "RING :: GHOSTED",       tag: "",      tagColor: "" },
  ];

  const dotColorClass = (c) => (c === "cyan" ? "text-cyan" : "text-magenta");

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    colors: {
      bg: '#050505', text: '#E0E0E0', cyan: '#00FFFF', magenta: '#FF00FF',
      dark: '#0a0a0a', dim: '#1a1a1a'
    },
    fontFamily: {
      orbitron: ['Orbitron', 'sans-serif'],
      rajdhani: ['Rajdhani', 'sans-serif'],
      mono: ['Share Tech Mono', 'monospace'],
    },
    backgroundImage: {
      'cyber-grid': 'linear-gradient(transparent 95%, rgba(0, 255, 255, 0.05) 95%), linear-gradient(90deg, transparent 95%, rgba(0, 255, 255, 0.05) 95%)',
    }
  } }
};`;

  const customCss = `body { background-color: #050505; color: #E0E0E0; overflow-x: hidden; scroll-behavior: smooth; }
.scanlines {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
  background-size: 100% 4px; z-index: 9999; pointer-events: none;
  animation: scanlineScroll 0.5s linear infinite; opacity: 0.15;
}
@keyframes scanlineScroll { 0% { transform: translateY(0); } 100% { transform: translateY(4px); } }
.glow-cyan { text-shadow: 0 0 10px rgba(0, 255, 255, 0.7); }
.glow-magenta { text-shadow: 0 0 10px rgba(255, 0, 255, 0.7); }
.border-glow-cyan { box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); }
.cyber-shape { clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%); }
.cyber-card { clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%); }
.cyber-input { clip-path: polygon(0 0, 100% 0, 100% 80%, 98% 100%, 0 100%); }
.cyber-tier { clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 14px) 100%, 0 100%, 0 18px); }
.glitch-wrapper { position: relative; }
.glitch { position: relative; color: #E0E0E0; }
.glitch::before, .glitch::after {
  content: attr(data-text); position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}
.glitch::before {
  left: 2px; text-shadow: -1px 0 #FF00FF;
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}
.glitch::after {
  left: -2px; text-shadow: -1px 0 #00FFFF;
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-anim 2.5s infinite linear alternate-reverse;
}
@keyframes glitch-anim {
  0% { clip: rect(10px, 9999px, 30px, 0); } 20% { clip: rect(80px, 9999px, 100px, 0); }
  40% { clip: rect(10px, 9999px, 50px, 0); } 60% { clip: rect(60px, 9999px, 70px, 0); }
  80% { clip: rect(20px, 9999px, 90px, 0); } 100% { clip: rect(50px, 9999px, 30px, 0); }
}
@keyframes glitch-anim-2 {
  0% { clip: rect(60px, 9999px, 80px, 0); } 20% { clip: rect(10px, 9999px, 30px, 0); }
  40% { clip: rect(90px, 9999px, 100px, 0); } 60% { clip: rect(30px, 9999px, 40px, 0); }
  80% { clip: rect(50px, 9999px, 60px, 0); } 100% { clip: rect(20px, 9999px, 80px, 0); }
}
.cursor { display: inline-block; width: 10px; background-color: #00FFFF; animation: blink 1s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.btn-glitch:hover {
  animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  background-color: #00FFFF; color: #000;
}
@keyframes glitch-skew {
  0% { transform: skew(0deg); } 20% { transform: skew(-10deg); }
  40% { transform: skew(10deg); } 60% { transform: skew(-5deg); }
  80% { transform: skew(5deg); } 100% { transform: skew(0deg); }
}
#mobile-menu { transition: transform 0.3s ease-in-out; transform: translateX(100%); }
#mobile-menu.active { transform: translateX(0); }
.marquee-track { display: flex; gap: 24px; width: max-content; }
@keyframes marquee-cyan { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
@keyframes marquee-magenta { 0% { transform: translateX(calc(-50% - 12px)); } 100% { transform: translateX(0); } }
.marquee-cyan { animation: marquee-cyan 60s linear infinite; }
.marquee-magenta { animation: marquee-magenta 75s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
.cyber-trust-logo { filter: grayscale(1) brightness(1.4) contrast(0.9); opacity: 0.55; transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease; }
.cyber-trust-logo:hover { filter: grayscale(0) drop-shadow(0 0 6px rgba(0,255,255,0.55)); opacity: 1; transform: translateY(-2px); }
@keyframes cyber-term-reveal {
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0); }
}
.cyber-term-line {
  opacity: 0;
  animation: cyber-term-reveal 0.4s cubic-bezier(0.2,0.8,0.2,1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes cyber-blink { 50% { opacity: 0; } }
.cyber-cursor { animation: cyber-blink 1.05s steps(2) infinite; }
@keyframes cyber-scrub {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.cyber-scrub-bar { animation: cyber-scrub 3s cubic-bezier(0.4,0,0.6,1) infinite; }
@media (prefers-reduced-motion: reduce) {
  .cyber-term-line, .cyber-cursor, .cyber-scrub-bar { animation: none; opacity: 1; transform: none; }
}`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    var menuBtn = document.getElementById('menu-btn');
    var closeBtn = document.getElementById('close-menu');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function(){ mobileMenu.classList.toggle('active'); });
      if (closeBtn) closeBtn.addEventListener('click', function(){ mobileMenu.classList.toggle('active'); });
      mobileMenu.querySelectorAll('a').forEach(function(l){ l.addEventListener('click', function(){ mobileMenu.classList.remove('active'); }); });
    }
    var counters = document.querySelectorAll('.counter');
    var animate = function(){
      counters.forEach(function(c){
        var target = +c.getAttribute('data-target');
        var hasPercent = c.getAttribute('data-target').indexOf('.') !== -1;
        var update = function(){
          var count = +c.innerText.replace('%', '');
          var inc = target / 200;
          if (count < target) {
            c.innerText = Math.ceil(count + inc) + (hasPercent ? '%' : '');
            setTimeout(update, 20);
          } else {
            c.innerText = target + (hasPercent ? '%' : '');
          }
        };
        update();
      });
    };
    var first = document.querySelector('.counter');
    if (first && 'IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting) { animate(); obs.unobserve(e.target); } });
      });
      obs.observe(first);
    }
    return;
  }
  setTimeout(init, 50);
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="font-rajdhani selection:bg-cyan selection:text-black bg-bg text-text">
        <div className="scanlines"></div>
        <div className="fixed inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-20 -z-50 pointer-events-none"></div>

        <nav className="fixed w-full z-50 bg-bg/95 backdrop-blur-md border-b border-cyan/30">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i data-lucide="cpu" className="text-cyan w-8 h-8"></i>
              <span className="font-orbitron font-bold text-2xl tracking-widest text-white glow-cyan">NET_RUNNER</span>
            </div>
            <div className="hidden md:flex gap-8 font-mono text-sm">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="hover:text-cyan hover:glow-cyan transition-colors">&gt;&gt; {l.label}</a>
              ))}
            </div>
            <button id="menu-btn" className="md:hidden text-cyan hover:text-white transition-colors">
              <i data-lucide="menu" className="w-8 h-8"></i>
            </button>
          </div>
        </nav>

        <div id="mobile-menu" className="fixed inset-0 bg-black/95 z-40 pt-24 px-8 flex flex-col gap-6 md:hidden border-l-2 border-cyan">
          <button id="close-menu" className="absolute top-6 right-6 text-cyan">
            <i data-lucide="x" className="w-8 h-8"></i>
          </button>
          {mobileNavLinks.map(l => (
            <a key={l.href} href={l.href} className="text-2xl font-orbitron text-white hover:text-cyan border-b border-gray-800 pb-2">{l.label}</a>
          ))}
          <div className="mt-auto mb-10 font-mono text-xs text-gray-500">SYSTEM_READY<br />V.2.0.4 MOBILE_VIEW</div>
        </div>

        <section className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-24 h-px bg-cyan/50 hidden md:block"></div>
          <div className="absolute bottom-1/4 right-0 w-24 h-px bg-magenta/50 hidden md:block"></div>
          <div className="absolute top-32 right-10 w-4 h-4 border-t border-r border-cyan"></div>
          <div className="absolute bottom-32 left-10 w-4 h-4 border-b border-l border-magenta"></div>
          <div className="container mx-auto px-6 text-center z-10">
            <p className="font-mono text-magenta tracking-[0.3em] mb-4 text-xs md:text-sm animate-pulse">SYSTEM STATUS: CRITICAL</p>
            <div className="glitch-wrapper mb-8">
              <h1 className="font-orbitron font-black text-5xl md:text-7xl lg:text-9xl tracking-tighter text-white glitch" data-text="SECURE THE FUTURE">SECURE THE FUTURE</h1>
            </div>
            <p className="font-rajdhani text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 border-l-2 border-cyan pl-6 text-left md:text-center md:border-l-0 md:pl-0">
              Advanced neural network defense protocols for the post-digital age. We protect your data from void-space incursions.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <a href="#contact" className="w-full md:w-auto cyber-shape bg-transparent border-2 border-cyan text-cyan font-orbitron font-bold py-4 px-10 tracking-widest hover:bg-cyan hover:text-black transition-all btn-glitch uppercase relative group">
                <span className="absolute inset-0 bg-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Initialize
              </a>
              <a href="#services" className="w-full md:w-auto cyber-shape bg-dark border border-magenta/50 text-magenta font-mono py-4 px-10 hover:border-magenta hover:shadow-[0_0_15px_rgba(255,0,255,0.5)] transition-all">// BROWSE_PROTOCOLS</a>
            </div>
          </div>
        </section>

        <div className="border-y border-gray-800 bg-dim/50 py-6">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
            {stats.map((s, i) => (
              <div key={i}>
                <div className={`text-2xl md:text-3xl text-white font-bold ${s.target ? "counter" : ""}`} data-target={s.target ?? undefined}>{s.initial}</div>
                <div className={`text-xs ${s.color}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <section className="py-20 bg-dark/50">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="w-full bg-[#0a0a0a] border border-gray-700 rounded-sm shadow-2xl overflow-hidden font-mono text-xs md:text-sm">
              <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-500">root@net_runner:~</span>
              </div>
              <div className="p-6 text-gray-300 space-y-2 h-72 overflow-y-auto font-mono custom-scrollbar">
                <div className="flex">
                  <span className="text-cyan mr-2">➜</span>
                  <span className="text-magenta">~</span>
                  <span className="ml-2">run net_runner_diagnostic.exe</span>
                </div>
                <div className="text-gray-500">
                  [INIT] Loading core modules...<br />
                  [LOAD] Encryption algorithms: <span className="text-green-400">OK</span><br />
                  [LOAD] Firewall matrix: <span className="text-green-400">OK</span><br />
                  [LOAD] Neural link: <span className="text-green-400">OK</span><br />
                  [WARN] Intrusion detected in Sector 7G...<br />
                  [ACTN] Deploying countermeasures... <span className="text-magenta">THREAT ELIMINATED</span>
                </div>
                <div className="mt-4 border-l-2 border-cyan pl-4 text-cyan/80">
                  &gt; Current Objectives:<br />
                  &gt; 01. Pen_Testing // ACTIVE<br />
                  &gt; 02. Zero_Trust_Architecture // ACTIVE<br />
                  &gt; 03. Void_Monitoring // ACTIVE
                </div>
                <div className="flex mt-4">
                  <span className="text-cyan mr-2">➜</span>
                  <span className="text-magenta">~</span>
                  <span className="ml-2">awaiting_input<span className="cursor">&nbsp;</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-gray-800 pb-4 gap-4">
              <h2 className="font-orbitron text-4xl text-white glow-cyan">
                <span className="text-cyan">/</span> OUR_PROTOCOLS
              </h2>
              <span className="font-mono text-gray-500">V.2.0.45 // SERVICES_LIST</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map(s => (
                <div key={s.title} className="cyber-card bg-[#0F0F0F] p-1 relative group hover:-translate-y-2 transition-transform duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${s.color}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0`}></div>
                  <div className={`absolute top-0 left-0 w-full h-[2px] bg-${s.color}/50`}></div>
                  <div className={`relative z-10 p-8 h-full border-l border-gray-800 group-hover:border-${s.color}/30 transition-colors`}>
                    <div className={`w-12 h-12 bg-black border border-${s.color} flex items-center justify-center mb-6 shadow-[0_0_10px_rgba(${s.color === "cyan" ? "0,255,255" : "255,0,255"},0.3)]`}>
                      <i data-lucide={s.icon} className={`text-${s.color}`}></i>
                    </div>
                    <h3 className={`font-orbitron text-xl text-white mb-2 group-hover:text-${s.color} transition-colors`}>{s.title}</h3>
                    <p className="font-rajdhani text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="dossiers" className="py-24 relative overflow-hidden" style={{ backgroundColor: "#08070f" }}>
          <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #00FFFF 25%, #FF00FF 75%, transparent 100%)" }}></div>
          <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #FF00FF 25%, #00FFFF 75%, transparent 100%)" }}></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-gray-800 pb-4 gap-4">
              <div>
                <p className="font-mono text-magenta text-xs tracking-[0.3em] mb-2 animate-pulse">CLASSIFIED // OPS_LOG_v3.4</p>
                <h2 className="font-orbitron text-4xl text-white glow-magenta">
                  <span className="text-magenta">/</span> FIELD_DOSSIERS
                </h2>
              </div>
              <span className="font-mono text-gray-500">DECRYPT_LEVEL_OMEGA // 03_RECORDS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dossiers.map(d => {
                const borderTop = d.color === "cyan" ? "bg-cyan/60" : "bg-magenta/60";
                const borderL = d.color === "cyan" ? "border-cyan/20 group-hover:border-cyan/50" : "border-magenta/20 group-hover:border-magenta/50";
                const chipBorder = d.color === "cyan" ? "text-cyan border-cyan/40" : "text-magenta border-magenta/40";
                const titleHover = d.color === "cyan" ? "group-hover:text-cyan" : "group-hover:text-magenta";
                const outcomeColor = d.color === "cyan" ? "text-cyan" : "text-magenta";
                const classifColor = d.offColor === "cyan" ? "text-cyan" : "text-magenta";
                const tintMul = d.color === "cyan"
                  ? "linear-gradient(160deg, rgba(0,30,40,0.55) 0%, rgba(0,60,80,0.75) 60%, rgba(15,0,30,0.55) 100%)"
                  : "linear-gradient(160deg, rgba(40,0,30,0.6) 0%, rgba(70,0,55,0.78) 60%, rgba(0,15,30,0.55) 100%)";
                const tintScreen = `radial-gradient(ellipse at 50% 60%, rgba(${d.colorRgb},0.28) 0%, transparent 70%)`;
                return (
                  <article key={d.id} className={`cyber-card bg-[#0d0d18] p-1 group hover:-translate-y-2 transition-transform duration-300 relative ${d.offset}`}>
                    <div className={`absolute top-0 left-0 w-full h-[2px] ${borderTop}`}></div>
                    <div className={`relative z-10 p-6 border-l transition-colors ${borderL}`}>
                      <div className="aspect-[16/9] mb-5 relative overflow-hidden bg-black">
                        <img src={d.img} alt={d.title} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-50" />
                        <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: tintMul }}></div>
                        <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: tintScreen }}></div>
                        <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px] opacity-30 pointer-events-none"></div>
                        <div className={`absolute top-3 left-3 font-mono text-[10px] tracking-widest bg-black/70 px-2 py-1 border ${chipBorder}`}>{d.id}</div>
                      </div>
                      <div className={`font-mono text-[10px] tracking-[0.3em] mb-2 ${classifColor}`}>CLASSIFIED // {d.classification}</div>
                      <h3 className={`font-orbitron text-xl text-white mb-2 transition-colors ${titleHover}`}>{d.title}</h3>
                      <p className="font-rajdhani text-gray-400 mb-4">{d.body}</p>
                      <div className="flex items-center justify-between border-t border-gray-800 pt-3 font-mono text-xs">
                        <span className="text-gray-500">// {d.date}</span>
                        <span className={outcomeColor}>{d.outcome}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 relative overflow-hidden" style={{ backgroundColor: "#060611" }}>
          <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #00FFFF 20%, #FF00FF 80%, transparent 100%)" }}></div>
          <div className="absolute bottom-0 inset-x-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #FF00FF 20%, #00FFFF 80%, transparent 100%)" }}></div>
          <div className="container mx-auto px-6 mb-6 flex items-center justify-between font-mono text-[10px] md:text-xs">
            <div className="flex items-center gap-3 text-cyan tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span> LIVE_DATA_STREAM // GLOBAL_NODES
            </div>
            <span className="text-gray-500 hidden sm:inline">— UPLINK_SECURE — TX 994-A — RX 412-Δ</span>
            <span className="flex items-center gap-2 text-magenta tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-magenta animate-pulse"></span> 24/7
            </span>
          </div>
          <div className="overflow-hidden py-3 mb-3">
            <div className="marquee-track marquee-cyan">
              {[...streamCyan, ...streamCyan].map((c, i) => (
                <div key={`sc-${i}`} className="rounded-sm border border-cyan/40 bg-[#0a0a18]/70 backdrop-blur-sm px-3 py-2 flex items-center gap-3 shrink-0 w-72 hover:border-cyan transition-colors">
                  <div className="w-10 h-10 overflow-hidden border border-cyan/50 shrink-0 relative bg-black">
                    <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-60" />
                    <div className="absolute inset-0 mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(0,255,255,0.3), transparent 70%)" }}></div>
                  </div>
                  <div className="font-mono text-[10px] flex-1 min-w-0">
                    <div className="text-cyan tracking-widest truncate">&gt; {c.label}</div>
                    <div className="text-gray-500">{c.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden py-3">
            <div className="marquee-track marquee-magenta">
              {[...streamMagenta, ...streamMagenta].map((m, i) => (
                <div key={`sm-${i}`} className="rounded-full border border-magenta/40 bg-[#180a18]/70 backdrop-blur-sm px-3 py-2 flex items-center gap-3 shrink-0 w-72 hover:border-magenta transition-colors">
                  <div className="w-10 h-10 overflow-hidden rounded-full border border-magenta/50 shrink-0 relative bg-black">
                    <img src={m.img} alt="" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-60" />
                    <div className="absolute inset-0 mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(255,0,255,0.3), transparent 70%)" }}></div>
                  </div>
                  <div className="font-mono text-[10px] flex-1 min-w-0">
                    <div className="text-magenta tracking-widest truncate">&gt; {m.label}</div>
                    <div className="text-gray-500">{m.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-dark/30 border-t border-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="font-orbitron text-4xl text-center text-white mb-16 glow-magenta">
              SECURITY CLEARANCE <span className="text-magenta">LEVELS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map(t => (
                <div key={t.tag} className={`cyber-tier ${t.outerBg} ${t.padThickness} relative ${t.glow}`}>
                  <div className="cyber-tier bg-black/90 p-6 flex flex-col h-full relative">
                    {t.popular && <div className="absolute top-0 right-0 bg-cyan text-black font-bold font-mono text-xs px-2 py-1">POPULAR</div>}
                    <h3 className={`font-mono ${t.tagColor} mb-2`}>{t.tag}</h3>
                    <div className={`text-4xl font-orbitron text-white mb-6 ${t.priceClass || ""}`}>{t.price}<span className="text-sm text-gray-500">cr/mo</span></div>
                    <ul className={`space-y-3 font-rajdhani ${t.textClass || "text-gray-300"} mb-8 flex-1`}>
                      {t.features.map(f => (
                        <li key={f} className="flex items-center gap-2">
                          <i data-lucide="check" className={`w-4 h-4 ${t.iconColor}`}></i> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 ${t.btn} transition-colors font-mono text-sm`}>{t.btnText}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#07070d" }}>
          <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #00FFFF 25%, #FF00FF 75%, transparent 100%)" }}></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-gray-800 pb-4 gap-4">
              <div>
                <p className="font-mono text-magenta text-xs tracking-[0.3em] mb-2">VISUAL_FEED // CHANNEL_404</p>
                <h2 className="font-orbitron text-4xl text-white glow-cyan">
                  <span className="text-cyan">/</span> GHOST_GRID
                </h2>
              </div>
              <span className="font-mono text-gray-500">SURVEILLANCE_PASSIVE // FRAME_RATE: 24fps</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto">
              {/* col-span-7 large */}
              <figure className="md:col-span-7 aspect-[16/9] relative overflow-hidden bg-black border border-cyan/30 group">
                <img src={ghostGrid[0].img} alt={ghostGrid[0].title} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-55 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(0,40,55,0.55), rgba(0,75,100,0.75) 60%, rgba(20,0,40,0.55))" }}></div>
                <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(${ghostGrid[0].colorRgb},0.3), transparent 70%)` }}></div>
                <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-25 pointer-events-none"></div>
                <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest bg-black/70 border px-2 py-1 text-cyan border-cyan/40">{ghostGrid[0].chip}</div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-xs">
                  <span className="text-cyan">&gt; {ghostGrid[0].title}</span>
                  <span className="text-gray-300">{ghostGrid[0].status}</span>
                </div>
              </figure>

              {/* col-span-5 stacked pair to fill row height */}
              <div className="md:col-span-5 md:h-full flex flex-col gap-4">
                <figure className="aspect-[16/9] md:aspect-auto md:flex-1 relative overflow-hidden bg-black border border-magenta/30 group">
                  <img src={ghostGrid[1].img} alt={ghostGrid[1].title} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-55 group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(40,0,30,0.6), rgba(70,0,55,0.78) 60%, rgba(0,20,30,0.55))" }}></div>
                  <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(${ghostGrid[1].colorRgb},0.3), transparent 70%)` }}></div>
                  <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-25 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest bg-black/70 border px-2 py-1 text-magenta border-magenta/40">{ghostGrid[1].chip}</div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-xs">
                    <span className="text-magenta">&gt; {ghostGrid[1].title}</span>
                    <span className="text-gray-300">{ghostGrid[1].status}</span>
                  </div>
                </figure>
                <figure className="aspect-[16/9] md:aspect-auto md:flex-1 relative overflow-hidden bg-black border border-magenta/30 group">
                  <img src="https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1100&q=85&auto=format&fit=crop" alt="Sub-Node Φ-9 trace" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-55 group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(40,0,30,0.6), rgba(70,0,55,0.78) 60%, rgba(0,20,30,0.55))" }}></div>
                  <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,0,255,0.3), transparent 70%)" }}></div>
                  <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-25 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest bg-black/70 border px-2 py-1 text-magenta border-magenta/40">CHANNEL_18 // SUB-RELAY</div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-xs">
                    <span className="text-magenta">&gt; Sub-Node Φ-9 — Trace</span>
                    <span className="text-gray-300">[REROUTING]</span>
                  </div>
                </figure>
              </div>

              {/* row 2: small × 3 */}
              {ghostGrid.slice(2).map((g, i) => {
                const tintMul = g.color === "cyan"
                  ? "linear-gradient(160deg, rgba(0,30,40,0.55), rgba(0,55,75,0.7) 60%, rgba(15,0,30,0.55))"
                  : "linear-gradient(160deg, rgba(40,0,30,0.55), rgba(70,0,55,0.7) 60%, rgba(0,15,30,0.55))";
                const tintScreen = `radial-gradient(ellipse at 50% 50%, rgba(${g.colorRgb},0.25), transparent 70%)`;
                const borderCls = g.color === "cyan" ? "border-cyan/25" : "border-magenta/25";
                const chipCls = g.color === "cyan" ? "text-cyan border-cyan/40" : "text-magenta border-magenta/40";
                const titleColor = g.color === "cyan" ? "text-cyan" : "text-magenta";
                return (
                  <figure key={`small-${i}`} className={`${g.span} relative overflow-hidden bg-black border group ${borderCls}`}>
                    <img src={g.img} alt={g.title} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-55 group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: tintMul }}></div>
                    <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: tintScreen }}></div>
                    <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px] opacity-25 pointer-events-none"></div>
                    <div className={`absolute top-3 left-3 font-mono text-[10px] bg-black/70 border px-2 py-0.5 tracking-widest ${chipCls}`}>{g.chip}</div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end font-mono text-[10px]">
                      <span className={`${titleColor} tracking-widest`}>&gt; {g.title}</span>
                      <span className="text-gray-400">{g.status}</span>
                    </div>
                  </figure>
                );
              })}
            </div>
            <div className="mt-10 flex items-center justify-between text-xs font-mono text-gray-500 max-w-6xl mx-auto">
              <span>// 06_FEEDS_LIVE</span>
              <span className="hidden md:inline">— PASSIVE_INTERCEPT_ONLY · NO_PINGBACK</span>
              <span className="text-cyan">→ FULL_TELEMETRY</span>
            </div>
          </div>
        </section>

        <section id="logs" className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="font-orbitron text-3xl text-white mb-10 border-l-4 border-cyan pl-4">
              TRANSMISSION <span className="text-gray-500">LOGS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
              {logs.map(l => (
                <div key={l.from} className={`bg-dim p-6 border-l-2 ${l.border} relative`}>
                  <div className="text-xs text-gray-500 mb-2">FROM: {l.from} // TIME: {l.time}</div>
                  <p className="text-gray-300">{l.body}</p>
                  <div className={`mt-4 ${l.statusColor}`}>{l.status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#0a0a14" }}>
          <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-gray-800 pb-4 gap-4">
              <div>
                <p className="font-mono text-cyan text-xs tracking-[0.3em] mb-2">OPERATIONAL_BLUEPRINT // v.4.0.7</p>
                <h2 className="font-orbitron text-4xl text-white glow-magenta">
                  <span className="text-magenta">/</span> CORE_OPERATIONS
                </h2>
              </div>
              <span className="font-mono text-gray-500">04 // SUBROUTINES_ACTIVE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {coreOps.map(op => {
                const borderL = op.color === "cyan" ? "border-cyan/30 hover:border-cyan/60" : "border-magenta/30 hover:border-magenta/60";
                const hexColor = op.color === "cyan" ? "text-cyan" : "text-magenta";
                const romanColor = op.color === "cyan" ? "text-cyan/30 group-hover:text-cyan/70" : "text-magenta/30 group-hover:text-magenta/70";
                const iconBoxBorder = op.color === "cyan" ? "border-cyan" : "border-magenta";
                const iconColor = op.color === "cyan" ? "text-cyan" : "text-magenta";
                const titleHover = op.color === "cyan" ? "group-hover:text-cyan" : "group-hover:text-magenta";
                const statusColor = op.color === "cyan" ? "text-cyan" : "text-magenta";
                const shadowStyle = { boxShadow: `0 0 10px rgba(${op.colorRgb},0.3)` };
                return (
                  <div key={op.hex} className={`cyber-card bg-[#0d0d18] p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative border-l min-h-[280px] ${borderL}`}>
                    <div className="flex items-start justify-between mb-6">
                      <span className={`font-mono text-[10px] tracking-widest ${hexColor}`}>[ HEX // {op.hex} ]</span>
                      <span className={`font-orbitron text-2xl transition-colors ${romanColor}`}>{op.roman}</span>
                    </div>
                    <div className={`w-10 h-10 bg-black border flex items-center justify-center mb-5 ${iconBoxBorder}`} style={shadowStyle}>
                      <i data-lucide={op.icon} className={`w-5 h-5 ${iconColor}`}></i>
                    </div>
                    <h3 className={`font-orbitron text-base text-white mb-3 transition-colors ${titleHover}`}>{op.title}</h3>
                    <p className="font-rajdhani text-sm text-gray-400 mb-5">{op.body}</p>
                    <div className="mt-auto pt-3 border-t border-gray-800 font-mono text-[10px] text-gray-500 flex justify-between">
                      <span>// PHASE_{op.phase}</span>
                      <span className={statusColor}>{op.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 relative overflow-hidden" style={{ backgroundColor: "#060611" }}>
          <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #00FFFF 25%, #FF00FF 75%, transparent 100%)" }}></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <p className="font-mono text-cyan text-xs tracking-[0.3em] mb-3">// TRUSTED · NETWORK</p>
            <h2 className="font-orbitron text-3xl md:text-4xl text-white mb-3 glow-cyan">// Operating across the meshnet.</h2>
            <p className="font-rajdhani text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10">
              Forty-seven sovereign nodes; twelve geo-isolated zones. Net_Runner is wired into the same primitives that ship the rest of the dark stack.
            </p>
            <div className="border border-cyan/30 bg-dim/40 backdrop-blur-sm cyber-card p-6 md:p-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-6 items-center">
                {trustLogos.map(t => (
                  <a key={t.slug} href="#" aria-label={t.label} className="block">
                    <img src={`https://cdn.simpleicons.org/${t.slug}/00FFFF`} alt={t.label} className="cyber-trust-logo h-7 mx-auto" loading="lazy" />
                  </a>
                ))}
              </div>
              <div className="mt-8 pt-5 border-t border-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] tracking-widest">
                <span className="text-cyan/80">// 47 nodes &middot; 12 zones &middot; uptime 99.97%</span>
                <span className="text-magenta/80">// integrity_check :: PASS</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-black border-y border-cyan/30 py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #00FFFF 25%, #FF00FF 75%, transparent 100%)" }}></div>
          <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #FF00FF 25%, #00FFFF 75%, transparent 100%)" }}></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-gray-800 pb-4 gap-4">
              <div>
                <p className="font-mono text-cyan text-xs tracking-[0.3em] mb-2">// SUBSYSTEMS_04</p>
                <h2 className="font-orbitron text-3xl md:text-4xl text-white glow-cyan">Four engines run the relay.</h2>
                <p className="font-rajdhani text-gray-400 mt-3 max-w-2xl">Two telemetry streams, two doctrine modules. Every packet that touches NET_RUNNER passes the diagonal.</p>
              </div>
              <span className="font-mono text-gray-500 text-xs">// GRID_2x2 &middot; DIAGONAL_LIVE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
              {/* [0][0] TOP-LEFT — Terminal: node_07 packet sync (cyan) */}
              <div className="border-2 border-cyan bg-black p-4 md:p-5 flex flex-col">
                <div className="flex items-center gap-1.5 mb-3 border-b border-cyan/30 pb-2">
                  <span className="w-2 h-2 bg-cyan border border-white/40 rounded-sm"></span>
                  <span className="w-2 h-2 bg-magenta border border-white/40 rounded-sm"></span>
                  <span className="w-2 h-2 bg-white border border-white/40 rounded-sm"></span>
                  <span className="ml-auto font-mono text-[8px] uppercase tracking-widest text-cyan">// node_07 :: ws &rarr; live</span>
                </div>
                <ol className="font-mono text-[11px] uppercase text-gray-300 space-y-1.5 flex-1 min-h-[200px] list-none p-0 m-0">
                  {termCyanLines.map(l => (
                    <li key={l.d} className="cyber-term-line" style={{ "--d": l.d }}>
                      <span className={dotColorClass(l.dot)}>&gt;</span> {l.text}{l.tag ? <> <span className={l.tagColor}>{l.tag}</span></> : null}
                    </li>
                  ))}
                  <li className="cyber-term-line" style={{ "--d": "2.7s" }}>
                    <span className="text-cyan">&gt;</span> READY<span className="cyber-cursor inline-block w-1.5 h-2 bg-cyan align-middle ml-1"></span>
                  </li>
                </ol>
                <div className="mt-2 pt-2 border-t border-cyan/30 h-1 bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-magenta cyber-scrub-bar"></div>
                </div>
              </div>

              {/* [0][1] TOP-RIGHT — Icon card: Edge Shield (magenta) */}
              <div className="border-2 border-magenta/40 bg-dim p-6 md:p-8 flex flex-col gap-4 group hover:border-magenta transition-colors duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 border-2 border-magenta/60 bg-magenta/10 flex items-center justify-center">
                    <i data-lucide="shield" className="text-magenta w-6 h-6"></i>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-magenta">// 03</span>
                </div>
                <h3 className="font-orbitron text-xl text-white uppercase">EDGE_SHIELD</h3>
                <p className="font-rajdhani text-gray-400 text-sm leading-relaxed">Mesh-validated, packet-signed, replay-resistant. Every transit clears three guards before reaching the inner ring.</p>
                <ul className="font-mono text-[10px] uppercase tracking-wider text-gray-500 space-y-1.5">
                  <li><span className="text-magenta">&gt;</span> entropy_seed :: atmospheric</li>
                  <li><span className="text-magenta">&gt;</span> sig_window :: 90s rolling</li>
                  <li><span className="text-magenta">&gt;</span> replay_cache :: 64k entries</li>
                </ul>
                <div className="mt-auto pt-3 border-t border-magenta/20 flex items-center justify-between text-[10px] uppercase tracking-widest text-magenta/80 font-mono">
                  <span>// guards :: 3 / 3 active</span>
                  <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* [1][0] BOTTOM-LEFT — Icon card: Routing Mesh (cyan) */}
              <div className="border-2 border-cyan/40 bg-dim p-6 md:p-8 flex flex-col gap-4 group hover:border-cyan transition-colors duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 border-2 border-cyan/60 bg-cyan/10 flex items-center justify-center">
                    <i data-lucide="router" className="text-cyan w-6 h-6"></i>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan">// 04</span>
                </div>
                <h3 className="font-orbitron text-xl text-white uppercase">ROUTING_MESH</h3>
                <p className="font-rajdhani text-gray-400 text-sm leading-relaxed">Adaptive uplink across 47 sovereign nodes. Failover under 220 ms; trace-back resistant by construction.</p>
                <ul className="font-mono text-[10px] uppercase tracking-wider text-gray-500 space-y-1.5">
                  <li><span className="text-cyan">&gt;</span> nodes :: 47 / 47 online</li>
                  <li><span className="text-cyan">&gt;</span> p99_failover :: 217ms</li>
                  <li><span className="text-cyan">&gt;</span> hop_diversity :: &gt;= 4</li>
                </ul>
                <div className="mt-auto pt-3 border-t border-cyan/20 flex items-center justify-between text-[10px] uppercase tracking-widest text-cyan/80 font-mono">
                  <span>// uplink :: nominal</span>
                  <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* [1][1] BOTTOM-RIGHT — Terminal: node_31 security audit (magenta) */}
              <div className="border-2 border-magenta bg-black p-4 md:p-5 flex flex-col">
                <div className="flex items-center gap-1.5 mb-3 border-b border-magenta/30 pb-2">
                  <span className="w-2 h-2 bg-cyan border border-white/40 rounded-sm"></span>
                  <span className="w-2 h-2 bg-magenta border border-white/40 rounded-sm"></span>
                  <span className="w-2 h-2 bg-white border border-white/40 rounded-sm"></span>
                  <span className="ml-auto font-mono text-[8px] uppercase tracking-widest text-magenta">// node_31 :: audit &rarr; rolling</span>
                </div>
                <ol className="font-mono text-[11px] uppercase text-gray-300 space-y-1.5 flex-1 min-h-[200px] list-none p-0 m-0">
                  {termMagentaLines.map(l => (
                    <li key={l.d} className="cyber-term-line" style={{ "--d": l.d }}>
                      <span className={dotColorClass(l.dot)}>&gt;</span> {l.text}{l.tag ? <> <span className={l.tagColor}>{l.tag}</span></> : null}
                    </li>
                  ))}
                  <li className="cyber-term-line" style={{ "--d": "2.7s" }}>
                    <span className="text-magenta">&gt;</span> READY<span className="cyber-cursor inline-block w-1.5 h-2 bg-magenta align-middle ml-1"></span>
                  </li>
                </ol>
                <div className="mt-2 pt-2 border-t border-magenta/30 h-1 bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan cyber-scrub-bar"></div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between max-w-6xl mx-auto font-mono text-[10px] md:text-xs text-gray-500 tracking-widest">
              <span>// DIAGONAL_PATTERN :: TERM[0,0] &middot; ICON[0,1] &middot; ICON[1,0] &middot; TERM[1,1]</span>
              <span className="text-magenta">&rarr; STATUS :: ALL_FOUR_NOMINAL</span>
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
          <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="font-orbitron text-5xl text-white mb-6 glitch" data-text="INITIATE UPLINK">INITIATE UPLINK</h2>
              <p className="font-rajdhani text-xl text-gray-400 mb-8">
                Secure channel established. Fill out the parameters below to request assistance. All transmissions are end-to-end encrypted.
              </p>
              <div className="flex items-center gap-4 text-cyan font-mono mb-2">
                <i data-lucide="map-pin"></i> SECTOR 7, NODE 404
              </div>
              <div className="flex items-center gap-4 text-magenta font-mono">
                <i data-lucide="mail"></i> ROOT@NETRUNNER.SYS
              </div>
            </div>
            <form className="md:w-1/2 space-y-6">
              <input type="text" placeholder="CODENAME" className="w-full bg-black border-b border-gray-700 text-white p-4 focus:border-cyan focus:outline-none transition-colors font-mono placeholder-gray-600" />
              <input type="email" placeholder="ENCRYPTED_EMAIL" className="w-full bg-black border-b border-gray-700 text-white p-4 focus:border-cyan focus:outline-none transition-colors font-mono placeholder-gray-600" />
              <select defaultValue="SELECT_SERVICE_TYPE" className="w-full bg-black border-b border-gray-700 text-gray-400 p-4 focus:border-cyan focus:outline-none font-mono">
                <option>SELECT_SERVICE_TYPE</option>
                <option>Penetration Testing</option>
                <option>Incident Response</option>
                <option>Architecture Review</option>
              </select>
              <textarea placeholder="MISSION_PARAMETERS" rows={4} className="w-full bg-black border-b border-gray-700 text-white p-4 focus:border-cyan focus:outline-none transition-colors font-mono placeholder-gray-600"></textarea>
              <button type="submit" className="cyber-shape bg-cyan/10 border border-cyan text-cyan font-orbitron font-bold py-4 px-10 w-full hover:bg-cyan hover:text-black transition-all btn-glitch">TRANSMIT_DATA</button>
            </form>
          </div>
        </section>

        <footer className="bg-black border-t border-gray-800 pt-12 pb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan via-magenta to-cyan"></div>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 font-mono text-sm">
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <i data-lucide="server" className="text-magenta w-4 h-4"></i> NET_RUNNER INC.
                </h4>
                <p className="text-gray-500 max-w-md">Operating in the shadows to keep your light burning. Global leaders in offensive and defensive cyber-warfare.</p>
              </div>
              <div>
                <h4 className="text-cyan mb-4">_COORDINATES</h4>
                <ul className="text-gray-500 space-y-2">
                  <li>Sector 7, Neo-Tokyo</li>
                  <li>Node: 127.0.0.1</li>
                  <li>Encrypted Ch: 994-A</li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan mb-4">_LEGAL</h4>
                <ul className="text-gray-500 space-y-2">
                  <li className="hover:text-magenta cursor-pointer transition-colors">Terms_of_Use</li>
                  <li className="hover:text-magenta cursor-pointer transition-colors">Privacy_Protocol</li>
                  <li className="hover:text-magenta cursor-pointer transition-colors">SLA_Agreement</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-900 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono">
              <p>&copy; 2077 NET_RUNNER SYSTEMS. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> SYSTEM ONLINE</span>
                <span>LATENCY: 4ms</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
