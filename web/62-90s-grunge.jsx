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
    { img: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=800&auto=format&fit=crop", alt: "Vocalist", caption: "Jax (Vocals/Pain)", outerRotate: "rotate-2 hover:-rotate-1", tape: "-top-4 left-10 w-24 h-8 -rotate-12", captionRotate: "-rotate-2", marginTop: "" },
    { img: "https://images.unsplash.com/photo-1525203135335-74d272fc8d9c?q=80&w=800&auto=format&fit=crop", alt: "Guitarist", caption: "Sid (Strings/Noise)", outerRotate: "-rotate-3 hover:rotate-1", tape: "-top-4 right-10 w-24 h-8 rotate-45", captionRotate: "rotate-1", marginTop: "mt-8 md:mt-0" },
    { img: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=800&auto=format&fit=crop", alt: "Drummer", caption: "Bones (Drums)", outerRotate: "rotate-1 hover:rotate-3", tape: "-top-4 left-1/2 w-24 h-8 -translate-x-1/2", captionRotate: "-rotate-1", marginTop: "" },
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
    { img: "https://images.unsplash.com/photo-1576506542790-51244b486a6b?q=80&w=800&auto=format&fit=crop", alt: "Cassette", title: "Demo Tape", price: "$10.00", soldOut: false },
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
  background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.35%22/%3E%3C/svg%3E');
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
        <div className="texture-overlay"></div>

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
            <img src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 grayscale contrast-125" alt="Concert Atmosphere" />
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

            <h1 className="text-[15vw] md:text-[10rem] leading-[0.8] font-glitch text-transparent bg-clip-text bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1590529853874-12968846df72?auto=format&fit=crop&q=80')] stroke-white drop-shadow-[8px_8px_0_rgba(139,0,0,0.8)] animate-flicker">
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

        <section className="py-24 bg-grunge-red relative text-center px-4">
          <div className="paper-tear absolute top-0 left-0 w-full h-8 bg-black transform rotate-180"></div>

          <div className="max-w-2xl mx-auto border-4 border-black p-8 md:p-12 bg-grunge-white transform rotate-1 shadow-hard">
            <h2 className="text-4xl md:text-6xl font-glitch text-black mb-4">JOIN THE CULT</h2>
            <p className="text-black font-typewriter mb-8">Get the zine, secret show locations, and hate mail delivered to your inbox.</p>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="YOUR@EMAIL.HERE" className="bg-transparent border-b-4 border-black text-black text-xl p-3 placeholder-black/50 focus:outline-none focus:bg-black/5 font-typewriter" />
              <button type="submit" className="bg-black text-white py-4 text-xl font-bold hover:bg-grunge-red transition-colors uppercase tracking-widest mt-4">Sign Up Now</button>
            </form>
          </div>

          <div className="paper-tear absolute bottom-0 left-0 w-full h-8 bg-black"></div>
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
