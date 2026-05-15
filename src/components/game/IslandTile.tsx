import { motion } from "framer-motion";
import { GameGlyph } from "@/components/game/GameGlyph";
import { playClick } from "@/lib/sounds";

interface IslandTileProps {
  name: string;
  worldNumber: number;
  done: number;
  total: number;
  locked?: boolean;
  pillar: "safe" | "smart" | "stronger";
  onClick: () => void;
  index: number;
}

/**
 * Floating "island" world button. SVG-shaped, organic, kid-friendly.
 * No emojis or icon-kit glyphs — number badge + ribbon do the storytelling.
 */
export const IslandTile = ({
  name,
  worldNumber,
  done,
  total,
  locked,
  pillar,
  onClick,
  index,
}: IslandTileProps) => {
  const pct = Math.round((done / total) * 100);
  const allDone = done === total;

  const handleClick = () => {
    if (locked) return;
    playClick();
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={locked}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 120, damping: 14 }}
      whileHover={{ scale: locked ? 1 : 1.05, y: locked ? 0 : -8 }}
      whileTap={{ scale: locked ? 1 : 0.96 }}
      className={`group relative flex flex-col items-center justify-end ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
      aria-label={`Wereld ${worldNumber}: ${name}`}
      style={{ width: 220, height: 240 }}
    >
      {/* World number badge — floating */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full border-4 border-white text-white font-display text-lg shadow-pop bg-gradient-to-br ${
          pillar === "safe" ? "from-[hsl(187_80%_55%)] to-[hsl(200_85%_45%)]"
            : pillar === "smart" ? "from-[hsl(48_100%_70%)] to-[hsl(38_100%_55%)]"
            : "from-[hsl(8_100%_75%)] to-[hsl(0_85%_60%)]"
        }`}>
          {worldNumber}
        </div>
      </div>

      {/* Island shape */}
      <div className={`relative ${locked ? "opacity-70 grayscale" : "animate-island-bob"}`}>
        <svg width="220" height="200" viewBox="0 0 220 200" className="drop-shadow-pop">
          <defs>
            <linearGradient id={`grass-${worldNumber}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor={pillar === "safe" ? "hsl(187 80% 60%)" : pillar === "smart" ? "hsl(48 100% 72%)" : "hsl(8 100% 78%)"} />
              <stop offset="100%" stopColor={pillar === "safe" ? "hsl(200 85% 45%)" : pillar === "smart" ? "hsl(38 100% 55%)" : "hsl(0 85% 60%)"} />
            </linearGradient>
            <linearGradient id={`dirt-${worldNumber}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor={pillar === "safe" ? "hsl(28 50% 50%)" : pillar === "smart" ? "hsl(36 55% 50%)" : "hsl(18 55% 48%)"} />
              <stop offset="100%" stopColor={pillar === "safe" ? "hsl(28 55% 28%)" : pillar === "smart" ? "hsl(36 60% 26%)" : "hsl(18 60% 24%)"} />
            </linearGradient>
          </defs>

          {/* Dirt underbelly (organic blob) */}
          <path
            d="M30,90 Q10,130 40,170 Q80,210 130,200 Q190,190 200,150 Q220,110 180,85 Q140,70 110,80 Q70,72 30,90 Z"
            fill={`url(#dirt-${worldNumber})`}
          />
          {/* Grass top */}
          <ellipse cx="110" cy="80" rx="92" ry="38" fill={`url(#grass-${worldNumber})`} />
          {/* Highlight */}
          <ellipse cx="90" cy="68" rx="50" ry="14" fill="white" opacity="0.35" />

          {/* Decorative tufts */}
          <circle cx="40" cy="78" r="6" fill={pillar === "safe" ? "hsl(187 90% 38%)" : pillar === "smart" ? "hsl(38 90% 40%)" : "hsl(0 80% 45%)"} opacity="0.6" />
          <circle cx="180" cy="84" r="5" fill={pillar === "safe" ? "hsl(187 90% 38%)" : pillar === "smart" ? "hsl(38 90% 40%)" : "hsl(0 80% 45%)"} opacity="0.6" />

          {/* Big stylized world numeral pressed into the grass */}
          <text
            x="110"
            y="98"
            textAnchor="middle"
            fontFamily="inherit"
            fontWeight="900"
            fontSize="64"
            fill="white"
            opacity="0.85"
            style={{ paintOrder: "stroke" } as React.CSSProperties}
            stroke="hsl(0 0% 0% / 0.25)"
            strokeWidth="3"
          >
            {worldNumber}
          </text>
        </svg>

        {/* Lock overlay */}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-foreground/80 p-3 shadow-pop text-white">
              <GameGlyph name="lock" size={28} />
            </div>
          </div>
        )}

        {/* All-done crown ribbon */}
        {allDone && !locked && (
          <div className="absolute -top-3 right-4 rotate-12">
            <div className="rounded-md border-2 border-[hsl(36_60%_28%)] bg-gradient-to-b from-[hsl(48_100%_72%)] to-[hsl(36_100%_45%)] px-2 py-0.5 text-[10px] font-display uppercase tracking-wider text-[hsl(30_60%_18%)] shadow-pop">
              Klaar
            </div>
          </div>
        )}
      </div>

      {/* Wooden name plank */}
      <div className="relative -mt-2 z-10">
        <div className="relative px-5 py-2 rounded-xl bg-gradient-to-b from-[hsl(36_60%_55%)] to-[hsl(28_55%_38%)] border-2 border-[hsl(28_60%_30%)] shadow-pop">
          <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-[hsl(28_60%_25%)]" />
          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[hsl(28_60%_25%)]" />
          <div className="font-display text-white text-sm leading-none drop-shadow">{name}</div>
          <div className="font-body text-white/90 text-[11px] leading-tight mt-0.5">
            {locked ? "Nog op slot" : `${done}/${total} · ${pct}%`}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default IslandTile;
