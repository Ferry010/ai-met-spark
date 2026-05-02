
# Volledig Nederlands maken

We halen alle meertaligheid eruit. NL wordt de enige taal. Geen taalkiezer meer, geen EN/ES bestanden, geen taal-detectie.

## Wat er weggaat

- `src/locales/en.json` en `src/locales/es.json` (verwijderen)
- `src/components/LanguageSwitcher.tsx` (verwijderen)
- `src/pages/LanguageSelect.tsx` en de bijbehorende route in `src/App.tsx` (verwijderen)
- Alle imports/gebruik van `LanguageSwitcher` in `SiteHeader`, `AppHeader`, `Footer`, `Account`, etc.
- `localStorage` key `aisk_lang` wordt niet meer gebruikt (oude waarde mag blijven staan, doet niks meer)
- Verwijzingen naar "wissel taal" / "language" in copy (o.a. in `nl.json` bij `pricing.student.features` en `pricing.individual.features`: "Taal wisselen in je account" eruit)

## Wat er blijft

- `react-i18next` blijft staan zodat `useTranslation()` calls in alle pagina's blijven werken zonder dat we overal `t(...)` moeten herschrijven.
- `src/i18n.ts` wordt versimpeld:
  - alleen `nl` als resource
  - `lng: "nl"`, `fallbackLng: "nl"`
  - geen `LanguageDetector`, geen `supportedLngs`, geen `detection`-blok
  - `i18next-browser-languagedetector` import eruit
- `src/locales/nl.json` blijft ongewijzigd qua inhoud, behalve het verwijderen van regels die over taal wisselen gaan.

## UI gevolgen

- Header (mobiel + desktop) toont geen globe/taal-knop meer.
- Eerste bezoek gaat direct naar `/` (Landing) in plaats van `/language`.
- `LanguageSelect` route `/language` wordt een redirect naar `/` (of helemaal weggehaald uit de router).

## Bestanden die ik aanraak

- bewerken: `src/i18n.ts`, `src/App.tsx`, `src/components/SiteHeader.tsx`, `src/components/AppHeader.tsx`, `src/components/Footer.tsx`, `src/pages/Account.tsx` (alleen als daar de switcher staat), `src/locales/nl.json` (kleine copy-cleanup)
- verwijderen: `src/locales/en.json`, `src/locales/es.json`, `src/components/LanguageSwitcher.tsx`, `src/pages/LanguageSelect.tsx`

## Niet-doel

- We raken de lesinhoud (`src/content/lessons.ts`) en audio niet aan; die is al Nederlands.
- We laten `react-i18next` infrastructuur staan zodat er geen grote refactor nodig is. Mocht je later 100% strings inline willen, dan is dat een aparte opruim-klus.

Akkoord? Dan bouw ik dit in één keer om.
