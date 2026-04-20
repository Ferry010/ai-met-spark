

# Make Dutch the default language and fully translate the app

Right now the app supports EN, NL, ES via `i18next`, but `src/locales/nl.json` is **completely empty** (`{}`), so Dutch users see English fallback everywhere. "Full Dutch first" means: ship a complete Dutch translation AND make Dutch the default experience.

## What I'll do

### 1. Translate everything into Dutch
Mirror every key from `src/locales/en.json` into `src/locales/nl.json` with natural, kid-friendly Dutch (tutoyeren, "je/jij", warm and playful tone matching the 8-12 audience). Same applies to `es.json` if it has gaps, but Dutch is the priority.

Tone rules for the Dutch copy:
- Address kids directly with "je" (never "u").
- Keep it playful and energetic, like Bluey or Squla.
- No em-dashes (per existing project rule), use periods or commas.
- Keep brand name "AI Smart Kids" untranslated.
- Keep prices in euros as-is (€14).

### 2. Make Dutch the default language
In `src/i18n.ts`:
- Change `fallbackLng` from `"en"` to `"nl"`.
- Reorder detection so the saved choice still wins, but if nothing is saved we default to NL instead of browser language. Detection order becomes `["localStorage"]` with NL fallback, so first-time visitors land in Dutch.
- Keep EN and ES selectable via the existing `LanguageSwitcher`.

### 3. Update the language-select splash
`src/pages/LanguageSelect.tsx` currently shows three greetings joined with " · ". Reorder so Dutch appears first and the Dutch greeting leads. Reorder the `LANGS` array to NL, EN, ES.

### 4. Update the `<html lang>` attribute
`index.html` has `lang="en"`. Change to `lang="nl"` so screen readers and SEO see Dutch as primary.

### 5. Sweep hard-coded English strings
Quick scan of pages that may have inline English not yet keyed through `t()`. If I find any user-facing English literals in `Landing.tsx`, `Pricing.tsx`, `Footer.tsx`, `SiteHeader.tsx`, `Auth.tsx`, `Dashboard.tsx`, `LessonPage.tsx`, `Account.tsx`, etc., I'll either:
- Add a translation key and wire it up, or
- Replace the literal with the Dutch equivalent if it's a one-off.

I'll prioritize the highest-traffic surfaces (landing, pricing, header, footer, auth, dashboard) and any visible buttons or labels.

## Files I'll change
- `src/locales/nl.json` — full Dutch translation (mirror of en.json).
- `src/locales/es.json` — fill any gaps so ES doesn't regress.
- `src/i18n.ts` — `fallbackLng: "nl"`, detection tweak.
- `src/pages/LanguageSelect.tsx` — NL first in the list.
- `index.html` — `lang="nl"`.
- Any page with inline English strings discovered during the sweep.

## What I will NOT touch
- Color tokens, layouts, components, backend, payments, lessons logic, routes.
- The `LanguageSwitcher` itself (already supports all three).
- Lessons content data (`src/content/lessons.ts`) unless it contains user-facing English that needs Dutch. I'll check it and translate if so, otherwise leave it for a follow-up since lesson content can be substantial.

## One thing to confirm
Lesson content in `src/content/lessons.ts` may be large and English-only. Two options:
- **A) Translate lesson content too** as part of this pass (bigger change, fully Dutch experience end to end).
- **B) Translate UI chrome only** now, leave lesson body copy for a dedicated follow-up.

If you don't say otherwise I'll go with **A** so "full Dutch" really means full.

