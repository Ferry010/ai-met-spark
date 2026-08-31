import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSparkVoice } from "@/hooks/useSparkVoice";
import { hasVoices, onVoicesChanged, speak, cancelSpeech } from "@/lib/speech";
import { Loader2, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SparkVoiceButtonProps {
  lessonId: string;
  step: string;
  /**
   * Plain text to read aloud with the browser's own voice when no
   * pre-generated Supabase audio exists. Should already be TTS-normalized.
   */
  text?: string;
  className?: string;
  variant?: "default" | "compact";
}

export const SparkVoiceButton = ({ lessonId, step, text, className, variant = "default" }: SparkVoiceButtonProps) => {
  const audio = useSparkVoice(lessonId, step);
  const [speaking, setSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(hasVoices);

  // Voices can load asynchronously; only offer browser TTS once one exists,
  // so we never show a read-aloud button that can't actually speak.
  useEffect(() => {
    setVoicesReady(hasVoices());
    return onVoicesChanged(() => setVoicesReady(hasVoices()));
  }, []);

  // Web Speech fallback is available when we have text and a usable voice.
  const canSpeak = !!text?.trim() && voicesReady;
  const available = audio.available || canSpeak;

  // Stop any browser speech if this button unmounts (e.g. step changes).
  useEffect(() => {
    return () => {
      if (speaking) cancelSpeech();
    };
  }, [speaking]);

  if (!available) return null;

  const isPlaying = audio.available ? audio.isPlaying : speaking;
  const isLoading = audio.available ? audio.isLoading : false;

  const handleClick = () => {
    if (audio.available) {
      void audio.play();
      return;
    }
    if (speaking) {
      cancelSpeech();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    void speak(text!, {
      onend: () => setSpeaking(false),
      onerror: () => setSpeaking(false),
    });
  };

  const Icon = isLoading ? Loader2 : isPlaying ? Pause : Volume2;
  const ariaLabel = isPlaying ? "Stop met voorlezen" : "Laat Spark voorlezen";
  const label = isPlaying ? "Stop" : "Lees voor";

  if (variant === "compact") {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={cn("h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary", className)}
      >
        <Icon className={cn("h-4 w-4", isLoading && "animate-spin")} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
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
