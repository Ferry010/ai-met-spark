
The user wants a friendlier, more kid-tuned H1 than "Leer AI gebruiken als een pro!". Their suggestion "Leer veilig en leuk AI gebruiken" is good but a bit flat. Let me propose a few options and pick a default.

## Options for the new H1

- **A) "Leer veilig én leuk met AI"** — short, two key promises (safe + fun), playful with the accented "én".
- **B) "Word een AI-superheld!"** — energetic, hero framing, fits the "superpowers" theme already in the site.
- **C) "Ontdek AI op een veilige, leuke manier"** — closer to user's phrasing, calm and reassuring.
- **D) "Leer slim, veilig en leuk omgaan met AI"** — covers all three pillars (Slim, Veilig, Sterker).

**My pick: A** — punchy, kid-friendly, mirrors the safe+fun vibe, fits the existing pillar copy, and stays short enough for the big hero display type.

Also update the matching `tagline` in `common.tagline` (used elsewhere) so the brand line stays consistent.

## Changes

**`src/locales/nl.json`**
- `landing.heroTitle`: "Leer AI gebruiken als een pro!" → **"Leer veilig én leuk met AI"**
- `common.tagline`: "Leer AI gebruiken als een pro!" → **"Leer veilig én leuk met AI"**

That's it. No component changes, no layout, no tokens. Two string swaps.

If you'd rather pick B, C, or D, tell me which and I'll use that instead.
