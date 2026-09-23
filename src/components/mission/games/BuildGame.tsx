import { useMemo, useState } from "react";
import type { Game } from "@/content/missions";
import { shuffle } from "@/lib/shuffle";
import { Button } from "@/components/ui/button";
import { FeedbackSheet } from "../FeedbackSheet";
import type { GameProps } from "./SwipeGame";
import { cn } from "@/lib/utils";

type Build = Extract<Game, { kind: "build" }>;

/** Build a question for AI from blocks, one per slot. */
export const BuildGame = ({ game, onAnswer, onDone }: GameProps<Build>) => {
  const slots = useMemo(() => game.slots.map((s) => ({ ...s, options: shuffle(s.options) })), [game]);
  const [picked, setPicked] = useState<(number | null)[]>(() => slots.map(() => null));
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);

  const choose = (slot: number, opt: number) => {
    if (checked) return;
    setHint(false);
    setPicked((p) => p.map((v, i) => (i === slot ? opt : v)));
  };

  const strongCount = picked.filter((p, i) => p !== null && slots[i].options[p].strong).length;
  const allStrong = strongCount === slots.length;

  const check = () => {
    if (picked.some((p) => p === null)) {
      setHint(true);
      return;
    }
    setChecked(true);
    picked.forEach((p, i) => onAnswer(!!slots[i].options[p!].strong));
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-5 text-2xl sm:text-3xl">{game.prompt}</h2>

      {/* Live preview of the question being built */}
      <div className="mb-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft px-4 py-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Jouw vraag aan AI</div>
        <p className="text-[17px] leading-relaxed">
          {slots.map((s, i) => {
            const p = picked[i];
            const opt = p !== null ? s.options[p] : null;
            return (
              <span key={s.label}>
                {i > 0 && " "}
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5",
                    !opt && "text-muted-foreground",
                    opt && !checked && "bg-card font-medium",
                    opt && checked && (opt.strong ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"),
                  )}
                >
                  {opt ? opt.text : "…"}
                </span>
              </span>
            );
          })}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {slots.map((s, si) => (
          <div key={s.label}>
            <div className="mb-2 font-display text-base">{s.label}</div>
            <div className="flex flex-wrap gap-2">
              {s.options.map((o, oi) => {
                const isPicked = picked[si] === oi;
                return (
                  <button
                    key={o.text}
                    type="button"
                    onClick={() => choose(si, oi)}
                    disabled={checked}
                    className={cn(
                      "press tile px-4 py-2.5 text-[15px] leading-snug hover:bg-muted disabled:opacity-100",
                      !checked && isPicked && "border-primary bg-primary-soft text-primary-dark press-primary",
                      checked && o.strong && "border-success bg-success-soft",
                      checked && isPicked && !o.strong && "border-destructive bg-destructive-soft",
                      checked && !isPicked && !o.strong && "opacity-50",
                    )}
                  >
                    {o.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!checked && (
        <div className="mt-6 flex flex-col items-center gap-2">
          {hint && <p className="text-sm font-medium text-destructive">Kies bij elk stukje een blokje.</p>}
          <Button size="lg" onClick={check} className="w-full sm:w-auto sm:min-w-[200px]">
            Check mijn vraag
          </Button>
        </div>
      )}

      {checked && (
        <FeedbackSheet
          correct={allStrong}
          title={allStrong ? "Sterke vraag!" : `${strongCount} van ${slots.length} sterk`}
          body={game.explanation}
          onContinue={onDone}
        />
      )}
      <div className="h-44" aria-hidden />
    </div>
  );
};

export default BuildGame;
