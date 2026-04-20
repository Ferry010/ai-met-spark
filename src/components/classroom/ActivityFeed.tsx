import { Award, CheckCircle2, AlertTriangle, Star, Play } from "lucide-react";
import { recentActivity } from "@/data/classroomMock";
import { cn } from "@/lib/utils";

const iconFor = (type: string) => {
  switch (type) {
    case "badge":
      return Award;
    case "lesson_completed":
      return CheckCircle2;
    case "stuck":
      return AlertTriangle;
    case "perfect_score":
      return Star;
    case "started_world":
    default:
      return Play;
  }
};

export const ActivityFeed = () => {
  return (
    <section className="rounded-xl bg-classroom-surface border border-classroom-border p-6">
      <h2 className="font-fraunces text-xl text-classroom-dark mb-4">
        Laatste activiteit in de klas
      </h2>
      <ul className="space-y-3">
        {recentActivity.map((item) => {
          const Icon = iconFor(item.type);
          return (
            <li
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg",
                item.warning ? "bg-classroom-warning/10" : "bg-classroom-bg"
              )}
            >
              <span
                className={cn(
                  "grid place-items-center h-8 w-8 rounded-full shrink-0",
                  item.warning
                    ? "bg-classroom-warning text-white"
                    : item.type === "badge"
                    ? "bg-classroom-amber text-white classroom-shimmer"
                    : item.type === "perfect_score"
                    ? "bg-classroom-amber text-white"
                    : "bg-classroom-teal text-white"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-classroom-dark">{item.text}</p>
                <p className="text-xs text-classroom-muted mt-0.5">{item.whenLabel}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
