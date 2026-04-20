import { worldProgress, WORLDS, type ClassroomWorldId } from "@/data/classroomMock";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const worldColorClass: Record<ClassroomWorldId, string> = {
  1: "bg-world-1 text-white",
  2: "bg-world-2 text-white",
  3: "bg-world-3 text-white",
};

export const ProgressJourney = () => {
  const data = WORLDS.map((w) => ({ ...w, ...worldProgress(w.id) }));
  // Determine current world (first not 100%)
  const currentIdx = data.findIndex((w) => w.completedAvg < 100);
  const current = currentIdx === -1 ? 2 : currentIdx;

  return (
    <section className="mb-10 rounded-xl bg-classroom-surface border border-classroom-border p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-2">
        {data.map((w, i) => {
          const isDone = w.completedAvg === 100;
          const isCurrent = i === current;
          const isFuture = i > current;
          return (
            <div
              key={w.id}
              className="flex md:flex-col items-center gap-4 md:gap-3 md:flex-1"
            >
              <div className="flex md:flex-col items-center gap-3 md:gap-2">
                <div
                  className={cn(
                    "relative grid place-items-center h-16 w-16 md:h-20 md:w-20 rounded-full transition-all",
                    isDone && "bg-classroom-success text-white",
                    isCurrent && worldColorClass[w.id],
                    isFuture && "bg-classroom-bg border-2 border-classroom-border text-classroom-muted",
                    isCurrent && "ring-4 ring-classroom-teal/25"
                  )}
                >
                  {isDone ? (
                    <Check className="h-8 w-8" />
                  ) : (
                    <span className="text-2xl">{w.emoji}</span>
                  )}
                </div>
                <div className="md:text-center">
                  <div className="font-fraunces font-semibold text-classroom-dark">
                    {w.name}
                  </div>
                  <div className="text-xs text-classroom-muted">{w.completedAvg}% klas</div>
                </div>
              </div>
              {i < data.length - 1 && (
                <div className="flex-1 hidden md:block h-1 rounded-full bg-classroom-border overflow-hidden">
                  <div
                    className="h-full bg-classroom-teal transition-all duration-700"
                    style={{ width: `${Math.min(100, w.completedAvg)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
