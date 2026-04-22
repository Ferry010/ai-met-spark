
# Achtergrondmuziek toevoegen voor student-schermen en menu’s

## Doel
De geüploade audio `Orbit_Classroom.mp3` als doorlopende achtergrondmuziek laten afspelen in de student-app, inclusief menu’s en normale schermen, en de muziek automatisch pauzeren zodra een leerflow start.

## Gewenst gedrag
Volgens je keuzes wordt het gedrag zo:

- afspelen in de **student app**
  - dashboard
  - wereldpagina’s
  - account
  - overige studentmenu’s / gewone studentschermen
- **niet** afspelen tijdens leerflows:
  - lespagina’s
  - eindtoets
  - diploma/certificate flow
- **autoplay als de browser het toelaat**
- als autoplay wordt geblokkeerd, start de muziek na de **eerste klik/tap**
- bij verlaten van een leerflow mag de muziek weer hervatten

## Wat er gebouwd wordt

### 1) Audiobestand toevoegen aan het project
De upload `Orbit_Classroom.mp3` wordt opgenomen als app-asset, zodat de app het lokaal kan afspelen zonder externe URL.

Voorkeursplek:
- `src/assets/Orbit_Classroom.mp3`

## 2) Centrale background-audio controller
Er komt één gedeelde audio-laag voor de hele student-app, zodat de muziek niet opnieuw start bij elke pagina-wissel.

Waarschijnlijk als:
- een provider of managercomponent in `App.tsx`
- of een losse component zoals `BackgroundAudioController.tsx`

Deze laag:
- maakt één `HTMLAudioElement`
- zet `loop = true`
- gebruikt een rustig standaardvolume
- bewaart playback-state over routewissels heen
- probeert autoplay
- luistert op eerste user interaction als autoplay faalt

## 3) Route-gebaseerde play/pause logica
De achtergrondmuziek wordt gekoppeld aan routes.

### Afspelen op
- `/dashboard`
- `/world/:worldId`
- `/account`
- eventuele andere student “shell” pagina’s die geen leerflow zijn

### Pauzeren op
- `/lesson/:lessonId`
- `/final-test`
- `/certificate`

Zo blijft de audio aanwezig in schermen en menu’s, maar stopt die zodra een les of andere leerervaring opent.

## 4) Veilige autoplay fallback
Browsers blokkeren vaak audio zonder gebruikersinteractie. Daarom komt er een nette fallback:

- eerst proberen automatisch te starten
- lukt dat niet:
  - een globale listener op eerste `pointerdown` / `keydown`
  - dan alsnog starten als de huidige route muziek mag afspelen

Dit sluit aan op je wens: “autoplay if allowed”.

## 5) Niet laten botsen met bestaande lesaudio
De app heeft al:
- sound effects via `src/lib/sounds.ts`
- Spark-voice audio via `src/hooks/useSparkVoice.ts`

De achtergrondmuziek wordt zo opgezet dat die:
- buiten lessen actief is
- in leerflows pauzeert
- dus niet interfereert met lesaudio, stemknoppen of toetsflow

## Technische aanpak

### Nieuwe onderdelen
Waarschijnlijk:
- `src/components/BackgroundAudioController.tsx`
- eventueel `src/hooks/useBackgroundAudio.ts`

Verantwoordelijkheden:
- audio initialiseren
- play/pause beheren
- autoplay-fallback uitvoeren
- op routeverandering reageren

## Integratie in app-shell
`src/App.tsx` wordt aangepast zodat de achtergrond-audio controller één keer boven de routes hangt en dus niet remount bij elke pagina.

Conceptueel:

```text
App
├─ BackgroundAudioController
├─ Routes
│  ├─ dashboard / world / account => muziek aan
│  └─ lesson / final-test / certificate => muziek uit
```

## Bestanden die aangepast worden

### Nieuwe asset
- `src/assets/Orbit_Classroom.mp3`

### Nieuwe logica
- `src/components/BackgroundAudioController.tsx`
  - centrale route-aware achtergrondmuziek

### App integratie
- `src/App.tsx`
  - controller globaal mounten

## Belangrijke details
- muziek loopt in een lus (`loop`)
- volume wordt conservatief ingesteld zodat het niet overheerst
- pauze gebeurt route-based, niet per pagina-component handmatig
- geen muziek op lesson-, final-test- of certificate-routes
- hervat automatisch wanneer de gebruiker teruggaat naar dashboard/wereld/account

## Acceptatiecriteria
Na implementatie:

- `Orbit_Classroom.mp3` speelt doorlopend op student-schermen en menu’s
- muziek probeert automatisch te starten
- als autoplay niet mag, start die na eerste klik/tap
- muziek stopt zodra een les wordt gestart
- muziek stopt ook op eindtoets en diploma
- muziek hervat weer op toegestane studentpagina’s
- de audio herstart niet onnodig bij normale navigatie tussen studentschermen

## Opmerking
Ik ga dit implementeren zonder teacher/admin-schermen te beïnvloeden, omdat je expliciet voor de student-app koos.
