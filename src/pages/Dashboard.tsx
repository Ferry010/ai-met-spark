import { Link, useNavigate } from "react-router-dom";
import { Lock, Star, Flame, Target, ArrowRight, Clock, Gamepad2, GraduationCap, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGameStats } from "@/hooks/useGameStats";
import { useFinalTest } from "@/hooks/useFinalTest";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { WORLDS, getWorld } from "@/content/missions";
import { BADGES } from "@/lib/badges";
import { PILLAR_THEME } from "@/lib/pillars";
import { isWorldUnlocked, nextUpMission, TOTAL_MISSIONS } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { rows, completed } = useUserProgress();
  const { stats, progress } = useGameStats();
  const final = useFinalTest();

  const starMap = new Map(rows.map((r) => [r.lesson_id, r.stars ?? 0]));
  const totalStars = [...starMap.values()].reduce((a, b) => a + b, 0);
  const next = nextUpMission(completed);
  const ctx = { completed, stars: starMap, finalPassed: final.passed };
  const earned = BADGES.filter((b) => b.earned(ctx)).length;
  const name = profile?.first_name;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <div className="mb-6 flex items-center gap-3">
          <Spark size={64} mood="happy" waving className="shrink-0" />
          <div>
            <h1 className="text-3xl sm:text-4xl">Hé{name ? ` ${name}` : ""}!</h1>
            <p className="text-muted-foreground">
              {next ? "Klaar voor je volgende missie?" : final.passed ? "Je bent een echte AI Smart Kid." : "Nog één stap: de eindtoets!"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            <ContinueCard
              next={next}
              finalPassed={final.passed}
              onGo={(to) => navigate(to)}
            />

            <section>
              <h2 className="mb-3 text-2xl">Werelden</h2>
              <div className="flex flex-col gap-3">
                {WORLDS.map((w) => {
                  const unlocked = isWorldUnlocked(w.id, completed);
                  const done = w.missions.filter((m) => completed.has(m.id)).length;
                  const wStars = w.missions.reduce((a, m) => a + (starMap.get(m.id) ?? 0), 0);
                  const theme = PILLAR_THEME[w.pillar];
                  const inner = (
                    <>
                      <span
                        className={cn(
                          "grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl",
                          unlocked ? theme.solid : "bg-muted grayscale",
                        )}
                        aria-hidden
                      >
                        {unlocked ? w.emoji : <Lock className="h-7 w-7 text-muted-foreground" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-xl">
                            Wereld {w.id}: {w.name}
                          </span>
                          <span className="shrink-0 text-sm font-medium text-muted-foreground">
                            {done}/{w.missions.length}
                          </span>
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {unlocked ? w.tagline : `Speel eerst Wereld ${w.id - 1} uit`}
                        </span>
                        <span className="mt-2 flex items-center gap-3">
                          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <span
                              className={cn("block h-full rounded-full", theme.bar)}
                              style={{ width: `${(done / w.missions.length) * 100}%` }}
                            />
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary-dark">
                            <Star className="h-4 w-4 fill-secondary text-secondary-dark" /> {wStars}
                          </span>
                        </span>
                      </span>
                    </>
                  );
                  return unlocked ? (
                    <Link
                      key={w.id}
                      to={`/world/${w.id}`}
                      className="press tile flex items-center gap-4 p-4 hover:bg-muted/50"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={w.id} className="tile flex items-center gap-4 p-4 opacity-75" aria-disabled>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Side column */}
          <aside className="flex flex-col gap-6">
            <div className="tile p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary font-display text-xl text-primary-foreground">
                  {progress.level}
                </span>
                <div>
                  <div className="font-display text-lg">Level {progress.level}</div>
                  <div className="text-sm text-muted-foreground">
                    Nog {Math.max(0, progress.xpForNext - progress.xpInLevel)} XP tot level {progress.level + 1}
                  </div>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress.pct}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <MiniStat icon={<Flame className="h-4 w-4" />} value={stats.streak_days} label={stats.streak_days === 1 ? "dag" : "dagen"} tone="text-accent-dark" />
                <MiniStat icon={<Star className="h-4 w-4 fill-current" />} value={totalStars} label="sterren" tone="text-secondary-dark" />
                <MiniStat icon={<Target className="h-4 w-4" />} value={`${completed.size}/${TOTAL_MISSIONS}`} label="missies" tone="text-primary-dark" />
              </div>
            </div>

            <div className="tile p-5">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-xl">Badges</h2>
                <span className="text-sm text-muted-foreground">
                  {earned}/{BADGES.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {BADGES.map((b) => {
                  const has = b.earned(ctx);
                  const Icon = b.icon;
                  return (
                    <div key={b.id} className="flex flex-col items-center gap-1 text-center" title={`${b.name}: ${b.description}`}>
                      <span
                        className={cn(
                          "grid h-12 w-12 place-items-center rounded-full",
                          has ? cn(b.tone, "animate-pop-in") : "bg-muted text-muted-foreground/50",
                        )}
                      >
                        {has ? <Icon className="h-6 w-6" /> : <Lock className="h-4 w-4" />}
                      </span>
                      <span className={cn("line-clamp-2 text-[11px] leading-tight", has ? "font-medium" : "text-muted-foreground")}>
                        {b.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const MiniStat = ({ icon, value, label, tone }: { icon: React.ReactNode; value: React.ReactNode; label: string; tone: string }) => (
  <div className="rounded-xl bg-muted px-2 py-2">
    <div className={cn("flex items-center justify-center gap-1 font-display text-lg", tone)}>
      {icon} {value}
    </div>
    <div className="text-[11px] text-muted-foreground">{label}</div>
  </div>
);

const ContinueCard = ({
  next,
  finalPassed,
  onGo,
}: {
  next: ReturnType<typeof nextUpMission>;
  finalPassed: boolean;
  onGo: (to: string) => void;
}) => {
  if (!next) {
    return (
      <div className="rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="mb-1 text-sm font-semibold opacity-90">{finalPassed ? "Gehaald!" : "Alle missies gehaald"}</div>
        <h2 className="mb-2 flex items-center gap-3 text-3xl sm:text-4xl">
          {finalPassed ? <Award className="h-9 w-9" /> : <GraduationCap className="h-9 w-9" />}
          {finalPassed ? "Je diploma" : "De eindtoets"}
        </h2>
        <p className="mb-5 opacity-90">
          {finalPassed ? "Bekijk en download je AI Smart Kid-diploma." : "10 vragen. Haal er 8 goed en je krijgt je diploma."}
        </p>
        <Button
          size="lg"
          onClick={() => onGo(finalPassed ? "/certificate" : "/final-test")}
          className="press bg-background text-foreground hover:bg-background/90"
          style={{ ["--depth-color" as string]: "hsl(var(--primary-dark))" }}
        >
          {finalPassed ? "Bekijk diploma" : "Start de eindtoets"} <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  const world = getWorld(next.worldId)!;
  const theme = PILLAR_THEME[next.pillar];
  return (
    <div className={cn("rounded-3xl p-6 sm:p-8", theme.solid)}>
      <div className="mb-1 text-sm font-semibold opacity-90">
        Ga verder · Wereld {world.id}: {world.name}
      </div>
      <h2 className="mb-2 flex items-center gap-3 text-3xl leading-tight sm:text-4xl">
        <span aria-hidden>{next.emoji}</span> {next.title}
      </h2>
      <div className="mb-5 flex flex-wrap gap-2 text-sm font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1">
          <Clock className="h-4 w-4" /> 3 min
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1">
          <Gamepad2 className="h-4 w-4" /> 2 games
        </span>
        {next.boss && <span className="rounded-full bg-foreground/90 px-3 py-1 text-background">Baas-missie</span>}
      </div>
      <Button
        size="lg"
        onClick={() => onGo(`/mission/${next.id}`)}
        className={cn("press bg-background text-foreground hover:bg-background/90", theme.press)}
      >
        Start missie <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Dashboard;
