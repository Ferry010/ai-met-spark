import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { BadgeDisplay } from "@/components/classroom/BadgeDisplay";
import { Download, CheckCircle2, Star } from "lucide-react";
import { ALL_LESSONS } from "@/content/lessons";

const COMPLETED = 11;
const TOTAL = ALL_LESSONS.length;

const TIMELINE = [
  { id: "2.3", title: "Vraag goed, krijg goed antwoord", date: "vandaag", stars: 3 },
  { id: "2.2", title: "Spot een hallucinatie", date: "gisteren", stars: 2 },
  { id: "2.1", title: "Wat AI niet weet", date: "2 dagen geleden", stars: 3 },
  { id: "1.8", title: "Baas-test wereld 1", date: "3 dagen geleden", stars: 3 },
  { id: "1.7", title: "Wanneer vraag je een volwassene?", date: "4 dagen geleden", stars: 2 },
  { id: "1.6", title: "Wat AI NIET mag weten", date: "5 dagen geleden", stars: 3 },
  { id: "1.5", title: "Scams en oplichting met AI", date: "1 week geleden", stars: 2 },
  { id: "1.4", title: "Spot de nep: video's en stemmen", date: "1 week geleden", stars: 3 },
  { id: "1.3", title: "Spot de nep: plaatjes", date: "1 week geleden", stars: 3 },
  { id: "1.2", title: "Jouw geheimen zijn van jou", date: "2 weken geleden", stars: 3 },
];

export const ParentPreview = () => {
  const pct = Math.round((COMPLETED / TOTAL) * 100);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-3xl py-10 pb-32">
        <div className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
          Ouder-rapport, voorbeeld
        </div>
        <h1 className="font-display text-3xl">Mila van Dijk</h1>
        <p className="text-muted-foreground mt-1">10 jaar, groep 7A, OBS De Regenboog</p>

        <section className="mt-8 rounded-3xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-xl">Voortgang</h2>
            <span className="font-display text-2xl">
              {COMPLETED}<span className="text-muted-foreground text-base">/{TOTAL}</span>
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Mila is goed bezig en zit nu in wereld 2, SLIM. {pct}% van de hele cursus klaar.
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h2 className="font-display text-xl mb-4">Badges</h2>
          <div className="grid grid-cols-3 gap-4 classroom-theme">
            <BadgeDisplay kind="schild" earned={true} />
            <BadgeDisplay kind="kompas" earned={false} />
            <BadgeDisplay kind="ster" earned={false} />
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h2 className="font-display text-xl mb-4">Laatste 10 lessen</h2>
          <ol className="space-y-3">
            {TIMELINE.map((t) => (
              <li key={t.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm truncate">Les {t.id}, {t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < t.stars ? "h-4 w-4 fill-secondary text-secondary" : "h-4 w-4 text-muted-foreground/30"}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 flex justify-end">
          <Button className="rounded-full font-display gap-2 h-12 px-6">
            <Download className="h-4 w-4" /> Download rapport
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ParentPreview;
