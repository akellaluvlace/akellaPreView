const SHOWCASE_TILES = [
  { src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop",  alt: "Living room",      title: "Living Room",      plate: "Plate · I",   width: "w-72", aspect: "aspect-[3/4]",   temp: "22°", devices: "04", scene: "Home" },
  { src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1000&q=85&auto=format&fit=crop", alt: "Master bedroom",   title: "Master Bedroom",   plate: "Plate · II",  width: "w-80", aspect: "aspect-[16/10]", temp: "19°", devices: "03", scene: "Sleep" },
  { src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop",  alt: "Hallway",          title: "Hallway",          plate: "Plate · III", width: "w-72", aspect: "aspect-[3/4]",   temp: "20°", devices: "02", scene: "Auto" },
  { src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=1200&q=85&auto=format&fit=crop", alt: "Kitchen",          title: "Kitchen",          plate: "Plate · IV",  width: "w-96", aspect: "aspect-[16/10]", temp: "21°", devices: "06", scene: "Cook" },
  { src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop",  alt: "Studio",           title: "Studio",           plate: "Plate · V",   width: "w-72", aspect: "aspect-[3/4]",   temp: "23°", devices: "05", scene: "Focus" },
  { src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1000&q=85&auto=format&fit=crop", alt: "Sunroom",          title: "Sunroom",          plate: "Plate · VI",  width: "w-80", aspect: "aspect-[16/10]", temp: "24°", devices: "02", scene: "Read" },
  { src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop",  alt: "Atrium",           title: "Atrium",           plate: "Plate · VII", width: "w-72", aspect: "aspect-[3/4]",   temp: "21°", devices: "03", scene: "Auto" },
];

const AIR_SENSORS = [
  { label: "Air Quality", value: "94", unit: "AQI", sub: "Excellent", icon: "leaf",       pct: 94, accent: "text-emerald-500" },
  { label: "CO₂",         value: "612", unit: "ppm", sub: "Comfortable", icon: "wind",    pct: 70, accent: "text-blue-500" },
  { label: "Humidity",    value: "44",  unit: "%",   sub: "Balanced",  icon: "droplets",   pct: 44, accent: "text-cyan-500" },
  { label: "VOC Index",   value: "120", unit: null,  sub: "Low",       icon: "shield-check", pct: 22, accent: "text-purple-500" },
];

const ACTIVITY_EVENTS = [
  { time: "07:14",  icon: "sunrise",       action: "Morning scene started",         room: "Whole home", state: "auto"  },
  { time: "07:42",  icon: "lock",          action: "Front door unlocked",           room: "Entrance",   state: "ok"    },
  { time: "08:03",  icon: "lamp-ceiling",  action: "Studio lamp dimmed to 40%",     room: "Studio",     state: "auto"  },
  { time: "08:31",  icon: "fan",           action: "AC set to 21° from schedule",   room: "Bedroom",    state: "auto"  },
  { time: "09:05",  icon: "shield-check",  action: "Perimeter armed (away)",        room: "Entrance",   state: "ok"    },
  { time: "09:18",  icon: "droplets",      action: "Humidity returned to comfort",  room: "Living Room", state: "ok" },
];

const ROADMAP_STEPS = [
  { stage: "Step · 01",       title: "Unbox",     body: "Hub plus four sensors, all linen-wrapped, all silent.",     state: "done",     icon: "check-circle-2" },
  { stage: "Step · 02",       title: "Pair",      body: "Hold the hub, watch the dot pulse, name your rooms.",         state: "done",     icon: "check-circle-2" },
  { stage: "Step · 03 · Now", title: "Calibrate", body: "A morning of light tweaks. The system learns the day.",       state: "current",  icon: null },
  { stage: "Step · 04",       title: "Live",      body: "Three weeks of observation. Routines emerge on their own.",   state: "upcoming", icon: "play-circle" },
  { stage: "Step · 05",       title: "Settle",    body: "The house behaves. You stop thinking about it. That's the goal.", state: "upcoming", icon: "zap" },
];

const NUMBERS = [
  { value: "42k",  unit: null,  label: "Homes Online",   sub: "across 26 countries", accent: true },
  { value: "3.4M", unit: null,  label: "Sensors Active", sub: "listening, mostly",   accent: false },
  { value: "98",   unit: "%",   label: "Uptime · YTD",   sub: "measured monthly",    accent: false },
  { value: "7y",   unit: null,  label: "In Service",     sub: "est. MMXIX",          accent: true },
];

const VOICES = [
  { name: "Maren V.",    role: "Architect · Aarhus", quote: "The first week I kept testing it. The second week I forgot it was there. That's the highest compliment I have for software.", note: "Note · I",   since: "Owner since '23", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&q=85&auto=format&fit=crop" },
  { name: "Joaquín R.",  role: "Composer · Lisbon",  quote: "I needed a thermostat. I got a small companion that lowers the lights when I sit at the piano. I am unreasonably fond of it.", note: "Note · II",  since: "Owner since '22", img: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=240&q=85&auto=format&fit=crop" },
  { name: "Priya M.",    role: "Editor · Brooklyn",  quote: "Every other home app yelled at me with red dots and notifications. This one just sits there, beige and patient, and the house works.", note: "Note · III", since: "Owner since '24", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=240&q=85&auto=format&fit=crop" },
];

const FAQS = [
  { q: "Do I need to rewire anything?",          a: "No. Sensors are wireless and the hub plugs into any outlet. The thermostat is the only thing that touches a wire, and it's a five-minute swap.", open: true },
  { q: "Will it work without internet?",         a: "Locally, yes. The hub keeps your routines in memory and the sensors talk to it directly. Cloud features (remote control, weather routines) pause until you're back online." },
  { q: "What about the data — who sees it?",     a: "You. Routines are processed on the hub. We get aggregate uptime stats and crash reports, never room-by-room behaviour. There's a switch to turn even that off." },
  { q: "Does it talk to other devices?",         a: "Matter, Thread, HomeKit, Google Home. We avoid platform fights — if your speakers and bulbs are already in someone else's app, we'll join, not replace." },
  { q: "What's the warranty?",                   a: "Five years on the hub, two on each sensor. We repair before we replace; mail it back, we send it back fixed in roughly a week." },
];

function Neumorphism() {
  return (
    <>
      {/* head */}
      <title>SmartLiving - Home Automation</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'neu-bg': '#E0E5EC',
                        'neu-text-main': '#4A5568',
                        'neu-text-sub': '#A0AEC0',
                        'neu-accent': '#6D28D9',
                        'neu-success': '#10B981',
                        'neu-danger': '#EF4444',
                    },
                    fontFamily: {
                        sans: ['Manrope', 'sans-serif'],
                    },
                    boxShadow: {
                        'neu-flat': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
                        'neu-flat-lg': '12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255, 0.6)',
                        'neu-pressed': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
                        'neu-pressed-sm': 'inset 3px 3px 6px 0 rgba(163,177,198, 0.6), inset -3px -3px 6px 0 rgba(255,255,255, 0.7)',
                    },
                    borderRadius: {
                        'xl': '1rem',
                        '2xl': '1.5rem',
                        '3xl': '2rem',
                    }
                }
            }
        }
` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body {
            background-color: #E0E5EC;
            color: #4A5568;
            -webkit-tap-highlight-color: transparent;
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #E0E5EC; }
        ::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #A0AEC0; }

        .toggle-checkbox:checked { right: 0; border-color: #6D28D9; }
        .toggle-checkbox:checked + .toggle-label:before { background-color: #6D28D9; }

        .touch-action-manipulation { touch-action: manipulation; }

        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }

        /* Full-bleed escape hatch */
        html, body { overflow-x: clip; }
        .full-bleed {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
            max-width: none;
        }

        /* Neumorphic raised frame helpers */
        .neu-frame {
            background-color: #E0E5EC;
            border-radius: 1.5rem;
            box-shadow: 9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5);
        }
        .neu-well {
            background-color: #E0E5EC;
            border-radius: 1.5rem;
            box-shadow: inset 6px 6px 10px 0 rgba(163,177,198,0.7), inset -6px -6px 10px 0 rgba(255,255,255,0.8);
        }

        /* Atelier marquee */
        .neu-track {
            display: flex;
            gap: 24px;
            width: max-content;
            animation: neu-marquee 60s linear infinite;
            padding: 18px 0;
        }
        .neu-track:hover { animation-play-state: paused; }
        @keyframes neu-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
        }
        .neu-edge-fade-l, .neu-edge-fade-r {
            position: absolute; top: 0; bottom: 0; width: 96px; pointer-events: none; z-index: 5;
        }
        .neu-edge-fade-l { left: 0;  background: linear-gradient(to right, #E0E5EC, rgba(224,229,236,0)); }
        .neu-edge-fade-r { right: 0; background: linear-gradient(to left,  #E0E5EC, rgba(224,229,236,0)); }

        /* Roadmap pulse */
        @keyframes neu-pulse {
            0%, 100% { opacity: 0.7; box-shadow: 0 0 0 0 rgba(109,40,217,0.4); }
            50%      { opacity: 1;   box-shadow: 0 0 0 10px rgba(109,40,217,0); }
        }
        .neu-pulse { animation: neu-pulse 2s ease-out infinite; }

        /* FAQ chevron */
        .neu-faq summary::-webkit-details-marker { display: none; }
        .neu-faq summary { list-style: none; cursor: pointer; }
        .neu-faq summary .neu-chevron {
            transition: transform 250ms ease;
            display: inline-flex;
        }
        .neu-faq[open] summary .neu-chevron { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
            .neu-track { animation: none; }
            .neu-pulse { animation: none; }
            .fade-in { animation: none; }
            .neu-faq summary .neu-chevron { transition: none; }
            .animate-spin-slow { animation: none !important; }
        }
` }} />

      {/* body wrapper */}
      <div className="flex flex-col min-h-screen overflow-x-hidden text-neu-text-main selection:bg-neu-accent selection:text-white bg-neu-bg">

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-neu-bg z-50 px-6 py-4 transition-all duration-300" id="navbar">
          <div className="max-w-7xl mx-auto flex justify-between items-center">

            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer select-none">
              <div className="h-10 w-10 rounded-xl shadow-neu-flat flex items-center justify-center text-neu-accent active:shadow-neu-pressed transition-shadow duration-200">
                <i data-lucide="zap" className="w-6 h-6"></i>
              </div>
              <span className="text-xl font-extrabold tracking-tight">SmartLiving</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#dashboard" className="text-sm font-semibold text-neu-text-main hover:text-neu-accent transition-colors">Dashboard</a>
              <a href="#rooms" className="text-sm font-semibold text-neu-text-main hover:text-neu-accent transition-colors">Rooms</a>
              <a href="#analytics" className="text-sm font-semibold text-neu-text-main hover:text-neu-accent transition-colors">Analytics</a>
              <div className="h-10 w-10 rounded-full shadow-neu-flat flex items-center justify-center text-neu-text-main cursor-pointer hover:text-neu-accent active:shadow-neu-pressed transition-all">
                <i data-lucide="bell" className="w-5 h-5"></i>
              </div>
              <div className="h-10 w-10 rounded-full shadow-neu-flat overflow-hidden border-2 border-neu-bg cursor-pointer active:shadow-neu-pressed transition-all">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button id="mobile-menu-btn" className="md:hidden h-10 w-10 rounded-xl shadow-neu-flat flex items-center justify-center text-neu-text-main active:shadow-neu-pressed transition-all focus:outline-none">
              <i data-lucide="menu" className="w-5 h-5"></i>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div id="mobile-menu" className="hidden absolute top-full left-0 w-full bg-neu-bg shadow-lg flex-col items-center py-6 gap-6 md:hidden border-t border-gray-200/20">
            <a href="#dashboard" className="w-3/4 py-3 rounded-xl shadow-neu-flat text-center font-bold active:shadow-neu-pressed transition-all">Dashboard</a>
            <a href="#rooms" className="w-3/4 py-3 rounded-xl shadow-neu-flat text-center font-bold active:shadow-neu-pressed transition-all">Rooms</a>
            <a href="#analytics" className="w-3/4 py-3 rounded-xl shadow-neu-flat text-center font-bold active:shadow-neu-pressed transition-all">Analytics</a>
            <a href="#profile" className="w-3/4 py-3 rounded-xl shadow-neu-flat text-center font-bold active:shadow-neu-pressed transition-all text-neu-accent">My Profile</a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow pt-28 pb-12 px-4 md:px-6 max-w-7xl mx-auto w-full space-y-16">

          {/* Hero & Thermostat */}
          <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 fade-in">

            {/* Hero text */}
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="inline-block px-4 py-1 rounded-full shadow-neu-pressed-sm text-xs font-bold text-neu-accent mb-2">
                v2.0 System Online
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-neu-text-main">
                Your home, <br className="hidden md:block" />
                <span className="text-neu-accent">intelligently</span> controlled.
              </h1>
              <p className="text-lg text-neu-text-sub font-medium max-w-lg mx-auto lg:mx-0">
                Monitor energy consumption, adjust lighting ambiance, and secure your perimeter with a single tap.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl shadow-neu-flat text-neu-accent font-bold hover:shadow-neu-flat-lg hover:text-purple-700 active:shadow-neu-pressed transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Launch App</span>
                  <i data-lucide="smartphone" className="w-4 h-4"></i>
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl shadow-neu-flat text-neu-text-main font-semibold hover:shadow-neu-flat-lg active:shadow-neu-pressed transition-all duration-200">
                  View Demo
                </button>
              </div>
            </div>

            {/* Interactive Thermostat */}
            <div className="lg:w-1/2 w-full flex justify-center py-6">
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full shadow-neu-flat flex items-center justify-center bg-neu-bg transition-shadow duration-300">

                <div className="absolute w-full h-full rounded-full" id="dial-ticks"></div>

                <div className="w-[75%] h-[75%] rounded-full shadow-neu-pressed flex items-center justify-center relative z-10">

                  <div className="w-[75%] h-[75%] rounded-full shadow-neu-flat flex flex-col items-center justify-center relative bg-neu-bg z-20">

                    <div className="w-2 h-2 rounded-full bg-neu-accent shadow-[0_0_8px_#6D28D9] mb-2 animate-pulse"></div>

                    <div className="flex items-start text-neu-text-main">
                      <span id="temp-val" className="text-5xl font-bold tracking-tighter">22</span>
                      <span className="text-2xl mt-1 font-medium">°C</span>
                    </div>
                    <span className="text-xs font-bold text-neu-text-sub mt-1 tracking-widest">LIVING ROOM</span>
                  </div>
                </div>

                {/* Floating action buttons. The HTML uses `onclick="updateTemp(±1)"` — that
                    handler is defined in the inline init <script> further down, which the
                    preview-runtime script-hoister re-emits as a real <script> after mount,
                    so the inline string handlers resolve at click time. */}
                <button onClick={() => window.updateTemp && window.updateTemp(-1)} className="absolute -left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full shadow-neu-flat flex items-center justify-center text-neu-text-sub hover:text-neu-accent active:shadow-neu-pressed transition-all touch-action-manipulation z-30" aria-label="Decrease Temp">
                  <i data-lucide="minus" className="w-6 h-6"></i>
                </button>

                <button onClick={() => window.updateTemp && window.updateTemp(1)} className="absolute -right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full shadow-neu-flat flex items-center justify-center text-neu-text-sub hover:text-neu-danger active:shadow-neu-pressed transition-all touch-action-manipulation z-30" aria-label="Increase Temp">
                  <i data-lucide="plus" className="w-6 h-6"></i>
                </button>
              </div>
            </div>
          </section>

          {/* Status Strip */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="p-4 rounded-2xl shadow-neu-flat flex flex-col items-center justify-center text-center gap-2 group hover:shadow-neu-flat-lg transition-all">
              <div className="text-blue-400 mb-1"><i data-lucide="droplets" className="w-6 h-6"></i></div>
              <h3 className="text-xs font-bold text-neu-text-sub uppercase tracking-wider">Humidity</h3>
              <p className="text-xl font-bold text-neu-text-main group-hover:scale-110 transition-transform">45%</p>
            </div>
            <div className="p-4 rounded-2xl shadow-neu-flat flex flex-col items-center justify-center text-center gap-2 group hover:shadow-neu-flat-lg transition-all">
              <div className="text-yellow-500 mb-1"><i data-lucide="zap" className="w-6 h-6"></i></div>
              <h3 className="text-xs font-bold text-neu-text-sub uppercase tracking-wider">Usage</h3>
              <p className="text-xl font-bold text-neu-text-main group-hover:scale-110 transition-transform">12 kW</p>
            </div>
            <div className="p-4 rounded-2xl shadow-neu-flat flex flex-col items-center justify-center text-center gap-2 group hover:shadow-neu-flat-lg transition-all">
              <div className="text-green-500 mb-1"><i data-lucide="shield-check" className="w-6 h-6"></i></div>
              <h3 className="text-xs font-bold text-neu-text-sub uppercase tracking-wider">System</h3>
              <p className="text-xl font-bold text-neu-text-main group-hover:scale-110 transition-transform">Armed</p>
            </div>
            <div className="p-4 rounded-2xl shadow-neu-flat flex flex-col items-center justify-center text-center gap-2 group hover:shadow-neu-flat-lg transition-all">
              <div className="text-neu-text-main mb-1"><i data-lucide="wifi" className="w-6 h-6"></i></div>
              <h3 className="text-xs font-bold text-neu-text-sub uppercase tracking-wider">Network</h3>
              <p className="text-xl font-bold text-neu-text-main group-hover:scale-110 transition-transform">320 Mbps</p>
            </div>
          </section>

          {/* Active Devices */}
          <section id="dashboard" className="fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-bold text-neu-text-main">Active Devices</h2>
              <button className="text-sm font-semibold text-neu-accent hover:underline">See All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {/* Smart Lamp */}
              <div className="bg-neu-bg p-6 rounded-3xl shadow-neu-flat flex flex-col justify-between h-48 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <button className="h-12 w-12 rounded-xl shadow-neu-flat flex items-center justify-center text-neu-text-sub transition-all duration-300 device-icon" id="icon-lamp">
                    <i data-lucide="lamp-ceiling" className="w-6 h-6"></i>
                  </button>

                  <div className="relative w-14 h-8">
                    <input type="checkbox" id="toggle-lamp" className="peer sr-only" onChange={() => window.toggleDevice && window.toggleDevice('lamp')} />
                    <label htmlFor="toggle-lamp" className="block bg-neu-bg w-14 h-8 rounded-full shadow-neu-pressed cursor-pointer"></label>
                    <div className="absolute left-1 top-1 bg-neu-text-sub w-6 h-6 rounded-full shadow-neu-flat transition-all duration-300 peer-checked:bg-neu-accent peer-checked:translate-x-6"></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-neu-text-main">Smart Lamp</h4>
                  <p className="text-sm text-neu-text-sub">Living Room</p>
                </div>
              </div>

              {/* AC */}
              <div className="bg-neu-bg p-6 rounded-3xl shadow-neu-flat flex flex-col justify-between h-48 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <button
                    className="h-12 w-12 rounded-xl shadow-neu-pressed flex items-center justify-center text-blue-500 transition-all duration-300 device-icon"
                    id="icon-ac"
                    style={{ boxShadow: "inset 3px 3px 6px 0 rgba(163,177,198, 0.6), inset -3px -3px 6px 0 rgba(255,255,255, 0.7)" }}
                  >
                    <i data-lucide="fan" className="w-6 h-6 animate-spin-slow"></i>
                  </button>

                  <div className="relative w-14 h-8">
                    <input type="checkbox" id="toggle-ac" className="peer sr-only" defaultChecked onChange={() => window.toggleDevice && window.toggleDevice('ac')} />
                    <label htmlFor="toggle-ac" className="block bg-neu-bg w-14 h-8 rounded-full shadow-neu-pressed cursor-pointer"></label>
                    <div className="absolute left-1 top-1 bg-blue-500 w-6 h-6 rounded-full shadow-neu-flat transition-all duration-300 peer-checked:translate-x-6"></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-neu-text-main">Air Conditioner</h4>
                  <p className="text-sm text-neu-text-sub">Master Bedroom</p>
                </div>
              </div>

              {/* Smart Lock */}
              <div className="bg-neu-bg p-6 rounded-3xl shadow-neu-flat flex flex-col justify-between h-48 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <button className="h-12 w-12 rounded-xl shadow-neu-flat flex items-center justify-center text-neu-text-sub transition-all duration-300 device-icon" id="icon-lock">
                    <i data-lucide="lock" className="w-6 h-6"></i>
                  </button>

                  <div className="relative w-14 h-8">
                    <input type="checkbox" id="toggle-lock" className="peer sr-only" onChange={() => window.toggleDevice && window.toggleDevice('lock')} />
                    <label htmlFor="toggle-lock" className="block bg-neu-bg w-14 h-8 rounded-full shadow-neu-pressed cursor-pointer"></label>
                    <div className="absolute left-1 top-1 bg-neu-text-sub w-6 h-6 rounded-full shadow-neu-flat transition-all duration-300 peer-checked:bg-green-500 peer-checked:translate-x-6"></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-neu-text-main">Front Door</h4>
                  <p className="text-sm text-neu-text-sub">Entrance</p>
                </div>
              </div>

              {/* TV */}
              <div className="bg-neu-bg p-6 rounded-3xl shadow-neu-flat flex flex-col justify-between h-48 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <button className="h-12 w-12 rounded-xl shadow-neu-flat flex items-center justify-center text-neu-text-sub transition-all duration-300 device-icon" id="icon-tv">
                    <i data-lucide="tv-2" className="w-6 h-6"></i>
                  </button>

                  <div className="relative w-14 h-8">
                    <input type="checkbox" id="toggle-tv" className="peer sr-only" onChange={() => window.toggleDevice && window.toggleDevice('tv')} />
                    <label htmlFor="toggle-tv" className="block bg-neu-bg w-14 h-8 rounded-full shadow-neu-pressed cursor-pointer"></label>
                    <div className="absolute left-1 top-1 bg-neu-text-sub w-6 h-6 rounded-full shadow-neu-flat transition-all duration-300 peer-checked:bg-neu-danger peer-checked:translate-x-6"></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-neu-text-main">Smart TV</h4>
                  <p className="text-sm text-neu-text-sub">Lounge</p>
                </div>
              </div>

            </div>
          </section>

          {/* Air Atlas — neumorphic gauge cards (NEW SECTION 1) */}
          <section id="air-atlas" className="fade-in" style={{ animationDelay: "0.225s" }}>
            <div className="flex items-end justify-between mb-8 px-2 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-neu-accent uppercase tracking-[0.25em] mb-2">— Sensors · 04</span>
                <h2 className="text-2xl md:text-3xl font-bold text-neu-text-main">Air atlas, this hour</h2>
              </div>
              <p className="hidden md:block text-sm text-neu-text-sub max-w-sm">Four sensors, sampled every ninety seconds. Every reading sits between the linen-wrapped ceiling node and the hub.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {AIR_SENSORS.map((s, i) => (
                <div key={i} className="bg-neu-bg p-6 rounded-3xl shadow-neu-flat flex flex-col gap-5 hover:translate-y-[-4px] transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-xl shadow-neu-flat flex items-center justify-center ${s.accent}`}>
                      <i data-lucide={s.icon} className="w-6 h-6"></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neu-text-sub">{s.label}</span>
                  </div>

                  {/* Neumorphic gauge — pressed track + raised fill */}
                  <div className="rounded-full shadow-neu-pressed-sm h-3 overflow-hidden">
                    <div className={`h-full rounded-full ${s.accent.replace("text-", "bg-")} shadow-neu-flat`} style={{ width: `${s.pct}%` }}></div>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl md:text-4xl font-extrabold text-neu-text-main tabular-nums">
                      {s.value}
                      {s.unit && <span className="text-base font-bold text-neu-text-sub ml-1">{s.unit}</span>}
                    </span>
                    <span className={`text-xs font-bold ${s.accent}`}>{s.sub}</span>
                  </div>

                  <button className="w-full py-2.5 rounded-xl shadow-neu-flat text-xs font-bold text-neu-text-sub hover:text-neu-accent active:shadow-neu-pressed transition-all flex items-center justify-center gap-2">
                    <i data-lucide="activity" className="w-3.5 h-3.5"></i>
                    <span>View trend</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Atelier Showcase — image marquee with raised neumorphic frames */}
          <section id="showcase" className="fade-in" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-end justify-between mb-8 px-2 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-neu-accent uppercase tracking-[0.25em] mb-2">— Atelier · 05</span>
                <h2 className="text-2xl md:text-3xl font-bold text-neu-text-main">Rooms in residence</h2>
              </div>
              <p className="hidden md:block text-sm text-neu-text-sub max-w-sm">A quiet catalogue of the spaces SmartLiving currently watches over. Hover to pause.</p>
            </div>

            <div className="relative full-bleed overflow-hidden">
              <div className="neu-edge-fade-l"></div>
              <div className="neu-edge-fade-r"></div>
              <div className="neu-track px-6">
                {[...SHOWCASE_TILES, ...SHOWCASE_TILES].map((tile, i) => (
                  <figure
                    key={i}
                    className={`neu-frame ${tile.width} shrink-0 p-4 flex flex-col`}
                    aria-hidden={i >= SHOWCASE_TILES.length ? "true" : undefined}
                  >
                    <div className={`rounded-2xl shadow-neu-pressed-sm overflow-hidden ${tile.aspect}`}>
                      <img src={tile.src} alt={i >= SHOWCASE_TILES.length ? "" : tile.alt} className="w-full h-full object-cover" />
                    </div>
                    <figcaption className="flex items-center justify-between mt-4 px-1">
                      <span className="text-sm font-bold text-neu-text-main">{tile.title}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neu-text-sub">{tile.plate}</span>
                    </figcaption>
                    {/* Nested neumorphic mini-card — mt-auto pins it to the bottom so cards with shorter aspects fill the empty space too */}
                    <div className="mt-auto pt-4">
                      <div className="rounded-xl shadow-neu-pressed-sm p-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-neu-text-sub">
                          <i data-lucide="thermometer" className="w-3.5 h-3.5"></i>
                          <span className="text-xs font-bold tabular-nums">{tile.temp}</span>
                        </div>
                        <span className="h-3 w-px bg-neu-text-sub/30"></span>
                        <div className="flex items-center gap-1.5 text-neu-text-sub">
                          <i data-lucide="zap" className="w-3.5 h-3.5"></i>
                          <span className="text-xs font-bold tabular-nums">{tile.devices}</span>
                        </div>
                        <span className="h-3 w-px bg-neu-text-sub/30"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neu-accent">{tile.scene}</span>
                      </div>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Scenes */}
          <section className="fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-2xl font-bold text-neu-text-main mb-8 px-2">Scenes</h2>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">

              <button className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl shadow-neu-flat flex items-center justify-center group-hover:text-neu-accent group-active:shadow-neu-pressed transition-all duration-200">
                  <i data-lucide="sun" className="w-7 h-7"></i>
                </div>
                <span className="text-sm font-semibold text-neu-text-sub group-hover:text-neu-text-main">Morning</span>
              </button>

              <button className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl shadow-neu-flat flex items-center justify-center group-hover:text-neu-accent group-active:shadow-neu-pressed transition-all duration-200">
                  <i data-lucide="briefcase" className="w-7 h-7"></i>
                </div>
                <span className="text-sm font-semibold text-neu-text-sub group-hover:text-neu-text-main">Away</span>
              </button>

              <button className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl shadow-neu-pressed flex items-center justify-center text-neu-accent transition-all duration-200 ring-2 ring-neu-bg ring-offset-2 ring-offset-neu-bg">
                  <i data-lucide="home" className="w-7 h-7"></i>
                </div>
                <span className="text-sm font-bold text-neu-text-main">Home</span>
              </button>

              <button className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl shadow-neu-flat flex items-center justify-center group-hover:text-neu-accent group-active:shadow-neu-pressed transition-all duration-200">
                  <i data-lucide="moon" className="w-7 h-7"></i>
                </div>
                <span className="text-sm font-semibold text-neu-text-sub group-hover:text-neu-text-main">Night</span>
              </button>

              <button className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl shadow-neu-flat flex items-center justify-center group-hover:text-neu-accent group-active:shadow-neu-pressed transition-all duration-200">
                  <i data-lucide="clapperboard" className="w-7 h-7"></i>
                </div>
                <span className="text-sm font-semibold text-neu-text-sub group-hover:text-neu-text-main">Cinema</span>
              </button>
            </div>
          </section>

          {/* Process / 5-step Roadmap */}
          <section id="process" className="fade-in" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-end justify-between mb-10 px-2 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-neu-accent uppercase tracking-[0.25em] mb-2">— Method · 06</span>
                <h2 className="text-2xl md:text-3xl font-bold text-neu-text-main">Five quiet steps to a calmer home</h2>
              </div>
              <p className="hidden md:block text-sm text-neu-text-sub max-w-sm">From the moment a sensor ships to the morning your house knows you. About one weekend, end-to-end.</p>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-3 relative">
              <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px bg-gradient-to-r from-neu-accent/0 via-neu-accent/40 to-neu-accent/0" aria-hidden="true"></div>

              {ROADMAP_STEPS.map((step, i) => {
                const circleClass =
                  step.state === "done"
                    ? "shadow-neu-pressed text-neu-accent"
                    : step.state === "current"
                    ? "shadow-neu-flat"
                    : "shadow-neu-flat text-neu-text-sub";
                const stageClass = step.state === "upcoming" ? "text-neu-text-sub" : "text-neu-accent";
                return (
                  <li key={i} className="flex flex-col items-center text-center gap-3 relative">
                    <div className={`w-14 h-14 rounded-full ${circleClass} flex items-center justify-center z-10 bg-neu-bg relative`}>
                      {step.state === "current" ? (
                        <span className="w-3 h-3 rounded-full bg-neu-accent neu-pulse" aria-hidden="true"></span>
                      ) : (
                        <i data-lucide={step.icon} className="w-6 h-6"></i>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${stageClass}`}>{step.stage}</span>
                    <h3 className="text-base font-bold text-neu-text-main">{step.title}</h3>
                    <p className="text-xs text-neu-text-sub leading-relaxed max-w-[180px]">{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* By the Numbers — depressed neumorphic stat strip */}
          <section id="numbers" className="fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-end justify-between mb-8 px-2 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-neu-accent uppercase tracking-[0.25em] mb-2">— Origins · 07</span>
                <h2 className="text-2xl md:text-3xl font-bold text-neu-text-main">Quietly at scale</h2>
              </div>
              <p className="hidden md:block text-sm text-neu-text-sub max-w-sm">A small operation by design. Numbers as of this morning, give or take a sensor.</p>
            </div>

            <div className="neu-well p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-2 md:divide-x md:divide-neu-text-sub/15">
              {NUMBERS.map((n, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 px-2">
                  <span className={`text-5xl md:text-6xl italic font-extrabold tabular-nums leading-none ${n.accent ? "text-neu-accent" : "text-neu-text-main"}`}>
                    {n.value}
                    {n.unit && <span className="text-3xl align-top">{n.unit}</span>}
                  </span>
                  <span className="h-px w-10 bg-neu-text-sub/30 my-2"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neu-text-sub">{n.label}</span>
                  <span className="text-xs italic text-neu-text-sub/80">{n.sub}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Pulse — neumorphic timeline of recent home events (NEW SECTION 2) */}
          <section id="pulse" className="fade-in" style={{ animationDelay: "0.425s" }}>
            <div className="flex items-end justify-between mb-10 px-2 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-neu-accent uppercase tracking-[0.25em] mb-2">— Pulse · 08</span>
                <h2 className="text-2xl md:text-3xl font-bold text-neu-text-main">Today, in the order it happened</h2>
              </div>
              <p className="hidden md:block text-sm text-neu-text-sub max-w-sm">A quiet log of the morning. Auto-routines stay grey; manual presses carry an accent.</p>
            </div>

            <div className="bg-neu-bg p-6 md:p-8 rounded-3xl shadow-neu-flat">
              <ol className="flex flex-col gap-4">
                {ACTIVITY_EVENTS.map((e, i) => (
                  <li key={i} className="flex items-center gap-4 md:gap-5 group">
                    <span className="text-xs font-bold tabular-nums text-neu-text-sub w-14 shrink-0">{e.time}</span>
                    <div className={`h-11 w-11 shrink-0 rounded-xl shadow-neu-flat flex items-center justify-center ${e.state === "auto" ? "text-neu-text-sub" : "text-neu-accent"} group-hover:shadow-neu-flat-lg transition-shadow`}>
                      <i data-lucide={e.icon} className="w-5 h-5"></i>
                    </div>
                    <div className="flex-1 rounded-2xl shadow-neu-pressed-sm px-4 py-3 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-neu-text-main">{e.action}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neu-text-sub whitespace-nowrap">{e.room}</span>
                    </div>
                    <span className={`hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest ${e.state === "auto" ? "text-neu-text-sub" : "text-emerald-500"}`}>
                      {e.state}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 pt-6 border-t border-neu-text-sub/15 flex items-center justify-between gap-3">
                <span className="text-xs text-neu-text-sub italic">06 events · last refreshed two minutes ago</span>
                <button className="px-5 py-2.5 rounded-xl shadow-neu-flat text-xs font-bold text-neu-accent hover:shadow-neu-flat-lg active:shadow-neu-pressed transition-all flex items-center gap-2">
                  <span>View full log</span>
                  <i data-lucide="arrow-right" className="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          </section>

          {/* Voices — testimonial trio with circular portraits */}
          <section id="voices" className="fade-in" style={{ animationDelay: "0.45s" }}>
            <div className="flex items-end justify-between mb-10 px-2 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-neu-accent uppercase tracking-[0.25em] mb-2">— Voices · 08</span>
                <h2 className="text-2xl md:text-3xl font-bold text-neu-text-main">From the people who live with it</h2>
              </div>
              <p className="hidden md:block text-sm text-neu-text-sub max-w-sm">Three notes from owners. We left the typos in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {VOICES.map((v, i) => (
                <figure key={i} className="bg-neu-bg p-6 rounded-3xl shadow-neu-flat flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full shadow-neu-flat p-1.5 shrink-0">
                      <div className="rounded-full overflow-hidden shadow-neu-pressed-sm w-full h-full">
                        <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-neu-text-main">{v.name}</h4>
                      <p className="text-xs uppercase tracking-widest text-neu-text-sub">{v.role}</p>
                    </div>
                  </div>
                  <blockquote className="text-base italic text-neu-text-main leading-relaxed">
                    {`"${v.quote}"`}
                  </blockquote>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neu-text-sub pt-2 border-t border-neu-text-sub/15">
                    <span>{v.note}</span>
                    <span>{v.since}</span>
                  </div>
                </figure>
              ))}
            </div>
          </section>

          {/* FAQ — neumorphic <details> accordion */}
          <section id="faq" className="fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-end justify-between mb-10 px-2 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-neu-accent uppercase tracking-[0.25em] mb-2">— Asked · 09</span>
                <h2 className="text-2xl md:text-3xl font-bold text-neu-text-main">Things people ask before they buy</h2>
              </div>
              <p className="hidden md:block text-sm text-neu-text-sub max-w-sm">Answers we kept short. Anything else, the studio replies in a day.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
              <div className="lg:col-span-4">
                <div className="rounded-3xl shadow-neu-flat p-2">
                  <div className="rounded-3xl shadow-neu-pressed-sm overflow-hidden aspect-[3/4]">
                    <img src="https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop" alt="Quiet apartment" className="w-full h-full object-cover" />
                  </div>
                </div>
                <p className="mt-5 text-sm text-neu-text-sub italic leading-relaxed px-1">
                  Photographed in a SmartLiving home in Lisbon. The hub sits behind that pile of books, somewhere.
                </p>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-4">
                {FAQS.map((f, i) => (
                  <details key={i} className="neu-faq bg-neu-bg p-6 rounded-2xl shadow-neu-flat group" open={f.open ? true : undefined}>
                    <summary className="flex items-center justify-between gap-6">
                      <h3 className="text-base md:text-lg font-bold text-neu-text-main">{f.q}</h3>
                      <span className="neu-chevron h-9 w-9 rounded-xl shadow-neu-pressed-sm flex items-center justify-center text-neu-accent shrink-0">
                        <i data-lucide="chevron-down" className="w-5 h-5"></i>
                      </span>
                    </summary>
                    <p className="mt-4 text-sm text-neu-text-sub leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="mt-auto py-10 px-6 border-t border-gray-200/20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-neu-text-main">SmartLiving</h4>
              <p className="text-sm text-neu-text-sub mt-1">Simplicity is the ultimate sophistication.</p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="h-10 w-10 rounded-full shadow-neu-flat flex items-center justify-center text-neu-text-sub hover:text-neu-accent active:shadow-neu-pressed transition-all">
                <i data-lucide="twitter" className="w-5 h-5"></i>
              </a>
              <a href="#" className="h-10 w-10 rounded-full shadow-neu-flat flex items-center justify-center text-neu-text-sub hover:text-neu-accent active:shadow-neu-pressed transition-all">
                <i data-lucide="github" className="w-5 h-5"></i>
              </a>
              <a href="#" className="h-10 w-10 rounded-full shadow-neu-flat flex items-center justify-center text-neu-text-sub hover:text-neu-accent active:shadow-neu-pressed transition-all">
                <i data-lucide="linkedin" className="w-5 h-5"></i>
              </a>
            </div>

            <p className="text-xs text-neu-text-sub">© 2026 SmartLiving UI Kit.</p>
          </div>
        </footer>

        {/* Logic — runs after React mount via the preview's script-hoister.
            createIcons() walks every <i data-lucide=...> and swaps in the SVG;
            updateTemp/toggleDevice are exposed on window so the React-side
            onClick handlers can call them. Mobile-menu, scroll-shadow,
            and scoped fan-spin keyframes copied verbatim from the HTML. */}
        <script dangerouslySetInnerHTML={{ __html: `
            // 1. Initialize Icons
            lucide.createIcons();

            // 2. Mobile Menu Logic
            const menuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const navbar = document.getElementById('navbar');

            if (menuBtn && mobileMenu) {
              menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenu.classList.contains('hidden') ? 'menu' : 'x';
                menuBtn.innerHTML = '<i data-lucide="' + icon + '" class="w-5 h-5"></i>';
                lucide.createIcons();
                if (!mobileMenu.classList.contains('hidden')) {
                  menuBtn.classList.add('shadow-neu-pressed');
                  menuBtn.classList.remove('shadow-neu-flat');
                } else {
                  menuBtn.classList.remove('shadow-neu-pressed');
                  menuBtn.classList.add('shadow-neu-flat');
                }
              });
              document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.addEventListener('click', () => {
                  mobileMenu.classList.add('hidden');
                  menuBtn.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
                  menuBtn.classList.remove('shadow-neu-pressed');
                  menuBtn.classList.add('shadow-neu-flat');
                  lucide.createIcons();
                });
              });
            }

            // 3. Thermostat
            window.__neu_temp = 22;
            window.updateTemp = function (change) {
              const tempVal = document.getElementById('temp-val');
              if (!tempVal) return;
              window.__neu_temp += change;
              if (window.__neu_temp < 16) window.__neu_temp = 16;
              if (window.__neu_temp > 32) window.__neu_temp = 32;
              tempVal.style.opacity = '0';
              setTimeout(() => {
                tempVal.innerText = window.__neu_temp;
                tempVal.style.opacity = '1';
              }, 150);
            };

            // 4. Device toggle visual feedback
            window.toggleDevice = function (id) {
              const checkbox = document.getElementById('toggle-' + id);
              const iconBtn = document.getElementById('icon-' + id);
              if (!checkbox || !iconBtn) return;
              const icon = iconBtn.querySelector('svg');
              if (checkbox.checked) {
                iconBtn.classList.remove('shadow-neu-flat', 'text-neu-text-sub');
                iconBtn.classList.add('shadow-neu-pressed');
                if (id === 'lamp') iconBtn.classList.add('text-neu-accent');
                if (id === 'ac') {
                  iconBtn.classList.add('text-blue-500');
                  if (icon) icon.classList.add('animate-spin-slow');
                }
                if (id === 'lock') iconBtn.classList.add('text-green-500');
                if (id === 'tv') iconBtn.classList.add('text-neu-danger');
              } else {
                iconBtn.classList.add('shadow-neu-flat', 'text-neu-text-sub');
                iconBtn.classList.remove('shadow-neu-pressed', 'text-neu-accent', 'text-blue-500', 'text-green-500', 'text-neu-danger');
                if (id === 'ac' && icon) icon.classList.remove('animate-spin-slow');
              }
            };

            // 5. Scroll Shadow on Navbar
            window.addEventListener('scroll', () => {
              if (!navbar) return;
              if (window.scrollY > 10) navbar.classList.add('shadow-neu-flat');
              else navbar.classList.remove('shadow-neu-flat');
            });
        ` }} />
      </div>
    </>
  );
}

export default Neumorphism;
