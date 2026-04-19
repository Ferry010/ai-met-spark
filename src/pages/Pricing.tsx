import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Star } from "lucide-react";

interface FAQItem { q: string; a: string }

export const Pricing = () => {
  const { t } = useTranslation();
  const indFeatures = t("pricing.individual.features", { returnObjects: true }) as string[];
  const schoolFeatures = t("pricing.schools.features", { returnObjects: true }) as string[];
  const includedItems = t("pricing.included.items", { returnObjects: true }) as string[];
  const faq = t("pricing.faq.items", { returnObjects: true }) as FAQItem[];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="container pt-12 pb-6 text-center">
        <h1 className="font-display text-4xl sm:text-5xl mb-3">{t("pricing.title")}</h1>
        <p className="text-muted-foreground text-lg mb-3">{t("pricing.subtitle")}</p>
        <p className="text-base text-foreground/80 max-w-2xl mx-auto">{t("pricing.intro")}</p>
      </section>

      <section className="container py-10 grid md:grid-cols-2 gap-6 max-w-5xl">
        {/* Individual */}
        <div className="relative rounded-3xl bg-card border-2 border-primary shadow-pop p-8 flex flex-col">
          <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="h-3 w-3" /> Most popular
          </div>
          <h2 className="font-display text-2xl mb-1">{t("pricing.individual.name")}</h2>
          <p className="text-sm text-muted-foreground mb-5">{t("pricing.individual.tagline")}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-display text-5xl">{t("pricing.individual.price")}</span>
            <span className="text-muted-foreground">{t("pricing.individual.billing")}</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {indFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-success" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link to="/auth?mode=signup">
            <Button className="w-full h-14 rounded-full font-display text-base bg-primary hover:bg-primary/90 shadow-soft">
              {t("pricing.individual.cta")}
            </Button>
          </Link>
        </div>

        {/* Schools */}
        <div className="rounded-3xl bg-card border border-border shadow-soft p-8 flex flex-col">
          <h2 className="font-display text-2xl mb-1">{t("pricing.schools.name")}</h2>
          <p className="text-sm text-muted-foreground mb-1">{t("pricing.schools.tagline")}</p>
          <p className="text-xs font-semibold text-primary mb-5">{t("pricing.schools.bestFor")}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-display text-5xl">{t("pricing.schools.price")}</span>
            <span className="text-muted-foreground">{t("pricing.schools.billing")}</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {schoolFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="h-6 w-6 rounded-full bg-secondary/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-secondary-foreground" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link to="/schools/contact">
            <Button variant="outline" className="w-full h-14 rounded-full font-display text-base border-2">
              {t("pricing.schools.cta")} →
            </Button>
          </Link>
        </div>
      </section>

      {/* What's included strip */}
      <section className="container max-w-5xl pb-10">
        <div className="rounded-3xl bg-gradient-sunshine p-8 shadow-soft">
          <h3 className="font-display text-xl text-secondary-foreground text-center mb-5">
            {t("pricing.included.title")}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {includedItems.map((item) => (
              <div key={item} className="flex items-start gap-2 text-secondary-foreground">
                <span className="h-6 w-6 rounded-full bg-white/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4" />
                </span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16 max-w-3xl">
        <h2 className="font-display text-3xl text-center mb-8">{t("pricing.faq.title")}</h2>
        <Accordion type="single" collapsible className="rounded-2xl bg-card border border-border shadow-soft px-6">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-b last:border-b-0 border-border/60">
              <AccordionTrigger className="font-display text-lg text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
