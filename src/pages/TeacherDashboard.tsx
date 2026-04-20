import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Spark } from "@/components/Spark";
import { Plus, Copy, GraduationCap } from "lucide-react";

interface School { id: string; name: string; seat_count: number; }
interface ClassCode { id: string; code: string; }
interface Student {
  id: string;
  first_name: string;
  done: number;
  passed: boolean | null;
}

const randomCode = () =>
  "SPARK-" + Math.random().toString(36).slice(2, 6).toUpperCase();

export const TeacherDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [school, setSchool] = useState<School | null>(null);
  const [codes, setCodes] = useState<ClassCode[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: s } = await supabase.from("schools").select("*").eq("teacher_id", user.id).maybeSingle();
      setSchool(s as School | null);

      if (s) {
        const [{ data: cs }, { data: ps }] = await Promise.all([
          supabase.from("class_codes").select("id, code").eq("school_id", s.id),
          supabase.from("profiles").select("id, first_name").eq("school_id", s.id),
        ]);
        setCodes((cs ?? []) as ClassCode[]);

        const studentList: Student[] = [];
        for (const p of (ps ?? []) as { id: string; first_name: string }[]) {
          const [{ count }, { data: attempt }] = await Promise.all([
            supabase.from("user_progress").select("*", { count: "exact", head: true }).eq("user_id", p.id),
            supabase.from("final_test_attempts").select("passed").eq("user_id", p.id).order("attempted_at", { ascending: false }).limit(1).maybeSingle(),
          ]);
          studentList.push({ id: p.id, first_name: p.first_name, done: count ?? 0, passed: attempt?.passed ?? null });
        }
        setStudents(studentList);
      }
      setLoading(false);
    })();
  }, [user]);

  const createSchool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const seats = Number(form.get("seats") || 20);
    if (!name) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("schools")
      .insert({ name, seat_count: seats, teacher_id: user.id })
      .select()
      .maybeSingle();
    setCreating(false);
    if (error) {
      toast({ title: "Kon klas niet aanmaken", description: error.message, variant: "destructive" });
      return;
    }
    setSchool(data as School);
    toast({ title: "Klas aangemaakt!" });
  };

  const generateCode = async () => {
    if (!school) return;
    const code = randomCode();
    const { data, error } = await supabase
      .from("class_codes")
      .insert({ school_id: school.id, code })
      .select()
      .maybeSingle();
    if (error) {
      toast({ title: "Mislukt", description: error.message, variant: "destructive" });
      return;
    }
    setCodes([...(codes ?? []), data as ClassCode]);
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Gekopieerd!", description: code });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Spark size={120} />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-10 max-w-md">
          <div className="text-center mb-6">
            <Spark size={100} mood="happy" />
            <h1 className="font-display text-3xl mt-3">Welkom, {profile?.first_name}!</h1>
            <p className="text-muted-foreground">Maak je klas aan om te beginnen.</p>
          </div>
          <form onSubmit={createSchool} className="rounded-3xl bg-card border border-border shadow-soft p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam van klas / school</Label>
              <Input id="name" name="name" required maxLength={150} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Aantal plekken</Label>
              <Input id="seats" name="seats" type="number" min={1} defaultValue={20} className="h-12 rounded-xl" />
            </div>
            <Button type="submit" disabled={creating} className="w-full h-14 rounded-full font-display bg-primary shadow-soft">
              {creating ? "…" : "Klas aanmaken"}
            </Button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-display text-3xl">{school.name}</h1>
            <p className="text-muted-foreground text-sm">
              {students.length} van {school.seat_count} plekken in gebruik
            </p>
          </div>
        </div>

        <section className="rounded-3xl bg-card border border-border p-6 shadow-soft mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Klassencodes</h2>
            <Button onClick={generateCode} size="sm" className="rounded-full font-display gap-1">
              <Plus className="h-4 w-4" /> Nieuwe code
            </Button>
          </div>
          {codes.length === 0 ? (
            <p className="text-muted-foreground text-sm">Genereer een code en deel die met de kinderen.</p>
          ) : (
            <ul className="space-y-2">
              {codes.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-2 font-mono">
                  <span className="font-display text-lg">{c.code}</span>
                  <Button onClick={() => copy(c.code)} size="sm" variant="ghost" className="rounded-full">
                    <Copy className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h2 className="font-display text-xl mb-4">Leerlingen</h2>
          {students.length === 0 ? (
            <p className="text-muted-foreground">Nog geen leerlingen. Deel een klassencode om te beginnen.</p>
          ) : (
            <ul className="divide-y divide-border">
              {students.map((s) => {
                const pct = Math.round((s.done / 12) * 100);
                return (
                  <li key={s.id} className="py-3 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {s.first_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display">{s.first_name}</div>
                      <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground w-16 text-right">{s.done}/12</div>
                    <div className="text-sm w-20 text-right">
                      {s.passed === true ? <span className="text-success font-semibold">✓ Geslaagd</span> :
                       s.passed === false ? <span className="text-destructive">Opnieuw</span> :
                       <span className="text-muted-foreground">·</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;
