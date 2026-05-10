const KAWAII_MARQUEE_TILES = [
  {
    src: "https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/rimsha-noor-p6-O0Cc5RAc-unsplash_axlq9s.jpg",
    alt: "Strawberry batch",
    width: "w-56 md:w-64",
    aspect: "aspect-[3/4]",
    bg: "bg-kawaii-pink/20",
    rotate: "-rotate-1",
    no: "No. 01",
    noColor: "text-kawaii-pinkdark",
    meta: "Berry batch · 6:42am",
    metaColor: "text-kawaii-text",
  },
  {
    src: "https://images.unsplash.com/photo-1604498149220-bfb7c7cfd19b?w=900&q=85&auto=format&fit=crop",
    alt: "Matcha batch",
    width: "w-72 md:w-80",
    aspect: "aspect-[16/10]",
    bg: "bg-kawaii-green/20",
    rotate: "rotate-1",
    no: "No. 02",
    noColor: "text-kawaii-text",
    meta: "Uji matcha · 7:15am",
    metaColor: "text-kawaii-green",
  },
  {
    src: "https://images.unsplash.com/photo-1635355347994-b79177b77e5c?w=600&q=85&auto=format&fit=crop",
    alt: "Vanilla batch",
    width: "w-56 md:w-64",
    aspect: "aspect-[3/4]",
    bg: "bg-kawaii-blue/20",
    rotate: "-rotate-2",
    no: "No. 03",
    noColor: "text-kawaii-bluedark",
    meta: "Sky cream · 8:02am",
    metaColor: "text-kawaii-text",
  },
  {
    src: "https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/andreas-haubold-OTmHU9HdkHo-unsplash_zkcy5o.jpg",
    alt: "Assorted box",
    width: "w-80 md:w-96",
    aspect: "aspect-[16/10]",
    bg: "bg-kawaii-cream",
    rotate: "rotate-1",
    no: "No. 04",
    noColor: "text-kawaii-text",
    meta: "Mixed box · 9:00am",
    metaColor: "text-kawaii-pinkdark",
  },
  {
    src: "https://images.unsplash.com/photo-1662499866669-e7cf3acc5e1a?w=600&q=85&auto=format&fit=crop",
    alt: "Mango batch",
    width: "w-56 md:w-64",
    aspect: "aspect-[3/4]",
    bg: "bg-kawaii-cream",
    rotate: "-rotate-1",
    no: "No. 05",
    noColor: "text-yellow-500",
    meta: "Thai mango · 9:38am",
    metaColor: "text-kawaii-text",
  },
  {
    src: "https://images.unsplash.com/photo-1623133894375-ce20135ee521?w=900&q=85&auto=format&fit=crop",
    alt: "Hands shaping mochi",
    width: "w-72 md:w-80",
    aspect: "aspect-[16/10]",
    bg: "bg-kawaii-lavender/30",
    rotate: "rotate-2",
    no: "No. 06",
    noColor: "text-kawaii-text",
    meta: "Hand-shaped · 10:11am",
    metaColor: "text-kawaii-pinkdark",
  },
];

const KAWAII_FAQS = [
  {
    q: "How long does shipping take?",
    a: "We hand-pack and ship every order within 24 hours, chilled. Most boxes arrive in 1–3 days within the country, kept cool with our reusable little ice-pillows.",
    border: "border-kawaii-pink/30",
    hover: "hover:border-kawaii-pink",
    chipBg: "bg-kawaii-pink/15",
    chipText: "text-kawaii-pinkdark",
  },
  {
    q: "Are the mochi really gluten-free?",
    a: "Yes! Our dough is made from 100% sweet rice flour (mochiko) — naturally gluten-free. We prep in a dedicated workspace to keep things friendly for sensitive tummies.",
    border: "border-kawaii-blue/30",
    hover: "hover:border-kawaii-blue",
    chipBg: "bg-kawaii-blue/15",
    chipText: "text-kawaii-bluedark",
  },
  {
    q: "How do I store them once they arrive?",
    a: "Pop them in the fridge and enjoy within 5 days for peak fluff. For longer storage, freeze them — let each piece rest at room temp for 8–10 minutes before nibbling.",
    border: "border-kawaii-green/40",
    hover: "hover:border-kawaii-green",
    chipBg: "bg-kawaii-green/30",
    chipText: "text-kawaii-text",
  },
  {
    q: "Can I customise a gift box?",
    a: "Absolutely. Pick your 9 or 16 favorite mochi, add a handwritten note, and choose from three pastel ribbon colors. Birthdays, just-becauses, and apology gifts welcome.",
    border: "border-kawaii-lavender/40",
    hover: "hover:border-kawaii-lavender",
    chipBg: "bg-kawaii-lavender/40",
    chipText: "text-kawaii-text",
  },
  {
    q: "Do you do subscriptions?",
    a: "Yes — the Mochi Club ships a surprise seasonal box every two or four weeks, with two flavors that never appear on the regular menu. Pause anytime, no awkward emails.",
    border: "border-kawaii-cream",
    hover: "hover:border-yellow-300",
    chipBg: "bg-kawaii-cream",
    chipText: "text-yellow-500",
  },
];

function PastelKawaii() {
  return (
    <>
      {/* head */}
      <title>MOCHI_DREAMS | Taste the Clouds</title>
      <meta name="description" content="Handcrafted kawaii mochi desserts made with love and magic." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        heading: ['"Fredoka One"', 'cursive'],
                        body: ['"Quicksand"', 'sans-serif'],
                    },
                    colors: {
                        kawaii: {
                            pink: '#FFC8DD',
                            pinkdark: '#FFAECC',
                            blue: '#A2D2FF',
                            bluedark: '#8ECAFC',
                            green: '#CDEAC0',
                            greendark: '#B6E2A1',
                            cream: '#FFF9C4',
                            lavender: '#E0C3FC',
                            text: '#6D597A',
                            textlight: '#9E8FB2',
                            white: '#FFFFFF'
                        }
                    },
                    boxShadow: {
                        'soft': '0 10px 40px -10px rgba(162, 210, 255, 0.5)',
                        'card': '0 15px 35px -5px rgba(255, 174, 204, 0.3)',
                        'inner-light': 'inset 0 4px 6px rgba(255, 255, 255, 0.7)',
                        'glow-pink': '0 0 30px rgba(255, 200, 221, 0.6)',
                        'button-depth': '0 6px 0'
                    },
                    borderRadius: {
                        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
                        'blob2': '30% 70% 70% 30% / 30% 30% 70% 70%',
                        'irregular': '255px 15px 225px 15px / 15px 225px 15px 255px'
                    },
                    animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'float-slow': 'float 8s ease-in-out infinite reverse',
                        'wiggle': 'wiggle 2s ease-in-out infinite',
                        'spin-slow': 'spin 12s linear infinite',
                        'slide-down': 'slideDown 0.3s ease-out forwards',
                    },
                    keyframes: {
                        slideDown: {
                            '0%': { opacity: '0', transform: 'translateY(-20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' },
                        },
                        wiggle: {
                            '0%, 100%': { transform: 'rotate(-3deg)' },
                            '50%': { transform: 'rotate(3deg)' },
                        }
                    }
                }
            }
        }
` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
            0% { left: -100%; opacity: 0; }
            50% { opacity: 0.4; }
            100% { left: 100%; opacity: 0; }
        }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
            content: ''; position: absolute; top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent);
            transform: skewX(-25deg);
            animation: shine 3s infinite;
        }
        .btn-press:active { transform: translateY(4px); box-shadow: 0 0 0 transparent; }

        .sticker-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .sticker-card:hover { transform: translateY(-10px) scale(1.02); }
        .sticker-card:active { transform: scale(0.98); }

        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: #FFF9C4; }
        ::-webkit-scrollbar-thumb { background: #FFC8DD; border-radius: 6px; border: 3px solid #FFF9C4; }
        ::selection { background: #A2D2FF; color: white; }

        #mobile-menu-toggle:checked ~ #mobile-menu {
            display: flex;
            animation: slideDown 0.3s ease-out forwards;
        }
        html { scroll-padding-top: 120px; }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        /* Pastel marquee strip (paused on hover) */
        .kawaii-marquee {
            animation: marquee-x 38s linear infinite;
            width: max-content;
            display: flex;
            gap: 18px;
        }
        .kawaii-marquee:hover { animation-play-state: paused; }
        @keyframes marquee-x {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 9px)); }
        }

        /* Cycling image cross-fade */
        @keyframes kawaii-fade {
            0%, 4%   { opacity: 0; filter: blur(14px) saturate(1.1); transform: scale(1.04); }
            8%, 22%  { opacity: 1; filter: blur(0)    saturate(1.05); transform: scale(1); }
            26%, 100%{ opacity: 0; filter: blur(14px) saturate(1.1); transform: scale(1.04); }
        }
        .kawaii-cycle-img {
            animation: kawaii-fade 16s linear infinite;
            opacity: 0;
            filter: blur(14px) saturate(1.1);
            transform: scale(1.04);
            will-change: opacity, filter, transform;
        }
        @keyframes kawaii-scrub {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
        }
        .kawaii-scrub-bar {
            animation: kawaii-scrub 16s linear infinite;
            transform-origin: left;
        }

        /* FAQ accordion chevron rotation (+ → ×) */
        .kawaii-faq summary::-webkit-details-marker { display: none; }
        .kawaii-faq summary { list-style: none; cursor: pointer; }
        .kawaii-faq summary .kawaii-chevron {
            transition: transform 250ms ease;
            display: inline-block;
        }
        .kawaii-faq[open] summary .kawaii-chevron { transform: rotate(45deg); }

        /* Polaroid sticker tape decoration */
        .polaroid-tape::before {
            content: '';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%) rotate(-2deg);
            width: 70px;
            height: 22px;
            background: linear-gradient(135deg, rgba(255, 200, 221, 0.65), rgba(255, 249, 196, 0.65));
            border: 1px dashed rgba(255, 255, 255, 0.6);
            border-radius: 2px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
            z-index: 5;
        }

        @media (prefers-reduced-motion: reduce) {
            .kawaii-marquee,
            .kawaii-cycle-img,
            .kawaii-scrub-bar { animation: none !important; }
            .kawaii-cycle-img:first-of-type { opacity: 1; filter: none; transform: none; }
        }
` }} />

      <div className="bg-gradient-to-br from-[#FFF9F9] to-[#F3F9FF] font-body text-kawaii-text overflow-x-hidden w-full selection:bg-kawaii-pink selection:text-white">

        {/* Floating Background Particles */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-kawaii-pink opacity-20 rounded-blob animate-float blur-3xl"></div>
          <div className="absolute bottom-[-100px] right-[-50px] w-96 h-96 bg-kawaii-blue opacity-20 rounded-blob2 animate-float-slow blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-kawaii-green opacity-20 rounded-full animate-pulse blur-2xl"></div>

          <div className="absolute top-20 right-[10%] w-4 h-4 bg-yellow-300 rounded-full animate-float opacity-60"></div>
          <div className="absolute bottom-40 left-[5%] w-6 h-6 border-4 border-kawaii-pink rounded-full animate-spin-slow opacity-40"></div>
          <div className="absolute top-1/3 left-[40%] text-2xl animate-wiggle opacity-20">✨</div>
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full px-4 py-4 md:py-6 max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-[50px] px-4 md:px-6 py-3 flex justify-between items-center shadow-soft border-2 border-white/50">

            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-kawaii-pink to-kawaii-pinkdark rounded-full flex items-center justify-center text-white text-xl md:text-2xl group-hover:animate-wiggle shadow-md border-4 border-white">
                🍡
              </div>
              <span className="font-heading text-lg md:text-2xl tracking-wide text-kawaii-text group-hover:text-kawaii-pink transition-colors">MOCHI_DREAMS</span>
            </a>

            <div className="hidden md:flex gap-6 lg:gap-8 font-bold text-base lg:text-lg text-kawaii-textlight">
              <a href="#menu" className="hover:text-kawaii-pink transition-colors">Menu</a>
              <a href="#story" className="hover:text-kawaii-pink transition-colors">Our Story</a>
              <a href="#kitchen" className="hover:text-kawaii-pink transition-colors">Kitchen</a>
              <a href="#reviews" className="hover:text-kawaii-pink transition-colors">Reviews</a>
              <a href="#faq" className="hover:text-kawaii-pink transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex gap-4 items-center">
              <button className="relative bg-white text-kawaii-pinkdark p-3 rounded-full hover:bg-pink-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span className="absolute top-0 right-0 bg-kawaii-blue text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">2</span>
              </button>
              <button className="btn-shine bg-kawaii-pink text-white px-6 py-2 rounded-full font-heading shadow-[0_4px_0_#FFAECC] btn-press transition-all hover:bg-kawaii-pinkdark">
                Order Now
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button className="relative bg-white text-kawaii-pinkdark p-2 mr-2 rounded-full hover:bg-pink-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span className="absolute top-0 right-0 bg-kawaii-blue text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">2</span>
              </button>
              <label htmlFor="mobile-menu-toggle" className="cursor-pointer text-kawaii-text p-2 bg-kawaii-cream/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
            </div>
          </div>

          {/* Mobile menu — checkbox-driven peer-style toggle (CSS-only, no JS) */}
          <input type="checkbox" id="mobile-menu-toggle" className="hidden" />
          <div id="mobile-menu" className="hidden flex-col gap-4 mt-2 bg-white rounded-3xl p-6 shadow-xl border-2 border-kawaii-pink absolute top-full left-4 right-4 z-50">
            <a href="#menu" className="text-xl font-bold text-kawaii-text hover:text-kawaii-pink p-2 bg-gray-50 rounded-xl text-center">Menu</a>
            <a href="#story" className="text-xl font-bold text-kawaii-text hover:text-kawaii-pink p-2 bg-gray-50 rounded-xl text-center">Our Story</a>
            <a href="#kitchen" className="text-xl font-bold text-kawaii-text hover:text-kawaii-pink p-2 bg-gray-50 rounded-xl text-center">Kitchen</a>
            <a href="#reviews" className="text-xl font-bold text-kawaii-text hover:text-kawaii-pink p-2 bg-gray-50 rounded-xl text-center">Reviews</a>
            <a href="#faq" className="text-xl font-bold text-kawaii-text hover:text-kawaii-pink p-2 bg-gray-50 rounded-xl text-center">FAQ</a>
            <hr className="border-gray-100" />
            <button className="w-full btn-shine bg-kawaii-pink text-white py-4 rounded-full font-heading shadow-md active:scale-95 transition-transform">Order Now</button>
          </div>
        </nav>

        {/* Hero */}
        <header className="relative z-10 w-full pt-6 pb-16 md:pt-20 md:pb-32 px-4 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 md:gap-0">

          <div className="w-full md:w-1/2 text-center md:text-left z-20 mt-4 md:mt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-kawaii-blue/30 rounded-full text-kawaii-bluedark text-xs md:text-sm font-bold mb-6 shadow-sm animate-bounce">
              <span className="bg-kawaii-blue text-white rounded-full px-2 py-0.5 text-[10px] md:text-xs">NEW</span>
              <span>Sakura Season is here! 🌸</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-8xl leading-[0.95] text-kawaii-text mb-6">
              Taste the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-kawaii-pink to-kawaii-blue drop-shadow-sm filter">Clouds</span>
            </h1>

            <p className="text-base md:text-xl text-kawaii-textlight font-semibold mb-8 md:mb-10 max-w-md mx-auto md:mx-0 leading-relaxed px-4 md:px-0">
              Premium handcrafted mochi with fluffy dough and creamy centers. A little bite of magic in every box.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start px-8 md:px-0">
              <button className="btn-shine bg-gradient-to-r from-kawaii-pink to-kawaii-pinkdark text-white text-lg md:text-xl font-heading px-8 py-4 rounded-full shadow-[0_6px_0_#FFAECC] btn-press transition-all hover:scale-105">
                View Menu
              </button>
              <button className="bg-white text-kawaii-blue text-lg md:text-xl font-heading px-8 py-4 rounded-full shadow-[0_6px_0_#A2D2FF] btn-press transition-all border-2 border-kawaii-blue hover:bg-blue-50">
                Watch Video
              </button>
            </div>

            <div className="mt-8 md:mt-12 flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-1 font-bold text-xs md:text-sm bg-white/50 px-3 py-1 rounded-full border border-gray-100">🌱 100% Vegan</div>
              <div className="flex items-center gap-1 font-bold text-xs md:text-sm bg-white/50 px-3 py-1 rounded-full border border-gray-100">🌾 Gluten Free</div>
              <div className="flex items-center gap-1 font-bold text-xs md:text-sm bg-white/50 px-3 py-1 rounded-full border border-gray-100">🤲 Handmade</div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative flex justify-center items-center h-[350px] md:h-[600px]">
            <div className="absolute w-[90%] md:w-[110%] h-[90%] md:h-[110%] bg-gradient-to-tr from-kawaii-blue/30 to-purple-200/30 rounded-blob animate-float-slow z-0"></div>
            <div className="absolute w-[80%] md:w-[90%] h-[80%] md:h-[90%] bg-gradient-to-bl from-kawaii-pink/40 to-yellow-100/40 rounded-blob2 animate-float z-0"></div>

            <div className="relative z-10 w-64 h-64 md:w-[450px] md:h-[450px] rounded-full border-[6px] md:border-[10px] border-white shadow-[0_30px_60px_-15px_rgba(255,174,204,0.6)] overflow-hidden bg-white group cursor-pointer">
              <img src="https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/andreas-haubold-OTmHU9HdkHo-unsplash_zkcy5o.jpg" alt="Colorful Mochi Assortment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />

              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-white/90 backdrop-blur-sm px-4 md:px-5 py-2 md:py-3 rounded-2xl border-2 border-kawaii-green shadow-lg transform rotate-6 animate-wiggle">
                <span className="font-heading text-kawaii-text text-sm md:text-lg">Yummy! 😋</span>
              </div>
            </div>

            <img src="https://cdn-icons-png.flaticon.com/512/766/766023.png" alt="Peach" className="absolute top-4 right-4 md:top-10 md:right-10 w-12 h-12 md:w-16 md:h-16 animate-float drop-shadow-lg z-20" />
            <img src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png" alt="Flower" className="absolute bottom-4 left-4 md:bottom-10 md:left-10 w-10 h-10 md:w-12 md:h-12 animate-wiggle drop-shadow-lg z-20 opacity-80" />
          </div>
        </header>

        {/* NEW SECTION: Sweet Spotlight (Polaroid Stack — pattern 3) */}
        <section id="spotlight" className="relative z-10 py-12 md:py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5 text-center md:text-left">
              <span className="text-kawaii-pinkdark font-bold tracking-widest uppercase mb-3 block text-xs md:text-sm">— Sweet Spotlight</span>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-kawaii-text leading-[1.05] mb-5">
                Polaroid moments,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-kawaii-pink to-kawaii-lavender">freshly snapped</span>
              </h2>
              <p className="text-base md:text-lg text-kawaii-textlight font-semibold mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
                Every box of MOCHI_DREAMS is a tiny photo session. We dust, plate, and pinch each one until it's selfie-ready — then send the cutest stack your way.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                <span className="bg-white border-2 border-kawaii-pink/40 text-kawaii-pinkdark text-xs md:text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">📸 #mochidreamsclub</span>
                <span className="bg-white border-2 border-kawaii-blue/40 text-kawaii-bluedark text-xs md:text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">🌸 200k snaps shared</span>
                <span className="bg-white border-2 border-kawaii-green/40 text-kawaii-text text-xs md:text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">⭐ Tag to win!</span>
              </div>
            </div>

            <div className="md:col-span-7 relative h-[420px] md:h-[520px] flex items-center justify-center">
              <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-kawaii-pink/30 rounded-full blur-3xl"></div>
              <div className="absolute w-60 h-60 md:w-80 md:h-80 bg-kawaii-lavender/40 rounded-full blur-3xl translate-x-12 -translate-y-8"></div>

              <figure className="absolute polaroid-tape bg-white p-3 pb-10 rounded-lg shadow-card border border-kawaii-pink/30 -rotate-12 -translate-x-32 md:-translate-x-40 -translate-y-8 hover:-rotate-6 hover:-translate-y-12 transition-transform duration-500 z-10">
                <div className="w-36 h-36 md:w-48 md:h-48 overflow-hidden rounded-sm bg-kawaii-pink/20">
                  <img src="https://images.unsplash.com/photo-1635355347994-b79177b77e5c?w=600&q=85&auto=format&fit=crop" alt="Vanilla mochi polaroid" className="w-full h-full object-cover" />
                </div>
                <figcaption className="absolute bottom-2 left-0 right-0 text-center font-heading text-kawaii-text text-sm md:text-base">vanilla sky 🌤</figcaption>
              </figure>

              <figure className="absolute polaroid-tape bg-white p-3 pb-10 rounded-lg shadow-card border border-kawaii-blue/30 rotate-[14deg] translate-x-32 md:translate-x-44 -translate-y-4 hover:rotate-6 hover:-translate-y-8 transition-transform duration-500 z-10">
                <div className="w-36 h-36 md:w-48 md:h-48 overflow-hidden rounded-sm bg-kawaii-blue/20">
                  <img src="https://images.unsplash.com/photo-1604498149220-bfb7c7cfd19b?w=600&q=85&auto=format&fit=crop" alt="Matcha mochi polaroid" className="w-full h-full object-cover" />
                </div>
                <figcaption className="absolute bottom-2 left-0 right-0 text-center font-heading text-kawaii-text text-sm md:text-base">matcha magic 🍵</figcaption>
              </figure>

              <figure className="relative polaroid-tape bg-white p-4 pb-12 rounded-lg shadow-glow-pink border-2 border-kawaii-pink/40 rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-transform duration-500 z-30">
                <div className="w-44 h-44 md:w-64 md:h-64 overflow-hidden rounded-sm bg-kawaii-cream">
                  <img src="https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/rimsha-noor-p6-O0Cc5RAc-unsplash_axlq9s.jpg" alt="Strawberry daifuku polaroid" className="w-full h-full object-cover" />
                </div>
                <figcaption className="absolute bottom-3 left-0 right-0 text-center font-heading text-kawaii-text text-base md:text-lg">strawberry dream 🍓</figcaption>
                <span className="absolute -top-3 -right-3 bg-kawaii-pink text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md rotate-12">today's pick</span>
              </figure>

              <figure className="absolute polaroid-tape bg-white p-3 pb-9 rounded-lg shadow-card border border-kawaii-green/40 rotate-[8deg] translate-x-20 md:translate-x-24 translate-y-24 md:translate-y-28 hover:rotate-3 hover:translate-y-20 transition-transform duration-500 z-20">
                <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-sm bg-kawaii-green/20">
                  <img src="https://images.unsplash.com/photo-1662499866669-e7cf3acc5e1a?w=600&q=85&auto=format&fit=crop" alt="Mango mochi polaroid" className="w-full h-full object-cover" />
                </div>
                <figcaption className="absolute bottom-2 left-0 right-0 text-center font-heading text-kawaii-text text-xs md:text-sm">mango tango 🥭</figcaption>
              </figure>

              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl animate-wiggle z-40">✨</span>
              <span className="absolute bottom-2 left-12 text-2xl animate-float z-40">🌸</span>
              <span className="absolute top-12 right-8 text-2xl animate-float-slow z-40">🎀</span>
            </div>
          </div>
        </section>

        {/* Marquee features strip */}
        <div className="w-full bg-white/50 border-y-4 border-kawaii-cream backdrop-blur-sm overflow-hidden py-3 md:py-4">
          <div className="flex whitespace-nowrap gap-8 md:gap-12 animate-[marquee_20s_linear_infinite] min-w-full justify-center">
            <div className="flex gap-8 md:gap-12 items-center">
              <span className="font-heading text-lg md:text-2xl text-kawaii-pink opacity-50">★ FRESHLY MADE DAILY ★</span>
              <span className="font-heading text-lg md:text-2xl text-kawaii-blue opacity-50">★ ORGANIC INGREDIENTS ★</span>
              <span className="font-heading text-lg md:text-2xl text-kawaii-green opacity-50">★ CUTE PACKAGING ★</span>
              <span className="font-heading text-lg md:text-2xl text-kawaii-pink opacity-50">★ FRESHLY MADE DAILY ★</span>
              <span className="font-heading text-lg md:text-2xl text-kawaii-blue opacity-50">★ ORGANIC INGREDIENTS ★</span>
              <span className="font-heading text-lg md:text-2xl text-kawaii-green opacity-50">★ CUTE PACKAGING ★</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <section id="menu" className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-32 md:w-64 h-64 md:h-96 bg-kawaii-cream rounded-l-full opacity-40 -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-kawaii-blue font-bold tracking-widest uppercase mb-2 block text-sm md:text-base">Our Menu</span>
            <h2 className="font-heading text-4xl md:text-5xl text-kawaii-text mb-4">Pick Your Flavor</h2>
            <p className="text-lg md:text-xl mb-12 text-kawaii-textlight max-w-2xl mx-auto px-4">Soft, chewy, and filled with happiness. Choose your favorite or grab a mixed box!</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 md:px-0">

              {/* Strawberry */}
              <div className="sticker-card group bg-white rounded-[35px] p-4 border-4 border-white shadow-card">
                <div className="relative bg-[#FFE5EC] rounded-[25px] h-48 md:h-56 mb-5 overflow-hidden flex items-center justify-center">
                  <img src="https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/rimsha-noor-p6-O0Cc5RAc-unsplash_axlq9s.jpg" alt="Strawberry Daifuku Mochi" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-kawaii-text shadow-sm">
                    ⭐ Popular
                  </div>
                </div>
                <div className="text-left px-2">
                  <h3 className="font-heading text-xl text-kawaii-text mb-1">Strawberry Dream</h3>
                  <p className="text-kawaii-textlight text-sm font-bold mb-4">Fresh Cream & Berry</p>
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-2xl text-kawaii-pink">$4.50</span>
                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-kawaii-pink text-white hover:bg-kawaii-pinkdark active:scale-90 flex items-center justify-center transition-all shadow-button-depth shadow-pink-200">
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Matcha */}
              <div className="sticker-card group bg-white rounded-[35px] p-4 border-4 border-white shadow-card">
                <div className="relative bg-[#E6F4E2] rounded-[25px] h-48 md:h-56 mb-5 overflow-hidden flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1604498149220-bfb7c7cfd19b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Matcha Mochi" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-left px-2">
                  <h3 className="font-heading text-xl text-kawaii-text mb-1">Matcha Magic</h3>
                  <p className="text-kawaii-textlight text-sm font-bold mb-4">Uji Matcha & Red Bean</p>
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-2xl text-kawaii-green">$4.50</span>
                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-kawaii-green text-white hover:bg-kawaii-greendark active:scale-90 flex items-center justify-center transition-all shadow-button-depth shadow-green-200">
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Vanilla */}
              <div className="sticker-card group bg-white rounded-[35px] p-4 border-4 border-white shadow-card">
                <div className="relative bg-[#F0F7FF] rounded-[25px] h-48 md:h-56 mb-5 overflow-hidden flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1635355347994-b79177b77e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Vanilla Mochi" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-left px-2">
                  <h3 className="font-heading text-xl text-kawaii-text mb-1">Vanilla Sky</h3>
                  <p className="text-kawaii-textlight text-sm font-bold mb-4">Blue Vanilla Custard</p>
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-2xl text-kawaii-blue">$4.00</span>
                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-kawaii-blue text-white hover:bg-kawaii-bluedark active:scale-90 flex items-center justify-center transition-all shadow-button-depth shadow-blue-200">
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mango */}
              <div className="sticker-card group bg-white rounded-[35px] p-4 border-4 border-white shadow-card">
                <div className="relative bg-[#FFFBE6] rounded-[25px] h-48 md:h-56 mb-5 overflow-hidden flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1662499866669-e7cf3acc5e1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mango Mochi" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-kawaii-text shadow-sm">
                    Seasonal
                  </div>
                </div>
                <div className="text-left px-2">
                  <h3 className="font-heading text-xl text-kawaii-text mb-1">Mango Tango</h3>
                  <p className="text-kawaii-textlight text-sm font-bold mb-4">Sweet Thai Mango</p>
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-2xl text-yellow-400">$5.00</span>
                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-300 text-white hover:bg-yellow-400 active:scale-90 flex items-center justify-center transition-all shadow-button-depth shadow-yellow-100">
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-12 md:mt-16">
              <a href="#" className="inline-block border-b-2 border-kawaii-pink text-kawaii-pink font-bold text-lg hover:text-kawaii-pinkdark hover:border-kawaii-pinkdark transition-colors">See full menu →</a>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Mood Board (Sticker Cluster — pattern 13) */}
        <section id="moodboard" className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <span className="text-kawaii-lavender font-bold tracking-widest uppercase mb-2 block text-xs md:text-sm">— Mood Board</span>
              <h2 className="font-heading text-3xl md:text-5xl text-kawaii-text mb-3">A whole vibe, dripping in pastel</h2>
              <p className="text-base md:text-lg text-kawaii-textlight max-w-2xl mx-auto px-2">A peek at our atelier — soft palettes, fluffy textures, and a sticker for every mood.</p>
            </div>

            <div className="relative h-[640px] md:h-[560px] mx-auto max-w-5xl">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 md:w-[420px] md:h-[420px] bg-kawaii-pink/20 rounded-full blur-3xl"></div>
              </div>

              <div className="absolute top-2 left-[6%] md:left-[10%] w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-white shadow-card -rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-500 z-20">
                <img src="https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/andreas-haubold-OTmHU9HdkHo-unsplash_zkcy5o.jpg" alt="Mochi assortment" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 right-1 text-center bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-kawaii-pinkdark py-0.5">assorted ✨</span>
              </div>

              <div className="absolute top-12 left-[42%] w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-soft rotate-[10deg] hover:rotate-0 transition-transform duration-500 z-30">
                <img src="https://images.unsplash.com/photo-1635355347994-b79177b77e5c?w=400&q=85&auto=format&fit=crop" alt="Vanilla mochi" className="w-full h-full object-cover" />
              </div>

              <div className="absolute top-4 right-[18%] md:right-[28%] w-20 h-20 md:w-24 md:h-24 bg-kawaii-cream rounded-full border-4 border-white shadow-card flex items-center justify-center text-4xl md:text-5xl rotate-12 animate-float z-30">🍡</div>

              <div className="absolute top-0 right-[2%] md:right-[8%] w-32 h-40 md:w-40 md:h-52 rounded-3xl overflow-hidden border-4 border-white shadow-card rotate-[8deg] hover:rotate-0 hover:scale-105 transition-transform duration-500 z-20">
                <img src="https://images.unsplash.com/photo-1604498149220-bfb7c7cfd19b?w=600&q=85&auto=format&fit=crop" alt="Matcha mochi mood" className="w-full h-full object-cover" />
              </div>

              <div className="absolute top-[42%] left-[2%] md:left-[6%] bg-kawaii-pink text-white font-heading text-sm md:text-base px-4 py-2 rounded-full shadow-lg -rotate-6 z-30">cute mode: ON</div>

              <div className="absolute top-[40%] left-[36%] w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-soft -rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                <img src="https://images.unsplash.com/photo-1662499866669-e7cf3acc5e1a?w=400&q=85&auto=format&fit=crop" alt="Mango mochi mood" className="w-full h-full object-cover" />
              </div>

              <div className="absolute top-[38%] right-[10%] md:right-[18%] w-16 h-16 md:w-20 md:h-20 bg-kawaii-blue/80 rounded-full border-4 border-white shadow-card flex items-center justify-center text-3xl md:text-4xl -rotate-12 animate-wiggle z-30">🌸</div>

              <div className="absolute bottom-2 left-[10%] md:left-[14%] w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-card rotate-[6deg] hover:rotate-0 hover:scale-105 transition-transform duration-500 z-20">
                <img src="https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/rimsha-noor-p6-O0Cc5RAc-unsplash_axlq9s.jpg" alt="Strawberry daifuku" className="w-full h-full object-cover" />
              </div>

              <div className="absolute bottom-12 left-[44%] bg-kawaii-green/90 text-kawaii-text font-heading text-sm md:text-base px-4 py-2 rounded-full shadow-lg rotate-3 z-30">freshly baked</div>

              <div className="absolute bottom-4 right-[14%] md:right-[22%] w-28 h-32 md:w-36 md:h-44 rounded-3xl overflow-hidden border-4 border-white shadow-soft -rotate-[8deg] hover:rotate-0 hover:scale-105 transition-transform duration-500 z-20">
                <img src="https://images.unsplash.com/photo-1623133894375-ce20135ee521?w=600&q=85&auto=format&fit=crop" alt="Hands making mochi" className="w-full h-full object-cover" />
              </div>

              <div className="absolute bottom-2 right-[2%] md:right-[8%] w-20 h-20 md:w-24 md:h-24 bg-kawaii-lavender/90 rounded-full border-4 border-white shadow-card flex items-center justify-center text-4xl md:text-5xl rotate-6 animate-float-slow z-30">💌</div>

              <span className="absolute top-1/3 left-1/2 text-2xl animate-wiggle opacity-70 z-10">✨</span>
              <span className="absolute bottom-1/4 left-1/3 text-xl animate-float opacity-60 z-10">⭐</span>
            </div>
          </div>
        </section>

        {/* How It's Made */}
        <section id="story" className="py-16 md:py-20 relative bg-white">
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
            <svg className="relative block w-[calc(100%+1.3px)] h-[30px] md:h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#F3F9FF]"></path>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-0">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="w-full md:w-1/2 relative px-4 md:px-0">
                <div className="absolute inset-0 bg-kawaii-lavender rounded-[40px] rotate-3 transform translate-y-2 translate-x-2"></div>
                <img src="https://images.unsplash.com/photo-1623133894375-ce20135ee521?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Making Mochi" className="relative rounded-[40px] shadow-xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 border-4 border-white w-full h-64 md:h-[400px] object-cover" />
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left px-4 md:px-0">
                <span className="text-kawaii-pink font-bold tracking-widest uppercase mb-2 block">Our Story</span>
                <h2 className="font-heading text-3xl md:text-5xl text-kawaii-text mb-6">Made with gentle hands</h2>
                <p className="text-base md:text-lg text-kawaii-textlight mb-8 leading-relaxed">
                  We don't use machines. We use traditional wooden mallets and a whole lot of rhythm to pound our rice dough until it reaches the perfect "Q" texture—bouncy, chewy, and soft.
                </p>
                <ul className="space-y-4 font-bold text-kawaii-text text-left inline-block md:block">
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-kawaii-pink text-white flex items-center justify-center flex-shrink-0">1</span>
                    Steamed premium sweet rice
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-kawaii-blue text-white flex items-center justify-center flex-shrink-0">2</span>
                    Hand-pounded for 30 minutes
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-kawaii-green text-white flex items-center justify-center flex-shrink-0">3</span>
                    Wrapped around fresh fillings
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Today in the Kitchen (Cycling Image — M.2) */}
        <section id="kitchen" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-[#F8F1FF]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
              <div className="md:col-span-5">
                <span className="text-kawaii-pinkdark font-bold tracking-widest uppercase mb-2 block text-xs md:text-sm">— Today in the Kitchen</span>
                <h2 className="font-heading text-3xl md:text-5xl text-kawaii-text leading-tight mb-5">A flavor a moment</h2>
                <p className="text-base md:text-lg text-kawaii-textlight leading-relaxed mb-8">
                  Watch our daily lineup blossom across the counter. Each scene fades into the next every 4 seconds — a tiny pastel slideshow of what's just been pinched, dusted, and boxed.
                </p>

                <div className="flex items-center gap-3 max-w-sm mb-6">
                  <div className="flex-1 h-1.5 bg-kawaii-pink/30 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 origin-left bg-gradient-to-r from-kawaii-pink to-kawaii-lavender rounded-full kawaii-scrub-bar"></div>
                  </div>
                  <span className="font-heading text-xs md:text-sm text-kawaii-textlight whitespace-nowrap">04 scenes · 16s</span>
                </div>

                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-kawaii-pink/20">
                    <img src="https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/rimsha-noor-p6-O0Cc5RAc-unsplash_axlq9s.jpg" alt="Strawberry thumb" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-kawaii-green/20">
                    <img src="https://images.unsplash.com/photo-1604498149220-bfb7c7cfd19b?w=300&q=85&auto=format&fit=crop" alt="Matcha thumb" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-kawaii-blue/20">
                    <img src="https://images.unsplash.com/photo-1635355347994-b79177b77e5c?w=300&q=85&auto=format&fit=crop" alt="Vanilla thumb" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-kawaii-cream">
                    <img src="https://images.unsplash.com/photo-1662499866669-e7cf3acc5e1a?w=300&q=85&auto=format&fit=crop" alt="Mango thumb" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 relative">
                <div className="absolute -inset-6 md:-inset-10 bg-gradient-to-br from-kawaii-pink/30 to-kawaii-blue/20 rounded-blob blur-2xl"></div>

                <div className="relative w-full aspect-[4/5] md:aspect-[5/4] rounded-[40px] overflow-hidden border-[8px] md:border-[10px] border-white shadow-glow-pink bg-kawaii-cream">
                  <img className="kawaii-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: "0s" }} src="https://res.cloudinary.com/dsa31toc5/image/upload/v1769178998/rimsha-noor-p6-O0Cc5RAc-unsplash_axlq9s.jpg" alt="Strawberry mochi today" />
                  <img className="kawaii-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: "4s" }} src="https://images.unsplash.com/photo-1604498149220-bfb7c7cfd19b?w=1200&q=85&auto=format&fit=crop" alt="Matcha mochi today" />
                  <img className="kawaii-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: "8s" }} src="https://images.unsplash.com/photo-1635355347994-b79177b77e5c?w=1200&q=85&auto=format&fit=crop" alt="Vanilla mochi today" />
                  <img className="kawaii-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: "12s" }} src="https://images.unsplash.com/photo-1662499866669-e7cf3acc5e1a?w=1200&q=85&auto=format&fit=crop" alt="Mango mochi today" />

                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm border-2 border-kawaii-pink/40 px-4 py-2 rounded-full shadow-md font-heading text-kawaii-pinkdark text-sm md:text-base rotate-[-4deg]">
                    fresh @ 9:00am
                  </div>
                  <div className="absolute bottom-5 right-5 bg-kawaii-cream/95 border-2 border-kawaii-blue/30 px-4 py-2 rounded-2xl shadow-md font-heading text-kawaii-text text-xs md:text-sm rotate-[3deg]">
                    🍓 → 🍵 → 🌤 → 🥭
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="reviews" className="py-16 md:py-24 bg-kawaii-cream/30">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-heading text-3xl md:text-4xl text-center text-kawaii-text mb-12 md:mb-16">Happy Snackers</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

              <div className="bg-white p-6 md:p-8 rounded-[40px] rounded-bl-none shadow-soft border-2 border-white relative mt-6 hover:translate-y-[-5px] transition-transform">
                <div className="absolute -top-6 left-8 w-14 h-14 bg-kawaii-pink rounded-full border-4 border-white overflow-hidden shadow-md">
                  <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="mt-4">
                  <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
                  <p className="text-kawaii-text font-bold text-lg mb-2">"OMG so fluffy!"</p>
                  <p className="text-kawaii-textlight text-sm">Best mochi I've had outside of Japan. The strawberry one literally melts in your mouth.</p>
                  <p className="text-xs font-bold text-kawaii-pink mt-4">- Sophie K.</p>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-soft border-2 border-white relative mt-6 md:transform md:-translate-y-4 hover:translate-y-[-5px] md:hover:-translate-y-6 transition-transform">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-kawaii-blue rounded-full border-4 border-white overflow-hidden shadow-md">
                  <img src="https://i.pravatar.cc/150?img=12" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 text-center">
                  <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
                  <p className="text-kawaii-text font-bold text-lg mb-2">"Packaging is 10/10"</p>
                  <p className="text-kawaii-textlight text-sm">Bought these as a gift but ate them all myself. Oops. The box is too cute to throw away!</p>
                  <p className="text-xs font-bold text-kawaii-blue mt-4">- Alex M.</p>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[40px] rounded-br-none shadow-soft border-2 border-white relative mt-6 hover:translate-y-[-5px] transition-transform">
                <div className="absolute -top-6 right-8 w-14 h-14 bg-kawaii-green rounded-full border-4 border-white overflow-hidden shadow-md">
                  <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 text-right">
                  <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
                  <p className="text-kawaii-text font-bold text-lg mb-2">"Matcha Heaven"</p>
                  <p className="text-kawaii-textlight text-sm">Authentic bitter-sweet matcha taste. Not too sugary, just perfect.</p>
                  <p className="text-xs font-bold text-kawaii-green mt-4">- Jamie L.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: From Our Tiny Atelier (Pastel Marquee — pattern 11/M.8) */}
        <section id="atelier" className="py-12 md:py-16 relative overflow-hidden">
          <div className="text-center mb-8 md:mb-10 px-4">
            <span className="text-kawaii-blue font-bold tracking-widest uppercase mb-2 block text-xs md:text-sm">— From Our Tiny Atelier</span>
            <h2 className="font-heading text-3xl md:text-5xl text-kawaii-text">Snapshots from the counter</h2>
          </div>

          <div className="relative w-full overflow-hidden py-3">
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FFF9F9] to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#F3F9FF] to-transparent z-20 pointer-events-none"></div>

            <div className="kawaii-marquee">
              {KAWAII_MARQUEE_TILES.map((t, i) => (
                <figure key={`a-${i}`} className={`relative shrink-0 ${t.width} ${t.aspect} rounded-3xl overflow-hidden border-4 border-white shadow-card ${t.bg} ${t.rotate}`}>
                  <img src={t.src} alt={t.alt} className="w-full h-full object-cover" />
                  <figcaption className="absolute inset-x-2 bottom-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-bold">
                    <span className={t.noColor}>{t.no}</span>
                    <span className={t.metaColor}>{t.meta}</span>
                  </figcaption>
                </figure>
              ))}
              {KAWAII_MARQUEE_TILES.map((t, i) => (
                <figure key={`b-${i}`} aria-hidden="true" className={`relative shrink-0 ${t.width} ${t.aspect} rounded-3xl overflow-hidden border-4 border-white shadow-card ${t.bg} ${t.rotate}`}>
                  <img src={t.src} alt="" className="w-full h-full object-cover" />
                  <figcaption className="absolute inset-x-2 bottom-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-bold">
                    <span className={t.noColor}>{t.no}</span>
                    <span className={t.metaColor}>{t.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* NEW SECTION: FAQ accordion (M.7 + variant) */}
        <section id="faq" className="py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <span className="text-kawaii-green font-bold tracking-widest uppercase mb-2 block text-xs md:text-sm">— Sweet FAQ</span>
              <h2 className="font-heading text-3xl md:text-5xl text-kawaii-text mb-3">Tiny questions, sugar-free answers</h2>
              <p className="text-base md:text-lg text-kawaii-textlight max-w-xl mx-auto">Everything you wanted to know about your next mochi delivery.</p>
            </div>

            <div className="space-y-4 md:space-y-5">
              {KAWAII_FAQS.map((f, i) => (
                <details key={i} className={`kawaii-faq group bg-white rounded-3xl border-2 ${f.border} shadow-soft p-5 md:p-6 ${f.hover} transition-colors`}>
                  <summary className="flex items-center justify-between gap-4">
                    <h3 className="font-heading text-lg md:text-xl text-kawaii-text">{f.q}</h3>
                    <span className={`kawaii-chevron w-9 h-9 flex-shrink-0 rounded-full ${f.chipBg} ${f.chipText} flex items-center justify-center text-2xl font-bold`}>+</span>
                  </summary>
                  <p className="mt-4 text-kawaii-textlight font-semibold leading-relaxed text-sm md:text-base">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="max-w-5xl mx-auto px-4 mb-20 pt-10">
          <div className="bg-gradient-to-r from-kawaii-pink to-kawaii-pinkdark rounded-[30px] md:rounded-[50px] p-8 md:p-20 text-center relative overflow-hidden shadow-glow-pink">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white opacity-20 rounded-full animate-float"></div>
            <div className="absolute bottom-[-20px] right-[-20px] w-60 h-60 bg-white opacity-10 rounded-full animate-float-slow"></div>

            <h2 className="font-heading text-3xl md:text-5xl text-white mb-4 md:mb-6 relative z-10 drop-shadow-md">Join the Mochi Club!</h2>
            <p className="text-white text-base md:text-lg font-bold mb-8 md:mb-10 relative z-10 opacity-90 px-4">Get sweet discounts and secret flavors delivered to your inbox.</p>

            <form className="flex flex-col md:flex-row gap-4 justify-center relative z-10 max-w-2xl mx-auto w-full">
              <input type="email" placeholder="Enter your sweet email..." className="flex-1 px-6 md:px-8 py-4 md:py-5 rounded-full border-4 border-transparent outline-none text-kawaii-text font-bold placeholder-kawaii-textlight focus:border-kawaii-blue transition-colors shadow-inner text-sm md:text-base" />
              <button type="button" className="btn-shine bg-kawaii-blue text-white font-heading text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-full shadow-[0_6px_0_#8ECAFC] border-2 border-kawaii-blue btn-press transition-all hover:bg-[#8ECAFC]">
                Subscribe
              </button>
            </form>
            <p className="text-white/70 text-xs md:text-sm mt-6 font-bold">No spam, only sugar! 🍭</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-white pt-16 md:pt-24 pb-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
            <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#FDF2F8]"></path>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <div className="w-10 h-10 bg-kawaii-pink rounded-full flex items-center justify-center text-white text-xl shadow-sm">🍡</div>
                  <span className="font-heading text-2xl text-kawaii-text">MOCHI_DREAMS</span>
                </div>
                <p className="text-kawaii-textlight font-bold max-w-sm mx-auto md:mx-0 mb-6">
                  Bringing the softest, chewiest, and cutest Japanese desserts to your doorstep. Every bite is a dream come true.
                </p>
              </div>

              <div className="text-center md:text-left">
                <h4 className="font-heading text-xl text-kawaii-text mb-4">Shop</h4>
                <ul className="space-y-2 text-kawaii-textlight font-bold">
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">All Mochi</a></li>
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">Gift Boxes</a></li>
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">Merchandise</a></li>
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              <div className="text-center md:text-left">
                <h4 className="font-heading text-xl text-kawaii-text mb-4">Connect</h4>
                <ul className="space-y-2 text-kawaii-textlight font-bold">
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">Instagram 📸</a></li>
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">TikTok 🎵</a></li>
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-kawaii-pink transition-colors">FAQs</a></li>
                </ul>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-bold text-center">
              <p>© 2026 MOCHI_DREAMS. Made with 💖 and sugar.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-kawaii-pink">Privacy</a>
                <a href="#" className="hover:text-kawaii-pink">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default PastelKawaii;
