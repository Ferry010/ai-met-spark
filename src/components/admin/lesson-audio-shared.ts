import type { Lesson } from "@/content/lessons";
import { normalizeTtsSummary, normalizeTtsText } from "@/lib/tts";

export type Step = "intro" | "theoryIntro" | "fact" | "sparkMiddle" | "theoryDeep" | "summary";

export interface AudioRow {
  lesson_id: string;
  step: string;
  storage_path: string;
  text_hash: string;
}

const getNormalizedLessonText = (value: string | undefined) => normalizeTtsText(value);

export const LESSON_AUDIO_STEPS: { key: Step; label: string; getText: (lesson: Lesson) => string | undefined }[] = [
  { key: "intro", label: "Intro", getText: (lesson) => getNormalizedLessonText(lesson.sparkIntro) },
  { key: "theoryIntro", label: "Theorie 1", getText: (lesson) => getNormalizedLessonText(lesson.theoryIntro) },
  { key: "fact", label: "Wist je dat", getText: (lesson) => getNormalizedLessonText(lesson.fact) },
  { key: "sparkMiddle", label: "Spark midden", getText: (lesson) => getNormalizedLessonText(lesson.sparkMiddle) },
  { key: "theoryDeep", label: "Theorie 2", getText: (lesson) => getNormalizedLessonText(lesson.theoryDeep) },
  {
    key: "summary",
    label: "Samenvatting",
    getText: (lesson) => normalizeTtsSummary(lesson.summary),
  },
];

export const getLessonAudioKey = (lessonId: string, step: Step) => `${lessonId}/${step}`;