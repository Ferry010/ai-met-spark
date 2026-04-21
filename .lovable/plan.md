

# Wereld 1 — V1.1 content vervangen

Je hebt een nieuwe versie (V1.1) van Wereld 1 aangeleverd. De **structuur is identiek** aan de V1.0 die ik vorige iteratie heb geïntegreerd: zelfde 8-stappen flow, zelfde JSON-velden, zelfde `exercise.type`-namen. Dit is puur een content-refresh met aangescherpte tekst van Spark.

## Wat de leerling ziet

Dezelfde 8 lessen (1.1 t/m 1.8), maar met de bijgewerkte V1.1 teksten: warmere intro's, scherpere voorbeelden (TikTok-wachtkamer, Paus-pufferjas, Trump-arrestatie, Samsung-leak, Deep Blue), nieuwe `sparkMiddle`-overgangen en bijgestelde quiz-uitleg. Wereld 2 en 3 blijven ongemoeid.

## Technische uitvoering

### `src/content/lessons.ts` — Wereld 1 lessen vervangen

Het hele `lessons: [...]` block voor `worldId: 1` wordt 1-op-1 vervangen door 8 lessen die de V1.1 JSON mappen. Ik gebruik exact dezelfde mapping-logica als bij V1.0:

- `sparkIntro` → `sparkIntro`
- `theoryPart1.heading + body` → `theoryIntro` (heading als **bold** eerste regel)
- `wistJeDat.body` → `fact`
- `sparkMiddle` → `sparkMiddle`
- `theoryPart2.heading + body` → `theoryDeep`
- `summary` → `summary`
- `quiz` → `quiz` (mc / true_false / tap_multi → `multiChoice` met `correctIndex` = eerste juiste optie)
- `exercise` → bestaande `InteractiveStep` kinds:
  - 1.1 `drag_sort` → `sortBuckets` (Dit is AI / Dit is geen AI)
  - 1.2 `tap_yes_no` → `sortBuckets` (Kan wel / Geheim houden)
  - 1.3 `visual_check` → `tapReveal`
  - 1.4 `scenario_choice` → `tapReveal`
  - 1.5 `signal_spotter` → `tapReveal`
  - 1.6 `stop_sorter` → `sortBuckets` 3-bucket
  - 1.7 `scenario_choice` → `tapReveal`
  - 1.8 `final_test` → mappen op `quiz` met `bossTest: true`

### Geen wijzigingen elders nodig

- `LessonRunner.tsx`, `AdminLessons.tsx`, `useLessonOverrides.ts`, DB schema: alles is in vorige iteratie al klaar voor deze structuur.
- Wereld 2 en 3: niet aangeraakt.
- Bestaande `lesson_overrides` records (per `lesson_id`) blijven werken; de V1.1 content is de nieuwe fallback.

## Bestanden

**Aangepast**
- `src/content/lessons.ts` — Wereld 1 `lessons` array volledig vervangen (8 lessen, V1.1)

## Wat ik bewust NIET doe

- Geen schema- of runtime-wijzigingen — V1.1 past binnen de bestaande types.
- `tap_multi` quizvragen blijven als gewone multiple-choice met de eerste juiste optie als `correctIndex`, net als bij V1.0 en Wereld 2. Echte multi-select is een aparte iteratie als je dat wilt.
- Geen herschrijven van bestaande overrides in de database — die blijven leesvolgorde-gewijs voorrang houden voor lessen waar admin handmatig heeft aangepast.

