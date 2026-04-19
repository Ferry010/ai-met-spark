

# AI Smart Kids — Full Build Plan

A bright, playful AI literacy app for kids 8–12, built with React + Vite + Tailwind, Lovable Cloud (auth, database, storage), built-in Stripe payments, and Lovable's transactional emails.

## Design foundation
- **Colors**: sky blue `#4FC3F7`, yellow `#FFD54F`, success green `#81C784`, coral `#FF8A65`, background `#F5F9FF`. All registered as HSL design tokens.
- **Fonts**: Fredoka (headings), Nunito (body) via Google Fonts.
- **Components**: 24px rounded cards, soft shadows, 56px+ buttons, confetti on success, gentle shake on wrong, fade/scale transitions.
- **Mascot Spark**: custom inline SVG component — teal round body, big eyes, multiple expressions (default, happy, thinking, celebrating).

## i18n
- `react-i18next` with `/src/locales/en.json`, `nl.json`, `es.json`.
- English fully populated; NL and ES start as empty objects with English fallback enabled.
- Language stored in `profiles.language`, also persisted to localStorage for first-visit selection.

## Pages & flows

**1. Language selector** (first-visit gate) — full-screen, 3 huge flag buttons 🇬🇧 🇳🇱 🇪🇸.

**2. Landing `/`** — hero with Spark, 3 pillar cards (SAFE 🛡️ / SMART 🧠 / STRONGER 💪), "Try First Lesson Free" + "Log In", €14 pricing teaser, schools section, parent reassurance footer.

**3. Pricing `/pricing`** — Individual €14 vs Schools (from €4/seat, min 20). FAQ accordion.

**4. School contact `/schools/contact`** — form (name, school, country, seat count, email) → stored in `school_inquiries` table, notification email to admin.

**5. Auth `/auth`** — email/password + Google. Signup collects: kid first name, age, parent email, language, optional class code.

**6. Dashboard `/dashboard`** — greeting, overall progress bar, 3 world tiles with per-world progress, lock states, badge shelf, "Take Final Test" (locked until 12/12).

**7. World `/world/:id`** — 4 lessons on a winding path, completed lessons glow, locked behind paywall (except 1.1).

**8. Lesson `/lesson/:id`** — 5 steps: intro with Spark → "Did you know?" card → interactive (drag-drop / multi-choice / tap-reveal) → mini-quiz (2–3 Qs with instant feedback) → completion with confetti and +1 star.

**9. Final test `/final-test`** — 10 mixed questions, 80% to pass, 24h cooldown on fail, confetti + certificate unlock on pass.

**10. Certificate `/certificate`** — jsPDF generation with kid name, date, score, 3 pillar badges, "Certified AI Smart Kid". Uploaded to Supabase storage and emailed to parent/teacher.

**11. Teacher dashboard `/teacher`** — class list, student progress bars, pass/fail status, generate class codes, bulk certificate ZIP download, invoice history (placeholder until Stripe seat checkout ships).

**12. Account settings `/account`** — change name / parent email / language, view progress, reset progress, delete account.

## Content
All 12 lessons populated in English exactly as you wrote them, with hand-crafted interactives and quizzes per lesson.

## Backend (Lovable Cloud)
Tables:
- `profiles` (id, first_name, age, parent_email, language, paid, role)
- `user_roles` (separate table; roles: `student`, `teacher`, `admin`) — enforced via `has_role()` security definer
- `schools` (id, name, teacher_id, seat_count)
- `class_codes` (code, school_id, expires_at)
- `class_memberships` (student_id, school_id)
- `user_progress` (user_id, lesson_id, completed_at, stars)
- `final_test_attempts` (user_id, score, passed, attempted_at)
- `certificates` (user_id, pdf_url, issued_at)
- `school_inquiries` (form submissions)

RLS on all tables. Students see only their own rows; teachers see students in their school via `has_role` + membership check.

## Payments
- **Lovable's built-in Stripe payments** (no external account). One-time €14 product unlocks all lessons → flips `profiles.paid = true` via webhook.
- Free tier: only Lesson 1.1 accessible; 1.2+ shows lock and opens paywall on tap.
- Schools: contact form only in v1 (Stripe seat checkout deferred per your choice).

## Emails (Lovable transactional)
- Welcome email on signup
- Certificate delivery to parent (individual) or teacher (school)
- School inquiry confirmation + admin notification

## Compliance
- Cookie consent banner, privacy policy + terms pages in footer.
- No free-text AI input from kids — all content pre-scripted.
- Minimal data: first name + age + parent email only.

## Build order
1. Design tokens, fonts, Spark mascot, i18n setup, language selector
2. Landing + pricing + school contact pages
3. Lovable Cloud + auth + profiles + roles + signup with class code
4. Stripe €14 unlock + paywall logic
5. Dashboard + world pages with progress tracking
6. Lesson template + all 12 lessons content
7. Final test + certificate PDF + email delivery
8. Teacher dashboard + class code generation + bulk certificate ZIP
9. Account settings, cookie banner, privacy/terms pages
10. Responsive polish for tablet & phone

