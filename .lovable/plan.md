

# Mobile & tablet optimalisatie van de hele site

Een gerichte responsive sweep. Geen redesign, wel een laag systematische tweaks per pagina/component zodat alles ademt op 320–768px en netjes overgaat naar tablet (≥768px) en desktop (≥1024px). Geen wijziging aan logica, data of routing.

## Globale fundering

**`tailwind.config.ts`**
- Container padding fluid maken: `padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }` (was vast `1.5rem`). Geeft 16px lucht op smal mobiel i.p.v. 24px gevulde rand.

**`src/index.css`**
- Body krijgt `text-[15px] md:text-base` als comfortgrootte.
- Defensief: `h1,h2,h3 { word-break: break-word; }` voor lange Nederlandse koppen.

## Per pagina / component

### 1. Headers — `SiteHeader.tsx` & `AppHeader.tsx`
- Header wordt op mobiel krap (logo + tekst + 2 knoppen). 
- `SiteHeader`: op `<sm` knop "Inloggen" verbergen of als icon-only, "Probeer gratis" blijft als compactere `h-10 px-4`. Gap tussen items `gap-1 sm:gap-2`. Logo-tekst `hidden xs:inline` als nodig (we houden 'm; alleen padding krimpen).
- `AppHeader`: dropdown trigger blijft, naam op mobiel verborgen (al `hidden sm:inline`). Verklein avatar/initial-knop op mobiel (`h-9`). 
- Beide: `h-16` → `h-14 md:h-16` om verticale ruimte terug te winnen.

### 2. Landing — `Landing.tsx`
- Hero grid: tekst eerst, mascotte daaronder op mobiel (al `md:grid-cols-2`, al goed). Padding `py-16` → `py-10 sm:py-16 md:py-24`.
- CTA-knop: `h-14 px-8` → `h-12 px-6 sm:h-14 sm:px-8 text-sm sm:text-base` om niet over rand te lopen.
- Spark mascotte: `size={280}` is groot op 402px wide → schaal naar `size={200}` op mobiel via state hook of conditioneel via `useIsMobile`. Eenvoudiger: wrap in `scale-75 sm:scale-100` div.
- Sectie-padding overal `py-20` → `py-12 sm:py-16 md:py-20` (consistent kleinere verticale ritme).
- "What's inside" grid `sm:grid-cols-2 lg:grid-cols-4` blijft, maar `InsideStat` getal `text-5xl` → `text-4xl sm:text-5xl`.
- "How it works" grid `lg:grid-cols-5` op tablet `md:grid-cols-3` toevoegen i.p.v. direct naar 2 cols.
- "Pricing teaser" prijs-tegel: huge `€14` `text-7xl` → `text-6xl sm:text-7xl`, gradient-tegel padding `p-8` → `p-6 sm:p-8`.
- Schools/Final CTA cards: `p-10 md:p-16` → `p-6 sm:p-10 md:p-16`. Buttons stacken al op mobiel — goed.

### 3. Pricing — `Pricing.tsx`
- Twee-kolomsplan blijft, maar plan-cards `p-8` → `p-6 sm:p-8`.
- "Best for"-badge en "Populair"-pill op mobiel niet over de rand laten steken: `left-6` blijft, eventueel `text-[11px]`.
- FAQ accordion: `px-6` → `px-4 sm:px-6`, trigger-tekst `text-lg` → `text-base sm:text-lg` zodat lange vragen niet wrappen in 3 regels op mobiel.

### 4. Auth — `Auth.tsx`
- Card max-width al `max-w-md`; padding `p-6` blijft. Op mobiel `py-10` → `py-6`. Spark `size={120}` → `size={96} sm:size={120}`. Naam/leeftijd grid blijft `grid-cols-2`. 

### 5. Dashboard — `Dashboard.tsx`
- Header-rij (Spark + greeting + paywall-knop): paywall-knop op mobiel onder de greeting (al `flex-col sm:flex-row`). Knop `h-12` → `w-full sm:w-auto` op mobiel zodat hij niet smal naast de Spark gepropt wordt.
- Welkomst H1 `text-3xl sm:text-4xl` → `text-2xl sm:text-3xl md:text-4xl` (anders breekt "Hoi {naam}!" rommelig).
- Worlds grid `md:grid-cols-3` blijft; cards `p-6` → `p-5 sm:p-6`.
- Badges grid `grid-cols-2 sm:grid-cols-3 md:grid-cols-5` blijft; cellen op kleinste viewport iets compacter (`p-4` → `p-3 sm:p-4`, emoji `text-3xl` → `text-2xl sm:text-3xl`, beschrijving `text-[11px]` blijft, betere `leading-tight`).
- Eindtoets-card knop: tekst op mobiel verkort niet nodig — knop is al inline.

### 6. WorldPage — `WorldPage.tsx`
- Hero-banner: titel `text-4xl` → `text-3xl sm:text-4xl`, padding `p-8` → `p-6 sm:p-8`, emoji `text-6xl` → `text-5xl sm:text-6xl`.
- Lesson-tegels: huidige zigzag (`sm:ml-0/sm:ml-auto`) is leuk op desktop maar maakt mobiel rommelig — op mobiel volle breedte (`max-w-md` blijft, offset alleen `sm:`-prefix, al zo). Card-tekst `text-lg truncate` → `text-base sm:text-lg`, en titel naar `line-clamp-2` zodat lange lessennamen niet afgekapt worden.

### 7. LessonPage / LessonRunner — `LessonRunner.tsx`
- Container `max-w-2xl` is goed; `py-6` blijft.
- Theory-card: sticky Spark links is `hidden sm:block` — goed. Op mobiel verschijnt Spark niet → ruimte vrij voor tekst, perfect.
- TheoryCard padding `p-6 sm:p-8` blijft; `Begrepen, ga verder →` knop is al `w-full`. 
- Fact-card: `text-2xl sm:text-3xl` → `text-xl sm:text-2xl md:text-3xl` (3xl is fors op smal).
- SparkMiddle: huidige `flex-col sm:flex-row` stack is goed; knop al full-width op mobiel.
- Quiz/Interactive: opties al `min-h-[56px]` (goede tap-targets); rij in `SortBuckets` met buckets-buttons kan op mobiel uit beeld lopen — bucket-knoppen wrappen al (`flex-wrap` op container) maar buckets-rij niet; voeg `flex-wrap` toe aan de buckets `<div className="flex gap-2">`.
- Done-screen Spark `size={140}` → `size={110} sm:size={140}`.

### 8. FinalTest — `FinalTest.tsx`
- Vraag-cards `p-5` blijft; opties al `min-h-[52px]`.
- Submit-button-tekst lang ("Beantwoord alle 10 (3/10)") past niet altijd; gebruik `text-sm sm:text-base` op die knop.
- Result-screen prijs `text-5xl` blijft.

### 9. Certificate — `Certificate.tsx`
- Diploma-card op mobiel: naam `fontSize: 5rem` is veel te groot in `<sm` → maak responsive via `clamp(2.5rem, 12vw, 5rem)` op de naam-div. 
- Padding `p-8 sm:p-12` → `p-5 sm:p-8 md:p-12`.
- "DIPLOMA" titel `text-5xl sm:text-6xl` → `text-4xl sm:text-5xl md:text-6xl`.
- 3 wereld-badges grid `grid-cols-3` blijft; cell padding `px-3 py-4` → `px-2 py-3 sm:px-3 sm:py-4`, emoji `text-3xl` → `text-2xl sm:text-3xl`.
- 3D hover-tilt op touch uitschakelen: `hover:[transform:...]` werkt niet op touch, wel mediaquery `@media (hover: hover) and (pointer: fine)` → wrap in een conditional class.

### 10. Account / SchoolContact
- Beide al `max-w-xl`/`max-w-2xl` met `space-y-*` — vrijwel ok. Alleen Spark op SchoolContact `size={120}` → `size={96} sm:size={120}` en H1 `text-3xl sm:text-4xl` → `text-2xl sm:text-3xl md:text-4xl`.

### 11. Footer — `Footer.tsx`
- Reeds `flex-col md:flex-row`. Op mobiel meer ademruimte: `gap-6` → `gap-4` en items `text-center md:text-left` zodat alles netjes gecentreerd staat.

### 12. Teacher klassikaal — `ClassroomLayout.tsx`, `TopBar.tsx`, `WelcomeBlock.tsx`, `ProgressJourney.tsx`, `ClassOverviewCard.tsx`, `ClassroomDashboard.tsx`
- Container al `max-w-7xl py-8 px-4 md:px-8`; verklein `py-8` → `py-6 md:py-8`.
- TopBar: school-naam in dropdown-trigger al `hidden sm:block` — goed.
- WelcomeBlock H1 `text-3xl md:text-4xl` → `text-2xl sm:text-3xl md:text-4xl`.
- ProgressJourney: huidige `flex-col md:flex-row` met grote `h-16 w-16` cirkels werkt; alleen connector-lijn `hidden md:block` blijft. OK.
- ClassOverviewCard: `grid-cols-6` op heel smal mobiel = piepkleine avatars; verlaag naar `grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12`. Titel-rij `flex items-baseline justify-between` op mobiel blijft.
- ClassroomDashboard hoofdgrid `lg:grid-cols-3` blijft. Action-tiles kolommen `sm:grid-cols-2 lg:grid-cols-1` is goed.

### 13. AdminViewSwitcher / CookieBanner / PaywallDialog / PaymentTestModeBanner
- Snelle check: zorgen dat ze op mobiel `bottom-2 left-2 right-2` (vaste posities) niet over de Cookie-banner heen gaan; Cookie-banner krijgt `flex-col sm:flex-row` met `w-full` op de actie-knop.
- PaywallDialog gebruikt `<Dialog>` — radix is al responsive, alleen padding/typografie van titel verkleinen op mobiel.

## Wat ik bewust NIET doe

- Geen hamburger-menu introduceren — site heeft te weinig nav-items om dat te rechtvaardigen; we knijpen header-knoppen in.
- Geen wijziging aan diploma-PDF (jsPDF blijft landscape A4 — alleen het scherm-component wordt responsive).
- Geen redesign van het classroom-thema (kleuren, fonts, hiërarchie blijven).
- Geen nieuwe componenten of dependencies.
- Geen wijziging aan i18n-strings of inhoud.
- Geen aanpassing van LessonRunner-spelmechaniek; alleen typografie/sizing.

## Bestanden die gewijzigd worden

`tailwind.config.ts`, `src/index.css`, `src/components/SiteHeader.tsx`, `src/components/AppHeader.tsx`, `src/components/Footer.tsx`, `src/components/CookieBanner.tsx`, `src/components/PaywallDialog.tsx`, `src/components/LessonRunner.tsx`, `src/components/classroom/ClassroomLayout.tsx`, `src/components/classroom/WelcomeBlock.tsx`, `src/components/classroom/ClassOverviewCard.tsx`, `src/pages/Landing.tsx`, `src/pages/Pricing.tsx`, `src/pages/Auth.tsx`, `src/pages/Dashboard.tsx`, `src/pages/WorldPage.tsx`, `src/pages/FinalTest.tsx`, `src/pages/Certificate.tsx`, `src/pages/Account.tsx`, `src/pages/SchoolContact.tsx`.

