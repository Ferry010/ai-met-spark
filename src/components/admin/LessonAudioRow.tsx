import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { textHash } from "@/lib/markdown";
import { AlertCircle, CheckCircle2, Circle, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import type { Lesson } from "@/content/lessons";
import { AudioRow, getLessonAudioKey, LESSON_AUDIO_STEPS, Step } from "./lesson-audio-shared";

interface LessonAudioRowProps {
  audio: Record<string, AudioRow>;
  busyAction: string | null;
  lesson: Lesson;
  onDelete: (lesson: Lesson, step: Step) => void;
  onGenerate: (lesson: Lesson, step: Step, text: string) => void;
  onGenerateMissing: () => void;
  onUpload: (lesson: Lesson, step: Step, text: string, file: File) => void;
}

const getActionKey = (lessonId: string, step: Step, action: "delete" | "generate" | "upload") =>
  `${getLessonAudioKey(lessonId, step)}:${action}`;

export const LessonAudioRow = ({
  lesson,
  audio,
  busyAction,
  onGenerate,
  onUpload,
  onDelete,
  onGenerateMissing,
}: LessonAudioRowProps) => {
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    let recorded = 0;
    let missing = 0;
    let stale = 0;

    LESSON_AUDIO_STEPS.forEach((stepConfig) => {
      const text = stepConfig.getText(lesson);
      if (!text) return;

      const recording = audio[getLessonAudioKey(lesson.id, stepConfig.key)];
      if (!recording) missing++;
      else if (recording.text_hash !== textHash(text)) stale++;
      else recorded++;
    });

    return { recorded, missing, stale };
  }, [audio, lesson]);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{lesson.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-display text-base">Les {lesson.id} — {lesson.title}</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" /> {stats.recorded}
            </Badge>
            {stats.stale > 0 && (
              <Badge variant="outline" className="text-xs gap-1">
                <AlertCircle className="h-3 w-3 text-warning" /> {stats.stale} verouderd
              </Badge>
            )}
            {stats.missing > 0 && (
              <Badge variant="outline" className="text-xs gap-1">
                <Circle className="h-3 w-3" /> {stats.missing} ontbreekt
              </Badge>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen((value) => !value)}>
          {open ? "Verberg" : "Bekijk"}
        </Button>
        <Button size="sm" onClick={onGenerateMissing} disabled={!!busyAction}>
          <RefreshCw className="h-4 w-4 mr-1" /> Genereer ontbrekende
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-2 border-t pt-4">
          {LESSON_AUDIO_STEPS.map((stepConfig) => {
            const text = stepConfig.getText(lesson);
            if (!text) return null;

            const key = getLessonAudioKey(lesson.id, stepConfig.key);
            const recording = audio[key];
            const isStale = recording && recording.text_hash !== textHash(text);
            const isGenerating = busyAction === getActionKey(lesson.id, stepConfig.key, "generate");
            const isUploading = busyAction === getActionKey(lesson.id, stepConfig.key, "upload");
            const isDeleting = busyAction === getActionKey(lesson.id, stepConfig.key, "delete");
            const isBusy = isGenerating || isUploading || isDeleting;
            const publicUrl = recording
              ? supabase.storage.from("lesson-audio").getPublicUrl(recording.storage_path).data.publicUrl
              : null;

            return (
              <div key={stepConfig.key} className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/30 p-3">
                <div className="w-32 text-sm font-display">{stepConfig.label}</div>
                <div className="min-w-0 flex-1 text-xs text-muted-foreground truncate">{text.slice(0, 80)}…</div>
                {publicUrl && <audio src={publicUrl} controls className="h-8 max-w-full" />}
                {isStale && <Badge variant="outline" className="text-xs text-warning">verouderd</Badge>}
                <Button size="sm" variant="outline" disabled={isBusy} onClick={() => onGenerate(lesson, stepConfig.key, text)}>
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {recording ? "Regenereren" : "Genereren"}
                </Button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) onUpload(lesson, stepConfig.key, text, file);
                      event.target.value = "";
                    }}
                  />
                  <Button asChild size="sm" variant="outline" disabled={isBusy}>
                    <span>
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload
                    </span>
                  </Button>
                </label>
                {recording && (
                  <Button size="sm" variant="outline" disabled={isBusy} onClick={() => onDelete(lesson, stepConfig.key)}>
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Verwijderen
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};