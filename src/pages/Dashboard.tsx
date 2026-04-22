import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PaywallDialog } from "@/components/PaywallDialog";
import { WORLDS, ALL_LESSONS } from "@/content/lessons";
import { Lock, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { BADGES, TONE_BG } from "@/lib/badges";

const PILLAR_BG: Record<string, string> = {
  safe: "bg-gradient-sky text-primary-foreground",
  smart: "bg-gradient-sunshine text-secondary-foreground",
  stronger: "bg-gradient-coral text-accent-foreground",
};

export const Dashboard = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [finalPassed, setFinalPassed] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setCompleted(new Set((data ?? []).map((r: any) => r.lesson_id)));
      });
    supabase
      .from("final_test_attempts")
      .select("passed")
      .eq("user_id", user.id)
      .eq("passed", true)
      .limit(1)
      .then(({ data }) => setFinalPassed((data ?? []).length > 0));
  }, [user]);

  useEffect(() => {
    if (search.get("checkout") === "success") {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
      toast({ title: "🎉 Je bent vrijgespeeld!", description: "Alle lessen staan open. Veel plezier!" });
      setTimeout(refreshProfile, 1500);
      const next = new URLSearchParams(search);
      next.delete("checkout");
      next.delete("session_id");
      setSearch(next, { replace: true });
    }
  }, [search, setSearch, refreshProfile, toast]);

  const totalDone = completed.size;
  const totalLessons = ALL_LESSONS.length;
  const allDone = totalDone === totalLessons;
  const isPaid = !!profile?.paid;

  const worldProgress = WORLDS.map((w) => ({
    ...w,
    done: w.lessons.filter((l) => completed.has(l.id)).length,
    locked: w.id > 1 && !WORLDS[w.id - 2].lessons.every((l) => completed.has(l.id)),
  }));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 md:py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-8">
          <Spark size={88} mood={allDone ? "celebrating" : "happy"} />
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl">
              Hoi {profile?.first_name ?? "vriend"}! Klaar om slimmer te worden?
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalDone} van {totalLessons} lessen gedaan
            </p>
          </div>
          {!isPaid && (
            <Button
              onClick={() => setPaywall(true)}
              className="w-full sm:w-auto h-12 rounded-full font-display bg-accent hover:bg-accent/90 text-accent-foreground shadow-pop"
            >
              🔓 Speel alles vrij · €14
            </Button>
          )}
        </div>

        <Progress value={(totalDone / totalLessons) * 100} className="h-3 mb-10" />

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {worldProgress.map((w) => {
            const pct = Math.round((w.done / w.lessons.length) * 100);
            return (
              <Link
                key={w.id}
                to={w.locked ? "#" : `/world/${w.id}`}
                onClick={(e) => {
                  if (w.locked) {
                    e.preventDefault();
                    toast({ title: "Op slot!", description: `Maak eerst Wereld ${w.id - 1} af.` });
                  }
                }}
                className={`block rounded-3xl p-5 sm:p-6 shadow-soft hover:shadow-pop transition-bounce hover:-translate-y-1 ${PILLAR_BG[w.pillar]} ${w.locked ? "opacity-60" : ""}`}
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
                  <div className="h-full bg-white" style={{ width: `${pct}%` }} />
                </div>
              </Link>
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

      <PaywallDialog open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
};

export default Dashboard;
