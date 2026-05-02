export default function T64Isometric() {
  const navLinks = [
    { href: "#services", label: "SOLUTIONS" },
    { href: "#network", label: "NETWORK" },
    { href: "#pricing", label: "PRICING" },
  ];

  const cubes = [
    { label: "CORE", top: "40%", left: "40%", z: 10, anim: "animate-float-1", textClass: "" },
    { label: "DB", top: "70%", left: "10%", z: 5, anim: "animate-float-2", textClass: "text-xs" },
    { label: "API", top: "10%", left: "70%", z: 5, anim: "animate-float-3", textClass: "text-xs" },
    { label: "LOG", top: "20%", left: "20%", z: 5, anim: "animate-float-4", textClass: "text-xs" },
  ];

  const proofLogos = [
    { name: "ACME_CORP", shape: <div className="w-6 h-6 bg-slate-800 rounded-sm"></div> },
    { name: "GLOBEX", shape: <div className="w-6 h-6 border-4 border-slate-800 rounded-full"></div> },
    { name: "UMBRELLA", shape: <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-slate-800"></div> },
    { name: "MASSIVE", shape: <div className="w-6 h-6 bg-slate-800 transform rotate-45"></div> },
  ];

  const services = [
    { icon: "server", title: "Elastic Storage", desc: "Scalable storage blocks that expand automatically based on your inventory throughput data.", cta: "READ_DOCS" },
    { icon: "route", title: "Smart Routing", desc: "Algorithmically determined shipping paths reducing latency by up to 45% globally via mesh networks.", cta: "VIEW_MAP" },
    { icon: "shield-check", title: "Secure Handoff", desc: "Blockchain-verified custody chains ensure zero loss during physical-to-digital transfers.", cta: "VERIFY" },
  ];

  const features = [
    { icon: "box-select", title: "3D Warehousing", desc: "Visualise stock levels in true isometric view." },
    { icon: "activity", title: "Pulse Analytics", desc: "Live heartbeat monitoring of your supply chain." },
    { icon: "globe", title: "Global Mesh", desc: "200+ edge nodes ensuring fast data propagation." },
    { icon: "cpu", title: "Automated Bots", desc: "Deploy software robots to handle manifests." },
  ];

  const nodeStatuses = [
    { region: "US-EAST-1", status: "[ONLINE]", color: "text-green-400" },
    { region: "EU-CENTRAL", status: "[ONLINE]", color: "text-green-400" },
    { region: "ASIA-SOUTH", status: "[LATENCY]", color: "text-yellow-400" },
  ];

  const plans = [
    {
      tier: "STARTER", price: "$0", per: "/mo", featured: false,
      perks: ["1 Project Node", "5GB Isometric Storage", "Community Support"],
      checkColor: "text-green-500", titleColor: "text-slate-500",
      cta: "Get Started", ctaClass: "border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors",
    },
    {
      tier: "SCALER", price: "$49", per: "/mo", featured: true,
      perks: ["10 Project Nodes", "500GB Isometric Storage", "Analytics Dashboard", "Priority Support"],
      checkColor: "text-brand-600", titleColor: "text-brand-600",
      cta: "Deploy Now", ctaClass: "bg-slate-900 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg",
    },
    {
      tier: "ENTERPRISE", price: "Custom", per: "", featured: false,
      perks: ["Unlimited Nodes", "Dedicated Edge Server", "24/7 SLA"],
      checkColor: "text-green-500", titleColor: "text-slate-500",
      cta: "Contact Sales", ctaClass: "border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors",
    },
  ];

  const edgeNodes = [
    { id: "NODE_07", region: "US-EAST-1", city: "Virginia · 12ms", racks: "42 racks", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", w: "w-72", grad: "from-slate-900 via-slate-900/50 to-brand-600/20", dir: "tr", status: "ONLINE", statusColor: "text-green-400", live: true, racksColor: "text-brand-400" },
    { id: "NODE_12", region: "EU-CENTRAL", city: "Frankfurt · 4ms", racks: "68 racks", img: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1000&q=85&auto=format&fit=crop", w: "w-80", grad: "from-brand-700/30 via-transparent to-slate-900", dir: "bl", status: "ONLINE", statusColor: "text-green-400", live: true, racksColor: "text-brand-400" },
    { id: "NODE_19", region: "ASIA-SOUTH", city: "Mumbai · 47ms", racks: "31 racks", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", w: "w-72", grad: "from-yellow-700/30 via-transparent to-slate-900/50", dir: "t", status: "LATENCY", statusColor: "text-yellow-400", live: false, racksColor: "text-yellow-400" },
    { id: "NODE_24", region: "JP-EAST", city: "Tokyo · 8ms", racks: "54 racks", img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1000&q=85&auto=format&fit=crop", w: "w-80", grad: "from-slate-900/60 via-transparent to-brand-600/30", dir: "r", status: "ONLINE", statusColor: "text-green-400", live: true, racksColor: "text-brand-400" },
    { id: "NODE_31", region: "SA-EAST", city: "São Paulo · 22ms", racks: "19 racks", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", w: "w-72", grad: "from-slate-900 via-transparent to-brand-700/20", dir: "tr", status: "ONLINE", statusColor: "text-green-400", live: true, racksColor: "text-brand-400" },
    { id: "NODE_44", region: "AU-CENTRAL", city: "Sydney · 28ms", racks: "+8 racks", img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1000&q=85&auto=format&fit=crop", w: "w-80", grad: "from-slate-900/40 via-transparent to-slate-900", dir: "bl", status: "SCALING", statusColor: "text-blue-400", live: false, racksColor: "text-brand-400" },
    { id: "NODE_52", region: "CA-WEST", city: "Vancouver · 17ms", racks: "36 racks", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", w: "w-72", grad: "from-slate-900 via-transparent to-brand-600/15", dir: "t", status: "ONLINE", statusColor: "text-green-400", live: true, racksColor: "text-brand-400" },
    { id: "NODE_61", region: "ME-CENTRAL", city: "Dubai · 19ms", racks: "22 racks", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&q=85&auto=format&fit=crop", w: "w-80", grad: "from-slate-900 via-transparent to-brand-700/25", dir: "tr", status: "ONLINE", statusColor: "text-green-400", live: true, racksColor: "text-brand-400" },
  ];

  const principles = [
    { i: "01", title: "A node is a contract, not a server.", body: "Treat it that way and the mesh routes around the bad ones. Treat it as hardware and you'll patch by hand on Saturdays.", tag: "RULE_01" },
    { i: "02", title: "Visualise, then automate.", body: "If you can't see the inventory in 3D you can't trust the bot that moves it. Watch a week before letting the routing kick in.", tag: "RULE_02" },
    { i: "03", title: "Zero-loss handoffs are paid for, not promised.", body: "Sign every transfer. Even the ones inside your own warehouse. The audit you build in week one is the SLA you sell in year two.", tag: "RULE_03" },
    { i: "04", title: "One queue beats four dashboards.", body: "Resist the urge to fork your alerts by team. The grid wins when one operator can see the whole plane at 3 a.m.", tag: "RULE_04" },
    { i: "05", title: "Ship the first manifest before you finish the docs.", body: "If the system can't carry one real shipment it can't carry a thousand. The first move teaches the next ten.", tag: "RULE_05" },
  ];

  const isoFaq = [
    { i: "Q1", q: "Will Cube_Logic replace our existing WMS?", a: "No. Cube_Logic sits over your existing WMS and ERP, indexes their state, and rewrites the routing layer. Most teams keep every system they had — they just stop logging in to most of them.", open: true },
    { i: "Q2", q: "How long does the trial run?", a: "Fourteen days, no credit card. We deploy a single sandbox node into your VPC; you test against your real manifests; we delete on day fifteen if you decline." },
    { i: "Q3", q: "What's the actual SLA?", a: "99.99% on the routing plane and 99.95% on storage, region-by-region. Enterprise plan adds custom SLOs against your peak windows; status page is live and unfiltered." },
    { i: "Q4", q: "Can we self-host?", a: "Yes — single-tenant on AWS, GCP, or Azure on the Enterprise plan. We help you wire SSO, audit log forwarding, and the routing connector before launch." },
    { i: "Q5", q: "How are nodes priced?", a: "Active-CPU only. Idle nodes do not bill; spike traffic auto-scales without quota requests. The first 5 GB of isometric storage is free, every month." },
  ];

  const platformLinks = ["API Documentation", "System Status", "Integrations", "Changelog"];
  const companyLinks = [
    { label: "About Us" },
    { label: "Careers", badge: "HIRING" },
    { label: "Legal" },
    { label: "Contact" },
  ];
  const footerSocials = ["twitter", "github", "linkedin"];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    fontFamily: { sans: ['Sora','sans-serif'], mono: ['JetBrains Mono','monospace'] },
    colors: {
      brand: { 50:'#eef2ff', 100:'#e0e7ff', 200:'#c7d2fe', 300:'#a5b4fc', 400:'#818cf8', 500:'#6366f1', 600:'#4f46e5', 700:'#4338ca', 800:'#3730a3', 900:'#312e81' },
      surface: '#f8fafc',
    },
    boxShadow: {
      'block': '8px 8px 0px 0px #cbd5e1',
      'block-hover': '12px 12px 0px 0px #6366f1',
      'block-dark': '8px 8px 0px 0px #0f172a',
    },
  } }
};`;

  const customCss = `body { font-family: 'Sora', sans-serif; }
.iso-scene { perspective: 1200px; }
.iso-plane {
  transform: rotateX(60deg) rotateZ(-45deg);
  transform-style: preserve-3d;
  width: 320px; height: 320px; position: relative;
}
.cube {
  width: 60px; height: 60px; position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.cube-face {
  position: absolute; width: 60px; height: 60px;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.9);
  backface-visibility: hidden;
}
.cube-face--top   { background: #818cf8; transform: rotateX(90deg) translateZ(30px); }
.cube-face--front { background: #4f46e5; transform: rotateY(0deg) translateZ(30px); }
.cube-face--right { background: #312e81; transform: rotateY(90deg) translateZ(30px); }
@keyframes float-iso {
  0%,100% { transform: translateZ(0px); }
  50%     { transform: translateZ(30px); }
}
.animate-float-1 { animation: float-iso 4s ease-in-out infinite; }
.animate-float-2 { animation: float-iso 5s ease-in-out infinite 0.7s; }
.animate-float-3 { animation: float-iso 4.5s ease-in-out infinite 1.2s; }
.animate-float-4 { animation: float-iso 6s ease-in-out infinite 2s; }
.block-card { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid #1e293b; }
.block-card:hover { transform: translate(-4px, -4px); }
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}
#mobile-menu { transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; max-height: 0; opacity: 0; overflow: hidden; }
#mobile-menu.open { max-height: 400px; opacity: 1; }
html, body { overflow-x: clip; }
.full-bleed-iso { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }
.iso-marquee { display: flex; gap: 20px; width: max-content; animation: iso-x 65s linear infinite; padding: 8px 0; }
.iso-marquee:hover { animation-play-state: paused; }
@keyframes iso-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 10px)); } }
.iso-faq summary { list-style: none; cursor: pointer; }
.iso-faq summary::-webkit-details-marker { display: none; }
.iso-faq summary .iso-chevron { transition: transform 250ms ease; }
.iso-faq[open] summary .iso-chevron { transform: rotate(90deg); }
@keyframes node-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.55); }
  70% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
}
.node-pulse { animation: node-pulse 2.4s ease-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .iso-marquee { animation: none; }
  .node-pulse { animation: none; }
  .iso-faq summary .iso-chevron { transition: none; }
}`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    function toggleMenu(){ if (mobileMenu) mobileMenu.classList.toggle('open'); }
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mobileMenu.classList.remove('open'); }); });
    return;
  }
  setTimeout(init, 50);
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="scroll-smooth bg-surface text-slate-900 overflow-x-hidden antialiased selection:bg-brand-200 selection:text-brand-900">

        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b-2 border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-600 border-2 border-slate-900 flex items-center justify-center text-white rounded-sm transition-transform group-hover:rotate-12">
                <i data-lucide="box" className="w-5 h-5"></i>
              </div>
              <span className="font-mono font-bold text-xl tracking-tighter text-slate-900">CUBE_<span className="text-brand-600">LOGIC</span></span>
            </a>

            <div className="hidden md:flex items-center gap-8 font-mono text-sm font-semibold">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="hover:text-brand-600 transition-colors">{l.label}</a>
              ))}
              <button className="bg-slate-900 text-white px-6 py-2.5 hover:bg-brand-600 transition-colors shadow-[4px_4px_0px_0px_#94a3b8] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#94a3b8] border-2 border-transparent">
                LOGIN
              </button>
            </div>

            <button id="menu-btn" className="md:hidden text-slate-900 p-2 focus:outline-none">
              <i data-lucide="menu" className="w-8 h-8"></i>
            </button>
          </div>

          <div id="mobile-menu" className="md:hidden bg-white border-b-2 border-slate-200">
            <div className="flex flex-col p-6 space-y-4 font-mono font-semibold text-lg">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="hover:text-brand-600">{l.label}</a>
              ))}
              <hr className="border-slate-200" />
              <button className="bg-brand-600 text-white w-full py-3 shadow-[4px_4px_0px_0px_#1e293b] active:translate-y-1 active:shadow-none border-2 border-slate-900">
                LOGIN
              </button>
            </div>
          </div>
        </nav>

        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 bg-surface overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>
          <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-200 rounded-full blur-[100px] opacity-30 mix-blend-multiply"></div>

          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="z-10 order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white text-brand-700 font-mono text-xs font-bold px-3 py-1.5 rounded border-2 border-slate-200 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM OPERATIONAL
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight text-slate-900">
                Logistics for the <br />
                <span className="text-brand-600 decoration-4 underline decoration-brand-300 underline-offset-4">Distributed Grid</span>
              </h1>
              <p className="text-slate-600 text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Orchestrate physical inventory and digital assets on a unified 3D plane. Real-time tracking with isometric precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-brand-600 text-white font-bold px-8 py-4 text-lg border-2 border-slate-900 shadow-block hover:shadow-block-hover hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all">
                  DEPLOY INSTANCE
                </button>
                <button className="bg-white text-slate-900 font-bold px-8 py-4 text-lg border-2 border-slate-900 shadow-block hover:bg-slate-50 hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2">
                  <i data-lucide="terminal" className="w-5 h-5"></i> DOCS
                </button>
              </div>
            </div>

            <div className="relative h-[350px] md:h-[500px] flex items-center justify-center order-1 lg:order-2 iso-scene">
              <div className="transform scale-75 md:scale-100 transition-transform duration-500">
                <div className="iso-plane">
                  <div className="absolute inset-0 bg-brand-50/80 border-4 border-brand-200 grid grid-cols-4 grid-rows-4 shadow-xl">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="border border-brand-100"></div>
                    ))}
                  </div>

                  {cubes.map(c => (
                    <div key={c.label} className={`cube ${c.anim}`} style={{ top: c.top, left: c.left, zIndex: c.z }}>
                      <div className={`cube-face cube-face--top ${c.textClass}`}>{c.label}</div>
                      <div className="cube-face cube-face--front"></div>
                      <div className="cube-face cube-face--right"></div>
                    </div>
                  ))}

                  <div className="absolute top-[40%] left-[40%] w-[60px] h-[60px] bg-brand-900 opacity-20 blur-md"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-10">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center font-mono text-xs text-slate-400 mb-6 tracking-widest uppercase">Powering logistics for</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {proofLogos.map(l => (
                <div key={l.name} className="flex items-center gap-2 font-bold text-xl">{l.shape} {l.name}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="py-20 md:py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:mb-24 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Modular Infrastructure</h2>
              <div className="w-24 h-2 bg-brand-500 mx-auto md:mx-0"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(s => (
                <div key={s.title} className="block-card bg-white p-8 group cursor-pointer shadow-block hover:shadow-block-hover">
                  <div className="w-14 h-14 bg-brand-50 border-2 border-brand-600 mb-6 flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                    <i data-lucide={s.icon} className="w-7 h-7 text-brand-700 group-hover:text-white"></i>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{s.desc}</p>
                  <div className="border-t border-slate-100 pt-4 mt-auto">
                    <span className="font-mono text-xs font-bold text-brand-600 flex items-center gap-2">
                      {s.cta} <i data-lucide="arrow-right" className="w-3 h-3 transition-transform group-hover:translate-x-1"></i>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Full Stack Logistics</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map(f => (
                  <div key={f.title} className="flex gap-4">
                    <div className="mt-1"><i data-lucide={f.icon} className="text-brand-600"></i></div>
                    <div>
                      <h4 className="font-bold mb-1">{f.title}</h4>
                      <p className="text-sm text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="network" className="order-first lg:order-last">
              <div className="bg-slate-900 rounded-lg border-2 border-slate-700 shadow-2xl font-mono text-sm overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-slate-400 ml-2">node_monitor — bash — 80x24</span>
                </div>
                <div className="p-6 space-y-3 text-slate-300">
                  <p><span className="text-green-400">root@cube-logic:~$</span> ./check_nodes.sh --all</p>
                  <div className="animate-pulse">
                    <p className="text-slate-500">&gt; Pinging Global Mesh...</p>
                  </div>
                  <div className="py-2">
                    {nodeStatuses.map(n => (
                      <div key={n.region} className="flex justify-between border-b border-slate-700 py-1">
                        <span>{n.region}</span>
                        <span className={`${n.color} font-bold`}>{n.status}</span>
                      </div>
                    ))}
                  </div>
                  <p><span className="text-green-400">root@cube-logic:~$</span> _</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edge Nodes marquee */}
        <section className="full-bleed-iso bg-slate-900 text-white py-20 md:py-28 overflow-hidden relative border-y-2 border-slate-700">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-brand-400 block mb-3">// EDGE_MAP · 04</span>
              <h2 className="text-3xl md:text-4xl font-extrabold">Eight nodes, this minute.</h2>
            </div>
            <p className="text-slate-400 max-w-md md:text-right text-sm">Live snapshots of edge regions piping through the mesh. Hover to halt; every tile is a real cluster on the grid.</p>
          </div>
          <div className="overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-24 md:w-40 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-24 md:w-40 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10"></div>
            <div className="iso-marquee">
              {[...edgeNodes, ...edgeNodes].map((n, i) => {
                const dirCls = { tr: "bg-gradient-to-tr", bl: "bg-gradient-to-bl", t: "bg-gradient-to-t", r: "bg-gradient-to-r" }[n.dir];
                return (
                  <figure key={`n-${i}`} aria-hidden={i >= edgeNodes.length ? "true" : undefined} className={`shrink-0 ${n.w} bg-slate-800 border-2 border-slate-700 hover:border-brand-400 transition-colors overflow-hidden`}>
                    <div className="relative h-44">
                      <img alt={i < edgeNodes.length ? `Node ${n.region}` : ""} className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-65" src={n.img} />
                      <div className={`absolute inset-0 ${dirCls} ${n.grad}`}></div>
                      <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 font-mono text-[10px] tracking-widest ${n.statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${n.live ? `${n.statusColor.replace("text", "bg")} node-pulse` : n.statusColor.replace("text", "bg")}`}></span>{n.status}
                      </div>
                      <div className="absolute top-3 right-3 bg-brand-600 text-white px-2 py-0.5 font-mono text-[10px] tracking-widest">{n.id}</div>
                    </div>
                    <figcaption className="p-4 flex justify-between items-end">
                      <div>
                        <div className="font-mono font-bold text-sm">{n.region}</div>
                        <div className="text-xs text-slate-400">{n.city}</div>
                      </div>
                      <span className={`font-mono text-xs ${n.racksColor}`}>{n.racks}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-20 md:py-28 bg-surface" id="cases">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 md:mb-24">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-brand-600 block mb-3">// CASE_STUDIES · 05</span>
              <h2 className="text-3xl md:text-4xl font-extrabold">Real shipments, real grid.</h2>
            </div>
            <div className="flex flex-col gap-20 md:gap-28">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <figure className="md:col-span-7 relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-brand-200 -z-10"></div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 border-2 border-brand-600 -z-10"></div>
                  <div className="relative aspect-[16/10] overflow-hidden border-2 border-slate-900 shadow-block">
                    <img alt="Atlas Distribution" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1400&q=85&auto=format&fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                    <span className="absolute top-4 left-4 bg-white text-slate-900 font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-slate-900">CASE · 01</span>
                    <span className="absolute bottom-4 right-4 bg-brand-600 text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1.5">+47% throughput</span>
                  </div>
                </figure>
                <div className="md:col-span-5">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-brand-600 block mb-3">CASE 01 — ATLAS</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Same-day grocery, six metros.</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">Atlas moved 41,000 SKUs onto the iso-plane in eleven weeks. Their dispatch routes self-rebalanced overnight; same-day delivery hit 98.7% by week four.</p>
                  <dl className="grid grid-cols-3 gap-3 border-t-2 border-slate-200 pt-5">
                    <div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Throughput</dt><dd className="font-extrabold text-2xl text-brand-600 mt-1">+47%</dd></div>
                    <div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Drift</dt><dd className="font-extrabold text-2xl text-slate-900 mt-1">0.2%</dd></div>
                    <div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Migration</dt><dd className="font-extrabold text-2xl text-slate-900 mt-1">11w</dd></div>
                  </dl>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <div className="md:col-span-5 md:order-1 order-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-brand-600 block mb-3">CASE 02 — GLOBEX</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Cross-border, near-zero loss.</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">Globex's bonded warehouses across four customs zones now hand off via ledger-signed manifests. Lost-in-transit incidents dropped from 4.1% to 0.04% — a 99.0% reduction in the first quarter.</p>
                  <ul className="space-y-2.5 text-sm">
                    {["4 customs zones · 12 warehouses", "Ledger-signed handoff at every node", "Compliance audit · zero findings"].map((b) => (
                      <li key={b} className="flex items-start gap-3"><i data-lucide="check" className="text-brand-600 w-4 h-4 mt-1 shrink-0"></i> {b}</li>
                    ))}
                  </ul>
                </div>
                <figure className="md:col-span-7 md:order-2 order-1 relative">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-brand-200 -z-10"></div>
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 border-2 border-brand-600 -z-10"></div>
                  <div className="relative aspect-[16/10] overflow-hidden border-2 border-slate-900 shadow-block">
                    <img alt="Globex Bonded" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1494412651409-8dd6494dc6ad?w=1400&q=85&auto=format&fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-bl from-slate-900/60 via-transparent to-brand-600/15"></div>
                    <span className="absolute top-4 right-4 bg-white text-slate-900 font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-slate-900">CASE · 02</span>
                    <span className="absolute bottom-4 left-4 bg-slate-900 text-brand-300 font-mono text-xs font-bold uppercase tracking-widest px-3 py-1.5">−99% loss</span>
                  </div>
                </figure>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <figure className="md:col-span-7 relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-brand-200 -z-10"></div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 border-2 border-brand-600 -z-10"></div>
                  <div className="relative aspect-[16/10] overflow-hidden border-2 border-slate-900 shadow-block">
                    <img alt="Massive Auto Parts" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1400&q=85&auto=format&fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/65 via-transparent to-transparent"></div>
                    <span className="absolute top-4 left-4 bg-white text-slate-900 font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-slate-900">CASE · 03</span>
                    <span className="absolute bottom-4 right-4 bg-brand-600 text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1.5">42min → 6min</span>
                  </div>
                </figure>
                <div className="md:col-span-5">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-brand-600 block mb-3">CASE 03 — MASSIVE</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Auto parts, eight time zones.</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">Massive consolidated 14 dealer hubs into a single isometric warehouse plane. Order-to-line-side dropped from 42 minutes to under 6 — and the dashboard still fits on one screen.</p>
                  <a className="inline-flex items-center gap-2 font-mono text-sm font-bold text-brand-600 border-b-2 border-brand-600 pb-1 hover:gap-3 transition-all" href="#">Read the post-mortem <i data-lucide="arrow-right" className="w-4 h-4"></i></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles doctrine */}
        <section className="full-bleed-iso py-20 md:py-28 bg-white border-y-2 border-slate-200" id="principles">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <aside className="lg:col-span-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-brand-600 block mb-3">// PRINCIPLES · 06</span>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Five rules<br />the grid runs on.</h2>
              <p className="text-slate-600 mt-5">Pulled from 240 onboarding interviews. The teams who scale past 10 nodes always settle into these five.</p>
              <a className="mt-8 inline-flex items-center gap-2 font-mono text-sm font-bold border-2 border-slate-900 px-5 py-2.5 hover:bg-slate-900 hover:text-white transition-colors" href="#">READ_HANDBOOK <i data-lucide="arrow-right" className="w-4 h-4"></i></a>
            </aside>
            <ol className="lg:col-span-8 divide-y-2 divide-slate-200 border-y-2 border-slate-200">
              {principles.map((p, i) => (
                <li key={i} className="grid grid-cols-12 gap-4 py-6 hover:bg-brand-50/30 transition-colors">
                  <span className="col-span-2 lg:col-span-1 font-mono font-extrabold text-3xl text-brand-600 tabular-nums leading-none">{p.i}</span>
                  <div className="col-span-10 lg:col-span-9">
                    <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                    <p className="text-slate-600 text-sm">{p.body}</p>
                  </div>
                  <span className="col-span-12 lg:col-span-2 font-mono text-[10px] uppercase tracking-widest text-slate-500 self-center lg:text-right">[ {p.tag} ]</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-brand-600 block mb-3">// SUPPORT · 07</span>
              <h2 className="text-3xl md:text-4xl font-extrabold">Pre-flight checks.</h2>
              <p className="text-slate-600 mt-3">Things teams ask before flipping the green switch.</p>
            </div>
            <div className="divide-y-2 divide-slate-900/10 border-y-2 border-slate-900/10 bg-white shadow-block">
              {isoFaq.map((f, i) => (
                <details key={i} className="iso-faq group p-5 md:p-6" open={f.open}>
                  <summary className="flex items-center gap-6">
                    <span className="font-mono font-extrabold text-2xl text-brand-600 tabular-nums shrink-0 w-12">{f.i}</span>
                    <h3 className="flex-1 font-bold text-base md:text-lg text-slate-900">{f.q}</h3>
                    <i data-lucide="chevron-right" className="iso-chevron w-5 h-5 text-slate-500 shrink-0"></i>
                  </summary>
                  <p className="pl-16 mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 md:py-32 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Scalable Pricing</h2>
              <p className="text-slate-600 max-w-lg mx-auto">Pay only for the volume you compute. No hidden fees for idle containers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {plans.map(p => (
                <div
                  key={p.tier}
                  className={
                    p.featured
                      ? "bg-white border-2 border-slate-900 p-8 shadow-block relative transform md:-translate-y-4"
                      : "bg-white border-2 border-slate-200 p-8 shadow-sm hover:border-slate-300 transition-colors"
                  }
                >
                  {p.featured && (
                    <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 font-mono">POPULAR</div>
                  )}
                  <h3 className={`font-mono font-bold text-lg mb-2 ${p.titleColor}`}>{p.tier}</h3>
                  <div className="text-4xl font-extrabold mb-6">{p.price}<span className="text-lg text-slate-400 font-normal">{p.per}</span></div>
                  <ul className="space-y-3 text-sm text-slate-600 mb-8">
                    {p.perks.map(perk => (
                      <li key={perk} className="flex gap-2"><i data-lucide="check" className={`w-4 h-4 ${p.checkColor}`}></i> {perk}</li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 ${p.ctaClass}`}>{p.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand-600 flex items-center justify-center text-white text-sm rounded-sm">
                    <i data-lucide="box" className="w-4 h-4"></i>
                  </div>
                  <span className="font-mono font-bold text-xl">CUBE_LOGIC</span>
                </div>
                <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                  Redefining global logistics through geometry and code. We build the blocks that move the world. <br /><br />
                  San Francisco, CA • Dublin, IE
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4 font-mono text-brand-400">PLATFORM</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {platformLinks.map(l => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 font-mono text-brand-400">COMPANY</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {companyLinks.map(l => (
                    <li key={l.label}>
                      <a href="#" className="hover:text-white transition-colors">{l.label}</a>
                      {l.badge && <span className="text-[10px] bg-brand-600 px-1 rounded ml-1">{l.badge}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-mono">
              <p>&copy; 2024 CUBE_LOGIC Inc. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                {footerSocials.map(s => (
                  <a key={s} href="#" className="hover:text-white transition-colors"><i data-lucide={s} className="w-4 h-4"></i></a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
