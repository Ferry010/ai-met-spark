import { useCallback, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedbackSheetProps {
  correct: boolean;
  title?: string;
  body?: string;
  onContinue: () => void;
  continueLabel?: string;
  /** Auto-continue after this many ms (used for quick correct answers). */
  autoAdvanceMs?: number;
}

/**
 * Duolingo-style result bar that slides up from the bottom after an answer.
 * Green when right, red when wrong, always with a one-line "why".
 */
export const FeedbackSheet = ({ correct, title, body, onContinue, continueLabel = "Verder", autoAdvanceMs }: FeedbackSheetProps) => {
  // Continue exactly once, whether via click, keyboard or the auto-advance timer.
  const fired = useRef(false);
  const go = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    onContinue();
  }, [onContinue]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // A focused button handles Enter/Space itself.
      if ((e.target as HTMLElement | null)?.tagName === "BUTTON") return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    if (!autoAdvanceMs) return;
    const t = window.setTimeout(go, autoAdvanceMs);
    return () => window.clearTimeout(t);
  }, [autoAdvanceMs, go]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t-2 animate-sheet-up",
        correct ? "bg-success-soft border-success/40" : "bg-destructive-soft border-destructive/40",
      )}
    >
      {autoAdvanceMs ? (
        <div className="h-1 w-full bg-success/20">
          <div
            className="h-full bg-success origin-left"
            style={{ animation: `bar-fill ${autoAdvanceMs}ms linear reverse both` }}
          />
        </div>
      ) : null}
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:py-5">
        <div className="flex flex-1 items-start gap-3">
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full",
              correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground",
            )}
          >
            {correct ? <Check className="h-6 w-6" strokeWidth={3} /> : <X className="h-6 w-6" strokeWidth={3} />}
          </span>
          <div className="min-w-0">
            <p className={cn("font-display text-xl", correct ? "text-success-dark" : "text-destructive-dark")}>
              {title ?? (correct ? "Goed zo!" : "Net niet")}
            </p>
            {body && (
              <p className={cn("mt-0.5 text-[15px] leading-snug", correct ? "text-success-dark/90" : "text-destructive-dark/90")}>
                {body}
              </p>
            )}
          </div>
        </div>
        <Button
          size="lg"
          variant={correct ? "success" : "destructive"}
          onClick={go}
          className="w-full sm:w-auto sm:min-w-[160px]"
          autoFocus
        >
          {continueLabel}
        </Button>
      </div>
    </div>
  );
};

export default FeedbackSheet;
