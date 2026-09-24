import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Box,
  Check,
  Clock,
  Flame,
  Gamepad2,
  Laptop,
  MessageSquareOff,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  Users,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WorldPortal } from "@/components/WorldPortals";
import {
  C,
  CoinScene,
  GameArch,
  HeroPortal,
  HouseScene,
  Moon,
  SceneEdge,
  SchoolScene,
  StarSky,
  SunriseScene,
  Twinkle,
  type GameKind,
} from "@/components/scenes";
import { WORLDS } from "@/content/missions";
import { TEACHER_ENTRY } from "@/lib/links";
import { cn } from "@/lib/utils";

type Item = { title: string; desc: string };
type Game = { name: string; desc: string };
type Stat = { n: string; label: string };
type Faq = { q: string; a: string };

const STAT_TONES = [
  "bg-safe text-safe-foreground shadow-[0_8px_0_hsl(var(--safe-dark))]",
  "bg-primary text-primary-foreground shadow-[0_8px_0_hsl(var(--primary-dark))]",
  "bg-secondary text-secondary-foreground shadow-[0_8px_0_hsl(var(--secondary-dark))]",
  "bg-stronger text-stronger-foreground shadow-[0_8px_0_hsl(var(--stronger-dark))]",
];
const STEP_TONES = [
  "bg-primary text-primary-foreground shadow-[0_8px_0_hsl(var(--primary-dark))]",
  "bg-safe text-safe-foreground shadow-[0_8px_0_hsl(var(--safe-dark))]",
  "bg-stronger text-stronger-foreground shadow-[0_8px_0_hsl(var(--stronger-dark))]",
  "bg-[#FF8A5B] text-white shadow-[0_8px_0_#C4532A]",
  "bg-secondary text-secondary-foreground shadow-[0_8px_0_hsl(var(--secondary-dark))]",
];
const STEP_ICONS = [Sparkles, BookOpen, Gamepad2, Timer, Trophy];
const GAME_KINDS: GameKind[] = ["veeg", "speur", "bouw", "kies", "volgorde"];
const PARENT_ICONS = [MessageSquareOff, ShieldCheck, Volume2, Users, Clock, Laptop];

const Eyebrow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("text-sm font-bold uppercase tracking-[0.1em]", className)}>{children}</span>
);

const SpeechBubble = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-[20px] bg-card px-4 py-3 font-display text-base leading-snug shadow-[0_5px_0_hsl(var(--border))]", className)}>
    {children}
  </div>
);

/** A static peek at a real mission screen. */
const MissionPeek = () => (
  <div className="flex w-full max-w-[340px] flex-col gap-3.5 rounded-[28px] bg-card p-4 text-foreground shadow-[0_10px_0_rgb(0_0_0/0.22)] sm:p-[18px]">
    <div className="flex items-center gap-2">
      <X className="h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-3/5 rounded-full bg-safe" />
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-stronger-soft px-2 py-0.5 font-display text-xs text-stronger-dark">
        <Flame className="h-3.5 w-3.5" /> ×3
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-2 py-0.5 font-display text-xs text-secondary-foreground">
        <Zap className="h-3.5 w-3.5 fill-current" /> 60
      </span>
    </div>
    <div className="text-center">
      <div className="text-xs font-bold text-safe-dark">Kaart 3 van 5</div>
      <div className="font-display text-2xl">AI of geen AI?</div>
    </div>
    <div className="flex h-28 -rotate-2 items-center justify-center rounded-[22px] bg-safe-soft px-5 text-center shadow-[0_5px_0_#45ADF6]">
      <span className="font-display text-xl leading-tight">Een filter dat je gezicht herkent</span>
    </div>
    <div className="grid grid-cols-2 gap-2.5">
      <span className="flex items-center justify-center gap-2 rounded-2xl border-2 border-success bg-success-soft py-3 font-display text-success-dark shadow-[0_4px_0_hsl(var(--success))]">
        <Sparkles className="h-4 w-4" /> AI
      </span>
      <span className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-3 font-display shadow-[0_4px_0_hsl(var(--border))]">
        <Box className="h-4 w-4" /> Geen AI
      </span>
    </div>
    <div className="flex gap-2 rounded-2xl bg-success-soft px-3 py-2.5 text-sm leading-snug text-success-dark">
      <span className="font-display">Goed zo!</span> Het filter leerde hoe gezichten eruitzien.
    </div>
  </div>
);

export const Landing = () => {
  const { t } = useTranslation();
  const stats = t("landing.stats", { returnObjects: true }) as Stat[];
  const how = t("landing.how", { returnObjects: true }) as Item[];
  const games = t("landing.games", { returnObjects: true }) as Game[];
  const parents = t("landing.parents", { returnObjects: true }) as Item[];
  const faq = t("landing.faq", { returnObjects: true }) as Faq[];
  const freePoints = t("landing.freePoints", { returnObjects: true }) as string[];
  const schoolsSteps = t("landing.schoolsSteps", { returnObjects: true }) as string[];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero: a starry night */}
      <section className="relative overflow-hidden bg-night pb-32 sm:pb-44">
        <StarSky seed={1} count={130}>
          <Moon x={1330} y={130} r={34} sky={C.night} />
          <Twinkle x={1010} y={70} s={12} color={C.goldLight} />
          <Twinkle x={420} y={660} s={8} />
        </StarSky>
        <SiteHeader tone="night" />
        <div className="container relative grid items-center gap-14 pt-28 sm:pt-36 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-[#FFD34D]">
              <Sparkles className="h-4 w-4" /> {t("landing.badge")}
            </span>
            <h1 className="text-5xl leading-[0.93] text-white sm:text-6xl lg:text-[84px]">
              {t("landing.title")}{" "}
              <span className="block text-secondary">
                {t("landing.titleAccent")
                  .split(/(AI-school)/)
                  .map((part, i) => (part === "AI-school" ? <span key={i} className="whitespace-nowrap">{part}</span> : part))}
              </span>
            </h1>
            <p className="max-w-xl text-lg text-on-dark sm:text-xl">{t("landing.subtitle")}</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link to="/auth?mode=signup">
                  {t("landing.ctaPrimary")} <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="night">
                <Link to={TEACHER_ENTRY}>{t("landing.ctaTeacher")}</Link>
              </Button>
            </div>
            <p className="text-sm text-on-dark">{t("landing.micro")}</p>
          </div>
          <div className="relative mx-auto w-full max-w-[460px] lg:max-w-[500px]">
            <HeroPortal>
              <MissionPeek />
            </HeroPortal>
            <Spark size={150} mood="happy" waving className="absolute -bottom-12 -left-24 hidden lg:block" />
            <Spark size={84} mood="happy" waving className="absolute -bottom-10 -left-3 lg:hidden" />
          </div>
        </div>
        <SceneEdge
          className="h-28 sm:h-40"
          layers={[
            { base: 14, amp: 10, seed: 2, color: C.dusk },
            { base: 40, amp: 10, seed: 5, color: C.dusk2 },
            { base: 64, amp: 9, seed: 9, color: C.dusk3 },
            { base: 90, amp: 8, seed: 12, color: C.paper },
          ]}
        />
      </section>

      {/* Numbers as stops on a trail */}
      <section className="relative pb-8 pt-4 sm:pb-16">
        <div aria-hidden className="absolute inset-x-[10%] top-[76px] hidden border-t-[6px] border-dotted border-border-strong sm:block" />
        <div className="container relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={cn("flex flex-col items-center gap-3", i % 2 === 1 && "sm:translate-y-6")}>
              <div
                className={cn(
                  "grid h-24 w-24 place-items-center rounded-full font-display text-4xl sm:h-32 sm:w-32 sm:text-5xl",
                  STAT_TONES[i % STAT_TONES.length],
                )}
              >
                {s.n}
              </div>
              <div className="font-display text-lg">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Worlds */}
      <section className="relative pb-36 pt-16 sm:pb-48">
        <div className="container">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-3 text-4xl sm:text-6xl">{t("landing.worldsTitle")}</h2>
              <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">{t("landing.worldsSubtitle")}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Spark size={80} mood="happy" className="md:order-last" />
              <SpeechBubble className="max-w-[230px]">{t("landing.worldsSpark")}</SpeechBubble>
            </div>
          </div>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {WORLDS.map((w) => (
              <WorldPortal key={w.id} world={w} />
            ))}
          </div>
        </div>
        <SceneEdge
          layers={[
            { base: 50, amp: 16, seed: 14, color: C.dusk2 },
            { base: 82, amp: 12, seed: 15, color: C.dusk },
          ]}
        />
      </section>

      {/* How a mission works: a trail through the dusk */}
      <section className="relative overflow-hidden bg-dusk pb-36 pt-10 sm:pb-48">
        <StarSky seed={7} count={80}>
          <Twinkle x={1250} y={90} s={11} color={C.goldLight} />
        </StarSky>
        <div className="container relative">
          <h2 className="mb-3 text-4xl text-white sm:text-6xl">{t("landing.howTitle")}</h2>
          <p className="mb-14 max-w-xl text-lg text-on-dark sm:text-xl">{t("landing.howSubtitle")}</p>
          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
            <span aria-hidden className="absolute bottom-10 left-[45px] top-10 border-l-[5px] border-dotted border-secondary/70 lg:hidden" />
            <span aria-hidden className="absolute left-[10%] right-[10%] top-[52px] hidden border-t-[6px] border-dotted border-secondary/70 lg:block" />
            {how.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li key={step.title} className="relative flex items-center gap-5 lg:flex-col lg:items-center lg:text-center">
                  <span className={cn("relative grid h-24 w-24 shrink-0 place-items-center rounded-full lg:h-[104px] lg:w-[104px]", STEP_TONES[i])}>
                    <Icon className="h-10 w-10" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-8 w-8 place-items-center rounded-full bg-secondary font-display text-secondary-foreground shadow-[0_3px_0_hsl(var(--secondary-dark))]">
                      {i + 1}
                    </span>
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-2xl text-white">{step.title}</span>
                    <span className="text-[15px] leading-snug text-on-dark">{step.desc}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        <SceneEdge
          layers={[
            { base: 46, amp: 16, seed: 16, color: C.dusk2 },
            { base: 80, amp: 12, seed: 17, color: C.paper },
          ]}
        />
      </section>

      {/* Games */}
      <section className="relative pb-32 pt-10 sm:pb-40">
        <div className="container">
          <h2 className="mb-3 text-4xl sm:text-6xl">{t("landing.gamesTitle")}</h2>
          <p className="mb-12 max-w-xl text-lg text-muted-foreground sm:text-xl">{t("landing.gamesSubtitle")}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {games.map((g, i) => (
              <div key={g.name} className="flex items-center gap-5 lg:flex-col lg:items-start">
                <GameArch kind={GAME_KINDS[i]} className="w-28 shrink-0 lg:w-full" />
                <div>
                  <div className="font-display text-2xl">{g.name}</div>
                  <p className="mt-1 text-[15px] leading-snug text-muted-foreground">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <SceneEdge className="h-14 sm:h-20" layers={[{ base: 60, amp: 14, seed: 18, color: C.lav }]} />
      </section>

      {/* Parents */}
      <section className="relative bg-primary-soft pb-28 pt-10 sm:pb-36">
        <div className="container grid items-center gap-12 lg:grid-cols-[460px_1fr] lg:gap-20">
          <HouseScene className="mx-auto max-w-[460px]" />
          <div>
            <Eyebrow className="text-primary-dark">{t("landing.parentsEyebrow")}</Eyebrow>
            <h2 className="mb-10 mt-2 text-4xl sm:text-[56px] sm:leading-none">{t("landing.parentsTitle")}</h2>
            <div className="grid gap-x-9 gap-y-7 sm:grid-cols-2">
              {parents.map((p, i) => {
                const Icon = PARENT_ICONS[i];
                return (
                  <div key={p.title} className="flex gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-card text-primary shadow-[0_4px_0_#D9D0FF]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="font-display text-lg">{p.title}</div>
                      <p className="mt-0.5 text-[15px] leading-snug text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <SceneEdge className="h-14 sm:h-20" layers={[{ base: 56, amp: 14, seed: 19, color: C.paper }]} />
      </section>

      {/* Always free */}
      <section className="py-12 sm:py-16">
        <div className="container grid items-center gap-10 lg:grid-cols-[1fr_440px]">
          <CoinScene className="mx-auto max-w-[320px] sm:max-w-[440px] lg:order-last" />
          <div>
            <Eyebrow className="text-secondary-dark">{t("landing.freeEyebrow")}</Eyebrow>
            <h2 className="mb-4 mt-2 text-5xl sm:text-[64px] sm:leading-none">{t("landing.freeTitle")}</h2>
            <p className="mb-6 max-w-xl text-lg text-muted-foreground sm:text-xl">{t("landing.freeDesc")}</p>
            <ul className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
              {freePoints.map((point) => (
                <li key={point} className="inline-flex items-center gap-2.5 rounded-full bg-card px-4 py-2.5 font-medium shadow-[0_4px_0_hsl(var(--border))]">
                  <Check className="h-4 w-4 text-secondary-dark" strokeWidth={3} /> {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-12 sm:py-16">
        <div className="container grid items-center gap-12 lg:grid-cols-[460px_1fr] lg:gap-20">
          <SchoolScene className="mx-auto max-w-[460px]" />
          <div>
            <Eyebrow className="text-safe-dark">{t("landing.schoolsEyebrow")}</Eyebrow>
            <h2 className="mb-4 mt-2 text-4xl sm:text-[56px] sm:leading-none">{t("landing.schoolsTitle")}</h2>
            <p className="mb-6 max-w-xl text-lg text-muted-foreground sm:text-xl">{t("landing.schoolsDesc")}</p>
            <ol className="mb-8 flex flex-col gap-3.5">
              {schoolsSteps.map((step, i) => (
                <li key={step} className="flex items-center gap-3.5 font-display text-lg">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-safe text-safe-foreground shadow-[0_4px_0_hsl(var(--safe-dark))]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Button asChild size="lg">
                <Link to={TEACHER_ENTRY}>
                  {t("landing.schoolsCta")} <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Link to="/teacher/login" className="font-semibold text-primary-dark underline underline-offset-4">
                {t("landing.schoolsLogin")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative pb-36 pt-12 sm:pb-44 sm:pt-16">
        <div className="container grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          <div>
            <h2 className="mb-8 text-4xl sm:text-[56px] sm:leading-none">{t("landing.faqTitle")}</h2>
            <div className="flex items-end gap-3">
              <Spark size={96} mood="questioning" className="shrink-0" />
              <SpeechBubble className="mb-6 max-w-[220px]">
                <Link to="/contact" className="hover:underline">
                  {t("landing.faqSpark")}
                </Link>
              </SpeechBubble>
            </div>
          </div>
          <Accordion type="single" collapsible defaultValue="faq-0" className="flex flex-col gap-3.5">
            {faq.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-[20px] border-2 border-border bg-card px-5 shadow-[0_4px_0_hsl(var(--border))]">
                <AccordionTrigger className="gap-4 text-left font-display text-lg hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <SceneEdge className="h-16 sm:h-24" layers={[{ base: 50, amp: 18, seed: 22, color: C.pink }]} />
      </section>

      {/* Final call to action: sunrise */}
      <section className="relative min-h-[760px] overflow-hidden bg-stronger md:min-h-[720px]">
        <SunriseScene />
        <div className="container relative flex flex-col items-center pt-16 text-center sm:pt-24">
          <h2 className="mb-4 text-4xl text-white sm:text-6xl lg:text-[68px]">{t("landing.finalTitle")}</h2>
          <p className="mb-8 text-lg text-white sm:text-xl">{t("landing.finalSubtitle")}</p>
          <Button
            asChild
            size="lg"
            className="w-full bg-card text-foreground hover:bg-card/95 sm:w-auto"
            style={{ ["--depth-color" as string]: "hsl(var(--stronger-dark))" }}
          >
            <Link to="/auth?mode=signup">
              {t("landing.finalCta")} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        <SceneEdge className="h-12 sm:h-16" layers={[{ base: 50, amp: 14, seed: 25, color: C.night }]} />
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
