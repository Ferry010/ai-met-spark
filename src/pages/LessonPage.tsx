import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { PaywallDialog } from "@/components/PaywallDialog";
import { getLesson, type InteractiveStep } from "@/content/lessons";
import { ChevronLeft, Check, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "intro" | "fact" | "interactive" | "quiz" | "done";

const PILLAR_BG: Record<string, string> = {
  safe: "bg-gradient-sky text-primary-foreground",
  smart: "bg-gradient-sunshine text-secondary-foreground",
  stronger: "bg-gradient-coral text-accent-foreground",
};

const fireConfetti = () => {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
};

export const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const baseLesson = useMemo(() => getLesson(id || ""), [id]);
  const [override, setOverride] = useState<{ title?: string | null; fact?: string | null; emoji?: string | null } | null>(null);
  const [step, setStep] = useState<Step>("intro");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [pickedAnswer, setPickedAnswer] = useState<number | null>(null);
  const [paywall, setPaywall] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("lesson_overrides")
      .select("title, fact, emoji")
      .eq("lesson_id", id)
      .maybeSingle()
      .then(({ data }) => setOverride(data as any));
  }, [id]);

  const lesson = useMemo(() => {
    if (!baseLesson) return undefined;
    return {
      ...baseLesson,
      title: override?.title?.trim() || baseLesson.title,
      fact: override?.fact?.trim() || baseLesson.fact,
      emoji: override?.emoji?.trim() || baseLesson.emoji,
    };
  }, [baseLesson, override]);

  useEffect(() => {
    if (!lesson || !profile) return;
    if (lesson.id === "1.1") return;
    if (!profile.paid) setPaywall(true);
  }, [lesson, profile]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-12 text-center">
          <h1 className="font-display text-2xl">Les niet gevonden</h1>
          <Link to="/dashboard"><Button className="mt-4 rounded-full font-display">Terug naar start</Button></Link>
        </main>
      </div>
    );
  }

  const finishLesson = async () => {
    if (!user) return;
    const stars = quizScore === lesson.quiz.length ? 3 : quizScore >= 1 ? 2 : 1;
    await supabase.from("user_progress").upsert(
      { user_id: user.id, lesson_id: lesson.id, stars },
      { onConflict: "user_id,lesson_id" },
    );
  };

  const onStepNext = async (next: Step) => {
    if (next === "done") {
      await finishLesson();
      fireConfetti();
    }
    setStep(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 max-w-2xl">
        <Link to={`/world/${lesson.worldId}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 font-display">
          <ChevronLeft className="h-4 w-4" /> Terug naar Wereld {lesson.worldId}
        </Link>

        {step === "intro" && (
          <section className={`rounded-3xl p-8 text-center shadow-pop ${PILLAR_BG[lesson.pillar]} animate-pop-in`}>
            <div className="text-xs font-display opacity-90">Les {lesson.id}</div>
            <h1 className="font-display text-4xl mt-1 mb-6">{lesson.title}</h1>
            <Spark size={140} mood="happy" />
            <p className="mt-6 text-lg opacity-95">Spark is er klaar voor! Tik om te beginnen.</p>
            <Button
              onClick={() => setStep("fact")}
              className="mt-6 h-14 px-8 rounded-full font-display text-base bg-white text-foreground hover:bg-white/90 shadow-pop"
            >
              Kom op! →
            </Button>
          </section>
        )}

        {step === "fact" && (
          <section className="rounded-3xl bg-card border-2 border-primary p-8 shadow-pop animate-pop-in text-center">
            <div className="text-5xl mb-3" aria-hidden>{lesson.emoji}</div>
            <div className="text-sm font-display text-primary uppercase tracking-wider mb-2">Wist je dat?</div>
            <p className="font-display text-2xl sm:text-3xl leading-snug">{lesson.fact}</p>
            <Button
              onClick={() => setStep("interactive")}
              className="mt-8 h-14 px-8 rounded-full font-display bg-primary shadow-soft"
            >
              Probeer het →
            </Button>
          </section>
        )}

        {step === "interactive" && (
          <Interactive
            interactive={lesson.interactive}
            onDone={() => onStepNext("quiz")}
          />
        )}

        {step === "quiz" && (
          <QuizCard
            question={lesson.quiz[quizIndex]}
            index={quizIndex}
            total={lesson.quiz.length}
            picked={pickedAnswer}
            onPick={(i) => {
              if (pickedAnswer !== null) return;
              setPickedAnswer(i);
              const correct = i === lesson.quiz[quizIndex].correctIndex;
              if (correct) {
                setQuizScore((s) => s + 1);
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
              }
            }}
            onNext={() => {
              setPickedAnswer(null);
              if (quizIndex + 1 >= lesson.quiz.length) onStepNext("done");
              else setQuizIndex(quizIndex + 1);
            }}
          />
        )}

        {step === "done" && (
          <section className="rounded-3xl bg-success/15 border-2 border-success p-8 text-center shadow-pop animate-pop-in">
            <Spark size={140} mood="celebrating" />
            <h2 className="font-display text-3xl mt-4">Goed gedaan!</h2>
            <div className="flex justify-center gap-1 mt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-8 w-8",
                    i < (quizScore === lesson.quiz.length ? 3 : quizScore >= 1 ? 2 : 1)
                      ? "fill-secondary text-secondary"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            <p className="mt-4 text-muted-foreground">Je had er {quizScore} van de {lesson.quiz.length} goed.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={`/world/${lesson.worldId}`}>
                <Button className="h-14 px-8 rounded-full font-display bg-primary shadow-soft">
                  Terug naar de kaart
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
      <PaywallDialog open={paywall} onClose={() => { setPaywall(false); navigate(-1); }} />
    </div>
  );
};

const QuizCard = ({
  question,
  index,
  total,
  picked,
  onPick,
  onNext,
}: {
  question: any;
  index: number;
  total: number;
  picked: number | null;
  onPick: (i: number) => void;
  onNext: () => void;
}) => {
  const correct = question.correctIndex;
  const wrong = picked !== null && picked !== correct;
  return (
    <section className={cn("rounded-3xl bg-card border border-border p-6 shadow-soft", wrong && "animate-shake")}>
      <div className="text-xs font-display text-muted-foreground mb-2">Vraag {index + 1} van {total}</div>
      <h3 className="font-display text-xl mb-5">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map((opt: string, i: number) => {
          const isPicked = picked === i;
          const showCorrect = picked !== null && i === correct;
          const showWrong = isPicked && i !== correct;
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              disabled={picked !== null}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-bounce min-h-[56px] font-body",
                showCorrect && "bg-success/15 border-success",
                showWrong && "bg-destructive/10 border-destructive",
                picked === null && "border-border hover:border-primary hover:bg-primary/5",
                picked !== null && !showCorrect && !showWrong && "border-border opacity-60",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{opt}</span>
                {showCorrect && <Check className="h-5 w-5 text-success shrink-0" />}
                {showWrong && <X className="h-5 w-5 text-destructive shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 p-4 rounded-2xl bg-muted/60 text-sm">
          <strong className="font-display">Waarom? </strong>{question.why}
        </div>
      )}
      {picked !== null && (
        <Button onClick={onNext} className="mt-5 w-full h-14 rounded-full font-display bg-primary shadow-soft">
          {index + 1 >= total ? "Maak les af →" : "Volgende vraag →"}
        </Button>
      )}
    </section>
  );
};

const Interactive = ({ interactive, onDone }: { interactive: InteractiveStep; onDone: () => void }) => {
  if (interactive.kind === "multiChoice") {
    return <MultiChoice step={interactive} onDone={onDone} />;
  }
  if (interactive.kind === "tapReveal") {
    return <TapReveal step={interactive} onDone={onDone} />;
  }
  return <SortBuckets step={interactive} onDone={onDone} />;
};

const MultiChoice = ({ step, onDone }: { step: Extract<InteractiveStep, { kind: "multiChoice" }>; onDone: () => void }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const wrong = picked !== null && !step.options[picked].correct;
  return (
    <section className={cn("rounded-3xl bg-card border border-border p-6 shadow-soft", wrong && "animate-shake")}>
      <h3 className="font-display text-xl mb-5">{step.question}</h3>
      <div className="space-y-3">
        {step.options.map((opt, i) => {
          const isPicked = picked === i;
          return (
            <button
              key={i}
              onClick={() => {
                setPicked(i);
                if (opt.correct) confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
              }}
              disabled={picked !== null}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-bounce min-h-[56px]",
                isPicked && opt.correct && "bg-success/15 border-success",
                isPicked && !opt.correct && "bg-destructive/10 border-destructive",
                picked === null && "border-border hover:border-primary hover:bg-primary/5",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <>
          <div className="mt-4 p-4 rounded-2xl bg-muted/60 text-sm">{step.explanation}</div>
          <Button onClick={onDone} className="mt-4 w-full h-14 rounded-full font-display bg-primary shadow-soft">
            Verder →
          </Button>
        </>
      )}
    </section>
  );
};

const TapReveal = ({ step, onDone }: { step: Extract<InteractiveStep, { kind: "tapReveal" }>; onDone: () => void }) => {
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const allOpen = opened.size === step.reveals.length;
  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-soft">
      <h3 className="font-display text-xl mb-5">{step.prompt}</h3>
      <div className="space-y-3">
        {step.reveals.map((r, i) => (
          <button
            key={i}
            onClick={() => setOpened(new Set([...opened, i]))}
            className={cn(
              "w-full text-left p-4 rounded-2xl border-2 transition-bounce min-h-[56px]",
              opened.has(i) ? "bg-primary/10 border-primary" : "border-border hover:border-primary",
            )}
          >
            <div className="font-display text-base">{r.label}</div>
            {opened.has(i) && <div className="mt-1 text-sm text-foreground/80 animate-pop-in">{r.reveal}</div>}
          </button>
        ))}
      </div>
      <Button
        onClick={onDone}
        disabled={!allOpen}
        className="mt-5 w-full h-14 rounded-full font-display bg-primary shadow-soft"
      >
        {allOpen ? "Verder →" : `Tik elk item aan (${opened.size}/${step.reveals.length})`}
      </Button>
    </section>
  );
};

const SortBuckets = ({ step, onDone }: { step: Extract<InteractiveStep, { kind: "sortBuckets" }>; onDone: () => void }) => {
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const place = (itemIdx: number, bucket: number) => {
    setPlaced((p) => ({ ...p, [itemIdx]: bucket }));
    if (step.items[itemIdx].bucket === bucket) {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.5 } });
    }
  };
  const allPlaced = Object.keys(placed).length === step.items.length;
  const allCorrect = step.items.every((it, i) => placed[i] === it.bucket);
  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-soft">
      <h3 className="font-display text-xl mb-5">{step.prompt}</h3>
      <div className="space-y-2 mb-6">
        {step.items.map((it, i) => {
          const chosen = placed[i];
          const correct = chosen !== undefined && chosen === it.bucket;
          const wrong = chosen !== undefined && chosen !== it.bucket;
          return (
            <div
              key={i}
              className={cn(
                "rounded-2xl border-2 p-3 flex items-center gap-3 flex-wrap",
                correct && "bg-success/10 border-success",
                wrong && "bg-destructive/10 border-destructive animate-shake",
                chosen === undefined && "border-border",
              )}
            >
              <span className="flex-1 min-w-0 font-body text-sm">{it.label}</span>
              <div className="flex gap-2">
                {step.buckets.map((b, bi) => (
                  <Button
                    key={bi}
                    size="sm"
                    variant={chosen === bi ? "default" : "outline"}
                    onClick={() => place(i, bi)}
                    disabled={chosen !== undefined}
                    className="rounded-full font-display text-xs"
                  >
                    {b}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Button
        onClick={onDone}
        disabled={!allPlaced}
        className="w-full h-14 rounded-full font-display bg-primary shadow-soft"
      >
        {allPlaced ? (allCorrect ? "Perfect! Verder →" : "Verder →") : "Plaats elk item"}
      </Button>
    </section>
  );
};

export default LessonPage;
