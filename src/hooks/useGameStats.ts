import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  isSameDay,
  isStreakContinuation,
  levelFromXp,
  levelProgress,
  todayISO,
} from "@/lib/gamification";

export interface GameStats {
  user_id: string;
  xp: number;
  level: number;
  streak_days: number;
  longest_combo: number;
  last_played_date: string | null;
}

const DEFAULT: GameStats = {
  user_id: "",
  xp: 0,
  level: 1,
  streak_days: 0,
  longest_combo: 0,
  last_played_date: null,
};

const key = (uid?: string) => ["user-stats", uid ?? "local"] as const;
const LOCAL_KEY = "spark.local.stats";

const readLocal = (): GameStats => {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? { ...DEFAULT, ...(JSON.parse(raw) as Partial<GameStats>) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
};

const writeLocal = (stats: GameStats) => {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(stats));
  } catch {}
};

/**
 * XP / level / streak store.
 *  - Anonymous kids (no login): stored in the browser via localStorage.
 *  - Logged-in users (optional): synced to Supabase.
 */
export const useGameStats = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: key(user?.id),
    enabled: true,
    staleTime: 30_000,
    queryFn: async (): Promise<GameStats> => {
      if (!user) return readLocal();
      const { data } = await (supabase as any)
        .from("user_stats")
        .select("user_id, xp, level, streak_days, longest_combo, last_played_date")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) return { ...DEFAULT, user_id: user.id };
      return data as GameStats;
    },
  });

  const stats = query.data ?? { ...DEFAULT, user_id: user?.id ?? "" };
  const progress = levelProgress(stats.xp);

  const addXp = useMutation({
    mutationFn: async ({
      amount,
      combo,
    }: {
      amount: number;
      combo?: number;
    }): Promise<{ leveledUp: boolean; newLevel: number; newXp: number }> => {
      const today = todayISO();
      const sameDay = isSameDay(stats.last_played_date);
      const continued = isStreakContinuation(stats.last_played_date);
      const newStreak = sameDay
        ? Math.max(stats.streak_days, 1)
        : continued
        ? stats.streak_days + 1
        : 1;

      const newXp = Math.max(0, stats.xp + amount);
      const newLevel = levelFromXp(newXp);
      const leveledUp = newLevel > stats.level;
      const longestCombo = Math.max(stats.longest_combo, combo ?? 0);

      if (!user) {
        writeLocal({
          user_id: "",
          xp: newXp,
          level: newLevel,
          streak_days: newStreak,
          longest_combo: longestCombo,
          last_played_date: today,
        });
        return { leveledUp, newLevel, newXp };
      }

      const { error } = await (supabase as any)
        .from("user_stats")
        .upsert(
          {
            user_id: user.id,
            xp: newXp,
            level: newLevel,
            streak_days: newStreak,
            longest_combo: longestCombo,
            last_played_date: today,
          },
          { onConflict: "user_id" },
        );
      if (error) throw error;
      return { leveledUp, newLevel, newXp };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(user?.id) }),
  });

  const reset = useMutation({
    mutationFn: async () => {
      if (!user) {
        writeLocal({ ...DEFAULT });
        return;
      }
      await (supabase as any).from("user_stats").delete().eq("user_id", user.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(user?.id) }),
  });

  return {
    stats,
    progress,
    isLoading: query.isLoading,
    addXp: addXp.mutateAsync,
    reset: reset.mutateAsync,
  };
};
