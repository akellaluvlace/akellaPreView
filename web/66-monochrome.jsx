export default function T66Monochrome() {
  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#gallery", label: "Gallery" },
    { href: "#philosophy", label: "Philosophy" },
    { href: "#bio", label: "Bio" },
    { href: "#contact", label: "Contact" },
  ];

  const socials = ["instagram", "twitter", "camera"];

  const gallery = [
    { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", alt: "Architecture", title: "Structure", meta: "London, 2021", overlay: true },
    { src: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=800&auto=format&fit=crop", alt: "Portrait", title: "Gaze" },
    { src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop", alt: "Misty Mountains", title: "Wilderness", meta: "The Peaks, 2023" },
    { src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop", alt: "Urban", title: "Neon Rain" },
    { src: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=800&auto=format&fit=crop", alt: "Seascape", title: "Horizon" },
    { src: "https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=800&auto=format&fit=crop", alt: "Texture", title: "Detail" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", alt: "Fashion" },
    { src: "https://images.unsplash.com/photo-1487260211189-670c54da558d?q=80&w=800&auto=format&fit=crop", alt: "Abstract", title: "Contrast" },
    { src: "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=800&auto=format&fit=crop", alt: "Street", title: "Transit" },
  ];

  const philosophy = [
    { icon: "eye", title: "Perception", desc: "We perceive the world in color, but we understand it in contrast. Stripping away the hue allows the eye to focus on the essential geometry.", delay: 0 },
    { icon: "aperture", title: "Capture", desc: "The moment is fleeting. The shutter is the bridge between the transient present and the eternal archive.", delay: 100 },
    { icon: "droplet", title: "Process", desc: "Digital or film, the darkroom is a state of mind. It is where the raw data finds its emotional resonance.", delay: 200 },
  ];

  const footerLinks = ["Instagram", "Behance", "Unsplash"];

  const atmosphere = [
    { num: "I", caption: "Concrete", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=900&auto=format&fit=crop" },
    { num: "II", caption: "Threshold", src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=900&auto=format&fit=crop" },
    { num: "III", caption: "Pasture", src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?q=80&w=900&auto=format&fit=crop" },
    { num: "IV", caption: "Interior", src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop" },
    { num: "V", caption: "Cornice", src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop" },
  ];

  const witnessed = [
    { src: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=900&auto=format&fit=crop", title: "Gaze", plate: "I", w: "w-72", aspect: "aspect-[3/4]" },
    { src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1400&auto=format&fit=crop", title: "Wilderness", plate: "II", w: "w-96", aspect: "aspect-[16/10]" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop", title: "Atelier", plate: "III", w: "w-72", aspect: "aspect-[3/4]" },
    { src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop", title: "Neon Rain", plate: "IV", w: "w-80", aspect: "aspect-[16/10]" },
    { src: "https://images.unsplash.com/photo-1487260211189-670c54da558d?q=80&w=900&auto=format&fit=crop", title: "Contrast", plate: "V", w: "w-72", aspect: "aspect-[3/4]" },
    { src: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1400&auto=format&fit=crop", title: "Horizon", plate: "VI", w: "w-96", aspect: "aspect-[16/10]" },
    { src: "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=900&auto=format&fit=crop", title: "Transit", plate: "VII", w: "w-72", aspect: "aspect-[3/4]" },
  ];

  const stats = [
    { num: "XII", label: "Years on Film", sub: "since MMXIV" },
    { num: "847", label: "Plates Archived", sub: "silver gelatin" },
    { num: "XXXI", label: "Editions Bound", sub: "limited press" },
    { num: "04", label: "Continents", sub: "no haste" },
  ];

  const faqs = [
    { q: "Do you shoot in colour?", a: "Rarely, and only when a client commission specifies it. The studio voice is monochrome — that decision is made before the shutter, not in post." },
    { q: "What is your turnaround?", a: "Editorial shoots: contact sheet within seven days, finals within twenty-one. Architectural commissions: four to six weeks for a full plate set, including darkroom proofing." },
    { q: "Do you travel?", a: "Anywhere, with a passport's notice. Recent assignments have placed the studio in Reykjavík, Naoshima, Marrakech, and the Outer Hebrides." },
    { q: "Are prints available?", a: "Selected works are released as editions of twelve, hand-printed on archival fibre paper, embossed and signed. Enquire directly for the current catalogue." },
    { q: "Film or digital?", a: "Both, depending on the brief. Medium-format film for portrait and architectural work; full-frame digital for editorial and any assignment with a tight cycle. The negative dictates the workflow, not the brand." },
  ];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    fontFamily: { sans: ['Inter','sans-serif'], serif: ['Cinzel','serif'] },
    colors: { brand: { 50:'#f8fafc', 100:'#f1f5f9', 200:'#e2e8f0', 300:'#cbd5e1', 400:'#94a3b8', 500:'#64748b', 600:'#475569', 700:'#334155', 800:'#1e293b', 900:'#0f172a' } },
    animation: { 'fade-in-up': 'fadeInUp 1s ease-out forwards' },
    keyframes: {
      fadeInUp: {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      }
    }
  } }
};`;

  const customCss = `html, body { overflow-x: clip; }
body { font-family: 'Inter', sans-serif; }
.masonry-item { break-inside: avoid; margin-bottom: 1.5rem; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.reveal { opacity: 0; transform: translateY(30px); transition: all 1s ease-out; }
.reveal.active { opacity: 1; transform: translateY(0); }
.shade-marquee-wrap { overflow: hidden; }
.shade-marquee { display: flex; gap: 24px; width: max-content; animation: shade-marquee-x 70s linear infinite; }
.shade-marquee:hover { animation-play-state: paused; }
@keyframes shade-marquee-x {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 12px)); }
}
.shade-faq summary::-webkit-details-marker { display: none; }
.shade-faq summary { list-style: none; cursor: pointer; }
.shade-faq .shade-chevron { transition: transform 250ms ease; }
.shade-faq[open] .shade-chevron { transform: rotate(180deg); }
@media (prefers-reduced-motion: reduce) {
  .shade-marquee { animation: none; }
  .shade-faq .shade-chevron { transition: none; }
}`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    var btn = document.getElementById('mobile-menu-btn');
    var closeBtn = document.getElementById('close-menu-btn');
    var menu = document.getElementById('mobile-menu');
    function toggle(){
      if (!menu) return;
      var isClosed = menu.classList.contains('-translate-y-full');
      if (isClosed) { menu.classList.remove('-translate-y-full'); document.body.style.overflow='hidden'; }
      else { menu.classList.add('-translate-y-full'); document.body.style.overflow=''; }
    }
    if (btn) btn.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', toggle);
    document.querySelectorAll('.mobile-link').forEach(function(l){ l.addEventListener('click', toggle); });
    function reveal(){
      var els = document.querySelectorAll('.reveal');
      for (var i=0;i<els.length;i++){
        var top = els[i].getBoundingClientRect().top;
        if (top < window.innerHeight - 150) els[i].classList.add('active');
      }
    }
    window.addEventListener('scroll', reveal);
    reveal();
    return;
  }
  setTimeout(init, 50);
})();`;

  const GalleryItem = ({ g }) => (
    <div className="masonry-item reveal relative group overflow-hidden cursor-pointer">
      <img src={g.src} alt={g.alt} className="w-full h-auto grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105" />
      {g.overlay && <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>}
      {g.title && (
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="text-slate-50 text-xs tracking-[0.2em] uppercase font-serif block mb-1">{g.title}</span>
          {g.meta && <span className="text-slate-300 text-[10px] tracking-wide font-light">{g.meta}</span>}
        </div>
      )}
    </div>
  );

  const FloatingLabel = ({ id, type = "text", label, rows }) => (
    <div className="relative">
      {rows ? (
        <textarea id={id} rows={rows} className="peer w-full border-b border-slate-300 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors bg-transparent placeholder-transparent resize-none" placeholder={label}></textarea>
      ) : (
        <input type={type} id={id} className="peer w-full border-b border-slate-300 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors bg-transparent placeholder-transparent" placeholder={label} />
      )}
      <label htmlFor={id} className="absolute left-0 -top-3.5 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-xs">{label}</label>
    </div>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="scroll-smooth bg-slate-50 text-slate-800 antialiased selection:bg-slate-800 selection:text-white">

        <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-900 text-white z-50 flex justify-between items-center p-5 border-b border-slate-800 shadow-md">
          <span className="font-serif text-xl tracking-[0.2em] font-semibold">SHADE</span>
          <button id="mobile-menu-btn" className="text-slate-300 hover:text-white focus:outline-none transition-colors">
            <i data-lucide="menu" className="w-6 h-6"></i>
          </button>
        </div>

        <div id="mobile-menu" className="fixed inset-0 bg-slate-900 z-40 transform -translate-y-full transition-transform duration-500 ease-in-out lg:hidden flex flex-col justify-center items-center space-y-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="mobile-link text-3xl font-serif text-slate-400 hover:text-white transition-colors">{l.label}</a>
          ))}
          <button id="close-menu-btn" className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors">
            <i data-lucide="x" className="w-8 h-8"></i>
          </button>
        </div>

        <nav className="hidden lg:flex fixed top-0 left-0 h-screen w-72 bg-slate-900 flex-col justify-between p-10 z-50 border-r border-slate-800 shadow-2xl">
          <div>
            <h1 className="font-serif text-4xl text-slate-50 tracking-[0.2em] font-semibold mb-2">SHADE</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Monochrome Studio</p>
          </div>

          <div className="flex flex-col space-y-6 pl-2">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="group flex items-center space-x-3 text-slate-400 hover:text-white transition-colors duration-300">
                <span className="w-8 h-[1px] bg-slate-700 group-hover:bg-white transition-colors"></span>
                <span className="text-xs uppercase tracking-widest font-medium">{l.label}</span>
              </a>
            ))}
          </div>

          <div>
            <div className="flex space-x-5 mb-8">
              {socials.map(s => (
                <a key={s} href="#" className="text-slate-500 hover:text-slate-200 transition-colors transform hover:-translate-y-1 duration-300">
                  <i data-lucide={s} className="w-5 h-5"></i>
                </a>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 font-light tracking-wide">© 2026 Shade.</p>
          </div>
        </nav>

        <main className="lg:ml-72 w-full">
          <section id="hero" className="relative h-screen w-full overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop" alt="Hero Background" className="w-full h-full object-cover grayscale opacity-50 transform scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/90"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-slate-50 tracking-wider mb-6 animate-fade-in-up">
                Capturing Silence
              </h2>
              <p className="text-slate-300 text-sm md:text-lg font-light tracking-[0.3em] uppercase mt-2 opacity-80 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                The Art of Shadows
              </p>

              <a href="#gallery" className="absolute bottom-12 group flex flex-col items-center text-slate-500 hover:text-slate-200 transition-colors animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                <span className="text-[10px] uppercase tracking-[0.2em] mb-3">Enter Gallery</span>
                <i data-lucide="chevron-down" className="w-6 h-6 animate-bounce"></i>
              </a>
            </div>
          </section>

          <section id="gallery" className="bg-white px-6 py-24 md:px-16 md:py-32">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 reveal">
                <h3 className="font-serif text-4xl text-slate-900 border-l-2 border-slate-900 pl-6 tracking-wide">Selected Works</h3>
                <div className="flex justify-between items-end mt-4 pl-7">
                  <p className="text-slate-500 text-sm font-light">A curated collection of light and absence.</p>
                  <p className="hidden md:block text-slate-400 text-xs uppercase tracking-widest">Hover to reveal soul</p>
                </div>
              </div>

              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {gallery.map(g => <GalleryItem key={g.alt} g={g} />)}
              </div>
            </div>
          </section>

          <section id="atmosphere" className="bg-slate-50 px-6 py-24 md:px-16 md:py-32 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 reveal flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-3">— Atmosphere · 03</p>
                  <h3 className="font-serif text-4xl text-slate-900 tracking-wide">From The Floor</h3>
                </div>
                <p className="text-slate-500 text-sm font-light max-w-sm md:text-right">Five frames lifted from the cutting-room floor. Outtakes, but only just.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 reveal">
                {atmosphere.map(a => (
                  <figure key={a.num} className="group">
                    <div className="relative overflow-hidden aspect-[3/4] border border-slate-200">
                      <img src={a.src} alt={`Atmosphere ${a.num}`} className="w-full h-full object-cover grayscale contrast-125 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-white/30 transition-all duration-500"></div>
                    </div>
                    <figcaption className="mt-3 flex items-baseline gap-2 text-[10px] uppercase tracking-[0.25em]">
                      <span className="font-serif text-slate-400">{a.num}</span>
                      <span className="flex-1 h-px bg-slate-300/60"></span>
                      <span className="text-slate-600">{a.caption}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-slate-400 text-center">Photographs by Shade · Floor No. 02 · MMXXIV</p>
            </div>
          </section>

          <section id="philosophy" className="bg-slate-900 text-slate-100 py-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
              <h3 className="font-serif text-3xl md:text-4xl tracking-wide text-center mb-16 reveal">The Philosophy</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {philosophy.map(p => (
                  <div key={p.title} className="text-center reveal" style={p.delay ? { transitionDelay: `${p.delay}ms` } : {}}>
                    <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
                      <i data-lucide={p.icon} className="w-8 h-8"></i>
                    </div>
                    <h4 className="font-serif text-xl tracking-widest mb-4">{p.title}</h4>
                    <p className="text-slate-400 font-light leading-relaxed text-sm">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="witnessed" className="bg-slate-100 py-24 md:py-32 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6 md:px-16 mb-12 reveal">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-3">— Witnessed · 04</p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <h3 className="font-serif text-4xl text-slate-900 tracking-wide">The Working Archive</h3>
                <p className="text-slate-500 text-sm font-light max-w-md md:text-right">Plates assembled in the field. Hover to pause the reel.</p>
              </div>
            </div>

            <div className="shade-marquee-wrap reveal py-2">
              <div className="shade-marquee">
                {[...witnessed, ...witnessed].map((p, i) => (
                  <figure key={`plate-${i}`} aria-hidden={i >= witnessed.length ? "true" : undefined} className={`relative shrink-0 ${p.w} ${p.aspect} overflow-hidden border border-slate-200 bg-slate-50`}>
                    <img src={p.src} alt={i >= witnessed.length ? "" : `Plate ${p.plate}`} className="w-full h-full object-cover grayscale contrast-125" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                    <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[10px] uppercase tracking-[0.25em] text-white">
                      <span className="font-serif italic normal-case text-base tracking-wide">{p.title}</span>
                      <span className="text-white/80">Plate · {p.plate}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section id="bio" className="bg-slate-50 px-6 py-24 md:px-16 md:py-32">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2 reveal">
                <div className="relative w-full aspect-[3/4]">
                  <div className="absolute inset-0 bg-slate-200 transform translate-x-4 translate-y-4"></div>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" alt="Photographer" className="w-full h-full object-cover grayscale relative z-10 shadow-lg" />
                </div>
              </div>

              <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left reveal">
                <span className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase mb-4 block">About the Artist</span>
                <h3 className="font-serif text-4xl text-slate-900 mb-8">Elias "Shade" Vance</h3>
                <p className="text-slate-600 leading-relaxed mb-6 font-light">
                  Born in the quiet moments between dusk and dawn, SHADE is an exploration of the world without the distraction of color. I believe that when you remove color, you are forced to see the truth of a subject—its texture, its form, and its soul.
                </p>
                <p className="text-slate-600 leading-relaxed mb-8 font-light">
                  With over a decade of experience in monochrome photography shooting for architectural firms and fashion houses, my work aims to strip away the noise of the modern world, leaving only what is essential.
                </p>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Signature" className="h-12 opacity-50 mx-auto md:mx-0" />
              </div>
            </div>
          </section>

          <section id="numbers" className="relative overflow-hidden py-24 md:py-32">
            <img src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=2000&auto=format&fit=crop" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/85 to-slate-50"></div>

            <div className="relative max-w-6xl mx-auto px-6 md:px-16">
              <div className="text-center mb-16 reveal">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-3">— A Decade · 06</p>
                <h3 className="font-serif text-4xl md:text-5xl text-slate-900 tracking-wide">By the Numbers</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-300/50 reveal">
                {stats.map(s => (
                  <div key={s.label} className="px-4 md:px-8 py-6 text-center">
                    <p className="font-serif italic text-5xl md:text-6xl text-slate-900 leading-none mb-3">{s.num}</p>
                    <div className="h-px w-10 bg-slate-400/60 mx-auto mb-3"></div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{s.label}</p>
                    <p className="text-xs italic font-light text-slate-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="bg-white px-6 py-24 md:px-16 md:py-32 border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
              <div className="mb-16 reveal text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-3">— Notes · 07</p>
                <h3 className="font-serif text-4xl text-slate-900 tracking-wide">Before You Write</h3>
                <p className="text-slate-500 text-sm font-light mt-4">Common questions, briefly answered.</p>
              </div>

              <div className="reveal divide-y divide-slate-200 border-t border-b border-slate-200">
                {faqs.map(f => (
                  <details key={f.q} className="shade-faq group p-6 md:p-7">
                    <summary className="flex items-start justify-between gap-6">
                      <h4 className="font-serif text-lg md:text-xl text-slate-900 tracking-wide">{f.q}</h4>
                      <i data-lucide="chevron-down" className="shade-chevron w-5 h-5 text-slate-400 mt-1 shrink-0"></i>
                    </summary>
                    <p className="text-slate-600 font-light leading-relaxed mt-4 max-w-2xl text-sm">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="bg-white py-24 px-6 md:px-16 border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16 reveal">
                <h3 className="font-serif text-3xl text-slate-900 tracking-widest">Commission Request</h3>
                <p className="text-slate-500 mt-4 font-light">Available for editorial, architectural, and portrait work.</p>
              </div>

              <form className="space-y-6 reveal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabel id="name" label="Name" />
                  <FloatingLabel id="email" type="email" label="Email Address" />
                </div>
                <div className="mt-8">
                  <FloatingLabel id="message" rows={4} label="Tell me about your project" />
                </div>

                <div className="pt-8 text-center md:text-right">
                  <button type="button" className="group relative px-8 py-3 bg-slate-900 text-white overflow-hidden transition-all hover:bg-slate-800">
                    <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                    <span className="relative text-xs uppercase tracking-[0.2em] font-medium">Send Inquiry</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          <footer className="bg-slate-900 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <span className="font-serif text-2xl text-slate-50 tracking-widest block">SHADE</span>
                <p className="text-slate-500 text-xs mt-2">Monochrome Studio &copy; 2026</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                {footerLinks.map(l => (
                  <a key={l} href="#" className="text-slate-400 hover:text-white text-xs uppercase tracking-widest transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </footer>
        </main>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
