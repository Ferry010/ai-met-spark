import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { X, Check, GraduationCap, RotateCcw, Clock } from "lucide-react";
import { FINAL_PASS_SCORE, FINAL_TEST, getWorld, type FinalQuestion } from "@/content/missions";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useFinalTest } from "@/hooks/useFinalTest";
import { nextUpMission } from "@/lib/progress";
import { shuffle } from "@/lib/shuffle";
import { playCorrect, playWrong, playLevelUp } from "@/lib/sounds";
import { FeedbackSheet } from "@/components/mission/FeedbackSheet";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Prepared = FinalQuestion & { order: number[] };

export const FinalTest = () => {
  const navigate = useNavigate();
  const { completed, isLoading } = useUserProgress();
  const final = useFinalTest();
  const [run, setRun] = useState(0);
  // Once a run has started, keep showing it (and its own result screen),
  // even when saving the attempt flips "passed" or starts the retry wait.
  const running = useRef(false);

  const next = nextUpMission(completed);

  if (running.current) {
    return <FinalTestRun key={run} onRecord={final.record} onRetry={() => setRun((r) => r + 1)} />;
  }

  if (isLoading || final.isLoading) return <Centered><Spark size={96} /></Centered>;

  if (next) {
    return (
      <Centered>
        <Spark size={120} mood="thinking" />
        <h1 className="mt-4 text-3xl">De eindtoets zit nog op slot</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">Haal eerst alle missies. Je volgende missie is "{next.title}".</p>
        <Button size="lg" className="mt-6" onClick={() => navigate(`/mission/${next.id}`)}>
          Naar de missie
        </Button>
      </Centered>
    );
  }

  if (final.passed && run === 0) {
    return (
      <Centered>
        <Spark size={120} mood="celebrating" />
        <h1 className="mt-4 text-3xl">Je bent al geslaagd!</h1>
        <p className="mt-2 text-muted-foreground">Beste score: {final.bestScore}/10</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate("/certificate")}>Bekijk je diploma</Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              running.current = true;
              setRun(1);
            }}
          >
            <RotateCcw className="h-5 w-5" /> Nog een keer oefenen
          </Button>
        </div>
      </Centered>
    );
  }

  if (final.cooldownUntil) {
    return (
      <Centered>
        <Spark size={120} mood="thinking" />
        <h1 className="mt-4 text-3xl">Even pauze</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Je kunt het weer proberen om {final.cooldownUntil.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}. Speel
          intussen een missie opnieuw om te oefenen.
        </p>
        <Button size="lg" variant="outline" className="mt-6" onClick={() => navigate("/dashboard")}>
          <Clock className="h-5 w-5" /> Terug naar mijn missies
        </Button>
      </Centered>
    );
  }

  running.current = true;
  return <FinalTestRun key={run} onRecord={final.record} onRetry={() => setRun((r) => r + 1)} />;
};

const FinalTestRun = ({
  onRecord,
  onRetry,
}: {
  onRecord: (a: { score: number; passed: boolean }) => Promise<unknown>;
  onRetry: () => void;
}) => {
  const navigate = useNavigate();
  const questions = useMemo<Prepared[]>(
    () => shuffle(FINAL_TEST).map((q) => ({ ...q, order: shuffle([0, 1, 2]) })),
    [],
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const wrongWorlds = useRef(new Set<number>());
  const saved = useRef(false);

  const q = questions[index];

  const choose = (optionIndex: number) => {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === q.correct) {
      setScore((s) => s + 1);
      playCorrect();
    } else {
      wrongWorlds.current.add(q.worldId);
      playWrong();
    }
  };

  const advance = () => {
    setPicked(null);
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      return;
    }
    setDone(true);
    const finalScore = score;
    const passed = finalScore >= FINAL_PASS_SCORE;
    if (!saved.current) {
      saved.current = true;
      onRecord({ score: finalScore, passed }).catch(() => {});
    }
    if (passed) {
      playLevelUp();
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.35 }, colors: ["#6B4FF0", "#FFC21A", "#1FA36A", "#F0436B", "#1A8FEA"] });
    }
  };

  if (done) {
    const passed = score >= FINAL_PASS_SCORE;
    return (
      <Centered>
        <Spark size={130} mood={passed ? "celebrating" : "thinking"} />
        <h1 className="mt-4 text-4xl">{passed ? "Geslaagd!" : "Bijna!"}</h1>
        <p className="mt-1 font-display text-5xl">
          {score}<span className="text-2xl text-muted-foreground">/10</span>
        </p>
        <p className="mt-3 max-w-sm text-muted-foreground">
          {passed
            ? "Je bent officieel een AI Smart Kid. Je diploma staat klaar!"
            : `Je hebt er ${FINAL_PASS_SCORE} goed nodig. Oefen nog even en probeer het over 10 minuten opnieuw.`}
        </p>
        {!passed && wrongWorlds.current.size > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[...wrongWorlds.current].sort().map((w) => (
              <Link key={w} to={`/world/${w}`} className="press tile px-4 py-2 text-sm font-medium hover:bg-muted">
                Oefen Wereld {getWorld(w)?.name}
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
          {passed ? (
            <Button size="lg" onClick={() => navigate("/certificate")}>
              <GraduationCap className="h-5 w-5" /> Naar je diploma
            </Button>
          ) : (
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
              Terug naar mijn missies
            </Button>
          )}
          {passed && (
            <Button size="lg" variant="outline" onClick={onRetry}>
              <RotateCcw className="h-5 w-5" /> Nog een keer
            </Button>
          )}
        </div>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button type="button" onClick={() => navigate("/dashboard")} aria-label="Stoppen" className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted">
            <X className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(index / questions.length) * 100}%` }} />
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 font-display text-sm text-success-dark">
            <Check className="h-4 w-4" strokeWidth={3} /> {score}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-10 pt-6">
        <div className="mb-2 text-sm font-semibold text-primary">
          Eindtoets · vraag {index + 1} van {questions.length}
        </div>
        <h1 key={index} className="mb-6 text-2xl leading-snug animate-pop-in sm:text-3xl">
          {q.question}
        </h1>
        <div className="flex flex-col gap-3">
          {q.order.map((optionIndex, pos) => {
            const reveal = picked !== null;
            const good = reveal && optionIndex === q.correct;
            const bad = picked === optionIndex && optionIndex !== q.correct;
            return (
              <button
                key={`${index}-${optionIndex}`}
                type="button"
                disabled={reveal}
                onClick={() => choose(optionIndex)}
                className={cn(
                  "press tile flex min-h-[60px] items-center gap-3 px-4 py-3 text-left text-[17px] leading-snug hover:bg-muted disabled:opacity-100",
                  good && "border-success bg-success-soft",
                  bad && "border-destructive bg-destructive-soft animate-shake",
                  reveal && !good && !bad && "opacity-50",
                )}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-border font-display text-sm">
                  {String.fromCharCode(65 + pos)}
                </span>
                {q.options[optionIndex]}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <FeedbackSheet
            key={`feedback-${index}`}
            correct={picked === q.correct}
            body={q.why}
            continueLabel={index + 1 < questions.length ? "Volgende vraag" : "Bekijk je score"}
            onContinue={advance}
          />
        )}
        <div className="h-40" aria-hidden />
      </main>
    </div>
  );
};

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">{children}</div>
);

export default FinalTest;
