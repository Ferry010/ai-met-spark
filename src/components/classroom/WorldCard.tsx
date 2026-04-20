import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { lessonsInWorld, students, worldProgress, type ClassroomWorldId } from "@/data/classroomMock";

interface Props {
  worldId: ClassroomWorldId;
  name: string;
  tagline: string;
  emoji: string;
}

const colorVar = (id: ClassroomWorldId) => `var(--world-${id})`;

export const WorldCard = ({ worldId, name, tagline, emoji }: Props) => {
  const progress = worldProgress(worldId);
  const lessons = lessonsInWorld(worldId);
  const total = students.length;

  return (
    <Link
      to={`/teacher/world/${worldId}`}
      className="group rounded-xl bg-classroom-surface border border-classroom-border p-6 hover:shadow-lg transition-all flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="grid place-items-center h-12 w-12 rounded-lg text-2xl"
          style={{ backgroundColor: `hsl(${colorVar(worldId)} / 0.12)` }}
        >
          {emoji}
        </div>
        <span
          className="text-xs font-semibold tracking-wide px-2 py-1 rounded-md"
          style={{
            color: `hsl(${colorVar(worldId)})`,
            backgroundColor: `hsl(${colorVar(worldId)} / 0.12)`,
          }}
        >
          WERELD {worldId}
        </span>
      </div>

      <h3 className="font-fraunces text-2xl mb-1" style={{ color: `hsl(${colorVar(worldId)})` }}>
        {name}
      </h3>
      <p className="text-sm text-classroom-muted mb-5 flex-1">{tagline}</p>

      <div className="text-xs text-classroom-muted mb-2">
        {progress.lessonsDoneByClass} van 8 lessen volledig door de klas afgerond
      </div>

      {/* Mini stacked bar per lesson */}
      <div className="flex gap-1 h-12 mb-4">
        {progress.perLesson.map((p, i) => {
          const completedPct = (p.completed / total) * 100;
          const currentPct = (p.current / total) * 100;
          return (
            <div
              key={lessons[i]}
              className="flex-1 rounded-md bg-classroom-bg overflow-hidden flex flex-col-reverse"
              title={`Les ${lessons[i]}: ${p.completed} klaar, ${p.current} bezig`}
            >
              <div
                style={{
                  height: `${completedPct}%`,
                  backgroundColor: `hsl(${colorVar(worldId)})`,
                }}
              />
              <div
                style={{
                  height: `${currentPct}%`,
                  backgroundColor: `hsl(${colorVar(worldId)} / 0.4)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
        style={{ color: `hsl(${colorVar(worldId)})` }}
      >
        Bekijk wereld <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
};
