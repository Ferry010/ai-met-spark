import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Flame,
  Zap,
  X,
  MessageSquareOff,
  ShieldCheck,
  Volume2,
  Users,
  Clock,
  Laptop,
  Hand,
  Search,
  Blocks,
  ListChecks,
  MousePointerClick,
  Sparkles,
  BookOpen,
  Gamepad2,
  Timer,
  Trophy,
  Check,
} from "lucide-react";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WORLDS } from "@/content/missions";
import { PILLAR_THEME } from "@/lib/pillars";
import { cn } from "@/lib/utils";

type Item = { title: string; desc: string };
type Game = { name: string; desc: string };
type Stat = { n: string; label: string };
type Faq = { q: string; a: string };

const HOW_ICONS = [Sparkles, BookOpen, Gamepad2, Timer, Trophy];
const GAME_ICONS = [Hand, Search, Blocks, MousePointerClick, ListChecks];
const PARENT_ICONS = [MessageSquareOff, ShieldCheck, Volume2, Users, Clock, Laptop];
const STAT_TONES = ["bg-safe text-safe-foreground", "bg-primary text-primary-foreground", "bg-smart text-smart-foreground", "bg-stronger text-stronger-foreground"];

/** A static peek at a real mission screen. */
const MissionPeek = () => (
  <div className="relative mx-auto w-full max-w-sm">
    <div className="tile p-4 shadow-[0_24px_0_-12px_hsl(var(--border))]">
      <div className="mb-4 flex items-center gap-2">
        <X className="h-5 w-5 text-muted-foreground" />
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-3/5 rounded-full bg-safe" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-display text-xs text-accent-foreground">
          <Flame className="h-3.5 w-3.5" /> ×3
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-2 py-0.5 font-display text-xs text-secondary-foreground">
          <Zap className="h-3.5 w-3.5 fill-current" /> 60
        </span>
      </div>
      <div className="mb-1 text-center text-xs font-semibold text-safe-dark">Kaart 3 van 5</div>
      <div className="mb-4 text-center font-display text-xl">AI of geen AI?</div>
      <div className="tile mb-4 flex h-32 items-center justify-center rotate-[-2deg] p-4 text-center">
        <span className="font-display text-xl leading-tight">Een filter dat je gezicht herkent</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <span className="press tile flex items-center justify-center gap-2 border-success bg-success-soft py-3 font-display text-sm">
          <span aria-hidden>🤖</span> AI
        </span>
        <span className="press tile flex items-center justify-center gap-2 py-3 font-display text-sm">
          <span aria-hidden>📦</span> Geen AI
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2 text-sm text-success-dark">
        <span className="font-display">Goed zo!</span> Het filter leerde hoe gezichten eruitzien.
      </div>
    </div>
    <div className="absolute -right-8 -top-10 hidden sm:block">
      <Spark size={88} mood="happy" waving />
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="container grid items-center gap-12 py-12 md:grid-cols-2 md:py-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary-dark">
            <Sparkles className="h-4 w-4" /> {t("landing.badge")}
          </span>
          <h1 className="mb-5 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">{t("landing.title")}</h1>
          <p className="mb-8 max-w-lg text-lg text-muted-foreground sm:text-xl">{t("landing.subtitle")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/auth?mode=signup">
                {t("landing.ctaPrimary")} <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/scholen/aanmelden">{t("landing.ctaTeacher")}</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t("landing.micro")}</p>
        </div>
        <MissionPeek />
      </section>

      {/* Stats */}
      <section className="container pb-16">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={cn("rounded-3xl px-5 py-6", STAT_TONES[i % STAT_TONES.length])}>
              <div className="font-display text-5xl leading-none">{s.n}</div>
              <div className="mt-1 font-medium opacity-90">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Worlds */}
      <section className="container pb-20">
        <h2 className="mb-2 text-4xl sm:text-5xl">{t("landing.worldsTitle")}</h2>
        <p className="mb-8 max-w-xl text-lg text-muted-foreground">{t("landing.worldsSubtitle")}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {WORLDS.map((w) => {
            const theme = PILLAR_THEME[w.pillar];
            return (
              <div key={w.id} className="tile overflow-hidden">
                <div className={cn("p-6", theme.solid)}>
                  <div className="mb-3 text-4xl" aria-hidden>
                    {w.emoji}
                  </div>
                  <div className="text-sm font-semibold opacity-90">Wereld {w.id}</div>
                  <div className="font-display text-3xl">{w.name}</div>
                  <div className="opacity-90">{w.tagline}</div>
                </div>
                <ul className="flex flex-wrap gap-2 p-5">
                  {w.missions.map((m) => (
                    <li key={m.id} className={cn("rounded-full px-3 py-1 text-sm", theme.soft)}>
                      {m.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* How a mission works */}
      <section className="bg-foreground py-20 text-background">
        <div className="container">
          <h2 className="mb-2 text-4xl text-background sm:text-5xl">{t("landing.howTitle")}</h2>
          <p className="mb-10 max-w-xl text-lg opacity-80">{t("landing.howSubtitle")}</p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {how.map((step, i) => {
              const Icon = HOW_ICONS[i];
              return (
                <li key={step.title} className="rounded-3xl bg-background/10 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-2xl opacity-40">{i + 1}</span>
                  </div>
                  <div className="font-display text-xl">{step.title}</div>
                  <p className="mt-1 text-sm opacity-80">{step.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Games */}
      <section className="container py-20">
        <h2 className="mb-8 text-4xl sm:text-5xl">{t("landing.gamesTitle")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {games.map((g, i) => {
            const Icon = GAME_ICONS[i];
            return (
              <div key={g.name} className="tile p-5">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-dark">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="font-display text-xl">{g.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Parents */}
      <section className="container pb-20">
        <h2 className="mb-8 max-w-3xl text-4xl sm:text-5xl">{t("landing.parentsTitle")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parents.map((p, i) => {
            const Icon = PARENT_ICONS[i];
            return (
              <div key={p.title} className="flex gap-4 rounded-3xl bg-muted p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-lg">{p.title}</div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Always free */}
      <section className="container pb-20">
        <div className="grid items-center gap-8 rounded-[2rem] bg-success-soft p-8 md:grid-cols-[auto_1fr] md:p-12">
          <div className="font-display text-7xl leading-none text-success-dark sm:text-8xl" aria-hidden>
            €0
          </div>
          <div>
            <h2 className="mb-3 text-4xl sm:text-5xl">{t("landing.freeTitle")}</h2>
            <p className="mb-5 max-w-2xl text-lg text-muted-foreground">{t("landing.freeDesc")}</p>
            <ul className="flex flex-wrap gap-2">
              {freePoints.map((point) => (
                <li key={point} className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 font-medium">
                  <Check className="h-4 w-4 text-success-dark" strokeWidth={3} /> {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="container pb-20">
        <div className="grid items-center gap-8 rounded-[2rem] bg-primary p-8 text-primary-foreground md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <div className="mb-2 text-sm font-semibold opacity-90">{t("landing.schoolsEyebrow")}</div>
            <h2 className="mb-3 text-4xl text-primary-foreground sm:text-5xl">{t("landing.schoolsTitle")}</h2>
            <p className="max-w-2xl text-lg opacity-90">{t("landing.schoolsDesc")}</p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
            style={{ ["--depth-color" as string]: "hsl(var(--primary-dark))" }}
          >
            <Link to="/scholen/aanmelden">
              {t("landing.schoolsCta")} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-20">
        <h2 className="mb-6 text-4xl sm:text-5xl">{t("landing.faqTitle")}</h2>
        <Accordion type="single" collapsible className="tile max-w-3xl px-5">
          {faq.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-border last:border-b-0">
              <AccordionTrigger className="text-left font-display text-lg hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="container pb-20">
        <div className="flex flex-col items-center rounded-[2rem] bg-secondary px-6 py-14 text-center text-secondary-foreground">
          <Spark size={96} mood="happy" waving />
          <h2 className="mt-4 text-4xl text-secondary-foreground sm:text-5xl">{t("landing.finalTitle")}</h2>
          <p className="mb-8 mt-2 text-lg opacity-90">{t("landing.finalSubtitle")}</p>
          <Button asChild size="lg">
            <Link to="/auth?mode=signup">
              {t("landing.finalCta")} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
