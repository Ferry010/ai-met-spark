import { Shield, Compass, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeKind = "schild" | "kompas" | "ster";

const meta: Record<BadgeKind, { Icon: typeof Shield; label: string }> = {
  schild: { Icon: Shield, label: "Schild van Waakzaamheid" },
  kompas: { Icon: Compass, label: "Kompas der Wijsheid" },
  ster: { Icon: Star, label: "Ster van de Doorzetter" },
};

export const BadgeDisplay = ({ kind, earned }: { kind: BadgeKind; earned: boolean }) => {
  const { Icon, label } = meta[kind];
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={cn(
          "grid place-items-center h-16 w-16 rounded-full transition-all",
          earned
            ? "bg-classroom-amber text-white classroom-shimmer"
            : "bg-classroom-bg text-classroom-muted/40 border border-classroom-border"
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      <div
        className={cn(
          "text-xs mt-2 font-medium",
          earned ? "text-classroom-dark" : "text-classroom-muted"
        )}
      >
        {label}
      </div>
    </div>
  );
};
