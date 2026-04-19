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
import { Lock, Trophy, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const PILLAR_BG: Record<string, string> = {
  safe: "bg-gradient-sky text-primary-foreground",
  smart: "bg-gradient-sunshine text-secondary-foreground",
  stronger: "bg-gradient-coral text-accent-foreground",
};

export const Dashboard = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
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
  }, [user]);

  // Handle Stripe checkout return
  useEffect(() => {
    if (search.get("checkout") === "success") {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
      toast({ title: "🎉 You're unlocked!", description: "All lessons are open. Have fun!" });
      // Webhook should have updated profile.paid; refresh after a short delay.
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
      <main className="container py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-8">
          <Spark size={100} mood={allDone ? "celebrating" : "happy"} />
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-display text-3xl sm:text-4xl">
              Hi {profile?.first_name ?? "friend"}! Ready to get smarter?
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalDone} of {totalLessons} lessons done
            </p>
          </div>
          {!isPaid && (
            <Button
              onClick={() => setPaywall(true)}
              className="h-12 rounded-full font-display bg-accent hover:bg-accent/90 text-accent-foreground shadow-pop"
            >
              🔓 Unlock all · €14
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
                    toast({ title: "Locked!", description: `Finish World ${w.id - 1} first.` });
                  }
                }}
                className={`block rounded-3xl p-6 shadow-soft hover:shadow-pop transition-bounce hover:-translate-y-1 ${PILLAR_BG[w.pillar]} ${w.locked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-5xl" aria-hidden>{w.emoji}</span>
                  {w.locked && <Lock className="h-6 w-6" />}
                </div>
                <h2 className="font-display text-2xl mb-1">World {w.id}: {w.name}</h2>
                <p className="text-sm opacity-90 mb-4">{w.tagline}</p>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{w.done} / {w.lessons.length} done</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/30 overflow-hidden">
                  <div className="h-full bg-white" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Badge shelf */}
        <section className="mb-10">
          <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-secondary-foreground" /> Your badges
          </h2>
          <div className="flex gap-4 flex-wrap">
            {WORLDS.map((w) => {
              const earned = w.lessons.every((l) => completed.has(l.id));
              return (
                <div
                  key={w.id}
                  className={`rounded-2xl p-4 w-32 text-center transition-bounce ${
                    earned
                      ? `${PILLAR_BG[w.pillar]} shadow-pop animate-pop-in`
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="text-4xl">{earned ? w.emoji : "🔒"}</div>
                  <div className="font-display text-sm mt-2">{w.name}</div>
                </div>
              );
            })}
            <div
              className={`rounded-2xl p-4 w-32 text-center ${
                allDone ? "bg-success text-success-foreground shadow-pop animate-pop-in" : "bg-muted text-muted-foreground"
              }`}
            >
              <Trophy className="h-10 w-10 mx-auto" />
              <div className="font-display text-sm mt-2">Smart Kid</div>
            </div>
          </div>
        </section>

        <div className="rounded-3xl bg-card border border-border p-6 text-center shadow-soft">
          <Star className="h-10 w-10 mx-auto text-secondary-foreground mb-2" />
          <h2 className="font-display text-2xl mb-1">Final Test</h2>
          <p className="text-muted-foreground mb-4">Pass with 8/10 to earn your certificate!</p>
          <Link to={allDone ? "/final-test" : "#"}>
            <Button
              disabled={!allDone}
              onClick={(e) => {
                if (!allDone) {
                  e.preventDefault();
                  toast({ title: "Almost there!", description: `Finish all ${totalLessons} lessons first.` });
                }
              }}
              className="h-14 px-8 rounded-full font-display text-base shadow-soft"
            >
              {allDone ? "🏆 Take the test" : `🔒 Locked (${totalDone}/${totalLessons})`}
            </Button>
          </Link>
        </div>
      </main>

      <PaywallDialog open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
};

export default Dashboard;
