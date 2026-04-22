import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FINAL_TEST_QUESTIONS } from "@/content/lessons";
import { ChevronLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const COOLDOWN_HOURS = 24;

export const FinalTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const questions = useMemo(() => FINAL_TEST_QUESTIONS, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("final_test_attempts")
      .select("*")
      .eq("user_id", user.id)
      .order("attempted_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (data.passed) {
            navigate("/certificate", { replace: true });
            return;
          }
          const last = new Date(data.attempted_at);
          const next = new Date(last.getTime() + COOLDOWN_HOURS * 3600 * 1000);
          if (next > new Date()) setCooldownUntil(next);
        }
        setLoading(false);
      });
  }, [user, navigate]);

  const submit = async () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (picks[i] === q.correctIndex) s++;
    });
    setScore(s);
    setSubmitted(true);
    const passed = s >= 8;
    if (user) {
      await supabase.from("final_test_attempts").insert({ user_id: user.id, score: s, passed });
    }
    if (passed) {
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => navigate("/certificate"), 1800);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Spark size={120} />
      </div>
    );
  }

  if (cooldownUntil) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-12 max-w-md text-center">
          <Spark size={120} mood="thinking" />
          <h1 className="font-display text-3xl mt-4">Neem eerst even pauze!</h1>
          <p className="text-muted-foreground mt-2">
            Je kunt het opnieuw proberen om {cooldownUntil.toLocaleString()}.
          </p>
          <Link to="/dashboard"><Button className="mt-6 rounded-full font-display">Terug naar dashboard</Button></Link>
        </main>
      </div>
    );
  }

  const allAnswered = Object.keys(picks).length === questions.length;
  const passed = score >= 8;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 font-display">
          <ChevronLeft className="h-4 w-4" /> Dashboard
        </Link>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <Spark size={100} mood="thinking" />
              <h1 className="font-display text-3xl mt-2">Eindtoets</h1>
              <p className="text-muted-foreground">10 vragen · 8/10 om te slagen · Geen tijdslimiet</p>
            </div>
            <Progress value={(Object.keys(picks).length / questions.length) * 100} className="h-2 mb-6" />

            <div className="space-y-5">
              {questions.map((q, i) => (
                <div key={i} className="rounded-3xl bg-card border border-border p-5 shadow-soft">
                  <div className="text-xs font-display text-muted-foreground mb-1">V{i + 1}</div>
                  <h3 className="font-display text-lg mb-4">{q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setPicks({ ...picks, [i]: oi })}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border-2 min-h-[52px] transition-bounce",
                          picks[i] === oi ? "bg-primary/10 border-primary" : "border-border hover:border-primary/60",
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={submit}
              disabled={!allAnswered}
              className="mt-6 w-full h-14 rounded-full font-display text-sm sm:text-base bg-primary shadow-pop"
            >
              {allAnswered ? "🏁 Antwoorden inleveren" : `Beantwoord alle ${questions.length} (${Object.keys(picks).length}/${questions.length})`}
            </Button>
          </>
        ) : (
          <section className={cn(
            "rounded-3xl p-8 text-center shadow-pop animate-pop-in",
            passed ? "bg-success/15 border-2 border-success" : "bg-destructive/10 border-2 border-destructive",
          )}>
            <Spark size={140} mood={passed ? "celebrating" : "sad"} />
            <h2 className="font-display text-3xl mt-4">
              {passed ? "🎉 Het is je gelukt!" : "Bijna!"}
            </h2>
            <p className="font-display text-5xl my-3">{score} / {questions.length}</p>
            <p className="text-muted-foreground mb-5">
              {passed ? "Je bent een gecertificeerd AI Smart Kid!" : "Je hebt 8 nodig. Probeer het over 24 uur opnieuw!"}
            </p>
            {passed ? (
              <Link to="/certificate"><Button className="h-14 px-8 rounded-full font-display bg-primary shadow-pop">Bekijk diploma →</Button></Link>
            ) : (
              <Link to="/dashboard"><Button variant="outline" className="h-14 px-8 rounded-full font-display border-2"><Lock className="h-4 w-4 mr-1" /> Terug naar dashboard</Button></Link>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default FinalTest;
