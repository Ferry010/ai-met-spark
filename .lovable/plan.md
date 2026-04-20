

# Spark als kick-off in elke les

Spark krijgt een opvallende, geanimeerde entree bij de start van elke les. In plaats van het huidige statische "happy" Spark-icoontje op de intro-stap, vliegt Spark binnen, zwaait, en kondigt de les aan met een typewriter speech-bubble. Daarna wordt de "Kom op!" knop pas zichtbaar.

## Wat de leerling ziet

Op de intro-stap van elke les (de eerste kaart die `LessonRunner` toont):

1. **0.0s**: Lege kaart met alleen de titel zichtbaar (fade-in)
2. **0.2s**: Spark vliegt binnen vanuit links-onder, schaalt op naar normaal formaat met een lichte bounce. Antenne pulseert.
3. **0.7s**: Spark zwaait kort (arm wuift 2x).
4. **1.0s**: Speech-bubble pop't naast Spark omhoog ("scale-in" + tail).
5. **1.0s -> ~3s**: `sparkIntro`-tekst typt zich uit (bestaande `SparkBubble` typewriter), bv. "Hoi! Klaar voor les 1.3? Vandaag leer je over deepfakes."
6. **na typewriter klaar**: "Kom op!" knop fade-in onder de bubble.

Tikken op de bubble slaat het typen over (bestaand gedrag van `SparkBubble`).

## Technische uitvoering

### a) Spark krijgt een nieuwe `mood: "entering"` + waving variant
In `src/components/Spark.tsx`:
- Extra `waving?: boolean` prop. Als true: rechterarm tekent als opgeheven (lijn van schouder omhoog naar handje rechtsboven), met een korte CSS-animatie `spark-wave` (transform-origin op de schouder, rotate -15deg <-> +15deg, 2 cycles dan stop).

### b) Nieuwe keyframes in `src/index.css`
```css
@keyframes spark-fly-in {
  0%   { opacity: 0; transform: translate(-40px, 30px) scale(0.6) rotate(-8deg); }
  60%  { opacity: 1; transform: translate(0, -6px) scale(1.05) rotate(2deg); }
  100% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); }
}
@keyframes spark-wave {
  0%, 100% { transform: rotate(-10deg); }
  50%      { transform: rotate(20deg); }
}
@keyframes bubble-pop {
  0%   { opacity: 0; transform: scale(0.7) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
```
Plus utility-classes `.animate-spark-fly-in` (0.6s ease-out, runs once), `.animate-spark-wave` (0.5s × 2), `.animate-bubble-pop` (0.35s 0.8s ease-out both).

### c) Nieuwe `LessonKickoff` sub-component in `src/components/LessonRunner.tsx`
Vervangt de huidige inline intro-`section`. Beheert de eigen mini-state machine met `setTimeout` of CSS animation-delays:
- `phase: "fly" | "wave" | "talk" | "ready"`
- Kaart blijft hetzelfde gekleurde pillar-kaart (`PILLAR_BG[lesson.pillar]`).
- Spark gerenderd met `animate-spark-fly-in`; na 0.6s krijgt de arm `animate-spark-wave`.
- Bubble verschijnt met `animate-bubble-pop` (delay 0.8s) en gebruikt bestaand `SparkBubble` met `lesson.sparkIntro ?? "Klaar voor de volgende stap? Tik op Kom op!"`.
- "Kom op!" knop heeft `opacity-0 animate-fade-in` met delay gelijk aan typewriter-duur (`text.length * 18ms + 400ms`).
- `prefers-reduced-motion`: alle animaties uit, alles meteen zichtbaar (mediaquery in CSS).

### d) Geen impact op andere stappen
Theory, fact, summary, quiz blijven exact zoals nu. De kick-off speelt alleen op stap `intro`, dus elke les start ermee, ook bij overrides en in de admin preview.

## Bestanden

**Aangepast**
- `src/components/Spark.tsx` — `waving` prop + arm-render
- `src/components/LessonRunner.tsx` — intro-stap vervangen door nieuwe `LessonKickoff` sub-component
- `src/index.css` — 3 nieuwe keyframes + utility-classes + `prefers-reduced-motion` block

**Niet aangeraakt**
- `SparkBubble.tsx` (bestaande typewriter is precies wat we nodig hebben)
- Lesson data, routing, admin editor

## Wat ik bewust NIET doe

- Geen geluid (kan later, vraagt user-gesture + asset).
- Geen herhaling van de kick-off binnen een sessie als je dezelfde les opnieuw opent — speelt elke keer dat de intro-stap mount, simpel en voorspelbaar.
- Geen kick-off op de admin-preview "jump to step" als je direct naar quiz springt; alleen op echte intro.

