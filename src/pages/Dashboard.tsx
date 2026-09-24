import { Link, useNavigate } from "react-router-dom";
import { Lock, Star, ArrowRight, Clock, Gamepad2, GraduationCap, Award, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGameStats } from "@/hooks/useGameStats";
import { useFinalTest } from "@/hooks/useFinalTest";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { WorldEmblem, WorldPortalArt, type StopState } from "@/components/WorldPortals";
import { C, Moon, SceneEdge, StarSky, Twinkle } from "@/components/scenes";
import { WORLDS, getWorld, type World } from "@/content/missions";
import { BADGES } from "@/lib/badges";
import { PILLAR_THEME } from "@/lib/pillars";
import { isWorldUnlocked, nextUpMission, TOTAL_MISSIONS } from "@/lib/progress";
import { cn } from "@/lib/utils";

const WORLD_TEXT: Record<World["pillar"], string> = {
  safe: "text-safe-dark",
  smart: "text-smart-dark",
  stronger: "text-stronger-dark",
};
const WORLD_BAR: Record<World["pillar"], string> = {
  safe: "bg-safe",
  smart: "bg-smart",
  stronger: "bg-stronger",
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { rows, completed } = useUserProgress();
  const { progress } = useGameStats();
  const final = useFinalTest();

  const starMap = new Map(rows.map((r) => [r.lesson_id, r.stars ?? 0]));
  const totalStars = [...starMap.values()].reduce((a, b) => a + b, 0);
  const next = nextUpMission(completed);
  const ctx = { completed, stars: starMap, finalPassed: final.passed };
  const earned = BADGES.filter((b) => b.earned(ctx)).length;
  const name = profile?.first_name;
  const left = TOTAL_MISSIONS - completed.size;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Night sky: greeting, journey and the next mission */}
      <section className="relative overflow-hidden bg-night pb-24 sm:pb-32">
        <StarSky seed={71} count={90}>
          <Moon x={1000} y={90} r={26} sky={C.night} />
          <Twinkle x={560} y={120} s={11} color={C.goldLight} />
        </StarSky>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-8 sm:pt-12 lg:grid-cols-[1fr_440px] lg:items-center">
          <div className="text-white">
            <div className="mb-3 flex items-center gap-4">
              <Spark size={80} mood="happy" waving className="shrink-0" />
              <h1 className="text-5xl leading-none text-white sm:text-6xl">Hé{name ? ` ${name}` : ""}!</h1>
            </div>
            <p className="mb-6 text-lg text-on-dark sm:text-xl">
              {next ? "Klaar voor je volgende missie?" : final.passed ? "Je bent een echte AI Smart Kid." : "Nog één stap: de eindtoets!"}
            </p>
            <div className="max-w-md">
              <div className="mb-2 flex justify-between font-display">
                <span>Jouw reis</span>
                <span>
                  {completed.size} van {TOTAL_MISSIONS} missies
                </span>
              </div>
              <div className="h-3.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${(completed.size / TOTAL_MISSIONS) * 100}%` }} />
              </div>
              <p className="mt-2 text-sm text-on-dark">
                {left > 0 ? `Nog ${left} ${left === 1 ? "missie" : "missies"} tot de eindtoets en je diploma.` : final.passed ? "Je diploma staat klaar." : "Alle missies gehaald!"}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-display text-sm">Level {progress.level}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-display text-sm">
                <Star className="h-4 w-4 fill-secondary text-secondary" /> {totalStars} sterren
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-display text-sm">
                <Award className="h-4 w-4 text-secondary" /> {earned}/{BADGES.length} badges
              </span>
            </div>
          </div>
          <ContinueCard next={next} finalPassed={final.passed} onGo={(to) => navigate(to)} />
        </div>
        <SceneEdge
          layers={[
            { base: 40, amp: 14, seed: 73, color: C.dusk2 },
            { base: 74, amp: 12, seed: 74, color: C.paper },
          ]}
        />
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <h2 className="mb-8 text-4xl sm:text-5xl">Jouw werelden</h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((w) => {
            const unlocked = isWorldUnlocked(w.id, completed);
            const done = w.missions.filter((m) => completed.has(m.id)).length;
            const states: StopState[] = w.missions.map((m) =>
              completed.has(m.id) ? "done" : unlocked && m.id === next?.id ? "current" : "open",
            );
            const wStars = w.missions.reduce((a, m) => a + (starMap.get(m.id) ?? 0), 0);
            const art = <WorldPortalArt world={w} states={states} locked={!unlocked} />;
            return (
              <article key={w.id} className="flex flex-col gap-5">
                {unlocked ? (
                  <Link to={`/world/${w.id}`} className="block rounded-[28px] transition-transform hover:-translate-y-1" aria-label={`Wereld ${w.name} openen`}>
                    {art}
                  </Link>
                ) : (
                  art
                )}
                <div className="flex flex-col gap-3 px-1">
                  <div>
                    <span className={cn("text-sm font-bold uppercase tracking-[0.1em]", WORLD_TEXT[w.pillar])}>Wereld {w.id}</span>
                    <h3 className="text-4xl leading-none">{w.name}</h3>
                  </div>
                  {!unlocked ? (
                    <p className="flex items-center gap-2 font-medium text-muted-foreground">
                      <Lock className="h-5 w-5" /> Op slot · haal eerst Wereld {getWorld(w.id - 1)?.name}
                    </p>
                  ) : done === w.missions.length ? (
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 96 101" className="h-9 w-9 shrink-0" aria-hidden>
                        <WorldEmblem pillar={w.pillar} />
                      </svg>
                      <div>
                        <div className="font-display text-lg">6/6 · uitgespeeld</div>
                        <div className="text-sm text-muted-foreground">{w.badgeName} verdiend</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 flex justify-between font-display">
                        <span>
                          {done}/{w.missions.length} missies
                        </span>
                        <span className="inline-flex items-center gap-1 text-secondary-dark">
                          <Star className="h-4 w-4 fill-secondary" /> {wStars}
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", WORLD_BAR[w.pillar])} style={{ width: `${(done / w.missions.length) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-16">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-3xl">Badges</h2>
            <span className="text-muted-foreground">
              {earned}/{BADGES.length}
            </span>
          </div>
          <div className="tile grid grid-cols-3 gap-4 p-5 sm:grid-cols-6 lg:grid-cols-11">
            {BADGES.map((b) => {
              const has = b.earned(ctx);
              const Icon = b.icon;
              return (
                <div key={b.id} className="flex flex-col items-center gap-1.5 text-center" title={`${b.name}: ${b.description}`}>
                  <span className={cn("grid h-12 w-12 place-items-center rounded-full", has ? cn(b.tone, "animate-pop-in") : "bg-muted text-muted-foreground/60")}>
                    {has ? <Icon className="h-6 w-6" /> : <Lock className="h-4 w-4" />}
                  </span>
                  <span className={cn("line-clamp-2 text-[11px] leading-tight", has ? "font-medium" : "text-muted-foreground")}>{b.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

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
      <div className="flex flex-col gap-4 rounded-[28px] bg-card p-6 shadow-[0_10px_0_rgb(0_0_0/0.25)]">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary-soft text-secondary-dark">
          {finalPassed ? <Award className="h-9 w-9" /> : <GraduationCap className="h-9 w-9" />}
        </span>
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.1em] text-secondary-dark">{finalPassed ? "Gehaald!" : "Alle missies gehaald"}</div>
          <h2 className="text-3xl leading-none">{finalPassed ? "Je diploma" : "De eindtoets"}</h2>
        </div>
        <p className="text-muted-foreground">
          {finalPassed ? "Bekijk en download je AI Smart Kid-diploma." : "10 vragen. Haal er 8 goed en je krijgt je diploma."}
        </p>
        <Button size="lg" variant="secondary" onClick={() => onGo(finalPassed ? "/certificate" : "/final-test")}>
          {finalPassed ? "Bekijk diploma" : "Start de eindtoets"} <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  const world = getWorld(next.worldId)!;
  return (
    <div className="flex flex-col gap-4 rounded-[28px] bg-card p-6 shadow-[0_10px_0_rgb(0_0_0/0.25)]">
      <div className="flex items-center gap-4">
        <span className={cn("grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[22px]", PILLAR_THEME[next.pillar].soft)}>
          <svg viewBox="0 0 96 101" className="h-12 w-12" aria-hidden>
            <WorldEmblem pillar={next.pillar} />
          </svg>
        </span>
        <div className="min-w-0">
          <div className={cn("text-sm font-bold uppercase tracking-[0.1em]", WORLD_TEXT[next.pillar])}>
            {next.boss ? "Baas-missie" : "Volgende missie"} · Wereld {world.name}
          </div>
          <h2 className="text-3xl leading-none">{next.title}</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-sm font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
          <Clock className="h-4 w-4" /> 3 min
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
          <Gamepad2 className="h-4 w-4" /> 2 games
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-soft px-3 py-1.5 text-secondary-foreground">
          {next.boss ? <Crown className="h-4 w-4" /> : <Star className="h-4 w-4" />} 3 sterren te winnen
        </span>
      </div>
      <Button size="lg" variant="secondary" onClick={() => onGo(`/mission/${next.id}`)}>
        Start missie <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Dashboard;
