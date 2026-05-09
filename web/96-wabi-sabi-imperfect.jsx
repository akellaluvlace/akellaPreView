export default function T96WabiSabiImperfect() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&family=Noto+Serif:wght@500&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "on-error-container": "#93000a",
                "on-secondary-container": "#785e40",
                "tertiary": "#675c56",
                "surface-bright": "#fff8f3",
                "tertiary-fixed-dim": "#d3c4bb",
                "on-primary": "#ffffff",
                "on-secondary-fixed": "#291802",
                "on-background": "#1e1b17",
                "surface": "#fff8f3",
                "surface-container-high": "#eee7e0",
                "primary-fixed-dim": "#cbc6bb",
                "tertiary-fixed": "#efdfd7",
                "error-container": "#ffdad6",
                "on-tertiary-fixed": "#221a15",
                "on-primary-fixed": "#1d1c14",
                "surface-container-low": "#faf2ec",
                "error": "#ba1a1a",
                "on-surface": "#1e1b17",
                "surface-tint": "#615e55",
                "on-secondary-fixed-variant": "#594227",
                "on-tertiary-container": "#756963",
                "surface-container-lowest": "#ffffff",
                "surface-variant": "#e8e1db",
                "primary-fixed": "#e8e2d6",
                "inverse-on-surface": "#f7efe9",
                "on-tertiary-fixed-variant": "#4f453f",
                "secondary-fixed-dim": "#e2c19d",
                "tertiary-container": "#fcebe3",
                "on-primary-fixed-variant": "#49473e",
                "outline": "#7a776e",
                "primary-container": "#f4eee2",
                "inverse-primary": "#cbc6bb",
                "on-error": "#ffffff",
                "on-secondary": "#ffffff",
                "surface-container": "#f4ede6",
                "secondary": "#735a3c",
                "secondary-fixed": "#ffddb8",
                "secondary-container": "#fddab4",
                "on-primary-container": "#6f6c62",
                "primary": "#615e55",
                "outline-variant": "#cbc6bc",
                "on-surface-variant": "#49473f",
                "inverse-surface": "#33302c",
                "surface-dim": "#e0d9d2",
                "on-tertiary": "#ffffff",
                "background": "#fff8f3",
                "surface-container-highest": "#e8e1db"
              },
              borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
              spacing: {
                "container-padding": "5vw",
                "unit": "4px",
                "xs": "0.5rem",
                "sm": "1rem",
                "md": "2rem",
                "lg": "4rem",
                "xl": "8rem"
              },
              fontFamily: {
                "label-caps": ["Inter", "sans-serif"],
                "display-lg": ["Newsreader", "serif"],
                "display-xl": ["Newsreader", "serif"],
                "body-lg": ["Inter", "sans-serif"],
                "headline-md": ["Newsreader", "serif"],
                "body-md": ["Inter", "sans-serif"],
                "japanese-accent": ["Noto Serif", "serif"]
              },
              fontSize: {
                "label-caps": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "600" }],
                "display-lg": ["clamp(2.5rem, 5vw, 3rem)", { lineHeight: "1.2", fontWeight: "400" }],
                "display-xl": ["clamp(3rem, 7vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
                "body-lg": ["clamp(1rem, 2vw, 1.125rem)", { lineHeight: "1.7", fontWeight: "400" }],
                "headline-md": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3", fontWeight: "400" }],
                "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
                "japanese-accent": ["0.875rem", { lineHeight: "2", letterSpacing: "0.1em", fontWeight: "500" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        ::selection { background-color: #ffddb8; color: #291802; }
      ` }} />

      <div className="bg-primary-container text-on-surface antialiased min-h-screen flex flex-col font-body-md text-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">

        <header className="bg-primary-container dark:bg-stone-950 text-stone-800 dark:text-stone-200 font-headline-md italic tracking-tight top-0 border-b border-stone-300/30 dark:border-stone-800/30 w-full z-50 absolute">
          <div className="flex justify-between items-baseline px-8 md:px-20 py-10 w-full max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-light tracking-[0.2em] text-stone-900 dark:text-stone-100 not-italic">
              <a href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-100 rounded-sm">TSUKI 月窯</a>
            </h1>
            <nav className="hidden md:flex gap-12 items-center not-italic font-body-md">
              <a className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-100 rounded-sm px-2 py-1 -mx-2" href="#work">Current Work</a>
              <a className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-100 rounded-sm px-2 py-1 -mx-2" href="#kiln">The Kiln</a>
              <a className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-100 rounded-sm px-2 py-1 -mx-2" href="#process">Process</a>
              <a className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-100 rounded-sm px-2 py-1 -mx-2" href="#contact">Contact</a>
            </nav>
            <a className="hidden md:block not-italic opacity-90 hover:opacity-100 transition-opacity duration-300 text-stone-900 dark:text-stone-50 border-b border-stone-900 dark:border-stone-100 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-100 focus-visible:ring-offset-4 focus-visible:ring-offset-primary-container rounded-sm" href="#work">
              See current work
            </a>
          </div>
        </header>

        <main className="flex-grow pt-[120px]">
          <section className="min-h-[70vh] lg:min-h-[870px] relative flex items-center px-container-padding overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(115,90,60,0.04) 0px, rgba(115,90,60,0.04) 1px, transparent 1px, transparent 14px)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(226,193,157,0.18) 0%, transparent 55%)" }}></div>
            <div className="max-w-[1500px] mx-auto w-full grid md:grid-cols-12 gap-10 md:gap-16 items-center relative">
              <div className="md:col-span-5 flex flex-col gap-8">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em]">月窯 · Tsuki Kiln</span>
                <h2 className="font-display-xl text-display-xl text-on-background italic leading-[1.05] text-balance">
                  Wood-fired<br /><span className="not-italic font-light tracking-tight">·</span> <span className="text-surface-tint">Kyoto</span>
                </h2>
                <p className="font-headline-md text-body-lg text-on-surface italic max-w-[48ch] text-pretty leading-relaxed">
                  Vessels born of pine, cedar, and a kiln that breathes for fifteen days at a stretch. Each pot we draw from the anagama carries the chaotic signature of the firing — ash settled in unrepeatable runs, scars where one piece kissed another, a quiet asymmetry that no studio wheel could fake. Since 2014 we have kept the same eight square metres of brick, the same patient calendar, the same belief that a useful thing is allowed to be slightly imperfect, and is in fact more honest for it.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 mt-2">
                  <span className="font-japanese-accent text-japanese-accent text-tertiary uppercase tracking-[0.25em]">Since 2014</span>
                  <a className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest border-b border-outline pb-1 hover:text-surface-tint transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface focus-visible:ring-offset-4 focus-visible:ring-offset-primary-container rounded-sm inline-block" href="#work">
                    See current work
                  </a>
                </div>
              </div>
              <div className="md:col-span-7 relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 border-l border-t border-secondary/40 hidden md:block"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-secondary/40 hidden md:block"></div>
                <img alt="Close-up of a wood-fired ceramic tea bowl on a textured linen surface" className="w-full h-auto object-cover opacity-100 rounded relative" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3tnh55icXU_uzGgEVHAPgaOuPMPIi-kGCUT1BjUIEJM0frQTyFRYNDfIyJw_1kNqH2IWi8xxJC6nGHM31GVLqfqRfaWsk1eL5ZmY9W4OqLgYLqHHIGZYzlal8lu7e_cuvdftENefOWzFECk1i8SDio77gducFrQpFsjQJ_pTKjJj6p5icYEkQc1bbYXiLYlreM4tSgXy7aLX_l_P1bt4GCe-AEYER5QRlwblP7hh49upQkdWwaEZO48L6JUYYhsT0TzbONMkI" fetchPriority="high" loading="eager" />
                <p className="font-headline-md text-sm text-surface-tint mt-4 italic tracking-wide text-right">
                  Tea bowl · Iga clay · ash settled, west chamber, January firing
                </p>
              </div>
            </div>
          </section>

          <section className="relative py-xl px-container-padding bg-surface scroll-mt-12 overflow-hidden" id="work">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] sepia-[0.3] mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3tnh55icXU_uzGgEVHAPgaOuPMPIi-kGCUT1BjUIEJM0frQTyFRYNDfIyJw_1kNqH2IWi8xxJC6nGHM31GVLqfqRfaWsk1eL5ZmY9W4OqLgYLqHHIGZYzlal8lu7e_cuvdftENefOWzFECk1i8SDio77gducFrQpFsjQJ_pTKjJj6p5icYEkQc1bbYXiLYlreM4tSgXy7aLX_l_P1bt4GCe-AEYER5QRlwblP7hh49upQkdWwaEZO48L6JUYYhsT0TzbONMkI" loading="lazy" decoding="async" />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(255,248,243,0.7) 70%)" }} />
            </div>
            <div className="relative z-10 max-w-[1300px] mx-auto">
              <div className="mb-12 md:mb-16">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.25em]">Selected work</span>
                <h2 className="font-display-lg text-display-lg text-on-surface italic mt-3 text-balance">Three from the bench</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-y-20 gap-x-8">

                <article className="md:col-span-5 md:col-start-1 transform rotate-[-1.5deg]">
                  <div className="overflow-hidden rounded shadow-[0_10px_30px_-12px_rgba(60,40,20,0.25)] border border-outline-variant/40 bg-surface-container-lowest">
                    <img alt="Tall Shigaraki vase, three-quarter view, with natural ash glaze ribbon" className="w-full aspect-[4/5] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB74fBX4WQI1lFivWo3m77BKttSAQ6836Y1cNZK5S4LsVsSNBEQu2O7wDzLfqWOrfJo5oSzZ6N5bSnBO4WVxMdRKFFbnm17dsibryfXywUaq9_CLdrSucsECwb6DLPlbVZKa5JTNhQcuVouWpH_I5EV_dSDT40YMxban64KhjktoJJ9KzjNsvWpb4r3imY2OyGQbGOdL_Iyw-ZDXoiS-tyhchomJ2gPCRFllshrUxXlAuK_qLKuj6GVsEP9cm30k6_ic0gEaiL9" loading="lazy" decoding="async" />
                  </div>
                  <div className="mt-5 flex flex-col gap-1 transform rotate-[1.5deg] origin-top-left">
                    <h3 className="font-headline-md text-body-lg text-on-surface italic">Shigaraki Vase</h3>
                    <p className="font-body-md text-sm text-on-surface-variant">H: 24cm · Wood-fired · Nov 2023</p>
                  </div>
                </article>

                <article className="md:col-span-5 md:col-start-8 md:mt-32 transform rotate-[2deg]">
                  <div className="overflow-hidden rounded shadow-[0_12px_32px_-14px_rgba(60,40,20,0.3)] border border-outline-variant/40 bg-surface-container-lowest">
                    <img alt="Flat ceramic plate with deep iron glaze, top-down view" className="w-full aspect-[4/3] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo4j6-SyfKyuACCimlVKlmpWXXaHky7trKqjXzwPN3rEz9Kn1MZgIsLU2tCewE6CmvmCFEeQsu69FCmY1vpDqYyKxn5J0Zajy4CVlg4wC9jT4f76kdvJIl62x3EmhGq4h2P-j1QslSxf0bB57PEU8ENhRypLqhpOh1yR2RJ35Rp0OAp_FL1fHQ8MscZUbQSr5KQCxWa57t7Wkm73wgUGJOf9oPOnQ4NT4VE28-atJ5krmt6TVTBunRaah56QxQCRdYaa_LJhT9" loading="lazy" decoding="async" />
                  </div>
                  <div className="mt-5 flex flex-col gap-1 transform rotate-[-2deg] origin-top-left">
                    <h3 className="font-headline-md text-body-lg text-on-surface italic">Iron Glaze Plate</h3>
                    <p className="font-body-md text-sm text-on-surface-variant">D: 32cm · Gas reduction · Jan 2024</p>
                  </div>
                </article>

                <article className="md:col-span-5 md:col-start-3 md:mt-8 transform rotate-[-2.5deg]">
                  <div className="overflow-hidden rounded shadow-[0_8px_28px_-12px_rgba(60,40,20,0.22)] border border-outline-variant/40 bg-surface-container-lowest">
                    <img alt="Small kohiki chawan tea bowl with subtle crackle glaze" className="w-full aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARtg2-cP62x8WVCX-wyEUP7WMMZ8YP2ZQoJ9HDUbUnLe6AIdn8C3HKbr-gvzk5g5BMXVMbrtRP5VAFBgN45G_eLIZQXGGRvBEZ-KC5NfEWeKgG_ANBKKJMJ1bcDAlEhevyUo6BtBoDxXB6VN_nZ2zbn15cyNelhoN03BPPbxVu_VGRRx_UWvKWzohJuT-gsWEQXZCEcIr98IGb52tb9eObQ7OfeZxrxihmo8QqgIfkWxwUqeJrH_u8ItSCTwIrAr98fiJPg-id" loading="lazy" decoding="async" />
                  </div>
                  <div className="mt-5 flex flex-col gap-1 transform rotate-[2.5deg] origin-top-left">
                    <h3 className="font-headline-md text-body-lg text-on-surface italic">Kohiki Chawan</h3>
                    <p className="font-body-md text-sm text-on-surface-variant">D: 12cm · Wood-fired · Dec 2023</p>
                  </div>
                </article>

              </div>
            </div>
          </section>

          <section className="py-xl bg-surface-container-low px-container-padding scroll-mt-12" id="kiln">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
              <div className="w-full md:w-3/5">
                <img alt="Black and white photograph of a traditional brick wood-firing kiln with flames and smoke" className="w-full h-[50vh] md:h-[614px] object-cover grayscale opacity-80 rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP1rdAkYHVLASc-40NaJ1kHxr7LeMcoMabHqv3O6Db_i9vn_RtmeuDr4PhofeUxCSQEdhI0X-EZTtUY-sQR8mlo4NiiD0rJ_E5_cqCiEeD6mkeKDxrQtECa1ezRIdh1BDGKNCpGJfnsLro3pG_LbBml2dKIttjJhy3k9f9qVdm1Mfv24yHRAXU2IMNRgAutYk8lrlbeWEbMt4rPFAv67PtKM1oNs727IvHnsFmhty1t_DCynej3I0MHqsNcFk0gpnGwqaPpiDA" loading="lazy" decoding="async" />
              </div>
              <div className="w-full md:w-2/5">
                <h2 className="font-display-lg text-display-lg text-on-surface mb-6 md:mb-8 italic text-balance">The Kiln</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-[65ch] text-pretty">
                  A conduit of transformation. Three days of sleepless tending, feeding pine and cedar into the belly of the anagama. We do not control the flame; we negotiate with it. The ash settles where it wills, painting the earth with the chaotic beauty of the fire's breath.
                </p>
              </div>
            </div>
          </section>

          <section className="py-xl bg-surface px-container-padding scroll-mt-12" id="process">
            <h2 className="font-display-lg text-display-lg text-on-surface mb-12 md:mb-16 italic text-center text-balance">Process</h2>
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 justify-center">

              <article className="flex-1 flex flex-col group">
                <div className="overflow-hidden mb-6 h-[50vh] md:h-[512px] rounded">
                  <img alt="Close up of dirty artisan hands shaping wet clay on a spinning potter's wheel" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 motion-reduce:transition-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOqpmdqedqFd_weDAOOFcTaxNADAT6vMjzSWrdYswtvI4CXHyIzr45d-grk70YshCQhmUQZG9zmMzwLRyP1laCssVetiMWKxpGbj3DxWMwOgT1lF9Bdr_rcUgptyFMffVVEaAi2hMcF4FaJHRUVtlJO9JOU4PzJr8ptONHEZBPxYWsQCsZ_Pb6VAarX_c10lcl2-NqMO_0aykrPkAwK175BnbVI7YKip7q5eCYMBp89lV_D-UR5SVjqIHNgi8A3d8ukdTATFBJ" loading="lazy" decoding="async" />
                </div>
                <h3 className="font-label-caps text-label-caps text-surface-tint uppercase tracking-widest border-t border-outline/20 pt-4">01. Throwing</h3>
              </article>

              <article className="flex-1 flex flex-col group md:mt-24">
                <div className="overflow-hidden mb-6 h-[50vh] md:h-[512px] rounded">
                  <img alt="Artisan dipping a bisque fired ceramic bowl into a large bucket of pale glaze" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 motion-reduce:transition-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4hsUELV5Vew10m2deXeX175ajF_D6u5yOfrt0hHoi1wRofcVVd8VNXQ2SYIFiClr36TQKBzTkTBTd5I19-52hsdqmx_RzHUGvODbx2ys_z_cOAfLtjapPV3XaY5gZDoOcM9MJIOtr_koe2R_W6IAglQe2D_QVjbNTUFlt83N_bjCE5_BKZwff0ptUX6VrJMSH3_TPScxpaE8_hSli9MSKGv_HbL9KXhsCkhN0YJafKyoOOtmfygooBO6g8pQl7OvA0KyVDcWD" loading="lazy" decoding="async" />
                </div>
                <h3 className="font-label-caps text-label-caps text-surface-tint uppercase tracking-widest border-t border-outline/20 pt-4">02. Glazing</h3>
              </article>

              <article className="flex-1 flex flex-col group">
                <div className="overflow-hidden mb-6 h-[50vh] md:h-[512px] rounded">
                  <img alt="Intense bright orange glowing fire inside a dark brick kiln chamber" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 motion-reduce:transition-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM2Net7j2l8x_JsOrzThZbR0-6Fg2g0nONzytbyyZ1CwfK7JibzwwJlQ9DhZoJPr1rhd_xqCezZM2dD_O4Rw3cw2Tvj5pKc8YxWT7W2yCtgZ5ADYpwGO7OwC7_Pz5odUfMI5z6hc-FLxdkL2r8C1OIZ1eGEzC4U7CigR9Qpd2z5b1yIhcO25WpLjDFU7F-RJSX-EfILmFXm-MYyFpBzRkQNS5ecUMgOEROmKsczobgJ4RB5OoAKcNoFLC3Nd0Ykc56a10Qxd7h" loading="lazy" decoding="async" />
                </div>
                <h3 className="font-label-caps text-label-caps text-surface-tint uppercase tracking-widest border-t border-outline/20 pt-4">03. Firing</h3>
              </article>

            </div>
          </section>

          <section className="py-xl px-container-padding bg-surface-container-low scroll-mt-12" id="firings">
            <div className="max-w-[1500px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
                <h2 className="font-display-lg text-display-lg text-on-surface italic text-balance">Recent kiln · 2024 firings</h2>
                <p className="font-body-md text-sm text-surface-tint italic max-w-[42ch]">A static row of vessels drawn from the most recent unloadings — left as found, dust still on the rims.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Hero tea bowl re-cropped as the keepsake pot from firing 014" className="w-full h-full object-cover sepia-[0.15] opacity-95" style={{ objectPosition: "30% 40%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3tnh55icXU_uzGgEVHAPgaOuPMPIi-kGCUT1BjUIEJM0frQTyFRYNDfIyJw_1kNqH2IWi8xxJC6nGHM31GVLqfqRfaWsk1eL5ZmY9W4OqLgYLqHHIGZYzlal8lu7e_cuvdftENefOWzFECk1i8SDio77gducFrQpFsjQJ_pTKjJj6p5icYEkQc1bbYXiLYlreM4tSgXy7aLX_l_P1bt4GCe-AEYER5QRlwblP7hh49upQkdWwaEZO48L6JUYYhsT0TzbONMkI" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/15 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 014 · January</figcaption>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Iron-glaze plate from firing 016, top-down crop" className="w-full h-full object-cover sepia-[0.1] opacity-95" style={{ objectPosition: "50% 60%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo4j6-SyfKyuACCimlVKlmpWXXaHky7trKqjXzwPN3rEz9Kn1MZgIsLU2tCewE6CmvmCFEeQsu69FCmY1vpDqYyKxn5J0Zajy4CVlg4wC9jT4f76kdvJIl62x3EmhGq4h2P-j1QslSxf0bB57PEU8ENhRypLqhpOh1yR2RJ35Rp0OAp_FL1fHQ8MscZUbQSr5KQCxWa57t7Wkm73wgUGJOf9oPOnQ4NT4VE28-atJ5krmt6TVTBunRaah56QxQCRdYaa_LJhT9" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/25 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 016 · February</figcaption>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Kohiki chawan re-cropped from firing 019" className="w-full h-full object-cover grayscale-[0.15] opacity-95" style={{ objectPosition: "40% 50%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuARtg2-cP62x8WVCX-wyEUP7WMMZ8YP2ZQoJ9HDUbUnLe6AIdn8C3HKbr-gvzk5g5BMXVMbrtRP5VAFBgN45G_eLIZQXGGRvBEZ-KC5NfEWeKgG_ANBKKJMJ1bcDAlEhevyUo6BtBoDxXB6VN_nZ2zbn15cyNelhoN03BPPbxVu_VGRRx_UWvKWzohJuT-gsWEQXZCEcIr98IGb52tb9eObQ7OfeZxrxihmo8QqgIfkWxwUqeJrH_u8ItSCTwIrAr98fiJPg-id" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/20 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 019 · March</figcaption>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Shigaraki vase from firing 023, side crop" className="w-full h-full object-cover sepia-[0.2] opacity-95" style={{ objectPosition: "60% 30%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuB74fBX4WQI1lFivWo3m77BKttSAQ6836Y1cNZK5S4LsVsSNBEQu2O7wDzLfqWOrfJo5oSzZ6N5bSnBO4WVxMdRKFFbnm17dsibryfXywUaq9_CLdrSucsECwb6DLPlbVZKa5JTNhQcuVouWpH_I5EV_dSDT40YMxban64KhjktoJJ9KzjNsvWpb4r3imY2OyGQbGOdL_Iyw-ZDXoiS-tyhchomJ2gPCRFllshrUxXlAuK_qLKuj6GVsEP9cm30k6_ic0gEaiL9" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/15 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 023 · April</figcaption>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Throwing-room hands shaping the warped jar from firing 027" className="w-full h-full object-cover sepia-[0.25] opacity-90" style={{ objectPosition: "50% 35%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOqpmdqedqFd_weDAOOFcTaxNADAT6vMjzSWrdYswtvI4CXHyIzr45d-grk70YshCQhmUQZG9zmMzwLRyP1laCssVetiMWKxpGbj3DxWMwOgT1lF9Bdr_rcUgptyFMffVVEaAi2hMcF4FaJHRUVtlJO9JOU4PzJr8ptONHEZBPxYWsQCsZ_Pb6VAarX_c10lcl2-NqMO_0aykrPkAwK175BnbVI7YKip7q5eCYMBp89lV_D-UR5SVjqIHNgi8A3d8ukdTATFBJ" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/25 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 027 · May</figcaption>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Glazing dip recorded against firing 031, guinomi with iron flecks" className="w-full h-full object-cover grayscale-[0.25] opacity-95" style={{ objectPosition: "50% 55%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4hsUELV5Vew10m2deXeX175ajF_D6u5yOfrt0hHoi1wRofcVVd8VNXQ2SYIFiClr36TQKBzTkTBTd5I19-52hsdqmx_RzHUGvODbx2ys_z_cOAfLtjapPV3XaY5gZDoOcM9MJIOtr_koe2R_W6IAglQe2D_QVjbNTUFlt83N_bjCE5_BKZwff0ptUX6VrJMSH3_TPScxpaE8_hSli9MSKGv_HbL9KXhsCkhN0YJafKyoOOtmfygooBO6g8pQl7OvA0KyVDcWD" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/15 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 031 · July</figcaption>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Firing 034 chamber glow with ash-run chawan inside" className="w-full h-full object-cover sepia-[0.3] opacity-90" style={{ objectPosition: "50% 50%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM2Net7j2l8x_JsOrzThZbR0-6Fg2g0nONzytbyyZ1CwfK7JibzwwJlQ9DhZoJPr1rhd_xqCezZM2dD_O4Rw3cw2Tvj5pKc8YxWT7W2yCtgZ5ADYpwGO7OwC7_Pz5odUfMI5z6hc-FLxdkL2r8C1OIZ1eGEzC4U7CigR9Qpd2z5b1yIhcO25WpLjDFU7F-RJSX-EfILmFXm-MYyFpBzRkQNS5ecUMgOEROmKsczobgJ4RB5OoAKcNoFLC3Nd0Ykc56a10Qxd7h" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/25 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 034 · September</figcaption>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container">
                    <img alt="Black-and-white kiln record from firing 038, charcoal-kiss bottle" className="w-full h-full object-cover grayscale opacity-85" style={{ objectPosition: "50% 50%" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP1rdAkYHVLASc-40NaJ1kHxr7LeMcoMabHqv3O6Db_i9vn_RtmeuDr4PhofeUxCSQEdhI0X-EZTtUY-sQR8mlo4NiiD0rJ_E5_cqCiEeD6mkeKDxrQtECa1ezRIdh1BDGKNCpGJfnsLro3pG_LbBml2dKIttjJhy3k9f9qVdm1Mfv24yHRAXU2IMNRgAutYk8lrlbeWEbMt4rPFAv67PtKM1oNs727IvHnsFmhty1t_DCynej3I0MHqsNcFk0gpnGwqaPpiDA" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-secondary-fixed-dim/20 mix-blend-overlay" />
                  </div>
                  <figcaption className="mt-2 font-headline-md text-xs italic text-surface-tint">Firing 038 · November</figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section className="py-xl px-container-padding bg-surface scroll-mt-12" id="anagama">
            <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="md:col-span-5">
                <div className="md:sticky md:top-32 flex flex-col gap-8">
                  <div>
                    <img alt="Tall portrait of an anagama-style brick kiln chamber, dim and warm-lit, ready for loading" className="w-full h-[40vh] md:h-[45vh] object-cover rounded sepia-[0.12] opacity-95" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP1rdAkYHVLASc-40NaJ1kHxr7LeMcoMabHqv3O6Db_i9vn_RtmeuDr4PhofeUxCSQEdhI0X-EZTtUY-sQR8mlo4NiiD0rJ_E5_cqCiEeD6mkeKDxrQtECa1ezRIdh1BDGKNCpGJfnsLro3pG_LbBml2dKIttjJhy3k9f9qVdm1Mfv24yHRAXU2IMNRgAutYk8lrlbeWEbMt4rPFAv67PtKM1oNs727IvHnsFmhty1t_DCynej3I0MHqsNcFk0gpnGwqaPpiDA" loading="lazy" decoding="async" />
                    <p className="font-headline-md text-sm italic text-surface-tint mt-4">The kiln · interior, before loading</p>
                  </div>
                  <div>
                    <img alt="Inside the chamber on day four — airborne ash settling onto pot shoulders, glow at peak heat" className="w-full h-[35vh] md:h-[40vh] object-cover rounded sepia-[0.25] opacity-95" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM2Net7j2l8x_JsOrzThZbR0-6Fg2g0nONzytbyyZ1CwfK7JibzwwJlQ9DhZoJPr1rhd_xqCezZM2dD_O4Rw3cw2Tvj5pKc8YxWT7W2yCtgZ5ADYpwGO7OwC7_Pz5odUfMI5z6hc-FLxdkL2r8C1OIZ1eGEzC4U7CigR9Qpd2z5b1yIhcO25WpLjDFU7F-RJSX-EfILmFXm-MYyFpBzRkQNS5ecUMgOEROmKsczobgJ4RB5OoAKcNoFLC3Nd0Ykc56a10Qxd7h" loading="lazy" decoding="async" />
                    <p className="font-headline-md text-sm italic text-surface-tint mt-4">Day four · the chamber begins to glaze itself</p>
                  </div>
                  <div>
                    <img alt="Hands at the wheel during a quiet morning before the next loading begins" className="w-full h-[30vh] md:h-[36vh] object-cover rounded sepia-[0.18] opacity-95" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOqpmdqedqFd_weDAOOFcTaxNADAT6vMjzSWrdYswtvI4CXHyIzr45d-grk70YshCQhmUQZG9zmMzwLRyP1laCssVetiMWKxpGbj3DxWMwOgT1lF9Bdr_rcUgptyFMffVVEaAi2hMcF4FaJHRUVtlJO9JOU4PzJr8ptONHEZBPxYWsQCsZ_Pb6VAarX_c10lcl2-NqMO_0aykrPkAwK175BnbVI7YKip7q5eCYMBp89lV_D-UR5SVjqIHNgi8A3d8ukdTATFBJ" loading="lazy" decoding="async" />
                    <p className="font-headline-md text-sm italic text-surface-tint mt-4">Day twelve · the wheel, between firings</p>
                  </div>
                  <div>
                    <img alt="A single tea bowl drawn from the chamber, washed and signed in afternoon light" className="w-full h-[28vh] md:h-[34vh] object-cover rounded sepia-[0.1] opacity-95" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3tnh55icXU_uzGgEVHAPgaOuPMPIi-kGCUT1BjUIEJM0frQTyFRYNDfIyJw_1kNqH2IWi8xxJC6nGHM31GVLqfqRfaWsk1eL5ZmY9W4OqLgYLqHHIGZYzlal8lu7e_cuvdftENefOWzFECk1i8SDio77gducFrQpFsjQJ_pTKjJj6p5icYEkQc1bbYXiLYlreM4tSgXy7aLX_l_P1bt4GCe-AEYER5QRlwblP7hh49upQkdWwaEZO48L6JUYYhsT0TzbONMkI" loading="lazy" decoding="async" />
                    <p className="font-headline-md text-sm italic text-surface-tint mt-4">Day fifteen · the kept piece, washed and signed</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col gap-12">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.25em]">Stage one</span>
                  <h3 className="font-display-lg text-display-lg text-on-surface italic mt-3 mb-5 text-balance">Loading · 3 days</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-pretty max-w-[60ch]">
                    Three of us spend three quiet days fitting roughly four hundred pieces into the chamber. Larger jars sit at the back where the flame travels longest; cups and guinomi nest near the firebox where ash falls heaviest. Every shelf is wadged with a paste of rice husk and alumina so pieces release cleanly after the firing. We map the load by hand on graph paper, photograph each layer, and write small notes about who threw what — so that later, reading the unloaded surfaces, we can trace which piece sat where, and learn from it.
                  </p>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.25em]">Stage two</span>
                  <h3 className="font-display-lg text-display-lg text-on-surface italic mt-3 mb-5 text-balance">Firing · 5 days, 1280°C</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-pretty max-w-[60ch]">
                    We light a small fire at the mouth and grow it slowly across the first twelve hours, careful not to crack a damp brick. From day two onward we feed pine and cedar in two-hour shifts, day and night, watching the colour through a peephole shift from cherry to peach to a near-white that signals 1280 degrees. Around the fourth day the chamber begins to glaze itself: airborne ash from the fuel softens, settles on the shoulders of pots, and re-vitrifies into rivulets of green and amber that no glaze bucket could plan.
                  </p>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.25em]">Stage three</span>
                  <h3 className="font-display-lg text-display-lg text-on-surface italic mt-3 mb-5 text-balance">Cooling · 7 days closed</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-pretty max-w-[60ch]">
                    When we finish stoking we brick the firebox shut and walk away. The chamber takes a full week to drift down through its own thermal history — fast cooling cracks pots; slow cooling deepens the colour. Through the peephole on day three the interior still glows the colour of a setting sun. By day five everything is dark again, but the bricks are still too hot to touch. We use this week to sleep, eat properly, and reread the loading map so that nothing in the unloading comes as a complete surprise.
                  </p>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.25em]">Stage four</span>
                  <h3 className="font-display-lg text-display-lg text-on-surface italic mt-3 mb-5 text-balance">Unloading · the surprise</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-pretty max-w-[60ch]">
                    We open the firebox at dawn and pull pieces forward one at a time, gently, with a small broom for the loose ash. Roughly seventy percent of a firing reaches the standard we keep; the rest are quietly broken or kept aside as study pieces. The ones that survive are signed only after a wash in cold well water and a slow appraisal in afternoon light — we are looking for the pots that ask to be lived with rather than admired, the ones that hold the firing's signature without shouting about it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-xl px-container-padding bg-surface-container-low scroll-mt-12" id="commissions">
            <div className="max-w-[1300px] mx-auto">
              <div className="mb-16 md:mb-20 max-w-[60ch]">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.25em]">Selected commissions</span>
                <h2 className="font-display-lg text-display-lg text-on-surface italic mt-3 text-balance">Private commissions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-4 italic">Three projects from the last two years, each developed across roughly eighteen months of correspondence and trial firings.</p>
              </div>
              <div className="flex flex-col gap-20 md:gap-24">
                <article className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div className="md:col-span-6 order-1">
                    <img alt="Quiet wabi-sabi tea-house interior with low table and earthen walls, soft natural light from shoji" className="w-full aspect-[4/3] object-cover rounded sepia-[0.08] opacity-95" src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=900" loading="lazy" decoding="async" />
                  </div>
                  <div className="md:col-span-6 order-2 md:pr-6">
                    <p className="font-japanese-accent text-japanese-accent text-tertiary uppercase tracking-[0.2em] mb-2">三島 · 2023</p>
                    <h3 className="font-display-lg text-display-lg text-on-surface italic mb-5 text-balance">A tea-house in Mishima</h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-pretty max-w-[58ch]">
                      A retired tea master rebuilding the family tea-house wrote to ask for twelve chawan in matching iga clay, each subtly different. We spent four firings finding the right balance of ash-fall — the master wanted the bowls to feel as though they had been used for a season already on the day they arrived. The final twelve travelled in a single paulownia box, each wrapped in indigo cloth from a dyer we both knew. He sends a postcard every spring telling us which bowl is in current rotation.
                    </p>
                  </div>
                </article>
                <article className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div className="md:col-span-6 order-1 md:order-2">
                    <img alt="Quiet still life of brass and ceramic objects on a private collector's shelf, warm light" className="w-full aspect-[4/3] object-cover rounded sepia-[0.08] opacity-95" src="https://images.unsplash.com/photo-1527844817887-9b937993518b?auto=format&fit=crop&q=80&w=900" loading="lazy" decoding="async" />
                  </div>
                  <div className="md:col-span-6 order-2 md:order-1 md:pl-6">
                    <p className="font-japanese-accent text-japanese-accent text-tertiary uppercase tracking-[0.2em] mb-2">Berlin · 2024</p>
                    <h3 className="font-display-lg text-display-lg text-on-surface italic mb-5 text-balance">A private collector in Berlin</h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-pretty max-w-[58ch]">
                      A collector with a particular interest in deformation asked for five vessels that had each almost failed in the firing. We sent a contact sheet of seventeen flawed pots from three firings and let her choose. The five she selected included one that had collapsed slightly at the shoulder and one that fused to a kiln shelf and had to be carefully cut free. They now live together on a single low shelf in her apartment, lit by the kind of slow afternoon sun the chamber itself remembers.
                    </p>
                  </div>
                </article>
                <article className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div className="md:col-span-6 order-1">
                    <img alt="Architectural interior of a small Lisbon kappo restaurant counter, warm wood and earthen tones" className="w-full aspect-[4/3] object-cover rounded sepia-[0.08] opacity-95" src="https://images.unsplash.com/photo-1743793054819-37e412d65295?auto=format&fit=crop&q=80&w=900" loading="lazy" decoding="async" />
                  </div>
                  <div className="md:col-span-6 order-2 md:pr-6">
                    <p className="font-japanese-accent text-japanese-accent text-tertiary uppercase tracking-[0.2em] mb-2">Lisboa · 2024</p>
                    <h3 className="font-display-lg text-display-lg text-on-surface italic mb-5 text-balance">A kappo restaurant in Lisbon</h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-pretty max-w-[58ch]">
                      Forty-two pieces for a fourteen-seat counter — sake cups, sashimi plates, dipping bowls, and one ash tray for the chef's matches. The owner travelled to Kyoto twice during development to eat from the trial pieces with us. We agreed early that nothing on the menu would arrive on a flawless surface; every plate had to carry a small honest mark. The set has now been in nightly rotation for thirteen months. They send us their breakage tally each season; we replace pieces in the next firing.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="py-xl px-container-padding bg-surface-container scroll-mt-12" id="faq">
            <div className="max-w-[820px] mx-auto">
              <div className="mb-12 md:mb-16">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.25em]">Frequently asked</span>
                <h2 className="font-display-lg text-display-lg text-on-surface italic mt-3 text-balance">Before you write</h2>
              </div>
              <div className="flex flex-col divide-y divide-outline-variant/60 border-y border-outline-variant/60">
                <details className="group py-6">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                    <span className="font-headline-md text-headline-md italic text-on-surface text-balance">How do I commission a piece?</span>
                    <span className="font-label-caps text-label-caps text-surface-tint shrink-0 group-open:rotate-45 transition-transform duration-300">+</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-4 text-pretty">
                    Write a letter — paper or email, both fine — describing what you would like to use the piece for, where you imagine it living, and roughly when you would like to receive it. We reply within two weeks. If a project sounds right for the kiln we propose a calendar, a price, and a small deposit. From there we send progress photographs after each relevant firing until you confirm a finished piece.
                  </p>
                </details>
                <details className="group py-6">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                    <span className="font-headline-md text-headline-md italic text-on-surface text-balance">Do you ship internationally?</span>
                    <span className="font-label-caps text-label-caps text-surface-tint shrink-0 group-open:rotate-45 transition-transform duration-300">+</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-4 text-pretty">
                    Yes, by air to most countries and by sea on request. Pieces travel in custom paulownia boxes packed by a friend who has handled museum loans for thirty years. Shipping is quoted at cost and is fully insured against breakage in transit. We do not, however, insure against your own kitchen — once the box is opened on your table, the pot's life with you has begun, and that part is not our responsibility.
                  </p>
                </details>
                <details className="group py-6">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                    <span className="font-headline-md text-headline-md italic text-on-surface text-balance">What is the lead time?</span>
                    <span className="font-label-caps text-label-caps text-surface-tint shrink-0 group-open:rotate-45 transition-transform duration-300">+</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-4 text-pretty">
                    Anywhere from four months to two years, depending on the piece and the firing calendar. We fire roughly five times a year, and not every piece comes out as hoped, so we tend to over-make and select. For a single tea bowl six to nine months is realistic; for a set of twelve matched pieces, plan on around eighteen. We will always tell you a worst-case date and try to surprise you earlier.
                  </p>
                </details>
                <details className="group py-6">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                    <span className="font-headline-md text-headline-md italic text-on-surface text-balance">Can I visit the kiln?</span>
                    <span className="font-label-caps text-label-caps text-surface-tint shrink-0 group-open:rotate-45 transition-transform duration-300">+</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-4 text-pretty">
                    Quietly, and by appointment. The studio is half an hour outside Kyoto in a small village where neighbours sleep early. We host visitors in groups of four or fewer, ideally on a non-firing week so that we can give the visit our full attention. There is tea, a short walk down to the kiln, and time to handle work in progress. We ask that you do not photograph other clients' commissions.
                  </p>
                </details>
                <details className="group py-6">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                    <span className="font-headline-md text-headline-md italic text-on-surface text-balance">Why are some pieces unsigned?</span>
                    <span className="font-label-caps text-label-caps text-surface-tint shrink-0 group-open:rotate-45 transition-transform duration-300">+</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-4 text-pretty">
                    The signature goes on after the firing, not before. Pieces that arrive at our standard are signed under the foot in iron oxide and refired briefly. Pieces that almost made it but carry a flaw we cannot live with are released into the world unsigned, at a lower price, often to students. They are still good pots; they are just not pots we are willing to claim with our name. Look on the foot before you ask the price.
                  </p>
                </details>
                <details className="group py-6">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                    <span className="font-headline-md text-headline-md italic text-on-surface text-balance">How do you decide what survives a firing?</span>
                    <span className="font-label-caps text-label-caps text-surface-tint shrink-0 group-open:rotate-45 transition-transform duration-300">+</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-4 text-pretty">
                    Three days, two pots of tea, and slow afternoon light on the unloading bench. We sort first into pieces that hold liquid, then into pieces that hold attention. The ones that make us put down our cup and pick them up — those are the ones that get washed, signed, and sent out into the world. The rest are studied, sometimes broken on purpose to read the section, and the lessons go straight into the loading notes for the next firing.
                  </p>
                </details>
              </div>
            </div>
          </section>

          <section className="py-32 px-container-padding bg-surface flex flex-col items-center justify-center text-center scroll-mt-12" id="contact">
            <h2 className="font-display-lg text-display-lg text-on-surface mb-6 italic text-balance">Private Commissions</h2>
            <p className="font-body-md text-body-md text-surface-tint mb-12 max-w-[60ch] text-pretty">
              We accept a limited number of private requests each year, focusing on vessels intended for daily ritual and tea ceremony.
            </p>
            <a className="inline-block px-8 py-4 bg-on-surface text-surface font-label-caps text-label-caps tracking-widest uppercase hover:bg-surface-tint transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface focus-visible:ring-offset-4 focus-visible:ring-offset-surface active:bg-outline rounded-sm" href="#contact">
              Inquire
            </a>
          </section>
        </main>

        <footer className="bg-primary-container dark:bg-stone-950 border-t border-stone-300/20 dark:border-stone-800/20 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 px-8 md:px-20 py-24 w-full max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-4">
              <div className="text-lg font-light tracking-widest text-stone-900 dark:text-stone-100">TSUKI 月窯</div>
              <p className="text-stone-700 dark:text-stone-300 font-headline-md text-sm tracking-widest uppercase">© Tsuki Kiln. Vessels of Earth and Fire.</p>
              <address className="text-stone-500 font-body-md text-sm mt-4 not-italic">123 Potter's Lane, Kyoto, Japan</address>
            </div>
            <nav className="flex flex-col md:flex-row gap-8">
              <a className="text-stone-500 dark:text-stone-400 font-headline-md text-sm tracking-widest uppercase hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-8 decoration-stone-300 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 dark:focus-visible:ring-stone-200 rounded px-2 py-1 -mx-2" href="#">Journal</a>
              <a className="text-stone-500 dark:text-stone-400 font-headline-md text-sm tracking-widest uppercase hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-8 decoration-stone-300 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 dark:focus-visible:ring-stone-200 rounded px-2 py-1 -mx-2" href="#">Care Guide</a>
              <a className="text-stone-500 dark:text-stone-400 font-headline-md text-sm tracking-widest uppercase hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-8 decoration-stone-300 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 dark:focus-visible:ring-stone-200 rounded px-2 py-1 -mx-2" href="#">Shipping</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
