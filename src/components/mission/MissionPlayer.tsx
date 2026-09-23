import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Flame, Zap, Star, Clock, Gamepad2, ArrowRight, RotateCcw, Map } from "lucide-react";
import type { Game, Mission } from "@/content/missions";
import { PILLAR_THEME } from "@/lib/pillars";
import { comboMultiplier } from "@/lib/gamification";
import { playClick, playCombo, playCorrect, playLevelUp, playWrong, unlockAudio } from "@/lib/sounds";
import { cancelSpeech } from "@/lib/speech";
import { Spark } from "@/components/Spark";
import { ReadAloud } from "@/components/ReadAloud";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SwipeGame } from "./games/SwipeGame";
import { PickGame } from "./games/PickGame";
import { SpotGame } from "./games/SpotGame";
import { BuildGame } from "./games/BuildGame";
import { OrderGame } from "./games/OrderGame";
import { QuickFire } from "./games/QuickFire";
import { cn } from "@/lib/utils";

// Unlock WebAudio on the first user gesture anywhere in the app.
if (typeof window !== "undefined") {
  const unlock = () => {
    unlockAudio();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}

export interface MissionResult {
  stars: 1 | 2 | 3;
  xp: number;
  bestCombo: number;
  mistakes: number;
}

export interface SaveOutcome {
  leveledUp?: boolean;
  newLevel?: number;
}

interface MissionPlayerProps {
  mission: Mission;
  onExit: () => void;
  onComplete: (result: MissionResult) => Promise<SaveOutcome | void> | void;
  /** Label + handler for the "next" button on the reward screen. */
  next?: { label: string; onClick: () => void };
  /** Restart the mission (the parent re-mounts the player). */
  onReplay?: () => void;
  preview?: boolean;
}

type Stage = "intro" | "cards" | "game0" | "game1" | "quick" | "done";
const STAGE_ORDER: Stage[] = ["intro", "cards", "game0", "game1", "quick", "done"];

export const XP_PER_CORRECT = 10;
export const XP_COMPLETE = 30;
export const XP_PERFECT = 20;

export const starsFor = (mistakes: number): 1 | 2 | 3 => (mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1);

export const MissionPlayer = ({ mission, onExit, onComplete, next, onReplay, preview }: MissionPlayerProps) => {
  const theme = PILLAR_THEME[mission.pillar];
  const [stage, setStage] = useState<Stage>("intro");
  const [cardIndex, setCardIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [burst, setBurst] = useState<{ id: number; amount: number } | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [saved, setSaved] = useState<SaveOutcome | null>(null);
  const comboRef = useRef(0);
  const bestCombo = useRef(0);
  const mistakes = useRef(0);
  const xpRef = useRef(0);
  const completed = useRef(false);
  // Refs mirror the current step so taps on a view that is animating out
  // (or a double-tap) can never skip ahead or jump back.
  const stageRef = useRef<Stage>("intro");
  const cardRef = useRef(0);

  useEffect(() => () => cancelSpeech(), [stage, cardIndex]);

  const onAnswer = useCallback((correct: boolean) => {
    if (correct) {
      const c = comboRef.current + 1;
      comboRef.current = c;
      bestCombo.current = Math.max(bestCombo.current, c);
      const gained = XP_PER_CORRECT * comboMultiplier(c);
      xpRef.current += gained;
      setCombo(c);
      setXp(xpRef.current);
      setBurst({ id: Date.now() + Math.random(), amount: gained });
      playCorrect();
      if (c >= 3) playCombo(c);
    } else {
      comboRef.current = 0;
      mistakes.current += 1;
      setCombo(0);
      playWrong();
    }
  }, []);

  const go = useCallback((s: Stage) => {
    if (STAGE_ORDER.indexOf(s) <= STAGE_ORDER.indexOf(stageRef.current)) return;
    stageRef.current = s;
    playClick();
    setStage(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const advanceCard = useCallback(
    (from: number) => {
      if (stageRef.current !== "cards" || from !== cardRef.current) return;
      if (from < mission.cards.length - 1) {
        cardRef.current = from + 1;
        playClick();
        setCardIndex(from + 1);
      } else go("game0");
    },
    [go, mission.cards.length],
  );

  // Finish: compute stars + XP once, then save.
  useEffect(() => {
    if (stage !== "done" || completed.current) return;
    completed.current = true;
    const stars = starsFor(mistakes.current);
    const total = xpRef.current + XP_COMPLETE + (stars === 3 ? XP_PERFECT : 0);
    const r: MissionResult = { stars, xp: total, bestCombo: bestCombo.current, mistakes: mistakes.current };
    setResult(r);
    setXp(total);
    confetti({ particleCount: stars === 3 ? 160 : 90, spread: 90, origin: { y: 0.35 }, colors: ["#6B4FF0", "#FFC21A", "#1FA36A", "#F0436B", "#1A8FEA"] });
    Promise.resolve(onComplete(r))
      .then((o) => {
        setSaved(o ?? {});
        if (o && o.leveledUp) playLevelUp();
      })
      .catch(() => setSaved({}));
  }, [stage, onComplete]);

  const progressIndex = stage === "cards" ? 1 + cardIndex : stage === "intro" ? 0 : stage === "done" ? 7 : { game0: 4, game1: 5, quick: 6 }[stage];
  const pct = Math.round((progressIndex / 7) * 100);

  const requestExit = () => {
    if (stage === "intro" || stage === "done") onExit();
    else setConfirmExit(true);
  };

  const renderGame = (game: Game, then: Stage) => {
    const props = { pillar: mission.pillar, onAnswer, onDone: () => go(then) } as const;
    switch (game.kind) {
      case "swipe":
        return <SwipeGame game={game} {...props} />;
      case "pick":
        return <PickGame game={game} {...props} />;
      case "spot":
        return <SpotGame game={game} {...props} />;
      case "build":
        return <BuildGame game={game} {...props} />;
      case "order":
        return <OrderGame game={game} {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={requestExit}
            aria-label="Missie stoppen"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
          >
            <X className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className={cn("h-full rounded-full transition-[width] duration-500 ease-out", theme.bar)} style={{ width: `${pct}%` }} />
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            {combo >= 2 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-display text-sm text-accent-foreground animate-combo-pulse">
                <Flame className="h-4 w-4" /> ×{combo}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-2.5 py-1 font-display text-sm text-secondary-foreground">
              <Zap className="h-4 w-4 fill-current" /> {xp}
            </span>
            {burst && (
              <span key={burst.id} className="pointer-events-none absolute -bottom-6 right-0 font-display text-sm text-secondary-dark animate-xp-burst">
                +{burst.amount}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-10 pt-4 sm:pt-8">
        {/* Enter-only transition: the previous step unmounts instantly, so a
            fast double-tap can never hit a view that is on its way out. */}
        <motion.div
            key={stage === "cards" ? `cards-${cardIndex}` : stage}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {stage === "intro" && <Intro mission={mission} onStart={() => go("cards")} />}

            {stage === "cards" && (
              <LearnCardView mission={mission} index={cardIndex} onNext={() => advanceCard(cardIndex)} />
            )}

            {stage === "game0" && renderGame(mission.games[0], "game1")}
            {stage === "game1" && renderGame(mission.games[1], "quick")}
            {stage === "quick" && (
              <QuickFire items={mission.quick} pillar={mission.pillar} onAnswer={onAnswer} onDone={() => go("done")} />
            )}

            {stage === "done" && result && (
              <Reward
                mission={mission}
                result={result}
                saved={saved}
                preview={preview}
                next={next}
                onReplay={onReplay ?? (() => window.location.reload())}
                onExit={onExit}
              />
            )}
          </motion.div>
      </main>

      <AlertDialog open={confirmExit} onOpenChange={setConfirmExit}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">Missie stoppen?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Je bent al een eind op weg. Als je nu stopt, begin je de volgende keer opnieuw.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="press h-12 rounded-2xl border-2 font-display font-bold">Doorgaan</AlertDialogCancel>
            <AlertDialogAction onClick={onExit} className="press press-danger h-12 rounded-2xl bg-destructive font-display font-bold hover:bg-destructive/95">
              Stoppen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ---------- Intro ----------

const Intro = ({ mission, onStart }: { mission: Mission; onStart: () => void }) => {
  const theme = PILLAR_THEME[mission.pillar];
  return (
    <div className="flex flex-col">
      <div className={cn("mb-6 rounded-3xl p-6 sm:p-8", theme.solid)}>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold opacity-90">
          <span>Missie {mission.id}</span>
          {mission.boss && <span className="rounded-full bg-foreground/90 px-2 py-0.5 text-xs text-background">BAAS</span>}
        </div>
        <h1 className="flex items-center gap-3 text-4xl leading-none sm:text-5xl">
          <span aria-hidden>{mission.emoji}</span> {mission.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1"><Clock className="h-4 w-4" /> 3 min</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1"><Gamepad2 className="h-4 w-4" /> 2 games</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1"><Star className="h-4 w-4" /> 3 sterren te winnen</span>
        </div>
      </div>

      <div className="mb-8 flex items-end gap-3">
        <Spark size={96} mood="happy" waving className="shrink-0" />
        <div className="tile relative mb-4 flex-1 p-4">
          <p className="text-[17px] leading-snug">{mission.hook}</p>
          <div className="mt-3">
            <ReadAloud text={mission.hook} />
          </div>
        </div>
      </div>

      <Button size="lg" onClick={onStart} className="w-full">
        Start missie
      </Button>
    </div>
  );
};

// ---------- Learn cards ----------

const LearnCardView = ({ mission, index, onNext }: { mission: Mission; index: number; onNext: () => void }) => {
  const theme = PILLAR_THEME[mission.pillar];
  const safeIndex = Math.min(index, mission.cards.length - 1);
  const card = mission.cards[safeIndex];
  const last = safeIndex === mission.cards.length - 1;
  return (
    <div className="flex flex-col items-center text-center">
      <div className={cn("mb-2 text-sm font-semibold", theme.text)}>Weetje {safeIndex + 1} van {mission.cards.length}</div>
      <div className="tile mb-6 w-full p-8 sm:p-10">
        <div className={cn("mx-auto mb-5 grid h-24 w-24 place-items-center rounded-3xl text-5xl", theme.soft)} aria-hidden>
          {card.icon}
        </div>
        <h2 className="mb-3 text-3xl sm:text-4xl">{card.title}</h2>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-foreground/85 sm:text-xl">{card.text}</p>
        <div className="mt-5">
          <ReadAloud text={`${card.title}. ${card.text}`} />
        </div>
      </div>
      <div className="mb-6 flex gap-2" aria-hidden>
        {mission.cards.map((_, i) => (
          <span key={i} className={cn("h-2.5 rounded-full transition-all", i === safeIndex ? cn("w-8", theme.bar) : "w-2.5 bg-border-strong")} />
        ))}
      </div>
      <Button size="lg" onClick={onNext} className="w-full">
        {last ? "Speel!" : "Volgende"} <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

// ---------- Reward ----------

const Reward = ({
  mission,
  result,
  saved,
  preview,
  next,
  onReplay,
  onExit,
}: {
  mission: Mission;
  result: MissionResult;
  saved: SaveOutcome | null;
  preview?: boolean;
  next?: { label: string; onClick: () => void };
  onReplay: () => void;
  onExit: () => void;
}) => {
  const title = result.stars === 3 ? "Perfect!" : result.stars === 2 ? "Goed gedaan!" : "Missie voltooid!";
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex items-end justify-center gap-3">
        {[1, 2, 3].map((n) => (
          <Star
            key={n}
            className={cn(
              "animate-star-pop",
              n === 2 ? "h-20 w-20" : "h-14 w-14",
              n <= result.stars ? "fill-secondary text-secondary-dark" : "fill-muted text-border-strong",
            )}
            strokeWidth={1.5}
            style={{ animationDelay: `${n * 150}ms` }}
          />
        ))}
      </div>
      <h1 className="mb-1 text-4xl sm:text-5xl">{title}</h1>
      <p className="mb-6 text-muted-foreground">
        {mission.title} · {result.stars} {result.stars === 1 ? "ster" : "sterren"}
      </p>

      <div className="mb-6 grid w-full grid-cols-3 gap-3">
        <Stat label="XP" value={`+${result.xp}`} tone="bg-secondary-soft text-secondary-foreground" />
        <Stat label="Beste combo" value={`×${result.bestCombo}`} tone="bg-accent-soft text-accent-dark" />
        <Stat label="Foutjes" value={String(result.mistakes)} tone="bg-primary-soft text-primary-dark" />
      </div>

      {saved?.leveledUp && (
        <div className="mb-6 w-full rounded-2xl bg-primary p-4 font-display text-lg text-primary-foreground animate-pop-in">
          Level omhoog! Je bent nu level {saved.newLevel}.
        </div>
      )}

      <div className="tile mb-8 flex w-full items-center gap-3 p-4 text-left">
        <Spark size={56} mood="celebrating" className="shrink-0" />
        <p className="text-[17px] leading-snug">{mission.takeaway}</p>
      </div>

      {preview && <p className="mb-4 text-sm text-muted-foreground">Voorbeeldmodus: er is niets opgeslagen.</p>}

      <div className="flex w-full flex-col gap-3">
        {next && (
          <Button size="lg" onClick={next.onClick} className="w-full">
            {next.label} <ArrowRight className="h-5 w-5" />
          </Button>
        )}
        <div className={cn("grid gap-3", result.stars < 3 ? "grid-cols-2" : "grid-cols-1")}>
          {result.stars < 3 && (
            <Button size="lg" variant="outline" onClick={onReplay}>
              <RotateCcw className="h-5 w-5" /> Nog een keer
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={onExit}>
            <Map className="h-5 w-5" /> Naar de kaart
          </Button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, tone }: { label: string; value: string; tone: string }) => (
  <div className={cn("rounded-2xl px-3 py-4", tone)}>
    <div className="font-display text-2xl">{value}</div>
    <div className="text-xs font-medium opacity-80">{label}</div>
  </div>
);

export default MissionPlayer;
