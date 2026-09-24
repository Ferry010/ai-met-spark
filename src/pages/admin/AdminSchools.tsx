import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { InviteDialog, MissionBar, fmtDate } from "@/components/admin/shared";
import { useAdminActions, useAdminSchools, type TeacherInvite } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminSchools = () => {
  const { data: schools = [], isLoading } = useAdminSchools();
  const actions = useAdminActions();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [inviteContact, setInviteContact] = useState(true);
  const [invite, setInvite] = useState<{ invite: TeacherInvite; school: string } | null>(null);

  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const city = String(f.get("city") ?? "");
    const contactName = String(f.get("contactName") ?? "");
    const contactEmail = String(f.get("contactEmail") ?? "").trim();
    if (!name) return;
    if (inviteContact && !contactEmail) {
      toast({ title: "Vul een e-mailadres in", description: "Die heb je nodig voor de leerkracht-code.", variant: "destructive" });
      return;
    }
    try {
      const orgId = await actions.createSchool({ name, city, contactName, contactEmail });
      setAdding(false);
      toast({ title: `${name} toegevoegd` });
      if (inviteContact) {
        const inv = await actions.createInvite({ orgId, name: contactName, email: contactEmail });
        setInvite({ invite: inv, school: name });
      } else {
        navigate(`/admin/scholen/${orgId}`);
      }
    } catch (err: any) {
      toast({ title: "Dat lukte niet", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl">Scholen</h1>
          <p className="text-classroom-muted">Je ziet per school en per klas alleen totalen, geen namen van kinderen.</p>
        </div>
        <Button onClick={() => { setInviteContact(true); setAdding(true); }}>
          <Plus className="h-4 w-4" /> Nieuwe school
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      ) : schools.length === 0 ? (
        <div className="tile p-8 text-center text-classroom-muted">Nog geen scholen. Sluit er een aan via Aanvragen, of voeg er zelf een toe.</div>
      ) : (
        <div className="tile overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-classroom-border text-left text-classroom-muted">
                <th className="px-4 py-3 font-medium">School</th>
                <th className="px-4 py-3 font-medium">Leerkrachten</th>
                <th className="px-4 py-3 font-medium">Klassen</th>
                <th className="px-4 py-3 font-medium">Kids</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Gem. missies</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Actief deze week</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Sinds</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((s) => (
                <tr key={s.id} className="border-b border-classroom-border/70 last:border-0 hover:bg-classroom-bg">
                  <td className="px-4 py-3">
                    <Link to={`/admin/scholen/${s.id}`} className="font-semibold text-classroom-dark hover:text-primary">
                      {s.name}
                    </Link>
                    <div className="text-xs text-classroom-muted">{s.city ?? "—"}</div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {s.teacherCount}
                    {s.openInvites > 0 && <span className="ml-1 text-xs text-accent-dark">+{s.openInvites} uitgenodigd</span>}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{s.classCount}</td>
                  <td className="px-4 py-3 tabular-nums">{s.kidCount}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <MissionBar avg={s.avgMissions} />
                  </td>
                  <td className="hidden px-4 py-3 tabular-nums lg:table-cell">{s.active7d}</td>
                  <td className="hidden px-4 py-3 text-classroom-muted lg:table-cell">{fmtDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Nieuwe school</DialogTitle>
            <DialogDescription>Voor een school die niet via het formulier kwam, bijvoorbeeld na een gesprek.</DialogDescription>
          </DialogHeader>
          <form onSubmit={add} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Naam van de school</Label>
                <Input id="name" name="name" required maxLength={150} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Plaats</Label>
                <Input id="city" name="city" maxLength={100} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contactpersoon</Label>
                <Input id="contactName" name="contactName" maxLength={100} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">E-mailadres</Label>
                <Input id="contactEmail" name="contactEmail" type="email" maxLength={255} className="h-11 rounded-xl" />
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-xl bg-classroom-bg p-4">
              <Checkbox checked={inviteContact} onCheckedChange={(v) => setInviteContact(v === true)} className="mt-0.5" />
              <span className="text-sm">Maak meteen een leerkracht-code voor de contactpersoon</span>
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAdding(false)}>
                Annuleren
              </Button>
              <Button type="submit" disabled={actions.busy}>
                School toevoegen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <InviteDialog invite={invite?.invite ?? null} schoolName={invite?.school ?? ""} onClose={() => {
        const orgId = invite?.invite.organization_id;
        setInvite(null);
        if (orgId) navigate(`/admin/scholen/${orgId}`);
      }} />
    </AdminLayout>
  );
};

export default AdminSchools;
