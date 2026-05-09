export default function T98OpArtBendaydots() {
  const navLinks = [
    { label: "Releases", href: "#releases" },
    { label: "Creators", href: "#creators" },
    { label: "Shop", href: "#shop" },
    { label: "Events", href: "#events" },
    { label: "Archive", href: "#archive" },
  ];

  const issues = [
    {
      n: "#01", title: "Neon Nights", by: "By S. Jenkins & M. Doe", price: "$4.99",
      desc: "A cyberpunk detective story in the heart of the grid. When the lights go out, the real hunters come to play.",
      tag: "Cyberpunk", tagBg: "bg-primary text-on-primary", coverBg: "bg-primary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7mm0LxPCZkPXJqdzq8kopkbmTaZb3muFfM0ZZtgGfkUhVaw77g3yC_38zM3unRRu1mG21Nvr_8e3y6UMFT4g7lME8Vh3nNIO5p-7esGW9piMzrF2-OkeHhU404Ls4NzQYJNgBOb6j_XS4Wa2NIAGAYwdn-pMLiM_gyz1hfhP0YhAxyehXm3fIcJzVm6LBTrhpc7teQsO7lsyjxCC8b2xK0Nbw8Od0-3ysPd2JptCK9Tjpxiv_wMK52hykeGzj2KVjwZ0h3YJjx7G",
      href: "#read-01",
    },
    {
      n: "#12", title: "Cosmic Entity", by: "By A. Moore & J. Kirby", price: "$5.99",
      desc: "Beyond the stars, something wakes up. A journey into the unimaginable, colorful depths of the void.",
      tag: "Cosmic Horror", tagBg: "bg-tertiary text-on-tertiary", coverBg: "bg-tertiary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaGaBcJU-HCv_NRvY3yDcJ6TepLnqI37YpAybcUX1MueWXtIZxCtOJc2tqRui-3anWx3-l9u6aSHF7VTXT1DVg4XwgXsP4SasRdYsnNDnKfoQpXtWv_utGVCIELhS_Ns4SXTCoOnqJgK695VJhwwJg6gylLu4UQZKXfwDFzdnN4VQ1n2q0qvE8OUYBAwXm5jyqO84Razs5zgsG2pJUbGI2aCTmWK4C8dqKYZ8JKijpngqUJndWw8YfcV7dk09sZXEomeHdsKqVumKF",
      href: "#read-12",
    },
    {
      n: "#05", title: "Alley Cat", by: "By F. Miller & D. Mazz", price: "$3.99",
      desc: "Nine lives, one city to protect. The streets are bleeding, and someone has to stitch them up.",
      tag: "Action", tagBg: "bg-secondary text-on-secondary-fixed", coverBg: "bg-secondary-fixed",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAc29XR2TSVAfQIhlg-SrqM_mUWv_1bB5Ycn6fr5904CYqAHJX3bzFdA3KZjqqUhJDsKkeyrqYR3YGAdGxL_hAOPP2fF4oHZ408wnooPIE6DhBBO5MYNz05AblwvlDcWcWNihxRz48dj5F6A6g8PgE3LnllY-w1ZfksEc5n80ywgiSf5ZC5LkKaYAskTCOc45r26AEuNChwpHANH5N-qHf65a3cVVqeRy7GPrmf3Qr5UA4K9bvWJRiPT79SKKyrFoE33RgxDfYLcA5g",
      href: "#read-05",
    },
    {
      n: "#08", title: "The Void", by: "By J. Ito & B. Wrightson", price: "$6.99",
      desc: "Staring back at you. If you gaze long enough, the pages themselves begin to whisper.",
      tag: "Thriller", tagBg: "bg-on-surface text-surface border-primary shadow-[2px_2px_0px_0px_#b7102a]", coverBg: "bg-surface-variant",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-qgPwSoqOFPQpeUAAmjZuBfkhtWUGFsyAKkm-N9hPvByQwsS0824ixWKT9dcIA9HZzjdEYIA221I-IA0a81TAhN9reQSs5Zgh0ZVPjKcdmbjvcc0EV9bJh8TCMcCSZ1ho3NuiiBIYQXExs3V5Vbo8c5AuTbz7ng5nZqE4UmVrN389l2SbRL_J1HH-xmA6zoGNpanG4OUyRwcNK3Qy0WWTreMF9AavBvF1fmIZ4U6rXdXktnCg0YrEWlQnFDWMI7pngNoNvd41W1HO",
      href: "#read-08", halftone: true,
    },
  ];

  const exploreLinks = [
    { label: "Releases", href: "#releases" }, { label: "Creators", href: "#creators" },
    { label: "Shop", href: "#shop" }, { label: "Events", href: "#events" },
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "#terms" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Legal Indicia", href: "#indicia", external: true },
    { label: "Contact Us", href: "#contact" },
  ];

  const tiers = [
    {
      name: "NEWSSTAND", price: "$9", chip: "Starter",
      sub: "For curious readers picking up the habit.",
      headerBg: "bg-tertiary-fixed", titleClass: "text-on-surface", subClass: "text-on-surface-variant",
      iconClass: "text-tertiary", btnClass: "bg-tertiary text-on-tertiary",
      features: [
        "1 print issue per month",
        "Digital archive (30-day window)",
        "Member-only newsletter",
      ],
      href: "#join-newsstand", featured: false,
    },
    {
      name: "FOLD-OUT", price: "$19", chip: "Reader",
      sub: "Two issues, full access, real talk with the makers.",
      headerBg: "bg-primary", titleClass: "text-on-primary", subClass: "text-primary-fixed",
      iconClass: "text-primary", btnClass: "bg-primary text-on-primary",
      features: [
        "2 print issues per month",
        "Full digital archive (always-on)",
        "Quarterly creator interviews",
        "Members-only digital extras",
      ],
      href: "#join-foldout", featured: true,
    },
    {
      name: "LIMITED RUN", price: "$39", chip: "Collector",
      sub: "Variant covers, signed prints, the whole catalog.",
      headerBg: "bg-on-surface", titleClass: "text-surface", subClass: "text-outline-variant",
      iconClass: "text-on-surface", btnClass: "bg-on-surface text-surface",
      features: [
        "3 print issues + variant cover",
        "Full digital archive + early access",
        "Signed art print quarterly",
        "Annual hardcover collection",
        "Free shipping (worldwide)",
      ],
      href: "#join-limited", featured: false,
    },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "secondary": "#745c00", "on-primary": "#ffffff", "on-secondary-fixed-variant": "#574500",
            "tertiary-fixed-dim": "#9ecaff", "primary-fixed-dim": "#ffb3b1", "surface-bright": "#fff8f7",
            "on-secondary-container": "#705900", "tertiary-fixed": "#d1e4ff", "surface-container": "#ffe9e8",
            "tertiary-container": "#3278b9", "on-surface-variant": "#5b403f", "outline": "#8f6f6e",
            "primary-fixed": "#ffdad8", "on-error": "#ffffff", "surface-container-highest": "#f9dcda",
            "surface-variant": "#f9dcda", "surface-tint": "#bb152c", "secondary-fixed": "#ffe089",
            "inverse-surface": "#3e2c2b", "on-tertiary-fixed": "#001d36", "inverse-on-surface": "#ffedeb",
            "on-surface": "#271717", "surface-container-lowest": "#ffffff", "on-primary-container": "#fffbff",
            "surface": "#fff8f7", "secondary-container": "#fcd03d", "inverse-primary": "#ffb3b1",
            "error": "#ba1a1a", "primary-container": "#db313f", "primary": "#b7102a",
            "surface-container-high": "#ffe1e0", "tertiary": "#035f9f", "surface-container-low": "#fff0ef",
            "error-container": "#ffdad6", "secondary-fixed-dim": "#edc22e", "on-primary-fixed": "#410007",
            "on-primary-fixed-variant": "#92001c", "outline-variant": "#e4bebc", "on-error-container": "#93000a",
            "background": "#fff8f7", "on-secondary": "#ffffff", "on-tertiary": "#ffffff",
            "on-background": "#271717", "on-secondary-fixed": "#241a00", "on-tertiary-fixed-variant": "#00497c",
            "on-tertiary-container": "#fdfcff", "surface-dim": "#f1d3d2"
          },
          fontFamily: {
            "headline-lg": ["Bangers", "system-ui", "sans-serif"],
            "label-bold": ["Space Grotesk", "system-ui", "sans-serif"],
            "body-md": ["Space Grotesk", "system-ui", "sans-serif"],
            "headline-md": ["Bangers", "system-ui", "sans-serif"],
            "body-lg": ["Space Grotesk", "system-ui", "sans-serif"],
            "headline-xl": ["Bangers", "system-ui", "sans-serif"]
          },
          fontSize: {
            "headline-xl": ["clamp(3.5rem, 8vw, 5rem)", { lineHeight: "1.0", letterSpacing: "2px", fontWeight: "400" }],
            "headline-lg": ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.1", fontWeight: "400" }],
            "headline-md": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2", fontWeight: "400" }],
            "body-lg": ["clamp(1.125rem, 2vw, 1.25rem)", { lineHeight: "1.6", fontWeight: "700" }],
            "body-md": ["clamp(1rem, 1.5vw, 1.125rem)", { lineHeight: "1.6", fontWeight: "500" }],
            "label-bold": ["clamp(0.875rem, 1vw, 1rem)", { lineHeight: "1.2", fontWeight: "900", letterSpacing: "0.05em" }]
          }
        }
      }
    }
  `;

  const tailwindStyles = `
    @layer base {
      body {
        @apply bg-[#F6EFD8] text-on-surface font-body-md min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-surface;
      }
    }
    @layer utilities {
      .comic-border { @apply border-[4px] md:border-[5px] border-on-surface; }
      .comic-shadow { @apply shadow-[4px_4px_0px_0px_#271717] md:shadow-[6px_6px_0px_0px_#271717]; }
      .comic-shadow-sm { @apply shadow-[2px_2px_0px_0px_#271717] md:shadow-[4px_4px_0px_0px_#271717]; }
      .hover-btn-fx { @apply transition-all duration-150 motion-reduce:transition-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#271717] active:translate-y-1 active:translate-x-1 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2; }
      .hover-card-fx { @apply transition-all duration-300 motion-reduce:transition-none hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_#271717] focus-within:outline-none focus-within:ring-4 focus-within:ring-primary focus-within:ring-offset-4 focus-within:ring-offset-tertiary-fixed; }
      .nav-link-fx { @apply px-4 py-1.5 font-label-bold uppercase tracking-widest text-on-surface transition-all duration-150 motion-reduce:transition-none border-[3px] border-transparent hover:bg-secondary-container hover:border-on-surface hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_#271717] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none focus-visible:outline-none focus-visible:bg-secondary-container focus-visible:border-on-surface; }
      .icon-btn-fx { @apply text-primary transition-all duration-150 motion-reduce:transition-none hover:text-tertiary hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-1.5; }
      .halftone-blue {
        background-image: radial-gradient(#035f9f 20%, transparent 20%), radial-gradient(#035f9f 20%, transparent 20%);
        background-color: #d1e4ff; background-position: 0 0, 10px 10px; background-size: 20px 20px;
      }
      .halftone-red {
        background-image: radial-gradient(#b7102a 20%, transparent 20%), radial-gradient(#b7102a 20%, transparent 20%);
        background-color: #ffdad8; background-position: 0 0, 10px 10px; background-size: 20px 20px;
      }
      .halftone-yellow {
        background-image: radial-gradient(#745c00 20%, transparent 20%), radial-gradient(#745c00 20%, transparent 20%);
        background-color: #ffe089; background-position: 0 0, 10px 10px; background-size: 20px 20px;
      }
    }
  `;

  const FooterNav = ({ heading, links }) => (
    <nav aria-label={`Footer ${heading} Navigation`} className="flex flex-col gap-4">
      <h2 className="font-headline-md text-on-surface uppercase border-b-[3px] border-on-surface pb-2 inline-block self-start w-full max-w-[200px]">{heading}</h2>
      <div className="flex flex-col gap-3 font-label-bold uppercase tracking-wide">
        {links.map(l => (
          <a key={l.label} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener" : undefined}
            className="text-on-surface-variant hover:text-primary focus-visible:text-primary focus-visible:outline-none w-fit transition-colors flex items-center group">
            <span className="material-symbols-outlined text-sm opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 mr-2">arrow_forward</span> {l.label}
          </a>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Space+Grotesk:wght@400;500;700;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style type="text/tailwindcss" dangerouslySetInnerHTML={{ __html: tailwindStyles }} />

      <div className="light bg-[#F6EFD8] text-on-surface font-body-md min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-surface">
        <header className="bg-[#fdfcf0] border-b-[5px] border-on-surface shadow-[0_4px_0_0_#271717] sticky top-0 z-50">
          <div className="max-w-[2560px] mx-auto flex items-center justify-between px-4 md:px-8 py-3 w-full gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-8">
              <a href="/" className="text-2xl md:text-3xl font-black italic bg-secondary-container text-on-surface px-5 py-1 border-[4px] border-on-surface shadow-[4px_4px_0_0_#271717] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_0_#271717] transition-all -rotate-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 whitespace-nowrap">
                BIG PANEL!
              </a>
              <nav className="hidden lg:flex gap-1" aria-label="Primary navigation">
                {navLinks.map(l => <a key={l.label} className="nav-link-fx" href={l.href}>{l.label}</a>)}
              </nav>
            </div>
            <div className="flex items-center gap-3 md:gap-5">
              <a href="#subscribe" className="hidden md:inline-flex bg-tertiary text-on-tertiary font-label-bold uppercase px-6 py-2 comic-border comic-shadow-sm hover-btn-fx">Subscribe</a>
              <button aria-label="Shopping Cart" className="icon-btn-fx group">
                <span className="material-symbols-outlined group-hover:font-medium" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              </button>
              <button aria-label="User Profile" className="icon-btn-fx group">
                <span className="material-symbols-outlined group-hover:font-medium" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </button>
              <button aria-label="Open mobile menu" className="lg:hidden icon-btn-fx text-on-surface hover:text-primary">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <section id="hero" className="relative w-full border-b-[5px] border-on-surface overflow-hidden flex flex-col md:flex-row min-h-[75vh] xl:min-h-[800px] bg-[#F6EFD8]">
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-between items-center md:items-stretch z-10 relative gap-10 min-h-[80vh] md:min-h-0">
              <div className="relative w-full max-w-[600px] md:max-w-[680px] self-center md:self-start">
                <div className="absolute inset-0 bg-primary comic-border comic-shadow -rotate-6 translate-x-2 md:translate-x-4 translate-y-2 md:translate-y-4"></div>
                <div className="relative bg-secondary-container comic-border p-8 md:p-10 -rotate-3 text-center">
                  <h1 className="font-headline-xl text-on-surface uppercase text-[5rem] sm:text-[6.5rem] md:text-[7.5rem] lg:text-[8.5rem] leading-[0.92] tracking-[3px] drop-shadow-[5px_5px_0_#b7102a] md:drop-shadow-[7px_7px_0_#b7102a] text-balance">
                    BIG PANEL!
                  </h1>
                </div>
              </div>
              <div className="flex flex-col md:flex-row flex-wrap md:items-end gap-6 md:gap-6 w-full">
                <div className="relative w-full md:max-w-[420px] md:flex-1 md:min-w-[260px] group">
                  <div className="bg-surface-container-lowest comic-border p-6 md:p-8 rounded-2xl relative z-10 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#271717] transition-all duration-300 motion-reduce:transition-none text-center md:text-left">
                    <p className="font-headline-md text-on-surface mb-3 text-balance">Comics, printed and delivered monthly.</p>
                    <p className="font-body-md text-on-surface-variant text-pretty max-w-[40ch] mx-auto md:mx-0">
                      Join the ultimate indie comic subscription. Get exclusive access to limited print runs, creator interviews, and our complete digital archives.
                    </p>
                    <div className="absolute -bottom-4 right-8 w-8 h-8 bg-surface-container-lowest border-r-[5px] border-b-[5px] border-on-surface rotate-45"></div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end w-full">
                  <a href="#subscribe" className="shrink-0 inline-flex items-center justify-center gap-3 bg-primary text-on-primary font-headline-md uppercase text-2xl md:text-3xl lg:text-4xl px-10 md:px-14 lg:px-16 py-5 md:py-6 lg:py-7 comic-border comic-shadow hover-btn-fx tracking-wider whitespace-nowrap rotate-[-2deg] hover:rotate-0 active:rotate-1 shadow-[8px_8px_0_0_#271717] hover:shadow-[12px_12px_0_0_#271717] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 ml-auto">
                    <span aria-hidden="true" className="material-symbols-outlined text-3xl md:text-4xl">bolt</span>
                    SUBSCRIBE NOW!
                    <span aria-hidden="true" className="material-symbols-outlined text-3xl md:text-4xl">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 min-h-[400px] md:min-h-full comic-border border-l-0 md:border-l-[5px] border-t-[5px] md:border-t-0 relative">
              <div className="absolute inset-0 halftone-blue opacity-80 z-0"></div>
              <img alt="Dramatic high-contrast editorial portrait reading as a halftone-print comic panel close-up" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 z-10 grayscale contrast-150" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85&auto=format&fit=crop" width="1000" height="800" fetchpriority="high" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-color z-20"></div>
            </div>
          </section>

          <section id="issues" className="p-6 md:p-8 lg:p-12 xl:p-16 bg-tertiary-fixed scroll-margin-top-24">
            <div className="max-w-[2560px] mx-auto">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 mb-10 md:mb-12">
                <div className="bg-surface-container-lowest comic-border comic-shadow p-4 md:p-6 inline-block -rotate-2">
                  <h2 className="font-headline-lg uppercase text-on-surface">CURRENT ISSUES</h2>
                </div>
                <p className="font-body-lg text-on-surface max-w-2xl text-pretty bg-surface-container-lowest p-4 comic-border inline-block comic-shadow-sm translate-y-[-0.5rem] rotate-1">
                  Dive into our latest releases. Hand-crafted stories from top indie creators, printed on high-quality stock.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {issues.map(it => (
                  <article key={it.title} className="bg-surface-container-lowest comic-border comic-shadow hover-card-fx flex flex-col group relative">
                    <div className={`h-64 sm:h-72 lg:h-80 border-b-[4px] md:border-b-[5px] border-on-surface relative overflow-hidden ${it.coverBg}`}>
                      {it.halftone && <div className="absolute inset-0 halftone-red opacity-50 z-0"></div>}
                      <img alt={it.title} className={`w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500 motion-reduce:transition-none ${it.halftone ? "mix-blend-multiply relative z-10" : ""}`} src={it.img} width="400" height="600" loading="lazy" decoding="async" />
                      <div className={`absolute top-0 right-0 bg-secondary-container border-b-[4px] border-l-[4px] border-on-surface px-4 py-2 font-headline-md text-on-surface ${it.halftone ? "z-20" : "z-10"} tabular-nums`}>{it.n}</div>
                      <div className={`absolute bottom-2 left-2 ${it.tagBg} font-label-bold px-3 py-1 border-[3px] ${it.halftone ? "shadow-[2px_2px_0px_0px_#b7102a]" : "border-on-surface shadow-[2px_2px_0px_0px_#271717]"} uppercase ${it.halftone ? "z-20" : "z-10"} text-xs tracking-widest`}>{it.tag}</div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow bg-white z-0">
                      <h3 className="font-headline-md uppercase mb-1 text-on-surface line-clamp-1" title={it.title}>{it.title}</h3>
                      <p className="font-label-bold text-tertiary mb-3 uppercase text-xs tracking-wider">{it.by}</p>
                      <p className="font-body-md text-on-surface-variant flex-grow mb-6 line-clamp-3 text-pretty">{it.desc}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-outline-variant border-dashed">
                        <span className="font-headline-md text-on-surface tabular-nums">{it.price}</span>
                        <a href={it.href} aria-label={`Read ${it.title} Issue ${it.n}`} className="bg-primary text-on-primary font-label-bold border-[3px] border-on-surface py-2 px-5 text-center hover-btn-fx uppercase text-sm tracking-widest">
                          Read Issue
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="subscribe" className="p-6 md:p-8 lg:p-12 xl:p-16 bg-[#F6EFD8] border-t-[5px] border-on-surface scroll-margin-top-24">
            <div className="max-w-[2560px] mx-auto">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 mb-12 md:mb-16">
                <div className="bg-primary comic-border comic-shadow p-4 md:p-6 inline-block rotate-2">
                  <h2 className="font-headline-lg uppercase text-on-primary">JOIN THE CLUB</h2>
                </div>
                <p className="font-body-lg text-on-surface max-w-2xl text-pretty bg-surface-container-lowest p-4 comic-border inline-block comic-shadow-sm translate-y-[-0.5rem] -rotate-1">
                  Pick your fold. Every plan ships fresh ink to your door — only the heft and perks change.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-14 gap-x-6 md:gap-10 pt-12 md:pt-14">
                {tiers.map(t => (
                  <article key={t.name} className={`bg-surface-container-lowest comic-border comic-shadow flex flex-col group relative hover-card-fx ${t.featured ? "md:-translate-y-4 lg:-translate-y-6" : ""}`}>
                    {t.featured && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-primary text-on-primary comic-border comic-shadow-sm font-headline-md uppercase px-4 py-1 -rotate-2 whitespace-nowrap">Most Popular</div>
                      </div>
                    )}
                    <div className={`${t.headerBg} border-b-[4px] md:border-b-[5px] border-on-surface p-6 md:p-8 relative`}>
                      <div className="absolute -top-4 -right-4 bg-secondary-container comic-border px-4 py-1 font-label-bold uppercase text-xs tracking-widest -rotate-3 shadow-[2px_2px_0px_0px_#271717]">{t.chip}</div>
                      <h3 className={`font-headline-lg uppercase ${t.titleClass} mb-2`}>{t.name}</h3>
                      <p className={`font-body-md ${t.subClass} text-pretty`}>{t.sub}</p>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                      <div className="flex items-baseline gap-2 mb-6 pb-6 border-b-2 border-outline-variant border-dashed">
                        <span className="font-headline-xl text-on-surface tabular-nums text-[3rem] leading-none">{t.price}</span>
                        <span className="font-label-bold text-on-surface-variant uppercase tracking-widest text-sm">/ month</span>
                      </div>
                      <ul className="font-body-md text-on-surface flex flex-col gap-3 mb-8 flex-grow">
                        {t.features.map(f => (
                          <li key={f} className="flex items-start gap-3">
                            <span className={`material-symbols-outlined ${t.iconClass} mt-0.5 flex-shrink-0`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <a href={t.href} className={`${t.btnClass} font-label-bold border-[4px] border-on-surface py-3 px-6 text-center hover-btn-fx uppercase tracking-widest comic-shadow-sm`}>Subscribe</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* AS SEEN ON — trusted-by row */}
          <section className="p-6 md:p-8 lg:p-12 xl:p-16 bg-secondary-container border-t-[5px] border-on-surface">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-end justify-between mb-8 flex-wrap gap-4 border-b-[3px] border-on-surface pb-4">
                <h2 className="font-headline-lg text-on-surface text-4xl md:text-5xl uppercase tracking-wider">As seen on</h2>
                <span className="font-label-bold text-on-surface text-xs uppercase tracking-widest hidden md:inline">/// shelves · stages · feeds ///</span>
              </div>
              <ul role="list" className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-x-8 gap-y-9 items-center justify-items-center bg-surface-container-lowest comic-border p-6 md:p-8">
                {[
                  { slug: "behance", name: "Behance" },
                  { slug: "dribbble", name: "Dribbble" },
                  { slug: "instagram", name: "Instagram" },
                  { slug: "pinterest", name: "Pinterest" },
                  { slug: "substack", name: "Substack" },
                  { slug: "medium", name: "Medium" },
                  { slug: "etsy", name: "Etsy" },
                  { slug: "twitch", name: "Twitch" },
                  { slug: "spotify", name: "Spotify" },
                ].map(b => (
                  <li key={b.slug} className="flex flex-col items-center gap-2">
                    <img src={`https://cdn.simpleicons.org/${b.slug}/271717`} alt={b.name} className="h-8 w-auto" loading="lazy" decoding="async" width="32" height="32" />
                    <span className="font-label-bold text-[9px] uppercase tracking-[0.2em] text-on-surface">{b.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* HOUSE RULES — Premium 2x2 cards with icons */}
          <section className="p-6 md:p-8 lg:p-12 xl:p-16 bg-tertiary-fixed border-t-[5px] border-on-surface">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4 border-b-[3px] border-on-surface pb-4">
                <div>
                  <span className="inline-block bg-on-surface text-surface font-label-bold text-[10px] uppercase tracking-[0.3em] px-2 py-1 mb-3">/// House rules ///</span>
                  <h2 className="font-headline-lg text-on-surface text-4xl md:text-6xl uppercase tracking-wider">Four panels we live by</h2>
                </div>
                <span className="font-label-bold text-on-surface text-xs uppercase tracking-widest hidden md:inline">/// printed in every back-cover ///</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[
                  { id: "PANEL · 01", icon: "brush", iconBg: "bg-primary text-on-primary", rotate: "rotate-[-3deg]", title: "Creator-owned, always.", body: "No work-for-hire. No moral-rights waivers. Every page in the catalog still belongs to the artist who drew it — they take 70% on the issue, 100% on the IP.", left: "Royalty · 70%", right: "IP · creator", rightBg: "bg-secondary-container" },
                  { id: "PANEL · 02", icon: "print", iconBg: "bg-tertiary text-on-tertiary", rotate: "rotate-[3deg]", title: "Print on stock that lasts.", body: "120 gsm uncoated, soy ink, glue-spine — every issue is built to outlive the website. Reprints are open until the run sells out, then the plate is destroyed.", left: "Stock · 120 gsm", right: "Soy ink", rightBg: "bg-tertiary-container text-on-tertiary" },
                  { id: "PANEL · 03", icon: "local_post_office", iconBg: "bg-secondary-container text-on-surface", rotate: "rotate-[-2deg]", title: "Posted by hand, every month.", body: "Each subscriber's package is hand-stamped at the BIG PANEL warehouse. Postage paid; tracking included; one creator note slipped in by the founder herself.", left: "Ship · 1st of month", right: "Tracked · always", rightBg: "bg-primary text-on-primary" },
                  { id: "PANEL · 04", icon: "groups", iconBg: "bg-on-surface text-surface", rotate: "rotate-[2deg]", title: "Champion the strange ones.", body: "If a story scares the algorithms, it gets a panel here. The catalog leans toward the difficult, the political, the joyfully weird — read them in print before the feeds catch up.", left: "Catalog · 84 series", right: "Strange · always", rightBg: "bg-secondary-container" },
                ].map(p => (
                  <article key={p.id} className="bg-surface-container-lowest comic-border p-6 md:p-8 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#271717] transition-all duration-200 motion-reduce:transition-none">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-14 h-14 comic-border flex items-center justify-center ${p.iconBg} ${p.rotate}`}>
                        <span className="material-symbols-outlined text-[28px]" aria-hidden="true">{p.icon}</span>
                      </div>
                      <span className="font-headline-md text-on-surface text-xl">{p.id}</span>
                    </div>
                    <h3 className="font-headline-md text-on-surface text-2xl md:text-3xl uppercase mb-3 tracking-wide">{p.title}</h3>
                    <p className="font-body-md text-on-surface text-base leading-relaxed mb-4">{p.body}</p>
                    <div className="flex items-baseline justify-between border-t-[3px] border-on-surface pt-3 font-label-bold text-[10px] uppercase tracking-[0.3em] text-on-surface">
                      <span>{p.left}</span>
                      <span className={`${p.rightBg} px-2 py-0.5`}>{p.right}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ALTERNATING SECTION A — image LEFT, content RIGHT */}
          <section className="p-6 md:p-8 lg:p-12 xl:p-16 bg-[#F6EFD8] border-t-[5px] border-on-surface">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-7 relative">
                <div className="relative aspect-[4/3] overflow-hidden comic-border bg-tertiary">
                  <div className="absolute inset-0 halftone-blue opacity-70 z-0"></div>
                  <img src="https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=1400&q=85&auto=format&fit=crop" alt="Editorial portrait — close framing in dramatic light, halftone print register" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 z-10 grayscale contrast-150" loading="lazy" decoding="async" width="1400" height="1050" />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-color z-20"></div>
                  <div className="absolute top-4 left-4 z-30 bg-secondary-container text-on-surface comic-border px-3 py-1 font-label-bold text-[10px] uppercase tracking-[0.3em] rotate-[-3deg]">Issue 042 · cover</div>
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col justify-center">
                <span className="inline-block bg-primary text-on-primary font-label-bold text-[10px] uppercase tracking-[0.3em] px-2 py-1 mb-4 w-fit">/// CHAPTER A · STUDIO ///</span>
                <h2 className="font-headline-lg text-on-surface text-4xl md:text-6xl uppercase leading-[0.95] tracking-wider mb-5">Drawn at the big table.</h2>
                <p className="font-body-md text-on-surface text-base md:text-lg leading-relaxed mb-4">Every cover, every interior page, every back-matter ad — ruled and inked at one long oak table on the third floor of the warehouse. No Figma boards, no AI assists, no remote pen-pals.</p>
                <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-6">Light from the north window. Bristol stock by Strathmore. Ink by Speedball. Music kept to one pair of headphones at a time.</p>
                <ul className="flex flex-col gap-3 font-label-bold text-[11px] uppercase tracking-[0.25em] text-on-surface border-t-[3px] border-on-surface pt-5">
                  <li className="flex justify-between"><span>Table · oak · 3.6 m</span><span className="text-primary">Since 2017</span></li>
                  <li className="flex justify-between"><span>Stock · Bristol 270 gsm</span><span className="text-primary">Strathmore</span></li>
                  <li className="flex justify-between"><span>Headphones · 1 pair</span><span className="text-primary">No exceptions</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* ALTERNATING SECTION B — image RIGHT, content LEFT */}
          <section className="p-6 md:p-8 lg:p-12 xl:p-16 bg-tertiary-fixed border-t-[5px] border-on-surface">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1">
                <span className="inline-block bg-tertiary text-on-tertiary font-label-bold text-[10px] uppercase tracking-[0.3em] px-2 py-1 mb-4 w-fit md:self-end">/// CHAPTER B · PRESS ///</span>
                <h2 className="font-headline-lg text-on-surface text-4xl md:text-6xl uppercase leading-[0.95] tracking-wider mb-5 md:text-right">Printed at midnight.</h2>
                <p className="font-body-md text-on-surface text-base md:text-lg leading-relaxed mb-4 md:text-right">Two-colour offset on a 1976 Heidelberg, run by a printer who has been on that machine since 1989. The press starts at 22:00, finishes by 04:00 — that's the whole month's run, every month.</p>
                <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-6 md:text-right">No digital print, no print-on-demand. The screw, the rubber blanket, the ink-fountain — the same ones that printed our first issue in 2017.</p>
                <ul className="flex flex-col gap-3 font-label-bold text-[11px] uppercase tracking-[0.25em] text-on-surface border-t-[3px] border-on-surface pt-5">
                  <li className="flex justify-between"><span className="text-tertiary">Heidelberg · 1976</span><span>Press · GTO 52</span></li>
                  <li className="flex justify-between"><span className="text-tertiary">22:00 → 04:00</span><span>Run · 1 night</span></li>
                  <li className="flex justify-between"><span className="text-tertiary">Two-colour · offset</span><span>Soy · always</span></li>
                </ul>
              </div>
              <div className="md:col-span-7 relative order-1 md:order-2">
                <div className="relative aspect-[4/3] overflow-hidden comic-border bg-primary">
                  <div className="absolute inset-0 halftone-red opacity-70 z-0"></div>
                  <img src="https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1400&q=85&auto=format&fit=crop" alt="Profile portrait — high-contrast B&amp;W reading as printed comic frame" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 z-10 grayscale contrast-150" loading="lazy" decoding="async" width="1400" height="1050" />
                  <div className="absolute inset-0 bg-tertiary/20 mix-blend-color z-20"></div>
                  <div className="absolute top-4 right-4 z-30 bg-on-surface text-surface comic-border px-3 py-1 font-label-bold text-[10px] uppercase tracking-[0.3em] rotate-[3deg]">Press · 22:00</div>
                </div>
              </div>
            </div>
          </section>

          {/* COVER WALL — 7-up static comic-portrait strip */}
          <section className="p-6 md:p-8 lg:p-12 xl:p-16 bg-surface-container border-t-[5px] border-on-surface">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-end justify-between mb-8 flex-wrap gap-4 border-b-[3px] border-on-surface pb-4">
                <h2 className="font-headline-lg text-on-surface text-4xl md:text-5xl uppercase tracking-wider">Cover wall · vol. 04</h2>
                <span className="font-label-bold text-on-surface text-xs uppercase tracking-widest hidden md:inline">/// 7 of 84 catalog covers ///</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-4">
                {[
                  { n: "042", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=85&auto=format&fit=crop", alt: "Cover 042 · editorial portrait halftone", bg: "bg-primary", halftone: "halftone-red" },
                  { n: "041", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=85&auto=format&fit=crop", alt: "Cover 041 · younger figure in soft light", bg: "bg-tertiary", halftone: "halftone-blue" },
                  { n: "040", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=400&q=85&auto=format&fit=crop", alt: "Cover 040 · profile in chiaroscuro", bg: "bg-secondary-container", halftone: "halftone-yellow" },
                  { n: "039", img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&q=85&auto=format&fit=crop", alt: "Cover 039 · low-key studio portrait", bg: "bg-primary", halftone: "halftone-red" },
                  { n: "038", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=85&auto=format&fit=crop", alt: "Cover 038 · dramatic editorial figure", bg: "bg-tertiary", halftone: "halftone-blue" },
                  { n: "037", img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&q=85&auto=format&fit=crop", alt: "Cover 037 · figure in coat", bg: "bg-secondary-container", halftone: "halftone-yellow" },
                  { n: "036", img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=400&q=85&auto=format&fit=crop", alt: "Cover 036 · close framing portrait", bg: "bg-primary", halftone: "halftone-red" },
                ].map(c => (
                  <figure key={c.n} className="group relative">
                    <div className={`relative aspect-square overflow-hidden comic-border ${c.bg}`}>
                      <div className={`absolute inset-0 ${c.halftone} opacity-70 z-0`}></div>
                      <img src={c.img} alt={c.alt} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 z-10 grayscale contrast-150" loading="lazy" decoding="async" width="400" height="400" />
                      <span className="absolute bottom-1 left-1 z-30 bg-on-surface text-surface px-1.5 py-0.5 font-label-bold text-[9px] uppercase tracking-widest">№ {c.n}</span>
                    </div>
                  </figure>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t-[3px] border-on-surface flex flex-col md:flex-row items-center justify-between gap-3 font-label-bold text-[11px] uppercase tracking-widest">
                <span className="text-on-surface">/// vol 04 · panels 036 → 042</span>
                <a href="#" className="bg-on-surface text-surface px-4 py-2 hover:bg-primary transition-colors">Browse 84 covers →</a>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#fdfcf0] border-t-[5px] border-on-surface px-6 py-12 md:px-12 md:py-16 w-full">
          <div className="max-w-[2560px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <a href="/" className="font-headline-lg text-on-surface border-[4px] border-on-surface px-5 py-1 inline-block self-start bg-secondary-container -rotate-2 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary whitespace-nowrap">
                BIG PANEL!
              </a>
              <p className="font-body-md text-on-surface-variant max-w-md text-pretty">
                Independent comics printed with passion, delivered to your door. We champion creator-owned stories, bold artwork, and the undeniable tactile joy of fresh newsprint.
              </p>
              <div className="mt-auto pt-6">
                <p className="font-label-bold text-on-surface uppercase tracking-widest text-xs">© 2024 BIG PANEL COMICS.</p>
                <p className="font-label-bold text-on-surface-variant uppercase tracking-widest text-xs mt-1">PRINTED IN THE USA. EST. 1964.</p>
              </div>
            </div>
            <FooterNav heading="Explore" links={exploreLinks} />
            <FooterNav heading="Legal & Info" links={legalLinks} />
          </div>
        </footer>
      </div>
    </>
  );
}
