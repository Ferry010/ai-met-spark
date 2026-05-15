import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Star } from "lucide-react";
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
 * Compact gamification HUD for the lesson page. Always visible just under
 * the progress bar so kids can see XP filling up and combos building.
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
    <div className="mb-4 rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-2.5 sm:p-3 shadow-soft">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-1.5 font-display text-xs sm:text-sm">
          <span className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground h-6 min-w-6 px-1.5 text-[11px] font-bold">
            Lv {level}
          </span>
          <span className="relative tabular-nums text-muted-foreground">
            {xp} XP
            <AnimatePresence>
              {bursts.map((b) => (
                <motion.span
                  key={b.id}
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -28, scale: 1.1 }}
                  exit={{ opacity: 0, y: -48 }}
                  transition={{ duration: 1 }}
                  className="absolute left-0 -top-2 text-success font-bold pointer-events-none"
                >
                  +{b.amount}
                </motion.span>
              ))}
            </AnimatePresence>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-display">
          <AnimatePresence>
            {combo >= 2 && (
              <motion.span
                key={combo}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 font-bold",
                  comboMultiplier > 1 && "animate-combo-pulse",
                )}
              >
                <Sparkles className="h-3 w-3" /> Combo x{comboMultiplier} ({combo})
              </motion.span>
            )}
          </AnimatePresence>
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 text-accent">
              <Flame className="h-3.5 w-3.5" /> {streak}
            </span>
          )}
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary-glow"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
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
          className="rounded-3xl bg-gradient-cosmic text-primary-foreground px-8 py-10 text-center shadow-glow max-w-sm mx-4"
        >
          <div className="mx-auto mb-3 inline-flex items-center gap-1 rounded-full bg-secondary/95 text-secondary-foreground px-3 py-1 font-display text-xs uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 fill-current" /> Level up
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
