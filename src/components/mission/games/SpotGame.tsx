import { useMemo, useState } from "react";
import { Flag, Check } from "lucide-react";
import type { Game } from "@/content/missions";
import { Button } from "@/components/ui/button";
import { FeedbackSheet } from "../FeedbackSheet";
import type { GameProps } from "./SwipeGame";
import { cn } from "@/lib/utils";

type Spot = Extract<Game, { kind: "spot" }>;
type Segment = { text: string; flag?: number };

const toSegments = (message: string, fragments: string[]): Segment[] => {
  const out: Segment[] = [];
  let rest = message;
  while (rest.length) {
    let at = -1;
    let which = -1;
    fragments.forEach((f, i) => {
      const idx = rest.indexOf(f);
      if (idx !== -1 && (at === -1 || idx < at)) {
        at = idx;
        which = i;
      }
    });
    if (which === -1) {
      out.push({ text: rest });
      break;
    }
    if (at > 0) out.push({ text: rest.slice(0, at) });
    out.push({ text: fragments[which], flag: which });
    rest = rest.slice(at + fragments[which].length);
  }
  return out;
};

/** A chat message: tap the parts that are red flags, then check. */
export const SpotGame = ({ game, onAnswer, onDone }: GameProps<Spot>) => {
  const segments = useMemo(() => toSegments(game.message, game.flags.map((f) => f.fragment)), [game]);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);

  const toggle = (i: number) => {
    if (checked) return;
    setHint(false);
    setTapped((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  const reds = game.flags.map((f, i) => (f.isRed ? i : -1)).filter((i) => i >= 0);
  const found = reds.filter((i) => tapped.has(i));
  const missed = reds.filter((i) => !tapped.has(i));
  const wrongTaps = [...tapped].filter((i) => !game.flags[i].isRed);
  const allRight = missed.length === 0 && wrongTaps.length === 0;

  const check = () => {
    if (tapped.size === 0) {
      setHint(true);
      return;
    }
    setChecked(true);
    found.forEach(() => onAnswer(true));
    [...missed, ...wrongTaps].forEach(() => onAnswer(false));
  };

  const explain = checked
    ? game.flags.map((f, i) => ({ ...f, i })).filter((f) => f.isRed || tapped.has(f.i))
    : [];

  return (
    <div className="flex flex-col">
      <h2 className="mb-5 text-2xl sm:text-3xl">{game.prompt}</h2>

      <div className="tile mb-4 overflow-hidden">
        <div className="flex items-center gap-3 border-b-2 border-border bg-muted/60 px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground font-display text-sm text-background">
            {game.sender.charAt(0).toUpperCase()}
          </span>
          <div className="leading-tight">
            <div className="font-semibold">{game.sender}</div>
            <div className="text-xs text-muted-foreground">nu</div>
          </div>
        </div>
        <div className="p-4">
          <p className="rounded-2xl rounded-tl-md bg-muted px-4 py-3 text-[17px] leading-[1.9]">
            {segments.map((seg, k) => {
              if (seg.flag === undefined) return <span key={k}>{seg.text}</span>;
              const i = seg.flag;
              const isTapped = tapped.has(i);
              const isRed = game.flags[i].isRed;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    "mx-0.5 inline rounded-md px-1 py-0.5 text-left underline decoration-dotted decoration-2 underline-offset-4 transition-colors",
                    !checked && !isTapped && "bg-card hover:bg-primary-soft",
                    !checked && isTapped && "bg-destructive text-destructive-foreground no-underline",
                    checked && isRed && isTapped && "bg-success text-success-foreground no-underline",
                    checked && isRed && !isTapped && "bg-secondary text-secondary-foreground no-underline",
                    checked && !isRed && isTapped && "bg-card line-through opacity-70",
                    checked && !isRed && !isTapped && "no-underline",
                  )}
                >
                  {checked && isRed && isTapped && <Check className="mr-1 inline h-4 w-4" strokeWidth={3} />}
                  {!checked && isTapped && <Flag className="mr-1 inline h-4 w-4" />}
                  {seg.text}
                </button>
              );
            })}
          </p>
        </div>
      </div>

      {!checked ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {tapped.size === 0 ? "Tik op de stukjes die niet kloppen." : `${tapped.size} aangetikt`}
          </p>
          {hint && <p className="text-sm font-medium text-destructive">Tik eerst iets aan.</p>}
          <Button size="lg" onClick={check} className="w-full sm:w-auto sm:min-w-[200px]">
            Check
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {explain.map((f) => (
            <li key={f.i} className="tile px-4 py-3 text-[15px] leading-snug">
              <span className="font-semibold">"{f.fragment}"</span>
              <span className="text-muted-foreground"> — {f.why}</span>
            </li>
          ))}
        </ul>
      )}

      {checked && (
        <FeedbackSheet
          correct={allRight}
          title={allRight ? "Alles gevonden!" : `Je vond ${found.length} van de ${reds.length}`}
          body={allRight ? "Echte speurneus. Lees hierboven waarom." : "Lees hierboven wat je miste."}
          onContinue={onDone}
        />
      )}
      <div className="h-44" aria-hidden />
    </div>
  );
};

export default SpotGame;
