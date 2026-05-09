const SESSION_ROWS = [
  {
    id: "014",
    code: "NEON_DRIFT",
    badge: "CASE 014 · MOOG · ANALOG · 0:42:11",
    headline: "A Moog And A Drum Machine Walked Into A Booth",
    body: "Six nights tracking a single bassline. We started on the Grandmother — square wave, slight glide, just enough resonance to bite. Routed through a 1176 set to all-buttons-in for the chorus only, summed back to a quarter-inch tape loop running at 7.5 ips. Drum machine was the LinnDrum hard-clocked off the same MIDI sync, with the tom outputs split to a stereo pair of 1073 preamps. By the third night the patchbay looked like a chandelier; by the sixth, we had two minutes of bedrock for the entire record.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    alt: "Modular synth circuit",
    border: "border-neonPink/40",
    badgeColor: "text-neonCyan",
    headlineGlow: "glow-text-pink",
    overlay: "bg-gradient-to-tr from-neonPink/30 via-transparent to-neonCyan/25",
    badgePos: "top-4 left-4",
    reverse: false,
  },
  {
    id: "013",
    code: "CHROMA",
    badge: "CASE 013 · SSL · MIX · 1:18:42",
    headline: "Stripping A Mix Until Only The Bones Glow",
    body: "Client walked in with a finished record and a feeling something was off. We muted everything but the kick and the lead pad and listened for ninety seconds with the lights out. Then we put the rest back, channel by channel, and asked at each step whether the song was better with that element or without. Twelve tracks went to mute. Three got rewritten. The chorus pad got pushed forward six dB and the snare lost its second reverb. Final master sits at minus eleven LUFS integrated, peaks at minus one true, ready for vinyl cut.",
    img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?q=80&w=1200&auto=format&fit=crop",
    alt: "Industrial machinery",
    border: "border-neonCyan/40",
    badgeColor: "text-retroYellow",
    headlineGlow: "glow-text-cyan",
    overlay: "bg-gradient-to-bl from-neonCyan/30 via-transparent to-neonPurple/25",
    badgePos: "top-4 right-4",
    reverse: true,
  },
  {
    id: "012",
    code: "SUNSET_PROTOCOL",
    badge: "CASE 012 · DX7 · FM · 0:54:08",
    headline: "Eight Bars Of FM Bell That Took Eight Days",
    body: "Programming an original DX7 patch is its own discipline. Six operators, four algorithms tested before settling on number five, fine-tune coarse-tune ratios calculated on graph paper because the LCD will not show you the harmonic stack the way an oscilloscope will. We tracked direct out, then routed back through a Lexicon 224 on Hall plate at four-second decay, mixed against a dry copy at minus nine, automated to swell on the second half of every other bar. The bell sits in the centre of the record like a chrome lighthouse.",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    alt: "Synth rack with status indicator LEDs",
    border: "border-retroYellow/40",
    badgeColor: "text-neonPink",
    headlineGlow: "glow-text-pink",
    overlay: "bg-gradient-to-tr from-retroOrange/35 via-transparent to-neonPink/25",
    badgePos: "top-4 left-4",
    reverse: false,
  },
];

const CONSOLE_STEPS = [
  {
    n: "01",
    title: "Tracking · Live Room Takes",
    border: "border-neonCyan",
    accent: "text-neonCyan",
    body: "We treat tracking as the most expensive decision on the record. The drum kit gets nine microphones — close on every drum, two stereo overheads at three feet six, two room mics at the back wall through a Coles ribbon stereo pair. Vocalists work into a U47 reissue at chest height with a pop screen we built from a coat hanger and stocking. Synths go direct, no DI box — straight Eurorack-level into a 1073 and pushed eight dB to bring the noise floor up to tape-warm. Performances are tracked to a one-millisecond clock grid running on UAD Apollo at 96 kilohertz.",
  },
  {
    n: "02",
    title: "Editing · Time-Aligned To 1ms Grid",
    border: "border-neonPink",
    accent: "text-neonPink",
    body: "Editing is where the real production happens. We slip-edit drum performances by ear in the first pass, then check transients against the grid in the second. Swing is preserved — we are not flattening anyone's playing into robot-grid rigidity. Vocal comps are built across four to six takes, crossfaded on consonants where the breath cuts cleanly. Synth arpeggios get retimed against the kick on every downbeat, then consciously offset by two milliseconds early on the chorus to drive the energy. Every fader move is an editorial decision logged to the session notes.",
  },
  {
    n: "03",
    title: "Mixing · Summed To Two-Track",
    border: "border-retroYellow",
    accent: "text-retroYellow",
    body: "Mixing happens on the SSL Fusion summing chassis with eight stereo busses fed back from the Apollo. Drums on bus one with a 1176 across the stereo pair, bass and synth bass on bus two through an LA-2A in compress mode, lead synths on bus three with the Lexicon 224 plate at two-point-eight seconds, vocals on bus four with the Roland RE-201 Space Echo set to three repeats and a quarter-note delay. The whole mix sums back through a Neve master fader and lands in Pro Tools at minus six dBFS, ready for mastering.",
  },
  {
    n: "04",
    title: "Mastering · Vinyl Cut Targets",
    border: "border-neonPurple",
    accent: "text-neonPurple",
    body: "Mastering for vinyl is a different craft to mastering for streaming. We deliver two masters from every session: a streaming master at minus eleven LUFS integrated with a peak ceiling of minus one true, and a vinyl pre-master with a flatter dynamic range — typically minus thirteen LUFS — and the sub frequencies summed to mono below 120 hertz so the cutting lathe does not skip the groove. Sibilance gets de-essed with a multiband, never a single-band, so the upper-mids stay open. Final QC is done on Yamaha NS-10s at sixty-five dB SPL.",
  },
];

const CATALOG_CARDS = [
  { code: "MN-014", name: "NEON DRIFT", side: "A1", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=600&auto=format&fit=crop", overlay: "from-neonPink/35 to-neonCyan/30" },
  { code: "MN-013", name: "CHROMA", side: "A2", img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=600&auto=format&fit=crop", overlay: "from-neonCyan/35 to-neonPurple/30" },
  { code: "MN-012", name: "SUNSET PROTOCOL", side: "A3", img: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?q=80&w=600&auto=format&fit=crop", overlay: "from-retroOrange/35 to-neonPink/30" },
  { code: "MN-011", name: "TAPE HISS", side: "A4", img: "https://images.unsplash.com/photo-1700951372714-98979a8803a4?q=80&w=600&auto=format&fit=crop", overlay: "from-neonPink/35 to-retroYellow/30" },
  { code: "MN-010", name: "GLASS HIGHWAY", side: "B1", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop", overlay: "from-neonCyan/35 to-neonPink/30" },
  { code: "MN-009", name: "VAPOUR BEACH", side: "B2", img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?q=80&w=600&auto=format&fit=crop", overlay: "from-neonPurple/40 to-retroOrange/25" },
  { code: "MN-008", name: "SUBWAY LIGHTS", side: "B3", img: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?q=80&w=600&auto=format&fit=crop", overlay: "from-retroYellow/35 to-neonPink/30" },
  { code: "MN-007", name: "SERVER SUNRISE", side: "B4", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop", overlay: "from-neonCyan/40 to-neonPurple/25" },
];

const FAQ_ITEMS = [
  { n: "01", q: "Do you take outside artists?", a: "Yes — about half of every year is booked for outside artists, with the other half held for in-house projects. We take submissions through a short brief form on the booking page; turnaround on a yes-or-no is forty-eight hours. We do not require label backing, and we work with first-record artists as readily as with veterans, though we always ask for at least a rough demo so we can hear the song before committing studio time." },
  { n: "02", q: "What hardware is on the floor?", a: "Synths: Juno-106, DX7, Polysix, Moog Grandmother, plus a modular Eurorack rig built around Mutable Instruments and Make Noise modules. Drums: original LinnDrum LM-2, TR-707, Oberheim DMX, Simmons SDS-V kit. Outboard: SSL Fusion, four Neve 1073 preamps, two 1176 compressors, an LA-2A, Lexicon 224 reverb, Roland RE-201 Space Echo. Tape: Studer A800 quarter-inch and a Tascam 388 half-inch. The full inventory updates monthly on the studio gear page." },
  { n: "03", q: "Can I book a single session?", a: "Single-day sessions are available on Tuesdays and Fridays only — eight hours including a one-hour break, with the engineer included. Most projects need at least three days to track and rough-mix anything that will pass our own listening test, but a single day works well for vocal overdubs onto an existing mix, for synth-programming sessions on the modular rig, or for transferring tape masters to digital. Block bookings of three days or more get a fifteen percent discount and priority calendar slots." },
  { n: "04", q: "Do you offer mastering only?", a: "Yes. Mastering-only is a flat per-track fee with two revisions included, and we deliver three formats by default — streaming master at minus eleven LUFS, vinyl pre-master with sub-mono below 120 hertz, and a CD-ready master at sixteen-bit forty-four-point-one kilohertz. Turnaround is five working days from receipt of the mix. We accept mixes at twenty-four bit forty-eight kilohertz or higher; please leave at least three dB of headroom on the master bus and label any tracks that should be sequenced together." },
  { n: "05", q: "Is there a house style?", a: "There is a sound — wide stereo synths, gated reverb on the snare, FM bell layers in the upper-mids, a low end weighted to the kick rather than the bass — and we lean into it when the song calls for it, but we do not impose it. Punk records leave the studio sounding like punk records. Folk records keep their air. The house style is process discipline, not a single sonic stamp; the records that come out of here vary by genre but share a sense of intentional space." },
  { n: "06", q: "Tape transfers — yes or no?", a: "Yes — the Studer A800 handles quarter-inch at fifteen and thirty inches per second; the Tascam 388 handles half-inch eight-track at fifteen ips. We bake tapes that need it, transfer at twenty-four bit ninety-six kilohertz with full alignment tones if present, and clean up the deliverable with conservative click and hum removal. Reels arrive in their original boxes and leave in their original boxes; nothing is destroyed in the process. Quoted per minute of tape, with a discount for batch jobs." },
  { n: "07", q: "Where can I hear examples?", a: "The catalog grid above carries the eight 2024 releases; full streams live on Bandcamp and on the major DSPs. Each release page links the personnel — producer, engineer, mastering engineer, players — so you can trace a sound back to a specific session. We also keep a public reference playlist of about forty tracks we have worked on going back to 2021, sequenced for listening rather than chronology, that we send to prospective clients on request." },
  { n: "08", q: "Do you sync-license?", a: "Most catalog tracks are available for sync at a one-stop rate — masters and publishing administered together, no separate clearance trail. Trailer placements, advertising, video games, and television are all on the standard rate card; theatrical and major-brand campaigns are quoted bespoke. We do not exclusively license to any single library, so a track placed once remains available for other projects unless the brief specifically asks for category exclusivity." },
];

export default function T54Synthwave() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Press+Start+2P&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                neonPink: '#FF00FF',
                neonCyan: '#00FFFF',
                neonPurple: '#BC13FE',
                deepBg: '#050011',
                retroYellow: '#FFD319',
                retroOrange: '#FF901F',
                gridLine: 'rgba(255, 0, 255, 0.3)',
              },
              fontFamily: {
                'display': ['"Audiowide"', 'cursive'],
                'pixel': ['"Press Start 2P"', 'cursive'],
                'body': ['"Rajdhani"', 'sans-serif'],
              },
              backgroundImage: { 'chrome': 'linear-gradient(to bottom, #eee 0%, #ccc 40%, #FF00FF 50%, #00FFFF 100%)' },
              animation: {
                'spin-slow': 'spin 8s linear infinite',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #050011; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #050011; }
        ::-webkit-scrollbar-thumb { background: #333; border: 1px solid #FF00FF; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: #FF00FF; }
        .crt-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 6px 100%;
          pointer-events: none; z-index: 9999;
        }
        .grid-container {
          position: absolute; bottom: -10vh; left: -50%; width: 200%; height: 60vh;
          overflow: hidden; perspective: 300px; z-index: 0; pointer-events: none;
        }
        .grid-floor {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: linear-gradient(rgba(255,0,255,0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(255,0,255,0.3) 2px, transparent 2px);
          background-size: 60px 60px;
          transform: rotateX(60deg);
          animation: moveGrid 3s linear infinite;
          box-shadow: 0 0 150px rgba(255, 0, 255, 0.5);
        }
        .grid-mask { position: absolute; inset: 0; background: linear-gradient(to bottom, #050011 0%, transparent 40%, #050011 100%); z-index: 1; }
        @keyframes moveGrid { 0% { background-position: 0 0; } 100% { background-position: 0 60px; } }
        .retro-sun {
          width: min(80vw, 400px); height: min(80vw, 400px);
          background: linear-gradient(to bottom, #FFD319 0%, #FF901F 40%, #FF00FF 100%);
          border-radius: 50%; position: absolute; left: 50%; bottom: 15%;
          transform: translateX(-50%); z-index: 1;
          box-shadow: 0 0 100px rgba(255, 0, 255, 0.4);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 40%, transparent 40%, transparent 42%, black 42%, black 50%, transparent 50%, transparent 53%, black 53%, black 60%, transparent 60%, transparent 64%, black 64%, black 70%, transparent 70%, transparent 75%, black 75%, black 80%, transparent 80%, transparent 86%, black 86%, black 95%);
        }
        .text-chrome {
          background: linear-gradient(to bottom, #ffffff 0%, #dcdcdc 48%, #FF00FF 50%, #7d0089 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.4);
          filter: drop-shadow(0 0 5px rgba(255,0,255,0.6));
        }
        .glow-text-cyan { text-shadow: 0 0 5px #00FFFF, 0 0 15px #00FFFF; }
        .glow-text-pink { text-shadow: 0 0 5px #FF00FF, 0 0 15px #FF00FF; }
        .glow-border-pink { box-shadow: 0 0 10px #FF00FF, inset 0 0 5px #FF00FF; }
        .glow-border-cyan { box-shadow: 0 0 10px #00FFFF, inset 0 0 5px #00FFFF; }
        .tape-card { transition: all 0.3s ease; }
        .tape-card:hover { transform: translateY(-5px); border-color: #00FFFF; box-shadow: 0 0 25px rgba(0, 255, 255, 0.3); }
        .tape-spool { animation: spinTape 4s linear infinite paused; }
        .tape-card:hover .tape-spool { animation-play-state: running; }
        @keyframes spinTape { to { transform: rotate(360deg); } }
        .reveal { opacity: 1; transform: translateY(0); }

        .mn-faq summary::-webkit-details-marker { display: none; }
        .mn-faq summary { list-style: none; cursor: pointer; }
        .mn-faq .mn-plus { transition: transform 250ms ease, color 250ms ease; }
        .mn-faq[open] .mn-plus { transform: rotate(45deg); color: #FF00FF; }
        .mn-faq[open] summary { color: #00FFFF; }
        .mn-faq summary:hover { color: #FF00FF; }

        .mn-catalog-card {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: inset 0 0 12px rgba(0, 255, 255, 0.08), 0 0 16px rgba(255, 0, 255, 0.12);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .mn-catalog-card:hover {
          border-color: #FF00FF;
          box-shadow: inset 0 0 18px rgba(255, 0, 255, 0.18), 0 0 24px rgba(0, 255, 255, 0.35);
        }

        .mn-console-photo {
          box-shadow: 0 0 60px rgba(255, 0, 255, 0.4), inset 0 0 40px rgba(0, 255, 255, 0.18);
        }

        .mn-meta-pill {
          display: inline-block;
          padding: 3px 8px;
          font-family: "Press Start 2P", cursive;
          font-size: 9px;
          color: #00FFFF;
          border: 1px solid rgba(0, 255, 255, 0.5);
          background: rgba(0, 0, 0, 0.6);
          letter-spacing: 0.1em;
        }

        @media (prefers-reduced-motion: reduce) {
          .mn-faq .mn-plus { transition: none; }
          .mn-catalog-card { transition: none; }
        }
      ` }} />

      <div className="text-gray-200">
        <div className="crt-overlay"></div>

        <nav className="fixed top-0 w-full z-50 bg-[#050011]/80 backdrop-blur-md border-b border-neonPink/50 shadow-[0_0_15px_rgba(255,0,255,0.3)]">
          <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative">
                <i data-lucide="disc-3" className="w-8 h-8 text-neonCyan animate-spin-slow group-hover:text-white transition-colors"></i>
                <div className="absolute inset-0 bg-neonCyan blur-md opacity-40 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl leading-none text-white tracking-widest group-hover:glow-text-cyan transition-all">MIAMI</span>
                <span className="font-pixel text-[10px] text-neonPink tracking-[0.2em] leading-none">NIGHTS</span>
              </div>
            </a>
            <div className="hidden md:flex gap-8 font-display tracking-widest text-sm items-center">
              <a href="#featured" className="hover:text-neonCyan transition-all hover:drop-shadow-[0_0_5px_#00FFFF]">LATEST</a>
              <a href="#services" className="hover:text-neonCyan transition-all hover:drop-shadow-[0_0_5px_#00FFFF]">STUDIO</a>
              <a href="#works" className="hover:text-neonCyan transition-all hover:drop-shadow-[0_0_5px_#00FFFF]">TAPES</a>
              <a href="#contact" className="px-6 py-2 border border-neonPink text-neonPink hover:bg-neonPink hover:text-white transition-all hover:shadow-[0_0_15px_#FF00FF] rounded-sm skew-x-[-10deg]">
                <span className="skew-x-[10deg] inline-block">CONTACT</span>
              </a>
            </div>
            <button className="md:hidden text-white hover:text-neonPink transition-colors">
              <i data-lucide="menu" className="w-8 h-8"></i>
            </button>
          </div>
        </nav>

        <header className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
          <div className="retro-sun"></div>
          <div className="grid-container">
            <div className="grid-mask"></div>
            <div className="grid-floor"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-[-50px]">
            <div className="inline-block border border-neonCyan/30 bg-black/40 backdrop-blur px-4 py-1 mb-6 rounded-full">
              <p className="font-pixel text-[10px] md:text-xs text-neonCyan animate-pulse tracking-widest">
                <span className="w-2 h-2 inline-block bg-neonCyan rounded-full mr-2"></span> SYSTEM ONLINE
              </p>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-tight tracking-tighter mb-4 text-chrome uppercase">
              Retro Future
              <br />
              Audio
            </h1>
            <p className="font-body text-lg md:text-2xl text-purple-200 tracking-wide max-w-2xl mx-auto mb-10 drop-shadow-md">
              Premier Synthwave Production House. <br />
              <span className="text-neonPink">Analog Hardware. Digital Precision.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#works" className="w-full sm:w-auto px-8 py-4 font-display font-bold text-black bg-neonCyan hover:bg-white transition-all duration-200 shadow-[0_0_20px_rgba(0,255,255,0.5)] skew-x-[-10deg] flex items-center justify-center gap-2 group">
                <span className="skew-x-[10deg] flex items-center gap-2">
                  LISTEN NOW <i data-lucide="headphones" className="w-5 h-5 group-hover:rotate-12 transition-transform"></i>
                </span>
              </a>
              <a href="#contact" className="w-full sm:w-auto px-8 py-4 font-display font-bold text-white border-2 border-neonPink hover:bg-neonPink/20 transition-all duration-200 skew-x-[-10deg] flex items-center justify-center">
                <span className="skew-x-[10deg]">START PROJECT</span>
              </a>
            </div>
          </div>
        </header>

        <section id="featured" className="py-20 relative border-t border-gray-800 bg-[#080214]">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex items-center gap-4 mb-12 reveal">
              <div className="h-px bg-neonCyan flex-1 opacity-50"></div>
              <h2 className="font-display text-2xl md:text-4xl text-white glow-text-cyan">LATEST DROP</h2>
              <div className="h-px bg-neonCyan flex-1 opacity-50"></div>
            </div>
            <div className="bg-gray-900/50 border border-neonCyan/30 p-1 md:p-2 rounded-lg max-w-5xl mx-auto shadow-[0_0_30px_rgba(0,255,255,0.1)] reveal">
              <div className="bg-black border border-gray-800 rounded grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className="relative group h-64 md:h-auto min-h-[300px]">
                  <img src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 mix-blend-hard-light" alt="Featured Album" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-display text-3xl text-white mb-1">CYBER_CITY_RUN</h3>
                    <p className="font-body text-neonPink text-lg tracking-widest uppercase">Available Now</p>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between relative bg-[#0a0a0a]">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-6 border-b border-gray-700 pb-2">
                      <span className="font-pixel text-[10px] text-neonCyan">WINAMP_PLAYLIST.EXE</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                    <ul className="space-y-4 font-body text-gray-400">
                      <li className="flex justify-between items-center group cursor-pointer hover:text-white transition-colors">
                        <div className="flex items-center gap-3">
                          <i data-lucide="play" className="w-4 h-4 text-neonPink opacity-0 group-hover:opacity-100 transition-opacity"></i>
                          <span>01. Neon Highway</span>
                        </div>
                        <span className="font-mono text-xs text-gray-600">03:42</span>
                      </li>
                      <li className="flex justify-between items-center group cursor-pointer text-white">
                        <div className="flex items-center gap-3">
                          <i data-lucide="bar-chart-2" className="w-4 h-4 text-neonCyan animate-pulse"></i>
                          <span className="text-neonCyan glow-text-cyan">02. Mainframe Hack</span>
                        </div>
                        <span className="font-mono text-xs text-neonCyan">04:15</span>
                      </li>
                      <li className="flex justify-between items-center group cursor-pointer hover:text-white transition-colors">
                        <div className="flex items-center gap-3">
                          <i data-lucide="play" className="w-4 h-4 text-neonPink opacity-0 group-hover:opacity-100 transition-opacity"></i>
                          <span>03. Sunset overdrive</span>
                        </div>
                        <span className="font-mono text-xs text-gray-600">03:10</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 relative z-10">
                    <button className="w-full bg-neonPink/10 border border-neonPink text-neonPink hover:bg-neonPink hover:text-black font-pixel text-xs py-3 transition-all">
                      STREAM FULL ALBUM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24 bg-deepBg relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-neonPurple rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-neonCyan rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="font-display text-4xl md:text-5xl mb-16 text-center text-white reveal">
              STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-retroYellow to-retroOrange">SERVICES</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md hover:border-neonCyan transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] group reveal">
                <i data-lucide="sliders" className="w-12 h-12 text-neonCyan mb-6 group-hover:scale-110 transition-transform"></i>
                <h3 className="font-display text-2xl mb-4 text-white">Mixing</h3>
                <p className="font-body text-gray-400 leading-relaxed">
                  Precision balancing for that signature 80s gated reverb sound. We make your drums punch and your synths wide.
                </p>
              </div>
              <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md hover:border-neonPink transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] group reveal">
                <i data-lucide="music-4" className="w-12 h-12 text-neonPink mb-6 group-hover:scale-110 transition-transform"></i>
                <h3 className="font-display text-2xl mb-4 text-white">Mastering</h3>
                <p className="font-body text-gray-400 leading-relaxed">
                  Loud, clear, and ready for vinyl or Spotify. Includes optional analog tape saturation for warmth.
                </p>
              </div>
              <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md hover:border-retroYellow transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,211,25,0.2)] group reveal">
                <i data-lucide="zap" className="w-12 h-12 text-retroYellow mb-6 group-hover:scale-110 transition-transform"></i>
                <h3 className="font-display text-2xl mb-4 text-white">Production</h3>
                <p className="font-body text-gray-400 leading-relaxed">
                  Need a melody? A bassline? Access our library of vintage synths including Juno-106 and DX7.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="gear" className="py-20 bg-black border-y border-gray-900">
          <div className="container mx-auto px-6">
            <h3 className="font-pixel text-xl text-center text-gray-500 mb-12 reveal">/// HARDWARE_INVENTORY</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center reveal">
              <div className="space-y-2">
                <h4 className="font-display text-neonPink text-lg">SYNTHS</h4>
                <ul className="font-body text-gray-400 space-y-1">
                  <li>Roland Juno-106</li>
                  <li>Yamaha DX7</li>
                  <li>Korg Polysix</li>
                  <li>Moog Grandmother</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-neonCyan text-lg">DRUMS</h4>
                <ul className="font-body text-gray-400 space-y-1">
                  <li>LinnDrum LM-2</li>
                  <li>Roland TR-707</li>
                  <li>Oberheim DMX</li>
                  <li>Simmons SDS-V</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-retroYellow text-lg">OUTBOARD</h4>
                <ul className="font-body text-gray-400 space-y-1">
                  <li>SSL Fusion</li>
                  <li>Neve 1073 Pre</li>
                  <li>1176 Compressor</li>
                  <li>Lexicon 224</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-purple-400 text-lg">DAW</h4>
                <ul className="font-body text-gray-400 space-y-1">
                  <li>Ableton Live 11</li>
                  <li>Pro Tools Carbon</li>
                  <li>UAD Plugins</li>
                  <li>Logic Pro X</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="works" className="relative py-24 bg-[#0a0514]">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-neonCyan to-transparent opacity-50"></div>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-4 mb-16 reveal">
              <i data-lucide="cassette-tape" className="w-8 h-8 text-neonPink glow-text-pink hidden sm:block"></i>
              <h2 className="font-display text-4xl md:text-5xl text-center text-white glow-text-cyan">
                RECENT <span className="text-neonPink">TAPES</span>
              </h2>
              <i data-lucide="cassette-tape" className="w-8 h-8 text-neonPink glow-text-pink hidden sm:block"></i>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { vol: "VOL. 1", border: "border-neonPink", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop", title: "Nightcall EP", artist: "The Midnight", genre: "SYNTHWAVE" },
                { vol: "VOL. 2", border: "border-retroYellow", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop", title: "Cyber Chase", artist: "LazerHawk", genre: "DARKSYNTH" },
                { vol: "VOL. 3", border: "border-purple-600", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop", title: "Sunset Run", artist: "FM-84", genre: "CHILLWAVE" },
              ].map((t, i) => (
                <div key={i} className="tape-card group p-3 bg-[#111] border-2 border-[#333] rounded-xl relative reveal">
                  <div className={`h-40 rounded-t mb-4 overflow-hidden relative border-b-4 ${t.border}`}>
                    <img src={t.img} className="w-full h-full object-cover mix-blend-hard-light filter contrast-125 hover:mix-blend-normal transition-all duration-300" alt="Tape" />
                    <div className="absolute top-2 right-2 bg-black px-2 py-1">
                      <span className="font-pixel text-[8px] text-white">{t.vol}</span>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3 flex justify-between items-center border border-gray-800 relative overflow-hidden">
                    <div className="tape-spool w-10 h-10 rounded-full border-4 border-white border-dashed opacity-50"></div>
                    <div className="bg-black border border-gray-700 px-3 py-1 rounded w-full mx-2 text-center">
                      <span className="font-display text-xs text-gray-400">{t.title}</span>
                    </div>
                    <div className="tape-spool w-10 h-10 rounded-full border-4 border-white border-dashed opacity-50"></div>
                  </div>
                  <div className="mt-4 px-1 flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-bold font-body text-xl">{t.artist}</h4>
                      <p className="text-neonPink text-xs font-pixel">{t.genre}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-neonCyan flex items-center justify-center text-neonCyan hover:bg-neonCyan hover:text-black transition-colors">
                      <i data-lucide="play" className="w-4 h-4 ml-1"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sessions" className="py-24 bg-deepBg relative overflow-hidden border-t border-neonPink/20">
          <div className="absolute top-1/3 left-0 w-[28rem] h-[28rem] bg-neonPink rounded-full blur-[160px] opacity-10 pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-0 w-[28rem] h-[28rem] bg-neonCyan rounded-full blur-[160px] opacity-10 pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 reveal">
              <span className="mn-meta-pill mb-5">/// SESSION_LOG</span>
              <h2 className="font-display text-4xl md:text-6xl mt-5 text-white">
                STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink via-retroOrange to-neonCyan">SESSIONS</span>
              </h2>
              <p className="font-body text-purple-200/80 text-lg max-w-2xl mx-auto mt-4">
                Three case files from the back room. Tape rolling, lights low, neon on the patchbay.
              </p>
            </div>
            {SESSION_ROWS.map((row, i) => (
              <div key={row.id} className={`grid grid-cols-1 md:grid-cols-12 gap-10 items-center reveal ${i < SESSION_ROWS.length - 1 ? "mb-24" : ""}`}>
                <div className={`md:col-span-7 relative group ${row.reverse ? "md:order-2" : ""}`}>
                  <div className={`relative h-72 md:h-96 overflow-hidden border-2 ${row.border} mn-console-photo`}>
                    <img src={row.img} alt={row.alt} className="w-full h-full object-cover mix-blend-screen contrast-125 saturate-150" />
                    <div className={`absolute inset-0 ${row.overlay} mix-blend-overlay pointer-events-none`}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deepBg/70 pointer-events-none"></div>
                    <div className={`absolute ${row.badgePos}`}>
                      <span className="mn-meta-pill">{row.badge}</span>
                    </div>
                  </div>
                </div>
                <div className={`md:col-span-5 ${row.reverse ? "md:order-1" : ""}`}>
                  <p className={`font-pixel text-[10px] ${row.badgeColor} mb-4 tracking-widest`}>{`// ${row.id} — ${row.code}`}</p>
                  <h3 className={`font-display text-3xl md:text-4xl text-white mb-6 ${row.headlineGlow}`}>{row.headline}</h3>
                  <p className="font-body text-gray-300 leading-relaxed text-base">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="console" className="py-24 bg-black border-t border-neonCyan/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neonPink to-transparent opacity-60"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 reveal">
              <span className="mn-meta-pill mb-5">/// BEHIND_THE_CONSOLE</span>
              <h2 className="font-display text-4xl md:text-5xl mt-5 text-white glow-text-cyan">
                FOUR STEPS TO <span className="text-neonPink">VINYL CUT</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-5">
                <div className="md:sticky md:top-28 flex flex-col gap-6">
                  <div className="relative aspect-[3/4] overflow-hidden border-2 border-neonPink/50 mn-console-photo">
                    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop" alt="Server rack — analog console stack" className="w-full h-full object-cover mix-blend-screen contrast-125 saturate-150" />
                    <div className="absolute inset-0 bg-gradient-to-b from-neonPink/15 via-transparent to-neonCyan/25 mix-blend-overlay pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deepBg via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <span className="mn-meta-pill">RACK A · 16U · LIVE</span>
                      <span className="font-pixel text-[10px] text-neonPink tracking-widest">/// SIGNAL_PATH</span>
                    </div>
                  </div>

                  <div className="border border-neonCyan/30 bg-deepBg/60 p-5 backdrop-blur">
                    <p className="font-pixel text-[10px] text-neonCyan tracking-widest mb-4">/// SIGNAL_CHAIN</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-10 h-10 rounded-full border border-retroYellow/60 bg-retroYellow/10 flex items-center justify-center shadow-[0_0_12px_rgba(255,200,90,0.45)]">
                          <span className="font-pixel text-[9px] text-retroYellow">01</span>
                        </div>
                        <span className="font-pixel text-[9px] text-gray-400">TRACK</span>
                      </div>
                      <span className="text-neonCyan/70 text-xs">›</span>
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-10 h-10 rounded-full border border-neonPink/60 bg-neonPink/10 flex items-center justify-center shadow-[0_0_12px_rgba(255,105,180,0.45)]">
                          <span className="font-pixel text-[9px] text-neonPink">02</span>
                        </div>
                        <span className="font-pixel text-[9px] text-gray-400">EDIT</span>
                      </div>
                      <span className="text-neonCyan/70 text-xs">›</span>
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-10 h-10 rounded-full border border-neonCyan/60 bg-neonCyan/10 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.5)]">
                          <span className="font-pixel text-[9px] text-neonCyan">03</span>
                        </div>
                        <span className="font-pixel text-[9px] text-gray-400">SUM</span>
                      </div>
                      <span className="text-neonCyan/70 text-xs">›</span>
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-10 h-10 rounded-full border border-neonPurple/60 bg-neonPurple/10 flex items-center justify-center shadow-[0_0_12px_rgba(180,100,255,0.5)]">
                          <span className="font-pixel text-[9px] text-neonPurple">04</span>
                        </div>
                        <span className="font-pixel text-[9px] text-gray-400">CUT</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neonCyan/15 grid grid-cols-2 gap-2 font-pixel text-[8px] text-gray-500 tracking-widest">
                      <span>SR · 96kHz</span>
                      <span className="text-right">BIT · 24</span>
                      <span>HEAD · −18 dBFS</span>
                      <span className="text-right">JITTER · &lt;200 ps</span>
                    </div>
                  </div>

                  <div className="relative aspect-video overflow-hidden border-2 border-neonCyan/40 mn-console-photo">
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop" alt="Modular synth circuit board macro" className="w-full h-full object-cover mix-blend-screen contrast-125 saturate-150" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-neonCyan/30 via-transparent to-neonPink/25 mix-blend-overlay pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deepBg via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                      <span className="mn-meta-pill">RACK B · MODULAR · 6U</span>
                      <span className="font-pixel text-[9px] text-neonCyan tracking-widest">CV · GATE</span>
                    </div>
                  </div>

                  <div className="border border-neonPink/30 bg-deepBg/60 p-5 backdrop-blur">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-pixel text-[10px] text-neonPink tracking-widest">/// MASTER_BUS · LIVE</p>
                      <span className="font-pixel text-[9px] text-retroYellow">REC ●</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-[9px] font-pixel">
                        <span className="text-gray-400 w-6">L</span>
                        <div className="flex-1 h-2 bg-deepBg border border-neonCyan/30 relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-to-r from-neonCyan via-retroYellow to-neonPink shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                        </div>
                        <span className="text-neonCyan tabular-nums w-12 text-right">−6.2 dB</span>
                      </div>
                      <div className="flex items-center gap-3 text-[9px] font-pixel">
                        <span className="text-gray-400 w-6">R</span>
                        <div className="flex-1 h-2 bg-deepBg border border-neonCyan/30 relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-[71%] bg-gradient-to-r from-neonCyan via-retroYellow to-neonPink shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                        </div>
                        <span className="text-neonCyan tabular-nums w-12 text-right">−5.8 dB</span>
                      </div>
                      <div className="flex items-center gap-3 text-[9px] font-pixel">
                        <span className="text-gray-400 w-6">SUB</span>
                        <div className="flex-1 h-2 bg-deepBg border border-neonPink/30 relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-neonPurple to-neonPink shadow-[0_0_8px_rgba(180,100,255,0.6)]" />
                        </div>
                        <span className="text-neonPink tabular-nums w-12 text-right">−12.1 dB</span>
                      </div>
                    </div>
                    <p className="font-pixel text-[8px] text-gray-500 mt-4 pt-3 border-t border-neonPink/15 tracking-widest">
                      INTEGRATED · −11 LUFS · TARGETING VINYL CUT
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 space-y-12">
                {CONSOLE_STEPS.map((step) => (
                  <div key={step.n} className={`border-l-2 ${step.border} pl-6 reveal`}>
                    <p className={`font-pixel text-[10px] ${step.accent} tracking-widest mb-3`}>{`/// STEP ${step.n}`}</p>
                    <h3 className="font-display text-3xl text-white mb-4">{step.title}</h3>
                    <p className="font-body text-gray-300 leading-relaxed">{step.body}</p>
                  </div>
                ))}

                <div className="border border-neonCyan/30 bg-deepBg/60 p-6 backdrop-blur reveal">
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-pixel text-[10px] text-neonCyan tracking-widest">/// DELIVERABLES · WHAT SHIPS</p>
                    <span className="font-pixel text-[9px] text-retroYellow">04 ARTEFACTS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-neonCyan/20 bg-deepBg/80 p-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="font-pixel text-[9px] text-neonCyan tracking-widest">01 · STREAMING</span>
                        <span className="font-pixel text-[9px] text-gray-500">.WAV · 24/96</span>
                      </div>
                      <p className="font-body text-sm text-white leading-snug">−11 LUFS · −1 dBTP</p>
                      <p className="font-pixel text-[8px] text-gray-500 mt-2 leading-relaxed">Spotify · Apple · Bandcamp</p>
                    </div>
                    <div className="border border-neonPink/20 bg-deepBg/80 p-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="font-pixel text-[9px] text-neonPink tracking-widest">02 · VINYL PRE</span>
                        <span className="font-pixel text-[9px] text-gray-500">.WAV · 24/96</span>
                      </div>
                      <p className="font-body text-sm text-white leading-snug">−13 LUFS · sub mono</p>
                      <p className="font-pixel text-[8px] text-gray-500 mt-2 leading-relaxed">Cutting house · DMM lathe</p>
                    </div>
                    <div className="border border-retroYellow/20 bg-deepBg/80 p-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="font-pixel text-[9px] text-retroYellow tracking-widest">03 · STEM PACK</span>
                        <span className="font-pixel text-[9px] text-gray-500">.ZIP · 8 stems</span>
                      </div>
                      <p className="font-body text-sm text-white leading-snug">DRMS · BASS · SYN · VOX · FX · ROOM · BUS · PRINT</p>
                    </div>
                    <div className="border border-neonPurple/20 bg-deepBg/80 p-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="font-pixel text-[9px] text-neonPurple tracking-widest">04 · SESSION</span>
                        <span className="font-pixel text-[9px] text-gray-500">.PTX · archived</span>
                      </div>
                      <p className="font-body text-sm text-white leading-snug">Pro Tools session + recall sheets, kept 7 yr</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-neonCyan/15 flex items-center justify-between flex-wrap gap-3">
                    <span className="font-pixel text-[9px] text-gray-500 tracking-widest">SIGNED OFF · MASTERING ENG · J. NAVARRO</span>
                    <span className="font-pixel text-[9px] text-neonCyan tracking-widest">REV · 2.4 · 2026-04-29</span>
                  </div>
                </div>

                <figure className="border-l-2 border-neonCyan pl-6 reveal">
                  <p className="font-pixel text-[10px] text-neonCyan tracking-widest mb-3">/// FROM THE LATHE OPERATOR</p>
                  <blockquote className="font-display italic text-xl md:text-2xl text-white leading-snug mb-4">
                    "Of the seven hundred records that came across my lathe last year, four didn't need a single retake. Three of them were yours."
                  </blockquote>
                  <figcaption className="font-pixel text-[9px] text-gray-400 tracking-widest">— RUTGER M. · DMM CUTTING · BERLIN</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-24 bg-[#080214] border-t border-neonPink/20 relative">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12 reveal">
              <div>
                <span className="mn-meta-pill mb-4">/// CATALOG · 2024_RELEASES</span>
                <h2 className="font-display text-3xl md:text-5xl mt-4 text-white glow-text-pink">
                  EIGHT TAPES, <span className="text-neonCyan">ONE LATHE</span>
                </h2>
              </div>
              <p className="font-body text-purple-200/70 max-w-md">
                The 2024 catalog · pressed to 180-gram pink translucent vinyl · 500 copies each · numbered.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
              {CATALOG_CARDS.map((c) => (
                <div key={c.code} className="reveal">
                  <div className="mn-catalog-card aspect-square relative overflow-hidden">
                    <img src={c.img} alt={`${c.code} ${c.name}`} className="w-full h-full object-cover saturate-150 contrast-125" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${c.overlay} mix-blend-overlay`}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                    <span className="absolute top-2 left-2 font-pixel text-[8px] text-white tracking-widest">{c.side}</span>
                  </div>
                  <p className="font-pixel text-[9px] text-neonCyan mt-3 tracking-widest leading-snug">
                    {c.code}<br /><span className="text-gray-500">{c.name}</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="font-pixel text-[10px] text-gray-600 text-center mt-12 tracking-widest reveal">
              {"// ALL TITLES AVAILABLE ON BANDCAMP · CASSETTE · 12-INCH VINYL"}
            </p>
          </div>
        </section>

        <section id="faq" className="py-24 bg-deepBg border-t border-neonCyan/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neonPurple rounded-full blur-[160px] opacity-15 pointer-events-none"></div>
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="text-center mb-16 reveal">
              <span className="mn-meta-pill mb-5">/// FREQUENTLY_ASKED</span>
              <h2 className="font-display text-4xl md:text-5xl mt-5 text-white">
                READ <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-neonCyan">THE_MANUAL</span>
              </h2>
              <p className="font-body text-purple-200/70 mt-4">Eight signal-path questions, eight straight answers.</p>
            </div>
            <div className="border border-neonPink/30 divide-y divide-neonPink/20 bg-black/40 backdrop-blur-sm">
              {FAQ_ITEMS.map((item) => (
                <details key={item.n} className="mn-faq group p-6 hover:bg-neonPink/5 transition-colors">
                  <summary className="flex justify-between items-center gap-4 font-display text-lg md:text-xl text-white">
                    <span className="flex items-center gap-4">
                      <span className="font-pixel text-[10px] text-neonCyan tracking-widest">{item.n}</span>
                      {item.q}
                    </span>
                    <span className="mn-plus font-display text-2xl text-neonCyan leading-none">+</span>
                  </summary>
                  <p className="font-body text-gray-300 leading-relaxed mt-5 pl-12 text-base">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 bg-black border-t-4 border-t-neonPink relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neonPink via-retroYellow to-neonCyan blur-sm mt-[-6px]"></div>
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display text-4xl mb-12 text-center text-white reveal">INITIATE <span className="text-neonCyan">CONTACT</span></h2>
            <div className="bg-[#050505] border-2 border-gray-800 p-2 rounded reveal glow-border-pink">
              <div className="bg-black p-6 md:p-10 font-mono text-green-500 rounded border border-gray-900 shadow-inner min-h-[400px]">
                <div className="mb-6 pb-4 border-b border-green-900">
                  <p className="text-sm opacity-70">MS-DOS Version 6.22</p>
                  <p className="text-sm opacity-70">{`C:\\USERS\\GUEST> MAIL.EXE`}</p>
                </div>
                <form className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <label className="block mb-2 text-xs uppercase tracking-widest text-green-700">Name_</label>
                      <input type="text" className="w-full bg-green-900/10 border-b border-green-500 text-green-400 focus:outline-none focus:border-neonPink py-2 px-2 transition-colors placeholder-green-900/50" placeholder="ENTER_NAME" />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-xs uppercase tracking-widest text-green-700">Email_</label>
                      <input type="email" className="w-full bg-green-900/10 border-b border-green-500 text-green-400 focus:outline-none focus:border-neonPink py-2 px-2 transition-colors placeholder-green-900/50" placeholder="ENTER_EMAIL" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-xs uppercase tracking-widest text-green-700">Message_</label>
                    <textarea rows="4" className="w-full bg-green-900/10 border-b border-green-500 text-green-400 focus:outline-none focus:border-neonPink py-2 px-2 transition-colors placeholder-green-900/50" placeholder="TYPE_MESSAGE_HERE..."></textarea>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="button" className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-black transition-all duration-200 bg-green-500 font-pixel hover:bg-neonPink hover:text-white">
                      <span className="mr-2">SEND.EXE</span>
                      <span className="animate-pulse">_</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#050011] pt-16 pb-8 border-t border-gray-900">
          <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center gap-6 mb-10">
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-900 text-gray-400 rounded hover:bg-neonPink hover:text-white transition-all duration-300">
                <i data-lucide="instagram" className="w-5 h-5"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-900 text-gray-400 rounded hover:bg-neonCyan hover:text-black transition-all duration-300">
                <i data-lucide="twitter" className="w-5 h-5"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-900 text-gray-400 rounded hover:bg-retroOrange hover:text-white transition-all duration-300">
                <i data-lucide="youtube" className="w-5 h-5"></i>
              </a>
            </div>
            <p className="font-pixel text-[10px] text-gray-600 leading-relaxed">
              © 2024 MIAMI_NIGHTS STUDIO.<br />
              ESTABLISHED IN 1984.
            </p>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function init(){
          if (typeof lucide !== 'undefined' && lucide.createIcons) { lucide.createIcons(); return; }
          setTimeout(init, 50);
        })();
      ` }} />
    </>
  );
}
