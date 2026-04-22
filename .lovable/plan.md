
# TTS copy optimaliseren voor lesaudio

## Doel
Alle tekst die wordt voorgelezen in lessen herschrijven en normaliseren zodat de stem natuurlijker klinkt, met minder struikelwoorden, minder rare afkortingen en duidelijkere uitspraak van lastige termen zoals “AI”.

## Wat er gebouwd wordt

### 1) Eén duidelijke TTS-schrijfstijl voor alle lesaudio
Er komt een vaste schrijf- en normalisatielaag voor lesaudio, zodat teksten AI-voice vriendelijk blijven.

Die laag volgt regels zoals:
- schrijf afkortingen zoveel mogelijk uit
- vermijd losse letters zoals “AI” of “A I” waar een stem over kan struikelen
- vervang onnatuurlijke caps lock of losse quotes waar nodig
- schrijf cijfers, symbolen en productnamen op een manier die prettiger wordt uitgesproken
- vermijd te lange zinnen en onhandige ritmes
- gebruik duidelijke leestekens voor natuurlijke pauzes

Voorbeeldrichting:
- “AI” → een consistente, uitgesproken vorm
- “ChatGPT” → alleen behouden waar nodig, anders beschrijvend herschrijven
- “1.8” in lopende tekst vermijden als spreektekst
- opsommingen en korte punchlines herschrijven naar spreektaal

### 2) Audit van alle lesaudio-bronnen
Alle tekst die nu als audio kan worden gegenereerd wordt gecontroleerd en herschreven waar nodig:
- `sparkIntro`
- `theoryIntro`
- `fact`
- `sparkMiddle`
- `theoryDeep`
- `summary`

De audit richt zich op:
- uitspraakvriendelijkheid
- ritme en verstaanbaarheid
- grammatica en spelling
- consistente benaming van AI-termen
- minder dubbelzinnigheid of visuele schrijfvormen die slecht klinken in audio

### 3) Centrale helper voor audio-tekst
Er komt een gedeelde helper die de voorleesbare tekst voorbereidt voordat:
- hashes worden berekend
- audio wordt gegenereerd
- bestaande audio als “verouderd” of “actueel” wordt vergeleken

Dat voorkomt dat:
- dezelfde les visueel één tekst heeft, maar auditief een andere
- oude hashes blijven matchen terwijl de TTS-uitspraaklogica is veranderd
- de admin-pagina een andere tekst genereert dan de les zelf afspeelt

## Belangrijke ontwerpkeuze
De optimalisatie gebeurt alleen voor **lesson audio**, niet voor alle zichtbare UI-copy. Zo blijft marketing- en interfacecopy onaangetast, terwijl de stem wel natuurlijker wordt.

## Technische aanpak

### A. Nieuwe normalisatie-helper
Een nieuwe utilityfunctie maakt van ruwe lesinhoud een TTS-veilige versie.

Taken van die helper:
- markdown/visuele opmaak strippen waar nodig
- afkortingen en problematische termen normaliseren
- meerdere spaties, rare interpunctie en visuele notatie opschonen
- summary-bullets samenvoegen tot goed uitspreekbare zinnen
- optioneel vaste vervangregels toepassen voor bekende probleemwoorden

Voorbeeldstructuur:
```text
raw lesson text
→ normalize for TTS
→ hash normalized text
→ send normalized text to audio generation
→ store audio with matching hash
```

### B. Audiobeheer laten werken op genormaliseerde tekst
`src/components/admin/lesson-audio-shared.ts` wordt aangepast zodat `LESSON_AUDIO_STEPS` niet alleen brontekst ophaalt, maar de definitieve TTS-tekst gebruikt.

`src/pages/admin/LessonAudio.tsx` blijft genereren, uploaden en vergelijken, maar dan op basis van de genormaliseerde tekst.

Gevolg:
- “Generate missing” werkt correct
- “stale” detectie wordt betrouwbaarder
- nieuwe uitspraakregels forceren netjes een regeneratie waar nodig

### C. Volledige content-pass in `src/content/lessons.ts`
Alle lesson-audio teksten worden taaltechnisch opgeschoond met focus op spreekbaarheid.

Werk per les:
- lastige termen herschrijven
- productnamen alleen gebruiken als dat nodig is
- “AI” consequent op één manier laten terugkomen
- te visuele zinnen herschrijven naar gesproken taal
- komma’s, punten en ritme verbeteren voor natuurlijke TTS-pauzes

### D. Overrides correct meenemen
Bij controle viel op dat override-data nu niet volledig alle voorleesvelden meeneemt.

`src/hooks/useLessonOverrides.ts` en `src/pages/LessonPage.tsx` moeten worden nagekeken en aangevuld zodat ook TTS-relevante overridevelden correct worden gebruikt, met name:
- `spark_intro`
- eventueel `reflection` als die later ook audio krijgt

Dat voorkomt dat de admin een aangepaste tekst ziet, maar de generator of lesweergave alsnog de basiscontent gebruikt.

## Bestanden die aangepast worden

### Content
- `src/content/lessons.ts`
  - lesaudio herschrijven naar TTS-vriendelijke spreektaal

### Shared audio logic
- `src/components/admin/lesson-audio-shared.ts`
  - audio-step tekst via centrale TTS-helper laten lopen

### Admin audio page
- `src/pages/admin/LessonAudio.tsx`
  - hash/generatie blijven koppelen aan genormaliseerde tekst

### Overrides
- `src/hooks/useLessonOverrides.ts`
  - ontbrekende overridevelden meenemen waar relevant
- `src/pages/LessonPage.tsx`
  - dezelfde override-logica gelijk trekken met de uiteindelijke lesinhoud

### Nieuwe utility
- bijvoorbeeld `src/lib/tts.ts`
  - centrale normalisatie- en vervangregels voor lesson audio

## Acceptatiecriteria
Na implementatie:
- klinken lesaudio-teksten natuurlijker en duidelijker
- zijn termen zoals “AI” consistent en spreekbaar gemaakt
- worden lastige symbolen, afkortingen en visuele schrijfvormen vermeden
- gebruikt audiogeneratie overal dezelfde definitieve tekstbron
- markeert de admin-audiopagina bestaande audio correct als verouderd wanneer uitspraakregels of content zijn aangepast

## Verwacht resultaat
Je kunt daarna lesaudio opnieuw genereren met tekst die speciaal is voorbereid voor voorlezen: minder struikelen op termen, rustiger ritme, duidelijkere uitspraak en een veel consistenter “Spark”-geluid over alle lessen heen.
