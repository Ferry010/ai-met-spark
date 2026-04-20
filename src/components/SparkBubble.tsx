import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Spark, type SparkMood } from "@/components/Spark";

interface SparkBubbleProps {
  /** Text Spark says. Re-renders typewriter when this changes. */
  text: string;
  mood?: SparkMood;
  size?: number;
  className?: string;
  /** ms per character. Default 18. */
  speed?: number;
  /** Direction of the bubble relative to Spark. Default 'right'. */
  side?: "right" | "bottom";
}

/**
 * Spark + speech bubble with a typewriter effect. Tap the bubble to skip the
 * animation. Used as the animated-teacher voice across lessons.
 */
export const SparkBubble = ({
  text,
  mood = "happy",
  size = 96,
  className,
  speed = 18,
  side = "right",
}: SparkBubbleProps) => {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown("");
    setDone(false);
    if (!text) return;
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

  const skip = () => {
    setShown(text);
    setDone(true);
  };

  return (
    <div
      className={cn(
        "flex gap-3 items-start",
        side === "bottom" && "flex-col items-center",
        className,
      )}
    >
      <div className="shrink-0">
        <Spark mood={mood} size={size} />
      </div>
      <button
        type="button"
        onClick={skip}
        className={cn(
          "relative text-left rounded-2xl border-2 border-primary/40 bg-card px-4 py-3 shadow-soft max-w-md",
          "transition-bounce hover:shadow-pop",
        )}
        aria-label="Tik om door te lezen"
      >
        {/* Tail */}
        {side === "right" ? (
          <span className="absolute -left-2 top-5 h-4 w-4 rotate-45 bg-card border-l-2 border-b-2 border-primary/40" />
        ) : (
          <span className="absolute left-1/2 -top-2 h-4 w-4 -translate-x-1/2 rotate-45 bg-card border-l-2 border-t-2 border-primary/40" />
        )}
        <p className="font-body text-base leading-snug">
          {shown}
          {!done && <span className="ml-0.5 inline-block w-1.5 h-4 align-middle bg-primary animate-pulse" />}
        </p>
        {!done && (
          <span className="block mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">tik om door te lezen</span>
        )}
      </button>
    </div>
  );
};

export default SparkBubble;
