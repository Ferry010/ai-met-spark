

# Spark leest de lessen voor + tekst beter ontworpen

Twee verbeteringen die los van elkaar werken, maar samen de lessen veel levendiger maken.

## Deel 1 — Spark leest hardop voor (text-to-speech)

**Wat de gebruiker ziet**
- Op elke tekststap (intro, theorieIntro, fact, sparkMiddle, theoryDeep, summary) verschijnt een ▶︎ **"Laat Spark voorlezen"**-knop naast Spark.
- Klik = Spark's mond/animatie schakelt naar `mood="explaining"`, een kleine geluidsgolf-indicator pulseert, en de stem speelt af.
- Knop wordt ⏸ tijdens afspelen; nogmaals tikken pauzeert. Automatisch terug naar ▶︎ als klaar.
- Werkt op mobiel én desktop. Eén Spark-stem voor consistentie (warme, jeugdige stem — voorstel: **"Lily" `pFZP5JQG7iQjIQuC4Bku`** of **"Charlie" `IKne3meq5aSn9XLyUdCD`**).
- Knop blijft ook werken als je doorklikt: bij stap-wissel stopt de vorige audio netjes.

**Technisch**
- Nieuwe edge function `supabase/functions/tts-spark/index.ts`:
  - Input: `{ text, voiceId? }`
  - Roept ElevenLabs `text-to-speech/{voiceId}?output_format=mp3_44100_128` aan met `eleven_multilingual_v2` (NL-stem werkt goed) en `voice_settings.stability 0.5`, `similarity_boost 0.75`, `speed 0.95`.
  - Geeft binaire MP3 terug met `Content-Type: audio/mpeg`.
  - `verify_jwt = false` zodat ingelogde én free-lesson gebruikers het kunnen aanroepen.
  - Vereist nieuwe secret: **`ELEVENLABS_API_KEY`** (ik vraag deze via `add_secret`).
- Nieuwe hook `src/hooks/useSparkVoice.ts`:
  - `playText(text)` / `stop()` / `isPlaying` / `isLoading`.
  - Cachet de laatst-gespeelde audio per text-hash in een ref zodat herhaaldelijk afspelen geen API-call doet.
  - Stopt automatisch op unmount of als `playText` met andere tekst wordt aangeroepen.
- Nieuwe component `src/components/SparkVoiceButton.tsx`: kleine ronde knop (`Volume2` / `Pause` icon van lucide-react) met loading-spinner state. Hergebruikt in `LessonRunner` op alle tekststappen.
- In `LessonRunner.tsx` per stap-render één `<SparkVoiceButton text={...} />` toevoegen naast Spark of onder de eyebrow.

**Kosten/limiet-disclaimer**
ElevenLabs heeft een gratis tier (~10k chars/maand). Bij intensief gebruik moet je opwaarderen. Ik zet later eventueel caching in een storage-bucket toe als dat nodig blijkt — niet in deze ronde.

## Deel 2 — Theorie tekst beter ontworpen

**Wat de gebruiker ziet (TheoryCard rebuild)**
- **Hero-zin** (eerste regel of `**vetgedrukte**` openingsregel) wordt groot uitgelicht als "lead": display-font, 1.5–1.75rem, gekleurd kader links.
- **Paragrafen**: ruimere line-height (1.7), max-width 60ch, generiek beter leesbaar.
- **Markdown-mini**: `**bold**` rendert als `<strong>` met primary-kleur; losse regels die met `- ` beginnen worden een gestylede lijst met emoji-bullet (•/✦).
- **Pull-quotes**: regels die met `> ` beginnen worden een aparte tinted callout-card (`bg-primary/5 border-l-4 border-primary`).
- **"Even ademen"-pauzes**: tussen paragrafen extra spacing + zachte divider.
- **Spark-illustratie** verhuist naar de zijkant op desktop (sticky) zodat je ziet dat hij meeleest; op mobiel een kleine Spark-chip bovenaan.
- **Voortgangshint** onderaan: "📖 ~30 sec lezen" berekend uit woorden/220 wpm.
- **Voorleesknop** prominent rechtsboven in de card.

**SparkMiddle-card** krijgt dezelfde markdown-render zodat `**bold**` en lijsten ook daar werken.

**Summary-card** wordt iets luchtiger: bullets met genummerde gradient-chips i.p.v. allemaal Check-icons, en een korte intro-zin "Dit is wat je moet onthouden:".

**Technisch**
- Nieuwe util `src/lib/markdown.tsx` met een tiny renderer (`renderRichText(text)`) die alleen `**bold**`, `> quote`, `- list` en paragraph-splitting ondersteunt. Geen externe lib (geen `react-markdown`) — houdt bundle klein en consistent met de huiscijfer-stijl.
- `TheoryCard` in `LessonRunner.tsx` herschrijven om `renderRichText` te gebruiken + lead-detectie (eerste paragraaf met `**` wordt lead).
- `sparkMiddle`-render dezelfde `renderRichText` gebruiken.
- `SummaryCard` cosmetische herziening (genummerde chips).
- Geen wijziging aan `lessons.ts` content nodig — bestaande `**` syntax wordt nu echt gerenderd i.p.v. letterlijk getoond.

## Bestanden

**Nieuw**
- `supabase/functions/tts-spark/index.ts` — ElevenLabs proxy (binary MP3)
- `supabase/config.toml` — block voor `tts-spark` met `verify_jwt = false`
- `src/hooks/useSparkVoice.ts` — playback hook met cache + cleanup
- `src/components/SparkVoiceButton.tsx` — ▶︎/⏸ knop
- `src/lib/markdown.tsx` — mini renderer (bold/quote/list/paragraphs + lead)

**Aangepast**
- `src/components/LessonRunner.tsx` — voorleesknop op tekststappen, TheoryCard/SparkMiddle/SummaryCard herontworpen via `renderRichText`

**Secret toevoegen**
- `ELEVENLABS_API_KEY` (ik vraag deze met `add_secret` voordat ik de edge function deploy)

## Wat ik bewust NIET doe

- Geen automatische auto-play — gebruiker moet zelf op ▶︎ tikken (browser autoplay-policy + minder opdringerig).
- Geen woord-voor-woord karaoke-highlighting (vergt ElevenLabs `with-timestamps`-endpoint, complexere sync — kunnen we later).
- Geen voorlees-knop op de quiz of interactive (zou de oefen-flow verstoren).
- Geen vervanging van `react-markdown` import — minimal eigen renderer is genoeg voor onze syntax.
- Geen wijziging aan `lessons.ts` — alleen hoe het gerenderd wordt.

