import { cn } from "@/lib/utils";
import type { ClassroomStudent } from "@/data/classroomMock";

interface Props {
  student: ClassroomStudent;
  onClick?: () => void;
  size?: number;
}

export const StudentAvatar = ({ student, onClick, size = 48 }: Props) => {
  const pct = Math.round((student.lessonsCompleted / 24) * 100);
  const radius = size / 2 - 3;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const initial = student.firstName.charAt(0).toUpperCase();
  const hue = student.colorSeed;
  const stuck = !!student.stuckOnLesson;

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group relative grid place-items-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-teal focus-visible:ring-offset-2"
      )}
      style={{ width: size, height: size }}
      aria-label={`${student.firstName}, ${student.lessonsCompleted} van 24 lessen`}
    >
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--classroom-border))"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stuck ? "hsl(var(--classroom-warning))" : "hsl(var(--classroom-teal))"}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="classroom-ring-anim"
          style={{ ["--ring-circ" as never]: circ }}
        />
      </svg>
      <span
        className="grid place-items-center rounded-full font-medium text-white"
        style={{
          width: size - 12,
          height: size - 12,
          background: `hsl(${hue}, 55%, 55%)`,
          fontSize: size * 0.35,
        }}
      >
        {initial}
      </span>
      {stuck && (
        <span className="absolute -top-1 -right-1 grid place-items-center h-4 w-4 rounded-full bg-classroom-warning text-white text-[10px] font-bold">
          !
        </span>
      )}
    </button>
  );
};
