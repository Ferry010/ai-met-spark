import { Link, useParams, Navigate } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { LessonCard } from "@/components/classroom/LessonCard";
import {
  WORLDS,
  lessonsInWorld,
  worldProgress,
  lessonTitles,
  type ClassroomWorldId,
} from "@/data/classroomMock";
import { ChevronLeft } from "lucide-react";

const WorldDetail = () => {
  const { id } = useParams();
  const worldId = Number(id) as ClassroomWorldId;
  if (![1, 2, 3].includes(worldId)) return <Navigate to="/teacher" replace />;

  const world = WORLDS.find((w) => w.id === worldId)!;
  const lessons = lessonsInWorld(worldId);
  const progress = worldProgress(worldId);
  const colorVar = `hsl(var(--world-${worldId}))`;

  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress.completedAvg / 100) * circ;

  return (
    <ClassroomLayout>
      <Link
        to="/teacher"
        className="inline-flex items-center text-sm text-classroom-muted hover:text-classroom-teal mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Terug naar dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
        <div className="relative grid place-items-center" style={{ width: 140, height: 140 }}>
          <svg className="absolute inset-0 -rotate-90" width={140} height={140}>
            <circle cx={70} cy={70} r={radius} fill="none" stroke="hsl(var(--classroom-border))" strokeWidth={10} />
            <circle
              cx={70}
              cy={70}
              r={radius}
              fill="none"
              stroke={colorVar}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className="classroom-ring-anim"
              style={{ ["--ring-circ" as never]: circ }}
            />
          </svg>
          <div className="text-center">
            <div className="text-3xl">{world.emoji}</div>
            <div className="font-fraunces text-xl" style={{ color: colorVar }}>
              {progress.completedAvg}%
            </div>
          </div>
        </div>

        <div>
          <div
            className="inline-block text-xs font-semibold tracking-wide px-2 py-1 rounded-md mb-2"
            style={{ color: colorVar, backgroundColor: `hsl(var(--world-${worldId}) / 0.12)` }}
          >
            WERELD {worldId}
          </div>
          <h1 className="font-fraunces text-4xl md:text-5xl mb-2" style={{ color: colorVar }}>
            {world.name}
          </h1>
          <p className="text-classroom-muted text-lg">{world.tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {lessons.map((n) => (
          <LessonCard
            key={n}
            worldId={worldId}
            lessonNumber={n}
            title={lessonTitles[n] ?? `Les ${n}`}
          />
        ))}
      </div>
    </ClassroomLayout>
  );
};

export default WorldDetail;
