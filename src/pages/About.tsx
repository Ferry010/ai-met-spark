import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Gift, Users, Heart as HeartIcon, Heart, Sparkles, Quote } from "lucide-react";

const About = () => {
  const { t } = useTranslation();
  const paragraphs = t("about.paragraphs", { returnObjects: true }) as string[];
  const chips = t("about.chips", { returnObjects: true }) as string[];
  const chipIcons = [Gift, Users, HeartIcon];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 pointer-events-none" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        <div className="container relative py-12 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-foreground shadow-soft mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t("about.eyebrow")}
            </div>
            <h1 className="font-display text-4xl sm:text-6xl leading-tight mb-4">
              {t("about.title")}
            </h1>
            <p className="font-body text-lg sm:text-xl text-foreground/75 leading-relaxed">
              {t("about.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {chips.map((chip, i) => {
                const Icon = chipIcons[i] ?? Sparkles;
                return (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-foreground shadow-soft"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {chip}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Spark intro bubble */}
          <div className="flex items-start gap-3 mb-10">
            <Spark size={56} animate />
            <div className="rounded-2xl rounded-tl-sm bg-card border border-border/60 shadow-soft px-4 py-3">
              <p className="font-display text-base text-foreground">
                {t("about.sparkBubble")}
              </p>
            </div>
          </div>

          <article className="space-y-5 font-body text-lg leading-relaxed text-foreground/90">
            {paragraphs.map((p, i) => {
              const isPunchline =
                p === t("about.punchline1") || p === t("about.punchline2");
              if (isPunchline) {
                return (
                  <p
                    key={i}
                    className="font-display text-2xl sm:text-3xl text-primary leading-snug py-2"
                  >
                    {p}
                  </p>
                );
              }
              return <p key={i}>{p}</p>;
            })}
          </article>

          {/* Pull quote */}
          <figure className="my-12 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 p-6 sm:p-8 shadow-soft">
            <Quote className="h-8 w-8 text-primary mb-3" />
            <blockquote className="font-display text-xl sm:text-2xl leading-snug text-foreground">
              {t("about.pullQuote")}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" />
              {t("about.signature")}
            </figcaption>
          </figure>

          {/* CTA */}
          <div className="rounded-3xl bg-card border border-border/60 shadow-soft p-6 sm:p-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl mb-2">
              {t("about.ctaTitle")}
            </h2>
            <p className="font-body text-base text-foreground/75 mb-5">
              {t("about.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="font-display rounded-full px-6 h-12 text-base bg-primary hover:bg-primary/90 shadow-soft w-full sm:w-auto"
                >
                  {t("common.tryFree")} →
                </Button>
              </Link>
              <Link to="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-display rounded-full px-6 h-12 text-base w-full sm:w-auto"
                >
                  {t("about.ctaSecondary")}
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("about.ctaMicro")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
