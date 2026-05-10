export default function T6290sGrunge() {
  const navLinks = [
    { href: "#music", label: "MUSIC" },
    { href: "#tour", label: "TOUR" },
    { href: "#band", label: "BAND" },
    { href: "#merch", label: "SHOP" },
  ];
  const mobileLabels = ["MUSIC", "TOUR", "BAND", "MERCH"];
  const ransomChars = ["E", "S", "T", ".", "1", "9", "9", "4"];

  const members = [
    { img: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=800&auto=format&fit=crop", alt: "Vocalist — vintage chrome microphone in stage light", caption: "Jax (Vocals/Pain)", outerRotate: "rotate-2 hover:-rotate-1", tape: "-top-4 left-10 w-24 h-8 -rotate-12", captionRotate: "-rotate-2", marginTop: "" },
    { img: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop", alt: "Guitarist — hands on acoustic guitar fretboard", caption: "Sid (Strings/Noise)", outerRotate: "-rotate-3 hover:rotate-1", tape: "-top-4 right-10 w-24 h-8 rotate-45", captionRotate: "rotate-1", marginTop: "mt-8 md:mt-0" },
    { img: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop", alt: "Drummer — drum kit with sticks crossed on snare", caption: "Bones (Drums)", outerRotate: "rotate-1 hover:rotate-3", tape: "-top-4 left-1/2 w-24 h-8 -translate-x-1/2", captionRotate: "-rotate-1", marginTop: "" },
  ];

  const tourDates = [
    { date: "OCT 31", venue: "The Basement, Seattle", soldOut: true },
    { date: "NOV 05", venue: "Rusty Hook, Portland", soldOut: false },
    { date: "NOV 12", venue: "Dive Bar, Chicago", soldOut: false },
    { date: "NOV 20", venue: "CBGB (Ruins), NYC", soldOut: false },
  ];

  const merch = [
    { img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", alt: "T-Shirt", title: "Vintage Tee", price: "$30.00", soldOut: true },
    { img: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop", alt: "Vinyl", title: "LP Vinyl (Red)", price: "$25.00", soldOut: false },
    { img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=800&auto=format&fit=crop", alt: "Cassette — vintage boombox tape deck", title: "Demo Tape", price: "$10.00", soldOut: false },
  ];

  const socials = [
    { icon: "instagram", rotate: "hover:rotate-6" },
    { icon: "twitter", rotate: "hover:-rotate-6" },
    { icon: "youtube", rotate: "hover:rotate-12" },
  ];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    colors: {
      'grunge-black': '#0a0a0a',
      'grunge-charcoal': '#1a1a1a',
      'grunge-gray': '#2b2b2b',
      'grunge-white': '#f2f2f2',
      'grunge-red': '#8B0000',
      'grunge-accent': '#ff3333',
      'paper': '#dcd0c0',
      'paper-dark': '#c5b8a5',
    },
    fontFamily: {
      'glitch': ['"Rubik Glitch"','display'],
      'typewriter': ['"Special Elite"','monospace'],
      'hand': ['"Rock Salt"','cursive'],
    },
    backgroundImage: {
      'noise': "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E')",
    },
    boxShadow: {
      'hard': '5px 5px 0px 0px rgba(0,0,0,1)',
      'hard-white': '4px 4px 0px 0px rgba(255,255,255,1)',
    }
  } }
};`;

  const customCss = `body { background-color: #111; overflow-x: hidden; cursor: crosshair; }
.texture-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 9999;
  mix-blend-mode: overlay;
}
.tape {
  background-color: rgba(255,255,255,0.4);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  backdrop-filter: blur(2px);
  border-left: 1px dashed rgba(255,255,255,0.4);
  border-right: 1px dashed rgba(255,255,255,0.4);
  opacity: 0.8;
  pointer-events: none;
}
.paper-tear {
  background: #dcd0c0;
  clip-path: polygon(0 0, 100% 0, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0 95%);
}
.ransom-word { display: inline-flex; flex-wrap: wrap; gap: 2px; align-items: center; }
.ransom-char { display: inline-block; padding: 2px 5px; font-family: 'Special Elite', monospace; font-weight: 900; text-transform: uppercase; line-height: 1; }
.ransom-char:nth-child(2n) { transform: rotate(3deg) translateY(-2px); background: #f0f0f0; color: #000; }
.ransom-char:nth-child(2n+1) { transform: rotate(-2deg) translateY(1px); background: #0a0a0a; color: #fff; }
.ransom-char:nth-child(3n) { transform: rotate(5deg); background: #8B0000; color: #fff; }
.ransom-char:nth-child(4n) { transform: rotate(-4deg); font-size: 1.1em; background: #dcd0c0; color: #000; }
.grunge-img { filter: grayscale(100%) contrast(150%) brightness(90%); mix-blend-mode: luminosity; transition: all 0.4s ease; }
.group:hover .grunge-img { filter: grayscale(0%) contrast(120%) brightness(100%) sepia(30%); mix-blend-mode: normal; }
@keyframes flicker {
  0% { opacity: 1; }
  5% { opacity: 0.3; }
  10% { opacity: 1; }
  15% { opacity: 1; }
  20% { opacity: 0.1; }
  25% { opacity: 1; }
  100% { opacity: 1; }
}
.animate-flicker { animation: flicker 4s infinite; }
.glitch-hover:hover { animation: glitch-anim 0.3s cubic-bezier(.25,.46,.45,.94) both infinite; color: #ff3333; }
@keyframes glitch-anim {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 2px) }
  40% { transform: translate(-2px, -2px) }
  60% { transform: translate(2px, 2px) }
  80% { transform: translate(2px, -2px) }
  100% { transform: translate(0) }
}
#mobile-menu { transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
#mobile-menu.open { transform: translateX(0); }`;

  const initScript = `(function init(){
  if (typeof lucide === 'undefined' || !lucide.createIcons) { setTimeout(init, 50); return; }
  lucide.createIcons();
  var menuBtn = document.getElementById('menu-btn');
  var closeBtn = document.getElementById('close-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  function toggleMenu(){
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('overflow-hidden');
  }
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-link').forEach(function(l){ l.addEventListener('click', toggleMenu); });
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Rubik+Glitch&family=Special+Elite&family=Rock+Salt&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="text-grunge-white font-typewriter selection:bg-grunge-red selection:text-white">
        <div className="texture-overlay" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.35%22/%3E%3C/svg%3E')" }}></div>

        <nav className="fixed top-0 w-full z-50 p-4 mix-blend-difference pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
            <a href="#" className="group relative">
              <div className="absolute inset-0 bg-grunge-red blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <i data-lucide="zap" className="relative text-white w-10 h-10 rotate-12 drop-shadow-[2px_2px_0_rgba(255,0,0,1)]"></i>
            </a>

            <ul className="hidden md:flex space-x-12 text-xl font-bold tracking-widest">
              {navLinks.map(l => (
                <li key={l.href}><a href={l.href} className="hover:text-grunge-red hover:underline decoration-4 decoration-grunge-red underline-offset-4 transition-all">{l.label}</a></li>
              ))}
            </ul>

            <button id="menu-btn" className="md:hidden pointer-events-auto bg-grunge-white text-black p-2 transform -rotate-3 shadow-hard border-2 border-black">
              <i data-lucide="menu" className="w-8 h-8"></i>
            </button>
          </div>
        </nav>

        <div id="mobile-menu" className="fixed inset-0 z-40 bg-grunge-charcoal flex flex-col items-center justify-center space-y-8 md:hidden border-l-8 border-grunge-red">
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
          <button id="close-btn" className="absolute top-6 right-6 text-white hover:text-grunge-red">
            <i data-lucide="x" className="w-12 h-12"></i>
          </button>
          {mobileLabels.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="mobile-link text-5xl font-glitch text-white hover:text-grunge-red">{l}</a>
          ))}
        </div>

        <header className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 grayscale contrast-125" alt="Concert Atmosphere" />
            <div className="absolute inset-0 bg-gradient-to-t from-grunge-black via-transparent to-black opacity-90"></div>
          </div>

          <div className="relative z-10 text-center px-4 w-full max-w-7xl">
            <div className="mb-6 flex justify-center transform -rotate-2">
              <div className="ransom-word text-2xl md:text-4xl shadow-xl">
                {ransomChars.map((c, i) => (
                  <span key={i} className="ransom-char">{c}</span>
                ))}
              </div>
            </div>

            <h1 className="text-[15vw] md:text-[10rem] leading-[0.8] font-glitch text-transparent bg-clip-text bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80')] stroke-white drop-shadow-[8px_8px_0_rgba(139,0,0,0.8)] animate-flicker">
              NOISE<br />_FLOOR
            </h1>

            <p className="mt-8 text-xl md:text-3xl font-hand text-grunge-white transform rotate-1">
              "We play loud because we can't scream any harder."
            </p>

            <div className="mt-12 flex flex-col md:flex-row justify-center gap-6 items-center">
              <a href="#music" className="w-64 bg-grunge-white text-black py-4 px-8 text-xl font-bold hover:bg-grunge-red hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-hard border-2 border-black text-center">LATEST SINGLE</a>
              <span className="text-sm font-typewriter opacity-60">OR SCROLL TO DIE</span>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 md:block hidden animate-bounce">
            <i data-lucide="arrow-down" className="w-12 h-12 text-grunge-white"></i>
          </div>
        </header>

        <section id="music" className="py-24 bg-grunge-charcoal relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%">
              <path d="M0,0 L100,100 M200,0 L300,300" stroke="white" strokeWidth="2" fill="none" />
              <circle cx="80%" cy="20%" r="100" stroke="white" strokeWidth="1" fill="none" strokeDasharray="5,5" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 relative group">
                <div className="tape absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-10 rotate-2 z-30"></div>
                <div className="relative z-20 border-8 border-white bg-white p-2 shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop" alt="Album Cover" className="w-full h-auto grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
                  <div className="mt-4 text-center font-hand text-black text-2xl font-bold">"STATIC VOID"</div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-grunge-red mix-blend-multiply opacity-60 rounded-full blur-3xl -z-10"></div>
              </div>

              <div className="w-full lg:w-1/2 text-left">
                <div className="bg-black inline-block px-2 text-grunge-red font-bold tracking-widest mb-4 transform -skew-x-12">NEW RELEASE</div>
                <h2 className="text-5xl md:text-7xl font-glitch text-white mb-8 glitch-hover leading-tight">
                  FEEDBACK <br /><span className="text-grunge-red">LOOPS</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-typewriter mb-8 border-l-4 border-grunge-white pl-6">
                  Recorded in a damp basement in Seattle on a 4-track recorder. It smells like cheap cigarettes and sounds like a breakdown.
                  Includes the hit single "Rusty Nails".
                </p>

                <div className="flex gap-4">
                  <button className="bg-transparent border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors font-bold flex items-center gap-2">
                    <i data-lucide="play-circle"></i> SPOTIFY
                  </button>
                  <button className="bg-transparent border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors font-bold flex items-center gap-2">
                    <i data-lucide="music"></i> APPLE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="band" className="py-24 bg-paper relative">
          <div className="absolute inset-0 bg-noise opacity-30"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-8xl text-black font-glitch text-center mb-16 uppercase tracking-tighter">The Suspects</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {members.map(m => (
                <div key={m.alt} className={`relative group transform ${m.outerRotate} transition-transform duration-300 ${m.marginTop}`}>
                  <div className={`tape absolute ${m.tape} z-20`}></div>
                  <div className="bg-white p-4 pb-12 shadow-xl border border-gray-400">
                    <div className="overflow-hidden h-80 bg-gray-900 mb-4">
                      <img src={m.img} className="w-full h-full object-cover grunge-img" alt={m.alt} />
                    </div>
                    <div className={`text-center font-hand text-2xl text-black ${m.captionRotate}`}>{m.caption}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tour" className="py-24 bg-grunge-gray relative flex justify-center overflow-hidden">
          <div className="relative w-full max-w-3xl mx-4 transform rotate-1 md:rotate-2 transition-transform duration-500 hover:rotate-0">
            <div className="tape absolute -top-4 left-20 w-32 h-10 -rotate-3 z-20"></div>
            <div className="tape absolute -bottom-4 right-20 w-32 h-10 rotate-3 z-20"></div>

            <div className="bg-paper-dark p-6 md:p-12 shadow-hard box-border relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-black opacity-10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-grunge-red opacity-10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="border-4 border-black p-4 md:p-8 text-black text-center">
                <h3 className="text-5xl md:text-7xl font-glitch mb-2 uppercase">World Tour</h3>
                <p className="text-xl font-typewriter mb-8 border-b-2 border-black inline-block pb-1">FALL / WINTER 2026</p>

                <div className="space-y-4 text-left">
                  {tourDates.map(d => (
                    <div key={d.date} className={`flex flex-col md:flex-row justify-between items-center bg-black/5 p-3 hover:bg-black hover:text-white transition-colors ${d.soldOut ? "cursor-default" : "cursor-pointer"} group`}>
                      <div className="font-bold text-2xl w-full md:w-1/4">{d.date}</div>
                      <div className="text-xl font-typewriter uppercase w-full md:w-1/2">{d.venue}</div>
                      <div className="w-full md:w-1/4 text-center md:text-right mt-2 md:mt-0">
                        {d.soldOut
                          ? <span className="bg-grunge-red text-white px-2 py-1 text-sm font-bold rotate-12 inline-block border border-white">SOLD OUT</span>
                          : <span className="border-2 border-current px-4 py-1 text-sm font-bold hover:bg-white hover:text-black transition-colors">TICKETS</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="font-hand text-sm transform -rotate-2">* NO REFUNDS IF WE BREAK UP ON STAGE</p>
              </div>
            </div>
          </div>
        </section>

        <section id="merch" className="py-20 bg-black text-white border-t border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <h2 className="text-6xl font-glitch text-white">MERCH</h2>
              <a href="#" className="text-grunge-red hover:text-white font-typewriter text-xl underline decoration-wavy underline-offset-8">VIEW ALL TRASH →</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {merch.map(m => (
                <div key={m.title} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-gray-900 aspect-square border-2 border-gray-800 group-hover:border-grunge-red transition-colors">
                    <img src={m.img} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt={m.alt} />
                    {m.soldOut && <div className="absolute top-2 right-2 bg-grunge-red text-white text-xs font-bold px-2 py-1 transform rotate-3">SOLD OUT</div>}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <h3 className="font-bold text-xl font-typewriter">{m.title}</h3>
                    <span className="text-gray-400">{m.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DOCTRINE — Premium 3-card row with image bg, squarish */}
        <section className="py-20 bg-grunge-charcoal text-grunge-white relative overflow-hidden border-t-4 border-grunge-red">
          <div className="paper-tear absolute top-0 left-0 w-full h-8 transform rotate-180"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-grunge-red text-grunge-white px-3 py-1 font-glitch text-sm uppercase tracking-widest mb-3 transform -rotate-2">/// MANIFESTO ///</span>
              <h2 className="text-5xl md:text-7xl font-glitch text-grunge-white">THREE RULES, ONE BAND.</h2>
              <p className="font-typewriter text-grunge-white/70 mt-4 max-w-xl mx-auto">Spray-painted on the rehearsal-room wall. Same paint, same wall, since 1994.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { id: "RULE · 01", icon: "zap", iconBg: "bg-grunge-red", iconText: "text-grunge-white", iconRotate: "-rotate-3", numColor: "text-grunge-red", title: "PLAY LOUD. MEAN IT.", body: "No backing track. No click. No pre-recorded vocals. Every note that leaves the stage was made on the stage, in the moment, by the four humans standing on it.", left: "// 50 KW · stage rig", right: "RIGHT NOW", rightColor: "text-grunge-red", divider: "border-grunge-red/50", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=900&q=85&auto=format&fit=crop", alt: "Vinyl record with a red THE ACT album sleeve", outer: "hover:rotate-[-1deg]" },
                { id: "RULE · 02", icon: "cassette-tape", iconBg: "bg-grunge-white text-grunge-charcoal", iconText: "", iconRotate: "rotate-3", numColor: "text-grunge-white", title: "RECORD TO TAPE.", body: "2-inch reel, two takes max, no comping. The hum stays in. The amp buzz stays in. The drummer's bad rim-click in bar 17 of \"Tar\" stays in. The record is the room.", left: "// Studer A827 · 2\"", right: "2 TAKES", rightColor: "text-grunge-white", divider: "border-grunge-white/30", img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=900&q=85&auto=format&fit=crop", alt: "Vintage boombox cassette deck on hardwood", outer: "hover:rotate-[1deg]" },
                { id: "RULE · 03", icon: "disc-3", iconBg: "bg-grunge-red", iconText: "text-grunge-white", iconRotate: "-rotate-3", numColor: "text-grunge-red", title: "PRESS YOUR OWN.", body: "No major label. No streaming-only release. Vinyl pressed by United in Nashville, jacket screen-printed by us at the warehouse, the band signs every test pressing — 800 / run, no repress.", left: "// 800 / run · no repress", right: "SIGNED", rightColor: "text-grunge-red", divider: "border-grunge-red/50", img: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=900&q=85&auto=format&fit=crop", alt: "Magenta and yellow vinyl records stacked on press", outer: "hover:rotate-[-1deg]" },
              ].map(r => (
                <article key={r.id} className={`group relative aspect-square overflow-hidden border-4 border-grunge-white bg-grunge-charcoal transform transition-transform duration-300 ${r.outer}`}>
                  <img src={r.img} alt={r.alt} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-150 group-hover:opacity-40 transition-opacity duration-500" loading="lazy" decoding="async" width="900" height="900" />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/85"></div>
                  <div className="absolute inset-0 flex flex-col p-6 md:p-8">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 border-2 border-grunge-white flex items-center justify-center transform ${r.iconBg} ${r.iconText} ${r.iconRotate}`}>
                        <i data-lucide={r.icon} className="w-7 h-7"></i>
                      </div>
                      <span className={`font-glitch text-xl tracking-widest ${r.numColor}`}>{r.id}</span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-2xl md:text-3xl font-glitch text-grunge-white mb-3 leading-[0.95]">{r.title}</h3>
                      <p className="font-typewriter text-grunge-white/85 text-sm leading-relaxed mb-4">{r.body}</p>
                      <div className={`border-t-2 ${r.divider} pt-3 font-typewriter text-[10px] uppercase tracking-widest text-grunge-white/60 flex items-center justify-between`}>
                        <span>{r.left}</span>
                        <span className={r.rightColor}>{r.right}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="paper-tear absolute bottom-0 left-0 w-full h-8"></div>
        </section>

        {/* ALTERNATING SECTION A */}
        <section className="py-20 bg-grunge-red text-grunge-white relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-7 relative">
              <div className="relative aspect-[4/3] overflow-hidden border-4 border-grunge-white transform -rotate-1 shadow-[8px_8px_0_0_#000]">
                <img src="https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=1400&q=85&auto=format&fit=crop" alt="Hands on acoustic guitar fretboard, low light" className="absolute inset-0 w-full h-full object-cover grunge-img" loading="lazy" decoding="async" width="1400" height="1050" />
                <div className="absolute top-4 left-4 bg-black text-grunge-white px-3 py-1 font-glitch text-sm uppercase tracking-widest transform -rotate-3 border-2 border-grunge-white">SIDE A · WRITING</div>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col justify-center">
              <span className="inline-block bg-black text-grunge-white px-2 py-1 font-typewriter text-[10px] uppercase tracking-[0.3em] mb-4 w-fit">/// CHAPTER A · WRITING ///</span>
              <h2 className="text-4xl md:text-6xl font-glitch text-grunge-white leading-[0.9] mb-5 transform -rotate-1">SONGS WRITTEN IN THE BASEMENT.</h2>
              <p className="font-typewriter text-grunge-white text-base md:text-lg leading-relaxed mb-4">Every track on every record built from a four-track demo cut downstairs at the bassist's house. No co-writers, no song-camps, no Nashville polish. If a chorus needs eight people to land, the chorus needs to die.</p>
              <p className="font-typewriter text-grunge-white/70 text-sm leading-relaxed mb-6">Tape preserved. Demos pressed as B-sides every fifth release. The flaw is the receipt.</p>
              <ul className="flex flex-col gap-2 font-typewriter text-xs uppercase tracking-widest text-grunge-white border-t-4 border-grunge-white pt-4">
                <li className="flex justify-between"><span>Tape · Tascam 388</span><span className="bg-black px-2 py-0.5">Since 1994</span></li>
                <li className="flex justify-between"><span>Co-writers · 0</span><span className="bg-black px-2 py-0.5">Forever</span></li>
                <li className="flex justify-between"><span>Demos · pressed</span><span className="bg-black px-2 py-0.5">Every 5th</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ALTERNATING SECTION B — image RIGHT */}
        <section className="py-20 bg-grunge-charcoal text-grunge-white relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1">
              <span className="inline-block bg-grunge-red text-white px-2 py-1 font-typewriter text-[10px] uppercase tracking-[0.3em] mb-4 w-fit md:self-end">/// CHAPTER B · STAGE ///</span>
              <h2 className="text-4xl md:text-6xl font-glitch text-grunge-white leading-[0.9] mb-5 transform rotate-1 md:text-right">PLAYED ON STAGES THAT SMELL.</h2>
              <p className="font-typewriter text-grunge-white text-base md:text-lg leading-relaxed mb-4 md:text-right">No corporate plazas. No festival-circuit revivals. The tour books rooms with sticky floors, low ceilings, and at least one broken urinal — the kind of room where you remember the songs because they were too loud to hear properly.</p>
              <p className="font-typewriter text-grunge-white/60 text-sm leading-relaxed mb-6 md:text-right">Capacity 400 max. Tickets cash at the door. No VIP, no meet-and-greet, no second night.</p>
              <ul className="flex flex-col gap-2 font-typewriter text-xs uppercase tracking-widest text-grunge-white border-t-4 border-grunge-red pt-4">
                <li className="flex justify-between"><span className="text-grunge-red">400 cap · max</span><span>Cash · door</span></li>
                <li className="flex justify-between"><span className="text-grunge-red">No VIP</span><span>No 2nd night</span></li>
                <li className="flex justify-between"><span className="text-grunge-red">12 cities · year</span><span>Van · always</span></li>
              </ul>
            </div>
            <div className="md:col-span-7 relative order-1 md:order-2">
              <div className="relative aspect-[4/3] overflow-hidden border-4 border-grunge-white transform rotate-1 shadow-[8px_8px_0_0_#cc0000]">
                <img src="https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=1400&q=85&auto=format&fit=crop" alt="Stage with crowd at night, stage lights and smoke" className="absolute inset-0 w-full h-full object-cover grunge-img" loading="lazy" decoding="async" width="1400" height="1050" />
                <div className="absolute top-4 right-4 bg-black text-grunge-white border-2 border-grunge-white px-3 py-1 font-glitch text-sm uppercase tracking-widest transform rotate-3">SIDE B · TOUR</div>
              </div>
            </div>
          </div>
        </section>

        {/* ALTERNATING SECTION C */}
        <section className="py-20 bg-grunge-red text-grunge-white relative border-t-4 border-black">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-7 relative">
              <div className="relative aspect-[4/3] overflow-hidden border-4 border-grunge-white transform -rotate-1 shadow-[8px_8px_0_0_#000]">
                <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1400&q=85&auto=format&fit=crop" alt="Vinyl record with red THE ACT album sleeve" className="absolute inset-0 w-full h-full object-cover grunge-img" loading="lazy" decoding="async" width="1400" height="1050" />
                <div className="absolute top-4 left-4 bg-black text-grunge-white px-3 py-1 font-glitch text-sm uppercase tracking-widest transform -rotate-3 border-2 border-grunge-white">SIDE C · PRESS</div>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col justify-center">
              <span className="inline-block bg-black text-grunge-white px-2 py-1 font-typewriter text-[10px] uppercase tracking-[0.3em] mb-4 w-fit">/// CHAPTER C · PRESS ///</span>
              <h2 className="text-4xl md:text-6xl font-glitch text-grunge-white leading-[0.9] mb-5 transform rotate-1">VINYL SIGNED, SLEEVES GLUED.</h2>
              <p className="font-typewriter text-grunge-white text-base md:text-lg leading-relaxed mb-4">Every record cut at 33⅓ on 180 gsm black wax — coloured pressings exist for the bassist's birthday only. Sleeves screen-printed Tuesday nights at the warehouse, signed by the band on Wednesday, mailed by Friday.</p>
              <p className="font-typewriter text-grunge-white/70 text-sm leading-relaxed mb-6">No streaming-first release. The vinyl drops on the first of the month; the digital follows two weeks later. The order matters.</p>
              <ul className="flex flex-col gap-2 font-typewriter text-xs uppercase tracking-widest text-grunge-white border-t-4 border-grunge-white pt-4">
                <li className="flex justify-between"><span>180 gsm · black</span><span className="bg-black px-2 py-0.5">United · TN</span></li>
                <li className="flex justify-between"><span>Sleeve · screen-print</span><span className="bg-black px-2 py-0.5">Hand-folded</span></li>
                <li className="flex justify-between"><span>Run · 800</span><span className="bg-black px-2 py-0.5">No repress</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* DARKROOM CAROUSEL — replaces cream Newsletter strip with grunge image carousel */}
        <section className="py-20 bg-black text-grunge-white relative overflow-hidden border-t-4 border-grunge-red">
          <div className="paper-tear absolute top-0 left-0 w-full h-8 transform rotate-180"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4 border-b-2 border-grunge-red pb-4">
              <div>
                <span className="inline-block bg-grunge-red text-white px-2 py-1 font-typewriter text-[10px] uppercase tracking-[0.3em] mb-3">/// FILM · DARKROOM ///</span>
                <h2 className="text-4xl md:text-6xl font-glitch text-grunge-white leading-[0.9] transform -rotate-1">FROM THE PIT.</h2>
              </div>
              <span className="font-typewriter text-grunge-white/60 text-xs uppercase tracking-widest">/// shot on Tri-X · pushed +2 ///</span>
            </div>
            <div className="relative">
              <div className="overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory" style={{ scrollbarWidth: "thin", scrollbarColor: "#cc0000 #1a1a1a" }}>
                <ul className="flex gap-4 md:gap-6 min-w-max">
                  {[
                    { n: "01", tag: "VOX",   img: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=600&q=85&auto=format&fit=crop", alt: "Vintage chrome microphone — vocalist position", rotate: "-rotate-1" },
                    { n: "02", tag: "GTR",   img: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&q=85&auto=format&fit=crop", alt: "Hands on acoustic guitar fretboard", rotate: "rotate-1" },
                    { n: "03", tag: "DRM",   img: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&q=85&auto=format&fit=crop", alt: "Drum kit with sticks crossed on snare", rotate: "-rotate-1" },
                    { n: "04", tag: "PIT",   img: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=600&q=85&auto=format&fit=crop", alt: "Stage and crowd at night with smoke", rotate: "rotate-1" },
                    { n: "05", tag: "WAX",   img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=85&auto=format&fit=crop", alt: "Red THE ACT vinyl record album cover", rotate: "-rotate-1" },
                    { n: "06", tag: "TAPE",  img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&q=85&auto=format&fit=crop", alt: "Vintage boombox cassette deck", rotate: "rotate-1" },
                    { n: "07", tag: "PRESS", img: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&q=85&auto=format&fit=crop", alt: "Magenta and yellow vinyl records stacked", rotate: "-rotate-1" },
                    { n: "08", tag: "SHIRT", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=85&auto=format&fit=crop", alt: "White t-shirt — band merch", rotate: "rotate-1" },
                  ].map(f => (
                    <li key={f.n} className="snap-start w-64 md:w-72 shrink-0">
                      <figure className={`relative aspect-square overflow-hidden border-4 border-grunge-white transform ${f.rotate} hover:rotate-0 hover:scale-[1.03] transition-all duration-300 shadow-[6px_6px_0_0_#cc0000]`}>
                        <img src={f.img} alt={f.alt} className="w-full h-full object-cover grunge-img" loading="lazy" decoding="async" width="600" height="600" />
                        <figcaption className="absolute bottom-2 left-2 right-2 bg-black/85 text-grunge-white px-2 py-1 font-typewriter text-[10px] uppercase tracking-widest flex justify-between"><span>FRM · {f.n}</span><span className="text-grunge-red">{f.tag}</span></figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 font-typewriter text-[11px] uppercase tracking-widest text-grunge-white/60">
                <span>← scroll · 8 frames · contact-sheet 04 ←→</span>
                <a href="#" className="bg-grunge-red text-grunge-white px-4 py-2 hover:bg-grunge-white hover:text-black transition-colors">View 124 frames →</a>
              </div>
            </div>
          </div>
          <div className="paper-tear absolute bottom-0 left-0 w-full h-8"></div>
        </section>

        <footer className="bg-black text-white pt-20 pb-10 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
              <i data-lucide="zap" className="w-12 h-12 text-grunge-red mb-4 mx-auto md:mx-0"></i>
              <h4 className="text-3xl font-glitch">NOISE_FLOOR</h4>
              <p className="text-gray-500 text-sm font-typewriter mt-2">
                Established 1994.<br />Seattle, WA.
              </p>
            </div>

            <div className="flex gap-4">
              {socials.map(s => (
                <a key={s.icon} href="#" className={`bg-white text-black w-10 h-10 flex items-center justify-center transform ${s.rotate} hover:bg-grunge-red hover:text-white transition-all shadow-hard-white`}>
                  <i data-lucide={s.icon} className="w-5 h-5"></i>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-600 font-typewriter uppercase tracking-widest">
              © 2026 NOISE_FLOOR. All Rights Reserved. <span className="text-grunge-red">Do not copy.</span>
            </p>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
