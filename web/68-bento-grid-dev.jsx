export default function T68BentoGridDev() {
  // Tailwind classes must be literal strings — `bg-${color}-50` interpolations
  // are invisible to the play CDN's static scan and silently render unstyled.
  const stack = [
    { icon: "atom",        label: "React & Next.js", bg: "bg-indigo-50",  bgHover: "group-hover:bg-indigo-100",  text: "text-indigo-600" },
    { icon: "server",      label: "Node.js",         bg: "bg-emerald-50", bgHover: "group-hover:bg-emerald-100", text: "text-emerald-600" },
    { icon: "code-2",      label: "TypeScript",      bg: "bg-blue-50",    bgHover: "group-hover:bg-blue-100",    text: "text-blue-600" },
    { icon: "layout-grid", label: "Tailwind CSS",    bg: "bg-cyan-50",    bgHover: "group-hover:bg-cyan-100",    text: "text-cyan-600" },
    { icon: "database",    label: "PostgreSQL",      bg: "bg-orange-50",  bgHover: "group-hover:bg-orange-100",  text: "text-orange-600" },
  ];

  const gear = [
    { icon: "terminal-square", color: "text-blue-500", title: "VS Code" },
    { icon: "figma", color: "text-pink-500", title: "Figma" },
    { icon: "command", color: "text-gray-700", title: "Mac" },
    { icon: "globe", color: "text-purple-500", title: "Arc" },
  ];

  const services = ["Web Dev", "UI Design"];
  const footerSocials = ["Twitter", "Instagram", "GitHub"];

  const stripTiles = [
    { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=85&auto=format&fit=crop", alt: "Code editor on laptop", tag: "Editor · 02:14", aspect: "aspect-[3/4]", w: "w-44 md:w-52" },
    { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=85&auto=format&fit=crop", alt: "Team standup", tag: "Team · Q4 sync", aspect: "aspect-[4/3]", w: "w-64 md:w-80" },
    { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop", alt: "Circuit board macro", tag: "Hardware", aspect: "aspect-square", w: "w-48 md:w-56" },
    { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=85&auto=format&fit=crop", alt: "Workspace", tag: "Workspace", aspect: "aspect-[3/4]", w: "w-44 md:w-52" },
    { src: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=900&q=85&auto=format&fit=crop", alt: "Setup at night", tag: "Late · 23:48", aspect: "aspect-[4/3]", w: "w-64 md:w-80" },
    { src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&q=85&auto=format&fit=crop", alt: "Code on screen", tag: "main.tsx", aspect: "aspect-square", w: "w-48 md:w-56" },
    { src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=85&auto=format&fit=crop", alt: "Desk view", tag: "Desk · Tokyo", aspect: "aspect-[3/4]", w: "w-44 md:w-52" },
    { src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=85&auto=format&fit=crop", alt: "Developer at work", tag: "Build · v2.4", aspect: "aspect-[4/3]", w: "w-64 md:w-80" }
  ];

  // Heatmap data — 12 weeks × 7 days, each value 0–4
  const heatmap = [
    [0,1,2,1,0,2,3], [1,2,3,2,1,0,1], [2,3,4,3,2,1,2], [1,2,3,2,0,1,2],
    [3,4,3,2,3,2,1], [2,1,0,1,2,3,2], [3,2,3,4,3,2,1], [2,3,2,3,4,3,2],
    [1,2,3,2,1,0,1], [2,3,4,3,3,2,3], [3,4,4,3,2,1,2], [4,4,3,4,3,2,3]
  ];
  const heatClass = (n) => n === 0 ? "heat-cell" : `heat-cell heat-${n}`;

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    fontFamily: { sans: ['Inter','sans-serif'], display: ['Space Grotesk','sans-serif'] },
    colors: { gray: { 50:'#F9FAFB', 100:'#F3F4F6', 200:'#E5E7EB', 300:'#D1D5DB', 400:'#9CA3AF', 500:'#6B7280', 600:'#4B5563', 700:'#374151', 800:'#1F2937', 900:'#111827' } },
    animation: { 'music-bar': 'music-bar 1s ease-in-out infinite alternate' },
    keyframes: { 'music-bar': { '0%': { height: '20%' }, '100%': { height: '100%' } } }
  } }
};`;

  // NOTE: do not set `background-color` on `.bento-card` here. In the JSX
  // preview iframe React renders <style> inside <body>, which lands AFTER
  // every head stylesheet — including the Tailwind play CDN's runtime
  // utility sheet. A `.bento-card { background-color: #FFFFFF }` rule then
  // wins the cascade and silently neutralises `bg-[#0077B5]`, `bg-gray-900`,
  // `bg-[#1DB954]` etc. on the LinkedIn / GitHub / Spotify / Newsletter
  // cards. Cards default to white via a `bg-white` utility on each card
  // that needs it; coloured cards keep their utility classes.
  const customCss = `body { background-color:#F8F9FA; color:#111827; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; font-family:'Inter',sans-serif; }
.bento-card {
  border:1px solid #E5E7EB; border-radius:1.75rem;
  overflow:hidden; position:relative;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  isolation: isolate;
}
.bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -8px rgba(0,0,0,0.08); border-color:#D1D5DB; z-index:10; }
.img-zoom-container { width:100%; height:100%; overflow:hidden; }
.img-zoom { transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); width:100%; height:100%; object-fit:cover; }
.bento-card:hover .img-zoom { transform: scale(1.08); }
.custom-scrollbar::-webkit-scrollbar { width:4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color:#E5E7EB; border-radius:20px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color:#D1D5DB; }
.music-bar:nth-child(1){ animation-delay:0.0s; }
.music-bar:nth-child(2){ animation-delay:0.2s; }
.music-bar:nth-child(3){ animation-delay:0.4s; }
.music-bar:nth-child(4){ animation-delay:0.1s; }
.noise-bg {
  position:absolute; inset:0; opacity:0.035; pointer-events:none; z-index:1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
.marquee-strip { animation: marquee-x 50s linear infinite; width: max-content; display: flex; gap: 14px; }
.marquee-strip:hover { animation-play-state: paused; }
@keyframes marquee-x {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 7px)); }
}
.strip-tile {
  position: relative; flex-shrink: 0; overflow: hidden; border-radius: 1.25rem;
  border: 1px solid #E5E7EB; background: #fff;
  box-shadow: 0 8px 24px -8px rgba(15, 23, 42, 0.06);
}
.strip-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.25,0.8,0.25,1); }
.strip-tile:hover img { transform: scale(1.06); }
.strip-tile .strip-tag {
  position: absolute; left: 12px; bottom: 12px; padding: 4px 10px;
  background: rgba(255,255,255,0.92); backdrop-filter: blur(8px);
  border: 1px solid rgba(229,231,235,0.7);
  border-radius: 9999px; font-size: 10px; font-weight: 600;
  color: #374151; letter-spacing: 0.04em; text-transform: uppercase;
}
.heat-cell { width: 100%; aspect-ratio: 1; border-radius: 3px; background: #EDF2F7; }
.heat-1 { background: #C7E5C9; }
.heat-2 { background: #7DCB85; }
.heat-3 { background: #4DB257; }
.heat-4 { background: #2E7D38; }
.awards-bg {
  background:
    radial-gradient(circle at 20% 0%, rgba(167, 139, 250, 0.45), transparent 55%),
    radial-gradient(circle at 100% 100%, rgba(244, 114, 182, 0.35), transparent 50%),
    linear-gradient(135deg, #1f1437 0%, #2d1f4b 50%, #1f1437 100%);
}`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    function updateTime(){
      var now = new Date();
      var s = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', timeZoneName:'short' });
      var el = document.getElementById('local-time');
      if (el) el.textContent = s;
    }
    setInterval(updateTime, 60000);
    updateTime();
    var btn = document.getElementById('copy-email-btn');
    if (btn) btn.addEventListener('click', function(){
      var email = 'alex@dev.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function(){
          var t = document.getElementById('copied-toast');
          if (!t) return;
          t.classList.remove('opacity-0');
          setTimeout(function(){ t.classList.add('opacity-0'); }, 2000);
        });
      }
    });
    return;
  }
  setTimeout(init, 50);
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="scroll-smooth p-4 md:p-8 min-h-screen flex flex-col items-center">

        <main className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] gap-4 md:gap-6 mb-12 grid-flow-dense">

          <div className="bento-card bg-white col-span-1 md:col-span-2 row-span-2 p-8 flex flex-col justify-between group">
            <div className="noise-bg"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-100 px-3 py-1.5 rounded-full shadow-sm w-fit transition-transform hover:scale-105 cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-gray-700 tracking-wide">AVAILABLE FOR WORK</span>
                </div>
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-inner">
                  <span className="font-display font-bold text-lg">A.</span>
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Building digital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">products</span> that matter.
              </h1>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-8">
              <button className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 group-hover:scale-[1.02] active:scale-95 duration-200">
                Let's Talk <i data-lucide="arrow-up-right" className="w-4 h-4"></i>
              </button>
              <button className="bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2 hover:border-gray-300">
                <i data-lucide="download" className="w-4 h-4"></i> CV
              </button>
            </div>
          </div>

          <div className="bento-card bg-white col-span-1 row-span-1 relative group min-h-[180px]">
            <div className="img-zoom-container">
              <img src="https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=1000&auto=format&fit=crop" className="img-zoom grayscale group-hover:grayscale-0 opacity-80" alt="Map Location" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
            <div className="absolute bottom-5 left-5 text-white z-20">
              <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full w-fit mb-2">
                <i data-lucide="map-pin" className="w-3.5 h-3.5 text-white"></i>
              </div>
              <p className="font-display font-bold text-lg leading-tight">San Francisco</p>
              <p className="text-xs text-gray-300 font-medium tracking-wide" id="local-time">09:42 AM PST</p>
            </div>
          </div>

          <a href="#" className="bento-card col-span-1 row-span-1 bg-[#0077B5] hover:bg-[#006396] text-white p-6 flex flex-col justify-between group min-h-[180px]">
            <div className="flex justify-between items-start">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                <i data-lucide="linkedin" className="w-6 h-6 text-white"></i>
              </div>
              <i data-lucide="arrow-up-right" className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1"></i>
            </div>
            <div>
              <p className="font-bold text-lg">Let's Connect</p>
              <p className="text-blue-100 text-xs mt-1">Professional Network</p>
            </div>
          </a>

          <div className="bento-card col-span-1 row-span-2 p-6 flex flex-col bg-gradient-to-b from-gray-50 to-white">
            <h3 className="font-display font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
              <i data-lucide="layers" className="w-5 h-5 text-gray-400"></i> Stack
            </h3>
            <div className="flex flex-col gap-2.5 h-full overflow-y-auto custom-scrollbar pr-2">
              {stack.map(s => (
                <div key={s.label} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm hover:border-gray-300 transition-colors cursor-default group">
                  <div className={`p-2 ${s.bg} ${s.bgHover} rounded-lg transition-colors`}>
                    <i data-lucide={s.icon} className={`${s.text} w-4 h-4`}></i>
                  </div>
                  <span className="font-medium text-sm text-gray-700">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <a href="#" className="bento-card col-span-1 row-span-1 bg-gray-900 text-white p-6 flex flex-col justify-between group min-h-[180px]">
            <div className="flex justify-between items-start">
              <i data-lucide="github" className="w-8 h-8 text-gray-200 group-hover:text-white transition-colors"></i>
              <i data-lucide="external-link" className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors"></i>
            </div>
            <div>
              <div className="flex items-end gap-2">
                <p className="font-display font-bold text-4xl">458</p>
                <span className="text-green-400 text-sm font-medium mb-1.5">+12%</span>
              </div>
              <p className="text-gray-400 text-xs mt-1 group-hover:text-gray-300">Commits in 2024</p>
              <div className="flex gap-1 mt-3 opacity-50">
                <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-700 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </a>

          <a href="#" className="bento-card col-span-1 md:col-span-2 row-span-2 relative group overflow-hidden cursor-pointer block min-h-[300px]">
            <div className="img-zoom-container">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" className="img-zoom" alt="SaaS Dashboard" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300"></div>

            <div className="absolute bottom-0 left-0 p-8 w-full z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 shadow-lg shadow-indigo-900/50">Featured Case Study</span>
                  <h3 className="font-display font-bold text-3xl text-white mb-2">Finance SaaS Platform</h3>
                  <p className="text-gray-300 text-sm max-w-sm line-clamp-2 leading-relaxed">A comprehensive financial analytics dashboard handling real-time data visualization for enterprise clients using WebSockets.</p>
                </div>
                <div className="bg-white text-black p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 hidden sm:block shadow-xl">
                  <i data-lucide="arrow-right" className="w-6 h-6"></i>
                </div>
              </div>
            </div>
          </a>

          <div className="bento-card col-span-1 row-span-1 bg-[#1DB954] p-6 flex flex-col justify-between text-white min-h-[180px] group relative overflow-hidden">
            <i data-lucide="music" className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10 rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110 duration-500"></i>
            <div className="flex items-center justify-between relative z-10">
              <div className="bg-black/20 p-2 rounded-full backdrop-blur-md">
                <i data-lucide="headphones" className="w-5 h-5"></i>
              </div>
              <div className="flex gap-1 h-4 items-end">
                <span className="w-1 bg-white/90 rounded-t-sm music-bar h-full animate-music-bar"></span>
                <span className="w-1 bg-white/90 rounded-t-sm music-bar h-2/3 animate-music-bar"></span>
                <span className="w-1 bg-white/90 rounded-t-sm music-bar h-1/2 animate-music-bar"></span>
                <span className="w-1 bg-white/90 rounded-t-sm music-bar h-3/4 animate-music-bar"></span>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-medium text-green-100 uppercase tracking-wider mb-1">Now Coding To</p>
              <p className="font-display font-bold text-xl truncate">Lo-Fi Beats</p>
              <p className="text-sm text-green-50 opacity-90 truncate">Spotify Playlist</p>
            </div>
          </div>

          <a href="#" className="bento-card col-span-1 row-span-1 bg-white p-6 flex flex-col group min-h-[180px]">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-2.5 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <i data-lucide="pen-tool" className="w-5 h-5"></i>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">Mar 12</span>
            </div>
            <h3 className="font-display font-bold text-lg leading-snug group-hover:text-orange-600 transition-colors">
              Optimizing React Performance
            </h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              Techniques for reducing re-renders and improving load times.
            </p>
          </a>

          <div className="bento-card col-span-1 row-span-1 bg-gray-50 p-6 flex flex-col justify-center gap-4 text-center min-h-[180px] hover:bg-white border-dashed border-2 border-gray-200 hover:border-solid hover:border-gray-300 group">
            <div className="mx-auto bg-white p-3 rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
              <i data-lucide="briefcase" className="w-5 h-5 text-gray-600"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Services</p>
              <div className="flex flex-wrap justify-center gap-2">
                {services.map(s => (
                  <span key={s} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:shadow-md transition-shadow">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bento-card col-span-1 row-span-1 bg-white p-6 flex flex-col justify-between group min-h-[180px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <i data-lucide="monitor" className="w-5 h-5 text-gray-700"></i>
              </div>
              <span className="font-bold text-gray-900">My Gear</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2">
              {gear.map(g => (
                <div key={g.title} className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 hover:border-gray-300 transition-colors" title={g.title}>
                  <i data-lucide={g.icon} className={`w-5 h-5 ${g.color}`}></i>
                </div>
              ))}
            </div>
          </div>

          <button id="copy-email-btn" type="button" className="bento-card col-span-1 row-span-1 p-0 flex flex-col justify-center items-center group min-h-[180px] w-full text-left relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-3">
              <div className="bg-gray-100 group-hover:bg-white/20 p-4 rounded-full transition-colors duration-300">
                <i data-lucide="copy" className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors"></i>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 group-hover:text-white transition-colors text-lg" id="email-text">Copy Email</p>
                <p className="text-xs text-gray-400 group-hover:text-indigo-100 transition-colors mt-1">alex@dev.com</p>
              </div>
            </div>

            <div id="copied-toast" className="absolute inset-0 bg-emerald-500 flex items-center justify-center flex-col text-white opacity-0 pointer-events-none transition-opacity duration-200 z-20">
              <i data-lucide="check-circle" className="w-8 h-8 mb-2"></i>
              <span className="font-bold">Copied!</span>
            </div>
          </button>

          <div className="bento-card col-span-1 md:col-span-2 lg:col-span-2 row-span-1 p-8 flex flex-col justify-center bg-gray-900 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors duration-500"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="text-center md:text-left md:flex-1">
                <h3 className="font-display font-bold text-2xl text-white mb-2">Join the newsletter</h3>
                <p className="text-gray-400 text-sm">Get the latest coding tips and resources delivered weekly.</p>
              </div>

              <form className="flex w-full md:w-auto gap-2" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="email@example.com" className="w-full md:w-64 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/20 transition-all" />
                <button type="button" className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors whitespace-nowrap shadow-lg shadow-indigo-900/30">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

        </main>

        {/* CONTINUOUS IMAGE STRIP (MARQUEE) */}
        <section className="w-full max-w-[100rem] mb-12 md:mb-16" aria-label="Studio capture">
          <div className="max-w-7xl mx-auto px-1 mb-6 md:mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">// Captures</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-1.5">From the studio.</h2>
            </div>
            <span className="font-mono text-[10px] text-gray-400 hidden md:block">Auto-scroll · Hover to pause</span>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-r from-[#F8F9FA] to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-[#F8F9FA] to-transparent pointer-events-none"></div>

            <div className="marquee-strip">
              {[...stripTiles, ...stripTiles].map((t, i) => (
                <figure key={i} className={`strip-tile ${t.aspect} ${t.w}`}>
                  <img src={t.src} alt={t.alt} />
                  <span className="strip-tag">{t.tag}</span>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* BENTO SUBGRID — 3 ROWS, IRREGULAR */}
        <section className="w-full max-w-7xl mb-12 md:mb-16" aria-label="Recognition and craft">
          <header className="mb-6 md:mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">// Section 02</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-1.5">Beyond the build.</h2>
            </div>
            <span className="font-mono text-[10px] text-gray-400 hidden md:block">12 · 24 · 25</span>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 auto-rows-[180px] gap-4 md:gap-6">

            {/* ROW 1A. Awards */}
            <div className="bento-card awards-bg col-span-2 row-span-1 p-6 flex flex-col justify-between text-white relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br from-amber-300/40 to-rose-400/20 blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-md border border-white/15">
                  <i data-lucide="trophy" className="w-5 h-5 text-amber-200"></i>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">2024</span>
              </div>
              <div className="relative z-10 space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/80">Recent Wins</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-md text-xs font-medium border border-white/10">★ GitHub Star · 24</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-md text-xs font-medium border border-white/10">Product Hunt #1</span>
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-md text-xs font-medium border border-white/10">CSS Awards</span>
                </div>
              </div>
            </div>

            {/* ROW 1B. Talk */}
            <a href="#" className="bento-card col-span-2 row-span-1 relative group overflow-hidden cursor-pointer">
              <div className="img-zoom-container">
                <img src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=900&q=85&auto=format&fit=crop" className="img-zoom" alt="Conference stage" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/90 via-gray-900/30 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <i data-lucide="play" className="w-5 h-5 text-gray-900 fill-current ml-0.5"></i>
                </div>
              </div>
              <div className="absolute bottom-4 left-5 right-5 z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-1">Latest Talk</p>
                <p className="font-display font-bold text-white text-lg leading-tight">React Summit 2024</p>
                <p className="text-xs text-gray-300 mt-0.5">28 min · 12.4k views</p>
              </div>
            </a>

            {/* ROW 1C. Reading */}
            <div className="bento-card col-span-2 row-span-1 bg-gradient-to-br from-orange-50 to-amber-50/50 p-6 flex gap-5 group">
              <div className="w-20 h-28 shrink-0 rounded-lg shadow-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative border border-gray-300/40 group-hover:rotate-2 transition-transform">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-amber-700/30 to-transparent"></div>
                <div className="absolute inset-x-0 top-2 px-2.5 text-amber-100">
                  <p className="text-[8px] font-mono uppercase tracking-widest opacity-70">A book on</p>
                  <p className="text-[10px] font-bold uppercase mt-1 leading-tight">Designing Data-Intensive Applications</p>
                </div>
                <div className="absolute bottom-2 left-2 text-[7px] text-amber-200/60 font-mono">M. Kleppmann</div>
              </div>
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 mb-2">Now Reading</p>
                  <h3 className="font-display font-bold text-base text-gray-900 leading-tight truncate">Data-Intensive Apps</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Martin Kleppmann</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mb-1.5">
                    <span>Page 184/640</span>
                    <span className="font-semibold text-orange-700">28%</span>
                  </div>
                  <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full w-[28%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2A. Activity Heatmap */}
            <div className="bento-card col-span-2 md:col-span-3 lg:col-span-4 row-span-1 bg-white p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <i data-lucide="activity" className="w-4 h-4 text-emerald-600"></i>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-gray-900">Activity</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Last 12 weeks · 458 contributions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-400">
                  <span>Less</span>
                  <span className="w-2.5 h-2.5 rounded-sm heat-cell"></span>
                  <span className="w-2.5 h-2.5 rounded-sm heat-1"></span>
                  <span className="w-2.5 h-2.5 rounded-sm heat-2"></span>
                  <span className="w-2.5 h-2.5 rounded-sm heat-3"></span>
                  <span className="w-2.5 h-2.5 rounded-sm heat-4"></span>
                  <span>More</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {heatmap.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((d, di) => <div key={di} className={heatClass(d)}></div>)}
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2B. OSS Impact */}
            <div className="bento-card col-span-2 row-span-1 p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex flex-col justify-between border-cyan-100/70 group">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-full bg-white shadow-sm border border-cyan-100">
                  <i data-lucide="git-merge" className="w-4 h-4 text-cyan-600"></i>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-cyan-700/70 font-bold">OSS</span>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="font-display font-bold text-3xl text-gray-900 leading-none tabular-nums">1.2k</p>
                  <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold">Stars earned</p>
                </div>
                <div className="w-px h-8 bg-cyan-200"></div>
                <div>
                  <p className="font-display font-bold text-3xl text-gray-900 leading-none tabular-nums">84</p>
                  <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold">PRs merged</p>
                </div>
              </div>
            </div>

            {/* ROW 3A. Podcast */}
            <a href="#" className="bento-card col-span-2 md:col-span-3 row-span-1 relative group overflow-hidden cursor-pointer">
              <div className="img-zoom-container">
                <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=85&auto=format&fit=crop" className="img-zoom" alt="Podcast studio" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
              <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-300">Episode 047</span>
                </div>
                <i data-lucide="mic" className="w-4 h-4 text-white/60"></i>
              </div>
              <div className="absolute bottom-5 left-5 right-5 z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Recent Interview</p>
                <h3 className="font-display font-bold text-white text-xl leading-tight max-w-md">Shipping fast without breaking trust.</h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-300 font-medium">Software Unscripted</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span className="text-xs text-gray-300 font-medium">42 min</span>
                </div>
              </div>
            </a>

            {/* ROW 3B. Lighthouse */}
            <div className="bento-card col-span-2 md:col-span-1 row-span-1 p-5 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/40 text-white flex flex-col items-center justify-center relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full p-3" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="263 264" strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 50 50)" opacity="0.85"/>
              </svg>
              <div className="relative z-10 text-center">
                <p className="font-display font-bold text-4xl text-emerald-300 leading-none tabular-nums">98</p>
                <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-emerald-200/70 mt-1.5">Lighthouse</p>
              </div>
            </div>

            {/* ROW 3C. Mentoring */}
            <a href="#" className="bento-card col-span-2 row-span-1 relative group overflow-hidden cursor-pointer">
              <div className="img-zoom-container">
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&q=85&auto=format&fit=crop" className="img-zoom grayscale group-hover:grayscale-0 transition-all duration-700" alt="Mentoring session" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/85 via-gray-900/70 to-gray-900/40"></div>
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 bg-emerald-400/90 text-emerald-950 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                  2 Slots
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-1">Mentoring</p>
                <h3 className="font-display font-bold text-white text-lg leading-tight">1:1 sessions · open</h3>
                <p className="text-xs text-gray-300 mt-1">$120/hr · Frontend &amp; systems</p>
              </div>
              <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white text-gray-900 p-2 rounded-full shadow-xl">
                  <i data-lucide="arrow-up-right" className="w-4 h-4"></i>
                </div>
              </div>
            </a>

          </div>
        </section>

        <footer className="text-center pb-8 text-gray-400 text-sm">
          <div className="flex items-center justify-center gap-4 mb-4">
            {footerSocials.map((s, i) => (
              <span key={s} className="contents">
                <a href="#" className="hover:text-gray-900 transition-colors">{s}</a>
                {i < footerSocials.length - 1 && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
              </span>
            ))}
          </div>
          <p>&copy; 2024 Alex Dev. Built with HTML, Tailwind & Coffee.</p>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
