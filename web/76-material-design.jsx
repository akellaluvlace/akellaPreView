export default function T76MaterialDesign() {
  const menuLinks = [
    { label: "Dashboard", active: true, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
    { label: "My Tasks", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
    { label: "Calendar", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { label: "Team", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
  ];

  const projectLabels = [
    { color: "bg-pink-500", label: "Mobile App Redesign" },
    { color: "bg-blue-500", label: "Web Platform" },
    { color: "bg-purple-500", label: "Marketing Q4" },
  ];

  const stats = [
    { label: "Completed", value: "12", border: "border-green-500", iconBg: "bg-green-50 text-green-600", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /> },
    { label: "Pending", value: "5", border: "border-orange-400", iconBg: "bg-orange-50 text-orange-500", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: "Velocity", value: "87%", border: "border-primary-500", iconBg: "bg-primary-50 text-primary-600", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
    { label: "Hours", value: "32h", border: "border-blue-400", iconBg: "bg-blue-50 text-blue-500", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ];

  const todaysTasks = [
    { title: "Review Wireframes", tag: "Design System", tagColor: "text-pink-500", checked: false, avatar: "https://i.pravatar.cc/100?img=10" },
    { title: "Team Standup", tag: "General", tagColor: "text-gray-300", checked: true },
    { title: "Client Meeting", tag: "Marketing", tagColor: "text-purple-500", checked: false, time: "14:00" },
    { title: "Fix Navigation Bug", tag: "Development", tagColor: "text-blue-500", checked: false, avatar: "https://i.pravatar.cc/100?img=4" },
  ];

  const projects = [
    { tag: "DESIGN", tagBg: "bg-pink-100 text-pink-700", barColor: "bg-pink-500", title: "Mobile App Redesign", desc: "Overhauling the onboarding flow for better retention.", progress: 75, avatars: [1, 2], deadline: "2 days left", deadlineClass: "" },
    { tag: "DEV", tagBg: "bg-blue-100 text-blue-700", barColor: "bg-blue-500", title: "API Integration", desc: "Connecting frontend dashboard to the new Python backend.", progress: 40, avatars: [3], deadline: "Due Today", deadlineClass: "text-red-500 font-medium" },
  ];

  const activity = [
    { dot: "bg-secondary-400", title: "New Task Added", desc: <>Sarah added "Update Icons" to Design</>, time: "20 mins ago" },
    { dot: "bg-blue-500", title: "File Uploaded", desc: <>Mike uploaded <span className="text-primary-600 font-medium cursor-pointer hover:underline">specs.pdf</span></>, time: "1 hour ago" },
    { dot: "bg-purple-500", title: "Meeting Scheduled", desc: "Weekly Sync for tomorrow", time: "3 hours ago" },
    { dot: "bg-gray-300", title: "Project Completed", desc: "Archive cleanup finished", time: "Yesterday" },
  ];

  // ===== Showcase marquee tiles =====
  const showcaseTiles = [
    { src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=900&q=85&auto=format&fit=crop", status: "Live", statusColor: "text-emerald-600", statusDot: "bg-emerald-500", version: "Sage · v3.2", title: "Aurora Banking", meta: "Shipped 2 days ago · 4 swatch palette", swatches: ["bg-primary-600", "bg-secondary-500", "bg-pink-500", "bg-orange-400"] },
    { src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=900&q=85&auto=format&fit=crop", status: "Review", statusColor: "text-orange-500", statusDot: "bg-orange-400", version: "Concrete · v1.0", title: "Halcyon Realty", meta: "In review · 6 swatch palette", swatches: ["bg-gray-700", "bg-orange-400", "bg-amber-300", "bg-stone-200"] },
    { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", status: "Beta", statusColor: "text-primary-600", statusDot: "bg-primary-500", version: "Volt · v0.9", title: "Relay Telemetry", meta: "Closed beta · 5 swatch palette", swatches: ["bg-primary-600", "bg-blue-500", "bg-purple-500", "bg-cyan-400", "bg-slate-700"] },
    { src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop", status: "Live", statusColor: "text-emerald-600", statusDot: "bg-emerald-500", version: "Linen · v2.1", title: "Atrium Health", meta: "Shipped 1 week ago · 4 swatch palette", swatches: ["bg-emerald-500", "bg-stone-100", "bg-emerald-100", "bg-stone-700"] },
    { src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", status: "Draft", statusColor: "text-gray-500", statusDot: "bg-gray-400", version: "Field · v0.4", title: "Wayland Logistics", meta: "Drafting · 3 swatch palette", swatches: ["bg-amber-700", "bg-stone-300", "bg-stone-900"] },
    { src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop", status: "Live", statusColor: "text-emerald-600", statusDot: "bg-emerald-500", version: "Atrium · v4.0", title: "Cornice Studio", meta: "Shipped 3 days ago · 5 swatch palette", swatches: ["bg-rose-300", "bg-amber-200", "bg-teal-400", "bg-stone-100", "bg-stone-800"] },
    { src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop", status: "Beta", statusColor: "text-primary-600", statusDot: "bg-primary-500", version: "Heritage · v1.4", title: "Kestrel Insurance", meta: "Closed beta · 4 swatch palette", swatches: ["bg-blue-900", "bg-amber-400", "bg-stone-100", "bg-rose-700"] },
  ];

  // ===== Foundations rows =====
  const foundations = [
    { roman: "I", numeral: "I — Color", chipBg: "bg-primary-50", chipText: "text-primary-600", title: <>Tonal palettes, not <span className="font-bold">paint chips</span>.</>, body: "Every brand colour expands into a 13-step tonal palette. Light surfaces, dark surfaces, contrast pairs, and on-state variants are derivations, not authored states. Pick one seed; ship the whole product.", img: "https://images.unsplash.com/photo-1690743300892-cb813b420c36?w=1400&q=85&auto=format&fit=crop", reverse: false, kind: "list", listDot: "bg-primary-500", list: ["13 tones · 4 contrast pairs", "Auto-derived dark mode", "WCAG AA pre-checked"] },
    { roman: "II", numeral: "II — Typography", chipBg: "bg-pink-50", chipText: "text-pink-600", title: <>A type stack that <span className="font-bold">reads at every step</span>.</>, body: "Display, headline, title, body, label — five rolls, one weight scale, four sizes each. Roboto loaded once, applied everywhere. The cascade is opinionated so designers don't have to be.", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85&auto=format&fit=crop", reverse: true, kind: "type", typeBorder: "border-pink-300" },
    { roman: "III", numeral: "III — Motion", chipBg: "bg-secondary-50", chipText: "text-secondary-600", title: <>Easing is a <span className="font-bold">design decision</span>, not a default.</>, body: "Standard, decelerated, accelerated. Three curves, expressive variants for hero moments. Reduced-motion respected by default. Ripples, sheet transitions and FAB rotations all share one timing language.", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1400&q=85&auto=format&fit=crop", reverse: false, kind: "pills", pillBg: "bg-secondary-50", pillText: "text-secondary-600", pills: ["cubic-bezier(.4,0,.2,1)", "200ms · 300ms · 500ms", "prefers-reduced-motion"] },
  ];

  // ===== Process roadmap =====
  const stepDoneCircle = "w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center z-10 shadow-md-1";
  const stepCurrentCircle = "w-14 h-14 rounded-full bg-secondary-100 border-2 border-secondary-500 flex items-center justify-center z-10 shadow-md-2";
  const stepUpcomingCircle = "w-14 h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center z-10 shadow-md-1";

  const processSteps = [
    { state: "done", quarter: "Q1 · Done", quarterColor: "text-emerald-600", title: "Discovery", desc: "12 user interviews · 4 ecosystem audits", img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=85&auto=format&fit=crop", titleColor: "text-gray-800", descColor: "text-gray-500" },
    { state: "done", quarter: "Q1 · Done", quarterColor: "text-emerald-600", title: "Tokenize", desc: "Color, type, spacing, motion · 412 tokens", img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=85&auto=format&fit=crop", titleColor: "text-gray-800", descColor: "text-gray-500" },
    { state: "current", quarter: "Q2 · In flight", quarterColor: "text-secondary-600", title: "Compose", desc: "132 components live · 28 in review", img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=600&q=85&auto=format&fit=crop", titleColor: "text-gray-800", descColor: "text-gray-500" },
    { state: "upcoming", quarter: "Q3 · Planned", quarterColor: "text-gray-400", title: "Validate", desc: "Council review · A11y audit · WCAG AA", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=85&auto=format&fit=crop", titleColor: "text-gray-700", descColor: "text-gray-400" },
    { state: "upcoming", quarter: "Q4 · Planned", quarterColor: "text-gray-400", title: "Release", desc: "v4.0 · Migration guides · Office hours", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=85&auto=format&fit=crop", titleColor: "text-gray-700", descColor: "text-gray-400" },
  ];

  // ===== Dynamic color cycling images =====
  const cyclePalettes = [
    { src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1400&q=85&auto=format&fit=crop", delay: "0s",  alt: "Sage palette" },
    { src: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1400&q=85&auto=format&fit=crop", delay: "4s",  alt: "Peach palette" },
    { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=85&auto=format&fit=crop", delay: "8s",  alt: "Mint palette" },
    { src: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=1400&q=85&auto=format&fit=crop", delay: "12s", alt: "Coral palette" },
  ];
  const cycleSwatches = [
    { dot: "bg-primary-500", label: "Sage" },
    { dot: "bg-pink-500", label: "Peach" },
    { dot: "bg-emerald-500", label: "Mint" },
    { dot: "bg-orange-400", label: "Coral" },
  ];

  // ===== Voices =====
  const voices = [
    { quoteColor: "text-primary-200", quote: "Tokens removed five rounds of theming back-and-forth from every release. Two weeks back, every quarter, in our pocket.", img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=200&q=85&auto=format&fit=crop", border: "border-primary-100", name: "Sasha Linde", role: "Head of Design · Aurora", chipText: "text-primary-600", chipBg: "bg-primary-50", chipLabel: "Sage" },
    { quoteColor: "text-pink-200", quote: "The motion library is the part nobody mentions until it's gone. We swapped to G_TASK and three engineers stopped writing custom easing.", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&q=85&auto=format&fit=crop", border: "border-pink-100", name: "Marie-Rose Otieno", role: "Principal Eng · Halcyon", chipText: "text-pink-600", chipBg: "bg-pink-50", chipLabel: "Peach" },
    { quoteColor: "text-secondary-200", quote: "Our brand colour got a 13-step palette overnight. The dashboard, the mobile app, the marketing site — all reading from the same seed.", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=200&q=85&auto=format&fit=crop", border: "border-secondary-100", name: "Daniel Ng", role: "Director · Atrium Health", chipText: "text-secondary-600", chipBg: "bg-secondary-50", chipLabel: "Mint" },
  ];

  // ===== FAQ =====
  const faqs = [
    { q: "Can we adopt G_TASK gradually, system-by-system?", a: "Yes. Each token category (color, type, motion, spacing) is independent. Most teams start with color, ship two releases, then layer in type. The migration guides cover all four entry points." },
    { q: "Does it work outside web — for iOS, Android, Flutter?", a: "Tokens export as JSON, Style Dictionary, Tailwind, CSS variables, Swift extensions, Kotlin objects, and Flutter ThemeData. One source, every platform." },
    { q: "How is dark mode handled?", a: "Dark mode is derived from the same tonal palette as light. You don't author both — you author one, and dark falls out of tones 90 → 10 of the same hue. Manual overrides are still possible per token." },
    { q: "What happens to our existing components during migration?", a: "A codemod ships with every release. It maps Material 2 token names to Material 3 equivalents, flags the ~6% of cases where there's no 1:1 (custom shades, deprecated states), and leaves your component shells untouched." },
    { q: "Is there a free tier? Can solo designers use G_TASK?", a: "Personal and student licenses are free, forever. The full council suite (governance, audit logs, signed releases) is the paid tier — needed for teams of 12+ designers." },
  ];

  // ===== CTA stats =====
  const ctaStats = [
    { value: "412", label: "Tokens shipped" },
    { value: "132", label: "Components live" },
    { value: "24", label: "Products in production" },
  ];

  const Checkbox = ({ checked }) => (
    <label className="checkbox-wrapper flex items-center cursor-pointer relative">
      <input type="checkbox" className="peer sr-only" defaultChecked={checked} />
      <div className="w-5 h-5 border-2 border-gray-300 rounded bg-white peer-hover:border-primary-500 transition-colors flex items-center justify-center">
        <svg className="w-3 h-3 text-white hidden pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
      </div>
    </label>
  );

  const ShowcaseTile = ({ t, ariaHidden }) => (
    <figure aria-hidden={ariaHidden ? "true" : undefined} className="w-72 shrink-0 bg-white rounded-2xl shadow-md-1 hover:shadow-md-2 transition-shadow overflow-hidden border border-gray-100">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img className="absolute inset-0 w-full h-full object-cover" src={t.src} alt="" loading="lazy" />
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold ${t.statusColor} uppercase tracking-wider`}>
          <span className={`w-1.5 h-1.5 rounded-full ${t.statusDot}`}></span> {t.status}
        </div>
      </div>
      <figcaption className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{t.version}</p>
        <h4 className="text-sm font-bold text-gray-800 mt-1">{t.title}</h4>
        <p className="text-xs text-gray-500 mt-1">{t.meta}</p>
        <div className="flex gap-1 mt-3">
          {t.swatches.map((s, i) => (
            <span key={i} className={`w-4 h-4 rounded-full border border-white ${s}`}></span>
          ))}
        </div>
      </figcaption>
    </figure>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: { sans: ['Roboto', 'sans-serif'] },
              colors: {
                primary: { 50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 900: '#312e81' },
                secondary: { 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488' },
                background: '#f3f4f6',
              },
              boxShadow: {
                'md-1': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
                'md-2': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                'md-3': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                'drawer': '4px 0 24px rgba(0,0,0,0.1)',
              }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        html, body { overflow-x: clip; }

        .full-bleed {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-right: calc(50% - 50vw);
          max-width: none;
        }

        .ripple { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); }
        .ripple:after {
          content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat; background-position: 50%;
          transform: scale(10, 10); opacity: 0;
          transition: transform .5s, opacity 1s;
        }
        .ripple:active:after { transform: scale(0, 0); opacity: 0.2; transition: 0s; }
        .checkbox-wrapper input:checked + div { background-color: #4f46e5; border-color: #4f46e5; }
        .checkbox-wrapper input:checked + div svg { display: block; }

        .md-marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: md-marquee 60s linear infinite;
        }
        .md-marquee-wrap:hover .md-marquee-track { animation-play-state: paused; }
        @keyframes md-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); }
        }

        .md-pulse-dot { animation: md-pulse-ring 2s ease-out infinite; }
        @keyframes md-pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.55); }
          50%      { box-shadow: 0 0 0 10px rgba(20,184,166,0); }
        }

        .md-cycle-img {
          animation: md-cycle 16s linear infinite;
          opacity: 0;
          filter: blur(14px) saturate(0.8);
          transform: scale(1.04);
          will-change: opacity, filter, transform;
        }
        @keyframes md-cycle {
          0%, 4%   { opacity: 0; filter: blur(14px) saturate(0.8); transform: scale(1.04); }
          8%, 22%  { opacity: 1; filter: blur(0) saturate(1);      transform: scale(1); }
          26%, 100%{ opacity: 0; filter: blur(14px) saturate(0.8); transform: scale(1.04); }
        }

        .md-faq summary::-webkit-details-marker { display: none; }
        .md-faq summary { list-style: none; cursor: pointer; }
        .md-faq summary .md-chevron { transition: transform 250ms ease; }
        .md-faq[open] summary .md-chevron { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
          .md-marquee-track { animation: none; }
          .md-pulse-dot { animation: none; }
          .md-cycle-img { animation: none; opacity: 1; filter: none; transform: none; }
          .md-faq summary .md-chevron { transition: none; }
        }
      ` }} />

      <div className="bg-background text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen">

        <div id="overlay" onClick={() => window.toggleSidebar && window.toggleSidebar()} className="fixed inset-0 bg-gray-900/50 z-40 hidden transition-opacity opacity-0 lg:hidden"></div>

        <header className="fixed top-0 left-0 w-full h-16 bg-primary-600 text-white shadow-md z-50 flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => window.toggleSidebar && window.toggleSidebar()} className="lg:hidden p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white text-primary-600 rounded shadow-sm flex items-center justify-center font-bold text-lg">G</div>
              <h1 className="text-xl font-medium tracking-wide">G_TASK</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-primary-700/50 rounded-lg px-3 py-1.5 hover:bg-primary-700 transition-colors">
              <svg className="w-4 h-4 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search tasks..." className="bg-transparent border-none text-sm text-white placeholder-primary-200 focus:outline-none ml-2 w-48" />
            </div>
            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-secondary-400 rounded-full border border-primary-600"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 border-2 border-primary-500 flex items-center justify-center font-bold text-sm cursor-pointer hover:shadow-lg transition-shadow">AL</div>
          </div>
        </header>

        <aside id="sidebar" className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white shadow-drawer transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-40 overflow-y-auto">
          <div className="p-4 space-y-8">
            <div>
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
              <nav className="space-y-1">
                {menuLinks.map((m) => (
                  <a key={m.label} href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${m.active ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{m.icon}</svg>
                    {m.label}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Projects</p>
              <nav className="space-y-1">
                {projectLabels.map((p) => (
                  <a key={p.label} href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">
                    <span className={`w-2.5 h-2.5 rounded-full ${p.color}`}></span> {p.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="px-4 mt-auto">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <p className="font-bold text-sm">Upgrade to Pro</p>
                <p className="text-xs text-white/80 mt-1 mb-3">Get unlimited projects and advanced analytics.</p>
                <button className="w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded shadow hover:bg-gray-50 transition-colors">View Plans</button>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:ml-72 pt-16 min-h-screen transition-all duration-300">
          <main className="p-6 max-w-[1600px] mx-auto">

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-light text-gray-800">Hello, <span className="font-bold">Alex</span></h2>
                <p className="text-gray-500 mt-1">Here's your daily productivity overview.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">Download Report</button>
                <button className="ripple px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium shadow-md hover:bg-primary-700 hover:shadow-lg transition-all">+ Add Task</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((s) => (
                <div key={s.label} className={`bg-white p-6 rounded-xl shadow-md-1 hover:shadow-md-2 transition-shadow cursor-pointer border-l-4 ${s.border}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{s.value}</h3>
                    </div>
                    <span className={`p-2 rounded-lg ${s.iconBg}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md-1 xl:col-span-2 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Productivity Analytics</h3>
                  <select className="text-xs border-none bg-gray-100 text-gray-600 rounded px-2 py-1 focus:ring-0 cursor-pointer">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>
                <div className="relative w-full h-72">
                  <canvas id="productivityChart"></canvas>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md-1 xl:col-span-1 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Today's Tasks</h3>
                  <button className="text-secondary-500 hover:bg-secondary-50 p-1.5 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  {todaysTasks.map((t) => (
                    <div key={t.title} className="group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <Checkbox checked={t.checked} />
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium transition-colors ${t.checked ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-primary-600"}`}>{t.title}</p>
                        <p className={`text-xs ${t.tagColor}`}>{t.tag}</p>
                      </div>
                      {t.avatar && <img className="w-6 h-6 rounded-full grayscale group-hover:grayscale-0 transition-all" src={t.avatar} alt="" />}
                      {t.time && <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">{t.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Active Projects</h3>
                  <a href="#" className="text-sm text-primary-600 font-medium hover:text-primary-700">View All</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((p) => (
                    <div key={p.title} className="bg-white rounded-xl shadow-md-1 hover:shadow-md-2 transition-all p-6 relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${p.barColor}`}></div>
                      <div className="flex justify-between mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${p.tagBg}`}>{p.tag}</span>
                        <button className="text-gray-300 hover:text-gray-500">&bull;&bull;&bull;</button>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">{p.title}</h4>
                      <p className="text-sm text-gray-500 mb-4">{p.desc}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                        <div className={`h-1.5 rounded-full ${p.barColor}`} style={{ width: `${p.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div className="flex -space-x-2">
                          {p.avatars.map((a) => (
                            <img key={a} className="w-6 h-6 rounded-full border border-white" src={`https://i.pravatar.cc/100?img=${a}`} alt="" />
                          ))}
                        </div>
                        <span className={p.deadlineClass}>{p.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="bg-white rounded-xl shadow-md-1 p-6 h-full">
                  <div className="border-l-2 border-gray-100 ml-2 space-y-6">
                    {activity.map((a) => (
                      <div key={a.title} className="relative pl-6">
                        <span className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 border-2 border-white rounded-full ${a.dot}`}></span>
                        <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                        <p className="text-xs text-gray-500">{a.desc}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{a.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* 04 — IN PRODUCTION (Showcase Marquee)               */}
            {/* ================================================== */}
            <section id="showcase" className="mt-16 mb-4">
              <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
                <div>
                  <p className="text-[11px] font-bold text-secondary-600 uppercase tracking-[0.2em] mb-2">// Showcase · 04</p>
                  <h3 className="text-2xl md:text-3xl font-light text-gray-800">Shipping in <span className="font-bold text-primary-600">production</span></h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xl">Live products built on the G_TASK design system. Hover to pause the strip.</p>
                </div>
                <a href="#" className="text-sm text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1">
                  Browse all 24 builds →
                </a>
              </div>
            </section>
            <section className="full-bleed mb-16 overflow-hidden md-marquee-wrap py-3" aria-label="Showcase marquee">
              <div className="md-marquee-track">
                {showcaseTiles.map((t, i) => <ShowcaseTile key={`a-${i}`} t={t} />)}
                {showcaseTiles.map((t, i) => <ShowcaseTile key={`b-${i}`} t={t} ariaHidden />)}
              </div>
            </section>

            {/* ================================================== */}
            {/* 05 — FOUNDATIONS                                    */}
            {/* ================================================== */}
            <section id="foundations" className="full-bleed bg-white py-20 md:py-24 overflow-hidden">
              <div className="max-w-[1280px] mx-auto px-6 md:px-12">
                <div className="max-w-2xl mb-14">
                  <p className="text-[11px] font-bold text-secondary-600 uppercase tracking-[0.2em] mb-2">// Foundations · 05</p>
                  <h3 className="text-3xl md:text-4xl font-light text-gray-800">The three foundations of <span className="font-bold text-primary-600">Material You</span></h3>
                  <p className="text-sm md:text-base text-gray-500 mt-3">Color, type and motion are not decorative finishes. They are the layers your product is built on. Each one ships as a token, each token is documented, each documented token is themable.</p>
                </div>

                <div className="space-y-16 md:space-y-24">
                  {foundations.map((f, i) => (
                    <div key={f.roman} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                      <figure className={`md:col-span-7 relative rounded-2xl overflow-hidden shadow-md-2 aspect-[4/3] bg-gray-100 ${f.reverse ? "md:order-2" : ""}`}>
                        <img className="absolute inset-0 w-full h-full object-cover" src={f.img} alt={`${f.numeral.replace(/^[IVX]+\s*—\s*/, "")} foundation`} loading="lazy" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Foundation · {f.roman}</span>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Plate · {f.roman}</span>
                        </div>
                      </figure>
                      <div className={`md:col-span-5 ${f.reverse ? "md:order-1" : ""}`}>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded mb-3 ${f.chipBg} ${f.chipText}`}>{f.numeral}</span>
                        <h4 className="text-2xl md:text-3xl font-light text-gray-800 mb-3">{f.title}</h4>
                        <p className="text-sm md:text-base text-gray-500 mb-4">{f.body}</p>

                        {f.kind === "list" && (
                          <ul className="space-y-2 text-sm text-gray-600">
                            {f.list.map((li) => (
                              <li key={li} className="flex items-center gap-2"><span className={`w-1.5 h-1.5 rounded-full ${f.listDot}`}></span> {li}</li>
                            ))}
                          </ul>
                        )}
                        {f.kind === "type" && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className={`border-l-2 ${f.typeBorder} pl-3`}><p className="text-xs text-gray-400 uppercase tracking-wider">Display</p><p className="text-2xl font-light text-gray-800">Aa</p></div>
                            <div className={`border-l-2 ${f.typeBorder} pl-3`}><p className="text-xs text-gray-400 uppercase tracking-wider">Headline</p><p className="text-xl font-bold text-gray-800">Aa</p></div>
                            <div className={`border-l-2 ${f.typeBorder} pl-3`}><p className="text-xs text-gray-400 uppercase tracking-wider">Body</p><p className="text-base text-gray-800">Aa</p></div>
                            <div className={`border-l-2 ${f.typeBorder} pl-3`}><p className="text-xs text-gray-400 uppercase tracking-wider">Label</p><p className="text-xs font-medium uppercase tracking-widest text-gray-800">Aa</p></div>
                          </div>
                        )}
                        {f.kind === "pills" && (
                          <div className="flex flex-wrap gap-2">
                            {f.pills.map((p) => (
                              <span key={p} className={`text-xs px-3 py-1 rounded-full ${f.pillBg} ${f.pillText} font-medium`}>{p}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ================================================== */}
            {/* 06 — PROCESS ROADMAP                                */}
            {/* ================================================== */}
            <section id="process" className="mt-16 mb-20">
              <div className="max-w-2xl mb-10">
                <p className="text-[11px] font-bold text-secondary-600 uppercase tracking-[0.2em] mb-2">// Process · 06</p>
                <h3 className="text-3xl md:text-4xl font-light text-gray-800">How a <span className="font-bold text-primary-600">G_TASK release</span> ships.</h3>
                <p className="text-sm md:text-base text-gray-500 mt-3">Five phases, one quarter, every release. Captured in tokens, documented in changesets, signed off by the design council.</p>
              </div>

              <ol className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary-200 via-secondary-300 to-gray-200" aria-hidden="true"></div>
                {processSteps.map((s, i) => (
                  <li key={s.title} className="relative flex flex-col items-start gap-3">
                    <div className={s.state === "done" ? stepDoneCircle : s.state === "current" ? stepCurrentCircle : stepUpcomingCircle}>
                      {s.state === "done" && (
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      )}
                      {s.state === "current" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-secondary-500 md-pulse-dot" aria-hidden="true"></span>
                      )}
                      {s.state === "upcoming" && (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {i === 3 ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          )}
                        </svg>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest tabular-nums ${s.quarterColor}`}>{s.quarter}</span>
                    <div className={`rounded-xl overflow-hidden w-full aspect-[16/10] bg-gray-100 ${s.state === "current" ? "shadow-md-2 ring-2 ring-secondary-200 ring-offset-2 ring-offset-background" : "shadow-md-1"} ${s.state === "upcoming" ? "grayscale opacity-80" : ""}`}>
                      <img className="w-full h-full object-cover" src={s.img} alt={s.title} loading="lazy" />
                    </div>
                    <h4 className={`text-base font-bold ${s.titleColor}`}>{s.title}</h4>
                    <p className={`text-xs leading-relaxed ${s.descColor}`}>{s.desc}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* ================================================== */}
            {/* 07 — DYNAMIC COLOR (Sticky rail + cycling cross-fade)*/}
            {/* ================================================== */}
            <section id="dynamic-color" className="full-bleed bg-gradient-to-br from-primary-50 via-white to-secondary-50/50 py-20 md:py-28 overflow-hidden">
              <div className="max-w-[1280px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                  <div className="md:col-span-5 md:sticky md:top-24 md:self-start">
                    <p className="text-[11px] font-bold text-secondary-600 uppercase tracking-[0.2em] mb-2">// Dynamic Color · 07</p>
                    <h3 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">One seed. <span className="font-bold text-primary-600">Four palettes.</span></h3>
                    <p className="text-sm md:text-base text-gray-500 mb-6">Material You generates a complete tonal system from a single brand colour. Watch four products inherit identity from four seeds — the layout never changes, only the tones.</p>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex gap-1.5">
                        {cycleSwatches.map((c) => (
                          <span key={c.label} className={`w-2 h-2 rounded-full ${c.dot}`}></span>
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 tabular-nums">04 seeds · 16s loop</span>
                    </div>

                    <a href="#" className="ripple inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-md text-sm font-medium shadow-md hover:bg-primary-700 hover:shadow-lg transition-all">
                      Try the generator
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>

                    <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-3xl font-light text-gray-800 tabular-nums">412</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Tokens / palette</p>
                      </div>
                      <div>
                        <p className="text-3xl font-light text-gray-800 tabular-nums">13</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Tonal stops</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7">
                    <div className="relative w-full aspect-[4/5] md:aspect-[16/12] rounded-3xl overflow-hidden shadow-md-3 bg-gray-100 border border-gray-100">
                      {cyclePalettes.map((p) => (
                        <img key={p.delay} className="md-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: p.delay }} src={p.src} alt={p.alt} loading="lazy" />
                      ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-white/80 font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Auto-cycle</p>
                          <p className="text-base text-white font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Sage → Peach → Mint → Coral</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tabular-nums">04 / 04</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mt-5">
                      {cycleSwatches.map((c) => (
                        <div key={c.label} className="p-3 bg-white rounded-xl shadow-md-1 flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${c.dot}`}></span><span className="text-xs font-medium text-gray-700">{c.label}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================== */}
            {/* 08 — VOICES                                         */}
            {/* ================================================== */}
            <section id="voices" className="mt-20 mb-20">
              <div className="max-w-2xl mb-10">
                <p className="text-[11px] font-bold text-secondary-600 uppercase tracking-[0.2em] mb-2">// Voices · 08</p>
                <h3 className="text-3xl md:text-4xl font-light text-gray-800">From the <span className="font-bold text-primary-600">design council</span>.</h3>
                <p className="text-sm md:text-base text-gray-500 mt-3">Three notes from teams who shipped on G_TASK this quarter.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {voices.map((v) => (
                  <figure key={v.name} className="bg-white rounded-2xl shadow-md-1 hover:shadow-md-2 transition-shadow p-6 flex flex-col">
                    <span className={`text-5xl leading-none font-serif ${v.quoteColor}`}>&ldquo;</span>
                    <blockquote className="text-sm md:text-base text-gray-700 leading-relaxed mt-2 mb-6 flex-1">{v.quote}</blockquote>
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <img className={`w-10 h-10 rounded-full object-cover border-2 ${v.border}`} src={v.img} alt="" loading="lazy" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">{v.name}</p>
                          <p className="text-xs text-gray-400">{v.role}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${v.chipText} ${v.chipBg} px-2 py-1 rounded`}>{v.chipLabel}</span>
                    </div>
                  </figure>
                ))}
              </div>
            </section>

            {/* ================================================== */}
            {/* 09 — FAQ                                            */}
            {/* ================================================== */}
            <section id="faq" className="full-bleed bg-white py-20 md:py-24 overflow-hidden">
              <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* flex-col + mt-auto on the figure pushes the toolkit image to the bottom of
                    the left column so its bottom edge aligns with the right column's bottom
                    (FAQ list + migration kit card stack). */}
                <div className="md:col-span-5 flex flex-col">
                  <p className="text-[11px] font-bold text-secondary-600 uppercase tracking-[0.2em] mb-2">// FAQ · 09</p>
                  <h3 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">Common <span className="font-bold text-primary-600">questions</span>.</h3>
                  <p className="text-sm md:text-base text-gray-500 mb-6">If your team is migrating from Material 2, has questions about token export, or wants to evaluate G_TASK against your existing system — start here.</p>
                  <figure className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-md-1 mt-auto">
                    <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=1000&q=85&auto=format&fit=crop" alt="Building aperture · the toolkit reference plate, photographed in late afternoon light" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
                    <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">The toolkit</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Plate · IX</span>
                    </figcaption>
                  </figure>
                </div>

                {/* Right rail: FAQ list + Get-the-toolkit card. flex-col + flex-1 on the
                    card so its height stretches to bottom-align with the left rail's
                    paragraph + aspect-[4/3] toolkit plate. */}
                <div className="md:col-span-7 flex flex-col">
                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                    {faqs.map((f) => (
                      <details key={f.q} className="md-faq group py-5 px-1">
                        <summary className="flex items-center justify-between gap-4">
                          <h4 className="text-base md:text-lg font-medium text-gray-800">{f.q}</h4>
                          <span className="md-chevron text-primary-500 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                          </span>
                        </summary>
                        <p className="text-sm text-gray-500 leading-relaxed mt-3">{f.a}</p>
                      </details>
                    ))}
                  </div>
                  <aside className="mt-8 flex-1 flex flex-col gap-5 p-6 md:p-7 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50/50 border border-primary-100/60 shadow-md-1">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-md-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-600">// Migration · 09b</span>
                        <span className="text-base md:text-lg font-medium text-gray-800">Get the migration kit by email</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">A short PDF with token-name diffs, codemod usage, and the ~6% of cases that need a manual decision. Sent once — no follow-ups, no marketing.</p>
                    <form className="flex flex-col gap-3 mt-auto" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="md-team" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Team</label>
                          <input id="md-team" name="team" type="text" placeholder="Aurora Banking" className="w-full border border-gray-200 rounded-md px-3 py-2.5 bg-white text-gray-800 placeholder:text-gray-300 transition-colors hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="md-email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</label>
                          <input id="md-email" name="email" type="email" placeholder="design@aurora.bank" className="w-full border border-gray-200 rounded-md px-3 py-2.5 bg-white text-gray-800 placeholder:text-gray-300 transition-colors hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
                        <span className="text-xs text-gray-400">No newsletter. One PDF, then silence.</span>
                        <button type="submit" className="ripple px-5 py-2.5 bg-primary-600 text-white rounded-md text-sm font-medium shadow-md hover:bg-primary-700 hover:shadow-lg transition-all inline-flex items-center gap-2">
                          Send the kit
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                      </div>
                    </form>
                  </aside>
                </div>
              </div>
            </section>

            {/* ================================================== */}
            {/* 10 — TOOLKIT CTA                                    */}
            {/* ================================================== */}
            <section id="cta" className="full-bleed relative overflow-hidden">
              <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1920&q=85&auto=format&fit=crop" alt="" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary-900/85 via-primary-700/75 to-primary-900/90"></div>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 25% 80%, rgba(20,184,166,0.25) 0%, transparent 60%)" }}></div>

              <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 py-24 md:py-32 text-white">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 md-pulse-dot"></span>
                  Open · Q1 cohort &middot; 4 seats left
                </span>
                <h3 className="text-4xl md:text-6xl font-light leading-tight max-w-3xl mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">Open the <span className="font-bold italic text-secondary-300">G_TASK</span> toolkit.</h3>
                <p className="text-base md:text-lg text-white/85 max-w-2xl mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">Tokens, components, motion. One license, every platform, lifetime updates inside the cohort window.</p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <a href="#" className="ripple px-6 py-3 bg-white text-primary-700 rounded-md text-sm font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                    Request access
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                  <a href="#" className="px-6 py-3 bg-transparent border border-white/40 text-white rounded-md text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                    Read the changelog
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/15">
                  {ctaStats.map((s) => (
                    <div key={s.label}>
                      <p className="text-3xl md:text-4xl font-light tabular-nums">{s.value}</p>
                      <p className="text-xs uppercase tracking-widest text-white/70 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </main>

          <footer className="mt-8 py-6 text-center">
            <p className="text-xs text-gray-400">&copy; 2023 G_TASK. Designed with Material Principles.</p>
          </footer>
        </div>

        <button className="ripple fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-secondary-500 text-white rounded-full shadow-md-3 hover:shadow-xl hover:bg-secondary-600 active:scale-95 transition-all duration-200 z-50 flex items-center justify-center group">
          <svg className="w-8 h-8 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <div className="absolute right-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Create Task</div>
        </button>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          let isSidebarOpen = false;
          window.toggleSidebar = function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            if (!sidebar || !overlay) return;
            isSidebarOpen = !isSidebarOpen;
            if (isSidebarOpen) {
              sidebar.classList.remove('-translate-x-full');
              overlay.classList.remove('hidden');
              setTimeout(() => overlay.classList.remove('opacity-0'), 10);
              document.body.style.overflow = 'hidden';
            } else {
              sidebar.classList.add('-translate-x-full');
              overlay.classList.add('opacity-0');
              setTimeout(() => overlay.classList.add('hidden'), 300);
              document.body.style.overflow = '';
            }
          };

          function initChart() {
            const el = document.getElementById('productivityChart');
            if (!el || typeof Chart === 'undefined') { setTimeout(initChart, 100); return; }
            const ctx = el.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#4338ca');
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  label: 'Tasks Completed',
                  data: [12, 19, 15, 8, 22, 10, 6],
                  backgroundColor: gradient,
                  borderRadius: 4,
                  barThickness: 24,
                  borderSkipped: false,
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 4, titleFont: { family: 'Roboto', size: 13 }, bodyFont: { family: 'Roboto', size: 13 }, displayColors: false }
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: '#f3f4f6', borderDash: [5, 5] }, ticks: { font: { family: 'Roboto' }, color: '#94a3b8' }, border: { display: false } },
                  x: { grid: { display: false }, ticks: { font: { family: 'Roboto' }, color: '#64748b' }, border: { display: false } }
                },
                animation: { duration: 1500, easing: 'easeOutQuart' }
              }
            });
          }
          // preview iframe re-emits inline scripts after React mounts, so
          // document is always 'complete' here — no DOMContentLoaded fallback
          // needed (it would silently never fire).
          initChart();
        })();
      ` }} />
    </>
  );
}
