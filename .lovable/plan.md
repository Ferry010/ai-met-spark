# Spark wordt een echte leraar — animaties + gamification

Doel: lessen voelen als een spel waar Spark je actief doorheen begeleidt. Geen kleur- of brand-wijziging — alleen meer beweging, meer Spark, meer beloning.

## 1. Framer Motion installeren
Toevoegen: `framer-motion` (al beschikbaar in stack-richtlijnen). Gebruik voor:
- pagina/stap-overgangen (`AnimatePresence` met slide+fade)
- Spark die zelf van plek naar plek vliegt tussen stappen
- micro-interacties op knoppen/quiz-opties (spring tap)

## 2. Spark als persistente leraar (nieuw component)
Nieuw: `src/components/SparkTeacher.tsx`
- Vaste "teacher dock" linksonder die door de hele les zichtbaar blijft
- Verandert mood per stap (intro=happy, theory=explaining, fact=hinting, quiz=questioning, correct=celebrating, fout=thinking)
- Reageert live op events: knipoogt bij goed antwoord, schudt licht bij fout, juicht bij ster verdiend
- Kleine "denkbubbel" met contextuele aanmoediging ("Mooi! Nog 2 vragen", "Pak die 3 sterren!")
- Zwevend, sub­tiel ademend (idle bob), met parallax bij scroll

## 3. Nieuwe Spark-moodanimaties (in `Spark.tsx` + `index.css`)
- `cheering`: armen omhoog + sparkles
- `oops`: hoofd licht gekanteld, knippert
- `teaching`: pointer arm wijst naar bubble, mond beweegt mee met typewriter
- `thinking`: vraagteken zweeft boven antenne
- `levelup`: gouden gloed pulseert
Alle als CSS keyframes met `prefers-reduced-motion` respect.

## 4. Gamification-laag
Nieuw: `src/lib/gamification.ts` + `src/hooks/useGameStats.ts`
- **XP**: per voltooide stap (+10), correct quiz-antwoord (+25), perfecte les (+100 bonus)
- **Combo-meter**: streak van goede antwoorden binnen één les → multiplier x2/x3 met visueel meter dat oplaadt
- **Daily streak**: dagen op rij gespeeld, vlam-icoon in header (`AppHeader`)
- **Level**: afgeleid van totale XP, met level-up celebratie (full-screen confetti + Spark "LEVEL UP!" overlay)
- Persistent via nieuwe Supabase-tabel `user_stats` (xp, level, streak, last_played_date, longest_combo)

## 5. LessonRunner upgrades
- **Stappen-overgangen**: elke stap slidet in van rechts, vorige uit naar links (AnimatePresence)
- **Progressbar**: van platte balk → segmented met checkmark-pop per voltooide stap, glow op huidige
- **Quiz**:
  - Knoppen krijgen spring/scale op tap
  - Goed antwoord: groene flash + Spark juicht + +XP teller telt op + combo-meter vult
  - Fout antwoord: korte rode shake + Spark "oops" + zachte bubble met aanmoediging ("Geen punt, kijk nog eens!")
  - Hint kost 5 XP → zichtbare keuze, voelt als game-resource
- **Sort/Reveal/MultiChoice**: drag-feedback met framer-motion `whileHover`/`whileTap`, magnetisch snappen naar bucket
- **Done-scherm**: 
  - Sterren tellen één voor één in met pop+ding-geluid (al aanwezig)
  - XP-balk vult naar nieuw level
  - Spark doet "cheering" mood, badge-unlocks tonen met glow

## 6. Dashboard + WorldPage
- **Dashboard header**: streak-vlam + level-badge + XP-balk naar volgend level
- **Wereld-kaarten**: hover tilt 3D, locked-werelden krijgen rammelende ketting bij klik
- **Lessen-lijst (WorldPage)**: pad-stijl met Spark-icoon dat naar volgende les "loopt", afgeronde lessen met gouden glow, huidige les pulseert zachtjes
- **Badges**: nieuw verdiende badge schiet groot in beeld met confetti (toast + overlay)

## 7. Geluid (gebruikt bestaande `lib/sounds.ts`)
Voeg toe: `playCorrect`, `playWrong`, `playLevelUp`, `playCombo` (korte, niet-opdringerige tones). Mute-toggle in header.

## Technische details

### Database migratie
```sql
create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0,
  level int not null default 1,
  streak_days int not null default 0,
  longest_combo int not null default 0,
  last_played_date date,
  updated_at timestamptz not null default now()
);
alter table public.user_stats enable row level security;
create policy "own stats read" on public.user_stats for select using (auth.uid() = user_id);
create policy "own stats write" on public.user_stats for insert with check (auth.uid() = user_id);
create policy "own stats update" on public.user_stats for update using (auth.uid() = user_id);
```

### Te wijzigen / nieuwe bestanden
- nieuw: `src/components/SparkTeacher.tsx`, `src/lib/gamification.ts`, `src/hooks/useGameStats.ts`
- edit: `src/components/Spark.tsx` (nieuwe moods), `src/index.css` (keyframes), `src/components/LessonRunner.tsx` (AnimatePresence + XP/combo hooks), `src/pages/Dashboard.tsx` (stats header), `src/pages/WorldPage.tsx` (pad-animatie), `src/components/AppHeader.tsx` (streak/level), `src/lib/sounds.ts` (extra cues)
- dependency: `framer-motion`

### Performance & a11y
- Alle nieuwe animaties achter `prefers-reduced-motion: reduce` uitgeschakeld
- Spring-animaties met `transform`/`opacity` only, geen layout thrash
- SparkTeacher dock: `pointer-events-none` behalve op bubble

## Scope-grens
- Geen wijziging aan kleurpalet, fonts, brand
- Geen content/lesson-data wijzigingen
- Geen backend behalve `user_stats` tabel
- Eindtoets/Certificaat blijven functioneel zoals nu, krijgen alleen de nieuwe done-celebratie

## Volgorde van uitvoering
1. framer-motion install + `user_stats` migratie
2. Gamification core (`useGameStats` + XP/level math + persist)
3. SparkTeacher dock + nieuwe moods/keyframes
4. LessonRunner overgangen + quiz feedback + combo-meter
5. Dashboard/WorldPage/AppHeader stats + pad-animatie
6. Polish: geluiden, badge-unlock overlay, level-up celebratie

Akkoord? Ik begin dan bij stap 1.
