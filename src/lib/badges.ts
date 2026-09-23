import { Award, Trophy, Star, Flame, Sparkles, Rocket, Crown, Target, Medal, Compass, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ALL_MISSIONS, WORLDS } from "@/content/missions";

export interface BadgeContext {
  completed: Set<string>;
  /** Best stars per mission id. */
  stars: Map<string, number>;
  finalPassed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Classes for the earned state (flat fill + readable text). */
  tone: string;
  earned: (ctx: BadgeContext) => boolean;
}

const TOTAL = ALL_MISSIONS.length;
const totalStars = (ctx: BadgeContext) => [...ctx.stars.values()].reduce((a, b) => a + b, 0);
const worldDone = (i: number) => (ctx: BadgeContext) => WORLDS[i].missions.every((m) => ctx.completed.has(m.id));

export const BADGES: Badge[] = [
  { id: "first", name: "Eerste missie", description: "Je eerste missie gehaald", icon: Sparkles, tone: "bg-primary text-primary-foreground", earned: (c) => c.completed.size >= 1 },
  { id: "three", name: "Op stoom", description: "3 missies gehaald", icon: Flame, tone: "bg-accent text-accent-foreground", earned: (c) => c.completed.size >= 3 },
  { id: "perfect", name: "Perfect!", description: "Een missie met 3 sterren", icon: Star, tone: "bg-secondary text-secondary-foreground", earned: (c) => [...c.stars.values()].some((s) => s >= 3) },
  { id: "world-1", name: "Schild van Veilig", description: "Wereld Veilig uitgespeeld", icon: Shield, tone: "bg-safe text-safe-foreground", earned: worldDone(0) },
  { id: "world-2", name: "Kompas van Slim", description: "Wereld Slim uitgespeeld", icon: Compass, tone: "bg-smart text-smart-foreground", earned: worldDone(1) },
  { id: "world-3", name: "Ster van Sterker", description: "Wereld Sterker uitgespeeld", icon: Rocket, tone: "bg-stronger text-stronger-foreground", earned: worldDone(2) },
  { id: "halfway", name: "Halverwege", description: `${Math.ceil(TOTAL / 2)} missies gehaald`, icon: Target, tone: "bg-primary text-primary-foreground", earned: (c) => c.completed.size >= Math.ceil(TOTAL / 2) },
  { id: "stars-30", name: "Sterrenjager", description: "30 sterren verzameld", icon: Trophy, tone: "bg-secondary text-secondary-foreground", earned: (c) => totalStars(c) >= 30 },
  { id: "all", name: "Missieheld", description: `Alle ${TOTAL} missies gehaald`, icon: Award, tone: "bg-primary text-primary-foreground", earned: (c) => c.completed.size >= TOTAL },
  { id: "exam", name: "Geslaagd", description: "De eindtoets gehaald", icon: Medal, tone: "bg-success text-success-foreground", earned: (c) => c.finalPassed },
  { id: "pro", name: "AI Pro", description: "Alles gehaald, plus de eindtoets", icon: Crown, tone: "bg-foreground text-background", earned: (c) => c.completed.size >= TOTAL && c.finalPassed },
];
