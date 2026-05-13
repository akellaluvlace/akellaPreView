# Wrong-Subject Image Audit — 2026-05-10 session

Running record of out-of-context / wrong-subject image replacements across `web/*.{html,jsx}` and `templates/*/source.{html,jsx}`.

The repeated offender IDs that keep surfacing as wrong-subject across templates (with their actual content per the playbook §1.2 / observation in this session):

| Wrong-subject ID | Actual content | Common bad alt context |
|---|---|---|
| `1487958449943-2429e8be8625` | Rock & Roll Hall of Fame (glass pyramid) | "brutalist concrete corridor", "Heavy stone facade", "Bauakademie facade", "Atmosphere I", "Project 01", "Cover Issue 082" |
| `1517021897933-0e0319cfbc28` | mountains | "pale interior", "Architecture cropped", "Studio interior — Day 02", "Brutalist concrete interior", "this week's issue cover", "Cover Issue 083", "control plane room" |
| `1469041797191-50ace28483c3` | **CAMELS** | "modernist building", "Stage interior — Day 03", "drawing room with classical proportions", "Cotton field, Aegean", "Highway in raking light", "restored watershed", "Drafts on the desk", "Atmosphere III", "Project 03", "Print 02 — quiet street, Quito" |
| `1502672260266-1c1ef2d93688` | Scandi room (cream interior) | "Marble vestibule", "Cooperative cold-pack room at dawn", "Architectural lobby", "Pencils paper morning light", "Atmosphere IV", "Workshop, Lisbon", "Print 05 — concrete stairwell" |
| `1493663284031-b7e3aefcae8e` | teal sofa (cascade #7) | "Linen on a line", "Master suite", "Original cornicing detail" |
| `1481349518771-20055b2a7b24` | banana (cascade #1) | "Dye house, Porto", various corridor/library alts |
| `1492707892479-7bc8d5a4ee93` | luxury handbag (cascade #5) | various editorial portrait alts |
| `1542038784456-1ea8e935640e` | person tossing camera in autumn forest (cascade #6) | architectural / staircase / designer-tablet alts |
| `1551808525-51a94da548ce` | Google booth (cascade #3) | server room / data centre alts |
| `1531259683007-016a7b628fc3` | Batman / dark moody (cascade #4) | industrial machinery / foundry alts |
| `1611652022419-a9419f74343d` | woman with necklace (cascade #2) | "brass apothecary still life" alts |

The 7 cascade IDs (rows 5–11 above) were replaced site-wide in earlier sessions (Phase 2). The 4 architectural wrong-subjects (rows 1–4) were not — they keep showing up per-template and need template-by-template replacement matched to each slot's alt.

## Curated replacement pool (already on hand)

Reusable archetype-fit replacement IDs accumulated over this session — match the slot's alt to the closest fit:

**Architectural surfaces:**
- `1618488373960-404fe668e524` — warm columned corridor (Phase 2 banana primary). Fits "long corridor" / "brutalist concrete corridor"
- `1601993957728-1e56ab70c5a8` — minimalist cream Tadao-Ando-style stairwell. Fits "pale interior", "Architectural curves"
- `1622912058707-1b33af81db4f` — terracotta arched colonnade. Fits "modernist building", "facade"
- `1766604106308-58b6d0d676bf` — modernist spiral staircase, B&W. Fits "modernist staircase", architectural variety (cascade #6 stair2)
- `1762215781547-2ac20ed42cd1` — Corinthian capital + cornice with raking warm light (cascade #7 cornice). Fits "cornice", "ornate detail"
- `1664786200000-b1424aa47dff` — wooden bespoke bookcases / library (cascade #1 lib3). Fits "library shelf"
- `1743793054819-37e412d65295` — empty long wood table (cascade #1 kappo). Fits "long table" / "kappo"
- `1776524039930-ea1ed83b0f97` — warm-toned moody industrial pipework (cascade #4 industrial). Fits "industrial machinery", "infrastructure"
- `1558494949-ef010cbdcc31` — Taylor Vick wide server room (cascade #3 server). Fits "server room", "data centre"
- `1518770660439-4636190af475` — circuit board macro. Fits "telemetry", "audio gear macro"
- `1651342490186-7d3288f567e5` — cream-stone modernist museum interior (Phase 4 berlin1). Fits "Bauakademie", "museum interior"
- `1764416166527-2081e20fe47c` — Georgian London terrace facade (Phase 4 g1). Fits "heritage townhouse"
- `1688679179315-327efb896fcf` — Holland Park Mews stone arch (Phase 4 mews1). Fits "mews entrance / cobble"
- `1707308029017-1f5ce047706c` — cobbled mews street (Phase 4 mews2). Fits "heritage street corner"
- `1777297821426-a8033c40ba59` — walled English country garden (Phase 4 garden). Fits "landscaped garden / hedges"
- `1777014547456-7d94a04382ee` — wood vanity + marble + brass (Phase 4 bath). Fits "powder room / bathroom"
- `1685787773514-90e8e14af797` — period bedroom with casement window (Phase 4 bed). Fits "master suite / bedroom"

**Stills / details:**
- `1527844817887-9b937993518b` — brass mortar+pestle apothecary (cascade #2 brass). Fits "apothecary still life", "brass objects"
- `1670463016037-86e95c96529c` — Glendalough Wicklow round tower (Phase 2 glend). Fits Irish landscape / monastic
- `1677776401672-ab7d96c7e63b` — speckled stoneware bowl (Phase 2 ceramic). Fits "oatmeal speckle glaze"
- `1604516087408-a7cde81ecf0f` — letterpress wood type drawer (Phase 2 press). Fits "Florentine Press"
- `1758221055853-479a0de23e66` — heirloom tomato cluster (Phase 2 produce). Fits "produce still life"
- `1622947344895-2148f56279f8` — dark Tenmoku oil-spot tea bowl (this session). Fits "Kohiki Chawan"
- `1638294621924-be97f5f92413` — pressed botanical specimens on white (Phase 2 botanical). Fits "Specimen 06/07"
- `1700951372714-98979a8803a4` — vintage cassette tape grid (Phase 2 cassette). Fits cassette / synth gear
- `1690743300892-cb813b420c36` — watercolor color cards on wood (Phase 2 swatch). Fits "color foundation"
- `1723306009175-dca7d26f3350` — vintage Mercator world map (Phase 2 atlas). Fits "Field Atlas"
- `1707186563546-71a3e11d6b39` — train tracks in snow (Phase 2 snow). Fits "Hokkaido railway"
- `1458819714733-e5ab3d536722` — coffee/tea cup top-down (Phase 2 tea). Fits "second cup of tea"
- `1576250670488-4a00a3ed480e` — two men with podcast mics in studio (Phase 2 interview). Fits "studio interview reportage"
- `1499744937866-d7e566a20a61` (orig) → was the studio bench, kept where appropriate
- `1499951360447-b19be8fe80f5` — designer desk with laptop+monitor (Phase 6 desk1). Fits "designer at tablet sketching"
- `1605150934151-b65f23423e93` — vintage gooseneck desk lamp on papers (109 lamp). Fits "Lamp & Pen"
- `1732408433038-73d2f6741fc5` — B&W pen on stack of papers (this session). Fits "Drafts / Manuscript pages on the desk"
- `1642543492366-a92039433543` — notebook on wood with morning light (this session). Fits "Pencils paper morning light"

**Landscapes / nature:**
- `1761429569511-fa812103fc21` — misty mountain forest (Phase 2 forest). Fits "Western Ghats", "watershed"
- `1759767119537-3ea0e5ff75de` — acacia on golden grassland (Phase 2 savanna). Fits "Rift Valley", "earthworks"
- `1626301333798-9f08e10c235b` — misty Mexican mountains (Phase 4.6 oaxaca). Fits "Oaxaca Highlands"
- `1763151283478-569228f5d6eb` — rocky Atlantic cliffs blue water (Phase 4.6 coast). Fits "Portuguese Coast"
- `1608311676361-ce8089424a92` — Auvergne volcanic puys aerial (Phase 4.6 auv). Fits "Auvergne Plateau"
- `1656844817790-435d65e2e037` — Atacama rocky desert canyon (Phase 4.6 atac). Fits "Atacama Verge"
- `1757660912982-83012928f64b` — Yorkshire dale with stream (Phase 4.6 york). Fits "Yorkshire Beck"
- `1576829021154-ed73d379e1c0` — snowy Japanese countryside (Phase 4.6 hokk). Fits "Hokkaido Margin"
- `1742339548967-5d0a45af57c2` — Faroe Islands stormy basalt cliffs (Phase 4.7 cliff1). Fits "Faroe Islands"
- `1555979864-7a8f9b4fddf8` — aerial coastline turquoise water (this session coast2). Fits "aerial coastline"
- `1760556415132-533affdd9ccf` — coral reef with orange fish (Phase 4.7 reef). Fits "open ocean reef"
- `1644508047668-9210042f8eaa` — B&W classical female bust (Phase 4.7 bust). Fits "classical marble bust"

**Portraits — partner-pool (curated for 31-law-firm Phase 4.2 + reused):**
- `1573496359142-b8d87734a5a2` — smiling W female (Sarah)
- `1765005204268-631d9e0c6fe1` — Black female pro headshot (Adaeze) — fits Nigerian-coded names like "Okafor"
- `1648757766966-43d24bf7a264` — bald Latino male (Mateo)
- `1701096374092-bb70915fdc5c` — light-blazer W female (Eleanor)
- `1622626426572-c268eb006092` — Korean male (Daniel) — fits Korean-coded names like "Park", "Ahn"
- `1573497019940-1c28c88b4f3e` — curly-hair W female (Rachel)
- `1767175620484-1ed37931a0d1` — clean-cut bearded W male (James)
- `1762341124796-530c0085f7d8` — Indian female pro (Priya)

**Fresh portraits searched this session:**
- `1758600587391-338f5376b7ed` — Asian female pro headshot. Fits Asian-coded female names ("Mara Kenji", "Lala Putri", etc.)
- `1668049221564-862149a48e10` — Asian female younger / candid. Fits "youth volunteer" / second Asian-female slot to avoid duplicate
- `1743585497068-26fe878c73d4` — B&W weathered elder (Indonesian/SE Asian heritage). Fits "community elder Tomás Ndoye" type
- `1775283511185-508da6831bfe` — B&W silhouette of man's profile. Fits "Silhouette in doorway"
- `1776275758873-31603dd06112` — B&W woman side-profile (cascade #5 portrait). Fits generic editorial portrait

**Special-archetype:**
- `1759851358346-23ae8c50d31c` — vintage red-velvet auditorium with stage. Fits "Stage interior", auditorium
- `1765371514743-45bd8e6c0a28` — warm studio with glass walls + chairs (this session). Fits "Studio interior"
- `1581009146145-b5ef050c2e1e` — gym/fitness training shot (Phase pre-existing). Fits fitness CTA bg
- `1609924480239-ed5cf2b4b672` — wood-louvered modernist building (52 swiss). Fits clean Swiss arch
- `1609530142110-7af0a038c723` — brutalist concrete blocks (52 swiss). Fits brutalist concrete
- `1777661274241-2f636e3534b2` — B&W stone-clad modernist building (52 swiss). Fits Herzog-de-Meuron type
- `1566385101042-1a0aa0c1268c` — colorful market produce mosaic (16 produce)
- `1624668430039-0175a0fbf006` — wooden tray of mixed produce on hay
- `1597362925123-77861d3fbac7` — clean studio veg arrangement
- `1690934164598-99267828e900` — basket of yellow & red tomatoes + greens
- `1751210769268-85d43ecfcdd8` — farmer carrying wooden crate of lettuce
- `1760562535158-b1d697464ebc` — hands holding cabbage in butcher paper. Fits "hand-packing layer in butcher's paper"
- `1766959481554-5a7bb490758a` — green delivery van in countryside ("Let's go!"). Fits "Refrigerated electric van"
- `1622947344895-2148f56279f8` — dark Tenmoku oil-spot tea bowl
- `1758269664127-1f744a56e06c` — row of industrial looms
- `1759719441268-7d807f21a4ea` — woman weaving on loom
- `1619239635762-8132f6dba51c` — blue/white striped textile
- `1569909115134-a0426936c879` — assorted color textiles
- `1643766883805-829d9ad95c42` — close-up colorful weaving machine

## Templates touched in this session

| Template | What was fixed |
|---|---|
| `48-brutalist-art-style` | Camel ARCHIVE hover-fill → industrial pipework |
| `97-blueprintiachitectural` | Camel "Modernist interior gallery" / "Ridge House" / "completed home" → minimalist cream stairwell |
| `92-art-noveau` | Removed `an-wave` SVG dot pattern (rendering issue) |
| `62-90s-grunge` | Stripped `bg-grunge-red` from `.paper-tear` divs to fix cream-vs-red cascade trap |
| `60-aurora-gradients` | Removed "Version 2.0 Live" floating chip from hero |
| `53-claymorphism` | Removed 5 floating decorative circles + restructured pillars-section gradient as stacked bg + removed redundant top-fade on next section |
| `61-brutalism-raw` | +500 random binary octets in `.binary-digits` overlay |
| `105-constructivist-bento-terminal` | `!bg-[#e82f16]` !important to beat body-style cascade trap; heading text-white + drop-shadow |
| `29-corporate-b2c` | New "At a Glance" content card filling right column under Singapore — header + intro + 4 metrics + sector list + tag chips + nested case-study mini-card + footer |
| `85-course-education` | Removed `mb-24 md:mb-32` below hero so trust strip sits flush |
| `39-doc-hub` | Container 820→984px; sticky right-rail with API status + adoption counters + changelog teaser |
| `89-editorial-magazine` | Article cards re-arranged into uniform 2x3 grid w/ typographic plates for no-image entries; new compact full-width navbar; new full-bleed hero w/ overlaid title; removed 2 redundant dividers |
| `88-fitness-wellness` | CTA bg image with gradient + radial vignette; The Block redesigned with bullet-proof bar heights + 4 phase cards (Phase III accented PEAK) |
| `84-game-studio` | Container 1200→1440px; feature card padding p-8 → p-10/12 + spacing bumped |
| `51-glassmorphism` | Left column `justify-center` so 3 stat cards center vertically against taller terminal feed |
| `80-horizontal-scroll` | Bottom nav `pb-6 md:pb-12` → `pb-3 md:pb-4` to bring items down |
| `65-typographic-swiss-poster` | Day 01 Bauakademie → modernist museum; Day 02 Studio → warm studio; Day 03 Stage (camel) → vintage auditorium |
| `96-wabi-sabi-imperfect` | Google AI cartoonish chawan → realistic dark Tenmoku oil-spot bowl (both occurrences) |
| `52-swiss-minimalist` | 3 wrong arch IDs (R&R Hall, mountains, camels) → wood-louvered / brutalist / B&W stone-clad modernist |
| `16-subscription-box-landing` | 7 wrong IDs swapped to produce/farm/butcher-paper/delivery-van archetypes |
| `2-saas-light` | 3 wrong arch (R&R, mountains, camels) → modernist stairwell / industrial / corridor c2 |
| `69-skeuomorphism` | 4 wrong audio-gear IDs → cassette / server / industrial / circuit-board |
| `94-solarpunk` | "restored watershed" / "cohort earthworks" / "quito greywater commons" → savanna acacia / mountain forest |
| `90-risograph-print` | 4 wrong arch IDs → industrial / stairwell / corridor / cornice |
| `06-product-launch-page` | 4 wrong arch + 3 wrong portrait IDs (sweater rack / sweaters / shopping bags as portraits) → curated set |
| `22-photographer-portfolio` | 8 swaps: 4 architectural surfaces + 4 portrait alts (incl. B&W silhouette for "Silhouette in a doorway") |
| `templates/product-card/source` | 10 swaps: cascade IDs + 4 arch + 3 portrait → textile/loom/weaving + curated portraits |
| `23-personal-brand-store` | 7 swaps: 3 arch + 4 named portraits (incl. fresh Asian-female search for "Mara Kenji", Daniel-Korean for "Henry Ahn") |
| `82-nonprofit` | 6 swaps: 2 coastline (camel→aerial coastline) + 4 named portraits (incl. fresh African-elder search for "Tomás Ndoye", Asian-female for "Lala Putri") |
| `37-newsletter-landing` | Line-addressed: 4 wrong IDs split across 9 distinct slots (Drafts/Manuscript → desk; Pencils-morning-light → notebook; 5 issue covers → architectural variety) |
| `66-monochrome` | 4 "Atmosphere I-IV" wrong IDs → industrial / stairwell / terracotta / spiral staircase |

## Audit framework — what to look for in the next pass

1. **Repeated wrong-subject IDs:** grep all `web/*.{html,jsx}` + `templates/*/source.{html,jsx}` for the 4 master offenders:
   - `1487958449943-2429e8be8625` (R&R Hall)
   - `1517021897933-0e0319cfbc28` (mountains)
   - `1469041797191-50ace28483c3` (camels)
   - `1502672260266-1c1ef2d93688` (Scandi room)
2. **Other known wrong-subject IDs** that surfaced during fixes:
   - `1490481651871-ab68de25d43d` (sweater rack — used as "portrait")
   - `1517677208171-0bc6725a3e60` (folded sweaters — used as "portrait")
   - `1483985988355-763728e1935b` (woman with shopping bags — used as "portrait")
   - `1485231183945-fffde7cc051e` (cropped sweater on shutters — used as "portrait")
   - `1488161628813-04466f872be2` (man on circle — used as "Silhouette in a doorway" or "Editorial portrait")
   - `1502716119720-b23a93e5fe1b` (woman in red polka-dot dress — used as "portrait")
   - `1539109136881-3be0616acf4b` (woman in blue coat at Milan Duomo — used as portrait/"Editorial figure")
3. **Per-template alt vs image semantic mismatch:** for each `<img>` (or `bg-[url(...)]`), check whether the alt's intent matches the actual image content. The 4-step protocol from playbook §1.1 still applies.
4. **Folder-based templates** in `templates/<slug>/source.{html,jsx}` — those weren't covered by web/ cascade work in earlier sessions. Currently known: `product-card` (fixed), `coming-soon` (untouched). Check `coming-soon` and any other folder template.
5. **Portrait identity drift:** named portraits where the name implies an ethnicity/gender that the current image doesn't match. Worst offender pattern: cascade #5 portrait (`1776275758873-31603dd06112` — B&W woman side-profile) was used as a generic replacement, so it now sits under male names ("Henry Ahn") in some templates.

## Known limitations of stock-photo curation

- Pool lacks Native American portraits (e.g., "Aiyana Whitehorse" in 94-solarpunk could not be properly matched — kept generic portrait).
- No Indonesian/SE Asian male portraits in pool (Tomás Ndoye in 82 fixed via fresh search; future similar slots may need fresh searches).
- "Aerial coastline" and other location-specific archetypes (Quito street, Lisbon workshop) are accepted as best-fit not exact-match.

## Workflow used per template

Per the playbook §1.1 4-step protocol (slightly adapted for time):
1. Inventory: `grep -nE 'images.unsplash.com/photo-' <file> | awk` to list line/ID/alt
2. Categorize: classify each ID as RIGHT (already curated), WRONG-subject (needs fix), or PASSABLE (not perfect but accepted)
3. For each wrong group: pick from curated pool first, otherwise WebFetch Unsplash search → resolve slug to canonical photo-ID via `curl -sL .../photos/<slug> | grep -oE 'images.unsplash.com/photo-[a-f0-9-]+' | head -1`
4. Download to `C:\Users\nikit\AppData\Local\Temp\audit-fix\` for visual verification via Read tool
5. Apply via `sed -i 's/photo-OLD/photo-NEW/g' file` for site-wide same-context, OR `sed -i 'LINEs/OLD/NEW/' file` for slot-specific differential mappings
6. Verify with `grep -hcE 'OLD' file` returns 0
