import { Link } from "react-router-dom";
import { AlertTriangle, UserMinus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fmtWhen } from "@/components/admin/shared";
import { useAdminActions, useAdminClasses, useAdminSchools, useAdminTeachers, type AdminTeacher } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AdminTeachers = () => {
  const { data: teachers = [], isLoading } = useAdminTeachers();
  const { data: schools = [] } = useAdminSchools();
  const { data: looseClasses = [] } = useAdminClasses(null);
  const actions = useAdminActions();
  const { toast } = useToast();

  const unassigned = teachers.filter((t) => !t.organizationId);
  const assigned = teachers.filter((t) => t.organizationId);

  const assign = async (t: AdminTeacher, orgId: string) => {
    try {
      await actions.assignTeacher({ userId: t.userId, orgId });
      toast({ title: `${t.firstName ?? t.email} gekoppeld aan ${schools.find((s) => s.id === orgId)?.name}` });
    } catch (e: any) {
      toast({ title: "Dat lukte niet", description: e.message, variant: "destructive" });
    }
  };

  const remove = async (t: AdminTeacher) => {
    const name = t.firstName ?? t.email;
    if (!window.confirm(`${name} is dan geen leerkracht meer. De klassen en de voortgang van de kids blijven bestaan. Doorgaan?`)) return;
    try {
      await actions.removeTeacher(t.userId);
      toast({ title: `${name} is geen leerkracht meer` });
    } catch (e: any) {
      toast({ title: "Dat lukte niet", description: e.message, variant: "destructive" });
    }
  };

  const Row = ({ t }: { t: AdminTeacher }) => (
    <tr className="border-b border-classroom-border/70 last:border-0">
      <td className="px-4 py-3">
        <div className="font-semibold">{t.firstName ?? "—"}</div>
        <div className="text-xs text-classroom-muted">{t.email}</div>
      </td>
      <td className="px-4 py-3">
        {t.organizationId ? (
          <Link to={`/admin/scholen/${t.organizationId}`} className="hover:text-primary">
            {t.organizationName}
          </Link>
        ) : schools.length ? (
          <Select onValueChange={(v) => assign(t, v)}>
            <SelectTrigger className="h-9 w-48 rounded-lg">
              <SelectValue placeholder="Koppel aan school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-classroom-muted">Geen school</span>
        )}
      </td>
      <td className="hidden px-4 py-3 tabular-nums sm:table-cell">{t.classCount}</td>
      <td className="hidden px-4 py-3 tabular-nums sm:table-cell">{t.kidCount}</td>
      <td className="hidden px-4 py-3 text-classroom-muted md:table-cell">{fmtWhen(t.lastSignInAt)}</td>
      <td className="px-2 py-3 text-right">
        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(t)} aria-label={`Rechten intrekken van ${t.firstName ?? t.email}`}>
          <UserMinus className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );

  const Table = ({ rows }: { rows: AdminTeacher[] }) => (
    <div className="tile overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-classroom-border text-left text-classroom-muted">
            <th className="px-4 py-3 font-medium">Leerkracht</th>
            <th className="px-4 py-3 font-medium">School</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Klassen</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Kids</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Laatst ingelogd</th>
            <th className="w-12 px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <Row key={t.userId} t={t} />
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <AdminLayout>
      <h1 className="mb-2 text-4xl">Leerkrachten</h1>
      <p className="mb-6 text-classroom-muted">Nieuwe leerkrachten nodig je uit vanaf de pagina van hun school.</p>

      {isLoading ? (
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      ) : (
        <div className="space-y-8">
          {unassigned.length > 0 && (
            <section>
              <h2 className="mb-1 flex items-center gap-2 text-xl">
                <AlertTriangle className="h-5 w-5 text-accent" /> Zonder school ({unassigned.length})
              </h2>
              <p className="mb-3 text-sm text-classroom-muted">
                Deze accounts werden leerkracht voordat je scholen zelf aansloot
                {looseClasses.length ? `, samen ${looseClasses.length} ${looseClasses.length === 1 ? "klas" : "klassen"}` : ""}. Koppel ze aan
                een school, of trek de rechten in.
              </p>
              <Table rows={unassigned} />
            </section>
          )}
          <section>
            <h2 className="mb-3 text-xl">Bij een school ({assigned.length})</h2>
            {assigned.length ? <Table rows={assigned} /> : <div className="tile p-6 text-sm text-classroom-muted">Nog geen leerkrachten.</div>}
          </section>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeachers;
