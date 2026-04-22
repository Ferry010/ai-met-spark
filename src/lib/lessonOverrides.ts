import type { Lesson } from "@/content/lessons";
import type { LessonOverride } from "@/hooks/useLessonOverrides";

export const applyLessonOverride = (lesson: Lesson, override?: LessonOverride | null): Lesson => {
  if (!override) return lesson;

  return {
    ...lesson,
    title: override.title?.trim() ? override.title : lesson.title,
    fact: override.fact?.trim() ? override.fact : lesson.fact,
    emoji: override.emoji?.trim() ? override.emoji : lesson.emoji,
    sparkIntro: override.spark_intro?.trim() ? override.spark_intro : lesson.sparkIntro,
    theoryIntro: override.theory_intro?.trim() ? override.theory_intro : lesson.theoryIntro,
    sparkMiddle: override.spark_middle?.trim() ? override.spark_middle : lesson.sparkMiddle,
    theoryDeep: override.theory_deep?.trim() ? override.theory_deep : lesson.theoryDeep,
    summary: override.summary && override.summary.length > 0 ? override.summary : lesson.summary,
    interactive: override.interactive ?? lesson.interactive,
    quiz: override.quiz && override.quiz.length > 0 ? override.quiz : lesson.quiz,
    reflection: override.reflection?.trim() ? override.reflection : lesson.reflection,
  };
};
