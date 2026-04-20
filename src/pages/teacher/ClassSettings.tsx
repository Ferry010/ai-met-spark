import { Link } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { ChevronLeft, Construction } from "lucide-react";
import { className, classCode, students } from "@/data/classroomMock";

const ClassSettings = () => {
  return (
    <ClassroomLayout>
      <Link
        to="/teacher"
        className="inline-flex items-center text-sm text-classroom-muted hover:text-classroom-teal mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Terug naar dashboard
      </Link>
      <h1 className="font-fraunces text-3xl text-classroom-dark mb-2">Klasinstellingen</h1>
      <p className="text-classroom-muted mb-6">{className}, {students.length} leerlingen</p>

      <div className="rounded-xl bg-classroom-surface border border-classroom-border p-6 mb-6">
        <h2 className="font-fraunces text-lg mb-2">Klas-code</h2>
        <p className="text-sm text-classroom-muted mb-3">
          Deel deze code met je leerlingen om in te loggen.
        </p>
        <div className="font-mono text-2xl tracking-wider bg-classroom-bg rounded-lg px-4 py-3 inline-block text-classroom-teal">
          {classCode}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-classroom-border bg-classroom-surface p-12 text-center">
        <Construction className="h-10 w-10 text-classroom-amber mx-auto mb-4" />
        <h2 className="font-fraunces text-xl mb-2">Volledige klasbeheer komt er aan</h2>
        <p className="text-classroom-muted max-w-md mx-auto">
          Leerlingen toevoegen of verwijderen, QR-code voor de klas en diploma's downloaden,
          dat bouwen we in iteratie 2.
        </p>
      </div>
    </ClassroomLayout>
  );
};

export default ClassSettings;
