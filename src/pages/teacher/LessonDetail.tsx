import { Link, useParams } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { ChevronLeft, Construction } from "lucide-react";
import { lessonTitles } from "@/data/classroomMock";

const LessonDetail = () => {
  const { worldId, lessonId } = useParams();
  const num = Number(lessonId);
  const title = lessonTitles[num] ?? `Les ${num}`;
  return (
    <ClassroomLayout>
      <Link
        to={`/teacher/world/${worldId}`}
        className="inline-flex items-center text-sm text-classroom-muted hover:text-classroom-teal mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Terug naar wereld {worldId}
      </Link>
      <div className="text-xs text-classroom-muted mb-2">
        Wereld {worldId} / Les {num}
      </div>
      <h1 className="font-fraunces text-3xl text-classroom-dark mb-4">{title}</h1>
      <div className="rounded-xl border border-dashed border-classroom-border bg-classroom-surface p-12 text-center">
        <Construction className="h-10 w-10 text-classroom-amber mx-auto mb-4" />
        <h2 className="font-fraunces text-xl mb-2">Binnenkort beschikbaar</h2>
        <p className="text-classroom-muted max-w-md mx-auto">
          Hier zie je straks het lesmateriaal, de voortgang per leerling en de klassikale
          presentatie. We bouwen dit in iteratie 2.
        </p>
      </div>
    </ClassroomLayout>
  );
};

export default LessonDetail;
