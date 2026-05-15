import { ReactNode } from "react";

interface AdventureBackdropProps {
  children: ReactNode;
  /** Theme tints the gradient. Defaults to "sky". */
  theme?: "sky" | "ocean" | "sun" | "lava";
  className?: string;
}

const THEME_BG: Record<NonNullable<AdventureBackdropProps["theme"]>, string> = {
  sky:   "from-[hsl(250_95%_92%)] via-[hsl(40_100%_96%)] to-[hsl(18_100%_92%)]",
  ocean: "from-[hsl(200_90%_88%)] via-[hsl(187_70%_82%)] to-[hsl(220_60%_92%)]",
  sun:   "from-[hsl(48_100%_88%)] via-[hsl(40_100%_94%)] to-[hsl(30_100%_88%)]",
  lava:  "from-[hsl(18_100%_88%)] via-[hsl(8_95%_84%)] to-[hsl(0_90%_82%)]",
};

/**
 * Whimsical "spelwereld" backdrop — soft sky gradient with drifting
 * SVG clouds and twinkling stars. Children render on top.
 */
export const AdventureBackdrop = ({ children, theme = "sky", className = "" }: AdventureBackdropProps) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${THEME_BG[theme]} ${className}`}>
      {/* Stars */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDelay: `${s.d}s`,
              fontSize: `${s.size}px`,
              filter: "drop-shadow(0 0 6px hsl(var(--secondary) / 0.6))",
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Clouds */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className={c.slow ? "absolute animate-cloud-drift-slow" : "absolute animate-cloud-drift"}
            style={{ top: `${c.y}%`, left: 0, right: 0, animationDelay: `${c.delay}s` }}
          >
            <Cloud size={c.size} opacity={c.opacity} />
          </div>
        ))}
      </div>

      <div className="relative">{children}</div>
    </div>
  );
};

const STARS = [
  { x: 8,  y: 12, d: 0,   size: 14 },
  { x: 22, y: 38, d: 1.2, size: 10 },
  { x: 84, y: 18, d: 0.6, size: 16 },
  { x: 92, y: 55, d: 1.8, size: 12 },
  { x: 14, y: 78, d: 0.9, size: 10 },
  { x: 70, y: 82, d: 2.1, size: 14 },
  { x: 50, y: 8,  d: 1.4, size: 12 },
  { x: 38, y: 62, d: 0.3, size: 10 },
];

const CLOUDS = [
  { y: 6,  size: 110, delay: 0,   opacity: 0.85, slow: false },
  { y: 28, size: 80,  delay: -25, opacity: 0.55, slow: true  },
  { y: 48, size: 140, delay: -10, opacity: 0.7,  slow: true  },
  { y: 70, size: 90,  delay: -45, opacity: 0.5,  slow: false },
];

const Cloud = ({ size, opacity }: { size: number; opacity: number }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 120 72" fill="white" style={{ opacity }}>
    <ellipse cx="32" cy="48" rx="28" ry="20" />
    <ellipse cx="60" cy="36" rx="34" ry="26" />
    <ellipse cx="90" cy="48" rx="26" ry="18" />
  </svg>
);

export default AdventureBackdrop;
