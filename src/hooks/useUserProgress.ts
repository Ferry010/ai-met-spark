import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProgressRow {
  lesson_id: string;
  stars: number;
  completed_at: string;
}

const key = (uid?: string) => ["user-progress", uid ?? "anon"] as const;

export const useUserProgress = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: key(user?.id),
    enabled: !!user,
    staleTime: 30_000,
    queryFn: async (): Promise<ProgressRow[]> => {
      if (!user) return [];
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
      if (!user) throw new Error("not-authenticated");
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
      if (!user) throw new Error("not-authenticated");
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
