import { useMemo, useState } from "react";
import { Check, X, Zap } from "lucide-react";
import type { Pillar, QuickItem } from "@/content/missions";
import { shuffle } from "@/lib/shuffle";
import { PILLAR_THEME } from "@/lib/pillars";
import { FeedbackSheet } from "../FeedbackSheet";
import { cn } from "@/lib/utils";

interface QuickFireProps {
  items: readonly QuickItem[];
  pillar: Pillar;
  onAnswer: (correct: boolean) => void;
  onDone: () => void;
}

/** Three fast true/false statements to lock in what you just learned. */
export const QuickFire = ({ items, pillar, onAnswer, onDone }: QuickFireProps) => {
  const list = useMemo(() => shuffle(items), [items]);
  const theme = PILLAR_THEME[pillar];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);

  const item = list[index];
  const correct = answer !== null && answer === item.answer;

  const choose = (value: boolean) => {
    if (answer !== null) return;
    setAnswer(value);
    onAnswer(value === item.answer);
  };

  const next = () => {
    setAnswer(null);
    if (index + 1 >= list.length) onDone();
    else setIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn("mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold", theme.solid)}>
        <Zap className="h-4 w-4" /> Snelle ronde · {index + 1}/{list.length}
      </div>
      <h2 className="mb-6 text-center text-xl text-muted-foreground sm:text-2xl">Waar of niet waar?</h2>

      <div
        key={`statement-${index}`}
        className={cn(
          "tile mb-8 flex min-h-[160px] w-full max-w-md items-center justify-center p-6 text-center animate-pop-in",
          answer !== null && (correct ? "border-success bg-success-soft" : "border-destructive bg-destructive-soft animate-shake"),
        )}
      >
        <p className="font-display text-2xl leading-tight sm:text-[28px]">{item.statement}</p>
      </div>

      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => choose(true)}
          disabled={answer !== null}
          className={cn(
            "press tile flex min-h-[64px] items-center justify-center gap-2 font-display text-lg font-bold hover:bg-muted disabled:opacity-100",
            answer === true && (correct ? "border-success bg-success-soft" : "border-destructive bg-destructive-soft"),
          )}
        >
          <Check className="h-5 w-5" strokeWidth={3} /> Waar
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          disabled={answer !== null}
          className={cn(
            "press tile flex min-h-[64px] items-center justify-center gap-2 font-display text-lg font-bold hover:bg-muted disabled:opacity-100",
            answer === false && (correct ? "border-success bg-success-soft" : "border-destructive bg-destructive-soft"),
          )}
        >
          <X className="h-5 w-5" strokeWidth={3} /> Niet waar
        </button>
      </div>

      {answer !== null && (
        <FeedbackSheet
          key={`feedback-${index}`}
          correct={correct}
          body={item.why}
          onContinue={next}
          autoAdvanceMs={correct ? 1800 : undefined}
        />
      )}
      <div className="h-40" aria-hidden />
    </div>
  );
};

export default QuickFire;
