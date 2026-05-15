import { motion } from "framer-motion";
import { GameGlyph } from "@/components/game/GameGlyph";

interface ScoreboardProps {
  level: number;
  xp: number;
  pct: number;
  xpToNext: number;
  streak: number;
  longestCombo: number;
}

/**
 * Arcade-style scoreboard — coin-shaped level, XP gem bar, streak flame.
 */
export const Scoreboard = ({ level, xp, pct, xpToNext, streak, longestCombo }: ScoreboardProps) => {
  return (
    <div className="relative rounded-3xl border-4 border-foreground/90 bg-gradient-to-b from-[hsl(248_84%_70%)] to-[hsl(248_78%_55%)] text-primary-foreground p-4 sm:p-5 shadow-pop">
      {/* Decorative bolts */}
      <Bolt className="top-2 left-2" />
      <Bolt className="top-2 right-2" />
      <Bolt className="bottom-2 left-2" />
      <Bolt className="bottom-2 right-2" />

      <div className="flex items-center gap-4">
        {/* Level coin */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full animate-coin-shine" />
          <div className="h-16 w-16 rounded-full border-4 border-[hsl(36_60%_30%)] bg-gradient-to-br from-[hsl(48_100%_72%)] via-[hsl(45_100%_58%)] to-[hsl(36_100%_45%)] grid place-items-center font-display text-2xl text-[hsl(30_60%_18%)] shadow-pop">
            {level}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-foreground text-background text-[10px] font-display px-2 py-0.5">
            LV
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-display text-sm uppercase tracking-wider opacity-90">XP</span>
            <span className="font-display text-sm tabular-nums">{xp}</span>
          </div>
          {/* Gem bar */}
          <div className="relative h-4 rounded-full bg-foreground/30 border-2 border-foreground/40 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[hsl(48_100%_72%)] via-[hsl(45_100%_60%)] to-[hsl(8_100%_70%)]"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            />
            {/* shine */}
            <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          </div>
          <div className="mt-1 text-[11px] font-display opacity-80">
            Nog {xpToNext} XP tot LV {level + 1}
          </div>
        </div>

        {/* Streak / combo coins */}
        <div className="hidden sm:flex flex-col gap-2 shrink-0">
          <Pill icon={<GameGlyph name="flame" size={14} />} label={`${streak}d`} tint="accent" />
          <Pill icon={<GameGlyph name="gem" size={14} />} label={`x${longestCombo}`} tint="gold" />
        </div>
      </div>

      {/* Mobile streak row */}
      <div className="sm:hidden mt-3 flex gap-2">
        <Pill icon={<GameGlyph name="flame" size={14} />} label={`${streak} dagen`} tint="accent" />
        <Pill icon={<GameGlyph name="gem" size={14} />} label={`combo x${longestCombo}`} tint="gold" />
      </div>
    </div>
  );
};

const Bolt = ({ className = "" }: { className?: string }) => (
  <span className={`absolute h-2 w-2 rounded-full bg-foreground/60 shadow-inner ${className}`} aria-hidden />
);

const Pill = ({ icon, label, tint }: { icon: React.ReactNode; label: string; tint: "accent" | "gold" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border-2 border-foreground/40 px-2 py-0.5 font-display text-xs ${
      tint === "accent" ? "bg-[hsl(0_100%_71%)] text-white" : "bg-[hsl(45_100%_62%)] text-[hsl(30_60%_18%)]"
    }`}
  >
    {icon} {label}
  </span>
);

export default Scoreboard;
