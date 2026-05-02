export default function T60AuroraGradients() {
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "Method" },
    { href: "#testimonials", label: "Stories" },
    { href: "#pricing", label: "Pricing" },
  ];

  const logos = [
    { icon: "hexagon", name: "Acme" },
    { icon: "triangle", name: "Vertex" },
    { icon: "circle", name: "Sphere" },
    { icon: "box", name: "Cube" },
  ];

  const features = [
    { icon: "zap", title: "Hyper Focus", desc: "Adaptive binaural beats that adjust in real-time to your workflow, blocking out auditory distractions.", accent: "cyan" },
    { icon: "moon", title: "Deep Sleep", desc: "Psychoacoustic soundscapes designed to lower your heart rate and trigger Delta waves for recovery.", accent: "purple" },
    { icon: "wind", title: "Instant Calm", desc: "Visual breathing guides synchronized with haptic feedback to ground you in moments of stress.", accent: "emerald" },
  ];

  const steps = [
    { n: 1, title: "Connect Your Data", desc: "Sync with Apple Health or Oura to let us read your HRV and stress levels.", color: "cyan", glow: "rgba(34,211,238,0.3)" },
    { n: 2, title: "Select Your State", desc: "Tell the AI if you want to sleep, focus, or recover.", color: "purple", glow: "rgba(192,132,252,0.3)" },
    { n: 3, title: "Immerse", desc: "Put on headphones. The audio evolves as your body reacts.", color: "emerald", glow: "rgba(52,211,153,0.3)" },
  ];

  const monthlyPerks = ["Full Library Access", "Offline Mode"];
  const annualPerks = ["Everything in Monthly", "1-on-1 Coaching Session", "Early Access Features"];

  const tracks = [
    { icon: "zap", title: "Cortex 40Hz", tag: "Focus", meta: "Binaural · Gamma · For deep work", duration: "42:00", grad: "from-cyan-500 to-cyan-700", glow: "rgba(34,211,238,0.25)", tagColor: "text-cyan-300/60", showBars: true, barColor: "text-cyan-400" },
    { icon: "moon", title: "Velvet Tide", tag: "Sleep", meta: "Delta · Ambient · 7 hours unbroken", duration: "7h 12m", grad: "from-purple-500 to-purple-800", glow: "rgba(192,132,252,0.25)", tagColor: "text-purple-300/60" },
    { icon: "wind", title: "Box Breath · 4·7·8", tag: "Calm", meta: "Guided · Haptics · Anxiety reset", duration: "12:00", grad: "from-emerald-500 to-emerald-800", glow: "rgba(52,211,153,0.25)", tagColor: "text-emerald-300/60" },
    { icon: "sunrise", title: "First Light Ritual", tag: "Wake", meta: "Solfeggio · 528Hz · Morning anchor", duration: "18:00", grad: "from-amber-400 to-orange-600", glow: "rgba(251,191,36,0.25)", tagColor: "text-amber-300/60" },
    { icon: "cloud-rain", title: "Hokkaido Rainfall", tag: "Field", meta: "Field recording · 96kHz lossless", duration: "3h 04m", grad: "from-slate-400 to-slate-700", glow: "transparent", tagColor: "text-slate-300/60" }
  ];

  const testimonials = [
    { initials: "MK", name: "Maya K.", role: "Lead Engineer · Series-B Fintech", quote: "Cortex 40Hz replaced my third coffee. I shipped two features in the time it used to take me to context-switch back from Slack. The HRV-aware fades are uncanny.", grad: "from-cyan-400 to-purple-500", shadow: "shadow-cyan-500/20", starColor: "text-cyan-400", meta: "Focus · 184 hr", halo: false },
    { initials: "DJ", name: "Dr. Jonas Reiter", role: "Clinical Psychologist · Berlin", quote: "I prescribe Velvet Tide to insomnia patients before any pharmacology. Sleep onset down 19 minutes on average across 32 cases. The data is — frankly — unusual for a consumer app.", grad: "from-purple-400 to-emerald-500", shadow: "shadow-purple-500/20", starColor: "text-purple-400", meta: "Sleep · 6 mo", halo: true },
    { initials: "RA", name: "Rachel A.", role: "Marathon Coach · NYC", quote: "My athletes use Box Breath before race-day starts. Resting HRV up 12% across the squad. It's the calmest pre-race tent I've ever run.", grad: "from-emerald-400 to-cyan-500", shadow: "shadow-emerald-500/20", starColor: "text-emerald-400", meta: "Calm · Pro", halo: false }
  ];

  const stats = [
    { value: "2.4M", label: "Sessions logged", grad: "from-cyan-300 to-cyan-500" },
    { value: "19 min", label: "Faster sleep onset", grad: "from-purple-300 to-purple-500" },
    { value: "+12%", label: "Average HRV gain", grad: "from-emerald-300 to-emerald-500" },
    { value: "4.9", label: "App Store rating", grad: "from-amber-300 to-orange-500" }
  ];

  const footerLinks = ["Privacy", "Terms", "Contact"];
  const footerSocials = ["instagram", "twitter"];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    fontFamily: { sans: ['DM Sans','sans-serif'], display: ['Outfit','sans-serif'] },
    colors: { deep: '#0F172A', slate: { 850: '#151e32' } },
    animation: {
      'blob': 'blob 20s infinite',
      'float': 'float 6s ease-in-out infinite',
      'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
    },
    keyframes: {
      blob: {
        '0%': { transform: 'translate(0px,0px) scale(1)' },
        '33%': { transform: 'translate(30px,-50px) scale(1.1)' },
        '66%': { transform: 'translate(-20px,20px) scale(0.9)' },
        '100%': { transform: 'translate(0px,0px) scale(1)' },
      },
      float: {
        '0%,100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      }
    }
  } }
};`;

  const customCss = `html { scroll-padding-top: 100px; }
body { background-color: #0F172A; color: white; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.aurora-blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.6;
  border-radius: 50%;
  animation: blob 20s infinite cubic-bezier(0.4,0,0.2,1);
  will-change: transform;
  mix-blend-mode: screen;
}
.glass-panel {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
}
.nav-glass {
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.08);
}
.glass-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.08);
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}
.glass-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); transform: translateY(-4px); }
.glass-card:active { transform: scale(0.98); }
.text-gradient {
  background: linear-gradient(to right, #22d3ee, #c084fc, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (max-width: 767px) {
  .mobile-menu-container {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .mobile-menu-container.open { grid-template-rows: 1fr; }
}
.mobile-menu-inner { overflow: hidden; opacity: 0; transition: opacity 0.3s ease; }
.mobile-menu-container.open .mobile-menu-inner { opacity: 1; }
.track-row { transition: background 0.25s ease, transform 0.25s ease; }
.track-row:hover { background: rgba(255,255,255,0.04); transform: translateX(4px); }
.track-row .play-bars span {
  display: inline-block; width: 2px; margin-right: 2px; background: currentColor;
  transform-origin: bottom; animation: track-bars 1.4s ease-in-out infinite;
}
.track-row .play-bars span:nth-child(2) { animation-delay: 0.2s; height: 8px; }
.track-row .play-bars span:nth-child(3) { animation-delay: 0.4s; height: 14px; }
.track-row .play-bars span:nth-child(4) { animation-delay: 0.6s; height: 6px; }
.track-row .play-bars span:nth-child(1) { height: 10px; }
@keyframes track-bars {
  0%,100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}
.testimonial-card {
  background: linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  backdrop-filter: blur(28px) saturate(140%);
  -webkit-backdrop-filter: blur(28px) saturate(140%);
  border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.3s ease, transform 0.3s ease;
}
.testimonial-card:hover { border-color: rgba(255,255,255,0.18); transform: translateY(-3px); }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0F172A; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }`;

  const initScript = `(function init(){
  if (typeof lucide === 'undefined' || !lucide.createIcons) { setTimeout(init, 50); return; }
  lucide.createIcons();
  var menuBtn = document.getElementById('menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var navbar = document.getElementById('navbar');
  var isOpen = false;
  function setMenuIcon(name){
    if (!menuBtn) return;
    menuBtn.innerHTML = '<i data-lucide="' + name + '" class="w-6 h-6"></i>';
    lucide.createIcons();
  }
  function toggleMenu(){
    isOpen = !isOpen;
    if (!mobileMenu || !navbar) return;
    if (isOpen) {
      mobileMenu.classList.add('open');
      mobileMenu.classList.remove('border-transparent');
      mobileMenu.classList.add('border-white/10');
      navbar.classList.add('border-white/20', 'bg-slate-900/90');
      setMenuIcon('x');
    } else {
      mobileMenu.classList.remove('open');
      mobileMenu.classList.add('border-transparent');
      mobileMenu.classList.remove('border-white/10');
      navbar.classList.remove('bg-slate-900/90');
      setMenuIcon('menu');
    }
  }
  function closeMenu(){ if (isOpen) toggleMenu(); }
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('[data-mobile-link]').forEach(function(l){ l.addEventListener('click', closeMenu); });
  window.addEventListener('scroll', function(){
    if (!isOpen && navbar) {
      if (window.scrollY > 50) navbar.classList.add('bg-deep/80','shadow-lg');
      else navbar.classList.remove('bg-deep/80','shadow-lg');
    }
  });
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;400;500;600&family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="scroll-smooth font-sans relative min-h-screen bg-deep text-white">
        {/* Aurora background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="aurora-blob w-64 h-64 md:w-[600px] md:h-[600px] bg-purple-600/40 top-[-10%] left-[-10%] animate-blob"></div>
          <div className="aurora-blob w-72 h-72 md:w-[700px] md:h-[700px] bg-cyan-600/40 top-[20%] right-[-20%] animate-blob" style={{ animationDelay: "-5s" }}></div>
          <div className="aurora-blob w-64 h-64 md:w-[500px] md:h-[500px] bg-emerald-600/40 bottom-[-10%] left-[20%] animate-blob" style={{ animationDelay: "-10s" }}></div>
        </div>

        {/* Navbar */}
        <nav className="fixed top-2 md:top-6 left-0 right-0 z-50 px-2 md:px-6">
          <div id="navbar" className="max-w-7xl mx-auto nav-glass rounded-2xl md:rounded-full transition-all duration-300 shadow-2xl shadow-black/20">
            <div className="flex justify-between items-center px-5 py-3 md:py-4">
              <a href="#" data-mobile-link className="flex items-center gap-2 group z-50 relative">
                <div className="bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-lg p-1.5 group-hover:rotate-12 transition-transform">
                  <i data-lucide="waves" className="w-5 h-5 text-white"></i>
                </div>
                <span className="font-display font-bold tracking-widest text-lg text-white">FLOW_STATE</span>
              </a>

              <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300 items-center">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} className="hover:text-white hover:scale-105 transition-all">{l.label}</a>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-4">
                <a href="#" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Log In</a>
                <a href="#" className="bg-white text-deep hover:bg-cyan-50 px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">Get App</a>
              </div>

              <button id="menu-btn" className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50 relative focus:outline-none">
                <i data-lucide="menu" className="w-6 h-6 transition-transform duration-300"></i>
              </button>
            </div>

            <div id="mobile-menu" className="mobile-menu-container md:hidden border-t border-transparent transition-colors duration-300">
              <div className="mobile-menu-inner px-5 pb-6">
                <div className="flex flex-col gap-1 pt-4 text-center">
                  {navLinks.map(l => (
                    <a key={l.href} href={l.href} data-mobile-link className="text-slate-200 hover:text-white hover:bg-white/5 py-3 rounded-xl font-medium text-lg transition-colors">{l.label}</a>
                  ))}
                  <div className="h-px bg-white/10 w-full my-3"></div>
                  <div className="flex gap-4">
                    <button className="flex-1 py-3 text-slate-300 font-medium hover:text-white transition-colors">Log In</button>
                    <button className="flex-1 bg-white text-deep py-3 rounded-xl font-bold shadow-lg">Get Started</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex flex-col items-center relative z-10">
          {/* Hero */}
          <section className="min-h-[100dvh] flex flex-col justify-center items-center text-center px-4 relative w-full max-w-7xl mx-auto pt-24 pb-12">
            <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-float">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-emerald-100 uppercase">Version 2.0 Live</span>
            </div>

            <h1 className="font-display font-medium text-5xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tight mb-6 leading-[1.1] md:leading-[0.95]">
              Find Your <br />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">Center</span>
            </h1>

            <p className="max-w-md md:max-w-2xl text-base md:text-xl text-slate-400 font-light mb-10 leading-relaxed px-4">
              Disconnect from the noise. Reconnect with yourself through biometrically tailored soundscapes and visual breathwork.
            </p>

            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 px-6 sm:px-0">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-deep rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] text-lg">Start Free Trial</button>
              <button className="w-full sm:w-auto px-8 py-4 glass-panel rounded-full font-medium hover:bg-white/10 active:bg-white/20 transition-all flex items-center justify-center gap-2 text-lg">
                <i data-lucide="play-circle" className="w-5 h-5"></i>
                Watch Demo
              </button>
            </div>

            <div className="mt-16 md:mt-24 w-full px-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-6 font-semibold">Trusted by mindful teams at</p>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {logos.map(l => (
                  <div key={l.name} className="flex items-center gap-2">
                    <i data-lucide={l.icon} className="w-5 h-5"></i>
                    <span className="font-display font-bold text-lg">{l.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Designed for <span className="text-gradient">Deep Work</span></h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">Three core modes to shift your mental state instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              {features.map(f => (
                <div key={f.title} className="glass-card p-6 md:p-8 rounded-3xl group">
                  <div className={`w-12 h-12 rounded-2xl bg-${f.accent}-500/10 flex items-center justify-center mb-6 border border-${f.accent}-500/20 text-${f.accent}-400 group-hover:scale-110 transition-transform`}>
                    <i data-lucide={f.icon} className="w-6 h-6"></i>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl mb-3">{f.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20">
            <div className="glass-panel rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="w-full lg:w-1/2">
                  <h2 className="font-display text-3xl md:text-5xl font-bold mb-8">The Flow <span className="text-gradient">Method</span></h2>

                  <div className="space-y-8 relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10"></div>
                    {steps.map(s => (
                      <div key={s.n} className="relative flex gap-6">
                        <div className={`w-8 h-8 rounded-full bg-deep border border-${s.color}-500/50 flex items-center justify-center z-10 text-${s.color}-400 font-bold text-sm`} style={{ boxShadow: `0 0 15px ${s.glow}` }}>{s.n}</div>
                        <div>
                          <h4 className="text-lg md:text-xl font-bold mb-2">{s.title}</h4>
                          <p className="text-slate-400 text-sm">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                  <div className="relative w-[260px] h-[480px] bg-slate-900 border-[6px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                    <div className="w-full h-full bg-slate-900 relative flex flex-col items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-deep"></div>
                      <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 blur-[50px] animate-pulse-slow opacity-60"></div>
                      <div className="z-10 text-center px-6">
                        <h5 className="font-display text-2xl font-medium mb-1">Deep Flow</h5>
                        <p className="text-slate-400 text-xs tracking-widest uppercase mb-8">Binaural • 40Hz</p>
                        <div className="flex items-center justify-center gap-6 text-white/80">
                          <i data-lucide="skip-back" className="w-6 h-6"></i>
                          <div className="w-14 h-14 rounded-full bg-white text-deep flex items-center justify-center">
                            <i data-lucide="pause" className="w-6 h-6 fill-current"></i>
                          </div>
                          <i data-lucide="skip-forward" className="w-6 h-6"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Soundscape Library */}
          <section id="library" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-300">Library · 240 Tracks</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight">A library tuned for <span className="text-gradient">every state.</span></h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">From 40Hz binaural beats for executive focus to delta-wave dreamscapes for deep recovery. New tracks land every Friday, mastered by audio engineers who&apos;ve worked with Apple, Headspace, and the BBC.</p>
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <div>
                    <div className="text-3xl font-display font-bold text-white">240</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">Tracks</div>
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-white">8</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">Genres</div>
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-white">∞</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">Pairings</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="glass-panel rounded-3xl p-3 md:p-5 overflow-hidden">
                  <div className="flex items-center justify-between px-3 pt-1 pb-3 border-b border-white/5">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/60"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60"></span>
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-slate-500 font-mono">flow_state · library.fm</span>
                    <i data-lucide="search" className="w-3.5 h-3.5 text-slate-500"></i>
                  </div>

                  <div className="divide-y divide-white/5">
                    {tracks.map(t => (
                      <div key={t.title} className="track-row flex items-center gap-4 px-3 md:px-5 py-3 md:py-4 cursor-pointer">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${t.grad} flex items-center justify-center shrink-0`} style={{ boxShadow: t.glow !== "transparent" ? `0 0 20px ${t.glow}` : "none" }}>
                          <i data-lucide={t.icon} className="w-5 h-5 text-white"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display font-medium text-white text-sm md:text-base truncate">{t.title}</span>
                            <span className={`text-[9px] tracking-widest uppercase ${t.tagColor} font-mono shrink-0`}>{t.tag}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{t.meta}</p>
                        </div>
                        {t.showBars && (
                          <span className={`play-bars ${t.barColor} hidden sm:inline-flex items-end h-4`}>
                            <span></span><span></span><span></span><span></span>
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono tabular-nums w-10 text-right">{t.duration}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-3 md:px-5 py-4 mt-1 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Showing 5 of 240</span>
                    <a href="#" className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1 transition-colors">
                      Browse all
                      <i data-lucide="arrow-right" className="w-3 h-3"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials / Stories */}
          <section id="testimonials" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
            <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Stories from the practice</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 mt-3">Quiet wins, <span className="text-gradient">measurable</span>.</h2>
              <p className="text-slate-400 text-sm md:text-base">Six months of sustained use, in their own words.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {testimonials.map(t => (
                <article key={t.name} className="testimonial-card rounded-3xl p-7 md:p-8 flex flex-col relative overflow-hidden">
                  {t.halo && (
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
                  )}
                  <div className="flex items-center gap-3 mb-5 relative z-10">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-white font-bold text-sm shadow-lg ${t.shadow}`}>{t.initials}</div>
                    <div>
                      <div className="font-display font-medium text-white text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                  <blockquote className="text-slate-200 text-base leading-relaxed mb-6 flex-1 relative z-10">&quot;{t.quote}&quot;</blockquote>
                  <div className="flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
                    <div className={`flex gap-0.5 ${t.starColor}`}>
                      <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                      <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                      <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                      <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                      <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">{t.meta}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/10">
              {stats.map(s => (
                <div key={s.label} className="bg-deep px-6 py-8 md:py-10 text-center">
                  <div className={`font-display text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br ${s.grad}`}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Invest in your <span className="text-white">Mind</span></h2>
              <div className="inline-block px-4 py-1 rounded-full bg-white/5 text-xs font-bold tracking-wide text-slate-300 border border-white/10">7 DAY FREE TRIAL</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="glass-card p-8 rounded-3xl flex flex-col border border-white/5 relative">
                <h3 className="font-display text-2xl font-medium text-slate-300 mb-2">Monthly</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {monthlyPerks.map(p => (
                    <li key={p} className="flex items-center gap-3 text-sm text-slate-300"><i data-lucide="check" className="w-4 h-4 text-emerald-400"></i> {p}</li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-bold text-sm">Start Trial</button>
              </div>

              <div className="glass-card p-8 rounded-3xl flex flex-col relative border-t-2 border-t-cyan-400 bg-white/[0.06]">
                <div className="absolute top-0 right-0 bg-cyan-400 text-deep text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-[22px]">SAVE 50%</div>
                <h3 className="font-display text-2xl font-medium text-white mb-2">Annual</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">$72</span>
                  <span className="text-slate-400">/yr</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {annualPerks.map(p => (
                    <li key={p} className="flex items-center gap-3 text-sm text-white"><i data-lucide="check" className="w-4 h-4 text-cyan-400"></i> {p}</li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl bg-white text-deep hover:bg-cyan-50 transition-colors font-bold text-sm shadow-lg shadow-cyan-500/20">Start Free Trial</button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full border-t border-white/5 bg-deep/90 backdrop-blur-xl mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="flex items-center gap-2">
                    <i data-lucide="waves" className="w-5 h-5 text-cyan-400"></i>
                    <span className="font-display font-bold tracking-widest text-white">FLOW_STATE</span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs">Engineered peace for the modern mind.</p>
                </div>

                <div className="flex gap-8 text-sm text-slate-400">
                  {footerLinks.map(l => (
                    <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
                  ))}
                </div>

                <div className="flex gap-6">
                  {footerSocials.map(s => (
                    <a key={s} href="#" className="text-slate-500 hover:text-white transition-colors"><i data-lucide={s} className="w-5 h-5"></i></a>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] text-slate-600">© 2024 Flow State Inc.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
