

# Admin view-switcher, lesson-structuur uitbreiden, "sleep"-copy fixen

Drie samenhangende wijzigingen: jij krijgt als admin een view-switcher om alle perspectieven te bekijken, de les-structuur in de admin-backend wordt veel rijker (met alle 7 stappen), en de "sleep"-teksten worden vervangen door "tik".

## 1. Admin role + view-switcher

Ferry heeft al de `admin` rol in de database (gecheckt). Geen database-wijziging nodig. Wel een nieuwe UI:

**Nieuw component `AdminViewSwitcher`** (zwevende balk onderaan, alleen zichtbaar voor admins):

```text
+------------------------------------------+
| 👁 Bekijk als:  [Leerling] [Leerkracht]  |
|                 [Ouder]    [School]      |
+------------------------------------------+
```

- Renders globaal in `App.tsx`, leest `isAdmin` uit `useAuth`. Niet-admins zien niets.
- Klik op "Leerling" -> navigate `/dashboard` (bestaande kid-dashboard)
- Klik op "Leerkracht" -> `/teacher` (bestaande classroom dashboard)
- Klik op "Ouder" -> `/admin/preview/parent` (nieuwe pagina, ouder-rapport van een mock-kind)
- Klik op "School" -> `/admin/preview/school` (nieuwe pagina, multi-klas overzicht)
- Huidige route highlight in de switcher
- "Verberg" knop om de balk weg te klikken voor 1 sessie (sessionStorage)

**Nieuwe pagina `ParentPreview` (`/admin/preview/parent`)**
Mock ouder-rapport van leerling "Mila": naam, leeftijd, school, voortgangsbalk (X/24 lessen), badges (schild/kompas/ster), tijdlijn laatste 10 lessen, "Download rapport" knop. Hergebruikt `BadgeDisplay`. Gebruikt mock-data, geen DB.

**Nieuwe pagina `SchoolPreview` (`/admin/preview/school`)**
Mock school-overzicht "OBS De Regenboog": 3 klassen (Groep 6A, 7A, 8A), per klas: aantal leerlingen, klas-voortgang, aantal diploma's. Tabel + "Bekijk klas" knop die naar `/teacher` linkt.

ProtectedRoute krijgt voor deze 2 routes `requireRole="admin"`.

## 2. Lesson-structuur uitbreiden naar 7 stappen

### Nieuwe data-structuur in `src/content/lessons.ts`

Het type `Lesson` krijgt extra optionele velden zodat bestaande 24 lessen blijven werken, maar de admin-editor de volle structuur toont:

```ts
export interface Lesson {
  id: string;
  worldId: 1 | 2 | 3;
  pillar: Pillar;
  title: string;
  emoji: string;
  // STAP 1: Intro
  sparkIntro?: string;
  // STAP 2: Theorie deel 1 (NIEUW)
  theoryIntro?: string;
  // STAP 3: Wist je dat
  fact: string;
  // STAP 4: Theorie deel 2 (NIEUW)
  theoryDeep?: string;
  // STAP 5: Oefening
  interactive: InteractiveStep;
  // STAP 6: Samenvatting (NIEUW)
  summary?: string[];   // bullet points
  // STAP 7: Oefenvragen
  quiz: QuizQuestion[];
  reflection?: string;
  bossTest?: boolean;
}
```

Bestaande lessen renderen de nieuwe stappen alleen als ze gevuld zijn. Geen migratie nodig op de 24 bestaande lessen, ze blijven gewoon werken (theoryIntro/theoryDeep/summary worden simpel overgeslagen).

### `LessonRunner` aanpassen

Stap-flow wordt: `intro -> theoryIntro? -> fact -> theoryDeep? -> interactive -> summary? -> quiz -> done`. Optionele stappen die leeg zijn worden overgeslagen. Bovenin een progress-balkje dat toont waar je bent (1/7, 2/7 etc).

Twee nieuwe stap-componenten:
- **TheoryCard**: rustige kaart met Spark-bubble, kop "Even uitleggen" of "Nog iets erbij", lange leesbare tekst (max 250 woorden), "Begrepen, ga verder" knop.
- **SummaryCard**: groene accent-kaart "Onthoud dit", bullet-lijst met checkmarks, "Klaar voor de quiz" knop.

### `AdminLessons.tsx` editor uitbreiden

Per les krijg je nu een kaart met collapsible secties (accordion) voor alle 7 stappen, in volgorde:
1. Intro (Spark-zin) , bestaand
2. Theorie deel 1 , NIEUW textarea
3. Wist je dat (fact) , bestaand
4. Theorie deel 2 , NIEUW textarea
5. Oefening (interactive JSON) , bestaand
6. Samenvatting , NIEUW textarea, één bullet per regel
7. Quiz , bestaand

Boven elke wereld komt een **wereld-kaart-header** met titel ("Wereld 1, VEILIG") en daaronder ALLE 8 lessen als losse kaarten met eigen titel. Dit beantwoordt "elke module heeft een eigen kaart met titel en lessen, elke losse les heeft een titel".

### Database

`lesson_overrides` tabel uitbreiden met 3 nieuwe nullable kolommen via migratie:
```sql
ALTER TABLE public.lesson_overrides
  ADD COLUMN theory_intro text,
  ADD COLUMN theory_deep text,
  ADD COLUMN summary text[];
```

`useLessonOverrides` hook leest deze velden uit en patcht ze over de defaults. Bestaande overrides blijven werken (kolommen zijn nullable).

## 3. "Sleep" copy fixen

De `sortBuckets` interactie is in code al klikken (knoppen), maar de prompts zeggen "Sleep". Vervang in `src/content/lessons.ts`:
- Les 1.1: "Sleep elk kaartje naar de juiste bak" -> "Tik op de juiste bak voor elk kaartje"
- Les 1.5: "Scam of echt? Sleep elk bericht naar de juiste bak:" -> "Scam of echt? Tik op de juiste bak voor elk bericht:"

Plus een grep door de hele `lessons.ts` om eventueel resterende "sleep/sleur/drag" te vervangen door "tik/kies".

Daarnaast in `LessonRunner` zelf: de SortBuckets-knop tekst "Plaats elk item" -> "Tik elk item aan".

## Bestanden, nieuw vs aangepast

**Nieuw**
- `src/components/AdminViewSwitcher.tsx`, zwevende balk
- `src/pages/admin/ParentPreview.tsx`
- `src/pages/admin/SchoolPreview.tsx`
- Migratie: `lesson_overrides` 3 nieuwe kolommen

**Aangepast**
- `src/App.tsx`, render `AdminViewSwitcher` globaal + 2 nieuwe routes
- `src/content/lessons.ts`, type uitbreiden + sleep-copy weg
- `src/components/LessonRunner.tsx`, 7-stappen flow + TheoryCard + SummaryCard
- `src/pages/AdminLessons.tsx`, editor uitbreiden met theorie/samenvatting velden + accordion
- `src/hooks/useLessonOverrides.ts`, 3 nieuwe velden meelezen

## Wat ik bewust NIET doe

- Geen rol-toekenning in DB (Ferry is al admin).
- Geen herschrijving van bestaande 24 lessen met nieuwe theorie/samenvatting tekst, dat doe je via de admin-editor wanneer je wil. Het systeem ondersteunt het nu wel.
- Geen aparte "module"-laag, je koos voor 1 module per wereld, dus de wereld-kaart IS de module-kaart (alleen labelwijziging in admin: "Wereld 1, module VEILIG").
- Geen drag-and-drop functionaliteit, alles blijft tap-based.

