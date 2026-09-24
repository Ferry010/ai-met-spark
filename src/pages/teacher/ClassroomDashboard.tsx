import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, TrendingUp, LifeBuoy, KeyRound, Copy, Check, MoreHorizontal, Star, Plus, Eye, UserMinus } from "lucide-react";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { useClassroom, type ClassStudentRow } from "@/hooks/useClassroom";
import { WORLDS } from "@/content/missions";
import { PILLAR_THEME } from "@/lib/pillars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const fmtWhen = (iso: string | null) => {
  if (!iso) return "nog niet";
  const h = (Date.now() - new Date(iso).getTime()) / 3_600_000;
  if (h < 1) return "zojuist";
  if (h < 24) return `${Math.floor(h)} uur geleden`;
  const d = Math.floor(h / 24);
  return d === 1 ? "gisteren" : `${d} dagen geleden`;
};

const WORDS = ["zon", "kat", "raket", "wolk", "vos", "ster", "tijger", "appel", "draak", "pizza"];
const kidPassword = () =>
  `${WORDS[Math.floor(Math.random() * WORDS.length)]}-${WORDS[Math.floor(Math.random() * WORDS.length)]}-${10 + Math.floor(Math.random() * 90)}`;

const ClassroomDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const room = useClassroom();
  const { class: current, classes, students, overallPct, totalMissions, isLoading } = room;
  const [copied, setCopied] = useState(false);
  const [resetFor, setResetFor] = useState<ClassStudentRow | null>(null);
  const [removeFor, setRemoveFor] = useState<ClassStudentRow | null>(null);

  // A teacher without any class goes to onboarding.
  useEffect(() => {
    if (!isLoading && classes.length === 0 && !room.demo) navigate("/teacher/start", { replace: true });
  }, [isLoading, classes.length, room.demo, navigate]);

  if (isLoading || !current) {
    return (
      <ClassroomLayout>
        <div className="py-20 text-center text-classroom-muted">Laden…</div>
      </ClassroomLayout>
    );
  }

  const needHelp = students.filter((s) => s.attention);

  const copy = async () => {
    if (!current.class_code) return;
    try {
      await navigator.clipboard.writeText(current.class_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <ClassroomLayout>
      {room.demo && (
        <div className="mb-4 rounded-xl bg-secondary-soft px-4 py-2 text-sm text-secondary-foreground">
          Voorbeeldgegevens: je bent niet ingelogd, dit zie je alleen bij lokaal testen.
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 text-sm text-classroom-muted">Jouw klas</div>
          <div className="flex items-center gap-2">
            {classes.length > 1 ? (
              <Select value={current.school_id} onValueChange={room.selectClass}>
                <SelectTrigger className="h-12 min-w-[200px] rounded-xl border-2 font-display text-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.school_id} value={c.school_id}>
                      {c.class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <h1 className="text-4xl">{current.class_name}</h1>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link to="/teacher/class/settings">
                <Plus className="h-4 w-4" /> Klassen
              </Link>
            </Button>
          </div>
        </div>
        <button type="button" onClick={copy} className="press tile flex items-center gap-3 px-4 py-2 text-left hover:bg-muted">
          <KeyRound className="h-5 w-5 text-primary" />
          <span>
            <span className="block text-xs text-classroom-muted">Klassencode</span>
            <span className="font-mono text-xl tracking-wider text-primary">{current.class_code ?? "—"}</span>
          </span>
          {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-classroom-muted" />}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatTile icon={<Users className="h-4 w-4" />} label="Leerlingen" value={students.length} />
        <StatTile icon={<TrendingUp className="h-4 w-4" />} label="Gemiddelde voortgang" value={`${overallPct}%`} />
        <StatTile icon={<LifeBuoy className="h-4 w-4" />} label="Kan hulp gebruiken" value={needHelp.length} tone={needHelp.length ? "text-accent-dark" : undefined} />
      </div>

      {students.length === 0 ? (
        <div className="tile flex flex-col items-center p-10 text-center">
          <h2 className="mb-2 text-2xl">Nog geen leerlingen</h2>
          <p className="mb-6 max-w-md text-classroom-muted">
            Leerlingen gaan naar aimetspark.nl, kiezen <strong>Account maken</strong> en daarna <strong>Ik heb een klassencode</strong>. Deze code
            vullen ze in:
          </p>
          <div className="rounded-2xl bg-primary px-8 py-5 font-mono text-4xl tracking-widest text-primary-foreground">{current.class_code}</div>
        </div>
      ) : (
        <>
          {needHelp.length > 0 && (
            <div className="tile mb-6 p-5">
              <h2 className="mb-3 flex items-center gap-2 text-xl">
                <LifeBuoy className="h-5 w-5 text-accent" /> Kan hulp gebruiken
              </h2>
              <ul className="flex flex-wrap gap-2">
                {needHelp.map((s) => (
                  <li key={s.id} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm">
                    <span className="font-semibold">{s.firstName}</span> <span className="text-accent-dark">· {s.attention}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Tabs defaultValue="roster">
            <TabsList className="mb-4 h-11 rounded-xl">
              <TabsTrigger value="roster" className="rounded-lg px-4">Leerlingen</TabsTrigger>
              <TabsTrigger value="missions" className="rounded-lg px-4">Per missie</TabsTrigger>
            </TabsList>

            <TabsContent value="roster">
              <div className="tile overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-classroom-border text-left text-classroom-muted">
                        <th className="px-4 py-3 font-medium">Leerling</th>
                        <th className="px-4 py-3 font-medium">Voortgang</th>
                        <th className="hidden px-4 py-3 font-medium sm:table-cell">Sterren</th>
                        <th className="hidden px-4 py-3 font-medium md:table-cell">Laatst actief</th>
                        <th className="w-12 px-2 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id} className="border-b border-classroom-border/70 last:border-0">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-classroom-dark">{s.firstName}</div>
                            {s.username && <div className="text-xs text-classroom-muted">@{s.username}</div>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-28 overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${(s.done / totalMissions) * 100}%` }} />
                              </div>
                              <span className="tabular-nums text-classroom-muted">
                                {s.done}/{totalMissions}
                              </span>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-4 w-4 fill-secondary text-secondary-dark" /> {s.totalStars}
                            </span>
                          </td>
                          <td className="hidden px-4 py-3 text-classroom-muted md:table-cell">{fmtWhen(s.lastActive)}</td>
                          <td className="px-2 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted" aria-label={`Acties voor ${s.firstName}`}>
                                <MoreHorizontal className="h-5 w-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => setResetFor(s)} className="cursor-pointer">
                                  <KeyRound className="mr-2 h-4 w-4" /> Nieuw wachtwoord
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setRemoveFor(s)} className="cursor-pointer text-destructive">
                                  <UserMinus className="mr-2 h-4 w-4" /> Uit de klas halen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="missions">
              <MissionHeatmap students={students} />
            </TabsContent>
          </Tabs>
        </>
      )}

      <ResetPasswordDialog
        student={resetFor}
        onClose={() => setResetFor(null)}
        onConfirm={async (password) => {
          if (!resetFor) return false;
          try {
            await room.resetPassword({ studentId: resetFor.id, password });
            return true;
          } catch (e: any) {
            toast({ title: "Dat lukte niet", description: e.message, variant: "destructive" });
            return false;
          }
        }}
      />

      <Dialog open={!!removeFor} onOpenChange={(o) => !o && setRemoveFor(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{removeFor?.firstName} uit de klas halen?</DialogTitle>
            <DialogDescription className="text-base">
              Het account en de voortgang blijven bestaan, maar je ziet deze leerling niet meer in je klas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRemoveFor(null)}>Annuleren</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!removeFor) return;
                try {
                  await room.removeStudent(removeFor.id);
                  toast({ title: `${removeFor.firstName} is uit de klas gehaald` });
                } catch (e: any) {
                  toast({ title: "Dat lukte niet", description: e.message, variant: "destructive" });
                }
                setRemoveFor(null);
              }}
            >
              Uit de klas halen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClassroomLayout>
  );
};

const StatTile = ({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone?: string }) => (
  <div className="tile p-4">
    <div className="mb-1 flex items-center gap-2 text-sm text-classroom-muted">
      {icon} {label}
    </div>
    <div className={cn("font-display text-3xl text-classroom-dark", tone)}>{value}</div>
  </div>
);

const STAR_SHADES = ["bg-muted", "opacity-40", "opacity-70", "opacity-100"];

/** Students × missions grid: see at a glance where the class is. */
const MissionHeatmap = ({ students }: { students: ClassStudentRow[] }) => (
  <div className="tile overflow-x-auto p-4">
    <table className="border-separate border-spacing-1 text-xs">
      <thead>
        <tr>
          <th />
          {WORLDS.map((w) => (
            <th key={w.id} colSpan={w.missions.length} className="px-1 pb-1 text-left">
              <span className={cn("inline-block rounded-md px-2 py-0.5 font-display text-xs", PILLAR_THEME[w.pillar].solid)}>{w.name}</span>
            </th>
          ))}
        </tr>
        <tr>
          <th />
          {WORLDS.flatMap((w) =>
            w.missions.map((m) => (
              <th key={m.id} className="w-8 text-center font-medium text-classroom-muted">
                <Link to={`/teacher/preview/${m.id}`} title={`Bekijk missie ${m.id}: ${m.title}`} className="hover:text-primary">
                  {m.id}
                </Link>
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.id}>
            <th className="whitespace-nowrap pr-3 text-left text-sm font-semibold text-classroom-dark">{s.firstName}</th>
            {WORLDS.flatMap((w) =>
              w.missions.map((m) => {
                const stars = s.stars[m.id] ?? 0;
                return (
                  <td key={m.id} title={`${s.firstName} · ${m.id} ${m.title} · ${stars ? `${stars} ster${stars > 1 ? "ren" : ""}` : "nog niet"}`}>
                    <span className={cn("block h-7 w-8 rounded-md", stars ? cn(PILLAR_THEME[w.pillar].bar, STAR_SHADES[stars]) : "bg-muted")} />
                  </td>
                );
              }),
            )}
          </tr>
        ))}
        <tr>
          <th className="pr-3 pt-2 text-left text-xs font-medium text-classroom-muted">Klas</th>
          {WORLDS.flatMap((w) =>
            w.missions.map((m) => {
              const pct = students.length ? Math.round((students.filter((s) => s.stars[m.id]).length / students.length) * 100) : 0;
              return (
                <td key={m.id} className="pt-2 text-center text-[11px] text-classroom-muted">
                  {pct}%
                </td>
              );
            }),
          )}
        </tr>
      </tbody>
    </table>
    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-classroom-muted">
      <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded bg-muted" /> nog niet</span>
      <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded bg-primary opacity-40" /> 1 ster</span>
      <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded bg-primary opacity-70" /> 2 sterren</span>
      <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded bg-primary" /> 3 sterren</span>
      <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> klik een missienummer om hem zelf te spelen</span>
    </div>
  </div>
);

const ResetPasswordDialog = ({
  student,
  onClose,
  onConfirm,
}: {
  student: ClassStudentRow | null;
  onClose: () => void;
  onConfirm: (password: string) => Promise<boolean>;
}) => {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (student) {
      setPassword(kidPassword());
      setDone(false);
    }
  }, [student]);

  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Nieuw wachtwoord voor {student?.firstName}</DialogTitle>
          <DialogDescription className="text-base">
            {done
              ? "Klaar. Geef dit wachtwoord aan de leerling."
              : `Gebruikersnaam: ${student?.username ?? "onbekend"}. Kies een wachtwoord van minstens 6 tekens.`}
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="rounded-2xl bg-success-soft px-4 py-4 text-center">
            <div className="text-sm text-success-dark">@{student?.username}</div>
            <div className="font-mono text-2xl text-success-dark">{password}</div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl font-mono text-lg" />
            <Button variant="outline" onClick={() => setPassword(kidPassword())}>
              Ander wachtwoord
            </Button>
          </div>
        )}
        <DialogFooter>
          {done ? (
            <Button onClick={onClose}>Klaar</Button>
          ) : (
            <Button
              disabled={busy || password.length < 6}
              onClick={async () => {
                setBusy(true);
                const ok = await onConfirm(password);
                setBusy(false);
                if (ok) setDone(true);
              }}
            >
              Wachtwoord instellen
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomDashboard;
