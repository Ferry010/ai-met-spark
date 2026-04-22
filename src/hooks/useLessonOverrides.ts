import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ALL_LESSONS,
  WORLDS,
  type Lesson,
  type World,
  type InteractiveStep,
  type QuizQuestion,
} from "@/content/lessons";
import { applyLessonOverride } from "@/lib/lessonOverrides";

export interface LessonOverride {
  lesson_id: string;
  title: string | null;
  fact: string | null;
  emoji: string | null;
  spark_intro: string | null;
  theory_intro: string | null;
  spark_middle: string | null;
  theory_deep: string | null;
  summary: string[] | null;
  interactive: InteractiveStep | null;
  quiz: QuizQuestion[] | null;
  reflection: string | null;
}

export const useLessonOverrides = () => {
  const [overrides, setOverrides] = useState<Record<string, LessonOverride>>({});
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase.from("lesson_overrides").select("*");
    const map: Record<string, LessonOverride> = {};
    (data ?? []).forEach((o: any) => {
      map[o.lesson_id] = o as LessonOverride;
    });
    setOverrides(map);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const lessons: Lesson[] = ALL_LESSONS.map((l) => applyLessonOverride(l, overrides[l.id]));
  const worlds: World[] = WORLDS.map((w) => ({
    ...w,
    lessons: w.lessons.map((l) => applyLessonOverride(l, overrides[l.id])),
  }));

  return { overrides, lessons, worlds, loading, refresh };
};
