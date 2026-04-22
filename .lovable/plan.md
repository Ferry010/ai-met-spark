
# Audiobeheer uitbreiden: verwijderen + regenereren + Rocco als vaste stem

## Doel
De admin-audiopagina uitbreiden zodat je per lesstap:
1. een bestaand audiobestand kunt verwijderen
2. daarna of direct opnieuw kunt genereren
3. standaard de ElevenLabs-stem “Rocco - Mechanical and Robotic” gebruikt voor gegenereerde audio

## Wat er gebouwd wordt

### 1) Verwijderen van voice files
**Nieuwe backendfunctie**
- Een aparte backendfunctie toevoegen voor het verwijderen van lesson-audio.
- Die functie:
  - valideert dat de gebruiker is ingelogd
  - controleert admin-rechten via de bestaande `has_role`-functie
  - zoekt het juiste `lesson_audio` record op via `lessonId + step`
  - verwijdert het mp3-bestand uit de `lesson-audio` bucket
  - verwijdert daarna het bijbehorende record uit de `lesson_audio` tabel
  - geeft een nette JSON-response terug

**Waarom apart**
- Verwijderen hoort expliciet en veilig te zijn, niet verstopt in de upload/generate-functies.
- Er zijn geen schemawijzigingen nodig; de bestaande tabel en bucket zijn voldoende.

### 2) Regenereren van bestaande audio
**Admin UI**
- In `src/pages/admin/LessonAudio.tsx` per stap een expliciete actie toevoegen:
  - Afspelen
  - Uploaden
  - Verwijderen
  - Regenereren
- “Regenereren” blijft dezelfde tekst opnieuw naar de generate-functie sturen, ook als er al audio bestaat.
- Door de bestaande bestandsnaam (`lessonId/step.mp3`) en `upsert: true` blijft dit technisch een nette overwrite.

**UX-gedrag**
- Na verwijderen of regenereren:
  - lijst opnieuw ophalen
  - Spark-audio-cache invalidaten
  - duidelijke success/error toast tonen
- Knoppen disable’en terwijl een actie loopt, zodat dubbele clicks geen race conditions veroorzaken.

### 3) Rocco als vaste generatie-stem
**Generate function**
- In `supabase/functions/generate-lesson-audio/index.ts` de huidige `DEFAULT_VOICE` vervangen door de voice ID van “Rocco - Mechanical and Robotic”.
- De generate-flow blijft verder hetzelfde: tekst -> ElevenLabs -> mp3 -> storage -> `lesson_audio`.

**Admin UI**
- Op de audiobeheerpagina expliciet tonen dat gegenereerde audio nu met Rocco wordt gemaakt.
- Geen extra keuzeveld nodig als deze stem voortaan de standaard moet zijn.

## Bestanden die aangepast worden

### Backend
- `supabase/functions/generate-lesson-audio/index.ts`
  - default voice wijzigen naar Rocco
- `supabase/functions/delete-lesson-audio/index.ts`
  - nieuwe delete-functie met admin-check, storage delete en DB delete

### Frontend
- `src/pages/admin/LessonAudio.tsx`
  - remove-actie toevoegen
  - expliciete regenerate-actie toevoegen
  - UI-copy updaten naar “Rocco” als standaardstem
  - loading/busy states uitbreiden per actie

## Technische details

### Verwijderflow
```text
Admin klikt "Verwijderen"
→ frontend invoke("delete-lesson-audio", { lessonId, step })
→ functie valideert admin
→ record ophalen uit lesson_audio
→ bestand verwijderen uit bucket lesson-audio
→ record verwijderen uit lesson_audio
→ frontend refresh + cache invalidation
```

### Regenerate-flow
```text
Admin klikt "Regenereren"
→ frontend invoke("generate-lesson-audio", { lessonId, step, text, textHash })
→ functie gebruikt Rocco voice ID
→ mp3 upload met upsert
→ lesson_audio upsert
→ frontend refresh + cache invalidation
```

## Veiligheid en dataregels
- Geen wijzigingen aan RLS nodig.
- Alleen admins mogen beheren; dat past al bij de bestaande backendpatronen en `lesson_audio`-toegang.
- Publieke leesbaarheid van audio blijft intact voor afspelen in lessen.

## Aandachtspunt vóór uitvoering
- ElevenLabs verwacht een **voice ID**, niet alleen een naam. De implementatie gebruikt dus de exacte voice ID van “Rocco - Mechanical and Robotic” in de generate-functie.

## Verwacht resultaat
Na implementatie kun je op `/admin/audio` per stap:
- een bestaand audiobestand verwijderen
- een verwijderd of bestaand fragment opnieuw genereren
- alle nieuwe gegenereerde audio automatisch laten maken met Rocco als vaste stem
