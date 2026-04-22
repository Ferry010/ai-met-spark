
# Gratis maken + mobiele responsiveness verbeteren

## Doel
De app wordt volledig gratis, zonder betaalmuur of prijslogica, en de mobiele leservaring wordt aangescherpt zodat schermen zoals in je screenshot niet meer te krap of onhandig aanvoelen.

## Wat er aangepast wordt

### 1) Alle betaalflow verwijderen uit de student-app
De huidige app bevat nog meerdere sporen van betaalde toegang:

- `LessonPage.tsx` blokkeert lessen op basis van `profile.paid`
- `Dashboard.tsx` toont vrijspeel-knoppen en checkout-success logica
- `WorldPage.tsx` vergrendelt lessen behalve de eerste
- `PaywallDialog.tsx` en Stripe-checkout zijn nog onderdeel van de UI

Dat wordt omgezet naar volledig gratis gedrag:

- alle lessen zijn direct toegankelijk
- geen paywall-dialog meer in student routes
- geen “speel alles vrij”, “unlock”, of checkout-success messaging meer
- bestaande progressie- en lesvoltooiing blijft gewoon werken

### 2) Copy herschrijven van betaald naar gratis
De marketing- en productcopy wordt aangepast zodat die klopt met een gratis product.

Waarschijnlijk in:
- `src/locales/nl.json`
- `src/locales/en.json`
- `src/locales/es.json`
- mogelijk `Landing.tsx` / `Pricing.tsx` waar layout of secties veranderen

Aanpassingen:
- “€14”, “eenmalig”, “unlock”, “pricing”, “free first lesson” vervangen
- CTA’s veranderen naar gratis onboarding, bijvoorbeeld:
  - “Start gratis”
  - “Maak een account”
  - “Begin met les 1”
- pricing teaser en pricing page ombouwen naar:
  - gratis productpositionering
  - of een eenvoudige “voor scholen / contact” infopagina als die schoolflow moet blijven bestaan

### 3) Routing en componenten opschonen
De gratis versie vraagt ook om structurele cleanup:

- `PaywallDialog` uit student-flow halen
- eventuele Stripe-afhankelijkheid in frontend niet meer aanroepen
- `LessonPage`, `Dashboard`, `WorldPage` vereenvoudigen
- checken of background audio en overige routegedrag intact blijven zonder paywall-open/close flows

## Mobiele responsiveness verbeteren

## Probleem uit je screenshot
De leskaartjes op mobiel zijn te smal/druk opgebouwd:
- lange labels breken onhandig af
- keuze-buttons staan naast de tekst terwijl daar te weinig ruimte voor is
- kaartinhoud krijgt een geperste layout
- algemene spacing op lesson-schermen is krap voor small screens

Dit zit vooral in `LessonRunner.tsx`, met name in de interactieve lesvarianten.

### 4) Sort / keuze-kaarten mobiel herontwerpen
Voor interactieve kaarten zoals “Dit is AI / Dit is geen AI” wordt de mobiele layout aangepast.

Huidige probleem:
- tekst links + twee buttons rechts in één rij
- op small screens wordt de tekstkolom extreem smal

Nieuwe aanpak:
- op mobiel kaartinhoud stapelen
- eerst de tekst full-width
- daaronder de antwoordknoppen
- op grotere schermen mag het weer compacter naast elkaar staan

Conceptueel:

```text
Mobiel
[ vraagtekst over volle breedte ]
[ knop 1 ]
[ knop 2 ]

Desktop
[ vraagtekst ........ ] [ knop 1 ] [ knop 2 ]
```

Dit geldt vooral voor:
- `SortBuckets`
- mogelijk ook `MultiChoice` / `TapReveal` waar nodig voor consistentie

### 5) Lespagina zelf mobiel luchtiger maken
In `LessonPage.tsx` en `LessonRunner.tsx` wordt de mobiele spacing verfijnd:

- kleinere containerbreedte en betere zijpadding op mobiel
- progress bar + step header iets compacter
- card paddings responsiever maken
- lange titels/instructies betere line-height en wrapping geven
- CTA-knoppen full-width op mobiel waar dat prettiger voelt

### 6) Header en back-link gedrag op mobiel nalopen
In je screenshot is de topzone vrij krap. Daarom wordt ook gekeken naar:

- `AppHeader.tsx`
- back-link in `LessonPage.tsx`

Verbeteringen:
- veiligere wrapping/truncation van langere tekst
- iets betere verticale ritmiek
- zorgen dat lesson-content niet te dicht onder de header begint op kleine schermen

## Technische aanpak

### Bestanden die waarschijnlijk aangepast worden
- `src/pages/LessonPage.tsx`
- `src/components/LessonRunner.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/WorldPage.tsx`
- `src/components/PaywallDialog.tsx` (verwijderen of uitfaseren)
- `src/pages/Pricing.tsx`
- `src/pages/Landing.tsx`
- `src/locales/nl.json`
- `src/locales/en.json`
- `src/locales/es.json`

### Concreet te verwijderen of wijzigen
- checks op `profile.paid`
- paywall state en dialog mounts
- unlock CTA’s
- checkout success toast / URL handling
- prijsvermeldingen en pricing-copy
- lesson interaction row layouts die mobiel breken

## Verwacht resultaat
Na deze wijziging:

- de app voelt overal duidelijk gratis
- alle lessen zijn direct beschikbaar
- er verschijnt nergens meer een betaalmuur in de student-flow
- pricing/landing-copy klopt met de nieuwe positionering
- lesson cards en keuzevakken zijn op mobiel veel beter leesbaar en bruikbaar
- lange labels zoals in je screenshot krijgen voldoende ruimte en nette stacking

## Acceptatiecriteria
- gebruiker kan zonder betaling van dashboard naar alle werelden en lessen
- lesson pages openen zonder paywall of redirectgedrag
- geen student-facing copy meer met €14 / unlock / vrijspelen
- landing/pricing-pagina’s vertellen een gratis verhaal
- interactieve lesson cards tonen op mobiel geen geplette tekst-knop-layout meer
- screenshot-achtig scherm voelt leesbaar, ruim en logisch op kleine telefoons
