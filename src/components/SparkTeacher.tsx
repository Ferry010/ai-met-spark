import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spark, type SparkMood } from "@/components/Spark";
import { cn } from "@/lib/utils";

interface SparkTeacherProps {
  /** Mood Spark should be in right now. */
  mood?: SparkMood;
  /** Optional speech that pops next to Spark. Pass empty/undefined to hide bubble. */
  message?: string;
  /** Hide the dock (e.g. on intro / done screens that already feature Spark big). */
  hidden?: boolean;
  /** Position. Default bottom-left. */
  position?: "bottom-left" | "bottom-right";
}

/**
 * Persistent Spark dock that follows the student through a lesson and
 * reacts to step changes, correct/wrong answers and rewards.
 */
export const SparkTeacher = ({
  mood = "happy",
  message,
  hidden,
  position = "bottom-left",
}: SparkTeacherProps) => {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (!message) {
      setShowBubble(false);
      return;
    }
    setShowBubble(true);
    const t = window.setTimeout(() => setShowBubble(false), 4200);
    return () => window.clearTimeout(t);
  }, [message]);

  if (hidden) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-3 z-40 flex items-end gap-2",
        position === "bottom-left" ? "left-3 sm:left-5" : "right-3 sm:right-5 flex-row-reverse",
      )}
      aria-hidden="true"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.7 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="drop-shadow-lg"
      >
        <Spark size={84} mood={mood} />
      </motion.div>

      <AnimatePresence>
        {showBubble && message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={cn(
              "max-w-[200px] sm:max-w-xs rounded-2xl border-2 border-primary/40 bg-card px-3 py-2 shadow-pop text-sm font-body leading-snug",
              position === "bottom-left" ? "mb-6" : "mb-6",
            )}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SparkTeacher;
