## Goal

1. Use the uploaded MP3 as the click/pop-up sound across the app.
2. Strip emojis and Lucide icons from lesson cards, world tiles, level nodes, and gamified UI — replace them with pure shape/typography game design.

## 1. Sound asset

- Copy `user-uploads://A_Digital_Button_Friendly_Robot_Kid_Friendly_Cheerful.mp3` → `public/sounds/click.mp3`.
- Extend `src/lib/sounds.ts`:
  - Add `playClick()` that plays the MP3 via a pooled `HTMLAudioElement` (3-voice pool to allow rapid re-trigger), respects `unlocked` + `prefers-reduced-motion`, ~0.6 volume.
  - Re-point `playBubblePop()` to the same MP3 (so pop-ups use it too) while keeping the synth fallback if the file fails to load.
- Wire `playClick()` into:
  - `LevelNode` (tap)
  - `IslandTile` (tap)
  - `BossGate` button
  - Quiz answer buttons in `LessonRunner`
  - "Volgende" / "Klaar" / primary CTA buttons in `LessonRunner` and `Dashboard`
  - `SparkTeacher` next-step button

## 2. Remove emojis & icons from gameplay surfaces

Target files: `LevelNode`, `IslandTile`, `BossGate`, `Scoreboard`, `WorldPage`, `Dashboard`, `LessonRunner`, `GameHud`, `AppHeader`.

Replacements (no emojis, no Lucide icons in gameplay UI):

- **LevelNode**: drop `emoji` prop. Show the level number inside the node disc with a chunky display font; state communicated by node color/shape only:
  - Done → filled gold disc with embossed checkmark drawn as SVG path
  - Next → pulsing primary disc with a subtle inner ring
  - Locked → muted slate disc with a drawn padlock SVG (custom, not Lucide)
- **IslandTile**: remove the big centered emoji. Replace with a stylized numeric badge (world index) on the island and the world name in a banner ribbon. Keep organic SVG island shape.
- **BossGate**: remove "🏆 / 🔒". Replace with a custom SVG gate (two pillars + arch) that visually opens when unlocked; locked state shows a drawn keyhole.
- **Scoreboard / GameHud / AppHeader**: replace `Flame`, `Sparkles`, `Star` Lucide icons with small inline SVG glyphs drawn in the same gold/accent palette (gem, flame, star shapes as `<path>`s) so the look is consistent and "drawn", not iconography from a UI kit.
- **LessonRunner**: remove `Check, Star, X, Lightbulb, BookOpen, ListChecks, Clock` icon usage from the lesson chrome. Use:
  - Gemstone progress dots (already SVG) for steps
  - Plain typographic labels for sections ("Les", "Quiz", "Klaar")
  - Correct/wrong feedback as colored shape pulses (green disc / red disc) with no icon glyph
- **WorldPage / Dashboard**: stop rendering `world.emoji` / `lesson.emoji` / `badge.emoji`. Badges become spinning gold coins with the badge initial letter pressed into the coin face.

Data layer (`lessons`, `worlds`, `badges`, overrides table) is left untouched — we just stop reading the `emoji` field in the UI.

## 3. Out of scope

- No DB migration, no copy/text changes beyond removing emoji glyphs already inline in JSX strings.
- Lucide icons inside admin pages, auth pages, and site header navigation stay as-is (those aren't "gameplay" surfaces).

## Technical notes

```text
public/
  sounds/
    click.mp3   ← copied from upload

src/lib/sounds.ts
  + audio pool (3x HTMLAudioElement)
  + playClick()
  + playBubblePop() → uses MP3 with synth fallback

src/components/game/
  LevelNode.tsx   – remove emoji prop, add SVG check / lock
  IslandTile.tsx  – remove emoji, add ribbon + number badge
  BossGate.tsx    – custom SVG gate
  Scoreboard.tsx  – inline SVG gem/flame
src/components/
  GameHud.tsx, AppHeader.tsx – swap Lucide for inline SVG
  LessonRunner.tsx – drop icon imports, shape-only feedback
src/pages/
  WorldPage.tsx, Dashboard.tsx – stop passing/rendering emoji
```
