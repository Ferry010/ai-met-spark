import { useState } from "react";
import { Link } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { ChevronLeft, Copy, Check } from "lucide-react";
import { useClassroom } from "@/hooks/useClassroom";

const ClassSettings = () => {
  const { class: myClass, students, isLoading } = useClassroom();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!myClass?.class_code) return;
    try {
      await navigator.clipboard.writeText(myClass.class_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <ClassroomLayout>
      <Link
        to="/teacher"
        className="inline-flex items-center text-sm text-classroom-muted hover:text-classroom-teal mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Terug naar dashboard
      </Link>

      {isLoading || !myClass ? (
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      ) : (
        <>
          <h1 className="font-fraunces text-3xl text-classroom-dark mb-2">Klasinstellingen</h1>
          <p className="text-classroom-muted mb-6">
            {myClass.class_name}, {students.length} leerlingen
          </p>

          <div className="rounded-xl bg-classroom-surface border border-classroom-border p-6 mb-6 max-w-lg">
            <h2 className="font-fraunces text-lg mb-2">Klassencode</h2>
            <p className="text-sm text-classroom-muted mb-4">
              Leerlingen vullen deze code in bij het aanmelden om bij jouw klas te horen.
            </p>
            <div className="flex items-center gap-3">
              <div className="font-mono text-2xl tracking-wider bg-classroom-bg rounded-lg px-4 py-3 text-classroom-teal flex-1 text-center">
                {myClass.class_code ?? "—"}
              </div>
              <button
                onClick={copyCode}
                aria-label="Kopieer code"
                className="h-12 w-12 grid place-items-center rounded-lg border border-classroom-border hover:bg-classroom-bg text-classroom-dark"
              >
                {copied ? <Check className="h-5 w-5 text-classroom-success" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-classroom-border bg-classroom-surface p-6 max-w-lg">
            <h2 className="font-fraunces text-lg mb-2">Privacy</h2>
            <p className="text-sm text-classroom-muted">
              Je ziet alleen leerlingen die zich met jouw klassencode hebben aangemeld. Andere klassen en
              leerlingen zijn nooit zichtbaar. We bewaren van elke leerling alleen een voornaam, leeftijd,
              ouder-e-mail en de lesvoortgang.
            </p>
          </div>
        </>
      )}
    </ClassroomLayout>
  );
};

export default ClassSettings;
