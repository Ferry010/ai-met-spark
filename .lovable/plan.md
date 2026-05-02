# P0 implementatieplan voor v1 launch

We focussen volledig op de leerling + ouder flow. Teacher/school dashboards blijven staan zoals ze zijn (mock/binnenkort) en komen pas in een latere release. Hieronder wat ik concreet ga bouwen, in de volgorde waarin het logisch is om te releasen.

## 1. Echte voortgang per gebruiker

Nu wordt voortgang her en der lokaal afgeleid. We hebben al een `user_progress` tabel met RLS. Die ga ik consequent gebruiken.

- Nieuwe hook `useUserProgress()` die alle rijen voor `auth.uid()` ophaalt en cached via React Query.
- Bij afronden van een les in `LessonPage` → `upsert` in `user_progress` (`lesson_id`, `stars`, `completed_at`). Conflict op `(user_id, lesson_id)` zodat herhalen het record bijwerkt.
- `Dashboard`, `WorldPage` en `Certificate` lezen voortgang uit deze hook in plaats van uit lokale state / mock.
- Wereld is "voltooid" als alle lessen van die wereld een rij hebben.
- Eindtoets pas zichtbaar als alle werelden voltooid zijn.

Schemawijziging: unieke index op `user_progress(user_id, lesson_id)` zodat upsert werkt. Migratie nodig.

## 2. Betaalmuur die echt iets afsluit

verwijder allemaal rondom betalen. De app is en blijft volledig gratis. 

## 3. Ouder-flow: e-mail bij voltooiing wereld + diploma

Nu hebben we `parent_email` op het profiel maar er gebeurt niks mee.

- Auth-email infra opzetten (Lovable Emails) zodat we vanaf eigen domein kunnen sturen. Tijdens setup vraag ik je om het domein in te vullen.
- Edge function `notify-parent` (geen JWT vereist intern, wel server-side validatie via service role): verstuurt mail naar `parent_email`.
  - Trigger 1: bij eerste `user_progress` insert van laatste les van een wereld → "je kind heeft wereld X afgerond".
  - Trigger 2: bij aanmaken `certificates` rij → "je kind heeft het diploma behaald" + link naar pdf.
- Aanroep gebeurt vanuit de client direct na de upsert (eenvoudig en goed genoeg voor v1). Idempotentie via `lesson_id` check zodat dubbele triggers niks doen.
- Templates in NL, witte achtergrond, Spark-branding (oranje accent, Fraunces voor heading).

## 4. Account opschonen voor leerlingen

Nu staat in `Account.tsx` nog logica die taal-keuze en andere zaken aanstuurt die we niet meer willen.

- Velden tonen: voornaam, leeftijd, e-mail ouder. Alle drie editable.
- "Wachtwoord wijzigen" knop die Supabase password reset triggert.
- "Account verwijderen" knop (edge function `delete-account` met service role) die alle eigen data wist en uitlogt.
- Geen taalkeuze meer (al weg), geen dashboards-switch voor gewone leerlingen.

Edge function nodig: `delete-account`.

## 5. Pricing pagina afmaken

- Knoppen koppelen aan `create-checkout` (al bestaand) met de juiste `priceId` lookup keys.
- Duidelijke "1 gratis proefles, daarna eenmalig X" copy.
- School-kaart blijft "neem contact op" → `/schools/contact`.

## 6. Diploma pdf echt genereren

Nu wordt het diploma alleen als HTML/scherm getoond. We willen een echte pdf in de `certificates` bucket.

- Edge function `generate-certificate` (puppeteer-vrij, gewoon `pdf-lib` of `jspdf` via npm in Deno) die een eenvoudige A4 pdf maakt met naam, datum, score.
- Upload naar `certificates/<user_id>/diploma.pdf`.
- `attach_certificate_pdf` rpc (bestaat al) wordt aangeroepen om het pad te koppelen.
- "Download diploma" knop op `/certificate` haalt signed url op.

## Volgorde van releasen

```text
week 1  →  punten 1, 2, 4, 5   (kern leerling + betaling + account)
week 2  →  punten 3, 6         (ouder-mail + echte pdf diploma)
```

Dit is een grote brok werk. Ik stel voor dat we beginnen met **punten 1 + 2 in deze ronde** (echte voortgang + betaalmuur) want dat is de fundering waar de rest op leunt. Daarna pak ik in een volgende ronde 4 + 5 op, en als laatste 3 + 6.

## Technische details

- Migratie: `CREATE UNIQUE INDEX IF NOT EXISTS user_progress_user_lesson_idx ON public.user_progress(user_id, lesson_id);`
- React Query keys: `['user-progress', userId]`, invalidate na les-afronding.
- `useAuth` profile refetch toevoegen (`refetchProfile()`) voor checkout-success flow.
- Edge functions die nieuw komen: `notify-parent`, `delete-account`, `generate-certificate`. Allemaal volgen het bestaande patroon (CORS, zod validatie, service role waar nodig).
- Geen wijziging aan teacher/admin code in deze ronde.

Akkoord? Dan begin ik met de eerste twee punten (voortgang + betaalmuur) zodra je goedkeurt.