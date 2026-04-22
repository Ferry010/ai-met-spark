

# Spark voorlezen — als vooraf opgenomen audio (geen ElevenLabs-calls)

Geen live API. In plaats daarvan: één keer audio genereren per lestekst, opslaan als MP3 in storage, en de app speelt gewoon dat bestand af. Geen credits per gebruiker, geen secret nodig in productie.

## Hoe het werkt voor de gebruiker

- Op elke tekststap (intro, theoryIntro, fact, sparkMiddle, theoryDeep, summary) staat een ▶︎ **"Laat Spark voorlezen"**-knop.
- Klik = MP3 uit de `lesson-audio` storage-bucket wordt afgespeeld. Geen wachttijd door API, gewoon een statisch bestand.
- ⏸ pauzeert, opnieuw klikken hervat. Bij volgende stap stopt vorige audio.
- Als er (nog) geen opname bestaat voor een stap, valt de knop netjes weg — geen broken state.

## Hoe de opnames erin komen (admin-only, eenmalig)

Een verborgen admin-tool genereert per les alle audiofragmenten **één keer** en uploadt ze naar storage. Gebruikers triggeren ElevenLabs nooit zelf.

- Nieuwe pagina `/admin/audio` (alleen voor `admin`-rol):
  - Lijst van alle lessen met per stap een status: ✅ opgenomen / ⚪ ontbreekt / ⟳ verouderd (tekst is gewijzigd na laatste opname).
  - Knoppen: **"Genereer ontbrekende"** en **"Hergenereer alles voor deze les"**.
  - Audio-preview per fragment.
- Generatie roept een edge function aan die ElevenLabs aanspreekt → MP3 → uploadt naar `lesson-audio/{lessonId}/{step}.mp3` → schrijft een record in `lesson_audio` tabel.
- Voor deze admin-flow is **wel** een ElevenLabs key nodig, maar alleen tijdelijk tijdens generatie. Je kunt 'm daarna verwijderen — afspelen blijft werken want de bestanden staan in storage.

Alternatief als je écht geen ElevenLabs wilt aanraken: je kunt zelf MP3's opnemen (bv. met Mac Voice Memo) en uploaden via dezelfde admin-pagina. Dan slaan we de generatie-stap helemaal over.

## Wat de gebruiker (jij) moet kiezen

Twee dingen nog open — laat me weten welke:

1. **Hoe wil je de opnames maken?**
   - **a) ElevenLabs eenmalig** — ik vraag dan tijdens implementatie om de `ELEVENLABS_API_KEY`. Je genereert in de admin-pagina alle audio in een paar klikken, daarna kan de key weg. Klinkt professioneel, consistent, snel klaar.
   - **b) Zelf inspreken / handmatig uploaden** — ik bouw alleen de upload-UI. Jij neemt zelf in en uploadt MP3's. Geen externe service nodig, maar veel handwerk.
   - **c) Allebei mogelijk** — admin-pagina ondersteunt zowel "genereer met ElevenLabs" als "upload eigen MP3" per fragment.

2. **Welke stem als je voor (a) of (c) gaat?** Voorstel: warme NL-vriendelijke stem **"Lily" `pFZP5JQG7iQjIQuC4Bku`** of **"Charlie" `IKne3meq5aSn9XLyUdCD`**.

## Technisch (ongeacht keuze)

**Storage**
- Nieuwe public bucket `lesson-audio` (publiek leesbaar zodat de browser direct streamt zonder signed URLs — scheelt latency).
- Pad-conventie: `{lessonId}/{step}.mp3` waarbij `step ∈ intro | theoryIntro | fact | sparkMiddle | theoryDeep | summary`.

**Database**
- Nieuwe tabel `lesson_audio`:
  - `lesson_id text`, `step text`, `storage_path text`, `text_hash text`, `created_at timestamptz`
  - PK `(lesson_id, step)`
  - `text_hash` zodat de admin-pagina kan zien welke fragmenten verouderd zijn (tekst gewijzigd in `lessons.ts` of `lesson_overrides`).
- RLS: iedereen mag selecteren (publieke leesrechten); alleen `admin` mag insert/update/delete.

**Frontend**
- `src/hooks/useSparkVoice.ts` — laadt MP3-url via Supabase storage public URL, beheert `<audio>`-element, exposeert `play(text, lessonId, step)` / `stop()` / `isPlaying`. Geen API-call, alleen statisch bestand.
- `src/components/SparkVoiceButton.tsx` — ▶︎/⏸ knop; rendert `null` als er geen audio-record bestaat.
- `src/components/LessonRunner.tsx` — voorleesknop op alle tekststappen.

**Backend (alleen voor admin generatie, optie a/c)**
- Edge function `supabase/functions/generate-lesson-audio/index.ts` — alleen aanroepbaar door admins (JWT check + `has_role`); roept ElevenLabs, upload naar storage, upsert in `lesson_audio`. `verify_jwt = true`.
- Edge function `supabase/functions/upload-lesson-audio/index.ts` — admin upload eigen MP3 (optie b/c). `verify_jwt = true`.

**Admin-pagina**
- `src/pages/admin/LessonAudio.tsx` — overzicht + acties.
- Route in `App.tsx` onder admin-guard.

**Tekst-redesign (parallel, blijft uit vorig plan)**
- `src/lib/markdown.tsx` — mini renderer voor `**bold**`, `> quote`, `- list`, paragrafen + lead-detectie.
- `LessonRunner.tsx` — TheoryCard, SparkMiddle, SummaryCard herontworpen via `renderRichText`. Lead-zin uitgelicht, ruimere line-height, max-width 60ch, callouts, leestijd-hint, genummerde gradient-chips in summary.
- Zelfde plan als vorige ronde — geen wijziging aan `lessons.ts`.

## Wat ik bewust NIET doe

- Geen runtime ElevenLabs-calls vanuit de gebruiker-app. Ooit. Audio wordt vooraf gegenereerd of geüpload.
- Geen auto-play.
- Geen woord-voor-woord highlight.
- Geen voorlees-knop op quiz/interactive.

