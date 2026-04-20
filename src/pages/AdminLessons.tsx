import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  ALL_LESSONS,
  WORLDS,
  type InteractiveStep,
  type Lesson,
  type QuizQuestion,
} from "@/content/lessons";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Spark } from "@/components/Spark";
import { LessonPreviewDialog } from "@/components/admin/LessonPreviewDialog";
import {
  Save,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Eye,
  PlayCircle,
  Sparkles,
  BookOpen,
  Lightbulb,
  Layers,
  Hand,
  ListChecks,
  HelpCircle,
} from "lucide-react";

interface OverrideRow {
  lesson_id: string;
  title: string;
  emoji: string;
  sparkIntro: string;
  theoryIntro: string;
  fact: string;
  theoryDeep: string;
  interactive: string;
  summary: string;
  quiz: string;
  interactiveError?: string;
  quizError?: string;
}

const emptyRow = (id: string): OverrideRow => ({
  lesson_id: id,
  title: "",
  emoji: "",
  sparkIntro: "",
  theoryIntro: "",
  fact: "",
  theoryDeep: "",
  interactive: "",
  summary: "",
  quiz: "",
});

const stringifyJson = (value: unknown): string =>
  value == null ? "" : JSON.stringify(value, null, 2);

const linesToArray = (s: string): string[] =>
  s.split("\n").map((l) => l.trim()).filter(Boolean);

const arrayToLines = (a: string[] | null | undefined): string =>
  (a ?? []).join("\n");

export const AdminLessons = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Record<string, OverrideRow>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [walkthrough, setWalkthrough] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("lesson_overrides").select("*");
      const map: Record<string, OverrideRow> = {};
      ALL_LESSONS.forEach((l) => (map[l.id] = emptyRow(l.id)));
      (data ?? []).forEach((o: any) => {
        map[o.lesson_id] = {
          lesson_id: o.lesson_id,
          title: o.title ?? "",
          emoji: o.emoji ?? "",
          sparkIntro: "",
          theoryIntro: o.theory_intro ?? "",
          fact: o.fact ?? "",
          theoryDeep: o.theory_deep ?? "",
          interactive: stringifyJson(o.interactive),
          summary: arrayToLines(o.summary),
          quiz: stringifyJson(o.quiz),
        };
      });
      setRows(map);
      setLoading(false);
    })();
  }, []);

  const updateField = (id: string, field: keyof OverrideRow, value: string) => {
    setRows((r) => {
      const next = { ...r[id], [field]: value } as OverrideRow;
      if (field === "interactive") next.interactiveError = undefined;
      if (field === "quiz") next.quizError = undefined;
      return { ...r, [id]: next };
    });
  };

  const validateInteractive = (raw: string): InteractiveStep | null | string => {
    if (!raw.trim()) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return "Moet een JSON-object zijn.";
      if (!["multiChoice", "tapReveal", "sortBuckets"].includes(parsed.kind))
        return "kind moet 'multiChoice', 'tapReveal' of 'sortBuckets' zijn.";
      return parsed as InteractiveStep;
    } catch (e: any) {
      return `Ongeldige JSON: ${e.message}`;
    }
  };

  const validateQuiz = (raw: string): QuizQuestion[] | null | string => {
    if (!raw.trim()) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return "Quiz moet een array zijn.";
      for (const [i, q] of parsed.entries()) {
        if (typeof q?.question !== "string") return `Vraag ${i + 1}: 'question' ontbreekt.`;
        if (!Array.isArray(q?.options) || q.options.length < 2)
          return `Vraag ${i + 1}: minstens 2 'options' nodig.`;
        if (typeof q?.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length)
          return `Vraag ${i + 1}: 'correctIndex' ongeldig.`;
        if (typeof q?.why !== "string") return `Vraag ${i + 1}: 'why' ontbreekt.`;
      }
      return parsed as QuizQuestion[];
    } catch (e: any) {
      return `Ongeldige JSON: ${e.message}`;
    }
  };

  const save = async (id: string) => {
    if (!user) return;
    const row = rows[id];
    const interactiveResult = validateInteractive(row.interactive);
    const quizResult = validateQuiz(row.quiz);
    if (typeof interactiveResult === "string" || typeof quizResult === "string") {
      setRows((r) => ({
        ...r,
        [id]: {
          ...r[id],
          interactiveError: typeof interactiveResult === "string" ? interactiveResult : undefined,
          quizError: typeof quizResult === "string" ? quizResult : undefined,
        },
      }));
      toast({ title: "Opslaan geblokkeerd", description: "Controleer JSON.", variant: "destructive" });
      return;
    }
    setSavingId(id);
    const summaryArr = linesToArray(row.summary);
    const payload = {
      lesson_id: id,
      title: row.title.trim() || null,
      emoji: row.emoji.trim() || null,
      fact: row.fact.trim() || null,
      theory_intro: row.theoryIntro.trim() || null,
      theory_deep: row.theoryDeep.trim() || null,
      summary: summaryArr.length > 0 ? summaryArr : null,
      interactive: interactiveResult as any,
      quiz: quizResult as any,
      updated_by: user.id,
    };
    const { error } = await supabase
      .from("lesson_overrides")
      .upsert([payload], { onConflict: "lesson_id" });
    setSavingId(null);
    if (error) toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    else toast({ title: "Opgeslagen", description: `Les ${id} bijgewerkt.` });
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

  const loadDefault = (id: string, field: "interactive" | "quiz" | "theoryIntro" | "theoryDeep" | "summary") => {
    const lesson = ALL_LESSONS.find((l) => l.id === id);
    if (!lesson) return;
    if (field === "interactive" || field === "quiz") {
      updateField(id, field, stringifyJson(lesson[field]));
    } else if (field === "summary") {
      updateField(id, field, arrayToLines(lesson.summary));
    } else {
      updateField(id, field, (lesson as any)[field] ?? "");
    }
  };

  const openPreview = (lesson: Lesson, walk = false) => {
    setWalkthrough(walk);
    setPreviewLesson(lesson);
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
      <main className="container py-8 max-w-5xl pb-32">
        <div className="flex items-start gap-3 mb-6 flex-wrap">
          <ShieldCheck className="h-8 w-8 text-primary mt-1" />
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-3xl">Beheer lessen</h1>
            <p className="text-muted-foreground text-sm">
              Pas tekst aan of speel zelf de lessen door, niets wordt opgeslagen in preview.
            </p>
          </div>
          <Button
            onClick={() => openPreview(ALL_LESSONS[0], true)}
            className="rounded-full font-display gap-2 bg-primary shadow-pop"
          >
            <PlayCircle className="h-5 w-5" /> Doorloop alles
          </Button>
        </div>

        <div className="space-y-10">
          {WORLDS.map((world) => (
            <section
              key={world.id}
              className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
            >
              <header className="p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{world.emoji}</div>
                  <div>
                    <div className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                      Wereld {world.id}, module
                    </div>
                    <h2 className="font-display text-2xl">{world.name}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{world.tagline}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {world.lessons.length} lessen
                  </div>
                </div>
              </header>

              <div className="p-4 sm:p-6 space-y-4">
                {world.lessons.map((lesson) => {
                  const row = rows[lesson.id];
                  return (
                    <article
                      key={lesson.id}
                      className="rounded-2xl bg-background border border-border overflow-hidden"
                    >
                      <header className="p-4 flex items-start gap-3 flex-wrap border-b border-border bg-muted/20">
                        <div className="text-2xl shrink-0">{lesson.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-display text-muted-foreground">Les {lesson.id}</div>
                          <h3 className="font-display text-lg leading-tight truncate">{lesson.title}</h3>
                          {lesson.bossTest && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-secondary/30 text-secondary-foreground">
                              Baas-test
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full gap-1"
                          onClick={() => openPreview(lesson, false)}
                        >
                          <Eye className="h-4 w-4" /> Preview
                        </Button>
                      </header>

                      <div className="p-4 space-y-4">
                        {/* Basis: titel + emoji */}
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
                            <Label htmlFor={`title-${lesson.id}`} className="text-xs">Titel les</Label>
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

                        {/* 7 stappen accordion */}
                        <Accordion type="multiple" className="rounded-xl border border-border bg-muted/20">
                          {/* 1. Intro */}
                          <AccordionItem value="intro" className="border-b border-border last:border-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-display">
                              <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" /> 1. Intro (Spark zegt)
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <Textarea
                                value={row.sparkIntro}
                                onChange={(e) => updateField(lesson.id, "sparkIntro", e.target.value)}
                                placeholder={lesson.sparkIntro ?? "Spark's openingszin"}
                                rows={2}
                                className="rounded-lg resize-none"
                                disabled
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Wordt nog niet opgeslagen in deze versie. Aanpasbaar in volgende update.
                              </p>
                            </AccordionContent>
                          </AccordionItem>

                          {/* 2. Theorie deel 1 */}
                          <AccordionItem value="theoryIntro" className="border-b border-border last:border-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-display">
                              <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" /> 2. Theorie deel 1
                                {row.theoryIntro.trim() && <span className="ml-1 text-xs text-success">●</span>}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Rustige uitleg, max ~250 woorden. Leeg = sla deze stap over.</p>
                                {lesson.theoryIntro && (
                                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => loadDefault(lesson.id, "theoryIntro")}>
                                    Laad standaard
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                value={row.theoryIntro}
                                onChange={(e) => updateField(lesson.id, "theoryIntro", e.target.value)}
                                placeholder="Bijvoorbeeld: AI is software die patronen herkent. Het is geen mens, maar..."
                                rows={5}
                                className="rounded-lg resize-y"
                              />
                            </AccordionContent>
                          </AccordionItem>

                          {/* 3. Wist je dat */}
                          <AccordionItem value="fact" className="border-b border-border last:border-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-display">
                              <span className="flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-primary" /> 3. Wist je dat (kaart)
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <Textarea
                                value={row.fact}
                                onChange={(e) => updateField(lesson.id, "fact", e.target.value)}
                                placeholder={lesson.fact}
                                maxLength={400}
                                rows={3}
                                className="rounded-lg resize-none"
                              />
                            </AccordionContent>
                          </AccordionItem>

                          {/* 4. Theorie deel 2 */}
                          <AccordionItem value="theoryDeep" className="border-b border-border last:border-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-display">
                              <span className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-primary" /> 4. Theorie deel 2
                                {row.theoryDeep.trim() && <span className="ml-1 text-xs text-success">●</span>}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Verdiepende uitleg na het wist-je-dat. Leeg = sla over.</p>
                                {lesson.theoryDeep && (
                                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => loadDefault(lesson.id, "theoryDeep")}>
                                    Laad standaard
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                value={row.theoryDeep}
                                onChange={(e) => updateField(lesson.id, "theoryDeep", e.target.value)}
                                placeholder="Verdere uitleg, voorbeelden, of context."
                                rows={5}
                                className="rounded-lg resize-y"
                              />
                            </AccordionContent>
                          </AccordionItem>

                          {/* 5. Oefening */}
                          <AccordionItem value="interactive" className="border-b border-border last:border-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-display">
                              <span className="flex items-center gap-2">
                                <Hand className="h-4 w-4 text-primary" /> 5. Oefening (interactief, JSON)
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 space-y-2">
                              <div className="flex items-center justify-end">
                                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => loadDefault(lesson.id, "interactive")}>
                                  Laad standaard
                                </Button>
                              </div>
                              <Textarea
                                value={row.interactive}
                                onChange={(e) => updateField(lesson.id, "interactive", e.target.value)}
                                placeholder="Leeg = standaard."
                                rows={8}
                                className="rounded-lg font-mono text-xs"
                                spellCheck={false}
                              />
                              {row.interactiveError && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3" /> {row.interactiveError}
                                </p>
                              )}
                            </AccordionContent>
                          </AccordionItem>

                          {/* 6. Samenvatting */}
                          <AccordionItem value="summary" className="border-b border-border last:border-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-display">
                              <span className="flex items-center gap-2">
                                <ListChecks className="h-4 w-4 text-primary" /> 6. Samenvatting
                                {row.summary.trim() && <span className="ml-1 text-xs text-success">●</span>}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 space-y-2">
                              <p className="text-xs text-muted-foreground">Eén bullet per regel. Leeg = sla over.</p>
                              <Textarea
                                value={row.summary}
                                onChange={(e) => updateField(lesson.id, "summary", e.target.value)}
                                placeholder={"AI is geen tovenaar.\nAI leert van voorbeelden.\nAI kan zich vergissen."}
                                rows={5}
                                className="rounded-lg resize-y"
                              />
                            </AccordionContent>
                          </AccordionItem>

                          {/* 7. Quiz */}
                          <AccordionItem value="quiz" className="border-b-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-display">
                              <span className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-primary" /> 7. Oefenvragen (quiz, JSON-array)
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 space-y-2">
                              <div className="flex items-center justify-end">
                                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => loadDefault(lesson.id, "quiz")}>
                                  Laad standaard
                                </Button>
                              </div>
                              <Textarea
                                value={row.quiz}
                                onChange={(e) => updateField(lesson.id, "quiz", e.target.value)}
                                placeholder="Leeg = standaard."
                                rows={8}
                                className="rounded-lg font-mono text-xs"
                                spellCheck={false}
                              />
                              {row.quizError && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3" /> {row.quizError}
                                </p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <div className="flex gap-2 justify-end">
                          <Button onClick={() => reset(lesson.id)} variant="ghost" size="sm" disabled={savingId === lesson.id} className="rounded-full gap-1">
                            <RotateCcw className="h-4 w-4" /> Standaard
                          </Button>
                          <Button onClick={() => save(lesson.id)} size="sm" disabled={savingId === lesson.id} className="rounded-full font-display gap-1">
                            <Save className="h-4 w-4" /> {savingId === lesson.id ? "..." : "Opslaan"}
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <LessonPreviewDialog
        open={!!previewLesson}
        onClose={() => setPreviewLesson(null)}
        startLesson={previewLesson}
        walkthrough={walkthrough}
      />
    </div>
  );
};

export default AdminLessons;
