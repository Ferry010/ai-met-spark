import { motion } from "framer-motion";
import { Spark } from "@/components/Spark";
import { GameGlyph } from "@/components/game/GameGlyph";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/sounds";

interface LevelNodeProps {
  index: number;
  number: number;
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
 * State is communicated by color and SVG glyph — no emojis, no UI-kit icons.
 */
export const LevelNode = ({
  index,
  number,
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

  const handleClick = () => {
    if (isLocked) return;
    playClick();
    onClick();
  };

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
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`Les ${number}: ${title}`}
          className={cn(
            "relative h-24 w-24 rounded-full grid place-items-center btn-squish font-display",
            "border-4 border-white",
            isDone && "bg-success text-success-foreground",
            isNext && `bg-gradient-to-br ${PILLAR_RING[pillar]} text-white`,
            isLocked && "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {isDone ? (
            <GameGlyph name="check" size={40} />
          ) : isLocked ? (
            <GameGlyph name="lock" size={32} />
          ) : (
            <span className="text-3xl font-display drop-shadow-sm">{number}</span>
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
                <span
                  key={i}
                  className={cn(
                    "inline-block",
                    i < stars ? "text-secondary" : "text-muted-foreground/30",
                  )}
                >
                  <GameGlyph name="star" size={12} />
                </span>
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
