import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { Game, Pillar } from "@/content/missions";
import { shuffle } from "@/lib/shuffle";
import { PILLAR_THEME } from "@/lib/pillars";
import { FeedbackSheet } from "../FeedbackSheet";
import { cn } from "@/lib/utils";

type Swipe = Extract<Game, { kind: "swipe" }>;

export interface GameProps<G> {
  game: G;
  pillar: Pillar;
  onAnswer: (correct: boolean) => void;
  onDone: () => void;
}

const SWIPE_THRESHOLD = 90;

/** Sort cards into two piles, one at a time. Tap a side, or drag the card. */
export const SwipeGame = ({ game, pillar, onAnswer, onDone }: GameProps<Swipe>) => {
  const cards = useMemo(() => shuffle(game.cards), [game]);
  const theme = PILLAR_THEME[pillar];
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<{ correct: boolean; side: "left" | "right" } | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  const card = cards[index];

  const choose = useCallback(
    (side: "left" | "right") => {
      if (result || !card) return;
      const correct = side === card.side;
      setResult({ correct, side });
      onAnswer(correct);
    },
    [card, result, onAnswer],
  );

  const next = useCallback(() => {
    setResult(null);
    x.set(0);
    if (index + 1 >= cards.length) onDone();
    else setIndex((i) => i + 1);
  }, [index, cards.length, onDone, x]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (result) return;
      if (e.key === "ArrowLeft") choose("left");
      if (e.key === "ArrowRight") choose("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, result]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) choose("left");
    else if (info.offset.x > SWIPE_THRESHOLD) choose("right");
  };

  if (!card) return null;

  return (
    <div className="flex flex-col items-center">
      <div className={cn("mb-2 text-sm font-semibold", theme.text)}>
        Kaart {index + 1} van {cards.length}
      </div>
      <h2 className="mb-6 text-center text-2xl sm:text-3xl">{game.prompt}</h2>

      <div className="relative mb-8 h-56 w-full max-w-sm">
        {/* next card peeking behind */}
        {cards[index + 1] && (
          <div className="tile absolute inset-0 translate-y-3 scale-95 opacity-60" aria-hidden />
        )}
        <motion.div
          key={index}
          drag={result ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          onDragEnd={onDragEnd}
          style={{ x, rotate }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: result ? (result.side === "left" ? -40 : 40) : 0,
            rotate: result ? (result.side === "left" ? -4 : 4) : 0,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className={cn(
            "tile absolute inset-0 flex cursor-grab touch-pan-y select-none items-center justify-center p-6 text-center active:cursor-grabbing",
            result && (result.correct ? "border-success bg-success-soft" : "border-destructive bg-destructive-soft animate-shake"),
          )}
        >
          <p className="font-display text-2xl leading-tight sm:text-[28px]">{card.text}</p>
        </motion.div>
      </div>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {(["left", "right"] as const).map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => choose(side)}
            disabled={!!result}
            className={cn(
              "press tile min-h-[64px] px-3 py-3 font-display text-base font-bold leading-tight sm:text-lg",
              "hover:bg-muted disabled:opacity-100",
              result?.side === side && (result.correct ? "border-success bg-success-soft" : "border-destructive bg-destructive-soft"),
            )}
          >
            <Label text={side === "left" ? game.left : game.right} />
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Tip: je kunt de kaart ook naar links of rechts vegen.</p>

      {result && (
        <FeedbackSheet
          key={`feedback-${index}`}
          correct={result.correct}
          body={card.why}
          onContinue={next}
          autoAdvanceMs={result.correct ? 1800 : undefined}
        />
      )}
      <div className="h-40" aria-hidden />
    </div>
  );
};

/** "🤖 AI" → emoji and text with proper spacing. */
const Label = ({ text }: { text: string }) => {
  const [first, ...rest] = text.split(" ");
  const hasIcon = rest.length > 0 && !/[a-z0-9]/i.test(first);
  return hasIcon ? (
    <span className="inline-flex items-center justify-center gap-2">
      <span aria-hidden>{first}</span>
      <span>{rest.join(" ")}</span>
    </span>
  ) : (
    <>{text}</>
  );
};

export default SwipeGame;
