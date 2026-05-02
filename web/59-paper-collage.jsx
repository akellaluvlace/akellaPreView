const WITNESSED_TILES = [
  { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600", alt: "Portrait at dusk", caption: "— at dusk", plate: "PL · I", w: "w-72", aspect: "aspect-[3/4]", filter: "filter grayscale contrast-110", rot: "-rotate-2", mt: "" },
  { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=600", alt: "Concrete stair", caption: "stairwell, slow", plate: "PL · II", w: "w-80", aspect: "aspect-[16/10]", filter: "filter sepia-[.18] contrast-110", rot: "rotate-3", mt: "mt-6" },
  { src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600", alt: "Hands", caption: "hands · margins", plate: "PL · III", w: "w-72", aspect: "aspect-[3/4]", filter: "filter grayscale contrast-110", rot: "-rotate-1", mt: "" },
  { src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=80&w=900", alt: "Wide field", caption: "field, then nothing", plate: "PL · IV", w: "w-96", aspect: "aspect-[16/10]", filter: "filter contrast-110 sepia-[.1]", rot: "rotate-2", mt: "" },
  { src: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=600", alt: "Coat on chair", caption: "coat · empty chair", plate: "PL · V", w: "w-72", aspect: "aspect-[3/4]", filter: "filter grayscale contrast-115", rot: "-rotate-3", mt: "mt-4" },
  { src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&q=80&w=600", alt: "Brick wall and shadow", caption: "wall, 4pm", plate: "PL · VI", w: "w-80", aspect: "aspect-[16/10]", filter: "filter sepia-[.15] contrast-110", rot: "rotate-1", mt: "mt-6" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600", alt: "Quiet portrait", caption: "— she said nothing", plate: "PL · VII", w: "w-72", aspect: "aspect-[3/4]", filter: "filter grayscale contrast-110", rot: "-rotate-2", mt: "" },
];

const WIDTH_CLASS = { "w-72": "w-72", "w-80": "w-80", "w-96": "w-96" };
const ROT_CLASS = { "-rotate-2": "-rotate-2", "rotate-3": "rotate-3", "-rotate-1": "-rotate-1", "rotate-2": "rotate-2", "-rotate-3": "-rotate-3", "rotate-1": "rotate-1" };
const ASPECT_CLASS = { "aspect-[3/4]": "aspect-[3/4]", "aspect-[16/10]": "aspect-[16/10]" };
const MT_CLASS = { "": "", "mt-4": "mt-4", "mt-6": "mt-6" };

const FIELD_NOTES = [
  { src: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=500", alt: "Notebook page", caption: "tea & a list", filter: "filter sepia-[0.25]", pos: "top-4 left-2 md:left-12", w: "w-52 md:w-60", rot: "-rotate-6", hoverRot: "hover:-rotate-2", deco: "pin-chip", z: "z-10 hover:z-30" },
  { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=500", alt: "Window light", caption: "window, soft", filter: "filter contrast-110", pos: "top-2 left-1/3 md:left-[28%]", w: "w-48 md:w-56", rot: "rotate-3", hoverRot: "", deco: "polaroid-tape", z: "z-20 hover:z-30" },
  { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=500", alt: "Interior corner", caption: "borrowed room", filter: "filter grayscale contrast-110", pos: "top-8 right-4 md:right-16", w: "w-52 md:w-60", rot: "rotate-6", hoverRot: "hover:rotate-2", deco: "pin-chip", z: "z-10 hover:z-30" },
  { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=500", alt: "Brass objects", caption: "desk · brass", filter: "filter sepia-[0.2] contrast-110", pos: "top-[42%] left-8 md:left-24", w: "w-48 md:w-56", rot: "rotate-2", hoverRot: "", deco: "polaroid-tape", z: "z-20 hover:z-30" },
  { src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=500", alt: "Portrait, looking down", caption: "— v.", filter: "filter grayscale", pos: "top-[44%] right-2 md:right-32", w: "w-52 md:w-60", rot: "-rotate-4", hoverRot: "hover:-rotate-1", deco: "pin-chip", z: "z-20 hover:z-30" },
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=500", alt: "Hands at table", caption: "supper, after", filter: "filter sepia-[0.15] contrast-110", pos: "bottom-2 left-1/2 -translate-x-1/2", w: "w-52 md:w-64", rot: "-rotate-1", hoverRot: "", deco: "polaroid-tape", z: "z-30" },
];

const ATELIER_LOOKS = [
  { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800", thumb: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=200", alt: "Look 1", filter: "filter grayscale contrast-110", thumbFilter: "filter grayscale", delay: "0s" },
  { src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800", thumb: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=200", alt: "Look 2", filter: "filter sepia-[0.18] contrast-110", thumbFilter: "filter sepia-[0.18]", delay: "4s" },
  { src: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=800", thumb: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=200", alt: "Look 3", filter: "filter grayscale contrast-110", thumbFilter: "filter grayscale", delay: "8s" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800", thumb: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200", alt: "Look 4", filter: "filter sepia-[0.2] contrast-110", thumbFilter: "filter sepia-[0.2]", delay: "12s" },
];

const VOICES = [
  { src: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?auto=format&fit=crop&q=80&w=500", alt: "Reader · Maren", name: "— Maren, illustrator", quote: "It feels like opening someone's drawer. The kind of journal that makes you want to keep your own.", issue: "Issue 03", filter: "filter sepia-[0.2] contrast-110", rot: "-rotate-2", mt: "md:mt-0", ellipse: { cx: 50, cy: 48, rx: 34, ry: 38, dash: "3 5", angle: -6 } },
  { src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=500", alt: "Reader · Tomás", name: "— Tomás, archivist", quote: "Half a magazine, half a confession. I read it slowly because the seams feel important.", issue: "Issue 02", filter: "filter grayscale contrast-110", rot: "rotate-2", mt: "md:mt-12", ellipse: { cx: 50, cy: 46, rx: 32, ry: 36, dash: "2 4", angle: 8 } },
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=500", alt: "Reader · Yael", name: "— Yael, photographer", quote: "The torn edges aren't decoration. They're how the writer tells you which part she'd like back.", issue: "Issue 04", filter: "filter sepia-[0.15] contrast-110", rot: "-rotate-1", mt: "md:mt-4", ellipse: { cx: 50, cy: 50, rx: 36, ry: 38, dash: "3 6", angle: -3 } },
];

const FAQS = [
  { q: "How often does a new issue land?", a: "A loose monthly rhythm — usually mid-month, sometimes late. The Scrapbook is closer to a fanzine than a newsletter; if a fragment isn't ready, it waits.", rot: "-rotate-[0.4deg]", open: true },
  { q: "Is everything hand-cut, or just the look?", a: "The look. Most of the photos are mine, scanned from contact sheets; the typewriter strips are real ribbon. The page glue, sadly, is CSS.", rot: "rotate-[0.6deg]", open: false },
  { q: "Can I submit a fragment of my own?", a: "Yes — short prose, drawings, or photographs. Email the editor with two paragraphs and a single image. We answer slowly, but we answer.", rot: "-rotate-[0.5deg]", open: false },
  { q: "Do you ship a physical copy?", a: "Twice a year, in a small risograph run. Subscribers on the wood-pulp tier get one in the post — paper that smells like paper.", rot: "rotate-[0.4deg]", open: false },
  { q: "Will the archive stay free?", a: "Always. The web should remember things for free. Subscriptions only buy you the print run and the warm feeling of supporting a small operation.", rot: "-rotate-[0.3deg]", open: false },
];

function PaperCollage() {
  return (
    <>
      {/* head */}
      <title>The Scrapbook | A Creative Journal</title>
      <meta name="description" content="A digital collage of thoughts, art, and stories." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=La+Belle+Aurore&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Special+Elite&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'paper': '#F9F5EB',
                        'paper-dark': '#EBE5D5',
                        'kraft': '#D7C09E',
                        'ink': '#1A1A1A',
                        'ink-light': '#4A4A4A',
                        'pencil': '#555555',
                        'highlighter': '#FEF08A',
                        'red-stamp': '#D32F2F',
                    },
                    fontFamily: {
                        'serif': ['"Playfair Display"', 'serif'],
                        'marker': ['"Permanent Marker"', 'cursive'],
                        'hand': ['"La Belle Aurore"', 'cursive'],
                        'typewriter': ['"Special Elite"', 'monospace'],
                    },
                    boxShadow: {
                        'paper': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        'float': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    },
                    animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'tape-flicker': 'flicker 4s infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0) rotate(var(--tw-rotate))' },
                            '50%': { transform: 'translateY(-10px) rotate(var(--tw-rotate))' },
                        }
                    }
                }
            }
        }
` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body {
            background-color: #F9F5EB;
            color: #1A1A1A;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }
        .texture-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 9999; opacity: 0.04;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .paper-shadow { filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.15)); }
        .paper-shadow-lg { filter: drop-shadow(5px 10px 15px rgba(0,0,0,0.2)); }
        .edge-torn-top {
            clip-path: polygon(0% 10px, 5% 0px, 10% 12px, 15% 2px, 20% 10px, 25% 0px, 30% 12px, 35% 2px, 40% 10px, 45% 0px, 50% 12px, 55% 2px, 60% 10px, 65% 0px, 70% 12px, 75% 2px, 80% 10px, 85% 0px, 90% 12px, 95% 2px, 100% 10px, 100% 100%, 0% 100%);
        }
        .edge-torn-bottom {
            clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 12px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 12px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 12px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 12px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 12px), 5% 100%, 0% calc(100% - 10px));
        }
        .edge-rough { clip-path: polygon(2% 0%, 98% 2%, 100% 98%, 0% 100%); }
        .tape {
            background-color: rgba(255, 255, 255, 0.35);
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            backdrop-filter: blur(1px);
            position: absolute; z-index: 20;
        }
        .tape-translucent {
            background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%);
            border: 1px solid rgba(255,255,255,0.3);
        }
        .tape-pattern {
            background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 10px);
            background-color: rgba(230, 230, 200, 0.6);
        }
        .underline-marker { position: relative; display: inline-block; }
        .underline-marker::after {
            content: ""; position: absolute; left: 0; bottom: -2px;
            width: 100%; height: 6px; background-color: #FEF08A;
            z-index: -1; transform: rotate(-1deg); border-radius: 4px;
            opacity: 0.8; transition: all 0.3s ease;
        }
        .underline-marker:hover::after { height: 100%; bottom: 0; transform: rotate(0deg); }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #F9F5EB; }
        ::-webkit-scrollbar-thumb { background: #D7C09E; border-radius: 5px; border: 2px solid #F9F5EB; }

        html, body { overflow-x: clip; }
        .collage-track {
            animation: collage-marquee 60s linear infinite;
            width: max-content;
            display: flex;
            gap: 32px;
            padding: 56px 0;
        }
        .collage-track:hover { animation-play-state: paused; }
        @keyframes collage-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 16px)); }
        }

        .edge-torn-all {
            clip-path: polygon(
                0% 6%, 4% 2%, 9% 8%, 14% 1%, 20% 7%, 26% 0%, 33% 9%,
                40% 2%, 47% 8%, 55% 1%, 62% 9%, 70% 3%, 78% 8%, 86% 0%,
                94% 7%, 100% 4%,
                98% 14%, 100% 24%, 96% 36%, 100% 48%, 97% 60%, 100% 72%,
                96% 84%, 100% 94%,
                94% 100%, 84% 96%, 72% 100%, 58% 95%, 44% 100%, 30% 96%,
                16% 100%, 4% 96%, 0% 92%,
                4% 80%, 0% 68%, 3% 56%, 0% 44%, 4% 30%, 0% 18%
            );
        }
        .edge-torn-diagonal {
            clip-path: polygon(0% 7%, 6% 2%, 14% 9%, 22% 1%, 30% 8%, 40% 3%, 50% 9%, 60% 2%, 70% 8%, 80% 3%, 90% 9%, 100% 4%, 96% 92%, 88% 100%, 76% 94%, 62% 100%, 48% 95%, 34% 100%, 20% 95%, 8% 100%, 0% 93%);
        }

        .polaroid {
            background: #fffdf6;
            padding: 14px 14px 60px 14px;
            box-shadow: 0 14px 28px -10px rgba(0,0,0,0.25), 0 6px 10px -4px rgba(0,0,0,0.15);
            position: relative;
        }
        .polaroid-tape::before {
            content: "";
            position: absolute;
            top: -14px;
            left: 50%;
            transform: translateX(-50%) rotate(-3deg);
            width: 90px;
            height: 22px;
            background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(254, 240, 138, 0.45) 100%);
            border-left: 1px dashed rgba(0,0,0,0.05);
            border-right: 1px dashed rgba(0,0,0,0.05);
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            z-index: 5;
        }
        .pin-chip::before {
            content: "";
            position: absolute;
            top: -9px;
            left: 50%;
            transform: translateX(-50%);
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            background: radial-gradient(circle at 35% 35%, #ff6b6b 0%, #c92a2a 60%, #5e0606 100%);
            box-shadow: 0 2px 3px rgba(0,0,0,0.35);
            z-index: 6;
        }

        .marker-circle {
            position: absolute;
            width: 130%;
            height: 130%;
            top: -15%;
            left: -15%;
            pointer-events: none;
            opacity: 0.55;
        }

        @keyframes scrap-fade {
            0%, 4%   { opacity: 0; filter: blur(14px) saturate(0.85); transform: scale(1.04) rotate(-1deg); }
            8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);    transform: scale(1) rotate(0deg); }
            26%, 100%{ opacity: 0; filter: blur(14px) saturate(0.85); transform: scale(1.04) rotate(-1deg); }
        }
        .scrap-cycle-img {
            animation: scrap-fade 16s linear infinite;
            opacity: 0;
            filter: blur(14px) saturate(0.85);
            transform: scale(1.04) rotate(-1deg);
            will-change: opacity, filter, transform;
        }
        @keyframes scrap-scrub {
            0%   { transform: scaleX(0); }
            100% { transform: scaleX(1); }
        }
        .scrap-scrub-bar {
            animation: scrap-scrub 16s linear infinite;
            transform-origin: left;
        }

        .scrap-faq summary::-webkit-details-marker { display: none; }
        .scrap-faq summary { list-style: none; cursor: pointer; }
        .scrap-faq summary .scrap-chevron { transition: transform 250ms ease; display: inline-block; }
        .scrap-faq[open] summary .scrap-chevron { transform: rotate(45deg); }

        .witnessed-band {
            background: repeating-linear-gradient(
                -3deg,
                #EBE5D5 0px, #EBE5D5 36px,
                #E2DAC4 36px, #E2DAC4 37px
            );
        }

        .layered-photo {
            position: absolute;
            background: #fffdf6;
            padding: 10px 10px 40px 10px;
            box-shadow: 0 18px 30px -10px rgba(0,0,0,0.28), 0 8px 12px -4px rgba(0,0,0,0.18);
        }

        @media (prefers-reduced-motion: reduce) {
            .collage-track { animation: none; }
            .scrap-cycle-img {
                animation: none;
                opacity: 0;
                filter: none;
                transform: none;
            }
            .scrap-cycle-img:first-of-type { opacity: 1; }
            .scrap-scrub-bar { animation: none; transform: scaleX(1); }
            .scrap-faq summary .scrap-chevron { transition: none; }
            .animate-float, .animate-pulse, .animate-spin-slow { animation: none !important; }
        }
` }} />

      <div className="selection:bg-yellow-200 selection:text-black bg-paper text-ink">

        <div className="texture-overlay"></div>

        {/* Sticky Navbar */}
        <nav id="navbar" className="fixed top-0 w-full z-50 transition-all duration-300">
          <div className="absolute inset-0 bg-paper/95 backdrop-blur-sm shadow-sm edge-torn-bottom h-full pointer-events-none"></div>

          <div className="container mx-auto px-6 py-4 relative flex justify-between items-center">
            <a href="#" className="group flex items-center gap-2 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="bg-black text-white p-1 font-marker text-xl group-hover:bg-red-600 transition-colors">TS</div>
              <h1 className="font-marker text-2xl md:text-3xl text-ink tracking-wide">The Scrapbook</h1>
            </a>

            <ul className="hidden md:flex gap-8 items-center font-typewriter text-sm tracking-widest uppercase">
              <li><a href="#journal" className="hover:text-red-600 transition-colors relative group">Journal <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span></a></li>
              <li><a href="#field-notes" className="hover:text-red-600 transition-colors relative group">Field Notes <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span></a></li>
              <li><a href="#atelier" className="hover:text-red-600 transition-colors relative group">Atelier <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span></a></li>
              <li><a href="#voices" className="hover:text-red-600 transition-colors relative group">Voices <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span></a></li>
              <li><a href="#about" className="hover:text-red-600 transition-colors relative group">Editor <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span></a></li>
              <li>
                <a href="#subscribe" className="bg-ink text-paper px-4 py-2 font-marker text-lg transform rotate-2 hover:-rotate-1 transition-all inline-block hover:shadow-lg">
                  Subscribe
                </a>
              </li>
            </ul>

            <button className="md:hidden text-ink hover:text-red-600 transition-colors">
              <i data-lucide="menu" className="w-8 h-8"></i>
            </button>
          </div>
        </nav>

        {/* Floating Badge */}
        <div className="fixed bottom-6 right-6 z-40 md:top-28 md:right-10 md:bottom-auto animate-float hidden md:block">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" style={{ animationDuration: "10s" }}>
              <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
              <text className="font-typewriter text-[11px] uppercase tracking-[2px]">
                <textPath xlinkHref="#curve">Read Every Day • Stay Creative •</textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <i data-lucide="pen-tool" className="w-8 h-8 text-ink"></i>
            </div>
          </div>
        </div>

        {/* Hero */}
        <header className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 relative z-10 order-2 lg:order-1">
              <span className="inline-block bg-highlighter px-2 py-1 font-typewriter text-xs tracking-widest mb-4 transform -rotate-1 border border-transparent hover:border-black transition-all">EST. 2024 • DIGITAL ZINE</span>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-ink leading-[0.9] mb-8">
                Life in <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 italic text-ink-light">Fragments</span>
                  <svg className="absolute -bottom-2 left-0 w-full h-4 text-red-500/80 z-0" preserveAspectRatio="none" viewBox="0 0 100 10"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
                </span>
              </h2>

              <p className="text-lg md:text-xl font-serif text-gray-700 max-w-lg leading-relaxed mb-8 ml-2 border-l-4 border-black pl-6">
                A disorderly collection of thoughts, snapshots, and half-finished ideas taped together on the web.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#journal" className="group relative inline-block">
                  <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 transition-transform group-hover:translate-y-2 group-hover:translate-x-2"></div>
                  <div className="relative bg-paper border-2 border-black px-8 py-3 font-marker text-lg hover:-translate-y-1 transition-transform">
                    Read Latest
                  </div>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-[400px] md:h-[500px] flex justify-center items-center order-1 lg:order-2">

              <div className="absolute w-[400px] h-[400px] bg-kraft rounded-full blur-3xl opacity-30 animate-pulse"></div>

              <div className="absolute w-56 h-72 paper-shadow-lg transform -rotate-12 top-10 left-4 md:left-10 bg-white p-2 z-10 hover:z-30 transition-all duration-300 hover:scale-105">
                <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover filter sepia-[0.3] contrast-125" alt="Notes" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-12 bg-yellow-200/50 backdrop-blur shadow-sm transform -rotate-2"></div>
              </div>

              <div className="absolute w-60 h-60 paper-shadow-lg transform rotate-6 top-20 right-4 md:right-10 bg-white p-3 z-20 hover:z-30 transition-all duration-300 hover:scale-105 hover:rotate-0">
                <img src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover filter grayscale contrast-125" alt="Architecture" />
                <div className="absolute -top-4 right-8 w-24 h-6 tape tape-translucent transform rotate-45"></div>
                <span className="absolute bottom-2 right-2 font-hand text-xs">fig. 2 - structure</span>
              </div>

              <div className="absolute w-48 h-auto paper-shadow-lg transform -rotate-3 bottom-0 md:bottom-10 bg-ink p-1 z-20 hover:z-30 transition-all duration-300 hover:scale-110">
                <div className="bg-white p-4 text-center">
                  <h3 className="font-marker text-2xl uppercase mb-2">New!</h3>
                  <p className="font-typewriter text-xs leading-tight">The beauty of imperfection in digital design.</p>
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-md border border-red-800"></div>
              </div>

            </div>
          </div>
        </header>

        {/* Journal Grid */}
        <main id="journal" className="container mx-auto px-6 py-20">

          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-16 relative">
            <h2 className="font-marker text-4xl md:text-5xl text-ink transform -rotate-1">The Daily Cut</h2>
            <div className="h-1 flex-grow bg-gray-300 border-b border-gray-400 border-dashed w-full md:w-auto self-center mx-4"></div>
            <span className="font-typewriter text-sm text-gray-500">Vol. 04 — 2024</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

            <article className="relative group cursor-pointer">
              <div className="paper-shadow bg-[#F2F0E9] p-6 h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-1 edge-rough">
                <div className="border-b-2 border-ink mb-4 pb-2 flex justify-between items-baseline">
                  <span className="font-bold font-serif text-xl uppercase tracking-tighter">Opinion</span>
                  <span className="font-typewriter text-xs">Jan 22</span>
                </div>
                <h3 className="font-serif font-black text-3xl leading-none mb-3 group-hover:text-red-700 transition-colors">
                  Why We Need Messy Webs
                </h3>
                <div className="columns-2 gap-4 text-xs font-serif text-justify leading-tight mb-4 text-gray-700">
                  <p>In a world of perfect grids, the human touch is lost. We crave the tear, the smudge, the error.</p>
                  <p>Let's bring back the feeling of holding something real, even through a glass screen.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 border-dashed">
                  <span className="font-marker text-sm text-ink underline decoration-wavy decoration-red-400">Read Full Article →</span>
                </div>
              </div>
              <div className="tape w-24 h-6 -top-3 left-1/2 -translate-x-1/2 rotate-1"></div>
            </article>

            <article className="relative group cursor-pointer md:mt-12">
              <div className="paper-shadow bg-white p-4 pb-16 transform rotate-2 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 relative">
                  <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter contrast-110" alt="Art" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <h3 className="font-hand text-2xl font-bold text-center text-ink/80 rotate-1">Morning Coffee Rituals</h3>
                <div className="absolute bottom-4 right-6 text-xs font-typewriter text-gray-400">10:00 AM</div>
              </div>
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full border-4 border-gray-800 z-20 bg-transparent shadow-sm"></div>
              <div className="absolute -top-8 left-10 w-4 h-10 bg-gray-800 z-10 rounded-t-full"></div>
            </article>

            <article className="relative group cursor-pointer">
              <div className="paper-shadow bg-kraft/30 p-2 h-full transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2">
                <div className="border border-dashed border-gray-400 p-6 h-full flex flex-col bg-paper">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-marker text-2xl text-ink leading-none">Travel<br />Log</h3>
                    <div className="w-16 h-20 border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&q=80&w=200" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    </div>
                  </div>
                  <p className="font-hand text-xl leading-relaxed text-gray-600 mb-6 flex-grow">
                    "The streets of Kyoto were quiet, smelling of rain and old wood. I found a shop that sold only paper.

                    <span className="hidden lg:inline">
                      It was filled with handmade washi sheets pressed with dried maple leaves. The owner, an old man with ink-stained fingers, told me that paper has a memory. He said that every fold records a moment in time, just like a wrinkle on a face. I bought a stack of cream-colored sheets, too afraid to ruin them with my clumsy handwriting, yet desperate to capture this feeling before it fades.
                    </span>"
                  </p>
                  <button className="self-start text-xs font-bold uppercase tracking-widest border-b-2 border-red-500 hover:bg-red-50">Continue Reading</button>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full border-2 border-red-stamp/40 text-red-stamp/60 flex items-center justify-center transform -rotate-12 z-20 pointer-events-none">
                <div className="text-[10px] font-typewriter text-center leading-none">AIR MAIL<br />APPROVED</div>
              </div>
            </article>

          </div>
        </main>

        {/* Witnessed — diagonal rotated photo-strip marquee (NOVEL pattern 10) */}
        <section id="witnessed" className="relative py-20 overflow-hidden witnessed-band">
          <div className="absolute top-0 left-0 w-full h-6 bg-paper edge-torn-bottom -mt-1 z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-6 bg-paper edge-torn-top -mb-1 z-10 pointer-events-none"></div>

          <div className="container mx-auto px-6 mb-6 relative z-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 max-w-6xl mx-auto">
              <div>
                <span className="font-typewriter text-xs tracking-[0.3em] uppercase text-pencil">— Sequence 03</span>
                <h2 className="font-marker text-4xl md:text-5xl text-ink mt-1 transform -rotate-1">Witnessed.</h2>
              </div>
              <p className="font-hand text-xl text-gray-700 max-w-md md:text-right transform rotate-1">Stuff I caught with the camera, half by accident, half on purpose.</p>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="collage-track">
              {[...WITNESSED_TILES, ...WITNESSED_TILES].map((tile, i) => {
                const isDup = i >= WITNESSED_TILES.length;
                return (
                  <figure key={i} aria-hidden={isDup ? "true" : undefined} className={`relative shrink-0 ${tile.w} transform ${tile.rot} ${tile.mt}`}>
                    <div className="polaroid polaroid-tape">
                      <img src={tile.src} alt={isDup ? "" : tile.alt} className={`w-full ${tile.aspect} object-cover ${tile.filter}`} />
                      <figcaption className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                        <span className="font-hand text-base text-ink">{tile.caption}</span>
                        <span className="font-typewriter text-[10px] uppercase tracking-widest text-gray-500">{tile.plate}</span>
                      </figcaption>
                    </div>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        {/* Field Notes — Polaroid stack at varying rotations (NOVEL pattern 3) */}
        <section id="field-notes" className="container mx-auto px-6 py-24 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div>
              <span className="font-typewriter text-xs tracking-[0.3em] uppercase text-pencil">— Sequence 04</span>
              <h2 className="font-marker text-4xl md:text-5xl text-ink mt-1 transform rotate-1">Field Notes.</h2>
            </div>
            <p className="font-hand text-xl text-gray-700 max-w-md transform -rotate-1">Six polaroids, scotch tape, the kind of corkboard you don't tidy.</p>
          </div>

          <div className="relative h-[640px] md:h-[680px] max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-paper-dark/40 rounded-sm shadow-inner" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.04) 1px, transparent 2px)", backgroundSize: "22px 22px" }}></div>

            {FIELD_NOTES.map((p, i) => (
              <figure key={i} className={`absolute ${p.pos} ${p.w} transform ${p.rot} ${p.deco} ${p.z} ${p.hoverRot} transition-all duration-300 hover:scale-105`}>
                <div className="polaroid">
                  <img src={p.src} alt={p.alt} className={`w-full aspect-[4/5] object-cover ${p.filter}`} />
                  <figcaption className="absolute bottom-3 left-0 right-0 text-center font-hand text-base text-ink">{p.caption}</figcaption>
                </div>
              </figure>
            ))}

            <div className="absolute bottom-12 right-2 md:right-12 w-44 transform rotate-3 bg-highlighter px-4 py-3 shadow-md z-30">
              <p className="font-typewriter text-[10px] uppercase tracking-widest text-ink/60 mb-1">— note to self</p>
              <p className="font-hand text-lg text-ink leading-snug">don't fix the corner. let it curl.</p>
            </div>
          </div>
        </section>

        {/* Moodboard */}
        <section id="moodboard" className="bg-paper-dark py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-paper edge-torn-top -mt-1 z-10"></div>

          <div className="container mx-auto px-6">
            <h2 className="font-serif italic text-4xl text-center mb-12 relative z-20">
              <span className="underline-marker">Visual Collection</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-8 relative z-10">

              <div className="relative w-64 h-64 md:w-80 md:h-80 paper-shadow bg-white p-2 transform -rotate-3 hover:rotate-0 transition-transform duration-500 hover:z-20">
                <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover" alt="Texture" />
                <div className="tape tape-pattern w-32 h-8 -top-3 left-10 transform -rotate-2"></div>
              </div>

              <div className="relative w-48 h-56 md:w-64 md:h-72 paper-shadow bg-white p-2 transform rotate-6 hover:rotate-2 transition-transform duration-500 hover:z-20 mt-10 md:mt-0">
                <img src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover filter contrast-125" alt="Abstract" />
                <div className="tape w-8 h-12 -right-2 top-1/2 transform rotate-90 bg-red-400/30"></div>
              </div>

              <div className="relative w-72 h-auto paper-shadow bg-ink p-6 transform -rotate-2 hover:rotate-1 transition-transform duration-500 hover:z-20 flex items-center justify-center">
                <p className="font-serif text-white text-xl italic text-center leading-relaxed">
                  "Creativity is allowing yourself to make mistakes. Art is knowing which ones to keep."
                </p>
                <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-white/50"></div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-white/50"></div>
              </div>

              <div className="relative w-56 h-56 md:w-72 md:h-72 paper-shadow bg-white p-2 transform rotate-3 hover:rotate-0 transition-transform duration-500 hover:z-20">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover grayscale opacity-80" alt="Minimal" />
                <div className="tape w-24 h-6 -bottom-3 right-10 transform -rotate-3 bg-blue-200/40"></div>
              </div>

            </div>
          </div>
        </section>

        {/* Mood Board Layered — overlapping torn-paper photo composition (NOVEL pattern 5) */}
        <section id="layered" className="container mx-auto px-6 py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative w-full h-[480px] md:h-[560px]">
                <div className="layered-photo edge-torn-all w-72 md:w-[26rem] h-80 md:h-[24rem] top-0 left-0 transform -rotate-3 z-10">
                  <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=900" className="w-full h-full object-cover filter sepia-[0.25] contrast-105" alt="Texture" />
                </div>
                <div className="layered-photo edge-torn-diagonal w-64 md:w-80 h-72 md:h-96 top-12 md:top-16 left-32 md:left-48 transform rotate-2 z-20">
                  <img src="https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover filter grayscale contrast-110" alt="Brutalist concrete" />
                </div>
                <div className="layered-photo edge-torn-bottom w-56 md:w-72 h-64 md:h-80 bottom-0 left-12 md:left-24 transform -rotate-2 z-30">
                  <img src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=700" className="w-full h-full object-cover filter contrast-110" alt="Editorial portrait" />
                  <span className="absolute top-2 left-3 font-hand text-base text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">— overlap</span>
                </div>
                <div className="layered-photo w-40 md:w-48 h-40 md:h-48 top-4 right-0 transform rotate-6 z-30 polaroid-tape">
                  <img src="https://images.unsplash.com/photo-1485231183945-fffde7cc051e?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover filter grayscale" alt="Hand" />
                </div>
                <div className="layered-photo w-28 md:w-36 h-28 md:h-36 bottom-12 right-4 md:right-12 transform -rotate-6 z-30 pin-chip">
                  <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover filter sepia-[0.2]" alt="Detail" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative bg-paper-dark/40 p-8 md:p-10 transform rotate-1 shadow-paper border border-kraft/40">
                <div className="tape tape-translucent w-24 h-6 -top-3 left-6 rotate-2"></div>
                <div className="tape tape-pattern w-20 h-6 -bottom-3 right-8 -rotate-3"></div>

                <span className="font-typewriter text-xs tracking-[0.3em] uppercase text-pencil">— Index Card 05</span>
                <h2 className="font-marker text-3xl md:text-4xl text-ink mt-2 mb-5 transform -rotate-1">A Layered Method.</h2>
                <p className="font-serif text-base md:text-lg text-gray-800 leading-relaxed mb-5">
                  Pick a stack of seven photos. Tear five of them along the long edge. Don't read the corners — let them argue. The composition is the cut, not the layout.
                </p>
                <ul className="font-typewriter text-sm text-ink-light leading-7 mb-6">
                  <li>I — start with sepia.</li>
                  <li>II — argue with grayscale.</li>
                  <li>III — slip a colour scrap underneath.</li>
                  <li>IV — leave one corner curled.</li>
                </ul>
                <span className="font-hand text-xl text-red-stamp transform inline-block -rotate-2">— a method, not a rule.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Atelier — Sticky-rail oversized cycling polaroid (NOVEL pattern 8 + §M.2 + §M.15) */}
        <section id="atelier" className="bg-paper-dark relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-paper edge-torn-bottom -mt-1 z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-8 bg-paper edge-torn-top -mb-1 z-10 pointer-events-none"></div>

          <div className="container mx-auto px-6 py-24 md:py-32 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start mb-12 md:mb-0">
                <span className="font-typewriter text-xs tracking-[0.3em] uppercase text-pencil">— Sequence 06</span>
                <h2 className="font-marker text-4xl md:text-5xl text-ink mt-2 mb-6 transform -rotate-1">From the<br />atelier.</h2>
                <div className="font-serif text-base md:text-lg text-gray-800 leading-relaxed space-y-4 mb-8">
                  <p>I keep five working images stuck above the desk. They rotate like the moon — one at a time, every few seconds, on no particular axis.</p>
                  <p className="font-hand text-xl text-gray-600 transform -rotate-1">— what's pinned today, anyway.</p>
                </div>

                <div className="flex items-center gap-4 max-w-sm mb-6">
                  <div className="flex-1 h-px bg-ink/20 relative overflow-hidden">
                    <div className="absolute inset-0 origin-left bg-red-stamp scrap-scrub-bar"></div>
                  </div>
                  <span className="font-typewriter text-[10px] uppercase tracking-widest text-pencil whitespace-nowrap">04 looks · 16s loop</span>
                </div>

                <a href="#field-notes" className="group relative inline-block">
                  <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 transition-transform group-hover:translate-y-2 group-hover:translate-x-2"></div>
                  <div className="relative bg-paper border-2 border-black px-7 py-3 font-marker text-base hover:-translate-y-1 transition-transform">
                    More from the desk
                  </div>
                </a>
              </div>

              <div className="md:col-span-7">
                <div className="relative max-w-md mx-auto md:mx-0">
                  <div className="tape tape-translucent w-32 h-8 -top-4 left-1/2 -translate-x-1/2 rotate-2 z-30"></div>
                  <div className="polaroid transform rotate-1 shadow-float">
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                      {ATELIER_LOOKS.map((look, i) => (
                        <img key={i} className={`scrap-cycle-img absolute inset-0 w-full h-full object-cover ${look.filter}`} style={{ animationDelay: look.delay }} src={look.src} alt={look.alt} />
                      ))}
                    </div>
                    <div className="pt-4 px-2 flex items-end justify-between gap-3">
                      <span className="font-hand text-xl text-ink">— pinned today.</span>
                      <span className="font-typewriter text-[10px] uppercase tracking-widest text-pencil">ATELIER · 06</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-6">
                    {ATELIER_LOOKS.map((look, i) => (
                      <div key={i} className="aspect-square overflow-hidden border border-ink/20">
                        <img src={look.thumb} className={`w-full h-full object-cover ${look.thumbFilter}`} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voices — tilted polaroid testimonials with marker-pen circles */}
        <section id="voices" className="container mx-auto px-6 py-24 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <div>
              <span className="font-typewriter text-xs tracking-[0.3em] uppercase text-pencil">— Sequence 07</span>
              <h2 className="font-marker text-4xl md:text-5xl text-ink mt-1 transform rotate-1">Voices, taped on.</h2>
            </div>
            <p className="font-hand text-xl text-gray-700 max-w-md md:text-right transform -rotate-1">A few notes left in the margins by readers I trust.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {VOICES.map((v, i) => (
              <figure key={i} className={`relative ${v.mt} transform ${v.rot} hover:rotate-0 transition-transform duration-500 group`}>
                <div className="polaroid polaroid-tape">
                  <img src={v.src} className={`w-full aspect-[4/5] object-cover ${v.filter}`} alt={v.alt} />
                  <svg className="marker-circle" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <ellipse cx={v.ellipse.cx} cy={v.ellipse.cy} rx={v.ellipse.rx} ry={v.ellipse.ry} fill="none" stroke="#D32F2F" strokeWidth="1.4" strokeDasharray={v.ellipse.dash} transform={`rotate(${v.ellipse.angle} ${v.ellipse.cx} ${v.ellipse.cy})`} />
                  </svg>
                  <figcaption className="absolute bottom-2 left-0 right-0 text-center font-hand text-lg text-ink">{v.name}</figcaption>
                </div>
                <blockquote className="mt-6 font-serif italic text-base md:text-lg text-gray-800 leading-relaxed border-l-4 border-red-stamp/60 pl-5">
                  "{v.quote}"
                </blockquote>
                <span className="block mt-3 font-typewriter text-[11px] uppercase tracking-widest text-pencil">★★★★★ · {v.issue}</span>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ — torn-paper details accordion */}
        <section id="faq" className="bg-paper-dark relative overflow-hidden py-24">
          <div className="absolute top-0 left-0 w-full h-8 bg-paper edge-torn-bottom -mt-1 z-10 pointer-events-none"></div>

          <div className="container mx-auto px-6 max-w-4xl relative z-20">
            <div className="text-center mb-14">
              <span className="font-typewriter text-xs tracking-[0.3em] uppercase text-pencil">— Sequence 08</span>
              <h2 className="font-marker text-4xl md:text-5xl text-ink mt-2 transform -rotate-1 inline-block">Margin Notes <span className="font-serif italic text-ink-light">(FAQ)</span></h2>
            </div>

            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <details key={i} className={`scrap-faq group bg-paper p-6 md:p-7 shadow-paper edge-torn-bottom transform ${f.rot}`} open={f.open || undefined}>
                  <summary className="flex items-center justify-between gap-4">
                    <h3 className="font-marker text-xl md:text-2xl text-ink">{f.q}</h3>
                    <span className="scrap-chevron font-marker text-3xl text-red-stamp leading-none select-none">+</span>
                  </summary>
                  <p className="mt-4 font-serif text-base md:text-lg text-gray-800 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Editor / About */}
        <section id="about" className="container mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16">

          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0 bg-black transform rotate-2 rounded-lg"></div>
            <div className="relative bg-kraft p-1 transform -rotate-1 rounded-lg shadow-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&q=80&w=800" className="w-full h-auto object-cover filter sepia-[.2]" alt="Editor" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform rotate-12 border-2 border-black border-dashed">
              <span className="font-marker text-sm text-center leading-tight">Hello<br />There!</span>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="font-marker text-4xl mb-6">From the Editor's Desk</h3>
            <div className="font-serif text-lg text-gray-800 leading-relaxed space-y-4">
              <p>
                <span className="font-bold text-4xl float-left mr-2 mt-[-10px] font-serif">I</span> started The Scrapbook because I missed the feeling of paper. The web has become too clean, too sanitized.
              </p>
              <p>
                Here, pixels are torn, images are taped, and nothing is perfectly aligned. It's a digital homage to the physical journals I've kept for years.
              </p>
              <p className="font-hand text-2xl mt-8 text-gray-600 transform -rotate-2">
                — Keep cutting, pasting, and creating.
              </p>
            </div>
          </div>
        </section>

        {/* Footer / Newsletter */}
        <footer id="subscribe" className="bg-[#2a2a2a] text-paper-dark pt-24 pb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-10 bg-paper edge-torn-bottom transform rotate-180 -mt-1 z-10"></div>

          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 10%, transparent 10%)", backgroundSize: "20px 20px" }}></div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-marker text-4xl md:text-5xl mb-6 text-white">Join the Collage</h2>
              <p className="font-serif italic text-gray-400 mb-8">Get weekly fragments delivered to your inbox. No spam, just art.</p>

              <form className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto relative">
                <div className="relative flex-grow">
                  <div className="absolute inset-0 bg-white transform rotate-1 rounded-sm"></div>
                  <input type="email" placeholder="email@address.com" className="relative w-full bg-paper p-4 font-typewriter text-ink focus:outline-none border-2 border-transparent focus:border-black transform -rotate-1 shadow-inner" />
                </div>
                <button className="relative group">
                  <div className="absolute inset-0 bg-red-600 transform rotate-2 rounded-sm transition-transform group-hover:rotate-6"></div>
                  <div className="relative bg-ink text-white px-8 py-4 font-marker uppercase tracking-wider transform -rotate-1 border border-white/20 transition-transform group-hover:-translate-y-1 group-hover:-rotate-2">
                    Paste It
                  </div>
                </button>
                <div className="tape w-32 h-8 -top-6 left-0 rotate-3 opacity-20"></div>
                <div className="tape w-32 h-8 -bottom-6 right-0 -rotate-2 opacity-20"></div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
              <div className="text-center md:text-left">
                <h4 className="font-marker text-xl text-white mb-4">The Scrapbook</h4>
                <p className="font-typewriter text-xs text-gray-500">
                  © 2024. Hand-coded pixel collage.<br />
                  Made with <i data-lucide="scissors" className="inline w-3 h-3"></i> & <i data-lucide="coffee" className="inline w-3 h-3"></i>.
                </p>
              </div>

              <div className="flex justify-center gap-6">
                <a href="#" className="hover:text-white hover:scale-125 transition-transform"><i data-lucide="instagram"></i></a>
                <a href="#" className="hover:text-white hover:scale-125 transition-transform"><i data-lucide="twitter"></i></a>
                <a href="#" className="hover:text-white hover:scale-125 transition-transform"><i data-lucide="pinterest"></i></a>
              </div>

              <div className="text-center md:text-right font-typewriter text-xs text-gray-500 flex flex-col gap-2">
                <a href="#" className="hover:text-white hover:underline decoration-wavy">Privacy Policy</a>
                <a href="#" className="hover:text-white hover:underline decoration-wavy">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Init lucide + scroll-shrink navbar — runs after React mount via the preview's script-hoister */}
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof lucide !== 'undefined') lucide.createIcons();
          window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;
            if (window.scrollY > 50) { navbar.classList.add('py-2'); navbar.classList.remove('py-4'); }
            else { navbar.classList.add('py-4'); navbar.classList.remove('py-2'); }
          });
        ` }} />
      </div>
    </>
  );
}

export default PaperCollage;
