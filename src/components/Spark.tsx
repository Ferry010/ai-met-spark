import { cn } from "@/lib/utils";

export type SparkMood =
  | "default"
  | "happy"
  | "thinking"
  | "celebrating"
  | "sad"
  | "explaining"
  | "hinting"
  | "questioning"
  | "pointing"
  | "cheering"
  | "oops"
  | "teaching"
  | "levelup";

interface SparkProps {
  mood?: SparkMood;
  size?: number;
  className?: string;
  animate?: boolean;
  /** When true, raises and waves Spark's right hand. */
  waving?: boolean;
}

const INK = "hsl(var(--spark-dark))";
const BODY = "hsl(var(--spark))";
const EYE = "hsl(var(--spark-eye))";
const PANEL = "hsl(var(--primary-dark))";
const BULB = "hsl(var(--secondary))";

/**
 * Spark — the AI met Spark mascot. A flat, friendly bot with a screen-visor
 * face. Pure inline SVG, themed via design tokens, no gradients.
 */
export const Spark = ({ mood = "default", size = 160, className, animate = true, waving = false }: SparkProps) => {
  const isHappy = mood === "happy" || mood === "celebrating" || mood === "cheering" || mood === "levelup";
  const isSad = mood === "sad" || mood === "oops";
  const isThinking = mood === "thinking" || mood === "explaining" || mood === "teaching";
  const isQuestioning = mood === "questioning" || mood === "hinting";
  const isPointing = mood === "pointing" || mood === "teaching";
  const isCheering = mood === "cheering" || mood === "levelup" || mood === "celebrating";

  const wrapperClass = cn(
    animate && (isCheering ? "animate-spark-cheer" : isHappy ? "animate-spark-wiggle" : "animate-float"),
    mood === "oops" && "animate-shake",
    className,
  );

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={wrapperClass}
      aria-label="Spark, je AI-gids"
      role="img"
    >
      {/* Antenna */}
      <rect x="96" y="18" width="8" height="24" rx="4" fill={INK} />
      <circle cx="100" cy="16" r="10" fill={BULB}>
        {animate && <animate attributeName="r" values="10;12;10" dur="1.6s" repeatCount="indefinite" />}
      </circle>

      {/* Ears */}
      <rect x="18" y="86" width="20" height="44" rx="10" fill={PANEL} />
      <rect x="162" y="86" width="20" height="44" rx="10" fill={PANEL} />

      {/* Head */}
      <rect x="30" y="40" width="140" height="130" rx="46" fill={BODY} />

      {/* Visor */}
      <rect x="46" y="66" width="108" height="72" rx="30" fill={INK} />

      {/* Eyes */}
      {isHappy ? (
        <>
          <path d="M 68 104 Q 80 88 92 104" stroke={EYE} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M 108 104 Q 120 88 132 104" stroke={EYE} strokeWidth="9" fill="none" strokeLinecap="round" />
        </>
      ) : isSad ? (
        <>
          <path d="M 68 96 Q 80 108 92 96" stroke={EYE} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M 108 96 Q 120 108 132 96" stroke={EYE} strokeWidth="9" fill="none" strokeLinecap="round" />
        </>
      ) : isThinking ? (
        <>
          <rect x="68" y="98" width="24" height="9" rx="4.5" fill={EYE} />
          <rect x="108" y="98" width="24" height="9" rx="4.5" fill={EYE} />
        </>
      ) : (
        <>
          <rect className={animate ? "spark-eye" : ""} x="72" y="84" width="16" height="30" rx="8" fill={EYE} />
          <rect
            className={animate ? "spark-eye" : ""}
            x="112"
            y={isQuestioning ? 80 : 84}
            width="16"
            height={isQuestioning ? 26 : 30}
            rx="8"
            fill={EYE}
          />
        </>
      )}

      {/* Mouth (on the chin, below the visor) */}
      {isHappy ? (
        <path d="M 84 150 Q 100 162 116 150" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M 86 157 Q 100 148 114 157" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
      ) : mood === "explaining" ? (
        <ellipse cx="100" cy="153" rx="8" ry="5" fill={INK} />
      ) : (
        <rect x="88" y="150" width="24" height="6" rx="3" fill={INK} />
      )}

      {/* Hand */}
      {waving ? (
        <g className={animate ? "animate-spark-wave" : ""}>
          <rect x="170" y="54" width="18" height="40" rx="9" fill={BODY} transform="rotate(20 179 74)" />
        </g>
      ) : isPointing ? (
        <rect x="172" y="60" width="16" height="36" rx="8" fill={BODY} transform="rotate(35 180 78)" />
      ) : null}

      {/* Idea bulb */}
      {mood === "hinting" && (
        <g>
          <circle cx="38" cy="40" r="12" fill={BULB}>
            {animate && <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite" />}
          </circle>
          <rect x="35" y="30" width="6" height="12" rx="3" fill="hsl(var(--secondary-foreground))" />
          <circle cx="38" cy="47" r="3" fill="hsl(var(--secondary-foreground))" />
        </g>
      )}

      {/* Sparkles when celebrating */}
      {isCheering && (
        <g fill={BULB}>
          <path d="M 26 40 l 4 10 l 10 4 l -10 4 l -4 10 l -4 -10 l -10 -4 l 10 -4 z" />
          <path d="M 176 150 l 3 7 l 7 3 l -7 3 l -3 7 l -3 -7 l -7 -3 l 7 -3 z" />
        </g>
      )}

      {/* Thought dots */}
      {mood === "thinking" && (
        <g fill={PANEL}>
          <circle cx="160" cy="34" r="5" />
          <circle cx="174" cy="22" r="7" />
        </g>
      )}
    </svg>
  );
};

export default Spark;
