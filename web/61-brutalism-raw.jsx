export default function T61BrutalismRaw() {
  const navItems = [
    "[00_Index]",
    "[01_Install]",
    "[02_Structure]",
    "[03_Modules]",
    "[04_Legacy]",
    "[05_Help]",
  ];

  const sysInfo = [
    { k: "BUILD:", v: "#492A", bold: true },
    { k: "SIZE:", v: "402KB" },
    { k: "LICENSE:", v: "MIT" },
    { k: "AUTHOR:", v: "@ROOT" },
  ];

  const docs = [
    { n: "01", title: "Getting Started", desc: "Essential setup instructions for Linux and BSD environments. Includes dependency mapping and compilation flags." },
    { n: "02", title: "Core Concepts", desc: 'Understanding the directory structure, immutable data patterns, and the "Raw Text" philosophy.' },
    { n: "03", title: "API Reference", desc: "Complete list of endpoints, response codes, and error handling protocols." },
    { n: "04", title: "CLI Tools", desc: "Command line arguments for batch processing and automated documentation generation." },
    { n: "05", title: "Plugins", desc: "Community extensions for syntax highlighting, PDF export, and LaTeX conversion." },
    { n: "06", title: "Troubleshoot", desc: "Common segmentation faults, memory leaks, and how to report bugs to the maintainers." },
  ];

  const sysReqRows = [
    { component: "Processor", min: "x86 300MHz", rec: "x64 1GHz" },
    { component: "Memory", min: "64MB RAM", rec: "512MB RAM" },
    { component: "Storage", min: "10MB HDD", rec: "SSD" },
    { component: "OS", min: "Linux 2.4+", rec: "Linux 5.0+" },
  ];

  const changelog = [
    { date: "[10-22]", entry: "Refactored grid logic for mobile viewports." },
    { date: "[10-20]", entry: "Removed decorative CSS. Added Times New Roman." },
    { date: "[10-15]", entry: "Fixed memory leak in parser.c" },
    { date: "[10-01]", entry: "Initial stable release." },
  ];

  const mirrors = ["US_East (Virginia)", "EU_West (Dublin)", "Asia_Pacific (Tokyo)", "FTP Archive (Slow)"];

  const footerCols = [
    { title: "PROJECT", links: ["About", "Manifesto", "Sponsors"] },
    { title: "LEGAL", links: ["Privacy", "Terms", "License"] },
  ];

  const headlineStats = [
    { label: "DOWNLOADS", value: "128,442", sub: "+1.4k · 24h", accent: true },
    { label: "CONTRIBUTORS", value: "47", sub: "across 11 nations" },
    { label: "LAST_BUILD", value: "04:18:22", sub: "UTC · today" },
    { label: "STARS", value: "★ 12.4k", sub: "forks · 892" }
  ];

  const plates = [
    { id: "PLATE_001", file: "circuit.jpg", desc: "[ TRACES // 320×320 ]", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop", alt: "Macro photograph of a green circuit board", filter: "grayscale contrast-125 brightness-90" },
    { id: "PLATE_002", file: "form.jpg", desc: "[ CONCRETE // FACADE ]", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=85&auto=format&fit=crop", alt: "Brutalist concrete architectural facade", filter: "grayscale contrast-125 brightness-95" },
    { id: "PLATE_003", file: "rack_42u.jpg", desc: "[ MIRROR // EU_WEST ]", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=85&auto=format&fit=crop", alt: "Server rack with status LEDs", filter: "grayscale contrast-125 brightness-90" },
    { id: "PLATE_004", file: "spec.jpg", desc: "[ ANNOTATED // V1.0 ]", img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=85&auto=format&fit=crop", alt: "Technical drafting drawings on graph paper", filter: "grayscale contrast-125 brightness-95" }
  ];

  const tenets = [
    { n: "01", title: "No JavaScript.", body: "If a feature requires JS to be readable, it is not a feature. It is a regression." },
    { n: "02", title: "No Cookies.", body: "Reading should not require an exchange of identity. The reader is anonymous, by default." },
    { n: "03", title: "No Tracking.", body: "We do not measure what we do not need to know. The server log records 200s and 404s. Nothing more." },
    { n: "04", title: "Print Tested.", body: "Every page renders cleanly on A4 / Letter. The web should also live on paper." },
    { n: "05", title: "Public Domain by Default.", body: "Documentation belongs to the people who read and write it. Not to a vendor." }
  ];

  const contributors = [
    { initials: "@R", bg: "bg-web-blue", color: "text-white", name: "@ROOT", role: "Maintainer · since 1999", count: "1,284" },
    { initials: "MK", bg: "bg-web-purple", color: "text-white", name: "Maya K.", role: "Core · parser.c lead", count: "412" },
    { initials: "HN", bg: "bg-black", color: "text-white", name: "Hiroshi N.", role: "i18n · 7 locales", count: "298" },
    { initials: "EB", bg: "bg-alert-yellow", color: "text-black", name: "Eimear B.", role: "CLI tools", count: "187" }
  ];

  const configJson = `{
  "site_name": "MANUAL_v1",
  "render_engine": "raw_html",
  "cache_duration": 3600,
  "features": {
    "javascript": false,
    "images": false
  }
}`;

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    colors: {
      'win-gray': '#C0C0C0',
      'web-blue': '#0000EE',
      'web-purple': '#551A8B',
      'alert-yellow': '#FFFF00',
    },
    fontFamily: {
      serif: ['"Times New Roman"','Times','serif'],
      mono: ['"Courier New"','Courier','monospace'],
      sans: ['Arial','Helvetica','sans-serif'],
    }
  } }
};`;

  const customCss = `body { background-color: #0a0d0a; color: #000000; position: relative; }
.binary-digits {
  position: fixed;
  inset: 0;
  color: #22ff44;
  opacity: 0.2;
  font-family: 'Courier New', Courier, monospace;
  font-size: 11px;
  line-height: 1.15;
  white-space: pre-wrap;
  word-break: break-all;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  padding: 8px;
}
@keyframes hacker-line-cycle {
  0%   { opacity: 0; transform: translateX(-4px); }
  6%   { opacity: 1; transform: translateX(0); }
  92%  { opacity: 1; transform: translateX(0); }
  98%  { opacity: 0; }
  100% { opacity: 0; }
}
.hacker-line {
  opacity: 0;
  animation: hacker-line-cycle 6s linear infinite;
  animation-delay: var(--d, 0s);
}
@keyframes hacker-blink { 50% { opacity: 0; } }
.hacker-cursor { animation: hacker-blink 1.05s steps(2) infinite; }
@media (prefers-reduced-motion: reduce) {
  .hacker-line, .hacker-cursor { animation: none; opacity: 1; }
}
a { text-decoration: underline; color: #0000EE; cursor: pointer; }
a:visited { color: #551A8B; }
a:hover { background-color: #0000EE; color: #FFFFFF; text-decoration: none; }
a:active { color: #FF0000; }
.win95-border { border: 2px solid; border-color: #FFFFFF #808080 #808080 #FFFFFF; background-color: #C0C0C0; }
.btn-brutal {
  background-color: #C0C0C0;
  border-top: 2px solid #FFFFFF;
  border-left: 2px solid #FFFFFF;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  display: inline-block;
  text-decoration: none;
  color: black !important;
  cursor: pointer;
}
.btn-brutal:active {
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  border-right: 2px solid #FFFFFF;
  border-bottom: 2px solid #FFFFFF;
  transform: translateY(1px);
}
hr { border: 0; border-top: 2px solid #000000; margin: 0; height: 0; }
::-webkit-scrollbar { width: 14px; height: 14px; }
::-webkit-scrollbar-track { background: #e0e0e0; border: 1px solid black; }
::-webkit-scrollbar-thumb { background: #C0C0C0; border: 1px solid black; box-shadow: inset 1px 1px white, inset -1px -1px gray; }
.hatch-pattern {
  background-image: linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000);
  background-size: 4px 4px;
  background-position: 0 0, 2px 2px;
  opacity: 0.1;
}
.list-square { list-style-type: square; }
.manifesto-frame { view-timeline-name: --manifesto; view-timeline-axis: block; }
.scroll-invert-container {
  animation: container-negative linear both;
  animation-timeline: --manifesto;
  animation-range: cover 15% cover 95%;
  will-change: filter;
}
@keyframes container-negative {
  0%   { filter: none; }
  45%  { filter: none; }
  55%  { filter: invert(1) hue-rotate(180deg); }
  100% { filter: invert(1) hue-rotate(180deg); }
}
@media (prefers-reduced-motion: reduce) {
  .scroll-invert-container { animation: none; }
}
.file-header-img { filter: grayscale(1) contrast(1.4) brightness(1.05); }`;

  const initScript = `function updateTime(){
  var now = new Date();
  var timeString = now.toLocaleTimeString('en-US', { hour12: false });
  var dateString = now.toISOString().split('T')[0];
  var el = document.getElementById('clock');
  if (el) el.innerText = dateString + ' ' + timeString;
}
setInterval(updateTime, 1000);
updateTime();`;

  return (
    <>
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="font-serif text-base leading-snug antialiased min-h-screen flex flex-col items-center py-0 md:py-8">
        <pre aria-hidden="true" className="binary-digits">{`00101111 01001001 01100100 01100011 11011001 01000001 00110001 01110110 11000100 11111011 00001000 00111000 10000100 11010100 10111111 10100000 00001011 01100000 00100100 10110011 01010100 10000011 00010000 00111111 01101100 01100001 10111001 00111101 11011100 10011101 00100100 11111101 00010001 00010110 01011100 10101001 01011111 01110000 11110110 11000011 00000000 11110111 00100101 11101011 01010101 11010001 00101011 11100001 01110010 01011100 10111100 10001100 00001111 01000010 11101010 10101101 01111000 11101101 01111000 00101000 10001010 10100001 11001111 10000100 11001101 00010000 00010000 10110000 00011000 01101001 10101011 01101100 10110100 10001001 01111110 10011011 01100101 01001111 00010011 11111111 01110001 11011111 11100011 11001111 01000011 11110000 11011111 01101111 00111110 11110101 00000100 11011001 01010010 11001001 11000011 10011011 01100101 10110111 01110011 01001001 00101100 10101100 00010101 11001010 01011001 11101110 00011100 11010110 01110111 11010000 00111101 11010011 10100010 00000000 01001111 00110100 11011000 00110011 10010010 10100011 01000010 00000111 11110010 10110000 01111001 01111001 11110110 10101011 01100000 10100111 00110011 11100001 11000110 11101010 10000101 11111011 10011110 01110010 00101011 10010111 01011110 11110010 00010110 00101111 00011111 00101001 11011111 11111001 00010011 11001110 11100111 00000101 00100111 00010001 11011100 10100001 00010101 11111110 01100010 10001111 11011011 10110011 01000111 00110011 01011011 11110001 01000111 11110110 10110101 10100111 10101110 10000000 01010111 11110100 10111110 00110001 11001001 11011110 01110001 00101000 00101000 01110101 10110111 11010001 00101010 00010111 01101001 10010100 10110110 00100011 00111110 10011010 01011101 00010001 01010011 11110111 01010001 11001100 11111110 11011110 01111100 00100000 10101000 00111111 10111001 10101110 01011000 00110101 00110010 10010100 10100011 11001011 00100010 01101010 10111000 11000100 01100111 01011111 01101110 00001001 00100111 00100011 01011100 01110110 01110010 00010101 01100000 10110111 11001011 01011101 11010110 11010100 01100000 00001010 01111111 11111001 11011101 11010001 00111101 11001101 10110101 00100101 11111011 10110110 01000111 10011000 11100000 11000101 00101011 01000011 00111010 01110101 11010100 01010101 01111101 10110001 10101111 01010100 11011010 00111011 01110000 00100001 11111011 00100110 10010011 10001000 11111001 10111111 00110110 11100010 00111101 10101000 00010001 10001101 00011111 00010001 10011010 11101001 01101001 11011011 00101010 10011010 00011011 01010100 00111100 01110100 11001001 01111010 01011110 11110000 10110110 00101100 00000001 01101111 10000101 11100001 10001100 00010101 11101010 10000100 11100100 01010010 11011001 11100111 01011001 00001001 00110111 11000010 11101110 10011111 01000110 10111100 11011111 00010001 01001011 00110001 10111011 01010011 01111101 10000100 01001101 11011101 11001010 10001011 11111101 11110111 01011111 10001111 00100011 11100000 11001001 11101010 11000001 01011011 00001000 00100011 11111000 11101011 00011101 11011001 10000010 10011110 11010000 11110011 00011111 10100001 00000010 11110101 01010000 11001001 00100110 10010000 01100010 00011110 01101000 01111010 00011110 01100101 10101100 11000000 01000000 10001101 11110111 00010010 11110101 10010011 11011000 10101111 11001001 01101010 11110001 00101010 10010011 00110110 11000100 01111110 10100110 11001000 00010011 00000000 01000101 10000010 10000111 00010011 00001010 11100110 01010110 01101010 01101111 10100110 01101000 11011100 11111010 01110000 01001100 00111001 10000010 10111111 10011111 11001110 11110100 00100011 11101011 01101000 11101010 01011001 01000001 10010000 01000111 01111100 11011011 00011000 11011110 10011111 11110111 11001100 01101100 10011101 10010100 10001011 01101010 10110011 00011010 11000100 11011111 10010000 01000001 11011110 00100100 11111101 10000011 11011010 10010011 01111101 00111100 00010111 00000010 01100110 01010011 00001111 00111110 11011101 01011011 10011110 01010101 10111001 01011011 00011001 00101011 11010101 11011001 00101000 11011110 11010011 10001001 00101110 11010101 00111011 00101000 00011111 10111001 11011111 01100110 10111110 01011101 00100000 10011010 11010110 11111000 10011000 11011100 11111101 00000101 00101010 00101110 10101100 00000111 10010011 00110001 00010010 11100100 01110110 01111101 00001000 10110101 00101010 10011011 11001010 01011100 00011001 00100111 01010010 11000000 11010111 11101101 11101100 01111011 11000110 01110000 10111100 00000100 00010001 00000100 01101011 00001110 00111100 10110000 01000001 11111010 00100010 01010000 11111010 11100000 11111101 11101010 01101001 01001110 11101110 00010110 11100111 10001010 10011110 00010001 01111011 11011001 10101010 01010011 00111111 00010101 00011001 01100010 10001000 00000011 10100110 01010110 01011101 00100000 10101000 11111001 11111110 11000011 10100001 01111000 00000011 01101001 01011111 11011101 11001110 01001101 00001110 01100100 11010001 10011001 01010000 10011111 00000110 01001110 10010000 00100110 01011011 10101000 00110010 11111100 01100100 00100000 00011000 10001101 01000001 10111100 10001101 11101100 11110100 00100011 01111011 01111001 01101101 10101011 00101011 01111100 00111010 01110101 11111111 00100101 00010011 11010101 01110110 10110101 01010111 00110010 00011000 01011110 01000100 11000001 10011111 10111001 10110100 00001010 10100100 10010010 01101010 01000000 01011100 10001101 01101110 10001001 01000000 01100011 11001110 11100000 10100110 01001100 11001001 11110001 01000001 10110011 01010101 01010010 00110101 11001001 10010000 11010101 10011011 01100111 01001001 01110101 11001001 01011100 00100001 10100001 10101100 10110100 00100111 11001000 11101000 01011100 01011011 10111001 01111000 10000111 01010000 10101011 10101101 00000001 00110000 01110000 01101001 01100000 00110100 01110011 01111011 01001111 00000100 10011100 00100010 00010001 01110000 00011011 00100010 00001111 11100111 10111010 01101011 10000011 10101111 01100000 11100011 00010101 00001001 11001101 00110000 01110001 11110010 01110000 10110110 11000111 11100100 10111011 11010110 11000100 11100001 11001111 11110110 00001001 10101001 10100000 10100111 10100101 11110000 00101001 10000100 11001111 11010001 10101110 11011000 00110111 10111111 10111010 11000110 10101101 11100000 00011100 11011100 11000111 01011111 10000101 10101111 11100110 11111110 10100001 11010011 01010001 01111010 00000111 00001011 10011000 10010001 00000100 11100001 00111100 10111010 10010101 00101011 11111110 10001001 00001101 11001100 01111011 00111011 01110100 01101111 10111000 10001101 10010000 10011011 01111011 00001001 00000110 01011101 11101101 01111111 01011000 11111000 10100010 10000011 10111000 11011010 00010101 11011101 01011110 01111010 00010001 00100101 00000011 01101101 11100101 00110001 00010101 10110100 00101110 00110101 01011001 11001000 10001101 01000100 01010011 01110010 01011001 00011010 10110110 10001101 10001110 11000111 00100100 10010011 10011000 10010001 11010111 10001000 10001110 11111110 00000000 00011111 11100000 11000011 10110101 11110001 00101001 11110010 11110010 11010110 10011110 01111010 01101000 01110001 10111001 10001110 11000001 11100000 11101101 01000011 11110010 01001011 01011110 01101101 01100011 11100100 00101001 10000011 00101101 00110010 00000110 11000000 11011111 00011010 01110010 10000010 10001010 01111000 00101101 01001000 01001001 11100100 01011011 00011101 10001100 11000101 01011110 01110100 10000111 00110111 01011110 10010111 00010101 00011001 00100011 10001011 10110111 00001100 11110100 01100101 01010001 10100011 11010010 11110100 01001011 11111000 11100111 00001011 11100000 10000101 01111010 01001011 00101111 01011101 11111001 01001010 01010100 00000001 00110010 00110111 00001001 01110101 01100101 01101101 11101010 01000111 01111111 10000100 10000000 00000100 00010101 00101011 11011111 01100110 11101001 11101010 01000100 10100101 11110001 01101000 11110111 10100001 00001011 10101001 11101110 01111100 11111011 11101010 10011100 11000011 11000000 10111100 11000000 11111010 01100111 01111110 10101100 00011110 00101101 00111000 11111100 00111000 10110101 10101100 01110100 00100011 00101011 11011010 11011001 01100001 01111000 01110010 01111101 00111011 00011010 10001111 10010010 11101111 00001100 01101011 11101000 10000010 10101111 00100000 11101011 11111100 11101101 00000101 00100000 00000111 00110110 10010100 00001111 00010101 00111110 11001101 11111101 11101111 10111101 01010111 01101101 10001100 00100101 01100011 01101110 11101111 00111010 01110101 00000101 11000011 10010100 10101001 11011110 01010010 01000011 00001010 01100001 10100011 11010011 01100111 01100001 11000100 10101100 00011111 01010000 01100001 00001100 11000111 01011011 01110010 01111101 00010011 10100101 01100011 10110110 11011111 00101010 10010111 00101010 01101100 01100110 01010010 10100110 10100111 00101110 01000101 11111000 01010011 01010100 11101101 01000100 01100100 11101010 01100101 11001110 00000001 00111101 11111001 00100010 10100010 11001111 11110001 11111000 01101111 10111100 11101011 11101110 10110101 11001001 11001111 11001000 11000101 00010011 11100110 11101110 01101100 00011111 10000101 00101111 01001100 01110010 01010010 11000011 11011110 11111101 10011011 01111011 10000001 11100011 01010110 11111101 11110111 00110010 10101111 11010010 10101001 01111010 01010000 00010000 01000011 01010111 01010110 11110000 01101000 01001110 10111011 00111010 11101000 00011111 10111110 00110100 11111110 11110000 00011110 11101100 11010000 10000101 00101000 10101111 01110101 11101111 00010000 11001011 00011101 10100011 01100011 01101100 01011111 11111101 01100101 11110100 01011110 11000111 10111101 11000011 01011010 11000010 11100000 10000110 10001000 01111111 11101010 01101010 10001111 10010100 10000001 00110101 00110100 01001111 00010111 10110001 10110010 10011011 10011100 10101000 11011111 01000101 10111101 11111110 00111000 10101111 01101100 00000000 10110101 11111111 10010100 11011011 10111000 11100110 10000111 10000001 11000110 00100001 10100111 10011100 00000111 01100011 11000010 10101000 10001101 00011001 11111110 00110110 10110100 01010001 10001010 01000000 01101001 01000011 10110000 01010111 10001011 00110000 00000101 10010011 00100111 11100000 10111010 00000010 00111111 10001111 01110011 10101100 01010110 10101000 11010101 11000011 01101011 01100011 10111101 11110011 10010111 11000011 01110101 10101000 01101010 10111011 10011101 10010111 11000110 10011111 10101011 11000111 10001000 00011110 00001010 00000001 11110100 11101101 10100111 11110100 00001011 10111010 10100111 01110110 01101010 11010100 10101001 00011110 01010111 01111101 00001100 01001101 11111001 11111001 00110001 10011111 01111000 00000011 00010001 11111010 00111100 11101101 11100110 11111110 01001111 10110011 11101100 10011100 11110100 10110001 11110001 11111001 01011111 00010011 11011000 01111100 11101101 11111111 00010111 01111111 01110101 10100000 11111011 10111110 11010001 01000111 10111100 10110101 00100101 11011010 00011000 10111101 10011001 10011011 11010000 01101101 10101110 01101100 00111010 11000111 11111101 11111110 00100100 10111100 10101101 10110000 11011001 00011100 00010111 01001011 10000010 10100111 00110000 10011011 00100011 10011111 11111101 11110011 00100110 10001000 01000010 11011011 00101000 10010010 11011001 00000100 01111001 01111101 10100010 00001000 01101011 01110111 11011110 10101100 10011011 01111010 00111110 01010001 10011111 11010011 10101101 01011101 00000110 01010010 11010110 10000011 00100110 10100000 00011000 01010001 10000001 11100001 10100100 11001011 11001001 11001111 00001000 00110010 11011111 00101100 10111111 01110000 00110101 10001111 11011110 11100100 01000111 11011100 10001000 10011010 10111010 00000011 11100011 10100101 01111001 10110001 00110011 10011101 10101000 11000111 01000010 10001111 00110001 11101110 01000010 10100111 10000110 01011111 00000110 10000100 10110001 00011101 01000101 01011100 11000110 11110100 01000011 01011011 10001010 00000110 10110010 11011001 01000111 11101010 01111001 11000000 10010110 10100100 00100101 10111000 10010001 11111000 10101011 11101000 10011111 00110001 01110010 10101111 10101111 10101010 00111110 10101100 11011100 10010010 10010101 11001101 00001010 10110111 01000001 11111000 11000000 00100110 11010011 00100111 10100101 10010110 11111110 01101001 10111110 00001001 00000000 01000010 01011100 10010110 00100111 11100011 01101100 10000010 10101010 01101010 01110001 11011001 10110110 11001101 11111011 01111101 00110100 11110000 01000101 11000110 10101110 00010011 10011100 00001011 00110010 10100001 00010111 00100011 10010101 01110100 10000000 01000110 01010110 11110110 11010010 10100011 11110111 10111101 01101101 10010000 00001100 00101000 11001110 10001000 11001110 01000100 11001010 11000000 11011111 11101110 11000111 11111000 00110011 10001101 00111111 01011111 00110110 01100101 01100101 00101010 11100110 00111010 11011111 10001101 11111001 10001110 10010000 11101011 01000110 11011001 10101100 01111100 11000010 11010101 11111000 00010001 00010111 10110000 10111100 01011110 10110111 00000110 11101111 10101110 11100101 10101000 11111101 01000011 01111001 11110010 11101000 01001001 11011000 00100101 10101010 10011111 11000000 11001110 11010000 01101111 10000011 00101000 10111101 00101000 10101111 11001110 10010010 01000110 00011000 10110110 00100011 10000001 00001011 00010010 11011000 00110011 11001000 01111100 11110001 01101011 01111100 10110010 11111010 11010100 00001110 00110010 11011110 11011000 10001110 01111100 11111010 11111111 01100110 01101001 10000110 01001000 01101000 00010000 01011000 10000011 00111100 00010111 11101001 11011010 01101100 01110011 01000100 00000110 00100110 00111010 01011000 11100001 11001110 11111110 01001101 10110011 01111101 11101111 11001000 00101100 10110010 01001001 00110100 01100011 11001110 01001101 10010001 10010101 00010100 11011011 11101010 11100101 11110010 11011001 01110001 01011011 01101111 11111110 10111000 11111001 10111011 00111100 10000110 11001101 10011101 11010100 11011001 01110000 00100000 11011001 10011111 00001010 11110010 00010010 11000101 10001000 00110101 11110111 11101011 00010011 11001111 01111010 01011101 00000011 10111010 10001010 10100101 11011101 00111011 01000100 01010100 00100101 11100111 11111011 00010001 10001111 11001110 10110001 01110110 10110100 10101111 00001100 01001111 01011010 10011000 11100001 10001111 01001010 00101001 00001111 10100000 11000110 01001101 10001010 00011011 11110110 11101110 01101110 11111011 00111011 00000010 10011001 00111001 11001011 00010010 01010101 10011100 11100110 01111100 01010100 01111010 10110000 00000111 00011101 00011001 00010000 10110111 10101111 00100100 00101011 01011111 10111110 00100101 00110000 11001010 10100100 11010011 10110101 00001111 10100101 10001111 01101000 01001001 11110111 10100100 01100101 01011011 00111011 11011101 11111010 10110000 00111110 10001011 00100011 00100010 11100100 10101111 11011110 10110100 01110101 11111011 00101010 11001110 01110010 11000111 11010000 11100111 10111000 10011100 01101110 00001001 10011101 00010111 10110011 01101001 00011111 00101011 00010001 11111000 01100100 10111001 11101100 10001011 00001001 00110000 11001110 10101111 10110111 00011111 10101011 01000001 10010001 01011100 00111100 01001101 01111111 11101001 11000110 01001011 00110100 10010000 11011110 11100110 01111010 10110100 10001000 00010000 00101000 11101001 11001111 01001101 11000111 00011110 00111110 10001000 01100110 00000011 00111010 01001100 11010100 00101101 10010010 10100011 00110000 10001011 10101110 00001011 01010010 01110010 10100011 00011000 11101011 01000000 10111010 10100001 10010011 00010100 11011001 00111100 01000000 10110010 11101110 11100000 00101000 11000001 11101100 00110000 00001101 11000111 01010101 11101000 01011110 11001010 00000100 11100010 11111111 11111101 00110111 10000011 01111100 00000010 01001100 10010111 00111001 00011011 10001100 11100001 00101010 10111100 00110001 01101011 11100001 00111010 01010110 00000111 00101011 10111100 11100111 01011010 00111111 10110110 01111010 10011111 00001010 01110100 11001001 00001100 10101001 10111100 10010010 01101001 00111010 11011101 00000100 00001111 11010111 10001011 01100111 10101000 00000010 10010110 00001100 10110110 01011100 00011010 10100111 01110100 00100010 11000001 01111010 10010000 00111111 00001101 00010011 00101101 01010110 01110101 11101001 01111100 11111101 11000001 11001000 01001110 00000001 00111010 11100000 11000111 10001010 11111010 10001001 11001011 01001110 00011100 11101101 10000000 00111100 00110000 00110101 11010101 00100111 11111111 10011101 11100100 01011111 11010111 10111000 11010011 00001000 11100100 00100010 00000000 11001111 00101011 01110010 11011101 00000000 10100100 01100001 00110000 00101000 10010000 01010100 10000100 00110001 00110111 01111110 11001110 00000110 10001001 10010100 11111100 11001100 10111010 10111110 01110010 01101011 01001001 01010001 10001111 10010111 00011010 00001111 11111100 11101110 00000001 01011111 00110010 00101100 01010010 00111010 01010110 00101010 00011101 00100111 10001110 10100110 00111111 11110000 00001111 01011100 01000011 00111101 00110010 11101110 10000000 10111110 01001010 10101111 01001000 00111000 10111001 10111110 00011101 00010111 11101100 11101000 00111010 10110111 01001011 11110001 11100000 11110110 11011100 01011100 10100011 11001101 10110010 01101000 10100111 01000010 10101101 10100110 01001110 00101101 10110111 11111010 00111101 01100010 11000110 11110100 01101001 11011100 01110100 10111011 01100100 01101110 10011011 01011010 01101010 00010010 11100110 10110011 10111110 00001011 11011000 11110000 10011000 00000000 01001111 11100000 01110010 10000010 00110000 10011110 00001101 00010010 01010000 01101001 11000001 11000101 01011011 11011100 11001001 00101100 01110011 10011111 11001011 10011011 10001001 01010110 00011011 11001000 10011011 10100110 00110010 11100100 00101100 11101001 11011001 00000001 11001010 00110110 01110001 10100101 01101110 01000100 10000111 10100100 11111111`}</pre>
        <div className="relative z-10 w-full max-w-[1240px] bg-white border-x-0 md:border-x-2 border-black min-h-screen shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">

          <header>
            <div className="bg-win-gray border-b-2 border-black p-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-web-blue flex items-center justify-center text-white font-bold border-2 border-black">M</div>
                <div>
                  <h1 className="font-sans font-black text-3xl md:text-4xl tracking-tighter uppercase leading-none">MANUAL_v1</h1>
                  <span className="font-mono text-xs uppercase text-gray-600">Documentation Standard 1.0.4</span>
                </div>
              </div>
              <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-4 font-mono text-xs">
                <span className="hidden md:inline">SERVER_TIME:</span>
                <div id="clock" className="border-2 border-black bg-white px-2 py-1">Loading...</div>
              </div>
            </div>

            <hr />

            <nav className="bg-white p-2 border-b-2 border-black">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm font-bold uppercase list-none">
                {navItems.map(n => (
                  <li key={n}><a href="#">{n}</a></li>
                ))}
              </ul>
            </nav>
          </header>

          <div className="bg-alert-yellow border-b-2 border-black p-2 flex items-start gap-3">
            <span className="font-bold font-mono text-xl select-none">(!)</span>
            <p className="font-sans text-sm font-bold">
              NOTICE: API v0.9 is deprecated as of 2023-11-01. Please migrate all endpoints to v1.0 immediately to avoid data loss.
            </p>
          </div>

          <section className="border-b-2 border-black grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-9 p-4 md:p-8 flex flex-col justify-center">
              <h2 className="font-serif text-5xl md:text-7xl font-bold uppercase leading-[0.9] mb-6">
                Read the<br />Manual.
              </h2>
              <p className="font-serif text-lg md:text-xl max-w-2xl mb-6">
                A raw, anti-fragile documentation framework for the post-aesthetic web.
                No JavaScript required. No cookies. No tracking. Just data in its purest form.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <a href="#" className="btn-brutal px-6 py-2 font-mono text-sm uppercase font-bold">Download .TAR.GZ</a>
                <a href="#" className="font-mono text-sm self-center hover:bg-black hover:text-white px-1">{"> View Source Code"}</a>
              </div>
            </div>

            <div className="lg:col-span-3 border-t-2 lg:border-t-0 lg:border-l-2 border-black bg-gray-100 flex flex-col">
              <div className="p-2 bg-black text-white font-mono text-xs font-bold uppercase">/SYS/INFO</div>
              <div className="p-3 font-mono text-xs flex-grow">
                <ul className="space-y-2">
                  {sysInfo.map(i => (
                    <li key={i.k} className="flex justify-between">
                      <span>{i.k}</span>
                      <span className={i.bold ? "font-bold" : ""}>{i.v}</span>
                    </li>
                  ))}
                </ul>
                <hr className="border-gray-400 my-3" />
                <div className="text-[10px] leading-tight text-gray-600">HASH: e4d909c290d0fb1ca068ffaddf22cbd0</div>
              </div>
              <div className="h-24 border-t-2 border-black hatch-pattern relative">
                <span className="absolute bottom-1 right-1 font-mono text-[10px] bg-white px-1 border border-black">NO_IMG</span>
              </div>
            </div>
          </section>

          {/* STATS STRIP */}
          <section className="bg-black text-white border-b-2 border-black grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-gray-700">
            {headlineStats.map(s => (
              <div key={s.label} className="p-4 md:p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">{s.label}</div>
                <div className={`font-sans font-black text-2xl md:text-4xl tabular-nums leading-none ${s.accent ? "text-alert-yellow" : ""}`}>{s.value}</div>
                <div className="font-mono text-[10px] text-gray-500 mt-2">{s.sub}</div>
              </div>
            ))}
          </section>

          <main className="flex-grow bg-gray-100">
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_A</span>
                Documentation Library
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-black border-b-2 border-black">
              {docs.map(d => (
                <div key={d.n} className="bg-white p-4 h-full flex flex-col relative group">
                  <div className="absolute top-2 right-2 font-mono text-xs text-gray-400">{d.n}</div>
                  <h4 className="font-bold text-lg mb-2 underline decoration-2">{d.title}</h4>
                  <p className="text-sm font-serif mb-4 flex-grow">{d.desc}</p>
                  <a href="#" className="font-mono text-xs uppercase block bg-gray-100 p-1 border border-black text-center hover:bg-black hover:text-white">{"Open File ->"}</a>
                </div>
              ))}
            </div>

            {/* SEC_B Visual Reference / Plates */}
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_B</span>
                Visual Reference
              </h3>
            </div>
            <div className="bg-win-gray border-b-2 border-black p-4 md:p-6">
              <p className="font-mono text-xs mb-4 text-gray-700">/REF/PLATES/ — image manifest, 4 of 24. ASCII alt-text below each frame.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {plates.map(p => (
                  <figure key={p.id} className="win95-border p-2">
                    <div className="aspect-square overflow-hidden border-2 border-black bg-black relative">
                      <img src={p.img} alt={p.alt} className={`w-full h-full object-cover ${p.filter}`} />
                      <span className="absolute top-1 left-1 bg-alert-yellow text-black font-mono font-bold text-[9px] px-1 border border-black">{p.id}</span>
                    </div>
                    <figcaption className="font-mono text-[10px] mt-2 leading-tight">
                      <span className="font-bold">{p.file}</span><br />
                      <span className="text-gray-600">{p.desc}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-black flex flex-col md:flex-row justify-between gap-2 font-mono text-[10px]">
                <span>// IMG_FORMAT=JPG · COMPRESSED · GRAYSCALE_BIAS=true</span>
                <a href="#" className="font-bold">[ VIEW ALL 24 PLATES → ]</a>
              </div>
            </div>

            {/* TTY HACKER TERMINAL — looped fake console feed */}
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_B&middot;1</span>
                Live Console &mdash; /var/log/uplink
              </h3>
            </div>
            <div className="bg-win-gray border-b-2 border-black p-4 md:p-6">
              <p className="font-mono text-xs mb-4 text-gray-700">/TTY/PTS/0 &mdash; tail -F. Read-only mirror, refreshed at the cadence of the kernel.</p>
              <div className="border-2 border-black bg-black overflow-hidden font-mono shadow-[6px_6px_0px_0px_#22ff44]">
                <div className="flex items-center justify-between border-b-2 border-[#22ff44]/40 px-3 py-1.5 bg-black">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-[#22ff44]"></span>
                    <span className="inline-block w-3 h-3 bg-[#22ff44]/50"></span>
                    <span className="inline-block w-3 h-3 bg-[#22ff44]/20"></span>
                    <span className="ml-3 text-[10px] uppercase tracking-widest text-[#22ff44] opacity-70">root@manual_v1:/var/log#</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#22ff44] opacity-50">PTY/0 &middot; 80&times;24</span>
                </div>
                <ol className="list-none m-0 p-3 md:p-4 text-[12px] md:text-[13px] leading-[1.55] text-[#22ff44]">
                  {[
                    { d: "0.0s", t: <><span className="opacity-60">[0001]</span> $ ssh root@manual.uplink.local</> },
                    { d: "0.4s", t: <><span className="opacity-60">[0002]</span> &gt; key_exchange: ed25519 OK &middot; rtt=14ms</> },
                    { d: "0.8s", t: <><span className="opacity-60">[0003]</span> &gt; banner: MANUAL_v1 (build 1999.08.12)</> },
                    { d: "1.2s", t: <><span className="opacity-60">[0004]</span> $ tail -F /var/log/manifesto</> },
                    { d: "1.6s", t: <><span className="opacity-60">[0005]</span> &gt; section_03 :: parsed 124 lines, 0 warnings</> },
                    { d: "2.0s", t: <><span className="opacity-60">[0006]</span> &gt; refusing to ship attention-tax in this commit</> },
                    { d: "2.4s", t: <><span className="opacity-60">[0007]</span> $ grep -c "engagement" ./manifesto.txt</> },
                    { d: "2.8s", t: <><span className="opacity-60">[0008]</span> &gt; 0</> },
                    { d: "3.2s", t: <><span className="opacity-60">[0009]</span> $ make verify-no-trackers</> },
                    { d: "3.6s", t: <><span className="opacity-60">[0010]</span> &gt; scanning ../public/* &middot; 0 third-party scripts</> },
                    { d: "4.0s", t: <><span className="opacity-60">[0011]</span> &gt; verified clean &middot; signing release</> },
                    { d: "4.4s", t: <><span className="opacity-60">[0012]</span> $ gpg --detach-sign manifesto.txt</> },
                    { d: "4.8s", t: <><span className="opacity-60">[0013]</span> &gt; signed: ROOT@manual_v1 &middot; 1024-bit</> },
                    { d: "5.2s", t: <><span className="opacity-60">[0014]</span> $ git push origin main &mdash;atomic</> },
                    { d: "5.6s", t: <><span className="opacity-60">[0015]</span> &gt; 1.0.4 published &middot; sha=a0b3c1d &middot; gz=2.4kb</> },
                    { d: "5.85s", t: <><span className="opacity-60">[0016]</span> $ <span className="hacker-cursor">_</span></> },
                  ].map((line, i) => (
                    <li key={i} className="hacker-line" style={{ "--d": line.d }}>{line.t}</li>
                  ))}
                </ol>
                <div className="border-t-2 border-[#22ff44]/40 px-3 py-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#22ff44]">
                  <span className="opacity-60">// uplink :: synchronous &middot; read_only</span>
                  <span className="opacity-60">[ ESC ] disconnect</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-black flex flex-col md:flex-row justify-between gap-2 font-mono text-[10px]">
                <span>// LIVE_FEED=mirrored &middot; LATENCY=14ms &middot; AUTH=ed25519</span>
                <a href="#" className="font-bold">[ OPEN FULL CONSOLE &rarr; ]</a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 border-b-2 border-black">
              <div className="lg:col-span-2 bg-white p-4 md:p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-black">
                <h5 className="font-sans font-black text-2xl mb-4 uppercase">System Requirements</h5>

                <div className="overflow-x-auto border-2 border-black mb-6">
                  <table className="w-full text-left font-mono text-sm border-collapse">
                    <thead>
                      <tr className="bg-win-gray border-b-2 border-black">
                        <th className="p-2 border-r-2 border-black">Component</th>
                        <th className="p-2 border-r-2 border-black">Minimum</th>
                        <th className="p-2">Recommended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sysReqRows.map((r, i) => (
                        <tr key={r.component} className={i < sysReqRows.length - 1 ? "border-b border-black" : ""}>
                          <td className="p-2 border-r border-black font-bold">{r.component}</td>
                          <td className="p-2 border-r border-black">{r.min}</td>
                          <td className="p-2">{r.rec}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h5 className="font-sans font-black text-2xl mb-2 uppercase">Configuration</h5>
                <p className="mb-2 font-serif">Edit the <code className="bg-gray-200 px-1 border border-gray-400 font-mono text-sm">config.json</code> file to set your global variables.</p>

                <div className="bg-black text-white p-3 font-mono text-xs md:text-sm overflow-x-auto shadow-[4px_4px_0px_0px_#C0C0C0]">
                  <pre>{configJson}</pre>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 flex flex-col justify-between">
                <div>
                  <h5 className="font-sans font-bold text-lg underline mb-4">LATEST_CHANGELOG</h5>
                  <ul className="font-mono text-xs space-y-3">
                    {changelog.map(c => (
                      <li key={c.date} className="flex gap-2">
                        <span className="font-bold shrink-0">{c.date}</span>
                        <span>{c.entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h5 className="font-sans font-bold text-lg underline mb-2">Mirrors</h5>
                  <ul className="list-square pl-4 font-serif text-sm space-y-1">
                    {mirrors.map(m => (
                      <li key={m}><a href="#">{m}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-win-gray border-b-2 border-black p-4 text-center">
              <div className="inline-block border-2 border-white border-r-black border-b-black p-1 bg-win-gray">
                <div className="border border-gray-500 p-2">
                  <span className="font-bold font-sans text-sm">PRO TIP:</span>{" "}
                  <span className="font-serif italic text-sm">Use key combination <span className="font-mono font-bold not-italic">CTRL+P</span> to print this manual on paper.</span>
                </div>
              </div>
            </div>

            {/* SEC_C The Manifesto */}
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_C</span>
                The Manifesto
              </h3>
            </div>
            <div className="manifesto-frame bg-white border-b-2 border-black p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <aside className="scroll-invert-container relative lg:col-span-3 border-r-0 lg:border-r-2 border-black lg:pr-6">
                {/* Background image layer — fills the entire left rail vertically */}
                <div className="absolute inset-0 lg:right-6 overflow-hidden pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop"
                       alt="" aria-hidden="true"
                       className="w-full h-full object-cover file-header-img select-none" />
                  <div className="absolute inset-0"
                       style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 6px)", mixBlendMode: "multiply" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10"></div>
                </div>

                {/* FILE_HEADER box on top, sticky */}
                <div className="relative z-10 border-2 border-black bg-gray-100 p-3 font-mono text-[11px] mb-4 sticky top-0">
                  <p className="font-bold mb-2 underline">FILE_HEADER</p>
                  <ul className="space-y-1.5">
                    <li className="flex justify-between"><span>NAME:</span><span className="font-bold">manifesto.txt</span></li>
                    <li className="flex justify-between"><span>SIZE:</span><span>2.4 KB</span></li>
                    <li className="flex justify-between"><span>VERSION:</span><span>1.0.4</span></li>
                    <li className="flex justify-between"><span>DRAFTED:</span><span>1999-08-12</span></li>
                    <li className="flex justify-between"><span>SIGNED:</span><span>@ROOT</span></li>
                  </ul>
                  <hr className="border-gray-400 my-3" />
                  <p className="text-[9px] text-gray-600 leading-relaxed">VERIFIED BY GPG. <br />Hash matches origin commit.</p>
                </div>
              </aside>

              <article className="lg:col-span-9 max-w-5xl">
                <h4 className="font-serif text-3xl md:text-5xl font-bold leading-[0.95] mb-6 uppercase">
                  Build for the<br />reader, not the<br />algorithm.
                </h4>
                <p className="font-serif text-base md:text-lg leading-relaxed mb-4">
                  <span className="float-left font-sans font-black text-7xl leading-none mr-2 mt-1">T</span>he web does not require ornament. It requires legibility. It requires durability. It requires that data, once written, remains both readable and trustworthy a decade from now — without a runtime, without a CDN, without an account.
                </p>
                <p className="font-serif text-base md:text-lg leading-relaxed mb-6">
                  We have spent twenty-five years adding chrome to a medium that was complete in 1995. MANUAL_v1 is a return to the principles that worked: hyperlinks. Plain text. Headings, paragraphs, tables. The browser as document reader. Anything more is an error introduced by us, not corrected by us.
                </p>

                <h5 className="font-sans font-black text-lg uppercase mb-3 underline decoration-2">Five Tenets</h5>
                <ol className="space-y-3 list-none mb-6 border-2 border-black bg-gray-50">
                  {tenets.map((t, i) => (
                    <li key={t.n} className={`${i < tenets.length - 1 ? "border-b border-black" : ""} p-3 flex gap-4 items-baseline`}>
                      <span className="font-mono font-bold text-2xl shrink-0 w-8">{t.n}</span>
                      <div>
                        <p className="font-bold mb-1">{t.title}</p>
                        <p className="font-serif text-sm text-gray-700">{t.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="font-serif italic text-sm border-l-4 border-black pl-3">
                  &quot;If you cannot view this in <code className="font-mono not-italic font-bold">lynx</code>, we have failed.&quot;
                  <br /><span className="font-mono not-italic text-xs">— @ROOT, commit 1a2b3c4 · 2018-04-21</span>
                </p>
              </article>
            </div>

            {/* SEC_D Maintainers */}
            <div className="border-b-2 border-black bg-white p-2">
              <h3 className="font-sans font-bold text-xl uppercase tracking-tight flex items-center gap-2">
                <span className="bg-black text-white px-2 text-sm">SEC_D</span>
                Maintainers
              </h3>
            </div>
            <div className="bg-gray-100 border-b-2 border-black grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 bg-black text-green-400 font-mono text-xs md:text-sm p-4 md:p-6 border-r-0 lg:border-r-2 border-black overflow-x-auto">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-green-700/40 text-green-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-alert-yellow rounded-full"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="ml-3 text-[10px] uppercase tracking-widest opacity-70">// terminal — git log --format=%h%an%ad%s</span>
                </div>
                <div className="space-y-2 leading-relaxed">
                  <div><span className="text-green-300">$ git shortlog -sn --no-merges</span></div>
                  <div className="text-gray-300">  <span className="text-alert-yellow font-bold">1,284</span>  <span className="text-white">@ROOT</span> &lt;root@manual.txt&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">412</span>  <span className="text-white">Maya K.</span> &lt;maya@kessler.io&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">298</span>  <span className="text-white">Hiroshi N.</span> &lt;hiro@chiba.jp&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">187</span>  <span className="text-white">Eimear B.</span> &lt;eb@dublin.ie&gt;</div>
                  <div className="text-gray-300">    <span className="text-alert-yellow font-bold">142</span>  <span className="text-white">Sasha P.</span> &lt;sash@warsaw.pl&gt;</div>
                  <div className="text-gray-300">    &nbsp;<span className="text-alert-yellow font-bold">+ 42 others</span></div>
                  <div className="pt-3"><span className="text-green-300">$ git log --since=&quot;3 days ago&quot; --oneline</span></div>
                  <div className="text-gray-300"><span className="text-alert-yellow">a4b2e1c</span> <span className="text-white">@ROOT</span> docs: clarify cache_duration default to 3600s</div>
                  <div className="text-gray-300"><span className="text-alert-yellow">9d3f817</span> <span className="text-white">Maya K.</span> fix: parser.c segfault on UTF-16 input</div>
                  <div className="text-gray-300"><span className="text-alert-yellow">2e5c4a0</span> <span className="text-white">Hiroshi N.</span> i18n: japanese localisation for /02_Structure</div>
                  <div className="text-gray-300"><span className="text-alert-yellow">f17b9d3</span> <span className="text-white">Eimear B.</span> chore: remove deprecated v0.9 endpoints</div>
                  <div className="pt-2"><span className="text-green-300">$ <span className="bg-green-400 text-black animate-pulse w-2 h-4 inline-block">_</span></span></div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 flex flex-col">
                <h5 className="font-sans font-bold text-lg underline mb-4 uppercase">Top Contributors</h5>
                <ul className="flex flex-col gap-3">
                  {contributors.map(c => (
                    <li key={c.name} className="border-2 border-black p-3 flex items-center gap-3 bg-gray-50 hover:bg-alert-yellow transition-colors">
                      <div className={`w-10 h-10 ${c.bg} ${c.color} font-mono font-bold flex items-center justify-center border-2 border-black shrink-0 text-sm`}>{c.initials}</div>
                      <div className="flex-1 min-w-0 font-mono text-xs">
                        <p className="font-bold truncate">{c.name}</p>
                        <p className="text-gray-600">{c.role}</p>
                      </div>
                      <span className="font-mono font-bold text-sm tabular-nums shrink-0">{c.count}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" className="mt-4 btn-brutal px-3 py-2 font-mono text-xs uppercase font-bold text-center">[ JOIN AS CONTRIBUTOR → ]</a>
              </div>
            </div>
          </main>

          <footer className="bg-white p-4 md:p-6 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              {footerCols.map(col => (
                <div key={col.title}>
                  <h6 className="font-bold mb-2 underline">{col.title}</h6>
                  <ul className="space-y-1">
                    {col.links.map(l => (
                      <li key={l}><a href="#" className="no-underline hover:underline">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-2 md:col-span-2">
                <h6 className="font-bold mb-2 underline">NEWSLETTER</h6>
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert("SUBSCRIBED TO DB."); }}>
                  <input type="email" placeholder="email@address.com" className="bg-gray-100 border-2 border-black p-1 w-full max-w-[200px] font-mono focus:bg-white outline-none rounded-none" />
                  <button type="submit" className="btn-brutal px-3 py-1 font-bold">OK</button>
                </form>
              </div>
            </div>

            <hr className="border-t-2 border-gray-300" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-mono text-xs text-gray-500">
                © 1999-2023 MANUAL_v1 OPEN SOURCE PROJECT. <br className="hidden md:block" />
                RENDERED IN 0.002s. NO TRACKERS.
              </p>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-mono text-xs border-2 border-black px-2 py-1 bg-white hover:bg-black hover:text-white uppercase">
                [▲ Return to Top]
              </button>
            </div>
          </footer>

        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
