
# CTA-copy aanpassen zodat gratis permanent voelt

## Doel
De call-to-actions moeten duidelijk maken dat het product gratis is, zonder te klinken als een tijdelijke trial. De combinatie wordt:

- CTA: bijvoorbeeld `Maak gratis account` of `Start hier`
- direct daaronder of ernaast: heel duidelijk dat het `gratis is en gratis blijft`

## Wat er aangepast wordt

### 1) Primaire CTA’s herschrijven
De belangrijkste knoppen worden aangepast van neutrale of mogelijk dubbelzinnige copy naar copy die gratis expliciet benoemt.

Te wijzigen teksten:
- `common.tryFree`
- `landing.ctaPrimary`
- `landing.freeAccess.cta`
- eventueel `pricing.individual.cta`
- eventueel `landing.finalCta.cta`

Voorkeursrichting:
- Nederlands:
  - `Maak gratis account`
  - of `Start hier`
- Engels:
  - `Create free account`
  - of `Start here`
- Spaans:
  - `Crea tu cuenta gratis`
  - of `Empieza aquí`

## 2) Duidelijke geruststelling direct onder de CTA
Onder de hoofdknop komt expliciete ondersteunende copy die zegt dat het niet om een proefperiode gaat.

Beste plek:
- hero-sectie op de landing
- eventueel ook bij de gratis-sectie en laatste CTA

Voorbeeldrichting:
- Nederlands:
  - `Gratis toegang tot alle lessen. Gratis en gratis blijvend.`
  - of `Geen proefperiode, geen betaalmuur. Gratis en gratis blijvend.`
- Engels:
  - `Free access to every lesson. Free now and free to stay.`
- Spaans:
  - `Acceso gratis a todas las lecciones. Gratis ahora y gratis para siempre.`

De bestaande `heroMicroCopy` is hier een logische plek voor.

## 3) Gratis-boodschap consistent maken op alle belangrijke schermen
Niet alleen de hero, maar ook andere conversion-momenten moeten dezelfde boodschap dragen.

Na te lopen teksten:
- landing hero
- header CTA
- free access / pricing teaser
- final CTA
- pricing-pagina student-aanbod

Zo blijft het verhaal overal hetzelfde:
- aanmelden is gratis
- alle lessen zijn gratis
- het blijft gratis
- geen trial / geen verborgen betaalmuur

## 4) Copy aanscherpen zonder visuele onrust
Omdat de viewport mobiel is, wordt de extra gratis-boodschap kort en scanbaar gehouden.

Richtlijn:
- knoptekst maximaal kort houden
- geruststelling in 1 korte regel eronder
- geen lange alinea direct rondom CTA’s

Conceptueel:

```text
[ Maak gratis account ]
Gratis en gratis blijvend. Geen proefperiode.
```

of

```text
[ Start hier ]
Maak gratis een account. Alle lessen blijven gratis.
```

## Bestanden die aangepast worden
- `src/locales/nl.json`
- `src/locales/en.json`
- `src/locales/es.json`

Waarschijnlijk geen structurele componentwijziging nodig, omdat:
- `SiteHeader.tsx` al `common.tryFree` gebruikt
- `Landing.tsx` al CTA + microcopy onder de knop heeft

Alleen als de boodschap visueel niet sterk genoeg overkomt, kan een kleine tekstregel of styling-aanpassing in:
- `src/pages/Landing.tsx`
- `src/components/SiteHeader.tsx`

## Aanbevolen copyrichting
Voor Nederlands sluit dit het best aan bij je feedback:

- Header knop: `Maak gratis account`
- Hero knop: `Maak gratis account`
- Hero microcopy: `Alle lessen zijn gratis. Gratis en gratis blijvend.`
- Free access CTA: `Maak gratis account`
- Final CTA: `Start hier`
- Final CTA subtitle: `Alle lessen zijn gratis en blijven gratis. Maak een account en begin meteen.`

## Acceptatiecriteria
- nergens klinkt de student-CTA nog als een tijdelijke gratis proefperiode
- op de belangrijkste plekken staat expliciet dat het gratis is
- op minstens één prominente plek bij de hero staat duidelijk dat het gratis blijft
- de boodschap blijft kort genoeg voor mobiel
- de gratis-positionering is consistent in NL, EN en ES
