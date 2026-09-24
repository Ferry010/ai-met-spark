import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Mail, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { InviteDialog, fmtDate, fmtWhen } from "@/components/admin/shared";
import { useAdminActions, useSchoolRequests, type SchoolRequest } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STATUS: Record<SchoolRequest["status"], { label: string; className: string }> = {
  new: { label: "Nieuw", className: "bg-accent-soft text-accent-dark" },
  approved: { label: "Aangesloten", className: "bg-success-soft text-success-dark" },
  rejected: { label: "Afgewezen", className: "bg-muted text-classroom-muted" },
};

const AdminRequests = () => {
  const { data: requests = [], isLoading } = useSchoolRequests();
  const actions = useAdminActions();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [approving, setApproving] = useState<SchoolRequest | null>(null);
  const [inviteContact, setInviteContact] = useState(true);
  const [invite, setInvite] = useState<{ code: string; name: string; email: string; expires_at: string; school: string; orgId: string } | null>(null);

  const open = requests.filter((r) => r.status === "new");
  const handled = requests.filter((r) => r.status !== "new");

  const approve = async () => {
    if (!approving) return;
    try {
      const res = await actions.approveRequest({ requestId: approving.id, inviteContact });
      toast({ title: `${approving.school_name} is aangesloten` });
      if (res.inviteCode) {
        setInvite({
          code: res.inviteCode,
          name: approving.contact_name,
          email: approving.contact_email.toLowerCase(),
          expires_at: new Date(Date.now() + 30 * 86_400_000).toISOString(),
          school: approving.school_name,
          orgId: res.organizationId,
        });
      } else {
        navigate(`/admin/scholen/${res.organizationId}`);
      }
      setApproving(null);
    } catch (e: any) {
      toast({ title: "Dat lukte niet", description: e.message, variant: "destructive" });
    }
  };

  const reject = async (r: SchoolRequest) => {
    if (!window.confirm(`Aanvraag van ${r.school_name} afwijzen?`)) return;
    try {
      await actions.rejectRequest(r.id);
      toast({ title: "Aanvraag afgewezen" });
    } catch (e: any) {
      toast({ title: "Dat lukte niet", description: e.message, variant: "destructive" });
    }
  };

  const Card = ({ r }: { r: SchoolRequest }) => (
    <li className="tile p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl">{r.school_name}</h2>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS[r.status].className)}>{STATUS[r.status].label}</span>
          </div>
          <div className="text-classroom-muted">
            {r.city}
            {r.class_count ? ` · ongeveer ${r.class_count} ${r.class_count === 1 ? "klas" : "klassen"}` : ""} · {fmtDate(r.created_at)}
          </div>
        </div>
        {r.status === "new" ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => reject(r)} disabled={actions.busy}>
              <X className="h-4 w-4" /> Afwijzen
            </Button>
            <Button size="sm" onClick={() => { setInviteContact(true); setApproving(r); }} disabled={actions.busy}>
              <Check className="h-4 w-4" /> Aansluiten
            </Button>
          </div>
        ) : (
          r.organization_id && (
            <Button asChild variant="ghost" size="sm">
              <Link to={`/admin/scholen/${r.organization_id}`}>Naar school</Link>
            </Button>
          )
        )}
      </div>
      <div className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
        <div>
          <span className="text-classroom-muted">Contact: </span>
          {r.contact_name}
          {r.contact_role ? ` (${r.contact_role})` : ""}
        </div>
        <div>
          <a href={`mailto:${r.contact_email}`} className="inline-flex items-center gap-1 text-primary hover:underline">
            <Mail className="h-3.5 w-3.5" /> {r.contact_email}
          </a>
        </div>
      </div>
      {r.message && <p className="mt-3 rounded-xl bg-classroom-bg p-3 text-sm">{r.message}</p>}
    </li>
  );

  return (
    <AdminLayout>
      <h1 className="mb-2 text-4xl">Aanvragen</h1>
      <p className="mb-6 text-classroom-muted">
        Scholen melden zich aan via <span className="font-medium text-classroom-dark">aimetspark.nl/scholen/aanmelden</span>. Check wie het is, en sluit de school aan.
      </p>

      {isLoading ? (
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      ) : (
        <>
          {open.length === 0 ? (
            <div className="tile mb-8 p-8 text-center text-classroom-muted">Geen open aanvragen. 🎉</div>
          ) : (
            <ul className="mb-8 space-y-3">
              {open.map((r) => (
                <Card key={r.id} r={r} />
              ))}
            </ul>
          )}
          {handled.length > 0 && (
            <>
              <h2 className="mb-3 text-xl text-classroom-muted">Afgehandeld</h2>
              <ul className="space-y-3 opacity-80">
                {handled.map((r) => (
                  <Card key={r.id} r={r} />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <Dialog open={!!approving} onOpenChange={(o) => !o && setApproving(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{approving?.school_name} aansluiten?</DialogTitle>
            <DialogDescription>
              De school komt in je overzicht. Leerkrachten van deze school kunnen alleen meedoen met een persoonlijke code van jou.
            </DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-3 rounded-xl bg-classroom-bg p-4">
            <Checkbox checked={inviteContact} onCheckedChange={(v) => setInviteContact(v === true)} className="mt-0.5" />
            <span className="text-sm">
              Maak meteen een leerkracht-code voor <strong>{approving?.contact_name}</strong> ({approving?.contact_email})
            </span>
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproving(null)}>
              Annuleren
            </Button>
            <Button onClick={approve} disabled={actions.busy}>
              <Check className="h-4 w-4" /> Aansluiten
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InviteDialog
        invite={invite}
        schoolName={invite?.school ?? ""}
        onClose={() => {
          const orgId = invite?.orgId;
          setInvite(null);
          if (orgId) navigate(`/admin/scholen/${orgId}`);
        }}
      />
    </AdminLayout>
  );
};

export default AdminRequests;
