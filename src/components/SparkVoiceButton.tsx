import { Button } from "@/components/ui/button";
import { useSparkVoice } from "@/hooks/useSparkVoice";
import { Loader2, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SparkVoiceButtonProps {
  lessonId: string;
  step: string;
  className?: string;
  variant?: "default" | "compact";
}

export const SparkVoiceButton = ({ lessonId, step, className, variant = "default" }: SparkVoiceButtonProps) => {
  const { play, isPlaying, isLoading, available } = useSparkVoice(lessonId, step);
  if (!available) return null;

  const Icon = isLoading ? Loader2 : isPlaying ? Pause : Volume2;
  const label = isPlaying ? "Pauzeer" : "Laat Spark voorlezen";

  if (variant === "compact") {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={play}
        aria-label={label}
        className={cn("h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary", className)}
      >
        <Icon className={cn("h-4 w-4", isLoading && "animate-spin")} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={play}
      variant="outline"
      size="sm"
      className={cn(
        "rounded-full font-display gap-2 border-primary/30 text-primary hover:bg-primary/10",
        isPlaying && "bg-primary/10",
        className,
      )}
    >
      <Icon className={cn("h-4 w-4", isLoading && "animate-spin")} />
      {label}
    </Button>
  );
};
