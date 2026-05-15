import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { getWorld } from "@/content/lessons";
import { ChevronLeft } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { AdventureBackdrop } from "@/components/game/AdventureBackdrop";
import { LevelNode } from "@/components/game/LevelNode";

const WORLD_THEME: Record<string, "ocean" | "sun" | "lava"> = {
  safe: "ocean",
  smart: "sun",
  stronger: "lava",
};

export const WorldPage = () => {
  const params = useParams<{ worldId?: string; id?: string }>();
  const worldId = params.worldId ?? params.id;
  const navigate = useNavigate();
  const { completed, rows } = useUserProgress();
  const baseWorld = getWorld(Number(worldId));
  const [overrides, setOverrides] = useState<Record<string, { title?: string | null }>>({});

  useEffect(() => {
    supabase
      .from("lesson_overrides")
      .select("lesson_id, title")
      .then(({ data }) => {
        const map: Record<string, { title?: string | null }> = {};
        (data ?? []).forEach((o: any) => (map[o.lesson_id] = { title: o.title }));
        setOverrides(map);
      });
  }, []);

  const world = baseWorld
    ? {
        ...baseWorld,
        lessons: baseWorld.lessons.map((l) => ({
          ...l,
          title: overrides[l.id]?.title?.trim() || l.title,
        })),
      }
    : undefined;

  if (!world) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-12 text-center">
          <h1 className="font-display text-3xl">Wereld niet gevonden</h1>
          <Link to="/dashboard"><Button className="mt-4 rounded-full font-display">Terug naar start</Button></Link>
        </main>
      </div>
    );
  }

  const starsByLesson = new Map(rows.map((r: any) => [r.lesson_id, r.stars ?? 0]));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <AdventureBackdrop theme={WORLD_THEME[world.pillar] ?? "sky"} className="min-h-[calc(100vh-3.5rem)]">
        <main className="container py-6 md:py-8 max-w-2xl">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground mb-6 font-display">
            <ChevronLeft className="h-4 w-4" /> Terug naar kaart
          </Link>

          {/* World banner */}
          <div className="relative mb-10 text-center">
            <div className="inline-block rounded-full bg-foreground text-background font-display text-xs px-3 py-1 mb-2">
              WERELD {world.id}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-foreground drop-shadow-sm">
              {world.name}
            </h1>
            <p className="font-body text-foreground/70 mt-1">{world.tagline}</p>
          </div>

          {/* Winding level path */}
          <div className="relative mx-auto" style={{ maxWidth: 520 }}>
            {/* SVG winding path behind nodes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 100 1000"
              aria-hidden
            >
              <path
                d={generateWindingPath(world.lessons.length)}
                stroke="hsl(var(--foreground) / 0.25)"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <ol className="relative space-y-8 sm:space-y-10 py-4">
              {world.lessons.map((lesson, idx) => {
                const isDone = completed.has(lesson.id);
                const prevDone = idx === 0 || completed.has(world.lessons[idx - 1].id);
                const isNext = !isDone && prevDone;
                const state: "done" | "next" | "locked" | "future" = isDone
                  ? "done"
                  : isNext
                  ? "next"
                  : "locked";
                const side = idx % 2 === 0 ? "left" : "right";
                return (
                  <li
                    key={lesson.id}
                    className={side === "left" ? "flex justify-start pl-2 sm:pl-6" : "flex justify-end pr-2 sm:pr-6"}
                  >
                    <LevelNode
                      index={idx}
                      number={idx + 1}
                      
                      title={lesson.title}
                      state={state}
                      pillar={world.pillar}
                      side={side}
                      stars={starsByLesson.get(lesson.id)}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                    />
                  </li>
                );
              })}
            </ol>

            {/* World boss flag at bottom */}
            <div className="text-center mt-12">
              <div className="inline-flex flex-col items-center">
                <Spark
                  size={88}
                  mood={world.lessons.every((l) => completed.has(l.id)) ? "celebrating" : "happy"}
                />
                <div className="mt-2 px-3 py-1 rounded-md border-2 border-[hsl(36_60%_28%)] bg-gradient-to-b from-[hsl(48_100%_72%)] to-[hsl(36_100%_45%)] font-display text-xs uppercase tracking-wider text-[hsl(30_60%_18%)] shadow-pop">
                  Einde wereld
                </div>
              </div>
            </div>
          </div>
        </main>
      </AdventureBackdrop>
    </div>
  );
};

/** Generates a gentle winding path that snakes top-to-bottom. */
function generateWindingPath(lessonCount: number): string {
  const total = Math.max(2, lessonCount);
  const stepY = 1000 / total;
  let d = `M 50 20`;
  for (let i = 1; i <= total; i++) {
    const y = i * stepY;
    const x = i % 2 === 0 ? 25 : 75;
    const cx1 = i % 2 === 0 ? 80 : 20;
    const cy1 = y - stepY * 0.5;
    d += ` Q ${cx1} ${cy1} ${x} ${y}`;
  }
  return d;
}

export default WorldPage;
