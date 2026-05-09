export default function T73Abstract3d() {
  const navLinks = [
    { href: "#work", label: "Work" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
  ];

  const features = [
    {
      title: "Immersive UI",
      body: "Interfaces that breathe. We use blur, transparency, and depth to create hierarchy that feels tactile.",
      glow: "bg-pink-500/20 group-hover:bg-pink-500/30",
      iconBg: "from-pink-500 to-purple-600",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />,
    },
    {
      title: "3D Assets",
      body: "Custom WebGL and Three.js implementations. From abstract primitives to complex interactive environments.",
      glow: "bg-blue-500/20 group-hover:bg-blue-500/30",
      iconBg: "from-blue-500 to-indigo-600",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
    },
    {
      title: "Creative Dev",
      body: "Translating complex visual designs into performant, clean code using React, Vue, and WebGL shaders.",
      glow: "bg-purple-500/20 group-hover:bg-purple-500/30",
      iconBg: "from-purple-500 to-pink-600",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    },
  ];

  const projects = [
    { title: "Neon Horizons", subtitle: "WebGL Experience", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000", alt: "Abstract Art" },
    { title: "Glass OS", subtitle: "Dashboard UI Kit", img: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&q=80&w=1000", alt: "3D Shapes" },
  ];

  const stats = [
    { num: "85+", label: "Projects" },
    { num: "12", label: "Awwwards" },
    { num: "100%", label: "Satisfaction" },
  ];

  const testimonials = [
    { quote: "Dimension Labs transformed our flat SaaS platform into a spatial experience. The user engagement metrics doubled in the first month.", name: "Alex V.", role: "CTO, FutureScale", grad: "from-blue-400 to-cyan-300" },
    { quote: "The glassmorphism aesthetic they delivered is absolutely stunning. It feels like software from 2030.", name: "Sarah J.", role: "Product Lead, Aura", grad: "from-purple-400 to-pink-300" },
  ];

  const sitemap = [
    { href: "#work", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ];
  const socials = ["Instagram", "Twitter / X", "Dribbble", "LinkedIn"];
  const cubeFaces = ["front", "back", "right", "left", "top", "bottom"];

  return (
    <>
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Spline+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: {
                display: ['Outfit', 'sans-serif'],
                body: ['Spline Sans', 'sans-serif'],
              },
              colors: {
                glass: 'rgba(255, 255, 255, 0.05)',
                glassBorder: 'rgba(255, 255, 255, 0.2)',
                accent: '#d946ef',
              },
              backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
              }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          background-image: linear-gradient(135deg, #1a0b2e 0%, #431668 40%, #2b3896 70%, #d946ef 100%);
          background-size: 400% 400%;
          animation: gradientBG 20s ease infinite;
          color: white;
          overflow-x: hidden;
          min-height: 100vh;
        }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glass-nav { background: rgba(15, 12, 41, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
        .glass-card { background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.3s ease; }
        .glass-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px 0 rgba(0, 0, 0, 0.5); border-color: rgba(255, 255, 255, 0.4); }
        .glass-input { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: white; transition: all 0.3s ease; }
        .glass-input:focus { background: rgba(0, 0, 0, 0.4); border-color: rgba(217, 70, 239, 0.5); outline: none; box-shadow: 0 0 15px rgba(217, 70, 239, 0.2); }
        .shine-effect { position: relative; overflow: hidden; }
        .shine-effect::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent); transform: skewX(-25deg); transition: 0.5s; }
        .shine-effect:hover::after { left: 150%; transition: 0.7s ease-in-out; }
        .text-gradient { background: linear-gradient(to right, #fff, #f0abfc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .floating-shape { position: absolute; z-index: 0; pointer-events: none; animation: float 8s ease-in-out infinite; }
        .shape-orb { border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.05) 60%, transparent 80%); box-shadow: 0 0 30px rgba(255,255,255,0.1); }
        .shape-donut { border-radius: 50%; border: 15px solid rgba(255,255,255,0.05); box-shadow: 0 0 20px rgba(255,255,255,0.1); animation: float 10s ease-in-out infinite, rotateSlow 20s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scene { width: 260px; height: 260px; perspective: 1000px; margin: 0 auto; }
        @media (min-width: 768px) { .scene { width: 320px; height: 320px; } }
        .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; animation: rotateCube 18s infinite linear; }
        .cube__face { position: absolute; width: 100%; height: 100%; border: 2px solid rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(217, 70, 239, 0.15); }
        .cube__face--front  { transform: rotateY(  0deg) translateZ(130px); }
        .cube__face--right  { transform: rotateY( 90deg) translateZ(130px); }
        .cube__face--back   { transform: rotateY(180deg) translateZ(130px); }
        .cube__face--left   { transform: rotateY(-90deg) translateZ(130px); }
        .cube__face--top    { transform: rotateX( 90deg) translateZ(130px); }
        .cube__face--bottom { transform: rotateX(-90deg) translateZ(130px); }
        @media (min-width: 768px) {
          .cube__face--front  { transform: rotateY(  0deg) translateZ(160px); }
          .cube__face--right  { transform: rotateY( 90deg) translateZ(160px); }
          .cube__face--back   { transform: rotateY(180deg) translateZ(160px); }
          .cube__face--left   { transform: rotateY(-90deg) translateZ(160px); }
          .cube__face--top    { transform: rotateX( 90deg) translateZ(160px); }
          .cube__face--bottom { transform: rotateX(-90deg) translateZ(160px); }
        }
        .cube-inner { width: 50%; height: 50%; position: absolute; top: 25%; left: 25%; transform-style: preserve-3d; animation: rotateCubeReverse 12s infinite linear; }
        .cube-inner .cube__face { background: rgba(217, 70, 239, 0.2); border: 1px solid rgba(255,255,255,0.6); }
        .cube-inner .cube__face--front  { transform: rotateY(  0deg) translateZ(65px); }
        .cube-inner .cube__face--right  { transform: rotateY( 90deg) translateZ(65px); }
        .cube-inner .cube__face--back   { transform: rotateY(180deg) translateZ(65px); }
        .cube-inner .cube__face--left   { transform: rotateY(-90deg) translateZ(65px); }
        .cube-inner .cube__face--top    { transform: rotateX( 90deg) translateZ(65px); }
        .cube-inner .cube__face--bottom { transform: rotateX(-90deg) translateZ(65px); }
        @media (min-width: 768px) {
          .cube-inner .cube__face--front  { transform: rotateY(  0deg) translateZ(80px); }
          .cube-inner .cube__face--right  { transform: rotateY( 90deg) translateZ(80px); }
          .cube-inner .cube__face--back   { transform: rotateY(180deg) translateZ(80px); }
          .cube-inner .cube__face--left   { transform: rotateY(-90deg) translateZ(80px); }
          .cube-inner .cube__face--top    { transform: rotateX( 90deg) translateZ(80px); }
          .cube-inner .cube__face--bottom { transform: rotateX(-90deg) translateZ(80px); }
        }
        @keyframes rotateCube { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); } }
        @keyframes rotateCubeReverse { 0% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); } 100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } }
      ` }} />

      <div className="scroll-smooth font-body selection:bg-pink-500 selection:text-white">

        <div className="floating-shape shape-orb w-64 h-64 top-[-50px] left-[-50px] opacity-40 blur-3xl"></div>
        <div className="floating-shape shape-orb w-48 h-48 bottom-[10%] right-[-20px] opacity-30 blur-2xl"></div>
        <div className="floating-shape shape-donut w-32 h-32 top-[20%] right-[10%] opacity-20 border-white/20"></div>

        <nav className="fixed w-full z-50 top-0 left-0 transition-all duration-300" id="navbar">
          <div className="glass-nav px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <a href="#" className="font-display font-bold text-2xl tracking-widest relative z-50">
                DIMENSION_<span className="text-pink-400">LABS</span>
              </a>
              <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} className="hover:text-pink-300 transition-colors opacity-80 hover:opacity-100">{l.label}</a>
                ))}
                <a href="#contact" className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full text-white transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">Start Project</a>
              </div>
              <button id="menu-btn" className="md:hidden z-50 focus:outline-none">
                <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></div>
                <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></div>
                <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
              </button>
            </div>
          </div>
          <div id="mobile-menu" className="fixed inset-0 bg-[#0f0c29]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 opacity-0 pointer-events-none transition-opacity duration-300">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-2xl font-display font-bold hover:text-pink-400 mobile-link">{l.label}</a>
            ))}
            <a href="#contact" className="text-xl font-bold border border-white/20 px-8 py-3 rounded-full hover:bg-white/10 mobile-link">Let's Talk</a>
          </div>
        </nav>

        <section className="relative z-10 min-h-screen flex items-center justify-center pt-28 pb-16 px-6">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full border border-pink-400/30 bg-pink-500/10 text-pink-300 text-xs font-bold tracking-[0.2em] uppercase mb-2 animate-pulse">Next Gen Web Design</div>
              <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.1] tracking-tight">
                Shaping <br />
                <span className="text-gradient filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Abstract</span> <br />
                Reality.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
                We break the 2D barrier. Crafting immersive digital experiences with depth, physics, and glassmorphism that defy conventional layout rules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#work" className="shine-effect bg-white text-[#1a0b2e] font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all transform hover:scale-105 text-center">View Work</a>
                <a href="#contact" className="px-8 py-4 rounded-full border border-white/30 hover:bg-white/10 transition-all font-medium backdrop-blur-sm text-center">Contact Us</a>
              </div>
              <div className="pt-8 border-t border-white/10 mt-8">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Trusted by innovators</p>
                <div className="flex gap-6 justify-center lg:justify-start opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <svg className="h-6 w-auto" viewBox="0 0 100 30" fill="currentColor"><path d="M10,15 L20,5 L30,15 L20,25 Z M40,5 H50 V25 H40 Z M60,5 H80 V10 H65 V12 H75 V17 H65 V25 H60 Z" /></svg>
                  <svg className="h-6 w-auto" viewBox="0 0 100 30" fill="currentColor"><circle cx="15" cy="15" r="10" /><rect x="35" y="5" width="20" height="20" /><rect x="65" y="5" width="20" height="20" /></svg>
                  <svg className="h-6 w-auto" viewBox="0 0 100 30" fill="currentColor"><path d="M10,25 L20,5 L30,25 M45,5 L45,25 M60,5 L80,5 M60,15 L75,15 M60,25 L80,25" /></svg>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center order-1 lg:order-2 relative h-[300px] md:h-[400px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"></div>
              <div className="scene">
                <div className="cube">
                  <div className="cube__face cube__face--front">DIM</div>
                  <div className="cube__face cube__face--back">LABS</div>
                  <div className="cube__face cube__face--right">3D</div>
                  <div className="cube__face cube__face--left">WEB</div>
                  <div className="cube__face cube__face--top"></div>
                  <div className="cube__face cube__face--bottom"></div>
                  <div className="cube-inner">
                    {cubeFaces.map((f) => (
                      <div key={f} className={`cube__face cube__face--${f}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY — studio + agency brands */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-white/50 uppercase tracking-[0.4em] text-[10px] font-medium mb-8">— Built &amp; rendered with —</p>
            <ul role="list" className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-x-8 gap-y-9 items-center justify-items-center glass-panel rounded-2xl px-6 py-8">
              {[
                { slug: "blender", name: "Blender" },
                { slug: "figma", name: "Figma" },
                { slug: "framer", name: "Framer" },
                { slug: "sketchfab", name: "Sketchfab" },
                { slug: "threedotjs", name: "Three.js" },
                { slug: "vercel", name: "Vercel" },
                { slug: "dribbble", name: "Dribbble" },
                { slug: "behance", name: "Behance" },
                { slug: "awwwards", name: "Awwwards" },
              ].map(b => (
                <li key={b.slug} className="flex flex-col items-center gap-2">
                  <img src={`https://cdn.simpleicons.org/${b.slug}/F472B6`} alt={b.name} className="h-7 w-auto" loading="lazy" decoding="async" width="28" height="28" />
                  <span className="font-medium text-[9px] uppercase tracking-[0.2em] text-white/60">{b.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ALTERNATING SECTION A — image LEFT, content RIGHT */}
        <section className="relative z-10 py-20 md:py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="md:col-span-7 relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] glass-panel">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=85&auto=format&fit=crop" alt="Abstract gradient flow — purple, blue and orange volumes" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" width="1400" height="1050" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0f0c29]/55 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  <span className="font-medium text-[10px] uppercase tracking-[0.3em] text-white/85">Render · 18 / chapter</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.4em] text-pink-300 font-semibold mb-4">// CHAPTER A · MODEL</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-[1.05] tracking-tight mb-5 border-l-2 border-pink-400 pl-4">Volumes, not vibes.</h2>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 font-light">Every campaign begins as a Blender scene — meshes, lights, materials, all named, all versioned. Brand colour calibrated against the camera, not the hex code. Renders are signed off in raw EXR.</p>
              <p className="text-white/65 text-sm md:text-base leading-relaxed mb-6 font-light">No stock matcap shaders. No "AI-generated abstracts". The mesh ships with the deck — the buyer sees the file behind the frame.</p>
              <ul className="flex flex-col gap-3 font-medium text-[11px] uppercase tracking-[0.25em] text-white/75 border-t border-white/10 pt-5">
                <li className="flex justify-between"><span>Renders · per chapter</span><span className="text-pink-300">18</span></li>
                <li className="flex justify-between"><span>Pass · raw EXR</span><span className="text-pink-300">Sign-off</span></li>
                <li className="flex justify-between"><span>File · ships with deck</span><span className="text-pink-300">Always</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ALTERNATING SECTION B — image RIGHT, content LEFT */}
        <section className="relative z-10 py-20 md:py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1">
              <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-300 font-semibold mb-4 md:text-right">// CHAPTER B · CAST</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-[1.05] tracking-tight mb-5 border-r-2 border-cyan-400 pr-4 md:text-right">A cast made, not photographed.</h2>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 md:text-right font-light">Characters are sculpted in Blender, posed in ZBrush, lit by hand. Every figure carries an internal armature, every fabric a real cloth simulation. The camera observes — it never invents.</p>
              <p className="text-white/65 text-sm md:text-base leading-relaxed mb-6 md:text-right font-light">No deepfake heads. No "AI-actor" sleight-of-hand. The cast file ships open; you can re-pose any figure on commission and re-render at any resolution.</p>
              <ul className="flex flex-col gap-3 font-medium text-[11px] uppercase tracking-[0.25em] text-white/75 border-t border-white/10 pt-5">
                <li className="flex justify-between"><span className="text-cyan-300">Sculpt · ZBrush</span><span>Pose · keyframed</span></li>
                <li className="flex justify-between"><span className="text-cyan-300">Cloth · simulated</span><span>Frames · 240</span></li>
                <li className="flex justify-between"><span className="text-cyan-300">File · open</span><span>Re-pose · on demand</span></li>
              </ul>
            </div>
            <div className="md:col-span-7 relative order-1 md:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] glass-panel">
                <img src="https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=1400&q=85&auto=format&fit=crop" alt="3D-rendered red figure — abstract character study under directional light" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" width="1400" height="1050" />
                <div className="absolute inset-0 bg-gradient-to-tl from-[#0f0c29]/55 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-5 right-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span className="font-medium text-[10px] uppercase tracking-[0.3em] text-white/85">Cast · 6 figures</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DOCTRINE — Premium 2x2 with abstract gradient backdrop, masked-fade transitions */}
        <section className="relative z-10 py-40 md:py-56 px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80&auto=format&fit=crop" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-[0.32] saturate-[1.1]" loading="lazy" style={{ WebkitMaskImage: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 18%, black 38%, black 62%, rgba(0,0,0,0.4) 82%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 18%, black 38%, black 62%, rgba(0,0,0,0.4) 82%, transparent 100%)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, transparent 30%, rgba(15,12,41,0.55) 100%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 22%, black 78%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, black 22%, black 78%, transparent 100%)" }}></div>
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-500/[0.08] blur-3xl"></div>
            <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.08] blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.4em] text-pink-300 font-semibold">// § Studio doctrine</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4 leading-[1.05] tracking-tight">Four rules of the render.</h2>
              <p className="text-white/70 mt-5 leading-relaxed font-light">Pinned above the bench, signed by the studio, kept since 2018.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
              {[
                { id: "D · 01", glowBg: "bg-pink-500/[0.12]", iconBorder: "border-pink-300/40 bg-pink-400/10 text-pink-300", borderHover: "hover:border-pink-400/40", title: "Owned files, always.", body: "Every commission ships with the .blend, the textures, the LUTs. You re-render at any resolution, re-skin in any colour, re-pose any character — without us in the loop. The mesh is the deliverable.", left: "Source · open", right: "License · perpetual", rightClass: "text-pink-300", iconPath: "M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" },
                { id: "D · 02", glowBg: "bg-cyan-400/[0.12]", iconBorder: "border-cyan-300/40 bg-cyan-400/10 text-cyan-300", borderHover: "hover:border-cyan-400/40", title: "Calibrated colour.", body: "Renders are graded against a calibrated reference monitor — Eizo CG2700X, X-Rite probe, Rec. 2020 working space. The screen-shot you approve is the screen-shot you ship.", left: "Working space · Rec. 2020", right: "Probe · X-Rite", rightClass: "text-cyan-300", iconPath: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 12l2 2 4-4" },
                { id: "D · 03", glowBg: "bg-amber-400/[0.12]", iconBorder: "border-amber-300/40 bg-amber-400/10 text-amber-300", borderHover: "hover:border-amber-400/40", title: "No AI in the pipeline.", body: "Diffusion models stay out of the studio's deliverables. Every form is modelled, every shot is keyframed. We use the latest tools to plan; never to substitute the maker for the algorithm.", left: "Pipeline · human", right: "No diffusion", rightClass: "text-amber-300", iconPath: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
                { id: "D · 04", glowBg: "bg-emerald-400/[0.12]", iconBorder: "border-emerald-300/40 bg-emerald-400/10 text-emerald-300", borderHover: "hover:border-emerald-400/40", title: "Iterate in days, ship in weeks.", body: "Brief on Monday, blockout by Wednesday, first render Friday — final delivery in three weeks for ten frames, six weeks for forty. The cadence is published; the calendar is shared.", left: "Cadence · published", right: "10 frames · 3 wk", rightClass: "text-emerald-300", iconPath: "M3 7.5L7.5 3M21 16.5l-4.5 4.5M9 12h12" },
              ].map(d => (
                <article key={d.id} className={`relative glass-panel rounded-[2rem] p-7 md:p-9 transition-colors overflow-hidden ${d.borderHover}`}>
                  <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full ${d.glowBg} blur-3xl pointer-events-none`}></div>
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${d.iconBorder}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d.iconPath} /></svg>
                    </div>
                    <span className="font-medium text-[10px] uppercase tracking-[0.4em] text-white/55 tabular-nums">{d.id}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3 leading-[1.05] tracking-tight relative z-10">{d.title}</h3>
                  <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 relative z-10 font-light">{d.body}</p>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-4 font-medium text-[10px] uppercase tracking-[0.3em] text-white/55 relative z-10">
                    <span>{d.left}</span>
                    <span className={d.rightClass}>{d.right}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="relative z-10 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:text-center">
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Our Dimensions</h2>
              <p className="text-white/70 max-w-xl md:mx-auto text-lg font-light">Pushing pixels beyond the 2D plane with cutting-edge technologies.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f) => (
                <div key={f.title} className="glass-card shine-effect rounded-3xl p-8 group cursor-pointer relative overflow-hidden">
                  <div className={`absolute -right-4 -top-4 w-24 h-24 ${f.glow} rounded-full blur-2xl transition-all`}></div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform relative z-10`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">{f.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xs font-bold tracking-widest uppercase text-pink-300 mb-6">Selected Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {projects.map((p) => (
                <div key={p.title} className="glass-card rounded-3xl overflow-hidden group h-64 md:h-80 relative">
                  <img src={p.img} alt={p.alt} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <h4 className="text-2xl font-bold mb-1">{p.title}</h4>
                    <p className="text-sm text-gray-300">{p.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 py-16 px-6">
          <div className="max-w-7xl mx-auto glass-panel rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center text-center gap-8">
            {stats.flatMap((s, i) => {
              const stat = (
                <div key={s.label} className="flex-1">
                  <h3 className="font-display font-black text-4xl md:text-5xl mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{s.num}</h3>
                  <p className="text-pink-200 font-medium uppercase tracking-widest text-xs">{s.label}</p>
                </div>
              );
              return i === 0 ? [stat] : [<div key={`d-${i}`} className="w-full h-px bg-white/10 md:w-px md:h-16"></div>, stat];
            })}
          </div>
        </section>

        <section id="pricing" className="relative z-10 py-24 px-6">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Pricing Plans</h2>
              <p className="text-white/60">Transparent pricing for transparent design.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="glass-card rounded-3xl p-8 hover:bg-white/5 transition-colors">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="text-3xl font-display font-bold mb-6">$1,900</div>
                <ul className="space-y-4 text-sm text-gray-300 mb-8">
                  {["Single Page Landing", "Mobile Responsive", "Basic 3D Assets"].map((it) => (
                    <li key={it} className="flex items-center"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-3"></span>{it}</li>
                  ))}
                </ul>
                <a href="#contact" className="block text-center py-3 rounded-xl border border-white/20 hover:bg-white/10 text-sm font-bold transition-all">Get Started</a>
              </div>
              <div className="glass-card rounded-3xl p-8 bg-white/10 border-pink-500/50 transform md:scale-105 shadow-[0_0_40px_rgba(217,70,239,0.15)] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Popular</div>
                <h3 className="text-xl font-bold mb-2">Studio</h3>
                <div className="text-4xl font-display font-bold mb-6">$4,500</div>
                <p className="text-xs text-white/50 mb-6">Complete brand overhaul.</p>
                <ul className="space-y-4 text-sm text-gray-200 mb-8">
                  {["5-Page Web Experience", "Interactive 3D Elements", "CMS Integration", "Advanced Animations"].map((it) => (
                    <li key={it} className="flex items-center"><span className="w-2 h-2 bg-pink-400 rounded-full mr-3 shadow-[0_0_10px_#f472b6]"></span>{it}</li>
                  ))}
                </ul>
                <a href="#contact" className="block text-center py-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white shadow-lg text-sm font-bold transition-all">Select Plan</a>
              </div>
              <div className="glass-card rounded-3xl p-8 hover:bg-white/5 transition-colors">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-display font-bold mb-6">Custom</div>
                <ul className="space-y-4 text-sm text-gray-300 mb-8">
                  {["WebGL Applications", "Full 3D Environments", "Dedicated Support"].map((it) => (
                    <li key={it} className="flex items-center"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-3"></span>{it}</li>
                  ))}
                </ul>
                <a href="#contact" className="block text-center py-3 rounded-xl border border-white/20 hover:bg-white/10 text-sm font-bold transition-all">Contact Us</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="relative z-10 py-20 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12">
              <div><h2 className="font-display font-bold text-3xl md:text-4xl">Client Voices</h2></div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">&larr;</button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">&rarr;</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="glass-card rounded-2xl p-8">
                  <p className="text-lg italic text-gray-200 mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.grad}`}></div>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-white/50">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative z-10 py-24 px-6">
          <div className="max-w-4xl mx-auto glass-panel rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/20 rounded-full blur-[80px] -z-10"></div>
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-3xl md:text-5xl mb-3">Let's Create Depth</h2>
              <p className="text-white/60">Tell us about your project.</p>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest ml-2 text-pink-200">Name</label>
                  <input type="text" placeholder="John Doe" className="glass-input w-full px-6 py-4 rounded-xl placeholder-white/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest ml-2 text-pink-200">Email</label>
                  <input type="email" placeholder="john@example.com" className="glass-input w-full px-6 py-4 rounded-xl placeholder-white/30" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest ml-2 text-pink-200">Message</label>
                <textarea rows={4} placeholder="Tell us about your vision..." className="glass-input w-full px-6 py-4 rounded-xl placeholder-white/30 resize-none"></textarea>
              </div>
              <button type="button" className="w-full bg-white text-purple-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] transition-all transform hover:scale-[1.01] active:scale-95">Send Message</button>
            </form>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/10 bg-[#0f0c29]/50 backdrop-blur-md pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <a href="#" className="font-display font-bold text-2xl tracking-widest mb-6 block">DIMENSION_<span className="text-pink-400">LABS</span></a>
                <p className="text-white/40 max-w-sm text-sm leading-relaxed">A digital design studio specializing in abstract 3D aesthetics and glassmorphism UI. We build the interfaces of tomorrow, today.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Sitemap</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  {sitemap.map((s) => (
                    <li key={s.href}><a href={s.href} className="hover:text-white transition-colors">{s.label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Socials</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  {socials.map((s) => (
                    <li key={s}><a href="#" className="hover:text-pink-400 transition-colors">{s}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
              <p>&copy; 2024 Dimension Labs. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const btn = document.getElementById('menu-btn');
          const menu = document.getElementById('mobile-menu');
          if (!btn || !menu) return;
          const links = document.querySelectorAll('.mobile-link');
          let isMenuOpen = false;
          btn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
              menu.classList.remove('pointer-events-none', 'opacity-0');
              document.body.style.overflow = 'hidden';
            } else {
              menu.classList.add('pointer-events-none', 'opacity-0');
              document.body.style.overflow = 'auto';
            }
          });
          links.forEach(link => {
            link.addEventListener('click', () => {
              isMenuOpen = false;
              menu.classList.add('pointer-events-none', 'opacity-0');
              document.body.style.overflow = 'auto';
            });
          });
          window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (!nav) return;
            if (window.scrollY > 50) nav.classList.add('shadow-lg');
            else nav.classList.remove('shadow-lg');
          });
        })();
      ` }} />
    </>
  );
}
