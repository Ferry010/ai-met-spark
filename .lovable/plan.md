

# Wereld 1 — rijke V1.0 curriculum integreren

Je hebt een complete, veel rijkere V1.0 van Wereld 1 aangeleverd (8 lessen, ~600+ regels content, met Spark's persoonlijke stem, langere theorieblokken, `sparkMiddle`-tussenstuk, en meer interactieve oefeningen). Ik vervang de bestaande Wereld-1 lessen 1.1 t/m 1.8 in `src/content/lessons.ts` door deze nieuwe content, en breid de structuur licht uit zodat alles 1-op-1 past.

## Wat de leerling ziet

Elke les van Wereld 1 krijgt nu de volledige 8-stappen flow uit jouw bron:
1. **Spark intro** — langere, persoonlijke haak (bv. TikTok-voorbeeld, wachtkamer-test, paus-in-pufferjas)
2. **Theorie deel 1** — kernidee met heading + body
3. **Wist je dat?** — verrassend weetje (Deep Blue, Samsung-leak, Trump-arrestatie, etc.)
4. **Spark tussen** *(nieuw)* — korte overgang van Spark in een mini speech-bubble
5. **Theorie deel 2** — verdieping (drie AI-checks, drie scam-signalen, STOP-lijst, etc.)
6. **Oefening** — interactieve component (sort, tap-reveal of multiple-choice scenarios)
7. **Samenvatting** — 3 bullets terugblik
8. **Quiz** — 3 vragen met uitleg

Plus voor les 1.8 (Wereld-baas-test): 8 mix-vragen uit alle lessen + badge "Schild van Waakzaamheid".

## Technische uitvoering

### a) `src/content/lessons.ts` — datastructuur uitbreiden

Eén nieuw optioneel veld op `Lesson`:
```ts
/** STAP 4b — korte overgang van Spark tussen wist-je-dat en theorie deel 2. */
sparkMiddle?: string;
```

Wereld 1 (de hele `lessons: [...]` block voor world id 1) wordt 1-op-1 vervangen met de 8 nieuwe lessen uit jouw JSON. Wereld 2 en 3 blijven ongewijzigd.

**Mapping van JSON → bestaande types**:
- `sparkIntro` → `sparkIntro`
- `theoryPart1.heading + body` → samengevoegd in `theoryIntro` (heading als **bold** eerste regel, daarna body)
- `wistJeDat.body` → `fact`
- `sparkMiddle` → `sparkMiddle` (nieuw veld)
- `theoryPart2.heading + body` → samengevoegd in `theoryDeep`
- `summary` → `summary`
- `quiz` (3 vragen) → `quiz` (mc, true_false en tap_multi → allemaal als `multiChoice` met `correctIndex` of als 2-optie waar/niet-waar)

**Mapping van `exercise.type` → `InteractiveStep` kinds**:
| JSON type | Mapt naar |
|---|---|
| `drag_sort` (les 1.1) | `sortBuckets` met 2 buckets "Dit is AI" / "Dit is geen AI" |
| `tap_yes_no` (les 1.2) | `sortBuckets` met "Kan wel" / "Geheim houden" |
| `visual_check` (les 1.3) | `tapReveal` — elk item label = scenario, reveal = explanation |
| `scenario_choice` (les 1.4, 1.7) | We maken hiervoor een **kleine uitbreiding** van `multiChoice`: één extra optionele `kind: "scenarioChoice"` met meerdere scenario's elk met eigen opties. Of, simpeler: we mappen elk scenario naar een tap-reveal item waar je tikt om het juiste antwoord te zien. **Voorkeur**: tap-reveal mapping, want geen schema-wijziging in DB-overrides nodig. Trade-off: minder "test"-gevoel, meer "lees-en-leer". Dit accepteer ik bewust voor scope.
| `signal_spotter` (les 1.5) | `tapReveal` — scenario als label, signalen + uitleg in reveal |
| `stop_sorter` (les 1.6) | `sortBuckets` 3-bucket variant — **kleine schema-uitbreiding nodig**: `sortBuckets` ondersteunt nu 2 buckets, ik maak het generiek (n buckets). Of we groeperen "depends" onder "ok" voor nu. **Voorkeur**: ik laat `sortBuckets` 3 buckets toe (string array, type allows already), de rendering in `LessonRunner` past zich aan.
| `final_test` (les 1.8) | Mappen naar de bestaande `quiz` array — het hele "exercise" wordt onderdeel van quiz |

### b) `src/components/LessonRunner.tsx` — `sparkMiddle` step toevoegen

- Nieuwe step `"sparkMiddle"` toegevoegd na `"fact"` en vóór `"theoryDeep"` in `buildSteps`.
- Render = pillar-gradient kaart met Spark mascotte links (mood `"explaining"`) + speech-bubble met de `sparkMiddle` tekst en een "Verder" knop. Visueel lichter dan de theorie-stappen.
- Step alleen toevoegen als `lesson.sparkMiddle?.trim()` bestaat (backwards compatible voor wereld 2/3).

### c) `src/pages/AdminLessons.tsx` — extra accordion-item

- Nieuw veld `sparkMiddle` in `RowState` + form, met accordion-item "3b. Spark tussenstuk" tussen wist-je-dat en theorie deel 2.
- "Laad standaard" knop hiervoor.
- Save schrijft naar `lesson_overrides.spark_middle` (zie d).

### d) Database migratie

Nieuwe kolom op `lesson_overrides`:
```sql
ALTER TABLE public.lesson_overrides ADD COLUMN spark_middle text;
```
Plus bijwerken van `useLessonOverrides.ts` om `spark_middle` te lezen en mappen naar `sparkMiddle`.

### e) `Spark` toonde "Wist je dat?" met `mood="hinting"` — blijft zo. Voor de nieuwe `sparkMiddle` stap gebruiken we `mood="explaining"`.

## Bestanden

**Aangepast**
- `src/content/lessons.ts` — `Lesson.sparkMiddle?` toegevoegd, Wereld 1 lessen volledig vervangen
- `src/components/LessonRunner.tsx` — nieuwe `"sparkMiddle"` step + render, generieke `sortBuckets` rendering voor 3 buckets
- `src/pages/AdminLessons.tsx` — nieuw form-veld `sparkMiddle` + accordion-item + save-mapping
- `src/hooks/useLessonOverrides.ts` — `spark_middle` ondersteuning

**Nieuwe migratie**
- `lesson_overrides.spark_middle` (text, nullable)

## Wat ik bewust NIET doe

- Wereld 2 en 3 blijven exact zoals ze nu zijn (jij hebt alleen Wereld 1 aangeleverd).
- Geen separaat `scenarioChoice` interactive-kind; ik map het op `tapReveal`. Als je later échte multi-keuze scenario's wil, voeg ik dan een nieuw kind toe.
- Geen wijziging aan badges, certificaat, of dashboard-flow.
- Geen automatische migratie van bestaande `lesson_overrides` records — die blijven werken, het nieuwe `spark_middle` veld is optioneel.
- Quiz-vragen van type `tap_multi` (meerdere goede antwoorden) worden voor nu gerenderd als gewone multiple-choice met de eerste juiste optie als `correctIndex`. Echte multi-select quiz vergt grotere refactor — los ik in een vervolg-iteratie op als je dat wil.

