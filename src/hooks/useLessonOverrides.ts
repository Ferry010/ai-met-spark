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

const applyOverride = (lesson: Lesson, ov?: LessonOverride): Lesson => {
  if (!ov) return lesson;
  return {
    ...lesson,
    title: ov.title?.trim() ? ov.title : lesson.title,
    fact: ov.fact?.trim() ? ov.fact : lesson.fact,
    emoji: ov.emoji?.trim() ? ov.emoji : lesson.emoji,
    sparkIntro: ov.spark_intro?.trim() ? ov.spark_intro : lesson.sparkIntro,
    theoryIntro: ov.theory_intro?.trim() ? ov.theory_intro : lesson.theoryIntro,
    sparkMiddle: ov.spark_middle?.trim() ? ov.spark_middle : lesson.sparkMiddle,
    theoryDeep: ov.theory_deep?.trim() ? ov.theory_deep : lesson.theoryDeep,
    summary: ov.summary && ov.summary.length > 0 ? ov.summary : lesson.summary,
    interactive: ov.interactive ?? lesson.interactive,
    quiz: ov.quiz && ov.quiz.length > 0 ? ov.quiz : lesson.quiz,
    reflection: ov.reflection?.trim() ? ov.reflection : lesson.reflection,
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
