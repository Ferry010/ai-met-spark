import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LessonRunner } from "@/components/LessonRunner";
import { ALL_LESSONS, type Lesson, getNextLesson } from "@/content/lessons";
import { ChevronRight, X } from "lucide-react";

interface LessonPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  startLesson: Lesson | null;
  /** When true, "Volgende les →" cycles through ALL_LESSONS. */
  walkthrough?: boolean;
}

type Step = "intro" | "fact" | "interactive" | "quiz" | "done";
const STEPS: Step[] = ["intro", "fact", "interactive", "quiz", "done"];

export const LessonPreviewDialog = ({ open, onClose, startLesson, walkthrough }: LessonPreviewDialogProps) => {
  const [current, setCurrent] = useState<Lesson | null>(startLesson);
  const [jumpTo, setJumpTo] = useState<Step | undefined>();

  // Sync the dialog's current lesson with whatever the parent opens.
  // Use a key on LessonRunner via lesson.id so its state resets cleanly.
  if (open && startLesson && (!current || current.id !== startLesson.id)) {
    setCurrent(startLesson);
    setJumpTo(undefined);
  }

  if (!current) return null;

  const next = walkthrough ? getNextLesson(current.id) : undefined;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] p-0 max-h-[92vh] overflow-hidden flex flex-col">
        {/* Admin toolbar */}
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2 text-xs font-display flex-wrap">
          <span className="px-2 py-1 rounded-full bg-primary/15 text-primary">Preview · Les {current.id}</span>
          <span className="text-muted-foreground truncate">{current.title}</span>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-muted-foreground">Spring:</span>
            {STEPS.map((s) => (
              <Button
                key={s}
                size="sm"
                variant="ghost"
                className="h-7 text-xs rounded-full"
                onClick={() => setJumpTo(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          <LessonRunner
            key={current.id}
            lesson={current}
            preview
            jumpToStep={jumpTo}
            renderDoneCta={() =>
              next ? (
                <Button
                  onClick={() => {
                    setJumpTo(undefined);
                    setCurrent(next);
                  }}
                  className="h-14 px-8 rounded-full font-display bg-primary shadow-soft gap-2"
                >
                  Volgende les <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={onClose} className="h-14 px-8 rounded-full font-display">
                  Sluit preview
                </Button>
              )
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonPreviewDialog;
