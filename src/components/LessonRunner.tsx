import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Spark } from "@/components/Spark";
import { SparkBubble } from "@/components/SparkBubble";
import { type InteractiveStep, type Lesson } from "@/content/lessons";
import { Check, Star, X, Lightbulb, BookOpen, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { unlockAudio, playSparkEntry, playBubblePop } from "@/lib/sounds";

// Unlock WebAudio on the first user gesture anywhere in the app.
if (typeof window !== "undefined") {
  const unlock = () => {
    unlockAudio();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: false });
  window.addEventListener("keydown", unlock, { once: false });
  window.addEventListener("touchstart", unlock, { once: false });
}

type Step = "intro" | "theoryIntro" | "fact" | "theoryDeep" | "interactive" | "summary" | "quiz" | "done";

const PILLAR_BG: Record<string, string> = {
  safe: "bg-gradient-sky text-primary-foreground",
  smart: "bg-gradient-sunshine text-secondary-foreground",
  stronger: "bg-gradient-coral text-accent-foreground",
};

interface LessonRunnerProps {
  lesson: Lesson;
  /** Called once when the lesson reaches the "done" step. Receives final stars. */
  onComplete?: (stars: number) => void;
  /** Hide back-link / show preview controls. */
  preview?: boolean;
  /** Optional renderer for a "next lesson" CTA on the done screen. */
  renderDoneCta?: (stars: number) => React.ReactNode;
  /** Allow admin to jump to any step. */
  jumpToStep?: Step;
}

const fireConfetti = () => confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

const buildSteps = (lesson: Lesson): Step[] => {
  const steps: Step[] = ["intro"];
  if (lesson.theoryIntro?.trim()) steps.push("theoryIntro");
  steps.push("fact");
  if (lesson.theoryDeep?.trim()) steps.push("theoryDeep");
  steps.push("interactive");
  if (lesson.summary && lesson.summary.length > 0) steps.push("summary");
  steps.push("quiz");
  return steps;
};

export const LessonRunner = ({ lesson, onComplete, preview, renderDoneCta, jumpToStep }: LessonRunnerProps) => {
  const [step, setStep] = useState<Step>("intro");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [pickedAnswer, setPickedAnswer] = useState<number | null>(null);

  const stepOrder = useMemo(() => buildSteps(lesson), [lesson]);

  // Reset when lesson changes
  useEffect(() => {
    setStep("intro");
    setQuizIndex(0);
    setQuizScore(0);
    setPickedAnswer(null);
  }, [lesson.id]);

  // Admin jump-to-step
  useEffect(() => {
    if (jumpToStep) setStep(jumpToStep);
  }, [jumpToStep]);

  const stars = useMemo(
    () => (quizScore === lesson.quiz.length ? 3 : quizScore >= 1 ? 2 : 1),
    [quizScore, lesson.quiz.length],
  );

  const advance = (next: Step) => {
    if (next === "done") {
      fireConfetti();
      onComplete?.(stars);
    }
    setStep(next);
  };

  const goNext = (after: Step) => {
    const idx = stepOrder.indexOf(after);
    const next = stepOrder[idx + 1] ?? "done";
    advance(next === undefined ? "done" : (next as Step) || "done");
    if (idx + 1 >= stepOrder.length) advance("done");
  };

  const currentIndex = stepOrder.indexOf(step);
  const showProgress = step !== "intro" && step !== "done";

  return (
    <>
      {showProgress && currentIndex >= 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-display text-muted-foreground mb-1.5">
            <span>Stap {currentIndex + 1} van {stepOrder.length}</span>
            <span className="opacity-70">Les {lesson.id}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentIndex + 1) / stepOrder.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {step === "intro" && (
        <LessonKickoff lesson={lesson} onStart={() => goNext("intro")} />
      )}

      {step === "theoryIntro" && (
        <TheoryCard
          eyebrow="Even uitleggen"
          text={lesson.theoryIntro!}
          onNext={() => goNext("theoryIntro")}
        />
      )}

      {step === "fact" && (
        <section className="rounded-3xl bg-card border-2 border-primary p-8 shadow-pop animate-pop-in text-center">
          <div className="flex justify-center mb-3">
            <Spark size={72} mood="hinting" />
          </div>
          <div className="text-sm font-display text-primary uppercase tracking-wider mb-2">Wist je dat?</div>
          <p className="font-display text-2xl sm:text-3xl leading-snug">{lesson.fact}</p>
          <Button onClick={() => goNext("fact")} className="mt-8 h-14 px-8 rounded-full font-display bg-primary shadow-soft">
            Verder →
          </Button>
        </section>
      )}

      {step === "theoryDeep" && (
        <TheoryCard
          eyebrow="Nog iets erbij"
          text={lesson.theoryDeep!}
          onNext={() => goNext("theoryDeep")}
        />
      )}

      {step === "interactive" && (
        <Interactive interactive={lesson.interactive} onDone={() => goNext("interactive")} />
      )}

      {step === "summary" && (
        <SummaryCard bullets={lesson.summary!} onNext={() => goNext("summary")} />
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
            if (quizIndex + 1 >= lesson.quiz.length) advance("done");
            else setQuizIndex(quizIndex + 1);
          }}
        />
      )}

      {step === "done" && (
        <section className="rounded-3xl bg-success/15 border-2 border-success p-8 text-center shadow-pop animate-pop-in">
          <div className="flex justify-center"><Spark size={140} mood="celebrating" /></div>
          <h2 className="font-display text-3xl mt-4">Goed gedaan!</h2>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-8 w-8",
                  i < stars ? "fill-secondary text-secondary" : "text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <p className="mt-4 text-muted-foreground">Je had er {quizScore} van de {lesson.quiz.length} goed.</p>
          {lesson.reflection && (
            <div className="mt-4 mx-auto max-w-md">
              <SparkBubble text={lesson.reflection} mood="celebrating" size={72} />
            </div>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {renderDoneCta?.(stars)}
          </div>
          {preview && (
            <p className="mt-4 text-xs text-muted-foreground">Preview-modus, niets opgeslagen</p>
          )}
        </section>
      )}
    </>
  );
};

const KICKOFF_TYPING_SPEED = 22;
const KICKOFF_BUBBLE_DELAY = 1200;
const KICKOFF_ENTRY_DURATION = 1100;

const SparkJetEntry = ({ size = 140 }: { size?: number }) => {
  const [entryDone, setEntryDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEntryDone(true);
      return;
    }
    // Small delay so the sound lines up with the visual whoosh start.
    const sfx = window.setTimeout(() => playSparkEntry(), 120);
    const t = window.setTimeout(() => setEntryDone(true), KICKOFF_ENTRY_DURATION);
    return () => {
      window.clearTimeout(sfx);
      window.clearTimeout(t);
    };
  }, []);

  if (entryDone) {
    return <Spark size={size} mood="happy" waving />;
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Speed lines */}
      <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
        <div
          className="absolute h-1 w-16 rounded-full bg-white/85 animate-spark-speedlines"
          style={{ left: "-40%", top: "30%", animationDelay: "0s" }}
        />
        <div
          className="absolute h-1 w-20 rounded-full bg-secondary/80 animate-spark-speedlines"
          style={{ left: "-50%", top: "55%", animationDelay: "0.05s" }}
        />
        <div
          className="absolute h-1 w-14 rounded-full bg-white/70 animate-spark-speedlines"
          style={{ left: "-30%", top: "75%", animationDelay: "0.1s" }}
        />
      </div>

      {/* Shockwave ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full border-4 border-white/70 animate-spark-shockwave"
        style={{ mixBlendMode: "screen" }}
        aria-hidden
      />

      {/* Spark + jet flame */}
      <div className="relative animate-spark-jet-fly" style={{ width: size, height: size }}>
        {/* Jet flame trail */}
        <div
          className="pointer-events-none absolute animate-spark-jet-trail"
          style={{
            right: "62%",
            bottom: "26%",
            width: size * 0.9,
            height: size * 0.32,
            transformOrigin: "right center",
            background:
              "linear-gradient(90deg, transparent 0%, hsl(18 100% 60% / 0.0) 8%, hsl(18 100% 60% / 0.55) 35%, hsl(45 100% 60% / 0.85) 65%, hsl(0 0% 100% / 0.95) 92%, hsl(0 0% 100%) 100%)",
            borderTopLeftRadius: "999px",
            borderBottomLeftRadius: "999px",
            borderTopRightRadius: "40% 100%",
            borderBottomRightRadius: "40% 100%",
            filter: "blur(6px)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />
        <Spark size={size} mood="happy" />
      </div>
    </div>
  );
};

const TypewriterText = ({ text, speed }: { text: string; speed: number }) => {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown("");
    setDone(false);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text);
      setDone(true);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return (
    <p
      onClick={() => { setShown(text); setDone(true); }}
      className="mt-1 text-base leading-snug cursor-pointer"
    >
      {shown}
      {!done && <span className="ml-0.5 inline-block w-1.5 h-4 align-middle bg-primary animate-pulse" />}
    </p>
  );
};

const LessonKickoff = ({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) => {
  const text = lesson.sparkIntro ?? "Klaar voor de volgende stap? Tik op Kom op!";
  const [showBubble, setShowBubble] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShowBubble(true);
      setShowButton(true);
      return;
    }
    const t1 = window.setTimeout(() => {
      setShowBubble(true);
      playBubblePop();
    }, KICKOFF_BUBBLE_DELAY);
    const buttonDelay = KICKOFF_BUBBLE_DELAY + text.length * KICKOFF_TYPING_SPEED + 400;
    const t2 = window.setTimeout(() => setShowButton(true), buttonDelay);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [text, lesson.id]);

  return (
    <section className={`rounded-3xl p-8 text-center shadow-pop ${PILLAR_BG[lesson.pillar]} animate-pop-in`}>
      <div className="text-xs font-display opacity-90 animate-kickoff-fade-up">
        Les {lesson.id} {lesson.bossTest && "· 🏅 Baas-test"}
      </div>
      <h1 className="font-display text-4xl mt-1 mb-6 animate-kickoff-fade-up">{lesson.title}</h1>

      <div className="flex justify-center mb-2 min-h-[160px] items-end">
        <SparkJetEntry size={140} />
      </div>

      <div className="min-h-[120px] mt-2 flex flex-col items-center justify-start">
        {showBubble && (
          <div className="animate-bubble-pop mx-auto max-w-md rounded-2xl bg-background/95 text-foreground p-4 text-left shadow-soft">
            <div className="text-xs uppercase tracking-wider text-primary font-display">Spark zegt</div>
            <TypewriterText text={text} speed={KICKOFF_TYPING_SPEED} />
          </div>
        )}
      </div>

      <div className="min-h-[80px] flex items-center justify-center">
        {showButton && (
          <Button
            onClick={onStart}
            className="h-14 px-8 rounded-full font-display text-base bg-white text-foreground hover:bg-white/90 shadow-pop animate-kickoff-fade-up"
          >
            Kom op! →
          </Button>
        )}
      </div>
    </section>
  );
};

const TheoryCard = ({
  eyebrow,
  text,
  onNext,
}: {
  eyebrow: string;
  text: string;
  onNext: () => void;
}) => (
  <section className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-soft animate-pop-in">
    <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-primary mb-3">
      <BookOpen className="h-4 w-4" /> {eyebrow}
    </div>
    <div className="flex gap-4 items-start">
      <div className="hidden sm:block shrink-0">
        <Spark size={72} mood="explaining" />
      </div>
      <div className="flex-1 prose prose-sm max-w-none">
        {text.split(/\n\n+/).map((para, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90 mb-3 last:mb-0 whitespace-pre-line">
            {para.trim()}
          </p>
        ))}
      </div>
    </div>
    <Button onClick={onNext} className="mt-6 w-full h-14 rounded-full font-display bg-primary shadow-soft">
      Begrepen, ga verder →
    </Button>
  </section>
);

const SummaryCard = ({ bullets, onNext }: { bullets: string[]; onNext: () => void }) => (
  <section className="rounded-3xl bg-success/10 border-2 border-success p-6 sm:p-8 shadow-soft animate-pop-in">
    <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-success mb-3">
      <ListChecks className="h-4 w-4" /> Onthoud dit
    </div>
    <h3 className="font-display text-xl mb-4">Samenvatting</h3>
    <ul className="space-y-3">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-start gap-3">
          <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <span className="text-base leading-snug">{b}</span>
        </li>
      ))}
    </ul>
    <Button onClick={onNext} className="mt-6 w-full h-14 rounded-full font-display bg-success text-success-foreground hover:bg-success/90 shadow-soft">
      Klaar voor de quiz →
    </Button>
  </section>
);

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
  const isCorrect = picked !== null && picked === correct;
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
        <div className="mt-4">
          <SparkBubble
            text={question.why}
            mood={isCorrect ? "celebrating" : "thinking"}
            size={64}
          />
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

const HintButton = ({ hints }: { hints?: string[] }) => {
  const [revealed, setRevealed] = useState(0);
  if (!hints?.length) return null;
  const current = hints.slice(0, revealed);
  return (
    <div className="mt-4 space-y-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={revealed >= hints.length}
        onClick={() => setRevealed((r) => Math.min(r + 1, hints.length))}
        className="rounded-full font-display gap-1"
      >
        <Lightbulb className="h-4 w-4" />
        {revealed === 0
          ? "Vraag Spark om hint"
          : revealed >= hints.length
          ? "Geen hints meer"
          : `Nog een hint (${revealed}/${hints.length})`}
      </Button>
      {current.map((h, i) => (
        <div key={i} className="animate-pop-in">
          <SparkBubble text={h} mood={i === hints.length - 1 ? "explaining" : "hinting"} size={56} />
        </div>
      ))}
    </div>
  );
};

const Interactive = ({ interactive, onDone }: { interactive: InteractiveStep; onDone: () => void }) => {
  if (interactive.kind === "multiChoice") return <MultiChoice step={interactive} onDone={onDone} />;
  if (interactive.kind === "tapReveal") return <TapReveal step={interactive} onDone={onDone} />;
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
      <HintButton hints={step.hints} />
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
      <HintButton hints={step.hints} />
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
      <div className="space-y-2 mb-4">
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
      <HintButton hints={step.hints} />
      <Button
        onClick={onDone}
        disabled={!allPlaced}
        className="mt-4 w-full h-14 rounded-full font-display bg-primary shadow-soft"
      >
        {allPlaced ? (allCorrect ? "Perfect! Verder →" : "Verder →") : "Tik elk item aan"}
      </Button>
    </section>
  );
};

export default LessonRunner;
