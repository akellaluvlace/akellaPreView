export default function T77MeshGradient() {
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#atelier", label: "Atelier" },
    { href: "#science", label: "Science" },
    { href: "#stories", label: "Stories" },
    { href: "#faq", label: "FAQ" },
  ];

  const atelierStages = [
    { delay: "0s", stage: "Stage I", title: "Breath Capture", tint: "text-indigo-200", img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1400&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=300&q=85&auto=format&fit=crop", alt: "Breath capture" },
    { delay: "4s", stage: "Stage II", title: "Field Recording", tint: "text-pink-200", img: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=1400&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=300&q=85&auto=format&fit=crop", alt: "Field recording" },
    { delay: "8s", stage: "Stage III", title: "Composition", tint: "text-teal-200", img: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=1400&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=300&q=85&auto=format&fit=crop", alt: "Composition" },
    { delay: "12s", stage: "Stage IV", title: "Mastering Pass", tint: "text-purple-200", img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1400&q=85&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=300&q=85&auto=format&fit=crop", alt: "Mastering pass" },
  ];

  // Witnessed marquee tiles — caption pill sub-types pre-computed (no Tailwind interpolation, §M.14)
  const witnessedTiles = [
    { aspect: "w-72 aspect-[3/4]", shadow: "shadow-indigo-500/5", dot: "bg-indigo-400", label: "Vogue Health", quote: "\"A meditation cathedral in your pocket.\"", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=85&auto=format&fit=crop", alt: "Vogue Health" },
    { aspect: "w-96 aspect-[16/10]", shadow: "shadow-pink-500/5", dot: "bg-pink-400", label: "Field · Kyoto", img: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=900&q=85&auto=format&fit=crop", alt: "Field Note · Kyoto" },
    { aspect: "w-72 aspect-[3/4]", shadow: "shadow-teal-500/5", dot: "bg-teal-400", label: "The Atlantic", quote: "\"Generative calm, finally.\"", img: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=600&q=85&auto=format&fit=crop", alt: "The Atlantic" },
    { aspect: "w-80 aspect-[16/10]", shadow: "shadow-orange-500/5", dot: "bg-orange-400", label: "Studio · Lisbon", img: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=800&q=85&auto=format&fit=crop", alt: "Studio · Lisbon" },
    { aspect: "w-72 aspect-[3/4]", shadow: "shadow-purple-500/5", dot: "bg-purple-400", label: "Wired", quote: "\"The first app that listens back.\"", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=600&q=85&auto=format&fit=crop", alt: "Wired" },
    { aspect: "w-96 aspect-[16/10]", shadow: "shadow-emerald-500/5", dot: "bg-emerald-400", label: "Atelier · Marfa", img: "https://images.unsplash.com/photo-1618488373960-404fe668e524?w=900&q=85&auto=format&fit=crop", alt: "Atelier · Marfa" },
    { aspect: "w-72 aspect-[3/4]", shadow: "shadow-rose-500/5", dot: "bg-rose-400", label: "Monocle Radio", quote: "\"My new on-air silence.\"", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=600&q=85&auto=format&fit=crop", alt: "Monocle Radio" },
  ];

  const faqItems = [
    { q: "Do I need a wearable for Bio-Rhythm Sync™?", a: "No. Aura works beautifully on its own with manual mood tags. Pairing an Apple Watch, Whoop, or Oura ring unlocks live HRV-driven scenes, but it is entirely optional.", open: true },
    { q: "How is the audio engine different from looped tracks?", a: "Each session is composed in real time from a layered library of field recordings, harmonic pads, and binaural carriers. No two sessions are identical — your engine seeds itself from your current state." },
    { q: "Will Aura work offline on a flight?", a: "Yes. Premium accounts can pin up to twelve scenes for offline use. The visual engine renders locally and the audio model continues to compose without a network." },
    { q: "Is the breathing data stored anywhere?", a: "Biometric streams stay on-device by default. We process them ephemerally, never log them server-side, and never sell them. You can purge cached state from Settings → Privacy at any time." },
    { q: "What if I want to cancel?", a: "One tap from your account screen. No phone calls, no exit interview. The free tier remains available indefinitely with three core scenes." },
  ];

  const features = [
    {
      span: "md:col-span-2",
      iconBg: "bg-indigo-100 text-indigo-600",
      title: "Bio-Rhythm Sync™",
      desc: "Our AI analyzes your heart rate variability (HRV) to generate a custom soundscape that pulls you into coherence.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
      cta: true,
      decoration: <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-indigo-200 to-transparent rounded-tl-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>,
    },
    {
      span: "",
      iconBg: "bg-pink-100 text-pink-600",
      title: "Sleep States",
      desc: "Drift off with binaural beats engineered to lower brainwave frequencies to Delta waves.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
      decoration: <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-200 rounded-full blur-2xl group-hover:bg-pink-300 transition-colors"></div>,
    },
    {
      span: "",
      iconBg: "bg-teal-100 text-teal-600",
      title: "Visual Flow",
      desc: "Open-eye meditation guides with fluid, mesh-gradient visuals that reduce eye strain.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
      decoration: <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-200 rounded-full blur-2xl group-hover:bg-teal-300 transition-colors"></div>,
    },
    {
      span: "md:col-span-2",
      flex: true,
      iconBg: "bg-orange-100 text-orange-600",
      title: "Focus Timers",
      desc: "Pomodoro-style sessions infused with alpha-wave stimulating audio. Perfect for deep work.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
      decoration: <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-100 to-transparent opacity-50 hidden md:block"></div>,
    },
  ];

  const reviews = [
    { name: "Sarah J.", loc: "San Francisco, CA", quote: "I've tried Calm and Headspace, but nothing adjusts to my mood like Aura. The visual breathing exercises are a game changer for my anxiety." },
    { name: "Marcus T.", loc: "London, UK", quote: "The sleep mode is basically magic. I set it to 20 minutes, but I'm usually asleep in 5. The mesh visuals are so soothing.", offset: true },
    { name: "Elena R.", loc: "Berlin, DE", quote: "Finally, a minimalist app that doesn't feel empty. It's beautiful to look at and even better to listen to." },
  ];

  const footerCols = [
    { title: "Product", items: ["Features", "Pricing", "Download", "Changelog"] },
    { title: "Company", items: ["Manifesto", "Careers", "Blog", "Contact"] },
    { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Cookie Settings"] },
  ];

  // Trusted-by teams — real brands via simpleicons.org CDN (free brand-icon SVGs by slug).
  // Hex 64748b matches slate-500 for the muted/grayscale opacity-60 base state.
  const trustedTeams = [
    { name: "Notion",  slug: "notion" },
    { name: "Linear",  slug: "linear" },
    { name: "Figma",   slug: "figma" },
    { name: "Vercel",  slug: "vercel" },
    { name: "Stripe",  slug: "stripe" },
  ];

  // Atelier process notes — 4 micro-cards stacked under the headline so the left rail
  // bottom aligns with the right column's tall image. Inline SVGs (no extra fonts loaded).
  const atelierNotes = [
    { title: "Soundproofed live room", body: "An anechoic chamber buffered against street traffic — captures from 20 Hz to 22 kHz at 32-bit depth.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M19 12a7 7 0 01-2.05 4.95M16 12a4 4 0 01-1.17 2.83" /> },
    { title: "Field recordings", body: "Spring-fed streams in Iceland, dawn chorus in the Cotswolds, monsoon rain on a Kerala roof — composed into the carrier layer.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /> },
    { title: "Real-time composition", body: "Each session seeds itself from your current biometric state — no two listens are ever identical.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /> },
    { title: "Mastering pass", body: "Spectral cleanup, gentle compression, and a final loudness pass to LUFS-16 — calm at every volume.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /> },
  ];

  const Avatar = () => (
    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
      <svg className="w-full h-full text-slate-400 p-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
    </div>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Plus Jakarta Sans', 'sans-serif'] },
              colors: { aura: { dark: '#0F172A', primary: '#4F46E5', secondary: '#EC4899' } },
              animation: {
                'float': 'float 8s ease-in-out infinite',
                'float-delayed': 'float 10s ease-in-out 2s infinite',
                'mesh': 'mesh 25s ease infinite alternate',
                'spin-slow': 'spin 15s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              },
              keyframes: {
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
                mesh: { '0%': { transform: 'scale(1) translate(0, 0)' }, '100%': { transform: 'scale(1.2) translate(20px, -20px)' } }
              }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; padding: 0; overflow-x: hidden; background-color: #F8FAFC; }
        .mesh-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; overflow: hidden; background: #ffffff; }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.7; animation: mesh 20s infinite alternate; }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #C7D2FE; animation-duration: 25s; }
        .blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: #FBCFE8; animation-duration: 30s; animation-delay: -5s; }
        .blob-3 { top: 40%; left: 30%; width: 40vw; height: 40vw; background: #A5F3FC; mix-blend-mode: multiply; animation-duration: 28s; animation-delay: -10s; }
        .blob-4 { bottom: 10%; left: 5%; width: 35vw; height: 35vw; background: #DDD6FE; animation-duration: 22s; animation-delay: -2s; }
        .glass-panel { background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03); }
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.8); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .glass-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.1); background: rgba(255, 255, 255, 0.95); }
        h1, h2, h3, h4 { letter-spacing: -0.025em; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ::selection { background: #818CF8; color: white; }

        @keyframes atelier-fade {
          0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.85); transform: scale(1.04); }
          8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);    transform: scale(1); }
          26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.85); transform: scale(1.04); }
        }
        .atelier-cycle-img {
          animation: atelier-fade 16s linear infinite;
          opacity: 0;
          filter: blur(18px) saturate(0.85);
          transform: scale(1.04);
          will-change: opacity, filter, transform;
        }
        @keyframes atelier-thumb {
          0%, 4%   { opacity: 0.35; }
          8%, 22%  { opacity: 1; }
          26%, 100%{ opacity: 0.35; }
        }
        .atelier-thumb { animation: atelier-thumb 16s linear infinite; opacity: 0.35; }
        @keyframes atelier-scrub { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        .atelier-scrub-bar { animation: atelier-scrub 16s linear infinite; transform-origin: left; }

        .witnessed-track { display: flex; gap: 20px; width: max-content; animation: witnessed-marquee 60s linear infinite; }
        .witnessed-track:hover { animation-play-state: paused; }
        @keyframes witnessed-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 10px)); } }

        .mesh-faq summary::-webkit-details-marker { display: none; }
        .mesh-faq summary { list-style: none; cursor: pointer; }
        .mesh-faq summary .mesh-chevron { transition: transform 250ms ease; }
        .mesh-faq[open] summary .mesh-chevron { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
          .atelier-cycle-img { animation: none; opacity: 1; filter: none; transform: none; }
          .atelier-cycle-img ~ .atelier-cycle-img { display: none; }
          .atelier-thumb { animation: none; opacity: 1; }
          .atelier-scrub-bar { animation: none; transform: scaleX(1); }
          .witnessed-track { animation: none; }
          .mesh-faq summary .mesh-chevron { transition: none; }
        }
      ` }} />

      <div className="scroll-smooth text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">

        <div className="mesh-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
        </div>

        <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-300">
          <div className="glass-panel max-w-7xl mx-auto rounded-full px-6 py-3 flex justify-between items-center shadow-sm">
            <a href="#" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <svg className="relative w-8 h-8 text-slate-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6C12 6 16 9 16 12C16 15 12 18 12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 6C12 6 8 9 8 12C8 15 12 18 12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg md:text-xl tracking-tight">AURA_FLOW</span>
            </a>
            <div className="hidden md:flex gap-8 font-sans text-sm font-medium text-slate-600">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-indigo-600 transition-colors">{l.label}</a>
              ))}
            </div>
            <button className="bg-slate-900 text-white font-display font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-800 hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-500/20">Get App</button>
          </div>
        </nav>

        <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="animate-float inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-md mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-900">V 2.0 Now Live</span>
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-slate-900 mb-8 max-w-5xl mx-auto">
              Find silence in the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">colors of your mind.</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Adaptive soundscapes and generative visuals that respond to your biometric data. Meditation reinvented for the modern flow state.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-display font-bold text-lg overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free Trial
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 bg-white/50 hover:bg-white text-slate-900 rounded-full font-display font-bold text-lg border border-white/80 shadow-sm backdrop-blur-md transition-all duration-300">Watch Demo</button>
            </div>

            <div className="mt-20 relative w-full max-w-5xl mx-auto animate-float-delayed">
              <div className="glass-panel rounded-[2rem] p-2 md:p-4 shadow-2xl relative z-10">
                <div className="bg-gradient-to-b from-slate-50 to-white rounded-[1.5rem] overflow-hidden aspect-[16/9] md:aspect-[21/9] relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -top-20 -left-20 animate-pulse-slow"></div>
                    <div className="absolute w-96 h-96 bg-pink-200/40 rounded-full blur-3xl bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/50 shadow-lg flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 mb-6 relative group cursor-pointer">
                        <div className="absolute inset-0 rounded-full border border-white/20 scale-110 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700"></div>
                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                      <div className="text-center">
                        <h3 className="font-display font-bold text-2xl text-slate-900">Morning Clarity</h3>
                        <p className="text-slate-500 font-medium mt-1">Guided &bull; 10 min</p>
                      </div>
                    </div>
                    <div className="absolute top-8 left-8 hidden md:block glass-card p-4 rounded-2xl animate-float">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase">HRV Sync: 98%</span>
                      </div>
                    </div>
                    <div className="absolute bottom-8 right-8 hidden md:block glass-card p-4 rounded-2xl animate-float-delayed">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        <span className="text-xs font-bold text-slate-600 uppercase">Current Streak: 12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-2xl -z-10 rounded-[3rem]"></div>
            </div>
          </div>
        </header>

        <section className="py-10 border-y border-black/5 bg-white/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {trustedTeams.map((t) => (
                <span key={t.slug} className="group inline-flex items-center gap-2.5 text-slate-500 hover:text-slate-900 transition-colors">
                  <img src={`https://cdn.simpleicons.org/${t.slug}/64748b`} alt={`${t.name} logo`} width="20" height="20" loading="lazy" decoding="async" className="w-5 h-5 md:w-6 md:h-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-display font-bold text-base md:text-lg tracking-tight">{t.name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 mb-6">Designed for holistic harmony.</h2>
              <p className="text-lg text-slate-600">We don't just play sounds. We create an ecosystem for your mind to thrive in, day or night.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
              {features.map((f) => (
                <div key={f.title} className={`${f.span} glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden group ${f.flex ? "flex items-center" : ""}`}>
                  <div className={`relative z-10 ${f.flex ? "w-full md:w-2/3" : "h-full flex flex-col justify-between"}`}>
                    <div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.iconBg}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                      </div>
                      <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mb-2">{f.title}</h3>
                      <p className="text-slate-600 max-w-sm">{f.desc}</p>
                    </div>
                    {f.cta && (
                      <button className="w-fit text-sm font-bold text-indigo-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                        Learn more <span className="text-lg">&rarr;</span>
                      </button>
                    )}
                  </div>
                  {f.decoration}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="atelier" className="py-24 md:py-32 px-4 relative overflow-hidden">
          <div aria-hidden="true" className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"></div>
          <div aria-hidden="true" className="absolute right-[6%] top-[20%] w-[22rem] h-[22rem] rounded-full bg-pink-200/40 blur-3xl pointer-events-none"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 relative z-10">
            {/* Left rail — sticky removed so the column can grow to match the right column's
                tall aspect-[4/5] image; atelierNotes card stack fills the height delta. */}
            <div className="md:col-span-5 flex flex-col">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4 block">Inside the Atelier</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-6 leading-[1.1]">
                Composed in cycles.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">Tuned in silence.</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-md">
                Every soundscape begins with a four-stage ritual. From breath capture through field recording to the final mastering pass &mdash; watch the studio cycle through its current state.
              </p>
              <div className="flex items-center gap-4 max-w-sm mb-8">
                <div className="flex-1 h-px bg-indigo-200/70 relative overflow-hidden">
                  <div className="absolute inset-0 origin-left bg-gradient-to-r from-indigo-500 to-pink-500 atelier-scrub-bar"></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">04 stages &middot; 16s loop</span>
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-sm mb-8">
                {atelierStages.map((s) => (
                  <div key={s.stage} className="atelier-thumb rounded-xl overflow-hidden aspect-square border border-white/60 shadow-sm" style={{ animationDelay: s.delay }}>
                    <img className="w-full h-full object-cover" src={s.thumb} alt={s.alt} />
                  </div>
                ))}
              </div>
              {/* Process Notes card — fills the rest of the column to bottom-align with the
                  right column's aspect-[4/5] image. flex-1 stretches it to whatever's left. */}
              <div className="glass-card rounded-3xl p-6 md:p-7 flex-1 flex flex-col gap-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">— Process Notes</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 tabular-nums">No. 04</span>
                </div>
                <ul className="flex flex-col gap-4">
                  {atelierNotes.map((n, i) => (
                    <li key={n.title} className="flex items-start gap-4">
                      <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${i === 0 ? "bg-indigo-100 text-indigo-600" : i === 1 ? "bg-pink-100 text-pink-600" : i === 2 ? "bg-teal-100 text-teal-600" : "bg-purple-100 text-purple-600"}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{n.icon}</svg>
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="font-display font-semibold text-sm text-slate-900">{n.title}</span>
                        <span className="text-xs text-slate-600 leading-relaxed">{n.body}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:col-span-7">
              <div className="relative w-full aspect-[4/5] md:aspect-[4/5] rounded-[2rem] overflow-hidden glass-panel p-2 md:p-3 shadow-2xl">
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-slate-100">
                  {atelierStages.map((s) => (
                    <img key={s.stage} className="atelier-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: s.delay }} src={s.img} alt={`${s.stage} — ${s.title}`} />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3 min-h-[60px]">
                    <div className="relative flex-1">
                      {atelierStages.map((s) => (
                        <span key={s.stage} className="atelier-cycle-img absolute inset-0 block" style={{ animationDelay: s.delay }}>
                          <span className={`block text-xs font-bold uppercase tracking-[0.3em] ${s.tint} mb-1`}>{s.stage}</span>
                          <span className="block font-display font-bold text-2xl md:text-3xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">{s.title}</span>
                        </span>
                      ))}
                    </div>
                    <span className="rounded-full bg-white/40 backdrop-blur-md border border-white/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-sm shrink-0">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="science" className="py-24 px-4">
          <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2 block">The Science</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-6">Backed by neuroscience, felt by you.</h2>
              <div className="space-y-6 text-slate-600 text-lg">
                <p>Traditional meditation apps use static audio files. Aura Flow uses a proprietary audio engine that constructs sound layers in real-time.</p>
                <p>By mimicking the mathematical patterns found in nature (fractals), our soundscapes actively lower cortisol levels 40% faster than silence alone.</p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-display font-bold text-slate-900">40%</div>
                  <div className="text-sm text-slate-500">Faster Relaxation</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-slate-900">100k+</div>
                  <div className="text-sm text-slate-500">Active Meditators</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="glass-panel rounded-full aspect-square relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
                <div className="absolute inset-0 border border-indigo-200 rounded-full scale-50 opacity-0 animate-[ping_3s_linear_infinite]"></div>
                <div className="absolute inset-0 border border-purple-200 rounded-full scale-75 opacity-0 animate-[ping_3s_linear_1s_infinite]"></div>
                {/* Inner photo disc — a listener mid-session in soft afternoon light. */}
                <div className="relative z-10 w-[80%] aspect-square rounded-full overflow-hidden border-4 border-white/60 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=900&q=85&auto=format&fit=crop"
                    alt="A listener in soft afternoon light, eyes briefly closed mid-session — the calm Aura Flow is built around"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/35 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/70 shadow-sm z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span className="font-display font-bold text-xs uppercase tracking-widest text-slate-900">Neuro-Audio</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="witnessed" className="py-20 md:py-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-pink-600 font-bold uppercase tracking-widest text-sm mb-2 block">Witnessed</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 max-w-2xl leading-[1.1]">
                Pressed, played, paused &mdash; by the world.
              </h2>
            </div>
            <p className="text-slate-600 text-base md:text-lg max-w-md">
              A rolling feed of how people, places and publications have used Aura Flow this season. Hover to pause the strip.
            </p>
          </div>

          <div className="relative py-3">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-24 md:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #F8FAFC 0%, rgba(248,250,252,0.7) 50%, transparent 100%)" }}></div>
            <div aria-hidden="true" className="absolute inset-y-0 right-0 w-24 md:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #F8FAFC 0%, rgba(248,250,252,0.7) 50%, transparent 100%)" }}></div>

            <div className="witnessed-track">
              {[...witnessedTiles, ...witnessedTiles].map((t, i) => (
                <figure key={i} aria-hidden={i >= witnessedTiles.length ? "true" : undefined} className={`relative ${t.aspect} rounded-3xl overflow-hidden shrink-0 border border-white/60 shadow-lg ${t.shadow}`}>
                  <img className="absolute inset-0 w-full h-full object-cover" src={t.img} alt={i >= witnessedTiles.length ? "" : t.alt} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                  <figcaption className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/40 backdrop-blur-md border border-white/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`}></span> {t.label}
                    </span>
                    {t.quote && (
                      <p className="font-display font-bold text-lg text-white mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{t.quote}</p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-center text-slate-900 mb-12">Flow states from around the world.</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {reviews.map((r) => (
                <div key={r.name} className={`glass-card p-8 rounded-3xl flex-1 ${r.offset ? "translate-y-4 md:translate-y-0" : ""}`}>
                  <div className="flex gap-1 text-orange-400 mb-4">★★★★★</div>
                  <p className="text-slate-700 font-medium mb-6">"{r.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar />
                    <div>
                      <div className="font-bold text-sm text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-500">{r.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* md:self-end pushes the image card down so its bottom aligns with the right
                column's FAQ list bottom (right col is taller from heading + 5 details). */}
            <div className="md:col-span-5 relative md:self-end">
              <div aria-hidden="true" className="absolute -inset-6 bg-gradient-to-br from-indigo-300/40 via-purple-300/30 to-pink-300/40 blur-3xl rounded-[3rem] -z-10"></div>
              <div className="relative rounded-[2rem] overflow-hidden glass-panel p-2 shadow-2xl">
                <div className="rounded-[1.5rem] overflow-hidden aspect-[4/5] relative">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=900&q=85&auto=format&fit=crop" alt="Listener at rest" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-900">Common Questions</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-display font-bold text-2xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">Everything before you breathe in.</p>
                    <p className="text-sm text-white/80 mt-2 max-w-xs drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">Five answers most listeners reach for in the first week.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="text-purple-600 font-bold uppercase tracking-widest text-sm mb-3 block">FAQ &middot; 05</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 mb-8 leading-[1.1]">
                Calmly answered.
              </h2>
              <div className="glass-panel rounded-3xl divide-y divide-white/60 overflow-hidden">
                {faqItems.map((it, i) => (
                  <details key={i} className="mesh-faq group p-6 md:p-7" open={it.open}>
                    <summary className="flex items-start justify-between gap-6">
                      <h3 className="font-display font-semibold text-lg md:text-xl text-slate-900">{it.q}</h3>
                      <span className="mesh-chevron shrink-0 mt-1 w-8 h-8 rounded-full bg-white/70 border border-white/80 flex items-center justify-center text-indigo-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </span>
                    </summary>
                    <p className="mt-4 text-slate-600 leading-relaxed max-w-prose">{it.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden relative shadow-2xl group">
            <div className="absolute inset-0 bg-slate-900 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-80"></div>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
            </div>
            <div className="relative z-10 px-6 py-24 md:py-32 text-center text-white">
              <h2 className="font-display font-bold text-4xl md:text-6xl mb-6 tracking-tight">Master your aura.</h2>
              <p className="font-sans text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join the movement towards a calmer, more colorful mind. Try Premium free for 7 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-display font-bold text-lg hover:scale-105 transition-transform duration-200">Get Started</button>
                <div className="text-sm text-white/60 mt-2 sm:mt-0">No credit card required</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-16 pb-8 px-6 bg-white/40 backdrop-blur-xl border-t border-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-slate-900"></div>
                  <span className="font-display font-bold text-lg text-slate-900">AURA_FLOW</span>
                </div>
                <p className="text-sm text-slate-500 max-w-xs">Designing the future of digital mindfulness through generative audio and visual immersion.</p>
              </div>
              {footerCols.map((c) => (
                <div key={c.title}>
                  <h4 className="font-bold text-slate-900 mb-4">{c.title}</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {c.items.map((it) => (
                      <li key={it}><a href="#" className="hover:text-indigo-600">{it}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>&copy; 2024 Aura Flow Inc. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-indigo-600 transition-colors">Twitter/X</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
