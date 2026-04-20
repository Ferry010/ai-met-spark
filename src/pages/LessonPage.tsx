import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { PaywallDialog } from "@/components/PaywallDialog";
import { LessonRunner } from "@/components/LessonRunner";
import { getLesson } from "@/content/lessons";
import { ChevronLeft } from "lucide-react";

export const LessonPage = () => {
  const params = useParams<{ id?: string; lessonId?: string }>();
  const lessonId = params.lessonId ?? params.id ?? "";
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const baseLesson = useMemo(() => getLesson(lessonId), [lessonId]);
  const [override, setOverride] = useState<any>(null);
  const [paywall, setPaywall] = useState(false);

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
    return {
      ...baseLesson,
      title: override?.title?.trim() || baseLesson.title,
      fact: override?.fact?.trim() || baseLesson.fact,
      emoji: override?.emoji?.trim() || baseLesson.emoji,
      interactive: override?.interactive ?? baseLesson.interactive,
      quiz: override?.quiz && Array.isArray(override.quiz) && override.quiz.length > 0 ? override.quiz : baseLesson.quiz,
    };
  }, [baseLesson, override]);

  useEffect(() => {
    if (!lesson || !profile) return;
    if (lesson.id === "1.1") return;
    if (!profile.paid) setPaywall(true);
  }, [lesson, profile]);

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
      <main className="container py-6 max-w-2xl">
        <Link to={`/world/${lesson.worldId}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 font-display">
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
      <PaywallDialog open={paywall} onClose={() => { setPaywall(false); navigate(-1); }} />
    </div>
  );
};

export default LessonPage;
