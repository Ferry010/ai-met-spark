import { useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Game } from "@/content/missions";
import { shuffle } from "@/lib/shuffle";
import { FeedbackSheet } from "../FeedbackSheet";
import type { GameProps } from "./SwipeGame";
import { cn } from "@/lib/utils";

type Order = Extract<Game, { kind: "order" }>;

/**
 * Tap the steps in the right order. Each tap is checked straight away:
 * a right step locks in, a wrong one shakes. Easier than dragging on
 * touchscreens and trackpads, and you can never get stuck.
 */
export const OrderGame = ({ game, onAnswer, onDone }: GameProps<Order>) => {
  const tiles = useMemo(() => shuffle(game.items), [game]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const mistakes = useRef(0);

  const done = placed.length === game.items.length;

  const tap = (item: string) => {
    if (done || placed.includes(item)) return;
    if (item === game.items[placed.length]) {
      setPlaced((p) => [...p, item]);
      onAnswer(true);
    } else {
      mistakes.current += 1;
      setWrong(item);
      onAnswer(false);
      window.setTimeout(() => setWrong((w) => (w === item ? null : w)), 450);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-5 text-2xl sm:text-3xl">{game.prompt}</h2>

      <ol className="mb-6 flex flex-col gap-2">
        {game.items.map((_, i) => {
          const item = placed[i];
          return (
            <li
              key={i}
              className={cn(
                "flex min-h-[52px] items-center gap-3 rounded-2xl border-2 px-3 py-2",
                item ? "border-success bg-success-soft animate-pop-in" : "border-dashed border-border-strong",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm",
                  item ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {item ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("text-[16px]", !item && "text-muted-foreground")}>{item ?? "…"}</span>
            </li>
          );
        })}
      </ol>

      {!done && (
        <>
          <p className="mb-3 text-sm text-muted-foreground">Tik de stap die nu komt:</p>
          <div className="flex flex-col gap-3">
            {tiles
              .filter((t) => !placed.includes(t))
              .map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => tap(t)}
                  className={cn(
                    "press tile min-h-[56px] px-4 py-3 text-left text-[17px] hover:bg-muted",
                    wrong === t && "border-destructive bg-destructive-soft animate-shake",
                  )}
                >
                  {t}
                </button>
              ))}
          </div>
        </>
      )}

      {done && (
        <FeedbackSheet
          correct={mistakes.current === 0}
          title={mistakes.current === 0 ? "Perfecte volgorde!" : "Gelukt!"}
          body={game.explanation}
          onContinue={onDone}
        />
      )}
      <div className="h-44" aria-hidden />
    </div>
  );
};

export default OrderGame;
