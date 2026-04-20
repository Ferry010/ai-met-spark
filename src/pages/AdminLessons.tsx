import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ALL_LESSONS, WORLDS } from "@/content/lessons";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Spark } from "@/components/Spark";
import { Save, RotateCcw, ShieldCheck } from "lucide-react";

interface OverrideRow {
  lesson_id: string;
  title: string;
  fact: string;
  emoji: string;
}

const emptyRow = (id: string): OverrideRow => ({ lesson_id: id, title: "", fact: "", emoji: "" });

export const AdminLessons = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Record<string, OverrideRow>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("lesson_overrides").select("*");
      const map: Record<string, OverrideRow> = {};
      ALL_LESSONS.forEach((l) => (map[l.id] = emptyRow(l.id)));
      (data ?? []).forEach((o: any) => {
        map[o.lesson_id] = {
          lesson_id: o.lesson_id,
          title: o.title ?? "",
          fact: o.fact ?? "",
          emoji: o.emoji ?? "",
        };
      });
      setRows(map);
      setLoading(false);
    })();
  }, []);

  const updateField = (id: string, field: keyof OverrideRow, value: string) => {
    setRows((r) => ({ ...r, [id]: { ...r[id], [field]: value } }));
  };

  const save = async (id: string) => {
    if (!user) return;
    setSavingId(id);
    const row = rows[id];
    const payload = {
      lesson_id: id,
      title: row.title.trim() || null,
      fact: row.fact.trim() || null,
      emoji: row.emoji.trim() || null,
      updated_by: user.id,
    };
    const { error } = await supabase
      .from("lesson_overrides")
      .upsert(payload, { onConflict: "lesson_id" });
    setSavingId(null);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Opgeslagen ✨", description: `Les ${id} bijgewerkt.` });
    }
  };

  const reset = async (id: string) => {
    setSavingId(id);
    const { error } = await supabase.from("lesson_overrides").delete().eq("lesson_id", id);
    setSavingId(null);
    if (error) {
      toast({ title: "Reset mislukt", description: error.message, variant: "destructive" });
      return;
    }
    setRows((r) => ({ ...r, [id]: emptyRow(id) }));
    toast({ title: "Teruggezet", description: `Les ${id} gebruikt weer de standaardtekst.` });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Spark size={120} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-display text-3xl">Beheer lessen</h1>
            <p className="text-muted-foreground text-sm">
              Pas titel, weetje of emoji aan. Leeg laten = standaardtekst gebruiken.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {WORLDS.map((world) => (
            <section key={world.id} className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <h2 className="font-display text-xl mb-4 flex items-center gap-2">
                <span className="text-2xl">{world.emoji}</span>
                Wereld {world.id}: {world.name}
              </h2>
              <div className="space-y-6">
                {world.lessons.map((lesson) => {
                  const row = rows[lesson.id];
                  return (
                    <div key={lesson.id} className="rounded-2xl bg-muted/30 p-4 border border-border/60">
                      <div className="flex items-baseline justify-between mb-3">
                        <h3 className="font-display text-base">
                          Les {lesson.id} · standaard: <span className="text-muted-foreground">{lesson.title}</span>
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-[80px_1fr] gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`emoji-${lesson.id}`} className="text-xs">Emoji</Label>
                          <Input
                            id={`emoji-${lesson.id}`}
                            value={row.emoji}
                            onChange={(e) => updateField(lesson.id, "emoji", e.target.value)}
                            placeholder={lesson.emoji}
                            maxLength={4}
                            className="h-10 rounded-lg text-center text-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`title-${lesson.id}`} className="text-xs">Titel</Label>
                          <Input
                            id={`title-${lesson.id}`}
                            value={row.title}
                            onChange={(e) => updateField(lesson.id, "title", e.target.value)}
                            placeholder={lesson.title}
                            maxLength={120}
                            className="h-10 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <Label htmlFor={`fact-${lesson.id}`} className="text-xs">Weetje</Label>
                        <Textarea
                          id={`fact-${lesson.id}`}
                          value={row.fact}
                          onChange={(e) => updateField(lesson.id, "fact", e.target.value)}
                          placeholder={lesson.fact}
                          maxLength={400}
                          rows={2}
                          className="rounded-lg resize-none"
                        />
                      </div>
                      <div className="flex gap-2 mt-3 justify-end">
                        <Button
                          onClick={() => reset(lesson.id)}
                          variant="ghost"
                          size="sm"
                          disabled={savingId === lesson.id}
                          className="rounded-full gap-1"
                        >
                          <RotateCcw className="h-4 w-4" /> Standaard
                        </Button>
                        <Button
                          onClick={() => save(lesson.id)}
                          size="sm"
                          disabled={savingId === lesson.id}
                          className="rounded-full font-display gap-1"
                        >
                          <Save className="h-4 w-4" />
                          {savingId === lesson.id ? "…" : "Opslaan"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminLessons;
