

# Refresh the color scheme for better readability and immersion

The current palette uses a very pale sky-blue background (`#F5F9FF`) with sky-blue primary buttons. Two problems:
1. **Readability**: light blue on light blue washes everything out. Body text on cards lacks contrast.
2. **Vibe**: it feels flat and clinical, not "immersive". Kids should feel like they walked into a bright, magical AI lab.

## New direction: "Cosmic Playground"

Keep the playful, kid-friendly soul but add depth, warmth, and contrast. Think Duolingo meets a Pixar sky.

### New palette (all HSL tokens in `index.css`)

| Token | Old | New | Why |
|---|---|---|---|
| `--background` | pale blue `#F5F9FF` | warm cream `#FFF8EC` | Easier on eyes, makes colors pop, feels cozy |
| `--foreground` | dark blue-grey | deep indigo `#1A1B4B` | Stronger contrast for reading |
| `--primary` | sky blue `#4FC3F7` | vibrant violet `#6C5CE7` | More energetic, distinctive, accessible on cream |
| `--primary-glow` | light sky | lavender glow | Matches new primary |
| `--secondary` | yellow `#FFD54F` | sunny gold `#FFC93C` | Slightly deeper for contrast on cream |
| `--accent` | coral `#FF8A65` | hot coral `#FF6B6B` | Punchier |
| `--success` | mint green | grass green `#4ADE80` | Clearer "win" signal |
| `--card` | white | white (kept) | Cards still pop on cream |
| `--muted` | pale blue | warm beige `#F5EFE0` | Harmonizes with cream |

### Pillar (world) colors stay distinct
- **Safe**: deeper ocean teal for trust
- **Smart**: keep gold, slightly warmer
- **Stronger**: keep hot coral

### Dark mode becomes a real "night sky"
Deep midnight indigo background with the same vibrant violet primary glowing on top. More immersive than the current generic dark.

### Gradients (the "immersive" lift)
- **Hero**: cream → soft lavender → peach (warm sunrise) instead of flat blue wash
- **Sky**: violet → lavender (matches new primary)
- **New "cosmic"** gradient: deep indigo → violet → coral, used on the final CTA section and hero badge

### Shadows
Tinted shadows using the new violet (instead of blue) so depth feels intentional. Slightly stronger `--shadow-pop` for more lift on buttons and cards.

## Files I'll change

- `src/index.css` only. Every component uses semantic tokens, so the entire app recolors from this single file. Spark mascot restyles automatically through its existing `--spark` tokens.

## What I will NOT touch
- Component code, Tailwind config, fonts, layouts, copy.

## Two flavor choices to confirm

**Primary color vibe:**
- A) Vibrant violet `#6C5CE7` (recommended) — magical, modern, pairs beautifully with cream
- B) Deep teal `#0EA5A5` — calm, sea-adventure feel, less playful
- C) Punchy magenta `#E11D74` — maximum juice, may feel intense

**Background warmth:**
- A) Warm cream `#FFF8EC` (recommended) — cozy, best text contrast, children's-book feel
- B) Soft lavender `#F5F2FF` — dreamier, pairs naturally with violet
- C) Pure white — cleanest, loses cozy feeling

If you don't specify, I'll go with **violet primary + cream background**.

