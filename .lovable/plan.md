

# Soften the palette for an 8-12 kid-friendly feel

The current "Cosmic Playground" works but feels a bit intense for kids ages 8-12. The deep indigo + violet + coral cosmic gradient is dramatic and can read as "moody teen" rather than "playful tween". Let's keep the warm cream foundation but soften the edges so it feels friendly, bright, and inviting (think Bluey, Duolingo, Khan Academy Kids), not nightclub.

## What's too harsh right now
1. **`--gradient-cosmic`**: deep indigo → violet → hot coral. Used on hero badge and final CTA. Very saturated, dark on one end, hot on the other.
2. **Hero badge**: small dark gradient pill that fights with the cheerful cream hero.
3. **Final CTA section**: full-width dark gradient block at the bottom, feels like a different app.
4. **Shadows**: violet-tinted at fairly high opacity (0.38 on `--shadow-pop`), creates heavy "drop" under cards.
5. **Foreground text**: deep indigo `#1A1B4B` at 20% lightness is quite dark. Fine for body, but feels stern in headlines.

## The fix: "Soft Cosmic"

Keep the cream + violet identity. Soften saturation, lighten dark stops, reduce shadow weight.

### Token changes (`src/index.css`)

| Token | Now | New | Why |
|---|---|---|---|
| `--gradient-cosmic` | indigo 28% → violet → coral | lavender → soft violet → peach | Same arc, no dark stop, no hot coral |
| `--gradient-hero` | cream → light lavender → light peach | (slightly brighter, more pastel) | Even airier |
| `--gradient-sky` | lavender → violet | soft sky lavender → light violet | Less saturated |
| `--gradient-sunshine` | warm yellow → gold | pastel butter → warm gold | Friendlier yellow |
| `--gradient-coral` | peach → hot coral | soft peach → warm coral | Less neon |
| `--shadow-pop` | violet 38% opacity | violet 22% opacity | Lighter lift |
| `--shadow-soft` | violet 18% opacity | violet 12% opacity | Subtler |
| `--foreground` | indigo 20% L | indigo 28% L | Softer headline weight, still WCAG AA on cream |
| `--primary` | violet 63% L | violet 66% L | A touch brighter, friendlier |

### Component-level swap (`src/pages/Landing.tsx`)
- **Hero badge**: change from `bg-gradient-cosmic` (dark pill) to `bg-secondary text-secondary-foreground` (sunny gold pill). Reads as a friendly tag, not a moody banner.
- **Final CTA section**: change from `bg-gradient-cosmic` to `bg-gradient-sky` (soft lavender→violet). Still impactful, no dark stop. Keep white text.

### What stays the same
- Cream background, vibrant violet primary, sunny gold secondary, hot coral accent, grass green success.
- All copy, layout, fonts, components.
- Pillar (world) colors stay distinct.
- Dark mode untouched.

## Files to change
- `src/index.css` — gradient + shadow + 2 color tweaks
- `src/pages/Landing.tsx` — 2 className swaps (hero badge, final CTA)

## What I will NOT touch
- Tailwind config, components library, copy, layouts, dark mode tokens, Spark mascot.

