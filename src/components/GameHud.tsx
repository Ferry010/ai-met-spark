import { motion, AnimatePresence } from "framer-motion";
import { GameGlyph } from "@/components/game/GameGlyph";
import { cn } from "@/lib/utils";

interface GameHudProps {
  xp: number;
  level: number;
  pct: number;
  streak: number;
  combo: number;
  comboMultiplier: number;
  /** Floating "+25" indicators to render above the XP bar. */
  bursts: { id: number; amount: number }[];
}

/**
 * Arcade-style HUD for the lesson page. Coin level, gem XP bar, FEVER combo.
 */
export const GameHud = ({
  xp,
  level,
  pct,
  streak,
  combo,
  comboMultiplier,
  bursts,
}: GameHudProps) => {
  return (
    <div className="mb-4 rounded-2xl border-4 border-foreground/85 bg-gradient-to-b from-[hsl(248_84%_70%)] to-[hsl(248_78%_55%)] text-primary-foreground p-2.5 sm:p-3 shadow-pop">
      <div className="flex items-center gap-3">
        {/* Level coin */}
        <div className="relative shrink-0">
          <div className="h-11 w-11 rounded-full border-[3px] border-[hsl(36_60%_28%)] bg-gradient-to-br from-[hsl(48_100%_72%)] via-[hsl(45_100%_58%)] to-[hsl(36_100%_45%)] grid place-items-center font-display text-base text-[hsl(30_60%_18%)] shadow-soft animate-coin-shine">
            {level}
          </div>
        </div>

        {/* XP gem bar */}
        <div className="flex-1 min-w-0 relative">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-display text-[10px] uppercase tracking-wider opacity-90">XP</span>
            <span className="relative font-display text-xs tabular-nums">
              {xp}
              <AnimatePresence>
                {bursts.map((b) => (
                  <motion.span
                    key={b.id}
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -28, scale: 1.3 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 1 }}
                    className="absolute right-0 -top-2 inline-flex items-center gap-1 text-[hsl(48_100%_75%)] font-display font-bold drop-shadow pointer-events-none"
                  >
                    +{b.amount}
                    <GameGlyph name="gem" size={12} />
                  </motion.span>
                ))}
              </AnimatePresence>
            </span>
          </div>
          <div className="relative h-3 rounded-full bg-foreground/30 border-2 border-foreground/40 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[hsl(48_100%_72%)] via-[hsl(45_100%_60%)] to-[hsl(8_100%_70%)]"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Combo + streak */}
        <div className="flex flex-col gap-1 items-end shrink-0">
          <AnimatePresence>
            {combo >= 2 && (
              <motion.span
                key={combo}
                initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 12 }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border-2 border-[hsl(36_60%_28%)] bg-[hsl(45_100%_62%)] text-[hsl(30_60%_18%)] px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wider",
                  comboMultiplier > 1 && "animate-combo-pulse",
                )}
                style={{ textShadow: "0 1px 0 hsl(48 100% 92%)" }}
              >
                <GameGlyph name="sparkle" size={12} /> Reeks ×{comboMultiplier}
              </motion.span>
            )}
          </AnimatePresence>
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground/40 bg-[hsl(0_100%_71%)] text-white px-2 py-0.5 font-display text-[11px]">
              <GameGlyph name="flame" size={12} /> {streak}d
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface LevelUpOverlayProps {
  level: number | null;
  onClose: () => void;
}

export const LevelUpOverlay = ({ level, onClose }: LevelUpOverlayProps) => (
  <AnimatePresence>
    {level !== null && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="rounded-3xl border-4 border-foreground/85 bg-gradient-cosmic text-primary-foreground px-8 py-10 text-center shadow-glow max-w-sm mx-4"
        >
          <div className="mx-auto mb-3 inline-flex items-center gap-1 rounded-full bg-secondary/95 text-secondary-foreground px-3 py-1 font-display text-xs uppercase tracking-wider">
            <GameGlyph name="star" size={14} /> Niveau omhoog
          </div>
          <h2 className="font-display text-4xl mb-1">Niveau {level}!</h2>
          <p className="text-primary-foreground/90 font-body">
            Mooi werk — Spark is trots op je. Tik om door te gaan.
          </p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
