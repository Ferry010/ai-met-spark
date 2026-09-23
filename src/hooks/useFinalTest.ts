import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FinalTestState {
  passed: boolean;
  bestScore: number | null;
  lastAttemptAt: string | null;
  lastPassed: boolean;
}

const LOCAL_KEY = "spark.local.final";
const EMPTY: FinalTestState = { passed: false, bestScore: null, lastAttemptAt: null, lastPassed: false };

/** Wait this long before retrying after a failed attempt. */
export const FINAL_COOLDOWN_MINUTES = 10;

const readLocal = (): FinalTestState => {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}") };
  } catch {
    return EMPTY;
  }
};

/** Final test attempts: Supabase for accounts, localStorage in dev/preview. */
export const useFinalTest = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const key = ["final-test", user?.id ?? "local"];

  const query = useQuery({
    queryKey: key,
    queryFn: async (): Promise<FinalTestState> => {
      if (!user) return readLocal();
      const { data, error } = await supabase
        .from("final_test_attempts")
        .select("score, passed, attempted_at")
        .eq("user_id", user.id)
        .order("attempted_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      const rows = data ?? [];
      return {
        passed: rows.some((r) => r.passed),
        bestScore: rows.length ? Math.max(...rows.map((r) => r.score)) : null,
        lastAttemptAt: rows[0]?.attempted_at ?? null,
        lastPassed: rows[0]?.passed ?? false,
      };
    },
  });

  const record = useMutation({
    mutationFn: async ({ score, passed }: { score: number; passed: boolean }) => {
      if (!user) {
        const prev = readLocal();
        localStorage.setItem(
          LOCAL_KEY,
          JSON.stringify({
            passed: prev.passed || passed,
            bestScore: Math.max(prev.bestScore ?? 0, score),
            lastAttemptAt: new Date().toISOString(),
            lastPassed: passed,
          }),
        );
        return;
      }
      const { error } = await supabase.from("final_test_attempts").insert({ user_id: user.id, score, passed });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const state = query.data ?? EMPTY;
  const cooldownUntil =
    !state.passed && state.lastAttemptAt && !state.lastPassed
      ? new Date(new Date(state.lastAttemptAt).getTime() + FINAL_COOLDOWN_MINUTES * 60_000)
      : null;

  return {
    ...state,
    isLoading: query.isLoading,
    cooldownUntil: cooldownUntil && cooldownUntil > new Date() ? cooldownUntil : null,
    record: record.mutateAsync,
  };
};
