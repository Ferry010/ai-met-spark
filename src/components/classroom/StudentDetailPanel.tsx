import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BadgeDisplay } from "./BadgeDisplay";
import type { ClassroomStudent } from "@/data/classroomMock";
import { lessonTitles } from "@/data/classroomMock";
import { Download, Send } from "lucide-react";

interface Props {
  student: ClassroomStudent | null;
  onClose: () => void;
}

export const StudentDetailPanel = ({ student, onClose }: Props) => {
  const { toast } = useToast();
  const [reminderOpen, setReminderOpen] = useState(false);
  const [message, setMessage] = useState("");

  if (!student) return null;

  const open = !!student;
  const w1Done = student.lessonsCompleted >= 8;
  const w2Done = student.lessonsCompleted >= 16;
  const w3Done = student.lessonsCompleted >= 24;
  const recent = Array.from({ length: Math.min(10, student.lessonsCompleted) }, (_, i) => {
    const num = student.lessonsCompleted - i;
    return { num, title: lessonTitles[num] ?? `Les ${num}` };
  });

  const openReminder = () => {
    setMessage(
      `Hi ${student.firstName}, je bent halverwege les ${student.currentLesson}. Pak je tablet er even bij en maak hem af, je kunt het. Groetjes, juf ${"Marieke"}.`
    );
    setReminderOpen(true);
  };

  const sendReminder = () => {
    setReminderOpen(false);
    toast({
      title: "Reminder verstuurd",
      description: `${student.firstName} krijgt je bericht bij de volgende inlog.`,
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="right" className="classroom-theme w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-4 pt-2">
              <div
                className="grid place-items-center h-14 w-14 rounded-full text-white text-xl font-semibold"
                style={{ background: `hsl(${student.colorSeed}, 55%, 55%)` }}
              >
                {student.firstName.charAt(0)}
              </div>
              <div>
                <SheetTitle className="font-fraunces text-2xl">{student.firstName}</SheetTitle>
                <p className="text-sm text-classroom-muted">
                  Groep 7A, {student.age} jaar
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="rounded-lg bg-classroom-bg p-4">
              <div className="text-xs text-classroom-muted mb-1">Voortgang</div>
              <div className="flex items-baseline gap-2">
                <span className="font-fraunces text-2xl text-classroom-teal">
                  {student.lessonsCompleted}
                </span>
                <span className="text-classroom-muted">van 24 lessen</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-classroom-border overflow-hidden">
                <div
                  className="h-full bg-classroom-teal transition-all duration-700"
                  style={{ width: `${(student.lessonsCompleted / 24) * 100}%` }}
                />
              </div>
              <p className="text-xs text-classroom-muted mt-2">
                Bezig met les {student.currentLesson}
                {student.stuckOnLesson && (
                  <span className="ml-2 text-classroom-warning font-medium">
                    Vastgelopen op les {student.stuckOnLesson}
                  </span>
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-classroom-dark mb-3">Badges</h3>
              <div className="flex justify-around">
                <BadgeDisplay kind="schild" earned={w1Done} />
                <BadgeDisplay kind="kompas" earned={w2Done} />
                <BadgeDisplay kind="ster" earned={w3Done} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-classroom-dark mb-3">
                Laatste lessen
              </h3>
              {recent.length === 0 ? (
                <p className="text-sm text-classroom-muted">Nog geen lessen voltooid.</p>
              ) : (
                <ul className="space-y-2">
                  {recent.map((r) => (
                    <li
                      key={r.num}
                      className="flex items-center justify-between text-sm py-2 border-b border-classroom-border last:border-0"
                    >
                      <span className="text-classroom-dark">
                        Les {r.num}, {r.title}
                      </span>
                      <span className="text-xs text-classroom-muted">voltooid</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={openReminder}
                className="border-classroom-teal text-classroom-teal hover:bg-classroom-teal/10"
              >
                <Send className="h-4 w-4 mr-2" /> Stuur reminder
              </Button>
              <Button
                onClick={() =>
                  toast({ title: "Binnenkort", description: "Rapport-PDF is in de maak." })
                }
                className="bg-classroom-teal hover:bg-classroom-teal-dark text-white"
              >
                <Download className="h-4 w-4 mr-2" /> Download rapport
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent className="classroom-theme">
          <DialogHeader>
            <DialogTitle className="font-fraunces">
              Stuur reminder naar {student.firstName}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="font-dm-sans"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReminderOpen(false)}>
              Annuleren
            </Button>
            <Button
              onClick={sendReminder}
              className="bg-classroom-teal hover:bg-classroom-teal-dark text-white"
            >
              Verstuur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
