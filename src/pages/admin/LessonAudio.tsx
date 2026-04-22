import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLessonOverrides } from "@/hooks/useLessonOverrides";
import { supabase } from "@/integrations/supabase/client";
import { textHash } from "@/lib/markdown";
import { invalidateSparkVoiceCache } from "@/hooks/useSparkVoice";
import { toast } from "@/hooks/use-toast";
import { Loader2, Play, RefreshCw, Upload, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import type { Lesson } from "@/content/lessons";

type Step = "intro" | "theoryIntro" | "fact" | "sparkMiddle" | "theoryDeep" | "summary";

const STEPS: { key: Step; label: string; getText: (l: Lesson) => string | undefined }[] = [
  { key: "intro", label: "Intro", getText: (l) => l.sparkIntro },
  { key: "theoryIntro", label: "Theorie 1", getText: (l) => l.theoryIntro },
  { key: "fact", label: "Wist je dat", getText: (l) => l.fact },
  { key: "sparkMiddle", label: "Spark midden", getText: (l) => l.sparkMiddle },
  { key: "theoryDeep", label: "Theorie 2", getText: (l) => l.theoryDeep },
  { key: "summary", label: "Samenvatting", getText: (l) => (l.summary && l.summary.length ? l.summary.join(". ") : undefined) },
];

interface AudioRow {
  lesson_id: string;
  step: string;
  storage_path: string;
  text_hash: string;
}

export const LessonAudio = () => {
  const { lessons, loading } = useLessonOverrides();
  const [audio, setAudio] = useState<Record<string, AudioRow>>({});
  const [busy, setBusy] = useState<string | null>(null);
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
    const key = `${lesson.id}/${step}`;
    setBusy(key);
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson-audio", {
        body: { lessonId: lesson.id, step, text, textHash: textHash(text) },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      toast({ title: "Audio gegenereerd", description: `${lesson.id} • ${step}` });
      await refreshAudio();
    } catch (e: any) {
      toast({ title: "Mislukt", description: e.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const upload = async (lesson: Lesson, step: Step, text: string, file: File) => {
    const key = `${lesson.id}/${step}`;
    setBusy(key);
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
      setBusy(null);
    }
  };

  const generateMissing = async (lesson: Lesson) => {
    for (const s of STEPS) {
      const text = s.getText(lesson);
      if (!text) continue;
      const key = `${lesson.id}/${s.key}`;
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
          Genereer voorleesfragmenten per stap of upload zelf MP3's. Audio wordt eenmalig opgeslagen en
          gestreamed vanuit storage — geen API-credits per gebruiker.
        </p>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              audio={audio}
              busy={busy}
              onGenerate={generate}
              onUpload={upload}
              onGenerateMissing={() => generateMissing(lesson)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

const LessonRow = ({
  lesson,
  audio,
  busy,
  onGenerate,
  onUpload,
  onGenerateMissing,
}: {
  lesson: Lesson;
  audio: Record<string, AudioRow>;
  busy: string | null;
  onGenerate: (l: Lesson, s: Step, text: string) => void;
  onUpload: (l: Lesson, s: Step, text: string, file: File) => void;
  onGenerateMissing: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    let recorded = 0, missing = 0, stale = 0;
    STEPS.forEach((s) => {
      const text = s.getText(lesson);
      if (!text) return;
      const rec = audio[`${lesson.id}/${s.key}`];
      if (!rec) missing++;
      else if (rec.text_hash !== textHash(text)) stale++;
      else recorded++;
    });
    return { recorded, missing, stale };
  }, [lesson, audio]);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{lesson.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-display text-base">Les {lesson.id} — {lesson.title}</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> {stats.recorded}</Badge>
            {stats.stale > 0 && <Badge variant="outline" className="text-xs gap-1"><AlertCircle className="h-3 w-3 text-warning" /> {stats.stale} verouderd</Badge>}
            {stats.missing > 0 && <Badge variant="outline" className="text-xs gap-1"><Circle className="h-3 w-3" /> {stats.missing} ontbreekt</Badge>}
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
          {open ? "Verberg" : "Bekijk"}
        </Button>
        <Button size="sm" onClick={onGenerateMissing} disabled={!!busy}>
          <RefreshCw className="h-4 w-4 mr-1" /> Genereer ontbrekende
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-2 border-t pt-4">
          {STEPS.map((s) => {
            const text = s.getText(lesson);
            if (!text) return null;
            const key = `${lesson.id}/${s.key}`;
            const rec = audio[key];
            const isStale = rec && rec.text_hash !== textHash(text);
            const isBusy = busy === key;
            const publicUrl = rec ? supabase.storage.from("lesson-audio").getPublicUrl(rec.storage_path).data.publicUrl : null;
            return (
              <div key={s.key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <div className="w-32 text-sm font-display">{s.label}</div>
                <div className="flex-1 text-xs text-muted-foreground truncate">{text.slice(0, 80)}…</div>
                {publicUrl && (
                  <audio src={publicUrl} controls className="h-8" />
                )}
                {isStale && <Badge variant="outline" className="text-xs text-warning">verouderd</Badge>}
                <Button size="sm" variant="outline" disabled={isBusy} onClick={() => onGenerate(lesson, s.key, text)}>
                  {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                </Button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onUpload(lesson, s.key, text, f);
                      e.target.value = "";
                    }}
                  />
                  <Button asChild size="sm" variant="outline" disabled={isBusy}>
                    <span><Upload className="h-4 w-4" /></span>
                  </Button>
                </label>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default LessonAudio;
