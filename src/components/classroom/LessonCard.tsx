import { Link } from "react-router-dom";
import { BookOpen, Users, FileText } from "lucide-react";
import { students, type ClassroomWorldId } from "@/data/classroomMock";

interface Props {
  worldId: ClassroomWorldId;
  lessonNumber: number;
  title: string;
}

export const LessonCard = ({ worldId, lessonNumber, title }: Props) => {
  const completed = students.filter((s) => s.lessonsCompleted >= lessonNumber).length;
  const inProgress = students.filter((s) => s.currentLesson === lessonNumber).length;
  const total = students.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <Link
      to={`/teacher/world/${worldId}/lesson/${lessonNumber}`}
      className="rounded-xl bg-classroom-surface border border-classroom-border p-5 hover:shadow-md transition-all flex flex-col"
    >
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-semibold text-classroom-muted">
          LES {lessonNumber}
        </span>
        <span className="text-xs text-classroom-muted">{completed}/{total} klaar</span>
      </div>
      <h3 className="font-fraunces text-lg text-classroom-dark mb-3">{title}</h3>

      <div className="h-2 rounded-full bg-classroom-bg overflow-hidden mb-3">
        <div
          className="h-full bg-classroom-teal transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-3 text-xs text-classroom-muted mb-4">
        <span className="inline-flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" /> Materiaal
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {inProgress} bezig
        </span>
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" /> Print
        </span>
      </div>

      <span className="mt-auto text-sm font-medium text-classroom-teal">
        Les openen →
      </span>
    </Link>
  );
};
