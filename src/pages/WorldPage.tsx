import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { getWorld } from "@/content/lessons";
import { ChevronLeft, Check } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";

const PILLAR_BG: Record<string, string> = {
  safe: "from-primary-glow to-primary",
  smart: "from-secondary to-secondary",
  stronger: "from-accent to-accent",
};

export const WorldPage = () => {
  const params = useParams<{ worldId?: string; id?: string }>();
  const worldId = params.worldId ?? params.id;
  const navigate = useNavigate();
  const { completed } = useUserProgress();
  const baseWorld = getWorld(Number(worldId));
  const [overrides, setOverrides] = useState<Record<string, { title?: string | null; emoji?: string | null }>>({});

  useEffect(() => {
    supabase
      .from("lesson_overrides")
      .select("lesson_id, title, emoji")
      .then(({ data }) => {
        const map: Record<string, { title?: string | null; emoji?: string | null }> = {};
        (data ?? []).forEach((o: any) => (map[o.lesson_id] = { title: o.title, emoji: o.emoji }));
        setOverrides(map);
      });
  }, []);

  const world = baseWorld
    ? {
        ...baseWorld,
        lessons: baseWorld.lessons.map((l) => ({
          ...l,
          title: overrides[l.id]?.title?.trim() || l.title,
          emoji: overrides[l.id]?.emoji?.trim() || l.emoji,
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 md:py-8 max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 font-display">
          <ChevronLeft className="h-4 w-4" /> Dashboard
        </Link>

        <div className={`rounded-3xl bg-gradient-to-br ${PILLAR_BG[world.pillar]} p-6 sm:p-8 text-center mb-8 shadow-pop`}>
          <span className="text-5xl sm:text-6xl block mb-2" aria-hidden>{world.emoji}</span>
          <h1 className="font-display text-3xl sm:text-4xl text-white drop-shadow">Wereld {world.id}: {world.name}</h1>
          <p className="text-white/90 mt-1">{world.tagline}</p>
        </div>

        <ol className="relative space-y-5">
          {world.lessons.map((lesson, idx) => {
            const isDone = completed.has(lesson.id);
            const prevDone = idx === 0 || completed.has(world.lessons[idx - 1].id);
            const isNext = !isDone && prevDone;
            const offset = idx % 2 === 0 ? "sm:ml-0 sm:mr-auto" : "sm:ml-auto sm:mr-0";

            return (
              <motion.li
                key={lesson.id}
                className={`max-w-md ${offset}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.35, ease: "easeOut" }}
              >
                <motion.button
                  onClick={() => navigate(`/lesson/${lesson.id}`)}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full text-left rounded-3xl p-5 border-2 transition-shadow",
                    isDone && "bg-success/10 border-success shadow-soft",
                    !isDone && isNext && "bg-card border-primary shadow-pop classroom-shimmer",
                    !isDone && !isNext && "bg-card border-border shadow-soft hover:shadow-pop",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shrink-0",
                      isDone ? "bg-success text-success-foreground" : isNext ? "bg-primary/15" : "bg-muted",
                    )}>
                      {isDone ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Spark size={44} mood={isNext ? "pointing" : "happy"} animate={isNext} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-display text-muted-foreground">
                        Les {lesson.id} {isNext && <span className="ml-1 text-primary">· nu spelen</span>}
                      </div>
                      <div className="font-display text-base sm:text-lg line-clamp-2 leading-tight">{lesson.title}</div>
                    </div>
                  </div>
                </motion.button>
              </motion.li>
            );
          })}
        </ol>

        <div className="text-center mt-10">
          <Spark size={80} mood={world.lessons.every((l) => completed.has(l.id)) ? "celebrating" : "happy"} />
        </div>
      </main>
    </div>
  );
};

export default WorldPage;
