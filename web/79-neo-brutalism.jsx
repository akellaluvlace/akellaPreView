export default function T79NeoBrutalism() {
  const desktopLinks = [
    { href: "#work", label: "Work", deco: "decoration-neo-red" },
    { href: "#services", label: "Services", deco: "decoration-neo-yellow" },
    { href: "#about", label: "Agency", deco: "decoration-black" },
    { href: "#faq", label: "FAQ", deco: "decoration-neo-red" },
  ];
  const mobileLinks = ["Work", "Services", "Agency", "FAQ"];

  // Plates marquee — mixed-aspect tiles in chunky brutalist frames (M.8 + K.6 + K.10)
  const plates = [
    { id: "PLATE_01", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop", alt: "Plate 01 — Seoul backstreet", loc: "SEL · 02:14", locColor: "text-neo-red", frameBg: "bg-white", txtColor: "", rot: "transform -rotate-2", w: "w-72 sm:w-80", aspect: "aspect-[4/5]" },
    { id: "PLATE_02", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", alt: "Plate 02 — Circuit close-up", loc: "BER · 14:08", locColor: "", frameBg: "bg-neo-yellow", txtColor: "", rot: "", w: "w-96", aspect: "aspect-[16/10]" },
    { id: "PLATE_03", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=900&auto=format&fit=crop", alt: "Plate 03 — Studio portrait", loc: "LIS · 09:42", locColor: "text-neo-red", frameBg: "bg-white", txtColor: "", rot: "transform rotate-2", w: "w-72 sm:w-80", aspect: "aspect-[3/4]" },
    { id: "PLATE_04", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1000&auto=format&fit=crop", alt: "Plate 04 — Brutalist facade", loc: "SEL · 17:01", locColor: "", frameBg: "bg-neo-red", txtColor: "text-white", rot: "transform -rotate-1", w: "w-96", aspect: "aspect-[16/10]" },
    { id: "PLATE_05", img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=900&auto=format&fit=crop", alt: "Plate 05 — Editorial portrait", loc: "NYC · 22:30", locColor: "", frameBg: "bg-white", txtColor: "", rot: "", w: "w-72 sm:w-80", aspect: "aspect-[3/4]" },
    { id: "PLATE_06", img: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1000&auto=format&fit=crop", alt: "Plate 06 — Concrete corridor", loc: "TYO · 06:18", locColor: "text-neo-red", frameBg: "bg-neo-bg", txtColor: "", rot: "transform rotate-1", w: "w-96", aspect: "aspect-[16/10]" },
  ];

  const faqs = [
    { q: "How fast can you actually ship?", a: "Most launches land in 6-10 weeks. Tight scope can hit 5 days. We refuse projects we cannot ship without losing the edge — fast is a constraint, not a feature.", chip: "bg-neo-yellow", chipText: "" },
    { q: "Do you take retainers?", a: "Yes — capped at three at a time so we stay senior on every account. Retainers are billed monthly and scoped to a clear roadmap. No babysitting.", chip: "bg-neo-red", chipText: "text-white" },
    { q: "Will you work with our internal team?", a: "Always. We embed in your Slack, run weekly demos, and document everything we ship in a handover doc your team owns. No black boxes.", chip: "bg-neo-bg", chipText: "" },
    { q: "What is your minimum project?", a: "Identity sprints from $14k. Web builds from $32k. Launch campaigns scoped per channel. We send a fixed quote within 48h of the brief.", chip: "bg-neo-yellow", chipText: "" },
    { q: "Where are you based?", a: "HQ in Seoul. The studio runs across three time zones — Asia, Europe, and the Americas — so handoffs cross calendars cleanly. We ship 24/7 without all-nighters.", chip: "bg-neo-black", chipText: "text-white" },
  ];

  const heroChips = ["Brand Systems", "Web Experiences", "Launch Campaigns"];
  const heroStats = [
    { num: "25+", label: "Launches" },
    { num: "12", label: "Industries" },
    { num: "96%", label: "Repeat Rate" },
  ];

  const trustChips = ["Nimbus", "Orbit", "Volt Lab", "Prism", "Kinetic"];
  const trustStats = [
    { num: "2-4", label: "Week Sprints" },
    { num: "9.4", label: "Client NPS" },
    { num: "3", label: "Time Zones" },
    { num: "24/7", label: "Slack Support" },
  ];

  const services = [
    { bg: "bg-neo-bg", iconHover: "group-hover:bg-neo-red", icon: "pen-tool", title: "Brutal Branding", body: "Visual identities that punch you in the face. Logos, typography, and guidelines that refuse to be ignored.", items: ["Identity Systems", "Art Direction", "Guidelines"], textColor: "" },
    { bg: "bg-neo-red", iconHover: "group-hover:bg-neo-yellow", icon: "monitor", title: "Web Experience", body: "Frontend development that breaks rules. Interactive, fast, and aggressively responsive websites.", items: ["UX Strategy", "Frontend Build", "Performance"], textColor: "text-white" },
    { bg: "bg-neo-yellow", iconHover: "group-hover:bg-neo-bg", icon: "megaphone", title: "Loud Marketing", body: "Campaigns designed to disrupt feeds. Social strategy, content creation, and digital guerrilla warfare.", items: ["Campaign Strategy", "Content Production", "Growth Experiments"], textColor: "" },
  ];

  const process = [
    { num: "01", week: "Week 1", title: "Discovery", body: "Audit, goals, positioning, and the raw story that makes you unforgettable." },
    { num: "02", week: "Week 2", title: "Direction", body: "Moodboards, art direction, and the visual system that sets the tone." },
    { num: "03", week: "Weeks 3-6", title: "Design + Build", body: "Interfaces, motion, and code. We iterate in public and ship clean." },
    { num: "04", week: "Weeks 7-10", title: "Launch", body: "QA, analytics, and rollout. Then we fine-tune for momentum." },
  ];

  const aboutBullets = [
    { color: "bg-neo-red", text: "Senior-only team. No junior handoffs." },
    { color: "bg-neo-yellow", text: "Direct collaboration with founders and product leads." },
    { color: "bg-neo-bg", text: "Clear scope, clear timeline, no surprises." },
  ];
  const aboutCards = [
    { title: "Studio", body: "Seoul + Remote" },
    { title: "Team", body: "Strategy, Design, Dev" },
    { title: "Focus", body: "Product, Culture, Tech" },
    { title: "Availability", body: "Q3 - 2 slots" },
  ];

  const projects = [
    { title: "CoinCrush", subtitle: "UI/UX - Branding", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop", alt: "CoinCrush fintech dashboard", tag: "Fintech", tagBg: "bg-neo-yellow", chips: ["+42% Conv", "6 Week MVP"] },
    { title: "Neon Street", subtitle: "eCommerce - Social", img: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1000&auto=format&fit=crop", alt: "Neon Street fashion campaign", tag: "Fashion", tagBg: "bg-neo-red text-white", chips: ["3.1x ROAS", "DTC Launch"] },
    { title: "Pixel Wars", subtitle: "Web Dev - 3D Assets", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop", alt: "Pixel Wars game environment", tag: "Gaming", tagBg: "bg-neo-bg", chips: ["8k MAU", "Game Launch"] },
    { title: "Sonic Fest", subtitle: "Identity - Print", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop", alt: "Sonic Fest live event", tag: "Event", tagBg: "bg-neo-yellow", chips: ["Sold Out", "20k Attendees"] },
  ];

  const portfolioStats = [
    { num: "+48%", label: "Avg Conversion Lift" },
    { num: "1.8x", label: "Engagement Growth" },
    { num: "5 Days", label: "Fastest Launch" },
  ];

  const testimonials = [
    { quote: "RAW.kr turned our messy story into a brand people actually remember. Fast, fearless, and sharp.", name: "Jina Park - CMO, Nimbus" },
    { quote: "We shipped in six weeks and saw the cleanest conversion lift in our history.", name: "Mateo Ruiz - Founder, Volt Lab" },
    { quote: "They kept us bold but precise. The site feels premium without losing the edge.", name: "Aria Chen - Product Lead, Prism" },
  ];

  const socials = ["instagram", "twitter", "linkedin", "dribbble"];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet" />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                'neo-bg': '#E0E7FF',
                'neo-red': '#FF4D4D',
                'neo-yellow': '#FACC15',
                'neo-black': '#000000',
                'neo-white': '#FFFFFF',
              },
              fontFamily: { sans: ['Space Grotesk', 'sans-serif'], display: ['Syne', 'sans-serif'] },
              boxShadow: {
                'neo': '6px 6px 0px 0px #000000',
                'neo-hover': '2px 2px 0px 0px #000000',
                'neo-lg': '10px 10px 0px 0px #000000',
                'neo-mob': '4px 4px 0px 0px #000000',
              },
              borderWidth: { '3': '3px' },
              animation: { 'marquee': 'marquee 15s linear infinite', 'spin-slow': 'spin 8s linear infinite', 'plate-marquee': 'plate-marquee 60s linear infinite' },
              keyframes: {
                marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-100%)' } },
                'plate-marquee': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(calc(-50% - 12px))' } }
              }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #E0E7FF; color: #000000; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: #E0E7FF; border-left: 3px solid black; }
        ::-webkit-scrollbar-thumb { background: #FF4D4D; border: 3px solid black; }
        ::-webkit-scrollbar-thumb:hover { background: #FACC15; }
        .btn-neo { transition: all 0.1s ease; }
        .btn-neo:active, .btn-neo:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px #000000; }
        .border-hard { border: 3px solid black; }
        .stroke-black { text-shadow: -2px -2px 0 #000000, 2px -2px 0 #000000, -2px 2px 0 #000000, 2px 2px 0 #000000; }
        @media (max-width: 640px) { .neo-shadow-mobile { box-shadow: 4px 4px 0px 0px #000000; } }
        .plate-track { display: flex; gap: 24px; width: max-content; }
        .plate-track:hover { animation-play-state: paused; }
        .neo-faq summary::-webkit-details-marker { display: none; }
        .neo-faq summary { list-style: none; }
        .neo-faq summary .neo-chevron { transition: transform 200ms ease; }
        .neo-faq[open] summary .neo-chevron { transform: rotate(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee, .animate-plate-marquee, .animate-spin-slow, .animate-bounce { animation: none !important; }
          .neo-faq summary .neo-chevron { transition: none; }
        }
      ` }} />

      <div className="font-sans antialiased selection:bg-neo-red selection:text-white">

        <nav className="sticky top-0 z-50 bg-neo-bg border-b-3 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex-shrink-0 flex items-center">
                <a href="#" className="font-display font-extrabold text-3xl md:text-4xl tracking-tighter hover:text-neo-red transition-colors">RAW.kr</a>
              </div>
              <div className="hidden md:flex space-x-8 items-center">
                {desktopLinks.map((l) => (
                  <a key={l.href} href={l.href} className={`font-bold text-lg uppercase hover:underline decoration-3 ${l.deco} underline-offset-4`}>{l.label}</a>
                ))}
                <a href="mailto:hello@raw.kr" className="btn-neo bg-neo-black text-white px-6 py-2 border-hard font-bold uppercase shadow-neo hover:bg-neo-red transition-transform">Get Loud</a>
              </div>
              <div className="md:hidden flex items-center">
                <button id="mobile-menu-btn" className="text-black p-1 border-2 border-transparent hover:border-black focus:outline-none transition-colors">
                  <i data-lucide="menu" className="w-8 h-8"></i>
                </button>
              </div>
            </div>
          </div>
          <div id="mobile-menu" className="hidden md:hidden border-t-3 border-black bg-neo-yellow absolute w-full left-0 shadow-neo-lg z-50">
            <div className="flex flex-col items-center py-6 space-y-4">
              {mobileLinks.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="mobile-link text-2xl font-display font-black uppercase tracking-wide hover:text-neo-red">{l}</a>
              ))}
              <a href="mailto:hello@raw.kr" className="mt-4 w-10/12 text-center py-4 bg-neo-red text-white font-bold uppercase border-hard shadow-neo-mob btn-neo">Let's Talk</a>
            </div>
          </div>
        </nav>

        <header className="relative overflow-hidden pt-12 pb-16 lg:pt-32 lg:pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col items-start" data-aos="fade-right">
                <div className="inline-block bg-neo-yellow border-hard px-4 py-1 mb-6 shadow-neo transform -rotate-2 hover:rotate-0 transition-transform">
                  <span className="font-bold uppercase tracking-widest text-xs sm:text-sm">Est. 2024 // Seoul - Global</span>
                </div>
                <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl leading-none uppercase mb-6 sm:mb-8 break-words w-full">
                  We Build <span className="text-neo-red underline decoration-4 decoration-black underline-offset-4 md:underline-offset-8">Loud</span> Brands
                </h1>
                <p className="text-lg sm:text-2xl font-medium mb-6 sm:mb-8 max-w-xl border-l-4 border-black pl-4 sm:pl-6">
                  No fluff. No corporate jargon. Just raw creativity and digital chaos designed to convert.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {heroChips.map((c) => (
                    <span key={c} className="bg-white border-hard px-3 py-1 text-xs font-bold uppercase shadow-neo">{c}</span>
                  ))}
                </div>
                <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4">
                  <a href="mailto:hello@raw.kr" className="btn-neo w-full sm:w-auto bg-neo-red text-white border-hard px-8 py-4 text-lg sm:text-xl font-bold uppercase shadow-neo flex items-center justify-center gap-2">
                    Start Project <i data-lucide="arrow-right" className="w-6 h-6"></i>
                  </a>
                  <a href="#work" className="btn-neo w-full sm:w-auto bg-white text-black border-hard px-8 py-4 text-lg sm:text-xl font-bold uppercase shadow-neo hover:bg-neo-yellow">View Portfolio</a>
                </div>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-xl">
                  {heroStats.map((s) => (
                    <div key={s.label} className="bg-white border-hard p-4 shadow-neo text-center">
                      <div className="font-display text-2xl sm:text-3xl">{s.num}</div>
                      <div className="text-xs font-bold uppercase">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 relative mt-8 lg:mt-0" data-aos="fade-left" data-aos-delay="200">
                <div className="relative bg-white border-hard p-3 sm:p-4 shadow-neo-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-neo-black w-full h-64 sm:h-80 md:h-96 flex items-center justify-center overflow-hidden border-hard">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" alt="Abstract Art" className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0" />
                  </div>
                  <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-neo-yellow border-hard w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center animate-bounce z-20">
                    <i data-lucide="zap" className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-current"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="py-10 sm:py-12 bg-white border-b-3 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div data-aos="fade-right">
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase">Trusted by Teams with Taste</h2>
                <p className="mt-3 max-w-xl text-base sm:text-lg font-medium">Partnering with founders, product teams, and cultural brands across Seoul and beyond.</p>
              </div>
              <div className="flex flex-wrap gap-3" data-aos="fade-left">
                {trustChips.map((c) => (
                  <div key={c} className="bg-neo-bg border-hard px-4 py-2 shadow-neo text-xs sm:text-sm font-bold uppercase">{c}</div>
                ))}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4" data-aos="fade-up" data-aos-delay="150">
              {trustStats.map((s) => (
                <div key={s.label} className="bg-neo-bg border-hard p-4 shadow-neo text-center">
                  <div className="font-display text-2xl sm:text-3xl">{s.num}</div>
                  <div className="text-xs font-bold uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Witnessed / Plates — image marquee with chunky brutalist frames */}
        <section className="bg-neo-bg border-b-3 border-black py-12 sm:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div data-aos="fade-right">
                <span className="inline-block bg-neo-black text-white border-hard px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest mb-3">// Field Notes</span>
                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase">Witnessed</h2>
              </div>
              <p className="max-w-md text-base sm:text-lg font-medium border-l-4 border-black pl-4" data-aos="fade-left">
                Plates from launches in Seoul, Berlin, and Lisbon. Clipped, captioned, never cropped.
              </p>
            </div>
          </div>

          {/* Marquee track — py-3 wrapper for chunky-shadow clearance (K.10) */}
          <div className="overflow-hidden py-3">
            <div className="plate-track animate-plate-marquee">
              {plates.map((p) => (
                <figure key={p.id} className={`shrink-0 ${p.w} ${p.frameBg} border-hard p-2 shadow-neo ${p.rot}`}>
                  <div className={`${p.aspect} bg-neo-black border-hard overflow-hidden`}>
                    <img src={p.img} alt={p.alt} className="w-full h-full object-cover grayscale contrast-110" />
                  </div>
                  <figcaption className={`flex justify-between items-center pt-2 px-1 font-mono text-xs font-bold uppercase ${p.txtColor}`}>
                    <span>{`[ ${p.id} ]`}</span>
                    <span className={p.locColor}>{p.loc}</span>
                  </figcaption>
                </figure>
              ))}
              {/* Duplicate set for seamless loop */}
              {plates.map((p) => (
                <figure key={`dup-${p.id}`} aria-hidden="true" className={`shrink-0 ${p.w} ${p.frameBg} border-hard p-2 shadow-neo ${p.rot}`}>
                  <div className={`${p.aspect} bg-neo-black border-hard overflow-hidden`}>
                    <img src={p.img} alt="" className="w-full h-full object-cover grayscale contrast-110" />
                  </div>
                  <figcaption className={`flex justify-between items-center pt-2 px-1 font-mono text-xs font-bold uppercase ${p.txtColor}`}>
                    <span>{`[ ${p.id} ]`}</span>
                    <span className={p.locColor}>{p.loc}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <div className="border-y-3 border-black bg-neo-yellow py-4 sm:py-6 overflow-hidden relative">
          <div className="whitespace-nowrap animate-marquee flex gap-8">
            <span className="text-3xl sm:text-4xl font-display font-black uppercase mx-4">Strategy - Design - Development - Chaos - Strategy - Design - Development - Chaos -</span>
            <span className="text-3xl sm:text-4xl font-display font-black uppercase mx-4">Strategy - Design - Development - Chaos - Strategy - Design - Development - Chaos -</span>
          </div>
        </div>

        <section id="services" className="py-16 sm:py-24 bg-white border-b-3 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 sm:mb-16 gap-6">
              <div>
                <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase" data-aos="fade-up">Our <span className="bg-neo-bg px-2">Arsenal</span></h2>
                <p className="mt-3 max-w-2xl text-lg sm:text-xl font-medium" data-aos="fade-up" data-aos-delay="100">Full-stack creative for founders who want a brand that feels impossible to ignore.</p>
              </div>
              <div className="hidden md:block">
                <i data-lucide="crosshair" className="w-16 h-16 animate-spin-slow"></i>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((s, i) => (
                <div key={s.title} className={`group ${s.bg} border-hard p-6 sm:p-8 shadow-neo hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200`} data-aos="fade-up" data-aos-delay={(i + 1) * 100}>
                  <div className={`bg-white border-hard w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-6 ${s.iconHover} transition-colors`}>
                    <i data-lucide={s.icon} className="w-6 h-6 sm:w-8 sm:h-8"></i>
                  </div>
                  <h3 className={`font-display font-bold text-xl sm:text-2xl uppercase mb-4 ${s.textColor}`}>{s.title}</h3>
                  <p className={`font-medium text-base sm:text-lg leading-relaxed ${s.textColor}`}>{s.body}</p>
                  <ul className={`mt-4 text-xs sm:text-sm font-bold uppercase tracking-wide space-y-1 ${s.textColor}`}>
                    {s.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="py-16 sm:py-24 bg-neo-yellow border-b-3 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 sm:mb-16">
              <div>
                <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase" data-aos="fade-up">Process</h2>
                <p className="mt-3 max-w-2xl text-lg sm:text-xl font-medium" data-aos="fade-up" data-aos-delay="100">Fast, loud, focused. We ship in sprints so your brand hits the market before the noise catches up.</p>
              </div>
              <div className="bg-white border-hard px-4 py-2 shadow-neo font-bold uppercase text-xs sm:text-sm" data-aos="fade-left">Typical timeline: 6-10 weeks</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((p, i) => (
                <div key={p.num} className="bg-white border-hard p-6 shadow-neo" data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-3xl">{p.num}</span>
                    <span className="bg-neo-bg border-hard px-2 py-1 text-xs font-bold uppercase">{p.week}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl uppercase mb-3">{p.title}</h3>
                  <p className="font-medium text-sm sm:text-base">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-16 sm:py-24 bg-white border-b-3 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7" data-aos="fade-right">
                <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase mb-6">Agency, Not a Factory</h2>
                <p className="text-lg sm:text-xl font-medium max-w-xl">RAW.kr is a senior, hands-on studio focused on bold identities and fast-moving digital experiences. We do fewer projects so every launch hits harder.</p>
                <ul className="mt-6 space-y-3 text-base sm:text-lg font-medium">
                  {aboutBullets.map((b) => (
                    <li key={b.text} className="flex items-start gap-3">
                      <span className={`w-3 h-3 ${b.color} border-hard mt-2`}></span>
                      {b.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4" data-aos="fade-left">
                {aboutCards.map((c) => (
                  <div key={c.title} className="bg-neo-bg border-hard p-5 shadow-neo">
                    <h3 className="font-display font-bold text-xl uppercase mb-2">{c.title}</h3>
                    <p className="font-medium">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="py-16 sm:py-24 bg-neo-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase mb-4 text-center" data-aos="fade-up">Selected <span className="underline decoration-wavy decoration-neo-red decoration-4">Chaos</span></h2>
            <p className="text-lg sm:text-xl font-medium text-center max-w-2xl mx-auto mb-12 sm:mb-16" data-aos="fade-up" data-aos-delay="100">Case studies where bold design met measurable results.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              {projects.map((p, i) => (
                <div key={p.title} className="relative group" data-aos="zoom-in-up" data-aos-delay={i % 2 === 0 ? 0 : 100}>
                  <div className="border-hard bg-white p-2 shadow-neo group-hover:shadow-neo-lg transition-all duration-300">
                    <div className="aspect-video bg-gray-200 border-hard overflow-hidden relative">
                      <img src={p.img} alt={p.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className={`absolute top-4 right-4 ${p.tagBg} border-hard px-3 py-1 font-bold uppercase text-xs`}>{p.tag}</div>
                    </div>
                    <div className="p-4 sm:p-6 flex justify-between items-end">
                      <div>
                        <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase mb-2">{p.title}</h3>
                        <p className="font-mono text-xs sm:text-sm">{p.subtitle}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold uppercase">
                          {p.chips.map((c) => (
                            <span key={c} className="bg-neo-bg border-hard px-2 py-1">{c}</span>
                          ))}
                        </div>
                      </div>
                      <button className="w-10 h-10 sm:w-12 sm:h-12 bg-neo-black text-white flex items-center justify-center border-hard group-hover:bg-neo-red transition-colors">
                        <i data-lucide="arrow-up-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {portfolioStats.map((s, i) => (
                <div key={s.label} className="bg-white border-hard p-6 shadow-neo text-center" data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className="font-display text-3xl sm:text-4xl">{s.num}</div>
                  <p className="font-bold uppercase text-xs sm:text-sm mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 sm:mt-16 text-center">
              <button className="btn-neo w-full sm:w-auto bg-transparent border-hard px-10 py-4 text-xl font-bold uppercase hover:bg-black hover:text-white transition-colors">View Archive</button>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-white border-t-3 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 sm:mb-16">
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase" data-aos="fade-up">Client Proof</h2>
              <p className="text-lg sm:text-xl font-medium max-w-xl" data-aos="fade-up" data-aos-delay="100">Real teams. Real wins. No fluff testimonials.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <figure key={t.name} className="bg-neo-bg border-hard p-6 shadow-neo" data-aos="fade-up" data-aos-delay={i * 100}>
                  <blockquote className="text-lg font-medium">"{t.quote}"</blockquote>
                  <figcaption className="mt-4 text-xs sm:text-sm uppercase font-bold">{t.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — brutalist details accordion */}
        <section id="faq" className="py-16 sm:py-24 bg-neo-bg border-t-3 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5" data-aos="fade-right">
                <span className="inline-block bg-neo-red text-white border-hard px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest mb-4">// Read Me First</span>
                <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase mb-6 leading-none">
                  Loud Questions.<br />
                  <span className="bg-neo-yellow border-hard px-2 inline-block transform -rotate-1 mt-2">Plain Answers.</span>
                </h2>
                <p className="text-lg font-medium mb-8 max-w-md">Everything we get asked twice. Pricing, timelines, scope, the boring legal bit.</p>
                <div className="relative bg-white border-hard p-2 shadow-neo-lg transform rotate-1 max-w-sm">
                  <div className="aspect-[4/5] bg-neo-black border-hard overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=900&auto=format&fit=crop" alt="Studio at work" className="w-full h-full object-cover grayscale contrast-110" />
                  </div>
                  <div className="flex justify-between items-center pt-2 px-1 font-mono text-xs font-bold uppercase">
                    <span>[ STUDIO_LOG ]</span>
                    <span className="text-neo-red">REC · 03:11</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white border-hard shadow-neo-lg" data-aos="fade-left">
                {faqs.map((f, i) => (
                  <details key={f.q} className={`neo-faq ${i === faqs.length - 1 ? "" : "border-b-3 border-black"} p-5 sm:p-6 group`} open={i === 0 ? true : undefined}>
                    <summary className="flex justify-between items-center gap-4 cursor-pointer">
                      <h3 className="font-display font-bold text-lg sm:text-xl uppercase pr-4">{f.q}</h3>
                      <span className={`neo-chevron shrink-0 ${f.chip} ${f.chipText} border-hard w-10 h-10 flex items-center justify-center shadow-neo`}>
                        <i data-lucide="chevron-down" className="w-5 h-5"></i>
                      </span>
                    </summary>
                    <p className="mt-4 text-base sm:text-lg font-medium leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-neo-black text-white border-t-3 border-black pt-16 sm:pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 sm:mb-20">
              <div className="text-center md:text-left">
                <h2 className="font-display font-black text-5xl sm:text-6xl md:text-8xl uppercase leading-none mb-6">
                  Ready to<br />
                  <span className="text-neo-yellow stroke-black">Get Raw?</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-md mx-auto md:mx-0">Drop us a line. We promise we won't use the word "synergy".</p>
                <a href="mailto:hello@raw.kr" className="btn-neo inline-block bg-neo-red text-white border-white border-3 px-8 py-4 text-lg sm:text-xl font-bold uppercase shadow-[6px_6px_0px_0px_#FFFFFF] hover:shadow-none hover:bg-neo-yellow hover:text-black">hello@raw.kr</a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {socials.map((s) => (
                  <a key={s} href="#" className="border-2 border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-colors flex flex-col items-center justify-center gap-2">
                    <i data-lucide={s} className="w-6 h-6 sm:w-8 sm:h-8"></i>
                    <span className="font-bold uppercase text-sm sm:text-base">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
              <div className="font-display font-bold text-2xl uppercase">RAW.kr</div>
              <div className="text-gray-500 font-mono text-xs sm:text-sm">(c) 2026 RAW Creative Agency. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>

      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function init() {
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof AOS !== 'undefined') AOS.init({ duration: 800, offset: 50, once: true, easing: 'ease-out-cubic' });
            const btn = document.getElementById('mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');
            if (!btn || !menu) return;
            const links = document.querySelectorAll('.mobile-link');
            btn.addEventListener('click', () => menu.classList.toggle('hidden'));
            links.forEach(link => link.addEventListener('click', () => menu.classList.add('hidden')));
          }
          // preview iframe re-emits inline scripts after React mounts, so
          // document is always 'complete' here — no DOMContentLoaded fallback
          // needed (it would silently never fire). The 50ms delay gives the
          // lucide / AOS UMD scripts a tick to finish loading.
          setTimeout(init, 50);
        })();
      ` }} />
    </>
  );
}
