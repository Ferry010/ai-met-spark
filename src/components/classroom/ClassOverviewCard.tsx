import { useState } from "react";
import { className, students, type ClassroomStudent } from "@/data/classroomMock";
import { StudentAvatar } from "./StudentAvatar";
import { StudentDetailPanel } from "./StudentDetailPanel";

export const ClassOverviewCard = () => {
  const [selected, setSelected] = useState<ClassroomStudent | null>(null);

  return (
    <section className="rounded-xl bg-classroom-surface border border-classroom-border p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-fraunces text-xl text-classroom-dark">
          {className}
        </h2>
        <span className="text-sm text-classroom-muted">{students.length} leerlingen</span>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-3">
        {students.map((s) => (
          <StudentAvatar key={s.id} student={s} onClick={() => setSelected(s)} />
        ))}
      </div>
      <p className="mt-4 text-xs text-classroom-muted">
        Klik op een avatar voor details, badges en voortgang.
      </p>
      <StudentDetailPanel student={selected} onClose={() => setSelected(null)} />
    </section>
  );
};
