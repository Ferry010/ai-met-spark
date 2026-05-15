import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

interface BossGateProps {
  unlocked: boolean;
  totalDone: number;
  totalLessons: number;
}

/**
 * Eindtoets gate — replaces the old white card with a golden boss-door.
 */
export const BossGate = ({ unlocked, totalDone, totalLessons }: BossGateProps) => {
  return (
    <div className="relative mx-auto max-w-md text-center">
      {/* Twin torches */}
      <div className="pointer-events-none absolute -top-2 left-2 text-3xl animate-float" aria-hidden>🔥</div>
      <div className="pointer-events-none absolute -top-2 right-2 text-3xl animate-float" style={{ animationDelay: "1s" }} aria-hidden>🔥</div>

      <div
        className={`relative mx-auto rounded-t-[160px] border-4 border-[hsl(36_60%_28%)] bg-gradient-to-b from-[hsl(48_100%_72%)] via-[hsl(45_100%_55%)] to-[hsl(36_100%_38%)] px-6 pt-10 pb-6 shadow-pop ${
          unlocked ? "animate-gate-glow" : ""
        }`}
        style={{ maxWidth: 320 }}
      >
        {/* door panels */}
        <div className="absolute inset-x-6 top-10 bottom-6 grid grid-cols-2 gap-2 opacity-30 pointer-events-none">
          <div className="rounded-md border-2 border-[hsl(36_60%_28%)]" />
          <div className="rounded-md border-2 border-[hsl(36_60%_28%)]" />
        </div>

        <div className="relative">
          <div className="text-5xl mb-2" aria-hidden>{unlocked ? "🏆" : "🔒"}</div>
          <h2 className="font-display text-2xl text-[hsl(30_60%_18%)] drop-shadow">Eindbaas-test</h2>
          <p className="text-[hsl(30_60%_22%)] font-body text-sm mt-1">
            {unlocked
              ? "De poort is open! Haal 8/10 voor je diploma."
              : `Verzamel alle ${totalLessons} sleutels (${totalDone}/${totalLessons})`}
          </p>

          <Link to={unlocked ? "/final-test" : "#"} aria-disabled={!unlocked}>
            <button
              disabled={!unlocked}
              className={`mt-5 inline-flex h-14 items-center justify-center rounded-full px-8 font-display text-base btn-squish ${
                unlocked
                  ? "bg-[hsl(0_100%_71%)] text-white"
                  : "bg-foreground/20 text-foreground/50 cursor-not-allowed"
              }`}
            >
              {unlocked ? "Open de poort →" : (
                <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4" /> Op slot</span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* keys row underneath */}
      <div className="mt-3 flex justify-center gap-1 flex-wrap" aria-hidden>
        {Array.from({ length: totalLessons }).map((_, i) => (
          <span key={i} className={`text-base ${i < totalDone ? "" : "opacity-30 grayscale"}`}>🔑</span>
        ))}
      </div>
    </div>
  );
};

export default BossGate;
