import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Ban, Gift, MessageSquareOff, Quote, Sparkles } from "lucide-react";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

const CHIP_ICONS = [Gift, Ban, MessageSquareOff];

const About = () => {
  const { t } = useTranslation();
  const paragraphs = t("about.paragraphs", { returnObjects: true }) as string[];
  const chips = t("about.chips", { returnObjects: true }) as string[];
  const punchlines = [t("about.punchline1"), t("about.punchline2")];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="container grid items-center gap-10 py-12 md:grid-cols-[1fr_auto] md:py-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary-dark">
            <Sparkles className="h-4 w-4" /> {t("about.eyebrow")}
          </span>
          <h1 className="mb-5 max-w-3xl text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">{t("about.title")}</h1>
          <p className="mb-8 max-w-xl text-lg text-muted-foreground sm:text-xl">{t("about.subtitle")}</p>
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip, i) => {
              const Icon = CHIP_ICONS[i] ?? Sparkles;
              return (
                <li key={chip} className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 font-medium">
                  <Icon className="h-4 w-4 text-primary" /> {chip}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mx-auto flex w-full max-w-xs flex-col items-center rounded-[2rem] bg-primary p-8 text-center text-primary-foreground">
          <div className="tile mb-5 rounded-2xl px-4 py-3 font-display text-lg text-foreground">{t("about.sparkBubble")}</div>
          <Spark size={140} mood="happy" waving />
        </div>
      </section>

      {/* Story */}
      <section className="container pb-16">
        <article className="mx-auto max-w-2xl space-y-5 text-lg leading-relaxed">
          {paragraphs.map((p, i) =>
            punchlines.includes(p) ? (
              <p key={i} className="py-2 font-display text-3xl leading-tight text-primary sm:text-4xl">
                {p}
              </p>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </article>
      </section>

      {/* Pull quote */}
      <section className="container pb-16">
        <figure className="mx-auto max-w-4xl rounded-[2rem] bg-secondary px-6 py-10 text-secondary-foreground sm:px-12 sm:py-14">
          <Quote className="mb-4 h-10 w-10" />
          <blockquote className="font-display text-3xl leading-tight sm:text-4xl">{t("about.pullQuote")}</blockquote>
          <figcaption className="mt-6 font-display text-lg opacity-80">{t("about.signature")}</figcaption>
        </figure>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[2rem] bg-muted px-6 py-12 text-center">
          <Spark size={80} mood="happy" />
          <h2 className="mt-4 text-4xl sm:text-5xl">{t("about.ctaTitle")}</h2>
          <p className="mb-8 mt-2 max-w-lg text-lg text-muted-foreground">{t("about.ctaSubtitle")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/auth?mode=signup">
                {t("common.tryFree")} <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/">{t("about.ctaSecondary")}</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t("about.ctaMicro")}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
