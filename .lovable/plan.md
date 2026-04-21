

# Wereld 2 — SLIM curriculum integreren

Je hebt de volledige V1.0 van Wereld 2 (SLIM, "Kompas van Wijsheid") aangeleverd: 8 lessen met dezelfde 8-stappen flow als Wereld 1 (intro → theorie 1 → wist je dat → Spark tussen → theorie 2 → oefening → samenvatting → quiz). Ik vervang de bestaande Wereld-2 lessen 2.1 t/m 2.8 in `src/content/lessons.ts` 1-op-1 door deze nieuwe content. Wereld 1 en 3 blijven ongemoeid.

## Wat de leerling ziet

Acht nieuwe lessen in de SLIM-wereld met Spark's persoonlijke stem en concrete voorbeelden uit hun leefwereld:
1. **2.1** AI is een gokker, geen wijsneus
2. **2.2** De hallucinatie-val (Amerikaanse advocaat-rechtszaak weetje)
3. **2.3** Vraag slim: WIE-WAT-HOE (de promptformule)
4. **2.4** Dubbelcheck in 3 stappen
5. **2.5** Krachtwoorden voor betere prompts (5 stuks)
6. **2.6** AI zegt iets raars: nu wat? (RESET / HERFORMULEER / STOP)
7. **2.7** Verschillende AI's, verschillende sterktes
8. **2.8** Wereld 2 Baas-test → badge **Kompas van Wijsheid**

Elke les heeft de `sparkMiddle`-overgang, en visueel komt de SLIM-accentkleur (#F59E0B / pillar `smart`) overal terug, net als nu.

## Technische uitvoering

### a) `src/content/lessons.ts` — Wereld 2 lessen vervangen

Het hele `lessons: [...]` block voor `worldId: 2` (regels rond 697–~1090) wordt vervangen door 8 lessen die de JSON 1-op-1 mappen, met dezelfde mapping-logica als Wereld 1:

- `sparkIntro` → `sparkIntro`
- `theoryPart1.heading + body` → `theoryIntro` (heading als **bold** eerste regel)
- `wistJeDat.body` → `fact`
- `sparkMiddle` → `sparkMiddle`
- `theoryPart2.heading + body` → `theoryDeep`
- `summary` → `summary`
- `quiz` → `quiz` (mc/true_false/tap_multi → `multiChoice` zoals bij Wereld 1)

### b) Mapping van Wereld-2 `exercise.type` → bestaande `InteractiveStep` kinds

Geen schema-uitbreiding nodig, alles past op de drie bestaande kinds die `LessonRunner` al rendert:

| Les | JSON type | Mapt naar |
|---|---|---|
| 2.1 | `guess_or_know` (vertrouw/check) | `sortBuckets` met 2 buckets "Vertrouw" / "Check" |
| 2.2 | `spot_hallucination` (true/false per item) | `sortBuckets` met 2 buckets "Hallucinatie" / "Klopt" |
| 2.3 | `prompt_upgrade` (3 opties per slappe vraag) | `tapReveal` — slappe vraag als label, juiste opties + uitleg in reveal. *Trade-off: minder testgevoel, meer lees-en-leer; bewust gekozen om scope te houden, net als bij Wereld 1.* |
| 2.4 | `verify_steps` (juiste stap kiezen) | `tapReveal` — scenario als label, juiste stap + uitleg in reveal |
| 2.5 | `add_power_word` (3 opties per vraag) | `tapReveal` — originele prompt als label, beste krachtwoord + uitleg in reveal |
| 2.6 | `troubleshoot` (reset/herformuleer/stop) | `sortBuckets` met 3 buckets "Reset" / "Herformuleer" / "Stop" |
| 2.7 | `match_task_ai` | `sortBuckets` met buckets "Tekst-AI" / "Plaatjes-AI" / "Muziek-AI" (taken die geen muziek-AI vragen vallen in tekst-AI bucket) |
| 2.8 | `final_test` (8 mix-vragen) | Mappen op de bestaande `quiz` array; `bossTest: true` zoals 1.8 |

### c) Geen wijzigingen aan andere bestanden

- Geen runtime-wijzigingen in `LessonRunner.tsx`: `sparkMiddle`, generieke 3-bucket `sortBuckets` en `tapReveal` zijn er al.
- Geen DB-migratie: `lesson_overrides.spark_middle` is al toegevoegd in vorige iteratie.
- Geen wijzigingen aan admin, badges, dashboard, certificaat.

## Bestanden

**Aangepast**
- `src/content/lessons.ts` — Wereld 2 `lessons` array volledig vervangen (8 lessen)

## Wat ik bewust NIET doe

- Wereld 1 en 3 blijven exact zoals ze nu zijn.
- Geen nieuwe interactive kinds (`scenarioChoice`, `multiSelect`). `tap_multi` quizvragen worden net als in Wereld 1 als gewone multiple-choice met de eerste juiste optie als `correctIndex` getoond — echte multi-select is een aparte iteratie.
- Geen badge-systeem-wijzigingen; "Kompas van Wijsheid" toon ik via de bestaande boss-test flow.
- Geen herrangschikking van bestaande Wereld-2 records in `lesson_overrides` — die zijn lesson_id-gebonden en blijven werken; nieuwe content is de fallback.

