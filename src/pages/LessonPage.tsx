import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserProgress } from "@/hooks/useUserProgress";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { LessonRunner } from "@/components/LessonRunner";
import { getLesson } from "@/content/lessons";
import { applyLessonOverride } from "@/lib/lessonOverrides";
import { ChevronLeft } from "lucide-react";

export const LessonPage = () => {
  const params = useParams<{ id?: string; lessonId?: string }>();
  const lessonId = params.lessonId ?? params.id ?? "";
  const { finishLesson } = useUserProgress();
  const baseLesson = useMemo(() => getLesson(lessonId), [lessonId]);
  const [override, setOverride] = useState<any>(null);

  useEffect(() => {
    if (!lessonId) return;
    supabase
      .from("lesson_overrides")
      .select("*")
      .eq("lesson_id", lessonId)
      .maybeSingle()
      .then(({ data }) => setOverride(data));
  }, [lessonId]);

  const lesson = useMemo(() => {
    if (!baseLesson) return undefined;
    return applyLessonOverride(baseLesson, override);
  }, [baseLesson, override]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-12 text-center">
          <h1 className="font-display text-2xl">Les niet gevonden</h1>
          <Link to="/dashboard"><Button className="mt-4 rounded-full font-display">Terug naar start</Button></Link>
        </main>
      </div>
    );
  }

  const finishLesson = async (stars: number) => {
    if (!user) return;
    await supabase.from("user_progress").upsert(
      { user_id: user.id, lesson_id: lesson.id, stars },
      { onConflict: "user_id,lesson_id" },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-2xl px-4 py-4 sm:px-6 sm:py-6">
        <Link to={`/world/${lesson.worldId}`} className="mb-4 inline-flex max-w-full items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-display sm:text-base">
          <ChevronLeft className="h-4 w-4" /> Terug naar Wereld {lesson.worldId}
        </Link>

        <LessonRunner
          lesson={lesson}
          onComplete={finishLesson}
          renderDoneCta={() => (
            <Link to={`/world/${lesson.worldId}`}>
              <Button className="h-14 px-8 rounded-full font-display bg-primary shadow-soft">
                Terug naar de kaart
              </Button>
            </Link>
          )}
        />
      </main>
    </div>
  );
};

export default LessonPage;
