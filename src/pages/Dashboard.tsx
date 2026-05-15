import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WORLDS, ALL_LESSONS } from "@/content/lessons";
import { Lock, Star, Award, Flame, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BADGES, TONE_BG } from "@/lib/badges";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGameStats } from "@/hooks/useGameStats";

const PILLAR_BG: Record<string, string> = {
  safe: "bg-gradient-sky text-primary-foreground",
  smart: "bg-gradient-sunshine text-secondary-foreground",
  stronger: "bg-gradient-coral text-accent-foreground",
};

export const Dashboard = () => {
  const { profile, user } = useAuth();
  const { completed } = useUserProgress();
  const { stats, progress } = useGameStats();
  const [finalPassed, setFinalPassed] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 md:py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-6">
          <Spark size={88} mood={allDone ? "celebrating" : "happy"} />
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl">
              Hoi {profile?.first_name ?? "vriend"}! Klaar om slimmer te worden?
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalDone} van {totalLessons} lessen gedaan
            </p>
          </div>
        </div>

        {/* Stats card */}
        <div className="mb-8 rounded-3xl bg-gradient-cosmic text-primary-foreground p-5 sm:p-6 shadow-pop">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground h-10 w-10 font-display font-bold shadow-soft">
                {progress.level}
              </span>
              <div>
                <div className="font-display text-lg leading-tight">Niveau {progress.level}</div>
                <div className="text-xs opacity-90">{stats.xp} XP totaal</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-background/20 px-3 py-1 font-display text-sm">
                <Flame className="h-4 w-4" /> {stats.streak_days} dag{stats.streak_days === 1 ? "" : "en"}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-background/20 px-3 py-1 font-display text-sm">
                <Sparkles className="h-4 w-4" /> Beste combo {stats.longest_combo}
              </span>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-background/25 overflow-hidden">
            <motion.div
              className="h-full bg-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress.pct}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            />
          </div>
          <div className="mt-1 text-[11px] opacity-80 font-display">
            Nog {Math.max(0, progress.xpForNext - progress.xpInLevel)} XP tot niveau {progress.level + 1}
          </div>
        </div>

        <Progress value={(totalDone / totalLessons) * 100} className="h-3 mb-10" />

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {worldProgress.map((w, idx) => {
            const pct = Math.round((w.done / w.lessons.length) * 100);
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                whileHover={{ y: -6, rotate: -0.5 }}
              >
                <Link
                  to={w.locked ? "#" : `/world/${w.id}`}
                  onClick={(e) => {
                    if (w.locked) {
                      e.preventDefault();
                      toast({ title: "Op slot!", description: `Maak eerst Wereld ${w.id - 1} af.` });
                    }
                  }}
                  className={`block rounded-3xl p-5 sm:p-6 shadow-soft hover:shadow-pop ${PILLAR_BG[w.pillar]} ${w.locked ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl sm:text-5xl" aria-hidden>{w.emoji}</span>
                    {w.locked && <Lock className="h-6 w-6" />}
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl mb-1">Wereld {w.id}: {w.name}</h2>
                  <p className="text-sm opacity-90 mb-4">{w.tagline}</p>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{w.done} / {w.lessons.length} klaar</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/30 overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + idx * 0.08 }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <section className="mb-10">
          {(() => {
            const ctx = { completed, finalPassed };
            const earnedCount = BADGES.filter((b) => b.earned(ctx)).length;
            return (
              <>
                <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
                  <Award className="h-6 w-6 text-secondary-foreground" /> Je badges
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {earnedCount} van {BADGES.length} verdiend
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {BADGES.map((b) => {
                    const earned = b.earned(ctx);
                    const Icon = b.icon;
                    return (
                      <div
                        key={b.id}
                        title={b.description}
                        className={`rounded-2xl p-3 sm:p-4 text-center transition-bounce ${
                          earned
                            ? `${TONE_BG[b.tone ?? "primary"]} shadow-pop animate-pop-in`
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl" aria-hidden>
                          {earned ? b.emoji : "🔒"}
                        </div>
                        <div className="font-display text-sm mt-2 leading-tight">{b.name}</div>
                        <div className="text-[11px] mt-1 opacity-80 leading-tight">
                          {b.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </section>

        <div className="rounded-3xl bg-card border border-border p-6 text-center shadow-soft">
          <Star className="h-10 w-10 mx-auto text-secondary-foreground mb-2" />
          <h2 className="font-display text-2xl mb-1">Eindtoets</h2>
          <p className="text-muted-foreground mb-4">Haal 8/10 om je diploma te verdienen!</p>
          <Link to={allDone ? "/final-test" : "#"}>
            <Button
              disabled={!allDone}
              onClick={(e) => {
                if (!allDone) {
                  e.preventDefault();
                  toast({ title: "Bijna zover!", description: `Maak eerst alle ${totalLessons} lessen af.` });
                }
              }}
              className="h-14 px-8 rounded-full font-display text-base shadow-soft"
            >
              {allDone ? "🏆 Doe de toets" : `🔒 Op slot (${totalDone}/${totalLessons})`}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
