import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { Game } from "@/content/missions";
import { shuffle } from "@/lib/shuffle";
import { PILLAR_THEME } from "@/lib/pillars";
import { Spark } from "@/components/Spark";
import { FeedbackSheet } from "../FeedbackSheet";
import type { GameProps } from "./SwipeGame";
import { cn } from "@/lib/utils";

type Pick = Extract<Game, { kind: "pick" }>;

/** A short situation with three shuffled choices. */
export const PickGame = ({ game, pillar, onAnswer, onDone }: GameProps<Pick>) => {
  const options = useMemo(() => shuffle(game.options), [game]);
  const theme = PILLAR_THEME[pillar];
  const [picked, setPicked] = useState<number | null>(null);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer(!!options[i].correct);
  };

  const chosen = picked !== null ? options[picked] : null;

  return (
    <div className="flex flex-col">
      <div className={cn("tile mb-5 flex items-start gap-3 p-4", theme.soft, "border-transparent")}>
        <Spark size={48} mood="questioning" animate={false} className="shrink-0" />
        <p className="pt-1 text-[17px] leading-snug">{game.scenario}</p>
      </div>
      <h2 className="mb-4 text-2xl sm:text-3xl">{game.question}</h2>

      <div className="flex flex-col gap-3">
        {options.map((o, i) => {
          const isPicked = picked === i;
          const reveal = picked !== null;
          const good = reveal && o.correct;
          const bad = isPicked && !o.correct;
          return (
            <button
              key={o.text}
              type="button"
              onClick={() => choose(i)}
              disabled={reveal}
              className={cn(
                "press tile flex min-h-[60px] items-center gap-3 px-4 py-3 text-left text-[17px] leading-snug",
                "hover:bg-muted disabled:opacity-100",
                good && "border-success bg-success-soft",
                bad && "border-destructive bg-destructive-soft animate-shake",
                reveal && !good && !bad && "opacity-50",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 font-display text-sm",
                  good ? "border-success bg-success text-success-foreground" : bad ? "border-destructive bg-destructive text-destructive-foreground" : "border-border",
                )}
              >
                {good ? <Check className="h-4 w-4" strokeWidth={3} /> : bad ? <X className="h-4 w-4" strokeWidth={3} /> : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{o.text}</span>
            </button>
          );
        })}
      </div>

      {chosen && (
        <FeedbackSheet
          correct={!!chosen.correct}
          body={chosen.why}
          onContinue={onDone}
        />
      )}
      <div className="h-40" aria-hidden />
    </div>
  );
};

export default PickGame;
