import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useLessonOverrides } from "@/hooks/useLessonOverrides";
import { supabase } from "@/integrations/supabase/client";
import { textHash } from "@/lib/markdown";
import { invalidateSparkVoiceCache } from "@/hooks/useSparkVoice";
import { toast } from "@/hooks/use-toast";
import { LessonAudioRow } from "@/components/admin/LessonAudioRow";
import { AudioRow, getLessonAudioKey, LESSON_AUDIO_STEPS, Step } from "@/components/admin/lesson-audio-shared";
import { Loader2 } from "lucide-react";
import type { Lesson } from "@/content/lessons";

const getActionKey = (lessonId: string, step: Step, action: "delete" | "generate" | "upload") =>
  `${getLessonAudioKey(lessonId, step)}:${action}`;

export const LessonAudio = () => {
  const { lessons, loading } = useLessonOverrides();
  const [audio, setAudio] = useState<Record<string, AudioRow>>({});
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(true);

  const refreshAudio = async () => {
    const { data } = await supabase.from("lesson_audio").select("*");
    const map: Record<string, AudioRow> = {};
    (data ?? []).forEach((r: any) => {
      map[`${r.lesson_id}/${r.step}`] = r;
    });
    setAudio(map);
    setAudioLoading(false);
    invalidateSparkVoiceCache();
  };

  useEffect(() => {
    refreshAudio();
  }, []);

  const generate = async (lesson: Lesson, step: Step, text: string) => {
    setBusyAction(getActionKey(lesson.id, step, "generate"));
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson-audio", {
        body: { lessonId: lesson.id, step, text, textHash: textHash(text) },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      toast({ title: "Audio gegenereerd", description: `${lesson.id} • ${step} met Spark` });
      await refreshAudio();
    } catch (e: any) {
      toast({ title: "Mislukt", description: e.message, variant: "destructive" });
    } finally {
      setBusyAction(null);
    }
  };

  const upload = async (lesson: Lesson, step: Step, text: string, file: File) => {
    setBusyAction(getActionKey(lesson.id, step, "upload"));
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);
      const { data, error } = await supabase.functions.invoke("upload-lesson-audio", {
        body: { lessonId: lesson.id, step, textHash: textHash(text), mp3Base64: base64 },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      toast({ title: "Upload geslaagd", description: `${lesson.id} • ${step}` });
      await refreshAudio();
    } catch (e: any) {
      toast({ title: "Upload mislukt", description: e.message, variant: "destructive" });
    } finally {
      setBusyAction(null);
    }
  };

  const removeAudio = async (lesson: Lesson, step: Step) => {
    setBusyAction(getActionKey(lesson.id, step, "delete"));
    try {
      const { data, error } = await supabase.functions.invoke("delete-lesson-audio", {
        body: { lessonId: lesson.id, step },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      toast({ title: "Audio verwijderd", description: `${lesson.id} • ${step}` });
      await refreshAudio();
    } catch (e: any) {
      toast({ title: "Verwijderen mislukt", description: e.message, variant: "destructive" });
    } finally {
      setBusyAction(null);
    }
  };

  const generateMissing = async (lesson: Lesson) => {
    for (const s of LESSON_AUDIO_STEPS) {
      const text = s.getText(lesson);
      if (!text) continue;
      const key = getLessonAudioKey(lesson.id, s.key);
      const existing = audio[key];
      if (existing && existing.text_hash === textHash(text)) continue;
      await generate(lesson, s.key, text);
    }
  };

  if (loading || audioLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-5xl">
        <h1 className="font-display text-3xl mb-2">Lesaudio beheer</h1>
        <p className="text-muted-foreground mb-6">
          Genereer voorleesfragmenten met Spark, upload zelf MP3&apos;s of verwijder en regenereer per stap. Audio wordt eenmalig opgeslagen en
          gestreamd vanuit storage — geen API-credits per gebruiker.
        </p>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <LessonAudioRow
              key={lesson.id}
              lesson={lesson}
              audio={audio}
              busyAction={busyAction}
              onGenerate={generate}
              onUpload={upload}
              onDelete={removeAudio}
              onGenerateMissing={() => generateMissing(lesson)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonAudio;
