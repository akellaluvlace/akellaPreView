export default function T57Bauhaus() {
  const navLinks = [
    { href: "#collection", label: "Collection", hover: "hover:text-bauhaus-red" },
    { href: "#materials", label: "Materials", hover: "hover:text-bauhaus-blue" },
    { href: "#manifesto", label: "Manifesto", hover: "hover:text-bauhaus-yellow" },
  ];

  const marqueeItems = [
    { type: "text", value: "Total Architecture" },
    { type: "shape", className: "w-6 h-6 bg-white rounded-full mx-4" },
    { type: "text", value: "Mass Production" },
    { type: "shape", className: "w-6 h-6 bg-bauhaus-black rotate-45 mx-4" },
    { type: "text", value: "Standardization" },
    { type: "shape", className: "w-6 h-6 border-2 border-black rounded-full mx-4" },
    { type: "text", value: "Art into Industry" },
    { type: "shape", className: "w-6 h-6 bg-bauhaus-red clip-triangle mx-4" },
  ];

  const products = [
    { name: "B-3 CHAIR", price: "$1,200", img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800", alt: "Wassily Chair", shape: "rounded-full", borderHover: "group-hover:border-bauhaus-red", aspect: "aspect-square", labelRotate: "rotate-3", offset: "" },
    { name: "KAISER LAMP", price: "$850", img: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?q=80&w=800&auto=format&fit=crop", alt: "Bauhaus Geometric Lamp", shape: "rounded-t-full", borderHover: "group-hover:border-bauhaus-blue", aspect: "aspect-[3/4]", labelRotate: "-rotate-3", offset: "md:translate-y-16" },
    { name: "NEST TABLES", price: "$600", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800", alt: "Nesting Tables", shape: "", borderHover: "group-hover:border-bauhaus-yellow", aspect: "aspect-square", labelRotate: "rotate-2", offset: "", overlay: true },
  ];

  const materials = [
    { icon: "cylinder", title: "TUBULAR STEEL", desc: "Inspired by bicycle construction, seamless steel tubing allows for lightweight, mass-producible furniture skeletons.", hoverBg: "group-hover:bg-bauhaus-black" },
    { icon: "gem", title: "GLASS & LIGHT", desc: "Transparency removes barriers. Industrial glass creates a seamless flow between interior and exterior spaces.", hoverBg: "group-hover:bg-bauhaus-blue" },
    { icon: "layers", title: "EISENGARN", desc: '"Iron yarn." A strong, waxed cotton thread developed specifically to replace expensive upholstery in modern chairs.', hoverBg: "group-hover:bg-bauhaus-red" },
  ];

  const socials = [
    { icon: "instagram", label: "Instagram" },
    { icon: "twitter", label: "Twitter" },
    { icon: "linkedin", label: "LinkedIn" },
  ];

  const workshopSteps = [
    {
      num: "01", numBg: "bg-bauhaus-yellow", numText: "text-bauhaus-black", title: "Sketch", offset: "",
      img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=85&auto=format&fit=crop",
      alt: "Drafting table — technical sketches and rulers",
      ruleColor: "bg-bauhaus-yellow", dot: "bg-bauhaus-red rounded-full",
      desc: "Every form begins as a circle, square, triangle. Hand-rendered isometric drafts, never digital, never decorative.",
      meta: "Phase 0.1 → 0.4 · 14 days",
      cornerType: "vertical", cornerValue: "2024 · BERLIN"
    },
    {
      num: "02", numBg: "bg-bauhaus-blue", numText: "text-white", title: "Prototype", offset: "md:translate-y-12",
      img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=900&q=85&auto=format&fit=crop",
      alt: "Tubular steel bending machine",
      ruleColor: "bg-bauhaus-red", dot: "bg-bauhaus-blue",
      desc: "Cold-bent tubular steel, hand-stitched Eisengarn, bent ply. We test seven prototypes before approving the first production run.",
      meta: "Phase 0.5 → 0.8 · 32 days",
      cornerType: "circle"
    },
    {
      num: "03", numBg: "bg-bauhaus-red", numText: "text-white", title: "Production", offset: "",
      img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop",
      alt: "Workshop interior with finished pieces",
      ruleColor: "bg-bauhaus-blue", dot: "bg-bauhaus-yellow clip-triangle",
      desc: "Limited runs of 200 pieces, numbered and stamped. Each chair receives a final hand-inspection by a master craftsman before shipping.",
      meta: "Phase 0.9 → 1.0 · 9 days",
      cornerType: "triangle"
    }
  ];

  const heritageEntries = [
    { year: "1919", color: "text-bauhaus-red", text: <>Walter Gropius founds the Staatliches Bauhaus in Weimar. Manifesto: <em className="italic">Art into Industry.</em></> },
    { year: "1925", color: "text-bauhaus-blue", text: "School relocates to Dessau. Marcel Breuer designs the Wassily Chair — first commercial use of tubular steel." },
    { year: "1933", color: "text-bauhaus-yellow", text: "Bauhaus closes under political pressure. Disciples emigrate — the ideas spread to Chicago, Tel Aviv, Ulm." },
    { year: "2024", color: "text-bauhaus-cream", text: "WERKSTATT carries the principles forward. Same forms, same discipline, no nostalgia." }
  ];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    colors: {
      bauhaus: {
        cream: '#FDFBF7', red: '#D02D2D', blue: '#2D4CD0',
        yellow: '#F2C94C', black: '#121212', gray: '#E5E5E5'
      }
    },
    fontFamily: { sans: ['Jost', 'sans-serif'] },
    animation: {
      'spin-slow': 'spin 12s linear infinite',
      'marquee': 'marquee 20s linear infinite',
    },
    keyframes: {
      marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } }
    }
  } }
};`;

  const customCss = `body { background-color: #FDFBF7; color: #121212; }
.bg-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(18, 18, 18, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(18, 18, 18, 0.05) 1px, transparent 1px);
}
.blend-multiply { mix-blend-mode: multiply; }
.stroke-text { -webkit-text-stroke: 2px #121212; color: transparent; }
@media (max-width: 768px) { .stroke-text { -webkit-text-stroke: 1px #121212; } }
.vertical-text { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
.diagonal-stripes {
  background: repeating-linear-gradient(45deg, #121212, #121212 1px, transparent 1px, transparent 10px);
}
.clip-triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
.clip-slant { clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%); }
.marquee-container { mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #FDFBF7; }
::-webkit-scrollbar-thumb { background: #121212; }`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var isOpen = false;
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function(){
        isOpen = !isOpen;
        if (isOpen) {
          mobileMenu.classList.remove('translate-x-full');
          menuBtn.innerHTML = '<i data-lucide="x"></i>';
          document.body.style.overflow = 'hidden';
        } else {
          mobileMenu.classList.add('translate-x-full');
          menuBtn.innerHTML = '<i data-lucide="menu"></i>';
          document.body.style.overflow = 'auto';
        }
        lucide.createIcons();
      });
      document.querySelectorAll('.mobile-link').forEach(function(l){
        l.addEventListener('click', function(){
          isOpen = false;
          mobileMenu.classList.add('translate-x-full');
          menuBtn.innerHTML = '<i data-lucide="menu"></i>';
          document.body.style.overflow = 'auto';
          lucide.createIcons();
        });
      });
    }
    return;
  }
  setTimeout(init, 50);
})();`;

  const Marquee = () => (
    <div className="flex min-w-full shrink-0 animate-marquee items-center">
      {marqueeItems.map((it, i) => it.type === "text"
        ? <span key={i} className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mx-8">{it.value}</span>
        : <span key={i} className={it.className}></span>
      )}
    </div>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="scroll-smooth font-sans text-bauhaus-black overflow-x-hidden selection:bg-bauhaus-yellow selection:text-bauhaus-black bg-bauhaus-cream">
        <nav className="fixed top-0 w-full z-50 bg-bauhaus-cream/95 backdrop-blur-sm border-b border-bauhaus-black">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
            <a href="#" className="flex items-center gap-2 group cursor-pointer z-50">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-bauhaus-red blend-multiply rounded-sm"></div>
              </div>
              <div className="relative w-8 h-8 rounded-full bg-bauhaus-blue blend-multiply -ml-5 group-hover:ml-0 transition-all duration-300"></div>
              <div className="relative w-0 h-0 border-l-[16px] border-r-[16px] border-b-[32px] border-l-transparent border-r-transparent border-b-bauhaus-yellow blend-multiply -ml-5 group-hover:ml-0 transition-all duration-300 transform -translate-y-1"></div>
              <span className="font-bold text-xl tracking-[0.2em] ml-2 hidden sm:block">WERKSTATT</span>
            </a>
            <div className="hidden md:flex gap-8 font-semibold tracking-widest text-sm uppercase">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className={`${l.hover} transition-colors`}>{l.label}</a>
              ))}
            </div>
            <button id="menu-btn" className="md:hidden z-50 p-2">
              <i data-lucide="menu"></i>
            </button>
          </div>
          <div id="mobile-menu" className="fixed inset-0 bg-bauhaus-cream z-40 transform translate-x-full transition-transform duration-500 ease-in-out flex flex-col justify-center items-center border-l border-bauhaus-black">
            <div className="flex flex-col gap-10 text-4xl font-bold tracking-tighter uppercase text-center">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className={`mobile-link ${l.hover} transition-colors`}>{l.label}</a>
              ))}
              <a href="#contact" className="mobile-link text-xl font-normal font-mono mt-8">Contact Studio</a>
            </div>
          </div>
        </nav>

        <header className="relative min-h-[95vh] flex flex-col pt-24 border-b border-bauhaus-black bg-grid overflow-hidden">
          <div className="absolute top-[15%] left-[5%] w-32 h-32 md:w-64 md:h-64 rounded-full bg-bauhaus-red mix-blend-multiply opacity-90 z-0"></div>
          <div className="absolute bottom-[10%] right-[5%] w-40 h-40 md:w-80 md:h-80 bg-bauhaus-blue mix-blend-multiply opacity-80 transform rotate-6 z-0"></div>
          <div className="absolute top-[20%] right-[15%] w-0 h-0 border-l-[60px] border-r-[60px] border-b-[120px] md:border-l-[100px] md:border-r-[100px] md:border-b-[200px] border-l-transparent border-r-transparent border-b-bauhaus-yellow mix-blend-multiply opacity-90 transform -rotate-12 z-0"></div>

          <div className="container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center relative z-10">
            <div className="flex flex-col w-full max-w-7xl mx-auto">
              <div className="flex items-end">
                <h1 className="text-[14vw] md:text-[13vw] leading-[0.75] font-bold tracking-tight text-bauhaus-black">FORM</h1>
                <div className="hidden md:flex mb-4 ml-6 w-32 h-32 border border-bauhaus-black rounded-full items-center justify-center animate-spin-slow">
                  <span className="text-[10px] font-mono tracking-widest uppercase">Est. 1919 • Germany</span>
                </div>
              </div>
              <div className="flex justify-end relative">
                <div className="absolute left-0 top-1/2 w-1/4 h-1 bg-bauhaus-black hidden md:block"></div>
                <h1 className="text-[14vw] md:text-[13vw] leading-[0.75] font-bold tracking-tight stroke-text hover:text-bauhaus-black transition-colors duration-700 cursor-default">FOLLOWS</h1>
              </div>
              <div className="flex items-start">
                <div className="w-[5vw] md:w-[15vw]"></div>
                <h1 className="text-[14vw] md:text-[13vw] leading-[0.75] font-bold tracking-tight text-bauhaus-red mix-blend-multiply">FUNCTION</h1>
              </div>
            </div>
            <div className="md:hidden mt-8 border-l-2 border-bauhaus-black pl-4">
              <p className="font-bold uppercase tracking-widest text-sm">Design for living.</p>
              <p className="text-xs opacity-70 mt-1">Rejecting ornamentation for pure utility.</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-6 md:left-12 border-l border-r border-bauhaus-black h-16 w-16 flex items-center justify-center bg-white z-20">
            <i data-lucide="arrow-down" className="animate-bounce"></i>
          </div>
          <div className="absolute bottom-8 right-6 md:right-12 hidden md:block">
            <span className="font-mono text-xs tracking-widest">[ WEIMAR / DESSAU / BERLIN ]</span>
          </div>
        </header>

        <section className="py-6 border-b border-bauhaus-black bg-bauhaus-yellow overflow-hidden">
          <div className="flex whitespace-nowrap overflow-hidden">
            <Marquee />
            <Marquee />
          </div>
        </section>

        <section id="collection" className="relative py-24 bg-bauhaus-cream">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <h2 className="text-5xl md:text-6xl font-bold max-w-lg leading-[0.9]">OBJECTS OF<br /><span className="text-bauhaus-blue">UTILITY</span></h2>
              <div className="mt-8 md:mt-0">
                <p className="text-sm font-semibold uppercase tracking-wide border-l-4 border-bauhaus-yellow pl-4 mb-2">Rational Design</p>
                <p className="text-xs font-mono opacity-60 pl-5">Catalog 2024.1</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-x-8">
              {products.map(p => (
                <div key={p.name} className={`group relative flex flex-col items-center ${p.offset}`}>
                  <div className={`relative w-full ${p.aspect} overflow-hidden ${p.shape} border-2 border-bauhaus-black ${p.borderHover} transition-colors duration-500 bg-white`}>
                    {p.overlay && <div className="absolute top-0 right-0 w-24 h-24 bg-bauhaus-black clip-triangle z-10 pointer-events-none group-hover:bg-bauhaus-yellow transition-colors"></div>}
                    <img src={p.img} alt={p.alt} className="object-cover w-full h-full mix-blend-multiply grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500 hover:scale-110" />
                  </div>
                  <div className={`absolute -bottom-6 bg-bauhaus-cream border border-bauhaus-black px-6 py-3 ${p.labelRotate} group-hover:rotate-0 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <h3 className="font-bold text-lg leading-none">{p.name}</h3>
                    <span className="text-xs font-mono block text-center mt-1">{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="materials" className="py-24 border-t border-bauhaus-black bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-12 flex items-center gap-4">
              <span className="w-8 h-8 bg-bauhaus-black text-white flex items-center justify-center rounded-full">02</span>
              Primary Materials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-bauhaus-black border border-bauhaus-black">
              {materials.map(m => (
                <div key={m.title} className="p-10 hover:bg-neutral-50 transition-colors group">
                  <div className={`w-12 h-12 border-2 border-bauhaus-black rounded-full mb-6 flex items-center justify-center ${m.hoverBg} group-hover:text-white transition-colors`}>
                    <i data-lucide={m.icon} className="w-6 h-6"></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{m.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed font-medium text-gray-600">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workshop / Process Section */}
        <section id="process" className="relative py-24 bg-bauhaus-cream border-t border-bauhaus-black bg-grid">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-4">
                <span className="w-8 h-8 bg-bauhaus-red text-white flex items-center justify-center rounded-full">03</span>
                From The Workshop
              </h2>
              <span className="text-xs font-mono opacity-60 hidden md:block">Dessau · Schedule 4.2</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
              <h3 className="text-4xl md:text-7xl font-bold leading-[0.9] max-w-3xl">
                Pencil. Steel.<br />
                <span className="text-bauhaus-red">Function.</span>
              </h3>
              <p className="max-w-md text-base font-medium leading-relaxed border-l-4 border-bauhaus-blue pl-4 md:text-right md:border-l-0 md:border-r-4 md:pl-0 md:pr-4">
                Every object passes through three workshops — drafting, prototype, and production. The hand of the maker is visible at each station; the geometry stays pure throughout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {workshopSteps.map(s => (
                <article key={s.num} className={`group relative ${s.offset}`}>
                  <div className={`absolute -top-4 -left-4 w-14 h-14 ${s.numBg} ${s.numText} flex items-center justify-center font-mono font-bold text-lg z-20 border-2 border-bauhaus-black`}>{s.num}</div>
                  <div className="relative aspect-[4/5] overflow-hidden border-2 border-bauhaus-black bg-white">
                    <img src={s.img} alt={s.alt} className="object-cover w-full h-full mix-blend-multiply grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                    <div className={`absolute bottom-0 left-0 w-full h-1.5 ${s.ruleColor}`}></div>
                    {s.cornerType === "vertical" && (
                      <div className="absolute right-3 top-3 vertical-text font-mono text-[10px] tracking-widest opacity-80">{s.cornerValue}</div>
                    )}
                    {s.cornerType === "circle" && (
                      <div className="absolute left-3 top-3 w-8 h-8 border-2 border-bauhaus-black rounded-full bg-bauhaus-cream"></div>
                    )}
                    {s.cornerType === "triangle" && (
                      <div className="absolute top-3 right-3 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-bauhaus-yellow"></div>
                    )}
                  </div>
                  <div className="mt-6 flex items-baseline gap-3">
                    <span className={`w-3 h-3 shrink-0 ${s.dot}`}></span>
                    <h4 className="text-2xl font-bold uppercase tracking-tight">{s.title}</h4>
                  </div>
                  <p className="text-sm font-medium opacity-70 mt-2 leading-relaxed pl-6">{s.desc}</p>
                  <div className="mt-3 pl-6 font-mono text-[10px] uppercase tracking-widest opacity-60">{s.meta}</div>
                </article>
              ))}
            </div>

            <div className="mt-24 pt-6 border-t border-bauhaus-black flex flex-col md:flex-row justify-between gap-4 font-mono text-[11px] tracking-widest uppercase">
              <span>Total cycle · 55 days · No shortcuts</span>
              <span>200 pieces / model / year</span>
              <span className="text-bauhaus-red">Each numbered · Each signed</span>
            </div>
          </div>
        </section>

        {/* Heritage / Archive Section */}
        <section id="heritage" className="relative py-24 md:py-32 bg-bauhaus-black text-bauhaus-cream border-t border-bauhaus-black overflow-hidden">
          <div className="absolute top-12 right-12 w-40 h-40 rounded-full bg-bauhaus-red/20 hidden md:block"></div>
          <div className="absolute bottom-12 left-12 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[100px] border-l-transparent border-r-transparent border-b-bauhaus-yellow/15 hidden md:block"></div>

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7 relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 md:w-48 md:h-48 bg-bauhaus-red z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 md:w-40 md:h-40 rounded-full bg-bauhaus-yellow z-0"></div>
                <figure className="relative aspect-[4/5] overflow-hidden border-4 border-bauhaus-cream z-10">
                  <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=85&auto=format&fit=crop" alt="Architectural facade in Bauhaus style" className="w-full h-full object-cover grayscale contrast-125" />
                  <figcaption className="absolute bottom-4 left-4 right-4 bg-bauhaus-cream text-bauhaus-black px-4 py-3 flex justify-between items-center">
                    <span className="font-mono text-[10px] tracking-widest uppercase">Plate · IV</span>
                    <span className="text-xs font-bold uppercase">Bauhaus Building, Dessau · 1925</span>
                  </figcaption>
                </figure>
              </div>

              <div className="md:col-span-5">
                <h2 className="text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-4 mb-8 text-bauhaus-yellow">
                  <span className="w-8 h-8 bg-bauhaus-yellow text-bauhaus-black flex items-center justify-center rounded-full">04</span>
                  Heritage
                </h2>

                <h3 className="text-4xl md:text-6xl font-bold leading-[0.9] mb-10 tracking-tight">
                  One Hundred<br />
                  <span className="text-bauhaus-yellow italic font-normal">+ Five</span> Years.
                </h3>

                <ol className="border-t border-bauhaus-cream/30">
                  {heritageEntries.map((e, idx) => (
                    <li key={e.year} className={`grid grid-cols-12 gap-4 py-5 ${idx < heritageEntries.length - 1 ? "border-b border-bauhaus-cream/15" : ""} hover:bg-bauhaus-cream/5 transition-colors`}>
                      <span className={`col-span-3 font-mono font-bold ${e.color} tabular-nums text-lg`}>{e.year}</span>
                      <span className="col-span-9 text-sm font-medium leading-relaxed">{e.text}</span>
                    </li>
                  ))}
                </ol>

                <a href="#" className="inline-flex items-center gap-3 mt-10 px-6 py-3 border-2 border-bauhaus-yellow text-bauhaus-yellow font-bold uppercase tracking-widest text-xs hover:bg-bauhaus-yellow hover:text-bauhaus-black transition-colors">
                  <span>Read the full archive</span>
                  <i data-lucide="arrow-up-right" className="w-4 h-4"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="manifesto" className="relative py-32 overflow-hidden bg-bauhaus-black text-bauhaus-cream clip-slant border-t-8 border-bauhaus-yellow">
          <div className="absolute inset-0 opacity-20 diagonal-stripes"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-16">
              <div className="relative shrink-0">
                <div className="border-4 border-bauhaus-red p-8 transform -rotate-3 md:-rotate-6 bg-bauhaus-cream text-bauhaus-black shadow-[10px_10px_0px_0px_rgba(45,76,208,1)]">
                  <h2 className="text-4xl md:text-6xl font-bold uppercase leading-none text-center">Art into<br />Industry</h2>
                </div>
              </div>
              <div className="max-w-xl">
                <div className="flex gap-4 mb-6">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-bauhaus-red animate-pulse"></div>
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-bauhaus-blue"></div>
                  <div className="w-8 h-8 md:w-12 md:h-12 clip-triangle bg-bauhaus-yellow"></div>
                </div>
                <p className="text-xl md:text-3xl font-light leading-relaxed">
                  "The ultimate aim of all visual arts is the complete building. To embellish it was once the noblest function of the fine arts."
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-bauhaus-cream"></div>
                  <span className="uppercase tracking-[0.3em] text-sm">Walter Gropius, 1919</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="contact" className="flex flex-col md:flex-row w-full">
          <div className="flex-1 bg-bauhaus-red p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden group min-h-[350px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black opacity-10 rounded-bl-full transform group-hover:scale-150 transition-transform duration-500"></div>
            <div>
              <h4 className="text-2xl font-bold mb-6 border-b-2 border-white inline-block">VISIT</h4>
              <p className="text-xl opacity-90 leading-relaxed font-light">
                WERKSTATT HQ<br />
                Gropiusallee 38<br />
                06846 Dessau-Roßlau<br />
                Germany
              </p>
            </div>
            <a href="mailto:hello@werkstatt.de" className="text-2xl md:text-3xl font-bold mt-8 hover:underline break-words">hello@werkstatt.de</a>
          </div>

          <div className="flex-1 bg-bauhaus-blue p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden group min-h-[350px]">
            <div className="absolute bottom-0 left-0 w-full h-12 diagonal-stripes opacity-20"></div>
            <div>
              <h4 className="text-2xl font-bold mb-6 border-b-2 border-white inline-block">CONNECT</h4>
              <ul className="space-y-4 text-xl font-light">
                {socials.map(s => (
                  <li key={s.icon}><a href="#" className="hover:opacity-70 flex items-center gap-3"><i data-lucide={s.icon} className="w-5 h-5"></i> {s.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center mt-8 animate-spin-slow self-end md:self-auto">
              <i data-lucide="asterisk" className="w-8 h-8"></i>
            </div>
          </div>

          <div className="flex-1 bg-bauhaus-yellow p-10 md:p-16 text-bauhaus-black flex flex-col justify-between relative overflow-hidden min-h-[350px]">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 border-[24px] border-bauhaus-black rounded-full opacity-10"></div>
            <div>
              <h4 className="text-2xl font-bold mb-6 border-b-2 border-bauhaus-black inline-block">NEWSLETTER</h4>
              <p className="mb-6 font-semibold text-lg">Join the design movement.</p>
              <form className="flex flex-col gap-4 relative z-20">
                <input type="email" placeholder="Email Address" className="bg-transparent border-2 border-bauhaus-black p-4 placeholder-bauhaus-black/60 focus:outline-none focus:bg-white transition-colors" />
                <button type="submit" className="bg-bauhaus-black text-white py-4 font-bold hover:bg-white hover:text-black border-2 border-bauhaus-black transition-colors uppercase tracking-widest text-sm">Subscribe</button>
              </form>
            </div>
            <div className="flex justify-between items-end mt-12">
              <p className="text-xs font-mono">© 2024 WERKSTATT</p>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-bauhaus-red rounded-full"></div>
                <div className="w-3 h-3 bg-bauhaus-blue rounded-sm"></div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
