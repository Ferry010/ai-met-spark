## Wat ik ga doen

Twee dingen, in deze volgorde:

1. **Een downloadbare brief voor Claude** schrijven op `/mnt/documents/claude-lesson-brief.md`. Daarin staat alles wat Claude nodig heeft om de volledige lescopy te herschrijven.
2. **De twee "Spot de nep"-lessen vervangen** in `src/content/lessons.ts` door twee makkelijkere, interactieve lessen die beter passen bij 9-12 jaar.

## 1. Claude-brief (`/mnt/documents/claude-lesson-brief.md`)

De brief bevat de volgende secties:

**A. Productuitleg — "AI met Spark"**
- Wat het is: een gratis AI-school voor kinderen van 9 tot 12 jaar in het Nederlands.
- Doelgroep: nieuwsgierige kids die AI al gebruiken (TikTok, Snapchat, ChatGPT-huiswerk) maar geen basis hebben in veilig en slim gebruik.
- Drie pijlers (werelden): **VEILIG** (online veilig blijven, geheimen beschermen), **SLIM** (betere vragen stellen, antwoorden checken), **STERKER** (AI als studiemaatje, niet als sluiproute).
- Mascotte Spark begeleidt elke les. Geen echte AI-chat voor kids — alle content is door mensen geschreven.
- Speelse "game-flow" UI (werelden, levels, sterren, badges, diploma).

**B. Lesstructuur — exact format dat Claude moet aanhouden**
Elke les heeft deze 7 stappen (matcht de `Lesson` interface in `src/content/lessons.ts`):
1. `sparkIntro` — warme intro van Spark (1 alinea, vriendelijk, herkenbaar voorbeeld uit hun leven)
2. `theoryIntro` — eerste theorieblok (markdown, 2-3 alinea's, vetgedrukte kop)
3. `fact` — "wist-je-dat" weetje (1 alinea, concreet en verrassend)
4. `sparkMiddle` — korte overgang van Spark (1-2 zinnen)
5. `theoryDeep` — tweede theorieblok met praktisch trucje of stappenplan
6. `interactive` — oefening: één van drie types (`multiChoice`, `tapReveal`, `sortBuckets`)
7. `summary` (3 bullets) + `quiz` (3 vragen met uitleg) + `reflection` (1 zin)

**C. Toon & taalregels**
- Nederlands, leeftijd 9-12.
- Geen jargon. Geen Engelse termen tenzij ze die al kennen (TikTok, ChatGPT, Snapchat).
- Voorbeelden uit hun wereld: games (Minecraft, Roblox, Fortnite), social (TikTok, Snapchat, YouTube), school, vrienden, gezin.
- Spark spreekt als een coole oudere broer/zus: warm, eerlijk, nooit betuttelend, soms grappig.
- Géén emoji's in de leslopende tekst (UI is emoji-vrij gemaakt). Emoji's wél toegestaan in het `emoji` data-veld en in interactieve labels.
- Korte zinnen. Geen lappen tekst. Een les mag in ~5-7 minuten.

**D. De volledige lessenlijst (24 lessen, 3×8)**
Voor elke les: id, titel, pillar, kernidee in 1 zin, en leerdoel. Claude vult de copy in volgens het format uit B.

Inclusief de twee **nieuwe vervangers** voor 1.3 en 1.4:
- **1.3 — "Wat is een goede vraag aan AI?"** (basis prompten, makkelijk, sluit aan op 1.1)
- **1.4 — "AI is altijd beleefd, ook als het fout zit"** (AI klinkt altijd zeker — leer twijfelen, makkelijke versie van 2.1)

De originele "Spot de nep"-thema's worden uit de scope gehaald omdat ze te abstract/visueel waren voor deze leeftijdsgroep.

**E. Voorbeeldles**
Eén volledig uitgewerkt voorbeeld (les 1.1 zoals die nu is) zodat Claude precies ziet hoe diepte, lengte en toon eruitzien.

**F. Output-instructies voor Claude**
- Lever per les een JSON-blok terug dat 1-op-1 in de `Lesson`-objecten geplakt kan worden (velden: `sparkIntro`, `theoryIntro`, `fact`, `sparkMiddle`, `theoryDeep`, `interactive`, `summary`, `quiz`, `reflection`).
- Houd id, title, worldId, pillar, emoji ongewijzigd tenzij expliciet aangegeven.
- Eén les per chat-bericht om kwaliteit hoog te houden.

## 2. Codewijziging — Spot de nep eruit

In `src/content/lessons.ts`:
- **Verwijder** lesblok 1.3 ("Spot de nep: plaatjes", regels ~238-296) en 1.4 ("Spot de nep: video's en stemmen", regels ~297-355).
- **Voeg toe** twee nieuwe lesblokken met dezelfde id's (`1.3` en `1.4`) zodat alle bestaande progress-records, overrides en routes blijven werken:
  - `1.3 — "Wat is een goede vraag aan AI?"` met een `sortBuckets`-oefening ("goede vraag" vs "vage vraag")
  - `1.4 — "AI klinkt altijd zeker"` met een `multiChoice`-oefening waarin kids een te zelfverzekerd AI-antwoord moeten herkennen
- Kopij blijft bewust kort en concreet (placeholder-niveau); Claude levert later de finale copy via de brief.
- Boss-test 1.8 en de teksten in `src/locales/nl.json` ("Voorbeeldles: Spot de Nep", trust-chip "Spot scams en deepfakes") worden in een **vervolgwijziging** bijgewerkt zodra Claude's copy binnen is — niet nu, om de scope klein te houden.

## Technische details

- Bestand om te schrijven: `/mnt/documents/claude-lesson-brief.md` (Markdown, ±6-8 KB).
- Bestand om te bewerken: `src/content/lessons.ts` — alleen het lessons-array van wereld 1, posities van 1.3 en 1.4.
- Geen DB-migraties nodig. De `lesson_overrides`-tabel keyt op `lesson_id` (string); door dezelfde id's te hergebruiken blijven eventuele overrides geldig.
- Geen UI-componenten geraakt. Geen i18n-strings geraakt in deze stap.

## Out of scope (nu)

- Landing-copy bijwerken ("Spot de Nep" als voorbeeldles).
- Boss-test 1.8 herschrijven.
- Daadwerkelijk uitvoeren van de Claude-prompt — dat doe jij in een Claude-gesprek met het bestand erbij.
