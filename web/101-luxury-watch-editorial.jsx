export default function T101LuxuryWatchEditorial() {
  const navLinks = [
    { label: "The Vision", active: true },
    { label: "Technique" },
    { label: "Specifications" },
    { label: "Inquiry" },
  ];
  const specs = [
    { code: "[SPEC_01]", title: "Caliber Architecture", body: "324 discrete components, entirely hand-finished. Featuring a frictionless escapement mechanism designed for absolute chronometric precision." },
    { code: "[SPEC_02]", title: "Acoustic Resonance", body: "Proprietary dampening alloys isolate the internal acoustic chamber, ensuring a pure, uninterrupted frequency response." },
    { code: "[SPEC_03]", title: "Thermal Stability", body: "Operates seamlessly within a temperature delta of -40°C to +85°C without deviation in structural integrity or performance." },
    { code: "[SPEC_04]", title: "Haptic Feedback", body: "Engineered tactile resistance provides a definitive, satisfying mechanical click for every interaction point." },
  ];
  const gallery = [
    { alt: "Close up of a textured dark metal surface with perfect geometric lines", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuATOAhumNxbylkmQyVdGwJg56zzpJCztfEK_lJxgeeQ-9uLXeuBK--esOZEfP9eTKsXsJDdjfSMmUpBWUmdxdpoh4NRHnkmDLDv0JIpCQ5058vGGR45zVe8wpFcDg61HHdP7nSgxnUpRiHBcZ2w7lQ7-T9Vf5Uo256wOAP6IUqusa-EyHGJX8LvCS9y0IRQOUVC4yRQlmgmlJGA9uTjyj_TL6gie1Alu-ptFuYqgz_-Mswd5rWqxGD_SNVBBudBUVCHtwskjGl1QKA", caption: "The geometry of strength.", grayscale: false },
    { alt: "Abstract macro of polished glass and metal reflecting light", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHPNubmbUzes4dINs3h9UMPOdR-hZXblnelMAoFdFnAlLnFfZYf72VbhzlKVc0e9Y6Yxul3BnUY3tUakTsEVvc_bm5tlK9CNTicvEAyXzYCXB7PLO5hceRvoENokH8SpDoxa438rSUj4victwYn5CWENQac8JLdrO0fFy_CbaTQNPQZci4wUsdUCMSDPjrgSUIqUAkdWxhaBhkJnD3h-1lICz_VyVrUvXSLxkqPkmSxJ6HPZAjRlNC5PQKkB7YmOLg8OTQtLYc9Uw", caption: "Refraction and clarity.", grayscale: false },
    { alt: "A technician in a sterile environment working on a pristine component", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJqYC7vEbN3YAADs-jPUcMEQFTXUW9RMdmyTncajSyo-gvHhFq6XLdC7dZyuDUqyF8USQBWyoOBSEu9nnU9ArkFSkHCwyVp7VSsqLAWvnw8QUKlLczg8E4GBACRlTHt68II4EhPopzq4yQ-gNsJazSqeDOZuI6el45clCIlnaR6gZQAzs-tjm3qgJHROnqti-c9GIyw6TgT-ba4oxmlQdNA6vfqImzP3qqM4h_qjBtsY_MucijJNexlsxAL0sHgQhF1lrC8yFHrQQ", caption: "Human calibration.", grayscale: true },
  ];
  const footerLinks = ["Archives", "Sustainability", "Terms of Service", "Press Inquiry"];

  // NEW data arrays
  const atelierFrames = [
    { delay: "0s", alt: "Watchmaker hand-bevelling a movement bridge under loupe", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoxAsRwSdDt9pIakDdZOef1RPM6Wmc8j1fKH-dh1koHyQZd8YO8dY4i5S7ka4-I1jz-J6KWMwZjCmgUEMmAxMHXq0soRa17eDuqurp1BlMtgh4RV1I2oGc5vuL0tUE4ZPiuBSjbbnDpqKYrCiZl3Fr-hiqvlwcqiz3h0FxJtA50dRKBRecwWEMkqjg2NrWRWG6zWiO78qUeShPYma_b30GW5XWqERUqyD1_by16hnkex879BB8OJv3M4AqnnKGnRtk4x8Vw_Nqxh8" },
    { delay: "4s", alt: "Polished mainplate at the polishing station", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuATOAhumNxbylkmQyVdGwJg56zzpJCztfEK_lJxgeeQ-9uLXeuBK--esOZEfP9eTKsXsJDdjfSMmUpBWUmdxdpoh4NRHnkmDLDv0JIpCQ5058vGGR45zVe8wpFcDg61HHdP7nSgxnUpRiHBcZ2w7lQ7-T9Vf5Uo256wOAP6IUqusa-EyHGJX8LvCS9y0IRQOUVC4yRQlmgmlJGA9uTjyj_TL6gie1Alu-ptFuYqgz_-Mswd5rWqxGD_SNVBBudBUVCHtwskjGl1QKA" },
    { delay: "8s", alt: "Microscopic regulation of escapement frequency", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJqYC7vEbN3YAADs-jPUcMEQFTXUW9RMdmyTncajSyo-gvHhFq6XLdC7dZyuDUqyF8USQBWyoOBSEu9nnU9ArkFSkHCwyVp7VSsqLAWvnw8QUKlLczg8E4GBACRlTHt68II4EhPopzq4yQ-gNsJazSqeDOZuI6el45clCIlnaR6gZQAzs-tjm3qgJHROnqti-c9GIyw6TgT-ba4oxmlQdNA6vfqImzP3qqM4h_qjBtsY_MucijJNexlsxAL0sHgQhF1lrC8yFHrQQ" },
    { delay: "12s", alt: "Final cleaning before assembly under sterile light", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHPNubmbUzes4dINs3h9UMPOdR-hZXblnelMAoFdFnAlLnFfZYf72VbhzlKVc0e9Y6Yxul3BnUY3tUakTsEVvc_bm5tlK9CNTicvEAyXzYCXB7PLO5hceRvoENokH8SpDoxa438rSUj4victwYn5CWENQac8JLdrO0fFy_CbaTQNPQZci4wUsdUCMSDPjrgSUIqUAkdWxhaBhkJnD3h-1lICz_VyVrUvXSLxkqPkmSxJ6HPZAjRlNC5PQKkB7YmOLg8OTQtLYc9Uw" },
  ];
  const atelierPhases = [
    { roman: "I", label: "Bevel" },
    { roman: "II", label: "Polish" },
    { roman: "III", label: "Regulate" },
    { roman: "IV", label: "Clean" },
  ];
  // Atmosphere plates — image-context cleanup 2026-05-06: 3 of the original Unsplash IDs
  // were on the playbook §Q.1 verified-mismatch list (woman portrait posing as "Tools",
  // NES PCB posing as "Index", brick wall posing as "Bench"). Swapped to aida-public
  // watch-atelier images already loaded by this template (HD, on-brand, depict actual
  // atelier work). Cornice + Stair kept since the architectural Unsplash IDs read true.
  // (URLs duplicated inline rather than referencing refImgN consts which are declared
  // later in this same function — order-of-declaration matters in this template.)
  const atmospherePlates = [
    { roman: "I",   title: "Tools",   alt: "Watchmaker's hand bevelling a movement bridge under loupe — the tool work at the bench", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoxAsRwSdDt9pIakDdZOef1RPM6Wmc8j1fKH-dh1koHyQZd8YO8dY4i5S7ka4-I1jz-J6KWMwZjCmgUEMmAxMHXq0soRa17eDuqurp1BlMtgh4RV1I2oGc5vuL0tUE4ZPiuBSjbbnDpqKYrCiZl3Fr-hiqvlwcqiz3h0FxJtA50dRKBRecwWEMkqjg2NrWRWG6zWiO78qUeShPYma_b30GW5XWqERUqyD1_by16hnkex879BB8OJv3M4AqnnKGnRtk4x8Vw_Nqxh8" },
    { roman: "II",  title: "Index",   alt: "Component schematic — every part indexed before assembly",                              src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBwOBi63mkZdvC5cYAjxxD2_fas9UcdzjOdeKbmEUr9Vlu9n2G5191A9U7fdykrBwPjAEv0QvXqOw7UOd75iMk-7rx1-1H88MCVTmWMpV6rGVtk6DF4sSh0Yc-mVhE2FRT606PdzWe5nS93ZXTTd3qJ8HKeNLLnlKUF1nvptmtJWdVwF5WHnMPJZxf_1HGFtk4Dur5QhMTxn0Qi1nVL12MQ_IVFnRcyveL17428QBihOJZOGdkb1pNrIIHRKNGO3bNs1hj3fWHJY0" },
    { roman: "III", title: "Cornice", alt: "Architectural cornice of the atelier ceiling, photographed at noon",                    src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop" },
    { roman: "IV",  title: "Bench",   alt: "Final cleaning under sterile light, between the pliers and the loupe",                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHPNubmbUzes4dINs3h9UMPOdR-hZXblnelMAoFdFnAlLnFfZYf72VbhzlKVc0e9Y6Yxul3BnUY3tUakTsEVvc_bm5tlK9CNTicvEAyXzYCXB7PLO5hceRvoENokH8SpDoxa438rSUj4victwYn5CWENQac8JLdrO0fFy_CbaTQNPQZci4wUsdUCMSDPjrgSUIqUAkdWxhaBhkJnD3h-1lICz_VyVrUvXSLxkqPkmSxJ6HPZAjRlNC5PQKkB7YmOLg8OTQtLYc9Uw" },
    { roman: "V",   title: "Stair",   alt: "Architectural light study at the upper-floor stair of the workshop",                     src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop" },
  ];
  // Marquee references — reuse existing aida-public URLs (per playbook §H.12 / §M.9)
  const refImg1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAvcVRPGeEb6RQVOWXtrhWnADmsMNIqxbQ1d15EB6P7WaB76U5Z06IsIBmzysXl0jXfGPTFJ6EeC98GINJMnxNYimgTL1s8Db8p7PuBHXDgg6Ftw0-CBU7ocDhSrVfnpCKW_6osdguvrMtXlByGnlaqisl1d_OeM4OHPfkeFzU7ftBUdhg3zLirGT7NOljaTM7U3-SVtBkRFN9CGU76mxV1DKTTczZQsUUPMdj99jmlSxCAXlCpq3MXm4qVR-WoK37V6X6IOmGNDRY";
  const refImg2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuATOAhumNxbylkmQyVdGwJg56zzpJCztfEK_lJxgeeQ-9uLXeuBK--esOZEfP9eTKsXsJDdjfSMmUpBWUmdxdpoh4NRHnkmDLDv0JIpCQ5058vGGR45zVe8wpFcDg61HHdP7nSgxnUpRiHBcZ2w7lQ7-T9Vf5Uo256wOAP6IUqusa-EyHGJX8LvCS9y0IRQOUVC4yRQlmgmlJGA9uTjyj_TL6gie1Alu-ptFuYqgz_-Mswd5rWqxGD_SNVBBudBUVCHtwskjGl1QKA";
  const refImg3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAHPNubmbUzes4dINs3h9UMPOdR-hZXblnelMAoFdFnAlLnFfZYf72VbhzlKVc0e9Y6Yxul3BnUY3tUakTsEVvc_bm5tlK9CNTicvEAyXzYCXB7PLO5hceRvoENokH8SpDoxa438rSUj4victwYn5CWENQac8JLdrO0fFy_CbaTQNPQZci4wUsdUCMSDPjrgSUIqUAkdWxhaBhkJnD3h-1lICz_VyVrUvXSLxkqPkmSxJ6HPZAjRlNC5PQKkB7YmOLg8OTQtLYc9Uw";
  const refImg4 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBJqYC7vEbN3YAADs-jPUcMEQFTXUW9RMdmyTncajSyo-gvHhFq6XLdC7dZyuDUqyF8USQBWyoOBSEu9nnU9ArkFSkHCwyVp7VSsqLAWvnw8QUKlLczg8E4GBACRlTHt68II4EhPopzq4yQ-gNsJazSqeDOZuI6el45clCIlnaR6gZQAzs-tjm3qgJHROnqti-c9GIyw6TgT-ba4oxmlQdNA6vfqImzP3qqM4h_qjBtsY_MucijJNexlsxAL0sHgQhF1lrC8yFHrQQ";
  const refImg5 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAoxAsRwSdDt9pIakDdZOef1RPM6Wmc8j1fKH-dh1koHyQZd8YO8dY4i5S7ka4-I1jz-J6KWMwZjCmgUEMmAxMHXq0soRa17eDuqurp1BlMtgh4RV1I2oGc5vuL0tUE4ZPiuBSjbbnDpqKYrCiZl3Fr-hiqvlwcqiz3h0FxJtA50dRKBRecwWEMkqjg2NrWRWG6zWiO78qUeShPYma_b30GW5XWqERUqyD1_by16hnkex879BB8OJv3M4AqnnKGnRtk4x8Vw_Nqxh8";
  const refImg6 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBwp0f9VCLogH5Sg6eA_zIa0z84lxwC6RdG_q235eTbIJvAfLKeIfEVc_YqBx2JwFjlw5NLYSnBb-06t-wkF5X69t9CCirPymcFhYlvAEVjRMjWci_xIBFJJfJ4seBHx6J2D0yrDKlR8mCpR12dgLuutDij-350kGGslF7Gabs-Ee1b048C_kq4VfdSr05IDAAw0wCj4hRqg89jM8qEV54vB01m9yVXV4ggk1R_zn5um1lePtrye8WEffnmGIp1F9XTySWfLreVAHE";
  const refImg7 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBBwOBi63mkZdvC5cYAjxxD2_fas9UcdzjOdeKbmEUr9Vlu9n2G5191A9U7fdykrBwPjAEv0QvXqOw7UOd75iMk-7rx1-1H88MCVTmWMpV6rGVtk6DF4sSh0Yc-mVhE2FRT606PdzWe5nS93ZXTTd3qJ8HKeNLLnlKUF1nvptmtJWdVwF5WHnMPJZxf_1HGFtk4Dur5QhMTxn0Qi1nVL12MQ_IVFnRcyveL17428QBihOJZOGdkb1pNrIIHRKNGO3bNs1hj3fWHJY0";
  // Pre-computed widths (per playbook §K.11 / §M.14)
  const portraitW = "w-72 aspect-[3/4]";
  const landscapeWMd = "w-80 aspect-[16/10]";
  const landscapeWLg = "w-96 aspect-[16/10]";
  const references = [
    { name: "Calibre Noir", meta: "Ref · MP-001 · 38mm", w: portraitW, src: refImg1 },
    { name: "Salle Argent", meta: "Ref · MP-002 · 41mm", w: landscapeWMd, src: refImg2 },
    { name: "La Lumière", meta: "Ref · MP-003 · 36mm", w: portraitW, src: refImg3 },
    { name: "Atelier Plaque", meta: "Ref · MP-004 · Limited 12", w: landscapeWLg, src: refImg4 },
    { name: "Plein Soir", meta: "Ref · MP-005 · 39mm", w: portraitW, src: refImg5 },
    { name: "Schémas", meta: "Ref · MP-006 · Squelette", w: landscapeWMd, src: refImg6 },
    { name: "Maison Onyx", meta: "Ref · MP-007 · 40mm", w: portraitW, src: refImg7 },
  ];
  const numbers = [
    { n: "XII", label: "Years on the bench", sub: "Founded MMXII · Geneva" },
    { n: "324", label: "Components per calibre", sub: "Each hand-finished, indexed" },
    { n: "XLVII", label: "Pieces per year", sub: "Strictly allocated" },
    { n: "II", label: "Master watchmakers", sub: "No outsourced labour" },
  ];

  // The Owner's Compact — 4-card section explaining what custodianship of a Masterpiece
  // actually means. Each card has an inline SVG icon (line-weight 1.5, 24×24, currentColor
  // so it inherits the section's text color), a Roman-numeralled chapter label, a title,
  // body, and a footnote. Premium feel: hairline borders + sepia/0 grayscale.
  const ownerCompact = [
    {
      roman: "I",
      label: "Compact No. I",
      title: "Lifetime service.",
      body: "Every Masterpiece returns to the Geneva atelier on a fifteen-year cycle. Disassembly, ultrasonic cleaning, lubrication, and re-regulation — performed by the same two watchmakers who built the calibre. Cost is included in the original allocation.",
      foot: "Service interval · 15 yrs · Geneva, CH",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    },
    {
      roman: "II",
      label: "Compact No. II",
      title: "Heritage documents.",
      body: "Each piece ships with a leather-bound dossier — original drawings, signed assembly card, the watchmaker's regulation log, and a short history of the calibre's place in the registry. Replacements never issued, only re-stamped.",
      foot: "Includes signed dossier · 24 pages",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    },
    {
      roman: "III",
      label: "Compact No. III",
      title: "Private atelier visit.",
      body: "Once allocated, you receive a year's standing invitation to the bench. We ask twenty-four hours of notice. Coffee is on the long table, the loupe is yours to look through, and the watchmaker will close the day with you.",
      foot: "By appointment · Geneva atelier",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    },
    {
      roman: "IV",
      label: "Compact No. IV",
      title: "Generational custody.",
      body: "Your name in the registry remains permanent. When the piece passes to the next custodian, we update the dossier in person — at no cost — and re-tune the calibre to the new wrist. The piece is always returned to the original specification on request.",
      foot: "No re-issue fee · Custody log kept",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    },
  ];

  const customCss = `
    html, body { overflow-x: clip; }
    .full-bleed { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }

    @keyframes atelier-fade {
      0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
      8%, 22%  { opacity: 1; filter: blur(0) saturate(1);    transform: scale(1); }
      26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
    }
    .atelier-cycle-img {
      animation: atelier-fade 16s linear infinite;
      opacity: 0;
      filter: blur(18px) saturate(0.8);
      transform: scale(1.04);
      will-change: opacity, filter, transform;
    }
    @keyframes atelier-scrub {
      0%   { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }
    .atelier-scrub-bar { animation: atelier-scrub 16s linear infinite; transform-origin: left; }

    .marquee-track { display: flex; gap: 24px; width: max-content; }
    @keyframes marquee-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
    .marquee-strip { animation: marquee-x 60s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }
    .marquee-strip:hover { animation-play-state: paused; }

    @media (prefers-reduced-motion: reduce) {
      .atelier-cycle-img { animation: none; }
      .atelier-cycle-img:first-of-type { opacity: 1; filter: none; transform: none; }
      .atelier-scrub-bar { animation: none; transform: scaleX(1); }
      .marquee-strip { animation: none; }
    }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#000000", "on-primary": "#ffffff",
                "primary-container": "#061d32", "on-primary-container": "#72859f",
                "primary-fixed-dim": "#b4c8e4",
                "tertiary-container": "#40000f", "on-tertiary": "#ffffff",
                "surface": "#fbf9fb", "on-surface": "#1b1c1d",
                "on-surface-variant": "#44474d",
                "outline-variant": "#c4c6cd",
                "surface-container": "#efedef"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "xl": "128px", "lg": "64px", "md": "32px", "sm": "16px", "xs": "8px", "unit": "4px", "gutter": "24px", "margin": "48px" },
              fontFamily: {
                "headline-lg": ["Newsreader"], "headline-md": ["Newsreader"], "display-xl": ["Newsreader"],
                "ui-technical": ["Space Grotesk"], "label-sm": ["Inter"], "body-lg": ["Inter"], "body-md": ["Inter"]
              },
              fontSize: {
                "display-xl": ["84px", { lineHeight: "1.0", letterSpacing: "-0.02em", fontWeight: "300" }],
                "headline-lg": ["48px", { lineHeight: "1.1", fontWeight: "400" }],
                "headline-md": ["32px", { lineHeight: "1.2", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
                "ui-technical": ["14px", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "500" }],
                "label-sm": ["12px", { lineHeight: "1.2", fontWeight: "600" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="bg-surface text-on-surface antialiased font-body-md text-body-md selection:bg-primary-container selection:text-on-primary-container">
        <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center px-8 md:px-16 py-6">
          <div className="text-2xl font-serif italic tracking-tighter text-slate-900 dark:text-slate-50 font-headline-md text-headline-md">MASTERPIECE</div>
          <nav className="hidden md:flex gap-8">
            {navLinks.map((l) => (
              <a key={l.label} href="#" className={l.active
                ? "text-slate-900 dark:text-white border-b border-slate-900 dark:border-white pb-1 font-ui-technical text-ui-technical hover:opacity-70 transition-opacity"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 font-ui-technical text-ui-technical hover:opacity-70 transition-opacity"
              }>{l.label}</a>
            ))}
          </nav>
          <button className="hidden md:block bg-primary text-on-primary px-6 py-3 font-ui-technical text-ui-technical uppercase hover:opacity-70 transition-opacity rounded-none">Request Access</button>
          <button className="md:hidden">
            <span className="material-symbols-outlined text-on-surface">menu</span>
          </button>
        </header>
        <main>
          {/* Section 1: Hero */}
          <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="Luxury mechanical watch movement" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvcVRPGeEb6RQVOWXtrhWnADmsMNIqxbQ1d15EB6P7WaB76U5Z06IsIBmzysXl0jXfGPTFJ6EeC98GINJMnxNYimgTL1s8Db8p7PuBHXDgg6Ftw0-CBU7ocDhSrVfnpCKW_6osdguvrMtXlByGnlaqisl1d_OeM4OHPfkeFzU7ftBUdhg3zLirGT7NOljaTM7U3-SVtBkRFN9CGU76mxV1DKTTczZQsUUPMdj99jmlSxCAXlCpq3MXm4qVR-WoK37V6X6IOmGNDRY" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            </div>
            <div className="relative z-10 text-center px-gutter text-white">
              <h1 className="font-display-xl text-[36px] sm:text-[52px] md:text-[64px] lg:text-display-xl italic drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">Form. Function. Soul.</h1>
            </div>
            <div className="absolute bottom-12 z-10 flex flex-col items-center gap-unit text-white">
              <span className="font-ui-technical text-ui-technical uppercase tracking-widest text-[10px]">Scroll</span>
              <div className="w-px h-12 bg-white/50" />
            </div>
          </section>
          {/* Section 2: The Pedigree (Bento Grid) */}
          <section className="max-w-screen-2xl mx-auto px-gutter md:px-margin py-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-outline-variant">
              <div className="col-span-1 md:col-span-8 bg-surface p-lg md:p-xl flex flex-col justify-between min-h-[400px]">
                <span className="font-ui-technical text-ui-technical text-on-surface-variant uppercase">[01_LEGACY]</span>
                <div className="max-w-2xl mt-lg">
                  <h2 className="font-headline-lg text-headline-lg mb-md">An obsession with the unyielding pursuit of perfection.</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">We do not manufacture; we distill. Every component is subjected to a rigorous evaluation of utility and aesthetic harmony. The result is an artifact that transcends its utilitarian purpose.</p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-4 bg-surface min-h-[400px] relative overflow-hidden group">
                <img alt="Grainy black and white photograph of an artisan's hands carefully adjusting a microscopic mechanism" className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoxAsRwSdDt9pIakDdZOef1RPM6Wmc8j1fKH-dh1koHyQZd8YO8dY4i5S7ka4-I1jz-J6KWMwZjCmgUEMmAxMHXq0soRa17eDuqurp1BlMtgh4RV1I2oGc5vuL0tUE4ZPiuBSjbbnDpqKYrCiZl3Fr-hiqvlwcqiz3h0FxJtA50dRKBRecwWEMkqjg2NrWRWG6zWiO78qUeShPYma_b30GW5XWqERUqyD1_by16hnkex879BB8OJv3M4AqnnKGnRtk4x8Vw_Nqxh8" />
                <div className="absolute inset-0 border border-outline-variant/30 pointer-events-none" />
                <span className="absolute top-sm right-sm bg-surface/80 backdrop-blur-sm px-2 py-1 font-ui-technical text-[10px] uppercase text-on-surface">Artisan</span>
              </div>
              <div className="col-span-1 md:col-span-6 bg-surface p-lg min-h-[400px] relative border-t md:border-t-0 md:border-r border-outline-variant">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] mix-blend-multiply pointer-events-none" />
                <span className="font-ui-technical text-ui-technical text-on-surface-variant uppercase block mb-md">[02_SCHEMATIC]</span>
                <img alt="Technical blueprint of a mechanical device on a pristine white background" className="w-full h-auto object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwp0f9VCLogH5Sg6eA_zIa0z84lxwC6RdG_q235eTbIJvAfLKeIfEVc_YqBx2JwFjlw5NLYSnBb-06t-wkF5X69t9CCirPymcFhYlvAEVjRMjWci_xIBFJJfJ4seBHx6J2D0yrDKlR8mCpR12dgLuutDij-350kGGslF7Gabs-Ee1b048C_kq4VfdSr05IDAAw0wCj4hRqg89jM8qEV54vB01m9yVXV4ggk1R_zn5um1lePtrye8WEffnmGIp1F9XTySWfLreVAHE" />
              </div>
              <div className="col-span-1 md:col-span-6 bg-surface p-lg min-h-[400px] border-t md:border-t-0 border-outline-variant flex flex-col justify-center items-center text-center">
                <span className="font-ui-technical text-ui-technical text-on-surface-variant uppercase mb-md">[03_MATERIAL]</span>
                <h3 className="font-headline-md text-headline-md italic mb-sm">Forged in Titanium.</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Grade 5 Titanium provides exceptional strength-to-weight ratio, ensuring resilience without compromise.</p>
              </div>
            </div>
          </section>
          {/* Section 2.5 (NEW): Atelier — sticky-rail + 16s cycling image */}
          <section className="max-w-screen-2xl mx-auto px-gutter md:px-margin py-xl border-t border-outline-variant/40">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg md:gap-xl">
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start mb-md md:mb-0 flex flex-col gap-md">
                <span className="font-ui-technical text-ui-technical text-on-surface-variant uppercase">[II_ATELIER]</span>
                <h2 className="font-headline-lg text-headline-lg italic">Inside the bench, four <em>silences</em>.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">A working day at the Geneva atelier, observed without interruption. Hand-bevelling, polishing, microscopic regulation, final cleaning — each frame is the same room, three hours apart.</p>
                <div className="flex items-center gap-md max-w-sm">
                  <div className="flex-1 h-px bg-outline-variant relative overflow-hidden">
                    <div className="absolute inset-0 origin-left bg-on-surface atelier-scrub-bar" />
                  </div>
                  <span className="font-ui-technical text-[10px] uppercase tracking-widest text-on-surface-variant tabular-nums whitespace-nowrap">04 frames · 16s loop</span>
                </div>
                <div className="flex flex-wrap gap-md font-ui-technical text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <span>Atelier No. II</span><span className="opacity-30">·</span><span>Geneva</span><span className="opacity-30">·</span><span>MMXXIV</span>
                </div>
                <a href="#" className="inline-block self-start mt-sm border border-on-surface px-md py-3 font-ui-technical text-ui-technical uppercase hover:bg-on-surface hover:text-surface transition-colors">Visit the bench →</a>
              </div>
              <div className="md:col-span-7">
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden border border-outline-variant/60 bg-surface-container">
                  {atelierFrames.map((f) => (
                    <img key={f.delay} alt={f.alt} className="atelier-cycle-img absolute inset-0 w-full h-full object-cover grayscale" style={{ animationDelay: f.delay }} src={f.src} />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
                  <span className="absolute top-md left-md font-ui-technical text-[10px] uppercase tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">Live · Atelier Cam</span>
                  <span className="absolute top-md right-md font-ui-technical text-[10px] uppercase tracking-widest text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">Plate · I–IV</span>
                </div>
                <div className="grid grid-cols-4 gap-sm mt-md font-ui-technical text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {atelierPhases.map((p) => (
                    <div key={p.roman} className="flex flex-col gap-1 border-t border-outline-variant/60 pt-2">
                      <span className="tabular-nums">{p.roman}</span>
                      <span>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Section 3: Technical Precision */}
          <section className="bg-primary-container text-on-primary-container py-xl border-y border-outline-variant/30">
            <div className="max-w-screen-xl mx-auto px-gutter md:px-margin grid grid-cols-1 md:grid-cols-2 gap-lg relative">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-outline-variant/20 hidden md:block" />
              {[0, 1].map((col) => (
                <div key={col} className={col === 0 ? "flex flex-col gap-lg pr-0 md:pr-lg" : "flex flex-col gap-lg pl-0 md:pl-lg"}>
                  {specs.slice(col * 2, col * 2 + 2).map((s) => (
                    <div key={s.code} className="border-b border-outline-variant/20 pb-md">
                      <span className="font-ui-technical text-ui-technical text-primary-fixed-dim block mb-xs">{s.code}</span>
                      <h4 className="font-body-lg text-body-lg font-semibold text-on-primary">{s.title}</h4>
                      <p className="font-body-md text-body-md mt-sm text-on-primary-container/80">{s.body}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
          {/* Section 3.5 (NEW): Atmosphere — 5 framed image-strip tiles */}
          <section className="max-w-screen-2xl mx-auto px-gutter md:px-margin py-xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-lg">
              <div className="max-w-xl">
                <span className="font-ui-technical text-ui-technical text-on-surface-variant uppercase block mb-xs">[III_ATMOSPHERE]</span>
                <h2 className="font-headline-lg text-headline-lg italic">From the floor.</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Plates from the working space, photographed at noon. Hover to lift the grayscale.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-sm">
              {atmospherePlates.map((p) => (
                <figure key={p.roman} className="relative aspect-[3/4] overflow-hidden border border-outline-variant/60 group">
                  <img alt={p.alt} className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" src={p.src} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <figcaption className="absolute inset-x-md bottom-md flex items-end justify-between text-white">
                    <span className="font-headline-md text-[20px] italic leading-none">{p.title}</span>
                    <span className="font-ui-technical text-[10px] uppercase tracking-widest opacity-80 tabular-nums">{p.roman}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="text-center mt-md font-ui-technical text-[10px] uppercase tracking-widest text-on-surface-variant">Photographs by House · Floor No. II · MMXXIV</p>
          </section>
          {/* Section 4: The Gallery */}
          <section className="py-xl max-w-screen-2xl mx-auto px-gutter md:px-margin overflow-hidden">
            <h2 className="font-headline-lg text-headline-lg text-center mb-lg">Visual Archive.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {gallery.map((g) => (
                <div key={g.caption} className="flex flex-col gap-sm">
                  <img alt={g.alt} src={g.src} className={`w-full h-[500px] object-cover border border-outline-variant/50${g.grayscale ? " grayscale" : ""}`} />
                  <p className="font-headline-md text-[24px] italic text-on-surface-variant">{g.caption}</p>
                </div>
              ))}
            </div>
          </section>
          {/* Section 4.5 (NEW): References — paused-on-hover marquee */}
          <section className="full-bleed py-xl bg-primary-container text-on-primary-container border-y border-outline-variant/30 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-gutter md:px-margin flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-lg">
              <div>
                <span className="font-ui-technical text-ui-technical text-primary-fixed-dim uppercase block mb-xs">[IV_REFERENCES]</span>
                <h2 className="font-headline-lg text-headline-lg italic text-on-primary">The vault, in motion.</h2>
              </div>
              <p className="font-body-md text-body-md text-on-primary-container/80 max-w-md">Eight references currently held in the registry — hover to pause the strip.</p>
            </div>
            <div className="overflow-hidden py-3">
              <div className="marquee-track marquee-strip">
                {[...references, ...references].map((r, idx) => (
                  <figure key={`r-${idx}`} aria-hidden={idx >= references.length ? "true" : undefined} className={`relative ${r.w} shrink-0 overflow-hidden border border-primary-fixed-dim/40 group`}>
                    <img alt={idx >= references.length ? "" : `${r.name} — reference plate`} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src={r.src} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                    <figcaption className="absolute inset-x-md bottom-md text-white">
                      <span className="block font-headline-md text-[18px] italic leading-tight">{r.name}</span>
                      <span className="block font-ui-technical text-[10px] uppercase tracking-widest opacity-80 tabular-nums mt-1">{r.meta}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
          {/* Section 4.75 (NEW): By the Numbers — 4 stat tiles */}
          <section className="max-w-screen-xl mx-auto px-gutter md:px-margin py-xl">
            <div className="text-center mb-lg">
              <span className="font-ui-technical text-ui-technical text-on-surface-variant uppercase block mb-xs">[V_REGISTRY]</span>
              <h2 className="font-headline-lg text-headline-lg italic">By the numbers, since MMXII.</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 border-y border-on-surface/30 md:divide-x md:divide-on-surface/20">
              {numbers.map((s, i) => (
                <div key={s.label} className={`flex flex-col items-center text-center py-lg px-md gap-xs ${i < 2 ? "border-b md:border-b-0 border-on-surface/20" : ""}`}>
                  <span className="font-display-xl text-[64px] md:text-[84px] italic leading-none text-on-surface tabular-nums">{s.n}</span>
                  <div className="w-12 h-px bg-on-surface/40 my-xs" />
                  <span className="font-ui-technical text-ui-technical uppercase tracking-widest text-on-surface-variant">{s.label}</span>
                  <span className="font-body-md italic text-on-surface-variant/80 text-sm">{s.sub}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Section 4.85 (NEW): The Owner's Compact — 4 cards with icons (premium custodianship terms) */}
          <section className="full-bleed bg-primary text-on-primary py-xl border-y border-on-primary/10 overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-gutter md:px-margin">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-lg pb-md border-b border-on-primary/15">
                <div className="max-w-xl">
                  <span className="font-ui-technical text-ui-technical text-primary-fixed-dim uppercase block mb-xs">[VI_COMPACT]</span>
                  <h2 className="font-headline-lg text-headline-lg italic text-on-primary">The Owner's Compact.</h2>
                </div>
                <p className="font-body-md text-body-md text-on-primary/70 max-w-md">A piece allocated from the registry travels with four standing terms. Each one is signed at delivery, and remains in force for the lifetime of the calibre — including its custodians yet to come.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-on-primary/10">
                {ownerCompact.map((c) => (
                  <article key={c.roman} className="bg-primary p-lg flex flex-col gap-sm md:gap-md min-h-[280px]">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 border border-on-primary/30 flex items-center justify-center text-on-primary">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{c.icon}</svg>
                      </span>
                      <span className="font-ui-technical text-[10px] uppercase tracking-widest text-primary-fixed-dim tabular-nums">{c.label}</span>
                    </div>
                    <h3 className="font-headline-md text-[26px] italic leading-tight text-on-primary mt-sm">{c.title}</h3>
                    <p className="font-body-md text-body-md text-on-primary/75 leading-relaxed">{c.body}</p>
                    <div className="mt-auto pt-md border-t border-on-primary/15 flex items-baseline justify-between gap-md">
                      <span className="font-ui-technical text-[10px] uppercase tracking-widest text-primary-fixed-dim">{c.foot}</span>
                      <span className="font-display-xl text-[32px] italic leading-none text-on-primary/40 tabular-nums">{c.roman}</span>
                    </div>
                  </article>
                ))}
              </div>
              <p className="text-center mt-lg font-ui-technical text-[10px] uppercase tracking-widest text-on-primary/50">Signed at delivery · Held in registry · MMXII — present</p>
            </div>
          </section>

          {/* Section 5: The Inquiry (CTA) */}
          <section className="py-xl bg-surface border-t border-outline-variant/30 flex justify-center items-center">
            <div className="max-w-md w-full px-gutter text-center flex flex-col items-center gap-md">
              <span className="material-symbols-outlined text-4xl text-on-surface font-light">mail</span>
              <h2 className="font-headline-md text-headline-md">Join the registry.</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">Production is strictly limited. Submit your credentials to request an allocation.</p>
              <form className="w-full flex flex-col gap-md" onSubmit={(e) => e.preventDefault()}>
                <div className="relative w-full">
                  <input id="email" type="email" placeholder=" " required className="block w-full px-0 py-3 bg-transparent border-0 border-b border-primary appearance-none focus:outline-none focus:ring-0 focus:border-tertiary-container peer font-body-md text-body-md text-on-surface" />
                  <label htmlFor="email" className="absolute font-ui-technical text-ui-technical uppercase text-on-surface-variant duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-tertiary-container peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email Address</label>
                </div>
                <button type="submit" className="w-full bg-tertiary-container text-on-tertiary px-lg py-4 font-ui-technical text-ui-technical uppercase tracking-widest hover:bg-tertiary-container/90 transition-colors rounded-none mt-sm">Request Access</button>
              </form>
            </div>
          </section>
        </main>
        <footer className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-serif text-sm leading-relaxed w-full pt-32 pb-12 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-4">
              <span className="text-lg font-serif italic mb-4 block">MASTERPIECE</span>
            </div>
            <div className="col-span-1 md:col-span-3 flex flex-wrap gap-8">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 transition-colors">{l}</a>
              ))}
            </div>
            <div className="col-span-1 md:col-span-4 mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
              <p className="text-slate-500 dark:text-slate-400 text-xs tracking-widest uppercase">© 2024 MASTERPIECE COLLECTIVE. ENGINEERED PRECISION.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
