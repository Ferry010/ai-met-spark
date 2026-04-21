

# Fix: copy mismatch + dubbele dialog-close

Twee kleine fixes voor de admin lesson-preview en Wereld 1 content.

## Wat de gebruiker ziet

1. **Les 1.1 oefening**: prompt verandert van "Sleep elk kaartje naar de juiste zone…" naar "Tik elk kaartje aan en kies de juiste zone…", zodat de tekst klopt met de tap-to-sort UI. Ik check ook de andere `sortBuckets` prompts in Wereld 1/2/3 op hetzelfde "sleep"-woord en pas die in één keer aan voor consistentie.
2. **Lesson preview dialog**: het dubbele kruisje verdwijnt. De ingebouwde X van Radix (rechtsboven, uit `DialogContent`) blijft staan; de extra "Sluit" knop in de admin-toolbar wordt verwijderd. Eén duidelijke close knop, geen verwarring.

## Technische uitvoering

**`src/content/lessons.ts`** — vervang in elke `sort(...)` prompt het werkwoord "Sleep" door "Tik" (of vergelijkbaar passend bij de bucket-keuzes). Inhoud van items/buckets blijft identiek.

**`src/components/admin/LessonPreviewDialog.tsx`** — verwijder de toolbar-Button met `<X />` + "Sluit". `DialogContent` heeft al een eigen close-X rechtsboven, dus de dialog blijft sluitbaar (X, ESC, klik buiten).

## Bestanden

- `src/content/lessons.ts` — prompts in `sort(...)` aanpassen
- `src/components/admin/LessonPreviewDialog.tsx` — extra Sluit-knop verwijderen

## Wat ik bewust NIET doe

- Geen echte drag-and-drop bouwen — de huidige tap-flow werkt prima op mobiel en is toegankelijker. Alleen de copy aanpassen.
- Geen wijziging aan `DialogContent` (gedeelde shadcn-component). De fix zit in de admin-dialog zelf.

