import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Copy, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useClassroom } from "@/hooks/useClassroom";
import { isKidEmail } from "@/lib/kidAccounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const db = supabase as any;
const BTN = "w-full h-11 bg-classroom-teal hover:bg-classroom-teal-dark text-white rounded-lg";

const RequestLink = () => (
  <p className="mt-6 rounded-lg bg-classroom-bg p-4 text-sm text-classroom-muted">
    Nog geen code? Leerkrachten krijgen een persoonlijke code als hun school is aangesloten.{" "}
    <Link to="/scholen/aanmelden" className="font-medium text-classroom-teal hover:underline">
      Meld je school aan
    </Link>
  </p>
);

const TeacherStart = () => {
  const { user, loading, roles, refreshProfile } = useAuth();
  const { class: myClass, createFirstClass, isCreating } = useClassroom();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [busy, setBusy] = useState(false);
  const [className, setClassName] = useState("");
  const [copied, setCopied] = useState(false);

  const isTeacher = roles.includes("teacher") || roles.includes("admin");
  const fail = (title: string, description?: string) => toast({ title, description, variant: "destructive" });

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    const code = String(form.get("code") ?? "").trim().toUpperCase();
    setBusy(true);
    try {
      if (mode === "signup") {
        // Check the code first, so nobody ends up with a half-made account.
        const { data: schoolName, error: checkError } = await db.rpc("check_teacher_invite", { _code: code, _email: email });
        if (checkError) throw checkError;
        if (!schoolName) {
          fail("Deze code werkt niet", "Check de code en gebruik het e-mailadres waar de code naartoe is gestuurd. Een code werkt 30 dagen en maar één keer.");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/teacher/start`,
            data: { first_name: name, language: "nl", teacher_invite: code },
          },
        });
        if (error) {
          if (/registered|already/i.test(error.message)) {
            fail("Er is al een account met dit e-mailadres", "Log in, en vul daarna je code in.");
            setMode("login");
            return;
          }
          throw error;
        }
        if (!data.session) {
          toast({ title: "Bevestig je e-mail", description: "We hebben je een link gestuurd. Klik erop en kom hier terug om je klas te maken." });
        } else {
          toast({ title: `Welkom bij AI met Spark!`, description: `Je account hoort bij ${schoolName}.` });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      fail("Er ging iets mis", err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") ?? "").trim();
    setBusy(true);
    try {
      const { data: schoolName, error } = await db.rpc("redeem_teacher_invite", { _code: code });
      if (error) {
        fail("Deze code werkt niet", "Een code werkt alleen met het e-mailadres waar hij naartoe is gestuurd, 30 dagen lang en maar één keer.");
        return;
      }
      await refreshProfile();
      toast({ title: "Gelukt!", description: `Je account hoort nu bij ${schoolName}.` });
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!className.trim()) return;
    try {
      await createFirstClass(className.trim());
      toast({ title: "Klas aangemaakt!" });
    } catch (err: any) {
      fail("Aanmaken mislukt", err.message);
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

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="classroom-theme grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-classroom-teal text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-fraunces text-xl font-semibold text-classroom-teal">Spark voor leerkrachten</span>
        </div>

        <div className="rounded-xl border border-classroom-border bg-classroom-surface p-8">
          {loading && <div className="py-8 text-center text-classroom-muted">Laden…</div>}

          {/* Not logged in: create an account with an invite code, or log in */}
          {!user && !loading && (
            <>
              <h1 className="mb-1 font-fraunces text-2xl text-classroom-dark">{mode === "signup" ? "Maak je leerkracht-account" : "Welkom terug"}</h1>
              <p className="mb-6 text-sm text-classroom-muted">
                {mode === "signup"
                  ? "Vul de persoonlijke code in die je van ons kreeg. Altijd gratis, ook voor je hele school."
                  : "Log in om je klas te beheren."}
              </p>
              <form onSubmit={handleAuth} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="code">Je persoonlijke code</Label>
                      <Input id="code" name="code" required placeholder="LK-XXXX-XXXX" autoComplete="off" className="h-11 rounded-lg font-mono uppercase tracking-wider" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Je naam</Label>
                      <Input id="name" name="name" required maxLength={60} className="h-11 rounded-lg" />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" required className="h-11 rounded-lg" />
                  {mode === "signup" && <p className="text-xs text-classroom-muted">Het adres waar je code naartoe is gestuurd.</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Wachtwoord {mode === "signup" && <span className="text-xs text-classroom-muted">(8+ tekens)</span>}
                  </Label>
                  <Input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : 1} className="h-11 rounded-lg" />
                </div>
                <Button type="submit" disabled={busy} className={BTN}>
                  {busy ? "…" : mode === "signup" ? "Account aanmaken" : "Inloggen"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-classroom-muted">
                {mode === "signup" ? "Heb je al een account?" : "Nieuw hier?"}{" "}
                <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="font-medium text-classroom-teal hover:underline">
                  {mode === "signup" ? "Inloggen" : "Account maken met je code"}
                </button>
              </p>
              {mode === "signup" && <RequestLink />}
            </>
          )}

          {/* Logged in as a kid: this page is not for them */}
          {user && !loading && isKidEmail(user.email) && (
            <>
              <h1 className="mb-1 font-fraunces text-2xl text-classroom-dark">Je bent ingelogd als leerling</h1>
              <p className="mb-6 text-sm text-classroom-muted">Deze pagina is voor leerkrachten. Log uit om als leerkracht verder te gaan.</p>
              <div className="space-y-3">
                <Button onClick={() => navigate("/dashboard")} className={BTN}>
                  Naar mijn missies
                </Button>
                <Button variant="outline" onClick={logout} className="h-11 w-full rounded-lg">
                  Uitloggen
                </Button>
              </div>
            </>
          )}

          {/* Logged in, but not a teacher yet: link an invite code */}
          {user && !loading && !isKidEmail(user.email) && !isTeacher && (
            <>
              <h1 className="mb-1 font-fraunces text-2xl text-classroom-dark">Vul je code in</h1>
              <p className="mb-6 text-sm text-classroom-muted">
                Je account is nog niet gekoppeld aan een school. Vul de persoonlijke code in die je van ons kreeg.
              </p>
              <form onSubmit={handleRedeem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="redeem">Je persoonlijke code</Label>
                  <Input id="redeem" name="code" required placeholder="LK-XXXX-XXXX" autoComplete="off" className="h-11 rounded-lg font-mono uppercase tracking-wider" />
                  <p className="text-xs text-classroom-muted">Ingelogd als {user.email}</p>
                </div>
                <Button type="submit" disabled={busy} className={BTN}>
                  {busy ? "…" : "Koppel mijn account"}
                </Button>
              </form>
              <RequestLink />
              <button onClick={logout} className="mt-4 w-full text-center text-sm text-classroom-muted hover:underline">
                Uitloggen
              </button>
            </>
          )}

          {/* Teacher without a class: name the class */}
          {user && !loading && isTeacher && !myClass && (
            <>
              <h1 className="mb-1 font-fraunces text-2xl text-classroom-dark">Maak je klas</h1>
              <p className="mb-6 text-sm text-classroom-muted">Geef je klas een naam. Je krijgt daarna een code om met je leerlingen te delen.</p>
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
                <Button type="submit" disabled={isCreating} className={BTN}>
                  {isCreating ? "…" : "Klas aanmaken"}
                </Button>
              </form>
            </>
          )}

          {/* Class exists: show the code */}
          {user && !loading && isTeacher && myClass && (
            <>
              <h1 className="mb-1 font-fraunces text-2xl text-classroom-dark">{myClass.class_name}</h1>
              <p className="mb-6 text-sm text-classroom-muted">
                Deel deze klassencode met je leerlingen. Ze vullen die in bij het aanmelden en verschijnen dan in jouw klas.
              </p>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex-1 rounded-lg bg-classroom-bg px-4 py-3 text-center font-mono text-2xl tracking-wider text-classroom-teal">
                  {myClass.class_code}
                </div>
                <Button onClick={copyCode} variant="outline" size="icon" className="h-12 w-12 rounded-lg border-classroom-border" aria-label="Kopieer code">
                  {copied ? <Check className="h-5 w-5 text-classroom-success" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
              <Button onClick={() => navigate("/teacher")} className={`${BTN} gap-2`}>
                Naar mijn dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-classroom-muted">
          <Link to="/teacher/login" className="hover:underline">
            ← Terug
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherStart;
