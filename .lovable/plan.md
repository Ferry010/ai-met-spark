

# Teacher dashboard redesign, AI Smart Classroom

Een aparte, professioneel ogende docentenomgeving onder `/teacher/*` met eigen design system (teal + amber, Fraunces + DM Sans), volledig in het Nederlands en met mock-data. De bestaande kind-ervaring blijft ongewijzigd.

## Scope iteratie 1

**Volledig afgebouwd**
- `/teacher/login` (visueel)
- `/teacher` dashboard home
- `/teacher/world/:id` wereld-detail

**Stubs met "Binnenkort"-state**
- `/teacher/world/:worldId/lesson/:lessonId` lesdetail
- `/teacher/class/settings` klasbeheer
- `/teacher/demo` demo-modus
- Student-detailpaneel werkt al wel als slide-over op het dashboard

Iteratie 2 vervangt mockdata door echte Supabase queries; nu nog niet.

## Design system, scoped

Niet globaal, alleen onder `/teacher/*` via een wrapper-class `classroom-theme`. Dit voorkomt botsing met de bestaande kid-tokens.

```text
fonts:    Fraunces (display), DM Sans (body), via Google Fonts
palette:  teal #5AA6B2  amber #C9A96E
          w1 #3B82F6    w2 #F59E0B    w3 #EF7C42
          dark #0F1117  muted #6B7280  bg #FAFAFA
          success #10B981   warning #EF4444
radius:   12px cards, 8px buttons
look:     veel witruimte, Linear-meets-Duolingo
```

Tokens komen in `src/index.css` als CSS-variabelen onder `.classroom-theme { ... }`. Tailwind krijgt daarbij de extra kleurnamen (`classroom-teal`, `classroom-amber`, `world-1/2/3`) en font-families (`font-fraunces`, `font-dm-sans`).

## Componenten, nieuw onder `src/components/classroom/`

```text
ClassroomLayout.tsx      shell met topbar + content, dwingt classroom-theme af
TopBar.tsx               logo links, naam + school + avatar-dropdown rechts
WelcomeBlock.tsx         persoonlijke groet + voortgangszin
ProgressJourney.tsx      3 cirkels (VEILIG, SLIM, STERKER) met verbindingslijn
ClassOverviewCard.tsx    grid met 28 student-avatars
StudentAvatar.tsx        cirkel met initiaal + ring (recharts of pure SVG)
WorldCard.tsx            gekleurde kaart met stacked-bar van leerlingen-per-les
ActivityFeed.tsx         5 items, icon + tekst + tijd, warning-stijl voor stuck
ActionTile.tsx           tile voor klassikale les / ouder-update / off-screen / diploma
StudentDetailPanel.tsx   side-sheet (Sheet uit shadcn) met leerling-detail
LessonCard.tsx           voor wereld-detailpagina
StatusPill.tsx           Niet begonnen / Bezig / Voltooid / Vastgelopen
BadgeDisplay.tsx         schild / kompas / ster, earned of faded
```

## Mockdata

Nieuw bestand `src/data/classroomMock.ts` met exact wat de spec voorschrijft: docent Marieke, school OBS De Regenboog, klas 7A met 28 voornamen, voortgangsverdeling (4 klaar met wereld 1, 15 mid-wereld 1, 9 op les 1-2, klassgemiddelde 23%) en 6 recente activiteiten. Eén deterministische seed zodat avatars dezelfde kleur houden tussen renders.

## Routes

`src/App.tsx` krijgt erbij:

```text
/teacher/login                        TeacherLogin
/teacher                              ClassroomDashboard
/teacher/world/:id                    WorldDetail
/teacher/world/:wid/lesson/:lid       LessonDetail (stub)
/teacher/class/settings               ClassSettings (stub)
/teacher/demo                         LessonDemo (stub)
```

De bestaande `/teacher` (oude TeacherDashboard) wordt vervangen door de nieuwe pagina. De oude `TeacherDashboard.tsx` blijft op schijf staan voor referentie maar wordt niet meer geïmporteerd. Login blijft via Supabase op `/auth?teacher=1`; `/teacher/login` is de nieuwe visuele entree die direct doorlinkt naar dat formulier zodat we geen tweede auth-systeem creëren.

## Layout dashboard, ASCII

```text
+----------------------------------------------------------+
| AI Smart Classroom                Marieke ▾  OBS Regenboog|
+----------------------------------------------------------+
| Goedemorgen, Marieke. Je klas is 23% door wereld 1.      |
| ( VEILIG ●━━━━ SLIM ○━━━━ STERKER ○ )                    |
+--------------------------------------+-------------------+
| Klas 7A, 28 leerlingen               | Vandaag          |
| [SM][JS][MI][NO][SA][EM][LM][LU]...  | Les 11 WIE-WAT   |
| (klik avatar -> sidepanel)            | [Open slides]    |
|                                      +-------------------+
| WERELDEN                              | Ouder-update     |
| [VEILIG #3B82F6] [SLIM #F59E0B] [STERKER #EF7C42]        |
| 4/8 done   1/8 done   0/8 done       | Off-screen        |
+--------------------------------------+-------------------+
| Laatste activiteit                                       |
| Jesse, badge Schild verdiend, 2 min geleden              |
| Mila, voltooide les 7, 14 min geleden                    |
| Noah, 3e poging les 5, 1 uur geleden  (warning)          |
+----------------------------------------------------------+
```

## Interactiedetails

- Avatar-klik opent `<Sheet side="right">` met leerlingdetail (badges, timeline 10 lessen, "Stuur reminder" en "Download rapport" als knoppen, beide nog visueel-only).
- "Stuur reminder" opent `<Dialog>` met voorgevuld NL-bericht, bewerkbaar, knop "Verstuur" toont toast.
- Progress bars en journey-cirkels animeren in via een simpele CSS-transition op `width`/`stroke-dashoffset` bij mount, geen extra dependency. Subtiele goud-shimmer op verdiende badges via een bestaande keyframe in `index.css`.
- Mobiel onder 768px: avatar-grid wordt 6 kolommen, action tiles stapelen onder activity feed, journey wordt verticaal.

## Tekst- en stijlregels

- Alles in NL, jij-vorm.
- Geen em-dashes, ook niet in mock-activiteiten ("Jesse, badge verdiend" met komma).
- Korte zinnen, geen jargon.
- Decimale komma waar nodig.

## Wat ik bewust NIET doe

- Geen nieuwe `/login`-route die concurreert met de bestaande `/auth`. De spec's `/login` wordt `/teacher/login` en linkt door.
- Geen Supabase-werk in iteratie 1, alleen mockdata.
- Geen aanpassingen aan kid-app design tokens, kid-pagina's of curriculum-content.
- Geen nieuwe DB-tabellen of migrations.

