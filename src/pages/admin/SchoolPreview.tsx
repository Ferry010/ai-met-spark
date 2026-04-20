import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, TrendingUp } from "lucide-react";

interface ClassRow {
  name: string;
  teacher: string;
  students: number;
  progress: number; // 0-100
  diplomas: number;
}

const SCHOOL = "OBS De Regenboog";
const CLASSES: ClassRow[] = [
  { name: "Groep 6A", teacher: "Joris de Wit",   students: 26, progress: 12, diplomas: 0 },
  { name: "Groep 7A", teacher: "Marieke Jansen", students: 28, progress: 23, diplomas: 4 },
  { name: "Groep 8A", teacher: "Sandra Bos",     students: 24, progress: 67, diplomas: 14 },
];

export const SchoolPreview = () => {
  const totalStudents = CLASSES.reduce((s, c) => s + c.students, 0);
  const totalDiplomas = CLASSES.reduce((s, c) => s + c.diplomas, 0);
  const avgProgress = Math.round(CLASSES.reduce((s, c) => s + c.progress, 0) / CLASSES.length);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-5xl py-10 pb-32">
        <div className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
          School-overzicht, voorbeeld
        </div>
        <h1 className="font-display text-3xl">{SCHOOL}</h1>
        <p className="text-muted-foreground mt-1">3 klassen, {totalStudents} leerlingen totaal</p>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <StatCard Icon={Users} label="Leerlingen" value={totalStudents.toString()} />
          <StatCard Icon={TrendingUp} label="Gemiddelde voortgang" value={`${avgProgress}%`} />
          <StatCard Icon={Award} label="Diploma's behaald" value={totalDiplomas.toString()} />
        </div>

        <section className="mt-8 rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-xl">Klassen</h2>
          </div>
          <div className="divide-y divide-border">
            {CLASSES.map((c) => (
              <div key={c.name} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4">
                <div>
                  <div className="font-display text-base">{c.name}</div>
                  <div className="text-xs text-muted-foreground">Leerkracht: {c.teacher}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-display text-foreground">{c.students}</span> leerlingen
                </div>
                <div className="min-w-[140px]">
                  <div className="text-xs text-muted-foreground mb-1">Voortgang {c.progress}%</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-display text-foreground">{c.diplomas}</span> diploma's
                </div>
                <Button asChild size="sm" variant="outline" className="rounded-full font-display gap-1">
                  <Link to="/teacher">
                    Bekijk klas <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ Icon, label, value }: { Icon: typeof Users; label: string; value: string }) => (
  <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
    <div className="flex items-center gap-2 text-muted-foreground text-xs font-display uppercase tracking-wider">
      <Icon className="h-4 w-4" /> {label}
    </div>
    <div className="font-display text-3xl mt-2">{value}</div>
  </div>
);

export default SchoolPreview;
