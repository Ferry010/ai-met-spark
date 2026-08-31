import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProgressRow {
  lesson_id: string;
  stars: number;
  completed_at: string;
}

const key = (uid?: string) => ["user-progress", uid ?? "local"] as const;
const LOCAL_KEY = "spark.local.progress";

const readLocal = (): ProgressRow[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as ProgressRow[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = (rows: ProgressRow[]) => {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
  } catch {}
};

/**
 * Progress store.
 *  - Anonymous kids (no login): stored in the browser via localStorage.
 *  - Logged-in users (optional teacher/school accounts): synced to Supabase.
 */
export const useUserProgress = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: key(user?.id),
    // Always enabled: anonymous reads come from localStorage.
    enabled: true,
    staleTime: 30_000,
    queryFn: async (): Promise<ProgressRow[]> => {
      if (!user) return readLocal();
      const { data, error } = await supabase
        .from("user_progress")
        .select("lesson_id, stars, completed_at")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []) as ProgressRow[];
    },
  });

  const rows = query.data ?? [];
  const completed = new Set(rows.map((r) => r.lesson_id));

  const finishLesson = useMutation({
    mutationFn: async ({ lessonId, stars }: { lessonId: string; stars: number }) => {
      if (!user) {
        const current = readLocal();
        const next = current.filter((r) => r.lesson_id !== lessonId);
        next.push({ lesson_id: lessonId, stars, completed_at: new Date().toISOString() });
        writeLocal(next);
        return;
      }
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          { user_id: user.id, lesson_id: lessonId, stars },
          { onConflict: "user_id,lesson_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(user?.id) }),
  });

  const resetProgress = useMutation({
    mutationFn: async () => {
      if (!user) {
        writeLocal([]);
        return;
      }
      await supabase.from("user_progress").delete().eq("user_id", user.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(user?.id) }),
  });

  return {
    rows,
    completed,
    isLoading: query.isLoading,
    finishLesson: finishLesson.mutateAsync,
    resetProgress: resetProgress.mutateAsync,
  };
};
