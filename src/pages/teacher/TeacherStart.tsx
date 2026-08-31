import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Copy, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useClassroom } from "@/hooks/useClassroom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const TeacherStart = () => {
  const { user, loading, refreshProfile } = useAuth();
  const { class: myClass, createClass, isCreating } = useClassroom();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [busy, setBusy] = useState(false);
  const [className, setClassName] = useState("");
  const [copied, setCopied] = useState(false);

  // Once a teacher already has a class, send them to the dashboard.
  useEffect(() => {
    if (myClass?.class_code) {
      // stay on this page to show the code; they click through
    }
  }, [myClass]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/teacher/start`,
            data: { first_name: name, language: "nl" },
          },
        });
        if (error) throw error;
        // Email confirmation enabled → no session yet.
        if (!data.session) {
          toast({
            title: "Bevestig je e-mail",
            description: "We hebben je een link gestuurd. Klik erop en kom hier terug om je klas te maken.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({ title: "Er ging iets mis", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!className.trim()) return;
    try {
      await createClass(className.trim());
      // The teacher role was just granted server-side — refresh so route
      // guards (which require the teacher role) see it.
      await refreshProfile();
      toast({ title: "Klas aangemaakt!" });
    } catch (err: any) {
      toast({ title: "Aanmaken mislukt", description: err.message, variant: "destructive" });
    }
  };

  const copyCode = async () => {
    if (!myClass?.class_code) return;
    try {
      await navigator.clipboard.writeText(myClass.class_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="classroom-theme min-h-screen grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="grid place-items-center h-9 w-9 rounded-lg bg-classroom-teal text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-fraunces text-xl font-semibold text-classroom-teal">AI Smart Classroom</span>
        </div>

        <div className="rounded-xl border border-classroom-border bg-classroom-surface p-8">
          {/* Step 1: not logged in — create teacher account or log in */}
          {!user && !loading && (
            <>
              <h1 className="font-fraunces text-2xl text-classroom-dark mb-1">
                {mode === "signup" ? "Begin met je klas" : "Welkom terug"}
              </h1>
              <p className="text-classroom-muted text-sm mb-6">
                {mode === "signup"
                  ? "Maak een gratis leerkracht-account. Daarna krijg je meteen een klassencode om te delen."
                  : "Log in om je klas te beheren."}
              </p>
              <form onSubmit={handleAuth} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Je naam</Label>
                    <Input id="name" name="name" required maxLength={60} className="h-11 rounded-lg" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" required className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord {mode === "signup" && <span className="text-classroom-muted text-xs">(8+ tekens)</span>}</Label>
                  <Input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : 1} className="h-11 rounded-lg" />
                </div>
                <Button type="submit" disabled={busy} className="w-full h-11 bg-classroom-teal hover:bg-classroom-teal-dark text-white rounded-lg">
                  {busy ? "…" : mode === "signup" ? "Account aanmaken" : "Inloggen"}
                </Button>
              </form>
              <p className="text-sm text-classroom-muted mt-4 text-center">
                {mode === "signup" ? "Heb je al een account?" : "Nog geen account?"}{" "}
                <button
                  onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                  className="text-classroom-teal font-medium hover:underline"
                >
                  {mode === "signup" ? "Inloggen" : "Account aanmaken"}
                </button>
              </p>
            </>
          )}

          {/* Step 2: logged in, no class yet — name the class */}
          {user && !myClass && (
            <>
              <h1 className="font-fraunces text-2xl text-classroom-dark mb-1">Maak je klas</h1>
              <p className="text-classroom-muted text-sm mb-6">
                Geef je klas een naam. Je krijgt daarna een code om met je leerlingen te delen.
              </p>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Naam van de klas</Label>
                  <Input
                    id="className"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="bijv. Groep 7A"
                    required
                    maxLength={80}
                    className="h-11 rounded-lg"
                  />
                </div>
                <Button type="submit" disabled={isCreating} className="w-full h-11 bg-classroom-teal hover:bg-classroom-teal-dark text-white rounded-lg">
                  {isCreating ? "…" : "Klas aanmaken"}
                </Button>
              </form>
            </>
          )}

          {/* Step 3: class exists — show the code */}
          {user && myClass && (
            <>
              <h1 className="font-fraunces text-2xl text-classroom-dark mb-1">{myClass.class_name}</h1>
              <p className="text-classroom-muted text-sm mb-6">
                Deel deze klassencode met je leerlingen. Ze vullen die in bij het aanmelden en verschijnen dan in jouw klas.
              </p>
              <div className="flex items-center gap-3 mb-6">
                <div className="font-mono text-2xl tracking-wider bg-classroom-bg rounded-lg px-4 py-3 text-classroom-teal flex-1 text-center">
                  {myClass.class_code}
                </div>
                <Button onClick={copyCode} variant="outline" size="icon" className="h-12 w-12 rounded-lg border-classroom-border" aria-label="Kopieer code">
                  {copied ? <Check className="h-5 w-5 text-classroom-success" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
              <Button onClick={() => navigate("/teacher")} className="w-full h-11 bg-classroom-teal hover:bg-classroom-teal-dark text-white rounded-lg gap-2">
                Naar mijn dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-classroom-muted mt-6 text-center">
          <Link to="/teacher/login" className="hover:underline">← Terug</Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherStart;
