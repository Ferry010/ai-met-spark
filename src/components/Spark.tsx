import { cn } from "@/lib/utils";

export type SparkMood = "default" | "happy" | "thinking" | "celebrating" | "sad";

interface SparkProps {
  mood?: SparkMood;
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Spark — friendly round mascot for AI Smart Kids.
 * Pure inline SVG so it scales crisply and can be themed via design tokens.
 */
export const Spark = ({ mood = "default", size = 160, className, animate = true }: SparkProps) => {
  const isHappy = mood === "happy" || mood === "celebrating";
  const isSad = mood === "sad";
  const isThinking = mood === "thinking";

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn(animate && "animate-float", className)}
      aria-label="Spark the AI Smart Kids mascot"
      role="img"
    >
      <defs>
        <radialGradient id="sparkBody" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
          <stop offset="60%" stopColor="hsl(var(--spark))" />
          <stop offset="100%" stopColor="hsl(var(--spark-dark))" />
        </radialGradient>
        <radialGradient id="sparkCheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Antenna */}
      <line x1="100" y1="40" x2="100" y2="20" stroke="hsl(var(--spark-dark))" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="16" r="7" fill="hsl(var(--secondary))">
        {animate && <animate attributeName="r" values="7;9;7" dur="1.6s" repeatCount="indefinite" />}
      </circle>

      {/* Body */}
      <circle cx="100" cy="110" r="70" fill="url(#sparkBody)" />

      {/* Belly highlight */}
      <ellipse cx="100" cy="135" rx="42" ry="30" fill="hsl(var(--background))" opacity="0.55" />

      {/* Cheeks */}
      <circle cx="58" cy="120" r="14" fill="url(#sparkCheek)" />
      <circle cx="142" cy="120" r="14" fill="url(#sparkCheek)" />

      {/* Eyes */}
      {isThinking ? (
        <>
          <ellipse cx="80" cy="100" rx="9" ry="3" fill="hsl(var(--spark-dark))" />
          <ellipse cx="120" cy="100" rx="9" ry="3" fill="hsl(var(--spark-dark))" />
        </>
      ) : (
        <>
          <g className={animate ? "spark-eye" : ""}>
            <circle cx="80" cy="100" r="11" fill="white" />
            <circle cx="82" cy="102" r="6" fill="hsl(var(--spark-dark))" />
            <circle cx="84" cy="99" r="2.2" fill="white" />
          </g>
          <g className={animate ? "spark-eye" : ""}>
            <circle cx="120" cy="100" r="11" fill="white" />
            <circle cx="122" cy="102" r="6" fill="hsl(var(--spark-dark))" />
            <circle cx="124" cy="99" r="2.2" fill="white" />
          </g>
        </>
      )}

      {/* Mouth */}
      {isHappy && (
        <path d="M 80 132 Q 100 152 120 132" stroke="hsl(var(--spark-dark))" strokeWidth="4" fill="hsl(var(--accent))" strokeLinecap="round" />
      )}
      {!isHappy && !isSad && (
        <path d="M 88 134 Q 100 142 112 134" stroke="hsl(var(--spark-dark))" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      {isSad && (
        <path d="M 88 140 Q 100 130 112 140" stroke="hsl(var(--spark-dark))" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}

      {/* Side arms */}
      <circle cx="32" cy="120" r="10" fill="hsl(var(--spark))" />
      <circle cx="168" cy="120" r="10" fill="hsl(var(--spark))" />

      {/* Celebrating sparkles */}
      {mood === "celebrating" && (
        <g fill="hsl(var(--secondary))">
          <circle cx="40" cy="40" r="4" />
          <circle cx="160" cy="50" r="3" />
          <circle cx="170" cy="80" r="4" />
          <circle cx="30" cy="80" r="3" />
        </g>
      )}
    </svg>
  );
};

export default Spark;
