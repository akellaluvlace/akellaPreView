export default function T53Claymorphism() {
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
  ];

  const features = [
    { icon: "book-open", bg: "bg-clay-green", border: "hover:border-clay-greenLight", title: "Smart Stories", desc: "Interactive books that read aloud and adapt vocabulary based on your child's age." },
    { icon: "palette", bg: "bg-clay-pink", border: "hover:border-clay-pinkLight", title: "Creative Mode", desc: "A digital canvas with clay-like 3D drawing tools to spark artistic imagination." },
    { icon: "calculator", bg: "bg-clay-blue", border: "hover:border-blue-100", title: "Math Quests", desc: "Solve logic puzzles to unlock new levels and characters in the game world." },
  ];

  const steps = [
    { n: 1, color: "text-clay-pink", title: "Create Profile", desc: "Set up your child's age and interests." },
    { n: 2, color: "text-clay-blue", title: "Choose a Path", desc: "Select Math, Reading, or Logic games." },
    { n: 3, color: "text-clay-green", title: "Track Progress", desc: "Watch them grow via the parent dashboard." },
  ];

  const reviews = [
    { initials: "SJ", bg: "bg-clay-pink", quote: "My daughter used to hate math. Now she asks to play 'the number game' every morning!", name: "Sarah Jenkins", meta: "Mom of 6yr old", hidden: "" },
    { initials: "MR", bg: "bg-clay-blue", quote: "The ad-free experience is a lifesaver. I know my son is safe while learning.", name: "Mike Ross", meta: "Dad of 4yr old", hidden: "" },
    { initials: "AL", bg: "bg-clay-green", quote: "The creative studio is amazing. We print out the drawings and put them on the fridge!", name: "Amy Lee", meta: "Mom of 5yr old", hidden: "hidden lg:flex" },
  ];

  const faqs = [
    { q: "Is this app safe for kids?", a: "Absolutely. We are COPPA compliant, have zero ads, and no external links in the child's interface." },
    { q: "What age range is this for?", a: "PlayLearn is optimized for children ages 3 to 8, with difficulty levels that adjust automatically." },
    { q: "Can I use it on multiple devices?", a: "Yes! One subscription covers up to 4 devices (tablets and phones) across iOS and Android." },
  ];

  const worlds = [
    { bg: "bg-clay-pink",   icon: "book-heart",  title: "Story Cove",     meta: "42 chapters" },
    { bg: "bg-clay-green",  icon: "calculator",  title: "Number Meadow",  meta: "120 puzzles" },
    { bg: "bg-clay-blue",   icon: "palette",     title: "Paint Cove",     meta: "unlimited canvas" },
    { bg: "bg-clay-purple", icon: "music",       title: "Tune Forest",    meta: "28 instruments" },
    { bg: "bg-yellow-400",  icon: "puzzle",      title: "Logic Labs",     meta: "90 challenges" },
  ];

  const pillars = [
    { num: "01", title: "Curiosity",  body: "Every story starts with a question. We let kids tug the thread until they're elbow-deep in physics, history, or words.", bg: "bg-clay-pink",  glow: "bg-clay-pinkLight",  glowPos: "-top-6 -right-6", chip: "bg-clay-pinkLight",  chipText: "text-clay-pink",  chipNum: "94%",  chipBody: "of kids ask more questions in week one", icon: "sparkles",     numColor: "text-clay-pink",  shift: "" },
    { num: "02", title: "Creativity", body: "There is always a paintbrush, a puzzle, a way to remix the answer. Drawings get printed. Songs get saved. Levels can be hand-built.", bg: "bg-clay-green", glow: "bg-clay-greenLight", glowPos: "-top-6 -left-6",  chip: "bg-clay-greenLight", chipText: "text-clay-green", chipNum: "3.2k", chipBody: "drawings made every single day",         icon: "paint-bucket", numColor: "text-clay-green", shift: "md:-translate-y-4" },
    { num: "03", title: "Confidence", body: "Levels celebrate the try, not just the right answer. The reward dispenser refuses to be stingy. We are big fans of progress bars filling up.", bg: "bg-clay-blue", glow: "bg-blue-200",       glowPos: "-top-6 -right-6", chip: "bg-blue-100",       chipText: "text-clay-blue",  chipNum: "+38%", chipBody: "school-reading score after 8 weeks",     icon: "medal",        numColor: "text-clay-blue",  shift: "" },
  ];

  const educators = [
    { initials: "DK", name: "Dr. Dana Kwon",  role: "Lead Curriculum", bio: "15 yrs primary education · PhD in Child Development from Stanford.",   bg: "bg-clay-pink",   roleColor: "text-clay-pink",   chipBg: "bg-clay-pinkLight",  chipText: "text-clay-pink",   tags: ["Reading", "Phonics"] },
    { initials: "MR", name: "Marcus Rivera",  role: "Head of Math",    bio: "11 yrs Montessori · author of <em>Numbers That Wiggle</em> for ages 3–6.", bg: "bg-clay-blue",   roleColor: "text-clay-blue",   chipBg: "bg-blue-100",        chipText: "text-clay-blue",   tags: ["Logic", "Counting"], rich: true },
    { initials: "AP", name: "Aisha Patel",    role: "Game Design",     bio: "9 yrs at LEGO Education · believes recess should never end.",          bg: "bg-clay-green",  roleColor: "text-clay-green",  chipBg: "bg-clay-greenLight", chipText: "text-clay-green",  tags: ["Levels", "Rewards"] },
    { initials: "JT", name: "Jonas Thorne",   role: "Voice & Stories", bio: "Voice actor in 80+ animated series · narrates every Story Cove chapter.", bg: "bg-clay-purple", roleColor: "text-clay-purple", chipBg: "bg-purple-100",      chipText: "text-clay-purple", tags: ["Audio", "Stories"] },
  ];

  const awards = [
    { icon: "award",        color: "text-clay-pink",                   title: "Apple", title2: "Editor's Pick" },
    { icon: "trophy",       color: "text-clay-green",                  title: "Webby", title2: "Family Award '24" },
    { icon: "newspaper",    color: "text-clay-blue",                   title: "The",   title2: "NYT Wirecutter" },
    { icon: "badge-check",  color: "text-clay-purple",                 title: "COPPA", title2: "Certified" },
    { icon: "star",         color: "text-yellow-400 fill-yellow-400",  title: "4.9 / 5", title2: "App Store" },
  ];

  const pressShelf = ["NYT", "The Verge", "Wired", "Common Sense Media", "Fast Company"];

  const proFeatures = ["Unlimited Lessons", "Offline Mode", "Progress Reports", "Multiple Profiles"];
  const productLinks = ["Games", "Pricing", "For Schools"];
  const companyLinks = ["About Us", "Careers", "Contact"];
  const socials = ["facebook", "twitter", "instagram"];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    fontFamily: {
      sans: ['Nunito', 'sans-serif'],
      display: ['Quicksand', 'sans-serif'],
    },
    colors: {
      clay: {
        bg: '#E0F2FE', card: '#FFFFFF',
        pink: '#F472B6', pinkLight: '#FBCFE8',
        green: '#4ADE80', greenLight: '#DCFCE7',
        blue: '#60A5FA', purple: '#A78BFA',
        text: '#334155', sub: '#64748B'
      }
    },
    boxShadow: {
      'clay-card': 'inset 10px 10px 20px rgba(255, 255, 255, 0.8), inset -10px -10px 20px rgba(0, 0, 0, 0.04), 10px 20px 30px rgba(0, 0, 0, 0.06)',
      'clay-btn': 'inset 4px 4px 8px rgba(255, 255, 255, 0.6), inset -4px -4px 8px rgba(0, 0, 0, 0.08), 6px 12px 20px rgba(0, 0, 0, 0.1)',
      'clay-inset': 'inset 6px 6px 12px rgba(0, 0, 0, 0.08), inset -6px -6px 12px rgba(255, 255, 255, 0.8)',
      'clay-float': 'inset 8px 8px 16px rgba(255, 255, 255, 0.5), inset -8px -8px 16px rgba(0, 0, 0, 0.04), 20px 30px 50px rgba(0, 0, 0, 0.12)'
    },
    keyframes: {
      float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
      wiggle: { '0%, 100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } }
    },
    animation: {
      float: 'float 6s ease-in-out infinite',
      'float-delayed': 'float 7s ease-in-out 2s infinite',
      wiggle: 'wiggle 2s ease-in-out infinite',
    }
  } }
};`;

  const customCss = `.squish { transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.1s; }
.squish:active {
  transform: scale(0.95);
  box-shadow: inset 6px 6px 12px rgba(0, 0, 0, 0.05), inset -6px -6px 12px rgba(255, 255, 255, 0.6);
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
#mobile-menu { transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; max-height: 0; opacity: 0; overflow: hidden; }
#mobile-menu.open { max-height: 400px; opacity: 1; }`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function(){
        mobileMenu.classList.toggle('open');
        var icon = mobileMenu.classList.contains('open') ? 'x' : 'menu';
        menuBtn.innerHTML = '';
        var i = document.createElement('i');
        i.setAttribute('data-lucide', icon);
        menuBtn.appendChild(i);
        lucide.createIcons();
      });
      mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mobileMenu.classList.remove('open'); }); });
    }
    return;
  }
  setTimeout(init, 50);
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@500;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="scroll-smooth bg-clay-bg text-clay-text font-sans antialiased overflow-x-hidden selection:bg-clay-pink selection:text-white">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-10 w-24 h-24 bg-clay-pink rounded-full shadow-clay-float opacity-90 animate-float hidden md:block"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-clay-blue rounded-full shadow-clay-float opacity-80 animate-float-delayed hidden md:block"></div>
          <div className="absolute top-40 right-10 w-32 h-32 bg-clay-green rounded-full shadow-clay-float opacity-90 animate-float hidden md:block"></div>
        </div>

        <nav className="fixed top-0 left-0 w-full z-50 pt-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-clay-card px-6 py-3 flex justify-between items-center relative">
              <a href="#" className="flex items-center gap-3 squish group">
                <div className="w-10 h-10 bg-clay-pink rounded-xl shadow-clay-btn flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                  <i data-lucide="gamepad-2"></i>
                </div>
                <span className="font-display font-bold text-2xl text-clay-text tracking-tight">PlayLearn</span>
              </a>
              <div className="hidden md:flex gap-8 font-bold text-clay-sub items-center">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} className="hover:text-clay-pink hover:scale-105 transition-all">{l.label}</a>
                ))}
              </div>
              <div className="hidden md:flex gap-4">
                <button className="font-bold text-clay-text hover:text-clay-pink transition-colors">Log In</button>
                <button className="bg-clay-green text-white font-bold px-6 py-2.5 rounded-2xl shadow-clay-btn squish hover:brightness-105">Get Started</button>
              </div>
              <button id="menu-btn" className="md:hidden p-2 rounded-xl bg-white shadow-clay-btn text-clay-sub squish">
                <i data-lucide="menu"></i>
              </button>
            </div>
            <div id="mobile-menu" className="mt-4 bg-white/90 backdrop-blur-md rounded-3xl shadow-clay-card md:hidden">
              <div className="flex flex-col p-6 gap-4 font-bold text-center text-clay-sub">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} className="hover:text-clay-pink py-2">{l.label}</a>
                ))}
                <div className="w-full h-px bg-slate-100 my-2"></div>
                <button className="text-clay-text py-2">Log In</button>
                <button className="bg-clay-green text-white w-full py-3 rounded-2xl shadow-clay-btn squish">Get Started Free</button>
              </div>
            </div>
          </div>
        </nav>

        <section className="relative z-10 pt-32 pb-20 px-4 min-h-screen flex items-center">
          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-clay-btn mb-6 animate-[bounce_3s_infinite]">
                <span className="w-2 h-2 rounded-full bg-clay-green"></span>
                <span className="text-sm font-bold text-clay-sub">Voted #1 App for Kids 2025</span>
              </div>
              <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.1] mb-6 text-clay-text">
                Unlock your child's <br />
                <span className="text-clay-pink inline-block relative">
                  Superpower
                  <svg className="absolute w-full h-4 -bottom-1 left-0 text-clay-green opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-clay-sub mb-10 font-semibold leading-relaxed max-w-lg mx-auto md:mx-0">
                Safe, ad-free, and designed by educators. PlayLearn combines education with gamification to keep kids engaged.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-clay-pink text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-clay-btn squish hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  <i data-lucide="rocket"></i> Start Adventure
                </button>
                <button className="bg-white text-clay-sub text-lg font-bold px-8 py-4 rounded-2xl shadow-clay-btn squish hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  <i data-lucide="play-circle"></i> Watch Video
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-400">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-pink-300 border-2 border-white"></div>
                </div>
                <p>Trusted by 50,000+ Parents</p>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center relative">
              <div className="relative w-80 h-96 md:w-96 md:h-[30rem] bg-white rounded-[3rem] shadow-clay-card flex flex-col items-center justify-center p-8 z-20 animate-float">
                <div className="w-32 h-32 bg-clay-green rounded-full shadow-clay-btn flex items-center justify-center mb-6 text-white">
                  <i data-lucide="trophy" style={{ width: 48, height: 48 }}></i>
                </div>
                <h3 className="font-display font-bold text-2xl text-clay-text mb-2">Level Complete!</h3>
                <div className="flex gap-2 mb-6">
                  <i data-lucide="star" className="text-yellow-400 fill-yellow-400"></i>
                  <i data-lucide="star" className="text-yellow-400 fill-yellow-400"></i>
                  <i data-lucide="star" className="text-yellow-400 fill-yellow-400"></i>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-clay-pink w-3/4 h-full rounded-full"></div>
                </div>
                <p className="mt-2 font-bold text-clay-sub text-sm">Experience +250</p>
                <div className="absolute -right-8 top-20 bg-clay-blue text-white p-4 rounded-2xl shadow-clay-btn animate-wiggle">
                  <i data-lucide="check-circle"></i>
                </div>
              </div>
              <div className="absolute top-10 right-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>
          </div>
        </section>

        <section id="features" className="relative z-10 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-clay-pink font-extrabold uppercase tracking-widest text-sm mb-2 block">Our Features</span>
              <h2 className="font-display font-bold text-4xl text-clay-text mb-4">Why Kids Love PlayLearn</h2>
              <p className="text-clay-sub font-medium text-lg">We turn complex subjects into bite-sized, gamified lessons that feel like play, not homework.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map(f => (
                <div key={f.title} className={`bg-white rounded-[2.5rem] p-8 shadow-clay-card group hover:-translate-y-2 transition-transform duration-300 border-2 border-transparent ${f.border}`}>
                  <div className={`w-16 h-16 ${f.bg} rounded-2xl shadow-clay-btn flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <i data-lucide={f.icon}></i>
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3 text-clay-text">{f.title}</h3>
                  <p className="text-clay-sub leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative z-10 py-20 px-4">
          <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-sm rounded-[3rem] p-8 md:p-16 shadow-clay-card">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-clay-text">Start learning in 3 steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-2 bg-slate-200 rounded-full -z-10"></div>
              {steps.map(s => (
                <div key={s.n} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white rounded-full shadow-clay-btn flex items-center justify-center mb-6 relative z-10">
                    <span className={`font-display font-bold text-4xl ${s.color}`}>{s.n}</span>
                  </div>
                  <h4 className="font-bold text-xl text-clay-text mb-2">{s.title}</h4>
                  <p className="text-clay-sub text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Adventure Worlds — image strip */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="text-clay-blue font-extrabold uppercase tracking-widest text-sm mb-2 block">Adventure Worlds</span>
              <h2 className="font-display font-bold text-4xl text-clay-text mb-4">Five magical worlds inside</h2>
              <p className="text-clay-sub font-medium text-lg">Each world is its own little universe — handcrafted lessons, characters, and rewards.</p>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-5 gap-5 md:gap-8">
              {worlds.map(w => (
                <li key={w.title} className={`${w.bg} rounded-[2rem] aspect-square shadow-clay-card p-5 flex flex-col items-center justify-center text-white text-center group hover:-translate-y-2 transition-transform`}>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full shadow-clay-btn flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
                    <i data-lucide={w.icon} className="w-8 h-8 md:w-10 md:h-10"></i>
                  </div>
                  <p className="font-display font-bold text-lg md:text-xl leading-tight">{w.title}</p>
                  <p className="text-xs font-bold opacity-80 mt-1">{w.meta}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-24 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center text-clay-text mb-16">Happy Parents say...</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map(r => (
                <div key={r.name} className={`bg-white p-8 rounded-[2rem] shadow-clay-card flex-col justify-between ${r.hidden || "flex"}`}>
                  <div className="mb-6">
                    <div className="flex text-yellow-400 mb-4">
                      {[0, 1, 2, 3, 4].map(i => <i key={i} data-lucide="star" className="fill-current w-5 h-5"></i>)}
                    </div>
                    <p className="text-clay-sub italic">"{r.quote}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${r.bg} shadow-clay-btn flex items-center justify-center text-white font-bold`}>{r.initials}</div>
                    <div>
                      <p className="font-bold text-clay-text">{r.name}</p>
                      <p className="text-xs text-clay-sub">{r.meta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three Pillars — full-bleed gradient */}
        <section className="relative z-10 w-full py-24 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #60A5FA 100%)" }}>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 right-20 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-32 right-12 w-24 h-24 bg-yellow-300/60 rounded-full shadow-clay-float animate-float hidden md:block pointer-events-none" />
          <div className="absolute bottom-24 left-16 w-16 h-16 bg-clay-green rounded-full shadow-clay-float animate-float-delayed hidden md:block pointer-events-none" />
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="bg-white/30 text-white font-extrabold uppercase tracking-widest text-sm mb-4 inline-block px-4 py-1.5 rounded-full shadow-clay-btn backdrop-blur-sm">Our Approach</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">Three pillars. Zero homework.</h2>
              <p className="text-white/90 font-semibold text-lg md:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]">Every lesson is shaped around what makes children naturally hungry to learn.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map(p => (
                <article key={p.title} className={`bg-white rounded-[2.5rem] p-8 shadow-clay-float relative overflow-hidden ${p.shift}`}>
                  <div className={`absolute ${p.glowPos} w-24 h-24 ${p.glow} rounded-full opacity-60 blur-xl`} />
                  <div className="relative">
                    <div className={`w-16 h-16 ${p.bg} rounded-2xl shadow-clay-btn flex items-center justify-center text-white mb-6`}>
                      <i data-lucide={p.icon} className="w-7 h-7"></i>
                    </div>
                    <p className={`font-display font-bold text-4xl ${p.numColor} mb-1`}>{p.num}</p>
                    <h3 className="font-display font-bold text-2xl mb-3 text-clay-text">{p.title}</h3>
                    <p className="text-clay-sub leading-relaxed mb-4">{p.body}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className={`w-10 h-10 ${p.chip} rounded-xl shadow-clay-btn flex items-center justify-center font-bold ${p.chipText}`}>{p.chipNum}</div>
                      <p className="text-xs font-bold text-clay-sub">{p.chipBody}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Designed by Educators */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="text-clay-green font-extrabold uppercase tracking-widest text-sm mb-2 block">The Team</span>
              <h2 className="font-display font-bold text-4xl text-clay-text mb-4">Designed by real educators</h2>
              <p className="text-clay-sub font-medium text-lg">Every lesson, level, and reward is built by teachers who have spent years in actual classrooms.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {educators.map(e => (
                <article key={e.name} className="bg-white rounded-[2rem] p-6 shadow-clay-card flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
                  <div className={`w-20 h-20 ${e.bg} rounded-full shadow-clay-btn flex items-center justify-center text-white font-display font-bold text-2xl mb-4`}>{e.initials}</div>
                  <h3 className="font-display font-bold text-xl text-clay-text mb-1">{e.name}</h3>
                  <p className={`text-xs font-bold ${e.roleColor} uppercase tracking-widest mb-3`}>{e.role}</p>
                  {e.rich
                    ? <p className="text-clay-sub text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: e.bio }} />
                    : <p className="text-clay-sub text-sm leading-relaxed mb-4">{e.bio}</p>}
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {e.tags.map(t => (
                      <span key={t} className={`${e.chipBg} ${e.chipText} text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-clay-btn`}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-clay-text mb-4">Simple Pricing</h2>
              <p className="text-clay-sub font-medium">Cancel anytime. No hidden fees.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-clay-card relative">
                <h3 className="font-display font-bold text-2xl text-clay-text mb-2">Explorer</h3>
                <div className="text-4xl font-extrabold text-clay-sub mb-6">$0<span className="text-lg font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-clay-sub font-medium">
                  <li className="flex items-center gap-3"><i data-lucide="check" className="text-clay-green w-5 h-5"></i> 3 Daily Lessons</li>
                  <li className="flex items-center gap-3"><i data-lucide="check" className="text-clay-green w-5 h-5"></i> Basic Puzzles</li>
                  <li className="flex items-center gap-3 opacity-50"><i data-lucide="x" className="w-5 h-5"></i> Offline Mode</li>
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-slate-100 text-clay-sub font-bold hover:bg-slate-50 transition-colors">Start Free</button>
              </div>
              <div className="bg-clay-text rounded-[2.5rem] p-8 shadow-clay-float relative transform md:-translate-y-4">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-clay-pink text-white text-xs font-bold px-4 py-2 rounded-full shadow-clay-btn">MOST POPULAR</div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">Genius</h3>
                <div className="text-4xl font-extrabold text-white mb-6">$9<span className="text-lg font-normal text-slate-400">/mo</span></div>
                <ul className="space-y-4 mb-8 text-slate-300 font-medium">
                  {proFeatures.map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="bg-clay-green rounded-full p-1"><i data-lucide="check" className="text-white w-3 h-3"></i></div> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl bg-clay-green text-white font-bold shadow-clay-btn squish hover:brightness-110">Get 7 Days Free</button>
                <p className="text-center text-xs text-slate-400 mt-4">Then $9/mo. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 max-w-3xl mx-auto relative z-10">
          <h2 className="font-display font-bold text-3xl text-center text-clay-text mb-10">Questions?</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <details key={f.q} className="bg-white rounded-2xl shadow-clay-btn p-4 group cursor-pointer">
                <summary className="font-bold text-clay-text flex justify-between items-center list-none">
                  {f.q}
                  <i data-lucide="chevron-down" className="transition-transform group-open:rotate-180"></i>
                </summary>
                <p className="text-clay-sub mt-4 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* As Featured In — clay press shelf */}
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-clay-card p-8 md:p-12">
            <div className="text-center mb-10">
              <span className="text-clay-purple font-extrabold uppercase tracking-widest text-sm mb-2 block">Recognised</span>
              <h2 className="font-display font-bold text-3xl text-clay-text">As featured in</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-10">
              {awards.map(a => (
                <div key={`${a.title}-${a.title2}`} className="bg-clay-bg rounded-2xl shadow-clay-inset p-4 flex flex-col items-center justify-center text-center aspect-square hover:shadow-clay-btn transition-shadow">
                  <i data-lucide={a.icon} className={`w-8 h-8 ${a.color} mb-2`}></i>
                  <p className="font-display font-bold text-clay-text text-sm leading-tight">{a.title}<br />{a.title2}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-6 border-t border-slate-100 font-bold text-clay-sub text-sm uppercase tracking-widest">
              {pressShelf.map((p, i) => (
                <span key={p} className="flex items-center gap-x-8">
                  <span>{p}</span>
                  {i < pressShelf.length - 1 && <span className="text-slate-300">·</span>}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 py-16 px-4">
          <div className="max-w-5xl mx-auto bg-clay-card rounded-[3rem] shadow-clay-float overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-clay-green rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-clay-pink rounded-full opacity-20 blur-3xl"></div>
            <div className="relative z-10 p-10 md:p-20 text-center">
              <h2 className="font-display font-bold text-3xl md:text-5xl text-clay-text mb-8">Ready to start the adventure?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-clay-text text-white px-8 py-3 rounded-2xl shadow-clay-btn squish flex items-center gap-3 w-48 justify-center hover:bg-slate-800 transition-colors">
                  <i data-lucide="apple" className="fill-current"></i>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase opacity-70">Download on the</span>
                    <span className="font-bold text-sm">App Store</span>
                  </div>
                </button>
                <button className="bg-clay-text text-white px-8 py-3 rounded-2xl shadow-clay-btn squish flex items-center gap-3 w-48 justify-center hover:bg-slate-800 transition-colors">
                  <i data-lucide="play" className="fill-current"></i>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase opacity-70">Get it on</span>
                    <span className="font-bold text-sm">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] mt-20 pt-16 pb-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-clay-pink rounded-lg shadow-clay-btn flex items-center justify-center text-white">
                    <i data-lucide="gamepad-2"></i>
                  </div>
                  <span className="font-display font-bold text-xl text-clay-text">PlayLearn</span>
                </div>
                <p className="text-clay-sub text-sm mb-6">Making education magical for the next generation.</p>
                <div className="flex gap-3">
                  {socials.map(s => (
                    <a key={s} href="#" className="w-10 h-10 rounded-full bg-clay-bg text-clay-sub flex items-center justify-center shadow-clay-btn squish hover:text-clay-pink transition-colors">
                      <i data-lucide={s}></i>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-clay-text mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-clay-sub font-medium">
                  {productLinks.map(l => <li key={l}><a href="#" className="hover:text-clay-pink transition-colors">{l}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-clay-text mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-clay-sub font-medium">
                  {companyLinks.map(l => <li key={l}><a href="#" className="hover:text-clay-pink transition-colors">{l}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-clay-text mb-4">Stay Updated</h4>
                <form className="flex flex-col gap-3">
                  <input type="email" placeholder="Parent's Email" className="w-full px-4 py-3 rounded-xl bg-slate-50 shadow-clay-inset outline-none text-clay-text text-sm focus:ring-2 focus:ring-clay-pink/50 transition-all" />
                  <button className="w-full bg-clay-pink text-white font-bold py-2 rounded-xl shadow-clay-btn squish hover:brightness-105">Subscribe</button>
                </form>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
              <p>&copy; 2024 PlayLearn Inc.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-clay-pink">Privacy Policy</a>
                <a href="#" className="hover:text-clay-pink">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
