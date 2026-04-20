import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ALL_LESSONS, WORLDS, type Lesson, type World } from "@/content/lessons";

export interface LessonOverride {
  lesson_id: string;
  title: string | null;
  fact: string | null;
  emoji: string | null;
}

const applyOverride = (lesson: Lesson, ov?: LessonOverride): Lesson => {
  if (!ov) return lesson;
  return {
    ...lesson,
    title: ov.title?.trim() ? ov.title : lesson.title,
    fact: ov.fact?.trim() ? ov.fact : lesson.fact,
    emoji: ov.emoji?.trim() ? ov.emoji : lesson.emoji,
  };
};

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

  const lessons: Lesson[] = ALL_LESSONS.map((l) => applyOverride(l, overrides[l.id]));
  const worlds: World[] = WORLDS.map((w) => ({
    ...w,
    lessons: w.lessons.map((l) => applyOverride(l, overrides[l.id])),
  }));

  return { overrides, lessons, worlds, loading, refresh };
};
