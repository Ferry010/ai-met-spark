# AI met Spark

Build a kid-friendly AI literacy web app called "AI Smart Kids" where children aged 8-12 learn to use AI safely, smartly, and to make themselves smarter. The app should feel playful, bright, and game-like — think Duolingo meets a friendly space adventure.

DESIGN SYSTEM:

- Playful but clean. Rounded corners (16-24px), soft shadows, generous whitespace.

- Color palette: primary sky blue #4FC3F7, friendly yellow #FFD54F, success green #81C784, warm coral #FF8A65, soft background #F5F9FF

- Typography: "Fredoka" for headings (rounded, friendly), "Nunito" for body (legible for kids)

- Big tappable buttons (minimum 56px height)

- Lots of emoji and simple illustrations (use Lucide icons + custom SVG blobs)

- Animated feedback: confetti on correct answers, gentle shake on wrong, smooth transitions everywhere

LANGUAGE SUPPORT:

- Three languages: English, Dutch (Nederlands), Spanish (Español)

- On first app open, show a language selector screen with 3 flag buttons before anything else

- Language choice saved to user profile; changeable later in account settings

- Use i18n structure (all text in JSON locale files) so content can be translated easily

- For now, only populate English strings — leave Dutch and Spanish as empty keys with the English fallback so it works on launch

APP STRUCTURE:

1. LANGUAGE SELECT (first-time visitors)

- Full-screen, 3 big flag buttons

- "Choose your language / Kies je taal / Elige tu idioma"

2. LANDING PAGE (pre-login)

- Big hero: "Learn how to use AI like a pro!" with playful illustration

- Three pillar cards: SAFE 🛡️ / SMART 🧠 / STRONGER 💪

- "Try First Lesson Free" CTA (unlocks World 1, Lesson 1 only)

- "Log In" button

- Pricing section: "€14 one-time for full access" with "Unlock now" button

- Separate section: "For schools and teachers" → seat-based pricing page

- Parent section at bottom: "Built for parents who want their kids to thrive with AI, not fear it"

3. PRICING PAGE

- Two tiers shown side by side:

  - INDIVIDUAL: €14 one-time, lifetime access, 1 child, parent email for certificate

  - SCHOOLS: "From €4 per seat, min 20 seats" with "Contact us" form (name, school, country, seat count, email)

- FAQ below: Is this safe? Is data private? Can I get a refund?

4. AUTH (Supabase email/password + Google)

- Sign up asks for: kid's first name only, age, parent email, language

- Parent email gets the final certificate

- After sign up, user lands on paywall if they haven't unlocked yet (only Lesson 1.1 accessible)

- Stripe checkout for €14 unlock; on success, all 12 lessons accessible forever

- School accounts use a class code entered at signup (teacher generates codes from a teacher dashboard — see section 9)

5. DASHBOARD (post-login)

- Greeting: "Hi [name]! Ready to get smarter?"

- Progress bar: "X of 12 lessons done"

- Three worlds displayed as big tappable tiles, each showing progress (0/4, 1/4, etc.)

- Locked worlds show a lock icon — kids must finish one to unlock the next

- If not paid: lessons 1.2 onward show a small lock icon and tapping opens paywall

- Badge shelf showing earned badges

- "Take Final Test" button (locked until all 12 lessons done)

6. WORLD STRUCTURE

Each world has a theme:

- World 1 "SAFE" — shield theme, blue/teal

- World 2 "SMART" — lightbulb theme, yellow

- World 3 "STRONGER" — muscle/rocket theme, coral

Each world shows its 4 lessons as a path (like Duolingo's winding path). Completed lessons glow.

7. LESSON STRUCTURE (each lesson follows same template):

Step 1: Intro screen with lesson title + mascot character

Step 2: "Did you know?" card with a key fact (one sentence, big text)

Step 3: Interactive moment (drag-drop, multiple choice, or tap-to-reveal)

Step 4: Mini-quiz (2-3 questions, instant feedback)

Step 5: Completion screen: "Nice work! +1 star"

8. FINAL TEST

- 10 questions pulled from all 3 worlds

- Multiple choice, no time limit

- 80% to pass (8 out of 10)

- If failed: encouraging message, can retry after 24h cooldown

- If passed: confetti animation, unlock certificate

9. CERTIFICATE

- Personalized PDF with kid's first name, date, and "Certified AI Smart Kid"

- Include a score and the three pillar badges

- Downloadable + auto-emailed to parent email (individual accounts) or teacher email (school accounts)

10. TEACHER DASHBOARD (for school accounts)

- Separate login route: /teacher

- Dashboard shows: class name, list of students, each student's progress bar, pass/fail status

- Generate class codes (kids enter this at signup to join a class)

- Bulk download all student certificates as a zip

- Invoice/receipt history for seat purchases

11. ACCOUNT SETTINGS PAGE

- Change first name

- Change parent email

- Change language

- View progress

- Reset progress option

- Delete account

CONTENT FOR ALL 12 LESSONS (ENGLISH):

WORLD 1 - SAFE:

Lesson 1.1 "What is AI, really?" — AI is a super-fast guesser, not a thinking brain. It learned from millions of examples.

Lesson 1.2 "AI can be wrong" — Sometimes AI makes stuff up. It's called "hallucinating." Always check important things.

Lesson 1.3 "Keep your secrets" — Never tell AI your full name, school, address, or share photos of yourself.

Lesson 1.4 "Spot the fake" — AI can make fake videos and photos. Look for weird hands, strange backgrounds, too-perfect faces.

WORLD 2 - SMART:

Lesson 2.1 "Ask like a pro" — Clear questions = better answers. Say what you need, why, and how long.

Lesson 2.2 "Always double-check" — AI sounds confident even when wrong. Check with a book, a teacher, or another source.

Lesson 2.3 "Helper, not homework-doer" — AI helps you understand. Copying AI's answer is not learning.

Lesson 2.4 "When to use AI" — Great for: brainstorming, explaining, practicing. NOT for: making real decisions, pretending it's you.

WORLD 3 - STRONGER:

Lesson 3.1 "Learn 10x faster" — Ask AI to explain anything. "Explain gravity like I'm 9."

Lesson 3.2 "Explain, don't solve" — Better prompt: "Help me understand" instead of "Give me the answer."

Lesson 3.3 "Your practice buddy" — Use AI to test yourself, practice languages, or build stories together.

Lesson 3.4 "Brain + AI = unbeatable" — Your creativity + AI's speed = your superpower. AI without you is boring.

TECHNICAL:

- Next.js + Tailwind + Supabase (auth, database, storage, RLS)

- Stripe for one-time €14 payment and school seat invoicing

- Resend for parent and teacher emails (certificate delivery, welcome, school invoices)

- Progress tracked per user in a "user_progress" table

- Schools tracked in "schools" and "class_codes" tables

- Certificates generated as PDF client-side (jsPDF) then uploaded to Supabase storage

- i18n via next-intl or similar, locale JSON files in /locales/en.json, /locales/nl.json, /locales/es.json

- Responsive: must work perfectly on tablet and phone (kids use both)

- COPPA-friendly: minimal data collection, parent email required, no chat feature, no AI input from kids (pre-scripted content only)

- GDPR-friendly: cookie consent banner, clear privacy policy link in footer

MASCOT:

Create a friendly round robot character called "Spark" — teal body, big eyes, small smile. Appears in every lesson to guide kids.

START BY BUILDING:

1. Language selector screen

2. The landing page with 3 pillars and pricing teaser

3. Pricing page with both tiers

4. Auth flow + Stripe €14 unlock

5. Dashboard with 3 world tiles

6. One complete lesson (Lesson 1.1) as a template

Then we'll expand to the rest of the lessons and the teacher dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/87dc2593-1215-4ba4-bdd1-0978a9dd1d5e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
