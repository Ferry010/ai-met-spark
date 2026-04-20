import { cn } from "@/lib/utils";

export type LessonStatus = "niet_begonnen" | "bezig" | "voltooid" | "vastgelopen";

const labelMap: Record<LessonStatus, string> = {
  niet_begonnen: "Niet begonnen",
  bezig: "Bezig",
  voltooid: "Voltooid",
  vastgelopen: "Vastgelopen",
};

const styleMap: Record<LessonStatus, string> = {
  niet_begonnen: "bg-classroom-bg text-classroom-muted border-classroom-border",
  bezig: "bg-classroom-amber/15 text-classroom-amber border-classroom-amber/30",
  voltooid: "bg-classroom-success/15 text-classroom-success border-classroom-success/30",
  vastgelopen: "bg-classroom-warning/15 text-classroom-warning border-classroom-warning/30",
};

export const StatusPill = ({ status }: { status: LessonStatus }) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium",
      styleMap[status]
    )}
  >
    {labelMap[status]}
  </span>
);
