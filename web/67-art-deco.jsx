export default function T67ArtDeco() {
  const navLinks = [
    { href: "#about", label: "Story" },
    { href: "#menu", label: "Libations" },
    { href: "#events", label: "Society & Jazz" },
    { href: "#reserve", label: "Reserve" },
  ];

  const signatures = [
    { name: "The Daisy Buchanan", price: "$24", desc: "Gin • Champagne • Lemon • Honey • Gold Flake" },
    { name: "West Egg Fizz", price: "$22", desc: "Vodka • Elderflower • Egg White • Lime • Basil" },
    { name: "Green Light", price: "$28", desc: "Absinthe • Melon Liqueur • Dry Vermouth • Smoke" },
  ];

  const oldFashioned = [
    { name: "Old Sport", price: "$26", desc: "Aged Bourbon • Smoked Maple • Angostura • Orange" },
    { name: "The Bootlegger", price: "$25", desc: "Rye Whiskey • Cognac • Peychaud's • Absinthe Rinse" },
    { name: "Valley of Ashes", price: "$24", desc: "Mezcal • Charcoal • Agave • Lime • Salt Rim" },
  ];

  const events = [
    { day: "FRI", date: "OCT 20", title: "The Fitzgerald Trio", sub: "Classic Swing & Piano", time: "9:00 PM", cover: "No Cover" },
    { day: "SAT", date: "OCT 21", title: "Lady Midnight", sub: "Sultry Vocals & Saxophone", time: "10:00 PM", cover: "No Cover" },
  ];

  const atmosphere = [
    { numeral: "I",   title: "The Velvet Booth", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt: "Dimly lit speakeasy interior with red leather banquettes and brass detailing" },
    { numeral: "II",  title: "Liquid Gold",      img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt: "Crystal coupe glass holding an amber cocktail with a single twist of citrus peel" },
    { numeral: "III", title: "Brass & Smoke",    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt: "Aged brass apothecary still-life with crystal decanters under low directional light" },
    { numeral: "IV",  title: "The Trio",         img: "https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt: "Jazz musician at a vintage microphone bathed in warm stage light" },
    { numeral: "V",   title: "Last Pour",        img: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt: "Bartender pouring spirits behind a marble counter with vintage glassware" },
  ];

  const guestOptions = ["2 Guests", "3 Guests", "4 Guests", "5+ Guests"];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    colors: { deco: { black: '#050505', dark: '#0a0a0a', gold: '#D4AF37', goldlight: '#F4CF57', golddim: '#8a7122' } },
    fontFamily: { header: ['Marcellus','serif'], body: ['Tenor Sans','sans-serif'] },
    backgroundImage: {
      'sunburst': 'repeating-linear-gradient(90deg, #050505 0px, #050505 20px, #0a0a0a 21px, #050505 22px), radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 60%)',
      'grain': 'url("data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\' opacity=\\'0.05\\'/%3E%3C/svg%3E")',
    },
    spacing: { '128': '32rem' },
  } }
};`;

  const customCss = `body { background-color:#050505; color:#D4AF37; font-family:'Tenor Sans',sans-serif; }
::-webkit-scrollbar { width:8px; }
::-webkit-scrollbar-track { background:#050505; }
::-webkit-scrollbar-thumb { background:#333; border:1px solid #D4AF37; }
::-webkit-scrollbar-thumb:hover { background:#D4AF37; }
::selection { background:#D4AF37; color:#050505; }
.diamond-pattern {
  background-image:
    linear-gradient(135deg, #151515 25%, transparent 25%),
    linear-gradient(225deg, #151515 25%, transparent 25%),
    linear-gradient(45deg, #151515 25%, transparent 25%),
    linear-gradient(315deg, #151515 25%, transparent 25%);
  background-position: 10px 0, 10px 0, 0 0, 0 0;
  background-size: 20px 20px;
  background-repeat: repeat;
  opacity: 0.2;
}
.border-double-deco { border:1px solid #D4AF37; box-shadow: inset 0 0 0 4px #050505, inset 0 0 0 5px #8a7122; }
.text-glow { text-shadow: 0 0 15px rgba(212,175,55,0.4); }
.dot-leader {
  background-image: radial-gradient(circle, #8a7122 1px, transparent 1px);
  background-size: 6px 1px; background-repeat: repeat-x; background-position: bottom;
}
.framed-image { position:relative; transition: all 0.5s ease; }
.framed-image::after { content:''; position:absolute; inset:10px; border:1px solid rgba(212,175,55,0.5); transition: all 0.5s ease; }
.framed-image:hover::after { inset:0px; border-color:#D4AF37; }`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) { lucide.createIcons(); return; }
  setTimeout(init, 50);
})();`;

  const MenuItem = ({ m }) => (
    <div className="group">
      <div className="flex items-end justify-between w-full font-header text-lg md:text-xl">
        <span className="text-deco-gold group-hover:text-white transition-colors">{m.name}</span>
        <div className="flex-grow mx-2 mb-1 dot-leader opacity-50"></div>
        <span className="text-deco-goldlight">{m.price}</span>
      </div>
      <p className="text-xs text-deco-golddim mt-1 font-body tracking-wider uppercase">{m.desc}</p>
    </div>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Tenor+Sans&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="scroll-smooth min-h-screen p-3 md:p-6 lg:p-8 flex flex-col relative font-body selection:bg-deco-gold selection:text-deco-black">

        <div className="fixed inset-0 bg-sunburst -z-20 opacity-80"></div>
        <div className="fixed inset-0 diamond-pattern -z-10"></div>
        <div className="fixed inset-0 bg-grain -z-10 pointer-events-none opacity-50 mix-blend-overlay"></div>

        <div className="border border-deco-gold/80 w-full flex-grow relative flex flex-col max-w-[1400px] mx-auto bg-deco-black/80 backdrop-blur-sm shadow-2xl">

          <div className="absolute top-0 left-0 w-6 h-6 md:w-12 md:h-12 border-t-2 border-l-2 border-deco-gold"></div>
          <div className="absolute top-2 left-2 w-4 h-4 md:w-8 md:h-8 border-t border-l border-deco-gold/50"></div>
          <div className="absolute top-0 right-0 w-6 h-6 md:w-12 md:h-12 border-t-2 border-r-2 border-deco-gold"></div>
          <div className="absolute top-2 right-2 w-4 h-4 md:w-8 md:h-8 border-t border-r border-deco-gold/50"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 md:w-12 md:h-12 border-b-2 border-l-2 border-deco-gold"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 md:w-8 md:h-8 border-b border-l border-deco-gold/50"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 md:w-12 md:h-12 border-b-2 border-r-2 border-deco-gold"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 md:w-8 md:h-8 border-b border-r border-deco-gold/50"></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-deco-black border-b border-deco-gold/50 hidden md:block"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-deco-black border border-deco-gold rotate-45 transform -translate-y-1/2 z-10 hidden md:block"></div>

          <main className="flex-grow flex flex-col items-center justify-start w-full">

            <nav className="w-full flex justify-center py-6 md:py-8 border-b border-deco-gold/20 z-20">
              <ul className="flex flex-wrap justify-center gap-6 md:gap-12 text-xs md:text-sm uppercase tracking-[0.2em] font-header text-deco-golddim">
                {navLinks.slice(0, 2).map(l => (
                  <li key={l.href}><a href={l.href} className="hover:text-deco-gold transition-colors duration-300">{l.label}</a></li>
                ))}
                <li className="hidden md:block text-deco-gold">•</li>
                {navLinks.slice(2).map(l => (
                  <li key={l.href}><a href={l.href} className="hover:text-deco-gold transition-colors duration-300">{l.label}</a></li>
                ))}
              </ul>
            </nav>

            <header className="text-center w-full py-20 md:py-32 px-4 relative overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-t from-deco-gold/5 to-transparent rounded-full blur-3xl -z-10"></div>

              <div className="relative w-40 h-40 md:w-64 md:h-64 mx-auto mb-10 md:mb-12 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                <div className="absolute inset-0 border-2 border-deco-gold transform rotate-45 shadow-[0_0_20px_rgba(212,175,55,0.2)]"></div>
                <div className="absolute inset-3 border border-deco-golddim transform rotate-45"></div>
                <div className="absolute inset-0 border border-deco-gold/30 transform rotate-45 scale-110"></div>

                <div className="z-10 bg-deco-black p-4 relative">
                  <h1 className="font-header text-5xl md:text-7xl tracking-widest text-glow leading-none">
                    THE<br /><span className="text-4xl md:text-6xl">GATSBY</span>
                  </h1>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-deco-gold"></div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-deco-gold/90 font-body tracking-[0.3em] text-xs md:text-lg animate-pulse">
                <span className="w-8 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-deco-gold"></span>
                <span>EST. 1922</span>
                <span className="w-8 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-deco-gold"></span>
              </div>

              <p className="mt-6 font-body uppercase tracking-[0.2em] text-[10px] md:text-xs text-deco-golddim max-w-md mx-auto leading-loose">
                Where the champagne never stops and the party never ends
              </p>

              <div className="mt-10">
                <a href="#reserve" className="relative inline-flex items-center justify-center px-10 py-3 overflow-hidden font-header font-medium tracking-[0.2em] text-deco-black bg-deco-gold transition duration-300 ease-out group hover:bg-white">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative">Book A Table</span>
                </a>
              </div>
            </header>

            <div className="w-full flex items-center justify-center gap-2 mb-16 opacity-60 px-8">
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-deco-gold to-deco-gold"></div>
              <div className="w-2 h-2 bg-deco-gold rotate-45"></div>
              <div className="w-3 h-3 border border-deco-gold rotate-45 mx-1"></div>
              <div className="w-2 h-2 bg-deco-gold rotate-45"></div>
              <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-deco-gold to-deco-gold"></div>
            </div>

            <section id="about" className="w-full max-w-5xl mx-auto px-6 md:px-12 mb-24">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2 relative">
                  <div className="framed-image aspect-[3/4] md:aspect-square w-full bg-deco-dark border-double-deco p-2">
                    <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Bar Interior" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0" />
                  </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <h2 className="font-header text-3xl md:text-4xl mb-6 tracking-[0.15em] text-glow">The Roaring Reborn</h2>
                  <p className="font-body text-deco-golddim leading-loose mb-6 text-sm md:text-base">
                    Step beyond the velvet rope and into an era of unbridled opulence. The Gatsby is not merely a bar; it is a time machine to the golden age of jazz, clandestine meetings, and artisanal spirits.
                  </p>
                  <p className="font-body text-deco-golddim leading-loose mb-8 text-sm md:text-base">
                    Designed with the geometry of Art Deco and the soul of the Prohibition, we invite you to shed the modern world and indulge in the timeless art of celebration.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-deco-gold">
                    <i data-lucide="award" className="w-5 h-5"></i>
                    <span className="font-header text-xs tracking-widest uppercase">Best Speakeasy 2024</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="menu" className="w-full max-w-6xl mx-auto px-6 md:px-12 mb-24 relative">
              <div className="absolute inset-0 bg-deco-black/50 backdrop-blur-sm -z-10 border-y border-deco-gold/20"></div>

              <div className="text-center mb-16 pt-12">
                <span className="text-deco-golddim uppercase tracking-[0.4em] text-xs">Curated Libations</span>
                <h2 className="font-header text-4xl md:text-5xl mt-3 tracking-[0.2em] text-glow">The Collection</h2>
                <div className="w-24 h-1 bg-deco-gold mx-auto mt-6"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 pb-12">
                <div>
                  <h3 className="font-header text-2xl text-center mb-10 text-white border-b border-deco-gold/30 pb-2 inline-block w-full">Signatures</h3>
                  <div className="space-y-8">
                    {signatures.map(m => <MenuItem key={m.name} m={m} />)}
                  </div>
                </div>

                <div>
                  <h3 className="font-header text-2xl text-center mb-10 text-white border-b border-deco-gold/30 pb-2 inline-block w-full">Old Fashioned & Stout</h3>
                  <div className="space-y-8">
                    {oldFashioned.map(m => <MenuItem key={m.name} m={m} />)}
                  </div>
                </div>
              </div>

              <div className="text-center pb-12">
                <button className="text-xs uppercase tracking-[0.3em] text-deco-gold border-b border-transparent hover:border-deco-gold transition-all pb-1">Download Full Menu (PDF)</button>
              </div>
            </section>

            {/* ORNATE DIVIDER (between menu and atmosphere) */}
            <div className="w-full flex items-center justify-center gap-2 mb-16 opacity-60 px-8">
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-deco-gold to-deco-gold"></div>
              <div className="w-2 h-2 bg-deco-gold rotate-45"></div>
              <div className="w-3 h-3 border border-deco-gold rotate-45 mx-1"></div>
              <div className="w-2 h-2 bg-deco-gold rotate-45"></div>
              <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-deco-gold to-deco-gold"></div>
            </div>

            {/* ATMOSPHERE / IMAGE STRIP */}
            <section id="atmosphere" className="w-full max-w-6xl mx-auto px-6 md:px-12 mb-24">
              <div className="text-center mb-14">
                <span className="text-deco-golddim uppercase tracking-[0.4em] text-xs">From The Floor</span>
                <h2 className="font-header text-4xl md:text-5xl mt-3 tracking-[0.2em] text-glow">Atmosphere</h2>
                <div className="w-24 h-1 bg-deco-gold mx-auto mt-6"></div>
                <p className="font-body text-deco-golddim text-xs md:text-sm uppercase tracking-[0.2em] mt-6 max-w-xl mx-auto leading-loose">
                  Five frames from the floor. Velvet, brass, gilt, and the slow blue smoke of a Tuesday set.
                </p>
              </div>

              <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
                {atmosphere.map((a) => (
                  <li key={a.numeral} className="group flex flex-col">
                    <figure className="framed-image relative aspect-[3/4] bg-deco-dark border-double-deco p-2 overflow-hidden">
                      <img src={a.img} alt={a.alt} loading="lazy" decoding="async"
                           className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
                      <span className="absolute bottom-2 left-2 right-2 text-center font-header text-[10px] tracking-[0.4em] uppercase text-deco-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-deco-black/70 py-1">{a.title}</span>
                    </figure>
                    <figcaption className="mt-3 flex items-end justify-between font-header tracking-[0.2em] uppercase text-deco-gold text-[11px]">
                      <span className="text-deco-goldlight tabular-nums">{a.numeral}</span>
                      <div className="flex-grow mx-2 mb-1 dot-leader opacity-50"></div>
                      <span className="text-deco-golddim">{a.title}</span>
                    </figcaption>
                  </li>
                ))}
              </ul>

              <div className="text-center mt-10">
                <span className="font-body text-[10px] uppercase tracking-[0.4em] text-deco-golddim/70">Photographs by House · Floor No. 02 · MMXXIV</span>
              </div>
            </section>

            <section id="events" className="w-full bg-deco-dark border-y border-deco-gold/30 py-20 mb-24 relative overflow-hidden">
              <div className="absolute inset-0 diamond-pattern opacity-10"></div>

              <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-deco-gold/30 pb-4">
                  <div>
                    <span className="text-deco-golddim uppercase tracking-widest text-xs font-bold block mb-2">Live Entertainment</span>
                    <h2 className="font-header text-3xl md:text-4xl text-glow">Society & Jazz</h2>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <i data-lucide="music" className="w-8 h-8 text-deco-gold opacity-80"></i>
                  </div>
                </div>

                <div className="space-y-6">
                  {events.map(e => (
                    <div key={e.day} className="flex flex-col md:flex-row md:items-center justify-between group hover:bg-deco-gold/5 p-4 transition-colors border border-transparent hover:border-deco-gold/20">
                      <div className="flex items-center gap-6">
                        <div className="font-header text-center w-16">
                          <span className="block text-2xl text-deco-gold">{e.day}</span>
                          <span className="block text-sm text-deco-golddim">{e.date}</span>
                        </div>
                        <div>
                          <h3 className="font-header text-xl uppercase tracking-wider group-hover:text-white transition-colors">{e.title}</h3>
                          <p className="text-sm text-deco-golddim">{e.sub}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <span className="block font-body text-sm uppercase tracking-widest text-deco-gold">{e.time}</span>
                        <span className="block text-xs text-deco-golddim">{e.cover}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="reserve" className="text-center mb-24 px-6 w-full max-w-2xl mx-auto">
              <div className="border-double-deco p-8 md:p-12 relative bg-deco-black">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-deco-black px-4">
                  <i data-lucide="martini" className="w-10 h-10 text-deco-gold"></i>
                </div>

                <h3 className="font-header text-3xl uppercase tracking-[0.2em] mb-4 mt-4">Secure Your Spot</h3>
                <p className="font-body text-deco-golddim mb-8 leading-relaxed max-w-lg mx-auto">
                  Seating is limited. Reservations are highly recommended for evening service, particularly on weekends when the jazz is hot.
                </p>

                <form className="space-y-4 max-w-md mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" className="w-full bg-deco-dark border border-deco-gold/40 p-3 text-sm text-deco-gold focus:outline-none focus:border-deco-gold placeholder-deco-golddim/50 font-body uppercase tracking-wider" />
                    <input type="email" placeholder="Email" className="w-full bg-deco-dark border border-deco-gold/40 p-3 text-sm text-deco-gold focus:outline-none focus:border-deco-gold placeholder-deco-golddim/50 font-body uppercase tracking-wider" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="date" className="w-full bg-deco-dark border border-deco-gold/40 p-3 text-sm text-deco-golddim focus:outline-none focus:border-deco-gold font-body uppercase tracking-wider" />
                    <select className="w-full bg-deco-dark border border-deco-gold/40 p-3 text-sm text-deco-golddim focus:outline-none focus:border-deco-gold font-body uppercase tracking-wider">
                      {guestOptions.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <button type="button" className="w-full bg-deco-gold text-deco-black font-header font-bold uppercase tracking-widest py-3 hover:bg-white transition-colors duration-300">
                    Request Reservation
                  </button>
                </form>
              </div>
            </section>

          </main>

          <footer className="w-full border-t border-deco-gold/50 py-12 relative bg-deco-black z-20">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-deco-black border border-deco-gold rotate-45"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 md:px-16 items-start">
              <div className="text-center md:text-left space-y-2">
                <h4 className="font-header uppercase tracking-widest text-xl mb-4 text-deco-gold">Location</h4>
                <p className="font-body text-sm text-deco-golddim uppercase tracking-widest leading-relaxed">
                  1920 Prohibition Ave<br />
                  SoHo, New York<br />
                  NY 10012
                </p>
                <p className="font-body text-sm text-deco-golddim mt-4">(212) 555-0199</p>
              </div>

              <div className="text-center">
                <h4 className="font-header uppercase tracking-widest text-lg mb-4 text-white">The Telegram</h4>
                <p className="text-xs text-deco-golddim mb-4 font-body">Join our mailing list for exclusive invites.</p>
                <div className="flex border-b border-deco-gold">
                  <input type="text" placeholder="Enter your email" className="bg-transparent w-full py-2 text-sm text-deco-gold focus:outline-none placeholder-deco-golddim/40 font-body" />
                  <button className="text-deco-gold hover:text-white uppercase text-xs font-bold tracking-widest"><i data-lucide="arrow-right" className="w-4 h-4"></i></button>
                </div>
                <div className="flex justify-center gap-6 mt-8">
                  <a href="#" className="text-deco-golddim hover:text-deco-gold transition-colors"><i data-lucide="instagram" className="w-5 h-5"></i></a>
                  <a href="#" className="text-deco-golddim hover:text-deco-gold transition-colors"><i data-lucide="facebook" className="w-5 h-5"></i></a>
                </div>
              </div>

              <div className="text-center md:text-right space-y-2">
                <h4 className="font-header uppercase tracking-widest text-xl mb-4 text-deco-gold">Hours</h4>
                <p className="font-body text-sm text-deco-golddim uppercase tracking-widest leading-relaxed">
                  Tue - Thu: 5pm - 1am<br />
                  Fri - Sat: 5pm - 3am<br />
                  Sun: 5pm - 12am
                </p>
                <p className="font-body text-xs text-deco-golddim/60 mt-4 uppercase">Closed Mondays</p>
              </div>
            </div>

            <div className="text-center mt-12 pt-6 border-t border-deco-gold/10 mx-12">
              <p className="font-body text-[10px] text-deco-golddim tracking-[0.2em] uppercase">
                &copy; 2024 The Gatsby. Drink Responsibly. Designed with Elegance.
              </p>
            </div>
          </footer>

        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
