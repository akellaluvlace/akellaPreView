const CATALOG = [
  { tag: "PT-04 · TAPE",          title: "Calibrated 4-track tape mover",        edition: "Edition · 60 of 60 · 2018",  img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", alt: "PT-04 Tape" },
  { tag: "DX-12 · DAW",           title: "Twelve-fader desktop control surface", edition: "Edition · 80 of 80 · 2019",  img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "DX-12 DAW" },
  { tag: "MIDI-V · MIXER",        title: "Six-channel MIDI router with VU plate", edition: "Edition · 120 of 120 · 2020", img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", alt: "MIDI-V Mixer" },
  { tag: "SR-09 · SERVER",        title: "1U archival audio file server",        edition: "Edition · 24 of 24 · 2021",  img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop", alt: "SR-09 Server" },
  { tag: "EC-02 · ECHO",          title: "Spring-line tape-echo desktop unit",   edition: "Edition · 90 of 90 · 2021",  img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", alt: "EC-02 Echo" },
  { tag: "MN-04 · MONITOR",       title: "Near-field passive reference pair",    edition: "Edition · 40 of 40 · 2022",  img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop", alt: "MN-04 Monitor" },
  { tag: "HD-06 · HEADSTAGE",     title: "Class-A headphone amplifier",          edition: "Edition · 150 of 150 · 2023", img: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85&auto=format&fit=crop", alt: "HD-06 Headstage" },
  { tag: "MODEL-808 · PLAYER",    title: "High-fidelity FM & tape playback",     edition: "Edition · 240 of 240 · 2024", img: "https://images.unsplash.com/photo-1700951372714-98979a8803a4?w=900&q=85&auto=format&fit=crop", alt: "MODEL-808 Player" },
  { tag: "LP-01 · LOUDSPEAKER",   title: "Single-driver desktop full-range",     edition: "Edition · 60 of 60 · 2024",  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", alt: "LP-01 Loudspeaker" },
  { tag: "CL-12 · CLOCK",         title: "Master word-clock for the studio rack", edition: "Edition · 32 of 32 · 2025",  img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop", alt: "CL-12 Clock" },
];

const MATERIALS = [
  {
    chip: "i — Chassis",
    title: "CNC'd 6061 aluminium · brushed in two passes",
    body: "The front-plate and rear-plate are both cut from a single 14 mm billet of 6061-T6 aerospace aluminium on a five-axis Hermle C22, and then brushed by hand — the first pass in the long axis at a 220-grit, the second perpendicular at 320-grit. The result is a directional finish that catches light differently as the unit is rotated, and is durable enough that we have units in the field that have lived on a chef's pass for two years and still don't show the marks of their first month. The plate is hard-anodised, not painted; the colour comes from the oxide, not a coating, and there is nothing on the surface that can chip.",
  },
  {
    chip: "ii — PCB",
    title: "Hand-laid two-layer board · cream solder mask",
    body: "The mainboard is a 2-layer FR-4 substrate with a cream solder mask we mix specifically for this unit, machine-populated for the SMD passives and then hand-finished for the larger thru-hole components — the headphone amplifier, the eight-position rotary, the trim pots. Every board is photographed at 12 MP under raked LED light before assembly, and the photograph is filed with the unit's serial card. We have changed the board layout three times since the first run; each revision is etched onto the bottom-left corner of the board so that, in twenty years, anyone servicing the unit can identify the revision without dismantling the chassis.",
  },
  {
    chip: "iii — Pots",
    title: "ALPS RK16 · 50K log · the centre detent is real",
    body: "The master volume and the three EQ faders use ALPS RK16 motorised potentiometers on a 50K logarithmic taper, with a mechanical centre detent we had the factory tune for our specific torque preference. A cheaper detent uses a magnet; the RK16 detent is a physical ball-bearing in a milled groove. You can feel the difference immediately in the wrist, and you can feel it again twelve months in when the cheap detent has worn smooth and ours has not. The knob caps are turned from solid 6061 stock and pressed onto a brass collet, which means they cannot work loose with use and they cannot be replaced with a plastic substitute should the unit ever be parted-out.",
  },
  {
    chip: "iv — Mesh",
    title: "0.6 mm electroformed brass · acoustically transparent",
    body: "The speaker grille is electroformed brass, 0.6 mm thick, with a hexagonal cell pattern on a 1.4 mm pitch — the dimensions are the result of three weeks with a B&K calibrated microphone in our acoustic-foam closet, looking for the cell size that did the least to the high-frequency response of the driver. The mesh is then aged in a warm citric-acid bath for ninety minutes to bring up the warm yellow note you see on the unit, and finally lacquered in a matte clear-coat that will take fingerprints without holding them. None of these decisions matter for the unit's performance on a spec sheet. They all matter for the unit's performance in a room.",
  },
];

const BOM_ROWS = [
  { k: "Front-plate", v: "6061-T6 · 14 mm billet" },
  { k: "Knob caps", v: "6061 · brass collet" },
  { k: "Speaker mesh", v: "Electroformed brass · 0.6 mm" },
  { k: "Mainboard", v: "2-layer FR-4 · cream mask" },
  { k: "Faders", v: "ALPS RK16 · 50K log" },
];

const MFG_FIELDS = [
  { k: "Mill", v: "Hermle C22" },
  { k: "Tolerance", v: "± 0.02 mm" },
  { k: "Brush · pass 1", v: "220 grit · long axis" },
  { k: "Brush · pass 2", v: "320 grit · cross-axis" },
  { k: "Anodise", v: "Type II hard · oxide colour" },
  { k: "QA · per board", v: "12 MP raked-light photo" },
];

const SPEC_ROWS = [
  ["ADC bit depth",       "24 bit · ESS Sabre ES9038Q2M"],
  ["Sample rate",         "44.1 / 48 / 88.2 / 96 / 192 kHz"],
  ["SNR",                 "117 dB · A-weighted · 1 kHz"],
  ["THD + N",             "0.0008 % · 1 kHz · 0 dBFS"],
  ["Frequency response",  "10 Hz – 38 kHz · ± 0.1 dB"],
  ["Output impedance",    "0.6 Ω balanced · 0.3 Ω SE"],
  ["Power",               "9 W idle · 14 W peak · linear PSU"],
  ["Dimensions",          "248 × 148 × 64 mm"],
  ["Weight",              "2.41 kg · steel-shipped 3.18 kg"],
  ["Case material",       "6061-T6 aluminium · hard-anodised"],
  ["Display",             "Sharp Memory LCD · 320 × 240 · transflective"],
  ["Control surface",     "4 × ALPS RK16 · 1 × 8-pos rotary · 4 × tactile"],
  ["I / O",               "2 × XLR · 2 × TS ¼\" · 1 × ¼\" headphone · USB-C · Toslink"],
  ["Certifications",      "CE · FCC Part 15B · RoHS · WEEE · Norwegian EE-rgst"],
];

const FAQS = [
  {
    q: "Why so heavy?",
    a: "The MODEL-808 weighs 2.41 kg net and 3.18 kg shipped. The chassis is solid 6061-T6 aluminium, the rear-plate is a second slab of the same alloy, and the linear power supply uses a toroidal transformer rather than a switching module that would have saved us 600 g and a centimetre of internal volume. We made the decision in week three of the prototype run that the player should sit on a desk and stay there: a desktop unit that slides under the touch of a single finger is a unit you will eventually catch with your knee. The mass is part of the user interface. We did not buy it cheaply.",
    open: true,
  },
  {
    q: "Is the LCD a real Sharp Memory display?",
    a: "Yes. The LCD is a Sharp LS027B7DH01A transflective Memory display, 320 × 240, monochrome, with the characteristic green-grey field that no other display chemistry quite reproduces. We chose it over an OLED in the second prototype run because Memory pixels hold their state without refresh, draw under 200 µA at full image, and look exactly the same in direct sunlight as they do in a dim cellar. The specific green you see is the panel's native field colour with a 5% warm-grey backlight that runs only when the unit is in low-ambient conditions.",
  },
  {
    q: "Can I service the unit myself?",
    a: "Yes — the chassis opens with four M3 hex screws and a service manual ships with every unit. The mainboard is held on five standoffs and lifts out without unsoldering. The two ribbons that connect to the front-plate are keyed and labelled. We sell every spare part in the BOM through the Tjuvholmen workshop directly, including the brass mesh, the ALPS pots, the LCD, and the linear PSU. We will not, however, sell you a re-anodised front-plate; if the plate is damaged we re-finish it ourselves so the second pass matches the first, and we charge what it costs us in the workshop.",
  },
  {
    q: "Do you ship outside the EU?",
    a: "We ship to forty-two countries directly, including the UK, the United States, Canada, Japan, Korea, Australia, New Zealand, Switzerland, Norway, and most of the EEA. We do not ship to addresses where the destination customs authority has demonstrated, in our seven-year history, an inability to deliver a 3.18 kg parcel containing a hand-anodised aluminium product without dismantling the inner crate; that list currently has eleven countries on it and we keep it under review. Shipping is by Bring Norge with full insurance and a tracked B2C delivery; the unit is double-crated in a wooden inner box.",
  },
  {
    q: "Battery option?",
    a: "No. We considered, in the third prototype run, an internal LiFePO4 pack that would have given us about four hours of playback off the wall, and we decided against it for two reasons that have not changed. First, the pack would have raised the unit's weight by another 380 g of cells and management circuitry, which we decided was past the point at which the device wants to live on a desk. Second, the linear PSU sounds, to our ears in our cellar, marginally better than the equivalent battery-fed Class-A topology under sustained drive. There is a stationary IEC plug on the back. It will stay there.",
  },
  {
    q: "Latency vs. a software DAW?",
    a: "Round-trip USB latency, measured at 96 kHz with a 64-sample buffer on a 2023 Macbook Pro running Logic Pro, was 4.7 ms input-to-output through the MODEL-808's loopback. By comparison, the same chain with a typical class-compliant USB interface measures 6.1 ms; with a high-end Thunderbolt converter, 3.4 ms. We are not the lowest-latency device on the desk, and we are also not pretending to be: this is a playback-first unit with monitoring as a secondary use case, and the 4.7 ms figure is well under the threshold of perception for a violinist tracking against a click.",
  },
  {
    q: "What's the warranty?",
    a: "Two years from the date of dispatch on every unit, no questions asked. We replace any failed component, including the LCD, the ALPS pots, the linear PSU, and the brass mesh, by return ship from the workshop. Beyond two years we continue to service every unit we have ever sold, including the seventy-eight units of the very first 2018 PT-04 batch, and the workshop maintains a parts inventory for the lifetime of the design. Warranty service is paid by the customer one-way; we cover the return leg. The warranty card is hand-numbered and signed; do not lose it.",
  },
  {
    q: "How long are units in stock?",
    a: "The MODEL-808 is a lifetime edition of two hundred and forty units. As of the last update on this page we have shipped one hundred and seventeen, the next batch of twelve is on the calibration bench and will leave the workshop in three weeks, and we hold the remaining one hundred and eleven units' worth of finished aluminium in the stock room. We will not run a second batch when the edition closes; if you want a unit and the edition is still open, ordering now is the right call. We do not keep a waiting list past the close of the edition.",
  },
];

export default function T69Skeuomorphism() {
  const eqBands = [
    { label: "LOW", value: 75 },
    { label: "MID", value: 40 },
    { label: "HIGH", value: 60 },
  ];

  const transportBtns = [
    { label: "REV", extra: "" },
    { label: "FWD", extra: "" },
    { label: "STOP", extra: "" },
    { label: "REC", extra: "text-red-700 bg-red-50" },
  ];

  const spectrumBars = [20, 50, 80, 40, 60, 30, 70, 45];
  const spectrumDelays = [0, 100, 200, 50, 150, 250, 120, 80];

  const customCss = `:root {
  --bg-dark: #121212;
  --metal-light: #d4d4d4;
  --metal-mid: #a3a3a3;
  --metal-dark: #505050;
  --accent-orange: #ff5500;
  --lcd-bg: #8ba892;
  --lcd-pixel: #111;
}
html, body { overflow-x: clip; }
body {
  background-color: var(--bg-dark);
  background-image:
    radial-gradient(#222 15%, transparent 16%),
    radial-gradient(#222 15%, transparent 16%);
  background-size: 10px 10px;
  background-position: 0 0, 5px 5px;
  font-family: 'Inter', sans-serif;
  min-height: 100vh; overflow-x: hidden; color: #d4d4d4;
}
.hero-stage { display:flex; align-items:center; justify-content:center; padding: 64px 20px; }
.device-casing {
  background: linear-gradient(145deg, #e6e6e6, #c4c4c4);
  box-shadow: 20px 20px 60px #0a0a0a, -20px -20px 60px #1e1e1e, inset 0 0 0 1px rgba(255,255,255,0.4);
  position: relative; color: #333;
}
.brushed-texture { position: relative; }
.brushed-texture::before {
  content:""; position:absolute; inset:0;
  background-image: repeating-linear-gradient(90deg, transparent 0, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px);
  pointer-events:none; border-radius: inherit; mix-blend-mode: multiply;
}
.engraved { color:#777; text-shadow: 1px 1px 0px rgba(255,255,255,0.7), -1px -1px 0px rgba(0,0,0,0.1); }
.printed { color:#333; opacity:0.8; }
.lcd-container {
  background-color: #7a8a7a;
  box-shadow: inset 3px 3px 8px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.2);
  position: relative; font-family: 'Share Tech Mono', monospace; overflow: hidden;
}
.lcd-grid {
  background-image: linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 3px 3px; pointer-events: none;
}
.lcd-content { color:#1a2a1a; text-shadow: 2px 2px 0px rgba(100,120,100,0.4); }
.knob-base {
  border-radius: 50%;
  background: conic-gradient(from 135deg, #d1d1d1, #f5f5f5, #a3a3a3, #f5f5f5, #d1d1d1);
  box-shadow: 5px 10px 15px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
  position: relative; cursor: grab; touch-action: none;
}
.knob-base:active { cursor: grabbing; }
.knob-base::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: repeating-conic-gradient(#0000 0deg, #0000 3deg, rgba(0,0,0,0.1) 4deg);
  mask-image: radial-gradient(transparent 68%, black 70%);
  -webkit-mask-image: radial-gradient(transparent 68%, black 70%);
}
.knob-cap {
  position:absolute; inset:10%; border-radius:50%;
  background: linear-gradient(145deg, #e6e6e6, #cecece);
  box-shadow: inset 1px 1px 2px rgba(255,255,255,1), inset -1px -1px 2px rgba(0,0,0,0.1);
}
.knob-indicator {
  position:absolute; top:15%; left:50%; transform: translateX(-50%);
  width:4px; height:25%; background:#ff5500; border-radius:2px;
  box-shadow: inset 1px 1px 1px rgba(0,0,0,0.2);
}
input[type=range].fader { -webkit-appearance: none; width: 100%; background: transparent; }
input[type=range].fader:focus { outline: none; }
input[type=range].fader::-webkit-slider-runnable-track {
  width: 100%; height: 180px; cursor: pointer; background: #111; border-radius: 4px;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.8), 1px 1px 0 rgba(255,255,255,0.2);
}
input[type=range].fader::-webkit-slider-thumb {
  height: 40px; width: 24px; border-radius: 2px;
  background: linear-gradient(90deg, #333 0%, #666 20%, #888 50%, #666 80%, #333 100%);
  cursor: grab; -webkit-appearance: none; margin-top: 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4);
  position: relative; z-index: 10;
}
.btn-round {
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #555, #222);
  box-shadow: 3px 3px 6px rgba(0,0,0,0.4), -1px -1px 2px rgba(255,255,255,0.1);
  border: 2px solid #1a1a1a; position: relative; transition: all 0.1s ease;
}
.btn-round:active {
  transform: scale(0.95);
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.8);
  background: radial-gradient(circle at 30% 30%, #333, #111);
}
.btn-rect {
  background: linear-gradient(to bottom, #f0f0f0 0%, #dcdcdc 100%);
  box-shadow: 0 3px 0 #999, 0 4px 4px rgba(0,0,0,0.2);
  border-radius: 4px; color: #333; font-weight: 700; font-size: 0.75rem;
  transition: all 0.1s; border: 1px solid rgba(255,255,255,0.5);
}
.btn-rect:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 #999, inset 0 2px 4px rgba(0,0,0,0.2);
  background: #dcdcdc;
}
.led {
  width:8px; height:8px; background-color:#440000; border-radius:50%;
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5);
  border: 1px solid rgba(0,0,0,0.2); transition: background-color 0.2s, box-shadow 0.2s;
}
.led.on { background-color:#ff3300; box-shadow: 0 0 8px #ff3300, inset 1px 1px 2px rgba(255,255,255,0.4); }
.slider-slot { display:flex; align-items:center; justify-content:center; height:180px; width:40px; }
.vertical-range { transform: rotate(-90deg); width:160px; height:40px; }

.editorial-band { color:#d4d4d4; background-color:#161616; border-top:1px solid #2a2a2a; border-bottom:1px solid #2a2a2a; }
.editorial-band-deep { color:#d4d4d4; background-color:#0e0e0e; border-top:1px solid #1f1f1f; border-bottom:1px solid #1f1f1f; }
.editorial-band-soft { color:#d4d4d4; background-color:#1a1a1a; border-top:1px solid #2a2a2a; border-bottom:1px solid #2a2a2a; }
.label-mono { font-family:'Share Tech Mono', monospace; letter-spacing:0.28em; text-transform:uppercase; font-size:11px; color:#ff5500; }
.label-mono-mute { font-family:'Share Tech Mono', monospace; letter-spacing:0.28em; text-transform:uppercase; font-size:11px; color:#888; }
.display-headline { font-family:'Inter', sans-serif; font-weight:800; letter-spacing:-0.025em; color:#f0f0f0; }
.editorial-quote { font-family:'Newsreader', serif; font-style:italic; color:#b8b8b8; }
.body-prose { color:#b3b3b3; line-height:1.7; font-size:15px; }
.panel-brushed {
  background: linear-gradient(180deg, #1a1a1a 0%, #131313 100%);
  border: 1px solid #2c2c2c;
  box-shadow:
    inset 1px 1px 0 rgba(255,255,255,0.04),
    inset -1px -1px 0 rgba(0,0,0,0.6),
    0 8px 24px rgba(0,0,0,0.4);
  position: relative;
}
.panel-brushed::before {
  content:""; position:absolute; inset:0;
  background-image: repeating-linear-gradient(90deg, transparent 0, transparent 1px, rgba(255,255,255,0.015) 1px, rgba(255,255,255,0.015) 2px);
  pointer-events:none;
}

.marquee-wrap { overflow:hidden; position:relative; }
.marquee-track { display:flex; gap:18px; width:max-content; animation: marquee-x 64s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee-x {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 9px)); }
}
.catalog-card {
  width: 280px; flex-shrink: 0;
  background: #131313; border: 1px solid #2a2a2a;
  box-shadow: 0 12px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03);
  position: relative;
}
.catalog-card .catalog-img-wrap {
  position: relative; aspect-ratio: 1 / 1; overflow: hidden;
  border-bottom: 1px solid #2a2a2a; background-color: #0c0c0c;
}
.catalog-card .catalog-img-wrap img {
  width: 100%; height: 100%; object-fit: cover;
  mix-blend-mode: luminosity; filter: contrast(1.15) saturate(0.9);
}
.catalog-card .catalog-img-wrap::after {
  content:""; position:absolute; inset:0;
  background-color: rgba(255,85,0,0.08); mix-blend-mode: overlay; pointer-events:none;
}

.faq-row { border-bottom: 1px solid #262626; }
.faq-row:last-child { border-bottom: none; }
.faq-row summary { cursor:pointer; list-style:none; padding:22px 0; display:flex; justify-content:space-between; align-items:center; gap:24px; }
.faq-row summary::-webkit-details-marker { display:none; }
.faq-row .faq-glyph {
  flex-shrink:0; width:28px; height:28px;
  display:inline-flex; align-items:center; justify-content:center;
  border:1px solid #ff5500; color:#ff5500;
  font-family:'Share Tech Mono', monospace;
  font-size:18px; line-height:1;
  transition: transform 280ms ease;
}
.faq-row[open] .faq-glyph { transform: rotate(45deg); }
.faq-row[open] summary { color:#f0f0f0; }
.faq-row .faq-answer { padding: 0 0 22px 0; max-width: 64ch; }
@media (prefers-reduced-motion: reduce) {
  .faq-row .faq-glyph { transition: none; }
  .marquee-track { animation: none; }
}

.half-bleed-right { margin-right: calc(50% - 50vw); }

.spec-list dt { font-family:'Share Tech Mono', monospace; letter-spacing:0.18em; text-transform:uppercase; font-size:11px; color:#888; }
.spec-list dd { font-family:'Inter', sans-serif; font-feature-settings:"tnum" 1; color:#ececec; font-size:14px; }
.spec-row { display:grid; grid-template-columns: 1fr 1fr; gap:18px; padding:12px 0; border-bottom:1px solid #232323; }
.spec-row:last-child { border-bottom: none; }

@media (min-width: 768px) {
  .sticky-photo { position: sticky; top: 96px; align-self: flex-start; }
}

.num-chip {
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid #ff5500; color:#ff5500;
  font-family:'Share Tech Mono', monospace;
  letter-spacing: 0.2em; font-size:11px;
  padding: 5px 10px; text-transform:uppercase;
}`;

  const initScript = `(function init(){
  var knob = document.getElementById('volumeKnob');
  if (!knob) { setTimeout(init, 50); return; }
  var isDragging = false;
  var startY = 0;
  var currentRotation = -135;

  knob.addEventListener('mousedown', function(e){ isDragging = true; startY = e.clientY; e.preventDefault(); });
  document.addEventListener('mouseup', function(){ isDragging = false; });
  document.addEventListener('mousemove', function(e){
    if (!isDragging) return;
    var delta = startY - e.clientY;
    updateRotation(delta);
    startY = e.clientY;
  });
  knob.addEventListener('touchstart', function(e){ isDragging = true; startY = e.touches[0].clientY; e.preventDefault(); }, { passive: false });
  document.addEventListener('touchend', function(){ isDragging = false; });
  document.addEventListener('touchmove', function(e){
    if (!isDragging) return;
    var delta = startY - e.touches[0].clientY;
    updateRotation(delta);
    startY = e.touches[0].clientY;
    e.preventDefault();
  }, { passive: false });

  function updateRotation(delta) {
    currentRotation += delta * 2;
    if (currentRotation > 135) currentRotation = 135;
    if (currentRotation < -135) currentRotation = -135;
    knob.style.transform = 'rotate(' + currentRotation + 'deg)';
  }

  var isPowered = true;
  var led = document.getElementById('powerLed');
  var screen = document.getElementById('mainScreen');
  var screenContent = screen ? screen.querySelector('.lcd-content') : null;
  var powerBtn = document.getElementById('powerBtn');
  if (powerBtn) powerBtn.addEventListener('click', function(){
    isPowered = !isPowered;
    if (!led || !screen || !screenContent) return;
    if (isPowered) {
      led.classList.add('on');
      screenContent.style.opacity = '1';
      screen.style.boxShadow = 'inset 3px 3px 8px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.2)';
    } else {
      led.classList.remove('on');
      screenContent.style.opacity = '0.1';
      screen.style.boxShadow = 'inset 0 0 40px rgba(0,0,0,0.8)';
    }
  });
})();`;

  const catalogTwice = [...CATALOG, ...CATALOG];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,400..700;1,400..700&family=Segment7&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      {/* HERO — image left, content right, screen-wide */}
      <section className="editorial-band-soft w-full px-6 md:px-12 py-20 md:py-28 lg:py-32">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <figure className="lg:col-span-7 order-2 lg:order-1 m-0">
            <div className="relative panel-brushed p-3 md:p-4 rounded-sm shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
              <div className="relative overflow-hidden bg-black aspect-[5/4]">
                <img className="w-full h-full object-cover" style={{ mixBlendMode: "luminosity", filter: "contrast(1.25) saturate(0.85)" }} src="https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1600&q=85&auto=format&fit=crop" alt="MODEL-808 prototype on the workbench in raking studio light" />
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "rgba(255,85,0,0.06)", mixBlendMode: "overlay" }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="num-chip">PLATE · 01</span>
                  <span className="label-mono-mute" style={{ color: "#e8e0d3" }}>Workshop · Tjuvholmen pier</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="label-mono" style={{ color: "#e8e0d3" }}>F/2.8 · 1/60s · ISO 200</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 px-1">
                <span className="label-mono">MODEL-808 · serial 00041</span>
                <span className="label-mono-mute">2024 · hand-finished</span>
              </div>
            </div>
          </figure>
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-7">
            <div className="flex items-center gap-3">
              <span className="num-chip">EST · 2017 · OSLO</span>
              <span className="label-mono-mute">Edition of 240 · numbered</span>
            </div>
            <h1 className="display-headline text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
              The hand<br />was always<br />
              <span className="text-[#ff5500]">the interface.</span>
            </h1>
            <p className="body-prose max-w-xl">A desk-bound radio &amp; tape player built from CNC&apos;d aluminium, an electroformed brass grille, and ALPS RK16 potentiometers tuned to a centre detent you can feel through your wrist. Two hundred and forty units. One workshop. No app.</p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#order" className="inline-flex items-center gap-2 bg-[#ff5500] text-white px-6 py-3 rounded font-bold tracking-wide shadow-[0_3px_0_#a83800,0_8px_16px_rgba(255,85,0,0.35)] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-[0_1px_0_#a83800] transition-all">
                <span>Reserve a unit</span>
                <span className="text-lg leading-none">→</span>
              </a>
              <a href="#materials" className="inline-flex items-center gap-2 px-6 py-3 rounded border border-black/15 hover:border-black/35 transition-colors body-prose font-semibold">
                <span>The doctrine</span>
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 mt-2 border-t border-black/10">
              <div className="flex flex-col gap-1">
                <span className="label-mono">Run</span>
                <span className="display-headline text-2xl">240</span>
                <span className="label-mono-mute text-[10px]">units, lifetime</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-mono">Weight</span>
                <span className="display-headline text-2xl">3.4 kg</span>
                <span className="label-mono-mute text-[10px]">stays where it sits</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-mono">Lead</span>
                <span className="display-headline text-2xl">14 wk</span>
                <span className="label-mono-mute text-[10px]">order to delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: HERITAGE / ORIGIN STORY (BEFORE existing device) */}
      <section className="editorial-band-soft py-24 lg:py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="num-chip">EST · 2017 · OSLO</span>
            <span className="label-mono-mute">Chapter — 01 · Origins</span>
          </div>
          <h2 className="display-headline text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-10">
            A device, not a product.<br /><span className="text-[#ff5500]">A discipline of one hand.</span>
          </h2>

          <p className="body-prose mb-7">ANALOG_UI began on a workbench in a converted ferry-yard on Oslo's Tjuvholmen pier, where the founder Bjørn Selvik spent the winter of 2017 dismantling a Tandberg cassette deck a relative had repaired thirty years earlier. He kept the chassis, the brushed front-plate, the two great ALPS knobs that still spun with their original detents — and asked a small question that became the studio's only doctrine: why does almost nothing on a screen feel as good as a single knob whose centre detent is real. The answer, as far as we have been able to find it, is that the screen has nowhere to put your hand. Hardware does. Hardware insists.</p>

          <blockquote className="editorial-quote text-xl md:text-2xl border-l-2 border-[#ff5500] pl-6 my-10">"All controls within reach of one hand. The hand can be wrong; the device cannot."</blockquote>

          <p className="body-prose mb-7">The MODEL-808 you see below is the seventh prototype and the first that we let out of the cellar. Each unit is hand-finished in the Tjuvholmen workshop by a team of four: a CNC operator who's spent a decade tuning aluminium for marine instrumentation, a PCB technician trained on Norwegian sonar boards, a calibration engineer who used to align mastering consoles for a Sami radio archive, and a quality-control photographer who has rejected eighty-six units we'd otherwise have shipped. The unit weighs more than its silhouette suggests, on purpose. We made the decision in week three of the prototype run that the player should sit on a desk and stay there.</p>

          <p className="body-prose">We do not make a thinner version. We do not make a touchscreen version. We do not make a software companion app. We do, on rare evenings, take an order over the telephone if the network is misbehaving — there is a line in the workshop, a Bakelite handset on a coiled cord, and the number is on the warranty card we ship with each unit. The full edition is two hundred and forty MODEL-808 units across the lifetime of the design; we are not running a second batch. When the run is done it will be done, and that, too, is on the warranty card.</p>
        </div>
      </section>

      {/* SECTION 2: MATERIALS — Sticky-photo + scrolling text (NOVEL #8) */}
      <section className="editorial-band py-24 lg:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <span className="num-chip">DETAIL · 02</span>
            <span className="label-mono-mute">Materials · A doctrine in four parts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            <figure className="md:col-span-5 flex flex-col h-full gap-8 md:justify-between m-0">
              <div className="relative panel-brushed p-3 rounded-sm">
                <div className="relative overflow-hidden bg-black aspect-[4/5]">
                  <img className="w-full h-full object-cover" style={{ mixBlendMode: "luminosity", filter: "contrast(1.25) saturate(0.9)" }} src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&auto=format&fit=crop" alt="Circuit board macro — material study for ANALOG_UI MODEL-808" />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "rgba(255,85,0,0.06)", mixBlendMode: "overlay" }}></div>
                </div>
                <div className="flex items-center justify-between pt-3 px-1">
                  <span className="label-mono">Plate · 02</span>
                  <span className="label-mono-mute">Material study · Brass &amp; Aluminium</span>
                </div>
              </div>

              <div className="relative panel-brushed p-5 sm:p-6 rounded-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: "rgba(255,85,0,0.18)" }}>
                  <span className="label-mono">Bill of materials</span>
                  <span className="label-mono-mute">Run · 2026.04</span>
                </div>
                <dl className="flex flex-col">
                  {BOM_ROWS.map((r, i) => (
                    <div key={r.k} className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-2.5" style={i === 0 ? undefined : { borderTop: "1px solid rgba(255,85,0,0.12)" }}>
                      <dt className="label-mono-mute">{r.k}</dt>
                      <dd className="label-mono text-right" style={{ color: "#d4d4d4" }}>{r.v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="label-mono-mute mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,85,0,0.18)" }}>Sourced within 400 km of the Antwerp shop. Each ingot logged against the unit's serial card.</p>
              </div>

              <div className="relative panel-brushed p-5 sm:p-6 rounded-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: "rgba(255,85,0,0.18)" }}>
                  <span className="label-mono">Manufacturing · dossier</span>
                  <span className="label-mono-mute">Tooling · five-axis</span>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  {MFG_FIELDS.map(f => (
                    <div key={f.k}>
                      <p className="label-mono-mute mb-1">{f.k}</p>
                      <p className="label-mono" style={{ color: "#d4d4d4" }}>{f.v}</p>
                    </div>
                  ))}
                </div>
                <p className="label-mono-mute mt-5 pt-3" style={{ borderTop: "1px solid rgba(255,85,0,0.18)" }}>Three board revisions to date — each etched into the bottom-left corner so the unit is field-serviceable in 2046.</p>
              </div>
            </figure>

            <div className="md:col-span-7 flex flex-col gap-12">
              {MATERIALS.map((m, i) => (
                <div key={i}>
                  <span className="label-mono">{m.chip}</span>
                  <h3 className="display-headline text-2xl md:text-3xl mt-3 mb-4">{m.title}</h3>
                  <p className="body-prose">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HERO STAGE: original device (sections 3 & 4 — DO NOT TOUCH) */}
      <div className="hero-stage">
        <main className="device-casing brushed-texture w-full max-w-[340px] md:max-w-4xl rounded-[30px] p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 transition-all">

          <section className="flex flex-col gap-6 w-full md:w-1/2">

            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-[#555] flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#333] rounded-full"></div>
                </div>
                <span className="font-black tracking-tighter text-xl text-[#333] opacity-90">ANALOG<span className="font-light">UI</span></span>
              </div>
              <div className="engraved text-[10px] tracking-[0.2em] font-bold">MODEL-808</div>
            </div>

            <div className="lcd-container w-full h-48 rounded-md border-4 border-[#556655] relative group cursor-pointer" id="mainScreen">
              <div className="lcd-grid absolute inset-0 z-10 w-full h-full"></div>
              <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]"></div>

              <div className="lcd-content relative z-0 p-4 h-full flex flex-col justify-between">
                <div className="flex justify-between text-xs opacity-70 font-bold uppercase">
                  <span>FM STEREO</span>
                  <span>BAT: FULL</span>
                </div>

                <div className="flex flex-col items-end mt-2">
                  <div className="text-xs mb-[-5px] opacity-60">FREQUENCY</div>
                  <div className="text-5xl md:text-6xl font-normal tracking-wider flex">
                    <span>104.</span><span className="text-4xl mt-3">5</span><span className="text-xl mt-6 ml-2">MHz</span>
                  </div>
                </div>

                <div className="flex items-end gap-[2px] h-10 opacity-80">
                  {spectrumBars.map((h, i) => (
                    <div key={i} className="w-2 bg-[#1a2a1a] animate-pulse" style={{ height: `${h}%`, animationDelay: `${spectrumDelays[i]}ms` }}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 bg-[#ccc] p-3 rounded shadow-inner border border-white/50">
              {transportBtns.map(b => (
                <button key={b.label} className={`btn-rect h-10 ${b.extra}`}>{b.label}</button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 mt-1">
              <div className="engraved text-[10px] font-bold">POWER</div>
              <div className="led on" id="powerLed"></div>
              <button id="powerBtn" type="button" className="w-8 h-8 rounded bg-[#333] shadow-[0_4px_0_#000,0_5px_5px_rgba(0,0,0,0.5)] active:translate-y-[4px] active:shadow-none transition-all border border-gray-600"></button>
            </div>

          </section>

          <section className="flex flex-col w-full md:w-1/2 gap-6 relative">

            <div className="absolute left-[-24px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#999] to-transparent hidden md:block"></div>

            <div className="flex justify-between items-center px-2 md:px-6">
              {eqBands.map(b => (
                <div key={b.label} className="flex flex-col items-center gap-3">
                  <div className="slider-slot bg-[#222] rounded-full shadow-[inset_1px_1px_5px_black] border border-white/10 p-1">
                    <input type="range" min="0" max="100" defaultValue={b.value} className="fader vertical-range" />
                  </div>
                  <span className="printed text-xs font-bold tracking-wide">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#ccc]">
              <div className="flex flex-col items-center gap-2">
                <button className="btn-round w-16 h-16 flex items-center justify-center text-[#d4d4d4] active:text-[#ffaa00] transition-colors group">
                  <svg className="w-6 h-6 ml-1 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
                <span className="engraved text-[10px] font-bold">PLAY / PAUSE</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#aaa]"></div>
                  <div className="absolute inset-[-10px] rounded-full flex items-center justify-center">
                    <div className="w-full h-full rounded-full border border-transparent" style={{ background: "repeating-conic-gradient(#bbb 0 1deg, transparent 1deg 30deg)", opacity: 0.5 }}></div>
                  </div>

                  <div className="knob-base w-24 h-24 z-10" id="volumeKnob" style={{ transform: "rotate(-135deg)" }}>
                    <div className="knob-cap"></div>
                    <div className="knob-indicator"></div>
                  </div>
                </div>
                <span className="printed text-xs font-bold mt-2">MASTER VOL</span>
              </div>
            </div>

          </section>

        </main>
      </div>

      {/* SECTION 5: CATALOG · 14 instruments — paused-on-hover marquee (AFTER existing device) */}
      <section className="editorial-band py-24 lg:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="num-chip">DETAIL · 05</span>
            <span className="label-mono-mute">Catalog · 14 instruments · Lifetime edition</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="display-headline text-4xl md:text-5xl leading-[1.05] max-w-2xl">A small house of fourteen instruments. The MODEL-808 is one of them.</h2>
            <p className="body-prose max-w-md">Across the studio's seven years we have shipped fourteen objects total, eleven of which are still serviced from the workshop. Hover the strip to pause it; each card is a unit you can read about in the archive section of this catalog.</p>
          </div>
        </div>

        <div className="marquee-wrap">
          <div className="marquee-track">
            {catalogTwice.map((c, i) => (
              <article key={i} className="catalog-card" aria-hidden={i >= CATALOG.length ? "true" : undefined}>
                <div className="catalog-img-wrap">
                  <img src={c.img} alt={i >= CATALOG.length ? "" : c.alt} />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <span className="label-mono">{c.tag}</span>
                  <h3 className="display-headline text-lg">{c.title}</h3>
                  <span className="label-mono-mute">{c.edition}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: IN THE ROOM — half-bleed image (NOVEL #7) */}
      <section className="editorial-band-soft py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="flex flex-col gap-8 order-2 md:order-1">
              <div className="flex items-center gap-3">
                <span className="num-chip">DETAIL · 06</span>
                <span className="label-mono-mute">In the room · A field test</span>
              </div>
              <h2 className="display-headline text-4xl md:text-5xl leading-[1.05]">Six weeks under a Klein &amp; Hummel monitor pair.</h2>
              <p className="body-prose">In Bjørn's Oslo cellar studio, the ANALOG_UI sat for six weeks under a Klein &amp; Hummel monitor pair, fed from a Studer A80 quarter-inch tape machine that has lived on the back wall since 2009. We did the unit's final voicing in this room — not on a workbench, not in an anechoic chamber. The argument was that an audio device that does not survive a long sitting in a real listening room with a real signal chain is not a finished device. The monitors are forty-two years old. The tape machine is older than the monitors. The MODEL-808 had to sit between them and not embarrass itself, and on the morning of the eighteenth of February it stopped doing so.</p>
              <p className="body-prose">The brass mesh, which we had to re-spec twice, was the final correction the room asked for: at 8 kHz the 1.4 mm cell pitch was producing a faint comb-filter notch we could only hear under the monitors, never on headphones. We took the unit apart on the floor of the room, swapped the grille for a 1.2 mm pitch, and did not put the chassis back together for nine days while we listened to the difference on a sequence of test recordings — Sami throat-singing, a Sibelius string-quartet pressing from 1962, a Mark Hollis vocal that we have used as a reference in this room since 2011. The unit you see is the unit the room agreed to.</p>
              <blockquote className="editorial-quote text-xl md:text-2xl border-l-2 border-[#ff5500] pl-6 mt-2">"It is not finished until the room agrees with it. Most of our work happens in the listening — not at the bench."</blockquote>
            </div>

            <figure className="order-1 md:order-2 md:half-bleed-right relative">
              <div className="relative overflow-hidden bg-black aspect-[4/5] md:aspect-[3/4]">
                <img className="w-full h-full object-cover" style={{ filter: "grayscale(1) contrast(1.15)" }} src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=85&auto=format&fit=crop" alt="Brutalist cellar studio with monitor pair — field-test environment" />
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "rgba(255,85,0,0.06)", mixBlendMode: "overlay" }}></div>
                <span className="absolute bottom-6 left-6 num-chip bg-black/70 backdrop-blur-sm">CELLAR · OSLO · 18.02</span>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* SECTION 7: SPEC SHEET — 6/12 + 6/12 (with companion photo) */}
      <section className="editorial-band-deep py-24 lg:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <span className="num-chip">DETAIL · 07</span>
            <span className="label-mono-mute">Spec sheet · MODEL-808</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-7">
              <h2 className="display-headline text-3xl md:text-4xl mb-8 leading-tight">Everything we will tell you, on one card.</h2>
              <dl className="panel-brushed p-6 md:p-8 spec-list">
                {SPEC_ROWS.map((row, i) => (
                  <div key={i} className="spec-row">
                    <dt>{row[0]}</dt>
                    <dd>{row[1]}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="md:col-span-5 relative md:mt-16">
              <div className="relative panel-brushed p-3">
                <div className="relative overflow-hidden aspect-[3/4] bg-black">
                  <img className="w-full h-full object-cover" style={{ mixBlendMode: "multiply", filter: "contrast(1.2) brightness(1.1) saturate(0.95)" }} src="https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1200&q=85&auto=format&fit=crop" alt="MODEL-808 chassis on black studio backdrop" />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "rgba(255,85,0,0.05)", mixBlendMode: "overlay" }}></div>
                </div>
                <div className="flex items-center justify-between pt-3 px-1">
                  <span className="label-mono">Plate · 07</span>
                  <span className="label-mono-mute">Studio backdrop · 24 × 36 medium-format</span>
                </div>
              </div>
              <span className="absolute -top-3 -right-3 num-chip bg-[#0e0e0e]">SERIAL · 808-117</span>
            </figure>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ — 8 entries */}
      <section className="editorial-band-deep py-24 lg:py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="num-chip">DETAIL · 08</span>
            <span className="label-mono-mute">Frequently asked · Eight questions</span>
          </div>
          <h2 className="display-headline text-4xl md:text-5xl leading-[1.05] mb-14">Eight things people ask. Eight straight answers.</h2>

          <div>
            {FAQS.map((f, i) => (
              <details key={i} className="faq-row" open={f.open || undefined}>
                <summary>
                  <h3 className="display-headline text-xl md:text-2xl">{f.q}</h3>
                  <span className="faq-glyph">+</span>
                </summary>
                <p className="body-prose faq-answer">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
