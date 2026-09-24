import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { KeyRound, School, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Spark } from "@/components/Spark";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ROLES = ["Leerkracht", "Directie", "ICT-coördinator", "Anders"];

const schema = z.object({
  school_name: z.string().trim().min(2, "Vul de naam van je school in.").max(150),
  city: z.string().trim().min(1, "Vul de plaats in.").max(100),
  contact_name: z.string().trim().min(1, "Vul je naam in.").max(100),
  contact_role: z.string().max(60),
  contact_email: z.string().trim().email("Dat e-mailadres klopt niet.").max(255),
  class_count: z.union([z.literal(""), z.coerce.number().int().min(1).max(200)]),
  message: z.string().trim().max(1000),
});

const STEPS = [
  { icon: School, title: "Meld je school aan", desc: "Vul het formulier in. Het kost twee minuten." },
  { icon: KeyRound, title: "Je krijgt een code", desc: "We nemen contact op en sturen elke leerkracht een persoonlijke code." },
  { icon: Users, title: "Start met je klas", desc: "Maak je klas aan en deel de klassencode met je leerlingen." },
];

export const SchoolSignup = () => {
  const { toast } = useToast();
  const [role, setRole] = useState("Leerkracht");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      school_name: f.get("school_name") ?? "",
      city: f.get("city") ?? "",
      contact_name: f.get("contact_name") ?? "",
      contact_role: role,
      contact_email: f.get("contact_email") ?? "",
      class_count: f.get("class_count") ?? "",
      message: f.get("message") ?? "",
    });
    if (!parsed.success) {
      toast({ title: "Check het formulier even", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    const d = parsed.data;
    setSubmitting(true);
    const { error } = await (supabase as any).from("school_requests").insert({
      school_name: d.school_name,
      city: d.city,
      contact_name: d.contact_name,
      contact_role: d.contact_role || null,
      contact_email: d.contact_email.toLowerCase(),
      class_count: d.class_count === "" ? null : d.class_count,
      message: d.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Er ging iets mis", description: "Probeer het opnieuw.", variant: "destructive" });
      return;
    }
    setSentTo(d.contact_email);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <section className="container grid max-w-5xl gap-10 py-10 md:grid-cols-[1fr_1.1fr] md:py-16">
        <div>
          <span className="mb-4 inline-flex rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary-dark">
            Voor scholen · altijd gratis
          </span>
          <h1 className="mb-4 text-5xl leading-[0.95]">Breng AI met Spark naar je klas</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Met AI met Spark volg je als leerkracht de voortgang van je klas. Omdat je dan gegevens van kinderen ziet, sluiten we elke
            school zelf aan. Zo weten we zeker dat alleen echte leerkrachten meekijken.
          </p>
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-lg">
                    {i + 1}. {s.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success-dark" />
            <span>
              Heb je al een code gekregen?{" "}
              <Link to="/teacher/start" className="font-medium text-primary underline underline-offset-4">
                Maak hier je account aan
              </Link>
              . Al een account?{" "}
              <Link to="/teacher/login" className="font-medium text-primary underline underline-offset-4">
                Log in
              </Link>
              .
            </span>
          </p>
        </div>

        {sentTo ? (
          <div className="tile flex flex-col items-center justify-center p-8 text-center">
            <Spark size={96} mood="celebrating" />
            <h2 className="mt-4 text-3xl">Bedankt voor je aanmelding!</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              We nemen binnen een paar werkdagen contact met je op via <strong className="text-foreground">{sentTo}</strong>. Daarna krijg je
              een persoonlijke code om je klas aan te maken.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="tile space-y-4 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="school_name" className="font-display">Naam van de school</Label>
                <Input id="school_name" name="school_name" required maxLength={150} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="font-display">Plaats</Label>
                <Input id="city" name="city" required maxLength={100} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="font-display">Je naam</Label>
                <Input id="contact_name" name="contact_name" required maxLength={100} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_role" className="font-display">Je rol</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="contact_role" className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="font-display">E-mailadres van school</Label>
              <Input id="contact_email" name="contact_email" type="email" required maxLength={255} className="h-12 rounded-xl" />
              <p className="text-xs text-muted-foreground">Liefst je schooladres. Daar sturen we je persoonlijke code naartoe.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_count" className="font-display">Met hoeveel klassen wil je meedoen? (optioneel)</Label>
              <Input id="class_count" name="class_count" type="number" min={1} max={200} className="h-12 rounded-xl sm:w-32" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="font-display">Nog iets dat we moeten weten? (optioneel)</Label>
              <Textarea id="message" name="message" rows={3} maxLength={1000} className="rounded-xl" />
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Versturen…" : "Meld mijn school aan"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              We gebruiken deze gegevens alleen om contact met je op te nemen. Zie{" "}
              <Link to="/privacy" className="underline">privacy</Link>.
            </p>
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SchoolSignup;
