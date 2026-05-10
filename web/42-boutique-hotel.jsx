export default function T42BoutiqueHotel() {
  const navLeft = [
    { label: "Rooms", href: "#" },
    { label: "Restaurant", href: "#" }
  ];
  const navRight = [
    { label: "Stay", href: "#" },
    { label: "Guide", href: "#" }
  ];

  const mobileNav = [
    { label: "Rooms", icon: "bed", href: "#" },
    { label: "Restaurant", icon: "restaurant", href: "#" },
    { label: "Guide", icon: "map", href: "#" },
    { label: "Book Now", icon: "calendar_month", href: "#" }
  ];

  const bookingFields = [
    { label: "Check In", icon: "calendar_today", value: "Select Date" },
    { label: "Check Out", icon: "calendar_today", value: "Select Date" },
    { label: "Guests", icon: "person", value: "2 Adults" }
  ];

  const rooms = [
    {
      name: "The Mews",
      price: "From €280",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW1pxqc480VrxxwX9PIajA6CvaEMYNV5SuDlYyuX7kDBXy7hUNIkDwDRAAZKOVnkarwMtwtg63ByRF9vOB6Z5yF1ukqaVX90FI1Rbvj2IuRQym8L8H6hLW1S1A-rVFnv0-PXrAalcJoQHLt64K-fOtQ6Gmt-5OlE-kLFcmDMMbn9atE-oipwxd_0YnN6nQox0B1261LF4i8GDChNlla-Wnz5Fvc09rfSBuF8DgWsNWIatSDSZBtbVmzdazJnKWO6paxC7-LJ6WE-w"
    },
    {
      name: "Classic King",
      price: "From €340",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgiQhw7p90nEsKGChRmxO9MqrBKxqXLaOX4J5JQGY6Srbn-zQH0pbswF7zaGC9t9n_967teI3G-dQ0eXUiRr30TsCyrYLL6-nXMTI-kSCcS45_JpPIp_pt2EemTb1JS6LFb8t2_ONAvqDRbz3NIcowSquELv29g7IKSK4fU42swL40oLGctUeQPe1MLIxR9VgHgNo7Qb_lkrObEc9mTO1YSCUsqmLIYZAIF3rgzhkQv32q0zFFaF_Yl9TDqKfawA5q0HAfZYJPl7g"
    },
    {
      name: "Heritage Suite",
      price: "From €450",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5FMpE9n7uPXUT7ZvUheAHi4PDH_WCjplTOysu_JMgWEPWS6fq-Xh6WuVfeUvvz7yleiAu63o4KucLb7fpG7XTU_XoSRS9ux_GYL6957wEu3fmP4TKTvLsWeZV5eJBax97GfFikBzQgM9WbXB7zc6sQk8UO6GauQCNa5kfCfX7dZVwZ6AuSmrOVqrxoEtA3Kc6sBslA7V9sr9cGfrhlpNOpe71A_QWUFfXgo7q4GZr43y7tWTA8Ub7T-gpOy2msE4pDNrP127tODA"
    },
    {
      name: "The Townhouse Suite",
      price: "From €600",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT3Ht1QzFa1H_HLPQt3eu392BppgRuJcNywqJWaDAaM3SQquRgd69VCtWPVG_O4lq5o8ta2gw7YCBAOivk8b7pLcIaEoOHwdgn_SBG3eMf8_b69EYCwKJJPcES4kh0RTQC2WYzQYG_DfkshggGzIeNS3Hwo5Z7M6KncEYKf3q-DmKcOknl0M8mwBrLAv4dxvS4KNHM3vgDYk0nAQVVF3ayWnWPCNSvpjNeRhHXM9BvRJuh1I_w8ekpCWoYYFFq_bXSlTwDYbAzOEo"
    }
  ];

  const footerCol1 = [
    { label: "Address", href: "#" },
    { label: "Direct Booking", href: "#" }
  ];
  const footerCol2 = [
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" }
  ];

  const roomFeatures = [
    "King beds with Egyptian cotton linen, weighted throws",
    "En-suite marble baths · full Aesop amenity range",
    "Original Georgian sash windows, hand-restored",
    "Curated mini-bar · Irish whiskey, Lyra-blend tea",
    "Slow breakfast included · daily, until 11am"
  ];

  const roomStats = [
    { v: "14", l: "Rooms" },
    { v: "28–65", l: "m² · range" },
    { v: "€280+", l: "Per night" }
  ];

  const lookbookGrid = [
    { name: "Plate · No. 04 · Morning Light", alt: "Light filtering through Georgian sash windows onto a brass bed", span: "col-span-12 md:col-span-7", aspect: "aspect-[4/3]", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAazRGO1IKbNRqrV9d73KA6mHQF-IBAA9q-7adenpHmEkrJpGmRvLnpz2VcHlmBeEJ87YJ4U7NnWN_XQWxUgONYK0E9d5A8geMojJSau9l1Pr3sdG8M36FxOj5lHseEcB_m1EP0iXuIDk0x7m-j0r1T3A8s3k1EQZyCOWX1rYc07rashwDPCpl4e-AxLwwNvbu0yU0f3cSEQpmTxkGoJWk6wCsx6zuedy8LAFbnKLAJAcRQf115KcFPatxhwlhVqq-Wewji_bDqfYk" },
    { name: "Plate · No. 11 · The Bath", alt: "Roll-top bath in marble bathroom with brass fixtures", span: "col-span-12 md:col-span-5", aspect: "aspect-[4/3] md:aspect-auto", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT3Ht1QzFa1H_HLPQt3eu392BppgRuJcNywqJWaDAaM3SQquRgd69VCtWPVG_O4lq5o8ta2gw7YCBAOivk8b7pLcIaEoOHwdgn_SBG3eMf8_b69EYCwKJJPcES4kh0RTQC2WYzQYG_DfkshggGzIeNS3Hwo5Z7M6KncEYKf3q-DmKcOknl0M8mwBrLAv4dxvS4KNHM3vgDYk0nAQVVF3ayWnWPCNSvpjNeRhHXM9BvRJuh1I_w8ekpCWoYYFFq_bXSlTwDYbAzOEo" },
    { name: "No. 17 · The Armchair", alt: "Cream Georgian drapes against an emerald velvet armchair", span: "col-span-12 md:col-span-4", aspect: "aspect-square", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgiQhw7p90nEsKGChRmxO9MqrBKxqXLaOX4J5JQGY6Srbn-zQH0pbswF7zaGC9t9n_967teI3G-dQ0eXUiRr30TsCyrYLL6-nXMTI-kSCcS45_JpPIp_pt2EemTb1JS6LFb8t2_ONAvqDRbz3NIcowSquELv29g7IKSK4fU42swL40oLGctUeQPe1MLIxR9VgHgNo7Qb_lkrObEc9mTO1YSCUsqmLIYZAIF3rgzhkQv32q0zFFaF_Yl9TDqKfawA5q0HAfZYJPl7g" },
    { name: "No. 22 · Linen", alt: "Detail of crisp white linen and dark wood headboard", span: "col-span-12 md:col-span-4", aspect: "aspect-square", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW1pxqc480VrxxwX9PIajA6CvaEMYNV5SuDlYyuX7kDBXy7hUNIkDwDRAAZKOVnkarwMtwtg63ByRF9vOB6Z5yF1ukqaVX90FI1Rbvj2IuRQym8L8H6hLW1S1A-rVFnv0-PXrAalcJoQHLt64K-fOtQ6Gmt-5OlE-kLFcmDMMbn9atE-oipwxd_0YnN6nQox0B1261LF4i8GDChNlla-Wnz5Fvc09rfSBuF8DgWsNWIatSDSZBtbVmzdazJnKWO6paxC7-LJ6WE-w" },
    { name: "No. 28 · Cornicing", alt: "Heritage suite with ornate cornicing and burgundy accents", span: "col-span-12 md:col-span-4", aspect: "aspect-square", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5FMpE9n7uPXUT7ZvUheAHi4PDH_WCjplTOysu_JMgWEPWS6fq-Xh6WuVfeUvvz7yleiAu63o4KucLb7fpG7XTU_XoSRS9ux_GYL6957wEu3fmP4TKTvLsWeZV5eJBax97GfFikBzQgM9WbXB7zc6sQk8UO6GauQCNa5kfCfX7dZVwZ6AuSmrOVqrxoEtA3Kc6sBslA7V9sr9cGfrhlpNOpe71A_QWUFfXgo7q4GZr43y7tWTA8Ub7T-gpOy2msE4pDNrP127tODA" },
    { name: "No. 31 · The Dining Room at Dusk", alt: "Atmospheric dining room at dusk with brass pendants", span: "col-span-12", aspect: "aspect-[21/9]", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACljAmHvZ19zHiFKJeOgqHnLPtWhPkdHsWqIn4hwbs9taGNHrX7X_HkzVNhNOdbG9oKJSvCIQgW_R7PQqELLiAbatmqynix7preRuZisrNPCd53JbqvlxXvgw7isalPF46-ySqs54P5-tUOD5AsfqaMmcyFBWc7qa9vL_VWkO68ja_khVM60XU3CMNebcWENyPAsHFw4a8eLHx17y75iwS_1b2IGm0uIxe08iFaoxiRNzRYtfTgusO0fLoSr21h47UzuNvpW-L17s" }
  ];

  const heritageStats = [
    { v: "1796", l: "Built" },
    { v: "2018", l: "Acquired" },
    { v: "2021", l: "Restored" }
  ];

  const pressLogos = [
    { slug: "medium", alt: "Featured in Medium" },
    { slug: "theguardian", alt: "Featured in The Guardian" },
    { slug: "telegraph", alt: "Featured in The Telegraph" },
    { slug: "substack", alt: "Featured in Substack" },
    { slug: "hermes", alt: "Recommended by Hermès" },
    { slug: "wetransfer", alt: "Featured in WeTransfer" },
    { slug: "pinterest", alt: "Featured in Pinterest" },
    { slug: "behance", alt: "Featured in Behance" }
  ];

  const housePromise = [
    {
      numeral: "I",
      icon: "lock",
      title: "Discretion.",
      body: "No guest list shared, no arrival photographed, no name spoken in the lobby. The front desk holds your reservation under whatever initial you prefer; staff are briefed weekly on what privacy actually means in a fourteen-room house.",
      meta: "House rule · No. 01",
      featured: false
    },
    {
      numeral: "II",
      icon: "verified",
      title: "Quality, sourced.",
      body: "The linen comes from Belfast, the soap from a Cork apothecary, the bread from a baker on Pleasants Street who delivers at six. We name our suppliers because we'd want to know, and because they're easier to find than to hide.",
      meta: "House rule · No. 02",
      featured: false
    },
    {
      numeral: "III",
      icon: "spa",
      title: "Quietude, kept.",
      body: "No piped music, no ringing phones at reception, no hum from the bar past eleven. Sash windows close on the courtyard side; the corridor carpet is twelve millimetres thick. The loudest thing you'll hear most evenings is the kettle in your room.",
      meta: "House rule · No. 03",
      featured: true
    },
    {
      numeral: "IV",
      icon: "room_service",
      title: "Care, attentive.",
      body: "A turn-down at nine, a small note about tomorrow's weather, a handwritten card on the second night. Three of our staff have been here since opening; the others trained under them. Most of what looks like luxury is, on inspection, just paying attention.",
      meta: "House rule · No. 04",
      featured: false
    }
  ];

  const pressLogoFilter = "brightness(0) saturate(100%) invert(74%) sepia(34%) saturate(516%) hue-rotate(2deg) brightness(91%) contrast(86%)";

  const dublinPicks = [
    { num: "No. 01", category: "Coffee", time: "4 min · 320 m", title: "3FE on Grand Canal", body: "House roastery for the city's flat-white renaissance. Get there before 09:30; pastries vanish." },
    { num: "No. 02", category: "Books", time: "7 min · 540 m", title: "Ulysses Rare Books", body: "Antiquarian shop on Duke Street. Joyce first editions kept behind glass; the rest you can hold." },
    { num: "No. 03", category: "Garden", time: "9 min · 720 m", title: "Iveagh Gardens", body: "A walled Victorian park hidden behind the Concert Hall. Quietest bench in the city." },
    { num: "No. 04", category: "Pub", time: "5 min · 380 m", title: "Toner's, est. 1818", body: "Yeats' favourite. Original snug at the back. The Guinness is, as it should be, slow." },
    { num: "No. 05", category: "Gallery", time: "12 min · 960 m", title: "Hugh Lane Gallery", body: "Francis Bacon's reconstructed studio is on the second floor. Free entry, always." },
    { num: "No. 06", category: "Sea", time: "DART · 22 min", title: "The Forty Foot, Sandycove", body: "Dublin's Joycean swim spot. Open year-round; bring a robe — we'll lend you one." }
  ];

  const Divider = () => (
    <div className="flex items-center justify-center relative w-full h-[1px] bg-tertiary-fixed-dim/30">
      <div className="absolute bg-background px-4 font-serif text-tertiary-fixed-dim italic text-lg">L</div>
    </div>
  );

  const navLinkClass =
    "font-serif text-stone-900 dark:text-stone-100 uppercase tracking-[0.2em] text-[10px] hover:text-[#2C4A3E] dark:hover:text-stone-200 transition-colors duration-500 text-stone-500 dark:text-stone-400";
  const mobileNavLinkClass =
    "flex flex-col items-center gap-1 font-serif uppercase tracking-widest text-[9px] text-white/60 pt-2 bg-white/10 scale-98 transition-transform";
  const footerLinkClass =
    "font-serif text-sm tracking-wide text-stone-500 hover:text-[#2C4A3E] transition-all";

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Noto+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "background": "#fbf9f8", "on-background": "#1b1c1c",
                "surface": "#fbf9f8", "surface-bright": "#fbf9f8", "surface-dim": "#dbd9d9", "surface-variant": "#e4e2e2",
                "surface-container-lowest": "#ffffff", "surface-container-low": "#f5f3f3", "surface-container": "#efeded", "surface-container-high": "#eae8e7", "surface-container-highest": "#e4e2e2",
                "on-surface": "#1b1c1c", "on-surface-variant": "#414845",
                "primary": "#153328", "on-primary": "#ffffff", "primary-container": "#2c4a3e", "on-primary-container": "#98b9a9", "primary-fixed": "#c8eada", "primary-fixed-dim": "#adcebe", "on-primary-fixed": "#012016", "on-primary-fixed-variant": "#2f4d41",
                "secondary": "#625e50", "on-secondary": "#ffffff", "secondary-container": "#e9e2d0", "on-secondary-container": "#686456", "secondary-fixed": "#e9e2d0", "secondary-fixed-dim": "#ccc6b5", "on-secondary-fixed": "#1e1c11", "on-secondary-fixed-variant": "#4a473a",
                "tertiary": "#3f2a00", "on-tertiary": "#ffffff", "tertiary-container": "#5c3f00", "on-tertiary-container": "#d6ab62", "tertiary-fixed": "#ffdeaa", "tertiary-fixed-dim": "#ecc074", "on-tertiary-fixed": "#271900", "on-tertiary-fixed-variant": "#5f4100",
                "error": "#ba1a1a", "on-error": "#ffffff", "error-container": "#ffdad6", "on-error-container": "#93000a",
                "outline": "#727974", "outline-variant": "#c1c8c3", "surface-tint": "#466558", "inverse-surface": "#303030", "inverse-on-surface": "#f2f0f0", "inverse-primary": "#adcebe"
              },
              spacing: {
                gutter: "24px",
                "container-max": "1440px",
                "section-gap": "120px",
                "margin-edge": "80px",
                unit: "8px"
              },
              fontFamily: {
                h1: ["Noto Serif"], h2: ["Noto Serif"], h3: ["Noto Serif"], display: ["Noto Serif"],
                "body-lg": ["Inter"], "body-md": ["Inter"], "label-caps": ["Inter"]
              },
              fontSize: {
                h1: ["48px", { lineHeight: "1.2", fontWeight: "400" }],
                h2: ["32px", { lineHeight: "1.3", fontWeight: "400" }],
                h3: ["24px", { lineHeight: "1.4", fontWeight: "400" }],
                display: ["80px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "500" }]
              }
            }
          }
        };
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
      ` }} />

      <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
        {/* TopAppBar — outer header is full-bleed (background spans the screen);
            inner div constrains the actual nav content to 1440px so links
            don't drift to the corners on wide displays. */}
        <header className="fixed top-0 left-0 right-0 w-full z-50 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 hidden md:block slow-fade opacity-100">
          <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-20 py-6">
            <nav className="flex-1 flex gap-8">
              {navLeft.map(l => (
                <a key={l.label} className={navLinkClass} href={l.href}>{l.label}</a>
              ))}
            </nav>
            <div className="flex-shrink-0 text-center">
              <h1 className="text-2xl font-serif tracking-tighter text-[#2C4A3E] dark:text-stone-100 font-bold">Lyra House</h1>
            </div>
            <div className="flex-1 flex justify-end items-center gap-8">
              {navRight.map(l => (
                <a key={l.label} className={navLinkClass} href={l.href}>{l.label}</a>
              ))}
              <button className="font-label-caps text-label-caps bg-primary text-on-primary px-6 py-3 border border-transparent hover:bg-primary/90 transition-colors">Book</button>
            </div>
          </div>
        </header>

        {/* BottomNavBar (Mobile) */}
        <nav className="bg-[#2C4A3E] dark:bg-stone-900 fixed bottom-0 w-full flex justify-around items-center px-4 py-4 md:hidden z-50">
          {mobileNav.map(item => (
            <a key={item.label} className={mobileNavLinkClass} href={item.href}>
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-stone-900">
            <img alt="" className="w-full h-full object-cover opacity-80 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAazRGO1IKbNRqrV9d73KA6mHQF-IBAA9q-7adenpHmEkrJpGmRvLnpz2VcHlmBeEJ87YJ4U7NnWN_XQWxUgONYK0E9d5A8geMojJSau9l1Pr3sdG8M36FxOj5lHseEcB_m1EP0iXuIDk0x7m-j0r1T3A8s3k1EQZyCOWX1rYc07rashwDPCpl4e-AxLwwNvbu0yU0f3cSEQpmTxkGoJWk6wCsx6zuedy8LAFbnKLAJAcRQf115KcFPatxhwlhVqq-Wewji_bDqfYk" />
          </div>
          <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
            <h1 className="font-display text-display text-white mb-6 tracking-tight">Lyra House</h1>
            <p className="font-h3 text-h3 text-stone-200 italic max-w-2xl mx-auto leading-relaxed">
              Fourteen rooms. One Georgian house. Dublin.
            </p>
          </div>

          {/* Floating Booking Widget */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 md:px-0 z-20 hidden md:block">
            <div className="bg-surface/95 backdrop-blur-md p-4 border border-outline-variant flex flex-col md:flex-row gap-4 items-end shadow-2xl">
              {bookingFields.map(f => (
                <div key={f.label} className="flex-1 w-full">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">{f.label}</label>
                  <div className="border-b border-primary pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">{f.icon}</span>
                    <span className="font-body-md text-body-md text-on-surface">{f.value}</span>
                  </div>
                </div>
              ))}
              <button className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 whitespace-nowrap hover:bg-primary/90 transition-colors w-full md:w-auto">
                Check Availability
              </button>
            </div>
          </div>
        </section>

        <main className="max-w-container-max mx-auto px-6 md:px-margin-edge py-section-gap space-y-section-gap">
          {/* Divider */}
          <div className="flex items-center justify-center relative w-full h-[1px] bg-tertiary-fixed-dim/30">
            <div className="absolute bg-background px-4 font-serif text-tertiary-fixed-dim italic text-lg">L</div>
          </div>

          {/* Rooms Section — three-band layout (top/middle/bottom) so heading
              aligns with image-grid top and stats+CTA align with bottom. */}
          <section className="grid grid-cols-12 gap-gutter">
            <div className="col-span-12 md:col-span-4 flex flex-col justify-between gap-10">

              {/* TOP — heading + intro */}
              <div>
                <span className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim mb-3 tracking-[0.2em] block">— II · The Rooms</span>
                <h2 className="font-h2 text-h2 text-primary mb-6">Fourteen, all<br /><em className="italic">distinct.</em></h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Each of our fourteen rooms is uniquely proportioned, respecting the original architecture of the Georgian house while offering quiet, modern comfort.
                </p>
              </div>

              {/* MIDDLE — amenity checklist */}
              <ul className="space-y-3 max-w-sm">
                {roomFeatures.map(f => (
                  <li key={f} className="flex items-start gap-3 font-body-md text-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* BOTTOM — stats + CTA */}
              <div>
                <div className="grid grid-cols-3 gap-4 max-w-sm border-t border-tertiary-fixed-dim/30 pt-6 mb-8">
                  {roomStats.map(s => (
                    <div key={s.l}>
                      <div className="font-h3 text-h3 text-primary tabular-nums">{s.v}</div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.15em] mt-1 font-medium">{s.l}</p>
                    </div>
                  ))}
                </div>
                <a className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 self-start inline-flex items-center gap-2 hover:opacity-70 transition-opacity" href="#">
                  View All Rooms <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
            <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {rooms.map(r => (
                <div key={r.name} className="group cursor-pointer">
                  <div className="aspect-square mb-4 overflow-hidden bg-surface-container-high border border-outline-variant/30">
                    <img alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={r.img} />
                  </div>
                  <div className="flex justify-between items-baseline border-b border-outline-variant/30 pb-2">
                    <h3 className="font-h3 text-h3 text-on-surface">{r.name}</h3>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{r.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Trusted by / Featured in — editorial press strip */}
          <section className="text-center">
            <span className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim tracking-[0.2em] block mb-8 md:mb-10">— Featured in</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-8 gap-y-10 items-center max-w-5xl mx-auto">
              {pressLogos.map(l => (
                <img
                  key={l.slug}
                  alt={l.alt}
                  className="h-6 md:h-7 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity duration-500"
                  style={{ filter: pressLogoFilter }}
                  src={`https://cdn.simpleicons.org/${l.slug}`}
                />
              ))}
            </div>
          </section>

          <Divider />

          {/* III — Lookbook / Pure Image Gallery */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim block mb-3 tracking-[0.2em]">— III · Lookbook</span>
                <h2 className="font-h2 text-h2 text-primary">Atmosphere, in fragments.</h2>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden md:inline">Photographs · House · Spring 2024</span>
            </div>
            <div className="grid grid-cols-12 gap-gutter">
              {lookbookGrid.map(f => (
                <figure key={f.name} className={`${f.span} ${f.aspect} overflow-hidden bg-surface-container-high border border-outline-variant/30 group relative`}>
                  <img alt={f.alt} className="w-full h-full object-cover grayscale-[15%] transition-transform duration-1000 group-hover:scale-105" src={f.img} />
                  <figcaption className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1 font-label-caps text-label-caps uppercase text-primary tracking-widest">{f.name}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <Divider />

          {/* The Restaurant */}
          <section className="grid grid-cols-12 gap-gutter items-center">
            <div className="col-span-12 md:col-span-7 order-2 md:order-1">
              <div className="aspect-[4/3] bg-surface-container-high border border-outline-variant/30 overflow-hidden">
                <img alt="" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACljAmHvZ19zHiFKJeOgqHnLPtWhPkdHsWqIn4hwbs9taGNHrX7X_HkzVNhNOdbG9oKJSvCIQgW_R7PQqELLiAbatmqynix7preRuZisrNPCd53JbqvlxXvgw7isalPF46-ySqs54P5-tUOD5AsfqaMmcyFBWc7qa9vL_VWkO68ja_khVM60XU3CMNebcWENyPAsHFw4a8eLHx17y75iwS_1b2IGm0uIxe08iFaoxiRNzRYtfTgusO0fLoSr21h47UzuNvpW-L17s" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 order-1 md:order-2 mb-12 md:mb-0">
              <h2 className="font-h1 text-h1 text-primary mb-6">The Restaurant</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                Situated on the ground floor, our dining room focuses on honest, seasonal Irish produce prepared with quiet precision. A place for lingering breakfasts and atmospheric dinners.
              </p>
              <a className="inline-block px-8 py-3 border border-tertiary-fixed-dim text-primary font-label-caps text-label-caps hover:bg-surface-container transition-colors" href="#">
                View Menus
              </a>
            </div>
          </section>

          <Divider />

          {/* V — The Story / Heritage. Left column uses a three-band layout
              with justify-between so the chapter mark + heading sit at image-
              top and the founders' quote drops to image-bottom. Right column
              is a 2x2 grid with a new 4th tile (Restoration card). */}
          <section className="grid grid-cols-12 gap-gutter items-stretch">
            <div className="col-span-12 md:col-span-5 flex flex-col justify-between order-2 md:order-1 gap-10">

              {/* TOP — chapter mark + eyebrow + heading + body */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-h1 text-[60px] md:text-[80px] text-tertiary-fixed-dim italic font-thin leading-none">V</span>
                  <div className="flex-1 h-px bg-tertiary-fixed-dim/40"></div>
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-on-surface-variant whitespace-nowrap">Chapter Five · Heritage</span>
                </div>
                <span className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim mb-3 tracking-[0.2em] block">— The House</span>
                <h2 className="font-h2 text-h2 text-primary mb-6">A Georgian house,<br />kept <em className="italic">quietly.</em></h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-5 leading-relaxed">
                  Number 17 was built in 1796 as a private residence for a Dublin merchant. It became boarding rooms in the 1930s, then sat shuttered for two decades. We took possession in the autumn of 2018 and spent three years on the restoration.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Every cornice, fanlight, and original floorboard has been preserved or carefully reinstated. What is new — the linens, the brass, the kitchen — has been chosen to sit easily beside what is old.
                </p>
              </div>

              {/* MIDDLE — heritage timeline */}
              <div className="grid grid-cols-3 gap-px bg-tertiary-fixed-dim/20 border border-tertiary-fixed-dim/30 max-w-md">
                {heritageStats.map(s => (
                  <div key={s.l} className="bg-background px-5 py-4">
                    <div className="font-h3 text-h3 text-primary tabular-nums">{s.v}</div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.15em] mt-1 font-medium">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* BOTTOM — founders' quote */}
              <figure className="border-l-2 border-tertiary-fixed-dim pl-5 max-w-md">
                <blockquote className="font-h3 text-lg italic text-on-surface leading-relaxed mb-2">&quot;We didn&apos;t want to make it into a hotel. We wanted to make it a house that takes guests.&quot;</blockquote>
                <figcaption className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-[0.2em]">— Eimear &amp; Conor Walsh, Founders</figcaption>
              </figure>
            </div>

            {/* RIGHT — 2×2 grid: 2 tall portraits + 2 squares */}
            <div className="col-span-12 md:col-span-7 order-1 md:order-2 grid grid-cols-2 gap-gutter">

              {/* 1 · Frontispiece */}
              <figure className="aspect-[3/4] overflow-hidden bg-surface-container-high border border-outline-variant/30 relative">
                <img alt="Front facade of the Georgian townhouse" className="w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop" />
                <div className="absolute top-0 left-0 bg-background border-r border-b border-outline-variant px-3 py-2">
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Frontispiece</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-background border-l border-t border-outline-variant px-3 py-2">
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">No. 17</span>
                </div>
              </figure>

              {/* 2 · NEW Restoration card */}
              <figure className="aspect-[3/4] overflow-hidden bg-primary-container text-on-primary border border-outline-variant/30 relative flex flex-col justify-between p-6">
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full border border-tertiary-fixed-dim/30 pointer-events-none"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-tertiary-fixed-dim/20 pointer-events-none"></div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-[36px]" style={{ fontVariationSettings: "'FILL' 0" }}>restore</span>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.25em] text-tertiary-fixed-dim mt-2">— The Restoration</p>
                </div>
                <div className="relative z-10">
                  <p className="font-h3 text-2xl tracking-tight leading-tight mb-3">1,202 days<br />of careful<br />reinstatement.</p>
                  <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-tertiary-fixed-dim/30">
                    <div>
                      <p className="font-h3 text-2xl tabular-nums leading-none">47</p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-tertiary-fixed-dim mt-1">Craftspeople</p>
                    </div>
                    <div>
                      <p className="font-h3 text-2xl tabular-nums leading-none">2018–21</p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-tertiary-fixed-dim mt-1">Period</p>
                    </div>
                  </div>
                </div>
              </figure>

              {/* 3 · Cornice detail */}
              <figure className="aspect-square overflow-hidden bg-surface-container-high border border-outline-variant/30 relative">
                <img alt="Original 18th-century cornicing" className="w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=600&q=85&auto=format&fit=crop" />
                <div className="absolute top-0 left-0 bg-background border-r border-b border-outline-variant px-3 py-2">
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Detail · Cornice</span>
                </div>
              </figure>

              {/* 4 · Protected Houses card */}
              <figure className="aspect-square overflow-hidden bg-primary text-on-primary border border-outline-variant/30 relative flex flex-col items-center justify-center text-center p-6">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-[40px] mb-3" style={{ fontVariationSettings: "'FILL' 0" }}>history_edu</span>
                <p className="font-h3 text-2xl tracking-tight leading-tight">Ranked among<br />the Twenty-Four<br />Protected Houses</p>
                <p className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim mt-3 tracking-[0.2em]">Dublin City Council · 1985</p>
              </figure>
            </div>
          </section>

          <Divider />

          {/* VII — House Promise: premium 2x2 with faded image bg */}
          <section className="relative py-20 md:py-28 overflow-hidden border border-tertiary-fixed-dim/30">
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-15 grayscale pointer-events-none"
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1800&q=80&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background/90 pointer-events-none"></div>
            <div className="relative z-10 px-6 md:px-12 lg:px-16">
              <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
                <span className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim tracking-[0.2em] block mb-8 md:mb-10">— VII · House Promise</span>
                <h2 className="font-h2 text-h2 text-primary mb-5">What we promise,<br /><em className="italic">quietly.</em></h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Four small commitments we make to every guest, written without the usual hospitality language.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch relative z-10">
                {housePromise.map(p => (
                  <article
                    key={p.numeral}
                    className={`bg-background/90 backdrop-blur-sm border border-outline-variant/40 p-8 md:p-10 flex flex-col gap-5 group hover:-translate-y-1 transition-all duration-300${p.featured ? " ring-2 ring-tertiary-fixed-dim relative bg-background/95" : ""}`}
                  >
                    {p.featured && (
                      <span className="absolute -top-3 left-8 bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-caps text-[10px] uppercase tracking-[0.2em] px-3 py-1">Most requested</span>
                    )}
                    <div className="flex items-start justify-between">
                      <span className="font-h1 text-2xl text-tertiary-fixed-dim italic font-thin leading-none">{p.numeral}</span>
                      <span className="material-symbols-outlined text-primary-container text-[36px]" style={{ fontVariationSettings: "'FILL' 0" }}>{p.icon}</span>
                    </div>
                    <h3 className="font-h3 text-h3 text-primary italic">{p.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{p.body}</p>
                    <div className="mt-auto pt-5 border-t border-tertiary-fixed-dim/30 flex items-center justify-between">
                      <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{p.meta}</span>
                      <span className="material-symbols-outlined text-primary text-[16px] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* VI — Concierge / Dublin Guide */}
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim mb-3 tracking-[0.2em] block">— VI · The Guide</span>
                <h2 className="font-h2 text-h2 text-primary">Dublin, kept simple.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-4">
                  Six recommendations from our concierge. All within twenty minutes on foot. None paid placements.
                </p>
              </div>
              <a className="inline-block px-6 py-3 border border-tertiary-fixed-dim text-primary font-label-caps text-label-caps hover:bg-surface-container transition-colors whitespace-nowrap" href="#">
                Full Concierge Guide
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {dublinPicks.map(p => (
                <article key={p.title} className="border-t border-tertiary-fixed-dim pt-5 group cursor-pointer hover:border-primary transition-colors">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-[0.2em]">{p.num} · {p.category}</span>
                    <span className="font-label-caps text-label-caps uppercase text-tertiary-fixed-dim/80 tracking-[0.15em] tabular-nums">{p.time}</span>
                  </div>
                  <h3 className="font-h3 text-h3 text-on-surface mb-2">{p.title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{p.body}</p>
                  <div className="mt-4 flex items-center gap-2 text-primary font-label-caps text-label-caps uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Walking directions</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-stone-100 dark:bg-stone-900 text-[#2C4A3E] dark:text-stone-300 w-full py-20 px-20 flex flex-col md:flex-row justify-between items-start gap-12 border-t border-stone-300 dark:border-stone-800">
          <div className="flex flex-col gap-6">
            <span className="font-serif text-xl italic">Lyra House</span>
            <p className="font-serif text-sm tracking-wide text-stone-500">© 2024 Lyra House. All rights reserved.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              {footerCol1.map(l => (
                <a key={l.label} className={footerLinkClass} href={l.href}>{l.label}</a>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {footerCol2.map(l => (
                <a key={l.label} className={footerLinkClass} href={l.href}>{l.label}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
