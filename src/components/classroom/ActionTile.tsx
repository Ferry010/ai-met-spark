import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: ReactNode;
  title: string;
  body: string;
  cta: string;
  onClick?: () => void;
  highlight?: boolean;
}

export const ActionTile = ({ icon, title, body, cta, onClick, highlight }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 w-full",
        highlight
          ? "bg-classroom-teal text-white border-classroom-teal-dark"
          : "bg-classroom-surface border-classroom-border"
      )}
    >
      <div
        className={cn(
          "grid place-items-center h-10 w-10 rounded-lg mb-3",
          highlight ? "bg-white/20 text-white" : "bg-classroom-teal/10 text-classroom-teal"
        )}
      >
        {icon}
      </div>
      <h3
        className={cn(
          "font-fraunces text-lg mb-1",
          highlight ? "text-white" : "text-classroom-dark"
        )}
      >
        {title}
      </h3>
      <p className={cn("text-sm mb-3", highlight ? "text-white/85" : "text-classroom-muted")}>
        {body}
      </p>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium",
          highlight ? "text-white" : "text-classroom-teal"
        )}
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
};
