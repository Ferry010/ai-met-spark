

# Beef up the copy and add real juice

The landing and pricing pages are too thin right now. They tell visitors *what* the product is, but they don't sell the transformation, explain *how* it works, or build trust. Let's fix that with much more copy, more energy, and zero em-dashes anywhere.

## Copy rules I'll follow everywhere
- No "—" character anywhere. Use periods, commas, "and", "or", colons, parentheses, or two short sentences instead.
- Punchy, kid-friendly, parent-trusting voice.
- Active verbs, short sentences, vivid words ("zap", "level up", "decode", "outsmart").
- Numbers and specifics over vague claims (12 lessons, 5 minutes a day, 3 worlds, 36 mini-quizzes).

## New landing page sections (in order)

1. **Hero** (rewritten)
   Bigger promise. New subhead, new microcopy under the buttons ("No credit card to try Lesson 1. 60 seconds to start."), and a row of 3 trust chips ("GDPR safe", "No AI chat for kids", "Loved by parents").

2. **The problem** (NEW section)
   "Your kid is already using AI. Are they using it well?" Three short paragraphs about why kids need this now: AI is everywhere, schools aren't teaching it yet, and the wrong habits stick fast.

3. **What's inside** (NEW section)
   Visual breakdown: 3 Worlds, 12 Lessons, 36 Mini-Quizzes, 1 Certificate. Each with one juicy sentence describing what kids actually do.

4. **The 3 superpowers** (expanded pillars)
   Each pillar gets a longer description, a "Kids will learn to..." bullet list of 3 concrete skills, and a sample lesson title preview.

5. **How a lesson works** (NEW section)
   5 numbered steps with icons: Meet Spark → Discover → Play → Quiz → Earn your star. Reassures parents this isn't a chatbot or a video dump.

6. **Why parents pick AI Smart Kids** (NEW, replaces tiny parents block)
   6-card grid: No chat with AI, Hand-written by educators, GDPR and COPPA friendly, Works on any device, 5 minutes a day, Money-back guarantee.

7. **Social proof / quote** (NEW)
   One big punchy quote-style block ("Finally, AI for kids that doesn't feel like a creepy chatbot.") with a "Built with teachers and parents in the Netherlands" line. Uses placeholder voices since there are no real testimonials yet.

8. **Pricing teaser** (rewritten, more energy)
   New headline, new feature list (6 items instead of 4), a "what you DON'T pay" line (no subscription, no upsells, no ads).

9. **Schools strip** (rewritten with more substance)

10. **Big final CTA** (NEW)
    Full-width bright block: "Ready to raise an AI Smart Kid?" with the primary button and a "Lesson 1 is free, forever" reassurance.

## Pricing page additions

- New intro paragraph under the title explaining the philosophy ("One fair price. No subscriptions. No tricks.").
- Each plan card gets a 1-2 sentence description above the price.
- Individual plan: features expanded from 4 to 7 items.
- Schools plan: features expanded from 4 to 7 items, plus a "Best for" line.
- New "What's included in every plan" comparison strip below the cards.
- FAQ expanded from 4 to 9 questions covering: device support, offline use, multiple kids, school invoicing, refund process, what happens after the 12 lessons, parent controls, language switching, and data deletion.

## Other touch-ups

- **Hero badge** changes from "For curious kids 8-12" to "For curious kids ages 8 to 12" (no dash).
- **`features` array in `Landing.tsx`**: rewrite the "No chat — kids never type to AI" line to "No chat. Kids never type to an AI."
- **`landing.heroSubtitle`**: rewrite without the en-dash in "8–12" by saying "ages 8 to 12".
- **`languageSelect.subtitle`**: keep middle dot separators, no em-dashes (already clean).
- **Spark mascot copy**: add a one-liner under the hero Spark ("Hi, I'm Spark. I'll be your AI guide!").
- **Footer**: add a one-line tagline above the nav row ("Raising the first generation of AI smart kids.").

## Files I'll change

- `src/locales/en.json` — add ~40 new copy keys, rewrite existing ones, scrub all em-dashes.
- `src/locales/nl.json` and `src/locales/es.json` — leave as empty objects so English fallback handles them (you can translate later).
- `src/pages/Landing.tsx` — add 5 new sections, restructure hero, replace inline strings with t() keys.
- `src/pages/Pricing.tsx` — add intro, plan descriptions, comparison strip, expand FAQ rendering.
- `src/components/Footer.tsx` — add tagline line.
- Quick scan of other pages (`Auth.tsx`, `Dashboard.tsx`, `LessonPage.tsx`, etc.) and removal of any "—" found in user-facing strings.

## What I will NOT touch
- Backend, auth, payments, lessons content, database, routes. Pure copy and layout work.
- Color palette, fonts, component library. Visual system stays the same.

