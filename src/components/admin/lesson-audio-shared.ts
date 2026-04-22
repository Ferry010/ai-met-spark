import type { Lesson } from "@/content/lessons";

export type Step = "intro" | "theoryIntro" | "fact" | "sparkMiddle" | "theoryDeep" | "summary";

export interface AudioRow {
  lesson_id: string;
  step: string;
  storage_path: string;
  text_hash: string;
}

export const LESSON_AUDIO_STEPS: { key: Step; label: string; getText: (lesson: Lesson) => string | undefined }[] = [
  { key: "intro", label: "Intro", getText: (lesson) => lesson.sparkIntro },
  { key: "theoryIntro", label: "Theorie 1", getText: (lesson) => lesson.theoryIntro },
  { key: "fact", label: "Wist je dat", getText: (lesson) => lesson.fact },
  { key: "sparkMiddle", label: "Spark midden", getText: (lesson) => lesson.sparkMiddle },
  { key: "theoryDeep", label: "Theorie 2", getText: (lesson) => lesson.theoryDeep },
  {
    key: "summary",
    label: "Samenvatting",
    getText: (lesson) => (lesson.summary && lesson.summary.length ? lesson.summary.join(". ") : undefined),
  },
];

export const getLessonAudioKey = (lessonId: string, step: Step) => `${lessonId}/${step}`;