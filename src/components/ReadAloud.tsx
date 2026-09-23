import { useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { cancelSpeech, hasVoices, onVoicesChanged, speak } from "@/lib/speech";
import { normalizeTtsText } from "@/lib/tts";
import { cn } from "@/lib/utils";

/**
 * Free read-aloud using the browser's own voice (no audio files, no cost).
 * Hidden when the device has no usable voice.
 */
export const ReadAloud = ({ text, className, label = true }: { text: string; className?: string; label?: boolean }) => {
  const [ready, setReady] = useState(hasVoices);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setReady(hasVoices());
    return onVoicesChanged(() => setReady(hasVoices()));
  }, []);

  useEffect(() => () => cancelSpeech(), [text]);

  if (!ready) return null;

  const toggle = () => {
    if (speaking) {
      cancelSpeech();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    void speak(normalizeTtsText(text) ?? text, {
      onend: () => setSpeaking(false),
      onerror: () => setSpeaking(false),
    });
  };

  const Icon = speaking ? Square : Volume2;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={speaking ? "Stop met voorlezen" : "Laat Spark voorlezen"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-card px-3 h-9 text-sm font-medium text-foreground/80 hover:bg-muted transition-colors",
        speaking && "border-primary text-primary",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      {label && (speaking ? "Stop" : "Lees voor")}
    </button>
  );
};

export default ReadAloud;
