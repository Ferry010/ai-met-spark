import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Shield, Brain, Rocket, Check, Sparkles } from "lucide-react";

const Pillar = ({
  icon,
  emoji,
  name,
  desc,
  bg,
  text,
}: {
  icon: React.ReactNode;
  emoji: string;
  name: string;
  desc: string;
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
    <p className="font-body text-base opacity-95 leading-relaxed">{desc}</p>
  </div>
);

export const Landing = () => {
  const { t } = useTranslation();
  const features = [
    "12 fun, hand-crafted lessons",
    "No chat — kids never type to AI",
    "Personal certificate at the end",
    "Works on phone, tablet, and laptop",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/70 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold text-primary shadow-soft">
              <Sparkles className="h-4 w-4" /> For curious kids 8–12
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight mb-5">
              {t("landing.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-8">
              {t("landing.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
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
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-110" aria-hidden />
              <Spark size={280} mood="happy" />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container py-20">
        <h2 className="font-display text-3xl sm:text-4xl text-center mb-3">
          {t("landing.pillars.title")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Three worlds. Twelve lessons. One smarter kid.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          <Pillar
            icon={<Shield className="h-7 w-7 text-white" />}
            emoji="🛡️"
            name={t("landing.pillars.safe.name")}
            desc={t("landing.pillars.safe.desc")}
            bg="bg-gradient-sky"
            text="text-primary-foreground"
          />
          <Pillar
            icon={<Brain className="h-7 w-7 text-secondary-foreground" />}
            emoji="🧠"
            name={t("landing.pillars.smart.name")}
            desc={t("landing.pillars.smart.desc")}
            bg="bg-gradient-sunshine"
            text="text-secondary-foreground"
          />
          <Pillar
            icon={<Rocket className="h-7 w-7 text-white" />}
            emoji="💪"
            name={t("landing.pillars.stronger.name")}
            desc={t("landing.pillars.stronger.desc")}
            bg="bg-gradient-coral"
            text="text-accent-foreground"
          />
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="container">
        <div className="rounded-3xl bg-card border border-border shadow-pop p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl mb-3">{t("landing.pricingTeaser.title")}</h2>
            <p className="text-muted-foreground mb-6">{t("landing.pricingTeaser.subtitle")}</p>
            <ul className="space-y-2 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-foreground">
                  <span className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-success" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
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

      {/* Parents */}
      <section className="container pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-5xl mb-4 inline-block" aria-hidden>👨‍👩‍👧</span>
          <h2 className="font-display text-2xl sm:text-3xl mb-4">{t("landing.parents.title")}</h2>
          <p className="text-muted-foreground text-lg">{t("landing.parents.desc")}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
