

# Wereld 3 — STERKER curriculum integreren

Je hebt de volledige V1.0 van Wereld 3 (STERKER, "Kroon van Meesterschap") aangeleverd: 8 lessen met dezelfde 8-stappen flow als Wereld 1 en 2. Ik vervang de bestaande Wereld-3 lessen 3.1 t/m 3.8 in `src/content/lessons.ts` 1-op-1 door deze nieuwe content. Wereld 1 en 2 blijven ongemoeid.

## Wat de leerling ziet

Acht nieuwe lessen in de STERKER-wereld met Spark's persoonlijke stem:
1. **3.1** Tutor of sluiproute? Jij kiest
2. **3.2** Leg het uit alsof ik 6 ben (de uitleg-truc)
3. **3.3** Oefenen tot je het snapt (AI als oefen-maatje)
4. **3.4** Brainstormen met een sparringpartner
5. **3.5** Feedback vragen die je echt verder helpt
6. **3.6** Maak iets eigens (AI als creatief gereedschap)
7. **3.7** Pauze van het scherm (balans en grenzen)
8. **3.8** Wereld 3 Baas-test → badge **Kroon van Meesterschap**

Visueel komt de STERKER-accentkleur (#EF7C42 / pillar `stronger`) overal terug, zoals nu.

## Technische uitvoering

### `src/content/lessons.ts` — Wereld 3 lessen vervangen

Het hele `lessons: [...]` block voor `worldId: 3` wordt 1-op-1 vervangen door 8 lessen via dezelfde mapping als Wereld 1/2:

- `sparkIntro` → `sparkIntro`
- `theoryPart1.heading + body` → `theoryIntro` (heading als **bold** eerste regel)
- `wistJeDat.body` → `fact`
- `sparkMiddle` → `sparkMiddle`
- `theoryPart2.heading + body` → `theoryDeep`
- `summary` → `summary`
- `quiz` → `quiz` (mc / true_false / tap_multi → `multiChoice` met `correctIndex` = eerste juiste optie)
- `exercise.type` → bestaande `InteractiveStep` kinds (`sortBuckets` 2/3 buckets of `tapReveal`, op basis van het type per les zoals het JSON dat aanlevert)
- `final_test` (les 3.8) → mappen op `quiz` met `bossTest: true`

### Geen wijzigingen elders nodig

- `LessonRunner.tsx`, `AdminLessons.tsx`, `useLessonOverrides.ts`, DB schema: alles is al klaar voor deze structuur sinds Wereld 1.
- Wereld 1 en 2: niet aangeraakt.
- Bestaande `lesson_overrides` records (per `lesson_id`) blijven werken als override; de V1.0 content is de fallback.

## Bestanden

**Aangepast**
- `src/content/lessons.ts` — Wereld 3 `lessons` array volledig vervangen (8 lessen)

## Wat ik bewust NIET doe

- Geen schema- of runtime-wijzigingen.
- `tap_multi` quizvragen blijven gewone multiple-choice met de eerste juiste optie als `correctIndex`, net als bij Wereld 1 en 2.
- Geen badge-systeem-wijzigingen; "Kroon van Meesterschap" toon ik via de bestaande boss-test flow.

