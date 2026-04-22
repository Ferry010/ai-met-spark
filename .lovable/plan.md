

# Mobile & tablet optimalisatie van `/admin/audio`

De huidige `LessonAudio.tsx` is gebouwd voor desktop: rijen met vaste breedtes (`w-32` label, audio-controls, twee knoppen, badge) lopen op mobiel uit de card of worden onleesbaar smal. De header-rij van elke les heeft 4 elementen naast elkaar die op <640px niet meer passen.

## Wat er verandert (alleen `src/pages/admin/LessonAudio.tsx`)

### Container & typografie
- `container` → `container px-4` met `max-w-5xl` behouden; `py-8` → `py-6 md:py-8`.
- H1 schaalt: `text-2xl md:text-3xl`. Intro-paragraaf `text-sm md:text-base`.

### LessonRow header (de rij met emoji + titel + knoppen)
- Mobiel: emoji + titel bovenaan, badges eronder, knoppen full-width onderin (gestackt).
- Tablet/desktop (`md:`): huidige horizontale layout.
- Implementatie: outer `flex flex-col md:flex-row md:items-center gap-3`. Knoppen-groep in eigen `flex gap-2 w-full md:w-auto` waarbij beide knoppen `flex-1 md:flex-initial` krijgen zodat ze op mobiel naast elkaar de breedte vullen.
- Titel `truncate` blijft, maar krijgt ook `break-words` als fallback.

### Stap-rijen (intro, theorieIntro, etc.)
Dit is het grootste pijnpunt: `w-32` label + tekst + audio + 2 knoppen + badge in één rij past nooit op 402px.

Nieuwe layout per stap-rij:
- **Mobiel (<768px)**: 2-rijs grid binnen elke stap-card.
  - Bovenste regel: stap-label (links) + status-badge (rechts).
  - Tekst-preview op eigen regel, `line-clamp-2` i.p.v. `truncate`.
  - Audio-player full-width (`w-full` op `<audio>`).
  - Actie-knoppen (genereer + upload) op eigen regel, naast elkaar `flex-1`.
- **Desktop (md:)**: huidige horizontale rij behouden.
- Achtergrond `bg-muted/30` blijft, padding `p-3` i.p.v. `p-2` voor tap-targets.

### Knoppen & tap targets
- Genereer- en upload-knoppen krijgen op mobiel `h-10` (i.p.v. `sm` `h-9`) zodat ze comfortabel aantikbaar zijn.
- Upload-label-wrapper krijgt expliciete `flex-1 md:flex-initial`.

### Bekijk/Verberg-toggle
- Op mobiel wordt deze onderdeel van de knoppen-rij; op desktop blijft hij rechts naast de badges.

### Sticky genereer-knop (optioneel, klein)
- Wanneer een les open is op mobiel: niets sticky maken (te complex). Wel: bovenin de open sectie een korte regel "X stappen — Y ontbreken" als context, zodat je niet hoeft te scrollen om te zien waar je mee bezig bent.

## Bestanden

**Aangepast**
- `src/pages/admin/LessonAudio.tsx` — responsive layout zoals hierboven beschreven.

## Wat ik bewust NIET doe

- Geen wijziging aan de edge functions, hook, of database.
- Geen nieuwe componenten — alles binnen één bestand met Tailwind responsive utilities.
- Geen drawer/sheet voor mobiel; de bestaande inline-expand werkt prima met de nieuwe layout.
- Geen wijziging aan de `AppHeader` — die is al responsive.

