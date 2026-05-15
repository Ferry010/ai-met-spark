import { Check, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Spark } from "@/components/Spark";
import { cn } from "@/lib/utils";

interface LevelNodeProps {
  index: number;
  number: number;
  emoji: string;
  title: string;
  state: "done" | "next" | "locked" | "future";
  pillar: "safe" | "smart" | "stronger";
  side: "left" | "right";
  stars?: number; // 0-3
  onClick: () => void;
}

const PILLAR_RING: Record<string, string> = {
  safe:     "from-[hsl(187_80%_55%)] to-[hsl(200_85%_42%)]",
  smart:    "from-[hsl(48_100%_70%)] to-[hsl(38_100%_50%)]",
  stronger: "from-[hsl(8_100%_72%)] to-[hsl(0_85%_55%)]",
};

/**
 * One round level button on the winding adventure path.
 */
export const LevelNode = ({
  index,
  number,
  emoji,
  title,
  state,
  pillar,
  side,
  stars = 0,
  onClick,
}: LevelNodeProps) => {
  const isDone = state === "done";
  const isNext = state === "next";
  const isLocked = state === "locked" || state === "future";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200, damping: 16 }}
      className={cn(
        "relative flex items-center gap-4",
        side === "right" && "flex-row-reverse",
      )}
    >
      {/* Round level coin */}
      <div className="relative">
        {isNext && (
          <div className="absolute -inset-2 rounded-full animate-node-pulse pointer-events-none" />
        )}
        <button
          onClick={onClick}
          disabled={isLocked}
          aria-label={`Les ${number}: ${title}`}
          className={cn(
            "relative h-24 w-24 rounded-full grid place-items-center btn-squish text-4xl font-display",
            "border-4 border-white",
            isDone && "bg-success text-success-foreground",
            isNext && `bg-gradient-to-br ${PILLAR_RING[pillar]} text-white`,
            isLocked && "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {isDone ? (
            <Check className="h-9 w-9" strokeWidth={3.5} />
          ) : isLocked ? (
            <Lock className="h-7 w-7" />
          ) : (
            <span aria-hidden>{emoji}</span>
          )}

          {/* Level number badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-foreground text-background font-display text-[11px] px-2 py-0.5 shadow-soft border-2 border-white">
            {number}
          </div>

          {/* Spark sits on the next level */}
          {isNext && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
              <Spark size={56} mood="pointing" />
            </div>
          )}

          {/* Stars under done */}
          {isDone && stars > 0 && (
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < stars ? "fill-secondary text-secondary" : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Title plank */}
      <div
        className={cn(
          "max-w-[200px] sm:max-w-xs",
          side === "right" ? "text-right" : "text-left",
        )}
      >
        <div className="text-[11px] font-display uppercase tracking-wider text-foreground/60">
          Level {number} {isNext && <span className="text-primary">· nu spelen</span>}
        </div>
        <div className="font-display text-base sm:text-lg leading-tight text-foreground">{title}</div>
      </div>
    </motion.div>
  );
};

export default LevelNode;
