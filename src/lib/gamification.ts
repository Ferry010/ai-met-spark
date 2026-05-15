/**
 * XP/level math + reward constants for the gamification layer.
 * Pure functions only — no React, no Supabase.
 */

export const XP = {
  STEP: 10,
  CORRECT: 25,
  PERFECT_LESSON: 100,
  HINT_COST: 5,
  COMBO_BONUS: 10, // per combo step beyond the first correct in a row
} as const;

/** XP needed to reach a given level. Gentle quadratic curve. */
export const xpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return 100 * (level - 1) * (level - 1) + 100 * (level - 1);
};

export const levelFromXp = (xp: number): number => {
  let lvl = 1;
  while (xpForLevel(lvl + 1) <= xp) lvl += 1;
  return lvl;
};

export interface LevelProgress {
  level: number;
  xpInLevel: number;
  xpForNext: number;
  pct: number;
}

export const levelProgress = (xp: number): LevelProgress => {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = Math.max(1, next - base);
  const xpInLevel = xp - base;
  return {
    level,
    xpInLevel,
    xpForNext: span,
    pct: Math.min(100, Math.round((xpInLevel / span) * 100)),
  };
};

export const comboMultiplier = (combo: number): number => {
  if (combo >= 5) return 3;
  if (combo >= 3) return 2;
  return 1;
};

/** Returns true if last_played_date is yesterday (relative to today, local). */
export const isStreakContinuation = (lastPlayed: string | null): boolean => {
  if (!lastPlayed) return false;
  const today = new Date();
  const last = new Date(lastPlayed + "T00:00:00");
  const diff = Math.round(
    (new Date(today.toDateString()).getTime() - last.getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return diff === 1;
};

export const isSameDay = (lastPlayed: string | null): boolean => {
  if (!lastPlayed) return false;
  const today = new Date();
  return today.toISOString().slice(0, 10) === lastPlayed;
};

export const todayISO = (): string => new Date().toISOString().slice(0, 10);
