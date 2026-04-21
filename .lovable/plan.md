

# Spark in de hero meer tot leven brengen

Spark krijgt meer karakter in de hero, zonder dat het ontwerp verandert. Subtiele lagen extra leven, geen nieuwe stijl.

## Wat de gebruiker ziet

- Spark **zwaait** vrolijk (rechterarm omhoog, animatie loopt al in `Spark.tsx` via `waving`).
- Een zachte **glow-pulse** achter Spark — de bestaande blur-cirkel ademt rustig in/uit.
- **Sparkles** (kleine sterretjes) die om Spark heen twinkelen op willekeurige posities, met staggered fade/scale.
- De **antenne-bol** pulseert iets levendiger (al aanwezig, blijft).
- Spark **drijft** iets uitgesprokener (bestaande `animate-float` blijft, geen nieuwe beweging).
- Het tekstballonnetje "Hoi! Ik ben Spark…" krijgt een lichte **bounce-in** bij load en een subtiele hover-tilt.

Geen kleur-, layout- of typografische wijzigingen. Alles blijft binnen de bestaande design tokens.

## Technische uitvoering

**`src/pages/Landing.tsx`** (hero-blok rond Spark):
- Voeg `waving` toe aan `<Spark size={280} mood="happy" waving />`.
- Wrap Spark + glow in een container met 3–5 absoluut gepositioneerde `<Sparkle />`-elementen (kleine SVG-sterretjes uit `lucide-react`, `Sparkles` of inline `<svg>`), elk met eigen `animationDelay` voor stagger.
- Glow-div krijgt `animate-pulse-slow` (nieuwe keyframe) i.p.v. statische blur.
- Tekstballon krijgt `animate-fade-in` + `hover:-rotate-1 transition-transform`.

**`tailwind.config.ts`**:
- Nieuwe keyframes `pulse-slow` (opacity/scale 1 → 1.1 → 1, 3s) en `twinkle` (opacity 0 → 1 → 0 + scale 0.6 → 1 → 0.6, 2s).
- Animation utilities `animate-pulse-slow` en `animate-twinkle`.

**`src/components/Spark.tsx`**: geen wijziging nodig — `waving` bestaat al.

## Bestanden

- `src/pages/Landing.tsx` — hero Spark-container uitbreiden met sparkles + waving prop
- `tailwind.config.ts` — twee nieuwe keyframes + animation utilities

## Wat ik bewust NIET doe

- Geen wijziging aan `Spark.tsx` zelf (mascotte blijft identiek, herbruikbaar overal).
- Geen extra libraries (framer-motion o.i.d.) — pure Tailwind keyframes.
- Geen geluid of klik-interactie toevoegen.

