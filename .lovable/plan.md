

# Spark vliegt binnen met jetpack, retro arcade-stijl

Spark krijgt een veel dramatischer entree: hij komt diagonaal de kaart in vliegen vanuit linksonder buiten beeld, met een vlammende jetpack-staart achter zich aan, een korte sonic-boom flits bij het remmen, en stopt dan met een lichte bounce in het midden. Daarna pas zwaait hij en verschijnt de bubble, zoals nu.

Denk: Sonic, Mega Man, Rayman intro-vibes, maar met moderne soft glow en geen pixel-art (Spark blijft zijn ronde SVG-zelf).

## Wat de leerling ziet (timing)

```text
0.0s  Lege kaart, alleen titel
0.1s  WHOOSH-trail: 3 streep-lijnen flitsen diagonaal van linksonder naar midden
0.2s  Spark schiet binnen langs dezelfde diagonaal, lichte motion-blur via skew
      Achter Spark: jet-flame (oranje/geel/wit kegel) die meebeweegt
0.55s Spark "remt af", squash-and-stretch (1.15x breed, 0.9x hoog) + speed-lines verdwijnen
0.65s Sonic-boom ring expandeert vanaf Spark (witte cirkel die opschaalt + fade-out)
0.75s Spark settled in midden, jet-flame krimpt weg en verdwijnt
0.9s  Spark zwaait (bestaand)
1.2s  Bubble pop + typewriter (bestaand)
```

## Technische uitvoering

### a) Nieuw component `SparkJetEntry` in `LessonRunner.tsx`

Wrapper rond de bestaande `<Spark waving={...} />` die de fly-in regisseert. Het is puur een geanimeerde container plus een paar absoluut-gepositioneerde decoratieve SVG/div-laagjes (flame, speed-lines, shockwave-ring) die op timed-delays animeren en dan unmounten/fade-outen.

Structuur:
```text
<div class="relative" >
  <SpeedLines />        // 3 streepjes, animate-spark-speedlines, fade out na 0.6s
  <JetFlame />          // kegel-div met gradient, animate-spark-jet-trail
  <ShockwaveRing />     // cirkel die opschaalt 0->2.5x + fade, na 0.6s delay
  <div class="animate-spark-jet-fly">
     <Spark waving={...} />
  </div>
</div>
```

Na ~1s zet een `useEffect` met timeout `entryDone=true` en renderen we alleen nog `<Spark waving={...} />` zonder de decoratie, zodat de flame niet blijft hangen.

### b) Nieuwe keyframes in `src/index.css`

```css
@keyframes spark-jet-fly {
  0%   { opacity: 0; transform: translate(-180%, 140%) scale(0.5) skew(-12deg, 4deg); }
  55%  { opacity: 1; transform: translate(0, 0) scale(1.15, 0.9) skew(0,0); }
  70%  { transform: scale(0.92, 1.08); }
  85%  { transform: scale(1.04, 0.98); }
  100% { transform: scale(1); }
}
@keyframes spark-jet-trail {
  0%   { opacity: 0; transform: translate(-180%, 140%) scaleX(0.4); }
  40%  { opacity: 1; }
  60%  { opacity: 1; transform: translate(0,0) scaleX(1); }
  80%  { opacity: 0.4; transform: translate(20%, -10%) scaleX(0.2); }
  100% { opacity: 0; }
}
@keyframes spark-speedlines {
  0%   { opacity: 0; transform: translate(-200%, 160%) scaleX(0); }
  30%  { opacity: 1; transform: translate(-50%, 40%) scaleX(1); }
  60%  { opacity: 0; transform: translate(0,0) scaleX(0.6); }
  100% { opacity: 0; }
}
@keyframes spark-shockwave {
  0%   { opacity: 0; transform: scale(0.2); }
  20%  { opacity: 0.7; }
  100% { opacity: 0; transform: scale(2.6); }
}
```

Plus utility-classes met passende `animation` shorthand (delays: speedlines 0.1s, jet-fly 0.15s, shockwave 0.6s).

### c) Jet-flame visueel

Pure CSS/SVG, geen asset. Een afgeronde driehoek-div met een conic of linear gradient `from white via #FFD93C to #FF6B35 to transparent`, blur-sm, mix-blend-screen voor extra glow. Geplaatst achter Spark's onderkant via `position:absolute; right:60%; bottom:30%; transform-origin: right center`.

### d) Speed-lines

3 dunne witte/gele `<div class="h-1 w-16 rounded-full bg-white/80">` met staggered animation-delays (0s, 0.05s, 0.1s) op verschillende y-offsets. Geven het arcade-snelheidsgevoel.

### e) Shockwave-ring

Eén `<div class="absolute inset-0 rounded-full border-4 border-white/70">` die met `spark-shockwave` opschaalt en fade-out, direct nadat Spark "land". Mix-blend-screen voor een filmische flits.

### f) Reduced motion

Alle nieuwe `animate-spark-jet-*` en `animate-spark-speedlines` / `animate-spark-shockwave` worden in het bestaande `@media (prefers-reduced-motion: reduce)` block uitgezet. Spark verschijnt dan instant op zijn plek.

### g) Geen impact op andere stappen

Theory, fact, summary, quiz blijven exact zoals nu. De jetpack-entry vervangt alleen de huidige `animate-spark-fly-in` op de intro-stap. De wave + bubble + "Kom op!"-knop volgen daarna ongewijzigd, met timing-delays iets opgeschoven (wave op 0.9s ipv 0.7s, bubble op 1.2s ipv 1.0s) zodat de entry kan ademen.

## Bestanden

**Aangepast**
- `src/index.css` , 4 nieuwe keyframes + utility-classes + reduced-motion entries
- `src/components/LessonRunner.tsx` , nieuwe `SparkJetEntry` sub-component, vervangt `animate-spark-fly-in` in `LessonKickoff`, timings shift

**Niet aangeraakt**
- `Spark.tsx` (jet-flame is een externe laag, Spark zelf blijft hetzelfde)
- `SparkBubble.tsx`
- Lesson data, andere stappen, admin

## Wat ik bewust NIET doe

- Geen geluid (kan later, vraagt user-gesture).
- Geen permanente jetpack op Spark, alleen bij de intro-entry.
- Geen pixel-art / 8-bit textuur, het blijft Spark's huidige ronde SVG met moderne soft glow.
- Geen herhaling als je terug-navigeert binnen dezelfde stap; speelt 1x bij mount van intro.

