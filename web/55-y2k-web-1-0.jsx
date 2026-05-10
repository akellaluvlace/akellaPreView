export default function T55Y2kWeb10() {
  return (
    <>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Courier+Prime:wght@400;700&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: {
                comic: ['"Comic Neue"', 'cursive'],
                mono: ['"Courier Prime"', 'monospace'],
                pixel: ['"Press Start 2P"', 'cursive'],
                digital: ['"VT323"', 'monospace'],
                sans: ['Arial', 'Helvetica', 'sans-serif'],
              },
              colors: {
                winGray: '#c0c0c0',
                winDarkGray: '#808080',
                winBlue: '#000080',
                webBlue: '#0000ff',
                winamp: '#1a1a1a',
              },
              boxShadow: {
                'outset': 'inset 1px 1px #dfdfdf, inset -1px -1px #000, 1px 1px 0 #000',
                'inset': 'inset 1px 1px #000, inset -1px -1px #dfdfdf, 1px 1px 0 #fff',
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-color: #000000;
          overflow-y: scroll;
        }
        .bevel-outset { border-top: 2px solid white; border-left: 2px solid white; border-right: 2px solid black; border-bottom: 2px solid black; background-color: #c0c0c0; }
        .bevel-inset { border-top: 2px solid #808080; border-left: 2px solid #808080; border-right: 2px solid white; border-bottom: 2px solid white; background-color: white; }
        .bevel-btn:active { border-top: 2px solid black; border-left: 2px solid black; border-right: 2px solid white; border-bottom: 2px solid white; transform: translate(1px, 1px); }
        .marquee-wrapper { overflow: hidden; white-space: nowrap; }
        .marquee-text { display: inline-block; animation: scroll-left 15s linear infinite; }
        @keyframes scroll-left { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        ::-webkit-scrollbar { width: 18px; }
        ::-webkit-scrollbar-track { background: #dfdfdf; border-left: 1px solid white; }
        ::-webkit-scrollbar-thumb { background-color: #c0c0c0; border-top: 2px solid white; border-left: 2px solid white; border-right: 2px solid black; border-bottom: 2px solid black; }
        .blink { animation: blink-anim 1s steps(2, start) infinite; }
        @keyframes blink-anim { to { visibility: hidden; } }
        .pixelated { image-rendering: pixelated; }
        .win-font { font-family: 'Arial', sans-serif; }
      ` }} />

      <div className="min-h-screen p-2 sm:p-4 md:p-8 flex justify-center items-start" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L22 18 L20 16 L18 18 Z' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E\"), radial-gradient(circle at 10% 10%, rgba(50, 50, 150, 0.4), transparent 40%)" }}>

        <main className="w-full max-w-6xl bg-winGray bevel-outset flex flex-col shadow-[10px_10px_0_rgba(0,0,0,0.5)]">

          <div className="bg-winBlue h-8 px-2 flex justify-between items-center select-none text-white m-1">
            <div className="flex items-center gap-2 font-bold font-sans text-sm tracking-wide">
              <img src="https://img.icons8.com/color/48/internet-explorer.png" className="w-5 h-5 pixelated" alt="IE" />
              Netscape Navigator - [COOLZONE.HTML]
            </div>
            <div className="flex gap-1">
              <button className="w-5 h-5 bg-winGray bevel-outset flex items-center justify-center text-black font-bold text-xs leading-none hover:bg-gray-200">_</button>
              <button className="w-5 h-5 bg-winGray bevel-outset flex items-center justify-center text-black font-bold text-xs leading-none hover:bg-gray-200">□</button>
              <button className="w-5 h-5 bg-winGray bevel-outset flex items-center justify-center text-black font-bold text-xs leading-none hover:bg-red-200">x</button>
            </div>
          </div>

          <header className="bg-black text-center py-6 border-4 border-double border-white mx-1 relative overflow-hidden group cursor-crosshair">
            <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26tOZ42Mg6pbTUPvy/giphy.gif')] opacity-20 bg-cover pointer-events-none"></div>
            <h1 className="relative z-10 text-4xl md:text-7xl font-bold text-yellow-300 font-comic tracking-widest drop-shadow-[4px_4px_0_#ff0000]">
              WELCOME TO<br />
              <span className="text-cyan-400 italic bg-black px-2">~*~ COOLZONE ~*~</span>
            </h1>
            <p className="relative z-10 text-white mt-3 font-mono text-xs md:text-sm tracking-widest animate-pulse">
              {"<<< BEST VIEWED AT 800x600 >>>"}
            </p>
          </header>

          <div className="bevel-inset mx-1 mt-1 bg-black text-lime-400 font-digital text-xl py-1 border-b-2 border-white">
            <div className="marquee-wrapper">
              <div className="marquee-text uppercase tracking-widest">
                +++ NEW PHOTO UPLOADED TO GALLERY +++ DON'T FORGET TO SIGN THE GUESTBOOK +++ I LOVE MATRIX +++ LISTENING TO: KORN +++ HACK THE PLANET +++
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 p-1">

            <aside className="w-full md:w-64 flex flex-col gap-3 shrink-0">
              <div className="bevel-outset p-2 text-center bg-winGray">
                <p className="font-bold text-xs mb-1 font-sans">WEBMASTER</p>
                <div className="border-2 border-winDarkGray p-1 bg-white">
                  <img src="https://api.dicebear.com/9.x/pixel-art/svg?seed=CoolZoneMaster" alt="Me" className="w-full h-auto pixelated bg-blue-100" />
                </div>
                <p className="text-[10px] mt-1 text-blue-800 font-bold">Status: ONLINE</p>
              </div>

              <nav className="bevel-outset p-2 flex flex-col gap-1.5">
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-1 text-sm font-bold font-sans">NAVIGATION</div>
                <a href="#" className="bevel-outset bevel-btn w-full py-1 px-2 flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-yellow-100 active:bg-gray-400 transition-colors">
                  <i data-lucide="home" className="w-4 h-4 text-black"></i> Home
                </a>
                <a href="#about" className="bevel-outset bevel-btn w-full py-1 px-2 flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-yellow-100 active:bg-gray-400 transition-colors">
                  <i data-lucide="user" className="w-4 h-4 text-black"></i> Who Am I?
                </a>
                <a href="#links" className="bevel-outset bevel-btn w-full py-1 px-2 flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-yellow-100 active:bg-gray-400 transition-colors">
                  <i data-lucide="link" className="w-4 h-4 text-black"></i> Cool Links
                </a>
                <a href="#guestbook" className="bevel-outset bevel-btn w-full py-1 px-2 flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-yellow-100 active:bg-gray-400 transition-colors">
                  <i data-lucide="book-open" className="w-4 h-4 text-black"></i> Sign Guestbook
                </a>
                <a href="mailto:fake@email.com" className="bevel-outset bevel-btn w-full py-1 px-2 flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-yellow-100 active:bg-gray-400 transition-colors">
                  <i data-lucide="mail" className="w-4 h-4 text-black"></i> Email Me
                </a>
              </nav>

              <div className="bg-[#292929] border-t-2 border-l-2 border-[#505050] border-b-2 border-r-2 border-black p-1 flex flex-col gap-1">
                <div className="bg-[#1a1a1a] px-1 flex justify-between items-center h-4 cursor-grab">
                  <span className="text-[8px] text-[#00ff00] font-pixel">WINAMP</span>
                  <div className="flex gap-0.5">
                    <div className="w-2 h-2 bg-gray-400 text-[6px] flex items-center justify-center leading-none">_</div>
                    <div className="w-2 h-2 bg-gray-400 text-[6px] flex items-center justify-center leading-none">x</div>
                  </div>
                </div>
                <div className="bg-black border border-gray-600 p-1 mb-1">
                  <div className="text-[#00ff00] font-digital text-xl leading-none">02:45</div>
                  <div className="text-[#00ff00] font-pixel text-[8px] mt-1 scrolling-text whitespace-nowrap overflow-hidden">
                    DARUDE - SANDSTORM.MP3 *** 128kbps ***
                  </div>
                </div>
                <div className="flex justify-between px-1">
                  <button className="text-gray-300 text-[8px]">PREV</button>
                  <button className="text-gray-300 text-[8px]">PLAY</button>
                  <button className="text-gray-300 text-[8px]">PAUSE</button>
                  <button className="text-gray-300 text-[8px]">STOP</button>
                  <button className="text-gray-300 text-[8px]">NEXT</button>
                </div>
                <div className="h-2 w-full bg-gradient-to-r from-green-900 to-green-500 rounded-full mt-1"></div>
              </div>

              <div className="bevel-inset bg-black p-3 text-center">
                <p className="text-green-500 font-mono text-[10px] mb-1">VISITORS SINCE 1999:</p>
                <div className="inline-flex border-2 border-gray-600">
                  <span className="bg-black text-red-600 px-1 font-digital text-xl tracking-widest">084921</span>
                </div>
              </div>

              <div className="bevel-outset p-2 bg-winGray">
                <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-1 mb-2 font-bold font-sans text-xs flex items-center gap-1">
                  <i data-lucide="image" className="w-3 h-3"></i> :: PIN-UP OF THE WEEK ::
                </div>
                <div className="border-2 border-winDarkGray bg-black overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=70" alt="Pin-up of the week" className="w-full aspect-[3/4] object-cover saturate-200 contrast-125 hue-rotate-[280deg] mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/20 via-transparent to-cyan-400/30 pointer-events-none mix-blend-overlay"></div>
                  <div className="absolute top-1 left-1 right-1 flex justify-between font-pixel text-[7px] text-cyan-300 leading-none">
                    <span>// IMG_0023</span>
                    <span className="blink">● REC</span>
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 bg-black/70 px-1 py-0.5 font-pixel text-[7px] text-yellow-300 text-center tracking-widest">SCANNED · 75DPI · 1999</div>
                </div>
                <p className="font-comic text-[10px] mt-2 text-center leading-tight text-black">"Saved from <u className="text-webBlue">CyberPunk.zine</u> — right-click&nbsp;OK"</p>
                <div className="flex justify-between items-center mt-1 px-0.5">
                  <span className="font-mono text-[9px] text-winDarkGray">★ ★ ★ ★ ☆</span>
                  <span className="font-mono text-[9px] text-blue-800 font-bold">42 KB</span>
                </div>
              </div>

              <div className="bevel-outset p-2 bg-winGray">
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-1 mb-2 font-bold font-sans text-xs">:: TODAY'S WEATHER ::</div>
                <div className="bevel-inset bg-white p-2 text-center font-mono text-[11px]">
                  <div className="text-3xl mb-1">☀️</div>
                  <p className="font-bold text-blue-800">CLOUDS OF DATA</p>
                  <p className="text-[10px] text-winDarkGray mt-1">56°F · light packet loss</p>
                </div>
              </div>
            </aside>

            <section className="flex-1 flex flex-col gap-4 h-full">
              <div className="bevel-inset bg-white p-4 md:p-6 overflow-y-auto h-auto min-h-[500px]">

                <div className="bg-yellow-300 border-2 border-black border-dashed p-2 mb-6 flex items-center justify-center gap-3">
                  <i data-lucide="alert-triangle" className="w-6 h-6 animate-bounce"></i>
                  <span className="font-bold font-sans text-xs md:text-sm uppercase tracking-wider">Site Under Construction - Mind the Dust!</span>
                  <i data-lucide="alert-triangle" className="w-6 h-6 animate-bounce"></i>
                </div>

                <div className="font-comic">
                  <h2 className="text-2xl font-bold text-red-600 mb-2 flex items-center gap-2 border-b-2 border-gray-300 pb-1">
                    <span className="text-3xl">🔥</span> Hi There!!! <span className="text-3xl">🔥</span>
                  </h2>
                  <p className="mb-4 text-sm md:text-base leading-relaxed">
                    Welcome to my <u className="text-webBlue cursor-pointer hover:bg-blue-200">digital soul</u>. This page is hand-coded using only the finest HTML tags. I made this site to share my love for anime, coding, and weird images I found on the web.
                  </p>
                  <div className="flex justify-center my-4">
                    <img src="https://media.giphy.com/media/Q822XAOWYMKMzfr8yL/giphy.gif" alt="Mail Animation" className="h-16 mix-blend-multiply" />
                  </div>

                  <div id="about" className="mb-8">
                    <h3 className="font-bold bg-blue-800 text-white px-2 py-1 mb-2 font-sans text-sm">:: PROFILE ::</h3>
                    <table className="w-full border-2 border-gray-400 text-sm font-sans bg-gray-100">
                      <tbody>
                        <tr>
                          <td className="border border-gray-400 p-2 font-bold bg-gray-200 w-1/3">Name:</td>
                          <td className="border border-gray-400 p-2 text-blue-800">CyberCool99</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 font-bold bg-gray-200">Age:</td>
                          <td className="border border-gray-400 p-2">Old enough to know BASIC</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 font-bold bg-gray-200">Location:</td>
                          <td className="border border-gray-400 p-2">The Grid</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 font-bold bg-gray-200">Mood:</td>
                          <td className="border border-gray-400 p-2">Hyper 🤪</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 font-bold bg-gray-200">Music:</td>
                          <td className="border border-gray-400 p-2">Techno, Nu-Metal, MIDI</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-bold bg-winDarkGray text-white px-2 py-1 mb-2 font-sans text-sm">:: LATEST NEWS ::</h3>
                    <div className="bevel-inset bg-white p-2 h-40 overflow-y-scroll font-mono text-sm bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
                      <ul className="list-none space-y-3">
                        <li className="flex gap-2">
                          <span className="bg-blue-100 border border-blue-400 px-1 text-xs font-bold text-blue-800 h-fit">Jan 22</span>
                          <span>Finally learned CSS Grid... wait, I mean Tables. Tables are forever.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-blue-100 border border-blue-400 px-1 text-xs font-bold text-blue-800 h-fit">Jan 15</span>
                          <span>Uploaded photos from the LAN party. Check the gallery!</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-blue-100 border border-blue-400 px-1 text-xs font-bold text-blue-800 h-fit">Jan 01</span>
                          <span>HAPPY NEW YEAR!!! Y2K didn't kill us!</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div id="links" className="mb-8 text-center">
                    <h3 className="text-left font-bold bg-purple-700 text-white px-2 py-1 mb-2 font-sans text-sm">:: MY WEB RING ::</h3>
                    <div className="flex flex-wrap justify-center gap-2 p-4 bg-purple-100 border border-purple-300 border-dashed">
                      <div className="w-[88px] h-[31px] border border-black bg-black flex flex-col items-center justify-center leading-none cursor-pointer hover:opacity-80">
                        <span className="text-[8px] text-green-400 font-pixel">HACKER</span>
                        <span className="text-[8px] text-white font-pixel">ZONE</span>
                      </div>
                      <div className="w-[88px] h-[31px] border border-black bg-blue-600 flex items-center justify-center cursor-pointer hover:opacity-80">
                        <span className="text-[10px] text-white font-bold italic font-serif">HTML<br />Ready</span>
                      </div>
                      <div className="w-[88px] h-[31px] border border-black bg-yellow-300 flex items-center justify-center cursor-pointer hover:opacity-80">
                        <span className="text-[8px] text-black font-bold font-comic">SMILE :)</span>
                      </div>
                      <div className="w-[88px] h-[31px] border border-black bg-gray-300 flex items-center justify-center cursor-pointer hover:opacity-80">
                        <span className="text-[8px] text-gray-600 font-mono">NO ADS</span>
                      </div>
                    </div>
                  </div>

                  <div id="guestbook" className="bg-[#eeeeee] bevel-outset p-4">
                    <h3 className="text-center font-bold text-lg mb-4 text-purple-700 font-comic flex justify-center items-center gap-2">
                      <i data-lucide="pen-tool" className="w-4 h-4"></i> Sign My Guestbook
                    </h3>
                    <form className="flex flex-col gap-3 font-mono text-sm">
                      <div className="flex flex-col md:flex-row gap-2 items-center">
                        <label className="w-full md:w-24 font-bold text-left">Name:</label>
                        <input type="text" className="bevel-inset px-2 py-1 w-full flex-1 bg-white outline-none focus:bg-yellow-50 focus:border-blue-500" />
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 items-center">
                        <label className="w-full md:w-24 font-bold text-left">E-mail:</label>
                        <input type="email" className="bevel-inset px-2 py-1 w-full flex-1 bg-white outline-none focus:bg-yellow-50 focus:border-blue-500" />
                      </div>
                      <div className="flex flex-col md:flex-row gap-2">
                        <label className="w-full md:w-24 font-bold text-left mt-1">Message:</label>
                        <textarea rows="3" className="bevel-inset px-2 py-1 w-full flex-1 bg-white outline-none focus:bg-yellow-50 focus:border-blue-500"></textarea>
                      </div>
                      <div className="flex justify-center md:justify-end gap-2 mt-2">
                        <button type="button" className="bevel-outset bevel-btn px-6 py-1 text-sm font-bold bg-winGray">Preview</button>
                        <button type="button" className="bevel-outset bevel-btn px-6 py-1 text-sm font-bold bg-winGray">Submit</button>
                      </div>
                    </form>
                  </div>

                  <div className="mt-8 text-center pb-4">
                    <p className="font-sans text-xs mb-1">Questions? Comments? Hate mail?</p>
                    <a href="#" className="text-webBlue font-bold underline font-mono text-sm hover:text-red-500 hover:bg-black hover:no-underline transition-all">
                      Webmaster@CoolZone.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* NEW SECTION 1 — STATIC 2-LAYER WEB-RING IMAGE STRIP */}
          <section className="bevel-inset bg-winGray mx-1 mb-2 p-3">
            <div className="bg-winBlue text-white px-2 py-1 mb-3 flex items-center justify-between">
              <h3 className="font-bold font-sans text-sm tracking-wide flex items-center gap-2">
                <i data-lucide="users" className="w-4 h-4"></i> :: MY WEB RING — 8 FRIENDS ::
              </h3>
              <span className="font-pixel text-[8px] text-yellow-300">★ NEW ★</span>
            </div>
            <p className="font-comic text-xs md:text-sm mb-3 px-1 leading-relaxed">
              These are the 8 webmasters in my ring. Click around — they all link back. Each portrait was scanned on a flatbed at 75 DPI and color-corrected in Photoshop 5.5 over the course of a long Saturday.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1609530142110-7af0a038c723?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover -rotate-3 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover rotate-2 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1622912058707-1b33af81db4f?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover -rotate-1 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1776275758873-31603dd06112?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1618488373960-404fe668e524?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover rotate-3 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1685787773514-90e8e14af797?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover -rotate-3 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover rotate-2 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover -rotate-1 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

              <div className="relative aspect-square overflow-hidden bevel-outset bg-winGray">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?auto=format&fit=crop&w=400&q=70" alt="" loading="lazy" />
                <img className="absolute top-2 left-2 w-3/5 h-3/5 object-cover rotate-3 border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1485231183945-fffde7cc051e?auto=format&fit=crop&w=300&q=70" alt="" loading="lazy" />
                <span className="absolute bottom-1 right-1 bg-winBlue text-white text-[9px] font-pixel px-1 py-0.5">★ FRIEND</span>
              </div>

            </div>
            <p className="font-mono text-[10px] mt-3 text-center text-winDarkGray">[ portraits scanned 1998-1999 — best viewed at 800×600 — please do not hotlink ]</p>
          </section>

          {/* NEW SECTION 2 — CD-ROM COLLECTION (alternating rows) */}
          <section className="bevel-inset bg-winGray mx-1 mb-2 p-3">
            <div className="bg-winBlue text-white px-2 py-1 mb-3 flex items-center justify-between">
              <h3 className="font-bold font-sans text-sm tracking-wide flex items-center gap-2">
                <i data-lucide="disc" className="w-4 h-4"></i> :: MY CD-ROM COLLECTION — 6 HITS ::
              </h3>
              <span className="font-pixel text-[8px] text-yellow-300">DISC TRAY OPEN</span>
            </div>

            <div className="flex flex-col gap-3">

              <article className="bevel-outset bg-white p-3 flex flex-col md:flex-row gap-4 items-stretch">
                <div className="md:w-2/5 shrink-0 border-2 border-winDarkGray overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70" alt="Encarta '95" className="w-full aspect-[4/3] object-cover saturate-150 contrast-110" loading="lazy" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-pixel text-[12px] text-winBlue mb-1">ENCARTA '95</h4>
                    <p className="font-digital text-base text-purple-700 mb-2">// the encyclopedia we believed</p>
                    <p className="font-comic font-bold text-[14px] leading-relaxed text-black">
                      A 600-megabyte cathedral on a single silver platter. We installed it from four numbered discs and accepted, sincerely, that anything not in Encarta did not exist. The MindMaze game in the back menu taught me more about Tudor monarchs than school did, and the audio clip of MLK's "I Have a Dream" played from a tinny mono speaker felt like archaeology. I watched the timeline scroll for hours and learned the precise phrase a Pentium MMX uses to think.
                    </p>
                  </div>
                  <p className="font-mono text-[10px] mt-2 text-winDarkGray">[ Microsoft · 4 CD-ROM · 1995 ]</p>
                </div>
              </article>

              <article className="bevel-outset bg-white p-3 flex flex-col md:flex-row-reverse gap-4 items-stretch">
                <div className="md:w-2/5 shrink-0 border-2 border-winDarkGray overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=70" alt="MS Hover" className="w-full aspect-[4/3] object-cover saturate-150 contrast-110" loading="lazy" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-pixel text-[12px] text-winBlue mb-1">MS HOVER!</h4>
                    <p className="font-digital text-base text-purple-700 mb-2">// racing on the floor of the Pentium</p>
                    <p className="font-comic font-bold text-[14px] leading-relaxed text-black">
                      Bundled free on the Windows 95 Plus disc. You drove a hovercar through a fluorescent-lit office maze, capturing flags from a rival hovercar in a maze that — if you stared long enough — was clearly just a single hallway tiled into infinity. The MIDI soundtrack lives somewhere in my motor cortex and surfaces unbidden every time I see drop ceiling tiles. It was the first 3D game my family computer could run without coughing.
                    </p>
                  </div>
                  <p className="font-mono text-[10px] mt-2 text-winDarkGray">[ Microsoft · Plus! disc · 1995 ]</p>
                </div>
              </article>

              <article className="bevel-outset bg-white p-3 flex flex-col md:flex-row gap-4 items-stretch">
                <div className="md:w-2/5 shrink-0 border-2 border-winDarkGray overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=70" alt="MTV Music Generator" className="w-full aspect-[4/3] object-cover saturate-150 contrast-110" loading="lazy" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-pixel text-[12px] text-winBlue mb-1">MTV MUSIC GENERATOR</h4>
                    <p className="font-digital text-base text-purple-700 mb-2">// the future briefly</p>
                    <p className="font-comic font-bold text-[14px] leading-relaxed text-black">
                      A PlayStation 1 disc that let you stack synth loops, drum kits and saw-wave bass on a vertical grid until you had something that sounded like trance music made by a tax accountant. You saved your tracks to memory card and traded them at school like baseball cards. I made one called CYBERFEEL.001 and I will defend it. The interface was probably the closest 1999 ever got to a Live-style DAW running on a console.
                    </p>
                  </div>
                  <p className="font-mono text-[10px] mt-2 text-winDarkGray">[ Codemasters · PS1 · 1999 ]</p>
                </div>
              </article>

            </div>
          </section>

          {/* NEW SECTION 3 — GUESTBOOK ENTRIES (sticky portrait + scroll) */}
          <section className="bevel-inset bg-winGray mx-1 mb-2 p-3">
            <div className="bg-winBlue text-white px-2 py-1 mb-3 flex items-center justify-between">
              <h3 className="font-bold font-sans text-sm tracking-wide flex items-center gap-2">
                <i data-lucide="book-open" className="w-4 h-4"></i> :: GUESTBOOK ENTRIES — RECENT 4 ::
              </h3>
              <span className="font-pixel text-[8px] text-yellow-300">SIGNED</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3 shrink-0">
                <div className="md:sticky md:top-4 bevel-outset bg-white p-2">
                  <img src="https://images.unsplash.com/photo-1485231183945-fffde7cc051e?auto=format&fit=crop&w=600&q=70" alt="Webmaster portrait" className="w-full aspect-[3/4] object-cover saturate-150 contrast-110 hue-rotate-[200deg]" loading="lazy" />
                  <div className="bg-winBlue text-white text-[10px] font-pixel mt-2 px-1 py-1 text-center">CYBERCOOL99 · 1999</div>
                  <p className="font-comic text-[11px] mt-2 text-center leading-snug">"Thanks 4 stopping by my page. I read every single entry."</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">

                <article className="bevel-outset bg-white p-3">
                  <div className="flex items-center gap-2 mb-2 border-b-2 border-dashed border-gray-300 pb-1">
                    <span className="bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900 font-mono">PostED on JuNE 14 — 9:42 PM</span>
                    <span className="font-digital text-base text-purple-700">~ entry #001 ~</span>
                  </div>
                  <p className="font-comic text-[14px] leading-relaxed text-black">
                    OMGGG i finally found ur site after like 3 hours of clickin thru the WebRing. ur background tile is INSANE i wanna steal it (with credit obvi). also ur Encarta review made me reinstall my mom's old PC just to load the Mind Maze game. if ur ever in St Louis hit me up we can go to the new Hot Topic in the mall. PS — pls add a midi version of Zombie by The Cranberries to the auto-play, i'd literally die.
                  </p>
                  <p className="font-mono text-[11px] mt-2 text-right text-winDarkGray">— signed: <span className="font-digital text-base text-webBlue">XxStArDuStxX</span></p>
                </article>

                <article className="bevel-outset bg-white p-3">
                  <div className="flex items-center gap-2 mb-2 border-b-2 border-dashed border-gray-300 pb-1">
                    <span className="bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900 font-mono">PostED on JuNE 09 — 2:17 AM</span>
                    <span className="font-digital text-base text-purple-700">~ entry #002 ~</span>
                  </div>
                  <p className="font-comic text-[14px] leading-relaxed text-black">
                    yo cybercool, dude been signing every guestbook in the ring tonight, ur the seventeenth and ur GIFs are by far the loudest. love it. quick q — what FTP client u using to upload? i tried WS_FTP LE and it kept timing out on my Earthlink dialup so im back to typing the index right into Notepad and praying. anyway congrats on the Webmasters Guild gold star, well deserved, the alert-triangle banner alone is worth the visit.
                  </p>
                  <p className="font-mono text-[11px] mt-2 text-right text-winDarkGray">— signed: <span className="font-digital text-base text-webBlue">M0DEM_SCRE4MER</span></p>
                </article>

                <article className="bevel-outset bg-white p-3">
                  <div className="flex items-center gap-2 mb-2 border-b-2 border-dashed border-gray-300 pb-1">
                    <span className="bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900 font-mono">PostED on MaY 28 — 6:04 PM</span>
                    <span className="font-digital text-base text-purple-700">~ entry #003 ~</span>
                  </div>
                  <p className="font-comic text-[14px] leading-relaxed text-black">
                    hi. i am 11 years old and my older brother showed me ur site. he says ur fonts are quote-unquote a war crime but i think they look like the start menu, which i love. i have not figured out how to get my own GeoCities page working yet, the FTP keeps asking me for a password my parents will not give me. but when i do get a page up, can i join the Web Ring? i promise to update every week. i drew a tiger in MS Paint and i'd put it as the welcome image.
                  </p>
                  <p className="font-mono text-[11px] mt-2 text-right text-winDarkGray">— signed: <span className="font-digital text-base text-webBlue">tigerKid_2000</span></p>
                </article>

                <article className="bevel-outset bg-white p-3">
                  <div className="flex items-center gap-2 mb-2 border-b-2 border-dashed border-gray-300 pb-1">
                    <span className="bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900 font-mono">PostED on MaY 03 — 11:58 PM</span>
                    <span className="font-digital text-base text-purple-700">~ entry #004 ~</span>
                  </div>
                  <p className="font-comic text-[14px] leading-relaxed text-black">
                    ok i lurked for two months before signing because i didn't want to ruin the vibe with a basic comment. but the new CD-ROM Collection page made me cry a little, in a good way. the MS Hover writeup is exactly the feeling i could not put into words about that whole computer-lab-after-school era. also: ur use of Press Start 2P next to Comic Neue is reckless and i love it. keep going. the rest of the internet is going to look like a Walmart parking lot soon and pages like this are the only thing keeping the lights on.
                  </p>
                  <p className="font-mono text-[11px] mt-2 text-right text-winDarkGray">— signed: <span className="font-digital text-base text-webBlue">aQuA_iNk_99</span></p>
                </article>

              </div>
            </div>
          </section>

          {/* NEW SECTION 4 — TIPS FOR THE WWW (half-full-bleed image) */}
          <section className="bevel-inset bg-winGray mx-1 mb-2 p-3 overflow-hidden">
            <div className="bg-winBlue text-white px-2 py-1 mb-3 flex items-center justify-between">
              <h3 className="font-bold font-sans text-sm tracking-wide flex items-center gap-2">
                <i data-lucide="list-ordered" className="w-4 h-4"></i> :: TIPS FOR THE WWW — A SHORT LIST ::
              </h3>
              <span className="font-pixel text-[8px] text-yellow-300">v1.0</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="md:w-1/2 bevel-outset bg-white p-3">
                <ol className="flex flex-col gap-3 list-none">
                  <li className="flex gap-3">
                    <span className="font-pixel text-[14px] text-red-600 shrink-0">01</span>
                    <div>
                      <h4 className="font-comic font-bold text-[14px] text-winBlue">Hit refresh once and walk away.</h4>
                      <p className="font-comic text-[13px] leading-relaxed mt-1">If a page doesn't load within ninety seconds the modem is being overrun, the host's T1 is buckling, or you've been quietly redirected to a parked domain. Walk to the kitchen, get a Pop-Tart, come back. Refreshing six times in a row only multiplies the failed handshakes and makes the line worse for everyone in the household sharing the phone jack with you.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-pixel text-[14px] text-red-600 shrink-0">02</span>
                    <div>
                      <h4 className="font-comic font-bold text-[14px] text-winBlue">Save your bookmarks to Notepad.</h4>
                      <p className="font-comic text-[13px] leading-relaxed mt-1">Browsers eat their own bookmark files about every fourteen months. Open Notepad, paste each URL with a one-line description, and save it as BOOKMARKS.TXT on the desktop. When the inevitable reformat comes you will have a backup that survives anything short of a house fire, and the file is small enough to fit on a 1.44 MB floppy with room left over for a few photos.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-pixel text-[14px] text-red-600 shrink-0">03</span>
                    <div>
                      <h4 className="font-comic font-bold text-[14px] text-winBlue">A page should fit in one Pentium MMX flash.</h4>
                      <p className="font-comic text-[13px] leading-relaxed mt-1">If your homepage takes more than one full screen-paint to render on a 200 MHz machine, you are designing for the wrong audience. Cut a GIF. Cut a table. Cut the autoplay MIDI if you have to (you don't have to). The goal is for the visitor to see something within four seconds; everything after that is a bonus and should be treated as such.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-pixel text-[14px] text-red-600 shrink-0">04</span>
                    <div>
                      <h4 className="font-comic font-bold text-[14px] text-winBlue">Sign every guestbook you visit.</h4>
                      <p className="font-comic text-[13px] leading-relaxed mt-1">It costs you ninety seconds and it makes someone's whole week. Even if you have nothing clever to say, "Cool page!" with your handle is currency on the small web. Webmasters keep score. Webmasters remember. The Web Ring runs on small acts of acknowledgement and the occasional trade of an animated divider GIF.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-pixel text-[14px] text-red-600 shrink-0">05</span>
                    <div>
                      <h4 className="font-comic font-bold text-[14px] text-winBlue">Never trust a page without a hit counter.</h4>
                      <p className="font-comic text-[13px] leading-relaxed mt-1">A page with no counter is a page with no skin in the game. The counter doesn't have to be honest — half of them are seeded at 50,000 — but its presence proves the webmaster cares enough to lie about it. Look for the small green LCD digits, the little brass-coloured frame, the "VISITORS SINCE…" line. That's a real site, run by a real human.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-pixel text-[14px] text-red-600 shrink-0">06</span>
                    <div>
                      <h4 className="font-comic font-bold text-[14px] text-winBlue">Keep a folder of saved GIFs on your D: drive.</h4>
                      <p className="font-comic text-[13px] leading-relaxed mt-1">Right-click, Save As, organize by mood. Sparkles, dividers, "under construction" workmen, dancing babies — you'll need them. The original hosts go down constantly and the only way to preserve a sparkle line you loved in 1998 is to have it sitting locally on a Toshiba IDE drive in a folder you can actually find again next year.</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="md:w-1/2 relative md:mr-[calc(50%-50vw)] border-2 border-winDarkGray overflow-hidden">
                <img src="https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?auto=format&fit=crop&w=1200&q=70" alt="WWW tips visual" className="w-full h-full object-cover saturate-150 contrast-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-tr from-winBlue/40 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 bg-winBlue text-white px-2 py-1 font-pixel text-[10px]">// IMG_0006.JPG // 1024x768</div>
              </div>
            </div>
          </section>

          <footer className="bg-winGray border-t border-white p-2 text-xs font-sans mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600">Copyright © 1999-2026 CoolZone Inc.</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <div className="border border-black shadow-[1px_1px_0_white] flex w-[88px] h-[31px]">
                  <div className="bg-[#000080] w-[30%] flex items-center justify-center">
                    <span className="text-white font-serif font-bold text-lg italic">N</span>
                  </div>
                  <div className="bg-[#c0c0c0] w-[70%] flex flex-col justify-center items-center leading-none">
                    <span className="text-[9px] font-bold">NETSCAPE</span>
                    <span className="text-[9px]">Now!</span>
                  </div>
                </div>
                <div className="border border-black shadow-[1px_1px_0_white] flex w-[88px] h-[31px] bg-white items-center justify-center gap-1">
                  <span className="text-blue-600 font-bold italic text-lg">e</span>
                  <div className="flex flex-col leading-none text-left">
                    <span className="text-[8px]">Internet</span>
                    <span className="text-[8px]">Explorer</span>
                  </div>
                </div>
                <div className="border border-black shadow-[1px_1px_0_white] bg-yellow-200 w-[88px] h-[31px] flex items-center justify-center text-[8px] font-mono leading-tight text-center">
                  <i data-lucide="file-text" className="w-3 h-3 mr-1"></i>
                  MADE WITH<br />NOTEPAD
                </div>
              </div>
            </div>
          </footer>
        </main>
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
