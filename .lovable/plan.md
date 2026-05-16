## Doel

De drie interactieve componenten in `src/components/LessonRunner.tsx` vervangen door de verfijnde versies uit de geüploade `interactive.tsx`. Diploma en lescontent blijven ongemoeid.

## Wat verbetert er voor de leerling

- **DragOrder**: echte drag-and-drop op mobiel én desktop via `framer-motion` `Reorder` (nu zijn het op/neer knoppen).
- **SpotTheRed**: rode-vlag fragmenten zijn klikbaar binnen de leestekst zelf, met onthulling van gemiste vlaggen na inzenden (nu losse chips).
- **PromptBuilder**: live preview van de gebouwde prompt + voortgangsbalkjes met label ("Topprompt" / "Vage prompt" / "Middelmatig").

## Wijzigingen

### 1. `src/components/LessonRunner.tsx`
Vervang de drie bestaande inner componenten (`DragOrder`, `SpotTheRed`, `PromptBuilder`, regels ~771-end) door de geüploade implementaties, aangepast aan de bestaande interface:

- Behoud de huidige props-shape: `{ step: Extract<InteractiveStep, {kind:"..."}>, onDone: () => void }`. Vertaal de uploaded `data` + `onComplete(correct)` naar `step` + `onDone()`.
- Behoud bestaande geluids- en gamificatie-hooks die `LessonRunner` al rond `onDone` heeft (correct/wrong-tonen blijven via de wrapper waar nodig).
- Importeer `Reorder` toevoegen aan de bestaande `framer-motion` import.

### 2. Kleuren naar design tokens
De upload gebruikt vaste Tailwind kleuren (`slate-900`, `emerald-50`, `rose-200`, `amber-200`, `sky-50`). Vervangen door semantic tokens uit `index.css` / `tailwind.config.ts`:

| Gebruikt in upload          | Vervang door                                |
|-----------------------------|---------------------------------------------|
| `slate-900` (primary action)| `bg-primary text-primary-foreground`        |
| `slate-50/100/200` (borders/bg) | `bg-muted` / `border-border`            |
| `slate-700/800` (text)      | `text-foreground` / `text-muted-foreground` |
| `emerald-*` (correct)       | `bg-success/10 border-success text-success` |
| `rose-*` (incorrect / red flag) | `bg-destructive/10 border-destructive text-destructive` |
| `amber-*` (tapped, neutraal)| `bg-accent/20 border-accent text-accent-foreground` |
| `sky-*` (info)              | `bg-secondary/20 border-secondary text-secondary-foreground` |

Als `--success` nog niet bestaat in `index.css`, voeg ik een HSL token toe (groen, werkt licht/dark) en map het in `tailwind.config.ts`. Geen andere kleuren aanraken.

### 3. Geen wijzigingen aan
- `src/content/lessons.ts` (content is al up-to-date)
- `src/pages/Certificate.tsx` (PDF-diploma blijft)
- Andere interactives (`multiChoice`, `tapReveal`, `sortBuckets`) blijven exact zoals nu

## Technische details

- `framer-motion` `Reorder.Group` / `Reorder.Item` zit al in de geïnstalleerde versie, geen nieuwe dependency.
- `useMemo`-shuffle bij mount voorkomt re-shuffle bij re-render; safeguard zwapt twee items als shuffle toevallig identiek is aan correcte volgorde.
- `SpotTheRed` werkt mits elk `fragment` uniek voorkomt in `message` (geldt voor alle huidige lessen — check ik bij implementatie).
- Bestaande `onDone` wordt gefired zodra de leerling op "Check" / "Klaar" klikt, ongeacht correct. Dit matcht het bestaande gedrag van de andere interactives.

## Out of scope

- Diploma upgrade (gebruiker koos: laat huidige PDF staan)
- Lessenlijst aanpassen
- Andere visuele refactors van LessonRunner