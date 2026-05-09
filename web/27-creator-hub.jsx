export default function T27CreatorHub() {
  const navLinks = [
    { label: "Newsletter", href: "#", active: true },
    { label: "YouTube", href: "#" },
    { label: "Podcast", href: "#" },
    { label: "Courses", href: "#" }
  ];

  const ctaCards = [
    { icon: "mail", title: "Newsletter", meta: "50k+ Subscribers" },
    { icon: "play_circle", title: "YouTube", meta: "120k+ Subscribers" },
    { icon: "podcasts", title: "Podcast", meta: "1M+ Downloads" },
    { icon: "school", title: "Courses", meta: "5k+ Students" }
  ];

  const courses = [
    { title: "The Newsletter Operating System", desc: "Systems and templates for writing, growing, and monetizing.", price: "$149", alt: "Newsletter Course", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3UeVxu95IIiG1EcLqduDtkopQvJRg_croEOzTvx8z1LCiHouN4ej5AXHzU9KtAB33TOy66cxnLL1RS031rnEj6E4zT5mQb3qKKq5TZ3AWxez-tr__2C5VC5tRBLCwxmjG8Cr4cPIvucogZAEGnVOknXa6WkCanItxaDsip1MoCgAcJ3yGL1jhLktrMsMlii5BjyNat9JEzEdlTmjFDyRi5BKVwuIcoLRN8G61jZjqIKncx8HlCN9eWUFUp-Gr64Yo-KSNS__g_38" },
    { title: "B2B Sponsorship Strategy", desc: "How to pitch, price, and deliver campaigns for premium brands.", price: "$299", alt: "Sponsorships Course", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjC98mLmNd1GxykooTfayD6BLueLYzSnxrxqr3dzLm5Agc-YGHmO2dkQi-JU4vKiJllDnIao2o6xMaF_cGjrYUVR3xxFipkiESf0onCpfoWxQcyJUZZp-rH_uRtiH-Nv254y1AGZnQJa86BzBu0G31BibwzDvcJAc3rGo6PxKDb7PAhROhwwcoeeJr5qS5R-tu5wsVtJpwa3HruualqCKcPzbo_AfSn35LDoi1NIQYgmEClYs36AN06qjWS-R7u9nDQFkaJNM9l8k" }
  ];

  const footerLinks = ["Privacy Policy", "Terms of Service", "Contact", "Press Kit"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fcf9f8", "on-background": "#1c1b1b",
            "surface": "#fcf9f8", "on-surface": "#1c1b1b", "on-surface-variant": "#3f4947",
            "surface-bright": "#fcf9f8", "surface-dim": "#dcd9d9", "surface-variant": "#e5e2e1",
            "surface-container-lowest": "#ffffff", "surface-container-low": "#f6f3f2", "surface-container": "#f0edec", "surface-container-high": "#ebe7e7", "surface-container-highest": "#e5e2e1",
            "primary": "#004642", "on-primary": "#ffffff", "primary-container": "#1b5e5a", "on-primary-container": "#96d5cf", "primary-fixed": "#afeee9", "primary-fixed-dim": "#93d2cc",
            "secondary": "#625e57", "on-secondary": "#ffffff", "secondary-container": "#e6dfd6", "on-secondary-container": "#66625b", "secondary-fixed": "#e8e1d8", "secondary-fixed-dim": "#ccc6bd",
            "tertiary": "#613100", "on-tertiary": "#ffffff", "tertiary-container": "#824500", "on-tertiary-container": "#ffbc86", "tertiary-fixed": "#ffdcc3", "tertiary-fixed-dim": "#ffb77d",
            "outline": "#6f7978", "outline-variant": "#bfc8c7"
          },
          spacing: { "lg": "48px", "xl": "80px", "base": "8px", "container-max": "1280px", "xs": "4px", "md": "24px", "sm": "12px", "gutter": "24px" },
          fontFamily: {
            "display-xl": ["Inter"], "display-lg": ["Inter"], "headline-md": ["Inter"], "headline-sm": ["Inter"],
            "body-lg": ["Inter"], "body-md": ["Inter"], "label-md": ["Inter"], "label-sm": ["Inter"]
          },
          fontSize: {
            "display-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "600" }],
            "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "600" }],
            "headline-md": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "500" }],
            "headline-sm": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "500" }],
            "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
            "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
            "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
            "label-sm": ["12px", { lineHeight: "1.2", fontWeight: "500" }]
          }
        }
      }
    }
  `;

  const css = `
    html, body { overflow-x: clip; }
    body { background-color: #FAF6F0; color: #0F0F0F; }
    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }
  `;

  const plates = [
    { num: "Plate · 01", aspect: "aspect-[4/3]", treatment: "bw",     label: "B&W",    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdZFlz1tVGJ1OLeUbP7o6gYofS5zvnQJD5Uv94QsJ-DRf3L7j1tbBSzFB5hA7Rag8qTWiUVoTU1y8vboSRT9ijMxeuANBTPfCxmr2wOnGmLy0YbWcAILXmCSfvOKH1-XMM3Ywe61JVtQMSRErx8SiojINwwlNqoijR4-hxAl3XZFI5iVW6HyPEQDK5ZNYXaELv4XcMwmN05QsyvPJmMzOvagMIGivQOatHf5r6dbXT-I7KtqKXdSZBQEMZGch6008SVLqV9G5MB9w", alt: "Editorial portrait of Ren Park, B&W treatment" },
    { num: "Plate · 02", aspect: "aspect-[4/3]", treatment: "colour", label: "Colour", src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop", alt: "Editorial portrait, warm colour treatment" },
    { num: "Plate · 03", aspect: "aspect-[4/3]", treatment: "bw",     label: "B&W",    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPGDaCbkIeis7FNPX-dskaNMPfl0fKOtpuV4_Sh0ShdtGSTiDilJfuQxkuvF4J04WwSJJ2kghSZKQmNuMAcIT6AEsB-3VzdTnMPrd4JfQDV5o2iTe0coQkSA2Iggagf4d6jEb--TN0v56fuf-fBlguvx-1PfRjiRBwwQ8sf4-McS8WoGppGSg0QXrR7QOyeMeuwRYmrp0tp6NWbg55hW-JuHzOfhJcxwzlYUKcirWGTLpH9FJL6lmsHYXHInwRqarKrh9qHVGI3HQ", alt: "Workspace desk setup, B&W treatment" },
    { num: "Plate · 04", aspect: "aspect-[4/3]", treatment: "colour", label: "Colour", src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=900&auto=format&fit=crop", alt: "Designer at tablet sketching wireframes" },
    { num: "Plate · 05", aspect: "aspect-square", treatment: "colour", label: "Colour", src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=900&auto=format&fit=crop", alt: "Sticky-note storyboarding wall" },
    { num: "Plate · 06", aspect: "aspect-square", treatment: "bw",     label: "B&W",    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3UeVxu95IIiG1EcLqduDtkopQvJRg_croEOzTvx8z1LCiHouN4ej5AXHzU9KtAB33TOy66cxnLL1RS031rnEj6E4zT5mQb3qKKq5TZ3AWxez-tr__2C5VC5tRBLCwxmjG8Cr4cPIvucogZAEGnVOknXa6WkCanItxaDsip1MoCgAcJ3yGL1jhLktrMsMlii5BjyNat9JEzEdlTmjFDyRi5BKVwuIcoLRN8G61jZjqIKncx8HlCN9eWUFUp-Gr64Yo-KSNS__g_38", alt: "Architectural stairs, B&W treatment" },
    { num: "Plate · 07", aspect: "aspect-square", treatment: "colour", label: "Colour", src: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=900&auto=format&fit=crop", alt: "Editorial portrait of woman in coat, warm colour" },
    { num: "Plate · 08", aspect: "aspect-square", treatment: "bw",     label: "B&W",    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjC98mLmNd1GxykooTfayD6BLueLYzSnxrxqr3dzLm5Agc-YGHmO2dkQi-JU4vKiJllDnIao2o6xMaF_cGjrYUVR3xxFipkiESf0onCpfoWxQcyJUZZp-rH_uRtiH-Nv254y1AGZnQJa86BzBu0G31BibwzDvcJAc3rGo6PxKDb7PAhROhwwcoeeJr5qS5R-tu5wsVtJpwa3HruualqCKcPzbo_AfSn35LDoi1NIQYgmEClYs36AN06qjWS-R7u9nDQFkaJNM9l8k", alt: "Notepad and pen, B&W treatment" },
  ];

  const tools = [
    { num: "Tool · 01", icon: "edit_note",   title: "iA Writer",        body: "Where every issue starts. No formatting, no AI buttons. Three things in the toolbar, two of them you'll never use.", tag: "Writing",   meta: "$50 · once" },
    { num: "Tool · 02", icon: "photo_camera",title: "Fujifilm X100V",   body: "Every photo on this site, in the newsletter, in the videos, comes off this fixed-lens camera. The constraint is the point.", tag: "Imagery", meta: "$1,400 · used" },
    { num: "Tool · 03", icon: "mic",         title: "Shure MV7",        body: "USB-and-XLR mic on the podcast desk since episode 4. The treated room matters more than the mic, but the mic still matters.", tag: "Audio", meta: "$249" },
    { num: "Tool · 04", icon: "menu_book",   title: "Leuchtturm 1917",  body: "Three of these on the shelf, dated by quarter. Where ideas live before they earn a doc. The dotted-grid edition, ink black.", tag: "Notebook", meta: "$25" },
  ];

  const stripItems = [
    // Row 1
    { kind: "image", n: "01", src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&auto=format&fit=crop", alt: "Editorial portrait, woman in soft light" },
    { kind: "card",  eyebrow: "Audience", value: "127K", label: "Followers", meta: "+ 8.4% MoM" },
    { kind: "image", n: "02", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format&fit=crop", alt: "Engineering laptop pair workspace" },
    { kind: "card",  eyebrow: "Cadence",  value: "4h",   label: "Avg edit",  meta: "Per issue · 2024" },
    { kind: "image", n: "03", src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=600&q=80&auto=format&fit=crop", alt: "Editorial portrait, man in profile" },
    { kind: "card",  eyebrow: "Revenue",  value: "$8.4K", label: "Monthly",  meta: "Sponsors + memberships" },
    { kind: "image", n: "04", src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80&auto=format&fit=crop", alt: "Pull request review on screen" },
    // Row 2
    { kind: "image", n: "05", src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80&auto=format&fit=crop", alt: "Low-key studio portrait, woman" },
    { kind: "card",  eyebrow: "Ranking",  value: "Top 3%", label: "Creator", meta: "Substack · 2024" },
    { kind: "image", n: "06", src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80&auto=format&fit=crop", alt: "Remote video call, candid" },
    { kind: "card",  eyebrow: "Reach",    value: "12",     label: "Live cities", meta: "Tour · Q4 2024" },
    { kind: "image", n: "07", src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&auto=format&fit=crop", alt: "Fashion model studio, dark" },
    { kind: "card",  eyebrow: "Growth",   value: "47%",    label: "YoY",     meta: "Subscribers · 2023→24" },
    { kind: "image", n: "08", src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80&auto=format&fit=crop", alt: "Younger creator, soft window light" },
  ];
  const stripRow1 = stripItems.slice(0, 7);
  const stripRow2 = stripItems.slice(7, 14);

  const notes = [
    { num: "Note · 138", date: "Oct 02 · 2024", title: "Why I stopped reading my own analytics.", body: "Six months without opening Plausible. Open rates are up. Writing is better. Correlation, not causation — but I'm not running the experiment.", meta: "7 min · Newsletter" },
    { num: "Note · 140", date: "Oct 21 · 2024", title: "The case for a smaller list.",            body: "Pruned 8,000 inactive subscribers last week. Sender reputation up, sponsor CPM up, founder anxiety down. The math is honest.",                meta: "5 min · Essay" },
    { num: "Note · 142", date: "Nov 11 · 2024", title: "A schedule for solo operators.",          body: "Mon/Tue write. Wed record. Thu edit. Fri ship. Repeat for three years. The rest is taxes.",                                                  meta: "9 min · Essay" },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="light antialiased font-body-md text-body-md">
        <header className="fixed top-0 w-full z-50 bg-[#FAF6F0] border-b border-[#E6DFD6] font-['Inter'] font-medium tracking-tight duration-200 ease-in-out">
          <div className="flex justify-between items-center max-w-[1280px] mx-auto px-8 h-20">
            <div className="text-2xl font-bold tracking-tighter text-[#0F0F0F]">Ren Park</div>
            <nav className="hidden md:flex gap-8">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className={l.active
                  ? "text-[#1B5E5A] border-b-2 border-[#1B5E5A] pb-1 hover:bg-[#F3EDE4] transition-colors"
                  : "text-[#0F0F0F] hover:text-[#1B5E5A] hover:bg-[#F3EDE4] transition-colors"}>{l.label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#1B5E5A] cursor-pointer">search</span>
              <button className="bg-[#1B5E5A] text-white px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-tint transition-colors">Subscribe</button>
            </div>
          </div>
        </header>

        <main className="pt-[120px] pb-xl px-8 max-w-container-max mx-auto">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-xl items-center">
            <div className="relative w-full aspect-[4/5] lg:aspect-square overflow-hidden rounded-sm border border-secondary-container">
              <img alt="Portrait of Ren Park" className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdZFlz1tVGJ1OLeUbP7o6gYofS5zvnQJD5Uv94QsJ-DRf3L7j1tbBSzFB5hA7Rag8qTWiUVoTU1y8vboSRT9ijMxeuANBTPfCxmr2wOnGmLy0YbWcAILXmCSfvOKH1-XMM3Ywe61JVtQMSRErx8SiojINwwlNqoijR4-hxAl3XZFI5iVW6HyPEQDK5ZNYXaELv4XcMwmN05QsyvPJmMzOvagMIGivQOatHf5r6dbXT-I7KtqKXdSZBQEMZGch6008SVLqV9G5MB9w" />
            </div>
            <div className="flex flex-col gap-md">
              <div>
                <h1 className="font-display-xl text-display-xl text-[#0F0F0F] mb-sm">Ren Park</h1>
                <p className="font-headline-sm text-headline-sm text-secondary">Curating strategy for creators, media operators, and digital thinkers.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-md">
                {ctaCards.map((c) => (
                  <a key={c.title} href="#" className="group block border border-secondary-container p-md hover:bg-surface-container-high transition-colors">
                    <div className="flex justify-between items-start mb-lg">
                      <span className="material-symbols-outlined text-primary-container text-3xl">{c.icon}</span>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary-container transition-colors">arrow_outward</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-[#0F0F0F] uppercase">{c.title}</h3>
                      <p className="font-label-sm text-label-sm text-secondary mt-xs">{c.meta}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-xl border-t border-secondary-container pt-xl">
            <h2 className="font-headline-md text-headline-md mb-lg">Latest from the Desk</h2>
            <div className="flex flex-col gap-0 border border-secondary-container">
              <div className="flex flex-col md:flex-row border-b border-secondary-container group hover:bg-surface-container-high transition-colors cursor-pointer p-md gap-md items-center">
                <div className="w-12 h-12 flex-shrink-0 bg-surface-container flex items-center justify-center border border-secondary-container">
                  <span className="material-symbols-outlined text-primary-container">article</span>
                </div>
                <div className="flex-grow">
                  <span className="font-label-sm text-label-sm text-secondary uppercase block mb-xs">Issue #142</span>
                  <h4 className="font-headline-sm text-headline-sm text-[#0F0F0F]">The Myth of Passive Income in Media</h4>
                  <p className="font-body-md text-body-md text-secondary mt-xs line-clamp-1">Why operators are shifting back to active product curation and why the hands-off approach is failing.</p>
                </div>
                <div className="flex-shrink-0 text-primary-container">
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row border-b border-secondary-container group hover:bg-surface-container-high transition-colors cursor-pointer p-md gap-md items-center">
                <div className="w-24 h-16 flex-shrink-0 bg-surface-container overflow-hidden border border-secondary-container relative">
                  <img alt="Video thumbnail" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPGDaCbkIeis7FNPX-dskaNMPfl0fKOtpuV4_Sh0ShdtGSTiDilJfuQxkuvF4J04WwSJJ2kghSZKQmNuMAcIT6AEsB-3VzdTnMPrd4JfQDV5o2iTe0coQkSA2Iggagf4d6jEb--TN0v56fuf-fBlguvx-1PfRjiRBwwQ8sf4-McS8WoGppGSg0QXrR7QOyeMeuwRYmrp0tp6NWbg55hW-JuHzOfhJcxwzlYUKcirWGTLpH9FJL6lmsHYXHInwRqarKrh9qHVGI3HQ" />
                  <span className="material-symbols-outlined absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">play_arrow</span>
                </div>
                <div className="flex-grow">
                  <span className="font-label-sm text-label-sm text-secondary uppercase block mb-xs">Video Essay</span>
                  <h4 className="font-headline-sm text-headline-sm text-[#0F0F0F]">Building a 6-Figure Creator Stack</h4>
                  <p className="font-body-md text-body-md text-secondary mt-xs line-clamp-1">A deep dive into the tools, platforms, and expenses of a modern solo media operation.</p>
                </div>
                <div className="flex-shrink-0 text-primary-container">
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row group hover:bg-surface-container-high transition-colors cursor-pointer p-md gap-md items-center">
                <div className="w-12 h-12 flex-shrink-0 bg-surface-container flex items-center justify-center border border-secondary-container rounded-full">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="flex-grow">
                  <span className="font-label-sm text-label-sm text-secondary uppercase block mb-xs">Ep. 48 • 45 min</span>
                  <h4 className="font-headline-sm text-headline-sm text-[#0F0F0F]">Interview: Sarah Chen on Niche Newsletters</h4>
                </div>
                <div className="flex-shrink-0 w-32 h-2 bg-secondary-container overflow-hidden">
                  <div className="h-full bg-primary-container w-1/3"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-xl bg-[#F3EDE4] border border-secondary-container p-xl text-center">
            <span className="material-symbols-outlined text-primary-container text-4xl mb-md opacity-50" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <p className="font-display-lg text-display-lg text-[#0F0F0F] max-w-3xl mx-auto leading-tight mb-md">"Ren's insights are the only ones I consistently save to read later. It's the signal amidst the noise of the creator economy."</p>
            <div className="font-label-md text-label-md text-primary-container uppercase tracking-widest">Elena Rostova</div>
            <div className="font-label-sm text-label-sm text-secondary mt-xs">Founder, Studio Blanc</div>
          </section>

          <section className="mb-xl border-t border-secondary-container pt-xl">
            <div className="flex justify-between items-end mb-lg">
              <h2 className="font-headline-md text-headline-md text-[#0F0F0F]">Curriculum</h2>
              <a className="font-label-md text-label-md text-primary-container hover:underline" href="#">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {courses.map((c) => (
                <div key={c.title} className="border border-secondary-container group cursor-pointer hover:bg-surface-container-high transition-colors flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto border-r border-secondary-container overflow-hidden bg-surface-container relative">
                    <img alt={c.alt} className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" src={c.src} />
                  </div>
                  <div className="p-md flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-[#0F0F0F] mb-xs">{c.title}</h3>
                      <p className="font-body-md text-body-md text-secondary mb-md">{c.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-md border-t border-secondary-container">
                      <span className="font-label-md text-label-md text-[#0F0F0F]">{c.price}</span>
                      <span className="font-label-md text-label-md text-primary-container uppercase">Enroll</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Editorial Spread 1 — image LEFT / content RIGHT */}
          <section className="mb-xl border-t border-secondary-container pt-xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="md:col-span-7 aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-lg border border-secondary-container bg-surface-container">
              <img alt="Dual-monitor terminal workstation" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80&auto=format&fit=crop" />
            </div>
            <div className="md:col-span-5 flex flex-col gap-5 justify-center">
              <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest">— The Studio</span>
              <h2 className="font-display-lg text-display-lg text-[#0F0F0F] leading-tight">Build the studio you've always wanted.</h2>
              <p className="font-body-md text-body-md text-secondary">A creator's workspace is half the work. Two monitors, a clean desk, the right light. We've spent three years tuning this room — what stays, what goes, what plugs into what — and the operating manual is now a 24-page PDF inside the membership. Set up your studio in a weekend, not a year.</p>
              <div className="flex items-center gap-md pt-sm">
                <a className="bg-[#1B5E5A] text-white px-5 py-3 rounded font-label-md text-label-md hover:bg-surface-tint transition-colors uppercase tracking-widest" href="#">Tour the Studio</a>
                <a className="font-label-md text-label-md text-primary-container uppercase tracking-widest hover:underline" href="#">Gear list →</a>
              </div>
            </div>
          </section>

          {/* Editorial Spread 2 — content LEFT / image RIGHT (REVERSED) */}
          <section className="mb-xl border-t border-secondary-container pt-xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="md:col-span-5 md:order-1 flex flex-col gap-5 justify-center">
              <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest">— The Practice</span>
              <h2 className="font-display-lg text-display-lg text-[#0F0F0F] leading-tight">From the first frame to the first paycheck.</h2>
              <p className="font-body-md text-body-md text-secondary">Most creators ship for two years before a sponsor returns an email. We compressed that into seven months by writing the brief, sending the cold pitch, and pricing the deck the same week we shot the first issue. The Practice is a quarterly cohort — eighteen creators, one studio, four months — for the people doing the slow work in public.</p>
              <div className="flex items-center gap-md pt-sm">
                <a className="bg-[#1B5E5A] text-white px-5 py-3 rounded font-label-md text-label-md hover:bg-surface-tint transition-colors uppercase tracking-widest" href="#">Apply for Cohort 04</a>
                <a className="font-label-md text-label-md text-primary-container uppercase tracking-widest hover:underline" href="#">Read the syllabus →</a>
              </div>
            </div>
            <div className="md:col-span-7 md:order-2 aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-lg border border-secondary-container bg-surface-container">
              <img alt="Creator at whiteboard planning sprint" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1573164574001-518958d9baa2?w=1400&q=80&auto=format&fit=crop" />
            </div>
          </section>

          <section className="mb-xl py-lg border-y border-secondary-container">
            <p className="font-label-sm text-label-sm text-secondary uppercase text-center tracking-widest mb-md">Featured In & Trusted By</p>
            <div className="flex flex-wrap justify-center gap-xl items-center opacity-40 grayscale">
              <div className="font-display-lg text-display-lg font-bold">Wired</div>
              <div className="font-headline-md text-headline-md font-serif italic">The Verge</div>
              <div className="font-headline-md text-headline-md font-mono">TechCrunch</div>
              <div className="font-headline-sm text-headline-sm tracking-widest uppercase">Fast Company</div>
            </div>
          </section>

          {/* Studio image strip — two rows alternating B&W and colour */}
          <section className="full-bleed py-xl px-8" style={{ backgroundColor: "#FAF6F0" }}>
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-lg">
                <div>
                  <p className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mb-xs">— Studio · Vol. IV</p>
                  <h2 className="font-headline-md text-headline-md text-[#0F0F0F]">Eight frames from the desk.</h2>
                </div>
                <p className="font-body-md text-body-md text-secondary max-w-md md:text-right">An editor's selection from the last quarter — half in colour, half cooled to silver. Hover to flip.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                {plates.map(p => (
                  <figure key={p.num} className={`relative ${p.aspect} overflow-hidden border border-secondary-container bg-surface-container group`}>
                    <img alt={p.alt} className={p.treatment === "bw"
                      ? "w-full h-full object-cover grayscale opacity-95 mix-blend-multiply group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700"
                      : "w-full h-full object-cover saturate-110 contrast-105 group-hover:scale-105 transition-transform duration-700"} src={p.src} />
                    <figcaption className="absolute bottom-0 inset-x-0 bg-[#FAF6F0]/95 backdrop-blur-sm border-t border-secondary-container px-3 py-2 flex justify-between font-label-sm text-label-sm uppercase tracking-widest">
                      <span className="text-[#0F0F0F]">{p.num}</span>
                      <span className={`tabular-nums ${p.treatment === "bw" ? "text-secondary" : "text-primary-container"}`}>{p.label}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-md text-center font-label-sm text-label-sm text-secondary uppercase tracking-widest">Photographs · Studio archive · Q3–Q4 2024</p>
            </div>
          </section>

          {/* Tools of the Desk — full-bleed darker cream */}
          <section className="full-bleed py-xl px-8" style={{ backgroundColor: "#F3EDE4" }}>
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-lg">
                <div>
                  <p className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mb-xs">— Tools of the Desk</p>
                  <h2 className="font-headline-md text-headline-md text-[#0F0F0F]">Four tools that haven't moved in three years.</h2>
                </div>
                <p className="font-body-md text-body-md text-secondary max-w-md md:text-right">The shortlist. Tried and abandoned 200 things to land here. Affiliate-link-free, opinion-rich.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                {tools.map(t => (
                  <article key={t.title} className="bg-[#FAF6F0] border border-secondary-container p-md flex flex-col gap-sm hover:bg-surface-container-lowest transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="w-12 h-12 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center"><span className="material-symbols-outlined">{t.icon}</span></div>
                      <span className="font-label-sm text-label-sm text-secondary uppercase tabular-nums">{t.num}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-[#0F0F0F]">{t.title}</h3>
                    <p className="font-body-md text-body-md text-secondary flex-grow">{t.body}</p>
                    <div className="pt-sm border-t border-secondary-container flex justify-between font-label-sm text-label-sm uppercase tracking-widest text-primary-container">
                      <span>{t.tag}</span><span>{t.meta}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Notes from the Field — full-bleed deeper cream */}
          <section className="full-bleed py-xl px-8" style={{ backgroundColor: "#E8DEC4" }}>
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-lg">
                <div>
                  <p className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mb-xs">— Notes from the Field</p>
                  <h2 className="font-headline-md text-headline-md text-[#0F0F0F]">What I'm thinking about this quarter.</h2>
                </div>
                <a href="#" className="font-label-md text-label-md text-primary-container hover:underline self-start md:self-end">All notes (142) →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                {notes.map(n => (
                  <a key={n.num} href="#" className="group bg-[#FAF6F0] border border-secondary-container p-md flex flex-col gap-sm hover:bg-surface-container-lowest transition-colors">
                    <div className="flex justify-between items-center text-secondary">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest">{n.num}</span>
                      <span className="font-label-sm text-label-sm tabular-nums">{n.date}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-[#0F0F0F] group-hover:text-primary-container transition-colors">{n.title}</h3>
                    <p className="font-body-md text-body-md text-secondary flex-grow">{n.body}</p>
                    <div className="pt-sm border-t border-secondary-container flex justify-between font-label-sm text-label-sm uppercase tracking-widest">
                      <span className="text-secondary">{n.meta}</span>
                      <span className="text-primary-container">Read →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Strip — 2 rows × 7 items, image-card alternating, square */}
          <section className="full-bleed py-xl px-8" style={{ backgroundColor: "#F3EDE4" }}>
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-lg">
                <div>
                  <p className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mb-xs">— By the Numbers</p>
                  <h2 className="font-headline-md text-headline-md text-[#0F0F0F]">Fourteen frames, six receipts.</h2>
                </div>
                <p className="font-body-md text-body-md text-secondary max-w-md md:text-right">A static index of the studio in motion — portraits, workspaces, and the metrics that pay rent. Two rows of seven, alternating image and ledger card.</p>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3 mb-3">
                {stripRow1.map((it, i) => it.kind === "image" ? (
                  <figure key={`r1-${i}`} className="relative aspect-square overflow-hidden rounded-md border border-secondary-container bg-surface-container">
                    <img alt={it.alt} className="w-full h-full object-cover" src={it.src} />
                    <figcaption className="absolute top-2 left-2 bg-[#FAF6F0]/90 backdrop-blur-sm px-2 py-1 font-label-sm text-label-sm uppercase tracking-widest text-[#0F0F0F]">{it.n}</figcaption>
                  </figure>
                ) : (
                  <div key={`r1-${i}`} className="aspect-square bg-[#FAF6F0] border border-secondary-container p-4 flex flex-col gap-2 items-start justify-between">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">{it.eyebrow}</span>
                    <div className="flex flex-col">
                      <span className="font-display-lg text-display-lg text-[#0F0F0F] leading-none">{it.value}</span>
                      <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mt-1">{it.label}</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary tabular-nums">{it.meta}</span>
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
                {stripRow2.map((it, i) => it.kind === "image" ? (
                  <figure key={`r2-${i}`} className="relative aspect-square overflow-hidden rounded-md border border-secondary-container bg-surface-container">
                    <img alt={it.alt} className="w-full h-full object-cover" src={it.src} />
                    <figcaption className="absolute top-2 left-2 bg-[#FAF6F0]/90 backdrop-blur-sm px-2 py-1 font-label-sm text-label-sm uppercase tracking-widest text-[#0F0F0F]">{it.n}</figcaption>
                  </figure>
                ) : (
                  <div key={`r2-${i}`} className="aspect-square bg-[#FAF6F0] border border-secondary-container p-4 flex flex-col gap-2 items-start justify-between">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">{it.eyebrow}</span>
                    <div className="flex flex-col">
                      <span className="font-display-lg text-display-lg text-[#0F0F0F] leading-none">{it.value}</span>
                      <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mt-1">{it.label}</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary tabular-nums">{it.meta}</span>
                  </div>
                ))}
              </div>

              <p className="mt-md text-center font-label-sm text-label-sm text-secondary uppercase tracking-widest">Index · Eight portraits, six metrics · Updated quarterly</p>
            </div>
          </section>

          <section className="max-w-3xl mx-auto mb-xl pt-xl">
            <h2 className="font-headline-md text-headline-md text-center mb-lg">About Ren</h2>
            <div className="font-body-lg text-body-lg text-secondary space-y-md columns-1 md:columns-2 gap-md">
              <p>Ren Park is a media operator and strategist building tools and frameworks for the next generation of independent creators. After spending a decade leading editorial strategy at major publications, he transitioned to building a solo media business that now reaches over 200,000 professionals weekly.</p>
              <p>Through his newsletter, videos, and courses, Ren documents the operational realities of building a digital business. His work focuses on sustainable growth, uncoupling time from income, and creating high-leverage digital assets. He currently resides in Portland, Oregon.</p>
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-[#E6DFD6] bg-[#F3EDE4]">
          <div className="max-w-[1280px] mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-lg font-black text-[#0F0F0F]">Ren Park</div>
            <nav className="flex gap-6 font-['Inter'] text-xs uppercase tracking-widest">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="text-stone-500 hover:text-[#1B5E5A] transition-colors">{l}</a>
              ))}
            </nav>
            <div className="font-['Inter'] text-xs uppercase tracking-widest text-[#1B5E5A]">© 2024 Ren Park Media. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
