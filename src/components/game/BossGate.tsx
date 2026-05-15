import { Link } from "react-router-dom";
import { GameGlyph } from "@/components/game/GameGlyph";
import { playClick } from "@/lib/sounds";

interface BossGateProps {
  unlocked: boolean;
  totalDone: number;
  totalLessons: number;
}

/**
 * Eindtoets gate — golden boss-door drawn entirely as SVG, no emojis.
 */
export const BossGate = ({ unlocked, totalDone, totalLessons }: BossGateProps) => {
  return (
    <div className="relative mx-auto max-w-md text-center">
      <div
        className={`relative mx-auto rounded-t-[160px] border-4 border-[hsl(36_60%_28%)] bg-gradient-to-b from-[hsl(48_100%_72%)] via-[hsl(45_100%_55%)] to-[hsl(36_100%_38%)] px-6 pt-10 pb-6 shadow-pop ${
          unlocked ? "animate-gate-glow" : ""
        }`}
        style={{ maxWidth: 320 }}
      >
        {/* Pillars + arch lines */}
        <div className="pointer-events-none absolute inset-x-4 top-8 bottom-4 grid grid-cols-2 gap-3 opacity-30">
          <div className="rounded-md border-2 border-[hsl(36_60%_28%)]" />
          <div className="rounded-md border-2 border-[hsl(36_60%_28%)]" />
        </div>

        <div className="relative">
          {/* Centerpiece SVG: gate keyhole / star */}
          <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-[hsl(30_60%_18%)] text-[hsl(48_100%_72%)] shadow-inner">
            <GameGlyph name={unlocked ? "star" : "lock"} size={32} />
          </div>

          <h2 className="font-display text-2xl text-[hsl(30_60%_18%)] drop-shadow">Eindbaas-test</h2>
          <p className="text-[hsl(30_60%_22%)] font-body text-sm mt-1">
            {unlocked
              ? "De poort is open! Haal 8/10 voor je diploma."
              : `Verzamel alle ${totalLessons} sleutels (${totalDone}/${totalLessons})`}
          </p>

          <Link to={unlocked ? "/final-test" : "#"} aria-disabled={!unlocked} onClick={() => unlocked && playClick()}>
            <button
              disabled={!unlocked}
              className={`mt-5 inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 font-display text-base btn-squish ${
                unlocked
                  ? "bg-[hsl(0_100%_71%)] text-white"
                  : "bg-foreground/20 text-foreground/50 cursor-not-allowed"
              }`}
            >
              {unlocked ? "Open de poort →" : (
                <>
                  <GameGlyph name="lock" size={16} />
                  Op slot
                </>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Keys row underneath */}
      <div className="mt-3 flex justify-center gap-1.5 flex-wrap">
        {Array.from({ length: totalLessons }).map((_, i) => (
          <span
            key={i}
            className={i < totalDone ? "text-[hsl(45_100%_45%)]" : "text-foreground/20"}
          >
            <GameGlyph name="key" size={16} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default BossGate;
