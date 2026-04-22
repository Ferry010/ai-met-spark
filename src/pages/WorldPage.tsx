import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { PaywallDialog } from "@/components/PaywallDialog";
import { getWorld } from "@/content/lessons";
import { ChevronLeft, Lock, Check } from "lucide-react";

const PILLAR_BG: Record<string, string> = {
  safe: "from-primary-glow to-primary",
  smart: "from-secondary to-secondary",
  stronger: "from-accent to-accent",
};

export const WorldPage = () => {
  const params = useParams<{ worldId?: string; id?: string }>();
  const worldId = params.worldId ?? params.id;
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const baseWorld = getWorld(Number(worldId));
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [paywall, setPaywall] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, { title?: string | null; emoji?: string | null }>>({});

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .then(({ data }) => setCompleted(new Set((data ?? []).map((r: any) => r.lesson_id))));
    supabase
      .from("lesson_overrides")
      .select("lesson_id, title, emoji")
      .then(({ data }) => {
        const map: Record<string, { title?: string | null; emoji?: string | null }> = {};
        (data ?? []).forEach((o: any) => (map[o.lesson_id] = { title: o.title, emoji: o.emoji }));
        setOverrides(map);
      });
  }, [user]);

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

  const isPaid = !!profile?.paid;

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
            const isFirstFreeLesson = world.id === 1 && lesson.id === "1.1";
            const locked = !isFirstFreeLesson && !isPaid;
            const isDone = completed.has(lesson.id);
            const offset = idx % 2 === 0 ? "sm:ml-0 sm:mr-auto" : "sm:ml-auto sm:mr-0";

            return (
              <li key={lesson.id} className={`max-w-md ${offset}`}>
                <button
                  onClick={() => {
                    if (locked) setPaywall(true);
                    else navigate(`/lesson/${lesson.id}`);
                  }}
                  className={`w-full text-left rounded-3xl p-5 border-2 transition-bounce hover:-translate-y-1 ${
                    isDone
                      ? "bg-success/10 border-success shadow-soft"
                      : locked
                      ? "bg-muted/50 border-border"
                      : "bg-card border-primary shadow-soft hover:shadow-pop"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                      isDone ? "bg-success text-success-foreground" : locked ? "bg-muted" : "bg-primary/10"
                    }`}>
                      {isDone ? (
                        <Check className="h-6 w-6" />
                      ) : locked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Spark size={44} mood="pointing" animate={false} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-display text-muted-foreground">Les {lesson.id}</div>
                      <div className="font-display text-base sm:text-lg line-clamp-2 leading-tight">{lesson.title}</div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="text-center mt-10">
          <Spark size={80} mood={world.lessons.every((l) => completed.has(l.id)) ? "celebrating" : "happy"} />
        </div>
      </main>
      <PaywallDialog open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
};

export default WorldPage;
