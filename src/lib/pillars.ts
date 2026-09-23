import type { Pillar } from "@/content/missions";

/**
 * Per-world theme classes. Written out in full so Tailwind can see them.
 */
export const PILLAR_THEME: Record<
  Pillar,
  { solid: string; soft: string; text: string; border: string; press: string; bar: string; ring: string }
> = {
  safe: {
    solid: "bg-safe text-safe-foreground",
    soft: "bg-safe-soft",
    text: "text-safe-dark",
    border: "border-safe",
    press: "press-safe",
    bar: "bg-safe",
    ring: "ring-safe",
  },
  smart: {
    solid: "bg-smart text-smart-foreground",
    soft: "bg-smart-soft",
    text: "text-smart-dark",
    border: "border-smart",
    press: "press-smart",
    bar: "bg-smart",
    ring: "ring-smart",
  },
  stronger: {
    solid: "bg-stronger text-stronger-foreground",
    soft: "bg-stronger-soft",
    text: "text-stronger-dark",
    border: "border-stronger",
    press: "press-stronger",
    bar: "bg-stronger",
    ring: "ring-stronger",
  },
};
