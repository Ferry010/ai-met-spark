import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { WORLDS, ALL_LESSONS } from "@/content/lessons";
import { useToast } from "@/hooks/use-toast";
import { BADGES } from "@/lib/badges";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGameStats } from "@/hooks/useGameStats";
import { AdventureBackdrop } from "@/components/game/AdventureBackdrop";
import { IslandTile } from "@/components/game/IslandTile";
import { Scoreboard } from "@/components/game/Scoreboard";
import { BossGate } from "@/components/game/BossGate";
import { cn } from "@/lib/utils";

export const Dashboard = () => {
  const { profile, user } = useAuth();
  const { completed } = useUserProgress();
  const { stats, progress } = useGameStats();
  const [finalPassed, setFinalPassed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("final_test_attempts")
      .select("passed")
      .eq("user_id", user.id)
      .eq("passed", true)
      .limit(1)
      .then(({ data }) => setFinalPassed((data ?? []).length > 0));
  }, [user]);

  const totalDone = completed.size;
  const totalLessons = ALL_LESSONS.length;
  const allDone = totalDone === totalLessons;

  const worldProgress = WORLDS.map((w) => ({
    ...w,
    done: w.lessons.filter((l) => completed.has(l.id)).length,
    locked: w.id > 1 && !WORLDS[w.id - 2].lessons.every((l) => completed.has(l.id)),
  }));

  const handleWorld = (worldId: number, locked: boolean) => {
    if (locked) {
      toast({ title: "Op slot!", description: `Maak eerst Wereld ${worldId - 1} af.` });
      return;
    }
    navigate(`/world/${worldId}`);
  };

  const ctx = { completed, finalPassed };
  const earnedCount = BADGES.filter((b) => b.earned(ctx)).length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <AdventureBackdrop theme="sky" className="min-h-[calc(100vh-3.5rem)]">
        <main className="container py-6 md:py-8 max-w-5xl">
          {/* Greeting + scoreboard */}
          <div className="grid sm:grid-cols-[auto_1fr] gap-5 items-center mb-8">
            <div className="flex items-center gap-3">
              <Spark size={96} mood={allDone ? "celebrating" : "happy"} waving />
              <div className="relative max-w-[200px] rounded-2xl bg-white border-2 border-foreground/10 px-3 py-2 shadow-pop">
                <div className="text-[11px] uppercase tracking-wider font-display text-primary">Spark zegt</div>
                <div className="font-display text-sm leading-tight">
                  {allDone ? "WOW! Alles uit. Naar de eindbaas?" : `Hé ${profile?.first_name ?? "vriend"}, klaar voor avontuur?`}
                </div>
                <div className="absolute -left-2 bottom-4 h-3 w-3 rotate-45 bg-white border-l-2 border-b-2 border-foreground/10" />
              </div>
            </div>

            <Scoreboard
              level={progress.level}
              xp={stats.xp}
              pct={progress.pct}
              xpToNext={Math.max(0, progress.xpForNext - progress.xpInLevel)}
              streak={stats.streak_days}
              longestCombo={stats.longest_combo}
            />
          </div>

          {/* Adventure islands path */}
          <section className="relative mb-12">
            <h2 className="font-display text-2xl mb-4 text-center text-foreground/80">
              Kies je avontuur
            </h2>

            {/* Dashed connecting path (desktop) */}
            <svg
              className="hidden md:block absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none"
              height="80"
              viewBox="0 0 800 80"
              preserveAspectRatio="none"
              style={{ width: "100%" }}
              aria-hidden
            >
              <path
                d="M 60 40 Q 200 -10 400 40 T 740 40"
                stroke="hsl(var(--primary) / 0.4)"
                strokeWidth="6"
                strokeDasharray="4 14"
                strokeLinecap="round"
                fill="none"
                className="animate-path-march"
              />
            </svg>

            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2 place-items-center">
              {worldProgress.map((w, idx) => (
                <IslandTile
                  key={w.id}
                  index={idx}
                  worldNumber={w.id}
                  
                  name={w.name}
                  done={w.done}
                  total={w.lessons.length}
                  locked={w.locked}
                  pillar={w.pillar}
                  onClick={() => handleWorld(w.id, w.locked)}
                />
              ))}
            </div>
          </section>

          {/* Badges as collectible coins */}
          <section className="mb-12">
            <div className="flex items-end justify-between mb-3">
              <h2 className="font-display text-2xl">Verzamelboek</h2>
              <span className="font-display text-sm text-foreground/60">
                {earnedCount} / {BADGES.length}
              </span>
            </div>
            <div className="rounded-3xl bg-white/70 backdrop-blur-sm border-2 border-foreground/10 p-4 sm:p-5 shadow-soft">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3">
                {BADGES.map((b) => {
                  const earned = b.earned(ctx);
                  const initial = b.name.trim().charAt(0).toUpperCase();
                  return (
                    <div key={b.id} title={`${b.name} — ${b.description}`} className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ rotate: earned ? 12 : 0, scale: earned ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 220, damping: 14 }}
                        className={cn(
                          "h-14 w-14 rounded-full border-4 grid place-items-center font-display text-xl",
                          earned
                            ? "border-[hsl(36_60%_30%)] bg-gradient-to-br from-[hsl(48_100%_72%)] via-[hsl(45_100%_58%)] to-[hsl(36_100%_45%)] text-[hsl(30_60%_18%)] shadow-pop animate-coin-shine"
                            : "border-foreground/15 bg-muted text-muted-foreground/40 opacity-60",
                        )}
                      >
                        <span aria-hidden>{earned ? initial : "?"}</span>
                      </motion.div>
                      <div className={cn(
                        "mt-1.5 text-[10px] font-display leading-tight text-center max-w-[68px] truncate",
                        earned ? "text-foreground" : "text-foreground/40",
                      )}>
                        {b.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Boss gate */}
          <section className="pb-10">
            <BossGate unlocked={allDone} totalDone={totalDone} totalLessons={totalLessons} />
          </section>
        </main>
      </AdventureBackdrop>
    </div>
  );
};

export default Dashboard;
