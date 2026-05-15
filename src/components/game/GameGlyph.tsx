/**
 * Hand-drawn-style SVG glyphs used across the gameplay UI.
 * Replaces lucide-react icons inside the game surfaces so the
 * visuals feel like a children's game, not a UI kit.
 */
import { cn } from "@/lib/utils";

type GlyphName = "gem" | "flame" | "star" | "check" | "lock" | "sparkle" | "key";

interface GameGlyphProps extends React.SVGProps<SVGSVGElement> {
  name: GlyphName;
  size?: number;
}

export const GameGlyph = ({ name, size = 18, className, ...rest }: GameGlyphProps) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    className: cn("inline-block", className),
    "aria-hidden": true as const,
    ...rest,
  };

  switch (name) {
    case "gem":
      return (
        <svg {...common}>
          <path
            d="M5 9 L9 3 H15 L19 9 L12 22 Z"
            fill="currentColor"
            stroke="hsl(0 0% 0% / 0.35)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M9 3 L12 9 L15 3" fill="none" stroke="hsl(0 0% 0% / 0.3)" strokeWidth="1.2" />
          <path d="M5 9 H19" fill="none" stroke="hsl(0 0% 0% / 0.3)" strokeWidth="1.2" />
          <path d="M7 10 L9 12" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path
            d="M12 2 C13 6 18 7 17 13 C16.4 17.5 13.5 21 12 21 C10.5 21 7.6 17.5 7 13 C6.5 9 9 7 9 4 C10 5 11 5 12 2 Z"
            fill="currentColor"
            stroke="hsl(0 0% 0% / 0.4)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M12 11 C12.5 13 14 14 13.5 16.5 C13.2 18 12.5 19 12 19 C11.5 19 10.8 18 10.5 16.5 C10 14 11.5 13 12 11 Z"
            fill="hsl(48 100% 75%)"
            opacity="0.9"
          />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path
            d="M12 2.5 L14.6 9 L21.5 9.6 L16.2 14.1 L17.9 20.8 L12 17.3 L6.1 20.8 L7.8 14.1 L2.5 9.6 L9.4 9 Z"
            fill="currentColor"
            stroke="hsl(0 0% 0% / 0.4)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path
            d="M4 12.5 L10 18.5 L20 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4.5" y="10.5" width="15" height="11" rx="2.5"
            fill="currentColor" stroke="hsl(0 0% 0% / 0.4)" strokeWidth="1.4" />
          <path d="M7.5 10.5 V7.5 a4.5 4.5 0 0 1 9 0 V10.5"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="15.5" r="1.7" fill="hsl(0 0% 100% / 0.95)" />
          <rect x="11.2" y="15.5" width="1.6" height="3" rx="0.7" fill="hsl(0 0% 100% / 0.95)" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path
            d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z"
            fill="currentColor"
            stroke="hsl(0 0% 0% / 0.35)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "key":
      return (
        <svg {...common}>
          <circle cx="8" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M12.5 12 H21 M18 12 V15 M15 12 V14"
            fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
  }
};

export default GameGlyph;
