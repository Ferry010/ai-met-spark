import { Award, Trophy, Star, Zap, Flame, Sparkles, Rocket, Crown, Target, Medal } from "lucide-react";
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
    id: "world-1",
    name: "Veilig-held",
    description: "Wereld 1 helemaal uitgespeeld",
    icon: Award,
    emoji: "🛡️",
    tone: "primary",
    earned: ({ completed }) => WORLDS[0].lessons.every((l) => completed.has(l.id)),
  },
  {
    id: "world-2",
    name: "Slimmerik",
    description: "Wereld 2 helemaal uitgespeeld",
    icon: Award,
    emoji: "🧠",
    tone: "secondary",
    earned: ({ completed }) => WORLDS[1].lessons.every((l) => completed.has(l.id)),
  },
  {
    id: "world-3",
    name: "Krachtpatser",
    description: "Wereld 3 helemaal uitgespeeld",
    icon: Award,
    emoji: "💪",
    tone: "accent",
    earned: ({ completed }) => WORLDS[2].lessons.every((l) => completed.has(l.id)),
  },
  {
    id: "halfway",
    name: "Halverwege!",
    description: "6 lessen afgemaakt",
    icon: Target,
    emoji: "🎯",
    tone: "secondary",
    earned: ({ completed }) => completed.size >= 6,
  },
  {
    id: "streak-3",
    name: "Op stoom",
    description: "3 lessen op rij gedaan",
    icon: Flame,
    emoji: "🔥",
    tone: "accent",
    earned: ({ completed }) => completed.size >= 3,
  },
  {
    id: "speed",
    name: "Raket",
    description: "Wereld 1 in één keer uitgespeeld",
    icon: Rocket,
    emoji: "🚀",
    tone: "primary",
    earned: ({ completed }) => WORLDS[0].lessons.every((l) => completed.has(l.id)),
  },
  {
    id: "all-lessons",
    name: "Lesheld",
    description: "Alle 12 lessen afgemaakt",
    icon: Star,
    emoji: "⭐",
    tone: "secondary",
    earned: ({ completed }) => completed.size >= ALL_LESSONS.length,
  },
  {
    id: "exam-pass",
    name: "Geslaagd",
    description: "Eindtoets gehaald",
    icon: Medal,
    emoji: "🥇",
    tone: "success",
    earned: ({ finalPassed }) => finalPassed,
  },
  {
    id: "smart-kid",
    name: "Smart Kid",
    description: "Alles + eindtoets gehaald",
    icon: Crown,
    emoji: "👑",
    tone: "success",
    earned: ({ completed, finalPassed }) =>
      completed.size >= ALL_LESSONS.length && finalPassed,
  },
];

export const TONE_BG: Record<NonNullable<Badge["tone"]>, string> = {
  primary: "bg-gradient-sky text-primary-foreground",
  secondary: "bg-gradient-sunshine text-secondary-foreground",
  accent: "bg-gradient-coral text-accent-foreground",
  success: "bg-success text-success-foreground",
};
