import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Mail, Send, Trash2, UserMinus, UserPlus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { InviteDialog, MissionBar, StatTile, fmtDate, fmtWhen, inviteStatus } from "@/components/admin/shared";
import {
  useAdminActions,
  useAdminClasses,
  useAdminSchools,
  useAdminTeachers,
  useSchoolInvites,
  type TeacherInvite,
} from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  open: "bg-accent-soft text-accent-dark",
  gebruikt: "bg-success-soft text-success-dark",
  verlopen: "bg-muted text-classroom-muted",
};

const AdminSchool = () => {
  const { orgId = "" } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: schools = [], isLoading } = useAdminSchools();
  const { data: teachers = [] } = useAdminTeachers();
  const { data: classes = [] } = useAdminClasses(orgId);
  const { data: invites = [] } = useSchoolInvites(orgId);
  const actions = useAdminActions();
  const [shown, setShown] = useState<TeacherInvite | null>(null);
  const [notes, setNotes] = useState("");

  const school = schools.find((s) => s.id === orgId);
  const staff = teachers.filter((t) => t.organizationId === orgId);

  useEffect(() => setNotes(school?.notes ?? ""), [school?.notes]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      </AdminLayout>
    );
  }
  if (!school) {
    return (
      <AdminLayout>
        <p className="py-16 text-center text-classroom-muted">
          Deze school bestaat niet (meer). <Link to="/admin/scholen" className="text-primary underline">Terug naar scholen</Link>
        </p>
      </AdminLayout>
    );
  }

  const fail = (e: any) => toast({ title: "Dat lukte niet", description: e.message, variant: "destructive" });

  const invite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      const inv = await actions.createInvite({ orgId, name: String(f.get("name") ?? ""), email: String(f.get("email") ?? "") });
      form.reset();
      setShown(inv);
    } catch (err) {
      fail(err);
    }
  };

  const revoke = async (i: TeacherInvite) => {
    if (!window.confirm(`Code ${i.code} intrekken? Hij werkt dan niet meer.`)) return;
    try {
      await actions.revokeInvite(i.id);
      toast({ title: "Code ingetrokken" });
    } catch (err) {
      fail(err);
    }
  };

  const removeTeacher = async (userId: string, name: string) => {
    if (!window.confirm(`${name} is dan geen leerkracht meer en ziet de klassen niet meer. De klassen en de voortgang van de kids blijven bestaan. Doorgaan?`)) return;
    try {
      await actions.removeTeacher(userId);
      toast({ title: `${name} is geen leerkracht meer` });
    } catch (err) {
      fail(err);
    }
  };

  const saveNotes = async () => {
    try {
      await actions.updateNotes({ orgId, notes });
      toast({ title: "Notitie opgeslagen" });
    } catch (err) {
      fail(err);
    }
  };

  const deleteSchool = async () => {
    const typed = window.prompt(
      `Weet je het zeker? Alle leerkrachten van ${school.name} verliezen hun leerkracht-rechten en open codes vervallen. Accounts van kids en hun voortgang blijven bestaan.\n\nTyp de naam van de school om te bevestigen:`,
    );
    if (typed?.trim() !== school.name) return;
    try {
      await actions.deleteSchool(orgId);
      toast({ title: `${school.name} verwijderd` });
      navigate("/admin/scholen");
    } catch (err) {
      fail(err);
    }
  };

  return (
    <AdminLayout>
      <Link to="/admin/scholen" className="mb-4 inline-flex items-center text-sm text-classroom-muted hover:text-primary">
        <ChevronLeft className="mr-1 h-4 w-4" /> Alle scholen
      </Link>
      <div className="mb-6">
        <h1 className="text-4xl">{school.name}</h1>
        <p className="text-classroom-muted">
          {[school.city, school.contactName].filter(Boolean).join(" · ")}
          {school.contactEmail && (
            <>
              {" · "}
              <a href={`mailto:${school.contactEmail}`} className="text-primary hover:underline">
                {school.contactEmail}
              </a>
            </>
          )}
          {" · sinds "}
          {fmtDate(school.createdAt)}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Leerkrachten" value={school.teacherCount} sub={school.openInvites ? `+${school.openInvites} uitgenodigd` : undefined} />
        <StatTile label="Klassen" value={school.classCount} />
        <StatTile label="Kids" value={school.kidCount} sub={`${school.active7d} actief deze week`} />
        <StatTile label="Gem. missies" value={`${school.avgMissions.toLocaleString("nl-NL")}/18`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="tile overflow-hidden">
            <h2 className="px-5 pt-5 text-xl">Klassen</h2>
            {classes.length === 0 ? (
              <p className="p-5 text-sm text-classroom-muted">Nog geen klassen. Leerkrachten maken die zelf aan na het inloggen.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-classroom-border text-left text-classroom-muted">
                      <th className="px-5 py-3 font-medium">Klas</th>
                      <th className="px-4 py-3 font-medium">Kids</th>
                      <th className="px-4 py-3 font-medium">Gem. missies</th>
                      <th className="hidden px-4 py-3 font-medium xl:table-cell">Alles af</th>
                      <th className="hidden px-4 py-3 font-medium xl:table-cell">Diploma's</th>
                      <th className="hidden px-4 py-3 font-medium md:table-cell lg:hidden xl:table-cell">Laatst actief</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c) => (
                      <tr key={c.id} className="border-b border-classroom-border/70 last:border-0">
                        <td className="px-5 py-3">
                          <div className="whitespace-nowrap font-semibold">{c.name}</div>
                          <div className="whitespace-nowrap text-xs text-classroom-muted">
                            {c.teacherName ?? "—"} · <span className="font-mono">{c.classCode}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 tabular-nums">{c.kidCount}</td>
                        <td className="px-4 py-3">
                          <MissionBar avg={c.avgMissions} />
                        </td>
                        <td className="hidden px-4 py-3 tabular-nums xl:table-cell">{c.finished}</td>
                        <td className="hidden px-4 py-3 tabular-nums xl:table-cell">{c.diplomas}</td>
                        <td className="hidden whitespace-nowrap px-4 py-3 text-classroom-muted md:table-cell lg:hidden xl:table-cell">{fmtWhen(c.lastActive)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="tile p-5">
            <h2 className="mb-3 text-xl">Leerkrachten</h2>
            {staff.length === 0 ? (
              <p className="text-sm text-classroom-muted">Nog niemand. Stuur een leerkracht-code om te beginnen.</p>
            ) : (
              <ul className="divide-y divide-classroom-border">
                {staff.map((t) => (
                  <li key={t.userId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <div className="font-semibold">{t.firstName ?? t.email}</div>
                      <div className="text-sm text-classroom-muted">
                        {t.email} · {t.classCount} {t.classCount === 1 ? "klas" : "klassen"} · {t.kidCount} kids · laatst ingelogd {fmtWhen(t.lastSignInAt)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeTeacher(t.userId, t.firstName ?? t.email)}>
                      <UserMinus className="h-4 w-4" /> Rechten intrekken
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="tile p-5">
            <h2 className="mb-3 text-xl">Leerkracht-codes</h2>
            {invites.length === 0 ? (
              <p className="text-sm text-classroom-muted">Nog geen codes gemaakt.</p>
            ) : (
              <ul className="divide-y divide-classroom-border">
                {invites.map((i) => {
                  const status = inviteStatus(i);
                  return (
                    <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{i.code}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLE[status])}>{status}</span>
                        </div>
                        <div className="text-sm text-classroom-muted">
                          {i.name ? `${i.name} · ` : ""}
                          {i.email} ·{" "}
                          {status === "gebruikt" ? `gebruikt ${fmtWhen(i.used_at)}` : `geldig tot ${fmtDate(i.expires_at)}`}
                        </div>
                      </div>
                      {status === "open" && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setShown(i)}>
                            <Mail className="h-4 w-4" /> Bericht
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => revoke(i)}>
                            Intrekken
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <form onSubmit={invite} className="tile space-y-4 p-5">
            <h2 className="flex items-center gap-2 text-xl">
              <UserPlus className="h-5 w-5 text-primary" /> Leerkracht uitnodigen
            </h2>
            <p className="text-sm text-classroom-muted">
              Je krijgt een persoonlijke code die 30 dagen werkt, alleen met dit e-mailadres. Die stuur je zelf door.
            </p>
            <div className="space-y-2">
              <Label htmlFor="inv-name">Naam</Label>
              <Input id="inv-name" name="name" maxLength={100} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-email">E-mailadres</Label>
              <Input id="inv-email" name="email" type="email" required maxLength={255} className="h-11 rounded-xl" />
            </div>
            <Button type="submit" className="w-full" disabled={actions.busy}>
              <Send className="h-4 w-4" /> Maak code
            </Button>
          </form>

          <div className="tile space-y-3 p-5">
            <h2 className="text-xl">Notities</h2>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={2000} className="rounded-xl" placeholder="Alleen voor jou" />
            <Button variant="outline" size="sm" onClick={saveNotes} disabled={notes === (school.notes ?? "") || actions.busy}>
              Opslaan
            </Button>
          </div>

          <div className="tile border-destructive/30 p-5">
            <h2 className="mb-1 text-xl">School verwijderen</h2>
            <p className="mb-3 text-sm text-classroom-muted">Leerkrachten verliezen hun rechten. Kids houden hun account en voortgang.</p>
            <Button variant="outline" size="sm" className="text-destructive" onClick={deleteSchool} disabled={actions.busy}>
              <Trash2 className="h-4 w-4" /> Verwijderen
            </Button>
          </div>
        </aside>
      </div>

      <InviteDialog invite={shown} schoolName={school.name} onClose={() => setShown(null)} />
    </AdminLayout>
  );
};

export default AdminSchool;
