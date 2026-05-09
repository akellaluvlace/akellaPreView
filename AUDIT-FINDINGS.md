# Template Audit Findings — 2026-05-08

Read-only audit of all 108 HTML/JSX template pairs in `web/`, run per `template-upgrade-playbook.md`. Six parallel agents covered batches 1–19, 20–39, 42–59, 60–79, 80–99, 100–112. **No files edited. No commits. No pushes.**

Per-batch source reports persisted at `C:\Users\nikit\AppData\Local\Temp\audit-findings\batch-{2..6}.md`. Batch 1's per-batch file did not persist (write failed silently); its findings are captured in this aggregate from the agent's summary.

---

## 0. Executive summary

| Severity | Count |
|---|---|
| CRITICAL | **172** |
| HIGH | **75** |
| MEDIUM | **59** |
| LOW | **72** |
| **TOTAL** | **378** |

**Per-batch totals**

| Batch | Range | CRIT | HIGH | MED | LOW |
|---|---|---|---|---|---|
| 1 | 1–19 | 32 | 9 | 4 | 14 |
| 2 | 20–39 | 79 | 0 | 2 | 18 |
| 3 | 42–59 | 8 | 24 | 11 | 1 |
| 4 | 60–79 | 7 | 23 | 12 | 20 |
| 5 | 80–99 | 46 | 4 | 20 | 8 |
| 6 | 100–112 | 0 | 15 | 10 | 11 |

**Highest-priority templates (by raw severity weighted to CRIT)**

1. **45-real-estate-listing** — 5 CRIT + 3 HIGH. Near-total imagery breakdown; unfit to ship as-is.
2. **31-law-firm** — 7 CRIT. 7 of 8 partner head-shots are gender/identity mismatches.
3. **38-podcast-style** — 8 CRIT. Brass apothecary + banana + sofa + clothing-rack as host portraits.
4. **34-editorial-magazine** — 7 CRIT. Banana as Hokkaido, sticky-notes as broadsheet, sofa as Faroe cliffs.
5. **94-solarpunk** — 7 CRIT. Entire 8-station carousel is mismatched.
6. **95-constructivist-russian** — 8 CRIT. Cast portraits (4) + machinery + server-room + Rodchenko portrait + B&W portrait all wrong.
7. **109-dark-luxury-occult** — 3 HIGH (all three hero photos wrong) + 2 MED.
8. **65-typographic-swiss-poster** — 1 CRIT + 6 HIGH. 6 of 8 speaker portraits broken.
9. **22-photographer-portfolio** — 6 CRIT. Banana decorative, handbag/sweaters/forest-camera as fine-art prints.
10. **82-nonprofit** — 6 CRIT. Marine biologist portraits served as handbag/sweaters/shopping-bags.
11. **89-editorial-magazine** — 5 CRIT. Author bylines all served as fashion stock.
12. **97-blueprintiachitectural** — 5 CRIT + 1 HIGH (broken `adobe` slug).
13. **23-personal-brand-store / 32-studio-showcase / 33-one-page-pitch / 34 / 38 / 35** — each 5+ CRIT.

---

## 1. Cross-cutting patterns

### 1.1 The "cascade-ID drift" problem (root cause of ~80% of CRITICALs)

A small pool of curated Unsplash IDs has been re-used across many templates with archetype-incompatible alt text. **Subjects have drifted**: photos that worked a year ago now serve different bytes (Unsplash re-encodes under the same ID) or were force-fit into wrong archetypes at template-build time. All 200-OK on HTTP, all wrong on visual inspection.

**Confirmed wrong-subject IDs and where they're misused:**

| ID | Actual subject (verified 2026-05-08 via download + multimodal inspection) | Misused as | Templates |
|---|---|---|---|
| `photo-1481349518771-20055b2a7b24` | **Yellow banana on pink background** | "long architectural corridor" / "concrete corridor" / "library shelf" / "Color foundation" / "MODEL-808 FM/tape player" / "Atelier · Marfa" / "Bauakademie portrait" / "Western Ghats" / "Hokkaido railway" / etc. | 22, 23, 26, 32, 34, 35, 37, 38, 39, 44, 48 (×7), 65, 69, 76, 77, 79, 94, 96 |
| `photo-1611652022419-a9419f74343d` | **Woman in white blouse with silver/gold necklace, bare shoulders** | "brass apothecary still-life" everywhere | 23, 35, 38, 39, 44, 48, 67, 91 (×4), 92, 93, 96, 97, 109 — **9+ placements** |
| `photo-1551808525-51a94da548ce` | **Google-branded yellow booth in graffitied alley** | "Server room" / "production server room aisle" / "industrial server-room" | 21, 29, 36, 50, 70, 79, 93, 95, 102, 110, 112 — **10+ placements** |
| `photo-1531259683007-016a7b628fc3` | **Batman cosplay/figurine in dark armor** | "Industrial machinery" / "coolant pipework" / "/proc/cpuinfo" / "control panel" | 20, 21, 32, 33, 36, 50, 70, 93, 95, 102, 110, 111, 112 — **12+ placements** |
| `photo-1517021897933-0e0319cfbc28` | **Mont Blanc / Alpine glacier landscape** | "Brutalist tower against stark sky" / "Cast bronze" / "Atelier corridor" / "Heritage interior" | 20, 21, 23, 26, 32, 45, 94, 97, 99 |
| `photo-1469041797191-50ace28483c3` | **Camels in desert** | "Modernist building" / "Drawing room with sash windows" / "Quiet interior" / "field landscape" | 22, 23, 26, 32, 34, 35, 45, 82, 94, 97 |
| `photo-1454165804606-c3d57bc86b40` | **Two MacBook laptops + paper notes (no terminals)** | "Dual-monitor amber CRT terminal workbench" | 21, 27, 29, 30, 85, 93 |
| `photo-1518709268805-4e9042af9f23` | **Burg Eltz castle in mist** | "Smooth poured concrete macro" | 97 |
| `photo-1500382017468-9049fed747ef` | **Wheat field at sunset** | "White oak wood grain" | 97 |
| `photo-1525203135335-74d272fc8d9c` | **Pink/red cake slices on marble** | "Guitarist" | 62 (per §1.2) |
| `photo-1576506542790-51244b486a6b` | **Open book with hand on dark wood** | "Cassette" | 62 (per §1.2) |
| `photo-1467453678174-768ec283a940` | **Healthy breakfast bowl** | "Jazz musician at vintage microphone" | 67 (per §1.2) |
| `photo-1551024506-0bccd828d307` | **Caramel/dessert pour over ice cream** | "Crystal coupe glass holding amber cocktail" | 67 (per §1.2) |
| `photo-1492707892479-7bc8d5a4ee93` | **Open handbag with cosmetics + sunglasses** | "Editorial portrait of a speaker" / "founder" / "lawyer Mateo Reyes" / "host Okafor" / "operator profile" / "community elder" / "byline portrait" | 22, 24, 25, 27, 31, 33, 38, 65, 82, 86, 89, 93, 95 (×2) — **15+ placements** |
| `photo-1490481651871-ab68de25d43d` | **Hanging clothes rack with dresses/shirts** | "Editorial portrait" / "founder Maya Hartwell" / "host David Sterling" / "Anya Reuter Director" / "lawyer Rachel Stein" | 22, 24, 25, 27, 31, 32, 33, 38, 65, 89, 95, 108 |
| `photo-1517677208171-0bc6725a3e60` | **Hands holding stacked folded knit sweaters** | "Editorial portrait Yuki Tanaka" / "founder portrait" / "Theo Vance" / "lawyer Sarah Hennessey" / "Marine biologist" / "Powder room — Portland stone" | 22, 24, 25, 28, 31, 65, 82, 89, 95, 108 |
| `photo-1502716119720-bbb91f8812b7` | **Woman in red polka-dot dress in field, faceless body shot** | "lawyer Eleanor Vance" / "Nori at mixing desk" / "Petra Linde founder" / "Daniel Okafor portrait" | 22, 27, 31, 33, 38, 65 |
| `photo-1483985988355-763728e1935b` | **Woman with multiple shopping bags** | "founder Inez Caro" / "lawyer James Bellamy" / "Dr Anika Reyes Marine Biologist" / "Margaret Wells byline" / "The Editors" | 25, 27, 31, 33, 82, 89 |
| `photo-1485231183945-fffde7cc051e` | **Woman in cream/cropped sweater fashion shot** | "founder Alec Roselund" / "lawyer Priya Iyer" / "Marco Pellegrini Lead Type Engineer" / "Issa Marwa Youth volunteer" / "B&W portrait" | 25, 27, 31, 33, 65, 82, 89, 95 |
| `photo-1488161628813-04466f872be2` | **Young man in concrete circular window opening, casual** | "Adaeze Okafor" (female-coded name) / "Marine ranger Lala Putri" / "Dr. Elena Rostova" / "cinematic editorial portrait" | 24, 25, 31, 38, 82, 89, 108 |
| `photo-1539109136881-3b6b04018b06` | **Woman in blue coat at Milan Duomo, feeding pigeons** | "Daniel Park" (male-coded) / "Nori Aldama portrait" / "young man with curly hair" | 24, 31, 38 |
| `photo-1493663284031-b7e3aefcae8e` | **Modern grey/teal tufted sofa with pillows in living room** | "Original 18th-century cornicing" / "Architectural cornice of atelier ceiling" / "Master bedroom" / "Faroe Islands cliffs" / "Reef footage" | 22, 23, 26, 30, 32, 34, 37, 38, 42, 44, 45, 56, 82, 92, 97, 101, 111 — **17+ placements** |
| `photo-1502672260266-1c1ef2d93688` | **Bright Scandi-style living room with plants** | "Boutique hotel facade" / "Coastal architectural light study" / "Editorial architecture frame" / "Open ocean reef footage" / "Trinidad street at dusk" / "Quarry Studio Marfa" | 22, 23, 26, 30, 32, 37, 38, 42, 56, 80, 82, 88, 94, 97, 99, 101, 111 — **17+ placements** |
| `photo-1542038784456-1ea8e935640e` | **Person tossing a camera in autumn forest** | "Designer at tablet sketching wireframes" / "drafting drawings" / "Hallway" / "South-facing studio" / "Cedar Hollow facade" / "Storm-damaged ash limb" | 21, 22, 26, 27, 45, 47, 56, 57, 61, 95, 97, 99 |
| `photo-1487958449943-2429e8be8625` | **Rock and Roll Hall of Fame (I.M. Pei deconstructivist glass)** | "Brutalist concrete chapel" / "Georgian townhouse façade" / "Bauakademie facade" / "Bauhaus facade" / "Plate VI — Workshop" / "Oaxaca Highlands" / "minimalist brutalist concrete" | 32, 35, 37, 44 (×3), 45 (×4), 57, 65, 72, 94, 95, 99, 102, 108, 111 |
| `photo-1599643478518-a784e5dc4a17` | **Gold necklaces with crystal + crescent pendants** | "Plate V — Apothecary" / "Chronos_Elite calibre" | 72 |
| `photo-1614164185128-e4ec99c436d7` | **Black/silver chronograph watch on stones** | "Plate III — Gold" (alt says gold; watch is steel/black) | 72 |
| `photo-1623998021450-85c29c644e0d` | **Gold-cased watch with dark blue dial on white** | "Eclipse Noir — Obsidian" (Obsidian = black; this is gold/blue) | 58 |
| `photo-1523170335258-f5ed11844a49` | **Omega Seamaster steel/blue dial** | "Eclipse Noir — Aurum" (Aurum = gold; this is silver) | 58 |
| `photo-1594576722512-582bcd46fba3` | **Wooden watch (Mamba brand) on wood-grain table** | "Spectrum calibration display" / "Eclipse Noir — Sapphire" / "Calibre 96 — Aviator" | 58, 72 |
| `photo-1611224923853-80b023f02d71` | **Hand pinned with TO-DO/DOING/DONE sticky notes** | "Rear mews staircase / private garden entrance" / "folded broadsheet beside coffee" | 34, 42 |
| `photo-1576613109753-27804de2cba8` | **Person repairing smartphone on teal-blue desk** | "dark library bookshelf, candlelit, premium photography" | 109 |
| `photo-1518998053901-5348d3961a04` | **Bright modern art gallery interior, polished concrete floor** | "open manuscript by candlelight, nocturnal still-life" | 109 |
| `photo-1581090700227-1e37b190418e` | **Silhouette of young woman against pink-blue gradient** | "Server uplink hardware, B&W" | 112 |
| `photo-1473773508845-188df298d2d1` | **Aerial drone shot of forest road** | "Cut sycamore rounds stacked beside the stump" | 47 |
| `photo-1466692476868-aef1dfb1e735` | **Green seedlings in planting tray** | "Cleared garden after 90 m² overgrowth removal" | 47 |
| `photo-1497250681960-ef046c08a56e` | **Dense dark ferns** | "Long boundary hedge mid-trim" | 47 |
| `photo-1611162617474-5b21e879e113`/`1614732484003`/`1618331835717` | (varied — abstract painting / Voyager Uranus / canvas brushstrokes) | "3D cyberpunk render" / "sci-fi interior" / "helmet render" | 49 |
| `photo-1535131749006-b7f58c99034b` | **Golfer mid-swing on green course** | "Featured Album" (synthwave) | 54 |
| `photo-1503602642458-232111445657` | **White wooden bar stool** | "B-3 Chair (Marcel Breuer Wassily)" — wrong design history | 57 |
| `photo-1499856871958-5b9627545d1a` | **Pont Alexandre III, Paris at dusk** | "Frankfurt skyline" — wrong city | 51 |
| `photo-1516919549054-c50d6a85d7a5` / `1534938665420` / `1598214886806` | **Donuts / fries / pancakes** | "Hands making mochi" / "Mango mochi" / "Matcha mochi" | 71 |
| `photo-1550684848-fa1c92c12a25` | **Abstract bubbles / oil-on-water macro** | "CoinCrush fintech dashboard" | 79 |
| `photo-1552374196-c4e7ffc6e0a3` | **Young man in plain white t-shirt** | "Neon Street fashion campaign" | 79 |

**Two new cascade-ID candidates** surfaced this audit (not in playbook §1.2 yet):
- `photo-1542038784456-1ea8e935640e` (man tossing camera in autumn forest)
- `photo-1493663284031-b7e3aefcae8e` (sofa with teal pillows in living room)

### 1.2 Hard-broken URLs (CRITICAL — 404 on load)

| URL | Used in |
|---|---|
| `https://images.unsplash.com/photo-1533158307587-828f0a76ef93` | `58-oled.html:771`, `58-oled.jsx:621` ("Lifestyle" parallax gallery) |
| `https://images.unsplash.com/photo-1590529853874-12968846df72` | `62-90s-grunge.html:212`, `62-90s-grunge.jsx:186` (hero `bg-clip-text` background — headline renders unstyled) |
| `https://cdn.simpleicons.org/openai` | `68-bento-grid-dev.html:503`, `.jsx:394` (alt="OpenAI") |
| `https://cdn.simpleicons.org/ableton` | `74-acid-graphics.html:452`, `.jsx:337` (alt="Ableton") |
| `https://cdn.simpleicons.org/slack` | `79-neo-brutalism.html:330`, `.jsx:53` |
| `https://cdn.simpleicons.org/adobe` | `97-blueprintiachitectural.html:466`, `.jsx:56` (trustLogos array) |

### 1.3 JSX preview-iframe traps (§5)

**Hard traps — 0 hits across all 108 .jsx files**:
- `import { useState/... } from 'react'` named imports: clean.
- TS syntax in `.jsx` (`as Type`, `satisfies`, generic): clean.
- `_extends`-style spread `{...(cond ? ...`: clean.
- `addEventListener("DOMContentLoaded"...)` in `.jsx`: clean.

**MEDIUM — SVG `data:image/svg+xml` inside JSX `<style>` blocks** (§5.4 — renders unreliably in iframe). Recommend `repeating-linear-gradient`/`radial-gradient` or move to `tailwind.config.theme.extend.backgroundImage`:

| File | Line |
|---|---|
| `4-ai-product-landing.jsx` | 243-249 |
| `10-split-screen.jsx` | 263-270 |
| `15-artisan-handmade-store.jsx` | 108-114 |
| `20-brutalist-creative-portfolio.jsx` | 133 |
| `55-y2k-web-1-0.jsx` | 40 |
| `59-paper-collage.jsx` | 115 |
| `68-bento-grid-dev.jsx` | 87 |
| `75-hand-drawn.jsx` | 88 |
| `104-halftone-pop-art.jsx` | 84 |
| `105-constructivist-bento-terminal.jsx` | 89 |
| `109-dark-luxury-occult.jsx` | 74 |

**HIGH — `addEventListener("DOMContentLoaded"...)` in HTML** (won't fire in iframe re-emit; convert to IIFE):

| File | Line | What it gates |
|---|---|---|
| `72-high-luxury.html` | 904 | IntersectionObserver scroll animations |
| `76-material-design.html` | 1167 | chart.js initialisation (canvas stays blank) |
| `80-horizontal-scroll.html` | 481 | scroll behaviour (JSX twin already migrated to IIFE) |

**MEDIUM — JSX `<style>` cascade trap §5.3** (body-level rules in `customCss` after Tailwind utilities — silent override risk on body classes). Templates: 60, 65, 66, 67, 68, 72, 74, 77, 78, 79, 81, 94. Advisory only — review case-by-case if a body-level Tailwind utility appears not to apply.

### 1.4 HTML/JSX identicality (§4)

- **HIGH — `108-ethereal-fashion-noir`**: JSX is missing 7 of 22 unique Unsplash photos vs HTML. Likely an editorial gallery section was not ported during conversion. JSX users see a smaller grid than HTML users. Missing IDs: `photo-1455390582262`, `1457369804613`, `1481627834876`, `1495446815901`, `1499744937866`, `1521405924368`, `1611652022419`.
- **MEDIUM — Alt-text drift between HTML and JSX**: detected in 62-90s-grunge (same `1563841930606`, three different alts), 72-high-luxury (`1599643478518` "Plate V — Apothecary" vs longer JSX descriptor), 76-material-design (`1481349518771` divergent alts). Pick one and sync.
- **MEDIUM — Long-form `data-alt` strings in HTML missing from JSX**: 82, 87, 89, 90, 92, 95, 98, 99 — JSX truncated descriptive alts.
- All other photo-ID sets, headings, item counts, and Simple Icons slug lists match across pairs (template-literal `.map()` driven divergence is expected per §4.4).

### 1.5 Responsiveness (§3)

- **MEDIUM — Headline overflow without clamp** (§3.1): `81-kinetic-kino` (display-xl 120px), `82-nonprofit` (display-xl 72px), `101-luxury-watch-editorial.html:225` h1, `109-dark-luxury-occult.html` six h2s (245, 282, 353, 439, 528, 616), `111-isometric-grunge-brutal.html:190` h1.
- **LOW — Body missing `overflow-x: hidden`/`clip`**: 21, 25, 32, 34, 39, 61, 67, 80, 84, 88, 91, 100, 101, 104, 105.
- **LOW — Cumulative-Layout-Shift risk**: ~80% of `<img>` tags across the gallery lack explicit `width`/`height` attributes. Batch-wide pattern; recommend a single coordinated authoring-style fix rather than per-template patches. Cleanest templates: 49-three-js (8/18 sized), 57-bauhaus (18/25 sized).

---

## 2. Per-template findings

### Batch 1 — Templates 1–19

(Source agent's per-batch file did not persist; findings reconstructed from the agent's structured summary.)

- **1-aether** — (no findings)
- **2-saas-light** — 3 CRIT (cascade-ID drift)
- **3-saas-dark** — (no findings)
- **4-ai-product-landing** — 1 MED (`*.jsx:243-249` SVG data-URL in `<style>`)
- **05-mobile-app-landing** — (no findings)
- **06-product-launch-page** — **6 CRIT** (heaviest in batch — cascade-ID drift across hero/section imagery)
- **07-bento-grid-landing** — (no findings)
- **08-apple-style-hero** — (no findings — uses Cloudinary hand-uploaded asset, trust-but-verify)
- **09-video-background-style** — (no findings)
- **10-split-screen** — 1 MED (`*.jsx:263-270` SVG data-URL in `<style>`)
- **11-long-form-sales-letter** — 1 HIGH (`*.html:561` cascade `photo-1542038784456`)
- **12-minimalist-product-store** — (no findings)
- **13-editorial-fashion-style** — **4 HIGH** (Look-archive section: 4 IDs labeled with garment-specific names but served as fashion-flatlay photos), 2 MED (lower-confidence Kanban-sticky-note + coffee-cup mismatches)
- **14-tech-gadget-store** — 2 CRIT
- **15-artisan-handmade-store** — 3 CRIT, 1 MED (`*.jsx:108-114` SVG data-URL in `<style>`)
- **16-subscription-box-landing** — **5 CRIT**
- **17-single-product-dtc** — **5 CRIT**
- **18-marketplace-home** — **4 HIGH** (makers carousel — 4 maker portraits served as wrong-subject fashion shots)
- **19-minimalist-portfolio** — 4 CRIT

### Batch 2 — Templates 20–39

- **20-brutalist-creative-portfolio** — 2 CRIT (`*.html:205` `photo-1517021897933` mountains-as-tower; `*.html:211` `photo-1531259683007` Batman-as-machinery), 1 MED (`*.jsx:133` SVG data-URL in `.brutal-noise`)
- **21-developer-portfolio** — **4 CRIT** (`*.html:916` Google booth as server room; `:925` Batman as machinery; `:943` mountains as architecture; `:1007` Google booth × repeat)
- **22-photographer-portfolio** — **6 CRIT** (banana-strip decorative `:284-289`; handbag `:306`, sofa `:310`, sweaters `:314`, forest-camera `:318`, camels `:461,545`)
- **23-personal-brand-store** — **5 CRIT** (mountains/camels/banana/sofa/necklace)
- **24-link-in-bio** — 3 CRIT (man-as-woman `:363`, clothing-rack as flowers `:399`, clothing-rack as portrait `:582`), 1 MED, 1 LOW
- **25-resume-cv-site** — 3 CRIT (handbag/clothing-rack/sweaters as speaker portraits)
- **26-about-me-card** — **4 CRIT** (sofa/forest-camera/mountains/banana/camels as architecture), 1 LOW. Note: `photo-1611652022419` previously here was replaced with `photo-1542435503` (legitimate brass flatlay) — good cleanup.
- **27-creator-hub** — **4 CRIT** (laptops-as-terminal, polka-dot-as-coat, clothing-rack as portrait, handbag as man-in-profile)
- **28-creative-agency** — 1 CRIT (`*.html:644` sweaters as Yuki Tanaka)
- **29-corporate-b2c** — 3 CRIT (`*.html:559` MacBook-glow-as-tower; `:573` Google booth as server room; `:672` laptops as terminal)
- **30-consulting-firm** — 1 CRIT
- **31-law-firm** — **7 CRIT** (`*.html:304-340` Sarah/Adaeze/Mateo/Eleanor/Daniel/Rachel/James — gender + identity + ethnicity mismatches across 7 of 8 partner head-shots)
- **32-studio-showcase** — **5 CRIT** (`*.html:329` clothing rack; `:339` mountains; `:359` Batman; `:369` handbag; `:379` banana — marquee strip nearly all wrong)
- **33-one-page-pitch** — **6 CRIT** (founders row at L460-488 systematically miscasts: handbag/Batman/clothing-rack/shopping-bags/woman-as-Alec/polka-dot)
- **34-editorial-magazine** — **7 CRIT** (`:468` camels as field landscape; `:488,533` sofa as Trinidad street; `:498,538` sweaters as portrait; `:585` sofa as Faroe cliffs; `:613` banana as Hokkaido; `:623` sofa as Trinidad; `:903` sticky-notes as broadsheet)
- **35-personal-blog** — **5 CRIT** (necklace ×2 `:300,367`; banana `:315`; camels `:483`; banana `:493`)
- **36-tech-blog** — 2 CRIT (Google-booth as server `:350,421`; Batman as gauge cluster `:384`). Genuine matches at `:216,503,515,390,509` PERFECT.
- **37-newsletter-landing** — 2 CRIT (banana as tea `:326`, banana as Issue 085 cover `:361`)
- **38-podcast-style** — **8 CRIT** (heaviest in batch: necklace, banana, sofa, clothing-rack ×2, sweaters, polka-dot, handbag — David/Nori/Okafor host portraits all wrong incl. gender)
- **39-doc-hub** — 1 CRIT (`*.html:449,1069` necklace as "Apothecary theme" tile)

### Batch 3 — Templates 42–59

- **42-boutique-hotel** — **1 CRIT** (`*.html:517` sticky-notes as mews staircase), 2 HIGH (sofa as Georgian facade `:458`; sofa as cornicing `:493`)
- **44-wedding-invitation** — 0 CRIT, **5 HIGH** (banana as long-table `:227`; sofa as orchard path `:217`; sofa as quiet interior `:232`; necklace as Glendalough kitchen window `:326`; Rock&Roll Hall as chapel `:207,391,442` ×3), 1 MED (sweaters as coastal path `:291`)
- **45-real-estate-listing** — **5 CRIT** (Rock&Roll Hall as Georgian façade ×4 incl. hero; camels as drawing room ×4; mountains as mews entrance ×4; forest-camera as garden ×4; sweaters as powder room ×3), **3 HIGH** (sofa as cornicing/master suite/Georgian fanlight; banana as library landing). **Unfit to ship as-is.**
- **46-travel-tour** — (no findings — uses 8 aida-public Iceland URLs, all 200, curated)
- **47-local-services-business** — **2 HIGH** (drone-forest as sycamore stump `:329,402,609`; seedling tray as cleared garden `:347,420,645`), 2 MED (ferns as hedge mid-trim, misty mountains as storm-damage)
- **48-brutalist-art-style** — 1 CRIT (banana as "Stripped industrial interior" / "MN-011 Tape Hiss" — used 7× including FIG.04 archive grid hero), 1 HIGH (necklace as brass-objects desk)
- **49-three-js** — 0 CRIT, **2 HIGH** (canvas-brushstrokes as cyberpunk helmet render `:258`; Voyager-Uranus as sci-fi interior `:271`), 2 MED (Audi R8 as hovering vehicle, gradient-blur as 3D liquid shapes)
- **50-cyberpunk-high-tech** — 1 HIGH (`*.html:473` Batman as industrial machinery, reused 4×), 1 MED (Google booth as decorative noise — ACCEPTABLE-LOOSE at 10×10 thumbnails)
- **51-glassmorphism** — 1 HIGH (`*.html:908,1031` Pont Alexandre III as Frankfurt skyline)
- **52-swiss-minimalist** — (no findings — generic `Project N` alts pass §1.1)
- **53-claymorphism** — (no findings)
- **54-synthwave** — 1 HIGH (`*.html:315` golfer as "Featured Album"), 1 MED (banana as MN-011 Tape Hiss thumbnail)
- **55-y2k-web-1-0** — 1 MED (`*.jsx:40` SVG data-URL in `<style>`)
- **56-neumorphism** — 1 HIGH (`*.html:515,591,647,719` forest-camera as "Hallway" ×4), 1 MED (sofa as master bedroom — LOOSE)
- **57-bauhaus** — **2 HIGH** (`*.html:526` Rock&Roll Hall as Bauhaus facade — wrong movement; `:594` white wooden barstool as Marcel Breuer B-3 Wassily — wrong design history). 1 MED note for §1.2 maintenance: `photo-1592078615290` IS a perfect "moulded shell chair on wood legs" for THIS template's alt — playbook entry needs context-scoping (see §3.1 below).
- **58-oled** — **1 CRIT** (`photo-1533158307587-828f0a76ef93` HTTP 404 at `:771` parallax Lifestyle gallery), **3 HIGH** (wooden Mamba watch as Sapphire calibration ×8 placements; gold-blue watch as "Obsidian" — alt says black; Omega Seamaster as "Aurum" — alt says gold). Hero PERFECT.
- **59-paper-collage** — 1 MED (`*.jsx:115` SVG noise filter data-URL in `<style>`)

### Batch 4 — Templates 60–79

- **60-aurora-gradients** — 0 CRIT, 1 MED (cascade trap §5.3 `*.jsx:107`), 1 LOW. Wellness archetype CLEAN — all 7 imagery slots PERFECT.
- **61-brutalism-raw** — 1 HIGH (`photo-1542038784456` "drafting drawings" → camera-in-forest), 1 MED (no body `overflow-x`), 1 LOW
- **62-90s-grunge** — **1 CRIT** (`*.html:212`/`*.jsx:186` hero `photo-1590529853874` HTTP 404; headline renders unstyled — first-thing-visible), 1 HIGH (alt-text drift HTML/JSX same image 3 different alts), 1 MED (cascade trap), 1 LOW
- **63-corporate-memphis** — 1 LOW (CLS — 27/27 imgs unsized)
- **64-isometric** — 1 LOW (19/25 unsized)
- **65-typographic-swiss-poster** — **1 CRIT** (`*.html:570`/`*.jsx:408` banana as "Bauakademie portrait — venue"), **6 HIGH** (speaker grid: 6 of 8 portraits MISMATCH — Anya as clothing rack, Marisol as handbag, Theo as sweaters, Daniel Okafor as polka-dot field-shot female, Iris as shopping-bags, Marco as cream-sweater female — incl. gender drift), 1 MED, 1 LOW
- **66-monochrome** — 1 MED (`*.jsx:79-80` body font-family cascade trap), 1 LOW
- **67-art-deco** — **1 CRIT** (`*.html:484`/`*.jsx:29` necklace as "brass apothecary still-life with crystal decanters" — §1.2 canonical), 2 MED (`*.jsx:65` body bg+color+font cascade — heaviest in batch; no body overflow-x)
- **68-bento-grid-dev** — **1 CRIT** (`*.html:503` `cdn.simpleicons.org/openai` 404), 2 MED (SVG data-URL `*.jsx:87`; cascade trap)
- **69-skeuomorphism** — **1 CRIT** (`*.html:861`/`*.jsx:9` banana as "MODEL-808 PLAYER · High-fidelity FM & tape playback" — catalog hero), 1 LOW
- **70-terminal-ascii** — **2 HIGH** (Batman as "/proc/cpuinfo"; Google sign as "rack 04 capture")
- **71-pastel-kawaii** — **3 HIGH** (mochi product grid: donuts as mochi; fries as mango mochi; pancakes as matcha mochi), 1 LOW
- **72-high-luxury** — **5 HIGH** (jewelry as Apothecary/Chronos calibre; cosy interior as Plate VII Gallery; black watch as Plate III "Gold"; Rock&Roll Hall as Plate VI Workshop; `*.html:904` DOMContentLoaded), 1 MED (alt drift HTML/JSX), 1 LOW
- **73-abstract-3d** — 1 LOW. Imagery PERFECT.
- **74-acid-graphics** — **1 HIGH** (`cdn.simpleicons.org/ableton` 404), 1 LOW
- **75-hand-drawn** — 1 MED (`*.jsx:88` paper-grain SVG data-URL), 1 LOW
- **76-material-design** — **1 CRIT** (`*.html:712` banana as "Color foundation" Material Design tonal-palette hero — severely off-brand), **1 HIGH** (`*.html:1167` chart.js DOMContentLoaded — canvas stays blank), 1 MED (alt mismatch HTML/JSX), 1 LOW
- **77-mesh-gradient** — **1 CRIT** (`*.html:666`/`*.jsx:24` banana as "Atelier · Marfa")
- **78-liquid-metal** — 1 LOW (cascade trap advisory only)
- **79-neo-brutalism** — **1 CRIT** (`*.html:459,563`/`*.jsx:23` banana as "Plate 06 — Concrete corridor"), **3 HIGH** (`cdn.simpleicons.org/slack` 404; oil-bubbles as fintech dashboard; man in white tee as "Neon Street fashion campaign"), 1 LOW

### Batch 5 — Templates 80–99

(83 absent; 98 has `.` separator in filename.)

- **80-horizontal-scroll** — **1 HIGH** (`*.html:481` DOMContentLoaded — JSX twin migrated to IIFE), 1 MED (sofa as "Atelier interior" borderline), 1 LOW
- **81-kinetic-kino** — **1 HIGH** (display-xl fixed 120px in tailwindConfig, hero h1), 2 MED
- **82-nonprofit** — **6 CRIT** (camels as coastline ×2; man-in-window as Marine Ranger Lala Putri; handbag as Tomas Ndoye Community Elder; shopping-bags as Dr Anika Reyes Marine Biologist; cropped-sweater fashion as Issa Marwa; sweaters as Dr Reyes documenting reef; sofa as ocean reef footage), 1 HIGH (`*.html:169` display-xl 72px no clamp), 1 MED
- **84-game-studio** — 2 MED (marquee max-content + body overflow-x), 1 LOW
- **85-course-education** — 1 LOW
- **86-community-forum** — **1 CRIT** (`*.html:556` handbag as community member portrait)
- **87-medical-care** — 1 MED (4 thumbnail alts in HTML absent from JSX), 1 LOW
- **88-fitness-wellness** — 2 MED, 1 LOW
- **89-editorial-magazine** — **5 CRIT** (`:308` sweaters as Hannah Keats; `:314` clothing-rack as Julian Barnes; `:326` handbag as Thomas Vance; `:344` shopping-bags as The Editors; `:350` cropped-sweater as Margaret Wells), 1 MED, 1 LOW
- **90-risograph-print** — 1 MED (max-content marquee), 1 MED (4 long alts missing JSX), 1 LOW (decorative quote glyph), 1 LOW
- **91-dark-academia** — **4 CRIT** (necklace as Florentine Press × 2; same as Apparatus; same as Apothecary brass; same as Calf Gilt-Tooled), 1 MED
- **92-art-noveau** — **2 CRIT** (necklace as brass apothecary; sofa as atelier ceiling cornice), 1 MED
- **93-casette-futurism** — **4 CRIT** (Batman as control panel ×2; Google booth as server room ×2; handbag as Operator profile; necklace as brass apothecary), 1 MED
- **94-solarpunk** — **7 CRIT** (entire 8-station carousel mismatched: Rock&Roll Hall as Oaxaca; mountains as Portuguese Coast; camels as Auvergne Plateau; banana as Western Ghats; sofa as Rift Valley; forest-camera as Yorkshire Beck; sofa as cohort earthworks/Quito), 1 MED (cascade trap)
- **95-constructivist-russian** — **8 CRIT** (clothing-rack as A. Petrova Lead Act I; man-in-window as D. Sokolov Act III; handbag as I. Romanenko Act IV; sweaters as L. Mironova Director; Batman as industrial machinery; Google booth as server room; handbag as Rodchenko-style; cropped-sweater as Intimate B&W portrait), 1 MED, 1 LOW
- **96-wabi-sabi-imperfect** — **1 CRIT** (`*.html:442`/`*.jsx:380` necklace as still-life of brass and ceramic objects on collector's shelf), 1 MED, 1 LOW (banana as "Lisbon kappo counter")
- **97-blueprintiachitectural** — **5 CRIT** (necklace as PATINATED COPPER; leather sofa as rift-sawn white oak; camels as Modernist gallery + Ridge House Aspen; mountains as Cast bronze; forest-camera as Cedar Hollow facade + Drafting interview portrait), **1 HIGH** (`cdn.simpleicons.org/adobe` 404), 1 MED
- **98.op-art-bendaydots** — 1 MED (5 long-form alts missing JSX). Aida-public URLs trusted.
- **99-midcentury-modern** — **3 CRIT** (forest-camera as South-facing aperture of studio; Rock&Roll Hall as ateliers east stair; mountains as Atelier corridor late afternoon), 1 MED

### Batch 6 — Templates 100–112

(107 absent.)

- **100-botanical-scientific** — 1 MED (body missing overflow-x), 1 LOW. AIDA-only imagery — trusted.
- **101-luxury-watch-editorial** — **2 HIGH** (`photo-1493663284031` teal sofa as "Architectural cornice of atelier ceiling"; `photo-1502672260266` Scandi living room as "Architectural light study at upper-floor stair of workshop"), 2 MED (h1 `text-display-xl` no clamp; body missing overflow-x), 1 LOW
- **102-neon-glitch-brutalist** — **2 HIGH** (Google booth as "server room wide shot cyan"; Batman as "industrial machinery cyan tinted"). Cascade from 110.
- **103-acid-glass-studio** — (no findings — all 3 photos PERFECT; 1611652022419 NOT used here despite earlier flag)
- **104-halftone-pop-art** — 1 MED (`*.jsx:84` SVG data-URL), 1 MED (body missing overflow-x), 1 LOW
- **105-constructivist-bento-terminal** — 1 MED (`*.jsx:89` SVG data-URL), 1 MED (body missing overflow-x), 1 LOW
- **106-neo-classical-editorial** — 1 LOW
- **107-y2k-vaporwave-grid** — (template absent or not audited)
- **108-ethereal-fashion-noir** — **1 HIGH** (JSX missing 7 of 22 unique Unsplash photos vs HTML — gallery section truncated in JSX port), **1 HIGH** (`photo-1488161628813` casual man as "cinematic monochrome fashion editorial portrait"), 1 MED ("Hero Background" loose archetype — clothes rack vs editorial portrait, mitigated by `mix-blend-luminosity` overlay), 1 LOW
- **109-dark-luxury-occult** — **3 HIGH** (all 3 hero "Constellations" cards: smartphone-repair as "The Obsidian Vault dark library"; necklace as "Brass & Bone brass apothecary"; bright art gallery as "Hour of the Wolf candlelit manuscript"), 1 MED (`*.jsx:74` SVG data-URL), 1 MED (six h2 `text-headline-xl` no clamp). **Highest-priority template in batch 6.**
- **110-arcade-hardware-brutal** — **2 HIGH** (Google booth as "Hardware backdrop dark server room"; Batman as "Industrial coolant pipework"). Other 110 photos PERFECT.
- **111-isometric-grunge-brutal** — 1 MED (h1 `text-display-xl` "TRANSMUTATION" no clamp), 1 LOW. Generic "Archive 0N" alts pass §1.1 even though subjects are cascade-IDs.
- **112-crt-glitch-cyber** — **3 HIGH** (Google booth as "Wide server-room shot magenta tint"; Batman as "Industrial machinery magenta tint"; woman-silhouette as "Server uplink hardware B&W"). 1 LOW.

---

## 3. Surfaced unrelated breakage (per playbook §0.5 — surfaced, not fixed)

### 3.1 Playbook §1.2 known-mismatch table needs maintenance

1. **`photo-1481349518771-20055b2a7b24`** is listed in §1.2 as "long architectural corridor, perspective-deep". As of this audit it serves a **yellow banana on pink background**. The catalogue entry is stale; subject has drifted on Unsplash. Three batches independently re-confirmed the banana via download + multimodal inspection. Recommend updating the §1.2 entry to "banana on pink" (or removing the asserted-original-subject altogether, since the audit only cares what bytes serve TODAY).

2. **`photo-1592078615290-033ee584e267`** is listed in §1.2 as a known-mismatch ("Nesting tables → Single black molded shell chair on wood legs"). In `57-bauhaus` context (`*.html:614` alt: "T-1 Side Chair — moulded shell on wood legs"), the served image **perfectly matches** the alt text. The §1.2 entry needs a context-specific note — the photo is wrong-for-archetype-X but right-for-archetype-Y. Currently the table reads as "always wrong", which produces false-positive findings in audits where the image is correct.

3. **`photo-1542038784456-1ea8e935640e`** (man tossing camera in autumn forest) and **`photo-1493663284031-b7e3aefcae8e`** (sofa with teal pillows in living room) appear across 5+ templates each with archetype-incompatible alts; both are missing from §1.2. Recommend adding.

4. **§D.1 / §1.2 trust model needs a periodic re-verify pass.** This audit caught the 1481349518771 → banana drift only via step-3 download + multimodal inspection. A strictly grep-based audit would have missed it (alt strings claim "stairwell"/"corridor"/"architectural", which match the §1.2 entry's old description AND the original archive — but neither matches the served bytes today). The 4-step protocol's value is concentrated in step 3.

### 3.2 The cascade-ID problem is structural, not per-template

~80% of CRITICAL findings are driven by a small pool of ~17 wrong-subject IDs reused across the gallery. Per-template patches will not address this — recommend a **global identify-and-replace pass** for the cascade IDs above, with archetype-specific replacements verified per §1.1 4-step protocol per slot.

### 3.3 Authoring style — image dimensions and CLS

~80% of `<img>` tags across all 108 templates lack explicit `width`/`height` attributes. This is consistent template-authoring style, not drift. Recommend a single pass to add dimensions for CLS, rather than 108 individual fixes. Cleanest existing examples: 49-three-js, 57-bauhaus.

---

## 4. Verified replacement IDs

Per playbook §1.3 ("don't fabricate IDs"), **no replacement IDs are recommended in this report unless they passed the 4-step protocol (HTTP 200 + download + visual inspect + archetype fit) during this audit.** Two passed:

- **`photo-1542435503-956c469947f6`** — verified via download as a legitimate brass-finish flatlay (keyboard, glasses, brass pens, notepad). Already in use at `26-about-me-card` (good cleanup). Could replace `photo-1611652022419` in any "brass apothecary / studio still-life" slot — candidates: 23, 35, 38, 39, 67, 91 (×4), 92, 93, 96, 109, 67-art-deco. Re-verify subject before adopting in each slot.
- **`photo-1558494949-ef010cbdcc31`** — verified as a legitimate server-rack-with-cabling photo. Could replace `photo-1551808525` (Google booth) wherever "server room" / "server rack" alts are used: 21, 29, 36, 79, 95, 102, 110, 112. Already in correct use at 36, 102, 110, 112.
- **`photo-1518770660439-4636190af475`** — verified circuit-board macro. In correct use at 21, 36, 50, 70, 102, 110, 111, 112.

For all other surfaced mismatches, no verified replacement is supplied. The auditor should:
1. Search Unsplash for archetype-matching IDs.
2. Run `curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://images.unsplash.com/photo-XXX?w=300&q=70"` → must return 200.
3. Download via `curl -o /tmp/audit-findings/replace-X.jpg "https://images.unsplash.com/photo-XXX?w=300&q=70"` and visually verify with the multimodal Read tool.
4. Confirm archetype fit per §1.5.

Slot-level archetype hints (no verified IDs):
- **65-typographic-swiss-poster speakers (6 portraits)**: head-and-shoulders editorial portraits, mixed gender, designer-coded.
- **45-real-estate-listing**: Georgian London facade (e.g. "Belgravia townhouse"); period drawing room; mews entrance.
- **62-90s-grunge hero text-clip 404**: needs HTTP-200 grunge / concert / band photo.
- **71-pastel-kawaii mochi (3)**: actual mochi or kawaii dessert close-ups.
- **72-high-luxury watch maison (4)**: close-ups of mechanical movements, gold/steel watches.
- **74-acid-graphics ableton**: no Simple Icons DAW alternative; styled text-chip recommended.
- **79-neo-brutalism**: fintech-dashboard screenshot + neon-street-fashion editorial.
- **109-dark-luxury-occult (3)**: candlelit manuscript / antique apothecary brass / dark library macro / dark gothic still-life. Or AIDA-generated specific assets.
- **102 / 110 / 112 server-room slots**: replace with `photo-1558494949` (verified above).
- **102 / 110 / 111 / 112 industrial-pipework slots**: search "industrial coolant pipes" / "data centre cabling".

---

## 5. Recommended next actions (ordered by impact)

1. **Cascade-ID global replace** — touch ~17 photo IDs across ~50 templates. Single highest-yield fix; clears ~80% of CRITICALs.
2. **Hard-broken URL replacement** — 4 Unsplash 404s + 4 Simple Icons 404s. Each is a single-template surgical fix.
3. **45-real-estate-listing full re-curation** — unfit to ship until all 8 IDs are replaced with Georgian-period archetype-fit photography.
4. **108-ethereal-fashion-noir JSX/HTML parity** — port the missing 7 photos into the JSX gallery section, OR remove from HTML.
5. **3× HTML DOMContentLoaded → IIFE** in 72, 76, 80.
6. **Headline clamp fixes** — 81, 82, 101, 109, 111.
7. **Playbook §1.2 maintenance** — update banana entry, context-scope `1592078615290`, add `1542038784456` + `1493663284031`.
8. **CLS pass** — global authoring-style addition of `width`/`height` on `<img>` tags.
9. **JSX `<style>` cascade trap** — review the 12 templates flagged in §1.3 for body-class-vs-customCss conflicts.
10. **SVG-data-URL-in-`<style>` migration** — 11 JSX files; convert to `repeating-linear-gradient`/`radial-gradient` or move to `tailwind.config`.

---

_Audit conducted 2026-05-08. Read-only, no file modifications, no commits, no pushes per `template-upgrade-playbook.md` §0._
