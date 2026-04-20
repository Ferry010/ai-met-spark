

# Curriculum-uitbreiding, Spark als leraar, admin-preview & nieuw diploma

Het curriculum is gegroeid van 12 → **24 lessen** (3 werelden × 8 lessen) voor de doelgroep **9–11 jaar**. Spark wordt de animeerbare leraar die uitleg en hints geeft. Jij wil als admin elke les kunnen doorlopen en het diploma krijgt een nieuw, kicken design.

## 1. Curriculum naar 24 lessen (9–11 jaar)

Volledige herschrijving van `src/content/lessons.ts` op basis van het bijgevoegde document:

**Wereld 1 — VEILIG** (Schild van Waakzaamheid, blauw)
1. Wat is AI eigenlijk? · 2. Jouw geheimen zijn van jou · 3. Spot de nep: plaatjes · 4. Spot de nep: video's en stemmen · 5. Scams en oplichting met AI · 6. Wat AI NIET mag weten · 7. Wanneer vraag je een volwassene? · 8. **Wereld 1 Baas-test**

**Wereld 2 — SLIM** (Kompas van Helderheid)
9. AI ≠ zoekmachine · 10. AI hallucineert · 11. De 3-check · 12. Beter vragen stellen · 13. AI zegt iets raars: nu wat? · 14. Welke AI gebruik je waarvoor? · 15. Fact check als detective · 16. **Wereld 2 Baas-test**

**Wereld 3 — STERKER** (Ster van Meesterschap)
17. AI als brainstormmaatje · 18. AI als uitleg-maatje · 19. AI als oefenpartner · 20. AI als schrijfcoach (niet ghostwriter) · 21. AI bij rekenen (de weg, niet het antwoord) · 22. De 10x slimmer-formule · 23. AI als jouw superkracht · 24. **Eindbaas-test**

Elke les krijgt het 5-stappen ritme uit het document: **Ontmoet Spark → Ontdek → Speel → Quiz (3 vragen) → Verdien je ster**. Bestaande types (`InteractiveStep`, `QuizQuestion`) blijven werken; ik vul met de echte teksten/quizvragen uit de doc. `WORLDS` blijft de bron, alle UI die `lessons` itereert pakt automatisch de nieuwe set.

Updates die meelopen omdat het aantal lessen verandert:
- `src/lib/badges.ts` — drempels (eerste les, 5/12/24, wereld-badges per 8) en nieuwe badges per wereld-baas-test
- `Dashboard.tsx`, `WorldPage.tsx` — werken al data-driven, alleen progress-percentages updaten
- `Certificate.tsx` / kopieteksten "12 lessen" → **"24 lessen"**
- `nl.json` strings die "12" noemen

## 2. Spark als animeerbare leraar

Uitbreiding van `src/components/Spark.tsx` + nieuwe `SparkTeacher.tsx`:

- **Nieuwe moods**: `explaining`, `hinting`, `cheering`, `questioning` (eyebrow-raise), `pointing` (armpje wijst). Bestaande moods blijven.
- **Speech bubble**: nieuwe component `SparkBubble` rendert Spark + tekstballon met typewriter-effect (15ms/char) en een "tik om door te gaan" affordance.
- **Hint-systeem**: in `LessonPage.tsx` krijgt elke interactieve stap een **"Vraag Spark om hint"**-knop. Eerste klik → korte hint, tweede klik → grotere hint, derde klik → laat correct antwoord oplichten met uitleg waarom. Hints staan inline in de lesdata (nieuw optioneel veld `hints?: string[]` op `InteractiveStep`).
- **Reactieve uitleg na quiz**: Spark verschijnt naast elke quiz-feedback met passende mood (cheering bij goed, thinking + warme uitleg bij fout) — vervangt huidige platte tekst.

## 3. Admin lesson-preview (jij doorloopt alles)

Op `/admin/lessons` een **"Preview"**-knop per les + een **"Doorloop alles"**-knop bovenaan:

- Klik op Preview → opent een full-screen `<Dialog>` die exact de student-lesflow toont (intro → fact → interactive → quiz → done) zonder progress op te slaan en zonder paywall. Hergebruikt `LessonPage`-logica via een nieuwe `<LessonRunner lesson={...} preview />`-component die uit `LessonPage.tsx` geëxtraheerd wordt.
- "Doorloop alles" opent les 1 in preview en aan het eind van elke les staat een **"Volgende les →"**-knop die direct de volgende uit `ALL_LESSONS` laadt — zo loop je in één sessie alle 24 door.
- Een dunne **admin-werkbalk** in preview-modus: huidige les-id, "spring naar stap" (intro/fact/interactive/quiz/done), "sluit preview". Geen tracking, geen badges, geen DB-writes.

## 4. Nieuw "cool" Diploma-design

Volledige redesign van `Certificate.tsx` (scherm + PDF via jsPDF):

**Look:**
- Donkere indigo-naar-paars achtergrond met **gouden goudfolie-rand** (dubbele lijn met sierhoeken via SVG paths in de PDF).
- **Grote serif/display-titel** "DIPLOMA" met daaronder fijn-gespatieerd "AI SMART KID" in goud.
- **Holografische badge** linksboven: cirkelvormig embleem met de drie wereld-pictogrammen (🛡️ 🧠 💪) als satellieten rond een centrale ster.
- **Naam in script-achtig handgeschreven font** (Caveat via `@fontsource`) groot in het midden.
- "heeft alle 24 lessen en de eindbaas-test gehaald" + datum + score.
- Onderaan: drie wereld-badges met hun naam ("Schild van Waakzaamheid", "Kompas van Helderheid", "Ster van Meesterschap"), elk in eigen accentkleur.
- Voor de PDF-versie: in jsPDF gebruik ik decoratieve SVG-paths (sierranden), goudkleurige fills (`#D4AF37`) op donkere achtergrond, en de embedded Caveat-font voor de naam.

**Schermversie** krijgt een subtiele 3D tilt-on-hover (CSS perspective + transform) en een glinster-animatie over de gouden rand.

## Nieuwe / aangepaste bestanden

**Nieuw**
- `src/components/SparkBubble.tsx` — Spark + speech bubble + typewriter
- `src/components/LessonRunner.tsx` — herbruikbare lesflow (geëxtraheerd uit LessonPage)
- `src/components/admin/LessonPreviewDialog.tsx` — full-screen previewer met admin-toolbar

**Aangepast**
- `src/content/lessons.ts` — 24 lessen met volledige Nederlandse content + optionele `hints`
- `src/components/Spark.tsx` — extra moods (explaining/hinting/pointing/questioning)
- `src/lib/badges.ts` — drempels herijkt voor 24 lessen + 3 wereld-baas-badges
- `src/pages/LessonPage.tsx` — gebruikt `LessonRunner`, integreert hint-systeem en Spark-feedback
- `src/pages/AdminLessons.tsx` — Preview-knop per les + "Doorloop alles" knop
- `src/pages/Certificate.tsx` — nieuw design (scherm + PDF), tekst naar 24 lessen
- `src/locales/nl.json` — strings met "12 lessen" → "24 lessen", nieuwe hint-strings, baas-test labels

## Wat ik bewust NIET aanraak

- Geen schemawijziging in `lesson_overrides` — bestaande overrides blijven werken op de nieuwe lesson-id's (1.1–3.8).
- Bestaande `user_progress`-rijen voor oude id's (1.1–3.4) blijven; nieuwe id's voegen gewoon nieuwe rijen toe. Geen migratie nodig.
- Geen nieuwe leeftijdskeuze-UI; alleen een micro-copy-update op Landing dat dit pakket voor **9–11 jaar** is (pittige 8 / rustige 12 welkom). Andere leeftijden volgen later zoals je zei.

## Volgorde van uitvoering

1. Curriculum-data (lessons.ts) — basis voor al het andere
2. Spark uitbreiden + SparkBubble + hint-systeem in LessonRunner
3. LessonPage refactor naar LessonRunner
4. Admin preview (Dialog + "Doorloop alles")
5. Diploma-redesign (scherm + PDF)
6. Tekst- en badge-tellingen overal naar 24 trekken

