import { Mail } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fmtDate } from "@/components/admin/shared";
import { useContactMessages } from "@/hooks/useAdmin";

const AdminMessages = () => {
  const { data: messages = [], isLoading } = useContactMessages();

  return (
    <AdminLayout>
      <h1 className="mb-2 text-4xl">Berichten</h1>
      <p className="mb-6 text-classroom-muted">Wat mensen via het contactformulier sturen.</p>
      {isLoading ? (
        <div className="py-16 text-center text-classroom-muted">Laden…</div>
      ) : messages.length === 0 ? (
        <div className="tile p-8 text-center text-classroom-muted">Nog geen berichten.</div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="tile p-5">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-semibold">{m.name}</span>
                  {m.school && m.school !== "-" && <span className="text-classroom-muted"> · {m.school}</span>}
                </div>
                <span className="text-sm text-classroom-muted">{fmtDate(m.created_at)}</span>
              </div>
              {m.message && <p className="mb-3 whitespace-pre-wrap">{m.message}</p>}
              <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <Mail className="h-3.5 w-3.5" /> {m.email}
              </a>
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;
