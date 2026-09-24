import { ReactNode, useEffect, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { inviteMessage, type TeacherInvite } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export const fmtWhen = (iso: string | null) => {
  if (!iso) return "nog niet";
  const h = (Date.now() - new Date(iso).getTime()) / 3_600_000;
  if (h < 1) return "zojuist";
  if (h < 24) return `${Math.floor(h)} uur geleden`;
  const d = Math.floor(h / 24);
  return d === 1 ? "gisteren" : `${d} dagen geleden`;
};

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });

export const StatTile = ({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: string; tone?: string }) => (
  <div className="tile p-4">
    <div className="text-sm text-classroom-muted">{label}</div>
    <div className={cn("font-display text-3xl tabular-nums", tone)}>{value}</div>
    {sub && <div className="text-xs text-classroom-muted">{sub}</div>}
  </div>
);

export const MissionBar = ({ avg }: { avg: number }) => (
  <div className="flex items-center gap-2">
    <div className="h-2.5 w-24 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (avg / 18) * 100)}%` }} />
    </div>
    <span className="tabular-nums text-classroom-muted">{avg.toLocaleString("nl-NL")}/18</span>
  </div>
);

export const inviteStatus = (i: Pick<TeacherInvite, "used_at" | "expires_at">) =>
  i.used_at ? "gebruikt" : new Date(i.expires_at) < new Date() ? "verlopen" : "open";

export const useCopy = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };
  return { copied, copy };
};

/** Shows a fresh (or existing) invite with a ready-to-send message. */
export const InviteDialog = ({
  invite,
  schoolName,
  onClose,
}: {
  invite: Pick<TeacherInvite, "code" | "name" | "email" | "expires_at"> | null;
  schoolName: string;
  onClose: () => void;
}) => {
  const { copied, copy } = useCopy();
  // Keep showing the last invite while the dialog animates closed.
  const [shown, setShown] = useState(invite);
  useEffect(() => {
    if (invite) setShown(invite);
  }, [invite]);
  const message = shown ? inviteMessage(shown, schoolName) : "";
  const mailto = shown
    ? `mailto:${shown.email}?subject=${encodeURIComponent(`Je leerkracht-code voor AI met Spark`)}&body=${encodeURIComponent(message)}`
    : "#";

  return (
    <Dialog open={!!invite} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Uitnodiging voor {shown?.name || shown?.email}</DialogTitle>
          <DialogDescription>
            Stuur deze code naar {shown?.email}. De code werkt alleen met dat e-mailadres.
          </DialogDescription>
        </DialogHeader>
        {shown && (
          <>
            <button
              type="button"
              onClick={() => copy("code", shown.code)}
              className="press tile flex items-center justify-center gap-3 px-4 py-4 font-mono text-3xl tracking-widest text-primary"
            >
              {shown.code}
              {copied === "code" ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5 text-classroom-muted" />}
            </button>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-classroom-bg p-4 font-sans text-sm text-classroom-dark">{message}</pre>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={() => copy("msg", message)}>
                {copied === "msg" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Kopieer bericht
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href={mailto}>
                  <Mail className="h-4 w-4" /> Open in je mail
                </a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
