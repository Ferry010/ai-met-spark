import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { useClassroom } from "@/hooks/useClassroom";
import { Settings, Users, TrendingUp, KeyRound } from "lucide-react";

const fmtWhen = (iso: string | null): string => {
  if (!iso) return "nog niet gestart";
  const d = new Date(iso);
  const diffH = (Date.now() - d.getTime()) / 3_600_000;
  if (diffH < 1) return "zojuist";
  if (diffH < 24) return `${Math.floor(diffH)} uur geleden`;
  const days = Math.floor(diffH / 24);
  return days === 1 ? "gisteren" : `${days} dagen geleden`;
};

const ClassroomDashboard = () => {
  const navigate = useNavigate();
  const { class: myClass, students, overallPct, totalLessons, isLoading } = useClassroom();

  // A teacher with no class yet is sent to onboarding to create one.
  useEffect(() => {
    if (!isLoading && myClass === null) navigate("/teacher/start", { replace: true });
  }, [isLoading, myClass, navigate]);

  if (isLoading || !myClass) {
    return (
      <ClassroomLayout>
        <div className="py-20 text-center text-classroom-muted">Laden…</div>
      </ClassroomLayout>
    );
  }

  return (
    <ClassroomLayout>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-fraunces text-3xl text-classroom-dark">{myClass.class_name}</h1>
          <p className="text-classroom-muted">{students.length} leerlingen</p>
        </div>
        <Link
          to="/teacher/class/settings"
          className="inline-flex items-center gap-2 text-sm text-classroom-teal hover:underline"
        >
          <Settings className="h-4 w-4" /> Klasinstellingen
        </Link>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl bg-classroom-surface border border-classroom-border p-5">
          <div className="flex items-center gap-2 text-classroom-muted text-sm mb-1"><Users className="h-4 w-4" /> Leerlingen</div>
          <div className="font-fraunces text-3xl text-classroom-dark">{students.length}</div>
        </div>
        <div className="rounded-xl bg-classroom-surface border border-classroom-border p-5">
          <div className="flex items-center gap-2 text-classroom-muted text-sm mb-1"><TrendingUp className="h-4 w-4" /> Gemiddelde voortgang</div>
          <div className="font-fraunces text-3xl text-classroom-dark">{overallPct}%</div>
        </div>
        <div className="rounded-xl bg-classroom-surface border border-classroom-border p-5">
          <div className="flex items-center gap-2 text-classroom-muted text-sm mb-1"><KeyRound className="h-4 w-4" /> Klassencode</div>
          <div className="font-mono text-2xl tracking-wider text-classroom-teal">{myClass.class_code ?? "—"}</div>
        </div>
      </div>

      {/* Student roster */}
      <div className="rounded-xl bg-classroom-surface border border-classroom-border overflow-hidden">
        <div className="px-5 py-4 border-b border-classroom-border">
          <h2 className="font-fraunces text-lg text-classroom-dark">Leerlingen</h2>
        </div>

        {students.length === 0 ? (
          <div className="px-5 py-12 text-center text-classroom-muted">
            Nog geen leerlingen. Deel je klassencode{" "}
            <span className="font-mono text-classroom-teal">{myClass.class_code}</span> zodat ze zich kunnen aanmelden.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-classroom-muted border-b border-classroom-border">
                  <th className="px-5 py-3 font-medium">Naam</th>
                  <th className="px-5 py-3 font-medium">Voortgang</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Bezig met</th>
                  <th className="px-5 py-3 font-medium">Level</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Laatst actief</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const pct = Math.round((s.lessonsCompleted / totalLessons) * 100);
                  const finished = s.lessonsCompleted >= totalLessons;
                  const currentLabel = finished ? "Klaar 🎉" : lessonLabel(s.currentLesson);
                  return (
                    <tr key={s.id} className="border-b border-classroom-border/60 last:border-0">
                      <td className="px-5 py-3 font-medium text-classroom-dark">{s.firstName}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-28 rounded-full bg-classroom-bg overflow-hidden">
                            <div className="h-full bg-classroom-teal" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-classroom-muted tabular-nums">{s.lessonsCompleted}/{totalLessons}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-classroom-muted hidden sm:table-cell">{currentLabel}</td>
                      <td className="px-5 py-3 text-classroom-dark">Lv {s.level}</td>
                      <td className="px-5 py-3 text-classroom-muted hidden md:table-cell">{fmtWhen(s.lastActive)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ClassroomLayout>
  );
};

// Map a 1-based lesson position to a friendly "Wereld X · les Y" label.
const lessonLabel = (pos: number): string => {
  const world = Math.floor((pos - 1) / 8) + 1;
  const inWorld = ((pos - 1) % 8) + 1;
  return `Wereld ${world} · les ${inWorld}`;
};

export default ClassroomDashboard;
