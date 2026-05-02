import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spark } from "@/components/Spark";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

const signupSchema = z.object({
  first_name: z.string().trim().min(1).max(40),
  age: z.coerce.number().int().min(5).max(18),
  parent_email: z.string().email().max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  class_code: z.string().trim().max(20).optional().or(z.literal("")),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(72),
});

export const Auth = () => {
  const [search] = useSearchParams();
  const initialMode = search.get("mode") === "signup" ? "signup" : "login";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const validateClassCode = async (classCode?: string) => {
    const normalizedCode = classCode?.trim().toUpperCase();
    if (!normalizedCode) return true;

    const { data, error } = await supabase.rpc("validate_class_code", { _code: normalizedCode });
    if (error) throw error;

    return Array.isArray(data) && data.length > 0;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      first_name: form.get("first_name"),
      age: form.get("age"),
      parent_email: form.get("parent_email"),
      email: form.get("email"),
      password: form.get("password"),
      class_code: form.get("class_code") ?? "",
    });
    if (!parsed.success) {
      toast({ title: "Check het formulier", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const lang = "nl" as const;
    try {
      const classCodeIsValid = await validateClassCode(parsed.data.class_code);
      if (!classCodeIsValid) {
        toast({
          title: "Ongeldige klassencode",
          description: "Controleer de code of laat je leerkracht een nieuwe delen.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          first_name: parsed.data.first_name,
          age: parsed.data.age,
          parent_email: parsed.data.parent_email,
          language: lang,
          class_code: parsed.data.class_code?.toUpperCase() || null,
        },
      },
      });

      if (error) {
        toast({ title: "Aanmelden mislukt", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: `Welkom, ${parsed.data.first_name}!` });
      navigate("/dashboard");
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
    if (!parsed.success) {
      toast({ title: "Check het formulier", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Inloggen mislukt", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/dashboard");
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-4 py-6 sm:py-10">
      <Link to="/" className="absolute top-4 left-4 text-sm font-display text-foreground/70 hover:text-foreground">← Home</Link>

      <div className="text-center mb-6 mt-8 sm:mt-0">
        <div className="scale-75 sm:scale-100 inline-block">
          <Spark size={120} mood="happy" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl mt-3">
          Welkom bij AI met Spark
        </h1>
      </div>

      <div className="w-full max-w-md bg-card rounded-3xl shadow-pop border border-border p-5 sm:p-6">
        <Tabs defaultValue={initialMode} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 rounded-full p-1 h-12">
            <TabsTrigger value="login" className="rounded-full font-display">Inloggen</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full font-display">Aanmelden</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input id="password" name="password" type="password" required className="h-12 rounded-xl" />
              </div>
              <Button type="submit" disabled={busy} className="w-full h-14 rounded-full font-display text-base shadow-soft">
                {busy ? "…" : "Inloggen"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Voornaam van het kind</Label>
                  <Input id="first_name" name="first_name" required maxLength={40} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Leeftijd</Label>
                  <Input id="age" name="age" type="number" min={5} max={18} required className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_email">E-mail van ouder <span className="text-muted-foreground text-xs">(voor het diploma)</span></Label>
                <Input id="parent_email" name="parent_email" type="email" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class_code">Klassencode <span className="text-muted-foreground text-xs">(optioneel)</span></Label>
                <Input id="class_code" name="class_code" maxLength={20} placeholder="bijv. SPARK-7K" className="h-12 rounded-xl uppercase" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Login-e-mail</Label>
                <Input id="email" name="email" type="email" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord <span className="text-muted-foreground text-xs">(8+ tekens)</span></Label>
                <Input id="password" name="password" type="password" required minLength={8} className="h-12 rounded-xl" />
              </div>
              <Button type="submit" disabled={busy} className="w-full h-14 rounded-full font-display text-base bg-primary shadow-soft">
                {busy ? "…" : "Account aanmaken"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">of</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" onClick={handleGoogle} className="w-full h-12 rounded-full font-display border-2">
          Verder met Google
        </Button>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          <Link to="/teacher/login" className="underline hover:text-foreground">Leerkracht? Log hier in →</Link>
        </p>
      </div>
    </main>
  );
};

export default Auth;
