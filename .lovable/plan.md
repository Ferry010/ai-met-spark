## Doel

De app voelt nu als een nette website met cards en progressbars. We gaan het ombouwen naar een echte *kindergame*: een avontuurkaart met levels, een mascotte-HUD en speelse vormen — geen rechthoekige business-cards meer. Stijl en kleuren blijven, maar de **visual language** verandert van "dashboard" naar "spelwereld".

Geen content- of backendwijzigingen. Alleen frontend/presentatie.

---

## Wat verandert per scherm

### 1. Dashboard → "Avonturenkaart"
Vervang het strakke 3-card grid + losse stats card door één samenhangend gameplay-scherm:

- **Sky-achtergrond** met parallax-wolkjes, sterretjes, zwevende sparkles (CSS + framer-motion).
- **Spark mascotte links groot** die zwaait/spreekt in een echte tekstballon ("Klaar voor avontuur, {naam}?"). Niet meer "headline naast plaatje".
- **3 werelden als zwevende eilanden** (geen rechthoekige kaarten):
  - Eiland-shape via SVG (organische blob), met embleem/emoji erop, naambordje eronder als houten plankje.
  - Verbonden met een **stippellijn-pad** dat van eiland naar eiland kronkelt.
  - Locked werelden tonen een ketting/slot met Spark die ernaar wijst.
  - Hover/tap = wiebel + "level X" badge poppt eruit.
- **XP/level/streak HUD** als arcade scoreboard (rechtsboven) i.p.v. losse gradient card: pixel-achtige badges, vlam-icoon, level coin met glans.
- **Badges** nu rechthoekige tegels → ronde munten/stickers in een "verzamelboek"-rij; verdiend = glans + lint, locked = grijze schim.
- **Eindtoets card** vervangen door een **"Boss-poort"** onderaan: grote gouden poort/sticker met sloten die opengaan als alle werelden af zijn.

### 2. WorldPage → "Levelpad"
Vervang de zigzag-lessenlijst (die nog rechthoekige cards is) door een echt **Mario/Candy-Crush style pad**:

- Verticaal SVG-pad met **bobbels (level-knoppen)**, niet rechthoekige tiles.
- Elk level = ronde knop met emoji, gloeiende ring als "next", check-medaille als done, slot-icoon als locked.
- Spark loopt/zweeft op het pad bij het huidige level (geanimeerd: idle bob).
- Achtergrond past bij wereldthema (ocean voor safe, zon/desert voor smart, vulkaan voor stronger) via gradient + subtiele SVG-elementen.
- Tap op level = zoom-in + page transition naar les.

### 3. LessonRunner → "Game stages"
De lesstappen blijven, maar verpakking wordt gamey:

- **Topbalk**: vervang strakke segmented progressbar door een **rij sterren/gemstones** die invullen per stap.
- **GameHud** (XP/combo): herontwerp als echte arcade-meter — combo wordt een "FEVER × 2" badge die schudt, XP-burst groter en met sterretjes.
- **Stages** in plaats van cards: pas de sectiewrappers aan zodat ze meer op een **dialoogvenster / scroll** lijken (afgeronde pergament/sticker-look, dikke outline, lichte tilt) i.p.v. nette `bg-card border` rechthoeken.
- **Quiz-antwoorden**: ronde "bubble buttons" met indrukbaar-gevoel (3D shadow die platdrukt op tap) i.p.v. lijstknoppen.
- **Done-scherm**: groot trofee-podium met Spark erop, sterren ploppen één voor één met confetti.

### 4. Globale "game chrome"
- **AppHeader** krijgt een speelser uiterlijk: titel als logo-sticker, level/streak badges als arcade-coins.
- Voeg lichte **noise/grain texture** toe aan body voor warme illustratie-feel.
- Cursor-trail van mini sparkles op desktop (subtiel, kan uit met reduced-motion).

---

## Nieuwe assets / componenten

- `src/components/game/IslandTile.tsx` — SVG blob-island voor dashboard.
- `src/components/game/LevelNode.tsx` — ronde levelknop voor WorldPage.
- `src/components/game/AdventureMap.tsx` — wrapper met wolken/sterren/parallax.
- `src/components/game/Scoreboard.tsx` — arcade XP/level/streak HUD (vervangt huidige "Cosmic" card).
- `src/components/game/BossGate.tsx` — eindtoets-poort.
- `src/components/game/StageFrame.tsx` — speelse wrapper voor lesstappen.
- Extra keyframes in `index.css`: `cloud-drift`, `island-bob`, `coin-spin`, `gate-unlock`, `bubble-press`, `sparkle-trail`.
- 2–3 SVG illustraties (inline) voor wolk, ster, pad-stippel, lint.

## Wat blijft onveranderd

- Kleuren, fonts, design tokens (alleen toepassing verandert).
- Content (`src/content/lessons.ts`), Supabase-tabellen, hooks (`useUserProgress`, `useGameStats`), routing, i18n.
- Spark-component zelf (bestaande moods worden hergebruikt).
- LessonRunner-stap-logica, XP-formules, badge-regels.

## Scope-grenzen

- Geen nieuwe pagina's, geen nieuwe routes.
- Geen wijzigingen aan auth, account, admin, teacher-dashboards.
- Mobile-first: alle nieuwe layouts werken op 375px t/m desktop.
- `prefers-reduced-motion` gerespecteerd voor alle nieuwe animaties.

## Aanpak in volgorde

1. Globale animaties/keyframes + `AdventureMap` achtergrond + `Scoreboard` HUD.
2. Dashboard ombouw met `IslandTile` + pad + `BossGate`; badges-rij naar verzamelboek.
3. WorldPage ombouw naar `LevelNode`-pad met thema-achtergrond + Spark op pad.
4. LessonRunner-wrapper naar `StageFrame`, nieuwe progress-sterrenbalk, quiz bubble-buttons, done-podium.
5. AppHeader speelser maken (badges/coin-stijl).
6. QA op mobiel + reduced-motion.

Akkoord? Dan begin ik bij stap 1.
