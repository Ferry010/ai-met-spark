import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Spark, type SparkMood } from "@/components/Spark";
import { SparkBubble } from "@/components/SparkBubble";
import { SparkTeacher } from "@/components/SparkTeacher";
import { GameHud, LevelUpOverlay } from "@/components/GameHud";
import { type InteractiveStep, type Lesson } from "@/content/lessons";
import { GameGlyph } from "@/components/game/GameGlyph";
import { cn } from "@/lib/utils";
import { unlockAudio, playSparkEntry, playBubblePop, playCorrect, playWrong, playLevelUp, playCombo, playClick } from "@/lib/sounds";
import { renderRichText, estimateReadSeconds } from "@/lib/markdown";
import { SparkVoiceButton } from "@/components/SparkVoiceButton";
import { useSparkVoice } from "@/hooks/useSparkVoice";
import { useGameStats } from "@/hooks/useGameStats";
import { XP, comboMultiplier } from "@/lib/gamification";

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

type Step = "intro" | "theoryIntro" | "fact" | "sparkMiddle" | "theoryDeep" | "interactive" | "summary" | "quiz" | "done";

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
  if (lesson.sparkMiddle?.trim()) steps.push("sparkMiddle");
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

  // Gamification
  const { stats, progress, addXp } = useGameStats();
  const [combo, setCombo] = useState(0);
  const [longestComboThisLesson, setLongestComboThisLesson] = useState(0);
  const [bursts, setBursts] = useState<{ id: number; amount: number }[]>([]);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  const [teacherMsg, setTeacherMsg] = useState<string | undefined>();
  const burstId = useRef(0);
  const completedRef = useRef(false);

  const stepOrder = useMemo(() => buildSteps(lesson), [lesson]);

  // Reset when lesson changes
  useEffect(() => {
    setStep("intro");
    setQuizIndex(0);
    setQuizScore(0);
    setPickedAnswer(null);
    setCombo(0);
    setLongestComboThisLesson(0);
    completedRef.current = false;
  }, [lesson.id]);

  // Admin jump-to-step
  useEffect(() => {
    if (jumpToStep) setStep(jumpToStep);
  }, [jumpToStep]);

  const stars = useMemo(
    () => (quizScore === lesson.quiz.length ? 3 : quizScore >= 1 ? 2 : 1),
    [quizScore, lesson.quiz.length],
  );

  // Spark teacher mood per step
  const teacherMood: SparkMood = useMemo(() => {
    if (step === "intro") return "happy";
    if (step === "theoryIntro" || step === "theoryDeep") return "explaining";
    if (step === "fact") return "hinting";
    if (step === "sparkMiddle") return "teaching";
    if (step === "interactive") return "questioning";
    if (step === "summary") return "pointing";
    if (step === "quiz") return pickedAnswer === null ? "questioning" : pickedAnswer === lesson.quiz[quizIndex]?.correctIndex ? "cheering" : "oops";
    if (step === "done") return "celebrating";
    return "happy";
  }, [step, pickedAnswer, quizIndex, lesson.quiz]);

  // Encouragement messages per step transition
  useEffect(() => {
    const messages: Partial<Record<Step, string>> = {
      theoryIntro: "Lees rustig mee, ik leg het zo nog uit.",
      fact: "Wist je dit al? Cool, hè?",
      sparkMiddle: "Let goed op, dit is belangrijk!",
      theoryDeep: "Bijna door de uitleg.",
      interactive: "Tijd om zelf te oefenen!",
      summary: "Even alles op een rij.",
      quiz: "Laat zien wat je hebt geleerd. Je kan dit!",
    };
    if (messages[step]) setTeacherMsg(messages[step]);
  }, [step]);

  const pushBurst = (amount: number) => {
    burstId.current += 1;
    const id = burstId.current;
    setBursts((b) => [...b, { id, amount }]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1100);
  };

  const awardXp = async (amount: number, currentCombo?: number) => {
    pushBurst(amount);
    try {
      const r = await addXp({ amount, combo: currentCombo ?? longestComboThisLesson });
      if (r.leveledUp) {
        setLevelUpTo(r.newLevel);
        playLevelUp();
      }
    } catch {
      // ignore — preview / not authenticated
    }
  };

  const advance = (next: Step) => {
    if (next === "done") {
      fireConfetti();
      if (!completedRef.current) {
        completedRef.current = true;
        const bonus = stars === 3 ? XP.PERFECT_LESSON : 0;
        awardXp(XP.STEP + bonus, longestComboThisLesson);
        onComplete?.(stars);
      }
    } else {
      // Reward for clearing a non-quiz step
      awardXp(XP.STEP);
    }
    setStep(next);
  };

  const goNext = (after: Step) => {
    playClick();
    const idx = stepOrder.indexOf(after);
    const next = stepOrder[idx + 1] ?? "done";
    advance(next === undefined ? "done" : (next as Step) || "done");
    if (idx + 1 >= stepOrder.length) advance("done");
  };

  const handleQuizPick = (i: number) => {
    if (pickedAnswer !== null) return;
    playClick();
    setPickedAnswer(i);
    const correct = i === lesson.quiz[quizIndex].correctIndex;
    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setLongestComboThisLesson((c) => Math.max(c, newCombo));
      setQuizScore((s) => s + 1);
      const mult = comboMultiplier(newCombo);
      const reward = XP.CORRECT * mult + (newCombo >= 2 ? XP.COMBO_BONUS : 0);
      awardXp(reward, newCombo);
      playCorrect();
      if (newCombo >= 2) playCombo(newCombo);
      confetti({ particleCount: 60 + newCombo * 20, spread: 60, origin: { y: 0.5 } });
      setTeacherMsg(newCombo >= 3 ? `Hot streak! ${newCombo} op rij!` : "Goed zo!");
    } else {
      setCombo(0);
      playWrong();
      setTeacherMsg("Geen punt — kijk nog eens, je leert ervan!");
    }
  };

  const currentIndex = stepOrder.indexOf(step);
  const showProgress = step !== "intro" && step !== "done";
  const dockHidden = step === "intro" || step === "done";

  return (
    <>
      {showProgress && currentIndex >= 0 && (
        <div className="mb-3 sm:mb-4">
          <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] font-display text-muted-foreground sm:text-xs">
            <span>Etappe {currentIndex + 1} / {stepOrder.length}</span>
            <span className="opacity-70">Les {lesson.id}</span>
          </div>
          {/* Gemstone progress */}
          <div className="flex items-center gap-1">
            {stepOrder.map((_, i) => {
              const filled = i < currentIndex;
              const current = i === currentIndex;
              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ scale: current ? 1.15 : 1, rotate: current ? 0 : 0 }}
                  className="flex-1 grid place-items-center"
                >
                  <div
                    className={cn(
                      "h-3.5 w-3.5 rotate-45 border-2",
                      filled && "bg-success border-success shadow-soft",
                      current && "bg-secondary border-[hsl(36_60%_28%)] animate-coin-shine",
                      !filled && !current && "bg-muted border-muted-foreground/30",
                    )}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {showProgress && (
        <GameHud
          xp={progress.xpInLevel}
          level={progress.level}
          pct={progress.pct}
          streak={stats.streak_days}
          combo={combo}
          comboMultiplier={comboMultiplier(combo)}
          bursts={bursts}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {step === "intro" && (
            <LessonKickoff lesson={lesson} onStart={() => goNext("intro")} />
          )}

          {step === "theoryIntro" && (
            <TheoryCard
              eyebrow="Even uitleggen"
              text={lesson.theoryIntro!}
              lessonId={lesson.id}
              step="theoryIntro"
              onNext={() => goNext("theoryIntro")}
            />
          )}

          {step === "fact" && (
            <section className="relative rounded-3xl bg-card border-2 border-primary p-5 text-center shadow-pop animate-pop-in sm:p-8">
              <div className="absolute top-4 right-4">
                <SparkVoiceButton lessonId={lesson.id} step="fact" variant="compact" />
              </div>
              <div className="flex justify-center mb-3">
                <Spark size={72} mood="hinting" />
              </div>
              <div className="text-sm font-display text-primary uppercase tracking-wider mb-2">Wist je dat?</div>
              <p className="font-display text-lg leading-snug sm:text-2xl md:text-3xl">{lesson.fact}</p>
              <Button onClick={() => goNext("fact")} className="mt-8 h-14 w-full rounded-full font-display bg-primary shadow-soft sm:w-auto sm:px-8">
                Verder →
              </Button>
            </section>
          )}

          {step === "sparkMiddle" && (
            <section className={`rounded-3xl p-6 sm:p-8 shadow-soft animate-pop-in ${PILLAR_BG[lesson.pillar]}`}>
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                <div className="shrink-0">
                  <Spark size={96} mood="explaining" />
                </div>
                <div className="flex-1 rounded-2xl bg-background/95 text-foreground p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs uppercase tracking-wider text-primary font-display">Spark zegt</div>
                    <SparkVoiceButton lessonId={lesson.id} step="sparkMiddle" variant="compact" />
                  </div>
                  <div className="font-body">{renderRichText(lesson.sparkMiddle!)}</div>
                </div>
              </div>
              <Button
                onClick={() => goNext("sparkMiddle")}
                className="mt-6 w-full sm:w-auto sm:mx-auto sm:flex h-14 px-8 rounded-full font-display bg-white text-foreground hover:bg-white/90 shadow-pop"
              >
                Verder →
              </Button>
            </section>
          )}

          {step === "theoryDeep" && (
            <TheoryCard
              eyebrow="Nog iets erbij"
              text={lesson.theoryDeep!}
              lessonId={lesson.id}
              step="theoryDeep"
              onNext={() => goNext("theoryDeep")}
            />
          )}

          {step === "interactive" && (
            <Interactive interactive={lesson.interactive} onDone={() => goNext("interactive")} />
          )}

          {step === "summary" && (
            <SummaryCard bullets={lesson.summary!} lessonId={lesson.id} onNext={() => goNext("summary")} />
          )}

          {step === "quiz" && (
            <QuizCard
              question={lesson.quiz[quizIndex]}
              index={quizIndex}
              total={lesson.quiz.length}
              picked={pickedAnswer}
              onPick={handleQuizPick}
              onNext={() => {
                playClick();
                setPickedAnswer(null);
                if (quizIndex + 1 >= lesson.quiz.length) advance("done");
                else setQuizIndex(quizIndex + 1);
              }}
            />
          )}

          {step === "done" && (
            <section className="relative rounded-3xl border-4 border-foreground/85 bg-gradient-to-b from-[hsl(48_100%_88%)] via-[hsl(45_100%_78%)] to-[hsl(40_100%_68%)] p-6 sm:p-8 text-center shadow-pop animate-pop-in overflow-hidden">
              {/* Confetti dots in background */}
              <div className="pointer-events-none absolute inset-0 opacity-60 text-[hsl(36_60%_28%)]" aria-hidden>
                <span className="absolute left-4 top-6 animate-twinkle"><GameGlyph name="sparkle" size={20} /></span>
                <span className="absolute right-6 top-10 animate-twinkle" style={{ animationDelay: "0.6s" }}><GameGlyph name="sparkle" size={16} /></span>
                <span className="absolute left-10 bottom-8 animate-twinkle" style={{ animationDelay: "1.2s" }}><GameGlyph name="sparkle" size={20} /></span>
                <span className="absolute right-10 bottom-6 animate-twinkle" style={{ animationDelay: "0.3s" }}><GameGlyph name="sparkle" size={16} /></span>
              </div>

              {/* Podium */}
              <div className="relative flex justify-center items-end gap-2 mb-3">
                <div className="h-10 w-12 rounded-t-md bg-[hsl(248_78%_60%)] border-2 border-foreground/30 flex items-end justify-center text-white font-display text-xs pb-1">2</div>
                <div className="relative flex flex-col items-center">
                  <div className="relative -mb-2 z-10">
                    <Spark size={120} mood="cheering" />
                  </div>
                  <div className="h-14 w-16 rounded-t-md bg-[hsl(45_100%_50%)] border-2 border-foreground/30 flex items-end justify-center text-white font-display text-xl pb-1 shadow-pop">💪</div>
                </div>
                <div className="h-7 w-12 rounded-t-md bg-[hsl(0_85%_60%)] border-2 border-foreground/30 flex items-end justify-center text-white font-display text-xs pb-1">3</div>
              </div>
              <div className="relative">
                <h2 className="font-display text-3xl sm:text-4xl text-[hsl(30_60%_18%)] drop-shadow">VICTORY!</h2>
                <div className="flex justify-center gap-1.5 mt-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -90, y: -10 }}
                      animate={{ scale: 1, rotate: 0, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.18, type: "spring", stiffness: 260, damping: 12 }}
                    >
                      <span
                        className={cn(
                          "inline-block",
                          i < stars
                            ? "text-secondary"
                            : "text-foreground/20",
                        )}
                      >
                        <GameGlyph name="star" size={48} />
                      </span>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-4 font-display text-[hsl(30_60%_18%)]">
                  Score: {quizScore} / {lesson.quiz.length}
                </p>
                {longestComboThisLesson >= 2 && (
                  <p className="mt-1 text-sm font-display text-[hsl(30_60%_18%)]">
                    Beste combo: <span className="font-bold">{longestComboThisLesson}× FEVER</span>
                  </p>
                )}
                {lesson.reflection && (
                  <div className="mt-4 mx-auto max-w-md">
                    <SparkBubble text={lesson.reflection} mood="celebrating" size={72} />
                  </div>
                )}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  {renderDoneCta?.(stars)}
                </div>
                {preview && (
                  <p className="mt-4 text-xs text-[hsl(30_60%_28%)]">Preview-modus, niets opgeslagen</p>
                )}
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      <SparkTeacher mood={teacherMood} message={teacherMsg} hidden={dockHidden} />
      <LevelUpOverlay level={levelUpTo} onClose={() => setLevelUpTo(null)} />
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
  useSparkVoice(lesson.id, "intro", { autoPlay: true });

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
    <section className={`rounded-3xl p-6 sm:p-8 text-center shadow-pop ${PILLAR_BG[lesson.pillar]} animate-pop-in`}>
      <div className="text-xs font-display opacity-90 animate-kickoff-fade-up">
        Les {lesson.id} {lesson.bossTest && "· Baas-test"}
      </div>
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl mt-1 mb-6 animate-kickoff-fade-up">{lesson.title}</h1>

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
  lessonId,
  step,
  onNext,
}: {
  eyebrow: string;
  text: string;
  lessonId: string;
  step: string;
  onNext: () => void;
}) => {
  const seconds = estimateReadSeconds(text);
  return (
    <section className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-soft animate-pop-in">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-primary">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" /> {eyebrow}
        </div>
        <SparkVoiceButton lessonId={lessonId} step={step} variant="compact" />
      </div>
      <div className="flex gap-5 items-start">
        <div className="hidden sm:block shrink-0 sticky top-4">
          <Spark size={80} mood="explaining" />
        </div>
        <div className="flex-1 min-w-0">
          {renderRichText(text, { detectLead: true })}
          <div className="mt-5 text-xs text-muted-foreground font-display">
            ~{seconds < 60 ? `${seconds} sec` : `${Math.round(seconds / 60)} min`} lezen
          </div>
        </div>
      </div>
      <Button onClick={onNext} className="mt-6 w-full h-14 rounded-full font-display bg-primary shadow-soft">
        Begrepen, ga verder →
      </Button>
    </section>
  );
};

const SummaryCard = ({ bullets, lessonId, onNext }: { bullets: string[]; lessonId: string; onNext: () => void }) => (
  <section className="rounded-3xl bg-success/10 border-2 border-success p-6 sm:p-8 shadow-soft animate-pop-in">
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-success">
        <span className="inline-block h-2 w-2 rounded-full bg-success" /> Onthoud dit
      </div>
      <SparkVoiceButton lessonId={lessonId} step="summary" variant="compact" />
    </div>
    <h3 className="font-display text-xl mb-2">Samenvatting</h3>
    <p className="text-sm text-muted-foreground mb-5">Dit is wat je moet onthouden:</p>
    <ul className="space-y-3">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-success to-primary text-success-foreground font-display text-sm flex items-center justify-center shadow-soft">
            {i + 1}
          </span>
          <span className="text-base leading-snug pt-0.5">{b}</span>
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
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              disabled={picked !== null}
              className={cn(
                "btn-squish w-full text-left p-4 rounded-2xl border-[3px] min-h-[60px] font-body bg-card flex items-center gap-3",
                showCorrect && "bg-success/20 border-success",
                showWrong && "bg-destructive/15 border-destructive",
                picked === null && "border-foreground/15 hover:border-primary",
                picked !== null && !showCorrect && !showWrong && "border-foreground/10 opacity-60",
              )}
            >
              <span
                className={cn(
                  "shrink-0 grid place-items-center h-9 w-9 rounded-full font-display text-base border-2",
                  showCorrect && "bg-success text-success-foreground border-success",
                  showWrong && "bg-destructive text-destructive-foreground border-destructive",
                  !showCorrect && !showWrong && "bg-primary/10 text-primary border-primary/30",
                )}
              >
                {showCorrect ? <GameGlyph name="check" size={16} /> : showWrong ? <span className="font-display text-lg leading-none">×</span> : letter}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
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
        className="rounded-full font-display"
      >
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
  if (interactive.kind === "sortBuckets") return <SortBuckets step={interactive} onDone={onDone} />;
  if (interactive.kind === "dragOrder") return <DragOrder step={interactive} onDone={onDone} />;
  if (interactive.kind === "spotTheRed") return <SpotTheRed step={interactive} onDone={onDone} />;
  return <PromptBuilder step={interactive} onDone={onDone} />;
};

const DragOrder = ({ step, onDone }: { step: Extract<InteractiveStep, { kind: "dragOrder" }>; onDone: () => void }) => {
  const correct = step.items;
  const [shuffled] = useState(() => {
    const arr = [...correct];
    // Fisher-Yates, but ensure it differs from the correct order
    for (let attempt = 0; attempt < 5; attempt++) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      if (arr.some((v, i) => v !== correct[i])) break;
    }
    return arr;
  });
  const [order, setOrder] = useState<string[]>(shuffled);
  const [checked, setChecked] = useState(false);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  const allCorrect = order.every((v, i) => v === correct[i]);
  return (
    <section className="rounded-3xl bg-card border border-border p-5 shadow-soft sm:p-6">
      <h3 className="mb-4 text-lg leading-snug font-display sm:mb-5 sm:text-xl">{step.prompt}</h3>
      <ol className="space-y-2">
        {order.map((item, i) => {
          const right = checked && item === correct[i];
          const wrong = checked && item !== correct[i];
          return (
            <li
              key={item}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 p-3",
                right && "bg-success/10 border-success",
                wrong && "bg-destructive/10 border-destructive",
                !checked && "border-border",
              )}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted font-display text-sm">{i + 1}</span>
              <span className="flex-1 text-sm leading-snug">{item}</span>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="outline" disabled={checked || i === 0} onClick={() => move(i, -1)} className="h-9 w-9 rounded-full p-0">↑</Button>
                <Button size="sm" variant="outline" disabled={checked || i === order.length - 1} onClick={() => move(i, 1)} className="h-9 w-9 rounded-full p-0">↓</Button>
              </div>
            </li>
          );
        })}
      </ol>
      <HintButton hints={step.hints} />
      {!checked ? (
        <Button onClick={() => { setChecked(true); if (allCorrect) confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } }); }}
          className="mt-4 w-full h-14 rounded-full font-display bg-primary shadow-soft">
          Check mijn volgorde
        </Button>
      ) : (
        <>
          <div className="mt-4 p-4 rounded-2xl bg-muted/60 text-sm">{step.explanation}</div>
          <Button onClick={onDone} className="mt-4 w-full h-14 rounded-full font-display bg-primary shadow-soft">Verder →</Button>
        </>
      )}
    </section>
  );
};

const SpotTheRed = ({ step, onDone }: { step: Extract<InteractiveStep, { kind: "spotTheRed" }>; onDone: () => void }) => {
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const reds = step.flags.filter((f) => f.isRed).length;
  const foundReds = [...tapped].filter((i) => step.flags[i].isRed).length;
  const done = foundReds === reds;
  const toggle = (i: number) => {
    if (tapped.has(i)) return;
    setTapped(new Set([...tapped, i]));
    if (step.flags[i].isRed) confetti({ particleCount: 30, spread: 40, origin: { y: 0.5 } });
  };
  return (
    <section className="rounded-3xl bg-card border border-border p-5 shadow-soft sm:p-6">
      <h3 className="mb-3 text-lg leading-snug font-display sm:text-xl">{step.prompt}</h3>
      <div className="mb-4 rounded-2xl bg-muted/40 p-4 text-sm italic">"{step.message}"</div>
      <p className="mb-2 text-sm text-muted-foreground">Tik de stukjes aan die jou verdacht lijken:</p>
      <div className="flex flex-wrap gap-2">
        {step.flags.map((f, i) => {
          const isTapped = tapped.has(i);
          const right = isTapped && f.isRed;
          const wrong = isTapped && !f.isRed;
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              disabled={isTapped}
              className={cn(
                "rounded-full border-2 px-3 py-2 text-sm transition-bounce",
                right && "bg-success/15 border-success",
                wrong && "bg-destructive/10 border-destructive",
                !isTapped && "border-border hover:border-primary",
              )}
            >
              {f.fragment}
            </button>
          );
        })}
      </div>
      {tapped.size > 0 && (
        <ul className="mt-4 space-y-2">
          {[...tapped].map((i) => (
            <li key={i} className="rounded-2xl bg-muted/60 p-3 text-sm">
              <span className="font-display">{step.flags[i].isRed ? "Rode vlag: " : "Geen rode vlag: "}</span>
              {step.flags[i].why}
            </li>
          ))}
        </ul>
      )}
      <HintButton hints={step.hints} />
      <Button onClick={onDone} disabled={!done} className="mt-4 w-full h-14 rounded-full font-display bg-primary shadow-soft">
        {done ? "Verder →" : `Vind alle rode vlaggen (${foundReds}/${reds})`}
      </Button>
    </section>
  );
};

const PromptBuilder = ({ step, onDone }: { step: Extract<InteractiveStep, { kind: "promptBuilder" }>; onDone: () => void }) => {
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const allPicked = Object.keys(choices).length === step.slots.length;
  const strongCount = step.slots.reduce((n, s, i) => n + (choices[i] !== undefined && s.options[choices[i]].strong ? 1 : 0), 0);
  return (
    <section className="rounded-3xl bg-card border border-border p-5 shadow-soft sm:p-6">
      <h3 className="mb-4 text-lg leading-snug font-display sm:text-xl">{step.prompt}</h3>
      <div className="space-y-4">
        {step.slots.map((slot, si) => (
          <div key={si}>
            <div className="mb-2 font-display text-sm uppercase tracking-wide text-muted-foreground">{slot.label}</div>
            <div className="space-y-2">
              {slot.options.map((opt, oi) => {
                const picked = choices[si] === oi;
                const right = checked && picked && opt.strong;
                const weak = checked && picked && !opt.strong;
                return (
                  <button
                    key={oi}
                    onClick={() => !checked && setChoices({ ...choices, [si]: oi })}
                    disabled={checked}
                    className={cn(
                      "w-full text-left rounded-2xl border-2 p-3 text-sm transition-bounce",
                      picked && !checked && "border-primary bg-primary/5",
                      right && "border-success bg-success/10",
                      weak && "border-destructive bg-destructive/10",
                      !picked && "border-border hover:border-primary",
                    )}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {allPicked && (
        <div className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm">
          <div className="mb-1 font-display text-xs uppercase text-muted-foreground">Jouw prompt:</div>
          {step.slots.map((s, i) => s.options[choices[i]].text).join(" • ")}
        </div>
      )}
      <HintButton hints={step.hints} />
      {!checked ? (
        <Button onClick={() => { setChecked(true); if (strongCount === step.slots.length) confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } }); }}
          disabled={!allPicked} className="mt-4 w-full h-14 rounded-full font-display bg-primary shadow-soft">
          Bouw mijn prompt
        </Button>
      ) : (
        <>
          <div className="mt-4 p-4 rounded-2xl bg-muted/60 text-sm">
            <div className="mb-1 font-display">Sterke keuzes: {strongCount}/{step.slots.length}</div>
            {step.explanation}
          </div>
          <Button onClick={onDone} className="mt-4 w-full h-14 rounded-full font-display bg-primary shadow-soft">Verder →</Button>
        </>
      )}
    </section>
  );
};

const MultiChoice = ({ step, onDone }: { step: Extract<InteractiveStep, { kind: "multiChoice" }>; onDone: () => void }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const wrong = picked !== null && !step.options[picked].correct;
  return (
    <section className={cn("rounded-3xl bg-card border border-border p-5 shadow-soft sm:p-6", wrong && "animate-shake")}>
      <h3 className="mb-4 text-lg leading-snug font-display sm:mb-5 sm:text-xl">{step.question}</h3>
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
    <section className="rounded-3xl bg-card border border-border p-5 shadow-soft sm:p-6">
      <h3 className="mb-4 text-lg leading-snug font-display sm:mb-5 sm:text-xl">{step.prompt}</h3>
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
    <section className="rounded-3xl bg-card border border-border p-5 shadow-soft sm:p-6">
      <h3 className="mb-4 text-lg leading-snug font-display sm:mb-5 sm:text-xl">{step.prompt}</h3>
      <div className="mb-4 space-y-3">
        {step.items.map((it, i) => {
          const chosen = placed[i];
          const correct = chosen !== undefined && chosen === it.bucket;
          const wrong = chosen !== undefined && chosen !== it.bucket;
          return (
            <div
              key={i}
              className={cn(
                "rounded-2xl border-2 p-4 flex flex-col gap-3 sm:flex-row sm:items-center",
                correct && "bg-success/10 border-success",
                wrong && "bg-destructive/10 border-destructive animate-shake",
                chosen === undefined && "border-border",
              )}
            >
              <span className="min-w-0 flex-1 font-body text-base leading-snug sm:text-sm">{it.label}</span>
              <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
                {step.buckets.map((b, bi) => (
                  <Button
                    key={bi}
                    size="sm"
                    variant={chosen === bi ? "default" : "outline"}
                    onClick={() => place(i, bi)}
                    disabled={chosen !== undefined}
                    className="h-11 w-full rounded-full px-4 font-display text-sm sm:h-9 sm:w-auto sm:text-xs"
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
