import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import {
  Shield,
  Brain,
  Rocket,
  Check,
  Sparkles,
  ShieldCheck,
  Heart,
  MessageSquareOff,
  PenLine,
  Lock,
  Laptop,
  Clock,
  Undo2,
  PlayCircle,
  HelpCircle,
  Star,
  Compass,
} from "lucide-react";

const Pillar = ({
  icon,
  emoji,
  name,
  desc,
  skills,
  sample,
  bg,
  text,
}: {
  icon: React.ReactNode;
  emoji: string;
  name: string;
  desc: string;
  skills: string[];
  sample: string;
  bg: string;
  text: string;
}) => (
  <div className={`rounded-3xl p-6 sm:p-8 shadow-soft hover:shadow-pop transition-bounce hover:-translate-y-1 ${bg} ${text}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="h-14 w-14 rounded-2xl bg-white/30 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-4xl" aria-hidden>{emoji}</span>
    </div>
    <h3 className="font-display text-3xl mb-2">{name}</h3>
    <p className="font-body text-base opacity-95 leading-relaxed mb-4">{desc}</p>
    <div className="rounded-2xl bg-white/20 p-4 mb-3">
      <p className="text-xs font-bold uppercase tracking-wide opacity-90 mb-2">Kids will learn to</p>
      <ul className="space-y-1.5">
        {skills.map((s) => (
          <li key={s} className="flex items-start gap-2 text-sm leading-snug">
            <Check className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
    <p className="text-xs font-semibold opacity-90 italic">{sample}</p>
  </div>
);

const TrustChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft">
    {icon}
    {label}
  </div>
);

const InsideStat = ({ n, label, desc }: { n: string; label: string; desc: string }) => (
  <div className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-pop transition-bounce">
    <div className="font-display text-5xl text-primary mb-1">{n}</div>
    <div className="font-display text-lg mb-2">{label}</div>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const HowStep = ({
  n,
  icon,
  title,
  desc,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="relative rounded-3xl bg-card border border-border p-6 shadow-soft">
    <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-primary text-primary-foreground font-display text-lg flex items-center justify-center shadow-pop">
      {n}
    </div>
    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
      {icon}
    </div>
    <h4 className="font-display text-lg mb-1.5">{title}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const ParentCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-pop transition-bounce hover:-translate-y-1">
    <div className="h-11 w-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-3">
      {icon}
    </div>
    <h4 className="font-display text-lg mb-1.5">{title}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

export const Landing = () => {
  const { t } = useTranslation();
  const teaserFeatures = t("landing.pricingTeaser.features", { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-cosmic rounded-full px-4 py-1.5 mb-6 text-sm font-semibold text-white shadow-pop">
              <Sparkles className="h-4 w-4" /> {t("landing.heroBadge")}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight mb-5">
              {t("landing.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-6">
              {t("landing.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-4">
              <Link to="/auth?mode=signup">
                <Button className="h-14 px-8 rounded-full text-base font-display bg-primary hover:bg-primary/90 shadow-pop">
                  🚀 {t("landing.ctaPrimary")}
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="h-14 px-8 rounded-full text-base font-display border-2">
                  {t("landing.ctaSecondary")}
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mb-5">{t("landing.heroMicroCopy")}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <TrustChip icon={<ShieldCheck className="h-3.5 w-3.5 text-success" />} label={t("landing.trustChips.gdpr")} />
              <TrustChip icon={<MessageSquareOff className="h-3.5 w-3.5 text-primary" />} label={t("landing.trustChips.noChat")} />
              <TrustChip icon={<Heart className="h-3.5 w-3.5 text-accent" />} label={t("landing.trustChips.parents")} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-110" aria-hidden />
              <Spark size={280} mood="happy" />
            </div>
            <div className="mt-4 inline-block bg-white/80 rounded-2xl px-4 py-2 shadow-soft text-sm font-semibold text-foreground">
              {t("landing.heroSparkLine")}
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-accent mb-3">{t("landing.problem.eyebrow")}</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-8">{t("landing.problem.title")}</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <p className="text-base text-muted-foreground leading-relaxed">{t("landing.problem.p1")}</p>
            <p className="text-base text-muted-foreground leading-relaxed">{t("landing.problem.p2")}</p>
            <p className="text-base text-muted-foreground leading-relaxed">{t("landing.problem.p3")}</p>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="container pb-20">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-wider text-primary mb-3">{t("landing.inside.eyebrow")}</p>
          <h2 className="font-display text-3xl sm:text-4xl">{t("landing.inside.title")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <InsideStat n={t("landing.inside.items.worlds.n")} label={t("landing.inside.items.worlds.label")} desc={t("landing.inside.items.worlds.desc")} />
          <InsideStat n={t("landing.inside.items.lessons.n")} label={t("landing.inside.items.lessons.label")} desc={t("landing.inside.items.lessons.desc")} />
          <InsideStat n={t("landing.inside.items.quizzes.n")} label={t("landing.inside.items.quizzes.label")} desc={t("landing.inside.items.quizzes.desc")} />
          <InsideStat n={t("landing.inside.items.certificate.n")} label={t("landing.inside.items.certificate.label")} desc={t("landing.inside.items.certificate.desc")} />
        </div>
      </section>

      {/* Pillars */}
      <section className="container pb-20">
        <h2 className="font-display text-3xl sm:text-4xl text-center mb-3">
          {t("landing.pillars.title")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          {t("landing.pillars.subtitle")}
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          <Pillar
            icon={<Shield className="h-7 w-7 text-white" />}
            emoji="🛡️"
            name={t("landing.pillars.safe.name")}
            desc={t("landing.pillars.safe.desc")}
            skills={t("landing.pillars.safe.skills", { returnObjects: true }) as string[]}
            sample={t("landing.pillars.safe.sample")}
            bg="bg-gradient-sky"
            text="text-primary-foreground"
          />
          <Pillar
            icon={<Brain className="h-7 w-7 text-secondary-foreground" />}
            emoji="🧠"
            name={t("landing.pillars.smart.name")}
            desc={t("landing.pillars.smart.desc")}
            skills={t("landing.pillars.smart.skills", { returnObjects: true }) as string[]}
            sample={t("landing.pillars.smart.sample")}
            bg="bg-gradient-sunshine"
            text="text-secondary-foreground"
          />
          <Pillar
            icon={<Rocket className="h-7 w-7 text-white" />}
            emoji="💪"
            name={t("landing.pillars.stronger.name")}
            desc={t("landing.pillars.stronger.desc")}
            skills={t("landing.pillars.stronger.skills", { returnObjects: true }) as string[]}
            sample={t("landing.pillars.stronger.sample")}
            bg="bg-gradient-coral"
            text="text-accent-foreground"
          />
        </div>
      </section>

      {/* How a lesson works */}
      <section className="container pb-20">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-wider text-accent mb-3">{t("landing.how.eyebrow")}</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-3">{t("landing.how.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("landing.how.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <HowStep n={1} icon={<Sparkles className="h-6 w-6" />} title={t("landing.how.steps.meet.title")} desc={t("landing.how.steps.meet.desc")} />
          <HowStep n={2} icon={<Compass className="h-6 w-6" />} title={t("landing.how.steps.discover.title")} desc={t("landing.how.steps.discover.desc")} />
          <HowStep n={3} icon={<PlayCircle className="h-6 w-6" />} title={t("landing.how.steps.play.title")} desc={t("landing.how.steps.play.desc")} />
          <HowStep n={4} icon={<HelpCircle className="h-6 w-6" />} title={t("landing.how.steps.quiz.title")} desc={t("landing.how.steps.quiz.desc")} />
          <HowStep n={5} icon={<Star className="h-6 w-6" />} title={t("landing.how.steps.star.title")} desc={t("landing.how.steps.star.desc")} />
        </div>
      </section>

      {/* Why parents */}
      <section className="container pb-20">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-wider text-primary mb-3">{t("landing.whyParents.eyebrow")}</p>
          <h2 className="font-display text-3xl sm:text-4xl max-w-3xl mx-auto">{t("landing.whyParents.title")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ParentCard icon={<MessageSquareOff className="h-5 w-5" />} title={t("landing.whyParents.items.noChat.title")} desc={t("landing.whyParents.items.noChat.desc")} />
          <ParentCard icon={<PenLine className="h-5 w-5" />} title={t("landing.whyParents.items.educators.title")} desc={t("landing.whyParents.items.educators.desc")} />
          <ParentCard icon={<Lock className="h-5 w-5" />} title={t("landing.whyParents.items.privacy.title")} desc={t("landing.whyParents.items.privacy.desc")} />
          <ParentCard icon={<Laptop className="h-5 w-5" />} title={t("landing.whyParents.items.devices.title")} desc={t("landing.whyParents.items.devices.desc")} />
          <ParentCard icon={<Clock className="h-5 w-5" />} title={t("landing.whyParents.items.time.title")} desc={t("landing.whyParents.items.time.desc")} />
          <ParentCard icon={<Undo2 className="h-5 w-5" />} title={t("landing.whyParents.items.refund.title")} desc={t("landing.whyParents.items.refund.desc")} />
        </div>
      </section>

      {/* Quote */}
      <section className="container pb-20">
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-sunshine p-10 md:p-14 shadow-pop text-center">
          <div className="font-display text-2xl sm:text-3xl md:text-4xl text-secondary-foreground leading-tight mb-4">
            "{t("landing.quote.text")}"
          </div>
          <p className="text-secondary-foreground/80 font-semibold">{t("landing.quote.byline")}</p>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="container">
        <div className="rounded-3xl bg-card border border-border shadow-pop p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary mb-3">{t("landing.pricingTeaser.eyebrow")}</p>
            <h2 className="font-display text-3xl sm:text-4xl mb-3">{t("landing.pricingTeaser.title")}</h2>
            <p className="text-muted-foreground mb-6">{t("landing.pricingTeaser.subtitle")}</p>
            <ul className="space-y-2 mb-6">
              {teaserFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-foreground">
                  <span className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-success" />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground italic mb-6">{t("landing.pricingTeaser.noPay")}</p>
            <Link to="/pricing">
              <Button className="h-14 px-8 rounded-full font-display bg-accent hover:bg-accent/90 text-accent-foreground shadow-pop">
                {t("landing.pricingTeaser.cta")} · {t("landing.pricingTeaser.price")}
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <div className="inline-block rounded-3xl bg-gradient-sunshine p-8 shadow-soft">
              <div className="font-display text-7xl text-secondary-foreground">€14</div>
              <div className="font-display text-secondary-foreground/80 mt-2">one-time · forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="container py-20">
        <div className="rounded-3xl bg-gradient-sky text-primary-foreground p-8 md:p-12 shadow-pop flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary-foreground/80 mb-2">{t("landing.schools.eyebrow")}</p>
            <h2 className="font-display text-3xl sm:text-4xl mb-2">{t("landing.schools.title")}</h2>
            <p className="text-primary-foreground/90 max-w-xl">{t("landing.schools.desc")}</p>
          </div>
          <Link to="/schools/contact">
            <Button className="h-14 px-8 rounded-full font-display bg-white text-primary hover:bg-white/90 shadow-pop">
              {t("landing.schools.cta")} →
            </Button>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-cosmic text-white p-10 md:p-16 shadow-pop text-center">
          <h2 className="font-display text-3xl sm:text-5xl mb-4">{t("landing.finalCta.title")}</h2>
          <p className="text-white/90 text-lg mb-8">{t("landing.finalCta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth?mode=signup">
              <Button className="h-14 px-8 rounded-full font-display bg-white text-primary hover:bg-white/90 shadow-pop text-base">
                🚀 {t("landing.finalCta.cta")}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="h-14 px-8 rounded-full font-display border-2 border-white text-white hover:bg-white/10 bg-transparent text-base">
                {t("landing.finalCta.secondary")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
