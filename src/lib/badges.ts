import { Award, Trophy, Star, Flame, Sparkles, Rocket, Crown, Target, Medal, Compass, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WORLDS, ALL_LESSONS } from "@/content/lessons";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  emoji: string;
  earned: (ctx: BadgeContext) => boolean;
  /** Optional tone class to color the earned card */
  tone?: "primary" | "secondary" | "accent" | "success";
}

export interface BadgeContext {
  completed: Set<string>;
  finalPassed: boolean;
}

const TOTAL = ALL_LESSONS.length; // 24

export const BADGES: Badge[] = [
  {
    id: "first-step",
    name: "Eerste stap",
    description: "Je eerste les afgemaakt!",
    icon: Sparkles,
    emoji: "✨",
    tone: "primary",
    earned: ({ completed }) => completed.size >= 1,
  },
  {
    id: "streak-3",
    name: "Op stoom",
    description: "3 lessen gedaan",
    icon: Flame,
    emoji: "🔥",
    tone: "accent",
    earned: ({ completed }) => completed.size >= 3,
  },
  {
    id: "halfway-world-1",
    name: "Halverwege Wereld 1",
    description: "4 lessen in Wereld 1",
    icon: Target,
    emoji: "🎯",
    tone: "primary",
    earned: ({ completed }) => WORLDS[0].lessons.slice(0, 4).every((l) => completed.has(l.id)),
  },
  {
    id: "world-1",
    name: "Schild van Waakzaamheid",
    description: "Wereld 1 (VEILIG) helemaal uitgespeeld",
    icon: Shield,
    emoji: "🛡️",
    tone: "primary",
    earned: ({ completed }) => WORLDS[0].lessons.every((l) => completed.has(l.id)),
  },
  {
    id: "world-2",
    name: "Kompas van Helderheid",
    description: "Wereld 2 (SLIM) helemaal uitgespeeld",
    icon: Compass,
    emoji: "🧭",
    tone: "secondary",
    earned: ({ completed }) => WORLDS[1].lessons.every((l) => completed.has(l.id)),
  },
  {
    id: "world-3",
    name: "Ster van Meesterschap",
    description: "Wereld 3 (STERKER) helemaal uitgespeeld",
    icon: Star,
    emoji: "⭐",
    tone: "accent",
    earned: ({ completed }) => WORLDS[2].lessons.every((l) => completed.has(l.id)),
  },
  {
    id: "halfway",
    name: "Halverwege!",
    description: "12 lessen afgemaakt",
    icon: Rocket,
    emoji: "🚀",
    tone: "secondary",
    earned: ({ completed }) => completed.size >= Math.floor(TOTAL / 2),
  },
  {
    id: "twenty",
    name: "Bijna daar",
    description: `20 van de ${TOTAL} lessen`,
    icon: Trophy,
    emoji: "🏆",
    tone: "secondary",
    earned: ({ completed }) => completed.size >= 20,
  },
  {
    id: "all-lessons",
    name: "Lesheld",
    description: `Alle ${TOTAL} lessen afgemaakt`,
    icon: Award,
    emoji: "📚",
    tone: "primary",
    earned: ({ completed }) => completed.size >= TOTAL,
  },
  {
    id: "exam-pass",
    name: "Geslaagd",
    description: "Eindbaas-test gehaald",
    icon: Medal,
    emoji: "🥇",
    tone: "success",
    earned: ({ finalPassed }) => finalPassed,
  },
  {
    id: "smart-kid",
    name: "AI Smart Kid",
    description: "Alles + eindbaas-test gehaald",
    icon: Crown,
    emoji: "👑",
    tone: "success",
    earned: ({ completed, finalPassed }) =>
      completed.size >= TOTAL && finalPassed,
  },
];

export const TONE_BG: Record<NonNullable<Badge["tone"]>, string> = {
  primary: "bg-gradient-sky text-primary-foreground",
  secondary: "bg-gradient-sunshine text-secondary-foreground",
  accent: "bg-gradient-coral text-accent-foreground",
  success: "bg-success text-success-foreground",
};
