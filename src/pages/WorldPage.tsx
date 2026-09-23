import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Lock, Star, Crown, Check } from "lucide-react";
import { getWorld } from "@/content/missions";
import { useUserProgress } from "@/hooks/useUserProgress";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { PILLAR_THEME } from "@/lib/pillars";
import { isMissionUnlocked, isWorldUnlocked } from "@/lib/progress";
import { cn } from "@/lib/utils";

// Horizontal offsets that make the path zig-zag.
const OFFSETS = [0, 56, 84, 56, 0, -56];

export const WorldPage = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const world = getWorld(Number(worldId));
  const { rows, completed, isLoading } = useUserProgress();

  if (!world) return <Navigate to="/dashboard" replace />;
  if (!isLoading && !isWorldUnlocked(world.id, completed)) return <Navigate to="/dashboard" replace />;

  const theme = PILLAR_THEME[world.pillar];
  const stars = new Map(rows.map((r) => [r.lesson_id, r.stars ?? 0]));
  const done = world.missions.filter((m) => completed.has(m.id)).length;
  const currentId = world.missions.find((m) => !completed.has(m.id))?.id;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className={cn(theme.solid)}>
        <div className="mx-auto max-w-2xl px-4 pb-8 pt-4">
          <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm font-medium opacity-90 hover:opacity-100">
            <ChevronLeft className="h-4 w-4" /> Alle werelden
          </Link>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-background/20 text-4xl" aria-hidden>
              {world.emoji}
            </span>
            <div>
              <div className="text-sm font-semibold opacity-90">Wereld {world.id}</div>
              <h1 className="text-4xl leading-none">{world.name}</h1>
              <p className="mt-1 opacity-90">{world.tagline}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-background/25">
              <div className="h-full rounded-full bg-background" style={{ width: `${(done / world.missions.length) * 100}%` }} />
            </div>
            <span className="text-sm font-semibold">
              {done}/{world.missions.length} missies
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <ol className="flex flex-col items-center gap-6">
          {world.missions.map((m, i) => {
            const isDone = completed.has(m.id);
            const unlocked = isMissionUnlocked(m, completed);
            const isCurrent = m.id === currentId;
            const s = stars.get(m.id) ?? 0;
            return (
              <li key={m.id} className="flex flex-col items-center" style={{ transform: `translateX(${OFFSETS[i % OFFSETS.length]}px)` }}>
                {isCurrent && (
                  <span className={cn("mb-2 rounded-xl border-2 bg-card px-3 py-1 font-display text-sm", theme.border, theme.text)}>
                    Start
                  </span>
                )}
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => navigate(`/mission/${m.id}`)}
                  aria-label={`Missie ${m.id}: ${m.title}${isDone ? `, ${s} sterren` : unlocked ? "" : ", op slot"}`}
                  className={cn(
                    "press relative grid place-items-center rounded-full text-3xl",
                    m.boss ? "h-24 w-24" : "h-20 w-20",
                    unlocked ? cn(theme.solid, theme.press) : "bg-muted text-muted-foreground",
                    isCurrent && "animate-node-pulse",
                  )}
                >
                  {!unlocked ? (
                    <Lock className="h-7 w-7" />
                  ) : isDone && !m.boss ? (
                    <Check className="h-9 w-9" strokeWidth={3} />
                  ) : m.boss ? (
                    <Crown className="h-10 w-10" />
                  ) : (
                    <span aria-hidden>{m.emoji}</span>
                  )}
                </button>
                <div className="mt-2 flex gap-0.5" aria-hidden>
                  {[1, 2, 3].map((n) => (
                    <Star
                      key={n}
                      className={cn("h-4 w-4", n <= s ? "fill-secondary text-secondary-dark" : "fill-muted text-border-strong")}
                    />
                  ))}
                </div>
                <div className={cn("mt-1 max-w-[180px] text-center text-sm font-medium leading-tight", !unlocked && "text-muted-foreground")}>
                  {m.title}
                </div>
              </li>
            );
          })}
        </ol>

        {done === world.missions.length && (
          <div className="tile mt-10 flex items-center gap-4 p-5">
            <Spark size={64} mood="celebrating" className="shrink-0" />
            <div className="flex-1">
              <div className="font-display text-xl">Wereld {world.name} uitgespeeld!</div>
              <p className="text-sm text-muted-foreground">Je hebt de badge "{world.badgeName}" verdiend.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorldPage;
