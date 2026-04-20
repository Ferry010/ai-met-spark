import { Link } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { ChevronLeft, Construction } from "lucide-react";

const LessonDemo = () => {
  return (
    <ClassroomLayout>
      <Link
        to="/teacher"
        className="inline-flex items-center text-sm text-classroom-muted hover:text-classroom-teal mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Terug naar dashboard
      </Link>
      <h1 className="font-fraunces text-3xl text-classroom-dark mb-2">
        Bekijk zelf hoe de lessen werken
      </h1>
      <p className="text-classroom-muted mb-6">
        Doorloop les 1 als leerling en ervaar de tap-sort en quiz.
      </p>
      <div className="rounded-xl border border-dashed border-classroom-border bg-classroom-surface p-12 text-center">
        <Construction className="h-10 w-10 text-classroom-amber mx-auto mb-4" />
        <h2 className="font-fraunces text-xl mb-2">Demo modus komt er aan</h2>
        <p className="text-classroom-muted max-w-md mx-auto">
          Je kunt nu al via de admin-omgeving alle lessen doorlopen. De aparte demo voor
          docenten bouwen we in iteratie 2.
        </p>
      </div>
    </ClassroomLayout>
  );
};

export default LessonDemo;
