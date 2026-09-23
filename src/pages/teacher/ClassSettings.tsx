import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Copy, Check, Plus, ShieldCheck } from "lucide-react";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { useClassroom } from "@/hooks/useClassroom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ClassSettings = () => {
  const { classes, class: current, selectClass, createClass, isCreating, isLoading } = useClassroom();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [name, setName] = useState("");

  const copy = async (code: string | null) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createClass(name.trim());
      setName("");
      toast({ title: `Klas ${name.trim()} aangemaakt` });
    } catch (err: any) {
      toast({ title: "Aanmaken lukte niet", description: err.message, variant: "destructive" });
    }
  };

  return (
    <ClassroomLayout>
      <Link to="/teacher" className="mb-6 inline-flex items-center text-sm text-classroom-muted hover:text-primary">
        <ChevronLeft className="mr-1 h-4 w-4" /> Terug naar je klas
      </Link>
      <h1 className="mb-6 text-4xl">Je klassen</h1>

      {isLoading ? (
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-3">
            {classes.map((c) => (
              <div
                key={c.school_id}
                className={cn("tile flex flex-wrap items-center justify-between gap-4 p-5", current?.school_id === c.school_id && "border-primary")}
              >
                <div>
                  <div className="font-display text-2xl">{c.class_name}</div>
                  <div className="text-sm text-classroom-muted">{c.student_count} leerlingen</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-primary-soft px-3 py-2 font-mono text-lg tracking-wider text-primary-dark">{c.class_code}</span>
                  <Button variant="outline" size="icon" onClick={() => copy(c.class_code)} aria-label="Kopieer code">
                    {copied === c.class_code ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
                  </Button>
                  {current?.school_id !== c.school_id && (
                    <Button asChild variant="ghost" size="sm" onClick={() => selectClass(c.school_id)}>
                      <Link to="/teacher">Open</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <form onSubmit={add} className="tile flex flex-wrap items-end gap-3 p-5">
              <div className="min-w-[200px] flex-1">
                <label htmlFor="new-class" className="mb-2 block font-display">Nieuwe klas</label>
                <Input id="new-class" value={name} onChange={(e) => setName(e.target.value)} placeholder="bijv. Groep 8B" className="h-12 rounded-xl" />
              </div>
              <Button type="submit" disabled={isCreating || !name.trim()}>
                <Plus className="h-4 w-4" /> Klas aanmaken
              </Button>
            </form>
          </div>

          <aside className="tile h-fit p-5">
            <h2 className="mb-2 flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-success" /> Privacy
            </h2>
            <p className="text-sm text-classroom-muted">
              Je ziet alleen leerlingen die zich met jouw klassencode aanmelden. Andere klassen en leerlingen zijn nooit zichtbaar. Van elke
              leerling zie je voornaam, gebruikersnaam en voortgang.
            </p>
            <h3 className="mb-1 mt-5 font-display text-lg">Zo doen leerlingen mee</h3>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-classroom-muted">
              <li>Ga naar aimetspark.nl</li>
              <li>Kies Account maken en daarna Ik heb een klassencode</li>
              <li>Vul de code in en kies een gebruikersnaam</li>
            </ol>
            <p className="mt-3 text-sm text-classroom-muted">Heeft een leerling al een account? Die vult de code in bij Account en klas.</p>
          </aside>
        </div>
      )}
    </ClassroomLayout>
  );
};

export default ClassSettings;
