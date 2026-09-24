import { Link } from "react-router-dom";
import { ArrowRight, Inbox } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MissionBar, StatTile, fmtWhen } from "@/components/admin/shared";
import { useAdminOverview, useAdminSchools, useSchoolRequests } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";

const AdminOverview = () => {
  const { data: o, isLoading } = useAdminOverview();
  const { data: schools = [] } = useAdminSchools();
  const { data: requests = [] } = useSchoolRequests();
  const open = requests.filter((r) => r.status === "new");

  return (
    <AdminLayout>
      <h1 className="mb-6 text-4xl">Overzicht</h1>

      {isLoading || !o ? (
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatTile label="Scholen" value={o.schools} sub={`${o.teachers} leerkrachten · ${o.classes} klassen`} />
            <StatTile label="Kids in een klas" value={o.classKids} />
            <StatTile label="Kids thuis" value={o.homeKids} sub="zonder klas" />
            <StatTile label="Actief deze week" value={o.active7d} />
            <StatTile label="Missies gespeeld" value={o.missionsDone.toLocaleString("nl-NL")} />
            <StatTile label="Diploma's" value={o.diplomas} />
            <StatTile label="Open aanvragen" value={o.openRequests} tone={o.openRequests ? "text-accent-dark" : undefined} />
            <StatTile label="Open uitnodigingen" value={o.openInvites} sub="nog niet gebruikt" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="tile p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl">
                  <Inbox className="h-5 w-5 text-accent" /> Nieuwe aanvragen
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin/aanvragen">
                    Alles <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {open.length === 0 ? (
                <p className="text-sm text-classroom-muted">Geen open aanvragen.</p>
              ) : (
                <ul className="divide-y divide-classroom-border">
                  {open.slice(0, 5).map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <div className="font-semibold">{r.school_name}</div>
                        <div className="text-sm text-classroom-muted">
                          {r.city} · {r.contact_name} · {fmtWhen(r.created_at)}
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link to="/admin/aanvragen">Bekijk</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="tile p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl">Scholen</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin/scholen">
                    Alles <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {schools.length === 0 ? (
                <p className="text-sm text-classroom-muted">Nog geen scholen aangesloten.</p>
              ) : (
                <ul className="divide-y divide-classroom-border">
                  {[...schools]
                    .sort((a, b) => b.kidCount - a.kidCount)
                    .slice(0, 6)
                    .map((s) => (
                      <li key={s.id}>
                        <Link to={`/admin/scholen/${s.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
                          <div>
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-sm text-classroom-muted">
                              {s.kidCount} kids · {s.active7d} actief deze week
                            </div>
                          </div>
                          <MissionBar avg={s.avgMissions} />
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminOverview;
